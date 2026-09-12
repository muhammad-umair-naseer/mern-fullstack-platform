import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Image as ImageIcon, Download, Sparkles, AlertCircle, Check } from 'lucide-react';
import { runFFmpegJob } from '../../lib/ffmpegEngine';
import { validateAudioFile, validateImageFile, formatFileSize } from '../../lib/fileValidation';

export default function Mp3ToMp4() {
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [resolution, setResolution] = useState('1280x720'); // '1280x720' | '1920x1080' | '1080x1080'
  const [bgColor, setBgColor] = useState('#0f172a');
  const [status, setStatus] = useState('idle'); // 'idle' | 'converting' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [resultBlobUrl, setResultBlobUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);

  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const coverUrlRef = useRef('');
  const resultUrlRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (coverUrlRef.current) {
      URL.revokeObjectURL(coverUrlRef.current);
      coverUrlRef.current = '';
    }
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setCoverPreview('');
    setResultBlobUrl('');
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleAudioSelect = async (f) => {
    if (!f) return;
    setStatus('idle');
    setStatusMsg('');
    const val = await validateAudioFile(f);
    if (!val.valid) {
      setStatus('error');
      setStatusMsg(val.error);
      return;
    }
    setAudioFile(f);
  };

  const handleCoverSelect = async (f) => {
    if (!f) return;
    const val = await validateImageFile(f);
    if (!val.valid) {
      setStatus('error');
      setStatusMsg(val.error);
      return;
    }
    if (coverUrlRef.current) URL.revokeObjectURL(coverUrlRef.current);
    const url = URL.createObjectURL(f);
    coverUrlRef.current = url;
    setCoverPreview(url);
    setCoverFile(f);
  };

  const handleConvert = async () => {
    if (!audioFile) return;
    setStatus('converting');
    setProgress(0);
    setStatusMsg('Initializing video renderer...');

    try {
      const [widthStr, heightStr] = resolution.split('x');
      const W = parseInt(widthStr, 10);
      const H = parseInt(heightStr, 10);

      const audioExt = audioFile.name.split('.').pop() || 'mp3';
      const inAudio = `input.${audioExt}`;
      const outName = 'output.mp4';
      const inputs = [];

      const audioBuffer = await audioFile.arrayBuffer();
      inputs.push({ name: inAudio, data: new Uint8Array(audioBuffer) });

      let args = [];
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop() || 'png';
        const inCover = `cover.${coverExt}`;
        const coverBuffer = await coverFile.arrayBuffer();
        inputs.push({ name: inCover, data: new Uint8Array(coverBuffer) });

        const fitPad = `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2`;
        args = [
          '-loop', '1',
          '-i', inCover,
          '-i', inAudio,
          '-vf', fitPad,
          '-c:v', 'libx264',
          '-tune', 'stillimage',
          '-preset', 'veryfast',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-shortest',
          '-movflags', '+faststart',
          '-y', outName,
        ];
      } else {
        // Solid color background video
        const cleanColor = bgColor.replace('#', '0x');
        args = [
          '-f', 'lavfi',
          '-i', `color=c=${cleanColor}:s=${W}x${H}:r=25`,
          '-i', inAudio,
          '-c:v', 'libx264',
          '-tune', 'stillimage',
          '-preset', 'veryfast',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-shortest',
          '-movflags', '+faststart',
          '-y', outName,
        ];
      }

      setStatusMsg('Rendering MP4 video in browser...');

      const outputData = await runFFmpegJob({
        inputs,
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
      setStatus('ready');
      setStatusMsg(`✓ Video ready: output.mp4 (${formatFileSize(blob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Rendering error: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !audioFile) return;
    const baseName = audioFile.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${baseName}_video.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Audio upload box */}
        <div
          onClick={() => audioInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-6 text-center cursor-pointer transition flex flex-col justify-center items-center"
        >
          <Music className="w-10 h-10 text-orange-400 mb-2 animate-pulse" />
          <h4 className="text-sm font-bold text-slate-100">
            {audioFile ? audioFile.name : '1. Choose Audio Track (MP3/WAV)'}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            {audioFile ? formatFileSize(audioFile.size) : 'Click or drop audio file'}
          </p>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => e.target.files?.[0] && handleAudioSelect(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Cover image upload box */}
        <div
          onClick={() => coverInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-6 text-center cursor-pointer transition flex flex-col justify-center items-center relative overflow-hidden"
        >
          {coverPreview ? (
            <div className="flex items-center gap-3">
              <img src={coverPreview} alt="Cover Preview" className="w-16 h-16 rounded-xl object-cover" />
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-100">{coverFile?.name}</h4>
                <p className="text-xs text-emerald-400">Custom cover image loaded</p>
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-emerald-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-100">2. Optional Cover Image</h4>
              <p className="text-xs text-slate-400 mt-1">JPG or PNG (Defaults to dark background)</p>
            </>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleCoverSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>

      {audioFile && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video Settings</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Resolution & Aspect Ratio</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="1280x720">720p HD (1280 × 720, 16:9)</option>
                  <option value="1920x1080">1080p Full HD (1920 × 1080, 16:9)</option>
                  <option value="1080x1080">Square 1:1 (1080 × 1080, Instagram)</option>
                </select>
              </div>

              {!coverFile && (
                <div>
                  <label className="text-slate-400 block mb-1">Solid Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                    />
                  </div>
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

            <button
              onClick={handleConvert}
              disabled={status === 'converting'}
              className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {status === 'converting' ? 'Rendering MP4 Video...' : 'Convert Audio to MP4 Video'}
            </button>
          </div>

          {resultBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rendered MP4 Preview ({formatFileSize(resultSize)})
                </span>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download MP4 Video
                </button>
              </div>
              <video controls src={resultBlobUrl} className="w-full rounded-2xl bg-black max-h-80 mx-auto" />
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
