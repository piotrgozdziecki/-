import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Expand workshopUpgrades data structure
old_workshop = "let workshopUpgrades = {\n  battery: parseInt(localStorage.getItem('dta_upg_battery') || '0', 10),\n  speed: parseInt(localStorage.getItem('dta_upg_speed') || '0', 10),\n  damage: parseInt(localStorage.getItem('dta_upg_damage') || '0', 10),\n  magnet: parseInt(localStorage.getItem('dta_upg_magnet') || '0', 10),\n  cooldown: parseInt(localStorage.getItem('dta_upg_cooldown') || '0', 10)\n};"

new_workshop = """let workshopUpgrades = {
  battery: parseInt(localStorage.getItem('dta_upg_battery') || '0', 10),
  speed: parseInt(localStorage.getItem('dta_upg_speed') || '0', 10),
  damage: parseInt(localStorage.getItem('dta_upg_damage') || '0', 10),
  magnet: parseInt(localStorage.getItem('dta_upg_magnet') || '0', 10),
  cooldown: parseInt(localStorage.getItem('dta_upg_cooldown') || '0', 10),
  oponyKolcowane: parseInt(localStorage.getItem('dta_upg_opony') || '0', 10),
  halogenyLed: parseInt(localStorage.getItem('dta_upg_halogeny') || '0', 10),
  pancerzRabitza: parseInt(localStorage.getItem('dta_upg_pancerz') || '0', 10),
  kogutOstrzegawczy: parseInt(localStorage.getItem('dta_upg_kogut') || '0', 10)
};"""

text = text.replace(old_workshop, new_workshop)

# 2. Add Destruction Engine Code (Barrels, High-Bay Racks, Radiowęzeł & Events)
destruction_system = """
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
"""

if 'initSplatterEngine()' in text:
    text = text.replace('initSplatterEngine();', 'initSplatterEngine();\n' + destruction_system)
    print("Injected Destruction & Announcer Engine.")

# Inject environment update into render()
if 'updateAndRenderPowerUps(dt, ctx);' in text:
    text = text.replace('updateAndRenderPowerUps(dt, ctx);', 'updateAndRenderPowerUps(dt, ctx);\n  updateAndRenderEnvironment(dt, ctx);')
    print("Injected environment render call.")

# Add call to initSectorEnvironment in startGamePlay
if 'startGamePlay()' in text:
    text = text.replace('startGamePlay() {', 'startGamePlay() {\n  initSectorEnvironment();')
    print("Injected initSectorEnvironment to startGamePlay.")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully updated game.html with Destruction & Announcer Engine!")
