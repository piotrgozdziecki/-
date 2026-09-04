const fs = require('fs');
let code = fs.readFileSync('/app/src/main/assets/game.html', 'utf8');

// 1. Add badge-zoom to status-panel
const oldStatus = `<div class="status-panel">
        <div id="badge-battery" class="stat-badge badge-battery">⚡ 100%</div>
        <div id="badge-clock" class="stat-badge badge-clock">🕒 03:15</div>
        <div id="badge-combo" class="stat-badge badge-combo">🔥 COMBO x1</div>
      </div>`;

const newStatus = `<div class="status-panel">
        <div id="badge-battery" class="stat-badge badge-battery">⚡ 100%</div>
        <div id="badge-clock" class="stat-badge badge-clock">🕒 03:15</div>
        <div id="badge-combo" class="stat-badge badge-combo">🔥 COMBO x1</div>
        <div id="badge-zoom" class="stat-badge" onclick="toggleZoom()" style="border-color: #38bdf8; color: #7dd3fc; pointer-events: auto; cursor: pointer;" title="Przełącz perspektywę widoku">🔍 <span id="badge-zoom-label">0.62x</span></div>
      </div>`;

code = code.replace(oldStatus, newStatus);

// 2. Camera zoom
code = code.replace(
  'const camera = { x: 0, y: 0 };',
  `const camera = { x: 0, y: 0, zoom: 0.62 };
function toggleZoom() {
  if (camera.zoom > 0.75) camera.zoom = 0.62;
  else if (camera.zoom > 0.55) camera.zoom = 0.48;
  else camera.zoom = 0.85;
  const el = document.getElementById('badge-zoom-label');
  if (el) el.innerText = camera.zoom.toFixed(2) + 'x';
}`
);

// 3. Speeds in CHARACTERS
code = code.replace(/speed:\s*2\.3,/g, 'speed: 1.55,');
code = code.replace(/speed:\s*2\.2,/g, 'speed: 1.45,');
code = code.replace(/speed:\s*1\.9,/g, 'speed: 1.40,');
code = code.replace(/speed:\s*2\.4,/g, 'speed: 1.50,');
code = code.replace(/speed:\s*1\.8,/g, 'speed: 1.35,');
code = code.replace(/speed:\s*2\.1,/g, 'speed: 1.45,');
code = code.replace(/speed:\s*2\.0,/g, 'speed: 1.40,');

// 4. Enemy speeds
code = code.replace("FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 2.5,", "FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 1.4,");
code = code.replace("FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 3.8,", "FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 2.1,");
code = code.replace("KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 1.8,", "KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 1.0,");
code = code.replace("KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 2.2,", "KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 1.3,");
code = code.replace("WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 6.0,", "WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 2.8,");
code = code.replace("PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 0.6,", "PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 0.35,");
code = code.replace("RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 0.4,", "RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 0.25,");
code = code.replace("CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 1.2,", "CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 0.75,");
code = code.replace("BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 1.5,", "BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 0.9,");
code = code.replace("BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 0.2,", "BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 0.15,");
code = code.replace("speed: 3.2,", "speed: 1.8,");
code = code.replace("speed: 1.0,", "speed: 0.65,");
code = code.replace("speed: 4.5,", "speed: 2.4,");

// 5. Weapon speeds
code = code.replace("toiletPaper: { level: 0, timer: 0, cooldown: 1.4, damage: 45, speed: 7.5,", "toiletPaper: { level: 0, timer: 0, cooldown: 1.4, damage: 45, speed: 5.2,");
code = code.replace("pallets: { level: 0, timer: 0, cooldown: 1.8, damage: 70, speed: 8.0,", "pallets: { level: 0, timer: 0, cooldown: 1.8, damage: 70, speed: 5.5,");
code = code.replace("zipTies: { level: 0, timer: 0, cooldown: 1.2, damage: 25, speed: 10,", "zipTies: { level: 0, timer: 0, cooldown: 1.2, damage: 25, speed: 7.0,");
code = code.replace("cutter: { level: 0, timer: 0, cooldown: 0.7, damage: 15, speed: 12,", "cutter: { level: 0, timer: 0, cooldown: 0.7, damage: 15, speed: 8.0,");

// 6. Movement physics & multipliers
code = code.replace("if (player.isForklift) curSpeed *= 2.1;", "if (player.isForklift) curSpeed *= 1.45;");
code = code.replace("if (player.isDashing) curSpeed *= (player.isForklift ? 1.8 : 2.6);", "if (player.isDashing) curSpeed *= (player.isForklift ? 1.4 : 1.75);");
code = code.replace("const comboBoost = Math.min(1.48, 1.0 + packageCombo * 0.022);", "const comboBoost = Math.min(1.20, 1.0 + packageCombo * 0.01);");
code = code.replace("player.vx += moveX * 0.45;", "player.vx += moveX * 0.28;");
code = code.replace("player.vy += moveY * 0.45;", "player.vy += moveY * 0.28;");
code = code.replace("player.vx *= 0.90;", "player.vx *= 0.86;");
code = code.replace("player.vy *= 0.90;", "player.vy *= 0.86;");

// 7. Camera follow
code = code.replace(
  `  // Smooth Camera Follow
  camera.x += (player.x - gameWidth / 2 - camera.x) * 0.12;
  camera.y += (player.y - gameHeight / 2 - camera.y) * 0.12;`,
  `  // Smooth Camera Follow with Perspective Zoom
  const viewW = gameWidth / camera.zoom;
  const viewH = gameHeight / camera.zoom;
  camera.x += (player.x - viewW / 2 - camera.x) * 0.10;
  camera.y += (player.y - viewH / 2 - camera.y) * 0.10;`
);

// 8. Spawn clock
code = code.replace(
  "if (spawnClock >= Math.max(0.35, 1.2 - (gameTime / TOTAL_SHIFT_DURATION) * 0.7)) {",
  "if (spawnClock >= Math.max(0.75, 1.8 - (gameTime / TOTAL_SHIFT_DURATION) * 0.9)) {"
);

// 9. Render pass transform
code = code.replace(
  `function render() {
  ctx.save();
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // Apply Camera Shake & Translation
  const shakeX = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  const shakeY = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);`,
  `function render() {
  ctx.save();
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  const viewW = gameWidth / camera.zoom;
  const viewH = gameHeight / camera.zoom;

  // Apply Camera Zoom & Shake & Translation
  ctx.scale(camera.zoom, camera.zoom);
  const shakeX = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  const shakeY = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);`
);

// 10. Replace culling checks inside render()
code = code.replace(/camera\.x \+ gameWidth \+/g, 'camera.x + viewW +');
code = code.replace(/camera\.y \+ gameHeight \+/g, 'camera.y + viewH +');
code = code.replace(/camera\.x \+ gameWidth/g, 'camera.x + viewW');
code = code.replace(/camera\.y \+ gameHeight/g, 'camera.y + viewH');

fs.writeFileSync('/app/src/main/assets/game.html', code, 'utf8');
console.log('Successfully updated game.html via Node script!');
