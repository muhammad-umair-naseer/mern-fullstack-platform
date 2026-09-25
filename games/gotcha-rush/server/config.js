'use strict';

const num = (k, d) => (process.env[k] != null && process.env[k] !== '' ? Number(process.env[k]) : d);
const str = (k, d) => (process.env[k] != null && process.env[k] !== '' ? String(process.env[k]) : d);

module.exports = {
  PORT: num('PORT', 3000),
  HOST: str('HOST', '0.0.0.0'),

  // --- match shape ---
  MAX_PLAYERS: num('MAX_PLAYERS', 5),
  BOT_FILL_TO: num('BOT_FILL_TO', 4),
  ROUNDS: num('ROUNDS', 8),
  LOBBY_WAIT_MS: num('LOBBY_WAIT_MS', 12000),
  START_MS: num('START_MS', 3500),          // "Round 1 of 8" splash
  ROUND_MS: num('ROUND_MS', 40000),         // time to lock in an answer
  AFTER_HUMANS_MS: num('AFTER_HUMANS_MS', 4000), // once all humans locked in, bots get this long
  REVEAL_MS: num('REVEAL_MS', 11000),       // output + explanation
  RESULTS_MS: num('RESULTS_MS', 15000),
  STATIC_MAX_AGE: num('STATIC_MAX_AGE', 3600),   // seconds; assets carry ETags so revalidation is a 304
  BANK_MAX_AGE: num('BANK_MAX_AGE', 3600),

  // scoring weights live in shared/scoring.js (used by both server and client)

  // --- accounts, ranking & streaks ---
  DATA_FILE: str('DATA_FILE', 'data/gotcharush.json'),
  RANKED_PRIVATE: process.env.RANKED_PRIVATE === '1',
  STREAK_BONUS_STEP: 0.05,
  STREAK_BONUS_CAP: 0.5,
  BOARD_SIZE: num('BOARD_SIZE', 25),
  BOARD_CACHE_MS: num('BOARD_CACHE_MS', 10000),
  BOARD_PUSH_MS: num('BOARD_PUSH_MS', 10000),
  MAX_RIVALS: 40,

  // --- code execution ---
  RUNNER: str('RUNNER', 'local'),           // local | docker | judge0 | off  (used by `npm run verify`)
  RUNNER_LIVE: process.env.RUNNER_LIVE === '1', // expose POST /api/run for the Lab (use docker/judge0!)
  RUNNER_TIMEOUT_MS: num('RUNNER_TIMEOUT_MS', 4000),
  RUNNER_MEMORY: str('RUNNER_MEMORY', '128m'),
  RUNNER_CPUS: str('RUNNER_CPUS', '0.5'),
  RUNNER_RATE_PER_MIN: num('RUNNER_RATE_PER_MIN', 6),
  JUDGE0_URL: str('JUDGE0_URL', 'http://localhost:2358'),
  JUDGE0_TOKEN: str('JUDGE0_TOKEN', ''),
  BANK_FILE: str('BANK_FILE', 'puzzles/bank.json'),

  // --- limits ---
  MAX_NAME_LEN: 16,
  MAX_CHAT_LEN: 140,
  CHAT_MIN_INTERVAL_MS: 500,
  EMOTE_MIN_INTERVAL_MS: 700,
  MAX_ANSWER_LINES: 12,
  MAX_ANSWER_LINE_LEN: 120,
  TICK_MS: 250,
};
