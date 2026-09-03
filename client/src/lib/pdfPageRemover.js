/**
 * Client-Side PDF Page Remover Engine
 * Removes selected pages and outputs a clean revised PDF with pdf-lib.
 */

import { PDFDocument } from 'pdf-lib';
import { pdfjsLib, yieldToMain } from './pdfCommon';

export async function loadPdfForRemoval(file) {
  const buf = await file.arrayBuffer();
  const pristineBytes = buf.slice(0);
  const pdfDoc = await pdfjsLib.getDocument({ data: pristineBytes }).promise;
  return {
    pdfDoc,
    numPages: pdfDoc.numPages,
    fileBytes: pristineBytes,
  };
}

export async function removePagesFromPdf(fileBytes, removedPageIndices, totalPages, originalFileName, onProgress, signal) {
  const keepIndices = [];
  for (let i = 0; i < totalPages; i++) {
    if (!removedPageIndices.has(i)) {
      keepIndices.push(i);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('Cannot delete all pages — at least one page must remain.');
  }

  onProgress?.({ progress: 15, message: 'Opening PDF document…' });
  await yieldToMain();

  const srcDoc = await PDFDocument.load(fileBytes.slice(0));
  if (signal?.aborted) throw new Error('Operation aborted');

  const outDoc = await PDFDocument.create();

  onProgress?.({ progress: 45, message: `Extracting ${keepIndices.length} remaining pages…` });
  await yieldToMain();

  const copiedPages = await outDoc.copyPages(srcDoc, keepIndices);
  copiedPages.forEach((p) => outDoc.addPage(p));

  onProgress?.({ progress: 85, message: 'Saving revised PDF document…' });
  await yieldToMain();

  const outBytes = await outDoc.save();
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  const base = (originalFileName || 'document').replace(/\.pdf$/i, '');

  onProgress?.({ progress: 100, message: 'Pages removed successfully!' });
  return {
    blob,
    filename: `${base}-removed.pdf`,
    remainingCount: keepIndices.length,
    removedCount: removedPageIndices.size,
  };
}
