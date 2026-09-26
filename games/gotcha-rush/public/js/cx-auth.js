/**
 * Cortexis sign-in for Gotcha Rush. One module, no DOM: the pages decide how it looks.
 *
 *   import { cxAuth } from './cx-auth.js';
 *
 * State
 *   cxAuth.state        { status: 'guest' | 'signed-in', id, name, country, avatar,
 *                         cortexisName, ranked, guestChosen, embedded, busy }
 *                       name/country/avatar are the player's game profile (nickname,
 *                       flag, avatar); cortexisName is the website account name.
 *   cxAuth.needsChoice  true until the visitor signs in or picks "Play as guest"
 *   cxAuth.credentials  { accountId, token } to send with `hello` ({} before the first one)
 *   cxAuth.onChange(cb) cb(state, reason, detail) on every change; returns an unsubscribe.
 *                       reason: 'signed-in' (detail: { merged, created, profile, standings, via })
 *                               'signed-out' (detail: { previous: { accountId, token } | null })
 *                               (detail is { fromOtherTab: true } when another tab did it)
 *                               'guest' | 'profile' | 'busy'
 *
 * Actions
 *   cxAuth.signIn(email, password)  website login -> game token -> this game's session.
 *       Resolves { ok: true, state, merged, created } or
 *       { ok: false, reason: 'invalid' | 'unverified' | 'rate-limited' | 'network' | 'unavailable' | 'server',
 *         message, email? }   (never rejects)
 *   cxAuth.signOut()        back to a fresh guest; revokes this device's session. Inside the
 *                           website's frame it also stops auto sign-in until the next visit.
 *   cxAuth.playAsGuest()    remembers the choice, so the sign-in page is not forced again
 *   cxAuth.syncProfile(p)   call with every profile the game server sends (account, results)
 *   cxAuth.requestToken()   inside the website's frame: ask the site for a sign-in token again
 *                           (sent once on load already; a no-op when not embedded)
 *
 * Links and helpers
 *   cxAuth.ready            Promise<config> once /api/auth/config has loaded
 *   cxAuth.config           { siteUrl, apiUrl, signupUrl, parentOrigins, ssoReady } or null
 *   cxAuth.signupUrl        "Create a Cortexis account" link (works before config lands)
 *   cxAuth.guessCountry()   ISO code from the time zone, then the browser language; 'UN' if neither
 *   cxAuth.countryName(cc)  'PK' -> 'Pakistan' in the browser's language
 *
 * Embedded on the website (window.parent is an allowed origin): the page asks the parent
 * with { type: 'cortexis:need-token' }, signs in with the { type: 'cortexis:game-token' }
 * it gets back, and signs out on { type: 'cortexis:signed-out' }. Messages from any
 * other origin are ignored.
 *
 * Storage (localStorage): gr_account_v1 holds the game session exactly as before, a
 * guest's or a Cortexis one (id cx_<n>); gr_profile_cache_v1 the last profile;
 * gr_guest_ok the guest choice; gr_cx_v1 how the session was made.
 */

const P = 'gr';
const KEYS = { creds: `${P}_account_v1`, profile: `${P}_profile_cache_v1`, guest: `${P}_guest_ok`, meta: `${P}_cx_v1` };
const OPT_OUT = `${P}_cx_embed_off`;   // sessionStorage: signed out inside the frame, so stop auto sign-in

/* ------------------------------------------------------------ storage */

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (_) { return null; } },
  set(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* private mode */ } },
};
const readCreds = () => { const c = store.get(KEYS.creds); return c && c.id && c.token ? c : null; };
const isCx = (id) => typeof id === 'string' && id.startsWith('cx_');

/* ------------------------------------------------------------ country */

