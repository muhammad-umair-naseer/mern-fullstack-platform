import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api';
import Quiz from '../learn/Quiz';
import LearnHero from '../learn/LearnHero';
import { learnPhotos } from '../learn/photos';
import '../learn/Learn.css';

const FinalExam = () => {
  const { slug } = useParams();
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState(0);
  const [certificate, setCertificate] = useState(null);
  // The block holding the certificate panel and the quiz, brought into view
  // when a result lands so a pass shows the panel and the score together.
  const examRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api(`/learn/final/${slug}`);
        if (!cancelled) {
          setPayload(data);
          setStatus('ready');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setErrorStatus(err.status || 0);
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const submit = async (answers) => {
    const { data } = await api(`/learn/final/${slug}`, { method: 'POST', body: { answers } });
    // A learner who already holds the certificate gets it back with a failed
    // retake too; `earned` keeps the panel from announcing it as new.
    if (data.certificate) setCertificate({ ...data.certificate, earned: data.passed });
    return data;
  };

  if (status === 'loading') {
    return (
      <div className="lx-route-loading" role="status" aria-label="Loading the final exam">
        <span />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="lp-error">
        {/* 403 is the exam's gate; anything else is a real failure. */}
        <h1>{errorStatus === 403 ? 'Not so fast.' : 'Could not open the exam.'}</h1>
        <p>{error}</p>
        <Link to={`/learn/${slug}`} className="lx-link">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the course
        </Link>
      </main>
    );
  }

  const count = payload.questions.length;

  return (
    <main className="lp">
      <div className="lp-wrap">
        <LearnHero
          back={{ to: `/learn/${slug}`, label: 'Back to the course' }}
          label="Final exam"
          title={payload.course.title}
          lede="Pass, and your certificate is issued on the spot."
          meta={[`${count} questions`, 'Unlimited retakes']}
          photo={learnPhotos.finalExam}
          chips={[{ value: `${payload.passMark}%`, label: 'to pass' }]}
        />

        <div className="lp-narrow" ref={examRef}>
          {certificate && (
            <div className="lp-issued lp-glass" role="status">
              <span className="lp-seal" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </span>
              <div>
                <p className="lp-issued-title">
                  {certificate.earned ? 'Certificate issued.' : 'Your certificate stands.'}
                </p>
                <span className="lp-issued-code">
                  Verification code<strong>{certificate.code}</strong>
                </span>
              </div>
              <Link to={`/certificate/${certificate.code}`} className="btn lx-btn">
                View &amp; print
                <span className="lx-btn-disc" aria-hidden="true">
                  <ArrowUpRight size={15} />
                </span>
              </Link>
            </div>
          )}

          <Quiz
            questions={payload.questions}
            onSubmit={submit}
            submitLabel="Submit final exam"
            passMark={payload.passMark}
            anchorRef={examRef}
          />
        </div>
      </div>
    </main>
  );
};

export default FinalExam;
