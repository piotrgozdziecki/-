/**
 * CORE - GameLoop
 * Single active requestAnimationFrame manager.
 * Guarantees zero duplicate loop chains, protects against double initialization,
 * handles background resume, game over, pause/resume, and orchestrates decoupled update frequencies:
 * - GAMEPLAY: 60 FPS (via requestAnimationFrame + TimeManager)
 * - RENDER: requestAnimationFrame
 * - HUD: ~12 Hz throttled
 * - TELEMETRY: ~4 Hz throttled
 */
class GameLoopManager {
  constructor() {
    this.animFrameId = null;
    this.isLoopRunning = false;
    this.lastHudUpdate = 0;
    this.lastTelemetryUpdate = 0;
    this.hudUpdateInterval = 80; // ~12.5 Hz DOM HUD updates
    this.telemetryInterval = 250; // ~4 Hz Android Bridge telemetry updates
    this.boundTick = this.tick.bind(this);
  }

  start() {
    if (this.isLoopRunning) {
      console.warn("GameLoop: Loop already running. Ignoring duplicate start request.");
      return;
    }

    console.log("GameLoop: Starting single active requestAnimationFrame chain.");
    this.isLoopRunning = true;
    if (window.timeManager) window.timeManager.reset();
    
    // Ensure no orphan requestAnimationFrame is pending
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    this.animFrameId = requestAnimationFrame(this.boundTick);
  }

  stop() {
    console.log("GameLoop: Stopping active requestAnimationFrame chain.");
    this.isLoopRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  tick(now) {
    if (!this.isLoopRunning) return;

    try {
      // 1. Time Update
      if (window.timeManager) {
        window.timeManager.update(now);
      }

      const dt = window.timeManager ? window.timeManager.dt : 0.016;
      const currentState = window.gameStateManager ? window.gameStateManager.getState() : 'RUNNING';

      // 2. Gameplay & Systems Update (only if RUNNING)
      if (currentState === 'RUNNING') {
        if (typeof window.updateGameplay === 'function') {
          window.updateGameplay(dt);
        }
      }

      // 3. Render Pass
      if (typeof window.renderFrame === 'function') {
        window.renderFrame(dt);
      }

      // 4. Adaptive Performance Monitor Tick
      if (window.adaptivePerformanceSystem && typeof window.adaptivePerformanceSystem.recordFrame === 'function') {
        window.adaptivePerformanceSystem.recordFrame(now);
      }

      // 5. Throttled UI & Telemetry Updates
      if (now - this.lastHudUpdate >= this.hudUpdateInterval) {
        this.lastHudUpdate = now;
        if (typeof window.updateHudThrottled === 'function') {
          window.updateHudThrottled();
        }
      }

      if (now - this.lastTelemetryUpdate >= this.telemetryInterval) {
        this.lastTelemetryUpdate = now;
        if (typeof window.updateTelemetryThrottled === 'function') {
          window.updateTelemetryThrottled();
        }
      }

    } catch (err) {
      console.error("GameLoop Tick Error:", err);
    }

    // Schedule next frame iff loop is still running
    if (this.isLoopRunning) {
      this.animFrameId = requestAnimationFrame(this.boundTick);
    }
  }
}

window.gameLoopManager = new GameLoopManager();
