import re

with open("app/src/main/assets/game.html", "r") as f:
    html = f.read()

# 1. Add Vignette and Floating UI Container over Canvas
canvas_replacement = """    <canvas id="gameCanvas"></canvas>
    <div class="vignette-overlay"></div>
    <div id="floating-ui-container"></div>"""

if '<div class="vignette-overlay">' not in html:
    html = html.replace('<canvas id="gameCanvas"></canvas>', canvas_replacement)

# 2. Add HUD Pause Button
hud_pause_btn = """        <div style="display: flex; gap: 6px; align-items: center;">
          <button id="hud-pause-btn" class="hud-btn-pause" onclick="togglePause()" testTag="btn_pause" title="Pauza / Opcje">⏸️</button>
        </div>"""

if 'id="hud-pause-btn"' not in html:
    # Insert in HUD bar near top right
    html = html.replace('<div id="weapons-hud" class="weapons-hud"></div>', '<div id="weapons-hud" class="weapons-hud"></div>\n' + hud_pause_btn)

# 3. Add Pause Screen HTML
pause_modal_html = """  <div id="pause-screen" class="screen-overlay" style="display: none;">
    <div class="pause-modal">
      <div class="pause-header">
        <div class="pause-title">⏸️ RAPORT ZMIANY (PAUZA)</div>
        <button onclick="togglePause()" style="background: #ef4444; border: none; color: #fff; border-radius: 8px; width: 32px; height: 32px; font-weight: 900; cursor: pointer;">✕</button>
      </div>

      <div class="pause-tabs-bar">
        <button id="ptab-btn-options" class="pause-tab-btn active" onclick="showPauseTab('options')">⚙️ OPCJE</button>
        <button id="ptab-btn-build" class="pause-tab-btn" onclick="showPauseTab('build')">⚔️ EKWIPUNEK</button>
        <button id="ptab-btn-guide" class="pause-tab-btn" onclick="showPauseTab('guide')">❓ JAK GRAĆ</button>
        <button id="ptab-btn-exit" class="pause-tab-btn" onclick="showPauseTab('exit')" style="border-color: #ef4444; color: #f87171;">🏠 MENU</button>
      </div>

      <!-- TAB 1: OPCJE -->
      <div id="ptab-content-options" class="pause-tab-content" style="display: block;">
        <div class="option-row">
          <label>🔊 Efekty Dźwiękowe SFX:</label>
          <div class="slider-wrapper">
            <input type="range" min="0" max="100" value="100" id="opt-sfx-slider" oninput="updateSfxVolume(this.value)">
            <span id="lbl-sfx-vol">100%</span>
          </div>
        </div>
        <div class="option-row">
          <label>🚜 Silnik Wózka BT:</label>
          <div class="slider-wrapper">
            <input type="range" min="0" max="100" value="80" id="opt-motor-slider" oninput="updateMotorVolume(this.value)">
            <span id="lbl-motor-vol">80%</span>
          </div>
        </div>
        <div class="option-row">
          <label>🔍 Widok Kamery (Klaustrofobia):</label>
          <div class="slider-wrapper">
            <input type="range" min="260" max="520" value="380" id="opt-zoom-slider" oninput="updateCameraZoomSetting(this.value)">
            <span id="lbl-zoom-vol">380px</span>
          </div>
        </div>
        <div class="option-row">
          <label>💡 Jakość Oświetlenia 3D & Cienie:</label>
          <button id="btn-opt-shadows" onclick="toggle3DShadowsSetting()" class="btn-opt-toggle">Cienie 3D: WŁĄCZONE</button>
        </div>
        <div class="option-row">
          <label>📳 Wibracje Haptyczne:</label>
          <button id="btn-opt-vib" onclick="toggleVibrationSetting()" class="btn-opt-toggle">Wibracje: WŁĄCZONE</button>
        </div>
      </div>

      <!-- TAB 2: EKWIPUNEK -->
      <div id="ptab-content-build" class="pause-tab-content" style="display: none;">
        <div id="pause-run-stats" class="pause-stats-grid">
          <div>⏰ CZAS: <b id="pstat-time" style="color:#facc15;">00:00</b></div>
          <div>💀 ZLIKWIDOWANI: <b id="pstat-kills" style="color:#ef4444;">0</b></div>
          <div>⭐ POZIOM: <b id="pstat-lvl" style="color:#38bdf8;">1</b></div>
        </div>
        <div class="pause-section-title">⚔️ Aktywny Arsenał Magazyniera:</div>
        <div id="pause-weapons-grid" class="pause-gear-grid"></div>
        <div class="pause-section-title">🛡️ Przedmioty Pasywne:</div>
        <div id="pause-passives-grid" class="pause-gear-grid"></div>
        <div class="pause-section-title">💥 Przepisy Ewolucji Broni:</div>
        <div id="pause-synergies-list" class="synergy-list"></div>
      </div>

      <!-- TAB 3: JAK GRAĆ -->
      <div id="ptab-content-guide" class="pause-tab-content" style="display: none;">
        <div class="guide-box">
          <p>🕹️ <b>Sterowanie:</b> Użyj lewej gałki dotykowej lub klawiszy WASD / Strzałek do poruszania wózkiem lub magazynierem.</p>
          <p>⚡ <b>Zdolność Specjalna:</b> Przycisk "KONTROLA BHP" wyzwala falę uderzeniową odpychającą wrogów.</p>
          <p>💥 <b>Zagrożenia Magazynowe:</b> Uważaj na beczki ADR (Gaz, Kwas, Olej) — strzał w nie wywołuje obszarowy wybuch!</p>
          <p>📦 <b>Przetrwanie Zmiany:</b> Co 2 minuty nadchodzi Boss (Inspektor PIP, Sanepid, Dyrektor KAS). Pokonaj go, aby odblokować Skrzynię Zmiany!</p>
        </div>
      </div>

      <!-- TAB 4: WYJŚCIE DO MENU -->
      <div id="ptab-content-exit" class="pause-tab-content" style="display: none;">
        <div class="exit-confirm-box">
          <p style="font-size: 13px; font-weight: 800; color: #f87171; text-align: center; margin-bottom: 10px;">⚠️ CZY NA PEWNO CHCESZ PRZERWAĆ ZMIANĘ?</p>
          <p style="font-size: 11px; color: #cbd5e1; text-align: center; line-height: 1.4; margin-bottom: 14px;">
            Bieżąca rozgrywka zostanie zakończona. Osiągnięcia i uzyskane monety DTA z obecnego biegu zostaną bezpiecznie zapisane w bazie danych Room DB.
          </p>
          <div style="display: flex; gap: 8px;">
            <button onclick="confirmExitToMainMenu()" class="btn-main" style="background: linear-gradient(180deg, #ef4444, #991b1b); flex: 1;">TAK, WYJDŹ DO MENU 🏠</button>
            <button onclick="showPauseTab('options')" class="btn-main" style="background: #334155; flex: 1;">WRÓĆ DO OPCJI ⚙️</button>
          </div>
        </div>
      </div>

      <div style="margin-top: 12px;">
        <button onclick="togglePause()" class="btn-main" style="background: linear-gradient(180deg, #38bdf8, #0284c7); color: #fff;">POWRÓT DO GRY ▶️</button>
      </div>
    </div>
  </div>"""

