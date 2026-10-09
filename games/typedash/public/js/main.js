import { Net } from './net.js';
import { ServerClock } from './clock.js';
import { Interpolator } from './interp.js';
import { Track } from './track.js';
import { TypingArea } from './typing.js';
import { Background } from './background.js';
import { Confetti } from './confetti.js';
import { Sound } from './audio.js';
import { RaceGame } from './game.js';
import { Account, pointsForLevel } from './account.js';
import { SKINS } from './skins.js';
import { carSvg, paint, SHOWROOM } from './cars.js';
import { COUNTRIES, flag, detectCountry } from './countries.js';
import { $, escapeHtml, fmtTime, toast, medal, holdPopups, whenFree } from './ui.js';
import { Solo, PACERS } from './solo.js';
import { DailyCard } from './daily.js';
import { ShareDialog } from './share.js';
import { TeamCard } from './team.js';
import { PushReminders } from './push.js';
import { Router, appPageOf } from './router.js';
import { mountChrome, setActiveNav, setAwardCount } from './nav.js';
import { cxAuth } from './cx-auth.js';
import { tellSiteTyping, onSiteKey, revealToSite } from './site-keys.js';

/* ------------------------------------------------------------------ tuning */

const INTERP_DELAY_MS = 150; // render remote racers this far behind server time (1.5 ticks)
const SEND_INTERVAL_MS = 40; // max progress upload rate (25 Hz)
const GO_FLASH_MS = 800;

/* ---------------------------------------------------------------- modules */

const net = new Net();
const clock = new ServerClock(net);
const sound = new Sound();
const bg = new Background($('#bg'));
const confetti = new Confetti($('#confetti'));
mountChrome({ app: true });   // navbar, account control, phone menu and footer (js/nav.js)
const track = new Track($('#track'));
const typing = new TypingArea($('#passage'), $('#hidden-input'));
const game = new RaceGame();
const account = new Account();

/* ------------------------------------------------------------------ state */

const S = {
  myId: null,
  room: null,
  passage: '',
  players: new Map(),
  interp: new Map(),
  local: { correct: 0, typed: 0, keystrokes: 0, errors: 0, done: false, vis: 0 },
  myFinish: null,
  lastSendAt: 0,
  sendTimer: null,
  lastCd: null,
  goUntil: 0,
  lastFrame: performance.now(),
  pending: null,       // action to run once the socket is open
  hadSession: false,   // were we in a room when the socket dropped?
  unreadChat: 0,
  nitroShown: false,   // local nitro state currently reflected on the track
  lastScoreShown: -1,
  lastComboShown: -1,
  emotesRendered: false,
  lastRevAt: 0,
  lastResultId: null,  // the settled result the Share button publishes
  closesAt: null,      // server time the race ends, once the first racer is home
  firstHome: null,     // that racer's name
  endClock: '',        // what the race clock last showed
};

/** Touch devices need the keyboard raised inside a tap, and a layout that survives the keyboard. */
const IS_TOUCH = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0;
if (IS_TOUCH) document.body.classList.add('touch');

/** The local racer's id: the socket id in a room, or the id a practice run was started with. */
const myId = () => (S.room && S.room.solo ? S.room.meId : S.myId);

const el = {
  home: $('#screen-home'),
  race: $('#screen-race'),
  name: $('#name'),
  country: $('#country'),
  flagPrev: $('#flag-preview'),
  code: $('#code'),
  online: $('#online'),
  ping: $('#ping'),
  pingPill: $('#ping-pill'),
  rivals: $('#rivals'),
  rankChips: $('#rank-chips'),
  streakBox: $('#streak-box'),
  streakFlame: $('#streak-flame'),
  streakDays: $('#streak-days'),
  streakSub: $('#streak-sub'),
  streakWeek: $('#streak-week'),
  series: $('#series'),
  roomCode: $('#room-code'),
  roomType: $('#room-type'),
  status: $('#status'),
  seats: $('#seats'),
  hostBar: $('#host-bar'),
  botsCheck: $('#bots-check'),
  trackWrap: $('#track-wrap'),
  hudWpm: $('#hud-wpm'),
  hudAcc: $('#hud-acc'),
  hudCombo: $('#hud-combo'),
  hudMult: $('#hud-mult'),
  comboStat: $('#combo-stat'),
  hudScore: $('#hud-score'),
  nitroStat: $('#nitro-stat'),
  nitroFill: $('#nitro-fill'),
  nitroLabel: $('#nitro-label'),
  countdown: $('#countdown'),
  cdNum: $('#cd-num'),
  cdSub: $('#cd-sub'),
  passageWrap: $('#passage-wrap'),
  focusOverlay: $('#focus-overlay'),
  finishBanner: $('#finish-banner'),
  callouts: $('#callouts'),
  emoteBar: $('#emote-bar'),
  results: $('#results'),
  resultsTitle: $('#results-title'),
  podium: $('#podium'),
  resultsBody: $('#results-body'),
  nextRace: $('#next-race'),
  myRace: $('#my-race'),
  mrScore: $('#mr-score'),
  mrCombo: $('#mr-combo'),
  mrNitro: $('#mr-nitro'),
  mrGolden: $('#mr-golden'),
  mrXp: $('#mr-xp'),
  mrLevel: $('#mr-level'),
  mrXpFill: $('#mr-xp-fill'),
  mrXpText: $('#mr-xp-text'),
  mrUnlocks: $('#mr-unlocks'),
  levelup: $('#levelup'),
  levelupNum: $('#levelup-num'),
  levelupTitle: $('#levelup-title'),
  levelupSkins: $('#levelup-skins'),
  chat: $('#chat'),
  chatToggle: $('#chat-toggle'),
  chatLog: $('#chat-log'),
  chatInput: $('#chat-input'),
  connBanner: $('#conn-banner'),
  soundBtn: $('#sound-btn'),
  profLevel: $('#prof-level'),
  profTitle: $('#prof-title'),
  levelRing: $('#level-ring'),
  xpFill: $('#xp-fill'),
  xpText: $('#xp-text'),
  stPoints: $('#st-points'),
  stRaces: $('#st-races'),
  stWins: $('#st-wins'),
  stWpm: $('#st-wpm'),
  mrRanks: $('#mr-ranks'),
  mrSeries: $('#mr-series'),
  garage: $('#garage'),
  garageHint: $('#garage-hint'),
  achGrid: $('#ach-grid'),
  pacer: $('#pacer'),
  lang: $('#lang'),
  mode: $('#mode'),
  btnSolo: $('#btn-solo'),
  resultsTable: $('#results-table'),
  soloResults: $('#solo-results'),
  btnResultsStay: $('#btn-results-stay'),
  btnResultsLeave: $('#btn-results-leave'),
  btnSoloAgain: $('#btn-solo-again'),
  btnSoloWorld: $('#btn-solo-world'),
  btnSoloNext: $('#btn-solo-next'),
  lockNotice: $('#lock-notice'),
  dailyCard: $('#daily-card'),
  btnShare: $('#btn-share'),
  btnShareProfile: $('#btn-share-profile'),
  site: $('#screen-site'),
  dock: $('#race-dock'),
  dockText: $('#race-dock-text'),
  profCar: $('#prof-car'),
  garageCar: $('#garage-car'),
  garageName: $('#garage-name'),
  garageBlurb: $('#garage-blurb'),
};

/* ------------------------------------------------------------- home setup */

// the country lists: "Racing for" on your stats page and on the sign-in page
const siCountry = $('#si-country');
for (const sel of [el.country, siCountry]) {
  for (const [code, name] of COUNTRIES) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = name;   // the flag lives in the .flag-preview beside the select
    sel.appendChild(opt);
  }
}
const savedName = localStorage.getItem('td_name') || '';
el.name.value = savedName && savedName !== 'Guest' ? savedName : cxAuth.state.status === 'signed-in' ? cxAuth.state.name : '';
/** Select a country in both lists, adding it first if a list does not carry it. */
function setCountry(code) {
  const cc = /^[A-Z]{2}$/.test(code || '') ? code : 'UN';
  for (const sel of [el.country, siCountry]) {
    if (![...sel.options].some((o) => o.value === cc)) {
      const opt = document.createElement('option');
      opt.value = cc;
      opt.textContent = cxAuth.countryName(cc);
      sel.insertBefore(opt, sel.lastElementChild);
    }
    sel.value = cc;
  }
  el.flagPrev.textContent = flag(cc);
  $('#si-flag').textContent = flag(cc);
}
const known = cxAuth.state.country;
setCountry(localStorage.getItem('td_country') || (known && known !== 'UN' ? known : '') || cxAuth.guessCountry() || detectCountry());
el.code.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#btn-join').click(); });
el.code.addEventListener('input', () => { el.code.value = el.code.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });

const hashCode = location.hash.replace('#', '').trim().toUpperCase();
if (/^[A-Z0-9]{4,6}$/.test(hashCode)) {
  el.code.value = hashCode;
  el.code.classList.add('pulse');
  toast(`Room code ${hashCode} filled in — pick a name and hit Join`, 'info', 5000);
}

const paintSound = (on) => {
  el.soundBtn.innerHTML = `<svg class="i" aria-hidden="true"><use href="#i-${on ? 'volume' : 'volume-x'}"/></svg>`;
  el.soundBtn.setAttribute('aria-pressed', String(on));
  el.soundBtn.title = on ? 'Sound on' : 'Sound off';
};
paintSound(sound.enabled);
el.soundBtn.addEventListener('click', () => paintSound(sound.toggle()));

/* ------------------------------------------------------- screens (pages) */

