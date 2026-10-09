import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Clock } from 'lucide-react';
import { api } from '../lib/api';
import LearnHero from '../learn/LearnHero';
import { learnPhotos } from '../learn/photos';
import useCountUp from '../learn/useCountUp';
import { CLAUDE_PRO } from '../learn/ClaudePro';
import '../learn/Learn.css';
import '../learn/Quiz.css';
import '../learn/FinalExam.css';

/**
 * The final exam: one sitting against the clock, no retries.
 *
 * The rules are the server's (services/finalExam.service.js); this page shows
 * them, then gets out of the way. During the exam the navbar and footer are
 * hidden, text cannot be selected or copied, and leaving the tab, closing the
 * page or navigating away submits the attempt as it stands. Answers save as
 * they are picked, and the result is marks only, never the answers.
 */

const LETTERS = 'ABCDEFGH';
const pad = (n) => String(n).padStart(2, '0');
const clock = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};
const longDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// How an attempt ended, in the learner's words.
const ENDED = {
  submitted: 'You submitted the exam.',
  left: 'Your exam was submitted when you left the exam tab.',
  timeout: 'Time ran out, so your exam was submitted.',
};

const Marks = ({ value }) => {
  const shown = useCountUp(value, { duration: 1000, delay: 180 });
  return (
    <p className="fx-marks">
      <span aria-hidden="true">{shown}</span>
      <span className="fx-marks-of" aria-hidden="true">/100</span>
      <span className="visually-hidden">{value} out of 100</span>
    </p>
  );
};

const CertificatePanel = ({ certificate, fresh }) => (
  <div className="lp-issued lp-glass" role="status">
    <span className="lp-seal" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.2 4.2L19 7" />
      </svg>
    </span>
    <div>
      <p className="lp-issued-title">{fresh ? 'Certificate issued.' : 'Your certificate stands.'}</p>
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
);

/* ------------------------------------------------------------ before the exam */

const Rules = ({ rules, onStart, starting, retake }) => {
  const [pledged, setPledged] = useState(false);
  const each = rules.totalMarks / rules.questions;

  return (
    <section className="fx-rules lp-glass" aria-labelledby="fx-rules-title">
      <h2 id="fx-rules-title" className="fx-rules-title">
        Final exam: <em>read before you start</em>
      </h2>
      {retake && <p className="fx-retake">This is your retake, and your last attempt.</p>}

      <h3 className="fx-rules-head">The exam</h3>
      <ul className="fx-list">
        <li>
          {rules.questions} questions, {each} marks each: <strong>{rules.totalMarks} marks</strong>.
        </li>
        <li>
          <strong>Pass mark: {rules.passMarks}.</strong> Passing earns your certificate.
        </li>
        <li>
          <strong>{rules.minutes} minutes.</strong> The timer starts when you press Start and does not stop.
        </li>
      </ul>

      <h3 className="fx-rules-head">Rules, with no exceptions</h3>
      <ul className="fx-list fx-list--strict">
        <li>
          <strong>Leaving this tab submits your exam immediately</strong>, answered or not. That includes switching
          tabs or apps, minimising the window, locking your screen or taking a phone call. Turn on Do Not Disturb
          before you start.
        </li>
        <li>
          <strong>No re-attempts are given for technical problems of any kind:</strong> power cuts, lost connection, a
          dead battery or a crash. Use a charged device and a stable connection.
        </li>
        <li>Copying and text selection are disabled during the exam.</li>
        <li>
          If you don&rsquo;t pass, you can retake once <strong>after {rules.retakeAfterDays} days</strong>.
        </li>
      </ul>

      <label className="fx-pledge">
        <input type="checkbox" checked={pledged} onChange={(e) => setPledged(e.target.checked)} />
        <span>
          I&rsquo;ll take this exam honestly: on my own, without AI tools, notes or anyone&rsquo;s help, and I accept
          that this attempt is final.
        </span>
      </label>

      <button type="button" className="btn lx-btn fx-start" disabled={!pledged || starting} onClick={onStart}>
        {starting ? 'Starting…' : 'Start the final exam'}
        <span className="lx-btn-disc" aria-hidden="true">
          <ArrowUpRight size={15} />
        </span>
      </button>
    </section>
  );
};

