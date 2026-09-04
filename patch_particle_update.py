import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix blood particle speed
content = content.replace("const speed = Math.random() * (enemyInfo && enemyInfo.isBoss ? 80 : 35);", "const speed = Math.random() * (enemyInfo && enemyInfo.isBoss ? 12 : 5);")

# Add friction to particle update loop
particle_update = """    if (p.active) {
      p.x += p.vx; p.y += p.vy; p.life -= dt;
      p.vx *= 0.92; p.vy *= 0.92; // Friction so they don't slide forever
      if (p.life <= 0) p.active = false;
    }"""

content = re.sub(r'    if \(p\.active\) \{\s*p\.x \+= p\.vx; p\.y \+= p\.vy; p\.life -= dt;\s*if \(p\.life <= 0\) p\.active = false;\s*\}', particle_update.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

