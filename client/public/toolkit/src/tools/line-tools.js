import { h, section, textarea, dropzone, readAs, textOutput, button, row, checkbox, select, field, notice, input } from '../core/ui.js';

export function mount(root) {
  const inp = textarea({ rows: 12, class: 'mono', value: 'banana\napple\n\nCherry\napple\nbanana\n10\n9\n100\n  date  \n' });
  const ic = checkbox('Case-insensitive', true), trim = checkbox('Trim whitespace first', true), keepFirst = checkbox('Keep first occurrence (else keep last)', true);
  const prefix = input('text', { class: 'wide', placeholder: 'Prefix to add', value: '' }), suffix = input('text', { class: 'wide', placeholder: 'Suffix to add', value: '' });
  const out = h('div'); const status = h('div');
  const lines = () => { let l = inp.value.split(/\r?\n/); if (trim.input.checked) l = l.map((s) => s.trim()); return l; };
  const emit = (l, note) => { out.replaceChildren(textOutput(l.join('\n'), { name: 'lines.txt', rows: 12 })); status.replaceChildren(notice(note, 'ok')); };
  const key = (s) => (ic.input.checked ? s.toLowerCase() : s);
  const ops = {
    'Remove duplicates': () => { const l = lines(); const seen = new Map(); const res = []; if (keepFirst.input.checked) { for (const s of l) { if (seen.has(key(s))) continue; seen.set(key(s), 1); res.push(s); } } else { const last = new Map(); l.forEach((s, i) => last.set(key(s), i)); l.forEach((s, i) => { if (last.get(key(s)) === i) res.push(s); }); } emit(res, `${l.length - res.length} duplicate line(s) removed.`); },
    'Remove empty lines': () => { const l = lines(); const r = l.filter((s) => s.trim()); emit(r, `${l.length - r.length} empty line(s) removed.`); },
    'Sort A → Z': () => emit(lines().sort((a, b) => key(a).localeCompare(key(b))), 'Sorted alphabetically.'),
    'Sort Z → A': () => emit(lines().sort((a, b) => key(b).localeCompare(key(a))), 'Sorted reverse-alphabetically.'),
    'Natural sort': () => emit(lines().sort((a, b) => key(a).localeCompare(key(b), undefined, { numeric: true, sensitivity: 'base' })), 'Natural sort (2 before 10).'),
    'Numeric sort': () => emit(lines().sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)), 'Sorted numerically.'),
    'Sort by length': () => emit(lines().sort((a, b) => a.length - b.length || key(a).localeCompare(key(b))), 'Sorted by line length.'),
    'Shuffle': () => { const l = lines(); for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } emit(l, 'Shuffled.'); },
    'Reverse order': () => emit(lines().reverse(), 'Reversed.'),
    'Number lines': () => { const l = lines(); const w = String(l.length).length; emit(l.map((s, i) => String(i + 1).padStart(w, ' ') + '. ' + s), 'Numbered.'); },
    'Add prefix/suffix': () => emit(lines().map((s) => prefix.value + s + suffix.value), 'Prefix/suffix added.'),
    'Trim lines': () => emit(inp.value.split(/\r?\n/).map((s) => s.trim()), 'Whitespace trimmed.'),
    'Count occurrences': () => { const l = lines().filter(Boolean); const m = new Map(); for (const s of l) m.set(key(s), (m.get(key(s)) || 0) + 1); emit([...m.entries()].sort((a, b) => b[1] - a[1]).map(([s, c]) => `${c}\t${s}`), `${m.size} distinct line(s).`); },
    'Join with commas': () => emit([lines().filter(Boolean).join(', ')], 'Joined.'),
  };
  root.append(h('div.tool', h('div.grid2', section('Lines', dropzone({ accept: '.txt,.csv,.md', compact: true, label: 'Drop a text file or paste below', onFiles: async ([f]) => { inp.value = await readAs(f, 'text'); } }), inp, row(ic, trim, keepFirst), h('div.grid2', field('Prefix', prefix), field('Suffix', suffix)), h('div.pill-list', Object.keys(ops).map((k) => h('button', { onClick: ops[k] }, k)))), section('Result', status, out))));
  ops['Remove duplicates']();
}
