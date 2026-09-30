import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  ArrowRight,
  AudioLines,
  Clapperboard,
  FileText,
  Globe,
  ImageIcon,
  Wrench,
} from 'lucide-react';
import { CATEGORIES, liveTools } from '../../data/tools';
import './ToolsOrbit.css';

/**
 * The /tools hero: the whole catalogue as one instrument.
 *
 * A glass disc carries the tool count. Around it, on one tilted plane, sit
 * a bezel of ticks (one per tool, seven arcs, one per category) and the
 * orbits the seven category labels travel on. Every so often a real tool
 * name surfaces from a label and its tick lights on the bezel. Hovering or
 * focusing a label stops the orbit, turns that category's arc to the front
 * and opens a card with the tools it leads with. Each label links to the
 * catalogue below, filtered to its category.
 *
 * The markup is static JSX. One effect owns a requestAnimationFrame loop that
 * writes transform, opacity and z-index straight to the nodes, so nothing
 * re-renders per frame. The loop sleeps while the tab is hidden or the stage
 * is off screen; reduced motion gets one composed still frame instead.
 */

// ---------------------------------------------------------------- catalogue

const LIVE = liveTools();
const NAMES = {};
CATEGORIES.forEach((c) => {
  NAMES[c.id] = LIVE.filter((t) => t.category === c.id).map((t) => t.name);
});
const ORDER = CATEGORIES.map((c) => c.id).filter((id) => NAMES[id].length);
const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
const TOTAL = ORDER.reduce((n, id) => n + NAMES[id].length, 0);

// Shared with the catalogue headings on /tools, so a category wears one icon.
export const CATEGORY_ICONS = {
  pdf: FileText,
  image: ImageIcon,
  video: Clapperboard,
  audio: AudioLines,
  convert: ArrowLeftRight,
  web: Globe,
  dev: Wrench,
};

// What each category leads with in its card and its whispers. Names that
// leave the catalogue drop out; the catalogue's own order fills in behind.
const LEADS = {
  pdf: ['PDF Merger', 'PDF Compressor', 'PDF ↔ Word', 'PDF e-Sign', 'PDF Splitter', 'PDF OCR', 'Compare PDFs', 'PDF Protect'],
  image: ['Background Remover', 'Image Compressor', 'Image Resizer', 'SVG Optimizer', 'Image to Text (OCR)', 'Meme Generator'],
  video: ['MP4 → GIF', 'Video Compressor', 'Video Trimmer', 'GIF Maker'],
  audio: ['MP4 → MP3', 'MP3 Compressor', 'Audio Converter', 'WAV Compressor'],
  convert: ['HEIC to JPG / PNG', 'CSV ↔ JSON', 'DOCX to PDF', 'Font Converter', 'WEBM ↔ MP4', 'Markdown to PDF / HTML'],
  web: ['Save Web as PDF', 'Website PNG Screenshot', 'Website JPG Screenshot'],
  dev: ['JSON Formatter', 'QR Generator', 'Regex Tester & Explainer', 'JWT Decoder', 'UUID & Secret Generator', 'Word & Character Counter'],
};
const PICK = Object.fromEntries(
  ORDER.map((id) => {
    const lead = (LEADS[id] || []).filter((n) => NAMES[id].includes(n));
    return [id, [...lead, ...NAMES[id].filter((n) => !lead.includes(n))].slice(0, 8)];
  })
);

// ---------------------------------------------------------------- the bezel

// One tick per tool, the categories separated by five empty slots.
const GAP = 5;
const SLOT = 360 / (TOTAL + ORDER.length * GAP);
const ARC = {};
{
  let s = 0;
  ORDER.forEach((id) => {
    ARC[id] = { from: s, mid: (s + (NAMES[id].length - 1) / 2) * SLOT };
    s += NAMES[id].length + GAP;
  });
}
// The bezel starts with the first category's arc facing the viewer.
const PHI0 = 90 - ARC[ORDER[0]].mid;

// ---------------------------------------------------------------- layouts

