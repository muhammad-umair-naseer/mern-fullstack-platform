# Tool 4: PDF Splitter (Client-Side)

Splits one PDF into multiple smaller PDFs, bundled into a single `.zip` download for convenience. Runs entirely in the browser — the file is never uploaded anywhere; the server only serves static files.

## Split modes

- **Every page into its own PDF** — one file per page.
- **Every N pages** — groups consecutive pages into equal-sized chunks (e.g. N=5 on a 12-page PDF → 1-5, 6-10, 11-12).
- **Custom page ranges** — you specify exactly which pages go in each output file, e.g. `1-3, 5, 7-10` produces three files: pages 1-3, page 5, and pages 7-10.

Output files are named after the source file and page range, e.g. `report-pages-1-3.pdf`, `report-page-5.pdf`, all bundled into `report-split.zip`.

## Setup

No build step. Serve the folder statically:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Project structure

```
index.html          Upload UI + split mode picker
style.css             Shared styling
app.js                All split logic (runs entirely client-side)
vendor/
  pdf-lib.min.js       PDF reading/writing/splitting
  jszip.min.js          Bundles multiple output PDFs into one zip
```

## Testing performed

Tested in Node.js against a real generated 10-page PDF using `pdf-lib` and `jszip` (identical code to the browser version — both are pure JS with no browser-specific APIs for this use case), then verified every output with `PyMuPDF`:

1. **All three split modes**: "every page separate" (→ 10 single-page files), "every N pages" (N=3 → 3,3,3,1 page chunks; N=4 → 4,4,2), and "custom ranges" (`1-3,5,7-10` → three files with exactly the right pages) — verified the actual page content inside each output file matches exactly what it should contain.
2. **Error handling**: out-of-bounds ranges (`15` on a 10-page doc), inverted ranges (`5-2`), and non-numeric input (`abc`) are all caught with clear messages rather than producing broken output.
3. **Edge case — single-page PDF**: confirmed "every N pages" doesn't produce an empty or duplicate chunk when the document is smaller than N.
4. **Zip bundling**: confirmed the generated zip contains exactly the expected files with the expected names, and that each file inside the zip opens correctly with the right page count and content.
5. **Full pipeline via the actual `app.js` functions**: ran `chunkEveryN`, `splitPdf`, etc. verbatim through a `File`-shaped shim to confirm the progress-callback flow and final zip output are correct end-to-end.

**Not independently tested here:** the actual UI interactions (clicking between split-mode options, live validation feedback as you type a range) since that needs a real browser. The underlying logic each UI action calls has been proven correct against real files.

## Known limitations

- Password-protected PDFs aren't supported — the file is validated on selection and a clear message is shown if it can't be read.
- Very large PDFs or splitting into many small files will use the user's own device memory/CPU, since there's no server involved — same trade-off as the other tools in this set.
