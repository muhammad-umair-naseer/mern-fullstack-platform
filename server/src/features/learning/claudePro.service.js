import { getDB } from '../../setup/db.js';

/**
 * Claude Pro Incentive & Learning Telemetry Service
 *
 * Designed for millions of learner records:
 * - Single consolidated row per (userId, courseId) with UNIQUE constraint
 * - Atomic upsert on heartbeats (O(1) execution without table scans or bloat)
 * - Indexed by (status, score DESC, timeSpentSeconds ASC) for instant sub-ms admin candidate selection
 */

// The learner's page sends a heartbeat about every 30 s of visible study.
export const HEARTBEAT_SEC = 30;

/**
 * Atomically track active study time and update learner progress.
 *
 * Only enrolled learners are tracked, and the time credited is measured here:
 * the gap since this row's last heartbeat, capped at one heartbeat interval.
 * Whatever the client claims, a learner cannot bank more than wall-clock time.
 */
export const trackTimeAndProgress = async ({ userId, courseId, courseSlug }) => {
  if (!userId) return null;
  const db = getDB();

  // Validate course
  let course;
  if (courseId) {
    course = await db.prepare('SELECT id, slug, title FROM courses WHERE id = ?').get(courseId);
  } else if (courseSlug) {
    course = await db.prepare('SELECT id, slug, title FROM courses WHERE slug = ?').get(courseSlug);
  }
  if (!course) return null;

  // Fetch user info
  const user = await db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId);
  if (!user) return null;
  if (!(await db.prepare('SELECT 1 FROM enrollments WHERE userId = ? AND courseId = ?').get(userId, course.id))) {
    return null;
  }

  const now = new Date().toISOString();

  // Count lessons completed by this learner for this course
  const progressRow = await db.prepare(
    `SELECT COUNT(DISTINCT lp.lessonId) AS done
     FROM lesson_progress lp
     JOIN lessons l ON l.id = lp.lessonId
     JOIN chapters ch ON ch.id = l.chapterId
     WHERE lp.userId = ? AND ch.courseId = ?`
  ).get(userId, course.id);
  const lessonsCompleted = progressRow?.done || 0;

  // Count total lessons
  const totalRow = await db.prepare(
    `SELECT COUNT(*) AS total
     FROM lessons l
     JOIN chapters ch ON ch.id = l.chapterId
     WHERE ch.courseId = ?`
  ).get(course.id);
  const totalLessons = totalRow?.total || 0;

  // Check if certificate exists (already completed)
  const cert = await db.prepare('SELECT score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?').get(userId, course.id);
  const isCertified = Boolean(cert);

  // Atomic UPSERT
  const sql = `
    INSERT INTO claude_pro_applications (
      userId, courseId, userEmail, userName, courseSlug, courseTitle,
      score, totalMarks, timeSpentSeconds, lessonsCompleted, totalLessons,
      status, appliedAt, completedAt, lastActiveAt, createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, 100, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT (userId, courseId) DO UPDATE SET
      timeSpentSeconds = claude_pro_applications.timeSpentSeconds + FLOOR(LEAST(${HEARTBEAT_SEC}, GREATEST(0,
        EXTRACT(EPOCH FROM (EXCLUDED.lastActiveAt - claude_pro_applications.lastActiveAt)))))::bigint,
      lessonsCompleted = GREATEST(claude_pro_applications.lessonsCompleted, EXCLUDED.lessonsCompleted),
      totalLessons = EXCLUDED.totalLessons,
      score = GREATEST(claude_pro_applications.score, EXCLUDED.score),
      -- only a learner still in progress moves on; an admin's decision stays
      status = CASE
        WHEN claude_pro_applications.status = 'in_progress' THEN EXCLUDED.status
        ELSE claude_pro_applications.status
      END,
      appliedAt = COALESCE(claude_pro_applications.appliedAt, EXCLUDED.appliedAt),
      completedAt = COALESCE(claude_pro_applications.completedAt, EXCLUDED.completedAt),
      lastActiveAt = EXCLUDED.lastActiveAt,
      updatedAt = EXCLUDED.updatedAt
    RETURNING *;
  `;

  const initialStatus = isCertified ? 'applied' : 'in_progress';
  const initialAppliedAt = isCertified ? (cert.issuedAt || now) : null;
  const initialScore = cert?.score || 0;

  const row = await db.prepare(sql).get(
    userId,
    course.id,
    user.email,
    user.name || user.email.split('@')[0],
    course.slug,
    course.title,
    initialScore,
    HEARTBEAT_SEC,
    lessonsCompleted,
    totalLessons,
    initialStatus,
    initialAppliedAt,
    isCertified ? now : null,
    now,
    now,
    now
  );

  return row;
};

/**
 * Record successful course completion and automatically apply for 1-Month Free Claude Pro.
 * Called only when a certificate is issued (certificate.service.js), with its score.
 */
