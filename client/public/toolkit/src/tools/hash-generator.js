import { h, field, button, section, textarea, dropzone, notice, input, copyButton, checkbox, readAs, fileChip, run, progress, select } from '../core/ui.js';
import { md5 } from '../core/formats/data.js';
import { crc32, hex, utf8, base64 } from '../core/bytes.js';

export function mount(root) {
  const inp = textarea({ rows: 6, placeholder: 'Type or paste text…', value: 'The quick brown fox jumps over the lazy dog' });
  const hmacKey = input('text', { class: 'wide', placeholder: 'Optional HMAC key (text)' });
  const upper = checkbox('Uppercase hex', false); const asB64 = checkbox('Show Base64 too', false);
  const expected = input('text', { class: 'wide', placeholder: 'Paste an expected checksum to compare' });
  const table = h('table.data'); const fileInfo = h('div'); const prog = progress();
  let fileBytes = null, fileName = null;
  const algos = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512', 'CRC32'];
  const compute = async (bytes) => {
    const key = hmacKey.value ? utf8.encode(hmacKey.value) : null;
    const rows = [];
    for (const a of algos) {
      let digest;
      if (a === 'MD5') { if (key) { digest = hmacMd5(key, bytes); } else digest = md5(bytes); }
      else if (a === 'CRC32') { if (key) continue; const c = crc32(bytes) >>> 0; digest = new Uint8Array([c >>> 24, (c >>> 16) & 255, (c >>> 8) & 255, c & 255]); }
      else if (key) { const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: a }, false, ['sign']); digest = new Uint8Array(await crypto.subtle.sign('HMAC', k, bytes)); }
      else digest = new Uint8Array(await crypto.subtle.digest(a, bytes));
      let hx = hex(digest); if (upper.input.checked) hx = hx.toUpperCase();
      const match = expected.value.trim() && expected.value.trim().toLowerCase() === hx.toLowerCase();
      rows.push(h('tr', { style: match ? { background: '#dcf5e6' } : null }, h('td', (key ? 'HMAC-' : '') + a + (match ? ' ✓' : '')), h('td.mono', { style: { wordBreak: 'break-all' } }, hx, asB64.input.checked ? h('div.small.muted', base64.encode(digest)) : null), h('td', copyButton(hx, 'Copy'))));
    }
    table.replaceChildren(h('thead', h('tr', h('th', 'Algorithm'), h('th', 'Digest'), h('th', ''))), h('tbody', rows));
  };
  const recompute = () => compute(fileBytes || utf8.encode(inp.value));
  [inp, hmacKey, expected].forEach((el) => el.addEventListener('input', recompute)); [upper, asB64].forEach((c) => c.input.addEventListener('change', recompute));
  const mode = select([['text', 'Text'], ['file', 'File']], 'text', (v) => { textSec.hidden = v !== 'text'; fileSec.hidden = v !== 'file'; if (v === 'text') { fileBytes = null; recompute(); } });
  const textSec = h('div', inp);
  const fileSec = h('div', { hidden: true }, dropzone({ accept: '*/*', label: 'Drop any file to hash it', onFiles: async ([f]) => { fileBytes = await readAs(f); fileName = f.name; fileInfo.replaceChildren(fileChip(f)); recompute(); } }), fileInfo);
  root.append(h('div.tool.two', h('div.stack', section('Input', field('Source', mode), textSec, fileSec), section('Options', field('HMAC key', hmacKey), upper, asB64, field('Compare with', expected), notice('SHA-1, SHA-256, SHA-384, SHA-512, MD5 and CRC32 — nothing you enter is stored or sent anywhere.'))), h('div', section('Digests', table))));
  recompute();
}
function hmacMd5(key, msg) { if (key.length > 64) key = md5(key); const k = new Uint8Array(64); k.set(key); const ipad = k.map((b) => b ^ 0x36), opad = k.map((b) => b ^ 0x5c); const inner = md5(concatU8(ipad, msg)); return md5(concatU8(opad, inner)); }
function concatU8(a, b) { const o = new Uint8Array(a.length + b.length); o.set(a); o.set(b, a.length); return o; }
