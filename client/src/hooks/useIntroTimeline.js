import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

/**
 * On-mount staggered entrance for above-the-fold content (page heroes).
 *
 * Attach the returned ref to a container and mark children with `data-intro`;
 * they slide/fade up on a single choreographed timeline. Honors
 * prefers-reduced-motion (no transforms applied).
 */
export function useIntroTimeline(selector = '[data-intro]', opts = {}) {
  const scope = useRef(null);
  const { y = 26, duration = 0.65, stagger = 0.12, delay = 0.05 } = opts;

  useGSAP(
    () => {
      const items = gsap.utils.toArray(selector, scope.current);
      if (!items.length) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(items, {
          opacity: 0,
          y,
          duration,
          ease: 'power3.out',
          stagger,
          delay,
        });
      });
    },
    { scope }
  );

  return scope;
}
