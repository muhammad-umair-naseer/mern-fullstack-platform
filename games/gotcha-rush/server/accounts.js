'use strict';
const crypto = require('crypto');
const cfg = require('./config');
const { randomId } = require('./util');
const { ACHIEVEMENTS } = require('./achievements');

const hash = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

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

  login(id, token) {
    const acc = id && this.accounts[id];
    if (acc && token && acc.tokenHash === hash(token)) {
      this.migrate(acc);
      acc.lastSeen = Date.now();
      this.rollWindows(acc);
      this.store.touch();
      return { account: acc, token: null, created: false };
    }
    const newId = `p_${randomId(14)}`;
    const newToken = crypto.randomBytes(24).toString('base64url');
    const fresh = blank(newId, hash(newToken));
    this.accounts[newId] = fresh;
    this.store.touch();
    return { account: fresh, token: newToken, created: true };
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

module.exports = { Accounts, dayKey, weekKey, daysBetween };
