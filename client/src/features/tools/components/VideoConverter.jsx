import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Video, RefreshCw, Download, AlertCircle, Check } from 'lucide-react';
import { runFFmpegJob } from '../../../lib/ffmpegEngine.js';
import { formatFileSize } from '../../../lib/fileValidation.js';
import { dropHandlers } from '../../../lib/dropzone.js';

const VIDEO_FORMATS = [
  { id: 'mp4', label: 'MP4 (H.264 / AAC - Universal)', ext: 'mp4', mime: 'video/mp4' },
  { id: 'webm', label: 'WebM (VP8 / Opus - Web Open)', ext: 'webm', mime: 'video/webm' },
  { id: 'mkv', label: 'MKV (Matroska Multimedia)', ext: 'mkv', mime: 'video/x-matroska' },
  { id: 'mov', label: 'MOV (QuickTime Movie)', ext: 'mov', mime: 'video/quicktime' },
  { id: 'avi', label: 'AVI (Audio Video Interleaved)', ext: 'avi', mime: 'video/x-msvideo' },
];

export default function VideoConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('mp4');
  const [height, setHeight] = useState(0); // 0 = original
  const [status, setStatus] = useState('idle'); // 'idle' | 'converting' | 'ready' | 'error'
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

    if (!f.type.startsWith('video/') && !f.name.match(/\.(mp4|mov|mkv|webm|avi|flv|wmv)$/i)) {
      setStatus('error');
      setStatusMsg('Please select a valid video file.');
      return;
    }

    setFile(f);
  };

  const handleConvert = async () => {
    if (!file) return;
    cleanupUrls();
    setStatus('converting');
    setProgress(0);
    setStatusMsg('Initializing FFmpeg video transcode...');

    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const inName = `input.${ext}`;
      const targetFmt = VIDEO_FORMATS.find((v) => v.id === format) || VIDEO_FORMATS[0];
      const outName = `output.${targetFmt.ext}`;

      const args = ['-i', inName];
      if (height > 0) {
        args.push('-vf', `scale=-2:'min(${height},ih)'`);
      }

      if (format === 'mp4' || format === 'mov' || format === 'mkv') {
        args.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k');
        if (format === 'mp4' || format === 'mov') args.push('-movflags', '+faststart');
      } else if (format === 'webm') {
        args.push('-c:v', 'libvpx', '-crf', '10', '-b:v', '1.5M', '-deadline', 'realtime', '-cpu-used', '5', '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '96k');
      } else if (format === 'avi') {
        args.push('-c:v', 'mpeg4', '-q:v', '5', '-c:a', 'libmp3lame', '-b:a', '128k');
      }

      args.push('-y', outName);

      const buffer = await file.arrayBuffer();
      const inputData = new Uint8Array(buffer);

      setStatusMsg(`Transcoding video to ${targetFmt.label}...`);

      const outputData = await runFFmpegJob({
        inputs: [{ name: inName, data: inputData }],
        args,
        outName,
        onProgress: (ratio) => setProgress(Math.min(99, Math.round(ratio * 100))),
      });

      const blob = new Blob([outputData], { type: targetFmt.mime });
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultBlobUrl(url);
      setResultSize(blob.size);
      setProgress(100);
      setStatus('ready');
      setStatusMsg(`✓ Converted to .${targetFmt.ext} (${formatFileSize(blob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Video conversion failed: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${baseName}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          {...dropHandlers(handleSelectFile)}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-10 text-center cursor-pointer transition"
        >
          <Video className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop Video File to Convert</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert between MP4, WebM, MKV, MOV, and AVI locally in your browser with full audio/video stream alignment.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose Video
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
                <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
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

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  {VIDEO_FORMATS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Max Height Resolution</label>
                <select
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="0">Original Resolution</option>
                  <option value="480">480p (SD)</option>
                  <option value="720">720p (HD)</option>
                  <option value="1080">1080p (Full HD)</option>
                </select>
              </div>
            </div>

            {status === 'converting' && (
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
                onClick={handleConvert}
                disabled={status === 'converting'}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {status === 'converting' ? 'Converting Video...' : 'Convert Video'}
              </button>
            </div>
          </div>

          {resultBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Converted Video ({format.toUpperCase()} · {formatFileSize(resultSize)})
                </span>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Converted Video
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