// The Claude Pro application this pass created, with whatever the admin has
// decided since: applied, shortlisted, awarded or not selected.
const CLAUDE_CARD = {
  applied: ['Applied for 1 month of free Claude Pro', 'Your score and learning progress were sent in automatically. Follow it with Claude Pro status on My learning.'],
  selected: ['Your Claude Pro request is being reviewed', 'The Cortexis team is working on your request.'],
  awarded: ['Award granted. Congratulations!', 'One month of Claude Pro is yours. Watch your inbox for how to claim it.'],
  rejected: ['Claude Pro not granted', 'Thank you for applying. Your certificate is yours to keep and share.'],
};

const ClaudeAppliedCard = ({ score, slug }) => {
  const [status, setStatus] = useState('applied');
  useEffect(() => {
    let live = true;
    api(`/learn/claude-pro/status/${slug}`)
      .then((res) => { if (live && CLAUDE_CARD[res?.data?.status]) setStatus(res.data.status); })
      .catch(() => {});
    return () => { live = false; };
  }, [slug]);
  const [title, note] = CLAUDE_CARD[status];
  return (
    <div className={`fx-claude-applied-box is-${status}`} role="status">
      <div className="fx-claude-applied-header">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{status === 'awarded' ? '🎉' : '✨'}</span>
          <h3 className="fx-claude-applied-title">{title}</h3>
        </div>
        <span className="fx-claude-applied-badge">{CLAUDE_PRO[status].label}</span>
      </div>
      <p className="fx-claude-applied-note">
        Final score <strong>{score}/100</strong>. {note}
      </p>
    </div>
  );
};

// Where the learner stands when there is nothing to start.
const Standing = ({ status, slug }) => {
  const last = status.attempts[status.attempts.length - 1];
  return (
    <section className="fx-standing lp-glass">
      {status.state === 'passed' && status.certificate && (
        <>
          <p className="fx-standing-line">
            You passed with <strong>{status.certificate.score}/100</strong>.
          </p>
          <CertificatePanel certificate={status.certificate} fresh={false} />
          <ClaudeAppliedCard score={status.certificate.score} slug={slug} />
        </>
      )}
      {status.state === 'waiting' && (
        <p className="fx-standing-line">
          You scored <strong>{last.marks}/100</strong> on your first attempt. Your retake opens on{' '}
          <strong>{longDate(status.retakeAt)}</strong>.
        </p>
      )}
      {status.state === 'exhausted' && (
        <p className="fx-standing-line">
          You have used both attempts, so this course&rsquo;s exam is closed. Your last score was{' '}
          <strong>{last.marks}/100</strong>.
        </p>
      )}
      {status.state === 'locked' && <p className="fx-standing-line">{status.reason}</p>}
      <Link to={`/learn/${slug}`} className="lx-link">
        <ArrowLeft size={15} aria-hidden="true" /> Back to the course
      </Link>
    </section>
  );
};

/* -------------------------------------------------------------- the exam */

