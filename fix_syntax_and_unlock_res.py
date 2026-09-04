import re
import subprocess

with open("app/src/main/assets/game.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix the syntax error in window.onAndroidReady
bad_str = "window.onAndroidReady = function() {    }  console.log(\"ANDROID READY SIGNAL RECEIVED\");"
good_str = "window.onAndroidReady = function() {\n  console.log(\"ANDROID READY SIGNAL RECEIVED\");"

if bad_str in content:
    content = content.replace(bad_str, good_str)
    print("Fixed bad window.onAndroidReady syntax error!")
else:
    # Use regex
    content = re.sub(
        r'window\.onAndroidReady\s*=\s*function\(\)\s*\{\s*\}\s*console\.log\("ANDROID READY SIGNAL RECEIVED"\);',
        'window.onAndroidReady = function() {\n  console.log("ANDROID READY SIGNAL RECEIVED");',
        content
    )
    print("Applied regex for window.onAndroidReady")

# 2. Unlock resolution and enable ultra-high graphics smoothing for Poco F6
old_resize = """    // Optymalizacja Poco F6 / High-Res: Cap DPR at 2.0 to prevent memory pressure on 2K displays
    dpr = window.devicePixelRatio || 1;
    if (dpr > 2) dpr = 2;
    if (dpr < 1) dpr = 1;
    canvas.width = Math.floor(gameWidth * dpr);
    canvas.height = Math.floor(gameHeight * dpr);        
    // Ensure the context is updated after width/height change
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;"""

new_resize = """    // Poco F6 Uncapped Ultra-High Resolution (1.5K AMOLED 120Hz native DPI)
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(gameWidth * dpr);
    canvas.height = Math.round(gameHeight * dpr);        
    // Ensure the context is updated after width/height change with high quality smoothing
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';"""

if old_resize in content:
    content = content.replace(old_resize, new_resize)
    print("Replaced old resize with Poco F6 ultra resolution!")
else:
    # regex replace
    content = re.sub(
        r'// Optymalizacja Poco F6.*?\n\s*dpr = window\.devicePixelRatio \|\| 1;.*?\n\s*if \(ctx\) \{\s*ctx\.setTransform\(dpr, 0, 0, dpr, 0, 0\);\s*ctx\.imageSmoothingEnabled = false;',
        new_resize.strip(),
        content,
        flags=re.DOTALL
    )
    print("Applied regex for resizeCanvas")

with open("app/src/main/assets/game.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Saved game.html, now validating syntax with Node.js...")

scripts = re.findall(r"<script>([\s\S]*?)</script>", content)
all_clean = True
for i, s in enumerate(scripts):
    tmp_path = f"/tmp/verify_script_{i}.js"
    with open(tmp_path, "w", encoding="utf-8") as tf:
        tf.write(s)
    res = subprocess.run(["node", "-c", tmp_path], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in script {i}:", res.stderr)
        all_clean = False
    else:
        print(f"Script {i} syntax is 100% VALID!")

if all_clean:
    print("ALL JAVASCRIPT SCRIPTS ARE 100% CLEAN AND SYNTAX-ERROR FREE!")
