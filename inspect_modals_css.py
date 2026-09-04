import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

css_pos = text.find('<style>')
css_end = text.find('</style>')
css = text[css_pos:css_end]

# Print modal CSS rules
selectors = re.findall(r'(\.[a-zA-Z0-9_-]+|\#[a-zA-Z0-9_-]+)\s*\{([^}]+)\}', css)
for sel, rules in selectors:
    if any(k in sel for k in ['modal', 'screen', 'container', 'workshop', 'upgrade', 'character', 'pause', 'bestiary', 'sector', 'overlay', 'hud']):
        print(f"=== {sel} ===")
        for r in rules.split(';'):
            if any(prop in r for prop in ['overflow', 'max-height', 'height', 'touch', 'display', 'position', 'padding', 'margin', 'z-index']):
                print("  ", r.strip())

