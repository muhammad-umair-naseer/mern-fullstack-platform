import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BadgeCheck, CalendarCheck, KeyRound, ShoppingBag, Sparkles, UserRoundCheck } from 'lucide-react';
import './YourBot.css';
import Seo from '../seo/Seo';
import { organization, breadcrumbs, faq as faqSchema } from '../seo/schema';
import FaqSection from '../components/FaqSection';
import PageHero from '../components/PageHero';
import YourBotVisual from '../components/heroes/YourBotVisual';
import { faqsFor } from '../data/faqs';
import { YOURBOT_URL } from '../config';

// The three jobs the hero's conversations play out, each with the reply
// that closes it there.
const JOBS = [
  { icon: CalendarCheck, time: '10:42 am', title: 'Books the visit', ask: 'Can I book a visit on Saturday?', reply: 'Booked: Saturday at 4:00.' },
  { icon: UserRoundCheck, time: '4:05 pm', title: 'Hands you the lead', ask: 'Do you deliver to Rawalpindi?', reply: 'Someone from our team will call you.' },
  { icon: ShoppingBag, time: '2:14 am', title: 'Takes the order', ask: 'Are you open right now?', reply: 'I can take your order now.' },
];

// What the questions below establish, as three short facts.
const FACTS = [
  { icon: BadgeCheck, text: 'Official Meta platform' },
  { icon: KeyRound, text: 'Built for you, no monthly fee' },
  { icon: Sparkles, text: 'Instagram in development' },
];

/**
 * The three jobs as small conversations. The bubbles come in, typing dots
 * first, once the row is in view. The start state is only applied once the
 * script has run, so the prerendered page and reduced motion show every
 * reply in place.
 */
function Jobs() {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;
    setArmed(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -18% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const state = armed ? (inView ? ' is-in' : ' is-armed') : '';

  return (
    <section className={`yb-jobs${state}`} ref={ref} aria-labelledby="yb-jobs-title">
      <div className="lx-wrap">
        <header className="yb-jobs-head">
          <span className="lx-label">What it does</span>
          <h2 id="yb-jobs-title" className="yb-jobs-title">Working <em>while you sleep.</em></h2>
        </header>
        <ol className="yb-jobs-list">
          {JOBS.map((j, i) => (
            <li key={j.title} className="yb-job" style={{ '--i': i }}>
              <div className="yb-job-top">
                <span className="yb-job-icon" aria-hidden="true"><j.icon size={20} strokeWidth={1.6} /></span>
                <span className="yb-job-time">{j.time}</span>
              </div>
              <h3 className="yb-job-title">{j.title}</h3>
              <div className="yb-job-chat" aria-hidden="true">
                <p className="yb-bubble yb-bubble--in">{j.ask}</p>
                <span className="yb-dots"><i /><i /><i /></span>
                <p className="yb-bubble yb-bubble--out">{j.reply}</p>
              </div>
            </li>
          ))}
        </ol>
        <ul className="yb-facts">
          {FACTS.map((f) => (
            <li key={f.text}>
              <f.icon size={15} strokeWidth={1.75} aria-hidden="true" /> {f.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function YourBot() {
  // The page also answers at /whatsapp-bot, the address Meta app review was
  // first given; its policy links stay under whichever address was opened.
  const { pathname } = useLocation();
  const base = pathname.startsWith('/whatsapp-bot') ? '/whatsapp-bot' : '/your-bot';

  return (
    <main className="yb min-h-[calc(100vh-76px)]">
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
          ]),
          faqSchema(faqsFor('/your-bot').map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />

      <PageHero
        id="wa-heading"
        label="Your Bot"
        lines={['Every message,', <em key="em">answered.</em>]}
        lede="A WhatsApp assistant that qualifies leads and books meetings, day and night."
        actions={[
          { href: YOURBOT_URL, label: 'Get early access', primary: true, external: true },
          { to: `${base}/privacy`, label: 'Data privacy' },
        ]}
        visual={<YourBotVisual />}
      />

      <Jobs />

      <FaqSection page="/your-bot" title="Questions people ask before starting" />

      <nav className="yb-legal" aria-label="Your Bot policies">
        <div className="lx-wrap">
          <div className="yb-legal-row">
            <span className="lx-label">Policies</span>
            <ul>
              <li>
                <Link className="lx-link" to={`${base}/privacy`}>Privacy policy</Link>
              </li>
              <li>
                <Link className="lx-link" to={`${base}/terms`}>Terms of service</Link>
              </li>
              <li>
                <Link className="lx-link" to={`${base}/data-deletion`}>Data deletion</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </main>
  );
}
