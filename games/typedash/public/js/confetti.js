/* On-palette and restrained: copper, champagne, sage and warm paper, cut as
   thin pieces that flutter as they fall. No ink — dark flecks read as dirt
   on an ivory screen. Physics run on elapsed time, so a burst lasts about
   three seconds on any screen and never drifts into the next view. */
const COLORS = ['#B8612E', '#D08A5A', '#E3B48C', '#C29A55', '#E9DCC4', '#F5E6D8', '#62805A', '#9DB392'];
const MAX_PARTS = 150;          // a second burst tops up the first instead of doubling it
const LIFE_MS = 2600;
const FADE_MS = 700;

export class Confetti {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.parts = [];
    this.running = false;
    this.last = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    // backing store in device pixels, drawing coordinates in CSS pixels
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.c.width = Math.floor(this.w * dpr);
    this.c.height = Math.floor(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  burst(count = 220) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const w = this.w;
    const small = w < 620;
    const n = Math.min(Math.round(count * (small ? 0.32 : 0.45)), MAX_PARTS - this.parts.length);
    for (let i = 0; i < n; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      this.parts.push({
        x: w / 2 + side * (w * 0.24) + (Math.random() - 0.5) * 80,
        y: this.h * 0.6,
        vx: -side * (2.2 + Math.random() * (small ? 3.5 : 6)) + (Math.random() - 0.5) * 3,
        vy: -(8 + Math.random() * 7),
        g: 0.24 + Math.random() * 0.1,
        w: 3.5 + Math.random() * 4,
        h: 7 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.22,
        flip: Math.random() * Math.PI * 2,
        vf: 0.12 + Math.random() * 0.16,
        round: Math.random() < 0.18,
        color: COLORS[i % COLORS.length],
        life: LIFE_MS * (0.75 + Math.random() * 0.25),
      });
    }
    if (!this.running && this.parts.length) {
      this.running = true;
      this.last = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  loop(now) {
    const { ctx, w, h } = this;
    const dt = Math.min(64, Math.max(0, now - this.last));   // ms since the last frame
    const k = dt / 16.667;                                    // the tuning was done per 60 Hz frame
    this.last = now;
    ctx.clearRect(0, 0, w, h);
    for (const p of this.parts) {
      p.vy = Math.min(p.vy + p.g * k, 5.5);      // paper reaches a gentle terminal speed
      p.vx *= Math.pow(0.985, k);
      p.x += (p.vx + Math.sin(p.flip) * 0.6) * k;
      p.y += p.vy * k;
      p.rot += p.vr * k;
      p.flip += p.vf * k;
      p.life -= dt;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(Math.cos(p.flip), 1);            // the flutter: the piece turns edge-on and back
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / FADE_MS));
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.w * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }
    this.parts = this.parts.filter((p) => p.life > 0 && p.y < h + 20);
    if (this.parts.length) requestAnimationFrame((t) => this.loop(t));
    else {
      this.running = false;
      ctx.clearRect(0, 0, w, h);
    }
  }
}
