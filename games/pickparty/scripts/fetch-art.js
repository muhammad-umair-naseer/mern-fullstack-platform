#!/usr/bin/env node
'use strict';
// Item pictures. Looks each option of the allowlisted topics up on Wikipedia,
// keeps the page's thumbnail only when it is hosted on Wikimedia Commons (so
// it is free to reuse) and records the file's author and licence for credit.
//
//   npm run art            fills shared/art.json (resumable: existing entries are kept, null = looked up, nothing free)
//   shared/art-overrides.json   {"topic:idx": {"page": "Wikipedia title"} | {src,page,by,lic} | null}
//                                 looks a specific page up, pins a picture, or removes one
//
// Concept packs (Green flags, Perfect morning…) and media packs (Movies,
// Disney, anime, games…) are not looked up: concepts have no sensible photo
// and media artwork on Wikipedia is non-free.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const topics = require(path.join(ROOT, 'shared', 'topics.json'));
const OUT = path.join(ROOT, 'shared', 'art.json');
const OVR = path.join(ROOT, 'shared', 'art-overrides.json');
const UA = 'PickPartyArtBot/0.1 (local build script for a party game; +https://localhost/pickparty)';
const PAUSE_MS = 150;

const ALLOW = new Set([
  'footballers', 'cricketers', 'nba', 'goats', 'rappers', 'singers', 'celebs',
  'pizza', 'desserts', 'street', 'fruit', 'icecream', 'sauces', 'drinks', 'fastfood', 'comfort', 'candy',
  'pets', 'sidekicks', 'wild', 'creatures',
  'holiday', 'cities', 'countries',
  'gadgets', 'instruments', 'accessories', 'gym', 'cars', 'clothes', 'clubs', 'nbateams', 'tablegames', 'rides', 'sports', 'weather',
  'desibreakfast', 'mithai', 'chaat', 'desimains', 'desisingers', 'desifashion', 'pakcities', 'chaitime',
]);
// Per-topic vocabulary. q steers the search; words are the only tokens a title may
// add to the item's name (as a parenthetical or an extra word); strict packs are
// proper names, where any other extra word means a different person or company.
const PEOPLE = (q, ...more) => ({ q, words: [q, ...more], strict: true });
const FOOD = { q: null, words: ['food', 'dish', 'fruit', 'drink', 'dessert', 'candy', 'sauce', 'condiment', 'beverage', 'confectionery', 'cuisine', 'spice', 'vegetable', 'cheese', 'bread', 'pastry', 'snack'] };
const ANIMAL = { q: 'animal', words: ['animal', 'bird', 'fish', 'mammal', 'reptile', 'insect', 'genus'] };
const HINTS = {
  footballers: PEOPLE('footballer', 'football', 'soccer'), cricketers: PEOPLE('cricketer', 'cricket'), nba: PEOPLE('basketball', 'nba'),
  goats: PEOPLE('athlete', 'footballer', 'basketball', 'boxer', 'tennis', 'sprinter', 'swimmer', 'golfer', 'gymnast', 'racing', 'driver', 'cricketer', 'squash', 'player'),
  rappers: PEOPLE('rapper', 'musician'), singers: PEOPLE('singer', 'musician'), desisingers: PEOPLE('singer', 'musician', 'qawwal', 'playback'),
  desibreakfast: FOOD, mithai: FOOD, chaat: FOOD, desimains: FOOD, chaitime: FOOD, desifashion: { q: 'clothing', words: ['clothing', 'garment', 'footwear', 'shawl', 'jewellery'] }, pakcities: { q: 'Pakistan', words: ['pakistan', 'city', 'valley', 'district'], strict: true }, celebs: PEOPLE('celebrity', 'actor', 'actress', 'singer', 'businessman', 'media', 'personality', 'wrestler', 'youtuber', 'boxer', 'rapper'),
  pizza: FOOD, desserts: FOOD, street: FOOD, fruit: FOOD, icecream: FOOD, sauces: FOOD, drinks: FOOD, fastfood: FOOD, comfort: FOOD, candy: FOOD,
  pets: ANIMAL, sidekicks: ANIMAL, wild: ANIMAL, creatures: { q: 'mythology', words: ['mythology', 'legendary', 'creature', 'folklore'] },
  holiday: { q: null, words: ['geography', 'landform', 'tourism'] }, cities: { q: 'city', words: ['city'], strict: true }, countries: { q: 'country', words: ['country'], strict: true },
  gadgets: { q: 'appliance', words: ['appliance', 'kitchen', 'utensil', 'tool'] }, instruments: { q: 'musical instrument', words: ['instrument', 'musical'] },
  accessories: { q: 'clothing', words: ['clothing', 'accessory', 'jewellery', 'jewelry'] }, gym: { q: 'exercise', words: ['exercise', 'weight', 'training'] },
  cars: { q: 'car manufacturer', words: ['inc', 'motor', 'motors', 'company', 'automobiles', 'ag', 'se', 'group', 'marque'], strict: true },
  clothes: { q: 'brand', words: ['brand', 'inc', 'co', 'company', 'clothing', 'retailer'], strict: true },
  clubs: { q: 'football club', words: ['fc', 'cf', 'afc', 'sc', 'club', 'football'], strict: true }, nbateams: { q: 'NBA team', words: ['nba', 'basketball', 'team'], strict: true },
  tablegames: { q: 'game', words: ['game', 'board'] }, rides: { q: 'amusement ride', words: ['ride', 'amusement'] }, sports: { q: 'sport', words: ['sport'] }, weather: { q: 'weather', words: ['weather', 'meteorology', 'precipitation'] },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, attempt = 0) {
  await sleep(PAUSE_MS);
  let res;
  try { res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA, Accept: 'application/json' } }); }
  catch (e) { if (attempt < 2) { await sleep(1500); return get(url, attempt + 1); } throw e; } // transient network trouble
  if (res.status === 429 && attempt < 2) { await sleep(5000); return get(url, attempt + 1); }
  if (!res.ok) return null;
  return res.json();
}
const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
// Plurals: "cookies"→"cookie", "cherries"→"cherry", "peaches"→"peach", "ups"→"up"; both ies forms are tried.
const sing = (w) => (w.length > 3 ? w.replace(/(sh|ch|x|ss)es$/, '$1').replace(/ies$/, 'ie').replace(/s$/, '') : w.length > 2 ? w.replace(/s$/, '') : w);
const sameTok = (a, b) => a === b || sing(a) === sing(b) || sing(a).replace(/ie$/, 'y') === sing(b).replace(/ie$/, 'y');
const toks = (s) => norm(s).split(' ').filter(Boolean);
const has = (arr, w) => arr.some((x) => sameTok(x, w));

