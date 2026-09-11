import React, { useState, useEffect, useRef } from 'react';
import { Upload, BookOpen, Download, RefreshCw, AlertCircle, CheckCircle2, FileText, Settings, Eye } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { validateFile } from '../../lib/fileValidation';

if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PdfToEbook() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [format, setFormat] = useState('epub'); // epub, mobi-html, fb2, txt, md
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Unknown Author');
  const [language, setLanguage] = useState('en');
  const [splitBy, setSplitBy] = useState('page'); // page, single

  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [previewPages, setPreviewPages] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setResult(null);
    setPdfDoc(null);
    setPreviewPages([]);
    setLoading(true);

    // Strict PDF magic bytes validation
    const validation = await validateFile(selected, 'pdf');
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    setFile(selected);
    setTitle(selected.name.replace(/\.[^/.]+$/, ''));

    try {
      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);

      // Extract quick preview from first 3 pages
      const samples = [];
      const numSamples = Math.min(3, doc.numPages);
      for (let i = 1; i <= numSamples; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        samples.push({ pageNum: i, text: text.slice(0, 300) + (text.length > 300 ? '…' : '') });
      }
      setPreviewPages(samples);
    } catch (err) {
      setError('Failed to load PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!pdfDoc || !file) return;
    setConverting(true);
    setProgress(0);
    setError(null);

    try {
      const numPages = pdfDoc.numPages;
      const pagesText = [];

      // Extract all pages text
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items by line vertically
        let lastY = null;
        let lineText = '';
        const lines = [];

        textContent.items.forEach(item => {
          const currentY = Math.round(item.transform[5]);
          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            lines.push(lineText.trim());
            lineText = '';
          }
          lineText += item.str + ' ';
          lastY = currentY;
        });
        if (lineText.trim()) lines.push(lineText.trim());

        const fullPageText = lines.filter(Boolean).join('\n');
        pagesText.push({ pageNum: i, text: fullPageText });
        setProgress(Math.round((i / numPages) * 60));
        // Yield to prevent UI freeze
        await new Promise(r => setTimeout(r, 0));
      }

      const bookTitle = title || 'Untitled Book';
      const bookAuthor = author || 'Anonymous';
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      let blob;
      let outName;

      if (format === 'epub') {
        setProgress(70);
        const zip = new JSZip();

        // 1. mimetype (must be first, uncompressed)
        zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

        // 2. META-INF/container.xml
        zip.folder('META-INF').file(
          'container.xml',
          `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
        );

        const oebps = zip.folder('OEBPS');

        // Stylesheet
        oebps.file(
          'style.css',
          `body { font-family: serif; line-height: 1.6; margin: 5%; color: #1a1a1a; }
h1, h2 { font-family: sans-serif; color: #333; margin-top: 1.5em; }
p { text-indent: 1.5em; margin: 0.4em 0; text-align: justify; }`
        );

        // Chapters
        const manifestItems = [];
        const spineItems = [];
        const tocNavItems = [];

        if (splitBy === 'page') {
          pagesText.forEach((p, idx) => {
            const chapId = `page_${p.pageNum}`;
            const chapFile = `chapter_${p.pageNum}.xhtml`;
            const paragraphs = p.text.split('\n\n').map(par => `<p>${escapeXml(par.trim())}</p>`).join('\n');
            const xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
<head>
  <title>Page ${p.pageNum}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h2>Page ${p.pageNum}</h2>
  ${paragraphs || '<p><em>(Empty or visual page)</em></p>'}
</body>
</html>`;
            oebps.file(chapFile, xhtml);
            manifestItems.push(`<item id="${chapId}" href="${chapFile}" media-type="application/xhtml+xml"/>`);
            spineItems.push(`<itemref idref="${chapId}"/>`);
            tocNavItems.push(`<li><a href="${chapFile}">Page ${p.pageNum}</a></li>`);
          });
        } else {
          // Single Chapter
          const chapId = 'main_text';
          const chapFile = 'main.xhtml';
          const allParas = pagesText.map(p => `<h3>Page ${p.pageNum}</h3>` + p.text.split('\n\n').map(par => `<p>${escapeXml(par.trim())}</p>`).join('\n')).join('\n<hr/>\n');
          const xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
<head>
  <title>${escapeXml(bookTitle)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h1>${escapeXml(bookTitle)}</h1>
  <p><strong>Author:</strong> ${escapeXml(bookAuthor)}</p>
  ${allParas}
</body>
</html>`;
          oebps.file(chapFile, xhtml);
          manifestItems.push(`<item id="${chapId}" href="${chapFile}" media-type="application/xhtml+xml"/>`);
          spineItems.push(`<itemref idref="${chapId}"/>`);
          tocNavItems.push(`<li><a href="${chapFile}">${escapeXml(bookTitle)}</a></li>`);
        }

        // Navigation (nav.xhtml)
        oebps.file(
          'nav.xhtml',
          `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
<head><title>Table of Contents</title></head>
<body>
  <nav epub:type="toc" id="toc">
    <h2>Table of Contents</h2>
    <ol>${tocNavItems.join('\n')}</ol>
  </nav>
</body>
</html>`
        );

        // content.opf
        const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:${Date.now()}</dc:identifier>
    <dc:title>${escapeXml(bookTitle)}</dc:title>
    <dc:creator>${escapeXml(bookAuthor)}</dc:creator>
    <dc:language>${language}</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.[0-9]+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine>
    ${spineItems.join('\n    ')}
  </spine>
</package>`;
        oebps.file('content.opf', opf);

        setProgress(90);
        blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
        outName = `${baseName}.epub`;

      } else if (format === 'txt') {
        const fullTxt = `Title: ${bookTitle}\nAuthor: ${bookAuthor}\n\n` +
          pagesText.map(p => `--- PAGE ${p.pageNum} ---\n\n${p.text}`).join('\n\n');
        blob = new Blob([fullTxt], { type: 'text/plain;charset=utf-8' });
        outName = `${baseName}.txt`;

      } else if (format === 'md') {
        const fullMd = `# ${bookTitle}\n**Author:** ${bookAuthor}\n\n` +
          pagesText.map(p => `## Page ${p.pageNum}\n\n${p.text}`).join('\n\n');
        blob = new Blob([fullMd], { type: 'text/markdown;charset=utf-8' });
        outName = `${baseName}.md`;

      } else if (format === 'fb2') {
        const fb2Body = pagesText.map(p => `<section><title><p>Page ${p.pageNum}</p></title>${p.text.split('\n\n').map(par => `<p>${escapeXml(par.trim())}</p>`).join('')}</section>`).join('\n');
        const fb2Xml = `<?xml version="1.0" encoding="utf-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
  <description>
    <title-info>
      <genre>other</genre>
      <author><last-name>${escapeXml(bookAuthor)}</last-name></author>
      <book-title>${escapeXml(bookTitle)}</book-title>
      <lang>${language}</lang>
    </title-info>
  </description>
  <body>
    <title><p>${escapeXml(bookTitle)}</p></title>
    ${fb2Body}
  </body>
</FictionBook>`;
        blob = new Blob([fb2Xml], { type: 'application/x-fictionbook+xml' });
        outName = `${baseName}.fb2`;

      } else if (format === 'mobi-html') {
        // Standard Kindle MOBI HTML source
        const mobiHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeXml(bookTitle)}</title>
  <style>body{font-family:serif;margin:4%;} h1{text-align:center;} p{text-indent:1em;}</style>
</head>
<body>
  <h1>${escapeXml(bookTitle)}</h1>
  <p style="text-align:center"><em>by ${escapeXml(bookAuthor)}</em></p>
  <hr/>
  ${pagesText.map(p => `<h2>Page ${p.pageNum}</h2>` + p.text.split('\n\n').map(par => `<p>${escapeXml(par.trim())}</p>`).join('')).join('<mbp:pagebreak/>')}
</body>
</html>`;
        blob = new Blob([mobiHtml], { type: 'text/html;charset=utf-8' });
        outName = `${baseName}_kindle.html`;
      }

      setProgress(100);
      const url = URL.createObjectURL(blob);
      setResult({ url, name: outName, size: blob.size });
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setConverting(false);
    }
  };

  const escapeXml = (unsafe) => {
    return (unsafe || '').replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <BookOpen className="text-amber-400" /> PDF to eBook Converter (EPUB / MOBI / FB2)
        </h2>
        <p className="text-slate-400 text-sm">
          Convert PDF documents into genuine EPUB 3.0 eBooks, Kindle-ready HTML, FictionBook 2, or Markdown for e-readers.
        </p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          file ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-700 hover:border-amber-500/50 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-3 text-amber-400" />
        <p className="text-white font-medium text-lg">
          {file ? file.name : 'Drop PDF here or click to browse'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {pdfDoc ? `${pdfDoc.numPages} Pages • ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Validated with %PDF- header check • Client-side processing'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-6 text-amber-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Analyzing PDF structure…</span>
        </div>
      )}

      {/* Configuration & Preview */}
      {pdfDoc && (
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Target eBook Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="epub">EPUB 3.0 (Standard e-Reader format)</option>
                <option value="mobi-html">Kindle MOBI / HTML (Amazon Kindle format)</option>
                <option value="fb2">FB2 (FictionBook 2.0 format)</option>
                <option value="md">Markdown (.md formatted)</option>
                <option value="txt">Plain Text (.txt)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Chapter Division</label>
              <select
                value={splitBy}
                onChange={(e) => setSplitBy(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="page">Split into Chapters by PDF Page</option>
                <option value="single">Single Continuous Chapter</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Document"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick Preview */}
          {previewPages.length > 0 && (
            <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5 text-amber-400" /> Extracted Text Preview
              </div>
              <div className="space-y-2">
                {previewPages.map(p => (
                  <div key={p.pageNum} className="text-xs p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-amber-400/90 mr-2">Page {p.pageNum}:</span>
                    <span className="text-slate-300">{p.text || '<No text extracted on this page>'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {converting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Building {format.toUpperCase()} archive…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleConvert}
              disabled={converting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {converting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {converting ? 'Generating eBook…' : `Convert to ${format.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">{result.name}</p>
              <p className="text-emerald-400/80 text-xs">{(result.size / 1024).toFixed(1)} KB • Ready for e-reader</p>
            </div>
          </div>
          <a
            href={result.url}
            download={result.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" /> Download eBook
          </a>
        </div>
      )}
    </div>
  );
}
