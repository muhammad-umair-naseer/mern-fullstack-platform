/**
 * Client-Side PDF Organizer Engine
 * Reorders, rotates, duplicates, and deletes pages visually, then produces a new organized PDF with pdf-lib.
 */

import { PDFDocument, degrees } from 'pdf-lib';
import { pdfjsLib, yieldToMain } from './pdfCommon';

export async function loadPdfForOrganizing(file) {
  const buf = await file.arrayBuffer();
  const pristineBytes = buf.slice(0);
  const pdfDoc = await pdfjsLib.getDocument({ data: pristineBytes }).promise;
  const numPages = pdfDoc.numPages;

  const pages = [];
  for (let i = 0; i < numPages; i++) {
    pages.push({
      id: `orig_p_${i + 1}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      originalPageIndex: i,
      pageNumber: i + 1,
      rotation: 0,
    });
  }

  return {
    pdfDoc,
    numPages,
    fileBytes: pristineBytes,
    initialPages: pages,
  };
}

export async function renderOrganizerThumbnail(pdfDoc, pageNum, canvas, rotation = 0, scale = 0.35) {
  if (!canvas || !pdfDoc) return;
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale, rotation });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
}

export async function saveOrganizedPdf(fileBytes, pageList, originalFileName, onProgress, signal) {
  if (!pageList || pageList.length === 0) {
    throw new Error('At least one page must remain in the document.');
  }

  onProgress?.({ progress: 10, message: 'Opening PDF document…' });
  await yieldToMain();

  const srcDoc = await PDFDocument.load(fileBytes.slice(0));
  if (signal?.aborted) throw new Error('Operation aborted');

  const outDoc = await PDFDocument.create();

  for (let i = 0; i < pageList.length; i++) {
    if (signal?.aborted) throw new Error('Operation aborted');
    const p = pageList[i];
    const pct = Math.round(15 + ((i + 1) / pageList.length) * 70);
    onProgress?.({ progress: pct, message: `Writing page ${i + 1} of ${pageList.length}…` });
    await yieldToMain();

    const [copiedPage] = await outDoc.copyPages(srcDoc, [p.originalPageIndex]);
    if (p.rotation) {
      const currentRot = copiedPage.getRotation().angle || 0;
      copiedPage.setRotation(degrees((currentRot + p.rotation) % 360));
    }
    outDoc.addPage(copiedPage);
  }

  onProgress?.({ progress: 90, message: 'Saving organized document…' });
  await yieldToMain();

  const outBytes = await outDoc.save();
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  const base = (originalFileName || 'document').replace(/\.pdf$/i, '');

  onProgress?.({ progress: 100, message: 'Organized PDF saved successfully!' });
  return {
    blob,
    filename: `${base}-organized.pdf`,
    pageCount: pageList.length,
  };
}
