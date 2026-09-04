
    if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
        if (typeof radii === 'number') radii = [radii, radii, radii, radii];
        else if (!Array.isArray(radii)) radii = [4, 4, 4, 4];
        const r = Math.min(radii[0] || 0, w / 2, h / 2);
        this.beginPath();
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        this.closePath();
        return this;
      };
    }
    window.onerror = function(msg, url, line, col, error) {
      console.error("GLOBAL ERROR: " + msg + " at " + url + ":" + line + ":" + col, error);
      return false;
    };
    window.onunhandledrejection = function(event) {
      console.error("UNHANDLED REJECTION: " + event.reason);
    };
  