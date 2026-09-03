/**
 * Shared Client-Side PDF Utilities & PDF.js Worker Configuration
 */

import * as pdfjsLib from 'pdfjs-dist';

// Ensure PDF.js worker is properly configured
if (typeof window !== 'undefined') {
  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  } catch (e) {
    console.warn('PDF.js worker initialization:', e);
  }
}

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
