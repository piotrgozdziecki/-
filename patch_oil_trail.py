import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

proj_old = """    } else if (p.type === 'kas_red_zone') {"""

proj_new = """    } else if (p.type === 'oil_trail') {
      if (Math.random() < 0.2) {
        for (let j = 0; j < enemies.length; j++) {
           if (enemies[j].dead) continue;
           if (Math.hypot(enemies[j].x - p.x, enemies[j].y - p.y) < 30) {
              damageEnemy(enemies[j], p.damage);
              enemies[j].slowTimer = 2.0;
           }
        }
      }
    } else if (p.type === 'kas_red_zone') {"""

text = text.replace(proj_old, proj_new)

rend_old = """    } else if (p.type === 'kas_red_zone') {"""

rend_new = """    } else if (p.type === 'oil_trail') {
      ctx.fillStyle = `rgba(15, 23, 42, ${p.life / 4.0})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'kas_red_zone') {"""

text = text.replace(rend_old, rend_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
