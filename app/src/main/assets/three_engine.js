/**
 * DTA Graniczna 8f - High-Performance 3D WebGL Engine (Three.js r128)
 * Built for Poco F6 (Snapdragon 8s Gen 3 / Adreno 735)
 * Full 3D PBR Lighting, Dynamic Shadows, 3D Models & Volumetric Effects
 */

(function(window) {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error("Three.js not loaded! 3D Engine aborted.");
    return;
  }

  const Engine3D = {
    active: false,
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
    forkliftBody: null,
    forkliftWheels: [],
    forkliftMast: null,
    forkliftForks: null,
    beaconMesh: null,
    exhaustMesh: null,

    floorMesh: null,
    racksGroup: null,
    propsGroup: null,
    enemiesGroup: null,
    pickupsGroup: null,
    projectilesGroup: null,
    kluskaGroup: null,

    // Pools & Maps
    enemyMeshes: new Map(),
    pickupMeshes: new Map(),
    projectileMeshes: new Map(),
    propMeshes: new Map(),

    // Materials Cache
    materials: {},
    geometries: {},

    lastSectorId: -1,

    init(container) {
      try {
        console.log("Initializing Three.js 3D WebGL Engine for Poco F6...");

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
          canvas.style.zIndex = '1'; // Behind HUD & Joysticks (z-index 100+)
          canvas.style.pointerEvents = 'none';

          const parent = container || document.getElementById('game-container') || document.body;
          // Insert as first child so DOM UI stays on top
          parent.insertBefore(canvas, parent.firstChild);
        }
        this.canvas = canvas;

        // 2. Check WebGL support cleanly and avoid software rasterizer errors in virtualized Mesa environments
        let testCtx = null;
        try {
          testCtx = canvas.getContext("webgl2", { powerPreference: "default" }) ||
                    canvas.getContext("webgl", { powerPreference: "default" }) ||
                    canvas.getContext("experimental-webgl");
        } catch (ctxErr) {
          console.warn("WebGL context acquisition failed:", ctxErr);
          return false;
        }

        if (!testCtx) {
          console.warn("WebGL not supported in current environment; falling back to 2D engine");
          return false;
        }

        // Verify renderer info if available
        try {
          const dbgExt = testCtx.getExtension("WEBGL_debug_renderer_info");
          if (dbgExt) {
            const rendererStr = testCtx.getParameter(dbgExt.UNMASKED_RENDERER_WEBGL) || "";
            console.log("Detected GPU Renderer:", rendererStr);
          }
        } catch (e) {}

        const width = window.innerWidth || 360;
        const height = window.innerHeight || 640;
        const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));

        try {
          this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            context: testCtx,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            precision: 'mediump',
            stencil: false,
            depth: true
          });
        } catch (e1) {
          console.warn("Primary WebGLRenderer init failed, trying basic context:", e1);
          this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            alpha: false,
            powerPreference: 'default',
            precision: 'mediump'
          });
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
        this.renderer.toneMappingExposure = 1.25;

        // 3. 3D Scene with Industrial Warehouse Atmospheric Fog
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x030712);
        this.scene.fog = new THREE.FogExp2(0x030712, 0.00055);

        // 4. Tactical Isometric Perspective Camera (50 deg pitch)
        this.camera = new THREE.PerspectiveCamera(46, width / height, 10, 8000);
        this.camera.position.set(1900, -2350, 620);
        this.camera.lookAt(1900, -1860, 0);

        // 5. Initialize Shared Materials & Geometries
        this.initSharedAssets();

        // 6. Lighting Setup
        this.initLighting();

        // 7. Warehouse Floor
        this.createWarehouseFloor();

        // 8. 3D Forklift Model (Toyota BT Reflex)
        this.createForkliftModel();

        // 9. 3D Companion (Kluska)
        this.initParticleSystem();
        this.createKluskaModel();

        // 10. Groups for dynamic world entities
        this.racksGroup = new THREE.Group();
        this.propsGroup = new THREE.Group();
        this.enemiesGroup = new THREE.Group();
        this.pickupsGroup = new THREE.Group();
        this.projectilesGroup = new THREE.Group();

        this.scene.add(this.racksGroup);
        this.scene.add(this.propsGroup);
        this.scene.add(this.enemiesGroup);
        this.scene.add(this.pickupsGroup);
        this.scene.add(this.projectilesGroup);

        this.active = true;
        console.log("3D WebGL Engine initialized successfully! Resolution:", width * dpr, "x", height * dpr);

        // Window resize handler
        window.addEventListener('resize', () => this.onResize());

        return true;
      } catch (err) {
        console.error("3D Engine Init Failed:", err);
        this.active = false;
        return false;
      }
    },

    onResize() {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth || 360;
      const h = window.innerHeight || 640;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(dpr);
    },

    initSharedAssets() {
      // Materials
      this.materials.toyotaOrange = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.35,
        metalness: 0.25
      });

      this.materials.counterweight = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.4
      });

      this.materials.chrome = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.15,
        metalness: 0.9
      });

      this.materials.darkSteel = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.5,
        metalness: 0.5
      });

      this.materials.rubberTire = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.85,
        metalness: 0.05
      });

      this.materials.rackBlue = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        roughness: 0.4,
        metalness: 0.35
      });

      this.materials.rackOrange = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.45,
        metalness: 0.25
      });

      this.materials.woodPallet = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.85,
        metalness: 0.05
      });

      this.materials.cardboardBox = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.8,
        metalness: 0.02
      });

      this.materials.whiteStretchWrap = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      });

      this.materials.hazardYellow = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.4,
        metalness: 0.1
      });

      this.materials.beaconOrange = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85
      });

      this.materials.headlightGlow = new THREE.MeshBasicMaterial({
        color: 0xfef08a
      });

      this.materials.laserCyan = new THREE.MeshBasicMaterial({
        color: 0x38bdf8
      });

      this.materials.hitFlash = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
    },

    initLighting() {
      // 1. Ambient Fill Light
      this.ambientLight = new THREE.AmbientLight(0x1e293b, 0.7);
      this.scene.add(this.ambientLight);

      // 2. Directional Industrial High-Bay Roof Lights with Real-Time Soft Shadows
      this.dirLight = new THREE.DirectionalLight(0xfffaed, 1.15);
      this.dirLight.position.set(1900 + 400, -1900 - 800, 1400);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 2048;
      this.dirLight.shadow.mapSize.height = 2048;
      this.dirLight.shadow.camera.near = 100;
      this.dirLight.shadow.camera.far = 3000;
      this.dirLight.shadow.camera.left = -900;
      this.dirLight.shadow.camera.right = 900;
      this.dirLight.shadow.camera.top = 900;
      this.dirLight.shadow.camera.bottom = -900;
      this.dirLight.shadow.bias = -0.0005;
      this.scene.add(this.dirLight);
      this.scene.add(this.dirLight.target);

      // 3. Forklift Headlights (Twin Halogen SpotLights)
      this.headlightLeft = new THREE.SpotLight(0xfef08a, 4.0, 750, Math.PI / 4.5, 0.45, 1.1);
      this.headlightLeft.castShadow = true;
      this.headlightLeft.shadow.mapSize.width = 1024;
      this.headlightLeft.shadow.mapSize.height = 1024;
      this.headlightLeft.shadow.bias = -0.001;

      this.headlightRight = new THREE.SpotLight(0xfef08a, 4.0, 750, Math.PI / 4.5, 0.45, 1.1);
      this.headlightRight.castShadow = true;
      this.headlightRight.shadow.mapSize.width = 1024;
      this.headlightRight.shadow.mapSize.height = 1024;
      this.headlightRight.shadow.bias = -0.001;

      this.scene.add(this.headlightLeft);
      this.scene.add(this.headlightLeft.target);
      this.scene.add(this.headlightRight);
      this.scene.add(this.headlightRight.target);

      // 4. Strobe Safety Beacon on Forklift Roof (Pulsing 3D PointLight)
      this.beaconLight = new THREE.PointLight(0xf59e0b, 2.5, 380, 1.2);
      this.scene.add(this.beaconLight);
    },

    
    // --- 3D PARTICLE & SPARK ENGINE (Crimsonland / Darkest Dungeon Impact Style) ---
    particles: [],
    initParticleSystem() {
      this.particleGroup = new THREE.Group();
      this.scene.add(this.particleGroup);

      // Instanced or pre-allocated pool of spark meshes
      const sparkGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      this.sparkPool = [];
      for (let i = 0; i < 90; i++) {
        const mesh = new THREE.Mesh(sparkGeo, sparkMat);
        mesh.visible = false;
        this.particleGroup.add(mesh);
        this.sparkPool.push({
          mesh: mesh,
          active: false,
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0,
          life: 0, maxLife: 1.0,
          color: 0xf59e0b
        });
      }
    },
    spawnSparks(x, y, z, count = 12, hexColor = 0xf59e0b) {
      if (!this.sparkPool) return;
      let spawned = 0;
      for (let i = 0; i < this.sparkPool.length && spawned < count; i++) {
        const p = this.sparkPool[i];
        if (!p.active) {
          p.active = true;
          p.x = x;
          p.y = -y;
          p.z = z || 12;
          const speed = 120 + Math.random() * 220;
          const angle = Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.vz = 80 + Math.random() * 180;
          p.life = 0;
          p.maxLife = 0.25 + Math.random() * 0.35;
          p.mesh.visible = true;
          p.mesh.position.set(p.x, p.y, p.z);
          p.mesh.scale.set(1.4, 1.4, 1.4);
          spawned++;
        }
      }
    },
    updateParticles(dt) {
      if (!this.sparkPool) return;
      for (let i = 0; i < this.sparkPool.length; i++) {
        const p = this.sparkPool[i];
        if (p.active) {
          p.life += dt;
          if (p.life >= p.maxLife) {
            p.active = false;
            p.mesh.visible = false;
            continue;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vz -= 480 * dt; // Gravity
          p.z += p.vz * dt;
          if (p.z < 2) {
            p.z = 2;
            p.vz = -p.vz * 0.45; // Floor bounce
          }
          p.mesh.position.set(p.x, p.y, p.z);
          const s = Math.max(0.1, 1.0 - (p.life / p.maxLife));
          p.mesh.scale.set(s, s, s);
        }
      }
    },

    createWarehouseFloor() {
      // High-grade Industrial Polished Epoxy Concrete Floor (Realistic, No Grid)
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");

      // 1. Deep slate-graphite industrial epoxy base
      const bgGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 720);
      bgGrad.addColorStop(0, "#131b2e");
      bgGrad.addColorStop(0.65, "#0d1424");
      bgGrad.addColorStop(1, "#070b14");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // 2. Concrete natural mineral aggregate noise & surface texture
      const imgData = ctx.getImageData(0, 0, 1024, 1024);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 14;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      // 3. Realistic soft tire skid marks and warehouse forklift wear
      ctx.save();
      ctx.strokeStyle = "rgba(4, 7, 13, 0.45)";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(120, 240);
      ctx.bezierCurveTo(340, 210, 580, 420, 890, 380);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(140, 265);
      ctx.bezierCurveTo(360, 235, 600, 445, 910, 405);
      ctx.stroke();
      ctx.restore();

      // 4. Clean industrial safety walkway bands (Solid polyurethane yellow, not a grid)
      ctx.fillStyle = "rgba(234, 179, 8, 0.85)";
      ctx.fillRect(0, 500, 1024, 24); // Primary transport lane boundary
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      // Diagonal warning chevrons along transport boundary
      for (let s = -30; s < 1050; s += 48) {
        ctx.beginPath();
        ctx.moveTo(s, 500);
        ctx.lineTo(s + 24, 500);
        ctx.lineTo(s + 12, 524);
        ctx.lineTo(s - 12, 524);
        ctx.fill();
      }

      // 5. Stenciled Bay zone marking: "SECTOR A-4 // DTA"
      ctx.fillStyle = "rgba(148, 163, 184, 0.18)";
      ctx.font = "bold 56px monospace";
      ctx.fillText("ZONE A // LOGISTICS", 90, 340);
      ctx.fillText("MAX LOAD 2500 KG", 120, 780);

      const floorTexture = new THREE.CanvasTexture(canvas);
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(6, 6);

      // Polished glossy epoxy material with light reflections
      const floorMat = new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.28,
        metalness: 0.32,
        bumpScale: 0.04
      });

      const floorGeo = new THREE.PlaneGeometry(3800, 3800);
      this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
      this.floorMesh.position.set(1900, -1900, 0);
      this.floorMesh.receiveShadow = true;
      this.scene.add(this.floorMesh);
    },
    createForkliftModel() {
      this.playerGroup = new THREE.Group();
      this.forkliftGroup = new THREE.Group();
      this.playerGroup.add(this.forkliftGroup);

      // --- FORKLIFT MESH (Toyota BT Reflex - RARE ULTRA BONUS) ---
      // 1. Lower Chassis (Toyota Orange)
      const chassisGeo = new THREE.BoxGeometry(42, 28, 14);
      const chassis = new THREE.Mesh(chassisGeo, this.materials.toyotaOrange);
      chassis.position.set(-4, 0, 9);
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      this.forkliftGroup.add(chassis);

      // 2. Heavy Rear Counterweight (Cast Iron Steel)
      const cwGeo = new THREE.BoxGeometry(16, 26, 16);
      const cw = new THREE.Mesh(cwGeo, this.materials.counterweight);
      cw.position.set(-20, 0, 10);
      cw.castShadow = true;
      this.forkliftGroup.add(cw);

      // 3. Four Rubber Industrial Wheels
      const wheelGeo = new THREE.CylinderGeometry(5.5, 5.5, 4.5, 16);
      wheelGeo.rotateX(Math.PI / 2);
      const wheelPositions = [
        [-14, -13, 5.5],
        [-14, 13, 5.5],
        [12, -13, 5.5],
        [12, 13, 5.5]
      ];
      wheelPositions.forEach(pos => {
        const w = new THREE.Mesh(wheelGeo, this.materials.rubberTire);
        w.position.set(pos[0], pos[1], pos[2]);
        w.castShadow = true;
        this.forkliftGroup.add(w);
      });

      // 4. Operator Safety Cage (ROPS/FOPS 4 Pillars + Mesh Roof)
      const pillarGeo = new THREE.BoxGeometry(2, 2, 32);
      const pillarPositions = [
        [-16, -11, 24],
        [-16, 11, 24],
        [3, -11, 24],
        [3, 11, 24]
      ];
      pillarPositions.forEach(pos => {
        const p = new THREE.Mesh(pillarGeo, this.materials.darkSteel);
        p.position.set(pos[0], pos[1], pos[2]);
        p.castShadow = true;
        this.forkliftGroup.add(p);
      });

      // Roof Cover
      const roofGeo = new THREE.BoxGeometry(24, 25, 2.5);
      const roof = new THREE.Mesh(roofGeo, this.materials.darkSteel);
      roof.position.set(-6, 0, 40);
      roof.castShadow = true;
      this.forkliftGroup.add(roof);

      // Driver Seat
      const seatGeo = new THREE.BoxGeometry(10, 10, 10);
      const seat = new THREE.Mesh(seatGeo, this.materials.darkSteel);
      seat.position.set(-8, 0, 18);
      this.forkliftGroup.add(seat);

      // Steering Wheel Column
      const steerGeo = new THREE.CylinderGeometry(1, 1, 10);
      steerGeo.rotateZ(Math.PI / 6);
      const steer = new THREE.Mesh(steerGeo, this.materials.chrome);
      steer.position.set(2, -2, 20);
      this.forkliftGroup.add(steer);

      // 5. Vertical Chrome Hydraulic Mast (Twin I-Beams)
      const mastGroup = new THREE.Group();
      const mastBeamGeo = new THREE.BoxGeometry(3, 2, 48);
      const mastLeft = new THREE.Mesh(mastBeamGeo, this.materials.chrome);
      mastLeft.position.set(18, -9, 24);
      mastLeft.castShadow = true;
      const mastRight = new THREE.Mesh(mastBeamGeo, this.materials.chrome);
      mastRight.position.set(18, 9, 24);
      mastRight.castShadow = true;
      mastGroup.add(mastLeft);
      mastGroup.add(mastRight);

      // Hydraulic Cross-braces
      const braceGeo = new THREE.BoxGeometry(3, 18, 2);
      const braceTop = new THREE.Mesh(braceGeo, this.materials.darkSteel);
      braceTop.position.set(18, 0, 44);
      const braceMid = new THREE.Mesh(braceGeo, this.materials.darkSteel);
      braceMid.position.set(18, 0, 24);
      mastGroup.add(braceTop);
      mastGroup.add(braceMid);
      this.forkliftGroup.add(mastGroup);

      // 6. Heavy Forged Steel Lifting Forks
      const carriageGeo = new THREE.BoxGeometry(2, 22, 16);
      const carriage = new THREE.Mesh(carriageGeo, this.materials.darkSteel);
      carriage.position.set(20, 0, 12);
      carriage.castShadow = true;
      this.forkliftGroup.add(carriage);

      const forkTineGeo = new THREE.BoxGeometry(26, 3, 2);
      const forkLeft = new THREE.Mesh(forkTineGeo, this.materials.chrome);
      forkLeft.position.set(32, -6, 4);
      forkLeft.castShadow = true;
      const forkRight = new THREE.Mesh(forkTineGeo, this.materials.chrome);
      forkRight.position.set(32, 6, 4);
      forkRight.castShadow = true;
      this.forkliftGroup.add(forkLeft);
      this.forkliftGroup.add(forkRight);

      // 7. Amber Flashing Safety Beacon on Roof
      const beaconBaseGeo = new THREE.CylinderGeometry(2, 2, 1.5, 12);
      const beaconBase = new THREE.Mesh(beaconBaseGeo, this.materials.darkSteel);
      beaconBase.position.set(-6, 0, 42);
      this.forkliftGroup.add(beaconBase);

      const beaconGlassGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.5, 12);
      const beaconGlassMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.8,
        roughness: 0.2
      });
      this.beaconMesh = new THREE.Mesh(beaconGlassGeo, beaconGlassMat);
      this.beaconMesh.position.set(-6, 0, 44.5);
      this.forkliftGroup.add(this.beaconMesh);

      // 8. Nitro Turbo Exhaust Flame Cone
      const exhaustGeo = new THREE.ConeGeometry(3, 16, 8);
      exhaustGeo.rotateZ(Math.PI / 2);
      const exhaustMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
      this.exhaustMesh = new THREE.Mesh(exhaustGeo, exhaustMat);
      this.exhaustMesh.position.set(-30, 0, 10);
      this.forkliftGroup.add(this.exhaustMesh);

      // --- 3D PEDESTRIAN WORKER CHARACTER (On-foot state by default) ---
      this.workerGroup = new THREE.Group();

      // Legs
      const legGeo = new THREE.CylinderGeometry(2.2, 2.4, 15, 8);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      this.leftLeg = new THREE.Mesh(legGeo, legMat);
      this.leftLeg.position.set(0, -3.2, 7.5);
      this.leftLeg.castShadow = true;
      this.rightLeg = new THREE.Mesh(legGeo, legMat);
      this.rightLeg.position.set(0, 3.2, 7.5);
      this.rightLeg.castShadow = true;
      this.workerGroup.add(this.leftLeg);
      this.workerGroup.add(this.rightLeg);

      // Torso with High-Vis Safety Vest
      const torsoGeo = new THREE.BoxGeometry(9, 13, 14);
      const vestMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45 });
      const torso = new THREE.Mesh(torsoGeo, vestMat);
      torso.position.set(0, 0, 20);
      torso.castShadow = true;
      this.workerGroup.add(torso);

      // 3M Reflective stripe
      const stripeGeo = new THREE.BoxGeometry(9.4, 13.4, 3);
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.8 });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0, 0, 20);
      this.workerGroup.add(stripe);

      // Head
      const headGeo = new THREE.SphereGeometry(3.8, 12, 12);
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 });
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.set(0, 0, 29);
      this.workerGroup.add(head);

      // Protective Safety Helmet
      const helmetGeo = new THREE.SphereGeometry(4.4, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.8);
      const helmetMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.2 });
      const helmet = new THREE.Mesh(helmetGeo, helmetMat);
      helmet.position.set(0, 0, 29.5);
      helmet.castShadow = true;
      this.workerGroup.add(helmet);

      // Barcode Scanner tool in hand
      const scannerGeo = new THREE.BoxGeometry(5, 2.5, 3);
      const scannerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
      const scanner = new THREE.Mesh(scannerGeo, scannerMat);
      scanner.position.set(6, 6, 18);
      this.workerGroup.add(scanner);

      this.playerGroup.add(this.workerGroup);

      // Initially start on foot! Forklift is hidden
      this.forkliftGroup.visible = false;
      this.workerGroup.visible = true;

      this.scene.add(this.playerGroup);
    },
    createKluskaModel() {
      this.kluskaGroup = new THREE.Group();
      const dogMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
      const collarMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });

      // Dog Torso
      const bodyGeo = new THREE.BoxGeometry(16, 9, 8);
      const body = new THREE.Mesh(bodyGeo, dogMat);
      body.position.set(0, 0, 6);
      body.castShadow = true;
      this.kluskaGroup.add(body);

      // Dog Head & Snout
      const headGeo = new THREE.BoxGeometry(8, 7, 7);
      const head = new THREE.Mesh(headGeo, dogMat);
      head.position.set(10, 0, 10);
      head.castShadow = true;
      this.kluskaGroup.add(head);

      const snoutGeo = new THREE.BoxGeometry(6, 4, 4);
      const snout = new THREE.Mesh(snoutGeo, dogMat);
      snout.position.set(15, 0, 9);
      this.kluskaGroup.add(snout);

      // Red Collar
      const collarGeo = new THREE.BoxGeometry(2, 7.5, 7.5);
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.position.set(7, 0, 10);
      this.kluskaGroup.add(collar);

      // Tail
      const tailGeo = new THREE.BoxGeometry(8, 2, 2);
      tailGeo.rotateY(-Math.PI / 4);
      const tail = new THREE.Mesh(tailGeo, dogMat);
      tail.position.set(-10, 0, 10);
      this.kluskaGroup.add(tail);

      this.kluskaGroup.visible = false;
      this.scene.add(this.kluskaGroup);
    },

    syncRacks(obstacles) {
      if (!obstacles || obstacles.length === 0) return;

      // Clear existing racks
      while (this.racksGroup.children.length > 0) {
        const obj = this.racksGroup.children.pop();
        if (obj.geometry) obj.geometry.dispose();
      }

      console.log("Building 3D High-Bay Warehouse Racks:", obstacles.length);

      obstacles.forEach(obs => {
        const w = obs.width || obs.w || 140;
        const h = obs.height || obs.h || 320;
        const cx = obs.x + w / 2;
        const cy = -obs.y - h / 2;

        if (obs.isBorder) {
          // Warehouse Concrete Perimeter Wall with Corrugated Siding
          const wallGeo = new THREE.BoxGeometry(w, h, 140);
          const wallMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.7,
            metalness: 0.3
          });
          const wall = new THREE.Mesh(wallGeo, wallMat);
          wall.position.set(cx, cy, 70);
          wall.castShadow = true;
          wall.receiveShadow = true;
          this.racksGroup.add(wall);
          return;
        }

        // Multi-Level High-Bay Storage Rack Structure
        const rackHeight = 110;
        const rackGroup = new THREE.Group();
        rackGroup.position.set(cx, cy, 0);

        // 4 Blue Steel Vertical Columns
        const colW = 5;
        const colGeo = new THREE.BoxGeometry(colW, colW, rackHeight);
        const colPositions = [
          [-w / 2 + colW / 2, -h / 2 + colW / 2],
          [w / 2 - colW / 2, -h / 2 + colW / 2],
          [-w / 2 + colW / 2, h / 2 - colW / 2],
          [w / 2 - colW / 2, h / 2 - colW / 2]
        ];

        colPositions.forEach(cp => {
          const col = new THREE.Mesh(colGeo, this.materials.rackBlue);
          col.position.set(cp[0], cp[1], rackHeight / 2);
          col.castShadow = true;
          col.receiveShadow = true;
          rackGroup.add(col);

          // Yellow Bollard / Base Protector
          const bollardGeo = new THREE.BoxGeometry(colW + 4, colW + 4, 16);
          const bollard = new THREE.Mesh(bollardGeo, this.materials.hazardYellow);
          bollard.position.set(cp[0], cp[1], 8);
          rackGroup.add(bollard);
        });

        // 3 Tiers of Orange Crossbeams (Trawersy) & Loaded Cargo
        const tiers = [25, 60, 95];
        tiers.forEach((tierZ, tierIdx) => {
          // Front & Rear Long Beams
          const beamXGeo = new THREE.BoxGeometry(w, 3, 5);
          const frontBeam = new THREE.Mesh(beamXGeo, this.materials.rackOrange);
          frontBeam.position.set(0, -h / 2 + 1.5, tierZ);
          frontBeam.castShadow = true;
          rackGroup.add(frontBeam);

          const rearBeam = new THREE.Mesh(beamXGeo, this.materials.rackOrange);
          rearBeam.position.set(0, h / 2 - 1.5, tierZ);
          rearBeam.castShadow = true;
          rackGroup.add(rearBeam);

          // Loaded Euro-Pallets with Cargo Boxes
          const palletCount = Math.max(1, Math.floor(w / 45));
          const stepX = w / palletCount;
          for (let p = 0; p < palletCount; p++) {
            const px = -w / 2 + stepX * (p + 0.5);
            const palletGeo = new THREE.BoxGeometry(stepX * 0.88, h * 0.85, 4);
            const pallet = new THREE.Mesh(palletGeo, this.materials.woodPallet);
            pallet.position.set(px, 0, tierZ + 2);
            pallet.castShadow = true;
            rackGroup.add(pallet);

            // Varied cargo on pallet: boxes or shrink-wrap or drums
            const cargoType = (p + tierIdx) % 3;
            if (cargoType === 0) {
              // Cardboard Box Cluster
              const boxGeo = new THREE.BoxGeometry(stepX * 0.75, h * 0.75, 20);
              const box = new THREE.Mesh(boxGeo, this.materials.cardboardBox);
              box.position.set(px, 0, tierZ + 14);
              box.castShadow = true;
              rackGroup.add(box);
            } else if (cargoType === 1) {
              // Pallet with White Shrink-Wrap
              const wrapGeo = new THREE.BoxGeometry(stepX * 0.82, h * 0.8, 26);
              const wrap = new THREE.Mesh(wrapGeo, this.materials.whiteStretchWrap);
              wrap.position.set(px, 0, tierZ + 17);
              wrap.castShadow = true;
              rackGroup.add(wrap);
            } else {
              // Chemical Steel Drums
              const drumGeo = new THREE.CylinderGeometry(6, 6, 18, 12);
              const drum = new THREE.Mesh(drumGeo, this.materials.rackBlue);
              drum.position.set(px, 0, tierZ + 13);
              drum.castShadow = true;
              rackGroup.add(drum);
            }
          }
        });

        this.racksGroup.add(rackGroup);
      });
    },

    getEnemyMesh(enemy) {
      let mesh = this.enemyMeshes.get(enemy.id);
      if (mesh) return mesh;

      // Build 3D mesh based on enemy.info.renderType
      const rType = (enemy.info && enemy.info.renderType) ? enemy.info.renderType : 'pedestrian';
      const rad = (enemy.info && enemy.info.radius) ? enemy.info.radius : 15;
      const group = new THREE.Group();

      if (rType === 'delivery_van') {
        // 3D Delivery Van (Fiat Ducato)
        const cabGeo = new THREE.BoxGeometry(rad * 3.4, rad * 1.8, rad * 1.6);
        const vanMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
        const van = new THREE.Mesh(cabGeo, vanMat);
        van.position.set(0, 0, rad * 0.9);
        van.castShadow = true;
        group.add(van);

        // Windshield
        const winGeo = new THREE.BoxGeometry(rad * 0.6, rad * 1.6, rad * 0.8);
        const winMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(rad * 1.2, 0, rad * 1.2);
        group.add(win);

        // Wheels
        const wGeo = new THREE.CylinderGeometry(4.5, 4.5, 3.5, 12);
        wGeo.rotateX(Math.PI / 2);
        [[-rad * 1.0, -rad], [-rad * 1.0, rad], [rad * 0.9, -rad], [rad * 0.9, rad]].forEach(p => {
          const wheel = new THREE.Mesh(wGeo, this.materials.rubberTire);
          wheel.position.set(p[0], p[1], 4.5);
          group.add(wheel);
        });
      } else if (rType === 'inventory_drone') {
        // 3D Hovering Quadcopter Drone
        const coreGeo = new THREE.BoxGeometry(rad * 1.2, rad * 1.2, 5);
        const droneMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.6 });
        const core = new THREE.Mesh(coreGeo, droneMat);
        core.position.set(0, 0, 22);
        group.add(core);

        // 4 Rotor Arms & Discs
        const armGeo = new THREE.BoxGeometry(rad * 2.2, 2, 2);
        const arm1 = new THREE.Mesh(armGeo, droneMat); arm1.position.set(0, 0, 22); group.add(arm1);
        const arm2 = new THREE.Mesh(armGeo, droneMat); arm2.position.set(0, 0, 22); arm2.rotateZ(Math.PI / 2); group.add(arm2);

        // Blinking Sensor Light
        const ledGeo = new THREE.SphereGeometry(2.5, 8, 8);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(0, 0, 26);
        group.add(led);
      } else if (rType === 'warehouse_rat') {
        // 3D Scurrying Rat
        const ratGeo = new THREE.BoxGeometry(rad * 1.8, rad * 0.9, rad * 0.7);
        const ratMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
        const rat = new THREE.Mesh(ratGeo, ratMat);
        rat.position.set(0, 0, rad * 0.4);
        rat.castShadow = true;
        group.add(rat);

        const tailGeo = new THREE.CylinderGeometry(1, 1, rad * 1.4);
        tailGeo.rotateZ(Math.PI / 3);
        const tail = new THREE.Mesh(tailGeo, new THREE.MeshBasicMaterial({ color: 0xf472b6 }));
        tail.position.set(-rad * 1.4, 0, rad * 0.5);
        group.add(tail);
      } else {
        // 3D Humanoid Worker / Courier / Guard in High-Vis Vest
        const vestColor = enemy.info && enemy.info.color ? parseInt(enemy.info.color.replace('#', '0x')) : 0xea580c;
        const vestMat = new THREE.MeshStandardMaterial({ color: vestColor, roughness: 0.5 });
        const bodyGeo = new THREE.BoxGeometry(10, 14, 20);
        const body = new THREE.Mesh(bodyGeo, vestMat);
        body.position.set(0, 0, 18);
        body.castShadow = true;
        group.add(body);

        // Reflective Stripes
        const stripeGeo = new THREE.BoxGeometry(10.5, 14.5, 3);
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(0, 0, 20);
        group.add(stripe);

        // Safety Hard Hat
        const hatGeo = new THREE.SphereGeometry(6, 12, 10);
        const hatMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 });
        const hat = new THREE.Mesh(hatGeo, hatMat);
        hat.position.set(0, 0, 32);
        hat.castShadow = true;
        group.add(hat);
      }

      this.enemiesGroup.add(group);
      this.enemyMeshes.set(enemy.id, group);
      return group;
    },

    update(dt, gameEntities) {
      if (!this.active) return;

      const player = gameEntities.player;
      const enemies = gameEntities.enemies || [];
      const dropItems = gameEntities.dropItems || [];
      const projectiles = gameEntities.projectiles || [];
      const kluska = gameEntities.kluska;
      const screenShake = gameEntities.screenShake || 0;
      const gameTime = gameEntities.gameTime || 0;

      // 1. Camera Tracking (Tactical Isometric Angle with Velocity Lead)
      const lookAheadX = (player.vx || 0) * 0.16;
      const lookAheadY = -(player.vy || 0) * 0.16;
      const targetCamX = player.x + lookAheadX;
      const targetCamY = -player.y - 480 + lookAheadY;
      const targetCamZ = 630;

      const shakeX = 0;
      const shakeY = 0;
      const shakeZ = 0;

      this.camera.position.set(targetCamX + shakeX, targetCamY + shakeY, targetCamZ + shakeZ);
      this.camera.lookAt(player.x + lookAheadX * 0.5, -player.y + 35 + lookAheadY * 0.5, 0);

      // Follow player with directional light shadow frustum
      this.dirLight.position.set(player.x + 350, -player.y - 650, 1200);
      this.dirLight.target.position.set(player.x, -player.y, 0);

      // 2. Update 3D Character & Forklift State
      this.playerGroup.position.set(player.x, -player.y, 0);
      this.playerGroup.rotation.z = -player.angle;

      const isForklift = !!player.isForklift;
      if (this.forkliftGroup) this.forkliftGroup.visible = isForklift;
      if (this.workerGroup) this.workerGroup.visible = !isForklift;

      if (isForklift) {
        // Dynamic forklift chassis lean into turns
        const turnRoll = Math.max(-0.15, Math.min(0.15, (player.vx * Math.sin(player.angle) - player.vy * Math.cos(player.angle)) * 0.0008));
        this.playerGroup.rotation.y = turnRoll;
      } else {
        this.playerGroup.rotation.y = 0;
        // Walking leg stride animation when moving on foot
        const speed = Math.hypot(player.vx || 0, player.vy || 0);
        if (speed > 10 && this.leftLeg && this.rightLeg) {
          const stride = Math.sin(gameTime * 14) * 0.45;
          this.leftLeg.rotation.y = stride;
          this.rightLeg.rotation.y = -stride;
        } else if (this.leftLeg && this.rightLeg) {
          this.leftLeg.rotation.y = 0;
          this.rightLeg.rotation.y = 0;
        }
      }

      // Flashing Safety Beacon
      this.beaconMesh.rotation.y += dt * 16;
      this.beaconLight.position.set(player.x, -player.y, 45);
      this.beaconLight.intensity = 2.2 + Math.sin(gameTime * 14) * 1.7;
      // Industrial warehouse roof fluorescent lamp micro-flicker
      if (this.dirLight) {
        const flicker = (Math.random() < 0.04) ? (0.85 + Math.random() * 0.45) : (1.15 + Math.sin(gameTime * 0.8) * 0.08);
        this.dirLight.intensity = flicker;
      }

      // Headlight Beams (Spotlights shining forward)
      const forwardX = Math.cos(player.angle);
      const forwardY = -Math.sin(player.angle);
      const rightX = Math.sin(player.angle);
      const rightY = Math.cos(player.angle);

      const hlBeamDist = 520;
      const targetX = player.x + forwardX * hlBeamDist;
      const targetY = -player.y + forwardY * hlBeamDist;

      this.headlightLeft.position.set(player.x + forwardX * 16 - rightX * 10, -player.y + forwardY * 16 - rightY * 10, 32);
      this.headlightLeft.target.position.set(targetX - rightX * 25, targetY - rightY * 25, 0);

      this.headlightRight.position.set(player.x + forwardX * 16 + rightX * 10, -player.y + forwardY * 16 + rightY * 10, 32);
      this.headlightRight.target.position.set(targetX + rightX * 25, targetY + rightX * 25, 0);

      // Boost plume visibility
      if (player.isDashing || player.nitroBoost) {
        this.exhaustMesh.material.opacity = 0.9;
      } else {
        this.exhaustMesh.material.opacity = 0;
      }

      // 3. Update Dog Kluska
      if (kluska && kluska.active) {
        this.kluskaGroup.visible = true;
        this.kluskaGroup.position.set(kluska.x, -kluska.y, 0);
        this.kluskaGroup.rotation.z = -kluska.angle;
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

        // Hit flash
        if (e.hitFlash > 0) {
          mesh.scale.set(1.15, 1.15, 1.15);
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

      // 5. Update 3D Pickups (Hovering and rotating)
      const activePickupIds = new Set();
      dropItems.forEach((item, idx) => {
        const id = item.id || idx;
        activePickupIds.add(id);

        let mesh = this.pickupMeshes.get(id);
        if (!mesh) {
          const itemGeo = new THREE.BoxGeometry(10, 10, 10);
          const itemMat = new THREE.MeshStandardMaterial({
            color: item.type === 'coffee' ? 0x78350f : item.type === 'sandwich' ? 0x15803d : 0x0284c7,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.3
          });
          mesh = new THREE.Mesh(itemGeo, itemMat);
          this.pickupsGroup.add(mesh);
          this.pickupMeshes.set(id, mesh);
        }

        const bobZ = 12 + Math.sin(gameTime * 4 + item.x) * 4;
        mesh.position.set(item.x, -item.y, bobZ);
        mesh.rotation.z = gameTime * 2.5;
      });

      for (const [id, mesh] of this.pickupMeshes.entries()) {
        if (!activePickupIds.has(id)) {
          this.pickupsGroup.remove(mesh);
          this.pickupMeshes.delete(id);
        }
      }

      // 6. Render the 3D Scene
      this.updateParticles(dt);
      this.renderer.render(this.scene, this.camera);
    }
  };

  window.Engine3D = Engine3D;
})(window);
