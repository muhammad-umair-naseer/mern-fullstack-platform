import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateRawSync } from 'node:zlib';
import { inflateRaw, inflateGzip } from '../../src/core/bytes.js';
import { readZip, writeZip } from '../../src/core/zip.js';
import { checkFiles } from '../../src/core/limits.js';

test('inflation stops at actual output budget, including partial mode', () => {
  const compressed = new Uint8Array(deflateRawSync(Buffer.alloc(10000, 65)));
  assert.throws(() => inflateRaw(compressed, { maxOutput: 100, partial: true }), /limit/);
  assert.equal(inflateRaw(compressed, { maxOutput: 10000 }).length, 10000);
});
test('unterminated gzip filename fails instead of looping forever', () => {
  assert.throws(() => inflateGzip(new Uint8Array([31,139,8,8,0,0,0,0,0,0,65,65])), /Truncated/);
});
test('ZIP rejects false expanded sizes and validates data integrity', async () => {
  const zip = await writeZip([{name:'a.txt',data:new Uint8Array(4096).fill(65)}]);
  const data = readZip(zip).entries[0].data(); assert.equal(data.length,4096);
  const bad = zip.slice(); let central = -1;
  for(let i=0;i<bad.length-4;i++)if(bad[i]===80&&bad[i+1]===75&&bad[i+2]===1&&bad[i+3]===2){central=i;break;}
  assert.ok(central>=0);new DataView(bad.buffer).setUint32(central+24,1,true);
  assert.throws(()=>readZip(bad).entries[0].data(),/limit|mismatch/);
  new DataView(bad.buffer).setUint32(central+24,200*1024*1024,true);
  assert.throws(()=>readZip(bad),/limit/);
});
test('selection count, per-file and total budgets are enforced', () => {
  assert.doesNotThrow(()=>checkFiles([{size:1024}]));
  assert.throws(()=>checkFiles(Array.from({length:21},()=>({size:1}))),/20/);
  assert.throws(()=>checkFiles([{size:51*1024*1024}]),/50 MB/);
  assert.throws(()=>checkFiles(Array.from({length:3},()=>({size:40*1024*1024}))),/100 MB/);
});
