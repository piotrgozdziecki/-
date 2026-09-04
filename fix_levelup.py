import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

evo_check_old = """  if (weapons.extinguisher.level >= 5 && passives.battery.level >= 1 && !weapons.extinguisher.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.nitrogenStorm });
  }"""
evo_check_new = evo_check_old + """
  if (weapons.zipTies.level >= 5 && passives.magnet.level >= 1 && !weapons.zipTies.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.steelTies });
  }
  if (weapons.cutter.level >= 5 && passives.forks.level >= 1 && !weapons.cutter.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.machete });
  }"""
text = text.replace(evo_check_old, evo_check_new)

reg_old = """    { id: 'extinguisher', name: 'Gaśnica Śniegowa CO2', icon: '🧯', desc: 'Mrozi wrogów i tworzy lodowy stożek.', cat: 'weapon' },"""
reg_new = reg_old + """
    { id: 'zipTies', name: 'Trytytki Samozaciskowe', icon: '🔗', desc: 'Wystrzeliwuje taśmy blokujące wrogów.', cat: 'weapon' },
    { id: 'cutter', name: 'Nóż do Tapet (Gilotyna)', icon: '🔪', desc: 'Przecina wrogów na pół, przenikając ich.', cat: 'weapon' },"""
text = text.replace(reg_old, reg_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
