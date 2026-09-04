import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

move_old = """    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0) * mysteryBuffMultiplier;
    if (dist > 5) {
      e.x += (dx / dist) * spd;
      e.y += (dy / dist) * spd;
    }"""

move_new = """    let spd = e.info.speed * (e.slowTimer > 0 ? 0.45 : 1.0) * mysteryBuffMultiplier;
    
    if (e.info.straightLine) {
      e.x += e.vx * spd;
      e.y += e.vy * spd;
      if (Math.random() < 0.05) createSparks(e.x, e.y, 2, '#ea580c'); // Beep warning visual
    } else {
      let currentDx = (dx / dist);
      let currentDy = (dy / dist);
      
      if (e.info.canDash) {
         e.dashTimer -= dt;
         if (e.dashTimer < 0) {
           e.dashTimer = 4.0;
           e.isDashing = 0.5; // Dash lasts 0.5s
           e.vx = currentDx; e.vy = currentDy;
         }
         if (e.isDashing > 0) {
           e.isDashing -= dt;
           spd *= 3.5;
           currentDx = e.vx; currentDy = e.vy;
         } else {
           // Zig-zag
           const zig = Math.sin(gameTime * 4 + e.x * 0.01) * 0.5;
           currentDx = currentDx * 0.8 + currentDy * zig;
           currentDy = currentDy * 0.8 - currentDx * zig;
         }
      }
      
      if (dist > 5) {
        e.x += currentDx * spd;
        e.y += currentDy * spd;
      }
    }
    
    // Shooter Logic
    if (e.info.shooter) {
       e.shootTimer -= dt;
       if (e.shootTimer <= 0) {
          e.shootTimer = 3.5;
          const a = Math.atan2(dy, dx);
          projectiles.push({ type: 'enemy_shoot', x: e.x, y: e.y, vx: Math.cos(a)*4, vy: Math.sin(a)*4, life: 120, rot: a });
       }
    }
    """
    
text = text.replace(move_old, move_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
