// Media engine (browser only). Video via WebCodecs + our MP4 muxer (fast, exact frames) with a MediaRecorder/WebM
// fallback; audio via Web Audio decodeAudioData, our own WAV writer, AAC/Opus via WebCodecs AudioEncoder.
import { Mp4Muxer, audioSpecificConfig } from './mp4.js';
import { ByteWriter } from './bytes.js';

export const caps = {
  get webCodecs() { return typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined'; },
  get audioEncoder() { return typeof AudioEncoder !== 'undefined' && typeof AudioData !== 'undefined'; },
  get mediaRecorder() { return typeof MediaRecorder !== 'undefined'; },
};

// ---------------- loading ----------------
export function loadVideo(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    const url = URL.createObjectURL(fileOrBlob);
    let settled = false;
    const finish = () => { if (settled) return; settled = true; if (!isFinite(v.duration) || v.duration === 0) { // duration=Infinity for some WebM (MediaRecorder output): force it
        v.currentTime = 1e9; v.addEventListener('timeupdate', function h() { v.removeEventListener('timeupdate', h); v.currentTime = 0; resolve(v); }, { once: true }); return; }
      resolve(v); };
    v.addEventListener('loadedmetadata', finish, { once: true });
    v.addEventListener('error', () => reject(new Error('The browser cannot decode this video (unsupported codec or container).')), { once: true });
    v.src = url; v.load();
  });
}
export function seekTo(video, t) {
  return new Promise((resolve) => {
    if (Math.abs(video.currentTime - t) < 1e-4 && video.readyState >= 2) return resolve();
    const done = () => { video.removeEventListener('seeked', done); resolve(); };
    video.addEventListener('seeked', done);
    video.currentTime = t;
  });
}
/** Iterate exact frames by seek-stepping. cb(canvas, timeSec, index) may be async. */
export async function eachFrame(video, { start = 0, end = null, fps = 30, width = null, height = null, onProgress = null, signal = null }, cb) {
  end = end == null ? video.duration : Math.min(end, video.duration);
  const w = width || video.videoWidth, hgt = height || video.videoHeight;
  if (!Number.isFinite(end) || end - start > 60 || (end - start) * fps > 1800 || w * hgt > 2073600) throw new Error('Video processing limit: 60 seconds, 1800 frames and 1920x1080 pixels.');
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = hgt;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  const total = Math.max(1, Math.round((end - start) * fps));
  for (let i = 0; i < total; i++) {
    if (signal?.aborted) throw new Error('Cancelled');
    const t = Math.min(start + i / fps, end - 1e-3);
    await seekTo(video, t);
    ctx.drawImage(video, 0, 0, w, hgt);
    await cb(canvas, t, i);
    if (onProgress) onProgress((i + 1) / total);
  }
  return total;
}

// ---------------- video encoding ----------------
export async function pickVideoCodec(width, height, { prefer = 'avc' } = {}) {
  if (!caps.webCodecs) return null;
  const candidates = prefer === 'vp9' ? ['vp09.00.10.08', 'avc1.4d0028', 'avc1.42001f'] : ['avc1.4d0028', 'avc1.42001f', 'avc1.640028', 'vp09.00.10.08'];
  for (const codec of candidates) {
    try { const cfg = { codec, width, height, bitrate: 2_000_000, framerate: 30 }; if (codec.startsWith('avc')) cfg.avc = { format: 'avc' }; const s = await VideoEncoder.isConfigSupported(cfg); if (s.supported) return codec; } catch { }
  }
  return null;
}
export function even(n) { return Math.max(2, Math.floor(n / 2) * 2); }
/**
 * Encode frames to MP4. frameSource: async function(pushFrame(canvasOrBitmap, tsUs, durUs)) that produces frames in order.
 * Returns Uint8Array (MP4). Throws if WebCodecs is unavailable.
 */