// Does this page title name the same thing as the item? Exact (plurals and
// accents aside) always; "Name (word)" only when the word is in the topic's
// vocabulary; one extra word on a generic pack ("Mountain gorilla", "Chicken
// tikka masala"), or a multi-word title the item merely qualifies ("Ginger tea"
// for "Lemon ginger tea"); on strict packs an extra word must be vocabulary
// ("Tesla, Inc." yes, "Nikola Tesla" no). Anything looser gets the wrong entity.
function accept(name, title, h = {}) {
  const N = toks(name), T = toks(title);
  if (!N.length || !T.length) return false;
  const vocab = (h.words || []).flatMap((w) => toks(w));
  const same = T.length === N.length && T.every((w) => has(N, w));
  // "Fresh basil" → "Basil": a one-word title that is the item's head noun (last word), generic packs only
  const head = !h.strict && T.length === 1 && N.length === 2 && sameTok(T[0], N[N.length - 1]);
  // "Snowfall" → "Snow", "Hippo" → "Hippopotamus": single words where one extends the other
  const prefix = N.length === 1 && T.length === 1 && Math.min(N[0].length, T[0].length) >= 4 && (N[0].startsWith(T[0]) || T[0].startsWith(N[0]));
  const paren = (String(title).match(/\(([^)]*)\)/) || [])[1];
  if (paren) return (same || head) && toks(paren).some((w) => has(vocab, w));
  if (same || head || prefix) return true;
  const extra = T.filter((w) => !has(N, w));
  if (N.every((w) => has(T, w))) {
    if (h.strict) return extra.every((w) => has(vocab, w));
    return extra.length === 1;
  }
  if (!h.strict && T.every((w) => has(N, w)) && N.length - T.length === 1 && T.length >= 2) return true;
  return false;
}
const strip = (html) => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function findTitle(name, h) {
  const cands = [];
  for (const q of h.q ? [`${name} ${h.q}`, name] : [name]) {
    const s = await get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=4&format=json`);
    if (s && s.query) cands.push(...s.query.search.map((x) => x.title));
  }
  // a plain title that is the item's name (plurals aside) beats anything the looser rules allow,
  // and a parenthetical never counts as exact ("Snake (zodiac)" is not "Snake")
  const N = toks(name);
  const plain = (t) => !/\(/.test(t) && toks(t).length === N.length && toks(t).every((w, i) => sameTok(w, N[i]));
  return cands.find(plain) || cands.find((t) => accept(name, t, h)) || null;
}

const debug = (...a) => { if (process.env.ART_DEBUG) console.log('   ', ...a); };

// Every stored picture is a resizable Commons thumb URL on upload.wikimedia.org:
// .../wikipedia/commons/thumb/<h>/<hh>/<File>/330px-<File>. Originals are
// rewritten into that form (SVGs get a .png render); tracking queries are dropped.
function asThumb(url) {
  const clean = url.split('?')[0].replace(/^https:\/\/[^/]+/, 'https://upload.wikimedia.org');
  if (clean.includes('/wikipedia/commons/thumb/')) return clean;
  const m = clean.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([0-9a-f])\/([0-9a-f]{2})\/([^/]+)$/);
  if (!m) return null;
  return `${m[1]}/thumb/${m[2]}/${m[3]}/${m[4]}/330px-${m[4]}${/\.svg$/i.test(m[4]) ? '.png' : ''}`;
}

async function lookup(name, h) {
  const title = await findTitle(name, h);
  debug(name, '→ title:', title);
  if (!title) return null;
  return fromPage(title, name);
}

async function fromPage(title, name = title) {
  const sum = await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
  if (sum && sum.type === 'disambiguation') return null;
  const raw = sum && sum.thumbnail && sum.thumbnail.source;
  const src = raw && raw.includes('/wikipedia/commons/') ? asThumb(raw) : null;
  debug(name, '→ thumb:', src);
  if (!src) return null;
  const file = decodeURIComponent(src.split('/thumb/')[1].split('/')[2]);
  const info = await get(`https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File:${encodeURIComponent(file)}&format=json`);
  const page = info && info.query && Object.values(info.query.pages)[0];
  const meta = page && page.imageinfo && page.imageinfo[0] && page.imageinfo[0].extmetadata;
  const lic = meta && meta.LicenseShortName && strip(meta.LicenseShortName.value);
  debug(name, '→ file:', file, '| lic:', lic, '| info:', info ? 'ok' : 'none');
  if (!lic) return null; // no licence, no picture
  const by = (meta.Artist && strip(meta.Artist.value)) || 'Wikimedia Commons contributor';
  return { src, page: sum.title, by: by.slice(0, 80), lic };
}

function save(art) {
  const tmp = OUT + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(art, null, 1) + '\n');
  fs.renameSync(tmp, OUT);
}

async function main() {
  const art = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const overrides = fs.existsSync(OVR) ? JSON.parse(fs.readFileSync(OVR, 'utf8')) : {};
  let total = 0, dropped = 0;
  for (const t of topics) {
    if (!ALLOW.has(t.id) || (process.env.ART_ONLY && t.id !== process.env.ART_ONLY)) continue;
    art[t.id] = art[t.id] || {};
    const h = HINTS[t.id] || {};
    let hits = 0;
    for (let i = 0; i < t.o.length; i++) {
      // a stored match the current matcher would no longer accept is looked up again
      if (art[t.id][i] && !overrides[`${t.id}:${i}`] && !accept(t.o[i][0], art[t.id][i].page, h)) { debug('drop', t.o[i][0], '→', art[t.id][i].page); art[t.id][i] = undefined; dropped++; }
      if (art[t.id][i] === undefined) {
        try { art[t.id][i] = await lookup(t.o[i][0], h); } catch (e) { console.error(`  ${t.id}[${i}] ${t.o[i][0]}: ${e.message} (will retry next run)`); }
      }
      if (art[t.id][i]) hits++;
    }
    save(art);
    total += hits;
    console.log(`${t.e} ${t.t}: ${hits}/${t.o.length}`);
  }
  for (const [key, val] of Object.entries(overrides)) {
    const [tid, idx] = key.split(':');
    art[tid] = art[tid] || {};
    if (val && val.page && !val.src) {
      const e = await fromPage(val.page);
      console.log(`override ${key} → ${val.page}: ${e ? 'ok' : 'no free picture, removed'}`);
      art[tid][idx] = e;
    } else art[tid][idx] = val;
  }
  save(art); // nulls stay: they mark items already looked up with no free picture
  console.log(`\n${total} pictures for ${Object.keys(art).length} topics → shared/art.json${dropped ? ` (${dropped} stale matches re-checked)` : ''}`);
}

module.exports = { accept, HINTS, norm, toks };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
