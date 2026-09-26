import { carSvg } from './cars.js';

/**
 * The looping mini race on the home and landing pages: a paragraph types
 * itself, one letter goes wrong and gets fixed, a bonus word pays out, the
 * cars move with the typing and the winner takes the flag. It is decoration
 * (aria-hidden) that shows how a race works instead of explaining it.
 *
 * Mounts on every [data-td-demo] element. Pauses when off screen or in a
 * background tab; with reduced motion it draws one still frame.
 */
const TEXT = 'Quick hands, calm mind. Every letter moves your car.';
const GOLD_WORD = 5;              // "letter" (0-based word index)
const TYPO_AT = 13;               // the "c" of "calm"
const CHAR_MS = 128;              // about 90 words a minute
const HOLD_MS = 2000;
const RIVALS = [
  { name: 'Mei', flag: '🇯🇵', paint: '#5E7F5A', skin: 'hatch', rate: 0.86 },
  { name: 'Leo', flag: '🇧🇷', paint: '#9E3F36', skin: 'muscle', rate: 0.71 },
];
const ME = { name: 'You', flag: '🇵🇰', paint: '#B8612E', skin: 'bolt' };

function lane(p, me) {
  return `<div class="tdd-lane${me ? ' me' : ''}" style="--c:${p.paint}">
    <span class="tdd-who"><span class="tdd-flag">${p.flag}</span>${p.name}</span>
    <div class="tdd-road"><i class="tdd-fill"></i><i class="tdd-finish"></i><div class="tdd-car">${carSvg(p.skin)}<div class="tdd-fx"></div></div></div>
    <span class="tdd-wpm">0</span>
  </div>`;
}

