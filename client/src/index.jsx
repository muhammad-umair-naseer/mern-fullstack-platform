import ErrorBoundary from './components/ErrorBoundary';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import startIdleMotion from './lib/idleMotion';

// Remove prerendered SEO nodes before React takes ownership of the head.
document.querySelectorAll('head [data-cx-seo]').forEach(node => node.remove());
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </React.StrictMode>
);

// Endless decorative loops pause while nobody is using the page (lib/idleMotion.js).
startIdleMotion();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
