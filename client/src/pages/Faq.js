import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FAQS, FAQ_PAGES, faqsFor } from '../data/faqs';
import FaqSection from '../components/FaqSection';
import PageHero from '../components/PageHero';
import PhotoVisual from '../components/PhotoVisual';
import { faqPhoto } from '../assets/unique';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import Seo from '../seo/Seo';
import { breadcrumbs, faq as faqSchema } from '../seo/schema';

// Where each topic's own page is, said the way a person would.
const ONWARD = {
  '/courses': 'Browse the courses',
  '/internships': 'See the internships',
  '/tools': 'Open the free tools',
  '/services': 'See what we build',
  '/your-bot': 'See Your Bot',
};

const idOf = (path) => `faq-${path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`;

const TOPICS = FAQ_PAGES.filter((p) => faqsFor(p.path).length).map((p, i) => ({
  ...p,
  id: idOf(p.path),
  n: String(i + 1).padStart(2, '0'),
  count: faqsFor(p.path).length,
}));

const Faq = () => {
  const scope = useRevealOnScroll();
  const [active, setActive] = useState(TOPICS[0]?.id);

  // The index follows the reader: the topic whose questions fill the middle
  // of the screen is the one marked.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    TOPICS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="text-ink-2 min-h-screen">
      <Seo
        title="Questions about our courses, internships, tools and work"
        description="Straight answers on what the courses cost, whether the internships are paid, where your files go, what a project costs, and whether WhatsApp will ban your number."
        path="/faq"
        schema={[
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]),
          faqSchema(FAQS.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />

      <PageHero
        label="FAQ"
        lines={['Asked,', <em>answered plainly.</em>]}
        lede="Where the honest answer is no, it says no."
        actions={[{ href: `#${TOPICS[0]?.id}`, label: 'Read the answers', primary: true }, { to: '/contact', label: 'Ask us directly' }]}
        visual={
          <PhotoVisual
            photo={faqPhoto}
            chips={[
              { value: FAQS.length, label: 'questions answered' },
              { value: TOPICS.length, label: 'topics' },
            ]}
          />
        }
      />

      <div ref={scope} className="lx-wrap faq-layout">
        <nav className="faq-index" aria-label="Topics">
          <ol>
            {TOPICS.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={active === t.id ? 'is-active' : undefined} aria-current={active === t.id ? 'true' : undefined}>
                  <span className="faq-index-n">{t.n}</span>
                  <span className="faq-index-label">{t.label}</span>
                  <span className="faq-index-count">{t.count}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="faq-groups">
          {TOPICS.map((t) => (
            <div key={t.id} id={t.id} className="faq-group" data-reveal>
              <span className="faq-group-n" aria-hidden="true">{t.n}</span>
              <FaqSection page={t.path} title={t.label} className="cx-faq--inset">
                <Link to={t.path} className="lx-link cx-faq-more">
                  {ONWARD[t.path] || 'Read more'} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </FaqSection>
            </div>
          ))}

          <section className="faq-ask lx-glass" aria-labelledby="faq-ask-h" data-reveal>
            <h2 id="faq-ask-h" className="faq-ask-title">
              Still <em>wondering?</em>
            </h2>
            <p className="faq-ask-lede">A real person reads every message.</p>
            <Link to="/contact" className="btn lx-btn">
              Ask us directly
              <span className="lx-btn-disc" aria-hidden="true">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Faq;
