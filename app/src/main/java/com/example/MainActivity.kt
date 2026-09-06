package com.example

import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.lifecycleScope
import com.example.data.AndroidGameBridge
import com.example.data.AppDatabase
import com.example.data.GameRepository
import com.example.ui.ForkliftHudComposeOverlay
import com.example.ui.IntroComposeScreen
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  private lateinit var database: AppDatabase
  private lateinit var repository: GameRepository
  private var webViewRef: WebView? = null
  private var bridgeState = mutableStateOf<AndroidGameBridge?>(null)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    database = AppDatabase.getDatabase(this, lifecycleScope)
    repository = GameRepository(database.gameDao())

    try {
      if (!java.io.File("/dev/dri/renderD128").exists()) {
        android.system.Os.setenv("LIBGL_ALWAYS_SOFTWARE", "1", true)
      }
    } catch (_: Exception) {}

    // Proactively initialize WebView cache directory structure to prevent Chromium file enumerator errors
    try {
      val cacheBase = java.io.File(cacheDir, "WebView/Default/HTTP Cache")
      val jsDir = java.io.File(cacheBase, "Code Cache/js")
      val wasmDir = java.io.File(cacheBase, "Code Cache/wasm")
      val indexDir = java.io.File(cacheBase, "index-dir")
      if (!jsDir.exists()) jsDir.mkdirs()
      if (!wasmDir.exists()) wasmDir.mkdirs()
      if (!indexDir.exists()) indexDir.mkdirs()
    } catch (e: Exception) {
      android.util.Log.w("MainActivity", "Failed creating WebView cache directories: ${e.message}")
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      window.attributes.layoutInDisplayCutoutMode =
        WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
    }

    // Poco F6 / Snapdragon 8s Gen 3 Ultra-High 120Hz Refresh Rate Setup on physical hardware
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      try {
        val hasDri = java.io.File("/dev/dri/renderD128").exists()
        if (hasDri) {
          window.attributes.preferredRefreshRate = 120f
        }
      } catch (_: Exception) {}
    }

    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        var showIntroScreen by remember { mutableStateOf(true) }
        var isWebViewLoaded by remember { mutableStateOf(false) }
        var showCardSelectionScreen by remember { mutableStateOf(false) }
        var currentLevelForCards by remember { mutableIntStateOf(1) }
        
        val bridgeRef = bridgeState.value

        androidx.activity.compose.BackHandler(enabled = true) {
          if (showCardSelectionScreen) {
            bridgeRef?.skipLevelUpInGame()
            showCardSelectionScreen = false
          } else if (!showIntroScreen) {
            bridgeRef?.togglePauseInGame()
          }
        }

        Box(
          modifier = Modifier.fillMaxSize()
        ) {
          // Background Game Engine (WebView / 3D Engine Surface)
          GameWebView(
            repository = repository,
            onWebViewCreated = { webView ->
              webViewRef = webView
            },
            onBridgeCreated = { bridge ->
              bridgeState.value = bridge
              bridge.onComposeLevelUpRequested = { level ->
                currentLevelForCards = level
                showCardSelectionScreen = true
              }
            },
            onPageFinished = {
              isWebViewLoaded = true
            }
          )

          // High-Fidelity Compose Forklift HUD Overlay (Toyota BT Reflex 48V, XP Bar, Weapon Deck)
          ForkliftHudComposeOverlay(
            bridge = bridgeRef,
            isVisible = !showIntroScreen && !showCardSelectionScreen
          )

          // 60 FPS Compose Game Loop Component driven by LaunchedEffect and withFrameNanos
          com.example.ui.GameLoop(
            isInitialized = isWebViewLoaded && !showIntroScreen && bridgeRef != null,
            onFrameUpdate = { dtSeconds ->
              bridgeRef?.onFrameTick(dtSeconds)
            }
          )

          // Compose Level-Up Card Selection Overlay
          if (showCardSelectionScreen) {
            com.example.ui.CardSelectionComposeScreen(
              currentLevel = currentLevelForCards,
              onCardSelected = { selectedCard ->
                bridgeRef?.applyCardInGame(selectedCard.id)
                showCardSelectionScreen = false
              },
              onClose = {
                bridgeRef?.skipLevelUpInGame()
                showCardSelectionScreen = false
              }
            )
          }

          // High-Impact Jetpack Compose Intro Screen
          if (showIntroScreen) {
            IntroComposeScreen(
              bridge = bridgeRef,
              isWebViewLoaded = isWebViewLoaded,
              onStartGame = {
                android.util.Log.d("MainActivity", "Start Game clicked. Bridge ready: ${bridgeRef != null}")
                bridgeRef?.startGameInWebView()
                showIntroScreen = false
              }
            )
          }
        }
      }
    }
  }

  override fun onPause() {
    super.onPause()
    webViewRef?.let { webView ->
      webView.onPause()
      webView.pauseTimers()
      webView.evaluateJavascript("if (window.onAndroidAppPause) window.onAndroidAppPause();", null)
    }
  }

  override fun onResume() {
    super.onResume()
    webViewRef?.let { webView ->
      webView.onResume()
      webView.resumeTimers()
      webView.evaluateJavascript("if (window.onAndroidAppResume) window.onAndroidAppResume();", null)
    }
  }

  override fun onStop() {
    super.onStop()
    webViewRef?.let { webView ->
      webView.pauseTimers()
    }
  }

  override fun onStart() {
    super.onStart()
    webViewRef?.let { webView ->
      webView.resumeTimers()
    }
  }

  override fun onDestroy() {
    webViewRef?.let { webView ->
      webView.stopLoading()
      webView.removeJavascriptInterface("AndroidBridge")
      (webView.parent as? ViewGroup)?.removeView(webView)
      webView.destroy()
    }
    webViewRef = null
    super.onDestroy()
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun GameWebView(
  modifier: Modifier = Modifier,
  repository: GameRepository? = null,
  onWebViewCreated: ((WebView) -> Unit)? = null,
  onBridgeCreated: ((AndroidGameBridge) -> Unit)? = null,
  onPageFinished: (() -> Unit)? = null
) {
  val context = androidx.compose.ui.platform.LocalContext.current
  val lifecycleOwner = LocalLifecycleOwner.current
  var activeWebView by remember { mutableStateOf<WebView?>(null) }

  DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, event ->
      when (event) {
        Lifecycle.Event.ON_PAUSE -> {
          activeWebView?.let { wv ->
            wv.onPause()
            wv.pauseTimers()
            wv.evaluateJavascript("if (window.onAndroidAppPause) window.onAndroidAppPause();", null)
          }
        }
        Lifecycle.Event.ON_RESUME -> {
          activeWebView?.let { wv ->
            wv.onResume()
            wv.resumeTimers()
            wv.evaluateJavascript("if (window.onAndroidAppResume) window.onAndroidAppResume();", null)
          }
        }
        Lifecycle.Event.ON_DESTROY -> {
          activeWebView?.let { wv ->
            wv.stopLoading()
            wv.removeJavascriptInterface("AndroidBridge")
            (wv.parent as? ViewGroup)?.removeView(wv)
            wv.destroy()
          }
          activeWebView = null
        }
        else -> {}
      }
    }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose {
      lifecycleOwner.lifecycle.removeObserver(observer)
    }
  }

  AndroidView(
    modifier = modifier.fillMaxSize(),
    factory = { ctx ->
      try {
        val codeCacheDir = java.io.File(ctx.cacheDir, "WebView/Default/HTTP Cache/Code Cache/js")
        if (!codeCacheDir.exists()) {
          codeCacheDir.mkdirs()
        }
        val wasmCacheDir = java.io.File(ctx.cacheDir, "WebView/Default/HTTP Cache/Code Cache/wasm")
        if (!wasmCacheDir.exists()) {
          wasmCacheDir.mkdirs()
        }
      } catch (e: Exception) {
        android.util.Log.w("MainActivity", "Failed creating WebView cache directories: ${e.message}")
      }

      var crashCount = 0
      val isEmulator = Build.FINGERPRINT.startsWith("generic") ||
          Build.FINGERPRINT.startsWith("unknown") ||
          Build.FINGERPRINT.contains("vbox") ||
          Build.FINGERPRINT.contains("test-keys") ||
          Build.MODEL.contains("google_sdk") ||
          Build.MODEL.contains("Emulator") ||
          Build.MODEL.contains("Android SDK built for x86") ||
          Build.HARDWARE.contains("goldfish") ||
          Build.HARDWARE.contains("ranchu") ||
          Build.HARDWARE.contains("cutf") ||
          Build.PRODUCT.contains("sdk") ||
          Build.PRODUCT.contains("google_sdk") ||
          Build.PRODUCT.contains("emulator") ||
          Build.BOARD.contains("goldfish") ||
          Build.MANUFACTURER.contains("Genymotion")

      val hasRenderNode = try {
        java.io.File("/dev/dri/renderD128").exists()
      } catch (_: Exception) {
        false
      }

      WebView(ctx).apply {
        activeWebView = this
        layoutParams = ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )
        
        // In virtualized/emulator environments without /dev/dri/renderD128,
        // use LAYER_TYPE_SOFTWARE to prevent Mesa from failing to open nonexistent rendernodes.
        // On physical devices with GPU rendernodes, LAYER_TYPE_NONE allows full hardware acceleration.
        if (isEmulator || !hasRenderNode) {
          setLayerType(View.LAYER_TYPE_SOFTWARE, null)
        } else {
          setLayerType(View.LAYER_TYPE_NONE, null)
        }

        setBackgroundColor(android.graphics.Color.parseColor("#030712"))
        isVerticalScrollBarEnabled = false
        isHorizontalScrollBarEnabled = false
        overScrollMode = View.OVER_SCROLL_NEVER

        settings.apply {
          javaScriptEnabled = true
          domStorageEnabled = true
          databaseEnabled = true
          allowFileAccess = true
          allowContentAccess = true
          useWideViewPort = true
          loadWithOverviewMode = true
          textZoom = 100
          cacheMode = WebSettings.LOAD_NO_CACHE
          setSupportZoom(false)
          builtInZoomControls = false
          displayZoomControls = false
          mediaPlaybackRequiresUserGesture = false
          @Suppress("DEPRECATION")
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
          }
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
          }
        }

        if (repository != null) {
          val bridge = AndroidGameBridge(
            context = context,
            repository = repository,
            scope = lifecycleOwner.lifecycleScope,
            getWebView = { this }
          )
          bridge.onRequestSoftwareRendering = {
            android.util.Log.e("WebViewRender", "Manual SOFTWARE rendering fallback triggered via Bridge.")
            setLayerType(View.LAYER_TYPE_SOFTWARE, null)
          }
          addJavascriptInterface(bridge, "AndroidBridge")
          onBridgeCreated?.invoke(bridge)
        }

        webViewClient = object : WebViewClient() {
          override fun onPageFinished(view: WebView?, url: String?) {
            super.onPageFinished(view, url)
            view?.evaluateJavascript("if (window.onAndroidReady) window.onAndroidReady();", null)
            onPageFinished?.invoke()
          }

          override fun onReceivedError(
            view: WebView?,
            request: android.webkit.WebResourceRequest?,
            error: android.webkit.WebResourceError?
          ) {
            super.onReceivedError(view, request, error)
            android.util.Log.e("WebViewError", "Error loading ${request?.url}: ${error?.description} (${error?.errorCode})")
          }

          override fun onRenderProcessGone(
            view: WebView?,
            detail: android.webkit.RenderProcessGoneDetail?
          ): Boolean {
            crashCount++
            val didCrash = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
              detail?.didCrash() == true
            } else {
              true
            }
            android.util.Log.w("WebViewRender", "Render process gone. didCrash=$didCrash, crashCount=$crashCount")
            
            if (crashCount >= 2) {
              android.util.Log.e("WebViewRender", "Repeated WebView crashes detected. Falling back to SOFTWARE rendering.")
              view?.setLayerType(View.LAYER_TYPE_SOFTWARE, null)
            }
            
            view?.loadUrl("file:///android_asset/game.html")
            return true
          }
        }
        webChromeClient = object : WebChromeClient() {
          override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
            android.util.Log.d("WebViewConsole", "[${consoleMessage?.messageLevel()}] ${consoleMessage?.message()} -- From line ${consoleMessage?.lineNumber()} of ${consoleMessage?.sourceId()}")
            return true
          }
          override fun onProgressChanged(view: WebView?, newProgress: Int) {
            android.util.Log.d("WebViewProgress", "Loading progress: $newProgress%")
          }
        }

        loadUrl("file:///android_asset/game.html")
        onWebViewCreated?.invoke(this)
      }
    }
  )
}

