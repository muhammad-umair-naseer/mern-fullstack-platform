/**
 * Solo Rush, played in the browser and dealt by the server.
 *
 * The engine emits the same message shapes the multiplayer server does
 * (`room`, `reveal`, `game_result`), so the arena UI renders a Rush run with
 * the exact code paths it uses for a live match. The server deals each puzzle
 * (`/api/rush/next`), times it, and sends its answer only once the round is
 * closed (`/api/rush/answer`); at the end it scores the log it kept itself
 * (server/rush.js). No room and no socket is held for a Rush player.
 */
const Scoring = window.GotchaScoring;
const { RULES } = Scoring;
const REVEAL_MS = 20000;
const START_MS = 3000;
const CODE = 'RUSH';

export class RushEngine {
  /**
   * @param {object} o { bank, lang, me:{id,name,country,avatar}, now:()=>ms, emit:(msg)=>void, credentials:{accountId,token} }
   */
  constructor(o) {
    this.bank = o.bank;
    this.lang = o.lang;
    this.me = o.me;
    this.now = o.now;
    this.emit = o.emit;
    this.credentials = o.credentials;
    this.identity = o.identity || {};
    this.state = 'starting';
    this.roundNo = 0;
    this.lives = RULES.RUSH_LIVES;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.correct = 0;
    this.lifelines = 0;
    this.fastestMs = null;
    this.log = [];
    this.puzzle = null;
    this.answer = null;
    this.answerAt = null;
    this.lifeline = false;
    this.timer = null;
    this.gameNo = 1;
    this.run = null;
    this.started = this.call('/api/rush/start', { ...this.credentials, lang: this.lang }).then((j) => { this.run = j.run; });
    this.started.catch(() => {});   // reported when the first round asks for it
    this.startEndsAt = this.now() + START_MS;
    this.broadcast();
    this.schedule(() => this.beginRound(), START_MS);
  }

