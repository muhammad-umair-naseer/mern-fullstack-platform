import React from 'react';

/*
 * Ornament layer for the certificate sheet: layered wave bands in two corners,
 * a gold double keyline and a leaf sprig in each corner. Everything is inline
 * SVG in a 1123x794 user space (A4 landscape at 96dpi), so it prints as crisp
 * vectors at any size and needs no image assets.
 *
 * Each wave is painted as nested regions, largest first. Every region runs
 * from one band edge to the sheet corner, so a later band always lands on top
 * of the one before it and no paper can show through a seam between two bands.
 */

// Catmull-Rom spline through the points, emitted as cubic Bezier segments.
const spline = (pts) => {
  const f = (n) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
};

// An edge closed off through a point beyond the sheet corner it belongs to.
const region = (edge, corner) => `${spline(edge)} L${corner[0]} ${corner[1]} Z`;

// A pointed leaf from (x1,y1) to (x2,y2), `w` wide at its fullest.
const leaf = (x1, y1, x2, y2, w) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * w;
  const ny = (dx / len) * w;
  const at = (t, s) => `${(x1 + dx * t + nx * s).toFixed(1)} ${(y1 + dy * t + ny * s).toFixed(1)}`;
  return `M${at(0, 0)} C${at(0.25, 0.62)} ${at(0.62, 0.72)} ${at(1, 0)} C${at(0.66, -0.52)} ${at(0.3, -0.5)} ${at(0, 0)}Z`;
};

// Fine angular veins through the deep navy, like the texture of the printed
// original. A small fixed-seed generator keeps them identical on every render.
const cracks = (lines, seed) => {
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647 - 0.5;
  };
  return lines.map(([x1, y1, x2, y2]) => {
    const steps = Math.max(3, Math.round(Math.hypot(x2 - x1, y2 - y1) / 11));
    const nx = -(y2 - y1) / Math.hypot(x2 - x1, y2 - y1);
    const ny = (x2 - x1) / Math.hypot(x2 - x1, y2 - y1);
    let d = `M${x1} ${y1}`;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const j = i === steps ? 0 : rand() * 3.2;
      d += ` L${(x1 + (x2 - x1) * t + nx * j).toFixed(1)} ${(y1 + (y2 - y1) * t + ny * j).toFixed(1)}`;
    }
    return d;
  });
};

/* ── top-right wave ─────────────────────────────────────────────────────
   Edges run from above the top edge to beyond the right edge. From the paper
   inward: gold ribbon, royal-navy band, orange band, bright blue, deep navy. */
const TR_CORNER = [1140, -14];
const TR_GOLD = [
  [560, -8], [575, 1], [644, 20], [743, 60], [810, 100], [875, 150], [935, 202],
  [975, 243], [1003, 272], [1040, 302], [1080, 325], [1123, 343], [1134, 346],
];
const TR_NAVY_BAND = [
  [622, -8], [632, 1], [704, 20], [797, 60], [854, 100], [905, 150], [950, 202],
  [1000, 257], [1040, 292], [1080, 319], [1123, 337], [1134, 339],
];
// Orange drawn as its own tapered band from the point where it slips out from
// under the ribbon. Its top edge overshoots into the blue, which covers it.
const TR_ORANGE_BOTTOM = [
  [846, 94], [872, 114], [900, 139], [950, 182], [1000, 215], [1040, 237],
  [1080, 251], [1123, 258], [1134, 259],
];
const TR_ORANGE_TOP = [
  [846, 94], [872, 106], [900, 124], [950, 159], [1000, 189], [1040, 207],
  [1080, 219], [1123, 222], [1134, 222],
];
const TR_BLUE = [
  [622, -8], [632, 1], [704, 20], [797, 60], [846, 94], [872, 109], [900, 127],
  [950, 162], [1000, 192], [1040, 210], [1080, 222], [1123, 225], [1134, 225],
];
const TR_DEEP = [
  [744, -8], [752, 1], [800, 20], [869, 60], [900, 83], [917, 99], [950, 125],
  [1000, 167], [1040, 195], [1080, 216], [1110, 223], [1134, 225],
];
const TR_ORANGE = `${spline(TR_ORANGE_BOTTOM)} ${spline(
  [...TR_ORANGE_TOP].reverse().map(([x, y]) => [x, y - 3])
).replace('M', 'L')} Z`;

