import os

engine_code = r'''/**
 * DTA Graniczna 8f - Next-Gen 3D WebGL Engine (Three.js r128)
 * High-End Android & Poco F6 (Snapdragon 8s Gen 3 / Adreno 735)
 * - Auto-scaling Top-Down Crimsonland Camera
 * - Ultra-HD Maximum Native Resolution (PBR, Dynamic Soft Shadows)
 * - Realistic Industrial Color Grading & Atmospheric Warehouse Lighting
 * - Fluid Procedural Skeletal & Vehicle Animations for All Characters and Enemies
 */
(function(window) {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error("Three.js not loaded! 3D Engine aborted.");
    return;
  }

  const Engine3D = {
    active: false,
    baseCameraZoom: 820,
    currentCameraZoom: 820,
    cameraZoom: 820,
    autoScalingEnabled: true,

    // Core Three.js components
    scene: null,
    camera: null,
    renderer: null,
    canvas: null,
    contextLossRegistered: false,

    // Lighting
    ambientLight: null,
    dirLight: null,
    headlightLeft: null,
    headlightRight: null,
    beaconLight: null,

    // Groups
    playerGroup: null,
    forkliftGroup: null,
    workerGroup: null,
    forkliftWheels: [],
    beaconMesh: null,
    leftLeg: null,
    rightLeg: null,
    leftArm: null,
    rightArm: null,

    floorMesh: null,
    racksGroup: null,
    propsGroup: null,
    barrelsGroup: null,
    vfxGroup: null,
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
    barrelMeshes: new Map(),
    propMeshes: new Map(),

    // Materials, Textures & Geometries Cache
    materials: {},
    textures: {},
    geometries: {},
    lastObstacleCount: -1,

    init(container) {
      try {
        console.log("🚀 Initializing Ultra-HD Three.js 3D WebGL Engine...");

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

        // 2. WebGL Context Loss Recovery
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
        const dpr = Math.max(1, Math.min(2.75, window.devicePixelRatio || 1));

        // 3. Renderer with Maximum Native Resolution & Realistic PBR
        try {
          this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
            precision: 'highp',
            stencil: false,
            depth: true
          });
        } catch (e1) {
          console.warn("Fallback WebGLRenderer:", e1);
          this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            alpha: false
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

        // Realistic Industrial ACES Filmic Tone Mapping
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;

        // 4. 3D Scene with Atmospheric Dust Haze
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060c18);
        this.scene.fog = new THREE.FogExp2(0x020617, 0.0016);

        // 5. Top-Down Fixed-Aspect Camera
        this.camera = new THREE.PerspectiveCamera(48, width / height, 10, 12000);
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(1900, -1900, this.currentCameraZoom);
        this.camera.lookAt(1900, -1900, 0);

        // 6. Build Textures, Materials & Shared Assets
        this.initProceduralTextures();
        this.initSharedAssets();

        // 7. Dynamic Industrial Lighting Setup
        this.initLighting();

        // 8. Architecture & Dynamic Groups
        this.createWarehouseFloor();
        this.createPlayerModel();
        this.createKluskaModel();
        this.initParticleSystem();

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
      this.baseCameraZoom = Math.max(500, Math.min(1300, parseInt(zoomVal, 10) || 820));
      this.cameraZoom = this.baseCameraZoom;
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

    onResize(customW, customH) {
      if (!this.renderer || !this.camera) return;
      const w = customW || window.innerWidth || 360;
      const h = customH || window.innerHeight || 640;
      const dpr = Math.max(1, Math.min(2.75, window.devicePixelRatio || 1));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(dpr);
    },

    // --- PROCEDURAL HIGH-RESOLUTION TEXTURES ---
    initProceduralTextures() {
      // 1. High-Gloss Industrial Epoxy Floor Texture with Concrete Grid & Caution Lines
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
      ctxW.strokeStyle = "rgba(69, 26, 3, 0.4)";
      ctxW.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        const y = Math.random() * 256;
        ctxW.beginPath();
        ctxW.moveTo(0, y);
        ctxW.bezierCurveTo(80, y + (Math.random()-0.5)*15, 180, y + (Math.random()-0.5)*15, 256, y);
        ctxW.stroke();
      }
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
      ctxB.fillStyle = "rgba(180, 83, 9, 0.85)";
      ctxB.fillRect(0, 112, 256, 32);
      ctxB.fillStyle = "#ffffff";
      ctxB.fillRect(20, 20, 90, 70);
      ctxB.fillStyle = "#000000";
      ctxB.fillRect(28, 28, 74, 6);
      ctxB.font = "bold 9px sans-serif";
      ctxB.fillText("DTA CARGO", 28, 48);
      for (let bx = 28; bx < 96; bx += 4) {
        if (Math.random() > 0.3) ctxB.fillRect(bx, 54, 2.5, 28);
      }
      const boxTex = new THREE.CanvasTexture(cvsBox);
      this.textures.box = boxTex;
    },

    initSharedAssets() {
      // Physically Based Materials (PBR)
      this.materials.floor = new THREE.MeshStandardMaterial({
        map: this.textures.floor,
        roughness: 0.35,
        metalness: 0.15
      });

      this.materials.toyotaOrange = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.28,
        metalness: 0.45
      });

      this.materials.counterweight = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.45,
        metalness: 0.85
      });

      this.materials.forkSteel = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.25,
        metalness: 0.9
      });

      this.materials.rackBlue = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.4,
        metalness: 0.6
      });

      this.materials.rackOrange = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.35,
        metalness: 0.5
      });

      this.materials.palletWood = new THREE.MeshStandardMaterial({
        map: this.textures.wood,
        roughness: 0.85,
        metalness: 0.05
      });

      this.materials.cardboardBox = new THREE.MeshStandardMaterial({
        map: this.textures.box,
        roughness: 0.8,
        metalness: 0.05
      });

      this.materials.rubberTire = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.9,
        metalness: 0.1
      });

      // Enemy Materials
      this.materials.zombieWorker = new THREE.MeshStandardMaterial({
        color: 0x15803d, // High-vis vest green/decay
        roughness: 0.6,
        metalness: 0.1
      });

      this.materials.zombieAuditor = new THREE.MeshStandardMaterial({
        color: 0x475569, // Gray suit
        roughness: 0.5,
        metalness: 0.2
      });

      this.materials.bossTruck = new THREE.MeshStandardMaterial({
        color: 0xdc2626, // Crimson Heavy Truck
        roughness: 0.3,
        metalness: 0.7
      });
    },

    initLighting() {
      // 1. High-Bay Industrial Ambient Light (Deep Warehouse Blue-Gray)
      this.ambientLight = new THREE.AmbientLight(0x1e293b, 1.35);
      this.scene.add(this.ambientLight);

      // 2. High-Bay Overhead Directional Sun Luminaire (Key Light)
      this.dirLight = new THREE.DirectionalLight(0xfff7ed, 1.45);
      this.dirLight.position.set(1900 + 400, -1900 - 700, 1400);
      this.dirLight.target.position.set(1900, -1900, 0);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 100;
      this.dirLight.shadow.camera.far = 3200;
      this.dirLight.shadow.camera.left = -900;
      this.dirLight.shadow.camera.right = 900;
      this.dirLight.shadow.camera.top = 900;
      this.dirLight.shadow.camera.bottom = -900;
      this.dirLight.shadow.bias = -0.0004;
      this.scene.add(this.dirLight);
      this.scene.add(this.dirLight.target);

      // 3. Forklift Dual Halogen Spotlights
      this.headlightLeft = new THREE.SpotLight(0xfef08a, 4.2, 750, Math.PI / 5.2, 0.4, 1.2);
      this.headlightLeft.castShadow = false;
      this.scene.add(this.headlightLeft);
      this.scene.add(this.headlightLeft.target);

      this.headlightRight = new THREE.SpotLight(0xfef08a, 4.2, 750, Math.PI / 5.2, 0.4, 1.2);
      this.headlightRight.castShadow = false;
      this.scene.add(this.headlightRight);
      this.scene.add(this.headlightRight.target);

      // 4. Rotating Amber Strobe Beacon Point Light
      this.beaconLight = new THREE.PointLight(0xf59e0b, 2.5, 450, 1.5);
      this.scene.add(this.beaconLight);
    },

    createWarehouseFloor() {
      // 3800x3800 Warehouse Floor Plane
      const floorGeo = new THREE.PlaneGeometry(3800, 3800);
      this.floorMesh = new THREE.Mesh(floorGeo, this.materials.floor);
      this.floorMesh.position.set(1900, -1900, 0);
      this.floorMesh.receiveShadow = true;
      this.scene.add(this.floorMesh);
    },

    createPlayerModel() {
      this.playerGroup = new THREE.Group();
      this.scene.add(this.playerGroup);

      // 1. FORKLIFT (Toyota BT Reflex Reach Truck)
      this.forkliftGroup = new THREE.Group();
      this.playerGroup.add(this.forkliftGroup);

      // Main Chassis
      const bodyGeo = new THREE.BoxGeometry(38, 26, 20);
      const body = new THREE.Mesh(bodyGeo, this.materials.toyotaOrange);
      body.position.set(-4, 0, 14);
      body.castShadow = true;
      body.receiveShadow = true;
      this.forkliftGroup.add(body);

      // Counterweight
      const cwGeo = new THREE.BoxGeometry(16, 26, 24);
      const cw = new THREE.Mesh(cwGeo, this.materials.counterweight);
      cw.position.set(-20, 0, 15);
      cw.castShadow = true;
      this.forkliftGroup.add(cw);

      // Roll Cage
      const cageGeo = new THREE.CylinderGeometry(1.2, 1.2, 38, 8);
      [[-18, -11], [-18, 11], [-2, -11], [-2, 11]].forEach(([x, y]) => {
        const pillar = new THREE.Mesh(cageGeo, this.materials.counterweight);
        pillar.position.set(x, y, 22);
        pillar.rotation.x = Math.PI / 2;
        this.forkliftGroup.add(pillar);
      });

      // Overhead Roof Guard
      const roofGeo = new THREE.BoxGeometry(20, 24, 2);
      const roof = new THREE.Mesh(roofGeo, this.materials.counterweight);
      roof.position.set(-10, 0, 41);
      this.forkliftGroup.add(roof);

      // Amber Beacon on Roof
      const beaconGeo = new THREE.CylinderGeometry(2.5, 2.5, 4.5, 10);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      this.beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      this.beaconMesh.position.set(-10, 0, 44);
      this.beaconMesh.rotation.x = Math.PI / 2;
      this.forkliftGroup.add(this.beaconMesh);

      // Triplex Mast Assembly
      const mastGeo = new THREE.BoxGeometry(4, 20, 52);
      const mast = new THREE.Mesh(mastGeo, this.materials.forkSteel);
      mast.position.set(16, 0, 28);
      mast.castShadow = true;
      this.forkliftGroup.add(mast);

      // Forks Carriage
      const forkGeo = new THREE.BoxGeometry(24, 3.5, 2);
      const forkL = new THREE.Mesh(forkGeo, this.materials.forkSteel);
      forkL.position.set(28, -6, 3);
      forkL.castShadow = true;
      this.forkliftGroup.add(forkL);

      const forkR = new THREE.Mesh(forkGeo, this.materials.forkSteel);
      forkR.position.set(28, 6, 3);
      forkR.castShadow = true;
      this.forkliftGroup.add(forkR);

      // Wheels
      this.forkliftWheels = [];
      const wheelGeo = new THREE.CylinderGeometry(4.5, 4.5, 4, 12);
      [[-16, -11], [-16, 11], [14, -10], [14, 10]].forEach(([x, y]) => {
        const w = new THREE.Mesh(wheelGeo, this.materials.rubberTire);
        w.position.set(x, y, 4.5);
        this.forkliftGroup.add(w);
        this.forkliftWheels.push(w);
      });

      // 2. ON-FOOT WORKER (Piotr / Operator)
      this.workerGroup = new THREE.Group();
      this.playerGroup.add(this.workerGroup);
      this.workerGroup.visible = false;

      // Body (High-Vis Vest)
      const wBodyGeo = new THREE.BoxGeometry(12, 18, 22);
      const wBodyMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
      const wBody = new THREE.Mesh(wBodyGeo, wBodyMat);
      wBody.position.set(0, 0, 18);
      wBody.castShadow = true;
      this.workerGroup.add(wBody);

      // Head with Hard Hat
      const wHeadGeo = new THREE.SphereGeometry(6, 12, 12);
      const wHeadMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
      const wHead = new THREE.Mesh(wHeadGeo, wHeadMat);
      wHead.position.set(0, 0, 32);
      wHead.castShadow = true;
      this.workerGroup.add(wHead);

      // Legs
      const legGeo = new THREE.BoxGeometry(5, 6, 14);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      this.leftLeg = new THREE.Mesh(legGeo, legMat);
      this.leftLeg.position.set(0, -5, 7);
      this.leftLeg.castShadow = true;
      this.workerGroup.add(this.leftLeg);

      this.rightLeg = new THREE.Mesh(legGeo, legMat);
      this.rightLeg.position.set(0, 5, 7);
      this.rightLeg.castShadow = true;
      this.workerGroup.add(this.rightLeg);
    },

    createKluskaModel() {
      this.kluskaGroup = new THREE.Group();
      this.scene.add(this.kluskaGroup);

      const dogMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
      // Body
      const bodyGeo = new THREE.BoxGeometry(16, 9, 8);
      const body = new THREE.Mesh(bodyGeo, dogMat);
      body.position.set(0, 0, 6);
      body.castShadow = true;
      this.kluskaGroup.add(body);

      // Head
      const headGeo = new THREE.BoxGeometry(7, 7, 7);
      const head = new THREE.Mesh(headGeo, dogMat);
      head.position.set(9, 0, 9);
      head.castShadow = true;
      this.kluskaGroup.add(head);

      // Wagging Tail
      const tailGeo = new THREE.BoxGeometry(8, 2, 2);
      this.kluskaTail = new THREE.Mesh(tailGeo, dogMat);
      this.kluskaTail.position.set(-10, 0, 8);
      this.kluskaTail.rotation.z = Math.PI / 4;
      this.kluskaGroup.add(this.kluskaTail);

      this.kluskaGroup.visible = false;
    },

    initParticleSystem() {
      this.particleGroup = new THREE.Group();
      this.scene.add(this.particleGroup);

      // Blood/Gore Decals Pool
      const decalGeo = new THREE.PlaneGeometry(24, 24);
      this.bloodPool = [];
      for (let i = 0; i < 75; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: 0x991b1b,
          transparent: true,
          opacity: 0.82,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(decalGeo, mat);
        mesh.position.set(0, 0, 0.1);
        mesh.visible = false;
        this.particleGroup.add(mesh);
        this.bloodPool.push({ mesh, active: false, life: 0 });
      }
    },

    spawnBlood(x, y) {
      for (let b of this.bloodPool) {
        if (!b.active) {
          b.active = true;
          b.mesh.position.set(x, -y, 0.2);
          b.mesh.rotation.z = Math.random() * Math.PI * 2;
          const s = 0.6 + Math.random() * 0.9;
          b.mesh.scale.set(s, s, 1);
          b.mesh.visible = true;
          b.life = 18.0;
          break;
        }
      }
    },

    syncRacks(obstacles) {
      if (!this.racksGroup || !obstacles) return;
      while (this.racksGroup.children.length > 0) {
        const child = this.racksGroup.children[0];
        if (child.geometry) child.geometry.dispose();
        this.racksGroup.remove(child);
      }

      obstacles.forEach(obs => {
        const w = obs.width || 60;
        const h = obs.height || 60;
        const rackH = 65;

        // Base Rack Uprights & Beams
        const rackGeo = new THREE.BoxGeometry(w, h, rackH);
        const rack = new THREE.Mesh(rackGeo, this.materials.rackBlue);
        rack.position.set(obs.x + w/2, -(obs.y + h/2), rackH/2);
        rack.castShadow = true;
        rack.receiveShadow = true;
        this.racksGroup.add(rack);

        // Pallet stacks inside rack
        const palletGeo = new THREE.BoxGeometry(w * 0.85, h * 0.85, 12);
        const pallet = new THREE.Mesh(palletGeo, this.materials.palletWood);
        pallet.position.set(obs.x + w/2, -(obs.y + h/2), rackH + 6);
        pallet.castShadow = true;
        this.racksGroup.add(pallet);

        // Cardboard shipping boxes on pallet
        const boxGeo = new THREE.BoxGeometry(w * 0.7, h * 0.7, 24);
        const box = new THREE.Mesh(boxGeo, this.materials.cardboardBox);
        box.position.set(obs.x + w/2, -(obs.y + h/2), rackH + 24);
        box.castShadow = true;
        this.racksGroup.add(box);
      });
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
          const geo = new THREE.CylinderGeometry(11, 11, 26, 12);
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
        mesh.position.set(b.x, -b.y, 13);
      });

      for (const [id, mesh] of this.barrelMeshes.entries()) {
        if (!activeIds.has(id)) {
          this.barrelsGroup.remove(mesh);
          this.barrelMeshes.delete(id);
        }
      }
    },

    getEnemyMesh(enemy) {
      let mesh = this.enemyMeshes.get(enemy.id);
      if (mesh) return mesh;

      mesh = new THREE.Group();

      const isBoss = !!enemy.isBoss;
      const scale = isBoss ? 2.2 : (enemy.size ? enemy.size / 20 : 1.0);

      // Body Geometry
      const mat = isBoss ? this.materials.bossTruck : (enemy.type === 'klaus' ? this.materials.zombieAuditor : this.materials.zombieWorker);
      const bodyGeo = new THREE.BoxGeometry(14 * scale, 18 * scale, 22 * scale);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.position.set(0, 0, 11 * scale);
      body.castShadow = true;
      mesh.add(body);

      // Head
      const headGeo = new THREE.SphereGeometry(5.5 * scale, 10, 10);
      const headMat = new THREE.MeshStandardMaterial({ color: isBoss ? 0x991b1b : 0x166534, roughness: 0.6 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0, 0, 24 * scale);
      head.castShadow = true;
      mesh.add(head);

      // Limbs for procedural animation
      const limbMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const legGeo = new THREE.BoxGeometry(4.5 * scale, 5 * scale, 12 * scale);

      const lLeg = new THREE.Mesh(legGeo, limbMat);
      lLeg.position.set(0, -4.5 * scale, 6 * scale);
      lLeg.castShadow = true;
      mesh.add(lLeg);
      mesh.lLeg = lLeg;

      const rLeg = new THREE.Mesh(legGeo, limbMat);
      rLeg.position.set(0, 4.5 * scale, 6 * scale);
      rLeg.castShadow = true;
      mesh.add(rLeg);
      mesh.rLeg = rLeg;

      // Arms reaching out forward
      const armGeo = new THREE.BoxGeometry(12 * scale, 4 * scale, 4 * scale);
      const lArm = new THREE.Mesh(armGeo, mat);
      lArm.position.set(8 * scale, -8 * scale, 16 * scale);
      lArm.castShadow = true;
      mesh.add(lArm);
      mesh.lArm = lArm;

      const rArm = new THREE.Mesh(armGeo, mat);
      rArm.position.set(8 * scale, 8 * scale, 16 * scale);
      rArm.castShadow = true;
      mesh.add(rArm);
      mesh.rArm = rArm;

      mesh.enemyType = enemy.type;
      mesh.isBoss = isBoss;

      this.enemiesGroup.add(mesh);
      this.enemyMeshes.set(enemy.id, mesh);
      return mesh;
    },

    // --- MAIN ENGINE UPDATE LOOP (60+ FPS) ---
    update(dt, gameEntities) {
      if (!this.active || !this.renderer || !this.scene || !this.camera) return;

      const {
        player,
        enemies = [],
        dropItems = [],
        projectiles = [],
        kluska,
        screenShake = 0,
        gameTime = 0,
        obstacles = [],
        adrBarrels = []
      } = gameEntities;

      // Sync High-Bay Racks
      if (this.lastObstacleCount !== obstacles.length) {
        this.syncRacks(obstacles);
        this.lastObstacleCount = obstacles.length;
      }
      this.syncBarrels(adrBarrels);

      // 1. AUTO-SCALING TOP-DOWN CRIMSONLAND CAMERA
      const speed = Math.hypot(player.vx || 0, player.vy || 0);
      const enemyCount = enemies.length;

      // Dynamic Auto-Zoom: expands smoothly when driving fast or fighting massive hordes
      let targetZoom = this.baseCameraZoom;
      if (this.autoScalingEnabled) {
        const speedExpansion = Math.min(180, speed * 0.45);
        const densityExpansion = Math.min(120, enemyCount * 1.5);
        targetZoom = this.baseCameraZoom + speedExpansion + densityExpansion;
      }

      // Smooth camera altitude lerp
      this.currentCameraZoom += (targetZoom - this.currentCameraZoom) * Math.min(1.0, dt * 4.5);
      this.cameraZoom = this.currentCameraZoom;

      // Center camera directly above player
      const shakeX = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.5;

      this.camera.position.set(
        player.x + shakeX,
        -player.y + shakeY,
        this.currentCameraZoom + shakeZ
      );
      this.camera.lookAt(player.x, -player.y, 0);

      // Follow Player with High-Bay Directional Light Frustum
      this.dirLight.position.set(player.x + 400, -player.y - 700, 1400);
      this.dirLight.target.position.set(player.x, -player.y, 0);

      // 2. PLAYER ANIMATION & VEHICLE DYNAMICS
      this.playerGroup.position.set(player.x, -player.y, 0);
      this.playerGroup.rotation.z = -player.angle;

      const isForklift = !!player.isForklift;
      if (this.forkliftGroup) this.forkliftGroup.visible = isForklift;
      if (this.workerGroup) this.workerGroup.visible = !isForklift;

      if (isForklift) {
        // Roll into turns
        const turnRoll = Math.max(-0.15, Math.min(0.15, (player.vx * Math.sin(player.angle) - player.vy * Math.cos(player.angle)) * 0.0008));
        this.playerGroup.rotation.y = turnRoll;

        // Roll Wheels with Travel Speed
        if (speed > 5) {
          const wheelRot = speed * dt * 0.25;
          this.forkliftWheels.forEach(w => { w.rotation.y += wheelRot; });
        }
      } else {
        this.playerGroup.rotation.y = 0;
        // Walking Leg Stride Animation
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

      // Twin Halogen Headlights
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
      this.headlightRight.target.position.set(targetX + rightX * 28, targetY + rightY * 28, 0);

      // 3. COMPANION DOG (Kluska)
      if (kluska && kluska.active) {
        this.kluskaGroup.visible = true;
        this.kluskaGroup.position.set(kluska.x, -kluska.y, 0);
        this.kluskaGroup.rotation.z = -kluska.angle;
        if (this.kluskaTail) {
          this.kluskaTail.rotation.y = Math.sin(gameTime * 22) * 0.65;
        }
      } else {
        this.kluskaGroup.visible = false;
      }

      // 4. SMOOTH PROCEDURAL SKELETAL ANIMATIONS FOR ALL ENEMIES
      const activeEnemyIds = new Set();
      enemies.forEach(e => {
        if (e.dead) return;
        activeEnemyIds.add(e.id);

        const mesh = this.getEnemyMesh(e);
        mesh.position.set(e.x, -e.y, 0);

        const facing = e.facing !== undefined ? e.facing : Math.atan2(player.y - e.y, player.x - e.x);
        mesh.rotation.z = -facing;

        // Fluid Walking Leg Cycle
        const eSpeed = Math.hypot(e.vx || 0, e.vy || 0);
        const animFreq = eSpeed > 10 ? 14 : 9;
        const stride = Math.sin(gameTime * animFreq + (e.id ? e.id * 1.3 : 0)) * 0.55;

        if (mesh.lLeg && mesh.rLeg) {
          mesh.lLeg.rotation.y = stride;
          mesh.rLeg.rotation.y = -stride;
        }

        // Arm Grasp Swing & Torso Breathing
        if (mesh.lArm && mesh.rArm) {
          mesh.lArm.rotation.y = -stride * 0.4;
          mesh.rArm.rotation.y = stride * 0.4;
        }

        // Damage Recoil / Squash & Stretch
        if (e.hitFlash > 0) {
          mesh.scale.set(1.22, 0.88, 1.22);
          this.spawnBlood(e.x, e.y);
        } else {
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      });

      // Cleanup dead enemy meshes
      for (const [id, mesh] of this.enemyMeshes.entries()) {
        if (!activeEnemyIds.has(id)) {
          this.enemiesGroup.remove(mesh);
          this.enemyMeshes.delete(id);
        }
      }

      // 5. 3D PROJECTILES
      const activeProjIds = new Set();
      projectiles.forEach((p, idx) => {
        const id = p.id || ("proj_" + idx);
        activeProjIds.add(id);

        let mesh = this.projectileMeshes.get(id);
        if (!mesh) {
          let geo = new THREE.SphereGeometry(3.5, 8, 8);
          let col = 0xfacc15;
          if (p.type === 'laser') col = 0xef4444;
          else if (p.type === 'foam') col = 0xe0f2fe;

          mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col }));
          this.projectilesGroup.add(mesh);
          this.projectileMeshes.set(id, mesh);
        }
        mesh.position.set(p.x, -p.y, 14);
      });

      for (const [id, mesh] of this.projectileMeshes.entries()) {
        if (!activeProjIds.has(id)) {
          this.projectilesGroup.remove(mesh);
          this.projectileMeshes.delete(id);
        }
      }

      // 6. 3D PICKUPS (Spinning & Bobbing)
      const activePickupIds = new Set();
      dropItems.forEach((item, idx) => {
        const id = item.id || ("pickup_" + idx);
        activePickupIds.add(id);

        let mesh = this.pickupMeshes.get(id);
        if (!mesh) {
          let col = 0x38bdf8;
          if (item.type === 'medkit') col = 0xef4444;
          else if (item.type === 'battery') col = 0x22c55e;
          else if (item.type === 'coffee') col = 0x78350f;

          const geo = new THREE.BoxGeometry(9, 9, 9);
          mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
            color: col,
            roughness: 0.3,
            metalness: 0.6
          }));
          mesh.castShadow = true;
          this.pickupsGroup.add(mesh);
          this.pickupMeshes.set(id, mesh);
        }

        const bob = Math.sin(gameTime * 4 + idx) * 3 + 8;
        mesh.position.set(item.x, -item.y, bob);
        mesh.rotation.z += dt * 2.8;
        mesh.rotation.x = Math.sin(gameTime * 2) * 0.25;
      });

      for (const [id, mesh] of this.pickupMeshes.entries()) {
        if (!activePickupIds.has(id)) {
          this.pickupsGroup.remove(mesh);
          this.pickupMeshes.delete(id);
        }
      }

      // Render Three.js Scene
      this.renderer.render(this.scene, this.camera);
    }
  };

  window.Engine3D = Engine3D;
})(window);
'''

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(engine_code)

print("three_engine.js built successfully with Auto-Scaling Camera & Realistic PBR Engine!")
