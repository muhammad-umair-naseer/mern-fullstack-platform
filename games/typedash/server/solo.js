'use strict';
const cfg = require('./config');
const passages = require('./passages');
const { clamp } = require('./util');

/**
 * Solo / practice runs happen entirely in the browser: passage, countdown,
 * pacer and timing are all client-side, so a practising player costs the
 * server nothing while they type. The server's whole involvement is:
 *
 *   1. `solo_start` — stamp the moment GO happened (one timestamp per player).
 *   2. `solo_done`  — sanity-check the single submitted result against the
 *      passage, the typing-rate ceiling and that stamp, then write it to the
 *      account (accounts.recordSolo).
 *
 * A run is `verified` when it carried a plausible progress timeline (no
 * faster than RANKED_MAX_WPM, and not machine-regular: see machineLike) and was
 * submitted within the time the stamp allows. Only verified runs are trusted
 * for anything competitive (ghost records, daily boards); unverified ones
 * still count as practice.
 */
const SLACK_CHARS = 4;              // same burst allowance as Room.handleProgress
const SUBMIT_GRACE_MS = 90000;      // stamp -> submit may exceed the run time by this much and stay verified
const STAMP_TTL_MS = 30 * 60000;    // forgotten stamps are swept after half an hour

const stamps = new Map();           // account id (or socket id) -> { passageId, mode, at }

const keyFor = (player) => (player.account ? player.account.id : `ws:${player.id}`);

/** Client reports that GO just happened. Returns the stamp, or null for an unknown passage. */
function stamp(player, msg) {
  const p = passages.byId(msg && msg.passageId);
  if (!p) return null;
  const s = { passageId: p.id, mode: msg.mode === 'daily' ? 'daily' : 'practice', at: Date.now() };
  stamps.set(keyFor(player), s);
  return s;
}

function takeStamp(player) {
  const k = keyFor(player);
  const s = stamps.get(k) || null;
  stamps.delete(k);
  return s;
}

function sweep(now = Date.now()) {
  for (const [k, s] of stamps) if (now - s.at > STAMP_TTL_MS) stamps.delete(k);
}
const sweeper = setInterval(sweep, 5 * 60000);
sweeper.unref?.();

/**
 * A progress timeline [[ms, chars], ...] a script made. Browsers sample about
 * every 250 ms, so few samples carrying many characters each are not a
 * browser's. And people speed up and slow down (hard words, punctuation, a
 * breath), so a run that never strays more than about a character from one
 * straight line kept an even pace no person keeps.
 * ponytail: a straight-line fit catches constant-rate scripts; one that adds
 * its own drift gets through, and needs a keystroke-level model to catch.
 */
function machineLike(timeline) {
  if (!Array.isArray(timeline) || !timeline.length) return false;   // nothing typed
  const n = timeline.length;
  if (n < timeline[n - 1][1] / cfg.MACHINE_CHARS_PER_SAMPLE) return true;
  if (timeline[n - 1][1] < cfg.MACHINE_MIN_CHARS) return false;      // too short to tell
  let st = 0, sc = 0, stt = 0, stc = 0;
  for (const [t, c] of timeline) { st += t; sc += c; stt += t * t; stc += t * c; }
  const den = n * stt - st * st;
  if (!den) return true;   // every sample at the same moment
  const slope = (n * stc - st * sc) / den;
  const icept = (sc - slope * st) / n;
  let ss = 0;
  for (const [t, c] of timeline) ss += (c - (icept + slope * t)) ** 2;
  return Math.sqrt(ss / n) < cfg.MACHINE_RMS_CHARS;
}

/**
 * Normalise and sanity-check a submitted run. Returns { ok: true, r } or
 * { ok: false, reason }. The numbers the account keeps (wpm, accuracy) are
 * recomputed here from chars/time/keystrokes, never taken from the client.
 */
