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
  STATIC_MAX_AGE: num('STATIC_MAX_AGE', 3600),   // seconds, for pictures, sounds and fonts; code always revalidates (a 304 via its ETag)
  BANK_MAX_AGE: num('BANK_MAX_AGE', 3600),

  // scoring weights live in shared/scoring.js (used by both server and client)

  // --- accounts, ranking & streaks ---
  DATA_FILE: str('DATA_FILE', 'data/gotcharush.json'),
  RANKED_PRIVATE: process.env.RANKED_PRIVATE === '1',
  // Boards and ranks list signed-in (Cortexis, cx_) players only. RANK_GUESTS=1
  // lets guests on too: a LAN party with no website, or the older test suites.
  RANK_GUESTS: process.env.RANK_GUESTS === '1',
  CX_SESSIONS_MAX: num('CX_SESSIONS_MAX', 10),   // devices signed in to one Cortexis account at once
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

  // --- abuse limits, per IP address ---
  TRUST_PROXY: process.env.TRUST_PROXY === '1',  // behind a reverse proxy: take the address it appends to X-Forwarded-For
  SOCKETS_PER_IP: num('SOCKETS_PER_IP', 20),            // sockets open at once
  ROOMS_PER_IP_PER_MIN: num('ROOMS_PER_IP_PER_MIN', 20), // create / quick-match requests
  GUESTS_PER_IP_PER_HOUR: num('GUESTS_PER_IP_PER_HOUR', 30), // new guest accounts
  WS_MAX_PAYLOAD: num('WS_MAX_PAYLOAD', 16 * 1024),     // bytes per message
  MSG_BURST: num('MSG_BURST', 40),                      // messages per socket: a burst of 40,
  MSG_PER_SEC: num('MSG_PER_SEC', 8),                   // then 8 a second
};
