import re

with open("app/src/main/assets/three_engine.js", "r") as f:
    code = f.read()

# 1. Add getEnemyMesh implementation
get_enemy_mesh_code = """    getEnemyMesh(e) {
      let mesh = this.enemyMeshes.get(e.id);
      if (mesh) return mesh;

      const group = new THREE.Group();

      let bodyGeo, bodyMat;
      if (e.isBoss) {
        bodyGeo = new THREE.BoxGeometry(22, 18, 36);
        bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.7 });
      } else if (e.type === 'paletciarz') {
        bodyGeo = new THREE.BoxGeometry(14, 12, 22);
        bodyMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
      } else if (e.type === 'kurier') {
        bodyGeo = new THREE.BoxGeometry(12, 10, 20);
        bodyMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
      } else if (e.type === 'audytor') {
        bodyGeo = new THREE.BoxGeometry(12, 11, 21);
        bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      } else {
        bodyGeo = new THREE.BoxGeometry(13, 11, 21);
        bodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
      }

      const torso = new THREE.Mesh(bodyGeo, bodyMat);
      torso.position.set(0, 0, 12);
      torso.castShadow = true;
      torso.receiveShadow = true;
      group.add(torso);

      const headGeo = new THREE.SphereGeometry(e.isBoss ? 8 : 5, 10, 10);
      const headMat = new THREE.MeshStandardMaterial({ color: e.isBoss ? 0xa855f7 : 0xfbcfe8, roughness: 0.4 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0, 0, e.isBoss ? 34 : 25);
      head.castShadow = true;
      group.add(head);

      const eyeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const eyeMat = new THREE.MeshBasicMaterial({ color: e.isBoss ? 0xef4444 : 0xf59e0b });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(e.isBoss ? 4 : 2.5, 3, e.isBoss ? 36 : 26);
      group.add(eyeL);
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(e.isBoss ? 4 : 2.5, -3, e.isBoss ? 36 : 26);
      group.add(eyeR);

      const legGeo = new THREE.CylinderGeometry(1.8, 1.8, e.isBoss ? 16 : 10, 8);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });

      const legL = new THREE.Mesh(legGeo, legMat);
      legL.position.set(-2, 3, e.isBoss ? 8 : 5);
      legL.castShadow = true;
      group.add(legL);

      const legR = new THREE.Mesh(legGeo, legMat);
      legR.position.set(-2, -3, e.isBoss ? 8 : 5);
      legR.castShadow = true;
      group.add(legR);

      group.userData = { legL, legR, torso, head, walkCycle: Math.random() * Math.PI * 2 };

      this.enemiesGroup.add(group);
      this.enemyMeshes.set(e.id, group);
      return group;
    },"""

if "getEnemyMesh(e)" not in code:
    code = code.replace("    onResize(customW, customH) {", get_enemy_mesh_code + "\n\n    onResize(customW, customH) {")

# 2. Update enemy animation loop
old_enemy_loop = """      // 4. Update 3D Enemies
      const activeIds = new Set();
      enemies.forEach(e => {
        if (e.dead) return;
        activeIds.add(e.id);

        const mesh = this.getEnemyMesh(e);
        mesh.position.set(e.x, -e.y, 0);
        const facing = e.facing !== undefined ? e.facing : Math.atan2(player.y - e.y, player.x - e.x);
        mesh.rotation.z = -facing;

        // Hit flash & damage recoil
        if (e.hitFlash > 0) {
          mesh.scale.set(1.18, 1.18, 1.18);
        } else {
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      });"""

new_enemy_loop = """      // 4. Update 3D Enemies with Smooth Procedural Walking Gait Animation
      const activeIds = new Set();
      enemies.forEach(e => {
        if (e.dead) return;
        activeIds.add(e.id);

        const mesh = this.getEnemyMesh(e);
        mesh.position.set(e.x, -e.y, 0);
        const facing = e.facing !== undefined ? e.facing : Math.atan2(player.y - e.y, player.x - e.x);
        mesh.rotation.z = -facing;

        // Procedural Leg Walking Gait
        if (mesh.userData && mesh.userData.legL && mesh.userData.legR) {
          mesh.userData.walkCycle += dt * (e.speed || 80) * 0.12;
          const legSwing = Math.sin(mesh.userData.walkCycle) * 0.55;
          mesh.userData.legL.rotation.y = legSwing;
          mesh.userData.legR.rotation.y = -legSwing;
          mesh.userData.torso.position.z = (e.isBoss ? 18 : 12) + Math.abs(Math.sin(mesh.userData.walkCycle * 2)) * 1.5;
        }

        // Hit flash & damage recoil
        if (e.hitFlash > 0) {
          mesh.scale.set(1.2, 1.2, 1.2);
        } else {
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      });"""

if old_enemy_loop in code:
    code = code.replace(old_enemy_loop, new_enemy_loop)

# 3. Update Camera Auto-Scaling Tracking
old_cam_track = """      // 1. Top-Down Crimsonland Camera Tracking (Strictly Centered on Player)
      const targetCamX = player.x;
      const targetCamY = -player.y;
      const targetCamZ = this.cameraZoom || 850;

      // 3D Screen Shake Trauma (Symmetrical offset around centered player)
      const shakeX = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.5;

      this.camera.position.set(targetCamX + shakeX, targetCamY + shakeY, targetCamZ + shakeZ);
      this.camera.lookAt(player.x, -player.y, 0);"""

new_cam_track = """      // 1. Dynamic Auto-Scaling Crimsonland Top-Down Camera
      const baseZoom = 750;
      const pSpeed = Math.hypot(player.vx || 0, player.vy || 0);
      const speedZoomOffset = Math.min(180, (pSpeed / 300) * 150);

      // Enemy density swarm factor
      let nearbyEnemies = 0;
      if (enemies && enemies.length > 0) {
        for (let i = 0; i < enemies.length; i++) {
          const en = enemies[i];
          if (!en.dead && Math.hypot(en.x - player.x, en.y - player.y) < 600) {
            nearbyEnemies++;
          }
        }
      }
      const swarmZoomOffset = Math.min(200, (nearbyEnemies / 20) * 160);

      // Aspect ratio compensation (screen width vs height)
      const screenW = window.innerWidth || 360;
      const screenH = window.innerHeight || 640;
      const aspectFactor = screenW < screenH ? (screenH / screenW) * 0.85 : 1.0;

      const targetCamZoom = (baseZoom + speedZoomOffset + swarmZoomOffset) * aspectFactor;

      if (!this.currentCameraZoom) this.currentCameraZoom = targetCamZoom;
      this.currentCameraZoom += (targetCamZoom - this.currentCameraZoom) * Math.min(1.0, dt * 3.5);

      const activeZoom = this.cameraZoomOverride || this.currentCameraZoom;

      // 3D Screen Shake Trauma (Symmetrical offset around centered player)
      const shakeX = (Math.random() - 0.5) * screenShake * 2.2;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.2;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.8;

      this.camera.position.set(player.x + shakeX, -player.y + shakeY, activeZoom + shakeZ);
      this.camera.lookAt(player.x + shakeX, -player.y + shakeY, 0);"""

if old_cam_track in code:
    code = code.replace(old_cam_track, new_cam_track)

# 4. Uncapped high DPI resolution support up to DPR 3.0
code = re.sub(r'const dpr = Math\.max\(1,\s*Math\.min\(2\.5,\s*window\.devicePixelRatio\s*\|\|\s*1\)\);',
             'const dpr = Math.max(1, Math.min(3.0, window.devicePixelRatio || 1));', code)

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(code)

print("Auto-scaling camera, animations, and high DPI resolution applied successfully!")
