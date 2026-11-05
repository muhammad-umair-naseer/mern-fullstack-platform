/**
 * Client-Side PDF OCR Engine
 * Uses pdfjs-dist for page rendering and Tesseract.js for in-browser Optical Character Recognition.
 */

import { createLocalOcrWorker, recognizeWithBudget } from '../../public/toolkit/src/core/ocr.js';
import { pdfjsLib, yieldToMain } from './pdfCommon';

export async function performPdfOcr(file, options = {}, onProgress, signal) {
  const { language = 'eng' } = options;

  onProgress?.({ progress: 5, message: 'Reading PDF document…' });
  await yieldToMain();

  const arrayBuffer = await file.arrayBuffer();
  if (signal?.aborted) throw new Error('Operation aborted');

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  if (numPages > 50) { await loadingTask.destroy(); throw new Error('OCR supports up to 50 pages per operation.'); }

  onProgress?.({ progress: 10, message: 'Initializing OCR Engine (Tesseract)…' });
  await yieldToMain();

  // The worker script is served from /vendor (copied from
  // node_modules/tesseract.js/dist on upgrade) instead of a blob that imports
  // it from a CDN, so the page's Content-Security-Policy needs no CDN script.
  const worker = await createLocalOcrWorker(language);
  if (signal?.aborted) {
    await worker.terminate();
    throw new Error('Operation aborted');
  }

  const results = [];
  let combinedText = '';

  try {
    for (let i = 1; i <= numPages; i++) {
      if (signal?.aborted) throw new Error('Operation aborted');

      const basePct = 15 + Math.round(((i - 1) / numPages) * 75);
      onProgress?.({ progress: basePct, message: `Rendering page ${i} of ${numPages} for OCR…` });
      await yieldToMain();

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // 2x resolution for OCR accuracy
      if (viewport.width * viewport.height > 16000000) throw new Error('Page exceeds 16 megapixels at OCR resolution.');
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      onProgress?.({ progress: basePct + Math.round(35 / numPages), message: `Recognizing text on page ${i} of ${numPages}…` });
      await yieldToMain();

      const ret = await recognizeWithBudget(worker, canvas, { signal });
      canvas.width = 0; canvas.height = 0; page.cleanup();
      const pageText = ret.data.text.trim();
      const confidence = ret.data.confidence || 0;

      results.push({
        pageNumber: i,
        text: pageText,
        confidence: Math.round(confidence),
        wordsCount: ret.data.words?.length || 0,
      });

      combinedText += (combinedText ? '\n\n--- Page ' + i + ' ---\n\n' : '--- Page 1 ---\n\n') + pageText;
    }
  } finally {
    await loadingTask.destroy();
    await worker.terminate();
  }

  onProgress?.({ progress: 100, message: 'OCR analysis complete!' });

  return {
    combinedText,
    pages: results,
    pageCount: numPages,
  };
}