// Every page of the game is a screen in this one document, so a lobby keeps
// its socket while you look around. js/router.js owns the addresses
// (/app, /app/profile, /app/garage, /app/team, /app/awards and the site's own
// pages, fetched into #screen-site) and calls showScreen() to put one up.
const SCREENS = ['home', 'profile', 'garage', 'team', 'badges', 'signin', 'site', 'race'];
const screenEl = (p) => document.getElementById(`screen-${p}`);
const NAV_KEY = { home: 'app', race: 'app', profile: 'profile', garage: 'garage', team: 'team', badges: 'badges', signin: 'signin' };
const HOME_TITLE = document.title;
let currentScreen = SCREENS.find((p) => screenEl(p).classList.contains('active')) || 'home';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Put one screen up. `site` pages set their own title and nav item (the router does that). */
function showScreen(name) {
  currentScreen = name;
  for (const p of SCREENS) screenEl(p).classList.toggle('active', p === name);
  document.body.classList.toggle('in-race', name === 'race');   // the starfield only comes forward on the track
  if (name === 'race') requestAnimationFrame(() => track.measure());
  if (name !== 'site') {
    setActiveNav(NAV_KEY[name] || '');
    document.title = name === 'race' ? `${S.room && S.room.solo ? 'On your own' : 'Race'} · TypeDash` : screenEl(name).dataset.title || HOME_TITLE;
  }
  renderDock();
}

/** A live room you have stepped away from: a pill that takes you back to it. */
function renderDock() {
  const live = S.room && !S.room.solo;
  el.dock.hidden = !live || currentScreen === 'race';
  if (el.dock.hidden) return;
  const st = S.room.state;
  el.dockText.textContent = st === 'finished' ? 'Your race just finished' : S.room.isPrivate ? `You are in game ${S.room.code}` : `You are in a race lobby, ${S.room.players.length} of ${S.room.maxPlayers}`;
}

/**
 * Count a number up to its final value — only for the figure the player cares
 * about. While any number is counting, <html data-counting> is set, so anything
 * reading the page (a test, a screenshot run) can wait for the settled value.
 */
let counting = 0;
function countTo(node, value, format = (v) => String(v)) {
  const end = Number(value) || 0;
  if (reducedMotion.matches || end <= 0) { node.textContent = format(end); return; }
  const dur = 700;            // --dur-hero
  const t0 = performance.now();
  counting++;
  document.documentElement.dataset.counting = '1';
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 4);   // matches --ease-out-expo closely enough
    node.textContent = format(k < 1 ? Math.round(end * eased) : end);
    if (k < 1) { requestAnimationFrame(step); return; }
    if (--counting === 0) delete document.documentElement.dataset.counting;
  };
  node.textContent = format(0);
  requestAnimationFrame(step);
}

// "Paragraphs in English": the language, mode and robot picker behind it opens on request.
// Who you are (name, country, account) lives on the sign-in page and on your stats page.
const btnOptions = $('#btn-options');
function renderIdentity() {
  const lang = el.lang.selectedOptions[0] ? el.lang.selectedOptions[0].textContent : 'English';
  const mode = el.mode.selectedOptions[0] ? el.mode.selectedOptions[0].textContent : 'Prose';
  $('#identity-text').innerHTML = `Paragraphs in <b>${escapeHtml(lang)}</b>${el.mode.value && el.mode.value !== 'prose' ? `, <b>${escapeHtml(mode.toLowerCase())}</b>` : ''}`;
}
// Progressive disclosure: both panels stay in the DOM and grow open, so nothing
// on the home page jumps when they appear. `openPanel` drives the CSS.
const optionsWrap = $('#options-wrap');
const isOpen = (wrap) => wrap.dataset.open === 'true';
function openPanel(wrap, open) {
  wrap.dataset.open = String(open);
  return open;
}
btnOptions.addEventListener('click', () => {
  const open = openPanel(optionsWrap, !isOpen(optionsWrap));
  btnOptions.setAttribute('aria-expanded', String(open));
  btnOptions.textContent = open ? 'Done' : 'Change';
  if (open) { const first = $('#wiz-lang-opts .wiz-opt.on') || $('#wiz-lang-opts .wiz-opt'); if (first) first.focus(); }
});

const friendsWrap = $('#friends-wrap');
const btnFriends = $('#btn-friends');
btnFriends.addEventListener('click', () => {
  const open = openPanel(friendsWrap, !isOpen(friendsWrap));
  btnFriends.setAttribute('aria-expanded', String(open));
  if (open) el.code.focus();
});
for (const sel of [el.lang, el.mode]) sel.addEventListener('change', renderIdentity);
renderIdentity();

/* ------------------------------------------------------- profile & garage */

function renderProfile() {
  const lvl = account.level;
  const [into, span, frac] = account.levelProgress;
  el.profLevel.textContent = lvl;
  el.profTitle.textContent = account.title;
  el.levelRing.style.setProperty('--p', frac.toFixed(3));
  el.xpFill.style.width = `${Math.round(frac * 100)}%`;
  el.xpText.textContent = `${into.toLocaleString()} / ${span.toLocaleString()} points to level ${lvl + 1}`;
  const st = account.stats;
  el.stPoints.textContent = (st.points || 0).toLocaleString();
  el.stRaces.textContent = st.races || 0;
  el.stWins.textContent = st.wins || 0;
  el.stWpm.textContent = st.bestWpm || 0;
  renderStreak();
  renderRankChips();
  renderRivals();
  renderGarage();
  renderAchievements();
}

function renderStreak() {
  const n = account.streak;
  const today = account.playedToday;
  el.streakBox.classList.toggle('on', n > 0);
  el.streakBox.classList.toggle('today', today);
  el.streakFlame.textContent = n >= 30 ? '🌋' : n >= 7 ? '🔥' : n > 0 ? '🔥' : '🕯️';
  el.streakDays.textContent = n > 0 ? `${n}-day streak` : 'No streak yet';
  const bonus = Math.round(Math.min(50, n * 5));
  el.streakSub.textContent = n === 0
    ? 'Race on any day to start one. Each day in a row adds +5% points, up to +50%.'
    : today
      ? `Today is banked ✓  ·  +${bonus}% on every point you earn  ·  best: ${plural(account.bestStreak, 'day')}`
      : `Race today to keep it alive  ·  +${bonus}% on every point you earn  ·  best: ${plural(account.bestStreak, 'day')}`;
  // last seven days: filled pips for the days the streak covers
  const pips = [];
  for (let i = 6; i >= 0; i--) {
    const covered = today ? i < n : i > 0 && i <= n;
    pips.push(`<i class="${covered ? 'on' : ''} ${i === 0 && today ? 'now' : ''}"></i>`);
  }
  el.streakWeek.innerHTML = pips.join('');
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const RANK_LABEL = {
  'points|all|global': 'World',
  'points|season|global': 'Season',
  'points|today|global': 'Today',
  'wpm|all|global': 'Speed',
  'streak|all|global': 'Streak',
};

function renderRankChips() {
  const badges = (account.stats.badges || []).slice(-6).map((b) => `<span class="rank-chip badge-chip ${b.rank <= 3 ? 'top' : ''}" title="Season ${b.number}: finished #${b.rank}">${medal(b.rank)} S${b.number}</span>`);
  const chips = account.standings.map((s) => {
    const key = `${s.category}|${s.window}|${s.scope}`;
    const label = RANK_LABEL[key] || (s.scope === 'global' ? s.category : s.scope === 'UN' ? 'Country' : `${flag(s.scope)} ${s.scope}`);
    if (!s.rank) return `<span class="rank-chip empty">${label} —</span>`;
    return `<span class="rank-chip ${s.rank <= 3 ? 'top' : ''}">${label} <b>#${s.rank}</b><small>/${s.of.toLocaleString()}</small></span>`;
  });
  el.rankChips.innerHTML = (chips.join('') || '<span class="rank-chip empty">Finish a race to get ranked</span>') + badges.join('');
}

/* ------------------------------------------------------------ season */

// One cached GET; the season line in the profile card and the "ends in" text.
let seasonInfo = null;
async function loadSeason() {
  try {
    const res = await fetch(`/api/season${account.id ? `?me=${encodeURIComponent(account.id)}` : ''}`);
    if (res.ok) seasonInfo = await res.json();
  } catch (_) { /* offline */ }
  renderSeason();
}
function renderSeason() {
  const box = $('#season-line');
  if (!box) return;
  if (!seasonInfo) { box.textContent = ''; return; }
  const days = Math.max(0, Math.ceil((seasonInfo.endsAt - Date.now()) / 86400000));
  const me = seasonInfo.me ? `you're #${seasonInfo.me.rank.toLocaleString()} of ${seasonInfo.me.of.toLocaleString()}` : 'race to get placed';
  const leader = seasonInfo.top[0] ? ` · leader ${escapeHtml(seasonInfo.top[0].name)} ${seasonInfo.top[0].points.toLocaleString()}` : '';
  box.innerHTML = `🏁 <b>Season ${seasonInfo.number}</b> · ${days} day${days === 1 ? '' : 's'} left · ${me}${leader}`;
}

function renderRivals() {
  const rivals = account.rivals;
  if (!rivals.length) {
    el.rivals.innerHTML = '<div class="board-empty small">No rivals yet. Send someone your room link and the head-to-head starts itself.</div>';
    return;
  }
  el.rivals.innerHTML = rivals.map((r) => `
    <div class="rival">
      <span class="b-flag">${flag(r.country)}</span>
      <span class="b-name">${escapeHtml(r.name)}</span>
      <span class="rival-score ${r.w > r.l ? 'up' : r.w < r.l ? 'down' : ''}"><b>${r.w}</b>–<b>${r.l}</b></span>
      <span class="rival-n">${r.n} race${r.n === 1 ? '' : 's'}</span>
    </div>`).join('');
}

function renderGarage() {
  const lvl = account.level;
  el.garage.innerHTML = SKINS.map((s) => {
    const locked = s.unlock > lvl;
    const sel = s.id === account.skin;
    return `<button class="skin ${locked ? 'locked' : ''} ${sel ? 'selected' : ''}" data-skin="${s.id}" title="${escapeHtml(s.blurb)}" ${locked ? 'aria-disabled="true"' : ''}>
      <div class="skin-car" style="--c:${SHOWROOM[s.id] || '#B8612E'}">${carSvg(s.id)}</div>
      <div class="skin-name">${escapeHtml(s.name)}</div>
      <div class="skin-sub">${locked ? `🔒 Lvl ${s.unlock}` : sel ? '✓ Riding' : 'Select'}</div>
    </button>`;
  }).join('');
  const chosen = SKINS.find((s) => s.id === account.skin) || SKINS[0];
  const next = SKINS.find((s) => s.unlock > lvl);
  el.garageHint.textContent = next
    ? `Tap a car to drive it. ${next.name} unlocks at level ${next.unlock}.`
    : 'Tap a car to drive it. Every car is yours.';
  showroomCar(el.garageCar, chosen.id);
  showroomCar(el.profCar, chosen.id);
  showroomCar($('#si-car'), chosen.id);
  el.garageName.textContent = chosen.name;
  el.garageBlurb.textContent = chosen.blurb;
}

/** The big car on the showroom floor: the old one drives off, the new one rolls in. */
function showroomCar(node, id) {
  if (!node || node.dataset.car === id) return;
  const first = !node.dataset.car;
  node.dataset.car = id;
  node.style.setProperty('--c', SHOWROOM[id] || '#B8612E');
  node.innerHTML = carSvg(id);
  if (first || reducedMotion.matches) return;
  node.classList.remove('arrive'); void node.offsetWidth; node.classList.add('arrive');
}

el.garage.addEventListener('click', (e) => {
  const btn = e.target.closest('.skin');
  if (!btn) return;
  const id = btn.dataset.skin;
  const skin = SKINS.find((s) => s.id === id);
  if (!skin) return;
  if (skin.unlock > account.level) {
    toast(`${skin.name} unlocks at level ${skin.unlock} — keep racing!`, 'warn', 2200);
    return;
  }
  if (account.setSkin(id)) {
    sound.ensure();
    sound.join();
    renderGarage();
    if (net.connected) identify(); // tell the lobby about the new ride
  }
});

function renderAchievements() {
  const have = new Set(account.achievements);
  const list = account.catalogue;
  if (!list.length) { el.achGrid.innerHTML = '<div class="board-empty small">Loading…</div>'; return; }
  setAwardCount(`${have.size}/${list.length}`);
  $('#aw-have').textContent = have.size;
  $('#aw-total').textContent = list.length;
  $('#aw-fill').style.transform = `scaleX(${(have.size / list.length).toFixed(3)})`;
  el.achGrid.innerHTML = list.map((a) => `
    <div class="ach ${have.has(a.id) ? 'got' : ''}" title="${escapeHtml(a.desc)}">
      <span class="ach-icon">${a.icon}</span>
      <span class="ach-name">${escapeHtml(a.name)}</span>
    </div>`).join('');
}



/* ------------------------------------------------------------- practice */

// Practice runs are computed entirely in this browser (see solo.js); they
// enter the app through the same onRoom / onFinished path as a server room.
const solo = new Solo({
  net,
  track,
  game,
  emit: (m) => (m.type === 'room' ? onRoom(m) : onFinished(m)),
  myId: () => S.myId || 'me',
  identity: () => ({
    name: el.name.value.trim() || 'Guest',
    country: el.country.value || 'UN',
    skin: account.skin,
    accountId: account.id,
    bestWpm: Math.max(account.stats.solo?.bestWpm || 0, account.stats.bestWpm || 0),
    done: account.stats.done || [],   // English paragraphs finished: they decide which ones are open
  }),
});
for (const p of PACERS) {
  const opt = document.createElement('option');
  opt.value = p.id;
  opt.textContent = p.label;
  el.pacer.appendChild(opt);
}
el.pacer.value = localStorage.getItem('td_pacer') || 'medium';
if (!el.pacer.value) el.pacer.value = 'medium';
el.pacer.addEventListener('change', () => localStorage.setItem('td_pacer', el.pacer.value));

// language + mode selectors are filled from the passage catalogue
solo.ready.then(() => {
  const fill = (sel, map, saved, fallback) => {
    sel.innerHTML = '';
    for (const [id, v] of Object.entries(map || {})) {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = v.native || v.name || id;
      sel.appendChild(opt);
    }
    sel.value = saved && map && map[saved] ? saved : fallback;
  };
  fill(el.lang, solo.langs, localStorage.getItem('td_lang'), detectLang(solo.langs));
  fill(el.mode, solo.categories, localStorage.getItem('td_mode'), 'prose');
  renderIdentity();
});
el.lang.addEventListener('change', () => localStorage.setItem('td_lang', el.lang.value));
el.mode.addEventListener('change', () => localStorage.setItem('td_mode', el.mode.value));

// step-by-step options wizard: pick a Language -> only its Modes appear -> then the Pacers
const wizEl = { lang: $('#wiz-lang-opts'), mode: $('#wiz-mode-opts'), pacer: $('#wiz-pacer-opts') };
const wizStart = $('#wiz-start');
const wizSteps = [$('#wiz-lang'), $('#wiz-mode'), $('#wiz-pacer')];

const modeIdsForLang = (lang) => {
  const out = [], seen = new Set();
  for (const p of solo.catalogue || []) {
    if (p.lang === lang && !seen.has(p.category)) { seen.add(p.category); out.push(p.category); }
  }
  return out.length ? out : ['prose'];
};

const buildWizOptions = (row, items, selected, onPick) => {
  row.innerHTML = '';
  for (const [value, label] of items) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'wiz-opt' + (value === selected ? ' on' : '');
    b.value = value;
    b.textContent = label;
    b.addEventListener('click', () => onPick(value));
    row.appendChild(b);
  }
};

