# Auction Mode and Item Pictures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A third mode, Auction, where players bid live with 20 coins per topic for the cards, plus real pictures of items on every card view with emoji as the fallback.

**Architecture:** The auction is a new phase loop (`bid` → `sold`, repeated, then `reveal`) driven by the existing one-deadline-one-timer room machinery, implemented in a focused `server/auction.js` that the room delegates to. Scoring lives in `shared/scoring.js` so the browser reveal and server settlement agree. Pictures are Wikimedia Commons thumbnail links produced once by a build script into `shared/art.json`, shipped inside the bank payload, and rendered by one small `public/js/art.js` helper.

**Tech Stack:** Node 18+, `ws`, vanilla ES modules in the browser, no build step. Browser checks use `playwright-core` driving the installed Chrome.

**Spec:** `docs/superpowers/specs/2026-10-03-auction-mode-design.md`

## Global Constraints

- One runtime dependency (`ws`); `playwright-core` is a devDependency only, used by browser checks outside `npm test`.
- All point rules live in `shared/scoring.js`; nothing in the server or browser computes points itself.
- Timer discipline: every phase sets one deadline and one timer; no tick loops.
- Rejected player input is silent (return false), as picks and votes are today.
- Mode id is `auction`; display name "Auction"; tagline "Outbid the table. Build the best lineup."; glyph 🔨.
- Emoji in copy or data must not be from Unicode 14 or 15 (the bank shape test enforces this for the bank).
- Not a git repository: there are no commit steps. Each task ends with `npm test` green.

## Review Focus

- A bid arriving in the same millisecond the lot closes: `bid()` must check `phase === 'bid'` and the lot index, so a late bid never lands on the next lot. Pinned in Task 3 by bidding after `sold` and asserting it is refused.
- A non-integer or string amount (`"5"`, `5.5`, `NaN`): must be refused, never coerced. Pinned in Task 3.
- A player who leaves mid-auction while leading a lot: the sale must still complete to their seat and the match must continue. Pinned in Task 4 by disconnecting the leader before the lot closes.
- A six-seat table: lineup size 2, auction stops after 12 sales and the four unsold cards stay on the board unsold. Pinned in Task 4 with a six-seat private table.
- A picture URL that fails to load (offline, blocked host): the tile must still show the emoji and name. Pinned in Task 8 by pointing an `img` at a dead URL and asserting the fallback class.

---

### Task 1: Auction scoring rules

**Files:**
- Modify: `shared/scoring.js`
- Test: `test/run-tests.js` (new `checkScoring()` run before the server boots, next to `checkBank()`)

**Interfaces:**
- Produces: `RULES.AUCTION_PURSE = 20`, `RULES.AUCTION_MAX_LINEUP = 4`, `RULES.AUCTION_VALUE_STEP = 10`, `RULES.AUCTION_CHANGE_PTS = 5`, `RULES.AUCTION_MIN_BID = 1`;
  `auctionLineup(seats: number): number`;
  `auctionTopic(rank: number[], lineups: {[sid]: {opt: number, price: number}[]}, purses: {[sid]: number}): {points: {[sid]: number}, values: {[opt]: number}, change: {[sid]: number}}`.

- [ ] **Step 1: Write the failing check**

```js
function checkScoring() {
  assert.deepStrictEqual([3, 4, 5, 6].map(Scoring.auctionLineup), [4, 4, 3, 2], 'lineup size by seats');
  const res = Scoring.auctionTopic([3, 1, 0, 2], { a: [{ opt: 3, price: 9 }, { opt: 2, price: 0 }], b: [{ opt: 1, price: 5 }] }, { a: 11, b: 15 });
  assert.deepStrictEqual(res.values, { 3: 40, 1: 30, 0: 20, 2: 10 }, 'value falls by 10 per rank from the top');
  assert.deepStrictEqual(res.change, { a: 55, b: 75 }, '5 points per coin left');
  assert.deepStrictEqual(res.points, { a: 105, b: 105 }, 'card values plus change');
  console.log('✓ scoring: auction rules');
}
```
Call it right after `checkBank()` inside the same try.

- [ ] **Step 2: Run `npm test`** — Expected: `✗ Scoring.auctionLineup is not a function` (or similar TypeError) and `FAILED`.

