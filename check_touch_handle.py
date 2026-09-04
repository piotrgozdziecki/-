with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function handleTouchStart(')
if pos != -1:
    print(text[pos:pos+1200])

