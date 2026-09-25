// PdfDocument: load an existing PDF (or start a new one), read/modify objects, write it back.
import { latin1, concat, deflateZlib, ByteWriter } from '../bytes.js';
import { Name, N, Ref, Dict, PDFStream, PDFString, Parser, Lexer, TOK, findSeq, findSeqBackward, matchAt, serialize, partsToBytes, isRef, isDict, isStream } from './objects.js';
import { decodeStream } from './filters.js';

export class PdfError extends Error {}

export class PdfDocument {
  constructor() {
    this.bytes = null;
    this.xref = new Map();      // num -> {offset, gen} | {stm, idx}
    this.cache = new Map();     // num -> object
    this.trailer = new Dict();
    this.objStmCache = new Map();
    this.reconstructed = false;
    this.nextNum = 1;
    this.version = '1.7';
    this._pages = null;
  }

  // ---------------- Loading ----------------
  static load(bytes) {
    const doc = new PdfDocument();
    doc.bytes = bytes;
    doc.headerOffset = Math.max(0, findSeq(bytes, '%PDF-', 0, 1024));
    const vm = /%PDF-(\d\.\d)/.exec(latin1.decode(bytes.subarray(doc.headerOffset, doc.headerOffset + 16)));
    if (vm) doc.version = vm[1];
    try { doc.parseXrefChain(); } catch (e) { doc.reconstruct(); }
    if (!doc.trailer.get('Root')) doc.reconstruct();
    const root = doc.catalog;
    if (!root || !(root instanceof Dict)) { doc.reconstruct(); }
    if (!doc.catalog || !(doc.catalog instanceof Dict)) throw new PdfError('This file does not look like a valid PDF (no document catalog found).');
    if (doc.trailer.get('Encrypt')) throw new PdfError('This PDF is encrypted. Remove the password protection first, then try again.');
    let max = 0; for (const n of doc.xref.keys()) if (n > max) max = n;
    doc.nextNum = max + 1;
    return doc;
  }

  static create() {
    const doc = new PdfDocument();
    const pages = doc.add(new Dict({ Type: N('Pages'), Kids: [], Count: 0 }));
    const catalog = doc.add(new Dict({ Type: N('Catalog'), Pages: pages }));
    doc.trailer.set('Root', catalog);
    return doc;
  }

  parseXrefChain() {
    const b = this.bytes;
    const sx = findSeqBackward(b, 'startxref');
    if (sx < 0) throw new PdfError('no startxref');
    const lex = new Lexer(b, sx + 9);
    const t = lex.next();
    if (t.t !== TOK.NUM) throw new PdfError('bad startxref');
    const seen = new Set();
    let offset = t.v;
    const queue = [offset];
    while (queue.length) {
      let off = queue.shift();
      if (typeof off !== 'number' || seen.has(off) || off < 0 || off >= b.length) continue;
      seen.add(off);
      const trailer = this.parseXrefSection(off);
      if (!trailer) throw new PdfError('bad xref section');
      for (const [k, v] of trailer.map) if (!this.trailer.has(k)) this.trailer.set(k, v);
      if (typeof trailer.get('XRefStm') === 'number') queue.push(trailer.get('XRefStm'));
      if (typeof trailer.get('Prev') === 'number') queue.push(trailer.get('Prev'));
    }
  }

  parseXrefSection(off) {
    const b = this.bytes;
    let p = off;
    const tryAt = (q) => { const lex = new Lexer(b, q); lex.skipWs(); return lex.pos; };
    p = tryAt(p);
    if (!matchAt(b, p, 'xref')) {
      // maybe offsets are relative to header junk
      const q = tryAt(off + this.headerOffset);
      if (matchAt(b, q, 'xref')) p = q;
      else {
        const tr = this.parseXrefStreamAt(p) || this.parseXrefStreamAt(q);
        if (tr) return tr;
        throw new PdfError('xref not found at ' + off);
      }
    }
    // classic table
    const lex = new Lexer(b, p + 4);
    for (;;) {
      lex.skipWs();
      if (matchAt(b, lex.pos, 'trailer')) {
        const parser = new Parser(b, lex.pos + 7, { allowStreams: false });
        const tr = parser.parse();
        return tr instanceof Dict ? tr : new Dict();
      }
      const t1 = lex.next();
      if (t1.t !== TOK.NUM) throw new PdfError('bad xref subsection');
      const t2 = lex.next();
      if (t2.t !== TOK.NUM) throw new PdfError('bad xref subsection');
      const start = t1.v, count = t2.v;
      for (let i = 0; i < count; i++) {
        lex.skipWs();
        const a = lex.next(), g = lex.next(), ty = lex.next();
        if (a.t !== TOK.NUM || g.t !== TOK.NUM || ty.t !== TOK.KEYWORD) throw new PdfError('bad xref entry');
        const num = start + i;
        if (ty.v === 'n' && !this.xref.has(num)) this.xref.set(num, { offset: a.v, gen: g.v });
        else if (ty.v === 'f' && !this.xref.has(num)) this.xref.set(num, { free: true });
      }
    }
  }

