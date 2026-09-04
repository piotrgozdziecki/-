import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

spawn_old = """  enemies.push({
    x: ex,
    y: ey,
    info: t,
    hp: isBoss ? t.hp * (1 + currentMinutes * 0.25) : t.hp * (1 + currentMinutes * 0.15),
    isBoss: isBoss,
    quoteTimer: 1 + Math.random() * 2,
    slowTimer: 0
  });"""

spawn_new = """  const angleToPlayer = Math.atan2(player.y - ey, player.x - ex);
  enemies.push({
    x: ex,
    y: ey,
    vx: Math.cos(angleToPlayer),
    vy: Math.sin(angleToPlayer),
    info: t,
    hp: isBoss ? t.hp * (1 + currentMinutes * 0.25) : t.hp * (1 + currentMinutes * 0.15),
    isBoss: isBoss,
    quoteTimer: 1 + Math.random() * 2,
    slowTimer: 0,
    dashTimer: t.canDash ? Math.random() * 3 + 2 : 0,
    shootTimer: t.shooter ? Math.random() * 2 + 1 : 0
  });"""

text = text.replace(spawn_old, spawn_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