function validate(msg, stampInfo, now = Date.now()) {
  const p = passages.byId(msg && msg.passageId);
  if (!p) return { ok: false, reason: 'Unknown passage.' };
  const len = p.text.length;

  const chars = clamp(Number(msg.chars) | 0, 0, len);
  const finished = chars >= len && !!msg.finished;
  const time = clamp(Number(msg.time) | 0, 0, 3600000);
  const keystrokes = Math.max(chars, Number(msg.keystrokes) | 0);
  const errors = clamp(Number(msg.errors) | 0, 0, keystrokes);
  if (chars > 0 && time < (chars / cfg.MAX_CPS) * 1000) return { ok: false, reason: 'That was faster than a person can type, so it was not saved.' };

  const wpm = time >= 900 ? Math.round((chars / 5) / (time / 60000)) : 0;
  const accuracy = keystrokes > 0 ? Math.floor(((keystrokes - errors) / keystrokes) * 100) : 100;

  // --- progress timeline: [[msSinceGo, correctChars], ...] ---
  let timeline = null;
  if (Array.isArray(msg.timeline) && msg.timeline.length) {
    if (msg.timeline.length > cfg.SOLO_TIMELINE_MAX) return { ok: false, reason: 'Timeline too long.' };
    const out = [];
    let pt = 0;
    let pc = 0;
    for (const s of msg.timeline) {
      if (!Array.isArray(s) || s.length !== 2) return { ok: false, reason: 'Malformed timeline.' };
      const t = Number(s[0]);
      const c = Number(s[1]);
      if (!Number.isFinite(t) || !Number.isFinite(c) || t < pt || c < pc || c > len) return { ok: false, reason: 'Timeline is not monotonic.' };
      if (c - pc > cfg.MAX_CPS * ((t - pt) / 1000) + SLACK_CHARS) return { ok: false, reason: 'Parts of that were faster than a person can type, so it was not saved.' };
      out.push([Math.round(t), c | 0]);
      pt = t;
      pc = c;
    }
    if (pc !== chars || Math.abs(pt - time) > 1500) return { ok: false, reason: 'Timeline does not match the result.' };
    timeline = out;
  }

  // --- start stamp: you cannot report a run shorter than the time since GO ---
  let verified = false;
  if (stampInfo && stampInfo.passageId === p.id) {
    const elapsed = now - stampInfo.at;
    if (time > elapsed + cfg.SOLO_START_SLACK_MS) return { ok: false, reason: 'Reported time is longer than the time since the run started.' };
    verified = !!timeline && elapsed <= time + SUBMIT_GRACE_MS && wpm <= cfg.RANKED_MAX_WPM && !machineLike(timeline);
  }

  const pacerWpm = msg.pacerWpm != null ? clamp(Number(msg.pacerWpm) | 0, 0, 400) : null;
  const r = {
    passageId: p.id,
    passageTitle: p.title,
    lang: p.lang,
    category: p.category,
    mode: stampInfo && stampInfo.mode === 'daily' ? 'daily' : msg.mode === 'daily' ? 'daily' : 'practice',
    wpm,
    accuracy,
    errors,
    keystrokes,
    chars,
    finished,
    time,
    golden: clamp(Number(msg.golden) | 0, 0, cfg.BONUS_WORDS),
    goldenTotal: clamp(Number(msg.goldenTotal) | 0, 0, cfg.BONUS_WORDS),
    bestCombo: clamp(Number(msg.bestCombo) | 0, 0, chars),
    nitros: clamp(Number(msg.nitros) | 0, 0, 200),
    score: clamp(Number(msg.score) | 0, 0, chars * cfg.MAX_SCORE_PER_CHAR + 3000),
    pacerWpm,
    beatPacer: finished && pacerWpm != null && pacerWpm > 0 && wpm > pacerWpm,
    verified,
    timeline,
    hour: new Date(now).getUTCHours(),
  };
  return { ok: true, r };
}

module.exports = { stamp, takeStamp, validate, sweep, machineLike, _stamps: stamps };
