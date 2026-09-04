import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

dmg_old = """      } else if (player.invulnTimer <= 0) {
        sounds.hit();
        player.invulnTimer = 0.6;
        player.battery -= 10;"""

dmg_new = """      } else if (player.invulnTimer <= 0) {
        sounds.hit();
        player.invulnTimer = 0.6;
        player.battery -= (mysteryActive === 'nadgodziny' ? 25 : 10);"""
        
text = text.replace(dmg_old, dmg_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
