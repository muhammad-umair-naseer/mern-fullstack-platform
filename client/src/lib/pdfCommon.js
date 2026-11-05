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
  const task = pdfjs.getDocument({
    ...src,
    isEvalSupported: false,
    standardFontDataUrl: `${VENDOR}/standard_fonts/`,
    wasmUrl: `${VENDOR}/pdfjs-wasm/`,
  });
  const ready = task.promise.then(async pdf => {
    if (pdf.numPages > 200) { await task.destroy(); throw new Error('Use a PDF with at most 200 pages. Split larger documents first.'); }
    const getPage = pdf.getPage.bind(pdf);
    pdf.getPage = async number => {
      const page = await getPage(number);
      if (!page.cortexisPixelBudget) {
        const viewport = page.getViewport.bind(page);
        page.getViewport = options => {
          const view = viewport(options);
          if (!Number.isFinite(view.width * view.height) || view.width * view.height > 16000000) throw new Error('Page rendering exceeds 16 megapixels. Reduce the output scale.');
          return view;
        };
        page.cortexisPixelBudget = true;
      }
      return page;
    };
    return pdf;
  });
  Object.defineProperty(task, 'promise', { value: ready });
  return task;
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
