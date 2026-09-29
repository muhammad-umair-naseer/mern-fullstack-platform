import React, { memo, useLayoutEffect, useRef } from 'react';
import { liveTools } from '../data/tools';
import { SITE_URL } from '../seo/site';
import CertificateFrame from '../learn/CertificateFrame';
import './HeroReel.css';

/**
 * The home hero's product reel: four short scenes of things Cortexis actually
 * ships, played on one glass browser and one glass phone.
 *
 *   01  a WhatsApp bot answers a clinic's patient and books the slot
 *   02  the free PDF Compressor and QR Generator doing their jobs
 *   03  the last question of a free course's final exam, then the certificate
 *   04  a client's web app: an admin dashboard and its phone companion
 *
 * The markup is static. One layout effect owns a small keyframe engine that
 * writes transform, opacity and text straight to the nodes on each frame, so
 * React never re-renders while it plays. The scene is drawn on a fixed design
 * canvas (1344 x 756, or 450 x 562 on a portrait panel) and scaled to cover
 * the frame. It stops when the tab is hidden or the panel is off screen, can
 * be paused, and under reduced motion shows one composed still whose scene
 * buttons still work.
 */

const TOOL_COUNT = liveTools().length;

/* ── Easing ───────────────────────────────────────────────────────────── */

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const e = X(t) - x;
      if (Math.abs(e) < 1e-5) return Y(t);
      const d = dX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 24; i += 1) {
      if (X(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return Y(t);
  };
}

const OUT = bezier(0.16, 1, 0.3, 1);
const INOUT = bezier(0.65, 0, 0.35, 1);
const LIN = (x) => x;
const STEP = 'step';

/* ── Timeline ─────────────────────────────────────────────────────────── */

// Each scene holds, then the camera moves on at M[i] for MD seconds.
// M[3] wraps scene four back to scene one.
const MD = 1.2;
const M = [4.9, 9.9, 15.2, 20.4];
const CYCLE = +(M[3] + MD).toFixed(2);
const START = [0, M[0] + 0.2, M[1] + 0.2, M[2] + 0.2, CYCLE];
// A settled frame of each scene: paused seeks and the reduced-motion still.
const COMPOSED = [4.6, 9.6, 14.9, 20.1];
const STILL = COMPOSED[0];

function val(k, t) {
  if (t <= k[0][0]) return k[0][1];
  const n = k.length;
  if (t >= k[n - 1][0]) return k[n - 1][1];
  let i = 1;
  while (k[i][0] <= t) i += 1;
  const a = k[i - 1];
  const b = k[i];
  const ease = b[2] || OUT;
  if (ease === STEP) return a[1];
  const p = (t - a[0]) / (b[0] - a[0]);
  return a[1] + (b[1] - a[1]) * ease(p);
}

// Device poses per scene, in design px from the stage centre.
const LAYOUT = {
  desk: {
    w: 1344,
    h: 756,
    browser: [{ x: 176, y: -30, s: 0.88 }, { x: -110, y: -22, s: 1 }, { x: -150, y: -34, s: 0.94 }, { x: -84, y: -22, s: 1 }],
    phone: [{ x: -272, y: -36, s: 0.96 }, { x: 408, y: 4, s: 0.86 }, { x: 760, y: 60, s: 0.8, o: 0 }, { x: 466, y: 8, s: 0.9 }],
    cert: { x: 300, y: 44, s: 1, r: -2.5, fx: 150, fy: 100, ox: 580, oy: 120 },
    chipA: [96, 318],
    chipC: [936, 82],
    chatScroll: 0,
  },
  mob: {
    w: 450,
    h: 562,
    browser: [{ x: -30, y: -90, s: 0.44, o: 0 }, { x: 0, y: -50, s: 0.5 }, { x: 0, y: -70, s: 0.5 }, { x: -92, y: -64, s: 0.46 }],
    phone: [{ x: 0, y: 118, s: 1.1 }, { x: 132, y: 150, s: 0.62 }, { x: 330, y: 170, s: 0.5, o: 0 }, { x: 46, y: 112, s: 1.0 }],
    cert: { x: 8, y: 132, s: 0.65, r: -2.5, fx: 0, fy: 190, ox: 260, oy: 200 },
    chipA: null,
    chipC: [16, 400],
    chatScroll: 96,
  },
};

/* ── Generated art, computed once ─────────────────────────────────────── */

// A QR-shaped pattern: real finder and timing marks, seeded fill.
function qrPath(seed, n) {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const finder = (r, c) => r >= 0 && r < 7 && c >= 0 && c < 7 && (r === 0 || r === 6 || c === 0 || c === 6 || (r > 1 && r < 5 && c > 1 && c < 5));
  const inFinder = (r, c) => (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);
  let d = '';
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      let on;
      if (inFinder(r, c)) on = finder(r, c) || finder(r, c - (n - 7)) || finder(r - (n - 7), c);
      else if (r === 6) on = c % 2 === 0;
      else if (c === 6) on = r % 2 === 0;
      else if (r >= n - 9 && r < n - 4 && c >= n - 9 && c < n - 4) on = r === n - 9 || r === n - 5 || c === n - 9 || c === n - 5 || (r === n - 7 && c === n - 7);
      else on = rnd() > 0.52;
      if (on) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return d;
}

const QR_BIG = qrPath(7, 25);
const QR_CERT = qrPath(31, 21);

const Qr = ({ d, n, fill = '#16130F' }) => (
  <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} shapeRendering="crispEdges">
    <path d={d} fill={fill} />
  </svg>
);

// Thirty days of revenue for the dashboard chart.
const REV = [22, 26, 24, 31, 29, 35, 33, 30, 38, 41, 37, 44, 42, 47, 45, 52, 49, 55, 51, 58, 62, 57, 64, 61, 68, 72, 67, 75, 79, 84];
const CW = 100;
const CH = 100;
const chartY = (v) => CH - (v / 92) * CH;
const REV_LINE = REV.map((v, i) => `${i ? 'L' : 'M'}${((i / (REV.length - 1)) * CW).toFixed(2)} ${chartY(v).toFixed(2)}`).join(' ');

const BAR_H = [34, 52, 41, 60, 48, 72, 58, 66, 80, 62, 88, 96];

