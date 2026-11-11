import { test } from 'node:test';
import assert from 'node:assert/strict';

test('turnstile middleware: enforced only with a secret, checks action and hostname, fails closed', async () => {
  process.env.SITE_URL = 'https://cortexissolutionhub.com';
  const { requireTurnstile } = await import('../src/middleware/turnstile.js');
  const run = async (body, reply) => {
    const realFetch = global.fetch;
    global.fetch = async () => { if (reply instanceof Error) throw reply; return { json: async () => reply }; };
    const res = { code: 200, status(c) { this.code = c; return this; }, json() { return this; } };
    let passed = false;
    const req = { body: { ...body }, ip: '203.0.113.9' };
    try { await requireTurnstile('login')(req, res, () => { passed = true; }); } finally { global.fetch = realFetch; }
    return { passed, code: res.code, body: req.body };
  };
  const ok = { success: true, action: 'login', hostname: 'cortexissolutionhub.com' };

  delete process.env.TURNSTILE_SECRET_KEY;
  assert.equal((await run({ email: 'a@b.c' }, ok)).passed, true, 'no secret (dev/tests): not enforced');

  process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  const good = await run({ email: 'a@b.c', turnstileToken: 't' }, ok);
  assert.equal(good.passed, true);
  assert.equal('turnstileToken' in good.body, false, 'token never reaches the handler');
  assert.equal((await run({ email: 'a@b.c' }, ok)).code, 403, 'missing token');
  assert.equal((await run({ turnstileToken: 't' }, { ...ok, success: false })).code, 403, 'failed challenge');
  assert.equal((await run({ turnstileToken: 't' }, { ...ok, action: 'signup' })).code, 403, 'token for another form');
  assert.equal((await run({ turnstileToken: 't' }, { ...ok, hostname: 'evil.example' })).code, 403, 'token from another site');
  assert.equal((await run({ turnstileToken: 't' }, { ...ok, hostname: 'www.cortexissolutionhub.com' })).passed, true);
  assert.equal((await run({ turnstileToken: 't' }, new Error('down'))).code, 503, 'Cloudflare unreachable: refused');
  delete process.env.TURNSTILE_SECRET_KEY;
});
