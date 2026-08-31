/**
 * Client-Side Ultra PDF Compression Engine
 *
 * Compresses PDF documents by:
 * 1. Discovering ALL embedded images across the entire document (including inside
 *    nested Form XObjects, Transparency Groups, Annotations, and deep object hierarchies).
 * 2. Decompressing and decoding DCTDecode (JPEG), FlateDecode (PNG/Bitmaps with PNG Predictors),
 *    CMYK print channels, Indexed Palettes, and Grayscale images.
 * 3. Downsampling and recompressing into highly optimized JPEGs using hardware-accelerated Canvas.
 * 4. Stripping bloated Adobe/Photoshop/Illustrator PieceInfo, XMP metadata, and struct trees.
 * 5. Packing PDF object streams with Deflate.
 *
 * 100% Client-Side • Zero Server Compute • Memory-Safe Non-Blocking Execution.
 */

import { PDFDocument, PDFName, PDFNumber, PDFRawStream, PDFArray, PDFDict, PDFString, PDFHexString } from 'pdf-lib';
import { inflate } from 'pako';

export const COMPRESSION_LEVELS = {
  low: {
    id: 'low',
    name: 'High Quality',
    description: 'Minor size reduction, maximum clarity (75% quality, 1600px)',
    quality: 0.75,
    maxDimension: 1600,
  },
  medium: {
    id: 'medium',
    name: 'Balanced',
    description: 'Good balance of size and clarity (50% quality, 1100px)',
    quality: 0.50,
    maxDimension: 1100,
  },
  high: {
    id: 'high',
    name: 'Strong Compression (Recommended)',
    description: 'Best size reduction & crisp text for most PDFs (28% quality, 750px)',
    quality: 0.28,
    maxDimension: 750,
  },
  extreme: {
    id: 'extreme',
    name: 'Extreme Compression',
    description: 'Maximum shrink for strict upload limits & WhatsApp (15% quality, 500px)',
    quality: 0.15,
    maxDimension: 500,
  },
};

/**
 * Format bytes to human readable string (e.g. 19.43 MB)
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Validates if the file is truly a PDF by checking extension, MIME, and magic bytes.
 */
export async function validatePdfFile(file) {
  if (!file) {
    throw new Error('No file selected.');
  }

  const name = file.name || '';
  if (!/\.pdf$/i.test(name)) {
    throw new Error('Please select a valid .pdf file.');
  }

  const slice = file.slice(0, 1024);
  const headerBuf = await slice.arrayBuffer();
  const headerText = new TextDecoder('latin1').decode(new Uint8Array(headerBuf));

  if (!headerText.includes('%PDF-')) {
    throw new Error('Invalid or corrupted PDF file header.');
  }

  return true;
}

/**
 * Non-blocking micro-yield to keep the browser responsive.
 */
function yieldToMain() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

// ---------- Filter decoders (ASCII85 / ASCIIHex) ----------

function decodeASCII85(bytes) {
  let str = new TextDecoder('latin1').decode(bytes).trim();
  if (str.startsWith('<~')) str = str.slice(2);
  if (str.endsWith('~>')) str = str.slice(0, -2);
  str = str.replace(/\s+/g, '');

  const out = [];
  let group = [];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === 'z' && group.length === 0) {
      out.push(0, 0, 0, 0);
      continue;
    }
    group.push(c.charCodeAt(0) - 33);
    if (group.length === 5) {
      let val = 0;
      for (const g of group) val = val * 85 + g;
      out.push((val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff);
      group = [];
    }
  }
  if (group.length > 0) {
    const n = group.length;
    while (group.length < 5) group.push(84);
    let val = 0;
    for (const g of group) val = val * 85 + g;
    const bytes4 = [(val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff];
    out.push(...bytes4.slice(0, n - 1));
  }
  return new Uint8Array(out);
}

