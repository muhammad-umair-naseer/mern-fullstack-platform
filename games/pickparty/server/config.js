'use strict';
const path = require('path');
const n = (k, d) => (process.env[k] !== undefined && process.env[k] !== '' ? Number(process.env[k]) : d);

module.exports = {
  PORT: n('PORT', 3000),
  DATA_FILE: process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'db.json'),

  MAX_SEATS: 6,
  MIN_SEATS: 3,
  QUICK_TARGET: n('QUICK_TARGET', 4),       // public tables are topped up with bots to this size
  TOPICS_PER_MATCH: n('TOPICS_PER_MATCH', 3),

  LOBBY_WAIT_MS: n('LOBBY_WAIT_MS', 10000),
  INTRO_MS: n('INTRO_MS', 3200),
  TURN_MS: n('TURN_MS', 12000),
  AWAY_TURN_MS: n('AWAY_TURN_MS', 1500),
  PICK_GAP_MS: n('PICK_GAP_MS', 550),
  VOTE_MS: n('VOTE_MS', 12000),
  ROUND_RESULT_MS: n('ROUND_RESULT_MS', 3600),
  SECRET_MS: n('SECRET_MS', 20000),
  REVEAL_STEP_MS: n('REVEAL_STEP_MS', 1100),
  TOPIC_END_MS: n('TOPIC_END_MS', 4800),
  MATCH_END_MS: n('MATCH_END_MS', 15000),
  REJOIN_GRACE_MS: n('REJOIN_GRACE_MS', 20000),

  // Auction mode
  BID_MS: n('BID_MS', 10000),                 // clock when a lot opens
  BID_EXTEND_MS: n('BID_EXTEND_MS', 6000),    // clock after a bid, if less remains
  BID_MAX_MS: n('BID_MAX_MS', 30000),         // hard cap per lot from the moment it opens
  SOLD_MS: n('SOLD_MS', 1300),                // pause after a sale or a pass
  AUCTION_REVEAL_STEP_MS: n('AUCTION_REVEAL_STEP_MS', 900),

  BOT_MIN_MS: n('BOT_MIN_MS', 900),
  BOT_MAX_MS: n('BOT_MAX_MS', 2600),

  RATINGS_PUBLISH_MS: n('RATINGS_PUBLISH_MS', 10 * 60 * 1000),
  RANKED_PRIVATE: process.env.RANKED_PRIVATE === '1',
  DEV: process.env.DEV === '1',
  SOLO_POINTS_PER_DAY: n('SOLO_POINTS_PER_DAY', 1200),  // ranked points from solo runs, per account per UTC day

  // abuse limits, per IP address
  TRUST_PROXY: process.env.TRUST_PROXY === '1',          // behind a reverse proxy: take the address it appends to X-Forwarded-For
  SOCKETS_PER_IP: n('SOCKETS_PER_IP', 20),               // sockets open at once
  ROOMS_PER_IP_PER_MIN: n('ROOMS_PER_IP_PER_MIN', 20),   // create / quick-match requests
  GUESTS_PER_IP_PER_HOUR: n('GUESTS_PER_IP_PER_HOUR', 30), // new guest accounts
  WS_MAX_PAYLOAD: n('WS_MAX_PAYLOAD', 8 * 1024),         // bytes per message
  MSG_BURST: n('MSG_BURST', 40),                         // messages per socket: a burst of 40,
  MSG_PER_SEC: n('MSG_PER_SEC', 8),                      // then 8 a second
};
