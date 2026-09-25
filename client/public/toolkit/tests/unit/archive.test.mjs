import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readZip, writeZip, readTar, readArchive, gzip, isZip, isRar, is7z } from '../../src/core/zip.js';
import { utf8 } from '../../src/core/bytes.js';
import { has } from './_helpers.mjs';

test('writeZip → readZip round-trip (deflate + store, dirs, unicode names)', async () => {
  const files = [{ name: 'a.txt', data: 'hello '.repeat(1000) }, { name: 'dir/', data: null }, { name: 'dir/ünï-çødé.bin', data: new Uint8Array([1, 2, 3, 0, 255]), store: true }];
  const z = await writeZip(files);
  assert.ok(isZip(z));
  const r = readZip(z);
  assert.deepEqual(r.entries.map((e) => e.name), ['a.txt', 'dir/', 'dir/ünï-çødé.bin']);
  assert.equal(utf8.decode(r.entries[0].data()), 'hello '.repeat(1000));
  assert.deepEqual(r.entries[2].data(), new Uint8Array([1, 2, 3, 0, 255]));
  assert.ok(r.entries[1].isDir);
  if (has('unzip')) { const d = mkdtempSync(join(tmpdir(), 'zz')); writeFileSync(join(d, 'x.zip'), z); execSync(`unzip -t "${join(d, 'x.zip')}"`, { stdio: 'ignore' }); }
});
test('reads system-made zip / tar / tar.gz / gz', () => {
  if (!has('zip') || !has('tar') || !has('gzip')) return;
  const d = mkdtempSync(join(tmpdir(), 'ar'));
  writeFileSync(join(d, 'one.txt'), 'one'); writeFileSync(join(d, 'two.txt'), 'two two');
  execSync(`cd "${d}" && zip -q s.zip one.txt two.txt && tar cf s.tar one.txt two.txt && tar czf s.tgz one.txt two.txt && gzip -k one.txt`);
  const zip = readArchive(new Uint8Array(readFileSync(join(d, 's.zip'))), 's.zip'); assert.equal(zip.kind, 'zip'); assert.equal(utf8.decode(zip.entries.find((e) => e.name === 'two.txt').data()), 'two two');
  const tar = readArchive(new Uint8Array(readFileSync(join(d, 's.tar'))), 's.tar'); assert.equal(tar.kind, 'tar'); assert.equal(tar.entries.length, 2);
  const tgz = readArchive(new Uint8Array(readFileSync(join(d, 's.tgz'))), 's.tgz'); assert.equal(tgz.kind, 'tar.gz'); assert.equal(utf8.decode(tgz.entries.find((e) => e.name === 'one.txt').data()), 'one');
  const gz = readArchive(new Uint8Array(readFileSync(join(d, 'one.txt.gz'))), 'one.txt.gz'); assert.equal(gz.kind, 'gz'); assert.equal(gz.entries[0].name, 'one.txt');
});
test('RAR / 7Z are detected and rejected with a friendly message', () => {
  const rar = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00, 0, 0, 0, 0]); const sz = new Uint8Array([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c, 0, 0, 0, 0, 0, 0]);
  assert.ok(isRar(rar)); assert.ok(is7z(sz));
  assert.throws(() => readArchive(rar, 'x.rar'), /RAR/); assert.throws(() => readArchive(sz, 'x.7z'), /7Z/);
});
test('gzip writer output is readable by Node', async () => {
  const g = await gzip(utf8.encode('gzip me'));
  const { gunzipSync } = await import('node:zlib');
  assert.equal(gunzipSync(Buffer.from(g)).toString(), 'gzip me');
});
