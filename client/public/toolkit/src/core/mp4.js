// ISO BMFF (MP4/M4A/MOV) support written from scratch:
//  - parseBoxes(): light box tree parser
//  - mp4Info(): track summary (codecs, durations)
//  - removeAudioTracks(): lossless muting (drops 'soun' tracks, fixes stco/co64/moof offsets)
//  - Mp4Muxer: writes a non-fragmented MP4 from WebCodecs EncodedVideoChunk / EncodedAudioChunk data
import { concat, be32, be16, latin1, ByteWriter } from './bytes.js';

const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'dinf', 'edts', 'udta', 'moof', 'traf', 'mvex', 'meta', 'ipro', 'sinf', 'schi', 'stsd', 'wave', 'mfra']);
const be64 = (b, p) => Number((BigInt(be32(b, p)) << 32n) | BigInt(be32(b, p + 4)));

/** Parse boxes in [start,end). Returns [{type, start, end, hdr, children?}] (children parsed for known containers). */
export function parseBoxes(b, start = 0, end = b.length, depth = 0) {
  const out = [];
  let p = start;
  while (p + 8 <= end) {
    let size = be32(b, p), hdr = 8;
    const type = latin1.decode(b.subarray(p + 4, p + 8));
    if (size === 1) { size = be64(b, p + 8); hdr = 16; }
    else if (size === 0) size = end - p;
    if (size < hdr || p + size > end) { out.push({ type, start: p, end, hdr, truncated: true }); break; }
    const box = { type, start: p, end: p + size, hdr };
    if (CONTAINERS.has(type) && depth < 12) {
      let cs = p + hdr;
      if (type === 'meta') cs += 4; // full box
      if (type === 'stsd') cs += 8; // full box + entry count
      box.children = parseBoxes(b, cs, p + size, depth + 1);
    }
    out.push(box);
    p += size;
  }
  return out;
}
export const findBox = (list, type) => (list || []).find((x) => x.type === type);
export const findBoxes = (list, type) => (list || []).filter((x) => x.type === type);
const path = (box, ...types) => { let cur = box; for (const t of types) { cur = findBox(cur.children, t); if (!cur) return null; } return cur; };

export function isMp4(b) { return b.length > 12 && latin1.decode(b.subarray(4, 8)) === 'ftyp'; }

/** Summarise tracks. */
export function mp4Info(b) {
  const top = parseBoxes(b);
  const moov = findBox(top, 'moov');
  if (!moov) throw new Error('No moov box found (not an MP4/M4A/MOV, or the file is truncated)');
  const mvhd = findBox(moov.children, 'mvhd');
  let timescale = 1000, duration = 0;
  if (mvhd) { const v = b[mvhd.start + 8]; if (v === 1) { timescale = be32(b, mvhd.start + 28); duration = be64(b, mvhd.start + 32); } else { timescale = be32(b, mvhd.start + 20); duration = be32(b, mvhd.start + 24); } }
  const tracks = [];
  for (const trak of findBoxes(moov.children, 'trak')) {
    const tkhd = findBox(trak.children, 'tkhd');
    const hdlr = path(trak, 'mdia', 'hdlr');
    const stsd = path(trak, 'mdia', 'minf', 'stbl', 'stsd');
    const mdhd = path(trak, 'mdia', 'mdhd');
    const id = tkhd ? (b[tkhd.start + 8] === 1 ? be32(b, tkhd.start + 28) : be32(b, tkhd.start + 20)) : 0;
    const handler = hdlr ? latin1.decode(b.subarray(hdlr.start + 16, hdlr.start + 20)) : '';
    const codec = stsd && stsd.children[0] ? stsd.children[0].type : '';
    let w = 0, h = 0;
    if (tkhd) { const v = b[tkhd.start + 8]; const o = tkhd.start + (v === 1 ? 96 : 84); w = be32(b, o) / 65536; h = be32(b, o + 4) / 65536; }
    let mts = 0, mdur = 0;
    if (mdhd) { const v = b[mdhd.start + 8]; if (v === 1) { mts = be32(b, mdhd.start + 28); mdur = be64(b, mdhd.start + 32); } else { mts = be32(b, mdhd.start + 20); mdur = be32(b, mdhd.start + 24); } }
    tracks.push({ id, handler, codec, width: w, height: h, duration: mts ? mdur / mts : 0 });
  }
  const fragmented = !!findBox(top, 'moof') || !!findBox(moov.children, 'mvex');
  return { timescale, duration: timescale ? duration / timescale : 0, tracks, fragmented, hasAudio: tracks.some((t) => t.handler === 'soun'), hasVideo: tracks.some((t) => t.handler === 'vide') };
}

