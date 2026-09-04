# Tool 8: PDF Resize (Client-Side)

Changes the page size/layout of a PDF — fit it to a standard size (A4, Letter, Legal, A3, A5, Tabloid) or a custom size, with control over how the original content should fit the new dimensions. Runs entirely in the browser — the file is never uploaded anywhere.

## How it's different from PDF Crop

Crop only changes the *visible boundary* of a page (via `CropBox`) — the content itself never moves or scales. Resize actually **scales the original page content** into new page dimensions, producing pages of a genuinely different size. This uses `pdf-lib`'s page-embedding technique: each original page is embedded as a reusable object, then drawn onto a new page at the size/position needed — so the content stays real, scaled vector content (fonts stay selectable, lines stay sharp), not a rasterized image.

## Fit modes

| Mode | Behavior |
|---|---|
| **Fit** (default) | Scales content to fit entirely within the new page, preserving aspect ratio. May add white borders (letterboxing) if the aspect ratios differ. Nothing is ever cropped. |
| **Fill** | Scales content to completely cover the new page, preserving aspect ratio. No white borders, but content may overflow the edges and get cropped. |
| **Stretch** | Scales width and height independently to exactly match the new page size. No borders, no cropping, but the aspect ratio can be distorted. |

## Setup

No build step. Serve the folder statically:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Project structure

```
index.html          Upload UI + size/mode picker
style.css             Shared styling
app.js                Resize logic (runs entirely client-side)
vendor/
  pdf-lib.min.js       Page embedding, scaling, and PDF generation
```

## Testing performed

Tested in Node.js using the exact `resizePdf` function and preset size table from `app.js` (copied verbatim, not just equivalent logic), verified with `PyMuPDF`:

1. **All 6 presets × all 3 modes (18 combinations)**: generated every combination against a real test PDF and confirmed each output PDF's actual page dimensions exactly match the expected point values for that preset (e.g. A4 → 595.28 × 841.89pt, Legal → 612 × 1008pt) — all 18 passed exactly.
2. **Positioning/scaling correctness**: built a test PDF with a full-bleed red background and a distinctive blue marker square in one corner, resized Letter → A4 in all three modes, and precisely measured pixel boundaries in the rendered output (not just eyeballing):
   - **Fit**: confirmed the content is centered with equal margins on the constrained axis (measured 50px vs 51px — equal within a pixel of rounding) and touches the page edge exactly on the unconstrained axis, with the corner marker landing exactly where the scaled content's corner should be.
   - **Fill**: confirmed content fully covers the page with cropped overflow, aspect ratio preserved.
   - **Stretch**: confirmed content fills the page exactly edge-to-edge with no borders.
3. **Multi-page, mixed source sizes**: built a 2-page PDF with page 1 at Letter size and page 2 at A4 size, resized both to Legal — confirmed both output pages are exactly the same target size, and that the text on each page is still real, extractable text (not rasterized) after scaling.
4. **Custom size conversion**: verified the mm→point conversion math (100mm × 150mm → 283.46pt × 425.20pt) is exact.
5. **Script-loading cross-check**: given a real bug was found in an earlier tool where `app.js` referenced a global that `index.html` never actually loaded via `<script>`, specifically re-verified that every `window.*` reference in this tool's `app.js` has a corresponding script tag in `index.html` before considering this done.

**Not independently tested here:** the actual UI interactions (selecting presets/modes, typing custom dimensions) in a real browser, since that needs a real browser. The logic every one of those interactions calls is proven correct against real files above.

## Known limitations

- "Fit" and "Fill" always center the content on the new page — there's no option to anchor to a corner or edge instead.
- No automatic rotation to better match a very differently-oriented target (e.g. portrait source into a landscape target) — the content will simply be scaled down more in "Fit" mode to accommodate the orientation mismatch. Combine with a rotate step first if a different orientation is needed.
