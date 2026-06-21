import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

/**
 * Scale/fade-in for a modal panel. Attach the returned ref to the dialog panel
 * and pass the open flag; the panel animates in each time it opens. Honors
 * prefers-reduced-motion.
 */
export function useModalIntro(isOpen) {
  const panel = useRef(null);

  useGSAP(
    () => {
      if (!isOpen || !panel.current) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(panel.current, {
          opacity: 0,
          scale: 0.94,
          y: 12,
          duration: 0.32,
          ease: 'power2.out',
        });
      });
    },
    { dependencies: [isOpen] }
  );

  return panel;
}
