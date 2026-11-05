// AES-256 encryption through the isolated, locally hosted QPDF WASM engine.
import { load } from '@wasm-zoo/qpdf/self-hosted';
export async function protectPdf(file, options = {}, onProgress, signal) {
  const user = options.userPassword || '';
  const owner = options.ownerPassword || user;
  if (user.length < 8) throw new Error('Use a password of at least 8 characters.');
  if ([user, owner].some(p => new TextEncoder().encode(p).length > 127 || p.includes('\0'))) throw new Error('Passwords must be at most 127 UTF-8 bytes and contain no null characters.');
  if (file.size > 50 * 1024 * 1024) throw new Error('PDF protection supports files up to 50 MB per operation.');
  if (signal?.aborted) throw new Error('Cancelled');
  onProgress?.({ progress: 10, message: 'Loading local AES-256 PDF engine...' });
  const runtime = await load({ baseUrl: '/vendor/qpdf/' });
  try {
    const input = new Uint8Array(await file.arrayBuffer());
    if (signal?.aborted) throw new Error('Cancelled');
    onProgress?.({ progress: 35, message: 'Encrypting PDF locally...' });
    const args = ['--encrypt', '--user-password=' + user, '--owner-password=' + owner, '--bits=256',
      '--print=' + (options.allowPrint === false ? 'none' : 'full'), '--extract=' + (options.allowCopy === false ? 'n' : 'y'),
      '--modify-other=' + (options.allowModify ? 'y' : 'n'), '--annotate=' + (options.allowAnnotate ? 'y' : 'n'), '--', '/input.pdf', '/output.pdf'];
    const result = await runtime.exec(args, { files: [{ name: '/input.pdf', data: input }], outputs: ['/output.pdf'], timeoutMs: 60000 });
    if (signal?.aborted) throw new Error('Cancelled');
    if (result.exitCode !== 0 || !result.files[0]?.data?.length) throw new Error('PDF could not be protected. Use a valid, unlocked PDF.');
    onProgress?.({ progress: 100, message: 'AES-256 protection applied.' });
    return { blob: new Blob([result.files[0].data], { type: 'application/pdf' }), filename: file.name.replace(/\.pdf$/i, '') + '-protected.pdf' };
  } catch {
    // Runtime diagnostics can contain CLI password arguments; never expose them.
    if (signal?.aborted) throw new Error('Cancelled');
    throw new Error('PDF protection failed. Check that the PDF is valid and unlocked, then retry.');
  } finally { runtime.dispose(); }
}
