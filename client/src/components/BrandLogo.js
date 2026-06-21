import React, { useId, useState } from 'react';

/**
 * Cortexis Solution Hub logomark.
 * Prefers the real logo image at /cortexis-logo.png (drop it in client/public/).
 * If that file is missing or fails to load, it gracefully falls back to a
 * built-in SVG recreation of the split brain/circuit mark.
 */
const BrandLogo = ({ size = 40, className = '' }) => {
  const id = useId();
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <img
        src={`${process.env.PUBLIC_URL}/cortexis-mark.png`}
        width={size}
        height={size}
        alt="Cortexis Solution Hub logo"
        className={className}
        style={{ objectFit: 'contain', display: 'block' }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  const orange = `orange-${id}`;
  const blue = `blue-${id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Cortexis Solution Hub logo"
      className={className}
    >
      <defs>
        <linearGradient id={orange} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb8c3c" />
          <stop offset="100%" stopColor="#e85d10" />
        </linearGradient>
        <linearGradient id={blue} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b9eea" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* rounded monitor frame */}
      <rect x="4" y="6" width="56" height="44" rx="9" fill="white" stroke="#4c2a86" strokeWidth="2.5" />
      <rect x="26" y="50" width="12" height="5" rx="1.5" fill="#4c2a86" />
      <rect x="20" y="55" width="24" height="3.5" rx="1.75" fill="#4c2a86" />

      {/* left (orange) brain half */}
      <path
        d="M31 16c-4-3-11-2-13 3-5 1-6 7-2 10-3 3-1 9 4 9 1 3 6 4 9 1 1 1 2 1 2 1V16s0 0 0 0z"
        fill={`url(#${orange})`}
      />
      {/* right (blue) brain half */}
      <path
        d="M33 16c4-3 11-2 13 3 5 1 6 7 2 10 3 3 1 9-4 9-1 3-6 4-9 1-1 1-2 1-2 1V16s0 0 0 0z"
        fill={`url(#${blue})`}
      />
      {/* circuit nodes */}
      <g fill="#fff" opacity="0.9">
        <circle cx="22" cy="24" r="1.5" />
        <circle cx="25" cy="33" r="1.5" />
        <circle cx="42" cy="24" r="1.5" />
        <circle cx="39" cy="33" r="1.5" />
      </g>
    </svg>
  );
};

export default BrandLogo;
