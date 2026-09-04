import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# Replace the broken projectile update loop in update(dt) with clean logic
old_proj_loop = """  // Update Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.life -= dt;
    if (p.life <= 0) {
       if (p.type === 'kas_red_zone') {
          // Explode
          createSparks(p.x, p.y, 40, '#ef4444');
          if (Math.hypot(player.x - p.x, player.y - p.y) > p.radius) {
             player.battery = Math.max(0, player.battery - player.maxBattery * 0.5); // 50% HP hit if outside
             addSpeechBubble(player.x, player.y, 'KARA KAS!', '#ef4444');
          }
       }
       projectiles.splice(i, 1); continue; 
    }

    if (p.type === 'pallet') {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += 0.2;
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
      ctx.rotate(p.rot);
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
      ctx.rotate(p.rot);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillStyle = p.isEvo ? '#ef4444' : '#f8fafc';
      ctx.fillRect(-4, -1, 8, 2);
      ctx.restore();
    } else if (p.type === 'cutter') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.isEvo ? '#f43f5e' : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-6, 4);
      ctx.fill();
      ctx.restore();
    } else if (p.type === 'toilet_paper') {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.rot += 0.25;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 14) {
          if (p.isEvo) {
             damageEnemy(e, p.damage * 2);
             createSparks(e.x, e.y, 16, '#fef08a'); // Detonate
             e.stunTimer = 3.0; // Complete stop
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
        projectiles.splice(i, 1);
      }
    }
  }"""

new_proj_loop = """  // Update Kluska Companion
  updateKluska(dt);

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

    if (p.type === 'pallet') {
      p.x += p.vx;
      p.y += p.vy;
      p.rot = (p.rot || 0) + 0.2;
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
      p.x += p.vx;
      p.y += p.vy;
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
      p.x += p.vx;
      p.y += p.vy;
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
      p.x += p.vx;
      p.y += p.vy;
      if (Math.hypot(player.x - p.x, player.y - p.y) < player.radius + 10) {
        if (player.invulnTimer <= 0) {
          sounds.hit();
          player.invulnTimer = 0.5;
          player.battery = Math.max(0, player.battery - 12);
          addSpeechBubble(player.x, player.y - 20, '🛑 BRAK SAD-u!', '#ef4444');
        }
        p.life = 0;
      }
    } else if (p.type === 'zip_tie') {
      p.x += p.vx; p.y += p.vy; p.rot = (p.rot || 0) + 0.3;
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
      p.x += p.vx; p.y += p.vy; p.rot = (p.rot || 0) + 0.5;
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
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.rot = (p.rot || 0) + 0.25;
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
        projectiles.splice(i, 1);
      }
    }
  }"""

text = text.replace(old_proj_loop, new_proj_loop)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)

print("Patch 3 (update loop) applied.")
