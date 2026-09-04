with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_ach_toast = text.find('id="ach-toast"')
if pos_ach_toast != -1:
    print("=== ach-toast HTML ===")
    print(text[pos_ach_toast-50:pos_ach_toast+500])

pos_ann = text.find('id="announcement"')
if pos_ann != -1:
    print("=== announcement HTML ===")
    print(text[pos_ann-50:pos_ann+500])

