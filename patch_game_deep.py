import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Add bloodStains and kluska globals right near camera definition
globals_old = """// Camera
const camera = { x: 0, y: 0 };
let screenShake = 0;"""

globals_new = """// Camera
const camera = { x: 0, y: 0 };
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
    for (let i = 0; i < dropItems.length; i++) {
      const item = dropItems[i];
      if (item.type === 'barcode_xp') {
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        item.x += dx * 0.18;
        item.y += dy * 0.18;
      }
    }
    
    kluska.barkTimer -= dt;
    if (kluska.barkTimer <= 0) {
      kluska.barkTimer = 0.55;
      sounds.dash();
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
    
    for (let i = 0; i < dropItems.length; i++) {
      const item = dropItems[i];
      if (item.type === 'barcode_xp') {
        const d = Math.hypot(item.x - kluska.x, item.y - kluska.y);
        if (d < 140) {
          item.x += (player.x - item.x) * 0.12;
          item.y += (player.y - item.y) * 0.12;
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
}"""

text = text.replace(globals_old, globals_new)

# 2. Update killEnemy to add blood stain
kill_old = "createSparks(e.x, e.y, 16, e.info.color);"
kill_new = "createSparks(e.x, e.y, 16, e.info.color);\n  addBloodStain(e.x, e.y, e.info);"
text = text.replace(kill_old, kill_new)

# 3. Update Piotr triggerSkill
piotr_skill_old = """    if (selectedCharKey === 'piotr') {
      sounds.levelUp();
      screenShake = 8;
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.dead) continue;
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        if (Math.hypot(dx, dy) < 480) {
          projectiles.push({
            type: 'laser',
            x1: player.x,
            y1: player.y,
            x2: e.x,
            y2: e.y,
            life: 0.32,
            color: '#38bdf8'
          });
          damageEnemy(e, 105);
          createSparks(e.x, e.y, 8, '#38bdf8');
        }
      }
      addSpeechBubble(player.x, player.y - 30, '⚡ PIOTR: LASEROWY IMPULS 360°!', '#38bdf8');
    }"""

piotr_skill_new = """    if (selectedCharKey === 'piotr') {
      sounds.bossAlert();
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
    }"""

text = text.replace(piotr_skill_old, piotr_skill_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)

print("Patch 2 applied successfully.")
