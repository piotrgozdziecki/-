import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to updateWeapons
update_weapons_addition = """  if (weapons.faktura.level > 0) {
    weapons.faktura.timer += effectiveDt;
    if (weapons.faktura.timer >= weapons.faktura.cooldown) {
      weapons.faktura.timer = 0;
      fireFaktura();
    }
  }
  if (weapons.kawa.level > 0) {
    weapons.kawa.timer += effectiveDt;
    if (weapons.kawa.timer >= weapons.kawa.cooldown) {
      weapons.kawa.timer = 0;
      fireKawa();
    }
  }
}
"""
content = re.sub(r'  if \(weapons\.sledgehammer\.level > 0\) \{[^\}]+}[^\}]+}\s*}', lambda m: m.group(0)[:-1] + update_weapons_addition, content)


# Add the firing functions
firing_functions = """
function fireFaktura() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.faktura.isEvo ? 5 : 2;
  const dmg = getDamage(weapons.faktura.damage);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    projectiles.push({
      type: 'faktura',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.faktura.speed,
      vy: Math.sin(angle) * weapons.faktura.speed,
      damage: dmg,
      pierce: weapons.faktura.isEvo ? 5 : 2,
      life: 3.0,
      maxLife: 3.0,
      angle: angle,
      rotSpeed: (Math.random() - 0.5) * 15
    });
  }
}

function fireKawa() {
  sounds.freeze();
  const r = weapons.kawa.isEvo ? weapons.kawa.radius * 2 : weapons.kawa.radius;
  const dmg = getDamage(weapons.kawa.damage);
  
  // Splat effect
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * r;
    const px = player.x + Math.cos(angle) * dist;
    const py = player.y + Math.sin(angle) * dist;
    warehousePuddles.push({
      x: px, y: py, rx: 15 + Math.random() * 20, ry: 10 + Math.random() * 15,
      color: 'rgba(60, 42, 33, 0.7)' // dark coffee color
    });
  }

  // Damage enemies
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const dist = Math.hypot(e.x - player.x, e.y - player.y);
    if (dist <= r) {
      takeDamage(e, dmg);
      spawnDamageText(e.x, e.y - 20, dmg, '#78350f', true);
    }
  }
}
"""

content = content.replace("function fireStapler() {", firing_functions + "\nfunction fireStapler() {")

# Add missing player attributes in update for furia/alkomat
# Actually attackSpeedMult and dodgeChance need to be calculated based on passives.

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
