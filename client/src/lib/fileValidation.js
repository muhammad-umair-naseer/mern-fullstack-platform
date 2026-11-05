/**
 * Robust Client-Side File Type & Header / Magic Byte Validation
 * Prevents invalid files from triggering crashes or confusing errors.
 */

/**
 * Read the first N bytes of a File or Blob as a Uint8Array
 */
export async function readHeaderBytes(file, byteCount = 16) {
  if (!file || !(file instanceof Blob)) return new Uint8Array(0);
  const slice = file.slice(0, Math.min(file.size, byteCount));
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Check if a file is a valid PDF
 * Verifies both extension/type and "%PDF-" (0x25, 0x50, 0x44, 0x46, 0x2D) magic header
 */
export async function validatePdfFile(file) {
  if (!file) return { valid: false, error: 'No file provided.' };
  
  const name = file.name.toLowerCase();
  if (!name.endsWith('.pdf') && file.type && file.type !== 'application/pdf') {
    return { valid: false, error: 'Please select a valid PDF file (.pdf extension required).' };
  }

  const bytes = await readHeaderBytes(file, 8);
  // %PDF-
  const isPdfHeader =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d;

  if (!isPdfHeader) {
    return {
      valid: false,
      error: 'The uploaded file does not have a valid PDF header (%PDF-). It may be corrupted or disguised.',
    };
  }

  return { valid: true };
}

/**
 * Check if a file is a valid Image (JPG, PNG, WebP, GIF, SVG, BMP, TIFF)
 */
export async function validateImageFile(file, allowedFormats = ['jpeg', 'png', 'webp', 'gif', 'svg']) {
  if (!file) return { valid: false, error: 'No image provided.' };

  const name = file.name.toLowerCase();
  const ext = name.split('.').pop();
  const bytes = await readHeaderBytes(file, 12);

  // PNG header: 89 50 4E 47 0D 0A 1A 0A
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  // JPEG header: FF D8 FF
  const isJpg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  // GIF header: GIF87a or GIF89a (47 49 46 38)
  const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38;
  // WebP header: RIFF....WEBP
  const isWebp =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  // SVG check
  const isSvg = ext === 'svg' || (file.type && file.type.includes('svg'));

  let detected = null;
  if (isPng) detected = 'png';
  else if (isJpg) detected = 'jpeg';
  else if (isGif) detected = 'gif';
  else if (isWebp) detected = 'webp';
  else if (isSvg) detected = 'svg';
  else if (['bmp', 'tiff', 'tif', 'ico'].includes(ext)) detected = ext;

  if (!detected && !file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select a valid image file (JPG, PNG, WebP, GIF, etc.).' };
  }

  if (allowedFormats.length > 0 && detected && !allowedFormats.includes(detected) && !allowedFormats.includes(ext)) {
    return {
      valid: false,
      error: `Format .${detected || ext} is not supported by this tool. Allowed: ${allowedFormats.join(', ')}`,
    };
  }

  return { valid: true, format: detected || ext };
}

/**
 * Check if a file is a valid Audio file (WAV, MP3, OGG, FLAC, M4A, AAC)
 */
export async function validateAudioFile(file, allowed = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac']) {
  if (!file) return { valid: false, error: 'No audio file provided.' };
  const ext = file.name.toLowerCase().split('.').pop();
  const bytes = await readHeaderBytes(file, 12);

  if (!allowed.includes(ext)) return { valid: false, error: 'Unsupported audio extension.' };
  const isWav =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x41 &&
    bytes[10] === 0x56 &&
    bytes[11] === 0x45; // RIFF....WAVE

  const isMp3 = (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0); // ID3 or MPEG sync
  const isOgg = bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53; // OggS
  const isFlac = bytes[0] === 0x66 && bytes[1] === 0x4C && bytes[2] === 0x61 && bytes[3] === 0x43; // fLaC

  let detected = null;
  if (isWav) detected = 'wav';
  else if (isMp3) detected = 'mp3';
  else if (isOgg) detected = 'ogg';
  else if (isFlac) detected = 'flac';
  else if (['m4a', 'aac', 'wma'].includes(ext)) detected = ext;

  if (!detected && !file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
    return { valid: false, error: 'Please select a valid audio file (MP3, WAV, FLAC, OGG, etc.).' };
  }

  return { valid: true, format: detected || ext };
}

/**
 * Check if a file is a valid Archive file (ZIP, TAR, TAR.GZ, 7Z)
 */
export async function validateArchiveFile(file) {
  if (!file) return { valid: false, error: 'No archive provided.' };
  const name = file.name.toLowerCase();
  const bytes = await readHeaderBytes(file, 4);

  // PK\x03\x04 (ZIP)
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4B && (bytes[2] === 0x03 || bytes[2] === 0x05);
  // GZ header: 1F 8B
  const isGz = bytes[0] === 0x1F && bytes[1] === 0x8B;
  // 7z header: 37 7A BC AF 27 1C
  const is7z = bytes[0] === 0x37 && bytes[1] === 0x7A;

  const isTar = name.endsWith('.tar') || name.endsWith('.tar.gz') || name.endsWith('.tgz');

  if (is7z) {
    return { valid: false, error: '7z archives are not supported here — please use a .zip, .tar or .tar.gz file.' };
  }
  if (!isZip && !isGz && !isTar) {
    return { valid: false, error: 'Please select a valid archive file (.zip, .tar, .tar.gz).' };
  }

  return { valid: true, isZip, isGz, is7z, isTar };
}

/**
 * Universal validateFile dispatcher
 */
export async function validateFile(file, type = 'pdf', options = {}) {
  if (!file) return { isValid: false, valid: false, error: 'No file provided.' };
  
  let res;
  switch (type.toLowerCase()) {
    case 'pdf':
      res = await validatePdfFile(file);
      break;
    case 'image':
      res = await validateImageFile(file, options.allowedFormats);
      break;
    case 'audio':
      res = await validateAudioFile(file, options.allowed);
      break;
    case 'archive':
      res = await validateArchiveFile(file);
      break;
    default:
      res = { valid: true };
      break;
  }

  return {
    ...res,
    isValid: res.valid !== false,
    error: res.error || null,
  };
}

/**
 * Format bytes nicely
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}


