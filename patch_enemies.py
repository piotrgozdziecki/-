import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

new_enemies = """const ENEMY_TYPES = {
  FOLIA: { name: 'Rolka Folii Strecz', hp: 30, speed: 2.5, radius: 15, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#cbd5e1', itemIcon: '🗞️', xp: 2 },
  FOLIA_MALA: { name: 'Resztka Folii', hp: 10, speed: 3.8, radius: 10, renderType: 'pedestrian', color: '#f8fafc', clothColor: '#e2e8f0', itemIcon: '💨', xp: 1 },
  KARTON_B2C: { name: 'Zbłąkany Karton B2C', hp: 15, speed: 1.8, radius: 12, renderType: 'pedestrian', color: '#d97706', clothColor: '#b45309', itemIcon: '📦', xp: 1 },
  KIEROWCA_TIR: { name: 'Niecierpliwy Kierowca TIR-a', hp: 55, speed: 2.2, radius: 18, renderType: 'pedestrian', color: '#ef4444', clothColor: '#1e293b', itemIcon: '🚛', xp: 4, canDash: true },
  WOZEK_AWARIA: { name: 'Wózek z Awarią', hp: 120, speed: 6.0, radius: 24, renderType: 'pedestrian', color: '#ea580c', clothColor: '#991b1b', itemIcon: '⚠️', xp: 8, straightLine: true },
  PALETA_KAM: { name: 'Zablokowana Paleta EURO', hp: 250, speed: 0.6, radius: 28, renderType: 'pedestrian', color: '#78350f', clothColor: '#451a03', itemIcon: '🧱', xp: 10, armor: true },
  RAMPA: { name: 'Mobilna Rampa', hp: 400, speed: 0.4, radius: 35, renderType: 'pedestrian', color: '#475569', clothColor: '#0f172a', itemIcon: '🚧', xp: 15, directionalShield: true },
  CELNIK: { name: 'Celnik z Pieczęcią', hp: 80, speed: 1.2, radius: 16, renderType: 'pedestrian', color: '#dc2626', clothColor: '#7f1d1d', itemIcon: '🛑', xp: 5, shooter: true },
  BOSS_KAS: { isBoss: true, name: 'Inspektor KAS', hp: 2500, speed: 1.5, radius: 30, renderType: 'pedestrian', color: '#ef4444', clothColor: '#000000', itemIcon: '🦅', xp: 500, mechanics: 'kas_zone' },
  BOSS_KONTENER: { isBoss: true, name: 'Kontenerowiec MS', hp: 5000, speed: 0.2, radius: 80, renderType: 'pedestrian', color: '#1d4ed8', clothColor: '#1e3a8a', itemIcon: '🚢', xp: 1000, mechanics: 'spawner' },
"""

text = re.sub(r'const ENEMY_TYPES = \{', new_enemies, text, count=1)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
