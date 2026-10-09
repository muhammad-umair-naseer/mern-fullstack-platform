// Crowd read: a solo run dealt by the game server. The browser's bank has the
// topics but not the crowd ranking; the server opens each topic on its own
// clock, grades the picks and only then sends that topic's ranking. At the end
// it scores the log it kept itself.
import { $, $$, esc, fmt, flipReorder, show } from './ui.js';
import * as Bank from './bank.js';
import { cardArt } from './art.js';
import { sfx } from './sfx.js';

const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ORD = ['1st', '2nd', '3rd'];

export function createSolo(net, hooks) {
  const el = {
    emoji: $('#s-emoji'), title: $('#s-title'), sub: $('#s-sub'), lives: $('#s-lives'), score: $('#s-score'), mult: $('#s-mult'),
    slots: $('#s-slots'), lock: $('#s-lock'), fill: $('#s-fill'), board: $('#s-board'), verdict: $('#s-verdict'), over: $('#s-over'),
    body: $('#solo .s-body'), ticker: $('#solo .solo-ticker'),
  };
  let run = null;
  let advanceTimer = null;

  async function call(step, body) {
    const res = await fetch(`/api/solo${step ? '/' + step : ''}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: net.token, run: run && run.id, ...body }) });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'The server said no.');
    return out;
  }

  // first: a topic id or a list of them to play first, in order; the rest follow shuffled.
  // allow: optional filter on topic ids (the culture pool).
  async function start(first, allow) {
    try { await Bank.ensure(); } catch { return hooks.toast('Could not load the topics. Check your connection and try again.', 'err'); }
    const ids = allow ? Bank.ids().filter(allow) : Bank.ids();
    const firsts = (Array.isArray(first) ? first : first ? [first] : []).filter((id, i, a) => ids.includes(id) && a.indexOf(id) === i);
    const order = [...firsts, ...shuffle(ids.filter((id) => !firsts.includes(id)))];
    run = null;
    let id;
    try { id = (await call('start')).run; } catch { return hooks.toast('Could not reach the server. Check your connection and try again.', 'err'); }
    run = { id, order, i: -1, lives: Scoring.RULES.SOLO_LIVES, combo: 0, total: 0, log: [], perfect: 0, done: false };
    show('solo');
    el.over.hidden = true;
    el.body.hidden = false;
    el.ticker.hidden = false;
    next();
  }

  async function next() {
    clearTimeout(advanceTimer);
    if (run.busy) return;
    run.i++;
    if (run.lives <= 0 || run.i >= run.order.length || run.i >= Scoring.RULES.SOLO_MAX_TOPICS) return finish();
    const id = run.order[run.i];
    const tp = Bank.topic(id);
    const mine = run;
    let timer;
    mine.busy = true;
    try { timer = (await call('topic', { t: id })).timer; } catch (e) { mine.busy = false; return stopRun(e); }
    mine.busy = false;
    if (run !== mine) return;
    run.cur = { id, tp, layout: shuffle(tp.o.map((_, i) => i)), sel: [], timer, t0: performance.now(), locked: false };
    renderHead();
    renderSlots();
    renderBoard();
    el.verdict.innerHTML = '<span class="muted">Loves first, then the dud. Tap a chosen card again to put it back.</span>';
  }

  function renderHead() {
    const c = run.cur;
    el.emoji.textContent = c.tp.e;
    el.title.textContent = c.tp.t;
    el.sub.textContent = `Topic ${run.i + 1}: ${Math.round(c.timer / 1000)} seconds on the clock`;
    el.lives.innerHTML = Array.from({ length: Scoring.RULES.SOLO_LIVES }, (_, i) => `<span class="${i < run.lives ? '' : 'lost'}">❤️</span>`).join('');
    el.lives.setAttribute('aria-label', `${run.lives} lives left`);
    el.score.textContent = fmt(run.total);
    el.mult.textContent = run.combo > 0 ? `combo x${(1 + Math.min(run.combo, 4) * 0.25).toFixed(2)}` : '';
  }

  function renderSlots() {
    const c = run.cur;
    const labels = ['Love', 'Love', 'Love', 'Dud'];
    el.slots.innerHTML = labels.map((l, i) => {
      const o = c.sel[i];
      if (o === undefined) return `<span class="tray-slot">${i < 3 ? `${ORD[i]} love` : 'Dud'}</span>`;
      const [name, emo] = c.tp.o[o];
      return `<button type="button" class="tray-slot filled ${i < 3 ? 'love' : 'dud'}" data-i="${i}" ${c.locked ? 'disabled' : ''}><i>${emo}</i>${esc(name)}</button>`;
    }).join('');
    el.lock.disabled = c.locked || c.sel.length !== 4;
    el.lock.textContent = c.locked ? 'Locked' : 'Lock in';
  }

  function renderBoard() {
    const c = run.cur;
    el.board.innerHTML = c.layout.map((o) => {
      const [name, emo] = c.tp.o[o];
      const k = c.sel.indexOf(o);
      let cls = 'tile is-pickable', badge = '';
      if (k >= 0) { cls += k < 3 ? ' is-sel-love' : ' is-sel-dud'; badge = k < 3 ? '<span class="tile-badge">love</span>' : '<span class="tile-badge dud">dud</span>'; }
      return `<button type="button" class="${cls}" data-opt="${o}" aria-pressed="${k >= 0}" aria-label="${esc(name)}">${cardArt(run.cur.id, o, 'tile')}<span class="tile-name">${esc(name)}</span>${badge}</button>`;
    }).join('');
  }

  el.board.addEventListener('click', (e) => {
    const t = e.target.closest('.tile');
    if (!t || !run || !run.cur || run.cur.locked) return;
    const c = run.cur, o = +t.dataset.opt;
    const k = c.sel.indexOf(o);
    if (k >= 0) c.sel.splice(k, 1);
    else if (c.sel.length < 4) c.sel.push(o);
    else return;
    sfx.other();
    renderSlots();
    renderBoard();
  });

  el.slots.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b || run.cur.locked) return;
    run.cur.sel.splice(+b.dataset.i, 1);
    renderSlots();
    renderBoard();
  });

  el.lock.addEventListener('click', () => lock());
  addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || $('#solo').hidden || !run || !run.cur) return;
    if (!run.cur.locked && run.cur.sel.length === 4) lock();
    else if (run.cur.locked && !run.done) next();
  });

  async function lock() {
    const c = run.cur;
    if (c.locked) return;
    c.locked = true;
    renderSlots();
    const f = [0, 1, 2].map((i) => (c.sel[i] === undefined ? -1 : c.sel[i]));
    const d = c.sel[3] === undefined ? -1 : c.sel[3];
    let res;
    try { res = await call('pick', { f, d }); } catch (e) { return stopRun(e); }
    if (!run || run.cur !== c) return;
    c.r = res.r;
    run.combo = res.combo;
    run.total += res.points;
    run.lives = res.lives;
    if (res.hits === 4) run.perfect++;
    run.log.push({ t: c.id, f, d });
    revealCrowd(res);
  }

  // The server could not be reached or refused a step: end the run with what it already has.
  function stopRun(e) {
    if (!run || run.done) return;
    hooks.toast(e.message, 'err');
    run.lives = 0;
    finish();
  }

  function revealCrowd(res) {
    const c = run.cur;
    const pos = new Map(c.r.map((o, i) => [o, i]));
    const n = c.r.length;
    for (const t of $$('.tile', el.board)) {
      const o = +t.dataset.opt, p = pos.get(o);
      t.classList.remove('is-pickable', 'is-sel-love', 'is-sel-dud');
      t.querySelector('.tile-badge')?.remove();
      if (p < 4) t.classList.add('r-top');
      if (p >= n - 4) t.classList.add('r-bottom');
      t.insertAdjacentHTML('afterbegin', `<span class="tile-rank">#${p + 1}</span>`);
      const k = c.sel.indexOf(o);
      if (k >= 0) t.classList.add(k < 3 ? (p < 4 ? 'mine-hit' : 'mine-miss') : (p >= n - 4 ? 'mine-hit' : 'mine-miss'));
    }
    flipReorder(el.board, 'data-opt', c.r);
    renderSlots();
    renderHead();
    const lostLife = !res.survive;
    (res.hits === 4 ? sfx.win : res.survive ? sfx.hit : sfx.dud)();
    el.verdict.innerHTML = `
      <span class="big ${res.survive ? 'ok' : 'bad'}">${res.hits === 4 ? 'Perfect read' : res.survive ? 'Read it' : 'Misread'}</span>
      <span>${res.hits} of 4 hits, <b>+${fmt(res.points)}</b>${res.mult > 1 ? ` with combo x${res.mult.toFixed(2)}` : ''}${lostLife ? `. ${run.lives > 0 ? 'Lost a life.' : 'No lives left.'}` : ''}</span>
      <button type="button" class="btn btn-go btn-sm" id="s-next">${run.lives > 0 && run.i + 1 < run.order.length ? 'Next topic' : 'See results'}</button>`;
    $('#s-next').addEventListener('click', () => next());
    $('#s-next').focus({ preventScroll: true });
    advanceTimer = setTimeout(() => { if (run && run.cur === c) next(); }, 4200);
  }

  async function finish() {
    clearTimeout(advanceTimer);
    run.done = true;
    run.cur = null;
    el.body.hidden = true;
    el.ticker.hidden = true;
    el.over.hidden = false;
    const played = run.log.length;
    el.over.innerHTML = `
      <h2 class="finale-title">${run.lives > 0 ? 'You read every topic' : 'Out of lives'}</h2>
      <div class="you-result">
        <div class="stat"><b>${fmt(run.total)}</b><small>score</small></div>
        <div class="stat"><b>${played}</b><small>topic${played === 1 ? '' : 's'} read</small></div>
        <div class="stat"><b>${run.perfect}</b><small>perfect reads</small></div>
        <div class="stat" id="s-ranked"><b>…</b><small>ranked points</small></div>
      </div>
      <div class="unlocks" id="s-unlocks"></div>
      <p class="muted" id="s-note"></p>
      <div class="lobby-actions"><button type="button" class="btn btn-go" data-act="again">Play again</button><button type="button" class="btn btn-quiet" data-act="home">Home</button></div>`;
    if (!played) { $('#s-ranked b').textContent = '0'; return; }
    try {
      const res = await fetch('/api/solo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: net.token, run: run.id }) });
      const body = await res.json();
      if (!res.ok) { $('#s-ranked b').textContent = '0'; $('#s-note').textContent = body.error || 'This run could not be saved.'; return; }
      $('#s-ranked b').textContent = '+' + fmt(body.points);
      $('#s-note').textContent = [body.best && 'New personal best.', body.capped && 'You reached today\'s ranked points from solo runs.'].filter(Boolean).join(' ');
      $('#s-unlocks').innerHTML = body.unlocked.map((id) => hooks.achievement(id)).filter(Boolean).map((a) => `<span class="unlock">${a.icon} ${esc(a.name)}</span>`).join('');
      hooks.profile(body.profile, body.unlocked);
    } catch {
      $('#s-ranked b').textContent = '0';
      $('#s-note').textContent = 'Could not reach the server, so this run was not saved.';
    }
  }

  el.over.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'again') start();
    if (b.dataset.act === 'home') hooks.home();
  });

  $('#s-quit').addEventListener('click', () => {
    if (!run || run.done) return hooks.home();
    if (run.log.length) finish(); else { run = null; hooks.home(); }
  });

  // one rAF loop for the shrinking clock
  function frame() {
    const c = run && run.cur;
    if (c && !c.locked && !$('#solo').hidden) {
      const left = c.timer - (performance.now() - c.t0);
      el.fill.style.transform = `scaleX(${Math.max(0, left / c.timer)})`;
      if (left <= 0) lock();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { start };
}
