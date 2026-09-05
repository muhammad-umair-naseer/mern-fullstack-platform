/**
 * Client-Side PDF <-> JPG Converter Engine
 * Converts PDF pages to high-resolution JPG images and converts JPG/PNG images back to PDF.
 */

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { pdfjsLib, yieldToMain } from './pdfCommon';

export async function convertPdfToJpg(file, options = {}, onProgress, signal) {
  const { quality = 0.92, scale = 2.0 } = options;

  onProgress?.({ progress: 5, message: 'Reading PDF document…' });
  await yieldToMain();

  const arrayBuffer = await file.arrayBuffer();
  if (signal?.aborted) throw new Error('Operation aborted');

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const baseName = file.name.replace(/\.pdf$/i, '');
  const images = [];

  for (let i = 1; i <= numPages; i++) {
    if (signal?.aborted) throw new Error('Operation aborted');
    const pct = Math.round(10 + (i / numPages) * 75);
    onProgress?.({ progress: pct, message: `Rendering page ${i} of ${numPages} to JPG…` });
    await yieldToMain();

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    // Fill white background before rendering to avoid dark background on transparent pages
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

    images.push({
      pageNumber: i,
      name: `${baseName}-page-${i}.jpg`,
      blob,
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
    });
  }

  if (numPages === 1) {
    onProgress?.({ progress: 100, message: 'Image converted successfully!' });
    return {
      type: 'single',
      blob: images[0].blob,
      filename: images[0].name,
      images,
    };
  }

  onProgress?.({ progress: 90, message: 'Packaging images into zip file…' });
  await yieldToMain();

  const zip = new JSZip();
  images.forEach((img) => zip.file(img.name, img.blob));
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  onProgress?.({ progress: 100, message: 'Conversion completed!' });
  return {
    type: 'zip',
    blob: zipBlob,
    filename: `${baseName}-images.zip`,
    images,
  };
}

/**
 * Repaint an image the PDF format cannot carry directly into PNG bytes.
 *
 * PDF supports JPEG and PNG image streams only. WebP, and anything else the
 * picker lets through, has to be decoded and re-encoded before it can be
 * embedded. PNG is the target rather than JPEG so an image with transparency
 * keeps it.
 */
async function toPngBytes(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`Could not read ${file.name}. Try a JPG or PNG.`));
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error(`Could not convert ${file.name}. Try a JPG or PNG.`);
    return await blob.arrayBuffer();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function convertJpgToPdf(imageFiles, onProgress, signal) {
  if (!imageFiles || imageFiles.length === 0) {
    throw new Error('Please select at least one image file.');
  }

  onProgress?.({ progress: 10, message: 'Initializing PDF document…' });
  await yieldToMain();

  const doc = await PDFDocument.create();

  for (let i = 0; i < imageFiles.length; i++) {
    if (signal?.aborted) throw new Error('Operation aborted');
    const file = imageFiles[i];
    const pct = Math.round(15 + ((i + 1) / imageFiles.length) * 75);
    onProgress?.({ progress: pct, message: `Embedding image ${i + 1} of ${imageFiles.length} (${file.name})…` });
    await yieldToMain();

    const isPng = /\.png$/i.test(file.name) || file.type === 'image/png';
    const isJpeg = /\.jpe?g$/i.test(file.name) || file.type === 'image/jpeg';

    let embedded;
    if (isPng) {
      embedded = await doc.embedPng(await file.arrayBuffer());
    } else if (isJpeg) {
      embedded = await doc.embedJpg(await file.arrayBuffer());
    } else {
      // Anything else the picker accepts — WebP in particular. A PDF can only
      // carry JPEG or PNG image data, so the file is repainted onto a canvas
      // and re-encoded as PNG first. Without this a .webp reached embedJpg and
      // threw a raw parser error, even though the file input advertises it.
      embedded = await doc.embedPng(await toPngBytes(file));
    }

    const { width, height } = embedded.scale(1);
    const page = doc.addPage([width, height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  onProgress?.({ progress: 92, message: 'Building PDF document…' });
  await yieldToMain();

  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const filename = imageFiles.length === 1
    ? `${imageFiles[0].name.replace(/\.[^.]+$/, '')}.pdf`
    : 'combined-images.pdf';

  onProgress?.({ progress: 100, message: 'PDF generated successfully!' });
  return {
    blob,
    filename,
    imageCount: imageFiles.length,
  };
}
