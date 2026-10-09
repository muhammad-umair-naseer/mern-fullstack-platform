'use strict';
// One table. Event-driven (no tick loop): every phase sets a deadline and a
// timer, players and bots act inside it, and each change broadcasts a
// per-seat snapshot plus a small event the browser animates.
const crypto = require('crypto');
const cfg = require('./config');
const Scoring = require('../shared/scoring');
const Bots = require('./bots');
const Auction = require('./auction');

const COLORS = ['#B8612E', '#4F6D8A', '#62805A', '#7D5A86', '#C08A2E', '#B5566A'];
const MODES = ['crowd', 'mind', 'auction'];
const normMode = (m) => (MODES.includes(m) ? m : 'crowd');
const CULTURES = ['desi', 'global', 'mix'];
const normCulture = (c) => (CULTURES.includes(c) ? c : 'mix');
// how many topics a match plays: 1 up to TOPICS_PER_MATCH (the default)
const normRounds = (r) => (Number.isInteger(r) && r >= 1 ? Math.min(r, cfg.TOPICS_PER_MATCH) : cfg.TOPICS_PER_MATCH);
const R = Scoring.RULES;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class Room {
  constructor(mgr, { mode, isPrivate, topics, culture, rounds }) {
    this.mgr = mgr;
    this.id = crypto.randomBytes(4).toString('hex');
    this.mode = normMode(mode);
    this.isPrivate = !!isPrivate;
    this.code = this.isPrivate ? mgr.newCode() : null;
    this.ranked = !this.isPrivate || cfg.RANKED_PRIVATE;
    this.seats = [];
    this.hostSid = null;
    this.state = 'lobby'; // lobby | playing | over
    this.phase = 'lobby';
    this.deadline = 0;
    this.lobbyDeadline = 0;
    this.timers = new Set();
    this.seq = 0;
    this.m = null;
    // topic ids chosen for the next match, in play order; empty slots are drawn at random at start.
    // A public table draws its whole list now so the lobby can show it; matchmaking reads topicKey and listKey.
    this.culture = normCulture(culture); // which packs random draws and picks may come from
    this.rounds = normRounds(rounds); // topics per match; picks and random fills are cut to this
    const list = this.cleanPicks(topics || []);
    this.topicKey = list[0] || null;
    this.listKey = list.join(',');
    this.picks = list;
    if (!this.isPrivate) this.picks = this.cleanPicks(list.concat(shuffle(this.bank.pool(this.culture))));
    this.closed = false;
    this.created = Date.now();
  }

  /* ---------- plumbing ---------- */
  later(ms, fn) {
    const t = setTimeout(() => {
      this.timers.delete(t);
      if (!this.closed) {
        try { fn(); } catch (e) { console.error('[room]', this.id, e); }
      }
    }, Math.max(0, ms));
    this.timers.add(t);
    return t;
  }
  clearTimers() { for (const t of this.timers) clearTimeout(t); this.timers.clear(); }
  seat(sid) { return this.seats.find((s) => s.sid === sid) || null; }
  humans() { return this.seats.filter((s) => !s.bot); }
  activeHumans() { return this.seats.filter((s) => !s.bot && !s.away && s.player); }
  get bank() { return this.mgr.bank; }
  get ratings() { return this.mgr.ratings; }

  setPhase(name, ms, ev) {
    this.phase = name;
    this.deadline = ms ? Date.now() + ms : 0;
    this.broadcast(ev);
  }

  broadcast(ev = null) {
    const now = Date.now();
    for (const s of this.seats) {
      if (s.player && !s.away) s.player.send({ type: 'room', room: this.snapshot(s.sid), ev, now });
    }
  }

  emote(sid, e) {
    for (const s of this.seats) if (s.player && !s.away) s.player.send({ type: 'emote', sid, e });
  }

  /* ---------- seats ---------- */
  freeColor() { return COLORS.find((c) => !this.seats.some((s) => s.color === c)) || COLORS[0]; }

  addHuman(player) {
    if (this.closed || this.state !== 'lobby' || this.seats.length >= cfg.MAX_SEATS) return false;
    const a = player.account;
    const seat = {
      sid: 's' + ++this.seq, bot: false, player, accountId: a.id,
      name: a.name, avatar: a.avatar, country: a.country, color: this.freeColor(), away: false,
    };
    this.seats.push(seat);
    player.room = this;
    player.sid = seat.sid;
    if (!this.hostSid || !this.seat(this.hostSid) || this.seat(this.hostSid).bot) this.hostSid = seat.sid;

    if (!this.isPrivate) {
      if (this.seats.length >= cfg.MAX_SEATS) {
        this.clearTimers();
        this.lobbyDeadline = Date.now() + 1500;
        this.later(1500, () => this.startFromLobby());
      } else if (!this.lobbyDeadline) {
        this.lobbyDeadline = Date.now() + cfg.LOBBY_WAIT_MS;
        this.later(cfg.LOBBY_WAIT_MS, () => this.startFromLobby());
      }
    }
    this.broadcast({ k: 'join', sid: seat.sid });
    return true;
  }

  addBot() {
    if (this.state !== 'lobby' || this.seats.length >= cfg.MAX_SEATS) return false;
    const id = Bots.identity(this.seats.map((s) => s.name));
    this.seats.push({ sid: 's' + ++this.seq, bot: true, player: null, accountId: null, ...id, color: this.freeColor(), away: false });
    return true;
  }

  removeBot(sid) {
    const s = this.seat(sid);
    if (this.state !== 'lobby' || !s || !s.bot) return false;
    this.seats = this.seats.filter((x) => x !== s);
    return true;
  }

  // Player left on purpose or their socket dropped.
  detach(player) {
    const seat = this.seat(player.sid);
    player.room = null;
    player.sid = null;
    if (!seat || seat.player !== player) return;
    if (this.state === 'lobby') {
      this.seats = this.seats.filter((s) => s !== seat);
      if (this.hostSid === seat.sid) this.hostSid = (this.humans()[0] || {}).sid || null;
    } else {
      seat.player = null;
      seat.away = true;
    }
    if (this.activeHumans().length === 0) {
      if (this.state === 'lobby') return this.mgr.closeRoom(this);
      // keep a running match alive briefly so a reload can take the seat back
      clearTimeout(this.graceTimer);
      this.graceTimer = setTimeout(() => { if (!this.activeHumans().length) this.mgr.closeRoom(this); }, cfg.REJOIN_GRACE_MS);
      return;
    }
    this.broadcast({ k: 'leave', sid: seat.sid });
  }

  rejoin(player, seat) {
    clearTimeout(this.graceTimer);
    seat.player = player;
    seat.away = false;
    player.room = this;
    player.sid = seat.sid;
    this.broadcast({ k: 'rejoin', sid: seat.sid });
  }

  updateIdentity(player) {
    const seat = this.seat(player.sid);
    if (!seat) return;
    Object.assign(seat, { name: player.account.name, avatar: player.account.avatar, country: player.account.country });
    this.broadcast({ k: 'identity', sid: seat.sid });
  }

  /* ---------- host controls (private tables) ---------- */
  host(player, action, arg) {
    if (!this.isPrivate || this.state !== 'lobby' || player.sid !== this.hostSid) return false;
    if (action === 'add_bot') { if (!this.addBot()) return false; }
    else if (action === 'remove_bot') { if (!this.removeBot(arg)) return false; }
    else if (action === 'mode') { this.mode = normMode(arg); }
    else if (action === 'topics') { this.picks = this.cleanPicks(arg); }
    else if (action === 'culture') { this.culture = normCulture(arg); this.picks = this.cleanPicks(this.picks); }
    else if (action === 'rounds') { this.rounds = normRounds(arg); this.picks = this.cleanPicks(this.picks); }
    else if (action === 'start') {
      if (this.seats.length < cfg.MIN_SEATS) return false;
      this.startFromLobby();
      return true;
    } else return false;
    this.broadcast({ k: 'lobby' });
    return true;
  }

  // Keep only ids the bank knows, once each, in the order chosen, up to the match size.
  cleanPicks(arg) {
    if (!Array.isArray(arg)) return [];
    const out = [];
    for (const id of arg) if (typeof id === 'string' && this.bank.inCulture(id, this.culture) && !out.includes(id)) out.push(id);
    return out.slice(0, this.rounds);
  }

  /* ---------- match ---------- */
  startFromLobby() {
    if (this.state !== 'lobby' || this.closed) return;
    if (!this.isPrivate) while (this.seats.length < Math.max(cfg.QUICK_TARGET, cfg.MIN_SEATS)) this.addBot();
    if (this.seats.length < cfg.MIN_SEATS) return;
    this.clearTimers();
    this.lobbyDeadline = 0;
    this.state = 'playing';
    const picked = this.picks;
    const rest = shuffle(this.bank.pool(this.culture).filter((id) => !picked.includes(id)));
    const ids = picked.concat(rest).slice(0, this.rounds);
    this.picks = [];
    const m = this.m = { topics: ids, t: -1, base: shuffle(this.seats.map((s) => s.sid)), scores: {}, cards: {}, stats: {}, history: [], standings: null };
    for (const s of this.seats) {
      m.scores[s.sid] = 0;
      m.cards[s.sid] = 0;
      m.stats[s.sid] = { votes: 0, loves: 0, crowdFav: false, perfectRead: false, openBook: false, busted: false, bargain: false, bigSpender: false, topicWins: 0, topics: 0 };
    }
    this.startTopic(0);
  }

  get T() { return this.m && this.m.topic; }

  startTopic(t) {
    const m = this.m;
    m.t = t;
    const id = m.topics[t];
    const n = this.bank.size(id);
    const T = m.topic = {
      id, layout: shuffle([...Array(n).keys()]), taken: {}, lineups: {}, tscore: {},
      round: -1, order: [], turn: -1, gap: false,
      mind: this.mode === 'mind' ? m.base[t % m.base.length] : null,
      secret: null, votes: {}, roundPicks: [], roundResult: null, reveal: null, winners: null,
    };
    for (const s of this.seats) { T.lineups[s.sid] = []; T.tscore[s.sid] = 0; }
    if (this.mode === 'auction') {
      // openedUpTo: the latest lot index that has been on the block; later cards stay face-down for everyone
      T.lot = null; T.purses = {}; T.lineupSize = Scoring.auctionLineup(this.seats.length); T.sold = []; T.unsold = []; T.openedUpTo = -1;
      for (const s of this.seats) T.purses[s.sid] = R.AUCTION_PURSE;
    }
    this.setPhase('intro', cfg.INTRO_MS, { k: 'topic' });
    this.later(cfg.INTRO_MS, () => (this.mode === 'crowd' ? this.startRound(0) : this.mode === 'mind' ? this.startSecret() : Auction.openLot(this, 0)));
  }

  draftOrder(t, r) {
    const b = this.m.base;
    let order = b.slice(t % b.length).concat(b.slice(0, t % b.length));
    if (this.mode === 'mind') order = order.filter((s) => s !== this.T.mind);
    return r % 2 === 0 ? order : order.reverse(); // snake
  }

  isDudRound() { return this.mode === 'crowd' && this.T.round === R.CROWD_ROUNDS - 1; }
  available() { const T = this.T; return T.layout.filter((o) => T.taken[o] === undefined); }

  startRound(r) {
    const T = this.T;
    T.round = r;
    T.order = this.draftOrder(this.m.t, r);
    T.turn = -1;
    T.roundPicks = [];
    T.votes = {};
    T.roundResult = null;
    this.nextTurn();
  }

  nextTurn() {
    const T = this.T;
    this.clearTimers();
    T.gap = false;
    T.turn++;
    if (T.turn >= T.order.length) return this.endDraftRound();
    const sid = T.order[T.turn];
    const seat = this.seat(sid);
    const ms = seat.away ? cfg.AWAY_TURN_MS : cfg.TURN_MS;
    this.setPhase('draft', ms, { k: 'turn', sid });
    if (seat.bot) this.later(Bots.delay(cfg.BOT_MIN_MS, cfg.BOT_MAX_MS), () => this.botPick(sid, false));
    this.later(ms, () => this.botPick(sid, true));
  }

  botPick(sid, auto) {
    const opt = Bots.draft(this.available(), this.ratings.get(this.T.id), this.isDudRound());
    this.pick(sid, opt, auto);
  }

  pick(sid, opt, auto = false) {
    const T = this.T;
    if (this.phase !== 'draft' || T.gap || T.order[T.turn] !== sid) return false;
    if (!Number.isInteger(opt) || opt < 0 || opt >= T.layout.length || T.taken[opt] !== undefined) return false;
    T.taken[opt] = sid;
    const kind = this.mode === 'mind' ? 'guess' : this.isDudRound() ? 'dud' : 'top';
    T.lineups[sid].push({ opt, round: T.round, kind });
    if (this.mode === 'crowd') T.roundPicks.push({ sid, opt });
    this.clearTimers();
    T.gap = true;
    this.deadline = 0;
    this.broadcast({ k: 'pick', sid, opt, auto: !!auto });
    this.later(cfg.PICK_GAP_MS, () => this.nextTurn());
    return true;
  }

  /* ----- Auction: bidding ----- */
  bid(sid, amount, lot) { return this.mode === 'auction' && this.m ? Auction.bid(this, sid, amount, lot) : false; }

  endDraftRound() {
    const T = this.T;
    if (this.mode === 'crowd') return this.startVote();
    if (T.round < R.MIND_ROUNDS - 1) return this.startRound(T.round + 1);
    return this.startReveal();
  }

  /* ----- Crowd pleaser: voting ----- */
  voters() { return this.seats.filter((s) => s.bot || (!s.away && s.player)); }

  startVote() {
    const T = this.T;
    T.votes = {};
    this.setPhase('vote', cfg.VOTE_MS, { k: 'vote' });
    const dud = this.isDudRound();
    for (const s of this.seats) {
      if (!s.bot) continue;
      const ms = Bots.delay(Math.min(1200, cfg.VOTE_MS * 0.15), cfg.VOTE_MS * 0.6);
      this.later(ms, () => {
        const c = Bots.vote(T.roundPicks.filter((p) => p.sid !== s.sid), this.ratings.get(T.id), dud);
        if (c) this.castVote(s.sid, c.sid);
      });
    }
    this.later(cfg.VOTE_MS, () => this.endVote());
  }

  castVote(voter, target) {
    const T = this.T;
    if (this.phase !== 'vote' || !T || T.votes[voter] !== undefined || voter === target) return false;
    if (!this.seat(voter) || !T.roundPicks.some((p) => p.sid === target)) return false;
    T.votes[voter] = target;
    this.broadcast({ k: 'voted', sid: voter });
    if (this.voters().every((s) => T.votes[s.sid] !== undefined)) {
      this.clearTimers();
      this.later(450, () => this.endVote());
    }
    return true;
  }

  endVote() {
    const T = this.T, m = this.m;
    if (this.phase !== 'vote') return;
    this.clearTimers();
    const ballots = Object.entries(T.votes).map(([voter, target]) => ({ voter, target }));
    const res = Scoring.crowdRound(T.roundPicks, ballots);
    for (const sid in res.points) { T.tscore[sid] += res.points[sid]; m.scores[sid] += res.points[sid]; }
    for (const sid in res.tally) {
      m.stats[sid].votes += res.tally[sid];
      const others = ballots.filter((b) => b.voter !== sid).length;
      if (others >= 3 && res.tally[sid] === others) m.stats[sid].crowdFav = true;
    }
    // only human ballots teach the crowd model
    const humanCounts = T.roundPicks.map((p) => ballots.filter((b) => b.target === p.sid && !this.seat(b.voter).bot).length);
    this.ratings.crowdRound(T.id, T.roundPicks.map((p) => p.opt), humanCounts, this.isDudRound());
    T.roundResult = { tally: res.tally, winners: res.winners, points: res.points, votes: { ...T.votes }, dud: this.isDudRound() };
    this.setPhase('round_result', cfg.ROUND_RESULT_MS, { k: 'round_result' });
    this.later(cfg.ROUND_RESULT_MS, () => (T.round < R.CROWD_ROUNDS - 1 ? this.startRound(T.round + 1) : this.endTopic()));
  }

  /* ----- Mind reader: the secret ----- */
  startSecret() {
    const T = this.T;
    const mind = this.seat(T.mind);
    this.setPhase('secret', cfg.SECRET_MS, { k: 'secret' });
    const auto = () => this.setSecret(T.mind, Bots.secret(this.ratings.get(T.id)), true);
    if (mind.bot || mind.away) this.later(Bots.delay(Math.min(1500, cfg.SECRET_MS * 0.2), Math.min(3500, cfg.SECRET_MS * 0.5)), auto);
    this.later(cfg.SECRET_MS, auto);
  }

  setSecret(sid, secret, auto = false) {
    const T = this.T;
    if (this.phase !== 'secret' || !T || sid !== T.mind || T.secret) return false;
    const n = T.layout.length;
    const loves = secret && secret.loves, dud = secret && secret.dud;
    const ok = Array.isArray(loves) && loves.length === 3 && [...loves, dud].every((x) => Number.isInteger(x) && x >= 0 && x < n)
      && new Set([...loves, dud]).size === 4;
    if (!ok) return false;
    T.secret = { loves: loves.slice(), dud, auto };
    if (!auto && !this.seat(sid).bot) this.ratings.mindSecret(T.id, loves, dud);
    this.clearTimers();
    this.broadcast({ k: 'secret_set' });
    this.later(700, () => this.startRound(0));
    return true;
  }

  startReveal() {
    const T = this.T, m = this.m;
    const guesses = {};
    for (const sid of m.base) if (sid !== T.mind) guesses[sid] = T.lineups[sid].map((x) => x.opt);
    const res = Scoring.mindTopic(T.secret, guesses, T.mind);
    for (const sid in res.points) { T.tscore[sid] += res.points[sid]; m.scores[sid] += res.points[sid]; }
    for (const sid in res.matches) {
      m.stats[sid].loves += res.matches[sid].length;
      if (res.matches[sid].length === 3) m.stats[sid].perfectRead = true;
    }
    for (const sid of res.busted) m.stats[sid].busted = true;
    if (res.readCount === 3) m.stats[T.mind].openBook = true;
    T.reveal = { loves: T.secret.loves, dud: T.secret.dud, ...res };
    const ms = 4 * cfg.REVEAL_STEP_MS + 2600;
    this.setPhase('reveal', ms, { k: 'reveal', step: cfg.REVEAL_STEP_MS });
    this.later(ms, () => this.endTopic());
  }

  /* ----- topic + match end ----- */
  endTopic() {
    const T = this.T, m = this.m;
    this.clearTimers();
    const max = Math.max(...Object.values(T.tscore));
    const winners = max > 0 ? Object.keys(T.tscore).filter((s) => T.tscore[s] === max) : [];
    for (const s of winners) { m.cards[s]++; m.stats[s].topicWins++; }
    for (const s in m.stats) m.stats[s].topics++;
    T.winners = winners;
    m.history.push({ id: T.id, winners, tscore: { ...T.tscore } });
    this.setPhase('topic_end', cfg.TOPIC_END_MS, { k: 'topic_end' });
    this.later(cfg.TOPIC_END_MS, () => (m.t + 1 < m.topics.length ? this.startTopic(m.t + 1) : this.endMatch()));
  }

  endMatch() {
    const m = this.m;
    m.standings = Scoring.standings(m.base, m.cards, m.scores);
    const humans = this.humans().length;
    this.state = 'over';
    this.setPhase('match_end', cfg.MATCH_END_MS, { k: 'match_end' });
    for (const seat of this.humans()) {
      const place = m.standings.indexOf(seat.sid);
      this.mgr.settleSeat(this, seat, { place, score: m.scores[seat.sid], humans, stats: m.stats[seat.sid] });
    }
    this.later(cfg.MATCH_END_MS, () => this.afterMatch());
  }

  afterMatch() {
    if (!this.isPrivate) return this.mgr.closeRoom(this, 'match_over');
    // private tables go back to their lobby with the same people
    this.seats = this.seats.filter((s) => s.bot || (s.player && !s.away));
    if (!this.seat(this.hostSid)) this.hostSid = (this.humans()[0] || {}).sid || null;
    if (!this.activeHumans().length) return this.mgr.closeRoom(this);
    this.state = 'lobby';
    this.m = null;
    this.setPhase('lobby', 0, { k: 'lobby' });
  }

  /* ---------- what each seat is allowed to see ---------- */
  snapshot(forSid) {
    const m = this.m, T = this.T;
    const ph = this.phase;
    return {
      id: this.id, code: this.code, mode: this.mode, isPrivate: this.isPrivate, ranked: this.ranked,
      state: this.state, phase: ph, deadline: this.deadline, lobbyDeadline: this.lobbyDeadline,
      hostSid: this.hostSid, you: forSid,
      picks: this.picks, maxPicks: this.rounds, culture: this.culture,
      seats: this.seats.map((s) => ({ sid: s.sid, name: s.name, avatar: s.avatar, country: s.country, color: s.color, bot: s.bot, away: s.away })),
      match: m && {
        t: m.t, total: m.topics.length, base: m.base, scores: m.scores, cards: m.cards, standings: m.standings,
        topic: T && {
          id: T.id, taken: T.taken, lineups: T.lineups, tscore: T.tscore,
          // in Auction each card is a surprise until its lot opens: unopened positions are sent as -1
          layout: this.mode === 'auction' ? T.layout.map((o, i) => (i <= T.openedUpTo ? o : -1)) : T.layout,
          round: T.round, order: T.order, dud: this.isDudRound(),
          turnSid: ph === 'draft' && !T.gap ? T.order[T.turn] : null,
          mind: T.mind, mindReady: !!T.secret,
          secret: T.secret && forSid === T.mind ? { loves: T.secret.loves, dud: T.secret.dud } : null,
          roundPicks: T.roundPicks,
          voted: ph === 'vote' ? Object.keys(T.votes) : null,
          myVote: ph === 'vote' ? (T.votes[forSid] || null) : null,
          roundResult: T.roundResult, reveal: T.reveal, winners: T.winners,
          lot: T.lot ? { i: T.lot.i, opt: T.lot.opt, opened: T.lot.opened, top: T.lot.top, bids: T.lot.bids } : null,
          purses: T.purses, lineupSize: T.lineupSize, sold: T.sold, unsold: T.unsold,
        },
      },
    };
  }
}

Room.normMode = normMode;
Room.normCulture = normCulture;
Room.normRounds = normRounds;
Room.MODES = MODES;
module.exports = Room;
