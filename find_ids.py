import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

ids = re.findall(r'id=["\']([a-zA-Z0-9_\-]+)["\']', text)
screens = [i for i in set(ids) if 'screen' in i or 'modal' in i or 'menu' in i or 'dialog' in i or 'panel' in i or 'overlay' in i]
print("Screen/Overlay IDs:", sorted(screens))
