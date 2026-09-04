/**
 * Client-side binary image encoders (BMP, TIFF) for multi-format export.
 * 100% in-browser processing using ArrayBuffer and DataView.
 */

function writeAscii(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

export function encodeBmp(imageData) {
  const { width, height, data } = imageData;
  const pixelBytes = width * height * 4;
  const buffer = new ArrayBuffer(54 + pixelBytes);
  const view = new DataView(buffer);

  writeAscii(view, 0, 'BM');
  view.setUint32(2, 54 + pixelBytes, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 32, true);
  view.setUint32(34, pixelBytes, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);

  let outputOffset = 54;
  for (let row = height - 1; row >= 0; row -= 1) {
    for (let column = 0; column < width; column += 1) {
      const sourceOffset = (row * width + column) * 4;
      view.setUint8(outputOffset, data[sourceOffset + 2]); // B
      view.setUint8(outputOffset + 1, data[sourceOffset + 1]); // G
      view.setUint8(outputOffset + 2, data[sourceOffset]); // R
      view.setUint8(outputOffset + 3, data[sourceOffset + 3]); // A
      outputOffset += 4;
    }
  }

  return new Blob([buffer], { type: 'image/bmp' });
}

export function encodeTiff(imageData) {
  const { width, height, data } = imageData;
  const entryCount = 10;
  const ifdOffset = 8;
  const bitsOffset = ifdOffset + 2 + entryCount * 12 + 4;
  const stripOffset = bitsOffset + 8;
  const buffer = new ArrayBuffer(stripOffset + data.length);
  const view = new DataView(buffer);

  view.setUint8(0, 0x49);
  view.setUint8(1, 0x49);
  view.setUint16(2, 42, true);
  view.setUint32(4, ifdOffset, true);
  view.setUint16(ifdOffset, entryCount, true);

  const writeEntry = (index, tag, type, count, value) => {
    const offset = ifdOffset + 2 + index * 12;
    view.setUint16(offset, tag, true);
    view.setUint16(offset + 2, type, true);
    view.setUint32(offset + 4, count, true);
    if (type === 3 && count === 1) {
      view.setUint16(offset + 8, value, true);
    } else {
      view.setUint32(offset + 8, value, true);
    }
  };

  writeEntry(0, 256, 4, 1, width);
  writeEntry(1, 257, 4, 1, height);
  writeEntry(2, 258, 3, 4, bitsOffset);
  writeEntry(3, 259, 3, 1, 1);
  writeEntry(4, 262, 3, 1, 2);
  writeEntry(5, 273, 4, 1, stripOffset);
  writeEntry(6, 277, 3, 1, 4);
  writeEntry(7, 278, 4, 1, height);
  writeEntry(8, 279, 4, 1, data.length);
  writeEntry(9, 284, 3, 1, 1);

  const nextIfdOffset = ifdOffset + 2 + entryCount * 12;
  view.setUint32(nextIfdOffset, 0, true);
  view.setUint16(bitsOffset, 8, true);
  view.setUint16(bitsOffset + 2, 8, true);
  view.setUint16(bitsOffset + 4, 8, true);
  view.setUint16(bitsOffset + 6, 8, true);

  new Uint8Array(buffer, stripOffset).set(data);
  return new Blob([buffer], { type: 'image/tiff' });
}

export async function canvasToExportBlob(canvas, format, quality = 0.92) {
  if (format === 'bmp' || format === 'tiff') {
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not get canvas context');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return format === 'bmp' ? encodeBmp(imageData) : encodeTiff(imageData);
  }

  const mimeMap = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
  };

  const mimeType = mimeMap[format] || 'image/png';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Failed to encode image to ${format}`));
      },
      mimeType,
      quality
    );
  });
}
