/**
 * DTA Graniczna 8f - Next-Gen 3D WebGL Engine (Three.js r128)
 * Optimized for High-End Android (Snapdragon 8s Gen 3 / Adreno 735 - Poco F6)
 * Full 3D PBR Lighting, Dynamic Soft Shadows, Glossy Epoxy Floor, Articulated Characters & Crimsonland Gore VFX
 */

(function(window) {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error("Three.js not loaded! 3D Engine aborted.");
    return;
  }

  const Engine3D = {
    active: false,
    cameraZoom: 850,
    vfxGroup: null,
    barrelsGroup: null,
    barrelMeshes: new Map(),
    vfxMeshes: new Map(),
    scene: null,
    camera: null,
    renderer: null,
    canvas: null,

    // Lighting
    ambientLight: null,
    dirLight: null,
    headlightLeft: null,
    headlightRight: null,
    beaconLight: null,

    // Meshes & Groups
    playerGroup: null,
    forkliftGroup: null,
    workerGroup: null,
    forkliftWheels: [],
    forkliftMast: null,
    forkliftForks: null,
    beaconMesh: null,
    exhaustMesh: null,
    leftLeg: null,
    rightLeg: null,
    leftArm: null,
    rightArm: null,

    floorMesh: null,
    racksGroup: null,
    propsGroup: null,
    enemiesGroup: null,
    pickupsGroup: null,
    projectilesGroup: null,
    kluskaGroup: null,
    kluskaTail: null,
    kluskaLegs: [],

    // Pools & Maps
    enemyMeshes: new Map(),
    pickupMeshes: new Map(),
    projectileMeshes: new Map(),
    propMeshes: new Map(),

    // Materials & Textures Cache
    materials: {},
    textures: {},
    geometries: {},
    lastObstacleCount: -1,

    init(container) {
      try {
        console.log("🚀 Initializing Ultra-HD Three.js 3D WebGL Engine for Poco F6...");

        // 1. Create or get dedicated WebGL Canvas
        let canvas = document.getElementById('threeCanvas');
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.id = 'threeCanvas';
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.zIndex = '0';
          canvas.style.pointerEvents = 'none';

          const parent = container || document.getElementById('game-container') || document.body;
          parent.insertBefore(canvas, parent.firstChild);
        }
        this.canvas = canvas;

        // 2. Acquire High-Performance WebGL Context
        // Setup WebGL Context Loss Recovery
        if (!this.contextLossRegistered) {
          this.contextLossRegistered = true;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn("⚠️ WebGL Context Lost! Re-initializing...");
            this.active = false;
          }, false);
          canvas.addEventListener('webglcontextrestored', () => {
            console.log("✅ WebGL Context Restored!");
            this.init();
          }, false);
        }

        const width = window.innerWidth || 360;
        const height = window.innerHeight || 640;
        const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));

        try {
          this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            alpha: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
            precision: 'mediump',
            stencil: false,
            depth: true
          });
        } catch (e1) {
          console.warn("Standard WebGLRenderer fallback:", e1);
          try {
            this.renderer = new THREE.WebGLRenderer({
              canvas: canvas,
              antialias: false,
              alpha: false
            });
          } catch (e2) {
            console.error("Critical WebGLRenderer failure:", e2);
            return false;
          }
        }

        if (!this.renderer || !this.renderer.getContext()) {
          console.warn("WebGL renderer creation returned null context");
          return false;
        }

        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(dpr);
        
        try {
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        } catch (shadowErr) {
          console.warn("Shadow map not supported:", shadowErr);
        }
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.35;

        // 3. 3D Scene with Industrial Atmospheric Fog
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060c18);
        this.scene.fog = new THREE.FogExp2(0x020617, 0.0032);

        // 4. Tactical Top-Down Crimsonland Perspective Camera (Fixed Aspect Ratio)
        this.camera = new THREE.PerspectiveCamera(50, width / height, 10, 10000);
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(1900, -1900, 850);
        this.camera.lookAt(1900, -1900, 0);

        // 5. Build Procedural Textures & Materials
        this.initProceduralTextures();
        this.initSharedAssets();

        // 6. Lighting Setup
        this.initLighting();

        // 7. Warehouse Floor & Architecture
        this.createWarehouseFloor();

        // 8. 3D Forklift Model (Toyota BT Reflex) & On-Foot Worker
        this.createPlayerModel();

        // 9. 3D Companion (Kluska)
        this.createKluskaModel();

        // 10. Particle System & Gore Pools
        this.initParticleSystem();

        // 11. Groups for dynamic entities
                this.racksGroup = new THREE.Group();
        this.propsGroup = new THREE.Group();
        this.barrelsGroup = new THREE.Group();
        this.vfxGroup = new THREE.Group();
        this.enemiesGroup = new THREE.Group();
        this.pickupsGroup = new THREE.Group();
        this.projectilesGroup = new THREE.Group();
        this.scene.add(this.racksGroup);
        this.scene.add(this.propsGroup);
        this.scene.add(this.barrelsGroup);
        this.scene.add(this.vfxGroup);
        this.scene.add(this.enemiesGroup);
        this.scene.add(this.pickupsGroup);
        this.scene.add(this.projectilesGroup);

        this.active = true;
        console.log("✅ Ultra-HD 3D WebGL Engine Active! Resolution:", Math.round(width * dpr), "x", Math.round(height * dpr));

        window.addEventListener('resize', () => this.onResize());
        return true;
      } catch (err) {
        console.error("❌ 3D Engine Init Failed:", err);
        this.active = false;
        return false;
      }
    },

    
    setCameraZoom(zoomVal) {
      this.cameraZoom = Math.max(500, Math.min(1200, parseInt(zoomVal, 10) || 850));
    },

    getScreenCoords(worldX, worldY, worldZ = 12) {
      if (!this.camera) return { x: -999, y: -999, visible: false };
      const vec = new THREE.Vector3(worldX, -worldY, worldZ);
      vec.project(this.camera);
      const w = window.innerWidth || 360;
      const h = window.innerHeight || 640;
      const x = (vec.x * 0.5 + 0.5) * w;
      const y = (-(vec.y * 0.5) + 0.5) * h;
      const visible = vec.z < 1.0 && x >= -100 && x <= w + 100 && y >= -100 && y <= h + 100;
      return { x, y, visible };
    },

    syncBarrels(adrBarrels) {
      if (!this.barrelsGroup || !adrBarrels) return;
      const activeIds = new Set();
      adrBarrels.forEach((b, idx) => {
        if (!b.active) return;
        const id = b.id || ("barrel_" + idx);
        activeIds.add(id);
        let mesh = this.barrelMeshes.get(id);
        if (!mesh) {
          const geo = new THREE.CylinderGeometry(11, 11, 25, 12);
          let col = 0xef4444;
          if (b.type === "acid") col = 0x84cc16;
          else if (b.type === "oil") col = 0xf59e0b;
          const mat = new THREE.MeshStandardMaterial({
            color: col,
            roughness: 0.35,
            metalness: 0.65
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.rotation.x = Math.PI / 2;
          this.barrelsGroup.add(mesh);
          this.barrelMeshes.set(id, mesh);
        }
        mesh.position.set(b.x, -b.y, 12.5);
      });
      for (const [id, mesh] of this.barrelMeshes.entries()) {
        if (!activeIds.has(id)) {
          this.barrelsGroup.remove(mesh);
          this.barrelMeshes.delete(id);
        }
      }
    },

    onResize(customW, customH) {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth || 360;
      const h = window.innerHeight || 640;
      const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(dpr);
    },

    // --- PROCEDURAL HIGH-RESOLUTION TEXTURES ---
    initProceduralTextures() {
      // 1. High-Gloss Industrial Epoxy Floor Texture with Concrete Grid & Safety Markings
      const cvsFloor = document.createElement("canvas");
      cvsFloor.width = 1024;
      cvsFloor.height = 1024;
      const ctxF = cvsFloor.getContext("2d");

      // Base Polished Concrete Tone
      ctxF.fillStyle = "#1e293b";
      ctxF.fillRect(0, 0, 1024, 1024);

      // Micro-texture concrete noise
      ctxF.fillStyle = "rgba(255, 255, 255, 0.035)";
      for (let i = 0; i < 6000; i++) {
        ctxF.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
      }
      ctxF.fillStyle = "rgba(0, 0, 0, 0.08)";
      for (let i = 0; i < 4000; i++) {
        ctxF.fillRect(Math.random() * 1024, Math.random() * 1024, 3, 3);
      }

      // Concrete Expansion Joint Slabs (256x256 tiles)
      ctxF.strokeStyle = "#0f172a";
      ctxF.lineWidth = 4;
      for (let x = 0; x <= 1024; x += 256) {
        ctxF.beginPath(); ctxF.moveTo(x, 0); ctxF.lineTo(x, 1024); ctxF.stroke();
      }
      for (let y = 0; y <= 1024; y += 256) {
        ctxF.beginPath(); ctxF.moveTo(0, y); ctxF.lineTo(1024, y); ctxF.stroke();
      }

      // Industrial Yellow Forklift Traffic Guides & Caution Stripes
      ctxF.fillStyle = "rgba(234, 179, 8, 0.75)";
      ctxF.fillRect(240, 0, 16, 1024);
      ctxF.fillRect(768, 0, 16, 1024);

      // Diagonal Hazard Warning Stripes on Border
      ctxF.save();
      ctxF.fillStyle = "#0f172a";
      for (let i = -1024; i < 2048; i += 64) {
        ctxF.beginPath();
        ctxF.moveTo(i, 0);
        ctxF.lineTo(i + 32, 0);
        ctxF.lineTo(i + 32 - 48, 48);
        ctxF.lineTo(i - 48, 48);
        ctxF.closePath();
        ctxF.fill();
      }
      ctxF.restore();

      const floorTex = new THREE.CanvasTexture(cvsFloor);
      floorTex.wrapS = THREE.RepeatWrapping;
      floorTex.wrapT = THREE.RepeatWrapping;
      floorTex.repeat.set(4, 4);
      this.textures.floor = floorTex;

      // 2. Weathered Wood Texture for Euro-Pallets
      const cvsWood = document.createElement("canvas");
      cvsWood.width = 256;
      cvsWood.height = 256;
      const ctxW = cvsWood.getContext("2d");
      ctxW.fillStyle = "#a16207";
      ctxW.fillRect(0, 0, 256, 256);
      ctxW.fillStyle = "#78350f";
      for (let i = 0; i < 256; i += 32) {
        ctxW.fillRect(0, i, 256, 4);
      }
      // Wood grain lines
      ctxW.strokeStyle = "rgba(69, 26, 3, 0.4)";
      ctxW.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        const y = Math.random() * 256;
        ctxW.beginPath();
        ctxW.moveTo(0, y);
        ctxW.bezierCurveTo(80, y + (Math.random()-0.5)*15, 180, y + (Math.random()-0.5)*15, 256, y);
        ctxW.stroke();
      }
      // Stencil "EPAL"
      ctxW.fillStyle = "rgba(69, 26, 3, 0.75)";
      ctxW.font = "bold 20px monospace";
      ctxW.fillText("EPAL", 20, 50);
      ctxW.fillText("EUR", 180, 50);
      const woodTex = new THREE.CanvasTexture(cvsWood);
      this.textures.wood = woodTex;

      // 3. Cardboard Shipping Box Texture with DHL / DTA Barcodes
      const cvsBox = document.createElement("canvas");
      cvsBox.width = 256;
      cvsBox.height = 256;
      const ctxB = cvsBox.getContext("2d");
      ctxB.fillStyle = "#d97706";
      ctxB.fillRect(0, 0, 256, 256);
      // Packing tape
      ctxB.fillStyle = "rgba(180, 83, 9, 0.85)";
      ctxB.fillRect(0, 112, 256, 32);
      // White Shipping Label with Barcode
      ctxB.fillStyle = "#ffffff";
      ctxB.fillRect(20, 20, 90, 70);
      ctxB.fillStyle = "#000000";
      ctxB.fillRect(28, 28, 74, 6);
      ctxB.font = "bold 9px sans-serif";
      ctxB.fillText("DTA CARGO", 28, 48);
      // Barcode lines
      for (let bx = 28; bx < 96; bx += 4) {
        if (Math.random() > 0.3) ctxB.fillRect(bx, 54, 2.5, 28);
      }
      const boxTex = new THREE.CanvasTexture(cvsBox);
      this.textures.box = boxTex;

      // 4. Tactical Top-Down Crimsonland Perspective Camera (Fixed Aspect Ratio)
        this.camera = new THREE.PerspectiveCamera(50, width / height, 10, 10000);
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(1900, -1900, 850);
        this.camera.lookAt(1900, -1900, 0);

      // Follow Player with High-Bay Directional Light Frustum
      this.dirLight.position.set(player.x + 400, -player.y - 700, 1300);
      this.dirLight.target.position.set(player.x, -player.y, 0);

      // 2. Update 3D Character & Forklift State
      this.playerGroup.position.set(player.x, -player.y, 0);
      this.playerGroup.rotation.z = -player.angle;

      const isForklift = !!player.isForklift;
      if (this.forkliftGroup) this.forkliftGroup.visible = isForklift;
      if (this.workerGroup) this.workerGroup.visible = !isForklift;

      if (isForklift) {
        // Realistic Forklift Chassis Lean into Turns
        const turnRoll = Math.max(-0.16, Math.min(0.16, (player.vx * Math.sin(player.angle) - player.vy * Math.cos(player.angle)) * 0.0009));
        this.playerGroup.rotation.y = turnRoll;

        // Rotate Wheels with Travel Speed
        const speed = Math.hypot(player.vx || 0, player.vy || 0);
        if (speed > 5) {
          const wheelRot = speed * dt * 0.25;
          this.forkliftWheels.forEach(w => { w.rotation.y += wheelRot; });
        }
      } else {
        this.playerGroup.rotation.y = 0;
        // Walking Leg Stride Animation
        const speed = Math.hypot(player.vx || 0, player.vy || 0);
        if (speed > 10 && this.leftLeg && this.rightLeg) {
          const stride = Math.sin(gameTime * 15) * 0.48;
          this.leftLeg.rotation.y = stride;
          this.rightLeg.rotation.y = -stride;
        } else if (this.leftLeg && this.rightLeg) {
          this.leftLeg.rotation.y = 0;
          this.rightLeg.rotation.y = 0;
        }
      }

      // Flashing Amber Safety Strobe Beacon
      this.beaconMesh.rotation.y += dt * 18;
      this.beaconLight.position.set(player.x, -player.y, 45);
      this.beaconLight.intensity = 2.4 + Math.sin(gameTime * 16) * 1.8;

      // Industrial High-Bay Roof Luminaire Micro-Flicker
      if (this.dirLight) {
        const flicker = (Math.random() < 0.03) ? (0.85 + Math.random() * 0.5) : (1.35 + Math.sin(gameTime * 0.7) * 0.06);
        this.dirLight.intensity = flicker;
      }

      // Forklift Twin Halogen Headlights
      const forwardX = Math.cos(player.angle);
      const forwardY = -Math.sin(player.angle);
      const rightX = Math.sin(player.angle);
      const rightY = Math.cos(player.angle);
      const hlBeamDist = 580;

      const targetX = player.x + forwardX * hlBeamDist;
      const targetY = -player.y + forwardY * hlBeamDist;

      this.headlightLeft.position.set(player.x + forwardX * 18 - rightX * 11, -player.y + forwardY * 18 - rightY * 11, 32);
      this.headlightLeft.target.position.set(targetX - rightX * 28, targetY - rightY * 28, 0);

      this.headlightRight.position.set(player.x + forwardX * 18 + rightX * 11, -player.y + forwardY * 18 + rightY * 11, 32);
      this.headlightRight.target.position.set(targetX + rightX * 28, targetY + rightX * 28, 0);

      // Nitro Boost Exhaust Plume
      if (player.isDashing || player.nitroBoost) {
        this.exhaustMesh.material.opacity = 0.95;
      } else {
        this.exhaustMesh.material.opacity = 0;
      }

      // 3. Update Dog Kluska
      if (kluska && kluska.active) {
        this.kluskaGroup.visible = true;
        this.kluskaGroup.position.set(kluska.x, -kluska.y, 0);
        this.kluskaGroup.rotation.z = -kluska.angle;
        if (this.kluskaTail) {
          this.kluskaTail.rotation.y = Math.sin(gameTime * 20) * 0.6;
        }
      } else {
        this.kluskaGroup.visible = false;
      }

      // 4. Update 3D Enemies
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
      });

      // Cleanup dead enemy meshes
      for (const [id, mesh] of this.enemyMeshes.entries()) {
        if (!activeIds.has(id)) {
          this.enemiesGroup.remove(mesh);
          this.enemyMeshes.delete(id);
        }
      }

      // 5. Update 3D Flying Projectiles & Weapon VFX
      const activeProjIds = new Set();
      projectiles.forEach((p, idx) => {
        if (p.type === "laser" || p.type === "shockwave" || p.type === "cold_cone" || p.type === "kas_red_zone") return;

        const id = p.id || ("proj_" + idx);
        activeProjIds.add(id);
        let mesh = this.projectileMeshes.get(id);

        if (!mesh) {
          let pGeo, pMat;
          if (p.type === "toilet_paper") {
            pGeo = new THREE.CylinderGeometry(5.5, 5.5, 9, 12);
            pMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
          } else if (p.type === "pallet") {
            pGeo = new THREE.BoxGeometry(24, 24, 4);
            pMat = this.materials.woodPallet;
          } else if (p.type === "faktura") {
            pGeo = new THREE.PlaneGeometry(14, 18);
            pMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
          } else if (p.type === "cutter") {
            pGeo = new THREE.BoxGeometry(4, 16, 2.5);
            pMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6 });
          } else if (p.type === "zip_tie" || p.type === "staple") {
            pGeo = new THREE.BoxGeometry(2.5, 8, 1.5);
            pMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 });
          } else {
            pGeo = new THREE.SphereGeometry(3.5, 8, 8);
            pMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          }

          mesh = new THREE.Mesh(pGeo, pMat);
          mesh.castShadow = true;
          this.projectilesGroup.add(mesh);
          this.projectileMeshes.set(id, mesh);
        }

        let zPos = 14;
        if (p.type === "toilet_paper" || p.type === "pallet") {
          zPos = 22;
          mesh.rotation.x += dt * 12;
          mesh.rotation.y += dt * 14;
        } else if (p.type === "faktura") {
          zPos = 20 + Math.sin(gameTime * 16 + idx) * 6;
          mesh.rotation.x = Math.PI / 2;
          mesh.rotation.y = Math.sin(gameTime * 22) * 0.6;
          mesh.rotation.z = -(p.rot || p.angle || 0);
        } else {
          mesh.rotation.z = -(p.rot || p.angle || 0) + Math.PI / 2;
          if (p.type === "cutter") mesh.rotation.y += dt * 30; // High-speed spinning knife
        }
        mesh.position.set(p.x, -p.y, zPos);
      });

      for (const [id, mesh] of this.projectileMeshes.entries()) {
        if (!activeProjIds.has(id)) {
          this.projectilesGroup.remove(mesh);
          this.projectileMeshes.delete(id);
        }
      }

      // 6. Update 3D Floating Pickups
      const activePickupIds = new Set();
      dropItems.forEach((item, idx) => {
        const id = item.id || idx;
        activePickupIds.add(id);

        let mesh = this.pickupMeshes.get(id);
        if (!mesh) {
          const itemGeo = new THREE.BoxGeometry(11, 11, 11);
          const itemMat = new THREE.MeshStandardMaterial({
            color: item.type === 'coffee' ? 0x78350f : item.type === 'sandwich' ? 0x15803d : 0x0284c7,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.4
          });
          mesh = new THREE.Mesh(itemGeo, itemMat);
          this.pickupsGroup.add(mesh);
          this.pickupMeshes.set(id, mesh);
        }

        const bobZ = 14 + Math.sin(gameTime * 4.5 + item.x) * 4.5;
        mesh.position.set(item.x, -item.y, bobZ);
        mesh.rotation.z = gameTime * 3.0;
      });

      for (const [id, mesh] of this.pickupMeshes.entries()) {
        if (!activePickupIds.has(id)) {
          this.pickupsGroup.remove(mesh);
          this.pickupMeshes.delete(id);
        }
      }

      // 7. Update Particles & Render Final 3D Frame
      this.updateParticles(dt);
      this.renderer.render(this.scene, this.camera);
    }
  };

  window.Engine3D = Engine3D;
})(window);
