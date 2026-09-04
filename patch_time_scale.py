import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update gameLoop for timeScale
game_loop = """function gameLoop(now) {
  let dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  
  if (window.timeScale === undefined) window.timeScale = 1.0;
  if (window.timeScale < 1.0) {
      window.timeScale = Math.min(1.0, window.timeScale + dt * 0.85); // Smoothly recover from slow-mo
  }
  
  // Apply time scale to game logic update, but keep UI (particles/texts) real-time or semi-real-time
  const gameDt = dt * window.timeScale;

  // Update particles & texts
"""
content = content.replace("function gameLoop(now) {\n  const dt = Math.min(0.1, (now - lastTime) / 1000);\n  lastTime = now;\n\n  // Update particles & texts", game_loop)

# 2. Update the update() call to use gameDt
content = content.replace("  update(dt);\n  render();", "  update(gameDt);\n  render();")


# 3. Add boss slow-mo in killEnemy
boss_slow_mo = """  if (e.isBoss) {
    dropItems.push({ x: e.x, y: e.y, type: 'lucky_chest', val: 3, life: 60 });
    dropItems.push({ x: e.x + 25, y: e.y + 10, type: 'dta_coin', val: 100, life: 60 });
    window.timeScale = 0.15; // Massive cinematic slow-mo!
    screenShake = 20;
  }"""
content = re.sub(r'  if \(e\.isBoss\) \{\s*dropItems\.push\(\{ x: e\.x, y: e\.y, type: \'lucky_chest\', val: 3, life: 60 \}\);\s*dropItems\.push\(\{ x: e\.x \+ 25, y: e\.y \+ 10, type: \'dta_coin\', val: 100, life: 60 \}\);\s*\}', boss_slow_mo.strip(), content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

