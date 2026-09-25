import { h, button, run, result, section, dropzone, fileChip, readAs, notice, fmtBytes, imagePreview, outName, checkbox } from '../core/ui.js';
import { readExif, stripMetadata } from '../core/formats/image-extra.js';
import { writeZip } from '../core/zip.js';

export function mount(root) {
  let files = []; const list = h('div'); const out = h('div');
  const keepIcc = checkbox('Keep colour profile (ICC) — recommended for accurate colours', true);
  const analyze = async (f) => {
    const bytes = await readAs(f); const ex = readExif(bytes);
    const rows = Object.entries(ex.tags).filter(([k]) => !/^Tag0x/.test(k)).slice(0, 40).map(([k, v]) => h('tr', h('td', k), h('td', Array.isArray(v) ? v.join(', ') : String(v))));
    const flags = [ex.hasExif ? 'EXIF' : null, ex.hasXmp ? 'XMP' : null, ex.hasIptc ? 'IPTC' : null, ex.hasIcc ? 'ICC profile' : null].filter(Boolean);
    return h('div.card', h('h3', f.name, ' ', h('span.small.muted', fmtBytes(f.size))), ex.gps ? notice(`⚠ Contains GPS location: ${ex.gps.lat.toFixed(5)}, ${ex.gps.lon.toFixed(5)} (${ex.gps.lat >= 0 ? 'N' : 'S'}/${ex.gps.lon >= 0 ? 'E' : 'W'})`, 'warn') : null, flags.length ? h('p.small', 'Metadata blocks found: ' + flags.join(', ')) : h('p.small.muted', 'No metadata blocks found.'), rows.length ? h('table.data', h('tbody', rows)) : null);
  };
  const go = button('Strip metadata', () => run(go, async () => {
    if (!files.length) throw new Error('Add images first.');
    const results = [];
    for (const f of files) { const bytes = await readAs(f); const r = stripMetadata(bytes, { keepIcc: keepIcc.input.checked }); if (!r) { results.push({ f, error: 'Unsupported format (JPG, PNG and WebP are supported).' }); continue; } results.push({ f, bytes: r.bytes, kind: r.kind, removed: r.removed || [] }); }
    out.replaceChildren();
    const ok = results.filter((r) => r.bytes);
    if (ok.length > 1) out.append(result({ title: `All ${ok.length} cleaned images (ZIP)`, data: await writeZip(ok.map((r) => ({ name: outName(r.f, 'clean', r.f.name.split('.').pop()), data: r.bytes, store: true }))), name: 'cleaned-images.zip', mime: 'application/zip' }));
    for (const r of results) out.append(r.error ? h('div.error', `${r.f.name}: ${r.error}`) : result({ title: `${r.f.name} → ${fmtBytes(r.bytes.length)} (saved ${fmtBytes(r.f.size - r.bytes.length)})`, data: r.bytes, name: outName(r.f, 'clean', r.f.name.split('.').pop()), mime: r.f.type, note: r.removed.length ? 'removed ' + r.removed.join(', ') : 'lossless copy', preview: imagePreview(new Blob([r.bytes], { type: r.f.type })) }));
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Add images', dropzone({ accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp', multiple: true, pasteImages: true, onFiles: async (fs) => { files.push(...fs); for (const f of fs) list.append(await analyze(f)); } })), section('2. Strip', keepIcc, notice('Pixels are never re-encoded: EXIF, XMP, IPTC, comments and text chunks are removed byte-for-byte, so quality is untouched.'), go)), h('div', list, out)));
}
