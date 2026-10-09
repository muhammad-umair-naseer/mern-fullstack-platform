import { Net } from './net.js';
import { ServerClock } from './clock.js';
import { Background } from './background.js';
import { Confetti } from './confetti.js';
import { Sound } from './audio.js';
import { Account, pointsForLevel, TITLES } from './account.js';
import { Boards } from './boards.js';
import { Bank } from './bank.js';
import { RushEngine } from './rush.js';
import { AVATARS, avatarFor } from './avatars.js';
import { highlightLines } from './highlight.js';
import { COUNTRIES, flag, detectCountry } from './countries.js';
import { $, escapeHtml, fmtTime, toast, medal } from './ui.js';
import { ICON } from './icons.js';
import { createDemo } from './demo.js';
import { createRoom } from './room.js';
import { createRouter } from './router.js';
import * as Pages from './pages.js';
import { cxAuth } from './cx-auth.js';
import { tellSiteTyping, onSiteKey } from './site-keys.js';

/* ---------------------------------------------------------------- modules */

const net = new Net();
const clock = new ServerClock(net);
const sound = new Sound();
const bg = new Background($('#bg'));
const confetti = new Confetti($('#confetti'));
const account = new Account();
const bank = new Bank();

/* ------------------------------------------------------------------ state */

const S = {
  myId: null,
  room: null,
  reveal: null,
  config: {},
  langs: {},
  lang: localStorage.getItem('gr_lang') || 'mix',
  pending: null,
  hadSession: false,
  unreadChat: 0,
  emotesRendered: false,
  answerInputs: [],
  answered: false,
  lockedAt: null,
  lastTick: -1,
  lastSplash: null,
  revealTimers: [],
  revealShownFor: null,
  resultsShownFor: null,
  lastStandingIds: '',
  hostLang: 'mix',
  rush: null,          // local Solo Rush engine when one is running
  puzzle: null,        // the puzzle currently on screen
};

/** Route a game message to the local Rush engine or the server. */
function send(msg) {
  if (S.rush) { S.rush.handle(msg); return; }
  net.send(msg);
}

const el = {
  home: $('#screen-home'), arena: $('#screen-arena'),
  name: $('#name'), country: $('#country'), flagPrev: $('#flag-preview'), code: $('#code'),
  online: $('#online'), soundBtn: $('#sound-btn'), homeRoom: $('#home-room'),
  avatarRow: $('#avatar-row'), meAvatar: $('#me-avatar'), langSeg: $('#lang-seg'), bankInfo: $('#bank-info'), rtInfo: $('#rt-info'),
  profLevel: $('#prof-level'), profTitle: $('#prof-title'), levelRing: $('#level-ring'), xpFill: $('#xp-fill'), xpText: $('#xp-text'),
  streakBox: $('#streak-box'), streakFlame: $('#streak-flame'), streakDays: $('#streak-days'), streakSub: $('#streak-sub'), streakWeek: $('#streak-week'),
  rankChips: $('#rank-chips'), stPoints: $('#st-points'), stSolved: $('#st-solved'), stAcc: $('#st-acc'), stWins: $('#st-wins'), stRush: $('#st-rush'), stCombo: $('#st-combo'),
  langMastery: $('#lang-mastery'), boards: $('#boards'), rivals: $('#rivals'), achGrid: $('#ach-grid'), achCount: $('#ach-count'),
  pages: $('#pages'), achNext: $('#ach-next'), achArc: $('#ach-ring-arc'), rivalsHero: $('#rivals-hero'), levelRoad: $('#level-road'), levelRoadWrap: $('#level-road-wrap'),
  boardTabs: $('#board-tabs'), boardPodium: $('#board-podium'), friendsName: $('#friends-name'), friendsAvatar: $('#friends-avatar'), codeSlots: $('#code-slots'),
  lobby: $('#lobby-demo'), howDemo: $('#how-demo'), howSteps: $('#how-steps'), hoodBank: $('#hood-bank'), hoodOnline: $('#hood-online'), hoodRtt: $('#hood-rtt'),
  // arena
  roomCode: $('#room-code'), roomType: $('#room-type'), seats: $('#seats'), series: $('#series'), roundPill: $('#round-pill'), lives: $('#lives'),
  timer: $('#timer'), timerArc: $('#timer-arc'), timerText: $('#timer-text'),
  hostBar: $('#host-bar'), botsCheck: $('#bots-check'), hostLang: $('#host-lang'), hostRounds: $('#host-rounds'),
  codeCard: $('#code-card'), codeLang: $('#code-lang'), codeTitle: $('#code-title'), codeDiff: $('#code-diff'), codeEl: $('#code code'), codeFoot: $('#code-foot'),
  terminal: $('#terminal'), termTitle: $('#term-title'), termHint: $('#term-hint'), answerLines: $('#answer-lines'), btnLifeline: $('#btn-lifeline'), btnLock: $('#btn-lock'), termNote: $('#term-note'),
  choices: $('#choices'), lockedOverlay: $('#locked-overlay'), lockedSub: $('#locked-sub'),
  reveal: $('#reveal'), revealCmd: $('#reveal-cmd'), revealStatus: $('#reveal-status'), revealOut: $('#reveal-out'), revealVerdict: $('#reveal-verdict'),
  explain: $('#explain'), explainTags: $('#explain-tags'), explainText: $('#explain-text'), btnLab: $('#btn-lab'), btnNext: $('#btn-next'),
  lab: $('#lab'), labCode: $('#lab-code'), btnLabRun: $('#btn-lab-run'), labStatus: $('#lab-status'), labOut: $('#lab-out'),
  roundResults: $('#round-results'), nextFill: $('#next-fill'), nextText: $('#next-text'),
  players: $('#players'), emoteBar: $('#emote-bar'), splash: $('#splash'), splashEyebrow: $('#splash-eyebrow'), splashBig: $('#splash-big'), splashSub: $('#splash-sub'), callouts: $('#callouts'),
  chat: $('#chat'), chatToggle: $('#chat-toggle'), chatLog: $('#chat-log'), chatInput: $('#chat-input'), connBanner: $('#conn-banner'),
  // results
  results: $('#results'), resultsTitle: $('#results-title'), podium: $('#podium'), resultsBody: $('#results-body'), nextMatch: $('#next-match'),
  myRace: $('#my-race'), mrScore: $('#mr-score'), mrCorrect: $('#mr-correct'), mrCombo: $('#mr-combo'), mrFast: $('#mr-fast'),
  mrXp: $('#mr-xp'), mrLevel: $('#mr-level'), mrXpFill: $('#mr-xp-fill'), mrXpText: $('#mr-xp-text'), mrRanks: $('#mr-ranks'), mrSeries: $('#mr-series'), mrUnlocks: $('#mr-unlocks'),
  btnResultsStay: $('#btn-results-stay'),
  levelup: $('#levelup'), levelupNum: $('#levelup-num'), levelupTitle: $('#levelup-title'), levelupAvatars: $('#levelup-avatars'),
};

const LANG_NAME = { mix: 'JavaScript & Python', js: 'JavaScript', py: 'Python' };

/* ----------------------------------------------------------------- pages */

// each page's own work when it opens; CSS entrances replay by themselves
const ENTER = {
  how: () => howDemo.restart(),
  rankings: () => boards.request(),
  progress: () => requestAnimationFrame(() => Pages.centerRoad(el.levelRoadWrap)),
  friends: () => { el.friendsName.value = el.name.value; paintCode(); },
  rivals: () => renderRivals(),
  signin: () => { si.error.hidden = true; si.country.value = el.country.value; },
};
let backTo = '/';   // where signing in (or picking guest) returns to
const router = createRouter({
  isLocked: () => document.body.classList.contains('arena'),
  savedTab: () => localStorage.getItem('gr_home_tab'),
  onCode: (code) => fillInviteCode(code),
  onEnter: (route) => {
    if (route.key !== 'signin' && route.path) backTo = route.path;
    if (ENTER[route.key]) ENTER[route.key]();
  },
});
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

/* ------------------------------------------------------------- home setup */

