with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_start = text.find('id="start-screen"')
if pos_start != -1:
    print("=== START SCREEN HTML ===")
    print(text[pos_start-100:pos_start+3000])

