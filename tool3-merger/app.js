// ============================================================
// Tool 3: PDF Merger — 100% client-side.
// Combines multiple PDFs into one, in a user-chosen order.
// No file is ever uploaded anywhere.
// ============================================================

const { PDFDocument } = window.PDFLib;

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileList = document.getElementById("file-list");
const addMoreBtn = document.getElementById("add-more");
const reorderHint = document.getElementById("reorder-hint");
const mergeBtn = document.getElementById("merge-btn");
const statusEl = document.getElementById("status");
const form = document.getElementById("merge-form");
const dropText = document.getElementById("drop-text");
const fileNameHint = document.getElementById("file-name");

// Each entry: { id, file, status: "checking"|"ok"|"error", pageCount, errorMsg }
let entries = [];
let idCounter = 0;

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type || "";
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function validateFile(entry) {
  try {
    const bytes = await entry.file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    entry.status = "ok";
    entry.pageCount = doc.getPageCount();
  } catch (e) {
    entry.status = "error";
    entry.errorMsg = e.message.includes("encrypted")
      ? "Password-protected — remove the password first"
      : "Couldn't read this file as a PDF";
  }
  render();
}

function addFiles(fileListObj) {
  const newEntries = [...fileListObj].map(file => ({
    id: idCounter++,
    file,
    status: "checking",
    pageCount: null,
    errorMsg: null,
  }));
  entries.push(...newEntries);
  render();
  newEntries.forEach(validateFile);
  dropText.textContent = "Files selected:";
  fileNameHint.textContent = `${entries.length} file${entries.length > 1 ? "s" : ""}`;
  addMoreBtn.style.display = entries.length ? "block" : "none";
  reorderHint.style.display = entries.length > 1 ? "block" : "none";
}

function render() {
  fileList.innerHTML = "";
  entries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.id = entry.id;

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "⋮⋮";

    const info = document.createElement("div");
    info.className = "file-info";
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = `${index + 1}. ${entry.file.name}`;
    const metaSpan = document.createElement("span");
    metaSpan.className = "meta" + (entry.status === "error" ? " error" : "");
    if (entry.status === "checking") metaSpan.textContent = "Checking...";
    else if (entry.status === "ok") metaSpan.textContent = `${formatBytes(entry.file.size)} · ${entry.pageCount} page${entry.pageCount === 1 ? "" : "s"}`;
    else metaSpan.textContent = entry.errorMsg;
    info.append(nameSpan, metaSpan);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      entries = entries.filter(e => e.id !== entry.id);
      render();
      fileNameHint.textContent = `${entries.length} file${entries.length === 1 ? "" : "s"}`;
      addMoreBtn.style.display = entries.length ? "block" : "none";
      reorderHint.style.display = entries.length > 1 ? "block" : "none";
      updateMergeButton();
    });

    li.append(handle, info, removeBtn);
    fileList.appendChild(li);
  });

  attachDragHandlers();
  updateMergeButton();
}

function updateMergeButton() {
  const validCount = entries.filter(e => e.status === "ok").length;
  const stillChecking = entries.some(e => e.status === "checking");
  mergeBtn.disabled = validCount < 2 || stillChecking;
  if (entries.length > 0 && validCount < 2 && !stillChecking) {
    setStatus("Add at least 2 valid PDFs to merge.", "");
  } else {
    setStatus("", "");
  }
}

// ---------- Drag to reorder ----------

let draggedId = null;

function attachDragHandlers() {
  const items = fileList.querySelectorAll("li");
  items.forEach(li => {
    li.addEventListener("dragstart", () => {
      draggedId = Number(li.dataset.id);
      li.classList.add("dragging");
    });
    li.addEventListener("dragend", () => li.classList.remove("dragging"));
    li.addEventListener("dragover", e => {
      e.preventDefault();
      li.classList.add("drag-over");
    });
    li.addEventListener("dragleave", () => li.classList.remove("drag-over"));
    li.addEventListener("drop", e => {
      e.preventDefault();
      li.classList.remove("drag-over");
      const targetId = Number(li.dataset.id);
      if (draggedId === null || draggedId === targetId) return;

      const fromIndex = entries.findIndex(en => en.id === draggedId);
      const toIndex = entries.findIndex(en => en.id === targetId);
      const [moved] = entries.splice(fromIndex, 1);
      entries.splice(toIndex, 0, moved);
      draggedId = null;
      render();
    });
  });
}

// ---------- File input / drop zone ----------

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) addFiles(fileInput.files);
  fileInput.value = "";
});

addMoreBtn.addEventListener("click", () => fileInput.click());

["dragenter", "dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.add("dragover"); });
});
["dragleave", "drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.remove("dragover"); });
});
dropZone.addEventListener("drop", e => {
  const pdfFiles = [...e.dataTransfer.files].filter(
    f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
  );
  if (pdfFiles.length) addFiles(pdfFiles);
});

// ---------- Merge ----------

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

async function mergePdfs(validEntries, onProgress) {
  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < validEntries.length; i++) {
    const entry = validEntries[i];
    onProgress?.(`Adding ${entry.file.name} (${i + 1} of ${validEntries.length})...`);
    const bytes = await entry.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(bytes);
    const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach(page => mergedDoc.addPage(page));
  }

  onProgress?.("Saving merged PDF...");
  const bytes = await mergedDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const validEntries = entries.filter(en => en.status === "ok");
  if (validEntries.length < 2) return;

  mergeBtn.disabled = true;
  try {
    setStatus("Merging...", "loading");
    const blob = await mergePdfs(validEntries, msg => setStatus(msg, "loading"));
    downloadBlob(blob, "merged.pdf");
    setStatus(`Done! Merged ${validEntries.length} files. Your download has started.`, "success");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Merge failed.", "error");
  } finally {
    mergeBtn.disabled = false;
  }
});