/**
 * Lossless mute: remove all 'soun' tracks. Works for both progressive and fragmented MP4s.
 * Returns a new Uint8Array.
 */
export function removeAudioTracks(b) {
  const top = parseBoxes(b);
  const moov = findBox(top, 'moov');
  if (!moov) throw new Error('No moov box found');
  const audioIds = new Set();
  const removeRanges = []; // absolute [start,end) ranges to drop
  for (const trak of findBoxes(moov.children, 'trak')) {
    const hdlr = path(trak, 'mdia', 'hdlr');
    const tkhd = findBox(trak.children, 'tkhd');
    const handler = hdlr ? latin1.decode(b.subarray(hdlr.start + 16, hdlr.start + 20)) : '';
    if (handler === 'soun') {
      removeRanges.push([trak.start, trak.end]);
      if (tkhd) audioIds.add(b[tkhd.start + 8] === 1 ? be32(b, tkhd.start + 28) : be32(b, tkhd.start + 20));
    }
  }
  if (!audioIds.size) throw new Error('This file has no audio track');
  const mvex = findBox(moov.children, 'mvex');
  if (mvex) for (const trex of findBoxes(mvex.children, 'trex')) if (audioIds.has(be32(b, trex.start + 12))) removeRanges.push([trex.start, trex.end]);
  // also drop iods (may reference audio ES) — harmless
  const iods = findBox(moov.children, 'iods'); if (iods) removeRanges.push([iods.start, iods.end]);
  const out = new Uint8Array(b.length);
  out.set(b);
  // Patch moov: rebuild it without the removed ranges
  const moovDelta = removeRanges.reduce((a, [s, e]) => a + (e - s), 0);
  const newMoov = spliceOut(b.subarray(moov.start, moov.end), removeRanges.map(([s, e]) => [s - moov.start, e - moov.start]));
  writeSize(newMoov, 0, newMoov.length, moov.hdr);
  // The moov box shrank by moovDelta bytes; every absolute file offset after moov.start shifts by -moovDelta.
  const shift = (off) => (off >= moov.end ? off - moovDelta : off);
  // Fix stco/co64 in remaining tracks (offsets are absolute)
  const nm = parseBoxes(newMoov);
  const nmoov = nm[0];
  for (const trak of findBoxes(nmoov.children, 'trak')) {
    const stbl = path(trak, 'mdia', 'minf', 'stbl');
    if (!stbl) continue;
    for (const stco of findBoxes(stbl.children, 'stco')) { const n = be32(newMoov, stco.start + 12); for (let i = 0; i < n; i++) { const o = stco.start + 16 + i * 4; w32(newMoov, o, shift(be32(newMoov, o))); } }
    for (const co64 of findBoxes(stbl.children, 'co64')) { const n = be32(newMoov, co64.start + 12); for (let i = 0; i < n; i++) { const o = co64.start + 16 + i * 8; w64(newMoov, o, shift(be64(newMoov, o))); } }
  }
  // Assemble output: everything before moov, new moov, then the rest (with moof patches)
  const parts = [b.subarray(0, moov.start), newMoov];
  let cumShift = moovDelta; // bytes removed so far before current point
  let cursor = moov.end;
  for (const box of top) {
    if (box.start < moov.end) continue;
    if (box.type === 'moof') {
      const moofBytes = b.slice(box.start, box.end);
      const mb = parseBoxes(moofBytes)[0];
      const drop = [];
      for (const traf of findBoxes(mb.children, 'traf')) { const tfhd = findBox(traf.children, 'tfhd'); if (tfhd && audioIds.has(be32(moofBytes, tfhd.start + 12))) drop.push([traf.start, traf.end]); }
      const delta = drop.reduce((a, [s, e]) => a + (e - s), 0);
      const nb = spliceOut(moofBytes, drop);
      writeSize(nb, 0, nb.length, mb.hdr);
      const nmb = parseBoxes(nb)[0];
      for (const traf of findBoxes(nmb.children, 'traf')) {
        const tfhd = findBox(traf.children, 'tfhd');
        if (tfhd) { const flags = be32(nb, tfhd.start + 8) & 0xffffff; if (flags & 1) { const o = tfhd.start + 16; w64(nb, o, be64(nb, o) - cumShift); } }
        for (const trun of findBoxes(traf.children, 'trun')) { const flags = be32(nb, trun.start + 8) & 0xffffff; if (flags & 1) { const o = trun.start + 16; w32(nb, o, ((be32(nb, o) | 0) - delta) >>> 0); } }
      }
      parts.push(b.subarray(cursor, box.start), nb);
      cursor = box.end;
      cumShift += delta;
    } else if (box.type === 'mfra' || box.type === 'sidx') {
      // random-access tables contain absolute offsets; drop them (optional boxes)
      parts.push(b.subarray(cursor, box.start));
      cursor = box.end;
      cumShift += box.end - box.start;
    }
  }
  parts.push(b.subarray(cursor));
  return concat(parts);
}
function spliceOut(bytes, ranges) {
  const parts = [];
  let p = 0;
  for (const [s, e] of ranges.sort((a, b) => a[0] - b[0])) { parts.push(bytes.subarray(p, s)); p = e; }
  parts.push(bytes.subarray(p));
  return concat(parts);
}
function w32(b, p, v) { b[p] = (v >>> 24) & 255; b[p + 1] = (v >>> 16) & 255; b[p + 2] = (v >>> 8) & 255; b[p + 3] = v & 255; }
function w64(b, p, v) { w32(b, p, Math.floor(v / 4294967296)); w32(b, p + 4, v >>> 0); }
function writeSize(b, p, size, hdr) { if (hdr === 16) { w32(b, p, 1); w64(b, p + 8, size); } else w32(b, p, size); }

