'use strict';
const crypto = require('crypto');
const cfg = require('./config');
const { randomId, clamp } = require('./util');
const { ACHIEVEMENTS } = require('./achievements');
const passages = require('./passages');

const hash = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const isCortexisId = (id) => typeof id === 'string' && id.startsWith('cx_');

/** UTC day key, e.g. 2026-09-13. Everyone's streak rolls over at the same instant. */
function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/** ISO week key, e.g. 2026-W37. */
function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);          // Thursday of this week
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Season key: the UTC month, e.g. 2026-09. Seasons are archived on rollover (server/seasons.js). */
function seasonKey(d = new Date()) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

const blank = (id, tokenHash) => ({
  id,
  tokenHash,
  name: 'Guest',
  country: 'UN',
  skin: 'dash',
  createdAt: Date.now(),
  lastSeen: Date.now(),

  points: 0,
  races: 0,
  wins: 0,
  podiums: 0,
  chars: 0,
  golden: 0,
  nitros: 0,
  friendlies: 0,
  friendlyWins: 0,

  bestWpm: 0,
  bestCombo: 0,
  bestScore: 0,

  streak: 0,
  bestStreak: 0,
  lastPlayDay: null,

  day: { key: null, points: 0, races: 0, wins: 0 },
  week: { key: null, points: 0, races: 0, wins: 0 },
  season: { key: null, points: 0, races: 0, wins: 0 },
  badges: [],            // seasonal placings: { season, number, rank }
  team: null,            // team id (server/teams.js)
  langs: {},             // finished runs per passage language, e.g. { en: 12, es: 3 }
  done: [],              // ids of the English paragraphs finished at least once (passages.CHAIN)

  achievements: [],
  rivals: {},

  // practice runs (computed in the browser, validated once on submit)
  solo: { runs: 0, finished: 0, bestWpm: 0, bestAcc: 0, pacerWins: 0, chars: 0 },
  // daily challenge (see server/daily.js)
  daily: { last: null, streak: 0, bestStreak: 0, best: 0, count: 0, bestRank: null },
});

const SOLO_BLANK = () => ({ runs: 0, finished: 0, bestWpm: 0, bestAcc: 0, pacerWins: 0, chars: 0 });

/**
 * Persistent player accounts: identity, lifetime stats, ranked points, daily
 * streaks, achievements and head-to-head records.
 *
 * Identity is device-based and sign-up free: the server mints an id plus a
 * secret token on first connect, the browser keeps them in localStorage, and
 * only the token's hash is ever stored. Losing the token just means starting a
 * fresh profile, which is the right trade for a no-signup arcade game.
 */
class Accounts {
  constructor(store) {
    this.store = store;
    this.accounts = store.data.accounts;
    this.beforeSeasonReset = null;   // seasons.js archives the old season before any counter is cleared
    this.onMerge = null;             // (guest, into): move records kept outside the account (daily, ghosts, team)
  }

  get all() { return Object.values(this.accounts); }
  get size() { return Object.keys(this.accounts).length; }

  /**
   * Resolve an account from (id, token), or mint a fresh guest. A guest's
   * token is its tokenHash; a Cortexis account (cx_) has one session per
   * signed-in device. `country` seeds a freshly minted guest.
   */
  login(id, token, { country = null } = {}) {
    const acc = id && Object.prototype.hasOwnProperty.call(this.accounts, id) ? this.accounts[id] : null;
    if (acc && token && this.tokenMatches(acc, token)) {
      acc.lastSeen = Date.now();
      this.rollWindows(acc);
      this.store.touch();
      return { account: acc, token: null, created: false };
    }
    const newId = `p_${randomId(14)}`;
    const newToken = crypto.randomBytes(24).toString('base64url');
    const fresh = blank(newId, hash(newToken));
    if (country) fresh.country = country;
    this.accounts[newId] = fresh;
    this.store.touch();
    return { account: fresh, token: newToken, created: true };
  }

  tokenMatches(acc, token) {
    const h = hash(token);
    if (acc.tokenHash && acc.tokenHash === h) return true;
    return Array.isArray(acc.sessions) && acc.sessions.some((x) => x.h === h);
  }

  isCortexis(acc) { return !!acc && isCortexisId(acc.id); }

  /** On the boards? Signed-in players only (unless RANK_GUESTS), and never a guest already merged away. */
  isRanked(acc) {
    return !!acc && !acc.mergedInto && (isCortexisId(acc.id) || cfg.RANK_GUESTS);
  }

