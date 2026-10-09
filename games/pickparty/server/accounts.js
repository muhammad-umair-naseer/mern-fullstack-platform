'use strict';
// Persistent player accounts: anonymous token login, identity, streaks,
// lifetime stats and achievements. Humans only; bots never touch this.
const crypto = require('crypto');
const { CATALOGUE, AVATARS, AVATAR_UNLOCKS } = require('./achievements');

const DAY = 86400000;
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

function cleanName(raw) {
  const s = String(raw || '')
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16);
  return s;
}
const cleanCountry = (c) => (/^[A-Z]{2}$/.test(String(c || '').toUpperCase()) ? String(c).toUpperCase() : '');
const clampTz = (tz) => (Number.isFinite(+tz) ? Math.max(-840, Math.min(840, Math.round(+tz))) : 0);
const dayKey = (now, tz) => Math.floor((now - clampTz(tz) * 60000) / DAY);

function weekKey(now) {
  // ISO week, UTC
  const d = new Date(now);
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const wk = 1 + Math.round(((d - firstThu) / DAY - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${wk}`;
}

class Accounts {
  constructor(store) {
    this.store = store;
    const d = store.data;
    d.accounts = d.accounts || {};
    d.tokens = d.tokens || {};
    this.accounts = d.accounts;
    this.tokens = d.tokens;
  }

  login(token) {
    if (typeof token === 'string' && token.length >= 20) {
      const id = this.tokens[sha(token)];
      if (id && this.accounts[id]) return { account: this.accounts[id], token, fresh: false };
    }
    const fresh = crypto.randomBytes(24).toString('base64url');
    const id = crypto.randomBytes(6).toString('hex');
    const acc = {
      id, name: 'Player' + Math.floor(1000 + Math.random() * 9000), country: '', avatar: AVATARS[0],
      created: Date.now(),
      points: 0, week: { k: weekKey(Date.now()), p: 0 },
      matches: 0, wins: 0, votes: 0, loves: 0, topics: 0,
      soloBest: 0, soloRuns: 0,
      streak: { cur: 0, best: 0, day: null },
      ach: [],
    };
    this.accounts[id] = acc;
    this.tokens[sha(fresh)] = id;
    this.store.save();
    return { account: acc, token: fresh, fresh: true };
  }

  byToken(token) {
    if (typeof token !== 'string' || token.length < 20) return null;
    const id = this.tokens[sha(token)];
    return (id && this.accounts[id]) || null;
  }

  // Own keys only: ids come from URLs, and '__proto__' must not find Object.prototype.
  get(id) { return Object.hasOwn(this.accounts, id) ? this.accounts[id] : null; }
  all() { return Object.values(this.accounts); }

  setIdentity(acc, { name, country, avatar }) {
    const n = cleanName(name);
    if (n.length >= 2) acc.name = n;
    if (country !== undefined) acc.country = cleanCountry(country);
    if (avatar !== undefined && AVATARS.includes(avatar)) {
      const need = AVATAR_UNLOCKS[avatar];
      if (!need || acc.ach.includes(need)) acc.avatar = avatar;
    }
    this.store.save();
  }

  unlock(acc, id, out) {
    if (!acc.ach.includes(id)) { acc.ach.push(id); out.push(id); }
  }

  // A visit on a new local day extends (or restarts) the daily streak.
  visit(acc, tz, now = Date.now()) {
    const today = dayKey(now, tz);
    const s = acc.streak;
    const unlocked = [];
    let extended = false;
    if (s.day !== today) {
      s.cur = s.day === today - 1 ? s.cur + 1 : 1;
      s.day = today;
      s.best = Math.max(s.best, s.cur);
      extended = true;
      if (s.cur >= 3) this.unlock(acc, 'streak3', unlocked);
      if (s.cur >= 7) this.unlock(acc, 'streak7', unlocked);
      this.store.save();
    }
    return { streak: s.cur, extended, unlocked };
  }

  addPoints(acc, p, now = Date.now()) {
    acc.points += p;
    const k = weekKey(now);
    if (acc.week.k !== k) acc.week = { k, p: 0 };
    acc.week.p += p;
  }

  // stats: {votes, loves, crowdFav, perfectRead, openBook, busted, bargain, bigSpender, topicWins, topics}
  settleMatch(acc, { ranked, place, score, humans, stats }) {
    const unlocked = [];
    let points = 0;
    if (ranked) {
      points = require('../shared/scoring').rankedPoints({ place, score, humans });
      this.addPoints(acc, points);
      acc.matches += 1;
      if (place === 0) acc.wins += 1;
      acc.votes += stats.votes || 0;
      acc.loves += stats.loves || 0;
      acc.topics += stats.topicWins || 0;
    }
    this.unlock(acc, 'first_match', unlocked);
    if (place === 0) this.unlock(acc, 'first_win', unlocked);
    if (stats.crowdFav) this.unlock(acc, 'crowd_fav', unlocked);
    if (stats.perfectRead) this.unlock(acc, 'mind_reader', unlocked);
    if (stats.openBook) this.unlock(acc, 'open_book', unlocked);
    if (stats.busted) this.unlock(acc, 'busted', unlocked);
    if (stats.bargain) this.unlock(acc, 'bargain', unlocked);
    if (stats.bigSpender) this.unlock(acc, 'big_spender', unlocked);
    if (stats.topics > 1 && stats.topicWins === stats.topics) this.unlock(acc, 'clean_sweep', unlocked);
    if (acc.matches >= 10) this.unlock(acc, 'regular', unlocked);
    if (acc.matches >= 50) this.unlock(acc, 'veteran', unlocked);
    this.store.save();
    return { points, unlocked };
  }

  settleSolo(acc, { total, perfect }) {
    const unlocked = [];
    const points = require('../shared/scoring').soloRankedPoints(total);
    const best = total > acc.soloBest;
    this.addPoints(acc, points);
    acc.soloRuns += 1;
    if (best) acc.soloBest = total;
    if (perfect > 0) this.unlock(acc, 'perfect_read', unlocked);
    if (total >= 1000) this.unlock(acc, 'solo_1k', unlocked);
    if (total >= 5000) this.unlock(acc, 'solo_5k', unlocked);
    this.store.save();
    return { points, best, unlocked };
  }

  bindCortexis({ sub, name }, { guest = null, country = null, nickname = null } = {}) {
    const id = `cx_${sub}`;
    let acc = this.accounts[id];
    const created = !acc;
    if (created) {
      acc = {
        id,
        name: nickname || 'Player',
        country: (guest && guest.country) || country || '',
        avatar: (guest && guest.avatar) || AVATARS[0],
        created: Date.now(),
        points: 0,
        week: { k: weekKey(Date.now()), p: 0 },
        matches: 0, wins: 0, votes: 0, loves: 0, topics: 0,
        soloBest: 0, soloRuns: 0,
        streak: { cur: 0, best: 0, day: null },
        ach: [],
      };
      this.accounts[id] = acc;
    }
    const now = Date.now();
    acc.cx = { sub: String(sub), name: String(name || '').slice(0, 80), lastAuthAt: now };

    let merged = false;
    if (guest && guest !== acc && !guest.id.startsWith('cx_') && !guest.mergedInto) {
      this.merge(guest, acc);
      merged = true;
    }

    const fresh = crypto.randomBytes(24).toString('base64url');
    this.tokens[sha(fresh)] = id;
    this.store.save();
    return { account: acc, token: fresh, created, merged };
  }

  merge(guest, into) {
    into.points += guest.points || 0;
    const wk = weekKey(Date.now());
    if (into.week.k === wk && guest.week && guest.week.k === wk) into.week.p += guest.week.p || 0;
    into.matches += guest.matches || 0;
    into.wins += guest.wins || 0;
    into.votes += guest.votes || 0;
    into.loves += guest.loves || 0;
    into.topics += guest.topics || 0;
    into.soloRuns += guest.soloRuns || 0;
    into.soloBest = Math.max(into.soloBest || 0, guest.soloBest || 0);
    into.streak.cur = Math.max(into.streak.cur || 0, (guest.streak && guest.streak.cur) || 0);
    into.streak.best = Math.max(into.streak.best || 0, (guest.streak && guest.streak.best) || 0);
    for (const a of (guest.ach || [])) {
      if (!into.ach.includes(a)) into.ach.push(a);
    }
    guest.mergedInto = into.id;
  }

  public(acc) {
    const wk = weekKey(Date.now());
    return {
      id: acc.id, name: acc.name, country: acc.country, avatar: acc.avatar,
      points: acc.points, weekPoints: acc.week.k === wk ? acc.week.p : 0,
      matches: acc.matches, wins: acc.wins, votes: acc.votes, loves: acc.loves,
      soloBest: acc.soloBest, soloRuns: acc.soloRuns,
      streak: { cur: acc.streak.cur, best: acc.streak.best },
      ach: acc.ach.slice(),
      isCortexis: acc.id.startsWith('cx_'),
      cortexisName: (acc.cx && acc.cx.name) || null,
    };
  }
}

module.exports = { Accounts, cleanName, cleanCountry, weekKey, dayKey, CATALOGUE, AVATARS, AVATAR_UNLOCKS };

