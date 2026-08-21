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
        <div className="h-10 w-10 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-black">Not so fast</h1>
        <p className="mt-3 text-black font-medium">{error}</p>
        <Link to={`/learn/${slug}`} className="mt-6 inline-block text-orange-600 font-bold hover:underline">
          Back to the course
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 bg-white text-black min-h-screen">
      <Link to={`/learn/${slug}`} className="text-sm font-bold text-black hover:text-orange-600 transition">
        ← Back to the course
      </Link>

      {certificate && (
        <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center shadow-md">
          <p className="text-2xl font-black text-emerald-800">🎉 Certificate issued!</p>
          <p className="mt-2 text-black font-semibold">
            Verification code: <span className="font-mono font-bold text-black bg-white px-2 py-0.5 rounded border border-emerald-200">{certificate.code}</span>
          </p>
          <Link
            to={`/certificate/${certificate.code}`}
            className="mt-4 inline-block px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md"
          >
            View &amp; print your certificate
          </Link>
        </div>
      )}

      <p className="mt-6 text-xs font-bold text-orange-600 uppercase tracking-wider">
        Final exam
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{payload.course.title}</h1>
      <p className="mt-2 text-black font-medium leading-relaxed">
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
