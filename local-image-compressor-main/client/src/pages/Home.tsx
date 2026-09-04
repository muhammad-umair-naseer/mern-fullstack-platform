/**
 * Simple Utility direction: one focused crop flow with a calm card, clear labels,
 * direct pointer interaction, and no image data leaving the browser.
 */
import { useCallback, useRef, useState, type ChangeEvent, type DragEvent, type PointerEvent } from "react";
import { Check, Crop, Download, ImagePlus, RotateCcw, ShieldCheck, Upload, X } from "lucide-react";

const BRAND_MARK = "/manus-storage/shrinkroom-mark_c396756c.png";
const MIN_CROP = 0.08;

type CropRect = { x: number; y: number; w: number; h: number };
type InteractionMode = "move" | "nw" | "ne" | "sw" | "se";
type DragState = { mode: InteractionMode; startX: number; startY: number; startRect: CropRect };
type ImageFile = { file: File; url: string; width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const defaultCrop = (): CropRect => ({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 2 : 1)} MB`;
};

const getOutputType = (type: string) => (["image/jpeg", "image/png", "image/webp"].includes(type) ? type : "image/png");

export default function Home() {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [cropRect, setCropRect] = useState<CropRect>(defaultCrop());
  const [aspectPreset, setAspectPreset] = useState("free");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputBytes, setOutputBytes] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [notice, setNotice] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const clearOutput = useCallback(() => {
    setOutputUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
    setOutputBytes(0);
  }, []);

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setNotice("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setImage((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { file, url, width: probe.naturalWidth, height: probe.naturalHeight };
      });
      setCropRect(defaultCrop());
      setAspectPreset("free");
      clearOutput();
      setNotice("");
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setNotice("This image could not be opened in your browser.");
    };
    probe.src = url;
  }, [clearOutput]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) void loadFile(event.target.files[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files[0]) void loadFile(event.dataTransfer.files[0]);
  };

  const resetCrop = () => {
    setCropRect(defaultCrop());
    setAspectPreset("free");
    clearOutput();
  };

  const applyAspect = (nextPreset: string) => {
    setAspectPreset(nextPreset);
    clearOutput();
    const aspect = nextPreset === "free" ? null : Number(nextPreset.replace(":", "/"));
    if (!aspect || !image) return;
    setCropRect((current) => {
      const imageRatio = image.width / image.height;
      let w = current.w;
      let h = (w * imageRatio) / aspect;
      if (h > 1) {
        h = 1;
        w = (h * aspect) / imageRatio;
      }
      if (w > 1) {
        w = 1;
        h = (w * imageRatio) / aspect;
      }
      const x = clamp(current.x + (current.w - w) / 2, 0, 1 - w);
      const y = clamp(current.y + (current.h - h) / 2, 0, 1 - h);
      return { x, y, w, h };
    });
  };

  const beginInteraction = (event: PointerEvent<HTMLElement>, mode: InteractionMode) => {
    event.preventDefault();
    event.stopPropagation();
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    stage.setPointerCapture(event.pointerId);
    setDragState({ mode, startX: (event.clientX - bounds.left) / bounds.width, startY: (event.clientY - bounds.top) / bounds.height, startRect: cropRect });
    clearOutput();
  };

  const updateInteraction = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState || !stageRef.current) return;
    const bounds = stageRef.current.getBoundingClientRect();
    const pointerX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const pointerY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    const dx = pointerX - dragState.startX;
    const dy = pointerY - dragState.startY;
    const start = dragState.startRect;

    setCropRect(() => {
      if (dragState.mode === "move") {
        return { ...start, x: clamp(start.x + dx, 0, 1 - start.w), y: clamp(start.y + dy, 0, 1 - start.h) };
      }
      let left = start.x;
      let right = start.x + start.w;
      let top = start.y;
      let bottom = start.y + start.h;
      if (dragState.mode.includes("w")) left = clamp(start.x + dx, 0, right - MIN_CROP);
      if (dragState.mode.includes("e")) right = clamp(start.x + start.w + dx, left + MIN_CROP, 1);
      if (dragState.mode.includes("n")) top = clamp(start.y + dy, 0, bottom - MIN_CROP);
      if (dragState.mode.includes("s")) bottom = clamp(start.y + start.h + dy, top + MIN_CROP, 1);
      return { x: left, y: top, w: right - left, h: bottom - top };
    });
  };

  const endInteraction = (event: PointerEvent<HTMLDivElement>) => {
    if (stageRef.current?.hasPointerCapture(event.pointerId)) stageRef.current.releasePointerCapture(event.pointerId);
    setDragState(null);
  };

  const cropImage = async () => {
    if (!image || isCropping) return;
    setIsCropping(true);
    setNotice("");
    try {
      const source = new Image();
      source.src = image.url;
      await new Promise<void>((resolve, reject) => {
        source.onload = () => resolve();
        source.onerror = () => reject(new Error("This image could not be opened."));
      });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(cropRect.w * image.width));
      canvas.height = Math.max(1, Math.round(cropRect.h * image.height));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not create an image canvas.");
      context.drawImage(source, Math.round(cropRect.x * image.width), Math.round(cropRect.y * image.height), canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      const outputType = getOutputType(image.file.type);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error("The cropped image could not be created.")), outputType, outputType === "image/png" ? undefined : 0.92);
      });
      setOutputUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(blob);
      });
      setOutputBytes(blob.size);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The image could not be cropped.");
    } finally {
      setIsCropping(false);
    }
  };

  const downloadCropped = () => {
    if (!outputUrl || !image) return;
    const baseName = image.file.name.replace(/\.[^/.]+$/, "") || "image";
    const extension = getOutputType(image.file.type).split("/")[1].replace("jpeg", "jpg");
    const anchor = document.createElement("a");
    anchor.href = outputUrl;
    anchor.download = `${baseName}-cropped.${extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const stageScale = image ? Math.min(640 / image.width, 520 / image.height, 1) : 1;
  const cropWidth = image ? Math.round(cropRect.w * image.width) : 0;
  const cropHeight = image ? Math.round(cropRect.h * image.height) : 0;

  return (
    <div className="simple-app">
      <header className="simple-header">
        <div className="simple-brand"><img src={BRAND_MARK} alt="" /><span>shrinkroom</span></div>
        <div className="privacy-note"><ShieldCheck size={15} /> Files stay on your device</div>
      </header>

      <main className="simple-main">
        <section className="intro">
          <p className="simple-kicker">IMAGE CROPPER</p>
          <h1>Crop your images</h1>
          <p>Select the part you want to keep. Cropping happens in your browser and nothing is uploaded.</p>
        </section>

        <section className="cropper-card">
          {!image ? (
            <>
              <div className={`simple-dropzone ${isDragging ? "simple-dropzone-active" : ""}`} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }} onDrop={onDrop}>
                <div className="upload-circle"><ImagePlus size={20} /></div>
                <h2>Choose an image to crop</h2>
                <p>Drag and drop here, or <button type="button" className="text-button" onClick={() => fileInputRef.current?.click()}>browse files</button></p>
                <span className="drop-hint">JPG, PNG, WebP · one image at a time</span>
              </div>
              <input ref={fileInputRef} className="file-input" aria-label="Choose an image to crop" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFileChange} />
            </>
          ) : (
            <>
              <div className="cropper-toolbar">
                <div><strong>{image.file.name}</strong><span>{image.width} × {image.height} · {formatBytes(image.file.size)}</span></div>
                <button type="button" className="change-image-button" onClick={() => fileInputRef.current?.click()}><Upload size={14} /> Change image</button>
              </div>
              <input ref={fileInputRef} className="file-input" aria-label="Choose an image to crop" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFileChange} />

              <div className="crop-stage-wrap">
                <div ref={stageRef} className="crop-stage" style={{ width: `${image.width * stageScale}px`, aspectRatio: `${image.width} / ${image.height}` }} onPointerMove={updateInteraction} onPointerUp={endInteraction} onPointerCancel={endInteraction}>
                  <img src={image.url} alt={image.file.name} draggable={false} />
                  <div className="crop-selection" style={{ left: `${cropRect.x * 100}%`, top: `${cropRect.y * 100}%`, width: `${cropRect.w * 100}%`, height: `${cropRect.h * 100}%` }} onPointerDown={(event) => beginInteraction(event, "move")}>
                    <span className="crop-handle nw" onPointerDown={(event) => beginInteraction(event, "nw")} />
                    <span className="crop-handle ne" onPointerDown={(event) => beginInteraction(event, "ne")} />
                    <span className="crop-handle sw" onPointerDown={(event) => beginInteraction(event, "sw")} />
                    <span className="crop-handle se" onPointerDown={(event) => beginInteraction(event, "se")} />
                  </div>
                </div>
              </div>

              <div className="crop-info"><span>Drag the box to choose the area</span><b>{cropWidth} × {cropHeight} px</b></div>
              <div className="crop-controls">
                <label className="simple-control"><span>Aspect ratio</span><select value={aspectPreset} onChange={(event) => applyAspect(event.target.value)}><option value="free">Free</option><option value="1:1">Square · 1:1</option><option value="4:3">Landscape · 4:3</option><option value="16:9">Wide · 16:9</option><option value="3:4">Portrait · 3:4</option><option value="9:16">Tall · 9:16</option></select></label>
                <button type="button" className="reset-button" onClick={resetCrop}><RotateCcw size={15} /> Reset crop</button>
                <button type="button" className="primary-button" onClick={() => void cropImage()} disabled={isCropping}><Crop size={16} /> {isCropping ? "Cropping…" : "Crop image"}</button>
              </div>

              {notice && <p className="simple-notice">{notice}</p>}

              {outputUrl && <div className="crop-result"><div className="result-check"><Check size={16} /><div><strong>Your cropped image is ready</strong><span>{cropWidth} × {cropHeight} px · {formatBytes(outputBytes)}</span></div></div><button type="button" className="secondary-button" onClick={downloadCropped}><Download size={15} /> Download image</button></div>}
            </>
          )}
          {!image && notice && <p className="simple-notice">{notice}</p>}
        </section>

        {!image && <p className="simple-footnote"><Crop size={15} /> Upload an image to select the exact area you want to keep.</p>}
        {image && <p className="simple-footnote"><ShieldCheck size={15} /> Your image is opened and cropped locally in this browser.</p>}
      </main>

      <footer className="simple-footer">shrinkroom · browser image cropper</footer>
    </div>
  );
}
