// ============================================================
// Tool 8: PDF Resize — 100% client-side.
// Changes the page size of a PDF, scaling the original content
// (as real vector content, not a rasterized image) into new
// page dimensions. No file is ever uploaded anywhere.
// ============================================================

const MM_TO_PT = 72 / 25.4;
const IN_TO_PT = 72;

const PRESETS = {
  a4: { width: 210 * MM_TO_PT, height: 297 * MM_TO_PT },
  letter: { width: 8.5 * IN_TO_PT, height: 11 * IN_TO_PT },
  legal: { width: 8.5 * IN_TO_PT, height: 14 * IN_TO_PT },
  a3: { width: 297 * MM_TO_PT, height: 420 * MM_TO_PT },
  a5: { width: 148 * MM_TO_PT, height: 210 * MM_TO_PT },
  tabloid: { width: 11 * IN_TO_PT, height: 17 * IN_TO_PT },
};

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");
const dropText = document.getElementById("drop-text");
const pageInfoEl = document.getElementById("page-info");
const optionsEl = document.getElementById("options");
const sizeSelect = document.getElementById("size-select");
const customDims = document.getElementById("custom-dims");
const customWidthInput = document.getElementById("custom-width");
const customHeightInput = document.getElementById("custom-height");
const orientationOptions = document.getElementById("orientation-options");
const modeOptions = document.getElementById("mode-options");
const resizeBtn = document.getElementById("resize-btn");
const statusEl = document.getElementById("status");
const form = document.getElementById("resize-form");

let selectedFile = null;
let selectedMode = "fit";
let selectedOrientation = "auto";

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type || "";
}

function getPDFLib() {
  if (window.PDFLib && window.PDFLib.PDFDocument) {
    return window.PDFLib;
  }
  throw new Error("PDF processing library is loading. Please try again in a moment.");
}

async function setSelectedFile(file) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
    setStatus("Please choose a .pdf file.", "error");
    return;
  }
  setStatus("Reading PDF...", "loading");
  try {
    const { PDFDocument } = getPDFLib();
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(new Uint8Array(bytes));
    const pageCount = doc.getPageCount();
    
    if (pageCount === 0) {
      throw new Error("This PDF has no pages.");
    }

    selectedFile = file;
    fileNameEl.textContent = file.name;
    dropText.textContent = "File selected:";
    
    const firstPage = doc.getPage(0);
    const { width: pW, height: pH } = firstPage.getSize();
    const pWMm = Math.round(pW / MM_TO_PT);
    const pHMm = Math.round(pH / MM_TO_PT);
    
    pageInfoEl.textContent = `${pageCount} page${pageCount === 1 ? "" : "s"} (e.g. Page 1 is ~${pWMm} × ${pHMm} mm)`;
    pageInfoEl.style.display = "block";
    optionsEl.style.display = "block";
    resizeBtn.disabled = false;
    setStatus("", "");
  } catch (e) {
    console.error(e);
    if (e.name === "PasswordException" || (e.message && e.message.toLowerCase().includes("password")) || (e.message && e.message.toLowerCase().includes("encrypted"))) {
      setStatus("This PDF is password-protected — remove the password first.", "error");
    } else {
      setStatus(e.message || "Couldn't read this file as a PDF.", "error");
    }
  }
}

fileInput.addEventListener("change", () => setSelectedFile(fileInput.files[0]));
["dragenter", "dragover"].forEach(evt => dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.add("dragover"); }));
["dragleave", "drop"].forEach(evt => dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.remove("dragover"); }));
dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (file) { fileInput.files = e.dataTransfer.files; setSelectedFile(file); }
});

sizeSelect.addEventListener("change", () => {
  customDims.style.display = sizeSelect.value === "custom" ? "flex" : "none";
});

if (orientationOptions) {
  orientationOptions.addEventListener("click", e => {
    const btn = e.target.closest(".mode-btn");
    if (!btn) return;
    orientationOptions.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedOrientation = btn.dataset.orient;
  });
}

