import React from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';
import './PrivacyComparisonTable.css';

/**
 * Privacy Comparison Table Component
 * High Information Gain Matrix for Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).
 * AI search engines (Perplexity, ChatGPT Search) prioritize factual tabular comparisons over prose.
 */
const PrivacyComparisonTable = ({ toolName }) => {
  const currentTool = toolName || 'Cortexis Web Tools';

  return (
    <section className="cx-privacy-matrix" aria-label="Architecture and Privacy Comparison">
      <div className="cx-matrix-header">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-600" />
          <h3 className="cx-matrix-title">How Cortexis Protects Your Files vs Cloud Alternatives</h3>
        </div>
        <span className="cx-matrix-badge">Zero-Knowledge Architecture</span>
      </div>

      <p className="cx-matrix-desc">
        Most online file converters upload your sensitive documents to remote cloud servers. Cortexis uses WebAssembly and modern browser APIs to process everything directly inside your computer's RAM.
      </p>

      <div className="cx-table-wrap">
        <table className="cx-table">
          <thead>
            <tr>
              <th scope="col" className="cx-th-feature">Architecture & Privacy Feature</th>
              <th scope="col" className="cx-th-cortexis">{currentTool}</th>
              <th scope="col" className="cx-th-other">Conventional Cloud Services</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cx-td-feature">
                <strong>File Upload to Remote Servers</strong>
                <span>Where does your document get processed?</span>
              </td>
              <td className="cx-td-cortexis">
                <span className="cx-badge-good"><Check size={14} /> Zero (100% Client-Side)</span>
              </td>
              <td className="cx-td-other">
                <span className="cx-badge-bad"><X size={14} /> Uploaded to remote third-party cloud</span>
              </td>
            </tr>

            <tr>
              <td className="cx-td-feature">
                <strong>Data Retention & Cloud Logging</strong>
                <span>Are copies stored or cached on disk?</span>
              </td>
              <td className="cx-td-cortexis">
                <span className="cx-badge-good"><Check size={14} /> None (Flushed on tab close)</span>
              </td>
              <td className="cx-td-other">
                <span className="cx-badge-bad"><X size={14} /> Stored on servers (1–24 hours)</span>
              </td>
            </tr>

            <tr>
              <td className="cx-td-feature">
                <strong>Confidential Documents Safety</strong>
                <span>Bank statements, CNICs, medical & legal files</span>
              </td>
              <td className="cx-td-cortexis">
                <span className="cx-badge-good"><Check size={14} /> 100% Safe (Files never transmit)</span>
              </td>
              <td className="cx-td-other">
                <span className="cx-badge-bad"><X size={14} /> Transmitted over public web</span>
              </td>
            </tr>

            <tr>
              <td className="cx-td-feature">
                <strong>Processing Latency</strong>
                <span>Upload and download time</span>
              </td>
              <td className="cx-td-cortexis">
                <span className="cx-badge-good"><Check size={14} /> Instant (No bandwidth lag)</span>
              </td>
              <td className="cx-td-other">
                <span className="cx-badge-bad"><X size={14} /> Dependent on upload speed</span>
              </td>
            </tr>

            <tr>
              <td className="cx-td-feature">
                <strong>Watermarks & Daily Caps</strong>
                <span>Usage limits and branding overlays</span>
              </td>
              <td className="cx-td-cortexis">
                <span className="cx-badge-good"><Check size={14} /> Unlimited & 100% Watermark-Free</span>
              </td>
              <td className="cx-td-other">
                <span className="cx-badge-bad"><X size={14} /> Daily quotas or paid tiers</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PrivacyComparisonTable;