// The certificate is issued the moment the exam is passed, so it carries
// today's date, written the way the real sheet writes it.
const CERT_CODE = 'CTX-7F3A-9C21D4';
const ISSUED = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// The QR Generator is shown making a code for this site's own address. The
// clinic in scene one is left unnamed on purpose: a real practice's name there
// would read as a client the studio does not have.
const QR_TEXT = SITE_URL.replace(/^https?:\/\//, '');

/* ── Content ──────────────────────────────────────────────────────────── */

const SCENES = [
  { a: 'WhatsApp', b: 'bots', label: 'Show WhatsApp bots' },
  { a: 'Free', b: 'tools', label: 'Show free tools' },
  { a: 'Free', b: 'courses', label: 'Show free courses' },
  { a: 'Web', b: 'apps', label: 'Show web apps' },
];

const URLS = ['yourbot / bookings', 'cortexis / tools / pdf-compressor', 'cortexis / courses / python-development', 'saffron-crafts / admin'];

// [booked by the bot, day, start slot, length, what, who]
const EVENTS = [
  [true, 0, 1, 1, 'Checkup', 'Sana M.'],
  [false, 0, 4, 1.5, 'Root canal', 'Kamran A.'],
  [true, 1, 0.5, 1, 'Cleaning', 'Omar F.'],
  [true, 1, 5, 1, 'Consult', 'Bilal H.'],
  [false, 2, 2, 1.5, 'Braces', 'Maham R.'],
  [true, 3, 4, 1, 'Whitening', 'Zara K.'],
  [true, 3, 5.5, 1, 'Filling', 'Usman T.'],
  [true, 4, 0, 1, 'Checkup', 'Adeel S.'],
  [false, 4, 3.5, 1.5, 'Implant', 'Rabia N.'],
  [true, 5, 1, 1, 'Cleaning', 'Faraz Q.'],
  [true, 5, 4, 1, 'Checkup', 'Hina J.'],
];

// The first six of the Python Development course's twelve chapters.
const CHAPTERS = [
  'Python Fundamentals',
  'Functions, Scope, and Modules',
  'Objects, Classes, and Dunder Methods',
  'Files, JSON, and Failing Well',
  'The Standard Library, HTTP, and Tests',
  'Performance, Concurrency, and the GIL',
];

const KPIS = [
  ['Revenue', 'PKR 4.82M', '+12.4%'],
  ['Orders', '1,284', '+8.1%'],
  ['Avg. order', 'PKR 3,754', '+3.9%'],
  ['Returning', '38%', '+5 pts'],
];

const ORDERS = [
  ['#1284', 'Fatima R. · Pakistan', 'PKR 6,400', 'Paid', 'rl-st-paid', '2 min ago'],
  ['#1283', 'Hamza K. · Lahore', 'PKR 2,150', 'Shipped', 'rl-st-ship', '14 min ago'],
  ['#1282', 'Areeba S. · Karachi', 'PKR 8,900', 'Delivered', 'rl-st-done', '1 h ago'],
];

const APP_ORDERS = [
  ['Brass lamp, small', '#1284 · Fatima R.', '6,400', '#F1EBE1'],
  ['Block-print cushion', '#1283 · Hamza K.', '2,150', '#E9DCCB'],
  ['Onyx coaster set', '#1282 · Areeba S.', '8,900', '#DDE3D6'],
];

/* ── Icons ────────────────────────────────────────────────────────────── */

const Check = ({ w = 3.4 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5 9-10" />
  </svg>
);

const Lock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const Reply = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 6 6v5" />
  </svg>
);

const Download = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);

const Read = () => (
  <svg viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="m1 5 3 3 5-6M7 8l1 0 5-6" />
  </svg>
);

