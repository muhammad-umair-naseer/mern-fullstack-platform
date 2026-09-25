'use strict';
/**
 * Load / soak test: N simulated players quick-match and answer every round
 * (a distractor most of the time, the real output occasionally so the boards
 * move). Usage: node test/simulate.js 12   (env: URL=wss://host, MATCHES=3)
 */
const WebSocket = require('ws');
const N = Number(process.argv[2] || 8);
const URL = process.env.URL || 'ws://localhost:3000';
const MATCHES = Number(process.env.MATCHES || 2);
const NAMES = ['sim-ada', 'sim-bob', 'sim-cy', 'sim-dee', 'sim-eve', 'sim-fay', 'sim-gus', 'sim-hal', 'sim-ivy', 'sim-jo', 'sim-kit', 'sim-lou'];
let done = 0;

function player(i) {
  const ws = new WebSocket(URL);
  let matches = 0;
  let room = null;
  const name = NAMES[i % NAMES.length] + (i >= NAMES.length ? i : '');
  ws.on('open', () => { ws.send(JSON.stringify({ type: 'hello', name, country: 'PK', avatar: 'bug' })); ws.send(JSON.stringify({ type: 'quick', lang: 'mix' })); });
  ws.on('message', (raw) => {
    const m = JSON.parse(raw);
    if (m.type === 'room') {
      const wasRound = room && room.state === 'round' && room.roundNo === m.roundNo;
      room = m;
      if (m.state === 'round' && !wasRound) {
        const delay = 1500 + Math.random() * Math.min(12000, m.roundMs - 3000);
        setTimeout(() => {
          if (!room || room.state !== 'round' || room.roundNo !== m.roundNo) return;
          const guess = Math.random() < 0.3 ? ['guess'] : Array.from({ length: m.lines }, () => String(Math.floor(Math.random() * 100)));
          ws.send(JSON.stringify({ type: 'answer', lines: guess }));
        }, delay);
      }
      if (m.state === 'finished') {
        const me = m.results.find((r) => r.name === name);
        matches++;
        console.log(`${name.padEnd(10)} match ${matches}: #${me ? me.rank : '?'} score ${me ? me.score : '?'}`);
        if (matches >= MATCHES) { ws.close(); if (++done === N) process.exit(0); }
      }
    }
    if (m.type === 'error') console.error(name, 'error:', m.message);
  });
  ws.on('error', (e) => console.error(name, e.message));
}

for (let i = 0; i < N; i++) setTimeout(() => player(i), i * 150);
console.log(`${N} simulated players connecting to ${URL} for ${MATCHES} match(es) each…`);
