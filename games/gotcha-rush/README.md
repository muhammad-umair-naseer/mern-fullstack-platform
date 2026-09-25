# >_ Gotcha Rush

**What does this print?** A real-time multiplayer game built on the one thing every
developer secretly enjoys: language gotchas. A room of five sees the same tricky
JavaScript or Python snippet, everyone types what they think it prints, the clock
runs, then the real output prints line by line against your answer — followed by
*why*. Combos, lifelines, a Solo Rush mode, worldwide rankings, daily streaks.

Node.js + WebSockets on the server, vanilla ES modules on the client. One runtime
dependency (`ws`), no build step, no framework, no sign-up.

```bash
npm install
npm start          # http://localhost:3000
```

---

## Why it's a game and not a quiz

Static "JS is weird" quizzes are a single player clicking through 25 multiple-choice
questions. Gotcha Rush is built around tension and payoff instead:

- **Live opponents.** Avatars show who's still thinking and who has locked in; the
  standings reorder in real time. Empty seats are filled by bots that read for a
  plausible amount of time and get harder puzzles wrong more often.
- **Typed output, not multiple choice.** You get one box per output line and a clock.
  Whitespace is forgiven, case is not. The **lifeline** turns a round into four
  options — for half the points.
- **The reveal is the show.** `$ node main.js` runs, each line prints against what you
  typed (✓ / ✗ / *extra line*), the verdict lands, the explanation slides in, the
  room's answers are listed. Callouts for FIRST!, COMBO ×4, LIFE LOST.
- **Score you can feel.** Base by difficulty, a speed bonus for locking in early, a
  first-in-the-room bonus, a combo multiplier for consecutive correct rounds.
- **Solo Rush.** Three lives, endless rounds, timers that shrink, difficulty that
  ramps. Your best run goes on the Rush board.
- **Progression that persists.** Ranked points → levels → titles ("Type Coercer",
  "Language Lawyer") and unlockable avatars. 25 achievements. Daily streaks that
  multiply every point. Rivals with a permanent head-to-head record.

### Scoring, per round (server-side)

| Piece | Rule |
| --- | --- |
| Base | `80 + 60 × difficulty` (140 … 380) |
| Speed | up to +50% of base, proportional to time left when you locked in |
| First correct | +60 |
| Combo | ×(1 + 0.15 × streak), capped at ×1.75 |
| Partial | 40% of base × fraction of lines correct (combo resets) |
| Lifeline | whole round × 0.5 |
| Rush | wrong or no answer costs a life; three lives per run |

Ranked points at the end are `score / 10` plus placement (200 / 120 / 80 / 40) and
a perfect-match bonus, multiplied by the daily-streak bonus (+5% per day, cap +50%).
All of these live in `shared/scoring.js`, which both the server and the browser load.

---

## The puzzle bank is executed, not hand-typed

Every puzzle lives as a real source file under `puzzles/js/` or `puzzles/py/` with
its metadata in leading comments:

```js
// @title Plus and minus
// @difficulty 1
// @tags coercion, operators
// @distractor 2\n0
// @distractor 11\n11
// @explain + with a string on either side means concatenation …
console.log("1" + 1);
console.log("1" - 1);
```

`npm run verify` runs each snippet through a runner and freezes the actual stdout
into `puzzles/bank.json`, together with a hash of the source. The server refuses
nothing silently: a puzzle that fails to run, prints nothing, has a distractor equal
to the real answer, or lacks an explanation is rejected, and a stale bank is flagged
at boot (`npm run verify:check` fails CI). 83 puzzles ship, 41 JavaScript and 42
Python, verified on Node 22 and CPython 3.12.

Adding a puzzle is: write the file, run `npm run verify`, commit both.

### Runners (`server/runner.js`)

| `RUNNER` | What it does | Use for |
| --- | --- | --- |
| `local` | spawns `node` / `python3 -I` with a wall-clock limit | verifying the bank on your machine |
| `docker` | one throwaway container per run: `--network none`, memory/CPU/pid caps, read-only root, non-root user, tmpfs | the live Lab in production |
| `judge0` | POSTs to a self-hosted Judge0 CE instance (kernel-level `isolate` sandbox) | the live Lab at scale |

