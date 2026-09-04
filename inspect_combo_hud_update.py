with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_badge = text.find("getElementById('badge-combo')")
if pos_badge != -1:
    print(text[pos_badge-100:pos_badge+500])

