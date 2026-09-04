import re

# 1. Update three_engine.js for Crimsonland FOV Camera Distance
with open("app/src/main/assets/three_engine.js", "r") as f:
    engine_code = f.read()

engine_code = re.sub(r'cameraZoom:\s*380', 'cameraZoom: 620', engine_code)
engine_code = re.sub(r'targetCamZ\s*=\s*this\.cameraZoom\s*\|\|\s*380', 'targetCamZ = this.cameraZoom || 620', engine_code)
engine_code = re.sub(r'this\.cameraZoom\s*=\s*Math\.max\(250,\s*Math\.min\(520,\s*parseInt\(zoomVal,\s*10\)\s*\|\|\s*380\)\);',
                     'this.cameraZoom = Math.max(350, Math.min(850, parseInt(zoomVal, 10) || 620));', engine_code)

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(engine_code)

# 2. Update game.html for touch handlers, z-indices, button responsiveness
with open("app/src/main/assets/game.html", "r") as f:
    html = f.read()

# Fix default camera zoom in options slider in game.html
html = re.sub(r'min="260"\s+max="520"\s+value="380"', 'min="350" max="850" value="620"', html)
html = re.sub(r'Engine3D\.setCameraZoom\(380\);', 'Engine3D.setCameraZoom(620);', html)
html = re.sub(r'Engine3D\.cameraZoom\s*=\s*380;', 'Engine3D.cameraZoom = 620;', html)

# Replace touch start/move/end with bulletproof handlers
old_touch_handlers = """function handleTouchStart(e) {
  sounds.init();
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, button, .tab-btn, .workshop-card, .upgrade-card, .char-card')) {
    return;
  }
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (t.clientX < gameWidth * 0.55 && !touchState.active) {
      touchState.active = true;
      touchState.id = t.identifier;
      touchState.startX = t.clientX;
      touchState.startY = t.clientY;
      touchState.curX = t.clientX;
      touchState.curY = t.clientY;
      touchState.dirX = 0;
      touchState.dirY = 0;
      joystickBase.style.left = t.clientX + 'px';
      joystickBase.style.top = t.clientY + 'px';
      joystickBase.style.display = 'block';
      joystickThumb.style.left = t.clientX + 'px';
      joystickThumb.style.top = t.clientY + 'px';
      joystickThumb.style.display = 'block';
    }
  }
}

function handleTouchMove(e) {
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, .workshop-grid, .upgrade-list, .char-card')) {
    return; // Allow UI scrolling in modals & menus!
  }
  if (e.cancelable) e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (touchState.active && t.identifier === touchState.id) {
      touchState.curX = t.clientX;
      touchState.curY = t.clientY;
      const dx = touchState.curX - touchState.startX;
      const dy = touchState.curY - touchState.startY;
      const dist = Math.hypot(dx, dy);
      const maxR = 55;
      if (dist < 4) {
        touchState.dirX = 0;
        touchState.dirY = 0;
        joystickThumb.style.left = touchState.startX + 'px';
        joystickThumb.style.top = touchState.startY + 'px';
      } else {
        const angle = Math.atan2(dy, dx);
        const clampDist = Math.min(dist, maxR);
        const norm = clampDist / maxR;
        touchState.dirX = Math.cos(angle) * norm;
        touchState.dirY = Math.sin(angle) * norm;
        joystickThumb.style.left = (touchState.startX + Math.cos(angle) * clampDist) + 'px';
        joystickThumb.style.top = (touchState.startY + Math.sin(angle) * clampDist) + 'px';
      }
    }
  }
}"""

new_touch_handlers = """function handleTouchStart(e) {
  if (typeof sounds !== 'undefined' && sounds.init) sounds.init();
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, button, .tab-btn, .workshop-card, .upgrade-card, .char-card, .hud-btn-pause, #hud-pause-btn, #btn-skill, #btn-detention, .action-btn, .hud-btn')) {
    return;
  }
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (t.clientX < gameWidth * 0.55 && !touchState.active) {
      touchState.active = true;
      touchState.id = t.identifier;
      touchState.startX = t.clientX;
      touchState.startY = t.clientY;
      touchState.curX = t.clientX;
      touchState.curY = t.clientY;
      touchState.dirX = 0;
      touchState.dirY = 0;
      if (joystickBase && joystickThumb) {
        joystickBase.style.left = t.clientX + 'px';
        joystickBase.style.top = t.clientY + 'px';
        joystickBase.style.display = 'block';
        joystickThumb.style.left = t.clientX + 'px';
        joystickThumb.style.top = t.clientY + 'px';
        joystickThumb.style.display = 'block';
      }
    }
  }
}

function handleTouchMove(e) {
  if (gameState !== STATE.PLAYING) return;
  if (e.target && e.target.closest && e.target.closest('.screen-overlay, .card-modal, .pause-modal, .tab-content, .workshop-grid, .upgrade-list, .char-card, button, .tab-btn, .hud-btn-pause, #hud-pause-btn, #btn-skill, #btn-detention, .action-btn, .hud-btn')) {
    return;
  }
  if (e.cancelable && touchState.active) {
    e.preventDefault();
  }
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (touchState.active && t.identifier === touchState.id) {
      touchState.curX = t.clientX;
      touchState.curY = t.clientY;
      const dx = touchState.curX - touchState.startX;
      const dy = touchState.curY - touchState.startY;
      const dist = Math.hypot(dx, dy);
      const maxR = 55;
      if (dist < 4) {
        touchState.dirX = 0;
        touchState.dirY = 0;
        if (joystickThumb) {
          joystickThumb.style.left = touchState.startX + 'px';
          joystickThumb.style.top = touchState.startY + 'px';
        }
      } else {
        const angle = Math.atan2(dy, dx);
        const clampDist = Math.min(dist, maxR);
        const norm = clampDist / maxR;
        touchState.dirX = Math.cos(angle) * norm;
        touchState.dirY = Math.sin(angle) * norm;
        if (joystickThumb) {
          joystickThumb.style.left = (touchState.startX + Math.cos(angle) * clampDist) + 'px';
          joystickThumb.style.top = (touchState.startY + Math.sin(angle) * clampDist) + 'px';
        }
      }
    }
  }
}"""

if old_touch_handlers in html:
    html = html.replace(old_touch_handlers, new_touch_handlers)

with open("app/src/main/assets/game.html", "w") as f:
    f.write(html)

print("Game touch & camera patched successfully!")
