/**
 * Synthesised sound effects (no audio files). Everything is built from short
 * oscillator envelopes so the whole game stays a single self-contained folder.
 */
export class Sound {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('gr_sound') !== 'off';
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('gr_sound', this.enabled ? 'on' : 'off');
    if (this.enabled) this.ensure();
    return this.enabled;
  }

  tone(freq, dur = 0.1, type = 'sine', gain = 0.12, delay = 0, glide = null) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  noise(dur = 0.08, gain = 0.05, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    src.connect(g).connect(this.ctx.destination);
    src.start(t0);
  }

  key() { this.tone(2200 + Math.random() * 300, 0.02, 'square', 0.02); }
  tick() { this.tone(1200, 0.03, 'square', 0.05); }
  tickUrgent() { this.tone(1600, 0.05, 'square', 0.08); }
  lock() { this.tone(660, 0.08, 'triangle', 0.12); this.tone(990, 0.12, 'triangle', 0.12, 0.07); }
  lifeline() { this.tone(500, 0.12, 'sine', 0.1); this.tone(400, 0.16, 'sine', 0.1, 0.1); }
  print() { this.tone(1500 + Math.random() * 500, 0.03, 'square', 0.035); }
  run() { this.tone(220, 0.35, 'sawtooth', 0.07, 0, 440); this.noise(0.25, 0.03); }
  correct() { [784, 988, 1319].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.14, i * 0.07)); }
  wrong() { this.tone(300, 0.18, 'sawtooth', 0.08, 0, 160); this.tone(200, 0.25, 'sawtooth', 0.06, 0.12, 120); }
  combo(n = 1) { const b = 700 + Math.min(6, n) * 90; this.tone(b, 0.08, 'triangle', 0.13); this.tone(b * 1.5, 0.12, 'triangle', 0.13, 0.07); }
  first() { [1047, 1319, 1568, 2093].forEach((f, i) => this.tone(f, 0.12, 'sine', 0.12, i * 0.05)); }
  points() { this.tone(1800, 0.05, 'sine', 0.06); }
  start() { [440, 554, 659, 880].forEach((f, i) => this.tone(f, 0.14, 'triangle', 0.15, i * 0.1)); }
  count() { this.tone(880, 0.09, 'square', 0.08); }
  go() { this.tone(1046, 0.25, 'square', 0.12); this.tone(1318, 0.3, 'square', 0.1, 0.12); }
  win() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.16, i * 0.09)); }
  finish() { this.tone(660, 0.12, 'triangle', 0.12); this.tone(880, 0.18, 'triangle', 0.12, 0.12); }
  lifeLost() { this.tone(180, 0.4, 'sawtooth', 0.1, 0, 90); this.noise(0.3, 0.05); }
  levelUp() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.18, i * 0.09)); this.tone(1568, 0.8, 'triangle', 0.16, 0.65); }
  achievement() { [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.14, 'sine', 0.15, i * 0.08)); }
  emote() { this.tone(900, 0.06, 'sine', 0.08, 0, 1300); }
  join() { this.tone(520, 0.08, 'sine', 0.12); this.tone(780, 0.1, 'sine', 0.12, 0.08); }
  error() { this.tone(180, 0.12, 'sawtooth', 0.08, 0, 120); }
}
