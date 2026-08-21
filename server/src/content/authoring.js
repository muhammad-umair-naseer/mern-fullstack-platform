// Helpers that keep each course file terse. A course file exports one object
// built from `course()`; the seeder walks it and writes rows into SQLite.

// `lesson(title, minutes, body)` — body is Markdown rendered by the client.
export const lesson = (title, minutes, body) => ({ title, minutes, body: body.trim() });

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
  const minutes = chapters.reduce(
    (n, c) => n + c.lessons.reduce((m, l) => m + l.minutes, 0),
    0
  );
  return {
    ...config,
    chapters,
    final,
    lessonCount,
    hours: Math.max(1, Math.round(minutes / 60)),
  };
};
