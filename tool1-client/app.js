// ============================================================
// Tool 1: PDF <-> Word Converter — 100% client-side.
// All conversion happens in the user's browser. No file is
// ever uploaded to a server.
// ============================================================

import * as pdfjsLib from "./vendor/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdf.worker.min.mjs";

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");
const dropText = document.getElementById("drop-text");
const convertBtn = document.getElementById("convert-btn");
const statusEl = document.getElementById("status");
const form = document.getElementById("convert-form");

let selectedFile = null;

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type || "";
}

function setSelectedFile(file) {
  if (!file) return;
  const validExt = /\.(pdf|docx)$/i;
  if (!validExt.test(file.name)) {
    // Bug 6 fix: reset UI so stale filename from a previous valid file is not shown
    selectedFile = null;
    fileNameEl.textContent = "";
    dropText.textContent = "Click to choose a file, or drag & drop here";
    convertBtn.disabled = true;
    setStatus("Please choose a .pdf or .docx file.", "error");
    return;
  }
  selectedFile = file;
  fileNameEl.textContent = file.name;
  dropText.textContent = "File selected:";
  convertBtn.disabled = false;
  setStatus("", "");
}

fileInput.addEventListener("change", () => setSelectedFile(fileInput.files[0]));

["dragenter", "dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
});
["dragleave", "drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    // Bug 5 fix: only remove .dragover when the pointer truly left the drop zone.
    // dragleave fires on every child element crossing, so we check relatedTarget.
    if (evt === "dragleave" && dropZone.contains(e.relatedTarget)) return;
    dropZone.classList.remove("dragover");
  });
});
dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;
    setSelectedFile(file);
  }
});

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Bug 3 fix: revoking synchronously can kill the download before it starts
  // on some browsers (Firefox). Wait long enough for the browser to grab the data.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// ---------- PDF -> DOCX ----------

/**
 * Strip characters that pdf.js sometimes produces for non-standard font
 * encodings. These map PDF glyph IDs into Unicode Private Use Area (PUA)
 * codepoints (U+E000–U+F8FF) which have NO visible glyph in any standard
 * web / system font. Leaving them in the DOCX makes the text invisible when
 * the DOCX is later re-rendered in a browser (html2canvas) → blank PDF.
 * We also strip C0/C1 control chars and the Unicode replacement character.
 */
function sanitizeExtractedText(str) {
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "") // control chars
    .replace(/[\uE000-\uF8FF]/g, "")                          // PUA (bad font maps)
    .replace(/\uFFFD/g, "")                                    // replacement char
    .replace(/\s+/g, " ")                                      // normalise whitespace
    .trim();
}

function extractParagraphsFromItems(items) {
  const sorted = [...items].sort((a, b) => {
    const dy = b.transform[5] - a.transform[5];
    if (Math.abs(dy) > 2) return dy;
    return a.transform[4] - b.transform[4];
  });

  const lines = [];
  let currentLine = [];
  let lastY = null;

  for (const item of sorted) {
    if (!item.str.trim() && currentLine.length === 0) continue;
    const y = item.transform[5];
    if (lastY === null || Math.abs(y - lastY) <= 2) {
      currentLine.push(item);
    } else {
      // Bug 4 fix: item.height is often 0 in pdf.js. Derive font size from the
      // transform matrix scale (transform[3]) as a reliable fallback.
      const lineHeight = currentLine[0]?.height || Math.abs(currentLine[0]?.transform[3]) || 12;
      const rawText = currentLine.map(i => i.str).join(" ");
      lines.push({ y: lastY, height: lineHeight, text: sanitizeExtractedText(rawText) });
      currentLine = [item];
    }
    lastY = y;
  }
  if (currentLine.length) {
    const lineHeight = currentLine[0]?.height || Math.abs(currentLine[0]?.transform[3]) || 12;
    const rawText = currentLine.map(i => i.str).join(" ");
    lines.push({ y: lastY, height: lineHeight, text: sanitizeExtractedText(rawText) });
  }

  const paragraphs = [];
  let buffer = [];
  let prevY = null;
  let prevHeight = 12;

  for (const line of lines) {
    if (!line.text) continue;
    // Gap threshold scales with the line's font size — a gap bigger than
    // ~1.6x the line height usually signals a new paragraph/section.
    const threshold = Math.max(10, prevHeight * 1.6);
    if (prevY !== null && Math.abs(prevY - line.y) > threshold) {
      if (buffer.length) paragraphs.push(buffer.join(" "));
      buffer = [];
    }
    buffer.push(line.text);
    prevY = line.y;
    prevHeight = line.height || prevHeight;
  }
  if (buffer.length) paragraphs.push(buffer.join(" "));

  return paragraphs;
}

async function convertPdfToDocx(file, onProgress) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    standardFontDataUrl: "./vendor/standard_fonts/",
  }).promise;

  // Bug 1 fix: PageBreak is NOT a top-level export of the docx library.
  // Use pageBreakBefore:true on a Paragraph instead.
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const children = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(`Reading page ${i} of ${pdf.numPages}...`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const paragraphs = extractParagraphsFromItems(content.items);

    for (const text of paragraphs) {
      children.push(new Paragraph({ children: [new TextRun(text)], spacing: { after: 160 } }));
    }
    if (i < pdf.numPages) {
      // Bug 1 fix: insert page break via pageBreakBefore on the next page's first paragraph
      children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    }
  }

  if (children.length === 0) {
    throw new Error("No extractable text found in this PDF. Scanned/image-only PDFs need OCR first (see the PDF OCR tool).");
  }

  onProgress?.("Building .docx file...");
  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return blob;
}

