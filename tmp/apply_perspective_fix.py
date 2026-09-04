import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add badge-zoom to status-panel
old_status_panel = '''      <div class="status-panel">
        <div id="badge-battery" class="stat-badge badge-battery">⚡ 100%</div>
        <div id="badge-clock" class="stat-badge badge-clock">🕒 03:15</div>
        <div id="badge-combo" class="stat-badge badge-combo">🔥 COMBO x1</div>
      </div>'''

new_status_panel = '''      <div class="status-panel">
        <div id="badge-battery" class="stat-badge badge-battery">⚡ 100%</div>
        <div id="badge-clock" class="stat-badge badge-clock">🕒 03:15</div>
        <div id="badge-combo" class="stat-badge badge-combo">🔥 COMBO x1</div>
        <div id="badge-zoom" class="stat-badge" onclick="toggleZoom()" style="border-color: #38bdf8; color: #7dd3fc; pointer-events: auto; cursor: pointer;" title="Przełącz perspektywę widoku">🔍 <span id="badge-zoom-label">0.62x</span></div>
      </div>'''

content = content.replace(old_status_panel, new_status_panel, 1)

# 2. Add zoom to camera object and toggleZoom function
old_camera = '''// Camera
const camera = { x: 0, y: 0 };
let screenShake = 0;'''

new_camera = '''// Camera (Perspective Zoom 0.62x default for wide warehouse tactical view)
const camera = { x: 0, y: 0, zoom: 0.62 };
function toggleZoom() {
  if (camera.zoom > 0.75) {
    camera.zoom = 0.62;
  } else if (camera.zoom > 0.55) {
    camera.zoom = 0.48;
  } else {
    camera.zoom = 0.85;
  }
  const btn = document.getElementById('badge-zoom-label');
  if (btn) btn.innerText = camera.zoom.toFixed(2) + 'x';
}
let screenShake = 0;'''

content = content.replace(old_camera, new_camera, 1)

# 3. Update CHARACTERS speed values
old_chars = '''const CHARACTERS = {
  piotr: {
    id: 'piotr',
    name: 'Piotr & Kluska 🐕',
    icon: '📦🐕',
    speed: 2.3,
    maxBattery: 110,
    magnet: 180,
    critBonus: 0.20,
    attackSpeedMult: 1.35, // Pasywka: Szybkie Ładowanie (+35% szybszy atak)
    skillIcon: '🔫🐕',
    skillLabel: 'GAZ & KLUSKA',
    skillCooldown: 6.5
  },
  radek: {
    id: 'radek',
    name: 'Radek (Weteran BT)',
    icon: '🚜',
    speed: 2.2,
    maxBattery: 100,
    magnet: 140,
    critBonus: 0.20,
    attackSpeedMult: 1.0,
    skillIcon: '💨',
    skillLabel: 'SZARŻA',
    skillCooldown: 7.5
  },
  pawel: {
    id: 'pawel',
    name: 'Paweł (Ekspert EPAL)',
    icon: '🪵',
    speed: 1.9,
    maxBattery: 120,
    magnet: 150,
    critBonus: 0.10,
    attackSpeedMult: 1.10,
    skillIcon: '🪵',
    skillLabel: 'SALWA',
    skillCooldown: 8.0
  },
  marcin: {
    id: 'marcin',
    name: 'Marcin (Nocny Wojownik)',
    icon: '🧻',
    speed: 2.4,
    maxBattery: 95,
    magnet: 190,
    critBonus: 0.15,
    attackSpeedMult: 1.15,
    skillIcon: '🧻',
    skillLabel: 'VELVET',
    skillCooldown: 6.5
  },
  kierownik_marcin: {
    id: 'kierownik_marcin',
    name: 'Kierownik Marcin',
    icon: '📢',
    speed: 1.8,
    maxBattery: 150,
    magnet: 140,
    critBonus: 0.10,
    attackSpeedMult: 1.05,
    skillIcon: '📢',
    skillLabel: 'MEGAFON',
    skillCooldown: 8.5
  },
  przemek_biuro: {
    id: 'przemek_biuro',
    name: 'Przemek z biura',
    icon: '💻',
    speed: 2.1,
    maxBattery: 90,
    magnet: 260, // Szalony zasięg XP WMS
    critBonus: 0.25,
    attackSpeedMult: 1.20,
    skillIcon: '💻',
    skillLabel: 'KOD WMS',
    skillCooldown: 7.5
  },
  ania_biuro: {
    id: 'ania_biuro',
    name: 'Ania z biura',
    icon: '📋',
    speed: 2.2,
    maxBattery: 95,
    magnet: 180,
    critBonus: 0.40, // Potężne krytyki celne SAD
    attackSpeedMult: 1.10,
    skillIcon: '❄️',
    skillLabel: 'BLOKADA',
    skillCooldown: 7.0
  },
  grzesiek_zastepca: {
    id: 'grzesiek_zastepca',
    name: 'Grzesiek (Z-ca Kiero)',
    icon: '☕',
    speed: 2.0,'''

