import React from 'react';

/**
 * Global animated brand backdrop for Cortexis Solution Hub.
 * Fixed behind all content (pointer-events: none, z-index below app).
 * Soft aurora "blobs" in the brand colors drift and morph; a faint grid
 * adds depth. Honors prefers-reduced-motion via the motion-reduce variant.
 */
const Blob = ({ className, style }) => (
  <div
    aria-hidden="true"
    className={`absolute rounded-full blur-3xl opacity-50 mix-blend-multiply motion-reduce:animate-none ${className}`}
    style={style}
  />
);

const AnimatedBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-indigo-50/60"
  >
    {/* Aurora blobs in brand palette */}
    <Blob
      className="animate-blob"
      style={{ top: '-8rem', left: '-6rem', width: '34rem', height: '34rem', background: 'radial-gradient(circle at 30% 30%, #4c2a86, transparent 70%)' }}
    />
    <Blob
      className="animate-blob-slow"
      style={{ top: '20%', right: '-8rem', width: '32rem', height: '32rem', background: 'radial-gradient(circle at 30% 30%, #2563eb, transparent 70%)', animationDelay: '-6s' }}
    />
    <Blob
      className="animate-blob"
      style={{ bottom: '-10rem', left: '15%', width: '30rem', height: '30rem', background: 'radial-gradient(circle at 30% 30%, #f4701f, transparent 70%)', animationDelay: '-3s' }}
    />
    <Blob
      className="animate-blob-slow"
      style={{ bottom: '5%', right: '20%', width: '24rem', height: '24rem', background: 'radial-gradient(circle at 30% 30%, #29abe2, transparent 70%)', animationDelay: '-9s' }}
    />

    {/* Faint circuit-style grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          'linear-gradient(to right, #4c2a86 1px, transparent 1px), linear-gradient(to bottom, #4c2a86 1px, transparent 1px)',
        backgroundSize: '46px 46px'
      }}
    />
  </div>
);

export default AnimatedBackground;
