// Boot + wiring: one socket, five pages (home, categories, friends, rankings,
// profile) and two live screens (table, solo), switched by the hash router.
import { $, $$, esc, fmt, toast } from './ui.js';
import { Net } from './net.js';
import * as Bank from './bank.js';
import { sfx, isMuted, setMuted } from './sfx.js';
import { createTable, MODE_NAME, CULTURE_NAME } from './table.js';
import { createSolo } from './solo.js';
import { createRanks, regionName } from './ranks.js';
import { go, onRoute, guard, parse } from './router.js';
import { setupEmbed } from './embed.js';

const COUNTRIES = 'AE AF AL AM AO AR AT AU AZ BA BD BE BG BH BO BR BY CA CH CL CM CN CO CR CU CY CZ DE DK DO DZ EC EE EG ES ET FI FR GB GE GH GR GT HK HN HR HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KR KW KZ LB LK LT LU LV LY MA MD ME MK MM MN MT MU MX MY NG NI NL NO NP NZ OM PA PE PH PK PL PS PT PY QA RO RS RU RW SA SD SE SG SI SK SN SO SV SY TH TJ TN TR TT TW TZ UA UG US UY UZ VE VN YE ZA ZM ZW'.split(' ');
const PLAY_MODES = ['crowd', 'mind', 'auction', 'solo'];

const net = new Net();
// live: which live screen has a game on ('table' | 'solo' | null); newMode: the Friends page's choice
let savedCulture = 'mix';
try { savedCulture = localStorage.getItem('pp.culture') || 'mix'; } catch {}
let savedRounds = 3;
try { savedRounds = Number(localStorage.getItem('pp.rounds')) || 3; } catch {}
const app = { profile: null, catalogue: [], avatars: [], unlocks: {}, newMode: 'crowd', live: null, topicsPerMatch: 3, culture: ['desi', 'global', 'mix'].includes(savedCulture) ? savedCulture : 'mix', rounds: [1, 2, 3].includes(savedRounds) ? savedRounds : 3 };
// how many topics the next match plays: the chosen length, never above the server's maximum
const limit = () => Math.max(1, Math.min(app.rounds, app.topicsPerMatch));

const achievement = (id) => app.catalogue.find((a) => a.id === id) || null;

const table = createTable(net, {
  achievement,
  toast,
  quick: (mode) => net.send({ type: 'quick', mode }),
  home: () => { net.send({ type: 'leave' }); leaveLive(); },
});
const solo = createSolo(net, {
  achievement,
  toast,
  home: () => leaveLive(),
  profile: (p, unlocked) => { setProfile(p); announce(unlocked); },
});
const ranks = createRanks(net);

/* ---------- routing ---------- */
guard((name) => app.live === name);
onRoute((r) => {
  // the pill that brings you back to a running game when you wander off to a page
  const pill = $('#return-pill');
  pill.hidden = !(app.live && r.name !== app.live);
  pill.href = `#/${app.live || ''}`;
  pill.textContent = app.live === 'solo' ? 'Back to your run' : 'Back to your table';
  if (r.name === 'categories') { setCatMode(PLAY_MODES.includes(r.param) ? r.param : null); }
  if (r.name === 'rankings' && net.open) ranks.request();
  if (r.name === 'profile') renderProfileForm();
});

function leaveLive() {
  table.reset();
  app.live = null;
  go('');
}

function startLive(name) {
  app.live = name;
  go(name);
}

/* ---------- profile ---------- */
function setProfile(p) {
  app.profile = p;
  $('#me-av').textContent = p.avatar;
  $('#me-name').textContent = p.name;
  $('#me-points').textContent = `${fmt(p.points)} points`;
  $('#streak-days').textContent = p.streak.cur;
  $('#solo-best').textContent = fmt(p.soloBest);
  $('#st-points').textContent = fmt(p.points);
  $('#st-streak').textContent = p.streak.cur;
  $('#st-matches').textContent = fmt(p.matches || 0);
  $('#st-wins').textContent = fmt(p.wins || 0);
  $('#st-solo').textContent = fmt(p.soloBest);
  renderAchievements();
  if (!$('#profile').hidden) renderProfileForm();
}

