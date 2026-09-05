package com.example.unity

import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.example.data.AppDatabase
import com.example.data.GameRepository

/**
 * Android Host Activity for Unity as a Library (UaaL).
 *
 * Manages:
 * - UnityPlayer instance lifecycle (onResume, onPause, onDestroy)
 * - Safe reflection initialization when unityLibrary is compiled
 * - Native touch and sensor routing
 */
class UnityGameActivity : ComponentActivity() {

    private var unityPlayerView: View? = null
    private var unityPlayerInstance: Any? = null
    private lateinit var bridge: UnityBridge
    private lateinit var database: AppDatabase
    private lateinit var repository: GameRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        database = AppDatabase.getDatabase(this, lifecycleScope)
        repository = GameRepository(database.gameDao())
        bridge = UnityBridge(this, repository, lifecycleScope)

        val rootLayout = FrameLayout(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(android.graphics.Color.BLACK)
        }

        try {
            // Attempt to load UnityPlayer dynamically from unityLibrary
            val unityPlayerClass = Class.forName("com.unity3d.player.UnityPlayer")
            val constructor = unityPlayerClass.getConstructor(android.content.Context::class.java)
            unityPlayerInstance = constructor.newInstance(this)

            val getViewMethod = unityPlayerClass.getMethod("getView")
            unityPlayerView = getViewMethod.invoke(unityPlayerInstance) as? View ?: (unityPlayerInstance as? View)

            if (unityPlayerView != null) {
                rootLayout.addView(
                    unityPlayerView,
                    ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                )
                Log.i(TAG, "UnityPlayer attached to UnityGameActivity successfully.")
            }
        } catch (e: ClassNotFoundException) {
            Log.w(TAG, "UnityPlayer not yet compiled in APK. Ensure :unityLibrary is linked in settings.gradle.kts")
        } catch (e: Exception) {
            Log.e(TAG, "Error instantiating UnityPlayer: ${e.message}", e)
        }

        setContentView(rootLayout)
    }

    override fun onResume() {
        super.onResume()
        invokeUnityMethod("resume")
    }

    override fun onPause() {
        super.onPause()
        invokeUnityMethod("pause")
    }

    override fun onDestroy() {
        invokeUnityMethod("destroy")
        super.onDestroy()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        try {
            val method = unityPlayerInstance?.javaClass?.getMethod("configurationChanged", Configuration::class.java)
            method?.invoke(unityPlayerInstance, newConfig)
        } catch (ignored: Exception) {}
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        try {
            val method = unityPlayerInstance?.javaClass?.getMethod("windowFocusChanged", Boolean::class.javaPrimitiveType)
            method?.invoke(unityPlayerInstance, hasFocus)
        } catch (ignored: Exception) {}
    }

    override fun dispatchTouchEvent(ev: MotionEvent?): Boolean {
        return super.dispatchTouchEvent(ev)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        try {
            val method = unityPlayerInstance?.javaClass?.getMethod("injectEvent", android.view.InputEvent::class.java)
            if (method != null && event != null) {
                return method.invoke(unityPlayerInstance, event) as? Boolean ?: super.onKeyDown(keyCode, event)
            }
        } catch (ignored: Exception) {}
        return super.onKeyDown(keyCode, event)
    }

    private fun invokeUnityMethod(methodName: String) {
        try {
            val method = unityPlayerInstance?.javaClass?.getMethod(methodName)
            method?.invoke(unityPlayerInstance)
        } catch (ignored: Exception) {}
    }

    companion object {
        private const val TAG = "UnityGameActivity"
    }
}
