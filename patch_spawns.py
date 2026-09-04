import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

spawn_old = """function spawnBatchByTime(minutes) {
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

spawn_new = """function spawnBatchByTime(minutes) {
  spawnEnemy('KARTON_B2C'); // mass enemy
  if (minutes > 3 * 60 + 20) {
     spawnEnemy('FOLIA');
     spawnEnemy('KARTON_B2C'); // Swarm
  }
  if (minutes > 3 * 60 + 35) spawnEnemy('KIEROWCA_TIR');
  if (minutes > 3 * 60 + 50) spawnEnemy('WOZEK_AWARIA');
  if (minutes > 4 * 60 + 10) spawnEnemy('PALETA_KAM');
  if (minutes > 4 * 60 + 30) spawnEnemy('RAMPA');
  if (minutes > 5 * 60) spawnEnemy('CELNIK');
  if (minutes > 5 * 60 + 20) spawnEnemy('KIEROWCA_TIR');
  if (minutes > 5 * 60 + 40) spawnEnemy('WOZEK_AWARIA');
  if (minutes > 6 * 60) { spawnEnemy('CELNIK'); spawnEnemy('RAMPA'); }
}"""

text = text.replace(spawn_old, spawn_new)

boss_old = """  // Boss Timers
  if (currentMinutes >= 3 * 60 + 50 && !bossFlags.grzesiek) {
    bossFlags.grzesiek = true;
    spawnEnemy('BOSS_GRZESIEK', true);
  }
  if (currentMinutes >= 4 * 60 + 45 && !bossFlags.toitoi) {
    bossFlags.toitoi = true;
    spawnEnemy('BOSS_TOITOI_MECH', true);
  }
  if (currentMinutes >= 5 * 60 + 40 && !bossFlags.kontener) {
    bossFlags.kontener = true;
    spawnEnemy('BOSS_KONTENER', true);
  }
  if (currentMinutes >= 6 * 60 + 20 && !bossFlags.igor) {
    bossFlags.igor = true;
    spawnEnemy('BOSS_IGOR', true);
  }"""

boss_new = """  // Boss Timers
  if (currentMinutes >= 5 * 60 && !bossFlags.grzesiek) {
    bossFlags.grzesiek = true;
    spawnEnemy('BOSS_KAS', true);
  }
  if (currentMinutes >= 6 * 60 + 20 && !bossFlags.kontener) {
    bossFlags.kontener = true;
    spawnEnemy('BOSS_KONTENER', true);
  }"""
text = text.replace(boss_old, boss_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
