// ============================================================
// Tool 4: PDF Splitter — 100% client-side.
// Splits one PDF into multiple smaller PDFs, bundled into a zip.
// No file is ever uploaded anywhere.
// ============================================================

const { PDFDocument } = window.PDFLib;

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");
const dropText = document.getElementById("drop-text");
const pageInfoEl = document.getElementById("page-info");
const modeSection = document.getElementById("mode-section");
const splitBtn = document.getElementById("split-btn");
const statusEl = document.getElementById("status");
const form = document.getElementById("split-form");
const everyNInput = document.getElementById("every-n-input");
const rangesInput = document.getElementById("ranges-input");

let selectedFile = null;
let totalPages = null;
let selectedMode = "each";

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type || "";
}

async function setSelectedFile(file) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name)) {
    setStatus("Please choose a .pdf file.", "error");
    return;
  }
  setStatus("Reading PDF...", "loading");
  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    totalPages = doc.getPageCount();
    selectedFile = file;
    fileNameEl.textContent = file.name;
    dropText.textContent = "File selected:";
    pageInfoEl.textContent = `${totalPages} page${totalPages === 1 ? "" : "s"}`;
    pageInfoEl.style.display = "block";
    modeSection.style.display = "block";
    splitBtn.disabled = false;
    setStatus("", "");
  } catch (e) {
    setStatus(e.message.includes("encrypted") ? "This PDF is password-protected — remove the password first." : "Couldn't read this file as a PDF.", "error");
  }
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

document.querySelectorAll(".mode-option").forEach(opt => {
  opt.addEventListener("click", () => {
    document.querySelectorAll(".mode-option").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    opt.querySelector('input[type="radio"]').checked = true;
    selectedMode = opt.dataset.mode;
  });
});

// ---------- Range logic ----------

function parseRanges(input, totalPages) {
  const parts = input.split(",").map(s => s.trim()).filter(Boolean);
  const ranges = [];
  for (const part of parts) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(`Invalid range: "${part}"`);
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end > totalPages || start > end) {
      throw new Error(`Range "${part}" is out of bounds (document has ${totalPages} pages)`);
    }
    ranges.push({ start, end });
  }
  if (ranges.length === 0) throw new Error("Enter at least one page range.");
  return ranges;
}

function chunkEveryN(total, n) {
  if (!Number.isInteger(n) || n < 1) throw new Error("Enter a valid number of pages (1 or more).");
  const ranges = [];
  for (let start = 1; start <= total; start += n) {
    ranges.push({ start, end: Math.min(start + n - 1, total) });
  }
  return ranges;
}

function everyPageSeparate(total) {
  const ranges = [];
  for (let i = 1; i <= total; i++) ranges.push({ start: i, end: i });
  return ranges;
}

function getRangesForMode() {
  if (selectedMode === "each") return everyPageSeparate(totalPages);
  if (selectedMode === "everyN") return chunkEveryN(totalPages, parseInt(everyNInput.value, 10));
  if (selectedMode === "ranges") return parseRanges(rangesInput.value, totalPages);
  throw new Error("Unknown split mode.");
}

// ---------- Split + zip ----------

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

async function splitPdf(file, ranges, onProgress) {
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes);
  const baseName = file.name.replace(/\.pdf$/i, "");
  const zip = new window.JSZip();

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    onProgress?.(`Creating file ${i + 1} of ${ranges.length}...`);
    const newDoc = await PDFDocument.create();
    const indices = [];
    for (let p = range.start; p <= range.end; p++) indices.push(p - 1);
    const pages = await newDoc.copyPages(srcDoc, indices);
    pages.forEach(p => newDoc.addPage(p));
    const outBytes = await newDoc.save();

    const label = range.start === range.end
      ? `${baseName}-page-${range.start}`
      : `${baseName}-pages-${range.start}-${range.end}`;
    zip.file(`${label}.pdf`, outBytes);
  }

  onProgress?.("Building zip file...");
  return await zip.generateAsync({ type: "blob" });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!selectedFile) return;

  splitBtn.disabled = true;
  try {
    const ranges = getRangesForMode();
    setStatus(`Splitting into ${ranges.length} file${ranges.length === 1 ? "" : "s"}...`, "loading");
    const zipBlob = await splitPdf(selectedFile, ranges, msg => setStatus(msg, "loading"));
    const baseName = selectedFile.name.replace(/\.pdf$/i, "");
    downloadBlob(zipBlob, `${baseName}-split.zip`);
    setStatus(`Done! ${ranges.length} file${ranges.length === 1 ? "" : "s"} created. Your download has started.`, "success");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Split failed.", "error");
  } finally {
    splitBtn.disabled = false;
  }
});
