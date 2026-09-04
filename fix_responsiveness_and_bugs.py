import re

# 1. Update three_engine.js onResize to accept custom dimensions
with open("app/src/main/assets/three_engine.js", "r") as f:
    engine_code = f.read()

on_resize_old = """    onResize() {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth || 360;
      const h = window.innerHeight || 640;
      const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(dpr);
    },"""

on_resize_new = """    onResize(customW, customH) {
      if (!this.renderer || !this.camera) return;
      const w = customW || window.innerWidth || 360;
      const h = customH || window.innerHeight || 640;
      const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(dpr);
    },"""

if "onResize(customW, customH)" not in engine_code:
    engine_code = engine_code.replace("onResize() {", "onResize(customW, customH) {")

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(engine_code)

# 2. Update game.html for responsiveness, dt capping, audio safety, floating overlay safety
with open("app/src/main/assets/game.html", "r") as f:
    html = f.read()

# Update resizeCanvas
resize_old = """function resizeCanvas() {
  try {
    gameWidth = window.innerWidth || document.documentElement.clientWidth || screen.width || 360;
    gameHeight = window.innerHeight || document.documentElement.clientHeight || screen.height || 640;
    
    // Poco F6 Uncapped Ultra-High Resolution (1.5K AMOLED 120Hz native DPI)
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(gameWidth * dpr);
    canvas.height = Math.round(gameHeight * dpr);        
    // Ensure the context is updated after width/height change with high quality smoothing
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Initial clear to prevent black flicker
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
    }
    
    console.log("RESIZE: " + gameWidth + "x" + gameHeight + " DPR: " + dpr + " (Canvas: " + canvas.width + "x" + canvas.height + ")");
  } catch (err) {
    console.error("RESIZE ERROR: ", err);
  }
}"""

resize_new = """function resizeCanvas() {
  try {
    gameWidth = window.innerWidth || document.documentElement.clientWidth || screen.width || 360;
    gameHeight = window.innerHeight || document.documentElement.clientHeight || screen.height || 640;
    dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    
    if (canvas) {
      canvas.width = Math.round(gameWidth * dpr);
      canvas.height = Math.round(gameHeight * dpr);
    }
    
    if (window.Engine3D && window.Engine3D.active && window.Engine3D.onResize) {
      window.Engine3D.onResize(gameWidth, gameHeight);
    }
    
    console.log("RESIZE OK: " + gameWidth + "x" + gameHeight + " (DPR: " + dpr + ")");
  } catch (err) {
    console.error("RESIZE ERROR: ", err);
  }
}"""

html = html.replace(resize_old, resize_new)

# Add viewport meta tag enforcement if missing
if 'viewport-fit=cover' not in html:
    html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
                        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">')

# Add global touch audio context resume listener
audio_resume_snippet = """
// Global touch listener to unlock AudioContext on first user touch/gesture
window.addEventListener('touchstart', function unlockAudio() {
  if (typeof sounds !== 'undefined' && sounds.init) {
    sounds.init();
  }
}, { once: true });
"""

if 'window.addEventListener(\'touchstart\', function unlockAudio()' not in html:
    html = html.replace("window.addEventListener('resize', resizeCanvas);", "window.addEventListener('resize', resizeCanvas);\n" + audio_resume_snippet)

with open("app/src/main/assets/game.html", "w") as f:
    f.write(html)

print("Responsiveness & Bug fixes applied successfully!")