const revealStep = (step, show) => {
  if (show === !step.hidden) return;
  step.hidden = !show;
  if (show) { step.classList.remove('enter'); void step.offsetWidth; step.classList.add('enter'); }
};

const syncWizard = () => {
  const lang = el.lang.value || 'en';
  const mode = el.mode.value || 'prose';
  const pacer = el.pacer.value || 'medium';
  buildWizOptions(wizEl.lang, Object.entries(solo.langs).map(([id, v]) => [id, v.native || v.name || id]), lang,
    (id) => { el.lang.value = id; el.lang.dispatchEvent(new Event('change')); syncWizard(); });
  buildWizOptions(wizEl.mode, modeIdsForLang(lang).map((id) => [id, (solo.categories[id] || { name: id }).name]), mode,
    (id) => { el.mode.value = id; el.mode.dispatchEvent(new Event('change')); syncWizard(); });
  buildWizOptions(wizEl.pacer, PACERS.map((p) => [p.id, p.label]), pacer,
    (id) => { el.pacer.value = id; el.pacer.dispatchEvent(new Event('change')); syncWizard(); });
  revealStep(wizSteps[0], true);
  revealStep(wizSteps[1], !!lang);
  revealStep(wizSteps[2], !!mode);
  wizStart.hidden = !pacer;
};

el.lang.addEventListener('change', syncWizard);
el.mode.addEventListener('change', syncWizard);
el.pacer.addEventListener('change', syncWizard);
solo.ready.then(() => syncWizard());

wizStart.addEventListener('click', () => {
  openPanel(optionsWrap, false);
  btnOptions.setAttribute('aria-expanded', 'false');
  btnOptions.textContent = 'Change';
  startPractice();
});

/* ------------------------------------------------- first run: infer, don't ask */

// A newcomer came here to type, so nothing stands between the page and the first
// race: the browser's own language picks the passage language, the country comes
// from the time zone, and the name is asked for once a run is worth ranking (see
// the prompt in the results card).
function detectLang(langs) {
  const want = (navigator.languages || [navigator.language || 'en']).map((l) => String(l).slice(0, 2).toLowerCase());
  for (const code of want) if (langs && langs[code]) return code;
  return 'en';
}

function startPractice(opts = {}) {
  sound.ensure();
  localStorage.setItem('td_name', el.name.value.trim() || 'Guest');
  if (net.connected) identify();
  solo.start({ pacer: el.pacer.value, ...passageOpts(), ...opts });
}
el.btnSolo.addEventListener('click', () => startPractice());
el.btnSoloAgain.addEventListener('click', () => { el.results.hidden = true; solo.again(); });
el.btnSoloWorld.addEventListener('click', () => { leaveRoom(); whenConnected(() => net.send({ type: 'quick' })); });
el.btnSoloNext.addEventListener('click', () => {
  const id = el.btnSoloNext.dataset.id;
  if (!id) return;
  el.results.hidden = true;
  startPractice({ passageId: id });
});

