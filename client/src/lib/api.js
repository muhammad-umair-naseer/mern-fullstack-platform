import API_BASE_URL from '../config';

const TOKEN_KEY = 'cortexis.token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

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
