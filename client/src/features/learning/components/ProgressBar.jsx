import React from 'react';
import './ProgressBar.css';

/* Same props and aria as before. The fill scales on the compositor instead of
   animating its width, and its colour, height and track now live in
   ProgressBar.css (copper on a warm hairline track) rather than in utility
   classes. The 0–1 scale factor is handed to CSS as a custom property so the
   mount animation and the value transition can share it. */
const ProgressBar = ({ percent, className = '' }) => {
  const value = Math.min(100, Math.max(0, Number(percent) || 0));

  // Presentation only: sweeping while there is progress left to make, still
  // once there is not.
  const state = value >= 100 ? 'is-done' : value > 0 ? 'is-active' : 'is-empty';

  return (
    <div
      className={`cx-pb ${className}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`cx-pb-fill ${state}`}
        style={{ '--cx-pb-value': String(value / 100) }}
      >
        {value > 0 && <span className="cx-pb-sheen" aria-hidden="true" />}
      </div>
    </div>
  );
};

export default ProgressBar;