function announce(ids = []) {
  for (const id of ids) { const a = achievement(id); if (a) toast(`${a.icon} Achievement: ${a.name}`); }
}

function renderAchievements() {
  if (!app.profile || !app.catalogue.length) return;
  const got = new Set(app.profile.ach);
  $('#ach-count').textContent = `${got.size} of ${app.catalogue.length}`;
  $('#ach-grid').innerHTML = app.catalogue.map((a) => `<li class="${got.has(a.id) ? 'got' : ''}"><span class="ai">${a.icon}</span><span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span></li>`).join('');
}

// The Profile page edits the card in place; the form is filled from the current profile.
function renderProfileForm() {
  if (!app.profile) return;
  const p = app.profile;
  if (document.activeElement !== $('#pf-name')) $('#pf-name').value = p.name;
  const sel = $('#pf-country');
  sel.innerHTML = '<option value="">Prefer not to say</option>' + COUNTRIES
    .map((c) => [c, regionName(c)]).sort((a, b) => a[1].localeCompare(b[1]))
    .map(([c, n]) => `<option value="${c}" ${c === p.country ? 'selected' : ''}>${esc(n)}</option>`).join('');
  const got = new Set(p.ach);
  $('#pf-avatars').innerHTML = app.avatars.map((a) => {
    const need = app.unlocks[a];
    const locked = need && !got.has(need);
    const lockTitle = locked ? `Unlock with "${(achievement(need) || {}).name}"` : a;
    return `<button type="button" data-av="${a}" aria-pressed="${a === p.avatar}" ${locked ? 'disabled' : ''} title="${esc(lockTitle)}">${a}</button>`;
  }).join('');
}
$('#pf-avatars').addEventListener('click', (e) => {
  const b = e.target.closest('[data-av]');
  if (!b || b.disabled) return;
  $$('#pf-avatars button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
});
$('#profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const av = $('#pf-avatars [aria-pressed="true"]');
  net.send({ type: 'profile', name: $('#pf-name').value, country: $('#pf-country').value, avatar: av ? av.dataset.av : undefined });
});

/* ---------- culture: Desi, Global or Mix, remembered in this browser ---------- */
const CULTURE_HINT = {
  desi: 'Desi: biryani, Babar Azam, Atif Aslam, Eid and shaadi packs, plus the packs that belong to everyone.',
  global: 'Global: NBA, Disney, Fortnite, rap albums and the rest of the world, plus the packs that belong to everyone.',
  mix: 'Mix: everything, including the packs that blend both, like Comfort food and Singers.',
};
function setCulture(c) {
  app.culture = c;
  try { localStorage.setItem('pp.culture', c); } catch {}
  for (const b of $$('[data-culture]')) if (b.closest('.culture-seg') || b.closest('#culture')) b.setAttribute('aria-checked', String(b.dataset.culture === c));
  $('#culture-hint').textContent = CULTURE_HINT[c];
  cats.picks = cats.picks.filter((id) => Bank.inCulture(id, c));
  renderCats();
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('#culture [data-culture], .culture-seg [data-culture]');
  if (!b || b.closest('#lobby')) return;
  setCulture(b.dataset.culture);
});

/* ---------- match length: 1, 2 or 3 topics, remembered in this browser ---------- */
function setRounds(n) {
  app.rounds = Math.max(1, Math.min(3, Number(n) || 3));
  try { localStorage.setItem('pp.rounds', String(app.rounds)); } catch {}
  for (const b of $$('.rounds-seg [data-rounds]')) b.setAttribute('aria-checked', String(Number(b.dataset.rounds) === app.rounds));
  cats.picks = cats.picks.slice(0, limit());
  renderCats();
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('.rounds-seg [data-rounds]');
  if (!b || b.closest('#lobby')) return;
  setRounds(b.dataset.rounds);
});