// ------------------------------------------------------------------
// Muxer
// ------------------------------------------------------------------
const box = (type, ...payload) => { const body = concat(payload.map((p) => (p instanceof Uint8Array ? p : new Uint8Array(p)))); const w = new ByteWriter(8 + body.length); w.u32be(8 + body.length).str(type).bytes(body); return w.result(); };
const full = (type, version, flags, ...payload) => box(type, new Uint8Array([version, (flags >> 16) & 255, (flags >> 8) & 255, flags & 255]), ...payload);
const u32 = (...v) => { const w = new ByteWriter(v.length * 4); for (const x of v) w.u32be(x >>> 0); return w.result(); };
const u16 = (...v) => { const w = new ByteWriter(v.length * 2); for (const x of v) w.u16be(x); return w.result(); };
const u8 = (...v) => new Uint8Array(v);
const str = (s) => latin1.encode(s);
const MATRIX = u32(0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000);
const mp4Time = () => Math.floor(Date.now() / 1000) + 2082844800;

function esdsBox(asc, avgBitrate = 128000) {
  // ES_Descriptor -> DecoderConfigDescriptor -> DecoderSpecificInfo (AudioSpecificConfig) + SLConfig
  const dsi = concat([u8(0x05, asc.length), asc]);
  const dcd = concat([u8(0x04, 13 + dsi.length), u8(0x40, 0x15), u8(0, 0, 0), u32(avgBitrate * 2, avgBitrate), dsi]);
  const sl = u8(0x06, 0x01, 0x02);
  const es = concat([u8(0x03, 3 + dcd.length + sl.length), u16(1), u8(0), dcd, sl]);
  return full('esds', 0, 0, es);
}
export function audioSpecificConfig(sampleRate, channels) {
  const rates = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
  let idx = rates.indexOf(sampleRate); if (idx < 0) idx = 4;
  const v = (2 << 11) | (idx << 7) | (channels << 3); // AAC-LC
  return u8((v >> 8) & 255, v & 255);
}
function dOpsBox(sampleRate, channels, preSkip = 312) {
  return box('dOps', u8(0, channels), u16(preSkip), u32(sampleRate), u16(0), u8(0));
}
function vpcCBox(codec, width, height) {
  // codec like 'vp09.00.10.08' -> profile 0, level 10, bitdepth 8
  const parts = codec.split('.');
  const profile = parseInt(parts[1] || '0', 10), level = parseInt(parts[2] || '10', 10), depth = parseInt(parts[3] || '8', 10);
  return full('vpcC', 1, 0, u8(profile, level, (depth << 4) | (1 << 1) | 0, 1, 1, 1), u16(0));
}

