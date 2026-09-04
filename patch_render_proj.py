import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

rend_old = """    } else if (p.type === 'zip_tie') {"""

rend_new = """    } else if (p.type === 'enemy_shoot') {
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
    } else if (p.type === 'zip_tie') {"""

text = text.replace(rend_old, rend_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
