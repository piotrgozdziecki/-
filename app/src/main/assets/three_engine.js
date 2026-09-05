/**
 * DTA Graniczna 8f - Next-Gen 3D WebGL Engine (Three.js r128)
 * High-End Android & Poco F6 (Snapdragon 8s Gen 3 / Adreno 735)
 * - Auto-scaling Top-Down Crimsonland Camera
 * - Ultra-HD Maximum Native Resolution (PBR, Dynamic Soft Shadows)
 * - Bright and Crisp Industrial High-Contrast Ambient & Sun Lighting (No Fog)
 * - Fluid Procedural Skeletal & Vehicle Animations for All Characters and Enemies
 * - Technology 1: Infinite Gore Splatter Canvas Overlay (Paint-the-Ground Blood, 0% CPU Cost)
 * - Technology 2: Real 3D Shell Casing Ejection & Gun Smoke Particle Physics
 * - Technology 3: Volumetric Glowing Neon Bullet Tracers with Directional Alignment
 */
(function(window) {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error("Three.js not loaded! 3D Engine aborted.");
    return;
  }

  const Engine3D = {
    active: false,
    baseCameraZoom: 320,
    currentCameraZoom: 320,
    cameraZoom: 320,
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
    goreMesh: null,
    goreCanvas: null,
    goreCtx: null,

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
    shellPool: [],
    smokePool: [],

    // Materials, Textures & Geometries Cache
    materials: {},
    textures: {},
    geometries: {},
    lastObstacleCount: -1,
    lastProjectileCount: 0,
    sirenLights: [],

    // High-Resolution Batching Engine Components
    racksBatch: null,
    palletsBatch: null,
    boxesBatch: null,
    barrelsBatch: null,
    pickupsBatch: null,
    shellsBatch: null,

    // Reusable Scratch Objects for Zero-Allocation Transforms
    dummyMatrix: new THREE.Matrix4(),
    dummyPosition: new THREE.Vector3(),
    dummyRotation: new THREE.Euler(),
    dummyQuaternion: new THREE.Quaternion(),
    dummyScale: new THREE.Vector3(),
    dummyColor: new THREE.Color(),

    init(container) {
      try {
        console.log("🚀 Initializing Ultra-HD Three.js 3D WebGL Engine for Piotr...");

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
        const dpr = Math.max(1, Math.min(1.35, window.devicePixelRatio || 1));

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
        this.renderer.toneMappingExposure = 1.35;

        // 4. 3D Scene with Crispy Clear Background (No Fog for Perfect Visibility)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a);

        // 5. Isometric-Tilted Fixed-Aspect Camera (Spectacular 3D Depth)
        this.camera = new THREE.PerspectiveCamera(46, width / height, 10, 12000);
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(1900, -1900 - 195, this.currentCameraZoom * 0.9);
        this.camera.lookAt(1900, -1900, 15);

        // 6. Build Textures, Materials & Shared Assets
        this.initProceduralTextures();
        this.initSharedAssets();

        // 7. Dynamic Industrial Lighting Setup (Brightened for Perfect Clarity)
        this.initLighting();

        // 8. Architecture & Dynamic Groups
        this.createWarehouseFloor();
        this.createPlayerModel();
        this.createKluskaModel();
        this.initParticleSystem();
        this.initBatchingSystem();

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
        this.lastProjectileCount = 0;
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
      this.baseCameraZoom = Math.max(180, Math.min(850, parseInt(zoomVal, 10) || 320));
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
      const dpr = Math.max(1, Math.min(1.35, window.devicePixelRatio || 1));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(dpr);
    },

    // --- PROCEDURAL HIGH-RESOLUTION TEXTURE ATLAS & SPRITE GENERATION ---
    initProceduralTextures() {
      // 1. High-Gloss Industrial Epoxy Floor Texture with Concrete Grid & Caution Lines (1024x1024)
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

      // 2. High-Res Weathered Wood Texture for Euro-Pallets (512x512)
      const cvsWood = document.createElement("canvas");
      cvsWood.width = 512;
      cvsWood.height = 512;
      const ctxW = cvsWood.getContext("2d");
      ctxW.fillStyle = "#b45309";
      ctxW.fillRect(0, 0, 512, 512);
      ctxW.fillStyle = "#78350f";
      for (let i = 0; i < 512; i += 48) {
        ctxW.fillRect(0, i, 512, 6);
      }
      ctxW.strokeStyle = "rgba(69, 26, 3, 0.45)";
      ctxW.lineWidth = 2.0;
      for (let i = 0; i < 80; i++) {
        const y = Math.random() * 512;
        ctxW.beginPath();
        ctxW.moveTo(0, y);
        ctxW.bezierCurveTo(160, y + (Math.random()-0.5)*25, 360, y + (Math.random()-0.5)*25, 512, y);
        ctxW.stroke();
      }
      // Official Heat-Treatment & European Certification Brand Stamps
      ctxW.fillStyle = "rgba(69, 26, 3, 0.88)";
      ctxW.font = "bold 36px monospace";
      ctxW.fillText("EPAL", 40, 100);
      ctxW.fillText("EUR", 360, 100);
      ctxW.font = "bold 20px monospace";
      ctxW.fillText("HT - PL 14-885", 140, 240);
      
      const woodTex = new THREE.CanvasTexture(cvsWood);
      this.textures.wood = woodTex;

      // 3. High-Res Cardboard Shipping Box Texture with DHL / DTA Barcodes & Fragile Stamps (512x512)
      const cvsBox = document.createElement("canvas");
      cvsBox.width = 512;
      cvsBox.height = 512;
      const ctxB = cvsBox.getContext("2d");
      ctxB.fillStyle = "#d97706";
      ctxB.fillRect(0, 0, 512, 512);
      
      // Packing Tape Seams
      ctxB.fillStyle = "rgba(180, 83, 9, 0.9)";
      ctxB.fillRect(0, 220, 512, 72);
      ctxB.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctxB.fillRect(0, 245, 512, 22);

      // Shipping Label 1: DTA Logistics Manifest
      ctxB.fillStyle = "#ffffff";
      ctxB.fillRect(36, 36, 180, 150);
      ctxB.fillStyle = "#000000";
      ctxB.fillRect(48, 48, 156, 12);
      ctxB.font = "bold 16px sans-serif";
      ctxB.fillText("DTA CARGO LOGISTICS", 48, 84);
      ctxB.font = "12px sans-serif";
      ctxB.fillText("WAYBILL: #9842-885F", 48, 104);
      // Barcode lines
      for (let bx = 48; bx < 200; bx += 6) {
        if (Math.random() > 0.25) ctxB.fillRect(bx, 114, 4, 60);
      }

      // Shipping Label 2: FRAGILE Glass Stamp
      ctxB.fillStyle = "#dc2626";
      ctxB.fillRect(280, 48, 190, 80);
      ctxB.fillStyle = "#ffffff";
      ctxB.font = "900 22px sans-serif";
      ctxB.fillText("FRAGILE / OSTROŻNIE", 290, 84);
      ctxB.font = "bold 14px sans-serif";
      ctxB.fillText("THIS SIDE UP ⬆⬆", 310, 112);

      const boxTex = new THREE.CanvasTexture(cvsBox);
      this.textures.box = boxTex;

      // 4. High-Res ADR Chemical Barrels Texture (512x512)
      const cvsBarrel = document.createElement("canvas");
      cvsBarrel.width = 512;
      cvsBarrel.height = 512;
      const ctxBar = cvsBarrel.getContext("2d");
      ctxBar.fillStyle = "#334155";
      ctxBar.fillRect(0, 0, 512, 512);

      // Steel Ribs / Rings
      ctxBar.fillStyle = "#0f172a";
      ctxBar.fillRect(0, 100, 512, 32);
      ctxBar.fillRect(0, 380, 512, 32);

      // Hazard Diamond (ADR Class 8 / Class 3)
      ctxBar.save();
      ctxBar.translate(256, 256);
      ctxBar.rotate(Math.PI / 4);
      ctxBar.fillStyle = "#facc15";
      ctxBar.fillRect(-70, -70, 140, 140);
      ctxBar.strokeStyle = "#000000";
      ctxBar.lineWidth = 6;
      ctxBar.strokeRect(-70, -70, 140, 140);
      ctxBar.restore();

      ctxBar.fillStyle = "#000000";
      ctxBar.font = "900 26px sans-serif";
      ctxBar.textAlign = "center";
      ctxBar.fillText("ADR 8", 256, 250);
      ctxBar.font = "bold 16px sans-serif";
      ctxBar.fillText("HAZARDOUS", 256, 275);

      const barrelTex = new THREE.CanvasTexture(cvsBarrel);
      this.textures.barrel = barrelTex;
    },

    initSharedAssets() {
      // Configure Anisotropic Filtering on all generated textures for crisp angles
      const maxAniso = this.renderer ? this.renderer.capabilities.getMaxAnisotropy() : 4;
      Object.values(this.textures).forEach(tex => {
        if (tex && tex.isTexture) {
          tex.anisotropy = Math.min(8, maxAniso);
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.needsUpdate = true;
        }
      });

      // Physically Based Materials (PBR)
      this.materials.floor = new THREE.MeshStandardMaterial({
        map: this.textures.floor,
        roughness: 0.35,
        metalness: 0.15,
        side: THREE.DoubleSide
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

      this.materials.barrelGeneric = new THREE.MeshStandardMaterial({
        map: this.textures.barrel,
        roughness: 0.35,
        metalness: 0.65
      });

      this.materials.rubberTire = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.9,
        metalness: 0.1
      });

      this.materials.pickupMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.25,
        metalness: 0.75
      });

      this.materials.brassShell = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.9,
        roughness: 0.15
      });

      // Enemy Materials (Increased color saturation for great top-down visibility)
      this.materials.zombieWorker = new THREE.MeshStandardMaterial({
        color: 0x22c55e, // Bright lime green zombie worker
        roughness: 0.4,
        metalness: 0.1
      });

      this.materials.zombieAuditor = new THREE.MeshStandardMaterial({
        color: 0x64748b, // High contrast slate blue-gray
        roughness: 0.4,
        metalness: 0.2
      });

      this.materials.bossTruck = new THREE.MeshStandardMaterial({
        color: 0xef4444, // Vibrant crimson red
        roughness: 0.25,
        metalness: 0.75
      });
    },

    // --- HIGH-PERFORMANCE SPRITE & MESH BATCHING ENGINE (1 DRAW CALL ARCHITECTURE) ---
    initBatchingSystem() {
      // 1. Warehouse Racks Uprights Batch (1 Draw Call for all uprights)
      const rackUnitGeo = new THREE.BoxGeometry(1, 1, 1);
      this.racksBatch = new THREE.InstancedMesh(rackUnitGeo, this.materials.rackBlue, 200);
      this.racksBatch.castShadow = true;
      this.racksBatch.receiveShadow = true;
      this.racksBatch.count = 0;
      this.scene.add(this.racksBatch);

      // 2. Euro-Pallets Batch (1 Draw Call for all pallets)
      const palletUnitGeo = new THREE.BoxGeometry(1, 1, 1);
      this.palletsBatch = new THREE.InstancedMesh(palletUnitGeo, this.materials.palletWood, 200);
      this.palletsBatch.castShadow = true;
      this.palletsBatch.receiveShadow = true;
      this.palletsBatch.count = 0;
      this.scene.add(this.palletsBatch);

      // 3. Cardboard Shipping Boxes Batch (1 Draw Call for all crates)
      const boxUnitGeo = new THREE.BoxGeometry(1, 1, 1);
      this.boxesBatch = new THREE.InstancedMesh(boxUnitGeo, this.materials.cardboardBox, 200);
      this.boxesBatch.castShadow = true;
      this.boxesBatch.receiveShadow = true;
      this.boxesBatch.count = 0;
      this.scene.add(this.boxesBatch);

      // 4. ADR Chemical Barrels Batch with per-instance dynamic colors (1 Draw Call for all drums)
      const barrelUnitGeo = new THREE.CylinderGeometry(11, 11, 26, 14);
      this.barrelsBatch = new THREE.InstancedMesh(barrelUnitGeo, this.materials.barrelGeneric, 120);
      this.barrelsBatch.castShadow = true;
      this.barrelsBatch.receiveShadow = true;
      this.barrelsBatch.count = 0;
      this.scene.add(this.barrelsBatch);

      // 5. 3D Collectible Pickups Batch with per-instance colors (1 Draw Call for all items)
      const pickupUnitGeo = new THREE.BoxGeometry(10, 10, 10);
      this.pickupsBatch = new THREE.InstancedMesh(pickupUnitGeo, this.materials.pickupMaterial, 80);
      this.pickupsBatch.castShadow = true;
      this.pickupsBatch.count = 0;
      this.scene.add(this.pickupsBatch);

      // 6. 3D Brass Shell Casings Batch (1 Draw Call for all ejecting shell casings)
      const shellUnitGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.8, 6);
      this.shellsBatch = new THREE.InstancedMesh(shellUnitGeo, this.materials.brassShell, 120);
      this.shellsBatch.castShadow = true;
      this.shellsBatch.count = 0;
      this.scene.add(this.shellsBatch);
    },

    initLighting() {
      // 1. Crisp Industrial Ambient Light (Bright & High-Contrast Warehouse)
      this.ambientLight = new THREE.AmbientLight(0xe2e8f0, 1.35);
      this.scene.add(this.ambientLight);

      // 2. High-Bay Overhead Key Light (Casts dramatic long shadows)
      this.dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      this.dirLight.position.set(1900 + 400, -1900 - 700, 1400);
      this.dirLight.target.position.set(1900, -1900, 0);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 100;
      this.dirLight.shadow.camera.far = 3200;
      this.dirLight.shadow.camera.left = -450;
      this.dirLight.shadow.camera.right = 450;
      this.dirLight.shadow.camera.top = 450;
      this.dirLight.shadow.camera.bottom = -450;
      this.dirLight.shadow.bias = -0.0004;
      this.scene.add(this.dirLight);
      this.scene.add(this.dirLight.target);

      // 3. Forklift Dual Halogen Spotlights with Premium Real-Time Shadows
      this.headlightLeft = new THREE.SpotLight(0xfff1f2, 8.5, 950, Math.PI / 4.8, 0.45, 1.1);
      this.headlightLeft.castShadow = true;
      this.headlightLeft.shadow.mapSize.width = 1024;
      this.headlightLeft.shadow.mapSize.height = 1024;
      this.headlightLeft.shadow.camera.near = 10;
      this.headlightLeft.shadow.camera.far = 1000;
      this.headlightLeft.shadow.bias = -0.0008;
      this.scene.add(this.headlightLeft);
      this.scene.add(this.headlightLeft.target);

      this.headlightRight = new THREE.SpotLight(0xfff1f2, 8.5, 950, Math.PI / 4.8, 0.45, 1.1);
      this.headlightRight.castShadow = true;
      this.headlightRight.shadow.mapSize.width = 1024;
      this.headlightRight.shadow.mapSize.height = 1024;
      this.headlightRight.shadow.camera.near = 10;
      this.headlightRight.shadow.camera.far = 1000;
      this.headlightRight.shadow.bias = -0.0008;
      this.scene.add(this.headlightRight);
      this.scene.add(this.headlightRight.target);

      // 4. Rotating Amber Strobe Beacon Point Light
      this.beaconLight = new THREE.PointLight(0xf59e0b, 2.5, 450, 1.5);
      this.scene.add(this.beaconLight);

      // 5. Dynamic Muzzle Flash Light
      this.muzzleLight = new THREE.PointLight(0xfef08a, 0, 180, 1.5);
      this.scene.add(this.muzzleLight);

      // 6. Flashing Industrial Sirens / Alarms at Key Warehouse Points
      this.sirenLights = [];
      const sirenPositions = [
        [400, -400],
        [3400, -400],
        [400, -3400],
        [3400, -3400]
      ];
      sirenPositions.forEach(([sx, sy], idx) => {
        const sirenLight = new THREE.PointLight(idx % 2 === 0 ? 0xef4444 : 0x06b6d4, 0.0, 450, 1.6);
        sirenLight.position.set(sx, sy, 35);
        this.scene.add(sirenLight);
        this.sirenLights.push(sirenLight);
      });
    },

    createWarehouseFloor() {
      // 3800x3800 Warehouse Floor Plane
      const floorGeo = new THREE.PlaneGeometry(3800, 3800);
      this.floorMesh = new THREE.Mesh(floorGeo, this.materials.floor);
      this.floorMesh.position.set(1900, -1900, 0);
      this.floorMesh.receiveShadow = true;
      this.scene.add(this.floorMesh);

      // --- TECHNOLOGY 1: INFINITE GORE SPLATTER CANVAS OVERLAY (0% CPU Cost, Persistent Crimson Floor) ---
      this.goreCanvas = document.createElement("canvas");
      this.goreCanvas.width = 2048;
      this.goreCanvas.height = 2048;
      this.goreCtx = this.goreCanvas.getContext("2d");
      
      // Initialize with transparent background
      this.goreCtx.clearRect(0, 0, 2048, 2048);

      this.textures.gore = new THREE.CanvasTexture(this.goreCanvas);
      const goreMat = new THREE.MeshBasicMaterial({
        map: this.textures.gore,
        transparent: true,
        depthWrite: false
      });
      this.goreMesh = new THREE.Mesh(floorGeo, goreMat);
      this.goreMesh.position.set(1900, -1900, 0.12); // Slightly above the main concrete plane
      this.scene.add(this.goreMesh);
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

      // Legacy Blood/Gore Decals Pool (Keep for micro-particles)
      const decalGeo = new THREE.PlaneGeometry(24, 24);
      this.bloodPool = [];
      for (let i = 0; i < 40; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: 0x851414,
          transparent: true,
          opacity: 0.75,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(decalGeo, mat);
        mesh.position.set(0, 0, 0.1);
        mesh.visible = false;
        this.particleGroup.add(mesh);
        this.bloodPool.push({ mesh, active: false, life: 0 });
      }

      // --- TECHNOLOGY 2: 3D SHELL CASING POOL ---
      this.shellGroup = new THREE.Group();
      this.scene.add(this.shellGroup);

      const shellGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.8, 5);
      const shellMat = new THREE.MeshStandardMaterial({
        color: 0xeab308, // Bright brass gold
        metalness: 0.9,
        roughness: 0.15
      });
      
      this.shellPool = [];
      for (let i = 0; i < 80; i++) {
        this.shellPool.push({
          active: false,
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0,
          rx: 0, ry: 0, rz: 0,
          rotSpeedX: 0, rotSpeedY: 0, rotSpeedZ: 0,
          life: 0
        });
      }

      // --- TECHNOLOGY 2 CONTINUED: MUZZLE SMOKE POOL ---
      this.smokeGroup = new THREE.Group();
      this.scene.add(this.smokeGroup);

      const smokeGeo = new THREE.SphereGeometry(3.5, 5, 5);
      this.smokePool = [];
      for (let i = 0; i < 35; i++) {
        const smokeMat = new THREE.MeshBasicMaterial({
          color: 0xe2e8f0,
          transparent: true,
          opacity: 0.0,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(smokeGeo, smokeMat);
        mesh.visible = false;
        this.smokeGroup.add(mesh);
        this.smokePool.push({
          mesh,
          active: false,
          vx: 0, vy: 0, vz: 0,
          life: 0,
          maxLife: 0
        });
      }

      // --- REWOLUCJA SPARK EFFECT SYSTEM (3D High-Impact Sparks Pool) ---
      this.sparksGroup = new THREE.Group();
      this.scene.add(this.sparksGroup);

      const sparkGeo = new THREE.BoxGeometry(4.0, 0.8, 0.8);
      this.sparksPool = [];
      for (let i = 0; i < 180; i++) {
        const sparkMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 1.0,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(sparkGeo, sparkMat);
        mesh.visible = false;
        this.sparksGroup.add(mesh);
        this.sparksPool.push({
          mesh,
          active: false,
          vx: 0, vy: 0, vz: 0,
          life: 0,
          maxLife: 0
        });
      }

      // --- REWOLUCJA ENEMY DEATH DEBRIS POOL (CHUNKS / SHRAPNEL / PAPERS) ---
      this.debrisGroup = new THREE.Group();
      this.scene.add(this.debrisGroup);

      const chunkGeo = new THREE.BoxGeometry(4.5, 4.5, 4.5);
      this.debrisPool = [];
      for (let i = 0; i < 90; i++) {
        const chunkMat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          roughness: 0.6,
          metalness: 0.1
        });
        const mesh = new THREE.Mesh(chunkGeo, chunkMat);
        mesh.castShadow = true;
        mesh.visible = false;
        this.debrisGroup.add(mesh);
        this.debrisPool.push({
          mesh,
          active: false,
          vx: 0, vy: 0, vz: 0,
          rx: 0, ry: 0, rz: 0,
          rotSpeedX: 0, rotSpeedY: 0, rotSpeedZ: 0,
          life: 0,
          maxLife: 0,
          isOil: false
        });
      }

      // --- VISUAL MUZZLE FLASH STARBURST MODEL ---
      const flashGroup = new THREE.Group();
      const flashMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.95,
        depthWrite: false
      });
      
      const coreGeo = new THREE.SphereGeometry(3.0, 6, 6);
      const core = new THREE.Mesh(coreGeo, flashMat);
      flashGroup.add(core);

      const flareGeo = new THREE.ConeGeometry(2.0, 16.0, 4);
      flareGeo.translate(0, 8.0, 0);
      
      const directions = [
        [0, 0, Math.PI / 2],      // right
        [0, 0, -Math.PI / 2],     // left
        [0, 0, 0],                // forward
        [0, 0, Math.PI]           // backward
      ];
      directions.forEach(([rx, ry, rz]) => {
        const f = new THREE.Mesh(flareGeo, flashMat);
        f.rotation.set(rx, ry, rz);
        f.scale.set(0.6, 1.0, 0.6);
        flashGroup.add(f);
      });

      const fMega = new THREE.Mesh(flareGeo, flashMat);
      fMega.rotation.set(0, 0, -Math.PI / 2);
      fMega.scale.set(1.4, 2.0, 1.4);
      flashGroup.add(fMega);

      this.muzzleFlashMesh = flashGroup;
      this.muzzleFlashMesh.visible = false;
      this.scene.add(this.muzzleFlashMesh);
      this.muzzleFlashTimer = 0;
    },

    // Splat detailed organic blood onto the transparent overlay floor canvas
    spawnBloodSplatter(worldX, worldY, isDeath = false) {
      if (!this.goreCtx || !this.textures.gore) return;

      // Map world coordinates (0 to 3800) to Gore Canvas (0 to 2048)
      const cx = (worldX / 3800) * 2048;
      const cy = (worldY / 3800) * 2048;

      const ctx = this.goreCtx;

      ctx.save();

      // Main Splat Core
      const rad = (isDeath ? 18 : 8) + Math.random() * (isDeath ? 14 : 7);
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, rad);
      const rColor = Math.random() > 0.45 ? "rgba(153, 27, 27, 0.95)" : "rgba(185, 28, 28, 0.92)";
      grad.addColorStop(0, rColor);
      grad.addColorStop(0.7, "rgba(127, 29, 29, 0.85)");
      grad.addColorStop(1, "rgba(127, 29, 29, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();

      // Exploding splash drops
      const drops = isDeath ? 14 : 6;
      for (let i = 0; i < drops; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = (0.25 + Math.random() * 0.75) * (rad * (isDeath ? 3.8 : 2.5));
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const pSize = 1.2 + Math.random() * (isDeath ? 4.8 : 2.8);

        // Splat connector trails back to center
        if (Math.random() > 0.45) {
          ctx.strokeStyle = rColor;
          ctx.lineWidth = pSize * 0.65;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * (dist * 0.35), cy + Math.sin(angle) * (dist * 0.35));
          ctx.lineTo(px, py);
          ctx.stroke();
        }

        ctx.fillStyle = rColor;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      this.textures.gore.needsUpdate = true;
    },

    spawnBlood(x, y) {
      // Draw to the persistent canvas
      this.spawnBloodSplatter(x, y, false);

      // Legacy Micro-particles
      for (let b of this.bloodPool) {
        if (!b.active) {
          b.active = true;
          b.mesh.position.set(x, -y, 0.15);
          b.mesh.rotation.z = Math.random() * Math.PI * 2;
          const s = 0.5 + Math.random() * 0.8;
          b.mesh.scale.set(s, s, 1);
          b.mesh.visible = true;
          b.life = 10.0;
          break;
        }
      }
    },

    spawnShellCasing(playerX, playerY, playerAngle) {
      if (!this.shellPool) return;
      for (let s of this.shellPool) {
        if (!s.active) {
          s.active = true;
          
          const forwardX = Math.cos(playerAngle);
          const forwardY = -Math.sin(playerAngle);
          const rightX = Math.sin(playerAngle);
          const rightY = Math.cos(playerAngle);

          // Spawn coordinates
          s.x = playerX + forwardX * 12 + rightX * 6;
          s.y = -playerY + forwardY * 12 + rightY * 6;
          s.z = 16;

          // Eject sideways/backwards relative to player direction
          const ejectAngle = playerAngle + Math.PI / 2 + (Math.random() - 0.5) * 0.42;
          const speed = 45 + Math.random() * 25;
          s.vx = Math.cos(ejectAngle) * speed;
          s.vy = -Math.sin(ejectAngle) * speed;
          s.vz = 32 + Math.random() * 28;

          // Rapid tumbling rotation
          s.rx = Math.random() * Math.PI;
          s.ry = Math.random() * Math.PI;
          s.rz = Math.random() * Math.PI;
          s.rotSpeedX = 16 + Math.random() * 18;
          s.rotSpeedY = 16 + Math.random() * 18;
          s.rotSpeedZ = 16 + Math.random() * 18;

          s.life = 3.5;
          break;
        }
      }
    },

    spawnMuzzleSmoke(playerX, playerY, playerAngle) {
      if (!this.smokePool) return;
      for (let sm of this.smokePool) {
        if (!sm.active) {
          sm.active = true;

          const forwardX = Math.cos(playerAngle);
          const forwardY = -Math.sin(playerAngle);

          // Spawn at weapon barrel tip
          sm.mesh.position.set(
            playerX + forwardX * 24,
            -playerY + forwardY * 24,
            18
          );

          // Blow outward
          const speed = 16 + Math.random() * 14;
          const driftAngle = playerAngle + (Math.random() - 0.5) * 0.45;
          sm.vx = Math.cos(driftAngle) * speed;
          sm.vy = -Math.sin(driftAngle) * speed;
          sm.vz = 4 + Math.random() * 6;

          sm.life = 0.45 + Math.random() * 0.35;
          sm.maxLife = sm.life;
          sm.mesh.scale.set(1.0, 1.0, 1.0);
          sm.mesh.material.opacity = 0.6;
          sm.mesh.visible = true;
          break;
        }
      }
    },

    spawnSparks(worldX, worldY, worldZ, count, colHex = 0xf59e0b) {
      if (!this.sparksPool) return;
      let spawned = 0;
      for (let s of this.sparksPool) {
        if (!s.active) {
          s.active = true;
          s.mesh.position.set(worldX, -worldY, worldZ);
          
          // Velocity flying in 3D
          const angle = Math.random() * Math.PI * 2;
          const speed2D = 60 + Math.random() * 120;
          s.vx = Math.cos(angle) * speed2D;
          s.vy = Math.sin(angle) * speed2D;
          s.vz = 40 + Math.random() * 100;

          s.life = 0.22 + Math.random() * 0.38;
          s.maxLife = s.life;
          s.mesh.material.color.setHex(colHex);
          s.mesh.material.opacity = 1.0;
          s.mesh.scale.set(1.0, 1.0, 1.0);
          s.mesh.visible = true;

          spawned++;
          if (spawned >= count) break;
        }
      }
    },

    spawnEnemyDebris(worldX, worldY, enemyType, isBoss) {
      if (!this.debrisPool) return;
      
      let count = isBoss ? 24 : 8;
      let color = 0x22c55e; // Green zombie meat default
      let isOil = false;

      if (isBoss) {
        color = 0xef4444; // Boss red metal / oil
        isOil = true;
      } else if (enemyType === 'klaus') {
        color = 0x64748b; // Auditor gray chunks
      } else if (enemyType === 'paper' || enemyType === 'document') {
        color = 0xf8fafc; // Paper white flying pages
      } else if (enemyType === 'oil' || enemyType === 'barrel') {
        color = 0xf59e0b; // Yellow oil
        isOil = true;
      }

      let spawned = 0;
      for (let d of this.debrisPool) {
        if (!d.active) {
          d.active = true;
          
          const ox = (Math.random() - 0.5) * 8;
          const oy = (Math.random() - 0.5) * 8;
          d.mesh.position.set(worldX + ox, -worldY + oy, 10 + Math.random() * 12);

          const s = (0.55 + Math.random() * 0.9) * (isBoss ? 1.6 : 0.9);
          d.mesh.scale.set(s, s, s);

          d.mesh.material.color.setHex(color);
          if (isOil) {
            d.mesh.material.metalness = 0.85;
            d.mesh.material.roughness = 0.2;
          } else {
            d.mesh.material.metalness = 0.1;
            d.mesh.material.roughness = 0.7;
          }

          const angle = Math.random() * Math.PI * 2;
          const speed = (isBoss ? 80 : 45) + Math.random() * (isBoss ? 110 : 65);
          d.vx = Math.cos(angle) * speed;
          d.vy = Math.sin(angle) * speed;
          d.vz = 50 + Math.random() * 70;

          d.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          d.rotSpeedX = 8 + Math.random() * 14;
          d.rotSpeedY = 8 + Math.random() * 14;
          d.rotSpeedZ = 8 + Math.random() * 14;

          d.life = 1.1 + Math.random() * 1.4;
          d.maxLife = d.life;
          d.mesh.visible = true;

          spawned++;
          if (spawned >= count) break;
        }
      }
    },

    triggerMuzzleFlash(playerX, playerY, playerAngle, latestProj) {
      const forwardX = Math.cos(playerAngle);
      const forwardY = -Math.sin(playerAngle);
      const muzzleX = playerX + forwardX * 24;
      const muzzleY = -playerY + forwardY * 24;
      const muzzleZ = 18;

      let color = 0xfef08a; // Warm yellow/orange default
      if (latestProj) {
        if (latestProj.type === 'laser') color = 0xef4444;
        else if (latestProj.type === 'foam') color = 0x38bdf8;
        else if (latestProj.type === 'gas_cloud') color = 0x10b981;
      }

      if (this.muzzleLight) {
        this.muzzleLight.color.setHex(color);
        this.muzzleLight.position.set(muzzleX, muzzleY, muzzleZ);
        this.muzzleLight.intensity = 16.0; // High intensity flash!
      }

      if (this.muzzleFlashMesh) {
        this.muzzleFlashMesh.position.set(muzzleX, muzzleY, muzzleZ);
        this.muzzleFlashMesh.rotation.z = -playerAngle;
        this.muzzleFlashMesh.scale.set(1.0, 1.0, 1.0);
        this.muzzleFlashMesh.visible = true;
        this.muzzleFlashTimer = 0.06; // Fades out in 60ms
      }

      if (this.sparksPool) {
        let spawned = 0;
        for (let s of this.sparksPool) {
          if (!s.active) {
            s.active = true;
            s.mesh.position.set(muzzleX, muzzleY, muzzleZ);
            
            const coneAngle = playerAngle + (Math.random() - 0.5) * 0.42;
            const speed = 130 + Math.random() * 180;
            s.vx = Math.cos(coneAngle) * speed;
            s.vy = -Math.sin(coneAngle) * speed;
            s.vz = (Math.random() - 0.35) * 50;

            s.life = 0.08 + Math.random() * 0.14;
            s.maxLife = s.life;
            s.mesh.material.color.setHex(color);
            s.mesh.material.opacity = 1.0;
            s.mesh.scale.set(1.6, 0.8, 0.8);
            s.mesh.visible = true;

            spawned++;
            if (spawned >= 8) break;
          }
        }
      }
    },

    syncRacks(obstacles) {
      if (!obstacles || !this.racksBatch) return;
      const count = Math.min(obstacles.length, 180);
      
      this.racksBatch.count = count;
      this.palletsBatch.count = count;
      this.boxesBatch.count = count;

      for (let i = 0; i < count; i++) {
        const obs = obstacles[i];
        const w = obs.width || 60;
        const h = obs.height || 60;
        const rackH = 65;

        // 1. Base Rack Uprights & Beams
        this.dummyPosition.set(obs.x + w/2, -(obs.y + h/2), rackH/2);
        this.dummyScale.set(w, h, rackH);
        this.dummyQuaternion.identity();
        this.dummyMatrix.compose(this.dummyPosition, this.dummyQuaternion, this.dummyScale);
        this.racksBatch.setMatrixAt(i, this.dummyMatrix);

        // 2. Weathered EPAL Pallet Stack inside rack
        this.dummyPosition.set(obs.x + w/2, -(obs.y + h/2), rackH + 6);
        this.dummyScale.set(w * 0.85, h * 0.85, 12);
        this.dummyMatrix.compose(this.dummyPosition, this.dummyQuaternion, this.dummyScale);
        this.palletsBatch.setMatrixAt(i, this.dummyMatrix);

        // 3. Cardboard shipping boxes with DTA/DHL labels & barcodes
        this.dummyPosition.set(obs.x + w/2, -(obs.y + h/2), rackH + 24);
        this.dummyScale.set(w * 0.72, h * 0.72, 24);
        this.dummyMatrix.compose(this.dummyPosition, this.dummyQuaternion, this.dummyScale);
        this.boxesBatch.setMatrixAt(i, this.dummyMatrix);
      }

      this.racksBatch.instanceMatrix.needsUpdate = true;
      this.palletsBatch.instanceMatrix.needsUpdate = true;
      this.boxesBatch.instanceMatrix.needsUpdate = true;
    },

    syncBarrels(adrBarrels) {
      if (!adrBarrels || !this.barrelsBatch) return;
      let count = 0;
      this.dummyRotation.set(Math.PI / 2, 0, 0);
      this.dummyQuaternion.setFromEuler(this.dummyRotation);

      for (let i = 0; i < adrBarrels.length; i++) {
        const b = adrBarrels[i];
        if (!b.active || count >= 100) continue;

        this.dummyPosition.set(b.x, -b.y, 13);
        this.dummyScale.set(1, 1, 1);
        this.dummyMatrix.compose(this.dummyPosition, this.dummyQuaternion, this.dummyScale);
        this.barrelsBatch.setMatrixAt(count, this.dummyMatrix);

        let col = 0xef4444; // Class 3 Flammable
        if (b.type === "acid") col = 0x84cc16; // Toxic Corrosive
        else if (b.type === "oil") col = 0xf59e0b; // Amber Petroleum
        this.dummyColor.setHex(col);
        this.barrelsBatch.setColorAt(count, this.dummyColor);

        count++;
      }

      this.barrelsBatch.count = count;
      this.barrelsBatch.instanceMatrix.needsUpdate = true;
      if (this.barrelsBatch.instanceColor) this.barrelsBatch.instanceColor.needsUpdate = true;
    },

    syncPickups(dropItems, gameTime) {
      if (!dropItems || !this.pickupsBatch) return;
      let count = 0;

      for (let i = 0; i < dropItems.length; i++) {
        const item = dropItems[i];
        if (count >= 80) break;

        const bob = Math.sin(gameTime * 4 + i) * 3 + 10;
        this.dummyRotation.set(Math.sin(gameTime * 2 + i) * 0.25, 0, gameTime * 2.8 + i);
        this.dummyQuaternion.setFromEuler(this.dummyRotation);

        this.dummyPosition.set(item.x, -item.y, bob);
        this.dummyScale.set(1, 1, 1);
        this.dummyMatrix.compose(this.dummyPosition, this.dummyQuaternion, this.dummyScale);
        this.pickupsBatch.setMatrixAt(count, this.dummyMatrix);

        let col = 0x38bdf8;
        if (item.type === 'medkit') col = 0xef4444;
        else if (item.type === 'battery') col = 0x22c55e;
        else if (item.type === 'coffee') col = 0x78350f;
        this.dummyColor.setHex(col);
        this.pickupsBatch.setColorAt(count, this.dummyColor);

        count++;
      }

      this.pickupsBatch.count = count;
      this.pickupsBatch.instanceMatrix.needsUpdate = true;
      if (this.pickupsBatch.instanceColor) this.pickupsBatch.instanceColor.needsUpdate = true;
    },

    syncShells(dt) {
      if (!this.shellPool || !this.shellsBatch) return;
      let count = 0;

      for (let i = 0; i < this.shellPool.length; i++) {
        const s = this.shellPool[i];
        if (!s.active || count >= 100) continue;

        s.life -= dt;
        if (s.life <= 0) {
          s.active = false;
          continue;
        }

        // Apply 3D physics
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.z += s.vz * dt;
        s.vz -= 680 * dt; // Gravity

        // Bounce on warehouse floor
        if (s.z <= 0.8) {
          s.z = 0.8;
          s.vz = -s.vz * 0.45;
          s.vx *= 0.72;
          s.vy *= 0.72;
          s.rotSpeedX *= 0.55;
          s.rotSpeedY *= 0.55;
          s.rotSpeedZ *= 0.55;
        }

        s.rx += s.rotSpeedX * dt;
        s.ry += s.rotSpeedY * dt;
        s.rz += s.rotSpeedZ * dt;

        this.dummyRotation.set(s.rx, s.ry, s.rz);
        this.dummyQuaternion.setFromEuler(this.dummyRotation);

        this.dummyPosition.set(s.x, s.y, s.z);
        this.dummyScale.set(1, 1, 1);
        this.dummyMatrix.compose(this.dummyPosition, this.dummyQuaternion, this.dummyScale);
        this.shellsBatch.setMatrixAt(count, this.dummyMatrix);

        count++;
      }

      this.shellsBatch.count = count;
      this.shellsBatch.instanceMatrix.needsUpdate = true;
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
      const headMat = new THREE.MeshStandardMaterial({ color: isBoss ? 0xb91c1c : 0x166534, roughness: 0.6 });
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

      // Arms reaching out forward (Zombie grasp pose)
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

      // Detect newly spawned projectiles to trigger Technology 2 Shell Casing, Smoke Ejection, & Muzzle Flash
      if (this.lastProjectileCount === undefined) this.lastProjectileCount = 0;
      if (projectiles.length > this.lastProjectileCount) {
        const newCount = projectiles.length - this.lastProjectileCount;
        for (let i = 0; i < Math.min(4, newCount); i++) {
          this.spawnShellCasing(player.x, player.y, player.angle);
          this.spawnMuzzleSmoke(player.x, player.y, player.angle);
        }
        // Trigger high-impact dynamic 3D muzzle flash & directed muzzle sparks
        this.triggerMuzzleFlash(player.x, player.y, player.angle, projectiles[projectiles.length - 1]);
      }
      this.lastProjectileCount = projectiles.length;

      // 1. AUTO-SCALING TOP-DOWN CRIMSONLAND CAMERA
      const speed = Math.hypot(player.vx || 0, player.vy || 0);
      const enemyCount = enemies.length;

      // Dynamic Auto-Zoom: expands smoothly when driving fast or fighting massive hordes
      let targetZoom = this.baseCameraZoom;
      if (this.autoScalingEnabled) {
        const speedExpansion = Math.min(80, speed * 0.22);
        const densityExpansion = Math.min(60, enemyCount * 0.75);
        targetZoom = this.baseCameraZoom + speedExpansion + densityExpansion;
      }

      // Smooth camera altitude lerp
      this.currentCameraZoom += (targetZoom - this.currentCameraZoom) * Math.min(1.0, dt * 4.5);
      this.cameraZoom = this.currentCameraZoom;

      // Center camera using spectacular isometric offset
      const shakeX = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.0;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.5;

      this.camera.position.set(
        player.x + shakeX,
        -player.y - 195 + shakeY,
        this.currentCameraZoom * 0.9 + shakeZ
      );
      this.camera.lookAt(player.x, -player.y, 15);

      // Flashing Alarm Warning Sirens / Alarms Animation
      if (this.sirenLights) {
        this.sirenLights.forEach((siren, idx) => {
          const speed = 7.0 + idx * 1.5;
          siren.intensity = 3.2 + Math.sin(gameTime * speed) * 3.2;
        });
      }

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
        } else {
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      });

      // Cleanup dead enemy meshes + Trigger Crimsonland Puddle Splatters on Death
      for (const [id, mesh] of this.enemyMeshes.entries()) {
        if (!activeEnemyIds.has(id)) {
          // Splat persistent death gore on the dynamic canvas!
          this.spawnBloodSplatter(mesh.position.x, -mesh.position.y, true);

          // Spawn high-impact 3D physics debris chunks (green zombie guts, grey paper sheets, red metal)
          this.spawnEnemyDebris(mesh.position.x, -mesh.position.y, mesh.enemyType, mesh.isBoss);

          this.enemiesGroup.remove(mesh);
          this.enemyMeshes.delete(id);
        }
      }

      // --- TECHNOLOGY 3: STRETCHED glowing NEON PROJECTILE TRACERS ---
      const activeProjIds = new Set();
      projectiles.forEach((p, idx) => {
        const id = p.id || ("proj_" + idx);
        activeProjIds.add(id);

        let mesh = this.projectileMeshes.get(id);
        if (!mesh) {
          // Stretched tracer geometry aligned along the travel vector (elongated box)
          let geo = new THREE.BoxGeometry(16, 2.2, 2.2);
          let col = 0xfacc15;
          if (p.type === 'laser') col = 0xef4444;
          else if (p.type === 'foam') col = 0x38bdf8;
          else if (p.type === 'gas_cloud') col = 0x10b981;

          // Self-glowing material
          mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col }));
          this.projectilesGroup.add(mesh);
          this.projectileMeshes.set(id, mesh);
        }
        mesh.position.set(p.x, -p.y, 14);

        // Align tracer rotation with its flying direction
        const angle = Math.atan2(-(p.vy || 0), p.vx || 0);
        mesh.rotation.z = angle;

        // Size pulsing glow animation
        const pulse = 1.0 + Math.sin(gameTime * 35 + idx) * 0.15;
        mesh.scale.set(pulse, pulse, pulse);
      });

      for (const [id, mesh] of this.projectileMeshes.entries()) {
        if (!activeProjIds.has(id)) {
          this.projectilesGroup.remove(mesh);
          this.projectileMeshes.delete(id);
        }
      }

      // 6. BATCHED 3D PICKUPS & 3D CASING PHYSICS
      this.syncPickups(dropItems, gameTime);
      this.syncShells(dt);

      if (this.smokePool) {
        this.smokePool.forEach(sm => {
          if (!sm.active) return;

          sm.life -= dt;
          if (sm.life <= 0) {
            sm.active = false;
            sm.mesh.visible = false;
            return;
          }

          // Smoke rise and expand
          sm.mesh.position.x += sm.vx * dt;
          sm.mesh.position.y += sm.vy * dt;
          sm.mesh.position.z += sm.vz * dt;

          const progress = 1.0 - (sm.life / sm.maxLife);
          const currentScale = 1.0 + progress * 2.5;
          sm.mesh.scale.set(currentScale, currentScale, currentScale);
          sm.mesh.material.opacity = 0.55 * (1.0 - progress);
        });
      }

      // --- REWOLUCJA PHYSICS FOR 3D SPARKS ---
      if (this.sparksPool) {
        this.sparksPool.forEach(s => {
          if (!s.active) return;

          s.life -= dt;
          if (s.life <= 0) {
            s.active = false;
            s.mesh.visible = false;
            return;
          }

          s.mesh.position.x += s.vx * dt;
          s.mesh.position.y += s.vy * dt;
          s.mesh.position.z += s.vz * dt;

          const speed = Math.hypot(s.vx, s.vy);
          if (speed > 1.0) {
            s.mesh.rotation.z = Math.atan2(s.vy, s.vx);
          }

          s.vz -= 180 * dt; // Gravity

          // Spark ground bounce
          if (s.mesh.position.z <= 0.4) {
            s.mesh.position.z = 0.4;
            s.vz = -s.vz * 0.35;
            s.vx *= 0.65;
            s.vy *= 0.65;
          }

          s.mesh.material.opacity = s.life / s.maxLife;
        });
      }

      // --- REWOLUCJA PHYSICS FOR ENEMY DEBRIS ---
      if (this.debrisPool) {
        this.debrisPool.forEach(d => {
          if (!d.active) return;

          d.life -= dt;
          if (d.life <= 0) {
            d.active = false;
            d.mesh.visible = false;
            return;
          }

          d.mesh.position.x += d.vx * dt;
          d.mesh.position.y += d.vy * dt;
          d.mesh.position.z += d.vz * dt;

          d.mesh.rotation.x += d.rotSpeedX * dt;
          d.mesh.rotation.y += d.rotSpeedY * dt;
          d.mesh.rotation.z += d.rotSpeedZ * dt;

          d.vz -= 220 * dt; // Gravity

          // Ground bounce & friction
          if (d.mesh.position.z <= 2.2) {
            d.mesh.position.z = 2.2;
            d.vz = -d.vz * 0.38;
            d.vx *= 0.62;
            d.vy *= 0.62;
            d.rotSpeedX *= 0.65;
            d.rotSpeedY *= 0.65;
            d.rotSpeedZ *= 0.65;

            // Occasionally splat a permanent drops of blood/oil on bounce
            if (Math.abs(d.vz) > 12.0 && Math.random() < 0.45) {
              this.spawnBloodSplatter(d.mesh.position.x, -d.mesh.position.y, false);
            }
          }

          if (d.life < 0.3) {
            const scale = d.life / 0.3;
            d.mesh.scale.set(scale, scale, scale);
          }
        });
      }

      // --- DECAY MUZZLE FLASH LIGHT AND CONE STARBURST ---
      if (this.muzzleLight && this.muzzleLight.intensity > 0) {
        this.muzzleLight.intensity -= dt * 140; // ultra fast decay
        if (this.muzzleLight.intensity < 0) this.muzzleLight.intensity = 0;
      }

      if (this.muzzleFlashTimer > 0) {
        this.muzzleFlashTimer -= dt;
        if (this.muzzleFlashTimer <= 0) {
          if (this.muzzleFlashMesh) this.muzzleFlashMesh.visible = false;
        } else {
          const scale = this.muzzleFlashTimer / 0.06;
          if (this.muzzleFlashMesh) this.muzzleFlashMesh.scale.set(scale, scale, scale);
        }
      }

      // Render Three.js Scene
      this.renderer.render(this.scene, this.camera);
    }
  };

  window.Engine3D = Engine3D;
})(window);
