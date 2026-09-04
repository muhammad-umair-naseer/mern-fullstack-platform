// ============================================================
// Tool 7: PDF Crop — 100% client-side.
// Lets the user visually crop a PDF (drag a box, or auto-trim
// whitespace), then applies it via the PDF's CropBox — a
// non-destructive, viewer-respected way to crop that doesn't
// touch the underlying page content. No file is ever uploaded
// anywhere.
// ============================================================

const pdfjsLib = window.pdfjsLib;
if (pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const { PDFDocument } = window.PDFLib || {};

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");
const dropText = document.getElementById("drop-text");
const previewWrap = document.getElementById("preview-wrap");
const previewCanvas = document.getElementById("preview-canvas");
const cropBox = document.getElementById("crop-box");
const toolbar = document.getElementById("toolbar");
const scopeRow = document.getElementById("scope-row");
const applyAllCheckbox = document.getElementById("apply-all");
const cropBtn = document.getElementById("crop-btn");
const statusEl = document.getElementById("status");
const form = document.getElementById("crop-form");
const pageNav = document.getElementById("page-nav");
const pageLabel = document.getElementById("page-label");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const autoDetectBtn = document.getElementById("auto-detect-btn");
const resetCropBtn = document.getElementById("reset-crop-btn");

let selectedFile = null;
let pdfjsDoc = null;
let numPages = 0;
let currentPageNum = 1;
let currentViewport = null;

// Crop box state, stored as fractions (0-1) of the current page view —
// this is what lets the same box translate correctly across pages of
// different sizes.
let insets = { left: 0, top: 0, right: 0, bottom: 0 }; // fraction from each edge

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type || "";
}

// ---------- File load ----------

async function setSelectedFile(file) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
    setStatus("Please choose a .pdf file.", "error");
    return;
  }
  setStatus("Loading PDF...", "loading");
  try {
    if (!window.pdfjsLib) {
      throw new Error("PDF rendering library is still loading. Please check your internet connection and try again.");
    }
    const bytes = await file.arrayBuffer();
    const typedArray = new Uint8Array(bytes);
    
    const loadingTask = window.pdfjsLib.getDocument({
      data: typedArray.slice(0),
      cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
      cMapPacked: true,
    });
    
    pdfjsDoc = await loadingTask.promise;
    numPages = pdfjsDoc.numPages;
    selectedFile = file;
    currentPageNum = 1;
    insets = { left: 0, top: 0, right: 0, bottom: 0 };

    fileNameEl.textContent = file.name;
    dropText.textContent = "File selected:";
    previewWrap.style.display = "block";
    toolbar.style.display = "flex";
    scopeRow.style.display = numPages > 1 ? "flex" : "none";
    pageNav.style.display = numPages > 1 ? "flex" : "none";
    cropBtn.disabled = false;

    await renderCurrentPage();
    setStatus("Drag the box or handles to crop, or click \"Auto-trim whitespace\".", "");
  } catch (e) {
    console.error(e);
    if (e.name === "PasswordException" || (e.message && e.message.toLowerCase().includes("password"))) {
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

// ---------- Render current page + sync crop box ----------

async function renderCurrentPage() {
  const page = await pdfjsDoc.getPage(currentPageNum);
  const cardEl = document.querySelector(".card");
  const containerWidth = Math.max(280, Math.min(560, (cardEl ? cardEl.clientWidth : 560) - 48));
  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = containerWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });
  currentViewport = viewport;

  previewCanvas.width = viewport.width;
  previewCanvas.height = viewport.height;
  const ctx = previewCanvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;

  pageLabel.textContent = `Page ${currentPageNum} of ${numPages}`;
  syncCropBoxToDom();
}

function syncCropBoxToDom() {
  const w = previewCanvas.width;
  const h = previewCanvas.height;
  cropBox.style.left = `${insets.left * w}px`;
  cropBox.style.top = `${insets.top * h}px`;
  cropBox.style.width = `${Math.max(0, (1 - insets.left - insets.right) * w)}px`;
  cropBox.style.height = `${Math.max(0, (1 - insets.top - insets.bottom) * h)}px`;
}

prevPageBtn.addEventListener("click", async () => {
  if (currentPageNum > 1) { currentPageNum--; await renderCurrentPage(); }
});
nextPageBtn.addEventListener("click", async () => {
  if (currentPageNum < numPages) { currentPageNum++; await renderCurrentPage(); }
});

// ---------- Drag / resize crop box ----------

let dragMode = null; // "move" | "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | null
let dragStart = null;

function pointerDown(mode) {
  return e => {
    e.preventDefault();
    dragMode = mode;
    dragStart = {
      x: e.clientX,
      y: e.clientY,
      insets: { ...insets },
    };
    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerup", pointerUp);
    document.addEventListener("pointercancel", pointerUp);
  };
}

function pointerMove(e) {
  if (!dragMode) return;
  const w = previewCanvas.width;
  const h = previewCanvas.height;
  if (!w || !h) return;

  const dx = (e.clientX - dragStart.x) / w;
  const dy = (e.clientY - dragStart.y) / h;
  const start = dragStart.insets;
  const MIN = 0.02; // minimum box size fraction

  if (dragMode === "move") {
    let left = start.left + dx;
    let right = start.right - dx;
    let top = start.top + dy;
    let bottom = start.bottom - dy;
    
    // clamp so the box doesn't move past page edges
    if (left < 0) { right += left; left = 0; }
    if (right < 0) { left += right; right = 0; }
    if (top < 0) { bottom += top; top = 0; }
    if (bottom < 0) { top += bottom; bottom = 0; }
    insets = { left, top, right, bottom };
  } else {
    let { left, top, right, bottom } = start;
    if (dragMode.includes("w")) left = Math.min(Math.max(start.left + dx, 0), 1 - right - MIN);
    if (dragMode.includes("e")) right = Math.min(Math.max(start.right - dx, 0), 1 - left - MIN);
    if (dragMode.includes("n")) top = Math.min(Math.max(start.top + dy, 0), 1 - bottom - MIN);
    if (dragMode.includes("s")) bottom = Math.min(Math.max(start.bottom - dy, 0), 1 - top - MIN);
    insets = { left, top, right, bottom };
  }
  syncCropBoxToDom();
}

