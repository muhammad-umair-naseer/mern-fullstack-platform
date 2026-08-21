import React, { useState } from 'react';

// Shared by chapter quizzes and the final exam. The parent owns submission so
// the same component can post to either endpoint.
const Quiz = ({ questions, onSubmit, submitLabel = 'Submit answers', passMark }) => {
  const [answers, setAnswers] = useState(() => questions.map(() => -1));
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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

  const retry = () => {
    setResult(null);
    setAnswers(questions.map(() => -1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div
          className={`rounded-2xl p-6 border text-center ${
            result.passed
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <p className="text-5xl font-extrabold text-slate-900">{result.percent}%</p>
          <p className="mt-2 text-slate-700">
            {result.score} of {result.total} correct
            {passMark ? ` · ${passMark}% needed to pass` : ''}
          </p>
          <p className={`mt-3 font-semibold ${result.passed ? 'text-emerald-300' : 'text-amber-300'}`}>
            {result.passed ? 'Passed' : 'Not passed yet — review and try again'}
          </p>
        </div>

        <ol className="space-y-4">
          {result.review.map((r, i) => (
            <li
              key={r.id}
              className={`rounded-xl border p-5 ${
                r.right ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
              }`}
            >
              <p className="font-semibold text-slate-900">
                {i + 1}. {r.prompt}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Your answer:{' '}
                <span className={r.right ? 'text-emerald-300' : 'text-rose-300'}>
                  {r.your >= 0 ? r.options[r.your] : 'Not answered'}
                </span>
              </p>
              {!r.right && (
                <p className="mt-1 text-sm text-slate-600">
                  Correct answer: <span className="text-emerald-300">{r.options[r.correct]}</span>
                </p>
              )}
              {r.explanation && (
                <p className="mt-3 text-sm text-slate-500 border-l-2 border-white/15 pl-3">
                  {r.explanation}
                </p>
              )}
            </li>
          ))}
        </ol>

        <button
          onClick={retry}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <ol className="space-y-6">
        {questions.map((q, qi) => (
          <li key={q.id} className="bg-white rounded-2xl shadow-card p-6">
            <fieldset>
              <legend className="font-semibold text-slate-900 mb-4">
                {qi + 1}. {q.prompt}
              </legend>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      answers[qi] === oi
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[qi] === oi}
                      onChange={() => choose(qi, oi)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div className="sticky bottom-4">
        <button
          onClick={submit}
          disabled={!allAnswered || busy}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-glow"
        >
          {busy
            ? 'Grading…'
            : allAnswered
            ? submitLabel
            : `Answer all questions (${answered}/${questions.length})`}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
