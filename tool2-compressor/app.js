// ============================================================
// Tool 2: PDF Compressor — 100% client-side.
// Recompresses embedded raster images inside the PDF (the usual
// cause of bloated file size) while leaving vector text/graphics
// completely untouched, so text stays crisp and selectable.
// No file is ever uploaded anywhere.
// ============================================================

const { PDFDocument, PDFName, PDFNumber, PDFRawStream, PDFArray } = window.PDFLib;

const LEVELS = {
  low:    { quality: 0.8, maxDimension: 2000 },
  medium: { quality: 0.6, maxDimension: 1400 },
  high:   { quality: 0.4, maxDimension: 1000 },
};

let selectedFile = null;
let selectedLevel = "medium";

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");
const dropText = document.getElementById("drop-text");
const convertBtn = document.getElementById("convert-btn");
const statusEl = document.getElementById("status");
const form = document.getElementById("convert-form");
const levelOptions = document.getElementById("level-options");
const sizeSummary = document.getElementById("size-summary");
const origSizeEl = document.getElementById("orig-size");
const newSizeEl = document.getElementById("new-size");
const reductionEl = document.getElementById("reduction");

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type || "";
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function setSelectedFile(file) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name)) {
    setStatus("Please choose a .pdf file.", "error");
    return;
  }
  selectedFile = file;
  fileNameEl.textContent = file.name;
  dropText.textContent = "File selected:";
  convertBtn.disabled = false;
  setStatus("", "");
  sizeSummary.classList.remove("show");
}

fileInput.addEventListener("change", () => setSelectedFile(fileInput.files[0]));

["dragenter", "dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.add("dragover"); });
});
["dragleave", "drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.remove("dragover"); });
});
dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (file) { fileInput.files = e.dataTransfer.files; setSelectedFile(file); }
});

levelOptions.addEventListener("click", e => {
  const btn = e.target.closest(".level-btn");
  if (!btn) return;
  document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedLevel = btn.dataset.level;
});

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- ASCII85 / ASCIIHex decoders (Adobe filters used in PDFs) ----------

function decodeASCII85(bytes) {
  let str = new TextDecoder("latin1").decode(bytes).trim();
  if (str.startsWith("<~")) str = str.slice(2);
  if (str.endsWith("~>")) str = str.slice(0, -2);
  str = str.replace(/\s+/g, "");

  const out = [];
  let group = [];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === "z" && group.length === 0) { out.push(0, 0, 0, 0); continue; }
    group.push(c.charCodeAt(0) - 33);
    if (group.length === 5) {
      let val = 0;
      for (const g of group) val = val * 85 + g;
      out.push((val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff);
      group = [];
    }
  }
  if (group.length > 0) {
    const n = group.length;
    while (group.length < 5) group.push(84);
    let val = 0;
    for (const g of group) val = val * 85 + g;
    const bytes4 = [(val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff];
    out.push(...bytes4.slice(0, n - 1));
  }
  return new Uint8Array(out);
}

function decodeASCIIHex(bytes) {
  let str = new TextDecoder("latin1").decode(bytes).replace(/>$/, "").replace(/\s+/g, "");
  if (str.length % 2 === 1) str += "0";
  const out = new Uint8Array(str.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(str.substr(i * 2, 2), 16);
  return out;
}

function filtersOf(dict) {
  const f = dict.get(PDFName.of("Filter"));
  if (!f) return [];
  if (f instanceof PDFArray) return f.asArray().map(x => x.toString());
  return [f.toString()];
}

function loadImage(bytes) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([bytes], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(new Error("Could not decode embedded image")); };
    img.src = url;
  });
}

function canvasToJpegBuffer(canvas, quality) {
  return new Promise(resolve => {
    canvas.toBlob(blob => blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf))), "image/jpeg", quality);
  });
}

// ---------- Core: recompress a single image XObject stream ----------

