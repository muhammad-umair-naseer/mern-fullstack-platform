import { getDB } from '../../setup/db.js';
import {
  courseBySlug,
  enrollmentFor,
  completedLessonIds,
  lessonCountFor,
  computeGates,
  finishedLessonIds,
  PASS_MARK,
} from './progress.service.js';
import { getOrSet, CACHE_KEYS, CACHE_TTL } from './cache.service.js';
import { finalStatus } from './finalExam.service.js';

/** Catalogue browsing, enrolment, and the learner dashboard. */

export const listCourses = async (_req, res) => {
  try {
    const { data, cached } = await getOrSet(
      CACHE_KEYS.courseList(),
      async () => {
        return getDB()
          .prepare(
            `SELECT c.*,
                    (SELECT COUNT(*) FROM chapters ch WHERE ch.courseId = c.id) AS chapterCount,
                    (SELECT COUNT(*) FROM lessons l JOIN chapters ch ON ch.id = l.chapterId
                      WHERE ch.courseId = c.id) AS lessonCount
             FROM courses c WHERE c.hidden = 0 ORDER BY c.sortOrder, c.title`
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
      async () => {
        const db = getDB();
        const course = await courseBySlug(slug);
        if (!course) return null;

        const chapterRows = await db
          .prepare('SELECT * FROM chapters WHERE courseId = ? ORDER BY position')
          .all(course.id);

        const lessonsByChapter = new Map();
        (await db.prepare(
          `SELECT l.id, l.position, l.title, l.minutes, l.chapterId
           FROM lessons l JOIN chapters ch ON ch.id = l.chapterId
           WHERE ch.courseId = ? ORDER BY ch.position, l.position`
        )
          .all(course.id)).forEach(({ chapterId, ...lesson }) => {
            if (!lessonsByChapter.has(chapterId)) lessonsByChapter.set(chapterId, []);
            lessonsByChapter.get(chapterId).push(lesson);
          });

        const quizCountByChapter = new Map(
          (await db
            .prepare(
              `SELECT chapterId, COUNT(*) AS n FROM quiz_questions
               WHERE courseId = ? AND chapterId IS NOT NULL GROUP BY chapterId`
            )
            .all(course.id)).map((r) => [r.chapterId, r.n])
        );

        const chapters = chapterRows.map((ch) => ({
          ...ch,
          lessons: lessonsByChapter.get(ch.id) ?? [],
          quizCount: quizCountByChapter.get(ch.id) ?? 0,
        }));

        const finalCount = (
          await db
            .prepare(
              'SELECT COUNT(*) AS n FROM quiz_questions WHERE courseId = ? AND chapterId IS NULL AND lessonId IS NULL'
            )
            .get(course.id)
        ).n;

        // Courses to link on to from the bottom of this one
        const pool = await db
          .prepare(
            `SELECT slug, title, summary, level, category, duration
             FROM courses WHERE id != ? AND hidden = 0 ORDER BY title`
          )
          .all(course.id);

        const rank = (other) =>
          (other.category === course.category ? 0 : 2) + (other.level === course.level ? 0 : 1);
        const related = pool.sort((a, b) => rank(a) - rank(b)).slice(0, 4);

        return { ...course, chapters, finalCount, related };
      },
      CACHE_TTL.COURSE_OUTLINE
    );

    // A course the admin took off the website is still open to the learners
    // already enrolled in it, and to nobody else.
    if (
      !publicOutline ||
      (publicOutline.hidden && !(req.user && (await enrollmentFor(req.user.id, publicOutline.id))))
    ) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Compute dynamic, user-specific progress ONLY if authenticated
    // Note: Public cached payload contains ZERO user-specific progress or tokens
    let progress = null;
    if (req.user) {
      const db = getDB();
      const enrollment = await enrollmentFor(req.user.id, publicOutline.id);
      const gates = await computeGates(req.user.id, publicOutline);
      const completed = finishedLessonIds(gates);
      const total = await lessonCountFor(publicOutline.id);
      progress = {
        enrolled: Boolean(enrollment),
        enrolledAt: enrollment?.enrolledAt ?? null,
        completedLessonIds: completed,
        readLessonIds: await completedLessonIds(req.user.id, publicOutline.id),
        completed: completed.length,
        total,
        percent: total ? Math.round((completed.length / total) * 100) : 0,
        allLessonsDone: total > 0 && completed.length >= total,
        gates,
        certificate:
          (await db
            .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
            .get(req.user.id, publicOutline.id)) ?? null,
        // The final exam's rules, attempts and retake date (services/finalExam.service.js).
        final: await finalStatus(req.user.id, publicOutline, gates),
        claudePro: await claudeProStatus(req.user.id, publicOutline.id),
      };
    }

    res.setHeader('X-Cache', cached ? 'HIT' : 'MISS');
    return res.json({ data: { ...publicOutline, progress } });
  } catch (err) {
    console.error('getCourseOutline error:', err);
    return res.status(500).json({ message: 'Failed to load course outline' });
  }
};

// The learner's Claude Pro application for a course, as the admin last set
// it: applied, selected (shortlisted), awarded or rejected. Null until they
// have applied (in_progress is only the study-time tracker).
const claudeProStatus = async (userId, courseId) => {
  const row = await getDB()
    .prepare('SELECT status FROM claude_pro_applications WHERE userId = ? AND courseId = ?')
    .get(userId, courseId);
  return row && row.status !== 'in_progress' ? row.status : null;
};

// POST /api/learn/courses/:slug/enroll
export const enroll = async (req, res) => {
  const course = await courseBySlug(req.params.slug);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const existing = await enrollmentFor(req.user.id, course.id);
  if (existing) return res.json({ message: 'Already enrolled', data: existing });
  if (course.hidden) return res.status(404).json({ message: 'Course not found' });

  const now = new Date().toISOString();
  await getDB()
    .prepare('INSERT INTO enrollments (userId, courseId, enrolledAt) VALUES (?, ?, ?)')
    .run(req.user.id, course.id, now);

  res.status(201).json({ message: `Enrolled in ${course.title}`, data: { enrolledAt: now } });
};

// GET /api/learn/my — dashboard
export const myCourses = async (req, res) => {
  const db = getDB();
  const rows = await db
    .prepare(
      `SELECT c.*, e.enrolledAt, e.completedAt
       FROM enrollments e JOIN courses c ON c.id = e.courseId
       WHERE e.userId = ? ORDER BY e.enrolledAt DESC`
    )
    .all(req.user.id);

  const data = [];
  for (const course of rows) {
    const total = await lessonCountFor(course.id);
    const completed = finishedLessonIds(await computeGates(req.user.id, course)).length;
    data.push({
      ...course,
      total,
      completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
      certificate:
        (await db
          .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
          .get(req.user.id, course.id)) ?? null,
      claudePro: await claudeProStatus(req.user.id, course.id),
    });
  }

  res.json({ data });
};
