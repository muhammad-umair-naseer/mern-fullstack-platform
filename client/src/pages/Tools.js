import React, { useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Plus, Wrench } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { useToolFilter } from '../hooks/useToolFilter';
import ToolFilters from '../components/tools/ToolFilters';
import ToolCard from '../components/tools/ToolCard';
import '../learn/ToolCard.css';
import { useGridReveal } from '../hooks/useGridReveal';
import bringIntoView from '../learn/bringIntoView';
import Seo from '../seo/Seo';
import { breadcrumbs, itemList, faq as faqSchema } from '../seo/schema';
import FaqSection from '../components/FaqSection';
import { faqsFor } from '../data/faqs';
import PageHero from '../components/PageHero';
import ToolsOrbit, { CATEGORY_ICONS } from '../components/heroes/ToolsOrbit';

// A category keeps its number whether or not a filter hides its neighbours.
const CAT_NO = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, String(i + 1).padStart(2, '0')]));

const Tools = () => {
  const { q, setQ, cat, setCat, filtered, grouped, isStale } = useToolFilter();
  const { hash } = useLocation();

  const gridRef = useGridReveal([filtered]);

  // /tools#cat-pdf opens the catalogue filtered to one category. The hero's
  // orbit labels link there, and call this directly too, so picking the same
  // label twice still brings the list back into view. bringIntoView keeps the
  // list in view while the footer's ScrollTrigger refresh answers the new page
  // height. Focus moves with it, so a keyboard user lands in the list rather
  // than back in the hero.
  const stopScroll = useRef(() => {});
  const showCategory = useCallback(
    (id) => {
      if (!CATEGORIES.some((c) => c.id === id)) return;
      setCat(id);
      const list = document.getElementById('tool-list');
      if (!list) return;
      stopScroll.current();
      stopScroll.current = bringIntoView(list);
      list.focus({ preventScroll: true });
    },
    [setCat]
  );

  useEffect(() => () => stopScroll.current(), []);

  useEffect(() => {
    if (hash.startsWith('#cat-')) showCategory(hash.slice(5));
  }, [hash, showCategory]);

  return (
    <main className="text-slate-800">
      <Seo
        title="Free Online Tools for Developers and Designers"
        description="A catalogue of free tools for developers, designers and marketers. Converters, formatters, generators and calculators, all free and with no sign up."
        path="/tools"
        schema={[
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Free Tools', path: '/tools' }]),
          // The catalogue itself is real content: every named utility, grouped
          // by category, each linking to its own page.
          itemList(
            TOOLS.map((t) => ({ title: t.name, slug: t.slug })),
            (t) => `/tools/${t.slug}`
          ),
          faqSchema(faqsFor('/tools').map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      <PageHero
        label="Free tools"
        lines={['Every file,', <em>handled.</em>]}
        lede="Convert, compress and clean up files, all free."
        actions={[
          { href: '#tool-list', label: 'Browse the toolkit', primary: true },
          { to: '/contact', label: 'Request a tool' },
        ]}
        visual={<ToolsOrbit onPick={showCategory} />}
      />

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <ToolFilters q={q} onQueryChange={setQ} cat={cat} onCategoryChange={setCat} />
      </section>

      <section
        ref={gridRef}
        id="tool-list"
        tabIndex={-1}
        aria-label="Tool catalogue"
        className={`max-w-7xl mx-auto px-6 py-14 outline-none transition-opacity duration-150 ${isStale ? 'opacity-60' : ''}`}
      >
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-16">
            No tools match that search. Try a different word or clear the filters.
          </p>
        ) : (
          grouped.map((group) => {
            const Icon = CATEGORY_ICONS[group.id] || Wrench;
            return (
              <div key={group.id} className="mb-16 last:mb-0">
                <header className="lx-tl-head">
                  <span className="lx-tl-ico" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.3} />
                  </span>
                  <span className="lx-tl-no" aria-hidden="true">
                    {CAT_NO[group.id]}
                  </span>
                  <h2 className="lx-tl-name">
                    {group.label}
                    <sup>
                      {group.items.length}
                      <span className="sr-only"> tools</span>
                    </sup>
                  </h2>
                  <p className="lx-tl-blurb">{group.blurb}</p>
                  <i className="lx-tl-rule" aria-hidden="true" />
                </header>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.items.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* The way out of the catalogue: ask for what is not in it. The ring is
          the seven categories turning round the slot a new tool would fill. */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="lx-tl-ask">
          <div className="lx-tl-ask-copy">
            <span className="lx-label">Request</span>
            <h2 className="lx-tl-ask-title">
              Missing a tool? <em>Ask for it.</em>
            </h2>
            <ul className="lx-tl-ask-facts">
              <li>Free</li>
              <li>No sign-up</li>
              <li>No watermark</li>
            </ul>
            <Link to="/contact" className="btn lx-btn">
              Request a tool
              <span className="lx-btn-disc" aria-hidden="true">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
          <div className="lx-tl-ask-ring" aria-hidden="true">
            <span className="lx-tl-ask-slot">
              <Plus size={22} strokeWidth={1.2} />
            </span>
            <span className="lx-tl-ask-orbit">
              {CATEGORIES.map((c, i) => {
                const Icon = CATEGORY_ICONS[c.id] || Wrench;
                return (
                  <span key={c.id} style={{ '--k': i, '--n': CATEGORIES.length }}>
                    <Icon size={16} strokeWidth={1.3} />
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      </section>
      <FaqSection page="/tools" title="Questions about the tools" />
    </main>
  );
};

export default Tools;
