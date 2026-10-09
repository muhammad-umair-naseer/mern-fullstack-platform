// Home-screen ranking boards: category tabs, time window, region.
import { $, esc, flag, fmt } from './ui.js';

const UNIT = { points: 'pts', wins: 'wins', crowd: 'votes', mind: 'loves', solo: 'pts', streak: 'days' };

export function createRanks(net) {
  const el = { tabs: $('#rank-tabs'), win: $('#rank-window'), scope: $('#rank-scope'), list: $('#rank-list'), you: $('#rank-you') };
  const S = { meta: [], cat: 'points', win: 'all', scope: 'GLOBAL', country: '' };

  function setup(meta, country) {
    S.meta = meta;
    S.country = country || '';
    renderControls();
    request();
  }

  function setCountry(c) { S.country = c || ''; if (!S.country) S.scope = 'GLOBAL'; renderControls(); }

  function renderControls() {
    const m = S.meta.find((x) => x.id === S.cat) || S.meta[0];
    if (!m) return;
    if (!m.windows.includes(S.win)) S.win = 'all';
    el.tabs.innerHTML = S.meta.map((x) => `<button type="button" role="tab" aria-selected="${x.id === S.cat}" data-cat="${x.id}">${esc(x.label)}</button>`).join('');
    el.win.hidden = m.windows.length < 2;
    el.win.innerHTML = m.windows.map((w) => `<button type="button" role="radio" aria-checked="${w === S.win}" data-win="${w}">${w === 'all' ? 'All time' : 'This week'}</button>`).join('');
    const scopes = [['GLOBAL', 'Global']];
    if (S.country) scopes.push([S.country, `${flag(S.country)} ${regionName(S.country)}`]);
    el.scope.innerHTML = scopes.map(([v, l]) => `<button type="button" role="radio" aria-checked="${v === S.scope}" data-scope="${v}">${esc(l)}</button>`).join('');
  }

  function request() { net.send({ type: 'board', category: S.cat, window: S.win, scope: S.scope }); }

  el.tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) { S.cat = b.dataset.cat; renderControls(); request(); } });
  el.win.addEventListener('click', (e) => { const b = e.target.closest('[data-win]'); if (b) { S.win = b.dataset.win; renderControls(); request(); } });
  el.scope.addEventListener('click', (e) => { const b = e.target.closest('[data-scope]'); if (b) { S.scope = b.dataset.scope; renderControls(); request(); } });

  function onBoard(b) {
    if (b.category !== S.cat || b.window !== S.win || b.scope !== S.scope) return;
    const unit = UNIT[b.category] || '';
    el.list.innerHTML = b.entries.length
      ? b.entries.map((e) => `<li class="${e.you ? 'you' : ''}"><span class="rk">${e.rank}</span><span class="av">${e.avatar}</span><span class="nm">${esc(e.name)}<small>${flag(e.country)}</small></span><span class="v">${fmt(e.v)} <small class="muted">${unit}</small></span></li>`).join('')
      : '<li class="rank-empty">Nobody here yet. Finish a match to claim the top spot.</li>';
    el.you.textContent = b.you ? `You're #${b.you.rank} of ${fmt(b.total)} with ${fmt(b.you.v)} ${unit}.` : b.entries.length ? "You're not on this board yet." : '';
  }

  return { setup, setCountry, request, onBoard };
}

export function regionName(cc) {
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(cc); } catch { return cc; }
}
