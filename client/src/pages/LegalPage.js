import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ShieldCheck, FileText, Mail, ArrowRight } from 'lucide-react';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import Seo from '../seo/Seo';
import { breadcrumbs } from '../seo/schema';

const NAV_OFFSET = 96; // clears the 72px sticky navbar + breathing room

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
            <span>
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

export default function LegalPage({ seo, kind = 'terms', title, subtitle, lastUpdated, sections, contactHref = '/contact', crossLink }) {
  const cross = crossLink || {
    to: kind === 'privacy' ? '/terms' : '/privacy',
    label: kind === 'privacy' ? 'Terms & Conditions' : 'Privacy Policy',
  };
  const heroRef = useIntroTimeline();
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

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    setActiveId(id);
  }, []);

  const HeroIcon = kind === 'privacy' ? ShieldCheck : FileText;

  return (
    <main className="relative text-slate-900">
      {seo && (
        <Seo
          title={seo.title}
          description={seo.description}
          path={seo.path}
          schema={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: seo.title, path: seo.path },
          ])}
        />
      )}
      {/* Reading-progress bar, sits above the navbar */}
      <div className="fixed inset-x-0 top-0 z-[1000] h-[3px] bg-transparent" aria-hidden="true">
        <div
          className="h-full origin-left bg-grad-brand shadow-[0_0_16px_rgba(224,86,229,0.6)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 py-24 md:py-28 text-white"
        aria-labelledby="legal-hero-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand-accent/30 blur-3xl animate-blob-slow"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-magenta/25 blur-3xl animate-blob"
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span
            data-intro
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur"
          >
            <HeroIcon className="h-4 w-4" />
            Legal Center
          </span>
          <h1
            id="legal-hero-heading"
            data-intro
            className="mt-6 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight"
          >
            {title.map((word, i) =>
              word.grad ? (
                <span key={i} className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ff6b00] bg-clip-text text-transparent font-black">
                  {word.text}
                </span>
              ) : (
                <React.Fragment key={i}>{word.text}</React.Fragment>
              )
            )}
          </h1>
          <p data-intro className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100/90">
            {subtitle}
          </p>
          <div data-intro className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white ring-1 ring-white/25 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              Last updated {lastUpdated}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white ring-1 ring-white/25 backdrop-blur">
              {sections.length} sections
            </span>
          </div>
        </div>
      </section>

      {/* ── Body: sticky TOC + sections ──────────────────────────────── */}
      <div ref={bodyRef} className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[290px_1fr]">
          {/* Table of contents */}
          <aside className="lg:sticky lg:top-24 lg:self-start" data-reveal>
            <nav
              aria-label="On this page"
              className="rounded-3xl bg-white p-6 shadow-cardLg ring-1 ring-slate-200"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                On this page
              </p>
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
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[11px] font-bold transition ${
                            active
                              ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`leading-snug ${
                            active
                              ? 'font-bold text-orange-600'
                              : 'text-slate-700 group-hover:text-slate-900'
                          }`}
                        >
                          {s.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          {/* Sections */}
          <div className="min-w-0 space-y-6">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                data-reveal
                className="scroll-mt-24 rounded-3xl bg-white p-7 sm:p-9 shadow-cardLg ring-1 ring-slate-200"
                aria-labelledby={`${s.id}-heading`}
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-accent to-brand-magenta font-mono text-sm font-bold text-white shadow-glow">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2
                      id={`${s.id}-heading`}
                      className="text-2xl font-bold tracking-tight text-slate-900"
                    >
                      {s.title}
                    </h2>
                    <div className="mt-1 h-px w-full bg-gradient-to-r from-brand-accent/40 via-brand-magenta/30 to-transparent" />
                    <div className="mt-3">
                      {s.blocks.map((b, bi) => (
                        <Block key={bi} block={b} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            {/* Closing CTA */}
            <section
              data-reveal
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 p-8 sm:p-10 text-center text-white"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-magenta/25 blur-3xl"
              />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold">Still have questions?</h2>
                <p className="mx-auto mt-2 max-w-xl text-indigo-100/90">
                  Our team is happy to clarify anything in this document. Reach out and we’ll respond within one business day.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to={contactHref}
                    className="btn-cta-white inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                  >
                    <Mail className="h-4 w-4" /> Contact us
                  </Link>
                  <Link
                    to={cross.to}
                    className="inline-flex items-center gap-2 rounded-full bg-transparent px-6 py-3 font-semibold text-white ring-2 ring-white/60 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                  >
                    {cross.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
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
