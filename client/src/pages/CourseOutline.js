import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Award, Check, Lock } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../learn/ProgressBar';
import '../learn/CourseOutline.css';
import PageHero from '../components/PageHero';
import CourseOutlineVisual from '../components/heroes/CourseOutlineVisual';
import { courseCover } from '../data/courseCovers';
import { photos } from '../assets/lux';
import Seo from '../seo/Seo';
import { course as courseSchema, breadcrumbs, hostedArticle } from '../seo/schema';
import { ClaudeProPill } from '../learn/ClaudePro';
import { POSTS } from '../data/blog.generated';
import ServiceArticle from '../components/ServiceArticle';
import CourseSnapshot from '../components/learn/CourseSnapshot';
import { parseBlogContent } from '../lib/blogParser';

const pad = (n) => String(n).padStart(2, '0');

// Every course has its own photograph; one added before its photo gets the
// house photograph of a student at a sunlit table.
const coverOf = (course) => courseCover(course.slug) || courseCover(course.coverKey) || photos.learning;

// Words a headline line should never end on, and the ones that introduce the
// italic phrase ("Data Science with *Python*").
const HANGS = /^(&|and|with|for|of|to|the|a|an|in|on)$/i;
const LEADS = /^(&|and|with|for)$/i;

/**
 * The course's own title as the headline, set in two or three lines with its
 * last phrase in the italic.
 *
 * The italic is the parenthesis if there is one ("Graphic Designing
 * *(Photoshop + Illustrator)*"), else whatever follows the last "&", "and",
 * "with" or "for" when that is a word or two ("Java & *Spring Boot*"), else
 * the last word. Lines are chosen to keep the longest one short: no line ends
 * on a small word, a colon always ends one, and the italic is kept whole
 * unless splitting it saves a good deal of width. Returns the lines and the
 * longest line's length, which sizes the type.
 */
const headline = (title) => {
  const words = String(title).trim().split(/\s+/);
  const n = words.length;
  if (n === 1) return { lines: [<em>{words[0]}</em>], chars: words[0].length };

  let em = n - 1;
  const paren = words.findIndex((w) => w.startsWith('('));
  if (paren > 0) {
    em = paren;
  } else {
    for (let i = n - 2; i > 0; i -= 1) {
      if (LEADS.test(words[i])) {
        if (n - 1 - i <= 2) em = i + 1;
        break;
      }
    }
  }

  const width = (a, b) => words.slice(a, b).join(' ').length;
  const measure = (cuts) => {
    let longest = 0;
    let cost = 0;
    for (let j = 0; j < cuts.length - 1; j += 1) {
      const a = cuts[j];
      const b = cuts[j + 1];
      longest = Math.max(longest, width(a, b));
      if (j < cuts.length - 2 && HANGS.test(words[b - 1])) cost += 50;
      // "(Photoshop +" reads better than a line that opens on the plus.
      if (/^[+/]$/.test(words[a])) cost += 1;
      // "Digital Marketing / & SEO": the phrase before the italic breaks at
      // its "&" or "with" rather than carrying it mid-line.
      for (let w = a + 1; w < b; w += 1) if (LEADS.test(words[w])) cost += 5;
      for (let w = a; w < b - 1; w += 1) if (/:$/.test(words[w])) cost += 50;
      if (b > em && b < n && j < cuts.length - 2) cost += 4;
    }
    return { cuts, longest, score: longest + cost };
  };

  const best = (layouts) => layouts.map(measure).sort((x, y) => x.score - y.score)[0];
  const two = [];
  const three = [];
  for (let a = 1; a < n; a += 1) {
    two.push([0, a, n]);
    for (let b = a + 1; b < n; b += 1) three.push([0, a, b, n]);
  }
  const pick2 = best(two);
  const pick3 = three.length ? best(three) : null;
  const pick = pick2.score <= 17 || !pick3 || pick2.score <= pick3.score ? pick2 : pick3;

  const lines = [];
  for (let j = 0; j < pick.cuts.length - 1; j += 1) {
    const a = pick.cuts[j];
    const b = pick.cuts[j + 1];
    const plain = words.slice(a, Math.max(a, Math.min(b, em))).join(' ');
    const italic = words.slice(Math.max(a, em), b).join(' ');
    lines.push(
      <>
        {plain}
        {plain && italic ? ' ' : ''}
        {italic ? <em>{italic}</em> : null}
      </>
    );
  }
  return { lines, chars: pick.longest };
};

