export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** 42_350 ms -> "0:42.3" */
export function fmtTime(ms) {
  if (ms == null || Number.isNaN(ms)) return '–';
  const s = Math.max(0, ms) / 1000;
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}:${r.toFixed(1).padStart(4, '0')}`;
}

export function medal(rank) {
  return rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
}

/*
 * Nothing pops up over a race. From the countdown to the results, toasts and
 * dialogs wait here (holdPopups(true)) and show, in order, once the results
 * are up (holdPopups(false)).
 */
let held = null;
export function holdPopups(on) {
  if (on) { held ||= []; return; }
  const waiting = held || [];
  held = null;
  for (const show of waiting) show();
}

/** Show it now, or after the race if one is on. */
export function whenFree(show) {
  if (held) held.push(show);
  else show();
}

let toastRoot = null;
/** `now`: the answer to something the player just did, so it does not wait for the race. */
export function toast(message, kind = 'info', ms = 3200, now = false) {
  if (held && !now) return void held.push(() => toast(message, kind, ms));
  toastRoot ||= document.getElementById('toasts');
  if ([...toastRoot.children].some((t) => t.textContent === message)) return;   // already on screen
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = message;
  toastRoot.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => {
    el.classList.remove('in');
    setTimeout(() => el.remove(), 320);
  }, ms);
}
