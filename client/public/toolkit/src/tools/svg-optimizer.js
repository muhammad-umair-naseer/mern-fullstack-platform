import { h, field, select, button, run, result, section, dropzone, textarea, readAs, notice, checkbox, fmtBytes, textOutput, number } from '../core/ui.js';
import { optimizeSvg } from '../core/formats/image-extra.js';

export function mount(root) {
  let name = 'image.svg';
  const inp = textarea({ rows: 14, class: 'mono', placeholder: 'Paste SVG markup or drop a file', value: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!-- Created with Inkscape -->\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" width="120.000" height="120.000" viewBox="0 0 120.00001 120.00001">\n  <metadata id="metadata5"><rdf:RDF/></metadata>\n  <g id="layer1" inkscape:label="Layer 1" transform="translate(0,0)">\n    <circle id="path1" cx="60.000000" cy="60.000000" r="48.123456" style="fill:#2E6BFF;fill-opacity:1;stroke:none"/>\n    <path id="path2" d="M 40.0000,60.0000 L 55.0000,75.0000 L 85.0000,45.0000" style="fill:none;stroke:#FFFFFF;stroke-width:8.000;stroke-linecap:round;stroke-linejoin:round"/>\n  </g>\n</svg>' });
  const precision = number(3, { min: 0, max: 8 });
  const opts = { removeIds: checkbox('Remove unused IDs', true), removeComments: checkbox('Remove comments', true), removeMetadata: checkbox('Remove <metadata>, <title>, <desc>', true), removeEditorData: checkbox('Remove editor data (Inkscape, Illustrator, Sketch…)', true), removeDefaults: checkbox('Remove default attribute values', true), removeEmptyGroups: checkbox('Collapse empty/attribute-less groups', true), roundNumbers: checkbox('Round numbers', true), minifyStyles: checkbox('Convert style="" to attributes', true), pretty: checkbox('Pretty print output', false) };
  const before = h('div.preview-box'), after = h('div.preview-box'); const stats = h('div.stats'); const out = h('div');
  const go = button('Optimise', () => run(go, async () => {
    const o = {}; for (const [k, c] of Object.entries(opts)) o[k] = c.input.checked; o.precision = Number(precision.value);
    const r = optimizeSvg(inp.value, o);
    before.replaceChildren(h('img', { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(inp.value), style: { maxHeight: '220px' } }));
    after.replaceChildren(h('img', { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(r.svg), style: { maxHeight: '220px' } }));
    stats.replaceChildren(stat(fmtBytes(r.before), 'Before'), stat(fmtBytes(r.after), 'After'), stat(Math.round((1 - r.after / r.before) * 100) + '%', 'Smaller'));
    out.replaceChildren(textOutput(r.svg, { name: name.replace(/\.svg$/i, '') + '.min.svg', mime: 'image/svg+xml', rows: 10 }));
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('Input', dropzone({ accept: '.svg,image/svg+xml', compact: true, label: 'Drop an SVG file', onFiles: async ([f]) => { name = f.name; inp.value = await readAs(f, 'text'); } }), inp), section('Options', ...Object.values(opts), field('Decimal precision', precision), go)), h('div', stats, h('div.grid2', h('div', h('h3', 'Before'), before), h('div', h('h3', 'After'), after)), out)));
}
const stat = (v, l) => h('div.stat', h('b', String(v)), h('span', l));