const si = {
  form: $('#signin-form'), email: $('#si-email'), password: $('#si-password'), country: $('#si-country'), error: $('#si-error'),
  submit: $('#si-submit'), label: $('#si-submit .si-label'), guest: $('#si-guest'), pwToggle: $('#si-pw-toggle'), title: $('#h-signin'),
  countryTouched: false,
};
const countrySelects = [el.country, si.country];
for (const select of countrySelects) {
  for (const [code, name] of COUNTRIES) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${flag(code)}  ${name}`;
    select.appendChild(opt);
  }
}
el.name.value = localStorage.getItem('gr_name') || '';
el.name.addEventListener('input', () => { el.friendsName.value = el.name.value; renderMe(); });
el.name.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.name.blur(); });
el.name.addEventListener('change', () => { if (net.connected) identify(); });
// Play with friends has its own "Playing as" field; both edit the one name
el.friendsName.value = el.name.value;
el.friendsName.addEventListener('input', () => { el.name.value = el.friendsName.value; renderMe(); });
el.friendsName.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.code.focus(); } });
/** Select a country, adding it to the list first if the list does not carry it. */
function setCountry(code) {
  const cc = /^[A-Z]{2}$/.test(code || '') ? code : 'UN';
  for (const select of countrySelects) {
    if (![...select.options].some((o) => o.value === cc)) {
      const opt = document.createElement('option');
      opt.value = cc;
      opt.textContent = `${flag(cc)}  ${cxAuth.countryName(cc)}`;
      select.insertBefore(opt, select.lastElementChild);
    }
    select.value = cc;
  }
  el.flagPrev.textContent = flag(cc);
  renderMe();
}
setCountry(localStorage.getItem('gr_country') || cxAuth.guessCountry() || detectCountry());
el.code.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#btn-join').click(); });
el.code.addEventListener('input', () => { el.code.value = el.code.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });

const paintCode = Pages.codeSlots(el.codeSlots);
/** An invite link ("/play-with-friends#K7QXP", or the old "/#K7QXP") fills in the code. */
function fillInviteCode(code) {
  if (el.code.value === code) return;
  el.code.value = code;
  paintCode();
  toast(`Room code ${code} filled in. Add your name and join.`, 'info', 5000);
}

const paintSound = (on) => { el.soundBtn.classList.toggle('muted', !on); el.soundBtn.setAttribute('aria-pressed', String(on)); };
paintSound(sound.enabled);
el.soundBtn.addEventListener('click', () => paintSound(sound.toggle()));

// language segment
function renderLangSeg(root, value) {
  root.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.lang === value));
}
renderLangSeg(el.langSeg, S.lang);
el.langSeg.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-lang]');
  if (!b) return;
  S.lang = b.dataset.lang;
  localStorage.setItem('gr_lang', S.lang);
  renderLangSeg(el.langSeg, S.lang);
});
el.hostLang.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-lang]');
  if (!b) return;
  S.hostLang = b.dataset.lang;
  renderLangSeg(el.hostLang, S.hostLang);
});

// the header is transparent over the hero and turns solid once the page scrolls
const topbar = $('.topbar');
window.addEventListener('scroll', () => topbar.classList.toggle('scrolled', window.scrollY > 8), { passive: true });
$('#year').textContent = new Date().getFullYear();

// home shows the live room; How it works runs one player's round and narrates it step by step
const room = createRoom(el.homeRoom, { avatar: account.avatar, country: el.country.value });
const howDemo = createDemo(el.howDemo, { avatar: account.avatar, onPhase: Pages.stepNarrator(el.howSteps) });
Pages.initScoring($('.score-lab'));
Pages.renderRushChart($('#rush-chart'));
Pages.observeReveals();

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
  el.stSolved.textContent = st.correct || 0;
  el.stAcc.textContent = `${st.accuracy || 0}%`;
  el.stWins.textContent = st.wins || 0;
  el.stRush.textContent = (st.bestRush || 0).toLocaleString();
  el.stCombo.textContent = st.bestCombo || 0;
  el.langMastery.innerHTML = ['js', 'py'].map((l) => {
    const s = (st.langs && st.langs[l]) || { rounds: 0, correct: 0 };
    const pct = s.rounds ? Math.round((s.correct / s.rounds) * 100) : 0;
    return `<div class="mastery ${l}"><b><span><i class="lang-dot ${l}"></i>${l === 'js' ? 'JavaScript' : 'Python'}</span><span>${s.correct}/${s.rounds}</span></b><div class="bar"><i style="width:${pct}%"></i></div></div>`;
  }).join('');
  renderStreak();
  renderRankChips();
  renderRivals();
  renderAvatars();
  renderAchievements();
  renderLevelRoad();
}

function renderLevelRoad() {
  const me = avatarFor(account.avatar);
  Pages.renderLevelRoad(el.levelRoad, { level: account.level, frac: account.levelProgress[2], titles: TITLES, avatars: AVATARS, me });
}

function renderStreak() {
  const n = account.streak;
  const today = account.playedToday;
  el.streakBox.classList.toggle('on', n > 0);
  el.streakFlame.textContent = n >= 30 ? '🌋' : n > 0 ? '🔥' : '🕯️';
  el.streakDays.textContent = n > 0 ? `${n}-day streak` : 'No streak yet';
  const bonus = Math.round(Math.min(50, n * 5));
  el.streakSub.textContent = n === 0
    ? 'Each day in a row adds +5% points, up to +50%'
    : today
      ? `Today is banked · +${bonus}% points · best ${plural(account.bestStreak, 'day')}`
      : `Play today to keep it · +${bonus}% points · best ${plural(account.bestStreak, 'day')}`;
  const pips = [];
  for (let i = 6; i >= 0; i--) {
    const covered = today ? i < n : i > 0 && i <= n;
    pips.push(`<i class="${covered ? 'on' : ''}"></i>`);
  }
  el.streakWeek.innerHTML = pips.join('');
}

const RANK_LABEL = { 'points|all|global': 'World', 'points|today|global': 'Today', 'rush|all|global': 'Rush', 'accuracy|all|global': 'Accuracy', 'streak|all|global': 'Streak' };
function rankChip(s) {
  const key = `${s.category}|${s.window}|${s.scope}`;
  const label = RANK_LABEL[key] || (s.scope === 'global' ? s.category : s.scope === 'UN' ? 'Country' : `${flag(s.scope)} ${s.scope}`);
  if (!s.rank) return `<span class="rank-chip empty">${label} —</span>`;
  return `<span class="rank-chip ${s.rank <= 3 ? 'top' : ''}">${label} <b>#${s.rank}</b><small>/${s.of.toLocaleString()}</small></span>`;
}
function renderRankChips() {
  const ranked = account.standings.filter((s) => s.rank);   // unranked boards would just be a row of dashes
  el.rankChips.innerHTML = ranked.length ? ranked.map(rankChip).join('') : '<span class="rank-chip empty">Not ranked yet — finish one match</span>';
}

function renderRivals() {
  const me = avatarFor(account.avatar);
  Pages.renderRivals({ hero: el.rivalsHero, list: el.rivals, rivals: account.rivals, me: { name: el.name.value.trim() || 'You', emoji: me.emoji, color: me.color } });
}

function renderAvatars() {
  const lvl = account.level;
  el.avatarRow.innerHTML = AVATARS.map((a) => {
    const locked = a.unlock > lvl;
    return `<button class="avatar-pick ${locked ? 'locked' : ''} ${a.id === account.avatar ? 'on' : ''}" data-av="${a.id}" data-lvl="L${a.unlock}" style="--c:${a.color}" title="${a.name}${locked ? ` · unlocks at level ${a.unlock}` : ''}">${a.emoji}</button>`;
  }).join('');
  if (!el.avatarRow.dataset.intro) { el.avatarRow.dataset.intro = '1'; setTimeout(() => el.avatarRow.classList.add('settled'), 1600); }   // the pop-in plays once, not on every refresh
  const me = avatarFor(account.avatar);
  el.meAvatar.textContent = me.emoji;
  el.meAvatar.style.setProperty('--c', me.color);
  el.friendsAvatar.textContent = me.emoji;
  el.friendsAvatar.style.setProperty('--c', me.color);
  room.setMe({ avatar: me.id, country: el.country.value });
  howDemo.setMe(me.id);
  renderMe();
  Pages.renderLobby(el.lobby, [me, ...['fox', 'octopus', 'robot', 'ghost'].map(avatarFor)]);
}
el.avatarRow.addEventListener('click', (e) => {
  const b = e.target.closest('.avatar-pick');
  if (!b) return;
  const a = avatarFor(b.dataset.av);
  if (a.unlock > account.level) { toast(`${a.name} unlocks at level ${a.unlock} — keep playing!`, 'warn', 2200); return; }
  if (account.setAvatar(a.id)) {
    sound.ensure(); sound.join(); renderAvatars(); if (net.connected) identify();
    el.meAvatar.classList.remove('swap'); void el.meAvatar.offsetWidth; el.meAvatar.classList.add('swap');
  }
});

function renderAchievements() {
  Pages.renderAchievements({ grid: el.achGrid, next: el.achNext, arc: el.achArc, count: el.achCount, catalogue: account.catalogue, have: new Set(account.achievements), profile: account.stats });
}

const boards = new Boards(el.boards, { onRequest: (q) => net.send({ type: 'board', ...q }), tabsRoot: el.boardTabs, podiumRoot: el.boardPodium });
boards.setCountry(el.country.value);
for (const select of countrySelects) {
  select.addEventListener('change', () => {
    if (select === si.country) si.countryTouched = true;
    setCountry(select.value);
    localStorage.setItem('gr_country', el.country.value);
    boards.setCountry(el.country.value);
    room.setMe({ country: el.country.value });
    if (net.connected) identify();
  });
}
renderProfile();

