import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react';
import { api } from '../lib/api';
import bringIntoView from './bringIntoView';
import './TopicQuiz.css';

// Options are lettered, the way a printed paper is.
const LETTERS = 'ABCDEFGH';
const pad = (n) => String(n).padStart(2, '0');

/**
 * The check at the end of a topic.
 *
 * This one gates progress, so it is deliberately more of an event than the
 * practice quizzes: the card lifts in, each choice animates its result, and the
 * outcome is celebrated or explained rather than just scored. A learner who
 * skimmed has to come back and read.
 */
const TopicQuiz = ({ lessonId, onPassed, onContinue, continueLabel }) => {
  const [state, setState] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [passMark, setPassMark] = useState(70);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sectionRef = useRef(null);
  const settleRef = useRef(() => {});

  useEffect(() => () => settleRef.current(), []);

  // Presentation only. The check's own heading and the score (or, on a retry,
  // question one) are brought into view once the page has settled.
  const settle = () => {
    settleRef.current();
    settleRef.current = bringIntoView(sectionRef.current);
  };

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    setResult(null);

    (async () => {
      try {
        const { data } = await api(`/learn/quiz/lesson/${lessonId}`);
        if (cancelled) return;
        setQuestions(data.questions);
        setPassMark(data.passMark ?? 70);
        setAnswers(data.questions.map(() => -1));
        setState('ready');
      } catch (err) {
        if (cancelled) return;
        // 404 simply means this topic has no quiz yet.
        setState(err.status === 404 ? 'none' : 'error');
        setError(err.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const choose = (qi, oi) => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
  const answered = answers.filter((a) => a >= 0).length;

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      const { data } = await api(`/learn/quiz/lesson/${lessonId}`, {
        method: 'POST',
        body: { answers },
      });
      setResult(data);
      if (data.passed) onPassed?.();
      settle();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const retry = () => {
    setResult(null);
    setAnswers(questions.map(() => -1));
    settle();
  };

  if (state === 'none' || state === 'loading') return null;
  if (state === 'error') {
    return <p className="cx-tq-error cx-tq-error--alone">{error}</p>;
  }

  const complete = answered === questions.length;

  return (
    <section ref={sectionRef} className="cx-tq" aria-label="Topic check">
      <div className="cx-tq-head">
        <span className="cx-tq-badge" aria-hidden="true">
          <span>?</span>
        </span>
        <div>
          <h2 className="cx-tq-title">Check yourself</h2>
          <p className="cx-tq-sub">
            {questions.length} questions · {passMark}% to continue · unlimited retries
          </p>
        </div>
      </div>

      {error && <p className="cx-tq-error" role="alert">{error}</p>}

      {!result && (
        <>
          <ol className="cx-tq-list">
            {questions.map((question, qi) => (
              <li key={question.id} className="cx-tq-q" style={{ '--i': qi }}>
                <fieldset>
                  <legend className="cx-tq-prompt">
                    <span className="cx-tq-num">{pad(qi + 1)}</span>
                    <span>{question.prompt}</span>
                  </legend>
                  <div className="cx-tq-options">
                    {question.options.map((opt, oi) => (
                      <label
                        key={oi}
                        className={`cx-tq-option ${answers[qi] === oi ? 'is-picked' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`tq-${question.id}`}
                          checked={answers[qi] === oi}
                          onChange={() => choose(qi, oi)}
                        />
                        <span className="cx-tq-dot" aria-hidden="true">
                          {LETTERS[oi] || oi + 1}
                        </span>
                        <span className="cx-tq-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>

          <div className={`cx-tq-actions${complete ? ' is-complete' : ''}`}>
            <button
              type="button"
              onClick={submit}
              disabled={!complete || busy}
              className="btn lx-btn cx-tq-submit"
            >
              {busy ? 'Checking…' : complete ? 'Check my answers' : `${answered} of ${questions.length} answered`}
              <span className="lx-btn-disc" aria-hidden="true">
                <ArrowUpRight size={15} />
              </span>
            </button>
          </div>
        </>
      )}

      {result && (
        <div className={`cx-tq-result ${result.passed ? 'is-pass' : 'is-fail'}`}>
          <div className="cx-tq-score">
            <span className="cx-tq-scorenum">{result.percent}%</span>
            <span className="cx-tq-scorelabel">
              {result.score} of {result.total} correct
            </span>
          </div>

          <p className="cx-tq-verdict">
            {result.passed
              ? 'Passed. The next topic is unlocked.'
              : `You need ${passMark}%. Review the answers below and try again.`}
          </p>

          <ol className="cx-tq-review">
            {result.review.map((r, i) => (
              <li key={r.id} className={r.right ? 'is-right' : 'is-wrong'} style={{ '--i': i }}>
                <p className="cx-tq-reviewq">
                  <span className="cx-tq-mark" aria-hidden="true">{r.right ? '✓' : '✕'}</span>
                  <span>{r.prompt}</span>
                </p>
                {!r.right && (
                  <p className="cx-tq-correct">
                    Correct answer: <strong>{r.options[r.correct]}</strong>
                  </p>
                )}
                {r.explanation && <p className="cx-tq-why">{r.explanation}</p>}
              </li>
            ))}
          </ol>

          <div className="cx-tq-actions">
            {result.passed ? (
              // Carrying on from here saves scrolling back past the whole quiz.
              <button type="button" onClick={onContinue} className="btn lx-btn cx-tq-continue">
                {continueLabel}
                <span className="lx-btn-disc" aria-hidden="true">
                  <ArrowRight size={15} />
                </span>
              </button>
            ) : (
              <button type="button" onClick={retry} className="btn lx-btn cx-tq-submit">
                Try again
                <span className="lx-btn-disc" aria-hidden="true">
                  <RotateCcw size={14} />
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopicQuiz;
