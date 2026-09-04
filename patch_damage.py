import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

blood_on_hit = """  e.hitFlash = 0.12;
  spawnDamageNumber(e.x, e.y, dmg, isCrit);
  
  // Blood splatter on hit
  const hitParticles = isCrit ? 6 : 2;
  for (let i = 0; i < hitParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    spawnParticle(e.x, e.y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.3 + Math.random() * 0.2, Math.random() * 2.5 + 1, e.info.color || '#991b1b');
  }"""

content = content.replace("  e.hitFlash = 0.12;\n  spawnDamageNumber(e.x, e.y, dmg, isCrit);", blood_on_hit)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

