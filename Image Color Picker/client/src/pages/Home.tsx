/**
 * Simple Utility direction: one focused color-picking flow with a calm upload card,
 * a direct image canvas interaction, and values that are easy to copy.
 */
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from "react";
import { Copy, ImagePlus, Pipette, RefreshCcw, ShieldCheck, Upload, Check } from "lucide-react";

const BRAND_MARK = "/manus-storage/shrinkroom-mark_c396756c.png";

type ColorValue = {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
  rgb: string;
  hsl: string;
  x: number;
  y: number;
};

type LoadedImage = { file: File; url: string; width: number; height: number };
type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 2 : 1)} MB`;
};

const toHex = (value: number) => value.toString(16).padStart(2, "0").toUpperCase();
const hexFromRgb = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

const hslFromRgb = (r: number, g: number, b: number) => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;
  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case red: hue = (green - blue) / delta + (green < blue ? 6 : 0); break;
      case green: hue = (blue - red) / delta + 2; break;
      default: hue = (red - green) / delta + 4;
    }
    hue /= 6;
  }
  return `hsl(${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
};

const colorFromRgb = (r: number, g: number, b: number, a = 255, x = 0, y = 0): ColorValue => ({ r, g, b, a, hex: hexFromRgb(r, g, b), rgb: `rgb(${r}, ${g}, ${b})`, hsl: hslFromRgb(r, g, b), x, y });

const colorFromHex = (hex: string) => {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return colorFromRgb(r, g, b);
};

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
};

