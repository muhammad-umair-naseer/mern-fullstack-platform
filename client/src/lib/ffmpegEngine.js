/**
 * Client-Side FFmpeg WASM Engine Manager
 * Zero uploads. Runs entirely in the user's browser using WebAssembly.
 */
import { loadVendorScript } from './dynamicVendor';

let ffmpegInstance = null;
let isLoaded = false;
let loadingPromise = null;
let logBuffer = [];
let coreBlobUrls = null;

async function fetchWithProgress(url, mimeType, onProgress) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body || !res.body.getReader) {
    const blob = await res.blob();
    if (onProgress) onProgress(blob.size, total || blob.size, true);
    return blob;
  }
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (onProgress) onProgress(received, total || received, false);
  }
  return new Blob(chunks, { type: mimeType });
}

export async function initFFmpeg(onDownloadProgress) {
  if (isLoaded && ffmpegInstance) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    // Load ffmpeg.js UMD
    await loadVendorScript('/vendor/ffmpeg/ffmpeg.js');

    if (!window.FFmpegWASM || !window.FFmpegWASM.FFmpeg) {
      throw new Error('FFmpeg WASM wrapper not found in global window.');
    }

    if (!coreBlobUrls) {
      const sizes = { js: [0, 0], wasm: [0, 0] };
      const report = () => {
        if (onDownloadProgress) {
          const got = sizes.js[0] + sizes.wasm[0];
          const tot = sizes.js[1] + sizes.wasm[1];
          onDownloadProgress(got, tot);
        }
      };

      const [jsBlob, wasmBlob] = await Promise.all([
        fetchWithProgress('/vendor/ffmpeg/ffmpeg-core.js', 'text/javascript', (g, t) => {
          sizes.js = [g, t];
          report();
        }),
        fetchWithProgress('/vendor/ffmpeg/ffmpeg-core.wasm', 'application/wasm', (g, t) => {
          sizes.wasm = [g, t];
          report();
        }),
      ]);

      coreBlobUrls = {
        coreURL: URL.createObjectURL(jsBlob),
        wasmURL: URL.createObjectURL(wasmBlob),
      };
    }

    ffmpegInstance = new window.FFmpegWASM.FFmpeg();

    ffmpegInstance.on('log', ({ message }) => {
      logBuffer.push(message);
      if (logBuffer.length > 300) logBuffer.shift();
    });

    await ffmpegInstance.load({
      coreURL: coreBlobUrls.coreURL,
      wasmURL: coreBlobUrls.wasmURL,
      classWorkerURL: `${window.location.origin}/vendor/ffmpeg/814.ffmpeg.js`,
    });

    isLoaded = true;
    loadingPromise = null;
    return ffmpegInstance;
  })().catch((err) => {
    loadingPromise = null;
    isLoaded = false;
    if (ffmpegInstance) {
      try {
        ffmpegInstance.terminate();
      } catch (e) {}
      ffmpegInstance = null;
    }
    throw err;
  });

  return loadingPromise;
}

export async function runFFmpegJob({
  inputs, // array of { name: string, data: Uint8Array }
  args, // array of string arguments, e.g. ['-i', 'input.mp4', '-b:a', '128k', 'output.mp3']
  outName, // string output filename, e.g. 'output.mp3'
  onProgress, // (progressRatio: number) => void
  onLog, // (msg: string) => void
}) {
  const ffmpeg = await initFFmpeg();
  logBuffer = [];

  const logHandler = ({ message }) => {
    if (onLog) onLog(message);
  };
  const progressHandler = ({ progress }) => {
    if (onProgress) onProgress(progress);
  };

  ffmpeg.on('log', logHandler);
  ffmpeg.on('progress', progressHandler);

  try {
    // Write input files
    for (const input of inputs) {
      await ffmpeg.writeFile(input.name, input.data);
    }

    const code = await ffmpeg.exec(args);
    if (code !== 0) {
      const tail = logBuffer.slice(-10).join('\n');
      throw new Error(`FFmpeg exited with error code ${code}.\n${tail}`);
    }

    const outputData = await ffmpeg.readFile(outName);

    // Clean up files in virtual memory
    for (const input of inputs) {
      try {
        await ffmpeg.deleteFile(input.name);
      } catch (e) {}
    }
    try {
      await ffmpeg.deleteFile(outName);
    } catch (e) {}

    return outputData;
  } catch (err) {
    // Reset instance on error so memory corruption doesn't linger
    try {
      if (ffmpegInstance) ffmpegInstance.terminate();
    } catch (e) {}
    ffmpegInstance = null;
    isLoaded = false;
    throw err;
  } finally {
    ffmpeg.off('log', logHandler);
    ffmpeg.off('progress', progressHandler);
  }
}

export async function runFfmpegCommand(file, inName, outName, args, onProgress) {
  const buf = await file.arrayBuffer();
  return runFFmpegJob({
    inputs: [{ name: inName, data: new Uint8Array(buf) }],
    args,
    outName,
    onProgress: (p) => {
      if (onProgress) onProgress(p);
    },
    onLog: (msg) => {
      if (onProgress) onProgress(null, msg);
    },
  });
}

