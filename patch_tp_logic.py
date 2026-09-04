import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

tp_old = """    } else if (p.type === 'toilet_paper') {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.rot += 0.25;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.info.radius + 14) {
          damageEnemy(e, p.damage);
          e.slowTimer = p.isEvo ? 3.0 : 1.8;
          createSparks(p.x, p.y, 8, '#f8fafc');
          p.life = 0;
          break;
        }
      }
    } else if (p.type === 'box_mortar') {"""

tp_new = """    } else if (p.type === 'toilet_paper') {
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
    } else if (p.type === 'box_mortar') {"""

text = text.replace(tp_old, tp_new)

move_old = """    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0) * mysteryBuffMultiplier;"""
move_new = """    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0) * mysteryBuffMultiplier;
    if (e.stunTimer && e.stunTimer > 0) { e.stunTimer -= dt; spd = 0; }"""

text = text.replace(move_old, move_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
