import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

spawn_old = """function spawnBatchByTime(minutes) {
  spawnEnemy('KLAPKI');
  if (minutes > 3 * 60 + 30) spawnEnemy('UKRAINA_EKIPA');
  if (minutes > 3 * 60 + 45) spawnEnemy('TASMA');
  if (minutes > 4 * 60) spawnEnemy('DWIE_PALETY_BUS');
  if (minutes > 4 * 60 + 20) spawnEnemy('SPEDYTOR');
  if (minutes > 4 * 60 + 40) spawnEnemy('AWIZO');
  if (minutes > 5 * 60 + 10) spawnEnemy('WIESLAW_REACH');
}"""

spawn_new = """function spawnBatchByTime(minutes) {
  spawnEnemy('KLAPKI');
  if (minutes > 3 * 60 + 20) {
     spawnEnemy('PRAKTYKANT');
     spawnEnemy('PRAKTYKANT'); // Swarm
  }
  if (minutes > 3 * 60 + 30) spawnEnemy('UKRAINA_EKIPA');
  if (minutes > 3 * 60 + 40) spawnEnemy('KURIER');
  if (minutes > 3 * 60 + 45) spawnEnemy('TASMA');
  if (minutes > 4 * 60) spawnEnemy('DWIE_PALETY_BUS');
  if (minutes > 4 * 60 + 10) spawnEnemy('AUDYTOR');
  if (minutes > 4 * 60 + 20) spawnEnemy('SPEDYTOR');
  if (minutes > 4 * 60 + 40) spawnEnemy('AWIZO');
  if (minutes > 5 * 60 + 10) spawnEnemy('WIESLAW_REACH');
}"""
text = text.replace(spawn_old, spawn_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