// Time zone -> ISO country, generated from /usr/share/zoneinfo/zone.tab (plus the
// legacy names some browsers still report, e.g. Asia/Calcutta). Region:City=CC.
const TZ = 'Africa:Abidjan=CI,Accra=GH,Addis_Ababa=ET,Algiers=DZ,Asmara=ER,Bamako=ML,Bangui=CF,Banjul=GM,Bissau=GW,Blantyre=MW,Brazzaville=CG,Bujumbura=BI,Cairo=EG,Casablanca=MA,Ceuta=ES,Conakry=GN,Dakar=SN,Dar_es_Salaam=TZ,Djibouti=DJ,Douala=CM,El_Aaiun=EH,Freetown=SL,Gaborone=BW,Harare=ZW,Johannesburg=ZA,Juba=SS,Kampala=UG,Khartoum=SD,Kigali=RW,Kinshasa=CD,Lagos=NG,Libreville=GA,Lome=TG,Luanda=AO,Lubumbashi=CD,Lusaka=ZM,Malabo=GQ,Maputo=MZ,Maseru=LS,Mbabane=SZ,Mogadishu=SO,Monrovia=LR,Nairobi=KE,Ndjamena=TD,Niamey=NE,Nouakchott=MR,Ouagadougou=BF,Porto-Novo=BJ,Sao_Tome=ST,Tripoli=LY,Tunis=TN,Windhoek=NA;America:Adak=US,Anchorage=US,Anguilla=AI,Antigua=AG,Araguaina=BR,Argentina/Buenos_Aires=AR,Argentina/Catamarca=AR,Argentina/Cordoba=AR,Argentina/Jujuy=AR,Argentina/La_Rioja=AR,Argentina/Mendoza=AR,Argentina/Rio_Gallegos=AR,Argentina/Salta=AR,Argentina/San_Juan=AR,Argentina/San_Luis=AR,Argentina/Tucuman=AR,Argentina/Ushuaia=AR,Aruba=AW,Asuncion=PY,Atikokan=CA,Atka=US,Bahia=BR,Bahia_Banderas=MX,Barbados=BB,Belem=BR,Belize=BZ,Blanc-Sablon=CA,Boa_Vista=BR,Bogota=CO,Boise=US,Buenos_Aires=AR,Cambridge_Bay=CA,Campo_Grande=BR,Cancun=MX,Caracas=VE,Catamarca=AR,Cayenne=GF,Cayman=KY,Chicago=US,Chihuahua=MX,Ciudad_Juarez=MX,Cordoba=AR,Costa_Rica=CR,Coyhaique=CL,Creston=CA,Cuiaba=BR,Curacao=CW,Danmarkshavn=GL,Dawson=CA,Dawson_Creek=CA,Denver=US,Detroit=US,Dominica=DM,Edmonton=CA,Eirunepe=BR,El_Salvador=SV,Ensenada=MX,Fort_Nelson=CA,Fort_Wayne=US,Fortaleza=BR,Glace_Bay=CA,Godthab=GL,Goose_Bay=CA,Grand_Turk=TC,Grenada=GD,Guadeloupe=GP,Guatemala=GT,Guayaquil=EC,Guyana=GY,Halifax=CA,Havana=CU,Hermosillo=MX,Indiana/Indianapolis=US,Indiana/Knox=US,Indiana/Marengo=US,Indiana/Petersburg=US,Indiana/Tell_City=US,Indiana/Vevay=US,Indiana/Vincennes=US,Indiana/Winamac=US,Indianapolis=US,Inuvik=CA,Iqaluit=CA,Jamaica=JM,Jujuy=AR,Juneau=US,Kentucky/Louisville=US,Kentucky/Monticello=US,Knox_IN=US,Kralendijk=BQ,La_Paz=BO,Lima=PE,Los_Angeles=US,Louisville=US,Lower_Princes=SX,Maceio=BR,Managua=NI,Manaus=BR,Marigot=MF,Martinique=MQ,Matamoros=MX,Mazatlan=MX,Mendoza=AR,Menominee=US,Merida=MX,Metlakatla=US,Mexico_City=MX,Miquelon=PM,Moncton=CA,Monterrey=MX,Montevideo=UY,Montreal=CA,Montserrat=MS,Nassau=BS,New_York=US,Nipigon=CA,Nome=US,Noronha=BR,North_Dakota/Beulah=US,North_Dakota/Center=US,North_Dakota/New_Salem=US,Nuuk=GL,Ojinaga=MX,Panama=PA,Pangnirtung=CA,Paramaribo=SR,Phoenix=US,Port-au-Prince=HT,Port_of_Spain=TT,Porto_Acre=BR,Porto_Velho=BR,Puerto_Rico=PR,Punta_Arenas=CL,Rainy_River=CA,Rankin_Inlet=CA,Recife=BR,Regina=CA,Resolute=CA,Rio_Branco=BR,Santa_Isabel=MX,Santarem=BR,Santiago=CL,Santo_Domingo=DO,Sao_Paulo=BR,Scoresbysund=GL,Sitka=US,St_Barthelemy=BL,St_Johns=CA,St_Kitts=KN,St_Lucia=LC,St_Thomas=VI,St_Vincent=VC,Swift_Current=CA,Tegucigalpa=HN,Thule=GL,Thunder_Bay=CA,Tijuana=MX,Toronto=CA,Tortola=VG,Vancouver=CA,Whitehorse=CA,Winnipeg=CA,Yakutat=US,Yellowknife=CA;Antarctica:Casey=AQ,Davis=AQ,DumontDUrville=AQ,Macquarie=AU,Mawson=AQ,McMurdo=AQ,Palmer=AQ,Rothera=AQ,Syowa=AQ,Troll=AQ,Vostok=AQ;Arctic:Longyearbyen=SJ;Asia:Aden=YE,Almaty=KZ,Amman=JO,Anadyr=RU,Aqtau=KZ,Aqtobe=KZ,Ashgabat=TM,Ashkhabad=TM,Atyrau=KZ,Baghdad=IQ,Bahrain=BH,Baku=AZ,Bangkok=TH,Barnaul=RU,Beirut=LB,Bishkek=KG,Brunei=BN,Calcutta=IN,Chita=RU,Chongqing=CN,Chungking=CN,Colombo=LK,Dacca=BD,Damascus=SY,Dhaka=BD,Dili=TL,Dubai=AE,Dushanbe=TJ,Famagusta=CY,Gaza=PS,Harbin=CN,Hebron=PS,Ho_Chi_Minh=VN,Hong_Kong=HK,Hovd=MN,Irkutsk=RU,Istanbul=TR,Jakarta=ID,Jayapura=ID,Jerusalem=IL,Kabul=AF,Kamchatka=RU,Karachi=PK,Kathmandu=NP,Katmandu=NP,Khandyga=RU,Kolkata=IN,Krasnoyarsk=RU,Kuala_Lumpur=MY,Kuching=MY,Kuwait=KW,Macao=MO,Macau=MO,Magadan=RU,Makassar=ID,Manila=PH,Muscat=OM,Nicosia=CY,Novokuznetsk=RU,Novosibirsk=RU,Omsk=RU,Oral=KZ,Phnom_Penh=KH,Pontianak=ID,Pyongyang=KP,Qatar=QA,Qostanay=KZ,Qyzylorda=KZ,Rangoon=MM,Riyadh=SA,Saigon=VN,Sakhalin=RU,Samarkand=UZ,Seoul=KR,Shanghai=CN,Singapore=SG,Srednekolymsk=RU,Taipei=TW,Tashkent=UZ,Tbilisi=GE,Tehran=IR,Tel_Aviv=IL,Thimbu=BT,Thimphu=BT,Tokyo=JP,Tomsk=RU,Ujung_Pandang=ID,Ulaanbaatar=MN,Ulan_Bator=MN,Urumqi=CN,Ust-Nera=RU,Vientiane=LA,Vladivostok=RU,Yakutsk=RU,Yangon=MM,Yekaterinburg=RU,Yerevan=AM;Atlantic:Azores=PT,Bermuda=BM,Canary=ES,Cape_Verde=CV,Faeroe=FO,Faroe=FO,Madeira=PT,Reykjavik=IS,South_Georgia=GS,St_Helena=SH,Stanley=FK;Australia:Adelaide=AU,Brisbane=AU,Broken_Hill=AU,Currie=AU,Darwin=AU,Eucla=AU,Hobart=AU,Lindeman=AU,Lord_Howe=AU,Melbourne=AU,Perth=AU,Sydney=AU;Europe:Amsterdam=NL,Andorra=AD,Astrakhan=RU,Athens=GR,Belfast=GB,Belgrade=RS,Berlin=DE,Bratislava=SK,Brussels=BE,Bucharest=RO,Budapest=HU,Busingen=DE,Chisinau=MD,Copenhagen=DK,Dublin=IE,Gibraltar=GI,Guernsey=GG,Helsinki=FI,Isle_of_Man=IM,Istanbul=TR,Jersey=JE,Kaliningrad=RU,Kiev=UA,Kirov=RU,Kyiv=UA,Lisbon=PT,Ljubljana=SI,London=GB,Luxembourg=LU,Madrid=ES,Malta=MT,Mariehamn=AX,Minsk=BY,Monaco=MC,Moscow=RU,Nicosia=CY,Oslo=NO,Paris=FR,Podgorica=ME,Prague=CZ,Riga=LV,Rome=IT,Samara=RU,San_Marino=SM,Sarajevo=BA,Saratov=RU,Simferopol=UA,Skopje=MK,Sofia=BG,Stockholm=SE,Tallinn=EE,Tirane=AL,Ulyanovsk=RU,Uzhgorod=UA,Vaduz=LI,Vatican=VA,Vienna=AT,Vilnius=LT,Volgograd=RU,Warsaw=PL,Zagreb=HR,Zaporozhye=UA,Zurich=CH;Indian:Antananarivo=MG,Chagos=IO,Christmas=CX,Cocos=CC,Comoro=KM,Kerguelen=TF,Mahe=SC,Maldives=MV,Mauritius=MU,Mayotte=YT,Reunion=RE;Pacific:Apia=WS,Auckland=NZ,Bougainville=PG,Chatham=NZ,Chuuk=FM,Easter=CL,Efate=VU,Enderbury=KI,Fakaofo=TK,Fiji=FJ,Funafuti=TV,Galapagos=EC,Gambier=PF,Guadalcanal=SB,Guam=GU,Honolulu=US,Johnston=UM,Kanton=KI,Kiritimati=KI,Kosrae=FM,Kwajalein=MH,Majuro=MH,Marquesas=PF,Midway=UM,Nauru=NR,Niue=NU,Norfolk=NF,Noumea=NC,Pago_Pago=AS,Palau=PW,Pitcairn=PN,Pohnpei=FM,Ponape=FM,Port_Moresby=PG,Rarotonga=CK,Saipan=MP,Samoa=AS,Tahiti=PF,Tarawa=KI,Tongatapu=TO,Truk=FM,Wake=UM,Wallis=WF,Yap=FM';
let tzMap = null;
function tzCountry(tz) {
  if (!tzMap) {
    tzMap = new Map();
    for (const group of TZ.split(';')) {
      const [region, list] = group.split(':');
      for (const pair of list.split(',')) { const [city, cc] = pair.split('='); tzMap.set(`${region}/${city}`, cc); }
    }
  }
  return tzMap.get(tz) || null;
}
const LEGACY_TZ = { US: 'US', Canada: 'CA', Mexico: 'MX', Brazil: 'BR', Chile: 'CL', Australia: 'AU' };

function guessCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const byTz = tzCountry(tz) || LEGACY_TZ[tz.split('/')[0]] || null;
    if (byTz) return byTz;
  } catch (_) { /* no Intl */ }
  for (const tag of (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''])) {
    try {
      const region = new Intl.Locale(tag).maximize().region;
      if (region && /^[A-Z]{2}$/.test(region)) return region;
    } catch (_) {
      const m = String(tag).match(/[-_]([A-Za-z]{2})$/);
      if (m) return m[1].toUpperCase();
    }
  }
  return 'UN';
}

let regionNames = null;
function countryName(cc) {
  if (!cc || cc === 'UN') return 'Somewhere on Earth';
  try {
    regionNames ||= new Intl.DisplayNames([navigator.language || 'en'], { type: 'region' });
    return regionNames.of(cc) || cc;
  } catch (_) { return cc; }
}

/* ------------------------------------------------------------- config */

let config = null;
const devSite = () => `${location.protocol}//${location.hostname}:3000`;
const ready = fetch('/api/auth/config', { cache: 'no-store' })
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`config ${r.status}`))))
  .catch(() => ({ siteUrl: devSite(), apiUrl: `${location.protocol}//${location.hostname}:5000`, signupUrl: `${devSite()}/signup`, parentOrigins: [devSite()], ssoReady: false }))
  .then((c) => { config = c; return c; });

