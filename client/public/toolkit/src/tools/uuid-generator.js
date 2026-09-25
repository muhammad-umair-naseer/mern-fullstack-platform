import { h, field, button, section, textarea, notice, number, copyButton, checkbox, select, row, range, download } from '../core/ui.js';
import { hex, base64, base64url } from '../core/bytes.js';

export function mount(root) {
  const rnd = (n) => crypto.getRandomValues(new Uint8Array(n));
  const uuid4 = () => { const b = rnd(16); b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80; return fmtUuid(b); };
  const uuid7 = () => { const b = rnd(16); const t = BigInt(Date.now()); for (let i = 0; i < 6; i++) b[i] = Number((t >> BigInt(8 * (5 - i))) & 0xffn); b[6] = (b[6] & 0x0f) | 0x70; b[8] = (b[8] & 0x3f) | 0x80; return fmtUuid(b); };
  const fmtUuid = (b) => { const s = hex(b); return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`; };
  const ulid = () => { const A = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; let t = Date.now(); let out = ''; for (let i = 9; i >= 0; i--) { out = A[t % 32] + out; t = Math.floor(t / 32); } const r = rnd(16); let bits = 0, acc = 0, s = ''; for (const b of r) { acc = (acc << 8) | b; bits += 8; while (bits >= 5 && s.length < 16) { s += A[(acc >>> (bits - 5)) & 31]; bits -= 5; } } return out + s.slice(0, 16); };
  const kind = select([['uuid4', 'UUID v4 (random)'], ['uuid7', 'UUID v7 (time-ordered)'], ['ulid', 'ULID'], ['password', 'Password'], ['hex', 'Hex secret'], ['base64', 'Base64 secret'], ['base64url', 'Base64url secret (JWT/API keys)'], ['apikey', 'API key (prefix_base62)'], ['pin', 'Numeric PIN']], 'uuid4');
  const count = number(5, { min: 1, max: 1000 });
  const length = range(20, { min: 4, max: 128, format: (v) => v + ' chars' });
  const bytesLen = select([[16, '16 bytes (128-bit)'], [32, '32 bytes (256-bit)'], [64, '64 bytes (512-bit)']], 32);
  const sets = { lower: checkbox('a-z', true), upper: checkbox('A-Z', true), digits: checkbox('0-9', true), symbols: checkbox('!@#$%^&*()-_=+[]{};:,.?', true), ambiguous: checkbox('Exclude ambiguous (0O1lI|)', true) };
  const prefix = select([['sk', 'sk'], ['pk', 'pk'], ['ctx', 'ctx'], ['api', 'api']], 'sk');
  const out = textarea({ rows: 12, class: 'mono', readonly: true }); const strength = h('div.small.muted');
  const password = () => { let chars = ''; if (sets.lower.input.checked) chars += 'abcdefghijklmnopqrstuvwxyz'; if (sets.upper.input.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (sets.digits.input.checked) chars += '0123456789'; if (sets.symbols.input.checked) chars += '!@#$%^&*()-_=+[]{};:,.?'; if (sets.ambiguous.input.checked) chars = chars.replace(/[0O1lI|]/g, ''); if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'; const n = length.getValue(); let s = ''; const max = 256 - (256 % chars.length); while (s.length < n) { const b = rnd(1)[0]; if (b < max) s += chars[b % chars.length]; } return s; };
  const base62 = (n) => { const A = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; let s = ''; const max = 256 - (256 % 62); while (s.length < n) { const b = rnd(1)[0]; if (b < max) s += A[b % 62]; } return s; };
  const gen = () => {
    const n = Number(count.value); const list = [];
    for (let i = 0; i < n; i++) list.push({ uuid4, uuid7, ulid, password, hex: () => hex(rnd(Number(bytesLen.value))), base64: () => base64.encode(rnd(Number(bytesLen.value))), base64url: () => base64url.encode(rnd(Number(bytesLen.value))), apikey: () => `${prefix.value}_${base62(32)}`, pin: () => { let s = ''; while (s.length < length.getValue()) { const b = rnd(1)[0]; if (b < 250) s += String(b % 10); } return s; } }[kind.value]());
    out.value = list.join('\n');
    if (kind.value === 'password') { let pool = 0; if (sets.lower.input.checked) pool += 26; if (sets.upper.input.checked) pool += 26; if (sets.digits.input.checked) pool += 10; if (sets.symbols.input.checked) pool += 22; const bits = Math.round(Math.log2(pool || 1) * length.getValue()); strength.textContent = `≈ ${bits} bits of entropy per password (${bits < 50 ? 'weak' : bits < 80 ? 'good' : 'strong'}).`; } else strength.textContent = '';
  };
  const pwOpts = h('div', field('Length', length), row(...Object.values(sets)));
  const secOpts = h('div', { hidden: true }, field('Size', bytesLen));
  const keyOpts = h('div', { hidden: true }, field('Prefix', prefix));
  kind.addEventListener('change', () => { pwOpts.hidden = !(kind.value === 'password' || kind.value === 'pin'); secOpts.hidden = !/hex|base64/.test(kind.value); keyOpts.hidden = kind.value !== 'apikey'; gen(); });
  [count, length.input, bytesLen, prefix].forEach((el) => el.addEventListener('input', gen)); Object.values(sets).forEach((c) => c.input.addEventListener('change', gen));
  root.append(h('div.tool.two', h('div.stack', section('Generator', field('Type', kind), field('How many', count), pwOpts, secOpts, keyOpts, row(button('Regenerate', gen, 'primary'), copyButton(() => out.value, 'Copy all'), button('Download .txt', () => download(out.value, kind.value + '.txt', 'text/plain'))), notice('Randomness comes from crypto.getRandomValues (CSPRNG). Nothing is logged or transmitted.'))), h('div', section('Output', out, strength))));
  gen();
}
