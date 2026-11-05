import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(fileURLToPath(import.meta.url), '../..');
const nodeBin = process.execPath;

const games = [
  {
    name: 'Gotcha Rush',
    color: '\x1b[32m', // Green
    port: 3001,
    args: ['--env-file-if-exists=server/.env', 'games/gotcha-rush/server/index.js'],
    env: { PORT: '3001' },
  },
  {
    name: 'TypeDash',
    color: '\x1b[33m', // Yellow
    port: 4001,
    args: ['--env-file-if-exists=server/.env', 'games/typedash/server/index.js'],
    env: { PORT: '4001' },
  },
  {
    name: 'PickParty',
    color: '\x1b[35m', // Magenta
    port: 5001,
    args: ['--env-file-if-exists=server/.env', 'games/pickparty/server/index.js'],
    env: { PORT: '5001' },
  },
  {
    name: 'Sketch & Guess',
    color: '\x1b[34m', // Blue
    port: 7001,
    args: ['--env-file-if-exists=server/.env', 'games/sketch-and-guess/server/index.js'],
    env: { PORT: '7001' },
  },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🎮 Launching Cortexis Game Servers...${RESET}`);
console.log(`${BOLD}====================================================${RESET}`);
games.forEach((g) => {
  console.log(` • ${g.color}${g.name.padEnd(16)}${RESET} -> http://localhost:${g.port}`);
});
console.log(`${BOLD}====================================================\n${RESET}`);

const children = [];

function pipeOutput(stream, prefix, color) {
  let buffer = '';
  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}[${prefix}]${RESET} ${line}`);
      }
    }
  });
  stream.on('end', () => {
    if (buffer.trim()) {
      console.log(`${color}[${prefix}]${RESET} ${buffer}`);
    }
  });
}

for (const game of games) {
  const child = spawn(nodeBin, game.args, {
    cwd: rootDir,
    env: { ...process.env, ...game.env },
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  pipeOutput(child.stdout, game.name, game.color);
  pipeOutput(child.stderr, game.name, game.color);

  child.on('exit', (code, signal) => {
    console.log(`${game.color}[${game.name}]${RESET} Process exited with code ${code || signal || 0}`);
  });

  children.push(child);
}

const killAll = () => {
  for (const child of children) {
    if (child && !child.killed) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', child.pid.toString(), '/T', '/F']);
        } else {
          child.kill('SIGTERM');
        }
      } catch (_) {}
    }
  }
};

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down game servers...');
  killAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  killAll();
  process.exit(0);
});
