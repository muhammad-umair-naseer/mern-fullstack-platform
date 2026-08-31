# Tool 3: PDF Merger (Client-Side)

Combines multiple PDF files into one, in an order you control. Runs entirely in the browser — files are never uploaded anywhere; the server only serves static files.

## Features

- Select or drag-and-drop multiple PDFs at once
- Each file is validated immediately on add (shows page count, or a clear error if it can't be used)
- **Drag to reorder** the file list before merging — the merged PDF follows whatever order is shown
- Remove individual files from the list
- Add more files at any point before merging
- Password-protected PDFs and non-PDF/corrupt files are detected and clearly flagged rather than silently breaking the merge

## Setup

No build step. Serve the folder statically:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Project structure

```
index.html          Upload UI + reorderable file list
style.css             Shared styling
app.js                All merge logic (runs entirely client-side)
vendor/
  pdf-lib.min.js       PDF reading/writing/merging
```

## Testing performed

Tested in Node.js against real generated PDFs using `pdf-lib` (identical code to the browser version — pdf-lib is pure JS with no browser-specific APIs for this use case), then verified every output with `PyMuPDF`:

1. **Basic merge + ordering**: created 3 test PDFs with distinct page counts (2, 1, and 3 pages) and merged them in a deliberately non-alphabetical order — confirmed the output has exactly 6 pages in the correct order with the correct content on each.
2. **Images survive the merge**: merged a PDF containing an embedded photo alongside a text-only PDF — confirmed the image renders correctly (not corrupted) and the page count/order is right.
3. **Encrypted PDF handling**: found that `pdf-lib`'s `ignoreEncryption` option avoids a crash but does **not** actually decrypt the content — pages merged this way come out with garbled/empty content. Fixed by validating each file upfront with a plain (non-`ignoreEncryption`) load: encrypted files are caught and clearly flagged as "Password-protected — remove the password first" rather than being silently included as broken pages.
4. **Invalid file handling**: a non-PDF file is caught the same way and flagged "Couldn't read this file as a PDF".
5. **Reorder logic**: unit-tested the drag-and-drop reordering algorithm directly (moving an item to the front, to the end, and swapping adjacent items) — all produced the correct resulting order.
6. **Full end-to-end flow**: simulated the exact real-world scenario — 4 files added (one valid, one corrupt, one valid, one encrypted), validated in parallel, user reorders the list, then merges — confirmed only the 2 valid files were merged, in the user's chosen order, with the correct final page count and content. This uses the same functions as `app.js`, run through a browser-`File`-shaped shim.

**Not independently tested here:** the actual drag-and-drop DOM events and visual list re-rendering, since that needs a real browser. The underlying reorder algorithm they call is proven correct (see #5 above); what's untested is only the DOM event wiring around it. Please test dragging files around in a real browser and confirm the list updates as expected.

## Known limitations

- Password-protected PDFs must have the password removed before merging (this tool doesn't attempt to decrypt them — flagged clearly rather than producing broken output).
- Very many/large files will use the user's own device memory and CPU, since there's no server doing the work — expected given the client-side design, same trade-off as the other tools.
