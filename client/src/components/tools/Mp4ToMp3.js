import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Video, Download, AlertCircle, Check } from 'lucide-react';
import { runFFmpegJob } from '../../lib/ffmpegEngine';
import { formatFileSize } from '../../lib/fileValidation';

export default function Mp4ToMp3() {
  const [file, setFile] = useState(null);
  const [bitrate, setBitrate] = useState('192');
  const [status, setStatus] = useState('idle'); // 'idle' | 'extracting' | 'ready' | 'error'
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
      setStatusMsg('Please select a valid video file.');
      return;
    }

    setFile(f);
  };

  const handleExtract = async () => {
    if (!file) return;
    cleanupUrls();
    setStatus('extracting');
    setProgress(0);
    setStatusMsg('Extracting audio track with FFmpeg...');

    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const inName = `input.${ext}`;
      const outName = 'output.mp3';

      const args = ['-i', inName, '-vn', '-c:a', 'libmp3lame', '-b:a', `${bitrate}k`, '-y', outName];

      const buffer = await file.arrayBuffer();
      const inputData = new Uint8Array(buffer);

      const outputData = await runFFmpegJob({
        inputs: [{ name: inName, data: inputData }],
        args,
        outName,
        onProgress: (ratio) => setProgress(Math.min(99, Math.round(ratio * 100))),
      });

      const blob = new Blob([outputData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultBlobUrl(url);
      setResultSize(blob.size);
      setProgress(100);
      setStatus('ready');
      setStatusMsg(`✓ Audio extracted successfully (${formatFileSize(blob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Extraction failed: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${baseName}.mp3`;
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
          <h3 className="text-lg font-bold text-slate-100">Drop Video File Here (MP4, MOV, WebM)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Extract pure MP3 audio from any video file without uploading anything to a server.
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
                <label className="text-slate-400 block mb-1">Target MP3 Bitrate</label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="128">128 kbps (Standard)</option>
                  <option value="160">160 kbps (Good)</option>
                  <option value="192">192 kbps (High Quality)</option>
                  <option value="256">256 kbps (Very High)</option>
                  <option value="320">320 kbps (Studio Max)</option>
                </select>
              </div>
            </div>

            {status === 'extracting' && (
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
                onClick={handleExtract}
                disabled={status === 'extracting'}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Music className="w-4 h-4" />
                {status === 'extracting' ? 'Extracting MP3 Audio...' : 'Extract MP3 Audio Track'}
              </button>
            </div>
          </div>

          {resultBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Extracted Audio Track ({formatFileSize(resultSize)})
                </span>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download MP3
                </button>
              </div>
              <audio controls src={resultBlobUrl} className="w-full rounded-xl bg-slate-900" />
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
