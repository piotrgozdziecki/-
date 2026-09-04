import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

css_pos = text.find('<style>')
css_end = text.find('</style>')
css = text[css_pos:css_end]

# Inspect rules for modal classes
classes_to_check = [
    '.screen-overlay', '.card-modal', '.pause-modal', '.workshop-grid', 
    '.upgrade-list', '.tab-content', '.upgrade-container', '.intro-modal',
    '.chest-modal', '#start-screen', '#levelup-screen', '#pause-screen'
]

print("=== CHECKING CSS SCROLLING RULES ===")
for cls in classes_to_check:
    pos = css.find(cls + ' {')
    if pos == -1:
        pos = css.find(cls + '{')
    if pos != -1:
        end = css.find('}', pos)
        rule = css[pos:end]
        has_overflow = 'overflow' in rule
        has_touch = 'touch-action' in rule
        print(f"{cls:20} -> overflow: {has_overflow}, touch-action: {has_touch}")
    else:
        print(f"{cls:20} -> NOT FOUND IN CSS")

