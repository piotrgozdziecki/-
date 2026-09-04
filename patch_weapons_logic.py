import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# For Scanner / bramkaRFID
scanner_old = """function fireScanner() {
  if (enemies.length === 0) return;
  let target = enemies[0];
  let minDist = Infinity;
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].dead) continue;
    let d = Math.hypot(enemies[i].x - player.x, enemies[i].y - player.y);
    if (d < minDist) { minDist = d; target = enemies[i]; }
  }
  if (minDist > weapons.scanner.range) return;

  sounds.hit();
  let angle = Math.atan2(target.y - player.y, target.x - player.x);
  
  if (weapons.scanner.isEvo) {
    projectiles.push({ type: 'laser', x: player.x, y: player.y, angle: angle, life: 0.8, color: '#facc15', width: 22, damage: weapons.scanner.damage, pierce: 99 });
  } else {
    projectiles.push({ type: 'laser', x: player.x, y: player.y, angle: angle, life: 0.15, color: '#38bdf8', width: 6, damage: weapons.scanner.damage, pierce: 2 });
  }
}"""

scanner_new = """function fireScanner() {
  if (weapons.scanner.isEvo) {
     // bramkaRFID - constant spinning lines
     const numLines = 4;
     const rfidAngle = gameTime * 2;
     for(let i=0; i<numLines; i++) {
        let a = rfidAngle + (i * Math.PI * 2 / numLines);
        projectiles.push({ type: 'laser', x: player.x, y: player.y, angle: a, life: 0.1, color: '#facc15', width: 14, damage: weapons.scanner.damage, pierce: 999 });
     }
  } else {
    if (enemies.length === 0) return;
    let target = enemies[0];
    let minDist = Infinity;
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].dead) continue;
      let d = Math.hypot(enemies[i].x - player.x, enemies[i].y - player.y);
      if (d < minDist) { minDist = d; target = enemies[i]; }
    }
    if (minDist > weapons.scanner.range) return;

    sounds.hit();
    let angle = Math.atan2(target.y - player.y, target.x - player.x);
    projectiles.push({ type: 'laser', x: player.x, y: player.y, angle: angle, life: 0.15, color: '#38bdf8', width: 6, damage: weapons.scanner.damage, pierce: 2 });
  }
}"""

text = text.replace(scanner_old, scanner_new)

# For Extinguisher / zraszacz
ext_old = """function fireExtinguisher() {
  const aimAngle = player.angle;
  projectiles.push({
    type: 'cold_cone',
    x: player.x,
    y: player.y,
    angle: aimAngle,
    range: weapons.extinguisher.range,
    damage: weapons.extinguisher.damage,
    life: 0.35,
    isEvo: weapons.extinguisher.isEvo
  });
}"""

ext_new = """function fireExtinguisher() {
  if (weapons.extinguisher.isEvo) {
    // Zraszacz PPOZ - Freeze all
    screenShake = 10;
    projectiles.push({ type: 'cold_cone', x: player.x, y: player.y, angle: 0, range: 2000, damage: weapons.extinguisher.damage, life: 1.0, isEvo: true });
    enemies.forEach(e => {
       e.slowTimer = 2.5;
       damageEnemy(e, weapons.extinguisher.damage);
       createSparks(e.x, e.y, 10, '#38bdf8');
    });
  } else {
    const aimAngle = player.angle;
    projectiles.push({
      type: 'cold_cone',
      x: player.x,
      y: player.y,
      angle: aimAngle,
      range: weapons.extinguisher.range,
      damage: weapons.extinguisher.damage,
      life: 0.35,
      isEvo: false
    });
  }
}"""

text = text.replace(ext_old, ext_new)

# owijarka (ToiletPaper) - It creates static rings around player
tp_old = """function fireToiletPaper() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.toiletPaper.isEvo ? 8 : weapons.toiletPaper.count;
  for (let i = 0; i < count; i++) {
    const angle = weapons.toiletPaper.isEvo 
      ? (i * (Math.PI * 2 / count))
      : player.angle + (Math.random() - 0.5) * 1.2;
    projectiles.push({
      type: 'toilet_paper',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.toiletPaper.speed,
      vy: Math.sin(angle) * weapons.toiletPaper.speed,
      rot: 0,
      damage: weapons.toiletPaper.damage,
      life: 2.5,
      isEvo: weapons.toiletPaper.isEvo
    });
  }
}"""

tp_new = """function fireToiletPaper() {
  if (weapons.toiletPaper.isEvo) {
    // Owijarka
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i * (Math.PI * 2 / count));
      const dist = 80 + Math.sin(gameTime * 2) * 15;
      projectiles.push({
        type: 'toilet_paper',
        x: player.x + Math.cos(angle) * dist,
        y: player.y + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        rot: angle,
        damage: weapons.toiletPaper.damage,
        life: 0.2, // short life, spammed constantly
        isEvo: true
      });
    }
  } else {
    if (enemies.length === 0) return;
    sounds.hit();
    const count = weapons.toiletPaper.count;
    for (let i = 0; i < count; i++) {
      const angle = player.angle + (Math.random() - 0.5) * 1.2;
      projectiles.push({
        type: 'toilet_paper',
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * weapons.toiletPaper.speed,
        vy: Math.sin(angle) * weapons.toiletPaper.speed,
        rot: 0,
        damage: weapons.toiletPaper.damage,
        life: 2.5,
        isEvo: false
      });
    }
  }
}"""

text = text.replace(tp_old, tp_new)


# btHighStack (Pallets) - leaves oil trail
pallet_old = """function firePallet() {
  if (enemies.length === 0) return;
  sounds.hit();
  const count = weapons.pallets.isEvo ? 4 : 1;
  for (let i = 0; i < count; i++) {
    const angle = weapons.pallets.isEvo ? (player.angle + (i - 1.5) * 0.4) : player.angle;
    projectiles.push({
      type: 'pallet',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * weapons.pallets.speed,
      vy: Math.sin(angle) * weapons.pallets.speed,
      rot: angle,
      damage: weapons.pallets.damage,
      life: 2.0,
      isEvo: weapons.pallets.isEvo
    });
  }
}"""

pallet_new = """function firePallet() {
  if (weapons.pallets.isEvo) {
     // BT High Stack auto ram + oil trail
     // Shoot high speed pallets in front
     projectiles.push({
        type: 'pallet', x: player.x, y: player.y,
        vx: Math.cos(player.angle) * 12, vy: Math.sin(player.angle) * 12,
        rot: player.angle, damage: weapons.pallets.damage, life: 1.0, isEvo: true
     });
     // Leave oil
     projectiles.push({
        type: 'oil_trail', x: player.x, y: player.y,
        vx: 0, vy: 0, rot: 0, damage: weapons.pallets.damage * 0.5, life: 4.0, isEvo: true
     });
  } else {
    if (enemies.length === 0) return;
    sounds.hit();
    projectiles.push({
      type: 'pallet', x: player.x, y: player.y,
      vx: Math.cos(player.angle) * weapons.pallets.speed, vy: Math.sin(player.angle) * weapons.pallets.speed,
      rot: player.angle, damage: weapons.pallets.damage, life: 2.0, isEvo: false
    });
  }
}"""

text = text.replace(pallet_old, pallet_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
