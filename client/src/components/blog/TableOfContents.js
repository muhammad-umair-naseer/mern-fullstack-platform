import React from 'react';
import { ListOrdered, ArrowDownRight, BookOpen } from 'lucide-react';

const TableOfContents = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add a temporary highlight glow to the target element
      element.classList.add('bg-orange-50/80', 'transition-colors', 'duration-500', 'p-1', 'rounded');
      setTimeout(() => {
        element.classList.remove('bg-orange-50/80');
      }, 1500);
    }
  };

  return (
    <div className="cx-lv-in my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-md">
      {/* TOC Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 bg-slate-100/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 m-0 p-0">Table of Contents</h2>
            <p className="text-xs font-medium text-slate-500 m-0 p-0">Click any section to jump directly</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
          <ListOrdered className="h-3.5 w-3.5" />
          {items.length} Sections
        </span>
      </div>

      {/* TOC Table / Grid */}
      <div className="divide-y divide-slate-100 p-2 sm:p-4">
        <div className="grid gap-1.5">
          {items.map((item, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            return (
              <button
                key={item.id || index}
                type="button"
                onClick={() => scrollToHeading(item.id)}
                className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all hover:bg-orange-50/60 hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5 pr-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-500 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                    {num}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-orange-600">
                    {item.title}
                  </span>
                </div>
                <ArrowDownRight className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-all group-hover:opacity-100 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