/**
 * A lede of a dozen words at most: the summary's opening clause when it is
 * that short, otherwise the plain facts.
 */
const ledeOf = (course) => {
  let head = String(course.summary || '')
    .split(/\s+[—–]\s+|:\s|;\s|\.\s|,\s(?=(?:then|so|but)\s)/)[0]
    .replace(/[.,;:\s]+$/, '');
  // ", and" ends the clause only when it is not closing a list: "Learn to
  // build, evaluate, and distrust models" must not become "build, evaluate."
  const and = head.search(/,\s(?=and\s)/);
  if (and > -1 && !head.slice(0, and).includes(',')) head = head.slice(0, and);
  const count = head.split(/\s+/).filter(Boolean).length;
  if (count >= 4 && count <= 12) return `${head}.`;
  return `${course.chapters.length} free chapters and a certificate anyone can verify.`;
};

/**
 * Counts from zero up to `target` once, then stays there.
 *
 * The outline is where a learner lands after a week away, and watching the
 * number climb to where they got to reads as progress in a way a pre-filled
 * figure does not. It always lands exactly on the real value, and under reduced
 * motion it simply is the real value from the first frame.
 */
const useCountUp = (target, ms = 700) => {
  const [n, setN] = useState(target);

  useEffect(() => {
    if (typeof target !== 'number' || Number.isNaN(target)) return undefined;
    const still =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || target <= 0) {
      setN(target);
      return undefined;
    }

    let raf;
    const started = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - started) / ms);
      // Same deceleration as --cx-ease-out, so it stops the way everything else does.
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return n;
};