/* -------------------------------------------------------------- state */

const listeners = new Set();
let busy = false;
let lastStatus = 'guest';
const embedded = (() => { try { return window.self !== window.top; } catch (_) { return true; } })();

function snapshot() {
  const creds = readCreds();
  const profile = store.get(KEYS.profile) || {};
  const meta = store.get(KEYS.meta) || {};
  const signedIn = !!creds && isCx(creds.id);
  return {
    status: signedIn ? 'signed-in' : 'guest',
    id: creds ? creds.id : null,
    name: profile.name && profile.name !== 'Guest' ? profile.name : (signedIn ? meta.name || 'Player' : 'Guest'),
    country: profile.country || 'UN',
    avatar: profile.avatar || null,
    cortexisName: signedIn ? profile.cortexisName || meta.cortexisName || null : null,
    ranked: signedIn && profile.ranked !== false,
    guestChosen: store.get(KEYS.guest) === 1,
    embedded,
    busy,
  };
}

function emit(reason, detail) {
  const s = snapshot();
  for (const cb of [...listeners]) { try { cb(s, reason, detail); } catch (err) { console.error('[cx-auth]', err); } }
}
function setBusy(v) { busy = v; emit('busy'); }

/* ------------------------------------------------------------ network */

async function send(url, { body, bearer } = {}) {
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) },
      body: JSON.stringify(body || {}),
    });
  } catch (_) {
    return { status: 0, body: {} };
  }
  let data = {};
  try { data = await res.json(); } catch (_) { /* empty body */ }
  return { status: res.status, body: data || {} };
}

