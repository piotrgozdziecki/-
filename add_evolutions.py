import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

evos_old = """  forkliftSmash: {
    id: 'forkliftSmash',
    name: '🚜 Widły Śmierci',
    icon: '🪵',
    reqWeapon: 'pallets',
    reqPassive: 'forks',
    desc: 'Gigantyczne palety Euro miażdżą wszystko w wielkim promieniu!'
  }
};"""
evos_new = evos_old.replace("};", """  ,
  steelTies: {
    id: 'steelTies',
    name: '🔗 Stalowe Trytytki Przemysłowe',
    icon: '🔗',
    reqWeapon: 'zipTies',
    reqPassive: 'magnet',
    desc: 'Zatrzymuje wrogów na wieki i przebija tłumy!'
  },
  machete: {
    id: 'machete',
    name: '🔪 Ostrze Stanley Max',
    icon: '🔪',
    reqWeapon: 'cutter',
    reqPassive: 'forks',
    desc: 'Ostre jak brzytwa ostrza latające po całej hali!'
  }
};""")
text = text.replace(evos_old, evos_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
