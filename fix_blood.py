import re
with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  }\n}\n\n// Kluska Companion", "  }\n\n// Kluska Companion")

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