const TR_HAIR_PAPER = [
  [610, 6], [676, 33], [760, 74], [822, 116], [882, 166], [912, 195], [952, 236],
  [1000, 284], [1050, 322], [1100, 356], [1134, 372],
];
const TR_HAIR_BLUE = [
  [700, -6], [760, 23], [836, 60], [900, 94], [950, 117], [1010, 142], [1060, 154], [1134, 160],
];
const TR_HAIR_BAND = [[968, 236], [1000, 248], [1050, 266], [1134, 286]];
const TR_TEXTURE = cracks(
  [
    [884, 30, 1012, 76],
    [955, 38, 1004, 53],
    [888, 50, 1062, 129],
    [926, 78, 1078, 136],
    [978, 51, 1082, 98],
    [1012, 79, 1060, 104],
    [1038, 126, 1094, 134],
    [1045, 40, 1080, 52],
    [990, 112, 1030, 128],
  ],
  7
);

/* ── bottom-left wave ───────────────────────────────────────────────────
   Edges run from beyond the left edge to below the bottom edge. From the
   paper inward: gold ribbon, bright blue, orange, royal blue, deep navy. */
const BL_CORNER = [-14, 808];
const BL_GOLD = [
  [-8, 474], [1, 482], [30, 508], [50, 527], [75, 553], [100, 581], [125, 611],
  [150, 642], [175, 672], [204, 700], [228, 720], [254, 740], [288, 760], [320, 775],
  [350, 786], [382, 795], [394, 800],
];
const BL_BLUE = [
  [-8, 538], [1, 542], [30, 560], [50, 574], [75, 592], [100, 611], [125, 633],
  [150, 657], [175, 680], [196, 700], [218, 720], [242, 740], [272, 760], [299, 775],
  [322, 784], [342, 791], [356, 797], [366, 802],
];
const BL_ORANGE = [
  [-8, 614], [1, 615], [30, 618], [50, 623], [75, 633], [100, 647], [125, 664],
  [150, 685], [167, 700], [190, 720], [216, 740], [250, 760], [283, 775], [312, 784],
  [337, 791], [352, 796], [362, 802],
];
const BL_ROYAL = [
  [-8, 628], [1, 629], [30, 633], [50, 639], [75, 649], [100, 663], [125, 679],
  [152, 700], [175, 720], [202, 740], [236, 760], [271, 776], [305, 786], [334, 791],
  [350, 796], [360, 802],
];
const BL_DEEP = [
  [-8, 631], [1, 632], [30, 637], [50, 645], [75, 659], [100, 679], [124, 700],
  [147, 720], [171, 740], [201, 760], [231, 775], [255, 785], [277, 793], [290, 802],
];
const BL_HAIR_PAPER = [
  [-8, 459], [2, 465], [30, 490], [50, 510], [75, 536], [100, 565], [125, 596],
  [150, 628], [175, 660], [200, 688], [250, 728], [300, 758], [350, 781], [400, 798],
];
const BL_HAIR_BLUE = [[-8, 580], [1, 583], [50, 602], [100, 627], [143, 653], [180, 684], [212, 716]];
const BL_HAIR_NAVY = [[-8, 644], [1, 647], [75, 671], [150, 703], [210, 745], [248, 775], [268, 802]];
const BL_TEXTURE = cracks(
  [
    [12, 662, 118, 712],
    [34, 690, 150, 745],
    [22, 714, 96, 746],
    [70, 736, 170, 782],
    [118, 718, 196, 764],
    [150, 760, 226, 792],
    [44, 758, 104, 786],
  ],
  11
);

