import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../lib/api';
import CertificateFrame from '../learn/CertificateFrame';

// Who signs the certificates. Change here rather than in the markup below.
const SIGNATORY = {
  name: 'Hafsa Farheen',
  title: 'Human Resources',
  company: 'Cortexis Solution Hub (Pvt.) Ltd.',
};

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

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No certificate with that code</h1>
        <p className="mt-3 text-slate-600">
          Check the code and try again. It looks like{' '}
          <span className="font-mono">CTX-XXXX-XXXXXX</span>.
        </p>
        <Link to="/courses" className="mt-6 inline-block text-indigo-400 hover:underline">
          Browse courses
        </Link>
      </main>
    );
  }

  // Absolute URL so the QR works when scanned from a printed sheet.
  const verifyUrl = `${window.location.origin}/certificate/${cert.code}`;

  return (
    <main className="cx-certificate max-w-[1180px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
        <p className="inline-flex items-center gap-2 text-emerald-300 text-sm font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Verified certificate
        </p>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Fixed 1123x794 (A4 landscape at 96dpi) scaled down to fit narrow
          screens, so the printed sheet and the on-screen preview are identical. */}
      <div className="cx-cert-scaler">
        <article className="cx-cert-sheet">
          <CertificateFrame />

          <div className="relative h-full flex flex-col px-[62px] py-[40px]">
            {/* header — logo left, title centred clear of the corner swoosh */}
            <div className="relative">
              <div className="absolute left-0 top-0 flex items-center gap-4">
                <img
                  src={`${process.env.PUBLIC_URL}/cortexis-logo.png`}
                  alt="Cortexis Solution Hub Pvt Ltd"
                  className="h-[96px] w-auto"
                />
                {hasSecp && (
                  <img
                    src={`${process.env.PUBLIC_URL}/secp-logo.png`}
                    alt="Securities and Exchange Commission of Pakistan"
                    className="h-[92px] w-auto"
                    onError={() => setHasSecp(false)}
                  />
                )}
              </div>
              <div className="pr-[178px] pl-[168px] text-center pt-[16px]">
                <div className="inline-block">
                  <h1 className="cx-cert-script text-[82px] leading-[1.12] text-[#101f38]">
                    Certificate
                  </h1>
                  {/* pr offsets the trailing swash so the sub-line aligns with
                      the final letter rather than the glyph box edge */}
                  <p className="-mt-[10px] pr-[16px] text-right text-[16px] font-normal tracking-[0.32em] text-[#c8922e]">
                    OF COMPLETION
                  </p>
                </div>
              </div>
            </div>

            {/* id + presented-to banner */}
            <div className="mt-7 relative flex justify-center">
              <p className="absolute left-0 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold tracking-[0.06em] text-[#1273a8] whitespace-nowrap">
                CERTIFICATE ID:{' '}
                <span className="font-mono text-[#12233f]">{cert.code}</span>
              </p>
              <span className="cx-cert-ribbon text-white text-[13px] font-medium tracking-[0.22em] px-11 py-2">
                PROUDLY PRESENTED TO
              </span>
            </div>

            {/* recipient */}
            <div className="mt-5 text-center pl-[60px] pr-[60px]">
              <p className="cx-cert-name text-[64px] leading-[1.06] text-[#7d431c]">
                {cert.learnerName}
              </p>
              <div className="mx-auto mt-1.5 h-px w-[60%] bg-[#c8922e]/80" />
            </div>

            {/* body */}
            <div className="mt-6 text-center px-[130px]">
              <p className="text-[15.5px] leading-[1.8] text-[#26364f]">
                has successfully completed the{' '}
                <span className="font-bold text-[#12233f]">{cert.courseTitle}</span> course and
                passed the final examination with a score of{' '}
                <span className="font-bold text-[#12233f]">{cert.score}%</span>.
              </p>
              <p className="mt-3 text-[14px] leading-[1.75] text-[#3d4d66]">
                Recognized for consistent dedication and a strong command of the subject.
                Wishing them continued success in their future career.
              </p>
            </div>

            <div className="mt-auto flex items-end justify-end gap-[46px] pr-[10px]">
              {/* marginSize supplies the quiet zone a scanner needs to find the code */}
              <div className="pb-3">
                <div className="cx-cert-qr">
                  <QRCodeSVG
                    value={verifyUrl}
                    size={88}
                    level="M"
                    marginSize={4}
                    fgColor="#101f38"
                    bgColor="#ffffff"
                  />
                </div>
              </div>

              <div className="pb-2">
                <img
                  src={`${process.env.PUBLIC_URL}/stamp.png`}
                  alt="Cortexis Solution Hub Pvt Ltd official seal"
                  className="h-[112px] w-auto"
                />
              </div>

              <div className="text-center min-w-[224px] pb-1">
                {hasSignature ? (
                  <img
                    src={`${process.env.PUBLIC_URL}/signature-hafsa.png`}
                    alt={`Signature of ${SIGNATORY.name}`}
                    className="h-[82px] w-auto mx-auto object-contain -mb-1"
                    onError={() => setHasSignature(false)}
                  />
                ) : (
                  <p className="cx-cert-sign text-[34px] leading-none text-[#12233f]">
                    {SIGNATORY.name}
                  </p>
                )}
                <div className="mt-1.5 h-px w-full bg-[#12233f]/70" />
                <p className="mt-1.5 text-[13px] leading-[1.25] font-bold tracking-wide text-[#12233f]">
                  {SIGNATORY.name}
                </p>
                <p className="text-[11.5px] leading-[1.25] text-[#3d4d66]">{SIGNATORY.title}</p>
                <p className="text-[11.5px] leading-[1.25] font-bold text-[#0d6ea8]">
                  {SIGNATORY.company}
                </p>
              </div>
            </div>

            <p className="mt-2.5 text-center text-[9.5px] tracking-wide text-[#6b7b93] pl-[380px]">
              Issued {formatDate(cert.issuedAt)} · Verify at {verifyUrl}
            </p>
          </div>
        </article>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500 print:hidden">
        Anyone can verify this certificate by scanning the QR code or visiting{' '}
        <span className="font-mono">/certificate/{cert.code}</span>
      </p>
    </main>
  );
};

export default CertificateView;