const Exam = ({ slug, attempt, onDone, onFailed }) => {
  const total = attempt.questions.length;
  const [answers, setAnswers] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // The clock runs from when this page received the paper, so a learner's
  // wrong system clock cannot give them more or less time.
  const [endsAt] = useState(() => Date.now() + (Date.parse(attempt.deadline) - Date.parse(attempt.startedAt)));
  const [now, setNow] = useState(() => Date.now());

  const answersRef = useRef(answers);
  const blursRef = useRef(0);
  const endedRef = useRef(false);
  const aliveRef = useRef(true);
  const leaveTimer = useRef(null);
  const confirmTimer = useRef(null);

  const finish = useCallback(
    async (reason) => {
      if (endedRef.current) return;
      endedRef.current = true;
      if (aliveRef.current) setSubmitting(true);
      try {
        const { data } = await api(`/learn/final/${slug}/submit`, {
          method: 'POST',
          keepalive: true,
          body: { token: attempt.token, reason, answers: answersRef.current, blurs: blursRef.current },
        });
        if (aliveRef.current) onDone(data);
      } catch (err) {
        if (aliveRef.current) onFailed(err);
      }
    },
    [slug, attempt.token, onDone, onFailed]
  );
  const finishRef = useRef(finish);
  finishRef.current = finish;

  // Exam mode, and every way out of it submits.
  useEffect(() => {
    aliveRef.current = true;
    // React's development double-mount unmounts and remounts at once; a real
    // unmount (a link, the back button) is the only one that gets this far.
    clearTimeout(leaveTimer.current);
    const root = document.documentElement;
    root.classList.add('cx-exam-mode');

    const block = (e) => e.preventDefault();
    const keys = (e) => {
      if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'x', 'p', 's', 'u'].includes(String(e.key).toLowerCase())) {
        e.preventDefault();
      }
    };
    const hidden = () => {
      if (document.visibilityState === 'hidden') finishRef.current('left');
    };
    const pagehide = () => finishRef.current('left');
    const blur = () => {
      blursRef.current += 1;
    };
    const unload = (e) => {
      if (endedRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    const blocked = ['copy', 'cut', 'contextmenu', 'selectstart', 'dragstart'];

    blocked.forEach((t) => document.addEventListener(t, block));
    document.addEventListener('keydown', keys);
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', pagehide);
    window.addEventListener('blur', blur);
    window.addEventListener('beforeunload', unload);

    return () => {
      aliveRef.current = false;
      root.classList.remove('cx-exam-mode');
      blocked.forEach((t) => document.removeEventListener(t, block));
      document.removeEventListener('keydown', keys);
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('pagehide', pagehide);
      window.removeEventListener('blur', blur);
      window.removeEventListener('beforeunload', unload);
      leaveTimer.current = setTimeout(() => finishRef.current('left'), 0);
    };
  }, []);

  // The clock, and what happens at zero.
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endsAt) finishRef.current('timeout');
    }, 250);
    return () => clearInterval(id);
  }, [endsAt]);

  useEffect(() => () => clearTimeout(confirmTimer.current), []);

  const choose = (i, choice) => {
    if (endedRef.current) return;
    const next = { ...answersRef.current, [i]: choice };
    answersRef.current = next;
    setAnswers(next);
    setConfirming(false);
    api(`/learn/final/${slug}/answer`, { method: 'POST', body: { token: attempt.token, i, choice } }).catch((err) => {
      // The server has closed this attempt (out of time, or left from another tab).
      if (err.status === 409) finishRef.current('timeout');
    });
  };

  const answered = Object.keys(answers).length;
  const left = endsAt - now;
  const low = left <= 5 * 60_000;

  const submit = () => {
    if (!confirming) {
      setConfirming(true);
      clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setConfirming(false), 5000);
      return;
    }
    finish('submitted');
  };

  return (
    <div className="fx-exam fx-lock">
      <header className="fx-exam-head">
        <span className="lx-label">Final exam{attempt.attemptNo > 1 ? ' · retake' : ''}</span>
        <p className="fx-exam-note">Stay on this tab. Leaving it submits your exam.</p>
      </header>

      <div className="cx-qz fx-paper">
        <ol className="cx-qz-list">
          {attempt.questions.map((q, n) => (
            <li key={q.i} className={`cx-qz-q cx-contain${answers[q.i] !== undefined ? ' is-answered' : ''}`}>
              <fieldset>
                <legend className="cx-qz-prompt">
                  <span className="cx-qz-num">{pad(n + 1)}</span>
                  <span className="fx-prompt">{q.prompt}</span>
                </legend>
                <div className="cx-qz-options">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`cx-qz-option${answers[q.i] === oi ? ' is-picked' : ''}`}>
                      <input
                        type="radio"
                        name={`fx-${q.i}`}
                        checked={answers[q.i] === oi}
                        onChange={() => choose(q.i, oi)}
                        className="cx-qz-input"
                        disabled={submitting}
                      />
                      <span className="cx-qz-letter" aria-hidden="true">
                        {LETTERS[oi]}
                      </span>
                      <span className="cx-qz-text">{opt}</span>
                      <span className="cx-qz-tick" aria-hidden="true">
                        ✓
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        <div className="cx-qz-dock">
          <div className={`cx-qz-dock-inner${answered === total ? ' is-complete' : ''}`}>
            <div className={`fx-timer${low ? ' is-low' : ''}`} role="timer" aria-label="Time left">
              <Clock size={15} aria-hidden="true" />
              {clock(left)}
            </div>
            <div className="cx-qz-dock-count" aria-hidden="true">
              <span className="cx-qz-dock-n">{answered}</span>
              <span className="cx-qz-dock-of">/ {total} answered</span>
            </div>
            <div
              className={`cx-qz-progress ${answered === total ? 'is-complete' : ''}`}
              role="progressbar"
              aria-label="Questions answered"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={answered}
            >
              <span className="cx-qz-progress-fill" style={{ '--cx-qz-p': total ? answered / total : 0 }} />
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className={`btn lx-btn cx-qz-btn cx-qz-submit${confirming ? ' fx-confirm' : ''}`}
            >
              {submitting
                ? 'Submitting…'
                : confirming
                ? answered < total
                  ? `${total - answered} unanswered. Submit anyway?`
                  : 'Submit? This is final.'
                : 'Submit exam'}
              <span className="lx-btn-disc" aria-hidden="true">
                <ArrowUpRight size={15} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ after the exam */

const Result = ({ result, slug }) => {
  const { status } = result;
  return (
    <section className={`fx-result lp-glass ${result.passed ? 'is-pass' : 'is-fail'}`} aria-live="polite">
      <span className="lx-label">Your score</span>
      <Marks value={result.marks} />
      <p className="fx-verdict">
        {result.passed ? 'Passed.' : `Not passed. The pass mark is ${status.rules.passMarks}.`}{' '}
        <span className="fx-verdict-sub">
          {result.correct} of {result.total} correct. {ENDED[result.reason]}
        </span>
      </p>

      {result.passed && status.certificate && (
        <>
          <CertificatePanel certificate={status.certificate} fresh />
          <ClaudeAppliedCard score={result.marks} slug={slug} />
        </>
      )}
      {status.state === 'waiting' && (
        <p className="fx-standing-line">
          You can retake the exam once, from <strong>{longDate(status.retakeAt)}</strong>.
        </p>
      )}
      {status.state === 'exhausted' && (
        <p className="fx-standing-line">You have used both attempts, so this course&rsquo;s exam is closed.</p>
      )}

      <Link to={`/learn/${slug}`} className="lx-link">
        <ArrowLeft size={15} aria-hidden="true" /> Back to the course
      </Link>
    </section>
  );
};

/* -------------------------------------------------------------------- page */

const FinalExam = () => {
  const { slug } = useParams();
  const [phase, setPhase] = useState('loading');
  const [status, setStatus] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api(`/learn/final/${slug}`);
        if (cancelled) return;
        setStatus(data);
        setPhase('intro');
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setPhase('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const start = async () => {
    setStarting(true);
    try {
      const { data } = await api(`/learn/final/${slug}/start`, { method: 'POST', body: { pledge: true } });
      setAttempt(data);
      setPhase('exam');
    } catch (err) {
      if (err.data) setStatus((s) => ({ ...s, ...err.data }));
      setError(err);
    } finally {
      setStarting(false);
    }
  };

  const done = useCallback((data) => {
    setResult(data);
    setStatus((s) => ({ ...s, ...data.status }));
    setPhase('result');
  }, []);

  // The paper and the result each open at the top. After the new screen has
  // rendered, not before: the long paper collapsing into the short result
  // would otherwise leave the page scrolled to its footer.
  useEffect(() => {
    if (phase === 'exam' || phase === 'result') window.scrollTo(0, 0);
  }, [phase]);

  const failed = useCallback((err) => {
    setError(err);
    setPhase('error');
  }, []);

  if (phase === 'loading') {
    return (
      <div className="lx-route-loading" role="status" aria-label="Loading the final exam">
        <span />
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <main className="lp-error">
        <h1>{error?.status === 403 ? 'Not so fast.' : 'Could not open the exam.'}</h1>
        <p>{error?.message}</p>
        <Link to={`/learn/${slug}`} className="lx-link">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the course
        </Link>
      </main>
    );
  }

  if (phase === 'exam') {
    return (
      <main className="lp fx-page">
        <div className="lp-wrap lp-narrow">
          <Exam slug={slug} attempt={attempt} onDone={done} onFailed={failed} />
        </div>
      </main>
    );
  }

  const { rules } = status;
  return (
    <main className="lp fx-page">
      <div className="lp-wrap">
        <LearnHero
          back={{ to: `/learn/${slug}`, label: 'Back to the course' }}
          label="Final exam"
          title={status.course.title}
          lede="One sitting, against the clock. Pass it and your certificate is issued on the spot."
          meta={[`${rules.questions} questions`, `${rules.minutes} minutes`, 'One attempt']}
          photo={learnPhotos.finalExam}
          chips={[{ value: String(rules.passMarks), label: `of ${rules.totalMarks} to pass` }]}
        />

        <div className="lp-narrow">
          {phase === 'result' && <Result result={result} slug={slug} />}
          {phase === 'intro' &&
            (status.state === 'ready' || status.state === 'retake' ? (
              <>
                {error && (
                  <p role="alert" className="cx-qz-error">
                    {error.message}
                  </p>
                )}
                <Rules rules={rules} onStart={start} starting={starting} retake={status.state === 'retake'} />
              </>
            ) : (
              <Standing status={status} slug={slug} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default FinalExam;
