import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Settles each new page into place: 12px of rise and a fade over the slow
 * duration, played with the Web Animations API on the route container.
 *
 * Nothing is remounted and no start state lives in the stylesheet, so the
 * prerendered HTML is unaffected and a page's own state survives. The first
 * render is skipped: the landing page runs its own entrance, and two
 * choreographies at once would compete. Query-string and hash changes on the
 * same path don't count as a new page.
 */
export default function RouteTransition({ children }) {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    const el = ref.current;
    if (!el || !el.animate) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const anim = el.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 12px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ],
      { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
    return () => anim.cancel();
  }, [pathname]);

  return (
    <div ref={ref} className="lx-route">
      {children}
    </div>
  );
}
