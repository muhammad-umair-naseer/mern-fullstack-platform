import { createRenderSandbox } from './safeHtml';

/**
 * Client-Side PDF <-> Word Converter
 * 100% in-browser processing using pdfjs-dist, docx, mammoth, html2canvas, and jspdf.
 */

import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { pdfjsLib, yieldToMain } from './pdfCommon';

/**
 * Lazy load docx library (from local vendor or CDN) to avoid bundler super() Babel compilation issues
 */
async function getDocx() {
  if (typeof window !== 'undefined' && window.docx?.Document) {
    return window.docx;
  }
  if (!window._docxLoadingPromise) {
    window._docxLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = (process.env.PUBLIC_URL || '') + '/vendor/docx.umd.js';
      script.onload = () => {
        if (window.docx) resolve(window.docx);
        else reject(new Error('docx library failed to expose global'));
      };
      script.onerror = () => reject(new Error('docx library failed to load'));
      document.head.appendChild(script);
    });
  }
  return window._docxLoadingPromise;
}

function sanitizeExtractedText(str) {
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/[\uE000-\uF8FF]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractParagraphsFromItems(items) {
  const sorted = [...items].sort((a, b) => {
    const dy = b.transform[5] - a.transform[5];
    if (Math.abs(dy) > 2) return dy;
    return a.transform[4] - b.transform[4];
  });

  const lines = [];
  let currentLine = [];
  let lastY = null;

  for (const item of sorted) {
    if (!item.str.trim() && currentLine.length === 0) continue;
    const y = item.transform[5];
    if (lastY === null || Math.abs(y - lastY) <= 2) {
      currentLine.push(item);
    } else {
      const lineHeight = currentLine[0]?.height || Math.abs(currentLine[0]?.transform[3]) || 12;
      const rawText = currentLine.map((i) => i.str).join(' ');
      lines.push({ y: lastY, height: lineHeight, text: sanitizeExtractedText(rawText) });
      currentLine = [item];
    }
    lastY = y;
  }
  if (currentLine.length) {
    const lineHeight = currentLine[0]?.height || Math.abs(currentLine[0]?.transform[3]) || 12;
    const rawText = currentLine.map((i) => i.str).join(' ');
    lines.push({ y: lastY, height: lineHeight, text: sanitizeExtractedText(rawText) });
  }

  const paragraphs = [];
  let buffer = [];
  let prevY = null;
  let prevHeight = 12;

  for (const line of lines) {
    if (!line.text) continue;
    const threshold = Math.max(10, prevHeight * 1.6);
    if (prevY !== null && Math.abs(prevY - line.y) > threshold) {
      if (buffer.length) paragraphs.push(buffer.join(' '));
      buffer = [];
    }
    buffer.push(line.text);
    prevY = line.y;
    prevHeight = line.height || prevHeight;
  }
  if (buffer.length) paragraphs.push(buffer.join(' '));

  return paragraphs;
}

export async function convertPdfToDocx(file, onProgress, signal) {
  onProgress?.({ progress: 5, message: 'Loading docx & reading PDF document…' });
  await yieldToMain();

  const [docxLib, arrayBuffer] = await Promise.all([
    getDocx(),
    file.arrayBuffer(),
  ]);

  const { Document, Packer, Paragraph, TextRun } = docxLib;

  if (signal?.aborted) throw new Error('Operation aborted');

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const children = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    if (signal?.aborted) throw new Error('Operation aborted');
    const pct = Math.round(10 + (i / pdf.numPages) * 70);
    onProgress?.({ progress: pct, message: `Extracting text from page ${i} of ${pdf.numPages}…` });
    await yieldToMain();

    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const paragraphs = extractParagraphsFromItems(content.items);

    for (const text of paragraphs) {
      children.push(
        new Paragraph({
          children: [new TextRun(text)],
          spacing: { after: 160 },
        })
      );
    }
    if (i < pdf.numPages) {
      children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    }
  }

  if (children.length === 0) {
    throw new Error(
      'No extractable text found in this PDF. Scanned/image-only PDFs need OCR first (see our PDF OCR tool).'
    );
  }

  onProgress?.({ progress: 88, message: 'Packaging editable .docx document…' });
  await yieldToMain();

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  onProgress?.({ progress: 100, message: 'Conversion completed successfully!' });

  return blob;
}

export async function convertDocxToPdf(file, onProgress, signal) {
  onProgress?.({ progress: 10, message: 'Reading Word document…' });
  await yieldToMain();

  const arrayBuffer = await file.arrayBuffer();
  if (signal?.aborted) throw new Error('Operation aborted');

  const result = await mammoth.convertToHtml({ arrayBuffer });
  const visibleText = result.value.replace(/<[^>]*>/g, '').trim();

  if (!visibleText) {
    throw new Error(
      'This Word document contains no readable text content to convert.'
    );
  }

  onProgress?.({ progress: 30, message: 'Formatting document layout…' });
  await yieldToMain();

  const sandbox = await createRenderSandbox(result.value, 794);
  const container = sandbox.container;
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '794px'; // A4 width at 96 dpi
  container.style.padding = '50px';
  container.style.boxSizing = 'border-box';
  container.style.fontFamily = 'Arial, Helvetica, sans-serif';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.6';
  container.style.color = '#000';
  container.style.background = '#fff';


  try {
    onProgress?.({ progress: 50, message: 'Rendering pages…' });
    await yieldToMain();

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Could not render document canvas.');
    }

    onProgress?.({ progress: 75, message: 'Generating PDF pages…' });
    await yieldToMain();

    const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const margin = 40;

    const contentW = pdfW - margin * 2;
    const pxToPt = contentW / canvas.width;
    const pageSliceH = Math.floor((pdfH - margin * 2) / pxToPt);

    let srcY = 0;
    let firstPage = true;

    while (srcY < canvas.height) {
      if (signal?.aborted) throw new Error('Operation aborted');
      const sliceH = Math.min(pageSliceH, canvas.height - srcY);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceH;
      const ctx = pageCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, sliceH);
      ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
      const destH = sliceH * pxToPt;

      if (!firstPage) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, margin, contentW, destH);

      srcY += sliceH;
      firstPage = false;
    }

    onProgress?.({ progress: 100, message: 'PDF generated successfully!' });
    return pdf.output('blob');
  } finally {
    sandbox.remove();
  }
}
