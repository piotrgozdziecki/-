
const window = global;
window.addEventListener = () => {};
window.innerWidth = 1080;
window.innerHeight = 2400;
window.devicePixelRatio = 2;
window.requestAnimationFrame = () => {};
const mockEl = () => ({
  style: {}, classList: { add: ()=>{}, remove: ()=>{} }, innerText: '', innerHTML: '', addEventListener: ()=>{},
  getContext: () => ({ setTransform: ()=>{}, restore: ()=>{}, save: ()=>{}, clearRect: ()=>{}, fillRect: ()=>{}, drawImage: ()=>{} })
});
const document = {
  getElementById: (id) => mockEl(),
  querySelectorAll: () => [mockEl()],
  querySelector: () => mockEl(),
  addEventListener: () => {},
  createElement: () => mockEl(),
};
const navigator = { userAgent: 'Android' };
const localStorage = { getItem: () => null, setItem: () => {} };
const performance = { now: () => 1000 };
const AudioContext = class { createOscillator(){return {type:'',frequency:{setValueAtTime:()=>{},setTargetAtTime:()=>{}},connect:()=>{},start:()=>{},stop:()=>{}};} createGain(){return {gain:{setValueAtTime:()=>{},exponentialRampToValueAtTime:()=>{},setTargetAtTime:()=>{}},connect:()=>{}};} };
const webkitAudioContext = AudioContext;


/* ==========================================================================
   DTA GRANICZNA 8F: MASSIVE HORDE SURVIVORS ENGINE WITH EVOLUTIONS & BOSSES
   ========================================================================== */

class SoundEngine {
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
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
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
const ctx = canvas.getContext('2d', { alpha: false });
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
let dpr = 1;

function resizeCanvas() {
  gameWidth = window.innerWidth;
  gameHeight = window.innerHeight;
  // Optymalizacja Poco F6: Cap DPR to 1.5 to prevent massive fill rate issues on 1.5k/2k OLED displays
  dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(gameWidth * dpr);
  canvas.height = Math.floor(gameHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false; // Optymalizacja wydajności (pikselowa grafika)
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const STATE = { START: 0, PLAYING: 1, LEVELUP: 2, GAMEOVER: 3, WIN: 4, PAUSED: 5, CHEST: 6 };
let gameState = STATE.START;

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

function initSplatterEngine() {
  splatterCtx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
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

function updateAndRenderGibs(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016); {
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

function updateAndRenderPowerUps(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016); {
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
let neededXP = 8;
let lowBatteryTimer = 0;
let coffeeDashCount = 0;

// Camera (Wider Field of View for tactical awareness)
const camera = { x: 0, y: 0, zoom: 0.50 };
function toggleZoom() {
  if (camera.zoom >= 0.58) camera.zoom = 0.50;
  else if (camera.zoom >= 0.48) camera.zoom = 0.40;
  else camera.zoom = 0.60;
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
  
bloodStains.push({
    x: x,
    y: y,
    color: col,
    radius: radius,
    rot: Math.random() * Math.PI * 2,
    life: 1.0
  });

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
  speed: 175,
  battery: 100,
  maxBattery: 100,
  radius: 14,
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
  isForklift: false,
  wantsForklift: false,
  stamina: 100,
  staminaLock: false,
  maxStamina: 100,
  regenRate: 0
};

// --- WEAPONS & PASSIVES ---
const weapons = {
  scanner: { level: 1, timer: 0, cooldown: 0.75, damage: 32, range: 450, pierce: 2, icon: '🔦', isEvo: false },
  toiletPaper: { level: 0, timer: 0, cooldown: 1.2, damage: 45, speed: 380, count: 2, icon: '🧻', isEvo: false },
  stretchAura: { level: 0, angle: 0, damage: 22, radius: 100, count: 2, icon: '🌀', isEvo: false },
  pallets: { level: 0, timer: 0, cooldown: 1.5, damage: 75, speed: 420, icon: '🪵', isEvo: false },
  extinguisher: { level: 0, timer: 0, cooldown: 2.2, damage: 40, range: 260, icon: '🧯', isEvo: false },
  zipTies: { level: 0, timer: 0, cooldown: 1.0, damage: 28, speed: 480, icon: '🔗', isEvo: false },
  cutter: { level: 0, timer: 0, cooldown: 0.55, damage: 18, speed: 560, icon: '🔪', isEvo: false },
  stapler: { level: 0, timer: 0, cooldown: 0.85, damage: 35, speed: 520, count: 3, icon: '📌', isEvo: false },
  sledgehammer: { level: 0, timer: 0, cooldown: 2.4, damage: 95, radius: 150, icon: '🔨', isEvo: false },
  faktura: { level: 0, timer: 0, cooldown: 1.8, damage: 60, speed: 450, icon: '📄', isEvo: false },
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
    spawnParticle(x, y, Math.cos(a) * s, Math.sin(a) * s, 0.4 + Math.random() * 0.3, Math.random() * 3.5 + 2, color);
  }
}

const MAX_FLOATING_TEXTS = 80;
const floatingTexts = [];
for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
  floatingTexts.push({ x: 0, y: 0, text: '', color: '#fff', life: 0, maxLife: 0.8, active: false });
}
function spawnDamageNumber(x, y, amount, isCrit = false) {
  const safeVal = isNaN(amount) || amount === undefined ? 10 : Math.round(amount);
  for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
    const ft = floatingTexts[i];
    if (!ft.active) {
      ft.x = x + (Math.random() * 20 - 10);
      ft.y = y + (Math.random() * 10 - 5);
      ft.text = safeVal;
      ft.color = isCrit ? '#ef4444' : '#fbbf24';
      ft.isCrit = isCrit;
      ft.life = 1.1;
      ft.maxLife = 1.1;
      ft.active = true;
      return;
    }
  }
}

// Room Database Cache
let roomScores = [];
let roomAchievements = [];

window.onRoomDataLoaded = function(data) {
  if (data.scores) { roomScores = data.scores; renderScoresTab(); }
  if (data.achievements) { roomAchievements = data.achievements; renderAchievementsTab(); }
};
window.onAndroidReady = function() {
  if (window.AndroidBridge && window.AndroidBridge.requestInitialData) {
    window.AndroidBridge.requestInitialData();
  }
};
if (window.AndroidBridge && window.AndroidBridge.requestInitialData) {
  window.AndroidBridge.requestInitialData();
}

const unlockedRunAchievements = new Set();

const ACHIEVEMENT_REWARDS = {
  first_blood: { text: '🎁 NAGRODA: +150 EXP', apply: () => { currentXP += 150; checkLevelUp(); } },
  coffee_addict: { text: '🎁 NAGRODA: Bateria 100% + 1000 Pkt', apply: () => { player.battery = player.maxBattery; score += 1000; } },
  combo_god: { text: '🎁 NAGRODA: Natychmiastowy Awans Awaryjny!', apply: () => { currentXP += neededXP; checkLevelUp(); } },
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

function createRackSprite() {
  const rw = 160;
  const rh = 360;
  rackCanvas = document.createElement('canvas');
  rackCanvas.width = rw + 16;
  rackCanvas.height = rh + 16;
  const rctx = rackCanvas.getContext('2d');
  
  // Soft ambient ground shadow
  rctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  rctx.fillRect(8, 8, rw, rh);

  // Rack Framework - Metallic Industrial Navy Steel
  rctx.fillStyle = '#0f172a';
  rctx.fillRect(0, 0, rw, rh);
  rctx.strokeStyle = '#0284c7';
  rctx.lineWidth = 2.5;
  rctx.strokeRect(0, 0, rw, rh);

  // Cross-bracing (Industrial X-frames)
  rctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  rctx.lineWidth = 1.5;
  for (let sy = 0; sy < rh; sy += 65) {
    rctx.beginPath();
    rctx.moveTo(0, sy); rctx.lineTo(rw, sy + 65);
    rctx.moveTo(rw, sy); rctx.lineTo(0, sy + 65);
    rctx.stroke();
  }

  // Wooden Pallet Levels & Box Cargo with edge highlights
  for (let sy = 24; sy < rh - 20; sy += 65) {
    // EPAL Wooden Beam
    rctx.fillStyle = '#b45309';
    rctx.fillRect(4, sy, rw - 8, 16);
    rctx.strokeStyle = '#f59e0b';
    rctx.lineWidth = 1;
    rctx.strokeRect(4, sy, rw - 8, 16);

    // Pallet Boxes (Brown / Gold cardboard)
    rctx.fillStyle = '#92400e';
    rctx.fillRect(12, sy - 26, 42, 26);
    rctx.strokeStyle = '#d97706';
    rctx.strokeRect(12, sy - 26, 42, 26);

    rctx.fillStyle = '#d97706';
    rctx.fillRect(62, sy - 32, 54, 32);
    rctx.strokeStyle = '#fbbf24';
    rctx.strokeRect(62, sy - 32, 54, 32);

    rctx.fillStyle = '#78350f';
    rctx.fillRect(124, sy - 22, 26, 22);

    // Hazard Stripes on corner uprights
    rctx.fillStyle = '#f59e0b';
    rctx.fillRect(0, sy, 5, 8);
    rctx.fillRect(rw - 5, sy, 5, 8);
  }
}

function createPalletStackSprite() {
  palletStackCanvas = document.createElement('canvas');
  palletStackCanvas.width = 64;
  palletStackCanvas.height = 64;
  const pctx = palletStackCanvas.getContext('2d');
  
  pctx.fillStyle = 'rgba(0,0,0,0.5)';
  pctx.fillRect(4, 4, 52, 52);

  // Stack of 4 EPAL Pallets top-down
  for (let i = 0; i < 4; i++) {
    const off = i * 2;
    pctx.fillStyle = i % 2 === 0 ? '#b45309' : '#d97706';
    pctx.fillRect(off, off, 48, 48);
    pctx.strokeStyle = '#78350f';
    pctx.lineWidth = 1.5;
    pctx.strokeRect(off, off, 48, 48);
    // Pallet boards
    pctx.fillStyle = '#78350f';
    pctx.fillRect(off + 6, off, 3, 48);
    pctx.fillRect(off + 23, off, 3, 48);
    pctx.fillRect(off + 40, off, 3, 48);
  }
  pctx.fillStyle = '#fef3c7';
  pctx.font = 'bold 8px sans-serif';
  pctx.fillText('EPAL', 14, 28);
}

createRackSprite();
createPalletStackSprite();

let warehouseDocks = [];
let warehouseStencils = [];
let warehousePuddles = [];
let warehouseLights = [];
let warehouseConveyors = [];
let warehouseHeaters = [];

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
    // Standard Hala Główna DTA Graniczna 8f
    for (let rx = 360; rx < ARENA_WIDTH - 360; rx += 520) {
      for (let ry = 420; ry < ARENA_HEIGHT - 380; ry += 600) {
        obstacles.push({ x: rx, y: ry, w: 160, h: 360, type: 'rack' });
      }
    }
    for (let rx = 160; rx < ARENA_WIDTH - 160; rx += 520) {
      for (let ry = 220; ry < ARENA_HEIGHT - 220; ry += 600) {
        obstacles.push({ x: rx, y: ry, w: 52, h: 52, type: 'pallet_stack' });
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
  extinguisher: { name: 'Gaśnica Ścienna CO2', icon: '🧯', hp: 25, radius: 18, color: '#06b6d4', border: '#cffafe' }
};

function initMapProps() {
  mapProps = [];
  const propTypes = ['coffee', 'crate', 'crate', 'firstaid', 'extinguisher'];
  const count = 30;
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
  screenShake = Math.max(screenShake, 5);
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
        damageEnemy(e, 75);
        e.slowTimer = 4.0;
        createSparks(e.x, e.y, 8, '#67e8f9');
      }
    });
    dropItems.push({ x: p.x, y: p.y, type: 'barcode_xp', val: 25, life: 25 });
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
  if (mapProps.length < 24) {
    const keys = ['coffee', 'crate', 'firstaid', 'extinguisher'];
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
  if (weapons.scanner.level >= 5 && passives.battery.level >= 1 && !weapons.scanner.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.bramkaRFID });
  if (weapons.toiletPaper.level >= 5 && passives.magnet.level >= 1 && !weapons.toiletPaper.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.owijarka });
  if (weapons.pallets.level >= 5 && passives.coffee.level >= 1 && !weapons.pallets.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.btHighStack });
  if (weapons.extinguisher.level >= 5 && passives.forks.level >= 1 && !weapons.extinguisher.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.zraszacz });
  if (weapons.zipTies.level >= 5 && passives.magnet.level >= 1 && !weapons.zipTies.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.steelTies });
  if (weapons.cutter.level >= 5 && passives.forks.level >= 1 && !weapons.cutter.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.machete });

  const upgradePool = [
    { cat: 'weapon', id: 'scanner', name: 'Skaner Kodów', icon: '🔦', desc: 'Większy promień i laser piercing.' },
    { cat: 'weapon', id: 'toiletPaper', name: 'Taśma Pakowa', icon: '🧻', desc: 'Dodatkowy pocisk i tempo ognia.' },
    { cat: 'weapon', id: 'stretchAura', name: 'Aura Strecz', icon: '🌀', desc: 'Większy promień wirującej folii.' },
    { cat: 'weapon', id: 'pallets', name: 'Ręczny Paleciak', icon: '🪵', desc: 'Większe obrażenia taranu EPAL.' },
    { cat: 'weapon', id: 'extinguisher', name: 'Gaśnica PPOŻ', icon: '🧯', desc: 'Szerszy stożek mrożenia.' },
    { cat: 'weapon', id: 'zipTies', name: 'Trytytki', icon: '🔗', desc: 'Szybszy miot taśm zaciskowych.' },
    { cat: 'weapon', id: 'cutter', name: 'Nóż Stanley', icon: '🔪', desc: 'Dodatkowe cięcie i obrażenia.' },
    { cat: 'passive', id: 'magnet', name: passives.magnet.name, icon: passives.magnet.icon, desc: '+75 Zasięgu Magnesu XP' },
    { cat: 'passive', id: 'forks', name: passives.forks.name, icon: passives.forks.icon, desc: '+12% Szansy na Krytyk' },
    { cat: 'passive', id: 'coffee', name: passives.coffee.name, icon: passives.coffee.icon, desc: '+18 Szybkości & Redukcja CD' },
    { cat: 'passive', id: 'battery', name: passives.battery.name, icon: passives.battery.icon, desc: '+35 Max Baterii & Regen' }
  ];

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

  const recipeList = [
    { name: 'Przemysłowa Bramka RFID', wep: 'scanner', wepIcon: '🔦', pass: 'battery', passIcon: '🔋', evoIcon: '📡' },
    { name: 'Automatyczna Owijarka', wep: 'toiletPaper', wepIcon: '🧻', pass: 'magnet', passIcon: '📜', evoIcon: '🌀' },
    { name: 'Wózek BT High-Stack', wep: 'pallets', wepIcon: '🪵', pass: 'coffee', passIcon: '🛢️', evoIcon: '🚜' },
    { name: 'System Zraszaczowy PPOŻ', wep: 'extinguisher', wepIcon: '🧯', pass: 'forks', passIcon: '📋', evoIcon: '❄️' },
    { name: 'Stalowe Trytytki', wep: 'zipTies', wepIcon: '🔗', pass: 'magnet', passIcon: '📜', evoIcon: '🔗' },
    { name: 'Ostrze Stanley Max', wep: 'cutter', wepIcon: '🔪', pass: 'forks', passIcon: '📋', evoIcon: '🔪' }
  ];

  recipeList.forEach(rec => {
    const hasWep = weapons[rec.wep].level >= 5;
    const hasPass = passives[rec.pass].level >= 1;
    const isEvo = weapons[rec.wep].isEvo;
    const isReady = hasWep && hasPass;

    const row = document.createElement('div');
    row.className = 'synergy-row' + (isReady || isEvo ? ' active' : '');
    
    let statusHtml = '';
    if (isEvo) {
      statusHtml = '<span style="color:#facc15; font-weight:900;">★ EWOLUOWANA</span>';
    } else if (isReady) {
      statusHtml = '<span style="color:#4ade80; font-weight:900;">GOTOWE DO AWANSU!</span>';
    } else {
      const wepTag = hasWep ? '✅' : `${weapons[rec.wep].level}/5`;
      const passTag = hasPass ? '✅' : '0/1';
      statusHtml = `<span style="color:#94a3b8;">${wepTag} + ${passTag}</span>`;
    }

    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:14px;">${rec.evoIcon}</span>
        <span style="font-weight:700; color:#f8fafc;">${rec.name}</span>
        <span style="font-size:10px; color:#94a3b8;">(${rec.wepIcon} + ${rec.passIcon})</span>
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
const joystickThumb = document.getElementById('joystick-thumb');
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
    badge: '📍 BRAMA 4B | 03:00',
    stamp: '🛑 KOSZMAR NA JAWIE',
    satire: '„Szefie, awizo mi się zmyło w praniu...”',
    alertTag: '⚠️ KRYZYS: 40 TIRÓW, JEDEN WÓZEK',
    alertType: 'warning',
    speaker: '🎙️ KIEROWNIK',
    color: '#facc15',
    text: 'Słuchaj uważnie! Prezes pojechał na Malediwy i obciął prąd na hali. Masz tu zostać do 7:00. Przed bramą stoi 40 ukraińskich tirów, a my mamy tylko jeden naładowany wózek BT!',
    sound: 'error'
  },
  {
    badge: '📍 STREFA ZWROTÓW | 03:15',
    stamp: '🔥 PROTOKÓŁ ZNISZCZENIA',
    satire: '„Ochrona słuchu to dla słabych.”',
    alertTag: '🚨 STATUS: INWAZJA AUDYTORÓW',
    alertType: 'danger',
    speaker: '🎙️ ZASTĘPCA',
    color: '#ef4444',
    text: 'Urząd Skarbowy i Państwowa Inspekcja Pracy przeprowadzają równoległy nalot z orbity! Celnicy sprawdzają każdą paczkę, a awaria chłodni zalała magazyn toksyczną kawą z automatu!',
    sound: 'beep'
  },
  {
    badge: '📍 REGAŁY WYSOKIEGO SKŁADOWANIA',
    stamp: '⚠️ ŚMIERĆ Z GÓRY',
    satire: '„Dziwne, na moim terminalu działa.”',
    alertTag: '🛑 SYSTEM WMS PŁONIE',
    alertType: 'danger',
    speaker: '🎙️ IT SUPPORT',
    color: '#38bdf8',
    text: 'Serwery leżą! Skanery przestały działać, więc musisz improwizować. Używaj owijarki ze streczem i ręcznego paleciaka żeby przetrwać. Magia magazynu.',
    sound: 'error'
  },
  {
    badge: '📍 STREFA VIP',
    stamp: '☠️ INSPEKTOR KAS NADCIĄGA',
    satire: '„Panie, to nie moje cło...”',
    alertTag: '🚨 KONTROLA SKARBOWA',
    alertType: 'warning',
    speaker: '🎙️ OCHRONA',
    color: '#facc15',
    text: 'Uwaga! Jeśli zobaczysz czerwoną strefę Rewizji Szczegółowej, masz 5 sekund by stamtąd uciec! Urząd Skarbowy nie bierze jeńców!',
    sound: 'bossAlert'
  },
  {
    badge: '📍 WÓZKI WIDŁOWE',
    stamp: '🚀 TRYB VAMPIRE SURVIVOR',
    satire: '„Mam na to uprawnienia... chyba.”',
    alertTag: '🔥 OVERTIME APOCALYPSE',
    alertType: 'danger',
    speaker: '🎙️ KIEROWNIK',
    color: '#ef4444',
    text: 'Zasady są proste: Rób uniki, uciekaj przed chmarą kartonów, a gdy pasek baterii się naładuje - odpalaj wózek BT i rozjeżdżaj ich wszystkich! JAZDA!',
    sound: 'achieve'
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
      
/* Mobile Responsive & Smooth Touch Scrolling for Modals */
.tab-content {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 120px);
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding-bottom: 30px;
}

.upgrade-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: 4px;
}

