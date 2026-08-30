import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { toolBySlug, toolsIn, CATEGORIES, COMPLEXITY } from '../data/tools';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import PdfCompressor from '../components/tools/PdfCompressor';
import PdfMerger from '../components/tools/PdfMerger';

const TONE = {
  emerald: 'bg-emerald-500/12 text-emerald-700 ring-emerald-600/25',
  amber: 'bg-amber-500/12 text-amber-700 ring-amber-600/25',
  orange: 'bg-orange-500/12 text-orange-700 ring-orange-600/25',
  rose: 'bg-rose-500/12 text-rose-700 ring-rose-600/25',
  crimson: 'bg-red-600/12 text-red-800 ring-red-700/25',
};

export default function ToolDetail() {
  const { slug } = useParams();
  const introRef = useIntroTimeline();
  const tool = toolBySlug(slug);

  if (!tool) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No such tool</h1>
        <p className="mt-3 text-slate-600">That tool is not in the catalogue.</p>
        <Link to="/tools" className="mt-6 inline-block text-orange-600 font-semibold hover:underline">
          Back to all tools
        </Link>
      </main>
    );
  }

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const meta = COMPLEXITY[tool.complexity];
  const related = toolsIn(tool.category).filter((x) => x.id !== tool.id).slice(0, 6);

  const renderToolComponent = () => {
    if (tool.slug === 'pdf-compressor') {
      return <PdfCompressor />;
    }
    if (tool.slug === 'pdf-merger') {
      return <PdfMerger />;
    }
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-slate-200">
        <span className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-600 text-2xl mx-auto">
          ⏳
        </span>
        <h2 className="mt-5 text-2xl font-bold text-slate-900">Tool in Active Development</h2>
        <p className="mt-2 text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
          This tool is planned on our roadmap. When it ships it will be completely free, client-side, need no account
          and add no watermark. Tell us if you need this tool prioritized.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md transition"
          >
            Request this tool
          </Link>
          <Link
            to="/tools"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Browse other tools
          </Link>
        </div>
      </div>
    );
  };

  return (
    <main className="text-slate-800 pb-20">
      {/* Header Banner */}
      <header className="relative isolate">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div ref={introRef} className="max-w-5xl mx-auto px-6 py-14 md:py-18">
            <Link to="/tools" data-intro className="text-sm text-slate-300 hover:text-white transition flex items-center gap-1">
              ← Back to all free tools
            </Link>
            <div data-intro className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 shadow-sm">
                FREE FOR EVERYONE
              </span>
              {tool.isLive && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-500 text-white shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  INSTANT BROWSER TOOL
                </span>
              )}
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white">
                {category?.label || 'Utility'}
              </span>
              {!tool.isLive && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${TONE[meta?.tone] || ''}`}
                >
                  {meta?.label} to build
                </span>
              )}
            </div>
            <h1 data-intro className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              {tool.name}
            </h1>
            <p data-intro className="mt-3 text-base md:text-lg max-w-2xl text-slate-300">
              {tool.description}
            </p>
          </div>
        </div>
      </header>

      {/* Main Tool Content */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        {renderToolComponent()}

        {/* Related Tools */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Other {category?.label?.toLowerCase() || ''} tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/tools/${r.slug}`}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200/80 hover:border-orange-400/40 transition block group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition">
                      {r.name}
                    </h3>
                    {r.isLive && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
