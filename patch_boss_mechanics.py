import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

boss_old = """    // Special attacks & speech
    e.quoteTimer -= dt;"""

boss_new = """    // Boss Mechanics
    if (e.info.mechanics === 'kas_zone') {
       if (!e.kasTimer) e.kasTimer = 10.0;
       e.kasTimer -= dt;
       if (e.kasTimer <= 0) {
          e.kasTimer = 15.0;
          projectiles.push({ type: 'kas_red_zone', x: player.x, y: player.y, radius: 180, life: 5.0, timer: 5.0 });
          addSpeechBubble(e.x, e.y - 30, '🚨 REWIZJA SZCZEGÓŁOWA!', '#ef4444');
       }
    } else if (e.info.mechanics === 'spawner') {
       // Kontenerowiec sits near top
       e.y = camera.y + 100;
       e.x = camera.x + gameWidth / 2 + Math.sin(gameTime) * 200;
       if (!e.spawnTimer) e.spawnTimer = 3.0;
       e.spawnTimer -= dt;
       if (e.spawnTimer <= 0) {
          e.spawnTimer = 4.0;
          spawnEnemy('KARTON_B2C');
          spawnEnemy('FOLIA');
          spawnEnemy('KIEROWCA_TIR');
       }
    }
    
    // Special attacks & speech
    e.quoteTimer -= dt;"""

text = text.replace(boss_old, boss_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
