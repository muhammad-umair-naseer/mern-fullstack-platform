// Content bank: fetched once, revalidated with ETag, cached in localStorage.
// Matches only send topic ids and option indices over the wire.
const KEY = 'pp.bank.v1';
let data = null, etag = null, byId = new Map(), loading = null, wanted = null;

function index() { byId = new Map(data.topics.map((t) => [t.id, t])); }

try {
  const c = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (c && c.data && c.data.topics) { data = c.data; etag = c.etag; index(); }
} catch {}

export function version() { return data ? data.v : null; }
export function topic(id) { return byId.get(id) || null; }
export function ids() { return data ? data.topics.map((t) => t.id) : []; }
export function opt(id, i) {
  const t = byId.get(id);
  const o = t && t.o[i];
  return o ? { name: o[0], emoji: o[1] } : { name: '?', emoji: '❔' };
}

// Culture pools: desi plays desi + neutral packs, global plays global + neutral, mix plays everything.
export function inCulture(id, culture) { const t = byId.get(id); return !!t && (culture === 'mix' || !culture || (culture === 'desi' ? 'dn' : 'gn').includes(t.c)); }

// Picture for an option, if the bank has one: {s, p, by, lic} or null.
export function art(id, i) { const t = byId.get(id); const e = t && t.a && t.a[i]; return e || null; }
// Wikimedia thumbnails carry their width in the path; ask for the size the card needs.
export function img(src, width) { return src.replace(/\/(\d+)px-/, `/${width}px-`); }

// The server announces a new version (crowd ratings moved); refresh lazily.
export function want(v) { if (v && v !== version()) wanted = v; }

export async function ensure(force = false) {
  if (data && !force && (!wanted || wanted === data.v)) return data;
  if (loading) return loading;
  loading = (async () => {
    const res = await fetch('/api/bank', { headers: etag && data ? { 'If-None-Match': etag } : {} });
    if (res.status === 304 && data) return data;
    if (!res.ok) throw new Error('bank ' + res.status);
    data = await res.json();
    etag = res.headers.get('ETag');
    index();
    try { localStorage.setItem(KEY, JSON.stringify({ etag, data })); } catch {}
    return data;
  })().finally(() => { loading = null; wanted = null; });
  return loading;
}
