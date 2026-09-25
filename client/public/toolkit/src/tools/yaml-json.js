import { twoPane } from './_data-convert.js';
import { parseYaml, stringifyYaml } from '../core/formats/data.js';
export function mount(root) {
  twoPane(root, { left: 'YAML or JSON', accept: '.yaml,.yml,.json,.txt', sample: 'service:\n  name: cortexis-api\n  replicas: 3\n  ports:\n    - 8080\n    - 8443\n  env:\n    DEBUG: false\n    REGION: eu-west', right: [['yaml2json', 'YAML → JSON'], ['json2yaml', 'JSON → YAML']],
    options: [{ type: 'select', key: 'indent', label: 'Indent', value: '2', options: [['2', '2 spaces'], ['4', '4 spaces']] }],
    name: (d) => (d === 'yaml2json' ? 'data.json' : 'data.yaml'),
    convert: (text, dir, o) => {
      if (dir === 'yaml2json') { const v = parseYaml(text); return { text: JSON.stringify(v, null, Number(o.indent)), mime: 'application/json' }; }
      let data; try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid JSON: ' + e.message); }
      return { text: stringifyYaml(data, Number(o.indent)), mime: 'application/x-yaml' };
    } });
}
