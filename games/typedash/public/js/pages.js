import { carSvg, SHOWROOM } from './cars.js';
import { mountDemos } from './demo.js';
import { cachedProfile } from './nav.js';

/**
 * Brings a server-rendered page to life: draws the cars, types the
 * paragraphs, runs the podium and the boards, the countdown and the try-it
 * lane. Used on the pages themselves (js/site.js) and by the game when it
 * shows one of them in its own document (js/router.js), so everything here
 * works on any root and hands back a function that stops it again.
 *
 * Only one thing on a page moves by itself (its hero); the rest waits for
 * you. Everything pauses off screen and in a background tab, and with
 * reduced motion each piece is drawn once, finished.
 */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raf = (fn) => requestAnimationFrame(fn);

export function enhance(root = document) {
  const stops = [];
  drawCars(root);
  laneArt(root, stops);
  parade(root);
  mountDemos(root);
  markMe(root);
  stops.push(typer(root), replay(root), countdown(root), boards(root), stageRoad(root), tryIt(root));
  return () => { for (const s of stops) if (typeof s === 'function') s(); };
}

/** Every [data-car] placeholder becomes that car, in its showroom paint unless the page set one. */
export function drawCars(root) {
  for (const n of root.querySelectorAll('[data-car]')) {
    if (n.childElementCount) continue;
    const skin = n.dataset.car || 'dash';
    if (!n.style.getPropertyValue('--c')) n.style.setProperty('--c', SHOWROOM[skin] || '#B8612E');
    n.innerHTML = carSvg(skin);
  }
}

/** Run `tick(now)` every frame while `el` is on screen and the tab is visible. */
function loop(el, tick) {
  let on = false; let visible = true; let id = 0;
  const frame = (t) => { if (!on) return; tick(t); id = raf(frame); };
  const start = () => { if (on || !visible || document.hidden || !el.isConnected) return; on = true; id = raf(frame); };
  const stop = () => { on = false; cancelAnimationFrame(id); };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) start(); else stop(); }) : null;
  if (io) io.observe(el);
  const vis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', vis);
  start();
  return () => { stop(); if (io) io.disconnect(); document.removeEventListener('visibilitychange', vis); };
}

/** Split a text node's box into typed / caret / still-to-type, and a setter for the split point. */
function typeable(el, text) {
  el.textContent = '';
  const ok = document.createElement('span'); ok.className = 'ok';
  const cur = document.createElement('span'); cur.className = 'cur';
  const rest = document.createTextNode('');
  el.append(ok, cur, rest);
  let last = -1;
  return (i) => {
    i = Math.max(0, Math.min(text.length, Math.floor(i)));
    if (i === last) return;
    last = i;
    ok.textContent = text.slice(0, i);
    cur.textContent = text.slice(i, i + 1);
    rest.textContent = text.slice(i + 1);
  };
}

/* ------------------------------------------------------------------ home */

function laneArt(root, stops) {
  for (const ln of root.querySelectorAll('[data-lanes] > i')) {
    if (ln.childElementCount) continue;
    ln.innerHTML = `<span class="art-car" style="--c:${ln.dataset.paint}">${carSvg(ln.dataset.skin)}</span>`;
    const fit = () => ln.style.setProperty('--run', `${Math.max(120, ln.clientWidth - 80)}px`);
    fit();
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(fit); ro.observe(ln); stops.push(() => ro.disconnect()); }
  }
}

function parade(root) {
  const p = root.querySelector('[data-parade]');
  if (!p || p.childElementCount) return;
  p.innerHTML = Object.keys(SHOWROOM).map((id, k) => `<span class="art-car" style="--c:${SHOWROOM[id]};--k:${k}">${carSvg(id)}</span>`).join('');
}

/* ------------------------------------------------------------ paragraphs */

/** The hero card on /practice: a line from each language, typed, one after another. */
function typer(root) {
  const box = root.querySelector('[data-typer]');
  if (!box) return null;
  let list = [];
  try { list = JSON.parse(box.dataset.typer) || []; } catch (_) { return null; }
  if (!list.length) return null;
  const label = box.querySelector('.typer-lang');
  const text = box.querySelector('.typer-text');
  if (reduced()) { label.textContent = list[0].label; typeable(text, list[0].text)(list[0].text.length); return null; }
  const CHAR = 52; const HOLD = 1500;
  let k = 0; let t0 = performance.now(); let set = null;
  const show = (i) => {
    const it = list[i];
    label.textContent = it.label;
    text.setAttribute('lang', it.lang || 'en');
    set = typeable(text, it.text);
    set(0);
  };
  show(0);
  return loop(box, (now) => {
    const it = list[k];
    const t = now - t0;
    set(t / CHAR);
    if (t > it.text.length * CHAR + HOLD) { k = (k + 1) % list.length; t0 = now; show(k); }
  });
}

