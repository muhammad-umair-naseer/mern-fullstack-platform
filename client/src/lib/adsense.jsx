import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { INPUT, hasInteracted } from './firstInput.js';

/**
 * Google AdSense, public content pages only. No ad slots and no Auto ads yet
 * (switched on in AdSense after approval), so nothing here can shift layout.
 *
 * - <meta name="google-adsense-account"> goes in the prerendered <head> (it is
 *   one of AdSense's site-verification methods and costs nothing to load).
 * - adsbygoogle.js is added to <head> lazily: on the first scroll / pointer /
 *   key / touch, or when the browser is idle well after load, so it stays out
 *   of PageSpeed's loading window. Never in the prerender (navigator.webdriver).
 */
export const ADSENSE_CLIENT = 'ca-pub-2536625091958666';
const IDLE_AFTER_LOAD_MS = 8000;

// Sign-in, account, course-taking, certificates, admin and the YourBot app
// pages never get ads.
const PRIVATE = /^\/(login|signup|dashboard|admin|your-bot|whatsapp-bot|yourbot|certificate)(\/|$)|^\/learn\/[^/]+\/(lesson|quiz|final)(\/|$)/;
export const adsAllowed = (pathname) => !PRIVATE.test(pathname);

let added = false;
const addScript = () => {
  if (added || navigator.webdriver) return;
  added = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.appendChild(s);
};

export function AdSense() {
  const allowed = adsAllowed(useLocation().pathname);
  useEffect(() => {
    if (!allowed || added || navigator.webdriver) return undefined;
    if (hasInteracted()) { addScript(); return undefined; }
    let timer;
    const go = () => { cleanup(); addScript(); };
    const idle = () => { timer = setTimeout(() => (window.requestIdleCallback || setTimeout)(go), IDLE_AFTER_LOAD_MS); };
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('load', idle);
      INPUT.forEach((type) => window.removeEventListener(type, go, true));
    };
    INPUT.forEach((type) => window.addEventListener(type, go, { capture: true, passive: true, once: true }));
    if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, { once: true });
    return cleanup;
  }, [allowed]);
  return allowed ? <meta data-cx-seo="" name="google-adsense-account" content={ADSENSE_CLIENT} /> : null;
}
