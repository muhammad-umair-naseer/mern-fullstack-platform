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
  process.env.REACT_APP_YOURBOT_URL || 'https://localhost:5173';

export default API_BASE_URL;

