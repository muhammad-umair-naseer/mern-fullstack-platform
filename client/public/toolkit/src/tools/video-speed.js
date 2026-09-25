import { h, field, select, button, run, result, section, outName, dropzone, fileChip, range, notice, progress, checkbox } from '../core/ui.js';
import { loadVideo, eachFrame, encodeMp4, recordWebm, decodeAudio, timeStretch, caps, even, bufferToMediaStream, fmtTime } from '../core/media.js';

export function mount(root) {
  let file = null, video = null; const chips = h('div'); const info = h('div.small.muted');
  const speed = select([[0.25, '0.25× (slow motion)'], [0.5, '0.5×'], [0.75, '0.75×'], [1.25, '1.25×'], [1.5, '1.5×'], [2, '2×'], [3, '3×'], [4, '4×']], 2);
  const maxH = select([[0, 'Original'], [1080, '1080p'], [720, '720p'], [480, '480p']], 0);
  const fps = select([[30, '30 fps'], [24, '24 fps'], [60, '60 fps']], 30);
  const keepAudio = checkbox('Keep audio (pitch-preserving time-stretch)', true);
  const container = select([['mp4', 'MP4'], ['webm', 'WebM']], caps.webCodecs ? 'mp4' : 'webm');
  const prog = progress(); const out = h('div');
  const go = button('Apply speed', () => run(go, async () => {
    if (!video) throw new Error('Choose a video first.');
    const rate = Number(speed.value); const f = Number(fps.value);
    const sc = Number(maxH.value) && video.videoHeight > Number(maxH.value) ? Number(maxH.value) / video.videoHeight : 1;
    const w = even(video.videoWidth * sc), hgt = even(video.videoHeight * sc);
    const outDur = video.duration / rate;
    let audio = null; if (keepAudio.input.checked) { try { prog.set(0, 'Stretching audio…'); audio = timeStretch(await decodeAudio(file), rate); } catch { audio = null; } }
    if (container.value === 'mp4') {
      if (!caps.webCodecs) throw new Error('MP4 export is not available here. Choose WebM instead.');
      // sample source at (output fps × rate) so each output frame maps to source time t*rate
      const bytes = await encodeMp4({ width: w, height: hgt, fps: f, audio, frames: async (push) => { const total = Math.round(outDur * f); for (let i = 0; i < total; i++) { const tOut = i / f; const tSrc = Math.min(video.duration - 1e-3, tOut * rate); await seek(video, tSrc); const c = frameCanvas(video, w, hgt); await push(c, Math.round(tOut * 1e6), Math.round(1e6 / f)); prog.set(i / total, `Encoding ${Math.round((i / total) * 100)}%`); } } });
      prog.done();
      out.replaceChildren(result({ title: `${rate}× · ${fmtTime(outDur)}`, data: bytes, name: outName(file, `${rate}x`, 'mp4'), mime: 'video/mp4', note: audio ? 'audio time-stretched' : 'no audio', preview: h('video', { src: URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' })), controls: true, playsInline: true }) }));
    } else {
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = hgt; const ctx = canvas.getContext('2d');
      const ms = audio ? bufferToMediaStream(audio) : null;
      video.currentTime = 0; video.muted = true; video.playbackRate = Math.min(4, Math.max(0.25, rate)); await video.play(); ms?.start();
      const r = await recordWebm({ canvas, duration: outDur, fps: f, audioStream: ms?.stream, onProgress: (p) => prog.set(p, 'Recording…'), draw: () => ctx.drawImage(video, 0, 0, w, hgt) });
      video.pause(); video.playbackRate = 1; ms?.stop(); prog.done();
      out.replaceChildren(result({ title: `${rate}× WebM`, data: r.blob, name: outName(file, `${rate}x`, r.ext), mime: r.mimeType, preview: h('video', { src: URL.createObjectURL(r.blob), controls: true, playsInline: true }) }));
    }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose video', dropzone({ accept: 'video/*,.mp4,.webm,.mov,.mkv', onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); video = await loadVideo(f); info.textContent = `${video.videoWidth}×${video.videoHeight}, ${fmtTime(video.duration)}`; } }), chips, info), section('2. Speed', field('Speed', speed), h('div.grid2', field('Resolution', maxH), field('Frame rate', fps)), keepAudio, field('Format', container), notice('Audio is time-stretched with a built-in WSOLA algorithm so voices keep their pitch.'), go, prog)), h('div', out)));
}
let frameCache = null;
function frameCanvas(video, w, hgt) { if (!frameCache || frameCache.width !== w || frameCache.height !== hgt) { frameCache = document.createElement('canvas'); frameCache.width = w; frameCache.height = hgt; } frameCache.getContext('2d').drawImage(video, 0, 0, w, hgt); return frameCache; }
function seek(video, t) { return new Promise((resolve) => { if (Math.abs(video.currentTime - t) < 1e-4) return resolve(); video.addEventListener('seeked', () => resolve(), { once: true }); video.currentTime = t; }); }