export async function encodeMp4({ width, height, fps = 30, bitrate = null, codec = null, frames, audio = null, keyInterval = 2, onProgress = null }) {
  if (!caps.webCodecs) throw new Error('This browser has no WebCodecs support. MP4 export needs Chrome 94+, Edge 94+, or Safari 16.4+ (WebM export is available instead).');
  width = even(width); height = even(height);
  codec = codec || (await pickVideoCodec(width, height));
  if (!codec) throw new Error('No supported H.264/VP9 encoder was found in this browser.');
  const muxer = new Mp4Muxer();
  muxer.setVideo({ codec, width, height });
  let error = null;
  const encoder = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => { error = e; } });
  const cfg = { codec, width, height, bitrate: bitrate || Math.round(Math.min(12e6, Math.max(400e3, width * height * fps * 0.12))), framerate: fps, latencyMode: 'quality' };
  if (codec.startsWith('avc')) cfg.avc = { format: 'avc' };
  encoder.configure(cfg);
  let i = 0;
  const gop = Math.max(1, Math.round(keyInterval * fps));
  await frames(async (source, tsUs, durUs) => {
    if (error) throw error;
    const frame = new VideoFrame(source, { timestamp: tsUs, duration: durUs });
    encoder.encode(frame, { keyFrame: i % gop === 0 });
    frame.close();
    i++;
    if (encoder.encodeQueueSize > 8) await new Promise((r) => { const check = () => (encoder.encodeQueueSize > 4 ? setTimeout(check, 10) : r()); check(); });
    if (onProgress) onProgress(i);
  });
  await encoder.flush();
  encoder.close();
  if (error) throw error;
  if (audio) await addAudioToMuxer(muxer, audio);
  return muxer.finish();
}
/** audio: { buffer: AudioBuffer } (or {channels:[Float32Array], sampleRate}) -> encoded with AudioEncoder (AAC preferred, Opus fallback) */
async function addAudioToMuxer(muxer, audio) {
  const enc = await encodeAudioChunks(audio);
  if (!enc) return;
  muxer.setAudio({ codec: enc.codec, sampleRate: enc.sampleRate, channels: enc.channels, description: enc.description, bitrate: enc.bitrate });
  for (const c of enc.chunks) muxer.addAudioChunk(c);
}
export async function pickAudioCodec(sampleRate, channels) {
  if (!caps.audioEncoder) return null;
  for (const codec of ['mp4a.40.2', 'opus']) {
    try { const s = await AudioEncoder.isConfigSupported({ codec, sampleRate: codec === 'opus' ? 48000 : sampleRate, numberOfChannels: Math.min(2, channels), bitrate: 128000 }); if (s.supported) return codec; } catch { }
  }
  return null;
}
/** Encode PCM (AudioBuffer-like) to AAC or Opus chunks. Returns {codec, chunks:[{data,timestamp,duration,type}], description, sampleRate, channels} or null */
export async function encodeAudioChunks(audio, { bitrate = 128000 } = {}) {
  const buffer = audio.buffer || audio;
  const channels = Math.min(2, buffer.numberOfChannels);
  let sampleRate = buffer.sampleRate;
  const codec = await pickAudioCodec(sampleRate, channels);
  if (!codec) return null;
  let planes = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c));
  if (codec === 'opus' && sampleRate !== 48000) { planes = await resample(planes, sampleRate, 48000); sampleRate = 48000; }
  const chunks = []; let description = null; let error = null;
  const enc = new AudioEncoder({ output: (chunk, meta) => { if (meta?.decoderConfig?.description && !description) { const d = meta.decoderConfig.description; description = new Uint8Array(d instanceof ArrayBuffer ? d : d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength)); } const data = new Uint8Array(chunk.byteLength); chunk.copyTo(data); chunks.push({ data, timestamp: chunk.timestamp, duration: chunk.duration || 0, type: 'key' }); }, error: (e) => { error = e; } });
  enc.configure({ codec, sampleRate, numberOfChannels: channels, bitrate });
  const total = planes[0].length;
  const block = 4096;
  for (let off = 0; off < total; off += block) {
    const n = Math.min(block, total - off);
    const data = new Float32Array(n * channels);
    for (let c = 0; c < channels; c++) data.set(planes[c].subarray(off, off + n), c * n);
    const ad = new AudioData({ format: 'f32-planar', sampleRate, numberOfFrames: n, numberOfChannels: channels, timestamp: Math.round((off / sampleRate) * 1e6), data });
    enc.encode(ad); ad.close();
    if (error) throw error;
  }
  await enc.flush(); enc.close();
  if (error) throw error;
  if (codec === 'mp4a.40.2' && !description) description = audioSpecificConfig(sampleRate, channels);
  return { codec, chunks, description, sampleRate, channels, bitrate };
}
/** Audio-only MP4 (.m4a) from an AudioBuffer. */
export async function encodeM4a(buffer, opts) {
  const enc = await encodeAudioChunks(buffer, opts);
  if (!enc) throw new Error('This browser cannot encode AAC/Opus (no WebCodecs AudioEncoder). WAV export is available instead.');
  const m = new Mp4Muxer();
  m.setAudio({ codec: enc.codec, sampleRate: enc.sampleRate, channels: enc.channels, description: enc.description, bitrate: enc.bitrate });
  for (const c of enc.chunks) m.addAudioChunk(c);
  return { bytes: m.finish(), codec: enc.codec };
}

