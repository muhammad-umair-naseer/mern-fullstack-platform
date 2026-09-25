// Tool page shell: resolves the tool from the URL (?t=slug or data-slug on <body>), renders the header and mounts the module.
import { findTool, CATEGORIES } from './registry.js';
import { h, clear, recents, errorBox, favorites } from './core/ui.js';

const base = document.body.dataset.base || '';
const params = new URLSearchParams(location.search);
const slug = document.body.dataset.slug || params.get('t') || '';
const tool = findTool(slug);
const head = document.getElementById('tool-head');
const root = document.getElementById('tool-root');

if (!tool) {
  head.append(h('h1', 'Tool not found'), h('p', 'Choose a tool from the ', h('a', { href: base || './' }, 'toolkit home'), '.'));
} else {
  const cat = CATEGORIES.find((c) => c.id === tool.category);
  document.title = `${tool.name} — Free Online Tool | Cortexis`;
  const meta = document.querySelector('meta[name=description]'); if (meta) meta.content = tool.description;
  const fav = h('button.btn.small', { onClick: () => { const on = favorites.toggle(tool.slug); fav.textContent = on ? '★ Favourited' : '☆ Favourite'; } }, favorites.has(tool.slug) ? '★ Favourited' : '☆ Favourite');
  head.append(
    h('div.crumbs', h('a', { href: base || './' }, 'All tools'), ' / ', h('a', { href: (base || './') + '#cat-' + tool.category }, cat ? cat.name : tool.category)),
    h('div.row', { style: { justifyContent: 'space-between' } }, h('h1', tool.name), fav),
    h('p', tool.description),
    h('div.badges', h('span.badge', 'Runs in your browser'), h('span.badge.gray', 'No upload · no sign-up'))
  );
  recents.push(tool.slug);
  root.append(h('p.muted', 'Loading tool…'));
  import(`./tools/${tool.slug}.js`).then((mod) => { clear(root); const m = mod.mount || mod.default?.mount || mod.default; return m(root, { tool, base }); }).catch((e) => { clear(root); root.append(errorBox(e)); });
}
