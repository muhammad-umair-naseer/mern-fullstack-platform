/* Paper Route direction: client-side image encoding helpers keep every conversion on the user’s device. */

export type ExportFormat = "png" | "jpeg" | "webp" | "tiff" | "bmp" | "gif";

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function littleEndianBytes(value: number, byteLength: number) {
  const bytes: number[] = [];
  for (let index = 0; index < byteLength; index += 1) {
    bytes.push((value >> (index * 8)) & 0xff);
  }
  return bytes;
}

export function encodeBmp(imageData: ImageData) {
  const { width, height, data } = imageData;
  const pixelBytes = width * height * 4;
  const buffer = new ArrayBuffer(54 + pixelBytes);
  const view = new DataView(buffer);

  writeAscii(view, 0, "BM");
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
      view.setUint8(outputOffset, data[sourceOffset + 2]);
      view.setUint8(outputOffset + 1, data[sourceOffset + 1]);
      view.setUint8(outputOffset + 2, data[sourceOffset]);
      view.setUint8(outputOffset + 3, data[sourceOffset + 3]);
      outputOffset += 4;
    }
  }

  return new Blob([buffer], { type: "image/bmp" });
}

export function encodeTiff(imageData: ImageData) {
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

  const writeEntry = (index: number, tag: number, type: number, count: number, value: number) => {
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
  return new Blob([buffer], { type: "image/tiff" });
}

function createGifPalette() {
  const palette: number[] = [];
  for (let red = 0; red < 8; red += 1) {
    for (let green = 0; green < 8; green += 1) {
      for (let blue = 0; blue < 4; blue += 1) {
        palette.push(Math.round((red * 255) / 7));
        palette.push(Math.round((green * 255) / 7));
        palette.push(Math.round((blue * 255) / 3));
      }
    }
  }
  return palette;
}

function quantizeToGif(imageData: ImageData) {
  const { data } = imageData;
  const pixels = new Uint8Array(data.length / 4);
  for (let sourceOffset = 0, pixelOffset = 0; sourceOffset < data.length; sourceOffset += 4, pixelOffset += 1) {
    const red = data[sourceOffset];
    const green = data[sourceOffset + 1];
    const blue = data[sourceOffset + 2];
    pixels[pixelOffset] = (Math.round((red / 255) * 7) << 5) | (Math.round((green / 255) * 7) << 2) | Math.round((blue / 255) * 3);
  }
  return pixels;
}

function lzwEncode(indices: Uint8Array, minimumCodeSize = 8) {
  const clearCode = 1 << minimumCodeSize;
  const endCode = clearCode + 1;
  let nextCode = endCode + 1;
  let codeSize = minimumCodeSize + 1;
  let bitBuffer = 0;
  let bitCount = 0;
  const output: number[] = [];
  const dictionary = new Map<string, number>();

  const pushCode = (code: number) => {
    bitBuffer |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      output.push(bitBuffer & 0xff);
      bitBuffer >>= 8;
      bitCount -= 8;
    }
  };

  const reset = () => {
    dictionary.clear();
    nextCode = endCode + 1;
    codeSize = minimumCodeSize + 1;
  };

  pushCode(clearCode);
  reset();

  if (indices.length === 0) {
    pushCode(endCode);
  } else {
    let current = String(indices[0]);
    for (let index = 1; index < indices.length; index += 1) {
      const next = String(indices[index]);
      const candidate = `${current},${next}`;
      if (dictionary.has(candidate)) {
        current = candidate;
        continue;
      }

      pushCode(dictionary.get(current) ?? Number(current));
      if (nextCode < 4096) {
        dictionary.set(candidate, nextCode);
        nextCode += 1;
        if (nextCode === 1 << codeSize && codeSize < 12) {
          codeSize += 1;
        }
      } else {
        pushCode(clearCode);
        reset();
      }
      current = next;
    }
    pushCode(dictionary.get(current) ?? Number(current));
    pushCode(endCode);
  }

  if (bitCount > 0) {
    output.push(bitBuffer & 0xff);
  }
  return output;
}

export function encodeGif(imageData: ImageData) {
  const { width, height } = imageData;
  const palette = createGifPalette();
  const lzwData = lzwEncode(quantizeToGif(imageData));
  const output: number[] = [];

  const push = (...values: number[]) => output.push(...values);
  const pushWord = (value: number) => push(...littleEndianBytes(value, 2));

  push(...Array.from("GIF89a").map((character) => character.charCodeAt(0)));
  pushWord(width);
  pushWord(height);
  push(0xf7, 0x00, 0x00);
  push(...palette);
  push(0x21, 0xf9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00);
  push(0x2c);
  pushWord(0);
  pushWord(0);
  pushWord(width);
  pushWord(height);
  push(0x00);
  push(0x08);

  for (let offset = 0; offset < lzwData.length; offset += 255) {
    const chunk = lzwData.slice(offset, offset + 255);
    push(chunk.length, ...chunk);
  }
  push(0x00, 0x3b);

  return new Blob([new Uint8Array(output)], { type: "image/gif" });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error(`The browser could not encode this canvas as ${mimeType}.`));
    }, mimeType, quality);
  });
}

export async function canvasToExportBlob(canvas: HTMLCanvasElement, format: ExportFormat, quality: number) {
  if (format === "bmp" || format === "tiff" || format === "gif") {
    const imageData = canvas.getContext("2d")?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) throw new Error("The browser could not read the rendered page.");
    if (format === "bmp") return encodeBmp(imageData);
    if (format === "tiff") return encodeTiff(imageData);
    return encodeGif(imageData);
  }

  return canvasToBlob(canvas, `image/${format}`, format === "png" ? undefined : quality);
}

export const formatMimeTypes: Record<ExportFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  tiff: "image/tiff",
  bmp: "image/bmp",
  gif: "image/gif",
};
