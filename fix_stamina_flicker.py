import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

bad_logic = """  // Stamina-based Forklift mechanic
  if (player.wantsForklift && player.stamina > 0) {
    if (!player.isForklift) {
      player.isForklift = true;"""

good_logic = """  // Stamina-based Forklift mechanic
  if (player.wantsForklift && player.stamina > 0 && !player.staminaLock) {
    if (!player.isForklift) {
      // Require at least 20% stamina to mount the forklift
      if (player.stamina < 20) {
         player.staminaLock = true;
         return;
      }
      player.isForklift = true;"""
      
text = text.replace(bad_logic, good_logic)

bad_else = """    if (player.stamina <= 0) {
      player.stamina = 0;
      player.isForklift = false;
      player.radius = 14;
      createSparks(player.x, player.y, 25, '#94a3b8');
    }
  } else {
    if (player.isForklift) {
      player.isForklift = false;"""

good_else = """    if (player.stamina <= 0) {
      player.stamina = 0;
      player.isForklift = false;
      player.staminaLock = true;
      player.radius = 14;
      createSparks(player.x, player.y, 25, '#94a3b8');
    }
  } else {
    if (player.isForklift) {
      player.isForklift = false;"""

text = text.replace(bad_else, good_else)

unlock_logic = """    // Recharge stamina (takes ~6 seconds to fully recharge)
    player.stamina += dt * 16;
    if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;"""
    
good_unlock = """    // Recharge stamina (takes ~6 seconds to fully recharge)
    player.stamina += dt * 16;
    if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;
    if (player.stamina >= 20) player.staminaLock = false;"""

text = text.replace(unlock_logic, good_unlock)

# Initialize staminaLock
text = text.replace("stamina: 100,", "stamina: 100,\n  staminaLock: false,")

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
