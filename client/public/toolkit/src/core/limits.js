export function checkFiles(files) {
  const list = Array.from(files || []);
  if (list.length > 20) throw new Error('Select at most 20 files per operation.');
  if (list.some(f => f.size > 50 * 1024 * 1024)) throw new Error('Each file must be 50 MB or smaller.');
  if (list.reduce((sum, f) => sum + f.size, 0) > 100 * 1024 * 1024) throw new Error('Selected files must total 100 MB or less.');
}
