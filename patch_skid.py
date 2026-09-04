import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make skids last much longer and cap at 300
content = content.replace("const MAX_SKIDS = 120;", "const MAX_SKIDS = 400;")
content = content.replace("life: 6.0, maxLife: 6.0", "life: 25.0, maxLife: 25.0")

# Render skid marks slightly thicker and darker
new_skid_render = """  // 8. Drift Tyre Skid Marks on Floor
  for (let i = 0; i < skidMarks.length; i++) {
    const s = skidMarks[i];
    if (s.x > camera.x - 40 && s.x < camera.x + viewW + 40 && s.y > camera.y - 40 && s.y < camera.y + viewH + 40) {
      const alpha = (s.life / s.maxLife) * 0.7; // Darker skid marks
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.fillStyle = `rgba(10, 10, 15, ${alpha})`;
      ctx.fillRect(-12, -12, 14, 5); // Thicker tire tracks
      ctx.fillRect(-12, 7, 14, 5);
      ctx.restore();
    }
  }"""

content = re.sub(r'  // 8\. Drift Tyre Skid Marks on Floor[^\}]+ctx\.restore\(\);\s*\}\s*\}', new_skid_render.strip(), content)

# Adjust skid mark generation
skid_generation = """    const angularDiff = Math.abs(diff);
    const isDrifting = (angularDiff > 0.25 || player.isDashing || (moveLen === 0 && Math.hypot(player.vx, player.vy) > 150));
    
    if (isDrifting) {
      if (Math.random() < (player.isForklift ? 0.70 : 0.30)) {
        addSkidMark(player.x, player.y, player.angle);
        
        // Smoke & Drift sparks
        const rearX = player.x - Math.cos(player.angle) * 16;
        const rearY = player.y - Math.sin(player.angle) * 16;
        spawnParticle(rearX, rearY, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, 0.45, 4.5, 'rgba(148, 163, 184, 0.5)');
        
        if (player.isDashing || angularDiff > 0.5 || Math.hypot(player.vx, player.vy) > 400) {
          spawnParticle(rearX, rearY, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0.35, 3.5, '#fbbf24');
        }
      }
    }
"""

content = re.sub(r'    const angularDiff = Math\.abs\(diff\);\s*if \(angularDiff > 0\.35 \|\| player\.isDashing\) \{\s*if \(Math\.random\(\) < 0\.40\) \{\s*addSkidMark\(player\.x, player\.y, player\.angle\);\s*// Smoke & Drift sparks\s*const rearX = player\.x - Math\.cos\(player\.angle\) \* 16;\s*const rearY = player\.y - Math\.sin\(player\.angle\) \* 16;\s*spawnParticle\(rearX, rearY, \(Math\.random\(\) - 0\.5\) \* 20, \(Math\.random\(\) - 0\.5\) \* 20, 0\.35, 3\.5, \'rgba\(148, 163, 184, 0\.4\)\'\);\s*if \(player\.isDashing \|\| angularDiff > 0\.7\) \{\s*spawnParticle\(rearX, rearY, \(Math\.random\(\) - 0\.5\) \* 40, \(Math\.random\(\) - 0\.5\) \* 40, 0\.25, 2\.5, \'#fbbf24\'\);\s*\}\s*\}\s*\}', skid_generation.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

