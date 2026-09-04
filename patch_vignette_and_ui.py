import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Vignette
vignette = """  // 20. AMOLED Screen Edge Cinematic Vignette & Low Battery Pulse
  const vigGrad = ctx.createRadialGradient(
    gameWidth / 2, gameHeight / 2, Math.min(gameWidth, gameHeight) * 0.35,
    gameWidth / 2, gameHeight / 2, Math.max(gameWidth, gameHeight) * 0.85
  );
  vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  
  let edgeColor = 'rgba(2, 6, 23, 0.75)'; // Darker edges for warehouse feel
  
  // Low battery red pulsing
  if (player.battery < player.maxBattery * 0.25) {
     const pulse = (Math.sin(performance.now() / 150) + 1) / 2; // Fast heartbeat pulse
     edgeColor = `rgba(${100 + pulse * 100}, 0, 0, ${0.4 + pulse * 0.4})`;
  } else if (selectedArenaKey === 'freezer') {
     edgeColor = 'rgba(2, 20, 40, 0.8)'; // Cold blue edges
  }
  
  vigGrad.addColorStop(1, edgeColor);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}"""

content = re.sub(r'  // 20\. AMOLED Screen Edge Cinematic Vignette[\s\S]*?ctx\.fillRect\(0, 0, gameWidth, gameHeight\);\n\}', vignette.strip() + '\n}', content)


# 2. Update Floating Text scale
floating_text_patch = """      const lifePct = ft.life / ft.maxLife;
      const alpha = Math.min(1.0, ft.life * 2.5); // Fade out later
      ctx.save();
      ctx.globalAlpha = alpha;
      
      let baseDmgSize = ft.isCrit ? 18 : 13;
      if (ft.isCrit) {
         // Massive popup scale on critical hits
         if (lifePct > 0.8) {
             baseDmgSize += (lifePct - 0.8) * 45; // Pop!
         }
      }
      
      const dmgFontSize = Math.round(baseDmgSize * fontScale);"""

content = re.sub(r'      const alpha = Math\.min\(1\.0, ft\.life \* 2\.0\);\s*ctx\.save\(\);\s*ctx\.globalAlpha = alpha;\s*const baseDmgSize = ft\.isCrit \? 16 : 13;\s*const dmgFontSize = Math\.round\(baseDmgSize \* fontScale\);', floating_text_patch.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

