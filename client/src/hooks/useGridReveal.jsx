import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

/**
 * Staggered reveal for a grid of cards that re-runs whenever `deps` change
 * (e.g. on search/category filtering), so the grid re-animates as it reflows.
 *
 * Attach the returned ref to a container and mark each card with `data-card`.
 * Honors prefers-reduced-motion.
 */
export function useGridReveal(deps = [], selector = '[data-card]') {
  const scope = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(selector, scope.current);
      if (!items.length) return;

      // Reduced motion: show everything outright, no tween to get stuck in.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      // fromTo, never from. `gsap.from` treats each element's CURRENT value as
      // the destination, so a re-run that catches a card mid-fade at opacity
      // 0.08 animates 0 -> 0.08. With async data arriving and then filters
      // changing, cards converge on permanently invisible. An explicit end
      // state cannot drift that way.
      const tween = gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: { each: 0.05, from: 'start' },
          overwrite: 'auto',
          // Hand styling back to CSS once shown, so no inline opacity lingers
          // for a later run to misread.
          clearProps: 'opacity,transform',
        }
      );

      return () => {
        // Torn down mid-flight (fast filter clicks): kill the tween and strip
        // the inline styles, so a card is never abandoned part-faded.
        tween.kill();
        gsap.set(items, { clearProps: 'opacity,transform' });
      };
    },
    { dependencies: deps, scope, revertOnUpdate: true }
  );

  return scope;
}
