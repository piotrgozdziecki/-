import re
with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  ctx.fillRect(0, 0, gameWidth, gameHeight);\n}\n}\n\nfunction gameLoop(now) {", "  ctx.fillRect(0, 0, gameWidth, gameHeight);\n}\n\nfunction gameLoop(now) {")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
