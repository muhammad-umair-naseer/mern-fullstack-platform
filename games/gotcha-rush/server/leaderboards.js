'use strict';
const cfg = require('./config');
const { dayKey, weekKey } = require('./accounts');

/**
 * Ranking boards: (category, window, scope) triples computed on demand from
 * the account table, cached briefly, always returning the caller's own row.
 *
 *   category  points | rush | accuracy | solved | combo | wins | streak
 *   window    all | today | week   (points and wins only)
 *   scope     global | <2-letter country>
 */
const CATEGORIES = {
  points: { label: 'Points', windows: ['all', 'today', 'week'], value: (a, w) => (w === 'all' ? a.points : w === 'today' ? a.day.points : a.week.points), format: 'points' },
  rush: { label: 'Rush', windows: ['all'], value: (a) => a.bestRush, format: 'score' },
  accuracy: { label: 'Accuracy', windows: ['all'], value: (a) => (a.rounds >= 20 ? Math.round((a.correct / a.rounds) * 1000) / 10 : 0), tiebreak: (a) => a.correct, format: 'percent', note: 'min 20 rounds' },
  solved: { label: 'Solved', windows: ['all'], value: (a) => a.correct, format: 'count' },
  combo: { label: 'Combo', windows: ['all'], value: (a) => a.bestCombo, format: 'combo' },
  wins: { label: 'Wins', windows: ['all', 'today', 'week'], value: (a, w) => (w === 'all' ? a.wins : w === 'today' ? a.day.wins : a.week.wins), format: 'wins' },
  streak: { label: 'Streak', windows: ['all'], value: (a) => a.streak, tiebreak: (a) => a.bestStreak, format: 'streak' },
};

const WINDOWS = { all: 'All time', today: 'Today', week: 'This week' };

class Leaderboards {
  constructor(accounts) {
    this.accounts = accounts;
    this.cache = new Map();
  }

  static get meta() {
    return {
      categories: Object.entries(CATEGORIES).map(([id, c]) => ({ id, label: c.label, windows: c.windows, format: c.format, note: c.note || null })),
      windows: WINDOWS,
    };
  }

  key(category, window, scope) { return `${category}|${window}|${scope}`; }

  rows(category, window, scope) {
    const cat = CATEGORIES[category];
    if (!cat) return [];
    const win = cat.windows.includes(window) ? window : 'all';
    const k = this.key(category, win, scope);
    const hit = this.cache.get(k);
    const now = Date.now();
    if (hit && now - hit.at < cfg.BOARD_CACHE_MS) return hit.rows;

    const d = dayKey();
    const w = weekKey();
    const live = (a) => (win === 'today' ? a.day.key === d : win === 'week' ? a.week.key === w : true);

    const rows = [];
    for (const a of this.accounts.all) {
      if (!this.accounts.isRanked(a)) continue;   // guests play, but only signed-in players are ranked
      if (scope !== 'global' && a.country !== scope) continue;
      if (!live(a)) continue;
      const v = cat.value(a, win);
      if (!v) continue;
      rows.push({ id: a.id, name: a.name, country: a.country, avatar: a.avatar, value: v, tie: cat.tiebreak ? cat.tiebreak(a) : a.points, streak: a.streak });
    }
    rows.sort((x, y) => y.value - x.value || y.tie - x.tie || x.name.localeCompare(y.name));
    rows.forEach((r, i) => { r.rank = i + 1; });
    this.cache.set(k, { at: now, rows });
    return rows;
  }

  board(category, window, scope, meId) {
    const cat = CATEGORIES[category] ? category : 'points';
    const win = CATEGORIES[cat].windows.includes(window) ? window : 'all';
    const sc = scope && /^[A-Z]{2}$/.test(scope) ? scope : 'global';
    const rows = this.rows(cat, win, sc);
    const top = rows.slice(0, cfg.BOARD_SIZE);
    const mine = meId ? rows.find((r) => r.id === meId) || null : null;
    return { type: 'board', category: cat, window: win, scope: sc, total: rows.length, entries: top, me: mine, inTop: !!(mine && mine.rank <= cfg.BOARD_SIZE) };
  }

  standings(acc) {
    if (!acc) return [];
    const out = [];
    const push = (category, window, scope) => {
      const rows = this.rows(category, window, scope);
      const row = rows.find((r) => r.id === acc.id);
      out.push({ category, window, scope, rank: row ? row.rank : null, of: rows.length, value: row ? row.value : 0 });
    };
    push('points', 'all', 'global');
    push('points', 'all', acc.country);
    push('points', 'today', 'global');
    push('rush', 'all', 'global');
    push('accuracy', 'all', 'global');
    push('streak', 'all', 'global');
    return out;
  }

  invalidate() { this.cache.clear(); }
}

module.exports = { Leaderboards, CATEGORIES, WINDOWS };
