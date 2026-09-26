import { carSvg } from './cars.js';
import { flag } from './countries.js';
import { cxAuth } from './cx-auth.js';

/**
 * The race itself, on a loop: the home page's hero (and the game's own home).
 *
 * A room fills up, the start lights count down, four cars race to the
 * checkered line, one of them boosts past the leader at the end, and the
 * places come up. There is no paragraph here on purpose: How to play is the
 * page that teaches the typing; this one shows what the typing is for.
 *
 * Mounts on every [data-td-demo] element. Decoration only (aria-hidden).
 * Pauses off screen and in a background tab; with reduced motion it draws
 * the finished race, once.
 */
const GO = 3350;                    // lights out
const LIGHTS = [2000, 2450, 2900];  // each red light comes on
const HOLD = 2600;                  // the results stay up this long
const OUT = 420;                    // then everything fades before the next race
const ROOM = 'K7QX';

// finish = ms after GO. `shape` is how each one paces the race: the story is
// Leo off the line, Mei through the middle, you on the boost at the end.
const RACERS = [
  { name: 'You', paint: '#B8612E', skin: 'bolt', me: true, join: 0, finish: 5600, shape: 'late', wpm: 92 },
  { name: 'Mei', flag: '🇯🇵', paint: '#4E7152', skin: 'hatch', join: 520, finish: 5780, shape: 'even', wpm: 86 },
  { name: 'Leo', flag: '🇧🇷', paint: '#8E3B35', skin: 'muscle', join: 1040, finish: 6380, shape: 'early', wpm: 79 },
  { name: 'Ana', flag: '🇵🇹', paint: '#3E6A82', skin: 'dash', join: 1480, finish: 6940, shape: 'wave', wpm: 72 },
];
const SEATS = 5;
const PLACE = ['1st', '2nd', '3rd', '4th'];
const NITRO = [0.6, 0.84];          // fraction of your race spent on the boost

const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** How fast a racer is going at `t` ms after GO (relative units). */
function speed(r, t) {
  const T = r.finish;
  const ramp = smooth(0, r.shape === 'early' ? 420 : 760, t);
  let v = 1;
  if (r.shape === 'late') v = t > NITRO[0] * T && t < NITRO[1] * T ? 1.95 : 0.96;
  else if (r.shape === 'early') v = 1.4 - 0.62 * (t / T);
  else if (r.shape === 'even') v = 1 + 0.07 * Math.sin(t / 520);
  else v = 1 + 0.09 * Math.sin(t / 610 + 1.3);
  return Math.max(0.05, ramp * v);
}

/** Distance covered as a fraction of the lane, sampled every 40 ms and normalised to 1 at the finish. */
function course(r) {
  const step = 40;
  const n = Math.ceil(r.finish / step);
  const table = new Float32Array(n + 1);
  for (let i = 1; i <= n; i++) table[i] = table[i - 1] + speed(r, i * step) * step;
  const total = table[n];
  for (let i = 0; i <= n; i++) table[i] /= total;
  return (t) => {
    if (t <= 0) return 0;
    if (t >= r.finish) return 1;
    const x = t / step; const i = Math.floor(x);
    return table[i] + (table[Math.min(n, i + 1)] - table[i]) * (x - i);
  };
}

function laneHtml(r, i) {
  return `<div class="tdr-lane${r.me ? ' me' : ''}" style="--c:${r.paint};--i:${i}">
    <span class="tdr-who"><b class="tdr-pos"></b><span class="tdr-flag">${r.flag}</span><span class="tdr-name">${r.name}</span></span>
    <div class="tdr-road"><i class="tdr-grid"></i><i class="tdr-fin"></i><div class="tdr-car"><div class="tdr-body">${carSvg(r.skin)}</div><i class="tdr-streak"></i><div class="tdr-fx"></div></div></div>
    <span class="tdr-val"><b class="tdr-wpm"></b><em class="tdr-place"></em></span>
  </div>`;
}

