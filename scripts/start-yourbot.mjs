import { existsSync } from 'fs';
import { resolve, join } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const rootDir = resolve(fileURLToPath(import.meta.url), '../..');

// Common relative folder names where YourBot might be cloned
const candidates = [
  resolve(rootDir, '../YourBot umair/frontend'),
  resolve(rootDir, '../YourBot/frontend'),
  resolve(rootDir, '../yourbot/frontend'),
  resolve(rootDir, '../your-bot/frontend'),
  resolve(rootDir, './yourbot/frontend'),
  resolve(rootDir, './YourBot/frontend'),
];

const targetDir = candidates.find((dir) => existsSync(dir) && existsSync(join(dir, 'package.json')));

if (!targetDir) {
  console.error('\n❌ YourBot frontend folder not found!');
  console.error('Please make sure the YourBot repository is cloned next to this project.');
  console.error('Checked locations:');
  candidates.forEach((c) => console.error(` - ${c}`));
  console.error('\nTip: Clone YourBot beside this repo: git clone <yourbot-repo-url> "YourBot"');
  process.exit(1);
}

console.log(`\n🚀 Starting YourBot frontend from: ${targetDir}\n`);

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(npmCmd, ['run', 'dev'], {
  cwd: targetDir,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code || 0));
