import { getDB } from '../setup/db.js';
import {
  courseBySlug,
  enrollmentFor,
  completedLessonIds,
  lessonCountFor,
  computeGates,
  PASS_MARK,
} from '../services/progress.service.js';
import { loadQuestions, gradeAndRespond, strip } from '../services/quiz.service.js';
import { issueCertificate, findCertificateByCode } from '../services/certificate.service.js';

/** Chapter quizzes and the final exam, including certificate issuance. */

export const getChapterQuiz = (req, res) => {
  const db = getDB();
  const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
  if (!enrollmentFor(req.user.id, chapter.courseId)) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(chapter.courseId);
  const gate = computeGates(req.user.id, course).quizzes[chapter.id];
  if (!gate?.unlocked) {
    return res.status(403).json({ message: gate?.reason || 'This quiz is locked' });
  }

  const questions = loadQuestions(chapter.courseId, chapter.id);
  res.json({
    data: { chapter, questions: questions.map(strip), passMark: Math.round(PASS_MARK * 100) },
  });
};

export const submitChapterQuiz = (req, res) => {
  const db = getDB();
  const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(chapter.courseId);
  if (!enrollmentFor(req.user.id, course.id)) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const gate = computeGates(req.user.id, course).quizzes[chapter.id];
  if (!gate?.unlocked) {
    return res.status(403).json({ message: gate?.reason || 'This quiz is locked' });
  }

  const questions = loadQuestions(course.id, chapter.id);
  const result = gradeAndRespond(req, res, { course, chapterId: chapter.id, questions });
  if (!result) return;
  res.json({ data: result });
};

// ---------------------------------------------------------------- final exam

export const getFinalExam = (req, res) => {
  const course = courseBySlug(req.params.slug);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (!enrollmentFor(req.user.id, course.id)) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const gates = computeGates(req.user.id, course);
  if (!gates.final.unlocked) {
    const total = lessonCountFor(course.id);
    const completed = completedLessonIds(req.user.id, course.id).length;
    const quizzesLeft = gates.chapters.filter((c) => !c.quizPassed).length;
    return res.status(403).json({
      message: gates.final.reason,
      data: { completed, total, chapterQuizzesRemaining: quizzesLeft },
    });
  }

  const questions = loadQuestions(course.id, null);
  if (!questions.length) return res.status(404).json({ message: 'No final exam for this course yet' });

  res.json({
    data: { course, questions: questions.map(strip), passMark: Math.round(PASS_MARK * 100) },
  });
};

export const submitFinalExam = (req, res) => {
  const db = getDB();
  const course = courseBySlug(req.params.slug);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (!enrollmentFor(req.user.id, course.id)) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const gates = computeGates(req.user.id, course);
  if (!gates.final.unlocked) {
    return res.status(403).json({ message: gates.final.reason });
  }

  const questions = loadQuestions(course.id, null);
  const result = gradeAndRespond(req, res, { course, chapterId: null, questions });
  if (!result) return;

  // Certificate issues automatically the first time they clear the pass mark.
  const certificate = result.passed
    ? issueCertificate({ userId: req.user.id, courseId: course.id, score: result.percent })
    : getDB()
        .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
        .get(req.user.id, course.id) ?? null;

  res.json({ data: { ...result, certificate: certificate ?? null } });
};
