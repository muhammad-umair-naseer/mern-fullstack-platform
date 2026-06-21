import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Staggered scroll-reveal for a group of elements.
 *
 * Attach the returned ref to a container, then mark the children you want
 * revealed with `data-reveal`. Each element animates in once as it enters the
 * viewport; entries that cross the threshold together are batched so they
 * stagger as a group. Honors prefers-reduced-motion via gsap.matchMedia().
 *
 * @param {string} selector  Child selector to reveal (default '[data-reveal]').
 * @param {object} opts      { y, duration, stagger, start } overrides.
 */
export function useRevealOnScroll(selector = '[data-reveal]', opts = {}) {
  const scope = useRef(null);
  const { y = 40, duration = 0.7, stagger = 0.12, start = 'top 85%' } = opts;

  useGSAP(
    () => {
      const items = gsap.utils.toArray(selector, scope.current);
      if (!items.length) return;

      const mm = gsap.matchMedia();

      // Full motion
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(items, { opacity: 0, y });
        ScrollTrigger.batch(items, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration,
              ease: 'power3.out',
              stagger,
              overwrite: true,
            }),
        });
      });

      // Reduced motion — show everything, no transforms
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(items, { opacity: 1, y: 0 });
      });
    },
    { scope }
  );

  return scope;
}
