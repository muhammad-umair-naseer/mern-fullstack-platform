#!/usr/bin/env node
'use strict';
/**
 * Runs every puzzle through the configured runner and freezes the verified
 * outputs into puzzles/bank.json. Exits non-zero if any snippet fails to run,
 * produces empty output, or (with --check) if the bank on disk is stale.
 *
 *   npm run verify              rebuild bank.json with RUNNER=local
 *   RUNNER=docker npm run verify
 *   npm run verify -- --check   only confirm bank.json matches the sources
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { run } = require('./runner');
const { loadSources, normalizeOutput, LANG_META, ROOT } = require('./puzzles');

const bankFile = path.resolve(__dirname, '..', cfg.BANK_FILE);
const check = process.argv.includes('--check');

(async () => {
  const sources = loadSources();
  if (check) {
    const bank = JSON.parse(fs.readFileSync(bankFile, 'utf8'));
    const frozen = new Map(bank.puzzles.map((p) => [p.id, p]));
    const stale = sources.filter((s) => !frozen.has(s.id) || frozen.get(s.id).hash !== s.hash);
    if (stale.length) {
      console.error(`bank.json is stale for ${stale.length} puzzle(s): ${stale.map((s) => s.id).join(', ')}`);
      process.exit(1);
    }
    console.log(`bank.json is current (${bank.puzzles.length} puzzles).`);
    return;
  }

  const results = [];
  let failed = 0;
  const runtimes = {};
  for (const lang of Object.keys(LANG_META)) {
    const probe = await run(lang, lang === 'js' ? 'console.log(process.version)' : 'import sys; print(sys.version.split()[0])', {});
    runtimes[lang] = probe.ok ? probe.stdout.trim() : 'unavailable';
  }
  console.log(`runner=${cfg.RUNNER}  node=${runtimes.js}  python=${runtimes.py}\n`);

  for (const src of sources) {
    const r = await run(src.lang, src.code, {});
    const output = normalizeOutput(r.stdout);
    const problems = [];
    if (!r.ok) problems.push(r.timedOut ? 'timed out' : `exit ${r.code}: ${r.stderr.trim().split('\n').pop()}`);
    if (!output.length) problems.push('no output');
    if (output.length > cfg.MAX_ANSWER_LINES) problems.push(`too many output lines (${output.length})`);
    if (output.some((l) => l.length > cfg.MAX_ANSWER_LINE_LEN)) problems.push('output line too long');
    if (!src.explain) problems.push('missing @explain');
    if (src.distractors.length < 2) problems.push('needs at least 2 @distractor lines');
    if (src.distractors.some((d) => normalizeOutput(d).join('\n') === output.join('\n'))) problems.push('a distractor equals the real output');
    const verified = problems.length === 0;
    if (!verified) failed++;
    results.push({ ...src, output, verified, problems, ms: r.ms });
    const tag = verified ? '✓' : '✗';
    console.log(`${tag} ${src.id.padEnd(34)} d${src.difficulty}  ${output.length} line(s)${verified ? '' : '   ← ' + problems.join('; ')}`);
  }

  const bank = { generatedAt: new Date().toISOString(), runner: cfg.RUNNER, runtimes, puzzles: results };
  fs.mkdirSync(path.dirname(bankFile), { recursive: true });
  fs.writeFileSync(bankFile, JSON.stringify(bank, null, 1));
  const byLang = {};
  for (const r of results) if (r.verified) byLang[r.lang] = (byLang[r.lang] || 0) + 1;
  console.log(`\n${results.length - failed}/${results.length} verified  (${Object.entries(byLang).map(([k, v]) => `${k}: ${v}`).join(', ')})  → ${path.relative(ROOT, bankFile)}`);
  process.exit(failed ? 1 : 0);
})();
