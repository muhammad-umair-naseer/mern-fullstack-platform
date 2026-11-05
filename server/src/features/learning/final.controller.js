import { courseBySlug, enrollmentFor, computeGates } from './progress.service.js';
import { finalStatus, startAttempt, saveAnswer, submitAttempt } from './finalExam.service.js';

/**
 * The final exam over HTTP. The rules themselves live in
 * services/finalExam.service.js; this file only checks who is asking.
 */

// Express 4 does not catch a rejected handler, so each one answers its own failure.
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('final exam error:', err);
    if (!res.headersSent) res.status(500).json({ message: 'Something went wrong with the exam' });
  }
};

const enrolledCourse = async (req, res) => {
  const course = await courseBySlug(req.params.slug);
  if (!course) {
    res.status(404).json({ message: 'Course not found' });
    return null;
  }
  if (!(await enrollmentFor(req.user.id, course.id))) {
    res.status(403).json({ message: 'Not enrolled in this course' });
    return null;
  }
  return course;
};

// GET /api/learn/final/:slug — where the learner stands. Never sends questions.
export const getFinal = handle(async (req, res) => {
  const course = await enrolledCourse(req, res);
  if (!course) return;
  const gates = await computeGates(req.user.id, course);
  const status = await finalStatus(req.user.id, course, gates);
  res.json({ data: { course: { id: course.id, slug: course.slug, title: course.title }, ...status } });
});

// POST /api/learn/final/:slug/start — { pledge: true }
export const startFinal = handle(async (req, res) => {
  const course = await enrolledCourse(req, res);
  if (!course) return;
  if (req.body?.pledge !== true) {
    return res.status(400).json({ message: 'Tick the honesty pledge to start the exam' });
  }
  const gates = await computeGates(req.user.id, course);
  const out = await startAttempt(req.user.id, course, gates);
  if (out.error) return res.status(out.error).json({ message: out.message, data: out.status ?? null });
  res.status(201).json({ data: out.attempt });
});

// POST /api/learn/final/:slug/answer — { token, i, choice }
export const answerFinal = handle(async (req, res) => {
  const course = await enrolledCourse(req, res);
  if (!course) return;
  const { token, i, choice } = req.body ?? {};
  const out = await saveAnswer(req.user.id, course, { token, i, choice });
  if (out.error) return res.status(out.error).json({ message: out.message });
  res.json({ ok: true });
});

// POST /api/learn/final/:slug/submit — { token, reason?, answers?, blurs? }
export const submitFinal = handle(async (req, res) => {
  const course = await enrolledCourse(req, res);
  if (!course) return;
  const { token, reason, answers, blurs } = req.body ?? {};
  const out = await submitAttempt(req.user.id, course, { token, reason, answers, blurs });
  if (out.error) return res.status(out.error).json({ message: out.message });
  // The new standing comes with the result: the certificate, or when the retake opens.
  const status = await finalStatus(req.user.id, course, await computeGates(req.user.id, course));
  res.json({ data: { ...out.result, status } });
});
