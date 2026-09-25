import { imageConverter } from './_image-convert.js';
import { notice } from '../core/ui.js';
export function mount(root) {
  const canDecode = 'HEIC/HEIF photos open in Safari (macOS/iOS) and on systems with HEIF support. Chrome and Firefox on Windows/Linux currently cannot open HEIC — the tool will tell you if a file cannot be read.';
  imageConverter(root, { accept: '.heic,.heif,image/heic,image/heif', label: 'Drop HEIC / HEIF photos', intro: notice(canDecode, 'warn'), decodeHint: 'HEIC could not be opened here. Try Safari, or convert on an iPhone (Settings → Camera → Formats → Most Compatible).' });
}
