import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Define the Crimsonland Engine JS module to inject
crimsonland_module = """
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

function updateAndRenderGibs(dt, ctx) {
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

function updateAndRenderPowerUps(dt, ctx) {
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
"""

# Insert crimsonland_module after ARENA_HEIGHT declaration
if 'const ARENA_HEIGHT' in text:
    text = text.replace('const ARENA_HEIGHT = 3800;', 'const ARENA_HEIGHT = 3800;\n' + crimsonland_module)
    print("Injected Crimsonland Engine module.")

# Update killEnemy to trigger trySpawnPowerUp and spawnGibs
kill_pattern = r"function killEnemy\(e\) \{"
kill_replacement = """function killEnemy(e) {
  trySpawnPowerUp(e.x, e.y);
  spawnGibs(e.x, e.y, e.isBoss ? 16 : 6, e.info ? e.info.name : 'default');"""

if re.search(kill_pattern, text):
    text = re.sub(kill_pattern, kill_replacement, text, count=1)
    print("Updated killEnemy with Power-Ups and Gibs triggering.")

# Inject render hooks for splatter canvas, gibs, and powerups in function render()
render_grid_pattern = r"(\/\/ 3\.5\. Crimsonland Blood & Epoxy Stains)"
render_replacement = """// 3.4. Crimsonland Permanent Splatter Canvas (0 Extra Draw Calls)
  if (typeof splatterCanvas !== 'undefined') {
    ctx.drawImage(splatterCanvas, 0, 0);
  }
  updateAndRenderGibs(dt, ctx);
  updateAndRenderPowerUps(dt, ctx);
  
  // 3.5. Crimsonland Blood & Epoxy Stains"""

if re.search(render_grid_pattern, text):
    text = re.sub(render_grid_pattern, render_replacement, text, count=1)
    print("Injected Splatter canvas, Gibs, and Power-Ups into render().")

# Update JS card handlers for Game-Changers
card_handler_pattern = r"(closeLevelUp\(\);)"
game_changer_js_handlers = """
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

  closeLevelUp();"""

text = text.replace('closeLevelUp();', game_changer_js_handlers, 1)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("game.html successfully patched with Crimsonland Engine!")
