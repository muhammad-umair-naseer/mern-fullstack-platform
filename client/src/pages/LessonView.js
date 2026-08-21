import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import Markdown from '../learn/Markdown';
import ProgressBar from '../learn/ProgressBar';

const LessonView = () => {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const { data } = await api(`/learn/lessons/${lessonId}`);
        if (!cancelled) {
          setLesson(data);
          setStatus('ready');
          window.scrollTo({ top: 0 });
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
  }, [lessonId]);

  const markComplete = useCallback(async () => {
    setSaving(true);
    try {
      await api(`/learn/lessons/${lessonId}/complete`, { method: 'POST' });
      setLesson((l) => ({ ...l, completed: true }));
      if (lesson?.next) navigate(`/learn/${slug}/lesson/${lesson.next.id}`);
      else navigate(`/learn/${slug}`);
    } finally {
      setSaving(false);
    }
  }, [lessonId, lesson, navigate, slug]);

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

  const percent = Math.round((lesson.index / lesson.totalLessons) * 100);

  return (
    <main className="bg-white text-black min-h-screen">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-black">
            <Link to={`/learn/${slug}`} className="text-black hover:text-orange-600 shrink-0 font-bold">
              ← {lesson.courseTitle}
            </Link>
            <span className="text-black font-bold shrink-0">
              Lesson {lesson.index} of {lesson.totalLessons}
            </span>
          </div>
          <ProgressBar percent={percent} className="mt-2.5" />
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-10 bg-white">
        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Chapter {lesson.chapterPosition} · {lesson.chapterTitle}
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-black">{lesson.title}</h1>
        <p className="mt-2 text-sm text-black font-semibold">{lesson.minutes} min read</p>

        <div className="mt-8 bg-white text-black">
          <Markdown>{lesson.body}</Markdown>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          {lesson.prev ? (
            <Link
              to={`/learn/${slug}/lesson/${lesson.prev.id}`}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-black font-bold hover:bg-slate-100 transition"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <button
            onClick={markComplete}
            disabled={saving}
            className="px-6 py-3 rounded-lg font-bold bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60 transition shadow-md"
          >
            {saving
              ? 'Saving…'
              : lesson.completed
              ? lesson.next
                ? 'Next lesson →'
                : 'Back to course overview'
              : lesson.next
              ? 'Mark complete & continue →'
              : 'Complete course'}
          </button>
        </div>
      </article>
    </main>
  );
};

export default LessonView;