const Cursor = ({ k }) => (
  <svg className="rl-cursor" data-k={k} viewBox="0 0 24 24">
    <path d="M4 2.5v17.2l4.6-4.3 2.9 6.6 3.1-1.4-2.9-6.4h6.5z" fill="#16130F" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const Status = ({ time }) => (
  <div className="rl-status">
    <span>{time}</span>
    <span className="rl-status-ic">
      <svg viewBox="0 0 18 10">
        <rect x="0" y="7" width="3" height="3" rx=".6" fill="#16130F" />
        <rect x="5" y="4.5" width="3" height="5.5" rx=".6" fill="#16130F" />
        <rect x="10" y="2" width="3" height="8" rx=".6" fill="#16130F" />
        <rect x="15" y="0" width="3" height="10" rx=".6" fill="#16130F" opacity=".35" />
      </svg>
      <svg viewBox="0 0 24 11">
        <rect x=".5" y=".5" width="20" height="10" rx="3" fill="none" stroke="#16130F" opacity=".4" />
        <rect x="2" y="2" width="14" height="7" rx="1.6" fill="#16130F" />
        <rect x="21.5" y="3.5" width="2" height="4" rx="1" fill="#16130F" opacity=".4" />
      </svg>
    </span>
  </div>
);

/* ── Engine ───────────────────────────────────────────────────────────── */

function runReel(root) {
  const $ = {};
  root.querySelectorAll('[data-k]').forEach((el) => {
    $[el.dataset.k] = el;
  });
  const segs = Array.from(root.querySelectorAll('[data-scene]'));
  const segFill = segs.map((s) => s.firstElementChild);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = mq.matches;

  // Last written values, so a frame only touches what changed.
  const lastTf = new WeakMap();
  const lastOp = new WeakMap();
  const lastTx = new WeakMap();

  let T = [];
  const S = new Map();
  const tr = (el, p, k, extra) => {
    if (el) T.push({ el, p, k, ...extra });
  };

  // Fades and rises an element in at tin; optional exit at tout, optional hard reset.
  const appear = (el, tin, o = {}) => {
    if (!el) return;
    const dy = o.dy ?? 10;
    const dx = o.dx ?? 0;
    const s0 = o.s0 ?? 1;
    const dur = o.dur ?? 0.7;
    const out = o.tout != null;
    const od = o.od ?? 0.4;
    const rs = o.reset;
    const mk = (from, to, fdur, outTo) => {
      const k = [[tin, from], [tin + fdur, to, OUT]];
      if (out) k.push([o.tout, to], [o.tout + od, outTo, OUT]);
      if (rs != null) k.push([rs, out ? outTo : to], [rs + 0.001, from, STEP]);
      return k;
    };
    tr(el, 'o', mk(0, 1, dur * 0.55, 0));
    if (dy) tr(el, 'y', mk(dy, 0, dur, o.dyOut ?? 0));
    if (dx) tr(el, 'x', mk(dx, 0, dur, o.dxOut ?? 0));
    if (s0 !== 1) tr(el, 's', mk(s0, 1, dur, o.sOut ?? 1));
  };
  const num = (el, k, f) => tr(el, 'n', k, { f });
  const type = (el, k, full) => tr(el, 'ty', k, { full });

  // Holds each scene's pose and glides between them, wrapping four back to one.
  const poseTrack = (el, poses) => {
    const at = (i) => ({ x: 0, y: 0, s: 1, o: 1, r: 0, ...poses[i] });
    const seq = [[0, at(0)], [M[0], at(0)], [M[0] + MD, at(1)], [M[1], at(1)], [M[1] + MD, at(2)], [M[2], at(2)], [M[2] + MD, at(3)], [M[3], at(3)], [CYCLE, at(0)]];
    ['x', 'y', 's', 'o', 'r'].forEach((p) => tr(el, p, seq.map(([t, v]) => [t, v[p]])));
  };

  // A screen that dissolves in and out with its scene, settling from a slight zoom.
  const sceneLayer = (el, i, zoom = 1.025) => {
    if (!el) return;
    if (i === 0) {
      tr(el, 'o', [[0, 1], [M[0], 1], [M[0] + 0.4, 0], [M[3], 0], [M[3] + 0.45, 1]]);
      tr(el, 's', [[0, 1], [M[3], 1], [M[3] + 0.001, zoom, STEP], [M[3] + 0.9, 1]]);
      return;
    }
    const a = M[i - 1];
    const b = M[i];
    tr(el, 'o', [[a, 0], [a + 0.4, 1], [b, 1], [b + 0.4, 0]]);
    tr(el, 's', [[a, zoom], [a + 0.9, 1]]);
  };

  // Short labels swap in sequence, old out then new in, so text never overlaps text.
  const swapLabel = (el, i, dy, inDur) => {
    if (!el) return;
    if (i === 0) {
      tr(el, 'o', [[0, 1], [M[0], 1], [M[0] + 0.2, 0], [M[3] + 0.3, 0], [M[3] + 0.3 + inDur, 1]]);
      tr(el, 'y', [[0, 0], [M[0], 0], [M[0] + 0.25, -dy], [M[3] + 0.3, dy, STEP], [M[3] + 0.3 + inDur * 1.6, 0]]);
      return;
    }
    const a = M[i - 1] + 0.3;
    const b = M[i];
    tr(el, 'o', [[a, 0], [a + inDur, 1], [b, 1], [b + 0.2, 0]]);
    tr(el, 'y', [[a, dy], [a + inDur * 1.6, 0], [b, 0], [b + 0.25, -dy]]);
  };

  let mode = '';

  function build() {
    T = [];
    S.clear();
    const L = LAYOUT[mode];
    const [M0, M1, M2, M3] = M;

    // Backdrops: bg0 is the floor, each later one fades over it, and scene four
    // fades away to reveal scene one again.
    tr($.bg0, 's', [[0, 1.06], [M0 + MD, 1.0, LIN], [M3, 1.07, STEP], [CYCLE, 1.06, LIN]]);
    [1, 2].forEach((i) => {
      const a = M[i - 1];
      const b = M[i] + MD;
      tr($[`bg${i}`], 'o', [[a, 0], [a + MD, 1], [b, 1], [b + 0.01, 0, STEP]]);
      tr($[`bg${i}`], 's', [[a, 1.08], [b, 1.0, LIN]]);
    });
    tr($.bg3, 'o', [[M2, 0], [M2 + MD, 1], [M3, 1], [CYCLE, 0]]);
    tr($.bg3, 's', [[M2, 1.08], [CYCLE, 1.0, LIN]]);

    // Camera: the devices glide between poses.
    poseTrack($.browser, L.browser);
    poseTrack($.phone, L.phone);

    // A glass sheen sweeps across the frames on every move.
    [[$.bSheen, 880], [$.pSheen, 260]].forEach(([el, w]) => {
      const k = [[0, -w * 0.4]];
      const ko = [[0, 0]];
      M.forEach((b) => {
        k.push([b, -w * 0.4, STEP], [b + 1.3, w * 1.1, INOUT]);
        ko.push([b, 0], [b + 0.3, 0.9, LIN], [b + 1.1, 0.9], [b + 1.3, 0, LIN]);
      });
      tr(el, 'x', k);
      tr(el, 'o', ko);
    });

    [0, 1, 2, 3].forEach((i) => {
      swapLabel($[`u${i}`], i, 6, 0.35);
      swapLabel($[`cap${i}`], i, 18, 0.7);
      sceneLayer($[`b${i}`], i);
    });
    sceneLayer($.p0, 0);
    tr($.p1, 'o', [[M0 + 0.1, 0], [M0 + 0.6, 1], [M2 + 0.3, 1], [M2 + 0.8, 0]]);
    tr($.p3, 'o', [[M2 + 0.3, 0], [M2 + 0.9, 1], [M3 + 0.1, 1], [M3 + 0.6, 0]]);

    /* 01: the WhatsApp bot answers and books */
    const R = 12;
    appear($.r1, 0.3, { dy: 10, s0: 0.94, reset: R });
    appear($.ty1, 0.7, { dy: 6, s0: 0.9, tout: 1.2, od: 0.12 });
    appear($.l1, 1.25, { dy: 10, s0: 0.94, reset: R });
    tr($.tap, 's', [[2.0, 0.2], [2.5, 1.7]]);
    tr($.tap, 'o', [[0, 0], [2.0, 0, STEP], [2.07, 0.6, LIN], [2.5, 0]]);
    appear($.hit, 2.05, { dy: 0, dur: 0.4, reset: R });
    appear($.r2, 2.3, { dy: 10, s0: 0.94, reset: R });
    appear($.ty2, 2.55, { dy: 6, s0: 0.9, tout: 2.95, od: 0.12 });
    appear($.l2, 3.0, { dy: 12, s0: 0.93, reset: R });
    // The chat scrolls to keep the newest message in view, as a real one does.
    tr($.chatIn, 'y', [[2.95, 0], [3.6, -L.chatScroll, OUT], [R, -L.chatScroll], [R + 0.001, 0, STEP]]);
    appear($.evNew, 3.3, { dy: -26, s0: 1.08, dur: 0.8, reset: R });
    tr($.evRing, 's', [[3.5, 1], [4.3, 1.12]]);
    tr($.evRing, 'o', [[0, 0], [3.5, 0, STEP], [3.58, 0.9, LIN], [4.3, 0]]);
    num($.ybCount, [[0, 13], [3.4, 14, STEP], [R, 14], [R + 0.001, 13, STEP]], (v) => String(Math.round(v)));
    num($.ybOpen, [[0, 6], [3.4, 5, STEP], [R, 5], [R + 0.001, 6, STEP]], (v) => String(Math.round(v)));
    appear($.ybPlus, 3.4, { dy: 6, s0: 0.7, tout: 4.5 });
    const ca = $.chipA;
    if (L.chipA) {
      ca.style.left = `${L.chipA[0]}px`;
      ca.style.top = `${L.chipA[1]}px`;
      ca.style.display = '';
      appear(ca, 1.6, { dy: 16, s0: 0.92, dur: 0.8, tout: M0 + 0.05, od: 0.35, dyOut: -8 });
    } else {
      ca.style.display = 'none';
    }

    /* 02: the PDF Compressor, then the QR Generator */
    const g = M0;
    tr($.ghost, 'o', [[g + 0.35, 0], [g + 0.5, 1], [g + 0.9, 1], [g + 1.05, 0]]);
    tr($.ghost, 'x', [[g + 0.35, 60], [g + 0.9, -436, OUT]]);
    tr($.ghost, 'y', [[g + 0.35, -30], [g + 0.9, 176, OUT]]);
    tr($.ghost, 's', [[g + 0.35, 1.04], [g + 0.85, 1], [g + 1.05, 0.82]]);
    tr($.dzHot, 'o', [[g + 0.6, 0], [g + 0.75, 1], [g + 0.92, 1], [g + 1.15, 0]]);
    tr($.dzIdle, 'o', [[g + 0.85, 1], [g + 1.0, 0]]);
    appear($.fState, g + 0.9, { dy: 8, dur: 0.6 });
    tr($.progFill, 'sx', [[g + 0.95, 0], [g + 1.55, 1, INOUT]]);
    num($.pct, [[g + 0.95, 0], [g + 1.55, 100, INOUT]], (v) => `${Math.round(v)}%`);
    num($.fSize, [[g + 0.95, 2.4], [g + 1.55, 0.64, INOUT]], (v) => (v >= 1 ? `${v.toFixed(1)} MB` : `${Math.round(v * 1000)} KB`));
    tr($.progRow, 'o', [[g + 1.57, 1], [g + 1.7, 0]]);
    tr($.progRow, 'y', [[g + 1.57, 0], [g + 1.7, -6]]);
    appear($.result, g + 1.62, { dy: 14, dur: 0.7 });
    tr($.scan, 'x', [[g + 0.95, -100], [g + 1.55, 330, INOUT]]);
    tr($.scan, 'o', [[g + 0.9, 0], [g + 1.0, 1], [g + 1.47, 1], [g + 1.57, 0]]);
    for (let i = 0; i < 6; i += 1) appear($[`ok${i}`], g + 1.05 + i * 0.08, { dy: 0, s0: 0.3, dur: 0.5 });
    const cc = $.chipC;
    cc.style.left = `${L.chipC[0]}px`;
    cc.style.top = `${L.chipC[1]}px`;
    appear(cc, g + 1.8, { dy: 16, s0: 0.9, dur: 0.8, tout: M1 + 0.05, od: 0.35, dyOut: -8 });
    type($.qrType, [[g + 2.1, 0], [g + 2.95, QR_TEXT.length, LIN]], QR_TEXT);
    tr($.genBtn, 's', [[g + 3.0, 1], [g + 3.07, 0.95, LIN], [g + 3.35, 1]]);
    tr($.qrCover, 'y', [[g + 3.15, 0], [g + 3.95, 172, INOUT]]);
    appear($.qrDl, g + 4.0, { dy: 8, dur: 0.6 });

    /* 03: the final exam's last answer, then the certificate */
    const x = M1;
    tr($.exCur, 'o', [[x + 0.5, 0], [x + 0.7, 1], [x + 1.8, 1], [x + 2.05, 0]]);
    tr($.exCur, 'x', [[x + 0.5, 470], [x + 1.15, 46, OUT]]);
    tr($.exCur, 'y', [[x + 0.5, 430], [x + 1.15, 226, OUT]]);
    tr($.exCur, 's', [[x + 1.18, 1], [x + 1.25, 0.84, LIN], [x + 1.4, 1]]);
    tr($.exRip, 's', [[x + 1.25, 0.3], [x + 1.75, 1.6]]);
    tr($.exRip, 'o', [[0, 0], [x + 1.25, 0, STEP], [x + 1.3, 0.55, LIN], [x + 1.75, 0]]);
    appear($.optSel, x + 1.28, { dy: 0, dur: 0.35 });
    appear($.optChk, x + 1.32, { dy: 0, s0: 0.3, dur: 0.5 });
    appear($.optOk, x + 1.4, { dy: 0, dx: -8, dur: 0.5 });
    appear($.seg20, x + 1.35, { dy: 0, dur: 0.3 });
    appear($.passed, x + 1.7, { dy: 26, s0: 0.97, dur: 0.8 });
    num($.score, [[x + 1.75, 0], [x + 2.4, 96, OUT]], (v) => `${Math.round(v)}%`);
    const C = L.cert;
    const cert = $.cert;
    tr(cert, 'o', [[x + 2.15, 0], [x + 2.5, 1, OUT], [M2, 1], [M2 + 0.7, 0, OUT]]);
    tr(cert, 'x', [[x + 2.15, C.fx], [x + 3.05, C.x, OUT], [M2, C.x], [M2 + 1.1, C.ox, OUT]]);
    tr(cert, 'y', [[x + 2.15, C.fy], [x + 3.05, C.y, OUT], [M2, C.y], [M2 + 1.1, C.oy, OUT]]);
    tr(cert, 'r', [[x + 2.15, 7], [x + 3.05, C.r, OUT], [M2, C.r], [M2 + 1.1, 5, OUT]]);
    tr(cert, 's', [[x + 2.15, C.s * 0.9], [x + 3.05, C.s, OUT]]);
    type($.certCode, [[x + 2.7, 0], [x + 3.4, CERT_CODE.length, LIN]], CERT_CODE);
    // The seal is pressed on last.
    tr($.stamp, 'o', [[x + 3.5, 0], [x + 3.62, 1, LIN]]);
    tr($.stamp, 's', [[x + 3.5, 1.7], [x + 3.95, 1, OUT]]);
    tr($.stamp, 'r', [[x + 3.5, -28], [x + 3.95, 0, OUT]]);

    /* 04: a client's dashboard and its phone app */
    const d = M2;
    appear($.dbSide, d + 0.35, { dy: 0, dx: -28, dur: 0.8 });
    appear($.dbTop, d + 0.5, { dy: 10, dur: 0.7 });
    const kv = [
      [4.82, (v) => `PKR ${v.toFixed(2)}M`],
      [1284, (v) => Math.round(v).toLocaleString('en-US')],
      [3754, (v) => `PKR ${Math.round(v).toLocaleString('en-US')}`],
      [38, (v) => `${Math.round(v)}%`],
    ];
    kv.forEach(([target, f], i) => {
      appear($[`kp${i}`], d + 0.7 + i * 0.08, { dy: 16, dur: 0.75 });
      num($[`kv${i}`], [[d + 0.75 + i * 0.08, 0], [d + 1.9 + i * 0.08, target, OUT]], f);
    });
    appear($.chart, d + 1.0, { dy: 16, dur: 0.8 });
    appear($.chan, d + 1.1, { dy: 16, dur: 0.8 });
    for (let i = 0; i < 3; i += 1) tr($[`cb${i}`], 'sx', [[d + 1.35 + i * 0.1, 0], [d + 2.3 + i * 0.1, 1, OUT]]);
    for (let i = 0; i < 3; i += 1) appear($[`tr${i}`], d + 1.7 + i * 0.1, { dy: 10, dur: 0.6 });
    // Chart reveal: two opposing transforms act as a moving mask; the dot rides the line.
    const W = $.cv.clientWidth || 356;
    const H = $.cv.clientHeight || 124;
    const c0 = d + 1.2;
    tr($.cvOut, 'x', [[c0, -W], [c0 + 1.3, 0, INOUT]]);
    tr($.cvIn, 'x', [[c0, W], [c0 + 1.3, 0, INOUT]]);
    tr($.cdot, 'fn', null, {
      fn: (t) => {
        const p = INOUT(Math.min(1, Math.max(0, (t - c0) / 1.3)));
        const f = p * (REV.length - 1);
        const i = Math.min(REV.length - 2, Math.floor(f));
        const v = REV[i] + (REV[i + 1] - REV[i]) * (f - i);
        return { x: p * W, y: (chartY(v) / CH) * H, o: t < c0 ? 0 : Math.min(1, (t - c0) / 0.2) };
      },
    });
    num($.apVal, [[d + 1.3, 0], [d + 2.4, 186400, OUT]], (v) => `PKR ${(Math.round(v / 100) * 100).toLocaleString('en-US')}`);
    BAR_H.forEach((_, i) => tr($[`ab${i}`], 'sy', [[d + 1.3 + i * 0.045, 0], [d + 2.1 + i * 0.045, 1, OUT]]));
    for (let i = 0; i < 3; i += 1) appear($[`oi${i}`], d + 1.75 + i * 0.09, { dy: 8, dur: 0.6 });
    appear($.notif, d + 2.75, { dy: -80, s0: 0.96, dur: 0.9 });
    // A cursor finds today's point and the tooltip answers.
    const cw = $.chart.clientWidth || 385;
    const px = cw - 14;
    const py = 42 + (chartY(REV[REV.length - 1]) / CH) * H;
    tr($.dbCur, 'o', [[d + 3.25, 0], [d + 3.4, 1], [M3 - 0.1, 1], [M3 + 0.2, 0]]);
    tr($.dbCur, 'x', [[d + 3.25, px - 150], [d + 3.95, px - 3, OUT]]);
    tr($.dbCur, 'y', [[d + 3.25, py + 150], [d + 3.95, py - 2, OUT]]);
    appear($.tip, d + 3.95, { dy: 0, dx: 10, s0: 0.92, dur: 0.6 });
  }

  function render(time) {
    S.forEach((st) => {
      st.x = 0;
      st.y = 0;
      st.s = 1;
      st.sx = 1;
      st.sy = 1;
      st.r = 0;
      st.o = 1;
    });
    for (let i = 0; i < T.length; i += 1) {
      const k = T[i];
      if (k.p === 'n' || k.p === 'ty') {
        const s = k.p === 'n' ? k.f(val(k.k, time)) : k.full.slice(0, Math.round(val(k.k, time)));
        if (lastTx.get(k.el) !== s) {
          k.el.textContent = s;
          lastTx.set(k.el, s);
        }
      } else {
        let st = S.get(k.el);
        if (!st) {
          st = { x: 0, y: 0, s: 1, sx: 1, sy: 1, r: 0, o: 1 };
          S.set(k.el, st);
        }
        if (k.p === 'fn') Object.assign(st, k.fn(time));
        else st[k.p] = val(k.k, time);
      }
    }
    S.forEach((st, el) => {
      const tf = `translate3d(${st.x.toFixed(2)}px,${st.y.toFixed(2)}px,0) scale(${(st.s * st.sx).toFixed(4)},${(st.s * st.sy).toFixed(4)}) rotate(${st.r.toFixed(2)}deg)`;
      if (lastTf.get(el) !== tf) {
        el.style.transform = tf;
        lastTf.set(el, tf);
      }
      const o = Math.max(0, Math.min(1, Math.round(st.o * 1000) / 1000));
      if (lastOp.get(el) !== o) {
        el.style.opacity = o;
        el.style.visibility = o <= 0.002 ? 'hidden' : '';
        lastOp.set(el, o);
      }
    });
  }

  // The control pill: past scenes full, the current one filling, later ones empty.
  const sceneAt = (t) => (t < START[1] ? 0 : t < START[2] ? 1 : t < START[3] ? 2 : 3);
  let lastScene = -1;
  function hud(t) {
    const cur = sceneAt(t);
    segFill.forEach((f, i) => {
      const p = i < cur ? 1 : i > cur ? 0 : (t - START[i]) / (START[i + 1] - START[i]);
      const tf = `scaleX(${p.toFixed(4)})`;
      if (lastTf.get(f) !== tf) {
        f.style.transform = tf;
        lastTf.set(f, tf);
      }
    });
    if (cur !== lastScene) {
      segs.forEach((s, i) => s.setAttribute('aria-current', i === cur ? 'true' : 'false'));
      lastScene = cur;
    }
  }

  /* Pointer parallax: three planes drift at different depths. */
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  const planes = [[$.bgs, -16, -10], [$.devs, 9, 6], [$.fx, 20, 13]];
  function parallax() {
    par.x += (par.tx - par.x) * 0.06;
    par.y += (par.ty - par.y) * 0.06;
    const settled = Math.abs(par.tx - par.x) < 1e-3 && Math.abs(par.ty - par.y) < 1e-3;
    if (settled) {
      par.x = par.tx;
      par.y = par.ty;
    }
    planes.forEach(([el, ax, ay]) => {
      const tf = `translate3d(${(par.x * ax).toFixed(2)}px,${(par.y * ay).toFixed(2)}px,0)`;
      if (lastTf.get(el) !== tf) {
        el.style.transform = tf;
        lastTf.set(el, tf);
      }
    });
    return !settled;
  }

  /* Clock */
  let t = reduced ? STILL : 0;
  let playing = !reduced;
  let started = false; // the first scene waits until the panel is properly in view
  let delay = 0.6; // and lets the frame open before the first message lands
  let onScreen = false;
  let inView = false; // at least 30% visible
  let last = null;
  let raf = 0;
  // While the logo intro (public/index.html) covers the page, the reel is
  // "on screen" but nobody can see it, so its first scene waits for the intro.
  const introPlaying = () => document.documentElement.classList.contains('intro');

  function kick() {
    if (!raf && !document.hidden && onScreen) raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    raf = 0;
    if (document.hidden || !onScreen) {
      last = null;
      return;
    }
    const dt = last == null ? 0 : Math.min(0.25, (now - last) / 1000);
    last = now;
    const advancing = playing && started;
    if (advancing) {
      if (delay > 0) delay -= dt;
      else t = (t + dt) % CYCLE;
      render(t);
      hud(t);
    }
    const moving = parallax();
    if (advancing || moving) kick();
    else last = null;
  }

  function setPlaying(v) {
    playing = v;
    root.classList.toggle('is-paused', !v);
    $.pp.setAttribute('aria-pressed', String(!v));
    // Announce the caption only when it changes because someone asked it to.
    $.caps.setAttribute('aria-live', v ? 'off' : 'polite');
    last = null;
    kick();
  }

  function fit() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (!w || !h) return;
    const m = h > w ? 'mob' : 'desk';
    const L = LAYOUT[m];
    const s = Math.max(w / L.w, h / L.h);
    const ox = (w - L.w * s) / 2;
    const oy = (h - L.h * s) / 2;
    $.stage.style.transform = `translate3d(${ox.toFixed(2)}px,${oy.toFixed(2)}px,0) scale(${s.toFixed(5)})`;
    root.style.setProperty('--rl-s', s.toFixed(4));
    if (m !== mode) {
      mode = m;
      root.dataset.layout = m;
      build();
      render(t);
      hud(t);
    }
  }

  const onPlayPause = () => {
    started = true;
    delay = 0;
    setPlaying(!playing);
  };

  const onScene = (e) => {
    const i = +e.currentTarget.dataset.scene;
    started = true;
    delay = 0;
    t = playing ? (i === 0 ? 0 : M[i - 1]) : COMPOSED[i];
    if (!reduced && $.stage.animate) {
      $.stage.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
    render(t);
    hud(t);
    kick();
  };

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reduced) return;
    const r = root.getBoundingClientRect();
    par.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    par.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    kick();
  };
  const onLeave = () => {
    par.tx = 0;
    par.ty = 0;
    kick();
  };

  const onVisibility = () => {
    last = null;
    kick();
  };

  const onMotionPref = (e) => {
    reduced = e.matches;
    if (!reduced) return;
    par.tx = 0;
    par.ty = 0;
    par.x = 0;
    par.y = 0;
    parallax();
    t = STILL;
    render(t);
    hud(t);
    setPlaying(false);
  };

  fit();
  setPlaying(playing);

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(fit);
    ro.observe(root);
  } else {
    window.addEventListener('resize', fit);
  }

  let io = null;
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        onScreen = e.isIntersecting;
        if (e.intersectionRatio >= 0.3) inView = true;
        if (inView && !introPlaying()) started = true;
        root.classList.toggle('is-offscreen', !onScreen);
        last = null;
        kick();
      },
      { threshold: [0, 0.3] }
    );
    io.observe(root);
  } else {
    onScreen = true;
    started = true;
    kick();
  }

  const onIntroEnd = () => {
    if (inView && !started) {
      started = true;
      last = null;
      kick();
    }
  };
  window.addEventListener('cortexis:intro-end', onIntroEnd);

  $.pp.addEventListener('click', onPlayPause);
  segs.forEach((s) => s.addEventListener('click', onScene));
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);
  document.addEventListener('visibilitychange', onVisibility);
  if (mq.addEventListener) mq.addEventListener('change', onMotionPref);
  else mq.addListener(onMotionPref);

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', fit);
    if (io) io.disconnect();
    window.removeEventListener('cortexis:intro-end', onIntroEnd);
    $.pp.removeEventListener('click', onPlayPause);
    segs.forEach((s) => s.removeEventListener('click', onScene));
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerleave', onLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    if (mq.removeEventListener) mq.removeEventListener('change', onMotionPref);
    else mq.removeListener(onMotionPref);
    root.classList.remove('is-paused', 'is-offscreen');
  };
}

