import React from 'react';

const ProgressBar = ({ percent, className = '' }) => (
  <div
    className={`h-2 rounded-full bg-white/10 overflow-hidden ${className}`}
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-[width] duration-500"
      style={{ width: `${percent}%` }}
    />
  </div>
);

export default ProgressBar;
