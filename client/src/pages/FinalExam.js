import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import Quiz from '../learn/Quiz';

const FinalExam = () => {
  const { slug } = useParams();
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState(null);

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
    if (data.certificate) setCertificate(data.certificate);
    return data;
  };

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
        <h1 className="text-2xl font-bold text-slate-900">Not so fast</h1>
        <p className="mt-3 text-slate-600">{error}</p>
        <Link to={`/learn/${slug}`} className="mt-6 inline-block text-indigo-400 hover:underline">
          Back to the course
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link to={`/learn/${slug}`} className="text-sm text-slate-400 hover:text-white">
        ← Back to the course
      </Link>

      {certificate && (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <p className="text-2xl font-bold text-emerald-300">Certificate issued</p>
          <p className="mt-2 text-slate-700">
            Verification code <span className="font-mono font-semibold">{certificate.code}</span>
          </p>
          <Link
            to={`/certificate/${certificate.code}`}
            className="mt-4 inline-block px-6 py-2.5 rounded-lg bg-emerald-400 text-emerald-950 font-semibold hover:bg-emerald-300"
          >
            View &amp; print your certificate
          </Link>
        </div>
      )}

      <p className="mt-6 text-xs font-semibold text-indigo-400 uppercase tracking-wide">
        Final exam
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-slate-900">{payload.course.title}</h1>
      <p className="mt-2 text-slate-600">
        {payload.questions.length} questions · {payload.passMark}% to pass · unlimited retakes. Pass
        and your free certificate is issued automatically.
      </p>

      <div className="mt-8">
        <Quiz
          questions={payload.questions}
          onSubmit={submit}
          submitLabel="Submit final exam"
          passMark={payload.passMark}
        />
      </div>
    </main>
  );
};

export default FinalExam;
