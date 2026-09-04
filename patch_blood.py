import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add blood particles inside addBloodStain
blood_particles = """  bloodStains.push({
    x: x,
    y: y,
    color: col,
    radius: radius,
    rot: Math.random() * Math.PI * 2,
    life: 1.0
  });

  // Spawn dynamic blood particles
  const particleCount = enemyInfo && enemyInfo.isBoss ? 25 : 8;
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (enemyInfo && enemyInfo.isBoss ? 80 : 35);
    spawnParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.4 + Math.random() * 0.4, Math.random() * 3 + 2, col);
  }
}"""

content = re.sub(r'  bloodStains\.push\(\{[\s\S]*?life: 1\.0\s*\}\);\s*\}', blood_particles.strip() + "\n}", content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

