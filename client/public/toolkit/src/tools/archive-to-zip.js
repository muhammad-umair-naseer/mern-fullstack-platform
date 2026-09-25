import { h, button, run, result, section, dropzone, fileChip, readAs, notice, fmtBytes, checkbox, field, select } from '../core/ui.js';
import { readArchive, writeZip, isRar, is7z } from '../core/zip.js';

export function mount(root) {
  let files = []; const chips = h('div'); const listing = h('div');
  const level = select([['deflate', 'Deflate (compressed)'], ['store', 'Store (no compression, fastest)']], 'deflate');
  const flatten = checkbox('Put each archive\'s files in a folder named after it', true);
  const out = h('div');
  const go = button('Create ZIP', () => run(go, async () => {
    if (!files.length) throw new Error('Add files or archives first.');
    const entries = []; const notes = [];
    for (const f of files) {
      const bytes = await readAs(f);
      if (isRar(bytes) || is7z(bytes)) { notes.push(`${f.name}: RAR and 7-Zip cannot be unpacked natively (their compression is proprietary/LZMA); the file was added to the ZIP as-is. Unpack it with 7-Zip or WinRAR first to convert its contents.`); entries.push({ name: f.name, data: bytes }); continue; }
      let arch = null;
      try { arch = await readArchive(bytes, f.name); } catch { arch = null; }
      if (arch && arch.entries.length) { const prefix = flatten.input.checked ? f.name.replace(/\.(tar\.gz|tgz|tar|gz|zip)$/i, '') + '/' : ''; for (const e of arch.entries) { if (e.isDir) continue; entries.push({ name: prefix + e.name, data: e.data() }); } notes.push(`${f.name}: ${arch.kind.toUpperCase()} with ${arch.entries.filter((e) => !e.isDir).length} file(s) repacked.`); }
      else entries.push({ name: f.name, data: bytes });
    }
    const zip = await writeZip(entries, { level: level.value });
    out.replaceChildren(h('div.notice', h('ul', notes.map((n) => h('li', n)))), result({ title: `${entries.length} file(s) zipped`, data: zip, name: files.length === 1 ? files[0].name.replace(/\.(tar\.gz|tgz|tar|gz|rar|7z|zip)$/i, '') + '.zip' : 'archive.zip', mime: 'application/zip' }));
  }, out), 'primary big');
  const inspect = async (f) => { try { const arch = await readArchive(await readAs(f), f.name); listing.append(h('div.card', h('h3', `${f.name} (${arch.kind.toUpperCase()}, ${arch.entries.length} entries)`), h('table.data', h('thead', h('tr', h('th', 'Name'), h('th', 'Size'))), h('tbody', arch.entries.slice(0, 300).map((e) => h('tr', h('td', e.name), h('td', e.isDir ? '—' : fmtBytes(e.size)))))))); } catch (e) { const bytes = await readAs(f); if (isRar(bytes) || is7z(bytes)) listing.append(notice(`${f.name}: ${isRar(bytes) ? 'RAR' : '7-Zip'} archives cannot be opened natively in a browser — see the note below.`, 'warn')); } };
  root.append(h('div.tool.two', h('div.stack', section('1. Add archives or files', dropzone({ accept: '.zip,.tar,.gz,.tgz,.tar.gz,.rar,.7z,*/*', multiple: true, label: 'Drop TAR / TAR.GZ / TGZ / GZ / ZIP archives, or any files', onFiles: (fs) => { files.push(...fs); chips.replaceChildren(...files.map((f) => fileChip(f))); for (const f of fs) inspect(f); } }), chips), section('2. Options', field('Compression', level), flatten, notice('Supported natively: ZIP (incl. zip64), TAR, GZIP, TAR.GZ/TGZ. RAR and 7Z use proprietary/LZMA compression that is not implemented here; those files are passed through unchanged.', 'warn'), go)), h('div', listing, out)));
}
