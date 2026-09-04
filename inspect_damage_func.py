with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_func = text.find('function damageEnemy(')
if pos_func != -1:
    print("=== function damageEnemy ===")
    print(text[pos_func:pos_func+1500])

