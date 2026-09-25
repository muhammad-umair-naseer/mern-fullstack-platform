// Shared two-pane text converter UI (input textarea / file -> output textarea + download).
import { h, field, select, button, run, section, dropzone, textarea, textOutput, notice, checkbox, readAs, row } from '../core/ui.js';

export function twoPane(root, { title, left, right, convert, options = [], accept = '.txt', sample = '', name = 'output.txt', mime = 'text/plain', intro = null }) {
  const inp = textarea({ rows: 16, class: 'mono', placeholder: `Paste ${left} here…`, value: sample });
  const dir = select(right, right[0][0]);
  const opts = {};
  const optEls = options.map((o) => { if (o.type === 'check') { const c = checkbox(o.label, o.value, (v) => { opts[o.key] = v; }); opts[o.key] = o.value; return c; } if (o.type === 'select') { const s = select(o.options, o.value, (v) => { opts[o.key] = v; }); opts[o.key] = o.value; return field(o.label, s); } return null; });
  const outHost = h('div');
  const status = h('div');
  const go = button('Convert', () => run(go, async () => {
    status.replaceChildren();
    const r = await convert(inp.value, dir.value, opts);
    const outName = typeof r === 'object' && r.name ? r.name : (typeof name === 'function' ? name(dir.value) : name);
    const text = typeof r === 'object' && 'text' in r ? r.text : r;
    outHost.replaceChildren(textOutput(text, { name: outName, mime: typeof r === 'object' && r.mime ? r.mime : mime, rows: 16 }));
    if (typeof r === 'object' && r.note) status.append(notice(r.note, r.noteKind || 'ok'));
  }, status), 'primary');
  root.append(h('div.tool', intro, h('div.grid2', section('Input', dropzone({ accept, compact: true, label: 'Drop a file or paste below', onFiles: async ([f]) => { inp.value = await readAs(f, 'text'); } }), inp), section('Output', field('Conversion', dir), ...optEls, row(go), status, outHost))));
  return { inp, dir, go };
}
