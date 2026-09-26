/**
 * The player's persistent identity and progression. The server owns the
 * numbers (points, streak, stats, achievements, rivals); the browser keeps the
 * id/token pair, a cached profile for instant first paint, and the level curve.
 */
import { AVATARS, avatarFor } from './avatars.js';

const KEY = 'gr_account_v1';
const CACHE = 'gr_profile_cache_v1';

export const TITLES = [
  [1, 'Script Kiddie'], [3, 'Junior'], [5, 'Debugger'], [8, 'Type Coercer'], [11, 'Edge Case'],
  [14, 'Senior'], [18, 'Compiler Whisperer'], [22, 'Language Lawyer'], [27, 'Spec Author'], [35, 'Undefined Behaviour'],
];

export function pointsForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(400 * Math.pow(level - 1, 1.6));
}

export function levelForPoints(points) {
  let lvl = 1;
  while (pointsForLevel(lvl + 1) <= points) lvl++;
  return lvl;
}

export function titleFor(level) {
  let t = TITLES[0][1];
  for (const [min, name] of TITLES) if (level >= min) t = name;
  return t;
}

const EMPTY = {
  points: 0, matches: 0, wins: 0, podiums: 0, rounds: 0, correct: 0, accuracy: 0, bestCombo: 0, bestRush: 0, rushRuns: 0,
  perfects: 0, friendlies: 0, friendlyWins: 0, langs: { js: { rounds: 0, correct: 0 }, py: { rounds: 0, correct: 0 } },
  streak: 0, bestStreak: 0, playedToday: false, today: { points: 0, matches: 0, wins: 0 }, week: { points: 0, matches: 0, wins: 0 },
  achievements: [], rivals: [],
};

export class Account {
  constructor() {
    this.id = null;
    this.token = null;
    this.profile = { ...EMPTY };
    this.standings = [];
    this.catalogue = [];
    this.boardMeta = null;
    this.avatar = localStorage.getItem('gr_avatar') || 'bolt';
    this.synced = false;
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && saved.id && saved.token) { this.id = saved.id; this.token = saved.token; }
      const cached = JSON.parse(localStorage.getItem(CACHE) || 'null');
      if (cached) this.profile = { ...EMPTY, ...cached };
    } catch (_) { /* private mode */ }
    if (avatarFor(this.avatar).unlock > this.level) this.avatar = 'bolt';
  }

  get credentials() { return this.id && this.token ? { accountId: this.id, token: this.token } : {}; }

  /** Signed in or out through cx-auth.js, which owns the stored credentials. */
  useCredentials({ accountId = null, token = null } = {}) {
    this.id = accountId;
    this.token = token;
    if (!accountId) { this.profile = { ...EMPTY }; this.standings = []; this.synced = false; }
  }

  onAccount(msg) {
    if (msg.id) this.id = msg.id;
    if (msg.token) this.token = msg.token;
    if (this.id && this.token) { try { localStorage.setItem(KEY, JSON.stringify({ id: this.id, token: this.token })); } catch (_) { /* ignore */ } }
    this.setProfile(msg.profile, msg.standings);
    this.synced = true;
  }

  setProfile(profile, standings) {
    if (profile) {
      this.profile = { ...EMPTY, ...profile };
      if (profile.avatar) this.avatar = profile.avatar;
      try { localStorage.setItem(CACHE, JSON.stringify(this.profile)); } catch (_) { /* ignore */ }
    }
    if (standings) this.standings = standings;
  }

  get points() { return this.profile.points || 0; }
  get level() { return levelForPoints(this.points); }
  get title() { return titleFor(this.level); }
  get stats() { return this.profile; }
  get streak() { return this.profile.streak || 0; }
  get bestStreak() { return this.profile.bestStreak || 0; }
  get playedToday() { return !!this.profile.playedToday; }
  get achievements() { return this.profile.achievements || []; }
  get rivals() { return this.profile.rivals || []; }
  get levelProgress() {
    const lvl = this.level;
    const lo = pointsForLevel(lvl);
    const hi = pointsForLevel(lvl + 1);
    return [this.points - lo, hi - lo, Math.min(1, (this.points - lo) / (hi - lo))];
  }

  has(id) { return this.achievements.includes(id); }
  achievement(id) { return this.catalogue.find((a) => a.id === id) || { id, icon: '🏅', name: id, desc: '' }; }
  unlockedAvatars() { return AVATARS.filter((a) => a.unlock <= this.level); }

  setAvatar(id) {
    const a = avatarFor(id);
    if (!a || a.unlock > this.level) return false;
    this.avatar = a.id;
    try { localStorage.setItem('gr_avatar', a.id); } catch (_) { /* ignore */ }
    return true;
  }

  applyResult(msg) {
    const before = this.level;
    this.setProfile(msg.profile, msg.standings);
    const after = this.level;
    return {
      mode: msg.mode,
      points: msg.points || 0,
      ranked: !!msg.ranked,
      perfect: !!msg.perfect,
      streak: msg.streak || 0,
      streakEvent: msg.streakEvent,
      unlocked: (msg.unlocked || []).map((id) => this.achievement(id)),
      levelBefore: before,
      levelAfter: after,
      leveledUp: after > before,
      newAvatars: after > before ? AVATARS.filter((a) => a.unlock > before && a.unlock <= after) : [],
      series: msg.series || [],
    };
  }
}
