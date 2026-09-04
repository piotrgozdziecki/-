import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

new_draw_projectiles = """// 16. Draw Projectiles
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
      const alpha = (p.life / (p.maxLife || 1.5)) * 0.45;
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
    } else if (p.type === 'faktura') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle || 0);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-10, -14, 20, 28);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-10, -14, 20, 28);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 8px Arial';
      ctx.fillText('KOREKTA', -9, -4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, 2, 16, 2);
      ctx.fillRect(-8, 6, 12, 2);
      ctx.restore();
    } else if (p.type === 'staple') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.fillStyle = p.isEvo ? '#facc15' : '#38bdf8';
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -1, 8, 2);
      ctx.restore();
    } else if (p.type === 'hydrant_beam') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(p.vy, p.vx));
      ctx.fillStyle = p.isEvo ? 'rgba(56, 189, 248, 0.9)' : 'rgba(96, 165, 250, 0.8)';
      ctx.fillRect(-14, -7, 28, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-10, -3, 20, 6);
      ctx.restore();
    } else if (p.type === 'shockwave') {
      ctx.strokeStyle = p.color || '#f59e0b';
      ctx.lineWidth = Math.max(1, 4 * (1 - p.radius / (p.maxRadius || 150)));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }"""

pos_start = text.find('// 16. Draw Projectiles')
pos_end = text.find('// 17. Draw Floating')
if pos_end == -1: pos_end = text.find('// 17.')

if pos_start != -1 and pos_end != -1:
    text = text[:pos_start] + new_draw_projectiles + "\n\n  " + text[pos_end:]
    print("Replaced drawProjectiles block successfully.")
else:
    print("ERROR finding drawProjectiles bounds!")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved updated game.html")