  /** Same test from an id alone (daily entries and ghosts are keyed by account id). */
  isRankedId(id) {
    const acc = Object.prototype.hasOwnProperty.call(this.accounts, id) ? this.accounts[id] : null;
    return acc ? this.isRanked(acc) : isCortexisId(id);
  }

  /**
   * Sign a player in with a verified Cortexis identity. Creates cx_<sub> on
   * first sight (nickname from the Cortexis name, country from the caller),
   * folds in the guest the browser was playing as (once), and opens a new
   * session for this device. Returns { account, token, created, merged }.
   */
  bindCortexis({ sub, name }, { guest = null, country = null, nickname = null } = {}) {
    const id = `cx_${sub}`;
    let acc = this.accounts[id];
    const created = !acc;
    if (created) {
      acc = blank(id, null);
      acc.name = nickname || 'Player';
      if (guest && guest.country && guest.country !== 'UN') acc.country = guest.country;
      else if (country) acc.country = country;
      if (guest && guest.skin) acc.skin = guest.skin;
      this.accounts[id] = acc;
    }
    const now = Date.now();
    acc.cx = { sub: String(sub), name: String(name || '').slice(0, 80), linkedAt: (acc.cx && acc.cx.linkedAt) || now, lastAuthAt: now };
    this.rollWindows(acc);

    let merged = false;
    if (guest && guest !== acc && !isCortexisId(guest.id) && !guest.mergedInto) {
      this.merge(guest, acc);
      merged = true;
    }

    const token = crypto.randomBytes(24).toString('base64url');
    acc.sessions = [{ h: hash(token), at: now }, ...(acc.sessions || [])].slice(0, cfg.CX_SESSIONS_MAX);
    acc.lastSeen = now;
    this.store.touch();
    return { account: acc, token, created, merged };
  }

  /** Forget one device's session (sign-out). Guests have nothing to revoke. */
  revoke(acc, token) {
    if (!acc || !token || !Array.isArray(acc.sessions)) return false;
    const h = hash(token);
    const before = acc.sessions.length;
    acc.sessions = acc.sessions.filter((x) => x.h !== h);
    if (acc.sessions.length !== before) this.store.touch();
    return acc.sessions.length !== before;
  }

  /**
   * Fold a guest's record into a Cortexis account, once. Counters add up,
   * bests keep the higher, streaks follow whichever played last. Records kept
   * outside the account (daily entries, ghosts, team membership) move via
   * `onMerge`. The guest keeps its record (marked mergedInto) but its
   * credentials stop working and it never appears on a board.
   */
  merge(guest, into) {
    const now = new Date();
    this.rollWindows(guest, now);
    this.rollWindows(into, now);
    const add = (k) => { into[k] = (into[k] || 0) + (guest[k] || 0); };
    const max = (k) => { into[k] = Math.max(into[k] || 0, guest[k] || 0); };
    ['points', 'races', 'wins', 'podiums', 'chars', 'golden', 'nitros', 'friendlies', 'friendlyWins'].forEach(add);
    ['bestWpm', 'bestCombo', 'bestScore', 'bestStreak'].forEach(max);
    if (guest.lastPlayDay && (!into.lastPlayDay || guest.lastPlayDay > into.lastPlayDay || (guest.lastPlayDay === into.lastPlayDay && guest.streak > into.streak))) {
      into.streak = guest.streak;
      into.lastPlayDay = guest.lastPlayDay;
    }
    for (const w of ['day', 'week', 'season']) {
      if (!guest[w] || !into[w] || guest[w].key !== into[w].key) continue;
      for (const k of ['points', 'races', 'wins']) into[w][k] += guest[w][k] || 0;
    }
    const seen = new Set((into.badges || []).map((b) => `${b.season}:${b.team || ''}`));
    for (const b of guest.badges || []) if (!seen.has(`${b.season}:${b.team || ''}`)) (into.badges ||= []).push(b);
    into.langs ||= {};
    for (const [l, n] of Object.entries(guest.langs || {})) into.langs[l] = (into.langs[l] || 0) + n;
    if (guest.done && guest.done.length) into.done = [...new Set([...(into.done || []), ...guest.done])];
    for (const a of guest.achievements || []) if (!into.achievements.includes(a)) into.achievements.push(a);
    for (const [rid, r] of Object.entries(guest.rivals || {})) {
      if (rid === into.id) continue;
      const t = (into.rivals[rid] ||= { n: 0, w: 0, l: 0, name: r.name, country: r.country });
      t.n += r.n || 0; t.w += r.w || 0; t.l += r.l || 0;
      if ((r.at || 0) >= (t.at || 0)) { t.at = r.at; t.name = r.name; t.country = r.country; }
    }
    delete into.rivals[guest.id];
    const gs = { ...SOLO_BLANK(), ...(guest.solo || {}) };
    const is = (into.solo = { ...SOLO_BLANK(), ...(into.solo || {}) });
    for (const k of ['runs', 'finished', 'pacerWins', 'chars']) is[k] += gs[k];
    for (const k of ['bestWpm', 'bestAcc']) is[k] = Math.max(is[k], gs[k]);
    if (guest.daily) {
      const gd = guest.daily;
      const d = (into.daily ||= { last: null, streak: 0, bestStreak: 0, best: 0, count: 0, bestRank: null });
      if (gd.last && (!d.last || gd.last > d.last)) { d.last = gd.last; d.streak = gd.streak; }
      d.bestStreak = Math.max(d.bestStreak || 0, gd.bestStreak || 0);
      d.best = Math.max(d.best || 0, gd.best || 0);
      d.count = (d.count || 0) + (gd.count || 0);
    }
    if (Array.isArray(guest.push) && guest.push.length) {
      const have = new Set((into.push || []).map((x) => x.endpoint));
      into.push = [...(into.push || []), ...guest.push.filter((x) => !have.has(x.endpoint))].slice(-cfg.PUSH_MAX_SUBS);
      if (!into.pushPrefs && guest.pushPrefs) into.pushPrefs = guest.pushPrefs;
    }
    into.createdAt = Math.min(into.createdAt || Date.now(), guest.createdAt || Date.now());
    if (this.onMerge) this.onMerge(guest, into);

    guest.mergedInto = into.id;
    guest.mergedAt = Date.now();
    guest.tokenHash = null;
    guest.push = [];
    this.store.touch();
  }

