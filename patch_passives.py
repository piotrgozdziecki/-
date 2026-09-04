import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to applyUpgrade
upgrade_logic = """    if (opt.id === 'magnet') player.magnetRange += 75;
    if (opt.id === 'forks') player.critChance += 0.12;
    if (opt.id === 'coffee') { player.speed += 18; player.maxSkillCooldown = Math.max(3.5, player.maxSkillCooldown - 1.0); }
    if (opt.id === 'battery') { player.maxBattery += 35; player.battery = Math.min(player.maxBattery, player.battery + 40); }
    if (opt.id === 'furia') player.attackSpeedMult = (player.attackSpeedMult || 1.0) + 0.25;
    if (opt.id === 'alkomat') player.dodgeChance = (player.dodgeChance || 0) + 0.15;
"""

content = re.sub(r"    if \(opt\.id === 'magnet'\) player\.magnetRange \+= 75;\s*if \(opt\.id === 'forks'\)[^\}]+\s*if \(opt\.id === 'coffee'\)[^\}]+\}\s*if \(opt\.id === 'battery'\)[^\}]+\}", upgrade_logic.strip(), content)


# Add dodge chance logic to takeDamage
dodge_logic = """function takeDamage(enemy, amount) {"""

content = content.replace("function takeDamage(enemy, amount) {", dodge_logic)

player_dodge = """
function playerTakeDamage(amount) {
  if (player.invulnTimer > 0) return;
  if (player.dodgeChance && Math.random() < player.dodgeChance) {
    spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
    return;
  }
  if (player.shield > 0) {
    player.shield--;
    sounds.hit();
    spawnParticle(player.x, player.y, (Math.random()-0.5)*20, -20, 0.4, 4, '#38bdf8');
    player.invulnTimer = 0.5;
    return;
  }
  player.battery -= amount;
  sounds.hit();
  screenShake = 10;
  player.invulnTimer = 0.5;
  if (player.battery <= 0) {
    player.battery = 0;
    triggerGameOver();
  }
}
"""

content = re.sub(r'function takeDamage(enemy, amount).*$', lambda m: m.group(0), content) # not sure if player take damage exists as function

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
