'use strict';
const cfg = require('./config');
const { roomCode, sanitizeText } = require('./util');
const { makeBots } = require('./Bot');
const { Bank } = require('./puzzles');
const Scoring = require('../shared/scoring');

const EMOTES = ['🔥', '😂', '🤯', '🐢', '😱', '🎯', '💀', '❤️'];
const LANGS = ['mix', 'js', 'py'];

/**
 * A multiplayer match room. Public rooms loop forever:
 *
 *   waiting → starting → (round → reveal)×N → finished → waiting
 *
 * The server owns every clock, grades every answer and computes every point;
 * clients only ever send "here is what I think the output is". State messages
 * are kept small: a round carries the puzzle *id* and the client renders the
 * snippet from its cached bank, so the server never re-sends source code.
 * (Solo Rush does not use rooms at all — see server/rush.js.)
 */
class Room {
  constructor(manager, { isPrivate = false, lang = 'mix', rounds = cfg.ROUNDS } = {}) {
    this.manager = manager;
    this.bank = manager.bank;
    this.code = roomCode(5);
    this.isPrivate = isPrivate;
    this.mode = 'match';
    this.lang = LANGS.includes(lang) ? lang : 'mix';
    this.totalRounds = Math.max(3, Math.min(15, rounds | 0 || cfg.ROUNDS));
    this.hostId = null;
    this.players = new Map();
    this.state = 'waiting';
    this.gameNo = 0;
    this.roundNo = 0;
    this.puzzle = null;
    this.seen = new Set();
    this.lobbyDeadline = null;
    this.startEndsAt = null;
    this.roundStartAt = null;
    this.roundEndsAt = null;
    this.roundDeadline = null;
    this.revealUntil = null;
    this.resultsUntil = null;
    this.lastReveal = null;
    this.results = null;
    this.firstCorrectId = null;
    this.series = new Map();
    this.lastEmoteAt = new Map();
    this.createdAt = Date.now();
  }

  get humans() { return [...this.players.values()].filter((p) => !p.isBot); }
  get bots() { return [...this.players.values()].filter((p) => p.isBot); }
  get isFull() { return this.players.size >= cfg.MAX_PLAYERS; }
  get inProgress() { return this.state === 'starting' || this.state === 'round' || this.state === 'reveal'; }
  get ranked() { return !this.isPrivate || cfg.RANKED_PRIVATE; }
  get roundMs() { return cfg.ROUND_MS; }

  /* ------------------------------------------------------------ membership */

  addPlayer(player) {
    if (this.isFull) return { ok: false, error: 'That room is full.' };
    if (this.inProgress && !player.isBot) return { ok: false, error: 'A match is in progress there. Try again in a minute.' };
    player.room = this;
    player.resetGame();
    this.players.set(player.id, player);
    if (!this.hostId && !player.isBot) this.hostId = player.id;
    if (this.state === 'waiting' && !this.isPrivate && !this.lobbyDeadline && this.humans.length) {
      this.lobbyDeadline = Date.now() + cfg.LOBBY_WAIT_MS;
    }
    this.broadcastState();
    return { ok: true };
  }

  removePlayer(player) {
    if (!this.players.has(player.id)) return;
    this.players.delete(player.id);
    player.room = null;
    if (this.hostId === player.id) {
      const next = this.humans[0];
      this.hostId = next ? next.id : null;
    }
    this.broadcast({ type: 'player_left', id: player.id, name: player.name });
    if (!this.humans.length) {
      this.manager.retire(this);
      return;
    }
    if (this.state === 'round') this.maybeReveal(Date.now());
    this.broadcastState();
  }

  fillBots() {
    const need = Math.max(0, cfg.BOT_FILL_TO - this.players.size);
    if (!need) return;
    const used = new Set([...this.players.values()].map((p) => p.name));
    for (const b of makeBots(need, used)) {
      b.room = this;
      b.resetGame();
      this.players.set(b.id, b);
    }
  }

  removeBots() {
    for (const b of this.bots) this.players.delete(b.id);
  }

  hostStart(player, { bots = true, lang, rounds } = {}) {
    if (!this.isPrivate || this.hostId !== player.id || this.state !== 'waiting') return;
    if (lang && LANGS.includes(lang)) this.lang = lang;
    if (rounds) this.totalRounds = Math.max(3, Math.min(15, rounds | 0));
    if (bots) this.fillBots();
    this.startGame(Date.now());
  }

