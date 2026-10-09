/*
 * PickParty scoring rules — one file, loaded by the Node server (require)
 * and by the browser (classic <script>, exposes window.Scoring).
 * Anything that decides points lives here so client previews and server
 * settlement can never disagree.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Scoring = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const RULES = Object.freeze({
    BOARD: 16,
    CROWD_ROUNDS: 4,        // 3 top picks + 1 dud
    MIND_ROUNDS: 3,         // guessers draft 3 each
    VOTE_PTS: 100,          // per vote your pick receives
    ROUND_WIN_BONUS: 50,    // most-voted pick of the round
    LOVE_PTS: [200, 150, 100], // matching the Mind's #1, #2, #3 love
    MIND_READ_PTS: 75,      // Mind earns this for every love somebody drafted
    SOLO_LIVES: 3,
    SOLO_TOP: 4,            // "top 4" counts as a hit for a favourite
    SOLO_BOTTOM: 4,         // "bottom 4" counts as a hit for the dud
    SOLO_MAX_TOPICS: 32,
    AUCTION_PURSE: 20,       // coins per player, per topic
    AUCTION_MAX_LINEUP: 4,   // cards per lineup at 3 or 4 seats; fewer with more seats (16-card board)
    AUCTION_VALUE_STEP: 10,  // card value = (board size − rank) × step, so 160 down to 10
    AUCTION_CHANGE_PTS: 5,   // per coin left in your pocket at the end of the topic
    AUCTION_MIN_BID: 1,
  });

  /* ---------- Crowd pleaser ---------- */
  // picks: [{sid, opt}]   ballots: [{voter, target}] (target = sid)
  function crowdRound(picks, ballots) {
    const tally = {};
    for (const p of picks) tally[p.sid] = 0;
    for (const b of ballots) {
      if (b.voter !== b.target && Object.prototype.hasOwnProperty.call(tally, b.target)) tally[b.target]++;
    }
    const max = Math.max(0, ...Object.values(tally));
    const winners = max > 0 ? Object.keys(tally).filter((s) => tally[s] === max) : [];
    const points = {};
    for (const s in tally) points[s] = tally[s] * RULES.VOTE_PTS + (winners.includes(s) ? RULES.ROUND_WIN_BONUS : 0);
    return { tally, winners, points };
  }

  /* ---------- Mind reader ---------- */
  // secret: {loves:[a,b,c], dud}   guesses: {sid: [opt, ...]}
  function mindTopic(secret, guesses, mindSid) {
    const points = {}, matches = {}, busted = [];
    const read = new Set();
    for (const sid of Object.keys(guesses)) {
      const g = guesses[sid] || [];
      let pts = 0;
      matches[sid] = [];
      for (const o of g) {
        const k = secret.loves.indexOf(o);
        if (k >= 0) { matches[sid].push(o); read.add(o); pts += RULES.LOVE_PTS[k]; }
      }
      const isBusted = g.includes(secret.dud);
      if (isBusted) busted.push(sid);
      points[sid] = isBusted ? 0 : pts;
    }
    points[mindSid] = read.size * RULES.MIND_READ_PTS;
    return { points, matches, busted, readCount: read.size };
  }

  /* ---------- Auction ---------- */
  function auctionLineup(seats) {
    return Math.min(RULES.AUCTION_MAX_LINEUP, Math.floor(RULES.BOARD / Math.max(1, seats)));
  }

  // rank: option indices best→worst   lineups: {sid: [{opt, price}]}   purses: {sid: coins left}
  function auctionTopic(rank, lineups, purses) {
    const values = {};
    rank.forEach((o, i) => { values[o] = (rank.length - i) * RULES.AUCTION_VALUE_STEP; });
    const points = {}, change = {};
    for (const sid of Object.keys(lineups)) {
      change[sid] = (purses[sid] || 0) * RULES.AUCTION_CHANGE_PTS;
      points[sid] = lineups[sid].reduce((a, c) => a + (values[c.opt] || 0), 0) + change[sid];
    }
    return { points, values, change };
  }

  /* ---------- Match standings ---------- */
  // cards/scores: {sid: n}; returns sids best first
  function standings(sids, cards, scores) {
    return sids.slice().sort((a, b) => (cards[b] || 0) - (cards[a] || 0) || (scores[b] || 0) - (scores[a] || 0));
  }

  function rankedPoints({ place, score, humans }) {
    const base = [60, 40, 28, 18, 12, 8][place] || 5;
    const perf = Math.floor(Math.max(0, score) / 40);
    const field = humans >= 2 ? 1 : 0.75; // a table full of bots is worth a bit less
    return Math.max(1, Math.round((base + perf) * field));
  }

  /* ---------- Crowd read (solo, runs in the browser) ---------- */
  function soloTimer(i) { return Math.max(10000, 20000 - i * 1000); }

  // rank: option indices best→worst; favs: [opt|-1 x3]; dud: opt|-1
  function soloTopic(rank, favs, dud, ms, timer, combo) {
    const n = rank.length;
    const pos = new Array(n);
    rank.forEach((o, i) => { pos[o] = i; });
    let hits = 0, base = 0;
    const detail = [];
    for (const o of favs) {
      if (o < 0) { detail.push({ o, p: -1, hit: false }); continue; }
      const p = pos[o];
      const hit = p < RULES.SOLO_TOP;
      if (hit) hits++;
      base += (n - 1 - p) * 10 + (hit ? 50 : 0);
      detail.push({ o, p, hit });
    }
    let d = { o: dud, p: -1, hit: false };
    if (dud >= 0) {
      const p = pos[dud];
      const hit = p >= n - RULES.SOLO_BOTTOM;
      if (hit) hits++;
      base += p * 10 + (hit ? 50 : 0);
      d = { o: dud, p, hit };
    }
    const survive = hits >= 2;
    const speed = survive ? Math.max(0, Math.round(60 * (1 - Math.min(ms, timer) / timer))) : 0;
    const nextCombo = hits >= 3 ? combo + 1 : 0;
    const mult = 1 + Math.min(nextCombo, 4) * 0.25;
    const points = Math.round((base + speed) * mult);
    return { hits, survive, points, combo: nextCombo, mult, speed, detail, dud: d };
  }

  function validEntry(e, n) {
    if (!e || typeof e.t !== 'string' || !Array.isArray(e.f) || e.f.length !== 3) return false;
    const all = [...e.f, e.d];
    if (!all.every((x) => Number.isInteger(x) && x >= -1 && x < n)) return false;
    const real = all.filter((x) => x >= 0);
    return new Set(real).size === real.length && Number.isFinite(e.ms) && e.ms >= 0;
  }

  // log: [{t: topicId, f:[...], d, ms}]   rankOf(topicId) → rank array | null
  function soloRun(log, rankOf) {
    if (!Array.isArray(log) || log.length === 0 || log.length > RULES.SOLO_MAX_TOPICS) return { error: 'bad log' };
    let lives = RULES.SOLO_LIVES, combo = 0, bestCombo = 0, total = 0, perfect = 0, played = 0;
    const seen = new Set();
    for (let i = 0; i < log.length; i++) {
      if (lives <= 0) return { error: 'entries after game over' };
      const e = log[i];
      const rank = e && rankOf(e.t);
      if (!rank || !validEntry(e, rank.length) || seen.has(e.t)) return { error: 'bad entry ' + i };
      const timer = soloTimer(i);
      if (e.ms > timer + 1500) return { error: 'timing ' + i };
      seen.add(e.t);
      const r = soloTopic(rank, e.f, e.d, e.ms, timer, combo);
      combo = r.combo; bestCombo = Math.max(bestCombo, combo);
      total += r.points; played++;
      if (r.hits === 4) perfect++;
      if (!r.survive) lives--;
    }
    return { total, played, lives, perfect, bestCombo };
  }

  function soloRankedPoints(total) { return Math.min(300, Math.floor(total / 25)); }

  return { RULES, crowdRound, mindTopic, auctionLineup, auctionTopic, standings, rankedPoints, soloTimer, soloTopic, soloRun, soloRankedPoints };
});
