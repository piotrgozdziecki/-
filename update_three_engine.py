import re

with open("app/src/main/assets/three_engine.js", "r") as f:
    code = f.read()

# 1. Add cameraZoom and barrelsGroup, vfxGroup to properties
if "cameraZoom:" not in code:
    code = code.replace("active: false,", "active: false,\n    cameraZoom: 380,\n    vfxGroup: null,\n    barrelsGroup: null,\n    barrelMeshes: new Map(),\n    vfxMeshes: new Map(),")

# 2. Add setCameraZoom and getScreenCoords methods
new_methods = """
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
"""

if "getScreenCoords(" not in code:
    code = code.replace("onResize() {", new_methods + "\n    onResize() {")

# 3. Increase fog density for claustrophobic dark warehouse atmosphere
code = re.sub(r"this\.scene\.fog = new THREE\.FogExp2\([^\)]+\);", "this.scene.fog = new THREE.FogExp2(0x020617, 0.0032);", code)

# 4. In init(), add barrelsGroup and vfxGroup to scene
group_init = """        this.racksGroup = new THREE.Group();
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
        this.scene.add(this.projectilesGroup);"""

code = re.sub(r"this\.racksGroup = new THREE\.Group\(\);[\s\S]*?this\.scene\.add\(this\.projectilesGroup\);", group_init, code)

# 5. In update(), set targetCamZ to cameraZoom
code = re.sub(r"const targetCamZ = 640;", "const targetCamZ = this.cameraZoom || 380;", code)

# 6. In update(), sync adrBarrels if provided
update_barrels_call = """      const obstacles = gameEntities.obstacles || [];
      const adrBarrels = gameEntities.adrBarrels || [];
      if (adrBarrels) this.syncBarrels(adrBarrels);"""

code = code.replace("const obstacles = gameEntities.obstacles || [];", update_barrels_call)

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(code)

print("three_engine.js updated successfully!")
