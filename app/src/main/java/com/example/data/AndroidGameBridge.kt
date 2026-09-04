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
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

class AndroidGameBridge(
    private val context: Context,
    private val repository: GameRepository,
    private val scope: CoroutineScope,
    private val getWebView: () -> WebView?
) {
    var onComposeLevelUpRequested: ((Int) -> Unit)? = null

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
