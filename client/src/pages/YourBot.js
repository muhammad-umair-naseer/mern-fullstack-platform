import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareText, Clock, Sparkles, ArrowRight, ShieldCheck, Zap, Bot } from 'lucide-react';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import './YourBot.css';
import Seo from '../seo/Seo';
import { organization, breadcrumbs, faq as faqSchema } from '../seo/schema';
import FaqSection from '../components/FaqSection';
import { faqsFor } from '../data/faqs';

const chips = [
  { icon: Bot, label: 'AI Workflow Automation' },
  { icon: MessageSquareText, label: 'Smart WhatsApp & Instagram Replies' },
  { icon: Clock, label: '24/7 Uninterrupted Operations' },
  { icon: Sparkles, label: 'Custom Brand Voice' },
];

export default function YourBot() {
  const ref = useIntroTimeline('[data-intro]', { y: 26, stagger: 0.1 });

  return (
    <main className="relative overflow-hidden bg-white text-slate-900 min-h-[calc(100vh-76px)]">
      <Seo
        title="WhatsApp and Instagram Automation for Business"
        description="Automate lead qualification, client onboarding and support across WhatsApp and Instagram. A custom AI assistant that answers instantly, books meetings, and hands real buyers to your team."
        path="/your-bot"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'WhatsApp and Instagram Automation',
            serviceType: 'Business process automation',
            provider: { '@id': 'https://cortexissolutionhub.com/#organization' },
            areaServed: 'PK',
            description:
              'Custom AI assistants for WhatsApp and Instagram that qualify leads, onboard clients and answer support questions automatically.',
          },
          organization(),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Automation Tools', path: '/your-bot' },
          ]),,
          faqSchema(faqsFor('/your-bot').map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      {/* Floating glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl animate-blob-slow" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -right-16 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-blob" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />

      <section
        ref={ref}
        className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24"
        aria-labelledby="wa-heading"
      >
        {/* ── Copy ─────────────────────────────────────────────────────── */}
        <div>
          <span
            data-intro
            className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold text-orange-800 ring-1 ring-orange-300"
          >
            <Zap className="h-4 w-4 text-orange-600" />
            AI &amp; Automation Platform
          </span>

          <h1
            id="wa-heading"
            data-intro
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-black md:text-5xl lg:text-6xl"
          >
            Cortexis{' '}
            <span className="bg-gradient-to-r from-[#ff6b00] via-[#f97316] to-[#ea580c] bg-clip-text text-transparent font-black">
              Your Bot
            </span>
          </h1>
          <p data-intro className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-orange-700 font-bold">
            by Cortexis Solution Hub Pvt Ltd
          </p>

          <p data-intro className="mt-6 max-w-xl text-lg leading-relaxed text-black font-medium">
            Supercharge your business with intelligent AI automation, smart WhatsApp &amp; Instagram customer agents, and automated workflows that run 24/7. <span className="font-bold text-orange-600">Save hundreds of hours every month.</span>
          </p>

          <div data-intro className="mt-7 flex flex-wrap gap-2.5">
            {chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-black font-bold border border-slate-200 shadow-sm"
              >
                <c.icon className="h-4 w-4 text-orange-600" />
                {c.label}
              </span>
            ))}
          </div>

          <div data-intro className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Get early access <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/your-bot/privacy"
              className="btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold"
            >
              <ShieldCheck className="h-4 w-4" /> Data privacy &amp; security
            </Link>
          </div>
        </div>

        {/* ── Chat mockup ──────────────────────────────────────────────── */}
        <div data-intro className="wa-stage">
          <div className="wa-mock shadow-2xl border border-slate-200" role="img" aria-label="Preview of a customer conversation answered automatically by the Cortexis assistant across WhatsApp and Instagram">
            <div className="wa-mock-header">
              <span className="wa-avatar" aria-hidden="true">🤖</span>
              <div className="wa-meta">
                <p className="wa-name">Cortexis AI Assistant</p>
                <p className="wa-status"><span className="wa-online-dot" /> online</p>
              </div>
              <span className="wa-badges">
                <span className="wa-badge wa-badge-whatsapp">WhatsApp</span>
                <span className="wa-badge wa-badge-instagram">Instagram</span>
              </span>
            </div>
            <div className="wa-body">
              <div className="wa-bubble wa-in">Hi! Can you automate our lead qualification and client onboarding? 🚀</div>
              <div className="wa-bubble wa-out">Absolutely! Cortexis Automation Tools connect your CRM, WhatsApp &amp; database to process leads instantly 24/7. Want to schedule a demo? ⚡</div>
              <div className="wa-bubble wa-in">Yes please, what are the plans?</div>
              <div className="wa-bubble wa-typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        </div>
      </section>
    <FaqSection page="/your-bot" title="Questions people ask before starting" />
    </main>
  );
}