  /* ------------------------------------------------------------- lifecycle */

  startGame(now) {
    this.gameNo += 1;
    this.roundNo = 0;
    this.state = 'starting';
    this.lobbyDeadline = null;
    this.results = null;
    this.lastReveal = null;
    for (const p of this.players.values()) p.resetGame();
    this.startEndsAt = now + cfg.START_MS;
    this.broadcastState(now);
  }

  beginRound(now) {
    this.roundNo += 1;
    this.state = 'round';
    this.firstCorrectId = null;
    this.lastReveal = null;
    this.puzzle = this.pickPuzzle();
    this.seen.add(this.puzzle.id);
    if (this.seen.size >= this.bank.size - 2) this.seen.clear();
    this.roundStartAt = now;
    this.roundEndsAt = now + this.roundMs;
    this.roundDeadline = this.roundEndsAt;   // original deadline; speed bonus is measured against this
    for (const p of this.players.values()) {
      p.resetRound();
      if (p.isBot) p.planRound(this.puzzle, now, this.roundMs);
    }
    this.broadcastState(now);
  }

  /** Difficulty ramps with the round number so a match warms up. */
  pickPuzzle() {
    const frac = (this.roundNo - 1) / Math.max(1, this.totalRounds - 1);
    let minDiff = 1;
    let maxDiff = 5;
    if (frac < 0.25) maxDiff = 2;
    else if (frac < 0.6) maxDiff = 3;
    else if (frac < 0.85) { minDiff = 2; maxDiff = 4; }
    else minDiff = 3;
    return this.bank.pick({ lang: this.lang, minDiff, maxDiff, seen: this.seen });
  }

  /* --------------------------------------------------------------- answers */

  handleAnswer(player, msg) {
    if (this.state !== 'round' || player.locked || !this.puzzle) return;
    const raw = Array.isArray(msg.lines) ? msg.lines : [];
    const lines = raw.slice(0, cfg.MAX_ANSWER_LINES).map((l) => String(l == null ? '' : l).slice(0, cfg.MAX_ANSWER_LINE_LEN).replace(/[\u0000-\u0008\u000b-\u001f]/g, ''));
    const now = Date.now();
    player.answer = Scoring.normalizeOutput(lines.join('\n'));
    if (!player.answer.length) player.answer = [''];
    player.answerAt = now;
    this.broadcast({ type: 'locked', id: player.id, t: now - this.roundStartAt });
    this.maybeReveal(now);
  }

  /** Multiple-choice lifeline: halves this round's points, but you get four options. */
  handleLifeline(player) {
    if (this.state !== 'round' || player.locked || player.lifeline || !this.puzzle) return;
    player.lifeline = true;
    player.lifelines += 1;
    player.choices = this.bank.choices(this.puzzle);
    player.send({ type: 'lifeline', choices: player.choices });
    this.broadcast({ type: 'lifeline_used', id: player.id });
  }

  /**
   * Reveal as soon as everyone has locked in. Once every human is done the
   * clock is cut short so lingering bots don't hold the room hostage.
   */
  maybeReveal(now) {
    const allDone = [...this.players.values()].every((p) => p.locked || (p.isBot && p.plan && p.plan.skip) || (!p.isBot && !p.connected));
    if (allDone) return this.reveal(now);
    const humansDone = this.humans.every((p) => p.locked || !p.connected);
    if (humansDone) {
      const cap = now + cfg.AFTER_HUMANS_MS;
      if (this.roundEndsAt > cap) {
        this.roundEndsAt = cap;
        this.broadcast({ type: 'clock', roundEndsAt: cap });
      }
    }
  }

  /* ---------------------------------------------------------------- grading */