  parseXrefStreamAt(p) {
    const b = this.bytes;
    const lex = new Lexer(b, p);
    const t1 = lex.next(), t2 = lex.next(), t3 = lex.next();
    if (t1.t !== TOK.NUM || t2.t !== TOK.NUM || t3.t !== TOK.KEYWORD || t3.v !== 'obj') return null;
    const parser = new Parser(b, lex.pos, { resolveLength: (r) => this.resolve(r) });
    const stm = parser.parse();
    if (!(stm instanceof PDFStream)) return null;
    const d = stm.dict;
    if (!(d.get('Type') instanceof Name && d.get('Type').name === 'XRef')) return null;
    const { data } = decodeStream(stm, (o) => this.resolve(o));
    const W = this.resolve(d.get('W')).map((x) => this.resolve(x));
    const size = this.resolve(d.get('Size'));
    let index = this.resolve(d.get('Index')) || [0, size];
    const rowLen = W.reduce((a, c) => a + c, 0);
    let pos = 0;
    for (let s = 0; s < index.length; s += 2) {
      const start = this.resolve(index[s]), count = this.resolve(index[s + 1]);
      for (let i = 0; i < count && pos + rowLen <= data.length; i++) {
        const f = [];
        for (let w = 0; w < W.length; w++) { let v = 0; for (let k = 0; k < W[w]; k++) v = v * 256 + data[pos++]; f.push(v); }
        const type = W[0] === 0 ? 1 : f[0];
        const num = start + i;
        if (this.xref.has(num)) continue;
        if (type === 1) this.xref.set(num, { offset: f[1], gen: f[2] || 0 });
        else if (type === 2) this.xref.set(num, { stm: f[1], idx: f[2] || 0 });
        else this.xref.set(num, { free: true });
      }
    }
    return d;
  }

  /** Recover by scanning the whole file for "N G obj". */
  reconstruct() {
    if (this.reconstructed) return;
    this.reconstructed = true;
    this.xref = new Map();
    this.cache = new Map();
    this.objStmCache = new Map();
    const b = this.bytes;
    const s = latin1.decode(b);
    const re = /(\d+)\s+(\d+)\s+obj\b/g;
    let m;
    const objStms = [];
    while ((m = re.exec(s))) {
      const num = parseInt(m[1], 10), gen = parseInt(m[2], 10);
      // ensure the char before is whitespace/delimiter (avoid matching "12 0 obj" inside "112 0 obj")
      if (m.index > 0 && /[0-9]/.test(s[m.index - 1])) continue;
      this.xref.set(num, { offset: m.index, gen });
    }
    // trailer dict(s)
    const oldTrailer = this.trailer;
    this.trailer = new Dict();
    const tre = /trailer/g;
    const trailers = [];
    while ((m = tre.exec(s))) { try { const t = new Parser(b, m.index + 7, { allowStreams: false }).parse(); if (t instanceof Dict) trailers.push(t); } catch { } }
    for (const t of trailers.reverse()) for (const [k, v] of t.map) if (!this.trailer.has(k) && k !== 'Prev' && k !== 'XRefStm') this.trailer.set(k, v);
    // object streams + xref streams (for trailer info)
    for (const [num, e] of [...this.xref]) {
      try {
        const o = this.fetch(num);
        if (o instanceof PDFStream) {
          const ty = o.dict.get('Type');
          if (ty instanceof Name && ty.name === 'ObjStm') objStms.push(num);
          else if (ty instanceof Name && ty.name === 'XRef') { for (const [k, v] of o.dict.map) if (!this.trailer.has(k) && ['Root', 'Info', 'ID'].includes(k)) this.trailer.set(k, v); }
        }
      } catch { }
    }
    for (const sn of objStms) {
      try {
        const list = this.loadObjStm(sn);
        list.forEach((ent, idx) => { if (!this.xref.has(ent.num)) this.xref.set(ent.num, { stm: sn, idx }); });
      } catch { }
    }
    // find catalog if trailer lacks a valid Root
    const rootOk = () => { try { const r = this.resolve(this.trailer.get('Root')); return r instanceof Dict && (r.has('Pages') || r.get('Type')?.name === 'Catalog'); } catch { return false; } };
    if (!rootOk()) {
      this.trailer.delete('Root');
      for (const num of this.xref.keys()) {
        try { const o = this.fetch(num); if (o instanceof Dict && !(o instanceof PDFStream) && o.get('Type') instanceof Name && o.get('Type').name === 'Catalog') { this.trailer.set('Root', new Ref(num, 0)); break; } } catch { }
      }
    }
    if (!this.trailer.has('Root')) {
      // last resort: synthesize a catalog from any Pages root
      for (const num of this.xref.keys()) {
        try { const o = this.fetch(num); if (o instanceof Dict && o.get('Type')?.name === 'Pages' && !o.has('Parent')) { const c = this.add(new Dict({ Type: N('Catalog'), Pages: new Ref(num, 0) })); this.trailer.set('Root', c); break; } } catch { }
      }
    }
    if (oldTrailer.get('Info') && !this.trailer.has('Info')) this.trailer.set('Info', oldTrailer.get('Info'));
  }