  /** Reset per-day / per-week counters when the calendar moves on. */
  rollWindows(acc, now = new Date()) {
    const d = dayKey(now);
    const w = weekKey(now);
    const s = seasonKey(now);
    if (acc.day.key !== d) acc.day = { key: d, points: 0, races: 0, wins: 0 };
    if (acc.week.key !== w) acc.week = { key: w, points: 0, races: 0, wins: 0 };
    if (!acc.season) acc.season = { key: null, points: 0, races: 0, wins: 0 };
    if (acc.season.key !== s) {
      if (acc.season.key && this.beforeSeasonReset) this.beforeSeasonReset(now);
      acc.season = { key: s, points: 0, races: 0, wins: 0 };
    }
    if (!acc.badges) acc.badges = [];
    // a streak dies once a whole day has been missed
    if (acc.lastPlayDay && daysBetween(acc.lastPlayDay, d) > 1 && acc.streak !== 0) acc.streak = 0;
  }

  setIdentity(acc, { name, country, skin }) {
    if (name) acc.name = name;
    if (country) acc.country = country;
    if (skin) acc.skin = skin;
    acc.lastSeen = Date.now();
    this.store.touch();
  }

  /**
   * Ranked points from server-validated race stats. The client's own score,
   * combo and nitro counters are cosmetic; these are the numbers the global
   * boards are built from.
   */
  pointsFor(r, streak) {
    let p = r.chars;                                   // distance covered
    p += Math.round(r.wpm * 3);                        // speed
    if (r.finished) {
      p += r.accuracy >= 100 ? 150 : r.accuracy >= 98 ? 80 : r.accuracy >= 95 ? 30 : 0;
      p += r.rank === 1 ? 200 : r.rank === 2 ? 120 : r.rank === 3 ? 80 : 40;
    }
    p += r.golden * 60;
    p += Math.min(r.bestCombo, r.chars);
    const mult = 1 + Math.min(cfg.STREAK_BONUS_CAP, Math.max(0, streak) * cfg.STREAK_BONUS_STEP);
    return Math.max(10, Math.round(p * mult));
  }

