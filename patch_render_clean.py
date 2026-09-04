import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Add Blood Stains rendering right after floor puddles
puddles_end_old = """  // 3. Coolant & Hydraulic Oil Puddles (Iridescent Sheen)
  for (let i = 0; i < warehousePuddles.length; i++) {
    const pud = warehousePuddles[i];
    if (pud.x > camera.x - 100 && pud.x < camera.x + gameWidth + 100 && pud.y > camera.y - 60 && pud.y < camera.y + gameHeight + 60) {
      ctx.fillStyle = pud.color;
      ctx.beginPath();
      ctx.ellipse(pud.x, pud.y, pud.rx, pud.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }"""

puddles_end_new = puddles_end_old + """

  // 3.5. Crimsonland Blood & Epoxy Stains
  for (let i = 0; i < bloodStains.length; i++) {
    const bs = bloodStains[i];
    if (bs.x > camera.x - 60 && bs.x < camera.x + gameWidth + 60 && bs.y > camera.y - 60 && bs.y < camera.y + gameHeight + 60) {
      ctx.save();
      ctx.translate(bs.x, bs.y);
      ctx.rotate(bs.rot);
      ctx.fillStyle = bs.color;
      ctx.globalAlpha = bs.life * 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, bs.radius, bs.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Splatter dots
      ctx.beginPath();
      ctx.arc(bs.radius * 0.8, bs.radius * 0.4, bs.radius * 0.25, 0, Math.PI * 2);
      ctx.arc(-bs.radius * 0.7, -bs.radius * 0.3, bs.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }
  }"""

text = text.replace(puddles_end_old, puddles_end_new)

# 2. Add drawKluska call right after player restore
player_restore_old = """  // Draw Stamina Bar below player
  if (player.stamina < player.maxStamina || player.isForklift) {
    ctx.rotate(-player.angle); // undo player rotation
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-16, 32, 32, 5);
    
    ctx.fillStyle = player.isForklift ? '#facc15' : '#fbbf24';
    const fillW = Math.max(0, (player.stamina / player.maxStamina) * 30);
    ctx.fillRect(-15, 33, fillW, 3);
    
    ctx.rotate(player.angle); // restore rotation just in case
  }
  ctx.restore();"""

player_restore_new = player_restore_old + """

  // 14.5 Draw Kluska Companion
  drawKluska(ctx);"""

text = text.replace(player_restore_old, player_restore_new)

# 3. Clean up Projectiles Render loop
# We will match from `// 16. Draw Projectiles` to the end of the projectiles loop.
proj_render_match = re.search(r'// 16\. Draw Projectiles.*?\n  for \(let i = 0; i < projectiles\.length; i\+\+\) \{.*?\n  \}', text, re.DOTALL)

if proj_render_match:
    old_proj_render_block = proj_render_match.group(0)
    new_proj_render_block = """// 16. Draw Projectiles
  for (let i = 0; i < projectiles.length; i++) {
    const p = projectiles[i];
    
    if (p.type === 'laser') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = weapons.scanner.isEvo ? 7 : 3.5;
      ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = weapons.scanner.isEvo ? 3 : 1.5;
      ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(p.x2 - 10, p.y2 - 10, 20, 20);
    } else if (p.type === 'gas_cloud') {
      const alpha = (p.life / p.maxLife) * 0.45;
      const gGrad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, p.radius);
      gGrad.addColorStop(0, `rgba(234, 179, 8, ${alpha})`);
      gGrad.addColorStop(0.6, `rgba(163, 230, 53, ${alpha * 0.7})`);
      gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gGrad;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    } else if (p.type === 'metal_bb') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } else if (p.type === 'pallet') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-16, -12, 32, 24);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(-16, -12, 32, 24);
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.fillText('EPAL', -11, 3);
      ctx.restore();
    } else if (p.type === 'oil_trail') {
      ctx.fillStyle = `rgba(15, 23, 42, ${p.life / 4.0})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'kas_red_zone') {
      ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + Math.sin(gameTime * 10) * 0.1})`;
      ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText(`REWIZJA: ${Math.ceil(p.life)}s`, p.x - 40, p.y);
    } else if (p.type === 'enemy_shoot') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-12, -8, 24, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px sans-serif';
      ctx.fillText('BRAK', -10, -1);
      ctx.fillText('DOK.', -10, 6);
      ctx.restore();
    } else if (p.type === 'zip_tie') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillStyle = p.isEvo ? '#ef4444' : '#f8fafc';
      ctx.fillRect(-4, -1, 8, 2);
      ctx.restore();
    } else if (p.type === 'cutter') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = p.isEvo ? '#f43f5e' : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(-6, -4); ctx.lineTo(-6, 4); ctx.fill();
      ctx.restore();
    } else if (p.type === 'toilet_paper') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = p.isEvo ? '#facc15' : '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    } else if (p.type === 'box_mortar') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.beginPath(); ctx.arc(p.targetX, p.targetY, 110, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();
    }
  }"""
    text = text.replace(old_proj_render_block, new_proj_render_block)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)

print("Patch 4 (render clean) applied.")
