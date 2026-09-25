import { h, field, select, button, run, result, section, outName, dropzone, fileChip, readAs, range, notice, progress, number } from '../core/ui.js';
import { decodeGif } from '../core/formats/image-extra.js';
import { encodeMp4, recordWebm, caps, even } from '../core/media.js';

export function mount(root) {
  let file = null, gif = null; const chips = h('div'); const info = h('div.small.muted');
  const container = select([['mp4', 'MP4 (H.264 / VP9)'], ['webm', 'WebM (works everywhere)']], caps.webCodecs ? 'mp4' : 'webm');
  const fps = select([['auto', 'Match GIF timing'], [10, '10 fps'], [15, '15 fps'], [24, '24 fps'], [30, '30 fps']], 'auto');
  const maxW = number(0, { min: 0, max: 4096 });
  const loops = number(1, { min: 1, max: 20 });
  const bg = select([['#000000', 'Black'], ['#ffffff', 'White']], '#000000');
  const prog = progress(); const out = h('div');
  const go = button('Convert', () => run(go, async () => {
    if (!gif) throw new Error('Choose a GIF first.');
    const scale = Number(maxW.value) > 0 && gif.width > Number(maxW.value) ? Number(maxW.value) / gif.width : 1;
    const w = even(gif.width * scale), hgt = even(gif.height * scale);
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = hgt; const ctx = canvas.getContext('2d');
    const tmp = document.createElement('canvas'); tmp.width = gif.width; tmp.height = gif.height; const tctx = tmp.getContext('2d');
    const paint = (i) => { tctx.putImageData(new ImageData(gif.frames[i].rgba, gif.width, gif.height), 0, 0); ctx.fillStyle = bg.value; ctx.fillRect(0, 0, w, hgt); ctx.drawImage(tmp, 0, 0, w, hgt); };
    const n = gif.frames.length, loopCount = Number(loops.value);
    const total = gif.frames.reduce((a, f) => a + f.delay, 0) * loopCount / 1000;
    if (container.value === 'mp4') {
      const f = fps.value === 'auto' ? Math.min(50, Math.max(5, Math.round(1000 / Math.max(20, Math.min(...gif.frames.map((x) => x.delay)))))) : Number(fps.value);
      let frameCount = 0;
      const bytes = await encodeMp4({ width: w, height: hgt, fps: f, onProgress: (i) => prog.set(i / (total * f), `Encoding frame ${i}`), frames: async (push) => {
        // walk GIF timeline, emit one frame per 1/f seconds (constant frame rate)
        const step = 1e6 / f; let t = 0, elapsed = 0;
        for (let L = 0; L < loopCount; L++) for (let i = 0; i < n; i++) {
          const dur = gif.frames[i].delay * 1000; // us
          paint(i);
          while (t < elapsed + dur) { await push(canvas, Math.round(t), Math.round(step)); t += step; frameCount++; }
          elapsed += dur;
        }
      } });
      prog.done();
      out.replaceChildren(result({ title: `${w}×${hgt} · ${f} fps · ${frameCount} frames`, data: bytes, name: outName(file, '', 'mp4'), mime: 'video/mp4', preview: h('video', { src: URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' })), controls: true, loop: true, muted: true, playsInline: true }) }));
    } else {
      const starts = []; let acc = 0; for (const fr of gif.frames) { starts.push(acc); acc += fr.delay / 1000; }
      const r = await recordWebm({ canvas, duration: total, fps: fps.value === 'auto' ? 30 : Number(fps.value), onProgress: (p) => prog.set(p, 'Recording…'), draw: (t) => { const tt = t % (acc || 1); let i = 0; while (i + 1 < n && starts[i + 1] <= tt) i++; paint(i); } });
      prog.done();
      out.replaceChildren(notice('Exported as WebM in real time (MP4 is not available here).'), result({ title: `${w}×${hgt} WebM`, data: r.blob, name: outName(file, '', r.ext), mime: r.mimeType, preview: h('video', { src: URL.createObjectURL(r.blob), controls: true, loop: true, muted: true, playsInline: true }) }));
    }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose GIF', dropzone({ accept: '.gif,image/gif', onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); gif = decodeGif(await readAs(f)); info.textContent = `${gif.width}×${gif.height}, ${gif.frames.length} frames, ${(gif.frames.reduce((a, x) => a + x.delay, 0) / 1000).toFixed(2)} s`; } }), chips, info), section('2. Output', field('Container', container), h('div.grid2', field('Frame rate', fps), field('Max width (0 = original)', maxW)), h('div.grid2', field('Repeat GIF (times)', loops), field('Background for transparency', bg)), caps.webCodecs ? null : notice('MP4 output is not available here; WebM output still works.', 'warn'), go, prog)), h('div', out)));
}
