import React from 'react';
export default class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main role="alert" style={{ padding: '3rem', textAlign: 'center' }}><h1>This page could not load</h1><p>Please reload the page. If it continues, contact support.</p><button type="button" onClick={() => window.location.reload()}>Reload page</button></main>;
    return this.props.children;
  }
}