/* ---------------------------------------------------------------- actions */

function identify() {
  const name = el.name.value.trim() || 'Guest';
  const country = el.country.value || 'UN';
  localStorage.setItem('gr_name', name);
  localStorage.setItem('gr_country', country);
  net.send({ type: 'hello', name, country, countryGuess: cxAuth.guessCountry(), avatar: account.avatar, ...account.credentials });
}

/* Cortexis sign-in (cx-auth.js owns the stored session; this keeps the game in step). */
cxAuth.onChange((s, reason, detail = {}) => {
  if (reason === 'signed-in') {
    account.useCredentials(cxAuth.credentials);
    if (detail.profile) account.setProfile(detail.profile, detail.standings);
    el.name.value = s.name;
    el.friendsName.value = s.name;
    setCountry(s.country);
    boards.setMyId(account.id);
    boards.setCountry(el.country.value);
    renderProfile();
    if (net.connected) identify();   // the server switches this socket to the Cortexis account
  } else if (reason === 'signed-out') {
    net.send({ type: 'signout', token: detail.previous ? detail.previous.token : undefined });
    account.useCredentials({});
    el.name.value = '';
    el.friendsName.value = '';
    localStorage.removeItem('gr_name');
    renderProfile();
    if (net.connected) identify();   // no credentials: the server mints a fresh guest
    if (!detail.fromOtherTab) toast('Signed out. You’re playing as a guest.', 'info', 3200);
  }
  renderMe();
});

/* ------------------------------------------------------- account & sign-in */

/** Everything that shows who you are: header, menus, footer, sign-in and profile. */
function renderMe() {
  const s = cxAuth.state;
  const signedIn = s.status === 'signed-in';
  document.documentElement.dataset.auth = signedIn ? 'signed-in' : 'guest';
  const me = avatarFor(account.avatar);
  const nick = el.name.value.trim() || (signedIn ? s.name : 'Guest');
  for (const n of document.querySelectorAll('[data-me-name]')) n.textContent = nick;
  for (const n of document.querySelectorAll('[data-me-avatar]')) { n.textContent = me.emoji; n.style.setProperty('--c', me.color); }
  for (const n of document.querySelectorAll('[data-me-flag]')) n.textContent = flag(el.country.value);
  const accountLine = signedIn ? (s.cortexisName && s.cortexisName !== nick ? `Cortexis · ${s.cortexisName}` : 'Cortexis account') : 'Guest';
  for (const n of document.querySelectorAll('[data-me-account]')) n.textContent = accountLine;
  for (const n of document.querySelectorAll('[data-me-account-name]')) n.textContent = s.cortexisName || 'your Cortexis account';
  document.querySelector('.acct-btn')?.setAttribute('aria-label', `Account: ${nick}`);   // the name is hidden on phones
  if (si.title) si.title.textContent = signedIn ? 'You’re signed in' : 'Sign in';
}
cxAuth.ready.then((conf) => {
  for (const a of document.querySelectorAll('[data-signup]')) a.href = conf.signupUrl || cxAuth.signupUrl;
  for (const a of document.querySelectorAll('[data-site]')) a.href = conf.siteUrl || a.href;
});

function signInError(message, field) {
  si.error.textContent = message;
  si.error.hidden = false;
  si.error.classList.remove('shake-x');
  void si.error.offsetWidth;
  si.error.classList.add('shake-x');
  if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
}
for (const f of [si.email, si.password]) f.addEventListener('input', () => { f.removeAttribute('aria-invalid'); si.error.hidden = true; });
si.pwToggle.addEventListener('click', () => {
  const show = si.password.type === 'password';
  si.password.type = show ? 'text' : 'password';
  si.pwToggle.textContent = show ? 'Hide' : 'Show';
  si.pwToggle.setAttribute('aria-pressed', String(show));
  si.password.focus();
});
si.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (si.form.classList.contains('busy')) return;
  si.error.hidden = true;
  const email = si.email.value.trim();
  const password = si.password.value;
  if (!email) return signInError('Enter the email you use for Cortexis.', si.email);
  if (!password) return signInError('Enter your password.', si.password);
  const picked = si.countryTouched ? si.country.value : null;
  si.form.classList.add('busy');
  si.submit.disabled = true;
  si.submit.setAttribute('aria-busy', 'true');
  si.label.textContent = 'Signing in…';
  const r = await cxAuth.signIn(email, password);
  si.form.classList.remove('busy');
  si.submit.disabled = false;
  si.submit.removeAttribute('aria-busy');
  si.label.textContent = 'Sign in with Cortexis';
  if (!r.ok) return signInError(r.message, r.reason === 'invalid' ? si.password : null);
  si.password.value = '';
  si.countryTouched = false;
  if (picked && picked !== el.country.value) {   // keep the country chosen on this page
    setCountry(picked);
    localStorage.setItem('gr_country', picked);
    boards.setCountry(picked);
    if (net.connected) identify();
  }
  toast(r.merged ? 'Signed in. Your guest progress is now on your account.' : `Signed in as ${cxAuth.state.name}`, 'success', 3600);
  router.go(backTo === '/sign-in' ? '/' : backTo);
});
si.guest.addEventListener('click', () => {
  cxAuth.playAsGuest();
  router.go(backTo === '/sign-in' ? '/' : backTo);
});

// the header, phone menu, footer and pages share these controls
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-play], [data-rush], [data-signout]');
  if (!t) return;
  router.closeMenu();
  if (t.matches('[data-play]')) whenConnected(() => net.send({ type: 'quick', lang: S.lang }));
  else if (t.matches('[data-rush]')) startRush(S.lang);
  else cxAuth.signOut();
});

function whenConnected(action) {
  sound.ensure();
  if (net.connected) { identify(); action(); return; }
  S.pending = () => { identify(); action(); };
  toast('Connecting to the game server…', 'info', 1500);
}

$('#btn-quick').addEventListener('click', () => whenConnected(() => net.send({ type: 'quick', lang: S.lang })));
$('#btn-rush').addEventListener('click', () => startRush(S.lang));
$('#btn-create').addEventListener('click', () => whenConnected(() => net.send({ type: 'create', lang: S.lang })));
$('#btn-join').addEventListener('click', () => {
  const code = el.code.value.trim().toUpperCase();
  if (code.length < 4) return toast('Enter the 5-letter room code', 'warn');
  whenConnected(() => net.send({ type: 'join', code }));
});
$('#btn-start').addEventListener('click', () => net.send({ type: 'start', bots: el.botsCheck.checked, lang: S.hostLang, rounds: Number(el.hostRounds.value) }));
$('#btn-leave').addEventListener('click', leaveRoom);
$('#btn-results-leave').addEventListener('click', leaveRoom);
el.btnResultsStay.addEventListener('click', () => {
  if (S.room && S.room.mode === 'rush') { const lang = S.room.lang; el.results.hidden = true; startRush(lang); return; }
  el.results.hidden = true;
});

/**
 * Solo Rush runs in this tab. The engine emits server-shaped messages into the
 * same handlers a live match uses; the server deals each puzzle over HTTP and
 * scores the run from its own log when it ends.
 */
async function startRush(lang) {
  sound.ensure();
  if (!account.id) { whenConnected(() => startRush(lang)); return; }   // need an account to save the run to
  identify();
  try { await bank.load(S.config.bankVersion); } catch (_) { toast('Could not load the puzzle bank. Check your connection.', 'error'); return; }
  if (S.rush) S.rush.stop();
  if (S.room && !S.room.local) net.send({ type: 'leave' });
  S.room = null;
  syncSiteTyping();
  S.rush = new RushEngine({
    bank, lang, now: () => clock.now(), credentials: account.credentials,
    identity: { name: el.name.value.trim() || 'Guest', country: el.country.value || 'UN', avatar: account.avatar },
    me: { id: S.myId || 'me', name: el.name.value.trim() || 'Guest', country: el.country.value || 'UN', avatar: account.avatar },
    emit: (msg) => {
      if (msg.type === 'room') onRoom(msg);
      else if (msg.type === 'reveal') onReveal(msg);
      else if (msg.type === 'locked') { const p = S.room && S.room.players.find((x) => x.id === msg.id); if (p) { p.locked = true; p.lockedT = msg.t; renderPlayers(S.room); } }
      else if (msg.type === 'lifeline') showChoices(msg.choices);
      else if (msg.type === 'game_result') onGameResult(msg);
      else if (msg.type === 'error') { toast(msg.message, 'error', 5000); }
    },
  });
}
el.roomCode.addEventListener('click', async () => {
  if (!S.room) return;
  const link = `${location.origin}/play-with-friends#${S.room.code}`;
  try { await navigator.clipboard.writeText(link); toast('Invite link copied to clipboard', 'success'); } catch (_) { toast(link, 'info', 6000); }
});