/* ---------- categories: pick a mode, then a category, and play ---------- */
const CATS_PREVIEW = 12;
// picks: the topics chosen for the next match, in play order (up to app.topicsPerMatch)
const cats = { all: false, q: '', picks: [], mode: null };
const playDlg = $('#play');
const catMatches = (tp, q) => !q || tp.t.toLowerCase().includes(q) || tp.o.some((o) => o[0].toLowerCase().includes(q));
const MODE_PITCH = {
  crowd: 'Crowd pleaser: pick up to three topics in the order you want them, then play.',
  mind: 'Mind reader: pick up to three topics in the order you want them, then play.',
  auction: 'Auction: pick up to three topics in the order you want them, then play.',
  solo: 'Crowd read: pick the topics to start your run on, in order.',
};

function setCatMode(mode) {
  cats.mode = mode;
  for (const b of $$('#cat-mode [data-mode]')) b.setAttribute('aria-checked', String(b.dataset.mode === mode));
  $('#cats-sub').textContent = mode ? MODE_PITCH[mode] : 'Pick up to three topics in the order you want them, then choose how to play.';
  renderCats();
}

// The bar under the grid: the picks as chips (tap to drop), ghost slots for what fate fills, and Play.
function renderPicksBar() {
  const bar = $('#picks-bar');
  const n = limit();
  bar.hidden = !cats.picks.length;
  if (bar.hidden) return;
  const chips = cats.picks.map((id, i) => { const tp = Bank.topic(id); return tp ? `<button type="button" class="pick-chip" data-id="${id}" aria-label="Remove ${esc(tp.t)}"><small>${i + 1}</small><i aria-hidden="true">${tp.e}</i>${esc(tp.t)}<span aria-hidden="true">×</span></button>` : ''; });
  for (let i = cats.picks.length; i < n; i++) chips.push(`<span class="pick-chip ghost"><small>${i + 1}</small>🎲 random</span>`);
  const label = cats.mode === 'solo' ? 'Play solo' : cats.mode ? `Play ${MODE_NAME[cats.mode]}` : 'Choose how to play';
  bar.innerHTML = `<div class="pick-chips">${chips.join('')}</div>
    <div class="pick-actions"><button type="button" class="btn btn-quiet btn-sm" data-act="clear">Clear</button><button type="button" class="btn btn-go" data-act="play">${label}</button></div>`;
}
$('#picks-bar').addEventListener('click', (e) => {
  const chip = e.target.closest('.pick-chip[data-id]');
  if (chip) { cats.picks = cats.picks.filter((id) => id !== chip.dataset.id); renderCats(); return; }
  const b = e.target.closest('[data-act]');
  if (!b) return;
  if (b.dataset.act === 'clear') { cats.picks = []; renderCats(); }
  if (b.dataset.act === 'play') { if (cats.mode) play(cats.mode, cats.picks); else openPlaySheet(); }
});

function openPlaySheet() {
  const first = Bank.topic(cats.picks[0]);
  if (!first) return;
  const names = cats.picks.map((id) => (Bank.topic(id) || {}).t).filter(Boolean);
  $('#play-emoji').textContent = first.e;
  $('#play-title').textContent = names.length > 1 ? names.join(', ') : names[0];
  playDlg.showModal();
}

