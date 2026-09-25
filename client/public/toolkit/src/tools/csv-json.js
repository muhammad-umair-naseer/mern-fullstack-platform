import { twoPane } from './_data-convert.js';
import { parseCsv, stringifyCsv, csvToObjects, jsonToRows } from '../core/formats/data.js';
export function mount(root) {
  twoPane(root, { left: 'CSV or JSON', accept: '.csv,.tsv,.txt,.json', sample: 'name,age,city\nAyesha,29,Islamabad\nBilal,34,Lahore', right: [['csv2json', 'CSV → JSON'], ['json2csv', 'JSON → CSV']],
    options: [{ type: 'check', key: 'coerce', label: 'Convert numbers/booleans (CSV → JSON)', value: true }, { type: 'select', key: 'delim', label: 'Delimiter', value: 'auto', options: [['auto', 'Auto-detect'], [',', 'Comma'], [';', 'Semicolon'], ['\t', 'Tab'], ['|', 'Pipe']] }, { type: 'check', key: 'flatten', label: 'Flatten nested objects (JSON → CSV)', value: true }, { type: 'check', key: 'pretty', label: 'Pretty-print JSON', value: true }],
    name: (d) => (d === 'csv2json' ? 'data.json' : 'data.csv'),
    convert: (text, dir, o) => {
      if (dir === 'csv2json') { const rows = parseCsv(text, o.delim === 'auto' ? null : o.delim); const objs = csvToObjects(rows, { coerce: o.coerce }); return { text: JSON.stringify(objs, null, o.pretty ? 2 : 0), mime: 'application/json', note: `${objs.length} record(s), ${rows[0]?.length || 0} column(s).` }; }
      let data; try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid JSON: ' + e.message); }
      const rows = jsonToRows(data, { flatten: o.flatten });
      return { text: stringifyCsv(rows, { delimiter: o.delim === 'auto' ? ',' : o.delim }), mime: 'text/csv', note: `${rows.length - 1} row(s), ${rows[0].length} column(s).` };
    } });
}
