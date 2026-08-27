import React from 'react';
import './ProgressBar.css';

/* Same props, same aria, same size and colours as before. The one change is the
   property that moves: the fill scales on the compositor instead of animating
   its width, which used to force layout on every frame for every bar on screen.
   The 0–1 scale factor is handed to CSS as a custom property so the mount
   animation and the value transition can share it. */
const ProgressBar = ({ percent, className = '' }) => {
  const value = Math.min(100, Math.max(0, Number(percent) || 0));

  // Presentation only: sweeping while there is progress left to make, still
  // once there is not.
  const state = value >= 100 ? 'is-done' : value > 0 ? 'is-active' : 'is-empty';

  return (
    <div
      className={`cx-pb h-2 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`cx-pb-fill ${state} h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500`}
        style={{ '--cx-pb-value': String(value / 100) }}
      >
        {value > 0 && <span className="cx-pb-sheen" aria-hidden="true" />}
      </div>
    </div>
  );
};

export default ProgressBar;
