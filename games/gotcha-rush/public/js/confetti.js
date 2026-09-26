/**
 * Restrained, on-palette confetti: copper, champagne, sage, ink and ivory
 * ribbons that flutter as they fall. Bursts are thinned out (a celebration,
 * not a snowstorm) and skipped entirely under reduced motion.
 */
const COLORS = ['#B8612E', '#9A4A22', '#E3B98F', '#C0923A', '#62805A', '#16130F', '#F5E6D8', '#D9CBB5'];
const DENSITY = 0.55;

export class Confetti {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.parts = [];
    this.running = false;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.c.width = Math.floor(this.w * this.dpr);
    this.c.height = Math.floor(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  burst(count = 220) {
    if (this.reduced) return;
    const n = Math.round(count * DENSITY);
    const { w, h } = this;
    for (let i = 0; i < n; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const ribbon = Math.random() < 0.7;
      this.parts.push({
        x: w / 2 + side * (w * 0.22) + (Math.random() - 0.5) * 80,
        y: h * 0.6,
        vx: -side * (2 + Math.random() * 6) + (Math.random() - 0.5) * 3,
        vy: -(9 + Math.random() * 8),
        g: 0.24 + Math.random() * 0.1,
        w: ribbon ? 4 + Math.random() * 3 : 5 + Math.random() * 3,
        h: ribbon ? 10 + Math.random() * 8 : 0,
        ribbon,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.24,
        flip: Math.random() * Math.PI * 2,
        vf: 0.08 + Math.random() * 0.12,
        color: COLORS[i % COLORS.length],
        life: 150 + Math.random() * 60,
      });
    }
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(() => this.loop());
    }
  }

  loop() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    for (const p of this.parts) {
      p.vy += p.g;
      p.vx *= 0.985;
      p.vy *= 0.992;
      p.x += p.vx + Math.sin(p.flip) * 0.6;
      p.y += p.vy;
      p.rot += p.vr;
      p.flip += p.vf;
      p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
      ctx.fillStyle = p.color;
      if (p.ribbon) {
        ctx.scale(1, Math.cos(p.flip));  // the ribbon turns over as it falls
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    this.parts = this.parts.filter((p) => p.life > 0 && p.y < h + 30);
    if (this.parts.length) requestAnimationFrame(() => this.loop());
    else {
      this.running = false;
      ctx.clearRect(0, 0, w, h);
    }
  }
}
