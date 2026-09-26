/**
 * The site's pages, in nav order. Pure data and functions (no DOM), so the
 * same table drives the router in the browser and the route test in Node.
 * The order is also the spatial order page transitions travel in: a page to
 * the right of the current one slides in from the right.
 */
export const ROUTES = [
  { path: '/', id: 'screen-home', key: 'home', title: 'Gotcha Rush — Predict the output. Beat the room.' },
  { path: '/play-with-friends', id: 'page-friends', key: 'friends', title: 'Play with friends · Gotcha Rush' },
  { path: '/how-it-works', id: 'page-how', key: 'how', title: 'How it works · Gotcha Rush' },
  { path: '/rankings', id: 'page-rankings', key: 'rankings', title: 'Rankings · Gotcha Rush' },
  { path: '/achievements', id: 'page-achievements', key: 'achievements', title: 'Achievements · Gotcha Rush' },
  { path: '/progress', id: 'page-progress', key: 'progress', title: 'Profile · Gotcha Rush' },
  { path: '/rivals', id: 'page-rivals', key: 'rivals', title: 'Rivals · Gotcha Rush' },
  { path: '/under-the-hood', id: 'page-hood', key: 'hood', title: 'Under the hood · Gotcha Rush' },
  { path: '/sign-in', id: 'page-signin', key: 'signin', title: 'Sign in · Gotcha Rush' },
];

export const NOT_FOUND = { path: null, id: 'page-404', key: 'not-found', title: 'Nothing prints here · Gotcha Rush' };

/** "/Rankings/" -> "/rankings"; "/index.html" -> "/". */
export function normalize(pathname) {
  let p = String(pathname || '/').split(/[?#]/)[0].toLowerCase().replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  if (!p || p === '/index.html') p = '/';
  return p.startsWith('/') ? p : `/${p}`;
}

export function match(pathname) {
  const p = normalize(pathname);
  return ROUTES.find((r) => r.path === p) || null;
}

export const indexOf = (route) => (route && route.path ? ROUTES.indexOf(route) : ROUTES.length);

/**
 * The one-page site linked to sections with #hashes, and invite links were
 * "/#CODE". Old links keep working: a section hash maps to its page, a room
 * code opens Play with friends with the code filled in. `savedTab` is the
 * tab the old home card last showed, which is where "#home-panel" pointed.
 */
const SECTION_HASH = {
  'play-now': { path: '/', flash: '#btn-quick' },
  top: { path: '/' },
  'how-it-works': { path: '/how-it-works' },
  'under-the-hood': { path: '/under-the-hood' },
  rankings: { path: '/rankings' },
  boards: { path: '/rankings' },
  achievements: { path: '/achievements' },
  ach: { path: '/achievements' },
  progress: { path: '/progress' },
  rivals: { path: '/rivals' },
  friends: { path: '/play-with-friends' },
  'play-with-friends': { path: '/play-with-friends' },
  'sign-in': { path: '/sign-in' },
  signin: { path: '/sign-in' },
};
const TAB_PATH = { progress: '/progress', boards: '/rankings', ach: '/achievements', rivals: '/rivals' };

/** Room codes use A–Z and 2–9 without I, O, 0 or 1 (server/util.js), so words like "main" never read as codes. */
export const ROOM_CODE = /^[A-HJ-NP-Z2-9]{4,6}$/;

/** @returns {{path:string, flash?:string, code?:string}|null} */
export function resolveHash(hash, savedTab) {
  let raw = String(hash || '').replace(/^#/, '');
  try { raw = decodeURIComponent(raw); } catch (_) { /* keep it as typed */ }
  raw = raw.trim();
  if (!raw) return null;
  const key = raw.toLowerCase();
  if (key === 'home-panel') return { path: TAB_PATH[savedTab] || '/progress' };
  if (SECTION_HASH[key]) return { ...SECTION_HASH[key] };
  const code = raw.toUpperCase();
  if (ROOM_CODE.test(code)) return { path: '/play-with-friends', code };
  return null;
}
