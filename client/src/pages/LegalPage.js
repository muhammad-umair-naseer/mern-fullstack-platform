import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUp, Mail, ArrowRight, ChevronDown } from 'lucide-react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import bringIntoView from '../learn/bringIntoView';
import PageHero from '../components/PageHero';
import LegalPageVisual from '../components/heroes/LegalPageVisual';
import Seo from '../seo/Seo';
import { breadcrumbs } from '../seo/schema';

/* Render one content block. Blocks keep pages declarative:
   { p } paragraph · { h } sub-heading · { list } bullet list (items are strings or
   { b, t } bold-lead) · { note } callout · { table:{head,rows} } · { cards:[{icon,title,text}] }
   · { callout:{variant:'info'|'warn', title, text} } */
function Block({ block }) {
  if (block.h) {
    return <h3 className="mt-7 mb-2 text-lg font-semibold text-slate-900">{block.h}</h3>;
  }
  if (block.list) {
    return (
      <ul className="my-3 space-y-2.5">
        {block.list.map((item, i) => (
          <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-accent to-brand-magenta" />
            <span className="min-w-0 break-words">
              {typeof item === 'string' ? (
                item
              ) : (
                <>
                  <strong className="font-semibold text-slate-900">{item.b}</strong> {item.t}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.table) {
    return (
      <div className="my-5 overflow-x-auto rounded-2xl ring-1 ring-slate-200">
        <table className="w-full min-w-[540px] border-collapse text-sm">
          <thead>
            <tr>
              {block.table.head.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 align-top text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.callout) {
    const warn = block.callout.variant === 'warn';
    return (
      <div
        className={`my-5 rounded-2xl border-l-4 bg-white p-5 ring-1 ring-slate-200/70 ${
          warn ? 'border-amber-400' : 'border-brand-accent'
        }`}
      >
        {block.callout.title && <p className="mb-1 font-semibold text-slate-900">{block.callout.title}</p>}
        <p className="text-sm leading-relaxed text-slate-600">{block.callout.text}</p>
      </div>
    );
  }
  if (block.cards) {
    return (
      <div className="my-5 grid gap-4 sm:grid-cols-2">
        {block.cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            {c.icon && (
              <div className="mb-2 text-2xl" aria-hidden>
                {c.icon}
              </div>
            )}
            <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.text}</p>
          </div>
        ))}
      </div>
    );
  }
  if (block.note) {
    return (
      <div className="my-5 rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
        <p className="text-sm leading-relaxed text-slate-600">{block.note}</p>
      </div>
    );
  }
  return <p className="my-3 text-slate-600 leading-relaxed">{block.p}</p>;
}

// `subtitle` is still passed by the legal pages but no longer shown: the hero
// keeps to a title, the revision date and the document itself.
export default function LegalPage({ seo, kind = 'terms', title, lastUpdated, sections, contactHref = '/contact', crossLink }) {
  const cross = crossLink || {
    to: kind === 'privacy' ? '/terms' : '/privacy',
    label: kind === 'privacy' ? 'Terms & Conditions' : 'Privacy Policy',
  };
  const bodyRef = useRevealOnScroll('[data-reveal]', { y: 32, stagger: 0.08 });

  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const ticking = useRef(false);

  // Reading-progress bar + back-to-top visibility (rAF-throttled scroll).
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        setProgress(scrollable > 0 ? Math.min(1, doc.scrollTop / scrollable) : 0);
        setShowTop(doc.scrollTop > 640);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the section nearest the top of the viewport.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // The phone-width contents list folds away once a section is picked, which
  // changes the page height. The footer answers a height change with a
  // ScrollTrigger refresh, and a refresh cancels a smooth scroll in flight,
  // so the jump goes through bringIntoView, which re-issues it after each
  // refresh. A section not yet revealed still sits 32px low (the reveal's
  // start state), and scrollIntoView measures that offset, so it is cleared
  // first: the section then only fades in where it lands.
  const mobileTocRef = useRef(null);
  const stopJump = useRef(() => {});
  useEffect(() => () => stopJump.current(), []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (mobileTocRef.current) mobileTocRef.current.open = false;
    gsap.set(el, { clearProps: 'transform' });
    stopJump.current();
    stopJump.current = bringIntoView(el);
    setActiveId(id);
  }, []);

  const tocList = (
    <ol className="space-y-1">
      {sections.map((s, i) => {
        const active = activeId === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => scrollTo(s.id)}
              aria-current={active ? 'true' : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                active ? 'bg-orange-50 ring-1 ring-orange-200 font-semibold' : 'hover:bg-slate-50'
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg font-mono text-[11px] transition ${
                  active
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`leading-snug ${
                  active ? 'text-orange-600' : 'text-slate-700 group-hover:text-slate-900'
                }`}
              >
                {s.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  // The /your-bot/* pages are the Your Bot product's own policies, so their
  // hero names the product; otherwise /privacy and /your-bot/privacy would
  // open identically.
  const isYourBot = Boolean(seo?.path?.startsWith('/your-bot'));
  const owner = isYourBot ? 'Cortexis Your Bot' : 'Cortexis Solution Hub';

  // The title's words become the headline's lines; the gradient word turns
  // into the italic copper phrase and closes the sentence.
  const heroLines = title.map((w, i) => {
    const text = w.text.trim() + (i === title.length - 1 ? '.' : '');
    return w.grad ? <em>{text}</em> : text;
  });

  return (
    <main className="relative text-slate-900">
      {seo && (
        <Seo
          title={seo.title}
          description={seo.description}
          path={seo.path}
          noindex={Boolean(seo.noindex)}
          schema={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: seo.title, path: seo.path },
          ])}
        />
      )}
      {/* Reading-progress bar, a copper hairline above the navbar */}
      <div className="fixed inset-x-0 top-0 z-[1000] h-[2px]" aria-hidden="true">
        <div
          className="h-full origin-left"
          style={{ transform: `scaleX(${progress})`, background: 'var(--copper)' }}
        />
      </div>

      <PageHero
        id="legal-hero-heading"
        label={isYourBot ? 'Your Bot' : 'Legal'}
        lines={heroLines}
        lede={`Last updated ${lastUpdated}.`}
        actions={[
          ...(sections[0] ? [{ href: `#${sections[0].id}`, label: 'Start reading', primary: true }] : []),
          { to: cross.to, label: cross.label },
        ]}
        visual={<LegalPageVisual kind={kind} owner={owner} title={title} sections={sections} lastUpdated={lastUpdated} />}
      />

      {/* ── Body: contents rail + sections ───────────────────────────────
          Aligned to the hero's edges. The document column is capped so a
          line of the legal text stays under about 80 characters. */}
      <div ref={bodyRef} className="lx-wrap pt-2 pb-14 md:pb-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,48rem)] lg:justify-between lg:gap-12">
          {/* Contents: a sticky rail on wide screens, a folded list on phones */}
          <aside className="lg:sticky lg:top-24 lg:self-start" data-reveal>
            <details
              ref={mobileTocRef}
              className="group/toc rounded-3xl bg-white shadow-cardLg ring-1 ring-slate-200 lg:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">On this page</span>
                <span className="flex items-center gap-2 font-mono text-xs text-slate-500">
                  {sections.length} sections
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open/toc:rotate-180" aria-hidden="true" />
                </span>
              </summary>
              <nav aria-label="On this page" className="px-2 pb-4">
                {tocList}
              </nav>
            </details>

            <nav
              aria-label="On this page"
              className="hidden rounded-3xl bg-white p-6 shadow-cardLg ring-1 ring-slate-200 lg:block"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                On this page
              </p>
              {tocList}
            </nav>
          </aside>

          {/* Sections */}
          <div className="min-w-0 space-y-6">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                data-reveal
                className="scroll-mt-24 rounded-3xl bg-white p-6 sm:p-9 shadow-cardLg ring-1 ring-slate-200"
                aria-labelledby={`${s.id}-heading`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-accent to-brand-magenta font-mono text-xs font-bold text-white shadow-glow sm:h-11 sm:w-11 sm:rounded-2xl sm:text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2
                    id={`${s.id}-heading`}
                    className="min-w-0 text-[1.65rem] leading-tight tracking-tight text-slate-900 sm:text-3xl"
                  >
                    {s.title}
                  </h2>
                </div>
                {/* Below the heading the text keeps the full card width on
                    phones and hangs from the heading's edge on wider screens. */}
                <div className="mt-4 h-px bg-gradient-to-r from-brand-accent/40 via-brand-magenta/30 to-transparent sm:ml-[3.75rem]" />
                <div className="mt-3 sm:pl-[3.75rem] sm:text-[1.0625rem]">
                  {s.blocks.map((b, bi) => (
                    <Block key={bi} block={b} />
                  ))}
                </div>
              </section>
            ))}

            {/* Closing note */}
            <section data-reveal className="lx-glass rounded-3xl p-8 text-center sm:p-10">
              <h2 className="text-3xl md:text-4xl">Still have questions?</h2>
              <p className="mx-auto mt-3 max-w-xl text-[color:var(--ink-3)]">
                Our team is happy to clarify anything in this document. Reach out and we’ll respond within one business day.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
                <Link to={contactHref} className="btn lx-btn">
                  <Mail className="h-4 w-4" aria-hidden="true" /> Contact us
                </Link>
                <Link to={cross.to} className="lx-link">
                  {cross.label} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        }}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-[900] grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-accent to-brand-magenta text-white shadow-glow ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50 ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </main>
  );
}
