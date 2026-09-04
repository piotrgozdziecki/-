with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_hud = text.find('id="hud"')
if pos_hud != -1:
    print("=== HUD HTML ===")
    print(text[pos_hud:pos_hud+1500])

