# PickParty

A real-time multiplayer drafting party game for the browser. Sixteen cards hit the board, players take turns claiming them, and nobody can take a card someone else already drafted.

## Modes

**Crowd pleaser** (3–6 players). Each topic is four snake-draft rounds: three top picks, then a dud (the worst card on the board). After every round the table votes for the best pick, or the worst dud. Each vote is 100 points and the most-voted pick earns a 50-point bonus. Whoever scores most on a topic wins it; most topics won takes the table.

**Mind reader** (3–6 players). One player per topic is the Mind and secretly ranks three loves and one dud. Everyone else drafts three cards. Matching the 1st, 2nd and 3rd love scores 200, 150 and 100; drafting the dud zeroes your topic. The Mind earns 75 for every love somebody found, so being readable pays.

**Auction** (3–6 players). Everyone gets 20 coins a topic and the sixteen cards go on the block one at a time, face-down until their turn, so nobody can plan around what is still to come. Bid live: the first bid is 1 coin, every raise must beat the top bid, and each bid stretches the clock a little (up to a hard cap). When the clock runs out the top bid takes the card; no bids and it stays on the board. Lineups hold four cards at three or four players, three at five, two at six, and empty slots get leftover cards for free. At the reveal each card is worth 10 to 160 points by crowd rank, plus 5 for every coin you kept. Highest total wins the topic.

**Crowd read** (solo). Pick the crowd's top three and its dud before the clock runs out. Three lives, a combo multiplier, and a clock that shrinks every topic. Runs entirely in the browser.

Choose a culture on the home page: **Desi** plays the desi packs plus the packs that belong to everyone, **Global** plays the rest of the world plus those shared packs, and **Mix** plays everything including the blended packs. Next to it, choose how long a match is: 1, 2 or 3 topics; players are matched with tables of the same length. Both choices are remembered in the browser; the culture filters the category grid, decides what random slots are filled with, and matches you only with tables of the same culture (Mix joins any). Pick a category on the home page to play it in any mode: the match opens on that topic, and public quick matches are matched by category, so you play what you chose. Public quick matches are ranked and fill empty seats with bots. Private tables (5-letter code or invite link) are friendly and unranked unless `RANKED_PRIVATE=1`. The host picks the topics for the match in the lobby, and any slot left empty is drawn at random.

## Run it

```bash
npm install
npm start            # http://localhost:3000
npm run dev          # restarts on change, re-reads static files per request
npm test             # end-to-end server suite with real WebSocket clients
npm run art          # look item pictures up on Wikipedia → shared/art.json (resumable, polite pacing)
npm run check:browser  # drives the installed Chrome through playwright-core (dev dependency) against a self-started server
```

Node 18 or newer. One runtime dependency (`ws`), no build step.

## Architecture

```
server/
  index.js        HTTP (static files from memory, gzip + ETag), /api/bank, /api/solo, WebSocket protocol
  RoomManager.js  matchmaking, private codes, rejoin after reload, settlement
  Room.js         event-driven table state machine (no tick loop): lobby → intro → draft/vote, secret/draft/reveal or bid/sold/reveal → topic end → match end
  auction.js      Auction mode: lots, live bids with a stretching clock, bot ceilings, leftovers, the reveal
  bots.js         bot seats; they play from the learned crowd ratings with some noise
  ratings.js      Elo-style crowd taste per option, learned from human votes and human Minds only
  bank.js         content bank (no crowd ranking), versioned, gzipped; ranking snapshots kept server-side for solo grading
  accounts.js     anonymous token accounts, streaks, stats, achievements
  boards.js       six ranking boards, global or per country, all-time or weekly
  store.js        JSON file store with debounced atomic writes
shared/
  scoring.js      every scoring rule, loaded by Node and the browser, so they can never disagree
  topics.json     88 original topics × 16 options (listed best → worst, which seeds the crowd ranking)
  art.json        item pictures: Wikimedia Commons thumbnail links with author and licence, built by scripts/fetch-art.js
scripts/
  fetch-art.js    Wikipedia lookup per item, keeps only free Commons pictures; shared/art-overrides.json pins or removes items
public/
  index.html, css/app.css
  js/main.js      boot and wiring        js/table.js  table renderer, pick flights, sheets, finale
  js/router.js    hash routes → pages (home, categories, friends, rankings, profile) and the live table/solo screens
  js/net.js       socket + clock sync    js/solo.js   client-side Crowd read run
  js/bank.js      localStorage-cached bank with ETag revalidation
  js/art.js       picture-or-emoji card art; the emoji shows until the picture loads
  js/ranks.js     ranking panel          js/sfx.js    Web Audio sound effects (no audio files)
```

### Keeping load on the client