- [ ] **Step 3: Implement** the five RULES entries and both functions in `shared/scoring.js`; export them in the returned object. `values[opt] = (rank.length - index) * AUCTION_VALUE_STEP` for every option in `rank`.

- [ ] **Step 4: Run `npm test`** — Expected: `✓ scoring: auction rules` and the suite still green.

### Task 2: Accept `auction` as a mode everywhere

**Files:**
- Modify: `server/Room.js` (constructor, `host`), `server/RoomManager.js` (`quick`, `create`), `server/config.js`, `public/js/table.js:8` (`MODE_NAME`)
- Test: `test/run-tests.js`

**Interfaces:**
- Produces: `Room.normMode(m: string): 'crowd' | 'mind' | 'auction'` (static); config keys `BID_MS 8000`, `BID_EXTEND_MS 4000`, `BID_MAX_MS 24000`, `SOLD_MS 1300`, `AUCTION_REVEAL_STEP_MS 900`; `MODE_NAME.auction = 'Auction'`.

- [ ] **Step 1: Write the failing assertions** in the private-table section, after the existing `create` lobby check: send `{ type: 'host', action: 'mode', arg: 'auction' }` and `await A.until(m => m.type === 'room' && m.room.mode === 'auction', 2000, 'auction mode accepted')`. Then switch back to `mind` so the existing Mind reader assertions still run. Also add `{ type: 'create', mode: 'auction' }` in the category-first section and assert `cPriv.room.mode === 'auction'` for that extra table, then leave.

- [ ] **Step 2: Run `npm test`** — Expected: timeout `auction mode accepted`.

- [ ] **Step 3: Implement** `MODES` and `normMode` in `Room.js`, use it in the constructor and `host`; `RoomManager.quick/create` call `Room.normMode`. Add the config keys and the test env overrides in `run-tests.js`: `BID_MS: '600', BID_EXTEND_MS: '300', BID_MAX_MS: '1500', SOLD_MS: '80', AUCTION_REVEAL_STEP_MS: '40'`. Add `MODE_NAME.auction`.

- [ ] **Step 4: Run `npm test`** — Expected: green.

### Task 3: Lots, bidding and bots

**Files:**
- Create: `server/auction.js`
- Modify: `server/Room.js` (`startFromLobby` stats init, `startTopic`, new `bid()`, `snapshot`), `server/bots.js`, `server/index.js` (`bid` message)
- Test: `test/run-tests.js` (new section "auction table", placed after the category-first section; uses fresh clients `G`, `H` with `auto = false`)

**Interfaces:**
- Consumes: Task 1 `Scoring.auctionLineup`, `RULES.AUCTION_*`; Task 2 config keys.
- Produces: `server/auction.js` exports `{ openLot(room, i), bid(room, sid, amount), closeLot(room), closeAuction(room), scheduleBots(room) }` (`closeAuction` is a stub in this task that calls `room.endTopic()`; Task 4 fills it in);
  `Room.prototype.bid(sid, amount): boolean`;
  `Bots.ceiling(rating: number[], opt: number, purse: number, slotsLeft: number, lotsLeft: number): number`;
  topic snapshot fields `lot: {i, opt, opened, top: {sid, amount} | null, bids: {sid, amount}[]} | null`, `purses: {[sid]: number}`, `lineupSize: number`, `sold: {opt, sid, price}[]`, `unsold: number[]`; lineup entries `{opt, price, kind: 'bid' | 'free'}`; events `{k: 'lot', opt}`, `{k: 'bid', sid, amount}`, `{k: 'sold', sid, opt, price}`, `{k: 'passed', opt}`.

- [ ] **Step 1: Write the failing assertions**

