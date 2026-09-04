import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Add player stamina properties
text = text.replace("isForklift: false,", "isForklift: false,\n  wantsForklift: false,\n  stamina: 100,\n  maxStamina: 100,")
text = text.replace("forkliftTimer: 0,\n  maxForkliftTimer: 20", "") # delete old forklift timer

# 2. Add UI for stamina bar
stamina_css = """    .stamina-bar-container {
      position: absolute;
      top: calc(max(env(safe-area-inset-top, 8px), 8px) + 20px);
      left: max(env(safe-area-inset-left, 10px), 10px);
      right: max(env(safe-area-inset-right, 10px), 10px);
      height: clamp(6px, 1.0vh, 8px);
      background: rgba(3, 7, 18, 0.95);
      border: 1px solid #facc15;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      z-index: 100;
    }
    .stamina-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #ca8a04, #fef08a);
      width: 100%;
      transition: width 0.1s linear;
      box-shadow: 0 0 10px rgba(250, 204, 21, 0.5);
    }"""
text = text.replace("    .xp-bar-fill {", stamina_css + "\n    .xp-bar-fill {")

stamina_html = """  <div class="stamina-bar-container">
    <div id="stamina-bar" class="stamina-bar-fill"></div>
  </div>"""
text = text.replace('  <div class="hud-top-bar">', stamina_html + '\n  <div class="hud-top-bar">')

# 3. Add btn-forklift HTML
btn_forklift_html = """      <!-- Forklift Burst -->
      <div id="btn-forklift" class="action-btn-secondary" style="background: radial-gradient(circle, #f59e0b, #b45309); border-color: #fef3c7;">
        <span style="font-size: 16px;">🚜</span>
        <span>WÓZEK</span>
      </div>"""
text = text.replace('      <!-- Character Active Skill -->', btn_forklift_html + '\n      <!-- Character Active Skill -->')

# 4. Remove item drop forklift logic
text = text.replace("""  } else if (rand < 0.045) {
    dropItems.push({ x: e.x, y: e.y, type: 'forklift', life: 25 });
  }""", """  }""")
text = text.replace("""      } else if (item.type === 'forklift') {
        player.isForklift = true;
        player.forkliftTimer = player.maxForkliftTimer;
        player.radius = 22;
        score += Math.floor(500 * packageMultiplier);
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 40, '🚜 WÓZEK BT ZDOBYTY!', '#fbbf24');
      }""", "")
text = text.replace("""      } else if (it.type === 'forklift') {
        ctx.font = '24px sans-serif';
        ctx.fillText('🚜', it.x - 12, it.y + 8);
      }""", "")

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
