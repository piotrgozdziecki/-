import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

start_idx = text.find('  // Forklift Ground Shadow')
end_idx = text.find('  ctx.restore();', start_idx)

original_render = text[start_idx:end_idx]

new_render = """  if (player.isForklift) {
    // Forklift Ground Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 30, 20, player.angle, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(player.angle);

    // Iron Rear Counterweight
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-27, -14, 8, 28);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(-27, -14, 8, 28);

    // Main Chassis (Toyota Industrial Orange)
    const chassisGrad = ctx.createLinearGradient(-24, -16, 24, 16);
    chassisGrad.addColorStop(0, '#ea580c');
    chassisGrad.addColorStop(0.5, '#f97316');
    chassisGrad.addColorStop(1, '#c2410c');
    ctx.fillStyle = chassisGrad;
    ctx.fillRect(-24, -16, 48, 32);
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-24, -16, 48, 32);

    // Roll Cage Safety Frame
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-14, -13, 20, 26);

    // Cockpit Glass Roof with tint
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(-13, -12, 18, 24);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.fillRect(-11, -10, 14, 20);

    // Steering Wheel & Operator Seat
    ctx.fillStyle = '#334155';
    ctx.beginPath(); ctx.arc(-4, 0, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.arc(4, 0, 3, 0, Math.PI * 2); ctx.fill();

    // Heavy Duty Steel Mast & Forks
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, -14, 5, 28);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(25, -13, 22, 6);
    ctx.fillRect(25, 7, 22, 6);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(25, -13, 3, 6);
    ctx.fillRect(25, 7, 3, 6);

    // Rotating Amber Warning Light Flare on Roof
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(-5, 0, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(-5, 0, 2.5, 0, Math.PI * 2); ctx.fill();

    // Toyota BT Exhaust Pipe Nozzle & Turbo Flame Plume (Rear Left)
    ctx.fillStyle = '#334155';
    ctx.fillRect(-29, 6, 5, 6);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(-29, 6, 5, 6);

    if (packageCombo > 0 || player.isDashing) {
      const flameLen = Math.min(32, 8 + packageCombo * 1.3 + Math.sin(gameTime * 28) * 4);
      const flameGrad = ctx.createLinearGradient(-29, 9, -29 - flameLen, 9);
      if (packageCombo >= 15) {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.25, '#38bdf8');
        flameGrad.addColorStop(0.65, '#c084fc');
        flameGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
      } else if (packageCombo >= 5) {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#fbbf24');
        flameGrad.addColorStop(0.7, '#ea580c');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.4, '#38bdf8');
        flameGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      }
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-29, 7);
      ctx.lineTo(-29 - flameLen, 9);
      ctx.lineTo(-29, 11);
      ctx.closePath();
      ctx.fill();
    }

    // Aerodynamic High-Speed Motion Lines (Wind Streaks)
    if (packageCombo >= 6 || player.isDashing) {
      ctx.strokeStyle = packageCombo >= 15 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 1.5;
      const streakOffset = (gameTime * 70) % 22;
      ctx.beginPath();
      ctx.moveTo(-35 - streakOffset, -18);
      ctx.lineTo(25 - streakOffset, -18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-35 - streakOffset, 18);
      ctx.lineTo(25 - streakOffset, 18);
      ctx.stroke();
    }
  } else {
    // On-foot Player Rendering (Pedestrian)
    ctx.rotate(player.angle);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(-2, 2, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (Hi-Vis vest)
    ctx.fillStyle = '#fbbf24'; // Yellow-orange vest
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Reflective stripes
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, -6);
    ctx.lineTo(10, -6);
    ctx.moveTo(-10, 6);
    ctx.lineTo(10, 6);
    ctx.stroke();

    // Head
    ctx.fillStyle = '#fcd34d'; // Skin tone
    ctx.beginPath();
    ctx.arc(4, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();

    // Hands
    const legOffset = Math.sin(gameTime * (Math.hypot(player.vx, player.vy) * 2)) * 6;
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath(); ctx.arc(10 + legOffset, -14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(10 - legOffset, 14, 4, 0, Math.PI * 2); ctx.fill();
  }
"""

text = text.replace(original_render, new_render)
with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