  /**
   * Apply a finished race. Returns everything the client needs to celebrate:
   * points earned, the streak state, and any achievements unlocked.
   */
  recordRace(acc, race, now = new Date()) {
    this.rollWindows(acc, now);
    const streakEvent = this.touchStreak(acc, dayKey(now));

    const r = {
      rank: race.rank,
      wpm: race.wpm,
      accuracy: race.accuracy,
      errors: race.errors,
      finished: !!race.finished,
      chars: race.chars,
      golden: race.golden,
      goldenTotal: race.goldenTotal,
      bestCombo: race.bestCombo,
      nitros: race.nitros,
      score: race.score,
      lane: race.lane,
      racers: race.racers,
      humans: race.humans,
      ranked: !!race.ranked,
      setWr: !!race.setWr,                 // this run became the passage's world record (server/ghosts.js)
      lang: race.lang || 'en',
      category: race.category || 'prose',
      hour: now.getUTCHours(),
    };
    if (r.finished) this.countLang(acc, r.lang);

    const points = r.ranked ? this.pointsFor(r, acc.streak) : 0;

    acc.races += 1;
    acc.chars += r.chars;
    acc.golden += r.golden;
    acc.nitros += r.nitros;
    if (r.rank === 1) acc.wins += 1;
    if (r.rank <= 3) acc.podiums += 1;
    if (r.finished) acc.bestWpm = Math.max(acc.bestWpm, r.wpm);
    acc.bestCombo = Math.max(acc.bestCombo, r.bestCombo);
    acc.bestScore = Math.max(acc.bestScore, r.score || 0);
    if (!r.ranked && r.humans > 1) {
      acc.friendlies += 1;
      if (r.rank === 1) acc.friendlyWins += 1;
    }
    if (points) {
      acc.points += points;
      acc.day.points += points;
      acc.week.points += points;
      acc.season.points += points;
    }
    acc.day.races += 1;
    acc.week.races += 1;
    acc.season.races += 1;
    if (r.rank === 1) { acc.day.wins += 1; acc.week.wins += 1; acc.season.wins += 1; }
    acc.lastSeen = Date.now();

    const unlocked = this.unlock(acc, r, ['race', 'any']);

    this.store.touch();
    return { points, streak: acc.streak, bestStreak: acc.bestStreak, streakEvent, unlocked, ranked: r.ranked };
  }

  countLang(acc, lang) {
    if (!acc.langs) acc.langs = {};
    acc.langs[lang] = (acc.langs[lang] || 0) + 1;
  }

  /** Daily streak: the first finished run of the day keeps it alive. Returns the event, or null if today was already banked. */
  touchStreak(acc, d) {
    if (acc.lastPlayDay === d) return null;
    const gap = acc.lastPlayDay ? daysBetween(acc.lastPlayDay, d) : null;
    let event;
    if (gap === 1) { acc.streak += 1; event = 'extended'; }
    else { event = acc.streak > 1 ? 'reset' : 'started'; acc.streak = 1; }
    acc.lastPlayDay = d;
    acc.bestStreak = Math.max(acc.bestStreak, acc.streak);
    return event;
  }

  /** Evaluate every achievement in `scopes` that the account does not have yet. */
  unlock(acc, r, scopes) {
    const unlocked = [];
    for (const a of ACHIEVEMENTS) {
      if (!scopes.includes(a.scope || 'race')) continue;
      if (acc.achievements.includes(a.id)) continue;
      let ok = false;
      try { ok = !!a.check(acc, r); } catch (_) { ok = false; }
      if (ok) { acc.achievements.push(a.id); unlocked.push(a.id); }
    }
    return unlocked;
  }

  /**
   * Apply a finished practice run (see server/solo.js). Practice never awards
   * ranked points or touches the racing stats the world boards are built
   * from; it keeps the daily streak alive, counts typing volume and tracks a
   * separate practice best.
   */
  recordSolo(acc, run, now = new Date()) {
    this.rollWindows(acc, now);
    const streakEvent = run.finished && cfg.SOLO_STREAK ? this.touchStreak(acc, dayKey(now)) : null;

    const s = (acc.solo ||= SOLO_BLANK());
    s.runs += 1;
    s.chars += run.chars;
    acc.chars += run.chars;
    let improved = false;
    let opened = null;
    if (run.finished) {
      s.finished += 1;
      this.countLang(acc, run.lang || 'en');
      if (run.wpm > s.bestWpm) { s.bestWpm = run.wpm; improved = true; }
      if (run.accuracy > s.bestAcc) s.bestAcc = run.accuracy;
      if (run.beatPacer) s.pacerWins += 1;
      opened = this.markDone(acc, run.passageId);
    }
    acc.lastSeen = Date.now();

    const unlocked = this.unlock(acc, { ...run, solo: true, rank: run.beatPacer ? 1 : 2 }, ['solo', 'any']);

    this.store.touch();
    return { streak: acc.streak, bestStreak: acc.bestStreak, streakEvent, unlocked, improved, best: s.bestWpm, runs: s.finished, opened };
  }