function renderCats() {
  const ids = Bank.ids().filter((id) => Bank.inCulture(id, app.culture));
  const grid = $('#cat-grid');
  const more = $('#cats-more');
  if (!ids.length) { grid.innerHTML = '<p class="muted">Loading categories…</p>'; more.hidden = true; return; }
  const q = cats.q.trim().toLowerCase();
  let shown = 0;
  const surprise = cats.mode && !q && !cats.picks.length ? `<button type="button" class="cat cat-surprise" data-id=""><i aria-hidden="true">🎲</i><b>Surprise me</b><small>Random topics</small></button>` : '';
  grid.innerHTML = surprise + ids.map((id) => Bank.topic(id)).map((tp) => {
    const k = cats.picks.indexOf(tp.id);
    const visible = catMatches(tp, q) && (k >= 0 || cats.all || q || shown < CATS_PREVIEW);
    if (visible) shown++;
    return `<button type="button" class="cat ${k >= 0 ? 'is-picked' : ''}" data-id="${tp.id}" aria-pressed="${k >= 0}" ${visible ? '' : 'hidden'}><i aria-hidden="true">${tp.e}</i><b>${esc(tp.t)}</b>${k >= 0 ? `<span class="cat-no">${k + 1}</span>` : ''}</button>`;
  }).join('');
  renderPicksBar();
  if (q && !shown) grid.innerHTML = '<p class="muted">No category matches that. Try a food, a sport, a show…</p>';
  more.hidden = !!q;
  more.textContent = cats.all ? 'Show fewer' : `Show all ${ids.length} categories`;
  more.setAttribute('aria-expanded', String(cats.all));
  // the Friends page's first-topic picker shares the bank
  const sel = $('#friends-topic');
  const keep = sel.value;
  sel.innerHTML = '<option value="">Surprise me</option>' + ids.map((id) => Bank.topic(id)).sort((a, b) => a.t.localeCompare(b.t)).map((tp) => `<option value="${tp.id}">${tp.e} ${esc(tp.t)}</option>`).join('');
  if (ids.includes(keep)) sel.value = keep;
}

// Start a game in a chosen mode on a list of topics (empty = all random).
function play(mode, topics = []) {
  const list = topics.slice(0, limit());
  cats.picks = [];
  renderCats();
  if (mode === 'solo') { startLive('solo'); solo.start(list, (id) => Bank.inCulture(id, app.culture)); return; }
  sfx.other();
  net.send({ type: 'quick', mode, topics: list, culture: app.culture, rounds: limit() });
}

$('#cat-mode').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mode]');
  if (!b) return;
  go(`categories/${b.dataset.mode}`, true);
});
$('#cat-search').addEventListener('input', (e) => { cats.q = e.target.value; renderCats(); });
$('#cats-more').addEventListener('click', () => { cats.all = !cats.all; renderCats(); if (!cats.all) $('#categories').scrollIntoView({ block: 'start', behavior: 'smooth' }); });
$('#cat-grid').addEventListener('click', (e) => {
  const b = e.target.closest('.cat');
  if (!b) return;
  if (!b.dataset.id) return play(cats.mode, []); // Surprise me
  const tp = Bank.topic(b.dataset.id);
  if (!tp) return;
  const k = cats.picks.indexOf(tp.id);
  if (k >= 0) cats.picks.splice(k, 1);
  else if (cats.picks.length >= limit()) return toast(limit() === 1 ? 'A one-topic match takes one pick. Drop it to swap, or choose a longer match.' : `${limit()} topics is the limit for this match length. Drop one to swap it.`, 'err');
  else cats.picks.push(tp.id);
  sfx.other();
  renderCats();
});
playDlg.addEventListener('click', (e) => {
  const b = e.target.closest('[data-play]');
  if (!b) { if (e.target === playDlg) playDlg.close(); return; } // tap the backdrop to dismiss
  const act = b.dataset.play, topics = cats.picks.slice();
  playDlg.close();
  if (act === 'quick-crowd') play('crowd', topics);
  if (act === 'quick-mind') play('mind', topics);
  if (act === 'quick-auction') play('auction', topics);
  if (act === 'create') { cats.picks = []; renderCats(); net.send({ type: 'create', mode: app.newMode, topics, culture: app.culture, rounds: limit() }); }
  if (act === 'solo') play('solo', topics);
});

/* ---------- friends ---------- */
$$('[data-newmode]').forEach((b) => b.addEventListener('click', () => {
  app.newMode = b.dataset.newmode;
  $$('[data-newmode]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
}));
$('#create-btn').addEventListener('click', () => net.send({ type: 'create', mode: app.newMode, topics: $('#friends-topic').value ? [$('#friends-topic').value] : [], culture: app.culture, rounds: limit() }));
$('#join-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const code = $('#join-code').value.trim().toUpperCase();
  if (code.length !== 5) return toast('Table codes are five characters long.', 'err');
  net.send({ type: 'join', code });
});

