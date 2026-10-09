import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { api } from '../lib/api';
import Markdown from '../learn/Markdown';
import ProgressBar from '../learn/ProgressBar';
import TopicQuiz from '../learn/TopicQuiz';
import { useClaudeProTracker } from '../hooks/useClaudeProTracker';
import '../learn/LessonView.css';
import { CLAUDE_PRO } from '../learn/ClaudePro';

const LessonView = () => {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const claudeTracker = useClaudeProTracker(slug);

  const [lesson, setLesson] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  // A topic is only finished once its quiz is passed; reading is no longer
  // enough, which is what stops a learner clicking straight through.
  const [quizPassed, setQuizPassed] = useState(false);
  const [read, setRead] = useState(false);
  // Seconds before the topic can be marked read. The server starts the clock
  // when the topic is first opened and refuses an early "I've read this"; this
  // copy only drives the countdown on the button.
  const [waitLeft, setWaitLeft] = useState(0);

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
          setWaitLeft(data.completed ? 0 : data.readSecondsLeft || 0);
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

  // The reading countdown ticks only while the page is in view, so a topic left
  // open in a background tab does not count as read.
  const waiting = status === 'ready' && !read && waitLeft > 0;
  useEffect(() => {
    if (!waiting) return undefined;
    const tick = window.setInterval(() => {
      if (document.visibilityState === 'visible') setWaitLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [waiting]);

  // Marking the topic read is what unlocks its quiz.
  const markRead = useCallback(async () => {
    setSaving(true);
    try {
      await api(`/learn/lessons/${lessonId}/complete`, { method: 'POST' });
      setRead(true);
      setLesson((l) => ({ ...l, completed: true }));
    } catch (err) {
      // The server keeps its own clock; if it says to keep reading, show its count.
      if (err.data?.readSecondsLeft) setWaitLeft(err.data.readSecondsLeft);
      else throw err;
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
      <div className="lx-route-loading" role="status" aria-label="Loading the topic">
        <span />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="cx-lv-error">
        <h1>{error}</h1>
        <Link to={`/learn/${slug}`} className="lx-link">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the course
        </Link>
      </main>
    );
  }

  const percent = Math.round((lesson.index / lesson.totalLessons) * 100);
  // Which control the footer is showing. Used as a key so a change remounts and
  // replays the swap instead of substituting the text in place.
  const footerState = !read ? 'read' : quizPassed ? 'next' : 'gate';

  const pad = (n) => String(n).padStart(2, '0');
  const clock = (s) => `${Math.floor(s / 60)}:${pad(s % 60)}`;
  const nextLabel = lesson.next ? 'Next topic' : 'Finish chapter';

  return (
    <main className="cx-lv">
      <div ref={headerRef} className="cx-lv-bar">
        <div className="cx-lv-bar-inner">
          <Link to={`/learn/${slug}`} className="cx-lv-back">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>{lesson.courseTitle}</span>
          </Link>
          <ProgressBar percent={percent} className="cx-lv-course" />
          <span className="cx-lv-count">
            <span className="visually-hidden">Lesson </span>
            {lesson.index}
            <span className="cx-lv-count-of"> / {lesson.totalLessons}</span>
          </span>
        </div>

        {/* Reading position within this topic. Decorative for a screen reader:
            the course ProgressBar above carries the announced progress. */}
        <div className="cx-lv-read" aria-hidden="true">
          <span className="cx-lv-read-fill" />
        </div>
      </div>

      <article className="cx-lv-sheet">
        <header className="cx-lv-head">
          <span className="lx-label cx-lv-in cx-lv-eyebrow" style={{ '--i': 0 }}>
            <span className="lx-label-num">Chapter {pad(lesson.chapterPosition)}</span>
            <span className="cx-lv-chapter">{lesson.chapterTitle}</span>
          </span>
          <h1 className="cx-lv-title" aria-label={lesson.title}>
            <span className="lx-line" aria-hidden="true" style={{ '--i': 0 }}>
              <span>{lesson.title}</span>
            </span>
          </h1>
          <p className="cx-lv-in cx-lv-meta" style={{ '--i': 3 }}>
            <span>{lesson.minutes} min read</span>
            <span className="cx-lv-sep" aria-hidden="true" />
            <span>
              Topic {lesson.index} of {lesson.totalLessons}
            </span>
            <span className="cx-lv-sep" aria-hidden="true" />
            <span
              className="cx-lv-claude-pill"
              title="Your active study time is saved in real time for Claude Pro selection"
            >
              <span className="cx-lv-claude-dot" aria-hidden="true" />
              <span>
                Claude Pro:{' '}
                {CLAUDE_PRO[claudeTracker.status]
                  ? CLAUDE_PRO[claudeTracker.status].short
                  : claudeTracker.timeSpentMinutes > 0
                  ? `${claudeTracker.timeSpentMinutes}m tracked`
                  : 'Time tracking active'}
              </span>
            </span>
            {quizPassed && (
              <span className="cx-lv-done">
                <Check size={12} aria-hidden="true" /> Finished
              </span>
            )}
          </p>
        </header>

        <div ref={bodyRef} className="cx-lv-in cx-lv-body" style={{ '--i': 4 }}>
          <Markdown>{lesson.body}</Markdown>
        </div>

        <div className="cx-lv-foot">
          {lesson.prev ? (
            <Link to={`/learn/${slug}/lesson/${lesson.prev.id}`} className="btn lx-btn-ghost cx-lv-prev">
              <ArrowLeft size={15} aria-hidden="true" />
              Previous
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
                type="button"
                onClick={handleRead}
                disabled={saving || waitLeft > 0}
                className={`btn lx-btn cx-lv-press${pressing ? ' is-pressing' : ''}`}
              >
                {waitLeft > 0 ? `Quiz unlocks in ${clock(waitLeft)}` : saving ? 'Saving…' : "I've read this"}
                <span className="lx-btn-disc" aria-hidden="true">
                  <Check size={15} />
                </span>
              </button>
            ) : quizPassed ? (
              <button
                type="button"
                onClick={goNext}
                className={`btn lx-btn cx-lv-next${acted ? ' cx-lv-celebrate' : ''}`}
              >
                {nextLabel}
                <span className="lx-btn-disc" aria-hidden="true">
                  <ArrowRight size={15} />
                </span>
              </button>
            ) : (
              <span className="cx-lv-gate">
                Pass the check below to continue
                <ArrowDown size={14} aria-hidden="true" />
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
            continueLabel={nextLabel}
          />
        )}
      </article>
    </main>
  );
};

export default LessonView;
