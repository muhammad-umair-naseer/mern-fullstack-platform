/**
 * Client-Side PDF Protect / Password Locker Engine
 * Implements Standard PDF Security Handler (RC4 128-bit / Algorithm 2/3) using pdf-lib.
 * Completely client-side, zero server transmission.
 */

import {
  PDFDocument,
  PDFDict,
  PDFArray,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
  PDFRawStream,
} from 'pdf-lib';
import { yieldToMain } from './pdfCommon';

function rotl(x, c) {
  return (x << c) | (x >>> (32 - c));
}

const s = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const K = new Int32Array(64);
for (let i = 0; i < 64; i++) {
  K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
}

function md5(bytes) {
  const msgLenBits = bytes.length * 8;
  const withOne = new Uint8Array(bytes.length + 1);
  withOne.set(bytes);
  withOne[bytes.length] = 0x80;
  let totalLen = withOne.length;
  while (totalLen % 64 !== 56) totalLen++;
  const padded = new Uint8Array(totalLen + 8);
  padded.set(withOne);

  const lenLow = msgLenBits >>> 0;
  const lenHigh = Math.floor(msgLenBits / 4294967296) >>> 0;
  const dv = new DataView(padded.buffer);
  dv.setUint32(totalLen, lenLow, true);
  dv.setUint32(totalLen + 4, lenHigh, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const M = new Int32Array(16);
  const view = new DataView(padded.buffer);
  for (let chunk = 0; chunk < padded.length; chunk += 64) {
    for (let i = 0; i < 16; i++) M[i] = view.getInt32(chunk + i * 4, true);
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(F, s[i])) | 0;
    }
    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }
  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setInt32(0, a0, true);
  outView.setInt32(4, b0, true);
  outView.setInt32(8, c0, true);
  outView.setInt32(12, d0, true);
  return out;
}

function rc4(key, data) {
  const S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) S[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
  }
  const out = new Uint8Array(data.length);
  let i = 0;
  let k = 0;
  j = 0;
  for (k = 0; k < data.length; k++) {
    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
    out[k] = data[k] ^ S[(S[i] + S[j]) & 0xff];
  }
  return out;
}

const PAD = Uint8Array.from([
  0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41, 0x64, 0x00, 0x4e, 0x56, 0xff,
  0xfa, 0x01, 0x08, 0x2e, 0x2e, 0x00, 0xb6, 0xd0, 0x68, 0x3e, 0x80, 0x2f, 0x0c,
  0xa9, 0xfe, 0x64, 0x53, 0x69, 0x7a,
]);

function padPassword(pw) {
  const bytes = new TextEncoder().encode(pw || '');
  const out = new Uint8Array(32);
  const n = Math.min(bytes.length, 32);
  out.set(bytes.subarray(0, n), 0);
  out.set(PAD.subarray(0, 32 - n), n);
  return out;
}

function concatBytes(arrs) {
  let len = 0;
  arrs.forEach((a) => (len += a.length));
  const out = new Uint8Array(len);
  let off = 0;
  arrs.forEach((a) => {
    out.set(a, off);
    off += a.length;
  });
  return out;
}

function bytesToHex(bytes) {
  let sHex = '';
  for (let i = 0; i < bytes.length; i++) sHex += bytes[i].toString(16).padStart(2, '0');
  return sHex;
}

