import { audioConverter } from './_audio-convert.js';
import { notice } from '../core/ui.js';
export function mount(root) { audioConverter(root, { accept: '.m4a,.aac,.mp4,audio/mp4,audio/aac,audio/x-m4a', label: 'Drop M4A / AAC audio', intro: notice('AAC decoding is built into every modern browser; DRM-protected files (e.g. iTunes purchases) cannot be decoded.') }); }
