/**
 * Full-screen backdrop: soft warm light drifting over a faint dot grid.
 * `setSpeed()` is driven by how heated the match is, so the light drifts a
 * little faster as the clock runs down.
 */
export class Background {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.speed = 0.3;
    this.targetSpeed = 0.3;
    this.phase = 0;
    this.blobs = [
      { x: 0.16, y: 0.24, r: 0.46, c: '255, 178, 110', a: 0.34, p: 0 },
      { x: 0.84, y: 0.18, r: 0.4, c: '253, 213, 170', a: 0.42, p: 2.1 },
      { x: 0.55, y: 0.95, r: 0.55, c: '251, 146, 60', a: 0.14, p: 4.2 },
    ];
    this.last = performance.now();
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => { this.last = performance.now(); });
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.c.width = Math.floor(this.w * dpr);
    this.c.height = Math.floor(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // the dot grid is a single tile, repeated
    const step = 26;
    const tile = document.createElement('canvas');
    tile.width = tile.height = Math.round(step * dpr);
    const t = tile.getContext('2d');
    t.scale(dpr, dpr);
    t.fillStyle = 'rgba(154, 72, 20, 0.14)';
    t.beginPath();
    t.arc(step / 2, step / 2, 1, 0, Math.PI * 2);
    t.fill();
    this.dots = this.ctx.createPattern(tile, 'repeat');
    if (this.dots.setTransform) this.dots.setTransform(new DOMMatrix().scale(1 / dpr));
  }

  setSpeed(v) {
    this.targetSpeed = v;
  }

  loop(t) {
    const dt = Math.min(64, t - this.last);
    this.last = t;
    this.speed += (this.targetSpeed - this.speed) * 0.04;
    if (!this.reduced) this.phase += ((this.speed * dt) / 1000) * 0.12;
    this.draw();
    requestAnimationFrame((tt) => this.loop(tt));
  }

  draw() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    const size = Math.max(w, h);
    for (const b of this.blobs) {
      const x = (b.x + 0.04 * Math.sin(this.phase + b.p)) * w;
      const y = (b.y + 0.03 * Math.cos(this.phase * 0.8 + b.p)) * h;
      const r = b.r * size * 0.6;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${b.c}, ${b.a})`);
      g.addColorStop(1, `rgba(${b.c}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ctx.fillStyle = this.dots;
    ctx.fillRect(0, 0, w, h);
  }
}
