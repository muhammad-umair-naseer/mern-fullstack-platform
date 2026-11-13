import ErrorBoundary from './components/ErrorBoundary';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './fonts/fonts.css';
import './index.css';
import App from './App';

import startIdleMotion from './lib/idleMotion';
import startScrollRefresh from './lib/scrollRefresh';
// Listens for the visitor's first input from the start (the hero reel waits for it).
import './lib/firstInput';

// Remove prerendered SEO nodes before React takes ownership of the head.
document.querySelectorAll('head [data-cx-seo]').forEach(node => node.remove());
const tree = (
  <React.StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </React.StrictMode>
);
const container = document.getElementById('root');

if (navigator.webdriver) {
  // The prerender (scripts/prerender.mjs) saves React's own render of each
  // page, so visitors can hydrate it. react-dom/server is its own chunk,
  // loaded only here, never by a visitor.
  window.__cxRenderToString = () => import('react-dom/server').then(({ renderToString }) => renderToString(tree));
  ReactDOM.createRoot(container).render(tree);
} else if (container.firstElementChild) {
  // A prerendered page: reuse its HTML instead of drawing it again. Where the
  // markup cannot be reused, React falls back to drawing that part itself.
  ReactDOM.hydrateRoot(container, tree, {
    onRecoverableError: (error, info) => console.warn('[hydrate]', error?.message || error, info?.componentStack || ''),
  });
} else {
  ReactDOM.createRoot(container).render(tree);
}

// Endless decorative loops pause while nobody is using the page (lib/idleMotion.js).
startIdleMotion();
// Re-measure scroll triggers when a content-visibility section renders (phones).
startScrollRefresh();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
