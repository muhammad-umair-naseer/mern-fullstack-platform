import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Scroll choreography for one section. Attach the returned ref to the section,
 * then mark children:
 *
 *   data-reveal         rises 16px and fades in, once, as it enters. Entries
 *                       that cross the threshold together stagger as a group.
 *   data-reveal-media   an image frame that opens upward from its bottom edge
 *                       while the picture inside settles from 1.12 to 1.
 *   data-parallax       drifts against the scroll by a few percent of its own
 *                       height (the value, e.g. data-parallax="8"), scrubbed.
 *
 * Start states are written from JavaScript, never the stylesheet, so the
 * prerendered HTML is the finished page. Under reduced motion everything is
 * shown as it is, with no transforms.
 *
 * @param {string} selector  Reveal selector (default '[data-reveal]').
 * @param {object} opts      { y, duration, stagger, start } overrides.
 */
export function useRevealOnScroll(selector = '[data-reveal]', opts = {}) {
  const scope = useRef(null);
  const { y = 16, duration = 1, stagger = 0.08, start = 'top 88%' } = opts;

  useGSAP(
    () => {
      const root = scope.current;
      const items = gsap.utils.toArray(selector, root);
      const media = gsap.utils.toArray('[data-reveal-media]', root);
      const drift = gsap.utils.toArray('[data-parallax]', root);
      if (!items.length && !media.length && !drift.length) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (items.length) {
          gsap.set(items, { opacity: 0, y });
          ScrollTrigger.batch(items, {
            start,
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration,
                ease: 'expo.out',
                stagger,
                overwrite: true,
                clearProps: 'transform',
              }),
          });
        }

        media.forEach((frame) => {
          const pic = frame.querySelector('img, video');
          gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
          if (pic) gsap.set(pic, { scale: 1.12 });
          ScrollTrigger.create({
            trigger: frame,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              // Inline styles are cleared on completion so the stylesheet's
              // hover states own the element again.
              gsap.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' });
              if (pic) gsap.to(pic, { scale: 1, duration: 1.3, ease: 'expo.out', clearProps: 'transform' });
            },
          });
        });

        drift.forEach((el) => {
          const amount = parseFloat(el.dataset.parallax) || 6;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
            }
          );
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(items, { opacity: 1, y: 0 });
        gsap.set(media, { clipPath: 'none' });
      });

      return () => mm.revert();
    },
    { scope }
  );

  return scope;
}
