import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Seo from '../seo/Seo';

const GAME_CONFIG = {
  'gotcha-rush': {
    title: 'Gotcha Rush',
    port: 3001,
    tagline: 'Real-Time Code Prediction Quiz & Battle Arena',
    color: '#f97316',
  },
  typedash: {
    title: 'TypeDash',
    port: 4001,
    tagline: 'Real-Time Multiplayer Typing Sprint & Ghost Races',
    color: '#0284c7',
  },
};

export default function GameFrame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const config = GAME_CONFIG[gameId];

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [gameId]);

  if (!config) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Game Not Found</h2>
        <p className="text-slate-600 mb-6">The requested game does not exist.</p>
        <Link
          to="/games"
          className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
        >
          Return to Playground
        </Link>
      </div>
    );
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const gameUrl = `http://${hostname}:${config.port}`;

  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoaded(false);
      iframeRef.current.src = gameUrl;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col" ref={containerRef}>
      <Seo
        title={`${config.title} | Cortexis Playground`}
        description={config.tagline}
        path={`/games/${gameId}`}
      />

      {/* Top Controller Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            title="Back to games catalog"
          >
            <span>←</span>
            <span className="hidden sm:inline">Playground</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div>
            <h1 className="text-sm font-bold flex items-center gap-2">
              <span>{config.title}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden md:block">{config.tagline}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
            :{config.port}
          </span>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Reload game session"
          >
            ↻ Reload
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '⤢ Minimize' : '⤡ Fullscreen'}
          </button>

          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
          >
            <span>Open Tab</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Embedded Game Iframe */}
      <div className="relative flex-1 w-full h-[calc(100vh-50px)] bg-black overflow-hidden">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 z-10">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Connecting to {config.title} on port {config.port}...</p>
            <p className="text-xs text-slate-500 mt-1">
              Ensure Docker Compose is running: <code className="text-emerald-400">docker compose up</code>
            </p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={gameUrl}
          title={config.title}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; clipboard-read; clipboard-write; microphone"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  );
}
