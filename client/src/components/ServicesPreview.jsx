import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { photos } from '../assets/lux';
import { SERVICE_COUNT_WORD } from '../data/services.js';
import './ServicesPreview.css';

/**
 * Home-page teaser for the services.
 *
 * Deliberately not a map over data/services.js: this section groups the
 * catalogue into the three things a visitor actually arrives looking for
 * ("web and mobile" spans two services, "SaaS and e-commerce" spans two more),
 * so the copy here is editorial rather than a slice of the data file. Each card
 * still lands on a real /services/<slug> page, and those slugs are the ones
 * slugify() produces in data/services.js — keep them in sync if a title there
 * ever changes.
 *
 * Laid out as three tall plates with the middle one dropped a step, so the row
 * reads as a spread rather than a grid of equal cards.
 */
const services = [
  {
    title: 'Web and mobile apps',
    description: 'Portals, dashboards and booking systems.',
    photo: photos.serviceWeb,
    to: '/services/web-development',
  },
  {
    title: 'AI automation',
    description: 'WhatsApp bots, document extraction, LLM workflows.',
    photo: photos.serviceAi,
    to: '/services/ai-automation',
  },
  {
    // The hyphen is held together so the title never breaks as "e-" / "commerce".
    title: <>SaaS and <span className="lx-nowrap">e-commerce</span></>,
    description: 'Multi-tenant platforms, billing and storefronts.',
    photo: photos.serviceSaas,
    to: '/services/saas-platform-development',
  },
];

const ServicesPreview = () => {
  const scope = useRevealOnScroll();

  return (
    <section className="lx-services" aria-labelledby="services-heading" ref={scope}>
      <div className="lx-wrap">
        {/*
          The brief's subtitle read "Every project gets a senior engineer, a
          written scope, and a weekly demo." The weekly demo and the seniority
          of the assigned engineer are promises about how we staff and run a
          project, and nothing in the repo or the company's own material backs
          either one, so both are dropped. What survives is what we hand over,
          which the per-service deliverables in data/services.js do evidence:
          source code, documentation and a written spec.
        */}
        <header className="lx-section-head">
          <span className="lx-label" data-reveal><span className="lx-label-num">01</span>What we build</span>
          <h2 id="services-heading" className="lx-h2" data-reveal>
            Built for you, <em>handed over whole.</em>
          </h2>
          <div className="lx-section-aside" data-reveal>
            <p>Delivered with the source code and the documentation.</p>
            <Link to="/services" className="lx-link">
              All {SERVICE_COUNT_WORD.toLowerCase()} services <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <ul className="lx-plates">
          {services.map((s, i) => (
            <li key={s.to} className="lx-plate" data-reveal>
              <Link to={s.to} className="lx-plate-link">
                <div className="lx-frame lx-plate-frame" data-reveal-media>
                  {/* The picture sits in a slightly taller layer that drifts
                      against the scroll, so each plate moves at its own depth.
                      alt is empty on purpose: the link is named by its title,
                      so alt text here would make a screen reader announce the
                      card twice. */}
                  <div className="lx-plate-drift" data-parallax="5">
                    <img src={s.photo.src} srcSet={s.photo.srcSet} sizes="(max-width: 760px) 100vw, 34vw" alt="" loading="lazy" decoding="async" width="900" height="1125" />
                  </div>
                </div>
                <div className="lx-plate-body">
                  <span className="lx-plate-num" aria-hidden="true">0{i + 1}</span>
                  <h3 className="lx-plate-title">{s.title}</h3>
                  <p className="lx-plate-text">{s.description}</p>
                  <span className="lx-plate-cta" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ServicesPreview;
