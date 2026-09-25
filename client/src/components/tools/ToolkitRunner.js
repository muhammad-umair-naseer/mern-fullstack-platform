import React, { useEffect, useRef, useState } from 'react';
import './ToolkitRunner.css';

/**
 * Universal runner for client-side zero-dependency toolkit tools.
 * Loads the pure ES module dynamically and mounts it into the DOM.
 */
export default function ToolkitRunner({ slug, toolName }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    // Dynamically import the engine module from the public toolkit folder
    const modulePath = `/toolkit/src/tools/${slug}.js`;

    import(/* webpackIgnore: true */ modulePath)
      .then((m) => {
        if (!alive || !containerRef.current) return;
        containerRef.current.replaceChildren();

        const mountFn = m.mount || m.default;
        if (typeof mountFn === 'function') {
          mountFn(containerRef.current, { tool: { slug, name: toolName } });
        } else {
          throw new Error(`Module for "${slug}" does not export a mount function.`);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error mounting toolkit module [${slug}]:`, err);
        if (alive) {
          setError(err.message || 'Failed to initialize tool engine in browser.');
          setLoading(false);
        }
      });

    return () => {
      alive = false;
      if (containerRef.current) {
        containerRef.current.replaceChildren();
      }
    };
  }, [slug, toolName]);

  return (
    <div className="toolkit-runner-card bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Privacy & Engine status banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-800 font-semibold">100% Client-Side Engine</span>
          <span className="text-slate-400">·</span>
          <span>Zero Server Uploads</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span>Memory-Safe Sandbox</span>
          <span className="text-slate-400">·</span>
          <span>Instant Local Processing</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
            <p className="text-slate-600 font-medium">Initializing client-side {toolName || 'tool'} engine…</p>
            <p className="text-xs text-slate-400 mt-1">Allocating local memory and loading WebCodecs / WebAssembly...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center my-6">
            <div className="text-red-600 text-3xl mb-2">⚠️</div>
            <h4 className="text-base font-bold text-red-800">Engine Initialization Note</h4>
            <p className="text-sm text-red-700 mt-1 max-w-lg mx-auto">{error}</p>
            <p className="text-xs text-red-600/80 mt-2">
              If this tool relies on newer WebCodecs or browser APIs, ensure you are using an updated version of Chrome, Edge, Safari, or Firefox.
            </p>
          </div>
        )}

        <div
          ref={containerRef}
          id="tool-root"
          className="toolkit-runner"
          style={{ display: loading || error ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}