/* ------------------------------------------------------ the sheet, typed */

/** Characters a replay had typed `t` ms after GO, from its [[t, chars], ...] timeline. */
function ghostChars(tl, t) {
  const n = tl.length;
  if (!n || t <= 0) return 0;
  if (t >= tl[n - 1][0]) return tl[n - 1][1];
  let lo = -1; let hi = n - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tl[mid][0] <= t) lo = mid; else hi = mid; }
  const [t0, c0] = lo < 0 ? [0, 0] : tl[lo];
  const [t1, c1] = tl[hi];
  return c0 + (c1 - c0) * (t1 > t0 ? (t - t0) / (t1 - t0) : 1);
}

/**
 * The paragraph types itself at the pace of a real run: today's leader's
 * replay on /daily, the record's speed on a paragraph page, 60 words a
 * minute when nobody has set one. A car on the lane below keeps pace.
 */
function replay(root) {
  const sheet = root.querySelector('[data-replay]');
  if (!sheet) return null;
  let opts = {};
  try { opts = JSON.parse(sheet.dataset.replay) || {}; } catch (_) { /* defaults */ }
  const textEl = sheet.querySelector('.sheet-text');
  const car = sheet.querySelector('.sheet-car');
  const road = sheet.querySelector('.sheet-road');
  const wpmEl = sheet.querySelector('.sheet-wpm b');
  const text = textEl.textContent;
  const set = typeable(textEl, text);
  let wpm = Math.max(20, Math.min(220, Number(opts.wpm) || 60));
  let tl = null;
  const HOLD = 2600;
  const duration = () => (tl ? tl[tl.length - 1][0] : (text.length / 5) / wpm * 60000);
  const place = (chars, t) => {
    const f = Math.min(1, chars / text.length);
    set(chars);
    const w = road ? road.clientWidth - car.offsetWidth - 14 : 0;
    if (car) car.style.transform = `translate3d(${(Math.max(0, w) * f).toFixed(1)}px,0,0)`;
    if (wpmEl) wpmEl.textContent = t > 900 ? String(Math.round((chars / 5) / (t / 60000))) : wpmEl.textContent;
    sheet.classList.toggle('moving', f > 0 && f < 1);
  };
  if (reduced()) { place(text.length * 0.62, 60000); if (wpmEl) wpmEl.textContent = String(Math.round(wpm)); return null; }
  if (opts.daily) {
    fetch('/api/daily', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (d && d.leaderGhost && Array.isArray(d.leaderGhost.timeline) && d.leaderGhost.timeline.length > 1 && d.passage && d.passage.text === text) tl = d.leaderGhost.timeline;
    }).catch(() => {});
  }
  let t0 = null;
  return loop(sheet, (now) => {
    if (t0 == null) t0 = now + 500;
    let t = now - t0;
    if (t < 0) { place(0, 0); return; }
    const dur = duration();
    if (t > dur + HOLD) { t0 = now + 400; t = 0; if (wpmEl) wpmEl.textContent = '0'; }
    const tt = Math.min(t, dur);
    const chars = tl ? ghostChars(tl, tt) : (tt / 60000) * wpm * 5;
    place(chars, Math.max(tt, 1));
  });
}

/* ------------------------------------------------------------------ today */

