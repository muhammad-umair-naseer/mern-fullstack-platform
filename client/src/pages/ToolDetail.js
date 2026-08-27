import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { toolBySlug, toolsIn, CATEGORIES, COMPLEXITY } from '../data/tools';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import Seo from '../seo/Seo';
import { breadcrumbs, softwareApplication } from '../seo/schema';

const TONE = {
  emerald: 'bg-emerald-500/12 text-emerald-700 ring-emerald-600/25',
  amber: 'bg-amber-500/12 text-amber-700 ring-amber-600/25',
  orange: 'bg-orange-500/12 text-orange-700 ring-orange-600/25',
  rose: 'bg-rose-500/12 text-rose-700 ring-rose-600/25',
  crimson: 'bg-red-600/12 text-red-800 ring-red-700/25',
};

/**
 * Placeholder page for a single tool. The toolkit is at design stage, so this
 * sets expectations honestly rather than pretending an upload box works.
 */
const ToolDetail = () => {
  const { slug } = useParams();
  const introRef = useIntroTimeline();
  const tool = toolBySlug(slug);

  if (!tool) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No such tool</h1>
        <p className="mt-3 text-slate-600">That tool is not in the catalogue.</p>
        <Link to="/tools" className="mt-6 inline-block text-indigo-600 font-semibold hover:underline">
          Back to all tools
        </Link>
      </main>
    );
  }

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const meta = COMPLEXITY[tool.complexity];
  const related = toolsIn(tool.category).filter((x) => x.id !== tool.id).slice(0, 6);

  // A tool still in design is one line of description plus a notice saying so.
  // Sixty two pages of that is thin content: asking Google to index them would
  // compete for queries the page cannot satisfy and drag on the quality signal
  // for the whole site. They stay out of the index until the tool works, and
  // `follow` keeps the internal links counting.
  const live = Boolean(tool.status === 'live' || tool.url);

  return (
    <main className="text-slate-800">
      <Seo
        title={`${tool.name} — Free ${category.label} Tool`}
        description={
          live
            ? `${tool.description} Free, no account needed and no watermark.`
            : `${tool.description} Planned as a free Cortexis tool, currently in design.`
        }
        path={`/tools/${tool.slug}`}
        noindex={!live}
        schema={[
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Free Tools', path: '/tools' },
            { name: tool.name, path: `/tools/${tool.slug}` },
          ]),
          // Only claim to be an application once the tool actually runs.
          ...(live ? [softwareApplication(tool, category.label)] : []),
        ]}
      />
      <header className="relative isolate">
        <div className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700">
          <div ref={introRef} className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <Link to="/tools" data-intro className="text-sm text-indigo-100/80 hover:text-white">
              ← All free tools
            </Link>
            <div data-intro className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-400 text-emerald-950">
                FREE
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15">
                {category.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${TONE[meta.tone]}`}
              >
                {meta.label} to build
              </span>
            </div>
            <h1 data-intro className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
              {tool.name}
            </h1>
            <p data-intro className="mt-3 text-lg max-w-2xl text-indigo-100/90">
              {tool.description}
            </p>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <span className="inline-grid place-items-center h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-600 text-xl">
            ⏳
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">In design</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            This tool is planned but not built yet. When it ships it will be free, need no account
            and add no watermark. If you would use it, say so and it moves up the list.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Tell us you need this
            </Link>
            <Link
              to="/tools"
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Browse other tools
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Other {category.label.toLowerCase()} tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/tools/${r.slug}`}
                  className="bg-white rounded-xl p-4 shadow-card hover:shadow-cardLg transition block"
                >
                  <h3 className="font-semibold text-slate-900 text-sm">{r.name}</h3>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ToolDetail;
