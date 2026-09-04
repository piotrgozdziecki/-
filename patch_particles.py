import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

particles_render = """  // 17. Draw Particles (Debris, Sparks, Smoke)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particlePool[i];
    if (p.active) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
"""

content = re.sub(r'  // 17\. Draw Particles[^\}]+p\.active[^\}]+ctx\.fill\(\);\s*\}\s*\}', particles_render.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

