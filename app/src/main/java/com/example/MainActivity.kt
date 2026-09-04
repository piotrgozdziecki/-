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
import androidx.lifecycle.lifecycleScope
import com.example.data.AndroidGameBridge
import com.example.data.AppDatabase
import com.example.data.GameRepository
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

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      window.attributes.layoutInDisplayCutoutMode =
        WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
    }

    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        var showIntroScreen by remember { mutableStateOf(true) }
        var isWebViewLoaded by remember { mutableStateOf(false) }
        var showCardSelectionScreen by remember { mutableStateOf(false) }
        var currentLevelForCards by remember { mutableIntStateOf(1) }
        
        val bridgeRef = bridgeState.value

        Box(
          modifier = Modifier.fillMaxSize()
        ) {
          // Background Game Engine (WebView)
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
  val lifecycleOwner = androidx.lifecycle.compose.LocalLifecycleOwner.current

  AndroidView(
    modifier = modifier.fillMaxSize(),
    factory = { ctx ->
      WebView(ctx).apply {
        layoutParams = ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )
        setBackgroundColor(android.graphics.Color.parseColor("#030712"))
        isVerticalScrollBarEnabled = false
        isHorizontalScrollBarEnabled = false
        overScrollMode = View.OVER_SCROLL_NEVER

        settings.apply {
          javaScriptEnabled = true
          domStorageEnabled = true
          allowFileAccess = true
          useWideViewPort = true
          loadWithOverviewMode = true
          textZoom = 100
          cacheMode = WebSettings.LOAD_NO_CACHE
          setSupportZoom(false)
          builtInZoomControls = false
          displayZoomControls = false
        }
        
        // Akceleracja sprzętowa dla płynnego renderowania Canvas 60/120fps na ekranach OLED (Snapdragon/MediaTek)
 
        if (repository != null) {
          val bridge = AndroidGameBridge(
            context = context,
            repository = repository,
            scope = lifecycleOwner.lifecycleScope,
            getWebView = { this }
          )
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

