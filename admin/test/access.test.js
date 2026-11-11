const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createAccessVerifier } = require('../access');

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
const good = { iss: `https://${TEAM}`, aud: [AUD], exp: now / 1000 + 600, iat: now / 1000 };

test('accepts only a valid Access token for this app', async () => {
  let fetches = 0;
  const verify = createAccessVerifier({
    teamDomain: TEAM, aud: AUD, now: () => now,
    fetchKeys: async url => { fetches++; assert.equal(url, `https://${TEAM}/cdn-cgi/access/certs`); return new Map([['k1', publicKey]]); },
  });
  assert.equal(await verify(sign(good)), true);
  assert.equal(await verify(undefined), false);
  assert.equal(await verify('not.a.jwt'), false);
  assert.equal(await verify(sign({ ...good, aud: ['b'.repeat(64)] })), false);         // another app
  assert.equal(await verify(sign({ ...good, iss: 'https://evil.cloudflareaccess.com' })), false);
  assert.equal(await verify(sign({ ...good, exp: now / 1000 - 1 })), false);           // expired
  assert.equal(await verify(sign(good, { key: other.privateKey })), false);            // forged signature
  assert.equal(await verify(sign(good, { alg: 'none' })), false);
  assert.equal(await verify(sign(good, { kid: 'unknown' })), false);
  assert.equal(fetches, 1, 'keys are cached; an unknown kid refetches at most once a minute');
});
