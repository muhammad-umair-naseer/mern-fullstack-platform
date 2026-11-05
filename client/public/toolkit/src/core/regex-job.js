export function regexJob(data, { timeout = 750 } = {}) {
  const worker = new Worker(new URL('./regex-worker.js', import.meta.url), { type: 'module' });
  let timer, cancel;
  const promise = new Promise((resolve, reject) => {
    const finish = (error, result) => { clearTimeout(timer); worker.terminate(); error ? reject(error) : resolve(result); };
    cancel = () => finish(new Error('Cancelled'));
    worker.onmessage = e => finish(e.data.error ? new Error(e.data.error) : null, e.data);
    worker.onerror = () => finish(new Error('Regex worker could not run.'));
    timer = setTimeout(() => finish(new Error('Pattern exceeded the time limit. Simplify it or shorten the text.')), timeout);
    worker.postMessage(data);
  });
  return { promise, cancel };
}
