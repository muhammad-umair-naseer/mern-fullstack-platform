import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync, deflateRawSync, deflateSync } from 'node:zlib';
import { inflateRaw, inflateZlib, inflateGzip, crc32, base64, base64url, hex, utf8, ByteWriter, deflateRaw, storedRaw } from '../../src/core/bytes.js';

test('inflate: raw/zlib/gzip match Node zlib', () => {
  const data = utf8.encode('Cortexis '.repeat(5000) + 'end');
  assert.deepEqual(inflateRaw(new Uint8Array(deflateRawSync(data))), data);
  assert.deepEqual(inflateZlib(new Uint8Array(deflateSync(data))), data);
  assert.deepEqual(inflateGzip(new Uint8Array(gzipSync(data))), data);
  for (const level of [0, 1, 9]) assert.deepEqual(inflateRaw(new Uint8Array(deflateRawSync(data, { level }))), data);
});
test('deflate: own output round-trips through Node', async () => {
  const data = utf8.encode('hello hello hello hello');
  const packed = await deflateRaw(data);
  assert.deepEqual(inflateRaw(packed), data);
  assert.deepEqual(inflateRaw(storedRaw(data)), data);
});
test('crc32 / base64 / hex', () => {
  assert.equal(crc32(utf8.encode('123456789')) >>> 0, 0xcbf43926);
  assert.equal(base64.encode(utf8.encode('Man')), 'TWFu');
  assert.deepEqual(base64.decode('TWFu'), utf8.encode('Man'));
  assert.equal(base64url.encode(new Uint8Array([251, 255])), '-_8');
  assert.deepEqual(base64url.decode('-_8'), new Uint8Array([251, 255]));
  assert.equal(hex(new Uint8Array([0, 15, 255])), '000fff');
});
test('ByteWriter big/little endian', () => {
  const w = new ByteWriter(4); w.u16be(0x0102).u32le(0x01020304).str('ab').u8(7);
  assert.deepEqual([...w.result()], [1, 2, 4, 3, 2, 1, 97, 98, 7]);
});