// chat
el.chatToggle.addEventListener('click', () => {
  el.chat.hidden = !el.chat.hidden;
  if (!el.chat.hidden) { S.unreadChat = 0; el.chatToggle.classList.remove('unread'); el.chatInput.focus(); }
});
$('#chat-close').addEventListener('click', () => { el.chat.hidden = true; focusAnswer(); });
$('#chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = el.chatInput.value.trim();
  if (!text) return;
  net.send({ type: 'chat', text });
  el.chatInput.value = '';
});

// emotes
const sendEmote = (btn) => { net.send({ type: 'emote', e: btn.dataset.e }); btn.classList.remove('sent'); void btn.offsetWidth; btn.classList.add('sent'); };
el.emoteBar.addEventListener('mousedown', (e) => { const b = e.target.closest('button[data-e]'); if (!b) return; e.preventDefault(); sendEmote(b); });
el.emoteBar.addEventListener('touchstart', (e) => { const b = e.target.closest('button[data-e]'); if (!b) return; e.preventDefault(); sendEmote(b); }, { passive: false });
function renderEmoteBar(list) {
  if (S.emotesRendered || !list || !list.length) return;
  S.emotesRendered = true;
  el.emoteBar.innerHTML = list.map((e) => `<button type="button" data-e="${e}" title="React">${e}</button>`).join('');
}

function leaveRoom() {
  if (S.rush) { S.rush.stop(); S.rush = null; } else net.send({ type: 'leave' });
  goHome();
}

function goHome() {
  clearRevealTimers();
  el.chatToggle.hidden = false;
  if (S.rush) { S.rush.stop(); S.rush = null; }
  S.room = null;
  syncSiteTyping();
  S.puzzle = null;
  S.reveal = null;
  S.revealShownFor = null;
  S.resultsShownFor = null;
  S.lastStandingIds = '';
  el.results.hidden = true;
  el.splash.hidden = true;
  el.reveal.hidden = true;
  el.chat.hidden = true;
  el.chatLog.innerHTML = '';
  el.players.innerHTML = '';
  el.hostBar.hidden = true;
  renderProfile();
  boards.request();
  if (location.hash) history.replaceState({ ...(history.state || {}), scroll: 0 }, '', location.pathname);
  switchScreen('home');
}

/** 'home' shows the site pages (whichever one the URL names); 'arena' takes the whole screen for a match. */
function switchScreen(name) {
  const arena = name === 'arena';
  el.pages.classList.toggle('active', !arena);
  el.arena.classList.toggle('active', arena);
  document.body.classList.toggle('arena', arena);   // hides site nav + footer during a match
  for (const a of document.querySelectorAll('.topbar > .brand, .acct, .acct-signin')) a.toggleAttribute('inert', arena);   // Leave is the way out of a match
  router.closeMenu();
  window.scrollTo(0, 0);
  if (arena) document.title = 'Live match · Gotcha Rush';
  else router.refresh();
}

/* ------------------------------------------------------------ networking */

net.on('open', () => {
  el.connBanner.hidden = true;
  clock.start(2000);
  if (S.pending) { const p = S.pending; S.pending = null; p(); }
  else if (S.hadSession) { S.hadSession = false; goHome(); toast('Connection was lost, so you left the room. Jump back in!', 'warn', 4500); }
});
net.on('close', ({ wasConnected }) => { if (wasConnected) el.connBanner.hidden = false; clock.stop(); if (S.room) S.hadSession = true; });

net.on('welcome', (m) => {
  S.myId = m.id;
  clock.seed(m.serverTime);
  el.online.textContent = m.online;
  S.config = m.config || {};
  S.langs = m.langs || {};
  account.catalogue = m.achievements || [];
  boards.setMeta(m.boards);
  renderAchievements();
  const rt = Object.entries(S.langs).map(([k, v]) => `${v.runtime}${k === 'js' ? '' : ''}`).join(' / ');
  el.rtInfo.textContent = rt || 'Node.js / CPython';
  el.bankInfo.textContent = `${S.config.puzzles || 0} verified puzzles`;
  el.hoodBank.textContent = S.config.puzzles || 0;
  el.hoodOnline.textContent = m.online;
  identify();
  boards.request();
  bank.load(S.config.bankVersion).catch(() => {});   // warm the cache so a match round needs only an id
});
net.on('puzzle', (m) => { // fallback delivery for a puzzle missing from the cached bank
  bank.byId.set(m.puzzle.id, m.puzzle);
  if (S.room && S.room.puzzleId === m.puzzle.id) { showPuzzle(m.puzzle); if (S.room.state === 'round') setupAnswer(m.puzzle.lines); }
});
net.on('account', (m) => {
  account.onAccount(m);
  // a new player's country comes from the server (CDN header, else our guess)
  if (m.created && m.profile && m.profile.country) { setCountry(m.profile.country); boards.setCountry(el.country.value); localStorage.setItem('gr_country', el.country.value); }
  cxAuth.syncProfile(m.profile);
  // a returning player on a new device: the nickname comes from their account
  const saved = m.profile && m.profile.name;
  if (saved && !/^Guest(-\w+)?$/i.test(saved) && !el.name.value.trim()) {
    el.name.value = saved;
    el.friendsName.value = saved;
    localStorage.setItem('gr_name', saved);
  }
  boards.setMyId(account.id);
  renderProfile();
  boards.request();
  if (!m.created && account.streak > 0 && !account.playedToday) toast(`🔥 ${account.streak}-day streak — one match today keeps it alive`, 'info', 4200);
});
net.on('board', (m) => boards.setData(m));
net.on('renamed', (m) => { // an admin changed this player's name or country
  el.name.value = el.friendsName.value = m.name;
  localStorage.setItem('gr_name', m.name);
  if (m.country) { setCountry(m.country); boards.setCountry(el.country.value); localStorage.setItem('gr_country', el.country.value); }
});
net.on('online', (m) => { el.online.textContent = m.n; el.hoodOnline.textContent = m.n; });
net.on('error', (m) => { toast(m.message || 'Something went wrong', 'error'); sound.error(); });
net.on('left', () => { if (S.room && !S.room.local) goHome(); });
net.on('player_left', (m) => { if (S.room && S.room.state !== 'finished') toast(`${m.name} left the room`, 'info', 2000); });
net.on('room', (m) => { if (!S.rush) onRoom(m); });
net.on('locked', (m) => { const p = S.room && S.room.players.find((x) => x.id === m.id); if (p) { p.locked = true; p.lockedT = m.t; renderPlayers(S.room); if (m.id !== S.myId) sound.tick(); } });
net.on('lifeline_used', (m) => { const p = S.room && S.room.players.find((x) => x.id === m.id); if (p) { p.lifeline = true; renderPlayers(S.room); } });
net.on('lifeline', (m) => showChoices(m.choices));
net.on('clock', (m) => { if (S.room) S.room.roundEndsAt = m.roundEndsAt; });
net.on('reveal', onReveal);
net.on('game_result', onGameResult);
net.on('chat', onChat);
net.on('emote', (m) => { if (!S.room) return; playerFx(m.id, `<div class="emote">${m.e}</div>`); sound.emote(); });

clock.onUpdate = (c) => { el.hoodRtt.textContent = Math.round(c.rtt); };
net.connect();

/* ------------------------------------------------------------- room state */

function onRoom(m) {
  const prev = S.room;
  // keep transient lock state from `locked` messages when the server didn't change it
  if (prev && prev.roundNo === m.roundNo && prev.state === m.state) {
    for (const p of m.players) { const old = prev.players.find((x) => x.id === p.id); if (old && old.lockedT != null) p.lockedT = old.lockedT; }
  }
  S.room = m;
  syncSiteTyping();
  renderEmoteBar(m.emotes);
  if (!el.arena.classList.contains('active')) switchScreen('arena');

  if (prev && prev.state === 'waiting' && m.state === 'waiting') {
    for (const p of m.players) if (!p.isBot && p.id !== S.myId && !prev.players.some((x) => x.id === p.id)) { toast(`${flag(p.country)} ${p.name} joined`, 'info', 1800); sound.join(); }
  }

  const changed = !prev || prev.state !== m.state || prev.roundNo !== m.roundNo || prev.code !== m.code || prev.gameNo !== m.gameNo;
  if (changed) enterState(m, prev);
  refreshHead(m);
  renderPlayers(m);
}

