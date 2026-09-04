with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_ann = text.find('function showAnnouncement')
if pos_ann != -1:
    print("=== showAnnouncement ===")
    print(text[pos_ann:pos_ann+1000])

pos_bubble = text.find('function addSpeechBubble')
if pos_bubble != -1:
    print("=== addSpeechBubble ===")
    print(text[pos_bubble:pos_bubble+1000])

pos_combo = text.find('combo =')
if pos_combo == -1: pos_combo = text.find('comboCount')
if pos_combo != -1:
    print("=== Combo handling ===")
    print(text[pos_combo-100:pos_combo+800])

