import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to drops
content = content.replace(
  "} else if (rand < 0.18) {",
  "} else if (rand < 0.14) { dropItems.push({ x: e.x, y: e.y, type: 'pizza_szefa', life: 30 }); } else if (rand < 0.18) {"
)

# Add to logic
pizza_logic = """      } else if (item.type === 'pizza_szefa') {
        score += 1000;
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '🍕 PIZZA OD SZEFA! LEVEL UP!', '#ef4444');
        currentXP += neededXP;
        checkLevelUp();
      } else if (item.type === 'hotdog') {"""

content = content.replace("} else if (item.type === 'hotdog') {", pizza_logic.strip())

# Add to render
pizza_render = """    } else if (item.type === 'pizza_szefa') {
      ctx.fillStyle = '#ef4444'; ctx.font = '24px sans-serif'; ctx.fillText('🍕', item.x, item.y + yOff);
    } else if (item.type === 'hotdog') {"""

content = content.replace("} else if (item.type === 'hotdog') {", pizza_render.strip())

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

