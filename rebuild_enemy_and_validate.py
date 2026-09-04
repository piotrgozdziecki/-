import re
import subprocess

with open("app/src/main/assets/game.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the old malformed drawSingleEnemy
idx_dse = content.find("function drawSingleEnemy(ctx, e, viewW, viewH) {")
if idx_dse != -1:
    idx_render = content.find("function render(dt = 0.016)")
    content = content[:idx_dse] + content[idx_render:]
    print("Removed old broken drawSingleEnemy")

# 2. Add complete, robust, 100% valid drawSingleEnemy
new_draw_single_enemy = """
function drawSingleEnemy(ctx, e, viewW, viewH) {
  if (!e || e.dead) return;
  if (e.x + 80 < camera.x || e.x - 80 > camera.x + viewW ||
      e.y + 80 < camera.y || e.y - 80 > camera.y + viewH) return;

  ctx.save();
  ctx.translate(e.x, e.y);

  const rad = (e.info && e.info.radius) ? e.info.radius : 15;
  const isHit = e.hitFlash > 0;
  const isFrozen = e.slowTimer > 0;
  const facing = Math.atan2(player.y - e.y, player.x - e.x);

  // 1. 2.5D Contact Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.beginPath();
  ctx.ellipse(0, rad * 0.7, rad * 0.95, rad * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (isHit) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, rad + 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  // 2. Character Specific 3D Isometric Models
  const rType = (e.info && e.info.renderType) ? e.info.renderType : 'pedestrian';

  if (rType === 'warehouse_rat') {
    // 3D Scurrying Warehouse Rat
    ctx.rotate(facing);
    ctx.fillStyle = isFrozen ? '#38bdf8' : (e.info.color || '#64748b');
    ctx.beginPath(); ctx.ellipse(0, 0, rad * 1.2, rad * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath(); ctx.arc(rad * 0.9, -rad * 0.4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rad * 0.9, rad * 0.4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-rad * 1.1, 0);
    ctx.quadraticCurveTo(-rad * 1.8, Math.sin(gameTime * 20 + e.x) * 6, -rad * 2.2, 0);
    ctx.stroke();
  } else if (rType === 'inventory_drone') {
    // 3D Hovering Quadcopter Drone
    const hoverY = Math.sin(gameTime * 8 + e.x) * 4;
    ctx.translate(0, hoverY);
    ctx.fillStyle = isFrozen ? '#38bdf8' : '#1e293b';
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.stroke();
    const rotorDist = rad * 1.1;
    const bladeRot = gameTime * 35;
    const rPos = [[-rotorDist, -rotorDist], [rotorDist, -rotorDist], [-rotorDist, rotorDist], [rotorDist, rotorDist]];
    for (let r = 0; r < 4; r++) {
      const rx = rPos[r][0]; const ry = rPos[r][1];
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx - 2, ry - 2, 4, 4);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(rx, ry, 6, bladeRot, bladeRot + Math.PI);
      ctx.stroke();
    }
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
  } else if (rType === 'inpost_paczkomat') {
    // 3D Walking InPost Locker
    ctx.rotate(facing);
    ctx.fillStyle = isFrozen ? '#38bdf8' : '#eab308';
    ctx.fillRect(-rad, -rad * 0.8, rad * 2, rad * 1.6);
    ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2;
    ctx.strokeRect(-rad, -rad * 0.8, rad * 2, rad * 1.6);
    ctx.strokeStyle = '#713f12'; ctx.lineWidth = 1;
    ctx.strokeRect(-rad + 4, -rad * 0.6, rad * 1.2, rad * 1.2);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(rad * 0.4, -rad * 0.4, rad * 0.4, rad * 0.8);
    ctx.fillStyle = '#000000'; ctx.font = 'bold 8px sans-serif';
    ctx.fillText('InPost', -rad + 3, rad * 0.7);
  } else if (rType === 'delivery_van') {
    // 3D Delivery Van (Fiat Ducato)
    ctx.rotate(facing);
    const vanGrad = ctx.createLinearGradient(-rad * 1.8, 0, rad * 1.8, 0);
    vanGrad.addColorStop(0, '#f8fafc');
    vanGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = isFrozen ? '#38bdf8' : vanGrad;
    ctx.fillRect(-rad * 1.8, -rad, rad * 3.6, rad * 2);
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
    ctx.strokeRect(-rad * 1.8, -rad, rad * 3.6, rad * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(rad * 0.6, -rad + 3, rad * 0.7, rad * 2 - 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(rad * 1.7, -rad + 2, 3, 5);
    ctx.fillRect(rad * 1.7, rad - 7, 3, 5);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-rad * 1.2, -rad - 4, 8, 4);
    ctx.fillRect(-rad * 1.2, rad, 8, 4);
    ctx.fillRect(rad * 0.8, -rad - 4, 8, 4);
    ctx.fillRect(rad * 0.8, rad, 8, 4);
  } else {
    // Standard 3D Humanoid Worker / Courier / Guard
    ctx.rotate(facing);
    const walkSwing = Math.sin(gameTime * 14 + e.x) * 6;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8 + walkSwing, -10, 6, 5);
    ctx.fillRect(-8 - walkSwing, 5, 6, 5);

    ctx.fillStyle = isFrozen ? '#38bdf8' : (e.info.color || '#ea580c');
    ctx.beginPath();
    ctx.roundRect(-rad * 0.8, -rad * 0.7, rad * 1.6, rad * 1.4, 4);
    ctx.fill();
    ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-rad * 0.6, -rad * 0.3); ctx.lineTo(rad * 0.6, -rad * 0.3);
    ctx.moveTo(-rad * 0.6, rad * 0.3); ctx.lineTo(rad * 0.6, rad * 0.3);
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(rad * 0.3, 0, rad * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.2; ctx.stroke();
  }

  // 3. Health Bar if damaged
  if (e.hp < e.maxHp) {
    ctx.rotate(-facing);
    const barW = Math.max(24, rad * 2);
    const hpRatio = Math.max(0, Math.min(1, e.hp / e.maxHp));
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(-barW / 2, -rad - 14, barW, 4);
    ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(-barW / 2 + 1, -rad - 13, (barW - 2) * hpRatio, 2);
  }

  ctx.restore();
}
"""

idx_render = content.find("function render(dt = 0.016)")
content = content[:idx_render] + new_draw_single_enemy + "\n" + content[idx_render:]

# Also ensure window.onAndroidReady is clean
content = re.sub(
    r'window\.onAndroidReady\s*=\s*function\(\)\s*\{\s*\}',
    'window.onAndroidReady = function()',
    content
)

with open("app/src/main/assets/game.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Saved updated game.html. Verifying syntax...")
scripts = re.findall(r"<script>([\s\S]*?)</script>", content)
all_clean = True
for i, s in enumerate(scripts):
    tmp_path = f"/tmp/check_script_{i}.js"
    with open(tmp_path, "w", encoding="utf-8") as tf:
        tf.write(s)
    res = subprocess.run(["node", "-c", tmp_path], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"SYNTAX ERROR in script {i}:", res.stderr)
        all_clean = False
    else:
        print(f"Script {i} syntax is 100% VALID!")

if all_clean:
    print("ALL SCRIPTS IN GAME.HTML ARE 100% SYNTAX ERROR-FREE!")
