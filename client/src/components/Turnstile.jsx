import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile bot check. Managed mode with appearance
 * "interaction-only": most visitors never see it; a suspicious one gets a
 * small challenge in place. The token it hands to onToken goes in the request
 * body as turnstileToken and is checked by the server (middleware/turnstile.js).
 *
 * The check starts as soon as the page opens, so it is usually done before the
 * visitor finishes typing; only the submit button waits for it. If there is no
 * token after SLOW_MS (slow in-app browsers, mobile data), the visible
 * checkbox is shown with a retry link. An error retries once on its own, then
 * offers the same retry. Expired tokens refresh automatically (Turnstile's
 * default).
 *
 * Tokens are single-use: call ref.reset() after every submit, success or not.
 * Without REACT_APP_TURNSTILE_SITE_KEY (local dev) it renders nothing and the
 * forms do not wait for a token. Skipped in the prerender (navigator.webdriver),
 * so no widget iframe is frozen into the static HTML.
 */
const SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || '';
export const turnstileOn = Boolean(SITE_KEY);
const SLOW_MS = 8000;
const active = () => SITE_KEY && typeof navigator !== 'undefined' && !navigator.webdriver;

let scriptPromise;
const loadScript = () => {
  scriptPromise ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = () => { scriptPromise = null; reject(new Error('Turnstile failed to load')); };
    document.head.appendChild(s);
  });
  return scriptPromise;
};
// The pages that use this are lazy-loaded, so this starts the download when
// one of them opens, before React has even rendered the form.
if (active()) loadScript().catch(() => {});

const Turnstile = forwardRef(function Turnstile({ action, onToken }, ref) {
  const box = useRef(null);
  const id = useRef(null);
  const [visible, setVisible] = useState(false);   // show the checkbox itself
  const [stuck, setStuck] = useState(false);       // offer "tap here to retry"
  const [attempt, setAttempt] = useState(0);       // bump to start a fresh widget
  // Latest callback, so a new onToken function never restarts the check.
  const emit = useRef(onToken);
  emit.current = onToken;

  useImperativeHandle(ref, () => ({
    reset() {
      emit.current('');
      if (id.current != null) window.turnstile?.reset(id.current);
    },
  }), []);

  useEffect(() => {
    if (!active()) return undefined;
    let cancelled = false;
    let hasToken = false;
    let errors = 0;
    const slow = visible ? null : setTimeout(() => {
      if (!hasToken) { setStuck(true); setVisible(true); }
    }, SLOW_MS);
    loadScript().then((ts) => {
      if (cancelled || !box.current) return;
      id.current = ts.render(box.current, {
        sitekey: SITE_KEY,
        action,
        appearance: visible ? 'always' : 'interaction-only',
        callback: (token) => { hasToken = true; setStuck(false); emit.current(token); },
        'expired-callback': () => { hasToken = false; emit.current(''); },
        'error-callback': () => {
          hasToken = false;
          emit.current('');
          if (++errors === 1) ts.reset(id.current);       // one quiet retry
          else { setStuck(true); setVisible(true); }
          return true;                                    // handled; no console noise
        },
      });
    }).catch(() => { if (!cancelled) setStuck(true); });
    return () => {
      cancelled = true;
      clearTimeout(slow);
      if (id.current != null) window.turnstile?.remove(id.current);
      id.current = null;
    };
  }, [action, visible, attempt]);

  if (!SITE_KEY) return null;
  return (
    <div className="cx-turnstile">
      <div ref={box} />
      {stuck && (
        <p className="lx-auth-hint" role="status">
          <button
            type="button"
            className="lx-auth-textbtn"
            onClick={() => { setStuck(false); setVisible(true); setAttempt((a) => a + 1); }}
          >
            Still checking… tap here to retry
          </button>
        </p>
      )}
    </div>
  );
});

export default Turnstile;
