import { h, field, select, button, section, input, notice, copyButton, row } from '../core/ui.js';

export function mount(root) {
  const zones = ['UTC', Intl.DateTimeFormat().resolvedOptions().timeZone, 'Asia/Karachi', 'Asia/Riyadh', 'Asia/Dubai', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'].filter((z, i, a) => a.indexOf(z) === i);
  const tz = select(zones.map((z) => [z, z]), Intl.DateTimeFormat().resolvedOptions().timeZone);
  const ts = input('text', { class: 'wide', placeholder: 'e.g. 1758600000 or 1758600000123', value: String(Math.floor(Date.now() / 1000)) });
  const dt = input('datetime-local', { class: 'wide', step: 1 });
  const iso = input('text', { class: 'wide', placeholder: 'ISO 8601 / RFC 2822 / any Date-parsable string' });
  const resTs = h('dl.kv'), resDate = h('dl.kv');
  const now = h('div.big-num');
  const fmt = (d, zone) => { try { return new Intl.DateTimeFormat('en-GB', { timeZone: zone, dateStyle: 'full', timeStyle: 'long' }).format(d); } catch { return d.toString(); } };
  const rel = (d) => { const s = Math.round((d.getTime() - Date.now()) / 1000); const abs = Math.abs(s); const u = abs < 60 ? [abs, 'second'] : abs < 3600 ? [Math.round(abs / 60), 'minute'] : abs < 86400 ? [Math.round(abs / 3600), 'hour'] : abs < 2592000 ? [Math.round(abs / 86400), 'day'] : abs < 31536000 ? [Math.round(abs / 2592000), 'month'] : [Math.round(abs / 31536000), 'year']; return `${u[0]} ${u[1]}${u[0] === 1 ? '' : 's'} ${s < 0 ? 'ago' : 'from now'}`; };
  const kv = (dl, pairs) => dl.replaceChildren(...pairs.flatMap(([k, v]) => [h('dt', k), h('dd', v)]));
  const fromTs = () => {
    const raw = ts.value.trim().replace(/[,_\s]/g, ''); if (!raw) return;
    let n = Number(raw); if (!Number.isFinite(n)) { kv(resTs, [['Error', 'Not a number']]); return; }
    let unit = 'seconds'; if (Math.abs(n) > 1e17) { n /= 1e6; unit = 'nanoseconds'; } else if (Math.abs(n) > 1e14) { n /= 1e3; unit = 'microseconds'; } else if (Math.abs(n) > 1e11) { unit = 'milliseconds'; } else n *= 1000;
    const d = new Date(n);
    kv(resTs, [['Detected unit', unit], [tz.value, fmt(d, tz.value)], ['UTC', d.toUTCString()], ['ISO 8601', d.toISOString()], ['Relative', rel(d)], ['Day of year', String(Math.floor((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 0))) / 86400000))], ['Seconds', String(Math.floor(d.getTime() / 1000))], ['Milliseconds', String(d.getTime())]]);
  };
  const fromDate = (d) => { if (!d || isNaN(d)) { kv(resDate, [['Error', 'Unrecognised date']]); return; } kv(resDate, [['Unix seconds', String(Math.floor(d.getTime() / 1000))], ['Unix milliseconds', String(d.getTime())], ['ISO 8601 (UTC)', d.toISOString()], [tz.value, fmt(d, tz.value)], ['Relative', rel(d)]]); };
  dt.addEventListener('input', () => fromDate(new Date(dt.value)));
  iso.addEventListener('input', () => fromDate(new Date(iso.value)));
  ts.addEventListener('input', fromTs); tz.addEventListener('change', () => { fromTs(); if (dt.value) fromDate(new Date(dt.value)); });
  setInterval(() => { now.textContent = Math.floor(Date.now() / 1000); }, 1000); now.textContent = Math.floor(Date.now() / 1000);
  root.append(h('div.tool', section('Current Unix time', row(now, copyButton(() => String(Math.floor(Date.now() / 1000))), button('Use now', () => { ts.value = String(Math.floor(Date.now() / 1000)); fromTs(); })), field('Display timezone', tz)),
    h('div.grid2', section('Timestamp → Date', field('Unix timestamp (s, ms, µs or ns — auto-detected)', ts), resTs), section('Date → Timestamp', field('Pick date & time (local)', dt), field('…or type a date string', iso), resDate)),
    notice('Timestamps are interpreted as UTC epoch values; the picker uses your device\'s local timezone.')));
  fromTs();
}