  // ---------------- Object access ----------------
  get catalog() { return this.resolve(this.trailer.get('Root')); }

  resolve(o) {
    let guard = 0;
    while (o instanceof Ref && guard++ < 64) o = this.fetch(o.num);
    return o;
  }

  fetch(num) {
    if (this.cache.has(num)) return this.cache.get(num);
    const e = this.xref.get(num);
    let obj = null;
    if (e && !e.free) {
      try {
        obj = e.stm !== undefined ? this.fetchFromObjStm(e.stm, e.idx, num) : this.parseAt(e.offset, num);
      } catch (err) {
        if (!this.reconstructed) { this.reconstruct(); return this.fetch(num); }
        obj = null;
      }
    } else if (!e && !this.reconstructed && this.bytes) {
      this.reconstruct();
      return this.fetch(num);
    }
    this.cache.set(num, obj);
    return obj;
  }

  parseAt(offset, num) {
    const b = this.bytes;
    const tryParse = (off) => {
      const lex = new Lexer(b, off);
      const t1 = lex.next(), t2 = lex.next(), t3 = lex.next();
      if (t1.t !== TOK.NUM || t1.v !== num || t2.t !== TOK.NUM || t3.t !== TOK.KEYWORD || t3.v !== 'obj') return undefined;
      const parser = new Parser(b, lex.pos, { resolveLength: (r) => this.resolve(r) });
      const v = parser.parse();
      return v === undefined ? null : v;
    };
    let v = tryParse(offset);
    if (v === undefined && this.headerOffset) v = tryParse(offset + this.headerOffset);
    if (v === undefined) throw new PdfError('object ' + num + ' not at offset ' + offset);
    if (v && typeof v === 'object' && 'op' in v) return null; // e.g. "endobj" right away
    return v;
  }

  loadObjStm(stmNum) {
    if (this.objStmCache.has(stmNum)) return this.objStmCache.get(stmNum);
    const stm = this.resolve(new Ref(stmNum, 0));
    if (!(stm instanceof PDFStream)) throw new PdfError('bad object stream ' + stmNum);
    const { data } = decodeStream(stm, (o) => this.resolve(o));
    const n = this.resolve(stm.dict.get('N')) || 0, first = this.resolve(stm.dict.get('First')) || 0;
    const lex = new Lexer(data, 0);
    const list = [];
    for (let i = 0; i < n; i++) {
      const a = lex.next(), b2 = lex.next();
      if (a.t !== TOK.NUM || b2.t !== TOK.NUM) break;
      list.push({ num: a.v, off: first + b2.v });
    }
    const out = list.map((ent) => ({ num: ent.num, off: ent.off, data }));
    this.objStmCache.set(stmNum, out);
    return out;
  }

  fetchFromObjStm(stmNum, idx, num) {
    const list = this.loadObjStm(stmNum);
    let ent = list[idx];
    if (!ent || ent.num !== num) ent = list.find((e) => e.num === num);
    if (!ent) throw new PdfError('object ' + num + ' not in stream ' + stmNum);
    const parser = new Parser(ent.data, ent.off, { allowStreams: false });
    const v = parser.parse();
    return v === undefined ? null : v;
  }

