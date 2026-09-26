import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BlogPostVisual.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The article hero: the post's cover photograph in the house frame, laid on a
 * hairline mat that draws itself out from behind it.
 *
 * Over the corner sits the reading time as a small watch face: a copper arc
 * sweeps round the dial to the post's minutes, and a hand follows it. The
 * photo settles on arrival, then drifts slowly and moves against the scroll.
 *
 * Everything is CSS keyframes on transform, opacity and clip-path, so the
 * prerendered page arrives finished without script; GSAP only adds the
 * scroll drift, and only when motion is welcome.
 *
 *   src, alt  the cover image
 *   minutes   reading time, shown on the dial (capped at an hour)
 */
export default function BlogPostVisual({ src, alt, minutes = 0 }) {
  const scope = useRef(null);
  const m = Math.max(0, Math.min(60, Math.round(minutes)));

  // The slow loops (drift, sheen, the chip's float) rest while the cover is
  // off screen, which is most of an eight-minute read.
  useEffect(() => {
    const el = scope.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('is-resting', !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(scope.current.querySelector('.bpv-drift'), {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top 30%', end: 'bottom top', scrub: 0.4 },
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div className="bpv group" ref={scope} style={{ '--m': m, '--deg': `${m * 6}deg` }}>
      <span className="bpv-mat" aria-hidden="true" />

      <div className="bpv-frame">
        <div className="bpv-drift">
          <div className="bpv-kb">
            <img src={src} alt={alt} decoding="async" fetchPriority="high" />
          </div>
        </div>
        <span className="lx-pv-sheen" aria-hidden="true" />
      </div>

      {m > 0 && (
        <p className="bpv-chip lx-glass">
          <svg className="bpv-dial" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle className="bpv-ticks" cx="24" cy="24" r="21" pathLength="60" />
            <circle className="bpv-track" cx="24" cy="24" r="15" />
            <circle className="bpv-arc" cx="24" cy="24" r="15" pathLength="60" />
            <line className="bpv-hand" x1="24" y1="24" x2="24" y2="13" />
            <circle className="bpv-pin" cx="24" cy="24" r="2.2" />
          </svg>
          <span className="bpv-chip-text">
            <span className="bpv-chip-value tabular">{minutes}</span>{' '}
            <span className="bpv-chip-label">min read</span>
          </span>
        </p>
      )}
    </div>
  );
}
