import { imageConverter } from './_image-convert.js';
import { notice } from '../core/ui.js';
export function mount(root) {
  imageConverter(root, { accept: '.avif,image/avif', label: 'Drop AVIF images', intro: notice('AVIF opens in all current versions of Chrome, Firefox, Edge and Safari (16.4+).'), decodeHint: 'this AVIF file could not be opened here.' });
}
