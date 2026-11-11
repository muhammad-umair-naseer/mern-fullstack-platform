// Cloudflare Access check for the API. admin.cortexissolutionhub.com is behind
// Access, and Cloudflare adds a signed JWT (Cf-Access-Jwt-Assertion) to every
// request that passed its login. The admin portal calls the API through that
// host, so:
//   - /api/admin/* requires a valid Access token (Nginx also 404s it on the
//     main domain); a request that never went through Access cannot reach it.
//   - a valid Access token stands in for the Turnstile check on sign-in.
// Same checks as admin/access.js (that app is CommonJS and outside this image):
// RS256 only, team certs (cached; refetched for an unknown key at most once a
// minute, and hourly), issuer, AUD tag and expiry. In production without
// CF_ACCESS_TEAM_DOMAIN / CF_ACCESS_AUD, /api/admin stays closed.
import crypto from 'crypto';

async function fetchKeys(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Access certs: HTTP ${res.status}`);
  const { keys } = await res.json();
  return new Map(keys.map(jwk => [jwk.kid, crypto.createPublicKey({ key: jwk, format: 'jwk' })]));
}

const json = part => JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));

export function createAccessVerifier({ teamDomain, aud, getKeys = fetchKeys, now = Date.now }) {
  const issuer = `https://${teamDomain}`;
  let keys = new Map();
  let fetchedAt = 0;
  async function keyFor(kid) {
    const age = now() - fetchedAt;
    if ((!keys.has(kid) && age > 60_000) || age > 3_600_000) {
      keys = await getKeys(`${issuer}/cdn-cgi/access/certs`);
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

let envVerifier;
const verifier = () => {
  const { CF_ACCESS_TEAM_DOMAIN: teamDomain, CF_ACCESS_AUD: aud } = process.env;
  if (!teamDomain || !aud) return null;
  envVerifier ||= createAccessVerifier({ teamDomain, aud });
  return envVerifier;
};

/** True when the request carries a valid Access token for the admin app. */
export async function hasAccess(req) {
  const verify = verifier();
  if (!verify) return false;
  try { return await verify(req.headers['cf-access-jwt-assertion']); }
  catch (err) { console.error('Access check failed:', err.message); return false; }
}

/** Gate for /api/admin. Outside production with no Access config it is open (tests, local dev). */
export const requireAccess = async (req, res, next) => {
  if (!verifier() && process.env.NODE_ENV !== 'production') return next();
  if (await hasAccess(req)) return next();
  return res.status(403).json({ message: 'Forbidden: Admin access required.' });
};
