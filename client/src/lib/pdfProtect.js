/**
 * Client-Side PDF Protect / Password Locker Engine
 * Implements the Standard PDF Security Handler at /V 1 /R 2 using pdf-lib.
 *
 * That is 40-bit RC4 — the file key is md5(...).slice(0, 5), five bytes — and
 * NOT the 128-bit this comment used to claim. 40-bit RC4 is the original PDF
 * 1.1 handler and is broken: any password-removal tool strips it in seconds
 * regardless of how strong the password is. It stops a casual double-click,
 * nothing more. The UI deliberately makes no strength claim. Moving to
 * /V 4 with AESV2 (128-bit AES) or /V 5 with AESV3 (256-bit) is the real fix.
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
import { md5, rc4, PAD, concatBytes } from './pdfCrypto';

function padPassword(pw) {
  const bytes = new TextEncoder().encode(pw || '');
  const out = new Uint8Array(32);
  const n = Math.min(bytes.length, 32);
  out.set(bytes.subarray(0, n), 0);
  out.set(PAD.subarray(0, 32 - n), n);
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
