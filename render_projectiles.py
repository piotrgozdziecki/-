import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

render_old = """    } else if (p.type === 'toilet_paper') {"""
render_new = """    } else if (p.type === 'zip_tie') {
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
    } else if (p.type === 'toilet_paper') {"""
text = text.replace(render_old, render_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
