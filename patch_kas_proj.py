import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

proj_old = """  // Update Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.life -= dt;
    if (p.life <= 0) { projectiles.splice(i, 1); continue; }"""

proj_new = """  // Update Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.life -= dt;
    if (p.life <= 0) {
       if (p.type === 'kas_red_zone') {
          // Explode
          createSparks(p.x, p.y, 40, '#ef4444');
          if (Math.hypot(player.x - p.x, player.y - p.y) > p.radius) {
             player.battery = Math.max(0, player.battery - player.maxBattery * 0.5); // 50% HP hit if outside
             addSpeechBubble(player.x, player.y, 'KARA KAS!', '#ef4444');
          }
       }
       projectiles.splice(i, 1); continue; 
    }"""

text = text.replace(proj_old, proj_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
