import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Add weapons definition
weapons_old = """  extinguisher: { level: 0, timer: 0, cooldown: 2.5, damage: 36, range: 240, icon: '🧯', isEvo: false }
};"""
weapons_new = """  extinguisher: { level: 0, timer: 0, cooldown: 2.5, damage: 36, range: 240, icon: '🧯', isEvo: false },
  zipTies: { level: 0, timer: 0, cooldown: 1.2, damage: 25, speed: 10, icon: '🔗', isEvo: false },
  cutter: { level: 0, timer: 0, cooldown: 0.7, damage: 15, speed: 12, icon: '🔪', isEvo: false }
};"""
text = text.replace(weapons_old, weapons_new)

# 2. Add update logic
update_old = """  if (weapons.extinguisher.level > 0) {
    weapons.extinguisher.timer += effectiveDt;
    if (weapons.extinguisher.timer >= weapons.extinguisher.cooldown) {
      weapons.extinguisher.timer = 0;
      fireExtinguisher();
    }
  }"""
update_new = update_old + """
  if (weapons.zipTies.level > 0) {
    weapons.zipTies.timer += effectiveDt;
    if (weapons.zipTies.timer >= weapons.zipTies.cooldown) {
      weapons.zipTies.timer = 0;
      fireZipTies();
    }
  }
  if (weapons.cutter.level > 0) {
    weapons.cutter.timer += effectiveDt;
    if (weapons.cutter.timer >= weapons.cutter.cooldown) {
      weapons.cutter.timer = 0;
      fireCutter();
    }
  }"""
text = text.replace(update_old, update_new)

# 3. Add firing functions
firing_fns = """function fireZipTies() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.zipTies.isEvo ? 6 : 3;
  for (let i = 0; i < count; i++) {
    const angle = player.angle + (Math.random() - 0.5) * 3;
    projectiles.push({
      type: 'zip_tie',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.zipTies.speed,
      vy: Math.sin(angle) * weapons.zipTies.speed,
      rot: angle,
      damage: weapons.zipTies.damage,
      life: 60,
      isEvo: weapons.zipTies.isEvo
    });
  }
}

function fireCutter() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.cutter.isEvo ? 4 : 2;
  for (let i = 0; i < count; i++) {
    let target = enemies[Math.floor(Math.random() * enemies.length)];
    let angle = Math.atan2(target.y - player.y, target.x - player.x) + (Math.random()-0.5)*0.5;
    projectiles.push({
      type: 'cutter',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.cutter.speed,
      vy: Math.sin(angle) * weapons.cutter.speed,
      rot: angle,
      damage: weapons.cutter.damage,
      life: 80,
      isEvo: weapons.cutter.isEvo
    });
  }
}"""
text = text.replace("function fireToiletPaper() {", firing_fns + "\n\nfunction fireToiletPaper() {")

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
