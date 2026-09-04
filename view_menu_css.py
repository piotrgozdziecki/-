with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_style = text.find('<style>')
pos_style_end = text.find('</style>')
if pos_style != -1 and pos_style_end != -1:
    css = text[pos_style+7:pos_style_end]
    print("CSS length:", len(css))
    print("CSS sample:")
    print(css[:1500])

