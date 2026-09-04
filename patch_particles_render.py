import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_render = """  // 17. Draw Particles (Debris, Sparks, Smoke)
  ctx.save();
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particlePool[i];
    if (p.active) {
      if (p.color === '#f59e0b' || p.color === '#fbbf24' || p.color === '#facc15' || p.color === '#38bdf8' || p.color === '#c084fc') {
        ctx.globalCompositeOperation = 'lighter';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
"""

content = re.sub(r'  // 17\. Draw Particles[^\}]+p\.active[^\}]+ctx\.fill\(\);\s*\}\s*\}\s*ctx\.restore\(\);', new_render.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

