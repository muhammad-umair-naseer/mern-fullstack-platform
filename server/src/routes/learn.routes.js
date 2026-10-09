import { Router } from 'express';
import { requireAuth, optionalAuth, requireAdmin } from '../middleware/auth.js';
import {
  listCourses,
  getCourseOutline,
  enroll,
  myCourses,
} from '../controllers/catalogue.controller.js';
import { getLesson, completeLesson } from '../controllers/lesson.controller.js';
import {
  getTopicQuiz,
  submitTopicQuiz,
  getChapterQuiz,
  submitChapterQuiz,
} from '../controllers/quiz.controller.js';
import { getFinal, startFinal, answerFinal, submitFinal } from '../controllers/final.controller.js';
import { verifyCertificate } from '../controllers/certificate.controller.js';
import {
  postHeartbeat,
  getStatus,
  getApplicants,
  patchApplicant,
} from '../controllers/claudePro.controller.js';

/**
 * Learning platform routing.
 *
 * Handlers live in ../controllers and the rules they enforce in ../services;
 * this file is only the URL-to-handler map so the surface stays readable.
 */
const router = Router();

// Express 4 does not catch a rejected async handler, so the request would
// hang; pass the error on to the app's error handler instead.
const safe = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Numeric path ids: anything else is a plain 404 before it reaches a query.
for (const name of ['id', 'lessonId', 'chapterId']) {
  router.param(name, (req, res, next, value) =>
    /^\d{1,15}$/.test(value) ? next() : res.status(404).json({ message: 'Not found' })
  );
}

// --- catalogue -------------------------------------------------------------
router.get('/courses', optionalAuth, safe(listCourses));
router.get('/courses/:slug', optionalAuth, safe(getCourseOutline));
router.post('/courses/:slug/enroll', requireAuth, safe(enroll));
router.get('/my', requireAuth, safe(myCourses));

// --- lessons ---------------------------------------------------------------
router.get('/lessons/:id', requireAuth, safe(getLesson));
router.post('/lessons/:id/complete', requireAuth, safe(completeLesson));

// --- quizzes ---------------------------------------------------------------
router.get('/quiz/lesson/:lessonId', requireAuth, safe(getTopicQuiz));
router.post('/quiz/lesson/:lessonId', requireAuth, safe(submitTopicQuiz));
router.get('/quiz/chapter/:chapterId', requireAuth, safe(getChapterQuiz));
router.post('/quiz/chapter/:chapterId', requireAuth, safe(submitChapterQuiz));

// --- final exam ------------------------------------------------------------
// One timed attempt and one retake; see services/finalExam.service.js.
router.get('/final/:slug', requireAuth, safe(getFinal));
router.post('/final/:slug/start', requireAuth, safe(startFinal));
router.post('/final/:slug/answer', requireAuth, safe(answerFinal));
router.post('/final/:slug/submit', requireAuth, safe(submitFinal));

// --- certificate -----------------------------------------------------------
// Public: anyone holding a code can verify it without an account.
router.get('/certificate/:code', safe(verifyCertificate));

// --- Claude Pro incentive & tracking ---------------------------------------
// No apply route: issuing a certificate records the application, with the
// real score (services/certificate.service.js).
router.get('/claude-pro/status/:slug', requireAuth, safe(getStatus));
router.post('/claude-pro/heartbeat', requireAuth, safe(postHeartbeat));
router.get('/claude-pro/applicants', requireAdmin, safe(getApplicants));
router.patch('/claude-pro/applicants/:id', requireAdmin, safe(patchApplicant));

export default router;
