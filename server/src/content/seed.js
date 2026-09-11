import { getDB } from '../setup/db.js';
import { loadCourses } from './index.js';
import { invalidateCourseCache } from '../services/cache.service.js';

// Authored answers cluster heavily on one option (LLM- and human-written quizzes
// both do this), which makes "always pick B" a viable strategy against the 70%
// pass mark. Shuffle each question's options so the correct index is spread
// evenly. The shuffle is seeded from the prompt text, so it is stable across
// restarts — a learner mid-quiz never sees the options move under them.
const seedFrom = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const shuffleOptions = (prompt, options, answerIndex, slot) => {
  let state = seedFrom(prompt) || 1;
  const next = () => {
    // xorshift32 — deterministic, and good enough to break the clustering.
    state ^= state << 13; state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;  state >>>= 0;
    return state / 0x100000000;
  };

  const paired = options.map((text, i) => ({ text, correct: i === answerIndex }));
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }

  // Optionally force the correct answer into a chosen slot. Shuffling each
  // question independently leaves the answers within one quiz clustered at the
  // chance rate, which meant a learner answering "always B" cleared 62 of the
  // 1,104 topic quizzes outright. Assigning slots across the quiz removes that.
  if (Number.isInteger(slot)) {
    const at = paired.findIndex((p) => p.correct);
    const target = ((slot % paired.length) + paired.length) % paired.length;
    [paired[at], paired[target]] = [paired[target], paired[at]];
  }

  return {
    options: paired.map((p) => p.text),
    answerIndex: paired.findIndex((p) => p.correct),
  };
};

/**
 * Shuffles a whole quiz, spreading the correct answers across the four slots.
 *
 * Questions are handed slots round robin from a per-quiz offset, so a three
 * question quiz always uses three different letters and a twenty question exam
 * uses each letter five times. Guessing one letter therefore scores at most
 * 1/4, nowhere near the 70% pass mark, and the result is still deterministic:
 * the same content always seeds the same arrangement.
 */
const shuffleQuiz = (questions) => {
  const offset = seedFrom(questions.map((q) => q.prompt).join('')) % 4;
  return questions.map((question, i) => ({
    ...question,
    ...shuffleOptions(question.prompt, question.options, question.answerIndex, offset + i),
  }));
};

