import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

rend_old = """    } else if (p.type === 'enemy_shoot') {"""

rend_new = """    } else if (p.type === 'kas_red_zone') {
      ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + Math.sin(gameTime * 10) * 0.1})`;
      ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText(`REWIZJA: ${Math.ceil(p.life)}s`, p.x - 40, p.y);
    } else if (p.type === 'enemy_shoot') {"""

text = text.replace(rend_old, rend_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
