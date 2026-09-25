'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');
const cfg = require('./config');

/**
 * Code runners. The game itself never executes anything at request time —
 * every puzzle's output is produced by `npm run verify`, which runs each
 * snippet through a runner and freezes the result in bank.json. The same
 * abstraction powers the optional "Lab" (edit-and-rerun after a reveal).
 *
 *   local   spawn `node` / `python3` with a wall-clock limit. Fine for the
 *           verify step on your own machine; not a sandbox.
 *   docker  one throwaway container per run: no network, memory/CPU/pid caps,
 *           read-only root, non-root user. The safe default for a live Lab.
 *   judge0  POST to a Judge0 CE instance (kernel-level sandbox via `isolate`).
 *
 * All drivers resolve to { ok, stdout, stderr, code, timedOut, ms }.
 */
const LANGS = {
  js: { ext: 'js', local: ['node', '--stack-size=984'], image: 'node:20-alpine', cmd: ['node'], judge0: 63 },
  py: { ext: 'py', local: ['python3', '-I'], image: 'python:3.12-alpine', cmd: ['python3', '-I'], judge0: 71 },
};

function spawnCapture(bin, args, { timeoutMs, cwd }) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const child = spawn(bin, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], env: { PATH: process.env.PATH, LANG: 'C.UTF-8', PYTHONIOENCODING: 'utf-8', NODE_OPTIONS: '' } });
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, timeoutMs);
    child.stdout.on('data', (d) => { if (stdout.length < 64 * 1024) stdout += d; });
    child.stderr.on('data', (d) => { if (stderr.length < 16 * 1024) stderr += d; });
    child.on('error', (err) => { clearTimeout(timer); resolve({ ok: false, stdout, stderr: String(err.message), code: -1, timedOut, ms: Date.now() - t0 }); });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0 && !timedOut, stdout, stderr, code, timedOut, ms: Date.now() - t0 });
    });
  });
}

async function runLocal(lang, code, timeoutMs) {
  const L = LANGS[lang];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gotcha-'));
  const file = path.join(dir, `main.${L.ext}`);
  fs.writeFileSync(file, code);
  try {
    return await spawnCapture(L.local[0], [...L.local.slice(1), file], { timeoutMs, cwd: dir });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function runDocker(lang, code, timeoutMs) {
  const L = LANGS[lang];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gotcha-'));
  const file = path.join(dir, `main.${L.ext}`);
  fs.writeFileSync(file, code);
  const args = [
    'run', '--rm', '--network', 'none', '--memory', cfg.RUNNER_MEMORY, '--cpus', cfg.RUNNER_CPUS,
    '--pids-limit', '64', '--read-only', '--user', '65534:65534', '--security-opt', 'no-new-privileges',
    '--tmpfs', '/tmp:rw,size=8m', '-v', `${dir}:/work:ro`, '-w', '/work', L.image, ...L.cmd, `main.${L.ext}`,
  ];
  try {
    return await spawnCapture('docker', args, { timeoutMs: timeoutMs + 3000, cwd: dir }); // +3 s for container start
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function runJudge0(lang, code, timeoutMs) {
  const L = LANGS[lang];
  const url = new URL('/submissions?base64_encoded=false&wait=true', cfg.JUDGE0_URL);
  const body = JSON.stringify({ source_code: code, language_id: L.judge0, cpu_time_limit: Math.ceil(timeoutMs / 1000) });
  const lib = url.protocol === 'https:' ? https : http;
  return new Promise((resolve) => {
    const t0 = Date.now();
    const req = lib.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(cfg.JUDGE0_TOKEN ? { 'X-Auth-Token': cfg.JUDGE0_TOKEN } : {}) },
    }, (res) => {
      let raw = '';
      res.on('data', (d) => { raw += d; });
      res.on('end', () => {
        try {
          const j = JSON.parse(raw);
          const statusId = j.status && j.status.id;
          resolve({ ok: statusId === 3, stdout: j.stdout || '', stderr: j.stderr || j.compile_output || '', code: statusId === 3 ? 0 : 1, timedOut: statusId === 5, ms: Date.now() - t0 });
        } catch (err) {
          resolve({ ok: false, stdout: '', stderr: `judge0: ${err.message}`, code: -1, timedOut: false, ms: Date.now() - t0 });
        }
      });
    });
    req.on('error', (err) => resolve({ ok: false, stdout: '', stderr: `judge0: ${err.message}`, code: -1, timedOut: false, ms: Date.now() - t0 }));
    req.setTimeout(timeoutMs + 10000, () => req.destroy(new Error('timeout')));
    req.end(body);
  });
}

async function run(lang, code, { driver = cfg.RUNNER, timeoutMs = cfg.RUNNER_TIMEOUT_MS } = {}) {
  if (!LANGS[lang]) return { ok: false, stdout: '', stderr: `unknown language ${lang}`, code: -1, timedOut: false, ms: 0 };
  if (driver === 'docker') return runDocker(lang, code, timeoutMs);
  if (driver === 'judge0') return runJudge0(lang, code, timeoutMs);
  if (driver === 'local') return runLocal(lang, code, timeoutMs);
  return { ok: false, stdout: '', stderr: 'runner disabled', code: -1, timedOut: false, ms: 0 };
}

module.exports = { run, LANGS };
