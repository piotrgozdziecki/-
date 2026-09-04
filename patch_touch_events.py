import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add touch-action: none to canvas CSS
text = text.replace("canvas {", "canvas {\n      touch-action: none;")

# Patch handleTouchStart and handleTouchMove
old_touch_start = """function handleTouchStart(e) {
  sounds.init();
  for (let i = 0; i < e.changedTouches.length; i++) {"""

new_touch_start = """function handleTouchStart(e) {
  sounds.init();
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, button, .tab-btn, .workshop-card, .upgrade-card, .char-card')) {
    return;
  }
  for (let i = 0; i < e.changedTouches.length; i++) {"""

old_touch_move = """function handleTouchMove(e) {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {"""

new_touch_move = """function handleTouchMove(e) {
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, .workshop-grid, .upgrade-list, .char-card')) {
    return; // Allow UI scrolling in modals & menus!
  }
  if (e.cancelable) e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {"""

text = text.replace(old_touch_start, new_touch_start)
text = text.replace(old_touch_move, new_touch_move)

with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patched touch events and canvas style successfully.")