function countdown(root) {
  const el = root.querySelector('[data-countdown]');
  if (!el) return null;
  const end = Number(el.dataset.countdown);
  const b = el.querySelector('b');
  const put = () => {
    const ms = Math.max(0, end - Date.now());
    const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000); const s = Math.floor((ms % 60000) / 1000);
    b.textContent = ms <= 0 ? 'a moment' : h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m ${String(s).padStart(2, '0')}s`;
  };
  put();
  const id = setInterval(put, 1000);
  return () => clearInterval(id);
}

/* --------------------------------------------------------------- rankings */

/** Rows and podium places that are you get marked (the game keeps your id in this browser). */
function markMe(root) {
  const { id } = cachedProfile();
  if (!id) return;
  for (const n of root.querySelectorAll('.lane-row[data-id], .pd[data-id]')) if (n.dataset.id === id) n.classList.add('me');
}

/** Tabs over the boards; a board's cars roll out to their places when it opens. */
function boards(root) {
  const cleanups = [];
  const lists = [...root.querySelectorAll('.lanes')];
  const measure = () => { for (const l of lists) { const road = l.querySelector('.lr-road'); if (road && road.clientWidth) l.style.setProperty('--lane-w', `${road.clientWidth}px`); } };
  lists.forEach((l) => [...l.children].forEach((li, i) => li.style.setProperty('--n', String(Math.min(i, 12)))));
  const roll = (list) => {
    if (!list || reduced()) return;
    list.classList.remove('rolling'); void list.offsetWidth; list.classList.add('rolling');
    setTimeout(() => list.classList.remove('rolling'), 1800);
  };
  measure();
  if ('ResizeObserver' in window && lists.length) {
    const ro = new ResizeObserver(measure);
    for (const l of lists) ro.observe(l);
    cleanups.push(() => ro.disconnect());
  }
  const wrap = root.querySelector('[data-tabs]');
  if (wrap) {
    const tabs = [...wrap.querySelectorAll('[role="tab"]')];
    const select = (tab, focus = false) => {
      for (const t of tabs) {
        const on = t === tab;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = root.querySelector(`#${t.getAttribute('aria-controls')}`);
        if (panel) panel.hidden = !on;
      }
      if (focus) tab.focus();
      measure();
      roll(root.querySelector(`#${tab.getAttribute('aria-controls')} .lanes`));
    };
    wrap.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t) select(t); });
    wrap.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const to = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : e.key === 'Home' ? tabs[0] : e.key === 'End' ? tabs[tabs.length - 1] : null;
      if (to) { e.preventDefault(); select(to, true); }
    });
  }
  // the first open board rolls out once the page has arrived
  const first = lists.find((l) => !l.closest('[hidden]'));
  const t = setTimeout(() => roll(first), 500);
  cleanups.push(() => clearTimeout(t));
  return () => cleanups.forEach((f) => f());
}

/* ------------------------------------------------------------------ a set */

/** The car drives the stage road from New to the hardest stage, once. */
function stageRoad(root) {
  const road = root.querySelector('[data-stage-road]');
  if (!road) return null;
  const car = road.querySelector('.sr-car');
  const track = road.querySelector('.sr-track');
  const go = () => car.style.setProperty('--x', `${Math.max(0, track.clientWidth - car.offsetWidth - 30)}px`);
  if (reduced()) { go(); return null; }
  const t = setTimeout(go, 650);
  const onResize = () => { if (car.style.getPropertyValue('--x')) go(); };
  window.addEventListener('resize', onResize);
  return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
}

/* ------------------------------------------------------------ how to play */

const WORDS = ['race', 'type', 'fast', 'finish', 'nitro'];

/** Type the word; each right letter moves the car, a wrong one turns red. */
function tryIt(root) {
  const box = root.querySelector('[data-tryit]');
  if (!box) return null;
  const input = box.querySelector('.tryit-input');
  const wordEl = box.querySelector('.tryit-word');
  const ask = box.querySelector('.tryit-ask b');
  const done = box.querySelector('.tryit-done');
  const car = box.querySelector('.tryit-car');
  const road = box.querySelector('.tryit-road');
  const label = box.querySelector('.tryit-field .sr-only');
  let w = 0; let word = WORDS[0]; let timer = 0;
  const setWord = (next) => {
    word = next;
    wordEl.innerHTML = [...word].map((c) => `<i>${c}</i>`).join('');
    if (ask) ask.textContent = word;
    if (label) label.textContent = `Type the word ${word}`;
    input.value = '';
    input.maxLength = word.length + 4;
    paint();
  };
  const paint = () => {
    const v = input.value.toLowerCase();
    let right = 0;
    while (right < v.length && v[right] === word[right]) right++;
    [...wordEl.children].forEach((n, i) => {
      n.className = i < right ? 'ok' : i < v.length ? 'bad' : '';
      if (i === v.length && document.activeElement === input) n.classList.add('cur');
    });
    const max = Math.max(0, road.clientWidth - car.offsetWidth - 12);
    car.style.setProperty('--x', `${(max * (right / word.length)).toFixed(1)}px`);
    box.classList.toggle('go', right > 0);
    if (right === word.length && v.length === word.length) {
      done.textContent = 'That is the whole game. Now race real people.';
      clearTimeout(timer);
      timer = setTimeout(() => { done.textContent = ''; setWord(WORDS[++w % WORDS.length]); car.style.setProperty('--x', '0px'); }, 2600);
    }
  };
  const onInput = () => { if (!timer || !done.textContent) paint(); };
  input.addEventListener('input', onInput);
  input.addEventListener('focus', paint);
  input.addEventListener('blur', paint);
  setWord(word);
  return () => { clearTimeout(timer); input.removeEventListener('input', onInput); };
}