  /** Register a new indirect object; returns its Ref. */
  add(obj) {
    const num = this.nextNum++;
    this.xref.set(num, { offset: -1, gen: 0, added: true });
    this.cache.set(num, obj);
    return new Ref(num, 0);
  }
  /** Replace the object behind a ref. */
  set(ref, obj) { this.cache.set(ref.num, obj); if (!this.xref.has(ref.num)) this.xref.set(ref.num, { offset: -1, gen: 0, added: true }); }

  async addStream(dict, data, { compress = true } = {}) {
    const d = dict instanceof Dict ? dict : new Dict(dict);
    let raw = data;
    if (compress && data.length > 32) { raw = await deflateZlib(data); d.set('Filter', N('FlateDecode')); }
    d.set('Length', raw.length);
    return this.add(new PDFStream(d, raw));
  }

  /** Decoded bytes of a stream (image filters left in place). */
  streamData(stm) {
    if (stm._decoded === undefined) stm._decoded = decodeStream(stm, (o) => this.resolve(o));
    return stm._decoded;
  }

  // ---------------- Pages ----------------
  /** @returns {Array<{ref:Ref, dict:Dict, mediaBox:number[], cropBox:number[]|null, rotate:number, resources:Dict|null}>} */
  get pages() {
    if (this._pages) return this._pages;
    const out = [];
    const visited = new Set();
    const walk = (ref, inherited) => {
      const node = this.resolve(ref);
      if (!(node instanceof Dict) || (ref instanceof Ref && visited.has(ref.num))) return;
      if (ref instanceof Ref) visited.add(ref.num);
      const inh = { ...inherited };
      for (const k of ['Resources', 'MediaBox', 'CropBox', 'Rotate']) if (node.has(k)) inh[k] = node.get(k);
      const type = this.resolve(node.get('Type'));
      const kids = this.resolve(node.get('Kids'));
      if ((type instanceof Name && type.name === 'Pages') || (Array.isArray(kids) && !(type instanceof Name && type.name === 'Page'))) {
        if (Array.isArray(kids)) for (const k of kids) walk(k, inh);
      } else if (node.has('Contents') || (type instanceof Name && type.name === 'Page') || node.has('MediaBox') || inh.MediaBox) {
        const mb = this.numArray(inh.MediaBox, 4) || [0, 0, 612, 792];
        const cb = this.numArray(inh.CropBox, 4);
        const rot = ((Math.round((this.resolve(inh.Rotate) || 0) / 90) * 90) % 360 + 360) % 360;
        out.push({ ref: ref instanceof Ref ? ref : null, dict: node, mediaBox: normBox(mb), cropBox: cb ? normBox(cb) : null, rotate: rot, resources: this.resolve(inh.Resources) || null });
      }
    };
    const cat = this.catalog;
    walk(cat.get('Pages'), {});
    if (!out.length) {
      // fallback: scan for page objects
      for (const num of [...this.xref.keys()].sort((a, b) => a - b)) {
        try { const o = this.fetch(num); if (o instanceof Dict && !(o instanceof PDFStream) && o.get('Type')?.name === 'Page') walk(new Ref(num, 0), {}); } catch { }
      }
    }
    this._pages = out;
    return out;
  }

  numArray(v, n) {
    v = this.resolve(v);
    if (!Array.isArray(v) || v.length < n) return null;
    const a = v.slice(0, n).map((x) => this.resolve(x));
    return a.every((x) => typeof x === 'number' && isFinite(x)) ? a : null;
  }

  /** Visible box + rotation-aware size of a page as displayed. */
  pageGeometry(page) {
    let box = page.cropBox ? intersect(page.cropBox, page.mediaBox) : page.mediaBox;
    if (!box || box[2] - box[0] < 1 || box[3] - box[1] < 1) box = page.mediaBox;
    const w = box[2] - box[0], h = box[3] - box[1];
    const rot = page.rotate;
    const swapped = rot === 90 || rot === 270;
    return { box, width: swapped ? h : w, height: swapped ? w : h, rotate: rot };
  }

