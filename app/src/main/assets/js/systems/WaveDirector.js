/**
 * SYSTEMS - WaveDirector
 * Manages wave pacing, wave breaks, telegraphing, elite enemy encounters,
 * boss spawning, and dynamic warehouse events (KAS Audits, Cold Storage Freezes, Golden Pallets).
 */
class WaveDirectorSystem {
  constructor() {
    this.spawnTimer = 0;
    this.spawnInterval = 0.8;
    this.waveNumber = 1;
    this.isBreakActive = false;
    this.breakTimer = 0;
    this.eventFlags = { kasAudit: false, coldFreeze: false, goldenPallet: false };
    this.activeBoss = null;
    this.telegraphs = []; // Red warning zone indicators before elite/boss attacks
  }

  reset() {
    this.spawnTimer = 0;
    this.spawnInterval = 0.8;
    this.waveNumber = 1;
    this.isBreakActive = false;
    this.breakTimer = 0;
    this.eventFlags = { kasAudit: false, coldFreeze: false, goldenPallet: false };
    this.activeBoss = null;
    this.telegraphs = [];
  }

  addTelegraph(x, y, radius, duration = 1.2, color = '#ef4444') {
    this.telegraphs.push({
      x: x, y: y, radius: radius, duration: duration, maxDuration: duration, color: color
    });
  }

  update(dt, gameTime, sectorTime, player, currentSector) {
    // 1. Update Telegraph Warning Zones
    for (let i = this.telegraphs.length - 1; i >= 0; i--) {
      const t = this.telegraphs[i];
      t.duration -= dt;
      if (t.duration <= 0) {
        this.telegraphs.splice(i, 1);
      }
    }

    // 2. Wave Break Pacing (3-second tactical breathing room every 60 seconds)
    if (this.isBreakActive) {
      this.breakTimer -= dt;
      if (this.breakTimer <= 0) {
        this.isBreakActive = false;
        console.log("WaveDirector: Wave break ended. Horde resuming!");
      } else {
        return; // Pause wave spawning during break
      }
    } else if (Math.floor(gameTime) % 60 === 0 && gameTime > 10 && this.breakTimer <= 0) {
      this.isBreakActive = true;
      this.breakTimer = 3.5;
      this.waveNumber++;
      if (window.eventBus) window.eventBus.emit('waveBreakStarted', { wave: this.waveNumber });
      return;
    }

    // 3. Dynamic Sector Events
    // Event A: KAS Audit (gameTime >= 210s / 03:30)
    if (gameTime >= 210 && !this.eventFlags.kasAudit) {
      this.eventFlags.kasAudit = true;
      if (window.eventBus) window.eventBus.emit('eventKasAudit');
      this.addTelegraph(player.x, player.y, 180, 2.0, '#ef4444');
    }

    // Event B: Cold Storage Freeze (gameTime >= 255s / 04:15)
    if (gameTime >= 255 && !this.eventFlags.coldFreeze) {
      this.eventFlags.coldFreeze = true;
      if (window.eventBus) window.eventBus.emit('eventColdFreeze');
    }

    // 4. Regular Horde Spawning
    this.spawnTimer += dt;
    // Scale spawn rate based on game time and active performance quality profile
    let currentInterval = Math.max(0.2, this.spawnInterval - Math.floor(gameTime / 60) * 0.1);
    if (window.adaptivePerformanceSystem && window.adaptivePerformanceSystem.currentQuality === 'LOW') {
      currentInterval *= 1.35; // Cap spawn density on low-end devices
    }

    if (this.spawnTimer >= currentInterval) {
      this.spawnTimer = 0;
      if (typeof window.spawnHordeUnit === 'function') {
        window.spawnHordeUnit(gameTime, currentSector);
      }
    }

    // 5. Boss Spawning Check
    if (currentSector && sectorTime >= currentSector.bossTime && !this.activeBoss) {
      if (typeof window.spawnBossUnit === 'function') {
        this.activeBoss = window.spawnBossUnit(currentSector.bossKey);
      }
    }
  }
}

window.waveDirectorSystem = new WaveDirectorSystem();
