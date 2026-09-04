import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

evo_old = """  } else if (evo.id === 'nitrogenStorm') {
    weapons.extinguisher.isEvo = true;
    weapons.extinguisher.damage = 80;
    weapons.extinguisher.range = 340;
  }
}"""

evo_new = evo_old.replace("  }\n}", """  } else if (evo.id === 'steelTies') {
    weapons.zipTies.isEvo = true;
    weapons.zipTies.damage = 60;
    weapons.zipTies.cooldown = 0.8;
  } else if (evo.id === 'machete') {
    weapons.cutter.isEvo = true;
    weapons.cutter.damage = 45;
    weapons.cutter.cooldown = 0.35;
  }
}""")

text = text.replace(evo_old, evo_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
