import { h, field, button, section, textarea, notice, input, textOutput, select, row, copyButton } from '../core/ui.js';
import { base64, utf8 } from '../core/bytes.js';

export function mount(root) {
  const inp = textarea({ rows: 6, class: 'mono', value: 'https://cortexis.pk/search?q=free tools&lang=en&tags=pdf,image#top' });
  const mode = select([['encodeURIComponent', 'Encode component (encodeURIComponent)'], ['encodeURI', 'Encode full URL (encodeURI)'], ['decode', 'Decode (%xx → text)'], ['form', 'Form encoding (spaces → +)'], ['formdecode', 'Form decode (+ → space)'], ['base64', 'Base64 encode'], ['base64dec', 'Base64 decode'], ['b64url', 'Base64url encode'], ['html', 'HTML entities encode'], ['htmldec', 'HTML entities decode'], ['punycode', 'Domain → Punycode (IDN)']], 'encodeURIComponent');
  const out = h('div'); const parsed = h('div'); const err = h('div');
  const run = () => {
    err.replaceChildren(); let text;
    try {
      const v = inp.value;
      switch (mode.value) {
        case 'encodeURIComponent': text = encodeURIComponent(v); break;
        case 'encodeURI': text = encodeURI(v); break;
        case 'decode': text = decodeURIComponent(v.replace(/\+/g, '%2B')); break;
        case 'form': text = encodeURIComponent(v).replace(/%20/g, '+'); break;
        case 'formdecode': text = decodeURIComponent(v.replace(/\+/g, ' ')); break;
        case 'base64': text = base64.encode(utf8.encode(v)); break;
        case 'base64dec': text = utf8.decode(base64.decode(v.trim())); break;
        case 'b64url': text = base64.encode(utf8.encode(v)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); break;
        case 'html': text = v.replace(/[&<>"'`]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c])).replace(/[\u00A0-\uFFFF]/g, (c) => `&#${c.charCodeAt(0)};`); break;
        case 'htmldec': { const t = document.createElement('textarea'); t.innerHTML = v; text = t.value; break; }
        case 'punycode': text = new URL('http://' + v.trim().replace(/^https?:\/\//, '')).hostname; break;
      }
    } catch (e) { err.append(h('div.error', e.message)); return; }
    out.replaceChildren(textOutput(text, { name: 'output.txt', rows: 6 }));
    parsed.replaceChildren();
    try { const u = new URL(inp.value.trim()); const q = [...u.searchParams.entries()]; parsed.append(h('dl.kv', ...[['Protocol', u.protocol], ['Host', u.host], ['Path', u.pathname], ['Hash', u.hash || '—']].flatMap(([k, v]) => [h('dt', k), h('dd', v)])), q.length ? h('table.data', h('thead', h('tr', h('th', 'Query key'), h('th', 'Value (decoded)'))), h('tbody', q.map(([k, v]) => h('tr', h('td.mono', k), h('td.mono', v))))) : h('p.small.muted', 'No query parameters.')); } catch { parsed.append(h('p.small.muted', 'Input is not an absolute URL, so there is nothing to parse.')); }
  };
  inp.addEventListener('input', run); mode.addEventListener('change', run);
  root.append(h('div.tool.two', h('div.stack', section('Input', inp, field('Operation', mode), err), section('Parsed URL', parsed)), h('div', section('Output', out), notice('encodeURIComponent escapes everything except A–Z a–z 0–9 - _ . ! ~ * \' ( ); encodeURI keeps URL structure characters (/ ? # & = :) intact.'))));
  run();
}
