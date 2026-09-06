
    const document = {
      getElementById: () => ({ style: {}, classList: { remove: ()=>{} }, addEventListener: ()=>{}, width: 800, height: 600, getContext: () => ({ font: '', fillStyle: '', fillRect: ()=>{}, save: ()=>{}, restore: ()=>{}, beginPath: ()=>{}, arc: ()=>{}, fill: ()=>{}, strokeStyle: '', strokeRect: ()=>{}, measureText: ()=>({width: 10}), clearRect: ()=>{}, fillText: ()=>{}, stroke: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, translate: ()=>{}, rotate: ()=>{}, scale: ()=>{}, globalAlpha: 1 }) }),
      querySelectorAll: () => ([]),
      createElement: () => ({ style: {}, classList: { add: ()=>{} }, appendChild: ()=>{}, width: 800, height: 600, getContext: () => ({ fillStyle: '', fillRect: ()=>{}, save: ()=>{}, restore: ()=>{}, beginPath: ()=>{}, arc: ()=>{}, fill: ()=>{}, strokeStyle: '', strokeRect: ()=>{}, clearRect: ()=>{}, fillText: ()=>{}, stroke: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, translate: ()=>{}, rotate: ()=>{}, scale: ()=>{}, globalAlpha: 1 }) }),
      body: { appendChild: ()=>{} }
    };
    const window = { innerWidth: 800, innerHeight: 600, requestAnimationFrame: ()=>{}, addEventListener: ()=>{}, eventFlags: {} };
    const requestAnimationFrame = window.requestAnimationFrame;
    const performance = { now: () => 1000 };
    const Math = global.Math;
    const console = global.console;
    let localStorage = { getItem: ()=>{}, setItem: ()=>{} };
    const Image = function() {};
    const navigator = { vibrate: ()=>{} };
    const AudioContext = function() { this.createOscillator = () => ({ connect: ()=>{}, start: ()=>{}, stop: ()=>{}, type: '', frequency: { setValueAtTime: ()=>{} } }); this.createGain = () => ({ connect: ()=>{}, gain: { setValueAtTime: ()=>{}, exponentialRampToValueAtTime: ()=>{} } }); this.destination = {}; };
    try {
      
/* ==========================================================================
   DTA GRANICZNA 8F: MASSIVE HORDE SURVIVORS ENGINE WITH EVOLUTIONS & BOSSES
   ========================================================================== */

class SoundEngine {
  heavyGunshot() {
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;
      // Massive Sub-bass thump
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(24, now + 0.18);
      oscGain.gain.setValueAtTime(0.45, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Cinematic Noise punch with low-pass sweep
      const bufSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.35));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.12);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch(e){}
  }

  shellDrop() {
    if (!this.ctx || this.muted) return;
    try {
      const f = 2400 + Math.random() * 800;
      this.playTone(f, 'sine', 0.03, 0.08, f - 200);
    } catch(e){}
  }

  radioChirp() {
    if (!this.ctx || this.muted) return;
    try {
      this.playTone(1800, 'square', 0.03, 0.12, 1200);
      setTimeout(() => this.playTone(2200, 'square', 0.04, 0.12, 900), 40);
    } catch(e){}
  }

  organicCrunch() {
    if (!this.ctx || this.muted) return;
    try {
      this.playTone(95 + Math.random() * 40, 'sawtooth', 0.09, 0.22, 35);
    } catch(e){}
  }

  freezeShatter() {
    if (!this.ctx || this.muted) return;
    try {
      [1200, 1600, 2100, 2600].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.18, 0.16, freq * 0.8), idx * 45);
      });
    } catch(e){}
  }

  nukeBoom() {
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(15, now + 0.6);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch(e){}
  }

  adrenalineHeartbeat() {
    if (!this.ctx || this.muted) return;
    try {
      this.playTone(60, 'sine', 0.08, 0.35, 45);
      setTimeout(() => this.playTone(55, 'sine', 0.08, 0.30, 40), 120);
    } catch(e){}
  }
  constructor() {
    this.ctx = null;
    this.motorOsc = null;
    this.motorGain = null;
    this.muted = false;
  }
  toggle() {
    this.muted = !this.muted;
    const btn = document.getElementById('btn-pause-sound');
    if (btn) btn.innerText = this.muted ? '🔇 DŹWIĘK: OFF' : '🔊 DŹWIĘK: ON';
    return this.muted;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.setupEngineMotor();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }
  setupEngineMotor() {
    try {
      this.motorOsc = this.ctx.createOscillator();
      this.motorGain = this.ctx.createGain();
      this.motorOsc.type = 'triangle';
      this.motorOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
      this.motorGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.motorOsc.connect(this.motorGain);
      this.motorGain.connect(this.ctx.destination);
      this.motorOsc.start();
    } catch(e){}
  }
  updateMotor(speedRatio, isForklift = false) {
    if (!this.motorOsc || !this.motorGain || !this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    if (!isForklift) {
       this.motorGain.gain.setTargetAtTime(0.001, t, 0.2);
    } else {
       this.motorOsc.frequency.setTargetAtTime(45 + speedRatio * 80, t, 0.08);
       this.motorGain.gain.setTargetAtTime(0.01 + speedRatio * 0.025, t, 0.08);
    }
  }
  playTone(freq, type, duration, vol = 0.2, endFreq = null) {
    if (!this.ctx || this.muted) return;
    try {
      const pitchOffset = (Math.random() - 0.5) * 0.08 * freq;
      const actualFreq = Math.max(20, freq + pitchOffset);
      const actualEndFreq = endFreq ? Math.max(1, endFreq + pitchOffset) : null;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(actualFreq, now);
      if (actualEndFreq) osc.frequency.exponentialRampToValueAtTime(actualEndFreq, now + duration);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch(e){}
  }
  beep() { this.playTone(1100, 'sine', 0.05, 0.15, 1400); }
  hit() { this.playTone(120, 'sawtooth', 0.1, 0.2, 40); }
  pallet() { this.playTone(85, 'square', 0.18, 0.25, 30); }
  freeze() { this.playTone(650, 'sine', 0.2, 0.15, 1200); }
  megaph() { this.playTone(300, 'square', 0.25, 0.22, 180); }
  xp() { this.playTone(1400, 'sine', 0.05, 0.09, 1800); }
  dash() { this.playTone(220, 'sawtooth', 0.25, 0.25, 600); }
  footstep() { this.playTone(120, 'triangle', 0.06, 0.03, 80); }
  shatterProp() {
    this.playTone(160, 'square', 0.12, 0.25, 45);
    setTimeout(() => this.playTone(280, 'sawtooth', 0.15, 0.2, 80), 30);
  }
  chestSlot() {
    this.playTone(880, 'triangle', 0.08, 0.18, 1200);
  }
  chestFanfare() {
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.25, 0.28), i * 90);
    });
  }
  levelUp() {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.playTone(f, 'triangle', 0.15, 0.2), i * 60));
  }
  evoSound() {
    [440, 554, 659, 880, 1108].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.2, 0.25), i * 80));
  }
  achieve() {
    [659, 784, 987, 1318].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.2, 0.25), i * 70));
  }
  bossAlert() {
    [340, 260, 340, 260, 520].forEach((f, i) => setTimeout(() => this.playTone(f, 'sawtooth', 0.18, 0.3), i * 110));
  }
  gasPistol() {
    this.playTone(180, 'sawtooth', 0.35, 0.3, 40);
    this.playTone(450, 'sine', 0.2, 0.15, 80);
  }
  metalBB() {
    this.playTone(2400, 'sine', 0.04, 0.2, 3200);
    this.playTone(1800, 'triangle', 0.06, 0.15, 800);
  }
bark() {
    this.playTone(520, 'sawtooth', 0.08, 0.25, 220);
    setTimeout(() => this.playTone(640, 'sawtooth', 0.09, 0.28, 280), 90);
  }
  lowBatteryWarning() {
    this.playTone(850, 'square', 0.15, 0.18, 400);
    setTimeout(() => this.playTone(850, 'square', 0.15, 0.18, 400), 200);
  }
}
const sounds = new SoundEngine();

function toggleMuteSound() {
  sounds.muted = !sounds.muted;
  const btn = document.getElementById('btn-pause-sound');
  if (btn) btn.innerText = sounds.muted ? '🔇 DŹWIĘK: OFF' : '🔊 DŹWIĘK: ON';
}

// Canvas & Engine Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d', { alpha: false, desynchronized: true }) : null;
if (ctx) {
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
}
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
let dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));


// ============================================================================
// REALISTIC CINEMA POST-PROCESSING & ATMOSPHERE PIPELINE (HARDWARE-ACCELERATED 2D)
// Zero-driver overhead, 100% stable across all mobile GPU & Android renderers
// ============================================================================
const cinemaPipeline = {
  vignetteStrength: 0.65,
  bloomIntensity: 1.0,
  strobePulse: 0,
  
  renderPostProcess(ctx, playerX, playerY, playerAngle, screenShake, gameTime) {
    ctx.save();
    
    // 1. Volumetric Headlight Cone Scattering (Atmospheric Warehouse Dust Haze)
    const viewW = gameWidth / camera.zoom;
    const viewH = gameHeight / camera.zoom;
    const headDist = 340;
    const hx = playerX + Math.cos(playerAngle) * headDist;
    const hy = playerY + Math.sin(playerAngle) * headDist;
    
    // 2. High-Dynamic Range (HDR) Bloom & Halogen Scattering
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const bloomGrad = ctx.createRadialGradient(
      playerX + Math.cos(playerAngle) * 20, playerY + Math.sin(playerAngle) * 20, 10,
      playerX + Math.cos(playerAngle) * 80, playerY + Math.sin(playerAngle) * 80, 140
    );
    bloomGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
    bloomGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.12)');
    bloomGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = bloomGrad;
    ctx.beginPath();
    ctx.arc(playerX + Math.cos(playerAngle) * 40, playerY + Math.sin(playerAngle) * 40, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Ambient Industrial Amber Strobe Glow
    const strobeBrightness = 0.5 + 0.5 * Math.sin(gameTime * 5.5);
    if (strobeBrightness > 0.4) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const strobeGrad = ctx.createRadialGradient(
        ARENA_WIDTH * 0.5, ARENA_HEIGHT * 0.5, 40,
        ARENA_WIDTH * 0.5, ARENA_HEIGHT * 0.5, 500
      );
      strobeGrad.addColorStop(0, `rgba(245, 158, 11, ${0.12 * strobeBrightness})`);
      strobeGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = strobeGrad;
      ctx.beginPath();
      ctx.arc(ARENA_WIDTH * 0.5, ARENA_HEIGHT * 0.5, 500, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  },

  renderScreenSpaceCinematic(ctx) {
    ctx.save();
    
    // 4. Filmic High-Contrast Vignette (ACES Style Darkened Edges)
    const maxDim = Math.max(gameWidth, gameHeight);
    const minDim = Math.min(gameWidth, gameHeight);
    const vigGrad = ctx.createRadialGradient(
      gameWidth * 0.5, gameHeight * 0.5, minDim * 0.32,
      gameWidth * 0.5, gameHeight * 0.5, maxDim * 0.72
    );
    vigGrad.addColorStop(0, 'rgba(3, 7, 18, 0.0)');
    vigGrad.addColorStop(0.55, 'rgba(3, 7, 18, 0.22)');
    vigGrad.addColorStop(1, 'rgba(3, 7, 18, 0.68)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // 5. Tactical CRT Micro-Scanlines (Industrial Security Monitor)
    ctx.fillStyle = 'rgba(2, 6, 23, 0.08)';
    for (let y = 0; y < gameHeight; y += 4) {
      ctx.fillRect(0, y, gameWidth, 1.2);
    }

    // 6. Impact Chromatic Aberration & Screen Glitch on Heavy Shake
    if (screenShake > 4) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const rOff = (Math.random() - 0.5) * screenShake * 0.5;
      const bOff = (Math.random() - 0.5) * screenShake * 0.5;
      ctx.fillStyle = `rgba(239, 68, 68, ${Math.min(0.25, screenShake * 0.03)})`;
      ctx.fillRect(2 + rOff, 0, gameWidth, gameHeight);
      ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(0.25, screenShake * 0.03)})`;
      ctx.fillRect(-2 + bOff, 0, gameWidth, gameHeight);
      ctx.restore();
    }
    
    // 7. Damage Flash Overlay
    if (player.hitFlash > 0) {
      ctx.fillStyle = `rgba(220, 38, 38, ${player.hitFlash * 0.4})`;
      ctx.fillRect(0, 0, gameWidth, gameHeight);
    }

    ctx.restore();
  }
};

function resizeCanvas() {
  try {
    gameWidth = window.innerWidth || document.documentElement.clientWidth || screen.width || 360;
    gameHeight = window.innerHeight || document.documentElement.clientHeight || screen.height || 640;
    dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    
    if (canvas) {
      canvas.width = Math.round(gameWidth * dpr);
      canvas.height = Math.round(gameHeight * dpr);
    }
    
    console.log("RESIZE OK: " + gameWidth + "x" + gameHeight + " (DPR: " + dpr + ")");
  } catch (err) {
    console.error("RESIZE ERROR: ", err);
  }
}
window.addEventListener('resize', resizeCanvas);

// Global touch listener to unlock AudioContext on first user touch/gesture
window.addEventListener('touchstart', function unlockAudio() {
  if (typeof sounds !== 'undefined' && sounds.init) {
    sounds.init();
  }
}, { once: true });

setTimeout(resizeCanvas, 100); // Delayed resize for Android WebView layout stabilization
resizeCanvas();

const STATE = { START: 0, PLAYING: 1, LEVELUP: 2, GAMEOVER: 3, WIN: 4, PAUSED: 5, CHEST: 6 };
let gameState = STATE.START;

let fpsFrameCount = 0;
let fpsLastCalc = performance.now();
let currentFps = 60;
let currentFrameMs = '16.7';

const ARENA_WIDTH = 3800;
const ARENA_HEIGHT = 3800;

// ============================================================================
// CRIMSONLAND-DTA HYBRID ENGINE (SPLATTER, GIBS, POWER-UPS, GAME-CHANGER PERKS)
// ============================================================================

// 1. Offscreen Splatter Canvas Target (Permanent Decals, 0 Draw Calls overhead)
const splatterCanvas = document.createElement('canvas');
splatterCanvas.width = ARENA_WIDTH;
splatterCanvas.height = ARENA_HEIGHT;
const splatterCtx = splatterCanvas.getContext('2d', { alpha: true });
if (splatterCtx) {
  splatterCtx.imageSmoothingEnabled = false;
  splatterCtx.webkitImageSmoothingEnabled = false;
  splatterCtx.mozImageSmoothingEnabled = false;
}

function renderStaticFloorToSplatter() {
  if (typeof splatterCtx === 'undefined' || !splatterCtx) return;
  splatterCtx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

  // Pixel-Art Dark Epoxy Floor Base
  splatterCtx.fillStyle = '#0b1120';
  splatterCtx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

  // Sharp Pixel Grid Expansion Joints
  const tileSize = 160;
  splatterCtx.fillStyle = '#1e293b';
  for (let x = 0; x <= ARENA_WIDTH; x += tileSize) {
    splatterCtx.fillRect(x, 0, 2, ARENA_HEIGHT);
  }
  for (let y = 0; y <= ARENA_HEIGHT; y += tileSize) {
    splatterCtx.fillRect(0, y, ARENA_WIDTH, 2);
  }

  // Pixelated Yellow Safety Highway Lanes
  splatterCtx.fillStyle = '#eab308';
  for (let x = 0; x < ARENA_WIDTH; x += 32) {
    splatterCtx.fillRect(x, ARENA_HEIGHT / 2 - 2, 16, 4);
  }
  for (let y = 0; y < ARENA_HEIGHT; y += 32) {
    splatterCtx.fillRect(ARENA_WIDTH / 2 - 2, y, 4, 16);
  }

  // Stenciled Pixel Sector Labels
  splatterCtx.font = '900 18px monospace';
  splatterCtx.fillStyle = '#0284c7';
  splatterCtx.textAlign = 'center';
  for (let x = 480; x < ARENA_WIDTH; x += 640) {
    for (let y = 480; y < ARENA_HEIGHT; y += 640) {
      splatterCtx.fillText(`SEC-${(x / 80).toFixed(0)}:${(y / 80).toFixed(0)}`, x, y);
    }
  }

  // Outer Hazard Perimeter Border
  splatterCtx.fillStyle = '#dc2626';
  splatterCtx.fillRect(0, 0, ARENA_WIDTH, 12);
  splatterCtx.fillRect(0, ARENA_HEIGHT - 12, ARENA_WIDTH, 12);
  splatterCtx.fillRect(0, 0, 12, ARENA_HEIGHT);
  splatterCtx.fillRect(ARENA_WIDTH - 12, 0, 12, ARENA_HEIGHT);
}

function initSplatterEngine() {
  renderStaticFloorToSplatter();
  console.log("CRIMSONLAND Splatter Engine Initialized: " + ARENA_WIDTH + "x" + ARENA_HEIGHT);
}
initSplatterEngine();

// ============================================================================
// DTA DESTRUCTION ENGINE & RADIOWĘZEŁ SYSTEM (ZERO-GC)
// ============================================================================

// Procedural Announcer Voice (Audio Synth / Web Speech / Sound Effects)
function speakAnnouncer(msgText, alertColor = '#38bdf8') {
  showAnnouncement('📢 RADIOWĘZEŁ: ' + msgText, alertColor);
  sounds.alert();
  if ('speechSynthesis' in window && Math.random() < 0.7) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msgText);
      u.lang = 'pl-PL';
      u.pitch = 0.7; // Deep muffled warehouse speaker
      u.rate = 1.1;
      window.speechSynthesis.speak(u);
    } catch(e) {}
  }
}

// Explosive ADR Barrels & High-Bay Shelves Pool
const MAX_BARRELS = 35;
const adrBarrels = new Array(MAX_BARRELS);
for (let i = 0; i < MAX_BARRELS; i++) {
  adrBarrels[i] = { x: 0, y: 0, hp: 40, active: false, type: 'gas', radius: 24, icon: '🛢️' };
}

function spawnADRBarrel(x, y, type = 'gas') {
  for (let i = 0; i < MAX_BARRELS; i++) {
    const b = adrBarrels[i];
    if (!b.active) {
      b.active = true;
      b.x = x;
      b.y = y;
      b.hp = 40;
      b.type = type; // 'gas', 'acid', 'oil'
      b.icon = type === 'gas' ? '🛢️' : (type === 'acid' ? '☣️' : '🛢️');
      break;
    }
  }
}

function initSectorEnvironment() {
  // Clear and populate barrels & shelves per sector
  for (let i = 0; i < MAX_BARRELS; i++) adrBarrels[i].active = false;
  
  // Spawn initial barrels near center aisles
  const barrelTypes = ['gas', 'acid', 'oil'];
  for (let i = 0; i < 20; i++) {
    const bx = 300 + Math.random() * (ARENA_WIDTH - 600);
    const by = 300 + Math.random() * (ARENA_HEIGHT - 600);
    spawnADRBarrel(bx, by, barrelTypes[i % 3]);
  }
}

function explodeBarrel(b) {
  b.active = false;
  screenShake = Math.max(screenShake, 22);
  sounds.pallet();
  hitStopTimer = 0.05;

  let decalType = 'oil';
  let blastColor = '#ea580c';
  if (b.type === 'acid') { decalType = 'acid'; blastColor = '#84cc16'; }
  else if (b.type === 'gas') { decalType = 'ink'; blastColor = '#ef4444'; }

  stampPermanentDecal(b.x, b.y, 45, decalType);
  spawnGibs(b.x, b.y, 12, 'WOZEK');
  createSparks(b.x, b.y, 30, blastColor);
  addSpeechBubble(b.x, b.y, '💥 KATASTROFA ADR!', blastColor);

  // Area damage to enemies & chain reaction to other barrels
  enemies.forEach(en => {
    if (!en.dead && Math.hypot(en.x - b.x, en.y - b.y) < 180) {
      damageEnemy(en, 250);
    }
  });

  adrBarrels.forEach(otherB => {
    if (otherB.active && otherB !== b && Math.hypot(otherB.x - b.x, otherB.y - b.y) < 140) {
      explodeBarrel(otherB); // Chain reaction!
    }
  });
}

function updateAndRenderEnvironment(dt, ctx) {
  // Render & Check ADR Barrels
  for (let i = 0; i < MAX_BARRELS; i++) {
    const b = adrBarrels[i];
    if (b.active) {
      // Check player collision / ramming
      const dPlayer = Math.hypot(player.x - b.x, player.y - b.y);
      if (dPlayer < b.radius + 20) {
        explodeBarrel(b);
        continue;
      }

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.fillStyle = b.type === 'acid' ? '#84cc16' : (b.type === 'gas' ? '#ef4444' : '#0f172a');
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.icon, 0, 0);
      ctx.restore();
    }
  }

  // Orange Warning Beacon (Kogut Pomarańczowy Meta-Upgrade Effect)
  if (workshopUpgrades.kogutOstrzegawczy > 0 && Math.random() < 0.1) {
    enemies.forEach(en => {
      if (!en.dead && Math.hypot(en.x - player.x, en.y - player.y) < 140) {
        en.slowTimer = 1.0;
      }
    });
  }
}


function stampPermanentDecal(x, y, radius, colorType) {
  splatterCtx.save();
  splatterCtx.beginPath();
  
  let color = '#7f1d1d'; // Crimson Blood / Red Stamp
  if (colorType === 'oil') color = '#0f172a';
  else if (colorType === 'coffee') color = '#78350f';
  else if (colorType === 'acid') color = '#84cc16';
  else if (colorType === 'ink') color = '#4338ca';
  else if (colorType === 'folia') color = '#cbd5e1';

  const r = radius * (0.8 + Math.random() * 0.5);
  splatterCtx.fillStyle = color;
  splatterCtx.globalAlpha = 0.85;
  splatterCtx.ellipse(x, y, r, r * 0.65, Math.random() * Math.PI, 0, Math.PI * 2);
  splatterCtx.fill();

  // Splatter splashes around impact
  const splashCount = 4 + Math.floor(Math.random() * 5);
  for (let i = 0; i < splashCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = r + Math.random() * r * 1.6;
    const dropR = 2 + Math.random() * (r * 0.35);
    splatterCtx.beginPath();
    splatterCtx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, dropR, 0, Math.PI * 2);
    splatterCtx.fill();
  }
  splatterCtx.restore();
}

// 2. Physical Gibs Object Pool
const MAX_GIBS = 400;
const gibsPool = new Array(MAX_GIBS);
for (let i = 0; i < MAX_GIBS; i++) {
  gibsPool[i] = {
    x: 0, y: 0, vx: 0, vy: 0, rot: 0, vRot: 0,
    size: 10, type: 'helmet', active: false, life: 1.0, color: '#f59e0b'
  };
}

function spawnGibs(x, y, count = 6, enemyType = 'default') {
  let spawned = 0;
  let gibType = 'helmet';
  if (enemyType.includes('KARTON') || enemyType.includes('PALETA')) gibType = 'wood';
  else if (enemyType.includes('CELNIK') || enemyType.includes('AUDYTOR')) gibType = 'folder';
  else if (enemyType.includes('WOZEK') || enemyType.includes('RAMPA')) gibType = 'wheel';

  for (let i = 0; i < MAX_GIBS; i++) {
    const g = gibsPool[i];
    if (!g.active) {
      g.active = true;
      g.x = x;
      g.y = y;
      const angle = Math.random() * Math.PI * 2;
      const force = 180 + Math.random() * 340;
      g.vx = Math.cos(angle) * force;
      g.vy = Math.sin(angle) * force;
      g.rot = Math.random() * Math.PI * 2;
      g.vRot = (Math.random() - 0.5) * 14;
      g.size = 8 + Math.random() * 10;
      g.life = 2.0 + Math.random() * 1.5;
      g.type = gibType;
      spawned++;
      if (spawned >= count) break;
    }
  }
}

function updateAndRenderGibs(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016);
  for (let i = 0; i < MAX_GIBS; i++) {
    const g = gibsPool[i];
    if (g.active) {
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      g.vx *= 0.91;
      g.vy *= 0.91;
      g.rot += g.vRot * dt;
      g.life -= dt;

      if (g.life <= 0 || (Math.abs(g.vx) < 5 && Math.abs(g.vy) < 5 && g.life < 1.0)) {
        g.active = false;
        let cType = 'blood';
        if (g.type === 'wood') cType = 'coffee';
        else if (g.type === 'wheel') cType = 'oil';
        stampPermanentDecal(g.x, g.y, g.size * 0.7, cType);
        continue;
      }

      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rot);
      if (g.type === 'helmet') ctx.fillStyle = '#f59e0b';
      else if (g.type === 'folder') ctx.fillStyle = '#38bdf8';
      else if (g.type === 'wood') ctx.fillStyle = '#78350f';
      else ctx.fillStyle = '#1e293b';

      ctx.fillRect(-g.size / 2, -g.size / 2, g.size, g.size);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(-g.size / 2, -g.size / 2, g.size, g.size);
      ctx.restore();
    }
  }
}

// 3. Instant Power-Ups Drop System
const MAX_POWERUPS = 30;
const powerUpPool = new Array(MAX_POWERUPS);
for (let i = 0; i < MAX_POWERUPS; i++) {
  powerUpPool[i] = { x: 0, y: 0, type: 'nuke', active: false, timer: 15.0, icon: '💣', label: 'AWARATOR 3000' };
}

let bulletTimeTimer = 0;
let freezeTimer = 0;
let fireBulletsTimer = 0;
let kamikazeTimer = 0;

function trySpawnPowerUp(x, y) {
  if (Math.random() > 0.06) return; // 6% chance per kill
  const types = [
    { type: 'nuke', icon: '💣', label: 'AWARATOR 3000' },
    { type: 'bullet_time', icon: '⏱️', label: 'SETKA Z ŻABKI' },
    { type: 'freeze', icon: '❄️', label: 'NALOT PIP' },
    { type: 'fire_bullets', icon: '🔥', label: 'PROMOCJA ENERGETYKI' },
    { type: 'heal_battery', icon: '🧯', label: 'GAŚNICA AWARYJNA' }
  ];
  const selected = types[Math.floor(Math.random() * types.length)];
  for (let i = 0; i < MAX_POWERUPS; i++) {
    const p = powerUpPool[i];
    if (!p.active) {
      p.active = true;
      p.x = x;
      p.y = y;
      p.type = selected.type;
      p.icon = selected.icon;
      p.label = selected.label;
      p.timer = 16.0;
      break;
    }
  }
}

function updateAndRenderPowerUps(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016);
  for (let i = 0; i < MAX_POWERUPS; i++) {
    const p = powerUpPool[i];
    if (p.active) {
      p.timer -= dt;
      if (p.timer <= 0) {
        p.active = false;
        continue;
      }

      // Magnet pull to player
      const d = Math.hypot(player.x - p.x, player.y - p.y);
      if (d < player.magnetRange) {
        p.x += ((player.x - p.x) / d) * 350 * dt;
        p.y += ((player.y - p.y) / d) * 350 * dt;
      }

      // Pickup collision
      if (d < 35) {
        p.active = false;
        triggerPowerUpEffect(p);
        continue;
      }

      // Render floating icon
      ctx.save();
      const bounceY = Math.sin(gameTime * 6 + i) * 6;
      ctx.translate(p.x, p.y + bounceY);

      // Glowing aura ring
      ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, 22 + Math.sin(gameTime * 8) * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.icon, 0, 0);
      ctx.restore();
    }
  }
}

function triggerPowerUpEffect(p) {
  sounds.levelUp();
  screenShake = 16;
  if (p.type === 'nuke') {
    screenShake = 28;
    hitStopTimer = 0.08;
    enemies.forEach(en => {
      if (!en.dead && !en.isBoss) {
        en.hp = 0;
        killEnemy(en);
      }
    });
    addSpeechBubble(player.x, player.y - 45, '💣 AWARATOR 3000: HALA EKSPLODOWANA!', '#ef4444');
    showAnnouncement('💣 AWARATOR 3000: CZYSZCZENIE EKRANU!', '#ef4444');
  } else if (p.type === 'bullet_time') {
    bulletTimeTimer = 6.0;
    addSpeechBubble(player.x, player.y - 45, '⏱️ SETKA Z ŻABKI: BULLET-TIME!', '#f59e0b');
    showAnnouncement('⏱️ BULLET-TIME 120Hz ACTIVATED!', '#f59e0b');
  } else if (p.type === 'freeze') {
    freezeTimer = 7.0;
    addSpeechBubble(player.x, player.y - 45, '❄️ NALOT PIP: WSTRZYMANIE RUCHU!', '#38bdf8');
    showAnnouncement('❄️ NALOT PROKURATORA PIP: KWARANTANNA!', '#38bdf8');
  } else if (p.type === 'fire_bullets') {
    fireBulletsTimer = 8.0;
    addSpeechBubble(player.x, player.y - 45, '🔥 ENERGETYK: PODWÓJNA SALWA!', '#facc15');
    showAnnouncement('🔥 PROMOCJA ENERGETYKI: FIRE-BULLETS!', '#facc15');
  } else if (p.type === 'heal_battery') {
    player.battery = player.maxBattery;
    addSpeechBubble(player.x, player.y - 45, '🧯 BATERIA PEŁNA 100%!', '#22c55e');
    showAnnouncement('🧯 GAŚNICA: REGENERACJA BATERII 100%', '#22c55e');
  }
}

const SHIFT_START_MINUTES = 3 * 60 + 15; // 03:15
const SHIFT_END_MINUTES = 7 * 60;        // 07:00
const TOTAL_SHIFT_DURATION = 600;        // 10 min (2 min per sector with intense boss climax)

let gameTime = 0;
let sectorTime = 0;
let score = 0;
let kills = 0;
let comboCount = 0;
let comboTimer = 0;
let maxCombo = 0;
let packageCombo = 0;
let packageComboTimer = 0;
let maxPackageCombo = 0;
let playerLevel = 1;
let currentXP = 0;
let neededXP = 260;
let levelUpPendingCount = 0;
let levelUpProcessing = false;
let lowBatteryTimer = 0;
let coffeeDashCount = 0;

// Camera (Wider Pixel-Art Field of View for tactical awareness)
const camera = { x: 0, y: 0, zoom: 0.30 };
function toggleZoom() {
  if (camera.zoom >= 0.35) camera.zoom = 0.25;
  else if (camera.zoom >= 0.28) camera.zoom = 0.35;
  else camera.zoom = 0.30;
  const el = document.getElementById('badge-zoom-label');
  if (el) el.innerText = camera.zoom.toFixed(2) + 'x';
}
let screenShake = 0;

// Crimsonland Blood & Epoxy Stains
const bloodStains = [];
function addBloodStain(x, y, enemyInfo) {
  if (bloodStains.length > 180) bloodStains.shift();
  
  let col = '#991b1b'; // Default human blood
  let radius = Math.random() * 12 + 10;
  if (enemyInfo) {
    if (enemyInfo.name === 'Rolka Folii Strecz' || enemyInfo.name === 'Resztka Folii') {
      col = '#cbd5e1'; // Stretch wrap shreds
      radius = 16;
    } else if (enemyInfo.name === 'Zbłąkany Karton B2C' || enemyInfo.name === 'Zablokowana Paleta EURO') {
      col = '#78350f'; // Cardboard / Wood pulp
      radius = 18;
    } else if (enemyInfo.name === 'Wózek z Awarią' || enemyInfo.name === 'Mobilna Rampa') {
      col = '#0f172a'; // Black hydraulic oil
      radius = 22;
    } else if (enemyInfo.isBoss) {
      col = '#dc2626'; // Boss massive stain
      radius = 35;
    }
  }

  // Stamp persistent blood pool to offscreen splatterCanvas
  if (typeof splatterCtx !== 'undefined' && splatterCtx) {
    splatterCtx.save();
    splatterCtx.fillStyle = col;
    splatterCtx.globalAlpha = 0.80;
    splatterCtx.beginPath();
    splatterCtx.ellipse(x, y, radius, radius * 0.65, Math.random() * Math.PI, 0, Math.PI * 2);
    splatterCtx.fill();
    splatterCtx.restore();
  }

  // Spawn dynamic blood particles
  const particleCount = enemyInfo && enemyInfo.isBoss ? 25 : 8;
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (enemyInfo && enemyInfo.isBoss ? 12 : 5);
    spawnParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.4 + Math.random() * 0.4, Math.random() * 3 + 2, col);
  }
}

// Kluska Companion (Suczka Piotra - Kundel Magazynowy)
const kluska = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  angle: 0,
  active: false,
  rageTimer: 0,
  barkTimer: 0,
  animFrame: 0
};

function updateKluska(dt) {
  if (selectedCharKey !== 'piotr' && !kluska.active) return;
  
  if (!kluska.x || !kluska.y) {
    kluska.x = player.x - 35;
    kluska.y = player.y - 35;
  }
  
  kluska.animFrame += dt * 12;
  
  if (kluska.rageTimer > 0) {
    kluska.rageTimer -= dt;
    // RAGE MODE: Find nearest enemy or barcode and zoom at super speed!
    let target = null;
    let minDist = 99999;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.dead) continue;
      const d = Math.hypot(e.x - kluska.x, e.y - kluska.y);
      if (d < minDist) { minDist = d; target = e; }
    }
    
    if (target) {
      const a = Math.atan2(target.y - kluska.y, target.x - kluska.x);
      kluska.angle = a;
      kluska.x += Math.cos(a) * 9.5;
      kluska.y += Math.sin(a) * 9.5;
      
      if (minDist < target.info.radius + 18) {
        damageEnemy(target, 110);
        target.slowTimer = 2.0;
        createSparks(target.x, target.y, 8, '#f59e0b');
        addBloodStain(target.x, target.y, target.info);
        if (Math.random() < 0.2) {
          addSpeechBubble(kluska.x, kluska.y - 20, '🐕 HAU! GRYZĘ W KOSTKĘ!', '#fbbf24');
        }
      }
    } else {
      kluska.x += (player.x + Math.cos(gameTime * 6) * 50 - kluska.x) * 0.12;
      kluska.y += (player.y + Math.sin(gameTime * 6) * 50 - kluska.y) * 0.12;
    }
    
    // Magnet ALL barcodes on screen straight to player!
    for (let i = dropItems.length - 1; i >= 0; i--) {
      const item = dropItems[i];
      const distK = Math.hypot(item.x - kluska.x, item.y - kluska.y);
      if (item.type === 'golden_velvet' && distK < 35) {
        sounds.achieve();
        screenShake = 10;
        player.invulnTimer = 10.0;
        player.stamina = player.maxStamina;
        createSparks(player.x, player.y, 40, '#facc15');
        addSpeechBubble(player.x, player.y - 40, '🌟 NIEŚMIERTELNOŚĆ VELVET OVERDRIVE (10s)!', '#facc15');
        dropItems.splice(i, 1);
        continue;
      } else if (item.type === 'barcode_xp') {
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        item.x += dx * 0.18;
        item.y += dy * 0.18;
      }
    }
    
    kluska.barkTimer -= dt;
    if (kluska.barkTimer <= 0) {
      kluska.barkTimer = 0.55;
      sounds.bark();
      addSpeechBubble(kluska.x, kluska.y - 22, '🐕 HAU HAU! KLUSKA W AKCJI!', '#facc15');
    }
  } else {
    // NORMAL MODE: Trots faithfully near Piotr
    const targetX = player.x - Math.cos(player.angle) * 35;
    const targetY = player.y - Math.sin(player.angle) * 35;
    const dx = targetX - kluska.x;
    const dy = targetY - kluska.y;
    const dist = Math.hypot(dx, dy);
    
    if (dist > 15) {
      kluska.angle = Math.atan2(dy, dx);
      kluska.x += dx * 0.09;
      kluska.y += dy * 0.09;
    }
    
    for (let i = dropItems.length - 1; i >= 0; i--) {
      const item = dropItems[i];
      const distK = Math.hypot(item.x - kluska.x, item.y - kluska.y);
      if (item.type === 'golden_velvet' && distK < 35) {
        sounds.achieve();
        screenShake = 10;
        player.invulnTimer = 10.0;
        player.stamina = player.maxStamina;
        createSparks(player.x, player.y, 40, '#facc15');
        addSpeechBubble(player.x, player.y - 40, '🌟 NIEŚMIERTELNOŚĆ VELVET OVERDRIVE (10s)!', '#facc15');
        dropItems.splice(i, 1);
        continue;
      } else if (item.type === 'barcode_xp') {
        if (distK < 160) {
          item.x += (player.x - item.x) * 0.14;
          item.y += (player.y - item.y) * 0.14;
        }
      }
    }
  }
}

function drawKluska(ctx) {
  if (selectedCharKey !== 'piotr' && !kluska.active) return;
  
  ctx.save();
  ctx.translate(kluska.x, kluska.y);
  ctx.rotate(kluska.angle);
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(-1, 3, 13, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Body (Tan/Brown mongrel)
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#78350f';
  ctx.stroke();
  
  // Hi-Vis BHP Safety Vest on back
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-6, -6, 12, 12);
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1;
  ctx.strokeRect(-6, -6, 12, 12);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 6px sans-serif';
  ctx.fillText('BHP', -5, 2);
  
  // Head
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(9, 0, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Floppy Ears
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(7, -6, 3, 0, Math.PI * 2);
  ctx.arc(7, 6, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Black Snout & Nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(13, 0, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Wagging Tail
  const tailAngle = Math.sin(kluska.animFrame * (kluska.rageTimer > 0 ? 3 : 1)) * 0.6;
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-11, 0);
  ctx.lineTo(-18, Math.sin(tailAngle) * 9);
  ctx.stroke();
  
  // Legs animation
  const legWiggle = Math.sin(kluska.animFrame * 2) * 4;
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(-5 + legWiggle, -7, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5 - legWiggle, -7, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-5 - legWiggle, 7, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5 + legWiggle, 7, 2, 0, Math.PI * 2); ctx.fill();
  
  if (kluska.rageTimer > 0) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.stroke();
  }
  
    cinemaPipeline.renderScreenSpaceCinematic(ctx);
  drawTacticalHUDOverlay(ctx);
  ctx.restore();
}

// --- CHARACTERS ---
const CHARACTERS = {
  piotr: {
    id: 'piotr',
    name: 'Piotr & Kluska 🐕',
    icon: '📦🐕',
    speed: 175,
    maxBattery: 110,
    magnet: 190,
    critBonus: 0.20,
    attackSpeedMult: 1.35, // Pasywka: Szybkie Ładowanie (+35% szybszy atak)
    skillIcon: '🔫🐕',
    skillLabel: 'GAZ & KLUSKA',
    skillCooldown: 6.0
  },
  mirek: {
    id: 'mirek',
    name: 'Pan Mirek (Złota Rączka)',
    icon: '🔧',
    speed: 170,
    maxBattery: 135,
    magnet: 175,
    critBonus: 0.22,
    attackSpeedMult: 1.15,
    regenRate: 0.6, // Pasywka: Samonaprawa wózka
    skillIcon: '🔨⚡',
    skillLabel: 'MŁOT UDAR',
    skillCooldown: 6.0
  },
  klaus: {
    id: 'klaus',
    name: 'Audytor Klaus (Centrala)',
    icon: '🇩🇪',
    speed: 180,
    maxBattery: 115,
    magnet: 220,
    critBonus: 0.30,
    attackSpeedMult: 1.25, // Niemiecka precyzja DIN
    skillIcon: '🖋️🚨',
    skillLabel: 'AUDYT DIN',
    skillCooldown: 6.5
  },
  radek: {
    id: 'radek',
    name: 'Radek (Weteran BT)',
    icon: '🚜',
    speed: 195,
    maxBattery: 105,
    magnet: 155,
    critBonus: 0.20,
    attackSpeedMult: 1.05,
    skillIcon: '💨',
    skillLabel: 'SZARŻA',
    skillCooldown: 6.5
  },
  pawel: {
    id: 'pawel',
    name: 'Paweł (Ekspert EPAL)',
    icon: '🪵',
    speed: 165,
    maxBattery: 130,
    magnet: 165,
    critBonus: 0.12,
    attackSpeedMult: 1.12,
    skillIcon: '🪵',
    skillLabel: 'SALWA',
    skillCooldown: 7.0
  },
  marcin: {
    id: 'marcin',
    name: 'Marcin (Nocny Wojownik)',
    icon: '🧻',
    speed: 175,
    maxBattery: 100,
    magnet: 200,
    critBonus: 0.15,
    attackSpeedMult: 1.20,
    skillIcon: '🧻',
    skillLabel: 'VELVET',
    skillCooldown: 6.0
  },
  kierownik_marcin: {
    id: 'kierownik_marcin',
    name: 'Kierownik Marcin',
    icon: '📢',
    speed: 170,
    maxBattery: 155,
    magnet: 155,
    critBonus: 0.12,
    attackSpeedMult: 1.08,
    skillIcon: '📢',
    skillLabel: 'MEGAFON',
    skillCooldown: 7.5
  },
  przemek_biuro: {
    id: 'przemek_biuro',
    name: 'Przemek z biura',
    icon: '💻',
    speed: 180,
    maxBattery: 95,
    magnet: 280, // Szalony zasięg XP WMS
    critBonus: 0.28,
    attackSpeedMult: 1.25,
    skillIcon: '💻',
    skillLabel: 'KOD WMS',
    skillCooldown: 6.5
  },
  ania_biuro: {
    id: 'ania_biuro',
    name: 'Ania z biura',
    icon: '📋',
    speed: 175,
    maxBattery: 100,
    magnet: 195,
    critBonus: 0.40, // Potężne krytyki celne SAD
    attackSpeedMult: 1.15,
    skillIcon: '❄️',
    skillLabel: 'BLOKADA',
    skillCooldown: 6.5
  },
  grzesiek_zastepca: {
    id: 'grzesiek_zastepca',
    name: 'Grzesiek (Z-ca Kiero)',
    icon: '☕',
    speed: 170,
    maxBattery: 140,
    magnet: 160,
    critBonus: 0.15,
    attackSpeedMult: 1.15,
    skillIcon: '🛡️',
    skillLabel: 'BHP',
    skillCooldown: 6.5
  }
};
let selectedCharKey = 'piotr';
let selectedGameMode = 'standard'; // 'standard' or 'endless'
let selectedArenaKey = 'main'; // 'main', 'freezer', 'crossdock'

function selectGameMode(mode, el) {
  selectedGameMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
  if (el) el.classList.add('selected');
}

function selectArena(arena, el) {
  selectedArenaKey = arena;
  document.querySelectorAll('.arena-card').forEach(a => a.classList.remove('selected'));
  if (el) el.classList.add('selected');
}

function selectCharacter(key, el) {
  selectedCharKey = key;
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
  if (el) el.classList.add('selected');
  const c = CHARACTERS[key];
  if (c) {
    const skillIcon = document.getElementById('skill-icon');
    if (skillIcon) skillIcon.innerText = c.skillIcon;
    const skillLabel = document.getElementById('skill-label');
    if (skillLabel) skillLabel.innerText = c.skillLabel;
    const badgeChar = document.getElementById('badge-char');
    if (badgeChar) badgeChar.innerText = `${c.icon} ${c.name.split(' ')[0]}`;
  }
}

// --- PLAYER STATE ---
const player = {
  x: ARENA_WIDTH / 2,
  y: ARENA_HEIGHT / 2,
  vx: 0,
  vy: 0,
  angle: 0,
  speed: 195,
  battery: 100,
  maxBattery: 100,
  radius: 22,
  invulnTimer: 0,
  skillCooldown: 0,
  maxSkillCooldown: 7,
  detentionCooldown: 0,
  maxDetentionCooldown: 18,
  magnetRange: 180,
  critChance: 0.1,
  shield: 0,
  isDashing: false,
  dashTimer: 0,
  isForklift: true,
  hasForklift: true,
  wantsForklift: true,
  stamina: 100,
  staminaLock: false,
  maxStamina: 100,
  regenRate: 0
};

const COMBO_TIMEOUT = 2.5;

function addCombo() {
  comboCount++;
  comboTimer = COMBO_TIMEOUT;
  if (comboCount % 10 === 0) {
    spawnDamageText(player.x, player.y - 60, `COMBO x${comboCount}!`, '#facc15', true);
    screenShake = Math.min(screenShake + 2, 10);
  }
}

// --- WEAPONS & PASSIVES ---
const weapons = {
  scanner: { level: 1, timer: 0, cooldown: 0.75, damage: 32, range: 450, pierce: 2, icon: '🔦', isEvo: false },
  toiletPaper: { level: 0, timer: 0, cooldown: 0.8, damage: 45, speed: 450, count: 4, icon: '🧻', isEvo: false },
  stretchAura: { level: 0, angle: 0, damage: 22, radius: 100, count: 2, icon: '🌀', isEvo: false },
  pallets: { level: 0, timer: 0, cooldown: 1.5, damage: 75, speed: 420, icon: '🪵', isEvo: false },
  extinguisher: { level: 0, timer: 0, cooldown: 2.2, damage: 40, range: 260, icon: '🧯', isEvo: false },
  zipTies: { level: 0, timer: 0, cooldown: 1.0, damage: 28, speed: 480, icon: '🔗', isEvo: false },
  cutter: { level: 0, timer: 0, cooldown: 0.55, damage: 18, speed: 560, icon: '🔪', isEvo: false },
  stapler: { level: 0, timer: 0, cooldown: 0.85, damage: 35, speed: 520, count: 3, icon: '📌', isEvo: false },
  sledgehammer: { level: 0, timer: 0, cooldown: 2.4, damage: 95, radius: 150, icon: '🔨', isEvo: false },
  faktura: { level: 0, timer: 0, cooldown: 1.2, damage: 90, speed: 500, icon: '📄', isEvo: false },
  kawa: { level: 0, timer: 0, cooldown: 3.0, damage: 15, radius: 120, icon: '☕', isEvo: false },
  hydrant: { level: 0, timer: 0, cooldown: 1.6, damage: 65, range: 400, icon: '🚰', isEvo: false },
  megafon: { level: 0, timer: 0, cooldown: 2.1, damage: 40, range: 250, icon: '📢', isEvo: false }
};

const passives = {
  magnet: { level: 0, max: 3, name: 'Certyfikat ISO', icon: '📜', desc: '+60% zasięgu przyciągania XP (+Area Zasięg)' },
  forks: { level: 0, max: 3, name: 'Protokół BHP', icon: '📋', desc: '+40% obrażeń od taranowania (+Duration Czas)' },
  coffee: { level: 0, max: 3, name: 'Smar Syntetyczny', icon: '🛢️', desc: '+15% prędkości ruchu (+Speed Ruch)' },
  battery: { level: 0, max: 3, name: 'Super Bateria', icon: '🔋', desc: '+35% pojemności baterii (+Cooldown Szybkość)' },
  furia: { level: 0, max: 3, name: 'Furia Magazyniera', icon: '🤬', desc: '+25% Szybkości Ataku' },
  alkomat: { level: 0, max: 3, name: 'Unik przed Alkomatem', icon: '🍺', desc: '+15% szans na Unik' },
  stoperan: { level: 0, max: 3, name: 'Stoperan Przed Zmianą', icon: '💊', desc: '+30 do Max Baterii (HP)' },
  buty_robocze: { level: 0, max: 3, name: 'Buty Robocze S3', icon: '🥾', desc: 'Zadajesz obrażenia wrogom, którzy Cię dotkną' },
  karta_multisport: { level: 0, max: 3, name: 'Karta Multisport', icon: '💳', desc: 'Szybsza regeneracja wózka i prędkość +10' },
  paczek: { level: 0, max: 3, name: 'Pączek z Biedronki', icon: '🍩', desc: '+20% Szans na Krytyk i +25% dropu jedzenia/kawy' },
  kamizelka: { level: 0, max: 3, name: 'Kamizelka Odblaskowa', icon: '🦺', desc: '-25% Otrzymywanych Obrażeń i oślepianie wrogów' },
  umowa: { level: 0, max: 3, name: 'Umowa Czas Nieokreślony', icon: '📜', desc: '+25% XP i 1x Ochrona przed Śmiercią (Extra Life!)' }
};

// Evolutions Definitions
const EVOLUTIONS = {
  bramkaRFID: {
    id: 'bramkaRFID', name: '📡 Przemysłowa Bramka RFID', icon: '⚡', reqWeapon: 'scanner', reqPassive: 'battery',
    desc: 'Emituje stałą, obrotową siatkę laserową. Wrogowie dropią +50% XP!'
  },
  owijarka: {
    id: 'owijarka', name: '🌀 Automatyczna Owijarka', icon: '🧻', reqWeapon: 'toiletPaper', reqPassive: 'magnet',
    desc: 'Stały pierścień ze streczu. Unieruchamia i detonuje wrogów!'
  },
  btHighStack: {
    id: 'btHighStack', name: '🚜 Wózek BT High-Stack', icon: '🪵', reqWeapon: 'pallets', reqPassive: 'coffee',
    desc: 'Zostawia ślad śliskiego oleju i automatycznie taranuje wrogów!'
  },
  zraszacz: {
    id: 'zraszacz', name: '❄️ System Zraszaczowy PPOŻ', icon: '🧯', reqWeapon: 'extinguisher', reqPassive: 'forks',
    desc: 'Co 10s mrozi WSZYSTKICH wrogów na ekranie!'
  },
  steelTies: {
    id: 'steelTies', name: '🔗 Stalowe Trytytki', icon: '🔗', reqWeapon: 'zipTies', reqPassive: 'magnet',
    desc: 'Zatrzymuje wrogów na wieki i przebija tłumy!'
  },
  machete: {
    id: 'machete', name: '🔪 Ostrze Stanley Max', icon: '🔪', reqWeapon: 'cutter', reqPassive: 'forks',
    desc: 'Ostre jak brzytwa ostrza latające po całej hali!'
  },
  staplerGun: {
    id: 'staplerGun', name: '💥 Pneumatyczny Działobit', icon: '📌', reqWeapon: 'stapler', reqPassive: 'battery',
    desc: 'Nieustanna salwa rykoszetujących klamer stalowych!'
  },
hydraulicHammer: {
    id: 'hydraulicHammer', name: '🚜 Hydrauliczny Młot Burzący', icon: '🔨', reqWeapon: 'sledgehammer', reqPassive: 'coffee',
    desc: 'Wstrząsa całym ekranem, miażdży przeszkody i tworzy kratery!'
  },
  urzadSkarbowy: {
    id: 'urzadSkarbowy', name: '🏢 Urząd Skarbowy (KAS)', icon: '📄', reqWeapon: 'faktura', reqPassive: 'alkomat',
    desc: 'Wystrzeliwuje zmasowane, samonaprowadzające wezwania do zapłaty!'
  },
  redbull: {
    id: 'redbull', name: '🦅 Energetyk z Żabki', icon: '☕', reqWeapon: 'kawa', reqPassive: 'furia',
    desc: 'Rozlewa radioaktywny kwas niszczący bossów i daje permanentne przyspieszenie!'
  }
};

let enemies = [];
let projectiles = [];
let dropItems = [];
let speechBubbles = [];
let obstacles = [];
let toitoiMech = null;
const skidMarks = [];
const MAX_SKIDS = 400;
function addSkidMark(x, y, angle) {
  skidMarks.push({ x, y, angle, life: 25.0, maxLife: 25.0 });
  if (skidMarks.length > MAX_SKIDS) skidMarks.shift();
}

function drawSkidMarks(ctx) {
  if (!skidMarks || skidMarks.length === 0) return;
  const zoom = camera.zoom || 0.5;
  const viewW = gameWidth / zoom;
  const viewH = gameHeight / zoom;

  ctx.save();
  for (let i = 0; i < skidMarks.length; i++) {
    const s = skidMarks[i];
    if (s.x < camera.x - 30 || s.x > camera.x + viewW + 30 ||
        s.y < camera.y - 30 || s.y > camera.y + viewH + 30) {
      continue;
    }
    const alpha = Math.max(0, Math.min(0.24, s.life / s.maxLife * 0.24));
    ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    ctx.fillRect(-6, -7, 12, 3);
    ctx.fillRect(-6, 4, 12, 3);
    ctx.restore();
  }
  ctx.restore();
}

// Object pools for zero-allocation performance
const MAX_PARTICLES = 350;
const particlePool = [];
for (let i = 0; i < MAX_PARTICLES; i++) {
  particlePool.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 2, color: '#f59e0b', active: false });
}
function spawnParticle(x, y, vx, vy, life, size, color) {
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particlePool[i];
    if (!p.active) {
      p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = life; p.maxLife = life; p.size = size; p.color = color;
      p.active = true;
      return;
    }
  }
}
function createSparks(x, y, count, color = '#f59e0b') {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 5 + 2;
    spawnParticle(x, y, Math.cos(a) * s, Math.sin(a) * s, 0.15 + Math.random() * 0.15, Math.random() * 2.5 + 1.5, color);
  }
}

const MAX_FLOATING_TEXTS = 80;
const floatingTexts = [];
for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
  floatingTexts.push({ x: 0, y: 0, text: '', color: '#fff', life: 0, maxLife: 0.4, active: false });
}
function spawnDamageText(x, y, text, color = '#fbbf24', isCrit = false) {
  for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
    const ft = floatingTexts[i];
    if (!ft.active) {
      ft.x = x + (Math.random() * 20 - 10);
      ft.y = y + (Math.random() * 10 - 5);
      ft.text = text;
      ft.color = color;
      ft.isCrit = isCrit;
      ft.life = 0.4;
      ft.maxLife = 0.4;
      ft.active = true;
      return;
    }
  }
}

function spawnDamageNumber(x, y, amount, isCrit = false) {
  const safeVal = isNaN(amount) || amount === undefined ? 10 : Math.round(amount);
  spawnDamageText(x, y, safeVal, isCrit ? '#ef4444' : '#fbbf24', isCrit);
}

// Room Database Cache
let roomScores = [];
let roomAchievements = [];

window.onRoomDataLoaded = function(data) {
  if (data.scores) { roomScores = data.scores; renderScoresTab(); }
  if (data.achievements) { roomAchievements = data.achievements; renderAchievementsTab(); }
};

// --- OPTIONS & PAUSE SYSTEM ---
let sfxVolumeSetting = 1.0;
let motorVolumeSetting = 0.8;
let shadows3DSetting = true;
let vibrationSetting = true;

function showPauseTab(tabName) {
  ['options', 'build', 'guide', 'exit'].forEach(t => {
    const btn = document.getElementById('ptab-btn-' + t);
    const content = document.getElementById('ptab-content-' + t);
    if (btn) btn.classList.toggle('active', t === tabName);
    if (content) content.style.display = (t === tabName) ? 'block' : 'none';
  });
  if (tabName === 'build') renderPauseScreen();
}

function updateSfxVolume(val) {
  sfxVolumeSetting = val / 100.0;
  const lbl = document.getElementById('lbl-sfx-vol');
  if (lbl) lbl.innerText = val + '%';
  if (sounds && sounds.setMasterVolume) sounds.setMasterVolume(sfxVolumeSetting);
}

function updateMotorVolume(val) {
  motorVolumeSetting = val / 100.0;
  const lbl = document.getElementById('lbl-motor-vol');
  if (lbl) lbl.innerText = val + '%';
  if (sounds && sounds.setMotorVolume) sounds.setMotorVolume(motorVolumeSetting);
}

function updateCameraZoomSetting(val) {
  const lbl = document.getElementById('lbl-zoom-vol');
  if (lbl) lbl.innerText = val + 'px';
  if (typeof camera !== 'undefined') {
    camera.zoom = Math.max(0.20, Math.min(0.55, 110 / parseFloat(val)));
  }
}

function toggle3DShadowsSetting() {
  shadows3DSetting = !shadows3DSetting;
  const btn = document.getElementById('btn-opt-shadows');
  if (btn) btn.innerText = "Cienie Decali: " + (shadows3DSetting ? "WŁĄCZONE" : "WYŁĄCZONE");
}

function toggleVibrationSetting() {
  vibrationSetting = !vibrationSetting;
  const btn = document.getElementById('btn-opt-vib');
  if (btn) btn.innerText = "Wibracje: " + (vibrationSetting ? "WŁĄCZONE" : "WYŁĄCZONE");
}

function confirmExitToMainMenu() {
  if (gameState === STATE.PAUSED) {
    document.getElementById('pause-screen').style.display = 'none';
    gameState = STATE.START;
    document.getElementById('start-screen').style.display = 'flex';
    if (window.AndroidBridge && window.AndroidBridge.saveGameScore) {
      try {
        window.AndroidBridge.saveGameScore(score, kills, playerLevel, Math.floor(gameTime), "00:00", false);
      } catch(e) {}
    }
  }
}

// Keyboard shortcuts for Pause (ESC / P)
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' || e.code === 'KeyP') {
    if (gameState === STATE.PLAYING || gameState === STATE.PAUSED) {
      togglePause();
    }
  }
});

// Floating UI Overlay updating (Damage texts & Speech Bubbles are rendered on 2D Canvas)
function updateFloatingUiOverlays() {
  // Disabled DOM updates for ultra-smooth 120 FPS performance
}

window.onAndroidReady = function() {
  console.log("ANDROID READY SIGNAL RECEIVED");
  document.body.classList.add('android-native-bridge');
  resizeCanvas(); // One more resize when Android is ready
  if (window.AndroidBridge && window.AndroidBridge.requestInitialData) {
    window.AndroidBridge.requestInitialData();
  }
};
if (window.AndroidBridge) {
  document.body.classList.add('android-native-bridge');
  if (window.AndroidBridge.requestInitialData) {
    window.AndroidBridge.requestInitialData();
  }
}

window.toggleZoom = function() {
  if (typeof camera !== 'undefined') {
    if (camera.zoom >= 0.35) camera.zoom = 0.25;
    else if (camera.zoom >= 0.28) camera.zoom = 0.35;
    else camera.zoom = 0.30;
    const el = document.getElementById('badge-zoom-label');
    if (el) el.innerText = camera.zoom.toFixed(2) + 'x';
  }
};

window.togglePause = function() {
  if (typeof togglePause === 'function') {
    togglePause();
  }
};

window.toggleFpsDetails = function() {
  const panel = document.getElementById('fps-monitor-details');
  if (panel) {
    panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
  }
};

const unlockedRunAchievements = new Set();

const ACHIEVEMENT_REWARDS = {
  first_blood: { text: '🎁 NAGRODA: +150 EXP', apply: () => { currentXP += 150; checkLevelUp(); } },
  coffee_addict: { text: '🎁 NAGRODA: Bateria 100% + 1000 Pkt', apply: () => { player.battery = player.maxBattery; score += 1000; } },
  combo_god: { text: '🎁 NAGRODA: Duży Zastrzyk Doświadczenia (+120 EXP)', apply: () => { currentXP += 120; checkLevelUp(); } },
  weapon_evolution: { text: '🎁 NAGRODA: +25% Obrażeń dla Wszystkich Broni', apply: () => { player.damageMult = (player.damageMult || 1.0) * 1.25; } },
  boss_grzesiek: { text: '🎁 NAGRODA: +20% Szybkości i Bateria 100%', apply: () => { player.speed += 0.5; player.battery = player.maxBattery; } },
  toitoi_evolution: { text: '🎁 NAGRODA: +40% Magnesu XP', apply: () => { player.magnetRange += 80; } },
  kontener_1559: { text: '🎁 NAGRODA: +3000 Pkt + Bateria 100%', apply: () => { score += 3000; player.battery = player.maxBattery; } },
  lights_out: { text: '🎁 NAGRODA: +15% Szansy na Krytyk', apply: () => { player.critChance += 0.15; } },
  kill_100: { text: '🎁 NAGRODA: +500 EXP + 1500 Pkt', apply: () => { currentXP += 500; score += 1500; checkLevelUp(); } },
  shift_master: { text: '🎁 NAGRODA: +10,000 Pkt Legendy DTA!', apply: () => { score += 10000; } }
};

const achievementQueue = [];
let isAchievementToastShowing = false;

function triggerAchievement(key, name, icon) {
  if (unlockedRunAchievements.has(key)) return;
  unlockedRunAchievements.add(key);

  const ach = roomAchievements.find(a => a.key === key);
  if (ach && !ach.unlocked) {
    ach.unlocked = true;
    renderAchievementsTab();
  }
  if (window.AndroidBridge && window.AndroidBridge.unlockAchievement) {
    window.AndroidBridge.unlockAchievement(key);
  }

  let rewardText = '';
  const reward = ACHIEVEMENT_REWARDS[key];
  if (reward) {
    reward.apply();
    rewardText = reward.text;
    createSparks(player.x, player.y, 35, '#facc15');
    screenShake = Math.max(screenShake, 8);
  }

  achievementQueue.push({ name, icon: icon || '🏆', rewardText });
  processAchievementQueue();
}

function processAchievementQueue() {
  if (isAchievementToastShowing || achievementQueue.length === 0) return;
  const item = achievementQueue.shift();
  isAchievementToastShowing = true;

  const toast = document.getElementById('ach-toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastName = document.getElementById('toast-name');
  if (toastIcon) toastIcon.innerText = item.icon;
  if (toastName) toastName.innerText = item.name + (item.rewardText ? ' (' + item.rewardText + ')' : '');

  if (toast) {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
    sounds.levelUp();
  }

  setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
    }
    setTimeout(() => {
      isAchievementToastShowing = false;
      processAchievementQueue();
    }, 350);
  }, 2800);
}

// --- WAREHOUSE PROPS & ENVIRONMENT SYSTEM ---
let rackCanvas = null;
let palletStackCanvas = null;

// ============================================================================
// 2.5D ISOMETRIC / AXONOMETRIC 3D ASSET ENGINE
// ============================================================================
function createRackSprite() {
  const rw = 160;
  const rh = 360;
  rackCanvas = document.createElement('canvas');
  rackCanvas.width = rw + 32;
  rackCanvas.height = rh + 32;
  const rctx = rackCanvas.getContext('2d');

  // 1. Massive 2.5D Extruded Cast Shadow across the Epoxy Floor
  rctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
  rctx.beginPath();
  rctx.moveTo(16, 20);
  rctx.lineTo(rw + 28, 20);
  rctx.lineTo(rw + 32, rh + 28);
  rctx.lineTo(24, rh + 28);
  rctx.closePath();
  rctx.fill();

  // 2. Base Footprint / Spill Tray on Ground
  rctx.fillStyle = '#090d16';
  rctx.fillRect(4, 4, rw, rh);
  rctx.strokeStyle = '#1e293b';
  rctx.lineWidth = 2;
  rctx.strokeRect(4, 4, rw, rh);

  // 3. Towering Heavy-Duty Steel Upright Columns (Słupy Nośne - Blue/Navy Steel)
  // Left Column Frame
  const colGradL = rctx.createLinearGradient(4, 0, 20, 0);
  colGradL.addColorStop(0, '#1e3a8a');
  colGradL.addColorStop(0.4, '#2563eb');
  colGradL.addColorStop(0.8, '#1d4ed8');
  colGradL.addColorStop(1, '#0f172a');
  rctx.fillStyle = colGradL;
  rctx.fillRect(4, 4, 16, rh);
  
  // Right Column Frame
  const colGradR = rctx.createLinearGradient(rw - 12, 0, rw + 4, 0);
  colGradR.addColorStop(0, '#1e3a8a');
  colGradR.addColorStop(0.4, '#2563eb');
  colGradR.addColorStop(0.8, '#1d4ed8');
  colGradR.addColorStop(1, '#0f172a');
  rctx.fillStyle = colGradR;
  rctx.fillRect(rw - 12, 4, 16, rh);

  // Punched Teardrop Slots down Uprights
  rctx.fillStyle = '#030712';
  for (let y = 16; y < rh - 10; y += 18) {
    rctx.fillRect(10, y, 4, 8);
    rctx.fillRect(rw - 6, y, 4, 8);
  }

  // Column Safety Bumper Protectors (BHP Yellow/Black Chevron Tape) at base
  for (let b = 0; b < 40; b += 8) {
    rctx.fillStyle = (b % 16 === 0) ? '#eab308' : '#0f172a';
    rctx.fillRect(4, rh - 40 + b, 16, 8);
    rctx.fillRect(rw - 12, rh - 40 + b, 16, 8);
  }

  // 4. 2.5D Shelf Bays with 3D Cargo Pallets
  const shelfCount = 5;
  const bayH = (rh - 24) / shelfCount;

  for (let s = 0; s < shelfCount; s++) {
    const bayY = 12 + s * bayH;

    // Heavy Industrial Cross-Beam (Trawers Pomarańczowy)
    const beamGrad = rctx.createLinearGradient(0, bayY + bayH - 14, 0, bayY + bayH);
    beamGrad.addColorStop(0, '#fed7aa'); // Top highlight catching overhead lighting
    beamGrad.addColorStop(0.3, '#f97316'); // Safety Orange
    beamGrad.addColorStop(0.8, '#ea580c');
    beamGrad.addColorStop(1, '#9a3412'); // Bottom shadow
    rctx.fillStyle = beamGrad;
    rctx.fillRect(16, bayY + bayH - 14, rw - 24, 14);

    // Locking Pins (Silver steel)
    rctx.fillStyle = '#e2e8f0';
    rctx.fillRect(17, bayY + bayH - 11, 4, 8);
    rctx.fillRect(rw - 13, bayY + bayH - 11, 4, 8);

    // Diagonal Wire Truss Bracing behind cargo
    rctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    rctx.lineWidth = 1.5;
    rctx.beginPath();
    rctx.moveTo(20, bayY); rctx.lineTo(rw - 12, bayY + bayH - 14);
    rctx.moveTo(rw - 12, bayY); rctx.lineTo(20, bayY + bayH - 14);
    rctx.stroke();

    // 3D Palletized Cargo on this shelf level:
    const cargoType = s % 3;
    if (cargoType === 0) {
      // --- 3D SHIPPING CARTONS (Euro Boxes with 3D tops, fronts, barcode labels) ---
      // Wooden Pallet Base
      rctx.fillStyle = '#b45309';
      rctx.fillRect(24, bayY + bayH - 18, rw - 40, 5);

      // Left Box
      rctx.fillStyle = '#fbbf24'; // Top
      rctx.fillRect(26, bayY + 6, 48, 14);
      rctx.fillStyle = '#d97706'; // Front
      rctx.fillRect(26, bayY + 20, 48, bayH - 38);
      rctx.fillStyle = '#b45309'; // Side
      rctx.fillRect(74, bayY + 6, 8, bayH - 24);
      // Shipping Label
      rctx.fillStyle = '#ffffff';
      rctx.fillRect(32, bayY + 26, 16, 10);
      rctx.fillStyle = '#0f172a';
      rctx.fillRect(34, bayY + 28, 12, 2);
      rctx.fillRect(34, bayY + 32, 12, 2);

      // Right Box (Shrink-wrapped high-value cargo)
      rctx.fillStyle = '#94a3b8'; // Top
      rctx.fillRect(88, bayY + 2, 54, 16);
      rctx.fillStyle = '#64748b'; // Front
      rctx.fillRect(88, bayY + 18, 54, bayH - 32);
      // Plastic gloss reflection
      rctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      rctx.fillRect(92, bayY + 20, 46, 6);
    } else if (cargoType === 1) {
      // --- 3D ADR HAZARDOUS CHEMICAL BARRELS (Metal Cylinders with Warning Diamonds) ---
      // Wooden Pallet Base
      rctx.fillStyle = '#92400e';
      rctx.fillRect(24, bayY + bayH - 18, rw - 40, 5);

      // 3 Steel Barrels in a row
      const barrelColors = ['#dc2626', '#0284c7', '#dc2626'];
      for (let b = 0; b < 3; b++) {
        const bx = 32 + b * 38;
        const by = bayY + 8;
        const bw = 30;
        const bh = bayH - 26;

        // Barrel Top Rim (Ellipse)
        rctx.fillStyle = '#cbd5e1';
        rctx.beginPath();
        rctx.ellipse(bx + bw / 2, by + 6, bw / 2, 5, 0, 0, Math.PI * 2);
        rctx.fill();
        // Barrel Top Lid
        rctx.fillStyle = barrelColors[b];
        rctx.beginPath();
        rctx.ellipse(bx + bw / 2, by + 6, bw / 2 - 2, 4, 0, 0, Math.PI * 2);
        rctx.fill();

        // Barrel Cylinder Body with 3D cylindrical lighting
        const bGrad = rctx.createLinearGradient(bx, 0, bx + bw, 0);
        bGrad.addColorStop(0, '#0f172a');
        bGrad.addColorStop(0.35, barrelColors[b]);
        bGrad.addColorStop(0.7, '#ffffff'); // Specular highlight line
        bGrad.addColorStop(0.85, barrelColors[b]);
        bGrad.addColorStop(1, '#090d16');
        rctx.fillStyle = bGrad;
        rctx.fillRect(bx, by + 6, bw, bh);

        // Metal reinforcing ribs
        rctx.fillStyle = '#0f172a';
        rctx.fillRect(bx, by + bh * 0.38, bw, 2);
        rctx.fillRect(bx, by + bh * 0.68, bw, 2);

        // Hazard Diamond Label
        rctx.fillStyle = '#fef08a';
        rctx.beginPath();
        rctx.moveTo(bx + bw / 2, by + 16);
        rctx.lineTo(bx + bw / 2 + 6, by + 22);
        rctx.lineTo(bx + bw / 2, by + 28);
        rctx.lineTo(bx + bw / 2 - 6, by + 22);
        rctx.closePath();
        rctx.fill();
      }
    } else {
      // --- 3D HIGH-DENSITY EPAL PALLET STACK ---
      rctx.fillStyle = '#b45309';
      for (let p = 0; p < 4; p++) {
        const py = bayY + 12 + p * 8;
        rctx.fillRect(28, py, rw - 48, 5);
        rctx.fillStyle = '#78350f';
        rctx.fillRect(32, py + 5, 8, 3);
        rctx.fillRect(rw / 2 - 4, py + 5, 8, 3);
        rctx.fillRect(rw - 28, py + 5, 8, 3);
      }
    }
  }

  // 5. Top Aisle Identification Sign (Plakietka Alei Regałowej)
  rctx.fillStyle = '#0284c7';
  rctx.fillRect(rw / 2 - 32, 6, 64, 16);
  rctx.strokeStyle = '#38bdf8';
  rctx.lineWidth = 1;
  rctx.strokeRect(rw / 2 - 32, 6, 64, 16);
  rctx.fillStyle = '#ffffff';
  rctx.font = 'bold 8.5px sans-serif';
  rctx.textAlign = 'center';
  rctx.fillText('DTA R-08', rw / 2, 18);
  rctx.textAlign = 'left';
}

function createPalletStackSprite() {
  const pw = 68;
  const ph = 68;
  palletStackCanvas = document.createElement('canvas');
  palletStackCanvas.width = pw + 16;
  palletStackCanvas.height = ph + 16;
  const pctx = palletStackCanvas.getContext('2d');

  // 2.5D Drop Shadow
  pctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  pctx.fillRect(10, 12, pw, ph);

  // 4 Tiers of 3D Euro Pallets stacked with visible blocks & deck boards
  for (let i = 0; i < 4; i++) {
    const offX = 4 + i * 1.5;
    const offY = 4 + i * 2;
    const w = 58;
    const h = 58;

    // Pallet Base Skids
    pctx.fillStyle = '#78350f';
    pctx.fillRect(offX, offY + 4, w, h);

    // 9 Spacer Blocks
    pctx.fillStyle = '#92400e';
    pctx.fillRect(offX + 2, offY + 2, 8, 8);
    pctx.fillRect(offX + w / 2 - 4, offY + 2, 8, 8);
    pctx.fillRect(offX + w - 10, offY + 2, 8, 8);

    // Top Deck Boards with Gaps (Bevelled Wood)
    const boardGrad = pctx.createLinearGradient(offX, 0, offX + w, 0);
    boardGrad.addColorStop(0, '#b45309');
    boardGrad.addColorStop(0.5, '#d97706');
    boardGrad.addColorStop(1, '#92400e');
    pctx.fillStyle = boardGrad;
    
    for (let b = 0; b < 5; b++) {
      const by = offY + b * 11;
      pctx.fillRect(offX, by, w, 9);
      pctx.strokeStyle = '#f59e0b';
      pctx.lineWidth = 0.8;
      pctx.strokeRect(offX, by, w, 9);
    }
  }

  // EPAL Stencil Stamp
  pctx.fillStyle = '#fef08a';
  pctx.font = 'bold 8px sans-serif';
  pctx.fillText('EPAL', 16, 32);
}

function initWarehouse() {
  obstacles = [];
  warehouseDocks = [];
  warehouseStencils = [];
  warehousePuddles = [];
  warehouseLights = [];
  warehouseConveyors = [];
  warehouseHeaters = [];

  if (selectedArenaKey === 'freezer') {
    // Chłodnia Mrożonek -25°C: Ice aisles, freezing cooling units, warm heater fans
    for (let rx = 380; rx < ARENA_WIDTH - 380; rx += 580) {
      for (let ry = 400; ry < ARENA_HEIGHT - 400; ry += 640) {
        obstacles.push({ x: rx, y: ry, w: 140, h: 320, type: 'rack', isFrozen: true });
      }
    }
    // Heater Fans (Oaza Ciepła BHP - heals battery)
    warehouseHeaters.push(
      { x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2, radius: 110, pulse: 0 },
      { x: 600, y: 700, radius: 95, pulse: 0 },
      { x: ARENA_WIDTH - 600, y: ARENA_HEIGHT - 700, radius: 95, pulse: 0 }
    );
    // Frost Stencils
    warehouseStencils = [
      { x: 300, y: 150, text: '❄️ CHŁODNIA GŁĘBOKIEGO MROŻENIA -25°C', color: 'rgba(56, 189, 248, 0.6)', font: '900 16px sans-serif' },
      { x: 1200, y: 150, text: '⚠️ OBLODZENIE POSADZKI: UŻYWAJ ŁAŃCUCHÓW BT', color: 'rgba(147, 197, 253, 0.6)', font: '900 15px sans-serif' },
      { x: 800, y: 1200, text: '🔥 OAZA CIEPŁA BHP (REGENERACJA)', color: 'rgba(251, 146, 60, 0.6)', font: '900 16px sans-serif' },
      { x: 1800, y: 2000, text: 'STREFA SUB-ZERO: NIE ZATRZYMUJ WÓZKA!', color: 'rgba(56, 189, 248, 0.5)', font: '900 16px sans-serif' }
    ];
  } else if (selectedArenaKey === 'crossdock') {
    // Cross-Dock 24H: Dynamic conveyor belts pushing items, fast docks on both North & South!
    warehouseConveyors = [
      { x: 300, y: 650, w: 1800, h: 50, vx: 160, vy: 0, title: 'TAŚMOCIĄG EXPRESS ➔' },
      { x: 300, y: 1450, w: 1800, h: 50, vx: -160, vy: 0, title: 'TAŚMOCIĄG ZWROTÓW ⬅️' },
      { x: 1200, y: 300, w: 50, h: 1800, vx: 0, vy: 150, title: 'TRANZYT ⬇️' }
    ];
    // Racks along perimeter
    for (let rx = 240; rx < ARENA_WIDTH - 240; rx += 480) {
      obstacles.push({ x: rx, y: 350, w: 90, h: 180, type: 'rack' });
      obstacles.push({ x: rx, y: 1950, w: 90, h: 180, type: 'rack' });
    }
    // Pallet stacks in staging areas
    for (let rx = 400; rx < ARENA_WIDTH - 400; rx += 420) {
      obstacles.push({ x: rx, y: 1050, w: 50, h: 50, type: 'pallet_stack' });
    }
    warehouseStencils = [
      { x: 400, y: 150, text: '🏗️ CENTRUM PRZEŁADUNKOWE CROSS-DOCK 24H', color: 'rgba(245, 158, 11, 0.6)', font: '900 16px sans-serif' },
      { x: 1400, y: 150, text: '⚡ TRANZYT NATYCHMIASTOWY BEZ SKŁADOWANIA', color: 'rgba(239, 68, 68, 0.5)', font: '900 15px sans-serif' },
      { x: 500, y: 720, text: '➔ KIERUNEK PRZEPŁYWU TOWARU ➔', color: 'rgba(56, 189, 248, 0.5)', font: '900 14px sans-serif' },
      { x: 500, y: 1520, text: '⬅️ KIERUNEK KONTROLI CELNEJ ⬅️', color: 'rgba(168, 85, 247, 0.5)', font: '900 14px sans-serif' }
    ];
  } else {
    // Standard Hala Główna DTA Graniczna 8f - MUCH MORE OPEN SPACE
    for (let rx = 500; rx < ARENA_WIDTH - 500; rx += 900) {
      for (let ry = 600; ry < ARENA_HEIGHT - 600; ry += 850) {
        if (Math.random() < 0.8) {
           obstacles.push({ x: rx, y: ry, w: 160, h: 360, type: "rack" });
        }
      }
    }
    for (let rx = 250; rx < ARENA_WIDTH - 250; rx += 700) {
      for (let ry = 300; ry < ARENA_HEIGHT - 300; ry += 800) {
        if (Math.random() < 0.6) {
           obstacles.push({ x: rx, y: ry, w: 60, h: 60, type: "pallet_stack" });
        }
      }
    }
    warehouseStencils = [
      { x: 300, y: 150, text: 'STOP 🛑 WÓZKI WIDŁOWE', color: 'rgba(239, 68, 68, 0.45)', font: '900 16px sans-serif' },
      { x: 1200, y: 150, text: '⚠️ STREFA ROZŁADUNKU DTA', color: 'rgba(245, 158, 11, 0.45)', font: '900 16px sans-serif' },
      { x: 2100, y: 150, text: 'MAX 5 KM/H 🚜', color: 'rgba(56, 189, 248, 0.45)', font: '900 16px sans-serif' },
      { x: 800, y: 800, text: 'ALEJA 8F (ODPRAWY SAD)', color: 'rgba(245, 158, 11, 0.35)', font: '900 18px sans-serif' },
      { x: 1800, y: 800, text: 'STREFA ODKŁADCZA EPAL', color: 'rgba(56, 189, 248, 0.35)', font: '900 18px sans-serif' },
      { x: 1300, y: 1500, text: 'STREFA BEZPIECZEŃSTWA BHP', color: 'rgba(74, 222, 128, 0.35)', font: '900 18px sans-serif' },
      { x: 600, y: 2200, text: '⚠️ UWAGA: CZUJNIKI WMS', color: 'rgba(239, 68, 68, 0.4)', font: '900 16px sans-serif' },
      { x: 2000, y: 2200, text: 'MAGAZYN WYSOKIEGO SKŁADU', color: 'rgba(168, 85, 247, 0.35)', font: '900 18px sans-serif' }
    ];
  }

  // Loading Docks along North Wall
  const dockCount = 6;
  const dockSpacing = ARENA_WIDTH / (dockCount + 1);
  for (let i = 1; i <= dockCount; i++) {
    warehouseDocks.push({
      x: i * dockSpacing - 80,
      y: 0,
      w: 160,
      h: 55,
      dockNum: i,
      title: i === 1 ? 'RAMPA 1: CELNA DTA' : i === 2 ? 'RAMPA 2: EXPRESS' : i === 3 ? 'RAMPA 3: KONTENERY' : i === 4 ? 'RAMPA 4: CHŁODNIA' : `RAMPA ${i}: ODBIÓR`,
      active: i % 2 === 0
    });
  }

  // Coolant & Oil Sheen Puddles
  warehousePuddles = [
    { x: 550, y: 480, rx: 50, ry: 25, color: 'rgba(56, 189, 248, 0.12)' },
    { x: 1450, y: 920, rx: 70, ry: 35, color: 'rgba(245, 158, 11, 0.12)' },
    { x: 2300, y: 600, rx: 60, ry: 30, color: 'rgba(74, 222, 128, 0.12)' },
    { x: 950, y: 1750, rx: 80, ry: 40, color: 'rgba(168, 85, 247, 0.12)' },
    { x: 1900, y: 1950, rx: 65, ry: 32, color: 'rgba(56, 189, 248, 0.12)' }
  ];

  // Overhead Fluorescent Industrial Lamps
  for (let lx = 260; lx < ARENA_WIDTH; lx += 450) {
    for (let ly = 260; ly < ARENA_HEIGHT; ly += 450) {
      warehouseLights.push({ x: lx, y: ly, flicker: Math.random() });
    }
  }

  // Spawn stationary smelly ToiToi in the corner
  obstacles.push({
    x: 580,
    y: 580,
    w: 64,
    h: 64,
    type: 'toitoi_station',
    smellTimer: 0
  });
}
initWarehouse();

// --- BREAKABLE WAREHOUSE PROPS (Vampire Survivors Light Sources / Crates) ---
let mapProps = [];
const PROP_DEFINITIONS = {
  coffee: { name: 'Dystrybutor Kawa Tchibo', icon: '☕', hp: 20, radius: 18, color: '#b45309', border: '#f59e0b' },
  crate: { name: 'Skrzynia Drewniana EPAL', icon: '📦', hp: 30, radius: 20, color: '#d97706', border: '#78350f' },
  firstaid: { name: 'Ścienna Apteczka BHP', icon: '🩹', hp: 15, radius: 16, color: '#ef4444', border: '#fee2e2' },
  extinguisher: { name: 'Gaśnica Ścienna CO2', icon: '🧯', hp: 25, radius: 18, color: '#06b6d4', border: '#cffafe' },
  propane: { name: 'Butla Propan-Butan UDT', icon: '🛢️', hp: 20, radius: 18, color: '#dc2626', border: '#fca5a5' },
  oil_barrel: { name: 'Beczka Oleju BT Reflex', icon: '🛢️', hp: 25, radius: 20, color: '#1e293b', border: '#facc15' },
  pallet_stack: { name: 'Wysoki Skład Palet EPAL', icon: '🪵', hp: 40, radius: 22, color: '#92400e', border: '#fbbf24' }
};

function initMapProps() {
  mapProps = [];
  const propTypes = ['coffee', 'crate', 'crate', 'firstaid', 'extinguisher', 'propane', 'oil_barrel', 'pallet_stack'];
  const count = 35;
  for (let i = 0; i < count; i++) {
    spawnRandomProp(propTypes[i % propTypes.length]);
  }
}

function spawnRandomProp(typeKey) {
  const def = PROP_DEFINITIONS[typeKey] || PROP_DEFINITIONS.crate;
  const x = 180 + Math.random() * (ARENA_WIDTH - 360);
  const y = 180 + Math.random() * (ARENA_HEIGHT - 360);
  mapProps.push({
    x: x,
    y: y,
    type: typeKey,
    def: def,
    hp: def.hp,
    maxHp: def.hp,
    radius: def.radius,
    hitFlash: 0,
    dead: false
  });
}

function damageProp(p, dmg) {
  if (p.dead) return;
  p.hp -= dmg;
  p.hitFlash = 0.12;
  createSparks(p.x, p.y, 5, p.def.border);
  if (p.hp <= 0) {
    destroyProp(p);
  }
}

function destroyProp(p) {
  p.dead = true;
  sounds.shatterProp();
  screenShake = Math.max(screenShake, 6);
  createSparks(p.x, p.y, 20, p.def.color);
  
  if (p.type === 'coffee') {
    dropItems.push({ x: p.x, y: p.y, type: 'coffee_thermos', life: 25 });
    addSpeechBubble(p.x, p.y - 20, '☕ KAWA Z DYSTRYBUTORA!', '#f59e0b');
  } else if (p.type === 'crate') {
    for (let k = 0; k < 3; k++) {
      dropItems.push({
        x: p.x + (Math.random() - 0.5) * 30,
        y: p.y + (Math.random() - 0.5) * 30,
        type: 'barcode_xp',
        val: 12 + Math.floor(Math.random() * 8),
        life: 25
      });
    }
    if (Math.random() < 0.45) {
      dropItems.push({ x: p.x, y: p.y, type: 'dta_coin', val: 25, life: 25 });
    }
  } else if (p.type === 'firstaid') {
    dropItems.push({ x: p.x, y: p.y, type: 'hotdog', life: 25 });
    addSpeechBubble(p.x, p.y - 20, '🩹 APTECZKA BHP! HOTDOG!', '#4ade80');
  } else if (p.type === 'extinguisher') {
    sounds.freeze();
    screenShake = 10;
    createSparks(p.x, p.y, 35, '#38bdf8');
    addSpeechBubble(p.x, p.y - 25, '❄️ EKSPLOZJA GAŚNICY CO2!', '#38bdf8');
    enemies.forEach(e => {
      if (!e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 240) {
        damageEnemy(e, 75, 'general');
        e.slowTimer = 4.0;
        createSparks(e.x, e.y, 8, '#67e8f9');
      }
    });
    dropItems.push({ x: p.x, y: p.y, type: 'barcode_xp', val: 25, life: 25 });
  } else if (p.type === 'propane') {
    sounds.bossAlert();
    screenShake = 16;
    createSparks(p.x, p.y, 50, '#ef4444');
    addSpeechBubble(p.x, p.y - 25, '💥 EKSPLOZJA BUTLI PROPAN-BUTAN!', '#ef4444');
    enemies.forEach(e => {
      if (!e.dead) {
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d < 260) {
          damageEnemy(e, 220, 'general');
          e.hitFlash = 0.3;
          e.x += ((e.x - p.x) / (d || 1)) * 90;
          e.y += ((e.y - p.y) / (d || 1)) * 90;
          createSparks(e.x, e.y, 14, '#f97316');
        }
      }
    });
    for (let k = 0; k < 15; k++) {
      spawnParticle(p.x, p.y, (Math.random() - 0.5) * 180, (Math.random() - 0.5) * 180, 0.6, 6, '#ef4444');
    }
  } else if (p.type === 'oil_barrel') {
    sounds.hit();
    createSparks(p.x, p.y, 25, '#facc15');
    addSpeechBubble(p.x, p.y - 20, '🛢️ ROZLANY OLEJ PRZEKŁADNIOWY!', '#facc15');
    projectiles.push({
      type: 'oil_trail',
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      damage: 18,
      life: 12.0
    });
    enemies.forEach(e => {
      if (!e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 140) {
        e.slowTimer = 5.0;
      }
    });
    if (Math.hypot(player.x - p.x, player.y - p.y) < 150) {
      player.speedBonusTimer = 3.5;
      addSpeechBubble(player.x, player.y - 30, '🏎️ TURBO DRIFT PO OLEJU!', '#38bdf8');
    }
  } else if (p.type === 'pallet_stack') {
    sounds.pallet();
    screenShake = 12;
    createSparks(p.x, p.y, 35, '#d97706');
    addSpeechBubble(p.x, p.y - 25, '🪵 ZAWALENIE STOSU PALET!', '#fbbf24');
    enemies.forEach(e => {
      if (!e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 180) {
        damageEnemy(e, 140, 'general');
        e.stunTimer = 2.0;
        createSparks(e.x, e.y, 10, '#f59e0b');
      }
    });
    for (let k = 0; k < 4; k++) {
      dropItems.push({
        x: p.x + (Math.random() - 0.5) * 40,
        y: p.y + (Math.random() - 0.5) * 40,
        type: 'barcode_xp',
        val: 18,
        life: 25
      });
    }
    dropItems.push({ x: p.x, y: p.y, type: 'dta_coin', val: 35, life: 25 });
  }
}

function updateMapProps(dt) {
  for (let i = mapProps.length - 1; i >= 0; i--) {
    const p = mapProps[i];
    if (p.hitFlash > 0) p.hitFlash -= dt;
    if (p.dead) {
      mapProps.splice(i, 1);
    }
  }
  if (mapProps.length < 28) {
    const keys = ['coffee', 'crate', 'firstaid', 'extinguisher', 'propane', 'oil_barrel', 'pallet_stack'];
    spawnRandomProp(keys[Math.floor(Math.random() * keys.length)]);
  }
}

function drawMapProps(ctx, viewW, viewH) {
  for (let i = 0; i < mapProps.length; i++) {
    const p = mapProps[i];
    if (p.x < camera.x - 60 || p.x > camera.x + viewW + 60 ||
        p.y < camera.y - 60 || p.y > camera.y + viewH + 60) {
      continue;
    }

    ctx.save();
    if (p.type === 'laser') {
      // It has x1, y1, x2, y2 instead of x, y
      ctx.strokeStyle = p.color || '#ef4444';
      ctx.lineWidth = p.width || (p.isEvo ? 5 : 2);
      ctx.globalAlpha = Math.max(0, p.life / 0.15); // fade out
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.stroke();
      ctx.restore();
      continue;
    }
    
    // Default translation for others
    ctx.translate(p.x, p.y);

    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 8, p.radius * 1.1, p.radius * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    if (p.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, p.radius + 2, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = p.def.color;
    ctx.beginPath();
    ctx.roundRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2, 6);
    ctx.fill();
    ctx.strokeStyle = p.def.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = `${Math.round(p.radius * 1.1)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.def.icon, 0, 1);

    if (p.hp < p.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(-p.radius, -p.radius - 8, p.radius * 2, 4);
      ctx.fillStyle = '#22c55e';
      const fillW = Math.max(0, (p.hp / p.maxHp) * (p.radius * 2));
      ctx.fillRect(-p.radius, -p.radius - 8, fillW, 4);
    }

    ctx.restore();
  }
}

// --- LUCKY CARGO CHESTS (Vampire Survivors Chest System) ---
let chestPendingRewards = [];

function openLuckyChest(tier = 1) {
  gameState = STATE.CHEST;
  sounds.chestFanfare();
  screenShake = 12;

  const modal = document.getElementById('chest-screen');
  const animBox = document.getElementById('chest-anim-box');
  const statusEl = document.getElementById('chest-status-text');
  const slotsContainer = document.getElementById('chest-slots');
  const btnClaim = document.getElementById('btn-claim-chest');

  modal.style.display = 'flex';
  animBox.innerHTML = '🎁';
  statusEl.innerText = '⚡ OTWIERANIE ZŁOTEJ PALETY DTA...';
  slotsContainer.innerHTML = '';
  btnClaim.style.display = 'none';

  const roll = Math.random();
  let rewardCount = 1;
  if (roll < 0.08 || tier >= 3) rewardCount = 5;
  else if (roll < 0.38 || tier >= 2) rewardCount = 3;

  chestPendingRewards = [];

  const evoOpts = [];
  Object.keys(EVOLUTIONS).forEach(evoKey => {
    const evo = EVOLUTIONS[evoKey];
    const w = weapons[evo.reqWeapon];
    const p = passives[evo.reqPassive];
    if (w && w.level >= 5 && p && p.level >= 1 && !w.isEvo) {
      evoOpts.push({ type: 'evo', data: evo });
    }
  });

  const upgradePool = [];
  Object.keys(weapons).forEach(k => {
    const w = weapons[k];
    if (w && w.level < 5 && !w.isEvo) {
      upgradePool.push({ cat: 'weapon', id: k, name: k.toUpperCase(), icon: w.icon || '⚔️', desc: 'Zwiększenie poziomu, obrażeń i prędkości.' });
    }
  });
  Object.keys(passives).forEach(k => {
    const p = passives[k];
    const maxLvl = p.max || 3;
    if (p && p.level < maxLvl) {
      upgradePool.push({ cat: 'passive', id: k, name: p.name, icon: p.icon, desc: p.desc });
    }
  });
  if (upgradePool.length === 0) {
    upgradePool.push({ cat: 'passive', id: 'battery', name: passives.battery.name, icon: passives.battery.icon, desc: '+50 Max Baterii & Pełne Doładowanie' });
  }

  for (let i = 0; i < rewardCount; i++) {
    if (evoOpts.length > 0 && Math.random() < 0.5) {
      chestPendingRewards.push(evoOpts.pop());
    } else {
      const pick = upgradePool[Math.floor(Math.random() * upgradePool.length)];
      chestPendingRewards.push({ type: 'upgrade', data: pick });
    }
  }

  const coinBonus = 150 * rewardCount;
  dtaCoins += coinBonus;
  saveWorkshopData();

  let slotIdx = 0;
  function revealNextSlot() {
    if (slotIdx < chestPendingRewards.length) {
      sounds.chestSlot();
      const item = chestPendingRewards[slotIdx];
      const card = document.createElement('div');
      card.className = 'chest-reward-card';
      if (item.type === 'evo') {
        card.style.borderColor = '#f59e0b';
        card.style.background = 'linear-gradient(135deg, rgba(120, 53, 15, 0.95), rgba(30, 58, 138, 0.95))';
        card.innerHTML = `
          <div style="font-size:28px;">${item.data.icon}</div>
          <div>
            <div style="font-weight:900; color:#fef08a; font-size:14px;">★ ${item.data.name}</div>
            <div style="font-size:11px; color:#f8fafc;">${item.data.desc}</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div style="font-size:28px;">${item.data.icon}</div>
          <div>
            <div style="font-weight:900; color:#38bdf8; font-size:13.5px;">${item.data.name} (+1 POZ)</div>
            <div style="font-size:11px; color:#e2e8f0;">${item.data.desc}</div>
          </div>
        `;
      }
      slotsContainer.appendChild(card);
      slotIdx++;
      setTimeout(revealNextSlot, 350);
    } else {
      animBox.innerHTML = '✨📦✨';
      statusEl.innerHTML = `🎉 ZNALEZIONO <b>${rewardCount}x ULEPSZEŃ</b> + <b>💰 ${coinBonus} MONET DTA</b>!`;
      btnClaim.style.display = 'block';
    }
  }

  setTimeout(revealNextSlot, 500);

  btnClaim.onclick = () => {
    claimLuckyChest();
  };
}

function claimLuckyChest() {
  chestPendingRewards.forEach(item => {
    if (item.type === 'evo') {
      applyEvolution(item.data);
    } else if (item.type === 'upgrade') {
      applyUpgrade(item.data);
    }
  });
  chestPendingRewards = [];
  document.getElementById('chest-screen').style.display = 'none';
  gameState = STATE.PLAYING;
  updateWeaponsHud();
  sounds.achieve();
}

// --- PAUSE MENU & BUILD / SYNERGY INSPECTOR ---
function togglePause() {
  if (gameState === STATE.PLAYING) {
    gameState = STATE.PAUSED;
    renderPauseScreen();
    document.getElementById('pause-screen').style.display = 'flex';
    sounds.beep();
  } else if (gameState === STATE.PAUSED) {
    document.getElementById('pause-screen').style.display = 'none';
    gameState = STATE.PLAYING;
    sounds.beep();
  }
}

function renderPauseScreen() {
  const m = Math.floor(gameTime / 60);
  const s = Math.floor(gameTime % 60);
  const totalMin = SHIFT_START_MINUTES + m;
  const clockH = Math.floor(totalMin / 60).toString().padStart(2, '0');
  const clockM = (totalMin % 60).toString().padStart(2, '0');
  
  document.getElementById('pstat-time').innerText = `${clockH}:${clockM} (${m}m ${s}s)`;
  document.getElementById('pstat-kills').innerText = kills;
  document.getElementById('pstat-lvl').innerText = playerLevel;

  const wGrid = document.getElementById('pause-weapons-grid');
  wGrid.innerHTML = '';
  Object.keys(weapons).forEach(k => {
    const w = weapons[k];
    if (w.level > 0) {
      const pill = document.createElement('div');
      pill.className = 'pause-gear-pill' + (w.isEvo ? ' is-evo' : '');
      const evoTag = w.isEvo ? ' ★ EVO' : ` Poz. ${w.level}`;
      pill.innerHTML = `<span>${w.icon}</span> <span><b>${k.toUpperCase()}</b>${evoTag}</span>`;
      wGrid.appendChild(pill);
    }
  });

  const pGrid = document.getElementById('pause-passives-grid');
  pGrid.innerHTML = '';
  Object.keys(passives).forEach(k => {
    const p = passives[k];
    if (p.level > 0) {
      const pill = document.createElement('div');
      pill.className = 'pause-gear-pill';
      pill.innerHTML = `<span>${p.icon}</span> <span><b>${p.name}</b> (Poz. ${p.level})</span>`;
      pGrid.appendChild(pill);
    }
  });
  if (pGrid.children.length === 0) {
    pGrid.innerHTML = '<div style="font-size:10px; color:#64748b; font-style:italic;">Brak pasywnych przedmiotów. Awansuj, aby je zdobyć!</div>';
  }

  const synList = document.getElementById('pause-synergies-list');
  synList.innerHTML = '';

  Object.keys(EVOLUTIONS).forEach(evoKey => {
    const evo = EVOLUTIONS[evoKey];
    const w = weapons[evo.reqWeapon];
    const p = passives[evo.reqPassive];
    if (!w || !p) return;

    const hasWep = w.level >= 5;
    const hasPass = p.level >= 1;
    const isEvo = !!w.isEvo;
    const isReady = hasWep && hasPass;

    const row = document.createElement('div');
    row.className = 'synergy-row' + (isReady || isEvo ? ' active' : '');
    
    let statusHtml = '';
    if (isEvo) {
      statusHtml = '<span style="color:#facc15; font-weight:900;">★ EWOLUOWANA</span>';
    } else if (isReady) {
      statusHtml = '<span style="color:#4ade80; font-weight:900;">🔥 GOTOWE DO EWOLUCJI!</span>';
    } else {
      const wepTag = hasWep ? '✅' : `${w.level}/5`;
      const passTag = hasPass ? '✅' : `${p.level}/1`;
      statusHtml = `<span style="color:#94a3b8;">${wepTag} + ${passTag}</span>`;
    }

    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:14px;">${evo.icon}</span>
        <span style="font-weight:700; color:#f8fafc;">${evo.name}</span>
        <span style="font-size:10px; color:#94a3b8;">(${w.icon || '⚔️'} + ${p.icon || '🛡️'})</span>
      </div>
      <div>${statusHtml}</div>
    `;
    synList.appendChild(row);
  });
}

function surrenderShift() {
  document.getElementById('pause-screen').style.display = 'none';
  player.battery = 0;
  gameState = STATE.PLAYING;
}

function toggleMuteSound() {
  sounds.muted = !sounds.muted;
  const btn = document.getElementById('btn-pause-sound');
  if (btn) {
    btn.innerText = sounds.muted ? '🔇 DŹWIĘK: OFF' : '🔊 DŹWIĘK: ON';
    btn.style.borderColor = sounds.muted ? '#ef4444' : '#38bdf8';
  }
}

// --- CONTROLS ---
const touchState = { active: false, id: null, startX: 0, startY: 0, curX: 0, curY: 0, dirX: 0, dirY: 0 };
const aimTouchState = { active: false, id: null, startX: 0, startY: 0, curX: 0, curY: 0, dirX: 0, dirY: 0 };
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && gameState === STATE.PLAYING) triggerSkill();
  if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && (gameState === STATE.PLAYING || gameState === STATE.PAUSED)) {
    togglePause();
  }
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

const joystickBase = document.getElementById('joystick-base');
const aimJoystickBase = document.getElementById('aim-joystick-base');
const joystickThumb = document.getElementById('joystick-thumb');
const aimJoystickThumb = document.getElementById('aim-joystick-thumb');
const btnDash = document.getElementById('btn-dash');
const dashCd = document.getElementById('dash-cd');
const btnDetention = document.getElementById('btn-detention');
const detentionCd = document.getElementById('detention-cd');
const btnForklift = document.getElementById('btn-forklift');


// --- 24H DRIVER DETENTION ULTIMATE ATTACK ---
function triggerDriverDetention() {
  if (player.detentionCooldown <= 0 && gameState === STATE.PLAYING) {
    player.detentionCooldown = player.maxDetentionCooldown;
    sounds.bossAlert();
    screenShake = 14;
    if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(100);

    let detainedCount = 0;
    enemies.forEach(e => {
      // 24h Detention: Stop all enemies for 4.5 seconds and inflict massive penalty damage
      e.slowTimer = 4.5;
      damageEnemy(e, 80);
      createSparks(e.x, e.y, 12, '#a855f7');
      detainedCount++;
    });

    addSpeechBubble(player.x, player.y - 45, '🛑 PRZETRZYMANIE KIEROWCY 24H (BRAK SAD)!', '#c084fc');
    triggerAchievement('detention_24h', '24h pod Rampą', '🛑');
  }
}

if (btnDetention) {
  btnDetention.addEventListener('touchstart', (e) => { e.preventDefault(); sounds.init(); triggerDriverDetention(); });
  btnDetention.addEventListener('click', () => { sounds.init(); triggerDriverDetention(); });
}

// --- POLISH INTRO CUTSCENE STORY ENGINE ---
const INTRO_ART_SCENES = [
  {
    badge: "📍 BRAMA 4B / DYSPOZYCJA | 03:15",
    stamp: "🛑 PROTOKÓŁ BLACKOUT",
    satire: "„Jak nie ma prądu, to ładuj widły kablem od czajnika!”",
    alertTag: "⚠️ ALARM: 60 TIRÓW, ROZŁADOWANY AKUMULATOR",
    alertType: "danger",
    speaker: "🎙️ KIEROWNIK JANUSZ (Z POKŁADU MALEDIWY)",
    color: "#facc15",
    text: "Piotr, melduj się! System WMS padł na pysk, a zarząd wyłączył transformator oszczędzając na premie. Pod bramą 4B stoi konwój 60 spóźnionych tirów z paczkami. Twoje jedyne narzędzie to wózek widłowy BT z ostatnimi procentami baterii. Jak nie ogarniesz rampy do 07:00, wszyscy lecimy na bezrobocie!",
    sound: "error"
  },
  {
    badge: "📍 SEKTOR ZWROTÓW I REKLAMACJI | 03:22",
    stamp: "☣️ TOKSYCZNA KAWOSZKA",
    satire: "„Data ważności to tylko sugestia korporacji.”",
    alertTag: "🚨 KRYZYS BIOLOGICZNY BHP",
    alertType: "danger",
    speaker: "🎙️ ZASTĘPCA MARIUSZ",
    color: "#ef4444",
    text: "Mamy skażenie! Pękły palety z przeterminowaną przedtreningówką i tanią kawą z automatu. Magazynierzy z agencji pracy zmutowali w hordę Zombie-Pickersów, a kurierzy rzucają uszkodzonymi paczkami jak granatami! Utrzymuj dystans i taranuj ich widłami!",
    sound: "beep"
  },
  {
    badge: "📍 ALEJA REGAŁÓW WYSOKIEGO SKŁADOWANIA | 03:40",
    stamp: "⚡ KLAUZULA WYJĄTKOWA",
    satire: "„U nas BHP to skrót od: Bardzo Hojny Pogrzeb.”",
    alertTag: "🛑 SYSTEM AUDYTU KAS & PIP",
    alertType: "warning",
    speaker: "🎙️ OCHRONIARZ ZDZISŁAW (PRZEZ KRÓTKOFALÓWKĘ)",
    color: "#38bdf8",
    text: "Uwaga na hali! Z orbity ląduje desant mobilny Państwowej Inspekcji Pracy i Urzędu Celno-Skarbowego. Inspektorzy mierzą suwmiarką każdą paletę. Jeśli wjedziesz w ich czerwoną strefę rewizji, nałożą mandat w ułamku sekundy. Pies Kluska wywęszy ukryte hot-dogi na podłodze – trzymaj się go blisko!",
    sound: "bossAlert"
  },
  {
    badge: "📍 GŁÓWNA NAWA MAGAZYNOWA | 03:55",
    stamp: "🚀 ZASADY PRZETRWANIA VAMPIRE DTA",
    satire: "„Kto nie driftuje widlakiem, ten nie pije kawy!”",
    alertTag: "🔥 HARDCORE SURVIVAL TACTICS",
    alertType: "danger",
    speaker: "🎙️ DYSPOZYTOR CENTRALNY",
    color: "#22c55e",
    text: "Pamiętaj zasadę Crimsonlandu: nie stój w miejscu! Wykorzystuj siłę odśrodkową w zakrętach, owijaj mutantów taśmą strecz i zbieraj kody kreskowe XP. Skrzynie z rzadkimi perkami wypadają tylko z najgroźniejszych bossów i elit. Wskakuj za kółko Toyoty BT – zaczynamy najdłuższą nocną zmianę w historii!",
    sound: "achieve"
  }
];
let currentIntroIndex = 0;

function showIntroDialog() {
  currentIntroIndex = 0;
  updateIntroView();
  document.getElementById('intro-screen').style.display = 'flex';
}

function updateIntroView() {
  const scene = INTRO_ART_SCENES[currentIntroIndex];
  
  // Play dramatic sound cue
  if (scene.sound && sounds[scene.sound]) {
    try { sounds[scene.sound](); } catch(e) {}
  }

  // Update Visual Comic Stage
  document.getElementById('intro-art-badge').innerText = scene.badge;
  document.getElementById('intro-art-stamp').innerText = scene.stamp;
  document.getElementById('intro-art-satire').innerText = scene.satire;
  document.getElementById('intro-alert-tag').innerText = scene.alertTag;
  
  if (scene.render) {
    document.getElementById('intro-art-visual').innerHTML = scene.render();
  } else {
    // Default GTA style render
    let icon = '🏭';
    let bgCol = '#facc15';
    if (currentIntroIndex === 0) { icon = '🧔🏻‍♂️'; bgCol = '#f59e0b'; }
    if (currentIntroIndex === 1) { icon = '👷‍♂️'; bgCol = '#ef4444'; }
    if (currentIntroIndex === 2) { icon = '👨‍💻'; bgCol = '#38bdf8'; }
    if (currentIntroIndex === 3) { icon = '🕴️'; bgCol = '#dc2626'; }
    if (currentIntroIndex === 4) { 
      const char = CHARACTERS[selectedCharKey];
      icon = char ? char.icon : '🚜'; 
      bgCol = '#22c55e';
    }
    
    document.getElementById('intro-art-visual').innerHTML = `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#0f172a 0%,#020617 100%);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:200%;height:200%;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.03) 20px,rgba(255,255,255,0.03) 40px);animation:panBg 10s linear infinite;"></div>
        <div style="display:flex;align-items:center;justify-content:center;z-index:2;background:${bgCol}22;padding:20px;border-radius:24px;border:4px solid ${bgCol};box-shadow:0 0 40px ${bgCol}66; transform: rotate(-2deg) scale(1.1);">
          <div style="font-size:100px;filter:drop-shadow(5px 5px 0px #000);">${icon}</div>
        </div>
      </div>
      <style>
        @keyframes panBg { 0% { transform: translate(-25%, -25%); } 100% { transform: translate(0, 0); } }
      </style>
    `;
  }

  if (currentIntroIndex === 4) {
    const char = CHARACTERS[selectedCharKey];
    document.getElementById('intro-speaker').innerText = `${char.icon} ${char.name.toUpperCase()} (W AKCJI)`;
    document.getElementById('intro-speaker').style.color = '#4ade80';
    let heroLine = "";
    if (selectedCharKey === 'piotr') heroLine = 'Piotr: Odpalam pistolet na gaz na metalowe kulki, a moja suczka Kluska już ostrzy zęby na łydki urzędników KAS! Żaden bus ani kurier nie odjedzie bez stempla SAD na czole! HAU HAU!';
    else if (selectedCharKey === 'radek') heroLine = 'Radek: Wrzucam bieg w Toyocie BT, robię drift na epoksydzie i taranuję widłami wszystko, co blokuje rampę!';
    else if (selectedCharKey === 'pawel') heroLine = 'Paweł: Biorę podwójną paletę EPAL i zasypuję korytarz drewnem! Żaden bus nie ma prawa wjechać bez kwitu!';
    else if (selectedCharKey === 'marcin') heroLine = 'Marcin: Zapasy papieru toaletowego przygotowane! Zasypię kierowców rolkami Velvet Max, aż im się odechce kłócić o klucz do Toi-Toia!';
    else if (selectedCharKey === 'kierownik_marcin') heroLine = 'Kierownik Marcin: Ładuję baterie w megafonie! Przez mój magazyn nikt nie przejdzie bez autoryzacji! DO ROBOTY!';
    else if (selectedCharKey === 'przemek_biuro') heroLine = 'Przemek: Podłączam WMS bezpośrednio pod skaner! Baza danych zsynchronizowana, kasujemy nieautoryzowane palety!';
    else if (selectedCharKey === 'ania_biuro') heroLine = 'Ania: Pieczątka odmowy przygotowana! Każdy brakujący dokument oznacza natychmiastowe 24H kwarantanny celnej!';
    else if (selectedCharKey === 'grzesiek_zastepca') heroLine = 'Grzesiek: Termos z kawą pełny, kamizelka zapięta pod szyję! Kontrola BHP wjeżdża na rampę!';
    else heroLine = `${char.name.split(' ')[0]}: Wsiadam na wózek, biorę papier toaletowy i wlepiam 24h przetrzymania na SAD! Jazda!`;
    document.getElementById('intro-text').innerText = heroLine;
  } else {
    document.getElementById('intro-speaker').innerText = scene.speaker;
    document.getElementById('intro-speaker').style.color = scene.color;
    document.getElementById('intro-text').innerText = scene.text;
  }

  if (currentIntroIndex === INTRO_ART_SCENES.length - 1) {
    document.getElementById('btn-intro-next').innerText = 'JAZDA NA HALĘ! 🚀';
  } else {
    document.getElementById('btn-intro-next').innerText = 'DALEJ ➔';
  }
}

function nextIntroBtn() {
  sounds.init();
  sounds.beep();
  currentIntroIndex++;
  if (currentIntroIndex >= INTRO_ART_SCENES.length) {
    document.getElementById('intro-screen').style.display = 'none';
    startGamePlay();
  } else {
    updateIntroView();
  }
}

function skipIntroBtn() {
  sounds.init();
  document.getElementById('intro-screen').style.display = 'none';
  startGamePlay();
}

// Ensure the old assignments don't break if element exists
const introNext = document.getElementById('btn-intro-next');
if (introNext) introNext.onclick = nextIntroBtn;
const introSkip = document.getElementById('btn-intro-skip');
if (introSkip) introSkip.onclick = skipIntroBtn;

function handleTouchStart(e) {
  if (typeof sounds !== 'undefined' && sounds.init) sounds.init();
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, button, .tab-btn, .workshop-card, .upgrade-card, .char-card, .hud-btn-pause, #hud-pause-btn, #btn-skill, #btn-detention, .action-btn, .hud-btn')) {
    return;
  }
  
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (t.clientX < gameWidth * 0.55 && !touchState.active) {
      touchState.active = true;
      touchState.id = t.identifier;
      touchState.startX = t.clientX;
      touchState.startY = t.clientY;
      touchState.curX = t.clientX;
      touchState.curY = t.clientY;
      touchState.dirX = 0;
      touchState.dirY = 0;
      if (joystickBase && joystickThumb) {
        joystickBase.style.left = t.clientX + 'px';
        joystickBase.style.top = t.clientY + 'px';
        joystickBase.style.display = 'block';
        joystickThumb.style.left = t.clientX + 'px';
        joystickThumb.style.top = t.clientY + 'px';
        joystickThumb.style.display = 'block';
      }
    } else if (t.clientX >= gameWidth * 0.55 && !aimTouchState.active) {
      aimTouchState.active = true;
      aimTouchState.id = t.identifier;
      aimTouchState.startX = t.clientX;
      aimTouchState.startY = t.clientY;
      aimTouchState.curX = t.clientX;
      aimTouchState.curY = t.clientY;
      aimTouchState.dirX = 0;
      aimTouchState.dirY = 0;
      if (aimJoystickBase && aimJoystickThumb) {
        aimJoystickBase.style.left = t.clientX + 'px';
        aimJoystickBase.style.top = t.clientY + 'px';
        aimJoystickBase.style.display = 'block';
        aimJoystickThumb.style.left = t.clientX + 'px';
        aimJoystickThumb.style.top = t.clientY + 'px';
        aimJoystickThumb.style.display = 'block';
      }
    }
  }
}

function handleTouchMove(e) {
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, .workshop-grid, .upgrade-list, .char-card, button, .tab-btn, .hud-btn-pause, #hud-pause-btn, #btn-skill, #btn-detention, .action-btn, .hud-btn')) {
    return;
  }
  
  if (e.cancelable && (touchState.active || aimTouchState.active)) {
    e.preventDefault();
  }
  
  const maxR = 55;
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (touchState.active && t.identifier === touchState.id) {
      touchState.curX = t.clientX;
      touchState.curY = t.clientY;
      const dx = touchState.curX - touchState.startX;
      const dy = touchState.curY - touchState.startY;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        touchState.dirX = 0;
        touchState.dirY = 0;
        if (joystickThumb) {
          joystickThumb.style.left = touchState.startX + 'px';
          joystickThumb.style.top = touchState.startY + 'px';
        }
      } else {
        const angle = Math.atan2(dy, dx);
        const clampDist = Math.min(dist, maxR);
        const norm = clampDist / maxR;
        touchState.dirX = Math.cos(angle) * norm;
        touchState.dirY = Math.sin(angle) * norm;
        if (joystickThumb) {
          joystickThumb.style.left = (touchState.startX + Math.cos(angle) * clampDist) + 'px';
          joystickThumb.style.top = (touchState.startY + Math.sin(angle) * clampDist) + 'px';
        }
      }
    }
    if (aimTouchState.active && t.identifier === aimTouchState.id) {
      aimTouchState.curX = t.clientX;
      aimTouchState.curY = t.clientY;
      const dx = aimTouchState.curX - aimTouchState.startX;
      const dy = aimTouchState.curY - aimTouchState.startY;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        aimTouchState.dirX = 0;
        aimTouchState.dirY = 0;
        if (aimJoystickThumb) {
          aimJoystickThumb.style.left = aimTouchState.startX + 'px';
          aimJoystickThumb.style.top = aimTouchState.startY + 'px';
        }
      } else {
        const angle = Math.atan2(dy, dx);
        const clampDist = Math.min(dist, maxR);
        const norm = clampDist / maxR;
        aimTouchState.dirX = Math.cos(angle) * norm;
        aimTouchState.dirY = Math.sin(angle) * norm;
        if (aimJoystickThumb) {
          aimJoystickThumb.style.left = (aimTouchState.startX + Math.cos(angle) * clampDist) + 'px';
          aimJoystickThumb.style.top = (aimTouchState.startY + Math.sin(angle) * clampDist) + 'px';
        }
      }
    }
  }
}

function handleTouchEnd(e) {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (touchState.active && t.identifier === touchState.id) {
      touchState.active = false;
      touchState.id = null;
      touchState.dirX = 0;
      touchState.dirY = 0;
      if (joystickBase) joystickBase.style.display = 'none';
      if (joystickThumb) joystickThumb.style.display = 'none';
    }
    if (aimTouchState.active && t.identifier === aimTouchState.id) {
      aimTouchState.active = false;
      aimTouchState.id = null;
      aimTouchState.dirX = 0;
      aimTouchState.dirY = 0;
      if (aimJoystickBase) aimJoystickBase.style.display = 'none';
      if (aimJoystickThumb) aimJoystickThumb.style.display = 'none';
    }
  }
}

window.addEventListener('touchstart', handleTouchStart, { passive: false });
window.addEventListener('touchmove', handleTouchMove, { passive: false });
window.addEventListener('touchend', handleTouchEnd, { passive: false });
window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

function triggerSkill() {
  if (player.skillCooldown <= 0 && gameState === STATE.PLAYING) {
    player.skillCooldown = player.maxSkillCooldown;
    player.isDashing = true;
    player.dashTimer = 0.38;
    player.invulnTimer = 0.38;
    screenShake = Math.max(screenShake, 6);
    coffeeDashCount++;
    sounds.dash();
    if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(60);

    if (selectedCharKey === 'piotr') {
      sounds.gasPistol();
      setTimeout(() => sounds.metalBB(), 120);
      screenShake = 12;
      
      // 1. Gas Pistol Pepper Gas Cloud Burst
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 4) {
        projectiles.push({
          type: 'gas_cloud',
          x: player.x + Math.cos(ang) * 40,
          y: player.y + Math.sin(ang) * 40,
          vx: Math.cos(ang) * 1.5,
          vy: Math.sin(ang) * 1.5,
          radius: 35,
          maxRadius: 90,
          life: 3.5,
          maxLife: 3.5,
          damage: 35
        });
      }
      
      // 2. Metal BB Pellets (16 piercing steel BBs in 360 ring)
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 8) {
        projectiles.push({
          type: 'metal_bb',
          x: player.x,
          y: player.y,
          vx: Math.cos(ang) * 14.0,
          vy: Math.sin(ang) * 14.0,
          life: 1.8,
          damage: 135,
          pierce: 3
        });
      }
      
      // 3. Summon Kluska (Rage Mode!)
      kluska.active = true;
      kluska.rageTimer = 6.0;
      
      addSpeechBubble(player.x, player.y - 35, '🔫 GAZ PIEPRZOWY, METALOWE KULKI & KLUSKA! 🐕', '#facc15');
    } else if (selectedCharKey === 'radek') {
      player.isDashing = true;
      player.dashTimer = 0.95;
      player.invulnTimer = 0.95;
      screenShake = 7;
      createSparks(player.x, player.y, 30, '#f97316');
      addSpeechBubble(player.x, player.y - 30, '🚜 RADEK: SZARŻA TOYOTĄ BT!', '#f59e0b');
    } else if (selectedCharKey === 'pawel') {
      sounds.pallet();
      screenShake = 9;
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 4) {
        projectiles.push({
          type: 'pallet',
          x: player.x,
          y: player.y,
          vx: Math.cos(ang) * 9.0,
          vy: Math.sin(ang) * 9.0,
          angle: ang,
          life: 2.0,
          damage: 110,
          isEvo: true
        });
      }
      addSpeechBubble(player.x, player.y - 30, '🪵 PAWEŁ: POCZWÓRNA SALWA EPAL!', '#f59e0b');
    } else if (selectedCharKey === 'marcin') {
      sounds.hit();
      screenShake = 6;
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 6) {
        projectiles.push({
          type: 'toilet_paper',
          x: player.x,
          y: player.y,
          vx: Math.cos(ang) * 8.5,
          vy: Math.sin(ang) * 8.5,
          rot: 0,
          life: 2.5,
          damage: 85,
          isEvo: true
        });
      }
      addSpeechBubble(player.x, player.y - 30, '🧻 MARCIN: BOMBA VELVET MAX!', '#fef08a');
    } else if (selectedCharKey === 'kierownik_marcin') {
      sounds.megaph();
      screenShake = 12;
      enemies.forEach(e => {
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        if (Math.hypot(dx, dy) < 420) {
          damageEnemy(e, 120);
          e.slowTimer = 3.5;
          const a = Math.atan2(dy, dx);
          e.x += Math.cos(a) * 110;
          e.y += Math.sin(a) * 110;
          createSparks(e.x, e.y, 10, '#eab308');
        }
      });
      addSpeechBubble(player.x, player.y - 30, '📢 KIEROWNIK MARCIN: DO ROBOTY!!', '#eab308');
    } else if (selectedCharKey === 'przemek_biuro') {
      sounds.levelUp();
      screenShake = 7;
      // WMS Overload: zaps nearest 20 enemies & pulls all XP items
      dropItems.forEach(d => {
        if (d.type === 'barcode_xp' || d.type === 'xp') {
          d.x = player.x;
          d.y = player.y;
        }
      });
      enemies.slice(0, 20).forEach(e => {
        if (!e.dead) {
          damageEnemy(e, 90);
          projectiles.push({
            type: 'laser',
            x1: player.x,
            y1: player.y,
            x2: e.x,
            y2: e.y,
            life: 0.4,
            color: '#a855f7'
          });
        }
      });
      addSpeechBubble(player.x, player.y - 30, '💻 PRZEMEK: SYSTEM WMS ZSYNC!', '#c084fc');
    } else if (selectedCharKey === 'ania_biuro') {
      sounds.freeze();
      screenShake = 8;
      enemies.forEach(e => {
        if (Math.hypot(e.x - player.x, e.y - player.y) < 450) {
          e.slowTimer = 4.0;
          damageEnemy(e, 85);
          createSparks(e.x, e.y, 10, '#38bdf8');
        }
      });
      addSpeechBubble(player.x, player.y - 30, '📋 ANIA: BLOKADA SAD! WSTRZYMANIE!', '#38bdf8');
    } else if (selectedCharKey === 'grzesiek_zastepca') {
      sounds.megaph();
      screenShake = 9;
      player.battery = Math.min(player.maxBattery, player.battery + 25);
      enemies.forEach(e => {
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        if (Math.hypot(dx, dy) < 350) {
          damageEnemy(e, 95);
          e.slowTimer = 2.5;
          const a = Math.atan2(dy, dx);
          e.x += Math.cos(a) * 90;
          e.y += Math.sin(a) * 90;
        }
      });
      addSpeechBubble(player.x, player.y - 30, '☕ GRZESIEK: KONTROLA BHP & KAWA!', '#f59e0b');
    } else if (selectedCharKey === 'mirek') {
      sounds.hit();
      screenShake = 14;
      player.battery = Math.min(player.maxBattery, player.battery + 20);
      const slamRadius = 320;
      enemies.forEach(e => {
        const dist = Math.hypot(e.x - player.x, e.y - player.y);
        if (dist < slamRadius) {
          damageEnemy(e, 140);
          e.slowTimer = 3.0;
          createSparks(e.x, e.y, 12, '#f59e0b');
        }
      });
      projectiles.push({
        type: 'shockwave',
        x: player.x,
        y: player.y,
        radius: 20,
        maxRadius: slamRadius,
        life: 0.4,
        maxLife: 0.4,
        color: '#f59e0b'
      });
      addSpeechBubble(player.x, player.y - 30, '🔧 PAN MIREK: UDAR & TRYTYTKA!', '#f59e0b');
    } else if (selectedCharKey === 'klaus') {
      sounds.laser();
      screenShake = 11;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8 + gameTime;
        const ex = player.x + Math.cos(a) * 450;
        const ey = player.y + Math.sin(a) * 450;
        projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: ex, y2: ey, life: 0.4, color: '#ef4444' });
      }
      enemies.forEach(e => {
        if (Math.hypot(e.x - player.x, e.y - player.y) < 450) {
          damageEnemy(e, 110);
          e.slowTimer = 3.5;
          createSparks(e.x, e.y, 8, '#ef4444');
        }
      });
      addSpeechBubble(player.x, player.y - 30, '🇩🇪 KLAUS: AUDYT DIN & KARA!', '#f87171');
    }

    if (coffeeDashCount >= 10) triggerAchievement('coffee_addict', 'Klawo-Kawa Espresso', '☕');
  }
}

btnDash.addEventListener('touchstart', (e) => { e.preventDefault(); sounds.init(); triggerSkill(); });
btnDash.addEventListener('click', () => { sounds.init(); triggerSkill(); });

// Forklift controls (hold to sprint)
const startForklift = (e) => { if(e) e.preventDefault(); sounds.init(); player.wantsForklift = true; };
const stopForklift = (e) => { if(e) e.preventDefault(); player.wantsForklift = false; };
btnForklift.addEventListener('touchstart', startForklift);
btnForklift.addEventListener('touchend', stopForklift);
btnForklift.addEventListener('mousedown', startForklift);
btnForklift.addEventListener('mouseup', stopForklift);
btnForklift.addEventListener('mouseleave', stopForklift);
window.addEventListener('keydown', (e) => { if(e.key === 'Shift') player.wantsForklift = true; });
window.addEventListener('keyup', (e) => { if(e.key === 'Shift') player.wantsForklift = false; });


let lastPlayerSpeechTime = 0;
function addSpeechBubble(x, y, text, color = '#ffffff') {
  const isPlayer = Math.hypot(x - player.x, y - player.y) < 25;
  const now = Date.now();
  if (isPlayer) {
    if (now - lastPlayerSpeechTime < 2800) return;
    lastPlayerSpeechTime = now;
  }
  if (speechBubbles.length >= 3) speechBubbles.shift();
  speechBubbles.push({ x, y, text, color, life: 0.75, maxLife: 0.75 });
}

// --- ENEMY CATALOG (Unique Visuals & Attacks) ---
const ENEMY_TYPES = {
  SZCZUR_RAMPY: { name: 'Szczur z Rampy', hp: 20, speed: 185, radius: 11, renderType: 'warehouse_rat', color: '#64748b', clothColor: '#334155', itemIcon: '🐀', xp: 1, quotes: ['PISK!', 'GRYZĘ KABLE!', 'UCIEKAĆ!'] },
  DRON_INWENTARZ: { name: 'Dron Skanujący RFID', hp: 65, speed: 110, radius: 16, renderType: 'inventory_drone', color: '#06b6d4', clothColor: '#0891b2', itemIcon: '🛸', xp: 2, shooter: true, quotes: ['SKANOWANIE KODU...', 'BŁĄD INWENTARZA!', 'NAMIERZANIE WÓZKA!'] },
  BATERIA_KAMIKAZE: { name: 'Przegrzana Bateria Li-Ion', hp: 45, speed: 165, radius: 15, renderType: 'kamikaze_battery', color: '#ef4444', clothColor: '#b91c1c', itemIcon: '💥', xp: 2, special: 'kamikaze_explode', quotes: ['PRZEGRZANIE 99°C!', 'BOMBA TERMICZNA!', 'UCIEKAJ!'] },
  KURIER_INPOST: { name: 'Kurier Paczkomatu (Gabaryt C)', hp: 170, speed: 115, radius: 22, renderType: 'inpost_paczkomat', color: '#facc15', clothColor: '#ca8a04', itemIcon: '📦', xp: 4, armor: true, quotes: ['KOD ODBIORU 123456!', 'PRZEPEŁNIONA SKRYTKA!', 'ZAPRASZAM PO PACZKĘ!'] },
  AUDYTOR_ISO_LASER: { name: 'Inspektor Normy ISO 9001', hp: 240, speed: 65, radius: 24, renderType: 'iso_laser_auditor', color: '#8b5cf6', clothColor: '#6d28d9', itemIcon: '📐', xp: 6, special: 'laser_zone', quotes: ['NORMA PRZEKROCZONA!', 'GDZIE PROTOKÓŁ?!', 'MANDAT 5000 PLN!'] },

  FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 85, radius: 15, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#cbd5e1', itemIcon: '🗞️', xp: 2, quotes: ['PRZYLEPIŁEM SIĘ!', 'ZROBIONY W BALONA!', 'OWIJAĆ CIĘ?!'] },
  FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 125, radius: 10, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#e2e8f0', itemIcon: '💨', xp: 1, quotes: ['ŁAP MNIE!', 'ODPRYSK STRECZU!'] },
  KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 80, radius: 12, renderType: 'pedestrian', color: '#d97706', clothColor: '#b45309', itemIcon: '📦', xp: 1, quotes: ['OSTRZEŻENIE: SZKŁO!', 'NIE RZUCAĆ!', 'GŁÓWNA SIEDZIBA B2C'] },
  KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 105, radius: 18, renderType: 'pedestrian', color: '#ef4444', clothColor: '#1e293b', itemIcon: '🚛', xp: 2, canDash: true, quotes: ['GDZIE MOJA KAWA?!', 'STOJĘ OD 4 RANO!', 'SZUKAM RAMPY 3!'] },
  WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 155, radius: 24, renderType: 'pedestrian', color: '#ea580c', clothColor: '#991b1b', itemIcon: '⚠️', xp: 4, straightLine: true, quotes: ['PISZCZY BATERIA!', 'HAMULCE NIE DZIAŁAJĄ!', 'SAD BEZ HOMOLOGACJI!'] },
  PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 55, radius: 28, renderType: 'pedestrian', color: '#78350f', clothColor: '#451a03', itemIcon: '🧱', xp: 5, armor: true, quotes: ['JESTEM ZAGADKĄ DTA!', 'EPAL BEZ PIECZĄTKI!'] },
  RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 40, radius: 35, renderType: 'pedestrian', color: '#475569', clothColor: '#0f172a', itemIcon: '🚧', xp: 8, directionalShield: true, quotes: ['RAMPA ZABLOKOWANA!', 'CZEKAJ NA SWOJĄ KOLEJ!'] },
  CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 70, radius: 16, renderType: 'pedestrian', color: '#dc2626', clothColor: '#7f1d1d', itemIcon: '🛑', xp: 3, shooter: true, quotes: ['KONTROLA DOKUMENTÓW SAD!', 'STÓJ! REWIZJA!', 'BRAK PIECZĄTKI KAS!'] },
  BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 75, radius: 30, renderType: 'pedestrian', color: '#ef4444', clothColor: '#000000', itemIcon: '🦅', xp: 65, mechanics: 'kas_zone', quotes: ['AUDYT SKARBOWY KAS!', 'POKAŻ DEKLARACJĘ VAT!', 'REWIZJA SZCZEGÓŁOWA!'] },
  BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 35, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 90, mechanics: 'spawner', quotes: ['CAŁY MORSKI ŁADUNEK!', 'ZARAZ FAJRANT!'] },

  KURIER_DPD: { name: 'Spóźniony Kurier DPD', hp: 45, speed: 170, radius: 14, renderType: 'pedestrian', color: '#ef4444', clothColor: '#fca5a5', itemIcon: '📦', xp: 4, canDash: true, quotes: ['PRZESYŁKA AWIZOWANA!', 'NIE MAM CZASU!', 'RZUĆ TO!'] },
  BHP_INSPECTOR_SUPER: { isBoss: true, name: 'Główny Inspektor BHP', hp: 3500, speed: 65, radius: 28, renderType: 'pedestrian', color: '#f59e0b', clothColor: '#451a03', itemIcon: '📋', xp: 80, mechanics: 'kas_zone', quotes: ['BRAK KASKU!', 'KARA FINANSOWA!', 'PROSZĘ O PRZEPUSTKĘ!'] },
  ZLECENIE_NA_CITO: { name: 'Zlecenie na Cito', hp: 5, speed: 220, radius: 10, renderType: 'pedestrian', color: '#ffffff', clothColor: '#f8fafc', itemIcon: '📄', xp: 1, quotes: ['NA WCZORAJ!', 'BARDZO PILNE!'] },
  PALECIAK_REZYGNACJI: { name: 'Rzucony Paleciak', hp: 60, speed: 140, radius: 22, renderType: 'pedestrian', color: '#475569', clothColor: '#1e293b', itemIcon: '🛒', xp: 6, straightLine: true, quotes: ['ZWALNIAM SIĘ!', 'NIE CHCE MI SIĘ!'] },

  JADZIA_KSIEGOWOSC: { name: 'Pani Jadzia z Księgowości', hp: 110, speed: 65, radius: 18, renderType: 'pedestrian', color: '#ec4899', clothColor: '#fbcfe8', itemIcon: '☕', xp: 8, shooter: true, quotes: ['PRZERWA KAWOWA!', 'FAKTURA BEZ NIP-U!', 'KTO TO PODPISAŁ?!'] },
  JUNGHEINRICH_SZALENIEC: { name: 'Młody na Jungheinrichu', hp: 180, speed: 195, radius: 25, renderType: 'reach_truck', color: '#facc15', itemIcon: '🏎️', xp: 12, canDash: true, quotes: ['BOKIEM PO RAMPART!', 'BEZ UDT ALE SZYBKO!', 'Z DROGI!'] },
  INWENTARYZACJA: { name: 'Roczna Inwentaryzacja', hp: 380, speed: 45, radius: 32, renderType: 'pedestrian', color: '#94a3b8', clothColor: '#334155', itemIcon: '📊', xp: 10, special: 'split_on_death', quotes: ['SPIS Z NATURY!', 'MANKO NA WAREHOUSE!', 'SZUKAMY 100 PALET!'] },
  BOSS_PREZES_WIZYTACJA: { isBoss: true, name: 'Prezes Zarządu na Wizytacji', hp: 10000, speed: 70, radius: 45, renderType: 'boss_bhp', color: '#f59e0b', clothColor: '#000000', itemIcon: '👔', xp: 120, mechanics: 'kas_zone', quotes: ['DLACZEGO CI KIEROWCY STOJĄ?!', 'AUDYT LOGISTYCZNY!', 'WYSKOKIE KPI ALBO ZWOLNIENIA!'] },

  PRAKTYKANT: {
    name: 'Zagubiony Praktykant',
    hp: 15,
    speed: 95,
    radius: 14,
    renderType: 'pedestrian',
    color: '#10b981',
    clothColor: '#6ee7b7',
    itemIcon: '📝',
    xp: 1,
    quotes: ['Gdzie jest toaleta?', 'Jak to zeskanować?', 'Pomocy!']
  },
  AUDYTOR: {
    name: 'Audytor BHP',
    hp: 350,
    speed: 75,
    radius: 20,
    renderType: 'pedestrian',
    color: '#475569',
    clothColor: '#facc15',
    itemIcon: '📋',
    xp: 10,
    quotes: ['Brak kasku!', 'Gdzie kamizelka?!', 'Wypiszę mandat!']
  },
  KURIER: {
    name: 'Wściekły Kurier',
    hp: 60,
    speed: 120,
    radius: 16,
    renderType: 'pedestrian',
    color: '#eab308',
    clothColor: '#ef4444',
    itemIcon: '📦',
    xp: 5,
    quotes: ['Mam mało czasu!', 'Rzucam paczkę!', 'Podpisz to!']
  },
  KLAPKI: {
    name: 'Kierowca w Klapkach',
    hp: 35,
    speed: 90,
    radius: 16,
    renderType: 'pedestrian',
    color: '#ef4444',
    clothColor: '#38bdf8',
    itemIcon: '🩴',
    xp: 2,
    quotes: ['GDZIE KIBEL?!', 'JESTEM Z LITWY!', 'WC!', 'PILNE!']
  },
  DWIE_PALETY_BUS: {
    name: 'Bus "Ja tylko dwie palety"',
    hp: 420,
    speed: 125,
    radius: 32,
    renderType: 'delivery_van',
    color: '#f97316',
    xp: 7,
    special: 'charge_drop_pallets',
    quotes: ['JA TYLKO DWIE PALETKI!', 'WPUSZCZASZ CZY NIE?!', 'MINUTKA I ZJEŻDŻAM!']
  },
  UKRAINA_EKIPA: {
    name: 'Ekipa ze Wschodu',
    hp: 55,
    speed: 95,
    radius: 17,
    renderType: 'worker_team',
    color: '#3b82f6',
    itemIcon: '📦',
    xp: 4,
    quotes: ['DAWAJ, DAWAJ!', 'SZYBKO ROZŁADUJEMY!', 'NA RAMPĘ!']
  },
  SPEDYTOR: {
    name: 'Spedytor na Telefonie',
    hp: 90,
    speed: 70,
    radius: 18,
    renderType: 'pedestrian_suit',
    color: '#a855f7',
    itemIcon: '📱',
    xp: 6,
    special: 'sound_wave',
    quotes: ['GDZIE JEST AUTO?!', 'KIEROWCA STOI!', 'KARY UMOWNE!']
  },
  AWIZO: {
    name: 'Kierowca z Awizo z 2023',
    hp: 140,
    speed: 60,
    radius: 20,
    renderType: 'pedestrian',
    color: '#64748b',
    itemIcon: '📋',
    xp: 5,
    quotes: ['CZEKAM 14 GODZIN!', 'GDZIE ODPRAWA?!', 'MAM NUMEREK!']
  },
  TASMA: {
    name: 'Piotr z Taśmownicą',
    hp: 75,
    speed: 85,
    radius: 18,
    renderType: 'pedestrian',
    color: '#eab308',
    itemIcon: '🎗️',
    xp: 4,
    quotes: ['DAJ TAŚMĘ!', 'OKLEJAM!', 'TRZYMAĆ!']
  },
  WIESLAW_REACH: {
    name: 'Pan Wiesław (Wysoki Skład)',
    hp: 240,
    speed: 75,
    radius: 26,
    renderType: 'reach_truck',
    color: '#0284c7',
    xp: 12,
    quotes: ['ZRZUCAM Z GÓRY!', 'UWAGA NA GŁOWY!']
  },
  // SECTOR BOSSES (Spawn dynamically every 2 minutes)
  BOSS_ZBIGNIEW: {
    isBoss: true,
    name: 'Kierownik Rampa Zbigniew (BHP)',
    hp: 1600,
    speed: 70,
    radius: 34,
    renderType: 'boss_bhp',
    color: '#f97316',
    xp: 100,
    special: 'spawn_cones',
    quotes: ['MANDAT BHP 500 PLN!', 'GDZIE KAMIZELKA?!', 'ZATRZYMAĆ WÓZEK!']
  },
  BOSS_GRZESIEK: {
    isBoss: true,
    name: 'Zastępca Grzesiek (BHP)',
    hp: 1600,
    speed: 70,
    radius: 34,
    renderType: 'boss_bhp',
    color: '#f97316',
    xp: 100,
    special: 'spawn_cones',
    quotes: ['MANDAT BHP 500 PLN!', 'GDZIE KAMIZELKA?!', 'ZATRZYMAĆ WÓZEK!']
  },
  BOSS_WIESLAW_REACH: {
    isBoss: true,
    name: 'Pan Wiesław (Wysoki Skład - Boss)',
    hp: 3200,
    speed: 75,
    radius: 38,
    renderType: 'reach_truck',
    color: '#0284c7',
    xp: 150,
    special: 'pallet_storm',
    quotes: ['ZRZUCAM Z DWUNASTEGO METRA!', 'UWAGA NA GŁOWY!', 'CZYSTA LOGISTYKA!']
  },
  BOSS_TOITOI_MECH: {
    isBoss: true,
    name: 'Zmutowany Mecha-ToiToi 3000',
    hp: 4800,
    speed: 80,
    radius: 42,
    renderType: 'toitoi_mech',
    color: '#15803d',
    xp: 200,
    special: 'toxic_gas',
    quotes: ['*TOKSYCZNE BULGOTANIE*', 'AURA CHŁODU I CHEMICZNEGO ZAPACHU!', 'BRUDNA EWOLUCJA!']
  },
  BOSS_KONTENER: {
    isBoss: true,
    name: 'Spóźniony Kontener 40ft (Przed 16:00)',
    hp: 6000,
    speed: 80,
    radius: 48,
    renderType: 'container_truck',
    color: '#b91c1c',
    xp: 250,
    special: 'cargo_barrage',
    quotes: ['TRZY MINUTY DO FAJRANTU!', 'ROZŁADOWAĆ DO 16:00!', 'CAŁY MORSKI ŁADUNEK!']
  },
  BOSS_IGOR: {
    isBoss: true,
    name: 'Udziałowiec Igor (Wykręca Żarówki)',
    hp: 8500,
    speed: 90,
    radius: 46,
    renderType: 'boss_igor',
    color: '#1e1b4b',
    xp: 350,
    special: 'lights_out',
    quotes: ['CIEMNIEJ! TANIEJ!', 'OPTYMALIZACJA ENERGII!', 'TNĘ ETATY!']
  }
};

// --- DYNAMIC WAREHOUSE SECTOR TIERS (Levels change dynamically in-game every 2 minutes) ---
const WAREHOUSE_SECTORS = [
  {
    id: 1,
    name: 'SEKTOR 1: DOKI ROZŁADUNKOWE & RAMPY B2C',
    floorColor: '#0f172a',
    gridColor: '#1e293b',
    hazardColor: '#f59e0b',
    bossKey: 'BOSS_GRZESIEK',
    bossName: 'Zastępca Grzesiek (BHP)',
    bossTime: 120, // 2:00 relative
    spawnPool: ['KARTON_B2C', 'SZCZUR_RAMPY', 'FOLIA', 'PRAKTYKANT', 'KLAPKI', 'KURIER', 'DWIE_PALETY_BUS', 'KURIER_DPD', 'JADZIA_KSIEGOWOSC', 'KURIER_INPOST'],
    desc: 'Brama wjazdowa i rampy przeładunkowe. Hordy niecierpliwych kierowców i zagubionych paczek.'
  },
  {
    id: 2,
    name: 'SEKTOR 2: ALEJE WYSOKIEGO SKŁADU (HIGH-BAY)',
    floorColor: '#091e3a',
    gridColor: '#1e40af',
    hazardColor: '#38bdf8',
    bossKey: 'BOSS_WIESLAW_REACH',
    bossName: 'Pan Wiesław (Wysoki Skład)',
    bossTime: 120, // 2:00 relative
    spawnPool: ['PALETA_KAM', 'DRON_INWENTARZ', 'WIESLAW_REACH', 'UKRAINA_EKIPA', 'TASMA', 'WOZEK_AWARIA', 'DWIE_PALETY_BUS', 'ZLECENIE_NA_CITO', 'JUNGHEINRICH_SZALENIEC'],
    desc: '14-metrowe wieżowce z palet EPAL, wąskie korytarze i spadające ładunki.'
  },
  {
    id: 3,
    name: 'SEKTOR 3: STREFA KONTROLI CELNEJ & BHP',
    floorColor: '#261230',
    gridColor: '#581c87',
    hazardColor: '#ec4899',
    bossKey: 'BOSS_KAS',
    bossName: 'Główny Inspektor KAS',
    bossTime: 120, // 2:00 relative
    spawnPool: ['CELNIK', 'AUDYTOR', 'AUDYTOR_ISO_LASER', 'SPEDYTOR', 'AWIZO', 'RAMPA', 'KIEROWCA_TIR', 'BATERIA_KAMIKAZE'],
    desc: 'Kordon celny, kwarantanna przesyłek i czerwone pieczęcie odmowy odprawy.'
  },
  {
    id: 4,
    name: 'SEKTOR 4: STREFA CHŁODNICZA & ADR (SUB-ZERO)',
    floorColor: '#032b2b',
    gridColor: '#0f766e',
    hazardColor: '#2dd4bf',
    bossKey: 'BOSS_TOITOI_MECH',
    bossName: 'Zmutowany Mecha-ToiToi 3000',
    bossTime: 120, // 2:00 relative
    spawnPool: ['FOLIA_MALA', 'BATERIA_KAMIKAZE', 'WOZEK_AWARIA', 'SZCZUR_RAMPY', 'KURIER', 'DWIE_PALETY_BUS', 'KLAPKI', 'PALETA_KAM', 'DRON_INWENTARZ'],
    desc: 'Arktyczne mrozy -18°C, oblodzona posadzka o poślizgu i zmutowane odpady.'
  },
  {
    id: 5,
    name: 'SEKTOR 5: CENTRALA DYREKCJI & SALA ZARZĄDU',
    floorColor: '#2d0a1b',
    gridColor: '#9d174d',
    hazardColor: '#f43f5e',
    bossKey: 'BOSS_IGOR',
    bossName: 'Udziałowiec Igor & Zarząd DTA',
    bossTime: 120, // 2:00 relative
    spawnPool: ['SPEDYTOR', 'CELNIK', 'AUDYTOR', 'WIESLAW_REACH', 'DWIE_PALETY_BUS', 'KIEROWCA_TIR'],
    desc: 'Luksusowe korytarze, wykręcone żarówki i ostateczna bitwa o upragniony fajrant o 07:00!'
  }
];

let currentSectorIndex = 0;
let activeBoss = null;
let hitStopTimer = 0;
let mysteryTimer = 0;
let mysteryActive = '';
let mysteryBuffMultiplier = 1.0;

// Persistent Workshop Upgrades
let dtaCoins = parseInt(localStorage.getItem('dta_coins') || '350', 10);
let workshopUpgrades = {
  battery: parseInt(localStorage.getItem('dta_upg_battery') || '0', 10),
  speed: parseInt(localStorage.getItem('dta_upg_speed') || '0', 10),
  damage: parseInt(localStorage.getItem('dta_upg_damage') || '0', 10),
  magnet: parseInt(localStorage.getItem('dta_upg_magnet') || '0', 10),
  cooldown: parseInt(localStorage.getItem('dta_upg_cooldown') || '0', 10),
  oponyKolcowane: parseInt(localStorage.getItem('dta_upg_opony') || '0', 10),
  halogenyLed: parseInt(localStorage.getItem('dta_upg_halogeny') || '0', 10),
  pancerzRabitza: parseInt(localStorage.getItem('dta_upg_pancerz') || '0', 10),
  kogutOstrzegawczy: parseInt(localStorage.getItem('dta_upg_kogut') || '0', 10)
};

function saveWorkshopData() {
  localStorage.setItem('dta_coins', dtaCoins.toString());
  localStorage.setItem('dta_upg_battery', workshopUpgrades.battery.toString());
  localStorage.setItem('dta_upg_speed', workshopUpgrades.speed.toString());
  localStorage.setItem('dta_upg_damage', workshopUpgrades.damage.toString());
  localStorage.setItem('dta_upg_magnet', workshopUpgrades.magnet.toString());
  localStorage.setItem('dta_upg_cooldown', workshopUpgrades.cooldown.toString());
  const coinEl = document.getElementById('shop-coins-display');
  if (coinEl) coinEl.innerText = `💰 ${dtaCoins} MONET`;
}

// --- QUEUED NON-INTRUSIVE ANNOUNCEMENT ENGINE ---
const announcementQueue = [];
let isAnnouncementShowing = false;
let lastAnnouncementText = '';
let lastAnnouncementTime = 0;

function showAnnouncement(txt, col = '#38bdf8') {
  const now = Date.now();
  if (txt === lastAnnouncementText && (now - lastAnnouncementTime < 4000)) return;
  announcementQueue.push({ txt, col, time: now });
  processAnnouncementQueue();
}

function processAnnouncementQueue() {
  if (isAnnouncementShowing || announcementQueue.length === 0) return;
  const item = announcementQueue.shift();
  isAnnouncementShowing = true;
  lastAnnouncementText = item.txt;
  lastAnnouncementTime = item.time;

  const el = document.getElementById('announcement');
  if (el) {
    el.innerText = item.txt;
    el.style.color = item.col;
    el.style.borderColor = item.col;
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, 0) scale(1)';
  }

  setTimeout(() => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -10px) scale(0.95)';
    }
    setTimeout(() => {
      isAnnouncementShowing = false;
      processAnnouncementQueue();
    }, 250);
  }, 2200);
}

// ============================================================================
// SPATIAL GRID PARTITIONING FOR HIGH-PERFORMANCE CRIMSONLAND HORDE COLLISIONS
// ============================================================================
const GRID_CELL_SIZE = 120;
const GRID_COLS = Math.ceil(ARENA_WIDTH / GRID_CELL_SIZE); // 32
const GRID_ROWS = Math.ceil(ARENA_HEIGHT / GRID_CELL_SIZE); // 32
const TOTAL_GRID_CELLS = GRID_COLS * GRID_ROWS;

const spatialGridHeads = new Int32Array(TOTAL_GRID_CELLS);
const spatialGridNext = new Int32Array(1000); // Support up to 1000 enemies
spatialGridHeads.fill(-1);

function clearSpatialGrid() {
  spatialGridHeads.fill(-1);
}

function insertEnemyToSpatialGrid(enemyIndex, x, y) {
  const col = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(x / GRID_CELL_SIZE)));
  const row = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(y / GRID_CELL_SIZE)));
  const cellIndex = col + row * GRID_COLS;
  spatialGridNext[enemyIndex] = spatialGridHeads[cellIndex];
  spatialGridHeads[cellIndex] = enemyIndex;
}

function buildSpatialGrid() {
  clearSpatialGrid();
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e && !e.dead) {
      insertEnemyToSpatialGrid(i, e.x, e.y);
    }
  }
}

function queryEnemiesNear(px, py, radius, callback) {
  const minCol = Math.max(0, Math.floor((px - radius) / GRID_CELL_SIZE));
  const maxCol = Math.min(GRID_COLS - 1, Math.floor((px + radius) / GRID_CELL_SIZE));
  const minRow = Math.max(0, Math.floor((py - radius) / GRID_CELL_SIZE));
  const maxRow = Math.min(GRID_ROWS - 1, Math.floor((py + radius) / GRID_CELL_SIZE));

  for (let c = minCol; c <= maxCol; c++) {
    for (let r = minRow; r <= maxRow; r++) {
      const cellIdx = c + r * GRID_COLS;
      let eIdx = spatialGridHeads[cellIdx];
      while (eIdx !== -1) {
        const enemy = enemies[eIdx];
        if (enemy && !enemy.dead) {
          if (callback(enemy, eIdx) === true) return true;
        }
        eIdx = spatialGridNext[eIdx];
      }
    }
  }
  return false;
}

let spawnedBossSectors = [false, false, false, false, false];
const MAX_ENEMIES_CAP = 180;

function spawnEnemyAt(typeKey, ex, ey, isBoss = false, isElite = false) {
  const t = ENEMY_TYPES[typeKey];
  if (!t) return;

  const hpMult = (1 + (playerLevel - 1) * 0.08 + currentSectorIndex * 0.18) * (isElite ? 3.5 : 1.0);
  const enemy = {
    x: Math.max(50, Math.min(ARENA_WIDTH - 50, ex)),
    y: Math.max(50, Math.min(ARENA_HEIGHT - 50, ey)),
    vx: 0,
    vy: 0,
    type: typeKey,
    info: t,
    hp: t.hp * hpMult,
    maxHp: t.hp * hpMult,
    isBoss: !!isBoss,
    isElite: !!isElite,
    eliteType: isElite ? ['TANK', 'SPEED', 'EXPLOSIVE', 'SHIELD'][Math.floor(Math.random() * 4)] : null,
    quoteTimer: Math.random() * 5 + 3,
    actionTimer: 0,
    hitFlash: 0,
    slowTimer: 0,
    dead: false
  };

  enemies.push(enemy);

  if (isElite) {
    createSparks(enemy.x, enemy.y, 25, '#facc15');
    addSpeechBubble(enemy.x, enemy.y - 35, '👑 ELITE HARCORNIK!', '#facc15');
  }

  if (isBoss) {
    activeBoss = enemy;
    activeBoss.bossPhase = 1;
    showBossTopBar(t.name);
    sounds.bossAlert();
    screenShake = 15;
    addSpeechBubble(enemy.x, enemy.y - 45, '🚨 ' + t.name.toUpperCase(), '#ef4444');
    showAnnouncement('🚨 ALARM: ' + t.name.toUpperCase(), '#ef4444');
  }
}

function spawnEnemy(typeKey, isBoss = false) {
  const viewRadius = (Math.max(gameWidth, gameHeight) / (2 * camera.zoom));
  const angle = Math.random() * Math.PI * 2;
  const dist = viewRadius + 120 + Math.random() * 90;
  const ex = player.x + Math.cos(angle) * dist;
  const ey = player.y + Math.sin(angle) * dist;
  spawnEnemyAt(typeKey, ex, ey, isBoss);
}

// Structured Wave Director with dynamic phases
function spawnBatchByTime(currentMinutes) {
  if (enemies.length >= MAX_ENEMIES_CAP) return;
  const sec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[0];
  const pool = sec.spawnPool;
  if (!pool || pool.length === 0) return;
  
  const secInMin = Math.floor(gameTime) % 60;
  let batchMultiplier = 1.0;
  let spawnEliteChance = 0.05;

  if (secInMin < 12) {
    batchMultiplier = 0.6;
  } else if (secInMin < 28) {
    batchMultiplier = 1.1;
  } else if (secInMin < 42) {
    batchMultiplier = 1.6;
    spawnEliteChance = 0.12;
  } else if (secInMin < 52) {
    batchMultiplier = 2.2;
    spawnEliteChance = 0.25;
  } else {
    batchMultiplier = 0.5;
  }

  const baseBatchSize = Math.floor((1 + Math.random() * 2) * batchMultiplier);
  const batchCount = Math.min(baseBatchSize, MAX_ENEMIES_CAP - enemies.length);
  const baseAngle = Math.random() * Math.PI * 2;
  const pickedType = pool[Math.floor(Math.random() * pool.length)];
  const viewRadius = (Math.max(gameWidth, gameHeight) / (2 * camera.zoom));
  
  for (let i = 0; i < batchCount; i++) {
    const angleSpread = (i - batchCount / 2) * 0.15;
    const spawnAngle = baseAngle + angleSpread;
    const dist = viewRadius + 110 + (Math.random() * 150);
    const ex = player.x + Math.cos(spawnAngle) * dist;
    const ey = player.y + Math.sin(spawnAngle) * dist;
    const typeKey = (i > 0 && Math.random() < 0.35) ? pool[Math.floor(Math.random() * pool.length)] : pickedType;
    const isElite = Math.random() < spawnEliteChance && !(activeBoss && !activeBoss.dead);
    spawnEnemyAt(typeKey, ex, ey, false, isElite);
  }
}
function showBossTopBar(name) {
  const container = document.getElementById('boss-hp-container');
  document.getElementById('boss-name').innerText = '🚨 BOSS: ' + name;
  document.getElementById('boss-hp-fill').style.width = '100%';
  container.style.display = 'flex';
}
function updateBossTopBar() {
  if (activeBoss && !activeBoss.dead) {
    const pct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
    document.getElementById('boss-hp-fill').style.width = pct + '%';

    // Boss Phase 2 Transition at <= 50% HP
    if (activeBoss.hp <= activeBoss.maxHp * 0.5 && activeBoss.bossPhase === 1) {
      activeBoss.bossPhase = 2;
      sounds.bossAlert();
      screenShake = 22;
      createSparks(activeBoss.x, activeBoss.y, 60, '#ef4444');
      showAnnouncement('🔥 BOSS FAZA 2: FURY MODE!', '#ef4444');
      addSpeechBubble(activeBoss.x, activeBoss.y - 45, '🔥 DOKUMENTACJA UNIEWAŻNIONA! FURY MODE!', '#ef4444');
    }
  } else {
    document.getElementById('boss-hp-container').style.display = 'none';
    activeBoss = null;
  }
}

// --- LEVEL UP & EVOLUTION POOL ---
function checkLevelUp() {
  let leveledUp = false;
  while (currentXP >= neededXP) {
    currentXP -= neededXP;
    playerLevel++;
    // Smooth leveling curve: level 1 is quick, progression builds steadily without long lulls
    neededXP = Math.floor(neededXP * 1.35 + 20);
    levelUpPendingCount++;
    leveledUp = true;
  }
  if (leveledUp && gameState === STATE.PLAYING) {
    sounds.levelUp();
    triggerLevelUpModal();
  }
}



window.onCardSelectedInCompose = function(cardId) {
  console.log('Card selected in Compose:', cardId);
  if (typeof sounds !== 'undefined' && sounds.xp) sounds.xp();
  
  // ⚔️ ACTIVE WEAPONS
  if (cardId === 'scanner_active' && weapons.scanner) {
    weapons.scanner.level++;
    weapons.scanner.damage += 25;
  } else if (cardId === 'toilet_paper_active' && weapons.toiletPaper) {
    weapons.toiletPaper.level++;
    weapons.toiletPaper.count += 2;
    weapons.toiletPaper.damage += 15;
  }  else if (cardId === 'stretch_aura_active' && weapons.stretchAura) {
    weapons.stretchAura.level++;
    weapons.stretchAura.count++;
    weapons.stretchAura.damage += 12;
  } else if (cardId === 'pallet_truck_active' && weapons.pallets) {
    weapons.pallets.level++;
    weapons.pallets.damage += 45;
  } else if (cardId === 'extinguisher_active' && weapons.extinguisher) {
    weapons.extinguisher.level++;
    weapons.extinguisher.damage += 30;
  } else if (cardId === 'zip_ties_active' && weapons.zipTies) {
    weapons.zipTies.level++;
    weapons.zipTies.count++;
    weapons.zipTies.damage += 10;
  } else if (cardId === 'cutter_active' && weapons.cutter) {
    weapons.cutter.level++;
    weapons.cutter.pierce++;
    weapons.cutter.damage += 22;
  } else if (cardId === 'stapler_active' && weapons.stapler) {
    weapons.stapler.level++;
    weapons.stapler.count += 2;
    weapons.stapler.damage += 15;
  } else if (cardId === 'sledgehammer_active' && weapons.sledgehammer) {
    weapons.sledgehammer.level++;
    weapons.sledgehammer.damage += 60;
  } else if (cardId === 'faktura_active' && weapons.faktura) {
    weapons.faktura.level++;
    weapons.faktura.count++;
    weapons.faktura.damage += 20;
  } else if (cardId === 'kawa_active' && weapons.kawa) {
    weapons.kawa.level++;
    weapons.kawa.radius += 40;
    weapons.kawa.damage += 10;
  } else if (cardId === 'hydrant_active' && weapons.hydrant) {
    weapons.hydrant.level++;
    weapons.hydrant.damage += 65;
  } else if (cardId === 'megafon_active' && weapons.megafon) {
    weapons.megafon.level++;
    weapons.megafon.damage += 40;
  }
  
  // 🛡️ PASSIVE BUFFS
  else if (cardId === 'iso_cert_passive' && passives.magnet) {
    passives.magnet.level++;
    player.magnetRange += 120;
  } else if (cardId === 'safety_bhp_passive' && passives.forks) {
    passives.forks.level++;
    player.ramDamageMult = (player.ramDamageMult || 1.0) + 0.7;
  } else if (cardId === 'synthetic_oil_passive' && passives.coffee) {
    passives.coffee.level++;
    player.speed += 35;
  } else if (cardId === 'super_battery_passive' && passives.battery) {
    passives.battery.level++;
    player.maxBattery += 50;
    player.battery = Math.min(player.maxBattery, player.battery + 60);
  } else if (cardId === 'furia_passive' && passives.furia) {
    passives.furia.level++;
    player.attackSpeedMult = (player.attackSpeedMult || 1.0) * 1.35;
  } else if (cardId === 'alkomat_passive' && passives.alkomat) {
    passives.alkomat.level++;
    player.dodgeChance = (player.dodgeChance || 0) + 0.20;
  } else if (cardId === 'stoperan_passive' && passives.stoperan) {
    passives.stoperan.level++;
    player.maxBattery += 45;
    player.battery = Math.min(player.maxBattery, player.battery + 50);
  } else if (cardId === 'safety_shoes_passive' && passives.buty_robocze) {
    passives.buty_robocze.level++;
    player.thorns = (player.thorns || 0) + 40;
  } else if (cardId === 'multisport_passive' && passives.karta_multisport) {
    passives.karta_multisport.level++;
    player.speed += 25;
  } else if (cardId === 'paczek_passive' && passives.paczek) {
    passives.paczek.level++;
    player.critChance = (player.critChance || 0) + 0.25;
  } else if (cardId === 'kamizelka_passive' && passives.kamizelka) {
    passives.kamizelka.level++;
    player.damageReduction = (player.damageReduction || 0) + 0.35;
  } else if (cardId === 'umowa_passive' && passives.umowa) {
    passives.umowa.level++;
    player.extraLives = (player.extraLives || 0) + 1;
  }

  // ⚡ GOLDEN EVOLUTIONS
  else if (cardId === 'bramka_rfid_evo' && weapons.scanner) {
    weapons.scanner.isEvo = true;
    weapons.scanner.damage = 180;
  } else if (cardId === 'owijarka_evo' && weapons.toiletPaper) {
    weapons.toiletPaper.isEvo = true;
    weapons.toiletPaper.damage = 110;
  } else if (cardId === 'bt_highstack_evo' && weapons.pallets) {
    weapons.pallets.isEvo = true;
    weapons.pallets.damage = 150;
  } else if (cardId === 'zraszacz_evo' && weapons.extinguisher) {
    weapons.extinguisher.isEvo = true;
    weapons.extinguisher.damage = 250;
  } else if (cardId === 'steel_ties_evo' && weapons.zipTies) {
    weapons.zipTies.isEvo = true;
    weapons.zipTies.damage = 110;
  } else if (cardId === 'machete_evo' && weapons.cutter) {
    weapons.cutter.isEvo = true;
    weapons.cutter.damage = 95;
  } else if (cardId === 'stapler_gun_evo' && weapons.stapler) {
    weapons.stapler.isEvo = true;
    weapons.stapler.damage = 130;
  } else if (cardId === 'hydraulic_hammer_evo' && weapons.sledgehammer) {
    weapons.sledgehammer.isEvo = true;
    weapons.sledgehammer.damage = 320;
  } else if (cardId === 'urzad_skarbowy_evo' && weapons.faktura) {
    weapons.faktura.isEvo = true;
    weapons.faktura.damage = 210;
  } else if (cardId === 'redbull_evo' && weapons.kawa) {
    weapons.kawa.isEvo = true;
    weapons.kawa.damage = 120;
  }

  // ⚠️ DEBUFF & RISK/REWARD CARDS
  else if (cardId === 'overtime_debuff') {
    player.damageMult = (player.damageMult || 1.0) * 1.45;
    player.speed = Math.max(120, player.speed * 0.82);
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ NADGODZINY: +45% DMG / -18% SPEED', '#ef4444');
  } else if (cardId === 'kas_audit_debuff') {
    player.xpBonusMult = (player.xpBonusMult || 1.0) * 1.6;
    player.maxBattery = Math.max(50, player.maxBattery - 20);
    player.battery = Math.min(player.maxBattery, player.battery);
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ KONTROLA KAS: +60% XP / -20 BATTERY', '#f59e0b');
  } else if (cardId === 'leaking_hydraulics_debuff') {
    if (weapons.kawa) weapons.kawa.radius += 50;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ WYCIEK OLEJU: +40% AREA EFEKT', '#eab308');
  } else if (cardId === 'ramp_breakdown_debuff') {
    player.knockbackMult = (player.knockbackMult || 1.0) * 1.5;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🚧 ZABLOKOWANA RAMPA: +50% KNOCKBACK', '#f59e0b');
  } else if (cardId === 'fruit_thursday_passive') {
    player.regenRate = (player.regenRate || 0) + 2;
    player.maxBattery += 10;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🍎 OWOCOWE CZWARTKI: REGEN +2 HP/S', '#4ade80');
  } else if (cardId === 'team_building_passive') {
    player.damageMult = (player.damageMult || 1.0) * 1.15;
    player.attackSpeedMult = (player.attackSpeedMult || 1.0) * 1.1;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⛺ TEAM BUILDING: +15% DMG', '#a855f7');
  } else if (cardId === 'asap_debuff') {
    player.attackSpeedMult = (player.attackSpeedMult || 1.0) * 1.5;
    player.asapStress = true;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⏰ PROJEKT NA ASAP: +50% ATK SPEED', '#ef4444');
  } else if (cardId === 'coffee_spill_active') {
    if (weapons.kawa) {
      weapons.kawa.level++;
      weapons.kawa.damage += 20;
      weapons.kawa.slowEffect = 0.8;
    }
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '☕ KAWA PREZESA: EKSTREMALNE SPOWOLNIENIE', '#facc15');
  }
  
  
  // ⚡ GAME-CHANGER PERKS
  else if (cardId === 'perk_no_brakes') {
    player.noBrakes = true;
    player.speed += 120;
    player.ramDamageMult = (player.ramDamageMult || 1.0) * 4.0;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🏎️ BRAK HAMULCÓW: +400% TARAN!', '#ef4444');
  } else if (cardId === 'perk_drunken_udt') {
    player.drunkenUdt = true;
    player.critChance = (player.critChance || 0) + 0.25;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🍺 PIJANY MISTRZ UDT: EKSPLOZJE!', '#f59e0b');
  } else if (cardId === 'perk_radioactive_adr') {
    player.radioactiveAdr = true;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '☣️ RADIOAKTYWNE ADR: PŁONĄCE PLAMY!', '#84cc16');
  } else if (cardId === 'perk_pip_bribe') {
    player.pipBribe = true;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '💼 ŁAPÓWKA DLA PIP: BEZPIECZEŃSTWO!', '#38bdf8');
  } else if (cardId === 'perk_kamikaze_intern') {
    player.kamikazeIntern = true;
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '💣 SAMOBÓJCZY PRAKTYKANT DOŁĄCZA!', '#ec4899');
  }

  closeLevelUp();
};


function triggerLevelUpModal(isReroll = false) {
  levelUpProcessing = false;
  screenShake = 12;
  if (window.AndroidBridge && window.AndroidBridge.vibrate) {
    window.AndroidBridge.vibrate(100);
  }
  let useAndroidCompose = false;
  if (window.AndroidBridge && window.AndroidBridge.triggerComposeLevelUp) {
    window.AndroidBridge.triggerComposeLevelUp(playerLevel);
    useAndroidCompose = true;
  }
  
  gameState = STATE.LEVELUP;
  
  if (useAndroidCompose) {
    document.getElementById('levelup-screen').style.display = 'none';
    return;
  }

  const container = document.getElementById('upgrade-container');
  container.innerHTML = '';

  if (typeof player.rerolls === 'undefined') {
    player.rerolls = selectedCharKey === 'klaus' ? 4 : 2;
  }

  const rerollBtn = document.getElementById('btn-reroll-cards');
  const rerollCountEl = document.getElementById('reroll-count');
  if (rerollCountEl) rerollCountEl.innerText = player.rerolls;
  if (rerollBtn) {
    if (player.rerolls > 0) {
      rerollBtn.disabled = false;
      rerollBtn.innerHTML = `🔄 PRZELOSUJ (${player.rerolls})`;
    } else {
      rerollBtn.disabled = true;
      rerollBtn.innerHTML = `🔄 BRAK REROLLI`;
    }
  }

  const options = [];

  // 1. Check possible Weapon Evolutions
  Object.keys(EVOLUTIONS).forEach(evoKey => {
    const evo = EVOLUTIONS[evoKey];
    const w = weapons[evo.reqWeapon];
    const p = passives[evo.reqPassive];
    if (w && w.level >= 5 && p && p.level >= 1 && !w.isEvo) {
      options.push({ cat: 'evolution', type: 'evolution', evo: evo });
    }
  });

  // Count active weapons and passives
  let activeWeaponsCount = 0;
  Object.keys(weapons).forEach(k => { if (weapons[k].level > 0) activeWeaponsCount++; });
  let activePassivesCount = 0;
  Object.keys(passives).forEach(k => { if (passives[k].level > 0) activePassivesCount++; });

  // 2. Build list of regular weapon & passive upgrades
  const regularCards = [];

  const weaponDataList = [
    { id: 'scanner', name: 'Skaner Kodów Kreskowych', icon: '🔦', desc: 'Promień laserowy w najbliższego wroga.', stat: '+12 Obrażeń | Promień laserowy' },
    { id: 'toiletPaper', name: 'Pistolet na Taśmę "Pakowa"', icon: '🧻', desc: 'Wystrzeliwuje lepkie taśmy niszczące wrogów.', stat: '+2 Pociski taśmowe | +12 Obrażeń' },
    { id: 'stretchAura', name: 'Aura z Folii Stretch', icon: '🌀', desc: 'Wirujące rolki folii tnące wrogów.', stat: '+1 Rolka folii | Wzmocniony promień tnący' },
    { id: 'pallets', name: 'Ręczny Paleciak', icon: '🪵', desc: 'Taran odpychający wrogów przed graczem.', stat: '+15 Obrażeń taranowania | Odpychanie' },
    { id: 'extinguisher', name: 'Gaśnica Proszkowa PPOŻ', icon: '🧯', desc: 'Stożek zamrażający/spowalniający.', stat: 'Większy stożek zamrażający | -10% Cooldown' },
    { id: 'zipTies', name: 'Trytytki Samozaciskowe', icon: '🔗', desc: 'Wystrzeliwuje taśmy blokujące wrogów.', stat: '+1 Taśma blokująca | Dłuższe spowolnienie' },
    { id: 'cutter', name: 'Nóż do Tapet (Gilotyna)', icon: '🔪', desc: 'Przecina wrogów na pół, przenikając ich.', stat: '+1 Przebicie wrogów | +12 Obrażeń' },
    { id: 'stapler', name: 'Zszywacz Pneumatyczny', icon: '📌', desc: 'Szybka seria stalowych zszywek magazynowych.', stat: '+2 Stalowe zszywki | Szybszy wystrzał' },
    { id: 'sledgehammer', name: 'Młot Konserwatora BHP', icon: '🔨', desc: 'Uderzenie o posadzkę niszczące wrogów 360°.', stat: '+20 Obrażeń obszarowych | Fala uderzeniowa' },
    { id: 'faktura', name: 'Faktura Korygująca', icon: '📄', desc: 'Latające papiery tnące wrogów.', stat: '+1 Faktura | Większa prędkość rotacji' },
    { id: 'kawa', name: 'Toksyczna Kawa z Automatu', icon: '☕', desc: 'Rozlewa wrzący kwas (kawę) dookoła.', stat: 'Większa plama kaustyczna | +10 Obrażeń' },
    { id: 'hydrant', name: 'Hydrant Magazynowy PPOŻ', icon: '🚰', desc: 'Wstrzeliwuje silne strumienie wody odpychające wrogów.', stat: '+1 Strumień wody | Silniejsze odepchnięcie' },
    { id: 'megafon', name: 'Megafon Kierownika Hali', icon: '📢', desc: 'Fala dźwiękowa "DO ROBOTY!" ogłuszająca wrogów.', stat: '+15% Zasięgu ogłuszenia | Szybsza syrena' }
  ];

  weaponDataList.forEach(w => {
    const obj = weapons[w.id];
    if (obj && obj.level < 5 && !obj.isEvo) {
      if (obj.level > 0 || activeWeaponsCount < 6) {
        regularCards.push({ cat: 'weapon', ...w });
      }
    }
  });

  Object.keys(passives).forEach(k => {
    const p = passives[k];
    const maxLvl = p.max || 3;
    if (p.level < maxLvl) {
      if (p.level > 0 || activePassivesCount < 6) {
        regularCards.push({
          cat: 'passive',
          id: k,
          name: p.name,
          icon: p.icon,
          desc: p.desc,
          stat: `Wzmocnienie Poziomu ${p.level + 1} z ${maxLvl}`
        });
      }
    }
  });

  regularCards.sort(() => 0.5 - Math.random());

  const maxChoices = selectedCharKey === 'klaus' ? 4 : 3;

  regularCards.forEach(c => {
    if (options.length < maxChoices) options.push(c);
  });

  if (options.length === 0) {
    options.push({
      type: 'bonus',
      id: 'bateria_naprawa',
      name: '⚡ Bateria Ogniwo Litowe',
      icon: '🔋',
      desc: 'Pełna regeneracja baterii wózka oraz premia +150 DTA.',
      stat: '+100% Baterii | +150 Monet DTA'
    });
    options.push({
      type: 'bonus',
      id: 'kawa_premia',
      name: '☕ Podwójne Espresso z Automatu',
      icon: '☕',
      desc: 'Natychmiastowy reset umiejętności specjalnej i +500 pkt.',
      stat: 'Reset Skill CD | +500 Pkt'
    });
  }

  options.slice(0, maxChoices).forEach((opt, idx) => {
    const card = document.createElement('div');
    card.style.animationDelay = (idx * 0.08) + 's';

    if (opt.type === 'evolution') {
      card.className = 'upgrade-card is-evolution';
      card.innerHTML = `
        <div class="card-icon-wrapper" style="border-color: #f59e0b;">
          <div class="card-icon">${opt.evo.icon}</div>
        </div>
        <div class="card-info">
          <div class="card-header-line">
            <span class="card-badge badge-evo">⚡ SUPREME EWOLUCJA</span>
            <span class="card-level-tag" style="color:#fde047;">★ EWOLUCJA</span>
          </div>
          <div class="card-title">${opt.evo.name}</div>
          <div class="card-desc">${opt.evo.desc}</div>
        </div>
      `;
      card.onclick = () => { if (levelUpProcessing) return; levelUpProcessing = true; applyEvolution(opt.evo); closeLevelUp(); };
    } else if (opt.type === 'bonus') {
      card.className = 'upgrade-card is-bonus';
      card.innerHTML = `
        <div class="card-icon-wrapper" style="border-color: #ef4444;">
          <div class="card-icon">${opt.icon}</div>
        </div>
        <div class="card-info">
          <div class="card-header-line">
            <span class="card-badge badge-bonus">🎁 BONUS ZMIANY</span>
            <span class="card-level-tag">REGENERACJA</span>
          </div>
          <div class="card-title">${opt.name}</div>
          <div class="card-desc">${opt.desc}</div>
          <div class="card-stat-boost" style="color:#fca5a5;">${opt.stat}</div>
        </div>
      `;
      card.onclick = () => { if (levelUpProcessing) return; levelUpProcessing = true; applyBonusUpgrade(opt); closeLevelUp(); };
    } else {
      const isWeapon = opt.cat === 'weapon';
      card.className = 'upgrade-card ' + (isWeapon ? 'is-weapon' : 'is-passive');
      let lvl = isWeapon ? weapons[opt.id].level : passives[opt.id].level;
      let maxLvl = isWeapon ? 5 : (passives[opt.id] ? passives[opt.id].max || 3 : 3);
      
      let stars = '';
      for (let s = 1; s <= maxLvl; s++) {
        stars += (s <= lvl + 1) ? '★' : '☆';
      }

      let badgeClass = isWeapon ? 'badge-weapon' : 'badge-passive';
      let badgeLabel = isWeapon ? '⚔️ BROŃ MAGNA' : '🛡️ PERK BHP';
      let levelLabel = lvl === 0 ? 'NOWOŚĆ!' : `POZ. ${lvl} → ${lvl + 1}`;

      // Calculate dynamic synergy discovery hint
      let synergyBadge = '';
      if (isWeapon) {
        const evoForWep = Object.values(EVOLUTIONS).find(ev => ev.reqWeapon === opt.id);
        if (evoForWep) {
          const pass = passives[evoForWep.reqPassive];
          const hasPartner = pass && pass.level >= 1;
          const isReady = hasPartner && weapons[opt.id].level >= 4;
          const badgeBg = isReady ? 'rgba(234, 179, 8, 0.25)' : (hasPartner ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 255, 255, 0.06)');
          const badgeColor = isReady ? '#facc15' : (hasPartner ? '#4ade80' : '#94a3b8');
          const badgeBorder = isReady ? '#facc15' : (hasPartner ? '#22c55e' : '#475569');
          const partnerName = pass ? pass.name : 'BHP';
          synergyBadge = `<div style="font-size: 10px; margin-top: 4px; padding: 2px 6px; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; display: inline-flex; align-items: center; gap: 4px;">
            <span>${isReady ? '🔥 SKŁADNIK GOTOWY DO EWOLUCJI:' : (hasPartner ? '✨ SYNERGIA POSIADANA:' : '✨ Synergia z:')}</span>
            <b>${partnerName}</b> ➔ <b>${evoForWep.name}</b>
          </div>`;
        }
      } else {
        const evoForPass = Object.values(EVOLUTIONS).find(ev => ev.reqPassive === opt.id);
        if (evoForPass) {
          const wep = weapons[evoForPass.reqWeapon];
          const hasPartner = wep && wep.level >= 1;
          const isReady = hasPartner && wep.level >= 5;
          const badgeBg = isReady ? 'rgba(234, 179, 8, 0.25)' : (hasPartner ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 255, 255, 0.06)');
          const badgeColor = isReady ? '#facc15' : (hasPartner ? '#4ade80' : '#94a3b8');
          const badgeBorder = isReady ? '#facc15' : (hasPartner ? '#22c55e' : '#475569');
          const partnerName = wep ? (weaponDataList.find(w => w.id === evoForPass.reqWeapon)?.name || evoForPass.reqWeapon) : 'Broń';
          synergyBadge = `<div style="font-size: 10px; margin-top: 4px; padding: 2px 6px; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; display: inline-flex; align-items: center; gap: 4px;">
            <span>${isReady ? '🔥 SKŁADNIK GOTOWY DO EWOLUCJI:' : (hasPartner ? '✨ SYNERGIA POSIADANA:' : '✨ Synergia z:')}</span>
            <b>${partnerName}</b> ➔ <b>${evoForPass.name}</b>
          </div>`;
        }
      }

      card.innerHTML = `
        <div class="card-icon-wrapper" style="border-color: ${isWeapon ? '#38bdf8' : '#22c55e'};">
          <div class="card-icon">${opt.icon}</div>
        </div>
        <div class="card-info">
          <div class="card-header-line">
            <span class="card-badge ${badgeClass}">${badgeLabel}</span>
            <span class="card-stars">${stars}</span>
            <span class="card-level-tag">${levelLabel}</span>
          </div>
          <div class="card-title">${opt.name}</div>
          <div class="card-desc">${opt.desc}</div>
          ${opt.stat ? `<div class="card-stat-boost" style="color: ${isWeapon ? '#38bdf8' : '#4ade80'};">${opt.stat}</div>` : ''}
          ${synergyBadge}
        </div>
      `;
      card.onclick = () => { if (levelUpProcessing) return; levelUpProcessing = true; applyUpgrade(opt); closeLevelUp(); };
    }

    container.appendChild(card);
  });

  document.getElementById('levelup-screen').style.display = 'flex';
}

function rerollLevelUpCards() {
  if (levelUpProcessing) return;
  if (player.rerolls > 0) {
    player.rerolls--;
    sounds.beep();
    triggerLevelUpModal(true);
  }
}

function skipLevelUpCard() {
  if (levelUpProcessing) return;
  levelUpProcessing = true;
  sounds.achieve();
  dtaCoins += 50;
  saveWorkshopData();
  player.battery = Math.min(player.maxBattery, player.battery + 20);
  addSpeechBubble(player.x, player.y - 30, '+50💰 BONUS ZA BRAK ULEPSZENIA!', '#facc15');
  closeLevelUp();
}

function applyBonusUpgrade(opt) {
  sounds.achieve();
  if (opt.id === 'bateria_naprawa') {
    player.battery = player.maxBattery;
    dtaCoins += 150;
    saveWorkshopData();
    addSpeechBubble(player.x, player.y - 30, '⚡ PEŁNA BATERIA +150 DTA!', '#facc15');
  } else if (opt.id === 'kawa_premia') {
    player.skillCooldown = 0;
    score += 500;
    addSpeechBubble(player.x, player.y - 30, '☕ RESET SKILL +500 PKT!', '#38bdf8');
  }
}

function closeLevelUp() {
  levelUpProcessing = false;
  if (levelUpPendingCount > 0) {
    levelUpPendingCount--;
  }
  if (levelUpPendingCount > 0) {
    triggerLevelUpModal();
  } else {
    document.getElementById('levelup-screen').style.display = 'none';
    gameState = STATE.PLAYING;
    updateWeaponsHud();
  }
}

function applyEvolution(evo) {
  sounds.bossAlert();
  screenShake = 25;
  createSparks(player.x, player.y, 120, '#facc15');
  showAnnouncement(`🔥 EWOLUCJA: ${evo.name}!`, '#facc15');
  triggerAchievement('weapon_evolution', 'Ewolucja Magazynowa', '💥');
  if (evo.id === 'bramkaRFID') {
    weapons.scanner.isEvo = true;
    weapons.scanner.damage = 100;
  } else if (evo.id === 'owijarka') {
    weapons.toiletPaper.isEvo = true;
    weapons.toiletPaper.damage = 60;
  } else if (evo.id === 'btHighStack') {
    weapons.pallets.isEvo = true;
    weapons.pallets.damage = 90;
    weapons.pallets.cooldown = 0.5;
  } else if (evo.id === 'zraszacz') {
    weapons.extinguisher.isEvo = true;
    weapons.extinguisher.damage = 150;
    weapons.extinguisher.timer = 0;
    weapons.extinguisher.cooldown = 10.0;
  } else if (evo.id === 'steelTies') {
    weapons.zipTies.isEvo = true;
    weapons.zipTies.damage = 60;
    weapons.zipTies.cooldown = 0.8;
  } else if (evo.id === 'machete') {
    weapons.cutter.isEvo = true;
    weapons.cutter.damage = 45;
    weapons.cutter.cooldown = 0.35;
  } else if (evo.id === 'staplerGun') {
    weapons.stapler.isEvo = true;
    weapons.stapler.damage = 70;
    weapons.stapler.cooldown = 0.45;
    weapons.stapler.count = 6;
  } else if (evo.id === 'hydraulicHammer') {
    weapons.sledgehammer.isEvo = true;
    weapons.sledgehammer.damage = 180;
    weapons.sledgehammer.cooldown = 1.6;
    weapons.sledgehammer.radius = 240;
  } else if (evo.id === 'urzadSkarbowy') {
    weapons.faktura.isEvo = true;
    weapons.faktura.damage = 120;
    weapons.faktura.cooldown = 1.2;
    weapons.faktura.speed = 600;
  } else if (evo.id === 'redbull') {
    weapons.kawa.isEvo = true;
    weapons.kawa.damage = 60;
    weapons.kawa.cooldown = 1.5;
    player.speed += 30;
  }
}

function applyUpgrade(opt) {
  sounds.xp();
  createSparks(player.x, player.y, 25, opt.cat === 'weapon' ? '#38bdf8' : '#4ade80');
  
  if (opt.cat === 'evolution') {
    applyEvolution(opt.evo);
  } else if (opt.cat === 'bonus') {
    if (opt.id === 'bonus_xp') currentXP += 100;
    if (opt.id === 'bonus_battery') player.battery = Math.min(player.maxBattery, player.battery + 50);
    if (opt.id === 'bonus_score') score += 5000;
  } else if (opt.cat === 'weapon') {
    const w = weapons[opt.id];
    w.level++;
    w.damage += 12;
    w.cooldown = Math.max(0.3, w.cooldown * 0.9);
    if (opt.id === 'toiletPaper') w.count = Math.min(6, 2 + Math.floor(w.level / 2));
    if (opt.id === 'stapler') w.count = Math.min(8, 3 + Math.floor(w.level));
  } else if (opt.cat === 'passive') {
    const p = passives[opt.id];
    p.level++;
    if (opt.id === 'magnet') player.magnetRange += 75;
    if (opt.id === 'forks') player.ramDamageMult = (player.ramDamageMult || 1.0) + 0.4;
    if (opt.id === 'coffee') { player.speed += 18; player.maxSkillCooldown = Math.max(3.5, player.maxSkillCooldown - 1.0); }
    if (opt.id === 'battery') { player.maxBattery += 35; player.battery = Math.min(player.maxBattery, player.battery + 40); }
    if (opt.id === 'furia') player.attackSpeedMult = (player.attackSpeedMult || 1.0) + 0.25;
    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;
    if (opt.id === 'stoperan') { player.maxBattery += 30; player.battery += 30; }
    if (opt.id === 'buty_robocze') player.thorns = (player.thorns || 0) + 20;
    if (opt.id === 'karta_multisport') { player.staminaRegenMult = (player.staminaRegenMult || 1) + 0.3; player.speed += 10; }
    if (opt.id === 'paczek') { player.critChance += 0.20; player.foodDropBoost = (player.foodDropBoost || 0) + 0.25; }
    if (opt.id === 'kamizelka') { player.damageReduction = (player.damageReduction || 0) + 0.25; }
    if (opt.id === 'umowa') { player.xpBonusMult = (player.xpBonusMult || 1.0) + 0.25; player.extraLives = (player.extraLives || 0) + 1; }
  }
}

function updateWeaponsHud() {
  const container = document.getElementById('weapons-hud');
  container.innerHTML = '';
  Object.keys(weapons).forEach(k => {
    const w = weapons[k];
    if (w.level > 0) {
      const slot = document.createElement('div');
      slot.className = 'weapon-hud-slot' + (w.isEvo ? ' evo' : '');
      slot.innerText = w.isEvo ? '⚡' : w.icon;
      container.appendChild(slot);
    }
  });
}

// --- WEAPONS FIRING SYSTEM ---
function updateWeapons(dt) {
  const effectiveDt = dt * (player.attackSpeedMult || 1.0);
  if (weapons.scanner.level > 0) {
    weapons.scanner.timer += effectiveDt;
    if (weapons.scanner.timer >= weapons.scanner.cooldown) {
      weapons.scanner.timer = 0;
      fireScanner();
    }
  }
  if (weapons.toiletPaper.level > 0) {
    weapons.toiletPaper.timer += effectiveDt;
    if (weapons.toiletPaper.timer >= weapons.toiletPaper.cooldown) {
      weapons.toiletPaper.timer = 0;
      fireToiletPaper();
    }
  }
  if (weapons.stretchAura.level > 0) {
    weapons.stretchAura.angle += effectiveDt * (weapons.stretchAura.isEvo ? 5.5 : 3.8);
    checkStretchAuraHit(dt);
  }
  if (weapons.pallets.level > 0) {
    weapons.pallets.timer += effectiveDt;
    if (weapons.pallets.timer >= weapons.pallets.cooldown) {
      weapons.pallets.timer = 0;
      firePallet();
    }
  }
  if (weapons.extinguisher.level > 0) {
    weapons.extinguisher.timer += effectiveDt;
    if (weapons.extinguisher.timer >= weapons.extinguisher.cooldown) {
      weapons.extinguisher.timer = 0;
      fireExtinguisher();
    }
  }
  if (weapons.zipTies.level > 0) {
    weapons.zipTies.timer += effectiveDt;
    if (weapons.zipTies.timer >= weapons.zipTies.cooldown) {
      weapons.zipTies.timer = 0;
      fireZipTies();
    }
  }
  if (weapons.cutter.level > 0) {
    weapons.cutter.timer += effectiveDt;
    if (weapons.cutter.timer >= weapons.cutter.cooldown) {
      weapons.cutter.timer = 0;
      fireCutter();
    }
  }
  if (weapons.stapler.level > 0) {
    weapons.stapler.timer += effectiveDt;
    if (weapons.stapler.timer >= weapons.stapler.cooldown) {
      weapons.stapler.timer = 0;
      fireStapler();
    }
  }
  if (weapons.sledgehammer.level > 0) {
    weapons.sledgehammer.timer += effectiveDt;
    if (weapons.sledgehammer.timer >= weapons.sledgehammer.cooldown) {
      weapons.sledgehammer.timer = 0;
      fireSledgehammer();
    }
  }
  if (weapons.faktura.level > 0) {
    weapons.faktura.timer += effectiveDt;
    if (weapons.faktura.timer >= weapons.faktura.cooldown) {
      weapons.faktura.timer = 0;
      fireFaktura();
    }
  }
  if (weapons.kawa.level > 0) {
    weapons.kawa.timer += effectiveDt;
    if (weapons.kawa.timer >= weapons.kawa.cooldown) {
      weapons.kawa.timer = 0;
      fireKawa();
    }
  }
  if (weapons.hydrant.level > 0) {
    weapons.hydrant.timer += effectiveDt;
    if (weapons.hydrant.timer >= weapons.hydrant.cooldown) {
      weapons.hydrant.timer = 0;
      fireHydrant();
    }
  }
  if (weapons.megafon.level > 0) {
    weapons.megafon.timer += effectiveDt;
    if (weapons.megafon.timer >= weapons.megafon.cooldown) {
      weapons.megafon.timer = 0;
      fireMegafon();
    }
  }
}



function fireHydrant() {
  if (enemies.length === 0) return;
  sounds.freeze();
  const count = weapons.hydrant.isEvo ? 8 : (weapons.hydrant.level >= 3 ? 3 : 1);
  const dmg = getDamage(weapons.hydrant.damage);
  
  if (weapons.hydrant.isEvo) {
      // Super Hydrant: Swirling Flood Tornado around player
      screenShake = Math.max(screenShake, 6);
      for (let i = 0; i < 16; i++) {
         const a = (i / 16) * Math.PI * 2 + gameTime * 3;
         projectiles.push({
            type: 'hydrant_beam',
            x: player.x,
            y: player.y,
            vx: Math.cos(a) * 550,
            vy: Math.sin(a) * 550,
            damage: dmg * 1.5,
            pierce: 10,
            life: 0.8,
            maxLife: 0.8,
            isEvo: true
         });
      }
  } else {
      let closest = null, minD = 9999;
      enemies.forEach(e => {
         const d = Math.hypot(e.x - player.x, e.y - player.y);
         if (d < minD) { minD = d; closest = e; }
      });
      if (closest) {
         const baseA = Math.atan2(closest.y - player.y, closest.x - player.x);
         for (let i = 0; i < count; i++) {
             const spread = (i - count/2) * 0.15;
             projectiles.push({
                type: 'hydrant_beam',
                x: player.x,
                y: player.y,
                vx: Math.cos(baseA + spread) * 500,
                vy: Math.sin(baseA + spread) * 500,
                damage: dmg,
                pierce: 3,
                life: 0.7,
                maxLife: 0.7
             });
         }
      }
  }
}

function fireMegafon() {
  sounds.megaph();
  const dmg = getDamage(weapons.megafon.damage);
  screenShake = Math.max(screenShake, 5);
  
  if (weapons.megafon.isEvo) {
      // System DSO 120dB: Screen-wide emergency siren blast!
      showAnnouncement("🔊 SYSTEM DSO 120dB: EWAKUACJA HALI!", "#ef4444");
      createSparks(player.x, player.y, 45, '#ef4444');
      enemies.forEach(e => {
         damageEnemy(e, dmg * 2.0);
         e.stunTimer = 2.5;
         e.slowTimer = 4.0;
      });
  } else {
      // Cone shockwave in front of player
      const coneA = player.angle;
      const coneRadius = weapons.megafon.range;
      enemies.forEach(e => {
         const dx = e.x - player.x;
         const dy = e.y - player.y;
         const dist = Math.hypot(dx, dy);
         if (dist < coneRadius) {
            const angleToE = Math.atan2(dy, dx);
            let diffA = Math.abs(angleToE - coneA);
            if (diffA > Math.PI) diffA = Math.PI * 2 - diffA;
            if (diffA < 0.7) { // 80 deg cone
                damageEnemy(e, dmg);
                e.stunTimer = 1.2;
                e.x += Math.cos(angleToE) * 65; // Knockback
                e.y += Math.sin(angleToE) * 65;
            }
         }
      });
      addSpeechBubble(player.x, player.y - 30, '📢 DO ROBOTY!!', '#facc15');
  }
}

function fireFaktura() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.faktura.isEvo ? 5 : 2;
  const dmg = getDamage(weapons.faktura.damage);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    projectiles.push({
      type: 'faktura',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.faktura.speed,
      vy: Math.sin(angle) * weapons.faktura.speed,
      damage: dmg,
      pierce: weapons.faktura.isEvo ? 5 : 2,
      life: 3.0,
      maxLife: 3.0,
      angle: angle,
      rotSpeed: (Math.random() - 0.5) * 15
    });
  }
}

function fireKawa() {
  sounds.freeze();
  const r = weapons.kawa.isEvo ? weapons.kawa.radius * 2 : weapons.kawa.radius;
  const dmg = getDamage(weapons.kawa.damage);
  
  // Splat effect
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * r;
    const px = player.x + Math.cos(angle) * dist;
    const py = player.y + Math.sin(angle) * dist;
    warehousePuddles.push({
      x: px, y: py, rx: 15 + Math.random() * 20, ry: 10 + Math.random() * 15,
      color: 'rgba(60, 42, 33, 0.7)' // dark coffee color
    });
  }

  // Damage enemies
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const dist = Math.hypot(e.x - player.x, e.y - player.y);
    if (dist <= r) {
      damageEnemy(e, dmg);
      spawnDamageText(e.x, e.y - 20, dmg, '#78350f', true);
    }
  }
}

function fireStapler() { 
  spawnMuzzleFlash(player.x + Math.cos(player.angle)*20, player.y + Math.sin(player.angle)*20, 35, '#fef08a'); 
  spawnBarrelSmoke(player.x, player.y, player.angle);  
  ejectSpentShell(player.x, player.y, player.angle); 
  screenShake = Math.max(screenShake, 3.5);
  if (sounds && sounds.heavyGunshot) sounds.heavyGunshot();
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.stapler.count;
  for (let i = 0; i < count; i++) {
    const angle = player.angle + (Math.random() - 0.5) * 0.8;
    projectiles.push({
      type: 'staple',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.stapler.speed,
      vy: Math.sin(angle) * weapons.stapler.speed,
      rot: angle,
      damage: weapons.stapler.damage,
      life: 50,
      isEvo: weapons.stapler.isEvo
    });
  }
}

function fireSledgehammer() {
  sounds.pallet();
  screenShake = Math.max(screenShake, 22);
  hitStopTimer = 0.08;
  const r = weapons.sledgehammer.radius;
  enemies.forEach(e => {
    if (e.dead) return;
    const d = Math.hypot(e.x - player.x, e.y - player.y);
    if (d < r) {
      damageEnemy(e, weapons.sledgehammer.damage);
      e.slowTimer = 2.0;
      createSparks(e.x, e.y, 8, '#f59e0b');
    }
  });
  projectiles.push({
    type: 'shockwave',
    x: player.x,
    y: player.y,
    radius: 10,
    maxRadius: r,
    life: 0.35,
    maxLife: 0.35,
    color: weapons.sledgehammer.isEvo ? '#f59e0b' : '#94a3b8'
  });
}

function fireZipTies() { spawnMuzzleFlash(player.x + Math.cos(player.angle)*16, player.y + Math.sin(player.angle)*16, 30, '#cbd5e1'); 
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.zipTies.isEvo ? 6 : 3;
  for (let i = 0; i < count; i++) {
    const angle = player.angle + (Math.random() - 0.5) * 3;
    projectiles.push({
      type: 'zip_tie',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.zipTies.speed,
      vy: Math.sin(angle) * weapons.zipTies.speed,
      rot: angle,
      damage: weapons.zipTies.damage,
      life: 60,
      isEvo: weapons.zipTies.isEvo
    });
  }
}

function fireCutter() { spawnMuzzleFlash(player.x + Math.cos(player.angle)*16, player.y + Math.sin(player.angle)*16, 28, '#f43f5e'); 
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.cutter.isEvo ? 4 : 2;
  for (let i = 0; i < count; i++) {
    let angle = player.angle + (Math.random()-0.5)*0.5;
    if (!aimTouchState.active) {
      let target = enemies[Math.floor(Math.random() * enemies.length)];
      angle = Math.atan2(target.y - player.y, target.x - player.x) + (Math.random()-0.5)*0.5;
    }
    projectiles.push({
      type: 'cutter',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.cutter.speed,
      vy: Math.sin(angle) * weapons.cutter.speed,
      rot: angle,
      damage: weapons.cutter.damage,
      life: 80,
      isEvo: weapons.cutter.isEvo
    });
  }
}

function fireToiletPaper() { spawnMuzzleFlash(player.x + Math.cos(player.angle)*16, player.y + Math.sin(player.angle)*16, 30, '#e2e8f0'); 
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.toiletPaper.isEvo ? 8 : weapons.toiletPaper.count;
  for (let i = 0; i < count; i++) {
    let angle = weapons.toiletPaper.isEvo 
      ? (i * (Math.PI * 2 / count))
      : player.angle + (Math.random() - 0.5) * 1.2;
    if (!aimTouchState.active && !weapons.toiletPaper.isEvo && enemies.length > 0) {
      let closest = enemies.reduce((prev, curr) => Math.hypot(curr.x-player.x, curr.y-player.y) < Math.hypot(prev.x-player.x, prev.y-player.y) ? curr : prev);
      angle = Math.atan2(closest.y - player.y, closest.x - player.x) + (Math.random() - 0.5) * 0.5;
    }
    projectiles.push({
      type: 'toilet_paper',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.toiletPaper.speed,
      vy: Math.sin(angle) * weapons.toiletPaper.speed,
      rot: 0,
      life: 2.2,
      damage: weapons.toiletPaper.damage,
      isEvo: weapons.toiletPaper.isEvo
    });
  }
}

function fireScanner() { 
  spawnMuzzleFlash(player.x + Math.cos(player.angle)*15, player.y + Math.sin(player.angle)*15, 45, '#38bdf8');  
  if (Math.random() < 0.4) ejectSpentShell(player.x, player.y, player.angle);
  screenShake = Math.max(screenShake, 1.2);
  if (weapons.scanner.isEvo) {
    // bramkaRFID - constant spinning lines
    const numLines = 4;
    const rfidAngle = gameTime * 3;
    const range = 250;
    for(let i=0; i<numLines; i++) {
       let a = rfidAngle + (i * Math.PI * 2 / numLines);
       let ex = player.x + Math.cos(a) * range;
       let ey = player.y + Math.sin(a) * range;
       projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: ex, y2: ey, life: 0.1, color: '#facc15' });
       // Check collisions along this line
       for (let j = 0; j < enemies.length; j++) {
          let e = enemies[j];
          if (e.dead) continue;
          let dx = e.x - player.x; let dy = e.y - player.y;
          let enemyAngle = Math.atan2(dy, dx);
          let dist = Math.hypot(dx, dy);
          if (dist < range && Math.abs(enemyAngle - a) < 0.2) {
             damageEnemy(e, weapons.scanner.damage);
             e.info.xp *= 1.5; // +50% XP
             createSparks(e.x, e.y, 5, '#facc15');
          }
       }
    }
    sounds.beep();
  } else {
    if (enemies.length === 0) return;
    const maxRangeSq = weapons.scanner.range * weapons.scanner.range;
    let count = 0;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.dead) continue;
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      if (dx * dx + dy * dy <= maxRangeSq) {
        projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: e.x, y2: e.y, life: 0.25, color: '#ef4444', width: 3 });
        damageEnemy(e, weapons.scanner.damage);
        createSparks(e.x, e.y, 4, '#ef4444');
        count++;
        if (count >= weapons.scanner.pierce) break;
      }
    }
    if (count > 0) sounds.beep();
  }
}

function checkStretchAuraHit(dt) {
  const count = weapons.stretchAura.count;
  const radius = weapons.stretchAura.radius;
  for (let i = 0; i < count; i++) {
    const ang = weapons.stretchAura.angle + (i * (Math.PI * 2 / count));
    const ax = player.x + Math.cos(ang) * radius;
    const ay = player.y + Math.sin(ang) * radius;
    for (let j = 0; j < enemies.length; j++) {
      const e = enemies[j];
      if (e.dead) continue;
      const dx = e.x - ax;
      const dy = e.y - ay;
      if (dx * dx + dy * dy < (e.info.radius + 20) * (e.info.radius + 20)) {
        damageEnemy(e, weapons.stretchAura.damage * dt * 3.5);
      }
    }
  }
}

function firePallet() { 
  spawnMuzzleFlash(player.x + Math.cos(player.angle)*24, player.y + Math.sin(player.angle)*24, 50, '#f59e0b'); 
  spawnBarrelSmoke(player.x, player.y, player.angle);  
  ejectSpentShell(player.x, player.y, player.angle);
  screenShake = Math.max(screenShake, 8);
  if (enemies.length === 0) return;
  let target = null;
  let minDistSq = 500 * 500;
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.dead) continue;
    const distSq = (e.x - player.x) * (e.x - player.x) + (e.y - player.y) * (e.y - player.y);
    if (distSq < minDistSq) { minDistSq = distSq; target = e; }
  }
  let a = player.angle;
  if (target && !aimTouchState.active) {
    a = Math.atan2(target.y - player.y, target.x - player.x);
  }

  const numPallets = weapons.pallets.isEvo ? 4 : 1;
  for (let p = 0; p < numPallets; p++) {
    const offsetAng = (p - (numPallets - 1) / 2) * 0.35;
    projectiles.push({
      type: 'pallet',
      x: player.x,
      y: player.y,
      vx: Math.cos(a + offsetAng) * weapons.pallets.speed,
      vy: Math.sin(a + offsetAng) * weapons.pallets.speed,
      rot: 0,
      life: 3.0,
      damage: weapons.pallets.damage
    });
  }
  sounds.pallet();
}

function fireExtinguisher() {
  sounds.freeze();
  const forwardAngle = player.angle;
  const range = weapons.extinguisher.range;
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.dead) continue;
    const dx = e.x - player.x;
    const dy = e.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < range) {
      const angToEnemy = Math.atan2(dy, dx);
      let diff = Math.abs(angToEnemy - forwardAngle);
      while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
      if (diff < (weapons.extinguisher.isEvo ? 1.4 : 0.85)) {
        damageEnemy(e, weapons.extinguisher.damage);
        e.slowTimer = weapons.extinguisher.isEvo ? 4.5 : 2.5;
        createSparks(e.x, e.y, 6, '#67e8f9');
      }
    }
  }
  projectiles.push({
    type: 'cold_cone',
    x: player.x,
    y: player.y,
    angle: forwardAngle,
    range: range,
    life: 0.35,
    isEvo: weapons.extinguisher.isEvo
  });
}

const weaponDamageStats = {};
Object.keys(weapons).forEach(k => { weaponDamageStats[k] = 0; });
weaponDamageStats['ramming'] = 0;
weaponDamageStats['general'] = 0;

function damageEnemy(e, amount, weaponSource = 'general') {
  if (isNaN(amount) || amount === undefined) amount = 15;
  const isCrit = Math.random() < (player.critChance || 0.1);
  let dmg = isCrit ? amount * 2.2 : amount;
  if (player.damageMult && !isNaN(player.damageMult)) dmg *= player.damageMult;
  if (isNaN(dmg)) dmg = amount;
  
  // Improved combat feel
  hitStopTimer = Math.max(hitStopTimer, 0.025);
  screenShake = Math.max(screenShake, 3);
  if (isCrit || e.isBoss) {
      hitStopTimer = Math.max(hitStopTimer, e.isBoss ? 0.08 : 0.045); // Enhanced hit-stop
      screenShake = Math.max(screenShake, e.isBoss ? 12 : 7);
      if (window.AndroidBridge && window.AndroidBridge.vibrate) {
        window.AndroidBridge.vibrate(e.isBoss ? 60 : 35);
      }
  }
  
  if (e.info && e.info.armor) dmg *= 0.3; // 70% damage reduction
  if (e.info && e.info.directionalShield) dmg *= 0.5; 
  
  dmg = Math.round(dmg);
  e.hp -= dmg;
  e.hitFlash = 0.12;
  spawnDamageNumber(e.x, e.y, dmg, isCrit);

  // Track DPS contribution
  if (!weaponDamageStats[weaponSource]) weaponDamageStats[weaponSource] = 0;
  weaponDamageStats[weaponSource] += dmg;

  // Boss Enrage Phase (<45% HP)
  if (e.isBoss && e.hp > 0 && e.hp <= e.maxHp * 0.45 && !e.isEnraged) {
    e.isEnraged = true;
    screenShake = 22;
    sounds.bossAlert();
    showAnnouncement(`🚨 ${e.info.name.toUpperCase()} WPADA W SZAŁ BHP (ENRAGE)!`, '#ef4444');
    addSpeechBubble(e.x, e.y - 45, '⚡ TRYB FURII BHP: +35% SZYBKOŚCI!', '#ef4444');
    createSparks(e.x, e.y, 60, '#ef4444');
    if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(120);
  }

  // Thorns effect (calculated without recursion)
  if (player.thorns && player.thorns > 0) {
      e.hp -= player.thorns;
      weaponDamageStats['ramming'] = (weaponDamageStats['ramming'] || 0) + player.thorns;
      if (Math.random() < 0.3) createSparks(e.x, e.y, 5, '#facc15');
  }
  
  // Apply physics-based knockback on weapon hit
  const angleToPlayer = Math.atan2(e.y - player.y, e.x - player.x);
  const kbForce = isCrit ? 16 : 8;
  e.x += Math.cos(angleToPlayer) * kbForce;
  e.y += Math.sin(angleToPlayer) * kbForce;
  
  // Blood splatter on hit
  const hitParticles = isCrit ? 6 : 2;
  for (let i = 0; i < hitParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    spawnParticle(e.x, e.y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.3 + Math.random() * 0.2, Math.random() * 2.5 + 1, (e.info && e.info.color) || '#991b1b');
  }

  if (e.hp <= 0 && !e.dead) {
    killEnemy(e);
  }
}



// --- TACTICAL REALISM & ATMOSPHERE SYSTEMS ---
const muzzleFlashes = [];
const barrelSmoke = [];
const dustMotes = [];
const NUM_DUST_MOTES = 60;

for (let i = 0; i < NUM_DUST_MOTES; i++) {
  dustMotes.push({
    x: Math.random() * ARENA_WIDTH,
    y: Math.random() * ARENA_HEIGHT,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    size: Math.random() * 2.2 + 0.8,
    alpha: Math.random() * 0.4 + 0.2
  });
}

function spawnMuzzleFlash(x, y, radius = 45, color = '#fef08a') {
  muzzleFlashes.push({
    x: x,
    y: y,
    radius: radius,
    life: 0.07,
    maxLife: 0.07,
    color: color
  });
}

function spawnBarrelSmoke(x, y, angle) {
  for (let i = 0; i < 3; i++) {
    const spd = Math.random() * 25 + 10;
    const spread = (Math.random() - 0.5) * 0.8;
    barrelSmoke.push({
      x: x + Math.cos(angle) * 18,
      y: y + Math.sin(angle) * 18,
      vx: Math.cos(angle + spread) * spd + (Math.random() - 0.5) * 10,
      vy: Math.sin(angle + spread) * spd + (Math.random() - 0.5) * 10,
      size: Math.random() * 4 + 3,
      maxSize: Math.random() * 14 + 10,
      life: 0.45,
      maxLife: 0.45,
      alpha: 0.35
    });
  }
}

function updateTacticalAtmosphere(dt) {
  for (let i = muzzleFlashes.length - 1; i >= 0; i--) {
    muzzleFlashes[i].life -= dt;
    if (muzzleFlashes[i].life <= 0) muzzleFlashes.splice(i, 1);
  }
  for (let i = barrelSmoke.length - 1; i >= 0; i--) {
    const sm = barrelSmoke[i];
    sm.life -= dt;
    sm.x += sm.vx * dt;
    sm.y += sm.vy * dt;
    sm.size += (sm.maxSize - sm.size) * 4 * dt;
    sm.alpha = (sm.life / sm.maxLife) * 0.3;
    if (sm.life <= 0) barrelSmoke.splice(i, 1);
  }
  for (let i = 0; i < dustMotes.length; i++) {
    const dm = dustMotes[i];
    dm.x += dm.vx * dt;
    dm.y += dm.vy * dt;
    if (dm.x < 0) dm.x = ARENA_WIDTH;
    if (dm.x > ARENA_WIDTH) dm.x = 0;
    if (dm.y < 0) dm.y = ARENA_HEIGHT;
    if (dm.y > ARENA_HEIGHT) dm.y = 0;
  }
}

function drawMuzzleFlashesAndSmoke(ctx) {
  const zoom = camera.zoom || 0.5;
  const viewW = gameWidth / zoom;
  const viewH = gameHeight / zoom;

  for (let i = 0; i < barrelSmoke.length; i++) {
    const sm = barrelSmoke[i];
    if (sm.x < camera.x - 40 || sm.x > camera.x + viewW + 40 ||
        sm.y < camera.y - 40 || sm.y > camera.y + viewH + 40) {
      continue;
    }
    ctx.save();
    ctx.fillStyle = `rgba(148, 163, 184, ${sm.alpha})`;
    ctx.beginPath();
    ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < muzzleFlashes.length; i++) {
    const mf = muzzleFlashes[i];
    if (mf.x < camera.x - 100 || mf.x > camera.x + viewW + 100 ||
        mf.y < camera.y - 100 || mf.y > camera.y + viewH + 100) {
      continue;
    }
    ctx.save();
    const flashGrad = ctx.createRadialGradient(mf.x, mf.y, 4, mf.x, mf.y, mf.radius);
    flashGrad.addColorStop(0, '#ffffff');
    flashGrad.addColorStop(0.3, mf.color);
    flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flashGrad;
    ctx.beginPath();
    ctx.arc(mf.x, mf.y, mf.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawAtmosphericDust(ctx, viewW, viewH) {
  if (typeof dustMotes === 'undefined' || !dustMotes || dustMotes.length === 0) return;
  ctx.save();
  const pAngle = player.angle;

  for (let i = 0; i < dustMotes.length; i++) {
    const dm = dustMotes[i];
    if (dm.x < camera.x - 20 || dm.x > camera.x + viewW + 20 ||
        dm.y < camera.y - 20 || dm.y > camera.y + viewH + 20) {
      continue;
    }

    // Dynamic glowing within player's headlight cone for AAA cinematic feeling
    const dx = dm.x - player.x;
    const dy = dm.y - player.y;
    const dist = Math.hypot(dx, dy);

    let finalAlpha = dm.alpha * 0.45; // subtle default
    if (dist < 360) {
      const angleToMote = Math.atan2(dy, dx);
      let diff = angleToMote - pAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      if (Math.abs(diff) < 0.35) {
        // Boost glow based on proximity and headlight intensity
        finalAlpha = dm.alpha * (2.8 - (dist / 360) * 1.8);
      }
    }

    ctx.globalAlpha = finalAlpha;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(dm.x, dm.y, dm.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawTacticalTargetingSystem(ctx) {
  let closestEnemy = null;
  let minDist = 420;
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.dead) continue;
    const dx = e.x - player.x;
    const dy = e.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < minDist) {
      let angleToE = Math.atan2(dy, dx);
      let diff = Math.abs(angleToE - player.angle);
      while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
      if (diff < 1.1) {
        minDist = dist;
        closestEnemy = e;
      }
    }
  }

  const laserDist = closestEnemy ? minDist : 280;
  const lx = player.x + Math.cos(player.angle) * laserDist;
  const ly = player.y + Math.sin(player.angle) * laserDist;

  ctx.save();
  const laserAlpha = 0.5 + Math.sin(gameTime * 12) * 0.15;
  ctx.strokeStyle = `rgba(239, 68, 68, ${laserAlpha})`;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(player.x + Math.cos(player.angle) * 22, player.y + Math.sin(player.angle) * 22);
  ctx.lineTo(lx, ly);
  ctx.stroke();
  ctx.setLineDash([]);

  const dotGrad = ctx.createRadialGradient(lx, ly, 1, lx, ly, 8);
  dotGrad.addColorStop(0, '#ffffff');
  dotGrad.addColorStop(0.4, '#ef4444');
  dotGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = dotGrad;
  ctx.beginPath();
  ctx.arc(lx, ly, 8, 0, Math.PI * 2);
  ctx.fill();

  if (closestEnemy) {
    const ex = closestEnemy.x;
    const ey = closestEnemy.y;
    const r = (closestEnemy.info.radius || 18) + 6;
    const rot = gameTime * 3;

    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(rot);
    ctx.strokeStyle = closestEnemy.isBoss ? '#dc2626' : '#f59e0b';
    ctx.lineWidth = 1.8;
    const bLen = 8;
    ctx.beginPath(); ctx.moveTo(-r, -r + bLen); ctx.lineTo(-r, -r); ctx.lineTo(-r + bLen, -r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r - bLen, -r); ctx.lineTo(r, -r); ctx.lineTo(r, -r + bLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r, r - bLen); ctx.lineTo(r, r); ctx.lineTo(r - bLen, r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r + bLen, r); ctx.lineTo(-r, r); ctx.lineTo(-r, r - bLen); ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.fillText(`TGT: ${(minDist / 10).toFixed(1)}m`, ex, ey - r - 6);
    ctx.restore();
  }
  ctx.restore();
}

function drawTacticalHUDOverlay(ctx) {
  // Military scanlines and corner telemetry brackets
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  const pad = 12;
  const len = 20;

  // Top-left HUD bracket
  ctx.beginPath();
  ctx.moveTo(pad, pad + len);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + len, pad);
  ctx.stroke();

  // Bottom-left HUD bracket
  ctx.beginPath();
  ctx.moveTo(pad, gameHeight - pad - len);
  ctx.lineTo(pad, gameHeight - pad);
  ctx.lineTo(pad + len, gameHeight - pad);
  ctx.stroke();

  // Bottom-right HUD bracket
  ctx.beginPath();
  ctx.moveTo(gameWidth - pad - len, gameHeight - pad);
  ctx.lineTo(gameWidth - pad, gameHeight - pad);
  ctx.lineTo(gameWidth - pad, gameHeight - pad - len);
  ctx.stroke();

  // Tactical telemetry ticker on bottom
  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
  ctx.textAlign = 'left';
  const secInMin = Math.floor(gameTime) % 60;
  const wavePhase = secInMin < 12 ? 'INTRO' : (secInMin < 28 ? 'BUILDUP' : (secInMin < 42 ? 'PRESSURE' : (secInMin < 52 ? 'PEAK' : 'BREATH')));
  const currentWaveNum = Math.floor(gameTime / 60) + 1;
  const posText = `FALA ${currentWaveNum} [${wavePhase}] // POS: ${Math.round(player.x)},${Math.round(player.y)} // WROGI: ${enemies.length} // COMBO: x${comboCount}`;
  ctx.fillText(posText, pad + 10, gameHeight - pad - 6);

  ctx.restore();
}


// --- CRIMSONLAND VISCERAL COMBAT & SHRAPNEL SYSTEM ---
const shrapnelPellets = [];

function spawnShrapnelCluster(x, y, count = 5, damage = 35) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 320 + 220;
    shrapnelPellets.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage: damage,
      life: 0.28,
      maxLife: 0.28
    });
  }
}

function updateShrapnel(dt) {
  for (let i = shrapnelPellets.length - 1; i >= 0; i--) {
    const sh = shrapnelPellets[i];
    sh.life -= dt;
    sh.x += sh.vx * dt;
    sh.y += sh.vy * dt;
    if (sh.life <= 0) {
      shrapnelPellets.splice(i, 1);
      continue;
    }
    // Collide with enemies
    for (let j = 0; j < enemies.length; j++) {
      const e = enemies[j];
      if (e.dead) continue;
      if (Math.hypot(e.x - sh.x, e.y - sh.y) < (e.info.radius || 18) + 6) {
        damageEnemy(e, sh.damage, Math.atan2(sh.vy, sh.vx));
        createSparks(sh.x, sh.y, 4, '#f59e0b');
        shrapnelPellets.splice(i, 1);
        break;
      }
    }
  }
}

function drawShrapnel(ctx) {
  ctx.save();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2;
  for (let i = 0; i < shrapnelPellets.length; i++) {
    const sh = shrapnelPellets[i];
    ctx.beginPath();
    ctx.moveTo(sh.x, sh.y);
    ctx.lineTo(sh.x - sh.vx * 0.03, sh.y - sh.vy * 0.03);
    ctx.stroke();
  }
  ctx.restore();
}

function stampDirectionalSpray(x, y, angle, colorType = 'blood') {
  if (typeof splatterCtx === 'undefined') return;
  splatterCtx.save();
  let col = '#7f1d1d';
  if (colorType === 'oil') col = '#0f172a';
  else if (colorType === 'coffee') col = '#78350f';
  else if (colorType === 'acid') col = '#84cc16';
  else if (colorType === 'folia') col = '#cbd5e1';

  splatterCtx.fillStyle = col;
  splatterCtx.globalAlpha = 0.85;

  // Elongated arterial streak along impact angle
  const dist = Math.random() * 30 + 15;
  const sprayX = x + Math.cos(angle) * dist;
  const sprayY = y + Math.sin(angle) * dist;
  splatterCtx.beginPath();
  splatterCtx.ellipse(sprayX, sprayY, 14, 5, angle, 0, Math.PI * 2);
  splatterCtx.fill();

  // Droplet spray cluster
  for (let i = 0; i < 4; i++) {
    const dDist = dist + Math.random() * 25 + 5;
    const dSpread = angle + (Math.random() - 0.5) * 0.5;
    const dx = x + Math.cos(dSpread) * dDist;
    const dy = y + Math.sin(dSpread) * dDist;
    splatterCtx.beginPath();
    splatterCtx.arc(dx, dy, Math.random() * 3 + 1.5, 0, Math.PI * 2);
    splatterCtx.fill();
  }
  splatterCtx.restore();
}

// --- CRIMSONLAND TACTICAL CASINGS & VISCERAL SYSTEM ---
const spentShells = [];
const MAX_SPENT_SHELLS = 220;

function ejectSpentShell(x, y, angle) {
  if (spentShells.length >= MAX_SPENT_SHELLS) spentShells.shift();
  const ejectAngle = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.6;
  const speed = Math.random() * 90 + 50;
  spentShells.push({
    x: x,
    y: y,
    vx: Math.cos(ejectAngle) * speed,
    vy: Math.sin(ejectAngle) * speed,
    rot: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 14,
    altitude: 12,
    vz: Math.random() * 60 + 40,
    bounces: 2,
    settled: false,
    color: '#eab308'
  });
  if (Math.random() < 0.35 && sounds && sounds.shellDrop) sounds.shellDrop();
}

function updateSpentShells(dt) {
  for (let i = 0; i < spentShells.length; i++) {
    const s = spentShells[i];
    if (s.settled) continue;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.rot += s.vRot * dt;
    s.vz -= 320 * dt; // gravity
    s.altitude += s.vz * dt;
    if (s.altitude <= 0) {
      s.altitude = 0;
      if (s.bounces > 0) {
        s.bounces--;
        s.vz = -s.vz * 0.45;
        s.vx *= 0.5;
        s.vy *= 0.5;
      } else {
        s.settled = true;
        if (typeof splatterCtx !== 'undefined' && splatterCtx) {
          splatterCtx.save();
          splatterCtx.translate(s.x, s.y);
          splatterCtx.rotate(s.rot);
          splatterCtx.fillStyle = '#ca8a04';
          splatterCtx.fillRect(-3, -1.2, 6, 2.4);
          splatterCtx.fillStyle = '#fef08a';
          splatterCtx.fillRect(-2, -0.6, 4, 1.2);
          splatterCtx.restore();
        }
        spentShells.splice(i, 1);
        i--;
      }
    }
  }
}

function drawSpentShells(ctx) {
  const zoom = camera.zoom || 0.5;
  const viewW = gameWidth / zoom;
  const viewH = gameHeight / zoom;

  for (let i = 0; i < spentShells.length; i++) {
    const s = spentShells[i];
    if (s.x < camera.x - 40 || s.x > camera.x + viewW + 40 ||
        s.y < camera.y - 40 || s.y > camera.y + viewH + 40) {
      continue;
    }
    ctx.save();
    ctx.translate(s.x, s.y - s.altitude);
    ctx.rotate(s.rot);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-3, -1.2, 6, 2.4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2, -0.6, 4, 1.2);
    ctx.restore();
  }
}

// --- TACTICAL COMBAT DROPS (CRIMSONLAND POWER-UPS) ---
const tacticalDrops = [];
let tacticalOverchargeTimer = 0;
let tacticalPierceTimer = 0;
let tacticalBulletTimeTimer = 0;

function trySpawnTacticalDrop(x, y) {
  // 4% drop chance from slain enemies
  if (Math.random() > 0.04) return;
  const types = ['overcharge', 'cryo', 'nuke', 'pierce', 'bullet_time'];
  const t = types[Math.floor(Math.random() * types.length)];
  tacticalDrops.push({
    x: x,
    y: y,
    type: t,
    life: 18.0,
    pulse: 0
  });
}

function updateTacticalDrops(dt) {
  // Update timers
  if (tacticalOverchargeTimer > 0) tacticalOverchargeTimer -= dt;
  if (tacticalPierceTimer > 0) tacticalPierceTimer -= dt;
  if (tacticalBulletTimeTimer > 0) tacticalBulletTimeTimer -= dt;

  for (let i = tacticalDrops.length - 1; i >= 0; i--) {
    const d = tacticalDrops[i];
    d.life -= dt;
    d.pulse += dt * 5;
    if (d.life <= 0) {
      tacticalDrops.splice(i, 1);
      continue;
    }
    // Check pickup
    const dist = Math.hypot(d.x - player.x, d.y - player.y);
    if (dist < player.radius + 24) {
      applyTacticalDrop(d.type);
      tacticalDrops.splice(i, 1);
    }
  }
}

function applyTacticalDrop(type) {
  if (sounds && sounds.levelUp) sounds.levelUp();
  if (type === 'overcharge') {
    tacticalOverchargeTimer = 7.0;
    showAnnouncement('⚡ PRZECIĄŻENIE BOJOWE (+150% ROF)', '#38bdf8');
    createSparks(player.x, player.y, 25, '#38bdf8');
  } else if (type === 'cryo') {
    enemies.forEach(e => {
      e.slowTimer = 4.0;
      createSparks(e.x, e.y, 10, '#67e8f9');
    });
    if (sounds && sounds.freezeShatter) sounds.freezeShatter();
    showAnnouncement('❄️ IMPULS KRIOGENICZNY (STAZA HORRDY)', '#67e8f9');
    screenShake = 6;
  } else if (type === 'nuke') {
    if (sounds && sounds.nukeBoom) sounds.nukeBoom();
    showAnnouncement('💥 ŁADUNEK TERMOBARYCZNY EMP', '#ef4444');
    screenShake = 14;
    enemies.forEach(e => {
      if (!e.isBoss) {
        damageEnemy(e, 850);
        createSparks(e.x, e.y, 15, '#ef4444');
      } else {
        damageEnemy(e, 400);
      }
    });
  } else if (type === 'pierce') {
    tacticalPierceTimer = 8.0;
    showAnnouncement('🎯 AMUNICJA PRZEBIJAJĄCA AP TUNGSTEN', '#f59e0b');
    createSparks(player.x, player.y, 20, '#f59e0b');
  } else if (type === 'bullet_time') {
    tacticalBulletTimeTimer = 4.5;
    showAnnouncement('⏳ WTRYSK ADRENALINY (CZAS REAKCJI 0.35X)', '#a855f7');
    createSparks(player.x, player.y, 20, '#c084fc');
  }
}

function drawTacticalDrops(ctx) {
  for (let i = 0; i < tacticalDrops.length; i++) {
    const d = tacticalDrops[i];
    const s = 1.0 + Math.sin(d.pulse) * 0.15;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.scale(s, s);

    // Glowing tactical beacon circle
    const colorMap = {
      overcharge: '#38bdf8',
      cryo: '#67e8f9',
      nuke: '#ef4444',
      pierce: '#f59e0b',
      bullet_time: '#c084fc'
    };
    const col = colorMap[d.type] || '#f59e0b';
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    const iconMap = {
      overcharge: '⚡',
      cryo: '❄️',
      nuke: '💥',
      pierce: '🎯',
      bullet_time: '⏳'
    };
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconMap[d.type] || '📦', 0, 1);
    ctx.restore();
  }
}

function killEnemy(e, isOverkill = false) {
  trySpawnPowerUp(e.x, e.y); trySpawnTacticalDrop(e.x, e.y);
  const gibCount = e.isBoss ? 20 : (isOverkill ? 14 : 7);
  spawnGibs(e.x, e.y, gibCount, e.info ? e.info.name : 'default');
  
  if (isOverkill || e.isBoss) {
    screenShake = Math.max(screenShake, e.isBoss ? 14 : 7);
    spawnShrapnelCluster(e.x, e.y, e.isBoss ? 8 : 4, 45);
    if (sounds && sounds.organicCrunch) sounds.organicCrunch();
  }
  
  e.dead = true;
  kills++;
  addCombo();
  if (comboCount > maxCombo) maxCombo = comboCount;
  if (comboCount >= 50) triggerAchievement('combo_god', 'Mistrz Epoksydu x50', '🔥');

  // Arcade Kill Streak Milestones
  // Non-intrusive Combo Milestones (Announced in Top Queue)
  if (comboCount === 50) showAnnouncement('⚡ 50 COMBO: NA ZMIANIE!', '#f59e0b');
  else if (comboCount === 100) showAnnouncement('🔥 100 COMBO: SERIA WMS!', '#ec4899');
  else if (comboCount === 250) showAnnouncement('👑 250 COMBO: LEGENDA HALI!', '#38bdf8');
  else if (comboCount === 500) showAnnouncement('🚀 500 COMBO: MISTRZ EPAL!', '#facc15');
  
  if (comboCount === 50 || comboCount === 100 || comboCount === 250 || comboCount === 500) {
    screenShake = 8;
    sounds.levelUp();
  }

  const packageMultiplier = 1.0 + (packageCombo * 0.15);
  score += Math.floor(e.info.xp * 10 * (1 + comboCount * 0.05) * packageMultiplier);
  createSparks(e.x, e.y, 16, e.info.color);
  addBloodStain(e.x, e.y, e.info);
  
  if (e.info.name === 'Rolka Folii Strecz') {
     enemies.push({ x: e.x - 20, y: e.y, info: ENEMY_TYPES.FOLIA_MALA, hp: ENEMY_TYPES.FOLIA_MALA.hp, quoteTimer: 0, slowTimer: 0 });
     enemies.push({ x: e.x + 20, y: e.y, info: ENEMY_TYPES.FOLIA_MALA, hp: ENEMY_TYPES.FOLIA_MALA.hp, quoteTimer: 0, slowTimer: 0 });
  } else if (e.info.name === 'Zbłąkany Karton B2C') {
     createSparks(e.x, e.y, 10, '#d97706'); // Paper dust
  }

  // Drop barcode XP
  dropItems.push({
    x: e.x,
    y: e.y,
    type: 'barcode_xp',
    val: e.info.xp,
    life: 20
  });

  // Random item drops (Hotdog, Kinder Bueno, Awizo, Kawa, Skrzynia, Monety DTA)
  const rand = Math.random();
  if (e.isBoss) {
    dropItems.push({ x: e.x, y: e.y, type: 'golden_forklift', life: 60 });
    dropItems.push({ x: e.x - 30, y: e.y, type: 'lucky_chest', val: 1, life: 60 });
    dropItems.push({ x: e.x + 30, y: e.y, type: 'lucky_chest', val: 1, life: 60 });
    dropItems.push({ x: e.x, y: e.y + 30, type: 'dta_coin', val: 300, life: 60 });
    window.timeScale = 0.18;
    screenShake = 25;
  } else if (e.isElite) {
    dropItems.push({ x: e.x, y: e.y, type: 'lucky_chest', val: 1, life: 60 });
    dropItems.push({ x: e.x + 25, y: e.y, type: 'dta_coin', val: 100, life: 60 });
    addSpeechBubble(e.x, e.y - 30, '👑 PAKIET ELITARNY OPUSZCZONY!', '#facc15');
  } else if (rand < 0.005 || (e.info.hp >= 300 && Math.random() < 0.025)) {
    // Ultra rare lucky chest drop for regular/elite enemies (0.5% chance)
    dropItems.push({ x: e.x, y: e.y, type: 'lucky_chest', val: 1, life: 45 });
    addSpeechBubble(e.x, e.y - 30, '💎 RZADKA SKRZYNIA Z PERKIEM!', '#38bdf8');
  } else if (rand < 0.10) {
    dropItems.push({ x: e.x, y: e.y, type: 'dta_coin', val: 20 + Math.floor(Math.random() * 20), life: 30 });
  } else if (rand < 0.12) {
    dropItems.push({ x: e.x, y: e.y, type: 'mystery_box', life: 40 });
  } else if (rand < 0.13) {
    dropItems.push({ x: e.x, y: e.y, type: 'dmuchawa_xp_vacuum', life: 35 });
  } else if (rand < 0.14) {
    dropItems.push({ x: e.x, y: e.y, type: 'gasnica_co2_nuke', life: 35 });
  } else if (rand < 0.15) {
    dropItems.push({ x: e.x, y: e.y, type: 'przerwa_kawowa_freeze', life: 35 });
  } else if (rand < 0.17) { dropItems.push({ x: e.x, y: e.y, type: 'pizza_szefa', life: 30 }); } else if (rand < 0.20) {
    dropItems.push({ x: e.x, y: e.y, type: 'hotdog', life: 20 });
  } else if (rand < 0.23) {
    dropItems.push({ x: e.x, y: e.y, type: 'kinder_bueno', life: 20 });
  } else if (rand < 0.27) {
    dropItems.push({ x: e.x, y: e.y, type: 'coffee_thermos', life: 20 });
  }

  if (kills === 100) triggerAchievement('kill_100', 'Pogromca Rampy (100 Kills)', '💀');

  if (e.isBoss) {
    sounds.levelUp();
    if (e.type === 'BOSS_GRZESIEK' || e.type === 'BOSS_ZBIGNIEW') triggerAchievement('boss_grzesiek', 'Nalot BHP Przetrwany!', '📢');
    if (e.type === 'BOSS_WIESLAW_REACH') triggerAchievement('fast_picker', 'Mistrz Wysokiego Składu!', '🏗️');
    if (e.type === 'BOSS_KAS') triggerAchievement('first_blood', 'Rewizja Celna Wygrana!', '🦅');
    if (e.type === 'BOSS_TOITOI_MECH') triggerAchievement('toitoi_evolution', 'Zasłana Ewolucja Przełamana!', '🚽');
    if (e.type === 'BOSS_KONTENER') triggerAchievement('kontener_1559', 'Kontener 40ft Rozładowany!', '🚢');
    if (e.type === 'BOSS_IGOR') triggerAchievement('lights_out', 'Ciemność Pokonana!', '🕶️');
    
    // Trigger Dynamic Sector Victory Transition
    triggerSectorVictory(currentSectorIndex);
  }
}

function triggerSectorVictory(idx) {
  sounds.achieve();
  screenShake = 16;
  activeBoss = null;
  document.getElementById('boss-hp-container').style.display = 'none';

  // Add DTA Coins & Battery/XP Rewards
  dtaCoins += 500;
  saveWorkshopData();
  player.battery = player.maxBattery;
  currentXP += 300;
  checkLevelUp();

  const sec = WAREHOUSE_SECTORS[idx] || WAREHOUSE_SECTORS[0];
  const nextSec = WAREHOUSE_SECTORS[idx + 1];

  const modal = document.getElementById('stage-transition-screen');
  const titleEl = document.getElementById('transition-boss-title');
  const descEl = document.getElementById('transition-desc-text');
  const btnNext = document.getElementById('btn-next-sector');

  if (nextSec) {
    titleEl.innerText = `👑 BOSS POKONANY: ${sec.bossName.toUpperCase()}`;
    descEl.innerHTML = `Przełamano opór w <b>${sec.name}</b>!<br>Wkraczasz w głąb magazynu: <b>${nextSec.name}</b>!<br><i>${nextSec.desc}</i>`;
    btnNext.innerText = `WKRACZAJ DO: SEKTOR ${nextSec.id} ➔`;
    btnNext.onclick = () => {
      modal.style.display = 'none';
      gameState = STATE.PLAYING;
      currentSectorIndex = idx + 1;
      sectorTime = 0;
      rebuildSectorEnvironment(currentSectorIndex);
      showAnnouncement(`📍 ${nextSec.name}`, nextSec.hazardColor);
    };
  } else {
    // Final Boss Defeated!
    titleEl.innerText = '👑 PREZES ZARZĄDU POKONANY!';
    descEl.innerHTML = 'Odprawa zakończona sukcesem! Przetrwałeś wszystkie 5 Sektorów DTA Graniczna 8f! Odblokowano tryb <b>NIESKOŃCZONE NADGODZINY</b>!';
    btnNext.innerText = 'ROZPOCZNIJ NADGODZINY 🔥';
    btnNext.onclick = () => {
      modal.style.display = 'none';
      gameState = STATE.PLAYING;
      currentSectorIndex = 4;
      sectorTime = 0;
      showAnnouncement('🔥 TRYB NADGODZINY: EXTREME DTA!', '#facc15');
    };
  }

  gameState = STATE.PAUSED;
  modal.style.display = 'flex';
}

function rebuildSectorEnvironment(idx) {
  const sec = WAREHOUSE_SECTORS[idx] || WAREHOUSE_SECTORS[0];
  warehouseStencils = [];
  warehouseLights = [];
  warehousePuddles = [];

  // Rebuild overhead lights with sector colors
  const cols = Math.floor(ARENA_WIDTH / 360);
  const rows = Math.floor(ARENA_HEIGHT / 360);
  for (let c = 1; c < cols; c++) {
    for (let r = 1; r < rows; r++) {
      warehouseLights.push({
        x: c * 360,
        y: r * 360,
        flicker: Math.random(),
        color: sec.hazardColor
      });
    }
  }

  // Sector-specific stencils & hazards
  if (idx === 0) {
    // Sector 1: Doki
    warehouseStencils.push(
      { text: '⚠️ STREFA ROZŁADUNKU B2C (RAMPY 1-6)', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(245, 158, 11, 0.35)' },
      { text: '⚡ GŁÓWNA ALEJA WÓZKÓW BT', x: ARENA_WIDTH / 2 - 160, y: ARENA_HEIGHT / 2, font: '900 24px sans-serif', color: 'rgba(56, 189, 248, 0.25)' }
    );
  } else if (idx === 1) {
    // Sector 2: Wysoki Skład
    warehouseStencils.push(
      { text: '🏗️ ALEJE WYSOKIEGO SKŁADU 14M - KASKI OBOWIĄZKOWE', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(56, 189, 248, 0.4)' },
      { text: '📦 SEKTOR REGAŁOWY A-01 DO A-99', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(251, 191, 36, 0.3)' }
    );
  } else if (idx === 2) {
    // Sector 3: Kontrola Celna
    warehouseStencils.push(
      { text: '🦅 STREFA KONTROLI CELNEJ KAS - BRAK WSTĘPU', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(236, 72, 153, 0.4)' },
      { text: '🛑 PUNKT REWIZJI SZCZEGÓŁOWEJ SAD', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(239, 68, 68, 0.35)' }
    );
  } else if (idx === 3) {
    // Sector 4: Chłodnia & ADR
    warehouseStencils.push(
      { text: '❄️ CHŁODNIA GŁĘBOKIEGO SKŁADU -18°C', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(45, 212, 191, 0.45)' },
      { text: '☣️ SKŁADOWISKO CHEMICZNE ADR & TOITOI', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(74, 222, 128, 0.35)' }
    );
    // Frosty slippery puddles
    for (let i = 0; i < 12; i++) {
      warehousePuddles.push({
        x: Math.random() * (ARENA_WIDTH - 200) + 100,
        y: Math.random() * (ARENA_HEIGHT - 200) + 100,
        rx: 60 + Math.random() * 40,
        ry: 40 + Math.random() * 25,
        color: 'rgba(56, 189, 248, 0.35)'
      });
    }
  } else if (idx === 4) {
    // Sector 5: Dyrekcja
    warehouseStencils.push(
      { text: '🏢 CENTRALA DYREKCJI & GABINET ZARZĄDU', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(244, 63, 94, 0.45)' },
      { text: '👔 STREFA DECYZJI ZARZĄDU - WALKA O 07:00', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(250, 204, 21, 0.35)' }
    );
  }
}

// --- MAIN LOOP UPDATE ---
let lastTime = performance.now();
let spawnClock = 0;

function update(dt) {
  // Power-Up Timers & Modifiers
  if (bulletTimeTimer > 0) {
    bulletTimeTimer -= dt;
    dt *= 0.25; // Slow-mo for enemies & world
  }
  if (freezeTimer > 0) {
    freezeTimer -= dt;
  }
  if (fireBulletsTimer > 0) {
    fireBulletsTimer -= dt;
  }
  if (player.kamikazeIntern) {
    kamikazeTimer += dt;
    if (kamikazeTimer >= 5.0) {
      kamikazeTimer = 0;
      // Spawn exploding intern near player
      const angle = Math.random() * Math.PI * 2;
      const ex = player.x + Math.cos(angle) * 120;
      const ey = player.y + Math.sin(angle) * 120;
      createSparks(ex, ey, 25, '#ef4444');
      stampPermanentDecal(ex, ey, 35, 'oil');
      screenShake = Math.max(screenShake, 14);
      sounds.pallet();
      addSpeechBubble(ex, ey, '💣 PRAKTYKANT: BOOM!', '#ef4444');
      enemies.forEach(en => {
        if (!en.dead && Math.hypot(en.x - ex, en.y - ey) < 160) {
          damageEnemy(en, 180);
        }
      });
    }
  }
  
  // Handling Pip Bribe Invincibility
  if (player.pipBribe && player.battery <= 0 && !player.pipBribeActive) {
    player.pipBribeActive = true;
    player.pipBribeTimer = 10.0;
    player.battery = 1;
    addSpeechBubble(player.x, player.y - 40, '💼 ŁAPÓWKA DLA PIP: 10S OCHRONY!', '#38bdf8');
    showAnnouncement('💼 ŁAPÓWKA DLA PIP: KONTROLA WSTRZYMANA!', '#38bdf8');
  }
  if (player.pipBribeActive) {
    player.pipBribeTimer -= dt;
    player.battery = Math.max(1, player.battery);
    if (player.pipBribeTimer <= 0) {
      player.pipBribeActive = false;
      player.pipBribe = false; // Used up
    }
  }
  if (gameState !== STATE.PLAYING) return;
  
  if (comboTimer > 0) {
    comboTimer -= dt;
    if (comboTimer <= 0) comboCount = 0;
  }

  if (player.asapStress) {
    player.asapTimer = (player.asapTimer || 0) + dt;
    if (player.asapTimer >= 3.0) {
      player.asapTimer = 0;
      player.battery -= 5;
      if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🚨 ASAP STRES: -5 HP!', '#ef4444');
    }
  }

  if (hitStopTimer > 0) {
    hitStopTimer -= dt;
    return; // Frame freeze for juiciness
  }
  
  gameTime += dt;
  sectorTime += dt;

  // Check Sector Boss Spawning every 2 minutes (120s)
  for (let s = 0; s < WAREHOUSE_SECTORS.length; s++) {
    const sec = WAREHOUSE_SECTORS[s];
    if (sectorTime >= sec.bossTime && !spawnedBossSectors[s] && currentSectorIndex === s) {
      spawnedBossSectors[s] = true;
      spawnEnemy(sec.bossKey, true);
      break;
    }
  }

  // Update Sector Badge in HUD
  const curSec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[WAREHOUSE_SECTORS.length - 1];
  let bossCountdownStr = '';
  if (activeBoss && !activeBoss.dead) {
    bossCountdownStr = '🚨 WALKA Z BOSSEM!';
  } else if (sectorTime < curSec.bossTime) {
    const secLeft = Math.max(0, Math.ceil(curSec.bossTime - sectorTime));
    const m = Math.floor(secLeft / 60);
    const s = secLeft % 60;
    bossCountdownStr = `${m}:${s < 10 ? '0' : ''}${s}`;
  } else {
    bossCountdownStr = '🚨 BOSS PRZYBYŁ!';
  }
  const sectorBadge = document.getElementById('badge-sector');
  if (sectorBadge) {
    sectorBadge.innerText = `ZONE: S${curSec.id} | SHIFT_ALARM: ${bossCountdownStr}`;
    sectorBadge.style.borderColor = curSec.hazardColor;
  }

  // --- DYNAMIC SHIFT EVENTS (03:30 KAS Audit, 04:15 Cold Storage Freeze, Velvet Powerups) ---
  if (!window.eventFlags) window.eventFlags = { kasAudit: false, coldFreeze: false, goldenPallet: false };
  
  // Event 1: 03:30 (gameTime >= 210s) KAS Audit
  if (gameTime >= 210 && !window.eventFlags.kasAudit) {
    window.eventFlags.kasAudit = true;
    sounds.bossAlert();
    screenShake = 15;
    addSpeechBubble(player.x, player.y - 50, '🚨 ALARM: AUDYT SKARBOWY KAS! UNIKAJ STREF REWIZJI!', '#ef4444');
    projectiles.push({
      type: 'kas_red_zone',
      x: player.x + (Math.random() * 200 - 100),
      y: player.y + (Math.random() * 200 - 100),
      radius: 180,
      life: 12.0
    });
  }

  // Event 2: 04:15 (gameTime >= 255s) Cold Storage Freeze (Drift Ice Epoxy)
  if (gameTime >= 255 && !window.eventFlags.coldFreeze) {
    window.eventFlags.coldFreeze = true;
    sounds.freeze();
    screenShake = 12;
    addSpeechBubble(player.x, player.y - 50, '❄️ AWARIA CHŁODNI: SZRON NA EPOKSYDZIE (DRIFT)!', '#38bdf8');
    // Spawn cold ice puddles
    for (let i = 0; i < 8; i++) {
      warehousePuddles.push({
        x: player.x + (Math.random() * 800 - 400),
        y: player.y + (Math.random() * 800 - 400),
        rx: 70 + Math.random() * 40,
        ry: 45 + Math.random() * 30,
        color: 'rgba(56, 189, 248, 0.35)'
      });
    }
  }

  // Event 3: 04:45 (gameTime >= 285s) Golden Velvet Pallet Spawn
  if (gameTime >= 285 && !window.eventFlags.goldenPallet) {
    window.eventFlags.goldenPallet = true;
    sounds.achieve();
    dropItems.push({
      id: Math.random(),
      type: 'golden_velvet',
      x: player.x + (Math.random() * 300 - 150),
      y: player.y + (Math.random() * 300 - 150),
      life: 40.0
    });
    addSpeechBubble(player.x, player.y - 50, '🌟 SPAWNOWANO ZŁOTĄ PALETĘ VELVET MAX!', '#facc15');
  }

  // Handle Golden Velvet item pick up in dropItems collection loop
  // Toyota BT Reflex Forklift is the primary player vehicle
  player.isForklift = true;
  player.hasForklift = true;
  player.radius = 22;

  // Recharge dash/turbo stamina smoothly
  if (player.stamina < player.maxStamina) {
    player.stamina = Math.min(player.maxStamina, player.stamina + dt * 25 * (player.staminaRegenMult || 1.0));
  }


  // Real shift clock calculation
  const progress = Math.min(1, gameTime / TOTAL_SHIFT_DURATION);
  const currentMinutes = SHIFT_START_MINUTES + progress * (SHIFT_END_MINUTES - SHIFT_START_MINUTES);
  const hrs = Math.floor(currentMinutes / 60);
  const mins = Math.floor(currentMinutes % 60);
  const timeStr = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

  // Combo timer
  if (comboTimer > 0) {
    comboTimer -= dt;
    if (comboTimer <= 0) comboCount = 0;
  }
  if (packageComboTimer > 0) {
    packageComboTimer -= dt;
    if (packageComboTimer <= 0) {
      if (packageCombo >= 8) {
        addSpeechBubble(player.x, player.y - 25, '🛑 KONIEC COMBO PACZEK', '#94a3b8');
      }
      packageCombo = 0;
    }
  }

  // Player Movement & Physics (Frame-rate Independent & Ultra Responsive)
  let moveX = touchState.dirX;
  let moveY = touchState.dirY;

  if (keys['w'] || keys['arrowup']) moveY -= 1;
  if (keys['s'] || keys['arrowdown']) moveY += 1;
  if (keys['a'] || keys['arrowleft']) moveX -= 1;
  if (keys['d'] || keys['arrowright']) moveX += 1;

  const moveLen = Math.hypot(moveX, moveY);
  let curSpeed = player.speed;
  if (mysteryActive === 'nadgodziny') curSpeed *= 0.65; // Morale drop (slowed down)
  if (player.isForklift) curSpeed *= 1.35;
  if (player.isDashing) curSpeed *= (player.isForklift ? 1.30 : 1.60);

  // Toyota BT Package Combo Speed Boost
  if (packageCombo > 0) {
    const comboBoost = Math.min(1.20, 1.0 + packageCombo * 0.01);
    curSpeed *= comboBoost;
  }

  // Smooth acceleration & velocity damping (Exponential decay)
  let targetVx = 0;
  let targetVy = 0;
  if (moveLen > 0.05) {
    const normX = moveX / moveLen;
    const normY = moveY / moveLen;
    targetVx = normX * curSpeed;
    targetVy = normY * curSpeed;

    
    let diff = 0;
    if (aimTouchState.active && Math.hypot(aimTouchState.dirX, aimTouchState.dirY) > 0.1) {
      const aimAngle = Math.atan2(aimTouchState.dirY, aimTouchState.dirX);
      diff = aimAngle - player.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      player.angle += diff * (1 - Math.exp(-30.0 * dt)); // Faster aiming rotation
    } else {
      const targetAngle = Math.atan2(normY, normX);
      diff = targetAngle - player.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      player.angle += diff * (1 - Math.exp(-22.0 * dt));
    }


const angularDiff = Math.abs(diff);
    const isDrifting = (angularDiff > 0.25 || player.isDashing || (moveLen === 0 && Math.hypot(player.vx, player.vy) > 150));
    
    if (isDrifting) {
      if (Math.random() < (player.isForklift ? 0.70 : 0.30)) {
        addSkidMark(player.x, player.y, player.angle);
        
        // Smoke & Drift sparks
        const rearX = player.x - Math.cos(player.angle) * 16;
        const rearY = player.y - Math.sin(player.angle) * 16;
        spawnParticle(rearX, rearY, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, 0.45, 4.5, 'rgba(148, 163, 184, 0.5)');
        
        if (player.isDashing || angularDiff > 0.5 || Math.hypot(player.vx, player.vy) > 400) {
          spawnParticle(rearX, rearY, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0.35, 3.5, '#fbbf24');
        }
      }
    }
  }

  // Independent Aim Rotation
  if (aimTouchState.active && Math.hypot(aimTouchState.dirX, aimTouchState.dirY) > 0.1) {
      player.angle = Math.atan2(aimTouchState.dirY, aimTouchState.dirX);
  }

  const accelFactor = 1 - Math.exp((moveLen > 0.05 ? -14.0 : -18.0) * dt);
  player.vx += (targetVx - player.vx) * accelFactor;
  player.vy += (targetVy - player.vy) * accelFactor;
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  if (player.isDashing) {
    if (Math.random() < 0.75) {
      ghostTrails.push({ x: player.x, y: player.y, angle: player.angle, alpha: 0.6, life: 0.28 });
    }
  }

  // Obstacle collisions (Racks, Pallets, ToiToi) with Vector Projection Sliding Response
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    // Simple AABB vs Circle collision
    const testX = Math.max(o.x, Math.min(player.x, o.x + o.w));
    const testY = Math.max(o.y, Math.min(player.y, o.y + o.h));
    
    const distX = player.x - testX;
    const distY = player.y - testY;
    const distance = Math.hypot(distX, distY);
    
    if (distance < player.radius) {
      // Collision occurred!
      const overlap = player.radius - distance;
      const speed = Math.hypot(player.vx, player.vy);
      
      let nx = 0;
      let ny = 0;
      
      if (distance > 0.01) {
        nx = distX / distance;
        ny = distY / distance;
        player.x += nx * overlap;
        player.y += ny * overlap;
      } else {
        const ox = o.x + o.w / 2;
        const oy = o.y + o.h / 2;
        const pdx = player.x - ox;
        const pdy = player.y - oy;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist > 0.01) {
          nx = pdx / pdist;
          ny = pdy / pdist;
          player.x += nx * overlap;
          player.y += ny * overlap;
        } else {
          player.x -= player.vx * dt;
          player.y -= player.vy * dt;
        }
      }
      
      // Spawn sparks if hit hard enough
      if (speed > 150) {
         createSparks(testX, testY, Math.floor(speed / 30), '#fbbf24');
         if (speed > 300) screenShake = Math.max(screenShake, 3.5);
      }
      
      // Vector Projection Sliding: Project velocity onto obstacle surface (tangent of normal)
      if (nx !== 0 || ny !== 0) {
        const dot = player.vx * nx + player.vy * ny;
        if (dot < 0) {
          // Slide along surface without losing full speed
          player.vx -= nx * dot;
          player.vy -= ny * dot;
        }
      } else {
        player.vx *= 0.5;
        player.vy *= 0.5;
      }
    }
  }

  player.x = Math.max(player.radius, Math.min(ARENA_WIDTH - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(ARENA_HEIGHT - player.radius, player.y));

  // Toyota BT Rear Exhaust Particle Generation (Speed / Nitro Boost VFX)
  const exOffsetX = -Math.cos(player.angle) * 26 + Math.sin(player.angle) * 9;
  const exOffsetY = -Math.sin(player.angle) * 26 - Math.cos(player.angle) * 9;
  const exX = player.x + exOffsetX;
  const exY = player.y + exOffsetY;

  if (player.isForklift && (packageCombo > 0 || player.isDashing || moveLen > 0.05)) {
    const ejectCount = packageCombo >= 15 ? 3 : packageCombo >= 5 ? 2 : 1;
    for (let ep = 0; ep < ejectCount; ep++) {
      const ejectAngle = player.angle + Math.PI + (Math.random() - 0.5) * 0.45;
      const ejectSpeed = (Math.random() * 45 + 30) * (1 + Math.min(12, packageCombo) * 0.12);
      const evx = Math.cos(ejectAngle) * ejectSpeed;
      const evy = Math.sin(ejectAngle) * ejectSpeed;

      let pColor, pSize, pLife;
      if (packageCombo >= 15) {
        // Hyper Plasma Speed Boost (Cyan / Magenta / Purple)
        pColor = Math.random() < 0.4 ? '#38bdf8' : (Math.random() < 0.5 ? '#c084fc' : '#f472b6');
        pSize = Math.random() * 4 + 3;
        pLife = 0.45;
      } else if (packageCombo >= 5) {
        // Turbo Fire & Nitro (Orange / Amber / Red)
        pColor = Math.random() < 0.4 ? '#f97316' : (Math.random() < 0.5 ? '#fbbf24' : '#ef4444');
        pSize = Math.random() * 3.5 + 2.5;
        pLife = 0.4;
      } else {
        // Electric Blue & Industrial Diesel Smoke
        pColor = packageCombo > 0 
          ? (Math.random() < 0.6 ? 'rgba(56, 189, 248, 0.85)' : '#7dd3fc') 
          : 'rgba(148, 163, 184, 0.45)';
        pSize = Math.random() * 3 + 2;
        pLife = 0.35;
      }
      spawnParticle(exX, exY, evx, evy, pLife, pSize, pColor);
    }
  }

  // Age skid marks
  for (let i = skidMarks.length - 1; i >= 0; i--) {
    skidMarks[i].life -= dt;
    if (skidMarks[i].life <= 0) skidMarks.splice(i, 1);
  }

  // Motor Sound Pitch
  const spdRatio = Math.min(1.0, Math.hypot(player.vx, player.vy) / 4.0);
  sounds.updateMotor(spdRatio, player.isForklift);
  if (!player.isForklift && moveLen > 0.05 && Math.random() < 0.15) {
      if ((gameTime * 10) % 2 < 0.5) sounds.footstep();
  }

  // Skill cooldowns
  if (player.skillCooldown > 0) {
    player.skillCooldown -= dt;
    dashCd.style.display = 'flex';
    dashCd.innerText = Math.ceil(player.skillCooldown) + 's';
  } else {
    dashCd.style.display = 'none';
  }

  if (player.detentionCooldown > 0) {
    player.detentionCooldown -= dt;
    if (detentionCd) {
      detentionCd.style.display = 'flex';
      detentionCd.innerText = Math.ceil(player.detentionCooldown) + 's';
    }
  } else if (detentionCd) {
    detentionCd.style.display = 'none';
  }

  if (player.dashTimer > 0) {
    player.dashTimer -= dt;
    if (player.dashTimer <= 0) player.isDashing = false;
  }
  if (player.invulnTimer > 0) player.invulnTimer -= dt;
  if (player.hitFlash > 0) player.hitFlash -= dt;
  if (player.goldenForkliftTimer > 0) {
      player.goldenForkliftTimer -= dt;
      player.isForklift = true;
      player.stamina = player.maxStamina;
      player.speed = 320;
      createSparks(player.x, player.y, 2, '#facc15');
      // Ram enemies automatically
      enemies.forEach(en => {
         if (Math.hypot(en.x - player.x, en.y - player.y) < player.radius + en.info.radius + 15) {
             damageEnemy(en, 300);
             createSparks(en.x, en.y, 15, '#facc15');
         }
      });
      if (player.goldenForkliftTimer <= 0 && !player.hasForklift) {
         player.isForklift = false;
         player.speed = 175;
         addSpeechBubble(player.x, player.y - 30, '🚜 KONIEC BONUSU WÓZKA!', '#94a3b8');
      }
  }
  if (player.discoTimer > 0) {
      player.discoTimer -= dt;
      player.attackSpeedMult = 1.6;
      if (Math.random() < 0.2) {
          spawnParticle(player.x + (Math.random()-0.5)*40, player.y + (Math.random()-0.5)*40, 0, -30, 0.4, 3, '#a855f7');
      }
  }

  // Battery drain & critical check
  player.battery -= dt * 0.45; // ~225 sec baseline
  if (player.regenRate) {
    player.battery = Math.min(player.maxBattery, player.battery + player.regenRate * dt);
  }

  // Freezer Heaters Area Check (Freezer -25°C Arena)
  for (let i = 0; i < warehouseHeaters.length; i++) {
    const h = warehouseHeaters[i];
    if (Math.hypot(player.x - h.x, player.y - h.y) < h.radius) {
      player.battery = Math.min(player.maxBattery, player.battery + dt * 14.0);
      if (Math.random() < 0.25) spawnParticle(player.x, player.y - 10, (Math.random()-0.5)*15, -20, 0.4, 3, '#f59e0b');
    }
  }

  // Cross-Dock Conveyor Belt Push Physics (Player & Items)
  for (let i = 0; i < warehouseConveyors.length; i++) {
    const cb = warehouseConveyors[i];
    if (player.x >= cb.x && player.x <= cb.x + cb.w && player.y >= cb.y && player.y <= cb.y + cb.h) {
      player.x += cb.vx * dt;
      player.y += cb.vy * dt;
    }
  }

  if (player.battery <= 10) {
    lowBatteryTimer += dt;
    if (lowBatteryTimer >= 15) triggerAchievement('battery_critical', 'Na Oparach Prądu', '⚡');
  } else {
    lowBatteryTimer = 0;
  }

  if (player.battery <= 0) {
    if (passives.umowa && passives.umowa.level > 0 && !player.extraLifeUsed) {
      player.extraLifeUsed = true;
      player.battery = player.maxBattery;
      player.invulnTimer = 3.5;
      screenShake = 20;
      sounds.bossAlert();
      showAnnouncement("📜 UMOWA BEZTERMINOWA: OCHRONA PRZED ŚMIERCIĄ!", "#22c55e");
      addSpeechBubble(player.x, player.y - 40, '📜 OCHRONA UMOWY! PEŁNA REGENERACJA!', '#22c55e');
      createSparks(player.x, player.y, 60, '#22c55e');
      enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
    } else {
      gameOver(timeStr, false);
      return;
    }
  }
  if (mysteryTimer > 0) {
    mysteryTimer -= dt;
    if (mysteryTimer <= 0) {
       mysteryActive = ''; mysteryBuffMultiplier = 1.0;
       showAnnouncement("NADGODZINY ZAKOŃCZONE!", "#94a3b8");
    }
  }
  if (gameTime >= TOTAL_SHIFT_DURATION && selectedGameMode !== 'endless') {
    gameOver(timeStr, true);
    return;
  }

  // Smooth Camera Follow with Perspective Zoom
  const viewW = gameWidth / camera.zoom;
  const viewH = gameHeight / camera.zoom;
  const camLerp = 1 - Math.exp(-9.0 * dt);
  camera.x += (player.x - viewW / 2 - camera.x) * camLerp;
  camera.y += (player.y - viewH / 2 - camera.y) * camLerp;
  if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 15);

  // Spawning Schedule (Tuned Vampire Survivors pace)
  spawnClock += dt;
  if (spawnClock >= Math.max(0.4, 0.9 - (gameTime / TOTAL_SHIFT_DURATION) * 0.5)) {
    spawnClock = 0;
    spawnBatchByTime(currentMinutes);
  }

  // Boss Timers
  if (currentMinutes >= 5 * 60 && !bossFlags.grzesiek) {
    bossFlags.grzesiek = true;
    spawnEnemy('BOSS_KAS', true);
  }
  if (currentMinutes >= 6 * 60 + 20 && !bossFlags.kontener) {
    bossFlags.kontener = true;
    spawnEnemy('BOSS_KONTENER', true);
  }

  // Update Weapons
  updateWeapons(dt);

  // Build Spatial Grid for O(N) Collision checking (0 allocation)
  buildSpatialGrid();

  // Update Enemies AI, Movement & Flocking
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.dead) { enemies.splice(i, 1); continue; }

    if (e.hitFlash > 0) e.hitFlash -= dt;
    if (e.slowTimer > 0) e.slowTimer -= dt;

    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.hypot(dx, dy);

    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0) * mysteryBuffMultiplier;
    if (e.stunTimer && e.stunTimer > 0) { e.stunTimer -= dt; spd = 0; }
    if (window.freezeEnemiesTimer && window.freezeEnemiesTimer > 0) {
      spd = 0;
      if (Math.random() < 0.04) spawnParticle(e.x, e.y, (Math.random()-0.5)*10, -5, 0.3, 2.5, '#7dd3fc');
    }

    if (e.info.special === 'kamikaze_explode' && dist < 34 && !e.dead) {
      e.dead = true;
      sounds.bossAlert();
      screenShake = 16;
      createSparks(e.x, e.y, 50, '#ef4444');
      addSpeechBubble(e.x, e.y - 20, '💥 BUM! PRZEGRZANIE!', '#ef4444');
      if (player.invulnTimer <= 0) {
        player.battery -= 25;
        spawnDamageNumber(player.x, player.y - 20, 25, true);
        if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(80);
      }
      addBloodStain(e.x, e.y, e.info);
      continue;
    }
    
    if (e.info.straightLine) {
      e.x += (e.vx || 1) * spd * dt;
      e.y += (e.vy || 0) * spd * dt;
      if (Math.random() < 0.05) createSparks(e.x, e.y, 2, '#ea580c'); // Beep warning visual
    } else {
      let currentDx = (dx / (dist || 1));
      let currentDy = (dy / (dist || 1));
      
      if (e.info.canDash) {
        e.dashTimer = (e.dashTimer || 4.0) - dt;
        if (e.dashTimer < 0) {
          e.dashTimer = 4.0;
          e.isDashing = 0.6; // Dash lasts 0.6s
          e.vx = currentDx; e.vy = currentDy;
        }
        if (e.isDashing > 0) {
          e.isDashing -= dt;
          spd *= 1.85;
          currentDx = e.vx; currentDy = e.vy;
        } else {
          // Humorous quotes logic
          e.quoteTimer = (e.quoteTimer || (3.0 + Math.random() * 5)) - dt;
          if (e.quoteTimer <= 0 && dist < 500) {
            e.quoteTimer = 8.0 + Math.random() * 12;
            const quotes = ["To nie moja paleta!", "Gdzie jest kierownik?", "WMS znowu leży!", "Błąd 404: Paleta nie znaleziona", "Za co mi płacą?", "Przerwa na kawę!", "ASAP na wczoraj!", "Kto to tak owinął?", "Zaraz kończę zmianę!", "Nie bij, jestem na zleceniu!"];
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            addSpeechBubble(e.x, e.y - 20, q, '#cbd5e1');
          }

          // Smooth Zig-zag
          const zig = Math.sin(gameTime * 4 + e.x * 0.01) * 0.4;
          currentDx = currentDx * 0.8 + currentDy * zig;
          currentDy = currentDy * 0.8 - currentDx * zig;
        }
      }
      
      if (dist > 5) {
        e.x += currentDx * spd * dt;
        e.y += currentDy * spd * dt;
      }

      // Soft flocking repulsion to prevent enemy clumping
      for (let j = i - 1; j >= 0 && j >= i - 8; j--) {
        const other = enemies[j];
        if (other.dead) continue;
        const sepDx = e.x - other.x;
        const sepDy = e.y - other.y;
        const minD = (e.info.radius + other.info.radius) * 0.95;
        const dSq = sepDx * sepDx + sepDy * sepDy;
        if (dSq < minD * minD && dSq > 0.01) {
          const d = Math.sqrt(dSq);
          const push = (minD - d) * 0.45 * (dt * 15);
          const nx = sepDx / d;
          const ny = sepDy / d;
          e.x += nx * push;
          e.y += ny * push;
          other.x -= nx * push;
          other.y -= ny * push;
        }
      }
    }
    
    // Rigid obstacle collisions for all enemies
    if (typeof obstacles !== 'undefined' && obstacles) {
      for (let k = 0; k < obstacles.length; k++) {
        const o = obstacles[k];
        const eRad = e.info.radius || 15;
        const testX = Math.max(o.x, Math.min(e.x, o.x + o.w));
        const testY = Math.max(o.y, Math.min(e.y, o.y + o.h));
        const distX = e.x - testX;
        const distY = e.y - testY;
        const distance = Math.hypot(distX, distY);
        if (distance < eRad) {
          const overlap = eRad - distance;
          if (distance > 0.01) {
            e.x += (distX / distance) * overlap;
            e.y += (distY / distance) * overlap;
          } else {
            const ox = o.x + o.w / 2;
            const oy = o.y + o.h / 2;
            const pdx = e.x - ox;
            const pdy = e.y - oy;
            const pdist = Math.hypot(pdx, pdy);
            if (pdist > 0.01) {
              e.x += (pdx / pdist) * overlap;
              e.y += (pdy / pdist) * overlap;
            }
          }
        }
      }
    }

    // Shooter Logic
    if (e.info.shooter) {
       e.shootTimer = (e.shootTimer || 3.5) - dt;
       if (e.shootTimer <= 0) {
          e.shootTimer = 3.5;
          const a = Math.atan2(dy, dx);
          projectiles.push({ type: 'enemy_shoot', x: e.x, y: e.y, vx: Math.cos(a) * 260, vy: Math.sin(a) * 260, life: 2.5, rot: a });
       }
    }

    // Boss Mechanics
    if (e.info.mechanics === 'kas_zone') {
       if (!e.kasTimer) e.kasTimer = 10.0;
       e.kasTimer -= dt;
       if (e.kasTimer <= 0) {
          e.kasTimer = 15.0;
          projectiles.push({ type: 'kas_red_zone', x: player.x, y: player.y, radius: 180, life: 5.0, timer: 5.0 });
          addSpeechBubble(e.x, e.y - 30, '🚨 REWIZJA SZCZEGÓŁOWA!', '#ef4444');
       }
    } else if (e.info.mechanics === 'spawner') {
       // Kontenerowiec sits near top
       e.y = camera.y + 100;
       e.x = camera.x + viewW / 2 + Math.sin(gameTime) * 200;
       if (!e.spawnTimer) e.spawnTimer = 3.0;
       e.spawnTimer -= dt;
       if (e.spawnTimer <= 0) {
          e.spawnTimer = 4.0;
          spawnEnemy('KARTON_B2C');
          spawnEnemy('FOLIA');
          spawnEnemy('KIEROWCA_TIR');
       }
    }
    
    // Special attacks & speech
    e.quoteTimer = (e.quoteTimer || (Math.random() * 8 + 5)) - dt;
    if (e.quoteTimer <= 0 && e.info.quotes) {
      e.quoteTimer = Math.random() * 8 + 5;
      const q = e.info.quotes[Math.floor(Math.random() * e.info.quotes.length)];
      addSpeechBubble(e.x, e.y - 25, q, e.isBoss ? '#ef4444' : '#ffffff');
    }

    // Touch Player Collision (Forklift Hit-Detection System)
    if (dist < player.radius + e.info.radius) {
      if (player.isDashing || weapons.pallets.isEvo) {
        damageEnemy(e, weapons.pallets.isEvo ? 80 : 140);
        createSparks(e.x, e.y, 12, '#f97316');
        if (weapons.pallets.isEvo && !e.isBoss) e.dead = true; // Auto kill small enemies when evo
        
        // Push enemy back with massive force
        const kbx = (dx / (dist || 1)) * -240;
        const kby = (dy / (dist || 1)) * -240;
        e.x += kbx * dt;
        e.y += kby * dt;
      } else if (player.isForklift && Math.hypot(player.vx, player.vy) > 100) {
        const speed = Math.hypot(player.vx, player.vy);
        const ramDamage = Math.floor(speed * 0.45);
        damageEnemy(e, ramDamage);
        
        // Push enemy back (massive forklift impact knockback)
        const kbx = (dx / (dist || 1)) * -200;
        const kby = (dy / (dist || 1)) * -200;
        e.x += kbx * dt;
        e.y += kby * dt;
        
        createSparks(e.x, e.y, 18, '#fbbf24');
        sounds.hit();
        screenShake = Math.max(screenShake, 5);
      } else if (player.invulnTimer <= 0) {
        if (player.dodgeChance && Math.random() < player.dodgeChance) {
          spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
          player.invulnTimer = 0.2;
        } else {
          sounds.hit();
          player.invulnTimer = 0.5;
          player.hitFlash = 0.4;
          screenShake = e.isBoss ? 15 : 8;
          const dmg = e.isBoss ? 20 : 10;
          player.battery = Math.max(0, player.battery - dmg);
          spawnDamageText(player.x, player.y - 25, `-${dmg} HP`, '#ef4444', true);
          createSparks(player.x, player.y, 15, '#ef4444');
          if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(e.isBoss ? 100 : 45);
          
          // Immediate check for forklift battery depletion / death on hit
          if (player.battery <= 0) {
            if (passives.umowa && passives.umowa.level > 0 && !player.extraLifeUsed) {
              player.extraLifeUsed = true;
              player.battery = player.maxBattery;
              player.invulnTimer = 3.5;
              screenShake = 20;
              sounds.bossAlert();
              showAnnouncement("📜 UMOWA BEZTERMINOWA: OCHRONA PRZED ŚMIERCIĄ!", "#22c55e");
              addSpeechBubble(player.x, player.y - 40, '📜 OCHRONA UMOWY! PEŁNA REGENERACJA!', '#22c55e');
              createSparks(player.x, player.y, 60, '#22c55e');
              enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
            } else {
              gameOver(timeStr, false);
              return;
            }
          }
        }
      }
    }
  }

  // Update Kluska Companion
  updateKluska(dt);

  // Update Breakable Map Props
  updateMapProps(dt);

  // Player forklift/dash smash into mapProps
  for (let k = 0; k < mapProps.length; k++) {
    const prop = mapProps[k];
    if (prop.dead) continue;
    const pDist = Math.hypot(prop.x - player.x, prop.y - player.y);
    if (pDist < prop.radius + player.radius + 8) {
      if (player.isForklift || player.isDashing) {
        damageProp(prop, 100);
        sounds.hit();
        screenShake = Math.max(screenShake, 6);
      }
    }
  }

  // Update Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.life -= dt;
    if (p.life <= 0) {
       if (p.type === 'kas_red_zone') {
          createSparks(p.x, p.y, 40, '#ef4444');
          if (Math.hypot(player.x - p.x, player.y - p.y) > p.radius) {
             player.battery = Math.max(0, player.battery - player.maxBattery * 0.5);
             addSpeechBubble(player.x, player.y, 'KARA KAS!', '#ef4444');
          }
       }
       projectiles.splice(i, 1); continue; 
    }

    // Check collision against breakable mapProps
    if (p.type !== 'kas_red_zone' && p.type !== 'enemy_shoot' && p.type !== 'oil_trail') {
      for (let k = 0; k < mapProps.length; k++) {
        const prop = mapProps[k];
        if (prop.dead) continue;
        if (Math.hypot(prop.x - p.x, prop.y - p.y) < prop.radius + 14) {
          damageProp(prop, p.damage || 35);
          if (p.type !== 'cutter' && p.type !== 'gas_cloud') {
            p.life = 0;
            break;
          }
        }
      }
    }

    if (p.type === 'pallet') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot = (p.rot || 0) + 12.0 * dt;
      queryEnemiesNear(p.x, p.y, 35, (e) => {
        damageEnemy(e, p.damage, 'pallet');
        createSparks(p.x, p.y, 6, '#d97706');
        p.life = 0;
        return true;
      });
    } else if (p.type === 'gas_cloud') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.radius = Math.min(p.maxRadius, p.radius + dt * 30);
      queryEnemiesNear(p.x, p.y, p.radius + 15, (e) => {
        if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
          damageEnemy(e, p.damage * dt * 2.5, 'gas');
          e.slowTimer = 3.5;
        }
        return false;
      });
    } else if (p.type === 'metal_bb') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      queryEnemiesNear(p.x, p.y, 25, (e) => {
        damageEnemy(e, p.damage, 'metal_bb');
        createSparks(p.x, p.y, 6, '#cbd5e1');
        sounds.beep();
        p.pierce = (p.pierce || 3) - 1;
        if (p.pierce <= 0) { p.life = 0; return true; }
        return false;
      });
    } else if (p.type === 'oil_trail') {
      if (Math.random() < 0.2) {
        queryEnemiesNear(p.x, p.y, 35, (e) => {
          damageEnemy(e, p.damage, 'oil');
          e.slowTimer = 2.0;
          return false;
        });
      }
    } else if (p.type === 'enemy_shoot') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (Math.hypot(player.x - p.x, player.y - p.y) < player.radius + 10) {
        if (player.invulnTimer <= 0) {
          if (player.dodgeChance && Math.random() < player.dodgeChance) {
            spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
          } else {
            sounds.hit();
            player.invulnTimer = 0.5;
            player.battery = Math.max(0, player.battery - 12);
            addSpeechBubble(player.x, player.y - 20, '🛑 BRAK SAD-u!', '#ef4444');
          }
        }
        p.life = 0;
      }
    } else if (p.type === 'zip_tie') {
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot = (p.rot || 0) + 15.0 * dt;
      queryEnemiesNear(p.x, p.y, 25, (e) => {
        damageEnemy(e, p.damage, 'zip_tie');
        e.slowTimer = p.isEvo ? 6.0 : 4.0;
        createSparks(p.x, p.y, 4, '#38bdf8');
        p.life = 0;
        return true;
      });
    } else if (p.type === 'cutter') {
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot = (p.rot || 0) + 20.0 * dt;
      queryEnemiesNear(p.x, p.y, 25, (e) => {
        damageEnemy(e, p.damage, 'cutter');
        createSparks(p.x, p.y, 8, '#f43f5e');
        p.pierce = (p.pierce || 0) + 1;
        if (p.pierce > (p.isEvo ? 6 : 2)) { p.life = 0; return true; }
        return false;
      });
    } else if (p.type === 'toilet_paper') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.96, dt * 60);
      p.vy *= Math.pow(0.96, dt * 60);
      p.rot = (p.rot || 0) + 14.0 * dt;
      queryEnemiesNear(p.x, p.y, 28, (e) => {
        if (p.isEvo) {
           damageEnemy(e, p.damage * 2, 'toilet_paper');
           createSparks(e.x, e.y, 16, '#fef08a');
           e.stunTimer = 3.0;
        } else {
           damageEnemy(e, p.damage, 'toilet_paper');
           e.slowTimer = 1.8;
        }
        createSparks(p.x, p.y, 8, '#f8fafc');
        p.life = 0;
        return true;
      });
    } else if (p.type === 'box_mortar') {
      p.progress += dt * p.speed;
      if (p.progress >= 1) {
        sounds.pallet();
        createSparks(p.targetX, p.targetY, 20, '#f59e0b');
        queryEnemiesNear(p.targetX, p.targetY, 115, (e) => {
          damageEnemy(e, p.damage, 'mortar');
          return false;
        });
        for (let k = 0; k < mapProps.length; k++) {
          const prop = mapProps[k];
          if (prop.dead) continue;
          if (Math.hypot(prop.x - p.targetX, prop.y - p.targetY) < 110) {
            damageProp(prop, p.damage);
          }
        }
        projectiles.splice(i, 1);
      }
    } else if (p.type === 'faktura') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += p.rotSpeed * dt;
      let hit = false;
      queryEnemiesNear(p.x, p.y, 30, (e) => {
        if (!p.hitList) p.hitList = [];
        if (p.hitList.includes(e.id)) return false;
        damageEnemy(e, p.damage, 'faktura');
        p.hitList.push(e.id);
        spawnParticle(p.x, p.y, -p.vx * 0.2, -p.vy * 0.2, 0.2, 2, '#fff');
        p.pierce--;
        if (p.pierce <= 0) { hit = true; return true; }
        return false;
      });
      if (hit) projectiles.splice(i, 1);
    } else if (p.type === 'staple') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot = (p.rot || 0);
      queryEnemiesNear(p.x, p.y, 20, (e) => {
        damageEnemy(e, p.damage, 'staple');
        createSparks(p.x, p.y, 4, p.isEvo ? '#f59e0b' : '#38bdf8');
        p.life = 0;
        return true;
      });
    } else if (p.type === 'shockwave') {
      p.radius += (p.maxRadius - p.radius) * (dt * 12);
    }
  }

  // Update Drop Items & Magnet
  const magnetSpeed = (320 + player.magnetRange * 0.8) * dt;
  for (let i = dropItems.length - 1; i >= 0; i--) {
    const item = dropItems[i];
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const dist = Math.hypot(dx, dy);

    if (dist < player.magnetRange && dist > 1) {
      // Exponential succ - starts slow, gets extremely fast
      const succFactor = Math.pow(1.0 - (dist / player.magnetRange), 2.5);
      const dynamicSpeed = magnetSpeed + (succFactor * magnetSpeed * 6.0);
      item.x += (dx / dist) * dynamicSpeed;
      item.y += (dy / dist) * dynamicSpeed;
      
      // Visual trail
      if (Math.random() < 0.25) {
         createSparks(item.x, item.y, 1, item.type === 'barcode_xp' ? '#60a5fa' : '#facc15');
      }
    }

    if (dist < player.radius + 18) {
      packageCombo++;
      packageComboTimer = 3.2;
      if (packageCombo > maxPackageCombo) maxPackageCombo = packageCombo;
      const packageMultiplier = 1.0 + (packageCombo * 0.15);

      if (item.type === 'lucky_chest') {
        openLuckyChest(item.val || 1);
      } else if (item.type === 'dta_coin') {
        const cVal = item.val || 25;
        dtaCoins += cVal;
        saveWorkshopData();
        sounds.xp();
        score += cVal * 10;
        addSpeechBubble(player.x, player.y - 25, `+💰 ${cVal} MONET DTA`, '#facc15');
      } else if (item.type === 'golden_forklift') {
        sounds.achieve();
        screenShake = 15;
        player.goldenForkliftTimer = 12.0;
        player.invulnTimer = 12.0;
        player.stamina = player.maxStamina;
        createSparks(player.x, player.y, 50, '#facc15');
        addSpeechBubble(player.x, player.y - 45, '🌟 ZŁOTY WÓZEK BT OVERDRIVE (12s)! 🚜', '#facc15');
        showAnnouncement("🌟 ZŁOTY MECHA-WÓZEK BT ACTIVATED!", "#facc15");
      } else if (item.type === 'boombox_radio') {
        sounds.achieve();
        screenShake = 8;
        player.discoTimer = 15.0;
        addSpeechBubble(player.x, player.y - 35, '📻 DYSKOTEKA WMS 80s! BUFF SZYBKOŚCI (15s)! 🎶', '#a855f7');
        showAnnouncement("📻 DYSKOTEKA WMS: +50% SZYBKOŚCI!", "#a855f7");
      } else if (item.type === 'cargo_mystery') {
        sounds.achieve();
        screenShake = 12;
        const roll = Math.random();
        if (roll < 0.25) {
            showAnnouncement("🌟 SKRZYNY SUKCESU: ZŁOTY WÓZEK BT!", "#facc15");
            player.goldenForkliftTimer = 12.0;
            player.invulnTimer = 12.0;
            player.stamina = player.maxStamina;
        } else if (roll < 0.50) {
            showAnnouncement("💣 TOTALNA CZYSTKA RAMPIARZY (NUKE)!", "#ef4444");
            enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
            createSparks(player.x, player.y, 80, '#ef4444');
        } else if (roll < 0.75) {
            showAnnouncement("💰 BONANZA MONET DTA (+500 MONET)!", "#38bdf8");
            dtaCoins += 500;
            saveWorkshopData();
        } else {
            showAnnouncement("⚡ POTĘŻNY BONUS EXP (+80 EXP)!", "#22c55e");
            currentXP += 80;
            checkLevelUp();
        }
      } else if (item.type === 'golden_velvet') {
        sounds.achieve();
        screenShake = 10;
        player.invulnTimer = 10.0;
        player.stamina = player.maxStamina;
        createSparks(player.x, player.y, 40, '#facc15');
        addSpeechBubble(player.x, player.y - 40, '🌟 NIEŚMIERTELNOŚĆ VELVET OVERDRIVE (10s)!', '#facc15');
      } else if (item.type === 'barcode_xp') {
        const earnedXP = Math.floor(item.val * (1 + packageCombo * 0.04));
        currentXP += earnedXP;
        const pts = Math.floor(item.val * 15 * packageMultiplier);
        score += pts;
        sounds.xp();
        checkLevelUp();
      } else if (item.type === 'pizza_szefa') {
        score += 1000;
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '🍕 PIZZA OD SZEFA! +150 EXP & 100% ⚡', '#ef4444');
        player.battery = player.maxBattery;
        currentXP += 150;
        checkLevelUp();
      } else if (item.type === 'hotdog') {
        player.battery = Math.min(player.maxBattery, player.battery + 25);
        score += Math.floor(150 * packageMultiplier);
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '🌭 HOTDOG Z ŻABKI! +25% ⚡', '#4ade80');
      } else if (item.type === 'kinder_bueno') {
        player.battery = player.maxBattery;
        currentXP += Math.floor(50 * (1 + packageCombo * 0.05));
        score += Math.floor(350 * packageMultiplier);
        sounds.achieve();
        triggerAchievement('kinder_defender', 'Obrońca Kinder Bueno', '🍫');
        addSpeechBubble(player.x, player.y - 30, '🍫 KINDER BUENO ODNALEZIONE!', '#fbbf24');
        checkLevelUp();
      } else if (item.type === 'mystery_box') {
        const roll = Math.random();
        sounds.achieve();
        if (roll < 0.20) {
          showAnnouncement("BEZPŁATNE NADGODZINY!", "#ef4444");
          mysteryActive = 'nadgodziny'; mysteryTimer = 15; mysteryBuffMultiplier = 1.7;
          player.stamina = Math.max(0, player.stamina - 40);
        } else if (roll < 0.40) {
          showAnnouncement("KASK BHP: NIEŚMIERTELNOŚĆ!", "#facc15");
          player.invulnTimer = 10;
        } else if (roll < 0.60) {
          showAnnouncement("KONTROLA JAKOŚCI: CZYSTKA!", "#38bdf8");
          enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
        } else if (roll < 0.80) {
          showAnnouncement("PREMIA UZNANIOWA: WYSYP XP!", "#22c55e");
          for (let k = 0; k < 25; k++) {
             dropItems.push({ x: player.x + (Math.random()-0.5)*150, y: player.y + (Math.random()-0.5)*150, type: 'barcode_xp', val: 50, life: 30 });
          }
        } else {
          showAnnouncement("ZŁOTY KOD: COMBO x30!", "#c084fc");
          packageCombo = 30; packageComboTimer = 5;
        }
      } else if (item.type === 'coffee_thermos') {
        player.skillCooldown = 0;
        score += Math.floor(200 * packageMultiplier);
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '☕ TERMOS KAWY! SKILL READY!', '#f97316');
      } else if (item.type === 'dmuchawa_xp_vacuum') {
        sounds.achieve();
        screenShake = 10;
        showAnnouncement("🧲 DMUCHAWA WMS: PRZYCIĄGNIĘCIE WSZYSTKIEGO!", "#38bdf8");
        addSpeechBubble(player.x, player.y - 30, '🧲 VACUUM WMS! MEGA MAGNES!', '#38bdf8');
        // Instantly suck all XP and Coins towards player
        dropItems.forEach(dit => {
          if (dit.type === 'barcode_xp' || dit.type === 'dta_coin') {
            dit.x = player.x + (Math.random() - 0.5) * 40;
            dit.y = player.y + (Math.random() - 0.5) * 40;
          }
        });
        createSparks(player.x, player.y, 60, '#38bdf8');
      } else if (item.type === 'gasnica_co2_nuke') {
        sounds.freeze();
        screenShake = 22;
        showAnnouncement("🧯 GAŚNICA ŚNIEGOWA CO2 (NUKE SCREEN WIPE)!", "#22d3ee");
        addSpeechBubble(player.x, player.y - 30, '🧯 WYSTRZAŁ CO2! CZYSTKA HALI!', '#22d3ee');
        enemies.forEach(en => {
          if (!en.isBoss) {
            damageEnemy(en, 400);
          } else {
            damageEnemy(en, 150);
            en.slowTimer = 5.0;
          }
        });
        createSparks(player.x, player.y, 100, '#a5f3fc');
      } else if (item.type === 'przerwa_kawowa_freeze') {
        sounds.freeze();
        screenShake = 8;
        window.freezeEnemiesTimer = 4.5;
        showAnnouncement("☕ OFICJALNA PRZERWA ŚNIADANIOWA (4.5s FREEZE)!", "#fbbf24");
        addSpeechBubble(player.x, player.y - 30, '☕ PRZERWA 15 MIN! WROGOWIE ZAMROŻENI!', '#fbbf24');
        createSparks(player.x, player.y, 40, '#fef08a');
      }

      // Combo Milestones Floating Texts & Announcements
      if (packageCombo % 5 === 0 || packageCombo === 3 || packageCombo === 7) {
        spawnDamageNumber(player.x, player.y - 15, `🔥 PACZKI x${packageCombo}! (${packageMultiplier.toFixed(1)}x)`, true);
        createSparks(player.x, player.y, 14, packageCombo >= 15 ? '#38bdf8' : '#f59e0b');
        if (packageCombo === 10) {
          addSpeechBubble(player.x, player.y - 35, `⚡ TOYOTA BT TURBO SPEED! (${packageMultiplier.toFixed(1)}x PKT)`, '#fbbf24');
        } else if (packageCombo === 20) {
          addSpeechBubble(player.x, player.y - 35, `🚀 EKSPRESOWY ROZŁADUNEK x20! (${packageMultiplier.toFixed(1)}x PKT)`, '#38bdf8');
          triggerAchievement('fast_picker', 'Ekspresowy Magazynier x20', '📦');
        } else if (packageCombo === 30) {
          addSpeechBubble(player.x, player.y - 35, `👑 MISTRZ LOGISTYKI DTA x30! (${packageMultiplier.toFixed(1)}x PKT)`, '#c084fc');
        }
      }

      dropItems.splice(i, 1);
      continue;
    }
  }

  // Update Speech Bubbles
  for (let i = speechBubbles.length - 1; i >= 0; i--) {
    speechBubbles[i].life -= dt;
    speechBubbles[i].y -= dt * 6;
    if (speechBubbles[i].life <= 0) speechBubbles.splice(i, 1);
  }

  // Update DOM HUD & FPS
  fpsFrameCount++;
  const elapsedFps = now - fpsLastCalc;
  if (elapsedFps >= 350) {
    currentFps = Math.round((fpsFrameCount * 1000) / elapsedFps);
    currentFrameMs = (elapsedFps / fpsFrameCount).toFixed(1);
    fpsFrameCount = 0;
    fpsLastCalc = now;

    const activeEnemies = (typeof enemies !== "undefined" && enemies) ? enemies.filter(e => !e.dead).length : 0;
    const activeProjs = (typeof projectiles !== "undefined" && projectiles) ? projectiles.length : 0;
    const activeItems = ((typeof dropItems !== "undefined" && dropItems) ? dropItems.length : 0) + ((typeof adrBarrels !== "undefined" && adrBarrels) ? adrBarrels.filter(b => b.active).length : 0);
    const totalEnts = activeEnemies + activeProjs + activeItems + 1;

    const fpsBadge = document.getElementById('badge-fps');
    if (fpsBadge) {
      fpsBadge.innerHTML = `⚡ ${currentFps} FPS | 👥 ${totalEnts} ENTS`;
      if (currentFps >= 50) {
        fpsBadge.style.borderColor = '#22c55e';
        fpsBadge.style.color = '#86efac';
      } else if (currentFps >= 30) {
        fpsBadge.style.borderColor = '#f59e0b';
        fpsBadge.style.color = '#fde047';
      } else {
        fpsBadge.style.borderColor = '#ef4444';
        fpsBadge.style.color = '#fca5a5';
      }
    }

    // Populate Debug HUD Modal if visible
    const dbgModal = document.getElementById('debug-hud-modal');
    if (dbgModal && dbgModal.style.display === 'flex') {
      const eFps = document.getElementById('dbg-fps');
      if (eFps) eFps.innerText = `${currentFps} FPS (${currentFrameMs} ms)`;
      const eEn = document.getElementById('dbg-enemies');
      if (eEn) eEn.innerText = `${activeEnemies} / ${MAX_ENEMIES_CAP}`;
      const ePr = document.getElementById('dbg-projectiles');
      if (ePr) ePr.innerText = `${activeProjs}`;
      const ePa = document.getElementById('dbg-particles');
      if (ePa) {
        const activeP = (typeof particlePool !== 'undefined') ? particlePool.filter(p => p.active).length : 0;
        ePa.innerText = `${activeP} / ${MAX_PARTICLES}`;
      }
      const eFl = document.getElementById('dbg-floating');
      if (eFl) {
        const activeFt = (typeof floatingTexts !== 'undefined') ? floatingTexts.filter(ft => ft.active).length : 0;
        eFl.innerText = `${activeFt} / ${MAX_FLOATING_TEXTS}`;
      }
      const ePrp = document.getElementById('dbg-props');
      if (ePrp) {
        const pCount = (typeof mapProps !== 'undefined') ? mapProps.filter(p => !p.dead).length : 0;
        ePrp.innerText = `Drops: ${activeItems} | Props: ${pCount}`;
      }
      const eDps = document.getElementById('dbg-dps');
      if (eDps) {
        let totalDmg = 0;
        if (typeof weaponDamageStats !== 'undefined') {
          Object.keys(weaponDamageStats).forEach(k => { totalDmg += weaponDamageStats[k]; });
        }
        const dpsVal = (gameTime > 0) ? Math.round(totalDmg / gameTime) : 0;
        eDps.innerText = `${dpsVal} DPS`;
      }
    }
  }

  // 1. Vehicle Battery Telemetry Update
  const batteryPct = Math.max(0, Math.min(100, Math.ceil((player.battery / player.maxBattery) * 100)));
  const batteryValElem = document.getElementById('badge-battery-val');
  const batteryFillElem = document.getElementById('battery-bar-fill');
  const batteryPanel = document.getElementById('hud-battery-panel');
  
  if (batteryValElem) {
    batteryValElem.innerText = `${batteryPct}%`;
    if (batteryPct < 20) {
      batteryValElem.style.color = '#f87171';
    } else if (batteryPct < 50) {
      batteryValElem.style.color = '#fde047';
    } else {
      batteryValElem.style.color = '#4ade80';
    }
  }
  if (batteryFillElem) {
    batteryFillElem.style.width = `${batteryPct}%`;
    batteryFillElem.className = 'battery-bar-fill' + (batteryPct < 20 ? ' critical' : (batteryPct < 50 ? ' warning' : ''));
  }
  if (batteryPanel) {
    if (batteryPct < 20) {
      batteryPanel.classList.add('low');
    } else {
      batteryPanel.classList.remove('low');
    }
  }

  // 2. Horde Proximity & Threat Radar Calculation
  let nearbyThreatCount = 0;
  let closestDist = 9999;
  if (typeof enemies !== "undefined" && enemies) {
    for (let i = 0; i < enemies.length; i++) {
      const en = enemies[i];
      if (en.dead) continue;
      const d = Math.hypot(en.x - player.x, en.y - player.y);
      if (d < closestDist) closestDist = d;
      if (d < 340) nearbyThreatCount++;
    }
  }

  const threatDot = document.getElementById('threat-indicator-dot');
  const threatText = document.getElementById('threat-status-text');
  if (threatDot && threatText) {
    const closestMeters = (closestDist / 28).toFixed(1);
    if (nearbyThreatCount >= 14 || closestDist < 90) {
      threatDot.className = 'threat-radar-indicator critical';
      threatText.className = 'threat-status-label critical';
      threatText.innerText = `⚠️ ALARM: HORDY (${nearbyThreatCount}) ${closestMeters}m`;
    } else if (nearbyThreatCount >= 5 || closestDist < 220) {
      threatDot.className = 'threat-radar-indicator warning';
      threatText.className = 'threat-status-label warning';
      threatText.innerText = `UWAGA: ${nearbyThreatCount} WROGÓW (${closestMeters}m)`;
    } else {
      threatDot.className = 'threat-radar-indicator';
      threatText.className = 'threat-status-label';
      threatText.innerText = `PERYMETR CZYSTY (${closestDist < 2000 ? closestMeters + 'm' : 'OK'})`;
    }
  }

  // 3. Shift Clock & Kills
  const clockElem = document.getElementById('badge-clock');
  if (clockElem) clockElem.innerText = `TIME: ${timeStr}`;

  // 4. Logistics Combo Multiplier
  const totalCombo = Math.max(comboCount, packageCombo);
  const currentMult = (1 + packageCombo * 0.15).toFixed(1);
  const comboBadge = document.getElementById('badge-combo');
  if (comboBadge) {
    if (packageCombo > 0) {
      comboBadge.innerText = `COMBO x${totalCombo} (${currentMult}X)`;
      comboBadge.className = 'stat-badge badge-combo' + (packageCombo >= 15 ? ' hyper' : packageCombo >= 5 ? ' turbo' : '');
    } else {
      comboBadge.innerText = `COMBO x${Math.max(1, comboCount)}`;
      comboBadge.className = 'stat-badge badge-combo';
    }
  }

  // 5. Level & Kills Tally
  const lvlElem = document.getElementById('badge-lvl');
  if (lvlElem) lvlElem.innerText = `LVL ${playerLevel}`;
  const killsElem = document.getElementById('badge-kills');
  if (killsElem) killsElem.innerText = `DISP: ${kills}`;
  const xpFillElem = document.getElementById('xp-fill');
  if (xpFillElem) xpFillElem.style.width = `${Math.min(100, (currentXP / neededXP) * 100)}%`;

  updateBossTopBar();

  // 6. Real-Time Telemetry Synchronization with Jetpack Compose HUD (Poco F6 120 FPS)
  if (window.AndroidBridge && window.AndroidBridge.updateHudTelemetry) {
    let activeWName = 'SKANER ZEBRA';
    let activeWLevel = 1;
    let activeWIcon = '⚡';
    if (typeof weapons !== 'undefined') {
      for (const [k, w] of Object.entries(weapons)) {
        if (w.level > 0) {
          activeWName = w.name || k;
          activeWLevel = w.level;
          activeWIcon = w.icon || '⚡';
          break;
        }
      }
    }
    const sectorStr = `ZONE: S${currentSector || 1}`;
    const xpProg = (typeof neededXP !== 'undefined' && neededXP > 0) ? (currentXP / neededXP) : 0;
    const isPlaying = (typeof gameState !== 'undefined') ? (gameState === STATE.PLAYING) : true;
    const threatDistMeters = (closestDist && closestDist < 9999) ? (closestDist / 28) : 999;
    const threatLvl = nearbyThreatCount >= 14 || closestDist < 90 ? 'KRYTYCZNE' : (nearbyThreatCount >= 5 || closestDist < 220 ? 'UWAGA' : 'CZYSTY');
    const volt = (44.0 + (player.battery / Math.max(1, player.maxBattery)) * 4.8).toFixed(1) + 'V';

    window.AndroidBridge.updateHudTelemetry(
      batteryPct,
      player.maxBattery,
      player.battery,
      volt,
      playerLevel,
      xpProg,
      kills,
      sectorStr,
      timeStr,
      activeWName,
      activeWLevel,
      activeWIcon,
      totalCombo,
      parseFloat(currentMult) || 1.0,
      threatLvl,
      threatDistMeters,
      isPlaying
    );
  }
}

// --- RENDER PASS (ULTRA HIGH FIDELITY WAREHOUSE GRAPHICS) ---

// ============================================================================
// 2.5D DEPTH-SORTED DRAWING ENGINE (MODULAR HELPERS)
// ============================================================================
function drawObstacles(ctx, viewW, viewH) {
  if (typeof obstacles === 'undefined' || !obstacles) return;
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    if (o.x + o.w < camera.x - 100 || o.x > camera.x + viewW + 100 ||
        o.y + o.h < camera.y - 100 || o.y > camera.y + viewH + 100) {
      continue;
    }
    ctx.save();
    if (o.type === 'rack') {
      // Clean 2D Metal Storage Rack
      ctx.fillStyle = o.isFrozen ? '#0284c7' : '#1e293b';
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = o.isFrozen ? '#38bdf8' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(o.x, o.y, o.w, o.h);
      
      // Rack Shelving Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      for (let sy = o.y + 40; sy < o.y + o.h; sy += 40) {
        ctx.beginPath();
        ctx.moveTo(o.x, sy); ctx.lineTo(o.x + o.w, sy);
        ctx.stroke();
      }
      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RACK', o.x + o.w / 2, o.y + 18);
    } else if (o.type === 'pallet_stack') {
      // Clean 2D Wood Pallet Stack
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(o.x + o.w * 0.33, o.y); ctx.lineTo(o.x + o.w * 0.33, o.y + o.h);
      ctx.moveTo(o.x + o.w * 0.66, o.y); ctx.lineTo(o.x + o.w * 0.66, o.y + o.h);
      ctx.stroke();
    } else if (o.type === 'toitoi_station') {
      // Clean 2D ToiToi Booth
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TOI', o.x + o.w / 2, o.y + o.h / 2);
    } else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(o.x, o.y, o.w, o.h);
    }
    ctx.restore();
  }
}

function draw25DPlayerForklift(ctx) {
  ctx.save();
  ctx.translate(player.x, player.y);

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.arc(0, 2, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.rotate(player.angle);

  // Dynamic Volumetric Headlights Cone (Cutting through dark warehouse)
  const lightGrad = ctx.createRadialGradient(14, 0, 10, 240, 0, 300);
  lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
  lightGrad.addColorStop(0.35, 'rgba(250, 204, 21, 0.15)');
  lightGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = lightGrad;
  ctx.beginPath();
  ctx.moveTo(14, -6);
  ctx.lineTo(320, -110);
  ctx.lineTo(320, 110);
  ctx.lineTo(14, 6);
  ctx.closePath();
  ctx.fill();

  // If on Forklift - Draw Steel Forks and Chassis
  if (player.isForklift) {
    // Toyota BT Reflex Steel Forks
    ctx.fillStyle = '#64748b';
    ctx.fillRect(12, -10, 18, 4); // Left fork
    ctx.fillRect(12, 6, 18, 4);  // Right fork
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, -10, 18, 4);
    ctx.strokeRect(12, 6, 18, 4);

    // Forklift Chassis
    ctx.fillStyle = '#dc2626'; // Toyota Industrial Red
    ctx.fillRect(-16, -14, 28, 28);
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-16, -14, 28, 28);

    // Roll Cage / Overhead Guard
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, -10, 18, 20);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-10, -10, 18, 20);
  }

  const recoilOffset = (player.shootRecoilTimer && player.shootRecoilTimer > 0) ? -3 : 0;

  // Sleek 2D Tactical Operative Body
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();

  // High-vis Vest
  ctx.fillStyle = '#ea580c';
  ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();

  // Cap / Helmet
  ctx.fillStyle = '#020617';
  ctx.beginPath(); ctx.arc(-1, 0, 6, 0, Math.PI * 2); ctx.fill();

  // Visor
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(3, -2.5, 3, 5);

  // Hands
  ctx.fillStyle = '#ea580c';
  ctx.beginPath(); ctx.arc(5, -6, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, 6, 3, 0, Math.PI * 2); ctx.fill();

  // Weapon
  ctx.save();
  ctx.translate(recoilOffset, 0);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(6, -2.5, 16, 5);

  const wType = player.activeWeapon || 'scanner';
  let accentCol = '#38bdf8';
  if (wType === 'staples') accentCol = '#facc15';
  else if (wType === 'cutter') accentCol = '#f43f5e';
  else if (wType === 'foam') accentCol = '#06b6d4';
  else if (wType === 'gas_cloud') accentCol = '#10b981';

  ctx.fillStyle = accentCol;
  ctx.fillRect(10, -1, 8, 2);
  ctx.restore();

  // Aiming Laser Pointer Line
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(260, 0);
  ctx.stroke();

  // Stamina Bar
  if (player.stamina < player.maxStamina) {
    ctx.rotate(-player.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(-16, 22, 32, 4);
    ctx.fillStyle = '#facc15';
    const fillW = Math.max(0, (player.stamina / player.maxStamina) * 30);
    ctx.fillRect(-15, 23, fillW, 2);
    ctx.rotate(player.angle);
  }

  ctx.restore();
}

function drawSingleMapProp(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.arc(0, 2, p.radius, 0, Math.PI * 2);
  ctx.fill();
  if (p.hitFlash > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, p.radius + 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = p.def.color;
  ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
  ctx.strokeStyle = p.def.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(p.def.icon, 0, 1);
  ctx.restore();
}

function drawSingleDropItem(ctx, it, fontScale) {
  const isBarcode = it.type === 'barcode_xp';
  ctx.fillStyle = isBarcode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(245, 158, 11, 0.25)';
  ctx.beginPath(); ctx.arc(it.x, it.y, 16, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.translate(it.x, it.y);

  if (isBarcode) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -5, 16, 10);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-8, -5, 16, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -3, 2, 6);
    ctx.fillRect(-3, -3, 2, 6);
    ctx.fillRect(1, -3, 1.5, 6);
    ctx.fillRect(4, -3, 2, 6);
  } else if (it.type === 'coffee') {
    ctx.fillStyle = '#78350f';
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.stroke();
  } else if (it.type === 'sandwich') {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-6, -4, 12, 8);
  } else if (it.type === 'chest') {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-8, -6, 16, 12);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-8, -6, 16, 12);
  }
  ctx.restore();
}

function drawSingleEnemy(ctx, e, viewW, viewH) {
  if (!e || e.dead) return;
  if (e.x + 120 < camera.x || e.x - 120 > camera.x + viewW ||
      e.y + 120 < camera.y || e.y - 120 > camera.y + viewH) return;

  const rad = (e.info && e.info.radius) ? e.info.radius : 15;
  const isHit = e.hitFlash > 0;
  const isFrozen = e.slowTimer > 0;
  const isStunned = e.stunTimer > 0;
  const isEnraged = !!e.isEnraged;
  const isElite = !!e.isElite;
  const facing = Math.atan2(player.y - e.y, player.x - e.x);

  // 1. DANGER TELEGRAPH (Charging Dashers & Aiming Shooters)
  if (e.info && e.info.canDash && e.dashTimer && e.dashTimer < 0.8 && !e.dead) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(facing);
    const alphaPulse = 0.4 + Math.sin(gameTime * 25) * 0.35;
    ctx.fillStyle = `rgba(239, 68, 68, ${alphaPulse})`;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(240, -14);
    ctx.lineTo(240, 14);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  } else if (e.isDashing > 0) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(Math.atan2(e.vy || 0, e.vx || 1));
    ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.fillRect(-rad * 2, -rad, rad * 2, rad * 2);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(e.x, e.y);

  // 2. BOSS ENRAGE / ELITE AURA
  if (isEnraged) {
    const firePulse = 1.2 + Math.sin(gameTime * 12) * 0.25;
    const grad = ctx.createRadialGradient(0, 0, rad * 0.5, 0, 0, rad * 2.2 * firePulse);
    grad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    grad.addColorStop(0.6, 'rgba(249, 115, 22, 0.3)');
    grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0, 0, rad * 2.2 * firePulse, 0, Math.PI * 2); ctx.fill();
  } else if (isElite) {
    const goldPulse = 1.1 + Math.sin(gameTime * 8) * 0.15;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 0, (rad + 6) * goldPulse, 0, Math.PI * 2); ctx.stroke();
  }

  // Soft Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath(); ctx.arc(0, 2, rad * 0.9, 0, Math.PI * 2); ctx.fill();

  if (isHit) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, rad + 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  const rType = (e.info && e.info.renderType) ? e.info.renderType : 'pedestrian';

  if (rType === 'warehouse_rat') {
    ctx.rotate(facing);
    ctx.fillStyle = isFrozen ? '#38bdf8' : (isEnraged ? '#ef4444' : (e.info.color || '#64748b'));
    ctx.beginPath(); ctx.ellipse(0, 0, rad * 1.1, rad * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = isEnraged ? '#facc15' : '#ef4444';
    ctx.beginPath(); ctx.arc(rad * 0.6, -rad * 0.3, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rad * 0.6, rad * 0.3, 2, 0, Math.PI * 2); ctx.fill();
  } else if (rType === 'inventory_drone') {
    ctx.fillStyle = isFrozen ? '#38bdf8' : (isEnraged ? '#7f1d1d' : '#1e293b');
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = isEnraged ? '#ef4444' : '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
  } else if (rType === 'inpost_paczkomat') {
    ctx.rotate(facing);
    ctx.fillStyle = isFrozen ? '#38bdf8' : (isEnraged ? '#dc2626' : '#eab308');
    ctx.fillRect(-rad, -rad * 0.8, rad * 2, rad * 1.6);
    ctx.strokeStyle = isEnraged ? '#991b1b' : '#ca8a04'; ctx.lineWidth = 2;
    ctx.strokeRect(-rad, -rad * 0.8, rad * 2, rad * 1.6);
    ctx.fillStyle = '#000000'; ctx.font = '900 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('INPOST', 0, 3);
  } else if (rType === 'delivery_van') {
    ctx.rotate(facing);
    ctx.fillStyle = isFrozen ? '#38bdf8' : (isEnraged ? '#fee2e2' : '#f8fafc');
    ctx.fillRect(-rad * 1.6, -rad * 0.9, rad * 3.2, rad * 1.8);
    ctx.strokeStyle = isEnraged ? '#ef4444' : '#0284c7'; ctx.lineWidth = 2;
    ctx.strokeRect(-rad * 1.6, -rad * 0.9, rad * 3.2, rad * 1.8);
    ctx.fillStyle = isEnraged ? '#ef4444' : '#38bdf8';
    ctx.fillRect(rad * 0.5, -rad * 0.8, rad * 0.6, rad * 1.6);
  } else {
    // Standard 2D Top-Down Humanoid
    ctx.rotate(facing);
    ctx.fillStyle = isFrozen ? '#38bdf8' : (isEnraged ? '#b91c1c' : (e.info.color || '#ef4444'));
    ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = isEnraged ? '#ef4444' : '#0f172a'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = isEnraged ? '#ef4444' : '#f59e0b';
    ctx.fillRect(rad * 0.3, -2, rad * 0.6, 4);
  }

  // STATUS EFFECT ICONS
  if (isFrozen) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄️', 0, -rad - 14);
  } else if (isStunned) {
    ctx.fillStyle = '#facc15';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💫', 0, -rad - 14);
  } else if (isElite) {
    ctx.fillStyle = '#facc15';
    ctx.font = '900 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('👑 ELITA', 0, -rad - 14);
  } else if (isEnraged) {
    ctx.fillStyle = '#ef4444';
    ctx.font = '900 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 SZAŁ', 0, -rad - 14);
  }

  // HP Bar (Shown when damaged, or always for Elites / Bosses)
  if (e.hp < e.maxHp || isElite || isEnraged) {
    const barW = Math.max(24, rad * 2.2);
    const hpRatio = Math.max(0, Math.min(1, e.hp / e.maxHp));
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(-barW / 2, -rad - 8, barW, 4);
    ctx.fillStyle = isEnraged ? '#ef4444' : (isElite ? '#facc15' : (hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#f59e0b' : '#ef4444'));
    ctx.fillRect(-barW / 2 + 1, -rad - 7, (barW - 2) * hpRatio, 2);
  }

  ctx.restore();
}


function render2DOverlays(dt = 0.016) {
  if (!ctx) return;
  const zoom = Math.max(0.01, camera.zoom || 0.5);
  const viewW = gameWidth / zoom;
  const viewH = gameHeight / zoom;
  const fontScale = 1.0 / zoom;

  ctx.save();
  ctx.scale(zoom, zoom);
  const shakeX = (Math.random() - 0.5) * screenShake * 1.5;
  const shakeY = (Math.random() - 0.5) * screenShake * 1.5;
  const camX = isNaN(camera.x) ? 0 : camera.x;
  const camY = isNaN(camera.y) ? 0 : camera.y;
  ctx.translate(-camX + shakeX, -camY + shakeY);

  // Floating Damage Texts
  ctx.save();
  for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
    const ft = floatingTexts[i];
    if (ft && ft.active) {
      const lifePct = ft.life / ft.maxLife;
      const alpha = Math.min(1.0, ft.life * 2.5);
      ctx.save();
      ctx.globalAlpha = alpha;
      let baseDmgSize = ft.isCrit ? 18 : 13;
      if (ft.isCrit && lifePct > 0.8) {
        baseDmgSize += (lifePct - 0.8) * 45;
      }
      const dmgFontSize = Math.round(baseDmgSize * fontScale);
      ctx.font = `900 ${dmgFontSize}px "Arial Black", Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const clampX = Math.max(camera.x + 25 * fontScale, Math.min(camera.x + viewW - 30 * fontScale, ft.x));
      const clampY = Math.max(camera.y + 40 * fontScale, Math.min(camera.y + viewH - 50 * fontScale, ft.y));
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3.5 * fontScale;
      ctx.strokeText(ft.text, clampX, clampY);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, clampX, clampY);
      ctx.restore();
    }
  }
  ctx.restore();

  // Comic Speech Bubbles
  ctx.save();
  const bubbleFontSize = Math.round(11.5 * fontScale);
  ctx.font = `900 ${bubbleFontSize}px -apple-system, Roboto, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < speechBubbles.length; i++) {
    const b = speechBubbles[i];
    if (b.x < camera.x - 60 || b.x > camera.x + viewW + 60 ||
        b.y < camera.y - 60 || b.y > camera.y + viewH + 60) continue;
    const alpha = Math.min(1.0, b.life * 1.5);
    ctx.save();
    ctx.globalAlpha = alpha;
    const tw = ctx.measureText(b.text).width;
    const paddingX = 8 * fontScale;
    const paddingY = 4 * fontScale;
    const rectW = tw + paddingX * 2;
    const rectH = (16 * fontScale) + paddingY * 2;
    const rectX = b.x - rectW / 2;
    const rectY = b.y - (25 * fontScale) - rectH / 2;
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.beginPath();
    ctx.roundRect(rectX, rectY, rectW, rectH, 6 * fontScale);
    ctx.fill();
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.4 * fontScale;
    ctx.stroke();
    ctx.fillStyle = b.color;
    ctx.fillText(b.text, rectX + rectW / 2, rectY + rectH / 2);
    ctx.restore();
  }
  ctx.restore();
  ctx.restore(); // end camera transform

  // AMOLED Screen Edge Cinematic Vignette & Low Battery Pulse
  const vigGrad = ctx.createRadialGradient(
    gameWidth / 2, gameHeight / 2, Math.min(gameWidth, gameHeight) * 0.35,
    gameWidth / 2, gameHeight / 2, Math.max(gameWidth, gameHeight) * 0.85
  );
  vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  let edgeColor = "rgba(2, 6, 23, 0.75)";
  if (player.battery < player.maxBattery * 0.25) {
    const pulse = (Math.sin(performance.now() / 150) + 1) / 2;
    edgeColor = `rgba(${100 + pulse * 100}, 0, 0, ${0.4 + pulse * 0.4})`;
  } else if (typeof selectedArenaKey !== "undefined" && selectedArenaKey === "freezer") {
    edgeColor = "rgba(2, 20, 40, 0.8)";
  }
  vigGrad.addColorStop(1, edgeColor);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // Tactical Military Radar with Real-time 360° Sweep
  const mapSize = 125;
  const padding = 14;
  const mapX = gameWidth - mapSize - padding;
  const mapY = 95;
  const radarCenterX = mapX + mapSize / 2;
  const radarCenterY = mapY + mapSize / 2;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "rgba(8, 15, 30, 0.88)";
  ctx.strokeStyle = "#0ea5e9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(mapX, mapY, mapSize, mapSize, 8);
  ctx.fill();
  ctx.stroke();

  ctx.clip();
  const scaleX = mapSize / ARENA_WIDTH;
  const scaleY = mapSize / ARENA_HEIGHT;

  ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(radarCenterX, radarCenterY, mapSize * 0.22, 0, Math.PI * 2);
  ctx.arc(radarCenterX, radarCenterY, mapSize * 0.42, 0, Math.PI * 2);
  ctx.moveTo(mapX, radarCenterY); ctx.lineTo(mapX + mapSize, radarCenterY);
  ctx.moveTo(radarCenterX, mapY); ctx.lineTo(radarCenterX, mapY + mapSize);
  ctx.stroke();

  const sweepAngle = (gameTime * 2.5) % (Math.PI * 2);
  const sweepGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 2, radarCenterX, radarCenterY, mapSize * 0.65);
  sweepGrad.addColorStop(0, "rgba(56, 189, 248, 0.4)");
  sweepGrad.addColorStop(1, "rgba(56, 189, 248, 0.0)");
  ctx.fillStyle = sweepGrad;
  ctx.beginPath();
  ctx.moveTo(radarCenterX, radarCenterY);
  ctx.arc(radarCenterX, radarCenterY, mapSize * 0.65, sweepAngle - 0.45, sweepAngle);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(radarCenterX, radarCenterY);
  ctx.lineTo(radarCenterX + Math.cos(sweepAngle) * mapSize * 0.65, radarCenterY + Math.sin(sweepAngle) * mapSize * 0.65);
  ctx.stroke();

  // Draw Obstacles (Grey)
  ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
  if (typeof obstacles !== "undefined") {
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      const ow = o.w || o.width || 120;
      const oh = o.h || o.height || 280;
      ctx.fillRect(mapX + o.x * scaleX, mapY + o.y * scaleY, Math.max(1, ow * scaleX), Math.max(1, oh * scaleY));
    }
  }

  // Draw drops/xp (Small yellow dots)
  ctx.fillStyle = "#facc15";
  if (typeof dropItems !== "undefined") {
    for (let i = 0; i < dropItems.length; i++) {
      const d = dropItems[i];
      if (d.type !== "lucky_chest") {
        ctx.fillRect(mapX + d.x * scaleX, mapY + d.y * scaleY, 1.5, 1.5);
      } else {
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(mapX + d.x * scaleX - 1.5, mapY + d.y * scaleY - 1.5, 3, 3);
        ctx.fillStyle = "#facc15";
      }
    }
  }

  // Draw Enemies (Red)
  ctx.fillStyle = "#ef4444";
  if (typeof enemies !== "undefined") {
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      const es = e.isBoss ? 4 : 2.5;
      if (e.isBoss) ctx.fillStyle = "#a855f7";
      ctx.fillRect(mapX + e.x * scaleX - es/2, mapY + e.y * scaleY - es/2, es, es);
      if (e.isBoss) ctx.fillStyle = "#ef4444";
    }
  }

  // Draw Player (Green/Cyan)
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(mapX + player.x * scaleX, mapY + player.y * scaleY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Draw Camera Viewport (White outline)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  const viewW_scaled = (gameWidth / camera.zoom) * scaleX;
  const viewH_scaled = (gameHeight / camera.zoom) * scaleY;
  ctx.strokeRect(mapX + camera.x * scaleX, mapY + camera.y * scaleY, viewW_scaled, viewH_scaled);

  ctx.restore();
}

function drawArenaWarehouseFloor(ctx, camX, camY, viewW, viewH) {
  // Deep space obsidian epoxy floor base
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

  // Modern blueprint industrial grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 120;
  
  ctx.beginPath();
  const startX = Math.floor(camX / gridSize) * gridSize;
  const startY = Math.floor(camY / gridSize) * gridSize;
  for (let x = startX; x < camX + viewW + 120; x += gridSize) {
    ctx.moveTo(x, camY);
    ctx.lineTo(x, camY + viewH);
  }
  for (let y = startY; y < camY + viewH + 120; y += gridSize) {
    ctx.moveTo(camX, y);
    ctx.lineTo(camX + viewW, y);
  }
  ctx.stroke();

  // Subtle perimeter high-voltage neon warning border
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

  // Draw only visible blood splatter marks (Major GPU & Memory Fill-Rate Optimization!)
  if (typeof splatterCanvas !== 'undefined' && splatterCanvas) {
    const sx = Math.max(0, Math.floor(camX - 120));
    const sy = Math.max(0, Math.floor(camY - 120));
    const sw = Math.min(ARENA_WIDTH - sx, Math.ceil(viewW + 240));
    const sh = Math.min(ARENA_HEIGHT - sy, Math.ceil(viewH + 240));
    if (sw > 0 && sh > 0) {
      ctx.drawImage(splatterCanvas, sx, sy, sw, sh, sx, sy, sw, sh);
    }
  }
}

function drawProjectilesAndVFX(ctx) {
  if (typeof projectiles === 'undefined' || !projectiles) return;
  const zoom = camera.zoom || 0.5;
  const viewW = gameWidth / zoom;
  const viewH = gameHeight / zoom;

  for (let i = 0; i < projectiles.length; i++) {
    const p = projectiles[i];
    if (!p) continue;
    if (p.x < camera.x - 120 || p.x > camera.x + viewW + 120 ||
        p.y < camera.y - 120 || p.y > camera.y + viewH + 120) {
      continue;
    }


    ctx.save();
    if (p.type === 'laser') {
      // It has x1, y1, x2, y2 instead of x, y
      ctx.strokeStyle = p.color || '#ef4444';
      ctx.lineWidth = p.width || (p.isEvo ? 5 : 2);
      ctx.globalAlpha = Math.max(0, p.life / 0.15); // fade out
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.stroke();
      ctx.restore();
      continue;
    }
    
    // Default translation for others
    ctx.translate(p.x, p.y);


    if (p.type === 'scanner' || p.type === 'rfid_laser') {
      ctx.rotate(p.angle !== undefined ? p.angle : Math.atan2(p.vy || 0, p.vx || 1));
      const len = 24;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)'; // vibrant semi-transparent neon blue
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-len, 0);
      ctx.lineTo(0, 0);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -1, 4, 2);
    } else if (p.type === 'staples' || p.type === 'nailgun') {
      ctx.rotate(p.angle !== undefined ? p.angle : Math.atan2(p.vy || 0, p.vx || 1));
      ctx.fillStyle = 'rgba(250, 204, 21, 0.8)'; // bright amber, semi-trans
      ctx.fillRect(-6, -1.5, 12, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -0.7, 7, 1.4);
    } else if (p.type === 'cutter' || p.type === 'sawblade') {
      const rot = (p.rot || (gameTime * 25));
      ctx.rotate(rot);
      // Premium futuristic translucent energy saw blade design
      ctx.fillStyle = 'rgba(148, 163, 184, 0.35)'; // highly transparent body
      ctx.beginPath(); ctx.arc(0, 0, p.radius || 13, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)'; // glowing crisp edge
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (p.type === 'foam' || p.type === 'co2') {
      // Dynamic fade out cloud mist that is light and atmospheric
      const pct = (p.life || 1.0) / (p.maxLife || 1.0);
      const alpha = Math.max(0, Math.min(0.24, pct * 0.24));
      ctx.fillStyle = `rgba(165, 243, 252, ${alpha})`;
      ctx.beginPath(); ctx.arc(0, 0, (p.radius || 15) * (1.2 - pct * 0.2), 0, Math.PI * 2); ctx.fill();
    } else if (p.type === 'toiletPaper') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'; // soft semi-trans white roll
      ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.rotate(p.angle !== undefined ? p.angle : Math.atan2(p.vy || 0, p.vx || 1));
      ctx.fillStyle = p.color || 'rgba(245, 158, 11, 0.75)';
      ctx.fillRect(-3, -1.5, 6, 3);
    }

    ctx.restore();
  }

  // Optimized Batch Particle Rendering
  if (typeof particlePool !== 'undefined') {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const pt = particlePool[i];
      if (!pt || !pt.active) continue;
      const alpha = Math.max(0, pt.life / (pt.maxLife || 0.3));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pt.color || '#f59e0b';
      const sz = Math.max(1, pt.size * alpha);
      ctx.fillRect(pt.x - sz * 0.5, pt.y - sz * 0.5, sz, sz);
    }
    ctx.globalAlpha = 1.0;
  }
}

function drawVolumetricLightingMask(ctx, camX, camY, viewW, viewH) {
  ctx.save();
  const pAngle = player.angle;
  const beamDist = 420; // extended for premium visibility

  // Left and Right headlight offset from the forklift center (overhead guard mounts)
  const headOffsetX = -Math.cos(pAngle) * 8 + Math.sin(pAngle) * 13;
  const headOffsetY = -Math.sin(pAngle) * 8 - Math.cos(pAngle) * 13;
  
  // Left Headlight
  const leftHeadX = player.x + headOffsetX;
  const leftHeadY = player.y + headOffsetY;
  
  // Right Headlight
  const rightHeadX = player.x - headOffsetX;
  const rightHeadY = player.y - headOffsetY;

  // We use "screen" composite operation to make overlapping lights blend realistically!
  ctx.globalCompositeOperation = 'screen';

  // 1. Render Left Headlight Cone with premium Radial Gradient
  const leftGrad = ctx.createRadialGradient(leftHeadX, leftHeadY, 5, leftHeadX, leftHeadY, beamDist);
  leftGrad.addColorStop(0, 'rgba(255, 254, 230, 0.45)'); // Warm bright LED core
  leftGrad.addColorStop(0.15, 'rgba(254, 240, 138, 0.18)');
  leftGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.06)');
  leftGrad.addColorStop(1.0, 'rgba(254, 240, 138, 0.0)');

  ctx.fillStyle = leftGrad;
  ctx.beginPath();
  ctx.moveTo(leftHeadX, leftHeadY);
  ctx.arc(leftHeadX, leftHeadY, beamDist, pAngle - 0.32, pAngle + 0.32);
  ctx.closePath();
  ctx.fill();

  // 2. Render Right Headlight Cone
  const rightGrad = ctx.createRadialGradient(rightHeadX, rightHeadY, 5, rightHeadX, rightHeadY, beamDist);
  rightGrad.addColorStop(0, 'rgba(255, 254, 230, 0.45)');
  rightGrad.addColorStop(0.15, 'rgba(254, 240, 138, 0.18)');
  rightGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.06)');
  rightGrad.addColorStop(1.0, 'rgba(254, 240, 138, 0.0)');

  ctx.fillStyle = rightGrad;
  ctx.beginPath();
  ctx.moveTo(rightHeadX, rightHeadY);
  ctx.arc(rightHeadX, rightHeadY, beamDist, pAngle - 0.32, pAngle + 0.32);
  ctx.closePath();
  ctx.fill();

  // 3. Render Toyota BlueSpot Safety Light projected on the ground
  // BlueSpot is projected ahead of the vehicle to warn other warehouse workers
  const spotX = player.x + Math.cos(pAngle) * 110;
  const spotY = player.y + Math.sin(pAngle) * 110;

  const blueSpotGrad = ctx.createRadialGradient(spotX, spotY, 2, spotX, spotY, 24);
  blueSpotGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');     // Pure white high-intensity focus
  blueSpotGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.95)');  // Intense cyan/blue core
  blueSpotGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.45)');   // Expanding deep blue aura
  blueSpotGrad.addColorStop(1.0, 'rgba(14, 165, 233, 0.0)');    // Smooth edge fade out

  ctx.fillStyle = blueSpotGrad;
  ctx.beginPath();
  ctx.arc(spotX, spotY, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

const ghostTrails = [];

function drawGhostTrails(ctx, dt = 0.016) {
  for (let i = ghostTrails.length - 1; i >= 0; i--) {
    const g = ghostTrails[i];
    g.life -= dt;
    g.alpha = Math.max(0, g.life / 0.28) * 0.65;
    if (g.life <= 0) {
      ghostTrails.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.angle);
    ctx.globalAlpha = g.alpha;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, -3, 3, 6);
    ctx.restore();
  }
}

function render(dt = 0.016) {
  if (!ctx) return;

  const dprVal = dpr || 1;
  const zoom = Math.max(0.01, camera.zoom || 0.5);
  const viewW = gameWidth / zoom;
  const viewH = gameHeight / zoom;
  const fontScale = 1.0 / zoom;

  ctx.save();
  ctx.scale(dprVal, dprVal);

  ctx.fillStyle = '#060913';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  ctx.save();
  ctx.scale(zoom, zoom);
  const shakeX = (Math.random() - 0.5) * screenShake * 1.5;
  const shakeY = (Math.random() - 0.5) * screenShake * 1.5;
  const camX = isNaN(camera.x) ? 0 : camera.x;
  const camY = isNaN(camera.y) ? 0 : camera.y;
  ctx.translate(-camX + shakeX, -camY + shakeY);

  drawArenaWarehouseFloor(ctx, camX, camY, viewW, viewH);
  drawSkidMarks(ctx);

  drawObstacles(ctx, viewW, viewH);
  drawSpentShells(ctx);
  drawMapProps(ctx, viewW, viewH);
  drawTacticalDrops(ctx);

  for (let i = 0; i < dropItems.length; i++) {
    drawSingleDropItem(ctx, dropItems[i], fontScale);
  }

  drawShrapnel(ctx);

  for (let i = 0; i < enemies.length; i++) {
    drawSingleEnemy(ctx, enemies[i], viewW, viewH);
  }

  if (typeof kluska !== 'undefined' && kluska && kluska.active) {
    drawKluska(ctx);
  }

  drawGhostTrails(ctx, dt);
  draw25DPlayerForklift(ctx);
  drawProjectilesAndVFX(ctx);
  drawMuzzleFlashesAndSmoke(ctx);
  drawAtmosphericDust(ctx, viewW, viewH);
  drawTacticalTargetingSystem(ctx);
  drawVolumetricLightingMask(ctx, camX, camY, viewW, viewH);

  ctx.restore();

  render2DOverlays(dt);
  ctx.restore();
}


let hasLoggedLoopError = false;

function gameLoop(now) {
  try {
    if (!lastTime || isNaN(lastTime)) lastTime = now || performance.now();
    if (!now) now = performance.now();
    let dt = Math.min(0.1, Math.max(0, (now - lastTime) / 1000));
    if (isNaN(dt)) dt = 0.016;
    lastTime = now;
    
    if (window.timeScale === undefined) window.timeScale = 1.0;
    if (window.timeScale < 1.0) {
        window.timeScale = Math.min(1.0, window.timeScale + dt * 0.85); // Smoothly recover from slow-mo
    }
    
    const gameDt = dt * window.timeScale;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particlePool[i];
      if (p.active) {
        p.x += p.vx; p.y += p.vy; p.life -= dt;
        p.vx *= 0.92; p.vy *= 0.92; 
        if (p.life <= 0) p.active = false;
      }
    }
    for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
      const ft = floatingTexts[i];
      if (ft.active) {
        ft.y -= dt * 25; ft.life -= dt;
        if (ft.life <= 0) ft.active = false;
      }
    }

    update(gameDt);
    render(gameDt);
  } catch (err) {
    console.error("LOOP ERROR: ", err);
    if (!hasLoggedLoopError) {
      hasLoggedLoopError = true;
      alert("CRITICAL LOOP ERROR: " + err.message + "\n" + err.stack);
    }
  }
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// --- STATE MANAGERS & SAVING ---
function startGame() {
  try {
    sounds.init();
    document.getElementById('start-screen').style.display = 'none';
    showIntroDialog();
  } catch (err) {
    alert("START ERROR: " + err.message);
  }
}

function startGamePlay() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('intro-screen').style.display = 'none';
  if (document.getElementById('levelup-screen')) document.getElementById('levelup-screen').style.display = 'none';
  if (document.getElementById('pause-screen')) document.getElementById('pause-screen').style.display = 'none';
  if (sounds && sounds.init) sounds.init();
  initSectorEnvironment();
  try {
    const c = CHARACTERS[selectedCharKey] || CHARACTERS['piotr'];
  player.x = ARENA_WIDTH / 2;
  player.y = ARENA_HEIGHT / 2;
  player.vx = 0;
  player.vy = 0;
  
  // Base stats modified by Workshop permanent upgrades
  player.maxBattery = c.maxBattery + (workshopUpgrades.battery * 25);
  player.battery = player.maxBattery;
  player.speed = c.speed * (1 + workshopUpgrades.speed * 0.08);
  player.damageMult = (1 + workshopUpgrades.damage * 0.12);
  player.magnetRange = c.magnet + (workshopUpgrades.magnet * 35);
  player.critChance = c.critBonus;
  player.attackSpeedMult = c.attackSpeedMult || 1.0;
  player.maxSkillCooldown = Math.max(2, c.skillCooldown * (1 - workshopUpgrades.cooldown * 0.08));
  player.skillCooldown = 0;
  player.detentionCooldown = 0;
  player.rerolls = selectedCharKey === 'klaus' ? 4 : 2;

  // Reset all weapons & passives
  Object.keys(weapons).forEach(k => {
    weapons[k].level = 0;
    weapons[k].isEvo = false;
    weapons[k].timer = 0;
  });
  Object.keys(passives).forEach(k => {
    passives[k].level = 0;
  });

  // Assign starting weapon tailored to character lore
  if (selectedCharKey === 'marcin') {
    weapons.toiletPaper.level = 1; // Marcin Wojownik Velvet
  } else if (selectedCharKey === 'mirek') {
    weapons.sledgehammer.level = 1; // Pan Mirek Złota Rączka
  } else if (selectedCharKey === 'klaus') {
    weapons.stapler.level = 1; // Audytor Klaus Centrala
  } else if (selectedCharKey === 'radek') {
    weapons.cutter.level = 1; // Radek Weteran BT
  } else if (selectedCharKey === 'pawel') {
    weapons.pallets.level = 1; // Paweł Ekspert EPAL
  } else if (selectedCharKey === 'kierownik_marcin') {
    weapons.extinguisher.level = 1; // Kierownik Marcin PPOŻ
  } else if (selectedCharKey === 'przemek_biuro') {
    weapons.scanner.level = 1; // Przemek z biura WMS
    passives.magnet.level = 1;
  } else if (selectedCharKey === 'ania_biuro') {
    weapons.zipTies.level = 1; // Ania z biura Celnego
  } else if (selectedCharKey === 'grzesiek_zastepca') {
    weapons.stretchAura.level = 1; // Grzesiek Zastępca
    passives.coffee.level = 1;
  } else {
    // Piotr (domyślny)
    weapons.scanner.level = 1;
  }

  enemies = [];
  projectiles = [];
  dropItems = [];
  initMapProps();
  gameTime = 0;
  sectorTime = 0;
  score = 0;
  kills = 0;
  comboCount = 0;
  packageCombo = 0;
  packageComboTimer = 0;
  maxPackageCombo = 0;
  mysteryTimer = 0; mysteryActive = ''; mysteryBuffMultiplier = 1.0;
  playerLevel = 1;
  currentXP = 0;
  neededXP = 50;
  currentSectorIndex = 0;
  spawnedBossSectors = [false, false, false, false, false];
  activeBoss = null;
  rebuildSectorEnvironment(0);

  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('stage-transition-screen').style.display = 'none';
  document.getElementById('gameover-screen').style.display = 'none';
  document.getElementById('win-screen').style.display = 'none';
  document.getElementById('chest-screen').style.display = 'none';
  document.getElementById('pause-screen').style.display = 'none';

  updateWeaponsHud();
  gameState = STATE.PLAYING;
  triggerAchievement('first_blood', 'Pierwsza Odprawa', '📦');
  showAnnouncement('📍 SEKTOR 1: DOKI ROZŁADUNKOWE', '#f59e0b');
  } catch (err) {
    alert("PLAY ERROR: " + err.message + "\n" + err.stack);
  }
}

function renderDpsList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  const weaponNames = {
    scanner: { name: 'Skaner Laserowy', icon: '🔦', color: '#38bdf8' },
    toiletPaper: { name: 'Taśma Pakowa', icon: '🧻', color: '#fbbf24' },
    stretchAura: { name: 'Aura Streczu', icon: '🌀', color: '#a855f7' },
    pallets: { name: 'Taran Paleciak', icon: '🪵', color: '#f97316' },
    extinguisher: { name: 'Gaśnica PPOŻ', icon: '🧯', color: '#06b6d4' },
    zipTies: { name: 'Trytytki Samozaciskowe', icon: '🔗', color: '#3b82f6' },
    cutter: { name: 'Nóż Stanley', icon: '🔪', color: '#ef4444' },
    stapler: { name: 'Zszywacz Pneumatyczny', icon: '📌', color: '#ec4899' },
    sledgehammer: { name: 'Młot BHP 360°', icon: '🔨', color: '#eab308' },
    faktura: { name: 'Faktura Korygująca', icon: '📄', color: '#84cc16' },
    kawa: { name: 'Kawa z Automatu', icon: '☕', color: '#d97706' },
    hydrant: { name: 'Hydrant Magazynowy', icon: '🚰', color: '#0284c7' },
    megafon: { name: 'Megafon Kierownika', icon: '📢', color: '#f43f5e' },
    ramming: { name: 'Taranowanie Wózkiem', icon: '🚜', color: '#fbbf24' },
    general: { name: 'Inne Źródła / Pasywki', icon: '💥', color: '#94a3b8' }
  };

  let totalDmg = 0;
  Object.keys(weaponDamageStats).forEach(k => {
    totalDmg += weaponDamageStats[k] || 0;
  });

  const sortedStats = Object.keys(weaponDamageStats)
    .filter(k => (weaponDamageStats[k] || 0) > 0)
    .map(k => ({
      key: k,
      dmg: weaponDamageStats[k],
      info: weaponNames[k] || { name: k, icon: '⚔️', color: '#38bdf8' }
    }))
    .sort((a, b) => b.dmg - a.dmg);

  if (sortedStats.length === 0) {
    container.innerHTML = '<div style="font-size: 11px; color: #64748b; padding: 4px;">Brak danych o obrażeniach.</div>';
    return;
  }

  const runSec = Math.max(1, Math.floor(gameTime));

  sortedStats.forEach(item => {
    const pct = totalDmg > 0 ? Math.round((item.dmg / totalDmg) * 100) : 0;
    const dps = Math.round(item.dmg / runSec);
    const row = document.createElement('div');
    row.style.cssText = 'margin-bottom: 6px; font-size: 11px; color: #e2e8f0;';
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
        <span style="font-weight: 700;">${item.info.icon} ${item.info.name}</span>
        <span style="font-family: monospace; font-weight: 800; color: ${item.info.color};">
          ${item.dmg.toLocaleString()} (${pct}%) • ${dps} DPS
        </span>
      </div>
      <div style="background: rgba(255,255,255,0.1); border-radius: 4px; height: 5px; width: 100%; overflow: hidden;">
        <div style="background: ${item.info.color}; height: 100%; width: ${pct}%; border-radius: 4px;"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

function goToWorkshopFromEndScreen() {
  document.getElementById('gameover-screen').style.display = 'none';
  document.getElementById('win-screen').style.display = 'none';
  document.getElementById('start-screen').style.display = 'flex';
  gameState = STATE.START;
  switchTab('workshop');
}

function gameOver(shiftTime, isWin) {
  gameState = isWin ? STATE.WIN : STATE.GAMEOVER;
  const bestCombo = Math.max(maxCombo, maxPackageCombo);
  const earnedCoins = Math.floor(score / 15) + (isWin ? 200 : 50) + (currentSectorIndex * 40);
  dtaCoins += earnedCoins;
  saveWorkshopData();

  if (isWin) {
    triggerAchievement('shift_master', '07:00 - Fajrant Marzeń', '🏆');
    document.getElementById('win-stats').innerText = `Dotrwałeś do 07:00! Wynik: ${score} | Kills: ${kills} | Max Combo: x${bestCombo} | 💰 +${earnedCoins} Monet DTA`;
    renderDpsList('win-dps-list');
    document.getElementById('win-screen').style.display = 'flex';
  } else {
    document.getElementById('gameover-stats').innerText = `Przetrwano do: ${shiftTime} | Sektor: ${currentSectorIndex + 1} | Punkty: ${score} | Poziom: ${playerLevel} | 💰 +${earnedCoins} Monet DTA`;
    renderDpsList('gameover-dps-list');
    document.getElementById('gameover-screen').style.display = 'flex';
  }

  if (window.AndroidBridge && window.AndroidBridge.saveGameScore) {
    window.AndroidBridge.saveGameScore(score, kills, playerLevel, Math.floor(gameTime), shiftTime, isWin);
  }
}


document.getElementById('btn-restart').onclick = startGame;
document.getElementById('btn-win-restart').onclick = startGame;

function switchTab(tabId, btnElement) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  let evt = typeof event !== 'undefined' ? event : null;
  const targetBtn = btnElement || (evt && evt.target && evt.target.closest('.tab-btn')) || document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
  if (targetBtn) targetBtn.classList.add('active');
  const targetContent = document.getElementById('tab-' + tabId);
  if (targetContent) targetContent.classList.add('active');
  if (tabId === 'workshop') renderWorkshopTab();
  if (tabId === 'scores') renderScoresTab();
  if (tabId === 'achievements') renderAchievementsTab();
}

const WORKSHOP_ITEMS = [
  { key: 'battery', name: 'Wzmocniona Bateria Litowa', icon: '🔋', baseCost: 150, maxLvl: 5, desc: '+25 Max HP baterii za poziom' },
  { key: 'speed', name: 'Kółka Poliuretanowe BT', icon: '🛞', baseCost: 200, maxLvl: 5, desc: '+8% Szybkości jazdy i biegu' },
  { key: 'damage', name: 'Wzmocniony Zderzak Stalowy', icon: '💥', baseCost: 250, maxLvl: 5, desc: '+12% Wszystkich obrażeń' },
  { key: 'magnet', name: 'Cewka Magnetyczna KAS', icon: '🧲', baseCost: 150, maxLvl: 5, desc: '+35 Zasięgu przyciągania kodów kreskowych' },
  { key: 'cooldown', name: 'Chłodnica Oleju Przekładniowego', icon: '❄️', baseCost: 300, maxLvl: 5, desc: '-8% Czasu odnowienia umiejętności' }
];

function renderWorkshopTab() {
  const container = document.getElementById('workshop-container');
  const coinsDisplay = document.getElementById('shop-coins-display');
  if (coinsDisplay) coinsDisplay.innerText = `💰 ${dtaCoins} MONET`;
  saveWorkshopData();
  if (!container) return;
  container.innerHTML = WORKSHOP_ITEMS.map(item => {
    const curLvl = workshopUpgrades[item.key] || 0;
    const cost = Math.floor(item.baseCost * Math.pow(1.6, curLvl));
    const isMax = curLvl >= item.maxLvl;
    const canAfford = dtaCoins >= cost && !isMax;
    return `
      <div class="workshop-card">
        <div style="font-size:28px;">${item.icon}</div>
        <div class="workshop-name">${item.name} (Poz. ${curLvl}/${item.maxLvl})</div>
        <div class="workshop-desc">${item.desc}</div>
        <div class="workshop-cost">${isMax ? 'MAX POZIOM' : 'Cena: ' + cost + ' monet'}</div>
        <button class="upgrade-btn ${canAfford ? 'can-afford' : ''}" ${!canAfford ? 'disabled' : ''} onclick="buyWorkshopUpgrade('${item.key}', ${cost})">
          ${isMax ? 'WYKUPIONE' : 'ULEPSZ ➔'}
        </button>
      </div>
    `;
  }).join('');
}

function buyWorkshopUpgrade(key, cost) {
  if (dtaCoins >= cost && (workshopUpgrades[key] || 0) < 5) {
    dtaCoins -= cost;
    workshopUpgrades[key] = (workshopUpgrades[key] || 0) + 1;
    saveWorkshopData();
    sounds.achieve();
    renderWorkshopTab();
  }
}

// Initial UI Setup
saveWorkshopData();

function renderScoresTab() {
  const c = document.getElementById('scores-container');
  if (!roomScores || roomScores.length === 0) {
    c.innerHTML = '<div style="color:#64748b; text-align:center; padding:15px;">Brak zapisanych zmian.</div>';
    return;
  }
  c.innerHTML = roomScores.map((s, i) => `
    <div class="score-row">
      <div><b>#${i+1}</b> ${s.isWin ? '🏆 FAJRANT' : '💀 ZJAZD'} (${s.shiftTimeFormatted})</div>
      <div>⭐ ${s.score} pkt | 💀 ${s.kills} | LVL ${s.level}</div>
    </div>
  `).join('');
}

function renderAchievementsTab() {
  const c = document.getElementById('achievements-container');
  if (!roomAchievements || roomAchievements.length === 0) return;
  c.innerHTML = roomAchievements.map(a => `
    <div class="ach-card ${a.unlocked ? 'unlocked' : ''}">
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-info">
        <div class="ach-title">${a.title}</div>
        <div class="ach-desc">${a.isSecret && !a.unlocked ? '??? (Osiągnięcie Tajne BHP)' : a.description}</div>
      </div>
    </div>
  `).join('');
}

// --- EXPOSE GAME BRIDGE API ON WINDOW ---
window.startGamePlay = startGamePlay;
window.startGame = startGame;
window.closeLevelUp = closeLevelUp;

window.onCardSelectedInCompose = function(cardId) {
  if (!cardId) { closeLevelUp(); return; }
  try {
    if (typeof EVOLUTIONS !== 'undefined' && EVOLUTIONS[cardId]) {
      applyEvolution(EVOLUTIONS[cardId]);
    } else if (typeof weapons !== 'undefined' && weapons[cardId]) {
      applyUpgrade({ cat: 'weapon', id: cardId });
    } else if (typeof passives !== 'undefined' && passives[cardId]) {
      applyUpgrade({ cat: 'passive', id: cardId });
    } else if (cardId.startsWith('bonus_')) {
      applyUpgrade({ cat: 'bonus', id: cardId });
    } else {
      // Fallback check in weapons & passives
      if (weapons && weapons[cardId]) applyUpgrade({ cat: 'weapon', id: cardId });
      else if (passives && passives[cardId]) applyUpgrade({ cat: 'passive', id: cardId });
    }
  } catch(e) {
    console.error("Error applying Compose card: ", e);
  }
  closeLevelUp();
};

window.togglePause = function() {
  if (gameState === STATE.PLAYING) {
    gameState = STATE.PAUSED;
    const pScreen = document.getElementById('pause-screen');
    if (pScreen) pScreen.style.display = 'flex';
  } else if (gameState === STATE.PAUSED) {
    gameState = STATE.PLAYING;
    const pScreen = document.getElementById('pause-screen');
    if (pScreen) pScreen.style.display = 'none';
  }
};

window.onAndroidAppPause = function() {
  if (gameState === STATE.PLAYING) {
    gameState = STATE.PAUSED;
  }
  if (sounds && sounds.ctx && sounds.ctx.state === 'running') {
    sounds.ctx.suspend().catch(() => {});
  }
};

window.onAndroidAppResume = function() {
  if (sounds && sounds.ctx && sounds.ctx.state === 'suspended' && !sounds.muted) {
    sounds.ctx.resume().catch(() => {});
  }
};

window.toggleZoom = function() {
  if (typeof camera === 'undefined') return;
  if (camera.zoom <= 0.6) {
    camera.zoom = 0.85;
  } else if (camera.zoom <= 0.9) {
    camera.zoom = 1.1;
  } else {
    camera.zoom = 0.55;
  }
  if (typeof showAnnouncement === 'function') {
    showAnnouncement(`🔍 ZOOM: ${(camera.zoom * 100).toFixed(0)}%`, '#38bdf8');
  }
};

window.toggleFpsDetails = function() {
  const dbgModal = document.getElementById('debug-hud-modal');
  if (dbgModal) {
    dbgModal.style.display = (dbgModal.style.display === 'none' || !dbgModal.style.display) ? 'flex' : 'none';
  }
};

window.selectCharacter = function(key, el) { selectCharacter(key, el); };
window.selectArena = function(arena, el) { selectArena(arena, el); };
window.selectGameMode = function(mode, el) { selectGameMode(mode, el); };
window.buyWorkshopUpgrade = function(key, cost) { buyWorkshopUpgrade(key, cost); };
if (typeof sounds !== 'undefined') {
  window.sounds = sounds;
}
console.log("GAME ENGINE LOADED COMPLETELY");

      console.log('Script parsed and executed globally without throwing errors.');
      startGame();
      console.log('startGame() called.');
      gameLoop();
      console.log('gameLoop() called.');
    } catch (e) {
      console.error(e.stack);
    }
  