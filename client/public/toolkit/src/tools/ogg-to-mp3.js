import { audioConverter } from './_audio-convert.js';
import { notice } from '../core/ui.js';
export function mount(root) { audioConverter(root, { accept: '.ogg,.oga,.opus,audio/ogg,audio/opus,.webm', label: 'Drop OGG / Opus audio', intro: notice('OGG Vorbis and Opus open in Chrome, Firefox and Edge (Safari 17+ for Opus).') }); }
