import { h, field, select, button, section, textarea, dropzone, readAs, textOutput, row, checkbox, number } from '../core/ui.js';
import { formatSql, minifySql } from '../core/formats/data.js';
export function mount(root) {
  const inp = textarea({ rows: 14, class: 'mono', value: "select u.id, u.name, count(o.id) as orders, sum(o.total) as revenue from users u left join orders o on o.user_id = u.id where u.created_at >= '2026-01-01' and u.status in ('active','trial') group by u.id, u.name having sum(o.total) > 1000 order by revenue desc limit 50;" });
  const kw = select([['upper', 'UPPERCASE keywords'], ['lower', 'lowercase keywords'], ['preserve', 'Keep as typed']], 'upper');
  const indent = select([['  ', '2 spaces'], ['    ', '4 spaces'], ['\t', 'Tab']], '  ');
  const out = h('div');
  const fmt = (min) => { try { out.replaceChildren(textOutput(min ? minifySql(inp.value) : formatSql(inp.value, { keywordCase: kw.value, indent: indent.value }), { name: min ? 'query.min.sql' : 'query.sql', mime: 'application/sql', rows: 16 })); } catch (e) { out.replaceChildren(h('div.error', e.message)); } };
  root.append(h('div.tool', h('div.grid2', section('SQL', dropzone({ accept: '.sql,.txt', compact: true, label: 'Drop a .sql file or paste below', onFiles: async ([f]) => { inp.value = await readAs(f, 'text'); fmt(false); } }), inp, h('div.grid2', field('Keyword case', kw), field('Indent', indent)), row(button('Format', () => fmt(false), 'primary'), button('Minify', () => fmt(true)))), section('Result', out))));
  fmt(false);
}
