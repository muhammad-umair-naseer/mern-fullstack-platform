// Helpers that keep each course file terse. A course file exports one object
// built from `course()`; the seeder walks it and writes rows into SQLite.

// `lesson(title, minutes, body, quiz)` — body is Markdown rendered by the
// client. `quiz` is the topic's own check, which must be passed before the next
// topic unlocks; the chapter quiz then covers the chapter as a whole.
export const lesson = (title, minutes, body, quiz = []) => ({
  title,
  minutes,
  body: body.trim(),
  quiz,
});

// `chapter(title, summary, lessons, quiz)` — quiz questions gate nothing on
// their own; they are practice with instant feedback. The final exam gates the
// certificate.
export const chapter = (title, summary, lessons, quiz = []) => ({ title, summary, lessons, quiz });

// `q(prompt, options, answerIndex, explanation)`
export const q = (prompt, options, answerIndex, explanation = '') => ({
  prompt,
  options,
  answerIndex,
  explanation,
});

export const course = (config) => {
  const { chapters = [], final = [] } = config;
  const lessonCount = chapters.reduce((n, c) => n + c.lessons.length, 0);
  const topicQuestions = chapters.reduce(
    (n, c) => n + c.lessons.reduce((m, l) => m + (l.quiz?.length ?? 0), 0),
    0
  );
  const minutes = chapters.reduce(
    (n, c) => n + c.lessons.reduce((m, l) => m + l.minutes, 0),
    0
  );
  return {
    ...config,
    chapters,
    final,
    lessonCount,
    topicQuestions,
    hours: Math.max(1, Math.round(minutes / 60)),
  };
};
