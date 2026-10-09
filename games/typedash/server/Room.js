'use strict';
const cfg = require('./config');
const passages = require('./passages');
const { clamp, sanitizeText } = require('./util');
const { makeBots } = require('./Bot');
const { machineLike } = require('./solo');

const LANE_COLORS = ['#4cc9f0', '#ff4d6d', '#ffd166', '#3ddc97', '#fbbf24', '#ff9e00', '#f72585', '#80ed99'];
const EMOTES = ['🔥', '😂', '👏', '🐢', '😱', '🏁', '💀', '❤️'];

const { pickBonusWords } = passages;

/**
 * A race room. State machine:
 *
 *   waiting -> countdown -> racing -> finished -> waiting -> ...
 *
 * All timing is driven by RoomManager.tick() at cfg.TICK_MS. Every transition
 * is broadcast as a single authoritative `room` message; during `racing` a
 * compact `snap` message goes out every tick, stamped with server time so
 * clients can interpolate between snapshots.
 */
class Room {
  constructor(manager, { code, isPrivate = false, lang = 'en', category = 'prose' }) {
    this.manager = manager;
    this.code = code;
    this.isPrivate = isPrivate;
    this.lang = lang;            // passages this room races on (see server/passages.js)
    this.category = category;
    this.hostId = null;
    this.players = new Map();

    this.state = 'waiting';
    this.raceNo = 0;
    this.passage = null;         // text of the current passage
    this.passageId = null;
    this.passageTitle = null;
    this.passageLang = null;
    this.passageCategory = null;
    this.lastPassageId = null;

    this.lobbyDeadline = null;   // waiting  : public auto-start time
    this.countdownEndsAt = null; // countdown: GO time
    this.startAt = null;         // racing   : GO time (authoritative t0)
    this.endAt = null;           // racing   : hard timeout
    this.firstFinishAt = null;
    this.humansDoneAt = null;
    this.finishOrder = 0;
    this.resultsUntil = null;    // finished : when the room resets
    this.results = null;
    this.bonusWords = [];        // golden word indices for the current race

    this.series = new Map();     // wins per player across races in this room
    this.lastTick = Date.now();
    this.lastChatAt = new Map();
    this.lastEmoteAt = new Map();
    this.lastRevAt = new Map();
  }

  /* ------------------------------------------------------------ members */

  /** Humans still connected; a racer who dropped mid race is kept for the results only. */
  get humans() { return [...this.players.values()].filter((p) => !p.isBot && !p.dropped); }

  /**
   * Public races are ranked: they feed the worldwide boards. Private rooms are
   * friendlies — they still keep your daily streak alive and update your
   * head-to-head record, but they can't be used to farm global points.
   */
  get ranked() { return !this.isPrivate || cfg.RANKED_PRIVATE; }
  get humanCount() { return this.humans.length; }
  get size() { return this.players.size; }
  get isFull() { return this.players.size >= cfg.MAX_PLAYERS; }

  nextColor() {
    const used = new Set([...this.players.values()].map((p) => p.color));
    return LANE_COLORS.find((c) => !used.has(c)) || LANE_COLORS[this.players.size % LANE_COLORS.length];
  }

  addPlayer(player, { silent = false } = {}) {
    if (player.room && player.room !== this) player.room.removePlayer(player);
    player.room = this;
    player.color = this.nextColor();
    player.resetRace();
    this.players.set(player.id, player);

    if (!player.isBot && (!this.hostId || !this.players.has(this.hostId))) this.hostId = player.id;

    if (!this.isPrivate && this.state === 'waiting' && !this.lobbyDeadline && this.humanCount > 0) {
      this.lobbyDeadline = Date.now() + cfg.LOBBY_WAIT_MS;
    }

    if (silent) return;
    this.broadcastState();
    if (!this.isPrivate && this.state === 'waiting' && this.isFull) this.startCountdown();
  }

