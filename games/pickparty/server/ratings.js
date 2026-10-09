'use strict';
// Crowd taste, learned from play. Every option on every topic carries an
// Elo-style rating. Human votes (Crowd pleaser) and human Minds' secret
// picks (Mind reader) are treated as pairwise preferences. Bots read these
// ratings but never write them, so the model can't feed on itself.

const SEED_TOP = 1500, SEED_STEP = 20;

class Ratings {
  constructor(store, topics) {
    this.store = store;
    const d = store.data;
    d.ratings = d.ratings || {};
    this.r = d.ratings;
    this.dirty = false;
    for (const t of topics) {
      const cur = this.r[t.id];
      if (!Array.isArray(cur) || cur.length !== t.o.length) {
        // topics.json lists options best → worst, which seeds the order
        this.r[t.id] = t.o.map((_, i) => SEED_TOP - i * SEED_STEP);
      }
    }
  }

  get(id) { return this.r[id]; }

  rank(id) {
    const r = this.r[id];
    return r.map((v, i) => i).sort((a, b) => r[b] - r[a] || a - b);
  }

  duel(id, w, l, k) {
    const r = this.r[id];
    const exp = 1 / (1 + Math.pow(10, (r[l] - r[w]) / 400));
    const delta = k * (1 - exp);
    r[w] = Math.round((r[w] + delta) * 10) / 10;
    r[l] = Math.round((r[l] - delta) * 10) / 10;
  }

  // opts: option per pick, counts: human votes per pick. In the dud round
  // a vote means "this is the worst", so more votes ranks it lower.
  crowdRound(id, opts, counts, dud) {
    if (!this.r[id] || counts.reduce((a, b) => a + b, 0) === 0) return;
    for (let i = 0; i < opts.length; i++) {
      for (let j = 0; j < opts.length; j++) {
        if (counts[i] > counts[j]) {
          const k = 10 * Math.min(2, counts[i] - counts[j]);
          if (dud) this.duel(id, opts[j], opts[i], k);
          else this.duel(id, opts[i], opts[j], k);
        }
      }
    }
    this.dirty = true;
    this.store.save();
  }

  mindSecret(id, loves, dud) {
    const r = this.r[id];
    if (!r) return;
    const chosen = new Set([...loves, dud]);
    for (let o = 0; o < r.length; o++) {
      if (chosen.has(o)) continue;
      for (const l of loves) this.duel(id, l, o, 3);
      this.duel(id, o, dud, 3);
    }
    this.duel(id, loves[0], loves[1], 4);
    this.duel(id, loves[1], loves[2], 4);
    this.dirty = true;
    this.store.save();
  }
}

module.exports = Ratings;
