import re
with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'  \}\n\}\n\n// Kluska', '  }\n\n// Kluska', content)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)