modeOptions.addEventListener("click", e => {
  const btn = e.target.closest(".mode-btn");
  if (!btn) return;
  modeOptions.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedMode = btn.dataset.mode;
});

function getBaseTargetSize() {
  if (sizeSelect.value === "custom") {
    const wMm = parseFloat(customWidthInput.value);
    const hMm = parseFloat(customHeightInput.value);
    if (!wMm || !hMm || wMm <= 0 || hMm <= 0) {
      throw new Error("Enter valid custom width and height (greater than 0 mm).");
    }
    return { width: wMm * MM_TO_PT, height: hMm * MM_TO_PT };
  }
  return PRESETS[sizeSelect.value] || PRESETS.a4;
}

function computePageTargetSize(baseSize, srcW, srcH, orientationMode) {
  const minDim = Math.min(baseSize.width, baseSize.height);
  const maxDim = Math.max(baseSize.width, baseSize.height);

  if (orientationMode === "portrait") {
    return { width: minDim, height: maxDim };
  }
  if (orientationMode === "landscape") {
    return { width: maxDim, height: minDim };
  }
  // Auto mode: match source page's aspect ratio
  if (srcW > srcH) {
    return { width: maxDim, height: minDim };
  }
  return { width: minDim, height: maxDim };
}

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

async function resizePdf(file, baseTargetSize, mode, orientationMode, onProgress) {
  const { PDFDocument, degrees } = getPDFLib();
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(new Uint8Array(bytes));
  const outDoc = await PDFDocument.create();
  const srcPages = srcDoc.getPages();
  onProgress?.("Preparing pages...");
  srcPages.forEach(p => {
    if (!p.node.Contents()) {
      p.drawLine({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, thickness: 0, opacity: 0 });
    }
  });
  const embeddedPages = await outDoc.embedPages(srcPages);

  for (let i = 0; i < srcPages.length; i++) {
    onProgress?.(`Resizing page ${i + 1} of ${srcPages.length}...`);
    const srcPage = srcPages[i];
    const { width: srcW, height: srcH } = srcPage.getSize();
    const rotAngle = (srcPage.getRotation().angle % 360 + 360) % 360;

    const targetSize = computePageTargetSize(baseTargetSize, srcW, srcH, orientationMode);
    const newPage = outDoc.addPage([targetSize.width, targetSize.height]);
    if (rotAngle !== 0) {
      newPage.setRotation(degrees(rotAngle));
    }

    const embedded = embeddedPages[i];

    if (mode === "stretch") {
      const xScale = targetSize.width / srcW;
      const yScale = targetSize.height / srcH;
      newPage.drawPage(embedded, { x: 0, y: 0, xScale, yScale });
    } else {
      const scale = mode === "fill"
        ? Math.max(targetSize.width / srcW, targetSize.height / srcH)
        : Math.min(targetSize.width / srcW, targetSize.height / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const x = (targetSize.width - drawW) / 2;
      const y = (targetSize.height - drawH) / 2;
      newPage.drawPage(embedded, { x, y, xScale: scale, yScale: scale });
    }
  }

  onProgress?.("Saving...");
  const outBytes = await outDoc.save();
  return new Blob([outBytes], { type: "application/pdf" });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!selectedFile) return;

  resizeBtn.disabled = true;
  try {
    const baseTargetSize = getBaseTargetSize();
    setStatus("Resizing...", "loading");
    const blob = await resizePdf(
      selectedFile,
      baseTargetSize,
      selectedMode,
      selectedOrientation,
      msg => setStatus(msg, "loading")
    );
    const baseName = selectedFile.name.replace(/\.pdf$/i, "");
    downloadBlob(blob, `${baseName}-resized.pdf`);
    setStatus("Done! Your download has started.", "success");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Resize failed.", "error");
  } finally {
    resizeBtn.disabled = false;
  }
});
