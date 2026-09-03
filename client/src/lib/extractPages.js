/**
 * Client-Side Extract Pages from PDF Engine
 * Uses pdf-lib for extraction and pdfjs-dist for client-side thumbnail rendering.
 */

import { PDFDocument } from 'pdf-lib';
import { pdfjsLib, yieldToMain } from './pdfCommon';

export async function loadPdfForExtraction(file) {
  const buf = await file.arrayBuffer();
  const pristineBytes = buf.slice(0);
  const pdfDoc = await pdfjsLib.getDocument({ data: pristineBytes }).promise;
  return {
    pdfDoc,
    numPages: pdfDoc.numPages,
    fileBytes: pristineBytes,
  };
}

export async function renderPageThumbnail(pdfDoc, pageNum, canvas, scale = 0.35) {
  if (!canvas) return;
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
}

export function parseRangeString(str, max) {
  const out = new Set();
  str.split(',').forEach((part) => {
    const p = part.trim();
    if (!p) return;
    const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let a = parseInt(m[1], 10);
      let b = parseInt(m[2], 10);
      if (a > b) [a, b] = [b, a];
      for (let i = a; i <= b; i++) {
        if (i >= 1 && i <= max) out.add(i);
      }
    } else if (/^\d+$/.test(p)) {
      const n = parseInt(p, 10);
      if (n >= 1 && n <= max) out.add(n);
    }
  });
  return out;
}

export async function extractPagesToPdf(fileBytes, selectedPageNumbers, originalFileName, onProgress, signal) {
  onProgress?.({ progress: 15, message: 'Opening PDF document…' });
  await yieldToMain();

  const srcDoc = await PDFDocument.load(fileBytes.slice(0));
  if (signal?.aborted) throw new Error('Operation aborted');

  const outDoc = await PDFDocument.create();
  const sorted = Array.from(selectedPageNumbers).sort((a, b) => a - b);
  const zeroIndexed = sorted.map((p) => p - 1);

  onProgress?.({ progress: 40, message: `Extracting ${sorted.length} selected pages…` });
  await yieldToMain();

  const copied = await outDoc.copyPages(srcDoc, zeroIndexed);
  copied.forEach((pg) => outDoc.addPage(pg));

  onProgress?.({ progress: 80, message: 'Saving new PDF document…' });
  await yieldToMain();

  const outBytes = await outDoc.save();
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  const base = (originalFileName || 'document').replace(/\.pdf$/i, '');

  onProgress?.({ progress: 100, message: 'Pages extracted successfully!' });
  return {
    blob,
    filename: `${base}-extracted.pdf`,
    pageCount: sorted.length,
  };
}
