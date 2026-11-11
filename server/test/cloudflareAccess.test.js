import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createAccessVerifier, requireAccess } from '../src/middleware/cloudflareAccess.js';

const TEAM = 'team.cloudflareaccess.com';
const AUD = 'a'.repeat(64);
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const other = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const b64 = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
function sign(claims, { kid = 'k1', alg = 'RS256', key = privateKey } = {}) {
  const head = `${b64({ alg, kid })}.${b64(claims)}`;
  return `${head}.${crypto.sign('RSA-SHA256', Buffer.from(head), key).toString('base64url')}`;
}
const now = 1_800_000_000_000;
const good = { iss: `https://${TEAM}`, aud: [AUD], exp: now / 1000 + 600 };

test('API Access verifier accepts only a valid token for the admin app', async () => {
  let fetches = 0;
  const verify = createAccessVerifier({ teamDomain: TEAM, aud: AUD, now: () => now, getKeys: async () => { fetches++; return new Map([['k1', publicKey]]); } });
  assert.equal(await verify(sign(good)), true);
  assert.equal(await verify(undefined), false);
  assert.equal(await verify(sign({ ...good, aud: ['b'.repeat(64)] })), false);
  assert.equal(await verify(sign({ ...good, iss: 'https://evil.cloudflareaccess.com' })), false);
  assert.equal(await verify(sign({ ...good, exp: now / 1000 - 1 })), false);
  assert.equal(await verify(sign(good, { key: other.privateKey })), false);
  assert.equal(await verify(sign(good, { alg: 'none' })), false);
  assert.equal(fetches, 1);
});

test('/api/admin gate: closed in production without Access config or token', async () => {
  const call = async () => {
    const res = { code: 200, status(c) { this.code = c; return this; }, json() { return this; } };
    let passed = false;
    await requireAccess({ headers: {} }, res, () => { passed = true; });
    return passed ? 'next' : res.code;
  };
  const env = { ...process.env };
  try {
    delete process.env.CF_ACCESS_TEAM_DOMAIN; delete process.env.CF_ACCESS_AUD;
    process.env.NODE_ENV = 'test';
    assert.equal(await call(), 'next', 'local dev and tests stay open');
    process.env.NODE_ENV = 'production';
    assert.equal(await call(), 403, 'production without config is closed');
  } finally { process.env.NODE_ENV = env.NODE_ENV; }
});