```js
// G hosts a private auction table with H and one bot
G.send({ type: 'create', mode: 'auction', topic: 'comfort' }); const gl = await G.until(m => m.type === 'room' && m.room.code, 2000, 'auction lobby');
H.send({ type: 'join', code: gl.room.code }); await G.until(m => m.type === 'room' && m.room.seats.length === 2, 2000, 'H joined');
G.send({ type: 'host', action: 'add_bot' }); await G.until(m => m.type === 'room' && m.room.seats.length === 3, 2000, 'bot added');
G.send({ type: 'host', action: 'start' });
const lot0 = await G.until(m => m.type === 'room' && m.room.phase === 'bid', 3000, 'first lot opens');
const T0 = lot0.room.match.topic;
assert.strictEqual(T0.lot.i, 0); assert.strictEqual(T0.lot.opt, T0.layout[0], 'lots follow the shuffled layout');
assert.deepStrictEqual(Object.values(T0.purses), [20, 20, 20]); assert.strictEqual(T0.lineupSize, 4);
G.send({ type: 'bid', amount: 0 }); G.send({ type: 'bid', amount: '5' }); G.send({ type: 'bid', amount: 2.5 });
await sleep(60); assert.strictEqual(G.room.match.topic.lot.top, null, 'zero, string and fractional bids are refused');
H.send({ type: 'bid', amount: 3 });
await G.until(m => m.type === 'room' && m.room.match.topic.lot && m.room.match.topic.lot.top && m.room.match.topic.lot.top.sid === H.room.you && m.room.match.topic.lot.top.amount === 3, 2000, 'H leads at 3');
G.send({ type: 'bid', amount: 2 }); G.send({ type: 'bid', amount: 25 }); H.send({ type: 'bid', amount: 4 });
await sleep(60); assert.strictEqual(G.room.match.topic.lot.top.amount, 3, 'under-bid, over-purse and self-raise are refused');
G.send({ type: 'bid', amount: 4 });
const sold = await G.until(m => m.type === 'room' && m.room.phase === 'sold' && m.room.match.topic.sold.length === 1, 3000, 'first lot sold');
const s0 = sold.room.match.topic.sold[0];
assert.ok(s0.opt === T0.lot.opt && s0.price >= 4, 'card sells for at least the last human bid');
const buyer = s0.sid; const Tsold = sold.room.match.topic;
assert.strictEqual(Tsold.purses[buyer], 20 - s0.price, 'buyer pays'); assert.deepStrictEqual(Tsold.lineups[buyer][0], { opt: s0.opt, price: s0.price, kind: 'bid' });
G.send({ type: 'bid', amount: 9 }); await sleep(60);
assert.strictEqual(G.room.match.topic.lot, null, 'no bids are taken between lots');
```
A bot may outbid G before the clock closes, so the buyer is whoever `sold[0].sid` says, and the price is at least 4.

- [ ] **Step 2: Run `npm test`** — Expected: timeout `first lot opens`.

- [ ] **Step 3: Implement `server/auction.js`** per the spec's Room state machine section. Pacing for bots comes from `Bots.delay(cfg.BOT_MIN_MS, cfg.BOT_MAX_MS)` so the test env's short values apply. On every accepted bid and on lot open: `room.clearTimers()`, re-arm the close timer for `room.deadline - Date.now()`, then `scheduleBots(room)`. `bid()` refuses unless `Number.isInteger(amount)`, `amount >= RULES.AUCTION_MIN_BID`, `amount > (top ? top.amount : 0)`, `amount <= purses[sid]`, lineup not full, `sid !== top.sid`, `room.phase === 'bid'`, and the seat exists. The deadline after a bid is `Math.min(lot.opened + cfg.BID_MAX_MS, Math.max(room.deadline, Date.now() + cfg.BID_EXTEND_MS))`.

- [ ] **Step 4: Implement `Bots.ceiling`** per the spec formula; percentile `v` = share of the other 15 options rated below this one.

- [ ] **Step 5: Wire the room**: `startFromLobby` stats gain `bargain: false, bigSpender: false`; `startTopic` sets `lot: null, purses, lineupSize, sold: [], unsold: []` for auction and, after the intro, calls `Auction.openLot(this, 0)`; add `bid(sid, amount)` delegating to `Auction.bid`; add the five fields to the snapshot; `index.js` handles `case 'bid'`.

- [ ] **Step 6: Run `npm test`** — Expected: the new assertions pass through `no bids are taken between lots`; the rest of the suite green.

### Task 4: Closing the auction, leftovers, reveal, achievements

**Files:**
- Modify: `server/auction.js` (`closeAuction`), `server/accounts.js`, `server/achievements.js`
- Test: `test/run-tests.js` (continue the auction section)

**Interfaces:**
- Consumes: Task 1 `Scoring.auctionTopic`; `room.ratings.rank(topicId)` (option indices best to worst).
- Produces: topic `reveal: {values: {[opt]: number}, change: {[sid]: number}, points: {[sid]: number}}`; event `{k: 'reveal', step: ms}`; stats flags `bargain`, `bigSpender`; achievements `bargain` ("Bargain hunter", 🪙, "Win a top-three card for 3 coins or less") and `big_spender` ("Big spender", 💸, "Spend 15 coins on a single card").

