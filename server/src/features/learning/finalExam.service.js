import { randomBytes, randomInt } from 'node:crypto';
import { getDB } from '../../setup/db.js';
import { loadQuestions } from './quiz.service.js';
import { issueCertificate } from './certificate.service.js';

/**
 * The final exam: one timed attempt, and one retake a month later if that
 * attempt fails.
 *
 * Every attempt keeps the exact paper it showed: the questions, each one's
 * options in the order shown, and where the right answer sat. The seeder
 * rewrites quiz_questions whenever course content changes, so grading and the
 * retake read the snapshot, never the live rows. The retake is the same
 * questions with the question order and every question's options shuffled
 * again, and answers are never shown, so the first attempt gives nothing away.
 *
 * Leaving the exam submits it. The page submits when it is hidden; anything
 * that slips past (a crash, a closed laptop) is caught here instead: an open
 * attempt found on any later request is graded on the answers saved so far.
 */
export const FINAL = Object.freeze({
  questions: 50,
  totalMarks: 100,
  passMarks: 50,
  minutes: 60,
  maxAttempts: 2,
  retakeAfterDays: 30,
  // Only for requests already in flight when the clock runs out.
  graceSeconds: 10,
});

const DAY = 86_400_000;

const json = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Reorder a question's options and follow the right answer to its new place.
const shuffleOptions = ({ prompt, options, answer }) => {
  const order = shuffle(options.map((_, i) => i));
  return { prompt, options: order.map((i) => options[i]), answer: order.indexOf(answer) };
};

const parse = (row) => row && { ...row, paper: json(row.paper), answers: json(row.answers) };

const attemptsFor = async (userId, courseId) =>
  (
    await getDB()
      .prepare('SELECT * FROM final_attempts WHERE userId = ? AND courseId = ? ORDER BY attemptNo')
      .all(userId, courseId)
  ).map(parse);

const attemptByToken = async (userId, courseId, token) =>
  typeof token === 'string' && token
    ? parse(
        await getDB()
          .prepare('SELECT * FROM final_attempts WHERE userId = ? AND courseId = ? AND token = ?')
          .get(userId, courseId, token)
      )
    : null;

const expired = (attempt, now = new Date()) =>
  now.getTime() > new Date(attempt.deadline).getTime() + FINAL.graceSeconds * 1000;

const certificateFor = async (userId, courseId) =>
  (await getDB()
    .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
    .get(userId, courseId)) ?? null;

/** Grade and close an attempt. It closes exactly once, however many requests race to do it. */
const close = async (attempt, reason, now = new Date()) => {
  const total = attempt.paper.length;
  const correct = attempt.paper.reduce((n, q, i) => n + (attempt.answers[i] === q.answer ? 1 : 0), 0);
  const marks = total ? Math.round((correct * FINAL.totalMarks) / total) : 0;
  const passed = marks >= FINAL.passMarks;
  const { changes } = await getDB()
    .prepare(
      `UPDATE final_attempts SET submittedAt = ?, reason = ?, correct = ?, marks = ?, passed = ?
       WHERE id = ? AND submittedAt IS NULL`
    )
    .run(now.toISOString(), reason, correct, marks, passed ? 1 : 0, attempt.id);
  if (changes && passed) {
    await issueCertificate({ userId: attempt.userId, courseId: attempt.courseId, score: marks });
  }
};

/** Close anything this learner left open: before the deadline it was left, after it the time ran out. */
const settle = async (userId, courseId, now = new Date()) => {
  for (const attempt of await attemptsFor(userId, courseId)) {
    if (!attempt.submittedAt) await close(attempt, expired(attempt, now) ? 'timeout' : 'left', now);
  }
};

const summary = (a) => ({
  attemptNo: a.attemptNo,
  marks: a.marks,
  totalMarks: FINAL.totalMarks,
  correct: a.correct,
  total: a.total,
  passed: Boolean(a.passed),
  reason: a.reason,
  submittedAt: a.submittedAt,
});

/**
 * Where a learner stands, as one state the page can render:
 * locked, ready, waiting (for the retake), retake, passed or exhausted.
 */
export const finalStatus = async (userId, course, gates) => {
  await settle(userId, course.id);
  const done = (await attemptsFor(userId, course.id)).filter((a) => a.submittedAt);
  const certificate = await certificateFor(userId, course.id);
  const last = done[done.length - 1];

  let state;
  let retakeAt = null;
  if (certificate) state = 'passed';
  else if (!gates.final.unlocked) state = 'locked';
  else if (done.length === 0) state = 'ready';
  else if (done.length >= FINAL.maxAttempts) state = 'exhausted';
  else {
    retakeAt = new Date(new Date(last.submittedAt).getTime() + FINAL.retakeAfterDays * DAY);
    state = Date.now() >= retakeAt.getTime() ? 'retake' : 'waiting';
  }

  return {
    rules: FINAL,
    state,
    reason: state === 'locked' ? gates.final.reason : null,
    retakeAt: retakeAt ? retakeAt.toISOString() : null,
    attempts: done.map(summary),
    certificate,
  };
};

