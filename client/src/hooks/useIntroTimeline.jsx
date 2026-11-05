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
  const { y = 18, duration = 1, stagger = 0.08, delay = 0.05 } = opts;

  useGSAP(
    () => {
      const items = gsap.utils.toArray(selector, scope.current);
      if (!items.length) return;

      const mm = gsap.matchMedia();

      // Full motion. fromTo + clearProps guarantees the resting state is the
      // element's natural position (no leftover transform) even if React
      // StrictMode double-invokes the effect and interrupts the tween.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // A page title rises out of a mask instead of fading: it wipes open
        // from its own baseline while travelling up, like type being set.
        const titles = items.filter((el) => el.tagName === 'H1');
        const rest = items.filter((el) => el.tagName !== 'H1');
        if (titles.length) {
          gsap.fromTo(
            titles,
            { clipPath: 'inset(0% 0% 100% 0%)', y: 36 },
            {
              clipPath: 'inset(0% 0% -10% 0%)',
              y: 0,
              duration: 1.3,
              ease: 'expo.out',
              delay,
              clearProps: 'clipPath,transform',
            }
          );
        }
        if (!rest.length) return;
        gsap.fromTo(
          rest,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            ease: 'expo.out',
            stagger,
            delay: delay + (titles.length ? 0.2 : 0),
            overwrite: 'auto',
            clearProps: 'transform',
          }
        );
      });

      // Reduced motion — show everything, no transforms.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(items, { opacity: 1, y: 0, clearProps: 'transform' });
      });

      // Revert on cleanup so a StrictMode-interrupted first pass leaves nothing
      // pinned to its start offset.
      return () => mm.revert();
    },
    { scope }
  );

  return scope;
}
