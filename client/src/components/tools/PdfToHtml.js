import React, { useState, useRef } from 'react';
import { FileCode, Upload, Download, Eye, AlertCircle, Check, Sparkles } from 'lucide-react';
import { pdfjsLib, triggerDownload } from '../../lib/pdfCommon';
import { validatePdfFile, formatFileSize } from '../../lib/fileValidation';

function normalizeTextItems(items, pageHeight) {
  return items.map((it) => {
    const tx = it.transform;
    const x = tx[4];
    const y = pageHeight - tx[5];
    const fontSize = Math.hypot(tx[0], tx[1]);
    return { str: it.str, x, y, width: it.width, height: it.height || fontSize, fontSize };
  });
}

function groupLines(items) {
  const sorted = items.slice().sort((a, b) => (Math.abs(a.y - b.y) > 3 ? a.y - b.y : a.x - b.x));
  const lines = [];
  let cur = null;
  sorted.forEach((it) => {
    if (!cur || Math.abs(it.y - cur.y) > 4) {
      cur = { y: it.y, items: [it], fontSize: it.fontSize };
      lines.push(cur);
    } else {
      cur.items.push(it);
      cur.fontSize = Math.max(cur.fontSize, it.fontSize);
    }
  });
  lines.forEach((l) => {
    l.text = l.items.map((i) => i.str).join(' ').trim();
  });
  return lines.filter((l) => l.text.length > 0);
}

function toHtmlFlow(pages, title) {
  const body = pages
    .map((p, idx) => {
      const pageLines = p.lines
        .map((l) => {
          if (l.fontSize >= 18) return `<h1>${l.text}</h1>`;
          if (l.fontSize >= 14) return `<h2>${l.text}</h2>`;
          return `<p>${l.text}</p>`;
        })
        .join('\n');
      return `<section class="pdf-page" data-page="${idx + 1}">\n${pageLines}\n</section>`;
    })
    .join('\n<hr/>\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; background: #f8fafc; }
.pdf-page { background: #fff; padding: 40px; margin-bottom: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
h1 { color: #0f172a; font-size: 1.75rem; margin-top: 1.5em; }
h2 { color: #334155; font-size: 1.25rem; margin-top: 1.2em; }
p { margin: 0.8em 0; }
hr { border: 0; border-top: 1px dashed #cbd5e1; margin: 30px 0; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

export default function PdfToHtml() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [mode, setMode] = useState('flow'); // 'flow' | 'positioned'
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'converting' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [resultHtml, setResultHtml] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const fileInputRef = useRef(null);

  const handleSelectFile = async (f) => {
    if (!f) return;
    setFile(null);
    setPdfDoc(null);
    setResultHtml('');
    setStatus('loading');
    setStatusMsg(`Verifying PDF header and loading document...`);

    const val = await validatePdfFile(f);
    if (!val.valid) {
      setStatus('error');
      setStatusMsg(val.error);
      return;
    }

    try {
      const buffer = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      setPdfDoc(doc);
      setFile(f);
      setNumPages(doc.numPages);
      setFromPage(1);
      setToPage(doc.numPages);
      setStatus('ready');
      setStatusMsg(`Loaded ${doc.numPages} page(s) from ${f.name}.`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Could not read PDF: ${err.message}`);
    }
  };

  const handleConvert = async () => {
    if (!pdfDoc || !file) return;
    setStatus('converting');
    setProgress(0);
    setStatusMsg('Extracting text and structure...');

    try {
      const start = Math.max(1, fromPage);
      const end = Math.min(numPages, toPage);
      const totalToProcess = end - start + 1;
      const pages = [];

      for (let p = start; p <= end; p++) {
        const page = await pdfDoc.getPage(p);
        const vp = page.getViewport({ scale: 1.0 });
        const textContent = await page.getTextContent();
        const items = normalizeTextItems(textContent.items, vp.height);
        const lines = groupLines(items);

        pages.push({
          width: vp.width,
          height: vp.height,
          lines,
        });

        setProgress(Math.round(((p - start + 1) / totalToProcess) * 100));
        await new Promise((r) => setTimeout(r, 0));
      }

      const title = file.name.replace(/\.pdf$/i, '');
      const html = toHtmlFlow(pages, title);
      setResultHtml(html);

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      triggerDownload(blob, `${title}.html`);

      setStatus('ready');
      setStatusMsg(`✓ Converted ${pages.length} pages to HTML (${formatFileSize(blob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Conversion failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-10 text-center cursor-pointer transition"
        >
          <FileCode className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop PDF Document Here</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Extract headings, paragraphs, and formatted text into a responsive, clean HTML web page.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Select PDF File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
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
                  {formatFileSize(file.size)} · {numPages} Total Page(s)
                </p>
              </div>
              <button onClick={() => setFile(null)} className="text-xs text-slate-400 hover:text-white">
                Change PDF
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Page Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={numPages}
                    value={fromPage}
                    onChange={(e) => setFromPage(Number(e.target.value))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-center text-slate-200"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="number"
                    min="1"
                    max={numPages}
                    value={toPage}
                    onChange={(e) => setToPage(Number(e.target.value))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-center text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">HTML Output Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="flow">Flowing Semantic HTML (Mobile & Web Friendly)</option>
                </select>
              </div>
            </div>

            {status === 'converting' && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>{statusMsg}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleConvert}
                disabled={status === 'converting'}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {status === 'converting' ? 'Extracting & Converting...' : 'Convert PDF to HTML'}
              </button>
            </div>
          </div>

          {resultHtml && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Generated HTML Preview
                </span>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>

              {showPreview && (
                <iframe
                  title="HTML Preview"
                  srcDoc={resultHtml}
                  className="w-full h-80 rounded-2xl bg-white border border-slate-700"
                />
              )}
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
