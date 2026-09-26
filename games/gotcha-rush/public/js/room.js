import { avatarFor } from './avatars.js';
import { highlightLines } from './highlight.js';
import { flag } from './countries.js';
import { escapeHtml } from './ui.js';

/**
 * The home page's live room: five players around one snippet. Answers lock
 * in one by one, the real output lands, the result ripples out from the
 * snippet to each seat, and the standings strip reshuffles.
 *
 * How it works runs a different picture on purpose (one player's round, step
 * by step, in an editor). This one is the room. It only runs while on screen;
 * with reduced motion it shows one finished round and holds still.
 */

// every `out` is what the real runtime prints; answers are [you, s1, s2, s3, s4]
const ROUNDS = [
  { lang: 'js', code: 'console.log(0.1 + 0.2 === 0.3);', out: 'false', answers: ['false', 'true', 'false', 'false', 'true'], order: [2, 0, 3, 1, 4] },
  { lang: 'py', code: 'print("5" * 3)', out: '555', answers: ['555', '15', '555', 'error', '555'], order: [0, 4, 2, 1, 3] },
  { lang: 'js', code: 'console.log(typeof NaN);', out: 'number', answers: ['number', 'NaN', 'number', 'number', 'undefined'], order: [3, 0, 1, 2, 4] },
  { lang: 'py', code: 'x = [0] * 3\nprint(x)', out: '[0, 0, 0]', answers: ['[0, 0, 0]', '[0, 0, 0]', '[0]', '0', '[0, 0, 0]'], order: [1, 0, 4, 3, 2] },
];

// seat centres in % of the room; the bubble opens toward open space
const SEATS = [
  { x: 50, y: 88, side: 'r' },
  { x: 11, y: 15, side: 'r' },
  { x: 89, y: 11, side: 'l' },
  { x: 93, y: 63, side: 'bl' },
  { x: 7, y: 66, side: 'br' },
];
const CAST = [
  { name: 'Kenji', country: 'JP' },
  { name: 'Luísa', country: 'BR' },
  { name: 'Jonas', country: 'DE' },
  { name: 'Maya', country: 'US' },
];
const CAST_AVATARS = ['fox', 'alien', 'robot', 'ghost', 'bug', 'bolt'];
const CENTER = { x: 50, y: 46 };
const RIPPLE_MS = 1100;

const LOCK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.6" fill="currentColor"/><path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

