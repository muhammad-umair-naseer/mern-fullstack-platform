import { regexJob } from '../core/regex-job.js';
import { h, field, button, section, textarea, notice, input, checkbox, row, textOutput } from '../core/ui.js';

export function mount(root) {
  const pattern = input('text', { class: 'wide mono', value: '(\\w+)@(\\w+)\\.(com|pk|org)', placeholder: 'Pattern' });
  const flags = { g: checkbox('g (global)', true), i: checkbox('i (ignore case)', false), m: checkbox('m (multiline)', false), s: checkbox('s (dotAll)', false), u: checkbox('u (unicode)', false), y: checkbox('y (sticky)', false) };
  const test = textarea({ rows: 8, class: 'mono', value: 'Contact: umair@cortexis.pk, sales@example.com or admin@site.org\nInvalid: foo@bar.net' });
  const replace = input('text', { class: 'wide mono', placeholder: 'Replacement (use $1, $<name>, $&)', value: '$1 at $2' });
  const highlighted = h('div.card', { class: 'mono', style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 } });
  const matches = h('div'); const explain = h('div'); const replaced = h('div'); const err = h('div');
  let job, revision = 0;
  const run = async () => {
    job?.cancel(); const current = ++revision;
    err.replaceChildren(); matches.replaceChildren(); highlighted.replaceChildren(); replaced.replaceChildren();
    const f = Object.entries(flags).filter(([, c]) => c.input.checked).map(([k]) => k).join('');
    const text = test.value;
    let output;
    try {
      job = regexJob({ pattern: pattern.value, flags: f, text, replacement: replace.value });
      output = await job.promise;
    } catch (e) { if (current === revision) { err.append(h('div.error', e.message)); explain.replaceChildren(); } return; }
    if (current !== revision || !root.isConnected) return;
    explain.replaceChildren(...explainRegex(pattern.value).map(l => h('div.small', l)));
    const all = output.matches.map(m => Object.assign(m.values, { index: m.index, groups: m.groups }));
    let last = 0; const frag = [];
    for (const m of all) { if (m.index > last) frag.push(text.slice(last, m.index)); frag.push(h('mark', { style: { background: '#ffe08a', color: '#000', borderRadius: '2px' } }, m[0] || '∅')); last = m.index + m[0].length; }
    if (last < text.length) frag.push(text.slice(last)); highlighted.append(...frag);
    matches.append(notice(`${all.length} match${all.length === 1 ? '' : 'es'}`, all.length ? 'ok' : 'warn'));
    if (all.length) matches.append(h('table.data', h('thead', h('tr', h('th', '#'), h('th', 'Match'), h('th', 'Index'), h('th', 'Groups'))), h('tbody', all.slice(0, 200).map((m, i) => h('tr', h('td', String(i + 1)), h('td.mono', m[0]), h('td', String(m.index)), h('td.mono', [...m.slice(1).map((g, k) => `$${k + 1}=${g ?? '—'}`), ...Object.entries(m.groups || {}).map(([k, v]) => `${k}=${v ?? '—'}`)].join('  ')))))));
    replaced.append(textOutput(output.replaced, { name: 'replaced.txt', rows: 5 }));
  };
  [pattern, test, replace].forEach((el) => el.addEventListener('input', run)); Object.values(flags).forEach((c) => c.input.addEventListener('change', run));
  const cheats = [['\\d', 'digit'], ['\\w', 'word char'], ['\\s', 'whitespace'], ['\\b', 'word boundary'], ['[abc]', 'set'], ['[^abc]', 'negated set'], ['a*', '0 or more'], ['a+', '1 or more'], ['a?', 'optional'], ['a{2,4}', 'range'], ['(x)', 'capture group'], ['(?:x)', 'non-capturing'], ['(?<n>x)', 'named group'], ['x|y', 'alternation'], ['^ $', 'anchors'], ['(?=x)', 'lookahead'], ['(?<=x)', 'lookbehind'], ['x*?', 'lazy']];
  root.append(h('div.tool.two', h('div.stack', section('Pattern', h('div.row', h('span.mono', '/'), pattern, h('span.mono', '/' )), row(...Object.values(flags)), err), section('Test string', test), section('Replace', field('Replacement', replace), replaced), section('Cheat sheet', h('div.pill-list', cheats.map(([c, d]) => h('button', { title: d, onClick: () => { pattern.value += c.replace(/ .*$/, ''); run(); } }, c + ' ', h('span.muted', d)))))), h('div', section('Highlighted matches', highlighted), section('Matches', matches), section('Explanation', explain))));
  run();
  return () => { revision++; job?.cancel(); };
}
export function explainRegex(src) {
  const out = []; let i = 0; let depth = 0;
  const pad = () => '  '.repeat(depth);
  const push = (s) => out.push(pad() + s);
  const classes = { d: 'a digit (0-9)', D: 'a non-digit', w: 'a word character (letters, digits, _)', W: 'a non-word character', s: 'a whitespace character', S: 'a non-whitespace character', b: 'a word boundary', B: 'a non-word-boundary', n: 'a newline', t: 'a tab', r: 'a carriage return' };
  const quant = () => { const m = /^(\*|\+|\?|\{(\d+)(,(\d*))?\})(\?)?/.exec(src.slice(i)); if (!m) return ''; i += m[0].length; let q = m[1] === '*' ? 'zero or more times' : m[1] === '+' ? 'one or more times' : m[1] === '?' ? 'optionally' : m[3] === undefined ? `exactly ${m[2]} times` : m[4] === '' ? `at least ${m[2]} times` : `between ${m[2]} and ${m[4]} times`; if (m[5]) q += ' (lazy)'; return ' — ' + q; };
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') { const n = src[i + 1]; i += 2; if (n === undefined) { push('trailing backslash'); break; } if (classes[n]) push(`\\${n}: ${classes[n]}${quant()}`); else if (/\d/.test(n)) push(`\\${n}: backreference to group ${n}${quant()}`); else if (n === 'u' || n === 'x') { const m = /^(\{[0-9a-fA-F]+\}|[0-9a-fA-F]{2,4})/.exec(src.slice(i)); const code = m ? m[0] : ''; i += code.length; push(`\\${n}${code}: unicode/hex character${quant()}`); } else if (n === 'p' || n === 'P') { const m = /^\{[^}]*\}/.exec(src.slice(i)); i += m ? m[0].length : 0; push(`\\${n}${m ? m[0] : ''}: unicode property class${quant()}`); } else if (n === 'k') { const m = /^<[^>]*>/.exec(src.slice(i)); i += m ? m[0].length : 0; push(`\\k${m ? m[0] : ''}: backreference to named group${quant()}`); } else push(`\\${n}: the literal character "${n}"${quant()}`); continue; }
    if (c === '[') { let j = i + 1; if (src[j] === ']') j++; while (j < src.length && src[j] !== ']') { if (src[j] === '\\') j++; j++; } const body = src.slice(i + 1, j); i = j + 1; push(`[${body}]: any ${body.startsWith('^') ? 'character NOT in the set ' + body.slice(1) : 'one character in the set ' + body}${quant()}`); continue; }
    if (c === '(') { let label = 'capturing group'; let skip = 1; if (src.startsWith('(?:', i)) { label = 'non-capturing group'; skip = 3; } else if (src.startsWith('(?=', i)) { label = 'positive lookahead (must be followed by)'; skip = 3; } else if (src.startsWith('(?!', i)) { label = 'negative lookahead (must NOT be followed by)'; skip = 3; } else if (src.startsWith('(?<=', i)) { label = 'positive lookbehind (must be preceded by)'; skip = 4; } else if (src.startsWith('(?<!', i)) { label = 'negative lookbehind'; skip = 4; } else if (src.startsWith('(?<', i)) { const m = /^\(\?<([^>]+)>/.exec(src.slice(i)); label = `named capturing group "${m ? m[1] : ''}"`; skip = m ? m[0].length : 3; } i += skip; push(`( ${label}`); depth++; continue; }
    if (c === ')') { depth = Math.max(0, depth - 1); i++; push(`)${quant()}`); continue; }
    if (c === '|') { i++; out.push(pad() + '| OR'); continue; }
    if (c === '^') { i++; push('^: start of string/line'); continue; }
    if (c === '$') { i++; push('$: end of string/line'); continue; }
    if (c === '.') { i++; push(`.: any character except newline${quant()}`); continue; }
    let j = i; while (j < src.length && !/[\\\[\](){}|^$.*+?]/.test(src[j])) j++;
    if (j === i) { i++; push(`"${c}": literal`); continue; }
    let lit = src.slice(i, j);
    if (j < src.length && /[*+?{]/.test(src[j]) && lit.length > 1) { push(`"${lit.slice(0, -1)}": literal text`); lit = lit.slice(-1); i = j - 1; }
    i = j; if (lit.length === 1 && i < src.length) { i = j; push(`"${lit}": literal${quant()}`); } else push(`"${lit}": literal text`);
  }
  return out;
}
