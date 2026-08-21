import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareText, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import './WhatsAppBot.css';

const chips = [
  { icon: MessageSquareText, label: 'AI replies' },
  { icon: Clock, label: 'Always on · 24/7' },
  { icon: Sparkles, label: 'Your brand voice' },
];

export default function WhatsAppBot() {
  const ref = useIntroTimeline('[data-intro]', { y: 26, stagger: 0.1 });

  return (
    <main className="relative overflow-hidden text-slate-900">
      {/* Floating glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-brand-accent/25 blur-3xl animate-blob-slow" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -right-16 h-96 w-96 rounded-full bg-brand-magenta/20 blur-3xl animate-blob" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <section
        ref={ref}
        className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24"
        aria-labelledby="wa-heading"
      >
        {/* ── Copy ─────────────────────────────────────────────────────── */}
        <div>
          <span
            data-intro
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] wa-pulse" />
            Coming soon
          </span>

          <h1
            id="wa-heading"
            data-intro
            className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-6xl"
          >
            Cortexis{' '}
            <span className="bg-gradient-to-r from-brand-accent via-brand-magenta to-brand-orange-500 bg-clip-text text-transparent">
              WhatsApp Bot
            </span>
          </h1>
          <p data-intro className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
            by Cortexis Solution Hub Pvt Ltd
          </p>

          <p data-intro className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            An AI assistant that replies for your business on WhatsApp, instantly and around the clock,
            in your brand’s voice. <span className="text-white">Something big is coming.</span>
          </p>

          <div data-intro className="mt-7 flex flex-wrap gap-2.5">
            {chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10 backdrop-blur"
              >
                <c.icon className="h-4 w-4 text-brand-accent-soft" />
                {c.label}
              </span>
            ))}
          </div>

          <div data-intro className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-accent to-brand-magenta px-7 py-3 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50"
            >
              Get early access <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/whatsapp-bot/privacy"
              className="inline-flex items-center gap-2 rounded-full bg-transparent px-6 py-3 font-semibold text-white ring-2 ring-white/25 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/40"
            >
              <ShieldCheck className="h-4 w-4" /> How your data is handled
            </Link>
          </div>

          
        </div>

        {/* ── Chat mockup ──────────────────────────────────────────────── */}
        <div data-intro className="wa-stage">
          <div className="wa-mock" role="img" aria-label="Preview of a WhatsApp conversation answered automatically by the Cortexis assistant">
            <div className="wa-mock-header">
              <span className="wa-avatar" aria-hidden="true">🤖</span>
              <div className="wa-meta">
                <p className="wa-name">Your Business Assistant</p>
                <p className="wa-status"><span className="wa-online-dot" /> online</p>
              </div>
              <span className="wa-badge">WhatsApp</span>
            </div>
            <div className="wa-body">
              <div className="wa-bubble wa-in">Hi! Do you deliver on weekends? 📦</div>
              <div className="wa-bubble wa-out">Yes, we deliver 7 days a week, 9am–9pm. Want me to start your order? 🚀</div>
              <div className="wa-bubble wa-in">What are your prices?</div>
              <div className="wa-bubble wa-typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
