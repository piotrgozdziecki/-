import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

css_pos = text.find('<style>')
css_end = text.find('</style>')
css = text[css_pos:css_end]

print("=== CSS Overflow & Touch Lines ===")
for line in css.split('\n'):
    if 'overflow' in line or 'touch-action' in line or 'scroll' in line or 'max-height' in line or 'height' in line:
        if any(term in line for term in ['modal', 'container', 'screen', 'overlay', 'upgrade', 'workshop', 'character', 'pause', 'body', 'html', '#']):
            print(line.strip())

