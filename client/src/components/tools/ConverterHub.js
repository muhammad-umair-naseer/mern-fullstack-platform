import React, { useState, useEffect, useRef } from 'react';
import { Upload, Shuffle, Download, RefreshCw, AlertCircle, CheckCircle2, FileText, Image as ImageIcon, Music, Video, Database} from 'lucide-react';
import { validateFile } from '../../lib/fileValidation';
import { runFfmpegCommand } from '../../lib/ffmpegEngine';
import { loadVendorScript } from '../../lib/dynamicVendor';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

const CATEGORY_MAP = {
  image: {
    label: 'Image',
    icon: ImageIcon,
    color: 'text-pink-400',
    extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'],
    targets: [
      { id: 'png', label: 'PNG (Lossless Image)', ext: 'png', mime: 'image/png' },
      { id: 'jpg', label: 'JPG (Compressed Photo)', ext: 'jpg', mime: 'image/jpeg' },
      { id: 'webp', label: 'WebP (Modern Web Image)', ext: 'webp', mime: 'image/webp' },
      { id: 'gif', label: 'GIF (Animation/Graphic)', ext: 'gif', mime: 'image/gif' },
      { id: 'pdf', label: 'PDF (Printable Document)', ext: 'pdf', mime: 'application/pdf' },
    ]
  },
  audio: {
    label: 'Audio',
    icon: Music,
    color: 'text-violet-400',
    extensions: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'],
    targets: [
      { id: 'mp3', label: 'MP3 (MPEG Audio)', ext: 'mp3', mime: 'audio/mp3' },
      { id: 'wav', label: 'WAV (Uncompressed PCM)', ext: 'wav', mime: 'audio/wav' },
      { id: 'aac', label: 'AAC (Advanced Audio)', ext: 'aac', mime: 'audio/aac' },
      { id: 'ogg', label: 'OGG (Vorbis Audio)', ext: 'ogg', mime: 'audio/ogg' },
    ]
  },
  video: {
    label: 'Video',
    icon: Video,
    color: 'text-rose-400',
    extensions: ['mp4', 'mov', 'webm', 'avi', 'mkv'],
    targets: [
      { id: 'mp4', label: 'MP4 (H.264 Universal Video)', ext: 'mp4', mime: 'video/mp4' },
      { id: 'webm', label: 'WebM (VP8/VP9 Web Video)', ext: 'webm', mime: 'video/webm' },
      { id: 'gif', label: 'GIF (Animated Graphic)', ext: 'gif', mime: 'image/gif' },
      { id: 'mp3', label: 'MP3 (Audio Track Extraction)', ext: 'mp3', mime: 'audio/mp3' },
    ]
  },
  document: {
    label: 'Document',
    icon: FileText,
    color: 'text-blue-400',
    extensions: ['pdf', 'txt', 'html', 'md', 'json', 'csv'],
    targets: [
      { id: 'pdf', label: 'PDF Document', ext: 'pdf', mime: 'application/pdf' },
      { id: 'txt', label: 'Plain Text (.txt)', ext: 'txt', mime: 'text/plain' },
      { id: 'html', label: 'HTML Web Document', ext: 'html', mime: 'text/html' },
      { id: 'md', label: 'Markdown Document (.md)', ext: 'md', mime: 'text/markdown' },
      { id: 'png', label: 'PNG Image Pages', ext: 'png', mime: 'image/png' },
      { id: 'jpg', label: 'JPG Image Pages', ext: 'jpg', mime: 'image/jpeg' },
    ]
  },
  data: {
    label: 'Spreadsheet & Data',
    icon: Database,
    color: 'text-emerald-400',
    extensions: ['xlsx', 'xls', 'csv', 'json'],
    targets: [
      { id: 'csv', label: 'CSV (Comma Separated Values)', ext: 'csv', mime: 'text/csv' },
      { id: 'json', label: 'JSON Data Tree', ext: 'json', mime: 'application/json' },
      { id: 'xlsx', label: 'Excel Spreadsheet (.xlsx)', ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'html', label: 'HTML Table View', ext: 'html', mime: 'text/html' },
    ]
  }
};

