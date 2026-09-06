/**
 * SYSTEMS - ObjectPool
 * Pre-allocated reusable object pools for high-frequency runtime entities:
 * - Particles
 * - Floating Damage Texts
 * - Projectiles
 * - Skid Marks / Decals
 * - Spent Shell Casings
 * - Enemy Drops / Pickups
 * Completely eliminates runtime GC garbage allocations during 60 FPS hot path.
 */
class ObjectPool {
  constructor(factoryFn, initialSize = 100) {
    this.factoryFn = factoryFn;
    this.pool = new Array(initialSize);
    for (let i = 0; i < initialSize; i++) {
      const obj = this.factoryFn();
      obj.active = false;
      this.pool[i] = obj;
    }
  }

  obtain() {
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        this.pool[i].active = true;
        return this.pool[i];
      }
    }
    // Expand pool if exhausted
    const newObj = this.factoryFn();
    newObj.active = true;
    this.pool.push(newObj);
    return newObj;
  }

  release(obj) {
    obj.active = false;
  }

  clear() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].active = false;
    }
  }

  forEachActive(callback) {
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) {
        callback(this.pool[i], i);
      }
    }
  }
}

// Global Pools Registry
window.pools = {
  particles: new ObjectPool(() => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 3, color: '#fff'
  }), 500),

  floatingTexts: new ObjectPool(() => ({
    active: false, x: 0, y: 0, text: '', color: '#fff', life: 0, isCrit: false
  }), 150),

  projectiles: new ObjectPool(() => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, radius: 4, damage: 10, isEnemy: false,
    color: '#f8fafc', type: 'bullet', life: 2.5, pierces: 1, homing: false, ricochet: 0
  }), 250),

  spentShells: new ObjectPool(() => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vrot: 0, altitude: 0, valtit: 0,
    life: 5.0, type: '9mm'
  }), 200),

  decals: new ObjectPool(() => ({
    active: false, x: 0, y: 0, radius: 20, type: 'blood', life: 20.0, maxLife: 20.0, rot: 0
  }), 150),

  pickups: new ObjectPool(() => ({
    active: false, x: 0, y: 0, type: 'xp', value: 10, radius: 12, rot: 0, life: 30.0
  }), 200)
};
