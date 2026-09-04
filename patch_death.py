import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

death_old = """  createSparks(e.x, e.y, 16, e.info.color);

  // Drop barcode XP"""

death_new = """  createSparks(e.x, e.y, 16, e.info.color);
  
  if (e.info.name === 'Rolka Folii Strecz') {
     enemies.push({ x: e.x - 20, y: e.y, info: ENEMY_TYPES.FOLIA_MALA, hp: ENEMY_TYPES.FOLIA_MALA.hp, quoteTimer: 0, slowTimer: 0 });
     enemies.push({ x: e.x + 20, y: e.y, info: ENEMY_TYPES.FOLIA_MALA, hp: ENEMY_TYPES.FOLIA_MALA.hp, quoteTimer: 0, slowTimer: 0 });
  } else if (e.info.name === 'Zbłąkany Karton B2C') {
     createSparks(e.x, e.y, 10, '#d97706'); // Paper dust
  }

  // Drop barcode XP"""

text = text.replace(death_old, death_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