function enterState(m, prev) {
  const st = m.state;
  el.results.hidden = true;
  el.hostBar.hidden = true;
  if (st !== 'starting') el.splash.hidden = true;

  if (st === 'waiting') {
    clearRevealTimers();
    el.reveal.hidden = true;
    el.terminal.hidden = false;
    setTerminalDisabled(true);
    el.codeCard.classList.add('idle', 'waiting');
    el.codeCard.classList.remove('py');
    el.codeLang.textContent = LANG_NAME[m.lang].replace(' & ', ' + ');
    el.codeLang.className = 'lang-badge';
    el.codeTitle.textContent = m.isPrivate ? 'Waiting for the host to start' : 'Waiting for players…';
    el.codeDiff.innerHTML = '';
    el.codeFoot.innerHTML = '';
    el.codeEl.textContent = m.isPrivate ? 'Share the room code. The host picks the language and round count.' : 'The first snippet appears when the match starts.';
    el.answerLines.innerHTML = '';
    el.hostBar.hidden = !(m.isPrivate && m.mode === 'match' && m.hostId === S.myId);
    if (!el.hostBar.hidden) { S.hostLang = m.lang; renderLangSeg(el.hostLang, S.hostLang); }
    S.lastStandingIds = '';
  } else if (st === 'starting') {
    clearRevealTimers();
    el.reveal.hidden = true;
    el.terminal.hidden = false;
    setTerminalDisabled(true);
    el.splash.hidden = false;
    el.splashEyebrow.textContent = m.mode === 'rush' ? 'SOLO RUSH' : m.gameNo > 1 ? 'NEXT MATCH' : 'MATCH STARTING';
    el.splashSub.textContent = m.mode === 'rush' ? `${LANG_NAME[m.lang]} · ${m.lives} lives · timers shrink every round` : `${LANG_NAME[m.lang]} · ${m.totalRounds} rounds`;
    S.lastSplash = null;
    sound.start();
  } else if (st === 'round') {
    clearRevealTimers();
    el.splash.hidden = true;
    S.reveal = null;
    S.revealShownFor = null;
    el.reveal.hidden = true;
    el.terminal.hidden = false;
    resolvePuzzle(m).then((p) => {
      if (!S.room || S.room.puzzleId !== m.puzzleId) return;
      if (p) showPuzzle(p);
      setupAnswer(m.lines || (p ? p.lines : 1));
    });
    if (prev && prev.state !== 'round') sound.go();
  } else if (st === 'reveal') {
    if (m.reveal && S.revealShownFor !== m.reveal.roundNo) onReveal(m.reveal); // reconnect / late join
  } else if (st === 'finished') {
    clearRevealTimers();
    setTerminalDisabled(true);
    if (S.resultsShownFor !== `${m.code}:${m.gameNo}`) { S.resultsShownFor = `${m.code}:${m.gameNo}`; showResults(m); }
  }
}

/** The snippet comes from the cached bank; the wire only carried its id. */
async function resolvePuzzle(m) {
  if (!m.puzzleId) return null;
  let p = bank.get(m.puzzleId);
  if (!p) { try { await bank.load(S.config.bankVersion); } catch (_) { /* offline */ } p = bank.get(m.puzzleId); }
  if (!p && !m.local) net.send({ type: 'puzzle', id: m.puzzleId });
  return p;
}

function refreshHead(m) {
  el.roomCode.textContent = m.code;
  el.roomType.textContent = m.mode === 'rush' ? 'Solo Rush' : m.isPrivate ? (m.ranked ? 'Private' : 'Friendly') : 'Ranked';
  el.roomType.className = `badge ${m.mode === 'rush' ? 'rush' : m.isPrivate ? 'private' : 'public'}`;
  el.roomType.title = m.ranked ? 'Ranked — points count towards the world boards' : 'Friendly — no ranked points, but streak and head-to-head still count';
  el.seats.textContent = m.mode === 'rush' ? '' : `${m.players.length}/${m.maxPlayers}`;
  el.roomCode.hidden = m.mode === 'rush';
  el.emoteBar.hidden = m.mode === 'rush';
  el.chatToggle.hidden = m.mode === 'rush';
  renderSeries(m);
  const rushLives = m.mode === 'rush';
  el.lives.hidden = !rushLives;
  if (rushLives) {
    const me = m.players.find((p) => p.id === S.myId);
    const lives = me ? me.lives : m.lives;
    const total = window.GotchaScoring.RULES.RUSH_LIVES;
    el.lives.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < lives ? '' : 'lost'}">${ICON.heart}</i>`).join('');
  }
  if (m.state === 'round' || m.state === 'reveal') {
    el.roundPill.textContent = m.mode === 'rush' ? `Round ${m.roundNo}` : `Round ${m.roundNo} of ${m.totalRounds}`;
  } else if (m.state === 'finished') {
    el.roundPill.textContent = m.mode === 'rush' ? 'Run over' : 'Match over';
  } else if (m.state === 'starting') {
    el.roundPill.textContent = 'Starting…';
  }
}

function renderSeries(m) {
  const rows = (m.series || []);
  const show = m.mode === 'match' && m.isPrivate && rows.length > 1;
  el.series.hidden = !show;
  el.mrSeries.hidden = !show;
  if (!show) return;
  el.series.textContent = `Series: ${rows.map((r) => `${r.name} ${r.wins}`).join(' · ')}`;
  el.mrSeries.innerHTML = '<span class="mr-series-label">Room series</span>' + rows.map((r) => `<span class="series-pill ${r.id === S.myId ? 'me' : ''}" style="--c:${avatarFor(r.avatar).color}">${flag(r.country)} ${escapeHtml(r.name)} <b>${r.wins}</b></span>`).join('');
}

/* --------------------------------------------------------------- puzzle */

function showPuzzle(p) {
  S.puzzle = p;
  el.codeCard.classList.remove('idle', 'waiting');
  el.codeLang.textContent = p.langName;
  el.codeLang.className = `lang-badge ${p.lang}`;
  el.codeTitle.textContent = p.title;
  el.codeDiff.dataset.d = p.difficulty;
  el.codeDiff.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < p.difficulty ? 'on' : ''}"></i>`).join('');
  el.codeDiff.title = `Difficulty ${p.difficulty}/5`;
  el.codeFoot.innerHTML = (p.tags || []).map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('');
  const lines = highlightLines(p.code, p.lang);
  el.codeEl.innerHTML = lines.map((html, i) => `<div class="ln" style="animation-delay:${Math.min(i * 60, 1200)}ms"><i>${i + 1}</i><span>${html}</span></div>`).join('');
  el.revealCmd.textContent = p.lang === 'js' ? '$ node main.js' : '$ python3 main.py';
}

/* --------------------------------------------------------------- answer */

function setTerminalDisabled(off) {
  el.terminal.classList.toggle('disabled', off);
  el.terminal.classList.toggle('active', !off);
  el.btnLock.disabled = off;
  el.btnLifeline.disabled = off;
  if (off) { el.lockedOverlay.hidden = true; el.choices.hidden = true; el.choices.innerHTML = ''; }
}

function setupAnswer(n) {
  S.answered = false;
  S.lockedAt = null;
  S.answerInputs = [];
  el.lockedOverlay.hidden = true;
  el.choices.hidden = true;
  el.choices.innerHTML = '';
  el.btnLifeline.disabled = false;
  el.btnLifeline.textContent = '🛟 Lifeline';
  el.termTitle.textContent = `stdout — ${plural(n, 'line')} of output`;
  el.termHint.textContent = 'whitespace ignored · case matters';
  el.answerLines.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const row = document.createElement('div');
    row.className = 'term-line';
    row.innerHTML = `<span class="prompt">${i + 1}</span><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${i === 0 ? 'what does line 1 print?' : `line ${i + 1}`}" aria-label="Output line ${i + 1}">`;
    const input = row.querySelector('input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey || i === n - 1) lockIn();
        else S.answerInputs[i + 1].focus();
      } else if (e.key === 'ArrowDown' && i < n - 1) { e.preventDefault(); S.answerInputs[i + 1].focus(); }
      else if (e.key === 'ArrowUp' && i > 0) { e.preventDefault(); S.answerInputs[i - 1].focus(); }
    });
    input.addEventListener('input', () => sound.key());
    el.answerLines.appendChild(row);
    S.answerInputs.push(input);
  }
  setTerminalDisabled(false);
  requestAnimationFrame(() => S.answerInputs[0] && S.answerInputs[0].focus({ preventScroll: true }));
}

function focusAnswer() {
  if (S.room && S.room.state === 'round' && !S.answered) {
    const empty = S.answerInputs.find((i) => !i.value) || S.answerInputs[0];
    if (empty) empty.focus({ preventScroll: true });
  }
}

/*
 * Inside the website's frame (js/site-keys.js). A click on the site around
 * the game takes the keyboard away from this document; the site then
 * forwards the keys into the answer line being typed, and hands the focus
 * back so the next key lands there directly.
 */
