import { h, field, select, button, run, result, section, outName, dropzone, fileChip, readAs, notice, progress } from '../core/ui.js';
import { mp4Info, removeAudioTracks } from '../core/mp4.js';
import { loadVideo, eachFrame, encodeMp4, recordWebm, caps, even } from '../core/media.js';

export function mount(root) {
  let file = null, bytes = null, info = null; const chips = h('div'); const details = h('div');
  const prog = progress(); const out = h('div');
  const go = button('Remove audio', () => run(go, async () => {
    if (!file) throw new Error('Choose a video first.');
    if (info && info.hasVideo) {
      if (!info.hasAudio) throw new Error('This file has no audio track.');
      const muted = removeAudioTracks(bytes);
      out.replaceChildren(notice('Audio track removed losslessly — the video stream was copied bit-for-bit (no re-encoding, no quality loss).', 'ok'), result({ title: 'Muted video', data: muted, name: outName(file, 'muted', /\.mov$/i.test(file.name) ? 'mov' : 'mp4'), mime: 'video/mp4', preview: h('video', { src: URL.createObjectURL(new Blob([muted], { type: 'video/mp4' })), controls: true, playsInline: true }) }));
      return;
    }
    // non-MP4 (e.g. WebM/MKV): re-encode frames only
    const video = await loadVideo(file);
    const w = even(video.videoWidth), hgt = even(video.videoHeight);
    if (caps.webCodecs) {
      const mp4 = await encodeMp4({ width: w, height: hgt, fps: 30, frames: async (push) => { await eachFrame(video, { fps: 30, width: w, height: hgt, onProgress: (p) => prog.set(p, `Re-encoding ${Math.round(p * 100)}%`) }, async (c, t) => push(c, Math.round(t * 1e6), Math.round(1e6 / 30))); } });
      prog.done();
      out.replaceChildren(notice('This container is not MP4/MOV, so the video was re-encoded without audio and written to MP4.', 'note'), result({ title: 'Muted video (re-encoded)', data: mp4, name: outName(file, 'muted', 'mp4'), mime: 'video/mp4', preview: h('video', { src: URL.createObjectURL(new Blob([mp4], { type: 'video/mp4' })), controls: true, playsInline: true }) }));
    } else {
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = hgt; const ctx = canvas.getContext('2d');
      video.currentTime = 0; video.muted = true; await video.play();
      const r = await recordWebm({ canvas, duration: video.duration, fps: 30, onProgress: (p) => prog.set(p, 'Recording…'), draw: () => ctx.drawImage(video, 0, 0, w, hgt) });
      video.pause(); prog.done();
      out.replaceChildren(result({ title: 'Muted video (WebM)', data: r.blob, name: outName(file, 'muted', r.ext), mime: r.mimeType, preview: h('video', { src: URL.createObjectURL(r.blob), controls: true, playsInline: true }) }));
    }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose video', dropzone({ accept: 'video/*,.mp4,.m4v,.mov,.webm,.mkv', onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); bytes = await readAs(f); try { info = mp4Info(bytes); } catch { info = null; } details.replaceChildren(info && info.hasVideo ? h('dl.kv', ...[['Container', 'MP4 / QuickTime' + (info.fragmented ? ' (fragmented)' : '')], ['Tracks', info.tracks.map((t) => `${t.handler} ${t.codec}${t.width ? ` ${t.width}×${t.height}` : ''}`).join(', ')], ['Audio', info.hasAudio ? 'yes → will be removed losslessly' : 'none'], ['Duration', info.duration ? info.duration.toFixed(1) + ' s' : '—']].flatMap(([k, v]) => [h('dt', k), h('dd', v)])) : notice('Not an MP4/MOV container — the video will be re-encoded without audio.', 'warn')); } }), chips, details), section('2. Mute', notice('MP4/MOV files are rewritten by the built-in MP4 parser: the audio track is dropped and all sample tables/offsets are fixed, leaving the video bytes untouched.'), go, prog)), h('div', out)));
}
