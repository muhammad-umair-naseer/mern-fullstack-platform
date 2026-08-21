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
        <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{error}</h1>
        <Link to={`/learn/${slug}`} className="mt-4 inline-block text-indigo-400 hover:underline">
          Back to the course
        </Link>
      </main>
    );
  }

  const percent = Math.round((lesson.index / lesson.totalLessons) * 100);

  return (
    <main className="text-slate-800">
      <div className="sticky top-0 z-40 bg-[#0b0e18]/85 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4 text-sm">
            <Link to={`/learn/${slug}`} className="text-slate-400 hover:text-white shrink-0">
              ← {lesson.courseTitle}
            </Link>
            <span className="text-slate-500 shrink-0">
              Lesson {lesson.index} of {lesson.totalLessons}
            </span>
          </div>
          <ProgressBar percent={percent} className="mt-2.5" />
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
          Chapter {lesson.chapterPosition} · {lesson.chapterTitle}
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">{lesson.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{lesson.minutes} min read</p>

        <div className="mt-8">
          <Markdown>{lesson.body}</Markdown>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {lesson.prev ? (
            <Link
              to={`/learn/${slug}/lesson/${lesson.prev.id}`}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white/5 transition"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <button
            onClick={markComplete}
            disabled={saving}
            className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {saving
              ? 'Saving…'
              : lesson.completed
              ? lesson.next
                ? 'Next lesson →'
                : 'Finish course →'
              : lesson.next
              ? 'Mark complete & continue →'
              : 'Mark complete & finish →'}
          </button>
        </div>
      </article>
    </main>
  );
};

export default LessonView;