  removePlayer(player) {
    if (!this.players.has(player.id)) return;
    this.players.delete(player.id);
    player.room = null;

    // Gone mid race (the connection dropped, Leave, or off to another room):
    // the racer stays in this race as `dropped`, placed below every finisher
    // and every racer still connected, and settled in last place. A copy is
    // kept, since the same connection may go on to race elsewhere. Coming
    // back is a new connection, and a race already running takes no one in
    // (RoomManager.join, quickMatch), so a racer who reconnects stays dropped
    // for this race and simply races the next one.
    if (this.state === 'racing' && !player.isBot) {
      this.players.set(player.id, Object.assign(Object.create(Object.getPrototypeOf(player)), player, { ws: null, room: null, dropped: true }));
    }

    if (this.hostId === player.id) {
      const h = this.humans[0];
      this.hostId = h ? h.id : null;
    }
    if (this.humanCount === 0) {
      this.manager.destroyRoom(this);
      return;
    }
    this.broadcast({ type: 'player_left', id: player.id, name: player.name });
    this.broadcastState();
  }

  fillBots() {
    const target = Math.min(cfg.BOT_FILL_TO, cfg.MAX_PLAYERS);
    const need = target - this.players.size;
    if (need <= 0) return;
    const used = new Set([...this.players.values()].map((p) => p.name.toLowerCase()));
    for (const bot of makeBots(need, used)) this.addPlayer(bot, { silent: true });
  }

  /* --------------------------------------------------------- transitions */

  hostStart(player, withBots) {
    if (!this.isPrivate) return player.send({ type: 'error', message: 'Public races start automatically.' });
    if (player.id !== this.hostId) return player.send({ type: 'error', message: 'Only the host can start the race.' });
    if (this.state !== 'waiting') return;
    if (withBots) this.fillBots();
    this.startCountdown();
  }

  startCountdown() {
    const now = Date.now();
    this.state = 'countdown';
    this.raceNo += 1;

    const p = passages.pick({ lang: this.lang, category: this.category, exclude: this.lastPassageId });
    this.passage = p.text;
    this.passageId = p.id;
    this.passageTitle = p.title;
    this.passageLang = p.lang;
    this.passageCategory = p.category;
    this.lastPassageId = p.id;
    this.bonusWords = pickBonusWords(p.text, cfg.BONUS_WORDS);

    this.countdownEndsAt = now + cfg.COUNTDOWN_MS;
    this.lobbyDeadline = null;
    this.startAt = null;
    this.endAt = null;
    this.firstFinishAt = null;
    this.humansDoneAt = null;
    this.finishOrder = 0;
    this.results = null;
    this.resultsUntil = null;
    for (const pl of this.players.values()) pl.resetRace();

    this.broadcastState(now);
  }

  startRace(now) {
    this.state = 'racing';
    this.startAt = now;
    this.endAt = now + cfg.RACE_TIMEOUT_MS;
    for (const pl of this.players.values()) pl.lastProgressAt = now;
    this.broadcastState(now);
  }

  endRace(now) {
    // Rank anyone still on the track by distance covered, then by speed.
    // Racers who dropped come last, whatever distance they had covered.
    const unfinished = [...this.players.values()]
      .filter((p) => !p.finished)
      .sort((a, b) => !!a.dropped - !!b.dropped || b.correct - a.correct || b.wpm - a.wpm);
    for (const p of unfinished) {
      p.rank = ++this.finishOrder;
      if (!p.dropped) this.updateWpm(p, now); // a dropped racer keeps the speed they left with
    }

    const len = this.passage.length;
    this.results = [...this.players.values()]
      .sort((a, b) => a.rank - b.rank)
      .map((p) => ({
        id: p.id, name: p.name, country: p.country, isBot: p.isBot, color: p.color,
        rank: p.rank, wpm: p.wpm, accuracy: p.accuracy, time: p.finishTime,
        progress: p.correct / len, finished: p.finished,
        score: p.score, bestCombo: p.bestCombo, golden: p.golden, skin: p.skin, dropped: !!p.dropped,
      }));

    for (const r of this.results) {
      if (r.rank === 1) this.series.set(r.id, (this.series.get(r.id) || 0) + 1);
    }
    this.settleAccounts();

    this.state = 'finished';
    this.resultsUntil = now + cfg.RESULTS_MS;
    this.broadcastSnapshot(now);
    this.broadcastState(now);
  }