const fail = (reason, message, extra = {}) => ({ ok: false, reason, message, ...extra });

/** Trade a website game token for this game's own session (merging the guest we were). */
async function exchange(gameToken, via) {
  const creds = readCreds();
  const guest = creds && !isCx(creds.id) ? { accountId: creds.id, token: creds.token } : {};
  const r = await send('/api/auth/cortexis', { body: { gameToken, country: guessCountry(), ...guest } });
  if (r.status === 0) return fail('network', 'Could not reach the game server. Check your connection.');
  if (r.status === 503) return fail('unavailable', 'Cortexis sign-in is not switched on for this game yet.');
  if (r.status !== 200 || !r.body.id || !r.body.token) return fail('server', r.body.error || 'Sign-in did not go through. Try again.');
  // switching from another Cortexis account on this device: end that session too
  if (creds && isCx(creds.id) && creds.id !== r.body.id) send('/api/auth/signout', { body: { accountId: creds.id, token: creds.token } });
  store.set(KEYS.creds, { id: r.body.id, token: r.body.token });
  store.set(KEYS.profile, r.body.profile || null);
  store.set(KEYS.meta, { via, at: Date.now(), name: r.body.profile && r.body.profile.name, cortexisName: r.body.profile && r.body.profile.cortexisName });
  try { sessionStorage.removeItem(OPT_OUT); } catch (_) { /* ignore */ }
  lastStatus = 'signed-in';
  const detail = { merged: !!r.body.merged, created: !!r.body.created, profile: r.body.profile, standings: r.body.standings || [], via };
  emit('signed-in', detail);
  return { ok: true, state: snapshot(), merged: detail.merged, created: detail.created };
}

async function signIn(email, password) {
  if (busy) return fail('busy', 'Already signing in.');
  email = String(email || '').trim();
  if (!email || !password) return fail('invalid', 'Enter your email and password.');
  setBusy(true);
  try {
    const conf = await ready;
    const login = await send(`${conf.apiUrl}/api/auth/login`, { body: { email, password } });
    if (login.status === 0) return fail('network', 'Could not reach Cortexis. Check your connection.');
    if (login.status === 400) return fail('invalid', 'Enter a valid email and your password.');
    if (login.status === 401) return fail('invalid', 'That email and password do not match.');
    if (login.status === 403 && login.body.needsVerification) {
      return fail('unverified', 'Confirm your email first. The code is in your inbox.', { email: login.body.email || email });
    }
    if (login.status === 429) return fail('rate-limited', login.body.message || 'Too many attempts. Wait a few minutes.');
    if (login.status !== 200 || !login.body.token) return fail('server', login.body.message || 'Cortexis could not sign you in.');

    const game = await send(`${conf.apiUrl}/api/auth/game-token`, { bearer: login.body.token });
    if (game.status === 403 && game.body.needsVerification) return fail('unverified', 'Confirm your email first. The code is in your inbox.', { email });
    if (game.status === 503) return fail('unavailable', 'Game sign-in is not switched on yet.');
    if (game.status !== 200 || !game.body.token) return fail(game.status === 0 ? 'network' : 'server', game.body.message || 'Cortexis could not sign you in to the game.');
    return await exchange(game.body.token, 'direct');
  } finally {
    setBusy(false);
  }
}