// ---------------- MediaRecorder fallback (WebM) ----------------
/** Record canvas frames in real time to WebM. draw(t) is called per animation frame with elapsed seconds. */
export async function recordWebm({ canvas, duration, audioStream = null, fps = 30, draw, mimeType = null, onProgress = null }) {
  if (!caps.mediaRecorder) throw new Error('MediaRecorder is not available in this browser.');
  const stream = canvas.captureStream(fps);
  if (audioStream) for (const t of audioStream.getAudioTracks()) stream.addTrack(t);
  const types = mimeType ? [mimeType] : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  const type = types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
  const rec = new MediaRecorder(stream, type ? { mimeType: type, videoBitsPerSecond: 4_000_000 } : undefined);
  const parts = [];
  rec.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
  const done = new Promise((res) => (rec.onstop = res));
  rec.start(250);
  const t0 = performance.now();
  await new Promise((resolve) => {
    const tick = async () => {
      const t = (performance.now() - t0) / 1000;
      if (t >= duration) return resolve();
      await draw(t);
      if (onProgress) onProgress(t / duration);
      requestAnimationFrame(tick);
    };
    tick();
  });
  rec.stop();
  await done;
  let blob = new Blob(parts, { type: type || 'video/webm' });
  if (!/mp4/.test(type)) { try { blob = await fixWebmDuration(blob); } catch { } }
  return { blob, mimeType: type || 'video/webm', ext: /mp4/.test(type) ? 'mp4' : 'webm' };
}

