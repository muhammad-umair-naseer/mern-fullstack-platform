import React, { useState, useRef } from 'react';
import { BookOpen, Upload, Download, RefreshCw, AlertCircle, Check, FileText } from 'lucide-react';
import { loadZipLib } from '../../lib/dynamicVendor';
import { formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

const enc = (s) => new TextEncoder().encode(s);
const dec = (b) => (typeof b === 'string' ? b : new TextDecoder().decode(b));
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}
function mdToHtml(md) {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let para = [];
  let list = null;
  function flushP() {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  }
  function flushL() {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  }
  lines.forEach((ln) => {
    const h = /^(#{1,6})\s+(.*)$/.exec(ln);
    const ul = /^\s*[-*+]\s+(.*)$/.exec(ln);
    const ol = /^\s*\d+[.)]\s+(.*)$/.exec(ln);
    if (h) {
      flushP();
      flushL();
      out.push(`<h${h[1].length}>${inline(h[2].trim())}</h${h[1].length}>`);
    } else if (/^\s*(-{3,}|\*{3,})\s*$/.test(ln)) {
      flushP();
      flushL();
      out.push('<hr/>');
    } else if (ul || ol) {
      flushP();
      const kind = ul ? 'ul' : 'ol';
      if (list !== kind) {
        flushL();
        list = kind;
        out.push(`<${kind}>`);
      }
      out.push(`<li>${inline((ul || ol)[1])}</li>`);
    } else if (!ln.trim()) {
      flushP();
      flushL();
    } else {
      flushL();
      para.push(ln.trim());
    }
  });
  flushP();
  flushL();
  return out.join('\n');
}

function textToHtml(txt) {
  return txt
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((blk) => {
      const t = blk.trim();
      if (!t) return '';
      const single = t.indexOf('\n') < 0;
      if (single && t.length <= 80 && !/[.!?,;:]$/.test(t)) return `<h2>${esc(t)}</h2>`;
      return `<p>${esc(t).replace(/\n/g, '<br/>')}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

function htmlToText(html) {
  return dec(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr|section|article|blockquote)>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function bodyOf(html) {
  const m = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  return m ? m[1] : html;
}

function splitChapters(html, fallbackTitle) {
  const body = bodyOf(html);
  const re = /<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi;
  let m;
  const idx = [];
  const out = [];
  while ((m = re.exec(body))) {
    idx.push({ start: m.index, end: m.index + m[0].length, title: htmlToText(m[1]) });
  }
  if (!idx.length) return [{ title: fallbackTitle || 'Chapter 1', html: body }];
  if (idx[0].start > 0 && body.slice(0, idx[0].start).replace(/<[^>]+>/g, '').trim()) {
    out.push({ title: fallbackTitle || 'Introduction', html: body.slice(0, idx[0].start) });
  }
  idx.forEach((h, i) => {
    const end = i + 1 < idx.length ? idx[i + 1].start : body.length;
    out.push({ title: h.title || `Chapter ${i + 1}`, html: body.slice(h.start, end) });
  });
  return out;
}

function xhtml(title, body, lang) {
  return `<?xml version="1.0" encoding="utf-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${esc(
    lang
  )}">\n<head><title>${esc(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>\n<body>\n${body}\n</body>\n</html>`;
}

