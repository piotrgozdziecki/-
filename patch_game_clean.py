import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Ensure getDamage function exists
if 'function getDamage(' not in text:
    get_dmg_code = """
function getDamage(baseDmg) {
  let dmg = baseDmg || 20;
  if (player && player.damageMult) dmg *= player.damageMult;
  return Math.round(dmg);
}
"""
    text = text.replace("function fireHydrant() {", get_dmg_code + "\nfunction fireHydrant() {")

# 2. Fix fireKawa
text = text.replace("takeDamage(e, dmg);\n      spawnDamageText(e.x, e.y - 20, dmg, '#78350f', true);", "damageEnemy(e, dmg);")

# 3. Fix thorns in damageEnemy
text = text.replace("""  if (player.thorns && player.thorns > 0) {
      damageEnemy(e, player.thorns);
      createSparks(e.x, e.y, 10, '#facc15');
  }""", "// Thorns handled on player hit")

# 4. Clean updateProjectiles function
new_update_projectiles = """function updateProjectiles(dt) {
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
      projectiles.splice(i, 1);
      continue;
    }

    // Check collision against breakable mapProps
    if (p.type !== 'kas_red_zone' && p.type !== 'enemy_shoot' && p.type !== 'oil_trail') {
      for (let k = 0; k < mapProps.length; k++) {
        const prop = mapProps[k];
        if (prop.dead) continue;
        if (Math.hypot(prop.x - p.x, prop.y - p.y) < prop.radius + 14) {
          damageProp(prop, p.damage || 35);
          if (p.type !== 'cutter' && p.type !== 'gas_cloud' && p.type !== 'hydrant_beam') {
            p.life = 0;
            break;
          }
        }
      }
    }

    if (p.type === 'pallet') {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rot = (p.rot || 0) + 12.0 * dt;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 18) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 6, '#d97706');
          p.life = 0; break;
        }
      }
    } else if (p.type === 'gas_cloud') {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.radius = Math.min(p.maxRadius || 120, p.radius + dt * 30);
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
          damageEnemy(e, p.damage * dt * 2.5);
          e.slowTimer = 3.5;
        }
      }
    } else if (p.type === 'metal_bb') {
      p.x += p.vx * dt; p.y += p.vy * dt;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 8) {
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
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (Math.hypot(player.x - p.x, player.y - p.y) < player.radius + 10) {
        if (player.invulnTimer <= 0) {
          if (player.dodgeChance && Math.random() < player.dodgeChance) {
            spawnDamageNumber(player.x, player.y - 20, 'UNIK!', true);
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
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 12) {
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
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 10) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 8, '#f43f5e');
          p.pierce = (p.pierce || 0) + 1;
          if (p.pierce > (p.isEvo ? 6 : 2)) p.life = 0;
        }
      }
    } else if (p.type === 'toilet_paper') {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= Math.pow(0.96, dt * 60); p.vy *= Math.pow(0.96, dt * 60);
      p.rot = (p.rot || 0) + 14.0 * dt;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 14) {
          if (p.isEvo) {
            damageEnemy(e, p.damage * 2);
            createSparks(e.x, e.y, 16, '#fef08a');
            e.stunTimer = 3.0;
          } else {
            damageEnemy(e, p.damage);
            e.slowTimer = 1.8;
          }
          createSparks(p.x, p.y, 8, '#f8fafc');
          p.life = 0; break;
        }
      }
    } else if (p.type === 'box_mortar') {
      p.progress = (p.progress || 0) + dt * (p.speed || 1.5);
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
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.angle = (p.angle || 0) + (p.rotSpeed || 5) * dt;
      let hit = false;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        p.hitList = p.hitList || [];
        if (p.hitList.includes(e.id)) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 15) {
          damageEnemy(e, p.damage);
          p.hitList.push(e.id);
          spawnParticle(p.x, p.y, -p.vx * 0.2, -p.vy * 0.2, 0.2, 2, '#fff');
          p.pierce--;
          if (p.pierce <= 0) { hit = true; break; }
        }
      }
      if (hit) projectiles.splice(i, 1);
    } else if (p.type === 'staple') {
      p.x += p.vx * dt; p.y += p.vy * dt;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 8) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 4, p.isEvo ? '#f59e0b' : '#38bdf8');
          p.life = 0; break;
        }
      }
    } else if (p.type === 'hydrant_beam') {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.hitList = p.hitList || [];
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead || p.hitList.includes(e.id)) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 18) {
          damageEnemy(e, p.damage);
          e.slowTimer = 3.0;
          e.x += (p.vx > 0 ? 18 : -18); e.y += (p.vy > 0 ? 18 : -18);
          p.hitList.push(e.id);
          createSparks(p.x, p.y, 6, '#38bdf8');
          p.pierce--;
          if (p.pierce <= 0) { p.life = 0; break; }
        }
      }
    } else if (p.type === 'shockwave') {
      p.radius += ((p.maxRadius || 150) - p.radius) * (dt * 12);
    }
  }
}"""

# Replace old updateProjectiles block
pos_start = text.find("function updateProjectiles(dt) {")
if pos_start == -1:
    pos_start = text.find("// Update Projectiles")
pos_end = text.find("// Update Drop Items & Magnet")

if pos_start != -1 and pos_end != -1:
    text = text[:pos_start] + new_update_projectiles + "\n\n  " + text[pos_end:]
    print("Replaced updateProjectiles successfully.")
else:
    print("ERROR: Could not locate updateProjectiles bounds!")

