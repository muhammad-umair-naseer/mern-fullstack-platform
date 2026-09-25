import { twoPane } from './_data-convert.js';
import { parseXml, xmlToJson, jsonToXml, serializeXml } from '../core/xml.js';
export function mount(root) {
  twoPane(root, { left: 'XML or JSON', accept: '.xml,.json,.txt', sample: '<?xml version="1.0"?>\n<order id="42">\n  <customer>Ayesha</customer>\n  <item sku="A1" qty="2">Notebook</item>\n  <item sku="B7" qty="1">Pen</item>\n</order>', right: [['xml2json', 'XML → JSON'], ['json2xml', 'JSON → XML'], ['pretty', 'Pretty-print XML'], ['minify', 'Minify XML']],
    options: [{ type: 'check', key: 'coerce', label: 'Convert numbers/booleans', value: true }, { type: 'select', key: 'root', label: 'Root element name (JSON → XML)', value: 'root', options: [['root', 'root'], ['data', 'data'], ['document', 'document'], ['items', 'items']] }],
    name: (d) => (d === 'xml2json' ? 'data.json' : 'data.xml'),
    convert: (text, dir, o) => {
      if (dir === 'xml2json') { const j = xmlToJson(parseXml(text), { coerce: o.coerce }); if (!j) throw new Error('No root element found.'); return { text: JSON.stringify(j, null, 2), mime: 'application/json', note: 'Attributes are prefixed with @, text content uses #text, repeated elements become arrays.' }; }
      if (dir === 'pretty' || dir === 'minify') { const doc = parseXml(text); return { text: serializeXml(doc, { indent: dir === 'pretty' ? '  ' : null }).trim(), mime: 'application/xml' }; }
      let data; try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid JSON: ' + e.message); }
      return { text: jsonToXml(data, { rootName: o.root }), mime: 'application/xml' };
    } });
}
