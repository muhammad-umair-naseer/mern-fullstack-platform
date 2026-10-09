# Auction mode and item pictures — design

Date: 2026-10-03. Status: awaiting review.

## Goal

Add a third game mode, **Auction**, where every player gets 20 coins per topic and bids live for the cards, so a Footballers topic becomes "build the strongest side" and a Comfort food topic becomes "build the tastiest plate". Alongside it, show real pictures of items wherever cards appear, before a card is bought (on the board and on the auction block) and after (in lineups and the reveal), with the existing emoji as the fallback.

Mode id `auction`, display name "Auction", tagline "Outbid the table. Build the best lineup.", glyph 🔨.

## Rules

| Rule | Value |
| --- | --- |
| Purse per player, per topic | 20 coins, reset every topic |
| Lots | the 16 cards, one at a time, in the board's shuffled order |
| Lineup size | 4 cards at 3 or 4 players, 3 at 5 players, 2 at 6 players (`min(4, floor(16 / seats))`) |
| Opening bid | 1 coin |
| Raise | any whole number above the top bid, up to the coins you hold |
| Clock | 8 s when a lot opens; a bid resets it to 4 s if less remains; never past 24 s after the lot opened |
| Clock runs out | top bidder pays and takes the card; no bids means the card stays unsold |
| Auction ends | when every lineup is full, or the 16th lot closes |
| Leftovers | each empty slot gets an unsold card for free, assigned in random seat order from the shuffled unsold pile |
| Card value | `(16 - rank) * 10`, so the crowd's favourite is 160 and the least loved is 10 |
| Pocket change | 5 points per coin left at the end of the topic |
| Topic score | sum of card values in your lineup plus pocket change |
| Topic winner | highest topic score; ties share, as today |

Prices paid are not subtracted. Overpaying hurts because the coins are gone for later cards, which is the real tension of an auction.

You cannot outbid yourself, bid with a full lineup, bid below or equal to the top bid, or bid more than your purse. Away players never bid; bots do.

## Server

### Config (`server/config.js`)

| Key | Default | Meaning |
| --- | --- | --- |
| `BID_MS` | 8000 | clock when a lot opens |
| `BID_EXTEND_MS` | 4000 | clock after a bid, if less remains |
| `BID_MAX_MS` | 24000 | hard cap per lot from the moment it opens |
| `SOLD_MS` | 1300 | pause after a sale or a pass |
| `AUCTION_REVEAL_STEP_MS` | 900 | per-seat step in the reveal count-up |

### Shared scoring (`shared/scoring.js`)

New rules: `AUCTION_PURSE = 20`, `AUCTION_MAX_LINEUP = 4`, `AUCTION_VALUE_STEP = 10`, `AUCTION_CHANGE_PTS = 5`.

New functions:

- `auctionLineup(seats)` returns the lineup size for a seat count.
- `auctionTopic(rank, lineups, purses)` where `rank` is the option indices best to worst, `lineups` is `{sid: [{opt, price}]}` and `purses` is `{sid: coins}`. Returns `{points: {sid}, values: {opt: value}, change: {sid: coins * 5}}`. Pure, deterministic, used by the server for settlement and by the browser for the reveal.

### Room state machine (`server/Room.js`)

Topic state gains:

```
lot:        { i, opt, opened, top: {sid, amount} | null, bids: [{sid, amount}] } | null
purses:     { sid: coins }
lineupSize: n
sold:       [{ opt, sid, price }]
unsold:     [opt]
```

Lineup entries carry `price` and `kind` (`bid` or `free`).

Phases for a topic in this mode: `intro` → (`bid` → `sold`)* → `reveal` → `topic_end`.