export const recordClaudeProApplication = async ({ userId, courseId, courseSlug, score }) => {
  if (!userId) return null;
  const db = getDB();

  let course;
  if (courseId) {
    course = await db.prepare('SELECT id, slug, title FROM courses WHERE id = ?').get(courseId);
  } else if (courseSlug) {
    course = await db.prepare('SELECT id, slug, title FROM courses WHERE slug = ?').get(courseSlug);
  }
  if (!course) return null;

  const user = await db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId);
  if (!user) return null;

  const now = new Date().toISOString();
  const numericScore = parseInt(score, 10) || 0;

  const sql = `
    INSERT INTO claude_pro_applications (
      userId, courseId, userEmail, userName, courseSlug, courseTitle,
      score, totalMarks, timeSpentSeconds,
      status, appliedAt, completedAt, lastActiveAt, createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, 100, 60,
      'applied', ?, ?, ?, ?, ?
    )
    ON CONFLICT (userId, courseId) DO UPDATE SET
      score = GREATEST(claude_pro_applications.score, EXCLUDED.score),
      -- a retake only raises the score; it never reopens an admin's decision
      status = CASE
        WHEN claude_pro_applications.status IN ('selected', 'awarded', 'rejected') THEN claude_pro_applications.status
        ELSE 'applied'
      END,
      appliedAt = COALESCE(claude_pro_applications.appliedAt, EXCLUDED.appliedAt),
      completedAt = COALESCE(claude_pro_applications.completedAt, EXCLUDED.completedAt),
      lastActiveAt = EXCLUDED.lastActiveAt,
      updatedAt = EXCLUDED.updatedAt
    RETURNING *;
  `;

  const row = await db.prepare(sql).get(
    userId,
    course.id,
    user.email,
    user.name || user.email.split('@')[0],
    course.slug,
    course.title,
    numericScore,
    now,
    now,
    now,
    now,
    now
  );

  return row;
};

/**
 * Get current learner's Claude Pro application status for a given course
 */
export const getLearnerClaudeProStatus = async (userId, courseSlug) => {
  if (!userId || !courseSlug) return { status: 'not_enrolled', applied: false };
  const db = getDB();

  const course = await db.prepare('SELECT id, slug, title FROM courses WHERE slug = ?').get(courseSlug);
  if (!course) return { status: 'course_not_found', applied: false };

  const row = await db.prepare(
    'SELECT * FROM claude_pro_applications WHERE userId = ? AND courseId = ?'
  ).get(userId, course.id);

  if (!row) {
    return {
      applied: false,
      status: 'in_progress',
      score: 0,
      timeSpentSeconds: 0,
      appliedAt: null,
      courseTitle: course.title,
    };
  }

  return {
    applied: ['applied', 'selected', 'awarded', 'rejected'].includes(row.status),
    status: row.status,
    score: row.score,
    timeSpentSeconds: row.timeSpentSeconds,
    timeSpentMinutes: Math.round(row.timeSpentSeconds / 60),
    appliedAt: row.appliedAt,
    completedAt: row.completedAt,
    courseTitle: row.courseTitle,
  };
};

/**
 * List Claude Pro applicants for Admin selection
 * Handles millions of records via index-optimized pagination and filtering
 */
export const listClaudeProApplicants = async ({
  status = 'applied',
  courseSlug,
  sortBy = 'score',
  order = 'desc',
  page = 1,
  limit = 50,
  search = '',
} = {}) => {
  const db = getDB();
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const offset = (pageNum - 1) * limitNum;

  const whereConditions = [];
  const params = [];

  if (status && status !== 'all') {
    whereConditions.push('status = ?');
    params.push(status);
  }

  if (courseSlug) {
    whereConditions.push('courseSlug = ?');
    params.push(courseSlug);
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    whereConditions.push('(LOWER(userEmail) LIKE ? OR LOWER(userName) LIKE ?)');
    params.push(q, q);
  }

  const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Order sorting: indexed on (status, score DESC, timeSpentSeconds ASC)
  let orderClause = 'ORDER BY score DESC, timeSpentSeconds ASC, appliedAt DESC';
  if (sortBy === 'timeSpent') {
    orderClause = order === 'asc' ? 'ORDER BY timeSpentSeconds ASC' : 'ORDER BY timeSpentSeconds DESC';
  } else if (sortBy === 'appliedAt') {
    orderClause = order === 'asc' ? 'ORDER BY appliedAt ASC' : 'ORDER BY appliedAt DESC';
  } else if (sortBy === 'score') {
    orderClause = order === 'asc' ? 'ORDER BY score ASC, timeSpentSeconds DESC' : 'ORDER BY score DESC, timeSpentSeconds ASC';
  }

  // Count total matching
  const countSql = `SELECT COUNT(*) AS total FROM claude_pro_applications ${whereClause}`;
  const totalRow = await db.prepare(countSql).get(...params);
  const total = totalRow?.total || 0;

  // Retrieve paginated records
  const querySql = `
    SELECT id, userId, courseId, userEmail, userName, courseSlug, courseTitle,
           score, totalMarks, timeSpentSeconds, lessonsCompleted, totalLessons,
           status, appliedAt, completedAt, lastActiveAt, createdAt
    FROM claude_pro_applications
    ${whereClause}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;

  const rows = await db.prepare(querySql).all(...params, limitNum, offset);

  const applicants = rows.map((r) => {
    const minutes = Math.floor(r.timeSpentSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remMin = minutes % 60;
    const formattedTime = hours > 0 ? `${hours}h ${remMin}m` : `${remMin}m`;

    return {
      ...r,
      timeSpentFormatted: formattedTime,
    };
  });

  return {
    applicants,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Update candidate status (e.g. admin selects user for Claude Pro access)
 */
export const updateApplicantStatus = async (id, status, notes = '') => {
  const db = getDB();
  const validStatus = ['in_progress', 'applied', 'selected', 'awarded', 'rejected'];
  if (!validStatus.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatus.join(', ')}`);
  }

  const now = new Date().toISOString();
  const res = await db.prepare(
    `UPDATE claude_pro_applications
     SET status = ?, updatedAt = ?
     WHERE id = ?
     RETURNING *`
  ).get(status, now, id);

  return res;
};
