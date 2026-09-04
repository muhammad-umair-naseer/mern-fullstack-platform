/* Simplified Paper Route GUI: one clear upload action, compact options, and focused output previews. */

import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  ArrowDownToLine,
  ChevronDown,
  FileArchive,
  FileText,
  HardDrive,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { canvasToExportBlob, type ExportFormat } from "@/lib/pdf-encoders";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type ToolStatus = "idle" | "reading" | "ready" | "error";
type PdfPage = {
  pageNumber: number;
  previewUrl: string;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
};

const formats: Array<{ value: ExportFormat; label: string; ext: string; note: string }> = [
  { value: "png", label: "PNG", ext: ".png", note: "Lossless" },
  { value: "webp", label: "WebP", ext: ".webp", note: "Small file" },
  { value: "jpeg", label: "JPEG", ext: ".jpg", note: "Photo-friendly" },
  { value: "tiff", label: "TIFF", ext: ".tiff", note: "Print-ready" },
  { value: "bmp", label: "BMP", ext: ".bmp", note: "Bitmap" },
  { value: "gif", label: "GIF", ext: ".gif", note: "Indexed color" },
];

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** unitIndex).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const baseName = (name: string) => name.replace(/\.pdf$/i, "").replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "document";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [scale, setScale] = useState(1.5);
  const [quality, setQuality] = useState(0.92);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const selectedFormat = useMemo(() => formats.find((item) => item.value === format) ?? formats[0], [format]);
  const outputSize = pages[0] ? `${pages[0].width} × ${pages[0].height} px` : "—";

  useEffect(() => {
    return () => pages.forEach((page) => URL.revokeObjectURL(page.previewUrl));
  }, [pages]);

  const renderPdf = async (nextFile: File, renderScale = scale) => {
    setFile(nextFile);
    setPages([]);
    setProgress(0);
    setErrorMessage("");
    setStatus("reading");

    try {
      const arrayBuffer = await nextFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const rendered: PdfPage[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: renderScale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: true });
        if (!context) throw new Error("Your browser could not create a canvas for this PDF.");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        rendered.push({
          pageNumber,
          previewUrl: canvas.toDataURL("image/png", 0.8),
          canvas,
          width: Math.ceil(viewport.width),
          height: Math.ceil(viewport.height),
        });
        setProgress(Math.round((pageNumber / pdf.numPages) * 100));
      }

      setPages(rendered);
      setStatus("ready");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "This PDF could not be rendered in your browser.");
    }
  };

  useEffect(() => {
    if (file && status === "ready") void renderPdf(file, scale);
    // Scale changes intentionally re-render the PDF locally at the new resolution.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const handleFile = (nextFile?: File) => {
    if (!nextFile) return;
    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      setStatus("error");
      setErrorMessage("Please choose a PDF file. Nothing was uploaded.");
      return;
    }
    void renderPdf(nextFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    setFile(null);
    setPages([]);
    setStatus("idle");
    setProgress(0);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const exportAll = async () => {
    if (!pages.length || isExporting) return;
    setIsExporting(true);
    try {
      if (pages.length === 1) {
        const blob = await canvasToExportBlob(pages[0].canvas, format, quality);
        downloadBlob(blob, `${baseName(file?.name ?? "document")}-page-1${selectedFormat.ext}`);
        return;
      }

      const zip = new JSZip();
      for (const page of pages) {
        const blob = await canvasToExportBlob(page.canvas, format, quality);
        zip.file(`${baseName(file?.name ?? "document")}-page-${String(page.pageNumber).padStart(2, "0")}${selectedFormat.ext}`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${baseName(file?.name ?? "document")}-images.zip`);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "The export could not be created locally.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="simple-app">
      <header className="simple-header">
        <a className="simple-brand" href="#top" aria-label="Paper Route home">
          <img src="/manus-storage/paper-route-mark_1c4a5a09.png" alt="" />
          <span>paper route</span>
        </a>
        <div className="browser-badge"><span /> Runs in your browser</div>
      </header>

      <main className="simple-main" id="top">
        <section className="simple-intro">
          <p className="simple-kicker">PDF to image</p>
          <h1>Convert PDF pages to images</h1>
          <p>Choose a PDF, select an image format, and download the result. Your file stays on this device.</p>
        </section>

        <section className="simple-card" aria-label="PDF converter">
          <div
            className={`simple-upload ${dragActive ? "drag-active" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="upload-icon"><UploadCloud size={24} /></div>
            <div>
              <h2>{status === "ready" ? "PDF loaded" : "Drop your PDF here"}</h2>
              <p>or <button className="choose-button" onClick={() => fileInputRef.current?.click()}>choose a file</button></p>
              <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
            </div>
            <span className="upload-limit">PDF · max 200 MB</span>
          </div>

          {status === "idle" && (
            <div className="privacy-line"><ShieldCheck size={16} /><span><strong>Private processing.</strong> The PDF is read in your browser and is never uploaded.</span></div>
          )}

          {status === "reading" && (
            <div className="status-box"><div><strong>Reading PDF locally</strong><span>{progress}% complete</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><p>Large files may take a few seconds.</p></div>
          )}

          {status === "error" && (
            <div className="error-box"><div><strong>Could not open this file.</strong><span>{errorMessage}</span></div><button className="clear-button" onClick={clearFile}>Clear</button></div>
          )}
        </section>

        {status === "ready" && file && (
          <section className="results-section">
            <div className="file-row">
              <div className="file-symbol"><FileText size={20} /></div>
              <div className="file-details"><strong>{file.name}</strong><span>{formatBytes(file.size)} · {pages.length} {pages.length === 1 ? "page" : "pages"}</span></div>
              <button className="clear-icon" aria-label="Remove PDF" onClick={clearFile}><X size={18} /></button>
            </div>

            <div className="settings-row">
              <label>Format<select value={format} onChange={(event) => setFormat(event.target.value as ExportFormat)}>{formats.map((item) => <option value={item.value} key={item.value}>{item.label} ({item.ext})</option>)}</select><ChevronDown className="select-arrow" size={15} /></label>
              <label className="range-control">Scale <strong>{scale.toFixed(1)}×</strong><input type="range" min="0.75" max="3" step="0.25" value={scale} onChange={(event) => setScale(Number(event.target.value))} /></label>
              {(format === "jpeg" || format === "webp") && <label className="range-control">Quality <strong>{Math.round(quality * 100)}%</strong><input type="range" min="0.5" max="1" step="0.01" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label>}
              <button className="download-button" onClick={() => void exportAll()} disabled={isExporting}>{isExporting ? <RefreshCcw className="spin" size={17} /> : <ArrowDownToLine size={17} />} {isExporting ? "Preparing…" : pages.length > 1 ? "Download ZIP" : "Download image"}</button>
            </div>
            <div className="settings-note"><LockKeyhole size={14} /> {selectedFormat.note} · {outputSize} each · processed locally</div>

            <div className="preview-header"><h2>Page previews</h2><span>{pages.length} {pages.length === 1 ? "page" : "pages"}</span></div>
            <div className="preview-grid">
              {pages.map((page) => (
                <div className="preview-card" key={page.pageNumber}><img src={page.previewUrl} alt={`Preview of page ${page.pageNumber}`} /><span>Page {page.pageNumber}</span></div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="simple-footer"><span><HardDrive size={14} /> No server upload</span><span><FileArchive size={14} /> Multi-page PDFs download as ZIP</span></footer>
    </div>
  );
}
