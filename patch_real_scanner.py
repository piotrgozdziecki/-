import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

scanner_old = re.search(r'function fireScanner\(\) \{.*?\n\}\n', text, re.DOTALL).group(0)

scanner_new = """function fireScanner() {
  if (weapons.scanner.isEvo) {
    // bramkaRFID - constant spinning lines
    const numLines = 4;
    const rfidAngle = gameTime * 3;
    const range = 250;
    for(let i=0; i<numLines; i++) {
       let a = rfidAngle + (i * Math.PI * 2 / numLines);
       let ex = player.x + Math.cos(a) * range;
       let ey = player.y + Math.sin(a) * range;
       projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: ex, y2: ey, life: 0.1, color: '#facc15' });
       // Check collisions along this line
       for (let j = 0; j < enemies.length; j++) {
          let e = enemies[j];
          if (e.dead) continue;
          let dx = e.x - player.x; let dy = e.y - player.y;
          let enemyAngle = Math.atan2(dy, dx);
          let dist = Math.hypot(dx, dy);
          if (dist < range && Math.abs(enemyAngle - a) < 0.2) {
             damageEnemy(e, weapons.scanner.damage);
             e.info.xp *= 1.5; // +50% XP
             createSparks(e.x, e.y, 5, '#facc15');
          }
       }
    }
    sounds.beep();
  } else {
    if (enemies.length === 0) return;
    const maxRangeSq = weapons.scanner.range * weapons.scanner.range;
    let count = 0;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.dead) continue;
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      if (dx * dx + dy * dy <= maxRangeSq) {
        projectiles.push({ type: 'laser', x1: player.x, y1: player.y, x2: e.x, y2: e.y, life: 0.15, color: '#ef4444' });
        damageEnemy(e, weapons.scanner.damage);
        createSparks(e.x, e.y, 4, '#ef4444');
        count++;
        if (count >= weapons.scanner.pierce) break;
      }
    }
    if (count > 0) sounds.beep();
  }
}
"""

text = text.replace(scanner_old, scanner_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
