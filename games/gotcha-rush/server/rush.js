'use strict';
const Scoring = require('../shared/scoring');
const { RULES } = Scoring;

/**
 * Solo Rush runs entirely in the browser: the client picks puzzles from its
 * cached bank, runs the clock, grades locally and animates the reveal. The
 * server never holds a room, a timer or a socket for it. When the run ends the
 * client submits its answer log and this module re-grades every round against
 * the real bank with the shared scoring rules, applies sanity checks, and only
 * then writes the result to the account. Anything that doesn't add up is
 * scored as far as it is valid, then cut off.
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

module.exports = { verifyRun };
