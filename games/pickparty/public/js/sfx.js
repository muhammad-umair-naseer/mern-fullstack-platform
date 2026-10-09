// Synthesised sound effects (Web Audio): no audio files to download.
let ctx = null;
let muted = false;
try { muted = localStorage.getItem('pp.mute') === '1'; } catch {}

function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
addEventListener('pointerdown', () => ac(), { once: true });

function tone(freq, dur = 0.12, { type = 'sine', gain = 0.07, when = 0, slide = null } = {}) {
  if (muted) return;
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + when;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(a.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  pick: () => { tone(520, 0.09, { type: 'triangle' }); tone(780, 0.1, { type: 'triangle', when: 0.05 }); },
  other: () => tone(420, 0.08, { type: 'triangle', gain: 0.04 }),
  turn: () => { tone(660, 0.12, { type: 'square', gain: 0.04 }); tone(990, 0.16, { type: 'square', gain: 0.04, when: 0.12 }); },
  tick: () => tone(1200, 0.04, { type: 'square', gain: 0.025 }),
  vote: () => tone(540, 0.14, { type: 'sine', slide: 720 }),
  flip: () => tone(300, 0.08, { type: 'triangle', slide: 600, gain: 0.05 }),
  hit: () => { tone(660, 0.1, { type: 'triangle' }); tone(880, 0.1, { type: 'triangle', when: 0.08 }); tone(1320, 0.16, { type: 'triangle', when: 0.16 }); },
  miss: () => tone(220, 0.18, { type: 'sawtooth', gain: 0.03, slide: 160 }),
  dud: () => { tone(160, 0.3, { type: 'sawtooth', gain: 0.05, slide: 70 }); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { type: 'triangle', when: i * 0.09 })),
};

export function isMuted() { return muted; }
export function setMuted(v) {
  muted = !!v;
  try { localStorage.setItem('pp.mute', muted ? '1' : '0'); } catch {}
}
