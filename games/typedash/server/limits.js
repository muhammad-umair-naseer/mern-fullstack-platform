'use strict';

/**
 * Per-IP limits, so one address cannot fill the server with sockets, rooms or
 * guest accounts. The same file is used by Gotcha Rush, PickParty and TypeDash.
 *
 *   ipOf(req, trustProxy)   the caller's address; with trustProxy, the hop the
 *                           proxy in front of us appended to X-Forwarded-For
 *   new PerIp(max, ms)      at most `max` events per `ms` from one address
 *   new Sockets(max)        at most `max` sockets open at once from one address
 */
function ipOf(req, trustProxy) {
  const hop = trustProxy ? String(req.headers['x-forwarded-for'] || '').split(',').pop().trim() : '';
  return hop || (req.socket && req.socket.remoteAddress) || '?';
}

class PerIp {
  constructor(max, ms) { this.max = max; this.ms = ms; this.hits = new Map(); }

  /** Count one event; false when this address is over its limit. */
  take(ip, now = Date.now()) {
    const list = (this.hits.get(ip) || []).filter((t) => now - t < this.ms);
    const ok = list.length < this.max;
    if (ok) list.push(now);
    this.hits.set(ip, list);
    return ok;
  }

  /** Forget addresses with nothing in the window. */
  sweep(now = Date.now()) {
    for (const [ip, list] of this.hits) if (!list.length || now - list[list.length - 1] >= this.ms) this.hits.delete(ip);
  }
}

class Sockets {
  constructor(max) { this.max = max; this.open = new Map(); }

  /** Count one more socket; false (and nothing counted) when the address is full. */
  add(ip) {
    const n = this.open.get(ip) || 0;
    if (n >= this.max) return false;
    this.open.set(ip, n + 1);
    return true;
  }

  remove(ip) {
    const n = (this.open.get(ip) || 0) - 1;
    if (n > 0) this.open.set(ip, n); else this.open.delete(ip);
  }
}

module.exports = { ipOf, PerIp, Sockets };
