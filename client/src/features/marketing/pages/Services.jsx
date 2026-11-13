import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Eye, GraduationCap, Search, Users, Wrench, X } from "lucide-react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCatalogueFilter } from "../../../hooks/useCatalogueFilter.jsx";
import { useModalIntro } from '../../../hooks/useModalIntro.jsx';
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll.jsx';
import { SERVICES, SERVICE_COUNT_WORD } from '../../../data/services.js';
import { serviceImage, serviceSrcSet } from '../../../data/serviceImages.js';
import { COURSE_COUNT } from '../../../data/catalogue.js';
import Seo from '../../../seo/Seo.jsx';
import { organization, breadcrumbs, faq as faqSchema } from '../../../seo/schema.js';
import FaqSection from '../../../components/FaqSection.jsx';
import PageHero from '../../../components/PageHero.jsx';
import ServicesVisual from '../../../components/heroes/ServicesVisual.jsx';
import { faqsFor } from '../../../data/faqs.js';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categories = ["All", "Development", "Design", "Marketing", "AI/ML"];

// The headline counts the services, so it stays true when one is added.
const serviceCount = SERVICE_COUNT_WORD;
const pad = (n) => String(n).padStart(2, '0');

// Where else a visitor can start. Services linked nowhere except contact,
// which wastes the page: a visitor deciding whether to hire us is also the
// person who might take a course or send an intern.
const FREE_ROUTES = [
  { to: '/courses', icon: GraduationCap, title: 'Courses', meta: `${COURSE_COUNT} courses, with certificates` },
  { to: '/internships', icon: Users, title: 'Internships', meta: 'Mentored real projects, no fee' },
  { to: '/tools', icon: Wrench, title: 'Tools', meta: 'Converters and generators, no sign up' },
];

/**
 * The catalogue reveals as it scrolls into view: each card's photograph opens
 * upward while the picture settles, and the card rises under it. A filter
 * change re-runs it, so the cards still in view come in straight away.
 */
function useCatalogueReveal(deps) {
  const scope = useRef(null);
  useGSAP(
    () => {
      const cards = gsap.utils.toArray('[data-card]', scope.current);
      if (!cards.length) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(cards, { opacity: 0, y: 28 });
        cards.forEach((c) => {
          const frame = c.querySelector('.svc-card-frame');
          const img = frame && frame.querySelector('img');
          if (frame) gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
          if (img) gsap.set(img, { scale: 1.14 });
        });
        ScrollTrigger.batch(cards, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true, clearProps: 'opacity,transform' });
            batch.forEach((c, i) => {
              const frame = c.querySelector('.svc-card-frame');
              const img = frame && frame.querySelector('img');
              if (frame) gsap.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', delay: i * 0.09, clearProps: 'clipPath' });
              if (img) gsap.to(img, { scale: 1, duration: 1.5, ease: 'expo.out', delay: i * 0.09, clearProps: 'transform' });
            });
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: deps, scope, revertOnUpdate: true }
  );
  return scope;
}

