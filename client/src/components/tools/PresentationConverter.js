import React, { useState, useRef } from 'react';
import { Presentation, Download, AlertCircle, Check} from 'lucide-react';
import { loadZipLib } from '../../lib/dynamicVendor';
import { formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

const dec = (b) => (typeof b === 'string' ? b : new TextDecoder().decode(b));
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function unesc(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, '&');
}
function norm(p) {
  return p.replace(/^\/+/, '').replace(/^ppt\/ppt\//, 'ppt/');
}
function getFile(files, p) {
  const k = Object.keys(files).find((n) => norm(n) === norm(p));
  return k != null ? dec(files[k]) : null;
}
function rels(xml) {
  const map = {};
  const re = /<Relationship\b[^>]*>/gi;
  let m;
  while ((m = re.exec(xml))) {
    const id = (/\bId=["']([^"']+)/.exec(m[0]) || [])[1];
    const t = (/\bTarget=["']([^"']+)/.exec(m[0]) || [])[1];
    const type = (/\bType=["']([^"']+)/.exec(m[0]) || [])[1];
    if (id && t) map[id] = { target: t, type: type || '' };
  }
  return map;
}
function resolve(base, target) {
  if (target.charAt(0) === '/') return target.slice(1);
  const parts = base.split('/');
  parts.pop();
  target.split('/').forEach((seg) => {
    if (seg === '..') parts.pop();
    else if (seg !== '.') parts.push(seg);
  });
  return parts.join('/');
}
function slideOrder(files) {
  const pres = getFile(files, 'ppt/presentation.xml');
  if (!pres) throw new Error('Not a valid PPTX (missing ppt/presentation.xml)');
  const r = rels(getFile(files, 'ppt/_rels/presentation.xml.rels') || '');
  let out = [];
  const re = /<p:sldId\b[^>]*r:id=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(pres))) {
    const rel = r[m[1]];
    if (rel) out.push(resolve('ppt/presentation.xml', rel.target));
  }
  if (!out.length) {
    out = Object.keys(files)
      .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(norm(n)))
      .sort((a, b) => +/(\d+)\.xml$/.exec(a)[1] - +/(\d+)\.xml$/.exec(b)[1]);
  }
  return out;
}
function extractSlide(xml) {
  let title = '';
  const paragraphs = [];
  const shapes = xml.match(/<p:sp\b[\s\S]*?<\/p:sp>/gi) || [];
  shapes.forEach((sp) => {
    const isTitle = /<p:ph\b[^>]*type=["'](title|ctrTitle)["']/i.test(sp);
    const paras = sp.match(/<a:p\b[\s\S]*?<\/a:p>/gi) || [];
    paras.forEach((p) => {
      const runs = [];
      const re = /<a:t>([\s\S]*?)<\/a:t>|<a:t\/>|<a:br\/>/gi;
      let m;
      while ((m = re.exec(p))) {
        runs.push(m[1] != null ? unesc(m[1]) : m[0] === '<a:br/>' ? '\n' : '');
      }
      const text = runs.join('').trim();
      if (!text) return;
      const lvl = +((/<a:pPr\b[^>]*lvl=["'](\d)["']/i.exec(p) || [])[1] || 0);
      if (isTitle && !title) title = text;
      else paragraphs.push({ text, level: lvl });
    });
  });
  return { title, paragraphs };
}
function notesFor(files, slidePath) {
  const relXml = getFile(files, slidePath.replace(/slides\/(slide\d+\.xml)$/, 'slides/_rels/$1.rels'));
  if (!relXml) return '';
  const r = rels(relXml);
  const key = Object.keys(r).find((k) => /notesSlide/.test(r[k].type));
  if (!key) return '';
  const xml = getFile(files, resolve(slidePath, r[key].target));
  if (!xml) return '';
  return extractSlide(xml)
    .paragraphs.map((p) => p.text)
    .filter((t) => !/^\d+$/.test(t))
    .join('\n');
}
function toMarkdown(slides, deck) {
  return (
    (deck ? `# ${deck}\n\n` : '') +
    slides
      .map((s) => {
        const lines = [`## Slide ${s.index}${s.title ? `: ${s.title}` : ''}`];
        s.paragraphs.forEach((p) => {
          lines.push(`${'  '.repeat(p.level)}- ${p.text.replace(/\n/g, ' ')}`);
        });
        if (s.notes) lines.push('', `> Notes: ${s.notes.replace(/\n/g, ' ')}`);
        return lines.join('\n');
      })
      .join('\n\n')
  );
}
function toHtml(slides, deck) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${esc(deck || 'Presentation')}</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 32px 20px; }
.slide { background: #1e293b; max-width: 860px; margin: 0 auto 24px; padding: 32px 40px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.n { font-size: 0.75rem; color: #f97316; font-weight: bold; text-transform: uppercase; }
h1 { text-align: center; color: #f8fafc; font-size: 2rem; margin-bottom: 2rem; }
h2 { margin: 0.3em 0 0.6em; color: #38bdf8; font-size: 1.4rem; }
ul { margin: 0.4em 0; padding-left: 1.4em; }
li { margin-bottom: 0.4em; line-height: 1.5; }
.notes { margin-top: 16px; padding: 12px 16px; background: #334155; border-left: 4px solid #f59e0b; border-radius: 6px; font-size: 0.85rem; color: #cbd5e1; }
</style>
</head>
<body>
${deck ? `<h1>${esc(deck)}</h1>` : ''}
${slides
  .map((s) => {
    let out = `<section class="slide"><div class="n">Slide ${s.index}</div>${
      s.title ? `<h2>${esc(s.title)}</h2>` : ''
    }`;
    let depth = 0;
    s.paragraphs.forEach((p) => {
      while (depth < p.level + 1) {
        out += '<ul>';
        depth++;
      }
      while (depth > p.level + 1) {
        out += '</ul>';
        depth--;
      }
      out += `<li>${esc(p.text).replace(/\n/g, '<br/>')}</li>`;
    });
    while (depth-- > 0) out += '</ul>';
    if (s.notes) out += `<div class="notes"><b>Speaker Notes:</b><br/>${esc(s.notes)}</div>`;
    return out + '</section>';
  })
  .join('\n')}
</body>
</html>`;
}

export default function PresentationConverter() {
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [outputFormat, setOutputFormat] = useState('html'); // 'html' | 'md' | 'txt'
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  const fileInputRef = useRef(null);

  const handleSelectFile = async (f) => {
    if (!f) return;
    setFile(null);
    setSlides([]);
    setPreviewHtml('');
    setStatus('loading');
    setStatusMsg(`Unpacking presentation ${f.name}...`);

    try {
      const zip = await loadZipLib();
      zip.configure({ useWebWorkers: false });
      const reader = new zip.ZipReader(new zip.BlobReader(f));
      const entries = await reader.getEntries();
      const filesMap = {};

      for (const e of entries) {
        if (!e.directory && (e.filename.endsWith('.xml') || e.filename.endsWith('.rels'))) {
          const text = await e.getData(new zip.TextWriter());
          filesMap[e.filename] = text;
        }
      }

      const paths = slideOrder(filesMap);
      const extracted = paths.map((p, i) => {
        const s = extractSlide(getFile(filesMap, p) || '');
        s.index = i + 1;
        s.notes = notesFor(filesMap, p);
        return s;
      });

      setFile(f);
      setSlides(extracted);
      setStatus('ready');
      setStatusMsg(`Extracted ${extracted.length} slides from ${f.name}.`);

      const html = toHtml(extracted, f.name.replace(/\.pptx$/i, ''));
      setPreviewHtml(html);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Could not read PPTX: ${err.message}`);
    }
  };

  const handleConvert = () => {
    if (!slides.length || !file) return;
    const baseName = file.name.replace(/\.pptx$/i, '');
    let blob;
    let outName;

    if (outputFormat === 'html') {
      const html = toHtml(slides, baseName);
      blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      outName = `${baseName}.html`;
    } else if (outputFormat === 'md') {
      const md = toMarkdown(slides, baseName);
      blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      outName = `${baseName}.md`;
    } else {
      const txt = slides
        .map((s) => `SLIDE ${s.index}${s.title ? `: ${s.title}` : ''}\n${s.paragraphs.map((p) => `• ${p.text}`).join('\n')}`)
        .join('\n\n');
      blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      outName = `${baseName}.txt`;
    }

    triggerDownload(blob, outName);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-10 text-center cursor-pointer transition"
        >
          <Presentation className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Upload PowerPoint Presentation (.pptx)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Extract slide titles, bullet hierarchies, and speaker notes to HTML, Markdown, or Plain Text.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose Presentation
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
                  {formatFileSize(file.size)} · {slides.length} Slide(s)
                </p>
              </div>
              <button onClick={() => setFile(null)} className="text-xs text-slate-400 hover:text-white">
                Change File
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Export Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="html">Structured Web HTML (.html)</option>
                  <option value="md">Markdown Outline (.md)</option>
                  <option value="txt">Plain Text Outline (.txt)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleConvert}
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Converted .{outputFormat}
                </button>
              </div>
            </div>
          </div>

          {previewHtml && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Slide Structure Preview ({slides.length} slides)
              </span>
              <iframe
                title="Presentation Preview"
                srcDoc={previewHtml}
                sandbox=""
                className="w-full h-80 rounded-2xl bg-slate-900 border border-slate-800"
              />
            </div>
          )}
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
