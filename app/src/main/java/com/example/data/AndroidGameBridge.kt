package com.example.data

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.webkit.WebView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

data class HudTelemetryState(
    val batteryPct: Float = 100f,
    val maxBattery: Float = 100f,
    val currentBattery: Float = 100f,
    val voltageText: String = "48.4V",
    val level: Int = 1,
    val xpProgress: Float = 0f,
    val kills: Int = 0,
    val sector: String = "ZONE: S1",
    val shiftTime: String = "03:15",
    val weaponName: String = "SKANER ZEBRA DS3678",
    val weaponLevel: Int = 1,
    val weaponIcon: String = "⚡",
    val comboCount: Int = 1,
    val comboMultiplier: Float = 1.0f,
    val threatLevel: String = "CZYSTY",
    val threatDistance: Float = 999f,
    val isLowBattery: Boolean = false,
    val isGameActive: Boolean = true
)

class AndroidGameBridge(
    private val context: Context,
    private val repository: GameRepository,
    private val scope: CoroutineScope,
    private val getWebView: () -> WebView?
) {
    var onComposeLevelUpRequested: ((Int) -> Unit)? = null
    var onRequestSoftwareRendering: (() -> Unit)? = null

    private val _hudState = MutableStateFlow(HudTelemetryState())
    val hudState: StateFlow<HudTelemetryState> = _hudState

    @JavascriptInterface
    fun requestSoftwareRendering() {
        android.util.Log.w("AndroidBridge", "Javascript requested Software Rendering fallback.")
        scope.launch(Dispatchers.Main) {
            onRequestSoftwareRendering?.invoke()
        }
    }

    @JavascriptInterface
    fun updateHudTelemetry(
        batteryPct: Float,
        maxBattery: Float,
        currentBattery: Float,
        voltage: String,
        level: Int,
        xpProgress: Float,
        kills: Int,
        sector: String,
        shiftTime: String,
        weaponName: String,
        weaponLevel: Int,
        weaponIcon: String,
        comboCount: Int,
        comboMult: Float,
        threatLevel: String,
        threatDist: Float,
        isGameActive: Boolean
    ) {
        _hudState.value = HudTelemetryState(
            batteryPct = batteryPct,
            maxBattery = maxBattery,
            currentBattery = currentBattery,
            voltageText = if (voltage.isBlank()) "48.4V" else voltage,
            level = level,
            xpProgress = xpProgress.coerceIn(0f, 1f),
            kills = kills,
            sector = sector,
            shiftTime = shiftTime,
            weaponName = weaponName,
            weaponLevel = weaponLevel,
            weaponIcon = weaponIcon,
            comboCount = comboCount,
            comboMultiplier = comboMult,
            threatLevel = threatLevel,
            threatDistance = threatDist,
            isLowBattery = batteryPct <= 25f,
            isGameActive = isGameActive
        )
    }

    fun onFrameTick(dtSeconds: Float) {
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.onComposeFrameTick) window.onComposeFrameTick($dtSeconds);", null)
        }
    }

    fun toggleZoomInGame() {
        vibrate(30)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.toggleZoom) window.toggleZoom();", null)
        }
    }

    fun togglePauseInGame() {
        vibrate(40)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.togglePause) window.togglePause();", null)
        }
    }

    fun toggleFpsInGame() {
        vibrate(30)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.toggleFpsDetails) window.toggleFpsDetails();", null)
        }
    }

    @JavascriptInterface
    fun triggerComposeLevelUp(level: Int) {
        scope.launch(Dispatchers.Main) {
            onComposeLevelUpRequested?.invoke(level)
        }
    }

    fun applyCardInGame(cardId: String) {
        vibrate(80)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.onCardSelectedInCompose) window.onCardSelectedInCompose('$cardId');", null)
        }
    }

    fun skipLevelUpInGame() {
        vibrate(40)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.closeLevelUp) window.closeLevelUp();", null)
        }
    }

    fun setSelectedCharacterInGame(charKey: String) {
        vibrate(40)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.selectCharacter) window.selectCharacter('$charKey');", null)
        }
    }

    fun setSelectedArenaInGame(arenaKey: String) {
        vibrate(40)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.selectArena) window.selectArena('$arenaKey');", null)
        }
    }

    fun setSelectedGameModeInGame(modeKey: String) {
        vibrate(40)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.selectGameMode) window.selectGameMode('$modeKey');", null)
        }
    }

    fun buyWorkshopUpgradeInGame(upgradeKey: String, cost: Int) {
        vibrate(60)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.buyWorkshopUpgrade) window.buyWorkshopUpgrade('$upgradeKey', $cost);", null)
        }
    }

    fun startGameInWebView() {
        vibrate(100)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.startGamePlay) window.startGamePlay();", null)
        }
    }

    fun toggleAudioInGame() {
        vibrate(40)
        scope.launch(Dispatchers.Main) {
            getWebView()?.evaluateJavascript("if (window.sounds && window.sounds.toggle) window.sounds.toggle();", null)
        }
    }
    private val vibrator: Vibrator? by lazy {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }
    }

    @JavascriptInterface
    fun requestInitialData() {
        scope.launch(Dispatchers.IO) {
            repository.initAchievementsIfNeeded()
            val topScores = repository.topScores.first()
            val achievements = repository.allAchievements.first()

            val scoresArray = JSONArray()
            topScores.forEach { s ->
                val obj = JSONObject().apply {
                    put("id", s.id)
                    put("score", s.score)
                    put("kills", s.kills)
                    put("level", s.level)
                    put("survivalTimeSeconds", s.survivalTimeSeconds)
                    put("shiftTimeFormatted", s.shiftTimeFormatted)
                    put("isWin", s.isWin)
                    put("timestamp", s.timestamp)
                }
                scoresArray.put(obj)
            }

            val achArray = JSONArray()
            achievements.forEach { a ->
                val obj = JSONObject().apply {
                    put("key", a.key)
                    put("title", a.title)
                    put("description", a.description)
                    put("icon", a.icon)
                    put("isSecret", a.isSecret)
                    put("unlocked", a.unlocked)
                }
                achArray.put(obj)
            }

            val payload = JSONObject().apply {
                put("scores", scoresArray)
                put("achievements", achArray)
            }

            scope.launch(Dispatchers.Main) {
                getWebView()?.evaluateJavascript("window.onRoomDataLoaded(${payload.toString()});", null)
            }
        }
    }

    @JavascriptInterface
    fun saveGameScore(score: Int, kills: Int, level: Int, survivalSeconds: Int, shiftTime: String, isWin: Boolean) {
        scope.launch(Dispatchers.IO) {
            val entity = GameScoreEntity(
                score = score,
                kills = kills,
                level = level,
                survivalTimeSeconds = survivalSeconds,
                shiftTimeFormatted = shiftTime,
                isWin = isWin
            )
            repository.insertScore(entity)
            requestInitialData()
        }
    }

    @JavascriptInterface
    fun unlockAchievement(key: String) {
        scope.launch(Dispatchers.IO) {
            val newlyUnlocked = repository.unlockAchievement(key)
            if (newlyUnlocked) {
                requestInitialData()
            }
        }
    }

    @JavascriptInterface
    fun vibrate(durationMs: Int) {
        val ms = durationMs.toLong()
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(ms)
            }
        } catch (_: Exception) {}
    }
}