async function recompressImageStream(stream, settings) {
  const dict = stream.dict;
  const filters = filtersOf(dict);
  let bytes = stream.contents;

  const remaining = [...filters];
  while (remaining.length && (remaining[0] === "/ASCII85Decode" || remaining[0] === "/ASCIIHexDecode")) {
    const f = remaining.shift();
    bytes = f === "/ASCII85Decode" ? decodeASCII85(bytes) : decodeASCIIHex(bytes);
  }

  if (remaining.length === 1 && remaining[0] === "/DCTDecode") {
    const img = await loadImage(bytes);
    let targetW = img.width, targetH = img.height;
    if (targetW > settings.maxDimension || targetH > settings.maxDimension) {
      const scale = settings.maxDimension / Math.max(targetW, targetH);
      targetW = Math.round(targetW * scale);
      targetH = Math.round(targetH * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    canvas.getContext("2d").drawImage(img, 0, 0, targetW, targetH);
    const newBytes = await canvasToJpegBuffer(canvas, settings.quality);
    return { newBytes, width: targetW, height: targetH, filter: "DCTDecode", colorSpace: "DeviceRGB", bpc: 8 };
  }

  if (remaining.length === 1 && remaining[0] === "/FlateDecode") {
    const width = dict.get(PDFName.of("Width"))?.asNumber();
    const height = dict.get(PDFName.of("Height"))?.asNumber();
    const bpc = dict.get(PDFName.of("BitsPerComponent"))?.asNumber() || 8;
    const csObj = dict.get(PDFName.of("ColorSpace"));
    const cs = csObj ? csObj.toString() : "/DeviceRGB";

    if (!width || !height || bpc !== 8 || (cs !== "/DeviceRGB" && cs !== "/DeviceGray")) {
      return null; // unsupported combo — skip safely, leave image untouched
    }

    const raw = window.pako.inflate(bytes);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    if (cs === "/DeviceRGB") {
      for (let i = 0, j = 0; i < raw.length; i += 3, j += 4) {
        imageData.data[j] = raw[i]; imageData.data[j+1] = raw[i+1]; imageData.data[j+2] = raw[i+2]; imageData.data[j+3] = 255;
      }
    } else {
      for (let i = 0, j = 0; i < raw.length; i++, j += 4) {
        imageData.data[j] = raw[i]; imageData.data[j+1] = raw[i]; imageData.data[j+2] = raw[i]; imageData.data[j+3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    let targetCanvas = canvas;
    if (width > settings.maxDimension || height > settings.maxDimension) {
      const scale = settings.maxDimension / Math.max(width, height);
      const tw = Math.round(width * scale), th = Math.round(height * scale);
      const sc = document.createElement("canvas");
      sc.width = tw; sc.height = th;
      sc.getContext("2d").drawImage(canvas, 0, 0, tw, th);
      targetCanvas = sc;
    }
    const newBytes = await canvasToJpegBuffer(targetCanvas, settings.quality);
    return { newBytes, width: targetCanvas.width, height: targetCanvas.height, filter: "DCTDecode", colorSpace: "DeviceRGB", bpc: 8 };
  }

  return null; // unsupported filter (JPX, CCITTFax, Indexed, etc.) — skip safely
}

async function compressPdf(file, level, onProgress) {
  const settings = LEVELS[level];
  const originalBytes = await file.arrayBuffer();
  onProgress?.("Loading PDF...");
  const pdfDoc = await PDFDocument.load(originalBytes, { ignoreEncryption: true });

  let processed = 0, skipped = 0;
  const pages = pdfDoc.getPages();

  for (let p = 0; p < pages.length; p++) {
    onProgress?.(`Compressing images on page ${p + 1} of ${pages.length}...`);
    const page = pages[p];
    const resources = page.node.Resources();
    const xobjectDict = resources?.lookup(PDFName.of("XObject"));
    if (!xobjectDict) continue;

    for (const key of xobjectDict.keys()) {
      const ref = xobjectDict.get(key);
      const stream = pdfDoc.context.lookup(ref);
      if (!(stream instanceof PDFRawStream)) continue;
      const subtype = stream.dict.get(PDFName.of("Subtype"));
      if (!subtype || subtype.toString() !== "/Image") continue;

      try {
        const result = await recompressImageStream(stream, settings);
        if (!result) { skipped++; continue; }

        // Only keep the change if it's actually smaller — never make an image bigger.
        if (result.newBytes.length >= stream.contents.length) { skipped++; continue; }

        stream.dict.set(PDFName.of("Filter"), PDFName.of(result.filter));
        stream.dict.set(PDFName.of("Width"), PDFNumber.of(result.width));
        stream.dict.set(PDFName.of("Height"), PDFNumber.of(result.height));
        stream.dict.set(PDFName.of("ColorSpace"), PDFName.of(result.colorSpace));
        stream.dict.set(PDFName.of("BitsPerComponent"), PDFNumber.of(result.bpc));
        stream.dict.set(PDFName.of("Length"), PDFNumber.of(result.newBytes.length));
        stream.dict.delete(PDFName.of("DecodeParms"));
        stream.contents = result.newBytes;
        processed++;
      } catch (e) {
        console.warn(`Skipping an image that couldn't be compressed:`, e);
        skipped++;
      }
    }
  }

  onProgress?.("Saving compressed PDF...");
  const outputBytes = await pdfDoc.save({ useObjectStreams: true });

  if (processed === 0) {
    console.info(`No images were recompressed (processed: 0, skipped: ${skipped}). This PDF may have little to no compressible embedded images.`);
  }

  return new Blob([outputBytes], { type: "application/pdf" });
}

// ---------- Form submit ----------

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedFile) return;

  convertBtn.disabled = true;
  sizeSummary.classList.remove("show");
  const baseName = selectedFile.name.replace(/\.pdf$/i, "");
  const originalSize = selectedFile.size;

  try {
    setStatus("Compressing...", "loading");
    const blob = await compressPdf(selectedFile, selectedLevel, msg => setStatus(msg, "loading"));

    if (blob.size >= originalSize) {
      setStatus("This PDF is already well-optimized — compression wouldn't reduce its size further.", "error");
    } else {
      downloadBlob(blob, `${baseName}-compressed.pdf`);
      const reduction = Math.round((1 - blob.size / originalSize) * 100);
      origSizeEl.textContent = formatBytes(originalSize);
      newSizeEl.textContent = formatBytes(blob.size);
      reductionEl.textContent = `-${reduction}%`;
      sizeSummary.classList.add("show");
      setStatus("Done! Your download has started.", "success");
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Compression failed.", "error");
  } finally {
    convertBtn.disabled = false;
  }
});