- [ ] **Step 1: Write the failing assertions**

```js
const rv = await G.until(m => m.type === 'room' && m.room.phase === 'reveal', 20000, 'auction reveal');
const Tr = rv.room.match.topic; const seatsN = rv.room.seats.length;
for (const sid of Object.keys(Tr.lineups)) {
  assert.strictEqual(Tr.lineups[sid].length, Tr.lineupSize, 'every lineup is full at the reveal');
  assert.ok(Tr.purses[sid] >= 0 && Tr.lineups[sid].reduce((a, c) => a + c.price, 0) <= 20, 'nobody overspends');
}
assert.ok(Tr.sold.some(s => rv.room.seats.find(x => x.sid === s.sid).bot), 'bots bought at least one card');
const bk3 = (await http(port, '/api/bank')).body; const rank = bk3.topics.find(t => t.id === Tr.id).r;
const recomputed = Scoring.auctionTopic(rank, Tr.lineups, Tr.purses);
assert.deepStrictEqual(Tr.reveal.points, recomputed.points, 'reveal points match shared scoring');
assert.ok(Object.values(Tr.tscore).every((v, i) => v === Object.values(Tr.reveal.points)[i]), 'topic score is the reveal score');
```
Then a six-seat check: a new private auction table with one human and five bots; after the first `reveal`, `lineupSize === 2`, `sold.length + unsold.length + (cards never opened) === 16` expressed as `Object.keys(Tr6.taken).length === 12`. Then the leaver check: in a fresh three-seat table, H bids 1 on lot 0, then `H.close()`; the lot still sells to H's seat (`sold[0].sid === hSid`) and the match reaches `reveal`.

- [ ] **Step 2: Run `npm test`** — Expected: timeout `auction reveal` (closeAuction stub skips the reveal).

- [ ] **Step 3: Implement `closeAuction`** per the spec: leftovers in random seat order from the shuffled unsold pile, `kind: 'free'`, `price: 0`; `Scoring.auctionTopic` on `room.ratings.rank(T.id)`; add to `tscore` and `m.scores`; stats flags (`bargain`: a paid card with `price <= 3` and `value >= 140`; `bigSpender`: `price >= 15`); `T.reveal`; phase `reveal` for `seats * AUCTION_REVEAL_STEP_MS + 2600` then `room.endTopic()`. Unopened lots when all lineups filled early stay neither sold nor unsold.

- [ ] **Step 4: Settlement**: `accounts.settleMatch` unlocks `bargain` and `big_spender`; add both to the achievements catalogue.

- [ ] **Step 5: Run `npm test`** — Expected: `✓ auction: ...` line printed by the section and the suite green. Check the bank shape test still passes (new achievement emoji must not be Unicode 14+).

### Task 5: Auction table UI — block, bids, board, lineups

**Files:**
- Modify: `public/js/table.js`, `public/css/app.css`
- Create: `test/browser/auction.js`, `test/browser/_lib.js`; add `"check:browser": "node test/browser/auction.js"` to `package.json` scripts and `playwright-core` as a devDependency.

**Interfaces:**
- Consumes: Task 3 snapshot fields and events.
- Produces: DOM hooks the browser check reads: `#tray.block` with `.block-art`, `.block-name`, `.block-top`, `.block-purse`, buttons `[data-bid]` carrying the amount; board classes `is-lot`, `is-unsold`, `.tile-price`; lineup `.mini .price`; ticker text "You lead at N" / "{name} leads at N" / "Opening bid 1 coin".

- [ ] **Step 1: Write the failing browser check** `test/browser/auction.js` (base URL from `BASE_URL`, default `http://localhost:3100`): open home, pick "Comfort food" → Start a table, switch the lobby mode segment to Auction, add two bots, start. Wait for `#tray.block`. Assert three `[data-bid]` buttons whose first amount is 1, click it, wait for the ticker to contain "You lead at 1", wait for `.lineups .mini .price` to appear with text matching `/^\d+$/`, assert `.tile.is-lot` exists during a later lot, screenshot. Exit non-zero on any failed assertion.

- [ ] **Step 2: Run it** — Expected: fails waiting for `#tray.block`.

