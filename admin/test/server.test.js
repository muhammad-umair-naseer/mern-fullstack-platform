const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');

test('admin static server rejects malformed URLs and keeps serving with security headers', async () => {
  const reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, [path.join(__dirname, '../server.js')], {
    env: { ...process.env, NODE_ENV: 'production', HOST: '127.0.0.1', PORT: String(port), ADMIN_API_URL: 'https://website.example.com', ADMIN_SITE_URL: 'https://website.example.com' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const request = target => new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: target }, res => {
      let body = ''; res.setEncoding('utf8'); res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject); req.setTimeout(3000, () => req.destroy(new Error('Request timed out')));
  });
  try {
    await once(child.stdout, 'data', { signal: AbortSignal.timeout(5000) });
    assert.equal((await request('//%')).status, 400);
    const health = await request('/healthz');
    assert.equal(health.status, 200);
    assert.equal(health.headers['x-frame-options'], 'DENY');
    assert.equal(health.headers['x-content-type-options'], 'nosniff');
    assert.match(health.headers['content-security-policy'], /script-src 'self'/);
    assert.equal((await request('/.env')).status, 404);
    assert.equal((await request('/missing.js')).status, 404);
    assert.equal((await request('/')).status, 200);
  } finally {
    const exited = once(child, 'exit'); child.kill(); await exited;
  }
});