// Leaf sprig drawn for the top-left corner, then reflected into the others.
// Origin is the corner of the inner keyline.
const SPRIG = [
  leaf(12, 5, 58, 6, 7),
  leaf(3, 3, 34, 33, 6),
  leaf(5, 12, 6, 57, 7),
  leaf(3, 3, 17, 5, 3.2),
  leaf(3, 3, 5, 17, 3.2),
];
const SPRIG_AT = [
  'translate(26 26)',
  'translate(1097 26) scale(-1 1)',
  'translate(1097 768) scale(-1 -1)',
  'translate(26 768) scale(1 -1)',
];

const CertificateFrame = () => (
  <svg
    className="cxc-frame"
    viewBox="0 0 1123 794"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* Gold foil: darker at the corner end, a bright band where the ribbon
          turns, then settling back to a warm mid gold along the tail. */}
      <linearGradient id="cxcFoilTR" gradientUnits="userSpaceOnUse" x1="575" y1="0" x2="1123" y2="343">
        <stop offset="0" stopColor="#b98640" />
        <stop offset="0.14" stopColor="#c99650" />
        <stop offset="0.3" stopColor="#f3d994" />
        <stop offset="0.44" stopColor="#f7e2a3" />
        <stop offset="0.58" stopColor="#d6a75a" />
        <stop offset="0.74" stopColor="#c8974c" />
        <stop offset="0.88" stopColor="#e2bb6e" />
        <stop offset="1" stopColor="#c08f45" />
      </linearGradient>
      <linearGradient id="cxcFoilBL" gradientUnits="userSpaceOnUse" x1="0" y1="480" x2="380" y2="794">
        <stop offset="0" stopColor="#c7944b" />
        <stop offset="0.16" stopColor="#f6de98" />
        <stop offset="0.3" stopColor="#e7c177" />
        <stop offset="0.46" stopColor="#c5944b" />
        <stop offset="0.62" stopColor="#d9b067" />
        <stop offset="0.8" stopColor="#f0d48b" />
        <stop offset="1" stopColor="#c08e45" />
      </linearGradient>
      <linearGradient id="cxcBlueTR" gradientUnits="userSpaceOnUse" x1="640" y1="0" x2="1110" y2="225">
        <stop offset="0" stopColor="#1e61d2" />
        <stop offset="0.3" stopColor="#1b57c3" />
        <stop offset="0.5" stopColor="#1749a8" />
        <stop offset="0.68" stopColor="#1a3e90" />
        <stop offset="1" stopColor="#1c2f6c" />
      </linearGradient>
      <linearGradient id="cxcBlueBL" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="330" y2="794">
        <stop offset="0" stopColor="#1f55b8" />
        <stop offset="0.35" stopColor="#1c5bc6" />
        <stop offset="1" stopColor="#1d4fb0" />
      </linearGradient>
      <linearGradient id="cxcDeepTR" gradientUnits="userSpaceOnUse" x1="800" y1="140" x2="1123" y2="0">
        <stop offset="0" stopColor="#1b2b50" />
        <stop offset="1" stopColor="#141f40" />
      </linearGradient>
      <linearGradient id="cxcDeepBL" gradientUnits="userSpaceOnUse" x1="0" y1="640" x2="220" y2="794">
        <stop offset="0" stopColor="#172241" />
        <stop offset="1" stopColor="#111a33" />
      </linearGradient>
      <linearGradient id="cxcLeaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f3d890" />
        <stop offset="1" stopColor="#d5a652" />
      </linearGradient>
    </defs>

    {/* ── top-right ── */}
    <g className="cxc-wave cxc-wave--tr">
      {/* soft lift where the ribbon sits on the paper */}
      <path d={spline(TR_GOLD)} fill="none" stroke="#6f6a60" strokeOpacity="0.05" strokeWidth="16" />
      <path d={spline(TR_GOLD)} fill="none" stroke="#6f6a60" strokeOpacity="0.07" strokeWidth="8" />
      <path d={spline(TR_HAIR_PAPER)} fill="none" stroke="#c9a364" strokeWidth="1.1" strokeOpacity="0.85" />
      <path d={region(TR_GOLD, TR_CORNER)} fill="url(#cxcFoilTR)" />
      <path d={region(TR_NAVY_BAND, TR_CORNER)} fill="#1c2e6e" />
      <path d={TR_ORANGE} fill="#f97d2a" />
      <path d={region(TR_BLUE, TR_CORNER)} fill="url(#cxcBlueTR)" />
      <path d={region(TR_DEEP, TR_CORNER)} fill="url(#cxcDeepTR)" />
      <path d={TR_TEXTURE.join(' ')} fill="none" stroke="#5f9f92" strokeWidth="1" strokeOpacity="0.42" strokeLinejoin="round" />
      <path d={spline(TR_HAIR_BLUE)} fill="none" stroke="#d8b774" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d={spline(TR_HAIR_BAND)} fill="none" stroke="#8fa5c8" strokeWidth="1" strokeOpacity="0.45" />
    </g>

    {/* ── bottom-left ── */}
    <g className="cxc-wave cxc-wave--bl">
      <path d={spline(BL_GOLD)} fill="none" stroke="#6f6a60" strokeOpacity="0.05" strokeWidth="16" />
      <path d={spline(BL_GOLD)} fill="none" stroke="#6f6a60" strokeOpacity="0.07" strokeWidth="8" />
      <path d={spline(BL_HAIR_PAPER)} fill="none" stroke="#c9a364" strokeWidth="1.1" strokeOpacity="0.85" />
      <path d={region(BL_GOLD, BL_CORNER)} fill="url(#cxcFoilBL)" />
      <path d={region(BL_BLUE, BL_CORNER)} fill="url(#cxcBlueBL)" />
      <path d={spline(BL_HAIR_BLUE)} fill="none" stroke="#b7c9e6" strokeWidth="1" strokeOpacity="0.45" />
      <path d={region(BL_ORANGE, BL_CORNER)} fill="#f97a2b" />
      <path d={region(BL_ROYAL, BL_CORNER)} fill="#18388a" />
      <path d={region(BL_DEEP, BL_CORNER)} fill="url(#cxcDeepBL)" />
      <path d={BL_TEXTURE.join(' ')} fill="none" stroke="#5f9f92" strokeWidth="1" strokeOpacity="0.36" strokeLinejoin="round" />
      <path d={spline(BL_HAIR_NAVY)} fill="none" stroke="#d8b774" strokeWidth="1" strokeOpacity="0.5" />
    </g>

    {/* ── double keyline, laid over the waves as in print ── */}
    <rect className="cxc-keyline" x="16" y="16" width="1091" height="762" fill="none" stroke="#c9a15a" strokeWidth="1.6" />
    <rect className="cxc-keyline" x="26" y="26" width="1071" height="742" fill="none" stroke="#d6bc82" strokeWidth="1" />

    {/* ── corner sprigs ──
        The outer group carries the entrance animation, so a CSS transform on
        it never replaces the placement transform on the inner one. */}
    {SPRIG_AT.map((transform) => (
      <g key={transform} className="cxc-sprig">
        <g transform={transform} fill="url(#cxcLeaf)">
          {SPRIG.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    ))}
  </svg>
);

