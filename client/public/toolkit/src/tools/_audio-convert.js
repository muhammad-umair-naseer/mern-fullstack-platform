import { h, field, select, button, run, result, section, outName, dropzone, fileChip, range, notice, checkbox, number } from '../core/ui.js';
import { decodeAudio, encodeWav, encodeM4a, sliceAudio, toMono, caps, fmtTime } from '../core/media.js';

export function audioConverter(root, { accept, label, intro }) {
  let file = null, buffer = null; const chips = h('div'); const info = h('div.small.muted');
  const format = select([['wav', 'WAV (PCM, lossless, universal)'], ['m4a', 'M4A / AAC (small, plays everywhere)'], ...(caps.audioEncoder ? [] : [])], 'wav');
  const bits = select([[16, '16-bit'], [24, '24-bit'], [32, '32-bit float']], 16);
  const mono = checkbox('Downmix to mono', false);
  const normalize = checkbox('Normalise peak to −1 dB', false);
  const trimStart = number(0, { min: 0, step: 0.1 }), trimEnd = number(0, { min: 0, step: 0.1 });
  const out = h('div');
  const go = button('Convert', () => run(go, async () => {
    if (!buffer) throw new Error('Choose an audio file first.');
    let b = buffer;
    const s = Number(trimStart.value), e = Number(trimEnd.value) || b.duration;
    if (s > 0 || e < b.duration) b = sliceAudio(b, s, Math.min(e, b.duration));
    if (mono.input.checked) b = toMono(b);
    if (normalize.input.checked) { let peak = 0; for (let c = 0; c < b.numberOfChannels; c++) for (const v of b.getChannelData(c)) { const a = Math.abs(v); if (a > peak) peak = a; } if (peak > 0) { const g = Math.pow(10, -1 / 20) / peak; b = sliceAudio(b, 0, b.duration, { gain: g }); } }
    if (format.value === 'wav') { const bytes = encodeWav(b, { bits: Number(bits.value) }); out.replaceChildren(result({ title: `WAV · ${b.sampleRate} Hz · ${b.numberOfChannels} ch`, data: bytes, name: outName(file, '', 'wav'), mime: 'audio/wav', preview: h('audio', { src: URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' })), controls: true }) })); }
    else { const r = await encodeM4a(b); out.replaceChildren(notice(r.codec === 'opus' ? 'Encoded as Opus-in-MP4 (AAC is not available here).' : 'Encoded as AAC-LC 128 kbps.'), result({ title: `M4A · ${b.sampleRate} Hz`, data: r.bytes, name: outName(file, '', 'm4a'), mime: 'audio/mp4', preview: h('audio', { src: URL.createObjectURL(new Blob([r.bytes], { type: 'audio/mp4' })), controls: true }) })); }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose audio', intro, dropzone({ accept, onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); buffer = await decodeAudio(f); info.textContent = `${fmtTime(buffer.duration)} · ${buffer.sampleRate} Hz · ${buffer.numberOfChannels} channel(s)`; trimEnd.value = buffer.duration.toFixed(1); } }), chips, info), section('2. Output', field('Format', format), field('WAV bit depth', bits), h('div.grid2', field('Trim start (s)', trimStart), field('Trim end (s)', trimEnd)), mono, normalize, notice('MP3 is not offered. WAV plays everywhere and M4A/AAC is the compact, universally supported alternative.', 'warn'), go)), h('div', out)));
}