// ---------------- WebM duration patch ----------------
// MediaRecorder writes a live WebM without a Duration element, so players show "∞" and cannot seek.
// We parse the EBML structure, read the last cluster/block timecode and insert Duration into Segment→Info.
export async function fixWebmDuration(blob, durationMs = null) {
  const b = new Uint8Array(await blob.arrayBuffer());
  const readVint = (p, keepMarker) => { const first = b[p]; if (first === undefined) return null; let len = 1; while (len <= 8 && !(first & (0x80 >> (len - 1)))) len++; if (len > 8) return null; let v = keepMarker ? first : first & (0xff >> len); for (let i = 1; i < len; i++) v = v * 256 + b[p + i]; const unknown = !keepMarker && v === 2 ** (7 * len) - 1; return { v, len, unknown }; };
  const readEl = (p) => { const id = readVint(p, true); if (!id) return null; const size = readVint(p + id.len, false); if (!size) return null; return { id: id.v, idLen: id.len, size: size.v, sizeLen: size.len, unknown: size.unknown, head: p, data: p + id.len + size.len }; };
  // top level: EBML header, Segment
  let p = 0; let segment = null;
  while (p < b.length) { const el = readEl(p); if (!el) break; if (el.id === 0x18538067) { segment = el; break; } p = el.data + el.size; }
  if (!segment) return blob;
  // walk Segment children
  let info = null, tsScale = 1000000, lastTime = 0; let q = segment.data; const end = segment.unknown ? b.length : segment.data + segment.size;
  while (q < end) {
    const el = readEl(q); if (!el) break;
    if (el.id === 0x1549A966) { info = el; // Info: read TimecodeScale + existing Duration
      let r = el.data; while (r < el.data + el.size) { const c = readEl(r); if (!c) break; if (c.id === 0x2AD7B1) { tsScale = 0; for (let i = 0; i < c.size; i++) tsScale = tsScale * 256 + b[c.data + i]; } if (c.id === 0x4489) return blob; r = c.data + c.size; } }
    if (el.id === 0x1F43B675) { // Cluster: Timecode + SimpleBlocks
      let r = el.data; const cend = el.unknown ? end : el.data + el.size; let ct = 0;
      while (r < cend) { const c = readEl(r); if (!c) break; if (c.id === 0xE7) { ct = 0; for (let i = 0; i < c.size; i++) ct = ct * 256 + b[c.data + i]; } else if (c.id === 0xA3 || c.id === 0xA0) { let bp = c.data; if (c.id === 0xA0) { const blk = readEl(c.data); if (!blk || blk.id !== 0xA1) { r = c.data + c.size; continue; } bp = blk.data; } const tn = readVint(bp, false); const rel = (b[bp + tn.len] << 8) | b[bp + tn.len + 1]; lastTime = Math.max(lastTime, ct + (rel << 16 >> 16)); } else if (c.id === 0x1F43B675 || c.id === 0x1C53BB6B) break; r = c.data + c.size; }
    }
    if (el.unknown) { q = el.data; continue; }
    q = el.data + el.size;
  }
  if (!info) return blob;
  const ms = durationMs != null ? durationMs : lastTime * (tsScale / 1e6) + 40;
  // Duration element: ID 0x4489, size 8, float64 in timecode-scale units
  const dur = new Uint8Array(2 + 1 + 8); dur[0] = 0x44; dur[1] = 0x89; dur[2] = 0x88; new DataView(dur.buffer).setFloat64(3, ms / (tsScale / 1e6));
  const newSize = info.size + dur.length;
  // encode new size with the same vint length if possible (else 8-byte vint)
  const sizeLen = newSize < 2 ** (7 * info.sizeLen) - 1 ? info.sizeLen : 8;
  const sizeBytes = new Uint8Array(sizeLen); let v = newSize; for (let i = sizeLen - 1; i >= 0; i--) { sizeBytes[i] = v & 0xff; v = Math.floor(v / 256); } sizeBytes[0] |= 0x80 >> (sizeLen - 1);
  const out = new Uint8Array(b.length - info.sizeLen + sizeLen + dur.length);
  let o = 0;
  out.set(b.subarray(0, info.head + info.idLen), o); o += info.head + info.idLen;
  out.set(sizeBytes, o); o += sizeLen;
  out.set(b.subarray(info.data, info.data + info.size), o); o += info.size;
  out.set(dur, o); o += dur.length;
  out.set(b.subarray(info.data + info.size), o);
  return new Blob([out], { type: blob.type });
}