/* ── small ornaments placed inline with the certificate text ──────────── */

// Gold rule with an arrowhead fleuron at its outer end, flanking a caption.
// Drawn pointing left; `flip` mirrors it for the right-hand side.
export const Flourish = ({ flip = false, className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 116 16"
    width="116"
    height="16"
    aria-hidden="true"
    focusable="false"
    style={flip ? { transform: 'scaleX(-1)' } : undefined}
  >
    <path d="M0.3 8 C3.2 5.6 7 4.1 11.6 4.6 C10.2 6.4 10.2 9.6 11.6 11.4 C7 11.9 3.2 10.4 0.3 8 Z" fill="#ad8549" />
    <path d="M11 7.3 C11.6 4.2 14.2 1.2 18.6 0.3 C18.8 3.4 16.8 6.3 12.8 7.9 Z" fill="#b99258" />
    <path d="M11 8.7 C11.6 11.8 14.2 14.8 18.6 15.7 C18.8 12.6 16.8 9.7 12.8 8.1 Z" fill="#b99258" />
    <path d="M15.4 8 C17 6.4 19 5.9 21 6.6 C20.2 7.4 20.2 8.6 21 9.4 C19 10.1 17 9.6 15.4 8 Z" fill="#ad8549" />
    <path d="M20.5 7.2 H113.8 C115 7.2 115.8 7.6 115.8 8 C115.8 8.4 115 8.8 113.8 8.8 H20.5 Z" fill="#b8925a" />
  </svg>
);

// Long hairline rule under the recipient's name, a small diamond at its centre.
export const DiamondRule = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 650 12" width="650" height="12" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="cxcRuleL" x1="0" x2="1">
        <stop offset="0" stopColor="#d2bb88" stopOpacity="0.75" />
        <stop offset="1" stopColor="#ae8646" />
      </linearGradient>
      <linearGradient id="cxcRuleR" x1="1" x2="0">
        <stop offset="0" stopColor="#d2bb88" stopOpacity="0.75" />
        <stop offset="1" stopColor="#ae8646" />
      </linearGradient>
    </defs>
    <rect x="0" y="5" width="314" height="2" fill="url(#cxcRuleL)" />
    <rect x="336" y="5" width="314" height="2" fill="url(#cxcRuleR)" />
    <path d="M325 1 L332 6 L325 11 L318 6 Z" fill="#c29a55" />
    <path d="M325 3.4 L328.6 6 L325 8.6 L321.4 6 Z" fill="#e9cf92" />
  </svg>
);

