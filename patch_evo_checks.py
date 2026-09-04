import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

checks_old = """  // Check possible Weapon Evolutions
  if (weapons.scanner.level >= 5 && passives.magnet.level >= 1 && !weapons.scanner.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.zebraLaser });
  }
  if (weapons.toiletPaper.level >= 5 && passives.coffee.level >= 1 && !weapons.toiletPaper.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.toiletRollerStorm });
  }
  if (weapons.stretchAura.level >= 5 && passives.forks.level >= 1 && !weapons.stretchAura.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.stretchFortress });
  }
  if (weapons.pallets.level >= 5 && passives.battery.level >= 1 && !weapons.pallets.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.euroTurbo });
  }
  if (weapons.extinguisher.level >= 5 && passives.battery.level >= 1 && !weapons.extinguisher.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.nitrogenStorm });
  }
  if (weapons.zipTies.level >= 5 && passives.magnet.level >= 1 && !weapons.zipTies.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.steelTies });
  }
  if (weapons.cutter.level >= 5 && passives.forks.level >= 1 && !weapons.cutter.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.machete });
  }"""

checks_new = """  // Check possible Weapon Evolutions
  if (weapons.scanner.level >= 5 && passives.battery.level >= 1 && !weapons.scanner.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.bramkaRFID });
  }
  if (weapons.toiletPaper.level >= 5 && passives.magnet.level >= 1 && !weapons.toiletPaper.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.owijarka });
  }
  if (weapons.pallets.level >= 5 && passives.coffee.level >= 1 && !weapons.pallets.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.btHighStack });
  }
  if (weapons.extinguisher.level >= 5 && passives.forks.level >= 1 && !weapons.extinguisher.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.zraszacz });
  }
  if (weapons.zipTies.level >= 5 && passives.magnet.level >= 1 && !weapons.zipTies.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.steelTies });
  }
  if (weapons.cutter.level >= 5 && passives.forks.level >= 1 && !weapons.cutter.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.machete });
  }"""
  
text = text.replace(checks_old, checks_new)

apply_evo_old = re.search(r'function applyEvolution\(evo\) \{.*?\n\}', text, re.DOTALL).group(0)

apply_evo_new = """function applyEvolution(evo) {
  sounds.evoSound();
  screenShake = 12;
  triggerAchievement('weapon_evolution', 'Ewolucja Magazynowa', '💥');
  if (evo.id === 'bramkaRFID') {
    weapons.scanner.isEvo = true;
    weapons.scanner.damage = 100;
  } else if (evo.id === 'owijarka') {
    weapons.toiletPaper.isEvo = true;
    weapons.toiletPaper.damage = 60;
  } else if (evo.id === 'btHighStack') {
    weapons.pallets.isEvo = true;
    weapons.pallets.damage = 90;
    weapons.pallets.cooldown = 0.5;
  } else if (evo.id === 'zraszacz') {
    weapons.extinguisher.isEvo = true;
    weapons.extinguisher.damage = 150;
    weapons.extinguisher.timer = 0;
    weapons.extinguisher.cooldown = 10.0;
  } else if (evo.id === 'steelTies') {
    weapons.zipTies.isEvo = true;
    weapons.zipTies.damage = 60;
    weapons.zipTies.cooldown = 0.8;
  } else if (evo.id === 'machete') {
    weapons.cutter.isEvo = true;
    weapons.cutter.damage = 45;
    weapons.cutter.cooldown = 0.35;
  }
}"""

text = text.replace(apply_evo_old, apply_evo_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
