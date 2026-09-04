import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

new_enemies = """const ENEMY_TYPES = {
  PRAKTYKANT: {
    name: 'Zagubiony Praktykant',
    hp: 15,
    speed: 3.2,
    radius: 14,
    renderType: 'pedestrian',
    color: '#10b981',
    clothColor: '#6ee7b7',
    itemIcon: '📝',
    xp: 1,
    quotes: ['Gdzie jest toaleta?', 'Jak to zeskanować?', 'Pomocy!']
  },
  AUDYTOR: {
    name: 'Audytor BHP',
    hp: 350,
    speed: 1.0,
    radius: 20,
    renderType: 'pedestrian',
    color: '#475569',
    clothColor: '#facc15',
    itemIcon: '📋',
    xp: 25,
    quotes: ['Brak kasku!', 'Gdzie kamizelka?!', 'Wypiszę mandat!']
  },
  KURIER: {
    name: 'Wściekły Kurier',
    hp: 60,
    speed: 4.5,
    radius: 16,
    renderType: 'pedestrian',
    color: '#eab308',
    clothColor: '#ef4444',
    itemIcon: '📦',
    xp: 5,
    quotes: ['Mam mało czasu!', 'Rzucam paczkę!', 'Podpisz to!']
  },"""
text = text.replace("const ENEMY_TYPES = {", new_enemies)

# We need to spawn them. Let's look at spawn mechanics.
with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
