'use strict';
// Auction mode. Lots open one at a time in the board's shuffled order;
// players and bots bid live, every bid stretches the clock a little (up to
// a hard cap), and when it runs out the top bid takes the card. The room
// owns timers and broadcasting; this module only drives the topic state.
const cfg = require('./config');
const Scoring = require('../shared/scoring');
const Bots = require('./bots');

const R = Scoring.RULES;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const full = (T, sid) => T.lineups[sid].length >= T.lineupSize;
const topAmount = (lot) => (lot.top ? lot.top.amount : 0);

function openLot(room, i) {
  const T = room.T;
  room.clearTimers();
  if (i >= T.layout.length || room.seats.every((s) => full(T, s.sid))) return closeAuction(room);
  // Nobody left who could bid (everyone with an open slot is broke or away):
  // pass the card at once rather than run a clock no one can answer. The
  // card still goes through the unsold pile so leftovers fill every lineup.
  T.openedUpTo = i; // this card is on the block now, so it may be shown
  const canBid = room.seats.some((s) => !full(T, s.sid) && T.purses[s.sid] >= R.AUCTION_MIN_BID && (s.bot || (!s.away && s.player)));
  if (!canBid) {
    T.lot = null;
    T.unsold.push(T.layout[i]);
    room.setPhase('sold', cfg.SOLD_MS / 2, { k: 'passed', opt: T.layout[i] });
    room.later(cfg.SOLD_MS / 2, () => openLot(room, i + 1));
    return;
  }
  T.lot = { i, opt: T.layout[i], opened: Date.now(), top: null, bids: [], ceil: {} };
  room.setPhase('bid', cfg.BID_MS, { k: 'lot', opt: T.lot.opt });
  room.later(cfg.BID_MS, () => closeLot(room));
  scheduleBots(room);
}

// amount is absolute, so two raises racing each other can't be misread, and
// a bid names the lot it was meant for, so a tap delayed past a lot's close
// never buys the next card. (A missing index is accepted for older clients.)
function bid(room, sid, amount, lotIndex) {
  const T = room.T, lot = T && T.lot;
  if (!lot || room.phase !== 'bid' || !room.seat(sid) || full(T, sid)) return false;
  if (lotIndex !== undefined && lotIndex !== lot.i) return false;
  if (!Number.isInteger(amount) || amount < R.AUCTION_MIN_BID || amount <= topAmount(lot) || amount > T.purses[sid]) return false;
  if (lot.top && lot.top.sid === sid) return false;
  lot.top = { sid, amount };
  lot.bids.push({ sid, amount });
  const now = Date.now();
  room.deadline = Math.min(lot.opened + cfg.BID_MAX_MS, Math.max(room.deadline, now + cfg.BID_EXTEND_MS));
  room.clearTimers();
  room.later(room.deadline - now, () => closeLot(room));
  room.broadcast({ k: 'bid', sid, amount });
  scheduleBots(room);
  return true;
}

function closeLot(room) {
  const T = room.T, lot = T && T.lot;
  if (!lot || room.phase !== 'bid') return;
  room.clearTimers();
  T.lot = null;
  if (lot.top) {
    const { sid, amount } = lot.top;
    T.purses[sid] -= amount;
    T.taken[lot.opt] = sid;
    T.lineups[sid].push({ opt: lot.opt, price: amount, kind: 'bid' });
    T.sold.push({ opt: lot.opt, sid, price: amount });
    room.setPhase('sold', cfg.SOLD_MS, { k: 'sold', sid, opt: lot.opt, price: amount });
    room.later(cfg.SOLD_MS, () => openLot(room, lot.i + 1));
  } else {
    T.unsold.push(lot.opt);
    room.setPhase('sold', cfg.SOLD_MS / 2, { k: 'passed', opt: lot.opt });
    room.later(cfg.SOLD_MS / 2, () => openLot(room, lot.i + 1));
  }
}

// Every bot with coins, an empty slot and a ceiling above the top bid gets
// one delayed decision. Timers are wiped on each bid, so a stale decision
// never fires; the guards below cover the lot closing in between.
function scheduleBots(room) {
  const T = room.T, lot = T.lot;
  if (!lot) return;
  const rating = room.ratings.get(T.id);
  const lotsLeft = T.layout.length - lot.i;
  const top = topAmount(lot);
  for (const s of room.seats) {
    if (!s.bot || full(T, s.sid) || (lot.top && lot.top.sid === s.sid)) continue;
    const purse = T.purses[s.sid];
    if (purse <= top) continue;
    if (lot.ceil[s.sid] === undefined) lot.ceil[s.sid] = Bots.ceiling(rating, lot.opt, purse, T.lineupSize - T.lineups[s.sid].length, lotsLeft);
    if (lot.ceil[s.sid] <= top) continue;
    room.later(Bots.delay(cfg.BOT_MIN_MS, cfg.BOT_MAX_MS), () => {
      if (room.phase !== 'bid' || T.lot !== lot) return;
      bid(room, s.sid, topAmount(lot) + 1);
    });
  }
}

// The auction is over: hand unsold cards to empty slots for free (random
// seat order, one at a time so nobody takes two before another gets one),
// price every card by the crowd's rank, add pocket change, and reveal.
function closeAuction(room) {
  const T = room.T, m = room.m;
  room.clearTimers();
  T.lot = null;
  const pool = shuffle(T.unsold.slice());
  const needy = shuffle(room.seats.filter((s) => !full(T, s.sid)));
  let gave = true;
  while (pool.length && gave) {
    gave = false;
    for (const s of needy) {
      if (!pool.length || full(T, s.sid)) continue;
      const opt = pool.pop();
      T.taken[opt] = s.sid;
      T.lineups[s.sid].push({ opt, price: 0, kind: 'free' });
      gave = true;
    }
  }
  T.unsold = pool;
  const res = Scoring.auctionTopic(room.ratings.rank(T.id), T.lineups, T.purses);
  for (const sid in res.points) { T.tscore[sid] += res.points[sid]; m.scores[sid] += res.points[sid]; }
  for (const sid in T.lineups) {
    for (const c of T.lineups[sid]) {
      if (c.kind === 'bid' && c.price <= 3 && res.values[c.opt] >= 140) m.stats[sid].bargain = true;
      if (c.price >= 15) m.stats[sid].bigSpender = true;
    }
  }
  T.reveal = { values: res.values, change: res.change, points: res.points };
  const ms = room.seats.length * cfg.AUCTION_REVEAL_STEP_MS + 2600;
  room.setPhase('reveal', ms, { k: 'reveal', step: cfg.AUCTION_REVEAL_STEP_MS });
  room.later(ms, () => room.endTopic());
}

module.exports = { openLot, bid, closeLot, closeAuction, scheduleBots };
