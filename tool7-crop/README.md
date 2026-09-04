# Tool 7: PDF Crop (Client-Side)

Trims unnecessary margins or areas from PDF pages. Runs entirely in the browser — the file is never uploaded anywhere.

## Features

- **Visual crop**: drag a box directly on a live preview of the page (move the whole box, or resize from any corner).
- **Auto-trim whitespace**: one click scans the page for where the actual content starts/ends and sets the crop box to match — directly automates the "unnecessary margins" part of the brief.
- **Apply to all pages proportionally**: for multi-page PDFs, the same relative crop (as percentages of each page) is applied to every page — correctly handling documents where pages aren't all the same size (e.g. a mix of Letter and A4).
- **Non-destructive crop**: uses the PDF's `CropBox` rather than rasterizing or rewriting content. The full original content is still there in the file; the CropBox just tells viewers/printers what region to show. This is the standard, correct way to crop a PDF — instant, lossless, and keeps text selectable.
- Page navigation to preview and crop based on any page in a multi-page document.

## Setup

No build step. Serve the folder statically:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Project structure

```
index.html          Upload UI + interactive crop preview
style.css             Shared styling
app.js                Rendering, crop-box interaction, auto-detect, and crop logic
vendor/
  pdf-lib.min.js       Applies the crop (CropBox) and saves the PDF
  pdf.min.mjs           Renders page previews
  pdf.worker.min.mjs
  standard_fonts/       Font metrics for accurate preview rendering
```

## Testing performed

Tested in Node.js against a real PDF with **known, precise margins** (a black rectangle placed at an exact position on a Letter-size page, leaving deliberate margins of left=100pt, right=112pt, top=150pt, bottom=200pt), using the exact same functions from `app.js` (`detectContentBounds` and `applyInsetsToPage`, copied verbatim) run through the same pdf.js-rendering pipeline used in earlier tools, then verified with `pikepdf`/`PyMuPDF`:

1. **Auto-detect accuracy**: rendered the test page, ran the detection algorithm, and converted the result back to real-world point measurements — got left=100.0, right=112.0, top=150.0, bottom=200.0, an **exact match** to the deliberately-placed ground truth.
2. **CropBox application correctness**: applied the detected crop and confirmed, via the PDF's raw `/CropBox` entry (not just a visual check), that it matches the expected values exactly: `[100, 200, 500, 642]`. Also visually confirmed the rendered cropped page shows only the content with the whitespace fully gone.
3. **Multi-page-size correctness**: built a 2-page PDF with different page sizes (Letter and A4) and applied the same percentage-based crop to both — confirmed each page's absolute crop values scaled correctly to its own dimensions (proportional, not a fixed absolute crop that would be wrong for the differently-sized page), and that the retained text is still real, extractable text on both pages.
4. **Full pipeline via the actual `app.js` functions**: ran the real `detectContentBounds` + `applyInsetsToPage` functions (not just equivalent logic) against the ground-truth PDF end-to-end and got the exact expected `/CropBox` values.
5. **Drag/resize math stress test**: unit-tested the crop-box move/resize clamping logic against extreme inputs (dragging a handle far past the opposite edge, moving the whole box far past a page boundary) — confirmed it never produces a negative, zero, or inverted crop box in any case.

**Not independently tested here:** the actual pointer-drag DOM interactions (mouse/touch dragging the box and handles in a real browser), since that needs a real browser. The math those interactions call is proven correct in isolation (see #5). Please test dragging the box and handles in a real browser and confirm it feels smooth and behaves as expected.

## Known limitations

- Auto-trim uses a brightness threshold to distinguish content from background — works well for typical white-background documents, but may need manual adjustment (drag the box afterward) for pages with colored/textured backgrounds, since anything darker than near-white counts as "content."
- Cropping via `CropBox` is reversible/non-destructive by design (the original content is still in the file) — if a workflow specifically requires permanently removing the cropped-out content (e.g. for redaction or file-size reduction), that's a different operation than what this tool does.
