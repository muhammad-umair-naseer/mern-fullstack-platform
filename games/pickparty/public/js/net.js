// WebSocket client with reconnect and server-clock estimation.
const TOKEN_KEY = 'pp.token';

export class Net {
  constructor() {
    this.handlers = new Map();
    this.offset = 0;          // serverTime - localTime
    this.bestRtt = Infinity;
    this.retry = 0;
    this.pings = 0;
    this.open = false;
  }

  on(type, fn) { (this.handlers.get(type) || this.handlers.set(type, []).get(type)).push(fn); }
  emit(type, msg) { for (const fn of this.handlers.get(type) || []) fn(msg); }
  now() { return Date.now() + this.offset; }   // server clock estimate
  remaining(deadline) { return deadline ? Math.max(0, deadline - this.now()) : 0; }

  connect() {
    const url = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`;
    const ws = this.ws = new WebSocket(url);
    this.emit('status', 'connecting');
    ws.onopen = () => {
      this.open = true;
      this.retry = 0;
      this.emit('status', 'open');
      let token = null;
      try { token = localStorage.getItem(TOKEN_KEY); } catch {}
      const region = (navigator.language || '').split('-')[1];
      this.send({ type: 'hello', token, tz: new Date().getTimezoneOffset(), country: /^[A-Z]{2}$/.test(region || '') ? region : '' });
      this.pings = 0;
      this.ping();
    };
    ws.onmessage = (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      if (msg.type === 'pong') return this.onPong(msg);
      if (msg.type === 'welcome') {
        try { localStorage.setItem(TOKEN_KEY, msg.token); } catch {}
        if (this.bestRtt === Infinity) this.offset = msg.serverTime - Date.now();
      }
      this.emit(msg.type, msg);
    };
    ws.onclose = () => {
      this.open = false;
      clearTimeout(this.pingTimer);
      this.emit('status', 'down');
      const wait = Math.min(8000, 600 * 2 ** this.retry++);
      setTimeout(() => this.connect(), wait);
    };
  }

  ping() {
    if (!this.open) return;
    this.send({ type: 'ping', t: Date.now() });
    this.pings++;
    // a few quick samples to converge, then back off
    this.pingTimer = setTimeout(() => this.ping(), this.pings < 4 ? 700 : 15000);
  }

  onPong({ t, s }) {
    const now = Date.now();
    const rtt = now - t;
    if (rtt <= this.bestRtt * 1.25) {
      this.bestRtt = Math.min(this.bestRtt, rtt);
      this.offset = s - (t + rtt / 2);
    }
  }

  send(obj) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(obj)); }
  get token() { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } }
}
