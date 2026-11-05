import { readZip } from '../../public/toolkit/src/core/zip.js';

// Use the bounded reader for both listing and extraction. Declared sizes alone
// are insufficient: inflate also enforces its byte ceiling and checks the CRC.
export async function safeZipEntries(file) {
  if (file.size > 50 * 1024 * 1024) throw new Error('Archive exceeds 50 MB.');
  const { entries } = readZip(new Uint8Array(await file.arrayBuffer()));
  return entries.map(entry => ({
    filename: entry.name, directory: entry.isDir, uncompressedSize: entry.size,
    getData: async writer => {
      const bytes = entry.data();
      if (writer && typeof writer.write === 'function' && typeof writer.close === 'function') {
        await writer.write(bytes); await writer.close();
      }
      return new Blob([bytes]);
    },
  }));
}
