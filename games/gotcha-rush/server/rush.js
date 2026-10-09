'use strict';
const crypto = require('crypto');
const Scoring = require('../shared/scoring');
const { RULES } = Scoring;

/**
 * Solo Rush plays in the browser (clock, grading for the reveal, animation),
 * but the server deals the puzzles and keeps the answer log: RushRuns below
 * hands out one puzzle at a time, times it on its own clock, and shows the
 * answer only once that round is closed. When the run ends verifyRun re-grades
 * the server's log with the shared scoring rules and sanity checks before
 * anything is written to the account. Anything that doesn't add up is scored
 * as far as it is valid, then cut off.
 */
function verifyRun(bank, body) {
  const lang = ['mix', 'js', 'py'].includes(body.lang) ? body.lang : 'mix';
  const log = Array.isArray(body.log) ? body.log.slice(0, RULES.RUSH_MAX_ROUNDS) : [];
  const flags = [];
  let lives = RULES.RUSH_LIVES;
  let score = 0;
  let combo = 0;
  let bestCombo = 0;
  let correct = 0;
  let rounds = 0;
  let lifelines = 0;
  let fastestMs = null;
  const langs = { js: { rounds: 0, correct: 0 }, py: { rounds: 0, correct: 0 } };
  const seen = new Set();
  const graded = [];

  for (let i = 0; i < log.length; i++) {
    if (lives <= 0) { flags.push('rounds after death ignored'); break; }
    const e = log[i] || {};
    const pz = bank.byId.get(String(e.id));
    if (!pz) { flags.push(`unknown puzzle ${e.id}`); break; }
    if (lang !== 'mix' && pz.lang !== lang) { flags.push('puzzle outside chosen language'); break; }
    if (seen.has(pz.id)) { flags.push('repeated puzzle'); break; }
    seen.add(pz.id);
    const roundNo = i + 1;
    const roundMs = Scoring.rushRoundMs(roundNo);
    const ms = Number(e.ms);
    const answered = Array.isArray(e.lines) && e.lines.length > 0;
    if (answered && (!Number.isFinite(ms) || ms < RULES.RUSH_MIN_ANSWER_MS)) { flags.push(`answer ${roundNo} faster than humanly possible`); break; }
    if (answered && ms > roundMs) { flags.push(`answer ${roundNo} after the deadline`); break; }
    const answer = answered ? Scoring.normalizeOutput(e.lines.slice(0, 12).map((l) => String(l == null ? '' : l).slice(0, 120)).join('\n')) : null;
    const g = Scoring.grade(answer && answer.length ? answer : (answered ? [''] : null), pz.output);
    const lifeline = !!e.lifeline;
    const { points, bonus } = Scoring.roundPoints({
      difficulty: pz.difficulty, full: g.full, correctLines: g.correctLines, totalLines: pz.output.length,
      answered, msLeft: answered ? roundMs - ms : 0, roundMs, comboBefore: combo, first: g.full, lifeline,
    });
    rounds += 1;
    langs[pz.lang].rounds += 1;
    if (lifeline) lifelines += 1;
    if (g.full) {
      combo += 1; bestCombo = Math.max(bestCombo, combo); correct += 1; langs[pz.lang].correct += 1;
      fastestMs = fastestMs == null ? ms : Math.min(fastestMs, ms);
    } else { combo = 0; lives -= 1; }
    score += points;
    graded.push({ id: pz.id, correct: g.full, points, bonus, lives });
  }

  return { lang, score, rounds, correct, bestCombo, lifelines, fastestMs, langs, lives, flags, graded };
}

const RUN_IDLE_MS = 30 * 60 * 1000;
// Network time between the server's clock and the browser's: an answer sent as
// the browser's clock ran out still counts (without a speed bonus).
const LATE_GRACE_MS = 2500;

/** One live run per account, in memory. A run is a capability: its random id. */
class RushRuns {
  constructor(bank) { this.bank = bank; this.runs = new Map(); }

  start(accountId, lang) {
    const now = Date.now();
    for (const [k, r] of this.runs) if (now - r.touched > RUN_IDLE_MS) this.runs.delete(k);
    const run = {
      id: crypto.randomBytes(18).toString('base64url'), accountId, lang: ['mix', 'js', 'py'].includes(lang) ? lang : 'mix',
      log: [], seen: new Set(), lives: RULES.RUSH_LIVES, cur: null, touched: now,
    };
    this.runs.set(accountId, run);   // starting again drops the account's previous run
    return run;
  }

  get(accountId, id) {
    const run = typeof accountId === 'string' ? this.runs.get(accountId) : null;
    return run && typeof id === 'string' && run.id === id ? run : null;
  }

  /** Deal the next puzzle, or null when the run is over. An open round closes unanswered. */
  next(run) {
    if (run.cur) this.answer(run, null);
    if (run.lives <= 0 || run.log.length >= RULES.RUSH_MAX_ROUNDS) return null;
    const roundNo = run.log.length + 1;
    let pz = this.bank.pick({ lang: run.lang, seen: run.seen, ...Scoring.rushDifficulty(roundNo) });
    if (run.seen.has(pz.id)) pz = this.bank.pick({ lang: run.lang, seen: run.seen });
    if (run.seen.has(pz.id)) return null;   // every puzzle in the language played
    run.seen.add(pz.id);
    run.cur = { pz, roundNo, at: Date.now(), lifeline: false };
    run.touched = run.cur.at;
    return { id: pz.id, roundNo, roundMs: Scoring.rushRoundMs(roundNo) };
  }

  /** The lifeline: four options for the open round, at half points. */
  choices(run) {
    if (!run.cur) return null;
    run.cur.lifeline = true;
    return this.bank.choices(run.cur.pz);
  }

  /** Close the open round with these lines (null: no answer) and reveal it. */
  answer(run, lines) {
    const c = run.cur;
    if (!c) return null;
    run.cur = null;
    const roundMs = Scoring.rushRoundMs(c.roundNo);
    const took = Date.now() - c.at;
    const answered = Array.isArray(lines) && lines.length > 0 && took <= roundMs + LATE_GRACE_MS;
    const ms = answered ? Math.min(took, roundMs) : null;
    run.log.push({ id: c.pz.id, lines: answered ? lines.slice(0, 12) : null, ms, lifeline: c.lifeline });
    const v = verifyRun(this.bank, { lang: run.lang, log: run.log });
    run.lives = v.flags.length ? 0 : v.lives;
    const g = v.graded[v.graded.length - 1];
    return { ...this.bank.reveal(c.pz), ms, correct: !!(g && g.id === c.pz.id && g.correct), lives: run.lives };
  }

  /** End the run (once) and score the server's own log. */
  settle(run) {
    if (run.cur) this.answer(run, null);
    this.runs.delete(run.accountId);
    return verifyRun(this.bank, { lang: run.lang, log: run.log });
  }
}

module.exports = { verifyRun, RushRuns };
