import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Check, Download, Image as ImageIcon, LockKeyhole, ShieldCheck, Upload, X } from "lucide-react";
import UPNG from "upng-js";

type LoadedPng = {
  file: File;
  url: string;
  width: number;
  height: number;
};

type CompressedPng = {
  url: string;
  size: number;
};

type CompressionMode = "lossless" | "balanced" | "strong";

const modes: Array<{ value: CompressionMode; label: string; detail: string; colorCount: number }> = [
  { value: "lossless", label: "Lossless", detail: "Best quality", colorCount: 0 },
  { value: "balanced", label: "Balanced", detail: "Good size + quality", colorCount: 256 },
  { value: "strong", label: "Strong", detail: "Smallest file", colorCount: 128 },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function percentageSaved(original: number, compressed: number) {
  return Math.round((1 - compressed / original) * 100);
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<LoadedPng | null>(null);
  const [compressed, setCompressed] = useState<CompressedPng | null>(null);
  const [mode, setMode] = useState<CompressionMode>("balanced");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.url);
    if (compressed) URL.revokeObjectURL(compressed.url);
  }, [image, compressed]);

  const openFile = useCallback((file: File | undefined) => {
    if (!file) return;
    setMessage("");
    setError("");
    setCompressed(null);
    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
      setError("Please select a PNG image.");
      return;
    }

    const url = URL.createObjectURL(file);
    const preview = new window.Image();
    preview.onload = () => {
      setImage((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { file, url, width: preview.naturalWidth, height: preview.naturalHeight };
      });
    };
    preview.onerror = () => {
      URL.revokeObjectURL(url);
      setError("This PNG could not be opened in your browser.");
    };
    preview.src = url;
  }, []);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    openFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const dropFile = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    openFile(event.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    if (image) URL.revokeObjectURL(image.url);
    if (compressed) URL.revokeObjectURL(compressed.url);
    setImage(null);
    setCompressed(null);
    setMessage("");
    setError("");
  };

  const compress = () => {
    if (!image) return;
    setBusy(true);
    setMessage("");
    setError("");
    const source = new window.Image();
    source.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        setError("Your browser could not prepare the PNG.");
        setBusy(false);
        return;
      }
      context.clearRect(0, 0, image.width, image.height);
      context.drawImage(source, 0, 0);
      const rgba = context.getImageData(0, 0, image.width, image.height).data;
      const selected = modes.find((item) => item.value === mode) ?? modes[1];
      const encoded = UPNG.encode([rgba], image.width, image.height, selected.colorCount);
      const blob = new Blob([encoded], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setCompressed((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { url, size: blob.size };
      });
      const saved = percentageSaved(image.file.size, blob.size);
      setMessage(saved >= 0 ? `Ready — reduced by ${saved}%.` : "Ready — this PNG is already highly optimized.");
      setBusy(false);
    };
    source.onerror = () => {
      setError("The PNG could not be prepared for compression.");
      setBusy(false);
    };
    source.src = image.url;
  };

  const download = () => {
    if (!image || !compressed) return;
    const baseName = image.file.name.replace(/\.png$/i, "") || "image";
    const link = document.createElement("a");
    link.href = compressed.url;
    link.download = `${baseName}-compressed.png`;
    link.click();
    setMessage("Compressed PNG downloaded.");
  };

  return (
    <div className="compressor-app">
      <header className="simple-header">
        <a className="simple-brand" href="/" aria-label="PNG Compressor home"><span className="brand-mark"><ImageIcon size={16} /></span><span>PNG Compressor</span></a>
        <span className="local-note"><LockKeyhole size={14} /> Works in your browser</span>
      </header>

      <main className="simple-main">
        <div className="simple-title">
          <div><p className="tool-label">TOOL #49</p><h1>PNG Compressor</h1><p className="intro">Make PNG files smaller while keeping transparent backgrounds.</p></div>
          {image && <button className="clear-button" type="button" onClick={clearFile}><X size={14} /> Remove image</button>}
        </div>

        {!image ? (
          <div className={`simple-dropzone ${dragging ? "dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={dropFile} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}>
            <input ref={inputRef} className="hidden-input" type="file" accept="image/png,.png" onChange={chooseFile} />
            <span className="drop-icon"><Upload size={20} /></span>
            <strong>Choose a PNG image</strong>
            <span>or drag and drop it here</span>
            <small>PNG ONLY · TRANSPARENCY PRESERVED</small>
          </div>
        ) : (
          <div className="compress-card">
            <section className="preview-column">
              <div className="column-heading"><strong>Preview</strong><span>{image.width} × {image.height}px</span></div>
              <div className="preview-box"><img src={compressed?.url ?? image.url} alt={`Preview of ${image.file.name}`} /></div>
              <div className="file-info"><ImageIcon size={15} /><span title={image.file.name}>{image.file.name}</span><small>{formatSize(image.file.size)}</small></div>
            </section>

            <section className="settings-column" aria-label="Compression settings">
              <div className="column-heading"><strong>Compression</strong><span>PNG output</span></div>
              <div className="transparency-note"><ShieldCheck size={17} /><span><strong>Transparency safe</strong><small>Alpha channel stays intact.</small></span></div>
              <label className="field-label">Compression level</label>
              <div className="mode-list">
                {modes.map((item) => <button type="button" key={item.value} className={mode === item.value ? "selected" : ""} onClick={() => setMode(item.value)}><span><strong>{item.label}</strong><small>{item.detail}</small></span>{mode === item.value && <Check size={16} />}</button>)}
              </div>
              <button className="compress-button" type="button" onClick={compress} disabled={busy}><ShieldCheck size={16} />{busy ? "Compressing…" : "Compress PNG"}</button>
              {compressed && <>
                <div className="size-result"><span>Original <strong>{formatSize(image.file.size)}</strong></span><span>Compressed <strong>{formatSize(compressed.size)}</strong></span><b className={compressed.size <= image.file.size ? "saved" : "larger"}>{percentageSaved(image.file.size, compressed.size) >= 0 ? `${percentageSaved(image.file.size, compressed.size)}% smaller` : "Already optimized"}</b></div>
                <button className="download-button" type="button" onClick={download}><Download size={16} /> Download PNG</button>
              </>}
            </section>
          </div>
        )}

        {error && <p className="feedback error" role="alert">{error}</p>}
        {message && <p className="feedback success" role="status">{message}</p>}
        <footer className="simple-footer"><span><LockKeyhole size={13} /> Nothing is uploaded. Your PNG stays on this device.</span><span>Local tool #49</span></footer>
      </main>
    </div>
  );
}
