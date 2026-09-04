import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("--- 1. Checking getDamage ---")
for m in re.finditer(r'\bgetDamage\b', text):
    pos = m.start()
    print("LINE:", text.count('\n', 0, pos)+1, text[max(0, pos-40):min(len(text), pos+60)].replace('\n', ' '))

print("\n--- 2. Checking takeDamage ---")
for m in re.finditer(r'\btakeDamage\b', text):
    pos = m.start()
    print("LINE:", text.count('\n', 0, pos)+1, text[max(0, pos-40):min(len(text), pos+60)].replace('\n', ' '))

print("\n--- 3. Checking spawnDamageText ---")
for m in re.finditer(r'\bspawnDamageText\b', text):
    pos = m.start()
    print("LINE:", text.count('\n', 0, pos)+1, text[max(0, pos-40):min(len(text), pos+60)].replace('\n', ' '))

print("\n--- 4. Checking hydrant_beam ---")
for m in re.finditer(r'\bhydrant_beam\b', text):
    pos = m.start()
    print("LINE:", text.count('\n', 0, pos)+1, text[max(0, pos-40):min(len(text), pos+60)].replace('\n', ' '))

