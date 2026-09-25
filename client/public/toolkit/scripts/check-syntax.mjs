// Syntax-check every JS module (no execution of browser code).
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(m?js)$/.test(f)) files.push(p); } };
walk('src'); walk('scripts'); walk('tests');
let bad = 0;
for (const f of files) { try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); } catch (e) { bad++; console.error('SYNTAX ERROR', f, '\n' + e.stderr.toString()); } }
console.log(`${files.length} files checked, ${bad} with errors`);
process.exit(bad ? 1 : 0);