  /**
   * Persist the race for every signed-in human: ranked points, daily streak,
   * lifetime stats, achievements and head-to-head records. Each player gets a
   * personal `race_result` with what they just earned.
   */
  settleAccounts() {
    const accounts = this.manager.accounts;
    if (!accounts) return;
    const humans = [...this.players.values()].filter((p) => !p.isBot); // dropped racers too, in last place
    const order = [...this.players.values()].sort((a, b) => a.rank - b.rank);
    const len = this.passage.length;

    // head-to-head first, so each player's own result carries the fresh record
    const placed = humans.filter((p) => p.account).sort((a, b) => a.rank - b.rank);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        accounts.recordHeadToHead(placed[i].account, placed[j].account);
      }
    }

    for (const p of humans) {
      if (!p.account) continue;
      const lane = order.findIndex((x) => x.id === p.id) + 1;
      // faster than the ranked ceiling, or typed along a ruler: the race counts, unranked and with no record
      const flagged = p.wpm > cfg.RANKED_MAX_WPM || machineLike(p.timeline);
      // a finished race is the most trustworthy ghost there is: server-timed, server-validated
      const ghost = this.manager.ghosts && p.finished && !flagged
        ? this.manager.ghosts.consider(p.account, { passageId: this.passageId, finished: true, verified: true, wpm: p.wpm, accuracy: p.accuracy, time: p.finishTime, timeline: p.timeline })
        : { wr: false, pb: false };
      const out = accounts.recordRace(p.account, {
        rank: p.rank,
        wpm: p.wpm,
        accuracy: p.accuracy,
        errors: p.errors,
        finished: p.finished,
        dropped: !!p.dropped,
        flagged,
        chars: p.correct,
        golden: p.golden,
        goldenTotal: this.bonusWords.length,
        bestCombo: p.bestCombo,
        nitros: p.nitros,
        score: p.score,
        lane,
        racers: this.players.size,
        humans: humans.length,
        ranked: this.ranked,
        setWr: ghost.wr,
        lang: this.passageLang,
        category: this.passageCategory,
      });
      // remembered in memory only; it becomes a public share page if the player shares it
      const resultId = this.manager.shares ? this.manager.shares.remember(p.account.id, {
        kind: 'race', name: p.name, country: p.country, skin: p.skin, color: p.color,
        wpm: p.wpm, accuracy: p.accuracy, time: p.finishTime, rank: p.rank, of: this.players.size,
        ranked: this.ranked, points: out.points, streak: out.streak, passageId: this.passageId, passageTitle: this.passageTitle,
      }) : null;
      p.send({
        type: 'race_result',
        resultId,
        ghost: { wr: ghost.wr, pb: ghost.pb, prevWr: ghost.prevWr || null },
        points: out.points,
        ranked: out.ranked,
        flagged,
        streak: out.streak,
        bestStreak: out.bestStreak,
        streakEvent: out.streakEvent,
        unlocked: out.unlocked,
        profile: accounts.profile(p.account),
        standings: this.manager.boards ? this.manager.boards.standings(p.account) : [],
        series: this.seriesRows(),
      });
    }

    if (this.manager.onRaceSettled) this.manager.onRaceSettled();
  }

  seriesRows() {
    return [...this.players.values()]
      .filter((p) => !p.isBot)
      .map((p) => ({ id: p.id, name: p.name, country: p.country, color: p.color, wins: this.series.get(p.id) || 0 }))
      .sort((a, b) => b.wins - a.wins);
  }

  resetForNext(now) {
    for (const p of [...this.players.values()]) {
      if (p.isBot || p.dropped) { this.players.delete(p.id); p.room = null; }
    }
    this.state = 'waiting';
    this.passage = null;
    this.bonusWords = [];
    this.results = null;
    this.resultsUntil = null;
    this.startAt = null;
    this.endAt = null;
    this.countdownEndsAt = null;
    this.firstFinishAt = null;
    this.humansDoneAt = null;
    this.finishOrder = 0;
    for (const p of this.players.values()) p.resetRace();

    if (this.humanCount === 0) return this.manager.destroyRoom(this);
    if (!this.isPrivate) this.lobbyDeadline = now + cfg.LOBBY_WAIT_MS;
    this.broadcastState(now);
  }

  /* ------------------------------------------------------------- racing */

  updateWpm(p, now) {
    const minutes = (now - this.startAt) / 60000;
    p.wpm = minutes > 0.015 ? Math.round((p.correct / 5) / minutes) : 0;
  }

  /**
   * Client reports its committed progress. The server is authoritative: it
   * clamps to the passage, enforces a typing-rate ceiling and recomputes WPM
   * from its own clock, so a modified client cannot teleport to the finish.
   */
  handleProgress(player, msg) {
    if (this.state !== 'racing') return;
    if (player.finished) { // only the final score (finish bonus) may still change
      this.applyGameFields(player, msg, player.correct);
      player.nitro = false;
      return;
    }
    const now = Date.now();
    const len = this.passage.length;

    let correct = clamp(Number(msg.c) | 0, 0, len);
    const typed = clamp(Number(msg.t) | 0, 0, len + 20);
    const keystrokes = Math.max(player.keystrokes, Number(msg.k) | 0);
    const errors = clamp(Number(msg.e) | 0, 0, keystrokes);

    const sinceStart = (now - this.startAt) / 1000;
    const sinceLast = (now - player.lastProgressAt) / 1000;
    const ceiling = Math.floor(Math.min(
      player.correct + cfg.MAX_CPS * sinceLast + 4,
      cfg.MAX_CPS * sinceStart + 4,
    ));
    if (correct > ceiling) {
      correct = ceiling;
      player.flagged += 1;
    }

    player.correct = correct;
    player.typed = typed;
    player.keystrokes = keystrokes;
    player.errors = errors;
    player.accuracy = keystrokes > 0 ? Math.floor(((keystrokes - errors) / keystrokes) * 100) : 100;
    player.lastProgressAt = now;
    this.updateWpm(player, now);

    if (correct > player.lastSampled && (now - player.lastSampleAt >= 250 || correct >= len) && player.timeline.length < 400) {
      player.timeline.push([now - this.startAt, correct]);
      player.lastSampleAt = now;
      player.lastSampled = correct;
    }

    this.applyGameFields(player, msg, correct);

    if (correct >= len) this.finishPlayer(player, now);
  }

  /**
   * Game layer: combo/nitro/score/golden words are computed on the client for
   * responsiveness and only sanity-clamped here. They never affect progress or
   * the race ranking, so a modified client can only inflate its own score.
   */
  applyGameFields(player, msg, correct) {
    player.nitro = !!msg.n;
    if (msg.s != null) player.score = clamp(Number(msg.s) | 0, 0, correct * cfg.MAX_SCORE_PER_CHAR + 3000);
    if (msg.x != null) player.bestCombo = clamp(Number(msg.x) | 0, 0, Math.max(player.bestCombo, correct));
    if (msg.g != null) player.golden = clamp(Number(msg.g) | 0, 0, this.bonusWords.length);
    if (msg.z != null) player.nitros = clamp(Number(msg.z) | 0, 0, 200);
  }

  finishPlayer(p, now) {
    p.finished = true;
    p.finishTime = now - this.startAt;
    p.rank = ++this.finishOrder;
    p.nitro = false;
    this.updateWpm(p, now);
    if (!this.firstFinishAt) this.firstFinishAt = now;

    this.broadcast({ type: 'finished', id: p.id, rank: p.rank, time: p.finishTime, wpm: p.wpm, accuracy: p.accuracy });
  }

  /* --------------------------------------------------------------- tick */

  /**
   * When the running race ends, by the server's clock: the hard timeout, or
   * sooner once someone has finished (AFTER_FIRST_FINISH_MS) or every human
   * is done (HUMANS_DONE_GRACE_MS). Racers see it counting down once the
   * first one is home, so it is sent with every snapshot from then on.
   */
  get closesAt() {
    return Math.min(
      this.endAt,
      this.firstFinishAt ? this.firstFinishAt + cfg.AFTER_FIRST_FINISH_MS : Infinity,
      this.humansDoneAt ? this.humansDoneAt + cfg.HUMANS_DONE_GRACE_MS : Infinity,
    );
  }

  tick(now) {
    const dt = now - this.lastTick;
    this.lastTick = now;

    switch (this.state) {
      case 'waiting':
        if (!this.isPrivate && this.lobbyDeadline && now >= this.lobbyDeadline) {
          this.fillBots();
          this.startCountdown();
        }
        break;

      case 'countdown':
        if (now >= this.countdownEndsAt) this.startRace(now);
        break;

      case 'racing': {
        const len = this.passage.length;
        for (const p of this.players.values()) {
          if (p.isBot) {
            p.tick(now, dt, this.startAt, len);
            if (!p.finished && p.correct >= len) this.finishPlayer(p, now);
          }
          if (!p.finished && !p.dropped) this.updateWpm(p, now);
        }

        const everyone = [...this.players.values()];
        const allDone = everyone.every((p) => p.finished || p.dropped);
        const humansDone = this.humans.every((p) => p.finished);
        if (humansDone && !this.humansDoneAt) this.humansDoneAt = now;
        this.broadcastSnapshot(now);

        if (allDone || now >= this.closesAt) this.endRace(now);
        break;
      }

      case 'finished':
        if (now >= this.resultsUntil) this.resetForNext(now);
        break;

      default:
        break;
    }
  }

  /* ---------------------------------------------------------- messaging */

  handleChat(player, rawText) {
    const now = Date.now();
    const last = this.lastChatAt.get(player.id) || 0;
    if (now - last < cfg.CHAT_MIN_INTERVAL_MS) return;
    const text = sanitizeText(rawText, cfg.MAX_CHAT_LEN);
    if (!text) return;
    this.lastChatAt.set(player.id, now);
    this.broadcast({ type: 'chat', from: player.info(), text, t: now });
  }

  /** Pure flair: mashing keys before the start revs your engine for everyone. */
  handleRev(player) {
    if (this.state !== 'waiting' && this.state !== 'countdown') return;
    const now = Date.now();
    const last = this.lastRevAt.get(player.id) || 0;
    if (now - last < cfg.REV_MIN_INTERVAL_MS) return;
    this.lastRevAt.set(player.id, now);
    this.broadcast({ type: 'rev', id: player.id });
  }

  handleEmote(player, raw) {
    const e = EMOTES.includes(raw) ? raw : null;
    if (!e) return;
    const now = Date.now();
    const last = this.lastEmoteAt.get(player.id) || 0;
    if (now - last < cfg.EMOTE_MIN_INTERVAL_MS) return;
    this.lastEmoteAt.set(player.id, now);
    this.broadcast({ type: 'emote', id: player.id, e });
  }

  fullState(now = Date.now()) {
    return {
      type: 'room',
      code: this.code,
      isPrivate: this.isPrivate,
      hostId: this.hostId,
      state: this.state,
      raceNo: this.raceNo,
      maxPlayers: cfg.MAX_PLAYERS,
      players: [...this.players.values()].map((p) => p.info()),
      passage: this.state === 'waiting' ? null : this.passage,
      passageId: this.state === 'waiting' ? null : this.passageId,
      passageTitle: this.state === 'waiting' ? null : this.passageTitle,
      passageLang: this.state === 'waiting' ? null : this.passageLang,
      lang: this.lang,
      category: this.category,
      bonusWords: this.state === 'waiting' ? [] : this.bonusWords,
      emotes: EMOTES,
      ranked: this.ranked,
      series: this.seriesRows(),
      lobbyDeadline: this.lobbyDeadline,
      countdownEndsAt: this.countdownEndsAt,
      startAt: this.startAt,
      endAt: this.endAt,
      closesAt: this.state === 'racing' && this.firstFinishAt ? this.closesAt : null,
      resultsUntil: this.resultsUntil,
      results: this.results,
      serverTime: now,
    };
  }

  broadcastState(now) {
    this.broadcast(this.fullState(now));
  }

  broadcastSnapshot(now) {
    const msg = { type: 'snap', t: now, p: [...this.players.values()].map((p) => p.snap()) };
    if (this.state === 'racing' && this.firstFinishAt) msg.e = this.closesAt; // the race ends then (server time)
    this.broadcast(msg);
  }

  broadcast(msg) {
    const str = JSON.stringify(msg);
    for (const p of this.players.values()) if (!p.isBot) p.sendRaw(str);
  }
}

Room.EMOTES = EMOTES;
Room.pickBonusWords = pickBonusWords;
module.exports = Room;
