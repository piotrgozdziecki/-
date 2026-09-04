import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

lighting_pass = """    ctx.restore();
  }
  
  // 19.5 Dynamic Lighting & Flashlight Pass
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const flicker = Math.sin(performance.now() / 100) * 8;
  const baseRadius = player.isForklift ? 180 : 120;
  
  const darkGrad = ctx.createRadialGradient(player.x, player.y, baseRadius + flicker, player.x, player.y, 1000);
  darkGrad.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright center
  darkGrad.addColorStop(0.25, 'rgba(180, 180, 195, 1)'); // Soft falloff
  darkGrad.addColorStop(1, 'rgba(15, 18, 26, 1)'); // Pitch black corners
  
  ctx.fillStyle = darkGrad;
  ctx.fillRect(camera.x - 200, camera.y - 200, viewW + 400, viewH + 400);
  ctx.restore();
  
  if (player.isForklift) {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const headlightGrad = ctx.createRadialGradient(player.x, player.y, 50, player.x, player.y, 600);
      headlightGrad.addColorStop(0, 'rgba(255, 250, 200, 0.4)');
      headlightGrad.addColorStop(1, 'rgba(255, 250, 200, 0)');
      
      ctx.fillStyle = headlightGrad;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.arc(player.x, player.y, 600, player.angle - 0.4, player.angle + 0.4);
      ctx.fill();
      ctx.restore();
  }
  
  ctx.restore();
  ctx.restore();"""

content = re.sub(r'    ctx\.restore\(\);\s*\}\s*ctx\.restore\(\);\s*ctx\.restore\(\);', lighting_pass.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