  async call(url, body) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
    return j;
  }

  /** One step of the server's run: next, choices or answer. */
  round(step, extra = {}) {
    return this.call(`/api/rush/${step}`, { accountId: this.credentials.accountId, run: this.run, ...extra });
  }

  fail(err) {
    this.stop();
    this.emit({ type: 'error', message: `Rush stopped: ${err.message}` });
  }

  schedule(fn, ms) { clearTimeout(this.timer); this.timer = setTimeout(fn, ms); }
  stop() { clearTimeout(this.timer); this.state = 'stopped'; }

  get roundMs() { return Scoring.rushRoundMs(this.roundNo); }

  player() {
    return { ...this.me, isBot: false, score: this.score, combo: this.combo, locked: this.answer !== null, lifeline: this.lifeline, lives: this.lives, rank: 1, connected: true };
  }

  /** Full state in the server's `room` shape. */
  broadcast() {
    const now = this.now();
    this.emit({
      type: 'room', code: CODE, isPrivate: true, hostId: this.me.id, mode: 'rush', lang: this.lang, ranked: true, state: this.state,
      gameNo: this.gameNo, roundNo: this.roundNo, totalRounds: null, maxPlayers: 1, players: [this.player()],
      puzzleId: this.puzzle ? this.puzzle.id : null, lines: this.puzzle ? this.puzzle.lines : null,
      lobbyDeadline: null, startEndsAt: this.state === 'starting' ? this.startEndsAt : null,
      roundStartAt: this.roundStartAt || null, roundEndsAt: this.state === 'round' ? this.roundEndsAt : null, roundMs: this.roundMs,
      revealUntil: this.state === 'reveal' ? this.revealUntil : null, reveal: this.state === 'reveal' ? this.lastReveal : null,
      resultsUntil: this.state === 'finished' ? this.resultsUntil : null, results: this.state === 'finished' ? this.results : null,
      lives: this.lives, series: [], emotes: [], serverTime: now, local: true,
    });
  }

  async beginRound() {
    let deal;
    try {
      await this.started;
      deal = await this.round('next');
    } catch (err) { return this.fail(err); }
    if (this.state === 'stopped') return undefined;
    if (deal.over) return this.finish();
    const puzzle = this.bank.get(deal.id);
    if (!puzzle) return this.fail(new Error('the puzzle list changed. Reload the page.'));
    this.roundNo = deal.roundNo;
    this.state = 'round';
    this.answer = null;
    this.answerAt = null;
    this.lifeline = false;
    this.lastReveal = null;
    this.puzzle = puzzle;
    this.roundStartAt = this.now();
    this.roundEndsAt = this.roundStartAt + this.roundMs;
    this.broadcast();
    this.schedule(() => this.reveal(), this.roundMs);
    return undefined;
  }

  /** Same message names the socket uses, so the UI needs no special casing. */
  handle(msg) {
    if (msg.type === 'answer') return this.lockIn(msg.lines);
    if (msg.type === 'lifeline') return this.useLifeline();
    if (msg.type === 'next') return this.next();
    if (msg.type === 'leave') return this.stop();
    return undefined;
  }

  lockIn(lines) {
    if (this.state !== 'round' || this.answer !== null) return;
    const raw = Array.isArray(lines) ? lines : [];
    this.answer = Scoring.normalizeOutput(raw.map((l) => String(l == null ? '' : l).slice(0, 120)).join('\n'));
    if (!this.answer.length) this.answer = [''];
    this.answerAt = this.now();
    this.emit({ type: 'locked', id: this.me.id, t: this.answerAt - this.roundStartAt });
    this.reveal();
  }

  async useLifeline() {
    if (this.state !== 'round' || this.answer !== null || this.lifeline) return;
    this.lifeline = true;
    this.lifelines += 1;
    this.emit({ type: 'lifeline_used', id: this.me.id });
    try {
      const j = await this.round('choices');
      if (this.state === 'round' && this.answer === null) this.emit({ type: 'lifeline', choices: j.choices });
    } catch (_) { /* offline: the player can still type */ }
  }

  async reveal() {
    if (this.state !== 'round') return;
    clearTimeout(this.timer);
    this.state = 'grading';
    const now = this.now();
    const roundMs = this.roundMs;
    let key;
    try {
      key = await this.round('answer', { lines: this.answer });
    } catch (_) {
      key = { output: [], explain: 'Could not reach the server for this reveal — the round is not counted.', tags: [], ms: null };
    }
    if (this.state === 'stopped') return;
    // the server timed the round on its own clock; a null ms means it did not count an answer
    const answered = this.answer !== null && key.ms != null;
    const ms = answered ? key.ms : null;
    const g = Scoring.grade(this.answer, key.output);
    const { points, bonus } = Scoring.roundPoints({
      difficulty: this.puzzle.difficulty, full: g.full, correctLines: g.correctLines, totalLines: Math.max(1, key.output.length),
      answered, msLeft: answered ? roundMs - ms : 0, roundMs, comboBefore: this.combo, first: g.full, lifeline: this.lifeline,
    });
    if (g.full) {
      this.combo += 1; this.bestCombo = Math.max(this.bestCombo, this.combo); this.correct += 1;
      this.fastestMs = this.fastestMs == null ? ms : Math.min(this.fastestMs, ms);
    } else { this.combo = 0; this.lives -= 1; }
    if (typeof key.lives === 'number') this.lives = key.lives;   // the server's count wins
    this.score += points;
    if (key.output.length) this.log.push({ id: this.puzzle.id, lines: answered ? this.answer : null, ms, lifeline: this.lifeline });

    const last = this.lives <= 0;
    this.state = 'reveal';
    this.revealUntil = now + REVEAL_MS;
    this.lastReveal = {
      type: 'reveal', roundNo: this.roundNo, puzzleId: this.puzzle.id, output: key.output, explain: key.explain, tags: key.tags,
      results: [{ id: this.me.id, answered, answer: this.answer || [], lines: g.lines, correct: g.full, points, combo: this.combo, score: this.score, lifeline: this.lifeline, ms, bonus, lives: this.lives }],
      standings: [{ ...this.player(), rank: 1, correct: this.correct }], firstCorrectId: g.full ? this.me.id : null, last, lives: this.lives,
      revealUntil: this.revealUntil, serverTime: now,
    };
    this.emit(this.lastReveal);
    this.broadcast();
    this.schedule(() => this.next(), REVEAL_MS);
  }

  next() {
    if (this.state !== 'reveal') return;
    clearTimeout(this.timer);
    if (this.lastReveal && this.lastReveal.last) this.finish();
    else this.beginRound();
  }

  async finish() {
    this.state = 'finished';
    this.resultsUntil = this.now() + 3600000;
    this.results = [{ ...this.player(), rank: 1, correct: this.correct, bestCombo: this.bestCombo, rounds: this.log.length, lifelines: this.lifelines, fastestMs: this.fastestMs }];
    this.broadcast();
    // authoritative settlement: the server re-grades the whole log
    try {
      const r = await fetch('/api/rush', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.credentials, ...this.identity, run: this.run, clientScore: this.score }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      if (j.score !== this.score) this.results[0].score = j.score; // server's word is final
      this.emit(j);
    } catch (err) {
      this.emit({ type: 'error', message: `Run could not be saved: ${err.message}` });
    }
  }
}