export default function Services() {
  const [active, setActive] = useState(null);
  const [show, setShow] = useState(false);
  const closeBtnRef = useRef(null);
  const openerRef = useRef(null);

  const services = SERVICES.map((s, i) => ({ ...s, n: i + 1, image: serviceImage(s.slug), srcSet: serviceSrcSet(s.slug) }));

  const panelRef = useModalIntro(show);
  const altRef = useRevealOnScroll();

  const { q, setQ, cat, setCat, filtered } = useCatalogueFilter(
    services,
    (s) => [s.title, s.description, s.category]
  );

  const gridRef = useCatalogueReveal([filtered]);

  const handleClose = () => {
    setShow(false);
    setActive(null);
    document.body.style.overflow = "";
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && show && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  const handleOpen = (service, e) => {
    openerRef.current = e?.currentTarget || null;
    setActive(service);
    setShow(true);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtnRef.current?.focus());
  };

  return (
    <main className="min-h-screen text-ink">
      <Seo
        title="Software Development and Consulting Services"
        description="Web and mobile development, AI and automation, cloud and DevOps, UI/UX design and technical training, delivered by our Pakistan engineering team."
        path="/services"
        schema={[
          organization(),
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]),
          faqSchema(faqsFor('/services').map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      <PageHero
        label="Services"
        lines={[`${serviceCount} services,`, <em key="em">one studio.</em>]}
        lede={'Strategy, design, development and cloud, end to end.'}
        actions={[
          { href: '#services', label: 'View services', primary: true },
          { to: '/contact', label: 'Talk to an advisor' },
        ]}
        visual={<ServicesVisual services={SERVICES} />}
      />

      {/* ── The catalogue ───────────────────────────────────────────── */}
      <section id="services" className="svc-cat" aria-label="All services">
        <div className="lx-wrap">
          <div className="svc-bar">
            <label className="svc-search">
              <Search size={17} strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Search services</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search, e.g. React, SEO"
              />
              {q && (
                <button type="button" className="svc-clear" onClick={() => setQ('')} aria-label="Clear search">
                  <X size={14} strokeWidth={2} aria-hidden="true" />
                </button>
              )}
            </label>
            <div className="svc-chips" role="group" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`svc-chip${cat === c ? ' is-on' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="svc-count" aria-live="polite">
              <span className="tabular">{pad(filtered.length)}</span> / {pad(services.length)}
            </span>
          </div>

          <div ref={gridRef}>
            {filtered.length === 0 ? (
              <p className="svc-empty">
                Nothing matches. <button type="button" className="lx-link" onClick={() => { setQ(''); setCat('All'); }}>Show all services</button>
              </p>
            ) : (
              <ul className="svc-grid">
                {filtered.map((service) => (
                  <li key={service.slug} data-card className="svc-card">
                    {/* A real link, not only a modal trigger: each service has
                        a URL, so a crawler can reach it and a person can send
                        it to someone. alt is empty because the link is named
                        by its title. */}
                    <Link to={`/services/${service.slug}`} className="svc-card-link">
                      <div className="svc-card-frame">
                        <img src={service.image} srcSet={service.srcSet} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 34vw" alt="" loading="lazy" decoding="async" width="1200" height="630" />
                        <span className="svc-card-cat">{service.category}</span>
                      </div>
                      <div className="svc-card-body">
                        <span className="svc-card-num" aria-hidden="true">{pad(service.n)}</span>
                        <h3 className="svc-card-title">{service.title}</h3>
                        <span className="svc-card-cta" aria-hidden="true"><ArrowUpRight size={18} /></span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleOpen(service, e)}
                      className="svc-card-peek"
                      aria-label={`Quick look: ${service.title}`}
                    >
                      <Eye size={17} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ── Free ways in ─────────────────────────────────────────────── */}
      <section ref={altRef} className="svc-alt" aria-labelledby="svc-alt-title">
        <div className="lx-wrap">
          <div className="svc-alt-panel">
            <div className="svc-alt-head" data-reveal>
              <span className="lx-label">Not ready to hire?</span>
              <h2 id="svc-alt-title" className="svc-alt-title">Start <em>for free.</em></h2>
            </div>
            <ul className="svc-alt-list">
              {FREE_ROUTES.map((r) => (
                <li key={r.to} data-reveal>
                  <Link to={r.to} className="svc-alt-row">
                    <span className="svc-alt-icon" aria-hidden="true"><r.icon size={20} strokeWidth={1.6} /></span>
                    <span className="svc-alt-name">Free {r.title.toLowerCase()}</span>
                    <span className="svc-alt-meta">{r.meta}</span>
                    <span className="svc-alt-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Quick look ───────────────────────────────────────────────── */}
      {show && active && (
        <div
          className="svc-modal"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-title"
          aria-describedby="service-desc"
        >
          <div ref={panelRef} className="svc-modal-panel">
            <div className="svc-modal-frame">
              <img src={active.image} alt="" />
              <span className="svc-card-cat">{active.category}</span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleClose}
                className="svc-modal-close"
                aria-label="Close service details"
              >
                <X size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <div className="svc-modal-body">
              <h3 id="service-title" className="svc-modal-title">{active.title}</h3>
              <p id="service-desc" className="svc-modal-desc">{active.description}</p>

              <div className="svc-modal-cols">
                <div>
                  <h4 className="svc-modal-h">Covers</h4>
                  <ul className="svc-modal-list">
                    {active.features?.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="svc-modal-h">You get</h4>
                  <ul className="svc-modal-list">
                    {active.deliverables?.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </div>
              </div>

              <div className="svc-modal-actions">
                <Link to={`/services/${active.slug}`} className="btn lx-btn">
                  Full details <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={14} /></span>
                </Link>
                <Link to="/contact" className="lx-link">Discuss this service</Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <FaqSection page="/services" title="Questions before you hire us" />
    </main>
  );
}
