/**
 * The client's copy of the puzzle bank: every snippet's code, title, tags,
 * difficulty and line count — but no answers or explanations. Fetched once
 * (the server serves it gzipped with a long cache + ETag) and mirrored in
 * localStorage, so a match round only needs a puzzle id over the wire and a
 * Solo Rush needs no server at all until the run is submitted.
 */
const KEY = 'gr_bank_v1';

export class Bank {
  constructor() {
    this.puzzles = [];
    this.byId = new Map();
    this.version = null;
    this.ready = null;
  }

  /** Load from localStorage if the version matches, else from the network. */
  load(version) {
    if (this.ready && this.version === version) return this.ready;
    this.ready = (async () => {
      try {
        const cached = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (cached && cached.generatedAt === version && cached.puzzles) { this.set(cached); return this; }
      } catch (_) { /* ignore */ }
      const r = await fetch('/api/bank');
      if (!r.ok) throw new Error(`bank ${r.status}`);
      const data = await r.json();
      this.set(data);
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) { /* quota */ }
      return this;
    })();
    return this.ready;
  }

  set(data) {
    this.puzzles = data.puzzles || [];
    this.byId = new Map(this.puzzles.map((p) => [p.id, p]));
    this.version = data.generatedAt;
    this.runtimes = data.runtimes || {};
  }

  get size() { return this.puzzles.length; }
  get(id) { return this.byId.get(id) || null; }

  /** Same selection logic the server uses for matches. */
  pick({ lang = 'mix', minDiff = 1, maxDiff = 5, seen = new Set(), prefer = null } = {}) {
    let pool = this.puzzles.filter((p) => (lang === 'mix' || p.lang === lang) && p.difficulty >= minDiff && p.difficulty <= maxDiff);
    if (!pool.length) pool = this.puzzles.filter((p) => lang === 'mix' || p.lang === lang);
    if (!pool.length) pool = this.puzzles;
    let fresh = pool.filter((p) => !seen.has(p.id));
    if (!fresh.length) fresh = pool;
    if (prefer) { const pref = fresh.filter((p) => p.difficulty === prefer); if (pref.length) fresh = pref; }
    return fresh[Math.floor(Math.random() * fresh.length)];
  }
}
