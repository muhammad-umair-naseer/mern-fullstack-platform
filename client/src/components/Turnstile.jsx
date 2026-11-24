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
 * says the check failed and offers a retry that draws a fresh widget; onFail
 * tells the form, so its button never sits on "Checking…". Expired tokens
 * refresh automatically (Turnstile's default).
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

// Error codes go to the server log (no personal data) so we can see why checks
// fail: 600xxx = the browser failed the challenge (extensions, strict privacy,
// VPN), 110200 = hostname not allowed for the site key, 'script' = api.js was
// blocked, 'timeout' / 'unsupported' = Turnstile's own callbacks.
const report = (action, code) => {
  try {
    console.warn('[turnstile]', action, code);
    navigator.sendBeacon?.('/api/telemetry/turnstile', new Blob([JSON.stringify({ action, code: String(code) })], { type: 'application/json' }));
  } catch { /* reporting must never break the form */ }
};

const Turnstile = forwardRef(function Turnstile({ action, onToken, onFail }, ref) {
  const box = useRef(null);
  const id = useRef(null);
  const [visible, setVisible] = useState(false);   // show the checkbox itself
  const [problem, setProblem] = useState(null);    // null | 'slow' | error code
  const [attempt, setAttempt] = useState(0);       // bump to start a fresh widget
  // Latest callbacks, so new functions never restart the check.
  const emit = useRef(onToken);
  emit.current = onToken;
  const fail = useRef(onFail);
  fail.current = onFail;

  useImperativeHandle(ref, () => ({
    reset() {
      emit.current('');
      if (id.current != null) window.turnstile?.reset(id.current);
    },
  }), []);

  useEffect(() => { fail.current?.(problem != null && problem !== 'slow'); }, [problem]);

  useEffect(() => {
    if (!active()) return undefined;
    let cancelled = false;
    let hasToken = false;
    let errors = 0;
    const failed = (code) => {
      hasToken = false;
      emit.current('');
      report(action, code);
      setProblem(String(code || 'error'));
      setVisible(true);
    };
    // No token yet: show the checkbox (first try) or the retry link (later tries).
    const slow = setTimeout(() => {
      if (!hasToken) { setProblem((p) => p || 'slow'); setVisible(true); }
    }, visible ? SLOW_MS * 2 : SLOW_MS);
    loadScript().then((ts) => {
      if (cancelled || !box.current) return;
      id.current = ts.render(box.current, {
        sitekey: SITE_KEY,
        action,
        appearance: visible ? 'always' : 'interaction-only',
        callback: (token) => { hasToken = true; setProblem(null); emit.current(token); },
        'expired-callback': () => { hasToken = false; emit.current(''); },
        'timeout-callback': () => failed('timeout'),
        'unsupported-callback': () => failed('unsupported'),
        'error-callback': (code) => {
          if (++errors === 1) { hasToken = false; emit.current(''); ts.reset(id.current); } // one quiet retry
          else failed(code);
          return true;                                    // handled; no console noise
        },
      });
    }).catch(() => { if (!cancelled) failed('script'); });
    return () => {
      cancelled = true;
      clearTimeout(slow);
      if (id.current != null) window.turnstile?.remove(id.current);
      id.current = null;
    };
  }, [action, visible, attempt]);

  const retry = () => { setProblem(null); setVisible(true); setAttempt((a) => a + 1); };

  if (!SITE_KEY) return null;
  return (
    <div className="cx-turnstile">
      <div ref={box} />
      {problem && (
        <p className="lx-auth-hint" role="status">
          {problem === 'slow' ? (
            <button type="button" className="lx-auth-textbtn" onClick={retry}>Still checking… tap here to retry</button>
          ) : (
            <>
              Security check failed —{' '}
              <button type="button" className="lx-auth-textbtn" onClick={retry}>retry</button>
              , or try another browser / turn off ad-blockers.
            </>
          )}
        </p>
      )}
    </div>
  );
});

export default Turnstile;