function tidy(html) {
  return html.replace(/<(br|hr|img)([^>]*?)(?<!\/)>/gi, '<$1$2/>').replace(/&(?![a-zA-Z#]+;)/g, '&amp;');
}

function buildEpubEntries(o) {
  const title = o.title || 'Untitled Book';
  const author = o.author || 'Author';
  const lang = o.lang || 'en';
  const uid = `urn:uuid:${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  const chapters = o.chapters && o.chapters.length ? o.chapters : [{ title, html: '<p></p>' }];

  const entries = [
    { name: 'mimetype', data: enc('application/epub+zip'), store: true },
    {
      name: 'META-INF/container.xml',
      data: enc(
        '<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'
      ),
    },
  ];

  const manifest = [
    '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
    '<item id="css" href="style.css" media-type="text/css"/>',
  ];
  const spine = [];
  const navLi = [];
  const ncxPts = [];

  chapters.forEach((c, i) => {
    const id = `ch${i + 1}`;
    const file = `${id}.xhtml`;
    const ct = c.title || `Chapter ${i + 1}`;
    entries.push({ name: `OEBPS/${file}`, data: enc(xhtml(ct, tidy(c.html || ''), lang)) });
    manifest.push(`<item id="${id}" href="${file}" media-type="application/xhtml+xml"/>`);
    spine.push(`<itemref idref="${id}"/>`);
    navLi.push(`<li><a href="${file}">${esc(ct)}</a></li>`);
    ncxPts.push(
      `<navPoint id="np${i + 1}" playOrder="${i + 1}"><navLabel><text>${esc(
        ct
      )}</text></navLabel><content src="${file}"/></navPoint>`
    );
  });

  const date = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  entries.push({
    name: 'OEBPS/content.opf',
    data: enc(
      `<?xml version="1.0" encoding="utf-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">${esc(
        uid
      )}</dc:identifier><dc:title>${esc(title)}</dc:title><dc:creator>${esc(author)}</dc:creator><dc:language>${esc(
        lang
      )}</dc:language><meta property="dcterms:modified">${date}</meta></metadata><manifest>${manifest.join(
        ''
      )}</manifest><spine toc="ncx">${spine.join('')}</spine></package>`
    ),
  });

  entries.push({
    name: 'OEBPS/nav.xhtml',
    data: enc(xhtml('Contents', `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${navLi.join('')}</ol></nav>`, lang)),
  });

  entries.push({
    name: 'OEBPS/toc.ncx',
    data: enc(
      `<?xml version="1.0" encoding="UTF-8"?>\n<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="${esc(
        uid
      )}"/></head><docTitle><text>${esc(title)}</text></docTitle><navMap>${ncxPts.join('')}</navMap></ncx>`
    ),
  });

  entries.push({
    name: 'OEBPS/style.css',
    data: enc(
      'body{font-family:Georgia,serif;line-height:1.6;margin:1.2em;color:#111}h1,h2{font-family:sans-serif;color:#000}p{margin:0 0 1em;text-indent:1.2em}'
    ),
  });

  return entries;
}

