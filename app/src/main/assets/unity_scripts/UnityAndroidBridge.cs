using UnityEngine;
using System;

namespace DTAGraniczna
{
    /// <summary>
    /// C# bridge to call static JNI methods on com.example.unity.UnityBridge in Android Kotlin.
    /// </summary>
    public static class UnityAndroidBridge
    {
        private const string BRIDGE_CLASS_NAME = "com.example.unity.UnityBridge";
        private static AndroidJavaClass bridgeClass;

        static UnityAndroidBridge()
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            try
            {
                bridgeClass = new AndroidJavaClass(BRIDGE_CLASS_NAME);
            }
            catch (Exception e)
            {
                Debug.LogWarning($"Could not load Android bridge class: {e.Message}");
            }
            #endif
        }

        public static void NotifyReady()
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            bridgeClass?.CallStatic("onUnityReady");
            #else
            Debug.Log("[UnityBridge] Unity Ready triggered (Editor Mock)");
            #endif
        }

        public static void SendVehicleTelemetry(float speedKmh, float batteryLevel, float rpm, float slipAngle)
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            bridgeClass?.CallStatic("onVehicleTelemetryUpdate", speedKmh, batteryLevel, rpm, slipAngle);
            #endif
        }

        public static void SendCombatStats(int score, int kills, int scrapCoins, int xp, int level)
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            bridgeClass?.CallStatic("onCombatStatsUpdate", score, kills, scrapCoins, xp, level);
            #else
            Debug.Log($"[UnityBridge] Combat Stats: Score={score}, Kills={kills}, Level={level}");
            #endif
        }

        public static void TriggerLevelUp(int newLevel, string perksJson)
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            bridgeClass?.CallStatic("onLevelUpTriggered", newLevel, perksJson);
            #else
            Debug.Log($"[UnityBridge] Level Up triggered: Level {newLevel}, Perks: {perksJson}");
            #endif
        }

        public static void NotifyPlayerDied(int finalScore, int timeSurvived, int coinsCollected)
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            bridgeClass?.CallStatic("onPlayerDied", finalScore, timeSurvived, coinsCollected);
            #else
            Debug.Log($"[UnityBridge] Player Died: Score={finalScore}, Time={timeSurvived}s");
            #endif
        }
    }
}
