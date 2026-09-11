import { getDB } from '../setup/db.js';
import {
  courseBySlug,
  enrollmentFor,
  completedLessonIds,
  lessonCountFor,
  computeGates,
  finishedLessonIds,
  PASS_MARK,
} from '../services/progress.service.js';
import { getOrSet, CACHE_KEYS, CACHE_TTL } from '../services/cache.service.js';

/** Catalogue browsing, enrolment, and the learner dashboard. */

export const listCourses = async (_req, res) => {
  try {
    const { data, cached } = await getOrSet(
      CACHE_KEYS.courseList(),
      () => {
        return getDB()
          .prepare(
            `SELECT c.*,
                    (SELECT COUNT(*) FROM chapters ch WHERE ch.courseId = c.id) AS chapterCount,
                    (SELECT COUNT(*) FROM lessons l JOIN chapters ch ON ch.id = l.chapterId
                      WHERE ch.courseId = c.id) AS lessonCount
             FROM courses c ORDER BY c.sortOrder, c.title`
          )
          .all();
      },
      CACHE_TTL.COURSE_LIST
    );

    res.setHeader('X-Cache', cached ? 'HIT' : 'MISS');
    return res.json({ data });
  } catch (err) {
    console.error('listCourses error:', err);
    return res.status(500).json({ message: 'Failed to load courses' });
  }
};

// GET /api/learn/courses/:slug — outline; includes progress when signed in
export const getCourseOutline = async (req, res) => {
  try {
    const slug = req.params.slug;
    
    // 1. Fetch or compute the public, non-user-specific course outline
    const { data: publicOutline, cached } = await getOrSet(
      CACHE_KEYS.courseOutline(slug),
      () => {
        const db = getDB();
        const course = courseBySlug(slug);
        if (!course) return null;

        const chapterRows = db
          .prepare('SELECT * FROM chapters WHERE courseId = ? ORDER BY position')
          .all(course.id);

        const lessonsByChapter = new Map();
        db.prepare(
          `SELECT l.id, l.position, l.title, l.minutes, l.chapterId
           FROM lessons l JOIN chapters ch ON ch.id = l.chapterId
           WHERE ch.courseId = ? ORDER BY ch.position, l.position`
        )
          .all(course.id)
          .forEach(({ chapterId, ...lesson }) => {
            if (!lessonsByChapter.has(chapterId)) lessonsByChapter.set(chapterId, []);
            lessonsByChapter.get(chapterId).push(lesson);
          });

        const quizCountByChapter = new Map(
          db
            .prepare(
              `SELECT chapterId, COUNT(*) AS n FROM quiz_questions
               WHERE courseId = ? AND chapterId IS NOT NULL GROUP BY chapterId`
            )
            .all(course.id)
            .map((r) => [r.chapterId, r.n])
        );

        const chapters = chapterRows.map((ch) => ({
          ...ch,
          lessons: lessonsByChapter.get(ch.id) ?? [],
          quizCount: quizCountByChapter.get(ch.id) ?? 0,
        }));

        const finalCount = db
          .prepare(
            'SELECT COUNT(*) AS n FROM quiz_questions WHERE courseId = ? AND chapterId IS NULL AND lessonId IS NULL'
          )
          .get(course.id).n;

        // Courses to link on to from the bottom of this one
        const pool = db
          .prepare(
            `SELECT slug, title, summary, level, category, duration
             FROM courses WHERE id != ? ORDER BY title`
          )
          .all(course.id);

        const rank = (other) =>
          (other.category === course.category ? 0 : 2) + (other.level === course.level ? 0 : 1);
        const related = pool.sort((a, b) => rank(a) - rank(b)).slice(0, 4);

        return { ...course, chapters, finalCount, related };
      },
      CACHE_TTL.COURSE_OUTLINE
    );

    if (!publicOutline) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Compute dynamic, user-specific progress ONLY if authenticated
    // Note: Public cached payload contains ZERO user-specific progress or tokens
    let progress = null;
    if (req.user) {
      const db = getDB();
      const enrollment = enrollmentFor(req.user.id, publicOutline.id);
      const gates = computeGates(req.user.id, publicOutline);
      const completed = finishedLessonIds(gates);
      const total = lessonCountFor(publicOutline.id);
      progress = {
        enrolled: Boolean(enrollment),
        enrolledAt: enrollment?.enrolledAt ?? null,
        completedLessonIds: completed,
        readLessonIds: completedLessonIds(req.user.id, publicOutline.id),
        completed: completed.length,
        total,
        percent: total ? Math.round((completed.length / total) * 100) : 0,
        allLessonsDone: total > 0 && completed.length >= total,
        gates,
        certificate: db
          .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
          .get(req.user.id, publicOutline.id) ?? null,
        bestFinalScore:
          db
            .prepare(
              `SELECT MAX(score) AS best FROM quiz_attempts
               WHERE userId = ? AND courseId = ? AND chapterId IS NULL AND lessonId IS NULL`
            )
            .get(req.user.id, publicOutline.id).best ?? null,
      };
    }

    res.setHeader('X-Cache', cached ? 'HIT' : 'MISS');
    return res.json({ data: { ...publicOutline, progress } });
  } catch (err) {
    console.error('getCourseOutline error:', err);
    return res.status(500).json({ message: 'Failed to load course outline' });
  }
};

// POST /api/learn/courses/:slug/enroll
export const enroll = (req, res) => {
  const course = courseBySlug(req.params.slug);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const existing = enrollmentFor(req.user.id, course.id);
  if (existing) return res.json({ message: 'Already enrolled', data: existing });

  const now = new Date().toISOString();
  getDB()
    .prepare('INSERT INTO enrollments (userId, courseId, enrolledAt) VALUES (?, ?, ?)')
    .run(req.user.id, course.id, now);

  res.status(201).json({ message: `Enrolled in ${course.title}`, data: { enrolledAt: now } });
};

// GET /api/learn/my — dashboard
export const myCourses = (req, res) => {
  const db = getDB();
  const rows = db
    .prepare(
      `SELECT c.*, e.enrolledAt, e.completedAt
       FROM enrollments e JOIN courses c ON c.id = e.courseId
       WHERE e.userId = ? ORDER BY e.enrolledAt DESC`
    )
    .all(req.user.id);

  const data = rows.map((course) => {
    const total = lessonCountFor(course.id);
    const completed = finishedLessonIds(computeGates(req.user.id, course)).length;
    return {
      ...course,
      total,
      completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
      certificate:
        db
          .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
          .get(req.user.id, course.id) ?? null,
    };
  });

  res.json({ data });
};
