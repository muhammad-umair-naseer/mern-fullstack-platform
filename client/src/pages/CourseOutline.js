import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../learn/ProgressBar';

const CourseOutline = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState('loading');
  const [enrolling, setEnrolling] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api(`/learn/courses/${slug}`);
      setCourse(data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const enroll = async () => {
    if (!user) return navigate('/signup', { state: { from: `/learn/${slug}` } });
    setEnrolling(true);
    try {
      await api(`/learn/courses/${slug}/enroll`, { method: 'POST' });
      await load();
    } finally {
      setEnrolling(false);
    }
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
        <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-indigo-400 hover:underline">
          Back to all courses
        </Link>
      </main>
    );
  }

  const progress = course.progress;
  const enrolled = progress?.enrolled;
  const done = new Set(progress?.completedLessonIds || []);

  const gates = progress?.gates;
  const lessonGate = (id) => gates?.lessons?.[id];
  const quizGate = (id) => gates?.quizzes?.[id];

  // Resume at the first lesson that is both unfinished AND unlocked, so the
  // button never points at something the server will refuse.
  const allLessons = course.chapters.flatMap((c) => c.lessons);
  const resumeLesson =
    allLessons.find((l) => !done.has(l.id) && lessonGate(l.id)?.unlocked !== false) ||
    allLessons[0];

  return (
    <main className="text-slate-800">
      <header className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <Link to="/courses" className="text-indigo-100/80 text-sm hover:text-white">
            ← All courses
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-400 text-emerald-950">
              FREE
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15">
              {course.duration}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15">
              {course.level}
            </span>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">{course.title}</h1>
          <p className="mt-3 text-indigo-100/90 max-w-2xl">{course.description || course.summary}</p>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-indigo-100/90">
            <span>{course.chapters.length} chapters</span>
            <span>{allLessons.length} lessons</span>
            <span>~{course.hours}h of reading</span>
            <span>{course.finalCount}-question final exam</span>
          </div>

          {enrolled ? (
            <div className="mt-7 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span>Your progress</span>
                <span className="font-semibold">
                  {progress.completed}/{progress.total} · {progress.percent}%
                </span>
              </div>
              <ProgressBar percent={progress.percent} />
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`/learn/${slug}/lesson/${resumeLesson.id}`}
                  className="px-6 py-3 rounded-full font-semibold bg-white text-indigo-700 hover:bg-indigo-50"
                >
                  {progress.completed === 0 ? 'Start learning' : 'Continue'}
                </Link>
                {progress.gates?.final?.unlocked && !progress.certificate && (
                  <Link
                    to={`/learn/${slug}/final`}
                    className="px-6 py-3 rounded-full font-semibold ring-2 ring-white/80 hover:bg-white hover:text-indigo-700"
                  >
                    Take the final exam
                  </Link>
                )}
                {progress.certificate && (
                  <Link
                    to={`/certificate/${progress.certificate.code}`}
                    className="px-6 py-3 rounded-full font-semibold bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                  >
                    View your certificate
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={enroll}
              disabled={enrolling}
              className="mt-7 px-8 py-3 rounded-full font-semibold bg-white text-indigo-700 shadow-lg hover:bg-indigo-50 disabled:opacity-60"
            >
              {enrolling ? 'Enrolling…' : user ? 'Enrol free' : 'Sign up to start, free'}
            </button>
          )}
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-extrabold text-black mb-6">Course outline</h2>

        <div className="space-y-4">
          {course.chapters.map((ch) => {
            const chDone = ch.lessons.filter((l) => done.has(l.id)).length;
            const chState = gates?.chapters?.find((c) => c.id === ch.id);
            return (
              <article key={ch.id} className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                        Chapter {ch.position}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-black">{ch.title}</h3>
                      {ch.summary && <p className="mt-1 text-black font-medium text-sm leading-relaxed">{ch.summary}</p>}
                    </div>
                    {enrolled && (
                      <span className="shrink-0 text-sm font-bold text-black">
                        {chState && !chState.unlocked ? '🔒 Locked' : `${chDone}/${ch.lessons.length}`}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="divide-y divide-slate-200 bg-white">
                  {ch.lessons.map((l) => {
                    const gate = lessonGate(l.id);
                    const locked = enrolled && gate && !gate.unlocked;
                    const isDone = done.has(l.id);

                    const marker = (
                      <span
                        className={`grid place-items-center h-6 w-6 shrink-0 rounded-full text-xs font-bold ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : locked
                            ? 'bg-slate-200 text-slate-600'
                            : 'border-2 border-orange-500 text-orange-600 font-bold'
                        }`}
                      >
                        {isDone ? '✓' : locked ? '🔒' : l.position}
                      </span>
                    );

                    const body = (
                      <>
                        {marker}
                        <span className={`flex-1 font-semibold ${locked ? 'text-slate-500' : 'text-black'}`}>
                          {l.title}
                        </span>
                        <span className="text-xs text-black font-bold shrink-0">{l.minutes} min</span>
                      </>
                    );

                    if (!enrolled || locked) {
                      return (
                        <li key={l.id}>
                          <div
                            className="flex items-center gap-3 px-6 py-3.5 opacity-70 bg-slate-50/30"
                            title={locked ? gate.reason : undefined}
                          >
                            {body}
                          </div>
                          {locked && (
                            <p className="px-6 pb-3 -mt-1.5 text-xs text-amber-700 font-semibold">{gate.reason}</p>
                          )}
                        </li>
                      );
                    }

                    return (
                      <li key={l.id}>
                        <Link
                          to={`/learn/${slug}/lesson/${l.id}`}
                          className="flex items-center gap-3 px-6 py-3.5 hover:bg-orange-50/50 transition"
                        >
                          {body}
                        </Link>
                      </li>
                    );
                  })}

                  {ch.quizCount > 0 && (() => {
                    const gate = quizGate(ch.id);
                    const locked = enrolled && gate && !gate.unlocked;
                    const passed = gate?.passed;

                    const inner = (
                      <>
                        <span
                          className={`grid place-items-center h-6 w-6 shrink-0 rounded-full text-xs font-bold ${
                            passed
                              ? 'bg-emerald-500 text-white'
                              : locked
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-orange-100 text-orange-700 border border-orange-300'
                          }`}
                        >
                          {passed ? '✓' : locked ? '🔒' : '?'}
                        </span>
                        <span
                          className={`flex-1 font-bold ${
                            locked ? 'text-slate-500' : passed ? 'text-emerald-700' : 'text-orange-700'
                          }`}
                        >
                          Chapter {ch.position} quiz
                          {passed && ' · passed'}
                        </span>
                        <span className="text-xs text-black font-bold shrink-0">
                          {ch.quizCount} questions
                        </span>
                      </>
                    );

                    return (
                      <li key={`quiz-${ch.id}`}>
                        {!enrolled || locked ? (
                          <>
                            <div className="flex items-center gap-3 px-6 py-3.5 opacity-70 bg-slate-50/30">{inner}</div>
                            {locked && (
                              <p className="px-6 pb-3 -mt-1.5 text-xs text-amber-700 font-semibold">{gate.reason}</p>
                            )}
                          </>
                        ) : (
                          <Link
                            to={`/learn/${slug}/quiz/${ch.id}`}
                            className="flex items-center gap-3 px-6 py-3.5 hover:bg-orange-50/50 transition"
                          >
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })()}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-start gap-3">
            <span
              className={`grid place-items-center h-7 w-7 shrink-0 rounded-full text-sm ${
                progress?.certificate
                  ? 'bg-emerald-500 text-white'
                  : gates?.final?.unlocked
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'bg-white/5 text-slate-500'
              }`}
            >
              {progress?.certificate ? '✓' : gates?.final?.unlocked ? '★' : '🔒'}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900">
                Final exam &amp; certificate
              </h3>
              <p className="mt-2 text-slate-600">
                Work through the chapters in order. Each one unlocks when you pass the previous
                chapter&rsquo;s quiz. Clear all {course.chapters.length} chapters to unlock the{' '}
                {course.finalCount}-question final exam. Score 70% or higher and your free
                certificate is issued instantly, with a code anyone can verify. Retakes are
                unlimited.
              </p>

              {enrolled && !gates?.final?.unlocked && (
                <p className="mt-3 text-sm text-amber-300/90">🔒 {gates?.final?.reason}</p>
              )}

              {enrolled && gates?.final?.unlocked && !progress?.certificate && (
                <Link
                  to={`/learn/${slug}/final`}
                  className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                >
                  Take the final exam
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseOutline;