.pause-modal, .workshop-grid, .intro-modal, .chest-modal {
  touch-action: pan-y !important;
  -webkit-overflow-scrolling: touch !important;
}

#levelup-screen, #pause-screen, #chest-screen, #stage-transition-screen, #gameover-screen, #win-screen {
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
}


/* Enhanced Level-Up Card System Styling */
.levelup-modal-container {
  border-color: #38bdf8 !important;
  max-width: 520px;
  width: 92%;
  background: rgba(15, 23, 42, 0.98) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.95), 0 0 20px rgba(56, 189, 248, 0.3) !important;
  padding: 18px !important;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.levelup-modal-title {
  color: #38bdf8;
  font-size: 22px;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
  letter-spacing: 0.5px;
}

.levelup-modal-subtitle {
  color: #cbd5e1;
  font-size: 13px;
  margin: 4px 0 0 0;
}

.upgrade-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 58vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: 4px;
}

.upgrade-card {
  position: relative;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.99));
  border: 2px solid #38bdf8;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15);
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s, box-shadow 0.2s;
  animation: cardSlideIn 0.3s ease-out forwards;
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(15px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.upgrade-card:hover, .upgrade-card:active {
  transform: translateY(-2px) scale(1.02);
  border-color: #7dd3fc;
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

.upgrade-card.is-weapon {
  border-color: #38bdf8;
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.35), rgba(15, 23, 42, 0.98));
}

.upgrade-card.is-passive {
  border-color: #22c55e;
  background: linear-gradient(135deg, rgba(21, 128, 61, 0.35), rgba(15, 23, 42, 0.98));
}

.upgrade-card.is-passive:hover {
  border-color: #4ade80;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
}

.upgrade-card.is-evolution {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(180, 83, 9, 0.6), rgba(30, 58, 138, 0.95));
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), inset 0 1px 2px rgba(254, 240, 138, 0.4);
  animation: cardSlideIn 0.3s ease-out forwards, pulseGoldBorder 1.2s infinite alternate;
}

@keyframes pulseGoldBorder {
  0% { border-color: #f59e0b; box-shadow: 0 0 15px rgba(245, 158, 11, 0.5); }
  100% { border-color: #fde047; box-shadow: 0 0 30px rgba(250, 204, 21, 0.8); }
}

.upgrade-card.is-bonus {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(185, 28, 28, 0.35), rgba(15, 23, 42, 0.98));
}

.card-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
}

.card-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9));
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-header-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}

.card-badge {
  font-size: 9px;
  font-weight: 900;
  padding: 2px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-weapon { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.5); }
.badge-passive { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.5); }
.badge-evo { background: rgba(245, 158, 11, 0.3); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.8); }
.badge-bonus { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.5); }

.card-title {
  font-weight: 900;
  font-size: 14.5px;
  color: #f8fafc;
  letter-spacing: 0.3px;
}

.card-stars {
  font-size: 11px;
  color: #facc15;
  letter-spacing: 1px;
}

.card-level-tag {
  font-size: 10.5px;
  font-weight: 800;
  color: #facc15;
  background: rgba(0,0,0,0.5);
  padding: 1px 5px;
  border-radius: 4px;
}

.card-desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.3;
  font-weight: 500;
}

.card-stat-boost {
  font-size: 11px;
  font-weight: 700;
  margin-top: 1px;
}

