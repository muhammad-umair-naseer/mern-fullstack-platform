import { PdfBuilder } from './pdf/pdfkit.js';
export async function openRenderedPdf(bytes) {
  const pdfjs = await import('/vendor/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.mjs';
  const task = pdfjs.getDocument({ data: bytes, isEvalSupported: false, standardFontDataUrl: '/vendor/standard_fonts/', wasmUrl: '/vendor/pdfjs-wasm/' });
  const pdf = await task.promise;
  pdf.destroy = () => task.destroy();
  return pdf;
}
export async function renderPdfPage(pdf, index, scale = 1.5) {
  const page = await pdf.getPage(index + 1), view = page.getViewport({ scale });
  if (view.width * view.height > 16000000) throw new Error('Page exceeds the 16 megapixel rendering limit.');
  const canvas = document.createElement('canvas'); canvas.width = Math.ceil(view.width); canvas.height = Math.ceil(view.height);
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: view, background: 'white' }).promise;
  page.cleanup(); return canvas;
}
export async function rasterRedact(pdf, marks, { signal, progress } = {}) {
  if (pdf.numPages > 100) throw new Error('Redaction is limited to 100 pages per operation.');
  if (![...marks.values()].some(rects => rects.length)) throw new Error('Mark at least one region.');
  const builder = new PdfBuilder({ margins: 0 });
  let totalPixels = 0;
  for (let index = 0; index < pdf.numPages; index++) {
    if (signal?.aborted) throw new Error('Cancelled');
    const page = await pdf.getPage(index + 1), view = page.getViewport({ scale: 1 });
    totalPixels += view.width * view.height * 2.25;
    if (totalPixels > 48000000) throw new Error('Redaction exceeds 48 million total page pixels. Split the document into smaller batches.');
    const canvas = await renderPdfPage(pdf, index);
    try {
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#000000';
      for (const r of marks.get(index) || []) {
        if (![r.x,r.y,r.w,r.h].every(Number.isFinite) || r.w <= 0 || r.h <= 0 || r.x < 0 || r.y < 0 || r.x + r.w > 1.001 || r.y + r.h > 1.001) throw new Error('Invalid redaction region');
        const x = Math.max(0, Math.floor(r.x * canvas.width) - 2), y = Math.max(0, Math.floor(r.y * canvas.height) - 2);
        const right = Math.min(canvas.width, Math.ceil((r.x + r.w) * canvas.width) + 2), bottom = Math.min(canvas.height, Math.ceil((r.y + r.h) * canvas.height) + 2);
        ctx.fillRect(x, y, right - x, bottom - y);
      }
      // Only already-redacted pixels enter this fresh PDF; no original objects.
      builder.newPage([view.width, view.height]);
      await builder.image({ rgba: ctx.getImageData(0,0,canvas.width,canvas.height).data, width: canvas.width, height: canvas.height }, { width: view.width, height: view.height, spaceAfter: 0 });
      progress?.(index + 1, pdf.numPages);
    } finally { canvas.width = 0; canvas.height = 0; }
  }
  if (signal?.aborted) throw new Error('Cancelled');
  return builder.finish({ title: 'Redacted document' });
}
