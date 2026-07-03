import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { count: 50, suffix: '+', label: 'Projects Shipped' },
  { count: 12, suffix: '+', label: 'Tech Stacks' },
  { display: '24/7', label: 'Support' },
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

        // Count-up the numeric stats, tied to the same timeline
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
          Software&nbsp;·&nbsp;Training&nbsp;·&nbsp;Consulting
        </span>

        <h1 id="hero-heading" data-hero>
          Engineering <em className="hero-gradient-text">Intelligent</em> Digital Solutions
        </h1>

        <p className="hero-subtitle" data-hero>
          We build software, train talent, and deliver consulting that helps teams
          ship faster and grow with confidence.
        </p>

        <div className="hero-buttons" role="group" aria-label="Primary actions" data-hero>
          <Link to="/services" className="btn btn-primary cta">Explore Services</Link>
          <Link to="/contact" className="btn btn-secondary cta-alt">Talk to an Expert</Link>
        </div>

        <div className="hero-coords" data-hero>
          {stats.map((s, i) => (
            <div className="coord" key={i}>
              {s.display ? (
                <span className="num">{s.display}</span>
              ) : (
                <span className="num" data-count={s.count} data-suffix={s.suffix}>
                  0{s.suffix}
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
