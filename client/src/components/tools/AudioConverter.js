import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Upload, Download, RefreshCw, AlertCircle, Check, Play } from 'lucide-react';
import { runFFmpegJob } from '../../lib/ffmpegEngine';
import { validateAudioFile, formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

const AUDIO_FORMATS = [
  { id: 'mp3', label: 'MP3 (MPEG Audio)', ext: 'mp3', mime: 'audio/mpeg', defaultBitrate: '192k' },
  { id: 'wav', label: 'WAV (Uncompressed PCM)', ext: 'wav', mime: 'audio/wav', defaultBitrate: '' },
  { id: 'ogg', label: 'OGG (Vorbis)', ext: 'ogg', mime: 'audio/ogg', defaultBitrate: '160k' },
  { id: 'opus', label: 'Opus (High Efficiency)', ext: 'opus', mime: 'audio/ogg', defaultBitrate: '128k' },
  { id: 'flac', label: 'FLAC (Lossless)', ext: 'flac', mime: 'audio/flac', defaultBitrate: '' },
  { id: 'm4a', label: 'M4A (AAC Audio)', ext: 'm4a', mime: 'audio/mp4', defaultBitrate: '160k' },
];

export default function AudioConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('mp3');
  const [bitrate, setBitrate] = useState('192');
  const [status, setStatus] = useState('idle'); // 'idle' | 'converting' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [resultBlobUrl, setResultBlobUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleSelectFile = async (selectedFile) => {
    if (!selectedFile) return;
    cleanupUrls();
    setFile(null);
    setStatus('idle');
    setStatusMsg('');

    const val = await validateAudioFile(selectedFile);
    if (!val.valid) {
      setStatus('error');
      setStatusMsg(val.error);
      return;
    }

    setFile(selectedFile);
  };

  const handleConvert = async () => {
    if (!file) return;
    cleanupUrls();
    setStatus('converting');
    setProgress(0);
    setStatusMsg('Loading in-browser audio engine...');

    try {
      const ext = file.name.split('.').pop() || 'bin';
      const inName = `input.${ext}`;
      const targetFmt = AUDIO_FORMATS.find((f) => f.id === format) || AUDIO_FORMATS[0];
      const outName = `output.${targetFmt.ext}`;

      const args = ['-i', inName, '-vn'];
      if (format === 'mp3') args.push('-c:a', 'libmp3lame', '-b:a', `${bitrate}k`);
      else if (format === 'wav') args.push('-c:a', 'pcm_s16le');
      else if (format === 'ogg') args.push('-c:a', 'libvorbis', '-q:a', '4');
      else if (format === 'opus') args.push('-c:a', 'libopus', '-b:a', `${bitrate}k`);
      else if (format === 'flac') args.push('-c:a', 'flac');
      else if (format === 'm4a') args.push('-c:a', 'aac', '-b:a', `${bitrate}k`);
      args.push('-y', outName);

      const buffer = await file.arrayBuffer();
      const inputData = new Uint8Array(buffer);

      setStatusMsg('Transcoding audio locally in browser...');

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
      setStatusMsg(`✓ Transcoded to .${targetFmt.ext} (${formatFileSize(blob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Audio conversion error: ${err.message}`);
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
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files?.[0]) handleSelectFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
          }`}
        >
          <Music className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop Audio or Video File Here</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert between MP3, WAV, OGG, Opus, FLAC, and M4A directly in your browser with zero server uploads.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Select Audio File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
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
                Change Audio
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
                  {AUDIO_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {['mp3', 'opus', 'm4a'].includes(format) && (
                <div>
                  <label className="text-slate-400 block mb-1">Audio Bitrate</label>
                  <select
                    value={bitrate}
                    onChange={(e) => setBitrate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="96">96 kbps (Voice / Compact)</option>
                    <option value="128">128 kbps (Standard Quality)</option>
                    <option value="160">160 kbps (Good Quality)</option>
                    <option value="192">192 kbps (High Quality)</option>
                    <option value="256">256 kbps (Very High)</option>
                    <option value="320">320 kbps (Maximum MP3)</option>
                  </select>
                </div>
              )}
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
                <Music className="w-4 h-4" />
                {status === 'converting' ? 'Transcoding Audio...' : 'Convert Audio'}
              </button>
            </div>
          </div>

          {resultBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Converted Preview ({format.toUpperCase()} · {formatFileSize(resultSize)})
                </span>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Audio
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
