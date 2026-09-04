import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """
        if (player.dodgeChance && Math.random() < player.dodgeChance) {
          spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
          player.invulnTimer = 0.2;
        } else {
          sounds.hit();
          player.invulnTimer = 0.6;
          screenShake = 5;
          const dmg = e.isBoss ? 16 : 8;
          player.battery = Math.max(0, player.battery - dmg);
          if (window.AndroidBridge && window.AndroidBridge.vibrate) window.AndroidBridge.vibrate(40);
        }
"""
content = re.sub(r'sounds\.hit\(\);\s*player\.invulnTimer = 0\.6;\s*screenShake = 5;\s*const dmg = e\.isBoss \? 16 : 8;\s*player\.battery = Math\.max\(0, player\.battery - dmg\);\s*if \(window\.AndroidBridge && window\.AndroidBridge\.vibrate\) window\.AndroidBridge\.vibrate\(40\);', replacement.strip(), content)

replacement2 = """
        if (player.dodgeChance && Math.random() < player.dodgeChance) {
          spawnDamageText(player.x, player.y - 20, 'UNIK!', '#a855f7', true);
        } else {
          sounds.hit();
          player.invulnTimer = 0.5;
          player.battery = Math.max(0, player.battery - 12);
          addSpeechBubble(player.x, player.y - 20, '🛑 BRAK SAD-u!', '#ef4444');
        }
"""
content = re.sub(r"sounds\.hit\(\);\s*player\.invulnTimer = 0\.5;\s*player\.battery = Math\.max\(0, player\.battery - 12\);\s*addSpeechBubble\(player\.x, player\.y - 20, '🛑 BRAK SAD-u!', '#ef4444'\);", replacement2.strip(), content)


with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

