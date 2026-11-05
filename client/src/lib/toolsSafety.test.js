import { afterEach, expect, test, vi } from 'vitest';
import { confirmRemoteCapture } from './captureConsent.js';
import { safeZipEntries } from './safeArchive.js';
import { writeZip } from '../../public/toolkit/src/core/zip.js';
afterEach(() => vi.restoreAllMocks());

test('remote captures require explicit consent for a normalized public URL', () => {
  const consent=vi.spyOn(window,'confirm').mockReturnValue(false);
  expect(()=>confirmRemoteCapture('example.com')).toThrow(/cancelled/);
  expect(consent).toHaveBeenCalledWith(expect.stringContaining('Thum.io'));
  consent.mockReturnValue(true);
  expect(confirmRemoteCapture('example.com/page')).toBe('https://example.com/page');
});
test('unsupported schemes, credentials and local addresses fail before asking consent', () => {
  const consent=vi.spyOn(window,'confirm').mockReturnValue(true);
  for(const url of ['javascript:alert(1)','file:///x','http://127.0.0.1','http://[::1]','http://localhost','https://user:pass@example.com','http://device.local'])expect(()=>confirmRemoteCapture(url)).toThrow();
  expect(consent).not.toHaveBeenCalled();
});
test('React archive adapter exports verified bytes and rejects oversized uploads', async () => {
  const bytes=await writeZip([{name:'test.txt',data:new Uint8Array([65,66])}],{level:'store'});
  const entries=await safeZipEntries({size:bytes.length,arrayBuffer:async()=>bytes.buffer});
  const written=[];let closed=false;
  await entries[0].getData({write:async data=>written.push(...data),close:async()=>{closed=true;}});
  expect(written).toEqual([65,66]);expect(closed).toBe(true);
  await expect(safeZipEntries({size:51*1024*1024})).rejects.toThrow(/50 MB/);
});
