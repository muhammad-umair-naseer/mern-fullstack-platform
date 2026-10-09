'use strict';
// Ranking boards computed from accounts on demand (cached briefly).
const { weekKey } = require('./accounts');

const META = [
  { id: 'points', label: 'Ranked points', windows: ['all', 'week'] },
  { id: 'wins', label: 'Match wins', windows: ['all'] },
  { id: 'crowd', label: 'Votes won', windows: ['all'] },
  { id: 'mind', label: 'Loves read', windows: ['all'] },
  { id: 'solo', label: 'Best crowd read', windows: ['all'] },
  { id: 'streak', label: 'Best streak', windows: ['all'] },
];

function value(acc, cat, win, wk) {
  switch (cat) {
    case 'points': return win === 'week' ? (acc.week.k === wk ? acc.week.p : 0) : acc.points;
    case 'wins': return acc.wins;
    case 'crowd': return acc.votes;
    case 'mind': return acc.loves;
    case 'solo': return acc.soloBest;
    case 'streak': return acc.streak.best;
    default: return 0;
  }
}

class Boards {
  constructor(accounts) { this.accounts = accounts; this.cache = new Map(); }

  board(cat, win, scope, youId) {
    const meta = META.find((m) => m.id === cat) || META[0];
    const w = meta.windows.includes(win) ? win : 'all';
    const sc = scope === 'GLOBAL' || !/^[A-Z]{2}$/.test(scope || '') ? 'GLOBAL' : scope;
    const key = `${meta.id}|${w}|${sc}`;
    let hit = this.cache.get(key);
    if (!hit || Date.now() - hit.at > 5000) {
      const wk = weekKey(Date.now());
      const rows = this.accounts.all()
        .filter((a) => sc === 'GLOBAL' || a.country === sc)
        .map((a) => ({ id: a.id, name: a.name, avatar: a.avatar, country: a.country, v: value(a, meta.id, w, wk) }))
        .filter((r) => r.v > 0)
        .sort((a, b) => b.v - a.v || a.name.localeCompare(b.name));
      hit = { at: Date.now(), rows };
      this.cache.set(key, hit);
    }
    const idx = youId ? hit.rows.findIndex((r) => r.id === youId) : -1;
    return {
      type: 'board', category: meta.id, window: w, scope: sc,
      entries: hit.rows.slice(0, 50).map((r, i) => ({ rank: i + 1, ...r, you: r.id === youId })),
      you: idx >= 0 ? { rank: idx + 1, v: hit.rows[idx].v } : null,
      total: hit.rows.length,
    };
  }
}
Boards.META = META;
module.exports = { Boards, META };
