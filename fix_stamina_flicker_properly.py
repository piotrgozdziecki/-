import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

bad_logic = """  // Stamina-based Forklift mechanic
  if (player.wantsForklift && player.stamina > 0 && !player.staminaLock) {
    if (!player.isForklift) {
      // Require at least 20% stamina to mount the forklift
      if (player.stamina < 20) {
         player.staminaLock = true;
         player.wantsForklift = false;
      }
      player.isForklift = true;
      player.radius = 22;
      sounds.dash();
      addSpeechBubble(player.x, player.y - 30, '🚜 WÓZEK BT!', '#facc15');
    }
    // Deplete stamina (lasts ~3 seconds of continuous use)
    player.stamina -= dt * 33;"""

good_logic = """  // Stamina-based Forklift mechanic
  let canForklift = (player.wantsForklift && player.stamina > 0 && !player.staminaLock);
  if (canForklift && !player.isForklift && player.stamina < 20) {
     player.staminaLock = true;
     canForklift = false;
  }

  if (canForklift) {
    if (!player.isForklift) {
      player.isForklift = true;
      player.radius = 22;
      sounds.dash();
      addSpeechBubble(player.x, player.y - 30, '🚜 WÓZEK BT!', '#facc15');
    }
    // Deplete stamina (lasts ~3 seconds of continuous use)
    player.stamina -= dt * 33;"""

text = text.replace(bad_logic, good_logic)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