// /#practice, /#practice/<passage-id> (the /practice pages link here) and
// /#practice/<passage-id>/ghost/<wr|accountId> ("beat my ghost" share links): start typing straight away
function practiceFromHash() {
  const m = location.hash.match(/^#practice(?:\/([a-z0-9-]+))?(?:\/ghost\/([A-Za-z0-9_-]+))?$/i);
  if (!m) return false;
  const opts = { passageId: m[1] ? m[1].toLowerCase() : null };
  if (m[2]) opts.pacer = m[2].toLowerCase() === 'wr' ? 'wr' : { ghostOf: m[2] };
  practiceOrNotice(opts);
  return true;
}

/* ------------------------------------------------------ the English chain */

// English paragraphs open one after another (solo.lockOf). A link to one you have
// not opened yet (a deep link, a replay or share link) does not start it: it says
// so and offers the one that is up next.
let markSynced = null;
const accountSynced = new Promise((resolve) => { markSynced = resolve; });

async function practiceOrNotice(opts) {
  await solo.ready;
  const id = opts.passageId;
  if (id && solo.lockOf(id)) {
    // the progress cached in this browser may be behind (another device): hear from the server first
    if (!account.synced) await Promise.race([accountSynced, new Promise((r) => setTimeout(r, 3000))]);
    const next = solo.lockOf(id);
    if (next) { showLockNotice(id, next); return; }
  }
  startPractice(opts);
}

let lockNext = null;
function showLockNotice(id, next, nextNo = null) {
  if (S.room && (S.room.state === 'countdown' || S.room.state === 'racing')) return whenFree(() => showLockNotice(id, next, nextNo));
  lockNext = next;
  const n = solo.chainNo(id);
  const nn = solo.chainNo(next.id) || nextNo;
  $('#ln-title').textContent = n ? `Paragraph ${n} is locked` : 'Not open yet';
  $('#ln-text').textContent = `Finish paragraph ${nn} first.`;
  $('#ln-go').textContent = `Type paragraph ${nn}`;
  el.lockNotice.hidden = false;
  $('#ln-go').focus({ preventScroll: true });
}
function closeLockNotice() {
  if (el.lockNotice.hidden) return;
  el.lockNotice.hidden = true;
  lockNext = null;
  if (location.hash && appPageOf(location.pathname)) history.replaceState(history.state, '', location.pathname);
}
$('#ln-go').addEventListener('click', () => {
  const next = lockNext;
  closeLockNotice();
  if (next) startPractice({ passageId: next.id });
});
$('#ln-close').addEventListener('click', closeLockNotice);
el.lockNotice.addEventListener('click', (e) => { if (e.target === el.lockNotice) closeLockNotice(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLockNotice(); });

/** The server would not take a run on a paragraph this browser thought was open (its progress was behind): stop it and point the way. */
function onLockRefused(m) {
  if (S.room && S.room.solo && S.room.passageId === m.passageId) { solo.abort(); goHome(); }
  const next = solo.passageById(m.next);
  if (next) showLockNotice(m.passageId, next, m.nextNo);
  else toast(m.message, 'warn', 3200);
}

/* ------------------------------------------------------------------ share */

const share = new ShareDialog($('#share-dialog'), net);
el.btnShare.addEventListener('click', () => { if (S.lastResultId) share.open(S.lastResultId); });
el.btnShareProfile.addEventListener('click', () => share.openProfile(account.id));

/* ---------------------------------------------------------- reminders */

const push = new PushReminders(net, { button: $('#btn-remind'), onState: () => renderProfile() });

/* ------------------------------------------------------------------ teams */

const teamCard = new TeamCard($('#team-card'), net, {
  onChanged: (m) => { if (m.profile) { account.setProfile(m.profile, null); renderProfile(); } },
});
const teamHash = location.hash.match(/^#team\/([A-Za-z0-9]{4,8})$/i);
if (teamHash) {
  history.replaceState(null, '', location.pathname);
  toast('Joining the team from your invite link…', 'info', 2500);
  teamCard.join(teamHash[1].toUpperCase());
}

/* --------------------------------------------------------- daily challenge */

// Today's passage for everyone; played as a practice run with today's golden
// words and the current leader as the pacer. The server scores one attempt.
const dailyCard = new DailyCard(el.dailyCard, {
  meId: () => account.id,
  onPlay: (d) => {
    const leader = d.top[0] || null;
    startPractice({
      passage: d.passage,
      bonusWords: d.bonusWords,
      mode: 'daily',
      dailyNumber: d.number,
      pacer: d.leaderGhost ? { ghost: d.leaderGhost, kind: 'leader' } : leader ? leader.wpm : 'medium',
      pacerName: leader ? `${leader.name} · leader` : null,
    });
  },
});
dailyCard.load();

function dailyFromHash() {
  if (!/^#daily$/i.test(location.hash)) return false;
  dailyCard.load().then((d) => { if (d) dailyCard.onPlay(d); });
  return true;
}

/* ------------------------------------------------------------- the router */

/**
 * You can look around while you wait in a lobby or after a race: the room
 * keeps going and a pill takes you back. Once the countdown starts you are
 * on the track until the finish; a practice run simply stops if you leave.
 */
function canLeave(url) {
  const r = S.room;
  if (!r) return true;
  const toRace = appPageOf(url.pathname) === 'home';
  if (r.solo) {
    if (!toRace) { solo.abort(); resetRoom(); }
    return true;
  }
  if ((r.state === 'countdown' || r.state === 'racing') && !S.local.done && currentScreen === 'race' && !toRace) {
    toast('The race is on. Everything else opens after the finish.', 'warn', 2600, true);
    return false;
  }
  return true;
}

const router = new Router({
  show: (page) => {
    // the game's home address shows the track while you are in a room
    if (page === 'home' && S.room) page = 'race';
    if (page !== 'race') el.results.hidden = true;
    el.lockNotice.hidden = true;
    showScreen(page);
  },
  canLeave,
  arrived: (page, url) => {
    // "Change country" in the account menu: land on the field itself
    if (page === 'profile' && url.hash === '#country') {
      const field = $('#country-field');
      el.country.focus({ preventScroll: true });
      field.scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      field.classList.remove('ask'); void field.offsetWidth; field.classList.add('ask');
      return;
    }
    if (page !== 'home' || (S.room && !S.room.solo)) return;
    // /app#practice/<id>, /app#daily: start typing straight away
    if (url.hash && !S.room) practiceFromHash() || dailyFromHash();
  },
});
router.start();

renderProfile();

/* ---------------------------------------------------------------- actions */

function identify() {
  const name = el.name.value.trim() || 'Guest';
  const country = el.country.value || 'UN';
  localStorage.setItem('td_name', name);
  localStorage.setItem('td_country', country);
  net.send({ type: 'hello', name, country, countryGuess: cxAuth.guessCountry(), skin: account.skin, ...account.credentials });
  // the server only sends a profile on sign-in; keep the cached one (and so the navbar) in step
  const mine = { ...account.profile, country, skin: account.skin };
  if (name !== 'Guest') mine.name = name;
  account.setProfile(mine, null);
  cxAuth.syncProfile(account.profile);
}

/* ------------------------------------------------ who you are: name and country */

// Your stats page holds the name other racers see and the country you race for.
// A change is saved when you leave the field (or press Enter), and said so once.
el.name.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.name.blur(); } });
el.name.addEventListener('change', () => {
  const typed = el.name.value.trim();
  if (!typed && cxAuth.state.status === 'signed-in') el.name.value = cxAuth.state.cortexisName || cxAuth.state.name;
  else el.name.value = typed;
  identify();
  renderAuth();
  toast(el.name.value ? `Other racers now see you as ${el.name.value}.` : 'You race as Guest.', 'success', 2400);
});
let pickedCountry = null;   // chosen on the sign-in page before signing in: applied once signed in
function chooseCountry(cc) {
  setCountry(cc);
  identify();
  renderAuth();
  toast(`Racing for ${cxAuth.countryName(el.country.value)}.`, 'success', 2200);
}
el.country.addEventListener('change', () => chooseCountry(el.country.value));
siCountry.addEventListener('change', () => { pickedCountry = siCountry.value; chooseCountry(siCountry.value); });

/* ------------------------------------------------------------ the sign-in page */

const siForm = $('#si-form');
const siEmail = $('#si-email');
const siPassword = $('#si-password');
const siError = $('#si-error');
const siSubmit = $('#si-submit');
const siGuest = $('#si-guest');

function showSignInError(r) {
  const site = (cxAuth.config && cxAuth.config.siteUrl) || '';
  siError.innerHTML = escapeHtml(r.message || 'Sign-in did not go through. Try again.')
    + (r.reason === 'unverified' && site ? ` <a href="${escapeHtml(site)}/login"${cxAuth.state.embedded ? ' target="_top"' : ' target="_blank" rel="noopener"'}>Confirm it on Cortexis</a>` : '');
  siError.hidden = false;
  const field = r.reason === 'invalid' && !siEmail.value.trim() ? siEmail : r.reason === 'invalid' ? siPassword : null;
  siForm.classList.toggle('bad', r.reason === 'invalid');
  if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); if (field === siPassword) field.select(); }
}
for (const f of [siEmail, siPassword]) f.addEventListener('input', () => { f.removeAttribute('aria-invalid'); siForm.classList.remove('bad'); });

siForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  siError.hidden = true;
  if (!siEmail.value.trim() || !siPassword.value) {
    showSignInError({ reason: 'invalid', message: 'Enter your email and password.' });
    return;
  }
  const r = await cxAuth.signIn(siEmail.value, siPassword.value);
  if (!r.ok) { showSignInError(r); return; }
  siPassword.value = '';
  // the welcome is said by the signed-in handler below; the game is where you were going
  router.go('/app');
});
siGuest.addEventListener('click', () => {
  cxAuth.playAsGuest();
  router.go('/app');
});
$('#si-signout').addEventListener('click', () => signOutHere());
async function signOutHere() {
  const was = cxAuth.state.name;
  await cxAuth.signOut();
  toast(`Signed out. See you soon, ${was}.`, 'info', 2600);
}

/** Everything on the page that depends on being signed in or not. */
function renderAuth() {
  const s = cxAuth.state;
  const signedIn = s.status === 'signed-in';
  $('#guest-note').hidden = signedIn || s.busy;
  $('#id-status').innerHTML = signedIn
    ? `<span class="id-badge on">Ranked</span><span>Signed in with Cortexis${s.cortexisName ? ` as <b>${escapeHtml(s.cortexisName)}</b>` : ''}</span>`
    : '<span class="id-badge">Guest</span><span>Guest scores aren\'t ranked. <a href="/app/signin">Sign in</a></span>';
  $('#si-out').hidden = signedIn;
  $('#si-in').hidden = !signedIn;
  $('#si-title').textContent = signedIn ? 'Signed in' : 'Sign in';
  $('#si-lead').textContent = signedIn ? 'Your races count on the rankings.' : 'Race under your Cortexis account and get ranked.';
  $('#si-name').textContent = s.name;
  $('#si-avatar').innerHTML = `<b>${escapeHtml((String(s.name || 'P').trim()[0] || 'P').toUpperCase())}</b><i class="avatar-flag">${flag(s.country)}</i>`;
  $('#si-plate').textContent = signedIn ? s.name : (el.name.value.trim() || 'Guest');
  siSubmit.disabled = !!s.busy;
  siSubmit.classList.toggle('busy', !!s.busy);
  siSubmit.firstChild.nodeValue = s.busy ? 'Signing in' : 'Sign in with Cortexis';
  const signup = $('#si-signup');
  signup.href = cxAuth.signupUrl;
  if (s.embedded) { signup.target = '_top'; signup.removeAttribute('rel'); }
}

/* Cortexis sign-in (cx-auth.js owns the stored session; this keeps the game in step). */
cxAuth.onChange((s, reason, detail = {}) => {
  if (reason === 'signed-in') {
    account.useCredentials(cxAuth.credentials);
    if (detail.profile) account.setProfile(detail.profile, detail.standings);
    el.name.value = s.name;
    setCountry(pickedCountry || s.country);
    pickedCountry = null;
    renderProfile();
    if (net.connected) identify();   // the server switches this socket to the Cortexis account
    if (!detail.fromOtherTab) toast(detail.merged ? `Signed in as ${s.name}. Your guest races came with you.` : `Signed in as ${s.name}. Your races count now.`, 'success', 3200);
  } else if (reason === 'signed-out') {
    net.send({ type: 'signout', token: detail.previous ? detail.previous.token : undefined });
    account.useCredentials({});
    el.name.value = '';
    localStorage.removeItem('td_name');
    renderProfile();
    if (net.connected) identify();   // no credentials: the server mints a fresh guest
  }
  renderAuth();
});
renderAuth();

