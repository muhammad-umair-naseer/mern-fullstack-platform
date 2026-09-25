// Data & text format helpers: CSV, YAML (subset), Myers diff, MD5, SQL formatting/INSERT parsing.

// ---------------- CSV ----------------
export function detectDelimiter(text) {
  const sample = text.slice(0, 20000).split(/\r?\n/).slice(0, 20);
  const cands = [',', ';', '\t', '|'];
  let best = ',', bestScore = -1;
  for (const d of cands) {
    const counts = sample.filter(Boolean).map((l) => l.split(d).length - 1);
    if (!counts.length) continue;
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((a, b) => a + (b - mean) ** 2, 0) / counts.length;
    const score = mean > 0 ? mean / (1 + variance) : -1;
    if (score > bestScore) { bestScore = score; best = d; }
  }
  return best;
}
/** RFC 4180 parser; returns string[][] */
export function parseCsv(text, delimiter = null) {
  const d = delimiter || detectDelimiter(text);
  const rows = []; let row = [], field = '', q = false, i = 0;
  if (text.charCodeAt(0) === 0xfeff) i = 1;
  for (; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === d) { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === '' && rows.length > 1));
}
export function stringifyCsv(rows, { delimiter = ',', newline = '\n', quoteAll = false } = {}) {
  const esc = (v) => { const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return quoteAll || /["\r\n]/.test(s) || s.includes(delimiter) || /^\s|\s$/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  return rows.map((r) => r.map(esc).join(delimiter)).join(newline);
}
export function csvToObjects(rows, { coerce = true } = {}) {
  if (!rows.length) return [];
  const [head, ...body] = rows;
  return body.map((r) => { const o = {}; head.forEach((h, i) => { o[h || `col${i + 1}`] = coerce ? coerceCsv(r[i] ?? '') : (r[i] ?? ''); }); return o; });
}
export function coerceCsv(s) {
  if (s === '') return '';
  if (s === 'true' || s === 'TRUE') return true; if (s === 'false' || s === 'FALSE') return false; if (s === 'null' || s === 'NULL') return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][-+]?\d+)?$/.test(s) && s.length < 16) return Number(s);
  return s;
}
/** Flatten JSON (array of objects / object / nested) to rows with a header union (dot paths). */
export function jsonToRows(data, { flatten = true } = {}) {
  let list = Array.isArray(data) ? data : data && typeof data === 'object' ? (Object.values(data).find((v) => Array.isArray(v) && v.length && typeof v[0] === 'object') || [data]) : [data];
  const flat = (o, prefix = '', out = {}) => { if (o === null || typeof o !== 'object') { out[prefix || 'value'] = o; return out; } if (Array.isArray(o) && !flatten) { out[prefix] = JSON.stringify(o); return out; } for (const [k, v] of Object.entries(o)) { const key = prefix ? prefix + '.' + k : k; if (v && typeof v === 'object' && flatten) flat(v, key, out); else out[key] = v && typeof v === 'object' ? JSON.stringify(v) : v; } return out; };
  const objs = list.map((x) => flat(x));
  const headers = []; const seen = new Set();
  for (const o of objs) for (const k of Object.keys(o)) if (!seen.has(k)) { seen.add(k); headers.push(k); }
  return [headers, ...objs.map((o) => headers.map((h) => (o[h] === undefined ? '' : o[h])))];
}

