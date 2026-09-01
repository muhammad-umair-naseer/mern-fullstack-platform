import React from 'react';
import './ValueProposition.css';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import { 
  Code2, 
  Bot, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * The four pillars, rewritten to say only what we can point at in this
 * repository. The previous copy sold scale we have never had to handle
 * ("millions of requests", "99.99% uptime", "SOC2/GDPR", "50+ enterprise
 * systems"); none of it survived a check, and every line of it was a promise
 * a first client would hold us to. What follows is deliberately smaller and
 * checkable.
 *
 * The icons, accent colors and glows are untouched: this pass changes words,
 * not the visual system, so the Zap icon stays on the third card even though
 * that card is no longer about speed.
 *
 * Each card's `linkTo` points only at a route that exists in App.js
 * (/services, /services/:slug, /contact).
 */
const pillars = [
  {
    icon: Code2,
    badge: 'Custom Software',
    title: 'Custom software',
    desc: 'Web and mobile applications built around how your business already works, not adapted from a template. We choose proven technology, write code you own, and hand over documentation a future developer can read.',
    highlights: [
      'You own the code and the repository',
      'Written documentation with every hand-over',
      // The brief's stack list read "Laravel, Node.js, React, and Python".
      // Laravel appears in this repo only as a course title — there is no
      // Laravel service, no Laravel dependency, and nothing shipped in it —
      // so naming it here would advertise a capability we cannot show. React,
      // Node and Python are all real (React 19 and Express here; Python
      // Development is a listed service). Add Laravel back the day a Laravel
      // service page or a delivered Laravel project exists.
      'Built on React, Node.js and Python',
    ],
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.15)',
    linkLabel: 'See how we build',
    linkTo: '/services/custom-software-development',
  },
  {
    icon: Bot,
    badge: 'AI & Automation',
    title: 'AI automation',
    desc: "Chatbots, document processing, and workflow automation using large language models, scoped to a job that actually exists: answering customer messages on WhatsApp, pulling data out of invoices, drafting replies. If a spreadsheet would do the same thing for less, we'll say so.",
    highlights: [
      'WhatsApp and web chatbots trained on your own content',
      'Invoice and document data extraction',
      'Automation inside the tools your team already uses',
    ],
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.15)',
    linkLabel: 'See AI services',
    // "AI Automation" slugifies to ai-automation in data/services.js, so this
    // deep link resolves to a real page rather than the services index.
    linkTo: '/services/ai-automation',
  },
  {
    icon: Zap,
    // Was "Delivery in weeks", carrying a two-to-four week first version,
    // weekly demos and fixed-price-for-fixed-scope. No documented process
    // backs any of the three, and each is a schedule or a price a client
    // could hold us to. The card now describes only how work is made visible
    // — which is true of any project the moment it has a repository and a
    // deployed build. Restore the timings if and when we can point at
    // delivered projects that met them.
    badge: 'How We Work',
    title: 'You see it as it is built',
    desc: 'Progress is something you can open and click through, not a status report you have to take our word for. Work goes into a repository you can see from the first commit, changes land in an environment you can try, and we walk you through what has been built before it goes anywhere near your customers.',
    highlights: [
      'A working environment you can open and try',
      'Every change visible in the repository',
      'A walkthrough before anything goes live',
    ],
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.15)',
    linkLabel: 'See our services',
    linkTo: '/services/web-development',
  },
  {
    icon: ShieldCheck,
    badge: 'Security & Support',
    // The brief also offered "a named engineer and a response time in
    // writing". That is an SLA, and we have neither the staffing note nor the
    // support policy to back it, so it is gone. The rest of the card is
    // ordinary engineering practice we do carry out.
    title: 'Security and support',
    desc: 'We follow OWASP guidelines, encrypt data in transit and at rest, keep dependencies patched, and test that backups actually restore instead of just scheduling them.',
    highlights: [
      'OWASP-based secure defaults',
      'Backups that are tested, not just scheduled',
      // Says what a reply contains rather than when it arrives — no support
      // hours or response window is documented anywhere yet.
      'Every support request answered with a fix or a plan',
    ],
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.15)',
    linkLabel: 'Talk to us',
    linkTo: '/contact',
  },
];

export default function ValueProposition() {
  const scope = useRevealOnScroll();

  return (
    <section className="value-prop-section" ref={scope} aria-labelledby="value-prop-heading">
      <div className="container">
        <SectionHeading
          id="value-prop-heading"
          eyebrow="Why Cortexis"
          title="Small team. Senior work. Direct access."
          subtitle="You talk to the engineers who write your code. No account managers, no hand-offs between departments, and no surprises when the invoice arrives."
        />

        <div className="value-grid">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx} 
                className="value-card" 
                data-reveal
                style={{ '--accent-color': p.color, '--accent-glow': p.glow }}
              >
                <div className="value-card-top">
                  <div className="value-icon-box">
                    <Icon className="value-icon" size={26} />
                  </div>
                  <span className="value-badge">{p.badge}</span>
                </div>

                <h3 className="value-title">{p.title}</h3>
                <p className="value-desc">{p.desc}</p>

                <div className="value-highlights">
                  {p.highlights.map((h, i) => (
                    <span key={i} className="highlight-tag">
                      <span className="tag-dot" /> {h}
                    </span>
                  ))}
                </div>

                <div className="value-card-footer">
                  {/* Per-card destination now, because a card about AI should
                      land on the AI service and a card about support should
                      land on contact. */}
                  <Link to={p.linkTo} className="value-link">
                    {p.linkLabel} <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/*
          The metrics banner (.impact-metrics-banner) was removed rather than
          rewritten. It read: "99.99% — Uptime & System Reliability",
          "50+ — Enterprise Systems Deployed", "10x — Operational Efficiency
          with AI", "24/7 — Direct Engineering Support". Not one of the four
          figures could be traced to anything: there is no uptime monitoring,
          no deployment log, no efficiency measurement and no on-call rota in
          this codebase or anywhere else we were pointed at. A number on a
          homepage is the easiest claim in the world for a client to check and
          the most expensive one to get wrong, and the brief itself said to cut
          the row unless every figure is true.

          To bring it back, replace it with figures we can already count —
          23 free courses, 12 services, 12 blog posts, tools actually built —
          or restore the originals once uptime and delivery are genuinely
          measured and written down. The CSS for the banner is left in
          ValueProposition.css untouched so restoring it is markup only.
        */}
      </div>
    </section>
  );
}