- The bank (topics and options) is fetched once, revalidated with `If-None-Match`, and cached in `localStorage`. Match traffic carries only topic ids and option indices. The crowd ranking never ships with it.
- Crowd read never opens a room, but the server deals it: `POST /api/solo/start`, then per topic `/api/solo/topic` (starts the server's clock) and `/api/solo/pick` (grades against the ranking snapshot the run started on, and only then returns that topic's ranking). `POST /api/solo` scores the server's own log once. Solo ranked points stop at `SOLO_POINTS_PER_DAY` per account.
- The server keeps no game loop. Each phase sets one deadline and one timer; clients render countdowns from server-clock-corrected deadlines in a single `requestAnimationFrame` loop.
- Static files and the bank are served from memory, gzipped, with ETags.

### Crowd learning

Human votes in Crowd pleaser and human Minds' secret picks update an Elo-style rating for every option. Bots read these ratings but never write them, so the model can't train on itself. A new bank version is published at most every `RATINGS_PUBLISH_MS`, and connected browsers are told to refresh lazily.

Note: Crowd read needs the ranking in the browser, so a determined player could inspect it. Server-side re-grading stops forged scores and impossible timings, not someone who reads the bank.

## Configuration (environment variables)

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | 3000 | HTTP and WebSocket port |
| `DATA_FILE` | `data/db.json` | account, rating and streak store |
| `QUICK_TARGET` | 4 | public tables are topped up with bots to this many seats |
| `TOPICS_PER_MATCH` | 3 | topics per match |
| `LOBBY_WAIT_MS` | 10000 | public lobby wait before bots fill in |
| `TURN_MS` | 12000 | time per pick |
| `VOTE_MS` | 12000 | voting window |
| `SECRET_MS` | 20000 | time for the Mind to hide their secret |
| `REJOIN_GRACE_MS` | 20000 | how long a match survives with no connected humans |
| `RATINGS_PUBLISH_MS` | 600000 | how often learned crowd ratings are published |
| `BID_MS` | 10000 | auction clock when a lot opens |
| `BID_EXTEND_MS` | 6000 | clock after a bid, if less remains |
| `BID_MAX_MS` | 30000 | hard cap per lot from the moment it opens |
| `SOLD_MS` | 1300 | pause after a sale or a pass |
| `SOLO_POINTS_PER_DAY` | 1200 | ranked points solo runs can add per account per UTC day |
| `GAME_SSO_SECRET` | unset | shared with the website API (`server/.env`). Unset outside production: player sign-in uses the public development secret (with a loud warning) and the admin portal's player tools stay off. Production refuses the development secret. |
| `TRUST_PROXY` | unset | `1` behind a reverse proxy: per-IP limits use the address it appends to `X-Forwarded-For` |
| `SOCKETS_PER_IP` | 20 | WebSockets open at once from one address |
| `ROOMS_PER_IP_PER_MIN` | 20 | create / quick-match requests per address per minute |
| `GUESTS_PER_IP_PER_HOUR` | 30 | new guest accounts per address per hour |
| `MSG_BURST` / `MSG_PER_SEC` | 40 / 8 | WebSocket messages per socket: burst, then per second |
| `WS_MAX_PAYLOAD` | 8192 | largest WebSocket message, bytes |
| `RANKED_PRIVATE` | off | set to `1` to rank private tables too |

See `server/config.js` for the remaining timers.

## WebSocket protocol (summary)

Client → server: `hello {token, tz, country}`, `profile {name, country, avatar}`, `quick {mode, topics?, culture?, rounds?}`, `create {mode, topics?, culture?, rounds?}` (`culture` is `desi`, `global` or `mix`; `rounds` is how many topics the match plays, 1 up to `TOPICS_PER_MATCH`) (`topics` is a list of topic ids in play order, up to `TOPICS_PER_MATCH`; a single `topic` still works), `join {code}`, `leave`, `host {action: add_bot | remove_bot | mode | culture | rounds | topics | start, arg}` (`topics` takes an array of topic ids; empty slots are drawn at random), `pick {opt}`, `bid {amount, lot}` (Auction: absolute amount and the lot index it is for), `vote {sid}`, `secret {loves:[a,b,c], dud}`, `emote {e}`, `board {category, window, scope}`, `ping {t}`.

Server → client: `welcome`, `profile`, `room {room, ev}` (a per-seat snapshot plus the event that caused it; the Mind's secret is only ever in the Mind's own snapshot until the reveal), `result`, `room_closed`, `emote`, `board`, `bank {v}`, `error`, `pong`.

## Adding topics

Append to `shared/topics.json`: an `id`, title `t`, emoji `e`, a culture tag `c` (`d` desi, `g` global, `n` neutral, `m` mixed items), and exactly 16 options as `[name, emoji]`, ordered from most to least loved. Existing learned ratings are kept; new topics start from that seed order. Run `npm run art` afterwards to fetch pictures for the new items (only allowlisted packs are looked up; see the script).
