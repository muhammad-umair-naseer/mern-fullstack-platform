// In production the Express backend serves this React build, so the API lives
// on the SAME origin — use a relative base (''), which resolves to e.g.
// https://your-app.onrender.com/api/contact. In local dev (CRA on :3000),
// point at the backend on :5000. An explicit env var always wins.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export default API_BASE_URL;