  grade(player) {
    const pz = this.puzzle;
    const answer = player.answer;
    const g = Scoring.grade(answer, pz.output);
    const first = g.full && !this.firstCorrectId;
    const { points, bonus } = Scoring.roundPoints({
      difficulty: pz.difficulty, full: g.full, correctLines: g.correctLines, totalLines: pz.output.length,
      answered: !!answer, msLeft: answer ? this.roundDeadline - player.answerAt : 0, roundMs: this.roundMs,
      comboBefore: player.combo, first, lifeline: player.lifeline,
    });
    if (g.full) {
      if (first) this.firstCorrectId = player.id;
      player.combo += 1;
      player.bestCombo = Math.max(player.bestCombo, player.combo);
      player.correctRounds += 1;
      player.langs[pz.lang].correct += 1;
      const ms = player.answerAt - this.roundStartAt;
      player.fastestMs = player.fastestMs == null ? ms : Math.min(player.fastestMs, ms);
    } else {
      player.combo = 0;
    }
    player.score += points;
    player.roundsPlayed += 1;
    player.langs[pz.lang].rounds += 1;
    if (player.answerAt) player.totalAnswerMs += player.answerAt - this.roundStartAt;
    player.roundResult = {
      id: player.id, answered: !!answer, answer: answer || [], lines: g.lines, correct: g.full, points, combo: player.combo,
      score: player.score, lifeline: player.lifeline, ms: player.answerAt ? player.answerAt - this.roundStartAt : null, bonus,
    };
    return player.roundResult;
  }

  reveal(now) {
    if (this.state !== 'round') return;
    this.state = 'reveal';
    // grade in lock-in order so "first correct" is honoured
    const order = [...this.players.values()].sort((a, b) => (a.answerAt || Infinity) - (b.answerAt || Infinity));
    const results = order.map((p) => this.grade(p));
    const standings = this.standings();
    const last = this.roundNo >= this.totalRounds;
    this.revealUntil = now + cfg.REVEAL_MS;
    this.lastReveal = {
      type: 'reveal',
      roundNo: this.roundNo,
      puzzleId: this.puzzle.id,
      output: this.puzzle.output,
      explain: this.puzzle.explain,
      tags: this.puzzle.tags,
      results,
      standings,
      firstCorrectId: this.firstCorrectId,
      last,
      revealUntil: this.revealUntil,
      serverTime: now,
    };
    this.broadcast(this.lastReveal);
    this.broadcastState(now);
  }

  standings() {
    return [...this.players.values()]
      .sort((a, b) => b.score - a.score || a.totalAnswerMs - b.totalAnswerMs || a.name.localeCompare(b.name))
      .map((p, i) => ({ id: p.id, name: p.name, country: p.country, avatar: p.avatar, isBot: p.isBot, score: p.score, combo: p.combo, rank: i + 1, correct: p.correctRounds }));
  }

  finish(now) {
    this.state = 'finished';
    const standings = this.standings();
    for (const s of standings) { const p = this.players.get(s.id); if (p) p.rank = s.rank; }
    this.results = standings.map((s) => {
      const p = this.players.get(s.id);
      return { ...s, bestCombo: p.bestCombo, rounds: p.roundsPlayed, lifelines: p.lifelines, fastestMs: p.fastestMs };
    });
    if (this.results[0]) this.series.set(this.results[0].id, (this.series.get(this.results[0].id) || 0) + 1);
    this.resultsUntil = now + cfg.RESULTS_MS;
    this.broadcastState(now);   // results screen first…
    this.settleAccounts();      // …then each player's personal settlement
  }