// ---------------- YAML (practical subset: block maps/seqs, flow, scalars, block scalars, comments, anchors/aliases) ----------------
export function parseYaml(src) {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  // strip document markers & comments (outside quotes)
  const clean = lines.map((l) => (l.trim() === '---' || l.trim() === '...' ? '' : l));
  const anchors = {};
  let pos = 0;
  const indentOf = (l) => l.match(/^ */)[0].length;
  const stripComment = (s) => { let q = null, out = ''; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { out += c; if (c === q && s[i - 1] !== '\\') q = null; } else if (c === '"' || c === "'") { q = c; out += c; } else if (c === '#' && (i === 0 || /\s/.test(s[i - 1]))) break; else out += c; } return out.trimEnd(); };
  const isBlank = (l) => !stripComment(l).trim();
  const next = () => { while (pos < clean.length && isBlank(clean[pos])) pos++; return pos < clean.length ? clean[pos] : null; };
  const scalar = (s) => {
    s = s.trim();
    if (s === '' || s === '~' || s === 'null' || s === 'Null' || s === 'NULL') return null;
    if (s === 'true' || s === 'True' || s === 'TRUE') return true; if (s === 'false' || s === 'False' || s === 'FALSE') return false;
    if (s[0] === '"') return JSON.parse(s.replace(/\n/g, '\\n'));
    if (s[0] === "'") return s.slice(1, -1).replace(/''/g, "'");
    if (s[0] === '*') { const a = s.slice(1); if (!(a in anchors)) throw new Error('Unknown alias *' + a); return anchors[a]; }
    if (/^[-+]?(0|[1-9][0-9_]*)$/.test(s)) return parseInt(s.replace(/_/g, ''), 10);
    if (/^0x[0-9a-fA-F]+$/.test(s)) return parseInt(s, 16);
    if (/^0o[0-7]+$/.test(s)) return parseInt(s.slice(2), 8);
    if (/^[-+]?(\.\d+|\d+(\.\d*)?)([eE][-+]?\d+)?$/.test(s)) return parseFloat(s);
    if (/^[-+]?\.(inf|Inf|INF)$/.test(s)) return s[0] === '-' ? -Infinity : Infinity;
    if (/^\.(nan|NaN|NAN)$/.test(s)) return NaN;
    if (s[0] === '[' || s[0] === '{') return parseFlow(s);
    return s;
  };
  function parseFlow(s) {
    let i = 0;
    const ws = () => { while (i < s.length && /\s/.test(s[i])) i++; };
    const readScalar = (stops) => { ws(); if (s[i] === '"' || s[i] === "'") { const q = s[i]; let j = i + 1; while (j < s.length && s[j] !== q) { if (s[j] === '\\' && q === '"') j++; j++; } const v = scalar(s.slice(i, j + 1)); i = j + 1; return v; } let j = i; while (j < s.length && !stops.includes(s[j])) j++; const v = scalar(s.slice(i, j)); i = j; return v; };
    const value = () => { ws(); if (s[i] === '[') { i++; const arr = []; ws(); if (s[i] === ']') { i++; return arr; } for (;;) { arr.push(value()); ws(); if (s[i] === ',') { i++; ws(); if (s[i] === ']') { i++; return arr; } continue; } if (s[i] === ']') { i++; return arr; } throw new Error('Bad flow sequence'); } }
      if (s[i] === '{') { i++; const obj = {}; ws(); if (s[i] === '}') { i++; return obj; } for (;;) { const k = readScalar([':', ',', '}']); ws(); let v = null; if (s[i] === ':') { i++; v = value(); } obj[k] = v; ws(); if (s[i] === ',') { i++; ws(); if (s[i] === '}') { i++; return obj; } continue; } if (s[i] === '}') { i++; return obj; } throw new Error('Bad flow mapping'); } }
      return readScalar([',', ']', '}']); };
    return value();
  }
  const blockScalar = (header, baseIndent) => {
    const fold = header[0] === '>', chomp = header.includes('-') ? 'strip' : header.includes('+') ? 'keep' : 'clip';
    const explicit = /\d/.exec(header);
    const body = []; let ind = explicit ? baseIndent + parseInt(explicit[0], 10) : -1;
    while (pos < clean.length) {
      const l = clean[pos];
      if (l.trim() === '') { body.push(''); pos++; continue; }
      const li = indentOf(l);
      if (ind < 0) { if (li <= baseIndent) break; ind = li; }
      if (li < ind) break;
      body.push(l.slice(ind)); pos++;
    }
    while (body.length && body[body.length - 1] === '' && chomp !== 'keep') body.pop();
    let text = fold ? body.reduce((acc, line, idx) => (idx === 0 ? line : line === '' ? acc + '\n' : acc.endsWith('\n') || /^\s/.test(line) ? acc + line : acc + ' ' + line), '') : body.join('\n');
    if (chomp !== 'strip') text += '\n';
    return text;
  };
  const parseNode = (indent) => {
    const l = next();
    if (l === null) return null;
    const li = indentOf(l);
    if (li < indent) return null;
    const c = stripComment(l).slice(li);
    if (/^-(\s|$)/.test(c)) return parseSeq(li);
    if (/^("([^"\\]|\\.)*"|'[^']*'|[^\s"'][^:]*?|[^:]*?)\s*:(\s|$)/.test(c) && !c.startsWith('[') && !c.startsWith('{')) return parseMap(li);
    pos++;
    if (/^[|>]/.test(c)) return blockScalar(c, li);
    // multi-line plain scalar
    let s = c;
    while (pos < clean.length) { const nl = clean[pos]; if (isBlank(nl)) break; if (indentOf(nl) <= indent && indent > 0) break; if (indentOf(nl) < li) break; s += ' ' + stripComment(nl).trim(); pos++; }
    return scalar(s);
  };
  const withAnchor = (raw, fn) => { const m = /^&([^\s]+)\s*/.exec(raw); if (m) { const v = fn(raw.slice(m[0].length)); anchors[m[1]] = v; return v; } return fn(raw); };
  const valueAfterKey = (rest, indent) => {
    rest = rest.trim();
    if (rest === '') { const v = parseNode(indent + 1); return v === null ? null : v; }
    return withAnchor(rest, (r) => {
      if (/^[|>]/.test(r)) return blockScalar(r, indent);
      if (r === '' ) return parseNode(indent + 1);
      if (r.startsWith('[') || r.startsWith('{')) { // flow may span lines
        let s = r; while (pos < clean.length && !balanced(s)) { s += ' ' + stripComment(clean[pos]).trim(); pos++; } return parseFlow(s); }
      let s = r; while (pos < clean.length) { const nl = clean[pos]; if (isBlank(nl) || indentOf(nl) <= indent) break; s += ' ' + stripComment(nl).trim(); pos++; }
      return scalar(s);
    });
  };
  const balanced = (s) => { let d = 0, q = null; for (const ch of s) { if (q) { if (ch === q) q = null; continue; } if (ch === '"' || ch === "'") q = ch; else if (ch === '[' || ch === '{') d++; else if (ch === ']' || ch === '}') d--; } return d <= 0; };
  const parseMap = (indent) => {
    const obj = {};
    for (;;) {
      const l = next(); if (l === null) break;
      const li = indentOf(l); if (li !== indent) break;
      const c = stripComment(l).slice(li);
      if (/^-(\s|$)/.test(c)) break;
      const m = /^("([^"\\]|\\.)*"|'[^']*'|[^:]*?)\s*:(?:\s+|$)(.*)$/.exec(c);
      if (!m) throw new Error('Invalid YAML near line ' + (pos + 1) + ': ' + c);
      const key = String(scalar(m[1]) ?? 'null');
      pos++;
      const rest = m[3] ?? '';
      if (rest.trim() === '') { const nl = next(); obj[key] = nl !== null && indentOf(nl) > indent ? parseNode(indent + 1) : nl !== null && indentOf(nl) === indent && /^-(\s|$)/.test(stripComment(nl).trim()) ? parseSeq(indent) : null; }
      else obj[key] = valueAfterKey(rest, indent);
    }
    return obj;
  };
  const parseSeq = (indent) => {
    const arr = [];
    for (;;) {
      const l = next(); if (l === null) break;
      const li = indentOf(l); if (li !== indent) break;
      const c = stripComment(l).slice(li);
      if (!/^-(\s|$)/.test(c)) break;
      const rest = c.slice(1).trim();
      if (rest === '') { pos++; arr.push(parseNode(indent + 1)); continue; }
      // inline: "- key: value" starts a map at column indent+2
      if (/^("([^"\\]|\\.)*"|'[^']*'|[^\s"'][^:]*?)\s*:(\s|$)/.test(rest) && !rest.startsWith('[') && !rest.startsWith('{')) {
        const col = li + 1 + (c.slice(1).length - c.slice(1).trimStart().length);
        clean[pos] = ' '.repeat(col) + rest; // rewrite the line as an indented map row
        arr.push(parseMap(col)); continue;
      }
      if (/^-(\s|$)/.test(rest)) { const col = li + 1 + (c.slice(1).length - c.slice(1).trimStart().length); clean[pos] = ' '.repeat(col) + rest; arr.push(parseSeq(col)); continue; }
      pos++;
      arr.push(valueAfterKey(rest, indent));
    }
    return arr;
  };
  const v = parseNode(0);
  const trailing = next();
  if (trailing !== null) throw new Error('Unexpected content at line ' + (pos + 1) + ': ' + trailing.trim());
  return v;
}
export function stringifyYaml(v, indent = 2) {
  const pad = (n) => ' '.repeat(n);
  const needsQuote = (s) => s === '' || /^[\s]|[\s]$|^[-?:,\[\]{}#&*!|>'"%@`]|: |#|^(true|false|null|~|yes|no|on|off)$|^[-+]?(\.\d|\d)/i.test(s) || /[\n\t]/.test(s);
  const str = (s) => (needsQuote(s) ? JSON.stringify(s) : s);
  const dump = (x, lvl) => {
    if (x === null || x === undefined) return 'null';
    if (typeof x === 'number') return Number.isFinite(x) ? String(x) : x > 0 ? '.inf' : x < 0 ? '-.inf' : '.nan';
    if (typeof x === 'boolean') return String(x);
    if (typeof x === 'string') {
      if (x.includes('\n') && !/^\s|[ \t]$/.test(x) && !/\n\n$/.test(x)) { const body = x.replace(/\n$/, ''); return (x.endsWith('\n') ? '|' : '|-') + '\n' + body.split('\n').map((l) => (l ? pad(lvl + indent) + l : '')).join('\n'); }
      return str(x);
    }
    if (Array.isArray(x)) { if (!x.length) return '[]'; return x.map((it) => pad(lvl) + '-' + (isCollection(it) && nonEmpty(it) ? (Array.isArray(it) ? '\n' + dump(it, lvl + indent) : '\n' + dump(it, lvl + indent)) : ' ' + dump(it, lvl + indent).trimStart())).join('\n'); }
    const keys = Object.keys(x); if (!keys.length) return '{}';
    return keys.map((k) => pad(lvl) + str(k) + ':' + (isCollection(x[k]) && nonEmpty(x[k]) ? '\n' + dump(x[k], lvl + indent) : ' ' + dump(x[k], lvl + indent))).join('\n');
  };
  const isCollection = (y) => y && typeof y === 'object';
  const nonEmpty = (y) => (Array.isArray(y) ? y.length > 0 : Object.keys(y).length > 0);
  return dump(v, 0);
}

// ---------------- Diff (Myers) ----------------
/** Returns ops: [{type:'eq'|'del'|'ins', a?:string, b?:string}] for arrays of tokens. */
export function myersDiff(a, b) {
  const n = a.length, m = b.length, max = n + m;
  if (!max) return [];
  const v = new Map([[1, 0]]);
  const trace = [];
  outer: for (let d = 0; d <= max; d++) {
    trace.push(new Map(v));
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && (v.get(k - 1) ?? -1) < (v.get(k + 1) ?? -1)) ? (v.get(k + 1) ?? 0) : (v.get(k - 1) ?? 0) + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) { x++; y++; }
      v.set(k, x);
      if (x >= n && y >= m) break outer;
    }
  }
  // backtrack
  const ops = [];
  let x = n, y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const vv = trace[d]; const k = x - y;
    const prevK = k === -d || (k !== d && (vv.get(k - 1) ?? -1) < (vv.get(k + 1) ?? -1)) ? k + 1 : k - 1;
    const prevX = vv.get(prevK) ?? 0, prevY = prevX - prevK;
    while (x > prevX && y > prevY) { ops.push({ type: 'eq', a: a[x - 1], b: b[y - 1] }); x--; y--; }
    if (d > 0) { if (x === prevX) { ops.push({ type: 'ins', b: b[y - 1] }); y--; } else { ops.push({ type: 'del', a: a[x - 1] }); x--; } }
  }
  return ops.reverse();
}
export function diffLines(a, b, { ignoreWhitespace = false, ignoreCase = false } = {}) {
  const norm = (s) => { let t = s; if (ignoreWhitespace) t = t.replace(/\s+/g, ' ').trim(); if (ignoreCase) t = t.toLowerCase(); return t; };
  const al = a.split(/\r?\n/), bl = b.split(/\r?\n/);
  const ops = myersDiff(al.map(norm), bl.map(norm));
  let i = 0, j = 0;
  return ops.map((o) => (o.type === 'eq' ? { type: 'eq', a: al[i++], b: bl[j++] } : o.type === 'del' ? { type: 'del', a: al[i++] } : { type: 'ins', b: bl[j++] }));
}
export function diffChars(a, b) { return myersDiff([...a], [...b]); }
export function diffWords(a, b) { return myersDiff(a.split(/(\s+)/), b.split(/(\s+)/)); }
export function unifiedDiff(a, b, { fileA = 'a', fileB = 'b', context = 3 } = {}) {
  const ops = diffLines(a, b);
  const out = [`--- ${fileA}`, `+++ ${fileB}`];
  let i = 0;
  while (i < ops.length) {
    if (ops[i].type === 'eq') { i++; continue; }
    let start = Math.max(0, i - context), end = i;
    let gap = 0;
    while (end < ops.length && gap <= context * 2) { if (ops[end].type === 'eq') gap++; else gap = 0; end++; }
    end = Math.min(ops.length, end - Math.max(0, gap - context));
    let aLine = 0, bLine = 0;
    for (let k = 0; k < start; k++) { if (ops[k].type !== 'ins') aLine++; if (ops[k].type !== 'del') bLine++; }
    const chunk = ops.slice(start, end);
    const aCount = chunk.filter((o) => o.type !== 'ins').length, bCount = chunk.filter((o) => o.type !== 'del').length;
    out.push(`@@ -${aLine + 1},${aCount} +${bLine + 1},${bCount} @@`);
    for (const o of chunk) out.push(o.type === 'eq' ? ' ' + o.a : o.type === 'del' ? '-' + o.a : '+' + o.b);
    i = end;
  }
  return out.join('\n');
}

