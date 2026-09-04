import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

touch_old = """    // Touch Player Collision
    if (dist < player.radius + e.info.radius) {
      if (player.isDashing) {
        damageEnemy(e, 140);
        createSparks(e.x, e.y, 10, '#f97316');
      } else if (player.invulnTimer <= 0) {"""

touch_new = """    // Touch Player Collision
    if (dist < player.radius + e.info.radius) {
      if (player.isDashing || weapons.pallets.isEvo) {
        damageEnemy(e, weapons.pallets.isEvo ? 80 : 140);
        createSparks(e.x, e.y, 10, '#f97316');
        if (weapons.pallets.isEvo && !e.isBoss) e.dead = true; // Auto kill small enemies when evo
      } else if (player.invulnTimer <= 0) {"""

text = text.replace(touch_old, touch_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
