import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make XP magnet much more aggressive and satisfying
magnet_patch = """    if (dist < player.magnetRange && dist > 1) {
      // Exponential succ - starts slow, gets extremely fast
      const succFactor = Math.pow(1.0 - (dist / player.magnetRange), 2.5);
      const dynamicSpeed = magnetSpeed + (succFactor * magnetSpeed * 6.0);
      item.x += (dx / dist) * dynamicSpeed;
      item.y += (dy / dist) * dynamicSpeed;
      
      // Visual trail
      if (Math.random() < 0.25) {
         createSparks(item.x, item.y, 1, item.type === 'barcode_xp' ? '#60a5fa' : '#facc15');
      }
    }"""

content = re.sub(r'    if \(dist < player\.magnetRange && dist > 1\) \{\s*item\.x \+= \(dx / dist\) \* magnetSpeed;\s*item\.y \+= \(dy / dist\) \* magnetSpeed;\s*\}', magnet_patch.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