let lastAnswerInput = null;
document.addEventListener('focusin', (e) => {
  if ((S.answerInputs || []).includes(e.target)) lastAnswerInput = e.target;
});
const answerTarget = () => {
  const inputs = S.answerInputs || [];
  return inputs.includes(lastAnswerInput) ? lastAnswerInput : inputs.find((i) => !i.value) || inputs[0];
};
const takingAnswers = () => !!S.room && S.room.state === 'round' && !S.answered;
function syncSiteTyping() {
  tellSiteTyping(takingAnswers());
}
onSiteKey((key) => {
  if (!takingAnswers()) return;
  const input = answerTarget();
  if (!input || input.disabled) return;
  input.focus({ preventScroll: true });
  if (key === 'Enter') {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    return;
  }
  input.value = key === 'Backspace' ? input.value.slice(0, -1) : input.value + key;
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
window.addEventListener('focus', () => {
  if (!takingAnswers()) return;
  const input = answerTarget();
  if (input) input.focus({ preventScroll: true });
});

function lockIn(lines) {
  if (S.answered || !S.room || S.room.state !== 'round') return;
  const answer = lines || S.answerInputs.map((i) => i.value);
  if (!lines && answer.every((l) => !l.trim())) { toast('Type at least one line first (or use the lifeline)', 'warn', 2000); return; }
  S.answered = true;
  syncSiteTyping();
  S.lockedAt = clock.now();
  send({ type: 'answer', lines: answer });
  S.answerInputs.forEach((i) => { i.disabled = true; });
  el.choices.hidden = true;
  el.lockedOverlay.hidden = false;
  el.lockedSub.textContent = 'Waiting for the room…';
  el.btnLock.disabled = true;
  el.btnLifeline.disabled = true;
  sound.lock();
}
el.btnLock.addEventListener('click', () => lockIn());
el.btnLifeline.addEventListener('click', () => {
  if (S.answered) return;
  send({ type: 'lifeline' });
  el.btnLifeline.disabled = true;
  el.btnLifeline.textContent = '🛟 Used · ½ points';
  sound.lifeline();
});

function showChoices(choices) {
  if (S.answered) return;
  el.choices.hidden = false;
  el.choices.innerHTML = choices.map((c, i) => `<button class="choice" data-i="${i}" style="animation-delay:${i * 70}ms"><span class="k">${String.fromCharCode(65 + i)}</span>${escapeHtml(c)}</button>`).join('');
  el.choices.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => lockIn(choices[Number(b.dataset.i)].split('\n'))));
  el.termHint.textContent = 'pick one — this round pays half';
  // on phones the choices land below the fold, so bring them up
  if (window.matchMedia('(max-width: 960px)').matches) {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => el.choices.scrollIntoView({ block: 'nearest', behavior: smooth ? 'smooth' : 'auto' }));
  }
}

document.addEventListener('keydown', (e) => {
  if (!S.room || document.activeElement === el.chatInput) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (S.room.state === 'round' && !S.answered && e.key.length === 1 && !S.answerInputs.includes(document.activeElement)) focusAnswer();
  if (S.room.state === 'reveal' && S.room.mode === 'rush' && (e.key === 'Enter' || e.key === ' ') && !el.btnNext.hidden) { e.preventDefault(); el.btnNext.click(); }
});

/* --------------------------------------------------------------- players */

function renderPlayers(m) {
  const standings = [...m.players].sort((a, b) => b.score - a.score || (a.isBot ? 1 : 0) - (b.isBot ? 1 : 0));
  const ids = standings.map((p) => p.id).join(',');
  const before = new Map();
  for (const card of el.players.children) before.set(card.dataset.id, card.getBoundingClientRect());
  const seen = new Set();
  standings.forEach((p) => {
    seen.add(p.id);
    let card = el.players.querySelector(`.pl[data-id="${p.id}"]`);
    const av = avatarFor(p.avatar);
    if (!card) {
      card = document.createElement('div');
      card.className = 'pl';
      card.dataset.id = p.id;
      card.innerHTML = `<div class="av"><span class="face"></span><span class="st"></span></div><div class="info"><div class="nm"><span></span></div><div class="sub"></div></div><div class="score"><b>0</b><small></small></div><div class="fx"></div>`;
      el.players.appendChild(card);
    }
    card.style.setProperty('--c', av.color);
    card.classList.toggle('me', p.id === S.myId);
    card.querySelector('.face').textContent = av.emoji;
    card.querySelector('.nm span').textContent = p.name;
    card.querySelector('.nm').innerHTML = `${flag(p.country)} <span>${escapeHtml(p.name)}</span>${p.isBot ? '<span class="tag">BOT</span>' : ''}${p.id === S.myId ? '<span class="tag">YOU</span>' : ''}`;
    const scoreEl = card.querySelector('.score b');
    if (scoreEl.textContent !== String(p.score)) tweenNumber(scoreEl, Number(scoreEl.textContent.replace(/,/g, '')) || 0, p.score);
    const rr = S.reveal && S.reveal.results.find((r) => r.id === p.id);
    const sub = card.querySelector('.sub');
    const st = card.querySelector('.st');
    card.classList.remove('thinking', 'locked');
    if (m.state === 'round') {
      if (p.locked) { card.classList.add('locked'); st.textContent = '✓'; sub.innerHTML = `locked in${p.lockedT != null ? ` · ${(p.lockedT / 1000).toFixed(1)}s` : ''}${p.lifeline ? ' · 🛟' : ''}`; }
      else { card.classList.add('thinking'); st.textContent = '…'; sub.innerHTML = `<span class="dots"><i></i><i></i><i></i></span>thinking${p.lifeline ? ' · 🛟' : ''}`; }
    } else if (m.state === 'reveal' && rr) {
      st.textContent = rr.correct ? '✓' : rr.answered ? '✗' : '–';
      if (rr.correct) card.classList.add('locked');
      sub.innerHTML = rr.correct ? `<span style="color:var(--ok-ink)">correct</span> · +${rr.points}` : rr.answered ? `<span style="color:var(--bad)">wrong</span>${rr.points ? ` · +${rr.points}` : ''}` : 'no answer';
    } else if (m.state === 'finished') {
      st.textContent = medal(p.rank || 0).replace('#', '');
      sub.textContent = p.rank ? medal(p.rank) : '';
    } else {
      st.textContent = '';
      sub.textContent = p.isBot ? 'bot' : p.connected === false ? 'reconnecting…' : 'ready';
    }
    card.querySelector('.score small').innerHTML = p.combo > 1 ? `<span class="combo ${p.combo >= 4 ? 'hot' : ''}">🔥 ×${p.combo}</span>` : (m.mode === 'rush' ? `<span class="lives">${ICON.heart.repeat(Math.max(0, p.lives || 0))}</span>` : 'pts');
  });
  for (const card of [...el.players.children]) {
    if (!seen.has(card.dataset.id)) { card.classList.add('leaving'); setTimeout(() => card.remove(), 300); }
  }
  // FLIP reorder
  if (ids !== S.lastStandingIds) {
    const prevIds = S.lastStandingIds.split(',');
    S.lastStandingIds = ids;
    standings.forEach((p) => { const c = el.players.querySelector(`.pl[data-id="${p.id}"]`); if (c) el.players.appendChild(c); });
    for (const card of el.players.children) {
      const was = before.get(card.dataset.id);
      if (was == null) continue;
      const now = card.getBoundingClientRect();
      const dx = was.left - now.left;   // the strip runs sideways on phones, down the sidebar on desktop
      const dy = was.top - now.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        card.style.transition = 'none';
        card.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { card.style.transition = ''; card.style.transform = ''; }));
        if (prevIds.indexOf(card.dataset.id) > standings.findIndex((p) => p.id === card.dataset.id)) { card.classList.remove('rank-up'); void card.offsetWidth; card.classList.add('rank-up'); }
      }
    }
  }
}

