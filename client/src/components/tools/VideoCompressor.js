import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Video, Sliders, Download, AlertCircle, Check } from 'lucide-react';
import { runFFmpegJob } from '../../lib/ffmpegEngine';
import { formatFileSize } from '../../lib/fileValidation';

export default function VideoCompressor() {
  const [file, setFile] = useState(null);
  const [crf, setCrf] = useState(28); // 18..36 (higher = smaller size)
  const [maxWidth, setMaxWidth] = useState(1280);
  const [fps, setFps] = useState(0); // 0 = keep original
  const [abr, setAbr] = useState(96); // audio bitrate
  const [status, setStatus] = useState('idle'); // 'idle' | 'compressing' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [resultBlobUrl, setResultBlobUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);

  const fileInputRef = useRef(null);
  const resultUrlRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResultBlobUrl('');
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleSelectFile = (f) => {
    if (!f) return;
    cleanupUrls();
    setFile(null);
    setStatus('idle');
    setStatusMsg('');

    if (!f.type.startsWith('video/') && !f.name.match(/\.(mp4|mov|mkv|webm|avi)$/i)) {
      setStatus('error');
      setStatusMsg('Please select a valid video file (.mp4, .mov, etc.).');
      return;
    }

    setFile(f);
  };

  const handleCompress = async () => {
    if (!file) return;
    cleanupUrls();
    setStatus('compressing');
    setProgress(0);
    setStatusMsg('Initializing FFmpeg H.264 video compressor...');

    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const inName = `input.${ext}`;
      const outName = 'output.mp4';

      const args = [
        '-i', inName,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', String(crf),
        '-pix_fmt', 'yuv420p',
      ];

      if (maxWidth > 0) {
        args.push('-vf', `scale='min(${maxWidth},iw)':-2`);
      }
      if (fps > 0) {
        args.push('-r', String(fps));
      }

      args.push('-c:a', 'aac', '-b:a', `${abr}k`, '-movflags', '+faststart', '-y', outName);

      const buffer = await file.arrayBuffer();
      const inputData = new Uint8Array(buffer);

      setStatusMsg('Compressing video in browser (WebAssembly)...');

      const outputData = await runFFmpegJob({
        inputs: [{ name: inName, data: inputData }],
        args,
        outName,
        onProgress: (ratio) => setProgress(Math.min(99, Math.round(ratio * 100))),
      });

      const blob = new Blob([outputData], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultBlobUrl(url);
      setResultSize(blob.size);
      setProgress(100);

      const saved = Math.round((1 - blob.size / file.size) * 100);
      setStatus('ready');
      setStatusMsg(
        saved > 0
          ? `✓ Compressed by ${saved}% (${formatFileSize(file.size)} → ${formatFileSize(blob.size)})`
          : `✓ Re-encoded MP4 (${formatFileSize(blob.size)})`
      );
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Compression failed: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${baseName}_compressed.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-10 text-center cursor-pointer transition"
        >
          <Video className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop Video File to Compress</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Shrink MP4, MOV, and WebM video files using high-efficiency H.264 compression in your browser.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Select Video File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files?.[0] && handleSelectFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">Original Size: {formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => {
                  cleanupUrls();
                  setFile(null);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Change Video
              </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Compression Level (CRF)</span>
                  <span className="text-orange-400 font-bold">{crf}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="36"
                  value={crf}
                  onChange={(e) => setCrf(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 h-2 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">
                  {crf <= 23 ? 'High Quality' : crf <= 28 ? 'Balanced (Recommended)' : 'Smallest File Size'}
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Max Width (Downscale Only)</label>
                <select
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="640">640px (SD / Mobile)</option>
                  <option value="1280">1280px (720p HD)</option>
                  <option value="1920">1920px (1080p FHD)</option>
                  <option value="0">Original Resolution</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Frame Rate Limit</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="0">Original Frame Rate</option>
                  <option value="24">24 FPS (Film standard)</option>
                  <option value="30">30 FPS (Standard video)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Audio Bitrate</label>
                <select
                  value={abr}
                  onChange={(e) => setAbr(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="64">64 kbps (Voice / Low)</option>
                  <option value="96">96 kbps (Balanced)</option>
                  <option value="128">128 kbps (Standard AAC)</option>
                </select>
              </div>
            </div>

            {status === 'compressing' && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>{statusMsg}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleCompress}
                disabled={status === 'compressing'}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                {status === 'compressing' ? 'Compressing Video...' : 'Compress Video'}
              </button>
            </div>
          </div>

          {resultBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Compressed Video Preview ({formatFileSize(resultSize)})
                </span>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Compressed Video
                </button>
              </div>
              <video controls src={resultBlobUrl} className="w-full rounded-2xl bg-black max-h-96 mx-auto" />
            </div>
          )}
        </div>
      )}

      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
            status === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          {status === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
