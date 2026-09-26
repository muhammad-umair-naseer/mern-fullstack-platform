import { flag } from './countries.js';
import { escapeHtml } from './ui.js';
import { avatarFor } from './avatars.js';

/**
 * Worldwide ranking boards: category tabs (points / speed / combo / wins /
 * streak / golden), a time window where the category supports one, and a
 * global-or-your-country scope toggle. The server sends the category list, so
 * adding a board server-side needs no client change. On the Rankings page the
 * category tabs sit in the page header (`tabsRoot`) and the top three stand on
 * a podium (`podiumRoot`).
 */
const FORMAT = {
  points: (v) => v.toLocaleString(),
  score: (v) => v.toLocaleString(),
  percent: (v) => `${v}%`,
  count: (v) => v.toLocaleString(),
  combo: (v) => `${v}x`,
  wins: (v) => `${v} ${v === 1 ? 'win' : 'wins'}`,
  streak: (v) => `${v}🔥`,
};

export class Boards {
  constructor(root, { onRequest, tabsRoot = null, podiumRoot = null }) {
    this.root = root;
    this.tabsRoot = tabsRoot;
    this.podiumRoot = podiumRoot;
    this.onRequest = onRequest;
    this.sig = '';
    this.podiumSig = '';
    this.meta = null;
    this.country = 'UN';
    this.sel = { category: 'points', window: 'all', scope: 'global' };
    this.data = null;
    this.myId = null;

    const onClick = (e) => {
      const btn = e.target.closest('[data-cat], [data-win], [data-scope]');
      if (!btn) return;
      if (btn.dataset.cat) {
        this.sel.category = btn.dataset.cat;
        const cat = this.category();
        if (cat && !cat.windows.includes(this.sel.window)) this.sel.window = 'all';
      }
      if (btn.dataset.win) this.sel.window = btn.dataset.win;
      if (btn.dataset.scope) this.sel.scope = btn.dataset.scope;
      this.request();
      this.render();
    };
    root.addEventListener('click', onClick);
    if (tabsRoot) tabsRoot.addEventListener('click', onClick);
  }

  category() { return this.meta?.categories.find((c) => c.id === this.sel.category); }

  setMeta(meta) { this.meta = meta; this.render(); }
  setCountry(cc) {
    const changed = this.country !== cc;
    this.country = cc || 'UN';
    if (changed && this.sel.scope !== 'global') this.sel.scope = this.country;
    this.render();
  }
  setMyId(id) { this.myId = id; }

  request() {
    const scope = this.sel.scope === 'global' ? 'global' : this.country;
    this.onRequest({ category: this.sel.category, window: this.sel.window, scope });
  }

  /** Board data arrived from the server. */
  setData(msg) {
    if (msg.category !== this.sel.category) return;   // a stale reply
    const sig = JSON.stringify([msg.category, msg.window, msg.scope, msg.total, msg.entries, msg.me]);
    if (sig === this.sig && this.data) return;        // a push with nothing new: leave the rows alone
    this.sig = sig;
    this.data = msg;
    this.render();
  }

  render() {
    if (!this.meta) {
      this.root.innerHTML = '<div class="board-empty">Connecting to the ranking server…</div>';
      this.renderPodium(null, null);
      return;
    }
    const cat = this.category() || this.meta.categories[0];
    const fmt = FORMAT[cat.format] || ((v) => v);
    const tabs = this.meta.categories.map((c) => `
      <button class="tab ${c.id === this.sel.category ? 'on' : ''}" data-cat="${c.id}">${escapeHtml(c.label)}</button>`).join('');
    const wins = cat.windows.length > 1 ? `<div class="chips">${cat.windows.map((w) => `
      <button class="chip-btn ${w === this.sel.window ? 'on' : ''}" data-win="${w}">${escapeHtml(this.meta.windows[w] || w)}</button>`).join('')}</div>` : '';
    const scopes = `<div class="chips">
      <button class="chip-btn ${this.sel.scope === 'global' ? 'on' : ''}" data-scope="global">🌍 Global</button>
      <button class="chip-btn ${this.sel.scope !== 'global' ? 'on' : ''}" data-scope="${this.country}">${flag(this.country)} My country</button>
    </div>`;

    const d = this.data;
    let rows;
    if (!d) {
      rows = '<div class="board-empty">Loading…</div>';
    } else if (!d.entries.length) {
      rows = '<div class="board-empty">Nobody on this board yet. Finish a match and the top spot is yours.</div>';
    } else {
      rows = `<ol class="board-list">${d.entries.map((r) => this.row(r, fmt)).join('')}</ol>`;
      if (d.me && !d.inTop) rows += `<div class="board-me-out"><ol class="board-list">${this.row(d.me, fmt)}</ol></div>`;
      if (!d.me) rows += '<div class="board-empty small">You\'re not on this board yet — one match puts you on it.</div>';
    }
    const count = d ? `<span class="board-count">${d.total.toLocaleString()} player${d.total === 1 ? '' : 's'}${cat.note ? ' · ' + escapeHtml(cat.note) : ''}</span>` : '';

    if (this.tabsRoot) {
      this.tabsRoot.innerHTML = `<div class="tabs" role="group" aria-label="Board">${tabs}</div>`;
      this.root.innerHTML = `<div class="board-filters">${wins}${scopes}${count}</div>${rows}`;
    } else {
      this.root.innerHTML = `<div class="tabs">${tabs}</div><div class="board-filters">${wins}${scopes}${count}</div>${rows}`;
    }
    this.renderPodium(d, fmt);
  }

  /** The top three on plinths. Re-drawn only when the three change, so their entrance plays for news, not for every push. */
  renderPodium(d, fmt) {
    const root = this.podiumRoot;
    if (!root) return;
    const top = d ? d.entries.slice(0, 3) : [];
    const sig = d ? JSON.stringify([d.category, d.window, d.scope, top.map((r) => [r.id, r.value, r.name])]) : 'none';
    if (sig === this.podiumSig) return;
    this.podiumSig = sig;
    const slot = (r, place) => {
      if (!r) return `<div class="rk-slot p${place} empty"><span class="rk-av"></span><span class="rk-name">Open</span><span class="rk-val">–</span><span class="rk-block"><b>${place}</b></span></div>`;
      const av = avatarFor(r.avatar);
      const me = r.id === this.myId;
      return `<div class="rk-slot p${place} ${me ? 'me' : ''}" style="--c:${av.color}"><span class="rk-av">${av.emoji}</span><span class="rk-name">${flag(r.country)} ${escapeHtml(r.name)}${me ? ' <em>you</em>' : ''}</span><span class="rk-val">${fmt(r.value)}</span><span class="rk-block"><b>${place}</b></span></div>`;
    };
    root.classList.toggle('is-empty', !top.length);
    root.innerHTML = `${slot(top[1], 2)}${slot(top[0], 1)}${slot(top[2], 3)}`;
  }

  row(r, fmt) {
    const me = r.id === this.myId;
    const medal = r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank;
    return `<li class="${me ? 'me' : ''}">
      <span class="b-rank ${r.rank <= 3 ? 'top' : ''}">${medal}</span>
      <span class="b-flag">${flag(r.country)}</span>
      <span class="b-name">${escapeHtml(r.name)}${me ? ' <em>you</em>' : ''}</span>
      ${r.streak > 1 ? `<span class="b-streak" title="${r.streak}-day streak">🔥${r.streak}</span>` : ''}
      <span class="b-value">${fmt(r.value)}</span>
    </li>`;
  }
}