  settleAccounts() {
    const accounts = this.manager.accounts;
    if (!accounts) return;
    const humans = this.humans;
    const placed = humans.filter((p) => p.account).sort((a, b) => a.rank - b.rank);
    for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) accounts.recordHeadToHead(placed[i].account, placed[j].account);
    for (const p of humans) {
      if (!p.account) continue;
      const out = accounts.recordGame(p.account, {
        mode: 'match',
        rank: p.rank,
        rounds: p.roundsPlayed,
        correct: p.correctRounds,
        bestCombo: p.bestCombo,
        score: p.score,
        lifelines: p.lifelines,
        fastestMs: p.fastestMs,
        langs: p.langs,
        racers: this.players.size,
        humans: humans.length,
        ranked: this.ranked,
      });
      p.send({
        type: 'game_result',
        mode: 'match',
        points: out.points,
        ranked: out.ranked,
        perfect: out.perfect,
        streak: out.streak,
        bestStreak: out.bestStreak,
        streakEvent: out.streakEvent,
        unlocked: out.unlocked,
        profile: accounts.profile(p.account),
        standings: this.manager.boards ? this.manager.boards.standings(p.account) : [],
        series: this.seriesRows(),
      });
    }
    if (this.manager.onGameSettled) this.manager.onGameSettled();
  }

  resetForNext(now) {
    this.removeBots();
    this.state = 'waiting';
    this.roundNo = 0;
    this.puzzle = null;
    this.lastReveal = null;
    this.results = null;
    for (const p of this.players.values()) p.resetGame();
    this.lobbyDeadline = !this.isPrivate && this.humans.length ? now + cfg.LOBBY_WAIT_MS : null;
    this.broadcastState(now);
  }

  /* ------------------------------------------------------------------ tick */

  tick(now) {
    switch (this.state) {
      case 'waiting':
        if (!this.isPrivate && this.lobbyDeadline && now >= this.lobbyDeadline) {
          if (!this.humans.length) { this.lobbyDeadline = null; return; }
          this.fillBots();
          this.startGame(now);
        }
        return;
      case 'starting':
        if (now >= this.startEndsAt) this.beginRound(now);
        return;
      case 'round': {
        let changed = false;
        for (const b of this.bots) {
          if (b.tick(now)) { changed = true; this.broadcast({ type: 'locked', id: b.id, t: now - this.roundStartAt }); }
        }
        if (now >= this.roundEndsAt) this.reveal(now);
        else if (changed) this.maybeReveal(now);
        return;
      }
      case 'reveal':
        if (now >= this.revealUntil) {
          if (this.lastReveal && this.lastReveal.last) this.finish(now);
          else this.beginRound(now);
        }
        return;
      case 'finished':
        if (now >= this.resultsUntil) this.resetForNext(now);
        return;
      default:
    }
  }

  /* ------------------------------------------------------------- messaging */

  handleChat(player, text) {
    const clean = sanitizeText(text, cfg.MAX_CHAT_LEN);
    if (!clean) return;
    const now = Date.now();
    if (now - player.lastChatAt < cfg.CHAT_MIN_INTERVAL_MS) return;
    player.lastChatAt = now;
    this.broadcast({ type: 'chat', from: { id: player.id, name: player.name, country: player.country, avatar: player.avatar }, text: clean, t: now });
  }

  handleEmote(player, raw) {
    const e = EMOTES.includes(raw) ? raw : null;
    if (!e) return;
    const now = Date.now();
    if (now - (this.lastEmoteAt.get(player.id) || 0) < cfg.EMOTE_MIN_INTERVAL_MS) return;
    this.lastEmoteAt.set(player.id, now);
    this.broadcast({ type: 'emote', id: player.id, e });
  }

  seriesRows() {
    return this.humans.map((p) => ({ id: p.id, name: p.name, country: p.country, avatar: p.avatar, wins: this.series.get(p.id) || 0 })).sort((a, b) => b.wins - a.wins);
  }

  fullState(now = Date.now()) {
    return {
      type: 'room',
      code: this.code,
      isPrivate: this.isPrivate,
      hostId: this.hostId,
      mode: this.mode,
      lang: this.lang,
      ranked: this.ranked,
      state: this.state,
      gameNo: this.gameNo,
      roundNo: this.roundNo,
      totalRounds: this.totalRounds,
      maxPlayers: cfg.MAX_PLAYERS,
      players: [...this.players.values()].map((p) => p.info()),
      // the client renders the snippet from its cached bank; only the id travels
      puzzleId: this.state === 'round' || this.state === 'reveal' ? this.puzzle.id : null,
      lines: this.state === 'round' || this.state === 'reveal' ? this.puzzle.output.length : null,
      lobbyDeadline: this.lobbyDeadline,
      startEndsAt: this.state === 'starting' ? this.startEndsAt : null,
      roundStartAt: this.state === 'round' || this.state === 'reveal' ? this.roundStartAt : null,
      roundEndsAt: this.state === 'round' ? this.roundEndsAt : null,
      roundMs: this.roundMs,
      revealUntil: this.state === 'reveal' ? this.revealUntil : null,
      reveal: this.state === 'reveal' ? this.lastReveal : null,
      resultsUntil: this.state === 'finished' ? this.resultsUntil : null,
      results: this.state === 'finished' ? this.results : null,
      series: this.seriesRows(),
      emotes: EMOTES,
      serverTime: now,
    };
  }

  broadcastState(now = Date.now()) { this.broadcast(this.fullState(now)); }

  broadcast(obj) {
    const raw = JSON.stringify(obj);
    for (const p of this.players.values()) p.sendRaw(raw);
  }
}

Room.EMOTES = EMOTES;
Room.LANGS = LANGS;
module.exports = Room;