  /** Matrix (cm operands) that maps "visual page space" (origin bottom-left as displayed, unrotated) to user space. */
  visualMatrix(page) {
    const { box, rotate } = this.pageGeometry(page);
    const [x0, y0, x1, y1] = box;
    switch (rotate) {
      case 90: return [0, 1, -1, 0, x1, y0];
      case 180: return [-1, 0, 0, -1, x1, y1];
      case 270: return [0, -1, 1, 0, x0, y1];
      default: return [1, 0, 0, 1, x0, y0];
    }
  }

  /** Ensure the page has its own Resources dict (not inherited) and return it. */
  pageResources(page) {
    let res = page.dict.get('Resources');
    let r = this.resolve(res);
    if (!(r instanceof Dict)) {
      r = page.resources instanceof Dict ? page.resources.clone() : new Dict();
      page.dict.set('Resources', r);
    } else if (!(res instanceof Dict) && page.dict.get('Resources') === undefined) {
      page.dict.set('Resources', res);
    }
    page.resources = r;
    return r;
  }
  resourceSubDict(page, kind) {
    const res = this.pageResources(page);
    let sub = this.resolve(res.get(kind));
    if (!(sub instanceof Dict)) { sub = new Dict(); res.set(kind, sub); }
    else if (res.get(kind) instanceof Ref) { sub = sub.clone(); res.set(kind, sub); }
    return sub;
  }
  uniqueResourceName(sub, prefix) {
    let i = 1;
    while (sub.has(prefix + i)) i++;
    return prefix + i;
  }

  /** Get page content as one decoded byte array. */
  pageContent(page) {
    const c = this.resolve(page.dict.get('Contents'));
    const chunks = [];
    const push = (s) => { const stm = this.resolve(s); if (stm instanceof PDFStream) { chunks.push(this.streamData(stm).data); chunks.push(new Uint8Array([10])); } };
    if (Array.isArray(c)) for (const s of c) push(s); else if (c) push(c);
    return concat(chunks);
  }

  /** Wrap page content: prepend `before` ops and append `after` ops (strings of content operators). */
  async wrapPageContent(page, before, after) {
    const existing = this.resolve(page.dict.get('Contents'));
    const list = Array.isArray(existing) ? existing.slice() : existing ? [page.dict.get('Contents')] : [];
    const out = [];
    if (before) out.push(await this.addStream(new Dict(), latin1.encode(before + '\n')));
    out.push(...list);
    if (after) out.push(await this.addStream(new Dict(), latin1.encode('\n' + after + '\n')));
    page.dict.set('Contents', out);
  }

  /** Replace the page's content entirely. */
  async setPageContent(page, ops) {
    page.dict.set('Contents', await this.addStream(new Dict(), ops instanceof Uint8Array ? ops : latin1.encode(ops)));
  }

  addPage({ width = 612, height = 792, mediaBox } = {}) {
    const pagesRef = this.catalog.get('Pages');
    const pages = this.resolve(pagesRef);
    const page = new Dict({ Type: N('Page'), Parent: pagesRef, MediaBox: mediaBox || [0, 0, width, height], Resources: new Dict() });
    const ref = this.add(page);
    pages.get('Kids').push(ref);
    pages.set('Count', (this.resolve(pages.get('Count')) || 0) + 1);
    this._pages = null;
    return { ref, dict: page, mediaBox: mediaBox || [0, 0, width, height], cropBox: null, rotate: 0, resources: page.get('Resources') };
  }

  /** Move a page (by index) to a new index. Works across nested page trees by re-parenting into the root Pages node. */
  movePage(from, to) {
    const list = this.pages;
    const page = list[from];
    if (!page || !page.ref) throw new PdfError('Cannot move this page');
    const rootRef = this.catalog.get('Pages');
    const root = this.resolve(rootRef);
    // remove from current parent chain
    let parentRef = page.dict.get('Parent');
    let parent = this.resolve(parentRef);
    if (parent instanceof Dict) {
      const kids = this.resolve(parent.get('Kids')) || [];
      const idx = kids.findIndex((k) => k instanceof Ref && k.num === page.ref.num);
      if (idx >= 0) kids.splice(idx, 1);
      let anc = parent;
      while (anc instanceof Dict) { anc.set('Count', Math.max(0, (this.resolve(anc.get('Count')) || 1) - 1)); anc = this.resolve(anc.get('Parent')); }
    }
    // insert before the page currently at `to` (in the root Kids if it lives there, else append/prepend at root)
    const rootKids = this.resolve(root.get('Kids'));
    const target = list.filter((p) => p !== page)[to];
    let pos = target ? rootKids.findIndex((k) => k instanceof Ref && k.num === target.ref.num) : -1;
    if (pos < 0) pos = to <= 0 ? 0 : rootKids.length;
    rootKids.splice(pos, 0, page.ref);
    page.dict.set('Parent', rootRef);
    root.set('Count', (this.resolve(root.get('Count')) || 0) + 1);
    this._pages = null;
  }

