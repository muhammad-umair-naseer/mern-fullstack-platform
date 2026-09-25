import { h, field, button, section, textarea, notice, checkbox, row, textOutput, dropzone, readAs, select } from '../core/ui.js';
import { diffLines, diffChars, diffWords, unifiedDiff } from '../core/formats/data.js';

export function mount(root) {
  const a = textarea({ rows: 12, class: 'mono', value: 'function greet(name) {\n  console.log("Hello " + name);\n  return true;\n}\n\ngreet("world");' });
  const b = textarea({ rows: 12, class: 'mono', value: 'function greet(name, punct = "!") {\n  console.log(`Hello ${name}${punct}`);\n  return true;\n}\n\ngreet("Cortexis");' });
  const ws = checkbox('Ignore whitespace', false), ic = checkbox('Ignore case', false), inline = select([['word', 'Word-level inline marks'], ['char', 'Character-level'], ['none', 'Lines only']], 'word');
  const out = h('div'); const stats = h('div'); const patch = h('div');
  const run = () => {
    const d = diffLines(a.value, b.value, { ignoreWhitespace: ws.input.checked, ignoreCase: ic.input.checked });
    let la = 0, lb = 0, ins = 0, del = 0; const rows = [];
    const inl = (x, y) => (inline.value === 'char' ? diffChars(x, y) : diffWords(x, y));
    for (let k = 0; k < d.length; k++) {
      const o = d[k];
      if (o.type === 'eq') { la++; lb++; rows.push(h('div.l', h('span.n', la), h('span.n', lb), h('span', o.a))); continue; }
      if (o.type === 'del' && d[k + 1]?.type === 'ins' && inline.value !== 'none') { const w = inl(o.a, d[k + 1].b); la++; lb++; del++; ins++; rows.push(h('div.l.del', h('span.n', la), h('span.n', ''), h('span', w.filter((x) => x.type !== 'ins').map((x) => (x.type === 'del' ? h('mark.del', x.a) : x.a))))); rows.push(h('div.l.ins', h('span.n', ''), h('span.n', lb), h('span', w.filter((x) => x.type !== 'del').map((x) => (x.type === 'ins' ? h('mark.ins', x.b) : x.a ?? x.b))))); k++; continue; }
      if (o.type === 'del') { la++; del++; rows.push(h('div.l.del', h('span.n', la), h('span.n', ''), h('span', o.a))); }
      else { lb++; ins++; rows.push(h('div.l.ins', h('span.n', ''), h('span.n', lb), h('span', o.b))); }
    }
    out.replaceChildren(h('div.diff', rows));
    stats.replaceChildren(notice(ins || del ? `${del} line(s) removed, ${ins} line(s) added, ${d.filter((o) => o.type === 'eq').length} unchanged.` : 'The two texts are identical.', ins || del ? 'warn' : 'ok'));
    patch.replaceChildren(textOutput(unifiedDiff(a.value, b.value, { fileA: 'original', fileB: 'modified' }), { name: 'changes.patch', rows: 6 }));
  };
  [a, b].forEach((t) => t.addEventListener('input', run)); [ws, ic].forEach((c) => c.input.addEventListener('change', run)); inline.addEventListener('change', run);
  root.append(h('div.tool', h('div.grid2', section('Original', dropzone({ accept: '*/*', compact: true, label: 'Drop file A', onFiles: async ([f]) => { a.value = await readAs(f, 'text'); run(); } }), a), section('Modified', dropzone({ accept: '*/*', compact: true, label: 'Drop file B', onFiles: async ([f]) => { b.value = await readAs(f, 'text'); run(); } }), b)), row(ws, ic, field('Inline highlighting', inline), button('Swap', () => { const t = a.value; a.value = b.value; b.value = t; run(); })), stats, out, section('Unified diff', patch)));
  run();
}