.card-action-bar {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.btn-card-action {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 13px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
}

.btn-reroll {
  background: linear-gradient(135deg, #1e293b, #334155);
  color: #38bdf8;
  border: 1.5px solid #38bdf8;
}

.btn-reroll:hover {
  background: #334155;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.btn-reroll:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #64748b;
  color: #64748b;
}

.btn-skip {
  background: linear-gradient(135deg, #27272a, #3f3f46);
  color: #facc15;
  border: 1.5px solid #eab308;
}

.btn-skip:hover {
  background: #3f3f46;
  box-shadow: 0 0 12px rgba(234, 179, 8, 0.4);
}

</style>
    `;
  }


  // Update Dialogue Box
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
  sounds.init();
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, button, .tab-btn, .workshop-card, .upgrade-card, .char-card')) {
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
      joystickBase.style.left = t.clientX + 'px';
      joystickBase.style.top = t.clientY + 'px';
      joystickBase.style.display = 'block';
      joystickThumb.style.left = t.clientX + 'px';
      joystickThumb.style.top = t.clientY + 'px';
      joystickThumb.style.display = 'block';
    }
  }
}

function handleTouchMove(e) {
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, .workshop-grid, .upgrade-list, .char-card')) {
    return; // Allow UI scrolling in modals & menus!
  }
  if (e.cancelable) e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (touchState.active && t.identifier === touchState.id) {
      touchState.curX = t.clientX;
      touchState.curY = t.clientY;
      const dx = touchState.curX - touchState.startX;
      const dy = touchState.curY - touchState.startY;
      const dist = Math.hypot(dx, dy);
      const maxR = 55;
      if (dist < 4) {
        touchState.dirX = 0;
        touchState.dirY = 0;
        joystickThumb.style.left = touchState.startX + 'px';
        joystickThumb.style.top = touchState.startY + 'px';
      } else {
        const angle = Math.atan2(dy, dx);
        const clampDist = Math.min(dist, maxR);
        const norm = clampDist / maxR;
        touchState.dirX = Math.cos(angle) * norm;
        touchState.dirY = Math.sin(angle) * norm;
        joystickThumb.style.left = (touchState.startX + Math.cos(angle) * clampDist) + 'px';
        joystickThumb.style.top = (touchState.startY + Math.sin(angle) * clampDist) + 'px';
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
      joystickBase.style.display = 'none';
      joystickThumb.style.display = 'none';
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
  speechBubbles.push({ x, y, text, color, life: 1.8, maxLife: 1.8 });
}

// --- ENEMY CATALOG (Unique Visuals & Attacks) ---
const ENEMY_TYPES = {
  FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 85, radius: 15, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#cbd5e1', itemIcon: '🗞️', xp: 2, quotes: ['PRZYLEPIŁEM SIĘ!', 'ZROBIONY W BALONA!', 'OWIJAĆ CIĘ?!'] },
  FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 125, radius: 10, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#e2e8f0', itemIcon: '💨', xp: 1, quotes: ['ŁAP MNIE!', 'ODPRYSK STRECZU!'] },
  KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 80, radius: 12, renderType: 'pedestrian', color: '#d97706', clothColor: '#b45309', itemIcon: '📦', xp: 1, quotes: ['OSTRZEŻENIE: SZKŁO!', 'NIE RZUCAĆ!', 'GŁÓWNA SIEDZIBA B2C'] },
  KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 105, radius: 18, renderType: 'pedestrian', color: '#ef4444', clothColor: '#1e293b', itemIcon: '🚛', xp: 4, canDash: true, quotes: ['GDZIE MOJA KAWA?!', 'STOJĘ OD 4 RANO!', 'SZUKAM RAMPY 3!'] },
  WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 155, radius: 24, renderType: 'pedestrian', color: '#ea580c', clothColor: '#991b1b', itemIcon: '⚠️', xp: 8, straightLine: true, quotes: ['PISZCZY BATERIA!', 'HAMULCE NIE DZIAŁAJĄ!', 'SAD BEZ HOMOLOGACJI!'] },
  PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 55, radius: 28, renderType: 'pedestrian', color: '#78350f', clothColor: '#451a03', itemIcon: '🧱', xp: 10, armor: true, quotes: ['JESTEM ZAGADKĄ DTA!', 'EPAL BEZ PIECZĄTKI!'] },
  RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 40, radius: 35, renderType: 'pedestrian', color: '#475569', clothColor: '#0f172a', itemIcon: '🚧', xp: 15, directionalShield: true, quotes: ['RAMPA ZABLOKOWANA!', 'CZEKAJ NA SWOJĄ KOLEJ!'] },
  CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 70, radius: 16, renderType: 'pedestrian', color: '#dc2626', clothColor: '#7f1d1d', itemIcon: '🛑', xp: 5, shooter: true, quotes: ['KONTROLA DOKUMENTÓW SAD!', 'STÓJ! REWIZJA!', 'BRAK PIECZĄTKI KAS!'] },
  BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 75, radius: 30, renderType: 'pedestrian', color: '#ef4444', clothColor: '#000000', itemIcon: '🦅', xp: 500, mechanics: 'kas_zone', quotes: ['AUDYT SKARBOWY KAS!', 'POKAŻ DEKLARACJĘ VAT!', 'REWIZJA SZCZEGÓŁOWA!'] },
  BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 35, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 1000, mechanics: 'spawner', quotes: ['CAŁY MORSKI ŁADUNEK!', 'ZARAZ FAJRANT!'] },

  KURIER_DPD: { name: 'Spóźniony Kurier DPD', hp: 45, speed: 170, radius: 14, renderType: 'pedestrian', color: '#ef4444', clothColor: '#fca5a5', itemIcon: '📦', xp: 4, canDash: true, quotes: ['PRZESYŁKA AWIZOWANA!', 'NIE MAM CZASU!', 'RZUĆ TO!'] },
  BHP_INSPECTOR_SUPER: { isBoss: true, name: 'Główny Inspektor BHP', hp: 3500, speed: 65, radius: 28, renderType: 'pedestrian', color: '#f59e0b', clothColor: '#451a03', itemIcon: '📋', xp: 750, mechanics: 'kas_zone', quotes: ['BRAK KASKU!', 'KARA FINANSOWA!', 'PROSZĘ O PRZEPUSTKĘ!'] },
  ZLECENIE_NA_CITO: { name: 'Zlecenie na Cito', hp: 5, speed: 220, radius: 10, renderType: 'pedestrian', color: '#ffffff', clothColor: '#f8fafc', itemIcon: '📄', xp: 1, quotes: ['NA WCZORAJ!', 'BARDZO PILNE!'] },
  PALECIAK_REZYGNACJI: { name: 'Rzucony Paleciak', hp: 60, speed: 140, radius: 22, renderType: 'pedestrian', color: '#475569', clothColor: '#1e293b', itemIcon: '🛒', xp: 6, straightLine: true, quotes: ['ZWALNIAM SIĘ!', 'NIE CHCE MI SIĘ!'] },

  JADZIA_KSIEGOWOSC: { name: 'Pani Jadzia z Księgowości', hp: 110, speed: 65, radius: 18, renderType: 'pedestrian', color: '#ec4899', clothColor: '#fbcfe8', itemIcon: '☕', xp: 8, shooter: true, quotes: ['PRZERWA KAWOWA!', 'FAKTURA BEZ NIP-U!', 'KTO TO PODPISAŁ?!'] },
  JUNGHEINRICH_SZALENIEC: { name: 'Młody na Jungheinrichu', hp: 180, speed: 195, radius: 25, renderType: 'reach_truck', color: '#facc15', itemIcon: '🏎️', xp: 12, canDash: true, quotes: ['BOKIEM PO RAMPART!', 'BEZ UDT ALE SZYBKO!', 'Z DROGI!'] },
  INWENTARYZACJA: { name: 'Roczna Inwentaryzacja', hp: 380, speed: 45, radius: 32, renderType: 'pedestrian', color: '#94a3b8', clothColor: '#334155', itemIcon: '📊', xp: 20, special: 'split_on_death', quotes: ['SPIS Z NATURY!', 'MANKO NA WAREHOUSE!', 'SZUKAMY 100 PALET!'] },
  BOSS_PREZES_WIZYTACJA: { isBoss: true, name: 'Prezes Zarządu na Wizytacji', hp: 10000, speed: 70, radius: 45, renderType: 'boss_bhp', color: '#f59e0b', clothColor: '#000000', itemIcon: '👔', xp: 1500, mechanics: 'kas_zone', quotes: ['DLACZEGO CI KIEROWCY STOJĄ?!', 'AUDYT LOGISTYCZNY!', 'WYSKOKIE KPI ALBO ZWOLNIENIA!'] },

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
    xp: 25,
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
    xp: 18,
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
    bossTime: 120, // 2:00
    spawnPool: ['KARTON_B2C', 'FOLIA', 'PRAKTYKANT', 'KLAPKI', 'KURIER', 'DWIE_PALETY_BUS', 'KURIER_DPD', 'JADZIA_KSIEGOWOSC'],
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
    bossTime: 240, // 4:00
    spawnPool: ['PALETA_KAM', 'WIESLAW_REACH', 'UKRAINA_EKIPA', 'TASMA', 'WOZEK_AWARIA', 'DWIE_PALETY_BUS', 'ZLECENIE_NA_CITO', 'JUNGHEINRICH_SZALENIEC'],
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
    bossTime: 360, // 6:00
    spawnPool: ['CELNIK', 'AUDYTOR', 'SPEDYTOR', 'AWIZO', 'RAMPA', 'KIEROWCA_TIR'],
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
    bossTime: 480, // 8:00
    spawnPool: ['FOLIA_MALA', 'WOZEK_AWARIA', 'KURIER', 'DWIE_PALETY_BUS', 'KLAPKI', 'PALETA_KAM'],
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
    bossTime: 600, // 10:00
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

let spawnedBossSectors = [false, false, false, false, false];
const MAX_ENEMIES_CAP = 250;

function spawnEnemyAt(typeKey, ex, ey, isBoss = false) {
  const t = ENEMY_TYPES[typeKey];
  if (!t) return;

  const enemy = {
    x: Math.max(50, Math.min(ARENA_WIDTH - 50, ex)),
    y: Math.max(50, Math.min(ARENA_HEIGHT - 50, ey)),
    vx: 0,
    vy: 0,
    type: typeKey,
    info: t,
    hp: t.hp * (1 + (playerLevel - 1) * 0.10 + currentSectorIndex * 0.22),
    maxHp: t.hp * (1 + (playerLevel - 1) * 0.10 + currentSectorIndex * 0.22),
    isBoss: !!isBoss,
    quoteTimer: Math.random() * 5 + 3,
    actionTimer: 0,
    hitFlash: 0,
    slowTimer: 0,
    dead: false
  };

  enemies.push(enemy);

  if (isBoss) {
    activeBoss = enemy;
    showBossTopBar(t.name);
    sounds.bossAlert();
    screenShake = 12;
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

// Tuned enemy wave spawner with clear flank groups and density limits (Vampire Survivors style)
function spawnBatchByTime(currentMinutes) {
  if (enemies.length >= MAX_ENEMIES_CAP) return;

  const sec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[0];
  const pool = sec.spawnPool;
  if (!pool || pool.length === 0) return;

  // Scale batch size smoothly from 2-3 early up to 5-6 later in the sector
  const progressInSector = Math.min(1.0, (gameTime % 120) / 120);
  const baseBatchSize = Math.floor(4 + progressInSector * 10.0 + Math.random() * 5.0);
  const batchCount = Math.min(baseBatchSize, MAX_ENEMIES_CAP - enemies.length);

  // Group spawning from a cohesive flank for readable silhouettes
  const baseAngle = Math.random() * Math.PI * 2;
  const pickedType = pool[Math.floor(Math.random() * pool.length)];
  const viewRadius = (Math.max(gameWidth, gameHeight) / (2 * camera.zoom));

  for (let i = 0; i < batchCount; i++) {
    const angleSpread = (i - batchCount / 2) * 0.22;
    const spawnAngle = baseAngle + angleSpread;
    const dist = viewRadius + 110 + (Math.random() * 70);
    const ex = player.x + Math.cos(spawnAngle) * dist;
    const ey = player.y + Math.sin(spawnAngle) * dist;

    const typeKey = (i > 0 && Math.random() < 0.25) ? pool[Math.floor(Math.random() * pool.length)] : pickedType;
    spawnEnemyAt(typeKey, ex, ey);
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
  } else {
    document.getElementById('boss-hp-container').style.display = 'none';
    activeBoss = null;
  }
}

// --- LEVEL UP & EVOLUTION POOL ---
function checkLevelUp() {
  if (currentXP >= neededXP) {
    currentXP -= neededXP;
    playerLevel++;
    neededXP = Math.floor(neededXP * 1.15 + 3);
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
    weapons.scanner.damage += 15;
  } else if (cardId === 'toilet_paper_active' && weapons.toiletPaper) {
    weapons.toiletPaper.level++;
    weapons.toiletPaper.count += 2;
  } else if (cardId === 'stretch_aura_active' && weapons.folia) {
    weapons.folia.level++;
    weapons.folia.count++;
  } else if (cardId === 'pallet_truck_active' && weapons.pallets) {
    weapons.pallets.level++;
    weapons.pallets.damage += 30;
  } else if (cardId === 'extinguisher_active' && weapons.extinguisher) {
    weapons.extinguisher.level++;
    weapons.extinguisher.damage += 18;
  } else if (cardId === 'zip_ties_active' && weapons.trytytki) {
    weapons.trytytki.level++;
    weapons.trytytki.count++;
  } else if (cardId === 'cutter_active' && weapons.noz) {
    weapons.noz.level++;
    weapons.noz.pierce++;
    weapons.noz.damage += 15;
  } else if (cardId === 'stapler_active' && weapons.zszywacz) {
    weapons.zszywacz.level++;
    weapons.zszywacz.count += 2;
  } else if (cardId === 'sledgehammer_active' && weapons.mlot) {
    weapons.mlot.level++;
    weapons.mlot.damage += 40;
  } else if (cardId === 'faktura_active' && weapons.faktura) {
    weapons.faktura.level++;
    weapons.faktura.count++;
  } else if (cardId === 'kawa_active' && weapons.kawa) {
    weapons.kawa.level++;
    weapons.kawa.radius += 30;
  } else if (cardId === 'hydrant_active' && weapons.hydrant) {
    weapons.hydrant.level++;
    weapons.hydrant.damage += 40;
  } else if (cardId === 'megafon_active' && weapons.megafon) {
    weapons.megafon.level++;
    weapons.megafon.damage += 25;
  }
  
  // 🛡️ PASSIVE BUFFS
  else if (cardId === 'iso_cert_passive' && passives.magnet) {
    passives.magnet.level++;
    player.magnetRange += 75;
  } else if (cardId === 'safety_bhp_passive' && passives.protokol_bhp) {
    passives.protokol_bhp.level++;
    player.ramDamageMult = (player.ramDamageMult || 1.0) + 0.4;
  } else if (cardId === 'synthetic_oil_passive' && passives.smar_syntetyczny) {
    passives.smar_syntetyczny.level++;
    player.speed += 25;
  } else if (cardId === 'super_battery_passive' && passives.battery) {
    passives.battery.level++;
    player.maxBattery += 35;
    player.battery = Math.min(player.maxBattery, player.battery + 40);
  } else if (cardId === 'furia_passive' && passives.furia) {
    passives.furia.level++;
    player.attackSpeedMult = (player.attackSpeedMult || 1.0) * 1.25;
  } else if (cardId === 'alkomat_passive' && passives.unik_alkomat) {
    passives.unik_alkomat.level++;
    player.dodgeChance = (player.dodgeChance || 0) + 0.15;
  } else if (cardId === 'stoperan_passive' && passives.stoperan) {
    passives.stoperan.level++;
    player.maxBattery += 30;
    player.battery = Math.min(player.maxBattery, player.battery + 30);
  } else if (cardId === 'safety_shoes_passive' && passives.buty_robocze) {
    passives.buty_robocze.level++;
    player.thorns = (player.thorns || 0) + 25;
  } else if (cardId === 'multisport_passive' && passives.karta_multisport) {
    passives.karta_multisport.level++;
    player.speed += 15;
  } else if (cardId === 'paczek_passive' && passives.paczek) {
    passives.paczek.level++;
    player.critChance = (player.critChance || 0) + 0.20;
  } else if (cardId === 'kamizelka_passive' && passives.kamizelka) {
    passives.kamizelka.level++;
    player.damageReduction = (player.damageReduction || 0) + 0.25;
  } else if (cardId === 'umowa_passive' && passives.umowa) {
    passives.umowa.level++;
    player.extraLives = (player.extraLives || 0) + 1;
  }

  // ⚡ GOLDEN EVOLUTIONS
  else if (cardId === 'bramka_rfid_evo' && weapons.scanner) {
    weapons.scanner.evolved = true;
    weapons.scanner.damage = 100;
  } else if (cardId === 'owijarka_evo' && weapons.toiletPaper) {
    weapons.toiletPaper.evolved = true;
    weapons.toiletPaper.damage = 60;
  } else if (cardId === 'bt_highstack_evo' && weapons.pallets) {
    weapons.pallets.evolved = true;
    weapons.pallets.damage = 90;
  } else if (cardId === 'zraszacz_evo' && weapons.extinguisher) {
    weapons.extinguisher.evolved = true;
    weapons.extinguisher.damage = 150;
  } else if (cardId === 'steel_ties_evo' && weapons.trytytki) {
    weapons.trytytki.evolved = true;
    weapons.trytytki.damage = 60;
  } else if (cardId === 'machete_evo' && weapons.noz) {
    weapons.noz.evolved = true;
    weapons.noz.damage = 45;
  } else if (cardId === 'stapler_gun_evo' && weapons.zszywacz) {
    weapons.zszywacz.evolved = true;
    weapons.zszywacz.damage = 70;
  } else if (cardId === 'hydraulic_hammer_evo' && weapons.mlot) {
    weapons.mlot.evolved = true;
    weapons.mlot.damage = 180;
  } else if (cardId === 'urzad_skarbowy_evo' && weapons.faktura) {
    weapons.faktura.evolved = true;
    weapons.faktura.damage = 120;
  } else if (cardId === 'redbull_evo' && weapons.kawa) {
    weapons.kawa.evolved = true;
    weapons.kawa.damage = 60;
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
  if (window.AndroidBridge && window.AndroidBridge.triggerComposeLevelUp) {
    window.AndroidBridge.triggerComposeLevelUp(player.level);
  }
  gameState = STATE.LEVELUP;
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
      options.push({ type: 'evolution', evo: evo });
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
      card.onclick = () => { applyEvolution(opt.evo); closeLevelUp(); };
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
      card.onclick = () => { applyBonusUpgrade(opt); closeLevelUp(); };
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
        </div>
      `;
      card.onclick = () => { applyUpgrade(opt); closeLevelUp(); };
    }

    container.appendChild(card);
  });

  document.getElementById('levelup-screen').style.display = 'flex';
}

