import re

# 1. Update three_engine.js
with open("app/src/main/assets/three_engine.js", "r") as f:
    engine_code = f.read()

# Default cameraZoom
engine_code = re.sub(r'cameraZoom:\s*\d+,', 'cameraZoom: 850,', engine_code)
engine_code = re.sub(r'this\.cameraZoom\s*=\s*Math\.max\(.*?\);',
                     'this.cameraZoom = Math.max(500, Math.min(1200, parseInt(zoomVal, 10) || 850));', engine_code)

# Camera init in init()
old_cam_init = """        // 4. Tactical High-Angle Isometric Perspective Camera (52 deg pitch)
        this.camera = new THREE.PerspectiveCamera(46, width / height, 10, 8000);
        this.camera.position.set(1900, -2350, 640);
        this.camera.lookAt(1900, -1860, 0);"""

new_cam_init = """        // 4. Tactical Top-Down Crimsonland Perspective Camera (Fixed Aspect Ratio)
        this.camera = new THREE.PerspectiveCamera(50, width / height, 10, 10000);
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(1900, -1900, 850);
        this.camera.lookAt(1900, -1900, 0);"""

if old_cam_init in engine_code:
    engine_code = engine_code.replace(old_cam_init, new_cam_init)
else:
    # Use regex
    engine_code = re.sub(
        r'// 4\..*?this\.camera\.position\.set\(.*?\);\s*this\.camera\.lookAt\(.*?\);',
        '// 4. Tactical Top-Down Crimsonland Perspective Camera (Fixed Aspect Ratio)\n'
        '        this.camera = new THREE.PerspectiveCamera(50, width / height, 10, 10000);\n'
        '        this.camera.up.set(0, 1, 0);\n'
        '        this.camera.position.set(1900, -1900, 850);\n'
        '        this.camera.lookAt(1900, -1900, 0);',
        engine_code,
        flags=re.DOTALL
    )

# Camera tracking in update(dt, gameEntities)
old_cam_track = """      // 1. Dynamic Tactical Isometric Camera Tracking
      const lookAheadX = (player.vx || 0) * 0.18;
      const lookAheadY = -(player.vy || 0) * 0.18;
      const targetCamX = player.x + lookAheadX;
      const targetCamY = -player.y - 490 + lookAheadY;
      const targetCamZ = this.cameraZoom || 620;

      // 3D Screen Shake Trauma
      const shakeX = (Math.random() - 0.5) * screenShake * 2.2;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.2;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.8;

      this.camera.position.set(targetCamX + shakeX, targetCamY + shakeY, targetCamZ + shakeZ);
      this.camera.lookAt(player.x + lookAheadX * 0.5, -player.y + 35 + lookAheadY * 0.5, 0);"""

new_cam_track = """      // 1. Top-Down Crimsonland Camera Tracking (Strictly Centered on Player)
      const targetCamX = player.x;
      const targetCamY = -player.y;
      const targetCamZ = this.cameraZoom || 850;

      // 3D Screen Shake Trauma (Symmetrical offset around centered player)
      const shakeX = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.5;

      this.camera.position.set(targetCamX + shakeX, targetCamY + shakeY, targetCamZ + shakeZ);
      this.camera.lookAt(player.x, -player.y, 0);"""

if old_cam_track in engine_code:
    engine_code = engine_code.replace(old_cam_track, new_cam_track)
else:
    engine_code = re.sub(
        r'// 1\. Dynamic Tactical Isometric Camera Tracking.*?this\.camera\.lookAt\(.*?\);',
        new_cam_track,
        engine_code,
        flags=re.DOTALL
    )

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(engine_code)

# 2. Update game.html
with open("app/src/main/assets/game.html", "r") as f:
    html = f.read()

html = re.sub(r'Engine3D\.setCameraZoom\(\d+\);', 'Engine3D.setCameraZoom(850);', html)
html = re.sub(r'Engine3D\.cameraZoom\s*=\s*\d+;', 'Engine3D.cameraZoom = 850;', html)
html = re.sub(r'min="\d+"\s+max="\d+"\s+value="\d+"', 'min="500" max="1200" value="850"', html)
html = re.sub(r'>\d+px</span>', '>850px</span>', html)

with open("app/src/main/assets/game.html", "w") as f:
    f.write(html)

print("Top-down Crimsonland camera refined successfully!")
