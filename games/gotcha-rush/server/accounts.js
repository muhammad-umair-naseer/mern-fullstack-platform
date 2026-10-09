'use strict';
const crypto = require('crypto');
const cfg = require('./config');
const { randomId } = require('./util');
const { ACHIEVEMENTS } = require('./achievements');

const hash = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const isCortexisId = (id) => typeof id === 'string' && id.startsWith('cx_');

/** UTC day key, e.g. 2026-09-24 — everyone's streak rolls over at the same instant. */
function dayKey(d = new Date()) { return d.toISOString().slice(0, 10); }

/** ISO week key, e.g. 2026-W39. */
function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

const blankLang = () => ({ rounds: 0, correct: 0 });
const blank = (id, tokenHash) => ({
  id,
  tokenHash,
  name: 'Guest',
  country: 'UN',
  avatar: 'bolt',
  createdAt: Date.now(),
  lastSeen: Date.now(),

  points: 0,
  matches: 0,
  wins: 0,
  podiums: 0,
  rounds: 0,        // rounds played (any mode)
  correct: 0,       // rounds answered correctly
  bestCombo: 0,
  bestRush: 0,
  rushRuns: 0,
  perfects: 0,
  friendlies: 0,
  friendlyWins: 0,
  langs: { js: blankLang(), py: blankLang() },

  streak: 0,
  bestStreak: 0,
  lastPlayDay: null,
  day: { key: null, points: 0, matches: 0, wins: 0 },
  week: { key: null, points: 0, matches: 0, wins: 0 },

  achievements: [],
  rivals: {},
});

/**
 * Persistent player accounts: sign-up-free identity (id + secret token, only
 * the token's hash is stored), ranked points, daily streaks, lifetime stats,
 * achievements and head-to-head records.
 */
class Accounts {
  constructor(store) {
    this.store = store;
    this.accounts = store.data.accounts;
  }

  get all() { return Object.values(this.accounts); }
  get size() { return Object.keys(this.accounts).length; }