function rerollLevelUpCards() {
  if (player.rerolls > 0) {
    player.rerolls--;
    sounds.beep();
    triggerLevelUpModal(true);
  }
}

function skipLevelUpCard() {
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
  document.getElementById('levelup-screen').style.display = 'none';
  gameState = STATE.PLAYING;
  updateWeaponsHud();
}

function applyEvolution(evo) {
  sounds.evoSound();
  screenShake = 12;
  createSparks(player.x, player.y, 40, '#f59e0b');
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
  if (opt.cat === 'weapon') {
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
    if (opt.id === 'forks') player.critChance += 0.12;
    if (opt.id === 'coffee') { player.speed += 18; player.maxSkillCooldown = Math.max(3.5, player.maxSkillCooldown - 1.0); }
    if (opt.id === 'battery') { player.maxBattery += 35; player.battery = Math.min(player.maxBattery, player.battery + 40); }
    if (opt.id === 'furia') player.attackSpeedMult = (player.attackSpeedMult || 1.0) + 0.25;
    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;
    if (opt.id === 'stoperan') { player.maxBattery += 30; player.battery += 30; }
    if (opt.id === 'buty_robocze') player.thorns = (player.thorns || 0) + 20;
    if (opt.id === 'karta_multisport') { player.staminaRegenMult = (player.staminaRegenMult || 1) + 0.3; player.speed += 10; }
    if (opt.id === 'paczek') { player.critChance += 0.20; player.foodDropBoost = (player.foodDropBoost || 0) + 0.25; }
    if (opt.id === 'kamizelka') { player.damageReduction = (player.damageReduction || 0) + 0.25; }
    if (opt.id === 'umowa') { player.xpBonusMult = (player.xpBonusMult || 1.0) + 0.25; }
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
      takeDamage(e, dmg);
      spawnDamageText(e.x, e.y - 20, dmg, '#78350f', true);
    }
  }
}

function fireStapler() {
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
  screenShake = Math.max(screenShake, 8);
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

function fireZipTies() {
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

function fireCutter() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.cutter.isEvo ? 4 : 2;
  for (let i = 0; i < count; i++) {
    let target = enemies[Math.floor(Math.random() * enemies.length)];
    let angle = Math.atan2(target.y - player.y, target.x - player.x) + (Math.random()-0.5)*0.5;
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

function fireToiletPaper() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.toiletPaper.isEvo ? 8 : weapons.toiletPaper.count;
  for (let i = 0; i < count; i++) {
    const angle = weapons.toiletPaper.isEvo 
      ? (i * (Math.PI * 2 / count))
      : player.angle + (Math.random() - 0.5) * 1.2;
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
        projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: e.x, y2: e.y, life: 0.15, color: '#ef4444' });
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
  if (enemies.length === 0) return;
  let target = null;
  let minDistSq = 500 * 500;
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.dead) continue;
    const distSq = (e.x - player.x) * (e.x - player.x) + (e.y - player.y) * (e.y - player.y);
    if (distSq < minDistSq) { minDistSq = distSq; target = e; }
  }
  if (!target) return;
  const a = Math.atan2(target.y - player.y, target.x - player.x);

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

function damageEnemy(e, amount) {
  if (isNaN(amount) || amount === undefined) amount = 15;
  const isCrit = Math.random() < player.critChance;
  let dmg = isCrit ? amount * 1.75 : amount;
  if (player.damageMult && !isNaN(player.damageMult)) dmg *= player.damageMult;
  if (isNaN(dmg)) dmg = amount;
  
  if (isCrit || e.isBoss) {
      hitStopTimer = 0.025; // 25ms hit-stop
      screenShake = Math.max(screenShake, 4);
  }
  
  if (e.info.armor) dmg *= 0.3; // 70% damage reduction
  if (player.thorns && player.thorns > 0) {
      damageEnemy(e, player.thorns);
      createSparks(e.x, e.y, 10, '#facc15');
  }
  if (e.info.directionalShield) {
     dmg *= 0.5; 
  }
  
  e.hp -= dmg;
  e.hitFlash = 0.12;
  spawnDamageNumber(e.x, e.y, dmg, isCrit);
  
  // Blood splatter on hit
  const hitParticles = isCrit ? 6 : 2;
  for (let i = 0; i < hitParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    spawnParticle(e.x, e.y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.3 + Math.random() * 0.2, Math.random() * 2.5 + 1, e.info.color || '#991b1b');
  }

  if (e.hp <= 0 && !e.dead) {
    killEnemy(e);
  }
}

function killEnemy(e) {
  trySpawnPowerUp(e.x, e.y);
  spawnGibs(e.x, e.y, e.isBoss ? 16 : 6, e.info ? e.info.name : 'default');
  e.dead = true;
  kills++;
  comboCount++;
  comboTimer = 3.5;
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
    dropItems.push({ x: e.x, y: e.y, type: 'lucky_chest', val: 3, life: 60 });
    dropItems.push({ x: e.x + 25, y: e.y + 10, type: 'dta_coin', val: 100, life: 60 });
    window.timeScale = 0.15; // Massive cinematic slow-mo!
    screenShake = 20;
  } else if (rand < 0.035 || (e.info.hp >= 120 && Math.random() < 0.25)) {
    dropItems.push({ x: e.x, y: e.y, type: 'lucky_chest', val: 1, life: 45 });
  } else if (rand < 0.10) {
    dropItems.push({ x: e.x, y: e.y, type: 'dta_coin', val: 20 + Math.floor(Math.random() * 20), life: 30 });
  } else if (rand < 0.12) {
    dropItems.push({ x: e.x, y: e.y, type: 'mystery_box', life: 40 });
  } else if (rand < 0.14) { dropItems.push({ x: e.x, y: e.y, type: 'pizza_szefa', life: 30 }); } else if (rand < 0.18) {
    dropItems.push({ x: e.x, y: e.y, type: 'hotdog', life: 20 });
  } else if (rand < 0.21) {
    dropItems.push({ x: e.x, y: e.y, type: 'kinder_bueno', life: 20 });
  } else if (rand < 0.26) {
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
  
  if (hitStopTimer > 0) {
    hitStopTimer -= dt;
    return; // Frame freeze for juiciness
  }
  
  gameTime += dt;

  // Check Sector Boss Spawning every 2 minutes (120s)
  for (let s = 0; s < WAREHOUSE_SECTORS.length; s++) {
    const sec = WAREHOUSE_SECTORS[s];
    if (gameTime >= sec.bossTime && !spawnedBossSectors[s] && currentSectorIndex === s) {
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
  } else if (gameTime < curSec.bossTime) {
    const secLeft = Math.max(0, Math.ceil(curSec.bossTime - gameTime));
    const m = Math.floor(secLeft / 60);
    const s = secLeft % 60;
    bossCountdownStr = `${m}:${s < 10 ? '0' : ''}${s}`;
  } else {
    bossCountdownStr = '🚨 BOSS PRZYBYŁ!';
  }
  const sectorBadge = document.getElementById('badge-sector');
  if (sectorBadge) {
    sectorBadge.innerText = `📍 SEKTOR ${curSec.id} | ⏰ BOSS: ${bossCountdownStr}`;
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
  // Stamina-based Forklift mechanic
  let canForklift = (player.wantsForklift && player.stamina > 0 && !player.staminaLock);
  if (canForklift && !player.isForklift && player.stamina < 20) {
     player.staminaLock = true;
     canForklift = false;
  }

  if (canForklift) {
    if (!player.isForklift) {
      player.isForklift = true;
      player.radius = 22;
      sounds.dash();
      addSpeechBubble(player.x, player.y - 30, '🚜 WÓZEK BT!', '#facc15');
    }
    // Deplete stamina (lasts ~3 seconds of continuous use)
    player.stamina -= dt * 33; 
    if (player.stamina <= 0) {
      player.stamina = 0;
      player.isForklift = false;
      player.staminaLock = true;
      player.radius = 14;
      createSparks(player.x, player.y, 25, '#94a3b8');
    }
  } else {
    if (player.isForklift) {
      player.isForklift = false;
      player.radius = 14;
      createSparks(player.x, player.y, 15, '#94a3b8');
    }
    // Recharge stamina (takes ~6 seconds to fully recharge)
    player.stamina += dt * 16 * (player.staminaRegenMult || 1.0);
    if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;
    if (player.stamina >= 20) player.staminaLock = false;
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

    const targetAngle = Math.atan2(normY, normX);
    let diff = targetAngle - player.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    player.angle += diff * (1 - Math.exp(-22.0 * dt));

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

  const accelFactor = 1 - Math.exp((moveLen > 0.05 ? -14.0 : -18.0) * dt);
  player.vx += (targetVx - player.vx) * accelFactor;
  player.vy += (targetVy - player.vy) * accelFactor;
player.x += player.vx * dt;
  player.y += player.vy * dt;

  // Obstacle collisions (Racks, Pallets, ToiToi)
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
      
      if (distance > 0) {
        player.x += (distX / distance) * overlap;
        player.y += (distY / distance) * overlap;
      } else {
        player.x -= player.vx * dt;
        player.y -= player.vy * dt;
      }
      
      // Spawn sparks if hit hard enough
      if (speed > 150) {
         createSparks(testX, testY, Math.floor(speed / 30), '#fbbf24');
         if (speed > 300) screenShake = Math.max(screenShake, 3);
      }
      
      // Kill momentum towards wall
      player.vx *= 0.5;
      player.vy *= 0.5;
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
  if (player.goldenForkliftTimer > 0) {
      player.goldenForkliftTimer -= dt;
      player.stamina = player.maxStamina;
      player.speed = 320;
      createSparks(player.x, player.y, 2, '#facc15');
      // Ram enemies automatically
      enemies.forEach(en => {
         if (Math.hypot(en.x - player.x, en.y - player.y) < player.radius + en.radius + 15) {
             damageEnemy(en, 300);
             createSparks(en.x, en.y, 15, '#facc15');
             screenShake = Math.max(screenShake, 4);
         }
      });
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
  if (spawnClock >= Math.max(0.9, 1.6 - (gameTime / TOTAL_SHIFT_DURATION) * 0.7)) {
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

    // Touch Player Collision
    if (dist < player.radius + e.info.radius) {
      if (player.isDashing || weapons.pallets.isEvo) {
        damageEnemy(e, weapons.pallets.isEvo ? 80 : 140);
        createSparks(e.x, e.y, 10, '#f97316');
        if (weapons.pallets.isEvo && !e.isBoss) e.dead = true; // Auto kill small enemies when evo
      } else if (player.invulnTimer <= 0) {
        if (player.dodgeChance && Math.random() < player.dodgeChance) {
          spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
          player.invulnTimer = 0.2;
        } else {
          sounds.hit();
          player.invulnTimer = 0.6;
          screenShake = 5;
          const dmg = e.isBoss ? 16 : 8;
          player.battery = Math.max(0, player.battery - dmg);
          if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(40);
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
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 18) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 6, '#d97706');
          p.life = 0;
          break;
        }
      }
    } else if (p.type === 'gas_cloud') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.radius = Math.min(p.maxRadius, p.radius + dt * 30);
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
          damageEnemy(e, p.damage * dt * 2.5);
          e.slowTimer = 3.5;
        }
      }
    } else if (p.type === 'metal_bb') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 8) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 6, '#cbd5e1');
          sounds.beep();
          p.pierce = (p.pierce || 3) - 1;
          if (p.pierce <= 0) { p.life = 0; break; }
        }
      }
    } else if (p.type === 'oil_trail') {
      if (Math.random() < 0.2) {
        for (let j = 0; j < enemies.length; j++) {
           if (enemies[j].dead) continue;
           if (Math.hypot(enemies[j].x - p.x, enemies[j].y - p.y) < 30) {
              damageEnemy(enemies[j], p.damage);
              enemies[j].slowTimer = 2.0;
           }
        }
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
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 12) {
          damageEnemy(e, p.damage);
          e.slowTimer = p.isEvo ? 6.0 : 4.0;
          createSparks(p.x, p.y, 4, '#38bdf8');
          p.life = 0; break;
        }
      }
    } else if (p.type === 'cutter') {
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot = (p.rot || 0) + 20.0 * dt;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 10) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 8, '#f43f5e');
          p.pierce = (p.pierce || 0) + 1;
          if (p.pierce > (p.isEvo ? 6 : 2)) p.life = 0;
        }
      }
    } else if (p.type === 'toilet_paper') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.96, dt * 60);
      p.vy *= Math.pow(0.96, dt * 60);
      p.rot = (p.rot || 0) + 14.0 * dt;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 14) {
          if (p.isEvo) {
             damageEnemy(e, p.damage * 2);
             createSparks(e.x, e.y, 16, '#fef08a');
             e.stunTimer = 3.0;
          } else {
             damageEnemy(e, p.damage);
             e.slowTimer = 1.8;
          }
          createSparks(p.x, p.y, 8, '#f8fafc');
          p.life = 0;
          break;
        }
      }
    } else if (p.type === 'box_mortar') {
      p.progress += dt * p.speed;
      if (p.progress >= 1) {
        sounds.pallet();
        createSparks(p.targetX, p.targetY, 20, '#f59e0b');
        for (let j = 0; j < enemies.length; j++) {
          const e = enemies[j];
          if (e.dead) continue;
          if (Math.hypot(e.x - p.targetX, e.y - p.targetY) < 110) {
            damageEnemy(e, p.damage);
          }
        }
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
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (!p.hitList) p.hitList = [];
        if (p.hitList.includes(e.id)) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 15) {
          takeDamage(e, p.damage);
          p.hitList.push(e.id);
          spawnParticle(p.x, p.y, -p.vx * 0.2, -p.vy * 0.2, 0.2, 2, '#fff');
          p.pierce--;
          if (p.pierce <= 0) { hit = true; break; }
        }
      }
      if (hit) projectiles.splice(i, 1);
    } else if (p.type === 'faktura') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-10, -14, 20, 28);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 8px Arial';
      ctx.fillText('KOREKTA', -9, -4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, 2, 16, 2);
      ctx.fillRect(-8, 6, 12, 2);
      ctx.restore();
    } else if (p.type === 'staple') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot = (p.rot || 0);
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 8) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 4, p.isEvo ? '#f59e0b' : '#38bdf8');
          p.life = 0;
          break;
        }
      }
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
            showAnnouncement("⚡ EKSTRA LEVEL UP!", "#22c55e");
            currentXP += neededXP;
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
        addSpeechBubble(player.x, player.y - 25, '🍕 PIZZA OD SZEFA! LEVEL UP!', '#ef4444');
        currentXP += neededXP;
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
      }

      dropItems.splice(i, 1);
      continue;
    }
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
    }
  }

  // Update Speech Bubbles
  for (let i = speechBubbles.length - 1; i >= 0; i--) {
    speechBubbles[i].life -= dt;
    speechBubbles[i].y -= dt * 6;
    if (speechBubbles[i].life <= 0) speechBubbles.splice(i, 1);
  }

  // Update DOM HUD
  document.getElementById('badge-battery').innerText = `⚡ ${Math.ceil((player.battery / player.maxBattery) * 100)}%`;
  document.getElementById('badge-battery').className = 'stat-badge badge-battery' + (player.battery < 20 ? ' low' : '');
  document.getElementById('badge-clock').innerText = `🕒 ${timeStr}`;

  const totalCombo = Math.max(comboCount, packageCombo);
  const currentMult = (1 + packageCombo * 0.15).toFixed(1);
  const comboBadge = document.getElementById('badge-combo');
  if (packageCombo > 0) {
    comboBadge.innerText = `🔥 COMBO x${totalCombo} (${currentMult}x PKT)`;
    comboBadge.className = 'stat-badge badge-combo' + (packageCombo >= 15 ? ' hyper' : packageCombo >= 5 ? ' turbo' : '');
  } else {
    comboBadge.innerText = `🔥 COMBO x${Math.max(1, comboCount)}`;
    comboBadge.className = 'stat-badge badge-combo';
  }

  document.getElementById('badge-lvl').innerText = `⭐ LVL ${playerLevel}`;
  document.getElementById('badge-kills').innerText = `💀 ${kills}`;
  document.getElementById('xp-fill').style.width = `${Math.min(100, (currentXP / neededXP) * 100)}%`;

  updateBossTopBar();
}