- [ ] **Step 3: Implement** in `table.js`: `renderBlock()` called from `renderTray()` when `r.mode === 'auction'` and phase is `bid` or `sold`; button amounts `top+1`, `top+3`, purse, deduplicated and disabled per the spec; click sends `{type: 'bid', amount}` once per snapshot; `renderBoard` auction branch; `renderLineups` uses `T.lineupSize`, shows purse and price tags, marks the fresh card on `ev.k === 'sold'` so `animatePick` flies it; `renderTicker` and `renderHead` auction copy; `sounds`: `bid` → `other`, `sold` → `pick`, outbid you → `turn`. Styles: `.block`, `.block-art` (max 480px wide, 1:1, rounded, card background), `.tile.is-lot` (clock-yellow inset ring), `.tile.is-unsold` (dimmed), `.tile-price` and `.mini .price` badges in ink on card stock.

- [ ] **Step 4: Run the browser check** — Expected: passes, no console errors, screenshot shows the block with a lot and your bid leading.

### Task 6: Reveal sheet, lobby copy, home and play-sheet entries

**Files:**
- Modify: `public/js/table.js` (`renderSheet` reveal branch, lobby `how` copy), `public/index.html`, `public/js/main.js`, `public/css/app.css`
- Test: `test/browser/auction.js` (extend), `test/browser/home.js` (new, added to `check:browser`)

**Interfaces:**
- Consumes: Task 4 `T.reveal`.
- Produces: home mode card `article.mode[data-mode="auction"]` with `[data-quick="auction"]`; play sheet `[data-play="quick-auction"]`; friends segment `[data-newmode="auction"]`; lobby mode segment includes Auction; reveal sheet `.auction-reveal` rows `.ar-row[data-sid]` with `.ar-total`.

- [ ] **Step 1: Extend the browser checks**: `home.js` asserts the Auction card, the play-sheet option, and that choosing it lands in a lobby whose head subtitle starts with "Auction". `auction.js` waits for `.auction-reveal` and asserts every `.ar-row` total equals the sum of its card values plus change as rendered.

- [ ] **Step 2: Run them** — Expected: `home.js` fails on the missing card.

- [ ] **Step 3: Implement**: third mode card (copy from the spec: "Outbid the table. Build the best lineup." plus one sentence "Everyone gets 20 coins a topic. Bid for the cards you want and dodge the leftovers."); `.modes` becomes `repeat(auto-fit, minmax(260px, 1fr))`; `quick-auction` in the play sheet and `data-quick="auction"` wiring; `data-newmode="auction"`; lobby mode segment iterates `['crowd', 'mind', 'auction']`; lobby `how` copy in four lines; reveal sheet with per-seat rows revealing one by one on `AUCTION_REVEAL_STEP_MS` from `ev.step`, card values, "+N change", total, and the winner line, reusing `.topic-card`.

- [ ] **Step 4: Run both browser checks and `npm test`** — Expected: all pass.

### Task 7: Picture pipeline

**Files:**
- Create: `scripts/fetch-art.js`, `shared/art-overrides.json` (starts as `{}`), `shared/art.json` (generated)
- Modify: `server/bank.js`, `public/js/bank.js`, `package.json` (`"art": "node scripts/fetch-art.js"`)
- Test: `test/run-tests.js` (`checkBank` extension)

**Interfaces:**
- Produces: `shared/art.json` shape `{ [topicId]: { [optIndex]: { src, page, by, lic } } }`; bank payload topic field `a: (ArtEntry | null)[16]` where `ArtEntry = {s, p, by, lic}`; browser `Bank.art(id, opt): ArtEntry | null` and `Bank.img(src: string, width: number): string` (rewrites the `/NNNpx-` segment).

- [ ] **Step 1: Write the failing check** in `checkBank`: load `shared/art.json` if present; for every entry assert the topic exists, `0 <= opt < 16`, `/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(src)`, and `by` and `lic` are non-empty strings. Add to the e2e bank check: `assert.ok(bank.body.topics.every(t => Array.isArray(t.a) && t.a.length === 16), 'bank carries art slots')`.

- [ ] **Step 2: Run `npm test`** — Expected: `bank carries art slots` fails.

