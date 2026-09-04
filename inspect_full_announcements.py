with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('function showAnnouncement')
print(text[pos1:pos1+800])

pos2 = text.find('function triggerAchievement')
print(text[pos2:pos2+800])

pos3 = text.find('function addSpeechBubble')
print(text[pos3:pos3+600])