// All rings share one plane seen from above (ry = R * ratio). The disc floats
// above the plane's centre by `lift`, so each ring's far side slides behind
// the glass and its near side clears it. Start phases come from a search for
// the first seconds with no two labels overlapping and none hidden.
const LAYOUTS = {
  wide: {
    lift: 60, roll: -6, ratio: 0.49, dial: 160, tick: 10, disc: 125, height: 620, chipHalf: 70,
    rings: [
      { R: 198, period: 52, chips: [['pdf', 0.367], ['image', 0.898]], bead: 0.6 },
      { R: 268, period: 74, chips: [['convert', 0.483], ['dev', 0.863], ['video', 0.204]], bead: 0.3 },
      { R: 332, period: 98, chips: [['audio', 0.035], ['web', 0.563]], bead: 0.75 },
    ],
  },
  narrow: {
    lift: 26, roll: -6, ratio: 0.72, dial: 86, tick: 6, disc: 72, height: 330, chipHalf: 50, quiet: true,
    rings: [
      { R: 110, period: 46, chips: [['pdf', 0.155], ['image', 0.403], ['dev', 0.905]], bead: 0.6 },
      { R: 146, period: 68, chips: [['convert', 0.571], ['video', 0.746], ['audio', 0.043], ['web', 0.336]], bead: 0.2 },
    ],
  },
};
const WIDE_AT = 560;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const outerR = (L) => Math.max(...L.rings.map((r) => r.R));

// Everything the markup and the loop need for one layout at one scale.
const GEO_CACHE = new Map();
function geometry(mode, s) {
  const k = `${mode}:${s}`;
  if (GEO_CACHE.has(k)) return GEO_CACHE.get(k);
  const L = LAYOUTS[mode];

  const rings = L.rings.map((r) => ({ R: r.R * s, ry: Math.round(r.R * s * L.ratio), period: r.period, bead: r.bead }));
  const chips = [];
  const placed = new Set();
  L.rings.forEach((r, ri) =>
    r.chips.forEach(([cat, phase]) => {
      if (!NAMES[cat] || !NAMES[cat].length) return;
      placed.add(cat);
      chips.push({ cat, ring: ri, phase });
    })
  );
  // A category the layouts do not know yet still gets a label, on the outer ring.
  ORDER.filter((id) => !placed.has(id)).forEach((cat, i) =>
    chips.push({ cat, ring: rings.length - 1, phase: (0.29 + i * 0.137) % 1 })
  );
  chips.forEach((c, i) => {
    c.order = i;
  });

  const R = L.dial * s;
  const len = L.tick;
  const D = Math.ceil(R + len + 3);
  let gi = 0;
  const ticks = {};
  ORDER.forEach((id) => {
    ticks[id] = NAMES[id].map((_, j) => {
      const a = ((ARC[id].from + j) * SLOT * Math.PI) / 180;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      return {
        x1: (R * c).toFixed(2), y1: (R * sn).toFixed(2),
        x2: ((R + len) * c).toFixed(2), y2: ((R + len) * sn).toFixed(2),
        i: gi++,
      };
    });
  });

  const g = {
    mode, s, rings, chips, ticks, D,
    S: Math.ceil(outerR(L) * s + 4),
    lift: L.lift * s,
    roll: L.roll,
    ratio: L.ratio,
    disc: Math.round(L.disc * s),
    height: Math.round(L.height * Math.max(s, 0.85)),
    quiet: !!L.quiet,
  };
  GEO_CACHE.set(k, g);
  return g;
}

// cubic-bezier(.16, 1, .3, 1), the house ease-out-expo, for the entrance.
const bezier = (p1x, p1y, p2x, p2y) => {
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = X(t) - x;
      if (Math.abs(d) < 1e-5) break;
      t -= d / dX(t);
    }
    return Y(clamp(t, 0, 1));
  };
};
const ease = bezier(0.16, 1, 0.3, 1);

const noop = () => {};

// ---------------------------------------------------------------- component

