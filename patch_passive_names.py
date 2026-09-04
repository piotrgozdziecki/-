import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

pass_old = """const passives = {
  magnet: { level: 0, max: 3, name: 'Super Magnes na Kody', icon: '🧲', desc: '+60% zasięgu przyciągania XP' },
  forks: { level: 0, max: 3, name: 'Hartowane Stalowe Widły', icon: '🔱', desc: '+40% obrażeń od taranowania i krytyków' },
  coffee: { level: 0, max: 3, name: 'Klawo-Kawa Espresso', icon: '☕', desc: '+15% prędkości wózka i szybszy skill' },
  battery: { level: 0, max: 3, name: 'Akumulator Litowo-Jonowy', icon: '🔋', desc: '+35% pojemności baterii i regeneracja' }
};"""

pass_new = """const passives = {
  magnet: { level: 0, max: 3, name: 'Certyfikat ISO', icon: '📜', desc: '+60% zasięgu przyciągania XP (+Area Zasięg)' },
  forks: { level: 0, max: 3, name: 'Protokół BHP', icon: '📋', desc: '+40% obrażeń od taranowania (+Duration Czas)' },
  coffee: { level: 0, max: 3, name: 'Smar Syntetyczny', icon: '🛢️', desc: '+15% prędkości ruchu (+Speed Ruch)' },
  battery: { level: 0, max: 3, name: 'Super Bateria', icon: '🔋', desc: '+35% pojemności baterii (+Cooldown Szybkość)' }
};"""

text = text.replace(pass_old, pass_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
