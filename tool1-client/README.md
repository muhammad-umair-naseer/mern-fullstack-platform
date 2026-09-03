# Tool 1: PDF ↔ Word Converter (Client-Side)

**Redesigned per your requirement: all conversion now happens in the user's browser. No file is ever uploaded to a server, and the server does zero processing.** This also fixes the `WinError 2 / soffice not found` issue from the previous version — there's no LibreOffice dependency anymore at all.

## How it works

Everything runs as plain static files (`index.html`, `app.js`, `style.css`, `vendor/`). Serve them from any static host (Nginx, S3, Netlify, GitHub Pages, IIS, literally any web server) — there is no backend to run or maintain for this tool anymore.

| Direction | Library (runs in-browser) | Notes |
|---|---|---|
| PDF → DOCX | `pdf.js` (text+position extraction) + `docx` (build the .docx) | Rebuilds paragraphs by grouping text on the page by line/vertical-gap. Good for text-based PDFs. Complex multi-column layouts, tables, and scanned/image PDFs won't extract as precisely as a server-side tool — scanned PDFs need OCR first (see the PDF OCR tool). |
| DOCX → PDF | `mammoth` (docx→HTML) + `jsPDF` + `html2canvas` (HTML→PDF) | Preserves headings, bold/italic, lists, tables, links. Visual fidelity is very good for normal documents but won't be a pixel-perfect match to Word's own renderer for very complex layouts. |

All libraries are **vendored locally** in `vendor/` (pulled from npm, not loaded from a CDN), so this works fully offline once deployed and has no third-party runtime dependency.

## Setup

No build step, no install. Just serve the folder:

```bash
# any static server works, e.g.:
npx serve .
# or
python3 -m http.server 8000
```

Open the served URL in a browser. **Note:** opening `index.html` directly via `file://` may not work in all browsers because the PDF.js worker is loaded as an ES module — serve it over `http://` (even locally) to be safe.

## Project structure

```
index.html          Upload UI
style.css            Styling
app.js               All conversion logic (ES module) — runs entirely client-side
vendor/               Vendored libraries (no CDN dependency)
  mammoth.browser.min.js
  jspdf.umd.min.js
  html2canvas.min.js
  docx.umd.js
  pdf.min.mjs
  pdf.worker.min.mjs
  standard_fonts/     Font metrics used by pdf.js for accurate text positioning
```

## Testing performed

This sandbox doesn't have a real browser available to drive automated end-to-end UI tests, so testing was done at two levels:

1. **Core conversion logic** — tested directly in Node.js against real sample files, since `docx`, `mammoth`, and `pdf.js`'s text-extraction are the same isomorphic JS whether run in Node or a browser:
   - `pdf.js` text + coordinate extraction: verified against a real PDF, correct text/positions returned.
   - Paragraph-grouping heuristic: verified it correctly separates lines with real extracted coordinates.
   - `docx` library: generated a real `.docx` from extracted text and confirmed with `python-docx` that it opens correctly with the right paragraphs.
   - `mammoth`: converted a real `.docx` (with a heading, paragraph, and table) to HTML and confirmed the structure came through correctly.
2. **Library wiring** — verified, via a simulated browser global scope, that every library correctly exposes the exact global variable/function names `app.js` calls (`window.docx.Document/Packer/Paragraph/TextRun/PageBreak`, `window.mammoth.convertToHtml`, `window.jspdf.jsPDF`), so there's no typo/mismatch between the vendored files and the app code.

**Not independently tested here:** the actual `html2canvas` + `jsPDF.html()` rendering path (DOCX→PDF's final rendering step), since that requires a real browser DOM/canvas, which this environment doesn't have. This uses jsPDF's documented, standard integration pattern with html2canvas, but **please test a real DOCX→PDF conversion in an actual browser before shipping**, and let me know what you see — if the layout isn't right I can tune the rendering options (scale, margins, page width) quickly.

## Known limitations (inherent to doing this client-side)

- PDF → DOCX won't match the fidelity of a server-side tool like `pdf2docx` for complex layouts (multi-column text, tables inside PDFs, heavy graphics) — text-based single/simple-column PDFs work well.
- DOCX → PDF fidelity depends on `html2canvas`'s rendering of the HTML `mammoth` produces — very good for normal text documents, less exact for documents with complex embedded objects or unusual Word-specific formatting.
- Both conversions run on the user's device, so performance depends on their machine — very large files (100+ page PDFs, huge Word docs) may be slow or use significant memory on lower-end devices, since there's no server to offload the work to.
- Scanned/image-based PDFs produce no extractable text (this is expected — see the PDF OCR tool for those).