new_chars = '''const CHARACTERS = {
  piotr: {
    id: 'piotr',
    name: 'Piotr & Kluska 🐕',
    icon: '📦🐕',
    speed: 1.55,
    maxBattery: 110,
    magnet: 180,
    critBonus: 0.20,
    attackSpeedMult: 1.35, // Pasywka: Szybkie Ładowanie (+35% szybszy atak)
    skillIcon: '🔫🐕',
    skillLabel: 'GAZ & KLUSKA',
    skillCooldown: 6.5
  },
  radek: {
    id: 'radek',
    name: 'Radek (Weteran BT)',
    icon: '🚜',
    speed: 1.45,
    maxBattery: 100,
    magnet: 140,
    critBonus: 0.20,
    attackSpeedMult: 1.0,
    skillIcon: '💨',
    skillLabel: 'SZARŻA',
    skillCooldown: 7.5
  },
  pawel: {
    id: 'pawel',
    name: 'Paweł (Ekspert EPAL)',
    icon: '🪵',
    speed: 1.40,
    maxBattery: 120,
    magnet: 150,
    critBonus: 0.10,
    attackSpeedMult: 1.10,
    skillIcon: '🪵',
    skillLabel: 'SALWA',
    skillCooldown: 8.0
  },
  marcin: {
    id: 'marcin',
    name: 'Marcin (Nocny Wojownik)',
    icon: '🧻',
    speed: 1.50,
    maxBattery: 95,
    magnet: 190,
    critBonus: 0.15,
    attackSpeedMult: 1.15,
    skillIcon: '🧻',
    skillLabel: 'VELVET',
    skillCooldown: 6.5
  },
  kierownik_marcin: {
    id: 'kierownik_marcin',
    name: 'Kierownik Marcin',
    icon: '📢',
    speed: 1.35,
    maxBattery: 150,
    magnet: 140,
    critBonus: 0.10,
    attackSpeedMult: 1.05,
    skillIcon: '📢',
    skillLabel: 'MEGAFON',
    skillCooldown: 8.5
  },
  przemek_biuro: {
    id: 'przemek_biuro',
    name: 'Przemek z biura',
    icon: '💻',
    speed: 1.45,
    maxBattery: 90,
    magnet: 260, // Szalony zasięg XP WMS
    critBonus: 0.25,
    attackSpeedMult: 1.20,
    skillIcon: '💻',
    skillLabel: 'KOD WMS',
    skillCooldown: 7.5
  },
  ania_biuro: {
    id: 'ania_biuro',
    name: 'Ania z biura',
    icon: '📋',
    speed: 1.45,
    maxBattery: 95,
    magnet: 180,
    critBonus: 0.40, // Potężne krytyki celne SAD
    attackSpeedMult: 1.10,
    skillIcon: '❄️',
    skillLabel: 'BLOKADA',
    skillCooldown: 7.0
  },
  grzesiek_zastepca: {
    id: 'grzesiek_zastepca',
    name: 'Grzesiek (Z-ca Kiero)',
    icon: '☕',
    speed: 1.40,'''

content = content.replace(old_chars, new_chars, 1)

