import { h, field, select, button, run, result, section, outName, dropzone, fileChip, range, notice, progress, number, checkbox } from '../core/ui.js';
import { loadVideo, eachFrame, encodeMp4, recordWebm, decodeAudio, caps, even, bufferToMediaStream } from '../core/media.js';

export function mount(root) {
  let file = null, video = null; const chips = h('div'); const info = h('div.small.muted');
  const target = select([['mp4', 'MP4 (H.264/VP9 + AAC/Opus)'], ['webm', 'WebM (VP8/VP9 + Opus)']], 'mp4');
  const maxH = select([[0, 'Original'], [1080, '1080p'], [720, '720p'], [480, '480p'], [360, '360p']], 0);
  const fps = select([['auto', 'Auto (30)'], [24, '24'], [25, '25'], [30, '30'], [60, '60']], 'auto');
  const quality = range(5, { min: 1, max: 10, format: (v) => ['', 'tiny', 'low', 'low', 'medium', 'medium', 'good', 'good', 'high', 'high', 'max'][v] });
  const keepAudio = checkbox('Keep audio', true);
  const prog = progress(); const out = h('div');
  const go = button('Convert', () => run(go, async () => {
    if (!video) throw new Error('Choose a video first.');
    const s = Number(maxH.value) && video.videoHeight > Number(maxH.value) ? Number(maxH.value) / video.videoHeight : 1;
    const w = even(video.videoWidth * s), hgt = even(video.videoHeight * s);
    const f = fps.value === 'auto' ? 30 : Number(fps.value);
    const bitrate = Math.round(w * hgt * f * (0.02 + quality.getValue() * 0.025));
    let audio = null;
    if (keepAudio.input.checked) { try { audio = await decodeAudio(file); } catch { audio = null; } }
    if (target.value === 'mp4') {
      if (!caps.webCodecs) throw new Error('MP4 export works in Chrome 94+, Edge and Safari 16.4+; elsewhere choose WebM.');
      const bytes = await encodeMp4({ width: w, height: hgt, fps: f, bitrate, audio, onProgress: null, frames: async (push) => { await eachFrame(video, { fps: f, width: w, height: hgt, onProgress: (p) => prog.set(p, `Encoding ${Math.round(p * 100)}%`) }, async (canvas, t) => push(canvas, Math.round(t * 1e6), Math.round(1e6 / f))); } });
      prog.done();
      out.replaceChildren(result({ title: `${w}×${hgt} MP4`, data: bytes, name: outName(file, '', 'mp4'), mime: 'video/mp4', note: audio ? 'with audio' : 'no audio', preview: h('video', { src: URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' })), controls: true, playsInline: true }) }));
    } else {
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = hgt; const ctx = canvas.getContext('2d');
      const ms = audio ? bufferToMediaStream(audio) : null;
      video.currentTime = 0; await new Promise((r) => video.addEventListener('seeked', r, { once: true }));
      video.muted = true; await video.play(); ms?.start();
      const r = await recordWebm({ canvas, duration: video.duration, fps: f, audioStream: ms?.stream, onProgress: (p) => prog.set(p, 'Recording…'), draw: () => ctx.drawImage(video, 0, 0, w, hgt) });
      video.pause(); ms?.stop(); prog.done();
      out.replaceChildren(notice('WebM is recorded in real time (duration = video length).'), result({ title: `${w}×${hgt} WebM`, data: r.blob, name: outName(file, '', r.ext), mime: r.mimeType, preview: h('video', { src: URL.createObjectURL(r.blob), controls: true, playsInline: true }) }));
    }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose video', dropzone({ accept: 'video/*,.webm,.mp4,.mov,.mkv', onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); video = await loadVideo(f); info.textContent = `${video.videoWidth}×${video.videoHeight}, ${video.duration.toFixed(1)} s`; target.value = /webm/i.test(f.name) || f.type === 'video/webm' ? 'mp4' : 'webm'; } }), chips, info), section('2. Output', field('Convert to', target), h('div.grid2', field('Resolution', maxH), field('Frame rate', fps)), field('Quality', quality), keepAudio, notice(caps.webCodecs ? 'The video is re-encoded at the resolution and quality you choose.' : 'MP4 is not available here: only WebM output is available.', caps.webCodecs ? 'note' : 'warn'), go, prog)), h('div', out)));
}
