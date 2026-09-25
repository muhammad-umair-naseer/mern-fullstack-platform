import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mp4Info, removeAudioTracks, Mp4Muxer, parseBoxes, findBox, findBoxes } from '../../src/core/mp4.js';
import { be32 } from '../../src/core/bytes.js';
import { has } from './_helpers.mjs';

const ffmpeg = has('ffmpeg') && has('ffprobe');
const sh = (c) => execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const framemd5 = (f, sel) => sh(`ffmpeg -v error -i "${f}" -map 0:${sel} -f framemd5 - | grep -v '^#' | awk -F, '{print $6}' | md5sum`);
let dir;
const fixtures = () => {
  if (dir) return dir; dir = mkdtempSync(join(tmpdir(), 'mp4'));
  sh(`ffmpeg -v error -y -f lavfi -i testsrc=size=160x120:rate=25:duration=2 -f lavfi -i sine=frequency=440:duration=2 -c:v libx264 -preset ultrafast -pix_fmt yuv420p -c:a aac -b:a 64k -movflags +faststart "${dir}/fast.mp4"`);
  sh(`ffmpeg -v error -y -i "${dir}/fast.mp4" -c copy "${dir}/end.mp4"`);
  sh(`ffmpeg -v error -y -i "${dir}/fast.mp4" -c copy -movflags frag_keyframe+empty_moov "${dir}/frag.mp4"`);
  sh(`ffmpeg -v error -y -f lavfi -i testsrc=size=160x120:rate=25:duration=2 -f lavfi -i sine=frequency=440:duration=2 -c:v libvpx-vp9 -deadline realtime -cpu-used 8 -c:a libopus -strict -2 "${dir}/vp9opus.mp4"`);
  return dir;
};
test('mp4Info reads tracks/dimensions; removeAudioTracks is lossless (progressive, moov-at-end, fragmented, vp9/opus)', { skip: !ffmpeg && 'ffmpeg not installed' }, () => {
  const d = fixtures();
  for (const f of ['fast.mp4', 'end.mp4', 'frag.mp4', 'vp9opus.mp4']) {
    const b = new Uint8Array(readFileSync(join(d, f)));
    const info = mp4Info(b);
    assert.ok(info.hasVideo && info.hasAudio, f);
    assert.equal(info.tracks.find((t) => t.handler === 'vide').width, 160);
    const muted = removeAudioTracks(b); const out = join(d, 'muted_' + f); writeFileSync(out, muted);
    assert.equal(sh(`ffprobe -v error -show_entries stream=codec_type -of csv "${out}"`), 'stream,video');
    assert.equal(framemd5(join(d, f), 'v:0'), framemd5(out, 'v:0'), 'frames identical ' + f);
    assert.equal(sh(`ffmpeg -v error -i "${out}" -f null - 2>&1 || true`), '');
  }
});
function extractTrack(b, kind) {
  const moov = findBox(parseBoxes(b), 'moov');
  for (const trak of findBoxes(moov.children, 'trak')) {
    const mdia = findBox(trak.children, 'mdia'); const hdlr = findBox(mdia.children, 'hdlr');
    if (String.fromCharCode(...b.subarray(hdlr.start + 16, hdlr.start + 20)) !== kind) continue;
    const mdhd = findBox(mdia.children, 'mdhd'); const ts = b[mdhd.start + 8] === 1 ? be32(b, mdhd.start + 28) : be32(b, mdhd.start + 20);
    const stbl = findBox(findBox(mdia.children, 'minf').children, 'stbl');
    const entry = findBox(stbl.children, 'stsd').children[0];
    const stsz = findBox(stbl.children, 'stsz'), stco = findBox(stbl.children, 'stco'), stsc = findBox(stbl.children, 'stsc'), stts = findBox(stbl.children, 'stts'), ctts = findBox(stbl.children, 'ctts'), stss = findBox(stbl.children, 'stss');
    const n = be32(b, stsz.start + 16), fixed = be32(b, stsz.start + 12);
    const sizes = Array.from({ length: n }, (_, i) => fixed || be32(b, stsz.start + 20 + i * 4));
    const chunks = Array.from({ length: be32(b, stco.start + 12) }, (_, i) => be32(b, stco.start + 16 + i * 4));
    const sc = Array.from({ length: be32(b, stsc.start + 12) }, (_, i) => [be32(b, stsc.start + 16 + i * 12), be32(b, stsc.start + 20 + i * 12)]);
    const offsets = []; let si = 0;
    for (let c = 0; c < chunks.length; c++) { let per = 1; for (const [first, count] of sc) if (first <= c + 1) per = count; let o = chunks[c]; for (let k = 0; k < per && si < n; k++) { offsets.push(o); o += sizes[si++]; } }
    const durs = []; for (let i = 0; i < be32(b, stts.start + 12); i++) { const c = be32(b, stts.start + 16 + i * 8), d = be32(b, stts.start + 20 + i * 8); for (let k = 0; k < c; k++) durs.push(d); }
    const cto = []; if (ctts) for (let i = 0; i < be32(b, ctts.start + 12); i++) { const c = be32(b, ctts.start + 16 + i * 8), d = be32(b, ctts.start + 20 + i * 8) | 0; for (let k = 0; k < c; k++) cto.push(d); }
    const keys = new Set(); if (stss) for (let i = 0; i < be32(b, stss.start + 12); i++) keys.add(be32(b, stss.start + 16 + i * 4) - 1);
    let dts = 0; const samples = [];
    for (let i = 0; i < n; i++) { samples.push({ data: b.slice(offsets[i], offsets[i] + sizes[i]), timestamp: Math.round(((dts + (cto[i] || 0)) * 1e6) / ts), duration: Math.round((durs[i] * 1e6) / ts), type: stss ? (keys.has(i) ? 'key' : 'delta') : 'key' }); dts += durs[i]; }
    let description = null;
    const sub = parseBoxes(b, entry.start + (kind === 'vide' ? 86 : 36), entry.end);
    const avcC = sub.find((x) => x.type === 'avcC'); if (avcC) description = b.slice(avcC.start + 8, avcC.end);
    return { samples, description, width: kind === 'vide' ? (b[entry.start + 32] << 8) | b[entry.start + 33] : 0, height: kind === 'vide' ? (b[entry.start + 34] << 8) | b[entry.start + 35] : 0, sampleRate: kind === 'soun' ? be32(b, entry.start + 32) >>> 16 : 0, channels: kind === 'soun' ? (b[entry.start + 24] << 8) | b[entry.start + 25] : 0 };
  }
}
test('Mp4Muxer: remuxed H.264+AAC and VP9+Opus decode cleanly with identical video frames', { skip: !ffmpeg && 'ffmpeg not installed' }, () => {
  const d = fixtures();
  for (const [f, vcodec, acodec] of [['fast.mp4', 'avc1.42001e', 'mp4a.40.2'], ['vp9opus.mp4', 'vp09.00.10.08', 'opus']]) {
    const b = new Uint8Array(readFileSync(join(d, f)));
    const v = extractTrack(b, 'vide'), a = extractTrack(b, 'soun');
    const m = new Mp4Muxer();
    m.setVideo({ codec: vcodec, width: v.width, height: v.height, description: v.description });
    m.setAudio({ codec: acodec, sampleRate: a.sampleRate, channels: a.channels, description: a.description });
    for (const s of [...v.samples.map((s) => ({ ...s, k: 'v' })), ...a.samples.map((s) => ({ ...s, k: 'a' }))].sort((x, y) => x.timestamp - y.timestamp)) (s.k === 'v' ? m.addVideoChunk(s) : m.addAudioChunk(s));
    const out = join(d, 'remux_' + f); writeFileSync(out, m.finish());
    assert.equal(sh(`ffmpeg -v error -i "${out}" -f null - 2>&1 || true`), '', 'ffmpeg decodes without errors');
    assert.match(sh(`ffprobe -v error -show_entries stream=codec_type -of csv "${out}"`), /video[\s\S]*audio/);
    assert.equal(framemd5(join(d, f), 'v:0'), framemd5(out, 'v:0'), 'video frames identical ' + f);
  }
});