function whenConnected(action) {
  sound.ensure();
  if (net.connected) { identify(); action(); return; }
  S.pending = () => { identify(); action(); };
  toast('Connecting to the race server…', 'info', 1500);
}

/** Language + mode the player picked (persisted); sent with every room request and practice run. */
const passageOpts = () => ({ lang: el.lang.value || 'en', category: el.mode.value || 'prose' });
$('#btn-quick').addEventListener('click', () => whenConnected(() => net.send({ type: 'quick', ...passageOpts() })));
$('#btn-create').addEventListener('click', () => whenConnected(() => net.send({ type: 'create', ...passageOpts() })));
$('#btn-join').addEventListener('click', () => {
  const code = el.code.value.trim().toUpperCase();
  if (code.length < 4) return toast('Enter the 5-letter room code', 'warn');
  whenConnected(() => net.send({ type: 'join', code }));
});
$('#btn-start').addEventListener('click', () => net.send({ type: 'start', bots: el.botsCheck.checked }));
$('#btn-leave').addEventListener('click', leaveRoom);
$('#btn-results-leave').addEventListener('click', leaveRoom);
$('#btn-results-stay').addEventListener('click', () => { el.results.hidden = true; });

el.roomCode.addEventListener('click', async () => {
  if (!S.room) return;
  const link = `${location.origin}/app#${S.room.code}`;
  try {
    await navigator.clipboard.writeText(link);
    toast('Invite link copied to clipboard', 'success');
  } catch (_) {
    toast(link, 'info', 6000);
  }
});

// chat
el.chatToggle.addEventListener('click', () => {
  el.chat.hidden = !el.chat.hidden;
  if (!el.chat.hidden) {
    S.unreadChat = 0;
    el.chatToggle.classList.remove('unread');
    el.chatToggle.dataset.count = '';
    el.chatInput.focus();
  }
});
$('#chat-close').addEventListener('click', () => { el.chat.hidden = true; refocusTyping(); });
$('#chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = el.chatInput.value.trim();
  if (!text) return;
  net.send({ type: 'chat', text });
  el.chatInput.value = '';
});

// emotes: mousedown + preventDefault so the typing input never loses focus mid-race
el.emoteBar.addEventListener('mousedown', (e) => {
  const btn = e.target.closest('button[data-e]');
  if (!btn) return;
  e.preventDefault();
  net.send({ type: 'emote', e: btn.dataset.e });
  btn.classList.remove('sent');
  void btn.offsetWidth;
  btn.classList.add('sent');
});
el.emoteBar.addEventListener('touchstart', (e) => {
  const btn = e.target.closest('button[data-e]');
  if (!btn) return;
  e.preventDefault();
  net.send({ type: 'emote', e: btn.dataset.e });
}, { passive: false });

function renderEmoteBar(list) {
  if (S.emotesRendered || !list || !list.length) return;
  S.emotesRendered = true;
  el.emoteBar.innerHTML = list.map((e) => `<button type="button" data-e="${e}" title="React">${e}</button>`).join('');
}

function leaveRoom() {
  if (S.room && S.room.solo) solo.abort();
  else net.send({ type: 'leave' });
  goHome();
}

function goHome() {
  S.room = null;
  S.passage = '';
  S.myFinish = null;
  S.players.clear();
  S.interp.clear();
  resetLocal();
  track.setPlayers([], myId());
  typing.setPassage('');
  typing.setEnabled(false);
  syncSiteTyping();
  el.results.hidden = true;
  el.countdown.hidden = true;
  el.finishBanner.hidden = true;
  el.focusOverlay.hidden = true;
  el.chat.hidden = true;
  el.chatLog.innerHTML = '';
  el.trackWrap.classList.remove('nitro');
  renderProfile();
  // leaving the track lands on the game's home; anywhere else you stay where you are
  if (currentScreen === 'race') showScreen('home');
  else renderDock();
  if (location.hash && appPageOf(location.pathname)) history.replaceState(history.state, '', location.pathname);
}

/** Forget the room without touching the screen (a practice run left by navigating away). */
function resetRoom() {
  S.room = null;
  S.passage = '';
  S.players.clear();
  S.interp.clear();
  resetLocal();
  track.setPlayers([], myId());
  typing.setPassage('');
  typing.setEnabled(false);
  syncSiteTyping();
  el.results.hidden = true;
  el.countdown.hidden = true;
  el.finishBanner.hidden = true;
  el.focusOverlay.hidden = true;
  renderDock();
}

/** Onto the track: from another page that means going back to the game's own address. */
function toRace() {
  if (currentScreen === 'race') return;
  if (appPageOf(location.pathname) === 'home') showScreen('race');
  else router.go('/app');
}

function resetLocal() {
  S.local = { correct: 0, typed: 0, keystrokes: 0, errors: 0, done: false, vis: 0 };
  S.myFinish = null;
  S.nitroShown = false;
  S.lastScoreShown = -1;
  S.lastComboShown = -1;
  game.reset();
  el.hudWpm.textContent = '0';
  el.hudAcc.textContent = '100%';
  el.hudCombo.textContent = '0';
  el.hudMult.textContent = '';
  el.hudScore.textContent = '0';
  el.nitroFill.style.width = '0%';
  el.nitroStat.classList.remove('active', 'ready');
  el.nitroLabel.textContent = 'Nitro';
  el.comboStat.className = 'stat combo-stat';
  el.trackWrap.classList.remove('nitro');
  el.callouts.innerHTML = '';
}

function clearInterp() {
  for (const it of S.interp.values()) it.reset();
}

/* ------------------------------------------------------------ networking */

net.on('open', () => {
  el.connBanner.hidden = true;
  clock.start(2000);
  if (S.pending) {
    const p = S.pending;
    S.pending = null;
    p();
  } else if (S.hadSession) {
    S.hadSession = false;
    goHome();
    toast('Connection was lost, so you left the room. Jump back in!', 'warn', 4500);
  }
});

net.on('close', ({ wasConnected }) => {
  if (wasConnected) el.connBanner.hidden = false;
  clock.stop();
  if (S.room && !S.room.solo) S.hadSession = true; // a practice run does not need the socket
});

net.on('welcome', (m) => {
  S.myId = m.id;
  clock.seed(m.serverTime);
  el.online.textContent = m.online;
  account.catalogue = m.achievements || [];
  renderAchievements();
  identify();          // resume the saved account as soon as we're connected
});

net.on('account', (m) => {
  account.onAccount(m);
  markSynced();
  // a new player's country comes from the server (CDN header, else our guess)
  if (m.created && m.profile && m.profile.country) { setCountry(m.profile.country); localStorage.setItem('td_country', el.country.value); }
  cxAuth.syncProfile(m.profile);
  if (!el.name.value.trim() && m.profile && m.profile.name && !/^Guest/i.test(m.profile.name)) el.name.value = m.profile.name;
  renderProfile();
  renderAuth();
  dailyCard.load();   // now we know who "me" is
  loadSeason();
  push.setFromProfile(account.stats);
  el.btnShareProfile.hidden = !account.id;
  if (!m.created && account.streak > 0 && !account.playedToday) {
    toast(`🔥 ${account.streak}-day streak — one race today keeps it alive`, 'info', 4200);
  }
});

net.on('race_result', onRaceResult);
net.on('renamed', (m) => { // an admin changed this player's name or country
  el.name.value = m.name;
  localStorage.setItem('td_name', m.name);
  if (m.country) { setCountry(m.country); localStorage.setItem('td_country', el.country.value); }
});

net.on('online', (m) => { el.online.textContent = m.n; });
net.on('error', (m) => (m.locked ? onLockRefused(m) : toast(m.message || 'Something went wrong', 'error')));
net.on('left', () => { if (S.room) goHome(); });
net.on('player_left', (m) => { if (S.room && S.room.state !== 'racing') toast(`${m.name} left the room`, 'info', 2000); }); // mid race the results say so
net.on('room', onRoom);
net.on('snap', onSnap);
net.on('finished', onFinished);
net.on('chat', onChat);
net.on('emote', (m) => {
  if (!S.room) return;
  track.emote(m.id, m.e);
  sound.emote();
});
net.on('rev', (m) => { if (S.room) track.rev(m.id); });

clock.onUpdate = (c) => {
  el.ping.textContent = Math.round(c.rtt);
  el.pingPill.dataset.q = c.rtt < 90 ? 'good' : c.rtt < 200 ? 'ok' : 'bad';
};

net.connect();

/* ------------------------------------------------------------- room state */

function onRoom(m) {
  const prev = S.room;
  S.room = m;
  renderEmoteBar(m.emotes);

  const ids = new Set();
  for (const p of m.players) {
    ids.add(p.id);
    if (!S.players.has(p.id) && prev && !p.isBot && p.id !== myId() && prev.state === 'waiting') {
      toast(`${flag(p.country)} ${p.name} joined`, 'info', 1800);
      sound.join();
    }
    S.players.set(p.id, p);
    if (!S.interp.has(p.id)) S.interp.set(p.id, new Interpolator());
  }
  for (const id of [...S.players.keys()]) {
    if (!ids.has(id)) { S.players.delete(id); S.interp.delete(id); }
  }
  track.setPlayers(m.players, myId());

  // onto the track when a room starts and when its countdown does; a lobby
  // update while you look at another page leaves you where you are
  const entering = !prev || prev.code !== m.code || !!prev.solo !== !!m.solo;
  if (entering || (m.state === 'countdown' && prev.state !== 'countdown')) toRace();
  else renderDock();

  const changed = !prev || prev.state !== m.state || prev.raceNo !== m.raceNo || prev.code !== m.code;
  if (changed) enterState(m);
  refreshStateUI(m);
}

