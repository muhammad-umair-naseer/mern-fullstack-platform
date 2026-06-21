import React, { useMemo } from 'react';
import './AnimatedBackground.css';

/**
 * Cortexis Solution Hub — cosmic animated backdrop.
 * Starfield + drifting brand blobs + a rising particle field + a slowly
 * rotating wireframe globe. Fixed behind all content, pointer-events none,
 * and reduced-motion friendly (see AnimatedBackground.css).
 */

// Deterministic pseudo-random so the layout is stable across renders
// (no Math.random — keeps SSR/build output consistent).
const rand = (seed) => {
  const x = Math.sin(seed * 999.13) * 43758.5453;
  return x - Math.floor(x);
};

const PARTICLE_COLORS = ['#8b5cf6', '#e056e5', '#f97316', '#a78bfa'];

const AnimatedBackground = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const size = 2 + rand(i + 1) * 5;
        return {
          left: `${rand(i + 2) * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          '--pc': PARTICLE_COLORS[i % PARTICLE_COLORS.length],
          '--dx': `${(rand(i + 3) - 0.5) * 80}px`,
          animationDuration: `${12 + rand(i + 4) * 16}s`,
          animationDelay: `${-rand(i + 5) * 18}s`,
          opacity: 0.5 + rand(i + 6) * 0.4
        };
      }),
    []
  );

  const meridians = useMemo(
    () => Array.from({ length: 9 }, (_, i) => `rotateY(${i * 20}deg)`),
    []
  );

  const parallels = useMemo(
    () =>
      [88, 78, 62, 42].map((pct) => ({
        width: `${pct}%`,
        height: `${pct}%`
      })),
    []
  );

  const dots = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        top: `${15 + rand(i + 11) * 70}%`,
        left: `${12 + rand(i + 21) * 76}%`,
        animationDelay: `${-rand(i + 31) * 2.6}s`
      })),
    []
  );

  return (
    <div className="cx-backdrop" aria-hidden="true">
      <div className="cx-stars" />

      <div className="cx-blob" style={{ width: '36vw', height: '36vw', left: '-8vw', top: '8%', background: 'rgba(139,92,246,0.16)' }} />
      <div className="cx-blob" style={{ width: '28vw', height: '28vw', right: '6vw', bottom: '4%', background: 'rgba(249,115,22,0.12)', animationDelay: '-5s', animationDuration: '18s' }} />
      <div className="cx-blob" style={{ width: '20vw', height: '20vw', left: '30%', bottom: '-6%', background: 'rgba(224,86,229,0.10)', animationDelay: '-9s', animationDuration: '16s' }} />

      <div className="cx-particle-field">
        {particles.map((p, i) => (
          <span key={i} className="cx-particle" style={p} />
        ))}
      </div>

      <div className="cx-globe-stage">
        <div className="cx-globe" />
        <div className="cx-globe-grid">
          {meridians.map((t, i) => (
            <div key={i} className="cx-meridian" style={{ transform: t }} />
          ))}
          {parallels.map((s, i) => (
            <div key={`p${i}`} className="cx-parallel" style={s} />
          ))}
        </div>
        <div className="cx-globe-dots">
          {dots.map((d, i) => (
            <span key={i} className="cx-doc-dot" style={d} />
          ))}
        </div>
        <div className="cx-globe-rim" />
        <div className="cx-orbit-ring" style={{ width: '104%', height: '104%' }}>
          <div className="cx-orbit-sat" />
        </div>
        <div className="cx-orbit-ring" style={{ width: '118%', height: '118%', animationDuration: '95s' }}>
          <div className="cx-orbit-sat" style={{ background: '#8b5cf6', boxShadow: '0 0 10px 2px rgba(139,92,246,0.8)' }} />
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
