import { h, field, select, button, run, result, section, outName, dropzone, fileChip, range, notice, number, checkbox } from '../core/ui.js';
import { decodeAudio, sliceAudio, encodeWav, encodeM4a, drawWaveform, fmtTime, toMono, caps } from '../core/media.js';

export function mount(root) {
  let file = null, buffer = null, dur = 0;
  const chips = h('div'); const info = h('div.small.muted');
  const canvas = h('canvas', { width: 900, height: 160, style: { width: '100%', borderRadius: '8px', background: 'var(--surface-2)', cursor: 'crosshair' } });
  const startR = range(0, { min: 0, max: 100, step: 0.05, format: (v) => fmtTime((v / 100) * dur) }), endR = range(100, { min: 0, max: 100, step: 0.05, format: (v) => fmtTime((v / 100) * dur) });
  const fadeIn = number(0, { min: 0, max: 10, step: 0.1 }), fadeOut = number(0, { min: 0, max: 10, step: 0.1 });
  const gain = range(100, { min: 10, max: 300, format: (v) => v + '%' });
  const mono = checkbox('Mono', false);
  const format = select([['wav', 'WAV (lossless)'], ['m4a', 'M4A / AAC (ringtone-friendly)']], caps.audioEncoder ? 'm4a' : 'wav');
  const preset = select([['none', 'Custom'], ['30', 'Ringtone (max 30 s)'], ['40', 'iPhone ringtone (max 40 s)'], ['15', 'Notification (15 s)']], 'none');
  const player = h('audio', { controls: true, style: { width: '100%' } });
  const out = h('div');
  const draw = () => { if (!buffer) return; drawWaveform(canvas, buffer, { color: '#9aa8c7' }); const ctx = canvas.getContext('2d'); const x0 = (startR.getValue() / 100) * canvas.width, x1 = (endR.getValue() / 100) * canvas.width; ctx.fillStyle = 'rgba(46,107,255,.18)'; ctx.fillRect(x0, 0, x1 - x0, canvas.height); ctx.fillStyle = '#2e6bff'; ctx.fillRect(x0 - 1, 0, 2, canvas.height); ctx.fillRect(x1 - 1, 0, 2, canvas.height); info.textContent = `${fmtTime(dur)} total · selection ${fmtTime((startR.getValue() / 100) * dur)} → ${fmtTime((endR.getValue() / 100) * dur)} (${(((endR.getValue() - startR.getValue()) / 100) * dur).toFixed(2)} s)`; };
  startR.input.addEventListener('input', draw); endR.input.addEventListener('input', draw);
  preset.addEventListener('change', () => { if (preset.value === 'none' || !dur) return; const len = Math.min(Number(preset.value), dur); endR.setValue(((((startR.getValue() / 100) * dur) + len) / dur) * 100); draw(); });
  canvas.addEventListener('click', (e) => { if (!buffer) return; const r = canvas.getBoundingClientRect(); const p = ((e.clientX - r.left) / r.width) * 100; if (Math.abs(p - startR.getValue()) < Math.abs(p - endR.getValue())) startR.setValue(p); else endR.setValue(p); draw(); });
  const previewBtn = button('Preview selection', () => { if (!buffer) return; const b = sliceAudio(buffer, (startR.getValue() / 100) * dur, (endR.getValue() / 100) * dur, { fadeIn: Number(fadeIn.value), fadeOut: Number(fadeOut.value), gain: gain.getValue() / 100 }); player.src = URL.createObjectURL(new Blob([encodeWav(b)], { type: 'audio/wav' })); player.play(); });
  const go = button('Export', () => run(go, async () => {
    if (!buffer) throw new Error('Choose an audio file first.');
    let b = sliceAudio(buffer, (startR.getValue() / 100) * dur, (endR.getValue() / 100) * dur, { fadeIn: Number(fadeIn.value), fadeOut: Number(fadeOut.value), gain: gain.getValue() / 100 });
    if (mono.input.checked) b = toMono(b);
    if (format.value === 'wav') { const bytes = encodeWav(b); out.replaceChildren(result({ title: `WAV clip · ${b.duration.toFixed(2)} s`, data: bytes, name: outName(file, 'clip', 'wav'), mime: 'audio/wav', preview: h('audio', { src: URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' })), controls: true }) })); }
    else { const r = await encodeM4a(b); out.replaceChildren(notice(r.codec === 'opus' ? 'Encoded as Opus-in-MP4 (AAC is not available here). For an iPhone ringtone rename the file to .m4r after download.' : 'AAC-LC · rename to .m4r for an iPhone ringtone.', 'ok'), result({ title: `M4A clip · ${b.duration.toFixed(2)} s`, data: r.bytes, name: outName(file, 'ringtone', 'm4a'), mime: 'audio/mp4', preview: h('audio', { src: URL.createObjectURL(new Blob([r.bytes], { type: 'audio/mp4' })), controls: true }) })); }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose audio', dropzone({ accept: 'audio/*,video/mp4,.mp3,.wav,.ogg,.m4a,.aac,.flac,.opus,.webm', label: 'Drop an audio file (MP3, WAV, OGG, M4A, FLAC…)', onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); buffer = await decodeAudio(f); dur = buffer.duration; startR.setValue(0); endR.setValue(100); player.src = URL.createObjectURL(f); draw(); } }), chips), section('2. Selection', field('Preset', preset), field('Start', startR), field('End', endR), h('div.grid2', field('Fade in (s)', fadeIn), field('Fade out (s)', fadeOut)), field('Volume', gain), mono, previewBtn), section('3. Export', field('Format', format), notice('MP3 export is not offered (no from-scratch MP3 encoder); WAV and M4A/AAC play on every phone and desktop.'), go)), h('div', info, canvas, player, out)));
}
