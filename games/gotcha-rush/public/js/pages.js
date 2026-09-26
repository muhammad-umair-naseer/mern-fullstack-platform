import { escapeHtml } from './ui.js';
import { flag } from './countries.js';

/**
 * Renderers for the content pages. Each takes the elements it draws into and
 * plain data, so main.js stays the one place that owns state. Entrances are
 * CSS animations on the rendered markup: a page's animations restart by
 * themselves whenever the router shows it again.
 */

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function tween(node, to, { ms = 650, format = (v) => v.toLocaleString() } = {}) {
  const from = Number(node.dataset.v ?? String(node.textContent).replace(/[^\d.-]/g, '')) || 0;
  node.dataset.v = String(to);
  if (reducedMotion() || from === to) { node.textContent = format(to); return; }
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    node.textContent = format(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ------------------------------------------------------------ how it works */

const STEP_OF = { 'p-code': 'code', 'p-answer': 'answer', 'p-locked': 'locked', 'p-reveal': 'reveal' };

/** The steps list follows the demo: the active step lights up and its rule fills for as long as the phase lasts. */
export function stepNarrator(list) {
  const items = [...list.querySelectorAll('li[data-step]')];
  const order = items.map((li) => li.dataset.step);
  return (phase, ms) => {
    const step = STEP_OF[phase];
    if (!step) { if (phase === 'p-out') items.forEach((li) => li.classList.remove('on', 'done')); return; }
    const at = order.indexOf(step);
    items.forEach((li, i) => {
      li.classList.toggle('done', i < at);
      const on = i === at;
      if (on && !li.classList.contains('on')) {
        li.style.setProperty('--dur', `${Math.max(300, ms || 1000)}ms`);
        li.classList.remove('on');
        void li.offsetWidth;
      }
      li.classList.toggle('on', on);
    });
  };
}

/**
 * Scoring, live: the controls feed the same shared/scoring.js the server uses,
 * the equation shows each term and the bar stacks them on a common scale.
 */
export function initScoring(root) {
  const S = window.GotchaScoring;
  if (!S || !root) return;
  const { RULES } = S;
  const $ = (id) => root.querySelector(`#${id}`);
  const inp = { diff: $('sc-diff'), time: $('sc-time'), combo: $('sc-combo'), first: $('sc-first'), life: $('sc-life') };
  const out = { diffV: $('sc-diff-v'), timeV: $('sc-time-v'), comboV: $('sc-combo-v'), num: $('score-num'), eq: $('score-formula') };
  const segs = Object.fromEntries([...root.querySelectorAll('.score-bar .seg')].map((s) => [s.classList[1], s]));
  const maxBase = RULES.BASE_MIN + RULES.BASE_PER_DIFF * 5;
  const MAX = Math.round(maxBase * (1 + RULES.SPEED_BONUS) * (1 + RULES.COMBO_STEP * RULES.COMBO_CAP) + RULES.FIRST_BONUS);

  const term = (v, label, cls) => `<span class="term ${cls}"><b>${v}</b><small>${label}</small></span>`;
  const op = (s) => `<span class="op">${s}</span>`;

  function update() {
    for (const r of [inp.diff, inp.time, inp.combo]) r.style.setProperty('--fill', `${((r.value - r.min) / (r.max - r.min)) * 100}%`);
    const difficulty = Number(inp.diff.value);
    const secs = Number(inp.time.value);
    const streak = Number(inp.combo.value) - 1;   // "combo ×3" in a match means two right answers before this one
    const first = inp.first.checked;
    const lifeline = inp.life.checked;
    const r = S.roundPoints({ difficulty, full: true, correctLines: 1, totalLines: 1, answered: true, msLeft: secs * 1000, roundMs: RULES.ROUND_MS, comboBefore: streak, first, lifeline });
    const whole = S.roundPoints({ difficulty, full: true, correctLines: 1, totalLines: 1, answered: true, msLeft: secs * 1000, roundMs: RULES.ROUND_MS, comboBefore: streak, first, lifeline: false });
    const base = r.base;
    const speed = r.bonus.speed;
    const mult = r.bonus.combo;
    const firstPts = r.bonus.first;
    const beforeFirst = whole.points - firstPts;
    const comboExtra = beforeFirst - base - speed;

    out.diffV.textContent = difficulty;
    out.timeV.textContent = `${secs}s`;
    out.comboV.textContent = `×${streak + 1}`;
    tween(out.num, r.points, { ms: 420 });

    // the bar: each term on one scale, halved (with the lost half ghosted) under a lifeline
    const k = lifeline ? RULES.LIFELINE_FACTOR : 1;
    let x = 0;
    for (const [name, v] of [['base', base], ['speed', speed], ['combo', comboExtra], ['first', firstPts]]) {
      const w = (v * k) / MAX;
      segs[name].style.transform = `translateX(${(x * 100).toFixed(3)}%) scaleX(${w.toFixed(4)})`;
      x += w;
    }
    const lost = lifeline ? (whole.points - r.points) / MAX : 0;
    segs.lost.style.transform = `translateX(${(x * 100).toFixed(3)}%) scaleX(${lost.toFixed(4)})`;

    let eq = `${op('(')}${term(base, 'base', 'base')}${op('+')}${term(speed, 'speed', 'speed')}${op(')')}`;
    if (mult !== 1) eq += `${op('×')}${term(mult.toFixed(2), 'combo', 'combo')}`;
    if (firstPts) eq += `${op('+')}${term(firstPts, 'first', 'first')}`;
    if (lifeline) eq += `${op('×')}${term('½', 'lifeline', 'lost')}`;
    eq += `${op('=')}${term(r.points, 'points', 'total')}`;
    out.eq.innerHTML = eq;
  }
  root.addEventListener('input', update);
  root.addEventListener('change', update);
  update();
}

/** Solo Rush: one bar per round, as long as that round's clock. */
export function renderRushChart(root) {
  const S = window.GotchaScoring;
  if (!S || !root) return;
  const rounds = 15;
  const bars = [];
  for (let r = 1; r <= rounds; r++) {
    const s = S.rushRoundMs(r) / 1000;
    const tag = r === 1 || r === rounds ? `<em>${s}s</em>` : '';
    bars.push(`<span class="rb${s === S.RULES.RUSH_ROUND_MIN_MS / 1000 ? ' floor' : ''}" style="--h:${(s / 40).toFixed(3)};--i:${r - 1}"><i></i>${tag}<small>${r}</small></span>`);
  }
  root.innerHTML = `<div class="rush-bars">${bars.join('')}</div><div class="rush-axis"><span>Round</span></div>`;
}

/* --------------------------------------------------------------- progress */

/**
 * The level road: titles above the line, avatar unlocks below, you on it.
 * Early levels come quickly, so the road is drawn on a square-root scale to
 * give them room.
 */
export function renderLevelRoad(root, { level, frac, titles, avatars, me }) {
  const MAX = titles[titles.length - 1][0];
  const at = (l) => Math.sqrt((Math.min(Math.max(l, 1), MAX) - 1) / (MAX - 1)) * 100;
  const you = at(Math.min(MAX, level + frac));
  const stops = titles.map(([l, name], i) => `
    <div class="road-stop t ${l <= level ? 'got' : ''} ${i % 2 ? 'hi' : 'lo'}${i === 0 ? ' first' : ''}${i === titles.length - 1 ? ' last' : ''}" style="--x:${at(l).toFixed(2)}%"><i></i><span class="road-label"><b>${escapeHtml(name)}</b><small>Lv ${l}</small></span></div>`).join('');
  const unlocks = avatars.filter((a) => a.unlock > 1).map((a) => `
    <div class="road-stop a ${a.unlock <= level ? 'got' : ''}" style="--x:${at(a.unlock).toFixed(2)}%;--c:${a.color}" title="${escapeHtml(a.name)} · level ${a.unlock}"><span class="road-av">${a.emoji}</span></div>`).join('');
  root.innerHTML = `
    <div class="road-track"><i class="road-fill" style="--to:${(you / 100).toFixed(4)}"></i></div>
    ${stops}${unlocks}
    <div class="road-rail" style="--x:${you.toFixed(2)}%"><span class="road-you" style="--c:${me.color}">${me.emoji}</span></div>`;
  root.setAttribute('aria-label', `Level road: level ${level} of ${MAX}, next title at level ${(titles.find(([l]) => l > level) || [MAX])[0]}`);
}

/** On a narrow screen the road scrolls sideways; bring your marker into view. */
export function centerRoad(wrap) {
  const you = wrap.querySelector('.road-you');
  if (!you || wrap.scrollWidth <= wrap.clientWidth) return;
  const x = you.getBoundingClientRect().left - wrap.getBoundingClientRect().left + wrap.scrollLeft;
  wrap.scrollLeft = Math.max(0, x - wrap.clientWidth * 0.35);
}

/* ----------------------------------------------------------- achievements */

/** How far along each countable achievement is, from the profile the server sends. */
const PROGRESS = {
  first_match: (p) => [p.matches, 1],
  first_win: (p) => [p.wins, 1],
  podium_5: (p) => [p.podiums, 5],
  combo_5: (p) => [p.bestCombo, 5],
  combo_10: (p) => [p.bestCombo, 10],
  solved_25: (p) => [p.correct, 25],
  solved_100: (p) => [p.correct, 100],
  solved_500: (p) => [p.correct, 500],
  js_20: (p) => [p.langs?.js?.correct || 0, 20],
  py_20: (p) => [p.langs?.py?.correct || 0, 20],
  polyglot: (p) => [Math.min(10, p.langs?.js?.correct || 0) + Math.min(10, p.langs?.py?.correct || 0), 20],
  rush_1000: (p) => [p.bestRush, 1000],
  rush_5000: (p) => [p.bestRush, 5000],
  points_10k: (p) => [p.points, 10000],
  points_50k: (p) => [p.points, 50000],
  streak_3: (p) => [p.streak, 3],
  streak_7: (p) => [p.streak, 7],
  streak_30: (p) => [p.streak, 30],
  friendly_5: (p) => [p.friendlies, 5],
  rival_win_5: (p) => [Math.max(0, ...(p.rivals || []).map((r) => r.w || 0)), 5],
};
const ARC = 2 * Math.PI * 21;   // tile ring, r = 21
const BIG_ARC = 2 * Math.PI * 54;

function progressOf(a, profile) {
  const f = PROGRESS[a.id];
  if (!f) return null;
  const [cur, need] = f(profile);
  const n = Math.max(0, Number(cur) || 0);
  return { cur: Math.min(n, need), need, frac: Math.min(1, n / need) };
}

export function renderAchievements({ grid, next, arc, count, catalogue, have, profile }) {
  if (!catalogue.length) { grid.innerHTML = '<div class="board-empty small">Loading…</div>'; return; }
  const total = catalogue.length;
  const got = catalogue.filter((a) => have.has(a.id)).length;
  count.textContent = `${got}/${total}`;
  arc.style.setProperty('--off', (BIG_ARC * (1 - got / total)).toFixed(2));
  const cols = 5;
  grid.innerHTML = catalogue.map((a, i) => {
    const earned = have.has(a.id);
    const p = earned ? { frac: 1 } : progressOf(a, profile);
    const off = p ? ARC * (1 - p.frac) : ARC;
    const status = earned ? 'earned' : p ? `${p.cur.toLocaleString()} of ${p.need.toLocaleString()}` : 'locked';
    return `<div class="ach ${earned ? 'got' : ''}" role="listitem" tabindex="0" style="--i:${(i % cols) + Math.floor(i / cols)};--off:${off.toFixed(2)}" aria-label="${escapeHtml(`${a.name}: ${a.desc}. ${status[0].toUpperCase()}${status.slice(1)}.`)}" title="${escapeHtml(a.desc)}">
      <span class="ach-icon"><svg class="ach-arc" viewBox="0 0 48 48" aria-hidden="true"><circle class="t" cx="24" cy="24" r="21"/>${p ? '<circle class="a" cx="24" cy="24" r="21"/>' : ''}</svg><span class="ach-emoji" aria-hidden="true">${a.icon}</span></span>
      <span class="ach-name" aria-hidden="true">${escapeHtml(a.name)}</span>
      <span class="ach-desc" aria-hidden="true">${escapeHtml(a.desc)}</span>
      ${!earned && p ? `<span class="ach-prog" aria-hidden="true">${p.cur.toLocaleString()}/${p.need.toLocaleString()}</span>` : ''}
    </div>`;
  }).join('');
  grid.setAttribute('role', 'list');

  // the three locked ones you are closest to
  const near = catalogue.filter((a) => !have.has(a.id)).map((a) => ({ a, p: progressOf(a, profile) })).filter((x) => x.p)
    .sort((x, y) => y.p.frac - x.p.frac || x.p.need - y.p.need).slice(0, 3);
  next.innerHTML = near.length ? `<h2>Closest</h2>${near.map(({ a, p }, i) => `
    <div class="near" style="--i:${i}"><span class="near-ic" aria-hidden="true">${a.icon}</span><span class="near-t"><b>${escapeHtml(a.name)}</b><span class="near-bar"><i style="--f:${p.frac.toFixed(3)}"></i></span></span><span class="near-n">${p.cur.toLocaleString()}/${p.need.toLocaleString()}</span></div>`).join('')}` : '';
}

/* ------------------------------------------------------------------ rivals */

const monogram = (name) => escapeHtml((String(name || '?').trim()[0] || '?').toUpperCase());

export function renderRivals({ hero, list, rivals, me }) {
  const meSide = `<div class="vs-side vs-me"><span class="vs-av" style="--c:${me.color}">${me.emoji}</span><span class="vs-name">${escapeHtml(me.name)}</span></div>`;
  if (!rivals.length) {
    hero.className = 'versus empty';
    hero.innerHTML = `${meSide}<div class="vs-mid"><span class="vs-x">vs</span></div><div class="vs-side vs-them"><span class="vs-av ghost">?</span><span class="vs-name">Your first rival</span></div>`;
    list.innerHTML = `<div class="rivals-empty"><p>No rivals yet. Play someone in a private room and the head-to-head starts itself.</p><a class="btn primary" href="/play-with-friends">Create a room</a></div>`;
    return;
  }
  const top = rivals[0];
  const lead = top.w > top.l ? 'up' : top.w < top.l ? 'down' : '';
  const bal = (r) => (r.w + r.l ? (r.w - r.l) / (r.w + r.l) : 0);
  hero.className = `versus ${lead}`;
  hero.innerHTML = `${meSide}
    <div class="vs-mid"><span class="vs-score" aria-label="${top.w} wins, ${top.l} losses"><b>${top.w}</b><i>–</i><b>${top.l}</b></span><span class="vs-sub">${plural(top.n, 'match')}</span>
      <span class="tug big" style="--b:${bal(top).toFixed(3)}" aria-hidden="true"><i class="tug-fill"></i><i class="tug-knot"></i></span></div>
    <div class="vs-side vs-them"><span class="vs-av mono">${monogram(top.name)}<small>${flag(top.country)}</small></span><span class="vs-name">${escapeHtml(top.name)}</span></div>`;
  list.innerHTML = rivals.map((r, i) => {
    const cls = r.w > r.l ? 'up' : r.w < r.l ? 'down' : '';
    return `<div class="rival ${cls}" style="--i:${i}">
      <span class="rival-av" aria-hidden="true">${monogram(r.name)}</span>
      <span class="b-name">${flag(r.country)} ${escapeHtml(r.name)}</span>
      <span class="tug" style="--b:${bal(r).toFixed(3)}" aria-hidden="true"><i class="tug-fill"></i><i class="tug-knot"></i></span>
      <span class="rival-score ${cls}" aria-label="${r.w} wins, ${r.l} losses"><b>${r.w}</b>–<b>${r.l}</b></span>
      <span class="rival-n">${plural(r.n, 'match')}</span>
    </div>`;
  }).join('');
}

/* -------------------------------------------------------- play with friends */

/** The code field is one real input laid over five letter boxes. */
export function codeSlots(wrap) {
  const input = wrap.querySelector('input');
  const boxes = [...wrap.querySelectorAll('span')];
  const paint = () => {
    const v = input.value.toUpperCase();
    const focused = document.activeElement === input;
    boxes.forEach((b, i) => {
      b.textContent = v[i] || '';
      b.classList.toggle('filled', !!v[i]);
      b.classList.toggle('caret', focused && i === Math.min(v.length, boxes.length - 1) && v.length < boxes.length);
    });
    wrap.classList.toggle('full', v.length >= boxes.length);
  };
  input.addEventListener('input', paint);
  input.addEventListener('focus', paint);
  input.addEventListener('blur', paint);
  paint();
  return paint;
}

/** The lobby card over the photo: seats fill one by one, the host can start, then the room empties and it plays again. */
export function renderLobby(root, avatars) {
  const seats = root.querySelector('.lobby-seats');
  seats.innerHTML = avatars.map((a, i) => `<span class="seat" style="--c:${a.color};--i:${i}"><span>${a.emoji}</span></span>`).join('');
  if (root.dataset.loop) return;
  root.dataset.loop = '1';
  const count = root.querySelector('.lobby-count b');
  let n = 0;
  let timer = 0;
  let visible = false;
  const show = (k) => {
    [...seats.children].forEach((s, i) => s.classList.toggle('on', i < k));
    count.textContent = k;
    root.classList.toggle('ready', k >= 2);
  };
  const step = () => {
    clearTimeout(timer);
    if (!visible) return;
    if (reducedMotion()) { show(seats.children.length); return; }
    n = n >= seats.children.length ? 0 : n + 1;
    show(n);
    timer = setTimeout(step, n === 0 ? 900 : n === seats.children.length ? 2600 : 720);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) { n = 0; show(0); timer = setTimeout(step, 900); } else clearTimeout(timer);
  }).observe(root);
}

/** A few blocks reveal once as they scroll into view; everything above the fold arrives with the page. */
export function observeReveals(root = document) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.dataset.inview = 'true';
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
  root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
