import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { liveTools } from '../data/tools';
import { COURSE_COUNT } from '../data/catalogue';
import HeroReel from './HeroReel';
import './Hero.css';

gsap.registerPlugin(useGSAP);

// Each fact has to survive a visitor clicking through to check it: the SECP
// incorporation is on /about, the catalogue on /courses, the tools on /tools.
const facts = [
  { value: '2025', label: 'Incorporated in Pakistan', to: '/about' },
  { count: COURSE_COUNT, label: 'Free courses', to: '/courses' },
  { count: liveTools().length, label: 'Free tools', to: '/tools' },
];

// Six words, two lines: the reel below is the explanation, so the headline
// only has to carry the promise.
const HEADLINE = ['Software by engineers', 'you can reach.'];

/**
 * The page's one orchestrated moment. The headline rises out of line masks,
 * the lede and actions follow, then the product reel opens from a narrower
 * crop and starts playing what the studio builds. The entrances are CSS
 * keyframes, so the prerendered HTML reaches its end state with or without
 * JavaScript. GSAP only adds the count-up; the reel runs its own clock.
 */
const Hero = () => {
  const scope = useRef(null);

  useGSAP(
    () => {
      const counters = gsap.utils.toArray('[data-count]');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The markup renders the finished number, so the static HTML is true.
        counters.forEach((el) => {
          const target = +el.dataset.count;
          const proxy = { v: 0 };
          el.textContent = '0';
          gsap.to(proxy, {
            v: target,
            duration: 1.8,
            delay: 0.9,
            ease: 'expo.out',
            onUpdate: () => {
              el.textContent = Math.round(proxy.v);
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section className="lx-hero" aria-labelledby="hero-heading" ref={scope}>
      <div className="lx-wrap">
        <div className="lx-hero-kicker">
          <span className="lx-label"><span className="lx-label-num">Cortexis</span>A software studio in Pakistan</span>
          
          <Link
            to="/courses"
            className="lx-hero-claude-pill"
            aria-label="Get Claude Pro for free for one month upon course completion"
          >
            <span className="lx-claude-pill-tag">Free 1 Month</span>
            <span className="lx-claude-pill-text">
              Get <strong>Claude Pro</strong> for Free
            </span>
            <span className="lx-claude-pill-arrow" aria-hidden="true">
              <ArrowRight size={13} />
            </span>
          </Link>
        </div>

        {/* On a wide screen the lede and actions sit beside the headline
            rather than under it, so the reel rises into the first screen. */}
        <div className="lx-hero-top">
          <h1 id="hero-heading" className="lx-hero-title" aria-label={HEADLINE.join(' ')}>
            {HEADLINE.map((line, i) => (
              <span className="lx-line" aria-hidden="true" key={line} style={{ '--i': i }}>
                <span>{i === HEADLINE.length - 1 ? <em>{line}</em> : line}</span>
              </span>
            ))}
          </h1>

          <div className="lx-hero-foot">
            <p className="lx-lede lx-hero-lede">
              Web apps, mobile apps and AI automation.
            </p>
            <div className="lx-hero-actions" role="group" aria-label="Primary actions">
              <Link to="/contact" className="btn lx-btn">
                Start a project
                <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
              </Link>
              <Link to="/services" className="lx-link">
                See what we build <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="lx-wrap">
        <div className="lx-hero-plinth">
          <HeroReel className="lx-hero-frame" />
        </div>
      </div>

      <div className="lx-wrap">
        <ul className="lx-hero-facts">
          {facts.map((f) => (
            <li key={f.label}>
              <Link to={f.to} className="lx-fact">
                {f.value ? (
                  <span className="lx-fact-num tabular">{f.value}</span>
                ) : (
                  <span className="lx-fact-num tabular" data-count={f.count}>{f.count}</span>
                )}
                <span className="lx-fact-label">{f.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
