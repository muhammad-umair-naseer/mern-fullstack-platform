import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import Quiz from '../learn/Quiz';
import LearnHero from '../learn/LearnHero';
import { learnPhotos } from '../learn/photos';
import '../learn/Learn.css';

const ChapterQuiz = () => {
  const { slug, chapterId } = useParams();
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState(0);

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
          setErrorStatus(err.status || 0);
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
      <div className="lx-route-loading" role="status" aria-label="Loading the quiz">
        <span />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="lp-error">
        {/* 403 is the quiz's gate; anything else is a real failure. */}
        <h1>{errorStatus === 403 ? 'Not open yet.' : 'Could not open the quiz.'}</h1>
        <p>{error}</p>
        <Link to={`/learn/${slug}`} className="lx-link">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the course
        </Link>
      </main>
    );
  }

  const count = payload.questions.length;
  const position = String(payload.chapter.position).padStart(2, '0');

  return (
    <main className="lp">
      <div className="lp-wrap">
        <LearnHero
          back={{ to: `/learn/${slug}`, label: 'Back to the course' }}
          index={position}
          label={`Chapter ${payload.chapter.position} quiz`}
          title={payload.chapter.title}
          lede="A practice check. It never touches your certificate."
          meta={['Instant feedback', 'Unlimited retakes']}
          photo={learnPhotos.chapterQuiz}
          chips={[{ value: String(count), label: count === 1 ? 'question' : 'questions' }]}
        />

        <div className="lp-narrow">
          <Quiz questions={payload.questions} onSubmit={submit} submitLabel="Check my answers" />
        </div>
      </div>
    </main>
  );
};

export default ChapterQuiz;
