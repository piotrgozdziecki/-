/**
 * UI - UIManager
 * Manages DOM reference caching and throttled UI/HUD updates.
 * - Caches DOM element references on init to eliminate getElementById() in 60 FPS hot path.
 * - Throttles HUD updates to ~12 Hz.
 * - Throttles Android Bridge telemetry updates to ~4 Hz.
 */
class UIManager {
  constructor() {
    this.dom = {};
  }

  initCache() {
    this.dom = {
      badgeChar: document.getElementById('badge-char'),
      badgeSector: document.getElementById('badge-sector'),
      badgeKills: document.getElementById('badge-kills'),
      badgeTime: document.getElementById('badge-time'),
      hudXpBar: document.getElementById('hud-xp-bar'),
      hudBatteryBar: document.getElementById('hud-battery-bar'),
      hudBatteryText: document.getElementById('hud-battery-text'),
      btnDashCd: document.getElementById('dash-cd'),
      btnDetentionCd: document.getElementById('detention-cd')
    };
  }

  updateHudThrottled(player, kills, gameTime, currentSector) {
    if (!this.dom.badgeChar && document.getElementById('badge-char')) {
      this.initCache();
    }

    if (!player) return;

    // 1. Shift Time Formatting
    const totalSec = Math.floor(gameTime);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const timeStr = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;

    if (this.dom.badgeTime) this.dom.badgeTime.innerText = `SHIFT: ${timeStr}`;
    if (this.dom.badgeKills) this.dom.badgeKills.innerText = `LIKWIDACJE: ${kills}`;
    
    // 2. Battery / Health Bar
    if (this.dom.hudBatteryBar && player.maxBattery > 0) {
      const pct = Math.max(0, Math.min(100, (player.battery / player.maxBattery) * 100));
      this.dom.hudBatteryBar.style.width = `${pct}%`;
      if (this.dom.hudBatteryText) {
        this.dom.hudBatteryText.innerText = `${Math.round(player.battery)} / ${Math.round(player.maxBattery)} HP`;
      }
    }
  }

  updateTelemetryThrottled(player, kills, level, xpProgress, gameTime, currentSector) {
    if (window.AndroidBridge && typeof window.AndroidBridge.updateHudTelemetry === 'function') {
      const batteryPct = player ? (player.battery / player.maxBattery) * 100 : 100;
      const totalSec = Math.floor(gameTime);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      const shiftTimeStr = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;

      try {
        window.AndroidBridge.updateHudTelemetry(
          batteryPct,
          player ? player.maxBattery : 100,
          player ? player.battery : 100,
          "48.4V",
          level || 1,
          xpProgress || 0,
          kills || 0,
          currentSector ? `ZONE: S${currentSector.id}` : "ZONE: S1",
          shiftTimeStr,
          player && player.activeWeapon ? player.activeWeapon.name : "SKANER DS3678",
          1,
          "⚡",
          1,
          1.0,
          "CZYSTY",
          999,
          true
        );
      } catch (err) {
        // Silently handle bridge telemetry dispatch errors
      }
    }
  }
}

window.uiManager = new UIManager();
