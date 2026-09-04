import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# 1. Update item dropping
text = text.replace("dropItems.push({ x: e.x, y: e.y, type: 'coffee_thermos', life: 15 });\n  }", 
"""dropItems.push({ x: e.x, y: e.y, type: 'coffee_thermos', life: 15 });
  } else if (rand < 0.045) {
    dropItems.push({ x: e.x, y: e.y, type: 'forklift', life: 25 });
  }""")

# 2. Update item picking
item_pickup = """      } else if (item.type === 'coffee_thermos') {
        player.skillCooldown = 0;
        score += Math.floor(200 * packageMultiplier);
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 25, '☕ TERMOS KAWY! SKILL READY!', '#f97316');
      }"""
new_item_pickup = item_pickup + """ else if (item.type === 'forklift') {
        player.isForklift = true;
        player.forkliftTimer = player.maxForkliftTimer;
        player.radius = 22;
        score += Math.floor(500 * packageMultiplier);
        sounds.achieve();
        addSpeechBubble(player.x, player.y - 40, '🚜 WÓZEK BT ZDOBYTY!', '#fbbf24');
      }"""
text = text.replace(item_pickup, new_item_pickup)

# 3. Update drawing items
draw_item = """      } else if (it.type === 'coffee_thermos') {
        ctx.font = '18px sans-serif';
        ctx.fillText('☕', it.x - 9, it.y + 6);
      }"""
new_draw_item = draw_item + """ else if (it.type === 'forklift') {
        ctx.font = '24px sans-serif';
        ctx.fillText('🚜', it.x - 12, it.y + 8);
      }"""
text = text.replace(draw_item, new_draw_item)

# 4. Update update() for forklift timer
update_start = """  if (gameState !== STATE.PLAYING) return;
  gameTime += dt;"""
new_update_start = update_start + """\n
  if (player.isForklift) {
    player.forkliftTimer -= dt;
    if (player.forkliftTimer <= 0) {
      player.isForklift = false;
      player.radius = 14;
      createSparks(player.x, player.y, 25, '#94a3b8');
      addSpeechBubble(player.x, player.y - 30, '⛽ Wózek rozładowany!', '#94a3b8');
    }
  }"""
text = text.replace(update_start, new_update_start)

# 5. Update speed multiplier for forklift
cur_speed = """  let curSpeed = player.speed;
  if (player.isDashing) curSpeed *= 2.4;"""
new_cur_speed = """  let curSpeed = player.speed;
  if (player.isForklift) curSpeed *= 2.1;
  if (player.isDashing) curSpeed *= (player.isForklift ? 1.8 : 2.6);"""
text = text.replace(cur_speed, new_cur_speed)

# 6. Update exhaust/smoke generator to only happen if forklift
smoke_check = """  if (packageCombo > 0 || player.isDashing || moveLen > 0.05) {"""
new_smoke_check = """  if (player.isForklift && (packageCombo > 0 || player.isDashing || moveLen > 0.05)) {"""
text = text.replace(smoke_check, new_smoke_check)

# 7. Player rendering. 
# Look for "ctx.save();\n  ctx.translate(player.x, player.y);" until "ctx.restore();"
# We will use regex to replace it.
with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
