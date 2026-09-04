import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

bad_stamina = """  // Draw Stamina Bar below player
  if (player.stamina < player.maxStamina || player.isForklift) {
    ctx.restore(); // pop the translate+rotate for the player, now we just have translate
    ctx.save();
    ctx.translate(player.x, player.y);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-16, 26, 32, 5);
    
    ctx.fillStyle = player.isForklift ? '#facc15' : '#fbbf24';
    const fillW = Math.max(0, (player.stamina / player.maxStamina) * 30);
    ctx.fillRect(-15, 27, fillW, 3);
  }"""

good_stamina = """  // Draw Stamina Bar below player
  if (player.stamina < player.maxStamina || player.isForklift) {
    ctx.rotate(-player.angle); // undo player rotation
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-16, 26, 32, 5);
    
    ctx.fillStyle = player.isForklift ? '#facc15' : '#fbbf24';
    const fillW = Math.max(0, (player.stamina / player.maxStamina) * 30);
    ctx.fillRect(-15, 27, fillW, 3);
    
    ctx.rotate(player.angle); // restore rotation just in case
  }"""

text = text.replace(bad_stamina, good_stamina)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
