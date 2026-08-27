import React, { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import './TopicQuiz.css';

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
  const resultRef = useRef(null);

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
      // Let the result render before scrolling to it.
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const retry = () => {
    setResult(null);
    setAnswers(questions.map(() => -1));
  };

  if (state === 'none' || state === 'loading') return null;
  if (state === 'error') {
    return <p className="mt-8 text-sm text-rose-600">{error}</p>;
  }

  return (
    <section className="cx-tq mt-12" aria-label="Topic check">
      <div className="cx-tq-head">
        <span className="cx-tq-badge" aria-hidden="true">✓</span>
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
                    <span className="cx-tq-num">{qi + 1}</span>
                    {question.prompt}
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
                        <span className="cx-tq-dot" aria-hidden="true" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>

          <button
            onClick={submit}
            disabled={answered !== questions.length || busy}
            className="cx-tq-submit"
          >
            {busy
              ? 'Checking…'
              : answered === questions.length
              ? 'Check my answers'
              : `${answered} of ${questions.length} answered`}
          </button>
        </>
      )}

      {result && (
        <div ref={resultRef} className={`cx-tq-result ${result.passed ? 'is-pass' : 'is-fail'}`}>
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
                  {r.prompt}
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

          {result.passed ? (
            // Carrying on from here saves scrolling back past the whole quiz.
            <button onClick={onContinue} className="cx-tq-submit cx-tq-continue">
              {continueLabel}
            </button>
          ) : (
            <button onClick={retry} className="cx-tq-submit">
              Try again
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default TopicQuiz;
