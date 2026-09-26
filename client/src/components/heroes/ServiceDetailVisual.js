import React, { useRef } from 'react';
import { Check } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PhotoVisual from '../PhotoVisual';
import './ServiceDetailVisual.css';

gsap.registerPlugin(useGSAP);

// One full turn of the deck: each of the three cards spends a third of it at
// the front. Kept in step with the keyframes in ServiceDetailVisual.css.
const CYCLE_S = 10.5;

/**
 * The service page hero: the service's photograph in the house frame, with
 * a small stack of paper cards over its corner, one per deliverable in
 * data/services.js. The front card's rule fills, a tick lands, and the card
 * is drawn out and tucked in at the back, so the next one comes forward.
 *
 * The deck is CSS keyframes on transform and opacity, so the prerendered page
 * moves without script; GSAP only adds a few pixels of pointer depth on fine
 * pointers. With reduced motion, or with anything other than three
 * deliverables, the stack sits still with the first card on top.
 *
 * The cards repeat the "What you get" list further down the page, so the
 * whole overlay is hidden from assistive technology.
 */
export default function ServiceDetailVisual({ photo, deliverables = [] }) {
  const scope = useRef(null);
  const cards = deliverables.slice(0, 3);
  const cycles = cards.length === 3;
  const total = String(cards.length).padStart(2, '0');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const layers = gsap.utils.toArray('[data-depth]', scope.current).map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div className="lx-sdv" ref={scope}>
      <PhotoVisual photo={photo} />

      <div className="lx-sdv-pill-pos" data-depth="-10" aria-hidden="true">
        <span className="lx-glass lx-sdv-pill">
          <span className="lx-sdv-pill-mark">
            <Check size={13} strokeWidth={2.5} />
          </span>
          Yours to keep
        </span>
      </div>

      {cards.length > 0 && (
        <div className="lx-sdv-deck-pos" data-depth="16" aria-hidden="true">
          <div className={`lx-sdv-deck${cycles ? ' is-cycling' : ''}`}>
            {cards.map((d, i) => (
              <div
                className={`lx-sdv-card lx-sdv-card--${i}`}
                key={d}
                // Card 0 starts at the front, card 1 in the middle, card 2 at
                // the back: each is offset into the loop by the thirds it has
                // still to wait.
                style={{ '--d': `${-(((3 - i) % 3) * CYCLE_S) / 3}s` }}
              >
                <span className="lx-sdv-card-top">
                  <span>
                    Deliverable <span className="lx-sdv-card-num tabular">{String(i + 1).padStart(2, '0')}/{total}</span>
                  </span>
                  <span className="lx-sdv-tick">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                </span>
                <span className="lx-sdv-card-name">{d}</span>
                <span className="lx-sdv-track">
                  <span className="lx-sdv-bar" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