The **Lab** (a *Tinker with it* button after each reveal) lets a player edit the
snippet and re-run it. It is exposed only when `RUNNER_LIVE=1` and the runner is
`docker` or `judge0`; the server refuses to run untrusted code with the local runner
unless you explicitly override it. Runs are rate-limited per IP.

---

## Where the work happens (client-heavy by design)

The server is built to stay cheap under load; the browser does everything it can
be trusted with.

| Concern | Runs on | Notes |
| --- | --- | --- |
| Puzzle bank (code, titles, tags, line counts) | **client** | `GET /api/bank` once, gzipped + ETag, mirrored in localStorage. A match round carries only a puzzle id on the wire (~23 KB bank vs a few hundred bytes per round). |
| Syntax highlighting, code reveal animation, timers, sounds, confetti, standings animation | **client** | pure DOM/CSS/WebAudio, nothing streamed |
| **Solo Rush** — puzzle selection, difficulty ramp, clock, lives, grading, scoring, reveal choreography | **client** | `public/js/rush.js`. No room, timer or socket on the server. Per round the client fetches one cached static JSON (`/api/reveal/:id`); at the end it POSTs the answer log once. |
| Rush verification | server, **stateless** | `POST /api/rush`: the log is re-graded against the real bank with the shared rules (`shared/scoring.js`, loaded by both sides), with timing/repeat sanity checks. One request per run. |
| Multiplayer rounds: grading, scoring, bots, clocks | server | the only stateful part — needed so nobody can grade their own ranked answers |
| Ranking boards | server | computed per (category, window, scope) on demand, cached 10 s, pushed at most every 10 s; `/api/board` is HTTP-cacheable so a CDN can absorb it |
| Static assets, bank, reveals | server → memory | read once, gzipped once, served with strong ETags → 304s and CDN-friendly |
| Clock sync | client | a short ping burst, then one ping every 15 s |

What a multiplayer room costs the server: a 250 ms tick per room, a string
comparison per answer, and JSON broadcasts that contain ids and numbers, not
source code. What a Rush player costs the server: six small HTTP requests over a
whole run.

The trade-off is spelled out rather than hidden: because Rush is graded in the
browser, a determined cheater can fetch a reveal early. The server's re-grade,
timing floor (700 ms per answer), repeat detection and deadline checks make
inflated runs cut off rather than accepted, and ranked *multiplayer* points are
never client-computed. That is the same risk profile as any client-heavy arcade
game and the right split for a solo board.

---

## Architecture

```
server/
  index.js         in-memory gzipped static + JSON API, WebSocket router, auth handshake, Lab endpoint
  rush.js          stateless verification of a client-played Solo Rush run
  Room.js          waiting → starting → (round → reveal)×N → finished; grading, scoring, bots
  RoomManager.js   matchmaking (public / private / rush), room lifecycle, tick loop
  Player.js Bot.js player model; bots with skill, tempo, and distractor-based mistakes
  puzzles.js       bank loader, metadata parser, output normalisation, lifeline choices
  verify.js        CLI: execute every puzzle, freeze bank.json, fail on problems
  runner.js        local / docker / judge0 execution drivers
  accounts.js      sign-up-free identity, ranked points, streaks, stats, achievements, rivals
  leaderboards.js  boards (category × window × scope) with caching and your own rank
  achievements.js  catalogue + server-side checks
  store.js         JSON persistence with debounced atomic writes
  config.js        every tunable, overridable by env var
shared/
  scoring.js       one copy of the scoring rules, required by the server and loaded by the browser
public/js/
  main.js          orchestrator: screens, room state, answer flow, reveal choreography, results
  rush.js          Solo Rush engine (emits server-shaped messages into the same UI code paths)
  bank.js          client-side puzzle bank (fetch once, cache in localStorage)
  highlight.js     dependency-free JS/Python syntax highlighter
  account.js       identity + level curve       boards.js   rankings UI
  net.js clock.js  socket w/ backoff, NTP-style clock sync
  audio.js         synthesised SFX             confetti.js background.js countries.js ui.js
puzzles/
  js/*.js py/*.py  sources          bank.json   frozen, verified outputs
test/
  run-test.js      full lifecycle: matchmaking, bots, grading, lifeline, combo, rush, friendly, boards, reconnect
  simulate.js      N simulated players for load testing
```

### Protocol