/**
 * Non-fragmented MP4 muxer for WebCodecs output.
 *   const m = new Mp4Muxer();
 *   m.setVideo({ codec:'avc1.42001f', width, height, description }); m.setAudio({ codec:'mp4a.40.2', sampleRate, channels, description })
 *   m.addVideoChunk(chunk) / m.addAudioChunk(chunk)  (EncodedVideoChunk / EncodedAudioChunk or {data,timestamp,duration,type})
 *   const bytes = m.finish();
 */
export class Mp4Muxer {
  constructor() { this.video = null; this.audio = null; this.vsamples = []; this.asamples = []; this.data = []; this.size = 0; }
  setVideo(cfg) { this.video = { ...cfg, timescale: cfg.timescale || 90000 }; }
  setAudio(cfg) { this.audio = { ...cfg, timescale: cfg.sampleRate }; }
  _push(chunk) {
    let bytes;
    if (chunk instanceof Uint8Array) bytes = chunk;
    else if (chunk.data instanceof Uint8Array) bytes = chunk.data;
    else { bytes = new Uint8Array(chunk.byteLength); chunk.copyTo(bytes); }
    const off = this.size;
    this.data.push(bytes); this.size += bytes.length;
    return { off, size: bytes.length };
  }
  addVideoChunk(chunk, meta) {
    if (meta?.decoderConfig?.description && this.video && !this.video.description) this.video.description = new Uint8Array(meta.decoderConfig.description instanceof ArrayBuffer ? meta.decoderConfig.description : meta.decoderConfig.description.buffer.slice(meta.decoderConfig.description.byteOffset, meta.decoderConfig.description.byteOffset + meta.decoderConfig.description.byteLength));
    const { off, size } = this._push(chunk);
    this.vsamples.push({ off, size, pts: chunk.timestamp, dur: chunk.duration || 0, key: chunk.type === 'key' });
  }
  addAudioChunk(chunk, meta) {
    if (meta?.decoderConfig?.description && this.audio && !this.audio.description) { const d = meta.decoderConfig.description; this.audio.description = new Uint8Array(d instanceof ArrayBuffer ? d : d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength)); }
    const { off, size } = this._push(chunk);
    this.asamples.push({ off, size, pts: chunk.timestamp, dur: chunk.duration || 0, key: true });
  }
  finish() {
    const ftyp = box('ftyp', str('isom'), u32(0x200), str('isom'), str('iso2'), str(this.video && this.video.codec.startsWith('avc') ? 'avc1' : 'mp41'), str('mp41'));
    const mdatHdr = this.size + 8 > 0xffffffff ? 24 : 8;
    const mdatStart = ftyp.length;
    const dataStart = mdatStart + mdatHdr;
    const traks = [];
    let movieDur = 0;
    const mvTs = 1000;
    let trackId = 1;
    const mk = (kind, cfg, samples) => {
      if (!samples.length) return;
      const ts = cfg.timescale;
      const toTs = (us) => Math.round((us * ts) / 1e6);
      // decode order = arrival order; compute dts/ctts
      const pts = samples.map((s) => toTs(s.pts));
      const sorted = [...pts].sort((a, b) => a - b);
      let shift = 0; for (let i = 0; i < pts.length; i++) shift = Math.max(shift, sorted[i] - pts[i]);
      const dts = sorted.map((v) => v - shift);
      const durs = [];
      for (let i = 0; i < dts.length; i++) durs.push(i + 1 < dts.length ? Math.max(1, dts[i + 1] - dts[i]) : Math.max(1, toTs(samples[i].dur) || (durs[i - 1] ?? 1)));
      const cts = pts.map((p, i) => p - dts[i]);
      const hasCtts = cts.some((c) => c !== 0);
      const mediaDur = dts[dts.length - 1] + durs[durs.length - 1];
      movieDur = Math.max(movieDur, Math.round(((mediaDur - (kind === 'vide' ? 0 : 0)) * mvTs) / ts));
      // stts
      const sttsEntries = []; for (const d of durs) { const last = sttsEntries[sttsEntries.length - 1]; if (last && last[1] === d) last[0]++; else sttsEntries.push([1, d]); }
      const stts = full('stts', 0, 0, u32(sttsEntries.length), u32(...sttsEntries.flat()));
      const cttsEntries = []; if (hasCtts) for (const c of cts) { const last = cttsEntries[cttsEntries.length - 1]; if (last && last[1] === c) last[0]++; else cttsEntries.push([1, c]); }
      const ctts = hasCtts ? full('ctts', 1, 0, u32(cttsEntries.length), u32(...cttsEntries.flat())) : null;
      const keys = samples.map((s, i) => (s.key ? i + 1 : 0)).filter(Boolean);
      const stss = kind === 'vide' && keys.length < samples.length ? full('stss', 0, 0, u32(keys.length), u32(...keys)) : null;
      const stsz = full('stsz', 0, 0, u32(0, samples.length), u32(...samples.map((s) => s.size)));
      // one chunk per sample (simple + robust)
      const stsc = full('stsc', 0, 0, u32(1), u32(1, 1, 1));
      const offsets = samples.map((s) => dataStart + s.off);
      const big = offsets[offsets.length - 1] > 0xfffffff0;
      const stco = big ? full('co64', 0, 0, u32(offsets.length), concat(offsets.map((o) => { const w = new ByteWriter(8); w.u64be(o); return w.result(); }))) : full('stco', 0, 0, u32(offsets.length), u32(...offsets));
      // sample entry
      let entry;
      if (kind === 'vide') {
        const codec = cfg.codec;
        const compressor = new Uint8Array(32);
        const visual = concat([u8(0, 0, 0, 0, 0, 0), u16(1), u16(0, 0), u32(0, 0, 0), u16(cfg.width, cfg.height), u32(0x480000, 0x480000), u32(0), u16(1), compressor, u16(0x18), u16(0xffff)]);
        if (codec.startsWith('avc1') || codec.startsWith('avc3')) {
          if (!cfg.description) throw new Error('H.264 needs an avcC description (use avc:{format:"avc"} in the encoder config)');
          entry = box('avc1', visual, box('avcC', cfg.description));
        } else if (codec.startsWith('vp09')) entry = box('vp09', visual, vpcCBox(codec, cfg.width, cfg.height));
        else if (codec.startsWith('av01')) { if (!cfg.description) throw new Error('AV1 needs an av1C description'); entry = box('av01', visual, box('av1C', cfg.description)); }
        else if (codec.startsWith('hvc1') || codec.startsWith('hev1')) { if (!cfg.description) throw new Error('HEVC needs an hvcC description'); entry = box('hvc1', visual, box('hvcC', cfg.description)); }
        else throw new Error('Unsupported video codec for MP4: ' + codec);
      } else {
        const audio = concat([u8(0, 0, 0, 0, 0, 0), u16(1), u32(0, 0), u16(cfg.channels, 16), u16(0, 0), u32(cfg.sampleRate << 16)]);
        if (cfg.codec.startsWith('mp4a')) entry = box('mp4a', audio, esdsBox(cfg.description || audioSpecificConfig(cfg.sampleRate, cfg.channels), cfg.bitrate || 128000));
        else if (cfg.codec === 'opus') entry = box('Opus', audio, dOpsBox(cfg.sampleRate, cfg.channels, cfg.preSkip ?? 312));
        else throw new Error('Unsupported audio codec for MP4: ' + cfg.codec);
      }
      const stsd = full('stsd', 0, 0, u32(1), entry);
      const stbl = box('stbl', stsd, stts, ...(ctts ? [ctts] : []), ...(stss ? [stss] : []), stsc, stsz, stco);
      const dinf = box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1)));
      const mhd = kind === 'vide' ? full('vmhd', 0, 1, u16(0, 0, 0, 0)) : full('smhd', 0, 0, u16(0, 0));
      const minf = box('minf', mhd, dinf, stbl);
      const hdlr = full('hdlr', 0, 0, u32(0), str(kind), u32(0, 0, 0), str(kind === 'vide' ? 'VideoHandler\0' : 'SoundHandler\0'));
      const mdhd = full('mdhd', 1, 0, concat([(() => { const w = new ByteWriter(16); w.u64be(mp4Time()).u64be(mp4Time()); return w.result(); })(), u32(ts), (() => { const w = new ByteWriter(8); w.u64be(mediaDur); return w.result(); })(), u16(0x55c4, 0)]));
      const mdia = box('mdia', mdhd, hdlr, minf);
      const tkhdFlags = 3;
      const tkhd = full('tkhd', 1, tkhdFlags, concat([(() => { const w = new ByteWriter(16); w.u64be(mp4Time()).u64be(mp4Time()); return w.result(); })(), u32(trackId, 0), (() => { const w = new ByteWriter(8); w.u64be(Math.round((mediaDur * mvTs) / ts)); return w.result(); })(), u32(0, 0), u16(0, kind === 'soun' ? 0x100 : 0, 0), MATRIX, u32(kind === 'vide' ? cfg.width << 16 : 0, kind === 'vide' ? cfg.height << 16 : 0)]));
      // edit list to cancel the ctts shift (so presentation starts at 0)
      const edts = shift ? box('edts', full('elst', 1, 0, u32(1), (() => { const w = new ByteWriter(16); w.u64be(Math.round((mediaDur * mvTs) / ts)).u64be(shift); return w.result(); })(), u16(1, 0))) : null;
      traks.push(box('trak', tkhd, ...(edts ? [edts] : []), mdia));
      trackId++;
    };
    if (this.video) mk('vide', this.video, this.vsamples);
    if (this.audio) mk('soun', this.audio, this.asamples);
    if (!traks.length) throw new Error('No samples were written');
    const mvhd = full('mvhd', 1, 0, concat([(() => { const w = new ByteWriter(16); w.u64be(mp4Time()).u64be(mp4Time()); return w.result(); })(), u32(mvTs), (() => { const w = new ByteWriter(8); w.u64be(movieDur); return w.result(); })(), u32(0x10000), u16(0x100, 0), u32(0, 0), MATRIX, u32(0, 0, 0, 0, 0, 0), u32(trackId)]));
    const udta = box('udta', box('meta', u32(0), full('hdlr', 0, 0, u32(0), str('mdir'), str('appl'), u32(0, 0), u8(0)), box('ilst', box('\xa9too', box('data', u32(1, 0), latin1.encode('Cortexis Tools'))))));
    const moov = box('moov', mvhd, ...traks, udta);
    const mdatHeader = new ByteWriter(mdatHdr);
    if (mdatHdr === 8) mdatHeader.u32be(this.size + 8).str('mdat'); else mdatHeader.u32be(1).str('mdat').u64be(this.size + 16);
    return concat([ftyp, mdatHeader.result(), ...this.data, moov]);
  }
}
