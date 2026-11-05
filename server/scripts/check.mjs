import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => item.isDirectory() ? files(path.join(directory, item.name)) : [path.join(directory, item.name)]);
let count = 0;
for (const file of [...files('src'), ...files('scripts')].filter(file => /\.(js|mjs)$/.test(file))) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status) { process.stderr.write(result.stderr); process.exit(result.status); }
  count++;
}
console.log(count + ' JavaScript modules parsed successfully');
