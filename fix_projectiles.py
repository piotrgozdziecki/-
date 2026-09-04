import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

proj_old = """    } else if (p.type === 'pallet') {"""
proj_new = """    } else if (p.type === 'zip_tie') {
      p.x += p.vx; p.y += p.vy; p.rot += 0.3;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 12) {
          damageEnemy(e, p.damage);
          e.slowTimer = p.isEvo ? 6.0 : 4.0; // massive slow
          createSparks(p.x, p.y, 4, '#38bdf8');
          p.life = 0; break;
        }
      }
    } else if (p.type === 'cutter') {
      p.x += p.vx; p.y += p.vy; p.rot += 0.5;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 10) {
          damageEnemy(e, p.damage);
          createSparks(p.x, p.y, 8, '#f43f5e');
          // Cutter pierces enemies, don't destroy it immediately unless it hit many (limit piercing?)
          if (!p.pierced) p.pierced = 0;
          p.pierced++;
          if (p.pierced > (p.isEvo ? 6 : 2)) p.life = 0;
        }
      }
    } else if (p.type === 'pallet') {"""
text = text.replace(proj_old, proj_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