- `startTopic` sets purses, lineup size and opens lot 0 after the intro.
- `openLot(i)`: if every lineup is full or `i === 16`, go to `closeAuction()`. Otherwise set `lot`, phase `bid` with deadline `now + BID_MS`, event `{k: 'lot', opt}`, and schedule bot decisions.
- `bid(sid, amount)`: validates the rules above, sets `top`, extends the deadline to `max(deadline, now + BID_EXTEND_MS)` capped at `opened + BID_MAX_MS`, re-arms the timer, broadcasts `{k: 'bid', sid, amount}`, and schedules bot responses. Returns false on any rejected bid; rejected bids are silent, as rejected picks are today.
- `closeLot()`: with a top bid, move the card into the winner's lineup, deduct the purse, push to `sold`, broadcast `{k: 'sold', sid, opt, price}` with phase `sold` for `SOLD_MS`. With no bids, push to `unsold`, broadcast `{k: 'passed', opt}` with phase `sold` for `SOLD_MS / 2`. Then `openLot(i + 1)`.
- `closeAuction()`: hand out leftovers, compute `auctionTopic` from `this.ratings.rank(T.id)`, add points to `tscore` and `scores`, set `T.reveal = {values, change, points}`, mark stats, and enter `reveal` for `seats * AUCTION_REVEAL_STEP_MS + 2600`, then the existing `endTopic()`.

The snapshot adds `lot`, `purses`, `lineupSize`, `sold`, `unsold` under `topic`. Nothing in this mode is secret, so every seat sees the same topic state.

The existing `draftOrder`, `isDudRound`, voting and secret code paths are untouched; `startTopic` branches on mode as it does for Mind reader. `host` accepts `auction` as a mode and so does `RoomManager.quick` and `create`.

### Protocol (`server/index.js`)

Client → server adds `bid {amount}`. The handler calls `room.bid(p.sid, msg.amount)` when a match is running. The README protocol summary lists it.

### Bots (`server/bots.js`)

`Bots.ceiling(rating, opt, purse, slotsLeft, lotsLeft)`:

- `v` is the card's rating percentile among the board's 16 options, 0 to 1.
- `fair = purse / slotsLeft`.
- `ceiling = round(fair * (0.4 + 1.6 * v) * (1 + 0.25 * gauss()))`, clamped to `[0, purse]`.
- If `v < 0.3` the ceiling is 0, unless `slotsLeft >= lotsLeft`, in which case it is at least 1 so a bot does not finish with nothing.

Each bot computes its ceiling once per lot. On lot open and after every bid, every bot that is not the top bidder, has coins and an empty slot, and whose ceiling is above the current top, gets a decision scheduled after `Bots.delay(500, 1600)`. When it fires, the bot bids `top + 1` (or 1 on an empty lot) if the lot and top are unchanged and the phase is still `bid`. The hard cap on the clock ends bot-versus-bot wars.

### Settlement and achievements

Stats gain `bargain` and `bigSpender`. `accounts.settleMatch` unlocks:

- **Bargain hunter** 🪙: a card worth 140 or more for 3 coins or fewer, paid, not free.
- **Big spender** 💸: 15 coins or more on one card.

Topic wins and ranked points work exactly as in the other modes.

### Crowd learning

Bids do not update the crowd ratings in this version. Bots read ratings; humans' prices are not fed back.

## Client

### Table (`public/js/table.js`, `public/css/app.css`)

- **Head**: subtitle reads "Lot 5 of 16" during bidding, "Sold" during the pause, "The reveal" at the end.
- **Ticker**: during `bid`, "You lead at 5" or "Ali leads at 5" with the avatar of the leader, or "Opening bid 1 coin" when nobody has bid. The ticker turns yellow (the existing `is-you` treatment) when you can still bid and are not leading, which is the moment that needs your attention. The clock uses the same countdown bar.
- **Auction block**: the tray under the ticker becomes the block. It shows the lot's picture at up to 480 px wide (or the emoji at poster size), the name, the top bid, and three buttons: "Bid N" for top plus 1, "Bid N" for top plus 3, and "All in N" for your whole purse. Buttons show the exact coins and disable when the amount exceeds your purse, when your lineup is full, or when you already lead. Your purse shows as a coin count next to the buttons.
- **Board**: the current lot's tile glows (`is-lot`), sold tiles show the owner avatar and a price badge, unsold tiles dim. Tiles are not pickable in this mode.
- **Lineups**: each seat shows its purse ("14 coins") and `lineupSize` slots. Cards show their price tag; free leftovers show "free". A sold card flies from the board to the lineup like a drafted card does.
- **Reveal**: the sheet lists each seat's lineup with card values counting up seat by seat, pocket change, the topic total, and the winner. Reuses the existing sheet styling and `topic_end` card.
- **Sounds**: a bid plays the existing `other` cue, a sale plays `pick`, your being outbid plays `turn`.