# 4. Update ENEMY_TYPES speeds
old_enemies = '''const ENEMY_TYPES = {
  FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 2.5, radius: 15, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#cbd5e1', itemIcon: '🗞️', xp: 2 },
  FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 3.8, radius: 10, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#e2e8f0', itemIcon: '💨', xp: 1 },
  KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 1.8, radius: 12, renderType: 'pedestrian', color: '#d97706', clothColor: '#b45309', itemIcon: '📦', xp: 1 },
  KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 2.2, radius: 18, renderType: 'pedestrian', color: '#ef4444', clothColor: '#1e293b', itemIcon: '🚛', xp: 4, canDash: true },
  WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 6.0, radius: 24, renderType: 'pedestrian', color: '#ea580c', clothColor: '#991b1b', itemIcon: '⚠️', xp: 8, straightLine: true },
  PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 0.6, radius: 28, renderType: 'pedestrian', color: '#78350f', clothColor: '#451a03', itemIcon: '🧱', xp: 10, armor: true },
  RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 0.4, radius: 35, renderType: 'pedestrian', color: '#475569', clothColor: '#0f172a', itemIcon: '🚧', xp: 15, directionalShield: true },
  CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 1.2, radius: 16, renderType: 'pedestrian', color: '#dc2626', clothColor: '#7f1d1d', itemIcon: '🛑', xp: 5, shooter: true },
  BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 1.5, radius: 30, renderType: 'pedestrian', color: '#ef4444', clothColor: '#000000', itemIcon: '🦅', xp: 500, mechanics: 'kas_zone' },
  BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 0.2, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 1000, mechanics: 'spawner' },

  PRAKTYKANT: {
    name: 'Zagubiony Praktykant',
    hp: 15,
    speed: 3.2,
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
    speed: 1.0,
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
    speed: 4.5,'''

new_enemies = '''const ENEMY_TYPES = {
  FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 1.4, radius: 15, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#cbd5e1', itemIcon: '🗞️', xp: 2 },
  FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 2.1, radius: 10, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#e2e8f0', itemIcon: '💨', xp: 1 },
  KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 1.0, radius: 12, renderType: 'pedestrian', color: '#d97706', clothColor: '#b45309', itemIcon: '📦', xp: 1 },
  KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 1.3, radius: 18, renderType: 'pedestrian', color: '#ef4444', clothColor: '#1e293b', itemIcon: '🚛', xp: 4, canDash: true },
  WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 2.8, radius: 24, renderType: 'pedestrian', color: '#ea580c', clothColor: '#991b1b', itemIcon: '⚠️', xp: 8, straightLine: true },
  PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 0.35, radius: 28, renderType: 'pedestrian', color: '#78350f', clothColor: '#451a03', itemIcon: '🧱', xp: 10, armor: true },
  RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 0.25, radius: 35, renderType: 'pedestrian', color: '#475569', clothColor: '#0f172a', itemIcon: '🚧', xp: 15, directionalShield: true },
  CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 0.75, radius: 16, renderType: 'pedestrian', color: '#dc2626', clothColor: '#7f1d1d', itemIcon: '🛑', xp: 5, shooter: true },
  BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 0.9, radius: 30, renderType: 'pedestrian', color: '#ef4444', clothColor: '#000000', itemIcon: '🦅', xp: 500, mechanics: 'kas_zone' },
  BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 0.15, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 1000, mechanics: 'spawner' },

  PRAKTYKANT: {
    name: 'Zagubiony Praktykant',
    hp: 15,
    speed: 1.8,
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
    speed: 0.65,
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
    speed: 2.4,'''

content = content.replace(old_enemies, new_enemies, 1)

# 5. Update weapon speeds
content = content.replace("toiletPaper: { level: 0, timer: 0, cooldown: 1.4, damage: 45, speed: 7.5,", "toiletPaper: { level: 0, timer: 0, cooldown: 1.4, damage: 45, speed: 5.2,")
content = content.replace("pallets: { level: 0, timer: 0, cooldown: 1.8, damage: 70, speed: 8.0,", "pallets: { level: 0, timer: 0, cooldown: 1.8, damage: 70, speed: 5.5,")
content = content.replace("zipTies: { level: 0, timer: 0, cooldown: 1.2, damage: 25, speed: 10,", "zipTies: { level: 0, timer: 0, cooldown: 1.2, damage: 25, speed: 7.0,")
content = content.replace("cutter: { level: 0, timer: 0, cooldown: 0.7, damage: 15, speed: 12,", "cutter: { level: 0, timer: 0, cooldown: 0.7, damage: 15, speed: 8.0,")

