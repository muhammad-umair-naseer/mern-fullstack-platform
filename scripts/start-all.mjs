import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(fileURLToPath(import.meta.url), '../..');
const nodeBin = process.execPath;

const services = [
  {
    name: 'Main Server',
    color: '\x1b[36m', // Cyan
    port: 5000,
    args: ['--env-file-if-exists=server/.env', 'server/src/server.js'],
    env: { PORT: '5000', NODE_ENV: 'production' },
  },
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
  {
    name: 'Admin Portal',
    color: '\x1b[31m', // Red
    port: 6001,
    args: ['admin/server.js'],
    env: { PORT: '6001' },
  },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🚀 Launching Cortexis Full Stack & Game Servers...${RESET}`);
console.log(`${BOLD}====================================================${RESET}`);
services.forEach((s) => {
  console.log(` • ${s.color}${s.name.padEnd(16)}${RESET} -> http://localhost:${s.port}`);
});
console.log(`${BOLD}====================================================\n${RESET}`);

const children = [];

function pipeOutput(stream, prefix, color) {
  let buffer = '';
  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop(); // keep unfinished line
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

for (const svc of services) {
  const child = spawn(nodeBin, svc.args, {
    cwd: rootDir,
    env: { ...process.env, ...svc.env },
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  pipeOutput(child.stdout, svc.name, svc.color);
  pipeOutput(child.stderr, svc.name, svc.color);

  child.on('exit', (code, signal) => {
    console.log(`${svc.color}[${svc.name}]${RESET} Process exited with code ${code || signal || 0}`);
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
  console.log('\n🛑 Shutting down all services...');
  killAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  killAll();
  process.exit(0);
});
