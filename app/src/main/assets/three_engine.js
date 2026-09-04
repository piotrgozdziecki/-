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
    cameraZoom: 380,
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
        let testCtx = null;
        try {
          testCtx = canvas.getContext("webgl2", { powerPreference: "high-performance", antialias: true }) ||
                    canvas.getContext("webgl", { powerPreference: "high-performance", antialias: true }) ||
                    canvas.getContext("experimental-webgl");
        } catch (ctxErr) {
          console.warn("WebGL context acquisition failed:", ctxErr);
          return false;
        }

        if (!testCtx) {
          console.warn("WebGL not supported in current environment; falling back to 2D engine");
          return false;
        }

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
            precision: 'highp',
            stencil: false,
            depth: true
          });
        } catch (e1) {
          console.warn("High-precision WebGLRenderer fallback:", e1);
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
        this.renderer.toneMappingExposure = 1.35;

        // 3. 3D Scene with Industrial Atmospheric Fog
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060c18);
        this.scene.fog = new THREE.FogExp2(0x020617, 0.0032);

        // 4. Tactical High-Angle Isometric Perspective Camera (52 deg pitch)
        this.camera = new THREE.PerspectiveCamera(46, width / height, 10, 8000);
        this.camera.position.set(1900, -2350, 640);
        this.camera.lookAt(1900, -1860, 0);

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
      this.cameraZoom = Math.max(250, Math.min(520, parseInt(zoomVal, 10) || 380));
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

      // 4. Procedural High-Gloss Blood Splatter Decal
      const cvsBlood = document.createElement("canvas");
      cvsBlood.width = 128;
      cvsBlood.height = 128;
      const ctxBl = cvsBlood.getContext("2d");
      ctxBl.fillStyle = "#ffffff";
      // Central pool
      ctxBl.beginPath();
      ctxBl.arc(64, 64, 42, 0, Math.PI * 2);
      ctxBl.fill();
      // Satellite droplets
      for (let i = 0; i < 18; i++) {
        const ang = Math.random() * Math.PI * 2;
        const rad = 35 + Math.random() * 25;
        const size = 3 + Math.random() * 8;
        ctxBl.beginPath();
        ctxBl.arc(64 + Math.cos(ang) * rad, 64 + Math.sin(ang) * rad, size, 0, Math.PI * 2);
        ctxBl.fill();
      }
      const bloodTex = new THREE.CanvasTexture(cvsBlood);
      this.textures.blood = bloodTex;
    },

    initSharedAssets() {
      // High-End PBR Materials
      this.materials.epoxyFloor = new THREE.MeshStandardMaterial({
        color: 0x223046,
        roughness: 0.18,
        metalness: 0.20,
        map: this.textures.floor
      });

      this.materials.toyotaOrange = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.28,
        metalness: 0.35
      });

      this.materials.counterweight = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.65,
        metalness: 0.55
      });

      this.materials.chrome = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.12,
        metalness: 0.95
      });

      this.materials.darkSteel = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.45,
        metalness: 0.70
      });

      this.materials.rubberTire = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.85,
        metalness: 0.05
      });

      this.materials.rackBlue = new THREE.MeshStandardMaterial({
        color: 0x1e40af,
        roughness: 0.35,
        metalness: 0.50
      });

      this.materials.rackOrange = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.40,
        metalness: 0.35
      });

      this.materials.woodPallet = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.75,
        metalness: 0.05,
        map: this.textures.wood
      });

      this.materials.cardboardBox = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.75,
        metalness: 0.02,
        map: this.textures.box
      });

      this.materials.whiteStretchWrap = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.15,
        metalness: 0.15,
        transparent: true,
        opacity: 0.82
      });

      this.materials.highVisOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        roughness: 0.45,
        metalness: 0.10
      });

      this.materials.highVisYellow = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.40,
        metalness: 0.15
      });

      this.materials.retroReflective = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });

      this.materials.beaconOrange = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.90
      });

      this.materials.headlightBeam = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.25,
        depthWrite: false
      });
    },

    // --- 3D LIGHTING SETUP ---
    initLighting() {
      // 1. Ambient Dark Warehouse Fill
      this.ambientLight = new THREE.AmbientLight(0x1e293b, 0.85);
      this.scene.add(this.ambientLight);

      // 2. Main Overhead High-Bay Industrial Sodium / LED Luminaire (Key Shadow Caster)
      this.dirLight = new THREE.DirectionalLight(0xfff8ee, 1.45);
      this.dirLight.position.set(2100, -2500, 1400);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 2048;
      this.dirLight.shadow.mapSize.height = 2048;
      this.dirLight.shadow.camera.near = 100;
      this.dirLight.shadow.camera.far = 4000;
      this.dirLight.shadow.camera.left = -900;
      this.dirLight.shadow.camera.right = 900;
      this.dirLight.shadow.camera.top = 900;
      this.dirLight.shadow.camera.bottom = -900;
      this.dirLight.shadow.bias = -0.0008;
      this.scene.add(this.dirLight);
      this.scene.add(this.dirLight.target);

      // 3. Forklift Headlights (Twin Halogen SpotLights)
      this.headlightLeft = new THREE.SpotLight(0xfef08a, 4.5, 800, Math.PI / 4.8, 0.45, 1.1);
      this.headlightLeft.castShadow = true;
      this.headlightLeft.shadow.mapSize.width = 1024;
      this.headlightLeft.shadow.mapSize.height = 1024;
      this.headlightLeft.shadow.bias = -0.001;

      this.headlightRight = new THREE.SpotLight(0xfef08a, 4.5, 800, Math.PI / 4.8, 0.45, 1.1);
      this.headlightRight.castShadow = true;
      this.headlightRight.shadow.mapSize.width = 1024;
      this.headlightRight.shadow.mapSize.height = 1024;
      this.headlightRight.shadow.bias = -0.001;

      this.scene.add(this.headlightLeft);
      this.scene.add(this.headlightLeft.target);
      this.scene.add(this.headlightRight);
      this.scene.add(this.headlightRight.target);

      // 4. Strobe Safety Beacon on Forklift Roof
      this.beaconLight = new THREE.PointLight(0xf59e0b, 2.8, 420, 1.2);
      this.scene.add(this.beaconLight);
    },

    // --- 3D WAREHOUSE FLOOR ---
    createWarehouseFloor() {
      const floorGeo = new THREE.PlaneGeometry(5000, 5000);
      const floor = new THREE.Mesh(floorGeo, this.materials.epoxyFloor);
      floor.position.set(1900, -1900, 0);
      floor.receiveShadow = true;
      this.scene.add(floor);
      this.floorMesh = floor;

      // Warehouse High Perimeter Walls
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.3 });
      const wallNorthGeo = new THREE.BoxGeometry(5000, 60, 450);
      const wallNorth = new THREE.Mesh(wallNorthGeo, wallMat);
      wallNorth.position.set(1900, 50, 225);
      wallNorth.castShadow = true;
      wallNorth.receiveShadow = true;
      this.scene.add(wallNorth);

      const wallSouth = new THREE.Mesh(wallNorthGeo, wallMat);
      wallSouth.position.set(1900, -3850, 225);
      wallSouth.castShadow = true;
      this.scene.add(wallSouth);

      const wallWestGeo = new THREE.BoxGeometry(60, 4000, 450);
      const wallWest = new THREE.Mesh(wallWestGeo, wallMat);
      wallWest.position.set(-50, -1900, 225);
      wallWest.castShadow = true;
      this.scene.add(wallWest);

      const wallEast = new THREE.Mesh(wallWestGeo, wallMat);
      wallEast.position.set(3850, -1900, 225);
      wallEast.castShadow = true;
      this.scene.add(wallEast);
    },

    // --- 3D PLAYER MODEL (FORKLIFT + ON-FOOT WORKER) ---
    createPlayerModel() {
      this.playerGroup = new THREE.Group();
      this.scene.add(this.playerGroup);

      // 1. FORKLIFT GROUP (Toyota BT Reflex Industrial Reach Truck)
      this.forkliftGroup = new THREE.Group();
      this.playerGroup.add(this.forkliftGroup);

      // Main Chassis Body (Toyota Orange)
      const bodyGeo = new THREE.BoxGeometry(38, 26, 20);
      const body = new THREE.Mesh(bodyGeo, this.materials.toyotaOrange);
      body.position.set(-4, 0, 14);
      body.castShadow = true;
      body.receiveShadow = true;
      this.forkliftGroup.add(body);

      // Heavy Rear Counterweight (Dark Steel)
      const cwGeo = new THREE.BoxGeometry(16, 26, 24);
      const cw = new THREE.Mesh(cwGeo, this.materials.counterweight);
      cw.position.set(-20, 0, 15);
      cw.castShadow = true;
      this.forkliftGroup.add(cw);

      // ROPS Safety Roll Cage (Dark Steel Beams)
      const cageGeo = new THREE.CylinderGeometry(1.2, 1.2, 38, 8);
      [[-18, -11], [-18, 11], [-2, -11], [-2, 11]].forEach(pos => {
        const pillar = new THREE.Mesh(cageGeo, this.materials.darkSteel);
        pillar.position.set(pos[0], pos[1], 38);
        pillar.castShadow = true;
        this.forkliftGroup.add(pillar);
      });
      // Roof overhead guard
      const roofGeo = new THREE.BoxGeometry(22, 26, 3);
      const roof = new THREE.Mesh(roofGeo, this.materials.darkSteel);
      roof.position.set(-10, 0, 57);
      roof.castShadow = true;
      this.forkliftGroup.add(roof);

      // Orange Rotating Safety Beacon
      const beaconGeo = new THREE.CylinderGeometry(3, 3, 5, 12);
      this.beaconMesh = new THREE.Mesh(beaconGeo, this.materials.beaconOrange);
      this.beaconMesh.position.set(-10, 0, 61);
      this.forkliftGroup.add(this.beaconMesh);

      // Driver Seat & Steering Console
      const seatGeo = new THREE.BoxGeometry(10, 12, 14);
      const seat = new THREE.Mesh(seatGeo, this.materials.rubberTire);
      seat.position.set(-10, 0, 24);
      this.forkliftGroup.add(seat);

      // Steering wheel
      const wheelGeo = new THREE.TorusGeometry(3.5, 0.8, 8, 16);
      const steer = new THREE.Mesh(wheelGeo, this.materials.darkSteel);
      steer.rotation.x = Math.PI / 3;
      steer.position.set(-2, 0, 30);
      this.forkliftGroup.add(steer);

      // Mast Assembly (Twin Chrome Lift Rams & Blue Steel Columns)
      const mastGeo = new THREE.BoxGeometry(4, 3, 52);
      const mastL = new THREE.Mesh(mastGeo, this.materials.rackBlue);
      mastL.position.set(16, -10, 30);
      mastL.castShadow = true;
      this.forkliftGroup.add(mastL);

      const mastR = new THREE.Mesh(mastGeo, this.materials.rackBlue);
      mastR.position.set(16, 10, 30);
      mastR.castShadow = true;
      this.forkliftGroup.add(mastR);

      // Chrome Hydraulic Cylinder
      const ramGeo = new THREE.CylinderGeometry(1.8, 1.8, 46, 12);
      const ram = new THREE.Mesh(ramGeo, this.materials.chrome);
      ram.position.set(16, 0, 28);
      this.forkliftGroup.add(ram);

      // Forged Steel Lifting Forks
      const forkGeo = new THREE.BoxGeometry(26, 3.5, 2.5);
      const forkL = new THREE.Mesh(forkGeo, this.materials.darkSteel);
      forkL.position.set(30, -7, 4);
      forkL.castShadow = true;
      this.forkliftGroup.add(forkL);

      const forkR = new THREE.Mesh(forkGeo, this.materials.darkSteel);
      forkR.position.set(30, 7, 4);
      forkR.castShadow = true;
      this.forkliftGroup.add(forkR);

      // 4 Polyurethane Drive Wheels
      this.forkliftWheels = [];
      const tireGeo = new THREE.CylinderGeometry(5.5, 5.5, 5, 16);
      tireGeo.rotateX(Math.PI / 2);
      [[-18, -13], [-18, 13], [14, -13], [14, 13]].forEach(pos => {
        const tire = new THREE.Mesh(tireGeo, this.materials.rubberTire);
        tire.position.set(pos[0], pos[1], 5.5);
        tire.castShadow = true;
        this.forkliftGroup.add(tire);
        this.forkliftWheels.push(tire);
      });

      // Nitro Boost Exhaust Plume
      const exhaustGeo = new THREE.ConeGeometry(8, 28, 16);
      exhaustGeo.rotateZ(Math.PI / 2);
      const exhaustMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      this.exhaustMesh = new THREE.Mesh(exhaustGeo, exhaustMat);
      this.exhaustMesh.position.set(-42, 0, 14);
      this.forkliftGroup.add(this.exhaustMesh);

      // 2. ON-FOOT WORKER GROUP (Grzesiek / Magazynier)
      this.workerGroup = new THREE.Group();
      this.workerGroup.visible = false;
      this.playerGroup.add(this.workerGroup);

      // Worker Torso in High-Vis Orange Vest
      const torsoGeo = new THREE.BoxGeometry(14, 18, 22);
      const torso = new THREE.Mesh(torsoGeo, this.materials.highVisOrange);
      torso.position.set(0, 0, 22);
      torso.castShadow = true;
      this.workerGroup.add(torso);

      // Silver Retroreflective Stripe on Vest
      const stripeGeo = new THREE.BoxGeometry(14.5, 18.5, 4);
      const stripe = new THREE.Mesh(stripeGeo, this.materials.retroReflective);
      stripe.position.set(0, 0, 22);
      this.workerGroup.add(stripe);

      // Worker Head & Yellow Safety Hardhat
      const headGeo = new THREE.SphereGeometry(6, 12, 12);
      const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 }));
      head.position.set(0, 0, 36);
      this.workerGroup.add(head);

      const hardhatGeo = new THREE.SphereGeometry(7, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const hardhat = new THREE.Mesh(hardhatGeo, this.materials.highVisYellow);
      hardhat.position.set(0, 0, 37);
      this.workerGroup.add(hardhat);

      // Articulated Legs for Stride Animation
      const legGeo = new THREE.BoxGeometry(5, 6, 16);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 });
      this.leftLeg = new THREE.Mesh(legGeo, legMat);
      this.leftLeg.position.set(0, -4.5, 8);
      this.leftLeg.castShadow = true;
      this.workerGroup.add(this.leftLeg);

      this.rightLeg = new THREE.Mesh(legGeo, legMat);
      this.rightLeg.position.set(0, 4.5, 8);
      this.rightLeg.castShadow = true;
      this.workerGroup.add(this.rightLeg);
    },

    // --- 3D COMPANION (KLUSKA) ---
    createKluskaModel() {
      this.kluskaGroup = new THREE.Group();
      this.kluskaGroup.visible = false;
      this.scene.add(this.kluskaGroup);

      const furMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
      // Body
      const bodyGeo = new THREE.CapsuleGeometry(6, 14, 8, 12);
      const body = new THREE.Mesh(bodyGeo, furMat);
      body.rotation.y = Math.PI / 2;
      body.position.set(0, 0, 10);
      body.castShadow = true;
      this.kluskaGroup.add(body);

      // Head & Snout
      const headGeo = new THREE.SphereGeometry(5.5, 12, 12);
      const head = new THREE.Mesh(headGeo, furMat);
      head.position.set(10, 0, 15);
      head.castShadow = true;
      this.kluskaGroup.add(head);

      const snoutGeo = new THREE.BoxGeometry(5, 4, 3.5);
      const snout = new THREE.Mesh(snoutGeo, new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 }));
      snout.position.set(14, 0, 14);
      this.kluskaGroup.add(snout);

      // Wagging Tail
      const tailGeo = new THREE.CylinderGeometry(1.2, 0.8, 10, 8);
      this.kluskaTail = new THREE.Mesh(tailGeo, furMat);
      this.kluskaTail.rotation.z = Math.PI / 4;
      this.kluskaTail.position.set(-10, 0, 12);
      this.kluskaGroup.add(this.kluskaTail);

      // Red Bandana Collar
      const collarGeo = new THREE.TorusGeometry(4.5, 1.2, 6, 12);
      const collar = new THREE.Mesh(collarGeo, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      collar.position.set(8, 0, 14);
      this.kluskaGroup.add(collar);
    },

    // --- 3D HIGH-BAY RACKS & OBSTACLES SYNCHRONIZATION ---
    syncRacks(obstacles) {
      if (!this.racksGroup || !obstacles) return;

      // Clear existing racks to prevent duplicate geometry
      while (this.racksGroup.children.length > 0) {
        const child = this.racksGroup.children[0];
        if (child.geometry) child.geometry.dispose();
        this.racksGroup.remove(child);
      }

      console.log(`🏭 Building ${obstacles.length} PBR High-Bay Warehouse Racks & Props...`);

      obstacles.forEach(obs => {
        const w = obs.w || obs.width || 120;
        const h = obs.h || obs.height || 280;
        const cx = obs.x + w / 2;
        const cy = -obs.y - h / 2;

        if (obs.type === "pallet_stack") {
          // Detailed Wood Pallet Stack
          const stackGroup = new THREE.Group();
          stackGroup.position.set(cx, cy, 0);

          const palletGeo = new THREE.BoxGeometry(w - 6, h - 6, 7);
          const numPallets = 5 + Math.floor(Math.random() * 3);
          for (let k = 0; k < numPallets; k++) {
            const pal = new THREE.Mesh(palletGeo, this.materials.woodPallet);
            pal.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 3.5 + k * 8);
            pal.rotation.z = (Math.random() - 0.5) * 0.08;
            pal.castShadow = true;
            pal.receiveShadow = true;
            stackGroup.add(pal);
          }
          this.racksGroup.add(stackGroup);

        } else if (obs.type === "toitoi_station") {
          // 3D Portable Sanitation Cabin
          const toitoiGroup = new THREE.Group();
          toitoiGroup.position.set(cx, cy, 0);
          const cabinGeo = new THREE.BoxGeometry(w, h, 85);
          const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
          const cabin = new THREE.Mesh(cabinGeo, cabinMat);
          cabin.position.set(0, 0, 42.5);
          cabin.castShadow = true;
          cabin.receiveShadow = true;
          toitoiGroup.add(cabin);

          const roofGeo = new THREE.ConeGeometry(w * 0.7, 18, 4);
          roofGeo.rotateZ(Math.PI / 4);
          const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
          roof.position.set(0, 0, 94);
          toitoiGroup.add(roof);
          this.racksGroup.add(toitoiGroup);

        } else {
          // Multi-Tier High-Bay Industrial Pallet Rack (Apex / Mecalux)
          const rackGroup = new THREE.Group();
          rackGroup.position.set(cx, cy, 0);

          const rackHeight = 160;
          const colW = 6;
          const cx_o = w / 2 - colW / 2;
          const cy_o = h / 2 - colW / 2;

          // 4 Vertical Steel Upright Columns (Mecalux Blue)
          const colGeo = new THREE.BoxGeometry(colW, colW, rackHeight);
          [[-cx_o, -cy_o], [-cx_o, cy_o], [cx_o, -cy_o], [cx_o, cy_o]].forEach(pos => {
            const col = new THREE.Mesh(colGeo, this.materials.rackBlue);
            col.position.set(pos[0], pos[1], rackHeight / 2);
            col.castShadow = true;
            col.receiveShadow = true;
            rackGroup.add(col);
          });

          // Horizontal Safety Beams (Safety Orange) at 3 Height Tiers
          const beamGeoX = new THREE.BoxGeometry(w, 4, 7);
          const beamGeoY = new THREE.BoxGeometry(4, h, 7);
          [35, 85, 135].forEach(zLev => {
            const b1 = new THREE.Mesh(beamGeoX, this.materials.rackOrange);
            b1.position.set(0, -cy_o, zLev);
            b1.castShadow = true;
            rackGroup.add(b1);

            const b2 = new THREE.Mesh(beamGeoX, this.materials.rackOrange);
            b2.position.set(0, cy_o, zLev);
            b2.castShadow = true;
            rackGroup.add(b2);

            const b3 = new THREE.Mesh(beamGeoY, this.materials.rackOrange);
            b3.position.set(-cx_o, 0, zLev);
            b3.castShadow = true;
            rackGroup.add(b3);

            const b4 = new THREE.Mesh(beamGeoY, this.materials.rackOrange);
            b4.position.set(cx_o, 0, zLev);
            b4.castShadow = true;
            rackGroup.add(b4);

            // Stored Goods on Shelf (Euro Pallets + Cardboard Boxes)
            const palGeo = new THREE.BoxGeometry(w - 14, h - 14, 6);
            const pal = new THREE.Mesh(palGeo, this.materials.woodPallet);
            pal.position.set(0, 0, zLev + 3);
            pal.castShadow = true;
            rackGroup.add(pal);

            const boxGeo = new THREE.BoxGeometry(w - 24, h - 24, 28);
            const box = new THREE.Mesh(boxGeo, (Math.random() > 0.4) ? this.materials.cardboardBox : this.materials.whiteStretchWrap);
            box.position.set(0, 0, zLev + 20);
            box.castShadow = true;
            box.receiveShadow = true;
            rackGroup.add(box);
          });

          // Yellow/Black Safety Crash Bollards at Rack Corners
          const bollardGeo = new THREE.CylinderGeometry(4, 4, 25, 12);
          [[-cx_o - 8, -cy_o - 8], [cx_o + 8, -cy_o - 8], [-cx_o - 8, cy_o + 8], [cx_o + 8, cy_o + 8]].forEach(bPos => {
            const bollard = new THREE.Mesh(bollardGeo, this.materials.highVisYellow);
            bollard.position.set(bPos[0], bPos[1], 12.5);
            bollard.castShadow = true;
            rackGroup.add(bollard);
          });

          this.racksGroup.add(rackGroup);
        }
      });
    },

    // --- 3D PARTICLES & GORE POOLS ---
    initParticleSystem() {
      // 1. Spark & Blood Gibs Pool
      this.particleGroup = new THREE.Group();
      this.scene.add(this.particleGroup);

      const sparkGeo = new THREE.BoxGeometry(3, 3, 3);
      this.sparkPool = [];
      for (let i = 0; i < 250; i++) {
        const mesh = new THREE.Mesh(sparkGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
        mesh.visible = false;
        this.particleGroup.add(mesh);
        this.sparkPool.push({
          mesh: mesh,
          active: false,
    cameraZoom: 380,
    vfxGroup: null,
    barrelsGroup: null,
    barrelMeshes: new Map(),
    vfxMeshes: new Map(),
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0,
          life: 0, maxLife: 1.0,
          type: "spark"
        });
      }

      // 2. High-Gloss Floor Blood Decals Pool
      this.bloodDecalGroup = new THREE.Group();
      this.scene.add(this.bloodDecalGroup);

      const decalGeo = new THREE.PlaneGeometry(1, 1);
      const decalMat = new THREE.MeshStandardMaterial({
        map: this.textures.blood,
        transparent: true,
        opacity: 0.90,
        roughness: 0.12,
        metalness: 0.35,
        depthWrite: false
      });

      this.bloodDecalPool = [];
      this.bloodDecalIndex = 0;
      for (let i = 0; i < 180; i++) {
        const mesh = new THREE.Mesh(decalGeo, decalMat.clone());
        mesh.visible = false;
        mesh.receiveShadow = true;
        this.bloodDecalGroup.add(mesh);
        this.bloodDecalPool.push({ mesh: mesh, active: false });
      }
    },

    spawnSparks(x, y, z, count = 14, hexColor = 0xf59e0b) {
      if (!this.sparkPool) return;
      let spawned = 0;
      for (let i = 0; i < this.sparkPool.length && spawned < count; i++) {
        const p = this.sparkPool[i];
        if (!p.active) {
          p.active = true;
          p.type = "spark";
          p.x = x;
          p.y = -y;
          p.z = z || 14;
          const speed = 140 + Math.random() * 260;
          const angle = Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.vz = 90 + Math.random() * 280;
          p.life = 0;
          p.maxLife = 0.35 + Math.random() * 0.45;
          p.mesh.material.color.setHex(hexColor);
          p.mesh.scale.set(1, 1, 1);
          p.mesh.visible = true;
          spawned++;
        }
      }
    },

    spawnBlood(x, y, enemyInfo) {
      if (!this.sparkPool || !this.bloodDecalPool) return;

      let hexColor = 0x881337; // Dark arterial crimson blood
      let radius = 22;
      let particleCount = 24;

      if (enemyInfo) {
        if (enemyInfo.name === "Rolka Folii Strecz" || enemyInfo.name === "Resztka Folii") {
          hexColor = 0xe2e8f0; radius = 26; particleCount = 12;
        } else if (enemyInfo.name === "Zbłąkany Karton B2C" || enemyInfo.name === "Zablokowana Paleta EURO") {
          hexColor = 0x78350f; radius = 32; particleCount = 28;
        } else if (enemyInfo.name === "Wózek z Awarią" || enemyInfo.name === "Mobilna Rampa") {
          hexColor = 0x020617; radius = 38; particleCount = 32; // Black hydraulic oil
        } else if (enemyInfo.isBoss) {
          hexColor = 0x991b1b; radius = 65; particleCount = 70;
        }
      }

      // 1. Flying 3D Gore Gibs
      let spawned = 0;
      for (let i = 0; i < this.sparkPool.length && spawned < particleCount; i++) {
        const p = this.sparkPool[i];
        if (!p.active) {
          p.active = true;
          p.type = "blood";
          p.x = x + (Math.random() - 0.5) * 12;
          p.y = -y + (Math.random() - 0.5) * 12;
          p.z = 16 + Math.random() * 22;
          const speed = 60 + Math.random() * 320;
          const angle = Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.vz = 160 + Math.random() * 380;
          p.life = 0;
          p.maxLife = 0.6 + Math.random() * 0.8;
          p.mesh.material.color.setHex(hexColor);
          const s = 1.2 + Math.random() * 2.8;
          p.mesh.scale.set(s, s, s);
          p.mesh.visible = true;
          spawned++;
        }
      }

      // 2. High-Gloss Floor Decal Stain
      const d = this.bloodDecalPool[this.bloodDecalIndex % this.bloodDecalPool.length];
      this.bloodDecalIndex++;
      d.active = true;
      d.mesh.position.set(x, -y, 0.45 + (this.bloodDecalIndex % 20) * 0.02);
      d.mesh.rotation.z = Math.random() * Math.PI * 2;
      const s = radius + Math.random() * 18;
      d.mesh.scale.set(s, s, 1);
      d.mesh.material.color.setHex(hexColor);
      d.mesh.visible = true;
    },

    updateParticles(dt) {
      if (!this.sparkPool) return;
      for (let i = 0; i < this.sparkPool.length; i++) {
        const p = this.sparkPool[i];
        if (p.active) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vz -= 880 * dt; // Industrial gravity

          if (p.type === "blood") {
            p.mesh.rotation.x += dt * 9;
            p.mesh.rotation.y += dt * 7;
          }

          p.life += dt;
          if (p.z < 1) {
            p.z = 1;
            p.active = false;
            p.mesh.visible = false;
          } else if (p.life >= p.maxLife) {
            p.active = false;
            p.mesh.visible = false;
          } else {
            p.mesh.position.set(p.x, p.y, p.z);
          }
        }
      }
    },

    // --- 3D ENEMY MESH FACTORY ---
    getEnemyMesh(enemy) {
      let mesh = this.enemyMeshes.get(enemy.id);
      if (mesh) return mesh;

      const rType = (enemy.info && enemy.info.renderType) ? enemy.info.renderType : "pedestrian";
      const rad = (enemy.info && enemy.info.radius) ? enemy.info.radius : 15;
      const group = new THREE.Group();

      if (rType === "delivery_van") {
        // High-Fidelity Delivery Van (Fiat Ducato / Transit)
        const cabGeo = new THREE.BoxGeometry(rad * 3.4, rad * 1.8, rad * 1.6);
        const vanMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.20 });
        const van = new THREE.Mesh(cabGeo, vanMat);
        van.position.set(0, 0, rad * 0.9);
        van.castShadow = true;
        van.receiveShadow = true;
        group.add(van);

        // Tinted Windshield
        const winGeo = new THREE.BoxGeometry(rad * 0.6, rad * 1.6, rad * 0.8);
        const winMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.05, metalness: 0.90 });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(rad * 1.2, 0, rad * 1.2);
        group.add(win);

        // Front Headlights
        const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const hlGeo = new THREE.BoxGeometry(2, rad * 0.35, rad * 0.35);
        const hlL = new THREE.Mesh(hlGeo, hlMat); hlL.position.set(rad * 1.7, rad * 0.6, rad * 0.6); group.add(hlL);
        const hlR = new THREE.Mesh(hlGeo, hlMat); hlR.position.set(rad * 1.7, -rad * 0.6, rad * 0.6); group.add(hlR);

      } else if (rType === "inventory_drone") {
        // Carbon-Fiber Quadcopter Drone
        const coreGeo = new THREE.SphereGeometry(rad * 0.8, 16, 16);
        const droneMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.85 });
        const core = new THREE.Mesh(coreGeo, droneMat);
        core.position.set(0, 0, 24);
        core.castShadow = true;
        group.add(core);

        // 4 Rotor Arms & Motion Blur Discs
        const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
        const rotorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
        [[-rad, -rad], [-rad, rad], [rad, -rad], [rad, rad]].forEach(pos => {
          const armGeo = new THREE.BoxGeometry(pos[0], pos[1], 2);
          const rotorGeo = new THREE.CylinderGeometry(rad * 0.55, rad * 0.55, 1, 12);
          const rotor = new THREE.Mesh(rotorGeo, rotorMat);
          rotor.position.set(pos[0], pos[1], 26);
          group.add(rotor);
        });

        // Glowing Red RFID Scanning Laser Eye
        const eyeGeo = new THREE.SphereGeometry(rad * 0.35, 12, 12);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(rad * 0.7, 0, 24);
        group.add(eye);

      } else if (rType === "warehouse_rat") {
        // Scurrying Warehouse Rat
        const ratGeo = new THREE.CapsuleGeometry(rad * 0.55, rad * 1.2, 8, 12);
        const ratMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95 });
        const rat = new THREE.Mesh(ratGeo, ratMat);
        rat.rotation.y = Math.PI / 2;
        rat.position.set(0, 0, rad * 0.55);
        rat.castShadow = true;
        group.add(rat);

        // Glowing Red Eyes
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const eyeGeo = new THREE.SphereGeometry(1.5, 6, 6);
        const e1 = new THREE.Mesh(eyeGeo, eyeMat); e1.position.set(rad * 0.85, rad * 0.28, rad * 0.75); group.add(e1);
        const e2 = new THREE.Mesh(eyeGeo, eyeMat); e2.position.set(rad * 0.85, -rad * 0.28, rad * 0.75); group.add(e2);

      } else {
        // High-Fidelity Humanoid (Worker, Courier, Customs Officer, Auditor, Boss)
        const vestHex = enemy.info && enemy.info.color ? parseInt(enemy.info.color.replace("#", "0x")) : 0xea580c;
        const clothHex = enemy.info && enemy.info.clothColor ? parseInt(enemy.info.clothColor.replace("#", "0x")) : 0x1e3a8a;

        const bodyGeo = new THREE.CapsuleGeometry(rad * 0.65, rad * 1.2, 8, 12);
        const bodyMat = new THREE.MeshStandardMaterial({ color: vestHex, roughness: 0.55, metalness: 0.15 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0, 0, rad * 1.25);
        body.castShadow = true;
        group.add(body);

        // Reflective Safety Striping
        const stripeGeo = new THREE.CylinderGeometry(rad * 0.68, rad * 0.68, 3, 12);
        const stripe = new THREE.Mesh(stripeGeo, this.materials.retroReflective);
        stripe.position.set(0, 0, rad * 1.3);
        group.add(stripe);

        // Head & Hardhat / Uniform Cap
        const headGeo = new THREE.SphereGeometry(rad * 0.48, 12, 12);
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 });
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.set(0, 0, rad * 2.3);
        head.castShadow = true;
        group.add(head);

        const hardhatGeo = new THREE.SphereGeometry(rad * 0.52, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const hardhatMat = new THREE.MeshStandardMaterial({ color: enemy.isBoss ? 0xdc2626 : 0xfacc15, roughness: 0.35 });
        const hardhat = new THREE.Mesh(hardhatGeo, hardhatMat);
        hardhat.position.set(0, 0, rad * 2.4);
        group.add(hardhat);

        // Menacing Eyes / Laser Goggles
        const eyeColor = enemy.isBoss ? 0xa855f7 : 0xff0000;
        const eyeMat = new THREE.MeshBasicMaterial({ color: eyeColor });
        const eyeGeo = new THREE.SphereGeometry(1.6, 6, 6);
        const ey1 = new THREE.Mesh(eyeGeo, eyeMat); ey1.position.set(rad * 0.42, rad * 0.18, rad * 2.35); group.add(ey1);
        const ey2 = new THREE.Mesh(eyeGeo, eyeMat); ey2.position.set(rad * 0.42, -rad * 0.18, rad * 2.35); group.add(ey2);
      }

      this.enemiesGroup.add(group);
      this.enemyMeshes.set(enemy.id, group);
      return group;
    },

    // --- MAIN 3D RENDER LOOP ---
    update(dt, gameEntities) {
      if (!this.active) return;

      const player = gameEntities.player;
      const enemies = gameEntities.enemies || [];
      const dropItems = gameEntities.dropItems || [];
      const projectiles = gameEntities.projectiles || [];
      const kluska = gameEntities.kluska;
      const screenShake = gameEntities.screenShake || 0;
      const gameTime = gameEntities.gameTime || 0;
            const obstacles = gameEntities.obstacles || [];
      const adrBarrels = gameEntities.adrBarrels || [];
      if (adrBarrels) this.syncBarrels(adrBarrels);

      // Auto-Sync Racks if map changes
      if (this.lastObstacleCount !== obstacles.length) {
        this.syncRacks(obstacles);
        this.lastObstacleCount = obstacles.length;
      }

      // 1. Dynamic Tactical Isometric Camera Tracking
      const lookAheadX = (player.vx || 0) * 0.18;
      const lookAheadY = -(player.vy || 0) * 0.18;
      const targetCamX = player.x + lookAheadX;
      const targetCamY = -player.y - 490 + lookAheadY;
      const targetCamZ = this.cameraZoom || 380;

      // 3D Screen Shake Trauma
      const shakeX = (Math.random() - 0.5) * screenShake * 2.2;
      const shakeY = (Math.random() - 0.5) * screenShake * 2.2;
      const shakeZ = (Math.random() - 0.5) * screenShake * 1.8;

      this.camera.position.set(targetCamX + shakeX, targetCamY + shakeY, targetCamZ + shakeZ);
      this.camera.lookAt(player.x + lookAheadX * 0.5, -player.y + 35 + lookAheadY * 0.5, 0);

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
