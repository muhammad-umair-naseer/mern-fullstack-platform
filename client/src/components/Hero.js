import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { liveTools } from '../data/tools';
import './Hero.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Each stat has to survive a visitor clicking through to check it, so every one
// of these points at something already on this site: the SECP incorporation on
// /about, the course catalogue on /courses, the two working tools on /tools.
// A stat with `display` opts out of the count-up below, for values that read as
// a fact rather than a quantity.
//
// The brief's third stat was "3 — Products of our own in use [confirm count]".
// Only Your Bot (/your-bot) exists in this repository, so 3 is a number a
// visitor cannot confirm; it is replaced by the two shipped tools, which anyone
// can open and use. To restore the product stat once the real count is known,
// swap the third entry back to { count: N, suffix: '', label: 'Products of our
// own in use' } — the evidence needed is a live page per product.
const stats = [
  { display: 'Since 2025', label: 'SECP-registered company' },
  { count: 23, suffix: '', label: 'Free courses, open to anyone' },
  { count: liveTools().length, suffix: '', label: 'Free tools that never upload your file' },
];

const Hero = () => {
  const scope = useRef(null);

  useGSAP(
    () => {
      const reveal = gsap.utils.toArray('[data-hero]');
      const counters = gsap.utils.toArray('[data-count]');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Entrance: staggered slide-up choreographed on one timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(reveal, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.05,
        });

        // Count-up the numeric stats, tied to the same timeline. The markup
        // renders the finished number so the prerendered HTML is truthful, so
        // the animation has to wind it back to zero before it can count up.
        counters.forEach((el) => {
          el.textContent = '0' + (el.dataset.suffix || '');
        });
        counters.forEach((el) => {
          const target = +el.dataset.count;
          const suffix = el.dataset.suffix || '';
          const proxy = { v: 0 };
          tl.to(
            proxy,
            {
              v: target,
              duration: 1.1,
              ease: 'power2.out',
              snap: { v: 1 },
              onUpdate: () => {
                el.textContent = proxy.v + suffix;
              },
            },
            '<' // start together with the previous tween
          );
        });

        // Subtle parallax: content drifts up and fades as the hero scrolls away
        gsap.to('.hero-content', {
          y: -60,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Reduced motion — render final values immediately
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(reveal, { opacity: 1, y: 0 });
        counters.forEach((el) => {
          el.textContent = el.dataset.count + (el.dataset.suffix || '');
        });
      });
    },
    { scope }
  );

  return (
    <section className="hero" aria-labelledby="hero-heading" ref={scope}>
      {/* Decorative floating glows for depth */}
      <div className="hero-orbs" aria-hidden="true">
        <span className="hero-orb hero-orb--1" />
        <span className="hero-orb hero-orb--2" />
        <span className="hero-orb hero-orb--3" />
      </div>

      <div className="hero-content">
        <span className="hero-badge" data-hero>
          <span className="hero-badge-dot" />
          Software house in Islamabad
        </span>

        {/* The page's only h1 — the document outline and the aria-labelledby
            above both hang off it, so it stays an h1 whatever the copy says. */}
        <h1 id="hero-heading" data-hero>
          Software built for your business, by{' '}
          <em className="hero-gradient-text">engineers you can reach</em>.
        </h1>

        <p className="hero-subtitle" data-hero>
          Cortexis designs and builds web apps, mobile apps, and AI automation for
          companies in Pakistan and the Gulf. You work directly with the people
          writing your code, from the first call to the hand-over.
        </p>

        <div className="hero-buttons" role="group" aria-label="Primary actions" data-hero>
          <Link to="/contact" className="btn btn-primary cta">Start a project</Link>
          {/* The brief asked for "See our work" pointing at /work. There is no
              /work route and no case studies to put behind one, so this goes to
              /services — the nearest page that actually answers the question —
              and the label was changed to match what the visitor will find. */}
          <Link to="/services" className="btn btn-secondary cta-alt">See what we build</Link>
        </div>

        <div className="hero-coords" data-hero>
          {stats.map((s, i) => (
            <div className="coord" key={i}>
              {/* The true value is what is rendered, not the count-up's
                    starting 0. scripts/prerender.mjs snapshots the real DOM into
                    all 61 static pages, so whatever sits here is what a crawler
                    and any visitor without JS will read — and shipping "0 free
                    courses" would be a false statement of exactly the fact this
                    stat exists to make checkable. The animation resets it to 0
                    itself, below. */}
              {s.display ? (
                <span className="num">{s.display}</span>
              ) : (
                <span className="num" data-count={s.count} data-suffix={s.suffix}>
                  {s.count}{s.suffix}
                </span>
              )}
              <span className="lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#services-heading" className="hero-scroll" aria-label="Scroll to explore" data-hero>
        <span className="hero-scroll-text">Scroll</span>
        <span className="hero-scroll-mouse"><span className="hero-scroll-wheel" /></span>
      </a>
    </section>
  );
};

export default Hero;
