package com.example.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.withFrameNanos
import kotlinx.coroutines.isActive

/**
 * High-performance Jetpack Compose GameLoop component leveraging [LaunchedEffect] and [withFrameNanos]
 * to drive 60 FPS (or display refresh rate) frame ticks for managing game state updates.
 *
 * It ensures the game loop only starts when [isInitialized] is true (i.e. when the game screen and
 * WebView bridge are fully initialized).
 *
 * @param isInitialized Controls whether the game loop is active.
 * @param onFrameUpdate Callback invoked on every display frame tick with delta time in seconds.
 */
@Composable
fun GameLoop(
    isInitialized: Boolean,
    onFrameUpdate: (dtSeconds: Float) -> Unit
) {
    if (!isInitialized) return

    LaunchedEffect(isInitialized) {
        var previousFrameTimeNanos = 0L

        while (isActive) {
            withFrameNanos { frameTimeNanos ->
                if (previousFrameTimeNanos != 0L) {
                    val deltaNanos = frameTimeNanos - previousFrameTimeNanos
                    // Convert nanoseconds to seconds, capped at 0.1s to prevent huge delta spikes during lag/pause
                    val dtSeconds = (deltaNanos / 1_000_000_000f).coerceIn(0f, 0.1f)
                    onFrameUpdate(dtSeconds)
                }
                previousFrameTimeNanos = frameTimeNanos
            }
        }
    }
}