# 6. Update movement physics multipliers & combo boost
old_movement = '''  let curSpeed = player.speed;
  if (mysteryActive === 'nadgodziny') curSpeed *= 0.65; // Morale drop (slowed down)
  if (player.isForklift) curSpeed *= 2.1;
  if (player.isDashing) curSpeed *= (player.isForklift ? 1.8 : 2.6);

  // Toyota BT Package Combo Speed Boost
  if (packageCombo > 0) {
    const comboBoost = Math.min(1.48, 1.0 + packageCombo * 0.022);
    curSpeed *= comboBoost;
  }

  if (moveLen > 0.05) {
    moveX /= moveLen;
    moveY /= moveLen;
    player.vx += moveX * 0.45;
    player.vy += moveY * 0.45;'''

new_movement = '''  let curSpeed = player.speed;
  if (mysteryActive === 'nadgodziny') curSpeed *= 0.65; // Morale drop (slowed down)
  if (player.isForklift) curSpeed *= 1.45;
  if (player.isDashing) curSpeed *= (player.isForklift ? 1.4 : 1.75);

  // Toyota BT Package Combo Speed Boost
  if (packageCombo > 0) {
    const comboBoost = Math.min(1.20, 1.0 + packageCombo * 0.01);
    curSpeed *= comboBoost;
  }

  if (moveLen > 0.05) {
    moveX /= moveLen;
    moveY /= moveLen;
    player.vx += moveX * 0.28;
    player.vy += moveY * 0.28;'''

content = content.replace(old_movement, new_movement, 1)

content = content.replace('''  player.vx *= 0.90;
  player.vy *= 0.90;''', '''  player.vx *= 0.86;
  player.vy *= 0.86;''', 1)

# 7. Update camera follow with perspective zoom
old_cam_follow = '''  // Smooth Camera Follow
  camera.x += (player.x - gameWidth / 2 - camera.x) * 0.12;
  camera.y += (player.y - gameHeight / 2 - camera.y) * 0.12;'''

new_cam_follow = '''  // Smooth Camera Follow with Perspective Zoom
  const viewW = gameWidth / camera.zoom;
  const viewH = gameHeight / camera.zoom;
  camera.x += (player.x - viewW / 2 - camera.x) * 0.10;
  camera.y += (player.y - viewH / 2 - camera.y) * 0.10;'''

content = content.replace(old_cam_follow, new_cam_follow, 1)

# 8. Update spawn clock interval
old_spawn_clock = '''  if (spawnClock >= Math.max(0.35, 1.2 - (gameTime / TOTAL_SHIFT_DURATION) * 0.7)) {'''
new_spawn_clock = '''  if (spawnClock >= Math.max(0.75, 1.8 - (gameTime / TOTAL_SHIFT_DURATION) * 0.9)) {'''
content = content.replace(old_spawn_clock, new_spawn_clock, 1)

# 9. Update render() function transform & culling checks
old_render_start = '''function render() {
  ctx.save();
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // Apply Camera Shake & Translation
  const shakeX = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  const shakeY = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

  // 1. Draw High-Contrast Epoxy Warehouse Floor Grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;
  const startX = Math.floor(camera.x / 120) * 120;
  const startY = Math.floor(camera.y / 120) * 120;
  for (let x = startX; x < camera.x + gameWidth + 120; x += 120) {
    ctx.beginPath(); ctx.moveTo(x, camera.y); ctx.lineTo(x, camera.y + gameHeight); ctx.stroke();
  }
  for (let y = startY; y < camera.y + gameHeight + 120; y += 120) {
    ctx.beginPath(); ctx.moveTo(camera.x, y); ctx.lineTo(camera.x + gameWidth, y); ctx.stroke();
  }'''

