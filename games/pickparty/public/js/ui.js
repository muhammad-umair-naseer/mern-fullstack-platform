// Small DOM helpers shared by every screen.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

export function flag(cc) {
  if (!/^[A-Z]{2}$/.test(cc || '')) return '';
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

export const fmt = (n) => Number(n || 0).toLocaleString('en-US');

export function toast(msg, kind = '') {
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast ' + kind;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 200); }, 3200);
}

export function listJoin(names) {
  if (names.length <= 1) return names[0] || '';
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
}

// FLIP flight: a card leaves `fromEl` and lands on `toEl`.
export function fly(fromEl, toEl, html, cls = 'tile') {
  if (!fromEl || !toEl) return Promise.resolve();
  const a = fromEl.getBoundingClientRect();
  const b = toEl.getBoundingClientRect();
  if (reducedMotion() || !a.width || !b.width) return Promise.resolve();
  const f = document.createElement('div');
  f.className = `${cls} flyer`;
  f.innerHTML = html;
  Object.assign(f.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
  document.body.appendChild(f);
  const dx = b.left - a.left, dy = b.top - a.top;
  const sx = b.width / a.width, sy = b.height / a.height;
  const anim = f.animate([
    { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
    { transform: `translate3d(${dx * 0.5}px, ${dy * 0.5 - 24}px, 0) scale(${(1 + sx) / 2}, ${(1 + sy) / 2}) rotate(-3deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`, opacity: 0.9 },
  ], { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
  return anim.finished.catch(() => {}).then(() => f.remove());
}

// Reorder children to `orderKeys` with a FLIP animation (crowd reveal).
export function flipReorder(container, keyAttr, orderKeys, duration = 620) {
  const kids = [...container.children];
  const first = new Map(kids.map((k) => [k.getAttribute(keyAttr), k.getBoundingClientRect()]));
  const byKey = new Map(kids.map((k) => [k.getAttribute(keyAttr), k]));
  for (const key of orderKeys) { const el = byKey.get(String(key)); if (el) container.appendChild(el); }
  if (reducedMotion()) return;
  for (const el of container.children) {
    const f = first.get(el.getAttribute(keyAttr));
    const l = el.getBoundingClientRect();
    if (!f) continue;
    const dx = f.left - l.left, dy = f.top - l.top;
    if (!dx && !dy) continue;
    el.animate([{ transform: `translate3d(${dx}px, ${dy}px, 0)` }, { transform: 'none' }],
      { duration, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', delay: Math.random() * 90 });
  }
}

export function show(id) {
  for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== id;
  window.scrollTo({ top: 0 });
}
