// Hub page: search, categories, favourites + recently used shelf.
import { TOOLS, CATEGORIES, findTool } from './registry.js';
import { h, clear, favorites, recents } from './core/ui.js';

const base = document.body.dataset.base || '';
const toolUrl = (slug) => `${base}tools/${slug}/`;
const catalog = document.getElementById('catalog');
const shelves = document.getElementById('shelves');
const search = document.getElementById('search');

function card(t) {
  const isFav = favorites.has(t.slug);
  const fav = h('button.fav', { class: isFav ? 'on' : '', title: isFav ? 'Remove from favourites' : 'Add to favourites', 'aria-label': 'Toggle favourite', onClick: (e) => { e.preventDefault(); e.stopPropagation(); const on = favorites.toggle(t.slug); fav.classList.toggle('on', on); fav.textContent = on ? '★' : '☆'; renderShelves(); } }, isFav ? '★' : '☆');
  return h('a.tool-card', { href: toolUrl(t.slug), 'data-slug': t.slug }, h('div.t-name', t.name), h('div.t-desc', t.description), fav);
}
function renderShelves() {
  clear(shelves);
  const favs = favorites.list().map(findTool).filter(Boolean);
  const rec = recents.list().map(findTool).filter(Boolean);
  if (favs.length) shelves.append(h('section.shelf', h('h2', 'Favourites'), h('div.shelf-row', favs.map((t) => h('a', { href: toolUrl(t.slug) }, '★ ' + t.name)))));
  if (rec.length) shelves.append(h('section.shelf', h('h2', 'Recently used'), h('div.shelf-row', rec.map((t) => h('a', { href: toolUrl(t.slug) }, t.name)))));
}
function render(q = '') {
  clear(catalog);
  const needle = q.trim().toLowerCase();
  const match = (t) => !needle || (t.name + ' ' + t.description + ' ' + t.keywords).toLowerCase().includes(needle);
  let any = false;
  for (const c of CATEGORIES) {
    const list = TOOLS.filter((t) => t.category === c.id && match(t));
    if (!list.length) continue;
    any = true;
    catalog.append(h('section.cat', { id: 'cat-' + c.id }, h('div.cat-head', h('h2', c.name), h('p', c.blurb)), h('div.tools-grid', list.map(card))));
  }
  if (!any) catalog.append(h('p.empty', `No tools match “${q}”.`));
}
search.addEventListener('input', () => render(search.value));
renderShelves();
render();
