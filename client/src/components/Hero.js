import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { liveTools } from '../data/tools';
import { ArrowRight, Sparkles, Award, GraduationCap, Wrench, CheckCircle2, ShieldCheck, Zap, Code2 } from 'lucide-react';
import './Hero.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Each stat has to survive a visitor clicking through to check it, so every one
// of these points at something already on this site: the SECP incorporation on
// /about, the course catalogue on /courses, the live tools on /tools.
const stats = [
  { 
    display: 'Since 2025', 
    label: 'Engineering Excellence', 
    icon: Award,
    badge: 'Standard',
  },
  { 
    count: 23, 
    suffix: '', 
    label: 'Free courses, open to anyone', 
    icon: GraduationCap,
    badge: '1,100+ Lessons',
  },
  { 
    count: liveTools().length, 
    suffix: '', 
    label: 'Free developer & document tools', 
    icon: Wrench,
    badge: '100% Free',
  },
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
          stagger: 0.1,
          delay: 0.05,
        });

        // Count-up the numeric stats, tied to the same timeline. The markup
        // renders the finished number so the prerendered HTML is truthful.
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
            '<'
          );
        });

        // Subtle parallax: content drifts up and fades as the hero scrolls away
        gsap.to('.hero-content', {
          y: -50,
          opacity: 0.4,
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
      {/* Decorative ambient glowing auras */}
      <div className="hero-orbs" aria-hidden="true">
        <span className="hero-orb hero-orb--1" />
        <span className="hero-orb hero-orb--2" />
        <span className="hero-orb hero-orb--3" />
        <div className="hero-grid-pattern" />
      </div>

      {/* Floating interactive tech badges */}
      <div className="hero-floating-badges" aria-hidden="true">
        <div className="hero-float-tag hero-float-tag--left" data-hero>
          <Code2 className="w-3.5 h-3.5 text-orange-500" />
          <span>Full-Stack &amp; AI Systems</span>
        </div>
        <div className="hero-float-tag hero-float-tag--right" data-hero>
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>High-Velocity Delivery</span>
        </div>
      </div>

      <div className="hero-content">
        {/* Top Eyebrow Badge */}
        <div className="hero-badge-container" data-hero>
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">Enterprise Software &amp; AI Solutions</span>
          </span>
        </div>

        {/* The page's main h1 */}
        <h1 id="hero-heading" data-hero>
          Software built for your business, by{' '}
          <em className="hero-gradient-text">engineers you can reach</em>.
        </h1>

        <p className="hero-subtitle" data-hero>
          Cortexis designs and builds web apps, mobile apps, and AI automation for
          companies in Pakistan and the Gulf. You work directly with the people
          writing your code, from the first call to the hand-over.
        </p>

        {/* Primary CTA action group */}
        <div className="hero-cta-wrapper" data-hero>
          <div className="hero-buttons" role="group" aria-label="Primary actions">
            <Link to="/contact" className="btn btn-primary cta">
              <span>Start a project</span>
              <ArrowRight className="btn-icon" size={18} />
            </Link>
            <Link to="/services" className="btn btn-secondary cta-alt">
              <Sparkles className="btn-icon-left" size={17} />
              <span>See what we build</span>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="hero-trust-row">
            <span className="hero-trust-item">
              <CheckCircle2 size={14} className="hero-trust-icon" />
              Direct Senior Developer Access
            </span>
            <span className="hero-trust-sep">•</span>
            <span className="hero-trust-item">
              <ShieldCheck size={14} className="hero-trust-icon" />
              100% In-House Engineering
            </span>
            <span className="hero-trust-sep">•</span>
            <span className="hero-trust-item">
              <Zap size={14} className="hero-trust-icon" />
              Milestone-Based Delivery
            </span>
          </div>
        </div>

        {/* Coordinate metric cards */}
        <div className="hero-coords" data-hero>
          {stats.map((s, i) => {
            const IconComponent = s.icon;
            return (
              <div className="coord" key={i}>
                <div className="coord-header">
                  <div className="coord-icon-box">
                    <IconComponent size={20} className="coord-icon" />
                  </div>
                  {s.badge && <span className="coord-mini-badge">{s.badge}</span>}
                </div>
                <div className="coord-body">
                  {s.display ? (
                    <span className="num">{s.display}</span>
                  ) : (
                    <span className="num" data-count={s.count} data-suffix={s.suffix}>
                      {s.count}{s.suffix}
                    </span>
                  )}
                  <span className="lbl">{s.label}</span>
                </div>
                <div className="coord-glow-line" />
              </div>
            );
          })}
        </div>

        {/* Scroll Cue Indicator */}
        <div className="hero-scroll-wrapper" data-hero>
          <a href="#services-heading" className="hero-scroll" aria-label="Scroll to explore">
            <span className="hero-scroll-text">Scroll to explore</span>
            <span className="hero-scroll-mouse"><span className="hero-scroll-wheel" /></span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
