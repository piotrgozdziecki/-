/**
 * SYSTEMS - SpatialGrid
 * Spatial Partitioning Grid using pre-allocated bucket arrays and reusable query buffers.
 * Accelerates broad-phase collision detection and enemy spatial queries without generating garbage.
 */
class SpatialGrid {
  constructor(width = 3800, height = 3800, cellSize = 150) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    
    this.cells = new Array(this.cols * this.rows);
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = [];
    }

    // Reusable result buffer for spatial queries to eliminate Array allocations
    this.queryResultBuffer = [];
  }

  clear() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].length = 0;
    }
  }

  getCellIndex(x, y) {
    const col = Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.cellSize)));
    const row = Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.cellSize)));
    return row * this.cols + col;
  }

  insert(entity) {
    if (!entity || entity.dead) return;
    const index = this.getCellIndex(entity.x, entity.y);
    this.cells[index].push(entity);
  }

  queryRadius(x, y, radius) {
    this.queryResultBuffer.length = 0;
    const startCol = Math.max(0, Math.floor((x - radius) / this.cellSize));
    const endCol = Math.min(this.cols - 1, Math.floor((x + radius) / this.cellSize));
    const startRow = Math.max(0, Math.floor((y - radius) / this.cellSize));
    const endRow = Math.min(this.rows - 1, Math.floor((y + radius) / this.cellSize));

    const radiusSq = radius * radius;

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const cellIndex = r * this.cols + c;
        const bucket = this.cells[cellIndex];
        for (let i = 0; i < bucket.length; i++) {
          const entity = bucket[i];
          const dx = entity.x - x;
          const dy = entity.y - y;
          if (dx * dx + dy * dy <= radiusSq) {
            this.queryResultBuffer.push(entity);
          }
        }
      }
    }
    return this.queryResultBuffer;
  }
}

window.spatialGrid = new SpatialGrid();