export default function Home() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [pickedColor, setPickedColor] = useState<ColorValue | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const [copiedValue, setCopiedValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setNotice("Please choose an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setImage((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { file, url, width: probe.naturalWidth, height: probe.naturalHeight };
      });
      setPickedColor(null);
      setCopiedValue("");
      setNotice("");
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setNotice("This image could not be opened in your browser.");
    };
    probe.src = url;
  }, []);

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    canvas.width = image.width;
    canvas.height = image.height;
    const source = new Image();
    source.onload = () => context.drawImage(source, 0, 0, image.width, image.height);
    source.src = image.url;
  }, [image]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) loadFile(event.target.files[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files[0]) loadFile(event.dataTransfer.files[0]);
  };

  const pickFromImage = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();
    const x = clamp(Math.floor((event.clientX - bounds.left) * image.width / bounds.width), 0, image.width - 1);
    const y = clamp(Math.floor((event.clientY - bounds.top) * image.height / bounds.height), 0, image.height - 1);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const pixel = context.getImageData(x, y, 1, 1).data;
    setPickedColor(colorFromRgb(pixel[0], pixel[1], pixel[2], pixel[3], x, y));
    setCopiedValue("");
  };

  const pickFromScreen = async () => {
    const EyeDropper = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
    if (!EyeDropper) {
      setNotice("Screen picking is not supported in this browser. Upload an image instead.");
      return;
    }
    try {
      const result = await new EyeDropper().open();
      setPickedColor(colorFromHex(result.sRGBHex));
      setNotice("");
      setCopiedValue("");
    } catch {
      setNotice("Screen color picking was cancelled.");
    }
  };

  const reset = () => {
    if (image) URL.revokeObjectURL(image.url);
    setImage(null);
    setPickedColor(null);
    setNotice("");
    setCopiedValue("");
  };

  const copyValue = async (label: string, value: string) => {
    await copyText(value);
    setCopiedValue(label);
    window.setTimeout(() => setCopiedValue((current) => current === label ? "" : current), 1500);
  };

  const canvasScale = image ? Math.min(680 / image.width, 500 / image.height, 1) : 1;

  return (
    <div className="simple-app">
      <header className="simple-header">
        <div className="simple-brand"><img src={BRAND_MARK} alt="" /><span>shrinkroom</span></div>
        <div className="privacy-note"><ShieldCheck size={15} /> Files stay on your device</div>
      </header>

      <main className="simple-main">
        <section className="intro">
          <p className="simple-kicker">COLOR PICKER</p>
          <h1>Pick any color</h1>
          <p>Click a color in your image to get its exact HEX, RGB, and HSL values.</p>
        </section>

        <section className="compressor-card color-card">
          {!image ? (
            <>
              <div className={`simple-dropzone ${isDragging ? "simple-dropzone-active" : ""}`} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }} onDrop={onDrop}>
                <div className="upload-circle"><ImagePlus size={20} /></div>
                <h2>Choose an image</h2>
                <p>Drag and drop here, or <button type="button" className="text-button" onClick={() => fileInputRef.current?.click()}>browse files</button></p>
                <span className="drop-hint">JPG, PNG, WebP, GIF · one image at a time</span>
              </div>
              <input ref={fileInputRef} className="file-input" aria-label="Choose an image for color picking" type="file" accept="image/*" onChange={onFileChange} />
              <div className="screen-pick-row"><span>Want to pick from your screen?</span><button type="button" className="secondary-button screen-pick-button" onClick={() => void pickFromScreen()}><Pipette size={15} /> Pick screen color</button></div>
            </>
          ) : (
            <>
              <div className="color-toolbar"><div><strong>{image.file.name}</strong><span>{image.width} × {image.height} · {formatBytes(image.file.size)}</span></div><div className="toolbar-actions"><button type="button" className="secondary-button screen-pick-button" onClick={() => void pickFromScreen()}><Pipette size={14} /> Screen color</button><button type="button" className="change-image-button" onClick={() => fileInputRef.current?.click()}><Upload size={14} /> Change image</button></div></div>
              <input ref={fileInputRef} className="file-input" aria-label="Choose an image for color picking" type="file" accept="image/*" onChange={onFileChange} />
              <div className="color-stage-wrap"><canvas ref={canvasRef} className="color-canvas" onClick={pickFromImage} style={{ width: `${image.width * canvasScale}px`, height: `${image.height * canvasScale}px` }} aria-label="Click the image to pick a color" /></div>
              <div className="pick-instruction"><Pipette size={15} /><span>Click any pixel in the image to pick its color</span>{pickedColor && <b>at {pickedColor.x}, {pickedColor.y}</b>}</div>
              {pickedColor ? (
                <div className="color-result">
                  <div className="selected-color" style={{ backgroundColor: pickedColor.hex }} aria-label={`Selected color ${pickedColor.hex}`} />
                  <div className="color-values">
                    <div className="color-value-row"><span>HEX</span><strong>{pickedColor.hex}</strong><button type="button" className="copy-button" onClick={() => void copyValue("hex", pickedColor.hex)}>{copiedValue === "hex" ? <Check size={14} /> : <Copy size={14} />} {copiedValue === "hex" ? "Copied" : "Copy"}</button></div>
                    <div className="color-value-row"><span>RGB</span><strong>{pickedColor.rgb}</strong><button type="button" className="copy-button" onClick={() => void copyValue("rgb", pickedColor.rgb)}>{copiedValue === "rgb" ? <Check size={14} /> : <Copy size={14} />} {copiedValue === "rgb" ? "Copied" : "Copy"}</button></div>
                    <div className="color-value-row"><span>HSL</span><strong>{pickedColor.hsl}</strong><button type="button" className="copy-button" onClick={() => void copyValue("hsl", pickedColor.hsl)}>{copiedValue === "hsl" ? <Check size={14} /> : <Copy size={14} />} {copiedValue === "hsl" ? "Copied" : "Copy"}</button></div>
                  </div>
                </div>
              ) : <div className="empty-color-result"><Pipette size={17} /><span>Pick a color from the image to see its values here.</span></div>}
              {notice && <p className="simple-notice">{notice}</p>}
              <div className="color-bottom-actions"><span className="local-confirm"><ShieldCheck size={14} /> Read locally in your browser</span><button type="button" className="reset-button" onClick={reset}><RefreshCcw size={14} /> Choose another image</button></div>
            </>
          )}
          {!image && notice && <p className="simple-notice">{notice}</p>}
        </section>

        {!image && <p className="simple-footnote"><Pipette size={15} /> Your image stays in this browser while you pick a color.</p>}
        {image && <p className="simple-footnote"><ShieldCheck size={15} /> No image data is uploaded or sent to a server.</p>}
      </main>

      <footer className="simple-footer">shrinkroom · browser color picker</footer>
    </div>
  );
}
