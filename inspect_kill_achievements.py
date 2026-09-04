with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_kill = text.find('function killEnemy(')
if pos_kill != -1:
    print("=== function killEnemy ===")
    print(text[pos_kill:pos_kill+1500])

pos_ach = text.find('function triggerAchievement')
if pos_ach != -1:
    print("=== function triggerAchievement ===")
    print(text[pos_ach:pos_ach+1000])