// ---------- DOCX -> PDF ----------

async function convertDocxToPdf(file, onProgress) {
  onProgress?.("Reading document...");
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.convertToHtml({ arrayBuffer });

  // Log any mammoth warnings to console for diagnostics
  if (result.messages?.length) console.warn("[mammoth]", result.messages);

  // Detect blank output early — happens when the DOCX was generated from a
  // PDF with non-standard font encodings that produced PUA/invisible chars.
  // If the app's own PDF→DOCX converter was the source, those chars are now
  // stripped at extraction time, so this guard is mainly a safety net.
  const visibleText = result.value.replace(/<[^>]*>/g, "").trim();
  if (!visibleText) {
    throw new Error(
      "This document contains no readable text after conversion. " +
      "If it was produced by converting a PDF, the original PDF likely used " +
      "a non-standard font encoding — try a different source PDF or open " +
      "the Word file in Microsoft Word and re-save it before converting."
    );
  }

  // -------------------------------------------------------------------
  // ROOT CAUSE OF BLANK PDF:
  //   position:fixed + left:-99999px puts the element outside the browser
  //   viewport entirely. html2canvas only captures what is within the
  //   visible viewport area, so it returns a blank canvas.
  //
  // FIX: Use position:absolute with a very negative top. Absolute elements
  //   are NOT clipped to the viewport — html2canvas CAN capture them even
  //   when they are scrolled far off-screen. We also bypass jsPDF.html()
  //   (which is buggy with off-screen elements) and call html2canvas directly,
  //   then manually slice the canvas into A4-sized pages.
  // -------------------------------------------------------------------
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-99999px";   // off-screen vertically (safe for html2canvas)
  container.style.left = "0";
  container.style.width = "794px";    // ≈ A4 width at 96 dpi
  container.style.padding = "50px";
  container.style.boxSizing = "border-box";
  container.style.fontFamily = "Arial, Helvetica, sans-serif";
  container.style.fontSize = "14px";
  container.style.lineHeight = "1.6";
  container.style.color = "#000";
  container.style.background = "#fff";
  container.innerHTML = result.value;
  document.body.appendChild(container);

  try {
    onProgress?.("Capturing content...");

    // Render the entire HTML content to a single tall canvas
    const canvas = await window.html2canvas(container, {
      scale: 2,               // 2× for crisp text at PDF resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: 794,
      windowWidth: 794,
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("html2canvas produced an empty canvas. The document may have no renderable content.");
    }

    onProgress?.("Building PDF pages...");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

    const pdfW = pdf.internal.pageSize.getWidth();   // 595.28 pt
    const pdfH = pdf.internal.pageSize.getHeight();  // 841.89 pt
    const margin = 40;                                // pt on each side

    const contentW   = pdfW - margin * 2;            // usable width in pt
    const pxToPt     = contentW / canvas.width;      // conversion factor
    const pageSliceH = Math.floor((pdfH - margin * 2) / pxToPt); // canvas px per A4 page

    let srcY = 0;
    let firstPage = true;

    while (srcY < canvas.height) {
      const sliceH = Math.min(pageSliceH, canvas.height - srcY);

      // Copy this vertical slice into a temporary canvas
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width  = canvas.width;
      pageCanvas.height = sliceH;
      const ctx = pageCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, sliceH);
      ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.92);
      const destH   = sliceH * pxToPt;  // height in pt for this slice

      if (!firstPage) pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, margin, contentW, destH);

      srcY += sliceH;
      firstPage = false;
    }

    return pdf.output("blob");
  } finally {
    container.remove();
  }
}

// ---------- Form submit ----------

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedFile) return;

  convertBtn.disabled = true;
  convertBtn.textContent = "Converting…";
  const ext = selectedFile.name.toLowerCase().split(".").pop();
  const baseName = selectedFile.name.replace(/\.[^.]+$/, "");

  try {
    if (ext === "pdf") {
      setStatus("Converting PDF to Word...", "loading");
      const blob = await convertPdfToDocx(selectedFile, msg => setStatus(msg, "loading"));
      downloadBlob(blob, `${baseName}.docx`);
      setStatus("Done! Your download has started.", "success");
    } else if (ext === "docx") {
      setStatus("Converting Word to PDF...", "loading");
      const blob = await convertDocxToPdf(selectedFile, msg => setStatus(msg, "loading"));
      downloadBlob(blob, `${baseName}.pdf`);
      setStatus("Done! Your download has started.", "success");
    } else {
      setStatus("Unsupported file type.", "error");
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Conversion failed.", "error");
  } finally {
    // Bug 7 fix: give the browser a moment to open its save dialog before
    // re-enabling the button, so users don't accidentally start a duplicate conversion.
    setTimeout(() => {
      convertBtn.disabled = false;
      convertBtn.textContent = "Convert";
    }, 1500);
  }
});
