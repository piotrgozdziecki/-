import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

speed_old = """  let curSpeed = player.speed;
  if (player.isForklift) curSpeed *= 2.1;"""

speed_new = """  let curSpeed = player.speed;
  if (mysteryActive === 'nadgodziny') curSpeed *= 0.65; // Morale drop (slowed down)
  if (player.isForklift) curSpeed *= 2.1;"""
text = text.replace(speed_old, speed_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
