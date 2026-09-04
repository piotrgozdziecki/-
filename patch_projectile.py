import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Projectile update logic
projectile_update = """    } else if (p.type === 'faktura') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += p.rotSpeed * dt;
      let hit = false;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (!p.hitList) p.hitList = [];
        if (p.hitList.includes(e.id)) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 15) {
          takeDamage(e, p.damage);
          p.hitList.push(e.id);
          spawnParticle(p.x, p.y, -p.vx * 0.2, -p.vy * 0.2, 0.2, 2, '#fff');
          p.pierce--;
          if (p.pierce <= 0) { hit = true; break; }
        }
      }
      if (hit) projectiles.splice(i, 1);
"""

content = content.replace("    } else if (p.type === 'staple') {", projectile_update + "    } else if (p.type === 'staple') {")

# Projectile render logic
projectile_render = """    } else if (p.type === 'faktura') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-10, -14, 20, 28);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 8px Arial';
      ctx.fillText('KOREKTA', -9, -4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, 2, 16, 2);
      ctx.fillRect(-8, 6, 12, 2);
      ctx.restore();
"""

content = content.replace("    } else if (p.type === 'staple') {", projectile_render + "    } else if (p.type === 'staple') {")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
