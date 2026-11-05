import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The default hero visual: a photograph in a glass-edged frame that opens
 * from a narrower crop on arrival, drifts against the scroll, and carries up
 * to three floating frosted chips with a single fact each.
 *
 *   photo  { src, alt }
 *   chips  [{ value, label }]  short facts, e.g. { value: '12', label: 'services' }
 *   ratio  CSS aspect-ratio for the frame, default '4 / 5'
 */
export default function PhotoVisual({ photo, chips = [], ratio = '4 / 5' }) {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(scope.current.querySelector('.lx-pv-drift'), {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top 30%', end: 'bottom top', scrub: 0.4 },
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <figure className="lx-pv" ref={scope}>
      <div className="lx-pv-frame" style={{ aspectRatio: ratio }}>
        <div className="lx-pv-drift">
          <img src={photo.src} alt={photo.alt} decoding="async" />
        </div>
        <span className="lx-pv-sheen" aria-hidden="true" />
      </div>
      {chips.slice(0, 3).map((c, i) => (
        <span className={`lx-glass lx-pv-chip lx-pv-chip--${i}`} key={c.label} style={{ '--i': i }}>
          <span className="lx-pv-chip-value tabular">{c.value}</span>
          <span className="lx-pv-chip-label">{c.label}</span>
        </span>
      ))}
    </figure>
  );
}
