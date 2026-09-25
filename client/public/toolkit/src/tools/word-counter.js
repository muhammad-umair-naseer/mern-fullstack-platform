import { h, field, section, textarea, dropzone, readAs, notice, number, copyButton, row } from '../core/ui.js';

export function mount(root) {
  const inp = textarea({ rows: 16, placeholder: 'Type or paste your text…', value: 'Cortexis Solution Hub builds software that runs where the data lives. This word counter updates as you type: words, characters, sentences, paragraphs, reading time and the most frequent keywords.' });
  const wpm = number(230, { min: 80, max: 600 });
  const stats = h('div.stats'); const kw = h('div'); const longest = h('div');
  const update = () => {
    const t = inp.value;
    const words = t.match(/[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu) || [];
    const chars = [...t].length, charsNoSpace = [...t.replace(/\s/g, '')].length;
    const sentences = (t.match(/[^.!?…]+[.!?…]+(\s|$)|[^.!?…]+$/g) || []).filter((s) => s.trim()).length;
    const paragraphs = t.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const lines = t ? t.split('\n').length : 0;
    const readMin = words.length / Number(wpm.value || 230); const speakMin = words.length / 150;
    const fmtMin = (m) => (m < 1 ? Math.round(m * 60) + ' s' : Math.floor(m) + ' min ' + Math.round((m % 1) * 60) + ' s');
    const uniq = new Set(words.map((w) => w.toLowerCase())).size;
    const avgWord = words.length ? (words.reduce((a, w) => a + w.length, 0) / words.length).toFixed(1) : '0';
    stats.replaceChildren(...[[words.length, 'Words'], [chars, 'Characters'], [charsNoSpace, 'Chars (no spaces)'], [sentences, 'Sentences'], [paragraphs, 'Paragraphs'], [lines, 'Lines'], [uniq, 'Unique words'], [avgWord, 'Avg word length'], [fmtMin(readMin), 'Reading time'], [fmtMin(speakMin), 'Speaking time']].map(([v, l]) => h('div.stat', h('b', String(v)), h('span', l))));
    const stop = new Set('the a an and or but of to in on at for with by from as is are was were be been it this that these those i you he she we they my your our their not no yes so if then than too very can will just do does did has have had'.split(' '));
    const freq = new Map(); for (const w of words) { const k = w.toLowerCase(); if (stop.has(k) || k.length < 3) continue; freq.set(k, (freq.get(k) || 0) + 1); }
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
    kw.replaceChildren(top.length ? h('table.data', h('thead', h('tr', h('th', 'Keyword'), h('th', 'Count'), h('th', 'Density'))), h('tbody', top.map(([w, c]) => h('tr', h('td', w), h('td', String(c)), h('td', ((c / words.length) * 100).toFixed(1) + '%'))))) : h('p.small.muted', 'No keywords yet.'));
    const lw = words.slice().sort((a, b) => b.length - a.length).slice(0, 5); longest.replaceChildren(h('p.small', lw.length ? 'Longest words: ' + lw.join(', ') : ''));
    const twitter = 280 - chars; const meta = 160 - chars;
    longest.append(h('p.small.muted', `Tweet limit: ${twitter >= 0 ? twitter + ' left' : Math.abs(twitter) + ' over'} · Meta description (160): ${meta >= 0 ? meta + ' left' : Math.abs(meta) + ' over'}`));
  };
  inp.addEventListener('input', update); wpm.addEventListener('input', update);
  root.append(h('div.tool.two', h('div.stack', section('Text', dropzone({ accept: '.txt,.md,.csv', compact: true, label: 'Drop a text file or type below', onFiles: async ([f]) => { inp.value = await readAs(f, 'text'); update(); } }), inp, row(field('Reading speed (wpm)', wpm), copyButton(() => inp.value, 'Copy text')))), h('div', stats, section('Keyword density', kw), longest)));
  update();
}