/** Start the first attempt or the retake. Returns { attempt } or { error, message }. */
export const startAttempt = async (userId, course, gates) => {
  const status = await finalStatus(userId, course, gates);
  if (status.state !== 'ready' && status.state !== 'retake') {
    return { error: 403, message: 'The final exam cannot be started now', status };
  }

  const earlier = await attemptsFor(userId, course.id);
  let base;
  if (earlier.length === 0) {
    const pool = await loadQuestions(course.id, null);
    if (!pool.length) return { error: 404, message: 'No final exam for this course yet' };
    base = shuffle(pool)
      .slice(0, FINAL.questions)
      .map((q) => ({ prompt: q.prompt, options: q.options, answer: q.answerIndex }));
  } else {
    base = earlier[0].paper; // the retake sits the same questions
  }
  const paper = shuffle(base).map(shuffleOptions);

  const now = new Date();
  const deadline = new Date(now.getTime() + FINAL.minutes * 60_000);
  const token = randomBytes(24).toString('hex');
  const attemptNo = earlier.length + 1;
  try {
    await getDB()
      .prepare(
        `INSERT INTO final_attempts (userId, courseId, attemptNo, token, paper, total, pledgedAt, startedAt, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(userId, course.id, attemptNo, token, JSON.stringify(paper), paper.length, now.toISOString(), now.toISOString(), deadline.toISOString());
  } catch (err) {
    if (err.code === '23505') return { error: 409, message: 'This attempt has already started' };
    throw err;
  }

  return {
    attempt: {
      attemptNo,
      token,
      startedAt: now.toISOString(),
      deadline: deadline.toISOString(),
      rules: FINAL,
      questions: paper.map(({ prompt, options }, i) => ({ i, prompt, options })),
    },
  };
};

const validChoice = (attempt, i, choice) =>
  Number.isInteger(i) &&
  i >= 0 &&
  i < attempt.paper.length &&
  Number.isInteger(choice) &&
  choice >= 0 &&
  choice < attempt.paper[i].options.length;

/** Save one answer as it is picked. Refused once the attempt is closed or out of time. */
export const saveAnswer = async (userId, course, { token, i, choice }) => {
  const attempt = await attemptByToken(userId, course.id, token);
  if (!attempt) return { error: 404, message: 'No such attempt' };
  if (attempt.submittedAt) return { error: 409, message: 'This attempt has already been submitted' };
  if (expired(attempt)) {
    await close(attempt, 'timeout');
    return { error: 409, message: 'Time is up' };
  }
  if (!validChoice(attempt, i, choice)) return { error: 400, message: 'Invalid answer' };

  await getDB()
    .prepare(
      `UPDATE final_attempts SET answers = answers || jsonb_build_object(?::text, ?::int)
       WHERE id = ? AND submittedAt IS NULL`
    )
    .run(String(i), choice, attempt.id);
  return { ok: true };
};

/**
 * Submit: by the learner, by leaving the exam, or by the clock. Answers sent
 * with it are kept if they arrive in time (a pick whose save was still in
 * flight). Submitting a closed attempt again just returns its result.
 */
export const submitAttempt = async (userId, course, { token, reason, answers, blurs }) => {
  let attempt = await attemptByToken(userId, course.id, token);
  if (!attempt) return { error: 404, message: 'No such attempt' };

  if (!attempt.submittedAt) {
    const now = new Date();
    const late = expired(attempt, now);
    const db = getDB();
    if (!late && answers && typeof answers === 'object') {
      const extra = {};
      for (const [key, choice] of Object.entries(answers)) {
        const i = Number(key);
        if (validChoice(attempt, i, choice)) extra[i] = choice;
      }
      if (Object.keys(extra).length) {
        await db
          .prepare('UPDATE final_attempts SET answers = answers || ?::jsonb WHERE id = ? AND submittedAt IS NULL')
          .run(JSON.stringify(extra), attempt.id);
      }
    }
    if (Number.isInteger(blurs) && blurs > 0) {
      await db.prepare('UPDATE final_attempts SET blurs = ? WHERE id = ?').run(Math.min(blurs, 10_000), attempt.id);
    }
    attempt = await attemptByToken(userId, course.id, token);
    const why = late ? 'timeout' : reason === 'left' || reason === 'timeout' ? reason : 'submitted';
    await close(attempt, why, now);
  }

  const closed = await attemptByToken(userId, course.id, token);
  return { result: summary(closed) };
};
