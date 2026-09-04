import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

collision_logic = """  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // Obstacle collisions (Racks, Pallets, ToiToi)
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    // Simple AABB vs Circle collision
    const testX = Math.max(o.x, Math.min(player.x, o.x + o.w));
    const testY = Math.max(o.y, Math.min(player.y, o.y + o.h));
    
    const distX = player.x - testX;
    const distY = player.y - testY;
    const distance = Math.hypot(distX, distY);
    
    if (distance < player.radius) {
      // Collision occurred!
      const overlap = player.radius - distance;
      const speed = Math.hypot(player.vx, player.vy);
      
      if (distance > 0) {
        player.x += (distX / distance) * overlap;
        player.y += (distY / distance) * overlap;
      } else {
        player.x -= player.vx * dt;
        player.y -= player.vy * dt;
      }
      
      // Spawn sparks if hit hard enough
      if (speed > 150) {
         createSparks(testX, testY, Math.floor(speed / 30), '#fbbf24');
         if (speed > 300) screenShake = Math.max(screenShake, 3);
      }
      
      // Kill momentum towards wall
      player.vx *= 0.5;
      player.vy *= 0.5;
    }
  }

  player.x = Math.max(player.radius, Math.min(ARENA_WIDTH - player.radius, player.x));
"""

content = re.sub(r'  player\.x \+= player\.vx \* dt;\s*player\.y \+= player\.vy \* dt;\s*player\.x = Math\.max\(player\.radius, Math\.min\(ARENA_WIDTH - player\.radius, player\.x\)\);', collision_logic.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

