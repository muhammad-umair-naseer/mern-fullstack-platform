import React from 'react';

// A cubic bezier offset by a constant perpendicular distance. Hand-tuned
// control points drift — the gap between the accent line and the band edge
// ended up varying from 15px to 20px along its length — so the accent is
// derived from the band's own curve instead, sampled and offset along the
// normal. `side` flips which way the offset goes.
const offsetCurve = (pts, distance, bleed = 46, samples = 64) => {
  const at = (t) => {
    const u = 1 - t;
    return [
      u * u * u * pts[0][0] + 3 * u * u * t * pts[1][0] + 3 * u * t * t * pts[2][0] + t * t * t * pts[3][0],
      u * u * u * pts[0][1] + 3 * u * u * t * pts[1][1] + 3 * u * t * t * pts[2][1] + t * t * t * pts[3][1],
    ];
  };
  const tangent = (t) => {
    const u = 1 - t;
    return [
      3 * u * u * (pts[1][0] - pts[0][0]) + 6 * u * t * (pts[2][0] - pts[1][0]) + 3 * t * t * (pts[3][0] - pts[2][0]),
      3 * u * u * (pts[1][1] - pts[0][1]) + 6 * u * t * (pts[2][1] - pts[1][1]) + 3 * t * t * (pts[3][1] - pts[2][1]),
    ];
  };

  const out = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const [x, y] = at(t);
    const [dx, dy] = tangent(t);
    const len = Math.hypot(dx, dy) || 1;
    // Normal points to the left of travel; negate distance to flip sides.
    out.push([x + (dy / len) * distance, y - (dx / len) * distance]);
  }

  // The offset shifts both endpoints inward, which left the line stopping in
  // mid-air instead of running off the sheet. Extend along the end tangents so
  // it bleeds past the edge exactly as the band it parallels does.
  const extend = (point, [dx, dy], by) => {
    const len = Math.hypot(dx, dy) || 1;
    return [point[0] + (dx / len) * by, point[1] + (dy / len) * by];
  };
  out.unshift(extend(out[0], tangent(0), -bleed));
  out.push(extend(out[out.length - 1], tangent(1), bleed));

  return `M${out.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`;
};

// Band edges the accents run parallel to.
const BL_BAND = [[0, 468], [150, 556], [278, 682], [400, 794]];
const TR_BAND = [[872, 0], [960, 155], [1035, 250], [1123, 292]];

const BL_ACCENT = offsetCurve(BL_BAND, 18);
const TR_ACCENT = offsetCurve(TR_BAND, -18);

// Decorative border for the certificate, drawn as inline SVG so it stays crisp
// at any print size and needs no image assets. Geometry mirrors the company's
// existing certificate: a gold ribbon sweeping the top-right, layered blue and
// gold waves across the bottom-left, and a thin inner keyline.
const CertificateFrame = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1123 794"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cxGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#dcae55" />
        <stop offset="55%" stopColor="#c8922e" />
        <stop offset="100%" stopColor="#b9832a" />
      </linearGradient>
      <linearGradient id="cxGoldSoft" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d3a244" />
        <stop offset="100%" stopColor="#bd8a2e" />
      </linearGradient>
      <linearGradient id="cxBlue" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#1273a8" />
        <stop offset="100%" stopColor="#2e97c6" />
      </linearGradient>
      <linearGradient id="cxBlueDeep" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#0c5f8e" />
        <stop offset="100%" stopColor="#1c84b6" />
      </linearGradient>
    </defs>

    {/* Keyline first, so the corner decoration paints over it — otherwise the
        thin rule reads as a stray line crossing the wave bands. */}
    <rect
      x="38"
      y="38"
      width="1047"
      height="718"
      rx="4"
      fill="none"
      stroke="url(#cxGoldSoft)"
      strokeWidth="1"
      opacity="0.55"
    />

    {/* ── top-right ── the accent stroke is a constant offset from the band
        edge, so the gap between them stays even along its whole length ── */}
    <path d="M1123 0 L1123 292 C1035 250 960 155 872 0 Z" fill="url(#cxBlue)" opacity="0.92" />
    <path d="M1123 0 L1123 196 C1055 165 1000 96 944 0 Z" fill="url(#cxGold)" />
    <path
      d={TR_ACCENT}
      fill="none"
      stroke="url(#cxGoldSoft)"
      strokeWidth="2.5"
      opacity="0.9"
    />

    {/* ── bottom-left ── */}
    <path d="M0 794 L0 468 C150 556 278 682 400 794 Z" fill="url(#cxBlueDeep)" opacity="0.95" />
    <path d="M0 794 L0 566 C132 640 232 716 330 794 Z" fill="url(#cxGold)" />
    <path d="M0 794 L0 652 C108 706 182 752 252 794 Z" fill="url(#cxBlue)" />
    <path
      d={BL_ACCENT}
      fill="none"
      stroke="url(#cxGoldSoft)"
      strokeWidth="2.5"
      opacity="0.85"
    />

    {/* ── bottom-right accent ── */}
    <path d="M1123 794 L1123 706 C1058 742 1004 766 952 794 Z" fill="url(#cxBlue)" opacity="0.85" />
    <path d="M1123 794 L1123 748 C1080 768 1048 780 1022 794 Z" fill="url(#cxGold)" />

  </svg>
);

export default CertificateFrame;
