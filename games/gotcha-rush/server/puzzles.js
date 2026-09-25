'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { normalizeOutput, linesMatch } = require('../shared/scoring');

/**
 * Puzzle bank.
 *
 * Authoring: one snippet per file under puzzles/<lang>/, with metadata in
 * leading comment lines:
 *
 *   // @title      Plus and minus
 *   // @difficulty 2              (1 easy … 5 evil)
 *   // @tags       coercion, operators
 *   // @distractor 2\n0           (a plausible wrong output; "\n" separates lines)
 *   // @distractor 11\n0
 *   // @explain    Why the output is what it is. May repeat over several lines.
 *   console.log("1" + 1);
 *
 * The expected output is never hand-typed: `npm run verify` executes every
 * snippet through server/runner.js and freezes the result in bank.json,
 * together with a hash of the source so a stale bank is detected at boot.
 */
const ROOT = path.resolve(__dirname, '..', 'puzzles');
const LANG_META = {
  js: { name: 'JavaScript', comment: '//', ext: '.js', runtime: 'Node.js' },
  py: { name: 'Python', comment: '#', ext: '.py', runtime: 'CPython 3' },
};

function parseFile(lang, file) {
  const meta = LANG_META[lang];
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const lines = src.split('\n');
  const data = { title: path.basename(file, meta.ext), difficulty: 2, tags: [], distractors: [], explain: '' };
  let i = 0;
  for (; i < lines.length; i++) {
    const m = lines[i].match(new RegExp(`^${meta.comment}\\s*@(\\w+)\\s*(.*)$`));
    if (!m) break;
    const [, key, raw] = m;
    const val = raw.trim();
    if (key === 'title') data.title = val;
    else if (key === 'difficulty') data.difficulty = Math.max(1, Math.min(5, Number(val) || 2));
    else if (key === 'tags') data.tags = val.split(',').map((t) => t.trim()).filter(Boolean);
    else if (key === 'distractor') data.distractors.push(val.replace(/\\n/g, '\n'));
    else if (key === 'explain') data.explain += (data.explain ? ' ' : '') + val;
  }
  const code = lines.slice(i).join('\n').replace(/^\n+/, '').replace(/\s+$/, '') + '\n';
  const id = `${lang}-${path.basename(file, meta.ext)}`;
  return { id, lang, file: path.relative(ROOT, file), code, hash: sha(code), ...data };
}

function sha(s) {
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
}

/** Every puzzle source on disk (no outputs yet). */
function loadSources() {
  const out = [];
  for (const lang of Object.keys(LANG_META)) {
    const dir = path.join(ROOT, lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      if (f.endsWith(LANG_META[lang].ext)) out.push(parseFile(lang, path.join(dir, f)));
    }
  }
  return out;
}

class Bank {
  constructor(file) {
    this.file = file;
    this.puzzles = [];
    this.byId = new Map();
    this.load();
  }

  load() {
    const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    this.puzzles = raw.puzzles.filter((p) => p.verified);
    this.byId = new Map(this.puzzles.map((p) => [p.id, p]));
    this.generatedAt = raw.generatedAt;
    this.runtimes = raw.runtimes || {};
  }

  /** Warn (don't crash) if the sources on disk drifted from the frozen bank. */
  checkStale() {
    let stale = 0;
    try {
      for (const src of loadSources()) {
        const frozen = this.byId.get(src.id);
        if (!frozen || frozen.hash !== src.hash) stale++;
      }
    } catch (_) { return 0; }
    return stale;
  }

  get size() { return this.puzzles.length; }

  /** Public view (no output / explanation until the reveal). */
  static publicView(p) {
    return { id: p.id, lang: p.lang, langName: LANG_META[p.lang].name, runtime: LANG_META[p.lang].runtime, title: p.title, difficulty: p.difficulty, tags: p.tags, code: p.code, lines: p.output.length };
  }

  /** The whole bank as the client caches it: everything except answers and explanations. */
  publicBank() {
    return { generatedAt: this.generatedAt, runtimes: this.runtimes, puzzles: this.puzzles.map(Bank.publicView) };
  }

  /** What a reveal shows once an answer is locked in. */
  reveal(p) {
    return { id: p.id, output: p.output, explain: p.explain, tags: p.tags };
  }

  /** Pick a puzzle matching filters, avoiding ids in `seen` when possible. */
  pick({ lang = 'mix', minDiff = 1, maxDiff = 5, seen = new Set(), prefer = null } = {}) {
    let pool = this.puzzles.filter((p) => (lang === 'mix' || p.lang === lang) && p.difficulty >= minDiff && p.difficulty <= maxDiff);
    if (!pool.length) pool = this.puzzles.filter((p) => lang === 'mix' || p.lang === lang);
    if (!pool.length) pool = this.puzzles;
    let fresh = pool.filter((p) => !seen.has(p.id));
    if (!fresh.length) fresh = pool;
    if (prefer) {
      const preferred = fresh.filter((p) => p.difficulty === prefer);
      if (preferred.length) fresh = preferred;
    }
    return fresh[Math.floor(Math.random() * fresh.length)];
  }

  /** Multiple-choice options for the lifeline: the answer plus up to 3 distractors, shuffled. */
  choices(p) {
    const opts = [p.output.join('\n')];
    for (const d of p.distractors) {
      const dn = normalizeOutput(d).join('\n');
      if (!opts.includes(dn)) opts.push(dn);
      if (opts.length >= 4) break;
    }
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }
}

module.exports = { Bank, loadSources, normalizeOutput, linesMatch, LANG_META, ROOT };