export default function EbookConverter() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('to-epub'); // 'to-epub' | 'from-epub'
  const [title, setTitle] = useState('My eBook');
  const [author, setAuthor] = useState('Cortexis Author');
  const [outputFormat, setOutputFormat] = useState('epub'); // 'epub' | 'html' | 'txt'
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleSelectFile = (f) => {
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setStatusMsg('');
    const name = f.name.toLowerCase();
    if (name.endsWith('.epub')) {
      setMode('from-epub');
      setOutputFormat('html');
    } else {
      setMode('to-epub');
      setOutputFormat('epub');
      setTitle(f.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus('converting');
    setStatusMsg('Processing document...');

    try {
      const zip = await loadZipLib();
      zip.configure({ useWebWorkers: false });

      if (mode === 'to-epub') {
        // Build EPUB 3 from TXT / MD / HTML
        const textContent = await file.text();
        let rawHtml = '';
        if (file.name.endsWith('.md')) rawHtml = mdToHtml(textContent);
        else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) rawHtml = textContent;
        else rawHtml = textToHtml(textContent);

        const chapters = splitChapters(rawHtml, title);
        const entries = buildEpubEntries({ title, author, lang: 'en', chapters });

        const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/epub+zip'));
        for (const e of entries) {
          await zipWriter.add(e.name, new zip.Uint8ArrayReader(e.data), { level: e.store ? 0 : 6 });
        }
        const blob = await zipWriter.close();
        triggerDownload(blob, `${title.replace(/[^a-z0-9_-]/gi, '_')}.epub`);
        setStatus('ready');
        setStatusMsg(`✓ Successfully created EPUB 3 eBook (${formatFileSize(blob.size)})`);
      } else {
        // Extract EPUB to single HTML or TXT
        const reader = new zip.ZipReader(new zip.BlobReader(file));
        const entries = await reader.getEntries();
        const filesMap = {};

        for (const e of entries) {
          if (!e.directory) {
            const data = await e.getData(new zip.TextWriter());
            filesMap[e.filename] = data;
          }
        }

        const container = filesMap['META-INF/container.xml'];
        if (!container) throw new Error('Invalid EPUB (missing container.xml)');

        const opfPath = (/full-path=["']([^"']+)["']/.exec(container) || [])[1];
        const opf = filesMap[opfPath];
        if (!opf) throw new Error('EPUB package file missing');

        const dir = opfPath.indexOf('/') >= 0 ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';
        const bookTitle = (/ <dc:title[^>]*>([\s\S]*?)<\/dc:title>/i.exec(opf) || [, 'eBook'])[1].trim();

        // Collect html chapters
        const items = {};
        const re = /<item\b[^>]*>/gi;
        let m;
        while ((m = re.exec(opf))) {
          const id = (/\bid=["']([^"']+)/.exec(m[0]) || [])[1];
          const href = (/\bhref=["']([^"']+)/.exec(m[0]) || [])[1];
          const mt = (/media-type=["']([^"']+)/.exec(m[0]) || [])[1];
          if (id && href) items[id] = { href, type: mt };
        }

        const spineIds = [];
        const re2 = /<itemref\b[^>]*idref=["']([^"']+)["'][^>]*>/gi;
        while ((m = re2.exec(opf))) spineIds.push(m[1]);

        const chapterHtmls = [];
        spineIds.forEach((id) => {
          const it = items[id];
          if (it && /html|xml/i.test(it.type)) {
            const h = filesMap[dir + decodeURIComponent(it.href)];
            if (h) chapterHtmls.push(bodyOf(h));
          }
        });

        if (outputFormat === 'html') {
          const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(
            bookTitle
          )}</title><style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;padding:0 20px;line-height:1.6;color:#222}section{margin-top:3em}</style></head><body><h1>${esc(
            bookTitle
          )}</h1>${chapterHtmls.map((c) => `<section>${c}</section>`).join('\n')}</body></html>`;
          const blob = new Blob([fullHtml], { type: 'text/html' });
          triggerDownload(blob, `${file.name.replace(/\.epub$/i, '')}.html`);
        } else {
          const text = chapterHtmls.map((c) => htmlToText(c)).join('\n\n\n');
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          triggerDownload(blob, `${file.name.replace(/\.epub$/i, '')}.txt`);
        }

        setStatus('ready');
        setStatusMsg(`✓ Extracted EPUB content to .${outputFormat}`);
      }
    } catch (err) {
      setStatus('error');
      setStatusMsg(`eBook conversion failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-10 text-center cursor-pointer transition"
        >
          <BookOpen className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Upload EPUB, Markdown (.md), HTML, or TXT</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert documents into clean EPUB 3 eBooks, or extract existing EPUBs into readable HTML and text.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose Document
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".epub,.md,.txt,.html,.htm"
            onChange={(e) => e.target.files?.[0] && handleSelectFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)} · Mode: {mode === 'to-epub' ? 'Build EPUB' : 'Extract EPUB'}
                </p>
              </div>
              <button onClick={() => setFile(null)} className="text-xs text-slate-400 hover:text-white">
                Change File
              </button>
            </div>

            {mode === 'to-epub' ? (
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Book Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs">
                <label className="text-slate-400 block mb-1">Extract EPUB to:</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full sm:w-64 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="html">Single-File HTML (.html)</option>
                  <option value="txt">Plain Text Document (.txt)</option>
                </select>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleConvert}
                disabled={status === 'converting'}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {status === 'converting' ? 'Processing eBook...' : mode === 'to-epub' ? 'Build & Download EPUB' : `Extract to .${outputFormat}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
            status === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          {status === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