function enterState(m) {
  const st = m.state;
  S.passage = m.passage || '';
  if (st === 'countdown') S.lastResultId = null;
  el.results.hidden = true;
  el.finishBanner.hidden = true;
  el.countdown.hidden = true;
  el.countdown.classList.remove('go');
  el.focusOverlay.hidden = true;
  S.goUntil = 0;
  S.closesAt = m.closesAt || null;
  S.firstHome = null;

  if (st === 'waiting') {
    resetLocal();
    typing.setPassage('');
    typing.setEnabled(false);
    track.reset();
    clearInterp();
  } else if (st === 'countdown') {
    // a dialog left open on the results screen does not stay over the passage
    share.close();
    el.lockNotice.hidden = true;
    el.levelup.hidden = true;
    resetLocal();
    typing.setPassage(S.passage, m.bonusWords || []);
    game.start(m.bonusWords || []);
    typing.setEnabled(false);
    track.reset();
    clearInterp();
    // phones: get the keyboard up now, inside a tap, so it is there at GO
    if (IS_TOUCH && document.activeElement !== typing.input) showFocusOverlay('👆 Tap here so your keyboard is ready');
    el.countdown.hidden = false;
    S.lastCd = null;
    el.cdSub.textContent = (m.bonusWords || []).length
      ? `Get ready · ${m.bonusWords.length} ✦ bonus words`
      : 'Fingers on the keys';
    revealToSite(el.passageWrap);   // inside the website: bring the passage into view before GO
  } else if (st === 'racing') {
    if (typing.text !== S.passage) { // joined/reconnected straight into a race
      resetLocal();
      typing.setPassage(S.passage, m.bonusWords || []);
      game.start(m.bonusWords || []);
      track.reset();
      clearInterp();
    }
    typing.setEnabled(true);
    typing.focus();
    showGo();
    revealToSite(el.passageWrap);
    sound.go();
  } else if (st === 'finished') {
    typing.setEnabled(false);
    setNitroVisual(false);
    showResults(m);
  }
  syncSiteTyping();
}

function refreshStateUI(m) {
  el.race.classList.toggle('solo', !!m.solo);
  el.roomCode.textContent = m.code;
  el.roomCode.disabled = !!m.solo;
  el.roomType.textContent = m.solo ? (m.mode === 'daily' ? 'Daily' : 'Practice') : m.isPrivate ? (m.ranked ? 'Private' : 'Friendly') : 'Ranked';
  el.roomType.className = `badge ${m.solo ? 'solo' : m.isPrivate ? 'private' : 'public'}`;
  el.roomType.title = m.solo
    ? 'You are typing on your own. It counts for your days in a row, but not for points.'
    : m.ranked
      ? 'A race against other people. Points from this one count.'
      : 'A private game with friends. No points, but it counts for your days in a row and your record against them.';
  el.seats.textContent = `${m.players.length}/${m.maxPlayers}`;
  el.seats.hidden = !!m.solo;
  renderSeries(m);
  el.hostBar.hidden = !(m.isPrivate && m.state === 'waiting' && m.hostId === myId());
  if (m.solo) {
    const what = m.passageTitle ? `“${m.passageTitle}”` : 'Your go';
    if (m.state === 'racing') el.status.textContent = m.pacerWpm ? `${what} — try to beat the robot at ${m.pacerWpm} words a minute` : `${what} — go!`;
    if (m.state === 'countdown') el.status.textContent = `${what} — get ready`;
    if (m.state === 'finished') el.status.textContent = `${what} — finished`;
    return;
  }
  if (m.state === 'racing') {
    el.status.textContent = `Race #${m.raceNo} — type!`;
    S.endClock = '';   // the race clock paints itself again on the next frame
  }
  if (m.state === 'countdown') el.status.textContent = `Race #${m.raceNo} starts in a moment`;
}

function showGo() {
  el.countdown.hidden = false;
  el.countdown.classList.add('go');
  document.body.classList.add('is-go');     // one light sweep across the passage as it unlocks
  setTimeout(() => document.body.classList.remove('is-go'), 700);
  el.cdNum.textContent = 'GO!';
  el.cdSub.textContent = '';
  restartAnim(el.cdNum);
  S.goUntil = performance.now() + GO_FLASH_MS;
}

function restartAnim(node) {
  node.classList.remove('pop');
  void node.offsetWidth; // reflow so the animation restarts
  node.classList.add('pop');
}

/* ------------------------------------------------------------- snapshots */

function onSnap(m) {
  if (!S.room) return;
  S.closesAt = m.e || null;
  const len = S.passage.length || 1;
  for (const p of m.p) {
    if (p.id === myId()) {
      if (p.r != null) track.updateMeta(p.id, { rank: p.r, finished: p.f });
      continue; // local racer is predicted client-side
    }
    const it = S.interp.get(p.id);
    if (it) it.push(m.t, p.c / len);
    track.updateMeta(p.id, { wpm: p.w, pct: p.c / len, rank: p.r, finished: p.f, nitro: !!p.n && !p.f });
  }
}

