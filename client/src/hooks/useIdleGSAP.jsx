import { useGSAP } from '@gsap/react';

const idle = (fn) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200));
const cancelIdle = (id) => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));

/**
 * useGSAP, with the setup run when the browser is next idle instead of in the
 * layout-effect pass. ScrollTrigger measures every trigger it creates (a
 * forced layout): run during hydration's commit, every section's setup lands
 * in one long task. The setup still runs in the component's GSAP context, so
 * what it creates (and any cleanup it returns) is reverted on unmount.
 */
export function useIdleGSAP(setup, config) {
  useGSAP((context) => {
    let handle = idle(() => {
      handle = null;
      context.add(setup);
    });
    return () => { if (handle != null) cancelIdle(handle); };
  }, config);
}