  /**
   * Resolve an account from (id, token), or mint a fresh guest. A guest's
   * token is its tokenHash; a Cortexis account (cx_) has one session per
   * signed-in device. `country` seeds a freshly minted guest.
   */
  login(id, token, { country = null } = {}) {
    const acc = this.find(id, token);
    if (acc) {
      this.migrate(acc);
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

  /** The account these credentials open, or null. Never mints anything. */
  find(id, token) {
    const acc = typeof id === 'string' && Object.prototype.hasOwnProperty.call(this.accounts, id) ? this.accounts[id] : null;
    return acc && token && this.tokenMatches(acc, token) ? acc : null;
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
      if (guest && guest.avatar) acc.avatar = guest.avatar;
      this.accounts[id] = acc;
    }
    this.migrate(acc);
    const now = Date.now();
    acc.cx = { sub: String(sub), name: String(name || '').slice(0, 80), linkedAt: (acc.cx && acc.cx.linkedAt) || now, lastAuthAt: now };

    let merged = false;
    if (guest && guest !== acc && !isCortexisId(guest.id) && !guest.mergedInto) {
      this.merge(guest, acc);
      merged = true;
    }

    const token = crypto.randomBytes(24).toString('base64url');
    acc.sessions = [{ h: hash(token), at: now }, ...(acc.sessions || [])].slice(0, cfg.CX_SESSIONS_MAX);
    acc.lastSeen = now;
    this.rollWindows(acc);
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
   * bests keep the higher, the streak follows whichever played last. The
   * guest keeps its record (marked mergedInto) but its credentials stop
   * working and it never appears on a board.
   */
  merge(guest, into) {
    this.migrate(guest);
    this.migrate(into);
    const now = new Date();
    this.rollWindows(guest, now);
    this.rollWindows(into, now);
    for (const k of ['points', 'matches', 'wins', 'podiums', 'rounds', 'correct', 'rushRuns', 'perfects', 'friendlies', 'friendlyWins']) into[k] = (into[k] || 0) + (guest[k] || 0);
    for (const k of ['bestCombo', 'bestRush', 'bestStreak']) into[k] = Math.max(into[k] || 0, guest[k] || 0);
    for (const [lang, st] of Object.entries(guest.langs || {})) {
      const t = (into.langs[lang] ||= blankLang());
      t.rounds += st.rounds || 0;
      t.correct += st.correct || 0;
    }
    if (guest.lastPlayDay && (!into.lastPlayDay || guest.lastPlayDay > into.lastPlayDay || (guest.lastPlayDay === into.lastPlayDay && guest.streak > into.streak))) {
      into.streak = guest.streak;
      into.lastPlayDay = guest.lastPlayDay;
    }
    for (const w of ['day', 'week']) for (const k of ['points', 'matches', 'wins']) into[w][k] += guest[w][k] || 0;
    for (const a of guest.achievements || []) if (!into.achievements.includes(a)) into.achievements.push(a);
    for (const [rid, r] of Object.entries(guest.rivals || {})) {
      if (rid === into.id) continue;
      const t = (into.rivals[rid] ||= { n: 0, w: 0, l: 0, name: r.name, country: r.country });
      t.n += r.n || 0; t.w += r.w || 0; t.l += r.l || 0;
      if ((r.at || 0) >= (t.at || 0)) { t.at = r.at; t.name = r.name; t.country = r.country; }
    }
    delete into.rivals[guest.id];
    into.createdAt = Math.min(into.createdAt || Date.now(), guest.createdAt || Date.now());

    guest.mergedInto = into.id;
    guest.mergedAt = Date.now();
    guest.tokenHash = null;
    this.store.touch();
  }

  /** Fill in fields added after an account was created. */
  migrate(acc) {
    const b = blank(acc.id, acc.tokenHash);
    for (const k of Object.keys(b)) if (acc[k] === undefined) acc[k] = b[k];
    for (const l of Object.keys(b.langs)) if (!acc.langs[l]) acc.langs[l] = blankLang();
  }

  rollWindows(acc, now = new Date()) {
    const d = dayKey(now);
    const w = weekKey(now);
    if (acc.day.key !== d) acc.day = { key: d, points: 0, matches: 0, wins: 0 };
    if (acc.week.key !== w) acc.week = { key: w, points: 0, matches: 0, wins: 0 };
    if (acc.lastPlayDay && daysBetween(acc.lastPlayDay, d) > 1 && acc.streak !== 0) acc.streak = 0;
  }

  setIdentity(acc, { name, country, avatar }) {
    if (name) acc.name = name;
    if (country) acc.country = country;
    if (avatar) acc.avatar = avatar;
    acc.lastSeen = Date.now();
    this.store.touch();
  }

  /**
   * Ranked points for a finished game, from server-computed round scores.
   * The in-game score is already server-authoritative (answers are graded
   * server-side), so ranked points are a scaled version plus placement.
   */
  pointsFor(r, streak) {
    let p = Math.round(r.score / 10);
    if (r.mode === 'match') p += r.rank === 1 ? 200 : r.rank === 2 ? 120 : r.rank === 3 ? 80 : 40;
    if (r.mode === 'match' && r.perfect) p += 150;
    const mult = 1 + Math.min(cfg.STREAK_BONUS_CAP, Math.max(0, streak) * cfg.STREAK_BONUS_STEP);
    return Math.max(10, Math.round(p * mult));
  }

  recordGame(acc, game, now = new Date()) {
    this.migrate(acc);
    this.rollWindows(acc, now);
    const d = dayKey(now);

    let streakEvent = null;
    if (acc.lastPlayDay !== d) {
      const gap = acc.lastPlayDay ? daysBetween(acc.lastPlayDay, d) : null;
      if (gap === 1) { acc.streak += 1; streakEvent = 'extended'; }
      else { streakEvent = acc.streak > 1 ? 'reset' : 'started'; acc.streak = 1; }
      acc.lastPlayDay = d;
      acc.bestStreak = Math.max(acc.bestStreak, acc.streak);
    }

    const r = { ...game, hour: now.getUTCHours(), perfect: game.rounds > 0 && game.correct === game.rounds };
    const points = r.ranked ? this.pointsFor(r, acc.streak) : 0;

    acc.rounds += r.rounds;
    acc.correct += r.correct;
    acc.bestCombo = Math.max(acc.bestCombo, r.bestCombo || 0);
    for (const [lang, st] of Object.entries(r.langs || {})) {
      if (!acc.langs[lang]) acc.langs[lang] = blankLang();
      acc.langs[lang].rounds += st.rounds;
      acc.langs[lang].correct += st.correct;
    }
    if (r.mode === 'rush') {
      acc.rushRuns += 1;
      acc.bestRush = Math.max(acc.bestRush, r.score);
    } else {
      acc.matches += 1;
      acc.day.matches += 1;
      acc.week.matches += 1;
      if (r.rank === 1) { acc.wins += 1; acc.day.wins += 1; acc.week.wins += 1; }
      if (r.rank <= 3) acc.podiums += 1;
      if (r.perfect) acc.perfects += 1;
      if (!r.ranked && r.humans > 1) {
        acc.friendlies += 1;
        if (r.rank === 1) acc.friendlyWins += 1;
      }
    }
    if (points) {
      acc.points += points;
      acc.day.points += points;
      acc.week.points += points;
    }
    acc.lastSeen = Date.now();

    const unlocked = [];
    for (const a of ACHIEVEMENTS) {
      if (acc.achievements.includes(a.id)) continue;
      let ok = false;
      try { ok = !!a.check(acc, r); } catch (_) { ok = false; }
      if (ok) { acc.achievements.push(a.id); unlocked.push(a.id); }
    }

    this.store.touch();
    return { points, streak: acc.streak, bestStreak: acc.bestStreak, streakEvent, unlocked, ranked: r.ranked, perfect: r.perfect };
  }

  recordHeadToHead(winner, loser) {
    if (!winner || !loser || winner.id === loser.id) return;
    const a = (winner.rivals[loser.id] ||= { n: 0, w: 0, l: 0, name: loser.name, country: loser.country });
    const b = (loser.rivals[winner.id] ||= { n: 0, w: 0, l: 0, name: winner.name, country: winner.country });
    a.n += 1; a.w += 1; a.name = loser.name; a.country = loser.country; a.at = Date.now();
    b.n += 1; b.l += 1; b.name = winner.name; b.country = winner.country; b.at = Date.now();
    for (const acc of [winner, loser]) {
      const ids = Object.keys(acc.rivals);
      if (ids.length > cfg.MAX_RIVALS) {
        ids.sort((x, y) => (acc.rivals[x].at || 0) - (acc.rivals[y].at || 0));
        delete acc.rivals[ids[0]];
      }
    }
    this.store.touch();
  }

  profile(acc) {
    this.migrate(acc);
    const rivals = Object.entries(acc.rivals)
      .map(([id, r]) => ({ id, ...r }))
      .sort((a, b) => b.n - a.n || (b.at || 0) - (a.at || 0))
      .slice(0, 8);
    return {
      id: acc.id,
      name: acc.name,
      country: acc.country,
      avatar: acc.avatar,
      signedIn: isCortexisId(acc.id),     // a Cortexis account, not a guest
      ranked: this.isRanked(acc),         // appears on the boards
      cortexisName: acc.cx ? acc.cx.name : null,
      points: acc.points,
      matches: acc.matches,
      wins: acc.wins,
      podiums: acc.podiums,
      rounds: acc.rounds,
      correct: acc.correct,
      accuracy: acc.rounds ? Math.round((acc.correct / acc.rounds) * 100) : 0,
      bestCombo: acc.bestCombo,
      bestRush: acc.bestRush,
      rushRuns: acc.rushRuns,
      perfects: acc.perfects,
      friendlies: acc.friendlies,
      friendlyWins: acc.friendlyWins,
      langs: acc.langs,
      streak: acc.streak,
      bestStreak: acc.bestStreak,
      lastPlayDay: acc.lastPlayDay,
      playedToday: acc.lastPlayDay === dayKey(),
      today: { points: acc.day.points, matches: acc.day.matches, wins: acc.day.wins },
      week: { points: acc.week.points, matches: acc.week.matches, wins: acc.week.wins },
      achievements: acc.achievements,
      rivals,
    };
  }
}

module.exports = { Accounts, dayKey, weekKey, daysBetween, isCortexisId };
