import re

with open("app/src/main/assets/three_engine.js", "r") as f:
    code = f.read()

# Replace WebGL context creation with resilient fallback
old_ctx_block = """        let testCtx = null;
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
        }"""

new_ctx_block = """        // Setup WebGL Context Loss Recovery
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
        }"""

if "failIfMajorPerformanceCaveat" not in code:
    code = code.replace(old_ctx_block, new_ctx_block)

with open("app/src/main/assets/three_engine.js", "w") as f:
    f.write(code)

print("three_engine.js GL resilience updated successfully!")
