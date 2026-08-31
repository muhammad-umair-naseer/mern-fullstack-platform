/**
 * Client-Side PDF Merger Engine
 *
 * Combines multiple PDF files into a single unified document in custom user-defined order
 * (supports whole-file sequence or arbitrary custom page-by-page plan).
 * Runs 100% in the client's browser (Zero server compute).
 *
 * Built with memory safety, non-blocking execution, and validation for large multi-page documents.
 */

import { PDFDocument } from 'pdf-lib';

/**
 * Format bytes to readable human string
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Non-blocking micro-yield to keep the browser UI smooth.
 */
function yieldToMain() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/**
 * Validates and inspects a single PDF file:
 * - Checks .pdf extension and MIME type
 * - Checks binary %PDF- magic bytes
 * - Detects password encryption
 * - Extracts page count
 */
export async function validateAndInspectPdf(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  const name = file.name || '';
  if (!/\.pdf$/i.test(name)) {
    throw new Error('Not a PDF file (must have .pdf extension).');
  }

  // Read header magic bytes
  const headerSlice = file.slice(0, 1024);
  const headerBuf = await headerSlice.arrayBuffer();
  const headerText = new TextDecoder('latin1').decode(new Uint8Array(headerBuf));

  if (!headerText.includes('%PDF-')) {
    throw new Error('Invalid or corrupted PDF file header.');
  }

  // Load document without ignoreEncryption to catch password protection upfront
  try {
    const fullBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fullBytes);
    const pageCount = doc.getPageCount();
    return {
      status: 'ok',
      pageCount,
      size: file.size,
    };
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes('encrypted')) {
      throw new Error('Password-protected — please remove password before merging.');
    }
    throw new Error(`Unable to read PDF (${err.message || 'Corrupted file'}).`);
  }
}

/**
 * Merges an ordered array of PDF entries into one document.
 */
export async function mergePdfs(validEntries, onProgress, signal) {
  if (!validEntries || validEntries.length < 2) {
    throw new Error('Please select at least 2 valid PDF documents to merge.');
  }

  if (signal?.aborted) {
    throw new Error('Merge cancelled by user.');
  }

  onProgress?.({ progress: 5, message: 'Initialising unified PDF document…' });
  await yieldToMain();

  const mergedDoc = await PDFDocument.create();
  const totalFiles = validEntries.length;
  let totalPages = 0;

  for (let i = 0; i < totalFiles; i++) {
    if (signal?.aborted) {
      throw new Error('Merge cancelled by user.');
    }

    const entry = validEntries[i];
    const percent = Math.round(5 + ((i + 1) / totalFiles) * 80);

    onProgress?.({
      progress: percent,
      currentFile: i + 1,
      totalFiles,
      message: `Merging ${entry.file.name} (${i + 1} of ${totalFiles})…`,
    });

    const fileBytes = await entry.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();

    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
      totalPages++;
    }

    // Micro-yield between documents to allow garbage collection
    await yieldToMain();
  }

  onProgress?.({ progress: 92, message: 'Optimising and saving merged document…' });
  await yieldToMain();

  const outputBytes = await mergedDoc.save({ useObjectStreams: true });
  const mergedBlob = new Blob([outputBytes], { type: 'application/pdf' });

  onProgress?.({ progress: 100, message: 'Merge complete!' });

  return {
    blob: mergedBlob,
    totalPages,
    totalSize: mergedBlob.size,
    fileCount: totalFiles,
  };
}

/**
 * Merges pages according to an arbitrary user-defined Page Plan:
 * Array of { entryId: number, pageIndex: number } in exact desired order.
 */
export async function mergePdfsByPagePlan(validEntries, pagePlan, onProgress, signal) {
  if (!validEntries || validEntries.length === 0) {
    throw new Error('No PDF documents provided.');
  }

  if (!pagePlan || pagePlan.length === 0) {
    throw new Error('Please select at least 1 page to merge.');
  }

  if (signal?.aborted) {
    throw new Error('Merge cancelled by user.');
  }

  onProgress?.({ progress: 5, message: 'Loading source PDF documents into memory…' });
  await yieldToMain();

  const mergedDoc = await PDFDocument.create();
  const loadedDocs = new Map();

  for (let i = 0; i < validEntries.length; i++) {
    const entry = validEntries[i];
    const fileBytes = await entry.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    loadedDocs.set(entry.id, srcDoc);
  }

  const totalPages = pagePlan.length;

  for (let p = 0; p < totalPages; p++) {
    if (signal?.aborted) {
      throw new Error('Merge cancelled by user.');
    }

    const { entryId, pageIndex } = pagePlan[p];
    const srcDoc = loadedDocs.get(entryId);

    if (srcDoc && pageIndex >= 0 && pageIndex < srcDoc.getPageCount()) {
      const [copiedPage] = await mergedDoc.copyPages(srcDoc, [pageIndex]);
      mergedDoc.addPage(copiedPage);
    }

    const percent = Math.round(10 + ((p + 1) / totalPages) * 80);
    onProgress?.({
      progress: percent,
      currentPage: p + 1,
      totalPages,
      message: `Merging page ${p + 1} of ${totalPages}…`,
    });

    await yieldToMain();
  }

  onProgress?.({ progress: 95, message: 'Finalising and deflating merged PDF…' });
  await yieldToMain();

  const outputBytes = await mergedDoc.save({ useObjectStreams: true });
  const mergedBlob = new Blob([outputBytes], { type: 'application/pdf' });

  onProgress?.({ progress: 100, message: 'Merge complete!' });

  return {
    blob: mergedBlob,
    totalPages,
    totalSize: mergedBlob.size,
    fileCount: validEntries.length,
  };
}

/**
 * Triggers a direct browser download of the merged PDF blob.
 */
export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
