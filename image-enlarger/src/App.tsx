import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Check, Download, Image as ImageIcon, LockKeyhole, Sparkles, Upload, X } from "lucide-react";

type SourceImage = { file: File; url: string; width: number; height: number };
type EnlargedImage = { url: string; size: number; width: number; height: number };
type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const outputFormats: Array<{ value: OutputFormat; label: string; extension: string }> = [
  { value: "image/jpeg", label: "JPG", extension: ".jpg" },
  { value: "image/png", label: "PNG", extension: ".png" },
  { value: "image/webp", label: "WebP", extension: ".webp" },
];
const MAX_OUTPUT_PIXELS = 25_000_000;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function applyLocalClarity(context: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = context.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const output = imageData.data;
  const clamp = (value: number) => Math.max(0, Math.min(255, value));

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = (y * width + x) * 4;
      const top = index - width * 4;
      const bottom = index + width * 4;
      const left = index - 4;
      const right = index + 4;
      for (let channel = 0; channel < 3; channel += 1) {
        output[index + channel] = clamp(
          source[index + channel] * 5 - source[top + channel] - source[bottom + channel] - source[left + channel] - source[right + channel],
        );
      }
      output[index + 3] = source[index + 3];
    }
  }
  context.putImageData(imageData, 0, 0);
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<SourceImage | null>(null);
  const [result, setResult] = useState<EnlargedImage | null>(null);
  const [scale, setScale] = useState<2 | 4>(2);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [enhance, setEnhance] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (source) URL.revokeObjectURL(source.url);
    if (result) URL.revokeObjectURL(result.url);
  }, [source, result]);

  const openFile = useCallback((file: File | undefined) => {
    if (!file) return;
    setMessage("");
    setError("");
    setResult((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return null;
    });
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    const url = URL.createObjectURL(file);
    const preview = new window.Image();
    preview.onload = () => {
      setSource((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { file, url, width: preview.naturalWidth, height: preview.naturalHeight };
      });
      const matchingFormat = outputFormats.some((item) => item.value === file.type) ? file.type as OutputFormat : "image/jpeg";
      setFormat(matchingFormat);
    };
    preview.onerror = () => {
      URL.revokeObjectURL(url);
      setError("This image could not be opened in your browser.");
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
    if (source) URL.revokeObjectURL(source.url);
    if (result) URL.revokeObjectURL(result.url);
    setSource(null);
    setResult(null);
    setMessage("");
    setError("");
  };

  const enlarge = () => {
    if (!source) return;
    const outputWidth = source.width * scale;
    const outputHeight = source.height * scale;
    if (outputWidth * outputHeight > MAX_OUTPUT_PIXELS) {
      setError("This image is too large for a safe browser enlargement. Try 2× or choose a smaller source image.");
      return;
    }

    setBusy(true);
    setMessage("");
    setError("");
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        setError("Your browser could not create the enlarged image.");
        setBusy(false);
        return;
      }
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, outputWidth, outputHeight);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, outputWidth, outputHeight);
      if (enhance) applyLocalClarity(context, outputWidth, outputHeight);
      canvas.toBlob((blob) => {
        if (!blob) {
          setError("The enlarged image could not be created.");
          setBusy(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        setResult((previous) => {
          if (previous) URL.revokeObjectURL(previous.url);
          return { url, size: blob.size, width: outputWidth, height: outputHeight };
        });
        setMessage(enhance ? "Image enlarged with local clarity enhancement." : "Image enlarged and ready to download.");
        setBusy(false);
      }, format, format === "image/png" ? undefined : 0.92);
    };
    image.onerror = () => {
      setError("The image could not be prepared for enlargement.");
      setBusy(false);
    };
    image.src = source.url;
  };

  const download = () => {
    if (!source || !result) return;
    const selected = outputFormats.find((item) => item.value === format) ?? outputFormats[0];
    const baseName = source.file.name.replace(/\.[^/.]+$/, "") || "enlarged-image";
    const link = document.createElement("a");
    link.href = result.url;
    link.download = `${baseName}-${scale}x${selected.extension}`;
    link.click();
    setMessage("Enlarged image downloaded.");
  };

  return (
    <div className="enlarger-app">
      <header className="simple-header">
        <a className="simple-brand" href="/" aria-label="Image Enlarger home"><span className="brand-mark"><ImageIcon size={16} /></span><span>Image Enlarger</span></a>
        <span className="local-note"><LockKeyhole size={14} /> Works in your browser</span>
      </header>

      <main className="simple-main">
        <div className="simple-title">
          <div><p className="tool-label">TOOL #53</p><h1>Image Enlarger</h1><p className="intro">Upscale a small image with smooth browser-based rendering.</p></div>
          {source && <button className="clear-button" type="button" onClick={clearFile}><X size={14} /> Remove image</button>}
        </div>

        {!source ? (
          <div className={`simple-dropzone ${dragging ? "dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={dropFile} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}>
            <input ref={inputRef} className="hidden-input" type="file" accept="image/*" onChange={chooseFile} />
            <span className="drop-icon"><Upload size={20} /></span>
            <strong>Choose an image</strong>
            <span>or drag and drop it here</span>
            <small>JPG · PNG · WEBP · GIF</small>
          </div>
        ) : (
          <div className="enlarge-card">
            <section className="preview-column">
              <div className="column-heading"><strong>{result ? "Enlarged preview" : "Preview"}</strong><span>{result ? `${result.width} × ${result.height}px` : `${source.width} × ${source.height}px`}</span></div>
              <div className="preview-box"><img src={result?.url ?? source.url} alt={`Preview of ${source.file.name}`} /></div>
              <div className="file-info"><ImageIcon size={15} /><span title={source.file.name}>{source.file.name}</span><small>{formatSize(result?.size ?? source.file.size)}</small></div>
            </section>

            <section className="settings-column" aria-label="Enlargement settings">
              <div className="column-heading"><strong>Enlarge settings</strong><span>Local only</span></div>
              <label className="field-label">Scale</label>
              <div className="scale-list">
                {[2, 4].map((value) => <button type="button" key={value} className={scale === value ? "selected" : ""} onClick={() => setScale(value as 2 | 4)}><span><strong>{value}×</strong><small>{source.width * value} × {source.height * value}px</small></span>{scale === value && <Check size={16} />}</button>)}
              </div>
              <label className="field-label" htmlFor="output-format">Output format</label>
              <select id="output-format" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
                {outputFormats.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <label className="enhance-toggle"><input type="checkbox" checked={enhance} onChange={(event) => setEnhance(event.target.checked)} /><span className="checkmark">{enhance ? "✓" : ""}</span><span><strong>Enhance clarity</strong><small>Local sharpening after enlargement</small></span></label>
              <button className="enlarge-button" type="button" onClick={enlarge} disabled={busy}><Sparkles size={16} />{busy ? "Enlarging…" : "Enlarge image"}</button>
              {result && <button className="download-button" type="button" onClick={download}><Download size={16} /> Download image</button>}
            </section>
          </div>
        )}

        {error && <p className="feedback error" role="alert">{error}</p>}
        {message && <p className="feedback success" role="status">{message}</p>}
        <footer className="simple-footer"><span><LockKeyhole size={13} /> Nothing is uploaded. Your image stays on this device.</span><span>Local tool #53</span></footer>
      </main>
    </div>
  );
}
