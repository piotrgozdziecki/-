import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find updateProjectiles / loop start
pos_proj = text.find('// Update Projectiles')
pos_drop = text.find('// Update Drop Items & Magnet')
pos_draw_proj = text.find('// 16. Draw Projectiles')
pos_draw_drop = text.find('// 7. Drop Items') # or draw drop items

print("Update Projectiles pos:", pos_proj)
print("Update Drop Items pos:", pos_drop)
print("Draw Projectiles pos:", pos_draw_proj)

