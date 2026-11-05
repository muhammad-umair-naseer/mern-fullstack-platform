/**
 * Client-Side FFmpeg WASM Engine Manager
 * Zero uploads. Runs entirely in the user's browser using WebAssembly.
 */
import { loadVendorScript } from './vendor-loader.js';

let ffmpegInstance = null;
let isLoaded = false;
let loadingPromise = null;
let logBuffer = [];
let coreBlobUrls = null;

export async function initFFmpeg(onDownloadProgress) {
  if (isLoaded && ffmpegInstance) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    // Load ffmpeg.js UMD
    await loadVendorScript('/vendor/ffmpeg/ffmpeg.js');

    if (!window.FFmpegWASM || !window.FFmpegWASM.FFmpeg) {
      throw new Error('FFmpeg WASM wrapper not found in global window.');
    }

    coreBlobUrls = { coreURL: new URL('/vendor/ffmpeg/ffmpeg-core.js', location.origin).href, wasmURL: new URL('/vendor/ffmpeg/ffmpeg-core.wasm', location.origin).href };
    onDownloadProgress?.(0, 0);

    ffmpegInstance = new window.FFmpegWASM.FFmpeg();

    ffmpegInstance.on('log', ({ message }) => {
      logBuffer.push(message);
      if (logBuffer.length > 300) logBuffer.shift();
    });

    await ffmpegInstance.load({
      coreURL: coreBlobUrls.coreURL,
      wasmURL: coreBlobUrls.wasmURL,
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

let jobQueue = Promise.resolve();
export function runFFmpegJob(options) {
  const job = jobQueue.then(() => executeFFmpegJob(options));
  jobQueue = job.catch(() => {});
  return job;
}
async function executeFFmpegJob({
  inputs, // array of { name: string, data: Uint8Array }
  args, // array of string arguments, e.g. ['-i', 'input.mp4', '-b:a', '128k', 'output.mp3']
  outName, // string output filename, e.g. 'output.mp3'
  onProgress, // (progressRatio: number) => void
  onLog, // (msg: string) => void
}) {
  if (inputs.reduce((n, f) => n + f.data.byteLength, 0) > 100 * 1024 * 1024) throw new Error('Media inputs exceed 100 MB.');
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

    const code = await ffmpeg.exec(args, 60000);
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
