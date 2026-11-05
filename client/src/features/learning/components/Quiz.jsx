import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import useCountUp from './useCountUp.jsx';
import bringIntoView from './bringIntoView.js';
import './Quiz.css';

// Seven marks for the pass celebration. Their positions live in Quiz.css so the
// component stays a component; this is only how many of them there are.
const CHEER = [0, 1, 2, 3, 4, 5, 6];

// Options are lettered, the way a printed paper is.
const LETTERS = 'ABCDEFGH';

// A stagger that keeps going forever stops reading as a sequence and starts
// reading as a wait, so the index is capped and later items share the last step.
const step = (i, max) => Math.min(i, max);

const pad = (n) => String(n).padStart(2, '0');

// The score counts up to its value. The real number is given to assistive tech
// once, rather than every frame of the count.
const Score = ({ percent }) => {
  const shown = useCountUp(percent, { duration: 1000, delay: 180 });
  return (
    <p className="cx-qz-score">
      <span aria-hidden="true">{shown}</span>
      <span className="cx-qz-score-unit" aria-hidden="true">%</span>
      <span className="visually-hidden">{percent}%</span>
    </p>
  );
};

// Shared by chapter quizzes and the final exam.
//
// anchorRef (optional) is what to bring into view when a result lands. It
// defaults to the result card; the final exam passes the block that also holds
// its "Certificate issued" panel, so the learner sees both at once.
const Quiz = ({ questions, onSubmit, submitLabel = 'Submit answers', passMark, anchorRef }) => {
  const [answers, setAnswers] = useState(() => questions.map(() => -1));
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rootRef = useRef(null);
  const resultRef = useRef(null);
  const settleRef = useRef(() => {});

  // Presentation only. The submit is pressed at the foot of a long paper, and
  // swapping the paper for the result leaves the score far above the viewport.
  // Bring the verdict to the learner (bringIntoView explains the care taken).
  useEffect(() => {
    if (!result) return undefined;
    return bringIntoView(anchorRef?.current || resultRef.current);
  }, [result, anchorRef]);

  useEffect(() => () => settleRef.current(), []);

  const answered = answers.filter((a) => a >= 0).length;
  const allAnswered = answered === questions.length;

  const choose = (qi, oi) =>
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      setResult(await onSubmit(answers));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // A retake starts at question one, not at the foot of the old review.
  const retry = () => {
    setResult(null);
    setAnswers(questions.map(() => -1));
    settleRef.current();
    settleRef.current = bringIntoView(rootRef.current);
  };

  if (result) {
    return (
      <div className="cx-qz" ref={rootRef}>
        <div
          ref={resultRef}
          className={`cx-qz-result cx-anim-card ${result.passed ? 'is-pass' : 'is-fail'}`}
        >
          <span className="cx-qz-badge" aria-hidden="true">
            {result.passed ? '✓' : '↻'}
          </span>

          {result.passed && (
            <span className="cx-qz-cheer" aria-hidden="true">
              {CHEER.map((n) => (
                <span key={n} className="cx-qz-spark" />
              ))}
            </span>
          )}

          <Score percent={result.percent} />
          <p className="cx-qz-scoreline">
            {result.score} of {result.total} correct
            {passMark ? ` · ${passMark}% needed to pass` : ''}
          </p>
          <p className="cx-qz-verdict">
            {result.passed ? 'Passed.' : 'Not passed yet. The ones marked ✕ need another look.'}
          </p>
        </div>

        <ol className="cx-qz-review">
          {result.review.map((r, i) => (
            <li
              key={r.id}
              style={{ '--i': step(i, 9) }}
              className={`cx-qz-rev cx-contain ${r.right ? 'is-right' : 'is-wrong'}`}
            >
              <p className="cx-qz-rev-q">
                <span className="cx-qz-mark" aria-hidden="true">
                  {r.right ? '✓' : '✕'}
                </span>
                <span>
                  <span className="cx-qz-rev-num">{pad(i + 1)}</span>
                  {r.prompt}
                </span>
              </p>
              <div className="cx-qz-rev-body">
                <p>
                  Your answer:{' '}
                  <span className={r.right ? 'cx-qz-good' : 'cx-qz-bad'}>
                    {r.your >= 0 ? r.options[r.your] : 'Not answered'}
                  </span>
                </p>
                {!r.right && r.correct != null && (
                  <p>
                    Correct answer: <span className="cx-qz-good">{r.options[r.correct]}</span>
                  </p>
                )}
                {r.explanation && <p className="cx-qz-why">{r.explanation}</p>}
              </div>
            </li>
          ))}
        </ol>

        <div className="cx-qz-again cx-anim-rise" style={{ '--i': step(result.review.length, 10) }}>
          <button type="button" onClick={retry} className="btn lx-btn cx-qz-btn">
            Try again
            <span className="lx-btn-disc" aria-hidden="true">
              <RotateCcw size={14} />
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cx-qz" ref={rootRef}>
      {error && (
        <p role="alert" className="cx-qz-error cx-anim-rise">
          {error}
        </p>
      )}

      <ol className="cx-qz-list">
        {questions.map((q, qi) => (
          <li
            key={q.id}
            style={{ '--i': step(qi, 7) }}
            className={`cx-qz-q cx-anim-card cx-contain${answers[qi] >= 0 ? ' is-answered' : ''}`}
          >
            <fieldset>
              <legend className="cx-qz-prompt">
                <span className="cx-qz-num">{pad(qi + 1)}</span>
                <span>{q.prompt}</span>
              </legend>
              <div className="cx-qz-options">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`cx-qz-option${answers[qi] === oi ? ' is-picked' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[qi] === oi}
                      onChange={() => choose(qi, oi)}
                      className="cx-qz-input"
                    />
                    <span className="cx-qz-letter" aria-hidden="true">
                      {LETTERS[oi] || oi + 1}
                    </span>
                    <span className="cx-qz-text">{opt}</span>
                    <span className="cx-qz-tick" aria-hidden="true">✓</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      {/* The dock: how far through the learner is, and the one action. */}
      <div className="cx-qz-dock">
        <div className={`cx-qz-dock-inner${allAnswered ? ' is-complete' : ''}`}>
          <div className="cx-qz-dock-count" aria-hidden="true">
            <span className="cx-qz-dock-n">{answered}</span>
            <span className="cx-qz-dock-of">/ {questions.length} answered</span>
          </div>

          <div
            className={`cx-qz-progress ${allAnswered ? 'is-complete' : ''}`}
            role="progressbar"
            aria-label="Questions answered"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={answered}
          >
            <span
              className="cx-qz-progress-fill"
              style={{ '--cx-qz-p': questions.length ? answered / questions.length : 0 }}
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered || busy}
            className="btn lx-btn cx-qz-btn cx-qz-submit"
          >
            {busy
              ? 'Grading…'
              : allAnswered
              ? submitLabel
              : `${questions.length - answered} left to answer`}
            <span className="lx-btn-disc" aria-hidden="true">
              <ArrowUpRight size={15} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
