import re

with open("app/src/main/assets/three_engine.js", "r") as f:
    code = f.read()

# 1. Update Camera setup in init()
old_cam_init = """        // 4. Tactical High-Angle Isometric Perspective Camera (52 deg pitch)
        this.camera = new THREE.PerspectiveCamera(46, width / height, 10, 8000);
        this.camera.position.set(1900, -2350, 640);
        this.camera.lookAt(1900, -1860, 0);"""

new_cam_init = """        // 4. Top-Down Crimsonland Perspective Camera (High-Angle 70 deg pitch)
        this.camera = new THREE.PerspectiveCamera(45, width / height, 10, 10000);
        const defaultCamDist = this.cameraZoom || 750;
        const initOffsetY = defaultCamDist * 0.34;
        const initHeightZ = defaultCamDist * 0.94;
        this.camera.position.set(1900, -1900 - initOffsetY, initHeightZ);
        this.camera.lookAt(1900, -1900, 0);"""

if old_cam_init in code:
    code = code.replace(old_cam_init, new_cam_init)

# 2. Update Camera tracking in update() loop to guarantee player character is ALWAYS perfectly centered
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

new_cam_track = """      // 1. Classic Crimsonland Top-Down Camera Tracking (Player Character Always Perfectly Centered)
      const camDist = this.cameraZoom || 750;
      const offsetY = camDist * 0.34; // 70 deg top-down tilt
      const heightZ = camDist * 0.94;

      // Screen Shake Trauma Offset
      const shakeX = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.5;

      this.camera.position.set(
        player.x + shakeX,
        -player.y - offsetY + shakeY,
        heightZ + shakeZ
      );
      this.camera.lookAt(player.x + shakeX, -player.y + shakeY, 0);"""

if old_cam_track in code:
    code = code.replace(old_cam_track, new_cam_track)

# 3. Default camera zoom update to 750 for wide warehouse view
code = re.sub(r'cameraZoom:\s*\d+', 'cameraZoom: 750', code)

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(code)

print("Crimsonland top-down camera applied successfully to three_engine.js!")