// ---------------- audio ----------------
export async function decodeAudio(fileOrBytes) {
  const buf = fileOrBytes instanceof Uint8Array ? fileOrBytes.buffer.slice(fileOrBytes.byteOffset, fileOrBytes.byteOffset + fileOrBytes.byteLength) : await fileOrBytes.arrayBuffer();
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  try { const audio = await ctx.decodeAudioData(buf.slice(0)); if (audio.duration > 300 || audio.length * audio.numberOfChannels > 32000000) throw new RangeError('Audio exceeds 5 minutes or 32 million decoded samples.'); return audio; }
  catch (e) { if (e instanceof RangeError) throw e; throw new Error('The browser could not decode this audio (unsupported codec/container). Try MP3, WAV, OGG/Opus, M4A/AAC, FLAC or WebM.'); }
  finally { ctx.close?.(); }
}
export function sliceAudio(buffer, start, end, { fadeIn = 0, fadeOut = 0, gain = 1 } = {}) {
  const sr = buffer.sampleRate;
  const s = Math.max(0, Math.floor(start * sr)), e = Math.min(buffer.length, Math.ceil(end * sr));
  const n = Math.max(1, e - s);
  const out = makeBuffer(buffer.numberOfChannels, n, sr);
  const fi = Math.floor(fadeIn * sr), fo = Math.floor(fadeOut * sr);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c).subarray(s, e), dst = out.getChannelData(c);
    for (let i = 0; i < n; i++) { let g = gain; if (i < fi) g *= i / fi; if (i > n - fo) g *= (n - i) / fo; dst[i] = src[i] * g; }
  }
  return out;
}
export function makeBuffer(channels, length, sampleRate) {
  const planes = Array.from({ length: channels }, () => new Float32Array(length));
  return { numberOfChannels: channels, length, sampleRate, duration: length / sampleRate, getChannelData: (c) => planes[c] };
}
export function toMono(buffer) { if (buffer.numberOfChannels === 1) return buffer; const out = makeBuffer(1, buffer.length, buffer.sampleRate); const d = out.getChannelData(0); for (let c = 0; c < buffer.numberOfChannels; c++) { const s = buffer.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] += s[i] / buffer.numberOfChannels; } return out; }
/** PCM WAV (16-bit or 24-bit or 32-bit float). */
export function encodeWav(buffer, { bits = 16 } = {}) {
  const ch = buffer.numberOfChannels, n = buffer.length, sr = buffer.sampleRate;
  const bytesPer = bits / 8, dataLen = n * ch * bytesPer;
  const w = new ByteWriter(44 + dataLen);
  w.str('RIFF').u32le(36 + dataLen).str('WAVE').str('fmt ').u32le(16).u16le(bits === 32 ? 3 : 1).u16le(ch).u32le(sr).u32le(sr * ch * bytesPer).u16le(ch * bytesPer).u16le(bits).str('data').u32le(dataLen);
  const planes = Array.from({ length: ch }, (_, c) => buffer.getChannelData(c));
  const view = new DataView(w.buf.buffer);
  let p = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
    const s = Math.max(-1, Math.min(1, planes[c][i]));
    if (bits === 16) { view.setInt16(p, s < 0 ? s * 32768 : s * 32767, true); p += 2; }
    else if (bits === 24) { const v = Math.round(s < 0 ? s * 8388608 : s * 8388607); view.setUint8(p, v & 255); view.setUint8(p + 1, (v >> 8) & 255); view.setUint8(p + 2, (v >> 16) & 255); p += 3; }
    else { view.setFloat32(p, s, true); p += 4; }
  }
  w.len = 44 + dataLen;
  return w.result();
}
export async function resample(planes, from, to) {
  if (from === to) return planes;
  const n = Math.round((planes[0].length * to) / from);
  const ctx = new OfflineAudioContext(planes.length, n, to);
  const buf = ctx.createBuffer(planes.length, planes[0].length, from);
  planes.forEach((p, i) => buf.copyToChannel(p, i));
  const src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination); src.start();
  const out = await ctx.startRendering();
  return Array.from({ length: out.numberOfChannels }, (_, c) => out.getChannelData(c));
}
/** WSOLA time-stretch (pitch preserving). rate>1 = faster. */
export function timeStretch(buffer, rate, { windowMs = 40, seekMs = 12 } = {}) {
  if (Math.abs(rate - 1) < 1e-3) return buffer;
  const sr = buffer.sampleRate, ch = buffer.numberOfChannels;
  const win = Math.round((windowMs / 1000) * sr), hop = Math.round(win / 2), seek = Math.round((seekMs / 1000) * sr);
  const outLen = Math.floor(buffer.length / rate);
  const out = makeBuffer(ch, outLen, sr);
  const hann = new Float32Array(win); for (let i = 0; i < win; i++) hann[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (win - 1));
  const mono = toMono(buffer).getChannelData(0);
  const planes = Array.from({ length: ch }, (_, c) => buffer.getChannelData(c));
  const outs = Array.from({ length: ch }, (_, c) => out.getChannelData(c));
  const norm = new Float32Array(outLen);
  let prevEnd = null; // last "win" samples of previous overlap from mono for correlation
  for (let o = 0; o + win <= outLen; o += hop) {
    let pos = Math.round(o * rate);
    if (prevEnd) { // search around pos for best alignment to natural continuation
      let best = 0, bestScore = -Infinity;
      for (let d = -seek; d <= seek; d += 4) { const p = pos + d; if (p < 0 || p + hop > mono.length) continue; let s = 0; for (let i = 0; i < hop; i += 2) s += mono[p + i] * prevEnd[i]; if (s > bestScore) { bestScore = s; best = d; } }
      pos += best;
    }
    if (pos + win > mono.length) pos = Math.max(0, mono.length - win);
    for (let c = 0; c < ch; c++) for (let i = 0; i < win; i++) outs[c][o + i] += planes[c][pos + i] * hann[i];
    for (let i = 0; i < win; i++) norm[o + i] += hann[i];
    prevEnd = mono.subarray(pos + hop, pos + hop + hop);
  }
  for (let c = 0; c < ch; c++) for (let i = 0; i < outLen; i++) if (norm[i] > 1e-4) outs[c][i] /= norm[i];
  return out;
}
export function bufferToMediaStream(buffer) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const b = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) b.copyToChannel(buffer.getChannelData(c), c);
  const src = ctx.createBufferSource(); src.buffer = b;
  const dest = ctx.createMediaStreamDestination(); src.connect(dest);
  return { stream: dest.stream, start: () => src.start(), stop: () => { try { src.stop(); } catch { } ctx.close(); } };
}
export function drawWaveform(canvas, buffer, { color = '#2e6bff', bg = 'transparent', start = 0, end = null } = {}) {
  const ctx = canvas.getContext('2d'); const w = canvas.width, hgt = canvas.height;
  ctx.clearRect(0, 0, w, hgt); if (bg !== 'transparent') { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, hgt); }
  const data = toMono(buffer).getChannelData(0);
  const s = Math.floor(start * buffer.sampleRate), e = Math.floor((end == null ? buffer.duration : end) * buffer.sampleRate);
  const per = Math.max(1, Math.floor((e - s) / w));
  ctx.fillStyle = color;
  for (let x = 0; x < w; x++) { let min = 1, max = -1; const base = s + x * per; for (let i = 0; i < per; i += Math.max(1, Math.floor(per / 64))) { const v = data[base + i] || 0; if (v < min) min = v; if (v > max) max = v; } const y1 = ((1 - max) / 2) * hgt, y2 = ((1 - min) / 2) * hgt; ctx.fillRect(x, y1, 1, Math.max(1, y2 - y1)); }
}
export const fmtTime = (s) => { if (!isFinite(s)) return '0:00'; const m = Math.floor(s / 60), sec = s - m * 60; return `${m}:${sec < 10 ? '0' : ''}${sec.toFixed(2)}`; };
