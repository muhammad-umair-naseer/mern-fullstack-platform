/**
 * Full-screen backdrop: drifting silk light on warm ivory, the same calm
 * surface as the Cortexis site. A few soft ribbons of light and shade fold
 * slowly across the page; `setSpeed()` is driven by the local racer's typing
 * speed, so while you race the silk streams faster and fine light streaks
 * pass behind the track. Rendered at a fraction of the screen resolution
 * (it is all soft light, so the upscale reads as blur for free) and only
 * redrawn as often as the motion needs. With reduced motion it is one still.
 */
const RIBBONS = [
  // y: centre as a share of the height, a: amplitude, f: waves across, w: width, s: drift rate, tone: light or shade
  { y: 0.18, a: 0.16, f: 0.9, w: 0.20, s: 0.050, p: 0.0, tone: 'light' },
  { y: 0.34, a: 0.12, f: 1.3, w: 0.13, s: -0.036, p: 1.7, tone: 'shade' },
  { y: 0.58, a: 0.18, f: 0.7, w: 0.24, s: 0.030, p: 3.1, tone: 'light' },
  { y: 0.74, a: 0.10, f: 1.6, w: 0.10, s: -0.044, p: 4.4, tone: 'copper' },
  { y: 0.92, a: 0.14, f: 1.1, w: 0.18, s: 0.026, p: 5.6, tone: 'shade' },
];
const TONES = {
  light: [255, 255, 255, 0.55],
  shade: [222, 211, 195, 0.34],
  copper: [226, 176, 140, 0.20],
};
const SCALE = 0.35;         // backing store resolution relative to CSS pixels

export class Background {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.speed = 0.3;
    this.targetSpeed = 0.3;
    this.phase = 0;
    this.streaks = [];
    this.last = performance.now();
    this.lastDraw = 0;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => { this.last = performance.now(); });
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.c.width = Math.max(1, Math.floor(this.w * SCALE));
    this.c.height = Math.max(1, Math.floor(this.h * SCALE));
    this.ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    this.streaks = Array.from({ length: 14 }, () => this.newStreak(true));
    this.draw(this.last);
  }

  newStreak(anywhere) {
    return {
      x: anywhere ? Math.random() * this.w : this.w + Math.random() * this.w * 0.5,
      y: this.h * (0.12 + Math.random() * 0.8),
      len: 60 + Math.random() * 200,
      v: 0.6 + Math.random() * 0.9,
      a: 0.25 + Math.random() * 0.45,
    };
  }

  setSpeed(v) {
    this.targetSpeed = v;
  }

  loop(t) {
    const dt = Math.min(64, t - this.last);
    this.last = t;
    this.speed += (this.targetSpeed - this.speed) * 0.04;
    if (!this.reduced) {
      this.phase += (dt / 1000) * (0.35 + this.speed * 0.9);
      // soft light needs no more than ~30 frames a second, and every frame
      // spent here is one the typing does not get
      const every = this.speed > 0.6 ? 33 : 40;
      if (t - this.lastDraw >= every) {
        this.lastDraw = t;
        this.draw(t, dt);
      }
    }
    requestAnimationFrame((tt) => this.loop(tt));
  }

  ribbonPath(r, t) {
    const { w, h } = this;
    const pts = [];
    const n = 28;
    const ph = r.p + this.phase * r.s * 10;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const x = -w * 0.15 + u * w * 1.3;
      const y = h * (r.y
        + r.a * Math.sin(u * Math.PI * 2 * r.f + ph)
        + r.a * 0.35 * Math.sin(u * Math.PI * 2 * r.f * 2.3 - ph * 1.3));
      pts.push([x, y]);
    }
    return pts;
  }

  strokeSoft(pts, width, [cr, cg, cb, ca]) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      const my = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
    }
    // a few passes, wide and faint to narrow and brighter: a soft-edged band
    for (const k of [1, 0.72, 0.46, 0.24]) {
      ctx.lineWidth = width * k;
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(ca * (1.15 - k) * 0.55).toFixed(3)})`;
      ctx.stroke();
    }
  }

  draw(t, dt = 16) {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const r of RIBBONS) {
      const pts = this.ribbonPath(r, t);
      const base = Math.min(w, h) * r.w + h * 0.04;
      if (r.tone === 'light') {
        // a shade fold under every light fold gives the silk its depth
        const under = pts.map(([x, y]) => [x, y + base * 0.22]);
        this.strokeSoft(under, base * 1.05, TONES.shade);
      }
      this.strokeSoft(pts, base, TONES[r.tone]);
    }

    // speed streaks: only while typing fast
    const fast = Math.max(0, Math.min(1, (this.speed - 0.55) / 1.6));
    if (fast > 0.02 && !this.reduced) {
      ctx.lineWidth = 1.4;
      for (const s of this.streaks) {
        s.x -= s.v * (dt / 16) * (6 + this.speed * 7);
        if (s.x + s.len < 0) Object.assign(s, this.newStreak(false));
        const g = ctx.createLinearGradient(s.x, 0, s.x + s.len, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.6, `rgba(255,255,255,${(s.a * fast).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len, s.y);
        ctx.stroke();
      }
    }
  }
}
