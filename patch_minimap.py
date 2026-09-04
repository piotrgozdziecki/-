import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

minimap = """  vigGrad.addColorStop(1, edgeColor);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // 21. Minimap (Radar)
  const mapSize = 140;
  const padding = 20;
  const mapX = gameWidth - mapSize - padding;
  const mapY = padding;
  
  ctx.save();
  ctx.globalAlpha = 0.85;
  
  // Minimap Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(mapX, mapY, mapSize, mapSize, 8);
  ctx.fill();
  ctx.stroke();
  
  // Clip for drawing inside map
  ctx.clip();
  
  const scaleX = mapSize / ARENA_WIDTH;
  const scaleY = mapSize / ARENA_HEIGHT;
  
  // Draw Obstacles (Grey)
  ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
  for (let i = 0; i < obstacles.length; i++) {
     const o = obstacles[i];
     ctx.fillRect(mapX + o.x * scaleX, mapY + o.y * scaleY, Math.max(1, o.w * scaleX), Math.max(1, o.h * scaleY));
  }
  
  // Draw drops/xp (Small yellow dots)
  ctx.fillStyle = '#facc15';
  for (let i = 0; i < dropItems.length; i++) {
     const d = dropItems[i];
     if (d.type !== 'lucky_chest') {
         ctx.fillRect(mapX + d.x * scaleX, mapY + d.y * scaleY, 1.5, 1.5);
     } else {
         ctx.fillStyle = '#38bdf8';
         ctx.fillRect(mapX + d.x * scaleX - 1.5, mapY + d.y * scaleY - 1.5, 3, 3);
         ctx.fillStyle = '#facc15';
     }
  }

  // Draw Enemies (Red)
  ctx.fillStyle = '#ef4444';
  for (let i = 0; i < enemies.length; i++) {
     const e = enemies[i];
     const es = e.isBoss ? 4 : 2.5;
     if (e.isBoss) ctx.fillStyle = '#a855f7';
     ctx.fillRect(mapX + e.x * scaleX - es/2, mapY + e.y * scaleY - es/2, es, es);
     if (e.isBoss) ctx.fillStyle = '#ef4444';
  }
  
  // Draw Player (Green/Cyan)
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(mapX + player.x * scaleX, mapY + player.y * scaleY, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw Camera Viewport (White outline)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  const viewW_scaled = (gameWidth / camera.zoom) * scaleX;
  const viewH_scaled = (gameHeight / camera.zoom) * scaleY;
  ctx.strokeRect(mapX + camera.x * scaleX, mapY + camera.y * scaleY, viewW_scaled, viewH_scaled);
  
  ctx.restore();
}"""

content = re.sub(r'  vigGrad\.addColorStop\(1, edgeColor\);\s*ctx\.fillStyle = vigGrad;\s*ctx\.fillRect\(0, 0, gameWidth, gameHeight\);\n\}', minimap.strip() + '\n', content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

