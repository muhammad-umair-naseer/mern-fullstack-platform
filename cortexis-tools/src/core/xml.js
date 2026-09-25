// Small, forgiving XML parser + serializer (works in Node and browsers; no DOMParser needed).
// Node shape: { type:'element', name, attrs:{}, children:[] } | { type:'text', text } | { type:'cdata', text } | { type:'comment', text } | { type:'pi', text }

const ENT = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };
export function decodeEntities(s) {
  if (s.indexOf('&') < 0) return s;
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, e) => {
    if (e[0] === '#') { const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return isFinite(cp) ? String.fromCodePoint(cp) : m; }
    return ENT[e] ?? m;
  });
}
export function escapeXml(s, attr = false) {
  s = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return attr ? s.replace(/"/g, '&quot;') : s;
}

export function parseXml(src) {
  const root = { type: 'document', children: [], declaration: null };
  const stack = [root];
  let i = 0; const n = src.length;
  const text = (t) => { if (t) stack[stack.length - 1].children.push({ type: 'text', text: decodeEntities(t) }); };
  while (i < n) {
    const lt = src.indexOf('<', i);
    if (lt < 0) { text(src.slice(i)); break; }
    text(src.slice(i, lt));
    if (src.startsWith('<!--', lt)) { const e = src.indexOf('-->', lt + 4); const end = e < 0 ? n : e; stack[stack.length - 1].children.push({ type: 'comment', text: src.slice(lt + 4, end) }); i = end + 3; continue; }
    if (src.startsWith('<![CDATA[', lt)) { const e = src.indexOf(']]>', lt + 9); const end = e < 0 ? n : e; stack[stack.length - 1].children.push({ type: 'cdata', text: src.slice(lt + 9, end) }); i = end + 3; continue; }
    if (src.startsWith('<?', lt)) { const e = src.indexOf('?>', lt + 2); const end = e < 0 ? n : e; const body = src.slice(lt + 2, end); if (/^xml\b/i.test(body)) root.declaration = body; else stack[stack.length - 1].children.push({ type: 'pi', text: body }); i = end + 2; continue; }
    if (src.startsWith('<!', lt)) { // DOCTYPE etc.
      let depth = 0, j = lt;
      for (; j < n; j++) { if (src[j] === '[') depth++; else if (src[j] === ']') depth--; else if (src[j] === '>' && depth <= 0) break; }
      root.doctype = src.slice(lt + 2, j); i = j + 1; continue;
    }
    if (src[lt + 1] === '/') { const e = src.indexOf('>', lt); const name = src.slice(lt + 2, e < 0 ? n : e).trim(); // closing
      for (let k = stack.length - 1; k > 0; k--) if (stack[k].name === name) { stack.length = k; break; }
      i = e < 0 ? n : e + 1; continue; }
    // open tag
    let j = lt + 1;
    while (j < n && !/[\s/>]/.test(src[j])) j++;
    const name = src.slice(lt + 1, j);
    const attrs = {};
    let selfClose = false;
    while (j < n) {
      while (j < n && /\s/.test(src[j])) j++;
      if (src[j] === '>') { j++; break; }
      if (src[j] === '/' && src[j + 1] === '>') { selfClose = true; j += 2; break; }
      let k = j; while (k < n && !/[\s=/>]/.test(src[k])) k++;
      const an = src.slice(j, k); j = k;
      while (j < n && /\s/.test(src[j])) j++;
      let val = '';
      if (src[j] === '=') { j++; while (j < n && /\s/.test(src[j])) j++;
        const q = src[j];
        if (q === '"' || q === "'") { const e = src.indexOf(q, j + 1); val = src.slice(j + 1, e < 0 ? n : e); j = e < 0 ? n : e + 1; }
        else { k = j; while (k < n && !/[\s>]/.test(src[k]) && !(src[k] === '/' && src[k + 1] === '>')) k++; val = src.slice(j, k); j = k; }
      }
      if (an) attrs[an] = decodeEntities(val);
    }
    const el = { type: 'element', name, attrs, children: [] };
    stack[stack.length - 1].children.push(el);
    if (!selfClose) stack.push(el);
    i = j;
  }
  return root;
}

const VOID = new Set();
export function serializeXml(node, { indent = null, level = 0, declaration = true } = {}) {
  const pad = indent ? '\n' + indent.repeat(level) : '';
  if (node.type === 'document') {
    const decl = declaration && node.declaration ? `<?${node.declaration}?>` : '';
    return decl + node.children.map((c) => serializeXml(c, { indent, level, declaration })).join('');
  }
  if (node.type === 'text') return indent ? (node.text.trim() ? pad + escapeXml(node.text.trim()) : '') : escapeXml(node.text);
  if (node.type === 'cdata') return pad + `<![CDATA[${node.text}]]>`;
  if (node.type === 'comment') return pad + `<!--${node.text}-->`;
  if (node.type === 'pi') return pad + `<?${node.text}?>`;
  const attrs = Object.entries(node.attrs).map(([k, v]) => ` ${k}="${escapeXml(v, true)}"`).join('');
  if (!node.children.length) return `${pad}<${node.name}${attrs}/>`;
  const onlyText = node.children.every((c) => c.type === 'text');
  if (onlyText) return `${pad}<${node.name}${attrs}>${escapeXml(node.children.map((c) => c.text).join(''))}</${node.name}>`;
  const inner = node.children.map((c) => serializeXml(c, { indent, level: level + 1, declaration })).join('');
  return `${pad}<${node.name}${attrs}>${inner}${pad}</${node.name}>`;
}

// helpers
export const localName = (name) => (name.includes(':') ? name.slice(name.indexOf(':') + 1) : name);
export function findAll(node, pred, out = []) { for (const c of node.children || []) { if (c.type === 'element' && pred(c)) out.push(c); if (c.children) findAll(c, pred, out); } return out; }
export function child(node, name) { return (node.children || []).find((c) => c.type === 'element' && (c.name === name || localName(c.name) === name)); }
export function children(node, name) { return (node.children || []).filter((c) => c.type === 'element' && (c.name === name || localName(c.name) === name)); }
export function textOf(node) { if (!node) return ''; if (node.type === 'text' || node.type === 'cdata') return node.text; return (node.children || []).map(textOf).join(''); }
export function attr(node, name) { if (!node) return undefined; if (name in node.attrs) return node.attrs[name]; for (const k in node.attrs) if (localName(k) === name) return node.attrs[k]; return undefined; }
export function firstElement(doc) { return (doc.children || []).find((c) => c.type === 'element'); }

// XML <-> JSON (compact, predictable mapping):
//  element -> { "@attr": v, "#text": "...", child: {...} | [{...}] }
export function xmlToJson(node, { attrPrefix = '@', textKey = '#text', trim = true, coerce = true } = {}) {
  const conv = (el) => {
    const obj = {};
    for (const [k, v] of Object.entries(el.attrs)) obj[attrPrefix + k] = coerce ? coerceScalar(v) : v;
    let text = '';
    for (const c of el.children) {
      if (c.type === 'text' || c.type === 'cdata') text += c.text;
      else if (c.type === 'element') {
        const v = conv(c);
        if (c.name in obj) { if (!Array.isArray(obj[c.name])) obj[c.name] = [obj[c.name]]; obj[c.name].push(v); }
        else obj[c.name] = v;
      }
    }
    if (trim) text = text.trim();
    if (text) {
      const val = coerce ? coerceScalar(text) : text;
      if (!Object.keys(obj).length) return val;
      obj[textKey] = val;
    }
    return obj;
  };
  const root = node.type === 'document' ? firstElement(node) : node;
  if (!root) return null;
  return { [root.name]: conv(root) };
}
export function coerceScalar(s) {
  if (s === 'true') return true; if (s === 'false') return false; if (s === 'null') return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][-+]?\d+)?$/.test(s) && s.length < 16) return Number(s);
  return s;
}
export function jsonToXml(value, { rootName = 'root', attrPrefix = '@', textKey = '#text', indent = '  ', itemName = 'item', declaration = true } = {}) {
  const build = (name, v) => {
    if (Array.isArray(v)) return v.map((x) => build(name, x));
    if (v === null || typeof v !== 'object') return [{ type: 'element', name, attrs: {}, children: v == null ? [] : [{ type: 'text', text: String(v) }] }];
    const el = { type: 'element', name, attrs: {}, children: [] };
    for (const [k, x] of Object.entries(v)) {
      if (k.startsWith(attrPrefix)) el.attrs[k.slice(attrPrefix.length)] = String(x);
      else if (k === textKey) el.children.push({ type: 'text', text: String(x) });
      else if (Array.isArray(x)) for (const item of x) el.children.push(...build(k, item));
      else el.children.push(...build(k, x));
    }
    return [el];
  };
  let nodes;
  if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 1) nodes = build(Object.keys(value)[0], Object.values(value)[0]);
  else if (Array.isArray(value)) nodes = [{ type: 'element', name: rootName, attrs: {}, children: value.flatMap((x) => build(itemName, x)) }];
  else nodes = build(rootName, value);
  const doc = { type: 'document', declaration: declaration ? 'xml version="1.0" encoding="UTF-8"' : null, children: nodes };
  const out = serializeXml(doc, { indent, declaration });
  return out.replace(/^(<\?[^>]*\?>)\n?/, '$1\n').trim();
}