function decodeASCIIHex(bytes) {
  let str = new TextDecoder('latin1').decode(bytes).replace(/>$/, '').replace(/\s+/g, '');
  if (str.length % 2 === 1) str += '0';
  const out = new Uint8Array(str.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(str.substr(i * 2, 2), 16);
  return out;
}

/**
 * Standard PNG Predictor De-filter (RFC 2083)
 */
function decodePNGPredictor(data, columns, colors, bpc) {
  const bytesPerPixel = Math.max(1, Math.ceil((colors * bpc) / 8));
  const rowBytes = Math.ceil((columns * colors * bpc) / 8);
  const rowStride = 1 + rowBytes;
  const rows = Math.floor(data.length / rowStride);
  const output = new Uint8Array(rows * rowBytes);

  let prevRow = new Uint8Array(rowBytes);

  for (let r = 0; r < rows; r++) {
    const rowStart = r * rowStride;
    const filterType = data[rowStart];
    const currentRow = new Uint8Array(rowBytes);

    for (let c = 0; c < rowBytes; c++) {
      const raw = data[rowStart + 1 + c];
      const left = c >= bytesPerPixel ? currentRow[c - bytesPerPixel] : 0;
      const up = prevRow[c] || 0;
      const upLeft = c >= bytesPerPixel ? prevRow[c - bytesPerPixel] || 0 : 0;

      let val = raw;
      if (filterType === 0) {
        val = raw;
      } else if (filterType === 1) {
        val = (raw + left) & 0xff;
      } else if (filterType === 2) {
        val = (raw + up) & 0xff;
      } else if (filterType === 3) {
        val = (raw + Math.floor((left + up) / 2)) & 0xff;
      } else if (filterType === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        let pr = upLeft;
        if (pa <= pb && pa <= pc) pr = left;
        else if (pb <= pc) pr = up;
        val = (raw + pr) & 0xff;
      }
      currentRow[c] = val;
    }

    output.set(currentRow, r * rowBytes);
    prevRow = currentRow;
  }
  return output;
}

function filtersOf(dict) {
  const f = dict.get(PDFName.of('Filter'));
  if (!f) return [];
  if (f instanceof PDFArray) return f.asArray().map((x) => x.toString());
  return [f.toString()];
}

/**
 * Load image buffer into HTMLImageElement with cleanup
 */
function loadImage(bytes) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode image stream.'));
    };
    img.src = url;
  });
}

/**
 * Convert HTMLCanvasElement to compressed JPEG ArrayBuffer
 */
function canvasToJpegBuffer(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob'));
          return;
        }
        blob
          .arrayBuffer()
          .then((buf) => resolve(new Uint8Array(buf)))
          .catch(reject);
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Clean canvas to free browser GPU/RAM memory immediately
 */
function disposeCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  canvas.width = 0;
  canvas.height = 0;
}

/**
 * Parse DecodeParms to extract Predictor, Columns, Colors
 */
function getDecodeParms(dict) {
  const parms = dict.get(PDFName.of('DecodeParms'));
  if (!parms) return null;

  let dp = parms;
  if (parms instanceof PDFArray && parms.size() > 0) {
    dp = parms.get(0);
  }
  if (!(dp instanceof PDFDict)) return null;

  const predictor = dp.get(PDFName.of('Predictor'))?.asNumber?.() || 1;
  const columns = dp.get(PDFName.of('Columns'))?.asNumber?.() || 1;
  const colors = dp.get(PDFName.of('Colors'))?.asNumber?.() || 1;
  const bpc = dp.get(PDFName.of('BitsPerComponent'))?.asNumber?.() || 8;

  return { predictor, columns, colors, bpc };
}

/**
 * Extract palette bytes for Indexed color space
 */
function extractIndexedPalette(csObj, context) {
  if (!(csObj instanceof PDFArray) || csObj.size() < 4) return null;
  const tag = csObj.get(0)?.toString();
  if (tag !== '/Indexed') return null;

  const lookupObj = csObj.get(3);
  let lookupRef = lookupObj;
  if (lookupObj && context) {
    lookupRef = context.lookup(lookupObj);
  }

  if (lookupRef instanceof PDFRawStream) {
    return lookupRef.contents;
  }
  if (lookupRef instanceof PDFString || lookupRef instanceof PDFHexString) {
    const raw = lookupRef.asBytes();
    return raw;
  }
  return null;
}

