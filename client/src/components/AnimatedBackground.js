import React from 'react';
import './AnimatedBackground.css';

/**
 * Cortexis Solution Hub — liquid glass backdrop.
 *
 * Soft colour pools drift behind a fine mesh, with a travelling sheen on top,
 * so the frosted panels have something to refract.
 *
 * Performance note: an earlier version fused the pools with an SVG goo filter
 * applied to their shared parent. That forced a style recalc and a full-viewport
 * re-filter on every animation frame — measured at 851ms of style recalc and
 * 8x the CPU on /tools. Each pool now carries its own static blur and animates
 * only `transform`/`opacity`, which the compositor can handle without
 * re-rasterising, and the blending is done with plain alpha instead.
 *
 * Fixed behind all content, pointer-events none, still under reduced motion.
 */
const POOLS = [
  { className: 'cx-pool cx-pool--a', style: { width: '42vw', height: '40vw', left: '-9vw', top: '-8%' } },
  { className: 'cx-pool cx-pool--c', style: { width: '38vw', height: '36vw', right: '-8vw', top: '4%' } },
  { className: 'cx-pool cx-pool--d', style: { width: '32vw', height: '34vw', right: '14vw', top: '34%' } },
  { className: 'cx-pool cx-pool--e', style: { width: '36vw', height: '38vw', left: '9vw', bottom: '-13%' } },
];

const AnimatedBackground = () => (
  <div className="cx-backdrop" aria-hidden="true">
    <div className="cx-liquid">
      {POOLS.map((p, i) => (
        <span key={i} className={p.className} style={p.style} />
      ))}
    </div>
    <div className="cx-mesh" />
    <div className="cx-sheen" />
    <div className="cx-vignette" />
  </div>
);

export default AnimatedBackground;