/* ── Markup ───────────────────────────────────────────────────────────── */

const HeroReel = ({ className = '' }) => {
  const root = useRef(null);

  // Layout rather than passive: the canvas has to be measured and scaled
  // before the first paint, or it flashes at its design size.
  useLayoutEffect(() => runReel(root.current), []);

  return (
    <figure
      ref={root}
      className={`lx-showreel ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label="What Cortexis builds: WhatsApp bots, free tools, free courses and web apps"
    >
      <div className="rl-settle">
        <div className="rl-stage" data-k="stage" aria-hidden="true" data-nosnippet="">
          <div className="rl-layer rl-bgs" data-k="bgs">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rl-bg" data-k={`bg${i}`} style={{ backgroundImage: `url(/media/reel/s${i}.webp)` }} />
            ))}
            <div className="rl-wash" />
            <div className="rl-shafts" />
          </div>
          <div className="rl-layer rl-grain" />

          <div className="rl-layer" data-k="devs">
            {/* Browser */}
            <div className="rl-dev rl-browser rl-glass" data-k="browser">
              <div className="rl-clip"><div className="rl-sheen" data-k="bSheen" /></div>
              <div className="rl-chrome">
                <div className="rl-dots"><i /><i /><i /></div>
                <div className="rl-url">
                  {URLS.map((u, i) => (
                    <span key={u} data-k={`u${i}`}><Lock />{u}</span>
                  ))}
                </div>
              </div>
              <div className="rl-screen">
                {/* 01: Your Bot bookings */}
                <div className="rl-lay" data-k="b0">
                  <div className="rl-yb">
                    <div className="rl-yb-side"><div className="rl-yb-logo">y</div><i /><i className="rl-on" /><i /><i /></div>
                    <div className="rl-yb-main">
                      <div className="rl-yb-head">
                        <div>
                          <div className="rl-k">Your Bot · Dental clinic</div>
                          <div className="rl-yb-title">Bookings this week</div>
                        </div>
                        <div className="rl-stats">
                          <div className="rl-stat"><span>Booked by bot</span><b data-k="ybCount">13</b><em className="rl-plus" data-k="ybPlus">+1</em></div>
                          <div className="rl-stat"><span>Avg. reply</span><b>2 s</b></div>
                          <div className="rl-stat"><span>Open slots</span><b data-k="ybOpen">6</b></div>
                        </div>
                      </div>
                      <div className="rl-cal">
                        <div className="rl-cal-days">
                          <span /><span>Mon 28</span><span>Tue 29</span><span>Wed 30</span><span className="rl-now">Thu 1</span><span>Fri 2</span><span>Sat 3</span>
                        </div>
                        <div className="rl-cal-grid">
                          {EVENTS.map(([bot, d, s, l, what, who]) => (
                            <div key={`${d}-${s}`} className={bot ? 'rl-ev rl-bot' : 'rl-ev'} style={{ '--d': d, '--s': s, '--l': l }}>
                              <b>{what}</b>{who}{bot ? <>{' '}<small>· bot</small></> : null}
                            </div>
                          ))}
                          <div className="rl-ev rl-new" data-k="evNew" style={{ '--d': 3, '--s': 1.5, '--l': 1 }}>
                            <b>Cleaning · Hira A.</b><small>via WhatsApp</small>
                          </div>
                          <div className="rl-ev rl-ring" data-k="evRing" style={{ '--d': 3, '--s': 1.5, '--l': 1 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 02: PDF Compressor */}
                <div className="rl-lay" data-k="b1">
                  <div className="rl-tool">
                    <div className="rl-tool-head">
                      <div>
                        <div className="rl-pills"><span className="rl-pill rl-pill-free">Free</span><span className="rl-pill rl-pill-ghost">1 of {TOOL_COUNT} tools</span></div>
                        <div className="rl-tool-title">PDF Compressor</div>
                      </div>
                    </div>
                    <div className="rl-tool-body">
                      <div className="rl-card">
                        <div className="rl-dz" data-k="dzIdle">
                          <div className="rl-dz-ic">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4M7 9l5-5 5 5" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
                          </div>
                          <b>Drop a PDF here</b><small>or choose a file</small>
                        </div>
                        <div className="rl-dz-hot" data-k="dzHot" />
                        <div className="rl-fstate" data-k="fState">
                          <div className="rl-frow">
                            <div className="rl-pdf" />
                            <div className="rl-fname"><b>Q3-sales-report.pdf</b><small>24 pages</small></div>
                            <div className="rl-fsize" data-k="fSize">2.4 MB</div>
                          </div>
                          <div className="rl-lvl"><span>Balanced</span><span className="rl-on">Strong</span><span>Extreme</span></div>
                          <div className="rl-prog" data-k="progRow">
                            <div className="rl-prog-row"><span>Compressing</span><span data-k="pct">0%</span></div>
                            <div className="rl-bar"><i className="rl-fill" data-k="progFill" /></div>
                          </div>
                          <div className="rl-result" data-k="result">
                            <div className="rl-result-big"><span className="rl-from">2.4 MB</span><span className="rl-arr">→</span><span className="rl-to">640 KB</span></div>
                            <div className="rl-acts">
                              <span className="rl-dl"><Download />Download</span>
                              <span className="rl-save">Same pages, 73% lighter</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rl-pages">
                        {[false, true, false, true, false, false].map((img, i) => (
                          <div key={i} className={img ? 'rl-pg rl-pg-img' : 'rl-pg'}>
                            <span className="rl-ok" data-k={`ok${i}`}><Check /></span>
                          </div>
                        ))}
                        <div className="rl-pages-cap">Pages 1–6 of 24</div>
                        <div className="rl-scan" data-k="scan" />
                      </div>
                    </div>
                  </div>
                  <div className="rl-ghost" data-k="ghost">
                    <div className="rl-pdf" />Q3-sales-report.pdf
                    <Cursor />
                  </div>
                </div>

                {/* 03: final exam */}
                <div className="rl-lay" data-k="b2">
                  <div className="rl-ex">
                    <div className="rl-ex-side">
                      <div className="rl-k">Free course</div>
                      <div className="rl-ex-course">Python Development</div>
                      <div className="rl-ex-prog" />
                      <div className="rl-pm">12 of 12 chapters complete</div>
                      <ul className="rl-chs">
                        {CHAPTERS.map((c) => (
                          <li key={c}><i><Check /></i>{c}</li>
                        ))}
                        <li className="rl-more">+ 6 more chapters</li>
                        <li className="rl-cur">
                          <i>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2" /><circle cx="12" cy="12" r="4" /></svg>
                          </i>
                          Final exam
                        </li>
                      </ul>
                    </div>
                    <div className="rl-ex-main">
                      <div className="rl-k">Final exam · Question 50 of 50</div>
                      <div className="rl-qsegs">
                        {Array.from({ length: 19 }, (_, i) => <i key={i} />)}
                        <i className="rl-last"><b data-k="seg20" /></i>
                      </div>
                      <div className="rl-ex-q">What does this print?</div>
                      <div className="rl-code">
                        {'names = ['}<span className="rl-s">{'"ali"'}</span>{', '}<span className="rl-s">{'"sara"'}</span>{']\n'}
                        <span className="rl-f">print</span>{'([n.'}<span className="rl-f">title</span>{'() for n in names])'}
                      </div>
                      <div className="rl-opts">
                        <div className="rl-opt">
                          <div className="rl-sel" data-k="optSel" />
                          <span className="rl-rad" /><span>{"['Ali', 'Sara']"}</span>
                          <i className="rl-chk" data-k="optChk"><Check /></i>
                          <b className="rl-opt-ok" data-k="optOk">Correct</b>
                        </div>
                        <div className="rl-opt"><span className="rl-rad" /><span>{"['ALI', 'SARA']"}</span></div>
                        <div className="rl-opt"><span className="rl-rad" /><span>Ali Sara</span></div>
                      </div>
                      <div className="rl-passed" data-k="passed">
                        <div className="rl-ringw">
                          <svg viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#E4ECDD" strokeWidth="4" />
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#62805A" strokeWidth="4" strokeLinecap="round" strokeDasharray="125.66" strokeDashoffset="6.3" />
                          </svg>
                          <b data-k="score">96%</b>
                        </div>
                        <div>
                          <div className="rl-passed-title">You passed.</div>
                          <div className="rl-passed-sub">48 of 50 correct · Python Development</div>
                        </div>
                        <span className="rl-iss">
                          Certificate issued
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </span>
                      </div>
                      <div className="rl-ripple" data-k="exRip" />
                      <Cursor k="exCur" />
                    </div>
                  </div>
                </div>

                {/* 04: client dashboard */}
                <div className="rl-lay" data-k="b3">
                  <div className="rl-db">
                    <div className="rl-db-side" data-k="dbSide">
                      <div className="rl-db-logo"><i>s</i>Saffron Crafts</div>
                      <div className="rl-db-nav">
                        <span className="rl-on">Overview</span><span>Orders</span><span>Products</span><span>Customers</span><span>WhatsApp inbox</span><span>Payouts</span>
                      </div>
                    </div>
                    <div className="rl-db-main">
                      <div className="rl-db-top" data-k="dbTop">
                        <div className="rl-db-title">Overview</div>
                        <div className="rl-db-right"><span className="rl-pill rl-pill-ghost">Last 30 days</span><div className="rl-av rl-av-sm">f</div></div>
                      </div>
                      <div className="rl-kpis">
                        {KPIS.map(([label, value, delta], i) => (
                          <div key={label} className="rl-kpi" data-k={`kp${i}`}>
                            <span>{label}</span><b data-k={`kv${i}`}>{value}</b><em>{delta}</em>
                          </div>
                        ))}
                      </div>
                      <div className="rl-row2">
                        <div className="rl-chart" data-k="chart">
                          <div className="rl-chart-hd">Revenue<small>Sep 1 – Sep 30</small></div>
                          <div className="rl-cv" data-k="cv">
                            <div className="rl-gl" style={{ top: '25%' }} />
                            <div className="rl-gl" style={{ top: '50%' }} />
                            <div className="rl-gl" style={{ top: '75%' }} />
                            <div className="rl-cv-in" data-k="cvOut">
                              <div className="rl-cv-in" data-k="cvIn">
                                <svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
                                  <defs>
                                    <linearGradient id="rl-rev-fill" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0" stopColor="#B8612E" stopOpacity=".22" />
                                      <stop offset="1" stopColor="#B8612E" stopOpacity="0" />
                                    </linearGradient>
                                  </defs>
                                  <path d={`${REV_LINE} L${CW} ${CH} L0 ${CH} Z`} fill="url(#rl-rev-fill)" />
                                  <path d={REV_LINE} fill="none" stroke="#B8612E" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                                </svg>
                              </div>
                            </div>
                            <div className="rl-cdot" data-k="cdot" />
                          </div>
                          <div className="rl-tip" data-k="tip"><small>Today</small><b>PKR 186,400</b></div>
                          <Cursor k="dbCur" />
                        </div>
                        <div className="rl-chan" data-k="chan">
                          <div className="rl-chan-hd">Orders by channel</div>
                          {[['WhatsApp', '42%', 84, ''], ['Website', '35%', 70, ' rl-copper'], ['Instagram', '23%', 46, ' rl-stone']].map(([name, share, width, tone], i) => (
                            <div key={name} className="rl-cb">
                              <div className="rl-cb-l">{name}<b>{share}</b></div>
                              <div className="rl-track"><i className={`rl-fill${tone}`} data-k={`cb${i}`} style={{ width: `${width}%` }} /></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rl-tbl">
                        {ORDERS.map(([id, who, amt, status, tone, when], i) => (
                          <div key={id} className="rl-tr" data-k={`tr${i}`}>
                            <span className="rl-id">{id}</span><span>{who}</span><span className="rl-amt">{amt}</span>
                            <span className={`rl-st ${tone}`}>{status}</span><span className="rl-id">{when}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate: a miniature of the real sheet (CertificateView),
                laid out in its own 1123 x 794 sheet pixels and scaled down. */}
            <div className="rl-dev rl-cert" data-k="cert">
              <div className="rl-cs">
                <CertificateFrame />
                <img className="rl-cs-logo" src="/media/reel/logo.webp" alt="" width="93" height="91" decoding="async" />
                <img className="rl-cs-secp" src="/media/reel/secp.webp" alt="" width="76" height="76" decoding="async" />
                <div className="rl-cs-title">Certificate</div>
                <div className="rl-cs-sub"><i />OF COMPLETION<i /></div>
                <div className="rl-cs-id">CERTIFICATE ID: <b data-k="certCode">{CERT_CODE}</b></div>
                <div className="rl-cs-ribbon"><span>PROUDLY PRESENTED TO</span></div>
                <div className="rl-cs-name">Ayesha Khan</div>
                <div className="rl-cs-rule" />
                <div className="rl-cs-copy">
                  <div>has successfully completed the <b>Python Development</b> course and passed the final examination with a score of <b>96%</b>.</div>
                  <i className="rl-cs-orn" />
                  <div>Recognized for consistent dedication and a strong command of the subject. Wishing them continued success in their future career.</div>
                </div>
                <div className="rl-cs-qr"><Qr d={QR_CERT} n={21} fill="#0b1a33" /></div>
                <img className="rl-stamp" data-k="stamp" src="/media/reel/seal.webp" alt="" width="112" height="112" decoding="async" />
                <div className="rl-cs-sign">
                  <div className="rl-cs-sig"><img src="/media/reel/sign.webp" alt="" width="66" height="84" decoding="async" /></div>
                  <b>Hafsa Farheen</b>
                  <span>Human Resources</span>
                  <span className="rl-cs-co">Cortexis Solution Hub (Pvt.) Ltd.</span>
                </div>
                <div className="rl-cs-foot">Issued {ISSUED} · Verify at {SITE_URL}/certificate/{CERT_CODE}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="rl-dev rl-phone rl-glass" data-k="phone">
              <div className="rl-clip"><div className="rl-sheen" data-k="pSheen" /></div>
              <div className="rl-island" />
              <div className="rl-screen">
                {/* 01: the chat */}
                <div className="rl-lay" data-k="p0">
                  <Status time="10:42" />
                  <div className="rl-wa-head">
                    <svg className="rl-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m15 5-7 7 7 7" /></svg>
                    <div className="rl-av">yc</div>
                    <div><b>Your Clinic</b><small>Replies instantly</small></div>
                  </div>
                  <div className="rl-chat">
                    <div className="rl-chat-in" data-k="chatIn">
                      <span className="rl-day">Today</span>
                      <div className="rl-bub rl-out" data-k="r1">
                        Salam! Do you have a cleaning slot this week?
                        <span className="rl-meta">10:41<Read /></span>
                      </div>
                      <div className="rl-slot">
                        <div className="rl-typing" data-k="ty1"><i /><i /><i /></div>
                        <div className="rl-bub rl-in" data-k="l1">
                          Wa alaikum salam! Yes, two slots are open this week:
                          <span className="rl-meta">10:41</span>
                          <div className="rl-qr-btns">
                            <div>
                              <span className="rl-hit" data-k="hit" />
                              <span className="rl-lbl"><Reply />Thu · 11:30 am</span>
                              <span className="rl-tap" data-k="tap" />
                            </div>
                            <div><span className="rl-lbl"><Reply />Sat · 4:00 pm</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="rl-bub rl-out" data-k="r2">
                        Thu · 11:30 am
                        <span className="rl-meta">10:42<Read /></span>
                      </div>
                      <div className="rl-slot">
                        <div className="rl-typing" data-k="ty2"><i /><i /><i /></div>
                        <div className="rl-bub rl-in rl-book" data-k="l2">
                          <div className="rl-book-top"><i><Check /></i>Appointment booked</div>
                          <dl>
                            <dt>What</dt><dd>Teeth cleaning</dd>
                            <dt>When</dt><dd>Thu 1 Oct · 11:30 am</dd>
                            <dt>Where</dt><dd>Your Clinic, F-7</dd>
                          </dl>
                          <span className="rl-meta">10:42</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rl-composer">
                    <div className="rl-field">Message</div>
                    <div className="rl-mic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
                    </div>
                  </div>
                </div>

                {/* 02: QR Generator */}
                <div className="rl-lay" data-k="p1">
                  <Status time="10:44" />
                  <div className="rl-mt">
                    <div className="rl-crumb">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="m15 5-7 7 7 7" /></svg>
                      All tools
                    </div>
                    <div className="rl-mt-title">QR Generator</div>
                    <div className="rl-tabs"><span className="rl-on">URL</span><span>Text</span><span>Wi-Fi</span><span>vCard</span></div>
                    <div className="rl-inp"><span data-k="qrType" /><i className="rl-caret" /></div>
                    <div className="rl-gen" data-k="genBtn">Generate</div>
                    <div className="rl-qrcard">
                      <Qr d={QR_BIG} n={25} />
                      <div className="rl-qrcover" data-k="qrCover" />
                    </div>
                    <div className="rl-mdl" data-k="qrDl"><Download />Download PNG</div>
                  </div>
                </div>

                {/* 04: the store's phone app */}
                <div className="rl-lay" data-k="p3">
                  <Status time="18:06" />
                  <div className="rl-notif" data-k="notif">
                    <i>s</i>
                    <div><b>New order #1285<small>now</small></b><div className="rl-notif-p">PKR 6,400 · via WhatsApp</div></div>
                  </div>
                  <div className="rl-ap">
                    <div className="rl-ap-hd"><b><i>s</i>Saffron Crafts</b><div className="rl-av rl-av-xs">f</div></div>
                    <div className="rl-k rl-ap-lab">Sales today</div>
                    <div className="rl-ap-val" data-k="apVal">PKR 186,400</div>
                    <div className="rl-ap-delta">+9% vs last Friday</div>
                    <div className="rl-bars">
                      {BAR_H.map((h, i) => (
                        <i key={i} className={i === BAR_H.length - 1 ? 'rl-hi' : undefined} data-k={`ab${i}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="rl-ol">
                      <div className="rl-k">Recent orders</div>
                      {APP_ORDERS.map(([item, meta, amt, tone], i) => (
                        <div key={item} className="rl-oi" data-k={`oi${i}`}>
                          <i style={{ background: tone }} /><div>{item}<small>{meta}</small></div><b>{amt}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rl-layer" data-k="fx">
            <div className="rl-chip rl-glass" data-k="chipA">
              <span className="rl-chip-dot">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3 5 14h6l-1 7 8-11h-6z" /></svg>
              </span>
              <div><b>Replied in 2 seconds</b><small>Your Bot · WhatsApp</small></div>
            </div>
            <div className="rl-chip rl-glass rl-chip-big" data-k="chipC">
              <div><b>−73%</b><small>2.4 MB → 640 KB · in your browser</small></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rl-hud">
        <div className="rl-caps" data-k="caps" aria-live="off">
          {SCENES.map((s, i) => (
            <div key={s.b} className="rl-cap" data-k={`cap${i}`}>
              <div className="rl-cap-n">{`0${i + 1} / 04`}</div>
              <div className="rl-cap-t">{s.a} <em>{s.b}</em></div>
            </div>
          ))}
        </div>
        <div className="rl-ctrl" role="group" aria-label="Reel controls">
          <button className="rl-pp" data-k="pp" type="button" aria-label="Pause the reel" aria-pressed="false">
            <svg className="rl-i-pause" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1.5" width="2.6" height="9" rx=".8" fill="currentColor" /><rect x="7.4" y="1.5" width="2.6" height="9" rx=".8" fill="currentColor" /></svg>
            <svg className="rl-i-play" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.8v8.4c0 .5.5.8.9.5l6.5-4.2c.4-.2.4-.8 0-1L3.9 1.3C3.5 1 3 1.3 3 1.8z" fill="currentColor" /></svg>
          </button>
          <div className="rl-segs">
            {SCENES.map((s, i) => (
              <button key={s.b} className="rl-seg" type="button" data-scene={i} aria-label={s.label}><i /></button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
};

export default memo(HeroReel);
