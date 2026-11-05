import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { api } from '../../../lib/api.js';

/**
 * The learner's Claude Pro application, as the admin portal last set it.
 * Three stages, in order: Applied, Reviewing, Granted. The database keeps
 * the admin's words for them (applied, selected, awarded); rejected is shown
 * gently if an old record has it. One place for the wording, so the
 * dashboard, the course page, the lesson bar and the final exam agree.
 */
export const CLAUDE_PRO = {
  applied: { short: 'Applied', label: 'Claude Pro: Applied' },
  selected: { short: 'Reviewing', label: 'Claude Pro: Reviewing' },
  awarded: { short: 'Granted', label: 'Claude Pro: Award granted' },
  rejected: { short: 'Not granted', label: 'Claude Pro: Not granted' },
};

const STAGES = [
  { key: 'applied', title: 'Applied', note: 'Sent in when you passed the final exam.' },
  { key: 'selected', title: 'Reviewing', note: 'The Cortexis team is working on your request.' },
  { key: 'awarded', title: 'Granted', note: 'One month of Claude Pro is yours.' },
];
// After the review the team either grants it or not; a request not granted
// ends on its own last step instead of Granted.
const NOT_GRANTED = { key: 'rejected', title: 'Not granted', note: 'Thank you for applying. Your certificate is yours to keep.' };
const stagesFor = (status) => (status === 'rejected' ? [STAGES[0], STAGES[1], NOT_GRANTED] : STAGES);

export function ClaudeProPill({ status }) {
  const s = CLAUDE_PRO[status];
  if (!s) return null;
  return (
    <span className={`lx-claude-applied-pill is-${status}`} title="Your 1 month free Claude Pro application">
      {status !== 'rejected' && <span aria-hidden="true">{status === 'awarded' ? '🎉' : '✨'} </span>}
      {s.label}
    </span>
  );
}

// Three steps with the current one lit; earlier steps are ticked.
function Tracker({ status }) {
  const stages = stagesFor(status);
  const at = stages.findIndex((s) => s.key === status);
  return (
    <ol className="cp-track" aria-label="Application stages">
      {stages.map((s, i) => {
        const state = at < 0 ? 'todo' : i < at ? 'done' : i === at ? 'now' : 'todo';
        return (
          <li key={s.key} className={`cp-step is-${state}${s.key === 'rejected' ? ' is-rejected' : ''}`} style={{ '--i': i }} aria-current={state === 'now' ? 'step' : undefined}>
            <span className="cp-step-dot" aria-hidden="true">{state === 'done' || (state === 'now' && s.key === 'awarded') ? '✓' : state === 'now' && s.key === 'rejected' ? '×' : i + 1}</span>
            <span className="cp-step-text">
              <b>{s.title}</b>
              <small>{s.note}</small>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * "Claude Pro status" on the learner's dashboard. Opening it asks the API
 * again, so a decision the admin made a minute ago shows straight away, and
 * hands the fresh courses back (onFresh) so the cards behind it agree.
 */
export function ClaudeProStatus({ courses, email, onFresh }) {
  const dialog = useRef(null);
  const [list, setList] = useState(courses);
  const [loading, setLoading] = useState(false);
  useEffect(() => setList(courses), [courses]);

  const open = useCallback(async () => {
    dialog.current?.showModal();
    setLoading(true);
    try {
      const { data } = await api('/learn/my');
      setList(data.filter((c) => CLAUDE_PRO[c.claudePro]));
      if (onFresh) onFresh(data);
    } catch {
      /* keep what the dashboard already had */
    } finally {
      setLoading(false);
    }
  }, [onFresh]);

  if (!courses.length) return null;
  const granted = courses.some((c) => c.claudePro === 'awarded');

  return (
    <>
      <button type="button" className={`cp-open btn${granted ? ' is-granted' : ''}`} onClick={open}>
        <Sparkles size={16} aria-hidden="true" />
        Claude Pro status
        {granted && <span className="cp-open-dot">Granted</span>}
      </button>

      <dialog ref={dialog} className="cp-dialog" aria-labelledby="cp-dialog-title" onClick={(e) => e.target === dialog.current && dialog.current.close()}>
        <div className="cp-dialog-in">
          <button type="button" className="cp-close" onClick={() => dialog.current.close()} aria-label="Close">×</button>
          <p className="cp-eyebrow">1 month free</p>
          <h2 id="cp-dialog-title" className="cp-title">
            Claude Pro <em>status.</em>
          </h2>
          {loading && <p className="cp-checking" role="status">Checking for updates…</p>}
          {list.map((c) => (
            <section key={c.slug} className={`cp-course is-${c.claudePro}`} aria-label={c.title}>
              {c.claudePro === 'awarded' && (
                <div className="cp-congrats" role="status">
                  <span className="cp-burst" aria-hidden="true">
                    {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--k': i }} />)}
                  </span>
                  <p className="cp-congrats-kicker">Award granted</p>
                  <p className="cp-congrats-title">Congratulations!</p>
                  <p className="cp-congrats-text">
                    You earned one month of Claude Pro for finishing <b>{c.title}</b>. Watch your inbox at <b>{email}</b> for how to claim it.
                  </p>
                </div>
              )}
              <p className="cp-course-name">{c.title}</p>
              <Tracker status={c.claudePro} />
            </section>
          ))}
        </div>
      </dialog>
    </>
  );
}
