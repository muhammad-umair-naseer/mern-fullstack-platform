import { h, field, select, button, run, result, section, outName, dropzone, fileChip, range, notice, progress, number, checkbox } from '../core/ui.js';
import { loadVideo, eachFrame, encodeMp4, recordWebm, decodeAudio, sliceAudio, caps, even, bufferToMediaStream, fmtTime } from '../core/media.js';

export function mount(root) {
  let file = null, video = null, dur = 0;
  const chips = h('div'); const info = h('div.small.muted');
  const start = number(0, { min: 0, step: 0.1 }), end = number(0, { min: 0, step: 0.1 });
  const startR = range(0, { min: 0, max: 100, step: 0.1, format: (v) => fmtTime((v / 100) * dur) }), endR = range(100, { min: 0, max: 100, step: 0.1, format: (v) => fmtTime((v / 100) * dur) });
  const container = select([['mp4', 'MP4'], ['webm', 'WebM']], caps.webCodecs ? 'mp4' : 'webm');
  const maxH = select([[0, 'Original'], [1080, '1080p'], [720, '720p'], [480, '480p']], 0);
  const fps = select([[30, '30 fps'], [24, '24 fps'], [60, '60 fps'], [15, '15 fps']], 30);
  const keepAudio = checkbox('Keep audio', true);
  const player = h('video', { controls: true, playsInline: true, style: { width: '100%', borderRadius: '8px', background: '#000' } });
  const prog = progress(); const out = h('div');
  const sync = (fromRange) => { if (!dur) return; if (fromRange) { start.value = ((startR.getValue() / 100) * dur).toFixed(2); end.value = ((endR.getValue() / 100) * dur).toFixed(2); } else { startR.setValue((Number(start.value) / dur) * 100); endR.setValue((Number(end.value) / dur) * 100); } if (video) { try { player.currentTime = Number(start.value); } catch { } } };
  startR.input.addEventListener('input', () => sync(true)); endR.input.addEventListener('input', () => sync(true)); start.addEventListener('input', () => sync(false)); end.addEventListener('input', () => sync(false));
  const setIn = button('Set start = player time', () => { start.value = player.currentTime.toFixed(2); sync(false); }, 'small'), setOut = button('Set end = player time', () => { end.value = player.currentTime.toFixed(2); sync(false); }, 'small');
  const go = button('Trim & export', () => run(go, async () => {
    if (!video) throw new Error('Choose a video first.');
    const s = Number(start.value), e = Number(end.value);
    if (!(e > s)) throw new Error('End must be after start.');
    const sc = Number(maxH.value) && video.videoHeight > Number(maxH.value) ? Number(maxH.value) / video.videoHeight : 1;
    const w = even(video.videoWidth * sc), hgt = even(video.videoHeight * sc); const f = Number(fps.value);
    let audio = null; if (keepAudio.input.checked) { try { audio = sliceAudio(await decodeAudio(file), s, e); } catch { audio = null; } }
    if (container.value === 'mp4') {
      if (!caps.webCodecs) throw new Error('MP4 export works in Chrome, Edge and Safari 16.4+; elsewhere choose WebM.');
      const bytes = await encodeMp4({ width: w, height: hgt, fps: f, audio, frames: async (push) => { await eachFrame(video, { start: s, end: e, fps: f, width: w, height: hgt, onProgress: (p) => prog.set(p, `Encoding ${Math.round(p * 100)}%`) }, async (canvas, t) => push(canvas, Math.round((t - s) * 1e6), Math.round(1e6 / f))); } });
      prog.done();
      out.replaceChildren(result({ title: `Clip ${fmtTime(s)} → ${fmtTime(e)} (${(e - s).toFixed(1)} s)`, data: bytes, name: outName(file, 'trimmed', 'mp4'), mime: 'video/mp4', note: audio ? 'with audio' : 'no audio', preview: h('video', { src: URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' })), controls: true, playsInline: true }) }));
    } else {
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = hgt; const ctx = canvas.getContext('2d');
      const ms = audio ? bufferToMediaStream(audio) : null;
      video.currentTime = s; await new Promise((r) => video.addEventListener('seeked', r, { once: true }));
      video.muted = true; await video.play(); ms?.start();
      const r = await recordWebm({ canvas, duration: e - s, fps: f, audioStream: ms?.stream, onProgress: (p) => prog.set(p, 'Recording…'), draw: () => ctx.drawImage(video, 0, 0, w, hgt) });
      video.pause(); ms?.stop(); prog.done();
      out.replaceChildren(result({ title: `Clip ${fmtTime(s)} → ${fmtTime(e)}`, data: r.blob, name: outName(file, 'trimmed', r.ext), mime: r.mimeType, preview: h('video', { src: URL.createObjectURL(r.blob), controls: true, playsInline: true }) }));
    }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose video', dropzone({ accept: 'video/*,.mp4,.webm,.mov,.mkv', onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); video = await loadVideo(f); dur = video.duration; player.src = video.src; end.value = dur.toFixed(2); start.value = '0'; startR.setValue(0); endR.setValue(100); info.textContent = `${video.videoWidth}×${video.videoHeight}, ${fmtTime(dur)}`; } }), chips, info), section('2. Trim range', field('Start', startR), field('End', endR), h('div.grid2', field('Start (s)', start), field('End (s)', end)), h('div.row', setIn, setOut)), section('3. Export', field('Format', container), h('div.grid2', field('Resolution', maxH), field('Frame rate', fps)), keepAudio, notice(caps.webCodecs ? 'Frame-accurate: the clip is re-encoded, not copied, so the cut lands exactly where you set it.' : 'MP4 is not available here — WebM output in real time.', caps.webCodecs ? 'note' : 'warn'), go, prog)), h('div', player, out)));
}