export default function ConverterHub() {
  const [file, setFile] = useState(null);
  const [fileCategory, setFileCategory] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [quality, setQuality] = useState(0.9);
  const [audioBitrate, setAudioBitrate] = useState('192k');

  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [result, previewUrl]);

  const detectCategory = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    for (const [catKey, catVal] of Object.entries(CATEGORY_MAP)) {
      if (catVal.extensions.includes(ext)) {
        return { category: catKey, ext };
      }
    }
    return { category: 'document', ext };
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const { category, ext } = detectCategory(selected.name);
    setFile(selected);
    setFileCategory(category);

    // Set default target format different from current
    const availableTargets = CATEGORY_MAP[category]?.targets || [];
    const diffTarget = availableTargets.find(t => t.ext !== ext) || availableTargets[0];
    if (diffTarget) setTargetFormat(diffTarget.id);

    // Quick preview if image
    if (category === 'image') {
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;
    setConverting(true);
    setProgress(10);
    setError(null);
    setStatusMsg('Initializing converter engine…');

    try {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const inputExt = file.name.split('.').pop().toLowerCase();
      let blob;
      let outName;

      if (fileCategory === 'image') {
        if (targetFormat === 'pdf') {
          setStatusMsg('Creating PDF document…');
          const img = new Image();
          const objUrl = URL.createObjectURL(file);
          await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = objUrl; });
          
          const orientation = img.width > img.height ? 'landscape' : 'portrait';
          const pdf = new jsPDF({ orientation, unit: 'px', format: [img.width, img.height] });
          pdf.addImage(img, 'PNG', 0, 0, img.width, img.height);
          const buf = pdf.output('arraybuffer');
          blob = new Blob([buf], { type: 'application/pdf' });
          outName = `${baseName}.pdf`;
          URL.revokeObjectURL(objUrl);
        } else {
          setStatusMsg(`Rendering to ${targetFormat.toUpperCase()}…`);
          const img = new Image();
          const objUrl = URL.createObjectURL(file);
          await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = objUrl; });
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : targetFormat === 'webp' ? 'image/webp' : 'image/png';
          blob = await new Promise(res => canvas.toBlob(res, mimeType, quality));
          outName = `${baseName}.${targetFormat}`;
          URL.revokeObjectURL(objUrl);
          canvas.width = 0; canvas.height = 0;
        }
      } else if (fileCategory === 'audio' || fileCategory === 'video') {
        setStatusMsg('Loading WebAssembly media processor…');
        const inFileName = `input.${inputExt}`;
        const outFileName = `output.${targetFormat}`;
        let args = ['-i', inFileName];

        if (targetFormat === 'mp3') {
          args.push('-b:a', audioBitrate);
        } else if (targetFormat === 'gif') {
          args.push('-vf', 'fps=10,scale=480:-1:flags=lanczos');
        }

        args.push(outFileName);

        const outData = await runFfmpegCommand(
          file,
          inFileName,
          outFileName,
          args,
          (pct, msg) => {
            setProgress(Math.round(pct * 100));
            setStatusMsg(msg || `Processing ${Math.round(pct * 100)}%…`);
          }
        );

        const mime = targetFormat === 'mp3' ? 'audio/mp3' : targetFormat === 'wav' ? 'audio/wav' : targetFormat === 'mp4' ? 'video/mp4' : 'image/gif';
        blob = new Blob([outData], { type: mime });
        outName = `${baseName}.${targetFormat}`;

      } else if (fileCategory === 'data') {
        setStatusMsg('Parsing structured dataset…');
        await loadVendorScript('/vendor/xlsx.full.min.js', 'XLSX');
        const XLSX = window.XLSX;
        const arrayBuf = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuf, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        if (targetFormat === 'csv') {
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          blob = new Blob([csvText], { type: 'text/csv;charset=utf-8' });
          outName = `${baseName}.csv`;
        } else if (targetFormat === 'json') {
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          outName = `${baseName}.json`;
        } else if (targetFormat === 'html') {
          const htmlText = XLSX.utils.sheet_to_html(worksheet);
          blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
          outName = `${baseName}.html`;
        } else if (targetFormat === 'xlsx') {
          const xlsxBuf = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          blob = new Blob([xlsxBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          outName = `${baseName}.xlsx`;
        }
      } else if (fileCategory === 'document') {
        if (inputExt === 'pdf') {
          const validation = await validateFile(file, 'pdf');
          if (!validation.isValid) throw new Error(validation.error);

          const buffer = await file.arrayBuffer();
          const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

          if (targetFormat === 'txt') {
            let fullText = '';
            for (let i = 1; i <= doc.numPages; i++) {
              const page = await doc.getPage(i);
              const content = await page.getTextContent();
              fullText += `--- Page ${i} ---\n` + content.items.map(it => it.str).join(' ') + '\n\n';
            }
            blob = new Blob([fullText], { type: 'text/plain' });
            outName = `${baseName}.txt`;
          } else if (targetFormat === 'html') {
            let fullHtml = `<!DOCTYPE html><html><head><title>${baseName}</title><style>body{font-family:sans-serif;margin:40px;line-height:1.6;}</style></head><body><h1>${baseName}</h1>`;
            for (let i = 1; i <= doc.numPages; i++) {
              const page = await doc.getPage(i);
              const content = await page.getTextContent();
              fullHtml += `<div style="border-bottom:1px solid #ddd;padding:20px 0;"><h3>Page ${i}</h3><p>${content.items.map(it => it.str).join(' ')}</p></div>`;
            }
            fullHtml += '</body></html>';
            blob = new Blob([fullHtml], { type: 'text/html' });
            outName = `${baseName}.html`;
          } else if (targetFormat === 'png' || targetFormat === 'jpg') {
            const page = await doc.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;
            blob = await new Promise(res => canvas.toBlob(res, targetFormat === 'jpg' ? 'image/jpeg' : 'image/png'));
            outName = `${baseName}_page1.${targetFormat}`;
            canvas.width = 0; canvas.height = 0;
          }
        } else {
          // Plain text / markdown to PDF
          const text = await file.text();
          const pdf = new jsPDF();
          const splitText = pdf.splitTextToSize(text, 180);
          pdf.text(splitText, 15, 20);
          const buf = pdf.output('arraybuffer');
          blob = new Blob([buf], { type: 'application/pdf' });
          outName = `${baseName}.pdf`;
        }
      }

      setProgress(100);
      setStatusMsg('Done!');
      const url = URL.createObjectURL(blob);
      setResult({ url, name: outName, size: blob.size });
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setConverting(false);
    }
  };

  const CatIcon = fileCategory && CATEGORY_MAP[fileCategory] ? CATEGORY_MAP[fileCategory].icon : Shuffle;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Shuffle className="text-indigo-400" /> Universal File Converter Hub
        </h2>
        <p className="text-slate-400 text-sm">
          Convert seamlessly between images, audio, video, documents, spreadsheets, and data formats directly in your browser.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          file ? 'border-indigo-500/50 bg-indigo-950/10' : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-3 text-indigo-400" />
        <p className="text-white font-medium text-lg">
          {file ? file.name : 'Drop any file here or click to browse'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {file
            ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Detected: ${CATEGORY_MAP[fileCategory]?.label || 'File'}`
            : 'Supports Images, Audio, Video, Documents, Spreadsheets, Data'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Conversion Options */}
      {file && fileCategory && CATEGORY_MAP[fileCategory] && (
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <CatIcon className={`w-6 h-6 ${CATEGORY_MAP[fileCategory].color}`} />
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Source Category</span>
              <p className="text-white font-medium">{CATEGORY_MAP[fileCategory].label}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-slate-300 text-sm font-medium">Choose Output Format</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORY_MAP[fileCategory].targets.map((tgt) => (
                <button
                  key={tgt.id}
                  onClick={() => setTargetFormat(tgt.id)}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                    targetFormat === tgt.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold text-sm text-indigo-300 uppercase">{tgt.id}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{tgt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional settings */}
          {fileCategory === 'image' && (targetFormat === 'jpg' || targetFormat === 'webp') && (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Image Quality: {Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          )}

          {(fileCategory === 'audio' || fileCategory === 'video') && targetFormat === 'mp3' && (
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Audio Bitrate</label>
              <select
                value={audioBitrate}
                onChange={(e) => setAudioBitrate(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="128k">128 kbps (Standard)</option>
                <option value="192k">192 kbps (High Quality)</option>
                <option value="320k">320 kbps (Maximum Fidelity)</option>
              </select>
            </div>
          )}

          {converting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{statusMsg || 'Converting file…'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleConvert}
              disabled={converting || !targetFormat}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {converting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {converting ? 'Processing…' : `Convert to ${targetFormat.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">{result.name}</p>
              <p className="text-emerald-400/80 text-xs">{(result.size / 1024).toFixed(1)} KB • Conversion complete</p>
            </div>
          </div>
          <a
            href={result.url}
            download={result.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" /> Download Result
          </a>
        </div>
      )}
    </div>
  );
}
