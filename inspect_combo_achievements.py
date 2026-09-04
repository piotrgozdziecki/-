with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_kill = text.find('damageEnemy')
if pos_kill == -1: pos_kill = text.find('enemies.forEach')
if pos_kill != -1:
    print("=== damageEnemy or Kill logic ===")
    print(text[pos_kill:pos_kill+1500])

