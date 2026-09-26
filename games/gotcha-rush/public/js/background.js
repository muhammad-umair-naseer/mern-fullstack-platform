/**
 * Full-screen backdrop: ivory silk in window light, the same mood as the
 * Cortexis site. A handful of broad, soft folds (light and shade) drift across
 * a warm ground; a window glow sits top-right and a warm shadow bottom-left.
 *
 * Drawn at half resolution and upscaled (silk has no fine detail), at about
 * thirty frames a second, and not at all under reduced motion or while the tab
 * is hidden. `setSpeed()` is driven by how heated the match is, so the folds
 * drift a little faster as the clock runs down.
 */
const SCALE = 0.5;

const FOLDS = [
  // offset across the page (-1..1), width (fraction of the diagonal), tone, alpha, drift speed, drift amplitude, phase, tilt
  { off: -0.66, w: 0.3, tone: 'shade', a: 0.55, sp: 0.55, amp: 0.07, p: 0.0, tilt: 0.0 },
  { off: -0.42, w: 0.12, tone: 'light', a: 0.95, sp: 0.8, amp: 0.05, p: 1.3, tilt: 0.05 },
  { off: -0.2, w: 0.2, tone: 'shade', a: 0.42, sp: 0.62, amp: 0.06, p: 2.2, tilt: -0.04 },
  { off: -0.02, w: 0.1, tone: 'sheen', a: 0.16, sp: 0.9, amp: 0.05, p: 3.1, tilt: 0.03 },
  { off: 0.14, w: 0.16, tone: 'light', a: 0.9, sp: 0.5, amp: 0.07, p: 4.0, tilt: 0.02 },
  { off: 0.36, w: 0.26, tone: 'shade', a: 0.46, sp: 0.44, amp: 0.08, p: 5.2, tilt: -0.03 },
  { off: 0.6, w: 0.12, tone: 'light', a: 0.85, sp: 0.7, amp: 0.05, p: 0.7, tilt: 0.04 },
  { off: 0.82, w: 0.24, tone: 'shade', a: 0.4, sp: 0.5, amp: 0.06, p: 2.9, tilt: -0.02 },
];
const TONE = {
  shade: '214, 196, 172',
  light: '255, 254, 251',
  sheen: '205, 140, 96',
};

export class Background {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.speed = 0.3;
    this.targetSpeed = 0.3;
    this.phase = 1.7;
    this.last = performance.now();
    this.skip = false;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    window.addEventListener('resize', () => { this.resize(); this.draw(); });
    document.addEventListener('visibilitychange', () => { this.last = performance.now(); });
    this.draw();
    if (!this.reduced) requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.c.width = Math.max(1, Math.floor(this.w * SCALE));
    this.c.height = Math.max(1, Math.floor(this.h * SCALE));
    this.ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  }

  setSpeed(v) {
    this.targetSpeed = v;
  }

  loop(t) {
    const dt = Math.min(64, t - this.last);
    this.last = t;
    this.speed += (this.targetSpeed - this.speed) * 0.04;
    this.phase += ((this.speed * dt) / 1000) * 0.22;
    this.skip = !this.skip;               // ~30 fps is plenty for silk
    if (!this.skip) this.draw();
    requestAnimationFrame((tt) => this.loop(tt));
  }

  draw() {
    const { ctx, w, h, phase } = this;
    ctx.clearRect(0, 0, w, h);
    const diag = Math.hypot(w, h);

    // window light, top right, and a warm shadow pooling bottom left
    const lx = w * (0.86 + 0.03 * Math.sin(phase * 0.4));
    const ly = h * (-0.08 + 0.03 * Math.cos(phase * 0.3));
    let g = ctx.createRadialGradient(lx, ly, 0, lx, ly, diag * 0.62);
    g.addColorStop(0, 'rgba(255, 254, 250, 0.95)');
    g.addColorStop(1, 'rgba(255, 254, 250, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const sx = w * (0.04 + 0.03 * Math.cos(phase * 0.35));
    const sy = h * 1.04;
    g = ctx.createRadialGradient(sx, sy, 0, sx, sy, diag * 0.55);
    g.addColorStop(0, 'rgba(226, 208, 184, 0.7)');
    g.addColorStop(1, 'rgba(226, 208, 184, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // the folds: long soft bands laid on the diagonal, drifting and tilting a little
    const base = -0.64;                   // about -37 degrees, the drape of the site's silk
    for (const f of FOLDS) {
      const ang = base + f.tilt + 0.035 * Math.sin(phase * f.sp * 0.7 + f.p);
      const off = (f.off + f.amp * Math.sin(phase * f.sp + f.p)) * diag * 0.62;
      const width = f.w * diag * (1 + 0.12 * Math.sin(phase * f.sp * 1.3 + f.p * 2));
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(ang);
      ctx.translate(0, off);
      const band = ctx.createLinearGradient(0, -width / 2, 0, width / 2);
      const c = TONE[f.tone];
      band.addColorStop(0, `rgba(${c}, 0)`);
      band.addColorStop(0.42, `rgba(${c}, ${f.a * 0.8})`);
      band.addColorStop(0.55, `rgba(${c}, ${f.a})`);
      band.addColorStop(1, `rgba(${c}, 0)`);
      ctx.fillStyle = band;
      ctx.fillRect(-diag, -width / 2, diag * 2, width);
      ctx.restore();
    }
  }
}
