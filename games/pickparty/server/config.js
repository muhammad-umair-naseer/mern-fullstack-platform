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
};