export function createRoom(host, { avatar = 'bolt', country = 'UN' } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const people = [{ name: 'You', country, avatar }, ...CAST.map((c) => ({ ...c }))];
  const castAvatars = (me) => CAST_AVATARS.filter((a) => a !== me).slice(0, 4);
  castAvatars(avatar).forEach((a, i) => { people[i + 1].avatar = a; });

  host.innerHTML = `<div class="room">
      <div class="room-floor"><i></i></div>
      <div class="room-ripple"><i></i></div>
      <div class="room-card">
        <div class="rc-head"><span class="rc-dot"></span><span class="rc-file">main.js</span><span class="rc-round">Round <b>1</b> of ${ROUNDS.length}</span></div>
        <span class="rc-clock"><i></i></span>
        <pre class="rc-code"></pre>
        <div class="rc-out"><span class="rc-prompt">›</span><span class="rc-out-text"></span></div>
      </div>
      ${SEATS.map((s, i) => `<div class="rs${i === 0 ? ' me' : ''}" data-side="${s.side}" style="--x:${s.x}%;--y:${s.y}%;--i:${i}">
        <span class="rs-av"><span class="rs-emoji"></span><i class="rs-lock">${LOCK_SVG}</i></span>
        <span class="rs-name"></span>
        <span class="rs-bubble"><code></code></span>
        <span class="rs-pts"></span>
      </div>`).join('')}
    </div>
    <ol class="room-board">${people.map((_, i) => `<li style="--slot:${i}"><b class="rb-rank">${i + 1}</b><span class="rb-av"></span><span class="rb-name"></span><span class="rb-score">0</span></li>`).join('')}</ol>`;

  const root = host.querySelector('.room');
  const q = (s) => root.querySelector(s);
  const parts = {
    file: q('.rc-file'), dot: q('.rc-dot'), round: q('.rc-round b'), code: q('.rc-code'), out: q('.rc-out-text'),
    ripple: q('.room-ripple'), seats: [...root.querySelectorAll('.rs')], rows: [...host.querySelectorAll('.room-board li')],
  };
  const scores = people.map(() => 0);
  let idx = 0;
  let timers = [];
  let visible = false;
  let running = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const stop = () => { timers.forEach(clearTimeout); timers = []; };

  function paintPeople() {
    people.forEach((p, i) => {
      const a = avatarFor(p.avatar);
      const seat = parts.seats[i];
      seat.style.setProperty('--c', a.color);
      seat.querySelector('.rs-emoji').textContent = a.emoji;
      seat.querySelector('.rs-name').innerHTML = `<span class="rs-flag">${flag(p.country)}</span>${escapeHtml(p.name)}`;
      const row = parts.rows[i];
      row.style.setProperty('--c', a.color);
      row.classList.toggle('me', i === 0);
      row.querySelector('.rb-av').textContent = a.emoji;
      row.querySelector('.rb-name').textContent = p.name;
    });
  }

  function tween(node, from, to, ms = 700) {
    if (reduced || from === to) { node.textContent = to.toLocaleString(); return; }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      node.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))).toLocaleString();
      if (k < 1 && visible) requestAnimationFrame(step);
      else node.textContent = to.toLocaleString();
    };
    requestAnimationFrame(step);
  }

  /** Standings: each row slides to its new slot; ranks follow. */
  function standings(before) {
    const order = people.map((_, i) => i).sort((a, b) => scores[b] - scores[a] || a - b);
    order.forEach((who, slot) => {
      const row = parts.rows[who];
      row.style.setProperty('--slot', slot);
      row.querySelector('.rb-rank').textContent = slot + 1;
      row.classList.toggle('lead', slot === 0 && scores[who] > 0);
      tween(row.querySelector('.rb-score'), before[who], scores[who]);
    });
  }

  function fill(r) {
    parts.file.textContent = r.lang === 'js' ? 'main.js' : 'main.py';
    parts.dot.className = `rc-dot ${r.lang}`;
    parts.round.textContent = (idx % ROUNDS.length) + 1;
    parts.code.innerHTML = highlightLines(r.code, r.lang).map((html, i) => `<span class="rl"><span style="--i:${i}">${html}</span></span>`).join('');
    parts.out.textContent = r.out;
    parts.seats.forEach((s, i) => {
      s.classList.remove('locked', 'right', 'wrong');
      s.querySelector('.rs-bubble code').textContent = r.answers[i];
      s.querySelector('.rs-pts').textContent = '';
    });
  }

  /** When the ripple, easing out from the snippet, reaches each seat. */
  function arrivals() {
    const box = root.getBoundingClientRect();
    const w = box.width || 560;
    const h = box.height || 460;
    const radius = 0.56 * w;   // half the ripple's width (112% of the room)
    return SEATS.map((s) => {
      const d = Math.hypot(((s.x - CENTER.x) / 100) * w, ((s.y - CENTER.y) / 100) * h);
      const p = Math.min(1, d / radius);
      return (1 - Math.cbrt(1 - p)) * RIPPLE_MS;   // inverse of ease-out cubic
    });
  }

  function verdict(r, i, rank) {
    const seat = parts.seats[i];
    const right = r.answers[i] === r.out;
    seat.classList.add(right ? 'right' : 'wrong');
    if (!right) return 0;
    const pts = 420 - rank * 45;
    seat.querySelector('.rs-pts').textContent = `+${pts}`;
    return pts;
  }

  function round() {
    stop();
    if (!visible) { running = false; return; }
    running = true;
    if (idx > 0 && idx % ROUNDS.length === 0) {   // a new match: the table resets
      const before = [...scores];
      scores.fill(0);
      standings(before);
    }
    const r = ROUNDS[idx % ROUNDS.length];
    root.className = 'room';
    fill(r);

    if (reduced) {
      r.order.forEach((i) => parts.seats[i].classList.add('locked'));
      const before = [...scores];
      r.order.forEach((i, rank) => { scores[i] += verdict(r, i, rank); });
      root.className = 'room playing revealed';
      standings(before);
      return;   // hold still
    }

    void root.offsetWidth;
    root.classList.add('playing');
    r.order.forEach((i, k) => later(() => parts.seats[i].classList.add('locked'), 950 + k * 500 + (k % 2) * 90));
    const revealAt = 950 + r.order.length * 500 + 250;
    later(() => root.classList.add('revealed'), revealAt);
    later(() => {
      parts.ripple.classList.remove('go');
      void parts.ripple.offsetWidth;
      parts.ripple.classList.add('go');
      const at = arrivals();
      const before = [...scores];
      r.order.forEach((i, rank) => later(() => { scores[i] += verdict(r, i, rank); }, at[i]));
      later(() => standings(before), RIPPLE_MS + 150);
    }, revealAt + 380);
    later(() => root.classList.add('out'), revealAt + 3300);
    later(() => { idx++; round(); }, revealAt + 3700);
  }

  paintPeople();

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !running) round();
    else if (!visible) { stop(); running = false; }
  }).observe(host);

  return {
    /** Your seat shows your avatar and flag. */
    setMe({ avatar: a = people[0].avatar, country: c = people[0].country } = {}) {
      people[0].avatar = a;
      people[0].country = c;
      castAvatars(a).forEach((id, i) => { people[i + 1].avatar = id; });
      paintPeople();
    },
  };
}
