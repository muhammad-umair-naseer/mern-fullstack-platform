import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Download, Image as ImageIcon, LockKeyhole, RefreshCw, Upload, X } from "lucide-react";

type LoadedImage = {
  file: File;
  url: string;
  width: number;
  height: number;
};

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const formats: Array<{ value: OutputFormat; label: string; extension: string }> = [
  { value: "image/jpeg", label: "JPG", extension: ".jpg" },
  { value: "image/png", label: "PNG", extension: ".png" },
  { value: "image/webp", label: "WebP", extension: ".webp" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function safeDimension(value: string) {
  return Math.min(8000, Math.max(1, Math.round(Number(value) || 1)));
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.url);
  }, [image]);

  const openFile = useCallback((file: File | undefined) => {
    if (!file) return;
    setMessage("");
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    const url = URL.createObjectURL(file);
    const preview = new window.Image();
    preview.onload = () => {
      setImage((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { file, url, width: preview.naturalWidth, height: preview.naturalHeight };
      });
      setWidth(preview.naturalWidth);
      setHeight(preview.naturalHeight);
    };
    preview.onerror = () => {
      URL.revokeObjectURL(url);
      setError("This image could not be opened.");
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

  const setImageWidth = (value: string) => {
    const next = safeDimension(value);
    setWidth(next);
    if (lockRatio && image) setHeight(Math.min(8000, Math.max(1, Math.round(next / (image.width / image.height)))));
  };

  const setImageHeight = (value: string) => {
    const next = safeDimension(value);
    setHeight(next);
    if (lockRatio && image) setWidth(Math.min(8000, Math.max(1, Math.round(next * (image.width / image.height)))));
  };

  const reset = () => {
    if (image) URL.revokeObjectURL(image.url);
    setImage(null);
    setWidth(0);
    setHeight(0);
    setMessage("");
    setError("");
  };

  const downloadResized = () => {
    if (!image || !width || !height) return;
    setBusy(true);
    setMessage("");
    setError("");

    const source = new window.Image();
    source.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        setError("Your browser could not create the resized image.");
        setBusy(false);
        return;
      }
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(source, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) {
          setError("The resized image could not be created.");
          setBusy(false);
          return;
        }
        const selected = formats.find((item) => item.value === format) ?? formats[0];
        const baseName = image.file.name.replace(/\.[^/.]+$/, "") || "resized-image";
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${baseName}-${width}x${height}${selected.extension}`;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage(`Downloaded ${width} × ${height} ${selected.label} image.`);
        setBusy(false);
      }, format, format === "image/png" ? undefined : quality / 100);
    };
    source.onerror = () => {
      setError("The image could not be prepared for download.");
      setBusy(false);
    };
    source.src = image.url;
  };

  return (
    <div className="resizer-app">
      <header className="simple-header">
        <a href="/" className="simple-brand"><span className="brand-mark"><ImageIcon size={16} /></span><span>Image Resizer</span></a>
        <span className="local-note"><LockKeyhole size={14} /> Works in your browser</span>
      </header>

      <main className="simple-main">
        <div className="simple-title">
          <div><p className="tool-label">TOOL #41</p><h1>Image Resizer</h1><p className="intro">Resize JPG, PNG, and WebP images on your device.</p></div>
          {image && <button className="clear-button" type="button" onClick={reset}><X size={14} /> Remove image</button>}
        </div>

        {!image ? (
          <div className={`simple-dropzone ${dragging ? "dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={dropFile} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}>
            <input ref={inputRef} className="hidden-input" type="file" accept="image/*" onChange={chooseFile} />
            <span className="drop-icon"><Upload size={20} /></span>
            <strong>Choose an image</strong>
            <span>or drag and drop it here</span>
            <small>JPG · PNG · WEBP · GIF</small>
          </div>
        ) : (
          <div className="resize-card">
            <section className="preview-column">
              <div className="column-heading"><strong>Preview</strong><span>{image.width} × {image.height}px</span></div>
              <div className="preview-box"><img src={image.url} alt={`Preview of ${image.file.name}`} /></div>
              <div className="file-info"><ImageIcon size={15} /><span title={image.file.name}>{image.file.name}</span><small>{formatSize(image.file.size)}</small></div>
            </section>

            <section className="settings-column">
              <div className="column-heading"><strong>Resize settings</strong><span>Max 8,000px</span></div>
              <div className="dimensions">
                <label>Width (px)<input type="number" min="1" max="8000" value={width} onChange={(event) => setImageWidth(event.target.value)} /></label>
                <label>Height (px)<input type="number" min="1" max="8000" value={height} onChange={(event) => setImageHeight(event.target.value)} /></label>
              </div>
              <label className="lock-control"><input type="checkbox" checked={lockRatio} onChange={(event) => setLockRatio(event.target.checked)} /><span className="checkmark">{lockRatio ? "✓" : ""}</span> Keep aspect ratio</label>
              <label className="field-label" htmlFor="output-format">Output format</label>
              <select id="output-format" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
                {formats.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <div className={format === "image/png" ? "quality muted" : "quality"}>
                <label className="field-label" htmlFor="quality">Quality <span>{format === "image/png" ? "Not used for PNG" : `${quality}%`}</span></label>
                <input id="quality" type="range" min="10" max="100" step="5" value={quality} disabled={format === "image/png"} onChange={(event) => setQuality(Number(event.target.value))} />
              </div>
              <button className="download-button" type="button" onClick={downloadResized} disabled={busy}><Download size={16} />{busy ? "Resizing…" : "Resize & download"}</button>
              <button className="reset-button" type="button" onClick={reset}><RefreshCw size={14} /> Choose another image</button>
            </section>
          </div>
        )}

        {error && <p className="feedback error" role="alert">{error}</p>}
        {message && <p className="feedback success" role="status">{message}</p>}
        <footer className="simple-footer"><span><LockKeyhole size={13} /> Nothing is uploaded. Your image stays on this device.</span><span>Local tool #41</span></footer>
      </main>
    </div>
  );
}
