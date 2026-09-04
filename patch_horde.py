import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const MAX_ENEMIES_CAP = 75;", "const MAX_ENEMIES_CAP = 250;")
content = content.replace("const baseBatchSize = Math.floor(2 + progressInSector * 3.5 + Math.random() * 1.5);", "const baseBatchSize = Math.floor(4 + progressInSector * 10.0 + Math.random() * 5.0);")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