function spawnBatchByTime(minutes) {
  const sec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[0];
  const batchSize = Math.min(8, 2 + Math.floor(gameTime / 35) + currentSectorIndex);
  for (let i = 0; i < batchSize; i++) {
    const pool = sec.spawnPool;
    const type = pool[Math.floor(Math.random() * pool.length)];
    spawnEnemy(type);
  }
}

// --- RENDER PASS (ULTRA HIGH FIDELITY WAREHOUSE GRAPHICS) ---
function render() {
  const sec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[0];
  ctx.save();
  ctx.fillStyle = sec.floorColor;
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  const viewW = gameWidth / camera.zoom;
  const viewH = gameHeight / camera.zoom;
  const fontScale = 1.0 / camera.zoom;

  // Apply Camera Zoom & Shake & Translation
  ctx.scale(camera.zoom, camera.zoom);
  const shakeX = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  const shakeY = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

  // 1. Draw High-Contrast Epoxy Warehouse Floor Grid with Sector Styling
  ctx.strokeStyle = sec.gridColor;
  ctx.lineWidth = 1.2;
  const startX = Math.floor(camera.x / 120) * 120;
  const startY = Math.floor(camera.y / 120) * 120;
  for (let x = startX; x < camera.x + viewW + 120; x += 120) {
    ctx.beginPath(); ctx.moveTo(x, camera.y); ctx.lineTo(x, camera.y + viewH); ctx.stroke();
  }
  for (let y = startY; y < camera.y + viewH + 120; y += 120) {
    ctx.beginPath(); ctx.moveTo(camera.x, y); ctx.lineTo(camera.x + viewW, y); ctx.stroke();
  }

  // 2. Overhead Industrial Fluorescent Light Cones
  for (let i = 0; i < warehouseLights.length; i++) {
    const l = warehouseLights[i];
    if (l.x > camera.x - 180 && l.x < camera.x + viewW + 180 && l.y > camera.y - 180 && l.y < camera.y + viewH + 180) {
      const lampGrad = ctx.createRadialGradient(l.x, l.y, 10, l.x, l.y, 150);
      const intensity = 0.09 + Math.sin(gameTime * 3 + (l.flicker || 0) * 10) * 0.025;
      let parsedColor = `rgba(56, 189, 248, ${intensity})`;
      if (l.color && l.color.startsWith('#')) {
        let h = l.color;
        let r = parseInt(h.slice(1, 3), 16) || 255;
        let g = parseInt(h.slice(3, 5), 16) || 255;
        let b = parseInt(h.slice(5, 7), 16) || 255;
        parsedColor = `rgba(${r}, ${g}, ${b}, ${intensity})`;
      } else if (l.color) {
        parsedColor = l.color.replace('rgb(', 'rgba(').replace(')', `, ${intensity})`).replace('rgbaa', 'rgba');
      }
      lampGrad.addColorStop(0, parsedColor);
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath(); ctx.arc(l.x, l.y, 150, 0, Math.PI * 2); ctx.fill();
    }
  }

  // 3. Coolant & Hydraulic Oil Puddles (Iridescent Sheen)
  for (let i = 0; i < warehousePuddles.length; i++) {
    const pud = warehousePuddles[i];
    if (pud.x > camera.x - 100 && pud.x < camera.x + viewW + 100 && pud.y > camera.y - 60 && pud.y < camera.y + viewH + 60) {
      ctx.fillStyle = pud.color;
      ctx.beginPath();
      ctx.ellipse(pud.x, pud.y, pud.rx, pud.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // 3.4. Crimsonland Permanent Splatter Canvas (0 Extra Draw Calls)
  if (typeof splatterCanvas !== 'undefined') {
    ctx.drawImage(splatterCanvas, 0, 0);
  }
  updateAndRenderGibs(dt, ctx);
  updateAndRenderPowerUps(dt, ctx);
  updateAndRenderEnvironment(dt, ctx);
  
  // 3.5. Crimsonland Blood & Epoxy Stains
  for (let i = 0; i < bloodStains.length; i++) {
    const bs = bloodStains[i];
    if (bs.x > camera.x - 60 && bs.x < camera.x + viewW + 60 && bs.y > camera.y - 60 && bs.y < camera.y + viewH + 60) {
      ctx.save();
      ctx.translate(bs.x, bs.y);
      ctx.rotate(bs.rot);
      ctx.fillStyle = bs.color;
      ctx.globalAlpha = bs.life * 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, bs.radius, bs.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Splatter dots
      ctx.beginPath();
      ctx.arc(bs.radius * 0.8, bs.radius * 0.4, bs.radius * 0.25, 0, Math.PI * 2);
      ctx.arc(-bs.radius * 0.7, -bs.radius * 0.3, bs.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }
  }

  // 4. Industrial Floor Safety Lanes (DTA Forklift Highway)
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
  ctx.lineWidth = 4;
  ctx.setLineDash([24, 18]);
  for (let x = 620; x < ARENA_WIDTH; x += 520) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_HEIGHT); ctx.stroke();
  }
  ctx.setLineDash([]);

  // 4.5. Dynamic Conveyor Belts (Cross-Dock Arena)
  for (let i = 0; i < warehouseConveyors.length; i++) {
    const cb = warehouseConveyors[i];
    if (cb.x + cb.w > camera.x && cb.x < camera.x + viewW && cb.y + cb.h > camera.y && cb.y < camera.y + viewH) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cb.x, cb.y, cb.w, cb.h);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(cb.x, cb.y, cb.w, cb.h);

      // Rollers & animated directional arrows
      ctx.fillStyle = '#0f172a';
      const isHorizontal = Math.abs(cb.vx) > Math.abs(cb.vy);
      if (isHorizontal) {
        const offset = ((gameTime * cb.vx) % 24 + 24) % 24;
        for (let rx = cb.x + offset; rx < cb.x + cb.w; rx += 24) {
          ctx.fillRect(rx, cb.y + 2, 4, cb.h - 4);
        }
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        const arrow = cb.vx > 0 ? '➔ ➔ ➔' : '⬅ ⬅ ⬅';
        ctx.fillText(arrow, cb.x + cb.w / 2 - 24, cb.y + cb.h / 2 + 4);
      } else {
        const offset = ((gameTime * cb.vy) % 24 + 24) % 24;
        for (let ry = cb.y + offset; ry < cb.y + cb.h; ry += 24) {
          ctx.fillRect(cb.x + 2, ry, cb.w - 4, 4);
        }
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        const arrow = cb.vy > 0 ? '⬇' : '⬆';
        ctx.fillText(arrow, cb.x + cb.w / 2 - 6, cb.y + cb.h / 2 + 4);
      }
    }
  }

  // 4.6. Warehouse Heating Fans (Freezer Arena)
  for (let i = 0; i < warehouseHeaters.length; i++) {
    const h = warehouseHeaters[i];
    if (h.x > camera.x - 200 && h.x < camera.x + viewW + 200 && h.y > camera.y - 200 && h.y < camera.y + viewH + 200) {
      const heatGrad = ctx.createRadialGradient(h.x, h.y, 10, h.x, h.y, h.radius);
      heatGrad.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
      heatGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
      heatGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = heatGrad;
      ctx.beginPath(); ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2); ctx.fill();

      // Heater Box Unit
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(h.x - 18, h.y - 18, 36, 36);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - 18, h.y - 18, 36, 36);

      // Rotating fan blades
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(gameTime * 6);
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♨️', 0, 1);
      ctx.restore();

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('NAGRZEWNICA', h.x - 34, h.y + 30);
    }
  }

  // 5. Floor Stencils & Markings (BHP & DTA Warning Zones)
  for (let i = 0; i < warehouseStencils.length; i++) {
    const st = warehouseStencils[i];
    if (st.x > camera.x - 200 && st.x < camera.x + viewW + 200 && st.y > camera.y - 100 && st.y < camera.y + viewH + 100) {
      ctx.font = st.font;
      ctx.fillStyle = st.color;
      ctx.fillText(st.text, st.x, st.y);
    }
  }

  // 6. Loading Docks along North Wall (Bramy Załadunkowe DTA)
  for (let i = 0; i < warehouseDocks.length; i++) {
    const dock = warehouseDocks[i];
    if (dock.x + dock.w > camera.x && dock.x < camera.x + viewW && dock.y + dock.h > camera.y && dock.y < camera.y + viewH) {
      // Dock Bay Body
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(dock.x, dock.y, dock.w, dock.h);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(dock.x, dock.y, dock.w, dock.h);

      // Segmented Metal Roll-up Door Shutter
      ctx.fillStyle = '#1e293b';
      for (let sy = 8; sy < dock.h - 12; sy += 9) {
        ctx.fillRect(dock.x + 8, sy, dock.w - 16, 7);
      }

      // Yellow/Black Chevron Hazard Edge
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(dock.x + 4, dock.h - 8, dock.w - 8, 8);

      // Dock Title & LED status indicator
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(dock.title, dock.x + 12, 22);

      // Blinking Dock LED
      const ledColor = dock.active ? (Math.sin(gameTime * 4) > 0 ? '#ef4444' : '#7f1d1d') : '#22c55e';
      ctx.fillStyle = ledColor;
      ctx.beginPath();
      ctx.arc(dock.x + dock.w - 16, 20, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 7. Arena Perimeter Industrial Hazard Border
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, ARENA_WIDTH - 8, ARENA_HEIGHT - 8);

  // 8. Drift Tyre Skid Marks on Floor
  for (let i = 0; i < skidMarks.length; i++) {
    const s = skidMarks[i];
    if (s.x > camera.x - 40 && s.x < camera.x + viewW + 40 && s.y > camera.y - 40 && s.y < camera.y + viewH + 40) {
      const alpha = (s.life / s.maxLife) * 0.5;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(-14, -10, 16, 4);
      ctx.fillRect(-14, 7, 16, 4);
      ctx.restore();
    }
  }

  // 9. Draw Warehouse Obstacles (High-bay Racks, Pallet Stacks, ToiToi)
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    if (o.x + o.w > camera.x && o.x < camera.x + viewW && o.y + o.h > camera.y && o.y < camera.y + viewH) {
      if (o.type === 'rack') {
        ctx.drawImage(rackCanvas, o.x, o.y);
      } else if (o.type === 'pallet_stack') {
        ctx.drawImage(palletStackCanvas, o.x, o.y);
      } else if (o.type === 'toitoi_station') {
        // High-vis ToiToi Cabin with shadow & ventilation smoke
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(o.x + 6, o.y + 6, o.w, o.h);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 12px sans-serif';
        ctx.fillText('TOI-TOI', o.x + 8, o.y + 36);
        ctx.font = '900 8px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('AWARIA 🔒', o.x + 10, o.y + 50);

        // Toxic Green Odor Puff
        if (Math.random() < 0.25) {
          spawnParticle(o.x + 32 + (Math.random()-0.5)*20, o.y + 10, (Math.random()-0.5)*1.5, -1.2, 0.8, 4, 'rgba(74, 222, 128, 0.35)');
        }
      }
    }
  }

  // 9.5 Draw Breakable Warehouse Props (Coffee dispensers, wooden crates, extinguishers)
  drawMapProps(ctx, viewW, viewH);

  // 10. Draw Dynamic Pickups (XP Barcodes, Food, Coffee, Lucky Chests, Coins)
  for (let i = 0; i < dropItems.length; i++) {
    const it = dropItems[i];
    if (it.x > camera.x - 30 && it.x < camera.x + viewW + 30 && it.y > camera.y - 30 && it.y < camera.y + viewH + 30) {
      const isBarcode = it.type === 'barcode_xp';
      const glowGrad = ctx.createRadialGradient(it.x, it.y, 2, it.x, it.y, 28);
      glowGrad.addColorStop(0, isBarcode ? 'rgba(56, 189, 248, 0.35)' : 'rgba(245, 158, 11, 0.35)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath(); ctx.arc(it.x, it.y, 28, 0, Math.PI * 2); ctx.fill();

      if (it.type === 'lucky_chest') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const pulse = 1.0 + Math.sin(gameTime * 7) * 0.18;
        ctx.scale(pulse, pulse);
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📦', 0, 0);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 9px sans-serif';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fillText('★SKRZYNIA★', 0, -16);
        ctx.restore();
      } else if (it.type === 'dta_coin') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const bob = Math.sin(gameTime * 6 + it.x) * 3;
        ctx.translate(0, bob);
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💰', 0, 0);
        ctx.restore();
      } else if (it.type === 'golden_forklift') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const pulse = 1.1 + Math.sin(gameTime * 10) * 0.25;
        ctx.scale(pulse, pulse);
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🚜', 0, 0);
        ctx.fillStyle = '#facc15'; ctx.font = 'bold 9px sans-serif';
        ctx.shadowColor = '#facc15'; ctx.shadowBlur = 10;
        ctx.fillText('★ZŁOTY WÓZEK★', 0, -18);
        ctx.restore();
      } else if (it.type === 'boombox_radio') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const bob = Math.sin(gameTime * 8) * 4;
        ctx.translate(0, bob);
        ctx.font = '26px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('📻', 0, 0);
        ctx.restore();
      } else if (it.type === 'cargo_mystery') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const spin = gameTime * 4;
        ctx.rotate(Math.sin(spin) * 0.2);
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🎁', 0, 0);
        ctx.fillStyle = '#a855f7'; ctx.font = 'bold 9px sans-serif';
        ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 10;
        ctx.fillText('❓TAJNA PACZKA❓', 0, -16);
        ctx.restore();
      } else if (it.type === 'golden_velvet') {
        ctx.save();
        ctx.translate(it.x, it.y);
        const pulse = 1.0 + Math.sin(gameTime * 8) * 0.15;
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.fillRect(-14, -10, 28, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('GOLD', -11, 3);
        ctx.restore();
      } else if (isBarcode) {
        // High-res Polish EAN-13 Barcode Label
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(it.x - 8, it.y - 6, 16, 12);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(it.x - 8, it.y - 6, 16, 12);
        ctx.fillStyle = '#020617';
        ctx.fillRect(it.x - 6, it.y - 4, 1.5, 8);
        ctx.fillRect(it.x - 3, it.y - 4, 2.5, 8);
        ctx.fillRect(it.x + 1, it.y - 4, 1.5, 8);
        ctx.fillRect(it.x + 4, it.y - 4, 2, 8);
      } else if (it.type === 'hotdog') {
        ctx.font = '18px sans-serif';
        ctx.fillText('🌭', it.x - 9, it.y + 6);
      } else if (it.type === 'kinder_bueno') {
        ctx.font = '20px sans-serif';
        ctx.fillText('🍫', it.x - 10, it.y + 7);
      } else if (it.type === 'mystery_box') {
        ctx.font = '28px sans-serif';
        ctx.fillText('🎁', it.x - 14, it.y + 10);
      } else if (it.type === 'coffee_thermos') {
        ctx.font = '18px sans-serif';
        ctx.fillText('☕', it.x - 9, it.y + 6);
      }
    }
  }

  // 11. Real-time Player Headlights Cone
  const headDist = 280;
  const headSpread = 0.54;
  const hGrad = ctx.createRadialGradient(
    player.x, player.y, 20,
    player.x + Math.cos(player.angle) * headDist * 0.7,
    player.y + Math.sin(player.angle) * headDist * 0.7,
    headDist
  );
  hGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
  hGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.14)');
  hGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.arc(player.x, player.y, headDist, player.angle - headSpread, player.angle + headSpread);
  ctx.closePath();
  ctx.fill();

  // 12. Amber Flare Floor Beacon
  const beaconAlpha = 0.24 + Math.sin(gameTime * 14) * 0.14;
  const bGrad = ctx.createRadialGradient(player.x, player.y, 4, player.x, player.y, 130);
  bGrad.addColorStop(0, `rgba(245, 158, 11, ${beaconAlpha})`);
  bGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = bGrad;
  ctx.beginPath(); ctx.arc(player.x, player.y, 130, 0, Math.PI * 2); ctx.fill();

  // 13. Draw Enemies with Character Specific Models
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.x + 80 < camera.x || e.x - 80 > camera.x + viewW || e.y + 80 < camera.y || e.y - 80 > camera.y + viewH) continue;

    ctx.save();
    ctx.translate(e.x, e.y);

    // Dynamic Ground Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.ellipse(0, e.info.radius * 0.7, e.info.radius * 0.95, e.info.radius * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const isHit = e.hitFlash > 0;
    const isFrozen = e.slowTimer > 0;
    const facing = Math.atan2(player.y - e.y, player.x - e.x);

    if (e.info.renderType === 'delivery_van') {
      // --- BUS: "JA TYLKO DWIE PALETY" (Fiat Ducato / Iveco Daily) ---
      ctx.rotate(facing);
      
      // Van Headlights Cone
      const vanHeadGrad = ctx.createRadialGradient(28, 0, 5, 80, 0, 90);
      vanHeadGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      vanHeadGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = vanHeadGrad;
      ctx.beginPath();
      ctx.moveTo(28, 0); ctx.arc(28, 0, 90, -0.4, 0.4); ctx.closePath(); ctx.fill();

      // Van Body (White with Orange accents)
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#f8fafc');
      ctx.fillRect(-30, -18, 60, 36);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-30, -18, 60, 36);

      // Windshield & Side Windows
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, -14, 16, 28);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.fillRect(10, -12, 12, 24);

      // Roof Emergency Flasher
      ctx.fillStyle = Math.sin(gameTime * 18) > 0 ? '#f59e0b' : '#ef4444';
      ctx.beginPath(); ctx.arc(-2, 0, 5, 0, Math.PI * 2); ctx.fill();

      // Wheels
      ctx.fillStyle = '#020617';
      ctx.fillRect(-22, -21, 12, 5); ctx.fillRect(10, -21, 12, 5);
      ctx.fillRect(-22, 16, 12, 5); ctx.fillRect(10, 16, 12, 5);

      // Banner Text on Roof
      ctx.fillStyle = '#ea580c';
      ctx.font = '900 9.5px sans-serif';
      ctx.fillText('2 PALETY', -22, 3);
    } else if (e.info.renderType === 'toitoi_mech') {
      // --- BOSS MECHA-TOITOI 3000 ---
      ctx.rotate(facing);

      // Armored Metal Body
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#15803d');
      ctx.fillRect(-32, -42, 64, 84);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(-32, -42, 64, 84);

      // Hazard Stripes on Lower Skirt
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-30, 24, 60, 14);
      ctx.fillStyle = '#020617';
      for (let hx = -26; hx < 26; hx += 12) {
        ctx.beginPath();
        ctx.moveTo(hx, 24); ctx.lineTo(hx + 6, 38); ctx.lineTo(hx + 10, 38); ctx.lineTo(hx + 4, 24); ctx.fill();
      }

      // Ventilation Grille & Glowing Demonic Sensor Eyes
      ctx.fillStyle = '#020617';
      ctx.fillRect(-16, -26, 32, 14);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(-7, -19, 3.5, 0, Math.PI * 2); ctx.arc(7, -19, 3.5, 0, Math.PI * 2); ctx.fill();

      // Biohazard Nuclear Aura
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI * 2); ctx.stroke();
    } else if (e.info.renderType === 'container_truck') {
      // --- BOSS 40FT CONTAINER TRUCK ---
      ctx.rotate(facing);
      
      // Corrugated Shipping Container Body (Maersk Burgundy / Navy)
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#991b1b');
      ctx.fillRect(-52, -26, 104, 52);
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-52, -26, 104, 52);

      // Corrugated Container Vertical Steel Ribs
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 2;
      for (let rx = -44; rx < 44; rx += 8) {
        ctx.beginPath(); ctx.moveTo(rx, -24); ctx.lineTo(rx, 24); ctx.stroke();
      }

      // Container Door Locking Bars & Maersk Decal
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-48, -12, 3, 24); ctx.fillRect(-44, -12, 3, 24);
      ctx.font = '900 11px sans-serif';
      ctx.fillText('40FT SAD EXPRESS', -34, 4);

      // Brake Taillights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-52, -22, 4, 8); ctx.fillRect(-52, 14, 4, 8);
    } else if (e.info.renderType === 'boss_bhp') {
      // --- BOSS BHP ZASTĘPCA GRZESIEK ---
      ctx.fillStyle = isHit ? '#ffffff' : '#f97316'; // High-vis orange vest
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();

      // Green BHP Cross on Chest
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-5, -12, 10, 24);
      ctx.fillRect(-12, -5, 24, 10);
      
      // Megaphone with ultrasonic rings
      ctx.fillStyle = '#fbbf24';
      ctx.font = '18px sans-serif';
      ctx.fillText('📢', 6, 8);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius + 12 + Math.sin(gameTime * 8)*6, 0, Math.PI * 2); ctx.stroke();
    } else if (e.info.renderType === 'boss_igor') {
      // --- BOSS IGOR (UDZIAŁOWIEC) ---
      ctx.fillStyle = isHit ? '#ffffff' : '#1e1b4b';
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 3; ctx.stroke();

      // Electric Darkness Aura & Shattered Bulbs
      ctx.font = '18px sans-serif';
      ctx.fillText('💡', -8, 6);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius + 14, 0, Math.PI * 2); ctx.stroke();
    } else if (e.info.renderType === 'reach_truck') {
      // --- WIESŁAW REACH TRUCK (WYSOKI SKŁAD) ---
      ctx.rotate(facing);
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#0284c7');
      ctx.fillRect(-22, -15, 44, 30);
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.strokeRect(-22, -15, 44, 30);
      // Mast Chrome Beams
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(16, -12, 6, 24);
      ctx.fillRect(22, -10, 16, 4); ctx.fillRect(22, 6, 16, 4);
    } else if (e.type === 'KARTON_B2C') {
      // --- 3D CARDBOARD BOX ---
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#d97706');
      ctx.fillRect(-14, -12, 28, 24);
      ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.5; ctx.strokeRect(-14, -12, 28, 24);
      // Brown Seam Tape & Fragile Glass Symbol
      ctx.fillStyle = '#b45309'; ctx.fillRect(-14, -2, 28, 4);
      ctx.font = '10px sans-serif'; ctx.fillText('🍷', -4, 4);
    } else if (e.type === 'FOLIA' || e.type === 'FOLIA_MALA') {
      // --- GLOSSY STRETCH FILM ROLL ---
      const r = e.info.radius;
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : 'rgba(248, 250, 252, 0.9)');
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();
      // Blue Plastic Tube Core
      ctx.fillStyle = '#0284c7'; ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
    } else if (e.type === 'PALETA_KAM') {
      // --- STACKED WOODEN EURO PALLET ---
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#78350f');
      ctx.fillRect(-22, -18, 44, 36);
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2; ctx.strokeRect(-22, -18, 44, 36);
      // Wooden Planks & EPAL Stamp
      ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-22, -6); ctx.lineTo(22, -6); ctx.moveTo(-22, 6); ctx.lineTo(22, 6); ctx.stroke();
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('EPAL', -10, 3);
    } else if (e.type === 'RAMPA') {
      // --- HEAVY STEEL LOADING RAMP ---
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#334155');
      ctx.fillRect(-28, -20, 56, 40);
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5; ctx.strokeRect(-28, -20, 56, 40);
      // Yellow/Black Hazard Stripes
      ctx.fillStyle = '#f59e0b';
      for (let hx = -24; hx < 24; hx += 10) {
        ctx.fillRect(hx, -18, 5, 36);
      }
    } else if (e.type === 'AUDYTOR') {
      // --- BHP AUDITOR (Yellow Helmet & Safety Vest) ---
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#facc15'); // Yellow Helmet
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#020617'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('BHP', -7, 3);
    } else {
      // --- PEDESTRIAN WORKERS / DRIVERS / INSPECTORS ---
      const walkCycle = Math.sin(gameTime * 14 + i) * 6;
      
      // 1. Klapki Kubota Driver
      if (e.type === 'KLAPKI') {
        ctx.fillStyle = '#1e3a8a'; // Blue shorts
        ctx.fillRect(-8, 2, 16, 8);
        ctx.fillStyle = '#facc15'; // Yellow Kubota slippers
        ctx.fillRect(-10, 10 + walkCycle, 7, 12);
        ctx.fillRect(3, 10 - walkCycle, 7, 12);
        ctx.fillStyle = '#1e3a8a'; // Slipper strap
        ctx.fillRect(-10, 13 + walkCycle, 7, 3);
        ctx.fillRect(3, 13 - walkCycle, 7, 3);
        // Torso / white sleeveless shirt
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#f8fafc');
        ctx.beginPath(); ctx.arc(0, -3, e.info.radius * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 1.5; ctx.stroke();
        // CMR document in hand
        ctx.fillStyle = '#ffffff'; ctx.fillRect(9, -6, 8, 10);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(10, -4, 6, 2);
      }
      // 2. Kierowca TIR (Flannel Shirt & Trucker Cap)
      else if (e.type === 'KIEROWCA_TIR') {
        // Red & Black Flannel Torso
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#dc2626');
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.stroke();
        // Flannel grid check lines
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke();
        // Trucker Cap Peak
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(0, -8, 8, Math.PI, 0); ctx.fill();
        // Thermos in hand
        ctx.fillStyle = '#0284c7'; ctx.fillRect(10, -5, 6, 12);
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(11, -8, 4, 3);
      }
      // 3. Kurier Paczek (Yellow DHL/DPD Jacket & Parcel Scanner)
      else if (e.type === 'KURIER') {
        // Bright Yellow / Red Jacket
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#eab308');
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 2.5; ctx.stroke();
        // Red Cap
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath(); ctx.arc(0, -6, 7, 0, Math.PI * 2); ctx.fill();
        // Handheld Laser Scanner emitting red aim line
        ctx.fillStyle = '#1e293b'; ctx.fillRect(9, 2, 7, 5);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(16, 4); ctx.lineTo(26, 4); ctx.stroke();
      }
      // 4. Spedytor (Purple Blazer & Smartphone)
      else if (e.type === 'SPEDYTOR') {
        // Dark Purple Suit Blazer
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#581c87');
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2; ctx.stroke();
        // White shirt collar & red tie
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-4, -8, 8, 7);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(-2, -4, 4, 10);
        // Glowing Smartphone by head
        ctx.fillStyle = '#0f172a'; ctx.fillRect(8, -12, 6, 10);
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(9, -10, 4, 6);
      }
      // 5. Awizo (Vintage Postal Coat & Stamp)
      else if (e.type === 'AWIZO') {
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#78350f');
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke();
        // Yellow Awizo Badge
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-7, -4, 14, 9);
        ctx.fillStyle = '#b45309'; ctx.font = 'bold 7px sans-serif'; ctx.fillText('AWIZO', -6, 3);
      }
      // 6. Celnik KAS (Navy Uniform & Gold Crest)
      else if (e.type === 'CELNIK') {
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#1e3a8a');
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2.5; ctx.stroke();
        // Gold Eagle Badge
        ctx.fillStyle = '#facc15'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('🦅', -5, 4);
      }
      // 7. Ukraina Ekipa (Hi-vis vest with 3M silver stripes)
      else if (e.type === 'UKRAINA_EKIPA') {
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#1e40af'); // Blue shirt
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke();
        // Yellow & Silver 3M Safety Cross Vest
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-10, -7, 20, 14);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-10, -2, 20, 4);
      }
      // 8. Praktykant (Mint Green vest & scattered papers)
      else if (e.type === 'PRAKTYKANT') {
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#10b981');
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#047857'; ctx.lineWidth = 1.5; ctx.stroke();
        // Clipboard
        ctx.fillStyle = '#92400e'; ctx.fillRect(-6, -6, 12, 12);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-4, -4, 8, 8);
      }
      // 9. Tasma (Worker with giant packing tape roll)
      else if (e.type === 'TASMA') {
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#f59e0b');
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.stroke();
        // Rotating Tape Dispenser
        ctx.fillStyle = '#92400e';
        ctx.beginPath(); ctx.arc(8, 0, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.arc(8, 0, 3, 0, Math.PI * 2); ctx.fill();
      }
      // 10. Awaria Wózek (Sparking mini pallet jack)
      else if (e.type === 'WOZEK_AWARIA') {
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#ea580c');
        ctx.fillRect(-16, -10, 32, 20);
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.strokeRect(-16, -10, 32, 20);
        // Sparking electric battery smoke
        if (Math.random() < 0.3) {
          spawnParticle(e.x - 10, e.y, (Math.random()-0.5)*2, -1, 0.4, 3, '#facc15');
        }
      }
      // Fallback Pedestrian with itemIcon
      else {
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : e.info.color);
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
        if (e.info.itemIcon) {
          ctx.font = '14px sans-serif'; ctx.fillText(e.info.itemIcon, -7, 5);
        }
      }
    }

    // Frozen Ice Block Crystal Overlay
    if (isFrozen) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, e.info.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Mini HP bar for damaged enemies
    if (e.hp < e.maxHp) {
      const barW = Math.max(32, e.info.radius * 1.8);
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(-barW / 2, -e.info.radius - 10, barW, 5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-barW / 2, -e.info.radius - 10, (e.hp / e.maxHp) * barW, 5);
    }

    // --- CLEAR ATMOSPHERIC NAME & ICON BADGE OVER BOSS HEAD ONLY ---
    if (e.isBoss) {
      const badgeY = -e.info.radius - (e.hp < e.maxHp ? 22 : 14);
      const nameStr = (e.info.itemIcon ? e.info.itemIcon + ' ' : '') + (e.info.name || e.type);
      const fontSize = Math.round(13 * fontScale);
      ctx.font = `900 ${fontSize}px -apple-system, Roboto, sans-serif`;
      const textW = ctx.measureText(nameStr).width;
      const badgeW = textW + 14 * fontScale;
      const badgeH = 18 * fontScale;

      ctx.fillStyle = 'rgba(127, 29, 29, 0.94)';
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 4 * fontScale);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8 * fontScale;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nameStr, 0, badgeY);
    }

    ctx.restore();
  }

  // 14. Draw Player (Toyota BT Industrial Forklift)
  ctx.save();
  ctx.translate(player.x, player.y);

  if (player.isForklift) {
    // Forklift Ground Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 30, 20, player.angle, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(player.angle);

    // Iron Rear Counterweight
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-27, -14, 8, 28);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(-27, -14, 8, 28);

    // Main Chassis (Toyota Industrial Orange)
    const chassisGrad = ctx.createLinearGradient(-24, -16, 24, 16);
    chassisGrad.addColorStop(0, '#ea580c');
    chassisGrad.addColorStop(0.5, '#f97316');
    chassisGrad.addColorStop(1, '#c2410c');
    ctx.fillStyle = chassisGrad;
    ctx.fillRect(-24, -16, 48, 32);
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-24, -16, 48, 32);

    // Roll Cage Safety Frame
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-14, -13, 20, 26);

    // Cockpit Glass Roof with tint
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(-13, -12, 18, 24);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.fillRect(-11, -10, 14, 20);

    // Steering Wheel & Operator Seat
    ctx.fillStyle = '#334155';
    ctx.beginPath(); ctx.arc(-4, 0, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.arc(4, 0, 3, 0, Math.PI * 2); ctx.fill();

    // Heavy Duty Steel Mast & Forks
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, -14, 5, 28);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(25, -13, 22, 6);
    ctx.fillRect(25, 7, 22, 6);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(25, -13, 3, 6);
    ctx.fillRect(25, 7, 3, 6);

    // Rotating Amber Warning Light Flare on Roof
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(-5, 0, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(-5, 0, 2.5, 0, Math.PI * 2); ctx.fill();

    // Toyota BT Exhaust Pipe Nozzle & Turbo Flame Plume (Rear Left)
    ctx.fillStyle = '#334155';
    ctx.fillRect(-29, 6, 5, 6);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(-29, 6, 5, 6);

    if (packageCombo > 0 || player.isDashing) {
      const flameLen = Math.min(32, 8 + packageCombo * 1.3 + Math.sin(gameTime * 28) * 4);
      const flameGrad = ctx.createLinearGradient(-29, 9, -29 - flameLen, 9);
      if (packageCombo >= 15) {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.25, '#38bdf8');
        flameGrad.addColorStop(0.65, '#c084fc');
        flameGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
      } else if (packageCombo >= 5) {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#fbbf24');
        flameGrad.addColorStop(0.7, '#ea580c');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.4, '#38bdf8');
        flameGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      }
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-29, 7);
      ctx.lineTo(-29 - flameLen, 9);
      ctx.lineTo(-29, 11);
      ctx.closePath();
      ctx.fill();
    }

    // Aerodynamic High-Speed Motion Lines (Wind Streaks)
    if (packageCombo >= 6 || player.isDashing) {
      ctx.strokeStyle = packageCombo >= 15 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 1.5;
      const streakOffset = (gameTime * 70) % 22;
      ctx.beginPath();
      ctx.moveTo(-35 - streakOffset, -18);
      ctx.lineTo(25 - streakOffset, -18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-35 - streakOffset, 18);
      ctx.lineTo(25 - streakOffset, 18);
      ctx.stroke();
    }
  } else {
    // On-foot Player Rendering (Pedestrian)
    ctx.rotate(player.angle);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(-2, 2, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (Hi-Vis vest)
    ctx.fillStyle = '#fbbf24'; // Yellow-orange vest
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Reflective stripes
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, -6);
    ctx.lineTo(10, -6);
    ctx.moveTo(-10, 6);
    ctx.lineTo(10, 6);
    ctx.stroke();

    // Head
    ctx.fillStyle = '#fcd34d'; // Skin tone
    ctx.beginPath();
    ctx.arc(4, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();

    // Hands
    const legOffset = Math.sin(gameTime * (Math.hypot(player.vx, player.vy) * 2)) * 6;
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath(); ctx.arc(10 + legOffset, -14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(10 - legOffset, 14, 4, 0, Math.PI * 2); ctx.fill();
  }

  // Draw Stamina Bar below player
  if (player.stamina < player.maxStamina || player.isForklift) {
    ctx.rotate(-player.angle); // undo player rotation
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-16, 32, 32, 5);
    
    ctx.fillStyle = player.isForklift ? '#facc15' : '#fbbf24';
    const fillW = Math.max(0, (player.stamina / player.maxStamina) * 30);
    ctx.fillRect(-15, 33, fillW, 3);
    
    ctx.rotate(player.angle); // restore rotation just in case
  }
  ctx.restore();

  // 14.5 Draw Kluska Companion
  drawKluska(ctx);

  // 15. Draw Stretch Aura
  if (weapons.stretchAura.level > 0) {
    const count = weapons.stretchAura.count;
    const rad = weapons.stretchAura.radius;
    for (let i = 0; i < count; i++) {
      const a = weapons.stretchAura.angle + (i * (Math.PI * 2 / count));
      const ax = player.x + Math.cos(a) * rad;
      const ay = player.y + Math.sin(a) * rad;
      ctx.fillStyle = weapons.stretchAura.isEvo ? '#38bdf8' : '#e2e8f0';
      ctx.beginPath(); ctx.arc(ax, ay, 11, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = weapons.stretchAura.isEvo ? '#bae6fd' : '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  // 16. Draw Projectiles
  for (let i = 0; i < projectiles.length; i++) {
    const p = projectiles[i];
    if (p.type === 'laser') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = weapons.scanner.isEvo ? 7 : 3.5;
      ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = weapons.scanner.isEvo ? 3 : 1.5;
      ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(p.x2 - 10, p.y2 - 10, 20, 20);
    } else if (p.type === 'gas_cloud') {
      const alpha = (p.life / (p.maxLife || 1.5)) * 0.45;
      const gGrad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, p.radius);
      gGrad.addColorStop(0, `rgba(234, 179, 8, ${alpha})`);
      gGrad.addColorStop(0.6, `rgba(163, 230, 53, ${alpha * 0.7})`);
      gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gGrad;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    } else if (p.type === 'metal_bb') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } else if (p.type === 'pallet') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-16, -12, 32, 24);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(-16, -12, 32, 24);
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.fillText('EPAL', -11, 3);
      ctx.restore();
    } else if (p.type === 'oil_trail') {
      ctx.fillStyle = `rgba(15, 23, 42, ${p.life / 4.0})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'kas_red_zone') {
      ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + Math.sin(gameTime * 10) * 0.1})`;
      ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText(`REWIZJA: ${Math.ceil(p.life)}s`, p.x - 40, p.y);
    } else if (p.type === 'enemy_shoot') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-12, -8, 24, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px sans-serif';
      ctx.fillText('BRAK', -10, -1);
      ctx.fillText('DOK.', -10, 6);
      ctx.restore();
    } else if (p.type === 'zip_tie') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillStyle = p.isEvo ? '#ef4444' : '#f8fafc';
      ctx.fillRect(-4, -1, 8, 2);
      ctx.restore();
    } else if (p.type === 'cutter') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = p.isEvo ? '#f43f5e' : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(-6, -4); ctx.lineTo(-6, 4); ctx.fill();
      ctx.restore();
    } else if (p.type === 'toilet_paper') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = p.isEvo ? '#facc15' : '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    } else if (p.type === 'box_mortar') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.beginPath(); ctx.arc(p.targetX, p.targetY, 110, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();
    } else if (p.type === 'faktura') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle || 0);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-10, -14, 20, 28);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-10, -14, 20, 28);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 8px Arial';
      ctx.fillText('KOREKTA', -9, -4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, 2, 16, 2);
      ctx.fillRect(-8, 6, 12, 2);
      ctx.restore();
    } else if (p.type === 'staple') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = p.isEvo ? '#facc15' : '#38bdf8';
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -1, 8, 2);
      ctx.restore();
    } else if (p.type === 'hydrant_beam') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(p.vy, p.vx));
      ctx.fillStyle = p.isEvo ? 'rgba(56, 189, 248, 0.9)' : 'rgba(96, 165, 250, 0.8)';
      ctx.fillRect(-14, -7, 28, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-10, -3, 20, 6);
      ctx.restore();
    } else if (p.type === 'shockwave') {
      ctx.strokeStyle = p.color || '#f59e0b';
      ctx.lineWidth = Math.max(1, 4 * (1 - p.radius / (p.maxRadius || 150)));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 17. Draw Particles (Debris, Sparks, Smoke)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particlePool[i];
    if (p.active) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 18. Floating Damage Texts (Clamped strictly within viewport & fontScaled for high DPI crispness)
  ctx.save();
  for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
    const ft = floatingTexts[i];
    if (ft.active) {
const lifePct = ft.life / ft.maxLife;
      const alpha = Math.min(1.0, ft.life * 2.5); // Fade out later
      ctx.save();
      ctx.globalAlpha = alpha;
      
      let baseDmgSize = ft.isCrit ? 18 : 13;
      if (ft.isCrit) {
         // Massive popup scale on critical hits
         if (lifePct > 0.8) {
             baseDmgSize += (lifePct - 0.8) * 45; // Pop!
         }
      }
      
      const dmgFontSize = Math.round(baseDmgSize * fontScale);
      ctx.font = `900 ${dmgFontSize}px "Arial Black", Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const clampX = Math.max(camera.x + 25 * fontScale, Math.min(camera.x + viewW - 30 * fontScale, ft.x));
      const clampY = Math.max(camera.y + 40 * fontScale, Math.min(camera.y + viewH - 50 * fontScale, ft.y));
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5 * fontScale;
      ctx.strokeText(ft.text, clampX, clampY);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, clampX, clampY);
      ctx.restore();
    }
  }
  ctx.restore();

  // 19. Comic Speech Bubbles (Drawn at entity world coords, max 3 active)
  ctx.save();
  const bubbleFontSize = Math.round(11.5 * fontScale);
  ctx.font = `900 ${bubbleFontSize}px -apple-system, Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < speechBubbles.length; i++) {
    const b = speechBubbles[i];
    // Skip if completely off camera
    if (b.x < camera.x - 60 || b.x > camera.x + viewW + 60 ||
        b.y < camera.y - 60 || b.y > camera.y + viewH + 60) {
      continue;
    }

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

    // Compact dark pill container
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(rectX, rectY, rectW, rectH, 6 * fontScale);
    ctx.fill();

    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.4 * fontScale;
    ctx.stroke();

    ctx.fillStyle = b.color;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4 * fontScale;
    ctx.fillText(b.text, rectX + rectW / 2, rectY + rectH / 2);
ctx.restore();
  }
  
  // 19.5 Dynamic Lighting & Flashlight Pass
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const flicker = Math.sin(performance.now() / 100) * 8;
  const baseRadius = player.isForklift ? 180 : 120;
  
  const darkGrad = ctx.createRadialGradient(player.x, player.y, baseRadius + flicker, player.x, player.y, 1000);
  darkGrad.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright center
  darkGrad.addColorStop(0.25, 'rgba(180, 180, 195, 1)'); // Soft falloff
  darkGrad.addColorStop(1, 'rgba(15, 18, 26, 1)'); // Pitch black corners
  
  ctx.fillStyle = darkGrad;
  ctx.fillRect(camera.x - 200, camera.y - 200, viewW + 400, viewH + 400);
  ctx.restore();
  
  if (player.isForklift) {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const headlightGrad = ctx.createRadialGradient(player.x, player.y, 50, player.x, player.y, 600);
      headlightGrad.addColorStop(0, 'rgba(255, 250, 200, 0.4)');
      headlightGrad.addColorStop(1, 'rgba(255, 250, 200, 0)');
      
      ctx.fillStyle = headlightGrad;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.arc(player.x, player.y, 600, player.angle - 0.4, player.angle + 0.4);
      ctx.fill();
      ctx.restore();
  }
  
  ctx.restore();
  ctx.restore();

// 20. AMOLED Screen Edge Cinematic Vignette & Low Battery Pulse
  const vigGrad = ctx.createRadialGradient(
    gameWidth / 2, gameHeight / 2, Math.min(gameWidth, gameHeight) * 0.35,
    gameWidth / 2, gameHeight / 2, Math.max(gameWidth, gameHeight) * 0.85
  );
  vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  
  let edgeColor = 'rgba(2, 6, 23, 0.75)'; // Darker edges for warehouse feel
  
  // Low battery red pulsing
  if (player.battery < player.maxBattery * 0.25) {
     const pulse = (Math.sin(performance.now() / 150) + 1) / 2; // Fast heartbeat pulse
     edgeColor = `rgba(${100 + pulse * 100}, 0, 0, ${0.4 + pulse * 0.4})`;
  } else if (selectedArenaKey === 'freezer') {
     edgeColor = 'rgba(2, 20, 40, 0.8)'; // Cold blue edges
  }
  
vigGrad.addColorStop(1, edgeColor);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // 21. Minimap (Radar)
  const mapSize = 140;
  const padding = 20;
  const mapX = gameWidth - mapSize - padding;
  const mapY = padding;
  
  ctx.save();
  ctx.globalAlpha = 0.85;
  
  // Minimap Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(mapX, mapY, mapSize, mapSize, 8);
  ctx.fill();
  ctx.stroke();
  
  // Clip for drawing inside map
  ctx.clip();
  
  const scaleX = mapSize / ARENA_WIDTH;
  const scaleY = mapSize / ARENA_HEIGHT;
  
  // Draw Obstacles (Grey)
  ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
  for (let i = 0; i < obstacles.length; i++) {
     const o = obstacles[i];
     ctx.fillRect(mapX + o.x * scaleX, mapY + o.y * scaleY, Math.max(1, o.w * scaleX), Math.max(1, o.h * scaleY));
  }
  
  // Draw drops/xp (Small yellow dots)
  ctx.fillStyle = '#facc15';
  for (let i = 0; i < dropItems.length; i++) {
     const d = dropItems[i];
     if (d.type !== 'lucky_chest') {
         ctx.fillRect(mapX + d.x * scaleX, mapY + d.y * scaleY, 1.5, 1.5);
     } else {
         ctx.fillStyle = '#38bdf8';
         ctx.fillRect(mapX + d.x * scaleX - 1.5, mapY + d.y * scaleY - 1.5, 3, 3);
         ctx.fillStyle = '#facc15';
     }
  }

  // Draw Enemies (Red)
  ctx.fillStyle = '#ef4444';
  for (let i = 0; i < enemies.length; i++) {
     const e = enemies[i];
     const es = e.isBoss ? 4 : 2.5;
     if (e.isBoss) ctx.fillStyle = '#a855f7';
     ctx.fillRect(mapX + e.x * scaleX - es/2, mapY + e.y * scaleY - es/2, es, es);
     if (e.isBoss) ctx.fillStyle = '#ef4444';
  }
  
  // Draw Player (Green/Cyan)
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(mapX + player.x * scaleX, mapY + player.y * scaleY, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw Camera Viewport (White outline)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  const viewW_scaled = (gameWidth / camera.zoom) * scaleX;
  const viewH_scaled = (gameHeight / camera.zoom) * scaleY;
  ctx.strokeRect(mapX + camera.x * scaleX, mapY + camera.y * scaleY, viewW_scaled, viewH_scaled);
  
  ctx.restore();
}


function gameLoop(now) {
  if (!lastTime || isNaN(lastTime)) lastTime = now || performance.now();
  if (!now) now = performance.now();
  let dt = Math.min(0.1, Math.max(0, (now - lastTime) / 1000));
  if (isNaN(dt)) dt = 0.016;
  lastTime = now;
  
  if (window.timeScale === undefined) window.timeScale = 1.0;
  if (window.timeScale < 1.0) {
      window.timeScale = Math.min(1.0, window.timeScale + dt * 0.85); // Smoothly recover from slow-mo
  }
  
  // Apply time scale to game logic update, but keep UI (particles/texts) real-time or semi-real-time
  const gameDt = dt * window.timeScale;

  // Update particles & texts

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particlePool[i];
if (p.active) {
      p.x += p.vx; p.y += p.vy; p.life -= dt;
      p.vx *= 0.92; p.vy *= 0.92; // Friction so they don't slide forever
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
  render();
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
  score = 0;
  kills = 0;
  comboCount = 0;
  packageCombo = 0;
  packageComboTimer = 0;
  maxPackageCombo = 0;
  mysteryTimer = 0; mysteryActive = ''; mysteryBuffMultiplier = 1.0;
  playerLevel = 1;
  currentXP = 0;
  neededXP = 8;
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

function gameOver(shiftTime, isWin) {
  gameState = isWin ? STATE.WIN : STATE.GAMEOVER;
  const bestCombo = Math.max(maxCombo, maxPackageCombo);
  dtaCoins += Math.floor(score / 15);
  saveWorkshopData();

  if (isWin) {
    triggerAchievement('shift_master', '07:00 - Fajrant Marzeń', '🏆');
    document.getElementById('win-stats').innerText = `Dotrwałeś do 07:00! Wynik: ${score} | Kills: ${kills} | Max Combo: x${bestCombo} | Monety: +${Math.floor(score/15)}`;
    document.getElementById('win-screen').style.display = 'flex';
  } else {
    document.getElementById('gameover-stats').innerText = `Przetrwano do: ${shiftTime} | Sektor: ${currentSectorIndex + 1} | Punkty: ${score} | Poziom: ${playerLevel} | Monety: +${Math.floor(score/15)}`;
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
window.selectCharacter = function(key, el) { selectCharacter(key, el); };
window.selectArena = function(arena, el) { selectArena(arena, el); };
window.selectGameMode = function(mode, el) { selectGameMode(mode, el); };
window.buyWorkshopUpgrade = function(key, cost) { buyWorkshopUpgrade(key, cost); };
if (typeof sounds !== 'undefined') {
  window.sounds = sounds;
}

console.log('--- TESTING FUNCTIONS ---');
console.log('typeof window.CHARACTERS:', typeof window.CHARACTERS);
console.log('typeof CHARACTERS:', typeof CHARACTERS);
console.log('typeof window.showIntroDialog:', typeof window.showIntroDialog);
console.log('typeof showIntroDialog:', typeof showIntroDialog);
console.log('typeof window.startGamePlay:', typeof window.startGamePlay);
