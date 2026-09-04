with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

funcs = ['selectCharacter', 'selectArena', 'selectGameMode', 'buyWorkshop', 'toggleAudio', 'startGamePlay', 'selectedCharKey', 'selectedArenaKey', 'selectedGameMode']
for func in funcs:
    pos = text.find(func)
    if pos != -1:
        print(f"=== {func} ===")
        print(text[pos-50:pos+350])
        print("\n")