async function signOut({ byParent = false } = {}) {
  const creds = readCreds();
  store.set(KEYS.creds, null);
  store.set(KEYS.profile, null);
  store.set(KEYS.meta, null);
  lastStatus = 'guest';
  // the player left while the website is still signed in: stop signing them back in on this visit
  if (embedded && !byParent) { try { sessionStorage.setItem(OPT_OUT, '1'); } catch (_) { /* ignore */ } }
  if (creds && isCx(creds.id)) await send('/api/auth/signout', { body: { accountId: creds.id, token: creds.token } });
  emit('signed-out', { previous: creds ? { accountId: creds.id, token: creds.token } : null });
  return snapshot();
}

function playAsGuest() {
  store.set(KEYS.guest, 1);
  emit('guest');
  return snapshot();
}

let lastProfileKey = '';
function syncProfile(profile) {
  if (profile && typeof profile === 'object') store.set(KEYS.profile, profile);
  const s = snapshot();
  const key = `${s.status}|${s.id}|${s.name}|${s.country}|${s.avatar}`;
  if (key !== lastProfileKey) { lastProfileKey = key; emit('profile'); }
}

/* ----------------------------------------------- embedded on the website */

let pending = null;          // newest token waiting for the current exchange to finish
let exchanging = false;

function tokenSub(token) {
  try { return String(JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub); } catch (_) { return null; }
}

async function takeEmbeddedToken(token) {
  try { if (sessionStorage.getItem(OPT_OUT)) return; } catch (_) { /* ignore */ }
  const creds = readCreds();
  const sub = tokenSub(token);
  if (!sub || (creds && creds.id === `cx_${sub}`)) return;   // already this account
  if (exchanging) { pending = token; return; }
  exchanging = true;
  setBusy(true);
  try {
    const r = await exchange(token, 'embed');
    if (!r.ok) console.warn('[cx-auth] embedded sign-in failed:', r.message);
  } finally {
    exchanging = false;
    setBusy(false);
  }
  if (pending) { const next = pending; pending = null; takeEmbeddedToken(next); }
}

function requestToken() {
  if (!embedded || !config) return;
  for (const origin of config.parentOrigins || []) {
    try { window.parent.postMessage({ type: 'cortexis:need-token' }, origin); } catch (_) { /* not that parent */ }
  }
}

if (embedded) {
  window.addEventListener('message', (e) => {
    const data = e.data;
    if (!data || typeof data !== 'object' || e.source !== window.parent) return;
    if (data.type !== 'cortexis:game-token' && data.type !== 'cortexis:signed-out') return;
    ready.then((conf) => {
      if (!(conf.parentOrigins || []).includes(e.origin)) return;   // only the configured website
      if (data.type === 'cortexis:game-token' && typeof data.token === 'string') takeEmbeddedToken(data.token);
      else if (data.type === 'cortexis:signed-out' && isCx((readCreds() || {}).id)) signOut({ byParent: true });
    });
  });
  ready.then(requestToken);
}

// another tab signed in or out: follow it (a guest-to-guest change is not news)
lastStatus = snapshot().status;
window.addEventListener('storage', (e) => {
  if (e.key !== KEYS.creds) return;
  const now = isCx((readCreds() || {}).id) ? 'signed-in' : 'guest';
  if (now === lastStatus) return;
  lastStatus = now;
  emit(now === 'signed-in' ? 'signed-in' : 'signed-out', { fromOtherTab: true });
});

export const cxAuth = {
  get state() { return snapshot(); },
  get needsChoice() { const s = snapshot(); return s.status === 'guest' && !s.guestChosen; },
  get credentials() { const c = readCreds(); return c ? { accountId: c.id, token: c.token } : {}; },
  get config() { return config; },
  get signupUrl() { return config ? config.signupUrl : `${devSite()}/signup`; },
  ready,
  signIn,
  signOut,
  playAsGuest,
  syncProfile,
  requestToken,
  onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); },
  guessCountry,
  countryName,
};

export default cxAuth;
