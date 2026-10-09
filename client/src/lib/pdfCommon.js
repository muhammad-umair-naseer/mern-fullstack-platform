/**
 * Shared Client-Side PDF Utilities & PDF.js Worker Configuration
 */

import * as pdfjs from 'pdfjs-dist';

// The worker, fonts and image decoders are served from /vendor so no PDF work
// leaves the site. public/vendor/pdf.worker.min.mjs must match the pinned
// pdfjs-dist version exactly: copy it from node_modules/pdfjs-dist/build on upgrade.
const VENDOR = `${process.env.PUBLIC_URL || ''}/vendor`;

if (typeof window !== 'undefined') {
  try {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `${VENDOR}/pdf.worker.min.mjs`;
    }
  } catch (e) {
    console.warn('PDF.js worker initialization:', e);
  }
}

// Every PDF the tools open goes through here. isEvalSupported: false keeps
// font code from being compiled with eval (CVE-2024-4367); pdf.js 4.2.67+ no
// longer does that anyway, so this guards against a downgrade.
function getDocument(src) {
  return pdfjs.getDocument({
    ...src,
    isEvalSupported: false,
    standardFontDataUrl: `${VENDOR}/standard_fonts/`,
    wasmUrl: `${VENDOR}/pdfjs-wasm/`,
  });
}

const pdfjsLib = { ...pdfjs, getDocument };

export { pdfjsLib };

/**
 * Format bytes to readable string (e.g. 1.25 MB)
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Trigger file download directly in browser
 */
export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

/**
 * Yield to main thread to keep UI animations and progress responsive
 */
export function yieldToMain() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
