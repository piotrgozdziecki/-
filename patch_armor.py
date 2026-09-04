import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

dmg_old = """function damageEnemy(e, amount) {
  const isCrit = Math.random() < player.critChance;
  const dmg = isCrit ? amount * 1.75 : amount;"""

dmg_new = """function damageEnemy(e, amount) {
  const isCrit = Math.random() < player.critChance;
  let dmg = isCrit ? amount * 1.75 : amount;
  
  if (e.info.armor) dmg *= 0.3; // 70% damage reduction
  if (e.info.directionalShield) {
     const angleToPlayer = Math.atan2(player.y - e.y, player.x - e.x);
     // Enemy is moving towards its vx, vy (Math.atan2(vy, vx))
     const moveAngle = Math.atan2(e.vy, e.vx);
     const diff = Math.abs(angleToPlayer - moveAngle);
     // if diff > PI/2, it means player is attacking from behind
     // Wait, if player is in front, angleToPlayer is roughly equal to moveAngle
     // No, the enemy is moving towards player, so moveAngle is towards player.
     // If the projectile hits, where is the projectile coming from? We don't have projectile source here.
     // So just 50% flat reduction as a simple shield, or require AoE? Let's just flat 50% for now.
     dmg *= 0.5; 
  }
  """

text = text.replace(dmg_old, dmg_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