const CourseOutline = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState('loading');
  const [enrolling, setEnrolling] = useState(false);
  // Chapters a reader has opened or closed by hand; the rest follow the
  // default (only the chapter they are in, or the first).
  const [opened, setOpened] = useState({});
  const listRef = useRef(null);

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

  // Chapter cards cascade their rows in as each card is scrolled to.
  //
  // Read the direction of this: a row is fully visible by default and the
  // animation only applies once `is-revealed` is on its card. So if this effect
  // never runs, the outline is simply all there. Nothing a learner needs is
  // gated on an animation firing.
  useEffect(() => {
    const host = listRef.current;
    if (status !== 'ready' || !host) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const cards = Array.from(host.querySelectorAll('.cx-co-chapter'));
    if (!cards.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [status, course]);

  const shownPercent = useCountUp(course?.progress?.percent ?? 0);

  // A locked row refusing, once. Handled here rather than per row so the
  // outline does not carry twelve chapters' worth of handlers.
  const refuse = useCallback((event) => {
    const row = event.currentTarget;
    row.classList.remove('is-nudging');
    // Force a reflow, otherwise re-adding the class in the same frame is a no-op.
    void row.offsetWidth;
    row.classList.add('is-nudging');
    window.setTimeout(() => row.classList.remove('is-nudging'), 500);
  }, []);

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
      <div className="lx-route-loading" role="status" aria-label="Loading the course">
        <span />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen">
        <Seo title="Course not found" description="That course is not in the library." path={`/learn/${slug}`} noindex />
        <PageHero
          align="center"
          lines={['That course', <em key="em">is not here.</em>]}
          actions={[{ to: '/courses', label: 'See all free courses', primary: true }]}
        />
      </main>
    );
  }

  const progress = course.progress;
  const enrolled = progress?.enrolled;
  // `completedLessonIds` now means finished, not merely opened: a topic only
  // lands here once its own quiz is passed.
  const done = new Set(progress?.completedLessonIds || []);

  const gates = progress?.gates;
  const lessonGate = (id) => gates?.lessons?.[id];
  const quizGate = (id) => gates?.quizzes?.[id];

  // The final exam: one attempt, and one retake 30 days after a fail
  // (server/src/services/finalExam.service.js).
  const final = progress?.final;
  const examRules = final?.rules ?? { questions: 50, totalMarks: 100, passMarks: 50, minutes: 60, retakeAfterDays: 30 };
  const canTakeFinal =
    Boolean(enrolled && gates?.final?.unlocked && !progress?.certificate) &&
    (!final || final.state === 'ready' || final.state === 'retake');
  const examNote =
    final?.state === 'waiting'
      ? `Your retake opens on ${new Date(final.retakeAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`
      : final?.state === 'exhausted'
      ? 'Both attempts have been used.'
      : `One attempt, ${examRules.minutes} minutes. If you don't pass, you can retake once after ${examRules.retakeAfterDays} days.`;

  // Resume at the first lesson that is both unfinished AND unlocked, so the
  // button never points at something the server will refuse.
  const allLessons = course.chapters.flatMap((c) => c.lessons);
  const resumeLesson =
    allLessons.find((l) => !done.has(l.id) && lessonGate(l.id)?.unlocked !== false) ||
    allLessons[0];

  // The hero card's route: each chapter cleared or not, how far into it the
  // learner is, and which row they are on (a chapter, then the final, then
  // the certificate).
  const route = course.chapters.map((ch) => {
    const finished = ch.lessons.filter((l) => done.has(l.id)).length;
    const quizPassed = !(ch.quizCount > 0) || !!quizGate(ch.id)?.passed;
    return {
      title: ch.title,
      done: enrolled && ch.lessons.length > 0 && finished === ch.lessons.length && quizPassed,
      fraction: ch.lessons.length ? finished / ch.lessons.length : 0,
    };
  });
  const firstOpen = route.findIndex((r) => !r.done);
  const routeAt = progress?.certificate
    ? route.length + 1
    : firstOpen === -1
    ? route.length
    : firstOpen;

  const { lines, chars } = headline(course.title);
  // This course's guide: a blog post whose home is this page. It is read in
  // full at the bottom, and /blog/<its slug> redirects here.
  const guide = POSTS.find((p) => p.home === `/learn/${slug}`);

  // One chapter starts open: the one holding the learner's next topic, or
  // the first. The rest are a scannable list of twelve titles.
  const startId =
    (enrolled && course.chapters.find((c) => c.lessons.some((l) => l.id === resumeLesson?.id))?.id) ||
    course.chapters[0]?.id;
  const isOpen = (id) => opened[id] ?? id === startId;
  const allOpen = course.chapters.every((c) => isOpen(c.id));

  return (
    <main className="text-ink-2">
      <Seo
        title={course.title}
        description={
          // The course's own summary is written for a human and is the right
          // length for a result snippet, so it beats anything generic.
          course.summary ||
          `${course.title}: ${course.chapters.length} chapters, free, with a certificate.`
        }
        path={`/learn/${slug}`}
        schema={[
          courseSchema(course),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Courses', path: '/courses' },
            { name: course.title, path: `/learn/${slug}` },
          ]),
          ...(guide ? hostedArticle(guide, `/learn/${slug}`, parseBlogContent(guide.body).faqs) : []),
        ]}
      />

      {/* Keyed by course: a related-course link keeps this route mounted, and
          without the key the next course would inherit the tour's step and
          skip its own entrance. */}
      <div className="lx-co-hero" key={course.slug} style={{ '--co-chars': chars }}>
        <PageHero
          back={{ to: '/courses', label: 'All courses' }}
          label={course.category}
          lines={lines}
          lede={ledeOf(course)}
          meta={['Free', course.duration, course.level].filter(Boolean)}
          visual={
            <CourseOutlineVisual
              photo={coverOf(course)}
              chapters={route}
              mode={enrolled ? 'progress' : 'tour'}
              current={routeAt}
              certified={!!progress?.certificate}
              note={
                enrolled
                  ? `${progress.completed}/${progress.total} topics`
                  : `${allLessons.length} topics · ~${course.hours}h`
              }
            />
          }
        >
          {enrolled ? (
            <>
              <div className="lx-co-progress">
                <div className="flex justify-between font-mono text-xs text-ink-3 mb-2.5">
                  <span>Your progress</span>
                  <span className="cx-co-percent text-ink">
                    {progress.completed}/{progress.total} · {shownPercent}%
                  </span>
                </div>
                <ProgressBar percent={progress.percent} />
              </div>
              <div className="lx-ph-actions">
                <Link to={`/learn/${slug}/lesson/${resumeLesson.id}`} className="btn lx-btn">
                  {progress.completed === 0
                    ? 'Start learning'
                    : progress.completed >= progress.total
                    ? 'Review the course'
                    : 'Continue'}
                  <span className="lx-btn-disc" aria-hidden="true">
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
                {canTakeFinal && (
                  <Link to={`/learn/${slug}/final`} className="lx-link">
                    {final?.state === 'retake' ? 'Take your retake' : 'Take the final exam'}{' '}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
                {progress.certificate && (
                  <>
                    <Link to={`/certificate/${progress.certificate.code}`} className="lx-link">
                      View your certificate <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <ClaudeProPill status={progress.claudePro} />
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="lx-ph-actions">
              <button type="button" onClick={enroll} disabled={enrolling} className="btn lx-btn disabled:opacity-60">
                {enrolling ? 'Enrolling…' : user ? 'Enrol free' : 'Sign up to start, free'}
                <span className="lx-btn-disc" aria-hidden="true">
                  <ArrowUpRight size={15} />
                </span>
              </button>
              <a href="#syllabus" className="lx-link">
                See the outline <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
          {guide && (
            <p className="lx-co-guide text-sm">
              <a href={`#${guide.slug}`} className="lx-link">
                Read the guide: {guide.title} <ArrowRight size={14} aria-hidden="true" />
              </a>
            </p>
          )}
        </PageHero>
      </div>

      <section id="syllabus" className="max-w-5xl mx-auto px-6 pb-16 md:pb-24" aria-labelledby="syllabus-heading">
        {/* AEO & GEO Structured Answer Snapshot */}
        <CourseSnapshot course={course} lessonsCount={allLessons.length} />

        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 mb-8 md:mb-12">
          <div>
            <span className="lx-label">
              <span className="lx-label-num tabular">{pad(course.chapters.length)}</span>
              Chapters
            </span>
            <h2 id="syllabus-heading" className="lx-h2 mt-5 mb-0">
              Course <em>outline</em>
            </h2>
          </div>
          <button
            type="button"
            className="lx-link md:mb-2"
            aria-controls={course.chapters.map((c) => `co-ch-${c.id}`).join(' ')}
            onClick={() => {
              const next = !allOpen;
              setOpened(Object.fromEntries(course.chapters.map((c) => [c.id, next])));
            }}
          >
            {allOpen ? 'Fold every chapter' : 'Open every chapter'}
          </button>
        </div>

        <div ref={listRef} className="space-y-4">
          {course.chapters.map((ch) => {
            const chDone = ch.lessons.filter((l) => done.has(l.id)).length;
            const chState = gates?.chapters?.find((c) => c.id === ch.id);
            const chLocked = chState && !chState.unlocked;
            const chMinutes = ch.lessons.reduce((n, l) => n + (l.minutes || 0), 0);
            const open = isOpen(ch.id);
            return (
              <article key={ch.id} className={`cx-co-chapter cx-co-card${open ? ' is-open' : ''}`}>
                <h3 className="m-0">
                  <button
                    type="button"
                    className="cx-co-head"
                    aria-expanded={open}
                    aria-controls={`co-ch-${ch.id}`}
                    onClick={() => setOpened((o) => ({ ...o, [ch.id]: !open }))}
                  >
                    <span aria-hidden="true" className="cx-co-num tabular">
                      {pad(ch.position)}
                    </span>
                    <span className="cx-co-title">
                      <span className="visually-hidden">Chapter {ch.position}: </span>
                      {ch.title}
                    </span>
                    <span className="cx-co-facts tabular">
                      {enrolled ? (
                        chLocked ? (
                          <>
                            <Lock size={13} aria-hidden="true" /> Locked
                          </>
                        ) : (
                          `${chDone}/${ch.lessons.length}`
                        )
                      ) : (
                        <>
                          {ch.lessons.length} topics
                          <span className="cx-co-mins"> · {chMinutes} min</span>
                        </>
                      )}
                    </span>
                    <span className="cx-co-plus" aria-hidden="true" />
                  </button>
                </h3>

                <div id={`co-ch-${ch.id}`} className="cx-co-panel" hidden={!open}>
                  {ch.summary && <p className="cx-co-summary">{ch.summary}</p>}
                <ul className="divide-y divide-[color:var(--line)]">
                  {ch.lessons.map((l, li) => {
                    const gate = lessonGate(l.id);
                    const locked = enrolled && gate && !gate.unlocked;
                    const isDone = done.has(l.id);
                    // Read but the topic check is still owed. Worth calling out,
                    // because this is what holds the next topic shut.
                    const quizOwed = enrolled && !isDone && gate?.read && gate?.quizQuestionCount > 0;

                    // Exactly one row on the page is where the learner resumes, and it
                    // is the same lesson the Continue button points at.
                    const isResume = enrolled && !locked && l.id === resumeLesson?.id && !isDone;

                    const marker = (
                      <span
                        className={`cx-co-mark ${isDone ? 'is-done' : ''} grid place-items-center h-6 w-6 shrink-0 rounded-full text-[11px] font-mono ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : quizOwed
                            ? 'bg-amber-100 text-amber-700 border border-amber-400'
                            : locked
                            ? 'bg-slate-100 text-ink-3'
                            : 'border border-orange-600 text-orange-600'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <Check size={13} strokeWidth={2.6} aria-hidden="true" />
                            <span className="visually-hidden">Done</span>
                          </>
                        ) : quizOwed ? (
                          '?'
                        ) : locked ? (
                          <>
                            <Lock size={11} aria-hidden="true" />
                            <span className="visually-hidden">Locked</span>
                          </>
                        ) : (
                          l.position
                        )}
                      </span>
                    );

                    const body = (
                      <>
                        {marker}
                        <span className={`flex-1 min-w-0 font-medium ${locked ? 'text-ink-3' : 'text-ink'}`}>
                          {l.title}
                          {quizOwed && (
                            <span className="cx-co-pending ml-2 align-middle font-mono text-[11px] text-amber-700">
                              quiz pending
                            </span>
                          )}
                        </span>
                        {enrolled && gate?.quizQuestionCount > 0 && (
                          <span className="font-mono text-[11px] shrink-0 text-ink-3">
                            {gate.quizQuestionCount}Q
                          </span>
                        )}
                        {isResume && <span className="cx-co-resume-tag">resume here</span>}
                        <span className="font-mono text-xs text-ink-3 shrink-0 tabular">{l.minutes} min</span>
                      </>
                    );

                    if (!enrolled || locked) {
                      return (
                        <li key={l.id} className="cx-co-row" style={{ '--i': li }}>
                          <div
                            className={`flex items-center gap-3 px-6 md:px-7 py-3.5 ${locked ? 'cx-co-locked opacity-70' : ''}`}
                            title={locked ? gate.reason : undefined}
                            onClick={locked ? refuse : undefined}
                          >
                            {body}
                          </div>
                          {locked && (
                            <p className="px-6 md:px-7 pb-3 -mt-1.5 mb-0 text-xs text-amber-700 font-medium">{gate.reason}</p>
                          )}
                        </li>
                      );
                    }

                    return (
                      <li
                        key={l.id}
                        className={`cx-co-row ${isResume ? 'cx-co-resume' : ''}`}
                        style={{ '--i': li }}
                      >
                        <Link
                          to={`/learn/${slug}/lesson/${l.id}`}
                          className="flex items-center gap-3 px-6 md:px-7 py-3.5 hover:bg-orange-50/60 transition-colors"
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
                          className={`grid place-items-center h-6 w-6 shrink-0 rounded-full text-xs font-mono ${
                            passed
                              ? 'bg-emerald-500 text-white'
                              : locked
                              ? 'bg-slate-100 text-ink-3'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {passed ? (
                            <>
                              <Check size={13} strokeWidth={2.6} aria-hidden="true" />
                              <span className="visually-hidden">Passed</span>
                            </>
                          ) : locked ? (
                            <>
                              <Lock size={11} aria-hidden="true" />
                              <span className="visually-hidden">Locked</span>
                            </>
                          ) : (
                            '?'
                          )}
                        </span>
                        <span
                          className={`flex-1 font-semibold ${
                            locked ? 'text-ink-3' : passed ? 'text-emerald-700' : 'text-orange-700'
                          }`}
                        >
                          Chapter {ch.position} quiz
                          {passed && ' · passed'}
                        </span>
                        <span className="font-mono text-xs text-ink-3 shrink-0">
                          {ch.quizCount} questions
                        </span>
                      </>
                    );

                    return (
                      <li key={`quiz-${ch.id}`} className="cx-co-row" style={{ '--i': ch.lessons.length }}>
                        {!enrolled || locked ? (
                          <>
                            <div className={`flex items-center gap-3 px-6 md:px-7 py-3.5 ${locked ? 'opacity-70' : ''}`}>
                              {inner}
                            </div>
                            {locked && (
                              <p className="px-6 md:px-7 pb-3 -mt-1.5 mb-0 text-xs text-amber-700 font-medium">{gate.reason}</p>
                            )}
                          </>
                        ) : (
                          <Link
                            to={`/learn/${slug}/quiz/${ch.id}`}
                            className="flex items-center gap-3 px-6 md:px-7 py-3.5 hover:bg-orange-50/60 transition-colors"
                          >
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })()}
                </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* The end of the route, shown as the four gates rather than a
            paragraph describing them. */}
        <div className="mt-8 cx-co-card p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="mb-0 flex items-center gap-3 text-xl font-semibold text-ink">
              <span
                className={`grid place-items-center h-9 w-9 shrink-0 rounded-full ${
                  progress?.certificate
                    ? 'bg-emerald-500 text-white'
                    : gates?.final?.unlocked
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {progress?.certificate ? (
                  <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                ) : gates?.final?.unlocked || !enrolled ? (
                  <Award size={17} strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <Lock size={15} aria-hidden="true" />
                )}
              </span>
              Final exam &amp; certificate
            </h3>

            {canTakeFinal && (
              <Link to={`/learn/${slug}/final`} className="btn lx-btn">
                {final?.state === 'retake' ? 'Take your retake' : 'Take the final exam'}
                <span className="lx-btn-disc" aria-hidden="true">
                  <ArrowUpRight size={15} />
                </span>
              </Link>
            )}
          </div>

          <ol className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--line)]">
            {[
              ['Topic checks', 'Each one opens the next topic'],
              ['Chapter quizzes', 'Each one opens the next chapter'],
              [`${examRules.questions}-question final`, `${examRules.passMarks} of ${examRules.totalMarks} marks to pass`],
              ['Certificate', 'Issued instantly, verifiable'],
            ].map(([title, sub], i) => (
              <li key={title} className="bg-ivory/90 p-4 md:p-5">
                <span className="font-mono text-xs text-[color:var(--copper)] tabular">{pad(i + 1)}</span>
                <p className="mt-2 mb-0 font-semibold text-ink leading-snug">{title}</p>
                <p className="mt-1 mb-0 text-sm text-ink-3 leading-snug">{sub}</p>
              </li>
            ))}
          </ol>

          <p className="mt-4 mb-0 font-mono text-xs text-ink-3">{examNote}</p>

          {enrolled && !gates?.final?.unlocked && gates?.final?.reason && (
            <p className="mt-3 mb-0 inline-flex items-center gap-2 text-sm text-amber-700 font-medium">
              <Lock size={14} aria-hidden="true" /> {gates.final.reason}
            </p>
          )}
        </div>
      </section>

      {/* Where a reader goes next.
          Also the link graph: without this every course page is a dead end
          that only points back to the catalogue, so a crawler reaches each one
          by a single route and reads 23 shallow pages rather than a connected
          library. */}
      {course.related?.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-10 md:pb-14" aria-labelledby="related-heading">
          <span className="lx-label">Next</span>
          <h2 id="related-heading" className="lx-h2 mt-5 mb-0">
            Continue <em>with</em>
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {course.related.map((r) => {
              const cover = courseCover(r.slug);
              return (
                <Link
                  key={r.slug}
                  to={`/learn/${r.slug}`}
                  className="group block overflow-hidden cx-co-card cx-co-related"
                >
                  {cover && (
                    <span className="lx-frame block aspect-[16/9]">
                      <img
                        src={cover.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="group-hover:scale-[1.04]"
                      />
                    </span>
                  )}
                  <span className="block p-5 md:p-6">
                    <span className="block font-mono text-xs text-[color:var(--copper)]">{r.category}</span>
                    <span className="mt-2 block font-display text-3xl leading-tight text-ink">
                      {r.title}
                    </span>
                    <span className="mt-4 flex items-center justify-between font-mono text-xs text-ink-3">
                      <span>
                        {r.level} · {r.duration}
                      </span>
                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className="text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link to="/courses" className="lx-link">
              Browse all free courses <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/internships" className="lx-link">
              Apply for an internship <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/services" className="lx-link">
              Hire us to build something <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {guide && <ServiceArticle post={guide} label="The course guide" />}
    </main>
  );
};

export default CourseOutline;
