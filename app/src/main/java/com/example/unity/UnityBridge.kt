package com.example.unity

import android.content.Context
import android.util.Log
import com.example.data.GameRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.lang.reflect.Method

/**
 * High-performance Bi-Directional Bridge between Android (Kotlin/Compose/Room)
 * and Unity Engine (C# UaaL - Unity as a Library).
 *
 * Supports:
 * - Dynamic Unity message dispatching (UnitySendMessage)
 * - Vehicle telemetry & physics state sync
 * - Combat stats & horde events
 * - Persistent Room database synchronization
 */
class UnityBridge(
    private val context: Context,
    private val repository: GameRepository,
    private val scope: CoroutineScope
) {
    private val _isUnityInitialized = MutableStateFlow(false)
    val isUnityInitialized: StateFlow<Boolean> = _isUnityInitialized.asStateFlow()

    private val _vehicleTelemetry = MutableStateFlow(VehicleTelemetry())
    val vehicleTelemetry: StateFlow<VehicleTelemetry> = _vehicleTelemetry.asStateFlow()

    private val _gameStats = MutableStateFlow(UnityGameStats())
    val gameStats: StateFlow<UnityGameStats> = _gameStats.asStateFlow()

    // Callbacks for Compose UI overlays (Level-up modal, Pause, Game Over)
    var onLevelUpRequested: ((level: Int, availablePerksJson: String) -> Unit)? = null
    var onGameOver: ((finalScore: Int, timeSurvivedSeconds: Int) -> Unit)? = null
    var onBossSpawned: ((bossName: String, bossMaxHp: Int) -> Unit)? = null

    init {
        currentInstance = this
    }

    /**
     * Sends a command or payload to a Unity GameObject with a MonoBehaviour script.
     * Uses reflection to invoke UnityPlayer.UnitySendMessage safely without hard compile-time dependency on unity-classes.jar.
     */
    fun sendToUnity(gameObject: String, methodName: String, message: String = "") {
        try {
            val unityPlayerClass = Class.forName("com.unity3d.player.UnityPlayer")
            val sendMessageMethod: Method = unityPlayerClass.getMethod(
                "UnitySendMessage",
                String::class.java,
                String::class.java,
                String::class.java
            )
            sendMessageMethod.invoke(null, gameObject, methodName, message)
            Log.d(TAG, "Sent to Unity -> [$gameObject.$methodName]: $message")
        } catch (e: ClassNotFoundException) {
            Log.w(TAG, "UnityPlayer class not found. Ensure unityLibrary is exported and linked. Mocking action: $methodName")
        } catch (e: Exception) {
            Log.e(TAG, "Error invoking UnitySendMessage: ${e.message}", e)
        }
    }

    // --- Control Commands for the Toyota BT Vehicle ---

    fun sendVehicleSteering(steerInput: Float, throttleInput: Float, handbrake: Boolean) {
        val payload = "{\"steer\":$steerInput,\"throttle\":$throttleInput,\"brake\":$handbrake}"
        sendToUnity("ToyotaBTVehicle", "OnDriveInput", payload)
    }

    fun triggerVehicleDash() {
        sendToUnity("ToyotaBTVehicle", "OnDashTriggered", "")
    }

    fun selectPerkUpgrade(perkId: String) {
        sendToUnity("GameManager", "OnPerkSelected", perkId)
    }

    fun setArenaSector(sectorId: String) {
        sendToUnity("WarehouseArenaManager", "LoadSector", sectorId)
    }

    companion object {
        private const val TAG = "UnityBridge"
        private var currentInstance: UnityBridge? = null

        /**
         * Static JNI methods called directly from C# via AndroidJavaClass("com.example.unity.UnityBridge").
         */
        @JvmStatic
        fun onUnityReady() {
            Log.i(TAG, "Unity Engine initialized successfully and ready for rendering.")
            currentInstance?._isUnityInitialized?.value = true
        }

        @JvmStatic
        fun onVehicleTelemetryUpdate(speedKmh: Float, batteryLevel: Float, rpm: Float, slipAngle: Float) {
            currentInstance?.let { bridge ->
                bridge._vehicleTelemetry.value = VehicleTelemetry(
                    speedKmh = speedKmh,
                    batteryLevel = batteryLevel,
                    rpm = rpm,
                    slipAngle = slipAngle
                )
            }
        }

        @JvmStatic
        fun onCombatStatsUpdate(score: Int, kills: Int, scrapCoins: Int, xp: Int, level: Int) {
            currentInstance?.let { bridge ->
                bridge._gameStats.value = UnityGameStats(
                    score = score,
                    kills = kills,
                    scrapCoins = scrapCoins,
                    currentXp = xp,
                    currentLevel = level
                )
            }
        }

        @JvmStatic
        fun onLevelUpTriggered(newLevel: Int, perksJson: String) {
            Log.d(TAG, "Unity triggered Level Up to Level $newLevel")
            currentInstance?.onLevelUpRequested?.invoke(newLevel, perksJson)
        }

        @JvmStatic
        fun onBossEncounter(bossName: String, maxHp: Int) {
            Log.d(TAG, "Unity spawned Boss: $bossName (HP: $maxHp)")
            currentInstance?.onBossSpawned?.invoke(bossName, maxHp)
        }

        @JvmStatic
        fun onPlayerDied(finalScore: Int, timeSurvived: Int, coinsCollected: Int) {
            Log.i(TAG, "Game Over from Unity. Score: $finalScore, Time: ${timeSurvived}s, Coins: $coinsCollected")
            currentInstance?.let { bridge ->
                bridge.scope.launch(Dispatchers.IO) {
                    val minutes = timeSurvived / 60
                    val seconds = timeSurvived % 60
                    val formattedTime = String.format("%02d:%02d", minutes, seconds)
                    
                    bridge.repository.insertScore(
                        com.example.data.GameScoreEntity(
                            score = finalScore,
                            kills = bridge.gameStats.value.kills,
                            level = bridge.gameStats.value.currentLevel,
                            survivalTimeSeconds = timeSurvived,
                            shiftTimeFormatted = formattedTime,
                            isWin = false
                        )
                    )
                }
                bridge.onGameOver?.invoke(finalScore, timeSurvived)
            }
        }
    }
}

data class VehicleTelemetry(
    val speedKmh: Float = 0f,
    val batteryLevel: Float = 100f,
    val rpm: Float = 0f,
    val slipAngle: Float = 0f
)

data class UnityGameStats(
    val score: Int = 0,
    val kills: Int = 0,
    val scrapCoins: Int = 0,
    val currentXp: Int = 0,
    val currentLevel: Int = 1
)