  get info() {
    let info = this.resolve(this.trailer.get('Info'));
    if (!(info instanceof Dict)) { info = new Dict(); this.trailer.set('Info', this.add(info)); }
    return info;
  }

  // ---------------- Saving ----------------
  /** Serialize the whole document (full rewrite with a fresh classic xref table). */
  async save({ producer = 'Cortexis Tools' } = {}) {
    if (this.trailer.get('Encrypt')) throw new PdfError('encrypted');
    this.info.set('Producer', PDFString.fromText(producer));
    this.info.set('ModDate', PDFString.fromText(pdfDate(new Date())));
    // collect reachable objects from Root and Info, renumber 1..N
    const order = [];
    const newNum = new Map();
    const visit = (o) => {
      if (o instanceof Ref) {
        if (newNum.has(o.num)) return;
        newNum.set(o.num, order.length + 1);
        order.push(o.num);
        const v = this.fetch(o.num);
        visit(v);
      } else if (Array.isArray(o)) for (const x of o) visit(x);
      else if (o instanceof PDFStream) { for (const v of o.dict.map.values()) visit(v); }
      else if (o instanceof Dict) { for (const v of o.map.values()) visit(v); }
    };
    // iterative to avoid deep recursion on huge files
    const stack = [];
    const push = (o) => stack.push(o);
    const visitIter = (start) => {
      push(start);
      while (stack.length) {
        const o = stack.pop();
        if (o instanceof Ref) {
          if (newNum.has(o.num)) continue;
          newNum.set(o.num, order.length + 1);
          order.push(o.num);
          push(this.fetch(o.num));
        } else if (Array.isArray(o)) { for (let i = o.length - 1; i >= 0; i--) push(o[i]); }
        else if (o instanceof PDFStream) { for (const v of o.dict.map.values()) push(v); }
        else if (o instanceof Dict) { for (const v of o.map.values()) push(v); }
      }
    };
    void visit;
    visitIter(this.trailer.get('Root'));
    if (this.trailer.get('Info')) visitIter(this.trailer.get('Info'));
    const refMap = (r) => newNum.get(r.num) ?? 0;
    const w = new ByteWriter(this.bytes ? this.bytes.length + 65536 : 65536);
    const ver = Math.max(1.5, parseFloat(this.version) || 1.5).toFixed(1);
    w.str(`%PDF-${ver}\n%\xe2\xe3\xcf\xd3\n`);
    const offsets = [];
    for (let i = 0; i < order.length; i++) {
      const num = order[i];
      let obj = this.fetch(num);
      if (obj === undefined) obj = null;
      offsets.push(w.position);
      w.str(`${i + 1} 0 obj\n`);
      w.bytes(partsToBytes(serialize(obj, refMap)));
      w.str('\nendobj\n');
    }
    const xrefPos = w.position;
    w.str(`xref\n0 ${order.length + 1}\n0000000000 65535 f \n`);
    for (const off of offsets) w.str(String(off).padStart(10, '0') + ' 00000 n \n');
    const tr = new Dict({ Size: order.length + 1, Root: this.trailer.get('Root') });
    if (this.trailer.get('Info')) tr.set('Info', this.trailer.get('Info'));
    const id = randomBytes(16);
    tr.set('ID', [new PDFString(id, true), new PDFString(id, true)]);
    w.str('trailer\n');
    w.bytes(partsToBytes(serialize(tr, refMap)));
    w.str(`\nstartxref\n${xrefPos}\n%%EOF\n`);
    return w.result();
  }
}

function normBox(b) { return [Math.min(b[0], b[2]), Math.min(b[1], b[3]), Math.max(b[0], b[2]), Math.max(b[1], b[3])]; }
function intersect(a, b) { return [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])]; }
function randomBytes(n) {
  const b = new Uint8Array(n);
  if (globalThis.crypto && crypto.getRandomValues) crypto.getRandomValues(b); else for (let i = 0; i < n; i++) b[i] = (Math.random() * 256) | 0;
  return b;
}
export function pdfDate(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `D:${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}
export { Name, N, Ref, Dict, PDFStream, PDFString, isRef, isDict, isStream };
