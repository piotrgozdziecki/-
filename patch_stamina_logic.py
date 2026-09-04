import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Add input handlers
inputs_old = """const btnDetention = document.getElementById('btn-detention');
const detentionCd = document.getElementById('detention-cd');"""
inputs_new = inputs_old + """\nconst btnForklift = document.getElementById('btn-forklift');
const staminaBar = document.getElementById('stamina-bar');"""
text = text.replace(inputs_old, inputs_new)

events_old = """btnDash.addEventListener('touchstart', (e) => { e.preventDefault(); sounds.init(); triggerSkill(); });
btnDash.addEventListener('click', () => { sounds.init(); triggerSkill(); });"""
events_new = events_old + """\n
// Forklift controls (hold to sprint)
const startForklift = (e) => { if(e) e.preventDefault(); sounds.init(); player.wantsForklift = true; };
const stopForklift = (e) => { if(e) e.preventDefault(); player.wantsForklift = false; };
btnForklift.addEventListener('touchstart', startForklift);
btnForklift.addEventListener('touchend', stopForklift);
btnForklift.addEventListener('mousedown', startForklift);
btnForklift.addEventListener('mouseup', stopForklift);
btnForklift.addEventListener('mouseleave', stopForklift);
window.addEventListener('keydown', (e) => { if(e.key === 'Shift') player.wantsForklift = true; });
window.addEventListener('keyup', (e) => { if(e.key === 'Shift') player.wantsForklift = false; });
"""
text = text.replace(events_old, events_new)

# 2. Update logic in `update(dt)`
logic_old = """  if (player.isForklift) {
    player.forkliftTimer -= dt;
    if (player.forkliftTimer <= 0) {
      player.isForklift = false;
      player.radius = 14;
      createSparks(player.x, player.y, 25, '#94a3b8');
      addSpeechBubble(player.x, player.y - 30, '⛽ Wózek rozładowany!', '#94a3b8');
    }
  }"""
logic_new = """  // Stamina-based Forklift mechanic
  if (player.wantsForklift && player.stamina > 0) {
    if (!player.isForklift) {
      player.isForklift = true;
      player.radius = 22;
      sounds.dash();
      addSpeechBubble(player.x, player.y - 30, '🚜 WÓZEK BT!', '#facc15');
    }
    // Deplete stamina (lasts ~3 seconds of continuous use)
    player.stamina -= dt * 33; 
    if (player.stamina <= 0) {
      player.stamina = 0;
      player.isForklift = false;
      player.radius = 14;
      createSparks(player.x, player.y, 25, '#94a3b8');
    }
  } else {
    if (player.isForklift) {
      player.isForklift = false;
      player.radius = 14;
      createSparks(player.x, player.y, 15, '#94a3b8');
    }
    // Recharge stamina (takes ~6 seconds to fully recharge)
    player.stamina += dt * 16;
    if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;
  }
  staminaBar.style.width = `${(player.stamina / player.maxStamina) * 100}%`;
"""
text = text.replace(logic_old, logic_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
