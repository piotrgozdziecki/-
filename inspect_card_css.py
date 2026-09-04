import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_start = text.find('.upgrade-card {')
pos_end = text.find('.chest-modal {')

print("=== EXISTING UPGRADE CARD CSS ===")
print(text[pos_start:pos_end])

