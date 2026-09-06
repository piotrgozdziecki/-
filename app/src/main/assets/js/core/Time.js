/**
 * CORE - Time
 * Time Manager handling delta time calculation, max delta clamping (prevents simulation jumps),
 * time scaling (bullet time / slow-mo), and unscaled game clocks.
 */
class TimeManager {
  constructor() {
    this.lastTime = 0;
    this.rawDt = 0;
    this.dt = 0;
    this.timeScale = 1.0;
    this.maxDt = 0.05; // Max 50ms clamp to protect against background resume jumps
    this.gameTime = 0;
    this.sectorTime = 0;
    this.realTime = 0;
  }

  reset() {
    this.lastTime = performance.now();
    this.rawDt = 0;
    this.dt = 0;
    this.timeScale = 1.0;
    this.gameTime = 0;
    this.sectorTime = 0;
    this.realTime = performance.now();
  }

  update(now) {
    if (!this.lastTime) {
      this.lastTime = now;
    }
    const elapsedSeconds = (now - this.lastTime) / 1000.0;
    this.lastTime = now;

    // Clamp raw delta time to prevent simulation explosion on lag spikes or app resume
    this.rawDt = Math.min(this.maxDt, Math.max(0, elapsedSeconds));
    
    // Smoothly recover timeScale back to 1.0 if modified (e.g. slow-mo recovery)
    if (this.timeScale < 1.0) {
      this.timeScale = Math.min(1.0, this.timeScale + this.rawDt * 0.85);
    }

    this.dt = this.rawDt * this.timeScale;
    this.gameTime += this.dt;
    this.sectorTime += this.dt;
    this.realTime += this.rawDt;
  }

  setTimeScale(scale) {
    this.timeScale = Math.max(0.01, scale);
  }
}

window.timeManager = new TimeManager();