// ---------------- MD5 ----------------
export function md5(bytes) {
  const K = new Int32Array(64), S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
  const len = bytes.length, padLen = ((len + 8) >> 6 << 6) + 64;
  const msg = new Uint8Array(padLen); msg.set(bytes); msg[len] = 0x80;
  const bits = len * 8;
  msg[padLen - 8] = bits & 255; msg[padLen - 7] = (bits >>> 8) & 255; msg[padLen - 6] = (bits >>> 16) & 255; msg[padLen - 5] = (bits >>> 24) & 255; msg[padLen - 4] = Math.floor(bits / 4294967296) & 255;
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  const M = new Int32Array(16);
  for (let off = 0; off < padLen; off += 64) {
    for (let i = 0; i < 16; i++) M[i] = msg[off + i * 4] | (msg[off + i * 4 + 1] << 8) | (msg[off + i * 4 + 2] << 16) | (msg[off + i * 4 + 3] << 24);
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; } else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) & 15; } else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) & 15; } else { f = c ^ (b | ~d); g = (7 * i) & 15; }
      const t = d; d = c; c = b;
      const x = (a + f + K[i] + M[g]) | 0;
      b = (b + ((x << S[i]) | (x >>> (32 - S[i])))) | 0;
      a = t;
    }
    a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
  }
  const out = new Uint8Array(16);
  [a0, b0, c0, d0].forEach((v, i) => { out[i * 4] = v & 255; out[i * 4 + 1] = (v >>> 8) & 255; out[i * 4 + 2] = (v >>> 16) & 255; out[i * 4 + 3] = (v >>> 24) & 255; });
  return out;
}

