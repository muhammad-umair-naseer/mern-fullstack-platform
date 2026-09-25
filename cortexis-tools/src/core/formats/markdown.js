// Markdown: parse to blocks -> HTML, or -> PDF (via PdfBuilder). CommonMark-ish subset that covers real-world docs:
// headings (ATX + setext), paragraphs, emphasis/strong/code/strike, links, images, autolinks, blockquotes, fenced/indented code,
// ordered/unordered/task lists (nested), tables (GFM), hr, hard breaks, inline HTML passthrough (HTML output only).

export function parseMarkdown(src) {
  const lines = src.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  let i = 0;
  const blocks = [];
  const isBlank = (l) => l === undefined || /^\s*$/.test(l);
  const parseBlocks = (getLines) => {
    // generic block parser over an array of lines
    const out = [];
    const L = getLines;
    let p = 0;
    while (p < L.length) {
      const line = L[p];
      if (isBlank(line)) { p++; continue; }
      let m;
      // fenced code
      if ((m = /^ {0,3}(`{3,}|~{3,})\s*([^`\s]*)/.exec(line))) {
        const fence = m[1]; const lang = m[2]; const body = []; p++;
        while (p < L.length && !new RegExp('^ {0,3}' + fence[0] + '{' + fence.length + ',}\\s*$').test(L[p])) body.push(L[p++]);
        p++; out.push({ type: 'code', lang, text: body.join('\n') }); continue;
      }
      // heading
      if ((m = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line))) { out.push({ type: 'heading', level: m[1].length, inlines: parseInline(m[2]) }); p++; continue; }
      // hr
      if (/^ {0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push({ type: 'hr' }); p++; continue; }
      // blockquote
      if (/^ {0,3}>/.test(line)) {
        const body = []; while (p < L.length && (/^ {0,3}>/.test(L[p]) || (!isBlank(L[p]) && body.length && !/^ {0,3}([-*+]|\d+[.)])\s/.test(L[p]) && !/^ {0,3}#/.test(L[p])))) body.push(L[p++].replace(/^ {0,3}> ?/, ''));
        out.push({ type: 'blockquote', children: parseBlocks(body) }); continue;
      }
      // table (GFM)
      if (p + 1 < L.length && line.includes('|') && /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/.test(L[p + 1])) {
        const splitRow = (r) => { r = r.trim().replace(/^\|/, '').replace(/\|$/, ''); const cells = []; let cur = '', esc = false, tick = false; for (const ch of r) { if (ch === '\\' && !esc) { esc = true; cur += ch; continue; } if (ch === '`') tick = !tick; if (ch === '|' && !esc && !tick) { cells.push(cur.trim()); cur = ''; } else cur += ch; esc = false; } cells.push(cur.trim()); return cells.map((c) => c.replace(/\\\|/g, '|')); };
        const header = splitRow(line); const aligns = splitRow(L[p + 1]).map((c) => (/^:-+:$/.test(c) ? 'center' : /-+:$/.test(c) ? 'right' : 'left'));
        const rows = []; p += 2;
        while (p < L.length && !isBlank(L[p]) && L[p].includes('|')) rows.push(splitRow(L[p++]));
        out.push({ type: 'table', header: header.map(parseInline), aligns, rows: rows.map((r) => header.map((_, k) => parseInline(r[k] || ''))) }); continue;
      }
      // list
      if ((m = /^( {0,3})([-*+]|\d{1,9}[.)])\s+(\[[ xX]\]\s+)?/.exec(line))) {
        const ordered = /\d/.test(m[2]); const start = ordered ? parseInt(m[2], 10) : 1;
        const items = []; const marker = m[2];
        while (p < L.length) {
          const mm = /^( {0,3})([-*+]|\d{1,9}[.)])\s+(\[[ xX]\]\s+)?/.exec(L[p]);
          if (!mm || /\d/.test(mm[2]) !== ordered) break;
          const contentIndent = mm[0].length - (mm[3] ? mm[3].length : 0);
          const body = [L[p].slice(mm[0].length)]; p++;
          while (p < L.length) {
            if (isBlank(L[p])) { if (p + 1 < L.length && (L[p + 1].match(/^ */)[0].length >= Math.max(2, contentIndent) )) { body.push(''); p++; continue; } break; }
            const ind = L[p].match(/^ */)[0].length;
            if (ind >= Math.max(2, Math.min(contentIndent, 4))) { body.push(L[p].slice(Math.min(ind, contentIndent))); p++; continue; }
            if (/^( {0,3})([-*+]|\d{1,9}[.)])\s+/.test(L[p])) break;
            if (/^ {0,3}#|^ {0,3}>|^ {0,3}(`{3,}|~{3,})|^ {0,3}([-*_])(\s*\3){2,}\s*$/.test(L[p])) break;
            body.push(L[p]); p++; // lazy continuation
          }
          items.push({ checked: mm[3] ? /x/i.test(mm[3]) : null, children: parseBlocks(body) });
        }
        out.push({ type: 'list', ordered, start, items }); continue;
      }
      // indented code
      if (/^ {4}/.test(line)) { const body = []; while (p < L.length && (/^ {4}/.test(L[p]) || isBlank(L[p]))) body.push(L[p++].replace(/^ {4}/, '')); while (body.length && isBlank(body[body.length - 1])) body.pop(); out.push({ type: 'code', lang: '', text: body.join('\n') }); continue; }
      // html block
      if (/^ {0,3}<(\/?[a-zA-Z][\w-]*|!--)/.test(line) && !/^ {0,3}<(a|em|strong|code|span|b|i|img|br|u|s|del|sup|sub|kbd|mark)\b/i.test(line)) { const body = []; while (p < L.length && !isBlank(L[p])) body.push(L[p++]); out.push({ type: 'html', text: body.join('\n') }); continue; }
      // paragraph / setext heading
      const body = [line]; p++;
      while (p < L.length && !isBlank(L[p]) && !/^ {0,3}(#{1,6}\s|>|(`{3,}|~{3,})|([-*+]|\d{1,9}[.)])\s|([-*_])(\s*\4){2,}\s*$)/.test(L[p]) && !/^ {0,3}(=+|-+)\s*$/.test(L[p])) body.push(L[p++]);
      if (p < L.length && /^ {0,3}(=+|-+)\s*$/.test(L[p]) && !isBlank(body[body.length - 1])) { const level = L[p].trim()[0] === '=' ? 1 : 2; p++; out.push({ type: 'heading', level, inlines: parseInline(body.join(' ').trim()) }); continue; }
      out.push({ type: 'paragraph', inlines: parseInline(body.join('\n').trim()) });
    }
    return out;
  };
  return parseBlocks(lines);
}

/** Inline parser -> [{type:'text'|'strong'|'em'|'code'|'link'|'image'|'br'|'del'|'html', ...}] */
export function parseInline(s) {
  const out = [];
  let i = 0, buf = '';
  const flush = () => { if (buf) { out.push({ type: 'text', text: buf }); buf = ''; } };
  const findClose = (str, from, delim) => { let k = from; while (k < str.length) { if (str[k] === '\\') { k += 2; continue; } if (str.startsWith(delim, k) && (delim.length === 1 || true)) { if (delim.length === 1 && str[k + 1] === delim && str[k - 1] !== ' ') { k += 2; continue; } return k; } if (str[k] === '`') { const e = str.indexOf('`', k + 1); if (e < 0) return -1; k = e + 1; continue; } k++; } return -1; };
  while (i < s.length) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length && /[\\`*_{}\[\]()#+\-.!|~<>]/.test(s[i + 1])) { buf += s[i + 1]; i += 2; continue; }
    if (c === '`') { let n = 0; while (s[i + n] === '`') n++; const close = s.indexOf('`'.repeat(n), i + n); if (close > 0 && s[close + n] !== '`') { flush(); out.push({ type: 'code', text: s.slice(i + n, close).replace(/^ (.*) $/, '$1') }); i = close + n; continue; } buf += s.slice(i, i + n); i += n; continue; }
    if (c === '!' && s[i + 1] === '[') { const e = s.indexOf(']', i + 2); if (e > 0 && s[e + 1] === '(') { const close = s.indexOf(')', e + 2); if (close > 0) { flush(); const inner = s.slice(e + 2, close); const mm = /^\s*(<[^>]*>|\S+)(?:\s+["'(](.*)["')])?\s*$/.exec(inner); out.push({ type: 'image', alt: s.slice(i + 2, e), href: mm ? mm[1].replace(/^<|>$/g, '') : inner, title: mm?.[2] }); i = close + 1; continue; } } }
    if (c === '[') {
      let depth = 1, k = i + 1; while (k < s.length && depth) { if (s[k] === '\\') { k += 2; continue; } if (s[k] === '[') depth++; else if (s[k] === ']') depth--; k++; }
      const e = k - 1;
      if (depth === 0 && s[e + 1] === '(') { let d = 1, q = e + 2; while (q < s.length && d) { if (s[q] === '(') d++; else if (s[q] === ')') d--; q++; } if (d === 0) { flush(); const inner = s.slice(e + 2, q - 1); const mm = /^\s*(<[^>]*>|[^\s]+)(?:\s+["'(](.*)["')])?\s*$/.exec(inner); out.push({ type: 'link', href: mm ? mm[1].replace(/^<|>$/g, '') : inner, title: mm?.[2], children: parseInline(s.slice(i + 1, e)) }); i = q; continue; } }
    }
    if (c === '<') { const m = /^<((https?|ftp|mailto):[^\s<>]+|[^\s<>@]+@[^\s<>]+\.[^\s<>]+)>/.exec(s.slice(i)); if (m) { flush(); const href = m[1].includes('@') && !m[1].startsWith('mailto:') ? 'mailto:' + m[1] : m[1]; out.push({ type: 'link', href, children: [{ type: 'text', text: m[1] }] }); i += m[0].length; continue; } const h = /^<\/?[a-zA-Z][\w-]*(\s[^<>]*)?\/?>/.exec(s.slice(i)); if (h) { flush(); out.push({ type: 'html', text: h[0] }); i += h[0].length; continue; } }
    if (c === '*' || c === '_') {
      const dbl = s[i + 1] === c; const delim = dbl ? c + c : c;
      const after = s[i + delim.length];
      const before = s[i - 1];
      const leftFlanking = after !== undefined && !/\s/.test(after) && (c === '*' || !before || !/[\w]/.test(before));
      if (leftFlanking) {
        const close = findClose(s, i + delim.length, delim);
        if (close > i + delim.length && !/\s/.test(s[close - 1]) && (c === '*' || !/\w/.test(s[close + delim.length] || ''))) { flush(); out.push({ type: dbl ? 'strong' : 'em', children: parseInline(s.slice(i + delim.length, close)) }); i = close + delim.length; continue; }
      }
      buf += c; i++; continue;
    }
    if (c === '~' && s[i + 1] === '~') { const close = s.indexOf('~~', i + 2); if (close > 0) { flush(); out.push({ type: 'del', children: parseInline(s.slice(i + 2, close)) }); i = close + 2; continue; } }
    if (c === '\n') { if (/ {2,}$/.test(buf) || buf.endsWith('\\')) { buf = buf.replace(/( {2,}|\\)$/, ''); flush(); out.push({ type: 'br' }); } else buf += ' '; i++; continue; }
    if (/^(https?:\/\/|www\.)/.test(s.slice(i)) && (i === 0 || /[\s(]/.test(s[i - 1]))) { const m = /^(https?:\/\/|www\.)[^\s<]*[^\s<.,:;"')\]!?]/.exec(s.slice(i)); if (m) { flush(); out.push({ type: 'link', href: m[0].startsWith('www.') ? 'http://' + m[0] : m[0], children: [{ type: 'text', text: m[0] }] }); i += m[0].length; continue; } }
    buf += c; i++;
  }
  flush();
  return out;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeHref = (h) => (/^\s*(javascript|data|vbscript):/i.test(h) ? '#' : h);
export function inlinesToHtml(inlines) {
  return inlines.map((n) => {
    switch (n.type) {
      case 'text': return esc(n.text);
      case 'code': return `<code>${esc(n.text)}</code>`;
      case 'strong': return `<strong>${inlinesToHtml(n.children)}</strong>`;
      case 'em': return `<em>${inlinesToHtml(n.children)}</em>`;
      case 'del': return `<del>${inlinesToHtml(n.children)}</del>`;
      case 'link': return `<a href="${esc(safeHref(n.href))}"${n.title ? ` title="${esc(n.title)}"` : ''}>${inlinesToHtml(n.children)}</a>`;
      case 'image': return `<img src="${esc(safeHref(n.href))}" alt="${esc(n.alt)}"${n.title ? ` title="${esc(n.title)}"` : ''}>`;
      case 'br': return '<br>';
      case 'html': return n.text;
      default: return '';
    }
  }).join('');
}
export function inlinesToText(inlines) { return inlines.map((n) => (n.type === 'text' || n.type === 'code' ? n.text : n.type === 'br' ? '\n' : n.type === 'image' ? n.alt : n.children ? inlinesToText(n.children) : '')).join(''); }
export function slugify(s) { return s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'); }

export function blocksToHtml(blocks, { headingIds = true } = {}) {
  return blocks.map((b) => {
    switch (b.type) {
      case 'heading': return `<h${b.level}${headingIds ? ` id="${slugify(inlinesToText(b.inlines))}"` : ''}>${inlinesToHtml(b.inlines)}</h${b.level}>`;
      case 'paragraph': return `<p>${inlinesToHtml(b.inlines)}</p>`;
      case 'code': return `<pre><code${b.lang ? ` class="language-${esc(b.lang)}"` : ''}>${esc(b.text)}</code></pre>`;
      case 'hr': return '<hr>';
      case 'blockquote': return `<blockquote>${blocksToHtml(b.children, { headingIds })}</blockquote>`;
      case 'html': return b.text;
      case 'list': return `<${b.ordered ? `ol${b.start !== 1 ? ` start="${b.start}"` : ''}` : 'ul'}>${b.items.map((it) => { const inner = it.children.length === 1 && it.children[0].type === 'paragraph' ? inlinesToHtml(it.children[0].inlines) : blocksToHtml(it.children, { headingIds }); return `<li${it.checked !== null ? ' class="task"' : ''}>${it.checked !== null ? `<input type="checkbox" disabled${it.checked ? ' checked' : ''}> ` : ''}${inner}</li>`; }).join('')}</${b.ordered ? 'ol' : 'ul'}>`;
      case 'table': return `<table><thead><tr>${b.header.map((h, k) => `<th align="${b.aligns[k]}">${inlinesToHtml(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c, k) => `<td align="${b.aligns[k]}">${inlinesToHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      default: return '';
    }
  }).join('\n');
}
export function markdownToHtml(src, opts) { return blocksToHtml(parseMarkdown(src), opts); }

export const DOC_CSS = `:root{color-scheme:light dark}body{font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;max-width:820px;margin:40px auto;padding:0 20px;color:#1f2430;background:#fff}@media (prefers-color-scheme:dark){body{color:#e6e8ef;background:#151821}a{color:#8ab4ff}code,pre{background:#1f2430}th{background:#222838}}h1,h2,h3{line-height:1.25;margin:1.6em 0 .6em}h1{font-size:2em;border-bottom:1px solid #d9dce3;padding-bottom:.3em}h2{font-size:1.5em}h3{font-size:1.2em}p,ul,ol,blockquote,pre,table{margin:0 0 1em}code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em;background:#f2f4f8;padding:.15em .35em;border-radius:4px}pre{background:#f2f4f8;padding:14px 16px;border-radius:8px;overflow:auto}pre code{background:none;padding:0}blockquote{border-left:4px solid #c9d1e0;margin-left:0;padding:.2em 1em;color:#5c6478}table{border-collapse:collapse;width:100%}th,td{border:1px solid #d9dce3;padding:6px 10px;text-align:left}th{background:#f2f4f8}img{max-width:100%}hr{border:0;border-top:1px solid #d9dce3;margin:2em 0}li.task{list-style:none;margin-left:-1.3em}a{color:#2e6bff}`;
export function markdownToDocument(src, { title = 'Document', css = DOC_CSS } = {}) {
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${esc(title)}</title>\n<style>${css}</style>\n</head>\n<body>\n${markdownToHtml(src)}\n</body>\n</html>\n`;
}

/** Render markdown blocks with a PdfBuilder (from pdfkit.js). images: async (href)=>({rgba,width,height}|{jpeg}) or null */
export async function renderMarkdownToPdf(builder, blocks, { resolveImage = null, baseSize = 11 } = {}) {
  const b = builder;
  const runsOf = (inlines, base = {}) => {
    const runs = [];
    const walk = (list, st) => { for (const n of list) {
      if (n.type === 'text') runs.push({ ...st, text: n.text });
      else if (n.type === 'code') runs.push({ ...st, mono: true, text: n.text, color: '#334155' });
      else if (n.type === 'strong') walk(n.children, { ...st, bold: true });
      else if (n.type === 'em') walk(n.children, { ...st, italic: true });
      else if (n.type === 'del') walk(n.children, { ...st, color: '#888888' });
      else if (n.type === 'link') { const before = runs.length; walk(n.children, { ...st, color: '#2e6bff', underline: true }); if (runs.length === before) runs.push({ ...st, text: n.href, color: '#2e6bff', underline: true }); }
      else if (n.type === 'image') runs.push({ ...st, text: n.alt ? `[${n.alt}]` : '' });
      else if (n.type === 'br') runs.push({ ...st, text: '\n' });
    } };
    walk(inlines, base);
    return runs;
  };
  const render = async (list, indent = 0) => {
    for (const blk of list) {
      switch (blk.type) {
        case 'heading': { const sizes = [24, 19, 15.5, 13.5, 12, 11]; const sz = sizes[blk.level - 1]; b.spacer(blk.level <= 2 ? 10 : 6); b.rich(runsOf(blk.inlines, { bold: true }), { size: sz, indent, spaceAfter: blk.level <= 2 ? 6 : 4, lineHeight: 1.25 }); if (blk.level === 1) b.hr({ color: '#d9dce3' }); break; }
        case 'paragraph': {
          const onlyImage = blk.inlines.length === 1 && blk.inlines[0].type === 'image';
          if (onlyImage && resolveImage) { try { const img = await resolveImage(blk.inlines[0].href); if (img) { await b.image(img, { align: 'left', spaceAfter: 8 }); break; } } catch { } }
          b.rich(runsOf(blk.inlines), { size: baseSize, indent, spaceAfter: 7 }); break;
        }
        case 'code': { const lines = blk.text.split('\n'); for (const ln of lines.length ? lines : ['']) b.rich([{ text: ln || ' ', mono: true, color: '#1e293b' }], { size: baseSize - 1.5, indent: indent + 8, lineHeight: 1.3 }); b.spacer(7); break; }
        case 'hr': b.hr({ color: '#c9d1e0' }); b.spacer(4); break;
        case 'blockquote': { await render(blk.children.map((c) => (c.type === 'paragraph' ? { ...c, inlines: c.inlines } : c)), indent + 14); break; }
        case 'html': { const txt = blk.text.replace(/<[^>]+>/g, '').trim(); if (txt) b.text(txt, { size: baseSize, indent, spaceAfter: 7 }); break; }
        case 'list': {
          let n = blk.start;
          for (const it of blk.items) {
            const marker = it.checked !== null ? (it.checked ? '[x]' : '[ ]') : blk.ordered ? `${n}.` : '•';
            const [first, ...rest] = it.children;
            if (first && first.type === 'paragraph') b.rich(runsOf(first.inlines), { size: baseSize, indent: indent + 18, spaceAfter: 3, bullet: { text: marker, offset: blk.ordered || it.checked !== null ? 18 : 12 } });
            else { b.rich([{ text: marker }], { size: baseSize, indent: indent + 18, spaceAfter: 1, bullet: { text: marker, offset: 12 } }); if (first) await render([first], indent + 18); }
            if (rest.length) await render(rest, indent + 18);
            n++;
          }
          b.spacer(4); break;
        }
        case 'table': { const rows = [blk.header.map(inlinesToText), ...blk.rows.map((r) => r.map(inlinesToText))]; b.table(rows, { fontSize: baseSize - 1.5, aligns: blk.aligns }); break; }
      }
    }
  };
  await render(blocks);
}