function mount(root) {
  if (root.dataset.tdMounted) return;
  root.dataset.tdMounted = '1';
  root.setAttribute('aria-hidden', 'true');
  root.classList.add('tdd');
  root.innerHTML = `
    <div class="tdd-top"><span class="tdd-live"><i></i>live race</span><span class="tdd-combo" hidden>combo <b>0</b></span></div>
    <div class="tdd-lanes">${lane(ME, true)}${RIVALS.map((r) => lane(r, false)).join('')}</div>
    <div class="tdd-text"></div>`;

  // passage as words of characters, like the real one
  const textEl = root.querySelector('.tdd-text');
  const chars = [];
  const words = [];
  const wordEnd = [];
  let w = document.createElement('span');
  w.className = 'w';
  for (let i = 0; i < TEXT.length; i++) {
    const c = document.createElement('span');
    c.className = 'c';
    c.textContent = TEXT[i];
    chars.push(c);
    w.appendChild(c);
    if (TEXT[i] === ' ' || i === TEXT.length - 1) {
      if (words.length === GOLD_WORD) w.classList.add('gold');
      words.push(w);
      wordEnd.push(i + 1);
      textEl.appendChild(w);
      w = document.createElement('span');
      w.className = 'w';
    }
  }

  const lanes = [...root.querySelectorAll('.tdd-lane')].map((el) => ({
    el,
    road: el.querySelector('.tdd-road'),
    car: el.querySelector('.tdd-car'),
    fill: el.querySelector('.tdd-fill'),
    fx: el.querySelector('.tdd-fx'),
    wpm: el.querySelector('.tdd-wpm'),
  }));
  const comboEl = root.querySelector('.tdd-combo');
  const comboNum = comboEl.querySelector('b');

  let roadW = 0;
  let carW = 0;
  const measure = () => {
    roadW = lanes[0].road.clientWidth;
    carW = lanes[0].car.offsetWidth;
  };
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(root);

  const pop = (l, text, cls) => {
    const n = document.createElement('span');
    n.className = `tdd-pop ${cls}`;
    n.textContent = text;
    l.fx.appendChild(n);
    setTimeout(() => n.remove(), 1300);
  };

  const typeMs = TEXT.length * CHAR_MS + 420;      // the typo costs a little time
  let t0 = performance.now();
  let lastIdx = -1;
  let lastBad = false;
  let committed = 0;
  let combo = 0;
  let finished = false;
  let running = false;
  let visible = true;

  const reset = () => {
    for (const c of chars) c.className = 'c';
    for (const wd of words) wd.classList.remove('done-ok', 'gold-hit');
    for (const l of lanes) {
      l.car.style.transform = 'translate3d(0,0,0)';
      l.fill.style.transform = 'scaleX(0)';
      l.wpm.textContent = '0';
      l.el.classList.remove('won', 'moving');
      l.fx.innerHTML = '';
    }
    comboEl.hidden = true;
    root.classList.remove('tdd-done');
    lastIdx = -1;
    lastBad = false;
    committed = 0;
    combo = 0;
    finished = false;
  };

  const place = (l, f) => {
    if (roadW <= carW) measure();          // measured before the styles applied: try again
    const x = Math.max(0, roadW - carW) * f;
    l.car.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    l.fill.style.transform = `scaleX(${f.toFixed(4)})`;
  };

  // typed characters at time t (ms), with one wrong key that is fixed again
  const progressAt = (t) => {
    const typoStart = TYPO_AT * CHAR_MS;
    if (t < typoStart) return { idx: Math.floor(t / CHAR_MS), bad: false };
    if (t < typoStart + 420) return { idx: TYPO_AT, bad: t < typoStart + 300 };
    return { idx: Math.min(TEXT.length, TYPO_AT + Math.floor((t - typoStart - 420) / CHAR_MS)), bad: false };
  };

  const draw = (t) => {
    const { idx, bad } = progressAt(t);
    if (idx !== lastIdx || bad !== lastBad) {
      for (let i = Math.max(0, lastIdx - 1); i < chars.length; i++) {
        let cls = 'c';
        if (i < idx) cls += ' ok';
        else if (i === idx) cls += bad ? ' bad' : ' cur';
        chars[i].className = cls;
        if (i > idx + 1) break;
      }
      lastIdx = idx;
      lastBad = bad;
      while (committed < words.length && idx >= wordEnd[committed]) {
        const wd = words[committed];
        wd.classList.add('done-ok');
        combo++;
        comboEl.hidden = false;
        comboNum.textContent = combo;
        comboEl.classList.remove('bump');
        void comboEl.offsetWidth;
        comboEl.classList.add('bump');
        if (committed === GOLD_WORD) { wd.classList.add('gold-hit'); pop(lanes[0], '+250', 'gold'); }
        committed++;
      }
    }
    const secs = Math.max(0.6, t / 1000);
    const meF = Math.min(1, idx / TEXT.length);
    place(lanes[0], meF);
    lanes[0].wpm.textContent = String(Math.round((idx / 5) / (secs / 60)));
    lanes[0].el.classList.toggle('moving', meF < 1 && meF > 0);
    RIVALS.forEach((r, i) => {
      const l = lanes[i + 1];
      const f = Math.min(1, Math.max(0, (t / typeMs) * r.rate + Math.sin(t / 700 + i * 2) * 0.012));
      place(l, f);
      l.wpm.textContent = String(Math.round(90 * r.rate + Math.sin(t / 500 + i) * 3));
      l.el.classList.toggle('moving', f > 0 && f < 1);
    });
    if (!finished && idx >= TEXT.length) {
      finished = true;
      lanes[0].el.classList.add('won');
      root.classList.add('tdd-done');
      pop(lanes[0], '🥇', 'medal');
    }
  };

  const frame = (now) => {
    if (!running) return;
    let t = now - t0;
    if (t > typeMs + HOLD_MS) { reset(); t0 = now; t = 0; }
    draw(Math.min(t, typeMs + HOLD_MS));
    requestAnimationFrame(frame);
  };
  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    t0 = performance.now() - Math.min(typeMs, Math.max(0, lastIdx) * CHAR_MS);
    requestAnimationFrame(frame);
  };
  const stop = () => { running = false; };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => { measure(); draw(TEXT.length * CHAR_MS * 0.62); });
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
