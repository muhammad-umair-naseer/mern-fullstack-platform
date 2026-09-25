// DOCX / XLSX readers built on our own ZIP + XML parsers, plus PDF rendering through PdfBuilder.
import { readZip } from '../zip.js';
import { utf8 } from '../bytes.js';
import { parseXml, firstElement, child, children, attr, textOf, localName, findAll } from '../xml.js';

const readXml = (zip, name) => { const e = zip.entries.find((x) => x.name === name || x.name === name.replace(/^\//, '')); return e ? parseXml(utf8.decode(e.data())) : null; };

// ---------------- DOCX ----------------
/**
 * Parse a DOCX into blocks: {type:'paragraph', style, runs:[{text,bold,italic,underline,size,color,mono}], align, list:{ordered,level}, heading}
 *                          {type:'table', rows:[[cellBlocks]]}, {type:'pagebreak'}, {type:'image', data, contentType, width, height}
 */
export function parseDocx(bytes) {
  const zip = readZip(bytes);
  const docXml = readXml(zip, 'word/document.xml');
  if (!docXml) throw new Error('Not a Word document (word/document.xml missing)');
  const relsXml = readXml(zip, 'word/_rels/document.xml.rels');
  const rels = {};
  if (relsXml) for (const r of findAll(relsXml, (e) => localName(e.name) === 'Relationship')) rels[attr(r, 'Id')] = attr(r, 'Target');
  const stylesXml = readXml(zip, 'word/styles.xml');
  const styles = {};
  if (stylesXml) for (const s of findAll(stylesXml, (e) => localName(e.name) === 'style')) {
    const id = attr(s, 'styleId'); const nameEl = child(s, 'name'); const based = child(s, 'basedOn');
    const rPr = child(s, 'rPr'), pPr = child(s, 'pPr');
    styles[id] = { name: nameEl ? attr(nameEl, 'val') : id, basedOn: based ? attr(based, 'val') : null, rPr, pPr };
  }
  const numXml = readXml(zip, 'word/numbering.xml');
  const numFmt = {}; // numId -> level -> {ordered}
  if (numXml) {
    const abstracts = {};
    for (const a of findAll(numXml, (e) => localName(e.name) === 'abstractNum')) { const id = attr(a, 'abstractNumId'); abstracts[id] = {}; for (const lvl of children(a, 'lvl')) { const f = child(lvl, 'numFmt'); abstracts[id][attr(lvl, 'ilvl')] = { ordered: f ? attr(f, 'val') !== 'bullet' : true, fmt: f ? attr(f, 'val') : 'decimal' }; } }
    for (const num of findAll(numXml, (e) => localName(e.name) === 'num')) { const aid = child(num, 'abstractNumId'); numFmt[attr(num, 'numId')] = abstracts[aid ? attr(aid, 'val') : ''] || {}; }
  }
  const resolveStyleChain = (id) => { const chain = []; let cur = id, guard = 0; while (cur && styles[cur] && guard++ < 10) { chain.unshift(styles[cur]); cur = styles[cur].basedOn; } return chain; };
  const runProps = (rPr, base = {}) => {
    const p = { ...base };
    if (!rPr) return p;
    const on = (name) => { const el = child(rPr, name); if (!el) return undefined; const v = attr(el, 'val'); return v === undefined || v === 'true' || v === '1' || v === 'on'; };
    const bb = on('b'); if (bb !== undefined) p.bold = bb;
    const ii = on('i'); if (ii !== undefined) p.italic = ii;
    const u = child(rPr, 'u'); if (u) p.underline = attr(u, 'val') !== 'none';
    const st = on('strike'); if (st) p.strike = true;
    const sz = child(rPr, 'sz'); if (sz) p.size = parseInt(attr(sz, 'val'), 10) / 2;
    const color = child(rPr, 'color'); if (color && /^[0-9a-fA-F]{6}$/.test(attr(color, 'val') || '')) p.color = '#' + attr(color, 'val');
    const fonts = child(rPr, 'rFonts'); if (fonts) { const f = attr(fonts, 'ascii') || attr(fonts, 'hAnsi') || ''; if (/courier|consolas|mono|menlo/i.test(f)) p.mono = true; }
    const va = child(rPr, 'vertAlign'); if (va) p.vertAlign = attr(va, 'val');
    return p;
  };
  const paraProps = (pPr) => {
    const out = {};
    if (!pPr) return out;
    const ps = child(pPr, 'pStyle'); if (ps) out.style = attr(ps, 'val');
    const jc = child(pPr, 'jc'); if (jc) out.align = { both: 'justify', center: 'center', right: 'right', end: 'right', start: 'left', left: 'left' }[attr(jc, 'val')] || 'left';
    const numPr = child(pPr, 'numPr'); if (numPr) { const numId = child(numPr, 'numId'), ilvl = child(numPr, 'ilvl'); const nid = numId ? attr(numId, 'val') : null; const lvl = ilvl ? attr(ilvl, 'val') : '0'; const f = (numFmt[nid] || {})[lvl]; out.list = { numId: nid, level: parseInt(lvl, 10), ordered: f ? f.ordered : true }; }
    const ind = child(pPr, 'ind'); if (ind) out.indent = parseInt(attr(ind, 'left') || attr(ind, 'start') || '0', 10) / 20;
    const sp = child(pPr, 'spacing'); if (sp) { out.spaceAfter = parseInt(attr(sp, 'after') || '0', 10) / 20; out.spaceBefore = parseInt(attr(sp, 'before') || '0', 10) / 20; }
    if (child(pPr, 'pageBreakBefore')) out.pageBreakBefore = true;
    return out;
  };
  const images = {};
  const getImage = (rId) => {
    const target = rels[rId]; if (!target) return null;
    const path = target.startsWith('/') ? target.slice(1) : 'word/' + target.replace(/^\.\//, '');
    if (images[path]) return images[path];
    const e = zip.entries.find((x) => x.name === path); if (!e) return null;
    const ext = path.split('.').pop().toLowerCase();
    images[path] = { data: e.data(), contentType: ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : ext === 'emf' || ext === 'wmf' ? 'image/x-' + ext : 'image/' + ext, name: path };
    return images[path];
  };
  const parseParagraph = (p) => {
    const pPr = child(p, 'pPr');
    const props = paraProps(pPr);
    const chain = props.style ? resolveStyleChain(props.style) : [];
    let baseRun = {};
    for (const s of chain) baseRun = runProps(s.rPr, baseRun);
    if (!props.list) for (const s of chain) { const sp = s.pPr ? paraProps(s.pPr) : {}; if (sp.list) props.list = sp.list; if (sp.indent && !props.indent) props.indent = sp.indent; }
    if (!props.list && chain.length && /^List (Bullet|Number)/i.test(chain[chain.length - 1].name || '')) props.list = { numId: chain[chain.length - 1].name, level: 0, ordered: /Number/i.test(chain[chain.length - 1].name) };
    const styleName = chain.length ? chain[chain.length - 1].name : '';
    const runs = []; let images = [];
    let pageBreak = false;
    const walkRuns = (node, inherited) => {
      for (const c of node.children || []) {
        if (c.type !== 'element') continue;
        const ln = localName(c.name);
        if (ln === 'r') {
          const rp = runProps(child(c, 'rPr'), inherited);
          for (const x of c.children) {
            if (x.type !== 'element') continue;
            const xn = localName(x.name);
            if (xn === 't') runs.push({ ...rp, text: textOf(x) });
            else if (xn === 'tab') runs.push({ ...rp, text: '\t' });
            else if (xn === 'br') { if (attr(x, 'type') === 'page') pageBreak = true; else runs.push({ ...rp, text: '\n' }); }
            else if (xn === 'sym') runs.push({ ...rp, text: '•' });
            else if (xn === 'drawing' || xn === 'pict') { for (const blip of findAll(x, (e) => localName(e.name) === 'blip')) { const img = getImage(attr(blip, 'embed')); const ext = findAll(x, (e) => localName(e.name) === 'extent')[0]; if (img) images.push({ ...img, cx: ext ? parseInt(attr(ext, 'cx'), 10) / 12700 : 0, cy: ext ? parseInt(attr(ext, 'cy'), 10) / 12700 : 0 }); } for (const id of findAll(x, (e) => localName(e.name) === 'imagedata')) { const img = getImage(attr(id, 'id')); if (img) images.push({ ...img, cx: 0, cy: 0 }); } }
            else if (xn === 'lastRenderedPageBreak') { /* ignore */ }
          }
        } else if (ln === 'hyperlink' || ln === 'smartTag' || ln === 'sdt' || ln === 'sdtContent' || ln === 'ins' || ln === 'fldSimple') walkRuns(c, ln === 'hyperlink' ? { ...inherited, color: '#2e6bff', underline: true } : inherited);
        else if (ln === 'del') continue;
      }
    };
    walkRuns(p, baseRun);
    let heading = 0;
    const m = /^heading\s*(\d)/i.exec(styleName) || /^Heading(\d)/.exec(props.style || '');
    if (m) heading = parseInt(m[1], 10);
    else if (/^Title$/i.test(styleName)) heading = 1;
    if (props.style && /^(Title|Subtitle)$/i.test(styleName)) { baseRun.bold = true; }
    let align = props.align; const jcs = chain.map((s) => s.pPr && child(s.pPr, 'jc')).filter(Boolean); if (!align && jcs.length) align = { both: 'justify', center: 'center', right: 'right' }[attr(jcs[jcs.length - 1], 'val')] || 'left';
    return { type: 'paragraph', runs, images, heading, styleName, align: align || 'left', list: props.list, indent: props.indent || 0, spaceAfter: props.spaceAfter, pageBreakBefore: props.pageBreakBefore, pageBreakAfter: pageBreak };
  };
  const parseBody = (node) => {
    const blocks = [];
    for (const c of node.children) {
      if (c.type !== 'element') continue;
      const ln = localName(c.name);
      if (ln === 'p') { const para = parseParagraph(c); if (para.pageBreakBefore) blocks.push({ type: 'pagebreak' }); blocks.push(para); if (para.pageBreakAfter) blocks.push({ type: 'pagebreak' }); }
      else if (ln === 'tbl') { const rows = []; for (const tr of children(c, 'tr')) { const cells = []; for (const tc of children(tr, 'tc')) cells.push(parseBody(tc)); rows.push(cells); } blocks.push({ type: 'table', rows }); }
      else if (ln === 'sdt' || ln === 'sdtContent') blocks.push(...parseBody(ln === 'sdt' ? child(c, 'sdtContent') || c : c));
      else if (ln === 'sectPr') { /* ignore */ }
    }
    return blocks;
  };
  const body = child(firstElement(docXml), 'body');
  const blocks = parseBody(body);
  // core properties
  const core = readXml(zip, 'docProps/core.xml');
  const meta = {};
  if (core) { const r = firstElement(core); for (const el of r.children) if (el.type === 'element') meta[localName(el.name)] = textOf(el); }
  return { blocks, meta };
}
const blocksText = (blocks) => blocks.map((b) => (b.type === 'paragraph' ? b.runs.map((r) => r.text).join('') : b.type === 'table' ? b.rows.map((r) => r.map((c) => blocksText(c)).join('\t')).join('\n') : '')).join('\n');
export function docxToText(bytes) { return blocksText(parseDocx(bytes).blocks); }

/** Render DOCX blocks to a PdfBuilder. decodeImage: async ({data, contentType}) => {rgba,width,height}|{jpeg} */
export async function renderDocxToPdf(builder, blocks, { decodeImage = null } = {}) {
  const b = builder;
  const counters = {};
  const render = async (list, indent = 0) => {
    for (const blk of list) {
      if (blk.type === 'pagebreak') { b.newPage(); continue; }
      if (blk.type === 'table') {
        const rows = blk.rows.map((r) => r.map((cell) => blocksText(cell)));
        if (rows.length) b.table(rows, { fontSize: 9, header: false });
        continue;
      }
      for (const img of blk.images) {
        if (!decodeImage) continue;
        try { const dec = await decodeImage(img); if (dec) { const w = img.cx ? Math.min(img.cx, b.contentWidth - indent) : null; await b.image(dec, { width: w, align: blk.align === 'center' ? 'center' : 'left' }); } } catch { }
      }
      const runs = blk.runs.filter((r) => r.text !== '');
      if (!runs.length && !blk.images.length) { b.spacer(6); continue; }
      let size = blk.heading ? [22, 17, 14, 12.5, 11.5, 11][blk.heading - 1] : 11;
      const rr = runs.map((r) => ({ text: r.text, bold: blk.heading ? true : !!r.bold, italic: !!r.italic, underline: !!r.underline, mono: !!r.mono, size: blk.heading ? (r.size && r.size > size ? r.size : size) : r.size || size, color: r.color || (blk.heading ? '#0f1b3d' : '#111111') }));
      let bullet = null, extraIndent = 0;
      if (blk.list) {
        const key = (blk.list.numId || 'x') + ':' + blk.list.level;
        if (blk.list.ordered) { counters[key] = (counters[key] || 0) + 1; for (const k of Object.keys(counters)) if (k.startsWith((blk.list.numId || 'x') + ':') && parseInt(k.split(':')[1], 10) > blk.list.level) delete counters[k]; bullet = { text: counters[key] + '.', offset: 18 }; }
        else bullet = { text: blk.list.level % 2 ? '◦' : '•', offset: 12 };
        extraIndent = 18 + blk.list.level * 18;
      }
      if (blk.heading) b.spacer(blk.heading === 1 ? 10 : 6);
      b.rich(rr, { size, indent: indent + extraIndent + (blk.list ? 0 : Math.min(blk.indent || 0, 200)), align: blk.align === 'justify' ? 'left' : blk.align, spaceAfter: blk.spaceAfter != null ? Math.min(blk.spaceAfter, 24) : blk.heading ? 6 : 6, bullet, lineHeight: 1.35 });
    }
  };
  await render(blocks);
}

// ---------------- XLSX ----------------
function colToIndex(ref) { let n = 0; for (const ch of ref.replace(/\d+/g, '')) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; }
export function indexToCol(i) { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
const excelDate = (n, date1904 = false) => { const ms = Math.round((n - (date1904 ? 24107 : 25569)) * 86400 * 1000); return new Date(ms); };
const fmtDate = (d, fmt) => { const p = (x) => String(x).padStart(2, '0'); const hasTime = /h|s/i.test(fmt) && !/y|d/i.test(fmt); const date = `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`; const time = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`; return hasTime ? time : /h/i.test(fmt) ? date + ' ' + time : date; };

/** Parse XLSX -> { sheets:[{name, rows:[[cell]]}], meta } (values only; cached formula results are used). */
export function parseXlsx(bytes) {
  const zip = readZip(bytes);
  const wb = readXml(zip, 'xl/workbook.xml');
  if (!wb) throw new Error('Not an Excel workbook (xl/workbook.xml missing)');
  const relsXml = readXml(zip, 'xl/_rels/workbook.xml.rels');
  const rels = {}; if (relsXml) for (const r of findAll(relsXml, (e) => localName(e.name) === 'Relationship')) rels[attr(r, 'Id')] = attr(r, 'Target');
  const date1904 = !!findAll(wb, (e) => localName(e.name) === 'workbookPr').some((e) => /^(1|true)$/.test(attr(e, 'date1904') || ''));
  // shared strings
  const sst = []; const ssXml = readXml(zip, 'xl/sharedStrings.xml');
  if (ssXml) for (const si of children(firstElement(ssXml), 'si')) sst.push(findAll(si, (e) => localName(e.name) === 't').map(textOf).join(''));
  // styles: numFmtId per cellXfs index -> date detection
  const stylesXml = readXml(zip, 'xl/styles.xml'); const numFmts = { 14: 'yyyy-mm-dd', 15: 'd-mmm-yy', 16: 'd-mmm', 17: 'mmm-yy', 18: 'h:mm', 19: 'h:mm:ss', 20: 'h:mm', 21: 'h:mm:ss', 22: 'm/d/yy h:mm', 45: 'mm:ss', 46: '[h]:mm:ss', 47: 'mm:ss.0' };
  const xfFmt = [];
  if (stylesXml) { for (const nf of findAll(stylesXml, (e) => localName(e.name) === 'numFmt')) numFmts[attr(nf, 'numFmtId')] = attr(nf, 'formatCode'); const cellXfs = findAll(stylesXml, (e) => localName(e.name) === 'cellXfs')[0]; if (cellXfs) for (const xf of children(cellXfs, 'xf')) xfFmt.push(attr(xf, 'numFmtId')); }
  const isDateFmt = (s) => { const f = numFmts[xfFmt[s]]; return f ? /[ymdh]/i.test(f.replace(/\[[^\]]*\]|"[^"]*"/g, '')) && !/#|0\.0|General/i.test(f) : false; };
  const sheets = [];
  for (const s of findAll(wb, (e) => localName(e.name) === 'sheet')) {
    const rid = attr(s, 'id'); let target = rels[rid] || `worksheets/sheet${sheets.length + 1}.xml`;
    target = target.startsWith('/') ? target.slice(1) : 'xl/' + target.replace(/^\/?xl\//, '');
    const ws = readXml(zip, target); if (!ws) continue;
    const rows = []; let maxCol = 0;
    const sheetData = findAll(ws, (e) => localName(e.name) === 'sheetData')[0];
    if (sheetData) for (const row of children(sheetData, 'row')) {
      const r = parseInt(attr(row, 'r') || String(rows.length + 1), 10) - 1;
      while (rows.length <= r) rows.push([]);
      let ci = 0;
      for (const c of children(row, 'c')) {
        const ref = attr(c, 'r'); if (ref) ci = colToIndex(ref);
        const t = attr(c, 't'); const sIdx = attr(c, 's');
        const v = child(c, 'v'); const is = child(c, 'is');
        let val = '';
        if (t === 's') val = sst[parseInt(textOf(v), 10)] ?? '';
        else if (t === 'inlineStr') val = is ? findAll(is, (e) => localName(e.name) === 't').map(textOf).join('') : '';
        else if (t === 'b') val = textOf(v) === '1';
        else if (t === 'str' || t === 'e') val = textOf(v);
        else if (v && textOf(v) !== '') { const num = Number(textOf(v)); val = Number.isFinite(num) ? (sIdx !== undefined && isDateFmt(sIdx) ? fmtDate(excelDate(num, date1904), numFmts[xfFmt[sIdx]] || '') : num) : textOf(v); }
        rows[r][ci] = val; if (ci + 1 > maxCol) maxCol = ci + 1;
        ci++;
      }
    }
    // normalize
    const norm = rows.map((r) => { const o = new Array(maxCol).fill(''); r.forEach((v, i) => { o[i] = v === undefined ? '' : v; }); return o; });
    while (norm.length && norm[norm.length - 1].every((v) => v === '')) norm.pop();
    // column widths
    const cols = findAll(ws, (e) => localName(e.name) === 'col').map((c) => ({ min: +attr(c, 'min'), max: +attr(c, 'max'), width: +attr(c, 'width') }));
    sheets.push({ name: attr(s, 'name'), rows: norm, cols });
  }
  const core = readXml(zip, 'docProps/core.xml'); const meta = {};
  if (core) for (const el of firstElement(core).children) if (el.type === 'element') meta[localName(el.name)] = textOf(el);
  return { sheets, meta };
}

/** Render sheets into a PdfBuilder as tables (landscape recommended). */
export function renderXlsxToPdf(builder, sheets, { fontSize = 8, headerRow = true, maxCols = 40, gridlines = true } = {}) {
  const b = builder;
  let first = true;
  for (const sh of sheets) {
    if (!first) b.newPage(); first = false;
    b.text(sh.name, { fontName: 'Helvetica-Bold', size: 14, spaceAfter: 6 });
    if (!sh.rows.length) { b.text('(empty sheet)', { size: 10, color: '#666666' }); continue; }
    const cols = Math.min(maxCols, Math.max(...sh.rows.map((r) => r.length)));
    // measure widths from content (chars)
    const chars = new Array(cols).fill(2);
    for (const r of sh.rows.slice(0, 500)) for (let i = 0; i < cols; i++) { const len = Math.min(40, String(r[i] ?? '').length); if (len > chars[i]) chars[i] = len; }
    const total = chars.reduce((a, c) => a + c, 0);
    const widths = chars.map((c) => Math.max(28, (c / total) * b.contentWidth));
    const scale = b.contentWidth / widths.reduce((a, w) => a + w, 0);
    const rows = sh.rows.map((r) => Array.from({ length: cols }, (_, i) => { const v = r[i]; return typeof v === 'number' ? (Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000)) : v === true ? 'TRUE' : v === false ? 'FALSE' : String(v ?? ''); }));
    const aligns = Array.from({ length: cols }, (_, i) => (sh.rows.slice(1).some((r) => typeof r[i] === 'number') && !sh.rows.slice(1).some((r) => typeof r[i] === 'string' && r[i] !== '') ? 'right' : 'left'));
    b.table(rows, { colWidths: widths.map((w) => w * scale), fontSize, header: headerRow, aligns, borderColor: gridlines ? '#bbbbbb' : '#ffffff', headerFill: '#e8ecf5', cellPadding: 3 });
  }
}
export function sheetToCsvRows(sheet) { return sheet.rows.map((r) => r.map((v) => (v === true ? 'TRUE' : v === false ? 'FALSE' : v))); }
