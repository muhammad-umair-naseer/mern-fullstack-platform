import React, { useState } from 'react';

// Shared by chapter quizzes and the final exam.
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
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-amber-50 border-amber-300'
          }`}
        >
          <p className="text-5xl font-black text-black">{result.percent}%</p>
          <p className="mt-2 text-black font-bold text-base">
            {result.score} of {result.total} correct
            {passMark ? ` · ${passMark}% needed to pass` : ''}
          </p>
          <p className={`mt-3 font-extrabold text-lg ${result.passed ? 'text-emerald-700' : 'text-amber-800'}`}>
            {result.passed ? '🎉 Passed' : 'Not passed yet — review and try again'}
          </p>
        </div>

        <ol className="space-y-4">
          {result.review.map((r, i) => (
            <li
              key={r.id}
              className={`rounded-xl border p-5 ${
                r.right ? 'border-emerald-300 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/40'
              }`}
            >
              <p className="font-bold text-black text-base">
                {i + 1}. {r.prompt}
              </p>
              <p className="mt-2 text-sm text-black font-medium">
                Your answer:{' '}
                <span className={`font-bold ${r.right ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {r.your >= 0 ? r.options[r.your] : 'Not answered'}
                </span>
              </p>
              {!r.right && (
                <p className="mt-1 text-sm text-black font-medium">
                  Correct answer: <span className="text-emerald-700 font-bold">{r.options[r.correct]}</span>
                </p>
              )}
              {r.explanation && (
                <p className="mt-3 text-sm text-black font-medium border-l-4 border-orange-500 pl-3 bg-orange-50/50 py-1 rounded-r">
                  {r.explanation}
                </p>
              )}
            </li>
          ))}
        </ol>

        <button
          onClick={retry}
          className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 border border-rose-300 text-rose-700 px-4 py-3 text-sm font-bold">
          {error}
        </p>
      )}

      <ol className="space-y-6">
        {questions.map((q, qi) => (
          <li key={q.id} className="bg-white rounded-2xl shadow-card border border-slate-200 p-6">
            <fieldset>
              <legend className="font-bold text-black text-lg mb-4">
                {qi + 1}. {q.prompt}
              </legend>
              <div className="space-y-2.5">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      answers[qi] === oi
                        ? 'border-orange-500 bg-orange-50/70 ring-1 ring-orange-400'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[qi] === oi}
                      onChange={() => choose(qi, oi)}
                      className="mt-1 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-black font-semibold text-sm sm:text-base leading-snug">{opt}</span>
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
          className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
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