/* ---------- live screens ---------- */
$('#t-leave').addEventListener('click', () => { net.send({ type: 'leave' }); leaveLive(); });

function syncMute() {
  for (const b of $$('.mute-btn')) {
    b.textContent = isMuted() ? '🔇' : '🔊';
    b.setAttribute('aria-pressed', String(isMuted()));
    b.setAttribute('aria-label', isMuted() ? 'Unmute sounds' : 'Mute sounds');
  }
}
$$('.mute-btn').forEach((b) => b.addEventListener('click', () => { setMuted(!isMuted()); syncMute(); }));
syncMute();

/* ---------- hero: the one orchestrated moment ---------- */
(function heroFan() {
  const cards = [
    { e: '🌀', n: 'Teleportation', no: 1 }, { e: '🥭', n: 'Mango', no: 2 }, { e: '🫖', n: 'Karak chai', no: 3 },
    { e: '🐉', n: 'Dragon', no: 4 }, { e: '📠', n: 'Fax machine', dud: true },
  ];
  const fan = $('#hero-fan');
  fan.innerHTML = cards.map((c, i) => {
    const k = i - 2;
    return `<div class="fan-card deal ${c.dud ? 'is-dud' : ''}" style="--rot:${k * 7}deg;--dx:${k * 56}%;--delay:${120 + i * 90}ms">${c.no ? `<span class="pickno">#${c.no}</span>` : ''}<i>${c.e}</i><b>${c.n}</b></div>`;
  }).join('');
})();

/* ---------- socket events ---------- */
net.on('status', (s) => {
  const c = $('#conn');
  c.dataset.state = s;
  c.textContent = s === 'open' ? 'Online' : s === 'down' ? 'Connection lost. Reconnecting…' : 'Connecting…';
});

net.on('welcome', (m) => {
  app.catalogue = m.catalogue;
  app.avatars = m.avatars;
  app.unlocks = m.avatarUnlocks;
  app.topicsPerMatch = m.topicsPerMatch || 3;
  setRounds(app.rounds);
  setProfile(m.profile);
  ranks.setup(m.boards, m.profile.country);
  if (parse().name === 'rankings') ranks.request();
  Bank.want(m.bankVersion);
  Bank.ensure().then(renderCats, () => {});
  if (m.visit && m.visit.extended && m.visit.streak > 1) toast(`🔥 ${m.visit.streak}-day streak. See you tomorrow.`);
  announce(m.visit && m.visit.unlocked);
  const join = new URLSearchParams(location.search).get('join');
  if (join) {
    history.replaceState(null, '', location.pathname + location.hash);
    net.send({ type: 'join', code: join });
  }
});

net.on('profile', (m) => { setProfile(m.profile); ranks.setCountry(m.profile.country); toast('Player card saved'); });

net.on('room', (m) => {
  if (app.live !== 'table') startLive('table');
  table.onRoom(m.room, m.ev);
});

net.on('room_closed', (m) => {
  if (app.live !== 'table') return;
  if (table.onClosed(m.reason)) return;
  if (m.reason === 'closed') toast('The table closed.');
  leaveLive();
});

net.on('result', (m) => {
  table.onResult(m);
  setProfile(m.profile);
  announce(m.unlocked);
});

net.on('emote', (m) => table.onEmote(m));
net.on('board', (m) => ranks.onBoard(m));
net.on('bank', (m) => Bank.want(m.v));
net.on('error', (m) => toast(m.msg, 'err'));

Bank.ensure().then(renderCats, () => {});
setCulture(app.culture);
setRounds(app.rounds);
setCatMode(PLAY_MODES.includes(parse().param) && parse().name === 'categories' ? parse().param : null);
go(parse().name ? location.hash.slice(2) : '', true);
setupEmbed(net);
net.connect();

