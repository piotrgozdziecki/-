import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# I will replace `document.getElementById('intro-art-visual').innerHTML = scene.render();`
# with a fallback that uses character icon if index == 4 or some default icons.

render_old = "document.getElementById('intro-art-visual').innerHTML = scene.render();"
render_new = """
  if (scene.render) {
    document.getElementById('intro-art-visual').innerHTML = scene.render();
  } else {
    // Default GTA style render
    let icon = '🏭';
    let bgCol = '#facc15';
    if (currentIntroIndex === 0) { icon = '🧔🏻‍♂️'; bgCol = '#f59e0b'; }
    if (currentIntroIndex === 1) { icon = '👷‍♂️'; bgCol = '#ef4444'; }
    if (currentIntroIndex === 2) { icon = '👨‍💻'; bgCol = '#38bdf8'; }
    if (currentIntroIndex === 3) { icon = '🕴️'; bgCol = '#dc2626'; }
    if (currentIntroIndex === 4) { 
      const char = CHARACTERS[selectedCharKey];
      icon = char ? char.icon : '🚜'; 
      bgCol = '#22c55e';
    }
    
    document.getElementById('intro-art-visual').innerHTML = `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#0f172a 0%,#020617 100%);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:200%;height:200%;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.03) 20px,rgba(255,255,255,0.03) 40px);animation:panBg 10s linear infinite;"></div>
        <div style="display:flex;align-items:center;justify-content:center;z-index:2;background:${bgCol}22;padding:20px;border-radius:24px;border:4px solid ${bgCol};box-shadow:0 0 40px ${bgCol}66; transform: rotate(-2deg) scale(1.1);">
          <div style="font-size:100px;filter:drop-shadow(5px 5px 0px #000);">${icon}</div>
        </div>
      </div>
      <style>
        @keyframes panBg { 0% { transform: translate(-25%, -25%); } 100% { transform: translate(0, 0); } }
      </style>
    `;
  }
"""

text = text.replace(render_old, render_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
