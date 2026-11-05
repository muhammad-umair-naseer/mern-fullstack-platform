import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../../seo/Seo.jsx';
export default function NotFound() {
  return <main style={{ padding: '5rem 1.5rem', textAlign: 'center' }}><Seo title="Page not found" noindex /><h1>Page not found</h1><p>The address may have changed. Choose a section from the menu or return home.</p><Link to="/">Return home</Link></main>;
}
