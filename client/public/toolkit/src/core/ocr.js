let loading;
export function recognizeWithBudget(worker, image, { signal, timeoutMs = 60000 } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
      if (error) { worker.terminate(); reject(error); } else resolve(result);
    };
    const abort = () => finish(new Error('OCR cancelled.'));
    const timer = setTimeout(() => finish(new Error('OCR exceeded 60 seconds for this page. Try a smaller image.')), timeoutMs);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) { abort(); return; }
    worker.recognize(image).then(result => finish(null, result), error => finish(error));
  });
}
export async function createLocalOcrWorker(language = 'eng', options = {}) {
  if (!['eng','ara','urd','hin','spa','fra','deu','ita','por'].includes(language)) throw new Error('Unsupported OCR language');
  if (!globalThis.Tesseract) {
    loading ||= new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = '/vendor/tesseract/tesseract.min.js';
      script.onload = resolve; script.onerror = () => { loading = null; reject(new Error('OCR engine could not load. Please retry.')); }; document.head.append(script);
    });
    await loading;
  }
  return globalThis.Tesseract.createWorker(language, 1, {
    ...options, workerPath: '/vendor/tesseract/worker.min.js', workerBlobURL: false,
    corePath: '/vendor/tesseract/core', langPath: '/vendor/tesseract/lang', gzip: true,
  });
}