new_render_start = '''function render() {
  ctx.save();
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  const viewW = gameWidth / camera.zoom;
  const viewH = gameHeight / camera.zoom;

  // Apply Camera Zoom & Shake & Translation
  ctx.scale(camera.zoom, camera.zoom);
  const shakeX = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  const shakeY = screenShake > 0 ? (Math.random() * screenShake - screenShake / 2) : 0;
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

  // 1. Draw High-Contrast Epoxy Warehouse Floor Grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;
  const startX = Math.floor(camera.x / 120) * 120;
  const startY = Math.floor(camera.y / 120) * 120;
  for (let x = startX; x < camera.x + viewW + 120; x += 120) {
    ctx.beginPath(); ctx.moveTo(x, camera.y); ctx.lineTo(x, camera.y + viewH); ctx.stroke();
  }
  for (let y = startY; y < camera.y + viewH + 120; y += 120) {
    ctx.beginPath(); ctx.moveTo(camera.x, y); ctx.lineTo(camera.x + viewW, y); ctx.stroke();
  }'''

content = content.replace(old_render_start, new_render_start, 1)

# Replace remaining gameWidth/gameHeight in culling checks inside render()
content = content.replace("l.x > camera.x - 180 && l.x < camera.x + gameWidth + 180 && l.y > camera.y - 180 && l.y < camera.y + gameHeight + 180",
                          "l.x > camera.x - 180 && l.x < camera.x + viewW + 180 && l.y > camera.y - 180 && l.y < camera.y + viewH + 180")

content = content.replace("pud.x > camera.x - 100 && pud.x < camera.x + gameWidth + 100 && pud.y > camera.y - 60 && pud.y < camera.y + gameHeight + 60",
                          "pud.x > camera.x - 100 && pud.x < camera.x + viewW + 100 && pud.y > camera.y - 60 && pud.y < camera.y + viewH + 60")

content = content.replace("bs.x > camera.x - 60 && bs.x < camera.x + gameWidth + 60 && bs.y > camera.y - 60 && bs.y < camera.y + gameHeight + 60",
                          "bs.x > camera.x - 60 && bs.x < camera.x + viewW + 60 && bs.y > camera.y - 60 && bs.y < camera.y + viewH + 60")

content = content.replace("st.x > camera.x - 200 && st.x < camera.x + gameWidth + 200 && st.y > camera.y - 100 && st.y < camera.y + gameHeight + 100",
                          "st.x > camera.x - 200 && st.x < camera.x + viewW + 200 && st.y > camera.y - 100 && st.y < camera.y + viewH + 100")

content = content.replace("dock.x + dock.w > camera.x && dock.x < camera.x + gameWidth && dock.y + dock.h > camera.y && dock.y < camera.y + gameHeight",
                          "dock.x + dock.w > camera.x && dock.x < camera.x + viewW && dock.y + dock.h > camera.y && dock.y < camera.y + viewH")

content = content.replace("s.x > camera.x - 40 && s.x < camera.x + gameWidth + 40 && s.y > camera.y - 40 && s.y < camera.y + gameHeight + 40",
                          "s.x > camera.x - 40 && s.x < camera.x + viewW + 40 && s.y > camera.y - 40 && s.y < camera.y + viewH + 40")

content = content.replace("o.x + o.w > camera.x && o.x < camera.x + gameWidth && o.y + o.h > camera.y && o.y < camera.y + gameHeight",
                          "o.x + o.w > camera.x && o.x < camera.x + viewW && o.y + o.h > camera.y && o.y < camera.y + viewH")

content = content.replace("it.x > camera.x - 30 && it.x < camera.x + gameWidth + 30 && it.y > camera.y - 30 && it.y < camera.y + gameHeight + 30",
                          "it.x > camera.x - 30 && it.x < camera.x + viewW + 30 && it.y > camera.y - 30 && it.y < camera.y + viewH + 30")

content = content.replace("if (e.x + 80 < camera.x || e.x - 80 > camera.x + gameWidth || e.y + 80 < camera.y || e.y - 80 > camera.y + gameHeight) continue;",
                          "if (e.x + 120 < camera.x || e.x - 120 > camera.x + viewW || e.y + 120 < camera.y || e.y - 120 > camera.y + viewH) continue;")

# Also Kontenerowiec position:
content = content.replace("e.x = camera.x + gameWidth / 2 + Math.sin(gameTime) * 200;", "e.x = camera.x + viewW / 2 + Math.sin(gameTime) * 200;")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied perspective fix successfully!")
