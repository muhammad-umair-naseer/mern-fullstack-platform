import { getDB } from '../setup/db.js';
import {
  courseBySlug,
  enrollmentFor,
  lessonCountFor,
  computeGates,
  finishedLessonIds,
  PASS_MARK,
} from '../services/progress.service.js';
import { loadQuestions, gradeAndRespond, strip } from '../services/quiz.service.js';
import { issueCertificate, findCertificateByCode } from '../services/certificate.service.js';

/** Chapter quizzes and the final exam, including certificate issuance. */

/** A topic's own quiz. Must be passed before the next topic unlocks. */
export const getTopicQuiz = async (req, res) => {
  const db = getDB();
  const lesson = await db
    .prepare(
      `SELECT l.id, l.title, l.position, ch.id AS chapterId, ch.position AS chapterPosition, ch.courseId
       FROM lessons l JOIN chapters ch ON ch.id = l.chapterId WHERE l.id = ?`
    )
    .get(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: 'Topic not found' });
  if (!(await enrollmentFor(req.user.id, lesson.courseId))) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(lesson.courseId);
  const gate = (await computeGates(req.user.id, course)).lessons[lesson.id];
  if (!gate?.quizUnlocked) {
    return res.status(403).json({
      message: gate?.unlocked ? 'Read the topic before taking its quiz' : gate?.reason || 'Locked',
    });
  }

  const questions = await loadQuestions(course.id, null, lesson.id);
  if (!questions.length) return res.status(404).json({ message: 'This topic has no quiz' });

  res.json({
    data: { lesson, questions: questions.map(strip), passMark: Math.round(PASS_MARK * 100) },
  });
};

export const submitTopicQuiz = async (req, res) => {
  const db = getDB();
  const lesson = await db
    .prepare('SELECT l.id, ch.courseId FROM lessons l JOIN chapters ch ON ch.id = l.chapterId WHERE l.id = ?')
    .get(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: 'Topic not found' });

  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(lesson.courseId);
  if (!(await enrollmentFor(req.user.id, course.id))) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const gate = (await computeGates(req.user.id, course)).lessons[lesson.id];
  if (!gate?.quizUnlocked) {
    return res.status(403).json({ message: gate?.reason || 'This quiz is locked' });
  }

  const questions = await loadQuestions(course.id, null, lesson.id);
  const result = await gradeAndRespond(req, res, { course, chapterId: null, lessonId: lesson.id, questions });
  if (!result) return;
  res.json({ data: result });
};

export const getChapterQuiz = async (req, res) => {
  const db = getDB();
  const chapter = await db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
  if (!(await enrollmentFor(req.user.id, chapter.courseId))) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(chapter.courseId);
  const gate = (await computeGates(req.user.id, course)).quizzes[chapter.id];
  if (!gate?.unlocked) {
    return res.status(403).json({ message: gate?.reason || 'This quiz is locked' });
  }

  const questions = await loadQuestions(chapter.courseId, chapter.id);
  res.json({
    data: { chapter, questions: questions.map(strip), passMark: Math.round(PASS_MARK * 100) },
  });
};

export const submitChapterQuiz = async (req, res) => {
  const db = getDB();
  const chapter = await db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(chapter.courseId);
  if (!(await enrollmentFor(req.user.id, course.id))) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const gate = (await computeGates(req.user.id, course)).quizzes[chapter.id];
  if (!gate?.unlocked) {
    return res.status(403).json({ message: gate?.reason || 'This quiz is locked' });
  }

  const questions = await loadQuestions(course.id, chapter.id);
  const result = await gradeAndRespond(req, res, { course, chapterId: chapter.id, questions });
  if (!result) return;
  res.json({ data: result });
};

// ---------------------------------------------------------------- final exam

export const getFinalExam = async (req, res) => {
  const course = await courseBySlug(req.params.slug);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (!(await enrollmentFor(req.user.id, course.id))) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const gates = await computeGates(req.user.id, course);
  if (!gates.final.unlocked) {
    const total = await lessonCountFor(course.id);
    const completed = finishedLessonIds(gates).length;
    const quizzesLeft = gates.chapters.filter((c) => !c.quizPassed).length;
    return res.status(403).json({
      message: gates.final.reason,
      data: { completed, total, chapterQuizzesRemaining: quizzesLeft },
    });
  }

  const questions = await loadQuestions(course.id, null);
  if (!questions.length) return res.status(404).json({ message: 'No final exam for this course yet' });

  res.json({
    data: { course, questions: questions.map(strip), passMark: Math.round(PASS_MARK * 100) },
  });
};

export const submitFinalExam = async (req, res) => {
  const db = getDB();
  const course = await courseBySlug(req.params.slug);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (!(await enrollmentFor(req.user.id, course.id))) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  const gates = await computeGates(req.user.id, course);
  if (!gates.final.unlocked) {
    return res.status(403).json({ message: gates.final.reason });
  }

  const questions = await loadQuestions(course.id, null);
  const result = await gradeAndRespond(req, res, { course, chapterId: null, questions });
  if (!result) return;

  // Certificate issues automatically the first time they clear the pass mark.
  const certificate = result.passed
    ? await issueCertificate({ userId: req.user.id, courseId: course.id, score: result.percent })
    : (await getDB()
        .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
        .get(req.user.id, course.id)) ?? null;

  res.json({ data: { ...result, certificate: certificate ?? null } });
};
