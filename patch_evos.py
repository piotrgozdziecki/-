import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_evos = """  hydraulicHammer: {
    id: 'hydraulicHammer', name: '🚜 Hydrauliczny Młot Burzący', icon: '🔨', reqWeapon: 'sledgehammer', reqPassive: 'coffee',
    desc: 'Wstrząsa całym ekranem, miażdży przeszkody i tworzy kratery!'
  },
  urzadSkarbowy: {
    id: 'urzadSkarbowy', name: '🏢 Urząd Skarbowy (KAS)', icon: '📄', reqWeapon: 'faktura', reqPassive: 'alkomat',
    desc: 'Wystrzeliwuje zmasowane, samonaprowadzające wezwania do zapłaty!'
  },
  redbull: {
    id: 'redbull', name: '🦅 Energetyk z Żabki', icon: '☕', reqWeapon: 'kawa', reqPassive: 'furia',
    desc: 'Rozlewa radioaktywny kwas niszczący bossów i daje permanentne przyspieszenie!'
  }
"""

content = content.replace("  hydraulicHammer: {\n    id: 'hydraulicHammer', name: '🚜 Hydrauliczny Młot Burzący', icon: '🔨', reqWeapon: 'sledgehammer', reqPassive: 'coffee',\n    desc: 'Wstrząsa całym ekranem, miażdży przeszkody i tworzy kratery!'\n  }", new_evos.strip())


# Add check in triggerLevelUpModal
evo_check_addition = """  if (weapons.faktura.level >= 5 && passives.alkomat.level >= 1 && !weapons.faktura.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.urzadSkarbowy });
  }
  if (weapons.kawa.level >= 5 && passives.furia.level >= 1 && !weapons.kawa.isEvo) {
    options.push({ type: 'evolution', evo: EVOLUTIONS.redbull });
  }
"""

content = re.sub(r'  if \(weapons\.sledgehammer\.level >= 5 && passives\.coffee\.level >= 1 && !weapons\.sledgehammer\.isEvo\) \{\s*options\.push\(\{ type: \'evolution\', evo: EVOLUTIONS\.hydraulicHammer \}\);\s*\}', lambda m: m.group(0) + '\n' + evo_check_addition, content)

# Update pause menu to show them
pause_evo_check = """  if (weapons.faktura.level >= 5 && passives.alkomat.level >= 1 && !weapons.faktura.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.urzadSkarbowy });
  if (weapons.kawa.level >= 5 && passives.furia.level >= 1 && !weapons.kawa.isEvo) evoOpts.push({ type: 'evo', data: EVOLUTIONS.redbull });
"""

content = re.sub(r'  if \(weapons\.sledgehammer\.level >= 5 && passives\.coffee\.level >= 1 && !weapons\.sledgehammer\.isEvo\) evoOpts\.push\(\{ type: \'evo\', data: EVOLUTIONS\.hydraulicHammer \}\);', lambda m: m.group(0) + '\n' + pause_evo_check, content)


with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

