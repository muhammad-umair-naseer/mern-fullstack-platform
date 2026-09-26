import { useEffect, useRef, useState } from 'react';

/**
 * A number that counts towards its target instead of appearing, easing out so
 * it settles rather than stops. Presentation only: the caller should give the
 * real value to assistive tech separately, since the displayed one moves.
 * Under reduced motion it simply shows the target.
 */
export default function useCountUp(target, { duration = 1100, delay = 0 } = {}) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const to = Number(target) || 0;
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof window.requestAnimationFrame !== 'function') {
      current.current = to;
      setValue(to);
      return undefined;
    }

    const from = current.current;
    if (from === to) return undefined;

    let frame = 0;
    let start = 0;

    const tick = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const next = Math.round(from + (to - from) * eased);
      current.current = next;
      setValue(next);
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };

    const timer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [target, duration, delay]);

  return value;
}
