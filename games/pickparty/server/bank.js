'use strict';
// The content bank shipped to browsers: topics, options and the current
// crowd ranking. Served gzipped with an ETag; browsers cache it in
// localStorage so a match only ever sends topic ids and option indices.
const crypto = require('crypto');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// Optional item pictures from scripts/fetch-art.js: {topicId: {optIndex: {src, page, by, lic}}}
function loadArt() {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'shared', 'art.json'), 'utf8')); } catch { return {}; }
}

class Bank {
  constructor(topics, ratings) {
    this.topics = topics;
    this.byId = new Map(topics.map((t) => [t.id, t]));
    this.ratings = ratings;
    this.art = loadArt();
    this.snapshots = new Map(); // version → Map(topicId → rank)
    this.build();
  }

  build() {
    const ranks = this.topics.map((t) => this.ratings.rank(t.id));
    const v = crypto.createHash('sha1').update(JSON.stringify(ranks) + JSON.stringify(this.art)).digest('hex').slice(0, 10);
    const payload = {
      v,
      topics: this.topics.map((t, i) => ({
        id: t.id, t: t.t, e: t.e, c: t.c, o: t.o, r: ranks[i],
        // one picture slot per option: {s: thumbnail url, p: page title, by, lic} or null
        a: t.o.map((_, k) => { const e = this.art[t.id] && this.art[t.id][k]; return e ? { s: e.src, p: e.page, by: e.by, lic: e.lic } : null; }),
      })),
    };
    this.version = v;
    this.json = Buffer.from(JSON.stringify(payload));
    this.gz = zlib.gzipSync(this.json, { level: 9 });
    this.etag = `"b-${v}"`;
    this.snapshots.set(v, new Map(this.topics.map((t, i) => [t.id, ranks[i]])));
    while (this.snapshots.size > 8) this.snapshots.delete(this.snapshots.keys().next().value);
  }

  // Rebuild only when ratings moved; returns true when a new version went out.
  maybePublish() {
    if (!this.ratings.dirty) return false;
    this.ratings.dirty = false;
    const before = this.version;
    this.build();
    return this.version !== before;
  }

  rankOf(version) {
    const snap = this.snapshots.get(version);
    return snap ? (id) => snap.get(id) || null : null;
  }

  has(id) { return this.byId.has(id); }
  // Culture pools: desi plays desi + neutral packs, global plays global + neutral, mix plays everything.
  inCulture(id, culture) { const t = this.byId.get(id); return !!t && (culture === 'mix' || !culture || (culture === 'desi' ? 'dn' : 'gn').includes(t.c)); }
  pool(culture) { return this.topics.filter((t) => this.inCulture(t.id, culture)).map((t) => t.id); }
  size(id) { const t = this.byId.get(id); return t ? t.o.length : 0; }
}

module.exports = Bank;
