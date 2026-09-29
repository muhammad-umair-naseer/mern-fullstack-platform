import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
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

/**
 * Learning platform routing.
 *
 * Handlers live in ../controllers and the rules they enforce in ../services;
 * this file is only the URL-to-handler map so the surface stays readable.
 */
const router = Router();

// --- catalogue -------------------------------------------------------------
router.get('/courses', optionalAuth, listCourses);
router.get('/courses/:slug', optionalAuth, getCourseOutline);
router.post('/courses/:slug/enroll', requireAuth, enroll);
router.get('/my', requireAuth, myCourses);

// --- lessons ---------------------------------------------------------------
router.get('/lessons/:id', requireAuth, getLesson);
router.post('/lessons/:id/complete', requireAuth, completeLesson);

// --- quizzes ---------------------------------------------------------------
router.get('/quiz/lesson/:lessonId', requireAuth, getTopicQuiz);
router.post('/quiz/lesson/:lessonId', requireAuth, submitTopicQuiz);
router.get('/quiz/chapter/:chapterId', requireAuth, getChapterQuiz);
router.post('/quiz/chapter/:chapterId', requireAuth, submitChapterQuiz);

// --- final exam ------------------------------------------------------------
// One timed attempt and one retake; see services/finalExam.service.js.
router.get('/final/:slug', requireAuth, getFinal);
router.post('/final/:slug/start', requireAuth, startFinal);
router.post('/final/:slug/answer', requireAuth, answerFinal);
router.post('/final/:slug/submit', requireAuth, submitFinal);

// --- certificate -----------------------------------------------------------
// Public: anyone holding a code can verify it without an account.
router.get('/certificate/:code', verifyCertificate);

export default router;