// ---------------- SQL ----------------
const SQL_KW = 'ADD ALL ALTER AND ANY AS ASC BEGIN BETWEEN BY CASE CAST CHECK COLUMN COMMIT CONSTRAINT CREATE CROSS DATABASE DEFAULT DELETE DESC DISTINCT DROP ELSE END EXCEPT EXISTS FALSE FOREIGN FROM FULL GROUP HAVING IF IN INDEX INNER INSERT INTERSECT INTO IS JOIN KEY LEFT LIKE LIMIT NATURAL NOT NULL OFFSET ON OR ORDER OUTER PRIMARY REFERENCES RETURNING RIGHT ROLLBACK SELECT SET TABLE THEN TOP TRUE UNION UNIQUE UPDATE USING VALUES VIEW WHEN WHERE WITH ILIKE OVER PARTITION ROWS WINDOW FETCH FIRST NEXT ONLY REPLACE TRUNCATE ELSEIF LOOP RETURN'.split(' ');
const SQL_KWSET = new Set(SQL_KW);
export function tokenizeSql(sql) {
  const tokens = []; let i = 0;
  const re = /^(\s+)|^(--[^\n]*|#[^\n]*)|^(\/\*[\s\S]*?\*\/)|^('(?:[^'\\]|\\.|'')*'|"(?:[^"\\]|\\.)*"|`[^`]*`|\[[^\]]*\])|^(\$\$[\s\S]*?\$\$)|^([0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?)|^([A-Za-z_][A-Za-z0-9_$]*(?:\.[A-Za-z_*][A-Za-z0-9_$]*)*)|^(::|<>|!=|>=|<=|\|\||[-+*\/%<>=,;().])|^(.)/;
  while (i < sql.length) {
    const m = re.exec(sql.slice(i)); if (!m) break;
    const t = m[0]; i += t.length;
    if (m[1]) continue;
    const type = m[2] ? 'lc' : m[3] ? 'bc' : m[4] || m[5] ? 'str' : m[6] ? 'num' : m[7] ? (SQL_KWSET.has(t.toUpperCase()) ? 'kw' : 'id') : m[8] ? 'op' : 'other';
    tokens.push({ type, text: t });
  }
  return tokens;
}
export function formatSql(sql, { indent = '  ', keywordCase = 'upper', linesBetweenQueries = 1 } = {}) {
  const toks = tokenizeSql(sql);
  const kw = (t) => (keywordCase === 'upper' ? t.toUpperCase() : keywordCase === 'lower' ? t.toLowerCase() : t);
  const NEWLINE_KW = new Set(['SELECT', 'FROM', 'WHERE', 'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'VALUES', 'SET', 'INSERT', 'UPDATE', 'DELETE', 'UNION', 'EXCEPT', 'INTERSECT', 'RETURNING', 'WITH', 'CREATE', 'ALTER', 'DROP', 'WINDOW', 'FETCH']);
  const JOIN_KW = new Set(['JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'NATURAL']);
  const AND_KW = new Set(['AND', 'OR', 'ON', 'WHEN', 'ELSE', 'THEN']);
  let out = '', depth = 0, lineStart = true, prevText = '', inSelectList = false;
  const nl = (extra = 0) => { out = out.replace(/[ \t]+$/, ''); out += '\n' + indent.repeat(Math.max(0, depth + extra)); lineStart = true; };
  const put = (s) => { if (!lineStart && !/^[,);:.]/.test(s) && !/[(.]$/.test(prevText) && !(prevText === '::')) out += ' '; out += s; lineStart = false; prevText = s; };
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i]; const up = t.text.toUpperCase();
    const prevUp = prevText.toUpperCase();
    if (t.type === 'kw') {
      if ((up === 'BY' && (prevUp === 'GROUP' || prevUp === 'ORDER' || prevUp === 'PARTITION')) || (up === 'JOIN' && JOIN_KW.has(prevUp)) || (up === 'OUTER' && JOIN_KW.has(prevUp)) || (up === 'INTO' && prevUp === 'INSERT') || (up === 'TABLE' && (prevUp === 'CREATE' || prevUp === 'ALTER' || prevUp === 'DROP')) || (up === 'NOT' && prevUp === 'IS') || (up === 'ALL' && prevUp === 'UNION') || (up === 'EXISTS' && prevUp === 'IF') || (up === 'NOT' && prevUp === 'IF')) { put(kw(t.text)); if (up === 'INTO' || up === 'TABLE') inSelectList = false; continue; }
      if (NEWLINE_KW.has(up) || (JOIN_KW.has(up) && !JOIN_KW.has(prevUp))) { if (!lineStart || out.trim()) nl(); put(kw(t.text)); inSelectList = up === 'SELECT' || up === 'SET' || up === 'RETURNING'; continue; }
      if (AND_KW.has(up)) { nl(1); put(kw(t.text)); continue; }
      if (up === 'CASE') { put(kw(t.text)); depth++; continue; }
      if (up === 'END') { depth--; nl(); put(kw(t.text)); continue; }
      put(kw(t.text)); continue;
    }
    if (t.type === 'op') {
      if (t.text === '(') { if (toks[i - 1]?.type === 'id' || (toks[i - 1]?.type === 'kw' && /^(COUNT|SUM|AVG|MIN|MAX|CAST|COALESCE|REPLACE|IF|EXISTS|IN|VALUES|OVER)$/i.test(toks[i - 1].text))) { out += '('; prevText = '('; lineStart = false; } else put('('); const nextUp = toks[i + 1]?.text.toUpperCase(); if (nextUp === 'SELECT') { depth++; nl(); } continue; }
      if (t.text === ')') { if (/\n\s*$/.test(out) || toks[i - 1]?.text.toUpperCase() === 'END' && false) {} if (out.split('\n').pop().trim() === '' ) {} const wasSub = out.lastIndexOf('(') >= 0; if (depth > 0 && /\n\s*$|\S$/.test(out) && wasSub && out.slice(out.lastIndexOf('(')).includes('\n')) { depth--; nl(); } out += ')'; prevText = ')'; lineStart = false; continue; }
      if (t.text === ',') { out += ','; prevText = ','; if (inSelectList) nl(1); else lineStart = false; continue; }
      if (t.text === ';') { out += ';'; depth = 0; inSelectList = false; for (let k = 0; k < linesBetweenQueries + 1; k++) out += '\n'; lineStart = true; prevText = ''; continue; }
      put(t.text); continue;
    }
    if (t.type === 'lc') { if (!lineStart) out += ' '; out += t.text; nl(); continue; }
    put(t.text);
  }
  return out.split('\n').map((l) => l.replace(/[ \t]+$/, '')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
export function minifySql(sql) { return tokenizeSql(sql).filter((t) => t.type !== 'lc' && t.type !== 'bc').map((t) => t.text).join(' ').replace(/\s*([(),;])\s*/g, '$1').replace(/\s+/g, ' ').trim(); }

/** Parse INSERT INTO t (cols) VALUES (...),(...); statements into {table, columns, rows}. */
export function sqlInsertsToTable(sql) {
  const toks = tokenizeSql(sql).filter((t) => t.type !== 'lc' && t.type !== 'bc');
  const result = [];
  let i = 0;
  const unq = (s) => (/^[`"\[]/.test(s) ? s.slice(1, -1) : s);
  const val = (t) => (t.type === 'str' ? t.text.slice(1, -1).replace(/''/g, "'").replace(/\\'/g, "'") : t.type === 'num' ? Number(t.text) : t.text.toUpperCase() === 'NULL' ? null : t.text.toUpperCase() === 'TRUE' ? true : t.text.toUpperCase() === 'FALSE' ? false : t.text);
  while (i < toks.length) {
    if (toks[i].type === 'kw' && toks[i].text.toUpperCase() === 'INSERT') {
      i++; if (toks[i]?.text.toUpperCase() === 'INTO') i++;
      const table = unq(toks[i++]?.text || 'table');
      let columns = [];
      if (toks[i]?.text === '(') { i++; while (i < toks.length && toks[i].text !== ')') { if (toks[i].text !== ',') columns.push(unq(toks[i].text)); i++; } i++; }
      if (toks[i]?.text.toUpperCase() === 'VALUES') i++;
      const rows = [];
      while (i < toks.length && toks[i].text === '(') {
        i++; const row = [];
        while (i < toks.length && toks[i].text !== ')') { if (toks[i].text === '-' && toks[i + 1]?.type === 'num') { row.push(-Number(toks[i + 1].text)); i += 2; continue; } if (toks[i].text !== ',') row.push(val(toks[i])); i++; }
        i++; rows.push(row);
        if (toks[i]?.text === ',') i++;
      }
      let entry = result.find((r) => r.table === table && r.columns.join() === columns.join());
      if (!entry) { entry = { table, columns, rows: [] }; result.push(entry); }
      entry.rows.push(...rows);
    } else i++;
  }
  return result;
}
export function tableToSqlInserts(table, columns, rows, { dialect = 'mysql', batch = 1, createTable = false } = {}) {
  const q = (name) => (dialect === 'mysql' ? '`' + name + '`' : dialect === 'mssql' ? '[' + name + ']' : '"' + name + '"');
  const lit = (v) => (v === null || v === undefined || v === '' ? 'NULL' : typeof v === 'number' ? String(v) : typeof v === 'boolean' ? (dialect === 'mssql' ? (v ? '1' : '0') : v ? 'TRUE' : 'FALSE') : "'" + String(v).replace(/'/g, "''") + "'");
  const out = [];
  if (createTable) {
    const types = columns.map((_, ci) => { const vals = rows.map((r) => r[ci]).filter((v) => v !== '' && v != null); if (vals.length && vals.every((v) => typeof v === 'number' && Number.isInteger(v))) return 'INTEGER'; if (vals.length && vals.every((v) => typeof v === 'number')) return dialect === 'mssql' ? 'FLOAT' : 'DOUBLE PRECISION'; if (vals.length && vals.every((v) => typeof v === 'boolean')) return dialect === 'mssql' ? 'BIT' : 'BOOLEAN'; const maxLen = Math.max(1, ...vals.map((v) => String(v).length)); return maxLen > 255 ? 'TEXT' : `VARCHAR(${Math.min(255, Math.max(32, maxLen))})`; });
    out.push(`CREATE TABLE ${q(table)} (\n${columns.map((c, i) => `  ${q(c)} ${types[i]}`).join(',\n')}\n);`);
  }
  for (let i = 0; i < rows.length; i += batch) {
    const chunk = rows.slice(i, i + batch);
    out.push(`INSERT INTO ${q(table)} (${columns.map(q).join(', ')}) VALUES\n${chunk.map((r) => '  (' + columns.map((_, ci) => lit(r[ci])).join(', ') + ')').join(',\n')};`);
  }
  return out.join('\n');
}
