import React from 'react';
import './PrivacyComparisonTable.css';
const remote = new Set(['website-png-screenshot', 'website-jpg-screenshot', 'save-web-as-pdf']);
export default function PrivacyComparisonTable({ toolName, slug }) {
  const capture = remote.has(slug);
  return <section className="cx-privacy-matrix" aria-label="Processing and privacy">
    <h3 className="cx-matrix-title">Processing and privacy: {toolName}</h3>
    <p className="cx-matrix-desc">{capture
      ? 'URL capture sends the address to an external capture provider (Thum.io or Microlink). That provider retrieves the page and may retain results under its own policy. Never submit private, signed or login-only URLs. Pasted HTML/text is processed locally.'
      : 'File processing runs in your browser. Your selected file is not uploaded by this tool. The website still receives ordinary page and asset requests. Keep your browser updated and review the output before sharing it.'}</p>
    <p className="cx-matrix-desc">File sizes and processing time depend on the tool and your device. Safety limits may apply; unlimited file sizes and instant completion are not guaranteed.</p>
    {capture && <p><a href="https://microlink.io/privacy" target="_blank" rel="noopener noreferrer">Microlink privacy</a> · <a href="https://www.thum.io/privacy-policy/" target="_blank" rel="noopener noreferrer">Thum.io privacy</a></p>}
  </section>;
}
