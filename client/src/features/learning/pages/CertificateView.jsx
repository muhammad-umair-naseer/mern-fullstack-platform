import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Check, Download, Link2 } from 'lucide-react';
import { api } from '../../../lib/api.js';
import Seo from '../../../seo/Seo.jsx';
import CertificateFrame, {
  DiamondRule,
  Flourish,
  OrnamentRule,
  RibbonShape,
} from '../components/CertificateFrame.jsx';
import '../components/Certificate.css';

// Who signs the certificates. Change here rather than in the markup below.
const SIGNATORY = {
  name: 'Hafsa Farheen',
  title: 'Human Resources',
  company: 'Cortexis Solution Hub (Pvt.) Ltd.',
};

// The sheet is laid out at A4 landscape, 96dpi, and scaled as one piece.
const SHEET_WIDTH = 1123;

// The recipient's name is set large, then shrunk to fit this width.
const NAME_MAX_WIDTH = 760;

// Body copy starts at this size and steps down only if a long course title
// would push the paragraphs into the stamp and QR row.
const COPY_SIZE = 18.9;
const COPY_MIN = 14.5;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Public page — the whole point of the code is that anyone can check it
// without an account, so this route sits outside RequireAuth.
const CertificateView = () => {
  const { code } = useParams();
  const [cert, setCert] = useState(null);
  const [status, setStatus] = useState('loading');
  // Optional brand assets — the certificate still renders correctly without them.
  const [hasSecp, setHasSecp] = useState(true);
  const [hasSignature, setHasSignature] = useState(true);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);

  const scalerRef = useRef(null);
  const copiedTimer = useRef(null);
  const nameRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api(`/learn/certificate/${code}`, { auth: false });
        if (!cancelled) {
          setCert(data);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  // Scale the fixed-size sheet to the width it has, so the preview on a phone
  // is the same sheet that prints.
  useLayoutEffect(() => {
    const el = scalerRef.current;
    if (!el) return undefined;
    const update = () => setScale(Math.min(1, el.clientWidth / SHEET_WIDTH));
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [status]);

  // Fit the name and the body copy once the fonts that set their width load.
  // offsetWidth and clientHeight are layout sizes, so the preview scale
  // doesn't affect the measurement.
  useLayoutEffect(() => {
    if (!cert) return undefined;
    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      const name = nameRef.current;
      if (name) {
        name.style.fontSize = '';
        const width = name.offsetWidth;
        if (width > NAME_MAX_WIDTH) {
          const base = parseFloat(getComputedStyle(name).fontSize);
          name.style.fontSize = `${Math.floor((base * NAME_MAX_WIDTH) / width)}px`;
        }
      }

      const copy = copyRef.current;
      if (copy) {
        let size = COPY_SIZE;
        copy.style.setProperty('--cxc-copy', `${size}px`);
        while (copy.scrollHeight > copy.clientHeight + 1 && size > COPY_MIN) {
          size -= 0.5;
          copy.style.setProperty('--cxc-copy', `${size}px`);
        }
      }
    };

    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return () => {
      cancelled = true;
    };
  }, [cert]);

  // Certificates are personal pages: shareable by link, kept out of search.
  const seo = (
    <Seo
      title={`Certificate ${code}`}
      description="Check a Cortexis course certificate by its code."
      path={`/certificate/${code}`}
      noindex
    />
  );

  if (status === 'loading') {
    return (
      <div className="lx-route-loading" role="status" aria-label="Loading certificate">
        {seo}
        <span />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="cxc-missing">
        {seo}
        <p className="lx-label">Certificate</p>
        <h1 className="cxc-missing-title">
          No certificate <em>with that code.</em>
        </h1>
        <p className="cxc-missing-lede">
          Codes look like <span className="font-mono">CTX-XXXX-XXXXXX</span>.
        </p>
        <Link to="/courses" className="lx-link">
          Browse courses <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </main>
    );
  }

  // Absolute URL so the QR works when scanned from a printed sheet.
  const verifyUrl = `${window.location.origin}/certificate/${cert.code}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked: the address bar still has the link */
    }
  };

  return (
    <main className="cxc-page">
      {seo}
      <div className="cxc-bar print:hidden">
        <p className="cxc-verified">
          <svg className="cxc-verified-mark" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="10" />
            <path d="M6.6 11.4 L9.6 14.3 L15.6 8.1" />
          </svg>
          Verified certificate
        </p>
        <div className="cxc-actions">
          <button type="button" onClick={copyLink} className="btn lx-btn-ghost" aria-live="polite">
            {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <button type="button" onClick={() => window.print()} className="btn lx-btn">
            Print / Save as PDF
            <span className="lx-btn-disc" aria-hidden="true">
              <Download size={15} />
            </span>
          </button>
        </div>
      </div>

      {/* Fixed 1123x794 (A4 landscape at 96dpi) scaled down to fit narrow
          screens, so the printed sheet and the on-screen preview are identical. */}
      <div className="cxc-scaler" ref={scalerRef} style={{ '--cxc-scale': scale }}>
        <article className="cxc-sheet">
          <CertificateFrame />

          <img
            src={`${process.env.PUBLIC_URL}/cortexis-logo.png`}
            alt="Cortexis Solution Hub Pvt Ltd"
            className="cxc-logo"
          />
          {hasSecp && (
            <img
              src={`${process.env.PUBLIC_URL}/secp-logo.png`}
              alt="Securities and Exchange Commission of Pakistan"
              className="cxc-secp"
              onError={() => setHasSecp(false)}
            />
          )}

          <h1 className="cxc-title">Certificate</h1>
          <div className="cxc-subtitle">
            <Flourish />
            <p>OF COMPLETION</p>
            <Flourish flip />
          </div>
          <p className="cxc-id">
            CERTIFICATE ID:{' '}
            <span>{cert.code}</span>
          </p>

          <div className="cxc-ribbon">
            <RibbonShape className="cxc-ribbon-shape" />
            <span>PROUDLY PRESENTED TO</span>
          </div>

          <p className="cxc-name">
            <span ref={nameRef}>{cert.learnerName}</span>
          </p>
          <DiamondRule className="cxc-name-rule" />

          <div className="cxc-copy" ref={copyRef}>
            <p className="cxc-body">
              has successfully completed the{' '}
              <strong>{cert.courseTitle}</strong> course and
              passed the final examination with a score of{' '}
              <strong>{cert.score}%</strong>.
            </p>
            <OrnamentRule className="cxc-copy-rule" />
            <p className="cxc-note">
              Recognized for consistent dedication and a strong command of the subject.
              Wishing them continued success in their future career.
            </p>
          </div>

          {/* marginSize supplies the quiet zone a scanner needs to find the code */}
          <div className="cxc-qr">
            <QRCodeSVG
              value={verifyUrl}
              size={94}
              level="M"
              marginSize={4}
              fgColor="#0b1a33"
              bgColor="#ffffff"
            />
          </div>

          <img
            src={`${process.env.PUBLIC_URL}/stamp.png`}
            alt="Cortexis Solution Hub Pvt Ltd official seal"
            className="cxc-stamp"
          />

          <div className="cxc-signatory">
            <div className="cxc-signature">
              {hasSignature ? (
                <img
                  src={`${process.env.PUBLIC_URL}/signature-hafsa.png`}
                  alt={`Signature of ${SIGNATORY.name}`}
                  onError={() => setHasSignature(false)}
                />
              ) : (
                <p className="cxc-sign-fallback">{SIGNATORY.name}</p>
              )}
            </div>
            <p className="cxc-sign-name">{SIGNATORY.name}</p>
            <p className="cxc-sign-title">{SIGNATORY.title}</p>
            <p className="cxc-sign-company">{SIGNATORY.company}</p>
          </div>

          <p className="cxc-footer">
            Issued {formatDate(cert.issuedAt)} · Verify at {verifyUrl}
          </p>
        </article>
      </div>

      <p className="cxc-hint print:hidden">Anyone can scan the QR code to verify it.</p>
    </main>
  );
};

export default CertificateView;