// Short rule between the two paragraphs: a hairline, an open diamond and two
// small rings.
export const OrnamentRule = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 164 14" width="164" height="14" aria-hidden="true" focusable="false">
    <path d="M1 7 H70 M94 7 H163" stroke="#cdb47d" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="73.5" cy="7" r="2.6" fill="none" stroke="#cdb47d" strokeWidth="1" />
    <circle cx="90.5" cy="7" r="2.6" fill="none" stroke="#cdb47d" strokeWidth="1" />
    <path d="M82 1.5 L86.2 7 L82 12.5 L77.8 7 Z" fill="none" stroke="#c7a86a" strokeWidth="1.1" />
  </svg>
);

// Navy banner behind "PROUDLY PRESENTED TO": a main band, two notched tails
// folded behind it, and a sheen across the right-hand end.
export const RibbonShape = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="353 262 417 52"
    width="417"
    height="52"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="cxcBand" gradientUnits="userSpaceOnUse" x1="381" y1="0" x2="742" y2="0">
        <stop offset="0" stopColor="#0a2753" />
        <stop offset="0.5" stopColor="#0e2f60" />
        <stop offset="0.88" stopColor="#0b2a57" />
        <stop offset="0.97" stopColor="#35598a" />
        <stop offset="1" stopColor="#1f4474" />
      </linearGradient>
      <linearGradient id="cxcTailR" gradientUnits="userSpaceOnUse" x1="713" y1="0" x2="770" y2="0">
        <stop offset="0" stopColor="#0a2550" />
        <stop offset="1" stopColor="#4d6f98" />
      </linearGradient>
    </defs>
    <path d="M412 274 L357 274 L374 293.5 L357 312 L412 312 Z" fill="#082149" />
    <path d="M711 274 L766 274 L749 293.5 L766 312 L711 312 Z" fill="url(#cxcTailR)" />
    <path d="M381 304 L412 304 L412 312 Z" fill="#031633" />
    <path d="M742 304 L711 304 L711 312 Z" fill="#031633" />
    <path d="M381 266.5 Q561.5 263 742 266.5 L742 304.5 Q561.5 301 381 304.5 Z" fill="url(#cxcBand)" />
    {/* hairline gold trim along the band's edges */}
    <path
      d="M381 266.5 Q561.5 263 742 266.5 M381 304.5 Q561.5 301 742 304.5"
      fill="none"
      stroke="#e3cf9f"
      strokeWidth="1"
      strokeOpacity="0.7"
    />
  </svg>
);

export default CertificateFrame;