export default function ToolsOrbit({ onPick }) {
  const [geo, setGeo] = useState(() => geometry('wide', 1));

  const stageRef = useRef(null);
  const poolsRef = useRef(null);
  const dialWrapRef = useRef(null);
  const dialRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const discRef = useRef(null);
  const chipRefs = useRef({});
  const dialGroupRefs = useRef({});
  const ringBackRefs = useRef([]);
  const ringFrontRefs = useRef([]);
  const beadRefs = useRef([]);

  // Set by the effect; the chips' pointer and focus handlers call it.
  const hoverRef = useRef(noop);
  // Orbit clock, bezel angle and birth time outlive a layout change.
  const clockRef = useRef(null);

  // Layout by the stage's width: two arrangements, each scaled to the room
  // it has, counting a little of the gutter it may spill into.
  useLayoutEffect(() => {
    const el = stageRef.current;
    let cur = 'wide:1';
    const measure = () => {
      const W = el.clientWidth;
      if (!W) return;
      const mode = W < WIDE_AT ? 'narrow' : 'wide';
      const L = LAYOUTS[mode];
      let s;
      if (mode === 'wide') {
        const b = el.getBoundingClientRect();
        const spare = clamp(Math.min(b.left, window.innerWidth - b.right) - 16, 0, 90);
        s = clamp((W / 2 + spare - L.chipHalf) / outerR(L), 0.7, 1);
      } else {
        s = clamp((W / 2 - L.chipHalf) / outerR(L), 0.85, 1.3);
      }
      s = Math.round(s * 50) / 50;
      const k = `${mode}:${s}`;
      if (k !== cur) {
        cur = k;
        setGeo(geometry(mode, s));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const G = geo;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const toRad = Math.PI / 180;

    const pools = poolsRef.current;
    const dialWrap = dialWrapRef.current;
    const dialSvg = dialRef.current;
    const svgBack = backRef.current;
    const svgFront = frontRef.current;
    const disc = discRef.current;
    const discFace = disc.firstElementChild;
    const groups = { ...dialGroupRefs.current };
    const ringEls = G.rings.map((_, i) => [ringBackRefs.current[i], ringFrontRefs.current[i]]);
    const chips = G.chips.map((p) => {
      const node = chipRefs.current[p.cat];
      return {
        ...p, r: G.rings[p.ring], node,
        inner: node.children[0], whisper: node.children[1], pop: node.children[2],
        x: 0, y: 0, z: 0, zi: -1, op: -1, toolIx: 0, front: false,
      };
    });
    const beads = G.rings.map((r, i) => ({ r, node: beadRefs.current[i], zi: -1 }));

    if (!clockRef.current) clockRef.current = { t: mq.matches ? 3 : 0, phi: PHI0, born: performance.now() };
    const C = clockRef.current;

    let W = stage.clientWidth;
    let ts = 1;
    let tsTarget = 1;
    let dim = 0;
    let dimTarget = 0;
    let hovered = null;
    let phiTarget = null;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };

    // ------------------------------------------------ bezel states
    const dialHot = (cat) => {
      dialSvg.classList.toggle('has-hot', !!cat);
      ORDER.forEach((id) => groups[id].classList.toggle('is-hot', id === cat));
    };
    const dialLit = (cat, idx, on) => {
      const line = idx >= 0 ? groups[cat].children[idx] : null;
      if (line) line.classList.toggle('is-lit', on);
    };

    // ------------------------------------------------ whisper: a real tool name surfaces from a label
    let wTimer = 0;
    let wActive = null;
    let wHold = 0;
    let lastCat = '';
    let wLit = null;
    const align = (node, c) => {
      node.classList.toggle('al-l', c.x < -W * 0.16);
      node.classList.toggle('al-r', c.x > W * 0.16);
    };
    const hideWhisper = () => {
      if (wActive) {
        wActive.whisper.classList.remove('is-on');
        wActive = null;
      }
      if (wLit) dialLit(wLit[0], wLit[1], false);
      wLit = null;
    };
    const showWhisper = () => {
      // A near-side label with clear air above it, so the name never lands on a neighbour.
      const cands = chips.filter(
        (c) =>
          c.z > 0.3 &&
          c.cat !== lastCat &&
          Math.abs(c.x) < W * 0.4 &&
          !chips.some((o) => o !== c && Math.abs(o.x - c.x) < 150 && o.y < c.y - 8 && o.y > c.y - 78)
      );
      if (!cands.length) return false;
      const c = cands[Math.floor(Math.random() * cands.length)];
      const list = PICK[c.cat].filter((n) => W >= WIDE_AT || n.length <= 16);
      if (!list.length) return false;
      const name = list[c.toolIx++ % list.length];
      c.whisper.textContent = name;
      align(c.whisper, c);
      c.whisper.classList.add('is-on');
      wLit = [c.cat, NAMES[c.cat].indexOf(name)];
      dialLit(wLit[0], wLit[1], true);
      wActive = c;
      wHold = 2.8;
      lastCat = c.cat;
      return true;
    };

    // ------------------------------------------------ hover card: above or below, three anchorings,
    // kept off the disc and inside the viewport
    // Call it once the card is shown: hidden cards are display:none, so they
    // add nothing to the page's scroll width, and measure as zero.
    const placePop = (c) => {
      const pw = c.pop.offsetWidth || (G.mode === 'wide' ? 236 : 204);
      const ph = c.pop.offsetHeight || 180;
      const gap = 30;
      const dr = discFace.offsetWidth / 2;
      const dy = -G.lift;
      const sr = stage.getBoundingClientRect();
      const cx0 = sr.left + sr.width / 2;
      const cy0 = sr.top + sr.height / 2;
      let best = null;
      [false, true].forEach((up) =>
        [0.5, 0.18, 0.82].forEach((ax) => {
          const x1 = c.x - ax * pw;
          const x2 = x1 + pw;
          const y1 = up ? c.y - gap - ph : c.y + gap;
          const y2 = y1 + ph;
          const ox = Math.max(0, Math.min(x2, dr * 0.9) - Math.max(x1, -dr * 0.9));
          const oy = Math.max(0, Math.min(y2, dy + dr * 0.9) - Math.max(y1, dy - dr * 0.9));
          let score = ox * oy;
          score +=
            60 *
            (Math.max(0, 16 - (cx0 + x1)) +
              Math.max(0, cx0 + x2 - (window.innerWidth - 16)) +
              Math.max(0, 80 - (cy0 + y1)) +
              Math.max(0, cy0 + y2 - window.innerHeight));
          score += Math.abs(ax - 0.5) * 400 + (up ? 150 : 0);
          if (!best || score < best.score) best = { score, up, ax };
        })
      );
      c.pop.classList.toggle('is-up', best.up);
      c.pop.classList.toggle('al-l', best.ax === 0.18);
      c.pop.classList.toggle('al-r', best.ax === 0.82);
    };

    // ------------------------------------------------ frame
    const project = (r, phase) => {
      const th = phase * Math.PI * 2;
      const x0 = r.R * Math.cos(th);
      const y0 = r.ry * Math.sin(th);
      const a = G.roll * toRad;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      return { x: x0 * ca - y0 * sa, y: x0 * sa + y0 * ca, z: Math.sin(th) };
    };

    const render = (dt, still) => {
      const now = mq.matches ? 1e9 : performance.now() - C.born;
      const k = still ? 1 : 1 - Math.exp(-dt / 0.45);
      ptr.x += (ptr.tx - ptr.x) * k;
      ptr.y += (ptr.ty - ptr.y) * k;
      const gRoll = ptr.x * 2.2;
      const ox = ptr.x * 10;
      const oy = ptr.y * 8;

      const ringT = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0) rotate(${gRoll.toFixed(3)}deg)`;
      svgBack.style.transform = ringT;
      svgFront.style.transform = ringT;
      disc.style.transform = `translate3d(${(ptr.x * 5).toFixed(2)}px, ${(ptr.y * 4 - G.lift).toFixed(2)}px, 0)`;
      pools.style.translate = `${(ptr.x * -6).toFixed(2)}px ${(ptr.y * -5 - G.lift).toFixed(2)}px`;

      dim += (dimTarget - dim) * (still ? 1 : 1 - Math.exp(-dt / 0.22));

      // The bezel drifts with the orbit clock; on hover it swings the category's arc to the front.
      if (phiTarget !== null) C.phi += (phiTarget - C.phi) * (still ? 1 : 1 - Math.exp(-dt / 0.35));
      else C.phi += dt * ts * (360 / 160);
      dialWrap.style.transform =
        `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0) rotate(${(G.roll + gRoll).toFixed(3)}deg) ` +
        `scale(1, ${G.ratio}) rotate(${C.phi.toFixed(3)}deg)`;

      const g = gRoll * toRad;
      const cg = Math.cos(g);
      const sg = Math.sin(g);
      chips.forEach((c) => {
        // Entrance: labels sweep a little way along their orbit into place, staggered.
        const e = ease(clamp((now - 1150 - c.order * 85) / 1500, 0, 1));
        const p = project(c.r, c.phase + C.t / c.r.period - (1 - e) * 0.09);
        c.x = p.x;
        c.y = p.y;
        c.z = p.z;
        const depth = (p.z + 1) / 2;
        const s = (0.86 + 0.14 * depth) * (0.72 + 0.28 * e);
        const X = p.x * cg - p.y * sg + ox;
        const Y = p.x * sg + p.y * cg + oy;
        c.node.style.transform = `translate3d(${X.toFixed(2)}px, ${Y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
        // Far side stays readable: never below 0.85 unless another label is hovered.
        let op = (0.85 + 0.15 * depth) * e;
        if (c === hovered) op = e;
        else op *= 1 - 0.5 * dim;
        op = Math.round(op * 1000) / 1000;
        if (op !== c.op) {
          c.inner.style.opacity = op;
          c.op = op;
        }
        let zi;
        if (c === wActive) zi = 40;
        else if (p.z < 0) zi = 5 + Math.round((p.z + 1) * 6);
        else zi = 22 + Math.round(p.z * 8);
        if (zi !== c.zi) {
          c.node.style.zIndex = zi;
          c.zi = zi;
        }
        // Its arc on the bezel warms while the label passes the front.
        const front = c.front ? p.z > 0.94 : p.z > 0.965 && e > 0.9;
        if (front !== c.front) {
          c.front = front;
          groups[c.cat].classList.toggle('is-front', front);
        }
      });

      const be = clamp((now - 2400) / 800, 0, 1);
      beads.forEach((b) => {
        const p = project(b.r, b.r.bead + C.t / (b.r.period * 0.55));
        const X = p.x * cg - p.y * sg + ox;
        const Y = p.x * sg + p.y * cg + oy;
        b.node.style.transform = `translate3d(${X.toFixed(2)}px, ${Y.toFixed(2)}px, 0) scale(${(0.8 + 0.2 * (p.z + 1) / 2).toFixed(3)})`;
        b.node.style.opacity = ((0.35 + 0.55 * (p.z + 1) / 2) * be).toFixed(3);
        const zi = p.z < 0 ? 4 : 21;
        if (zi !== b.zi) {
          b.node.style.zIndex = zi;
          b.zi = zi;
        }
      });
    };

    // ------------------------------------------------ loop
    let raf = 0;
    let last = 0;
    let running = false;
    let onScreen = false;

    const frame = (ms) => {
      const dt = clamp((ms - last) / 1000, 0, 0.25);
      last = ms;
      ts += (tsTarget - ts) * (1 - Math.exp(-dt / 0.28));
      if (Math.abs(ts - tsTarget) < 0.001) ts = tsTarget;
      C.t += dt * ts;
      render(dt, false);

      // Whisper cadence, only while the orbit turns freely.
      if (!hovered && !G.quiet && performance.now() - C.born > 2800) {
        if (wActive) {
          wHold -= dt;
          if (wHold <= 0 || wActive.z < 0.08) {
            hideWhisper();
            wTimer = 1.2;
          }
        } else {
          wTimer -= dt;
          if (wTimer <= 0 && !showWhisper()) wTimer = 0.5;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || mq.matches || document.hidden || !onScreen) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // ------------------------------------------------ hover and focus
    const setHover = (cat) => {
      const c = cat ? chips.find((x) => x.cat === cat) || null : null;
      if (c === hovered) return;
      if (hovered) {
        hovered.node.classList.remove('is-hover');
        ringEls[hovered.ring].forEach((el) => el.classList.remove('is-hot'));
      }
      hovered = c;
      tsTarget = c ? 0 : 1;
      dimTarget = c ? 1 : 0;
      dialHot(c ? c.cat : null);
      if (c) {
        c.node.classList.add('is-hover');
        placePop(c);
        ringEls[c.ring].forEach((el) => el.classList.add('is-hot'));
        hideWhisper();
        const want = 90 - ARC[c.cat].mid;
        phiTarget = C.phi + ((((want - C.phi) % 360) + 540) % 360) - 180;
      } else {
        phiTarget = null;
      }
      if (!running) {
        ts = tsTarget;
        dim = dimTarget;
        if (phiTarget !== null) C.phi = phiTarget;
        render(0, true);
      }
    };
    hoverRef.current = setHover;

    // ------------------------------------------------ listeners
    const onVisibility = () => (document.hidden ? stop() : start());
    const onReduce = () => {
      if (mq.matches) {
        stop();
        hideWhisper();
        C.t = 3;
        C.phi = hovered ? C.phi : PHI0;
        ts = tsTarget;
        dim = dimTarget;
        render(0, true);
      } else {
        start();
      }
    };
    const io = new IntersectionObserver(([en]) => {
      onScreen = en.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    const ro = new ResizeObserver(() => {
      W = stage.clientWidth;
    });

    // A little pointer depth across the hero, mouse only.
    const zone = stage.closest('section') || stage;
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || !running) return;
      const b = stage.getBoundingClientRect();
      ptr.tx = clamp((e.clientX - (b.left + b.width / 2)) / (b.width * 0.9), -1, 1);
      ptr.ty = clamp((e.clientY - (b.top + b.height / 2)) / (b.height * 0.9), -1, 1);
    };
    const onLeave = () => {
      ptr.tx = 0;
      ptr.ty = 0;
    };

    // Holds still while nobody is using the page (lib/idleMotion.js).
    const onIdle = () => stop();
    const onActive = () => start();
    window.addEventListener('cx:idle', onIdle);
    window.addEventListener('cx:active', onActive);
    document.addEventListener('visibilitychange', onVisibility);
    mq.addEventListener('change', onReduce);
    zone.addEventListener('pointermove', onMove, { passive: true });
    zone.addEventListener('pointerleave', onLeave);
    io.observe(stage);
    ro.observe(stage);

    render(0, true);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('cx:idle', onIdle);
      window.removeEventListener('cx:active', onActive);
      document.removeEventListener('visibilitychange', onVisibility);
      mq.removeEventListener('change', onReduce);
      zone.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerleave', onLeave);
      hoverRef.current = noop;
      hideWhisper();
      chips.forEach((c) => c.node.classList.remove('is-hover'));
      ringEls.forEach((pair) => pair.forEach((el) => el.classList.remove('is-hot')));
      dialSvg.classList.remove('has-hot');
      ORDER.forEach((id) => groups[id].classList.remove('is-hot', 'is-front'));
    };
  }, [geo]);

  const hover = (cat) => (e) => {
    if (e.pointerType === 'mouse') hoverRef.current(cat);
  };

  const { S, D, roll } = geo;

  return (
    <div className={`lx-to lx-to--${geo.mode}`}>
      <div
        ref={stageRef}
        className="lx-to-stage"
        style={{ height: geo.height, '--r': `${geo.disc}px` }}
        role="group"
        aria-label={`${TOTAL} free tools across ${ORDER.length} categories`}
      >
        <div className="lx-to-pools" ref={poolsRef} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        <div className="lx-to-dial-wrap" ref={dialWrapRef} style={{ margin: `${-D}px 0 0 ${-D}px` }} aria-hidden="true">
          <svg className="lx-to-dial" ref={dialRef} width={D * 2} height={D * 2} viewBox={`${-D} ${-D} ${D * 2} ${D * 2}`} focusable="false">
            {ORDER.map((id) => (
              <g
                key={id}
                ref={(n) => {
                  dialGroupRefs.current[id] = n;
                }}
              >
                {geo.ticks[id].map((tk) => (
                  <line key={tk.i} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2} style={{ '--i': tk.i }} />
                ))}
              </g>
            ))}
          </svg>
        </div>

        <svg
          className="lx-to-rings lx-to-rings--back"
          ref={backRef}
          width={S * 2}
          height={S * 2}
          viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`}
          style={{ margin: `${-S}px 0 0 ${-S}px` }}
          aria-hidden="true"
          focusable="false"
        >
          {geo.rings.map((r, i) => (
            <g
              key={i}
              transform={`rotate(${roll})`}
              ref={(n) => {
                ringBackRefs.current[i] = n;
              }}
            >
              <ellipse className="lx-to-r-line" rx={r.R} ry={r.ry} pathLength="1" style={{ '--d': `${420 + i * 160}ms` }} />
              <ellipse className="lx-to-r-hot" rx={r.R} ry={r.ry} />
            </g>
          ))}
        </svg>

        <div className="lx-to-disc-pos" ref={discRef} aria-hidden="true">
          <div className="lx-to-disc">
            <span className="lx-to-disc-k">Tools</span>
            <span className="lx-to-disc-n">
              {String(TOTAL)
                .split('')
                .map((d, i) => (
                  <span key={i} style={{ '--i': i }}>
                    {d}
                  </span>
                ))}
            </span>
            <span className="lx-to-disc-k lx-to-disc-sub">
              <i />
              {ORDER.length} categories
              <i />
            </span>
          </div>
        </div>

        <svg
          className="lx-to-rings lx-to-rings--front"
          ref={frontRef}
          width={S * 2}
          height={S * 2}
          viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`}
          style={{ margin: `${-S}px 0 0 ${-S}px` }}
          aria-hidden="true"
          focusable="false"
        >
          {geo.rings.map((r, i) => {
            // Near half of the ellipse, before the roll: (R,0) through (0,ry) to (-R,0).
            const d = `M ${r.R} 0 A ${r.R} ${r.ry} 0 0 1 ${-r.R} 0`;
            return (
              <g
                key={i}
                transform={`rotate(${roll})`}
                ref={(n) => {
                  ringFrontRefs.current[i] = n;
                }}
              >
                <path className="lx-to-r-line" d={d} />
                <path className="lx-to-r-hot" d={d} />
              </g>
            );
          })}
        </svg>

        {geo.rings.map((_, i) => (
          <i
            key={i}
            className="lx-to-bead"
            aria-hidden="true"
            ref={(n) => {
              beadRefs.current[i] = n;
            }}
          />
        ))}

        {ORDER.map((id) => {
          if (!geo.chips.some((c) => c.cat === id)) return null;
          const Icon = CATEGORY_ICONS[id] || Wrench;
          const count = NAMES[id].length;
          const lead = PICK[id].slice(0, 3);
          return (
            <a
              key={id}
              className="lx-to-chip"
              href={`#cat-${id}`}
              aria-label={`${LABEL[id]}, ${count} tools`}
              ref={(n) => {
                chipRefs.current[id] = n;
              }}
              onPointerEnter={hover(id)}
              onPointerLeave={hover(null)}
              onFocus={() => hoverRef.current(id)}
              onBlur={() => hoverRef.current(null)}
              onClick={() => onPick && onPick(id)}
            >
              <span className="lx-to-chip-in" aria-hidden="true">
                <Icon size={16} strokeWidth={1.4} />
                <span className="lx-to-chip-name">{LABEL[id]}</span>
                <span className="lx-to-chip-n">{count}</span>
              </span>
              <span className="lx-to-whisper" aria-hidden="true" />
              <span className="lx-to-pop" aria-hidden="true">
                <span className="lx-to-pop-k">
                  {LABEL[id]} <span>{count} tools</span>
                </span>
                <ul>
                  {lead.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <span className="lx-to-pop-more">
                  <span>{count > lead.length ? `+${count - lead.length} more` : 'All free'}</span>
                  <span>
                    See all <ArrowRight size={12} strokeWidth={1.6} />
                  </span>
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