function onFinished(m) {
  const p = S.players.get(m.id);
  if (!p) return;
  track.updateMeta(m.id, { rank: m.rank, finished: true, wpm: m.wpm, nitro: false });
  if (m.rank === 1) S.firstHome = m.id === myId() ? 'You' : p.name;
  if (m.id === myId()) {
    S.myFinish = m;
    S.local.done = true;
    typing.setEnabled(false);
    syncSiteTyping();
    setNitroVisual(false);
    const bonus = game.finish(m.rank, m.accuracy, S.local.errors);
    scheduleSend(true); // final score (with finish bonus) to the server
    el.finishBanner.innerHTML = `<span class="big">${medal(m.rank)}</span>
      <div><b>You finished ${m.rank === 1 ? 'first!' : `#${m.rank}`}</b>
      <span>${m.wpm} words a minute · ${m.accuracy}% typed right · ${fmtTime(m.time)}</span>
      <span class="bonus">+${bonus.place} place bonus${bonus.clean ? ` · +${bonus.clean} clean bonus` : ''}</span></div>`;
    el.finishBanner.hidden = false;
    if (m.rank === 1) { confetti.burst(160); sound.win(); } else sound.finish();
  }
}

function onChat(m) {
  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = `<span class="who" style="--c:${escapeHtml(paint(m.from.color))}">${flag(m.from.country)} ${escapeHtml(m.from.name)}</span> ${escapeHtml(m.text)}`;
  el.chatLog.appendChild(div);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
  if (el.chat.hidden && m.from.id !== myId()) {
    S.unreadChat++;
    el.chatToggle.classList.add('unread');
    el.chatToggle.dataset.count = S.unreadChat > 9 ? '9+' : String(S.unreadChat);
  }
}

/* --------------------------------------------------------- game feedback */

function callout(text, cls = '', ms = 1100) {
  const node = document.createElement('div');
  node.className = `callout ${cls}`;
  node.textContent = text;
  el.callouts.appendChild(node);
  // keep at most three on screen
  while (el.callouts.children.length > 3) el.callouts.firstChild.remove();
  setTimeout(() => node.remove(), ms);
}

function setNitroVisual(on) {
  if (S.nitroShown === on) return;
  S.nitroShown = on;
  track.setNitro(myId(), on);
  el.trackWrap.classList.toggle('nitro', on);
  el.nitroStat.classList.toggle('active', on);
  document.body.classList.toggle('nitro-shake', on);
}

function handleGameEvents(events) {
  for (const ev of events) {
    switch (ev.type) {
      case 'combo':
        callout(ev.label, `combo t${ev.tier}`);
        track.pop(myId(), ev.label.split(' ')[0], 'combo');
        sound.combo(ev.tier);
        el.comboStat.className = `stat combo-stat t${ev.tier}`;
        break;
      case 'combo_break':
        callout(`run broken at ${ev.combo}`, 'break', 800);
        sound.comboBreak();
        el.comboStat.className = 'stat combo-stat';
        break;
      case 'word':
        break;
      case 'golden':
        callout('+250 bonus word', 'golden', 1300);
        track.pop(myId(), '+250', 'golden');
        confetti.burst(40);
        sound.golden();
        break;
      case 'golden_miss':
        callout('bonus word missed', 'miss', 900);
        break;
      case 'mistake':
        track.pop(myId(), `−${ev.cost}`, 'miss');
        break;
      case 'nitro':
        callout('Boost!', 'nitro', 1200);
        track.pop(myId(), 'BOOST', 'nitro');
        sound.nitro();
        setNitroVisual(true);
        scheduleSend(true); // let the lobby see the flames immediately
        break;
      default:
        break;
    }
  }
}

/* ------------------------------------------------------------- typing */

typing.onChange = (r) => {
  Object.assign(S.local, { correct: r.correct, typed: r.typed, keystrokes: r.keystrokes, errors: r.errors, done: r.done });
  if (r.added) { if (r.ok) sound.key(); else sound.error(); }
  if (r.added && !r.ok) el.passageWrap.classList.remove('shake'), void el.passageWrap.offsetWidth, el.passageWrap.classList.add('shake');
  if (S.room?.state === 'racing') handleGameEvents(game.onKey(r));
  if (S.room?.solo) { solo.onProgress(r); return; } // practice never streams progress
  scheduleSend(r.done);
};

function showFocusOverlay(text) {
  el.focusOverlay.textContent = text;
  el.focusOverlay.hidden = false;
}

typing.onBlur = () => {
  setTimeout(() => {
    if (document.activeElement === el.chatInput || !S.room) return;
    // a blur that was undone in the same tick (the website handing the keyboard back) needs no cover
    if (document.activeElement === typing.input && document.hasFocus()) return;
    if (S.room.state === 'racing' && !S.local.done) showFocusOverlay(IS_TOUCH ? '👆 Tap here to keep typing' : 'Click here to refocus and keep typing');
    else if (S.room.state === 'countdown' && IS_TOUCH) showFocusOverlay('👆 Tap here so your keyboard is ready');
  }, 0);
};
typing.onFocus = () => {
  el.focusOverlay.hidden = true;
  // keep the passage in view above the on-screen keyboard
  if (IS_TOUCH) setTimeout(() => el.passageWrap.scrollIntoView({ block: 'start', behavior: 'smooth' }), 250);
};
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    if (IS_TOUCH && S.room?.state === 'racing' && document.activeElement === typing.input) el.passageWrap.scrollIntoView({ block: 'start' });
  });
}

el.passageWrap.addEventListener('click', refocusTyping);
document.addEventListener('keydown', (e) => {
  if (document.activeElement === el.chatInput) return;
  if (e.ctrlKey || e.metaKey) return; // Option still types letters (é, ß), so it is not a shortcut here
  const st = S.room?.state;
  if (st === 'waiting' || st === 'countdown') {
    if (e.key.length === 1) rev();
    return;
  }
  if (st !== 'racing' || S.local.done) return;
  if (document.activeElement !== typing.input && (e.key.length === 1 || e.key === 'Dead')) typing.focus();
});

/* Pre-race engine revving: instant locally, throttled on the wire. */
function rev() {
  track.rev(myId());
  sound.rev();
  const now = performance.now();
  if (now - S.lastRevAt < 320 || S.room?.solo) return;
  S.lastRevAt = now;
  net.send({ type: 'rev' });
}
el.trackWrap.addEventListener('click', () => {
  const st = S.room?.state;
  if (st === 'waiting' || st === 'countdown') rev();
});

function refocusTyping() {
  if (!S.room) return;
  if (S.room.state === 'racing' && !S.local.done) typing.focus();
  else if (S.room.state === 'countdown') typing.focus(true);   // keyboard readiness on phones
  // Focusing an input that already has the keyboard fires no focus event, so a
  // cover left up over a passage that is taking keys would never go: drop it.
  if (document.activeElement === typing.input && document.hasFocus()) el.focusOverlay.hidden = true;
}

/*
 * Inside the website's frame (js/site-keys.js). A click on the site around
 * the game takes the keyboard away from this document; the site then
 * forwards the keys, which go through the same path as a keystroke in the
 * box, and hands the focus back, which lands on the passage again.
 */
function syncSiteTyping() {
  const st = S.room?.state;
  tellSiteTyping(!!S.room && (st === 'countdown' || (st === 'racing' && !S.local.done)));
  // and nothing pops up over the race: toasts and dialogs wait for the results (ui.js)
  holdPopups(!!S.room && (st === 'countdown' || st === 'racing'));
}
onSiteKey((key) => {
  const st = S.room?.state;
  if (st === 'waiting' || st === 'countdown') {
    if (key.length === 1) rev();
    return;
  }
  if (st !== 'racing' || S.local.done || key === 'Enter') return;
  // No focus() here: taking the keyboard back on the first forwarded key let a
  // key typed straight into the game overtake forwarded ones still on their
  // way. The website hands it back after the last one (GameFrame.js), and the
  // window focus that follows lands on the passage (refocusTyping).
  const value = key === 'Backspace' ? typing.input.value.slice(0, -1) : typing.input.value + key;
  typing.input.value = value;
  typing.handle(value);
});
window.addEventListener('focus', refocusTyping);

function scheduleSend(force) {
  if (S.room && S.room.solo) return; // practice: one result at the end, nothing in between
  const now = performance.now();
  const doSend = () => {
    S.lastSendAt = performance.now();
    S.sendTimer = null;
    net.send({
      type: 'progress',
      c: S.local.correct, t: S.local.typed, k: S.local.keystrokes, e: S.local.errors,
      n: game.nitro ? 1 : 0, s: game.score, x: game.bestCombo, g: game.golden, z: game.nitros,
    });
  };
  if (force || now - S.lastSendAt >= SEND_INTERVAL_MS) {
    if (S.sendTimer) { clearTimeout(S.sendTimer); S.sendTimer = null; }
    doSend();
  } else if (!S.sendTimer) {
    S.sendTimer = setTimeout(doSend, SEND_INTERVAL_MS - (now - S.lastSendAt));
  }
}

/* --------------------------------------------------------------- results */

function showResults(m) {
  const isSolo = !!m.solo;
  el.results.classList.toggle('solo', isSolo);
  el.podium.hidden = isSolo;
  el.resultsTable.hidden = isSolo;
  el.soloResults.hidden = !isSolo;
  el.btnResultsStay.hidden = isSolo;
  el.btnSoloAgain.hidden = !isSolo;
  el.btnSoloWorld.hidden = !isSolo;
  el.btnSoloNext.hidden = true;               // shown once the server says this run opened the next paragraph
  el.btnSoloWorld.classList.add('primary');
  el.btnResultsLeave.textContent = isSolo ? 'Back home' : 'Leave this game';
  el.nextRace.hidden = isSolo;
  el.btnShare.hidden = !S.lastResultId;
  if (isSolo) {
    el.resultsTitle.textContent = solo.title();
    el.myRace.hidden = false;
    showMyRace();
    el.mrXp.textContent = 'Saving…';
    el.mrXp.classList.add('unranked');
    el.mrLevel.textContent = `Level ${account.level} · ${account.title}`;
    el.mrXpText.textContent = '';
    el.mrRanks.innerHTML = '';
    el.mrUnlocks.innerHTML = '';
    el.mrSeries.hidden = true;
    solo.renderResults();
    openResults();
    return;
  }

  const results = m.results || [];
  const mine = results.find((r) => r.id === myId());
  const iWon = mine && mine.rank === 1;

  el.resultsTitle.textContent = iWon ? '🏆 You won the race!' : mine ? `You placed ${medal(mine.rank)}` : 'Race results';

  const top = [results[1], results[0], results[2]]; // podium order: 2nd, 1st, 3rd
  el.podium.innerHTML = top.map((r, i) => {
    if (!r) return '<div class="podium-slot empty"></div>';
    const place = i === 1 ? 1 : i === 0 ? 2 : 3;
    return `<div class="podium-slot p${place} ${r.id === myId() ? 'me' : ''}" style="--c:${escapeHtml(paint(r.color))}">
      <div class="podium-car">${carSvg(r.skin)}</div>
      <div class="podium-name">${flag(r.country)} ${escapeHtml(r.name)}</div>
      <div class="podium-wpm">${r.wpm}<small>WPM</small></div>
      <div class="podium-block"><span>${medal(place)}</span></div>
    </div>`;
  }).join('');

  el.resultsBody.innerHTML = results.map((r) => `
    <tr class="${r.id === myId() ? 'me' : ''}" style="--c:${escapeHtml(paint(r.color))}">
      <td>${medal(r.rank)}</td>
      <td><span class="swatch"></span>${flag(r.country)} ${escapeHtml(r.name)}${r.isBot ? ' <span class="tag bot">BOT</span>' : ''}${r.dropped && !r.finished ? ' <span class="tag left" title="Lost the connection during the race, so placed last">LEFT</span>' : ''}</td>
      <td class="num">${r.wpm}</td>
      <td class="num">${r.accuracy}%</td>
      <td class="num score">${(r.id === myId() ? game.score : r.score || 0).toLocaleString()}</td>
      <td class="num">${r.finished ? fmtTime(r.time) : `${Math.round(r.progress * 100)}%`}</td>
    </tr>`).join('');

  el.myRace.hidden = !mine;
  if (mine) showMyRace();
  renderSeries(m);

  openResults();
  if (iWon && !S.myFinish) { confetti.burst(160); sound.win(); }
}

/**
 * Open the results card. The card reveals in one sequence (CSS reads data-seq),
 * the headline number counts up, and a still-nameless racer is asked for a name
 * here — the first moment it buys them something.
 */
function openResults() {
  const card = el.results.querySelector('.modal-card');
  el.results.hidden = false;
  card.removeAttribute('data-seq');
  void card.offsetWidth;                    // restart the stagger on every open
  card.setAttribute('data-seq', 'in');
  if (!el.soloResults.hidden) countTo($('#sr-wpm'), $('#sr-wpm').textContent);
  if (!el.myRace.hidden) countTo(el.mrScore, el.mrScore.textContent.replace(/,/g, ''), (v) => v.toLocaleString());
  // a guest who just raced other people: the one place a nudge to sign in earns its space
  namePrompt.hidden = cxAuth.state.status !== 'guest' || !!(S.room && S.room.solo);
}

const namePrompt = $('#name-prompt');

/** The per-race numbers the client itself produced (score, combo, nitro). */
function showMyRace() {
  el.mrScore.textContent = game.score.toLocaleString();
  el.mrCombo.textContent = game.bestCombo;
  el.mrNitro.textContent = game.nitros;
  el.mrGolden.textContent = `${game.golden}/${game.goldenTotal}`;
}

function renderSeries(m) {
  const rows = (m.series || []).filter((r) => r.wins > 0 || (m.series || []).length > 1);
  const show = m.isPrivate && rows.length > 1;
  el.mrSeries.hidden = !show;
  el.series.hidden = !show;
  if (!show) return;
  const line = rows.map((r) => `${escapeHtml(r.name)} ${r.wins}`).join('  ·  ');
  el.series.textContent = `Series: ${line}`;
  el.mrSeries.innerHTML = `<span class="mr-series-label">Room series</span>` + rows.map((r) => `
    <span class="series-pill ${r.id === myId() ? 'me' : ''}" style="--c:${escapeHtml(paint(r.color))}">
      ${flag(r.country)} ${escapeHtml(r.name)} <b>${r.wins}</b>
    </span>`).join('');
}

/**
 * The server settled the race: ranked points, streak, world ranks and any
 * achievements. This is the authoritative half of the results screen.
 */
function onRaceResult(msg) {
  const out = account.applyResult(msg);
  S.lastResultId = msg.resultId || null;
  el.btnShare.hidden = !S.lastResultId;
  renderProfile();

  const lvl = account.level;
  el.mrXp.textContent = out.ranked
    ? `+${out.points.toLocaleString()} points`
    : msg.solo ? 'No points for typing on your own — race other people to collect them' : 'No points in a private game';
  el.mrXp.classList.toggle('unranked', !out.ranked);
  if (msg.solo) {
    solo.onResult(msg);
    // finishing it opened the next English paragraph: that is the way on
    const opened = msg.solo.opened;
    el.btnSoloNext.hidden = !opened;
    el.btnSoloNext.dataset.id = opened ? opened.id : '';
    el.btnSoloWorld.classList.toggle('primary', !opened);
  }
  if (msg.daily) dailyCard.load();
  if (msg.ranked) loadSeason();
  if (msg.ghost && msg.ghost.wr && !msg.solo) setTimeout(() => toast('🌍 Nobody on TypeDash has typed this paragraph faster', 'success', 3600), 700);
  el.mrLevel.textContent = `Level ${lvl} · ${account.title}`;

  const lo = pointsForLevel(lvl);
  const hi = pointsForLevel(lvl + 1);
  const startPts = Math.max(lo, account.points - out.points);
  const startFrac = out.leveledUp ? 0 : (startPts - lo) / (hi - lo);
  const endFrac = (account.points - lo) / (hi - lo);
  el.mrXpFill.style.transition = 'none';
  el.mrXpFill.style.width = `${Math.round(startFrac * 100)}%`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.mrXpFill.style.transition = 'width 1.1s cubic-bezier(.2,.9,.2,1)';
    el.mrXpFill.style.width = `${Math.round(endFrac * 100)}%`;
  }));
  el.mrXpText.textContent = `${(account.points - lo).toLocaleString()} / ${(hi - lo).toLocaleString()} points to level ${lvl + 1}`;

  // where that leaves you in the world
  el.mrRanks.innerHTML = account.standings.filter((st) => st.rank).map((st) => {
    const key = `${st.category}|${st.window}|${st.scope}`;
    const label = RANK_LABEL[key] || (st.scope === 'global' ? st.category : st.scope === 'UN' ? 'Country' : `${flag(st.scope)} ${st.scope}`);
    return `<span class="rank-chip ${st.rank <= 3 ? 'top' : ''}">${label} <b>#${st.rank}</b><small>/${st.of.toLocaleString()}</small></span>`;
  }).join('');

  // streak + unlock chips
  const chips = [];
  if (out.streakEvent === 'extended') chips.push(`<span class="chip streak-chip">🔥 ${out.streak}-day streak</span>`);
  if (out.streakEvent === 'started') chips.push('<span class="chip streak-chip">🔥 Streak started</span>');
  if (out.streakEvent === 'reset') chips.push('<span class="chip streak-chip dim">🕯️ Streak restarted</span>');
  for (const a of out.unlocked) chips.push(`<span class="chip ach-chip" title="${escapeHtml(a.desc)}">${a.icon} ${escapeHtml(a.name)}</span>`);
  for (const sk of out.newSkins) chips.push(`<span class="chip skin-chip">🚗 ${escapeHtml(sk.name)} unlocked</span>`);
  el.mrUnlocks.innerHTML = chips.join('');

  // the streak and achievement chips are on the results screen itself; a sound is enough here
  if (out.unlocked.length) setTimeout(() => sound.achievement(), 400);
  if (out.leveledUp) setTimeout(() => whenFree(() => showLevelUp(out)), 900);
}

