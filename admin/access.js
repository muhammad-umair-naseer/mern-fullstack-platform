// Cloudflare Access check. Every request that passed the Access login reaches
// us with a JWT signed by Cloudflare (Cf-Access-Jwt-Assertion header).
// Checking it here means connecting to the server directly, around
// Cloudflare, gets nothing. RS256 only; keys come from the team's certs
// endpoint, refetched for an unknown key id (at most once a minute) and hourly.
const crypto = require('crypto');

async function defaultFetchKeys(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Access certs: HTTP ${res.status}`);
  const { keys } = await res.json();
  return new Map(keys.map(jwk => [jwk.kid, crypto.createPublicKey({ key: jwk, format: 'jwk' })]));
}

const json = part => JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));

function createAccessVerifier({ teamDomain, aud, fetchKeys = defaultFetchKeys, now = Date.now }) {
  const issuer = `https://${teamDomain}`;
  let keys = new Map();
  let fetchedAt = 0;
  async function keyFor(kid) {
    const age = now() - fetchedAt;
    if ((!keys.has(kid) && age > 60_000) || age > 3_600_000) {
      keys = await fetchKeys(`${issuer}/cdn-cgi/access/certs`);
      fetchedAt = now();
    }
    return keys.get(kid);
  }
  return async function verify(token) {
    if (typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    let header, claims;
    try { header = json(parts[0]); claims = json(parts[1]); } catch { return false; }
    if (header.alg !== 'RS256' || typeof header.kid !== 'string') return false;
    const key = await keyFor(header.kid);
    if (!key) return false;
    const signed = crypto.verify('RSA-SHA256', Buffer.from(`${parts[0]}.${parts[1]}`), key, Buffer.from(parts[2], 'base64url'));
    if (!signed) return false;
    const t = now() / 1000;
    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    return claims.iss === issuer && auds.includes(aud)
      && typeof claims.exp === 'number' && claims.exp > t
      && !(typeof claims.nbf === 'number' && claims.nbf > t + 60);
  };
}

module.exports = { createAccessVerifier };