// Chapters and lessons are upserted on their (parent, position) unique keys
// rather than wiped and reinserted, so their ids stay stable across restarts —
// which is what keeps a learner's lesson_progress pointing at the right rows.
export const seedCourses = async () => {
  const db = getDB();
  const courses = await loadCourses();
  if (!courses.length) return { courses: 0, lessons: 0 };

  const now = new Date().toISOString();
  let lessonTotal = 0;

  const upsertCourse = db.prepare(`
    INSERT INTO courses (slug, title, category, level, duration, hours, summary, description, coverKey, accent, sortOrder, createdAt, updatedAt)
    VALUES (@slug, @title, @category, @level, @duration, @hours, @summary, @description, @coverKey, @accent, @sortOrder, @now, @now)
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title, category=excluded.category, level=excluded.level,
      duration=excluded.duration, hours=excluded.hours, summary=excluded.summary,
      description=excluded.description, coverKey=excluded.coverKey, accent=excluded.accent,
      sortOrder=excluded.sortOrder, updatedAt=excluded.updatedAt
  `);
  const courseIdBySlug = db.prepare('SELECT id FROM courses WHERE slug = ?');

  const upsertChapter = db.prepare(`
    INSERT INTO chapters (courseId, position, title, summary)
    VALUES (@courseId, @position, @title, @summary)
    ON CONFLICT(courseId, position) DO UPDATE SET title=excluded.title, summary=excluded.summary
  `);
  const chapterIdAt = db.prepare('SELECT id FROM chapters WHERE courseId = ? AND position = ?');
  const pruneChapters = db.prepare('DELETE FROM chapters WHERE courseId = ? AND position > ?');

  const upsertLesson = db.prepare(`
    INSERT INTO lessons (chapterId, position, title, minutes, body)
    VALUES (@chapterId, @position, @title, @minutes, @body)
    ON CONFLICT(chapterId, position) DO UPDATE SET
      title=excluded.title, minutes=excluded.minutes, body=excluded.body
  `);
  const pruneLessons = db.prepare('DELETE FROM lessons WHERE chapterId = ? AND position > ?');

  // Questions carry no natural key, and quiz_attempts stores only the score,
  // so replacing them wholesale is safe and keeps the seeder simple.
  const clearQuestions = db.prepare('DELETE FROM quiz_questions WHERE courseId = ?');
  const insertQuestion = db.prepare(`
    INSERT INTO quiz_questions (courseId, chapterId, lessonId, position, prompt, options, answerIndex, explanation)
    VALUES (@courseId, @chapterId, @lessonId, @position, @prompt, @options, @answerIndex, @explanation)
  `);

  const run = db.transaction(() => {
    courses.forEach((c, index) => {
      upsertCourse.run({
        slug: c.slug,
        title: c.title,
        category: c.category,
        level: c.level,
        duration: c.duration,
        hours: c.hours ?? 0,
        summary: c.summary,
        description: c.description ?? null,
        coverKey: c.coverKey ?? c.slug,
        accent: c.accent ?? 'violet',
        sortOrder: c.sortOrder ?? index,
        now,
      });
      const courseId = courseIdBySlug.get(c.slug).id;
      clearQuestions.run(courseId);

      c.chapters.forEach((ch, ci) => {
        const position = ci + 1;
        upsertChapter.run({ courseId, position, title: ch.title, summary: ch.summary ?? null });
        const chapterId = chapterIdAt.get(courseId, position).id;

        const lessonIdAt = db.prepare('SELECT id FROM lessons WHERE chapterId = ? AND position = ?');

        ch.lessons.forEach((l, li) => {
          upsertLesson.run({
            chapterId,
            position: li + 1,
            title: l.title,
            minutes: l.minutes ?? 10,
            body: l.body,
          });
          lessonTotal++;

          // The topic's own quiz. Questions are replaced wholesale per course
          // above, so these only ever need inserting.
          const lessonId = lessonIdAt.get(chapterId, li + 1).id;
          shuffleQuiz((l.quiz ?? [])).forEach((shuffled, qi) => {
            insertQuestion.run({
              courseId,
              chapterId: null,
              lessonId,
              position: qi + 1,
              prompt: shuffled.prompt,
              options: JSON.stringify(shuffled.options),
              answerIndex: shuffled.answerIndex,
              explanation: shuffled.explanation ?? null,
            });
          });
        });
        pruneLessons.run(chapterId, ch.lessons.length);

        shuffleQuiz((ch.quiz ?? [])).forEach((shuffled, qi) => {
          insertQuestion.run({
            courseId,
            chapterId,
            lessonId: null,
            position: qi + 1,
            prompt: shuffled.prompt,
            options: JSON.stringify(shuffled.options),
            answerIndex: shuffled.answerIndex,
            explanation: shuffled.explanation ?? null,
          });
        });
      });
      pruneChapters.run(courseId, c.chapters.length);

      // chapterId NULL marks a final-exam question.
      shuffleQuiz((c.final ?? [])).forEach((shuffled, qi) => {
        insertQuestion.run({
          courseId,
          chapterId: null,
          lessonId: null,
          position: qi + 1,
          prompt: shuffled.prompt,
          options: JSON.stringify(shuffled.options),
          answerIndex: shuffled.answerIndex,
          explanation: shuffled.explanation ?? null,
        });
      });
    });
  });

  run();
  await invalidateCourseCache().catch((err) =>
    console.warn('Cache invalidation notice after seed:', err.message)
  );
  return { courses: courses.length, lessons: lessonTotal };
};
