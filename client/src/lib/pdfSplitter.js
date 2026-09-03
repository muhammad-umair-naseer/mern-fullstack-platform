/**
 * Client-Side PDF Splitter Engine
 * Uses pdf-lib and JSZip for in-browser splitting into individual files or custom page ranges.
 */

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { yieldToMain } from './pdfCommon';

export function parseRanges(input, totalPages) {
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
  const ranges = [];
  for (const part of parts) {
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`Invalid range format: "${part}". Use e.g. "1-3, 5, 7-10".`);
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end > totalPages || start > end) {
      throw new Error(`Range "${part}" is out of bounds (document has ${totalPages} pages).`);
    }
    ranges.push({ start, end });
  }
  if (ranges.length === 0) throw new Error('Please enter at least one valid page range.');
  return ranges;
}

export function chunkEveryN(total, n) {
  const num = parseInt(n, 10);
  if (!Number.isInteger(num) || num < 1) {
    throw new Error('Please enter a valid number of pages (1 or more).');
  }
  const ranges = [];
  for (let start = 1; start <= total; start += num) {
    ranges.push({ start, end: Math.min(start + num - 1, total) });
  }
  return ranges;
}

export function everyPageSeparate(total) {
  const ranges = [];
  for (let i = 1; i <= total; i++) {
    ranges.push({ start: i, end: i });
  }
  return ranges;
}

export async function splitPdf(file, ranges, onProgress, signal) {
  onProgress?.({ progress: 10, message: 'Loading PDF document…' });
  await yieldToMain();

  const bytes = await file.arrayBuffer();
  if (signal?.aborted) throw new Error('Operation aborted');

  const srcDoc = await PDFDocument.load(bytes);
  const baseName = file.name.replace(/\.pdf$/i, '');
  const zip = new JSZip();

  for (let i = 0; i < ranges.length; i++) {
    if (signal?.aborted) throw new Error('Operation aborted');
    const range = ranges[i];
    const pct = Math.round(10 + ((i + 1) / ranges.length) * 75);
    onProgress?.({
      progress: pct,
      message: `Creating split document ${i + 1} of ${ranges.length} (pages ${range.start}${range.start === range.end ? '' : `-${range.end}`})…`,
    });
    await yieldToMain();

    const newDoc = await PDFDocument.create();
    const indices = [];
    for (let p = range.start; p <= range.end; p++) {
      indices.push(p - 1);
    }
    const copiedPages = await newDoc.copyPages(srcDoc, indices);
    copiedPages.forEach((p) => newDoc.addPage(p));
    const outBytes = await newDoc.save();

    const label =
      range.start === range.end
        ? `${baseName}-page-${range.start}`
        : `${baseName}-pages-${range.start}-${range.end}`;
    zip.file(`${label}.pdf`, outBytes);
  }

  onProgress?.({ progress: 90, message: 'Bundling split files into zip…' });
  await yieldToMain();

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress?.({ progress: 100, message: 'Splitting complete!' });

  return {
    blob: zipBlob,
    filename: `${baseName}-split.zip`,
    count: ranges.length,
  };
}
