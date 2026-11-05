import React from 'react';
import { CATEGORIES } from '../../../data/tools.js';

/** Search box and category chips for the tools catalogue. */
const ToolFilters = ({ q, onQueryChange, cat, onCategoryChange }) => (
  <div className="rounded-2xl bg-white shadow-md p-4 md:p-5 grid md:grid-cols-[1fr_auto] gap-4">
    <div className="relative">
      <span className="absolute left-3 top-2.5 text-slate-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
      <input
        value={q}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Search tools, e.g. compress, merge, convert…"
        aria-label="Search tools"
      />
    </div>

    <div className="flex gap-2 overflow-auto">
      {['All', ...CATEGORIES.map((c) => c.id)].map((id) => {
        const label = id === 'All' ? 'All' : CATEGORIES.find((c) => c.id === id).label;
        return (
          <button
            key={id}
            onClick={() => onCategoryChange(id)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap border ${
              cat === id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  </div>
);

export default React.memo(ToolFilters);
