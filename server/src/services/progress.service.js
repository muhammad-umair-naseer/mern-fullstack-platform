import { getDB } from '../setup/db.js';

/**
 * Enrolment and progression rules.
 *
 * Everything about "what may this learner open next" lives here so the route
 * layer stays about HTTP. Every helper is async because the database is.
 */

export const PASS_MARK = 0.7;

export const courseBySlug = (slug) => getDB().prepare('SELECT * FROM courses WHERE slug = ?').get(slug);

export const enrollmentFor = (userId, courseId) =>
  getDB()
    .prepare('SELECT * FROM enrollments WHERE userId = ? AND courseId = ?')
    .get(userId, courseId);

// Lesson ids the learner has finished, for one course.
export const completedLessonIds = async (userId, courseId) =>
  (await getDB()
    .prepare(
      `SELECT lp.lessonId AS id FROM lesson_progress lp
       JOIN lessons l ON l.id = lp.lessonId
       JOIN chapters ch ON ch.id = l.chapterId
       WHERE lp.userId = ? AND ch.courseId = ?`
    )
    .all(userId, courseId)).map((r) => r.id);

export const lessonCountFor = async (courseId) =>
  (await getDB()
    .prepare(
      `SELECT COUNT(*) AS n FROM lessons l
       JOIN chapters ch ON ch.id = l.chapterId WHERE ch.courseId = ?`
    )
    .get(courseId)).n;

// ---------------------------------------------------------------- progression

// Strict hierarchy. Every rule is enforced here, server-side, because the UI's
// padlocks are advisory only — a learner can call the API directly.
//
//   chapter 1        always open once enrolled
//   chapter K        open when chapter K-1's lessons are done AND its quiz passed
//   lesson P         open when every earlier lesson in that chapter is complete
//   chapter quiz     open when every lesson in that chapter is complete
//   final exam       open when every lesson is complete AND every chapter quiz passed
export const computeGates = async (userId, course) => {
  const db = getDB();
  const chapters = await db
    .prepare('SELECT * FROM chapters WHERE courseId = ? ORDER BY position')
    .all(course.id);

  const done = new Set(await completedLessonIds(userId, course.id));
  const passedTopics = new Set(
    (await getDB()
      .prepare(
        `SELECT DISTINCT lessonId FROM quiz_attempts
         WHERE userId = ? AND courseId = ? AND lessonId IS NOT NULL AND passed = 1`
      )
      .all(userId, course.id)).map((r) => r.lessonId)
  );

  const topicQuestionCount = new Map(
    (await getDB()
      .prepare(
        `SELECT lessonId, COUNT(*) AS n FROM quiz_questions
         WHERE courseId = ? AND lessonId IS NOT NULL GROUP BY lessonId`
      )
      .all(course.id)).map((r) => [r.lessonId, r.n])
  );

  const passedChapters = new Set(
    (await db
      .prepare(
        `SELECT DISTINCT chapterId FROM quiz_attempts
         WHERE userId = ? AND courseId = ? AND chapterId IS NOT NULL AND passed = 1`
      )
      .all(userId, course.id)).map((r) => r.chapterId)
  );

  const lessons = {};   // lessonId  -> { unlocked, reason }
  const quizzes = {};   // chapterId -> { unlocked, reason, passed, questionCount }
  const chapterState = [];

  let chapterOpen = true;          // chapter 1 is always open
  let chapterBlockReason = null;
  let allLessonsDone = true;
  let allQuizzesPassed = true;

  const lessonsByChapter = new Map();
  (await db.prepare(
    `SELECT l.id, l.position, l.chapterId FROM lessons l
     JOIN chapters ch ON ch.id = l.chapterId
     WHERE ch.courseId = ? ORDER BY ch.position, l.position`
  )
    .all(course.id)).forEach(({ chapterId, ...lesson }) => {
      if (!lessonsByChapter.has(chapterId)) lessonsByChapter.set(chapterId, []);
      lessonsByChapter.get(chapterId).push(lesson);
    });

  const questionCountByChapter = new Map(
    (await db
      .prepare(
        `SELECT chapterId, COUNT(*) AS n FROM quiz_questions
         WHERE courseId = ? AND chapterId IS NOT NULL GROUP BY chapterId`
      )
      .all(course.id)).map((r) => [r.chapterId, r.n])
  );

  for (const ch of chapters) {
    const chLessons = lessonsByChapter.get(ch.id) ?? [];
    const questionCount = questionCountByChapter.get(ch.id) ?? 0;

    let previousDone = true;       // within this chapter
    for (const l of chLessons) {
      const unlocked = chapterOpen && previousDone;
      const questionCount = topicQuestionCount.get(l.id) ?? 0;
      const quizPassed = passedTopics.has(l.id);
      const read = done.has(l.id);

      lessons[l.id] = {
        unlocked,
        read,
        quizQuestionCount: questionCount,
        quizPassed,
        // Reading is not enough once a topic has its own check: the quiz is
        // what stops a learner clicking straight through without engaging.
        complete: read && (questionCount === 0 || quizPassed),
        quizUnlocked: unlocked && read,
        reason: unlocked
          ? null
          : chapterOpen
          ? 'Finish the previous topic first'
          : chapterBlockReason,
      };

      if (!lessons[l.id].complete) {
        previousDone = false;      // everything after this topic stays locked
        allLessonsDone = false;
      }
    }

    const chapterLessonsDone = chLessons.every((l) => lessons[l.id].complete);
    const quizPassed = passedChapters.has(ch.id);
    const quizUnlocked = chapterOpen && chapterLessonsDone && questionCount > 0;

    quizzes[ch.id] = {
      unlocked: quizUnlocked,
      passed: quizPassed,
      questionCount,
      reason: quizUnlocked
        ? null
        : !chapterOpen
        ? chapterBlockReason
        : questionCount === 0
        ? 'No quiz for this chapter'
        : `Finish all ${chLessons.length} topics and their quizzes first`,
    };

    chapterState.push({
      id: ch.id,
      position: ch.position,
      unlocked: chapterOpen,
      lessonsDone: chLessons.filter((l) => lessons[l.id].complete).length,
      lessonTotal: chLessons.length,
      quizPassed,
      reason: chapterOpen ? null : chapterBlockReason,
    });

    if (questionCount > 0 && !quizPassed) allQuizzesPassed = false;

    // Decide whether the NEXT chapter opens.
    if (chapterOpen) {
      if (!chapterLessonsDone) {
        chapterOpen = false;
        chapterBlockReason = `Complete Chapter ${ch.position} first`;
      } else if (questionCount > 0 && !quizPassed) {
        chapterOpen = false;
        chapterBlockReason = `Pass the Chapter ${ch.position} quiz to continue`;
      }
    }
  }

  const finalUnlocked = allLessonsDone && allQuizzesPassed;

  return {
    lessons,
    quizzes,
    chapters: chapterState,
    final: {
      unlocked: finalUnlocked,
      reason: finalUnlocked
        ? null
        : !allLessonsDone
        ? 'Complete every lesson first'
        : 'Pass every chapter quiz first',
    },
  };
};

// Topics that count as finished: read AND (no topic quiz OR its quiz passed).
// The progress bar reads from here so the percentage and the final-exam gate can
// never disagree — 100% now genuinely means the exam is open.
export const finishedLessonIds = (gates) =>
  Object.entries(gates.lessons)
    .filter(([, g]) => g.complete)
    .map(([id]) => Number(id));
