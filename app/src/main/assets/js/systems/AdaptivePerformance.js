/**
 * SYSTEMS - AdaptivePerformance
 * Performance Monitoring and Quality Management System.
 * - Tracks 3-second moving average FPS and frame time.
 * - Manages performance profiles: HIGH, MEDIUM, LOW, AUTO.
 * - Gracefully scales down non-critical visual effects (particle counts, blood decals, shell casings, secondary light passes)
 *   during frame drops, NEVER compromising gameplay-critical logic (player movement, attacks, telegraphs, or collisions).
 */
class AdaptivePerformanceSystem {
  constructor() {
    this.profile = 'AUTO'; // 'HIGH', 'MEDIUM', 'LOW', 'AUTO'
    this.currentQuality = 'HIGH'; // Active quality level
    
    this.frameTimes = [];
    this.sampleWindowMs = 3000; // 3-second moving average
    this.lastSampleTime = performance.now();
    this.fps = 60.0;
    this.avgFrameTimeMs = 16.7;

    // Configurable visual density limits per quality profile
    this.settings = {
      HIGH: { maxParticles: 500, maxDecals: 150, maxShells: 200, enableLighting: true, enableShadows: true },
      MEDIUM: { maxParticles: 250, maxDecals: 75, maxShells: 100, enableLighting: true, enableShadows: false },
      LOW: { maxParticles: 100, maxDecals: 30, maxShells: 40, enableLighting: false, enableShadows: false }
    };
  }

  setProfile(profile) {
    this.profile = profile;
    if (profile !== 'AUTO') {
      this.currentQuality = profile;
    }
  }

  recordFrame(now) {
    this.frameTimes.push(now);

    // Keep samples within moving average window
    while (this.frameTimes.length > 0 && now - this.frameTimes[0] > this.sampleWindowMs) {
      this.frameTimes.shift();
    }

    if (this.frameTimes.length > 5) {
      const durationSec = (now - this.frameTimes[0]) / 1000.0;
      this.fps = (this.frameTimes.length - 1) / durationSec;
      this.avgFrameTimeMs = (durationSec * 1000.0) / (this.frameTimes.length - 1);
    }

    // Auto-adjust quality in AUTO mode based on 3-second moving average
    if (this.profile === 'AUTO' && now - this.lastSampleTime > 2000) {
      this.lastSampleTime = now;
      if (this.fps < 45 && this.currentQuality === 'HIGH') {
        this.currentQuality = 'MEDIUM';
        console.warn("AdaptivePerformance: Downscaling quality to MEDIUM (FPS: " + Math.round(this.fps) + ")");
      } else if (this.fps < 32 && this.currentQuality === 'MEDIUM') {
        this.currentQuality = 'LOW';
        console.warn("AdaptivePerformance: Downscaling quality to LOW (FPS: " + Math.round(this.fps) + ")");
      } else if (this.fps > 55 && this.currentQuality === 'LOW') {
        this.currentQuality = 'MEDIUM';
      } else if (this.fps > 58 && this.currentQuality === 'MEDIUM') {
        this.currentQuality = 'HIGH';
      }
    }
  }

  getActiveSettings() {
    return this.settings[this.currentQuality] || this.settings.HIGH;
  }
}

window.adaptivePerformanceSystem = new AdaptivePerformanceSystem();
