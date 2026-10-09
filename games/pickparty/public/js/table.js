// Renders a table from server snapshots. The server sends the whole
// per-seat snapshot plus a small event (ev) describing what just changed;
// the event decides which animation and sound play.
import { $, $$, esc, flag, fmt, listJoin, fly } from './ui.js';
import * as Bank from './bank.js';
import { sfx } from './sfx.js';
import { cardArt, artCredit } from './art.js';

export const MODE_NAME = { crowd: 'Crowd pleaser', mind: 'Mind reader', auction: 'Auction' };
export const CULTURE_NAME = { desi: 'Desi', global: 'Global', mix: 'Mix' };
const EMOTES = ['👏', '😂', '🔥', '😱', '🤔', '💀'];
const SHEET_PHASES = ['intro', 'vote', 'round_result', 'reveal', 'topic_end'];
const ORD = ['1st', '2nd', '3rd'];

export function createTable(net, hooks) {
  const el = {
    head: { emoji: $('#t-emoji'), title: $('#t-title'), sub: $('#t-sub'), pips: $('#t-pips') },
    ticker: $('#ticker'), tav: $('#ticker-av'), tmsg: $('#ticker-msg'), tsec: $('#ticker-sec'), tfill: $('#ticker-fill'),
    tray: $('#tray'), body: $('#t-body'), board: $('#board'), sheet: $('#sheet'), lineups: $('#lineups'),
    lobby: $('#lobby'), finale: $('#finale'), emoteBar: $('#emote-bar'), emoteLayer: $('#emote-layer'),
  };
  const S = { room: null, sel: [], sheetKey: null, trayKey: null, result: null, closed: false, total: 1, deadline: 0, lastSec: null, revealDone: true, pendingVote: null, picked: false, timers: [], pickSlot: null, pickQuery: '', lastEv: null, lastLotOpt: undefined, prevLeading: false, bidKey: null, bidLock: null };

  /* ---------- helpers ---------- */
  const seat = (sid) => (S.room && S.room.seats.find((s) => s.sid === sid)) || { name: '?', avatar: '❔', color: '#888' };
  const nameOf = (sid) => (S.room && sid === S.room.you ? 'You' : seat(sid).name);
  const topicOf = () => S.room && S.room.match && S.room.match.topic && Bank.topic(S.room.match.topic.id);
  const optOf = (o) => { const t = topicOf(); const x = t && t.o[o]; return x ? { name: x[0], emoji: x[1] } : { name: '?', emoji: '❔' }; };
  const later = (ms, fn) => S.timers.push(setTimeout(fn, ms));
  const clearLater = () => { S.timers.forEach(clearTimeout); S.timers = []; };

  el.emoteBar.innerHTML = EMOTES.map((e) => `<button type="button" data-e="${e}" aria-label="React ${e}">${e}</button>`).join('');
  el.emoteBar.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-e]');
    if (b) net.send({ type: 'emote', e: b.dataset.e });
  });

  /* ---------- entry points ---------- */
  async function onRoom(room, ev) {
    const prev = S.room;
    const prevTop = prev && prev.id === room.id && prev.match && prev.match.topic && prev.match.topic.lot && prev.match.topic.lot.top;
    S.prevLeading = !!(prevTop && prevTop.sid === room.you);
    S.room = room;
    S.closed = false;
    if (room.match && room.match.topic && !Bank.topic(room.match.topic.id)) {
      try { await Bank.ensure(true); } catch { /* render with placeholders */ }
    }
    if (!prev || prev.id !== room.id) { S.sheetKey = null; S.result = null; }
    if (room.deadline !== S.deadline) {
      S.deadline = room.deadline;
      S.total = Math.max(1, net.remaining(room.deadline));
    }
    if (!room.match && room.lobbyDeadline && room.lobbyDeadline !== S.lobbyDeadline) {
      S.lobbyDeadline = room.lobbyDeadline;
      S.total = Math.max(1, net.remaining(room.lobbyDeadline));
    }
    render(ev || {});
    sounds(ev || {});
  }

  function onResult(msg) { S.result = msg; if (S.room && S.room.phase === 'match_end') renderFinale(); }

  function onClosed(reason) {
    // keep the finale up after a public match so people can read it
    if (reason === 'match_over' && S.room && S.room.phase === 'match_end') { S.closed = true; return true; }
    reset();
    return false;
  }

  function reset() { clearLater(); S.room = null; S.sheetKey = null; S.result = null; S.sel = []; S.pickSlot = null; S.pickQuery = ''; }

  function onEmote({ sid, e }) {
    const row = el.lineups.querySelector(`[data-sid="${sid}"]`);
    const r = row && row.offsetParent ? row.getBoundingClientRect() : null;
    const f = document.createElement('div');
    f.className = 'emote-float';
    f.innerHTML = `${esc(e)}<small>${esc(nameOf(sid))}</small>`;
    const x = r ? r.right - 60 : innerWidth / 2 - 20 + (Math.random() * 80 - 40);
    const y = r ? r.top : innerHeight - 140;
    Object.assign(f.style, { left: x + 'px', top: y + 'px' });
    el.emoteLayer.appendChild(f);
    setTimeout(() => f.remove(), 1700);
  }

  /* ---------- render ---------- */
  function render(ev) {
    const r = S.room;
    if (ev.k) S.lastEv = ev.k;
    if (ev.k === 'lot' || ev.k === 'sold' || ev.k === 'passed') S.lastLotOpt = ev.opt;
    renderHead();
    if (!r.match) return renderLobby();
    el.lobby.hidden = true;
    if (r.phase === 'match_end') {
      el.body.hidden = true; el.tray.hidden = true; el.sheet.hidden = true; el.ticker.hidden = true;
      return renderFinale();
    }
    el.ticker.hidden = false;
    el.finale.hidden = true;
    el.body.hidden = false;
    renderTicker();
    renderTray();
    renderBoard();
    if (ev.k === 'reveal') S.revealDone = false;
    renderLineups(ev);
    renderSheet(ev);
    if (ev.k === 'pick' || ev.k === 'sold') animatePick(ev);
  }

  function renderHead() {
    const r = S.room, m = r.match;
    const tp = topicOf();
    if (!m) {
      el.head.emoji.textContent = '';
      el.head.title.textContent = r.isPrivate ? 'Private table' : 'Finding players';
      el.head.sub.textContent = `${MODE_NAME[r.mode]}, ${r.ranked ? 'ranked' : 'friendly'}`;
      el.head.pips.innerHTML = '';
      return;
    }
    const T = m.topic;
    if (r.phase === 'match_end') {
      el.head.emoji.textContent = '🏆';
      el.head.title.textContent = 'Final standings';
      el.head.sub.textContent = `${MODE_NAME[r.mode]}, ${m.total} topics`;
      el.head.pips.innerHTML = '';
      return;
    }
    el.head.emoji.textContent = tp ? tp.e : '';
    el.head.title.textContent = tp ? tp.t : 'Loading topic';
    let sub = `Topic ${m.t + 1} of ${m.total}`;
    if (r.phase === 'match_end') sub = `${MODE_NAME[r.mode]}, final standings`;
    else if (r.mode === 'crowd' && T.round >= 0) sub = T.dud ? `Round 4 of 4: draft the dud` : `Round ${T.round + 1} of 4: top pick`;
    else if (r.mode === 'mind' && r.phase === 'secret') sub = `${nameOf(T.mind)} ${T.mind === r.you ? 'are' : 'is'} the Mind`;
    else if (r.mode === 'mind' && T.round >= 0) sub = `Round ${T.round + 1} of 3: find ${T.mind === r.you ? 'your' : nameOf(T.mind) + "'s"} loves`;
    else if (r.mode === 'auction' && r.phase === 'bid' && T.lot) sub = `Lot ${T.lot.i + 1} of ${T.layout.length}`;
    else if (r.mode === 'auction' && r.phase === 'sold') sub = S.lastEv === 'passed' ? 'No bids' : 'Sold';
    else if (r.mode === 'auction' && r.phase === 'reveal') sub = 'The reveal';
    el.head.sub.textContent = sub;
    el.head.pips.innerHTML = Array.from({ length: m.total }, (_, i) => `<li class="${i < m.t ? 'done' : i === m.t ? 'now' : ''}"></li>`).join('');
  }

  function renderTicker() {
    const r = S.room, m = r.match, T = m && m.topic;
    let msg = '', small = '', who = null, you = false;
    if (!m) {
      msg = r.isPrivate ? 'Waiting for the host to start' : 'Finding players';
      small = r.isPrivate ? `${r.seats.length} at the table` : 'Bots fill any empty seats when the timer runs out';
    } else {
      const ph = r.phase;
      if (ph === 'intro') { msg = 'New topic'; small = r.mode === 'mind' ? `${nameOf(T.mind)} ${T.mind === r.you ? 'are' : 'is'} the Mind` : r.mode === 'auction' ? 'Everyone gets 20 coins. Bid for the cards you want.' : 'Rounds 1 to 3: grab the best cards. Round 4: grab the worst.'; }
      else if (ph === 'bid' && T.lot) {
        const top = T.lot.top, purse = T.purses[r.you], full = (T.lineups[r.you] || []).length >= T.lineupSize;
        const canBid = !full && purse > (top ? top.amount : 0);
        if (!top) { msg = 'Opening bid 1 coin'; small = canBid ? 'Tap a bid to open' : full ? 'Your lineup is full' : 'You are out of coins'; }
        else if (top.sid === r.you) { who = r.you; msg = `You lead at ${top.amount}`; small = 'Hold on while the clock runs'; }
        else { who = top.sid; msg = `${nameOf(top.sid)} leads at ${top.amount}`; small = canBid ? 'Outbid them or let it go' : ''; }
        you = canBid && !(top && top.sid === r.you);
      } else if (ph === 'sold') {
        const last = T.sold[T.sold.length - 1];
        if (S.lastEv === 'passed' || !last) { msg = 'No bids'; small = 'The card stays on the board'; }
        else { who = last.sid; msg = `${nameOf(last.sid)} ${last.sid === r.you ? 'take' : 'takes'} ${optOf(last.opt).name} for ${last.price}`; small = 'Next lot coming up'; }
      } else if (ph === 'reveal' && r.mode === 'auction') { msg = 'The reveal'; small = 'Card values plus pocket change'; }
      else if (ph === 'draft') {
        if (T.turnSid) {
          who = T.turnSid;
          you = T.turnSid === r.you;
          msg = you ? 'Your turn' : `${nameOf(T.turnSid)} is picking`;
          small = you ? (T.dud ? 'Tap the worst card on the board. The table votes for the worst.' : r.mode === 'mind' ? `Tap a card you think ${nameOf(T.mind)} loves` : 'Tap the card you think everyone will like most')
            : T.dud ? 'Last round: everyone grabs their worst card' : 'Wait for your turn. Striped cards are taken.';
        } else {
          const last = lastPick();
          msg = last ? `${nameOf(last.sid)} drafted ${optOf(last.opt).name}` : 'Next pick';
          who = last && last.sid;
        }
      } else if (ph === 'vote') {
        msg = 'Voting';
        small = `${(T.voted || []).length} of ${r.seats.filter((s) => !s.away).length} voted`;
      } else if (ph === 'round_result') {
        msg = `Round ${T.round + 1} results`;
        small = T.round < 3 ? `Round ${T.round + 2} starts in a moment` : 'Topic wraps up next';
      } else if (ph === 'secret') {
        who = T.mind;
        you = T.mind === r.you && !T.mindReady;
        msg = T.mind === r.you ? (T.mindReady ? 'Your secret is locked in' : 'Hide three loves and a dud') : `${nameOf(T.mind)} is hiding three loves and a dud`;
        small = you ? 'Tap cards in order: 1st love, 2nd, 3rd, then the dud' : 'Study the board while you wait';
      } else if (ph === 'reveal') { who = T.mind; msg = 'The reveal'; small = 'Matches light up on the lineups'; }
      else if (ph === 'topic_end') {
        msg = `Topic ${m.t + 1} of ${m.total} done`;
        small = m.t + 1 < m.total ? 'Next topic coming up' : 'Final standings next';
      }
    }
    el.tmsg.innerHTML = `${esc(msg)}${small ? `<small>${esc(small)}</small>` : ''}`;
    if (who) { const s = seat(who); el.tav.textContent = s.avatar; el.tav.style.setProperty('--seat', s.color); }
    else el.tav.textContent = '';
    el.ticker.classList.toggle('is-you', you);
    S.yourClock = you;
  }

  function lastPick() {
    const T = S.room.match.topic;
    let best = null;
    for (const sid in T.lineups) {
      const lu = T.lineups[sid];
      const x = lu[lu.length - 1];
      if (x && x.round === T.round && (!best || T.order.indexOf(sid) > T.order.indexOf(best.sid))) best = { sid, opt: x.opt };
    }
    return best;
  }

  /* ----- Mind's secret tray ----- */
  function renderTray() {
    const r = S.room, T = r.match.topic;
    if (r.mode === 'auction') return renderBlock();
    el.tray.classList.remove('block');
    const show = r.phase === 'secret' && T.mind === r.you && !T.mindReady;
    const key = `${r.match.t}`;
    if (S.trayKey !== key) { S.trayKey = key; S.sel = []; }
    el.tray.hidden = !show;
    if (!show) return;
    const labels = ['1st love', '2nd love', '3rd love', 'Dud'];
    el.tray.innerHTML = labels.map((l, i) => {
      const o = S.sel[i];
      if (o === undefined) return `<span class="tray-slot">${l}</span>`;
      const x = optOf(o);
      return `<button type="button" class="tray-slot filled ${i < 3 ? 'love' : 'dud'}" data-i="${i}" aria-label="Remove ${esc(x.name)} from ${l}"><i>${x.emoji}</i>${esc(x.name)}</button>`;
    }).join('') + `<button type="button" class="btn btn-go btn-sm" data-act="lock" ${S.sel.length === 4 ? '' : 'disabled'}>Lock it in</button>`;
  }

  el.tray.addEventListener('click', (e) => {
    const slot = e.target.closest('[data-i]');
    if (slot) { S.sel.splice(+slot.dataset.i, 1); renderTray(); renderBoard(); return; }
    if (e.target.closest('[data-act="lock"]') && S.sel.length === 4) {
      net.send({ type: 'secret', loves: S.sel.slice(0, 3), dud: S.sel[3] });
      sfx.pick();
    }
  });

  /* ----- Auction: the block under the ticker ----- */
  function renderBlock() {
    const r = S.room, T = r.match.topic;
    const lot = T.lot, live = r.phase === 'bid' && !!lot;
    const last = T.sold[T.sold.length - 1];
    const showing = live ? lot.opt : S.lastEv === 'passed' ? S.lastLotOpt : last && last.opt;
    el.tray.className = 'tray block';
    el.tray.hidden = !(r.phase === 'bid' || r.phase === 'sold') || showing === undefined;
    if (el.tray.hidden) return;
    const o = optOf(showing);
    const purse = T.purses[r.you], full = (T.lineups[r.you] || []).length >= T.lineupSize;
    const top = live ? lot.top : null, base = top ? top.amount : 0, leading = !!(top && top.sid === r.you);
    const status = !live
      ? (S.lastEv === 'passed' ? 'No bids. It stays on the board.' : last ? `Sold to ${nameOf(last.sid)} for ${last.price}` : '')
      : top ? `Top bid: ${nameOf(top.sid)} ${top.amount}` : 'No bids yet';
    const opts = [];
    const add = (amt, label) => { if (amt > base && amt <= purse && !opts.some((x) => x.amt === amt)) opts.push({ amt, label }); };
    if (live && !full && !leading) { add(base + 1, `Bid ${base + 1}`); add(base + 3, `Bid ${base + 3}`); add(purse, `All in ${purse}`); }
    S.bidKey = live ? `${T.id}:${lot.i}:${lot.bids.length}` : null;
    const locked = S.bidKey && S.bidLock === S.bidKey;
    const note = !live ? '' : leading ? 'You lead' : full ? 'Your lineup is full' : !opts.length ? 'Out of coins' : '';
    const cr = artCredit(T.id, showing);
    el.tray.innerHTML = `
      <div class="block-card"><span class="block-art">${cardArt(T.id, showing, 'block')}${cr ? '<button type="button" class="art-credit-btn" data-act="credit" aria-expanded="false" aria-label="Photo credit">ⓘ</button>' : ''}</span>
        <div class="block-info"><small>${live ? `Lot ${lot.i + 1} of ${T.layout.length}` : S.lastEv === 'passed' ? 'Passed' : 'Sold'}</small><b class="block-name">${esc(o.name)}</b><span class="block-top">${esc(status)}</span></div></div>
      <div class="block-bids"><span class="block-purse">🪙 ${purse} coin${purse === 1 ? '' : 's'}</span>
        ${opts.map((x, i) => `<button type="button" class="btn ${i === 0 ? 'btn-go' : ''} bid-btn" data-bid="${x.amt}" ${locked ? 'disabled' : ''}>${x.label}</button>`).join('')}
        ${note ? `<span class="muted">${note}</span>` : ''}</div>
      ${cr ? `<small class="art-credit" hidden>Photo: ${esc(cr.by)}, ${esc(cr.lic)}, via <a href="${esc(cr.url)}" target="_blank" rel="noopener">Wikimedia Commons</a></small>` : ''}`;
  }

  el.tray.addEventListener('click', (e) => {
    const cb = e.target.closest('[data-act="credit"]');
    if (cb) { const c = $('.art-credit', el.tray); if (c) { c.hidden = !c.hidden; cb.setAttribute('aria-expanded', String(!c.hidden)); } return; }
    const b = e.target.closest('[data-bid]');
    if (!b || b.disabled || !S.room || S.room.mode !== 'auction') return;
    const lot = S.room.match && S.room.match.topic && S.room.match.topic.lot;
    net.send({ type: 'bid', amount: Number(b.dataset.bid), lot: lot ? lot.i : undefined });
    S.bidLock = S.bidKey;
    sfx.other();
    for (const x of $$('[data-bid]', el.tray)) x.disabled = true;
  });

  /* ----- board ----- */
  function renderBoard() {
    const r = S.room, T = r.match.topic;
    const tp = topicOf();
    if (!tp) { el.board.innerHTML = ''; return; }
    const myTurn = r.phase === 'draft' && T.turnSid === r.you;
    const choosing = r.phase === 'secret' && T.mind === r.you && !T.mindReady;
    const secret = r.mode !== 'mind' ? null : T.reveal ? { loves: T.reveal.loves, dud: T.reveal.dud } : T.secret;
    S.picked = false;
    const auction = r.mode === 'auction';
    const priceOf = {};
    if (auction) for (const sid in T.lineups) for (const c of T.lineups[sid]) priceOf[c.opt] = c.price;
    el.board.classList.toggle('is-your-turn', myTurn);
    el.board.innerHTML = T.layout.map((o) => {
      // Auction: cards that haven't come up yet are face-down for everyone
      if (o < 0) return '<div class="tile is-facedown" aria-label="A card still to come"><span class="tile-back" aria-hidden="true">?</span></div>';
      const name = tp.o[o][0];
      const owner = T.taken[o];
      let cls = 'tile', extra = '', label = name;
      const pickable = owner === undefined && (myTurn || choosing);
      if (owner !== undefined) {
        const s = seat(owner);
        cls += ' is-taken';
        extra += `<span class="tile-owner" style="--seat:${s.color}">${s.avatar}</span>`;
        label += `, ${auction ? 'bought' : 'drafted'} by ${nameOf(owner)}`;
        if (auction) { const pr = priceOf[o]; extra += `<span class="tile-price">${pr === 0 ? 'free' : pr}</span>`; label += pr === 0 ? ' for free' : ` for ${pr}`; }
      } else if (pickable) cls += ' is-pickable';
      if (auction && T.lot && T.lot.opt === o) { cls += ' is-lot'; label += ', on the block now'; }
      else if (auction && (T.unsold || []).includes(o)) { cls += ' is-unsold'; label += ', unsold'; }
      if (choosing) {
        const k = S.sel.indexOf(o);
        if (k >= 0) { cls += k < 3 ? ' is-sel-love' : ' is-sel-dud'; extra += k < 3 ? `<span class="tile-badge">${ORD[k]}</span>` : '<span class="tile-badge dud">dud</span>'; }
      } else if (secret) {
        const k = secret.loves.indexOf(o);
        if (k >= 0) extra += `<span class="tile-badge">${ORD[k]}</span>`;
        if (o === secret.dud) extra += '<span class="tile-badge dud">dud</span>';
      }
      return `<button type="button" class="${cls}" data-opt="${o}" aria-label="${esc(label)}" ${pickable ? '' : 'aria-disabled="true"'}>${cardArt(tp.id, o, 'tile')}<span class="tile-name">${esc(name)}</span>${extra}</button>`;
    }).join('');
  }

  el.board.addEventListener('click', (e) => {
    const t = e.target.closest('.tile.is-pickable');
    if (!t || !S.room || !S.room.match) return;
    const r = S.room, T = r.match.topic, o = +t.dataset.opt;
    if (r.phase === 'draft' && T.turnSid === r.you && !S.picked) {
      S.picked = true;
      net.send({ type: 'pick', opt: o });
      $$('.tile.is-pickable', el.board).forEach((x) => x.classList.remove('is-pickable'));
      el.board.classList.remove('is-your-turn');
    } else if (r.phase === 'secret' && T.mind === r.you && !T.mindReady) {
      const k = S.sel.indexOf(o);
      if (k >= 0) S.sel.splice(k, 1);
      else if (S.sel.length < 4) S.sel.push(o);
      sfx.other();
      renderTray();
      renderBoard();
    }
  });

  /* ----- lineups ----- */
  function renderLineups(ev) {
    const r = S.room, m = r.match, T = m.topic;
    const rv = r.mode === 'mind' ? T.reveal : null;
    const auction = r.mode === 'auction';
    const n = r.mode === 'crowd' ? 4 : auction ? (T.lineupSize || 4) : 3;
    const leader = auction && T.lot && T.lot.top ? T.lot.top.sid : null;
    el.lineups.innerHTML = r.seats.map((s) => {
      const lu = T.lineups[s.sid] || [];
      const isMind = T.mind === s.sid;
      const pills = [];
      if (s.bot) pills.push('<span class="pill">bot</span>');
      if (s.away) pills.push('<span class="pill">away</span>');
      if (isMind) pills.push('<span class="pill mind">Mind</span>');
      if (r.phase === 'vote' && (T.voted || []).includes(s.sid)) pills.push('<span class="pill voted">voted</span>');
      if (rv && S.revealDone && rv.busted.includes(s.sid)) pills.push('<span class="pill busted">busted</span>');
      let slots;
      if (r.mode === 'mind' && isMind) slots = `<div class="slots"><span class="slot" style="grid-column:1/-1">${s.sid === r.you ? 'You hid the secret this topic' : 'Hiding the secret this topic'}</span></div>`;
      else {
        const items = [];
        for (let i = 0; i < n; i++) {
          const x = lu[i];
          if (!x) { items.push(`<span class="slot ${r.mode === 'crowd' && i === 3 ? 'is-dud-slot' : ''}">${r.mode === 'crowd' && i === 3 ? 'dud' : ''}</span>`); continue; }
          const o = optOf(x.opt);
          let c = 'mini';
          if (x.kind === 'dud') c += ' kind-dud';
          if (rv && S.revealDone) { if (rv.loves.includes(x.opt)) c += ' is-match'; if (x.opt === rv.dud) c += ' is-bust'; }
          const fresh = (ev.k === 'pick' || ev.k === 'sold') && ev.sid === s.sid && i === lu.length - 1;
          const tag = auction ? `<small class="price">${x.kind === 'free' ? 'free' : x.price}</small>` : '';
          items.push(`<span class="${c}" data-opt="${x.opt}" ${fresh ? 'data-fresh style="visibility:hidden"' : ''} title="${esc(o.name)}">${cardArt(T.id, x.opt, 'mini')}<em>${esc(o.name)}</em>${tag}</span>`);
        }
        slots = `<div class="slots ${n === 3 ? 'three' : n === 2 ? 'two' : ''}">${items.join('')}</div>`;
      }
      const cards = m.cards[s.sid] || 0;
      return `<div class="seat ${T.turnSid === s.sid || leader === s.sid ? 'is-turn' : ''} ${s.away ? 'is-away' : ''}" data-sid="${s.sid}" style="--seat:${s.color}">
        <div class="seat-top">
          <span class="seat-av">${s.avatar}</span>
          <span class="seat-name">${esc(s.name)}${s.sid === r.you ? '<small>you</small>' : ''}${s.country ? `<small>${flag(s.country)}</small>` : ''} <span class="seat-badges">${pills.join('')}</span></span>
          <span class="seat-score"><b>${fmt(m.scores[s.sid])}</b><small>${auction ? `${T.purses[s.sid]} coins` : `${cards} topic${cards === 1 ? '' : 's'} won`}</small></span>
        </div>${slots}</div>`;
    }).join('');
  }

  function animatePick(ev) {
    const tile = el.board.querySelector(`.tile[data-opt="${ev.opt}"]`);
    const row = el.lineups.querySelector(`[data-sid="${ev.sid}"]`);
    const mini = row && row.querySelector('.mini[data-fresh]');
    if (!mini) return;
    const o = optOf(ev.opt);
    const land = () => { mini.style.visibility = ''; mini.classList.add('is-new'); };
    // on narrow screens the lineup may be off-screen; skip the flight then
    const r = mini.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return land();
    fly(tile, mini, `<span class="tile-emo">${o.emoji}</span><span class="tile-name">${esc(o.name)}</span>`).then(land);
  }

  function popPoints(points) {
    for (const sid in points) {
      if (!points[sid]) continue;
      const row = el.lineups.querySelector(`[data-sid="${sid}"]`);
      if (!row) continue;
      const p = document.createElement('span');
      p.className = 'pts-pop';
      p.textContent = '+' + fmt(points[sid]);
      row.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  /* ----- sheets over the board ----- */
  function renderSheet(ev) {
    const r = S.room, m = r.match, T = m.topic, ph = r.phase;
    const show = SHEET_PHASES.includes(ph);
    el.sheet.hidden = !show;
    if (!show) { S.sheetKey = null; return; }
    const key = `${ph}|${m.t}|${T.round}`;
    if (key === S.sheetKey) { if (ph === 'vote') updateVote(); return; }
    S.sheetKey = key;
    clearLater();
    const tp = topicOf() || { e: '', t: '' };

    if (ph === 'intro') {
      el.sheet.innerHTML = `<div class="topic-win"><div class="topic-card"><i>${tp.e}</i><div><b>${esc(tp.t)}</b><small>Topic ${m.t + 1} of ${m.total}</small></div></div></div>
        <p>${r.mode === 'auction'
          ? 'Everyone gets 20 coins. The sixteen cards go on the block one at a time and the top bid takes each one. Empty slots get leftovers for free. Cards score by crowd rank, plus 5 for every coin you keep.'
          : r.mode === 'crowd'
          ? 'Four rounds. Grab the best card you can in rounds 1 to 3, then the worst card on the board in round 4. After each round everyone votes, and every vote is points.'
          : `<b>${esc(nameOf(T.mind))}</b> ${T.mind === r.you ? 'are' : 'is'} the Mind. ${T.mind === r.you ? 'You hide' : 'They hide'} three loves and a dud; everyone else drafts three cards. Loves score 200, 150 and 100. Draft the dud and you score nothing for the topic.`}</p>`;
    } else if (ph === 'vote') {
      S.pendingVote = null;
      el.sheet.innerHTML = `<h3>${T.dud ? 'Vote for the worst dud' : 'Vote for the best pick'}</h3>
        <p id="vote-status"></p>
        <div class="vote-cards">${T.roundPicks.map((p) => {
          const o = optOf(p.opt), s = seat(p.sid);
          return `<button type="button" class="vcard ${T.dud ? 'is-dud-card' : ''}" data-sid="${p.sid}">${cardArt(T.id, p.opt, 'tile')}<b>${esc(o.name)}</b><span class="by"><span style="--seat:${s.color}">${s.avatar}</span>${esc(nameOf(p.sid))}</span></button>`;
        }).join('')}</div>`;
      updateVote();
    } else if (ph === 'round_result') {
      const rr = T.roundResult;
      const w = rr.winners;
      el.sheet.innerHTML = `<h3>${w.length ? `${esc(listJoin(w.map(nameOf)))} ${w.length === 1 && w[0] !== r.you ? 'takes' : 'take'} the round` : 'No votes landed'}</h3>
        <p>${rr.dud ? 'Worst dud wins here.' : 'Every vote is worth 100, plus 50 for the most-voted pick.'}</p>
        <div class="vote-cards">${T.roundPicks.map((p) => {
          const o = optOf(p.opt), s = seat(p.sid);
          const voters = Object.entries(rr.votes).filter(([, t]) => t === p.sid).map(([v]) => seat(v));
          return `<div class="vcard ${w.includes(p.sid) ? 'is-winner' : ''} ${rr.dud ? 'is-dud-card' : ''}">${cardArt(T.id, p.opt, 'tile')}<b>${esc(o.name)}</b>
            <span class="by"><span style="--seat:${s.color}">${s.avatar}</span>${esc(nameOf(p.sid))}</span>
            <span class="votes">${voters.map((v, i) => `<span style="--seat:${v.color};--i:${i}" title="${esc(v.name)}">${v.avatar}</span>`).join('')}</span>
            <span class="gain">${rr.points[p.sid] ? '+' + fmt(rr.points[p.sid]) : '0'}</span></div>`;
        }).join('')}</div>`;
      popPoints(rr.points);
    } else if (ph === 'reveal' && r.mode === 'auction') {
      renderAuctionReveal(ev);
    } else if (ph === 'reveal') {
      const rv = T.reveal;
      const cards = [...rv.loves.map((o, i) => ({ o, label: `${ORD[i]} love`, dud: false })), { o: rv.dud, label: 'the dud', dud: true }];
      const mindName = nameOf(T.mind);
      el.sheet.innerHTML = `<h3>${esc(T.mind === r.you ? 'Your secret' : `${mindName}'s secret`)}</h3>
        <div class="reveal-row">${cards.map((c) => {
          const o = optOf(c.o);
          return `<div class="flip ${c.dud ? 'dud' : ''}" data-opt="${c.o}"><div class="back">?</div><div class="front"><small>${c.label}</small>${cardArt(T.id, c.o, 'tile')}<b>${esc(o.name)}</b></div></div>`;
        }).join('')}</div>
        <div class="reveal-scores" id="reveal-scores" hidden>${m.base.map((sid) => {
          const pts = rv.points[sid] || 0;
          let note;
          if (sid === T.mind) note = `read ${rv.readCount} of 3 loves`;
          else if (rv.busted.includes(sid)) note = 'drafted the dud';
          else note = `${(rv.matches[sid] || []).length} love${(rv.matches[sid] || []).length === 1 ? '' : 's'} matched`;
          return `<div><span>${seat(sid).avatar} ${esc(nameOf(sid))} <span class="muted">${note}</span></span><b>+${fmt(pts)}</b></div>`;
        }).join('')}</div>`;
      runReveal(rv, ev.step || 1100, !ev.k);
    } else if (ph === 'topic_end') {
      const w = T.winners || [];
      el.sheet.innerHTML = `<div class="topic-win"><div class="topic-card"><i>${tp.e}</i><div><b>${esc(tp.t)}</b><small>${w.length ? `won by ${esc(listJoin(w.map(nameOf)))}` : 'nobody scored'}</small></div></div></div>
        <div class="topic-scores">${Object.keys(T.tscore).sort((a, b) => T.tscore[b] - T.tscore[a]).map((sid) => `<div><span>${seat(sid).avatar} ${esc(nameOf(sid))}</span><b>${fmt(T.tscore[sid])}</b></div>`).join('')}</div>
        <p>${m.t + 1 < m.total ? `Next up: topic ${m.t + 2} of ${m.total}.` : 'That was the last topic.'} Most topics won takes the table; points break ties.</p>`;
    }
  }

  // Auction reveal: lineups appear lowest total first, each card priced by
  // crowd rank, then pocket change, then the winner.
  function renderAuctionReveal(ev) {
    const r = S.room, m = r.match, T = m.topic, rv = T.reveal;
    const order = Object.keys(T.lineups).sort((a, b) => rv.points[a] - rv.points[b]);
    const max = Math.max(...order.map((s) => rv.points[s]));
    const winners = order.filter((s) => rv.points[s] === max && max > 0);
    el.sheet.innerHTML = `<h3>The reveal</h3><p>Cards are worth 10 to 160 by crowd rank, plus 5 for every coin kept.</p>
      <div class="auction-reveal">${order.map((sid) => {
        const s = seat(sid), coins = T.purses[sid];
        return `<div class="ar-row" data-sid="${sid}" data-total="${rv.points[sid]}" style="--seat:${s.color}">
          <span class="ar-who"><span class="seat-av">${s.avatar}</span>${esc(nameOf(sid))}</span>
          <span class="ar-cards">${T.lineups[sid].map((c) => { const o = optOf(c.opt); return `<span class="ar-card ${c.kind === 'free' ? 'free' : ''}" data-value="${rv.values[c.opt]}" title="${esc(o.name)}">${cardArt(T.id, c.opt, 'mini')}<b>${rv.values[c.opt]}</b><small>${c.kind === 'free' ? 'free' : `paid ${c.price}`}</small></span>`; }).join('')}</span>
          <span class="ar-change" data-change="${rv.change[sid]}"><b>+${rv.change[sid]}</b><small>${coins} coin${coins === 1 ? '' : 's'} kept</small></span>
          <b class="ar-total">${fmt(rv.points[sid])}</b></div>`;
      }).join('')}</div>
      <p class="ar-winner" hidden>${winners.length ? `${esc(listJoin(winners.map(nameOf)))} ${winners.length === 1 && winners[0] !== r.you ? 'takes' : 'take'} the topic with ${fmt(max)}.` : 'Nobody scored.'}</p>`;
    const rows = $$('.ar-row', el.sheet), step = ev.step || 900, instant = !ev.k;
    const winEl = $('.ar-winner', el.sheet);
    if (instant) { rows.forEach((row) => row.classList.add('is-shown')); winEl.hidden = false; return; }
    rows.forEach((row, i) => later(300 + i * step, () => { row.classList.add('is-shown'); sfx.flip(); }));
    later(300 + rows.length * step, () => { winEl.hidden = false; popPoints(rv.points); if (winners.includes(r.you)) sfx.win(); });
  }

  function updateVote() {
    const r = S.room, T = r.match.topic;
    const mine = T.myVote || S.pendingVote;
    for (const b of $$('.vcard', el.sheet)) {
      const own = b.dataset.sid === r.you;
      b.disabled = own || !!mine;
      b.classList.toggle('is-own', own);
      b.classList.toggle('is-chosen', b.dataset.sid === mine);
    }
    const st = $('#vote-status', el.sheet);
    if (st) st.textContent = mine ? `Vote in. ${(T.voted || []).length} of ${r.seats.filter((s) => !s.away).length} have voted.` : 'Your vote is worth 100 points to them. You can\'t vote for your own pick.';
  }

  el.sheet.addEventListener('click', (e) => {
    const b = e.target.closest('button.vcard');
    if (!b || b.disabled || !S.room || S.room.phase !== 'vote') return;
    S.pendingVote = b.dataset.sid;
    net.send({ type: 'vote', sid: b.dataset.sid });
    sfx.vote();
    updateVote();
  });

  function runReveal(rv, step, instant) {
    const flips = $$('.flip', el.sheet);
    const r = S.room;
    const mine = (r.match.topic.lineups[r.you] || []).map((x) => x.opt);
    S.revealDone = false;
    const finish = () => {
      S.revealDone = true;
      const sc = $('#reveal-scores', el.sheet);
      if (sc) sc.hidden = false;
      renderLineups({});
      popPoints(rv.points);
    };
    if (instant) { flips.forEach((f) => f.classList.add('is-open')); return finish(); }
    flips.forEach((f, i) => later(350 + i * step, () => {
      f.classList.add('is-open');
      const o = +f.dataset.opt;
      for (const m of $$(`.mini[data-opt="${o}"]`, el.lineups)) m.classList.add(i < 3 ? 'is-match' : 'is-bust');
      if (mine.includes(o)) (i < 3 ? sfx.hit : sfx.dud)();
      else sfx.flip();
    }));
    later(350 + flips.length * step, finish);
  }

  /* ---------- finale ---------- */
  function renderFinale() {
    const r = S.room, m = r.match;
    el.finale.hidden = false;
    const top = m.standings[0];
    const res = S.result;
    const place = m.standings.indexOf(r.you);
    const unlocked = res ? res.unlocked.map((id) => hooks.achievement(id)).filter(Boolean) : [];
    el.finale.innerHTML = `
      <h2 class="finale-title">${top === r.you ? 'You win the table' : `${esc(seat(top).name)} wins the table`}</h2>
      <ol class="podium">${m.standings.map((sid, i) => {
        const s = seat(sid);
        return `<li style="--seat:${s.color}"><span class="pl">${i + 1}</span><span class="av">${s.avatar}</span>
          <span>${esc(s.name)}${sid === r.you ? ' <small>you</small>' : ''}${s.bot ? ' <small>bot</small>' : ''}</span>
          <span class="cards">${m.cards[sid]} <small>${m.cards[sid] === 1 ? 'topic' : 'topics'}</small></span><span class="sc">${fmt(m.scores[sid])} <small>pts</small></span></li>`;
      }).join('')}</ol>
      <div class="you-result">${res ? `
        <div class="stat"><b>${place + 1}${['st', 'nd', 'rd'][place] || 'th'}</b><small>your place</small></div>
        <div class="stat"><b>${res.ranked ? '+' + fmt(res.points) : 'Friendly'}</b><small>${res.ranked ? 'ranked points' : 'no ranking change'}</small></div>
        <div class="stat"><b>${fmt(res.profile.points)}</b><small>total points</small></div>` : '<p class="muted">Saving your result…</p>'}</div>
      ${unlocked.length ? `<div class="unlocks">${unlocked.map((a) => `<span class="unlock">${a.icon} ${esc(a.name)}</span>`).join('')}</div>` : ''}
      <div class="lobby-actions">${r.isPrivate
        ? `<span class="muted">Back to the table in a few seconds.</span><button type="button" class="btn btn-quiet" data-act="home">Leave table</button>`
        : `<button type="button" class="btn btn-go" data-act="again">Play again</button><button type="button" class="btn btn-quiet" data-act="home">Home</button>`}</div>`;
  }

  el.finale.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'again') hooks.quick(S.room.mode);
    if (b.dataset.act === 'home') hooks.home();
  });

  /* ---------- lobby: topic picks ---------- */
  // The host fills up to maxPicks slots; empty slots are drawn at random on the server.
  const topicMatches = (tp, q) => !q || tp.t.toLowerCase().includes(q) || tp.o.some((o) => o[0].toLowerCase().includes(q));

  function renderTopicSlots(r, isHost) {
    const n = r.maxPicks || 3, picks = r.picks || [];
    const slots = [];
    for (let i = 0; i < n; i++) {
      const tp = picks[i] ? Bank.topic(picks[i]) : null;
      const body = `<small>Topic ${i + 1}</small>${tp ? `<i>${tp.e}</i><b>${esc(tp.t)}</b>` : '<i>🎲</i><b>Surprise me</b>'}`;
      slots.push(isHost
        ? `<div class="topic-slot ${tp ? 'is-set' : ''}"><button type="button" class="slot-card" data-act="pick" data-slot="${i}" aria-label="${tp ? `Topic ${i + 1}: ${esc(tp.t)}. Tap to change` : `Choose topic ${i + 1}`}">${body}</button>${tp ? `<button type="button" class="clear" data-act="unpick" data-slot="${i}" aria-label="Clear ${esc(tp.t)}">×</button>` : ''}</div>`
        : `<div class="topic-slot ${tp ? 'is-set' : ''}"><div class="slot-card">${body}</div></div>`);
    }
    const hint = isHost ? 'Tap a slot to choose. Empty slots are drawn at random.'
      : r.isPrivate ? `${esc(seat(r.hostSid).name)} picks the topics. Empty slots are drawn at random.`
        : 'Set for this table. Pick a category on the home page to play what you want.';
    return `<section class="lobby-topics" aria-label="Topics for this match">
      <div class="lobby-topics-head"><h3>Topics</h3><span class="muted">${hint}</span></div>
      <div class="topic-slots">${slots.join('')}</div>
      ${isHost && S.pickSlot !== null ? renderTopicPicker(r) : ''}</section>`;
  }

  function renderTopicPicker(r) {
    const picks = r.picks || [], q = S.pickQuery.trim().toLowerCase();
    const all = Bank.ids().filter((id) => Bank.inCulture(id, r.culture)).map((id) => Bank.topic(id)).filter(Boolean);
    return `<div class="topic-picker" role="group" aria-label="Choose topic ${S.pickSlot + 1}">
      <div class="picker-head"><input type="search" placeholder="Search ${all.length} topics…" aria-label="Search topics" autocomplete="off" value="${esc(S.pickQuery)}"><button type="button" class="btn btn-quiet btn-sm" data-act="close">Done</button></div>
      <div class="topic-grid">${all.map((tp) => {
        const at = picks.indexOf(tp.id);
        return `<button type="button" class="topic-opt ${at >= 0 ? 'is-picked' : ''}" data-act="choose" data-id="${tp.id}" aria-pressed="${at >= 0}" ${topicMatches(tp, q) ? '' : 'hidden'}><i>${tp.e}</i><b>${esc(tp.t)}</b>${at >= 0 ? `<small>Topic ${at + 1}</small>` : ''}</button>`;
      }).join('')}</div></div>`;
  }

  function filterPicker() {
    const q = S.pickQuery.trim().toLowerCase();
    for (const b of $$('.topic-opt', el.lobby)) { const tp = Bank.topic(b.dataset.id); b.hidden = !(tp && topicMatches(tp, q)); }
  }

  function sendPicks(next) {
    const max = (S.room && S.room.maxPicks) || 3;
    net.send({ type: 'host', action: 'topics', arg: next.slice(0, max) });
  }

  // Put a topic in slot i: it leaves any other slot it sat in, and replaces what slot i held.
  function choose(i, id) {
    const picks = (S.room.picks || []).slice();
    const cur = picks[i];
    const next = picks.filter((x) => x !== id);
    const at = cur ? next.indexOf(cur) : -1;
    if (at >= 0) next[at] = id; else next.splice(Math.min(i, next.length), 0, id);
    sendPicks(next);
    S.pickSlot = null; S.pickQuery = '';
    renderLobby();
  }

  /* ---------- lobby ---------- */
  function renderLobby() {
    const r = S.room;
    el.body.hidden = true; el.tray.hidden = true; el.finale.hidden = true; el.sheet.hidden = true;
    el.lobby.hidden = false;
    el.ticker.hidden = false;
    renderTicker();
    const isHost = r.hostSid === r.you;
    const max = 6;
    const seats = r.seats.map((s) => `<div class="lobby-seat" style="--seat:${s.color}"><span class="seat-av">${s.avatar}</span><span>${esc(s.name)}${s.sid === r.you ? ' <small class="muted">you</small>' : ''}${s.sid === r.hostSid ? ' <small class="muted">host</small>' : ''}${s.bot ? ' <small class="muted">bot</small>' : ''}</span>${isHost && s.bot && r.isPrivate ? `<button type="button" class="x" data-act="remove" data-sid="${s.sid}" aria-label="Remove ${esc(s.name)}">×</button>` : ''}</div>`);
    for (let i = r.seats.length; i < (r.isPrivate ? max : Math.max(4, r.seats.length)); i++) seats.push('<div class="lobby-seat empty">Open seat</div>');
    const HOW_AUCTION = ['Everyone gets 20 coins a topic. The sixteen cards go on the block one at a time.', 'Tap a bid to raise. Every bid stretches the clock a little, and when it runs out the top bid takes the card.', 'Lineups hold four cards at three or four players, fewer at bigger tables. Empty slots get leftover cards for free.', 'Cards are worth 10 to 160 by crowd rank, plus 5 points per coin you keep. Highest total wins the topic.'];
    const how = r.mode === 'auction' ? HOW_AUCTION : r.mode === 'crowd'
      ? ['Each topic has sixteen cards. Players take turns drafting one at a time, and the order snakes back each round.', 'Rounds one to three: draft the best card you can. Round four: draft the worst one, the dud.', 'After each round everyone votes for the best pick (or the worst dud). Each vote you get is 100 points.', 'Win the most topics to win the table.']
      : ['Each topic, one player is the Mind. They secretly rank three loves and pick one dud from the board.', 'Everyone else drafts three cards, taking turns. A card can only be drafted once.', 'Matching the Mind\'s 1st, 2nd and 3rd love scores 200, 150 and 100. Draft the dud and your topic is worth nothing.', 'The Mind scores 75 for every love that somebody found.'];
    const grid = $('.topic-grid', el.lobby);
    const keep = { scroll: grid ? grid.scrollTop : 0, focus: !!(document.activeElement && document.activeElement.matches('.topic-picker input')) };
    el.lobby.innerHTML = `
      ${r.isPrivate ? `<div class="lobby-code"><b aria-label="Table code ${esc(r.code)}">${esc(r.code)}</b><button type="button" class="btn" data-act="copy">Copy invite link</button><span class="culture-tag" title="Which packs this table draws from">${CULTURE_NAME[r.culture] || 'Mix'} culture</span></div>`
        : `<div class="lobby-wait"><b id="lobby-sec">…</b><span>Starting soon. Bots take any empty seats.</span><span class="culture-tag">${CULTURE_NAME[r.culture] || 'Mix'} culture</span></div>`}
      <div class="lobby-seats">${seats.join('')}</div>
      ${renderTopicSlots(r, isHost && r.isPrivate)}
      ${r.isPrivate ? (isHost ? `<div class="lobby-actions">
          <div class="seg" role="radiogroup" aria-label="Mode">${['crowd', 'mind', 'auction'].map((md) => `<button type="button" role="radio" aria-checked="${r.mode === md}" data-act="mode" data-mode="${md}">${MODE_NAME[md]}</button>`).join('')}</div>
          <div class="seg" role="radiogroup" aria-label="Culture">${['desi', 'global', 'mix'].map((c) => `<button type="button" role="radio" aria-checked="${r.culture === c}" data-act="culture" data-culture="${c}">${CULTURE_NAME[c]}</button>`).join('')}</div>
          <div class="seg" role="radiogroup" aria-label="Topics per match">${[1, 2, 3].map((n) => `<button type="button" role="radio" aria-checked="${r.maxPicks === n}" data-act="rounds" data-rounds="${n}">${n} topic${n === 1 ? '' : 's'}</button>`).join('')}</div>
          <button type="button" class="btn" data-act="bot" ${r.seats.length >= max ? 'disabled' : ''}>Add a bot</button>
          <button type="button" class="btn btn-go" data-act="start" ${r.seats.length < 3 ? 'disabled' : ''}>Start match</button>
          ${r.seats.length < 3 ? '<span class="muted">Needs 3 players. Add a bot to fill in.</span>' : ''}</div>`
        : `<p class="muted">Waiting for ${esc(seat(r.hostSid).name)} to start the match.</p>`) : ''}
      <section aria-label="How to play"><h3 style="font-size:20px;margin-bottom:8px">How ${MODE_NAME[r.mode]} works</h3><ol class="how">${how.map((h) => `<li>${esc(h)}</li>`).join('')}</ol></section>`;
    const grid2 = $('.topic-grid', el.lobby);
    if (grid2) grid2.scrollTop = keep.scroll;
    const input = $('.topic-picker input', el.lobby);
    if (input && keep.focus) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }

  el.lobby.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || !S.room) return;
    const a = b.dataset.act;
    if (a === 'copy') {
      const link = `${location.origin}/?join=${S.room.code}`;
      (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(() => hooks.toast('Invite link copied'), () => hooks.toast(link));
    }
    if (a === 'mode') net.send({ type: 'host', action: 'mode', arg: b.dataset.mode });
    if (a === 'culture') net.send({ type: 'host', action: 'culture', arg: b.dataset.culture });
    if (a === 'rounds') net.send({ type: 'host', action: 'rounds', arg: Number(b.dataset.rounds) });
    if (a === 'bot') net.send({ type: 'host', action: 'add_bot' });
    if (a === 'remove') net.send({ type: 'host', action: 'remove_bot', arg: b.dataset.sid });
    if (a === 'start') net.send({ type: 'host', action: 'start' });
    if (a === 'pick') {
      S.pickSlot = Number(b.dataset.slot); S.pickQuery = '';
      Bank.ensure().catch(() => {}).then(() => { if (S.room && S.pickSlot !== null) { renderLobby(); const inp = $('.topic-picker input', el.lobby); if (inp) inp.focus(); } });
    }
    if (a === 'unpick') sendPicks((S.room.picks || []).filter((_, k) => k !== Number(b.dataset.slot)));
    if (a === 'choose' && S.pickSlot !== null) choose(S.pickSlot, b.dataset.id);
    if (a === 'close') { S.pickSlot = null; S.pickQuery = ''; renderLobby(); }
  });
  el.lobby.addEventListener('input', (e) => {
    if (!e.target.matches('.topic-picker input')) return;
    S.pickQuery = e.target.value;
    filterPicker();
  });
  el.lobby.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && S.pickSlot !== null) { e.preventDefault(); S.pickSlot = null; S.pickQuery = ''; renderLobby(); const b = $('[data-act="pick"]', el.lobby); if (b) b.focus(); }
  });

  /* ---------- sound cues ---------- */
  function sounds(ev) {
    const r = S.room;
    if (!ev.k || !r) return;
    if (ev.k === 'turn' && ev.sid === r.you) sfx.turn();
    if (ev.k === 'bid') { if (S.prevLeading && ev.sid !== r.you) sfx.turn(); else if (ev.sid !== r.you) sfx.other(); }
    if (ev.k === 'sold') sfx.pick();
    if (ev.k === 'pick') (ev.sid === r.you ? sfx.pick : sfx.other)();
    if (ev.k === 'vote') sfx.vote();
    if (ev.k === 'secret' && r.match.topic.mind === r.you) sfx.turn();
    if (ev.k === 'round_result') {
      const w = r.match.topic.roundResult.winners;
      w.includes(r.you) ? sfx.hit() : sfx.flip();
    }
    if (ev.k === 'topic_end' && (r.match.topic.winners || []).includes(r.you)) sfx.win();
    if (ev.k === 'match_end' && r.match.standings[0] === r.you) sfx.win();
  }

  /* ---------- clock (one rAF loop for every countdown) ---------- */
  function frame() {
    const r = S.room;
    if (r && !document.hidden) {
      const dl = r.match ? r.deadline : r.lobbyDeadline;
      const rem = net.remaining(dl);
      const sec = dl ? Math.ceil(rem / 1000) : null;
      el.tsec.textContent = sec === null || r.phase === 'match_end' ? '' : sec;
      el.tfill.style.transform = `scaleX(${dl ? Math.min(1, rem / S.total) : 0})`;
      el.ticker.classList.toggle('is-urgent', !!dl && rem < 3500 && r.phase !== 'intro');
      if (S.yourClock && sec !== S.lastSec && sec <= 3 && sec > 0) sfx.tick();
      S.lastSec = sec;
      const ls = document.getElementById('lobby-sec');
      if (ls) ls.textContent = sec === null ? '…' : `${sec}s`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { onRoom, onResult, onEmote, onClosed, reset, get room() { return S.room; } };
}