  /**
   * An English paragraph was typed to the end (practice or daily): keep it
   * open for good. Returns the paragraph this opened, { id, n, title }, when
   * finishing it moved the player's next paragraph on; otherwise null.
   */
  markDone(acc, passageId) {
    const p = passages.byId(passageId);
    if (!passages.inChain(p)) return null;
    const done = (acc.done ||= []);
    if (done.includes(p.id)) return null;
    const before = passages.chainState(done).next;
    done.push(p.id);
    const after = passages.chainState(done).next;
    return after && after !== before ? { id: after.id, n: after.chain, title: after.title } : null;
  }

  /** Head-to-head record between two humans who raced in the same room. */
  recordHeadToHead(winner, loser) {
    if (!winner || !loser || winner.id === loser.id) return;
    const a = (winner.rivals[loser.id] ||= { n: 0, w: 0, l: 0, name: loser.name, country: loser.country });
    const b = (loser.rivals[winner.id] ||= { n: 0, w: 0, l: 0, name: winner.name, country: winner.country });
    a.n += 1; a.w += 1; a.name = loser.name; a.country = loser.country; a.at = Date.now();
    b.n += 1; b.l += 1; b.name = winner.name; b.country = winner.country; b.at = Date.now();
    // keep the rival list bounded: drop the least-played once it grows large
    for (const acc of [winner, loser]) {
      const ids = Object.keys(acc.rivals);
      if (ids.length > cfg.MAX_RIVALS) {
        ids.sort((x, y) => (acc.rivals[x].at || 0) - (acc.rivals[y].at || 0));
        delete acc.rivals[ids[0]];
      }
    }
    this.store.touch();
  }

  /** Everything the client shows about itself. */
  profile(acc) {
    const rivals = Object.entries(acc.rivals)
      .map(([id, r]) => ({ id, ...r }))
      .sort((a, b) => b.n - a.n || (b.at || 0) - (a.at || 0))
      .slice(0, 8);
    return {
      id: acc.id,
      name: acc.name,
      country: acc.country,
      skin: acc.skin,
      signedIn: isCortexisId(acc.id),     // a Cortexis account, not a guest
      ranked: this.isRanked(acc),         // appears on the boards
      cortexisName: acc.cx ? acc.cx.name : null,
      points: acc.points,
      races: acc.races,
      wins: acc.wins,
      podiums: acc.podiums,
      chars: acc.chars,
      golden: acc.golden,
      nitros: acc.nitros,
      friendlies: acc.friendlies,
      friendlyWins: acc.friendlyWins,
      bestWpm: acc.bestWpm,
      bestCombo: acc.bestCombo,
      bestScore: acc.bestScore,
      streak: acc.streak,
      bestStreak: acc.bestStreak,
      lastPlayDay: acc.lastPlayDay,
      playedToday: acc.lastPlayDay === dayKey(),
      today: { points: acc.day.points, races: acc.day.races, wins: acc.day.wins },
      week: { points: acc.week.points, races: acc.week.races, wins: acc.week.wins },
      season: { key: acc.season ? acc.season.key : null, points: acc.season ? acc.season.points : 0, races: acc.season ? acc.season.races : 0, wins: acc.season ? acc.season.wins : 0 },
      badges: acc.badges || [],
      team: acc.team || null,
      langs: acc.langs || {},
      done: (acc.done || []).filter((id) => passages.inChain(passages.byId(id))),   // English paragraphs finished: the browser opens the chain from these
      push: { devices: (acc.push || []).length, prefs: acc.pushPrefs || null },
      achievements: acc.achievements,
      rivals,
      solo: { ...SOLO_BLANK(), ...(acc.solo || {}) },
      daily: { last: null, streak: 0, bestStreak: 0, best: 0, count: 0, bestRank: null, ...(acc.daily || {}), playedToday: !!(acc.daily && acc.daily.last === dayKey()) },
    };
  }
}

module.exports = { Accounts, dayKey, weekKey, seasonKey, daysBetween, isCortexisId, clampPoints: clamp };
