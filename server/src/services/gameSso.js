import jwt from 'jsonwebtoken';

/**
 * Single sign-on for the Cortexis games (Gotcha Rush, TypeDash).
 *
 * A signed-in learner trades their 30-day site session for a 10-minute game
 * token. The games verify it with the shared GAME_SSO_SECRET and bind the
 * player to the account id `cx_<sub>`. The site's own JWT_SECRET never leaves
 * this server.
 */

export const GAME_TOKEN_TTL_SEC = 10 * 60;
export const GAME_TOKEN_ISSUER = 'cortexis';
export const GAME_TOKEN_AUDIENCE = 'cortexis-games';

// Development only. Both game servers fall back to this exact value, so local
// sign-in works with nothing configured. Production refuses to use it.
export const DEV_GAME_SSO_SECRET = 'cortexis-dev-only-game-sso-secret--do-not-use-in-production';

let warned = false;

/** The signing secret, or null when game sign-in must stay off (production without a secret). */
export const gameSsoSecret = () => {
  const configured = process.env.GAME_SSO_SECRET;
  if (configured) {
    if (configured.length < 32 && !warned) {
      warned = true;
      console.warn('[game-sso] GAME_SSO_SECRET is shorter than 32 characters; use a long random value');
    }
    return configured;
  }
  if (process.env.NODE_ENV === 'production') return null;
  if (!warned) {
    warned = true;
    console.warn('[game-sso] GAME_SSO_SECRET is not set; using the development secret. Set it in server/.env and in both games before going live.');
  }
  return DEV_GAME_SSO_SECRET;
};

/** Sign a short-lived game token for a verified site user. */
export const signGameToken = (user, secret = gameSsoSecret()) =>
  jwt.sign({ name: user.name || '' }, secret, {
    algorithm: 'HS256',
    subject: String(user.id),
    issuer: GAME_TOKEN_ISSUER,
    audience: GAME_TOKEN_AUDIENCE,
    expiresIn: GAME_TOKEN_TTL_SEC,
  });
