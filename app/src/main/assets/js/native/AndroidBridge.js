/**
 * NATIVE - AndroidBridge
 * Interface between JS Game Engine and Native Android Kotlin AndroidGameBridge.
 */
class NativeAndroidBridge {
  constructor() {
    this.native = window.AndroidBridge || null;
  }

  isAvailable() {
    return window.AndroidBridge !== undefined && window.AndroidBridge !== null;
  }

  vibrate(ms = 30) {
    if (this.isAvailable() && typeof window.AndroidBridge.vibrate === 'function') {
      try {
        window.AndroidBridge.vibrate(ms);
      } catch (_) {}
    }
  }

  saveGameScore(score, level, kills, playTimeSeconds, sectorName) {
    if (this.isAvailable() && typeof window.AndroidBridge.saveGameScore === 'function') {
      try {
        window.AndroidBridge.saveGameScore(score, level, kills, playTimeSeconds, sectorName);
      } catch (_) {}
    }
  }

  unlockAchievement(code, title, description) {
    if (this.isAvailable() && typeof window.AndroidBridge.unlockAchievement === 'function') {
      try {
        window.AndroidBridge.unlockAchievement(code, title, description);
      } catch (_) {}
    }
  }

  triggerComposeLevelUp(level) {
    if (this.isAvailable() && typeof window.AndroidBridge.triggerComposeLevelUp === 'function') {
      try {
        window.AndroidBridge.triggerComposeLevelUp(level);
      } catch (_) {}
    }
  }
}

window.nativeAndroidBridge = new NativeAndroidBridge();
