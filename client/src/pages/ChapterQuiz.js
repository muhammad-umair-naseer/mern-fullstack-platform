import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import Quiz from '../learn/Quiz';

const ChapterQuiz = () => {
  const { slug, chapterId } = useParams();
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api(`/learn/quiz/chapter/${chapterId}`);
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
  }, [chapterId]);

  const submit = async (answers) => {
    const { data } = await api(`/learn/quiz/chapter/${chapterId}`, {
      method: 'POST',
      body: { answers },
    });
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
        <h1 className="text-2xl font-bold text-black">{error}</h1>
        <Link to={`/learn/${slug}`} className="mt-4 inline-block text-orange-600 font-bold hover:underline">
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
      <p className="mt-4 text-xs font-bold text-orange-600 uppercase tracking-wider">
        Chapter {payload.chapter.position} quiz
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{payload.chapter.title}</h1>
      <p className="mt-2 text-black font-medium leading-relaxed">
        A practice check that does not affect your certificate. You get instant feedback and can
        retake it as often as you like.
      </p>

      <div className="mt-8">
        <Quiz questions={payload.questions} onSubmit={submit} submitLabel="Check my answers" />
      </div>
    </main>
  );
};

export default ChapterQuiz;
