// Picture-or-emoji area for a card. The emoji is always in the markup and is
// what you see first; once a picture has loaded the card switches to picture
// mode and the emoji shrinks to a corner badge. A picture that fails to load
// leaves the emoji in charge.
//
// Boards and lineups are rebuilt from scratch on every snapshot, so pictures
// that already loaded once are remembered here and rendered in picture mode
// straight away; otherwise every re-render would flash back to emoji.
import * as Bank from './bank.js';
import { esc } from './ui.js';

// Wikimedia renders on-demand thumbnails only at a few widths (120, 250, 330, 500 work for anonymous requests).
const WIDTH = { tile: 120, mini: 120, block: 500 };
const loaded = new Set();

// load/error don't bubble, so listen in the capture phase for every card picture.
document.addEventListener('load', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || !img.parentNode || !img.parentNode.classList || !img.parentNode.classList.contains('art')) return;
  loaded.add(img.getAttribute('src'));
  img.parentNode.classList.add('has-img');
}, true);
document.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || !img.parentNode || !img.parentNode.classList || !img.parentNode.classList.contains('art')) return;
  loaded.delete(img.getAttribute('src'));
  img.parentNode.classList.remove('has-img');
}, true);

export function cardArt(topicId, opt, size = 'tile') {
  const { emoji } = Bank.opt(topicId, opt);
  const a = Bank.art(topicId, opt);
  const badge = `<i class="art-emoji" aria-hidden="true">${emoji}</i>`;
  if (!a) return `<span class="art art-${size}">${badge}</span>`;
  const src = Bank.img(a.s, WIDTH[size] || 120);
  return `<span class="art art-${size}${loaded.has(src) ? ' has-img' : ''}"><img src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">${badge}</span>`;
}

// Who took the picture and under which licence, with a link to its page.
export function artCredit(topicId, opt) {
  const a = Bank.art(topicId, opt);
  if (!a) return null;
  return { by: a.by, lic: a.lic, page: a.p, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(a.p.replace(/ /g, '_'))}` };
}
