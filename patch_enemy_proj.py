import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

proj_old = """    if (p.type === 'zip_tie') {"""

proj_new = """    if (p.type === 'enemy_shoot') {
      p.x += p.vx; p.y += p.vy; p.rot += 0.1;
      if (Math.hypot(player.x - p.x, player.y - p.y) < player.radius + 15) {
         if (player.invulnTimer <= 0) {
           player.battery -= 15;
           player.invulnTimer = 0.5;
           player.speed = Math.max(1.0, player.speed * 0.5); // speed debuff
           setTimeout(() => { player.speed = 3.6; }, 2000);
           createSparks(player.x, player.y, 10, '#ef4444');
           sounds.hit();
         }
         p.life = 0; continue;
      }
    } else if (p.type === 'zip_tie') {"""

text = text.replace(proj_old, proj_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
