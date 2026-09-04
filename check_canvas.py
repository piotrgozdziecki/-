import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('canvas {')
if pos != -1:
    print("=== CANVAS CSS ===")
    print(text[pos:pos+250])

print("\n=== TOUCH LISTENERS IN JS ===")
for m in re.finditer(r'addEventListener\(["\']touch', text):
    p = m.start()
    print("Touch listener at:", p, "Line:", text.count('\n', 0, p)+1)
    print(text[max(0, p-60):min(len(text), p+200)].replace('\n', ' '))