**Client → server (socket):** `hello {name, country, avatar, accountId, token}` · `quick {lang}` ·
`create {lang, rounds}` · `join {code}` · `leave` · `start {bots, lang, rounds}` ·
`answer {lines[]}` · `lifeline` · `puzzle {id}` · `chat {text}` · `emote {e}` · `board {category, window, scope}` · `ping {t}`

**HTTP:** `GET /api/bank` · `GET /api/reveal/:id` · `GET /api/choices/:id` · `POST /api/rush {accountId, token, lang, log[]}` ·
`GET /api/board?…` · `GET /api/stats` · `POST /api/run` (Lab)

**Server → client:** `welcome {id, serverTime, achievements, boards, avatars, langs, config}` ·
`account {id, token?, created, profile, standings}` · `room {…state with puzzleId, not code}` · `puzzle {puzzle}` · `locked {id, t}` ·
`lifeline {choices[]}` · `lifeline_used {id}` · `clock {roundEndsAt}` ·
`reveal {roundNo, output[], explain, tags, results[], standings[], firstCorrectId, last, lives, revealUntil}` ·
`game_result {mode, points, ranked, perfect, streak, streakEvent, unlocked[], profile, standings, series}` ·
`board {…}` · `chat` · `emote` · `player_left` · `left` · `online` · `pong` · `error`

`room` is one authoritative message for every transition, so a reconnecting client
resyncs from a single payload; `reveal` is also embedded in it while a reveal is showing.

---

## Rankings, streaks, friendlies

- **Boards:** Points (all / today / this week), Rush, Accuracy (min 20 rounds),
  Solved, Combo, Wins, Streak — each **global** or **your country**. Your own row is
  always returned even when you're not in the top 25.
- **Streaks:** finish a game on consecutive UTC days. Each day adds +5% to every
  point earned, capped at +50%. Miss a day and it resets.
- **Friendlies:** private rooms are unranked by default (set `RANKED_PRIVATE=1` to
  change that). They still keep your streak alive, update head-to-head records, and
  track a running series score inside the room.
- **Accounts:** the server mints an id + secret token on first connect; the browser
  replays it; only the token's SHA-256 hash is stored. Everything persists to a JSON
  file with atomic writes — mount a volume in production.

---

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | 3000 | HTTP/WS port |
| `DATA_FILE` | `data/gotcharush.json` | account/ranking persistence |
| `ROUNDS` | 8 | rounds per public match |
| `ROUND_MS` | 40000 | time to lock in |
| `REVEAL_MS` | 11000 | output + explanation before the next round |
| `LOBBY_WAIT_MS` | 12000 | public lobby wait before bots fill and the match starts |
| `STATIC_MAX_AGE` / `BANK_MAX_AGE` | 3600 | cache lifetimes for assets and the bank (ETags handle revalidation) |
| `RUNNER` | `local` | `local` / `docker` / `judge0` / `off` |
| `RUNNER_LIVE` | unset | `1` exposes `POST /api/run` for the Lab |
| `JUDGE0_URL`, `JUDGE0_TOKEN` | — | Judge0 CE endpoint and optional auth token |
| `RANKED_PRIVATE` | `0` | `1` makes private rooms award ranked points |

Every other tunable (scoring weights, bot fill, board size…) is in `server/config.js`.

## Testing

```bash
npm test               # verify:check (bank is current) + full game lifecycle test
npm run verify         # re-execute every puzzle and rebuild bank.json
npm run simulate -- 8  # 8 simulated players against localhost
```

## Deploying

Any host with WebSocket support. Persist `DATA_FILE` on a volume, serve over HTTPS
(the client picks `wss://` automatically), and pass `Upgrade`/`Connection` through
your proxy. For the Lab, run with Docker available (`RUNNER=docker RUNNER_LIVE=1`)
or point `JUDGE0_URL` at a Judge0 CE instance.

```bash
docker build -t gotcha-rush .
docker run -p 3000:3000 -v gotcha-data:/data gotcha-rush
```

`GET /healthz`, `GET /api/stats`, `GET /api/puzzles`, `GET /api/board?category=points&window=all&scope=global`.

## Ideas worth building next

- More languages (Go, Rust, TypeScript) — the bank format and runner already allow it.
- Daily Gotcha: one puzzle a day for the whole world, with a spoiler-free share card.
- Seasons with archived boards and a seasonal avatar.
- A "Gotcha of the week" digest generated from the puzzles people missed most.

MIT licensed.
