# Tool 2: PDF Compressor (Client-Side)

Reduces a PDF's file size by **recompressing only its embedded raster images** (photos, scans, screenshots — the usual cause of bloated PDFs), while leaving vector text and graphics completely untouched. Text stays crisp, sharp, and selectable — exactly matching the brief ("PDF ka file size kam karta hai while trying to preserve quality").

Runs entirely in the browser. No file is ever uploaded anywhere; the server only serves static files.

## Why images-only, not whole-page rasterization

A common (but low-quality) way to build a "PDF compressor" is to render every page to a low-res image and rebuild the PDF from those images. That approach destroys selectable/searchable text and often doesn't even save space on text-heavy pages. Instead, this tool:

1. Opens the PDF's internal structure directly (via `pdf-lib`).
2. Finds every embedded image object on every page.
3. Decodes each one (handling the common real-world filter combinations: plain `DCTDecode` JPEGs, JPEGs wrapped in `ASCII85Decode`/`ASCIIHexDecode`, and raw `FlateDecode` RGB/Grayscale bitmaps).
4. Re-encodes it as a smaller JPEG (downscaled if it's larger than the level's max dimension, and re-compressed at the level's quality setting).
5. Replaces just that image's data in place — the surrounding page content (text, vectors, layout) is never touched.
6. If a recompressed image would end up *larger* than the original (can happen with already-optimized images), the original is kept instead — compression never makes a file bigger.

Any image filter type this tool doesn't recognize (JPEG2000, CCITT Fax scans, indexed color) is safely left untouched rather than risking a corrupted file.

## Compression levels

| Level | JPEG quality | Max image dimension | Use for |
|---|---|---|---|
| Low | 80% | 2000px | Preserve maximum quality, modest size reduction |
| Medium (default) | 60% | 1400px | Good balance for most documents |
| High | 40% | 1000px | Smallest file size, still visually solid |

## Setup

No build step. Serve the folder statically:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Project structure

```
index.html          Upload UI + compression level picker
style.css             Shared styling
app.js                All compression logic (runs entirely client-side)
vendor/
  pdf-lib.min.js       PDF structure reading/writing
  pako.min.js           DEFLATE decompression (for raw bitmap images)
```

## Testing performed

Tested thoroughly in Node.js against real generated PDFs before writing the browser version, using `pdf-lib` + `pako` (identical to the browser code) plus Node's `canvas` package (implements the same Canvas API the browser provides), then verified every output PDF with `pikepdf`/`PyMuPDF`:

1. **Basic compression**: built a test PDF with a large, detailed 1600×1200 photo (encoded as ASCII85+DCTDecode, the real-world combination LibreOffice/reportlab commonly produce) plus a text-only page. Compressed it — 95%+ size reduction, verified the resulting image renders correctly with matching colors (checked exact pixel values against the source at multiple points), and confirmed the text page's text is still real, extractable text (not rasterized).
2. **Multi-image correctness** (this caught a real bug before shipping): initially matched extracted images back to their PDF objects by array-index order, which isn't guaranteed to line up on pages with multiple images. Rebuilt to read images directly from `pdf-lib`'s XObject dictionary as the source of truth (own ASCII85/Flate decoders, no separate extraction library to get out of sync with). Verified with a two-image test page (distinct solid red and blue squares) that each image keeps its correct color/position after compression — no swapping.
3. **Edge cases**: a PDF with zero images (doesn't error, still saves cleanly with minor structural savings); a small 50×50 image (confirmed it does *not* get upscaled — the max-dimension limit only ever downscales).
4. **All three compression levels**: ran Low/Medium/High against the same test PDF — 64% / 88% / 96% reduction respectively — and visually confirmed image quality degrades sensibly (still clearly recognizable even at High).
5. **Never-larger-than-original guarantee**: verified the size check that discards a "compressed" image if it would end up bigger than the original.

**Not independently tested here:** the exact browser `Image`/`Blob URL` decode path (this environment doesn't have a real browser), though this is standard, well-established browser API usage. Everything upstream and downstream of that one step — the PDF structure manipulation, the filter decoding, the compression levels, the size-safety guarantee — was tested against real files with the same underlying libraries the browser will run. Please do a real-browser test pass and let me know what you see.

## Known limitations

- Only recompresses images using `DCTDecode` (JPEG, optionally ASCII-wrapped) or plain 8-bit RGB/Grayscale `FlateDecode`. Other formats (JPEG2000, CCITT Fax scanned-fax images, indexed/palette color, CMYK) are left as-is rather than risking corruption — these are less common in typical documents.
- Vector graphics, fonts, and embedded non-image objects are never modified — this tool only targets raster images, since those are almost always what makes a PDF unnecessarily large.
- A PDF that's already well-optimized (little to no compressible image data) may see little or no size reduction — the tool will tell the user this rather than producing a larger file.
