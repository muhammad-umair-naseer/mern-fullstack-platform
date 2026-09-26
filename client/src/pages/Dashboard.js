import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../learn/ProgressBar';
import PhotoVisual from '../components/PhotoVisual';
import useCountUp from '../learn/useCountUp';
import { learnPhotos } from '../learn/photos';
import { courseCover } from '../data/courseCovers';
// PhotoVisual's frame, drift and chips are styled alongside PageHero.
import '../components/PageHero.css';
import '../learn/Learn.css';

// A long list should not take a minute to arrive, so the stagger stops
// compounding after the first screenful.
const STAGGER_CAP = 8;

// The course's initials: the cover for a course that has no photograph yet.
const initials = (title = '') =>
  title
    .replace(/[^A-Za-z0-9 &+#]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !/^(the|and|for|with|of|to|a|an|&)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

// Presentation only: which of four states a course is in, and how to say it.
// 100% of topics does not by itself open the final exam (the last chapter quiz
// may still be unpassed, and /learn/my does not report the exam gate), so that
// state says what is known rather than promising the exam is open.
const statusOf = (c) => {
  if (c.certificate) return { key: 'certified', label: `Certified · ${c.certificate.score}%` };
  if (c.percent === 100) return { key: 'ready', label: 'All topics done' };
  if (c.percent > 0) return { key: 'active', label: 'In progress' };
  return { key: 'new', label: 'Not started' };
};

const Stat = ({ value, label, delay }) => {
  const shown = useCountUp(value, { delay });
  return (
    <div className="lp-stat">
      <span className="lp-stat-value" aria-hidden="true">
        {shown}
      </span>
      <span className="lp-stat-label" aria-hidden="true">
        {label}
      </span>
      <span className="visually-hidden">
        {value} {label}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api('/learn/my');
        if (!cancelled) {
          setCourses(data);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = user?.name?.split(' ')[0];

  // Totals for the hero. Derived from what /learn/my already returns.
  const totals = useMemo(() => {
    const done = courses.reduce((n, c) => n + (c.completed || 0), 0);
    const all = courses.reduce((n, c) => n + (c.total || 0), 0);
    return {
      courses: courses.length,
      topics: done,
      certificates: courses.filter((c) => c.certificate).length,
      overall: all ? Math.round((done / all) * 100) : 0,
    };
  }, [courses]);

  const hasCourses = status === 'ready' && courses.length > 0;
  const isEmpty = status === 'ready' && courses.length === 0;

  return (
    <main className="lp">
      <div className="lp-wrap">
        <header className="lp-hero">
          <div className="lp-hero-copy">
            <span className="lx-label lp-label">
              <span className="lx-label-num">01</span>
              My learning
            </span>

            <h1 className="lp-title" aria-label={`Welcome back${firstName ? `, ${firstName}` : ''}.`}>
              <span className="lx-line" aria-hidden="true" style={{ '--i': 0 }}>
                <span>Welcome back{firstName ? ',' : '.'}</span>
              </span>
              {firstName && (
                <span className="lx-line" aria-hidden="true" style={{ '--i': 1 }}>
                  <span>
                    <em>{firstName}.</em>
                  </span>
                </span>
              )}
            </h1>

            <p className="lp-lede">
              {isEmpty
                ? 'Every course is free, and so is the certificate.'
                : 'Pick up exactly where you left off.'}
            </p>

            {hasCourses && (
              <div className="lp-stats">
                <Stat value={totals.courses} label={totals.courses === 1 ? 'course' : 'courses'} delay={650} />
                <Stat value={totals.topics} label="topics done" delay={760} />
                <Stat
                  value={totals.certificates}
                  label={totals.certificates === 1 ? 'certificate' : 'certificates'}
                  delay={870}
                />
              </div>
            )}
          </div>

          <div className="lp-hero-visual">
            <PhotoVisual
              photo={learnPhotos.dashboard}
              ratio="5 / 4"
              chips={hasCourses ? [{ value: `${totals.overall}%`, label: 'overall progress' }] : []}
            />
          </div>
        </header>

        {status === 'loading' && (
          <div className="lp-state lx-route-loading" role="status" aria-label="Loading your courses">
            <span />
          </div>
        )}

        {status === 'error' && (
          <p className="cx-anim-rise lp-state">Could not load your courses. Please refresh.</p>
        )}

        {isEmpty && (
          <div className="cx-anim-card lp-glass lp-empty">
            <h2 className="lp-empty-title">Nothing enrolled yet.</h2>
            <p>Choose a course and your progress will live here.</p>
            <Link to="/courses" className="btn lx-btn">
              Browse courses
              <span className="lx-btn-disc" aria-hidden="true">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
        )}

        {hasCourses && (
          <section aria-labelledby="lp-courses-heading">
            <div className="lp-section-head">
              <h2 id="lp-courses-heading" className="lp-section-title">
                Your courses
              </h2>
              <span className="lp-section-count">{courses.length} enrolled</span>
            </div>

            <ul className="lp-courses">
              {courses.map((c, index) => {
                // Presentation only — it changes nothing about what is fetched
                // or where anything links.
                const state = statusOf(c);
                const step = String(Math.min(index, STAGGER_CAP));
                // The same photograph the course wears in the catalogue, so a
                // learner recognises it at a glance.
                const cover = courseCover(c.slug);

                return (
                  <li
                    key={c.id}
                    // --i places the card in the stagger, and is inherited by
                    // the progress bar inside it so the two arrive together.
                    style={{ '--i': step }}
                    className="lp-course lp-glass cx-anim-card cx-contain"
                  >
                    <div className={`lp-cover${cover ? ' has-photo' : ''}`} aria-hidden="true">
                      {cover ? (
                        <img src={cover.src} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span className="lp-cover-mark">{initials(c.title)}</span>
                      )}
                    </div>

                    <div className="lp-course-info">
                      <h3 className="lp-course-title">{c.title}</h3>
                      <div className="lp-course-meta">
                        <span className={`lp-status is-${state.key}`}>
                          <span className="lp-status-dot" aria-hidden="true" />
                          {state.label}
                        </span>
                        <span>
                          {c.category} · {c.duration}
                        </span>
                      </div>
                    </div>

                    <div className="lp-course-progress">
                      <div className="lp-course-numbers">
                        <span className="lp-course-percent">{c.percent}%</span>
                        <span className="lp-course-count">
                          {c.completed} of {c.total} topics
                        </span>
                      </div>
                      <ProgressBar percent={c.percent} />
                    </div>

                    <div className="lp-course-actions">
                      <Link to={`/learn/${c.slug}`} className="btn lx-btn">
                        {c.percent === 100
                          ? 'Review course'
                          : c.percent === 0
                          ? 'Start course'
                          : 'Continue learning'}
                        <span className="lx-btn-disc" aria-hidden="true">
                          <ArrowUpRight size={15} />
                        </span>
                      </Link>
                      {c.certificate ? (
                        <Link to={`/certificate/${c.certificate.code}`} className="lx-link">
                          View certificate <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      ) : c.percent === 100 ? (
                        <Link to={`/learn/${c.slug}/final`} className="lx-link">
                          Take the final exam <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