function pointerUp() {
  dragMode = null;
  document.removeEventListener("pointermove", pointerMove);
  document.removeEventListener("pointerup", pointerUp);
  document.removeEventListener("pointercancel", pointerUp);
}

cropBox.addEventListener("pointerdown", e => {
  if (e.target.dataset && e.target.dataset.handle) return;
  pointerDown("move")(e);
});

cropBox.querySelectorAll(".handle").forEach(handle => {
  handle.addEventListener("pointerdown", e => {
    e.stopPropagation();
    pointerDown(handle.dataset.handle)(e);
  });
});

// ---------- Auto-detect content bounds ----------

function detectContentBounds(imageData, width, height, threshold = 250) {
  const data = imageData.data;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];
      if (alpha < 15) continue; // transparent pixel
      const luminance = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const isBackground = luminance >= threshold;
      if (!isBackground) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) return null;

  // Add 4px breathing room so subpixel font strokes/borders are preserved
  const pad = 4;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width, maxX + 1 + pad);
  maxY = Math.min(height, maxY + 1 + pad);

  return { minX, minY, maxX, maxY };
}

autoDetectBtn.addEventListener("click", () => {
  const ctx = previewCanvas.getContext("2d");
  const w = previewCanvas.width, h = previewCanvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const bounds = detectContentBounds(imageData, w, h);

  if (!bounds) {
    setStatus("Couldn't detect any content on this page to trim to.", "error");
    return;
  }

  insets = {
    left: bounds.minX / w,
    top: bounds.minY / h,
    right: (w - bounds.maxX) / w,
    bottom: (h - bounds.maxY) / h,
  };
  syncCropBoxToDom();
  setStatus("Whitespace trimmed. Adjust the box if needed, or crop now.", "");
});

resetCropBtn.addEventListener("click", () => {
  insets = { left: 0, top: 0, right: 0, bottom: 0 };
  syncCropBoxToDom();
  setStatus("", "");
});

// ---------- Apply crop + download ----------

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

function applyInsetsToPage(page, insetsFrac) {
  const mediaBox = page.getMediaBox();
  const { x = 0, y = 0, width, height } = mediaBox;
  const rotAngle = (page.getRotation().angle % 360 + 360) % 360;

  let xMin, yMin, xMax, yMax;
  if (rotAngle === 0) {
    xMin = x + insetsFrac.left * width;
    xMax = x + width - insetsFrac.right * width;
    yMin = y + insetsFrac.bottom * height;
    yMax = y + height - insetsFrac.top * height;
  } else if (rotAngle === 90) {
    xMin = x + insetsFrac.bottom * width;
    xMax = x + width - insetsFrac.top * width;
    yMin = y + insetsFrac.right * height;
    yMax = y + height - insetsFrac.left * height;
  } else if (rotAngle === 180) {
    xMin = x + insetsFrac.right * width;
    xMax = x + width - insetsFrac.left * width;
    yMin = y + insetsFrac.top * height;
    yMax = y + height - insetsFrac.bottom * height;
  } else if (rotAngle === 270) {
    xMin = x + insetsFrac.top * width;
    xMax = x + width - insetsFrac.bottom * width;
    yMin = y + insetsFrac.left * height;
    yMax = y + height - insetsFrac.right * height;
  }

  const cropW = Math.max(1, xMax - xMin);
  const cropH = Math.max(1, yMax - yMin);
  page.setCropBox(xMin, yMin, cropW, cropH);
}

async function cropPdf(file, insetsFrac, applyToAll, targetPageIndex) {
  const bytes = await file.arrayBuffer();
  const PDFDocumentClass = window.PDFLib ? window.PDFLib.PDFDocument : PDFDocument;
  const doc = await PDFDocumentClass.load(new Uint8Array(bytes));
  const pages = doc.getPages();

  if (applyToAll) {
    pages.forEach(page => applyInsetsToPage(page, insetsFrac));
  } else {
    applyInsetsToPage(pages[targetPageIndex], insetsFrac);
  }

  const outBytes = await doc.save();
  return new Blob([outBytes], { type: "application/pdf" });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!selectedFile) return;

  const totalInset = insets.left + insets.right + insets.top + insets.bottom;
  if (totalInset < 0.001) {
    setStatus("Drag the box inward, or use \"Auto-trim whitespace\", before cropping.", "error");
    return;
  }

  cropBtn.disabled = true;
  try {
    setStatus("Cropping...", "loading");
    const applyToAll = numPages > 1 ? applyAllCheckbox.checked : true;
    const blob = await cropPdf(selectedFile, insets, applyToAll, currentPageNum - 1);
    const baseName = selectedFile.name.replace(/\.pdf$/i, "");
    downloadBlob(blob, `${baseName}-cropped.pdf`);
    setStatus("Done! Your download has started.", "success");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Crop failed.", "error");
  } finally {
    cropBtn.disabled = false;
  }
});
