// Hash routes → screens. Pages (home, categories, friends, rankings, profile)
// are plain screens anyone can open. The table and solo screens are live
// screens: they only show while a game is on, otherwise the route falls back
// home. Using the hash keeps the back button and refresh working with no
// server routing at all.
import { show } from './ui.js';

const PAGES = { '': 'home', categories: 'categories', friends: 'friends', rankings: 'rankings', profile: 'profile' };
const LIVE = new Set(['table', 'solo']);
const listeners = [];
let liveGuard = () => false;

export function parse(hash = location.hash) {
  const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  return { name: parts[0] || '', param: parts[1] ? decodeURIComponent(parts[1]) : null };
}

// go('categories/auction') navigates; go('', true) replaces the current entry.
export function go(path = '', replace = false) {
  const h = '#/' + String(path).replace(/^\/+/, '');
  if (location.hash === h || (h === '#/' && location.hash === '')) return route();
  if (replace) { history.replaceState(null, '', h); route(); } else location.hash = h;
}

export function onRoute(fn) { listeners.push(fn); }
export function guard(fn) { liveGuard = fn; }

export function route() {
  const r = parse();
  const live = LIVE.has(r.name);
  if (live && !liveGuard(r.name)) return go('', true);
  const screen = live ? r.name : PAGES[r.name];
  if (!screen) return go('', true);
  show(screen);
  document.body.classList.toggle('in-game', live);
  for (const a of document.querySelectorAll('nav.sitenav a, nav.tabbar a')) {
    const target = parse(a.getAttribute('href')).name;
    if (target === r.name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  for (const fn of listeners) fn(r);
}

window.addEventListener('hashchange', route);
