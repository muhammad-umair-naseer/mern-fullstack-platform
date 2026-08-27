import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import Markdown from '../learn/Markdown';
import ProgressBar from '../learn/ProgressBar';
import TopicQuiz from '../learn/TopicQuiz';
import '../learn/LessonView.css';

const LessonView = () => {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  // A topic is only finished once its quiz is passed; reading is no longer
  // enough, which is what stops a learner clicking straight through.
  const [quizPassed, setQuizPassed] = useState(false);
  const [read, setRead] = useState(false);

  // Presentation only. `pressing` plays the button's press, `acted` records
  // that the learner changed the topic's state during this visit rather than
  // arriving on a topic that was already finished. Neither gates anything.
  const [pressing, setPressing] = useState(false);
  const [acted, setActed] = useState(false);

  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const pressTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const { data } = await api(`/learn/lessons/${lessonId}`);
        if (!cancelled) {
          setLesson(data);
          setQuizPassed(Boolean(data.quizPassed));
          setRead(Boolean(data.completed));
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

  // What both motion effects below key off: the id of the topic whose body is
  // actually on screen, or null while there is nothing rendered to measure. It
  // changes when a different topic is showing, and does not change when the
  // topic's completion flags move underneath it.
  const readingKey = status === 'ready' && lesson?.body ? lessonId : null;

  // The read line. How much of THIS topic's body has passed the bottom of the
  // viewport, written to a custom property that the hairline scales itself by.
  // One rAF per burst of scroll events, nothing measured off the main thread's
  // critical path but a single getBoundingClientRect, and both listeners are
  // removed on unmount.
  useEffect(() => {
    const host = headerRef.current;
    const body = bodyRef.current;
    if (!readingKey || !host || !body) return undefined;

    let frame = 0;

    const write = () => {
      frame = 0;
      const rect = body.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
      const seen = viewport - rect.top;
      const ratio = Math.min(1, Math.max(0, seen / Math.max(rect.height, 1)));
      host.style.setProperty('--cx-lv-read', ratio.toFixed(4));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(write);
    };

    write();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [readingKey]);

  // Prose sections settling in as they are scrolled to.
  //
  // Read the direction of this carefully: every block is fully visible by
  // default, and this effect only *hides* the ones that start below the fold,
  // handing each back at full opacity the first time it is near the viewport.
  // So anything above the fold is visible on mount, a revealed block is never
  // re-hidden, and if this whole effect fails to run the article is simply all
  // there. Nothing a learner needs is gated on an animation firing.
  useEffect(() => {
    const host = bodyRef.current;
    if (!readingKey || !host) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    // Markdown renders a flat run of h2/h3/p/pre/table inside one prose wrapper.
    const prose = host.firstElementChild || host;
    const viewport = window.innerHeight || document.documentElement.clientHeight || 0;
    const blocks = Array.from(prose.children).filter(
      (el) => el.getBoundingClientRect().top > viewport
    );
    if (!blocks.length) return undefined;

    blocks.forEach((el) => el.classList.add('cx-lv-block'));

    // Revealing a block also reveals everything before it. Jumping to the end
    // of the article, dragging the scrollbar, or pressing End moves past the
    // middle blocks without ever rendering a frame in which they intersect, so
    // on their own they would stay hidden for good. Anything above a block the
    // learner has reached has by definition been scrolled past.
    const revealThrough = (index) => {
      for (let i = 0; i <= index; i += 1) {
        const el = blocks[i];
        if (!el || el.classList.contains('is-in')) continue;
        el.classList.add('is-in');
        observer.unobserve(el);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealThrough(blocks.indexOf(entry.target));
        });
      },
      // Positive bottom margin: a block is handed back slightly before it
      // reaches the fold, so a fast scroll lands on text, never on a gap.
      { rootMargin: '0px 0px 12% 0px', threshold: 0 }
    );

    blocks.forEach((el) => observer.observe(el));

    // Last resort. If the observer somehow never fires for a block, the text is
    // handed back anyway a few seconds in. A learner must never be left looking
    // at a gap because an effect did not run.
    const failsafe = window.setTimeout(() => revealThrough(blocks.length - 1), 6000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
      blocks.forEach((el) => el.classList.remove('cx-lv-block', 'is-in'));
    };
  }, [readingKey]);

  useEffect(() => () => window.clearTimeout(pressTimer.current), []);

  // Marking the topic read is what unlocks its quiz.
  const markRead = useCallback(async () => {
    setSaving(true);
    try {
      await api(`/learn/lessons/${lessonId}/complete`, { method: 'POST' });
      setRead(true);
      setLesson((l) => ({ ...l, completed: true }));
    } finally {
      setSaving(false);
    }
  }, [lessonId]);

  // Same call, same result: the press is played immediately so the button
  // answers the click rather than the network.
  const handleRead = useCallback(() => {
    setActed(true);
    setPressing(true);
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => setPressing(false), 280);
    markRead();
  }, [markRead]);

  const goNext = useCallback(() => {
    if (lesson?.next) navigate(`/learn/${slug}/lesson/${lesson.next.id}`);
    else navigate(`/learn/${slug}`);
  }, [lesson, navigate, slug]);

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
  // Which control the footer is showing. Used as a key so a change remounts and
  // replays the swap instead of substituting the text in place.
  const footerState = !read ? 'read' : quizPassed ? 'next' : 'gate';

  return (
    <main className="cx-lv text-black min-h-screen">
      <div ref={headerRef} className="cx-lv-bar sticky top-0 z-40">
        {/* Reading position within this topic. Decorative for a screen reader:
            the course ProgressBar below carries the announced progress. */}
        <div className="cx-lv-read" aria-hidden="true">
          <span className="cx-lv-read-fill" />
        </div>

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

      <article className="cx-lv-sheet">
        <header className="cx-lv-head">
          <p className="cx-lv-in cx-lv-eyebrow" style={{ '--i': 0 }}>
            Chapter {lesson.chapterPosition} · {lesson.chapterTitle}
          </p>
          <h1 className="cx-lv-in cx-lv-title" style={{ '--i': 1 }}>
            {lesson.title}
          </h1>
          <p className="cx-lv-in cx-lv-meta" style={{ '--i': 2 }}>
            <span className="cx-lv-dot" aria-hidden="true" />
            {lesson.minutes} min read
            <span className="cx-lv-sep" aria-hidden="true" />
            Topic {lesson.index} of {lesson.totalLessons}
          </p>
        </header>

        <div ref={bodyRef} className="cx-lv-in cx-lv-body" style={{ '--i': 3 }}>
          <Markdown>{lesson.body}</Markdown>
        </div>

        <div className="cx-lv-foot flex flex-wrap items-center justify-between gap-4">
          {lesson.prev ? (
            <Link
              to={`/learn/${slug}/lesson/${lesson.prev.id}`}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          {/* Keyed on the footer's state so the swap plays. `acted` keeps it to
              changes the learner just made: arriving on a finished topic gets
              the finished control with no animation at all. */}
          <div key={footerState} className={acted ? 'cx-lv-swap' : undefined}>
            {!read ? (
              <button
                onClick={handleRead}
                disabled={saving}
                className={`cx-lv-press px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition${
                  pressing ? ' is-pressing' : ''
                }`}
              >
                {saving ? 'Saving…' : "I've read this →"}
              </button>
            ) : quizPassed ? (
              <button
                onClick={goNext}
                className={`px-6 py-3 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition${
                  acted ? ' cx-lv-celebrate' : ''
                }`}
              >
                {lesson.next ? 'Next topic →' : 'Finish chapter →'}
              </button>
            ) : (
              <span className="text-sm text-amber-700">
                Pass the check below to continue
              </span>
            )}
          </div>
        </div>

        {/* The quiz appears once the topic has been read, and passing it is what
            unlocks the next topic. */}
        {read && (
          <TopicQuiz
            lessonId={lessonId}
            onPassed={() => {
              setActed(true);
              setQuizPassed(true);
            }}
            onContinue={goNext}
            continueLabel={lesson.next ? 'Next topic →' : 'Finish chapter →'}
          />
        )}

      </article>
    </main>
  );
};

export default LessonView;
