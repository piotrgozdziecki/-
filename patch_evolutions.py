import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

evos_old = re.search(r'const EVOLUTIONS = \{.*?\n\};\n', text, re.DOTALL).group(0)

evos_new = """const EVOLUTIONS = {
  bramkaRFID: {
    id: 'bramkaRFID', name: '📡 Przemysłowa Bramka RFID', icon: '⚡', reqWeapon: 'scanner', reqPassive: 'battery',
    desc: 'Emituje stałą, obrotową siatkę laserową. Wrogowie dropią +50% XP!'
  },
  owijarka: {
    id: 'owijarka', name: '🌀 Automatyczna Owijarka', icon: '🧻', reqWeapon: 'toiletPaper', reqPassive: 'magnet',
    desc: 'Stały pierścień ze streczu. Unieruchamia i detonuje wrogów!'
  },
  btHighStack: {
    id: 'btHighStack', name: '🚜 Wózek BT High-Stack', icon: '🪵', reqWeapon: 'pallets', reqPassive: 'coffee',
    desc: 'Zostawia ślad śliskiego oleju i automatycznie taranuje wrogów!'
  },
  zraszacz: {
    id: 'zraszacz', name: '❄️ System Zraszaczowy PPOŻ', icon: '🧯', reqWeapon: 'extinguisher', reqPassive: 'forks',
    desc: 'Co 10s mrozi WSZYSTKICH wrogów na ekranie!'
  },
  steelTies: {
    id: 'steelTies', name: '🔗 Stalowe Trytytki', icon: '🔗', reqWeapon: 'zipTies', reqPassive: 'magnet',
    desc: 'Zatrzymuje wrogów na wieki i przebija tłumy!'
  },
  machete: {
    id: 'machete', name: '🔪 Ostrze Stanley Max', icon: '🔪', reqWeapon: 'cutter', reqPassive: 'forks',
    desc: 'Ostre jak brzytwa ostrza latające po całej hali!'
  }
};
"""

text = text.replace(evos_old, evos_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