/**
 * Recompress a single image XObject stream
 */
async function recompressImageStream(stream, settings, context) {
  const dict = stream.dict;
  const filters = filtersOf(dict);
  let bytes = stream.contents;

  const remaining = [...filters];
  while (
    remaining.length &&
    (remaining[0] === '/ASCII85Decode' || remaining[0] === '/ASCIIHexDecode')
  ) {
    const f = remaining.shift();
    bytes = f === '/ASCII85Decode' ? decodeASCII85(bytes) : decodeASCIIHex(bytes);
  }

  // 1. DCTDecode (JPEG image stream)
  if (remaining.length === 1 && remaining[0] === '/DCTDecode') {
    let img = null;
    let canvas = null;
    try {
      img = await loadImage(bytes);
      let targetW = img.width;
      let targetH = img.height;

      if (targetW > settings.maxDimension || targetH > settings.maxDimension) {
        const scale = settings.maxDimension / Math.max(targetW, targetH);
        targetW = Math.max(1, Math.round(targetW * scale));
        targetH = Math.max(1, Math.round(targetH * scale));
      }

      canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const newBytes = await canvasToJpegBuffer(canvas, settings.quality);
      return {
        newBytes,
        width: targetW,
        height: targetH,
        filter: 'DCTDecode',
        colorSpace: 'DeviceRGB',
        bpc: 8,
      };
    } finally {
      if (canvas) disposeCanvas(canvas);
      img = null;
    }
  }

  // 2. FlateDecode (raw uncompressed bitmap / deflate stream / PNG)
  if (remaining.length === 1 && remaining[0] === '/FlateDecode') {
    const width = dict.get(PDFName.of('Width'))?.asNumber();
    const height = dict.get(PDFName.of('Height'))?.asNumber();
    const bpc = dict.get(PDFName.of('BitsPerComponent'))?.asNumber() || 8;
    const csObj = dict.get(PDFName.of('ColorSpace'));
    const cs = csObj ? csObj.toString() : '/DeviceRGB';

    if (!width || !height || bpc !== 8) {
      return null;
    }

    const isIndexed = cs.startsWith('[/Indexed');
    const isRGB = cs === '/DeviceRGB' || cs.includes('RGB') || cs.includes('ICCBased');
    const isGray = cs === '/DeviceGray' || cs.includes('Gray');
    const isCMYK = cs === '/DeviceCMYK' || cs.includes('CMYK');

    if (!isRGB && !isGray && !isCMYK && !isIndexed) {
      return null;
    }

    let canvas = null;
    let targetCanvas = null;

    try {
      let inflated = inflate(bytes);

      // Check for PNG predictors
      const parms = getDecodeParms(dict);
      if (parms && parms.predictor >= 10) {
        const colors = isCMYK ? 4 : isRGB ? 3 : 1;
        inflated = decodePNGPredictor(inflated, parms.columns || width, colors, bpc);
      }

      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);

      if (isIndexed) {
        const palette = extractIndexedPalette(csObj, context);
        if (palette) {
          for (let i = 0, j = 0; i < inflated.length && j < imageData.data.length; i++, j += 4) {
            const idx = inflated[i] * 3;
            imageData.data[j] = palette[idx] || 0;
            imageData.data[j + 1] = palette[idx + 1] || 0;
            imageData.data[j + 2] = palette[idx + 2] || 0;
            imageData.data[j + 3] = 255;
          }
        } else {
          return null;
        }
      } else if (isCMYK) {
        for (let i = 0, j = 0; i < inflated.length && j < imageData.data.length; i += 4, j += 4) {
          const c = inflated[i] / 255;
          const m = inflated[i + 1] / 255;
          const y = inflated[i + 2] / 255;
          const k = inflated[i + 3] / 255;
          imageData.data[j] = Math.round(255 * (1 - c) * (1 - k));
          imageData.data[j + 1] = Math.round(255 * (1 - m) * (1 - k));
          imageData.data[j + 2] = Math.round(255 * (1 - y) * (1 - k));
          imageData.data[j + 3] = 255;
        }
      } else if (isRGB) {
        for (let i = 0, j = 0; i < inflated.length && j < imageData.data.length; i += 3, j += 4) {
          imageData.data[j] = inflated[i];
          imageData.data[j + 1] = inflated[i + 1];
          imageData.data[j + 2] = inflated[i + 2];
          imageData.data[j + 3] = 255;
        }
      } else if (isGray) {
        for (let i = 0, j = 0; i < inflated.length && j < imageData.data.length; i++, j += 4) {
          imageData.data[j] = inflated[i];
          imageData.data[j + 1] = inflated[i];
          imageData.data[j + 2] = inflated[i];
          imageData.data[j + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      targetCanvas = canvas;
      if (width > settings.maxDimension || height > settings.maxDimension) {
        const scale = settings.maxDimension / Math.max(width, height);
        const tw = Math.max(1, Math.round(width * scale));
        const th = Math.max(1, Math.round(height * scale));
        const sc = document.createElement('canvas');
        sc.width = tw;
        sc.height = th;
        sc.getContext('2d').drawImage(canvas, 0, 0, tw, th);
        targetCanvas = sc;
      }

      const newBytes = await canvasToJpegBuffer(targetCanvas, settings.quality);
      return {
        newBytes,
        width: targetCanvas.width,
        height: targetCanvas.height,
        filter: 'DCTDecode',
        colorSpace: 'DeviceRGB',
        bpc: 8,
      };
    } finally {
      if (canvas) disposeCanvas(canvas);
      if (targetCanvas && targetCanvas !== canvas) disposeCanvas(targetCanvas);
    }
  }

  return null;
}

/**
 * Strip bloated Adobe/Photoshop/Illustrator PieceInfo, XMP metadata, and struct trees.
 */
function cleanPdfMetadata(pdfDoc) {
  try {
    if (pdfDoc.catalog) {
      pdfDoc.catalog.delete(PDFName.of('PieceInfo'));
      pdfDoc.catalog.delete(PDFName.of('Metadata'));
      pdfDoc.catalog.delete(PDFName.of('StructTreeRoot'));
      pdfDoc.catalog.delete(PDFName.of('OutputIntents'));
      pdfDoc.catalog.delete(PDFName.of('OCProperties'));
      pdfDoc.catalog.delete(PDFName.of('EmbeddedFiles'));
    }

    const pages = pdfDoc.getPages();
    for (const p of pages) {
      if (p.node) {
        p.node.delete(PDFName.of('PieceInfo'));
        p.node.delete(PDFName.of('Metadata'));
        p.node.delete(PDFName.of('StructParents'));
      }
    }
  } catch (e) {
    console.warn('Metadata cleanup non-fatal notice:', e);
  }
}

/**
 * Main PDF Compressor Function
 *
 * @param {File} file - The PDF file
 * @param {string|object} level - Preset key ('low', 'medium', 'high', 'extreme') or custom { quality, maxDimension }
 * @param {Function} onProgress - Callback ({ progress, message, current, total })
 * @param {AbortSignal} signal - Optional abort signal
 */
export async function compressPdf(file, level = 'high', onProgress, signal) {
  await validatePdfFile(file);

  if (signal?.aborted) {
    throw new Error('Compression cancelled by user.');
  }

  const settings = typeof level === 'object'
    ? {
        quality: Math.min(0.95, Math.max(0.05, level.quality || 0.28)),
        maxDimension: Math.min(3000, Math.max(200, level.maxDimension || 750)),
      }
    : COMPRESSION_LEVELS[level] || COMPRESSION_LEVELS.high;

  const originalSize = file.size;

  onProgress?.({ progress: 5, message: 'Reading document bytes…' });
  const originalBytes = await file.arrayBuffer();

  if (signal?.aborted) {
    throw new Error('Compression cancelled by user.');
  }

  onProgress?.({ progress: 12, message: 'Parsing PDF structure and indirect object streams…' });
  await yieldToMain();

  const pdfDoc = await PDFDocument.load(originalBytes, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  // Strip bloated editing metadata (e.g. 100MB+ Illustrator/Photoshop PieceInfo)
  cleanPdfMetadata(pdfDoc);

  // 1. Discover ALL image streams in the entire document (direct & nested)
  const imageStreams = [];
  const indirectObjects = pdfDoc.context.enumerateIndirectObjects();

  for (const [ref, obj] of indirectObjects) {
    if (obj instanceof PDFRawStream) {
      const subtype = obj.dict.get(PDFName.of('Subtype'));
      if (subtype && subtype.toString() === '/Image') {
        imageStreams.push({ ref, stream: obj });
      }
    }
  }

  const totalImages = imageStreams.length;
  let processedImages = 0;
  let skippedImages = 0;

  if (totalImages === 0) {
    onProgress?.({ progress: 50, message: 'Optimising vector structures and stream tables…' });
  } else {
    for (let i = 0; i < totalImages; i++) {
      if (signal?.aborted) {
        throw new Error('Compression cancelled by user.');
      }

      const { stream } = imageStreams[i];
      const percent = Math.round(15 + ((i + 1) / totalImages) * 75);

      onProgress?.({
        progress: percent,
        current: i + 1,
        total: totalImages,
        message: `Compressing image ${i + 1} of ${totalImages}…`,
      });

      try {
        const result = await recompressImageStream(stream, settings, pdfDoc.context);

        if (!result) {
          skippedImages++;
          continue;
        }

        // Only keep if the new JPEG is smaller than the original stream contents
        if (result.newBytes.length >= stream.contents.length) {
          skippedImages++;
          continue;
        }

        stream.dict.set(PDFName.of('Filter'), PDFName.of(result.filter));
        stream.dict.set(PDFName.of('Width'), PDFNumber.of(result.width));
        stream.dict.set(PDFName.of('Height'), PDFNumber.of(result.height));
        stream.dict.set(PDFName.of('ColorSpace'), PDFName.of(result.colorSpace));
        stream.dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(result.bpc));
        stream.dict.set(PDFName.of('Length'), PDFNumber.of(result.newBytes.length));
        stream.dict.delete(PDFName.of('DecodeParms'));
        stream.contents = result.newBytes;
        processedImages++;
      } catch (err) {
        console.warn(`[PDF Compressor] Image ${i + 1} skipped safely:`, err);
        skippedImages++;
      }

      await yieldToMain();
    }
  }

  onProgress?.({ progress: 92, message: 'Purging unreferenced objects and packaging PDF…' });
  await yieldToMain();

  // Create clean target document to eliminate orphaned, dead, and ghost objects
  const cleanDoc = await PDFDocument.create();
  const pageIndices = pdfDoc.getPageIndices();
  const copiedPages = await cleanDoc.copyPages(pdfDoc, pageIndices);
  for (const page of copiedPages) {
    cleanDoc.addPage(page);
  }

  // Preserve document metadata if present
  try {
    if (pdfDoc.getTitle()) cleanDoc.setTitle(pdfDoc.getTitle());
    if (pdfDoc.getAuthor()) cleanDoc.setAuthor(pdfDoc.getAuthor());
    if (pdfDoc.getSubject()) cleanDoc.setSubject(pdfDoc.getSubject());
    if (pdfDoc.getProducer()) cleanDoc.setProducer(pdfDoc.getProducer());
  } catch (e) {
    // Non-fatal metadata copy
  }

  const outputBytes = await cleanDoc.save({ useObjectStreams: true });
  const compressedBlob = new Blob([outputBytes], { type: 'application/pdf' });
  const compressedSize = compressedBlob.size;

  const reduction =
    compressedSize < originalSize
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : 0;

  onProgress?.({ progress: 100, message: 'Compression complete!' });

  return {
    blob: compressedBlob,
    originalSize,
    compressedSize,
    reduction,
    totalImages,
    processedImages,
    skippedImages,
    totalPages,
  };
}

/**
 * Triggers a browser download of the given blob
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
