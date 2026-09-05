/**
 * Per-tool page titles and meta descriptions.
 *
 * Every tool page used to share one generated title, `${tool.name} — Free
 * ${category.label} Tool`, which produced sixty near-identical strings like
 * "PDF Splitter — Free PDF Tool". The <title> is the strongest single on-page
 * signal there is, and it was spending that signal on the word "Tool".
 *
 * These are written from the keyword research behind each tool's guide: the
 * phrase people actually type goes first, the differentiator second. Titles are
 * kept to roughly 45 characters because site.js appends " | Cortexis Solution
 * Hub" to every page, and Google truncates the pair somewhere near 60.
 *
 * Descriptions stay under 155 characters and each names a concrete benefit
 * rather than repeating the title. They deliberately never describe HOW the
 * processing works.
 *
 * A slug missing here falls back to the generated title, so adding a tool
 * cannot break the page — it simply gets the generic version until someone
 * writes it a real one.
 */
const TOOL_SEO = {
  'pdf-compressor': {
    title: 'Compress PDF Online Free — Reduce PDF Size',
    description:
      'Reduce PDF file size online for free. Compress to 100KB, 200KB, 500KB or 1MB for email and application portals. No sign-up, no watermark, no size limit.',
  },
  'pdf-word': {
    title: 'PDF to Word Converter — Free, No Limits',
    description:
      'Convert PDF to Word online free. Turn any PDF into an editable DOCX you can type in. No account, no watermark and no file size cap.',
  },
  'pdf-merger': {
    title: 'Merge PDF Files Online Free — Combine PDFs',
    description:
      'Combine several PDF files into one document in the order you choose. Free, unlimited, no watermark and no sign-up required.',
  },
  'pdf-splitter': {
    title: 'Split PDF Online Free — Separate PDF Pages',
    description:
      'Split a PDF into separate files or extract a page range. Free PDF splitter with no page limit, no watermark and no account needed.',
  },
  'pdf-ocr': {
    title: 'PDF OCR Free — Make a Scanned PDF Searchable',
    description:
      'Extract selectable, searchable text from scanned and image-only PDFs. Free online OCR with no sign-up and no file size limit.',
  },
  'pdf-excel': {
    title: 'PDF to Excel Free — Extract Tables to XLSX',
    description:
      'Pull tables and structured data out of a PDF into an Excel spreadsheet. Free PDF to Excel converter, no watermark, no account.',
  },
  'pdf-page-remover': {
    title: 'Delete Pages from PDF Online Free',
    description:
      'Remove unwanted pages from a PDF and keep the rest intact. Free, unlimited and no sign-up, with the result downloaded in seconds.',
  },
  'extract-pages-from-pdf': {
    title: 'Extract Pages from PDF Free — Save as New PDF',
    description:
      'Pick any pages from a PDF and save them as a brand new document. Free page extractor with no limits and no watermark.',
  },
  'pdf-jpg': {
    title: 'PDF to JPG Converter Free — And JPG to PDF',
    description:
      'Convert PDF pages into JPG images, or build a PDF from a set of JPGs. Free both ways, with no watermark and no upload limit.',
  },
  'pdf-organizer': {
    title: 'Organise PDF Pages — Reorder and Duplicate',
    description:
      'Drag PDF pages into the order you want, duplicate them or drop them. Free visual page organiser with no account required.',
  },
  'pdf-protect': {
    title: 'Password Protect a PDF Online Free',
    description:
      'Lock a PDF with a password so only the right person can open it. Free PDF encryption with no sign-up and no watermark.',
  },
  'pdf-crop': {
    title: 'Crop PDF Online Free — Trim PDF Margins',
    description:
      'Cut white space and scanner edges off every page of a PDF at once. Free PDF cropper, unlimited, no account needed.',
  },
  'pdf-rotate': {
    title: 'Rotate PDF Online Free — Fix Sideways Pages',
    description:
      'Turn PDF pages 90, 180 or 270 degrees and save them the right way up. Free, permanent rotation with no watermark.',
  },
  'pdf-flatten': {
    title: 'Flatten PDF Free — Lock Forms and Annotations',
    description:
      'Flatten form fields and annotations into fixed page content so nothing can be changed. Free PDF flattener, no sign-up.',
  },
  'make-pdf-fillable': {
    title: 'Make a PDF Fillable Free — Add Form Fields',
    description:
      'Add real text fields and checkboxes to any PDF so it can be typed into instead of printed. Free fillable PDF creator, no account.',
  },
  'pdf-resize': {
    title: 'Resize PDF Page Size Free — A4, Letter, Custom',
    description:
      'Change a PDF between A4, Letter and custom page sizes without rebuilding the document. Free PDF resizer with no limits.',
  },
  'extract-images-from-pdf': {
    title: 'Extract Images from PDF Free — Save Pictures',
    description:
      'Pull the pictures out of a PDF and save them as usable image files. Free image extractor with no watermark and no sign-up.',
  },
  'pdf-png-webp-tiff-bmp-gif': {
    title: 'PDF to PNG, WebP, TIFF, BMP and GIF — Free',
    description:
      'Export PDF pages to PNG, WebP, TIFF, BMP or GIF at full quality. Free converter, no account and no file size cap.',
  },
  'png-compressor': {
    title: 'Compress PNG Free — Keep Transparency',
    description:
      'Shrink PNG file size while transparency stays exactly as it was. Free PNG compressor with no watermark and no upload limit.',
  },
  'qr-generator': {
    title: 'Free QR Code Generator — URL, Wi-Fi, vCard',
    description:
      'Generate QR codes for a link, Wi-Fi network, contact card or plain text. Free, unlimited, no expiry and no account needed.',
  },
  'image-resizer': {
    title: 'Resize an Image Online Free — Any Dimensions',
    description:
      'Set an exact width and height, or scale by percentage, in one step. Free image resizer with no watermark and no sign-up.',
  },
  'image-cropper': {
    title: 'Crop an Image Online Free — Any Aspect Ratio',
    description:
      'Trim a picture down to the part that matters at any aspect ratio. Free online image cropper, unlimited and account-free.',
  },
  'image-enlarger': {
    title: 'Enlarge an Image Free — Upscale Low Resolution',
    description:
      'Upscale a small or low-resolution picture without it turning to mush. Free image enlarger with no watermark or sign-up.',
  },
  'colour-picker': {
    title: 'Colour Picker from Image — HEX, RGB and HSL',
    description:
      'Sample an exact colour from any image and copy it as HEX, RGB or HSL. Free colour picker, no account and no limits.',
  },
  'save-web-as-pdf': {
    title: 'Save a Webpage as PDF Free — Printable Copy',
    description:
      'Turn any webpage into a clean, printable PDF you can keep. Free web to PDF converter with no watermark and no sign-up.',
  },
};

/** Title and description for a tool, or null when it has none written yet. */
export const toolSeo = (slug) => TOOL_SEO[slug] || null;

export default TOOL_SEO;
