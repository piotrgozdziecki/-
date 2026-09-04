import re

with open("app/src/main/assets/game.html", "r") as f:
    text = f.read()

text = text.replace("    speed: 4.5,\n    maxBattery: 100", "    speed: 2.2,\n    maxBattery: 100")
text = text.replace("    speed: 4.5,\n    maxBattery: 95", "    speed: 2.2,\n    maxBattery: 95")

with open("app/src/main/assets/game.html", "w") as f:
    f.write(text)
