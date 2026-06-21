import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

/**
 * Staggered reveal for a grid of cards that re-runs whenever `deps` change
 * (e.g. on search/category filtering), so the grid re-animates as it reflows.
 *
 * Attach the returned ref to a container and mark each card with `data-card`.
 * Honors prefers-reduced-motion. revertOnUpdate cleans up between filter runs.
 */
export function useGridReveal(deps = [], selector = '[data-card]') {
  const scope = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(selector, scope.current);
      if (!items.length) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(items, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          ease: 'power2.out',
          stagger: { each: 0.05, from: 'start' },
          overwrite: true,
        });
      });
    },
    { dependencies: deps, scope, revertOnUpdate: true }
  );

  return scope;
}
