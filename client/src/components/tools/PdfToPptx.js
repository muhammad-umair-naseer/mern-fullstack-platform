import React, { useState, useEffect, useRef } from 'react';
import { Upload, Presentation, Download, RefreshCw, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { validateFile } from '../../lib/fileValidation';
import { dropHandlers } from '../../lib/dropzone';

if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PdfToPptx() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('16:9'); // 16:9, 4:3
  const [dpi, setDpi] = useState(150);

  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [pageThumbnails, setPageThumbnails] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
      pageThumbnails.forEach(t => { if (t.url) URL.revokeObjectURL(t.url); });
    };
  }, [result, pageThumbnails]);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setResult(null);
    setPdfDoc(null);
    setPageThumbnails([]);
    setLoading(true);

    const validation = await validateFile(selected, 'pdf');
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    setFile(selected);

    try {
      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);

      // Render thumbnails for first few pages
      const thumbs = [];
      const count = Math.min(4, doc.numPages);
      for (let i = 1; i <= count; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.8));
        thumbs.push({ pageNum: i, url: URL.createObjectURL(blob) });
      }
      setPageThumbnails(thumbs);
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
      const zip = new JSZip();

      // OpenXML PPTX Dimensions (in EMU - English Metric Units: 1 inch = 914400 EMUs)
      // 16:9 = 12192000 x 6858000
      // 4:3  = 9144000 x 6858000
      const cx = aspectRatio === '16:9' ? 12192000 : 9144000;
      const cy = 6858000;

      // 1. [Content_Types].xml
      let contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>`;

      // 2. _rels/.rels
      zip.folder('_rels').file(
        '.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
      );

      const ppt = zip.folder('ppt');
      const pptRels = ppt.folder('_rels');
      const slidesFolder = ppt.folder('slides');
      const slidesRelsFolder = slidesFolder.folder('_rels');
      const mediaFolder = ppt.folder('media');

      let presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`;

      let slideIdList = '';

      // Determine pages to render
      const pagesToProcess = [];
      for (let i = 1; i <= numPages; i++) {
        pagesToProcess.push(i);
      }

      const total = pagesToProcess.length;

      for (let idx = 0; idx < total; idx++) {
        const pageNum = pagesToProcess[idx];
        const slideIndex = idx + 1;

        // Render PDF page to high-res PNG image
        const page = await pdfDoc.getPage(pageNum);
        const scale = dpi / 72;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        const imgBlob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        const imgArrayBuf = await imgBlob.arrayBuffer();
        
        // Free canvas memory
        canvas.width = 0;
        canvas.height = 0;

        // Save image to ppt/media/image{n}.png
        mediaFolder.file(`image${slideIndex}.png`, imgArrayBuf);

        // Update Content Types
        contentTypes += `\n  <Override PartName="/ppt/slides/slide${slideIndex}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;

        // Update presentation.xml.rels
        presRels += `\n  <Relationship Id="rId${slideIndex}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${slideIndex}.xml"/>`;

        // Update presentation.xml slideIdList
        slideIdList += `\n    <p:sldId id="${255 + slideIndex}" r:id="rId${slideIndex}"/>`;

        // Slide XML
        const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="Slide Background"/>
          <p:cNvPicPr>
            <a:picLocks noChangeAspect="1"/>
          </p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="rId1"/>
          <a:stretch>
            <a:fillRect/>
          </a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`;
        slidesFolder.file(`slide${slideIndex}.xml`, slideXml);

        // Slide Rels XML
        const slideRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${slideIndex}.png"/>
</Relationships>`;
        slidesRelsFolder.file(`slide${slideIndex}.xml.rels`, slideRelsXml);

        setProgress(Math.round(((idx + 1) / total) * 85));
        await new Promise(r => setTimeout(r, 0));
      }

      contentTypes += '\n</Types>';
      zip.file('[Content_Types].xml', contentTypes);

      presRels += '\n</Relationships>';
      pptRels.file('presentation.xml.rels', presRels);

      const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>${slideIdList}
  </p:sldIdLst>
  <p:sldSz cx="${cx}" cy="${cy}"/>
  <p:notesSz cx="${cy}" cy="${cx}"/>
</p:presentation>`;
      ppt.file('presentation.xml', presentationXml);

      setProgress(95);
      const pptxBlob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const outName = `${baseName}.pptx`;
      const url = URL.createObjectURL(pptxBlob);

      setProgress(100);
      setResult({ url, name: outName, size: pptxBlob.size, slides: total });
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Presentation className="text-orange-400" /> PDF to PowerPoint (PPTX) Converter
        </h2>
        <p className="text-slate-400 text-sm">
          Convert PDF pages into an editable presentation deck (.pptx) ready for Microsoft PowerPoint, Google Slides, and Apple Keynote.
        </p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        {...dropHandlers((f) => handleFileChange({ target: { files: [f], value: "" } }))}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          file ? 'border-orange-500/50 bg-orange-950/10' : 'border-slate-700 hover:border-orange-500/50 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-3 text-orange-400" />
        <p className="text-white font-medium text-lg">
          {file ? file.name : 'Drop PDF here or click to browse'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {pdfDoc ? `${pdfDoc.numPages} Slides • ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Validated with %PDF- header check • Client-side generation'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-6 text-orange-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Analyzing PDF pages…</span>
        </div>
      )}

      {/* Slide Thumbnails & Options */}
      {pdfDoc && (
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 space-y-6">
          {/* Thumbnails preview */}
          {pageThumbnails.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <Eye className="w-3.5 h-3.5 text-orange-400" /> Slide Preview
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pageThumbnails.map(thumb => (
                  <div key={thumb.pageNum} className="relative rounded-xl overflow-hidden border border-slate-800 bg-black/40 group">
                    <img src={thumb.url} alt={`Slide ${thumb.pageNum}`} className="w-full h-auto object-cover" />
                    <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-slate-300">
                      Slide {thumb.pageNum}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Slide Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="16:9">16:9 Widescreen (Modern Displays)</option>
                <option value="4:3">4:3 Standard (Classic Presentations)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Render Quality (DPI)</label>
              <select
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value={150}>Standard (150 DPI - Compact file)</option>
                <option value={200}>High Quality (200 DPI - Balanced)</option>
                <option value={300}>Ultra Crisp (300 DPI - Print quality)</option>
              </select>
            </div>
          </div>

          {converting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Building OpenXML PowerPoint package…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleConvert}
              disabled={converting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium hover:from-orange-400 hover:to-amber-500 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
            >
              {converting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {converting ? 'Assembling Deck…' : `Convert to PPTX (${pdfDoc.numPages} Slides)`}
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
              <p className="text-emerald-400/80 text-xs">{(result.size / 1024 / 1024).toFixed(2)} MB • {result.slides} Slides • PowerPoint ready</p>
            </div>
          </div>
          <a
            href={result.url}
            download={result.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" /> Download PowerPoint
          </a>
        </div>
      )}
    </div>
  );
}
