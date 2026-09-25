import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import { useGridReveal } from '../hooks/useGridReveal';

const GAMES = [
  {
    id: 'gotcha-rush',
    title: 'Gotcha Rush',
    category: 'Real-Time Code Quiz',
    badge: 'Multiplayer Arena',
    port: 3001,
    accent: '#f97316',
    gradient: 'from-orange-500 to-amber-600',
    description:
      'Predict the exact output of tricky JavaScript and Python snippets under countdown pressure. Features real-time multiplayer lobbies, combo multipliers, 50-50 lifelines, Solo Rush practice mode, and global leaderboards.',
    tech: ['WebSockets', 'JavaScript Engine', 'Python Snippets', 'Live Scoreboard'],
    features: [
      'Multiplayer real-time head-to-head match rooms',
      'Curated bank of tricky edge cases & outputs',
      'Streak bonuses, combo multipliers & lifelines',
      'Instant explanations & verified sandbox runs',
    ],
    buttonText: 'Play Gotcha Rush',
  },
  {
    id: 'typedash',
    title: 'TypeDash',
    category: 'Multiplayer Typing Race',
    badge: 'High Velocity',
    port: 4001,
    accent: '#0284c7',
    gradient: 'from-sky-500 to-indigo-600',
    description:
      'Real-time typing sprint races with live peer positions, ghost replays of previous champions, daily sprint passages, WPM & accuracy telemetry, seasons, and multi-language code/prose catalogs.',
    tech: ['WebSockets', '7+ Languages', 'Ghost Replays', 'Daily Challenge'],
    features: [
      'Live multiplayer race tracks with smooth car avatars',
      'Race against ghost replays of record holders',
      'Programming syntax + multi-lingual passage catalogue',
      'Leaderboards, custom team rooms, and season tiers',
    ],
    buttonText: 'Play TypeDash',
  },
];

export default function Games() {
  const introRef = useIntroTimeline();
  const gridRef = useGridReveal();

  const getDirectUrl = (port) => {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${host}:${port}`;
  };

  return (
    <main className="text-slate-800 pb-20">
      <Seo
        title="Playground & Multiplayer Games | Cortexis Solution Hub"
        description="Experience real-time multiplayer coding challenges and typing races. Play Gotcha Rush and TypeDash directly in your browser with zero local setup."
        path="/games"
      />

      {/* Hero Header */}
      <header className="relative isolate overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-6">
        <div
          ref={introRef}
          className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center"
        >
          <span
            data-intro
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            CORTEXIS PLAYGROUND · MULTIPLAYER ARENA
          </span>
          <h1
            data-intro
            className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight"
          >
            Level Up Your Speed & Logic with Real-Time Games
          </h1>
          <p
            data-intro
            className="mt-5 text-lg md:text-xl text-slate-300 max-w-2xl font-light"
          >
            Challenge fellow learners and developers in real-time battles. Powered by high-frequency
            WebSockets, containerized with Docker, and accessible instantly with zero setup.
          </p>

          <div data-intro className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="#game-cards"
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5"
            >
              Browse Games Below ↓
            </a>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-sm text-slate-200">
              <span className="font-mono text-emerald-400 font-bold">docker compose up --build</span>
            </div>
          </div>
        </div>
      </header>

      {/* Games Catalogue Grid */}
      <section id="game-cards" className="max-w-7xl mx-auto px-6 py-16" ref={gridRef}>
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-extrabold text-orange-600 bg-orange-100/60 px-3 py-1 rounded-full border border-orange-200">
            Interactive Runtimes
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
            Choose Your Arena
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">
            Play directly embedded within the Cortexis platform or open a standalone dedicated tab.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {GAMES.map((game) => {
            const standaloneUrl = getDirectUrl(game.port);
            return (
              <div
                key={game.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Header Banner */}
                <div className={`p-6 sm:p-8 bg-gradient-to-r ${game.gradient} text-white`}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-black/25 backdrop-blur border border-white/20">
                      {game.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                      Port :{game.port}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{game.title}</h3>
                  <p className="mt-2 text-white/90 text-sm leading-relaxed">{game.description}</p>
                </div>

                {/* Features & Specs */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-slate-50/50">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Core Gameplay Highlights
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {game.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {game.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-200/70 text-slate-700 text-xs font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/games/${game.id}`}
                      className="flex-1 py-3 px-4 rounded-xl text-center font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>🎮</span>
                      <span>Play in Platform</span>
                    </Link>
                    <a
                      href={standaloneUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl text-center font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                      title={`Open on ${standaloneUrl}`}
                    >
                      <span>Direct Tab</span>
                      <span className="text-xs">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Multiplayer & Docker Info Section */}
      <section className="max-w-5xl mx-auto px-6 mt-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 md:p-10 shadow-2xl border border-slate-800">
          <div className="grid md:grid-cols-[1.2fr_.8fr] gap-8 items-center">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                Zero Configuration Architecture
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold mt-3">
                How It Works in Docker
              </h3>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Both games are packaged as self-contained microservices running Node.js and
                WebSockets with dedicated persistent data volumes. Friends can run all services with a
                single command — no Node.js or local package installation required.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-slate-400">Gotcha Rush</div>
                  <div className="text-orange-400 font-bold text-sm mt-0.5">localhost:3001</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-slate-400">TypeDash</div>
                  <div className="text-sky-400 font-bold text-sm mt-0.5">localhost:4001</div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-5 border border-white/10">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">
                Quick Start Command
              </div>
              <pre className="text-xs font-mono text-emerald-400 bg-black/60 p-3.5 rounded-xl overflow-x-auto border border-emerald-500/20">
                <code># Clone and start full stack{'\n'}git clone https://github.com/abdullah5654/cortexis-website.git{'\n'}cd cortexis-website{'\n'}docker compose up --build</code>
              </pre>
              <p className="text-xs text-slate-400 mt-3">
                Includes Postgres, Redis, Cortexis Platform, Gotcha Rush, and TypeDash!
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
