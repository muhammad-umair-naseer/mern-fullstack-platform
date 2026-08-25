import { getDB } from '../setup/db.js';
import { PASS_MARK } from './progress.service.js';
import { quizSubmissionSchema } from '../validation/schemas.js';

/**
 * Quiz loading and grading.
 *
 * `strip` is the one rule that must never regress: answerIndex and explanation
 * are removed before questions are sent to the client.
 */

export const strip = ({ answerIndex, explanation, ...rest }) => rest;

export const loadQuestions = (courseId, chapterId, lessonId = null) => {
  const sql = lessonId
    ? 'SELECT * FROM quiz_questions WHERE lessonId = ? ORDER BY position'
    : chapterId
    ? 'SELECT * FROM quiz_questions WHERE chapterId = ? ORDER BY position'
    : 'SELECT * FROM quiz_questions WHERE courseId = ? AND chapterId IS NULL AND lessonId IS NULL ORDER BY position';
  const arg = lessonId ?? chapterId ?? courseId;
  return getDB()
    .prepare(sql)
    .all(arg)
    .map((r) => ({ ...r, options: JSON.parse(r.options) }));
};

export const gradeAndRespond = (req, res, { course, chapterId, lessonId = null, questions }) => {
  const { error, value } = quizSubmissionSchema.validate(req.body, { stripUnknown: true });
  if (error) return res.status(400).json({ message: 'Answers are required' });
  if (value.answers.length !== questions.length) {
    return res.status(400).json({ message: `Expected ${questions.length} answers` });
  }

  const review = questions.map((question, i) => ({
    id: question.id,
    prompt: question.prompt,
    options: question.options,
    your: value.answers[i],
    correct: question.answerIndex,
    right: value.answers[i] === question.answerIndex,
    explanation: question.explanation,
  }));

  const score = review.filter((r) => r.right).length;
  const total = questions.length;
  const passed = score / total >= PASS_MARK;

  const db = getDB();
  db.prepare(
    `INSERT INTO quiz_attempts (userId, courseId, chapterId, lessonId, score, total, passed, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, course.id, chapterId, lessonId, score, total, passed ? 1 : 0, new Date().toISOString());

  return { review, score, total, passed, percent: Math.round((score / total) * 100) };
};

// GET/POST chapter quiz
