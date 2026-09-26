'use strict';
/**
 * Renders the app icons from the bolt mark (dev-time only; the PNGs are
 * committed). Requires the optional @resvg/resvg-js dependency.
 *   node scripts/make-icons.js
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const BOLT = 'M36 9 17 35h12l-3 20 21-27H35l4-19z';
// the Cortexis palette: a warm ink tile, a copper bolt with a lit edge
const svg = (size, { maskable = false, radius = 16 } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E2823"/><stop offset="1" stop-color="#16130F"/></linearGradient>
    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3A374"/><stop offset="1" stop-color="#B8612E"/></linearGradient>
  </defs>
  <rect width="64" height="64" rx="${maskable ? 0 : radius}" fill="url(#g)"/>
  <g transform="${maskable ? 'translate(32 32) scale(0.72) translate(-32 -32)' : ''}"><path d="${BOLT}" fill="url(#b)"/></g>
</svg>`;
const out = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(out, { recursive: true });
const write = (name, markup, size) => {
  const png = new Resvg(markup, { fitTo: { mode: 'width', value: size } }).render().asPng();
  fs.writeFileSync(path.join(out, name), png);
  console.log(name, png.length, 'bytes');
};
write('icon-192.png', svg(192), 192);
write('icon-512.png', svg(512), 512);
write('icon-maskable-512.png', svg(512, { maskable: true }), 512);
write('apple-touch-icon.png', svg(180, { radius: 0 }), 180);
