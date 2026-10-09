import pg from 'pg';
import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * Pure PostgreSQL Database Layer for Cortexis
 *
 * Exposes a standardized async query interface:
 *   - prepare(sql).get(...args)
 *   - prepare(sql).all(...args)
 *   - prepare(sql).run(...args) -> { changes, lastInsertRowid }
 *   - exec(sql)
 *   - transaction(async () => { ... })
 *
 * Query translation handles:
 *   ?          → $1, $2 ...
 *   @name      → $1 (looked up on object argument)
 *   camelCase  → "camelCase" (preserves exact case in PostgreSQL)
 *   INSERT ... → ... RETURNING * (so run() reports lastInsertRowid)
 */

const CAMEL = /\b([a-z]+(?:[A-Z][A-Za-z0-9]*)+)\b/g;

export const toPostgres = (sql) => {
  const names = [];
  let n = 0;
  const translated = sql
    .replace(/@([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => {
      names.push(name);
      return `$${++n}`;
    })
    .replace(/\?/g, () => `$${++n}`)
    .replace(CAMEL, '"$1"')
    .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'BIGSERIAL PRIMARY KEY')
    // Word-bounded: the DDL already says BIGSERIAL, which must not become BIGBIGSERIAL.
    .replace(/\bSERIAL PRIMARY KEY/gi, 'BIGSERIAL PRIMARY KEY')
    .replace(/ COLLATE NOCASE/gi, '');
  const isInsert = /^\s*INSERT\b/i.test(translated) && !/\bRETURNING\b/i.test(translated);
  return { text: isInsert ? `${translated.trim()} RETURNING *` : translated, names };
};

class PostgresDatabase {
  constructor(url) {
    this.pool = null;
    this.url = url;
    this.scope = new AsyncLocalStorage();
  }

  async open() {
    // Parse PostgreSQL int8 (bigint / BIGSERIAL) as numbers for safe JS arithmetic
    pg.types.setTypeParser(20, (val) => (val === null ? null : parseInt(val, 10)));

    this.pool = new pg.Pool({
      connectionString: this.url,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      max: Number(process.env.DATABASE_POOL_MAX || 20),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Test connection
    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1');
    } finally {
      client.release();
    }
  }

  pragma() {} // No-op for PostgreSQL

  exec(sql) {
    return (this.scope.getStore() ?? this.pool).query(toPostgres(sql).text);
  }

  prepare(sql) {
    const { text, names } = toPostgres(sql);
    const query = (args) => {
      const values =
        names.length && args.length === 1 && args[0] && typeof args[0] === 'object'
          ? names.map((name) => args[0][name] ?? null)
          : args;
      return (this.scope.getStore() ?? this.pool).query(text, values);
    };

    return {
      get: async (...args) => (await query(args)).rows[0],
      all: async (...args) => (await query(args)).rows,
      run: async (...args) => {
        const { rowCount, rows } = await query(args);
        return { changes: rowCount, lastInsertRowid: rows[0]?.id };
      },
    };
  }

  transaction(fn) {
    return async (...args) => {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const res = await this.scope.run(client, () => fn(...args));
        await client.query('COMMIT');
        return res;
      } catch (e) {
        await client.query('ROLLBACK').catch(() => {});
        throw e;
      } finally {
        client.release();
      }
    };
  }

  close() {
    return this.pool?.end();
  }
}

let db;

export const TABLES = {
  meta: `
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `,
  contact_messages: `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id        BIGSERIAL PRIMARY KEY,
      name      TEXT    NOT NULL,
      email     TEXT    NOT NULL,
      phone     TEXT,
      subject   TEXT,
      message   TEXT    NOT NULL,
      handled   INTEGER NOT NULL DEFAULT 0,
      createdAt TIMESTAMPTZ NOT NULL,
      updatedAt TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages (createdAt DESC);
  `,
  internship_applications: `
    CREATE TABLE IF NOT EXISTS internship_applications (
      id              BIGSERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      phone           TEXT,
      internshipTitle TEXT NOT NULL,
      resumeLink      TEXT,
      coverLetter     TEXT,
      createdAt       TIMESTAMPTZ NOT NULL,
      updatedAt       TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_internship_email_title ON internship_applications (email, internshipTitle);
  `,
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id             BIGSERIAL PRIMARY KEY,
      name           TEXT NOT NULL,
      email          TEXT NOT NULL UNIQUE,
      passwordHash   TEXT NOT NULL,
      role           TEXT NOT NULL DEFAULT 'user',
      emailVerified  INTEGER NOT NULL DEFAULT 0,
      verifyCode     TEXT,
      verifyExpires  TEXT,
      verifySentAt   TEXT,
      verifyAttempts INTEGER NOT NULL DEFAULT 0,
      createdAt      TIMESTAMPTZ NOT NULL,
      updatedAt      TIMESTAMPTZ NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
  `,
  courses: `
    CREATE TABLE IF NOT EXISTS courses (
      id          BIGSERIAL PRIMARY KEY,
      slug        TEXT NOT NULL UNIQUE,
      title       TEXT NOT NULL,
      category    TEXT NOT NULL,
      level       TEXT NOT NULL,
      duration    TEXT NOT NULL,
      hours       INTEGER NOT NULL DEFAULT 0,
      summary     TEXT NOT NULL,
      description TEXT,
      coverKey    TEXT,
      accent      TEXT,
      sortOrder   INTEGER NOT NULL DEFAULT 0,
      createdAt   TIMESTAMPTZ NOT NULL,
      updatedAt   TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
    CREATE INDEX IF NOT EXISTS idx_courses_sort ON courses (sortOrder);
  `,
  // Admin edits to a course's card (routes/admin.routes.js). The seeder
  // rewrites courses from the content files whenever they change, so edits
  // live here and are laid back over the seeded row after every seed. A NULL
  // field means "keep what the content file says".
  course_overrides: `
    CREATE TABLE IF NOT EXISTS course_overrides (
      slug        TEXT PRIMARY KEY,
      title       TEXT,
      summary     TEXT,
      description TEXT,
      category    TEXT,
      level       TEXT,
      duration    TEXT,
      updatedAt   TIMESTAMPTZ NOT NULL
    );
  `,
  chapters: `
    CREATE TABLE IF NOT EXISTS chapters (
      id       BIGSERIAL PRIMARY KEY,
      courseId BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      title    TEXT NOT NULL,
      summary  TEXT,
      UNIQUE (courseId, position)
    );
    CREATE INDEX IF NOT EXISTS idx_chapters_courseId ON chapters (courseId);
  `,
  lessons: `
    CREATE TABLE IF NOT EXISTS lessons (
      id        BIGSERIAL PRIMARY KEY,
      chapterId BIGINT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      position  INTEGER NOT NULL,
      title     TEXT NOT NULL,
      minutes   INTEGER NOT NULL DEFAULT 10,
      body      TEXT NOT NULL,
      UNIQUE (chapterId, position)
    );
    CREATE INDEX IF NOT EXISTS idx_lessons_chapterId ON lessons (chapterId);
  `,
  quiz_questions: `
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id          BIGSERIAL PRIMARY KEY,
      courseId    BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      chapterId   BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
      lessonId    BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
      position    INTEGER NOT NULL,
      prompt      TEXT NOT NULL,
      options     TEXT NOT NULL,
      answerIndex INTEGER NOT NULL,
      explanation TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_q_chapter ON quiz_questions (chapterId, position);
    CREATE INDEX IF NOT EXISTS idx_q_final ON quiz_questions (courseId, chapterId, position);
    CREATE INDEX IF NOT EXISTS idx_q_lesson ON quiz_questions (lessonId, position);
  `,
  enrollments: `
    CREATE TABLE IF NOT EXISTS enrollments (
      id          BIGSERIAL PRIMARY KEY,
      userId      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId    BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      enrolledAt  TIMESTAMPTZ NOT NULL,
      completedAt TIMESTAMPTZ,
      UNIQUE (userId, courseId)
    );
    CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments (userId);
    CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments (courseId);
  `,
  lesson_progress: `
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id          BIGSERIAL PRIMARY KEY,
      userId      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lessonId    BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      completedAt TIMESTAMPTZ NOT NULL,
      UNIQUE (userId, lessonId)
    );
    CREATE INDEX IF NOT EXISTS idx_progress_user ON lesson_progress (userId);
    CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON lesson_progress (userId, lessonId);
  `,
  // When a learner first opened each topic. Marking a topic read is refused
  // until MIN_READ_SECONDS have passed since then (see progress.service.js).
  lesson_opens: `
    CREATE TABLE IF NOT EXISTS lesson_opens (
      userId   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lessonId BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      openedAt TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (userId, lessonId)
    );
  `,
  quiz_attempts: `
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id        BIGSERIAL PRIMARY KEY,
      userId    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId  BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      chapterId BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
      lessonId  BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
      score     INTEGER NOT NULL,
      total     INTEGER NOT NULL,
      passed    INTEGER NOT NULL,
      createdAt TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_attempt_user ON quiz_attempts (userId, courseId);
    CREATE INDEX IF NOT EXISTS idx_attempt_created ON quiz_attempts (createdAt DESC);
  `,
  certificates: `
    CREATE TABLE IF NOT EXISTS certificates (
      id       BIGSERIAL PRIMARY KEY,
      userId   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      code     TEXT NOT NULL UNIQUE,
      score    INTEGER NOT NULL,
      issuedAt TIMESTAMPTZ NOT NULL,
      UNIQUE (userId, courseId)
    );
    CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates (code);
  `,
  // One row per final-exam attempt (services/finalExam.service.js). The paper
  // is a snapshot of exactly what was shown, answers in the order shown, so
  // grading and the retake never depend on quiz_questions, which the seeder
  // rewrites whenever course content changes.
  final_attempts: `
    CREATE TABLE IF NOT EXISTS final_attempts (
      id          BIGSERIAL PRIMARY KEY,
      userId      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId    BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      attemptNo   INTEGER NOT NULL,
      token       TEXT NOT NULL,
      paper       JSONB NOT NULL,
      answers     JSONB NOT NULL DEFAULT '{}'::jsonb,
      total       INTEGER NOT NULL,
      pledgedAt   TIMESTAMPTZ NOT NULL,
      startedAt   TIMESTAMPTZ NOT NULL,
      deadline    TIMESTAMPTZ NOT NULL,
      submittedAt TIMESTAMPTZ,
      reason      TEXT,
      correct     INTEGER,
      marks       INTEGER,
      passed      INTEGER,
      blurs       INTEGER NOT NULL DEFAULT 0,
      UNIQUE (userId, courseId, attemptNo)
    );
    CREATE INDEX IF NOT EXISTS idx_final_attempts_user ON final_attempts (userId, courseId);
  `,
  claude_pro_applications: `
    CREATE TABLE IF NOT EXISTS claude_pro_applications (
      id               BIGSERIAL PRIMARY KEY,
      userId           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId         BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      userEmail        TEXT NOT NULL,
      userName         TEXT NOT NULL,
      courseSlug       TEXT NOT NULL,
      courseTitle      TEXT NOT NULL,
      score            INTEGER NOT NULL DEFAULT 0,
      totalMarks       INTEGER NOT NULL DEFAULT 100,
      timeSpentSeconds BIGINT NOT NULL DEFAULT 0,
      lessonsCompleted INTEGER NOT NULL DEFAULT 0,
      totalLessons     INTEGER NOT NULL DEFAULT 0,
      quizzesPassed    INTEGER NOT NULL DEFAULT 0,
      status           TEXT NOT NULL DEFAULT 'in_progress',
      appliedAt        TIMESTAMPTZ,
      completedAt      TIMESTAMPTZ,
      lastActiveAt     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
      createdAt        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (userId, courseId)
    );
    CREATE INDEX IF NOT EXISTS idx_claude_pro_status_score ON claude_pro_applications (status, score DESC, timeSpentSeconds ASC);
    CREATE INDEX IF NOT EXISTS idx_claude_pro_email ON claude_pro_applications (userEmail);
    CREATE INDEX IF NOT EXISTS idx_claude_pro_user ON claude_pro_applications (userId);
    CREATE INDEX IF NOT EXISTS idx_claude_pro_applied_at ON claude_pro_applications (appliedAt DESC);
  `,
};

export const connectDB = async () => {
  const url =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/cortexis_db';

  db = new PostgresDatabase(url);
  await db.open();

  for (const ddl of Object.values(TABLES)) {
    await db.exec(ddl);
  }

  // Non-blocking additive migrations if needed
  await migrate(db);

  console.log(`📦 Connected to PostgreSQL at ${new URL(url).host}`);
  return db;
};

const migrate = async (database) => {
  const additions = [
    ['quiz_questions', 'lessonId', 'BIGINT REFERENCES lessons(id) ON DELETE CASCADE'],
    ['quiz_attempts', 'lessonId', 'BIGINT REFERENCES lessons(id) ON DELETE CASCADE'],
    ['users', 'role', "TEXT NOT NULL DEFAULT 'user'"],
    ['users', 'emailVerified', 'INTEGER NOT NULL DEFAULT 0'],
    ['users', 'verifyCode', 'TEXT'],
    ['users', 'verifyExpires', 'TEXT'],
    ['users', 'verifySentAt', 'TEXT'],
    ['users', 'verifyAttempts', 'INTEGER NOT NULL DEFAULT 0'],
    ['users', 'verifyLockUntil', 'TEXT'],
    // Part of every session token; bumping it signs that account out everywhere.
    ['users', 'tokenVersion', 'INTEGER NOT NULL DEFAULT 0'],
    // 1 = taken off the website by the admin; the seeder never touches it.
    ['courses', 'hidden', 'INTEGER NOT NULL DEFAULT 0'],
  ];

  for (const [table, name, type] of additions) {
    await database.exec(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${name} ${type}`);
  }

  await database.exec('CREATE INDEX IF NOT EXISTS idx_q_lesson ON quiz_questions (lessonId, position)');
};

export const getDB = () => {
  if (!db) throw new Error('Database not initialised — call connectDB() first');
  return db;
};

export const dbEngine = () => 'postgres';

export const closeDB = async () => {
  await db?.close();
  db = undefined;
};