# Replace existing pause screen modal
html = re.sub(r'<div id="pause-screen"[\s\S]*?</div>\s*</div>\s*</div>', pause_modal_html, html)

# 4. Add CSS for Vignette, Pause Tabs, Floating UI, and Pause HUD button
css_additions = """
    .vignette-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      background: radial-gradient(circle at center, transparent 30%, rgba(2, 6, 23, 0.94) 85%);
      z-index: 4;
    }
    #floating-ui-container {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 10;
    }
    .hud-btn-pause {
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      background: rgba(15, 23, 42, 0.85);
      border: 2px solid #38bdf8;
      border-radius: 12px;
      color: #38bdf8;
      font-size: 18px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      touch-action: none;
    }
    .hud-btn-pause:active { transform: scale(0.92); }
    .floating-dmg-text {
      position: absolute;
      top: 0; left: 0;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 900;
      font-size: 14px;
      text-shadow: 0 2px 6px #000, 0 0 10px rgba(0,0,0,0.8);
      pointer-events: none;
      white-space: nowrap;
      will-change: transform, opacity;
      z-index: 12;
    }
    .speech-bubble-overlay {
      position: absolute;
      top: 0; left: 0;
      background: rgba(15, 23, 42, 0.92);
      border: 2px solid #38bdf8;
      border-radius: 10px;
      padding: 3px 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 800;
      font-size: 11px;
      color: #fff;
      box-shadow: 0 4px 14px rgba(0,0,0,0.7);
      pointer-events: none;
      white-space: nowrap;
      will-change: transform;
      z-index: 14;
    }
    .pause-tabs-bar {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 8px;
    }
    .pause-tab-btn {
      flex: 1;
      padding: 8px 4px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      text-align: center;
    }
    .pause-tab-btn.active {
      background: #1e293b;
      border-color: #38bdf8;
      color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
    }
    .pause-tab-content {
      margin-bottom: 10px;
    }
    .option-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 12px;
      color: #e2e8f0;
      font-weight: 700;
    }
    .slider-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-opt-toggle {
      background: #1e293b;
      border: 1px solid #38bdf8;
      color: #38bdf8;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }
    .guide-box {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px;
      font-size: 11px;
      line-height: 1.5;
      color: #cbd5e1;
    }
    .guide-box p { margin: 0 0 8px 0; }
    .exit-confirm-box {
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid #ef4444;
      border-radius: 10px;
      padding: 12px;
    }
"""

