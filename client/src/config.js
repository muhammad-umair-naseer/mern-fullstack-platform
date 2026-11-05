// In production the Express backend serves this React build, so the API lives
// on the SAME origin — use a relative base (''), which resolves to e.g.
// https://your-app.onrender.com/api/contact. In local dev (CRA on :3000),
// point at the backend on :5000 of whichever host served the page, so the dev
// site also works from a phone on the same Wi-Fi (http://<mac-ip>:3000), where
// "localhost" would mean the phone. An explicit env var always wins.
const devApi = () =>
  typeof window === 'undefined'
    ? 'http://localhost:5000'
    : `${window.location.protocol}//${window.location.hostname}:5000`;

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? '' : devApi());

export const YOURBOT_URL =
  process.env.REACT_APP_YOURBOT_URL || '/contact?interest=yourbot';

export default API_BASE_URL;


// Explicit HTTPS origins prevent mixed-content and broken public localhost links.
export const gameUrlFor = port => {
  const key = { 3001: 'GOTCHA', 4001: 'TYPEDASH', 5001: 'PICKPARTY', 7001: 'SKETCH' }[port];
  const urls = { GOTCHA: process.env.REACT_APP_GAME_GOTCHA_URL, TYPEDASH: process.env.REACT_APP_GAME_TYPEDASH_URL, PICKPARTY: process.env.REACT_APP_GAME_PICKPARTY_URL, SKETCH: process.env.REACT_APP_GAME_SKETCH_URL };
  const configured = urls[key];
  if (configured) { try { const url = new URL(configured); return url.protocol === 'https:' && !url.username && !url.password ? url.origin : ''; } catch { return ''; } }
  return process.env.NODE_ENV === 'production' ? '' : 'http://' + (typeof window === 'undefined' ? 'localhost' : window.location.hostname) + ':' + port;
};