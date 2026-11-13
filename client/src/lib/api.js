import API_BASE_URL from '../config';

const TOKEN_KEY = 'cortexis.token';
// The prior persistent token is intentionally invalidated during the security upgrade.
try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage may be disabled */ }

let memoryToken = null;
export const getToken = () => { try { return sessionStorage.getItem(TOKEN_KEY) || memoryToken; } catch { return memoryToken; } };
export const setToken = t => { memoryToken = t; try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch { /* memory fallback */ } };

// Thin fetch wrapper: attaches the bearer token, unwraps `data`, and turns a
// non-2xx into a thrown Error carrying the server's message and status.
// `keepalive` lets a request finish while the page is being hidden or closed
// (the final exam submits itself when its tab is left).
export const api = async (path, { method = 'GET', body, auth = true, keepalive = false } = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(keepalive ? { keepalive: true } : {}),
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok) {
    const err = new Error(payload?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = payload?.errors;
    err.data = payload?.data;
    // Some errors carry actionable flags at the top level (e.g. needsVerification),
    // so expose the whole payload rather than only `data`.
    err.body = payload;
    throw err;
  }

  return payload;
};

// The API responses a prerendered page was built with (scripts/prerender.mjs
// embeds them as JSON). A page starts from them, so its first render matches
// the saved HTML and React can hydrate it; it still fetches fresh data after.
let embedded;
export const prerendered = (path) => {
  if (typeof window === 'undefined') return undefined;
  if (window.__CX_DATA__) return window.__CX_DATA__[path];
  if (embedded === undefined) {
    try { embedded = JSON.parse(document.getElementById('cx-data')?.textContent || 'null') || {}; } catch { embedded = {}; }
  }
  return embedded[path];
};