### Home and lobby

- A third mode card "Auction" with a Quick match button.
- The play sheet gains "Quick match · Auction".
- The friends segment and the lobby's mode segment gain "Auction".
- `MODE_NAME` gains `auction: 'Auction'`. The lobby's "How it works" copy for the mode: purse, bidding, leftovers, scoring, in four lines.

### Item pictures

- A build script `scripts/fetch-art.js` (Node, no dependencies, polite 250 ms pacing, resumable) looks up each option of an allowlisted topic on Wikipedia: name-first search, a disambiguation hint for a few topics, a title-similarity check, then the page summary. It keeps a result only when the thumbnail is hosted under Wikimedia Commons, and fetches the file's author and licence through the image-info API. Output goes to `shared/art.json` as `{ "topicId": { "optIndex": { "src", "page", "by", "lic" } } }`. `shared/art-overrides.json` lets a human pin or block an item; the script applies it last.
- Allowlisted topics are people, food and drink, animals, places, objects and sports packs. Concept packs (Green flags, Perfect morning, Love languages and the like) and media packs (Movies, TV shows, Disney, anime, games, Fortnite, Minecraft, Drake songs, Rap albums) are skipped: concepts have no sensible photo and media artwork is non-free. Brands and clubs are allowed and mostly fall out as non-free logos. The probe on 25 mixed items found free photos for 13, concentrated in people and food.
- The server attaches art to the bank payload as `a` on each topic: an array of 16 entries, each `{s, p, by, lic}` or `null`. The bank version hash covers it. `Bank.art(id, opt)` exposes it in the browser and `Bank.img(src, width)` rewrites the Wikimedia thumbnail width segment, 480 px for the block and 112 px for tiles and lineup minis.
- Every tile, lineup card, vote card, reveal card and solo tile renders the picture when it exists, with `loading="lazy"`, and falls back to the emoji on load error. The emoji stays visible as a small corner badge over a picture so the look stays consistent across items with and without photos. Categories on the home page and in pickers keep their emoji.
- Credit: the auction block has a small ⓘ toggle that shows "Photo: {by}, {lic}, via Wikimedia Commons" with a link to the page. The home footer gains "Item photos from Wikimedia Commons". Images are hotlinked from Wikimedia, which is fine at party-game traffic; a self-hosted cache is a follow-up if the game grows.

## Tests

Server suite (`test/run-tests.js`):

- Bank shape: every `art.json` entry points at an existing topic and option index and an `https://` URL on a `wikimedia.org` host.
- Scoring: `auctionTopic` on a fixed rank, lineups and purses returns the expected points, values and change.
- Auction table: a private table with two humans and a bot in `auction` mode. After the intro, the phase is `bid` with a lot and purses of 20. A bid of 0 is refused. B bids 3 and becomes top. A's bid of 2 is refused, A's bid of 25 is refused, A's bid of 4 becomes top. On `sold`, A's lineup holds the card at price 4 and A's purse is 16. The topic completes: every lineup has `lineupSize` cards, no purse is negative, prices per seat sum to at most 20, and the reveal points equal `auctionTopic` recomputed from the snapshot. Bots bid at least once across the topic, which holds because a bot with an empty lineup and enough coins always has a ceiling of at least 1 on the last lots.

Browser check (headless Chrome, not part of `npm test`): choose Comfort food on the home page, start a private table in Auction mode, add two bots, start, bid through the block's buttons, see the ticker say you lead, watch the sale land in your lineup with its price, and confirm the block shows a photo for an item that has one and the emoji for one that doesn't.

## Out of scope

- Players nominating which card comes up next.
- A table vote for the tastiest or strongest lineup.
- Teaching the crowd model from bid prices.
- Self-hosting or resizing pictures on our own server.
- Pictures for media packs where only non-free artwork exists.
