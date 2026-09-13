import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Film, Download, Sparkles, AlertCircle, Check } from 'lucide-react';
import { runFFmpegJob } from '../../lib/ffmpegEngine';
import { formatFileSize } from '../../lib/fileValidation';
import { dropHandlers } from '../../lib/dropzone';

export default function Mp4ToGif() {
  const [file, setFile] = useState(null);
  const [startTime, setStartTime] = useState(0); // seconds
  const [duration, setDuration] = useState(5); // seconds
  const [fps, setFps] = useState(12);
  const [width, setWidth] = useState(480);
  const [colors] = useState(256);
  const [status, setStatus] = useState('idle'); // 'idle' | 'converting' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [resultBlobUrl, setResultBlobUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

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

  const handleSelectFile = async (f) => {
    if (!f) return;
    cleanupUrls();
    setFile(null);
    setStatus('idle');
    setStatusMsg('');

    if (!f.type.startsWith('video/') && !f.name.match(/\.(mp4|mov|mkv|webm|avi)$/i)) {
      setStatus('error');
      setStatusMsg('Please select a valid video file (.mp4, .mov, .webm, etc.).');
      return;
    }

    // Inspect video duration via temporary object URL
    const tempUrl = URL.createObjectURL(f);
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      setVideoDuration(Math.round(video.duration || 0));
      setDuration(Math.min(10, Math.round(video.duration || 5)));
      URL.revokeObjectURL(tempUrl);
    };
    video.src = tempUrl;

    setFile(f);
  };

  const handleConvert = async () => {
    if (!file) return;
    cleanupUrls();
    setStatus('converting');
    setProgress(0);
    setStatusMsg('Initializing FFmpeg GIF generator...');

    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const inName = `input.${ext}`;
      const outName = 'output.gif';

      const args = [];
      if (startTime > 0) args.push('-ss', String(startTime));
      if (duration > 0) args.push('-t', String(duration));
      args.push('-i', inName);

      const vf = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${colors}[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5`;
      args.push('-vf', vf, '-loop', '0', '-y', outName);

      const buffer = await file.arrayBuffer();
      const inputData = new Uint8Array(buffer);

      setStatusMsg('Extracting frames and generating 2-pass palette GIF...');

      const outputData = await runFFmpegJob({
        inputs: [{ name: inName, data: inputData }],
        args,
        outName,
        onProgress: (ratio) => setProgress(Math.min(99, Math.round(ratio * 100))),
      });

      const blob = new Blob([outputData], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultBlobUrl(url);
      setResultSize(blob.size);
      setProgress(100);
      setStatus('ready');
      setStatusMsg(`✓ GIF created: output.gif (${formatFileSize(blob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`GIF conversion error: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${baseName}.gif`;
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
          <Film className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop Video Clip Here (MP4, MOV, WebM)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert any video segment to a smooth, high-quality animated GIF using two-pass color palette generation.
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
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)} {videoDuration > 0 && `· Duration ~${videoDuration}s`}
                </p>
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
                <label className="text-slate-400 block mb-1">Start Time (seconds)</label>
                <input
                  type="number"
                  min="0"
                  value={startTime}
                  onChange={(e) => setStartTime(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Clip Duration (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Frame Rate (FPS)</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="10">10 FPS (Compact)</option>
                  <option value="12">12 FPS (Standard GIF)</option>
                  <option value="15">15 FPS (Smooth)</option>
                  <option value="24">24 FPS (Cinematic)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Width (px)</label>
                <select
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="320">320px (Small)</option>
                  <option value="480">480px (Standard)</option>
                  <option value="640">640px (Medium)</option>
                  <option value="800">800px (HD)</option>
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
                <Sparkles className="w-4 h-4" />
                {status === 'converting' ? 'Rendering GIF...' : 'Convert Video to GIF'}
              </button>
            </div>
          </div>

          {resultBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 text-center">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Generated Animated GIF ({formatFileSize(resultSize)})
                </span>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download GIF
                </button>
              </div>
              <img src={resultBlobUrl} alt="Generated GIF" className="max-h-80 mx-auto rounded-xl object-contain border border-slate-800" />
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