if '.vignette-overlay {' not in html:
    html = html.replace('</style>', css_additions + '\n</style>')

# 5. Update render() function to eliminate 2D Canvas context (ctx)
render_code = """function render(dt = 0.016) {
  if (window.Engine3D && window.Engine3D.active) {
    window.Engine3D.update(dt, {
      player,
      enemies,
      dropItems,
      projectiles,
      kluska,
      screenShake,
      gameTime,
      obstacles,
      adrBarrels
    });
    updateFloatingUiOverlays();
  } else if (window.Engine3D && !window.Engine3D.active) {
    window.Engine3D.init();
  }
}"""

html = re.sub(r'function render\(dt = 0\.016\) \{[\s\S]*?^\}', render_code, html, flags=re.MULTILINE)

# 6. Add JS functions for Options, Pause Tabs, Key listeners, and Floating UI Overlays
js_additions = """
// --- OPTIONS & PAUSE SYSTEM ---
let sfxVolumeSetting = 1.0;
let motorVolumeSetting = 0.8;
let shadows3DSetting = true;
let vibrationSetting = true;

function showPauseTab(tabName) {
  ['options', 'build', 'guide', 'exit'].forEach(t => {
    const btn = document.getElementById('ptab-btn-' + t);
    const content = document.getElementById('ptab-content-' + t);
    if (btn) btn.classList.toggle('active', t === tabName);
    if (content) content.style.display = (t === tabName) ? 'block' : 'none';
  });
  if (tabName === 'build') renderPauseScreen();
}

function updateSfxVolume(val) {
  sfxVolumeSetting = val / 100.0;
  const lbl = document.getElementById('lbl-sfx-vol');
  if (lbl) lbl.innerText = val + '%';
  if (sounds && sounds.setMasterVolume) sounds.setMasterVolume(sfxVolumeSetting);
}

function updateMotorVolume(val) {
  motorVolumeSetting = val / 100.0;
  const lbl = document.getElementById('lbl-motor-vol');
  if (lbl) lbl.innerText = val + '%';
  if (sounds && sounds.setMotorVolume) sounds.setMotorVolume(motorVolumeSetting);
}

function updateCameraZoomSetting(val) {
  const lbl = document.getElementById('lbl-zoom-vol');
  if (lbl) lbl.innerText = val + 'px';
  if (window.Engine3D && window.Engine3D.setCameraZoom) {
    window.Engine3D.setCameraZoom(val);
  }
}

function toggle3DShadowsSetting() {
  shadows3DSetting = !shadows3DSetting;
  const btn = document.getElementById('btn-opt-shadows');
  if (btn) btn.innerText = "Cienie 3D: " + (shadows3DSetting ? "WŁĄCZONE" : "WYŁĄCZONE");
  if (window.Engine3D && window.Engine3D.dirLight) {
    window.Engine3D.dirLight.castShadow = shadows3DSetting;
  }
}

function toggleVibrationSetting() {
  vibrationSetting = !vibrationSetting;
  const btn = document.getElementById('btn-opt-vib');
  if (btn) btn.innerText = "Wibracje: " + (vibrationSetting ? "WŁĄCZONE" : "WYŁĄCZONE");
}

function confirmExitToMainMenu() {
  if (gameState === STATE.PAUSED) {
    document.getElementById('pause-screen').style.display = 'none';
    gameState = STATE.START;
    document.getElementById('start-screen').style.display = 'flex';
    if (window.AndroidBridge && window.AndroidBridge.saveGameScore) {
      try {
        window.AndroidBridge.saveGameScore(score, kills, playerLevel, Math.floor(gameTime), "00:00", false);
      } catch(e) {}
    }
  }
}

// Keyboard shortcuts for Pause (ESC / P)
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' || e.code === 'KeyP') {
    if (gameState === STATE.PLAYING || gameState === STATE.PAUSED) {
      togglePause();
    }
  }
});

// Floating UI Overlay updating (Damage texts & Speech Bubbles)
function updateFloatingUiOverlays() {
  const container = document.getElementById('floating-ui-container');
  if (!container) return;

  if (typeof floatingTexts !== 'undefined') {
    for (let i = 0; i < floatingTexts.length; i++) {
      const ft = floatingTexts[i];
      let el = document.getElementById('ft_el_' + i);
      if (ft && ft.active) {
        if (!el) {
          el = document.createElement('div');
          el.id = 'ft_el_' + i;
          el.className = 'floating-dmg-text';
          container.appendChild(el);
        }
        const coords = window.Engine3D ? window.Engine3D.getScreenCoords(ft.x, ft.y, 22) : { x: 0, y: 0, visible: false };
        if (coords.visible) {
          el.innerText = ft.text;
          el.style.color = ft.color;
          el.style.display = 'block';
          el.style.transform = 'translate3d(' + Math.round(coords.x) + 'px, ' + Math.round(coords.y) + 'px, 0) translate(-50%, -100%) scale(' + (1 + (ft.life / ft.maxLife) * 0.2) + ')';
          el.style.opacity = (1 - (ft.life / ft.maxLife)).toFixed(2);
        } else {
          el.style.display = 'none';
        }
      } else if (el) {
        el.style.display = 'none';
      }
    }
  }

  if (typeof speechBubbles !== 'undefined') {
    for (let i = 0; i < speechBubbles.length; i++) {
      const sb = speechBubbles[i];
      let el = document.getElementById('sb_el_' + i);
      if (sb && sb.active) {
        if (!el) {
          el = document.createElement('div');
          el.id = 'sb_el_' + i;
          el.className = 'speech-bubble-overlay';
          container.appendChild(el);
        }
        const coords = window.Engine3D ? window.Engine3D.getScreenCoords(sb.x, sb.y, 36) : { x: 0, y: 0, visible: false };
        if (coords.visible) {
          el.innerText = sb.text;
          el.style.color = sb.color || '#ffffff';
          el.style.borderColor = sb.color || '#38bdf8';
          el.style.display = 'block';
          el.style.transform = 'translate3d(' + Math.round(coords.x) + 'px, ' + Math.round(coords.y) + 'px, 0) translate(-50%, -100%)';
        } else {
          el.style.display = 'none';
        }
      } else if (el) {
        el.style.display = 'none';
      }
    }
  }
}
"""

if 'function updateSfxVolume(' not in html:
    html = html.replace('window.onAndroidReady = function() {', js_additions + '\nwindow.onAndroidReady = function() {')

with open("app/src/main/assets/game.html", "w") as f:
    f.write(html)

print("game.html patched successfully!")