function tweenNumber(node, from, to, ms = 650) {
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    const v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    node.textContent = v.toLocaleString();
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function playerFx(id, html) {
  const card = el.players.querySelector(`.pl[data-id="${id}"] .fx`);
  if (!card) return;
  const old = card.querySelector('.emote');
  if (old && html.includes('emote')) old.remove();
  card.insertAdjacentHTML('beforeend', html);
  const node = card.lastElementChild;
  setTimeout(() => node.remove(), 2200);
}

function callout(text, cls = '', ms = 1200) {
  const node = document.createElement('div');
  node.className = `callout ${cls}`;
  node.textContent = text;
  el.callouts.appendChild(node);
  while (el.callouts.children.length > 3) el.callouts.firstChild.remove();
  setTimeout(() => node.remove(), ms);
}

/* --------------------------------------------------------------- reveal */

function clearRevealTimers() {
  for (const t of S.revealTimers) clearTimeout(t);
  S.revealTimers = [];
}
const later = (fn, ms) => { S.revealTimers.push(setTimeout(fn, ms)); };

function onReveal(rv) {
  if (!S.room) return;
  if (S.revealShownFor === rv.roundNo && S.reveal) return;
  clearRevealTimers();
  S.reveal = rv;
  S.revealShownFor = rv.roundNo;
  S.room.state = 'reveal';
  S.room.revealUntil = rv.revealUntil;
  el.terminal.hidden = true;
  el.reveal.hidden = false;
  el.revealStatus.textContent = 'running…';
  el.revealStatus.className = 'reveal-status';
  el.revealOut.innerHTML = '<span class="reveal-cursor"></span>';
  el.revealVerdict.className = 'reveal-verdict';
  el.revealVerdict.innerHTML = '';
  el.explain.hidden = true;
  el.lab.hidden = true;
  el.labOut.textContent = '';
  el.roundResults.innerHTML = '';
  el.btnNext.hidden = true;
  el.btnLab.hidden = !S.config.lab;
  sound.run();

  const mine = rv.results.find((r) => r.id === S.myId);
  const myAns = mine ? mine.answer : [];
  const lines = rv.output;
  const isRush = S.room.mode === 'rush';

  // 1. print the real output line by line, judged against my answer
  lines.forEach((line, i) => {
    later(() => {
      const ok = mine ? mine.lines[i] : false;
      const typed = myAns[i];
      const cls = !mine || !mine.answered ? 'none' : ok ? 'ok' : 'bad';
      const mark = cls === 'ok' ? '✓' : cls === 'bad' ? '✗' : '·';
      const mineHtml = cls === 'bad' ? `<span class="mine">${typed === undefined || typed === '' ? '(blank)' : escapeHtml(typed)}</span>` : cls === 'none' ? '<span class="mine">no answer</span>' : '';
      const cursor = el.revealOut.querySelector('.reveal-cursor');
      if (cursor) cursor.remove();
      el.revealOut.insertAdjacentHTML('beforeend', `<div class="out-line ${cls}"><span class="mark">${mark}</span><span class="real">${escapeHtml(line)}</span>${mineHtml}</div>`);
      if (i < lines.length - 1) el.revealOut.insertAdjacentHTML('beforeend', '<span class="reveal-cursor"></span>');
      sound.print();
    }, 650 + i * 420);
  });
  // extra lines I typed beyond the real output
  if (mine && myAns.length > lines.length) {
    later(() => {
      myAns.slice(lines.length).forEach((l) => el.revealOut.insertAdjacentHTML('beforeend', `<div class="out-line extra"><span class="mark">✗</span><span class="real">${escapeHtml(l)}</span><span class="mine">extra line</span></div>`));
    }, 650 + lines.length * 420);
  }

  // 2. verdict
  const tVerdict = 650 + lines.length * 420 + 250;
  later(() => {
    el.revealStatus.textContent = 'exit 0';
    el.revealStatus.className = 'reveal-status done';
    if (!mine) return;
    if (mine.correct) {
      const bits = [`+${mine.points} pts`];
      if (mine.bonus.speed) bits.push(`speed +${mine.bonus.speed}`);
      if (mine.bonus.first) bits.push(isRush ? `clean +${mine.bonus.first}` : `first in the room +${mine.bonus.first}`);
      if (mine.bonus.combo > 1) bits.push(`combo ×${mine.bonus.combo.toFixed(2)}`);
      if (mine.lifeline) bits.push('lifeline ½');
      el.revealVerdict.className = 'reveal-verdict ok';
      el.revealVerdict.innerHTML = `Correct! <small>${bits.join(' · ')}</small>`;
      sound.correct();
      callout(`+${mine.points}`, 'ok');
      playerFx(S.myId, `<div class="pl-pop ok">+${mine.points}</div>`);
      if (mine.combo >= 2) { later(() => { callout(`COMBO ×${mine.combo}`, 'combo'); sound.combo(mine.combo); }, 500); }
      if (mine.bonus.first && !isRush) { later(() => { callout('FIRST!', 'first'); sound.first(); }, mine.combo >= 2 ? 1000 : 500); }
      if (mine.combo >= 3) confetti.burst(40 + mine.combo * 10);
    } else {
      const partial = mine.answered && mine.lines.some(Boolean);
      el.revealVerdict.className = `reveal-verdict ${partial ? 'partial' : 'bad'}`;
      el.revealVerdict.innerHTML = mine.answered
        ? `${partial ? 'Close.' : 'Nope.'} <small>${partial ? `${mine.lines.filter(Boolean).length}/${lines.length} lines · +${mine.points}` : 'combo reset'}</small>`
        : 'Time\'s up. <small>no answer locked in</small>';
      sound.wrong();
      document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake');
      playerFx(S.myId, `<div class="pl-pop bad">${partial ? `+${mine.points}` : 'miss'}</div>`);
      if (isRush) { later(() => { callout('LIFE LOST', 'life', 1400); sound.lifeLost(); refreshHead(S.room); }, 400); }
    }
  }, tVerdict);

  // 3. explanation, results, next
  later(() => {
    el.explainTags.innerHTML = (rv.tags || []).map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('');
    el.explainText.textContent = rv.explain;
    el.explain.hidden = false;
    el.btnNext.hidden = !isRush;
    el.btnNext.textContent = rv.last ? 'See results' : 'Next round';
    renderRoundResults(rv);
    if (S.room) renderPlayers(S.room);
  }, tVerdict + 500);
}

function renderRoundResults(rv) {
  const order = [...rv.results].sort((a, b) => b.points - a.points || (a.ms ?? Infinity) - (b.ms ?? Infinity));
  el.roundResults.innerHTML = order.map((r, i) => {
    const p = S.room.players.find((x) => x.id === r.id) || {};
    const av = avatarFor(p.avatar);
    const st = r.correct ? `<span class="st ok">✓</span>` : r.answered ? `<span class="st bad">✗</span>` : `<span class="st none">–</span>`;
    const shown = r.answered ? r.answer.join(' ⏎ ') : '';
    return `<div class="rr ${r.id === S.myId ? 'me' : ''}" style="--c:${av.color};animation-delay:${i * 60}ms"><div class="av">${av.emoji}</div><div class="nm">${escapeHtml(p.name || '?')}${r.ms != null ? `<small>${(r.ms / 1000).toFixed(1)}s</small>` : ''}${r.lifeline ? '<small>🛟</small>' : ''}${shown && !r.correct ? `<small title="their answer">${escapeHtml(shown.slice(0, 40))}${shown.length > 40 ? '…' : ''}</small>` : ''}</div>${st}<div class="pts">${r.points ? `+${r.points}` : ''}</div></div>`;
  }).join('');
}

el.btnNext.addEventListener('click', () => { send({ type: 'next' }); el.btnNext.disabled = true; setTimeout(() => { el.btnNext.disabled = false; }, 600); });

// Lab: edit the snippet and re-run it on the server's sandboxed runner
el.btnLab.addEventListener('click', () => {
  el.lab.hidden = !el.lab.hidden;
  if (!el.lab.hidden && !el.labCode.value && S.puzzle) el.labCode.value = S.puzzle.code;
});
el.btnLabRun.addEventListener('click', async () => {
  el.labStatus.textContent = 'running…';
  el.labOut.className = 'lab-out';
  el.labOut.textContent = '';
  try {
    const r = await fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: S.puzzle ? S.puzzle.lang : 'js', code: el.labCode.value }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
    el.labOut.textContent = (j.stdout || '') + (j.stderr ? `\n${j.stderr}` : '');
    if (!j.ok) el.labOut.className = 'lab-out err';
    el.labStatus.textContent = j.timedOut ? 'timed out' : `${j.ms} ms`;
  } catch (err) {
    el.labOut.className = 'lab-out err';
    el.labOut.textContent = err.message;
    el.labStatus.textContent = '';
  }
});

/* --------------------------------------------------------------- results */

function showResults(m) {
  const results = m.results || [];
  const mine = results.find((r) => r.id === S.myId);
  const isRush = m.mode === 'rush';
  el.resultsTitle.innerHTML = isRush ? `Run over · <em>${mine ? mine.score.toLocaleString() : 0} points</em>` : mine && mine.rank === 1 ? 'You <em>won</em> the match' : mine ? `You placed <em>${medal(mine.rank)}</em>` : 'Match <em>results</em>';
  const top = isRush ? [] : [results[1], results[0], results[2]];
  el.podium.hidden = isRush;
  el.podium.innerHTML = top.map((r, i) => {
    if (!r) return '<div class="podium-slot empty"></div>';
    const place = i === 1 ? 1 : i === 0 ? 2 : 3;
    const av = avatarFor(r.avatar);
    return `<div class="podium-slot p${place} ${r.id === S.myId ? 'me' : ''}" style="--c:${av.color}"><div class="podium-av">${av.emoji}</div><div class="podium-name">${flag(r.country)} ${escapeHtml(r.name)}</div><div class="podium-score">${r.score.toLocaleString()}</div><div class="podium-block"><span>${medal(place)}</span></div></div>`;
  }).join('');
  el.resultsBody.innerHTML = results.map((r) => `
    <tr class="${r.id === S.myId ? 'me' : ''}" style="--c:${avatarFor(r.avatar).color}"><td>${medal(r.rank)}</td><td><span class="swatch"></span>${flag(r.country)} ${escapeHtml(r.name)}${r.isBot ? ' <span class="tag">BOT</span>' : ''}</td><td class="num">${r.correct}/${r.rounds}</td><td class="num">${r.bestCombo}</td><td class="num score">${r.score.toLocaleString()}</td></tr>`).join('');
  el.myRace.hidden = !mine;
  if (mine) {
    el.mrScore.textContent = '0';
    setTimeout(() => tweenNumber(el.mrScore, 0, mine.score, 1100), 450);   // the score counts up as the card lands
    el.mrCorrect.textContent = `${mine.correct}/${mine.rounds}`;
    el.mrCombo.textContent = mine.bestCombo;
    el.mrFast.textContent = mine.fastestMs != null ? `${(mine.fastestMs / 1000).toFixed(1)}s` : '–';
    el.mrXp.textContent = 'settling…';
    el.mrUnlocks.innerHTML = '';
    el.mrRanks.innerHTML = '';
  }
  el.btnResultsStay.textContent = isRush ? 'Run again' : m.isPrivate ? 'Stay in room' : 'Stay & play again';
  el.results.hidden = false;
  if (mine && mine.rank === 1 && !isRush) { confetti.burst(160); sound.win(); } else sound.finish();
  if (S.pendingResult) onGameResult(S.pendingResult);
}

