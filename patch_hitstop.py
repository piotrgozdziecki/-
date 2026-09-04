import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

global_old = """let mysteryTimer = 0;
let mysteryActive = '';"""
global_new = """let hitStopTimer = 0;
let mysteryTimer = 0;
let mysteryActive = '';"""
text = text.replace(global_old, global_new)

update_old = """function update(dt) {
  if (gameState !== STATE.PLAYING) return;
  gameTime += dt;"""
update_new = """function update(dt) {
  if (gameState !== STATE.PLAYING) return;
  
  if (hitStopTimer > 0) {
    hitStopTimer -= dt;
    return; // Frame freeze for juiciness
  }
  
  gameTime += dt;"""
text = text.replace(update_old, update_new)

dmg_old = """function damageEnemy(e, amount) {
  const isCrit = Math.random() < player.critChance;
  let dmg = isCrit ? amount * 1.75 : amount;"""
dmg_new = """function damageEnemy(e, amount) {
  const isCrit = Math.random() < player.critChance;
  let dmg = isCrit ? amount * 1.75 : amount;
  
  if (isCrit || e.isBoss) {
      hitStopTimer = 0.025; // 25ms hit-stop
      screenShake = Math.max(screenShake, 4);
  }"""
text = text.replace(dmg_old, dmg_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