- [ ] **Step 3: Implement the script** per the spec: allowlist of topic ids (people: footballers, cricketers, nba, goats, rappers, singers, celebs; food: pizza, desserts, street, fruit, icecream, sauces, drinks, fastfood, comfort, candy; animals: pets, sidekicks, wild, creatures; places: holiday, cities, countries; objects and sport: gadgets, instruments, accessories, gym, cars, clothes, clubs, nbateams, tablegames, rides, sports, weather); hints `{clubs: 'football club', nbateams: 'NBA team', creatures: 'mythology', sports: 'sport'}`; User-Agent `PickPartyArtBot/0.1 (local build script; +https://localhost/pickparty)`; 250 ms between calls; search `srlimit=3`, accept the first title passing the similarity test from the probe (`exact`, substring, or ≥ 0.6 token overlap after stripping parentheses); summary thumbnail must contain `/commons/`; then `action=query&prop=imageinfo&iiprop=extmetadata&titles=File:<name>` for `Artist` (HTML stripped) and `LicenseShortName`; resumable by skipping existing entries; overrides applied last (`null` removes). Print a per-topic hit count at the end.

- [ ] **Step 4: Run `npm run art`** — Expected: finishes without HTTP 429s and reports hits; spot-check ten entries by opening their `page` names and confirm the pictures match the items. Fix wrong matches through `art-overrides.json` and re-run.

- [ ] **Step 5: Attach to the bank**: `server/bank.js` loads `shared/art.json` (missing file means no art), builds `a` per topic, and includes the art JSON in the version hash. `public/js/bank.js` adds `art` and `img`.

- [ ] **Step 6: Run `npm test`** — Expected: green, including the art shape check.

### Task 8: Pictures on every card

**Files:**
- Create: `public/js/art.js`
- Modify: `public/js/table.js`, `public/js/solo.js`, `public/css/app.css`, `public/index.html` (footer credit)
- Test: `test/browser/pictures.js` (added to `check:browser`)

**Interfaces:**
- Consumes: Task 7 `Bank.art`, `Bank.img`.
- Produces: `cardArt(topicId, opt, size: 'tile' | 'mini' | 'block'): string` returning the markup for the picture-or-emoji area: `<span class="art art-{size} has-img"><img src loading="lazy" alt="" onerror="this.parentNode.classList.remove('has-img')"><i class="art-emoji">…</i></span>` or `<span class="art art-{size}"><i class="art-emoji">…</i></span>`; block credit toggle `.block-credit` with text "Photo: {by}, {lic}, via Wikimedia Commons" linking to `https://en.wikipedia.org/wiki/{page}`.

- [ ] **Step 1: Write the failing browser check** `pictures.js`: start a Comfort food solo run; assert at least one `#s-board .tile .art.has-img img` whose `naturalWidth > 0` after load, and at least one tile without `has-img` still showing `.art-emoji` text; then in the page, set one `img.src` to `https://upload.wikimedia.org/does-not-exist.jpg` and assert its parent loses `has-img` within 3 s.

- [ ] **Step 2: Run it** — Expected: fails, no `.art` elements.

- [ ] **Step 3: Implement** `art.js`; use it in `table.js` tiles, lineup minis, vote cards, reveal flips, the auction block (`block` size, 480 px, plus the credit toggle) and in `solo.js` tiles (`tile` size, 112 px). Widths: tile and mini 112, block 480. Styles: `.art` square, rounded 8px, `object-fit: cover`; `.has-img .art-emoji` becomes a small corner badge; without an image the emoji sits centred at the current emoji size. Footer on home: "Item photos from Wikimedia Commons".

- [ ] **Step 4: Run all browser checks and `npm test`** — Expected: all pass; take screenshots of a Comfort food auction block and a Footballers board and look at them.

### Task 9: Documentation and final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README**: add Auction under Modes (rules in four sentences), `bid {amount}` to the protocol summary, `npm run art` and `npm run check:browser` under Run it, `server/auction.js`, `scripts/fetch-art.js`, `shared/art.json` and `public/js/art.js` to the architecture tree, the new timers to the configuration table, and a line under Adding topics saying to re-run `npm run art` for pictures.

- [ ] **Step 2: Run `npm test`** — Expected: green.

- [ ] **Step 3: Restart the server on port 3100 and run `npm run check:browser`** — Expected: all three browser checks pass with no console errors.

- [ ] **Step 4: Phone-width pass**: render the auction block and the reveal at 390 px wide; no horizontal scroll, bid buttons at least 44 px tall.
