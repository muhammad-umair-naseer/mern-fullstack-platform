/*
 * Scoring rules shared by the server (CommonJS) and the browser (classic
 * <script>, exposed as window.GotchaScoring). Keeping one copy means the
 * client can score a Solo Rush run locally, exactly as the server will
 * re-score it when the run is submitted for verification.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GotchaScoring = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const RULES = {
    BASE_MIN: 80,
    BASE_PER_DIFF: 60,
    PARTIAL_FACTOR: 0.4,
    SPEED_BONUS: 0.5,
    FIRST_BONUS: 60,
    COMBO_STEP: 0.15,
    COMBO_CAP: 5,
    LIFELINE_FACTOR: 0.5,
    ROUND_MS: 40000,
    RUSH_ROUND_MIN_MS: 14000,
    RUSH_SHRINK_MS: 2000,
    RUSH_LIVES: 3,
    RUSH_MAX_ROUNDS: 60,
    RUSH_MIN_ANSWER_MS: 700,
  };

  /** Canonical output form: trailing whitespace per line stripped, trailing blank lines dropped. */
  function normalizeOutput(text) {
    const lines = String(text).replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, ''));
    while (lines.length && lines[lines.length - 1] === '') lines.pop();
    return lines;
  }

  /** Whitespace-insensitive, case-sensitive line comparison. */
  function linesMatch(a, b) {
    return String(a).replace(/\s+/g, '') === String(b).replace(/\s+/g, '');
  }

  /** Grade an answer (string[]) against the expected output (string[]). */
  function grade(answer, output) {
    const lines = output.map((l, i) => !!answer && i < answer.length && linesMatch(answer[i], l));
    const extra = answer ? Math.max(0, answer.length - output.length) : 0;
    const correctLines = lines.filter(Boolean).length;
    return { lines, correctLines, extra, full: !!answer && correctLines === output.length && extra === 0 };
  }

  /**
   * Points for one round.
   * @param {object} o  { difficulty, full, correctLines, totalLines, answered,
   *                      msLeft, roundMs, comboBefore, first, lifeline }
   */
  function roundPoints(o) {
    const base = RULES.BASE_MIN + RULES.BASE_PER_DIFF * o.difficulty;
    const bonus = { speed: 0, first: 0, combo: 1 };
    let points = 0;
    if (o.full) {
      const left = Math.max(0, Math.min(1, o.msLeft / o.roundMs));
      bonus.speed = Math.round(base * RULES.SPEED_BONUS * left);
      bonus.combo = 1 + RULES.COMBO_STEP * Math.min(RULES.COMBO_CAP, o.comboBefore);
      points = Math.round((base + bonus.speed) * bonus.combo);
      if (o.first) { bonus.first = RULES.FIRST_BONUS; points += RULES.FIRST_BONUS; }
    } else if (o.answered) {
      points = Math.round(base * RULES.PARTIAL_FACTOR * (o.correctLines / o.totalLines));
    }
    if (o.lifeline) points = Math.round(points * RULES.LIFELINE_FACTOR);
    return { points, bonus, base };
  }

  /** Rush timers shrink every round down to a floor. */
  function rushRoundMs(roundNo) {
    return Math.max(RULES.RUSH_ROUND_MIN_MS, RULES.ROUND_MS - (roundNo - 1) * RULES.RUSH_SHRINK_MS);
  }

  /** Difficulty window for a Rush round: warms up, then climbs. */
  function rushDifficulty(roundNo) {
    const r = roundNo;
    if (r <= 2) return { minDiff: 1, maxDiff: 2, prefer: null };
    if (r <= 5) return { minDiff: 1, maxDiff: 3, prefer: null };
    if (r <= 9) return { minDiff: 2, maxDiff: 4, prefer: null };
    return { minDiff: 3, maxDiff: 5, prefer: Math.min(5, 3 + Math.floor((r - 10) / 4)) };
  }

  return { RULES, normalizeOutput, linesMatch, grade, roundPoints, rushRoundMs, rushDifficulty };
}));
