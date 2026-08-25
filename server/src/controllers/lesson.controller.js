import { getDB } from '../setup/db.js';
import {
  courseBySlug,
  enrollmentFor,
  lessonCountFor,
  computeGates,
  finishedLessonIds,
  PASS_MARK,
} from '../services/progress.service.js';

/** Reading a lesson and marking it complete. */

export const getLesson = (req, res) => {
  const db = getDB();
  const lesson = db
    .prepare(
      `SELECT l.*, ch.courseId, ch.title AS chapterTitle, ch.position AS chapterPosition, c.slug, c.title AS courseTitle
       FROM lessons l
       JOIN chapters ch ON ch.id = l.chapterId
       JOIN courses c ON c.id = ch.courseId
       WHERE l.id = ?`
    )
    .get(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

  if (!enrollmentFor(req.user.id, lesson.courseId)) {
    return res.status(403).json({ message: 'Enrol in this course to open its lessons' });
  }

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(lesson.courseId);
  const gate = computeGates(req.user.id, course).lessons[lesson.id];
  if (!gate?.unlocked) {
    return res.status(403).json({ message: gate?.reason || 'This lesson is locked' });
  }

  // Flat ordering drives prev/next across chapter boundaries.
  const ordered = db
    .prepare(
      `SELECT l.id, l.title, ch.position AS cp, l.position AS lp
       FROM lessons l JOIN chapters ch ON ch.id = l.chapterId
       WHERE ch.courseId = ? ORDER BY ch.position, l.position`
    )
    .all(lesson.courseId);
  const index = ordered.findIndex((l) => l.id === lesson.id);

  const done = db
    .prepare('SELECT completedAt FROM lesson_progress WHERE userId = ? AND lessonId = ?')
    .get(req.user.id, lesson.id);

  // The viewer needs to know whether the topic's own quiz is still outstanding,
  // since that is what gates moving on.
  const quizQuestionCount = db
    .prepare('SELECT COUNT(*) AS n FROM quiz_questions WHERE lessonId = ?')
    .get(lesson.id).n;
  const quizPassed = Boolean(
    db
      .prepare(
        'SELECT 1 AS ok FROM quiz_attempts WHERE userId = ? AND lessonId = ? AND passed = 1 LIMIT 1'
      )
      .get(req.user.id, lesson.id)
  );

  res.json({
    data: {
      ...lesson,
      completed: Boolean(done),
      quizQuestionCount,
      // A topic with no quiz counts as passed, so older content still advances.
      quizPassed: quizQuestionCount === 0 ? true : quizPassed,
      index: index + 1,
      totalLessons: ordered.length,
      prev: index > 0 ? ordered[index - 1] : null,
      next: index < ordered.length - 1 ? ordered[index + 1] : null,
    },
  });
};

// POST /api/learn/lessons/:id/complete
export const completeLesson = (req, res) => {
  const db = getDB();
  const lesson = db
    .prepare(
      `SELECT l.id, ch.courseId FROM lessons l
       JOIN chapters ch ON ch.id = l.chapterId WHERE l.id = ?`
    )
    .get(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  if (!enrollmentFor(req.user.id, lesson.courseId)) {
    return res.status(403).json({ message: 'Not enrolled in this course' });
  }

  // Otherwise a learner could mark the last lesson done and skip the whole course.
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(lesson.courseId);
  const gate = computeGates(req.user.id, course).lessons[lesson.id];
  if (!gate?.unlocked) {
    return res.status(403).json({ message: gate?.reason || 'This lesson is locked' });
  }

  db.prepare(
    `INSERT INTO lesson_progress (userId, lessonId, completedAt) VALUES (?, ?, ?)
     ON CONFLICT(userId, lessonId) DO NOTHING`
  ).run(req.user.id, lesson.id, new Date().toISOString());

  const total = lessonCountFor(lesson.courseId);
  // Recomputed after the write so the bar reflects the topic quiz still owed.
  const completed = finishedLessonIds(computeGates(req.user.id, course)).length;
  res.json({ data: { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 } });
};