function onGameResult(msg) {
  if (!S.room || S.room.state !== 'finished') { S.pendingResult = msg; return; } // results modal not up yet
  S.pendingResult = null;
  const out = account.applyResult(msg);
  boards.setMyId(account.id);
  renderProfile();
  boards.request();
  const lvl = account.level;
  el.mrXp.textContent = out.ranked ? `+${out.points.toLocaleString()} points` : 'Friendly — no ranked points';
  el.mrXp.classList.toggle('unranked', !out.ranked);
  el.mrLevel.textContent = `Level ${lvl} · ${account.title}`;
  const lo = pointsForLevel(lvl);
  const hi = pointsForLevel(lvl + 1);
  const startPts = Math.max(lo, account.points - out.points);
  const startFrac = out.leveledUp ? 0 : (startPts - lo) / (hi - lo);
  const endFrac = (account.points - lo) / (hi - lo);
  el.mrXpFill.style.transition = 'none';
  el.mrXpFill.style.width = `${Math.round(startFrac * 100)}%`;
  requestAnimationFrame(() => requestAnimationFrame(() => { el.mrXpFill.style.transition = 'width 1.1s cubic-bezier(.2,.9,.2,1)'; el.mrXpFill.style.width = `${Math.round(endFrac * 100)}%`; }));
  el.mrXpText.textContent = `${(account.points - lo).toLocaleString()} / ${(hi - lo).toLocaleString()} points to level ${lvl + 1}`;
  el.mrRanks.innerHTML = account.standings.filter((s) => s.rank).map(rankChip).join('');
  const chips = [];
  if (out.perfect && out.mode === 'match') chips.push('<span class="chip ach-chip">💎 Perfect match +150</span>');
  if (out.streakEvent === 'extended') chips.push(`<span class="chip streak-chip">🔥 ${out.streak}-day streak</span>`);
  if (out.streakEvent === 'started') chips.push('<span class="chip streak-chip">🔥 Streak started</span>');
  if (out.streakEvent === 'reset') chips.push('<span class="chip streak-chip dim">🕯️ Streak restarted</span>');
  for (const a of out.unlocked) chips.push(`<span class="chip ach-chip" title="${escapeHtml(a.desc)}">${a.icon} ${escapeHtml(a.name)}</span>`);
  for (const a of out.newAvatars) chips.push(`<span class="chip av-chip">${a.emoji} ${escapeHtml(a.name)} unlocked</span>`);
  el.mrUnlocks.innerHTML = chips.join('');
  if (out.streakEvent === 'extended' || out.streakEvent === 'started') setTimeout(() => toast(`🔥 ${out.streak}-day streak — +${Math.min(50, out.streak * 5)}% points`, 'success', 3000), 500);
  if (out.unlocked.length) {
    setTimeout(() => sound.achievement(), 400);
    out.unlocked.slice(0, 2).forEach((a, i) => setTimeout(() => toast(`${a.icon} Achievement: ${a.name}`, 'success', 2600), 900 + i * 900));
    if (out.unlocked.length > 2) setTimeout(() => toast(`+${out.unlocked.length - 2} more achievements unlocked`, 'success', 2600), 2700);
  }
  if (out.leveledUp) setTimeout(() => showLevelUp(out), 900);
  if (S.room) renderSeries(S.room);
}

function showLevelUp(out) {
  el.levelupNum.textContent = out.levelAfter;
  el.levelupTitle.textContent = account.title;
  el.levelupAvatars.innerHTML = out.newAvatars.map((a) => `<div class="lu-av" style="--c:${a.color}"><div class="av">${a.emoji}</div><span>${escapeHtml(a.name)} unlocked</span></div>`).join('');
  el.levelup.classList.remove('out');
  el.levelup.hidden = false;
  sound.levelUp();
  confetti.burst(200);
  setTimeout(() => el.levelup.classList.add('out'), 3400);
  setTimeout(() => { el.levelup.hidden = true; }, 3800);
}
el.levelup.addEventListener('click', () => { el.levelup.hidden = true; });

function onChat(m) {
  const av = avatarFor(m.from.avatar);
  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = `<span class="who" style="--c:${av.color}">${av.emoji} ${escapeHtml(m.from.name)}</span> ${escapeHtml(m.text)}`;
  el.chatLog.appendChild(div);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
  if (el.chat.hidden && m.from.id !== S.myId) { S.unreadChat++; el.chatToggle.classList.add('unread'); el.chatToggle.dataset.count = S.unreadChat > 9 ? '9+' : String(S.unreadChat); }
}

/* ------------------------------------------------------------ render loop */

const ARC = 119.4;
function frame() {
  const now = clock.now();
  const m = S.room;
  if (m) {
    if (m.state === 'waiting') {
      if (m.mode === 'match' && !m.isPrivate && m.lobbyDeadline) {
        const secs = Math.max(0, Math.ceil((m.lobbyDeadline - now) / 1000));
        el.roundPill.textContent = `Match starts in ${secs}s${m.players.length < m.maxPlayers ? ' · bots fill empty seats' : ''}`;
      } else if (m.isPrivate) {
        el.roundPill.textContent = m.hostId === S.myId ? 'You are the host' : 'Waiting for the host';
      } else el.roundPill.textContent = 'Looking for players…';
      el.timer.classList.add('idle');
      el.timerText.textContent = '–';
    } else if (m.state === 'starting') {
      const secs = Math.max(0, Math.ceil((m.startEndsAt - now) / 1000));
      if (secs !== S.lastSplash) { S.lastSplash = secs; el.splashBig.textContent = secs > 0 ? secs : 'GO'; el.splashBig.classList.remove('pop'); void el.splashBig.offsetWidth; el.splashBig.classList.add('pop'); if (secs > 0) sound.count(); }
    } else if (m.state === 'round') {
      const total = m.roundMs;
      const left = Math.max(0, m.roundEndsAt - now);
      const f = left / total;
      el.timer.classList.remove('idle');
      el.timerArc.style.strokeDashoffset = (ARC * (1 - f)).toFixed(1);
      const secs = Math.ceil(left / 1000);
      el.timerText.textContent = secs;
      el.timer.classList.toggle('warn', left < 10000 && left >= 5000);
      el.timer.classList.toggle('urgent', left < 5000);
      if (secs !== S.lastTick) { S.lastTick = secs; if (left < 5000 && left > 0 && !S.answered) sound.tickUrgent(); }
      if (S.answered) el.lockedSub.textContent = left > 0 ? `Waiting for the room · ${secs}s` : 'Grading…';
    } else if (m.state === 'reveal') {
      const left = Math.max(0, (m.revealUntil || now) - now);
      const total = S.reveal ? Math.max(1, m.revealUntil - S.reveal.serverTime) : 1;
      el.nextFill.style.width = `${Math.round((1 - left / total) * 100)}%`;
      const last = S.reveal && S.reveal.last;
      el.nextText.textContent = m.mode === 'rush' ? (last ? `Results in ${Math.ceil(left / 1000)}s — or press Next` : `Next round in ${Math.ceil(left / 1000)}s — or press Next`) : `${last ? 'Results' : `Round ${m.roundNo + 1}`} in ${Math.ceil(left / 1000)}s`;
      el.timer.classList.add('idle');
      el.timerText.textContent = '–';
    } else if (m.state === 'finished') {
      const secs = Math.max(0, Math.ceil((m.resultsUntil - now) / 1000));
      el.nextMatch.textContent = m.mode === 'rush' ? 'Run again whenever you like' : m.isPrivate ? 'Back to the lobby soon' : `Next match starts in ${secs}s`;
    }
  }
  const intense = m && m.state === 'round' && !S.answered ? 1.4 : m && m.state === 'reveal' ? 0.8 : 0.35;
  bg.setSpeed(intense);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

router.start();
// the photo on Play with friends loads lazily; fetch it once the first page is up
(window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => { const img = new Image(); img.src = '/img/friends-720.webp'; });

window.GotchaRush = { account, boards, bank, router, state: S };
