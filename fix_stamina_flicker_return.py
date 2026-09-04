import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

bad_logic = """      // Require at least 20% stamina to mount the forklift
      if (player.stamina < 20) {
         player.staminaLock = true;
         return;
      }"""

good_logic = """      // Require at least 20% stamina to mount the forklift
      if (player.stamina < 20) {
         player.staminaLock = true;
         player.wantsForklift = false;
      }"""

text = text.replace(bad_logic, good_logic)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
