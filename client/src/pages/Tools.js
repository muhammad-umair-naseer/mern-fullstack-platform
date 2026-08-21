import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../data/tools';
import { useToolFilter } from '../hooks/useToolFilter';
import ToolFilters from '../components/tools/ToolFilters';
import ToolCard from '../components/tools/ToolCard';
import '../learn/ToolCard.css';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import { useGridReveal } from '../hooks/useGridReveal';

const Tools = () => {
  const introRef = useIntroTimeline();
  const { q, setQ, cat, setCat, filtered, grouped, isStale } = useToolFilter();

  const gridRef = useGridReveal([filtered]);

  return (
    <main className="text-slate-800">
      <header className="relative isolate">
        <div className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700">
          <div
            ref={introRef}
            className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-[1.1fr_.9fr] gap-10 items-center"
          >
            <div>
              <span
                data-intro
                className="inline-block text-xs font-bold tracking-wide px-3 py-1 rounded-full bg-emerald-400 text-emerald-950"
              >
                FREE FOR EVERYONE · NO ACCOUNT NEEDED
              </span>
              <h1
                data-intro
                className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
              >
                Free tools for everyday files
              </h1>
              <p data-intro className="mt-4 text-lg max-w-xl text-indigo-100/90">
                {TOOLS.length} utilities for PDFs, images, video, audio and code, planned as one
                free toolkit. Browse what is coming and tell us which you need first.
              </p>
              <div data-intro className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#tool-list"
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold bg-white text-indigo-700 shadow-lg"
                >
                  Browse the toolkit
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold ring-2 ring-white/80 text-white"
                >
                  Request a tool
                </Link>
              </div>
            </div>

            {/* Category counts double as a preview of the catalogue's shape */}
            <div data-intro className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCat(c.id);
                    document.getElementById('tool-list')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl px-4 py-3 text-left shadow-card hover:shadow-cardLg transition"
                >
                  <span className="block text-2xl font-extrabold text-slate-900">
                    {TOOLS.filter((x) => x.category === c.id).length}
                  </span>
                  <span className="block text-sm text-slate-600">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <ToolFilters q={q} onQueryChange={setQ} cat={cat} onCategoryChange={setCat} />
      </section>

      <section
        ref={gridRef}
        id="tool-list"
        className={`max-w-7xl mx-auto px-6 py-14 transition-opacity duration-150 ${isStale ? 'opacity-60' : ''}`}
      >
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-16">
            No tools match that search. Try a different word or clear the filters.
          </p>
        ) : (
          grouped.map((group) => (
            <div key={group.id} className="mb-14 last:mb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{group.label}</h2>
                  <p className="mt-1 text-slate-600">{group.blurb}</p>
                </div>
                <span className="text-sm text-slate-500">{group.items.length} tools</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Which should we build first?</h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            This toolkit is in design. Every tool will be free to use with no account and no
            watermark. Tell us which ones you would actually use and we will prioritise those.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Request a tool
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Tools;