function mount(root) {
  if (root.dataset.tdMounted) return;
  root.dataset.tdMounted = '1';
  root.setAttribute('aria-hidden', 'true');
  root.classList.add('tdr');
  const you = cxAuth.state.country;
  const racers = RACERS.map((r) => ({ ...r, flag: r.me ? flag(you && you !== 'UN' ? you : 'PK') : r.flag, at: course(r) }));
  root.innerHTML = `
    <div class="tdr-head">
      <span class="tdr-room"><i class="tdr-dot"></i>Room <b>${ROOM}</b></span>
      <span class="tdr-seats">${Array.from({ length: SEATS }, (_, k) => `<i class="tdr-seat" style="--k:${k}">${racers[k] ? racers[k].flag : ''}</i>`).join('')}<b class="tdr-count">0/${SEATS}</b></span>
    </div>
    <div class="tdr-track">
      <div class="tdr-lights"><i></i><i></i><i></i><b>Go</b></div>
      ${racers.map(laneHtml).join('')}
    </div>
    <div class="tdr-foot"><span class="tdr-status">Waiting for racers</span><span class="tdr-clock">0:00.0</span></div>`;

  const lanes = [...root.querySelectorAll('.tdr-lane')].map((el, i) => ({
    el, r: racers[i],
    road: el.querySelector('.tdr-road'),
    car: el.querySelector('.tdr-car'),
    pos: el.querySelector('.tdr-pos'),
    wpm: el.querySelector('.tdr-wpm'),
    place: el.querySelector('.tdr-place'),
    fx: el.querySelector('.tdr-fx'),
    shown: {},
  }));
  const seats = [...root.querySelectorAll('.tdr-seat')];
  const count = root.querySelector('.tdr-count');
  const lights = root.querySelector('.tdr-lights');
  const bulbs = [...lights.querySelectorAll('i')];
  const statusEl = root.querySelector('.tdr-status');
  const clockEl = root.querySelector('.tdr-clock');

  let roadW = 0; let carW = 0;
  const measure = () => { roadW = lanes[0].road.clientWidth; carW = lanes[0].car.offsetWidth; };
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(root);

  const setText = (node, key, text, store) => { if (store[key] !== text) { store[key] = text; node.textContent = text; } };
  const hud = {};
  const toggle = (node, cls, on) => { if (node.classList.contains(cls) !== on) node.classList.toggle(cls, on); };

  const pop = (l) => {
    const burst = document.createElement('span');
    burst.className = 'tdr-burst';
    burst.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i>';
    l.fx.appendChild(burst);
    setTimeout(() => burst.remove(), 1400);
  };

  const finishOrder = [...racers].sort((a, b) => a.finish - b.finish).map((r) => r.name);
  const END = GO + Math.max(...racers.map((r) => r.finish)) + HOLD;
  let burstDone = false;

  const reset = () => {
    for (const l of lanes) {
      l.shown = {};
      l.el.className = `tdr-lane${l.r.me ? ' me' : ''}`;
      l.car.style.transform = 'translate3d(0,0,0)';
      l.pos.textContent = ''; l.wpm.textContent = ''; l.place.textContent = '';
      l.fx.innerHTML = '';
    }
    for (const s of seats) s.classList.remove('in');
    lights.className = 'tdr-lights';
    for (const b of bulbs) b.className = '';
    root.classList.remove('tdr-out', 'tdr-racing', 'tdr-done');
    Object.keys(hud).forEach((k) => delete hud[k]);
    burstDone = false;
  };

  const place = (l, f) => {
    if (roadW <= carW) measure();          // measured before the styles applied: try again
    const x = Math.max(0, roadW - carW - 10) * f;
    const key = x.toFixed(1);
    if (l.shown.x !== key) { l.shown.x = key; l.car.style.transform = `translate3d(${key}px,0,0)`; }
  };

  const draw = (t) => {
    // the room fills up
    let seated = 0;
    lanes.forEach((l, i) => {
      const inRoom = t >= l.r.join;
      if (inRoom) seated++;
      toggle(l.el, 'in', inRoom);
      toggle(seats[i], 'in', inRoom);
    });
    setText(count, 'count', `${seated}/${SEATS}`, hud);

    // the lights
    const lit = LIGHTS.filter((ms) => t >= ms).length;
    toggle(lights, 'up', t >= LIGHTS[0] - 250 && t < GO + 700);
    toggle(lights, 'go', t >= GO);
    bulbs.forEach((b, i) => toggle(b, 'on', i < lit));

    // the race
    const rt = t - GO;
    toggle(root, 'tdr-racing', rt >= 0);
    const standing = lanes.map((l) => ({ l, f: l.r.at(rt) }))
      .sort((a, b) => (a.f >= 1 && b.f >= 1 ? a.l.r.finish - b.l.r.finish : b.f - a.f));
    standing.forEach((s, k) => {
      const { l, f } = s;
      place(l, f);
      const done = f >= 1;
      const moving = rt > 0 && !done;
      toggle(l.el, 'moving', moving);
      toggle(l.el, 'nitro', l.r.shape === 'late' && rt > NITRO[0] * l.r.finish && rt < NITRO[1] * l.r.finish);
      toggle(l.el, 'done', done);
      if (rt >= 0) setText(l.pos, 'pos', String(k + 1), l.shown);
      if (moving) setText(l.wpm, 'wpm', String(Math.round(l.r.wpm * Math.min(1.25, speed(l.r, rt)))), l.shown);
      if (done) {
        const p = finishOrder.indexOf(l.r.name);
        setText(l.wpm, 'wpm', String(l.r.wpm), l.shown);
        setText(l.place, 'place', PLACE[p], l.shown);
        toggle(l.el, 'won', p === 0);
      }
    });

    // what the room would be saying
    let status = 'Waiting for racers';
    if (t >= LIGHTS[0] - 250 && rt < 0) status = 'Get ready';
    if (rt >= 0 && rt < 700) status = 'Go';
    if (rt >= 700) {
      const first = standing[0].l.r;
      const winner = racers.find((r) => r.name === finishOrder[0]);
      if (winner.at(rt) >= 1) status = winner.me ? 'You win' : `${winner.name} wins`;
      else if (lanes.some((l) => l.el.classList.contains('nitro'))) status = 'Boost';
      else status = first.me ? 'You lead' : `${first.name} leads`;
    }
    setText(statusEl, 'status', status, hud);
    toggle(statusEl, 'win', status.endsWith('win') || status.endsWith('wins'));
    const clock = Math.max(0, Math.min(rt, Math.max(...racers.map((r) => r.finish))));
    const s = clock / 1000;
    setText(clockEl, 'clock', `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`, hud);

    const winLane = lanes.find((l) => l.r.name === finishOrder[0]);
    if (!burstDone && winLane.r.at(rt) >= 1) { burstDone = true; pop(winLane); }
    toggle(root, 'tdr-done', rt >= Math.max(...racers.map((r) => r.finish)));
  };

  let t0 = performance.now();
  let running = false;
  let visible = true;
  let pausedAt = 0;
  const frame = (now) => {
    if (!running) return;
    let t = now - t0;
    if (t > END && !root.classList.contains('tdr-out')) root.classList.add('tdr-out');
    if (t > END + OUT) { reset(); t0 = now; t = 0; }
    draw(Math.min(t, END));
    requestAnimationFrame(frame);
  };
  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    t0 = performance.now() - pausedAt;
    requestAnimationFrame(frame);
  };
  const stop = () => { if (running) pausedAt = performance.now() - t0; running = false; };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => { measure(); burstDone = true; draw(END - 400); });
    return;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(root);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}

export function mountDemos(scope = document) {
  for (const el of scope.querySelectorAll('[data-td-demo]')) mount(el);
}

mountDemos();
