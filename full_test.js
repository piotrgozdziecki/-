
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

// line 1

// line 2
/* ==========================================================================
// line 3
   DTA GRANICZNA 8F: MASSIVE HORDE SURVIVORS ENGINE WITH EVOLUTIONS & BOSSES
// line 4
   ========================================================================== */
// line 5

// line 6
class SoundEngine {
// line 7
  constructor() {
// line 8
    this.ctx = null;
// line 9
    this.motorOsc = null;
// line 10
    this.motorGain = null;
// line 11
    this.muted = false;
// line 12
  }
// line 13
  toggle() {
// line 14
    this.muted = !this.muted;
// line 15
    const btn = document.getElementById('btn-pause-sound');
// line 16
    if (btn) btn.innerText = this.muted ? '🔇 DŹWIĘK: OFF' : '🔊 DŹWIĘK: ON';
// line 17
    return this.muted;
// line 18
  }
// line 19
  init() {
// line 20
    if (!this.ctx) {
// line 21
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
// line 22
      if (AudioCtx) {
// line 23
        this.ctx = new AudioCtx();
// line 24
        this.setupEngineMotor();
// line 25
      }
// line 26
    }
// line 27
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
// line 28
  }
// line 29
  setupEngineMotor() {
// line 30
    try {
// line 31
      this.motorOsc = this.ctx.createOscillator();
// line 32
      this.motorGain = this.ctx.createGain();
// line 33
      this.motorOsc.type = 'triangle';
// line 34
      this.motorOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
// line 35
      this.motorGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
// line 36
      this.motorOsc.connect(this.motorGain);
// line 37
      this.motorGain.connect(this.ctx.destination);
// line 38
      this.motorOsc.start();
// line 39
    } catch(e){}
// line 40
  }
// line 41
  updateMotor(speedRatio, isForklift = false) {
// line 42
    if (!this.motorOsc || !this.motorGain || !this.ctx || this.muted) return;
// line 43
    const t = this.ctx.currentTime;
// line 44
    if (!isForklift) {
// line 45
       this.motorGain.gain.setTargetAtTime(0.001, t, 0.2);
// line 46
    } else {
// line 47
       this.motorOsc.frequency.setTargetAtTime(45 + speedRatio * 80, t, 0.08);
// line 48
       this.motorGain.gain.setTargetAtTime(0.01 + speedRatio * 0.025, t, 0.08);
// line 49
    }
// line 50
  }
// line 51
  playTone(freq, type, duration, vol = 0.2, endFreq = null) {
// line 52
    if (!this.ctx || this.muted) return;
// line 53
    try {
// line 54
      const now = this.ctx.currentTime;
// line 55
      const osc = this.ctx.createOscillator();
// line 56
      const gain = this.ctx.createGain();
// line 57
      osc.type = type;
// line 58
      osc.frequency.setValueAtTime(freq, now);
// line 59
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
// line 60
      gain.gain.setValueAtTime(vol, now);
// line 61
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
// line 62
      osc.connect(gain);
// line 63
      gain.connect(this.ctx.destination);
// line 64
      osc.start(now);
// line 65
      osc.stop(now + duration);
// line 66
    } catch(e){}
// line 67
  }
// line 68
  beep() { this.playTone(1100, 'sine', 0.05, 0.15, 1400); }
// line 69
  hit() { this.playTone(120, 'sawtooth', 0.1, 0.2, 40); }
// line 70
  pallet() { this.playTone(85, 'square', 0.18, 0.25, 30); }
// line 71
  freeze() { this.playTone(650, 'sine', 0.2, 0.15, 1200); }
// line 72
  megaph() { this.playTone(300, 'square', 0.25, 0.22, 180); }
// line 73
  xp() { this.playTone(1400, 'sine', 0.05, 0.09, 1800); }
// line 74
  dash() { this.playTone(220, 'sawtooth', 0.25, 0.25, 600); }
// line 75
  footstep() { this.playTone(120, 'triangle', 0.06, 0.03, 80); }
// line 76
  shatterProp() {
// line 77
    this.playTone(160, 'square', 0.12, 0.25, 45);
// line 78
    setTimeout(() => this.playTone(280, 'sawtooth', 0.15, 0.2, 80), 30);
// line 79
  }
// line 80
  chestSlot() {
// line 81
    this.playTone(880, 'triangle', 0.08, 0.18, 1200);
// line 82
  }
// line 83
  chestFanfare() {
// line 84
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => {
// line 85
      setTimeout(() => this.playTone(f, 'sine', 0.25, 0.28), i * 90);
// line 86
    });
// line 87
  }
// line 88
  levelUp() {
// line 89
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.playTone(f, 'triangle', 0.15, 0.2), i * 60));
// line 90
  }
// line 91
  evoSound() {
// line 92
    [440, 554, 659, 880, 1108].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.2, 0.25), i * 80));
// line 93
  }
// line 94
  achieve() {
// line 95
    [659, 784, 987, 1318].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.2, 0.25), i * 70));
// line 96
  }
// line 97
  bossAlert() {
// line 98
    [340, 260, 340, 260, 520].forEach((f, i) => setTimeout(() => this.playTone(f, 'sawtooth', 0.18, 0.3), i * 110));
// line 99
  }
// line 100
  gasPistol() {
// line 101
    this.playTone(180, 'sawtooth', 0.35, 0.3, 40);
// line 102
    this.playTone(450, 'sine', 0.2, 0.15, 80);
// line 103
  }
// line 104
  metalBB() {
// line 105
    this.playTone(2400, 'sine', 0.04, 0.2, 3200);
// line 106
    this.playTone(1800, 'triangle', 0.06, 0.15, 800);
// line 107
  }
// line 108
bark() {
// line 109
    this.playTone(520, 'sawtooth', 0.08, 0.25, 220);
// line 110
    setTimeout(() => this.playTone(640, 'sawtooth', 0.09, 0.28, 280), 90);
// line 111
  }
// line 112
  lowBatteryWarning() {
// line 113
    this.playTone(850, 'square', 0.15, 0.18, 400);
// line 114
    setTimeout(() => this.playTone(850, 'square', 0.15, 0.18, 400), 200);
// line 115
  }
// line 116
}
// line 117
const sounds = new SoundEngine();
// line 118

// line 119
function toggleMuteSound() {
// line 120
  sounds.muted = !sounds.muted;
// line 121
  const btn = document.getElementById('btn-pause-sound');
// line 122
  if (btn) btn.innerText = sounds.muted ? '🔇 DŹWIĘK: OFF' : '🔊 DŹWIĘK: ON';
// line 123
}
// line 124

// line 125
// Canvas & Engine Constants
// line 126
const canvas = document.getElementById('gameCanvas');
// line 127
const ctx = canvas.getContext('2d', { alpha: false });
// line 128
let gameWidth = window.innerWidth;
// line 129
let gameHeight = window.innerHeight;
// line 130
let dpr = 1;
// line 131

// line 132
function resizeCanvas() {
// line 133
  gameWidth = window.innerWidth;
// line 134
  gameHeight = window.innerHeight;
// line 135
  // Optymalizacja Poco F6: Cap DPR to 1.5 to prevent massive fill rate issues on 1.5k/2k OLED displays
// line 136
  dpr = window.devicePixelRatio || 1;
// line 137
  canvas.width = Math.floor(gameWidth * dpr);
// line 138
  canvas.height = Math.floor(gameHeight * dpr);
// line 139
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
// line 140
  ctx.imageSmoothingEnabled = false; // Optymalizacja wydajności (pikselowa grafika)
// line 141
}
// line 142
window.addEventListener('resize', resizeCanvas);
// line 143
resizeCanvas();
// line 144

// line 145
const STATE = { START: 0, PLAYING: 1, LEVELUP: 2, GAMEOVER: 3, WIN: 4, PAUSED: 5, CHEST: 6 };
// line 146
let gameState = STATE.START;
// line 147

// line 148
const ARENA_WIDTH = 3800;
// line 149
const ARENA_HEIGHT = 3800;
// line 150

// line 151
// ============================================================================
// line 152
// CRIMSONLAND-DTA HYBRID ENGINE (SPLATTER, GIBS, POWER-UPS, GAME-CHANGER PERKS)
// line 153
// ============================================================================
// line 154

// line 155
// 1. Offscreen Splatter Canvas Target (Permanent Decals, 0 Draw Calls overhead)
// line 156
const splatterCanvas = document.createElement('canvas');
// line 157
splatterCanvas.width = ARENA_WIDTH;
// line 158
splatterCanvas.height = ARENA_HEIGHT;
// line 159
const splatterCtx = splatterCanvas.getContext('2d', { alpha: true });
// line 160

// line 161
function initSplatterEngine() {
// line 162
  splatterCtx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
// line 163
  console.log("CRIMSONLAND Splatter Engine Initialized: " + ARENA_WIDTH + "x" + ARENA_HEIGHT);
// line 164
}
// line 165
initSplatterEngine();
// line 166

// line 167
// ============================================================================
// line 168
// DTA DESTRUCTION ENGINE & RADIOWĘZEŁ SYSTEM (ZERO-GC)
// line 169
// ============================================================================
// line 170

// line 171
// Procedural Announcer Voice (Audio Synth / Web Speech / Sound Effects)
// line 172
function speakAnnouncer(msgText, alertColor = '#38bdf8') {
// line 173
  showAnnouncement('📢 RADIOWĘZEŁ: ' + msgText, alertColor);
// line 174
  sounds.alert();
// line 175
  if ('speechSynthesis' in window && Math.random() < 0.7) {
// line 176
    try {
// line 177
      window.speechSynthesis.cancel();
// line 178
      const u = new SpeechSynthesisUtterance(msgText);
// line 179
      u.lang = 'pl-PL';
// line 180
      u.pitch = 0.7; // Deep muffled warehouse speaker
// line 181
      u.rate = 1.1;
// line 182
      window.speechSynthesis.speak(u);
// line 183
    } catch(e) {}
// line 184
  }
// line 185
}
// line 186

// line 187
// Explosive ADR Barrels & High-Bay Shelves Pool
// line 188
const MAX_BARRELS = 35;
// line 189
const adrBarrels = new Array(MAX_BARRELS);
// line 190
for (let i = 0; i < MAX_BARRELS; i++) {
// line 191
  adrBarrels[i] = { x: 0, y: 0, hp: 40, active: false, type: 'gas', radius: 24, icon: '🛢️' };
// line 192
}
// line 193

// line 194
function spawnADRBarrel(x, y, type = 'gas') {
// line 195
  for (let i = 0; i < MAX_BARRELS; i++) {
// line 196
    const b = adrBarrels[i];
// line 197
    if (!b.active) {
// line 198
      b.active = true;
// line 199
      b.x = x;
// line 200
      b.y = y;
// line 201
      b.hp = 40;
// line 202
      b.type = type; // 'gas', 'acid', 'oil'
// line 203
      b.icon = type === 'gas' ? '🛢️' : (type === 'acid' ? '☣️' : '🛢️');
// line 204
      break;
// line 205
    }
// line 206
  }
// line 207
}
// line 208

// line 209
function initSectorEnvironment() {
// line 210
  // Clear and populate barrels & shelves per sector
// line 211
  for (let i = 0; i < MAX_BARRELS; i++) adrBarrels[i].active = false;
// line 212
  
// line 213
  // Spawn initial barrels near center aisles
// line 214
  const barrelTypes = ['gas', 'acid', 'oil'];
// line 215
  for (let i = 0; i < 20; i++) {
// line 216
    const bx = 300 + Math.random() * (ARENA_WIDTH - 600);
// line 217
    const by = 300 + Math.random() * (ARENA_HEIGHT - 600);
// line 218
    spawnADRBarrel(bx, by, barrelTypes[i % 3]);
// line 219
  }
// line 220
}
// line 221

// line 222
function explodeBarrel(b) {
// line 223
  b.active = false;
// line 224
  screenShake = Math.max(screenShake, 22);
// line 225
  sounds.pallet();
// line 226
  hitStopTimer = 0.05;
// line 227

// line 228
  let decalType = 'oil';
// line 229
  let blastColor = '#ea580c';
// line 230
  if (b.type === 'acid') { decalType = 'acid'; blastColor = '#84cc16'; }
// line 231
  else if (b.type === 'gas') { decalType = 'ink'; blastColor = '#ef4444'; }
// line 232

// line 233
  stampPermanentDecal(b.x, b.y, 45, decalType);
// line 234
  spawnGibs(b.x, b.y, 12, 'WOZEK');
// line 235
  createSparks(b.x, b.y, 30, blastColor);
// line 236
  addSpeechBubble(b.x, b.y, '💥 KATASTROFA ADR!', blastColor);
// line 237

// line 238
  // Area damage to enemies & chain reaction to other barrels
// line 239
  enemies.forEach(en => {
// line 240
    if (!en.dead && Math.hypot(en.x - b.x, en.y - b.y) < 180) {
// line 241
      damageEnemy(en, 250);
// line 242
    }
// line 243
  });
// line 244

// line 245
  adrBarrels.forEach(otherB => {
// line 246
    if (otherB.active && otherB !== b && Math.hypot(otherB.x - b.x, otherB.y - b.y) < 140) {
// line 247
      explodeBarrel(otherB); // Chain reaction!
// line 248
    }
// line 249
  });
// line 250
}
// line 251

// line 252
function updateAndRenderEnvironment(dt, ctx) {
// line 253
  // Render & Check ADR Barrels
// line 254
  for (let i = 0; i < MAX_BARRELS; i++) {
// line 255
    const b = adrBarrels[i];
// line 256
    if (b.active) {
// line 257
      // Check player collision / ramming
// line 258
      const dPlayer = Math.hypot(player.x - b.x, player.y - b.y);
// line 259
      if (dPlayer < b.radius + 20) {
// line 260
        explodeBarrel(b);
// line 261
        continue;
// line 262
      }
// line 263

// line 264
      ctx.save();
// line 265
      ctx.translate(b.x, b.y);
// line 266
      ctx.fillStyle = b.type === 'acid' ? '#84cc16' : (b.type === 'gas' ? '#ef4444' : '#0f172a');
// line 267
      ctx.beginPath();
// line 268
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
// line 269
      ctx.fill();
// line 270
      ctx.lineWidth = 2;
// line 271
      ctx.strokeStyle = '#f59e0b';
// line 272
      ctx.stroke();
// line 273

// line 274
      ctx.fillStyle = '#ffffff';
// line 275
      ctx.font = '16px sans-serif';
// line 276
      ctx.textAlign = 'center';
// line 277
      ctx.textBaseline = 'middle';
// line 278
      ctx.fillText(b.icon, 0, 0);
// line 279
      ctx.restore();
// line 280
    }
// line 281
  }
// line 282

// line 283
  // Orange Warning Beacon (Kogut Pomarańczowy Meta-Upgrade Effect)
// line 284
  if (workshopUpgrades.kogutOstrzegawczy > 0 && Math.random() < 0.1) {
// line 285
    enemies.forEach(en => {
// line 286
      if (!en.dead && Math.hypot(en.x - player.x, en.y - player.y) < 140) {
// line 287
        en.slowTimer = 1.0;
// line 288
      }
// line 289
    });
// line 290
  }
// line 291
}
// line 292

// line 293

// line 294
function stampPermanentDecal(x, y, radius, colorType) {
// line 295
  splatterCtx.save();
// line 296
  splatterCtx.beginPath();
// line 297
  
// line 298
  let color = '#7f1d1d'; // Crimson Blood / Red Stamp
// line 299
  if (colorType === 'oil') color = '#0f172a';
// line 300
  else if (colorType === 'coffee') color = '#78350f';
// line 301
  else if (colorType === 'acid') color = '#84cc16';
// line 302
  else if (colorType === 'ink') color = '#4338ca';
// line 303
  else if (colorType === 'folia') color = '#cbd5e1';
// line 304

// line 305
  const r = radius * (0.8 + Math.random() * 0.5);
// line 306
  splatterCtx.fillStyle = color;
// line 307
  splatterCtx.globalAlpha = 0.85;
// line 308
  splatterCtx.ellipse(x, y, r, r * 0.65, Math.random() * Math.PI, 0, Math.PI * 2);
// line 309
  splatterCtx.fill();
// line 310

// line 311
  // Splatter splashes around impact
// line 312
  const splashCount = 4 + Math.floor(Math.random() * 5);
// line 313
  for (let i = 0; i < splashCount; i++) {
// line 314
    const angle = Math.random() * Math.PI * 2;
// line 315
    const dist = r + Math.random() * r * 1.6;
// line 316
    const dropR = 2 + Math.random() * (r * 0.35);
// line 317
    splatterCtx.beginPath();
// line 318
    splatterCtx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, dropR, 0, Math.PI * 2);
// line 319
    splatterCtx.fill();
// line 320
  }
// line 321
  splatterCtx.restore();
// line 322
}
// line 323

// line 324
// 2. Physical Gibs Object Pool
// line 325
const MAX_GIBS = 400;
// line 326
const gibsPool = new Array(MAX_GIBS);
// line 327
for (let i = 0; i < MAX_GIBS; i++) {
// line 328
  gibsPool[i] = {
// line 329
    x: 0, y: 0, vx: 0, vy: 0, rot: 0, vRot: 0,
// line 330
    size: 10, type: 'helmet', active: false, life: 1.0, color: '#f59e0b'
// line 331
  };
// line 332
}
// line 333

// line 334
function spawnGibs(x, y, count = 6, enemyType = 'default') {
// line 335
  let spawned = 0;
// line 336
  let gibType = 'helmet';
// line 337
  if (enemyType.includes('KARTON') || enemyType.includes('PALETA')) gibType = 'wood';
// line 338
  else if (enemyType.includes('CELNIK') || enemyType.includes('AUDYTOR')) gibType = 'folder';
// line 339
  else if (enemyType.includes('WOZEK') || enemyType.includes('RAMPA')) gibType = 'wheel';
// line 340

// line 341
  for (let i = 0; i < MAX_GIBS; i++) {
// line 342
    const g = gibsPool[i];
// line 343
    if (!g.active) {
// line 344
      g.active = true;
// line 345
      g.x = x;
// line 346
      g.y = y;
// line 347
      const angle = Math.random() * Math.PI * 2;
// line 348
      const force = 180 + Math.random() * 340;
// line 349
      g.vx = Math.cos(angle) * force;
// line 350
      g.vy = Math.sin(angle) * force;
// line 351
      g.rot = Math.random() * Math.PI * 2;
// line 352
      g.vRot = (Math.random() - 0.5) * 14;
// line 353
      g.size = 8 + Math.random() * 10;
// line 354
      g.life = 2.0 + Math.random() * 1.5;
// line 355
      g.type = gibType;
// line 356
      spawned++;
// line 357
      if (spawned >= count) break;
// line 358
    }
// line 359
  }
// line 360
}
// line 361

// line 362
function updateAndRenderGibs(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016); {
// line 363
  for (let i = 0; i < MAX_GIBS; i++) {
// line 364
    const g = gibsPool[i];
// line 365
    if (g.active) {
// line 366
      g.x += g.vx * dt;
// line 367
      g.y += g.vy * dt;
// line 368
      g.vx *= 0.91;
// line 369
      g.vy *= 0.91;
// line 370
      g.rot += g.vRot * dt;
// line 371
      g.life -= dt;
// line 372

// line 373
      if (g.life <= 0 || (Math.abs(g.vx) < 5 && Math.abs(g.vy) < 5 && g.life < 1.0)) {
// line 374
        g.active = false;
// line 375
        let cType = 'blood';
// line 376
        if (g.type === 'wood') cType = 'coffee';
// line 377
        else if (g.type === 'wheel') cType = 'oil';
// line 378
        stampPermanentDecal(g.x, g.y, g.size * 0.7, cType);
// line 379
        continue;
// line 380
      }
// line 381

// line 382
      ctx.save();
// line 383
      ctx.translate(g.x, g.y);
// line 384
      ctx.rotate(g.rot);
// line 385
      if (g.type === 'helmet') ctx.fillStyle = '#f59e0b';
// line 386
      else if (g.type === 'folder') ctx.fillStyle = '#38bdf8';
// line 387
      else if (g.type === 'wood') ctx.fillStyle = '#78350f';
// line 388
      else ctx.fillStyle = '#1e293b';
// line 389

// line 390
      ctx.fillRect(-g.size / 2, -g.size / 2, g.size, g.size);
// line 391
      ctx.lineWidth = 1;
// line 392
      ctx.strokeStyle = '#000000';
// line 393
      ctx.strokeRect(-g.size / 2, -g.size / 2, g.size, g.size);
// line 394
      ctx.restore();
// line 395
    }
// line 396
  }
// line 397
}
// line 398

// line 399
// 3. Instant Power-Ups Drop System
// line 400
const MAX_POWERUPS = 30;
// line 401
const powerUpPool = new Array(MAX_POWERUPS);
// line 402
for (let i = 0; i < MAX_POWERUPS; i++) {
// line 403
  powerUpPool[i] = { x: 0, y: 0, type: 'nuke', active: false, timer: 15.0, icon: '💣', label: 'AWARATOR 3000' };
// line 404
}
// line 405

// line 406
let bulletTimeTimer = 0;
// line 407
let freezeTimer = 0;
// line 408
let fireBulletsTimer = 0;
// line 409
let kamikazeTimer = 0;
// line 410

// line 411
function trySpawnPowerUp(x, y) {
// line 412
  if (Math.random() > 0.06) return; // 6% chance per kill
// line 413
  const types = [
// line 414
    { type: 'nuke', icon: '💣', label: 'AWARATOR 3000' },
// line 415
    { type: 'bullet_time', icon: '⏱️', label: 'SETKA Z ŻABKI' },
// line 416
    { type: 'freeze', icon: '❄️', label: 'NALOT PIP' },
// line 417
    { type: 'fire_bullets', icon: '🔥', label: 'PROMOCJA ENERGETYKI' },
// line 418
    { type: 'heal_battery', icon: '🧯', label: 'GAŚNICA AWARYJNA' }
// line 419
  ];
// line 420
  const selected = types[Math.floor(Math.random() * types.length)];
// line 421
  for (let i = 0; i < MAX_POWERUPS; i++) {
// line 422
    const p = powerUpPool[i];
// line 423
    if (!p.active) {
// line 424
      p.active = true;
// line 425
      p.x = x;
// line 426
      p.y = y;
// line 427
      p.type = selected.type;
// line 428
      p.icon = selected.icon;
// line 429
      p.label = selected.label;
// line 430
      p.timer = 16.0;
// line 431
      break;
// line 432
    }
// line 433
  }
// line 434
}
// line 435

// line 436
function updateAndRenderPowerUps(dummyDt, ctx) { const dt = (typeof gameDt !== "undefined" ? gameDt : 0.016); {
// line 437
  for (let i = 0; i < MAX_POWERUPS; i++) {
// line 438
    const p = powerUpPool[i];
// line 439
    if (p.active) {
// line 440
      p.timer -= dt;
// line 441
      if (p.timer <= 0) {
// line 442
        p.active = false;
// line 443
        continue;
// line 444
      }
// line 445

// line 446
      // Magnet pull to player
// line 447
      const d = Math.hypot(player.x - p.x, player.y - p.y);
// line 448
      if (d < player.magnetRange) {
// line 449
        p.x += ((player.x - p.x) / d) * 350 * dt;
// line 450
        p.y += ((player.y - p.y) / d) * 350 * dt;
// line 451
      }
// line 452

// line 453
      // Pickup collision
// line 454
      if (d < 35) {
// line 455
        p.active = false;
// line 456
        triggerPowerUpEffect(p);
// line 457
        continue;
// line 458
      }
// line 459

// line 460
      // Render floating icon
// line 461
      ctx.save();
// line 462
      const bounceY = Math.sin(gameTime * 6 + i) * 6;
// line 463
      ctx.translate(p.x, p.y + bounceY);
// line 464

// line 465
      // Glowing aura ring
// line 466
      ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
// line 467
      ctx.beginPath();
// line 468
      ctx.arc(0, 0, 22 + Math.sin(gameTime * 8) * 3, 0, Math.PI * 2);
// line 469
      ctx.fill();
// line 470

// line 471
      ctx.fillStyle = '#ffffff';
// line 472
      ctx.font = '22px sans-serif';
// line 473
      ctx.textAlign = 'center';
// line 474
      ctx.textBaseline = 'middle';
// line 475
      ctx.fillText(p.icon, 0, 0);
// line 476
      ctx.restore();
// line 477
    }
// line 478
  }
// line 479
}
// line 480

// line 481
function triggerPowerUpEffect(p) {
// line 482
  sounds.levelUp();
// line 483
  screenShake = 16;
// line 484
  if (p.type === 'nuke') {
// line 485
    screenShake = 28;
// line 486
    hitStopTimer = 0.08;
// line 487
    enemies.forEach(en => {
// line 488
      if (!en.dead && !en.isBoss) {
// line 489
        en.hp = 0;
// line 490
        killEnemy(en);
// line 491
      }
// line 492
    });
// line 493
    addSpeechBubble(player.x, player.y - 45, '💣 AWARATOR 3000: HALA EKSPLODOWANA!', '#ef4444');
// line 494
    showAnnouncement('💣 AWARATOR 3000: CZYSZCZENIE EKRANU!', '#ef4444');
// line 495
  } else if (p.type === 'bullet_time') {
// line 496
    bulletTimeTimer = 6.0;
// line 497
    addSpeechBubble(player.x, player.y - 45, '⏱️ SETKA Z ŻABKI: BULLET-TIME!', '#f59e0b');
// line 498
    showAnnouncement('⏱️ BULLET-TIME 120Hz ACTIVATED!', '#f59e0b');
// line 499
  } else if (p.type === 'freeze') {
// line 500
    freezeTimer = 7.0;
// line 501
    addSpeechBubble(player.x, player.y - 45, '❄️ NALOT PIP: WSTRZYMANIE RUCHU!', '#38bdf8');
// line 502
    showAnnouncement('❄️ NALOT PROKURATORA PIP: KWARANTANNA!', '#38bdf8');
// line 503
  } else if (p.type === 'fire_bullets') {
// line 504
    fireBulletsTimer = 8.0;
// line 505
    addSpeechBubble(player.x, player.y - 45, '🔥 ENERGETYK: PODWÓJNA SALWA!', '#facc15');
// line 506
    showAnnouncement('🔥 PROMOCJA ENERGETYKI: FIRE-BULLETS!', '#facc15');
// line 507
  } else if (p.type === 'heal_battery') {
// line 508
    player.battery = player.maxBattery;
// line 509
    addSpeechBubble(player.x, player.y - 45, '🧯 BATERIA PEŁNA 100%!', '#22c55e');
// line 510
    showAnnouncement('🧯 GAŚNICA: REGENERACJA BATERII 100%', '#22c55e');
// line 511
  }
// line 512
}
// line 513

// line 514
const SHIFT_START_MINUTES = 3 * 60 + 15; // 03:15
// line 515
const SHIFT_END_MINUTES = 7 * 60;        // 07:00
// line 516
const TOTAL_SHIFT_DURATION = 600;        // 10 min (2 min per sector with intense boss climax)
// line 517

// line 518
let gameTime = 0;
// line 519
let score = 0;
// line 520
let kills = 0;
// line 521
let comboCount = 0;
// line 522
let comboTimer = 0;
// line 523
let maxCombo = 0;
// line 524
let packageCombo = 0;
// line 525
let packageComboTimer = 0;
// line 526
let maxPackageCombo = 0;
// line 527
let playerLevel = 1;
// line 528
let currentXP = 0;
// line 529
let neededXP = 8;
// line 530
let lowBatteryTimer = 0;
// line 531
let coffeeDashCount = 0;
// line 532

// line 533
// Camera (Wider Field of View for tactical awareness)
// line 534
const camera = { x: 0, y: 0, zoom: 0.50 };
// line 535
function toggleZoom() {
// line 536
  if (camera.zoom >= 0.58) camera.zoom = 0.50;
// line 537
  else if (camera.zoom >= 0.48) camera.zoom = 0.40;
// line 538
  else camera.zoom = 0.60;
// line 539
  const el = document.getElementById('badge-zoom-label');
// line 540
  if (el) el.innerText = camera.zoom.toFixed(2) + 'x';
// line 541
}
// line 542
let screenShake = 0;
// line 543

// line 544
// Crimsonland Blood & Epoxy Stains
// line 545
const bloodStains = [];
// line 546
function addBloodStain(x, y, enemyInfo) {
// line 547
  if (bloodStains.length > 180) bloodStains.shift();
// line 548
  
// line 549
  let col = '#991b1b'; // Default human blood
// line 550
  let radius = Math.random() * 12 + 10;
// line 551
  if (enemyInfo) {
// line 552
    if (enemyInfo.name === 'Rolka Folii Strecz' || enemyInfo.name === 'Resztka Folii') {
// line 553
      col = '#cbd5e1'; // Stretch wrap shreds
// line 554
      radius = 16;
// line 555
    } else if (enemyInfo.name === 'Zbłąkany Karton B2C' || enemyInfo.name === 'Zablokowana Paleta EURO') {
// line 556
      col = '#78350f'; // Cardboard / Wood pulp
// line 557
      radius = 18;
// line 558
    } else if (enemyInfo.name === 'Wózek z Awarią' || enemyInfo.name === 'Mobilna Rampa') {
// line 559
      col = '#0f172a'; // Black hydraulic oil
// line 560
      radius = 22;
// line 561
    } else if (enemyInfo.isBoss) {
// line 562
      col = '#dc2626'; // Boss massive stain
// line 563
      radius = 35;
// line 564
    }
// line 565
  }
// line 566
  
// line 567
bloodStains.push({
// line 568
    x: x,
// line 569
    y: y,
// line 570
    color: col,
// line 571
    radius: radius,
// line 572
    rot: Math.random() * Math.PI * 2,
// line 573
    life: 1.0
// line 574
  });
// line 575

// line 576
  // Spawn dynamic blood particles
// line 577
  const particleCount = enemyInfo && enemyInfo.isBoss ? 25 : 8;
// line 578
  for (let i = 0; i < particleCount; i++) {
// line 579
    const angle = Math.random() * Math.PI * 2;
// line 580
    const speed = Math.random() * (enemyInfo && enemyInfo.isBoss ? 12 : 5);
// line 581
    spawnParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.4 + Math.random() * 0.4, Math.random() * 3 + 2, col);
// line 582
  }
// line 583
}
// line 584

// line 585
// Kluska Companion (Suczka Piotra - Kundel Magazynowy)
// line 586
const kluska = {
// line 587
  x: 0,
// line 588
  y: 0,
// line 589
  vx: 0,
// line 590
  vy: 0,
// line 591
  angle: 0,
// line 592
  active: false,
// line 593
  rageTimer: 0,
// line 594
  barkTimer: 0,
// line 595
  animFrame: 0
// line 596
};
// line 597

// line 598
function updateKluska(dt) {
// line 599
  if (selectedCharKey !== 'piotr' && !kluska.active) return;
// line 600
  
// line 601
  if (!kluska.x || !kluska.y) {
// line 602
    kluska.x = player.x - 35;
// line 603
    kluska.y = player.y - 35;
// line 604
  }
// line 605
  
// line 606
  kluska.animFrame += dt * 12;
// line 607
  
// line 608
  if (kluska.rageTimer > 0) {
// line 609
    kluska.rageTimer -= dt;
// line 610
    // RAGE MODE: Find nearest enemy or barcode and zoom at super speed!
// line 611
    let target = null;
// line 612
    let minDist = 99999;
// line 613
    for (let i = 0; i < enemies.length; i++) {
// line 614
      const e = enemies[i];
// line 615
      if (e.dead) continue;
// line 616
      const d = Math.hypot(e.x - kluska.x, e.y - kluska.y);
// line 617
      if (d < minDist) { minDist = d; target = e; }
// line 618
    }
// line 619
    
// line 620
    if (target) {
// line 621
      const a = Math.atan2(target.y - kluska.y, target.x - kluska.x);
// line 622
      kluska.angle = a;
// line 623
      kluska.x += Math.cos(a) * 9.5;
// line 624
      kluska.y += Math.sin(a) * 9.5;
// line 625
      
// line 626
      if (minDist < target.info.radius + 18) {
// line 627
        damageEnemy(target, 110);
// line 628
        target.slowTimer = 2.0;
// line 629
        createSparks(target.x, target.y, 8, '#f59e0b');
// line 630
        addBloodStain(target.x, target.y, target.info);
// line 631
        if (Math.random() < 0.2) {
// line 632
          addSpeechBubble(kluska.x, kluska.y - 20, '🐕 HAU! GRYZĘ W KOSTKĘ!', '#fbbf24');
// line 633
        }
// line 634
      }
// line 635
    } else {
// line 636
      kluska.x += (player.x + Math.cos(gameTime * 6) * 50 - kluska.x) * 0.12;
// line 637
      kluska.y += (player.y + Math.sin(gameTime * 6) * 50 - kluska.y) * 0.12;
// line 638
    }
// line 639
    
// line 640
    // Magnet ALL barcodes on screen straight to player!
// line 641
    for (let i = dropItems.length - 1; i >= 0; i--) {
// line 642
      const item = dropItems[i];
// line 643
      const distK = Math.hypot(item.x - kluska.x, item.y - kluska.y);
// line 644
      if (item.type === 'golden_velvet' && distK < 35) {
// line 645
        sounds.achieve();
// line 646
        screenShake = 10;
// line 647
        player.invulnTimer = 10.0;
// line 648
        player.stamina = player.maxStamina;
// line 649
        createSparks(player.x, player.y, 40, '#facc15');
// line 650
        addSpeechBubble(player.x, player.y - 40, '🌟 NIEŚMIERTELNOŚĆ VELVET OVERDRIVE (10s)!', '#facc15');
// line 651
        dropItems.splice(i, 1);
// line 652
        continue;
// line 653
      } else if (item.type === 'barcode_xp') {
// line 654
        const dx = player.x - item.x;
// line 655
        const dy = player.y - item.y;
// line 656
        item.x += dx * 0.18;
// line 657
        item.y += dy * 0.18;
// line 658
      }
// line 659
    }
// line 660
    
// line 661
    kluska.barkTimer -= dt;
// line 662
    if (kluska.barkTimer <= 0) {
// line 663
      kluska.barkTimer = 0.55;
// line 664
      sounds.bark();
// line 665
      addSpeechBubble(kluska.x, kluska.y - 22, '🐕 HAU HAU! KLUSKA W AKCJI!', '#facc15');
// line 666
    }
// line 667
  } else {
// line 668
    // NORMAL MODE: Trots faithfully near Piotr
// line 669
    const targetX = player.x - Math.cos(player.angle) * 35;
// line 670
    const targetY = player.y - Math.sin(player.angle) * 35;
// line 671
    const dx = targetX - kluska.x;
// line 672
    const dy = targetY - kluska.y;
// line 673
    const dist = Math.hypot(dx, dy);
// line 674
    
// line 675
    if (dist > 15) {
// line 676
      kluska.angle = Math.atan2(dy, dx);
// line 677
      kluska.x += dx * 0.09;
// line 678
      kluska.y += dy * 0.09;
// line 679
    }
// line 680
    
// line 681
    for (let i = dropItems.length - 1; i >= 0; i--) {
// line 682
      const item = dropItems[i];
// line 683
      const distK = Math.hypot(item.x - kluska.x, item.y - kluska.y);
// line 684
      if (item.type === 'golden_velvet' && distK < 35) {
// line 685
        sounds.achieve();
// line 686
        screenShake = 10;
// line 687
        player.invulnTimer = 10.0;
// line 688
        player.stamina = player.maxStamina;
// line 689
        createSparks(player.x, player.y, 40, '#facc15');
// line 690
        addSpeechBubble(player.x, player.y - 40, '🌟 NIEŚMIERTELNOŚĆ VELVET OVERDRIVE (10s)!', '#facc15');
// line 691
        dropItems.splice(i, 1);
// line 692
        continue;
// line 693
      } else if (item.type === 'barcode_xp') {
// line 694
        if (distK < 160) {
// line 695
          item.x += (player.x - item.x) * 0.14;
// line 696
          item.y += (player.y - item.y) * 0.14;
// line 697
        }
// line 698
      }
// line 699
    }
// line 700
  }
// line 701
}
// line 702

// line 703
function drawKluska(ctx) {
// line 704
  if (selectedCharKey !== 'piotr' && !kluska.active) return;
// line 705
  
// line 706
  ctx.save();
// line 707
  ctx.translate(kluska.x, kluska.y);
// line 708
  ctx.rotate(kluska.angle);
// line 709
  
// line 710
  // Shadow
// line 711
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
// line 712
  ctx.beginPath();
// line 713
  ctx.ellipse(-1, 3, 13, 7, 0, 0, Math.PI * 2);
// line 714
  ctx.fill();
// line 715
  
// line 716
  // Body (Tan/Brown mongrel)
// line 717
  ctx.fillStyle = '#b45309';
// line 718
  ctx.beginPath();
// line 719
  ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
// line 720
  ctx.fill();
// line 721
  ctx.lineWidth = 1.5;
// line 722
  ctx.strokeStyle = '#78350f';
// line 723
  ctx.stroke();
// line 724
  
// line 725
  // Hi-Vis BHP Safety Vest on back
// line 726
  ctx.fillStyle = '#facc15';
// line 727
  ctx.fillRect(-6, -6, 12, 12);
// line 728
  ctx.strokeStyle = '#ea580c';
// line 729
  ctx.lineWidth = 1;
// line 730
  ctx.strokeRect(-6, -6, 12, 12);
// line 731
  ctx.fillStyle = '#000000';
// line 732
  ctx.font = 'bold 6px sans-serif';
// line 733
  ctx.fillText('BHP', -5, 2);
// line 734
  
// line 735
  // Head
// line 736
  ctx.fillStyle = '#d97706';
// line 737
  ctx.beginPath();
// line 738
  ctx.arc(9, 0, 6.5, 0, Math.PI * 2);
// line 739
  ctx.fill();
// line 740
  ctx.stroke();
// line 741
  
// line 742
  // Floppy Ears
// line 743
  ctx.fillStyle = '#78350f';
// line 744
  ctx.beginPath();
// line 745
  ctx.arc(7, -6, 3, 0, Math.PI * 2);
// line 746
  ctx.arc(7, 6, 3, 0, Math.PI * 2);
// line 747
  ctx.fill();
// line 748
  
// line 749
  // Black Snout & Nose
// line 750
  ctx.fillStyle = '#000000';
// line 751
  ctx.beginPath();
// line 752
  ctx.arc(13, 0, 2, 0, Math.PI * 2);
// line 753
  ctx.fill();
// line 754
  
// line 755
  // Wagging Tail
// line 756
  const tailAngle = Math.sin(kluska.animFrame * (kluska.rageTimer > 0 ? 3 : 1)) * 0.6;
// line 757
  ctx.strokeStyle = '#b45309';
// line 758
  ctx.lineWidth = 2.5;
// line 759
  ctx.beginPath();
// line 760
  ctx.moveTo(-11, 0);
// line 761
  ctx.lineTo(-18, Math.sin(tailAngle) * 9);
// line 762
  ctx.stroke();
// line 763
  
// line 764
  // Legs animation
// line 765
  const legWiggle = Math.sin(kluska.animFrame * 2) * 4;
// line 766
  ctx.fillStyle = '#78350f';
// line 767
  ctx.beginPath(); ctx.arc(-5 + legWiggle, -7, 2, 0, Math.PI * 2); ctx.fill();
// line 768
  ctx.beginPath(); ctx.arc(5 - legWiggle, -7, 2, 0, Math.PI * 2); ctx.fill();
// line 769
  ctx.beginPath(); ctx.arc(-5 - legWiggle, 7, 2, 0, Math.PI * 2); ctx.fill();
// line 770
  ctx.beginPath(); ctx.arc(5 + legWiggle, 7, 2, 0, Math.PI * 2); ctx.fill();
// line 771
  
// line 772
  if (kluska.rageTimer > 0) {
// line 773
    ctx.strokeStyle = '#ef4444';
// line 774
    ctx.lineWidth = 2;
// line 775
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.stroke();
// line 776
  }
// line 777
  
// line 778
  ctx.restore();
// line 779
}
// line 780

// line 781
// --- CHARACTERS ---
// line 782
const CHARACTERS = {
// line 783
  piotr: {
// line 784
    id: 'piotr',
// line 785
    name: 'Piotr & Kluska 🐕',
// line 786
    icon: '📦🐕',
// line 787
    speed: 175,
// line 788
    maxBattery: 110,
// line 789
    magnet: 190,
// line 790
    critBonus: 0.20,
// line 791
    attackSpeedMult: 1.35, // Pasywka: Szybkie Ładowanie (+35% szybszy atak)
// line 792
    skillIcon: '🔫🐕',
// line 793
    skillLabel: 'GAZ & KLUSKA',
// line 794
    skillCooldown: 6.0
// line 795
  },
// line 796
  mirek: {
// line 797
    id: 'mirek',
// line 798
    name: 'Pan Mirek (Złota Rączka)',
// line 799
    icon: '🔧',
// line 800
    speed: 170,
// line 801
    maxBattery: 135,
// line 802
    magnet: 175,
// line 803
    critBonus: 0.22,
// line 804
    attackSpeedMult: 1.15,
// line 805
    regenRate: 0.6, // Pasywka: Samonaprawa wózka
// line 806
    skillIcon: '🔨⚡',
// line 807
    skillLabel: 'MŁOT UDAR',
// line 808
    skillCooldown: 6.0
// line 809
  },
// line 810
  klaus: {
// line 811
    id: 'klaus',
// line 812
    name: 'Audytor Klaus (Centrala)',
// line 813
    icon: '🇩🇪',
// line 814
    speed: 180,
// line 815
    maxBattery: 115,
// line 816
    magnet: 220,
// line 817
    critBonus: 0.30,
// line 818
    attackSpeedMult: 1.25, // Niemiecka precyzja DIN
// line 819
    skillIcon: '🖋️🚨',
// line 820
    skillLabel: 'AUDYT DIN',
// line 821
    skillCooldown: 6.5
// line 822
  },
// line 823
  radek: {
// line 824
    id: 'radek',
// line 825
    name: 'Radek (Weteran BT)',
// line 826
    icon: '🚜',
// line 827
    speed: 195,
// line 828
    maxBattery: 105,
// line 829
    magnet: 155,
// line 830
    critBonus: 0.20,
// line 831
    attackSpeedMult: 1.05,
// line 832
    skillIcon: '💨',
// line 833
    skillLabel: 'SZARŻA',
// line 834
    skillCooldown: 6.5
// line 835
  },
// line 836
  pawel: {
// line 837
    id: 'pawel',
// line 838
    name: 'Paweł (Ekspert EPAL)',
// line 839
    icon: '🪵',
// line 840
    speed: 165,
// line 841
    maxBattery: 130,
// line 842
    magnet: 165,
// line 843
    critBonus: 0.12,
// line 844
    attackSpeedMult: 1.12,
// line 845
    skillIcon: '🪵',
// line 846
    skillLabel: 'SALWA',
// line 847
    skillCooldown: 7.0
// line 848
  },
// line 849
  marcin: {
// line 850
    id: 'marcin',
// line 851
    name: 'Marcin (Nocny Wojownik)',
// line 852
    icon: '🧻',
// line 853
    speed: 175,
// line 854
    maxBattery: 100,
// line 855
    magnet: 200,
// line 856
    critBonus: 0.15,
// line 857
    attackSpeedMult: 1.20,
// line 858
    skillIcon: '🧻',
// line 859
    skillLabel: 'VELVET',
// line 860
    skillCooldown: 6.0
// line 861
  },
// line 862
  kierownik_marcin: {
// line 863
    id: 'kierownik_marcin',
// line 864
    name: 'Kierownik Marcin',
// line 865
    icon: '📢',
// line 866
    speed: 170,
// line 867
    maxBattery: 155,
// line 868
    magnet: 155,
// line 869
    critBonus: 0.12,
// line 870
    attackSpeedMult: 1.08,
// line 871
    skillIcon: '📢',
// line 872
    skillLabel: 'MEGAFON',
// line 873
    skillCooldown: 7.5
// line 874
  },
// line 875
  przemek_biuro: {
// line 876
    id: 'przemek_biuro',
// line 877
    name: 'Przemek z biura',
// line 878
    icon: '💻',
// line 879
    speed: 180,
// line 880
    maxBattery: 95,
// line 881
    magnet: 280, // Szalony zasięg XP WMS
// line 882
    critBonus: 0.28,
// line 883
    attackSpeedMult: 1.25,
// line 884
    skillIcon: '💻',
// line 885
    skillLabel: 'KOD WMS',
// line 886
    skillCooldown: 6.5
// line 887
  },
// line 888
  ania_biuro: {
// line 889
    id: 'ania_biuro',
// line 890
    name: 'Ania z biura',
// line 891
    icon: '📋',
// line 892
    speed: 175,
// line 893
    maxBattery: 100,
// line 894
    magnet: 195,
// line 895
    critBonus: 0.40, // Potężne krytyki celne SAD
// line 896
    attackSpeedMult: 1.15,
// line 897
    skillIcon: '❄️',
// line 898
    skillLabel: 'BLOKADA',
// line 899
    skillCooldown: 6.5
// line 900
  },
// line 901
  grzesiek_zastepca: {
// line 902
    id: 'grzesiek_zastepca',
// line 903
    name: 'Grzesiek (Z-ca Kiero)',
// line 904
    icon: '☕',
// line 905
    speed: 170,
// line 906
    maxBattery: 140,
// line 907
    magnet: 160,
// line 908
    critBonus: 0.15,
// line 909
    attackSpeedMult: 1.15,
// line 910
    skillIcon: '🛡️',
// line 911
    skillLabel: 'BHP',
// line 912
    skillCooldown: 6.5
// line 913
  }
// line 914
};
// line 915
let selectedCharKey = 'piotr';
// line 916
let selectedGameMode = 'standard'; // 'standard' or 'endless'
// line 917
let selectedArenaKey = 'main'; // 'main', 'freezer', 'crossdock'
// line 918

// line 919
function selectGameMode(mode, el) {
// line 920
  selectedGameMode = mode;
// line 921
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
// line 922
  if (el) el.classList.add('selected');
// line 923
}
// line 924

// line 925
function selectArena(arena, el) {
// line 926
  selectedArenaKey = arena;
// line 927
  document.querySelectorAll('.arena-card').forEach(a => a.classList.remove('selected'));
// line 928
  if (el) el.classList.add('selected');
// line 929
}
// line 930

// line 931
function selectCharacter(key, el) {
// line 932
  selectedCharKey = key;
// line 933
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
// line 934
  if (el) el.classList.add('selected');
// line 935
  const c = CHARACTERS[key];
// line 936
  if (c) {
// line 937
    const skillIcon = document.getElementById('skill-icon');
// line 938
    if (skillIcon) skillIcon.innerText = c.skillIcon;
// line 939
    const skillLabel = document.getElementById('skill-label');
// line 940
    if (skillLabel) skillLabel.innerText = c.skillLabel;
// line 941
    const badgeChar = document.getElementById('badge-char');
// line 942
    if (badgeChar) badgeChar.innerText = `${c.icon} ${c.name.split(' ')[0]}`;
// line 943
  }
// line 944
}
// line 945

// line 946
// --- PLAYER STATE ---
// line 947
const player = {
// line 948
  x: ARENA_WIDTH / 2,
// line 949
  y: ARENA_HEIGHT / 2,
// line 950
  vx: 0,
// line 951
  vy: 0,
// line 952
  angle: 0,
// line 953
  speed: 175,
// line 954
  battery: 100,
// line 955
  maxBattery: 100,
// line 956
  radius: 14,
// line 957
  invulnTimer: 0,
// line 958
  skillCooldown: 0,
// line 959
  maxSkillCooldown: 7,
// line 960
  detentionCooldown: 0,
// line 961
  maxDetentionCooldown: 18,
// line 962
  magnetRange: 180,
// line 963
  critChance: 0.1,
// line 964
  shield: 0,
// line 965
  isDashing: false,
// line 966
  dashTimer: 0,
// line 967
  isForklift: false,
// line 968
  wantsForklift: false,
// line 969
  stamina: 100,
// line 970
  staminaLock: false,
// line 971
  maxStamina: 100,
// line 972
  regenRate: 0
// line 973
};
// line 974

// line 975
// --- WEAPONS & PASSIVES ---
// line 976
const weapons = {
// line 977
  scanner: { level: 1, timer: 0, cooldown: 0.75, damage: 32, range: 450, pierce: 2, icon: '🔦', isEvo: false },
// line 978
  toiletPaper: { level: 0, timer: 0, cooldown: 1.2, damage: 45, speed: 380, count: 2, icon: '🧻', isEvo: false },
// line 979
  stretchAura: { level: 0, angle: 0, damage: 22, radius: 100, count: 2, icon: '🌀', isEvo: false },
// line 980
  pallets: { level: 0, timer: 0, cooldown: 1.5, damage: 75, speed: 420, icon: '🪵', isEvo: false },
// line 981
  extinguisher: { level: 0, timer: 0, cooldown: 2.2, damage: 40, range: 260, icon: '🧯', isEvo: false },
// line 982
  zipTies: { level: 0, timer: 0, cooldown: 1.0, damage: 28, speed: 480, icon: '🔗', isEvo: false },
// line 983
  cutter: { level: 0, timer: 0, cooldown: 0.55, damage: 18, speed: 560, icon: '🔪', isEvo: false },
// line 984
  stapler: { level: 0, timer: 0, cooldown: 0.85, damage: 35, speed: 520, count: 3, icon: '📌', isEvo: false },
// line 985
  sledgehammer: { level: 0, timer: 0, cooldown: 2.4, damage: 95, radius: 150, icon: '🔨', isEvo: false },
// line 986
  faktura: { level: 0, timer: 0, cooldown: 1.8, damage: 60, speed: 450, icon: '📄', isEvo: false },
// line 987
  kawa: { level: 0, timer: 0, cooldown: 3.0, damage: 15, radius: 120, icon: '☕', isEvo: false },
// line 988
  hydrant: { level: 0, timer: 0, cooldown: 1.6, damage: 65, range: 400, icon: '🚰', isEvo: false },
// line 989
  megafon: { level: 0, timer: 0, cooldown: 2.1, damage: 40, range: 250, icon: '📢', isEvo: false }
// line 990
};
// line 991

// line 992
const passives = {
// line 993
  magnet: { level: 0, max: 3, name: 'Certyfikat ISO', icon: '📜', desc: '+60% zasięgu przyciągania XP (+Area Zasięg)' },
// line 994
  forks: { level: 0, max: 3, name: 'Protokół BHP', icon: '📋', desc: '+40% obrażeń od taranowania (+Duration Czas)' },
// line 995
  coffee: { level: 0, max: 3, name: 'Smar Syntetyczny', icon: '🛢️', desc: '+15% prędkości ruchu (+Speed Ruch)' },
// line 996
  battery: { level: 0, max: 3, name: 'Super Bateria', icon: '🔋', desc: '+35% pojemności baterii (+Cooldown Szybkość)' },
// line 997
  furia: { level: 0, max: 3, name: 'Furia Magazyniera', icon: '🤬', desc: '+25% Szybkości Ataku' },
// line 998
  alkomat: { level: 0, max: 3, name: 'Unik przed Alkomatem', icon: '🍺', desc: '+15% szans na Unik' },
// line 999
  stoperan: { level: 0, max: 3, name: 'Stoperan Przed Zmianą', icon: '💊', desc: '+30 do Max Baterii (HP)' },
// line 1000
  buty_robocze: { level: 0, max: 3, name: 'Buty Robocze S3', icon: '🥾', desc: 'Zadajesz obrażenia wrogom, którzy Cię dotkną' },
// line 1001
  karta_multisport: { level: 0, max: 3, name: 'Karta Multisport', icon: '💳', desc: 'Szybsza regeneracja wózka i prędkość +10' },
// line 1002
  paczek: { level: 0, max: 3, name: 'Pączek z Biedronki', icon: '🍩', desc: '+20% Szans na Krytyk i +25% dropu jedzenia/kawy' },
// line 1003
  kamizelka: { level: 0, max: 3, name: 'Kamizelka Odblaskowa', icon: '🦺', desc: '-25% Otrzymywanych Obrażeń i oślepianie wrogów' },
// line 1004
  umowa: { level: 0, max: 3, name: 'Umowa Czas Nieokreślony', icon: '📜', desc: '+25% XP i 1x Ochrona przed Śmiercią (Extra Life!)' }
// line 1005
};
// line 1006

// line 1007
// Evolutions Definitions
// line 1008
const EVOLUTIONS = {
// line 1009
  bramkaRFID: {
// line 1010
    id: 'bramkaRFID', name: '📡 Przemysłowa Bramka RFID', icon: '⚡', reqWeapon: 'scanner', reqPassive: 'battery',
// line 1011
    desc: 'Emituje stałą, obrotową siatkę laserową. Wrogowie dropią +50% XP!'
// line 1012
  },
// line 1013
  owijarka: {
// line 1014
    id: 'owijarka', name: '🌀 Automatyczna Owijarka', icon: '🧻', reqWeapon: 'toiletPaper', reqPassive: 'magnet',
// line 1015
    desc: 'Stały pierścień ze streczu. Unieruchamia i detonuje wrogów!'
// line 1016
  },
// line 1017
  btHighStack: {
// line 1018
    id: 'btHighStack', name: '🚜 Wózek BT High-Stack', icon: '🪵', reqWeapon: 'pallets', reqPassive: 'coffee',
// line 1019
    desc: 'Zostawia ślad śliskiego oleju i automatycznie taranuje wrogów!'
// line 1020
  },
// line 1021
  zraszacz: {
// line 1022
    id: 'zraszacz', name: '❄️ System Zraszaczowy PPOŻ', icon: '🧯', reqWeapon: 'extinguisher', reqPassive: 'forks',
// line 1023
    desc: 'Co 10s mrozi WSZYSTKICH wrogów na ekranie!'
// line 1024
  },
// line 1025
  steelTies: {
// line 1026
    id: 'steelTies', name: '🔗 Stalowe Trytytki', icon: '🔗', reqWeapon: 'zipTies', reqPassive: 'magnet',
// line 1027
    desc: 'Zatrzymuje wrogów na wieki i przebija tłumy!'
// line 1028
  },
// line 1029
  machete: {
// line 1030
    id: 'machete', name: '🔪 Ostrze Stanley Max', icon: '🔪', reqWeapon: 'cutter', reqPassive: 'forks',
// line 1031
    desc: 'Ostre jak brzytwa ostrza latające po całej hali!'
// line 1032
  },
// line 1033
  staplerGun: {
// line 1034
    id: 'staplerGun', name: '💥 Pneumatyczny Działobit', icon: '📌', reqWeapon: 'stapler', reqPassive: 'battery',
// line 1035
    desc: 'Nieustanna salwa rykoszetujących klamer stalowych!'
// line 1036
  },
// line 1037
hydraulicHammer: {
// line 1038
    id: 'hydraulicHammer', name: '🚜 Hydrauliczny Młot Burzący', icon: '🔨', reqWeapon: 'sledgehammer', reqPassive: 'coffee',
// line 1039
    desc: 'Wstrząsa całym ekranem, miażdży przeszkody i tworzy kratery!'
// line 1040
  },
// line 1041
  urzadSkarbowy: {
// line 1042
    id: 'urzadSkarbowy', name: '🏢 Urząd Skarbowy (KAS)', icon: '📄', reqWeapon: 'faktura', reqPassive: 'alkomat',
// line 1043
    desc: 'Wystrzeliwuje zmasowane, samonaprowadzające wezwania do zapłaty!'
// line 1044
  },
// line 1045
  redbull: {
// line 1046
    id: 'redbull', name: '🦅 Energetyk z Żabki', icon: '☕', reqWeapon: 'kawa', reqPassive: 'furia',
// line 1047
    desc: 'Rozlewa radioaktywny kwas niszczący bossów i daje permanentne przyspieszenie!'
// line 1048
  }
// line 1049
};
// line 1050

// line 1051
let enemies = [];
// line 1052
let projectiles = [];
// line 1053
let dropItems = [];
// line 1054
let speechBubbles = [];
// line 1055
let obstacles = [];
// line 1056
let toitoiMech = null;
// line 1057
const skidMarks = [];
// line 1058
const MAX_SKIDS = 400;
// line 1059
function addSkidMark(x, y, angle) {
// line 1060
  skidMarks.push({ x, y, angle, life: 25.0, maxLife: 25.0 });
// line 1061
  if (skidMarks.length > MAX_SKIDS) skidMarks.shift();
// line 1062
}
// line 1063

// line 1064
// Object pools for zero-allocation performance
// line 1065
const MAX_PARTICLES = 350;
// line 1066
const particlePool = [];
// line 1067
for (let i = 0; i < MAX_PARTICLES; i++) {
// line 1068
  particlePool.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 2, color: '#f59e0b', active: false });
// line 1069
}
// line 1070
function spawnParticle(x, y, vx, vy, life, size, color) {
// line 1071
  for (let i = 0; i < MAX_PARTICLES; i++) {
// line 1072
    const p = particlePool[i];
// line 1073
    if (!p.active) {
// line 1074
      p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = life; p.maxLife = life; p.size = size; p.color = color;
// line 1075
      p.active = true;
// line 1076
      return;
// line 1077
    }
// line 1078
  }
// line 1079
}
// line 1080
function createSparks(x, y, count, color = '#f59e0b') {
// line 1081
  for (let i = 0; i < count; i++) {
// line 1082
    const a = Math.random() * Math.PI * 2;
// line 1083
    const s = Math.random() * 5 + 2;
// line 1084
    spawnParticle(x, y, Math.cos(a) * s, Math.sin(a) * s, 0.4 + Math.random() * 0.3, Math.random() * 3.5 + 2, color);
// line 1085
  }
// line 1086
}
// line 1087

// line 1088
const MAX_FLOATING_TEXTS = 80;
// line 1089
const floatingTexts = [];
// line 1090
for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
// line 1091
  floatingTexts.push({ x: 0, y: 0, text: '', color: '#fff', life: 0, maxLife: 0.8, active: false });
// line 1092
}
// line 1093
function spawnDamageNumber(x, y, amount, isCrit = false) {
// line 1094
  const safeVal = isNaN(amount) || amount === undefined ? 10 : Math.round(amount);
// line 1095
  for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
// line 1096
    const ft = floatingTexts[i];
// line 1097
    if (!ft.active) {
// line 1098
      ft.x = x + (Math.random() * 20 - 10);
// line 1099
      ft.y = y + (Math.random() * 10 - 5);
// line 1100
      ft.text = safeVal;
// line 1101
      ft.color = isCrit ? '#ef4444' : '#fbbf24';
// line 1102
      ft.isCrit = isCrit;
// line 1103
      ft.life = 1.1;
// line 1104
      ft.maxLife = 1.1;
// line 1105
      ft.active = true;
// line 1106
      return;
// line 1107
    }
// line 1108
  }
// line 1109
}
// line 1110

// line 1111
// Room Database Cache
// line 1112
let roomScores = [];
// line 1113
let roomAchievements = [];
// line 1114

// line 1115
window.onRoomDataLoaded = function(data) {
// line 1116
  if (data.scores) { roomScores = data.scores; renderScoresTab(); }
// line 1117
  if (data.achievements) { roomAchievements = data.achievements; renderAchievementsTab(); }
// line 1118
};
// line 1119
window.onAndroidReady = function() {
// line 1120
  if (window.AndroidBridge && window.AndroidBridge.requestInitialData) {
// line 1121
    window.AndroidBridge.requestInitialData();
// line 1122
  }
// line 1123
};
// line 1124
if (window.AndroidBridge && window.AndroidBridge.requestInitialData) {
// line 1125
  window.AndroidBridge.requestInitialData();
// line 1126
}
// line 1127

// line 1128
const unlockedRunAchievements = new Set();
// line 1129

// line 1130
const ACHIEVEMENT_REWARDS = {
// line 1131
  first_blood: { text: '🎁 NAGRODA: +150 EXP', apply: () => { currentXP += 150; checkLevelUp(); } },
// line 1132
  coffee_addict: { text: '🎁 NAGRODA: Bateria 100% + 1000 Pkt', apply: () => { player.battery = player.maxBattery; score += 1000; } },
// line 1133
  combo_god: { text: '🎁 NAGRODA: Natychmiastowy Awans Awaryjny!', apply: () => { currentXP += neededXP; checkLevelUp(); } },
// line 1134
  weapon_evolution: { text: '🎁 NAGRODA: +25% Obrażeń dla Wszystkich Broni', apply: () => { player.damageMult = (player.damageMult || 1.0) * 1.25; } },
// line 1135
  boss_grzesiek: { text: '🎁 NAGRODA: +20% Szybkości i Bateria 100%', apply: () => { player.speed += 0.5; player.battery = player.maxBattery; } },
// line 1136
  toitoi_evolution: { text: '🎁 NAGRODA: +40% Magnesu XP', apply: () => { player.magnetRange += 80; } },
// line 1137
  kontener_1559: { text: '🎁 NAGRODA: +3000 Pkt + Bateria 100%', apply: () => { score += 3000; player.battery = player.maxBattery; } },
// line 1138
  lights_out: { text: '🎁 NAGRODA: +15% Szansy na Krytyk', apply: () => { player.critChance += 0.15; } },
// line 1139
  kill_100: { text: '🎁 NAGRODA: +500 EXP + 1500 Pkt', apply: () => { currentXP += 500; score += 1500; checkLevelUp(); } },
// line 1140
  shift_master: { text: '🎁 NAGRODA: +10,000 Pkt Legendy DTA!', apply: () => { score += 10000; } }
// line 1141
};
// line 1142

// line 1143
const achievementQueue = [];
// line 1144
let isAchievementToastShowing = false;
// line 1145

// line 1146
function triggerAchievement(key, name, icon) {
// line 1147
  if (unlockedRunAchievements.has(key)) return;
// line 1148
  unlockedRunAchievements.add(key);
// line 1149

// line 1150
  const ach = roomAchievements.find(a => a.key === key);
// line 1151
  if (ach && !ach.unlocked) {
// line 1152
    ach.unlocked = true;
// line 1153
    renderAchievementsTab();
// line 1154
  }
// line 1155
  if (window.AndroidBridge && window.AndroidBridge.unlockAchievement) {
// line 1156
    window.AndroidBridge.unlockAchievement(key);
// line 1157
  }
// line 1158

// line 1159
  let rewardText = '';
// line 1160
  const reward = ACHIEVEMENT_REWARDS[key];
// line 1161
  if (reward) {
// line 1162
    reward.apply();
// line 1163
    rewardText = reward.text;
// line 1164
    createSparks(player.x, player.y, 35, '#facc15');
// line 1165
    screenShake = Math.max(screenShake, 8);
// line 1166
  }
// line 1167

// line 1168
  achievementQueue.push({ name, icon: icon || '🏆', rewardText });
// line 1169
  processAchievementQueue();
// line 1170
}
// line 1171

// line 1172
function processAchievementQueue() {
// line 1173
  if (isAchievementToastShowing || achievementQueue.length === 0) return;
// line 1174
  const item = achievementQueue.shift();
// line 1175
  isAchievementToastShowing = true;
// line 1176

// line 1177
  const toast = document.getElementById('ach-toast');
// line 1178
  const toastIcon = document.getElementById('toast-icon');
// line 1179
  const toastName = document.getElementById('toast-name');
// line 1180
  if (toastIcon) toastIcon.innerText = item.icon;
// line 1181
  if (toastName) toastName.innerText = item.name + (item.rewardText ? ' (' + item.rewardText + ')' : '');
// line 1182

// line 1183
  if (toast) {
// line 1184
    toast.style.opacity = '1';
// line 1185
    toast.style.transform = 'translateX(0)';
// line 1186
    sounds.levelUp();
// line 1187
  }
// line 1188

// line 1189
  setTimeout(() => {
// line 1190
    if (toast) {
// line 1191
      toast.style.opacity = '0';
// line 1192
      toast.style.transform = 'translateX(120%)';
// line 1193
    }
// line 1194
    setTimeout(() => {
// line 1195
      isAchievementToastShowing = false;
// line 1196
      processAchievementQueue();
// line 1197
    }, 350);
// line 1198
  }, 2800);
// line 1199
}
// line 1200

// line 1201
// --- WAREHOUSE PROPS & ENVIRONMENT SYSTEM ---
// line 1202
let rackCanvas = null;
// line 1203
let palletStackCanvas = null;
// line 1204

// line 1205
function createRackSprite() {
// line 1206
  const rw = 160;
// line 1207
  const rh = 360;
// line 1208
  rackCanvas = document.createElement('canvas');
// line 1209
  rackCanvas.width = rw + 16;
// line 1210
  rackCanvas.height = rh + 16;
// line 1211
  const rctx = rackCanvas.getContext('2d');
// line 1212
  
// line 1213
  // Soft ambient ground shadow
// line 1214
  rctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
// line 1215
  rctx.fillRect(8, 8, rw, rh);
// line 1216

// line 1217
  // Rack Framework - Metallic Industrial Navy Steel
// line 1218
  rctx.fillStyle = '#0f172a';
// line 1219
  rctx.fillRect(0, 0, rw, rh);
// line 1220
  rctx.strokeStyle = '#0284c7';
// line 1221
  rctx.lineWidth = 2.5;
// line 1222
  rctx.strokeRect(0, 0, rw, rh);
// line 1223

// line 1224
  // Cross-bracing (Industrial X-frames)
// line 1225
  rctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
// line 1226
  rctx.lineWidth = 1.5;
// line 1227
  for (let sy = 0; sy < rh; sy += 65) {
// line 1228
    rctx.beginPath();
// line 1229
    rctx.moveTo(0, sy); rctx.lineTo(rw, sy + 65);
// line 1230
    rctx.moveTo(rw, sy); rctx.lineTo(0, sy + 65);
// line 1231
    rctx.stroke();
// line 1232
  }
// line 1233

// line 1234
  // Wooden Pallet Levels & Box Cargo with edge highlights
// line 1235
  for (let sy = 24; sy < rh - 20; sy += 65) {
// line 1236
    // EPAL Wooden Beam
// line 1237
    rctx.fillStyle = '#b45309';
// line 1238
    rctx.fillRect(4, sy, rw - 8, 16);
// line 1239
    rctx.strokeStyle = '#f59e0b';
// line 1240
    rctx.lineWidth = 1;
// line 1241
    rctx.strokeRect(4, sy, rw - 8, 16);
// line 1242

// line 1243
    // Pallet Boxes (Brown / Gold cardboard)
// line 1244
    rctx.fillStyle = '#92400e';
// line 1245
    rctx.fillRect(12, sy - 26, 42, 26);
// line 1246
    rctx.strokeStyle = '#d97706';
// line 1247
    rctx.strokeRect(12, sy - 26, 42, 26);
// line 1248

// line 1249
    rctx.fillStyle = '#d97706';
// line 1250
    rctx.fillRect(62, sy - 32, 54, 32);
// line 1251
    rctx.strokeStyle = '#fbbf24';
// line 1252
    rctx.strokeRect(62, sy - 32, 54, 32);
// line 1253

// line 1254
    rctx.fillStyle = '#78350f';
// line 1255
    rctx.fillRect(124, sy - 22, 26, 22);
// line 1256

// line 1257
    // Hazard Stripes on corner uprights
// line 1258
    rctx.fillStyle = '#f59e0b';
// line 1259
    rctx.fillRect(0, sy, 5, 8);
// line 1260
    rctx.fillRect(rw - 5, sy, 5, 8);
// line 1261
  }
// line 1262
}
// line 1263

// line 1264
function createPalletStackSprite() {
// line 1265
  palletStackCanvas = document.createElement('canvas');
// line 1266
  palletStackCanvas.width = 64;
// line 1267
  palletStackCanvas.height = 64;
// line 1268
  const pctx = palletStackCanvas.getContext('2d');
// line 1269
  
// line 1270
  pctx.fillStyle = 'rgba(0,0,0,0.5)';
// line 1271
  pctx.fillRect(4, 4, 52, 52);
// line 1272

// line 1273
  // Stack of 4 EPAL Pallets top-down
// line 1274
  for (let i = 0; i < 4; i++) {
// line 1275
    const off = i * 2;
// line 1276
    pctx.fillStyle = i % 2 === 0 ? '#b45309' : '#d97706';
// line 1277
    pctx.fillRect(off, off, 48, 48);
// line 1278
    pctx.strokeStyle = '#78350f';
// line 1279
    pctx.lineWidth = 1.5;
// line 1280
    pctx.strokeRect(off, off, 48, 48);
// line 1281
    // Pallet boards
// line 1282
    pctx.fillStyle = '#78350f';
// line 1283
    pctx.fillRect(off + 6, off, 3, 48);
// line 1284
    pctx.fillRect(off + 23, off, 3, 48);
// line 1285
    pctx.fillRect(off + 40, off, 3, 48);
// line 1286
  }
// line 1287
  pctx.fillStyle = '#fef3c7';
// line 1288
  pctx.font = 'bold 8px sans-serif';
// line 1289
  pctx.fillText('EPAL', 14, 28);
// line 1290
}
// line 1291

// line 1292
createRackSprite();
// line 1293
createPalletStackSprite();
// line 1294

// line 1295
let warehouseDocks = [];
// line 1296
let warehouseStencils = [];
// line 1297
let warehousePuddles = [];
// line 1298
let warehouseLights = [];
// line 1299
let warehouseConveyors = [];
// line 1300
let warehouseHeaters = [];
// line 1301

// line 1302
function initWarehouse() {
// line 1303
  obstacles = [];
// line 1304
  warehouseDocks = [];
// line 1305
  warehouseStencils = [];
// line 1306
  warehousePuddles = [];
// line 1307
  warehouseLights = [];
// line 1308
  warehouseConveyors = [];
// line 1309
  warehouseHeaters = [];
// line 1310

// line 1311
  if (selectedArenaKey === 'freezer') {
// line 1312
    // Chłodnia Mrożonek -25°C: Ice aisles, freezing cooling units, warm heater fans
// line 1313
    for (let rx = 380; rx < ARENA_WIDTH - 380; rx += 580) {
// line 1314
      for (let ry = 400; ry < ARENA_HEIGHT - 400; ry += 640) {
// line 1315
        obstacles.push({ x: rx, y: ry, w: 140, h: 320, type: 'rack', isFrozen: true });
// line 1316
      }
// line 1317
    }
// line 1318
    // Heater Fans (Oaza Ciepła BHP - heals battery)
// line 1319
    warehouseHeaters.push(
// line 1320
      { x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2, radius: 110, pulse: 0 },
// line 1321
      { x: 600, y: 700, radius: 95, pulse: 0 },
// line 1322
      { x: ARENA_WIDTH - 600, y: ARENA_HEIGHT - 700, radius: 95, pulse: 0 }
// line 1323
    );
// line 1324
    // Frost Stencils
// line 1325
    warehouseStencils = [
// line 1326
      { x: 300, y: 150, text: '❄️ CHŁODNIA GŁĘBOKIEGO MROŻENIA -25°C', color: 'rgba(56, 189, 248, 0.6)', font: '900 16px sans-serif' },
// line 1327
      { x: 1200, y: 150, text: '⚠️ OBLODZENIE POSADZKI: UŻYWAJ ŁAŃCUCHÓW BT', color: 'rgba(147, 197, 253, 0.6)', font: '900 15px sans-serif' },
// line 1328
      { x: 800, y: 1200, text: '🔥 OAZA CIEPŁA BHP (REGENERACJA)', color: 'rgba(251, 146, 60, 0.6)', font: '900 16px sans-serif' },
// line 1329
      { x: 1800, y: 2000, text: 'STREFA SUB-ZERO: NIE ZATRZYMUJ WÓZKA!', color: 'rgba(56, 189, 248, 0.5)', font: '900 16px sans-serif' }
// line 1330
    ];
// line 1331
  } else if (selectedArenaKey === 'crossdock') {
// line 1332
    // Cross-Dock 24H: Dynamic conveyor belts pushing items, fast docks on both North & South!
// line 1333
    warehouseConveyors = [
// line 1334
      { x: 300, y: 650, w: 1800, h: 50, vx: 160, vy: 0, title: 'TAŚMOCIĄG EXPRESS ➔' },
// line 1335
      { x: 300, y: 1450, w: 1800, h: 50, vx: -160, vy: 0, title: 'TAŚMOCIĄG ZWROTÓW ⬅️' },
// line 1336
      { x: 1200, y: 300, w: 50, h: 1800, vx: 0, vy: 150, title: 'TRANZYT ⬇️' }
// line 1337
    ];
// line 1338
    // Racks along perimeter
// line 1339
    for (let rx = 240; rx < ARENA_WIDTH - 240; rx += 480) {
// line 1340
      obstacles.push({ x: rx, y: 350, w: 90, h: 180, type: 'rack' });
// line 1341
      obstacles.push({ x: rx, y: 1950, w: 90, h: 180, type: 'rack' });
// line 1342
    }
// line 1343
    // Pallet stacks in staging areas
// line 1344
    for (let rx = 400; rx < ARENA_WIDTH - 400; rx += 420) {
// line 1345
      obstacles.push({ x: rx, y: 1050, w: 50, h: 50, type: 'pallet_stack' });
// line 1346
    }
// line 1347
    warehouseStencils = [
// line 1348
      { x: 400, y: 150, text: '🏗️ CENTRUM PRZEŁADUNKOWE CROSS-DOCK 24H', color: 'rgba(245, 158, 11, 0.6)', font: '900 16px sans-serif' },
// line 1349
      { x: 1400, y: 150, text: '⚡ TRANZYT NATYCHMIASTOWY BEZ SKŁADOWANIA', color: 'rgba(239, 68, 68, 0.5)', font: '900 15px sans-serif' },
// line 1350
      { x: 500, y: 720, text: '➔ KIERUNEK PRZEPŁYWU TOWARU ➔', color: 'rgba(56, 189, 248, 0.5)', font: '900 14px sans-serif' },
// line 1351
      { x: 500, y: 1520, text: '⬅️ KIERUNEK KONTROLI CELNEJ ⬅️', color: 'rgba(168, 85, 247, 0.5)', font: '900 14px sans-serif' }
// line 1352
    ];
// line 1353
  } else {
// line 1354
    // Standard Hala Główna DTA Graniczna 8f
// line 1355
    for (let rx = 360; rx < ARENA_WIDTH - 360; rx += 520) {
// line 1356
      for (let ry = 420; ry < ARENA_HEIGHT - 380; ry += 600) {
// line 1357
        obstacles.push({ x: rx, y: ry, w: 160, h: 360, type: 'rack' });
// line 1358
      }
// line 1359
    }
// line 1360
    for (let rx = 160; rx < ARENA_WIDTH - 160; rx += 520) {
// line 1361
      for (let ry = 220; ry < ARENA_HEIGHT - 220; ry += 600) {
// line 1362
        obstacles.push({ x: rx, y: ry, w: 52, h: 52, type: 'pallet_stack' });
// line 1363
      }
// line 1364
    }
// line 1365
    warehouseStencils = [
// line 1366
      { x: 300, y: 150, text: 'STOP 🛑 WÓZKI WIDŁOWE', color: 'rgba(239, 68, 68, 0.45)', font: '900 16px sans-serif' },
// line 1367
      { x: 1200, y: 150, text: '⚠️ STREFA ROZŁADUNKU DTA', color: 'rgba(245, 158, 11, 0.45)', font: '900 16px sans-serif' },
// line 1368
      { x: 2100, y: 150, text: 'MAX 5 KM/H 🚜', color: 'rgba(56, 189, 248, 0.45)', font: '900 16px sans-serif' },
// line 1369
      { x: 800, y: 800, text: 'ALEJA 8F (ODPRAWY SAD)', color: 'rgba(245, 158, 11, 0.35)', font: '900 18px sans-serif' },
// line 1370
      { x: 1800, y: 800, text: 'STREFA ODKŁADCZA EPAL', color: 'rgba(56, 189, 248, 0.35)', font: '900 18px sans-serif' },
// line 1371
      { x: 1300, y: 1500, text: 'STREFA BEZPIECZEŃSTWA BHP', color: 'rgba(74, 222, 128, 0.35)', font: '900 18px sans-serif' },
// line 1372
      { x: 600, y: 2200, text: '⚠️ UWAGA: CZUJNIKI WMS', color: 'rgba(239, 68, 68, 0.4)', font: '900 16px sans-serif' },
// line 1373
      { x: 2000, y: 2200, text: 'MAGAZYN WYSOKIEGO SKŁADU', color: 'rgba(168, 85, 247, 0.35)', font: '900 18px sans-serif' }
// line 1374
    ];
// line 1375
  }
// line 1376

// line 1377
  // Loading Docks along North Wall
// line 1378
  const dockCount = 6;
// line 1379
  const dockSpacing = ARENA_WIDTH / (dockCount + 1);
// line 1380
  for (let i = 1; i <= dockCount; i++) {
// line 1381
    warehouseDocks.push({
// line 1382
      x: i * dockSpacing - 80,
// line 1383
      y: 0,
// line 1384
      w: 160,
// line 1385
      h: 55,
// line 1386
      dockNum: i,
// line 1387
      title: i === 1 ? 'RAMPA 1: CELNA DTA' : i === 2 ? 'RAMPA 2: EXPRESS' : i === 3 ? 'RAMPA 3: KONTENERY' : i === 4 ? 'RAMPA 4: CHŁODNIA' : `RAMPA ${i}: ODBIÓR`,
// line 1388
      active: i % 2 === 0
// line 1389
    });
// line 1390
  }
// line 1391

// line 1392
  // Coolant & Oil Sheen Puddles
// line 1393
  warehousePuddles = [
// line 1394
    { x: 550, y: 480, rx: 50, ry: 25, color: 'rgba(56, 189, 248, 0.12)' },
// line 1395
    { x: 1450, y: 920, rx: 70, ry: 35, color: 'rgba(245, 158, 11, 0.12)' },
// line 1396
    { x: 2300, y: 600, rx: 60, ry: 30, color: 'rgba(74, 222, 128, 0.12)' },
// line 1397
    { x: 950, y: 1750, rx: 80, ry: 40, color: 'rgba(168, 85, 247, 0.12)' },
// line 1398
    { x: 1900, y: 1950, rx: 65, ry: 32, color: 'rgba(56, 189, 248, 0.12)' }
// line 1399
  ];
// line 1400

// line 1401
  // Overhead Fluorescent Industrial Lamps
// line 1402
  for (let lx = 260; lx < ARENA_WIDTH; lx += 450) {
// line 1403
    for (let ly = 260; ly < ARENA_HEIGHT; ly += 450) {
// line 1404
      warehouseLights.push({ x: lx, y: ly, flicker: Math.random() });
// line 1405
    }
// line 1406
  }
// line 1407

// line 1408
  // Spawn stationary smelly ToiToi in the corner
// line 1409
  obstacles.push({
// line 1410
    x: 580,
// line 1411
    y: 580,
// line 1412
    w: 64,
// line 1413
    h: 64,
// line 1414
    type: 'toitoi_station',
// line 1415
    smellTimer: 0
// line 1416
  });
// line 1417
}
// line 1418
initWarehouse();
// line 1419

// line 1420
// --- BREAKABLE WAREHOUSE PROPS (Vampire Survivors Light Sources / Crates) ---
// line 1421
let mapProps = [];
// line 1422
const PROP_DEFINITIONS = {
// line 1423
  coffee: { name: 'Dystrybutor Kawa Tchibo', icon: '☕', hp: 20, radius: 18, color: '#b45309', border: '#f59e0b' },
// line 1424
  crate: { name: 'Skrzynia Drewniana EPAL', icon: '📦', hp: 30, radius: 20, color: '#d97706', border: '#78350f' },
// line 1425
  firstaid: { name: 'Ścienna Apteczka BHP', icon: '🩹', hp: 15, radius: 16, color: '#ef4444', border: '#fee2e2' },
// line 1426
  extinguisher: { name: 'Gaśnica Ścienna CO2', icon: '🧯', hp: 25, radius: 18, color: '#06b6d4', border: '#cffafe' }
// line 1427
};
// line 1428

// line 1429
function initMapProps() {
// line 1430
  mapProps = [];
// line 1431
  const propTypes = ['coffee', 'crate', 'crate', 'firstaid', 'extinguisher'];
// line 1432
  const count = 30;
// line 1433
  for (let i = 0; i < count; i++) {
// line 1434
    spawnRandomProp(propTypes[i % propTypes.length]);
// line 1435
  }
// line 1436
}
// line 1437

// line 1438
function spawnRandomProp(typeKey) {
// line 1439
  const def = PROP_DEFINITIONS[typeKey] || PROP_DEFINITIONS.crate;
// line 1440
  const x = 180 + Math.random() * (ARENA_WIDTH - 360);
// line 1441
  const y = 180 + Math.random() * (ARENA_HEIGHT - 360);
// line 1442
  mapProps.push({
// line 1443
    x: x,
// line 1444
    y: y,
// line 1445
    type: typeKey,
// line 1446
    def: def,
// line 1447
    hp: def.hp,
// line 1448
    maxHp: def.hp,
// line 1449
    radius: def.radius,
// line 1450
    hitFlash: 0,
// line 1451
    dead: false
// line 1452
  });
// line 1453
}
// line 1454

// line 1455
function damageProp(p, dmg) {
// line 1456
  if (p.dead) return;
// line 1457
  p.hp -= dmg;
// line 1458
  p.hitFlash = 0.12;
// line 1459
  createSparks(p.x, p.y, 5, p.def.border);
// line 1460
  if (p.hp <= 0) {
// line 1461
    destroyProp(p);
// line 1462
  }
// line 1463
}
// line 1464

// line 1465
function destroyProp(p) {
// line 1466
  p.dead = true;
// line 1467
  sounds.shatterProp();
// line 1468
  screenShake = Math.max(screenShake, 5);
// line 1469
  createSparks(p.x, p.y, 20, p.def.color);
// line 1470
  
// line 1471
  if (p.type === 'coffee') {
// line 1472
    dropItems.push({ x: p.x, y: p.y, type: 'coffee_thermos', life: 25 });
// line 1473
    addSpeechBubble(p.x, p.y - 20, '☕ KAWA Z DYSTRYBUTORA!', '#f59e0b');
// line 1474
  } else if (p.type === 'crate') {
// line 1475
    for (let k = 0; k < 3; k++) {
// line 1476
      dropItems.push({
// line 1477
        x: p.x + (Math.random() - 0.5) * 30,
// line 1478
        y: p.y + (Math.random() - 0.5) * 30,
// line 1479
        type: 'barcode_xp',
// line 1480
        val: 12 + Math.floor(Math.random() * 8),
// line 1481
        life: 25
// line 1482
      });
// line 1483
    }
// line 1484
    if (Math.random() < 0.45) {
// line 1485
      dropItems.push({ x: p.x, y: p.y, type: 'dta_coin', val: 25, life: 25 });
// line 1486
    }
// line 1487
  } else if (p.type === 'firstaid') {
// line 1488
    dropItems.push({ x: p.x, y: p.y, type: 'hotdog', life: 25 });
// line 1489
    addSpeechBubble(p.x, p.y - 20, '🩹 APTECZKA BHP! HOTDOG!', '#4ade80');
// line 1490
  } else if (p.type === 'extinguisher') {
// line 1491
    sounds.freeze();
// line 1492
    screenShake = 10;
// line 1493
    createSparks(p.x, p.y, 35, '#38bdf8');
// line 1494
    addSpeechBubble(p.x, p.y - 25, '❄️ EKSPLOZJA GAŚNICY CO2!', '#38bdf8');
// line 1495
    enemies.forEach(e => {
// line 1496
      if (!e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 240) {
// line 1497
        damageEnemy(e, 75);
// line 1498
        e.slowTimer = 4.0;
// line 1499
        createSparks(e.x, e.y, 8, '#67e8f9');
// line 1500
      }
// line 1501
    });
// line 1502
    dropItems.push({ x: p.x, y: p.y, type: 'barcode_xp', val: 25, life: 25 });
// line 1503
  }
// line 1504
}
// line 1505

// line 1506
function updateMapProps(dt) {
// line 1507
  for (let i = mapProps.length - 1; i >= 0; i--) {
// line 1508
    const p = mapProps[i];
// line 1509
    if (p.hitFlash > 0) p.hitFlash -= dt;
// line 1510
    if (p.dead) {
// line 1511
      mapProps.splice(i, 1);
// line 1512
    }
// line 1513
  }
// line 1514
  if (mapProps.length < 24) {
// line 1515
    const keys = ['coffee', 'crate', 'firstaid', 'extinguisher'];
// line 1516
    spawnRandomProp(keys[Math.floor(Math.random() * keys.length)]);
// line 1517
  }
// line 1518
}
// line 1519

// line 1520
function drawMapProps(ctx, viewW, viewH) {
// line 1521
  for (let i = 0; i < mapProps.length; i++) {
// line 1522
    const p = mapProps[i];
// line 1523
    if (p.x < camera.x - 60 || p.x > camera.x + viewW + 60 ||
// line 1524
        p.y < camera.y - 60 || p.y > camera.y + viewH + 60) {
// line 1525
      continue;
// line 1526
    }
// line 1527
    ctx.save();
// line 1528
    ctx.translate(p.x, p.y);
// line 1529
    
// line 1530
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
// line 1531
    ctx.beginPath();
// line 1532
    ctx.ellipse(0, 8, p.radius * 1.1, p.radius * 0.55, 0, 0, Math.PI * 2);
// line 1533
    ctx.fill();
// line 1534

// line 1535
    if (p.hitFlash > 0) {
// line 1536
      ctx.fillStyle = '#ffffff';
// line 1537
      ctx.beginPath(); ctx.arc(0, 0, p.radius + 2, 0, Math.PI * 2); ctx.fill();
// line 1538
    }
// line 1539

// line 1540
    ctx.fillStyle = p.def.color;
// line 1541
    ctx.beginPath();
// line 1542
    ctx.roundRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2, 6);
// line 1543
    ctx.fill();
// line 1544
    ctx.strokeStyle = p.def.border;
// line 1545
    ctx.lineWidth = 2;
// line 1546
    ctx.stroke();
// line 1547

// line 1548
    ctx.font = `${Math.round(p.radius * 1.1)}px sans-serif`;
// line 1549
    ctx.textAlign = 'center';
// line 1550
    ctx.textBaseline = 'middle';
// line 1551
    ctx.fillText(p.def.icon, 0, 1);
// line 1552

// line 1553
    if (p.hp < p.maxHp) {
// line 1554
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
// line 1555
      ctx.fillRect(-p.radius, -p.radius - 8, p.radius * 2, 4);
// line 1556
      ctx.fillStyle = '#22c55e';
// line 1557
      const fillW = Math.max(0, (p.hp / p.maxHp) * (p.radius * 2));
// line 1558
      ctx.fillRect(-p.radius, -p.radius - 8, fillW, 4);
// line 1559
    }
// line 1560

// line 1561
    ctx.restore();
// line 1562
  }
// line 1563
}
// line 1564

// line 1565
// --- LUCKY CARGO CHESTS (Vampire Survivors Chest System) ---
// line 1566
let chestPendingRewards = [];
// line 1567

// line 1568
function openLuckyChest(tier = 1) {
// line 1569
  gameState = STATE.CHEST;
// line 1570
  sounds.chestFanfare();
// line 1571
  screenShake = 12;
// line 1572

// line 1573
  const modal = document.getElementById('chest-screen');
// line 1574
  const animBox = document.getElementById('chest-anim-box');
// line 1575
  const statusEl = document.getElementById('chest-status-text');
// line 1576
  const slotsContainer = document.getElementById('chest-slots');
// line 1577
  const btnClaim = document.getElementById('btn-claim-chest');
// line 1578

// line 1579
  modal.style.display = 'flex';
// line 1580
  animBox.innerHTML = '🎁';
// line 1581
  statusEl.innerText = '⚡ OTWIERANIE ZŁOTEJ PALETY DTA...';
// line 1582
  slotsContainer.innerHTML = '';
// line 1583
  btnClaim.style.display = 'none';
// line 1584

// line 1585
  const roll = Math.random();
// line 1586
  let rewardCount = 1;
// line 1587
  if (roll < 0.08 || tier >= 3) rewardCount = 5;
// line 1588
  else if (roll < 0.38 || tier >= 2) rewardCount = 3;
// line 1589

// line 1590
  chestPendingRewards = [];
// line 1591

// line 1592
  const evoOpts = [];
// line 1593
  if (weapons.scanner.level >= 5 && passives.battery.level >= 1 && !weapons.scanner.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.bramkaRFID });
// line 1594
  if (weapons.toiletPaper.level >= 5 && passives.magnet.level >= 1 && !weapons.toiletPaper.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.owijarka });
// line 1595
  if (weapons.pallets.level >= 5 && passives.coffee.level >= 1 && !weapons.pallets.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.btHighStack });
// line 1596
  if (weapons.extinguisher.level >= 5 && passives.forks.level >= 1 && !weapons.extinguisher.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.zraszacz });
// line 1597
  if (weapons.zipTies.level >= 5 && passives.magnet.level >= 1 && !weapons.zipTies.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.steelTies });
// line 1598
  if (weapons.cutter.level >= 5 && passives.forks.level >= 1 && !weapons.cutter.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.machete });
// line 1599

// line 1600
  const upgradePool = [
// line 1601
    { cat: 'weapon', id: 'scanner', name: 'Skaner Kodów', icon: '🔦', desc: 'Większy promień i laser piercing.' },
// line 1602
    { cat: 'weapon', id: 'toiletPaper', name: 'Taśma Pakowa', icon: '🧻', desc: 'Dodatkowy pocisk i tempo ognia.' },
// line 1603
    { cat: 'weapon', id: 'stretchAura', name: 'Aura Strecz', icon: '🌀', desc: 'Większy promień wirującej folii.' },
// line 1604
    { cat: 'weapon', id: 'pallets', name: 'Ręczny Paleciak', icon: '🪵', desc: 'Większe obrażenia taranu EPAL.' },
// line 1605
    { cat: 'weapon', id: 'extinguisher', name: 'Gaśnica PPOŻ', icon: '🧯', desc: 'Szerszy stożek mrożenia.' },
// line 1606
    { cat: 'weapon', id: 'zipTies', name: 'Trytytki', icon: '🔗', desc: 'Szybszy miot taśm zaciskowych.' },
// line 1607
    { cat: 'weapon', id: 'cutter', name: 'Nóż Stanley', icon: '🔪', desc: 'Dodatkowe cięcie i obrażenia.' },
// line 1608
    { cat: 'passive', id: 'magnet', name: passives.magnet.name, icon: passives.magnet.icon, desc: '+75 Zasięgu Magnesu XP' },
// line 1609
    { cat: 'passive', id: 'forks', name: passives.forks.name, icon: passives.forks.icon, desc: '+12% Szansy na Krytyk' },
// line 1610
    { cat: 'passive', id: 'coffee', name: passives.coffee.name, icon: passives.coffee.icon, desc: '+18 Szybkości & Redukcja CD' },
// line 1611
    { cat: 'passive', id: 'battery', name: passives.battery.name, icon: passives.battery.icon, desc: '+35 Max Baterii & Regen' }
// line 1612
  ];
// line 1613

// line 1614
  for (let i = 0; i < rewardCount; i++) {
// line 1615
    if (evoOpts.length > 0 && Math.random() < 0.5) {
// line 1616
      chestPendingRewards.push(evoOpts.pop());
// line 1617
    } else {
// line 1618
      const pick = upgradePool[Math.floor(Math.random() * upgradePool.length)];
// line 1619
      chestPendingRewards.push({ type: 'upgrade', data: pick });
// line 1620
    }
// line 1621
  }
// line 1622

// line 1623
  const coinBonus = 150 * rewardCount;
// line 1624
  dtaCoins += coinBonus;
// line 1625
  saveWorkshopData();
// line 1626

// line 1627
  let slotIdx = 0;
// line 1628
  function revealNextSlot() {
// line 1629
    if (slotIdx < chestPendingRewards.length) {
// line 1630
      sounds.chestSlot();
// line 1631
      const item = chestPendingRewards[slotIdx];
// line 1632
      const card = document.createElement('div');
// line 1633
      card.className = 'chest-reward-card';
// line 1634
      if (item.type === 'evo') {
// line 1635
        card.style.borderColor = '#f59e0b';
// line 1636
        card.style.background = 'linear-gradient(135deg, rgba(120, 53, 15, 0.95), rgba(30, 58, 138, 0.95))';
// line 1637
        card.innerHTML = `
// line 1638
          <div style="font-size:28px;">${item.data.icon}</div>
// line 1639
          <div>
// line 1640
            <div style="font-weight:900; color:#fef08a; font-size:14px;">★ ${item.data.name}</div>
// line 1641
            <div style="font-size:11px; color:#f8fafc;">${item.data.desc}</div>
// line 1642
          </div>
// line 1643
        `;
// line 1644
      } else {
// line 1645
        card.innerHTML = `
// line 1646
          <div style="font-size:28px;">${item.data.icon}</div>
// line 1647
          <div>
// line 1648
            <div style="font-weight:900; color:#38bdf8; font-size:13.5px;">${item.data.name} (+1 POZ)</div>
// line 1649
            <div style="font-size:11px; color:#e2e8f0;">${item.data.desc}</div>
// line 1650
          </div>
// line 1651
        `;
// line 1652
      }
// line 1653
      slotsContainer.appendChild(card);
// line 1654
      slotIdx++;
// line 1655
      setTimeout(revealNextSlot, 350);
// line 1656
    } else {
// line 1657
      animBox.innerHTML = '✨📦✨';
// line 1658
      statusEl.innerHTML = `🎉 ZNALEZIONO <b>${rewardCount}x ULEPSZEŃ</b> + <b>💰 ${coinBonus} MONET DTA</b>!`;
// line 1659
      btnClaim.style.display = 'block';
// line 1660
    }
// line 1661
  }
// line 1662

// line 1663
  setTimeout(revealNextSlot, 500);
// line 1664

// line 1665
  btnClaim.onclick = () => {
// line 1666
    claimLuckyChest();
// line 1667
  };
// line 1668
}
// line 1669

// line 1670
function claimLuckyChest() {
// line 1671
  chestPendingRewards.forEach(item => {
// line 1672
    if (item.type === 'evo') {
// line 1673
      applyEvolution(item.data);
// line 1674
    } else if (item.type === 'upgrade') {
// line 1675
      applyUpgrade(item.data);
// line 1676
    }
// line 1677
  });
// line 1678
  chestPendingRewards = [];
// line 1679
  document.getElementById('chest-screen').style.display = 'none';
// line 1680
  gameState = STATE.PLAYING;
// line 1681
  updateWeaponsHud();
// line 1682
  sounds.achieve();
// line 1683
}
// line 1684

// line 1685
// --- PAUSE MENU & BUILD / SYNERGY INSPECTOR ---
// line 1686
function togglePause() {
// line 1687
  if (gameState === STATE.PLAYING) {
// line 1688
    gameState = STATE.PAUSED;
// line 1689
    renderPauseScreen();
// line 1690
    document.getElementById('pause-screen').style.display = 'flex';
// line 1691
    sounds.beep();
// line 1692
  } else if (gameState === STATE.PAUSED) {
// line 1693
    document.getElementById('pause-screen').style.display = 'none';
// line 1694
    gameState = STATE.PLAYING;
// line 1695
    sounds.beep();
// line 1696
  }
// line 1697
}
// line 1698

// line 1699
function renderPauseScreen() {
// line 1700
  const m = Math.floor(gameTime / 60);
// line 1701
  const s = Math.floor(gameTime % 60);
// line 1702
  const totalMin = SHIFT_START_MINUTES + m;
// line 1703
  const clockH = Math.floor(totalMin / 60).toString().padStart(2, '0');
// line 1704
  const clockM = (totalMin % 60).toString().padStart(2, '0');
// line 1705
  
// line 1706
  document.getElementById('pstat-time').innerText = `${clockH}:${clockM} (${m}m ${s}s)`;
// line 1707
  document.getElementById('pstat-kills').innerText = kills;
// line 1708
  document.getElementById('pstat-lvl').innerText = playerLevel;
// line 1709

// line 1710
  const wGrid = document.getElementById('pause-weapons-grid');
// line 1711
  wGrid.innerHTML = '';
// line 1712
  Object.keys(weapons).forEach(k => {
// line 1713
    const w = weapons[k];
// line 1714
    if (w.level > 0) {
// line 1715
      const pill = document.createElement('div');
// line 1716
      pill.className = 'pause-gear-pill' + (w.isEvo ? ' is-evo' : '');
// line 1717
      const evoTag = w.isEvo ? ' ★ EVO' : ` Poz. ${w.level}`;
// line 1718
      pill.innerHTML = `<span>${w.icon}</span> <span><b>${k.toUpperCase()}</b>${evoTag}</span>`;
// line 1719
      wGrid.appendChild(pill);
// line 1720
    }
// line 1721
  });
// line 1722

// line 1723
  const pGrid = document.getElementById('pause-passives-grid');
// line 1724
  pGrid.innerHTML = '';
// line 1725
  Object.keys(passives).forEach(k => {
// line 1726
    const p = passives[k];
// line 1727
    if (p.level > 0) {
// line 1728
      const pill = document.createElement('div');
// line 1729
      pill.className = 'pause-gear-pill';
// line 1730
      pill.innerHTML = `<span>${p.icon}</span> <span><b>${p.name}</b> (Poz. ${p.level})</span>`;
// line 1731
      pGrid.appendChild(pill);
// line 1732
    }
// line 1733
  });
// line 1734
  if (pGrid.children.length === 0) {
// line 1735
    pGrid.innerHTML = '<div style="font-size:10px; color:#64748b; font-style:italic;">Brak pasywnych przedmiotów. Awansuj, aby je zdobyć!</div>';
// line 1736
  }
// line 1737

// line 1738
  const synList = document.getElementById('pause-synergies-list');
// line 1739
  synList.innerHTML = '';
// line 1740

// line 1741
  const recipeList = [
// line 1742
    { name: 'Przemysłowa Bramka RFID', wep: 'scanner', wepIcon: '🔦', pass: 'battery', passIcon: '🔋', evoIcon: '📡' },
// line 1743
    { name: 'Automatyczna Owijarka', wep: 'toiletPaper', wepIcon: '🧻', pass: 'magnet', passIcon: '📜', evoIcon: '🌀' },
// line 1744
    { name: 'Wózek BT High-Stack', wep: 'pallets', wepIcon: '🪵', pass: 'coffee', passIcon: '🛢️', evoIcon: '🚜' },
// line 1745
    { name: 'System Zraszaczowy PPOŻ', wep: 'extinguisher', wepIcon: '🧯', pass: 'forks', passIcon: '📋', evoIcon: '❄️' },
// line 1746
    { name: 'Stalowe Trytytki', wep: 'zipTies', wepIcon: '🔗', pass: 'magnet', passIcon: '📜', evoIcon: '🔗' },
// line 1747
    { name: 'Ostrze Stanley Max', wep: 'cutter', wepIcon: '🔪', pass: 'forks', passIcon: '📋', evoIcon: '🔪' }
// line 1748
  ];
// line 1749

// line 1750
  recipeList.forEach(rec => {
// line 1751
    const hasWep = weapons[rec.wep].level >= 5;
// line 1752
    const hasPass = passives[rec.pass].level >= 1;
// line 1753
    const isEvo = weapons[rec.wep].isEvo;
// line 1754
    const isReady = hasWep && hasPass;
// line 1755

// line 1756
    const row = document.createElement('div');
// line 1757
    row.className = 'synergy-row' + (isReady || isEvo ? ' active' : '');
// line 1758
    
// line 1759
    let statusHtml = '';
// line 1760
    if (isEvo) {
// line 1761
      statusHtml = '<span style="color:#facc15; font-weight:900;">★ EWOLUOWANA</span>';
// line 1762
    } else if (isReady) {
// line 1763
      statusHtml = '<span style="color:#4ade80; font-weight:900;">GOTOWE DO AWANSU!</span>';
// line 1764
    } else {
// line 1765
      const wepTag = hasWep ? '✅' : `${weapons[rec.wep].level}/5`;
// line 1766
      const passTag = hasPass ? '✅' : '0/1';
// line 1767
      statusHtml = `<span style="color:#94a3b8;">${wepTag} + ${passTag}</span>`;
// line 1768
    }
// line 1769

// line 1770
    row.innerHTML = `
// line 1771
      <div style="display:flex; align-items:center; gap:6px;">
// line 1772
        <span style="font-size:14px;">${rec.evoIcon}</span>
// line 1773
        <span style="font-weight:700; color:#f8fafc;">${rec.name}</span>
// line 1774
        <span style="font-size:10px; color:#94a3b8;">(${rec.wepIcon} + ${rec.passIcon})</span>
// line 1775
      </div>
// line 1776
      <div>${statusHtml}</div>
// line 1777
    `;
// line 1778
    synList.appendChild(row);
// line 1779
  });
// line 1780
}
// line 1781

// line 1782
function surrenderShift() {
// line 1783
  document.getElementById('pause-screen').style.display = 'none';
// line 1784
  player.battery = 0;
// line 1785
  gameState = STATE.PLAYING;
// line 1786
}
// line 1787

// line 1788
function toggleMuteSound() {
// line 1789
  sounds.muted = !sounds.muted;
// line 1790
  const btn = document.getElementById('btn-pause-sound');
// line 1791
  if (btn) {
// line 1792
    btn.innerText = sounds.muted ? '🔇 DŹWIĘK: OFF' : '🔊 DŹWIĘK: ON';
// line 1793
    btn.style.borderColor = sounds.muted ? '#ef4444' : '#38bdf8';
// line 1794
  }
// line 1795
}
// line 1796

// line 1797
// --- CONTROLS ---
// line 1798
const touchState = { active: false, id: null, startX: 0, startY: 0, curX: 0, curY: 0, dirX: 0, dirY: 0 };
// line 1799
const keys = {};
// line 1800

// line 1801
window.addEventListener('keydown', (e) => {
// line 1802
  keys[e.key.toLowerCase()] = true;
// line 1803
  if (e.key === ' ' && gameState === STATE.PLAYING) triggerSkill();
// line 1804
  if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && (gameState === STATE.PLAYING || gameState === STATE.PAUSED)) {
// line 1805
    togglePause();
// line 1806
  }
// line 1807
});
// line 1808
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
// line 1809

// line 1810
const joystickBase = document.getElementById('joystick-base');
// line 1811
const joystickThumb = document.getElementById('joystick-thumb');
// line 1812
const btnDash = document.getElementById('btn-dash');
// line 1813
const dashCd = document.getElementById('dash-cd');
// line 1814
const btnDetention = document.getElementById('btn-detention');
// line 1815
const detentionCd = document.getElementById('detention-cd');
// line 1816
const btnForklift = document.getElementById('btn-forklift');
// line 1817

// line 1818

// line 1819
// --- 24H DRIVER DETENTION ULTIMATE ATTACK ---
// line 1820
function triggerDriverDetention() {
// line 1821
  if (player.detentionCooldown <= 0 && gameState === STATE.PLAYING) {
// line 1822
    player.detentionCooldown = player.maxDetentionCooldown;
// line 1823
    sounds.bossAlert();
// line 1824
    screenShake = 14;
// line 1825
    if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(100);
// line 1826

// line 1827
    let detainedCount = 0;
// line 1828
    enemies.forEach(e => {
// line 1829
      // 24h Detention: Stop all enemies for 4.5 seconds and inflict massive penalty damage
// line 1830
      e.slowTimer = 4.5;
// line 1831
      damageEnemy(e, 80);
// line 1832
      createSparks(e.x, e.y, 12, '#a855f7');
// line 1833
      detainedCount++;
// line 1834
    });
// line 1835

// line 1836
    addSpeechBubble(player.x, player.y - 45, '🛑 PRZETRZYMANIE KIEROWCY 24H (BRAK SAD)!', '#c084fc');
// line 1837
    triggerAchievement('detention_24h', '24h pod Rampą', '🛑');
// line 1838
  }
// line 1839
}
// line 1840

// line 1841
if (btnDetention) {
// line 1842
  btnDetention.addEventListener('touchstart', (e) => { e.preventDefault(); sounds.init(); triggerDriverDetention(); });
// line 1843
  btnDetention.addEventListener('click', () => { sounds.init(); triggerDriverDetention(); });
// line 1844
}
// line 1845

// line 1846
// --- POLISH INTRO CUTSCENE STORY ENGINE ---
// line 1847
const INTRO_ART_SCENES = [
// line 1848
  {
// line 1849
    badge: '📍 BRAMA 4B | 03:00',
// line 1850
    stamp: '🛑 KOSZMAR NA JAWIE',
// line 1851
    satire: '„Szefie, awizo mi się zmyło w praniu...”',
// line 1852
    alertTag: '⚠️ KRYZYS: 40 TIRÓW, JEDEN WÓZEK',
// line 1853
    alertType: 'warning',
// line 1854
    speaker: '🎙️ KIEROWNIK',
// line 1855
    color: '#facc15',
// line 1856
    text: 'Słuchaj uważnie! Prezes pojechał na Malediwy i obciął prąd na hali. Masz tu zostać do 7:00. Przed bramą stoi 40 ukraińskich tirów, a my mamy tylko jeden naładowany wózek BT!',
// line 1857
    sound: 'error'
// line 1858
  },
// line 1859
  {
// line 1860
    badge: '📍 STREFA ZWROTÓW | 03:15',
// line 1861
    stamp: '🔥 PROTOKÓŁ ZNISZCZENIA',
// line 1862
    satire: '„Ochrona słuchu to dla słabych.”',
// line 1863
    alertTag: '🚨 STATUS: INWAZJA AUDYTORÓW',
// line 1864
    alertType: 'danger',
// line 1865
    speaker: '🎙️ ZASTĘPCA',
// line 1866
    color: '#ef4444',
// line 1867
    text: 'Urząd Skarbowy i Państwowa Inspekcja Pracy przeprowadzają równoległy nalot z orbity! Celnicy sprawdzają każdą paczkę, a awaria chłodni zalała magazyn toksyczną kawą z automatu!',
// line 1868
    sound: 'beep'
// line 1869
  },
// line 1870
  {
// line 1871
    badge: '📍 REGAŁY WYSOKIEGO SKŁADOWANIA',
// line 1872
    stamp: '⚠️ ŚMIERĆ Z GÓRY',
// line 1873
    satire: '„Dziwne, na moim terminalu działa.”',
// line 1874
    alertTag: '🛑 SYSTEM WMS PŁONIE',
// line 1875
    alertType: 'danger',
// line 1876
    speaker: '🎙️ IT SUPPORT',
// line 1877
    color: '#38bdf8',
// line 1878
    text: 'Serwery leżą! Skanery przestały działać, więc musisz improwizować. Używaj owijarki ze streczem i ręcznego paleciaka żeby przetrwać. Magia magazynu.',
// line 1879
    sound: 'error'
// line 1880
  },
// line 1881
  {
// line 1882
    badge: '📍 STREFA VIP',
// line 1883
    stamp: '☠️ INSPEKTOR KAS NADCIĄGA',
// line 1884
    satire: '„Panie, to nie moje cło...”',
// line 1885
    alertTag: '🚨 KONTROLA SKARBOWA',
// line 1886
    alertType: 'warning',
// line 1887
    speaker: '🎙️ OCHRONA',
// line 1888
    color: '#facc15',
// line 1889
    text: 'Uwaga! Jeśli zobaczysz czerwoną strefę Rewizji Szczegółowej, masz 5 sekund by stamtąd uciec! Urząd Skarbowy nie bierze jeńców!',
// line 1890
    sound: 'bossAlert'
// line 1891
  },
// line 1892
  {
// line 1893
    badge: '📍 WÓZKI WIDŁOWE',
// line 1894
    stamp: '🚀 TRYB VAMPIRE SURVIVOR',
// line 1895
    satire: '„Mam na to uprawnienia... chyba.”',
// line 1896
    alertTag: '🔥 OVERTIME APOCALYPSE',
// line 1897
    alertType: 'danger',
// line 1898
    speaker: '🎙️ KIEROWNIK',
// line 1899
    color: '#ef4444',
// line 1900
    text: 'Zasady są proste: Rób uniki, uciekaj przed chmarą kartonów, a gdy pasek baterii się naładuje - odpalaj wózek BT i rozjeżdżaj ich wszystkich! JAZDA!',
// line 1901
    sound: 'achieve'
// line 1902
  }
// line 1903
];
// line 1904

// line 1905
let currentIntroIndex = 0;
// line 1906

// line 1907
function showIntroDialog() {
// line 1908
  currentIntroIndex = 0;
// line 1909
  updateIntroView();
// line 1910
  document.getElementById('intro-screen').style.display = 'flex';
// line 1911
}
// line 1912

// line 1913
function updateIntroView() {
// line 1914
  const scene = INTRO_ART_SCENES[currentIntroIndex];
// line 1915
  
// line 1916
  // Play dramatic sound cue
// line 1917
  if (scene.sound && sounds[scene.sound]) {
// line 1918
    try { sounds[scene.sound](); } catch(e) {}
// line 1919
  }
// line 1920

// line 1921
  // Update Visual Comic Stage
// line 1922
  document.getElementById('intro-art-badge').innerText = scene.badge;
// line 1923
  document.getElementById('intro-art-stamp').innerText = scene.stamp;
// line 1924
  document.getElementById('intro-art-satire').innerText = scene.satire;
// line 1925
  document.getElementById('intro-alert-tag').innerText = scene.alertTag;
// line 1926
  
// line 1927
  if (scene.render) {
// line 1928
    document.getElementById('intro-art-visual').innerHTML = scene.render();
// line 1929
  } else {
// line 1930
    // Default GTA style render
// line 1931
    let icon = '🏭';
// line 1932
    let bgCol = '#facc15';
// line 1933
    if (currentIntroIndex === 0) { icon = '🧔🏻‍♂️'; bgCol = '#f59e0b'; }
// line 1934
    if (currentIntroIndex === 1) { icon = '👷‍♂️'; bgCol = '#ef4444'; }
// line 1935
    if (currentIntroIndex === 2) { icon = '👨‍💻'; bgCol = '#38bdf8'; }
// line 1936
    if (currentIntroIndex === 3) { icon = '🕴️'; bgCol = '#dc2626'; }
// line 1937
    if (currentIntroIndex === 4) { 
// line 1938
      const char = CHARACTERS[selectedCharKey];
// line 1939
      icon = char ? char.icon : '🚜'; 
// line 1940
      bgCol = '#22c55e';
// line 1941
    }
// line 1942
    
// line 1943
    document.getElementById('intro-art-visual').innerHTML = `
// line 1944
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#0f172a 0%,#020617 100%);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
// line 1945
        <div style="position:absolute;width:200%;height:200%;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.03) 20px,rgba(255,255,255,0.03) 40px);animation:panBg 10s linear infinite;"></div>
// line 1946
        <div style="display:flex;align-items:center;justify-content:center;z-index:2;background:${bgCol}22;padding:20px;border-radius:24px;border:4px solid ${bgCol};box-shadow:0 0 40px ${bgCol}66; transform: rotate(-2deg) scale(1.1);">
// line 1947
          <div style="font-size:100px;filter:drop-shadow(5px 5px 0px #000);">${icon}</div>
// line 1948
        </div>
// line 1949
      </div>
// line 1950
      <style>
// line 1951
        @keyframes panBg { 0% { transform: translate(-25%, -25%); } 100% { transform: translate(0, 0); } }
// line 1952
      
// line 1953
/* Mobile Responsive & Smooth Touch Scrolling for Modals */
// line 1954
.tab-content {
// line 1955
  overflow-y: auto;
// line 1956
  overflow-x: hidden;
// line 1957
  max-height: calc(100vh - 120px);
// line 1958
  -webkit-overflow-scrolling: touch;
// line 1959
  touch-action: pan-y;
// line 1960
  padding-bottom: 30px;
// line 1961
}
// line 1962

// line 1963
.upgrade-list {
// line 1964
  display: flex;
// line 1965
  flex-direction: column;
// line 1966
  gap: 10px;
// line 1967
  max-height: 60vh;
// line 1968
  overflow-y: auto;
// line 1969
  overflow-x: hidden;
// line 1970
  -webkit-overflow-scrolling: touch;
// line 1971
  touch-action: pan-y;
// line 1972
  padding: 4px;
// line 1973
}
// line 1974

// line 1975
.pause-modal, .workshop-grid, .intro-modal, .chest-modal {
// line 1976
  touch-action: pan-y !important;
// line 1977
  -webkit-overflow-scrolling: touch !important;
// line 1978
}
// line 1979

// line 1980
#levelup-screen, #pause-screen, #chest-screen, #stage-transition-screen, #gameover-screen, #win-screen {
// line 1981
  touch-action: pan-y;
// line 1982
  -webkit-overflow-scrolling: touch;
// line 1983
}
// line 1984

// line 1985

// line 1986
/* Enhanced Level-Up Card System Styling */
// line 1987
.levelup-modal-container {
// line 1988
  border-color: #38bdf8 !important;
// line 1989
  max-width: 520px;
// line 1990
  width: 92%;
// line 1991
  background: rgba(15, 23, 42, 0.98) !important;
// line 1992
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.95), 0 0 20px rgba(56, 189, 248, 0.3) !important;
// line 1993
  padding: 18px !important;
// line 1994
  display: flex;
// line 1995
  flex-direction: column;
// line 1996
  gap: 12px;
// line 1997
}
// line 1998

// line 1999
.levelup-modal-title {
// line 2000
  color: #38bdf8;
// line 2001
  font-size: 22px;
// line 2002
  font-weight: 900;
// line 2003
  margin: 0;
// line 2004
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
// line 2005
  letter-spacing: 0.5px;
// line 2006
}
// line 2007

// line 2008
.levelup-modal-subtitle {
// line 2009
  color: #cbd5e1;
// line 2010
  font-size: 13px;
// line 2011
  margin: 4px 0 0 0;
// line 2012
}
// line 2013

// line 2014
.upgrade-list {
// line 2015
  display: flex;
// line 2016
  flex-direction: column;
// line 2017
  gap: 10px;
// line 2018
  max-height: 58vh;
// line 2019
  overflow-y: auto;
// line 2020
  overflow-x: hidden;
// line 2021
  -webkit-overflow-scrolling: touch;
// line 2022
  touch-action: pan-y;
// line 2023
  padding: 4px;
// line 2024
}
// line 2025

// line 2026
.upgrade-card {
// line 2027
  position: relative;
// line 2028
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.99));
// line 2029
  border: 2px solid #38bdf8;
// line 2030
  border-radius: 14px;
// line 2031
  padding: 12px 14px;
// line 2032
  display: flex;
// line 2033
  align-items: center;
// line 2034
  gap: 12px;
// line 2035
  cursor: pointer;
// line 2036
  text-align: left;
// line 2037
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15);
// line 2038
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s, box-shadow 0.2s;
// line 2039
  animation: cardSlideIn 0.3s ease-out forwards;
// line 2040
}
// line 2041

// line 2042
@keyframes cardSlideIn {
// line 2043
  from { opacity: 0; transform: translateY(15px) scale(0.96); }
// line 2044
  to { opacity: 1; transform: translateY(0) scale(1); }
// line 2045
}
// line 2046

// line 2047
.upgrade-card:hover, .upgrade-card:active {
// line 2048
  transform: translateY(-2px) scale(1.02);
// line 2049
  border-color: #7dd3fc;
// line 2050
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
// line 2051
}
// line 2052

// line 2053
.upgrade-card.is-weapon {
// line 2054
  border-color: #38bdf8;
// line 2055
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.35), rgba(15, 23, 42, 0.98));
// line 2056
}
// line 2057

// line 2058
.upgrade-card.is-passive {
// line 2059
  border-color: #22c55e;
// line 2060
  background: linear-gradient(135deg, rgba(21, 128, 61, 0.35), rgba(15, 23, 42, 0.98));
// line 2061
}
// line 2062

// line 2063
.upgrade-card.is-passive:hover {
// line 2064
  border-color: #4ade80;
// line 2065
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
// line 2066
}
// line 2067

// line 2068
.upgrade-card.is-evolution {
// line 2069
  border-color: #f59e0b;
// line 2070
  background: linear-gradient(135deg, rgba(180, 83, 9, 0.6), rgba(30, 58, 138, 0.95));
// line 2071
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), inset 0 1px 2px rgba(254, 240, 138, 0.4);
// line 2072
  animation: cardSlideIn 0.3s ease-out forwards, pulseGoldBorder 1.2s infinite alternate;
// line 2073
}
// line 2074

// line 2075
@keyframes pulseGoldBorder {
// line 2076
  0% { border-color: #f59e0b; box-shadow: 0 0 15px rgba(245, 158, 11, 0.5); }
// line 2077
  100% { border-color: #fde047; box-shadow: 0 0 30px rgba(250, 204, 21, 0.8); }
// line 2078
}
// line 2079

// line 2080
.upgrade-card.is-bonus {
// line 2081
  border-color: #ef4444;
// line 2082
  background: linear-gradient(135deg, rgba(185, 28, 28, 0.35), rgba(15, 23, 42, 0.98));
// line 2083
}
// line 2084

// line 2085
.card-icon-wrapper {
// line 2086
  position: relative;
// line 2087
  width: 48px;
// line 2088
  height: 48px;
// line 2089
  background: rgba(15, 23, 42, 0.85);
// line 2090
  border: 1px solid rgba(255, 255, 255, 0.15);
// line 2091
  border-radius: 12px;
// line 2092
  display: flex;
// line 2093
  align-items: center;
// line 2094
  justify-content: center;
// line 2095
  flex-shrink: 0;
// line 2096
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
// line 2097
}
// line 2098

// line 2099
.card-icon {
// line 2100
  font-size: 28px;
// line 2101
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9));
// line 2102
}
// line 2103

// line 2104
.card-info {
// line 2105
  flex: 1;
// line 2106
  display: flex;
// line 2107
  flex-direction: column;
// line 2108
  gap: 3px;
// line 2109
}
// line 2110

// line 2111
.card-header-line {
// line 2112
  display: flex;
// line 2113
  align-items: center;
// line 2114
  justify-content: space-between;
// line 2115
  gap: 6px;
// line 2116
  flex-wrap: wrap;
// line 2117
}
// line 2118

// line 2119
.card-badge {
// line 2120
  font-size: 9px;
// line 2121
  font-weight: 900;
// line 2122
  padding: 2px 5px;
// line 2123
  border-radius: 4px;
// line 2124
  text-transform: uppercase;
// line 2125
  letter-spacing: 0.5px;
// line 2126
}
// line 2127

// line 2128
.badge-weapon { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.5); }
// line 2129
.badge-passive { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.5); }
// line 2130
.badge-evo { background: rgba(245, 158, 11, 0.3); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.8); }
// line 2131
.badge-bonus { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.5); }
// line 2132

// line 2133
.card-title {
// line 2134
  font-weight: 900;
// line 2135
  font-size: 14.5px;
// line 2136
  color: #f8fafc;
// line 2137
  letter-spacing: 0.3px;
// line 2138
}
// line 2139

// line 2140
.card-stars {
// line 2141
  font-size: 11px;
// line 2142
  color: #facc15;
// line 2143
  letter-spacing: 1px;
// line 2144
}
// line 2145

// line 2146
.card-level-tag {
// line 2147
  font-size: 10.5px;
// line 2148
  font-weight: 800;
// line 2149
  color: #facc15;
// line 2150
  background: rgba(0,0,0,0.5);
// line 2151
  padding: 1px 5px;
// line 2152
  border-radius: 4px;
// line 2153
}
// line 2154

// line 2155
.card-desc {
// line 2156
  font-size: 12px;
// line 2157
  color: #cbd5e1;
// line 2158
  line-height: 1.3;
// line 2159
  font-weight: 500;
// line 2160
}
// line 2161

// line 2162
.card-stat-boost {
// line 2163
  font-size: 11px;
// line 2164
  font-weight: 700;
// line 2165
  margin-top: 1px;
// line 2166
}
// line 2167

// line 2168
.card-action-bar {
// line 2169
  display: flex;
// line 2170
  gap: 10px;
// line 2171
  margin-top: 4px;
// line 2172
}
// line 2173

// line 2174
.btn-card-action {
// line 2175
  flex: 1;
// line 2176
  padding: 10px 14px;
// line 2177
  border-radius: 10px;
// line 2178
  font-weight: 900;
// line 2179
  font-size: 13px;
// line 2180
  cursor: pointer;
// line 2181
  border: none;
// line 2182
  display: flex;
// line 2183
  align-items: center;
// line 2184
  justify-content: center;
// line 2185
  gap: 6px;
// line 2186
  transition: all 0.15s;
// line 2187
}
// line 2188

// line 2189
.btn-reroll {
// line 2190
  background: linear-gradient(135deg, #1e293b, #334155);
// line 2191
  color: #38bdf8;
// line 2192
  border: 1.5px solid #38bdf8;
// line 2193
}
// line 2194

// line 2195
.btn-reroll:hover {
// line 2196
  background: #334155;
// line 2197
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
// line 2198
}
// line 2199

// line 2200
.btn-reroll:disabled {
// line 2201
  opacity: 0.4;
// line 2202
  cursor: not-allowed;
// line 2203
  border-color: #64748b;
// line 2204
  color: #64748b;
// line 2205
}
// line 2206

// line 2207
.btn-skip {
// line 2208
  background: linear-gradient(135deg, #27272a, #3f3f46);
// line 2209
  color: #facc15;
// line 2210
  border: 1.5px solid #eab308;
// line 2211
}
// line 2212

// line 2213
.btn-skip:hover {
// line 2214
  background: #3f3f46;
// line 2215
  box-shadow: 0 0 12px rgba(234, 179, 8, 0.4);
// line 2216
}
// line 2217

// line 2218
</style>
// line 2219
    `;
// line 2220
  }
// line 2221

// line 2222

// line 2223
  // Update Dialogue Box
// line 2224
  if (currentIntroIndex === 4) {
// line 2225
    const char = CHARACTERS[selectedCharKey];
// line 2226
    document.getElementById('intro-speaker').innerText = `${char.icon} ${char.name.toUpperCase()} (W AKCJI)`;
// line 2227
    document.getElementById('intro-speaker').style.color = '#4ade80';
// line 2228
    let heroLine = "";
// line 2229
    if (selectedCharKey === 'piotr') heroLine = 'Piotr: Odpalam pistolet na gaz na metalowe kulki, a moja suczka Kluska już ostrzy zęby na łydki urzędników KAS! Żaden bus ani kurier nie odjedzie bez stempla SAD na czole! HAU HAU!';
// line 2230
    else if (selectedCharKey === 'radek') heroLine = 'Radek: Wrzucam bieg w Toyocie BT, robię drift na epoksydzie i taranuję widłami wszystko, co blokuje rampę!';
// line 2231
    else if (selectedCharKey === 'pawel') heroLine = 'Paweł: Biorę podwójną paletę EPAL i zasypuję korytarz drewnem! Żaden bus nie ma prawa wjechać bez kwitu!';
// line 2232
    else if (selectedCharKey === 'marcin') heroLine = 'Marcin: Zapasy papieru toaletowego przygotowane! Zasypię kierowców rolkami Velvet Max, aż im się odechce kłócić o klucz do Toi-Toia!';
// line 2233
    else if (selectedCharKey === 'kierownik_marcin') heroLine = 'Kierownik Marcin: Ładuję baterie w megafonie! Przez mój magazyn nikt nie przejdzie bez autoryzacji! DO ROBOTY!';
// line 2234
    else if (selectedCharKey === 'przemek_biuro') heroLine = 'Przemek: Podłączam WMS bezpośrednio pod skaner! Baza danych zsynchronizowana, kasujemy nieautoryzowane palety!';
// line 2235
    else if (selectedCharKey === 'ania_biuro') heroLine = 'Ania: Pieczątka odmowy przygotowana! Każdy brakujący dokument oznacza natychmiastowe 24H kwarantanny celnej!';
// line 2236
    else if (selectedCharKey === 'grzesiek_zastepca') heroLine = 'Grzesiek: Termos z kawą pełny, kamizelka zapięta pod szyję! Kontrola BHP wjeżdża na rampę!';
// line 2237
    else heroLine = `${char.name.split(' ')[0]}: Wsiadam na wózek, biorę papier toaletowy i wlepiam 24h przetrzymania na SAD! Jazda!`;
// line 2238
    document.getElementById('intro-text').innerText = heroLine;
// line 2239
  } else {
// line 2240
    document.getElementById('intro-speaker').innerText = scene.speaker;
// line 2241
    document.getElementById('intro-speaker').style.color = scene.color;
// line 2242
    document.getElementById('intro-text').innerText = scene.text;
// line 2243
  }
// line 2244

// line 2245
  if (currentIntroIndex === INTRO_ART_SCENES.length - 1) {
// line 2246
    document.getElementById('btn-intro-next').innerText = 'JAZDA NA HALĘ! 🚀';
// line 2247
  } else {
// line 2248
    document.getElementById('btn-intro-next').innerText = 'DALEJ ➔';
// line 2249
  }
// line 2250
}
// line 2251

// line 2252
function nextIntroBtn() {
// line 2253
  sounds.init();
// line 2254
  sounds.beep();
// line 2255
  currentIntroIndex++;
// line 2256
  if (currentIntroIndex >= INTRO_ART_SCENES.length) {
// line 2257
    document.getElementById('intro-screen').style.display = 'none';
// line 2258
    startGamePlay();
// line 2259
  } else {
// line 2260
    updateIntroView();
// line 2261
  }
// line 2262
}
// line 2263

// line 2264
function skipIntroBtn() {
// line 2265
  sounds.init();
// line 2266
  document.getElementById('intro-screen').style.display = 'none';
// line 2267
  startGamePlay();
// line 2268
}
// line 2269

// line 2270
// Ensure the old assignments don't break if element exists
// line 2271
const introNext = document.getElementById('btn-intro-next');
// line 2272
if (introNext) introNext.onclick = nextIntroBtn;
// line 2273
const introSkip = document.getElementById('btn-intro-skip');
// line 2274
if (introSkip) introSkip.onclick = skipIntroBtn;
// line 2275

// line 2276
function handleTouchStart(e) {
// line 2277
  sounds.init();
// line 2278
  if (gameState !== STATE.PLAYING) return;
// line 2279
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, button, .tab-btn, .workshop-card, .upgrade-card, .char-card')) {
// line 2280
    return;
// line 2281
  }
// line 2282
  for (let i = 0; i < e.changedTouches.length; i++) {
// line 2283
    const t = e.changedTouches[i];
// line 2284
    if (t.clientX < gameWidth * 0.55 && !touchState.active) {
// line 2285
      touchState.active = true;
// line 2286
      touchState.id = t.identifier;
// line 2287
      touchState.startX = t.clientX;
// line 2288
      touchState.startY = t.clientY;
// line 2289
      touchState.curX = t.clientX;
// line 2290
      touchState.curY = t.clientY;
// line 2291
      touchState.dirX = 0;
// line 2292
      touchState.dirY = 0;
// line 2293
      joystickBase.style.left = t.clientX + 'px';
// line 2294
      joystickBase.style.top = t.clientY + 'px';
// line 2295
      joystickBase.style.display = 'block';
// line 2296
      joystickThumb.style.left = t.clientX + 'px';
// line 2297
      joystickThumb.style.top = t.clientY + 'px';
// line 2298
      joystickThumb.style.display = 'block';
// line 2299
    }
// line 2300
  }
// line 2301
}
// line 2302

// line 2303
function handleTouchMove(e) {
// line 2304
  if (gameState !== STATE.PLAYING) return;
// line 2305
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, .workshop-grid, .upgrade-list, .char-card')) {
// line 2306
    return; // Allow UI scrolling in modals & menus!
// line 2307
  }
// line 2308
  if (e.cancelable) e.preventDefault();
// line 2309
  for (let i = 0; i < e.changedTouches.length; i++) {
// line 2310
    const t = e.changedTouches[i];
// line 2311
    if (touchState.active && t.identifier === touchState.id) {
// line 2312
      touchState.curX = t.clientX;
// line 2313
      touchState.curY = t.clientY;
// line 2314
      const dx = touchState.curX - touchState.startX;
// line 2315
      const dy = touchState.curY - touchState.startY;
// line 2316
      const dist = Math.hypot(dx, dy);
// line 2317
      const maxR = 55;
// line 2318
      if (dist < 4) {
// line 2319
        touchState.dirX = 0;
// line 2320
        touchState.dirY = 0;
// line 2321
        joystickThumb.style.left = touchState.startX + 'px';
// line 2322
        joystickThumb.style.top = touchState.startY + 'px';
// line 2323
      } else {
// line 2324
        const angle = Math.atan2(dy, dx);
// line 2325
        const clampDist = Math.min(dist, maxR);
// line 2326
        const norm = clampDist / maxR;
// line 2327
        touchState.dirX = Math.cos(angle) * norm;
// line 2328
        touchState.dirY = Math.sin(angle) * norm;
// line 2329
        joystickThumb.style.left = (touchState.startX + Math.cos(angle) * clampDist) + 'px';
// line 2330
        joystickThumb.style.top = (touchState.startY + Math.sin(angle) * clampDist) + 'px';
// line 2331
      }
// line 2332
    }
// line 2333
  }
// line 2334
}
// line 2335

// line 2336
function handleTouchEnd(e) {
// line 2337
  for (let i = 0; i < e.changedTouches.length; i++) {
// line 2338
    const t = e.changedTouches[i];
// line 2339
    if (touchState.active && t.identifier === touchState.id) {
// line 2340
      touchState.active = false;
// line 2341
      touchState.id = null;
// line 2342
      touchState.dirX = 0;
// line 2343
      touchState.dirY = 0;
// line 2344
      joystickBase.style.display = 'none';
// line 2345
      joystickThumb.style.display = 'none';
// line 2346
    }
// line 2347
  }
// line 2348
}
// line 2349

// line 2350
window.addEventListener('touchstart', handleTouchStart, { passive: false });
// line 2351
window.addEventListener('touchmove', handleTouchMove, { passive: false });
// line 2352
window.addEventListener('touchend', handleTouchEnd, { passive: false });
// line 2353
window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
// line 2354

// line 2355
function triggerSkill() {
// line 2356
  if (player.skillCooldown <= 0 && gameState === STATE.PLAYING) {
// line 2357
    player.skillCooldown = player.maxSkillCooldown;
// line 2358
    coffeeDashCount++;
// line 2359
    sounds.dash();
// line 2360
    if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(60);
// line 2361

// line 2362
    if (selectedCharKey === 'piotr') {
// line 2363
      sounds.gasPistol();
// line 2364
      setTimeout(() => sounds.metalBB(), 120);
// line 2365
      screenShake = 12;
// line 2366
      
// line 2367
      // 1. Gas Pistol Pepper Gas Cloud Burst
// line 2368
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 4) {
// line 2369
        projectiles.push({
// line 2370
          type: 'gas_cloud',
// line 2371
          x: player.x + Math.cos(ang) * 40,
// line 2372
          y: player.y + Math.sin(ang) * 40,
// line 2373
          vx: Math.cos(ang) * 1.5,
// line 2374
          vy: Math.sin(ang) * 1.5,
// line 2375
          radius: 35,
// line 2376
          maxRadius: 90,
// line 2377
          life: 3.5,
// line 2378
          maxLife: 3.5,
// line 2379
          damage: 35
// line 2380
        });
// line 2381
      }
// line 2382
      
// line 2383
      // 2. Metal BB Pellets (16 piercing steel BBs in 360 ring)
// line 2384
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 8) {
// line 2385
        projectiles.push({
// line 2386
          type: 'metal_bb',
// line 2387
          x: player.x,
// line 2388
          y: player.y,
// line 2389
          vx: Math.cos(ang) * 14.0,
// line 2390
          vy: Math.sin(ang) * 14.0,
// line 2391
          life: 1.8,
// line 2392
          damage: 135,
// line 2393
          pierce: 3
// line 2394
        });
// line 2395
      }
// line 2396
      
// line 2397
      // 3. Summon Kluska (Rage Mode!)
// line 2398
      kluska.active = true;
// line 2399
      kluska.rageTimer = 6.0;
// line 2400
      
// line 2401
      addSpeechBubble(player.x, player.y - 35, '🔫 GAZ PIEPRZOWY, METALOWE KULKI & KLUSKA! 🐕', '#facc15');
// line 2402
    } else if (selectedCharKey === 'radek') {
// line 2403
      player.isDashing = true;
// line 2404
      player.dashTimer = 0.95;
// line 2405
      player.invulnTimer = 0.95;
// line 2406
      screenShake = 7;
// line 2407
      createSparks(player.x, player.y, 30, '#f97316');
// line 2408
      addSpeechBubble(player.x, player.y - 30, '🚜 RADEK: SZARŻA TOYOTĄ BT!', '#f59e0b');
// line 2409
    } else if (selectedCharKey === 'pawel') {
// line 2410
      sounds.pallet();
// line 2411
      screenShake = 9;
// line 2412
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 4) {
// line 2413
        projectiles.push({
// line 2414
          type: 'pallet',
// line 2415
          x: player.x,
// line 2416
          y: player.y,
// line 2417
          vx: Math.cos(ang) * 9.0,
// line 2418
          vy: Math.sin(ang) * 9.0,
// line 2419
          angle: ang,
// line 2420
          life: 2.0,
// line 2421
          damage: 110,
// line 2422
          isEvo: true
// line 2423
        });
// line 2424
      }
// line 2425
      addSpeechBubble(player.x, player.y - 30, '🪵 PAWEŁ: POCZWÓRNA SALWA EPAL!', '#f59e0b');
// line 2426
    } else if (selectedCharKey === 'marcin') {
// line 2427
      sounds.hit();
// line 2428
      screenShake = 6;
// line 2429
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 6) {
// line 2430
        projectiles.push({
// line 2431
          type: 'toilet_paper',
// line 2432
          x: player.x,
// line 2433
          y: player.y,
// line 2434
          vx: Math.cos(ang) * 8.5,
// line 2435
          vy: Math.sin(ang) * 8.5,
// line 2436
          rot: 0,
// line 2437
          life: 2.5,
// line 2438
          damage: 85,
// line 2439
          isEvo: true
// line 2440
        });
// line 2441
      }
// line 2442
      addSpeechBubble(player.x, player.y - 30, '🧻 MARCIN: BOMBA VELVET MAX!', '#fef08a');
// line 2443
    } else if (selectedCharKey === 'kierownik_marcin') {
// line 2444
      sounds.megaph();
// line 2445
      screenShake = 12;
// line 2446
      enemies.forEach(e => {
// line 2447
        const dx = e.x - player.x;
// line 2448
        const dy = e.y - player.y;
// line 2449
        if (Math.hypot(dx, dy) < 420) {
// line 2450
          damageEnemy(e, 120);
// line 2451
          e.slowTimer = 3.5;
// line 2452
          const a = Math.atan2(dy, dx);
// line 2453
          e.x += Math.cos(a) * 110;
// line 2454
          e.y += Math.sin(a) * 110;
// line 2455
          createSparks(e.x, e.y, 10, '#eab308');
// line 2456
        }
// line 2457
      });
// line 2458
      addSpeechBubble(player.x, player.y - 30, '📢 KIEROWNIK MARCIN: DO ROBOTY!!', '#eab308');
// line 2459
    } else if (selectedCharKey === 'przemek_biuro') {
// line 2460
      sounds.levelUp();
// line 2461
      screenShake = 7;
// line 2462
      // WMS Overload: zaps nearest 20 enemies & pulls all XP items
// line 2463
      dropItems.forEach(d => {
// line 2464
        if (d.type === 'barcode_xp' || d.type === 'xp') {
// line 2465
          d.x = player.x;
// line 2466
          d.y = player.y;
// line 2467
        }
// line 2468
      });
// line 2469
      enemies.slice(0, 20).forEach(e => {
// line 2470
        if (!e.dead) {
// line 2471
          damageEnemy(e, 90);
// line 2472
          projectiles.push({
// line 2473
            type: 'laser',
// line 2474
            x1: player.x,
// line 2475
            y1: player.y,
// line 2476
            x2: e.x,
// line 2477
            y2: e.y,
// line 2478
            life: 0.4,
// line 2479
            color: '#a855f7'
// line 2480
          });
// line 2481
        }
// line 2482
      });
// line 2483
      addSpeechBubble(player.x, player.y - 30, '💻 PRZEMEK: SYSTEM WMS ZSYNC!', '#c084fc');
// line 2484
    } else if (selectedCharKey === 'ania_biuro') {
// line 2485
      sounds.freeze();
// line 2486
      screenShake = 8;
// line 2487
      enemies.forEach(e => {
// line 2488
        if (Math.hypot(e.x - player.x, e.y - player.y) < 450) {
// line 2489
          e.slowTimer = 4.0;
// line 2490
          damageEnemy(e, 85);
// line 2491
          createSparks(e.x, e.y, 10, '#38bdf8');
// line 2492
        }
// line 2493
      });
// line 2494
      addSpeechBubble(player.x, player.y - 30, '📋 ANIA: BLOKADA SAD! WSTRZYMANIE!', '#38bdf8');
// line 2495
    } else if (selectedCharKey === 'grzesiek_zastepca') {
// line 2496
      sounds.megaph();
// line 2497
      screenShake = 9;
// line 2498
      player.battery = Math.min(player.maxBattery, player.battery + 25);
// line 2499
      enemies.forEach(e => {
// line 2500
        const dx = e.x - player.x;
// line 2501
        const dy = e.y - player.y;
// line 2502
        if (Math.hypot(dx, dy) < 350) {
// line 2503
          damageEnemy(e, 95);
// line 2504
          e.slowTimer = 2.5;
// line 2505
          const a = Math.atan2(dy, dx);
// line 2506
          e.x += Math.cos(a) * 90;
// line 2507
          e.y += Math.sin(a) * 90;
// line 2508
        }
// line 2509
      });
// line 2510
      addSpeechBubble(player.x, player.y - 30, '☕ GRZESIEK: KONTROLA BHP & KAWA!', '#f59e0b');
// line 2511
    } else if (selectedCharKey === 'mirek') {
// line 2512
      sounds.hit();
// line 2513
      screenShake = 14;
// line 2514
      player.battery = Math.min(player.maxBattery, player.battery + 20);
// line 2515
      const slamRadius = 320;
// line 2516
      enemies.forEach(e => {
// line 2517
        const dist = Math.hypot(e.x - player.x, e.y - player.y);
// line 2518
        if (dist < slamRadius) {
// line 2519
          damageEnemy(e, 140);
// line 2520
          e.slowTimer = 3.0;
// line 2521
          createSparks(e.x, e.y, 12, '#f59e0b');
// line 2522
        }
// line 2523
      });
// line 2524
      projectiles.push({
// line 2525
        type: 'shockwave',
// line 2526
        x: player.x,
// line 2527
        y: player.y,
// line 2528
        radius: 20,
// line 2529
        maxRadius: slamRadius,
// line 2530
        life: 0.4,
// line 2531
        maxLife: 0.4,
// line 2532
        color: '#f59e0b'
// line 2533
      });
// line 2534
      addSpeechBubble(player.x, player.y - 30, '🔧 PAN MIREK: UDAR & TRYTYTKA!', '#f59e0b');
// line 2535
    } else if (selectedCharKey === 'klaus') {
// line 2536
      sounds.laser();
// line 2537
      screenShake = 11;
// line 2538
      for (let i = 0; i < 8; i++) {
// line 2539
        const a = (i * Math.PI * 2) / 8 + gameTime;
// line 2540
        const ex = player.x + Math.cos(a) * 450;
// line 2541
        const ey = player.y + Math.sin(a) * 450;
// line 2542
        projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: ex, y2: ey, life: 0.4, color: '#ef4444' });
// line 2543
      }
// line 2544
      enemies.forEach(e => {
// line 2545
        if (Math.hypot(e.x - player.x, e.y - player.y) < 450) {
// line 2546
          damageEnemy(e, 110);
// line 2547
          e.slowTimer = 3.5;
// line 2548
          createSparks(e.x, e.y, 8, '#ef4444');
// line 2549
        }
// line 2550
      });
// line 2551
      addSpeechBubble(player.x, player.y - 30, '🇩🇪 KLAUS: AUDYT DIN & KARA!', '#f87171');
// line 2552
    }
// line 2553

// line 2554
    if (coffeeDashCount >= 10) triggerAchievement('coffee_addict', 'Klawo-Kawa Espresso', '☕');
// line 2555
  }
// line 2556
}
// line 2557

// line 2558
btnDash.addEventListener('touchstart', (e) => { e.preventDefault(); sounds.init(); triggerSkill(); });
// line 2559
btnDash.addEventListener('click', () => { sounds.init(); triggerSkill(); });
// line 2560

// line 2561
// Forklift controls (hold to sprint)
// line 2562
const startForklift = (e) => { if(e) e.preventDefault(); sounds.init(); player.wantsForklift = true; };
// line 2563
const stopForklift = (e) => { if(e) e.preventDefault(); player.wantsForklift = false; };
// line 2564
btnForklift.addEventListener('touchstart', startForklift);
// line 2565
btnForklift.addEventListener('touchend', stopForklift);
// line 2566
btnForklift.addEventListener('mousedown', startForklift);
// line 2567
btnForklift.addEventListener('mouseup', stopForklift);
// line 2568
btnForklift.addEventListener('mouseleave', stopForklift);
// line 2569
window.addEventListener('keydown', (e) => { if(e.key === 'Shift') player.wantsForklift = true; });
// line 2570
window.addEventListener('keyup', (e) => { if(e.key === 'Shift') player.wantsForklift = false; });
// line 2571

// line 2572

// line 2573
let lastPlayerSpeechTime = 0;
// line 2574
function addSpeechBubble(x, y, text, color = '#ffffff') {
// line 2575
  const isPlayer = Math.hypot(x - player.x, y - player.y) < 25;
// line 2576
  const now = Date.now();
// line 2577
  if (isPlayer) {
// line 2578
    if (now - lastPlayerSpeechTime < 2800) return;
// line 2579
    lastPlayerSpeechTime = now;
// line 2580
  }
// line 2581
  if (speechBubbles.length >= 3) speechBubbles.shift();
// line 2582
  speechBubbles.push({ x, y, text, color, life: 1.8, maxLife: 1.8 });
// line 2583
}
// line 2584

// line 2585
// --- ENEMY CATALOG (Unique Visuals & Attacks) ---
// line 2586
const ENEMY_TYPES = {
// line 2587
  FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 85, radius: 15, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#cbd5e1', itemIcon: '🗞️', xp: 2, quotes: ['PRZYLEPIŁEM SIĘ!', 'ZROBIONY W BALONA!', 'OWIJAĆ CIĘ?!'] },
// line 2588
  FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 125, radius: 10, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#e2e8f0', itemIcon: '💨', xp: 1, quotes: ['ŁAP MNIE!', 'ODPRYSK STRECZU!'] },
// line 2589
  KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 80, radius: 12, renderType: 'pedestrian', color: '#d97706', clothColor: '#b45309', itemIcon: '📦', xp: 1, quotes: ['OSTRZEŻENIE: SZKŁO!', 'NIE RZUCAĆ!', 'GŁÓWNA SIEDZIBA B2C'] },
// line 2590
  KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 105, radius: 18, renderType: 'pedestrian', color: '#ef4444', clothColor: '#1e293b', itemIcon: '🚛', xp: 4, canDash: true, quotes: ['GDZIE MOJA KAWA?!', 'STOJĘ OD 4 RANO!', 'SZUKAM RAMPY 3!'] },
// line 2591
  WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 155, radius: 24, renderType: 'pedestrian', color: '#ea580c', clothColor: '#991b1b', itemIcon: '⚠️', xp: 8, straightLine: true, quotes: ['PISZCZY BATERIA!', 'HAMULCE NIE DZIAŁAJĄ!', 'SAD BEZ HOMOLOGACJI!'] },
// line 2592
  PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 55, radius: 28, renderType: 'pedestrian', color: '#78350f', clothColor: '#451a03', itemIcon: '🧱', xp: 10, armor: true, quotes: ['JESTEM ZAGADKĄ DTA!', 'EPAL BEZ PIECZĄTKI!'] },
// line 2593
  RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 40, radius: 35, renderType: 'pedestrian', color: '#475569', clothColor: '#0f172a', itemIcon: '🚧', xp: 15, directionalShield: true, quotes: ['RAMPA ZABLOKOWANA!', 'CZEKAJ NA SWOJĄ KOLEJ!'] },
// line 2594
  CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 70, radius: 16, renderType: 'pedestrian', color: '#dc2626', clothColor: '#7f1d1d', itemIcon: '🛑', xp: 5, shooter: true, quotes: ['KONTROLA DOKUMENTÓW SAD!', 'STÓJ! REWIZJA!', 'BRAK PIECZĄTKI KAS!'] },
// line 2595
  BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 75, radius: 30, renderType: 'pedestrian', color: '#ef4444', clothColor: '#000000', itemIcon: '🦅', xp: 500, mechanics: 'kas_zone', quotes: ['AUDYT SKARBOWY KAS!', 'POKAŻ DEKLARACJĘ VAT!', 'REWIZJA SZCZEGÓŁOWA!'] },
// line 2596
  BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 35, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 1000, mechanics: 'spawner', quotes: ['CAŁY MORSKI ŁADUNEK!', 'ZARAZ FAJRANT!'] },
// line 2597

// line 2598
  KURIER_DPD: { name: 'Spóźniony Kurier DPD', hp: 45, speed: 170, radius: 14, renderType: 'pedestrian', color: '#ef4444', clothColor: '#fca5a5', itemIcon: '📦', xp: 4, canDash: true, quotes: ['PRZESYŁKA AWIZOWANA!', 'NIE MAM CZASU!', 'RZUĆ TO!'] },
// line 2599
  BHP_INSPECTOR_SUPER: { isBoss: true, name: 'Główny Inspektor BHP', hp: 3500, speed: 65, radius: 28, renderType: 'pedestrian', color: '#f59e0b', clothColor: '#451a03', itemIcon: '📋', xp: 750, mechanics: 'kas_zone', quotes: ['BRAK KASKU!', 'KARA FINANSOWA!', 'PROSZĘ O PRZEPUSTKĘ!'] },
// line 2600
  ZLECENIE_NA_CITO: { name: 'Zlecenie na Cito', hp: 5, speed: 220, radius: 10, renderType: 'pedestrian', color: '#ffffff', clothColor: '#f8fafc', itemIcon: '📄', xp: 1, quotes: ['NA WCZORAJ!', 'BARDZO PILNE!'] },
// line 2601
  PALECIAK_REZYGNACJI: { name: 'Rzucony Paleciak', hp: 60, speed: 140, radius: 22, renderType: 'pedestrian', color: '#475569', clothColor: '#1e293b', itemIcon: '🛒', xp: 6, straightLine: true, quotes: ['ZWALNIAM SIĘ!', 'NIE CHCE MI SIĘ!'] },
// line 2602

// line 2603
  JADZIA_KSIEGOWOSC: { name: 'Pani Jadzia z Księgowości', hp: 110, speed: 65, radius: 18, renderType: 'pedestrian', color: '#ec4899', clothColor: '#fbcfe8', itemIcon: '☕', xp: 8, shooter: true, quotes: ['PRZERWA KAWOWA!', 'FAKTURA BEZ NIP-U!', 'KTO TO PODPISAŁ?!'] },
// line 2604
  JUNGHEINRICH_SZALENIEC: { name: 'Młody na Jungheinrichu', hp: 180, speed: 195, radius: 25, renderType: 'reach_truck', color: '#facc15', itemIcon: '🏎️', xp: 12, canDash: true, quotes: ['BOKIEM PO RAMPART!', 'BEZ UDT ALE SZYBKO!', 'Z DROGI!'] },
// line 2605
  INWENTARYZACJA: { name: 'Roczna Inwentaryzacja', hp: 380, speed: 45, radius: 32, renderType: 'pedestrian', color: '#94a3b8', clothColor: '#334155', itemIcon: '📊', xp: 20, special: 'split_on_death', quotes: ['SPIS Z NATURY!', 'MANKO NA WAREHOUSE!', 'SZUKAMY 100 PALET!'] },
// line 2606
  BOSS_PREZES_WIZYTACJA: { isBoss: true, name: 'Prezes Zarządu na Wizytacji', hp: 10000, speed: 70, radius: 45, renderType: 'boss_bhp', color: '#f59e0b', clothColor: '#000000', itemIcon: '👔', xp: 1500, mechanics: 'kas_zone', quotes: ['DLACZEGO CI KIEROWCY STOJĄ?!', 'AUDYT LOGISTYCZNY!', 'WYSKOKIE KPI ALBO ZWOLNIENIA!'] },
// line 2607

// line 2608
  PRAKTYKANT: {
// line 2609
    name: 'Zagubiony Praktykant',
// line 2610
    hp: 15,
// line 2611
    speed: 95,
// line 2612
    radius: 14,
// line 2613
    renderType: 'pedestrian',
// line 2614
    color: '#10b981',
// line 2615
    clothColor: '#6ee7b7',
// line 2616
    itemIcon: '📝',
// line 2617
    xp: 1,
// line 2618
    quotes: ['Gdzie jest toaleta?', 'Jak to zeskanować?', 'Pomocy!']
// line 2619
  },
// line 2620
  AUDYTOR: {
// line 2621
    name: 'Audytor BHP',
// line 2622
    hp: 350,
// line 2623
    speed: 75,
// line 2624
    radius: 20,
// line 2625
    renderType: 'pedestrian',
// line 2626
    color: '#475569',
// line 2627
    clothColor: '#facc15',
// line 2628
    itemIcon: '📋',
// line 2629
    xp: 25,
// line 2630
    quotes: ['Brak kasku!', 'Gdzie kamizelka?!', 'Wypiszę mandat!']
// line 2631
  },
// line 2632
  KURIER: {
// line 2633
    name: 'Wściekły Kurier',
// line 2634
    hp: 60,
// line 2635
    speed: 120,
// line 2636
    radius: 16,
// line 2637
    renderType: 'pedestrian',
// line 2638
    color: '#eab308',
// line 2639
    clothColor: '#ef4444',
// line 2640
    itemIcon: '📦',
// line 2641
    xp: 5,
// line 2642
    quotes: ['Mam mało czasu!', 'Rzucam paczkę!', 'Podpisz to!']
// line 2643
  },
// line 2644
  KLAPKI: {
// line 2645
    name: 'Kierowca w Klapkach',
// line 2646
    hp: 35,
// line 2647
    speed: 90,
// line 2648
    radius: 16,
// line 2649
    renderType: 'pedestrian',
// line 2650
    color: '#ef4444',
// line 2651
    clothColor: '#38bdf8',
// line 2652
    itemIcon: '🩴',
// line 2653
    xp: 2,
// line 2654
    quotes: ['GDZIE KIBEL?!', 'JESTEM Z LITWY!', 'WC!', 'PILNE!']
// line 2655
  },
// line 2656
  DWIE_PALETY_BUS: {
// line 2657
    name: 'Bus "Ja tylko dwie palety"',
// line 2658
    hp: 420,
// line 2659
    speed: 125,
// line 2660
    radius: 32,
// line 2661
    renderType: 'delivery_van',
// line 2662
    color: '#f97316',
// line 2663
    xp: 18,
// line 2664
    special: 'charge_drop_pallets',
// line 2665
    quotes: ['JA TYLKO DWIE PALETKI!', 'WPUSZCZASZ CZY NIE?!', 'MINUTKA I ZJEŻDŻAM!']
// line 2666
  },
// line 2667
  UKRAINA_EKIPA: {
// line 2668
    name: 'Ekipa ze Wschodu',
// line 2669
    hp: 55,
// line 2670
    speed: 95,
// line 2671
    radius: 17,
// line 2672
    renderType: 'worker_team',
// line 2673
    color: '#3b82f6',
// line 2674
    itemIcon: '📦',
// line 2675
    xp: 4,
// line 2676
    quotes: ['DAWAJ, DAWAJ!', 'SZYBKO ROZŁADUJEMY!', 'NA RAMPĘ!']
// line 2677
  },
// line 2678
  SPEDYTOR: {
// line 2679
    name: 'Spedytor na Telefonie',
// line 2680
    hp: 90,
// line 2681
    speed: 70,
// line 2682
    radius: 18,
// line 2683
    renderType: 'pedestrian_suit',
// line 2684
    color: '#a855f7',
// line 2685
    itemIcon: '📱',
// line 2686
    xp: 6,
// line 2687
    special: 'sound_wave',
// line 2688
    quotes: ['GDZIE JEST AUTO?!', 'KIEROWCA STOI!', 'KARY UMOWNE!']
// line 2689
  },
// line 2690
  AWIZO: {
// line 2691
    name: 'Kierowca z Awizo z 2023',
// line 2692
    hp: 140,
// line 2693
    speed: 60,
// line 2694
    radius: 20,
// line 2695
    renderType: 'pedestrian',
// line 2696
    color: '#64748b',
// line 2697
    itemIcon: '📋',
// line 2698
    xp: 5,
// line 2699
    quotes: ['CZEKAM 14 GODZIN!', 'GDZIE ODPRAWA?!', 'MAM NUMEREK!']
// line 2700
  },
// line 2701
  TASMA: {
// line 2702
    name: 'Piotr z Taśmownicą',
// line 2703
    hp: 75,
// line 2704
    speed: 85,
// line 2705
    radius: 18,
// line 2706
    renderType: 'pedestrian',
// line 2707
    color: '#eab308',
// line 2708
    itemIcon: '🎗️',
// line 2709
    xp: 4,
// line 2710
    quotes: ['DAJ TAŚMĘ!', 'OKLEJAM!', 'TRZYMAĆ!']
// line 2711
  },
// line 2712
  WIESLAW_REACH: {
// line 2713
    name: 'Pan Wiesław (Wysoki Skład)',
// line 2714
    hp: 240,
// line 2715
    speed: 75,
// line 2716
    radius: 26,
// line 2717
    renderType: 'reach_truck',
// line 2718
    color: '#0284c7',
// line 2719
    xp: 12,
// line 2720
    quotes: ['ZRZUCAM Z GÓRY!', 'UWAGA NA GŁOWY!']
// line 2721
  },
// line 2722
  // SECTOR BOSSES (Spawn dynamically every 2 minutes)
// line 2723
  BOSS_ZBIGNIEW: {
// line 2724
    isBoss: true,
// line 2725
    name: 'Kierownik Rampa Zbigniew (BHP)',
// line 2726
    hp: 1600,
// line 2727
    speed: 70,
// line 2728
    radius: 34,
// line 2729
    renderType: 'boss_bhp',
// line 2730
    color: '#f97316',
// line 2731
    xp: 100,
// line 2732
    special: 'spawn_cones',
// line 2733
    quotes: ['MANDAT BHP 500 PLN!', 'GDZIE KAMIZELKA?!', 'ZATRZYMAĆ WÓZEK!']
// line 2734
  },
// line 2735
  BOSS_GRZESIEK: {
// line 2736
    isBoss: true,
// line 2737
    name: 'Zastępca Grzesiek (BHP)',
// line 2738
    hp: 1600,
// line 2739
    speed: 70,
// line 2740
    radius: 34,
// line 2741
    renderType: 'boss_bhp',
// line 2742
    color: '#f97316',
// line 2743
    xp: 100,
// line 2744
    special: 'spawn_cones',
// line 2745
    quotes: ['MANDAT BHP 500 PLN!', 'GDZIE KAMIZELKA?!', 'ZATRZYMAĆ WÓZEK!']
// line 2746
  },
// line 2747
  BOSS_WIESLAW_REACH: {
// line 2748
    isBoss: true,
// line 2749
    name: 'Pan Wiesław (Wysoki Skład - Boss)',
// line 2750
    hp: 3200,
// line 2751
    speed: 75,
// line 2752
    radius: 38,
// line 2753
    renderType: 'reach_truck',
// line 2754
    color: '#0284c7',
// line 2755
    xp: 150,
// line 2756
    special: 'pallet_storm',
// line 2757
    quotes: ['ZRZUCAM Z DWUNASTEGO METRA!', 'UWAGA NA GŁOWY!', 'CZYSTA LOGISTYKA!']
// line 2758
  },
// line 2759
  BOSS_TOITOI_MECH: {
// line 2760
    isBoss: true,
// line 2761
    name: 'Zmutowany Mecha-ToiToi 3000',
// line 2762
    hp: 4800,
// line 2763
    speed: 80,
// line 2764
    radius: 42,
// line 2765
    renderType: 'toitoi_mech',
// line 2766
    color: '#15803d',
// line 2767
    xp: 200,
// line 2768
    special: 'toxic_gas',
// line 2769
    quotes: ['*TOKSYCZNE BULGOTANIE*', 'AURA CHŁODU I CHEMICZNEGO ZAPACHU!', 'BRUDNA EWOLUCJA!']
// line 2770
  },
// line 2771
  BOSS_KONTENER: {
// line 2772
    isBoss: true,
// line 2773
    name: 'Spóźniony Kontener 40ft (Przed 16:00)',
// line 2774
    hp: 6000,
// line 2775
    speed: 80,
// line 2776
    radius: 48,
// line 2777
    renderType: 'container_truck',
// line 2778
    color: '#b91c1c',
// line 2779
    xp: 250,
// line 2780
    special: 'cargo_barrage',
// line 2781
    quotes: ['TRZY MINUTY DO FAJRANTU!', 'ROZŁADOWAĆ DO 16:00!', 'CAŁY MORSKI ŁADUNEK!']
// line 2782
  },
// line 2783
  BOSS_IGOR: {
// line 2784
    isBoss: true,
// line 2785
    name: 'Udziałowiec Igor (Wykręca Żarówki)',
// line 2786
    hp: 8500,
// line 2787
    speed: 90,
// line 2788
    radius: 46,
// line 2789
    renderType: 'boss_igor',
// line 2790
    color: '#1e1b4b',
// line 2791
    xp: 350,
// line 2792
    special: 'lights_out',
// line 2793
    quotes: ['CIEMNIEJ! TANIEJ!', 'OPTYMALIZACJA ENERGII!', 'TNĘ ETATY!']
// line 2794
  }
// line 2795
};
// line 2796

// line 2797
// --- DYNAMIC WAREHOUSE SECTOR TIERS (Levels change dynamically in-game every 2 minutes) ---
// line 2798
const WAREHOUSE_SECTORS = [
// line 2799
  {
// line 2800
    id: 1,
// line 2801
    name: 'SEKTOR 1: DOKI ROZŁADUNKOWE & RAMPY B2C',
// line 2802
    floorColor: '#0f172a',
// line 2803
    gridColor: '#1e293b',
// line 2804
    hazardColor: '#f59e0b',
// line 2805
    bossKey: 'BOSS_GRZESIEK',
// line 2806
    bossName: 'Zastępca Grzesiek (BHP)',
// line 2807
    bossTime: 120, // 2:00
// line 2808
    spawnPool: ['KARTON_B2C', 'FOLIA', 'PRAKTYKANT', 'KLAPKI', 'KURIER', 'DWIE_PALETY_BUS', 'KURIER_DPD', 'JADZIA_KSIEGOWOSC'],
// line 2809
    desc: 'Brama wjazdowa i rampy przeładunkowe. Hordy niecierpliwych kierowców i zagubionych paczek.'
// line 2810
  },
// line 2811
  {
// line 2812
    id: 2,
// line 2813
    name: 'SEKTOR 2: ALEJE WYSOKIEGO SKŁADU (HIGH-BAY)',
// line 2814
    floorColor: '#091e3a',
// line 2815
    gridColor: '#1e40af',
// line 2816
    hazardColor: '#38bdf8',
// line 2817
    bossKey: 'BOSS_WIESLAW_REACH',
// line 2818
    bossName: 'Pan Wiesław (Wysoki Skład)',
// line 2819
    bossTime: 240, // 4:00
// line 2820
    spawnPool: ['PALETA_KAM', 'WIESLAW_REACH', 'UKRAINA_EKIPA', 'TASMA', 'WOZEK_AWARIA', 'DWIE_PALETY_BUS', 'ZLECENIE_NA_CITO', 'JUNGHEINRICH_SZALENIEC'],
// line 2821
    desc: '14-metrowe wieżowce z palet EPAL, wąskie korytarze i spadające ładunki.'
// line 2822
  },
// line 2823
  {
// line 2824
    id: 3,
// line 2825
    name: 'SEKTOR 3: STREFA KONTROLI CELNEJ & BHP',
// line 2826
    floorColor: '#261230',
// line 2827
    gridColor: '#581c87',
// line 2828
    hazardColor: '#ec4899',
// line 2829
    bossKey: 'BOSS_KAS',
// line 2830
    bossName: 'Główny Inspektor KAS',
// line 2831
    bossTime: 360, // 6:00
// line 2832
    spawnPool: ['CELNIK', 'AUDYTOR', 'SPEDYTOR', 'AWIZO', 'RAMPA', 'KIEROWCA_TIR'],
// line 2833
    desc: 'Kordon celny, kwarantanna przesyłek i czerwone pieczęcie odmowy odprawy.'
// line 2834
  },
// line 2835
  {
// line 2836
    id: 4,
// line 2837
    name: 'SEKTOR 4: STREFA CHŁODNICZA & ADR (SUB-ZERO)',
// line 2838
    floorColor: '#032b2b',
// line 2839
    gridColor: '#0f766e',
// line 2840
    hazardColor: '#2dd4bf',
// line 2841
    bossKey: 'BOSS_TOITOI_MECH',
// line 2842
    bossName: 'Zmutowany Mecha-ToiToi 3000',
// line 2843
    bossTime: 480, // 8:00
// line 2844
    spawnPool: ['FOLIA_MALA', 'WOZEK_AWARIA', 'KURIER', 'DWIE_PALETY_BUS', 'KLAPKI', 'PALETA_KAM'],
// line 2845
    desc: 'Arktyczne mrozy -18°C, oblodzona posadzka o poślizgu i zmutowane odpady.'
// line 2846
  },
// line 2847
  {
// line 2848
    id: 5,
// line 2849
    name: 'SEKTOR 5: CENTRALA DYREKCJI & SALA ZARZĄDU',
// line 2850
    floorColor: '#2d0a1b',
// line 2851
    gridColor: '#9d174d',
// line 2852
    hazardColor: '#f43f5e',
// line 2853
    bossKey: 'BOSS_IGOR',
// line 2854
    bossName: 'Udziałowiec Igor & Zarząd DTA',
// line 2855
    bossTime: 600, // 10:00
// line 2856
    spawnPool: ['SPEDYTOR', 'CELNIK', 'AUDYTOR', 'WIESLAW_REACH', 'DWIE_PALETY_BUS', 'KIEROWCA_TIR'],
// line 2857
    desc: 'Luksusowe korytarze, wykręcone żarówki i ostateczna bitwa o upragniony fajrant o 07:00!'
// line 2858
  }
// line 2859
];
// line 2860

// line 2861
let currentSectorIndex = 0;
// line 2862
let activeBoss = null;
// line 2863
let hitStopTimer = 0;
// line 2864
let mysteryTimer = 0;
// line 2865
let mysteryActive = '';
// line 2866
let mysteryBuffMultiplier = 1.0;
// line 2867

// line 2868
// Persistent Workshop Upgrades
// line 2869
let dtaCoins = parseInt(localStorage.getItem('dta_coins') || '350', 10);
// line 2870
let workshopUpgrades = {
// line 2871
  battery: parseInt(localStorage.getItem('dta_upg_battery') || '0', 10),
// line 2872
  speed: parseInt(localStorage.getItem('dta_upg_speed') || '0', 10),
// line 2873
  damage: parseInt(localStorage.getItem('dta_upg_damage') || '0', 10),
// line 2874
  magnet: parseInt(localStorage.getItem('dta_upg_magnet') || '0', 10),
// line 2875
  cooldown: parseInt(localStorage.getItem('dta_upg_cooldown') || '0', 10),
// line 2876
  oponyKolcowane: parseInt(localStorage.getItem('dta_upg_opony') || '0', 10),
// line 2877
  halogenyLed: parseInt(localStorage.getItem('dta_upg_halogeny') || '0', 10),
// line 2878
  pancerzRabitza: parseInt(localStorage.getItem('dta_upg_pancerz') || '0', 10),
// line 2879
  kogutOstrzegawczy: parseInt(localStorage.getItem('dta_upg_kogut') || '0', 10)
// line 2880
};
// line 2881

// line 2882
function saveWorkshopData() {
// line 2883
  localStorage.setItem('dta_coins', dtaCoins.toString());
// line 2884
  localStorage.setItem('dta_upg_battery', workshopUpgrades.battery.toString());
// line 2885
  localStorage.setItem('dta_upg_speed', workshopUpgrades.speed.toString());
// line 2886
  localStorage.setItem('dta_upg_damage', workshopUpgrades.damage.toString());
// line 2887
  localStorage.setItem('dta_upg_magnet', workshopUpgrades.magnet.toString());
// line 2888
  localStorage.setItem('dta_upg_cooldown', workshopUpgrades.cooldown.toString());
// line 2889
  const coinEl = document.getElementById('shop-coins-display');
// line 2890
  if (coinEl) coinEl.innerText = `💰 ${dtaCoins} MONET`;
// line 2891
}
// line 2892

// line 2893
// --- QUEUED NON-INTRUSIVE ANNOUNCEMENT ENGINE ---
// line 2894
const announcementQueue = [];
// line 2895
let isAnnouncementShowing = false;
// line 2896
let lastAnnouncementText = '';
// line 2897
let lastAnnouncementTime = 0;
// line 2898

// line 2899
function showAnnouncement(txt, col = '#38bdf8') {
// line 2900
  const now = Date.now();
// line 2901
  if (txt === lastAnnouncementText && (now - lastAnnouncementTime < 4000)) return;
// line 2902
  announcementQueue.push({ txt, col, time: now });
// line 2903
  processAnnouncementQueue();
// line 2904
}
// line 2905

// line 2906
function processAnnouncementQueue() {
// line 2907
  if (isAnnouncementShowing || announcementQueue.length === 0) return;
// line 2908
  const item = announcementQueue.shift();
// line 2909
  isAnnouncementShowing = true;
// line 2910
  lastAnnouncementText = item.txt;
// line 2911
  lastAnnouncementTime = item.time;
// line 2912

// line 2913
  const el = document.getElementById('announcement');
// line 2914
  if (el) {
// line 2915
    el.innerText = item.txt;
// line 2916
    el.style.color = item.col;
// line 2917
    el.style.borderColor = item.col;
// line 2918
    el.style.opacity = '1';
// line 2919
    el.style.transform = 'translate(-50%, 0) scale(1)';
// line 2920
  }
// line 2921

// line 2922
  setTimeout(() => {
// line 2923
    if (el) {
// line 2924
      el.style.opacity = '0';
// line 2925
      el.style.transform = 'translate(-50%, -10px) scale(0.95)';
// line 2926
    }
// line 2927
    setTimeout(() => {
// line 2928
      isAnnouncementShowing = false;
// line 2929
      processAnnouncementQueue();
// line 2930
    }, 250);
// line 2931
  }, 2200);
// line 2932
}
// line 2933

// line 2934
let spawnedBossSectors = [false, false, false, false, false];
// line 2935
const MAX_ENEMIES_CAP = 250;
// line 2936

// line 2937
function spawnEnemyAt(typeKey, ex, ey, isBoss = false) {
// line 2938
  const t = ENEMY_TYPES[typeKey];
// line 2939
  if (!t) return;
// line 2940

// line 2941
  const enemy = {
// line 2942
    x: Math.max(50, Math.min(ARENA_WIDTH - 50, ex)),
// line 2943
    y: Math.max(50, Math.min(ARENA_HEIGHT - 50, ey)),
// line 2944
    vx: 0,
// line 2945
    vy: 0,
// line 2946
    type: typeKey,
// line 2947
    info: t,
// line 2948
    hp: t.hp * (1 + (playerLevel - 1) * 0.10 + currentSectorIndex * 0.22),
// line 2949
    maxHp: t.hp * (1 + (playerLevel - 1) * 0.10 + currentSectorIndex * 0.22),
// line 2950
    isBoss: !!isBoss,
// line 2951
    quoteTimer: Math.random() * 5 + 3,
// line 2952
    actionTimer: 0,
// line 2953
    hitFlash: 0,
// line 2954
    slowTimer: 0,
// line 2955
    dead: false
// line 2956
  };
// line 2957

// line 2958
  enemies.push(enemy);
// line 2959

// line 2960
  if (isBoss) {
// line 2961
    activeBoss = enemy;
// line 2962
    showBossTopBar(t.name);
// line 2963
    sounds.bossAlert();
// line 2964
    screenShake = 12;
// line 2965
    addSpeechBubble(enemy.x, enemy.y - 45, '🚨 ' + t.name.toUpperCase(), '#ef4444');
// line 2966
    showAnnouncement('🚨 ALARM: ' + t.name.toUpperCase(), '#ef4444');
// line 2967
  }
// line 2968
}
// line 2969

// line 2970
function spawnEnemy(typeKey, isBoss = false) {
// line 2971
  const viewRadius = (Math.max(gameWidth, gameHeight) / (2 * camera.zoom));
// line 2972
  const angle = Math.random() * Math.PI * 2;
// line 2973
  const dist = viewRadius + 120 + Math.random() * 90;
// line 2974
  const ex = player.x + Math.cos(angle) * dist;
// line 2975
  const ey = player.y + Math.sin(angle) * dist;
// line 2976
  spawnEnemyAt(typeKey, ex, ey, isBoss);
// line 2977
}
// line 2978

// line 2979
// Tuned enemy wave spawner with clear flank groups and density limits (Vampire Survivors style)
// line 2980
function spawnBatchByTime(currentMinutes) {
// line 2981
  if (enemies.length >= MAX_ENEMIES_CAP) return;
// line 2982

// line 2983
  const sec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[0];
// line 2984
  const pool = sec.spawnPool;
// line 2985
  if (!pool || pool.length === 0) return;
// line 2986

// line 2987
  // Scale batch size smoothly from 2-3 early up to 5-6 later in the sector
// line 2988
  const progressInSector = Math.min(1.0, (gameTime % 120) / 120);
// line 2989
  const baseBatchSize = Math.floor(4 + progressInSector * 10.0 + Math.random() * 5.0);
// line 2990
  const batchCount = Math.min(baseBatchSize, MAX_ENEMIES_CAP - enemies.length);
// line 2991

// line 2992
  // Group spawning from a cohesive flank for readable silhouettes
// line 2993
  const baseAngle = Math.random() * Math.PI * 2;
// line 2994
  const pickedType = pool[Math.floor(Math.random() * pool.length)];
// line 2995
  const viewRadius = (Math.max(gameWidth, gameHeight) / (2 * camera.zoom));
// line 2996

// line 2997
  for (let i = 0; i < batchCount; i++) {
// line 2998
    const angleSpread = (i - batchCount / 2) * 0.22;
// line 2999
    const spawnAngle = baseAngle + angleSpread;
// line 3000
    const dist = viewRadius + 110 + (Math.random() * 70);
// line 3001
    const ex = player.x + Math.cos(spawnAngle) * dist;
// line 3002
    const ey = player.y + Math.sin(spawnAngle) * dist;
// line 3003

// line 3004
    const typeKey = (i > 0 && Math.random() < 0.25) ? pool[Math.floor(Math.random() * pool.length)] : pickedType;
// line 3005
    spawnEnemyAt(typeKey, ex, ey);
// line 3006
  }
// line 3007
}
// line 3008

// line 3009
function showBossTopBar(name) {
// line 3010
  const container = document.getElementById('boss-hp-container');
// line 3011
  document.getElementById('boss-name').innerText = '🚨 BOSS: ' + name;
// line 3012
  document.getElementById('boss-hp-fill').style.width = '100%';
// line 3013
  container.style.display = 'flex';
// line 3014
}
// line 3015
function updateBossTopBar() {
// line 3016
  if (activeBoss && !activeBoss.dead) {
// line 3017
    const pct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
// line 3018
    document.getElementById('boss-hp-fill').style.width = pct + '%';
// line 3019
  } else {
// line 3020
    document.getElementById('boss-hp-container').style.display = 'none';
// line 3021
    activeBoss = null;
// line 3022
  }
// line 3023
}
// line 3024

// line 3025
// --- LEVEL UP & EVOLUTION POOL ---
// line 3026
function checkLevelUp() {
// line 3027
  if (currentXP >= neededXP) {
// line 3028
    currentXP -= neededXP;
// line 3029
    playerLevel++;
// line 3030
    neededXP = Math.floor(neededXP * 1.15 + 3);
// line 3031
    sounds.levelUp();
// line 3032
    triggerLevelUpModal();
// line 3033
  }
// line 3034
}
// line 3035

// line 3036

// line 3037

// line 3038
window.onCardSelectedInCompose = function(cardId) {
// line 3039
  console.log('Card selected in Compose:', cardId);
// line 3040
  if (typeof sounds !== 'undefined' && sounds.xp) sounds.xp();
// line 3041
  
// line 3042
  // ⚔️ ACTIVE WEAPONS
// line 3043
  if (cardId === 'scanner_active' && weapons.scanner) {
// line 3044
    weapons.scanner.level++;
// line 3045
    weapons.scanner.damage += 15;
// line 3046
  } else if (cardId === 'toilet_paper_active' && weapons.toiletPaper) {
// line 3047
    weapons.toiletPaper.level++;
// line 3048
    weapons.toiletPaper.count += 2;
// line 3049
  } else if (cardId === 'stretch_aura_active' && weapons.folia) {
// line 3050
    weapons.folia.level++;
// line 3051
    weapons.folia.count++;
// line 3052
  } else if (cardId === 'pallet_truck_active' && weapons.pallets) {
// line 3053
    weapons.pallets.level++;
// line 3054
    weapons.pallets.damage += 30;
// line 3055
  } else if (cardId === 'extinguisher_active' && weapons.extinguisher) {
// line 3056
    weapons.extinguisher.level++;
// line 3057
    weapons.extinguisher.damage += 18;
// line 3058
  } else if (cardId === 'zip_ties_active' && weapons.trytytki) {
// line 3059
    weapons.trytytki.level++;
// line 3060
    weapons.trytytki.count++;
// line 3061
  } else if (cardId === 'cutter_active' && weapons.noz) {
// line 3062
    weapons.noz.level++;
// line 3063
    weapons.noz.pierce++;
// line 3064
    weapons.noz.damage += 15;
// line 3065
  } else if (cardId === 'stapler_active' && weapons.zszywacz) {
// line 3066
    weapons.zszywacz.level++;
// line 3067
    weapons.zszywacz.count += 2;
// line 3068
  } else if (cardId === 'sledgehammer_active' && weapons.mlot) {
// line 3069
    weapons.mlot.level++;
// line 3070
    weapons.mlot.damage += 40;
// line 3071
  } else if (cardId === 'faktura_active' && weapons.faktura) {
// line 3072
    weapons.faktura.level++;
// line 3073
    weapons.faktura.count++;
// line 3074
  } else if (cardId === 'kawa_active' && weapons.kawa) {
// line 3075
    weapons.kawa.level++;
// line 3076
    weapons.kawa.radius += 30;
// line 3077
  } else if (cardId === 'hydrant_active' && weapons.hydrant) {
// line 3078
    weapons.hydrant.level++;
// line 3079
    weapons.hydrant.damage += 40;
// line 3080
  } else if (cardId === 'megafon_active' && weapons.megafon) {
// line 3081
    weapons.megafon.level++;
// line 3082
    weapons.megafon.damage += 25;
// line 3083
  }
// line 3084
  
// line 3085
  // 🛡️ PASSIVE BUFFS
// line 3086
  else if (cardId === 'iso_cert_passive' && passives.magnet) {
// line 3087
    passives.magnet.level++;
// line 3088
    player.magnetRange += 75;
// line 3089
  } else if (cardId === 'safety_bhp_passive' && passives.protokol_bhp) {
// line 3090
    passives.protokol_bhp.level++;
// line 3091
    player.ramDamageMult = (player.ramDamageMult || 1.0) + 0.4;
// line 3092
  } else if (cardId === 'synthetic_oil_passive' && passives.smar_syntetyczny) {
// line 3093
    passives.smar_syntetyczny.level++;
// line 3094
    player.speed += 25;
// line 3095
  } else if (cardId === 'super_battery_passive' && passives.battery) {
// line 3096
    passives.battery.level++;
// line 3097
    player.maxBattery += 35;
// line 3098
    player.battery = Math.min(player.maxBattery, player.battery + 40);
// line 3099
  } else if (cardId === 'furia_passive' && passives.furia) {
// line 3100
    passives.furia.level++;
// line 3101
    player.attackSpeedMult = (player.attackSpeedMult || 1.0) * 1.25;
// line 3102
  } else if (cardId === 'alkomat_passive' && passives.unik_alkomat) {
// line 3103
    passives.unik_alkomat.level++;
// line 3104
    player.dodgeChance = (player.dodgeChance || 0) + 0.15;
// line 3105
  } else if (cardId === 'stoperan_passive' && passives.stoperan) {
// line 3106
    passives.stoperan.level++;
// line 3107
    player.maxBattery += 30;
// line 3108
    player.battery = Math.min(player.maxBattery, player.battery + 30);
// line 3109
  } else if (cardId === 'safety_shoes_passive' && passives.buty_robocze) {
// line 3110
    passives.buty_robocze.level++;
// line 3111
    player.thorns = (player.thorns || 0) + 25;
// line 3112
  } else if (cardId === 'multisport_passive' && passives.karta_multisport) {
// line 3113
    passives.karta_multisport.level++;
// line 3114
    player.speed += 15;
// line 3115
  } else if (cardId === 'paczek_passive' && passives.paczek) {
// line 3116
    passives.paczek.level++;
// line 3117
    player.critChance = (player.critChance || 0) + 0.20;
// line 3118
  } else if (cardId === 'kamizelka_passive' && passives.kamizelka) {
// line 3119
    passives.kamizelka.level++;
// line 3120
    player.damageReduction = (player.damageReduction || 0) + 0.25;
// line 3121
  } else if (cardId === 'umowa_passive' && passives.umowa) {
// line 3122
    passives.umowa.level++;
// line 3123
    player.extraLives = (player.extraLives || 0) + 1;
// line 3124
  }
// line 3125

// line 3126
  // ⚡ GOLDEN EVOLUTIONS
// line 3127
  else if (cardId === 'bramka_rfid_evo' && weapons.scanner) {
// line 3128
    weapons.scanner.evolved = true;
// line 3129
    weapons.scanner.damage = 100;
// line 3130
  } else if (cardId === 'owijarka_evo' && weapons.toiletPaper) {
// line 3131
    weapons.toiletPaper.evolved = true;
// line 3132
    weapons.toiletPaper.damage = 60;
// line 3133
  } else if (cardId === 'bt_highstack_evo' && weapons.pallets) {
// line 3134
    weapons.pallets.evolved = true;
// line 3135
    weapons.pallets.damage = 90;
// line 3136
  } else if (cardId === 'zraszacz_evo' && weapons.extinguisher) {
// line 3137
    weapons.extinguisher.evolved = true;
// line 3138
    weapons.extinguisher.damage = 150;
// line 3139
  } else if (cardId === 'steel_ties_evo' && weapons.trytytki) {
// line 3140
    weapons.trytytki.evolved = true;
// line 3141
    weapons.trytytki.damage = 60;
// line 3142
  } else if (cardId === 'machete_evo' && weapons.noz) {
// line 3143
    weapons.noz.evolved = true;
// line 3144
    weapons.noz.damage = 45;
// line 3145
  } else if (cardId === 'stapler_gun_evo' && weapons.zszywacz) {
// line 3146
    weapons.zszywacz.evolved = true;
// line 3147
    weapons.zszywacz.damage = 70;
// line 3148
  } else if (cardId === 'hydraulic_hammer_evo' && weapons.mlot) {
// line 3149
    weapons.mlot.evolved = true;
// line 3150
    weapons.mlot.damage = 180;
// line 3151
  } else if (cardId === 'urzad_skarbowy_evo' && weapons.faktura) {
// line 3152
    weapons.faktura.evolved = true;
// line 3153
    weapons.faktura.damage = 120;
// line 3154
  } else if (cardId === 'redbull_evo' && weapons.kawa) {
// line 3155
    weapons.kawa.evolved = true;
// line 3156
    weapons.kawa.damage = 60;
// line 3157
  }
// line 3158

// line 3159
  // ⚠️ DEBUFF & RISK/REWARD CARDS
// line 3160
  else if (cardId === 'overtime_debuff') {
// line 3161
    player.damageMult = (player.damageMult || 1.0) * 1.45;
// line 3162
    player.speed = Math.max(120, player.speed * 0.82);
// line 3163
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ NADGODZINY: +45% DMG / -18% SPEED', '#ef4444');
// line 3164
  } else if (cardId === 'kas_audit_debuff') {
// line 3165
    player.xpBonusMult = (player.xpBonusMult || 1.0) * 1.6;
// line 3166
    player.maxBattery = Math.max(50, player.maxBattery - 20);
// line 3167
    player.battery = Math.min(player.maxBattery, player.battery);
// line 3168
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ KONTROLA KAS: +60% XP / -20 BATTERY', '#f59e0b');
// line 3169
  } else if (cardId === 'leaking_hydraulics_debuff') {
// line 3170
    if (weapons.kawa) weapons.kawa.radius += 50;
// line 3171
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '⚠️ WYCIEK OLEJU: +40% AREA EFEKT', '#eab308');
// line 3172
  } else if (cardId === 'ramp_breakdown_debuff') {
// line 3173
    player.knockbackMult = (player.knockbackMult || 1.0) * 1.5;
// line 3174
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🚧 ZABLOKOWANA RAMPA: +50% KNOCKBACK', '#f59e0b');
// line 3175
  }
// line 3176
  
// line 3177
  
// line 3178
  // ⚡ GAME-CHANGER PERKS
// line 3179
  else if (cardId === 'perk_no_brakes') {
// line 3180
    player.noBrakes = true;
// line 3181
    player.speed += 120;
// line 3182
    player.ramDamageMult = (player.ramDamageMult || 1.0) * 4.0;
// line 3183
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🏎️ BRAK HAMULCÓW: +400% TARAN!', '#ef4444');
// line 3184
  } else if (cardId === 'perk_drunken_udt') {
// line 3185
    player.drunkenUdt = true;
// line 3186
    player.critChance = (player.critChance || 0) + 0.25;
// line 3187
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '🍺 PIJANY MISTRZ UDT: EKSPLOZJE!', '#f59e0b');
// line 3188
  } else if (cardId === 'perk_radioactive_adr') {
// line 3189
    player.radioactiveAdr = true;
// line 3190
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '☣️ RADIOAKTYWNE ADR: PŁONĄCE PLAMY!', '#84cc16');
// line 3191
  } else if (cardId === 'perk_pip_bribe') {
// line 3192
    player.pipBribe = true;
// line 3193
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '💼 ŁAPÓWKA DLA PIP: BEZPIECZEŃSTWO!', '#38bdf8');
// line 3194
  } else if (cardId === 'perk_kamikaze_intern') {
// line 3195
    player.kamikazeIntern = true;
// line 3196
    if (typeof addSpeechBubble === 'function') addSpeechBubble(player.x, player.y - 30, '💣 SAMOBÓJCZY PRAKTYKANT DOŁĄCZA!', '#ec4899');
// line 3197
  }
// line 3198

// line 3199
  closeLevelUp();
// line 3200
};
// line 3201

// line 3202

// line 3203
function triggerLevelUpModal(isReroll = false) {
// line 3204
  if (window.AndroidBridge && window.AndroidBridge.triggerComposeLevelUp) {
// line 3205
    window.AndroidBridge.triggerComposeLevelUp(player.level);
// line 3206
  }
// line 3207
  gameState = STATE.LEVELUP;
// line 3208
  const container = document.getElementById('upgrade-container');
// line 3209
  container.innerHTML = '';
// line 3210

// line 3211
  if (typeof player.rerolls === 'undefined') {
// line 3212
    player.rerolls = selectedCharKey === 'klaus' ? 4 : 2;
// line 3213
  }
// line 3214

// line 3215
  const rerollBtn = document.getElementById('btn-reroll-cards');
// line 3216
  const rerollCountEl = document.getElementById('reroll-count');
// line 3217
  if (rerollCountEl) rerollCountEl.innerText = player.rerolls;
// line 3218
  if (rerollBtn) {
// line 3219
    if (player.rerolls > 0) {
// line 3220
      rerollBtn.disabled = false;
// line 3221
      rerollBtn.innerHTML = `🔄 PRZELOSUJ (${player.rerolls})`;
// line 3222
    } else {
// line 3223
      rerollBtn.disabled = true;
// line 3224
      rerollBtn.innerHTML = `🔄 BRAK REROLLI`;
// line 3225
    }
// line 3226
  }
// line 3227

// line 3228
  const options = [];
// line 3229

// line 3230
  // 1. Check possible Weapon Evolutions
// line 3231
  Object.keys(EVOLUTIONS).forEach(evoKey => {
// line 3232
    const evo = EVOLUTIONS[evoKey];
// line 3233
    const w = weapons[evo.reqWeapon];
// line 3234
    const p = passives[evo.reqPassive];
// line 3235
    if (w && w.level >= 5 && p && p.level >= 1 && !w.isEvo) {
// line 3236
      options.push({ type: 'evolution', evo: evo });
// line 3237
    }
// line 3238
  });
// line 3239

// line 3240
  // Count active weapons and passives
// line 3241
  let activeWeaponsCount = 0;
// line 3242
  Object.keys(weapons).forEach(k => { if (weapons[k].level > 0) activeWeaponsCount++; });
// line 3243
  let activePassivesCount = 0;
// line 3244
  Object.keys(passives).forEach(k => { if (passives[k].level > 0) activePassivesCount++; });
// line 3245

// line 3246
  // 2. Build list of regular weapon & passive upgrades
// line 3247
  const regularCards = [];
// line 3248

// line 3249
  const weaponDataList = [
// line 3250
    { id: 'scanner', name: 'Skaner Kodów Kreskowych', icon: '🔦', desc: 'Promień laserowy w najbliższego wroga.', stat: '+12 Obrażeń | Promień laserowy' },
// line 3251
    { id: 'toiletPaper', name: 'Pistolet na Taśmę "Pakowa"', icon: '🧻', desc: 'Wystrzeliwuje lepkie taśmy niszczące wrogów.', stat: '+2 Pociski taśmowe | +12 Obrażeń' },
// line 3252
    { id: 'stretchAura', name: 'Aura z Folii Stretch', icon: '🌀', desc: 'Wirujące rolki folii tnące wrogów.', stat: '+1 Rolka folii | Wzmocniony promień tnący' },
// line 3253
    { id: 'pallets', name: 'Ręczny Paleciak', icon: '🪵', desc: 'Taran odpychający wrogów przed graczem.', stat: '+15 Obrażeń taranowania | Odpychanie' },
// line 3254
    { id: 'extinguisher', name: 'Gaśnica Proszkowa PPOŻ', icon: '🧯', desc: 'Stożek zamrażający/spowalniający.', stat: 'Większy stożek zamrażający | -10% Cooldown' },
// line 3255
    { id: 'zipTies', name: 'Trytytki Samozaciskowe', icon: '🔗', desc: 'Wystrzeliwuje taśmy blokujące wrogów.', stat: '+1 Taśma blokująca | Dłuższe spowolnienie' },
// line 3256
    { id: 'cutter', name: 'Nóż do Tapet (Gilotyna)', icon: '🔪', desc: 'Przecina wrogów na pół, przenikając ich.', stat: '+1 Przebicie wrogów | +12 Obrażeń' },
// line 3257
    { id: 'stapler', name: 'Zszywacz Pneumatyczny', icon: '📌', desc: 'Szybka seria stalowych zszywek magazynowych.', stat: '+2 Stalowe zszywki | Szybszy wystrzał' },
// line 3258
    { id: 'sledgehammer', name: 'Młot Konserwatora BHP', icon: '🔨', desc: 'Uderzenie o posadzkę niszczące wrogów 360°.', stat: '+20 Obrażeń obszarowych | Fala uderzeniowa' },
// line 3259
    { id: 'faktura', name: 'Faktura Korygująca', icon: '📄', desc: 'Latające papiery tnące wrogów.', stat: '+1 Faktura | Większa prędkość rotacji' },
// line 3260
    { id: 'kawa', name: 'Toksyczna Kawa z Automatu', icon: '☕', desc: 'Rozlewa wrzący kwas (kawę) dookoła.', stat: 'Większa plama kaustyczna | +10 Obrażeń' },
// line 3261
    { id: 'hydrant', name: 'Hydrant Magazynowy PPOŻ', icon: '🚰', desc: 'Wstrzeliwuje silne strumienie wody odpychające wrogów.', stat: '+1 Strumień wody | Silniejsze odepchnięcie' },
// line 3262
    { id: 'megafon', name: 'Megafon Kierownika Hali', icon: '📢', desc: 'Fala dźwiękowa "DO ROBOTY!" ogłuszająca wrogów.', stat: '+15% Zasięgu ogłuszenia | Szybsza syrena' }
// line 3263
  ];
// line 3264

// line 3265
  weaponDataList.forEach(w => {
// line 3266
    const obj = weapons[w.id];
// line 3267
    if (obj && obj.level < 5 && !obj.isEvo) {
// line 3268
      if (obj.level > 0 || activeWeaponsCount < 6) {
// line 3269
        regularCards.push({ cat: 'weapon', ...w });
// line 3270
      }
// line 3271
    }
// line 3272
  });
// line 3273

// line 3274
  Object.keys(passives).forEach(k => {
// line 3275
    const p = passives[k];
// line 3276
    const maxLvl = p.max || 3;
// line 3277
    if (p.level < maxLvl) {
// line 3278
      if (p.level > 0 || activePassivesCount < 6) {
// line 3279
        regularCards.push({
// line 3280
          cat: 'passive',
// line 3281
          id: k,
// line 3282
          name: p.name,
// line 3283
          icon: p.icon,
// line 3284
          desc: p.desc,
// line 3285
          stat: `Wzmocnienie Poziomu ${p.level + 1} z ${maxLvl}`
// line 3286
        });
// line 3287
      }
// line 3288
    }
// line 3289
  });
// line 3290

// line 3291
  regularCards.sort(() => 0.5 - Math.random());
// line 3292

// line 3293
  const maxChoices = selectedCharKey === 'klaus' ? 4 : 3;
// line 3294

// line 3295
  regularCards.forEach(c => {
// line 3296
    if (options.length < maxChoices) options.push(c);
// line 3297
  });
// line 3298

// line 3299
  if (options.length === 0) {
// line 3300
    options.push({
// line 3301
      type: 'bonus',
// line 3302
      id: 'bateria_naprawa',
// line 3303
      name: '⚡ Bateria Ogniwo Litowe',
// line 3304
      icon: '🔋',
// line 3305
      desc: 'Pełna regeneracja baterii wózka oraz premia +150 DTA.',
// line 3306
      stat: '+100% Baterii | +150 Monet DTA'
// line 3307
    });
// line 3308
    options.push({
// line 3309
      type: 'bonus',
// line 3310
      id: 'kawa_premia',
// line 3311
      name: '☕ Podwójne Espresso z Automatu',
// line 3312
      icon: '☕',
// line 3313
      desc: 'Natychmiastowy reset umiejętności specjalnej i +500 pkt.',
// line 3314
      stat: 'Reset Skill CD | +500 Pkt'
// line 3315
    });
// line 3316
  }
// line 3317

// line 3318
  options.slice(0, maxChoices).forEach((opt, idx) => {
// line 3319
    const card = document.createElement('div');
// line 3320
    card.style.animationDelay = (idx * 0.08) + 's';
// line 3321

// line 3322
    if (opt.type === 'evolution') {
// line 3323
      card.className = 'upgrade-card is-evolution';
// line 3324
      card.innerHTML = `
// line 3325
        <div class="card-icon-wrapper" style="border-color: #f59e0b;">
// line 3326
          <div class="card-icon">${opt.evo.icon}</div>
// line 3327
        </div>
// line 3328
        <div class="card-info">
// line 3329
          <div class="card-header-line">
// line 3330
            <span class="card-badge badge-evo">⚡ SUPREME EWOLUCJA</span>
// line 3331
            <span class="card-level-tag" style="color:#fde047;">★ EWOLUCJA</span>
// line 3332
          </div>
// line 3333
          <div class="card-title">${opt.evo.name}</div>
// line 3334
          <div class="card-desc">${opt.evo.desc}</div>
// line 3335
        </div>
// line 3336
      `;
// line 3337
      card.onclick = () => { applyEvolution(opt.evo); closeLevelUp(); };
// line 3338
    } else if (opt.type === 'bonus') {
// line 3339
      card.className = 'upgrade-card is-bonus';
// line 3340
      card.innerHTML = `
// line 3341
        <div class="card-icon-wrapper" style="border-color: #ef4444;">
// line 3342
          <div class="card-icon">${opt.icon}</div>
// line 3343
        </div>
// line 3344
        <div class="card-info">
// line 3345
          <div class="card-header-line">
// line 3346
            <span class="card-badge badge-bonus">🎁 BONUS ZMIANY</span>
// line 3347
            <span class="card-level-tag">REGENERACJA</span>
// line 3348
          </div>
// line 3349
          <div class="card-title">${opt.name}</div>
// line 3350
          <div class="card-desc">${opt.desc}</div>
// line 3351
          <div class="card-stat-boost" style="color:#fca5a5;">${opt.stat}</div>
// line 3352
        </div>
// line 3353
      `;
// line 3354
      card.onclick = () => { applyBonusUpgrade(opt); closeLevelUp(); };
// line 3355
    } else {
// line 3356
      const isWeapon = opt.cat === 'weapon';
// line 3357
      card.className = 'upgrade-card ' + (isWeapon ? 'is-weapon' : 'is-passive');
// line 3358
      let lvl = isWeapon ? weapons[opt.id].level : passives[opt.id].level;
// line 3359
      let maxLvl = isWeapon ? 5 : (passives[opt.id] ? passives[opt.id].max || 3 : 3);
// line 3360
      
// line 3361
      let stars = '';
// line 3362
      for (let s = 1; s <= maxLvl; s++) {
// line 3363
        stars += (s <= lvl + 1) ? '★' : '☆';
// line 3364
      }
// line 3365

// line 3366
      let badgeClass = isWeapon ? 'badge-weapon' : 'badge-passive';
// line 3367
      let badgeLabel = isWeapon ? '⚔️ BROŃ MAGNA' : '🛡️ PERK BHP';
// line 3368
      let levelLabel = lvl === 0 ? 'NOWOŚĆ!' : `POZ. ${lvl} → ${lvl + 1}`;
// line 3369

// line 3370
      card.innerHTML = `
// line 3371
        <div class="card-icon-wrapper" style="border-color: ${isWeapon ? '#38bdf8' : '#22c55e'};">
// line 3372
          <div class="card-icon">${opt.icon}</div>
// line 3373
        </div>
// line 3374
        <div class="card-info">
// line 3375
          <div class="card-header-line">
// line 3376
            <span class="card-badge ${badgeClass}">${badgeLabel}</span>
// line 3377
            <span class="card-stars">${stars}</span>
// line 3378
            <span class="card-level-tag">${levelLabel}</span>
// line 3379
          </div>
// line 3380
          <div class="card-title">${opt.name}</div>
// line 3381
          <div class="card-desc">${opt.desc}</div>
// line 3382
          ${opt.stat ? `<div class="card-stat-boost" style="color: ${isWeapon ? '#38bdf8' : '#4ade80'};">${opt.stat}</div>` : ''}
// line 3383
        </div>
// line 3384
      `;
// line 3385
      card.onclick = () => { applyUpgrade(opt); closeLevelUp(); };
// line 3386
    }
// line 3387

// line 3388
    container.appendChild(card);
// line 3389
  });
// line 3390

// line 3391
  document.getElementById('levelup-screen').style.display = 'flex';
// line 3392
}
// line 3393

// line 3394
function rerollLevelUpCards() {
// line 3395
  if (player.rerolls > 0) {
// line 3396
    player.rerolls--;
// line 3397
    sounds.beep();
// line 3398
    triggerLevelUpModal(true);
// line 3399
  }
// line 3400
}
// line 3401

// line 3402
function skipLevelUpCard() {
// line 3403
  sounds.achieve();
// line 3404
  dtaCoins += 50;
// line 3405
  saveWorkshopData();
// line 3406
  player.battery = Math.min(player.maxBattery, player.battery + 20);
// line 3407
  addSpeechBubble(player.x, player.y - 30, '+50💰 BONUS ZA BRAK ULEPSZENIA!', '#facc15');
// line 3408
  closeLevelUp();
// line 3409
}
// line 3410

// line 3411
function applyBonusUpgrade(opt) {
// line 3412
  sounds.achieve();
// line 3413
  if (opt.id === 'bateria_naprawa') {
// line 3414
    player.battery = player.maxBattery;
// line 3415
    dtaCoins += 150;
// line 3416
    saveWorkshopData();
// line 3417
    addSpeechBubble(player.x, player.y - 30, '⚡ PEŁNA BATERIA +150 DTA!', '#facc15');
// line 3418
  } else if (opt.id === 'kawa_premia') {
// line 3419
    player.skillCooldown = 0;
// line 3420
    score += 500;
// line 3421
    addSpeechBubble(player.x, player.y - 30, '☕ RESET SKILL +500 PKT!', '#38bdf8');
// line 3422
  }
// line 3423
}
// line 3424

// line 3425
function closeLevelUp() {
// line 3426
  document.getElementById('levelup-screen').style.display = 'none';
// line 3427
  gameState = STATE.PLAYING;
// line 3428
  updateWeaponsHud();
// line 3429
}
// line 3430

// line 3431
function applyEvolution(evo) {
// line 3432
  sounds.evoSound();
// line 3433
  screenShake = 12;
// line 3434
  createSparks(player.x, player.y, 40, '#f59e0b');
// line 3435
  triggerAchievement('weapon_evolution', 'Ewolucja Magazynowa', '💥');
// line 3436
  if (evo.id === 'bramkaRFID') {
// line 3437
    weapons.scanner.isEvo = true;
// line 3438
    weapons.scanner.damage = 100;
// line 3439
  } else if (evo.id === 'owijarka') {
// line 3440
    weapons.toiletPaper.isEvo = true;
// line 3441
    weapons.toiletPaper.damage = 60;
// line 3442
  } else if (evo.id === 'btHighStack') {
// line 3443
    weapons.pallets.isEvo = true;
// line 3444
    weapons.pallets.damage = 90;
// line 3445
    weapons.pallets.cooldown = 0.5;
// line 3446
  } else if (evo.id === 'zraszacz') {
// line 3447
    weapons.extinguisher.isEvo = true;
// line 3448
    weapons.extinguisher.damage = 150;
// line 3449
    weapons.extinguisher.timer = 0;
// line 3450
    weapons.extinguisher.cooldown = 10.0;
// line 3451
  } else if (evo.id === 'steelTies') {
// line 3452
    weapons.zipTies.isEvo = true;
// line 3453
    weapons.zipTies.damage = 60;
// line 3454
    weapons.zipTies.cooldown = 0.8;
// line 3455
  } else if (evo.id === 'machete') {
// line 3456
    weapons.cutter.isEvo = true;
// line 3457
    weapons.cutter.damage = 45;
// line 3458
    weapons.cutter.cooldown = 0.35;
// line 3459
  } else if (evo.id === 'staplerGun') {
// line 3460
    weapons.stapler.isEvo = true;
// line 3461
    weapons.stapler.damage = 70;
// line 3462
    weapons.stapler.cooldown = 0.45;
// line 3463
    weapons.stapler.count = 6;
// line 3464
  } else if (evo.id === 'hydraulicHammer') {
// line 3465
    weapons.sledgehammer.isEvo = true;
// line 3466
    weapons.sledgehammer.damage = 180;
// line 3467
    weapons.sledgehammer.cooldown = 1.6;
// line 3468
    weapons.sledgehammer.radius = 240;
// line 3469
  } else if (evo.id === 'urzadSkarbowy') {
// line 3470
    weapons.faktura.isEvo = true;
// line 3471
    weapons.faktura.damage = 120;
// line 3472
    weapons.faktura.cooldown = 1.2;
// line 3473
    weapons.faktura.speed = 600;
// line 3474
  } else if (evo.id === 'redbull') {
// line 3475
    weapons.kawa.isEvo = true;
// line 3476
    weapons.kawa.damage = 60;
// line 3477
    weapons.kawa.cooldown = 1.5;
// line 3478
    player.speed += 30;
// line 3479
  }
// line 3480
}
// line 3481

// line 3482
function applyUpgrade(opt) {
// line 3483
  sounds.xp();
// line 3484
  createSparks(player.x, player.y, 25, opt.cat === 'weapon' ? '#38bdf8' : '#4ade80');
// line 3485
  if (opt.cat === 'weapon') {
// line 3486
    const w = weapons[opt.id];
// line 3487
    w.level++;
// line 3488
    w.damage += 12;
// line 3489
    w.cooldown = Math.max(0.3, w.cooldown * 0.9);
// line 3490
    if (opt.id === 'toiletPaper') w.count = Math.min(6, 2 + Math.floor(w.level / 2));
// line 3491
    if (opt.id === 'stapler') w.count = Math.min(8, 3 + Math.floor(w.level));
// line 3492
  } else if (opt.cat === 'passive') {
// line 3493
    const p = passives[opt.id];
// line 3494
    p.level++;
// line 3495
    if (opt.id === 'magnet') player.magnetRange += 75;
// line 3496
    if (opt.id === 'forks') player.critChance += 0.12;
// line 3497
    if (opt.id === 'coffee') { player.speed += 18; player.maxSkillCooldown = Math.max(3.5, player.maxSkillCooldown - 1.0); }
// line 3498
    if (opt.id === 'battery') { player.maxBattery += 35; player.battery = Math.min(player.maxBattery, player.battery + 40); }
// line 3499
    if (opt.id === 'furia') player.attackSpeedMult = (player.attackSpeedMult || 1.0) + 0.25;
// line 3500
    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;
// line 3501
    if (opt.id === 'stoperan') { player.maxBattery += 30; player.battery += 30; }
// line 3502
    if (opt.id === 'buty_robocze') player.thorns = (player.thorns || 0) + 20;
// line 3503
    if (opt.id === 'karta_multisport') { player.staminaRegenMult = (player.staminaRegenMult || 1) + 0.3; player.speed += 10; }
// line 3504
    if (opt.id === 'paczek') { player.critChance += 0.20; player.foodDropBoost = (player.foodDropBoost || 0) + 0.25; }
// line 3505
    if (opt.id === 'kamizelka') { player.damageReduction = (player.damageReduction || 0) + 0.25; }
// line 3506
    if (opt.id === 'umowa') { player.xpBonusMult = (player.xpBonusMult || 1.0) + 0.25; }
// line 3507
  }
// line 3508
}
// line 3509

// line 3510
function updateWeaponsHud() {
// line 3511
  const container = document.getElementById('weapons-hud');
// line 3512
  container.innerHTML = '';
// line 3513
  Object.keys(weapons).forEach(k => {
// line 3514
    const w = weapons[k];
// line 3515
    if (w.level > 0) {
// line 3516
      const slot = document.createElement('div');
// line 3517
      slot.className = 'weapon-hud-slot' + (w.isEvo ? ' evo' : '');
// line 3518
      slot.innerText = w.isEvo ? '⚡' : w.icon;
// line 3519
      container.appendChild(slot);
// line 3520
    }
// line 3521
  });
// line 3522
}
// line 3523

// line 3524
// --- WEAPONS FIRING SYSTEM ---
// line 3525
function updateWeapons(dt) {
// line 3526
  const effectiveDt = dt * (player.attackSpeedMult || 1.0);
// line 3527
  if (weapons.scanner.level > 0) {
// line 3528
    weapons.scanner.timer += effectiveDt;
// line 3529
    if (weapons.scanner.timer >= weapons.scanner.cooldown) {
// line 3530
      weapons.scanner.timer = 0;
// line 3531
      fireScanner();
// line 3532
    }
// line 3533
  }
// line 3534
  if (weapons.toiletPaper.level > 0) {
// line 3535
    weapons.toiletPaper.timer += effectiveDt;
// line 3536
    if (weapons.toiletPaper.timer >= weapons.toiletPaper.cooldown) {
// line 3537
      weapons.toiletPaper.timer = 0;
// line 3538
      fireToiletPaper();
// line 3539
    }
// line 3540
  }
// line 3541
  if (weapons.stretchAura.level > 0) {
// line 3542
    weapons.stretchAura.angle += effectiveDt * (weapons.stretchAura.isEvo ? 5.5 : 3.8);
// line 3543
    checkStretchAuraHit(dt);
// line 3544
  }
// line 3545
  if (weapons.pallets.level > 0) {
// line 3546
    weapons.pallets.timer += effectiveDt;
// line 3547
    if (weapons.pallets.timer >= weapons.pallets.cooldown) {
// line 3548
      weapons.pallets.timer = 0;
// line 3549
      firePallet();
// line 3550
    }
// line 3551
  }
// line 3552
  if (weapons.extinguisher.level > 0) {
// line 3553
    weapons.extinguisher.timer += effectiveDt;
// line 3554
    if (weapons.extinguisher.timer >= weapons.extinguisher.cooldown) {
// line 3555
      weapons.extinguisher.timer = 0;
// line 3556
      fireExtinguisher();
// line 3557
    }
// line 3558
  }
// line 3559
  if (weapons.zipTies.level > 0) {
// line 3560
    weapons.zipTies.timer += effectiveDt;
// line 3561
    if (weapons.zipTies.timer >= weapons.zipTies.cooldown) {
// line 3562
      weapons.zipTies.timer = 0;
// line 3563
      fireZipTies();
// line 3564
    }
// line 3565
  }
// line 3566
  if (weapons.cutter.level > 0) {
// line 3567
    weapons.cutter.timer += effectiveDt;
// line 3568
    if (weapons.cutter.timer >= weapons.cutter.cooldown) {
// line 3569
      weapons.cutter.timer = 0;
// line 3570
      fireCutter();
// line 3571
    }
// line 3572
  }
// line 3573
  if (weapons.stapler.level > 0) {
// line 3574
    weapons.stapler.timer += effectiveDt;
// line 3575
    if (weapons.stapler.timer >= weapons.stapler.cooldown) {
// line 3576
      weapons.stapler.timer = 0;
// line 3577
      fireStapler();
// line 3578
    }
// line 3579
  }
// line 3580
  if (weapons.sledgehammer.level > 0) {
// line 3581
    weapons.sledgehammer.timer += effectiveDt;
// line 3582
    if (weapons.sledgehammer.timer >= weapons.sledgehammer.cooldown) {
// line 3583
      weapons.sledgehammer.timer = 0;
// line 3584
      fireSledgehammer();
// line 3585
    }
// line 3586
  }
// line 3587
  if (weapons.faktura.level > 0) {
// line 3588
    weapons.faktura.timer += effectiveDt;
// line 3589
    if (weapons.faktura.timer >= weapons.faktura.cooldown) {
// line 3590
      weapons.faktura.timer = 0;
// line 3591
      fireFaktura();
// line 3592
    }
// line 3593
  }
// line 3594
  if (weapons.kawa.level > 0) {
// line 3595
    weapons.kawa.timer += effectiveDt;
// line 3596
    if (weapons.kawa.timer >= weapons.kawa.cooldown) {
// line 3597
      weapons.kawa.timer = 0;
// line 3598
      fireKawa();
// line 3599
    }
// line 3600
  }
// line 3601
  if (weapons.hydrant.level > 0) {
// line 3602
    weapons.hydrant.timer += effectiveDt;
// line 3603
    if (weapons.hydrant.timer >= weapons.hydrant.cooldown) {
// line 3604
      weapons.hydrant.timer = 0;
// line 3605
      fireHydrant();
// line 3606
    }
// line 3607
  }
// line 3608
  if (weapons.megafon.level > 0) {
// line 3609
    weapons.megafon.timer += effectiveDt;
// line 3610
    if (weapons.megafon.timer >= weapons.megafon.cooldown) {
// line 3611
      weapons.megafon.timer = 0;
// line 3612
      fireMegafon();
// line 3613
    }
// line 3614
  }
// line 3615
}
// line 3616

// line 3617

// line 3618

// line 3619
function fireHydrant() {
// line 3620
  if (enemies.length === 0) return;
// line 3621
  sounds.freeze();
// line 3622
  const count = weapons.hydrant.isEvo ? 8 : (weapons.hydrant.level >= 3 ? 3 : 1);
// line 3623
  const dmg = getDamage(weapons.hydrant.damage);
// line 3624
  
// line 3625
  if (weapons.hydrant.isEvo) {
// line 3626
      // Super Hydrant: Swirling Flood Tornado around player
// line 3627
      screenShake = Math.max(screenShake, 6);
// line 3628
      for (let i = 0; i < 16; i++) {
// line 3629
         const a = (i / 16) * Math.PI * 2 + gameTime * 3;
// line 3630
         projectiles.push({
// line 3631
            type: 'hydrant_beam',
// line 3632
            x: player.x,
// line 3633
            y: player.y,
// line 3634
            vx: Math.cos(a) * 550,
// line 3635
            vy: Math.sin(a) * 550,
// line 3636
            damage: dmg * 1.5,
// line 3637
            pierce: 10,
// line 3638
            life: 0.8,
// line 3639
            maxLife: 0.8,
// line 3640
            isEvo: true
// line 3641
         });
// line 3642
      }
// line 3643
  } else {
// line 3644
      let closest = null, minD = 9999;
// line 3645
      enemies.forEach(e => {
// line 3646
         const d = Math.hypot(e.x - player.x, e.y - player.y);
// line 3647
         if (d < minD) { minD = d; closest = e; }
// line 3648
      });
// line 3649
      if (closest) {
// line 3650
         const baseA = Math.atan2(closest.y - player.y, closest.x - player.x);
// line 3651
         for (let i = 0; i < count; i++) {
// line 3652
             const spread = (i - count/2) * 0.15;
// line 3653
             projectiles.push({
// line 3654
                type: 'hydrant_beam',
// line 3655
                x: player.x,
// line 3656
                y: player.y,
// line 3657
                vx: Math.cos(baseA + spread) * 500,
// line 3658
                vy: Math.sin(baseA + spread) * 500,
// line 3659
                damage: dmg,
// line 3660
                pierce: 3,
// line 3661
                life: 0.7,
// line 3662
                maxLife: 0.7
// line 3663
             });
// line 3664
         }
// line 3665
      }
// line 3666
  }
// line 3667
}
// line 3668

// line 3669
function fireMegafon() {
// line 3670
  sounds.megaph();
// line 3671
  const dmg = getDamage(weapons.megafon.damage);
// line 3672
  screenShake = Math.max(screenShake, 5);
// line 3673
  
// line 3674
  if (weapons.megafon.isEvo) {
// line 3675
      // System DSO 120dB: Screen-wide emergency siren blast!
// line 3676
      showAnnouncement("🔊 SYSTEM DSO 120dB: EWAKUACJA HALI!", "#ef4444");
// line 3677
      createSparks(player.x, player.y, 45, '#ef4444');
// line 3678
      enemies.forEach(e => {
// line 3679
         damageEnemy(e, dmg * 2.0);
// line 3680
         e.stunTimer = 2.5;
// line 3681
         e.slowTimer = 4.0;
// line 3682
      });
// line 3683
  } else {
// line 3684
      // Cone shockwave in front of player
// line 3685
      const coneA = player.angle;
// line 3686
      const coneRadius = weapons.megafon.range;
// line 3687
      enemies.forEach(e => {
// line 3688
         const dx = e.x - player.x;
// line 3689
         const dy = e.y - player.y;
// line 3690
         const dist = Math.hypot(dx, dy);
// line 3691
         if (dist < coneRadius) {
// line 3692
            const angleToE = Math.atan2(dy, dx);
// line 3693
            let diffA = Math.abs(angleToE - coneA);
// line 3694
            if (diffA > Math.PI) diffA = Math.PI * 2 - diffA;
// line 3695
            if (diffA < 0.7) { // 80 deg cone
// line 3696
                damageEnemy(e, dmg);
// line 3697
                e.stunTimer = 1.2;
// line 3698
                e.x += Math.cos(angleToE) * 65; // Knockback
// line 3699
                e.y += Math.sin(angleToE) * 65;
// line 3700
            }
// line 3701
         }
// line 3702
      });
// line 3703
      addSpeechBubble(player.x, player.y - 30, '📢 DO ROBOTY!!', '#facc15');
// line 3704
  }
// line 3705
}
// line 3706

// line 3707
function fireFaktura() {
// line 3708
  if (enemies.length === 0) return;
// line 3709
  sounds.hit();
// line 3710
  const count = weapons.faktura.isEvo ? 5 : 2;
// line 3711
  const dmg = getDamage(weapons.faktura.damage);
// line 3712
  for (let i = 0; i < count; i++) {
// line 3713
    const angle = Math.random() * Math.PI * 2;
// line 3714
    projectiles.push({
// line 3715
      type: 'faktura',
// line 3716
      x: player.x,
// line 3717
      y: player.y,
// line 3718
      vx: Math.cos(angle) * weapons.faktura.speed,
// line 3719
      vy: Math.sin(angle) * weapons.faktura.speed,
// line 3720
      damage: dmg,
// line 3721
      pierce: weapons.faktura.isEvo ? 5 : 2,
// line 3722
      life: 3.0,
// line 3723
      maxLife: 3.0,
// line 3724
      angle: angle,
// line 3725
      rotSpeed: (Math.random() - 0.5) * 15
// line 3726
    });
// line 3727
  }
// line 3728
}
// line 3729

// line 3730
function fireKawa() {
// line 3731
  sounds.freeze();
// line 3732
  const r = weapons.kawa.isEvo ? weapons.kawa.radius * 2 : weapons.kawa.radius;
// line 3733
  const dmg = getDamage(weapons.kawa.damage);
// line 3734
  
// line 3735
  // Splat effect
// line 3736
  for (let i = 0; i < 20; i++) {
// line 3737
    const angle = Math.random() * Math.PI * 2;
// line 3738
    const dist = Math.random() * r;
// line 3739
    const px = player.x + Math.cos(angle) * dist;
// line 3740
    const py = player.y + Math.sin(angle) * dist;
// line 3741
    warehousePuddles.push({
// line 3742
      x: px, y: py, rx: 15 + Math.random() * 20, ry: 10 + Math.random() * 15,
// line 3743
      color: 'rgba(60, 42, 33, 0.7)' // dark coffee color
// line 3744
    });
// line 3745
  }
// line 3746

// line 3747
  // Damage enemies
// line 3748
  for (let i = 0; i < enemies.length; i++) {
// line 3749
    const e = enemies[i];
// line 3750
    const dist = Math.hypot(e.x - player.x, e.y - player.y);
// line 3751
    if (dist <= r) {
// line 3752
      takeDamage(e, dmg);
// line 3753
      spawnDamageText(e.x, e.y - 20, dmg, '#78350f', true);
// line 3754
    }
// line 3755
  }
// line 3756
}
// line 3757

// line 3758
function fireStapler() {
// line 3759
  if (enemies.length === 0) return;
// line 3760
  sounds.hit();
// line 3761
  const count = weapons.stapler.count;
// line 3762
  for (let i = 0; i < count; i++) {
// line 3763
    const angle = player.angle + (Math.random() - 0.5) * 0.8;
// line 3764
    projectiles.push({
// line 3765
      type: 'staple',
// line 3766
      x: player.x,
// line 3767
      y: player.y,
// line 3768
      vx: Math.cos(angle) * weapons.stapler.speed,
// line 3769
      vy: Math.sin(angle) * weapons.stapler.speed,
// line 3770
      rot: angle,
// line 3771
      damage: weapons.stapler.damage,
// line 3772
      life: 50,
// line 3773
      isEvo: weapons.stapler.isEvo
// line 3774
    });
// line 3775
  }
// line 3776
}
// line 3777

// line 3778
function fireSledgehammer() {
// line 3779
  sounds.pallet();
// line 3780
  screenShake = Math.max(screenShake, 8);
// line 3781
  const r = weapons.sledgehammer.radius;
// line 3782
  enemies.forEach(e => {
// line 3783
    if (e.dead) return;
// line 3784
    const d = Math.hypot(e.x - player.x, e.y - player.y);
// line 3785
    if (d < r) {
// line 3786
      damageEnemy(e, weapons.sledgehammer.damage);
// line 3787
      e.slowTimer = 2.0;
// line 3788
      createSparks(e.x, e.y, 8, '#f59e0b');
// line 3789
    }
// line 3790
  });
// line 3791
  projectiles.push({
// line 3792
    type: 'shockwave',
// line 3793
    x: player.x,
// line 3794
    y: player.y,
// line 3795
    radius: 10,
// line 3796
    maxRadius: r,
// line 3797
    life: 0.35,
// line 3798
    maxLife: 0.35,
// line 3799
    color: weapons.sledgehammer.isEvo ? '#f59e0b' : '#94a3b8'
// line 3800
  });
// line 3801
}
// line 3802

// line 3803
function fireZipTies() {
// line 3804
  if (enemies.length === 0) return;
// line 3805
  sounds.hit();
// line 3806
  const count = weapons.zipTies.isEvo ? 6 : 3;
// line 3807
  for (let i = 0; i < count; i++) {
// line 3808
    const angle = player.angle + (Math.random() - 0.5) * 3;
// line 3809
    projectiles.push({
// line 3810
      type: 'zip_tie',
// line 3811
      x: player.x,
// line 3812
      y: player.y,
// line 3813
      vx: Math.cos(angle) * weapons.zipTies.speed,
// line 3814
      vy: Math.sin(angle) * weapons.zipTies.speed,
// line 3815
      rot: angle,
// line 3816
      damage: weapons.zipTies.damage,
// line 3817
      life: 60,
// line 3818
      isEvo: weapons.zipTies.isEvo
// line 3819
    });
// line 3820
  }
// line 3821
}
// line 3822

// line 3823
function fireCutter() {
// line 3824
  if (enemies.length === 0) return;
// line 3825
  sounds.hit();
// line 3826
  const count = weapons.cutter.isEvo ? 4 : 2;
// line 3827
  for (let i = 0; i < count; i++) {
// line 3828
    let target = enemies[Math.floor(Math.random() * enemies.length)];
// line 3829
    let angle = Math.atan2(target.y - player.y, target.x - player.x) + (Math.random()-0.5)*0.5;
// line 3830
    projectiles.push({
// line 3831
      type: 'cutter',
// line 3832
      x: player.x,
// line 3833
      y: player.y,
// line 3834
      vx: Math.cos(angle) * weapons.cutter.speed,
// line 3835
      vy: Math.sin(angle) * weapons.cutter.speed,
// line 3836
      rot: angle,
// line 3837
      damage: weapons.cutter.damage,
// line 3838
      life: 80,
// line 3839
      isEvo: weapons.cutter.isEvo
// line 3840
    });
// line 3841
  }
// line 3842
}
// line 3843

// line 3844
function fireToiletPaper() {
// line 3845
  if (enemies.length === 0) return;
// line 3846
  sounds.hit();
// line 3847
  const count = weapons.toiletPaper.isEvo ? 8 : weapons.toiletPaper.count;
// line 3848
  for (let i = 0; i < count; i++) {
// line 3849
    const angle = weapons.toiletPaper.isEvo 
// line 3850
      ? (i * (Math.PI * 2 / count))
// line 3851
      : player.angle + (Math.random() - 0.5) * 1.2;
// line 3852
    projectiles.push({
// line 3853
      type: 'toilet_paper',
// line 3854
      x: player.x,
// line 3855
      y: player.y,
// line 3856
      vx: Math.cos(angle) * weapons.toiletPaper.speed,
// line 3857
      vy: Math.sin(angle) * weapons.toiletPaper.speed,
// line 3858
      rot: 0,
// line 3859
      life: 2.2,
// line 3860
      damage: weapons.toiletPaper.damage,
// line 3861
      isEvo: weapons.toiletPaper.isEvo
// line 3862
    });
// line 3863
  }
// line 3864
}
// line 3865

// line 3866
function fireScanner() {
// line 3867
  if (weapons.scanner.isEvo) {
// line 3868
    // bramkaRFID - constant spinning lines
// line 3869
    const numLines = 4;
// line 3870
    const rfidAngle = gameTime * 3;
// line 3871
    const range = 250;
// line 3872
    for(let i=0; i<numLines; i++) {
// line 3873
       let a = rfidAngle + (i * Math.PI * 2 / numLines);
// line 3874
       let ex = player.x + Math.cos(a) * range;
// line 3875
       let ey = player.y + Math.sin(a) * range;
// line 3876
       projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: ex, y2: ey, life: 0.1, color: '#facc15' });
// line 3877
       // Check collisions along this line
// line 3878
       for (let j = 0; j < enemies.length; j++) {
// line 3879
          let e = enemies[j];
// line 3880
          if (e.dead) continue;
// line 3881
          let dx = e.x - player.x; let dy = e.y - player.y;
// line 3882
          let enemyAngle = Math.atan2(dy, dx);
// line 3883
          let dist = Math.hypot(dx, dy);
// line 3884
          if (dist < range && Math.abs(enemyAngle - a) < 0.2) {
// line 3885
             damageEnemy(e, weapons.scanner.damage);
// line 3886
             e.info.xp *= 1.5; // +50% XP
// line 3887
             createSparks(e.x, e.y, 5, '#facc15');
// line 3888
          }
// line 3889
       }
// line 3890
    }
// line 3891
    sounds.beep();
// line 3892
  } else {
// line 3893
    if (enemies.length === 0) return;
// line 3894
    const maxRangeSq = weapons.scanner.range * weapons.scanner.range;
// line 3895
    let count = 0;
// line 3896
    for (let i = 0; i < enemies.length; i++) {
// line 3897
      const e = enemies[i];
// line 3898
      if (e.dead) continue;
// line 3899
      const dx = e.x - player.x;
// line 3900
      const dy = e.y - player.y;
// line 3901
      if (dx * dx + dy * dy <= maxRangeSq) {
// line 3902
        projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: e.x, y2: e.y, life: 0.15, color: '#ef4444' });
// line 3903
        damageEnemy(e, weapons.scanner.damage);
// line 3904
        createSparks(e.x, e.y, 4, '#ef4444');
// line 3905
        count++;
// line 3906
        if (count >= weapons.scanner.pierce) break;
// line 3907
      }
// line 3908
    }
// line 3909
    if (count > 0) sounds.beep();
// line 3910
  }
// line 3911
}
// line 3912

// line 3913
function checkStretchAuraHit(dt) {
// line 3914
  const count = weapons.stretchAura.count;
// line 3915
  const radius = weapons.stretchAura.radius;
// line 3916
  for (let i = 0; i < count; i++) {
// line 3917
    const ang = weapons.stretchAura.angle + (i * (Math.PI * 2 / count));
// line 3918
    const ax = player.x + Math.cos(ang) * radius;
// line 3919
    const ay = player.y + Math.sin(ang) * radius;
// line 3920
    for (let j = 0; j < enemies.length; j++) {
// line 3921
      const e = enemies[j];
// line 3922
      if (e.dead) continue;
// line 3923
      const dx = e.x - ax;
// line 3924
      const dy = e.y - ay;
// line 3925
      if (dx * dx + dy * dy < (e.info.radius + 20) * (e.info.radius + 20)) {
// line 3926
        damageEnemy(e, weapons.stretchAura.damage * dt * 3.5);
// line 3927
      }
// line 3928
    }
// line 3929
  }
// line 3930
}
// line 3931

// line 3932
function firePallet() {
// line 3933
  if (enemies.length === 0) return;
// line 3934
  let target = null;
// line 3935
  let minDistSq = 500 * 500;
// line 3936
  for (let i = 0; i < enemies.length; i++) {
// line 3937
    const e = enemies[i];
// line 3938
    if (e.dead) continue;
// line 3939
    const distSq = (e.x - player.x) * (e.x - player.x) + (e.y - player.y) * (e.y - player.y);
// line 3940
    if (distSq < minDistSq) { minDistSq = distSq; target = e; }
// line 3941
  }
// line 3942
  if (!target) return;
// line 3943
  const a = Math.atan2(target.y - player.y, target.x - player.x);
// line 3944

// line 3945
  const numPallets = weapons.pallets.isEvo ? 4 : 1;
// line 3946
  for (let p = 0; p < numPallets; p++) {
// line 3947
    const offsetAng = (p - (numPallets - 1) / 2) * 0.35;
// line 3948
    projectiles.push({
// line 3949
      type: 'pallet',
// line 3950
      x: player.x,
// line 3951
      y: player.y,
// line 3952
      vx: Math.cos(a + offsetAng) * weapons.pallets.speed,
// line 3953
      vy: Math.sin(a + offsetAng) * weapons.pallets.speed,
// line 3954
      rot: 0,
// line 3955
      life: 3.0,
// line 3956
      damage: weapons.pallets.damage
// line 3957
    });
// line 3958
  }
// line 3959
  sounds.pallet();
// line 3960
}
// line 3961

// line 3962
function fireExtinguisher() {
// line 3963
  sounds.freeze();
// line 3964
  const forwardAngle = player.angle;
// line 3965
  const range = weapons.extinguisher.range;
// line 3966
  for (let i = 0; i < enemies.length; i++) {
// line 3967
    const e = enemies[i];
// line 3968
    if (e.dead) continue;
// line 3969
    const dx = e.x - player.x;
// line 3970
    const dy = e.y - player.y;
// line 3971
    const dist = Math.hypot(dx, dy);
// line 3972
    if (dist < range) {
// line 3973
      const angToEnemy = Math.atan2(dy, dx);
// line 3974
      let diff = Math.abs(angToEnemy - forwardAngle);
// line 3975
      while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
// line 3976
      if (diff < (weapons.extinguisher.isEvo ? 1.4 : 0.85)) {
// line 3977
        damageEnemy(e, weapons.extinguisher.damage);
// line 3978
        e.slowTimer = weapons.extinguisher.isEvo ? 4.5 : 2.5;
// line 3979
        createSparks(e.x, e.y, 6, '#67e8f9');
// line 3980
      }
// line 3981
    }
// line 3982
  }
// line 3983
  projectiles.push({
// line 3984
    type: 'cold_cone',
// line 3985
    x: player.x,
// line 3986
    y: player.y,
// line 3987
    angle: forwardAngle,
// line 3988
    range: range,
// line 3989
    life: 0.35,
// line 3990
    isEvo: weapons.extinguisher.isEvo
// line 3991
  });
// line 3992
}
// line 3993

// line 3994
function damageEnemy(e, amount) {
// line 3995
  if (isNaN(amount) || amount === undefined) amount = 15;
// line 3996
  const isCrit = Math.random() < player.critChance;
// line 3997
  let dmg = isCrit ? amount * 1.75 : amount;
// line 3998
  if (player.damageMult && !isNaN(player.damageMult)) dmg *= player.damageMult;
// line 3999
  if (isNaN(dmg)) dmg = amount;
// line 4000
  
// line 4001
  if (isCrit || e.isBoss) {
// line 4002
      hitStopTimer = 0.025; // 25ms hit-stop
// line 4003
      screenShake = Math.max(screenShake, 4);
// line 4004
  }
// line 4005
  
// line 4006
  if (e.info.armor) dmg *= 0.3; // 70% damage reduction
// line 4007
  if (player.thorns && player.thorns > 0) {
// line 4008
      damageEnemy(e, player.thorns);
// line 4009
      createSparks(e.x, e.y, 10, '#facc15');
// line 4010
  }
// line 4011
  if (e.info.directionalShield) {
// line 4012
     dmg *= 0.5; 
// line 4013
  }
// line 4014
  
// line 4015
  e.hp -= dmg;
// line 4016
  e.hitFlash = 0.12;
// line 4017
  spawnDamageNumber(e.x, e.y, dmg, isCrit);
// line 4018
  
// line 4019
  // Blood splatter on hit
// line 4020
  const hitParticles = isCrit ? 6 : 2;
// line 4021
  for (let i = 0; i < hitParticles; i++) {
// line 4022
    const angle = Math.random() * Math.PI * 2;
// line 4023
    const speed = Math.random() * 4 + 1;
// line 4024
    spawnParticle(e.x, e.y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.3 + Math.random() * 0.2, Math.random() * 2.5 + 1, e.info.color || '#991b1b');
// line 4025
  }
// line 4026

// line 4027
  if (e.hp <= 0 && !e.dead) {
// line 4028
    killEnemy(e);
// line 4029
  }
// line 4030
}
// line 4031

// line 4032
function killEnemy(e) {
// line 4033
  trySpawnPowerUp(e.x, e.y);
// line 4034
  spawnGibs(e.x, e.y, e.isBoss ? 16 : 6, e.info ? e.info.name : 'default');
// line 4035
  e.dead = true;
// line 4036
  kills++;
// line 4037
  comboCount++;
// line 4038
  comboTimer = 3.5;
// line 4039
  if (comboCount > maxCombo) maxCombo = comboCount;
// line 4040
  if (comboCount >= 50) triggerAchievement('combo_god', 'Mistrz Epoksydu x50', '🔥');
// line 4041

// line 4042
  // Arcade Kill Streak Milestones
// line 4043
  // Non-intrusive Combo Milestones (Announced in Top Queue)
// line 4044
  if (comboCount === 50) showAnnouncement('⚡ 50 COMBO: NA ZMIANIE!', '#f59e0b');
// line 4045
  else if (comboCount === 100) showAnnouncement('🔥 100 COMBO: SERIA WMS!', '#ec4899');
// line 4046
  else if (comboCount === 250) showAnnouncement('👑 250 COMBO: LEGENDA HALI!', '#38bdf8');
// line 4047
  else if (comboCount === 500) showAnnouncement('🚀 500 COMBO: MISTRZ EPAL!', '#facc15');
// line 4048
  
// line 4049
  if (comboCount === 50 || comboCount === 100 || comboCount === 250 || comboCount === 500) {
// line 4050
    screenShake = 8;
// line 4051
    sounds.levelUp();
// line 4052
  }
// line 4053

// line 4054
  const packageMultiplier = 1.0 + (packageCombo * 0.15);
// line 4055
  score += Math.floor(e.info.xp * 10 * (1 + comboCount * 0.05) * packageMultiplier);
// line 4056
  createSparks(e.x, e.y, 16, e.info.color);
// line 4057
  addBloodStain(e.x, e.y, e.info);
// line 4058
  
// line 4059
  if (e.info.name === 'Rolka Folii Strecz') {
// line 4060
     enemies.push({ x: e.x - 20, y: e.y, info: ENEMY_TYPES.FOLIA_MALA, hp: ENEMY_TYPES.FOLIA_MALA.hp, quoteTimer: 0, slowTimer: 0 });
// line 4061
     enemies.push({ x: e.x + 20, y: e.y, info: ENEMY_TYPES.FOLIA_MALA, hp: ENEMY_TYPES.FOLIA_MALA.hp, quoteTimer: 0, slowTimer: 0 });
// line 4062
  } else if (e.info.name === 'Zbłąkany Karton B2C') {
// line 4063
     createSparks(e.x, e.y, 10, '#d97706'); // Paper dust
// line 4064
  }
// line 4065

// line 4066
  // Drop barcode XP
// line 4067
  dropItems.push({
// line 4068
    x: e.x,
// line 4069
    y: e.y,
// line 4070
    type: 'barcode_xp',
// line 4071
    val: e.info.xp,
// line 4072
    life: 20
// line 4073
  });
// line 4074

// line 4075
  // Random item drops (Hotdog, Kinder Bueno, Awizo, Kawa, Skrzynia, Monety DTA)
// line 4076
  const rand = Math.random();
// line 4077
if (e.isBoss) {
// line 4078
    dropItems.push({ x: e.x, y: e.y, type: 'lucky_chest', val: 3, life: 60 });
// line 4079
    dropItems.push({ x: e.x + 25, y: e.y + 10, type: 'dta_coin', val: 100, life: 60 });
// line 4080
    window.timeScale = 0.15; // Massive cinematic slow-mo!
// line 4081
    screenShake = 20;
// line 4082
  } else if (rand < 0.035 || (e.info.hp >= 120 && Math.random() < 0.25)) {
// line 4083
    dropItems.push({ x: e.x, y: e.y, type: 'lucky_chest', val: 1, life: 45 });
// line 4084
  } else if (rand < 0.10) {
// line 4085
    dropItems.push({ x: e.x, y: e.y, type: 'dta_coin', val: 20 + Math.floor(Math.random() * 20), life: 30 });
// line 4086
  } else if (rand < 0.12) {
// line 4087
    dropItems.push({ x: e.x, y: e.y, type: 'mystery_box', life: 40 });
// line 4088
  } else if (rand < 0.14) { dropItems.push({ x: e.x, y: e.y, type: 'pizza_szefa', life: 30 }); } else if (rand < 0.18) {
// line 4089
    dropItems.push({ x: e.x, y: e.y, type: 'hotdog', life: 20 });
// line 4090
  } else if (rand < 0.21) {
// line 4091
    dropItems.push({ x: e.x, y: e.y, type: 'kinder_bueno', life: 20 });
// line 4092
  } else if (rand < 0.26) {
// line 4093
    dropItems.push({ x: e.x, y: e.y, type: 'coffee_thermos', life: 20 });
// line 4094
  }
// line 4095

// line 4096
  if (kills === 100) triggerAchievement('kill_100', 'Pogromca Rampy (100 Kills)', '💀');
// line 4097

// line 4098
  if (e.isBoss) {
// line 4099
    sounds.levelUp();
// line 4100
    if (e.type === 'BOSS_GRZESIEK' || e.type === 'BOSS_ZBIGNIEW') triggerAchievement('boss_grzesiek', 'Nalot BHP Przetrwany!', '📢');
// line 4101
    if (e.type === 'BOSS_WIESLAW_REACH') triggerAchievement('fast_picker', 'Mistrz Wysokiego Składu!', '🏗️');
// line 4102
    if (e.type === 'BOSS_KAS') triggerAchievement('first_blood', 'Rewizja Celna Wygrana!', '🦅');
// line 4103
    if (e.type === 'BOSS_TOITOI_MECH') triggerAchievement('toitoi_evolution', 'Zasłana Ewolucja Przełamana!', '🚽');
// line 4104
    if (e.type === 'BOSS_KONTENER') triggerAchievement('kontener_1559', 'Kontener 40ft Rozładowany!', '🚢');
// line 4105
    if (e.type === 'BOSS_IGOR') triggerAchievement('lights_out', 'Ciemność Pokonana!', '🕶️');
// line 4106
    
// line 4107
    // Trigger Dynamic Sector Victory Transition
// line 4108
    triggerSectorVictory(currentSectorIndex);
// line 4109
  }
// line 4110
}
// line 4111

// line 4112
function triggerSectorVictory(idx) {
// line 4113
  sounds.achieve();
// line 4114
  screenShake = 16;
// line 4115
  activeBoss = null;
// line 4116
  document.getElementById('boss-hp-container').style.display = 'none';
// line 4117

// line 4118
  // Add DTA Coins & Battery/XP Rewards
// line 4119
  dtaCoins += 500;
// line 4120
  saveWorkshopData();
// line 4121
  player.battery = player.maxBattery;
// line 4122
  currentXP += 300;
// line 4123
  checkLevelUp();
// line 4124

// line 4125
  const sec = WAREHOUSE_SECTORS[idx] || WAREHOUSE_SECTORS[0];
// line 4126
  const nextSec = WAREHOUSE_SECTORS[idx + 1];
// line 4127

// line 4128
  const modal = document.getElementById('stage-transition-screen');
// line 4129
  const titleEl = document.getElementById('transition-boss-title');
// line 4130
  const descEl = document.getElementById('transition-desc-text');
// line 4131
  const btnNext = document.getElementById('btn-next-sector');
// line 4132

// line 4133
  if (nextSec) {
// line 4134
    titleEl.innerText = `👑 BOSS POKONANY: ${sec.bossName.toUpperCase()}`;
// line 4135
    descEl.innerHTML = `Przełamano opór w <b>${sec.name}</b>!<br>Wkraczasz w głąb magazynu: <b>${nextSec.name}</b>!<br><i>${nextSec.desc}</i>`;
// line 4136
    btnNext.innerText = `WKRACZAJ DO: SEKTOR ${nextSec.id} ➔`;
// line 4137
    btnNext.onclick = () => {
// line 4138
      modal.style.display = 'none';
// line 4139
      gameState = STATE.PLAYING;
// line 4140
      currentSectorIndex = idx + 1;
// line 4141
      rebuildSectorEnvironment(currentSectorIndex);
// line 4142
      showAnnouncement(`📍 ${nextSec.name}`, nextSec.hazardColor);
// line 4143
    };
// line 4144
  } else {
// line 4145
    // Final Boss Defeated!
// line 4146
    titleEl.innerText = '👑 PREZES ZARZĄDU POKONANY!';
// line 4147
    descEl.innerHTML = 'Odprawa zakończona sukcesem! Przetrwałeś wszystkie 5 Sektorów DTA Graniczna 8f! Odblokowano tryb <b>NIESKOŃCZONE NADGODZINY</b>!';
// line 4148
    btnNext.innerText = 'ROZPOCZNIJ NADGODZINY 🔥';
// line 4149
    btnNext.onclick = () => {
// line 4150
      modal.style.display = 'none';
// line 4151
      gameState = STATE.PLAYING;
// line 4152
      currentSectorIndex = 4;
// line 4153
      showAnnouncement('🔥 TRYB NADGODZINY: EXTREME DTA!', '#facc15');
// line 4154
    };
// line 4155
  }
// line 4156

// line 4157
  gameState = STATE.PAUSED;
// line 4158
  modal.style.display = 'flex';
// line 4159
}
// line 4160

// line 4161
function rebuildSectorEnvironment(idx) {
// line 4162
  const sec = WAREHOUSE_SECTORS[idx] || WAREHOUSE_SECTORS[0];
// line 4163
  warehouseStencils = [];
// line 4164
  warehouseLights = [];
// line 4165
  warehousePuddles = [];
// line 4166

// line 4167
  // Rebuild overhead lights with sector colors
// line 4168
  const cols = Math.floor(ARENA_WIDTH / 360);
// line 4169
  const rows = Math.floor(ARENA_HEIGHT / 360);
// line 4170
  for (let c = 1; c < cols; c++) {
// line 4171
    for (let r = 1; r < rows; r++) {
// line 4172
      warehouseLights.push({
// line 4173
        x: c * 360,
// line 4174
        y: r * 360,
// line 4175
        flicker: Math.random(),
// line 4176
        color: sec.hazardColor
// line 4177
      });
// line 4178
    }
// line 4179
  }
// line 4180

// line 4181
  // Sector-specific stencils & hazards
// line 4182
  if (idx === 0) {
// line 4183
    // Sector 1: Doki
// line 4184
    warehouseStencils.push(
// line 4185
      { text: '⚠️ STREFA ROZŁADUNKU B2C (RAMPY 1-6)', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(245, 158, 11, 0.35)' },
// line 4186
      { text: '⚡ GŁÓWNA ALEJA WÓZKÓW BT', x: ARENA_WIDTH / 2 - 160, y: ARENA_HEIGHT / 2, font: '900 24px sans-serif', color: 'rgba(56, 189, 248, 0.25)' }
// line 4187
    );
// line 4188
  } else if (idx === 1) {
// line 4189
    // Sector 2: Wysoki Skład
// line 4190
    warehouseStencils.push(
// line 4191
      { text: '🏗️ ALEJE WYSOKIEGO SKŁADU 14M - KASKI OBOWIĄZKOWE', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(56, 189, 248, 0.4)' },
// line 4192
      { text: '📦 SEKTOR REGAŁOWY A-01 DO A-99', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(251, 191, 36, 0.3)' }
// line 4193
    );
// line 4194
  } else if (idx === 2) {
// line 4195
    // Sector 3: Kontrola Celna
// line 4196
    warehouseStencils.push(
// line 4197
      { text: '🦅 STREFA KONTROLI CELNEJ KAS - BRAK WSTĘPU', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(236, 72, 153, 0.4)' },
// line 4198
      { text: '🛑 PUNKT REWIZJI SZCZEGÓŁOWEJ SAD', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(239, 68, 68, 0.35)' }
// line 4199
    );
// line 4200
  } else if (idx === 3) {
// line 4201
    // Sector 4: Chłodnia & ADR
// line 4202
    warehouseStencils.push(
// line 4203
      { text: '❄️ CHŁODNIA GŁĘBOKIEGO SKŁADU -18°C', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(45, 212, 191, 0.45)' },
// line 4204
      { text: '☣️ SKŁADOWISKO CHEMICZNE ADR & TOITOI', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(74, 222, 128, 0.35)' }
// line 4205
    );
// line 4206
    // Frosty slippery puddles
// line 4207
    for (let i = 0; i < 12; i++) {
// line 4208
      warehousePuddles.push({
// line 4209
        x: Math.random() * (ARENA_WIDTH - 200) + 100,
// line 4210
        y: Math.random() * (ARENA_HEIGHT - 200) + 100,
// line 4211
        rx: 60 + Math.random() * 40,
// line 4212
        ry: 40 + Math.random() * 25,
// line 4213
        color: 'rgba(56, 189, 248, 0.35)'
// line 4214
      });
// line 4215
    }
// line 4216
  } else if (idx === 4) {
// line 4217
    // Sector 5: Dyrekcja
// line 4218
    warehouseStencils.push(
// line 4219
      { text: '🏢 CENTRALA DYREKCJI & GABINET ZARZĄDU', x: 180, y: 120, font: 'bold 20px sans-serif', color: 'rgba(244, 63, 94, 0.45)' },
// line 4220
      { text: '👔 STREFA DECYZJI ZARZĄDU - WALKA O 07:00', x: ARENA_WIDTH / 2 - 180, y: ARENA_HEIGHT / 2, font: '900 22px sans-serif', color: 'rgba(250, 204, 21, 0.35)' }
// line 4221
    );
// line 4222
  }
// line 4223
}
// line 4224

// line 4225
// --- MAIN LOOP UPDATE ---
// line 4226
let lastTime = performance.now();
// line 4227
let spawnClock = 0;
// line 4228

// line 4229
function update(dt) {
// line 4230
  // Power-Up Timers & Modifiers
// line 4231
  if (bulletTimeTimer > 0) {
// line 4232
    bulletTimeTimer -= dt;
// line 4233
    dt *= 0.25; // Slow-mo for enemies & world
// line 4234
  }
// line 4235
  if (freezeTimer > 0) {
// line 4236
    freezeTimer -= dt;
// line 4237
  }
// line 4238
  if (fireBulletsTimer > 0) {
// line 4239
    fireBulletsTimer -= dt;
// line 4240
  }
// line 4241
  if (player.kamikazeIntern) {
// line 4242
    kamikazeTimer += dt;
// line 4243
    if (kamikazeTimer >= 5.0) {
// line 4244
      kamikazeTimer = 0;
// line 4245
      // Spawn exploding intern near player
// line 4246
      const angle = Math.random() * Math.PI * 2;
// line 4247
      const ex = player.x + Math.cos(angle) * 120;
// line 4248
      const ey = player.y + Math.sin(angle) * 120;
// line 4249
      createSparks(ex, ey, 25, '#ef4444');
// line 4250
      stampPermanentDecal(ex, ey, 35, 'oil');
// line 4251
      screenShake = Math.max(screenShake, 14);
// line 4252
      sounds.pallet();
// line 4253
      addSpeechBubble(ex, ey, '💣 PRAKTYKANT: BOOM!', '#ef4444');
// line 4254
      enemies.forEach(en => {
// line 4255
        if (!en.dead && Math.hypot(en.x - ex, en.y - ey) < 160) {
// line 4256
          damageEnemy(en, 180);
// line 4257
        }
// line 4258
      });
// line 4259
    }
// line 4260
  }
// line 4261
  
// line 4262
  // Handling Pip Bribe Invincibility
// line 4263
  if (player.pipBribe && player.battery <= 0 && !player.pipBribeActive) {
// line 4264
    player.pipBribeActive = true;
// line 4265
    player.pipBribeTimer = 10.0;
// line 4266
    player.battery = 1;
// line 4267
    addSpeechBubble(player.x, player.y - 40, '💼 ŁAPÓWKA DLA PIP: 10S OCHRONY!', '#38bdf8');
// line 4268
    showAnnouncement('💼 ŁAPÓWKA DLA PIP: KONTROLA WSTRZYMANA!', '#38bdf8');
// line 4269
  }
// line 4270
  if (player.pipBribeActive) {
// line 4271
    player.pipBribeTimer -= dt;
// line 4272
    player.battery = Math.max(1, player.battery);
// line 4273
    if (player.pipBribeTimer <= 0) {
// line 4274
      player.pipBribeActive = false;
// line 4275
      player.pipBribe = false; // Used up
// line 4276
    }
// line 4277
  }
// line 4278
  if (gameState !== STATE.PLAYING) return;
// line 4279
  
// line 4280
  if (hitStopTimer > 0) {
// line 4281
    hitStopTimer -= dt;
// line 4282
    return; // Frame freeze for juiciness
// line 4283
  }
// line 4284
  
// line 4285
  gameTime += dt;
// line 4286

// line 4287
  // Check Sector Boss Spawning every 2 minutes (120s)
// line 4288
  for (let s = 0; s < WAREHOUSE_SECTORS.length; s++) {
// line 4289
    const sec = WAREHOUSE_SECTORS[s];
// line 4290
    if (gameTime >= sec.bossTime && !spawnedBossSectors[s] && currentSectorIndex === s) {
// line 4291
      spawnedBossSectors[s] = true;
// line 4292
      spawnEnemy(sec.bossKey, true);
// line 4293
      break;
// line 4294
    }
// line 4295
  }
// line 4296

// line 4297
  // Update Sector Badge in HUD
// line 4298
  const curSec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[WAREHOUSE_SECTORS.length - 1];
// line 4299
  let bossCountdownStr = '';
// line 4300
  if (activeBoss && !activeBoss.dead) {
// line 4301
    bossCountdownStr = '🚨 WALKA Z BOSSEM!';
// line 4302
  } else if (gameTime < curSec.bossTime) {
// line 4303
    const secLeft = Math.max(0, Math.ceil(curSec.bossTime - gameTime));
// line 4304
    const m = Math.floor(secLeft / 60);
// line 4305
    const s = secLeft % 60;
// line 4306
    bossCountdownStr = `${m}:${s < 10 ? '0' : ''}${s}`;
// line 4307
  } else {
// line 4308
    bossCountdownStr = '🚨 BOSS PRZYBYŁ!';
// line 4309
  }
// line 4310
  const sectorBadge = document.getElementById('badge-sector');
// line 4311
  if (sectorBadge) {
// line 4312
    sectorBadge.innerText = `📍 SEKTOR ${curSec.id} | ⏰ BOSS: ${bossCountdownStr}`;
// line 4313
    sectorBadge.style.borderColor = curSec.hazardColor;
// line 4314
  }
// line 4315

// line 4316
  // --- DYNAMIC SHIFT EVENTS (03:30 KAS Audit, 04:15 Cold Storage Freeze, Velvet Powerups) ---
// line 4317
  if (!window.eventFlags) window.eventFlags = { kasAudit: false, coldFreeze: false, goldenPallet: false };
// line 4318
  
// line 4319
  // Event 1: 03:30 (gameTime >= 210s) KAS Audit
// line 4320
  if (gameTime >= 210 && !window.eventFlags.kasAudit) {
// line 4321
    window.eventFlags.kasAudit = true;
// line 4322
    sounds.bossAlert();
// line 4323
    screenShake = 15;
// line 4324
    addSpeechBubble(player.x, player.y - 50, '🚨 ALARM: AUDYT SKARBOWY KAS! UNIKAJ STREF REWIZJI!', '#ef4444');
// line 4325
    projectiles.push({
// line 4326
      type: 'kas_red_zone',
// line 4327
      x: player.x + (Math.random() * 200 - 100),
// line 4328
      y: player.y + (Math.random() * 200 - 100),
// line 4329
      radius: 180,
// line 4330
      life: 12.0
// line 4331
    });
// line 4332
  }
// line 4333

// line 4334
  // Event 2: 04:15 (gameTime >= 255s) Cold Storage Freeze (Drift Ice Epoxy)
// line 4335
  if (gameTime >= 255 && !window.eventFlags.coldFreeze) {
// line 4336
    window.eventFlags.coldFreeze = true;
// line 4337
    sounds.freeze();
// line 4338
    screenShake = 12;
// line 4339
    addSpeechBubble(player.x, player.y - 50, '❄️ AWARIA CHŁODNI: SZRON NA EPOKSYDZIE (DRIFT)!', '#38bdf8');
// line 4340
    // Spawn cold ice puddles
// line 4341
    for (let i = 0; i < 8; i++) {
// line 4342
      warehousePuddles.push({
// line 4343
        x: player.x + (Math.random() * 800 - 400),
// line 4344
        y: player.y + (Math.random() * 800 - 400),
// line 4345
        rx: 70 + Math.random() * 40,
// line 4346
        ry: 45 + Math.random() * 30,
// line 4347
        color: 'rgba(56, 189, 248, 0.35)'
// line 4348
      });
// line 4349
    }
// line 4350
  }
// line 4351

// line 4352
  // Event 3: 04:45 (gameTime >= 285s) Golden Velvet Pallet Spawn
// line 4353
  if (gameTime >= 285 && !window.eventFlags.goldenPallet) {
// line 4354
    window.eventFlags.goldenPallet = true;
// line 4355
    sounds.achieve();
// line 4356
    dropItems.push({
// line 4357
      id: Math.random(),
// line 4358
      type: 'golden_velvet',
// line 4359
      x: player.x + (Math.random() * 300 - 150),
// line 4360
      y: player.y + (Math.random() * 300 - 150),
// line 4361
      life: 40.0
// line 4362
    });
// line 4363
    addSpeechBubble(player.x, player.y - 50, '🌟 SPAWNOWANO ZŁOTĄ PALETĘ VELVET MAX!', '#facc15');
// line 4364
  }
// line 4365

// line 4366
  // Handle Golden Velvet item pick up in dropItems collection loop
// line 4367
  // Stamina-based Forklift mechanic
// line 4368
  let canForklift = (player.wantsForklift && player.stamina > 0 && !player.staminaLock);
// line 4369
  if (canForklift && !player.isForklift && player.stamina < 20) {
// line 4370
     player.staminaLock = true;
// line 4371
     canForklift = false;
// line 4372
  }
// line 4373

// line 4374
  if (canForklift) {
// line 4375
    if (!player.isForklift) {
// line 4376
      player.isForklift = true;
// line 4377
      player.radius = 22;
// line 4378
      sounds.dash();
// line 4379
      addSpeechBubble(player.x, player.y - 30, '🚜 WÓZEK BT!', '#facc15');
// line 4380
    }
// line 4381
    // Deplete stamina (lasts ~3 seconds of continuous use)
// line 4382
    player.stamina -= dt * 33; 
// line 4383
    if (player.stamina <= 0) {
// line 4384
      player.stamina = 0;
// line 4385
      player.isForklift = false;
// line 4386
      player.staminaLock = true;
// line 4387
      player.radius = 14;
// line 4388
      createSparks(player.x, player.y, 25, '#94a3b8');
// line 4389
    }
// line 4390
  } else {
// line 4391
    if (player.isForklift) {
// line 4392
      player.isForklift = false;
// line 4393
      player.radius = 14;
// line 4394
      createSparks(player.x, player.y, 15, '#94a3b8');
// line 4395
    }
// line 4396
    // Recharge stamina (takes ~6 seconds to fully recharge)
// line 4397
    player.stamina += dt * 16 * (player.staminaRegenMult || 1.0);
// line 4398
    if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;
// line 4399
    if (player.stamina >= 20) player.staminaLock = false;
// line 4400
  }
// line 4401

// line 4402

// line 4403
  // Real shift clock calculation
// line 4404
  const progress = Math.min(1, gameTime / TOTAL_SHIFT_DURATION);
// line 4405
  const currentMinutes = SHIFT_START_MINUTES + progress * (SHIFT_END_MINUTES - SHIFT_START_MINUTES);
// line 4406
  const hrs = Math.floor(currentMinutes / 60);
// line 4407
  const mins = Math.floor(currentMinutes % 60);
// line 4408
  const timeStr = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
// line 4409

// line 4410
  // Combo timer
// line 4411
  if (comboTimer > 0) {
// line 4412
    comboTimer -= dt;
// line 4413
    if (comboTimer <= 0) comboCount = 0;
// line 4414
  }
// line 4415
  if (packageComboTimer > 0) {
// line 4416
    packageComboTimer -= dt;
// line 4417
    if (packageComboTimer <= 0) {
// line 4418
      if (packageCombo >= 8) {
// line 4419
        addSpeechBubble(player.x, player.y - 25, '🛑 KONIEC COMBO PACZEK', '#94a3b8');
// line 4420
      }
// line 4421
      packageCombo = 0;
// line 4422
    }
// line 4423
  }
// line 4424

// line 4425
  // Player Movement & Physics (Frame-rate Independent & Ultra Responsive)
// line 4426
  let moveX = touchState.dirX;
// line 4427
  let moveY = touchState.dirY;
// line 4428

// line 4429
  if (keys['w'] || keys['arrowup']) moveY -= 1;
// line 4430
  if (keys['s'] || keys['arrowdown']) moveY += 1;
// line 4431
  if (keys['a'] || keys['arrowleft']) moveX -= 1;
// line 4432
  if (keys['d'] || keys['arrowright']) moveX += 1;
// line 4433

// line 4434
  const moveLen = Math.hypot(moveX, moveY);
// line 4435
  let curSpeed = player.speed;
// line 4436
  if (mysteryActive === 'nadgodziny') curSpeed *= 0.65; // Morale drop (slowed down)
// line 4437
  if (player.isForklift) curSpeed *= 1.35;
// line 4438
  if (player.isDashing) curSpeed *= (player.isForklift ? 1.30 : 1.60);
// line 4439

// line 4440
  // Toyota BT Package Combo Speed Boost
// line 4441
  if (packageCombo > 0) {
// line 4442
    const comboBoost = Math.min(1.20, 1.0 + packageCombo * 0.01);
// line 4443
    curSpeed *= comboBoost;
// line 4444
  }
// line 4445

// line 4446
  // Smooth acceleration & velocity damping (Exponential decay)
// line 4447
  let targetVx = 0;
// line 4448
  let targetVy = 0;
// line 4449
  if (moveLen > 0.05) {
// line 4450
    const normX = moveX / moveLen;
// line 4451
    const normY = moveY / moveLen;
// line 4452
    targetVx = normX * curSpeed;
// line 4453
    targetVy = normY * curSpeed;
// line 4454

// line 4455
    const targetAngle = Math.atan2(normY, normX);
// line 4456
    let diff = targetAngle - player.angle;
// line 4457
    while (diff < -Math.PI) diff += Math.PI * 2;
// line 4458
    while (diff > Math.PI) diff -= Math.PI * 2;
// line 4459
    player.angle += diff * (1 - Math.exp(-22.0 * dt));
// line 4460

// line 4461
const angularDiff = Math.abs(diff);
// line 4462
    const isDrifting = (angularDiff > 0.25 || player.isDashing || (moveLen === 0 && Math.hypot(player.vx, player.vy) > 150));
// line 4463
    
// line 4464
    if (isDrifting) {
// line 4465
      if (Math.random() < (player.isForklift ? 0.70 : 0.30)) {
// line 4466
        addSkidMark(player.x, player.y, player.angle);
// line 4467
        
// line 4468
        // Smoke & Drift sparks
// line 4469
        const rearX = player.x - Math.cos(player.angle) * 16;
// line 4470
        const rearY = player.y - Math.sin(player.angle) * 16;
// line 4471
        spawnParticle(rearX, rearY, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, 0.45, 4.5, 'rgba(148, 163, 184, 0.5)');
// line 4472
        
// line 4473
        if (player.isDashing || angularDiff > 0.5 || Math.hypot(player.vx, player.vy) > 400) {
// line 4474
          spawnParticle(rearX, rearY, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0.35, 3.5, '#fbbf24');
// line 4475
        }
// line 4476
      }
// line 4477
    }
// line 4478
  }
// line 4479

// line 4480
  const accelFactor = 1 - Math.exp((moveLen > 0.05 ? -14.0 : -18.0) * dt);
// line 4481
  player.vx += (targetVx - player.vx) * accelFactor;
// line 4482
  player.vy += (targetVy - player.vy) * accelFactor;
// line 4483
player.x += player.vx * dt;
// line 4484
  player.y += player.vy * dt;
// line 4485

// line 4486
  // Obstacle collisions (Racks, Pallets, ToiToi)
// line 4487
  for (let i = 0; i < obstacles.length; i++) {
// line 4488
    const o = obstacles[i];
// line 4489
    // Simple AABB vs Circle collision
// line 4490
    const testX = Math.max(o.x, Math.min(player.x, o.x + o.w));
// line 4491
    const testY = Math.max(o.y, Math.min(player.y, o.y + o.h));
// line 4492
    
// line 4493
    const distX = player.x - testX;
// line 4494
    const distY = player.y - testY;
// line 4495
    const distance = Math.hypot(distX, distY);
// line 4496
    
// line 4497
    if (distance < player.radius) {
// line 4498
      // Collision occurred!
// line 4499
      const overlap = player.radius - distance;
// line 4500
      const speed = Math.hypot(player.vx, player.vy);
// line 4501
      
// line 4502
      if (distance > 0) {
// line 4503
        player.x += (distX / distance) * overlap;
// line 4504
        player.y += (distY / distance) * overlap;
// line 4505
      } else {
// line 4506
        player.x -= player.vx * dt;
// line 4507
        player.y -= player.vy * dt;
// line 4508
      }
// line 4509
      
// line 4510
      // Spawn sparks if hit hard enough
// line 4511
      if (speed > 150) {
// line 4512
         createSparks(testX, testY, Math.floor(speed / 30), '#fbbf24');
// line 4513
         if (speed > 300) screenShake = Math.max(screenShake, 3);
// line 4514
      }
// line 4515
      
// line 4516
      // Kill momentum towards wall
// line 4517
      player.vx *= 0.5;
// line 4518
      player.vy *= 0.5;
// line 4519
    }
// line 4520
  }
// line 4521

// line 4522
  player.x = Math.max(player.radius, Math.min(ARENA_WIDTH - player.radius, player.x));
// line 4523
  player.y = Math.max(player.radius, Math.min(ARENA_HEIGHT - player.radius, player.y));
// line 4524

// line 4525
  // Toyota BT Rear Exhaust Particle Generation (Speed / Nitro Boost VFX)
// line 4526
  const exOffsetX = -Math.cos(player.angle) * 26 + Math.sin(player.angle) * 9;
// line 4527
  const exOffsetY = -Math.sin(player.angle) * 26 - Math.cos(player.angle) * 9;
// line 4528
  const exX = player.x + exOffsetX;
// line 4529
  const exY = player.y + exOffsetY;
// line 4530

// line 4531
  if (player.isForklift && (packageCombo > 0 || player.isDashing || moveLen > 0.05)) {
// line 4532
    const ejectCount = packageCombo >= 15 ? 3 : packageCombo >= 5 ? 2 : 1;
// line 4533
    for (let ep = 0; ep < ejectCount; ep++) {
// line 4534
      const ejectAngle = player.angle + Math.PI + (Math.random() - 0.5) * 0.45;
// line 4535
      const ejectSpeed = (Math.random() * 45 + 30) * (1 + Math.min(12, packageCombo) * 0.12);
// line 4536
      const evx = Math.cos(ejectAngle) * ejectSpeed;
// line 4537
      const evy = Math.sin(ejectAngle) * ejectSpeed;
// line 4538

// line 4539
      let pColor, pSize, pLife;
// line 4540
      if (packageCombo >= 15) {
// line 4541
        // Hyper Plasma Speed Boost (Cyan / Magenta / Purple)
// line 4542
        pColor = Math.random() < 0.4 ? '#38bdf8' : (Math.random() < 0.5 ? '#c084fc' : '#f472b6');
// line 4543
        pSize = Math.random() * 4 + 3;
// line 4544
        pLife = 0.45;
// line 4545
      } else if (packageCombo >= 5) {
// line 4546
        // Turbo Fire & Nitro (Orange / Amber / Red)
// line 4547
        pColor = Math.random() < 0.4 ? '#f97316' : (Math.random() < 0.5 ? '#fbbf24' : '#ef4444');
// line 4548
        pSize = Math.random() * 3.5 + 2.5;
// line 4549
        pLife = 0.4;
// line 4550
      } else {
// line 4551
        // Electric Blue & Industrial Diesel Smoke
// line 4552
        pColor = packageCombo > 0 
// line 4553
          ? (Math.random() < 0.6 ? 'rgba(56, 189, 248, 0.85)' : '#7dd3fc') 
// line 4554
          : 'rgba(148, 163, 184, 0.45)';
// line 4555
        pSize = Math.random() * 3 + 2;
// line 4556
        pLife = 0.35;
// line 4557
      }
// line 4558
      spawnParticle(exX, exY, evx, evy, pLife, pSize, pColor);
// line 4559
    }
// line 4560
  }
// line 4561

// line 4562
  // Age skid marks
// line 4563
  for (let i = skidMarks.length - 1; i >= 0; i--) {
// line 4564
    skidMarks[i].life -= dt;
// line 4565
    if (skidMarks[i].life <= 0) skidMarks.splice(i, 1);
// line 4566
  }
// line 4567

// line 4568
  // Motor Sound Pitch
// line 4569
  const spdRatio = Math.min(1.0, Math.hypot(player.vx, player.vy) / 4.0);
// line 4570
  sounds.updateMotor(spdRatio, player.isForklift);
// line 4571
  if (!player.isForklift && moveLen > 0.05 && Math.random() < 0.15) {
// line 4572
      if ((gameTime * 10) % 2 < 0.5) sounds.footstep();
// line 4573
  }
// line 4574

// line 4575
  // Skill cooldowns
// line 4576
  if (player.skillCooldown > 0) {
// line 4577
    player.skillCooldown -= dt;
// line 4578
    dashCd.style.display = 'flex';
// line 4579
    dashCd.innerText = Math.ceil(player.skillCooldown) + 's';
// line 4580
  } else {
// line 4581
    dashCd.style.display = 'none';
// line 4582
  }
// line 4583

// line 4584
  if (player.detentionCooldown > 0) {
// line 4585
    player.detentionCooldown -= dt;
// line 4586
    if (detentionCd) {
// line 4587
      detentionCd.style.display = 'flex';
// line 4588
      detentionCd.innerText = Math.ceil(player.detentionCooldown) + 's';
// line 4589
    }
// line 4590
  } else if (detentionCd) {
// line 4591
    detentionCd.style.display = 'none';
// line 4592
  }
// line 4593

// line 4594
  if (player.dashTimer > 0) {
// line 4595
    player.dashTimer -= dt;
// line 4596
    if (player.dashTimer <= 0) player.isDashing = false;
// line 4597
  }
// line 4598
  if (player.invulnTimer > 0) player.invulnTimer -= dt;
// line 4599
  if (player.goldenForkliftTimer > 0) {
// line 4600
      player.goldenForkliftTimer -= dt;
// line 4601
      player.stamina = player.maxStamina;
// line 4602
      player.speed = 320;
// line 4603
      createSparks(player.x, player.y, 2, '#facc15');
// line 4604
      // Ram enemies automatically
// line 4605
      enemies.forEach(en => {
// line 4606
         if (Math.hypot(en.x - player.x, en.y - player.y) < player.radius + en.radius + 15) {
// line 4607
             damageEnemy(en, 300);
// line 4608
             createSparks(en.x, en.y, 15, '#facc15');
// line 4609
             screenShake = Math.max(screenShake, 4);
// line 4610
         }
// line 4611
      });
// line 4612
  }
// line 4613
  if (player.discoTimer > 0) {
// line 4614
      player.discoTimer -= dt;
// line 4615
      player.attackSpeedMult = 1.6;
// line 4616
      if (Math.random() < 0.2) {
// line 4617
          spawnParticle(player.x + (Math.random()-0.5)*40, player.y + (Math.random()-0.5)*40, 0, -30, 0.4, 3, '#a855f7');
// line 4618
      }
// line 4619
  }
// line 4620

// line 4621
  // Battery drain & critical check
// line 4622
  player.battery -= dt * 0.45; // ~225 sec baseline
// line 4623
  if (player.regenRate) {
// line 4624
    player.battery = Math.min(player.maxBattery, player.battery + player.regenRate * dt);
// line 4625
  }
// line 4626

// line 4627
  // Freezer Heaters Area Check (Freezer -25°C Arena)
// line 4628
  for (let i = 0; i < warehouseHeaters.length; i++) {
// line 4629
    const h = warehouseHeaters[i];
// line 4630
    if (Math.hypot(player.x - h.x, player.y - h.y) < h.radius) {
// line 4631
      player.battery = Math.min(player.maxBattery, player.battery + dt * 14.0);
// line 4632
      if (Math.random() < 0.25) spawnParticle(player.x, player.y - 10, (Math.random()-0.5)*15, -20, 0.4, 3, '#f59e0b');
// line 4633
    }
// line 4634
  }
// line 4635

// line 4636
  // Cross-Dock Conveyor Belt Push Physics (Player & Items)
// line 4637
  for (let i = 0; i < warehouseConveyors.length; i++) {
// line 4638
    const cb = warehouseConveyors[i];
// line 4639
    if (player.x >= cb.x && player.x <= cb.x + cb.w && player.y >= cb.y && player.y <= cb.y + cb.h) {
// line 4640
      player.x += cb.vx * dt;
// line 4641
      player.y += cb.vy * dt;
// line 4642
    }
// line 4643
  }
// line 4644

// line 4645
  if (player.battery <= 10) {
// line 4646
    lowBatteryTimer += dt;
// line 4647
    if (lowBatteryTimer >= 15) triggerAchievement('battery_critical', 'Na Oparach Prądu', '⚡');
// line 4648
  } else {
// line 4649
    lowBatteryTimer = 0;
// line 4650
  }
// line 4651

// line 4652
  if (player.battery <= 0) {
// line 4653
    if (passives.umowa && passives.umowa.level > 0 && !player.extraLifeUsed) {
// line 4654
      player.extraLifeUsed = true;
// line 4655
      player.battery = player.maxBattery;
// line 4656
      player.invulnTimer = 3.5;
// line 4657
      screenShake = 20;
// line 4658
      sounds.bossAlert();
// line 4659
      showAnnouncement("📜 UMOWA BEZTERMINOWA: OCHRONA PRZED ŚMIERCIĄ!", "#22c55e");
// line 4660
      addSpeechBubble(player.x, player.y - 40, '📜 OCHRONA UMOWY! PEŁNA REGENERACJA!', '#22c55e');
// line 4661
      createSparks(player.x, player.y, 60, '#22c55e');
// line 4662
      enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
// line 4663
    } else {
// line 4664
      gameOver(timeStr, false);
// line 4665
      return;
// line 4666
    }
// line 4667
  }
// line 4668
  if (mysteryTimer > 0) {
// line 4669
    mysteryTimer -= dt;
// line 4670
    if (mysteryTimer <= 0) {
// line 4671
       mysteryActive = ''; mysteryBuffMultiplier = 1.0;
// line 4672
       showAnnouncement("NADGODZINY ZAKOŃCZONE!", "#94a3b8");
// line 4673
    }
// line 4674
  }
// line 4675
  if (gameTime >= TOTAL_SHIFT_DURATION && selectedGameMode !== 'endless') {
// line 4676
    gameOver(timeStr, true);
// line 4677
    return;
// line 4678
  }
// line 4679

// line 4680
  // Smooth Camera Follow with Perspective Zoom
// line 4681
  const viewW = gameWidth / camera.zoom;
// line 4682
  const viewH = gameHeight / camera.zoom;
// line 4683
  const camLerp = 1 - Math.exp(-9.0 * dt);
// line 4684
  camera.x += (player.x - viewW / 2 - camera.x) * camLerp;
// line 4685
  camera.y += (player.y - viewH / 2 - camera.y) * camLerp;
// line 4686
  if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 15);
// line 4687

// line 4688
  // Spawning Schedule (Tuned Vampire Survivors pace)
// line 4689
  spawnClock += dt;
// line 4690
  if (spawnClock >= Math.max(0.9, 1.6 - (gameTime / TOTAL_SHIFT_DURATION) * 0.7)) {
// line 4691
    spawnClock = 0;
// line 4692
    spawnBatchByTime(currentMinutes);
// line 4693
  }
// line 4694

// line 4695
  // Boss Timers
// line 4696
  if (currentMinutes >= 5 * 60 && !bossFlags.grzesiek) {
// line 4697
    bossFlags.grzesiek = true;
// line 4698
    spawnEnemy('BOSS_KAS', true);
// line 4699
  }
// line 4700
  if (currentMinutes >= 6 * 60 + 20 && !bossFlags.kontener) {
// line 4701
    bossFlags.kontener = true;
// line 4702
    spawnEnemy('BOSS_KONTENER', true);
// line 4703
  }
// line 4704

// line 4705
  // Update Weapons
// line 4706
  updateWeapons(dt);
// line 4707

// line 4708
  // Update Enemies AI, Movement & Flocking
// line 4709
  for (let i = enemies.length - 1; i >= 0; i--) {
// line 4710
    const e = enemies[i];
// line 4711
    if (e.dead) { enemies.splice(i, 1); continue; }
// line 4712

// line 4713
    if (e.hitFlash > 0) e.hitFlash -= dt;
// line 4714
    if (e.slowTimer > 0) e.slowTimer -= dt;
// line 4715

// line 4716
    const dx = player.x - e.x;
// line 4717
    const dy = player.y - e.y;
// line 4718
    const dist = Math.hypot(dx, dy);
// line 4719

// line 4720
    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0) * mysteryBuffMultiplier;
// line 4721
    if (e.stunTimer && e.stunTimer > 0) { e.stunTimer -= dt; spd = 0; }
// line 4722
    
// line 4723
    if (e.info.straightLine) {
// line 4724
      e.x += (e.vx || 1) * spd * dt;
// line 4725
      e.y += (e.vy || 0) * spd * dt;
// line 4726
      if (Math.random() < 0.05) createSparks(e.x, e.y, 2, '#ea580c'); // Beep warning visual
// line 4727
    } else {
// line 4728
      let currentDx = (dx / (dist || 1));
// line 4729
      let currentDy = (dy / (dist || 1));
// line 4730
      
// line 4731
      if (e.info.canDash) {
// line 4732
         e.dashTimer = (e.dashTimer || 4.0) - dt;
// line 4733
         if (e.dashTimer < 0) {
// line 4734
           e.dashTimer = 4.0;
// line 4735
           e.isDashing = 0.6; // Dash lasts 0.6s
// line 4736
           e.vx = currentDx; e.vy = currentDy;
// line 4737
         }
// line 4738
         if (e.isDashing > 0) {
// line 4739
           e.isDashing -= dt;
// line 4740
           spd *= 1.85;
// line 4741
           currentDx = e.vx; currentDy = e.vy;
// line 4742
         } else {
// line 4743
           // Smooth Zig-zag
// line 4744
           const zig = Math.sin(gameTime * 4 + e.x * 0.01) * 0.4;
// line 4745
           currentDx = currentDx * 0.8 + currentDy * zig;
// line 4746
           currentDy = currentDy * 0.8 - currentDx * zig;
// line 4747
         }
// line 4748
      }
// line 4749
      
// line 4750
      if (dist > 5) {
// line 4751
        e.x += currentDx * spd * dt;
// line 4752
        e.y += currentDy * spd * dt;
// line 4753
      }
// line 4754

// line 4755
      // Soft flocking repulsion to prevent enemy clumping
// line 4756
      for (let j = i - 1; j >= 0 && j >= i - 8; j--) {
// line 4757
        const other = enemies[j];
// line 4758
        if (other.dead) continue;
// line 4759
        const sepDx = e.x - other.x;
// line 4760
        const sepDy = e.y - other.y;
// line 4761
        const minD = (e.info.radius + other.info.radius) * 0.95;
// line 4762
        const dSq = sepDx * sepDx + sepDy * sepDy;
// line 4763
        if (dSq < minD * minD && dSq > 0.01) {
// line 4764
          const d = Math.sqrt(dSq);
// line 4765
          const push = (minD - d) * 0.45 * (dt * 15);
// line 4766
          const nx = sepDx / d;
// line 4767
          const ny = sepDy / d;
// line 4768
          e.x += nx * push;
// line 4769
          e.y += ny * push;
// line 4770
          other.x -= nx * push;
// line 4771
          other.y -= ny * push;
// line 4772
        }
// line 4773
      }
// line 4774
    }
// line 4775
    
// line 4776
    // Shooter Logic
// line 4777
    if (e.info.shooter) {
// line 4778
       e.shootTimer = (e.shootTimer || 3.5) - dt;
// line 4779
       if (e.shootTimer <= 0) {
// line 4780
          e.shootTimer = 3.5;
// line 4781
          const a = Math.atan2(dy, dx);
// line 4782
          projectiles.push({ type: 'enemy_shoot', x: e.x, y: e.y, vx: Math.cos(a) * 260, vy: Math.sin(a) * 260, life: 2.5, rot: a });
// line 4783
       }
// line 4784
    }
// line 4785

// line 4786
    // Boss Mechanics
// line 4787
    if (e.info.mechanics === 'kas_zone') {
// line 4788
       if (!e.kasTimer) e.kasTimer = 10.0;
// line 4789
       e.kasTimer -= dt;
// line 4790
       if (e.kasTimer <= 0) {
// line 4791
          e.kasTimer = 15.0;
// line 4792
          projectiles.push({ type: 'kas_red_zone', x: player.x, y: player.y, radius: 180, life: 5.0, timer: 5.0 });
// line 4793
          addSpeechBubble(e.x, e.y - 30, '🚨 REWIZJA SZCZEGÓŁOWA!', '#ef4444');
// line 4794
       }
// line 4795
    } else if (e.info.mechanics === 'spawner') {
// line 4796
       // Kontenerowiec sits near top
// line 4797
       e.y = camera.y + 100;
// line 4798
       e.x = camera.x + viewW / 2 + Math.sin(gameTime) * 200;
// line 4799
       if (!e.spawnTimer) e.spawnTimer = 3.0;
// line 4800
       e.spawnTimer -= dt;
// line 4801
       if (e.spawnTimer <= 0) {
// line 4802
          e.spawnTimer = 4.0;
// line 4803
          spawnEnemy('KARTON_B2C');
// line 4804
          spawnEnemy('FOLIA');
// line 4805
          spawnEnemy('KIEROWCA_TIR');
// line 4806
       }
// line 4807
    }
// line 4808
    
// line 4809
    // Special attacks & speech
// line 4810
    e.quoteTimer = (e.quoteTimer || (Math.random() * 8 + 5)) - dt;
// line 4811
    if (e.quoteTimer <= 0 && e.info.quotes) {
// line 4812
      e.quoteTimer = Math.random() * 8 + 5;
// line 4813
      const q = e.info.quotes[Math.floor(Math.random() * e.info.quotes.length)];
// line 4814
      addSpeechBubble(e.x, e.y - 25, q, e.isBoss ? '#ef4444' : '#ffffff');
// line 4815
    }
// line 4816

// line 4817
    // Touch Player Collision
// line 4818
    if (dist < player.radius + e.info.radius) {
// line 4819
      if (player.isDashing || weapons.pallets.isEvo) {
// line 4820
        damageEnemy(e, weapons.pallets.isEvo ? 80 : 140);
// line 4821
        createSparks(e.x, e.y, 10, '#f97316');
// line 4822
        if (weapons.pallets.isEvo && !e.isBoss) e.dead = true; // Auto kill small enemies when evo
// line 4823
      } else if (player.invulnTimer <= 0) {
// line 4824
        if (player.dodgeChance && Math.random() < player.dodgeChance) {
// line 4825
          spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
// line 4826
          player.invulnTimer = 0.2;
// line 4827
        } else {
// line 4828
          sounds.hit();
// line 4829
          player.invulnTimer = 0.6;
// line 4830
          screenShake = 5;
// line 4831
          const dmg = e.isBoss ? 16 : 8;
// line 4832
          player.battery = Math.max(0, player.battery - dmg);
// line 4833
          if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(40);
// line 4834
        }
// line 4835
      }
// line 4836
    }
// line 4837
  }
// line 4838

// line 4839
  // Update Kluska Companion
// line 4840
  updateKluska(dt);
// line 4841

// line 4842
  // Update Breakable Map Props
// line 4843
  updateMapProps(dt);
// line 4844

// line 4845
  // Player forklift/dash smash into mapProps
// line 4846
  for (let k = 0; k < mapProps.length; k++) {
// line 4847
    const prop = mapProps[k];
// line 4848
    if (prop.dead) continue;
// line 4849
    const pDist = Math.hypot(prop.x - player.x, prop.y - player.y);
// line 4850
    if (pDist < prop.radius + player.radius + 8) {
// line 4851
      if (player.isForklift || player.isDashing) {
// line 4852
        damageProp(prop, 100);
// line 4853
        sounds.hit();
// line 4854
        screenShake = Math.max(screenShake, 6);
// line 4855
      }
// line 4856
    }
// line 4857
  }
// line 4858

// line 4859
  // Update Projectiles
// line 4860
  for (let i = projectiles.length - 1; i >= 0; i--) {
// line 4861
    const p = projectiles[i];
// line 4862
    p.life -= dt;
// line 4863
    if (p.life <= 0) {
// line 4864
       if (p.type === 'kas_red_zone') {
// line 4865
          createSparks(p.x, p.y, 40, '#ef4444');
// line 4866
          if (Math.hypot(player.x - p.x, player.y - p.y) > p.radius) {
// line 4867
             player.battery = Math.max(0, player.battery - player.maxBattery * 0.5);
// line 4868
             addSpeechBubble(player.x, player.y, 'KARA KAS!', '#ef4444');
// line 4869
          }
// line 4870
       }
// line 4871
       projectiles.splice(i, 1); continue; 
// line 4872
    }
// line 4873

// line 4874
    // Check collision against breakable mapProps
// line 4875
    if (p.type !== 'kas_red_zone' && p.type !== 'enemy_shoot' && p.type !== 'oil_trail') {
// line 4876
      for (let k = 0; k < mapProps.length; k++) {
// line 4877
        const prop = mapProps[k];
// line 4878
        if (prop.dead) continue;
// line 4879
        if (Math.hypot(prop.x - p.x, prop.y - p.y) < prop.radius + 14) {
// line 4880
          damageProp(prop, p.damage || 35);
// line 4881
          if (p.type !== 'cutter' && p.type !== 'gas_cloud') {
// line 4882
            p.life = 0;
// line 4883
            break;
// line 4884
          }
// line 4885
        }
// line 4886
      }
// line 4887
    }
// line 4888

// line 4889
    if (p.type === 'pallet') {
// line 4890
      p.x += p.vx * dt;
// line 4891
      p.y += p.vy * dt;
// line 4892
      p.rot = (p.rot || 0) + 12.0 * dt;
// line 4893
      for (let j = 0; j < enemies.length; j++) {
// line 4894
        const e = enemies[j];
// line 4895
        if (e.dead) continue;
// line 4896
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 18) {
// line 4897
          damageEnemy(e, p.damage);
// line 4898
          createSparks(p.x, p.y, 6, '#d97706');
// line 4899
          p.life = 0;
// line 4900
          break;
// line 4901
        }
// line 4902
      }
// line 4903
    } else if (p.type === 'gas_cloud') {
// line 4904
      p.x += p.vx * dt;
// line 4905
      p.y += p.vy * dt;
// line 4906
      p.radius = Math.min(p.maxRadius, p.radius + dt * 30);
// line 4907
      for (let j = 0; j < enemies.length; j++) {
// line 4908
        const e = enemies[j];
// line 4909
        if (e.dead) continue;
// line 4910
        if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
// line 4911
          damageEnemy(e, p.damage * dt * 2.5);
// line 4912
          e.slowTimer = 3.5;
// line 4913
        }
// line 4914
      }
// line 4915
    } else if (p.type === 'metal_bb') {
// line 4916
      p.x += p.vx * dt;
// line 4917
      p.y += p.vy * dt;
// line 4918
      for (let j = 0; j < enemies.length; j++) {
// line 4919
        const e = enemies[j];
// line 4920
        if (e.dead) continue;
// line 4921
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 8) {
// line 4922
          damageEnemy(e, p.damage);
// line 4923
          createSparks(p.x, p.y, 6, '#cbd5e1');
// line 4924
          sounds.beep();
// line 4925
          p.pierce = (p.pierce || 3) - 1;
// line 4926
          if (p.pierce <= 0) { p.life = 0; break; }
// line 4927
        }
// line 4928
      }
// line 4929
    } else if (p.type === 'oil_trail') {
// line 4930
      if (Math.random() < 0.2) {
// line 4931
        for (let j = 0; j < enemies.length; j++) {
// line 4932
           if (enemies[j].dead) continue;
// line 4933
           if (Math.hypot(enemies[j].x - p.x, enemies[j].y - p.y) < 30) {
// line 4934
              damageEnemy(enemies[j], p.damage);
// line 4935
              enemies[j].slowTimer = 2.0;
// line 4936
           }
// line 4937
        }
// line 4938
      }
// line 4939
    } else if (p.type === 'enemy_shoot') {
// line 4940
      p.x += p.vx * dt;
// line 4941
      p.y += p.vy * dt;
// line 4942
      if (Math.hypot(player.x - p.x, player.y - p.y) < player.radius + 10) {
// line 4943
        if (player.invulnTimer <= 0) {
// line 4944
          if (player.dodgeChance && Math.random() < player.dodgeChance) {
// line 4945
          spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
// line 4946
        } else {
// line 4947
          sounds.hit();
// line 4948
          player.invulnTimer = 0.5;
// line 4949
          player.battery = Math.max(0, player.battery - 12);
// line 4950
          addSpeechBubble(player.x, player.y - 20, '🛑 BRAK SAD-u!', '#ef4444');
// line 4951
        }
// line 4952
        }
// line 4953
        p.life = 0;
// line 4954
      }
// line 4955
    } else if (p.type === 'zip_tie') {
// line 4956
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot = (p.rot || 0) + 15.0 * dt;
// line 4957
      for (let j = 0; j < enemies.length; j++) {
// line 4958
        const e = enemies[j];
// line 4959
        if (e.dead) continue;
// line 4960
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 12) {
// line 4961
          damageEnemy(e, p.damage);
// line 4962
          e.slowTimer = p.isEvo ? 6.0 : 4.0;
// line 4963
          createSparks(p.x, p.y, 4, '#38bdf8');
// line 4964
          p.life = 0; break;
// line 4965
        }
// line 4966
      }
// line 4967
    } else if (p.type === 'cutter') {
// line 4968
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot = (p.rot || 0) + 20.0 * dt;
// line 4969
      for (let j = 0; j < enemies.length; j++) {
// line 4970
        const e = enemies[j];
// line 4971
        if (e.dead) continue;
// line 4972
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 10) {
// line 4973
          damageEnemy(e, p.damage);
// line 4974
          createSparks(p.x, p.y, 8, '#f43f5e');
// line 4975
          p.pierce = (p.pierce || 0) + 1;
// line 4976
          if (p.pierce > (p.isEvo ? 6 : 2)) p.life = 0;
// line 4977
        }
// line 4978
      }
// line 4979
    } else if (p.type === 'toilet_paper') {
// line 4980
      p.x += p.vx * dt;
// line 4981
      p.y += p.vy * dt;
// line 4982
      p.vx *= Math.pow(0.96, dt * 60);
// line 4983
      p.vy *= Math.pow(0.96, dt * 60);
// line 4984
      p.rot = (p.rot || 0) + 14.0 * dt;
// line 4985
      for (let j = 0; j < enemies.length; j++) {
// line 4986
        const e = enemies[j];
// line 4987
        if (e.dead) continue;
// line 4988
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 14) {
// line 4989
          if (p.isEvo) {
// line 4990
             damageEnemy(e, p.damage * 2);
// line 4991
             createSparks(e.x, e.y, 16, '#fef08a');
// line 4992
             e.stunTimer = 3.0;
// line 4993
          } else {
// line 4994
             damageEnemy(e, p.damage);
// line 4995
             e.slowTimer = 1.8;
// line 4996
          }
// line 4997
          createSparks(p.x, p.y, 8, '#f8fafc');
// line 4998
          p.life = 0;
// line 4999
          break;
// line 5000
        }
// line 5001
      }
// line 5002
    } else if (p.type === 'box_mortar') {
// line 5003
      p.progress += dt * p.speed;
// line 5004
      if (p.progress >= 1) {
// line 5005
        sounds.pallet();
// line 5006
        createSparks(p.targetX, p.targetY, 20, '#f59e0b');
// line 5007
        for (let j = 0; j < enemies.length; j++) {
// line 5008
          const e = enemies[j];
// line 5009
          if (e.dead) continue;
// line 5010
          if (Math.hypot(e.x - p.targetX, e.y - p.targetY) < 110) {
// line 5011
            damageEnemy(e, p.damage);
// line 5012
          }
// line 5013
        }
// line 5014
        for (let k = 0; k < mapProps.length; k++) {
// line 5015
          const prop = mapProps[k];
// line 5016
          if (prop.dead) continue;
// line 5017
          if (Math.hypot(prop.x - p.targetX, prop.y - p.targetY) < 110) {
// line 5018
            damageProp(prop, p.damage);
// line 5019
          }
// line 5020
        }
// line 5021
        projectiles.splice(i, 1);
// line 5022
      }
// line 5023
    } else if (p.type === 'faktura') {
// line 5024
      p.x += p.vx * dt;
// line 5025
      p.y += p.vy * dt;
// line 5026
      p.angle += p.rotSpeed * dt;
// line 5027
      let hit = false;
// line 5028
      for (let j = 0; j < enemies.length; j++) {
// line 5029
        const e = enemies[j];
// line 5030
        if (!p.hitList) p.hitList = [];
// line 5031
        if (p.hitList.includes(e.id)) continue;
// line 5032
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 15) {
// line 5033
          takeDamage(e, p.damage);
// line 5034
          p.hitList.push(e.id);
// line 5035
          spawnParticle(p.x, p.y, -p.vx * 0.2, -p.vy * 0.2, 0.2, 2, '#fff');
// line 5036
          p.pierce--;
// line 5037
          if (p.pierce <= 0) { hit = true; break; }
// line 5038
        }
// line 5039
      }
// line 5040
      if (hit) projectiles.splice(i, 1);
// line 5041
    } else if (p.type === 'faktura') {
// line 5042
      ctx.save();
// line 5043
      ctx.translate(p.x, p.y);
// line 5044
      ctx.rotate(p.angle);
// line 5045
      ctx.fillStyle = '#f8fafc';
// line 5046
      ctx.fillRect(-10, -14, 20, 28);
// line 5047
      ctx.fillStyle = '#dc2626';
// line 5048
      ctx.font = 'bold 8px Arial';
// line 5049
      ctx.fillText('KOREKTA', -9, -4);
// line 5050
      ctx.fillStyle = '#0f172a';
// line 5051
      ctx.fillRect(-8, 2, 16, 2);
// line 5052
      ctx.fillRect(-8, 6, 12, 2);
// line 5053
      ctx.restore();
// line 5054
    } else if (p.type === 'staple') {
// line 5055
      p.x += p.vx * dt;
// line 5056
      p.y += p.vy * dt;
// line 5057
      p.rot = (p.rot || 0);
// line 5058
      for (let j = 0; j < enemies.length; j++) {
// line 5059
        const e = enemies[j];
// line 5060
        if (e.dead) continue;
// line 5061
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 8) {
// line 5062
          damageEnemy(e, p.damage);
// line 5063
          createSparks(p.x, p.y, 4, p.isEvo ? '#f59e0b' : '#38bdf8');
// line 5064
          p.life = 0;
// line 5065
          break;
// line 5066
        }
// line 5067
      }
// line 5068
    } else if (p.type === 'shockwave') {
// line 5069
      p.radius += (p.maxRadius - p.radius) * (dt * 12);
// line 5070
    }
// line 5071
  }
// line 5072

// line 5073
  // Update Drop Items & Magnet
// line 5074
  const magnetSpeed = (320 + player.magnetRange * 0.8) * dt;
// line 5075
  for (let i = dropItems.length - 1; i >= 0; i--) {
// line 5076
    const item = dropItems[i];
// line 5077
    const dx = player.x - item.x;
// line 5078
    const dy = player.y - item.y;
// line 5079
    const dist = Math.hypot(dx, dy);
// line 5080

// line 5081
    if (dist < player.magnetRange && dist > 1) {
// line 5082
      // Exponential succ - starts slow, gets extremely fast
// line 5083
      const succFactor = Math.pow(1.0 - (dist / player.magnetRange), 2.5);
// line 5084
      const dynamicSpeed = magnetSpeed + (succFactor * magnetSpeed * 6.0);
// line 5085
      item.x += (dx / dist) * dynamicSpeed;
// line 5086
      item.y += (dy / dist) * dynamicSpeed;
// line 5087
      
// line 5088
      // Visual trail
// line 5089
      if (Math.random() < 0.25) {
// line 5090
         createSparks(item.x, item.y, 1, item.type === 'barcode_xp' ? '#60a5fa' : '#facc15');
// line 5091
      }
// line 5092
    }
// line 5093

// line 5094
    if (dist < player.radius + 18) {
// line 5095
      packageCombo++;
// line 5096
      packageComboTimer = 3.2;
// line 5097
      if (packageCombo > maxPackageCombo) maxPackageCombo = packageCombo;
// line 5098
      const packageMultiplier = 1.0 + (packageCombo * 0.15);
// line 5099

// line 5100
      if (item.type === 'lucky_chest') {
// line 5101
        openLuckyChest(item.val || 1);
// line 5102
      } else if (item.type === 'dta_coin') {
// line 5103
        const cVal = item.val || 25;
// line 5104
        dtaCoins += cVal;
// line 5105
        saveWorkshopData();
// line 5106
        sounds.xp();
// line 5107
        score += cVal * 10;
// line 5108
        addSpeechBubble(player.x, player.y - 25, `+💰 ${cVal} MONET DTA`, '#facc15');
// line 5109
      } else if (item.type === 'golden_forklift') {
// line 5110
        sounds.achieve();
// line 5111
        screenShake = 15;
// line 5112
        player.goldenForkliftTimer = 12.0;
// line 5113
        player.invulnTimer = 12.0;
// line 5114
        player.stamina = player.maxStamina;
// line 5115
        createSparks(player.x, player.y, 50, '#facc15');
// line 5116
        addSpeechBubble(player.x, player.y - 45, '🌟 ZŁOTY WÓZEK BT OVERDRIVE (12s)! 🚜', '#facc15');
// line 5117
        showAnnouncement("🌟 ZŁOTY MECHA-WÓZEK BT ACTIVATED!", "#facc15");
// line 5118
      } else if (item.type === 'boombox_radio') {
// line 5119
        sounds.achieve();
// line 5120
        screenShake = 8;
// line 5121
        player.discoTimer = 15.0;
// line 5122
        addSpeechBubble(player.x, player.y - 35, '📻 DYSKOTEKA WMS 80s! BUFF SZYBKOŚCI (15s)! 🎶', '#a855f7');
// line 5123
        showAnnouncement("📻 DYSKOTEKA WMS: +50% SZYBKOŚCI!", "#a855f7");
// line 5124
      } else if (item.type === 'cargo_mystery') {
// line 5125
        sounds.achieve();
// line 5126
        screenShake = 12;
// line 5127
        const roll = Math.random();
// line 5128
        if (roll < 0.25) {
// line 5129
            showAnnouncement("🌟 SKRZYNY SUKCESU: ZŁOTY WÓZEK BT!", "#facc15");
// line 5130
            player.goldenForkliftTimer = 12.0;
// line 5131
            player.invulnTimer = 12.0;
// line 5132
            player.stamina = player.maxStamina;
// line 5133
        } else if (roll < 0.50) {
// line 5134
            showAnnouncement("💣 TOTALNA CZYSTKA RAMPIARZY (NUKE)!", "#ef4444");
// line 5135
            enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
// line 5136
            createSparks(player.x, player.y, 80, '#ef4444');
// line 5137
        } else if (roll < 0.75) {
// line 5138
            showAnnouncement("💰 BONANZA MONET DTA (+500 MONET)!", "#38bdf8");
// line 5139
            dtaCoins += 500;
// line 5140
            saveWorkshopData();
// line 5141
        } else {
// line 5142
            showAnnouncement("⚡ EKSTRA LEVEL UP!", "#22c55e");
// line 5143
            currentXP += neededXP;
// line 5144
            checkLevelUp();
// line 5145
        }
// line 5146
      } else if (item.type === 'golden_velvet') {
// line 5147
        sounds.achieve();
// line 5148
        screenShake = 10;
// line 5149
        player.invulnTimer = 10.0;
// line 5150
        player.stamina = player.maxStamina;
// line 5151
        createSparks(player.x, player.y, 40, '#facc15');
// line 5152
        addSpeechBubble(player.x, player.y - 40, '🌟 NIEŚMIERTELNOŚĆ VELVET OVERDRIVE (10s)!', '#facc15');
// line 5153
      } else if (item.type === 'barcode_xp') {
// line 5154
        const earnedXP = Math.floor(item.val * (1 + packageCombo * 0.04));
// line 5155
        currentXP += earnedXP;
// line 5156
        const pts = Math.floor(item.val * 15 * packageMultiplier);
// line 5157
        score += pts;
// line 5158
        sounds.xp();
// line 5159
        checkLevelUp();
// line 5160
      } else if (item.type === 'pizza_szefa') {
// line 5161
        score += 1000;
// line 5162
        sounds.achieve();
// line 5163
        addSpeechBubble(player.x, player.y - 25, '🍕 PIZZA OD SZEFA! LEVEL UP!', '#ef4444');
// line 5164
        currentXP += neededXP;
// line 5165
        checkLevelUp();
// line 5166
      } else if (item.type === 'hotdog') {
// line 5167
        player.battery = Math.min(player.maxBattery, player.battery + 25);
// line 5168
        score += Math.floor(150 * packageMultiplier);
// line 5169
        sounds.achieve();
// line 5170
        addSpeechBubble(player.x, player.y - 25, '🌭 HOTDOG Z ŻABKI! +25% ⚡', '#4ade80');
// line 5171
      } else if (item.type === 'kinder_bueno') {
// line 5172
        player.battery = player.maxBattery;
// line 5173
        currentXP += Math.floor(50 * (1 + packageCombo * 0.05));
// line 5174
        score += Math.floor(350 * packageMultiplier);
// line 5175
        sounds.achieve();
// line 5176
        triggerAchievement('kinder_defender', 'Obrońca Kinder Bueno', '🍫');
// line 5177
        addSpeechBubble(player.x, player.y - 30, '🍫 KINDER BUENO ODNALEZIONE!', '#fbbf24');
// line 5178
        checkLevelUp();
// line 5179
      } else if (item.type === 'mystery_box') {
// line 5180
        const roll = Math.random();
// line 5181
        sounds.achieve();
// line 5182
        if (roll < 0.20) {
// line 5183
          showAnnouncement("BEZPŁATNE NADGODZINY!", "#ef4444");
// line 5184
          mysteryActive = 'nadgodziny'; mysteryTimer = 15; mysteryBuffMultiplier = 1.7;
// line 5185
          player.stamina = Math.max(0, player.stamina - 40);
// line 5186
        } else if (roll < 0.40) {
// line 5187
          showAnnouncement("KASK BHP: NIEŚMIERTELNOŚĆ!", "#facc15");
// line 5188
          player.invulnTimer = 10;
// line 5189
        } else if (roll < 0.60) {
// line 5190
          showAnnouncement("KONTROLA JAKOŚCI: CZYSTKA!", "#38bdf8");
// line 5191
          enemies.forEach(en => { if (!en.isBoss) en.hp = 0; });
// line 5192
        } else if (roll < 0.80) {
// line 5193
          showAnnouncement("PREMIA UZNANIOWA: WYSYP XP!", "#22c55e");
// line 5194
          for (let k = 0; k < 25; k++) {
// line 5195
             dropItems.push({ x: player.x + (Math.random()-0.5)*150, y: player.y + (Math.random()-0.5)*150, type: 'barcode_xp', val: 50, life: 30 });
// line 5196
          }
// line 5197
        } else {
// line 5198
          showAnnouncement("ZŁOTY KOD: COMBO x30!", "#c084fc");
// line 5199
          packageCombo = 30; packageComboTimer = 5;
// line 5200
        }
// line 5201
      } else if (item.type === 'coffee_thermos') {
// line 5202
        player.skillCooldown = 0;
// line 5203
        score += Math.floor(200 * packageMultiplier);
// line 5204
        sounds.achieve();
// line 5205
        addSpeechBubble(player.x, player.y - 25, '☕ TERMOS KAWY! SKILL READY!', '#f97316');
// line 5206
      }
// line 5207

// line 5208
      dropItems.splice(i, 1);
// line 5209
      continue;
// line 5210
    }
// line 5211
  }
// line 5212

// line 5213
  // Combo Milestones Floating Texts & Announcements
// line 5214
      if (packageCombo % 5 === 0 || packageCombo === 3 || packageCombo === 7) {
// line 5215
        spawnDamageNumber(player.x, player.y - 15, `🔥 PACZKI x${packageCombo}! (${packageMultiplier.toFixed(1)}x)`, true);
// line 5216
        createSparks(player.x, player.y, 14, packageCombo >= 15 ? '#38bdf8' : '#f59e0b');
// line 5217
        if (packageCombo === 10) {
// line 5218
          addSpeechBubble(player.x, player.y - 35, `⚡ TOYOTA BT TURBO SPEED! (${packageMultiplier.toFixed(1)}x PKT)`, '#fbbf24');
// line 5219
        } else if (packageCombo === 20) {
// line 5220
          addSpeechBubble(player.x, player.y - 35, `🚀 EKSPRESOWY ROZŁADUNEK x20! (${packageMultiplier.toFixed(1)}x PKT)`, '#38bdf8');
// line 5221
          triggerAchievement('fast_picker', 'Ekspresowy Magazynier x20', '📦');
// line 5222
        } else if (packageCombo === 30) {
// line 5223
          addSpeechBubble(player.x, player.y - 35, `👑 MISTRZ LOGISTYKI DTA x30! (${packageMultiplier.toFixed(1)}x PKT)`, '#c084fc');
// line 5224
        }
// line 5225
      }
// line 5226

// line 5227
      dropItems.splice(i, 1);
// line 5228
    }
// line 5229
  }
// line 5230

// line 5231
  // Update Speech Bubbles
// line 5232
  for (let i = speechBubbles.length - 1; i >= 0; i--) {
// line 5233
    speechBubbles[i].life -= dt;
// line 5234
    speechBubbles[i].y -= dt * 6;
// line 5235
    if (speechBubbles[i].life <= 0) speechBubbles.splice(i, 1);
// line 5236
  }
// line 5237

// line 5238
  // Update DOM HUD
// line 5239
  document.getElementById('badge-battery').innerText = `⚡ ${Math.ceil((player.battery / player.maxBattery) * 100)}%`;
// line 5240
  document.getElementById('badge-battery').className = 'stat-badge badge-battery' + (player.battery < 20 ? ' low' : '');
// line 5241
  document.getElementById('badge-clock').innerText = `🕒 ${timeStr}`;
// line 5242

// line 5243
  const totalCombo = Math.max(comboCount, packageCombo);
// line 5244
  const currentMult = (1 + packageCombo * 0.15).toFixed(1);
// line 5245
  const comboBadge = document.getElementById('badge-combo');
// line 5246
  if (packageCombo > 0) {
// line 5247
    comboBadge.innerText = `🔥 COMBO x${totalCombo} (${currentMult}x PKT)`;
// line 5248
    comboBadge.className = 'stat-badge badge-combo' + (packageCombo >= 15 ? ' hyper' : packageCombo >= 5 ? ' turbo' : '');
// line 5249
  } else {
// line 5250
    comboBadge.innerText = `🔥 COMBO x${Math.max(1, comboCount)}`;
// line 5251
    comboBadge.className = 'stat-badge badge-combo';
// line 5252
  }
// line 5253

// line 5254
  document.getElementById('badge-lvl').innerText = `⭐ LVL ${playerLevel}`;
// line 5255
  document.getElementById('badge-kills').innerText = `💀 ${kills}`;
// line 5256
  document.getElementById('xp-fill').style.width = `${Math.min(100, (currentXP / neededXP) * 100)}%`;
// line 5257

// line 5258
  updateBossTopBar();
// line 5259
}
// line 5260

// line 5261
function spawnBatchByTime(minutes) {
// line 5262
  const sec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[0];
// line 5263
  const batchSize = Math.min(8, 2 + Math.floor(gameTime / 35) + currentSectorIndex);
// line 5264
  for (let i = 0; i < batchSize; i++) {
// line 5265
    const pool = sec.spawnPool;
// line 5266
    const type = pool[Math.floor(Math.random() * pool.length)];
// line 5267
    spawnEnemy(type);
// line 5268
  }
// line 5269
}
// line 5270

// line 5271
// --- RENDER PASS (ULTRA HIGH FIDELITY WAREHOUSE GRAPHICS) ---
// line 5272
function render() {
// line 5273
  const sec = WAREHOUSE_SECTORS[currentSectorIndex] || WAREHOUSE_SECTORS[0];
// line 5274
  ctx.save();
// line 5275
  ctx.fillStyle = sec.floorColor;
// line 5276
  ctx.fillRect(0, 0, gameWidth, gameHeight);
// line 5277

// line 5278
  const viewW = gameWidth / camera.zoom;
// line 5279
  const viewH = gameHeight / camera.zoom;
// line 5280
  const fontScale = 1.0 / camera.zoom;
// line 5281

// line 5282
  // Apply Camera Zoom & Shake & Translation
// line 5283
  ctx.scale(camera.zoom, camera.zoom);
// line 5284
  const shakeX = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
// line 5285
  const shakeY = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
// line 5286
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);
// line 5287

// line 5288
  // 1. Draw High-Contrast Epoxy Warehouse Floor Grid with Sector Styling
// line 5289
  ctx.strokeStyle = sec.gridColor;
// line 5290
  ctx.lineWidth = 1.2;
// line 5291
  const startX = Math.floor(camera.x / 120) * 120;
// line 5292
  const startY = Math.floor(camera.y / 120) * 120;
// line 5293
  for (let x = startX; x < camera.x + viewW + 120; x += 120) {
// line 5294
    ctx.beginPath(); ctx.moveTo(x, camera.y); ctx.lineTo(x, camera.y + viewH); ctx.stroke();
// line 5295
  }
// line 5296
  for (let y = startY; y < camera.y + viewH + 120; y += 120) {
// line 5297
    ctx.beginPath(); ctx.moveTo(camera.x, y); ctx.lineTo(camera.x + viewW, y); ctx.stroke();
// line 5298
  }
// line 5299

// line 5300
  // 2. Overhead Industrial Fluorescent Light Cones
// line 5301
  for (let i = 0; i < warehouseLights.length; i++) {
// line 5302
    const l = warehouseLights[i];
// line 5303
    if (l.x > camera.x - 180 && l.x < camera.x + viewW + 180 && l.y > camera.y - 180 && l.y < camera.y + viewH + 180) {
// line 5304
      const lampGrad = ctx.createRadialGradient(l.x, l.y, 10, l.x, l.y, 150);
// line 5305
      const intensity = 0.09 + Math.sin(gameTime * 3 + (l.flicker || 0) * 10) * 0.025;
// line 5306
      let parsedColor = `rgba(56, 189, 248, ${intensity})`;
// line 5307
      if (l.color && l.color.startsWith('#')) {
// line 5308
        let h = l.color;
// line 5309
        let r = parseInt(h.slice(1, 3), 16) || 255;
// line 5310
        let g = parseInt(h.slice(3, 5), 16) || 255;
// line 5311
        let b = parseInt(h.slice(5, 7), 16) || 255;
// line 5312
        parsedColor = `rgba(${r}, ${g}, ${b}, ${intensity})`;
// line 5313
      } else if (l.color) {
// line 5314
        parsedColor = l.color.replace('rgb(', 'rgba(').replace(')', `, ${intensity})`).replace('rgbaa', 'rgba');
// line 5315
      }
// line 5316
      lampGrad.addColorStop(0, parsedColor);
// line 5317
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
// line 5318
      ctx.fillStyle = lampGrad;
// line 5319
      ctx.beginPath(); ctx.arc(l.x, l.y, 150, 0, Math.PI * 2); ctx.fill();
// line 5320
    }
// line 5321
  }
// line 5322

// line 5323
  // 3. Coolant & Hydraulic Oil Puddles (Iridescent Sheen)
// line 5324
  for (let i = 0; i < warehousePuddles.length; i++) {
// line 5325
    const pud = warehousePuddles[i];
// line 5326
    if (pud.x > camera.x - 100 && pud.x < camera.x + viewW + 100 && pud.y > camera.y - 60 && pud.y < camera.y + viewH + 60) {
// line 5327
      ctx.fillStyle = pud.color;
// line 5328
      ctx.beginPath();
// line 5329
      ctx.ellipse(pud.x, pud.y, pud.rx, pud.ry, 0, 0, Math.PI * 2);
// line 5330
      ctx.fill();
// line 5331
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
// line 5332
      ctx.lineWidth = 1;
// line 5333
      ctx.stroke();
// line 5334
    }
// line 5335
  }
// line 5336

// line 5337
  // 3.4. Crimsonland Permanent Splatter Canvas (0 Extra Draw Calls)
// line 5338
  if (typeof splatterCanvas !== 'undefined') {
// line 5339
    ctx.drawImage(splatterCanvas, 0, 0);
// line 5340
  }
// line 5341
  updateAndRenderGibs(dt, ctx);
// line 5342
  updateAndRenderPowerUps(dt, ctx);
// line 5343
  updateAndRenderEnvironment(dt, ctx);
// line 5344
  
// line 5345
  // 3.5. Crimsonland Blood & Epoxy Stains
// line 5346
  for (let i = 0; i < bloodStains.length; i++) {
// line 5347
    const bs = bloodStains[i];
// line 5348
    if (bs.x > camera.x - 60 && bs.x < camera.x + viewW + 60 && bs.y > camera.y - 60 && bs.y < camera.y + viewH + 60) {
// line 5349
      ctx.save();
// line 5350
      ctx.translate(bs.x, bs.y);
// line 5351
      ctx.rotate(bs.rot);
// line 5352
      ctx.fillStyle = bs.color;
// line 5353
      ctx.globalAlpha = bs.life * 0.7;
// line 5354
      ctx.beginPath();
// line 5355
      ctx.ellipse(0, 0, bs.radius, bs.radius * 0.6, 0, 0, Math.PI * 2);
// line 5356
      ctx.fill();
// line 5357
      // Splatter dots
// line 5358
      ctx.beginPath();
// line 5359
      ctx.arc(bs.radius * 0.8, bs.radius * 0.4, bs.radius * 0.25, 0, Math.PI * 2);
// line 5360
      ctx.arc(-bs.radius * 0.7, -bs.radius * 0.3, bs.radius * 0.2, 0, Math.PI * 2);
// line 5361
      ctx.fill();
// line 5362
      ctx.globalAlpha = 1.0;
// line 5363
      ctx.restore();
// line 5364
    }
// line 5365
  }
// line 5366

// line 5367
  // 4. Industrial Floor Safety Lanes (DTA Forklift Highway)
// line 5368
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
// line 5369
  ctx.lineWidth = 4;
// line 5370
  ctx.setLineDash([24, 18]);
// line 5371
  for (let x = 620; x < ARENA_WIDTH; x += 520) {
// line 5372
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_HEIGHT); ctx.stroke();
// line 5373
  }
// line 5374
  ctx.setLineDash([]);
// line 5375

// line 5376
  // 4.5. Dynamic Conveyor Belts (Cross-Dock Arena)
// line 5377
  for (let i = 0; i < warehouseConveyors.length; i++) {
// line 5378
    const cb = warehouseConveyors[i];
// line 5379
    if (cb.x + cb.w > camera.x && cb.x < camera.x + viewW && cb.y + cb.h > camera.y && cb.y < camera.y + viewH) {
// line 5380
      ctx.fillStyle = '#1e293b';
// line 5381
      ctx.fillRect(cb.x, cb.y, cb.w, cb.h);
// line 5382
      ctx.strokeStyle = '#38bdf8';
// line 5383
      ctx.lineWidth = 2;
// line 5384
      ctx.strokeRect(cb.x, cb.y, cb.w, cb.h);
// line 5385

// line 5386
      // Rollers & animated directional arrows
// line 5387
      ctx.fillStyle = '#0f172a';
// line 5388
      const isHorizontal = Math.abs(cb.vx) > Math.abs(cb.vy);
// line 5389
      if (isHorizontal) {
// line 5390
        const offset = ((gameTime * cb.vx) % 24 + 24) % 24;
// line 5391
        for (let rx = cb.x + offset; rx < cb.x + cb.w; rx += 24) {
// line 5392
          ctx.fillRect(rx, cb.y + 2, 4, cb.h - 4);
// line 5393
        }
// line 5394
        ctx.fillStyle = '#38bdf8';
// line 5395
        ctx.font = 'bold 12px sans-serif';
// line 5396
        const arrow = cb.vx > 0 ? '➔ ➔ ➔' : '⬅ ⬅ ⬅';
// line 5397
        ctx.fillText(arrow, cb.x + cb.w / 2 - 24, cb.y + cb.h / 2 + 4);
// line 5398
      } else {
// line 5399
        const offset = ((gameTime * cb.vy) % 24 + 24) % 24;
// line 5400
        for (let ry = cb.y + offset; ry < cb.y + cb.h; ry += 24) {
// line 5401
          ctx.fillRect(cb.x + 2, ry, cb.w - 4, 4);
// line 5402
        }
// line 5403
        ctx.fillStyle = '#38bdf8';
// line 5404
        ctx.font = 'bold 12px sans-serif';
// line 5405
        const arrow = cb.vy > 0 ? '⬇' : '⬆';
// line 5406
        ctx.fillText(arrow, cb.x + cb.w / 2 - 6, cb.y + cb.h / 2 + 4);
// line 5407
      }
// line 5408
    }
// line 5409
  }
// line 5410

// line 5411
  // 4.6. Warehouse Heating Fans (Freezer Arena)
// line 5412
  for (let i = 0; i < warehouseHeaters.length; i++) {
// line 5413
    const h = warehouseHeaters[i];
// line 5414
    if (h.x > camera.x - 200 && h.x < camera.x + viewW + 200 && h.y > camera.y - 200 && h.y < camera.y + viewH + 200) {
// line 5415
      const heatGrad = ctx.createRadialGradient(h.x, h.y, 10, h.x, h.y, h.radius);
// line 5416
      heatGrad.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
// line 5417
      heatGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
// line 5418
      heatGrad.addColorStop(1, 'rgba(0,0,0,0)');
// line 5419
      ctx.fillStyle = heatGrad;
// line 5420
      ctx.beginPath(); ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2); ctx.fill();
// line 5421

// line 5422
      // Heater Box Unit
// line 5423
      ctx.fillStyle = '#ea580c';
// line 5424
      ctx.fillRect(h.x - 18, h.y - 18, 36, 36);
// line 5425
      ctx.strokeStyle = '#fef08a';
// line 5426
      ctx.lineWidth = 2;
// line 5427
      ctx.strokeRect(h.x - 18, h.y - 18, 36, 36);
// line 5428

// line 5429
      // Rotating fan blades
// line 5430
      ctx.save();
// line 5431
      ctx.translate(h.x, h.y);
// line 5432
      ctx.rotate(gameTime * 6);
// line 5433
      ctx.font = '18px sans-serif';
// line 5434
      ctx.textAlign = 'center';
// line 5435
      ctx.textBaseline = 'middle';
// line 5436
      ctx.fillText('♨️', 0, 1);
// line 5437
      ctx.restore();
// line 5438

// line 5439
      ctx.font = 'bold 10px sans-serif';
// line 5440
      ctx.fillStyle = '#fef08a';
// line 5441
      ctx.fillText('NAGRZEWNICA', h.x - 34, h.y + 30);
// line 5442
    }
// line 5443
  }
// line 5444

// line 5445
  // 5. Floor Stencils & Markings (BHP & DTA Warning Zones)
// line 5446
  for (let i = 0; i < warehouseStencils.length; i++) {
// line 5447
    const st = warehouseStencils[i];
// line 5448
    if (st.x > camera.x - 200 && st.x < camera.x + viewW + 200 && st.y > camera.y - 100 && st.y < camera.y + viewH + 100) {
// line 5449
      ctx.font = st.font;
// line 5450
      ctx.fillStyle = st.color;
// line 5451
      ctx.fillText(st.text, st.x, st.y);
// line 5452
    }
// line 5453
  }
// line 5454

// line 5455
  // 6. Loading Docks along North Wall (Bramy Załadunkowe DTA)
// line 5456
  for (let i = 0; i < warehouseDocks.length; i++) {
// line 5457
    const dock = warehouseDocks[i];
// line 5458
    if (dock.x + dock.w > camera.x && dock.x < camera.x + viewW && dock.y + dock.h > camera.y && dock.y < camera.y + viewH) {
// line 5459
      // Dock Bay Body
// line 5460
      ctx.fillStyle = '#0f172a';
// line 5461
      ctx.fillRect(dock.x, dock.y, dock.w, dock.h);
// line 5462
      ctx.strokeStyle = '#38bdf8';
// line 5463
      ctx.lineWidth = 2;
// line 5464
      ctx.strokeRect(dock.x, dock.y, dock.w, dock.h);
// line 5465

// line 5466
      // Segmented Metal Roll-up Door Shutter
// line 5467
      ctx.fillStyle = '#1e293b';
// line 5468
      for (let sy = 8; sy < dock.h - 12; sy += 9) {
// line 5469
        ctx.fillRect(dock.x + 8, sy, dock.w - 16, 7);
// line 5470
      }
// line 5471

// line 5472
      // Yellow/Black Chevron Hazard Edge
// line 5473
      ctx.fillStyle = '#f59e0b';
// line 5474
      ctx.fillRect(dock.x + 4, dock.h - 8, dock.w - 8, 8);
// line 5475

// line 5476
      // Dock Title & LED status indicator
// line 5477
      ctx.fillStyle = '#94a3b8';
// line 5478
      ctx.font = 'bold 10px sans-serif';
// line 5479
      ctx.fillText(dock.title, dock.x + 12, 22);
// line 5480

// line 5481
      // Blinking Dock LED
// line 5482
      const ledColor = dock.active ? (Math.sin(gameTime * 4) > 0 ? '#ef4444' : '#7f1d1d') : '#22c55e';
// line 5483
      ctx.fillStyle = ledColor;
// line 5484
      ctx.beginPath();
// line 5485
      ctx.arc(dock.x + dock.w - 16, 20, 6, 0, Math.PI * 2);
// line 5486
      ctx.fill();
// line 5487
    }
// line 5488
  }
// line 5489

// line 5490
  // 7. Arena Perimeter Industrial Hazard Border
// line 5491
  ctx.strokeStyle = '#ef4444';
// line 5492
  ctx.lineWidth = 8;
// line 5493
  ctx.strokeRect(4, 4, ARENA_WIDTH - 8, ARENA_HEIGHT - 8);
// line 5494

// line 5495
  // 8. Drift Tyre Skid Marks on Floor
// line 5496
  for (let i = 0; i < skidMarks.length; i++) {
// line 5497
    const s = skidMarks[i];
// line 5498
    if (s.x > camera.x - 40 && s.x < camera.x + viewW + 40 && s.y > camera.y - 40 && s.y < camera.y + viewH + 40) {
// line 5499
      const alpha = (s.life / s.maxLife) * 0.5;
// line 5500
      ctx.save();
// line 5501
      ctx.translate(s.x, s.y);
// line 5502
      ctx.rotate(s.angle);
// line 5503
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
// line 5504
      ctx.fillRect(-14, -10, 16, 4);
// line 5505
      ctx.fillRect(-14, 7, 16, 4);
// line 5506
      ctx.restore();
// line 5507
    }
// line 5508
  }
// line 5509

// line 5510
  // 9. Draw Warehouse Obstacles (High-bay Racks, Pallet Stacks, ToiToi)
// line 5511
  for (let i = 0; i < obstacles.length; i++) {
// line 5512
    const o = obstacles[i];
// line 5513
    if (o.x + o.w > camera.x && o.x < camera.x + viewW && o.y + o.h > camera.y && o.y < camera.y + viewH) {
// line 5514
      if (o.type === 'rack') {
// line 5515
        ctx.drawImage(rackCanvas, o.x, o.y);
// line 5516
      } else if (o.type === 'pallet_stack') {
// line 5517
        ctx.drawImage(palletStackCanvas, o.x, o.y);
// line 5518
      } else if (o.type === 'toitoi_station') {
// line 5519
        // High-vis ToiToi Cabin with shadow & ventilation smoke
// line 5520
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
// line 5521
        ctx.fillRect(o.x + 6, o.y + 6, o.w, o.h);
// line 5522
        ctx.fillStyle = '#15803d';
// line 5523
        ctx.fillRect(o.x, o.y, o.w, o.h);
// line 5524
        ctx.strokeStyle = '#4ade80';
// line 5525
        ctx.lineWidth = 2.5;
// line 5526
        ctx.strokeRect(o.x, o.y, o.w, o.h);
// line 5527
        ctx.fillStyle = '#ffffff';
// line 5528
        ctx.font = '900 12px sans-serif';
// line 5529
        ctx.fillText('TOI-TOI', o.x + 8, o.y + 36);
// line 5530
        ctx.font = '900 8px sans-serif';
// line 5531
        ctx.fillStyle = '#ef4444';
// line 5532
        ctx.fillText('AWARIA 🔒', o.x + 10, o.y + 50);
// line 5533

// line 5534
        // Toxic Green Odor Puff
// line 5535
        if (Math.random() < 0.25) {
// line 5536
          spawnParticle(o.x + 32 + (Math.random()-0.5)*20, o.y + 10, (Math.random()-0.5)*1.5, -1.2, 0.8, 4, 'rgba(74, 222, 128, 0.35)');
// line 5537
        }
// line 5538
      }
// line 5539
    }
// line 5540
  }
// line 5541

// line 5542
  // 9.5 Draw Breakable Warehouse Props (Coffee dispensers, wooden crates, extinguishers)
// line 5543
  drawMapProps(ctx, viewW, viewH);
// line 5544

// line 5545
  // 10. Draw Dynamic Pickups (XP Barcodes, Food, Coffee, Lucky Chests, Coins)
// line 5546
  for (let i = 0; i < dropItems.length; i++) {
// line 5547
    const it = dropItems[i];
// line 5548
    if (it.x > camera.x - 30 && it.x < camera.x + viewW + 30 && it.y > camera.y - 30 && it.y < camera.y + viewH + 30) {
// line 5549
      const isBarcode = it.type === 'barcode_xp';
// line 5550
      const glowGrad = ctx.createRadialGradient(it.x, it.y, 2, it.x, it.y, 28);
// line 5551
      glowGrad.addColorStop(0, isBarcode ? 'rgba(56, 189, 248, 0.35)' : 'rgba(245, 158, 11, 0.35)');
// line 5552
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
// line 5553
      ctx.fillStyle = glowGrad;
// line 5554
      ctx.beginPath(); ctx.arc(it.x, it.y, 28, 0, Math.PI * 2); ctx.fill();
// line 5555

// line 5556
      if (it.type === 'lucky_chest') {
// line 5557
        ctx.save();
// line 5558
        ctx.translate(it.x, it.y);
// line 5559
        const pulse = 1.0 + Math.sin(gameTime * 7) * 0.18;
// line 5560
        ctx.scale(pulse, pulse);
// line 5561
        ctx.font = '28px sans-serif';
// line 5562
        ctx.textAlign = 'center';
// line 5563
        ctx.textBaseline = 'middle';
// line 5564
        ctx.fillText('📦', 0, 0);
// line 5565
        ctx.fillStyle = '#facc15';
// line 5566
        ctx.font = 'bold 9px sans-serif';
// line 5567
        ctx.shadowColor = '#f59e0b';
// line 5568
        ctx.shadowBlur = 8;
// line 5569
        ctx.fillText('★SKRZYNIA★', 0, -16);
// line 5570
        ctx.restore();
// line 5571
      } else if (it.type === 'dta_coin') {
// line 5572
        ctx.save();
// line 5573
        ctx.translate(it.x, it.y);
// line 5574
        const bob = Math.sin(gameTime * 6 + it.x) * 3;
// line 5575
        ctx.translate(0, bob);
// line 5576
        ctx.font = '20px sans-serif';
// line 5577
        ctx.textAlign = 'center';
// line 5578
        ctx.textBaseline = 'middle';
// line 5579
        ctx.fillText('💰', 0, 0);
// line 5580
        ctx.restore();
// line 5581
      } else if (it.type === 'golden_forklift') {
// line 5582
        ctx.save();
// line 5583
        ctx.translate(it.x, it.y);
// line 5584
        const pulse = 1.1 + Math.sin(gameTime * 10) * 0.25;
// line 5585
        ctx.scale(pulse, pulse);
// line 5586
        ctx.font = '30px sans-serif';
// line 5587
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
// line 5588
        ctx.fillText('🚜', 0, 0);
// line 5589
        ctx.fillStyle = '#facc15'; ctx.font = 'bold 9px sans-serif';
// line 5590
        ctx.shadowColor = '#facc15'; ctx.shadowBlur = 10;
// line 5591
        ctx.fillText('★ZŁOTY WÓZEK★', 0, -18);
// line 5592
        ctx.restore();
// line 5593
      } else if (it.type === 'boombox_radio') {
// line 5594
        ctx.save();
// line 5595
        ctx.translate(it.x, it.y);
// line 5596
        const bob = Math.sin(gameTime * 8) * 4;
// line 5597
        ctx.translate(0, bob);
// line 5598
        ctx.font = '26px sans-serif';
// line 5599
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
// line 5600
        ctx.fillText('📻', 0, 0);
// line 5601
        ctx.restore();
// line 5602
      } else if (it.type === 'cargo_mystery') {
// line 5603
        ctx.save();
// line 5604
        ctx.translate(it.x, it.y);
// line 5605
        const spin = gameTime * 4;
// line 5606
        ctx.rotate(Math.sin(spin) * 0.2);
// line 5607
        ctx.font = '28px sans-serif';
// line 5608
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
// line 5609
        ctx.fillText('🎁', 0, 0);
// line 5610
        ctx.fillStyle = '#a855f7'; ctx.font = 'bold 9px sans-serif';
// line 5611
        ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 10;
// line 5612
        ctx.fillText('❓TAJNA PACZKA❓', 0, -16);
// line 5613
        ctx.restore();
// line 5614
      } else if (it.type === 'golden_velvet') {
// line 5615
        ctx.save();
// line 5616
        ctx.translate(it.x, it.y);
// line 5617
        const pulse = 1.0 + Math.sin(gameTime * 8) * 0.15;
// line 5618
        ctx.scale(pulse, pulse);
// line 5619
        ctx.fillStyle = '#facc15';
// line 5620
        ctx.shadowColor = '#f59e0b';
// line 5621
        ctx.shadowBlur = 18;
// line 5622
        ctx.fillRect(-14, -10, 28, 20);
// line 5623
        ctx.fillStyle = '#ffffff';
// line 5624
        ctx.font = 'bold 9px sans-serif';
// line 5625
        ctx.fillText('GOLD', -11, 3);
// line 5626
        ctx.restore();
// line 5627
      } else if (isBarcode) {
// line 5628
        // High-res Polish EAN-13 Barcode Label
// line 5629
        ctx.fillStyle = '#ffffff';
// line 5630
        ctx.fillRect(it.x - 8, it.y - 6, 16, 12);
// line 5631
        ctx.strokeStyle = '#38bdf8';
// line 5632
        ctx.lineWidth = 1;
// line 5633
        ctx.strokeRect(it.x - 8, it.y - 6, 16, 12);
// line 5634
        ctx.fillStyle = '#020617';
// line 5635
        ctx.fillRect(it.x - 6, it.y - 4, 1.5, 8);
// line 5636
        ctx.fillRect(it.x - 3, it.y - 4, 2.5, 8);
// line 5637
        ctx.fillRect(it.x + 1, it.y - 4, 1.5, 8);
// line 5638
        ctx.fillRect(it.x + 4, it.y - 4, 2, 8);
// line 5639
      } else if (it.type === 'hotdog') {
// line 5640
        ctx.font = '18px sans-serif';
// line 5641
        ctx.fillText('🌭', it.x - 9, it.y + 6);
// line 5642
      } else if (it.type === 'kinder_bueno') {
// line 5643
        ctx.font = '20px sans-serif';
// line 5644
        ctx.fillText('🍫', it.x - 10, it.y + 7);
// line 5645
      } else if (it.type === 'mystery_box') {
// line 5646
        ctx.font = '28px sans-serif';
// line 5647
        ctx.fillText('🎁', it.x - 14, it.y + 10);
// line 5648
      } else if (it.type === 'coffee_thermos') {
// line 5649
        ctx.font = '18px sans-serif';
// line 5650
        ctx.fillText('☕', it.x - 9, it.y + 6);
// line 5651
      }
// line 5652
    }
// line 5653
  }
// line 5654

// line 5655
  // 11. Real-time Player Headlights Cone
// line 5656
  const headDist = 280;
// line 5657
  const headSpread = 0.54;
// line 5658
  const hGrad = ctx.createRadialGradient(
// line 5659
    player.x, player.y, 20,
// line 5660
    player.x + Math.cos(player.angle) * headDist * 0.7,
// line 5661
    player.y + Math.sin(player.angle) * headDist * 0.7,
// line 5662
    headDist
// line 5663
  );
// line 5664
  hGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
// line 5665
  hGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.14)');
// line 5666
  hGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
// line 5667
  ctx.fillStyle = hGrad;
// line 5668
  ctx.beginPath();
// line 5669
  ctx.moveTo(player.x, player.y);
// line 5670
  ctx.arc(player.x, player.y, headDist, player.angle - headSpread, player.angle + headSpread);
// line 5671
  ctx.closePath();
// line 5672
  ctx.fill();
// line 5673

// line 5674
  // 12. Amber Flare Floor Beacon
// line 5675
  const beaconAlpha = 0.24 + Math.sin(gameTime * 14) * 0.14;
// line 5676
  const bGrad = ctx.createRadialGradient(player.x, player.y, 4, player.x, player.y, 130);
// line 5677
  bGrad.addColorStop(0, `rgba(245, 158, 11, ${beaconAlpha})`);
// line 5678
  bGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
// line 5679
  ctx.fillStyle = bGrad;
// line 5680
  ctx.beginPath(); ctx.arc(player.x, player.y, 130, 0, Math.PI * 2); ctx.fill();
// line 5681

// line 5682
  // 13. Draw Enemies with Character Specific Models
// line 5683
  for (let i = 0; i < enemies.length; i++) {
// line 5684
    const e = enemies[i];
// line 5685
    if (e.x + 80 < camera.x || e.x - 80 > camera.x + viewW || e.y + 80 < camera.y || e.y - 80 > camera.y + viewH) continue;
// line 5686

// line 5687
    ctx.save();
// line 5688
    ctx.translate(e.x, e.y);
// line 5689

// line 5690
    // Dynamic Ground Shadow
// line 5691
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
// line 5692
    ctx.beginPath();
// line 5693
    ctx.ellipse(0, e.info.radius * 0.7, e.info.radius * 0.95, e.info.radius * 0.5, 0, 0, Math.PI * 2);
// line 5694
    ctx.fill();
// line 5695

// line 5696
    const isHit = e.hitFlash > 0;
// line 5697
    const isFrozen = e.slowTimer > 0;
// line 5698
    const facing = Math.atan2(player.y - e.y, player.x - e.x);
// line 5699

// line 5700
    if (e.info.renderType === 'delivery_van') {
// line 5701
      // --- BUS: "JA TYLKO DWIE PALETY" (Fiat Ducato / Iveco Daily) ---
// line 5702
      ctx.rotate(facing);
// line 5703
      
// line 5704
      // Van Headlights Cone
// line 5705
      const vanHeadGrad = ctx.createRadialGradient(28, 0, 5, 80, 0, 90);
// line 5706
      vanHeadGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
// line 5707
      vanHeadGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
// line 5708
      ctx.fillStyle = vanHeadGrad;
// line 5709
      ctx.beginPath();
// line 5710
      ctx.moveTo(28, 0); ctx.arc(28, 0, 90, -0.4, 0.4); ctx.closePath(); ctx.fill();
// line 5711

// line 5712
      // Van Body (White with Orange accents)
// line 5713
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#f8fafc');
// line 5714
      ctx.fillRect(-30, -18, 60, 36);
// line 5715
      ctx.strokeStyle = '#94a3b8';
// line 5716
      ctx.lineWidth = 1.5;
// line 5717
      ctx.strokeRect(-30, -18, 60, 36);
// line 5718

// line 5719
      // Windshield & Side Windows
// line 5720
      ctx.fillStyle = '#0f172a';
// line 5721
      ctx.fillRect(8, -14, 16, 28);
// line 5722
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
// line 5723
      ctx.fillRect(10, -12, 12, 24);
// line 5724

// line 5725
      // Roof Emergency Flasher
// line 5726
      ctx.fillStyle = Math.sin(gameTime * 18) > 0 ? '#f59e0b' : '#ef4444';
// line 5727
      ctx.beginPath(); ctx.arc(-2, 0, 5, 0, Math.PI * 2); ctx.fill();
// line 5728

// line 5729
      // Wheels
// line 5730
      ctx.fillStyle = '#020617';
// line 5731
      ctx.fillRect(-22, -21, 12, 5); ctx.fillRect(10, -21, 12, 5);
// line 5732
      ctx.fillRect(-22, 16, 12, 5); ctx.fillRect(10, 16, 12, 5);
// line 5733

// line 5734
      // Banner Text on Roof
// line 5735
      ctx.fillStyle = '#ea580c';
// line 5736
      ctx.font = '900 9.5px sans-serif';
// line 5737
      ctx.fillText('2 PALETY', -22, 3);
// line 5738
    } else if (e.info.renderType === 'toitoi_mech') {
// line 5739
      // --- BOSS MECHA-TOITOI 3000 ---
// line 5740
      ctx.rotate(facing);
// line 5741

// line 5742
      // Armored Metal Body
// line 5743
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#15803d');
// line 5744
      ctx.fillRect(-32, -42, 64, 84);
// line 5745
      ctx.strokeStyle = '#4ade80';
// line 5746
      ctx.lineWidth = 3.5;
// line 5747
      ctx.strokeRect(-32, -42, 64, 84);
// line 5748

// line 5749
      // Hazard Stripes on Lower Skirt
// line 5750
      ctx.fillStyle = '#f59e0b';
// line 5751
      ctx.fillRect(-30, 24, 60, 14);
// line 5752
      ctx.fillStyle = '#020617';
// line 5753
      for (let hx = -26; hx < 26; hx += 12) {
// line 5754
        ctx.beginPath();
// line 5755
        ctx.moveTo(hx, 24); ctx.lineTo(hx + 6, 38); ctx.lineTo(hx + 10, 38); ctx.lineTo(hx + 4, 24); ctx.fill();
// line 5756
      }
// line 5757

// line 5758
      // Ventilation Grille & Glowing Demonic Sensor Eyes
// line 5759
      ctx.fillStyle = '#020617';
// line 5760
      ctx.fillRect(-16, -26, 32, 14);
// line 5761
      ctx.fillStyle = '#ef4444';
// line 5762
      ctx.beginPath(); ctx.arc(-7, -19, 3.5, 0, Math.PI * 2); ctx.arc(7, -19, 3.5, 0, Math.PI * 2); ctx.fill();
// line 5763

// line 5764
      // Biohazard Nuclear Aura
// line 5765
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
// line 5766
      ctx.lineWidth = 2;
// line 5767
      ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI * 2); ctx.stroke();
// line 5768
    } else if (e.info.renderType === 'container_truck') {
// line 5769
      // --- BOSS 40FT CONTAINER TRUCK ---
// line 5770
      ctx.rotate(facing);
// line 5771
      
// line 5772
      // Corrugated Shipping Container Body (Maersk Burgundy / Navy)
// line 5773
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#991b1b');
// line 5774
      ctx.fillRect(-52, -26, 104, 52);
// line 5775
      ctx.strokeStyle = '#fca5a5';
// line 5776
      ctx.lineWidth = 2.5;
// line 5777
      ctx.strokeRect(-52, -26, 104, 52);
// line 5778

// line 5779
      // Corrugated Container Vertical Steel Ribs
// line 5780
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
// line 5781
      ctx.lineWidth = 2;
// line 5782
      for (let rx = -44; rx < 44; rx += 8) {
// line 5783
        ctx.beginPath(); ctx.moveTo(rx, -24); ctx.lineTo(rx, 24); ctx.stroke();
// line 5784
      }
// line 5785

// line 5786
      // Container Door Locking Bars & Maersk Decal
// line 5787
      ctx.fillStyle = '#e2e8f0';
// line 5788
      ctx.fillRect(-48, -12, 3, 24); ctx.fillRect(-44, -12, 3, 24);
// line 5789
      ctx.font = '900 11px sans-serif';
// line 5790
      ctx.fillText('40FT SAD EXPRESS', -34, 4);
// line 5791

// line 5792
      // Brake Taillights
// line 5793
      ctx.fillStyle = '#ef4444';
// line 5794
      ctx.fillRect(-52, -22, 4, 8); ctx.fillRect(-52, 14, 4, 8);
// line 5795
    } else if (e.info.renderType === 'boss_bhp') {
// line 5796
      // --- BOSS BHP ZASTĘPCA GRZESIEK ---
// line 5797
      ctx.fillStyle = isHit ? '#ffffff' : '#f97316'; // High-vis orange vest
// line 5798
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5799
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
// line 5800

// line 5801
      // Green BHP Cross on Chest
// line 5802
      ctx.fillStyle = '#22c55e';
// line 5803
      ctx.fillRect(-5, -12, 10, 24);
// line 5804
      ctx.fillRect(-12, -5, 24, 10);
// line 5805
      
// line 5806
      // Megaphone with ultrasonic rings
// line 5807
      ctx.fillStyle = '#fbbf24';
// line 5808
      ctx.font = '18px sans-serif';
// line 5809
      ctx.fillText('📢', 6, 8);
// line 5810
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
// line 5811
      ctx.lineWidth = 2;
// line 5812
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius + 12 + Math.sin(gameTime * 8)*6, 0, Math.PI * 2); ctx.stroke();
// line 5813
    } else if (e.info.renderType === 'boss_igor') {
// line 5814
      // --- BOSS IGOR (UDZIAŁOWIEC) ---
// line 5815
      ctx.fillStyle = isHit ? '#ffffff' : '#1e1b4b';
// line 5816
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5817
      ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 3; ctx.stroke();
// line 5818

// line 5819
      // Electric Darkness Aura & Shattered Bulbs
// line 5820
      ctx.font = '18px sans-serif';
// line 5821
      ctx.fillText('💡', -8, 6);
// line 5822
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
// line 5823
      ctx.lineWidth = 1.5;
// line 5824
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius + 14, 0, Math.PI * 2); ctx.stroke();
// line 5825
    } else if (e.info.renderType === 'reach_truck') {
// line 5826
      // --- WIESŁAW REACH TRUCK (WYSOKI SKŁAD) ---
// line 5827
      ctx.rotate(facing);
// line 5828
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#0284c7');
// line 5829
      ctx.fillRect(-22, -15, 44, 30);
// line 5830
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.strokeRect(-22, -15, 44, 30);
// line 5831
      // Mast Chrome Beams
// line 5832
      ctx.fillStyle = '#cbd5e1';
// line 5833
      ctx.fillRect(16, -12, 6, 24);
// line 5834
      ctx.fillRect(22, -10, 16, 4); ctx.fillRect(22, 6, 16, 4);
// line 5835
    } else if (e.type === 'KARTON_B2C') {
// line 5836
      // --- 3D CARDBOARD BOX ---
// line 5837
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#d97706');
// line 5838
      ctx.fillRect(-14, -12, 28, 24);
// line 5839
      ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.5; ctx.strokeRect(-14, -12, 28, 24);
// line 5840
      // Brown Seam Tape & Fragile Glass Symbol
// line 5841
      ctx.fillStyle = '#b45309'; ctx.fillRect(-14, -2, 28, 4);
// line 5842
      ctx.font = '10px sans-serif'; ctx.fillText('🍷', -4, 4);
// line 5843
    } else if (e.type === 'FOLIA' || e.type === 'FOLIA_MALA') {
// line 5844
      // --- GLOSSY STRETCH FILM ROLL ---
// line 5845
      const r = e.info.radius;
// line 5846
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : 'rgba(248, 250, 252, 0.9)');
// line 5847
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
// line 5848
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();
// line 5849
      // Blue Plastic Tube Core
// line 5850
      ctx.fillStyle = '#0284c7'; ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
// line 5851
    } else if (e.type === 'PALETA_KAM') {
// line 5852
      // --- STACKED WOODEN EURO PALLET ---
// line 5853
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#78350f');
// line 5854
      ctx.fillRect(-22, -18, 44, 36);
// line 5855
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2; ctx.strokeRect(-22, -18, 44, 36);
// line 5856
      // Wooden Planks & EPAL Stamp
// line 5857
      ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1;
// line 5858
      ctx.beginPath(); ctx.moveTo(-22, -6); ctx.lineTo(22, -6); ctx.moveTo(-22, 6); ctx.lineTo(22, 6); ctx.stroke();
// line 5859
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('EPAL', -10, 3);
// line 5860
    } else if (e.type === 'RAMPA') {
// line 5861
      // --- HEAVY STEEL LOADING RAMP ---
// line 5862
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#334155');
// line 5863
      ctx.fillRect(-28, -20, 56, 40);
// line 5864
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5; ctx.strokeRect(-28, -20, 56, 40);
// line 5865
      // Yellow/Black Hazard Stripes
// line 5866
      ctx.fillStyle = '#f59e0b';
// line 5867
      for (let hx = -24; hx < 24; hx += 10) {
// line 5868
        ctx.fillRect(hx, -18, 5, 36);
// line 5869
      }
// line 5870
    } else if (e.type === 'AUDYTOR') {
// line 5871
      // --- BHP AUDITOR (Yellow Helmet & Safety Vest) ---
// line 5872
      ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#facc15'); // Yellow Helmet
// line 5873
      ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5874
      ctx.strokeStyle = '#020617'; ctx.lineWidth = 2; ctx.stroke();
// line 5875
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('BHP', -7, 3);
// line 5876
    } else {
// line 5877
      // --- PEDESTRIAN WORKERS / DRIVERS / INSPECTORS ---
// line 5878
      const walkCycle = Math.sin(gameTime * 14 + i) * 6;
// line 5879
      
// line 5880
      // 1. Klapki Kubota Driver
// line 5881
      if (e.type === 'KLAPKI') {
// line 5882
        ctx.fillStyle = '#1e3a8a'; // Blue shorts
// line 5883
        ctx.fillRect(-8, 2, 16, 8);
// line 5884
        ctx.fillStyle = '#facc15'; // Yellow Kubota slippers
// line 5885
        ctx.fillRect(-10, 10 + walkCycle, 7, 12);
// line 5886
        ctx.fillRect(3, 10 - walkCycle, 7, 12);
// line 5887
        ctx.fillStyle = '#1e3a8a'; // Slipper strap
// line 5888
        ctx.fillRect(-10, 13 + walkCycle, 7, 3);
// line 5889
        ctx.fillRect(3, 13 - walkCycle, 7, 3);
// line 5890
        // Torso / white sleeveless shirt
// line 5891
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#f8fafc');
// line 5892
        ctx.beginPath(); ctx.arc(0, -3, e.info.radius * 0.75, 0, Math.PI * 2); ctx.fill();
// line 5893
        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 1.5; ctx.stroke();
// line 5894
        // CMR document in hand
// line 5895
        ctx.fillStyle = '#ffffff'; ctx.fillRect(9, -6, 8, 10);
// line 5896
        ctx.fillStyle = '#ef4444'; ctx.fillRect(10, -4, 6, 2);
// line 5897
      }
// line 5898
      // 2. Kierowca TIR (Flannel Shirt & Trucker Cap)
// line 5899
      else if (e.type === 'KIEROWCA_TIR') {
// line 5900
        // Red & Black Flannel Torso
// line 5901
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#dc2626');
// line 5902
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5903
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.stroke();
// line 5904
        // Flannel grid check lines
// line 5905
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1.5;
// line 5906
        ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke();
// line 5907
        // Trucker Cap Peak
// line 5908
        ctx.fillStyle = '#1e293b';
// line 5909
        ctx.beginPath(); ctx.arc(0, -8, 8, Math.PI, 0); ctx.fill();
// line 5910
        // Thermos in hand
// line 5911
        ctx.fillStyle = '#0284c7'; ctx.fillRect(10, -5, 6, 12);
// line 5912
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(11, -8, 4, 3);
// line 5913
      }
// line 5914
      // 3. Kurier Paczek (Yellow DHL/DPD Jacket & Parcel Scanner)
// line 5915
      else if (e.type === 'KURIER') {
// line 5916
        // Bright Yellow / Red Jacket
// line 5917
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#eab308');
// line 5918
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5919
        ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 2.5; ctx.stroke();
// line 5920
        // Red Cap
// line 5921
        ctx.fillStyle = '#b91c1c';
// line 5922
        ctx.beginPath(); ctx.arc(0, -6, 7, 0, Math.PI * 2); ctx.fill();
// line 5923
        // Handheld Laser Scanner emitting red aim line
// line 5924
        ctx.fillStyle = '#1e293b'; ctx.fillRect(9, 2, 7, 5);
// line 5925
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; ctx.lineWidth = 1;
// line 5926
        ctx.beginPath(); ctx.moveTo(16, 4); ctx.lineTo(26, 4); ctx.stroke();
// line 5927
      }
// line 5928
      // 4. Spedytor (Purple Blazer & Smartphone)
// line 5929
      else if (e.type === 'SPEDYTOR') {
// line 5930
        // Dark Purple Suit Blazer
// line 5931
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#581c87');
// line 5932
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5933
        ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2; ctx.stroke();
// line 5934
        // White shirt collar & red tie
// line 5935
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-4, -8, 8, 7);
// line 5936
        ctx.fillStyle = '#ef4444'; ctx.fillRect(-2, -4, 4, 10);
// line 5937
        // Glowing Smartphone by head
// line 5938
        ctx.fillStyle = '#0f172a'; ctx.fillRect(8, -12, 6, 10);
// line 5939
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(9, -10, 4, 6);
// line 5940
      }
// line 5941
      // 5. Awizo (Vintage Postal Coat & Stamp)
// line 5942
      else if (e.type === 'AWIZO') {
// line 5943
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#78350f');
// line 5944
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5945
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke();
// line 5946
        // Yellow Awizo Badge
// line 5947
        ctx.fillStyle = '#fef08a';
// line 5948
        ctx.fillRect(-7, -4, 14, 9);
// line 5949
        ctx.fillStyle = '#b45309'; ctx.font = 'bold 7px sans-serif'; ctx.fillText('AWIZO', -6, 3);
// line 5950
      }
// line 5951
      // 6. Celnik KAS (Navy Uniform & Gold Crest)
// line 5952
      else if (e.type === 'CELNIK') {
// line 5953
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#1e3a8a');
// line 5954
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5955
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2.5; ctx.stroke();
// line 5956
        // Gold Eagle Badge
// line 5957
        ctx.fillStyle = '#facc15'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('🦅', -5, 4);
// line 5958
      }
// line 5959
      // 7. Ukraina Ekipa (Hi-vis vest with 3M silver stripes)
// line 5960
      else if (e.type === 'UKRAINA_EKIPA') {
// line 5961
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#1e40af'); // Blue shirt
// line 5962
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5963
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke();
// line 5964
        // Yellow & Silver 3M Safety Cross Vest
// line 5965
        ctx.fillStyle = '#eab308';
// line 5966
        ctx.fillRect(-10, -7, 20, 14);
// line 5967
        ctx.fillStyle = '#f8fafc';
// line 5968
        ctx.fillRect(-10, -2, 20, 4);
// line 5969
      }
// line 5970
      // 8. Praktykant (Mint Green vest & scattered papers)
// line 5971
      else if (e.type === 'PRAKTYKANT') {
// line 5972
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#10b981');
// line 5973
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5974
        ctx.strokeStyle = '#047857'; ctx.lineWidth = 1.5; ctx.stroke();
// line 5975
        // Clipboard
// line 5976
        ctx.fillStyle = '#92400e'; ctx.fillRect(-6, -6, 12, 12);
// line 5977
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-4, -4, 8, 8);
// line 5978
      }
// line 5979
      // 9. Tasma (Worker with giant packing tape roll)
// line 5980
      else if (e.type === 'TASMA') {
// line 5981
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#f59e0b');
// line 5982
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 5983
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.stroke();
// line 5984
        // Rotating Tape Dispenser
// line 5985
        ctx.fillStyle = '#92400e';
// line 5986
        ctx.beginPath(); ctx.arc(8, 0, 7, 0, Math.PI * 2); ctx.fill();
// line 5987
        ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.arc(8, 0, 3, 0, Math.PI * 2); ctx.fill();
// line 5988
      }
// line 5989
      // 10. Awaria Wózek (Sparking mini pallet jack)
// line 5990
      else if (e.type === 'WOZEK_AWARIA') {
// line 5991
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : '#ea580c');
// line 5992
        ctx.fillRect(-16, -10, 32, 20);
// line 5993
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.strokeRect(-16, -10, 32, 20);
// line 5994
        // Sparking electric battery smoke
// line 5995
        if (Math.random() < 0.3) {
// line 5996
          spawnParticle(e.x - 10, e.y, (Math.random()-0.5)*2, -1, 0.4, 3, '#facc15');
// line 5997
        }
// line 5998
      }
// line 5999
      // Fallback Pedestrian with itemIcon
// line 6000
      else {
// line 6001
        ctx.fillStyle = isHit ? '#ffffff' : (isFrozen ? '#7dd3fc' : e.info.color);
// line 6002
        ctx.beginPath(); ctx.arc(0, 0, e.info.radius, 0, Math.PI * 2); ctx.fill();
// line 6003
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
// line 6004
        if (e.info.itemIcon) {
// line 6005
          ctx.font = '14px sans-serif'; ctx.fillText(e.info.itemIcon, -7, 5);
// line 6006
        }
// line 6007
      }
// line 6008
    }
// line 6009

// line 6010
    // Frozen Ice Block Crystal Overlay
// line 6011
    if (isFrozen) {
// line 6012
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
// line 6013
      ctx.lineWidth = 2.5;
// line 6014
      ctx.beginPath();
// line 6015
      ctx.arc(0, 0, e.info.radius + 4, 0, Math.PI * 2);
// line 6016
      ctx.stroke();
// line 6017
    }
// line 6018

// line 6019
    // Mini HP bar for damaged enemies
// line 6020
    if (e.hp < e.maxHp) {
// line 6021
      const barW = Math.max(32, e.info.radius * 1.8);
// line 6022
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
// line 6023
      ctx.fillRect(-barW / 2, -e.info.radius - 10, barW, 5);
// line 6024
      ctx.fillStyle = '#ef4444';
// line 6025
      ctx.fillRect(-barW / 2, -e.info.radius - 10, (e.hp / e.maxHp) * barW, 5);
// line 6026
    }
// line 6027

// line 6028
    // --- CLEAR ATMOSPHERIC NAME & ICON BADGE OVER BOSS HEAD ONLY ---
// line 6029
    if (e.isBoss) {
// line 6030
      const badgeY = -e.info.radius - (e.hp < e.maxHp ? 22 : 14);
// line 6031
      const nameStr = (e.info.itemIcon ? e.info.itemIcon + ' ' : '') + (e.info.name || e.type);
// line 6032
      const fontSize = Math.round(13 * fontScale);
// line 6033
      ctx.font = `900 ${fontSize}px -apple-system, Roboto, sans-serif`;
// line 6034
      const textW = ctx.measureText(nameStr).width;
// line 6035
      const badgeW = textW + 14 * fontScale;
// line 6036
      const badgeH = 18 * fontScale;
// line 6037

// line 6038
      ctx.fillStyle = 'rgba(127, 29, 29, 0.94)';
// line 6039
      ctx.beginPath();
// line 6040
      ctx.roundRect(-badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 4 * fontScale);
// line 6041
      ctx.fill();
// line 6042
      ctx.strokeStyle = '#f59e0b';
// line 6043
      ctx.lineWidth = 1.8 * fontScale;
// line 6044
      ctx.stroke();
// line 6045

// line 6046
      ctx.fillStyle = '#fef08a';
// line 6047
      ctx.textAlign = 'center';
// line 6048
      ctx.textBaseline = 'middle';
// line 6049
      ctx.fillText(nameStr, 0, badgeY);
// line 6050
    }
// line 6051

// line 6052
    ctx.restore();
// line 6053
  }
// line 6054

// line 6055
  // 14. Draw Player (Toyota BT Industrial Forklift)
// line 6056
  ctx.save();
// line 6057
  ctx.translate(player.x, player.y);
// line 6058

// line 6059
  if (player.isForklift) {
// line 6060
    // Forklift Ground Shadow
// line 6061
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
// line 6062
    ctx.beginPath();
// line 6063
    ctx.ellipse(0, 4, 30, 20, player.angle, 0, Math.PI * 2);
// line 6064
    ctx.fill();
// line 6065

// line 6066
    ctx.rotate(player.angle);
// line 6067

// line 6068
    // Iron Rear Counterweight
// line 6069
    ctx.fillStyle = '#0f172a';
// line 6070
    ctx.fillRect(-27, -14, 8, 28);
// line 6071
    ctx.strokeStyle = '#334155';
// line 6072
    ctx.lineWidth = 1;
// line 6073
    ctx.strokeRect(-27, -14, 8, 28);
// line 6074

// line 6075
    // Main Chassis (Toyota Industrial Orange)
// line 6076
    const chassisGrad = ctx.createLinearGradient(-24, -16, 24, 16);
// line 6077
    chassisGrad.addColorStop(0, '#ea580c');
// line 6078
    chassisGrad.addColorStop(0.5, '#f97316');
// line 6079
    chassisGrad.addColorStop(1, '#c2410c');
// line 6080
    ctx.fillStyle = chassisGrad;
// line 6081
    ctx.fillRect(-24, -16, 48, 32);
// line 6082
    ctx.strokeStyle = '#fed7aa';
// line 6083
    ctx.lineWidth = 1.5;
// line 6084
    ctx.strokeRect(-24, -16, 48, 32);
// line 6085

// line 6086
    // Roll Cage Safety Frame
// line 6087
    ctx.strokeStyle = '#020617';
// line 6088
    ctx.lineWidth = 2.5;
// line 6089
    ctx.strokeRect(-14, -13, 20, 26);
// line 6090

// line 6091
    // Cockpit Glass Roof with tint
// line 6092
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
// line 6093
    ctx.fillRect(-13, -12, 18, 24);
// line 6094
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
// line 6095
    ctx.fillRect(-11, -10, 14, 20);
// line 6096

// line 6097
    // Steering Wheel & Operator Seat
// line 6098
    ctx.fillStyle = '#334155';
// line 6099
    ctx.beginPath(); ctx.arc(-4, 0, 5, 0, Math.PI * 2); ctx.fill();
// line 6100
    ctx.fillStyle = '#64748b';
// line 6101
    ctx.beginPath(); ctx.arc(4, 0, 3, 0, Math.PI * 2); ctx.fill();
// line 6102

// line 6103
    // Heavy Duty Steel Mast & Forks
// line 6104
    ctx.fillStyle = '#1e293b';
// line 6105
    ctx.fillRect(20, -14, 5, 28);
// line 6106
    ctx.fillStyle = '#cbd5e1';
// line 6107
    ctx.fillRect(25, -13, 22, 6);
// line 6108
    ctx.fillRect(25, 7, 22, 6);
// line 6109
    ctx.fillStyle = '#64748b';
// line 6110
    ctx.fillRect(25, -13, 3, 6);
// line 6111
    ctx.fillRect(25, 7, 3, 6);
// line 6112

// line 6113
    // Rotating Amber Warning Light Flare on Roof
// line 6114
    ctx.fillStyle = '#f59e0b';
// line 6115
    ctx.beginPath(); ctx.arc(-5, 0, 5.5, 0, Math.PI * 2); ctx.fill();
// line 6116
    ctx.fillStyle = '#fef08a';
// line 6117
    ctx.beginPath(); ctx.arc(-5, 0, 2.5, 0, Math.PI * 2); ctx.fill();
// line 6118

// line 6119
    // Toyota BT Exhaust Pipe Nozzle & Turbo Flame Plume (Rear Left)
// line 6120
    ctx.fillStyle = '#334155';
// line 6121
    ctx.fillRect(-29, 6, 5, 6);
// line 6122
    ctx.strokeStyle = '#0f172a';
// line 6123
    ctx.lineWidth = 1;
// line 6124
    ctx.strokeRect(-29, 6, 5, 6);
// line 6125

// line 6126
    if (packageCombo > 0 || player.isDashing) {
// line 6127
      const flameLen = Math.min(32, 8 + packageCombo * 1.3 + Math.sin(gameTime * 28) * 4);
// line 6128
      const flameGrad = ctx.createLinearGradient(-29, 9, -29 - flameLen, 9);
// line 6129
      if (packageCombo >= 15) {
// line 6130
        flameGrad.addColorStop(0, '#ffffff');
// line 6131
        flameGrad.addColorStop(0.25, '#38bdf8');
// line 6132
        flameGrad.addColorStop(0.65, '#c084fc');
// line 6133
        flameGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
// line 6134
      } else if (packageCombo >= 5) {
// line 6135
        flameGrad.addColorStop(0, '#ffffff');
// line 6136
        flameGrad.addColorStop(0.3, '#fbbf24');
// line 6137
        flameGrad.addColorStop(0.7, '#ea580c');
// line 6138
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
// line 6139
      } else {
// line 6140
        flameGrad.addColorStop(0, '#ffffff');
// line 6141
        flameGrad.addColorStop(0.4, '#38bdf8');
// line 6142
        flameGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
// line 6143
      }
// line 6144
      ctx.fillStyle = flameGrad;
// line 6145
      ctx.beginPath();
// line 6146
      ctx.moveTo(-29, 7);
// line 6147
      ctx.lineTo(-29 - flameLen, 9);
// line 6148
      ctx.lineTo(-29, 11);
// line 6149
      ctx.closePath();
// line 6150
      ctx.fill();
// line 6151
    }
// line 6152

// line 6153
    // Aerodynamic High-Speed Motion Lines (Wind Streaks)
// line 6154
    if (packageCombo >= 6 || player.isDashing) {
// line 6155
      ctx.strokeStyle = packageCombo >= 15 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(251, 191, 36, 0.5)';
// line 6156
      ctx.lineWidth = 1.5;
// line 6157
      const streakOffset = (gameTime * 70) % 22;
// line 6158
      ctx.beginPath();
// line 6159
      ctx.moveTo(-35 - streakOffset, -18);
// line 6160
      ctx.lineTo(25 - streakOffset, -18);
// line 6161
      ctx.stroke();
// line 6162
      ctx.beginPath();
// line 6163
      ctx.moveTo(-35 - streakOffset, 18);
// line 6164
      ctx.lineTo(25 - streakOffset, 18);
// line 6165
      ctx.stroke();
// line 6166
    }
// line 6167
  } else {
// line 6168
    // On-foot Player Rendering (Pedestrian)
// line 6169
    ctx.rotate(player.angle);
// line 6170
    
// line 6171
    // Shadow
// line 6172
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
// line 6173
    ctx.beginPath();
// line 6174
    ctx.ellipse(-2, 2, 16, 12, 0, 0, Math.PI * 2);
// line 6175
    ctx.fill();
// line 6176

// line 6177
    // Body (Hi-Vis vest)
// line 6178
    ctx.fillStyle = '#fbbf24'; // Yellow-orange vest
// line 6179
    ctx.beginPath();
// line 6180
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
// line 6181
    ctx.fill();
// line 6182
    ctx.lineWidth = 2;
// line 6183
    ctx.strokeStyle = '#d97706';
// line 6184
    ctx.stroke();
// line 6185

// line 6186
    // Reflective stripes
// line 6187
    ctx.strokeStyle = '#f8fafc';
// line 6188
    ctx.lineWidth = 3;
// line 6189
    ctx.beginPath();
// line 6190
    ctx.moveTo(-10, -6);
// line 6191
    ctx.lineTo(10, -6);
// line 6192
    ctx.moveTo(-10, 6);
// line 6193
    ctx.lineTo(10, 6);
// line 6194
    ctx.stroke();
// line 6195

// line 6196
    // Head
// line 6197
    ctx.fillStyle = '#fcd34d'; // Skin tone
// line 6198
    ctx.beginPath();
// line 6199
    ctx.arc(4, 0, 9, 0, Math.PI * 2);
// line 6200
    ctx.fill();
// line 6201
    ctx.lineWidth = 1.5;
// line 6202
    ctx.strokeStyle = '#b45309';
// line 6203
    ctx.stroke();
// line 6204

// line 6205
    // Hands
// line 6206
    const legOffset = Math.sin(gameTime * (Math.hypot(player.vx, player.vy) * 2)) * 6;
// line 6207
    ctx.fillStyle = '#fcd34d';
// line 6208
    ctx.beginPath(); ctx.arc(10 + legOffset, -14, 4, 0, Math.PI * 2); ctx.fill();
// line 6209
    ctx.beginPath(); ctx.arc(10 - legOffset, 14, 4, 0, Math.PI * 2); ctx.fill();
// line 6210
  }
// line 6211

// line 6212
  // Draw Stamina Bar below player
// line 6213
  if (player.stamina < player.maxStamina || player.isForklift) {
// line 6214
    ctx.rotate(-player.angle); // undo player rotation
// line 6215
    
// line 6216
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
// line 6217
    ctx.fillRect(-16, 32, 32, 5);
// line 6218
    
// line 6219
    ctx.fillStyle = player.isForklift ? '#facc15' : '#fbbf24';
// line 6220
    const fillW = Math.max(0, (player.stamina / player.maxStamina) * 30);
// line 6221
    ctx.fillRect(-15, 33, fillW, 3);
// line 6222
    
// line 6223
    ctx.rotate(player.angle); // restore rotation just in case
// line 6224
  }
// line 6225
  ctx.restore();
// line 6226

// line 6227
  // 14.5 Draw Kluska Companion
// line 6228
  drawKluska(ctx);
// line 6229

// line 6230
  // 15. Draw Stretch Aura
// line 6231
  if (weapons.stretchAura.level > 0) {
// line 6232
    const count = weapons.stretchAura.count;
// line 6233
    const rad = weapons.stretchAura.radius;
// line 6234
    for (let i = 0; i < count; i++) {
// line 6235
      const a = weapons.stretchAura.angle + (i * (Math.PI * 2 / count));
// line 6236
      const ax = player.x + Math.cos(a) * rad;
// line 6237
      const ay = player.y + Math.sin(a) * rad;
// line 6238
      ctx.fillStyle = weapons.stretchAura.isEvo ? '#38bdf8' : '#e2e8f0';
// line 6239
      ctx.beginPath(); ctx.arc(ax, ay, 11, 0, Math.PI * 2); ctx.fill();
// line 6240
      ctx.strokeStyle = weapons.stretchAura.isEvo ? '#bae6fd' : '#ffffff';
// line 6241
      ctx.lineWidth = 2.5;
// line 6242
      ctx.stroke();
// line 6243
    }
// line 6244
  }
// line 6245

// line 6246
  // 16. Draw Projectiles
// line 6247
  for (let i = 0; i < projectiles.length; i++) {
// line 6248
    const p = projectiles[i];
// line 6249
    if (p.type === 'laser') {
// line 6250
      ctx.strokeStyle = p.color;
// line 6251
      ctx.lineWidth = weapons.scanner.isEvo ? 7 : 3.5;
// line 6252
      ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
// line 6253
      ctx.strokeStyle = '#ffffff';
// line 6254
      ctx.lineWidth = weapons.scanner.isEvo ? 3 : 1.5;
// line 6255
      ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
// line 6256
      ctx.strokeStyle = '#38bdf8';
// line 6257
      ctx.lineWidth = 1.5;
// line 6258
      ctx.strokeRect(p.x2 - 10, p.y2 - 10, 20, 20);
// line 6259
    } else if (p.type === 'gas_cloud') {
// line 6260
      const alpha = (p.life / (p.maxLife || 1.5)) * 0.45;
// line 6261
      const gGrad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, p.radius);
// line 6262
      gGrad.addColorStop(0, `rgba(234, 179, 8, ${alpha})`);
// line 6263
      gGrad.addColorStop(0.6, `rgba(163, 230, 53, ${alpha * 0.7})`);
// line 6264
      gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
// line 6265
      ctx.fillStyle = gGrad;
// line 6266
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
// line 6267
    } else if (p.type === 'metal_bb') {
// line 6268
      ctx.save();
// line 6269
      ctx.translate(p.x, p.y);
// line 6270
      ctx.fillStyle = '#f8fafc';
// line 6271
      ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
// line 6272
      ctx.strokeStyle = '#64748b';
// line 6273
      ctx.lineWidth = 1.5;
// line 6274
      ctx.stroke();
// line 6275
      ctx.restore();
// line 6276
    } else if (p.type === 'pallet') {
// line 6277
      ctx.save();
// line 6278
      ctx.translate(p.x, p.y);
// line 6279
      ctx.rotate(p.rot || 0);
// line 6280
      ctx.fillStyle = '#d97706';
// line 6281
      ctx.fillRect(-16, -12, 32, 24);
// line 6282
      ctx.strokeStyle = '#78350f';
// line 6283
      ctx.lineWidth = 2;
// line 6284
      ctx.strokeRect(-16, -12, 32, 24);
// line 6285
      ctx.fillStyle = '#fef3c7';
// line 6286
      ctx.font = 'bold 8.5px sans-serif';
// line 6287
      ctx.fillText('EPAL', -11, 3);
// line 6288
      ctx.restore();
// line 6289
    } else if (p.type === 'oil_trail') {
// line 6290
      ctx.fillStyle = `rgba(15, 23, 42, ${p.life / 4.0})`;
// line 6291
      ctx.beginPath();
// line 6292
      ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
// line 6293
      ctx.fill();
// line 6294
    } else if (p.type === 'kas_red_zone') {
// line 6295
      ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + Math.sin(gameTime * 10) * 0.1})`;
// line 6296
      ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
// line 6297
      ctx.strokeStyle = '#ef4444';
// line 6298
      ctx.lineWidth = 3;
// line 6299
      ctx.strokeRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
// line 6300
      ctx.fillStyle = '#ffffff';
// line 6301
      ctx.font = '16px Arial';
// line 6302
      ctx.fillText(`REWIZJA: ${Math.ceil(p.life)}s`, p.x - 40, p.y);
// line 6303
    } else if (p.type === 'enemy_shoot') {
// line 6304
      ctx.save();
// line 6305
      ctx.translate(p.x, p.y);
// line 6306
      ctx.rotate(p.rot || 0);
// line 6307
      ctx.fillStyle = '#dc2626';
// line 6308
      ctx.fillRect(-12, -8, 24, 16);
// line 6309
      ctx.fillStyle = '#ffffff';
// line 6310
      ctx.font = '8px sans-serif';
// line 6311
      ctx.fillText('BRAK', -10, -1);
// line 6312
      ctx.fillText('DOK.', -10, 6);
// line 6313
      ctx.restore();
// line 6314
    } else if (p.type === 'zip_tie') {
// line 6315
      ctx.save();
// line 6316
      ctx.translate(p.x, p.y);
// line 6317
      ctx.rotate(p.rot || 0);
// line 6318
      ctx.fillStyle = '#0f172a';
// line 6319
      ctx.fillRect(-6, -2, 12, 4);
// line 6320
      ctx.fillStyle = p.isEvo ? '#ef4444' : '#f8fafc';
// line 6321
      ctx.fillRect(-4, -1, 8, 2);
// line 6322
      ctx.restore();
// line 6323
    } else if (p.type === 'cutter') {
// line 6324
      ctx.save();
// line 6325
      ctx.translate(p.x, p.y);
// line 6326
      ctx.rotate(p.rot || 0);
// line 6327
      ctx.fillStyle = p.isEvo ? '#f43f5e' : '#94a3b8';
// line 6328
      ctx.beginPath();
// line 6329
      ctx.moveTo(8, 0); ctx.lineTo(-6, -4); ctx.lineTo(-6, 4); ctx.fill();
// line 6330
      ctx.restore();
// line 6331
    } else if (p.type === 'toilet_paper') {
// line 6332
      ctx.save();
// line 6333
      ctx.translate(p.x, p.y);
// line 6334
      ctx.rotate(p.rot || 0);
// line 6335
      ctx.fillStyle = p.isEvo ? '#facc15' : '#ffffff';
// line 6336
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
// line 6337
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.5; ctx.stroke();
// line 6338
      ctx.restore();
// line 6339
    } else if (p.type === 'box_mortar') {
// line 6340
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
// line 6341
      ctx.beginPath(); ctx.arc(p.targetX, p.targetY, 110, 0, Math.PI * 2); ctx.fill();
// line 6342
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();
// line 6343
    } else if (p.type === 'faktura') {
// line 6344
      ctx.save();
// line 6345
      ctx.translate(p.x, p.y);
// line 6346
      ctx.rotate(p.angle || 0);
// line 6347
      ctx.fillStyle = '#f8fafc';
// line 6348
      ctx.fillRect(-10, -14, 20, 28);
// line 6349
      ctx.strokeStyle = '#dc2626';
// line 6350
      ctx.lineWidth = 1.5;
// line 6351
      ctx.strokeRect(-10, -14, 20, 28);
// line 6352
      ctx.fillStyle = '#dc2626';
// line 6353
      ctx.font = 'bold 8px Arial';
// line 6354
      ctx.fillText('KOREKTA', -9, -4);
// line 6355
      ctx.fillStyle = '#0f172a';
// line 6356
      ctx.fillRect(-8, 2, 16, 2);
// line 6357
      ctx.fillRect(-8, 6, 12, 2);
// line 6358
      ctx.restore();
// line 6359
    } else if (p.type === 'staple') {
// line 6360
      ctx.save();
// line 6361
      ctx.translate(p.x, p.y);
// line 6362
      ctx.rotate(p.rot || 0);
// line 6363
      ctx.fillStyle = p.isEvo ? '#facc15' : '#38bdf8';
// line 6364
      ctx.fillRect(-6, -2, 12, 4);
// line 6365
      ctx.fillStyle = '#ffffff';
// line 6366
      ctx.fillRect(-4, -1, 8, 2);
// line 6367
      ctx.restore();
// line 6368
    } else if (p.type === 'hydrant_beam') {
// line 6369
      ctx.save();
// line 6370
      ctx.translate(p.x, p.y);
// line 6371
      ctx.rotate(Math.atan2(p.vy, p.vx));
// line 6372
      ctx.fillStyle = p.isEvo ? 'rgba(56, 189, 248, 0.9)' : 'rgba(96, 165, 250, 0.8)';
// line 6373
      ctx.fillRect(-14, -7, 28, 14);
// line 6374
      ctx.fillStyle = '#ffffff';
// line 6375
      ctx.fillRect(-10, -3, 20, 6);
// line 6376
      ctx.restore();
// line 6377
    } else if (p.type === 'shockwave') {
// line 6378
      ctx.strokeStyle = p.color || '#f59e0b';
// line 6379
      ctx.lineWidth = Math.max(1, 4 * (1 - p.radius / (p.maxRadius || 150)));
// line 6380
      ctx.beginPath();
// line 6381
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
// line 6382
      ctx.stroke();
// line 6383
    }
// line 6384
  }
// line 6385

// line 6386
  // 17. Draw Particles (Debris, Sparks, Smoke)
// line 6387
  ctx.save();
// line 6388
  ctx.globalCompositeOperation = 'lighter';
// line 6389
  for (let i = 0; i < MAX_PARTICLES; i++) {
// line 6390
    const p = particlePool[i];
// line 6391
    if (p.active) {
// line 6392
      ctx.fillStyle = p.color;
// line 6393
      ctx.beginPath();
// line 6394
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
// line 6395
      ctx.fill();
// line 6396
    }
// line 6397
  }
// line 6398
  ctx.restore();
// line 6399

// line 6400
  // 18. Floating Damage Texts (Clamped strictly within viewport & fontScaled for high DPI crispness)
// line 6401
  ctx.save();
// line 6402
  for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
// line 6403
    const ft = floatingTexts[i];
// line 6404
    if (ft.active) {
// line 6405
const lifePct = ft.life / ft.maxLife;
// line 6406
      const alpha = Math.min(1.0, ft.life * 2.5); // Fade out later
// line 6407
      ctx.save();
// line 6408
      ctx.globalAlpha = alpha;
// line 6409
      
// line 6410
      let baseDmgSize = ft.isCrit ? 18 : 13;
// line 6411
      if (ft.isCrit) {
// line 6412
         // Massive popup scale on critical hits
// line 6413
         if (lifePct > 0.8) {
// line 6414
             baseDmgSize += (lifePct - 0.8) * 45; // Pop!
// line 6415
         }
// line 6416
      }
// line 6417
      
// line 6418
      const dmgFontSize = Math.round(baseDmgSize * fontScale);
// line 6419
      ctx.font = `900 ${dmgFontSize}px "Arial Black", Impact, sans-serif`;
// line 6420
      ctx.textAlign = 'center';
// line 6421
      ctx.textBaseline = 'middle';
// line 6422
      const clampX = Math.max(camera.x + 25 * fontScale, Math.min(camera.x + viewW - 30 * fontScale, ft.x));
// line 6423
      const clampY = Math.max(camera.y + 40 * fontScale, Math.min(camera.y + viewH - 50 * fontScale, ft.y));
// line 6424
      ctx.strokeStyle = '#000000';
// line 6425
      ctx.lineWidth = 3.5 * fontScale;
// line 6426
      ctx.strokeText(ft.text, clampX, clampY);
// line 6427
      ctx.fillStyle = ft.color;
// line 6428
      ctx.fillText(ft.text, clampX, clampY);
// line 6429
      ctx.restore();
// line 6430
    }
// line 6431
  }
// line 6432
  ctx.restore();
// line 6433

// line 6434
  // 19. Comic Speech Bubbles (Drawn at entity world coords, max 3 active)
// line 6435
  ctx.save();
// line 6436
  const bubbleFontSize = Math.round(11.5 * fontScale);
// line 6437
  ctx.font = `900 ${bubbleFontSize}px -apple-system, Roboto, sans-serif`;
// line 6438
  ctx.textAlign = 'center';
// line 6439
  ctx.textBaseline = 'middle';
// line 6440
  for (let i = 0; i < speechBubbles.length; i++) {
// line 6441
    const b = speechBubbles[i];
// line 6442
    // Skip if completely off camera
// line 6443
    if (b.x < camera.x - 60 || b.x > camera.x + viewW + 60 ||
// line 6444
        b.y < camera.y - 60 || b.y > camera.y + viewH + 60) {
// line 6445
      continue;
// line 6446
    }
// line 6447

// line 6448
    const alpha = Math.min(1.0, b.life * 1.5);
// line 6449
    ctx.save();
// line 6450
    ctx.globalAlpha = alpha;
// line 6451

// line 6452
    const tw = ctx.measureText(b.text).width;
// line 6453
    const paddingX = 8 * fontScale;
// line 6454
    const paddingY = 4 * fontScale;
// line 6455
    const rectW = tw + paddingX * 2;
// line 6456
    const rectH = (16 * fontScale) + paddingY * 2;
// line 6457

// line 6458
    const rectX = b.x - rectW / 2;
// line 6459
    const rectY = b.y - (25 * fontScale) - rectH / 2;
// line 6460

// line 6461
    // Compact dark pill container
// line 6462
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
// line 6463
    ctx.beginPath();
// line 6464
    ctx.roundRect(rectX, rectY, rectW, rectH, 6 * fontScale);
// line 6465
    ctx.fill();
// line 6466

// line 6467
    ctx.strokeStyle = b.color;
// line 6468
    ctx.lineWidth = 1.4 * fontScale;
// line 6469
    ctx.stroke();
// line 6470

// line 6471
    ctx.fillStyle = b.color;
// line 6472
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
// line 6473
    ctx.shadowBlur = 4 * fontScale;
// line 6474
    ctx.fillText(b.text, rectX + rectW / 2, rectY + rectH / 2);
// line 6475
ctx.restore();
// line 6476
  }
// line 6477
  
// line 6478
  // 19.5 Dynamic Lighting & Flashlight Pass
// line 6479
  ctx.save();
// line 6480
  ctx.globalCompositeOperation = 'multiply';
// line 6481
  const flicker = Math.sin(performance.now() / 100) * 8;
// line 6482
  const baseRadius = player.isForklift ? 180 : 120;
// line 6483
  
// line 6484
  const darkGrad = ctx.createRadialGradient(player.x, player.y, baseRadius + flicker, player.x, player.y, 1000);
// line 6485
  darkGrad.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright center
// line 6486
  darkGrad.addColorStop(0.25, 'rgba(180, 180, 195, 1)'); // Soft falloff
// line 6487
  darkGrad.addColorStop(1, 'rgba(15, 18, 26, 1)'); // Pitch black corners
// line 6488
  
// line 6489
  ctx.fillStyle = darkGrad;
// line 6490
  ctx.fillRect(camera.x - 200, camera.y - 200, viewW + 400, viewH + 400);
// line 6491
  ctx.restore();
// line 6492
  
// line 6493
  if (player.isForklift) {
// line 6494
      ctx.save();
// line 6495
      ctx.globalCompositeOperation = 'overlay';
// line 6496
      const headlightGrad = ctx.createRadialGradient(player.x, player.y, 50, player.x, player.y, 600);
// line 6497
      headlightGrad.addColorStop(0, 'rgba(255, 250, 200, 0.4)');
// line 6498
      headlightGrad.addColorStop(1, 'rgba(255, 250, 200, 0)');
// line 6499
      
// line 6500
      ctx.fillStyle = headlightGrad;
// line 6501
      ctx.beginPath();
// line 6502
      ctx.moveTo(player.x, player.y);
// line 6503
      ctx.arc(player.x, player.y, 600, player.angle - 0.4, player.angle + 0.4);
// line 6504
      ctx.fill();
// line 6505
      ctx.restore();
// line 6506
  }
// line 6507
  
// line 6508
  ctx.restore();
// line 6509
  ctx.restore();
// line 6510

// line 6511
// 20. AMOLED Screen Edge Cinematic Vignette & Low Battery Pulse
// line 6512
  const vigGrad = ctx.createRadialGradient(
// line 6513
    gameWidth / 2, gameHeight / 2, Math.min(gameWidth, gameHeight) * 0.35,
// line 6514
    gameWidth / 2, gameHeight / 2, Math.max(gameWidth, gameHeight) * 0.85
// line 6515
  );
// line 6516
  vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
// line 6517
  
// line 6518
  let edgeColor = 'rgba(2, 6, 23, 0.75)'; // Darker edges for warehouse feel
// line 6519
  
// line 6520
  // Low battery red pulsing
// line 6521
  if (player.battery < player.maxBattery * 0.25) {
// line 6522
     const pulse = (Math.sin(performance.now() / 150) + 1) / 2; // Fast heartbeat pulse
// line 6523
     edgeColor = `rgba(${100 + pulse * 100}, 0, 0, ${0.4 + pulse * 0.4})`;
// line 6524
  } else if (selectedArenaKey === 'freezer') {
// line 6525
     edgeColor = 'rgba(2, 20, 40, 0.8)'; // Cold blue edges
// line 6526
  }
// line 6527
  
// line 6528
vigGrad.addColorStop(1, edgeColor);
// line 6529
  ctx.fillStyle = vigGrad;
// line 6530
  ctx.fillRect(0, 0, gameWidth, gameHeight);
// line 6531

// line 6532
  // 21. Minimap (Radar)
// line 6533
  const mapSize = 140;
// line 6534
  const padding = 20;
// line 6535
  const mapX = gameWidth - mapSize - padding;
// line 6536
  const mapY = padding;
// line 6537
  
// line 6538
  ctx.save();
// line 6539
  ctx.globalAlpha = 0.85;
// line 6540
  
// line 6541
  // Minimap Background
// line 6542
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
// line 6543
  ctx.strokeStyle = '#38bdf8';
// line 6544
  ctx.lineWidth = 2;
// line 6545
  ctx.beginPath();
// line 6546
  ctx.roundRect(mapX, mapY, mapSize, mapSize, 8);
// line 6547
  ctx.fill();
// line 6548
  ctx.stroke();
// line 6549
  
// line 6550
  // Clip for drawing inside map
// line 6551
  ctx.clip();
// line 6552
  
// line 6553
  const scaleX = mapSize / ARENA_WIDTH;
// line 6554
  const scaleY = mapSize / ARENA_HEIGHT;
// line 6555
  
// line 6556
  // Draw Obstacles (Grey)
// line 6557
  ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
// line 6558
  for (let i = 0; i < obstacles.length; i++) {
// line 6559
     const o = obstacles[i];
// line 6560
     ctx.fillRect(mapX + o.x * scaleX, mapY + o.y * scaleY, Math.max(1, o.w * scaleX), Math.max(1, o.h * scaleY));
// line 6561
  }
// line 6562
  
// line 6563
  // Draw drops/xp (Small yellow dots)
// line 6564
  ctx.fillStyle = '#facc15';
// line 6565
  for (let i = 0; i < dropItems.length; i++) {
// line 6566
     const d = dropItems[i];
// line 6567
     if (d.type !== 'lucky_chest') {
// line 6568
         ctx.fillRect(mapX + d.x * scaleX, mapY + d.y * scaleY, 1.5, 1.5);
// line 6569
     } else {
// line 6570
         ctx.fillStyle = '#38bdf8';
// line 6571
         ctx.fillRect(mapX + d.x * scaleX - 1.5, mapY + d.y * scaleY - 1.5, 3, 3);
// line 6572
         ctx.fillStyle = '#facc15';
// line 6573
     }
// line 6574
  }
// line 6575

// line 6576
  // Draw Enemies (Red)
// line 6577
  ctx.fillStyle = '#ef4444';
// line 6578
  for (let i = 0; i < enemies.length; i++) {
// line 6579
     const e = enemies[i];
// line 6580
     const es = e.isBoss ? 4 : 2.5;
// line 6581
     if (e.isBoss) ctx.fillStyle = '#a855f7';
// line 6582
     ctx.fillRect(mapX + e.x * scaleX - es/2, mapY + e.y * scaleY - es/2, es, es);
// line 6583
     if (e.isBoss) ctx.fillStyle = '#ef4444';
// line 6584
  }
// line 6585
  
// line 6586
  // Draw Player (Green/Cyan)
// line 6587
  ctx.fillStyle = '#10b981';
// line 6588
  ctx.beginPath();
// line 6589
  ctx.arc(mapX + player.x * scaleX, mapY + player.y * scaleY, 3, 0, Math.PI * 2);
// line 6590
  ctx.fill();
// line 6591
  
// line 6592
  // Draw Camera Viewport (White outline)
// line 6593
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
// line 6594
  ctx.lineWidth = 1;
// line 6595
  const viewW_scaled = (gameWidth / camera.zoom) * scaleX;
// line 6596
  const viewH_scaled = (gameHeight / camera.zoom) * scaleY;
// line 6597
  ctx.strokeRect(mapX + camera.x * scaleX, mapY + camera.y * scaleY, viewW_scaled, viewH_scaled);
// line 6598
  
// line 6599
  ctx.restore();
// line 6600
}
// line 6601

// line 6602

// line 6603
function gameLoop(now) {
// line 6604
  if (!lastTime || isNaN(lastTime)) lastTime = now || performance.now();
// line 6605
  if (!now) now = performance.now();
// line 6606
  let dt = Math.min(0.1, Math.max(0, (now - lastTime) / 1000));
// line 6607
  if (isNaN(dt)) dt = 0.016;
// line 6608
  lastTime = now;
// line 6609
  
// line 6610
  if (window.timeScale === undefined) window.timeScale = 1.0;
// line 6611
  if (window.timeScale < 1.0) {
// line 6612
      window.timeScale = Math.min(1.0, window.timeScale + dt * 0.85); // Smoothly recover from slow-mo
// line 6613
  }
// line 6614
  
// line 6615
  // Apply time scale to game logic update, but keep UI (particles/texts) real-time or semi-real-time
// line 6616
  const gameDt = dt * window.timeScale;
// line 6617

// line 6618
  // Update particles & texts
// line 6619

// line 6620
  for (let i = 0; i < MAX_PARTICLES; i++) {
// line 6621
    const p = particlePool[i];
// line 6622
if (p.active) {
// line 6623
      p.x += p.vx; p.y += p.vy; p.life -= dt;
// line 6624
      p.vx *= 0.92; p.vy *= 0.92; // Friction so they don't slide forever
// line 6625
      if (p.life <= 0) p.active = false;
// line 6626
    }
// line 6627
  }
// line 6628
  for (let i = 0; i < MAX_FLOATING_TEXTS; i++) {
// line 6629
    const ft = floatingTexts[i];
// line 6630
    if (ft.active) {
// line 6631
      ft.y -= dt * 25; ft.life -= dt;
// line 6632
      if (ft.life <= 0) ft.active = false;
// line 6633
    }
// line 6634
  }
// line 6635

// line 6636
  update(gameDt);
// line 6637
  render();
// line 6638
  requestAnimationFrame(gameLoop);
// line 6639
}
// line 6640
requestAnimationFrame(gameLoop);
// line 6641

// line 6642
// --- STATE MANAGERS & SAVING ---
// line 6643
function startGame() {
// line 6644
  try {
// line 6645
    sounds.init();
// line 6646
    document.getElementById('start-screen').style.display = 'none';
// line 6647
    showIntroDialog();
// line 6648
  } catch (err) {
// line 6649
    alert("START ERROR: " + err.message);
// line 6650
  }
// line 6651
}
// line 6652

// line 6653
function startGamePlay() {
// line 6654
  initSectorEnvironment();
// line 6655
  try {
// line 6656
    const c = CHARACTERS[selectedCharKey] || CHARACTERS['piotr'];
// line 6657
  player.x = ARENA_WIDTH / 2;
// line 6658
  player.y = ARENA_HEIGHT / 2;
// line 6659
  player.vx = 0;
// line 6660
  player.vy = 0;
// line 6661
  
// line 6662
  // Base stats modified by Workshop permanent upgrades
// line 6663
  player.maxBattery = c.maxBattery + (workshopUpgrades.battery * 25);
// line 6664
  player.battery = player.maxBattery;
// line 6665
  player.speed = c.speed * (1 + workshopUpgrades.speed * 0.08);
// line 6666
  player.damageMult = (1 + workshopUpgrades.damage * 0.12);
// line 6667
  player.magnetRange = c.magnet + (workshopUpgrades.magnet * 35);
// line 6668
  player.critChance = c.critBonus;
// line 6669
  player.attackSpeedMult = c.attackSpeedMult || 1.0;
// line 6670
  player.maxSkillCooldown = Math.max(2, c.skillCooldown * (1 - workshopUpgrades.cooldown * 0.08));
// line 6671
  player.skillCooldown = 0;
// line 6672
  player.detentionCooldown = 0;
// line 6673
  player.rerolls = selectedCharKey === 'klaus' ? 4 : 2;
// line 6674

// line 6675
  // Reset all weapons & passives
// line 6676
  Object.keys(weapons).forEach(k => {
// line 6677
    weapons[k].level = 0;
// line 6678
    weapons[k].isEvo = false;
// line 6679
    weapons[k].timer = 0;
// line 6680
  });
// line 6681
  Object.keys(passives).forEach(k => {
// line 6682
    passives[k].level = 0;
// line 6683
  });
// line 6684

// line 6685
  // Assign starting weapon tailored to character lore
// line 6686
  if (selectedCharKey === 'marcin') {
// line 6687
    weapons.toiletPaper.level = 1; // Marcin Wojownik Velvet
// line 6688
  } else if (selectedCharKey === 'mirek') {
// line 6689
    weapons.sledgehammer.level = 1; // Pan Mirek Złota Rączka
// line 6690
  } else if (selectedCharKey === 'klaus') {
// line 6691
    weapons.stapler.level = 1; // Audytor Klaus Centrala
// line 6692
  } else if (selectedCharKey === 'radek') {
// line 6693
    weapons.cutter.level = 1; // Radek Weteran BT
// line 6694
  } else if (selectedCharKey === 'pawel') {
// line 6695
    weapons.pallets.level = 1; // Paweł Ekspert EPAL
// line 6696
  } else if (selectedCharKey === 'kierownik_marcin') {
// line 6697
    weapons.extinguisher.level = 1; // Kierownik Marcin PPOŻ
// line 6698
  } else if (selectedCharKey === 'przemek_biuro') {
// line 6699
    weapons.scanner.level = 1; // Przemek z biura WMS
// line 6700
    passives.magnet.level = 1;
// line 6701
  } else if (selectedCharKey === 'ania_biuro') {
// line 6702
    weapons.zipTies.level = 1; // Ania z biura Celnego
// line 6703
  } else if (selectedCharKey === 'grzesiek_zastepca') {
// line 6704
    weapons.stretchAura.level = 1; // Grzesiek Zastępca
// line 6705
    passives.coffee.level = 1;
// line 6706
  } else {
// line 6707
    // Piotr (domyślny)
// line 6708
    weapons.scanner.level = 1;
// line 6709
  }
// line 6710

// line 6711
  enemies = [];
// line 6712
  projectiles = [];
// line 6713
  dropItems = [];
// line 6714
  initMapProps();
// line 6715
  gameTime = 0;
// line 6716
  score = 0;
// line 6717
  kills = 0;
// line 6718
  comboCount = 0;
// line 6719
  packageCombo = 0;
// line 6720
  packageComboTimer = 0;
// line 6721
  maxPackageCombo = 0;
// line 6722
  mysteryTimer = 0; mysteryActive = ''; mysteryBuffMultiplier = 1.0;
// line 6723
  playerLevel = 1;
// line 6724
  currentXP = 0;
// line 6725
  neededXP = 8;
// line 6726
  currentSectorIndex = 0;
// line 6727
  spawnedBossSectors = [false, false, false, false, false];
// line 6728
  activeBoss = null;
// line 6729
  rebuildSectorEnvironment(0);
// line 6730

// line 6731
  document.getElementById('start-screen').style.display = 'none';
// line 6732
  document.getElementById('intro-screen').style.display = 'none';
// line 6733
  document.getElementById('stage-transition-screen').style.display = 'none';
// line 6734
  document.getElementById('gameover-screen').style.display = 'none';
// line 6735
  document.getElementById('win-screen').style.display = 'none';
// line 6736
  document.getElementById('chest-screen').style.display = 'none';
// line 6737
  document.getElementById('pause-screen').style.display = 'none';
// line 6738

// line 6739
  updateWeaponsHud();
// line 6740
  gameState = STATE.PLAYING;
// line 6741
  triggerAchievement('first_blood', 'Pierwsza Odprawa', '📦');
// line 6742
  showAnnouncement('📍 SEKTOR 1: DOKI ROZŁADUNKOWE', '#f59e0b');
// line 6743
  } catch (err) {
// line 6744
    alert("PLAY ERROR: " + err.message + "\n" + err.stack);
// line 6745
  }
// line 6746
}
// line 6747

// line 6748
function gameOver(shiftTime, isWin) {
// line 6749
  gameState = isWin ? STATE.WIN : STATE.GAMEOVER;
// line 6750
  const bestCombo = Math.max(maxCombo, maxPackageCombo);
// line 6751
  dtaCoins += Math.floor(score / 15);
// line 6752
  saveWorkshopData();
// line 6753

// line 6754
  if (isWin) {
// line 6755
    triggerAchievement('shift_master', '07:00 - Fajrant Marzeń', '🏆');
// line 6756
    document.getElementById('win-stats').innerText = `Dotrwałeś do 07:00! Wynik: ${score} | Kills: ${kills} | Max Combo: x${bestCombo} | Monety: +${Math.floor(score/15)}`;
// line 6757
    document.getElementById('win-screen').style.display = 'flex';
// line 6758
  } else {
// line 6759
    document.getElementById('gameover-stats').innerText = `Przetrwano do: ${shiftTime} | Sektor: ${currentSectorIndex + 1} | Punkty: ${score} | Poziom: ${playerLevel} | Monety: +${Math.floor(score/15)}`;
// line 6760
    document.getElementById('gameover-screen').style.display = 'flex';
// line 6761
  }
// line 6762

// line 6763
  if (window.AndroidBridge && window.AndroidBridge.saveGameScore) {
// line 6764
    window.AndroidBridge.saveGameScore(score, kills, playerLevel, Math.floor(gameTime), shiftTime, isWin);
// line 6765
  }
// line 6766
}
// line 6767

// line 6768

// line 6769
document.getElementById('btn-restart').onclick = startGame;
// line 6770
document.getElementById('btn-win-restart').onclick = startGame;
// line 6771

// line 6772
function switchTab(tabId, btnElement) {
// line 6773
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
// line 6774
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
// line 6775
  let evt = typeof event !== 'undefined' ? event : null;
// line 6776
  const targetBtn = btnElement || (evt && evt.target && evt.target.closest('.tab-btn')) || document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
// line 6777
  if (targetBtn) targetBtn.classList.add('active');
// line 6778
  const targetContent = document.getElementById('tab-' + tabId);
// line 6779
  if (targetContent) targetContent.classList.add('active');
// line 6780
  if (tabId === 'workshop') renderWorkshopTab();
// line 6781
  if (tabId === 'scores') renderScoresTab();
// line 6782
  if (tabId === 'achievements') renderAchievementsTab();
// line 6783
}
// line 6784

// line 6785
const WORKSHOP_ITEMS = [
// line 6786
  { key: 'battery', name: 'Wzmocniona Bateria Litowa', icon: '🔋', baseCost: 150, maxLvl: 5, desc: '+25 Max HP baterii za poziom' },
// line 6787
  { key: 'speed', name: 'Kółka Poliuretanowe BT', icon: '🛞', baseCost: 200, maxLvl: 5, desc: '+8% Szybkości jazdy i biegu' },
// line 6788
  { key: 'damage', name: 'Wzmocniony Zderzak Stalowy', icon: '💥', baseCost: 250, maxLvl: 5, desc: '+12% Wszystkich obrażeń' },
// line 6789
  { key: 'magnet', name: 'Cewka Magnetyczna KAS', icon: '🧲', baseCost: 150, maxLvl: 5, desc: '+35 Zasięgu przyciągania kodów kreskowych' },
// line 6790
  { key: 'cooldown', name: 'Chłodnica Oleju Przekładniowego', icon: '❄️', baseCost: 300, maxLvl: 5, desc: '-8% Czasu odnowienia umiejętności' }
// line 6791
];
// line 6792

// line 6793
function renderWorkshopTab() {
// line 6794
  const container = document.getElementById('workshop-container');
// line 6795
  const coinsDisplay = document.getElementById('shop-coins-display');
// line 6796
  if (coinsDisplay) coinsDisplay.innerText = `💰 ${dtaCoins} MONET`;
// line 6797
  saveWorkshopData();
// line 6798
  if (!container) return;
// line 6799
  container.innerHTML = WORKSHOP_ITEMS.map(item => {
// line 6800
    const curLvl = workshopUpgrades[item.key] || 0;
// line 6801
    const cost = Math.floor(item.baseCost * Math.pow(1.6, curLvl));
// line 6802
    const isMax = curLvl >= item.maxLvl;
// line 6803
    const canAfford = dtaCoins >= cost && !isMax;
// line 6804
    return `
// line 6805
      <div class="workshop-card">
// line 6806
        <div style="font-size:28px;">${item.icon}</div>
// line 6807
        <div class="workshop-name">${item.name} (Poz. ${curLvl}/${item.maxLvl})</div>
// line 6808
        <div class="workshop-desc">${item.desc}</div>
// line 6809
        <div class="workshop-cost">${isMax ? 'MAX POZIOM' : 'Cena: ' + cost + ' monet'}</div>
// line 6810
        <button class="upgrade-btn ${canAfford ? 'can-afford' : ''}" ${!canAfford ? 'disabled' : ''} onclick="buyWorkshopUpgrade('${item.key}', ${cost})">
// line 6811
          ${isMax ? 'WYKUPIONE' : 'ULEPSZ ➔'}
// line 6812
        </button>
// line 6813
      </div>
// line 6814
    `;
// line 6815
  }).join('');
// line 6816
}
// line 6817

// line 6818
function buyWorkshopUpgrade(key, cost) {
// line 6819
  if (dtaCoins >= cost && (workshopUpgrades[key] || 0) < 5) {
// line 6820
    dtaCoins -= cost;
// line 6821
    workshopUpgrades[key] = (workshopUpgrades[key] || 0) + 1;
// line 6822
    saveWorkshopData();
// line 6823
    sounds.achieve();
// line 6824
    renderWorkshopTab();
// line 6825
  }
// line 6826
}
// line 6827

// line 6828
// Initial UI Setup
// line 6829
saveWorkshopData();
// line 6830

// line 6831
function renderScoresTab() {
// line 6832
  const c = document.getElementById('scores-container');
// line 6833
  if (!roomScores || roomScores.length === 0) {
// line 6834
    c.innerHTML = '<div style="color:#64748b; text-align:center; padding:15px;">Brak zapisanych zmian.</div>';
// line 6835
    return;
// line 6836
  }
// line 6837
  c.innerHTML = roomScores.map((s, i) => `
// line 6838
    <div class="score-row">
// line 6839
      <div><b>#${i+1}</b> ${s.isWin ? '🏆 FAJRANT' : '💀 ZJAZD'} (${s.shiftTimeFormatted})</div>
// line 6840
      <div>⭐ ${s.score} pkt | 💀 ${s.kills} | LVL ${s.level}</div>
// line 6841
    </div>
// line 6842
  `).join('');
// line 6843
}
// line 6844

// line 6845
function renderAchievementsTab() {
// line 6846
  const c = document.getElementById('achievements-container');
// line 6847
  if (!roomAchievements || roomAchievements.length === 0) return;
// line 6848
  c.innerHTML = roomAchievements.map(a => `
// line 6849
    <div class="ach-card ${a.unlocked ? 'unlocked' : ''}">
// line 6850
      <div class="ach-icon">${a.icon}</div>
// line 6851
      <div class="ach-info">
// line 6852
        <div class="ach-title">${a.title}</div>
// line 6853
        <div class="ach-desc">${a.isSecret && !a.unlocked ? '??? (Osiągnięcie Tajne BHP)' : a.description}</div>
// line 6854
      </div>
// line 6855
    </div>
// line 6856
  `).join('');
// line 6857
}
// line 6858

// line 6859
// --- EXPOSE GAME BRIDGE API ON WINDOW ---
// line 6860
window.startGamePlay = startGamePlay;
// line 6861
window.startGame = startGame;
// line 6862
window.selectCharacter = function(key, el) { selectCharacter(key, el); };
// line 6863
window.selectArena = function(arena, el) { selectArena(arena, el); };
// line 6864
window.selectGameMode = function(mode, el) { selectGameMode(mode, el); };
// line 6865
window.buyWorkshopUpgrade = function(key, cost) { buyWorkshopUpgrade(key, cost); };
// line 6866
if (typeof sounds !== 'undefined') {
// line 6867
  window.sounds = sounds;
// line 6868
}
// line 6869