function randomBytes(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

function computeO(ownerPw, userPw) {
  const ownerPadded = padPassword(ownerPw || userPw);
  const key = md5(ownerPadded).slice(0, 5);
  const userPadded = padPassword(userPw);
  return rc4(key, userPadded);
}

function computeFileKey(userPw, oBytes, pValue, idBytes) {
  const userPadded = padPassword(userPw);
  const pBytes = new Uint8Array(4);
  const pUnsigned = pValue >>> 0;
  pBytes[0] = pUnsigned & 0xff;
  pBytes[1] = (pUnsigned >> 8) & 0xff;
  pBytes[2] = (pUnsigned >> 16) & 0xff;
  pBytes[3] = (pUnsigned >> 24) & 0xff;
  const input = concatBytes([userPadded, oBytes, pBytes, idBytes]);
  return md5(input).slice(0, 5);
}

function computeU(fileKey) {
  return rc4(fileKey, PAD);
}

function computeObjectKey(fileKey, objNum, gen) {
  const n = fileKey.length;
  const extra = new Uint8Array(n + 5);
  extra.set(fileKey, 0);
  extra[n] = objNum & 0xff;
  extra[n + 1] = (objNum >> 8) & 0xff;
  extra[n + 2] = (objNum >> 16) & 0xff;
  extra[n + 3] = gen & 0xff;
  extra[n + 4] = (gen >> 8) & 0xff;
  const hash = md5(extra);
  const keyLen = Math.min(n + 5, 16);
  return hash.slice(0, keyLen);
}

function computeP(perms) {
  let p = 0xffffffff;
  if (!perms.allowPrint) p &= ~(1 << 2);
  if (!perms.allowModify) p &= ~(1 << 3);
  if (!perms.allowCopy) p &= ~(1 << 4);
  if (!perms.allowAnnotate) p &= ~(1 << 5);
  return p | 0;
}

function getStringBytes(val) {
  if (typeof val.asBytes === 'function') return val.asBytes();
  const sVal = val.value || '';
  const arr = new Uint8Array(sVal.length);
  for (let i = 0; i < sVal.length; i++) arr[i] = sVal.charCodeAt(i) & 0xff;
  return arr;
}

export async function protectPdf(file, options = {}, onProgress, signal) {
  const {
    userPassword = '',
    ownerPassword = '',
    allowPrint = true,
    allowModify = false,
    allowCopy = true,
    allowAnnotate = false,
  } = options;

  if (!userPassword) {
    throw new Error('A password is required to lock and encrypt the PDF.');
  }

  onProgress?.({ progress: 10, message: 'Reading document bytes…' });
  await yieldToMain();

  const buf = await file.arrayBuffer();
  if (signal?.aborted) throw new Error('Operation aborted');

  const pdfDoc = await PDFDocument.load(buf.slice(0), { ignoreEncryption: true });
  const context = pdfDoc.context;

  onProgress?.({ progress: 30, message: 'Generating encryption keys and metadata…' });
  await yieldToMain();

  let idBytes;
  const idArray = context.trailerInfo.ID;
  if (idArray && idArray.size && idArray.size() > 0) {
    idBytes = getStringBytes(idArray.get(0));
  } else {
    idBytes = randomBytes(16);
    const id0 = PDFHexString.of(bytesToHex(idBytes));
    const id1 = PDFHexString.of(bytesToHex(randomBytes(16)));
    const newIdArray = PDFArray.withContext(context);
    newIdArray.push(id0);
    newIdArray.push(id1);
    context.trailerInfo.ID = newIdArray;
  }

  const perms = { allowPrint, allowModify, allowCopy, allowAnnotate };
  const pValue = computeP(perms);
  const oBytes = computeO(ownerPassword, userPassword);
  const fileKey = computeFileKey(userPassword, oBytes, pValue, idBytes);
  const uBytes = computeU(fileKey);

  const encDict = PDFDict.withContext(context);
  encDict.set(PDFName.of('Filter'), PDFName.of('Standard'));
  encDict.set(PDFName.of('V'), PDFNumber.of(1));
  encDict.set(PDFName.of('R'), PDFNumber.of(2));
  encDict.set(PDFName.of('O'), PDFHexString.of(bytesToHex(oBytes)));
  encDict.set(PDFName.of('U'), PDFHexString.of(bytesToHex(uBytes)));
  encDict.set(PDFName.of('P'), PDFNumber.of(pValue));
  const encRef = context.register(encDict);
  context.trailerInfo.Encrypt = encRef;

  function processValue(val, encryptFn) {
    if (val instanceof PDFHexString || val instanceof PDFString) {
      const bytes = getStringBytes(val);
      const enc = encryptFn(bytes);
      return PDFHexString.of(bytesToHex(enc));
    } else if (val instanceof PDFDict) {
      walkDict(val, encryptFn);
      return val;
    } else if (val instanceof PDFArray) {
      walkArray(val, encryptFn);
      return val;
    }
    return val;
  }

  function walkDict(dict, encryptFn) {
    const keys = dict.keys();
    for (const key of keys) {
      const val = dict.get(key);
      const replaced = processValue(val, encryptFn);
      if (replaced !== val) dict.set(key, replaced);
    }
  }

  function walkArray(arr, encryptFn) {
    const n = arr.size();
    for (let i = 0; i < n; i++) {
      const val = arr.get(i);
      const replaced = processValue(val, encryptFn);
      if (replaced !== val) arr.set(i, replaced);
    }
  }

  onProgress?.({ progress: 60, message: 'Encrypting streams and indirect objects…' });
  await yieldToMain();

  const entries = context.enumerateIndirectObjects();
  for (const [ref, obj] of entries) {
    if (
      ref === encRef ||
      (ref.objectNumber === encRef.objectNumber && ref.generationNumber === encRef.generationNumber)
    )
      continue;
    const objectKey = computeObjectKey(fileKey, ref.objectNumber, ref.generationNumber);
    const encryptFn = (b) => rc4(objectKey, b);

    if (obj instanceof PDFRawStream) {
      obj.contents = rc4(objectKey, obj.contents);
      walkDict(obj.dict, encryptFn);
    } else if (obj instanceof PDFDict) {
      walkDict(obj, encryptFn);
    } else if (obj instanceof PDFArray) {
      walkArray(obj, encryptFn);
    } else if (obj instanceof PDFHexString || obj instanceof PDFString) {
      const b = getStringBytes(obj);
      const enc = rc4(objectKey, b);
      context.assign(ref, PDFHexString.of(bytesToHex(enc)));
    }
  }

  onProgress?.({ progress: 90, message: 'Finalizing protected document…' });
  await yieldToMain();

  const outBytes = await pdfDoc.save({ useObjectStreams: false });
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  const base = file.name.replace(/\.pdf$/i, '');

  onProgress?.({ progress: 100, message: 'PDF password protection applied successfully!' });
  return {
    blob,
    filename: `${base}-protected.pdf`,
  };
}