function showLevelUp(out) {
  el.levelupNum.textContent = out.levelAfter;
  el.levelupTitle.textContent = account.title;
  el.levelupSkins.innerHTML = out.newSkins.length
    ? out.newSkins.map((s) => `<div class="lu-skin" style="--c:${SHOWROOM[s.id] || '#B8612E'}">${carSvg(s.id)}<span>${escapeHtml(s.name)} unlocked</span></div>`).join('')
    : '';
  el.levelup.classList.remove('out');
  el.levelup.hidden = false;
  sound.levelUp();
  confetti.burst(200);
  setTimeout(() => el.levelup.classList.add('out'), 3400);
  setTimeout(() => { el.levelup.hidden = true; }, 3800);
}
el.levelup.addEventListener('click', () => { el.levelup.hidden = true; });

/* ------------------------------------------------------------ render loop */

function localWpm(now) {
  if (S.myFinish) return S.myFinish.wpm;
  const m = S.room;
  if (!m || !m.startAt) return 0;
  const elapsed = now - m.startAt;
  if (elapsed < 800) return 0;
  return Math.round((S.local.correct / 5) / (elapsed / 60000));
}

function updateWaiting(m, now) {
  const n = m.players.length;
  if (m.isPrivate) {
    el.status.textContent = m.hostId === myId()
      ? `This is your game — send the code ${m.code} to a friend, then press start`
      : 'Waiting for the person who made this game to start it';
  } else {
    const secs = m.lobbyDeadline ? Math.max(0, Math.ceil((m.lobbyDeadline - now) / 1000)) : null;
    el.status.textContent = secs == null
      ? 'Looking for people to race…'
      : `Waiting for people · starts in ${secs}s${n < m.maxPlayers ? ' (computer players fill any empty spots)' : ''}`;
  }
}

function updateCountdown(m, now) {
  const remaining = m.countdownEndsAt - now;
  const n = Math.max(0, Math.ceil(remaining / 1000));
  if (n !== S.lastCd) {
    S.lastCd = n;
    el.cdNum.textContent = n > 0 ? String(n) : 'GO!';
    restartAnim(el.cdNum);
    if (n > 0 && n <= 5) sound.count();
    if (n === 0) typing.arm(); // GO shows before the start lands: keys typed now still count
  }
}

function updateRacing(m, now) {
  if (m.tick) m.tick(now); // practice: the pacer lives in this browser
  const len = S.passage.length || 1;
  const wpm = localWpm(now);
  const ks = S.local.keystrokes;
  const acc = ks > 0 ? Math.floor(((ks - S.local.errors) / ks) * 100) : 100;
  const t = S.myFinish ? S.myFinish.time : Math.max(0, now - m.startAt);
  el.hudWpm.textContent = wpm;
  el.hudAcc.textContent = `${acc}%`;
  track.updateMeta(myId(), { wpm, pct: S.local.correct / len });

  // game HUD
  if (game.score !== S.lastScoreShown) {
    const fell = game.score < S.lastScoreShown; // a wrong key cost points
    S.lastScoreShown = game.score;
    el.hudScore.textContent = game.score.toLocaleString();
    el.hudScore.classList.remove('bump', 'drop');
    void el.hudScore.offsetWidth;
    el.hudScore.classList.add(fell ? 'drop' : 'bump');
  }
  if (game.combo !== S.lastComboShown) {
    S.lastComboShown = game.combo;
    el.hudCombo.textContent = game.combo;
    el.hudMult.textContent = game.multiplier > 1 ? `· ${game.multiplier}× points` : '';
  }
  const nitro = game.nitro;
  if (nitro) {
    el.nitroFill.style.width = `${Math.round(game.nitroLeft * 100)}%`;
    el.nitroLabel.textContent = 'boost ready';
  } else {
    el.nitroFill.style.width = `${Math.round(game.meter * 100)}%`;
    el.nitroLabel.textContent = game.meter >= 0.8 ? 'Almost…' : 'Nitro';
  }
  el.nitroStat.classList.toggle('ready', !nitro && game.meter >= 0.8);
  if (S.nitroShown && !nitro && !S.local.done) {
    setNitroVisual(false);
    scheduleSend(true);
  }

  // Progress heartbeat: re-send the latest state every 250 ms until the server
  // confirms the finish, so a lost packet (or a burst that hit the server's
  // rate ceiling) can never leave the car stranded short of the line.
  if (!S.myFinish && S.local.typed > 0 && performance.now() - S.lastSendAt > 250) scheduleSend(true);

  renderEndClock(now);

  if (S.goUntil && performance.now() > S.goUntil) {
    el.countdown.hidden = true;
    el.countdown.classList.remove('go');
    S.goUntil = 0;
  }
}

/**
 * Once the first racer is home the race ends AFTER_FIRST_FINISH_MS later
 * (server/config.js). The server sends that moment (snap.e, room.closesAt)
 * and the clock counts down to it on the synced server clock, for racers
 * still typing and for those already home.
 */
function renderEndClock(now) {
  if (!S.closesAt) return;
  const secs = Math.max(0, Math.ceil((S.closesAt - now) / 1000));
  const who = S.firstHome ? `${escapeHtml(S.firstHome)} ${S.firstHome === 'You' ? 'are' : 'is'} home · ` : '';
  const html = `<span class="end-clock${secs <= 10 ? ' last' : ''}" role="timer"><i aria-hidden="true"></i>${who}Race ends in <b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b></span>`;
  if (html === S.endClock) return;
  S.endClock = html;
  el.status.innerHTML = html;
}

function updateFinished(m, now) {
  if (m.solo) return;
  const secs = Math.max(0, Math.ceil((m.resultsUntil - now) / 1000));
  el.status.textContent = `Race #${m.raceNo} finished · next race in ${secs}s`;
  el.nextRace.textContent = `Another race starts in ${secs}s`;
}

function frame(ts) {
  const dt = Math.min(100, ts - S.lastFrame);
  S.lastFrame = ts;
  const m = S.room;
  const now = m && m.localClock ? Date.now() : clock.now(); // practice runs keep their own clock
  const st = m ? m.state : null;

  if (m) {
    const len = S.passage.length || 1;
    const target = S.local.correct / len;
    // critically-damped ease so the local car glides instead of stepping per key
    S.local.vis += (target - S.local.vis) * (1 - Math.exp(-dt / 70));
    if (Math.abs(target - S.local.vis) < 0.0004) S.local.vis = target;

    const renderT = now - INTERP_DELAY_MS;
    const me = myId();
    track.render(
      (id) => (id === me ? S.local.vis : m.fractionOf ? m.fractionOf(id, now) : (S.interp.get(id) ? S.interp.get(id).valueAt(renderT) : 0)),
      st === 'racing',
    );

    if (st === 'waiting') updateWaiting(m, now);
    else if (st === 'countdown') updateCountdown(m, now);
    else if (st === 'racing') updateRacing(m, now);
    else if (st === 'finished') updateFinished(m, now);
  }

  const racing = st === 'racing' && !S.local.done;
  bg.setSpeed(racing ? (game.nitro ? 2.6 : 0.35 + Math.min(1.8, localWpm(now) / 55)) : 0.3);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ------------------------------------------------------------ install (PWA) */

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
let installPrompt = null;
const installBtn = $('#install-btn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice;
  if (outcome === 'accepted') installBtn.hidden = true;
  installPrompt = null;
});
window.addEventListener('appinstalled', () => { installBtn.hidden = true; toast('TypeDash installed — see you tomorrow for the daily', 'success'); });

// Handy in devtools: TypeDash.game.score, TypeDash.account.level, ...
window.TypeDash = { game, account, solo, router, state: S };
