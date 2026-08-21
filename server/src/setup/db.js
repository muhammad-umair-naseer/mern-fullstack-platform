import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(__dirname, '../..');

class DatabaseWrapper {
  constructor(file) {
    this.raw = new DatabaseSync(file);
  }

  pragma(statement) {
    return this.raw.exec(`PRAGMA ${statement}`);
  }

  exec(sql) {
    return this.raw.exec(sql);
  }

  prepare(sql) {
    return this.raw.prepare(sql);
  }

  transaction(fn) {
    return (...args) => {
      this.raw.exec('BEGIN');
      try {
        const res = fn(...args);
        this.raw.exec('COMMIT');
        return res;
      } catch (e) {
        this.raw.exec('ROLLBACK');
        throw e;
      }
    };
  }
}

let db;

// Column sets are shared with the models so the schema and the insert
// statements can never drift apart.
export const TABLES = {
  contact_messages: `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT    NOT NULL,
      email     TEXT    NOT NULL,
      phone     TEXT,
      subject   TEXT,
      message   TEXT    NOT NULL,
      handled   INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT    NOT NULL,
      updatedAt TEXT    NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages (createdAt DESC);
  `,
  internship_applications: `
    CREATE TABLE IF NOT EXISTS internship_applications (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      phone           TEXT,
      internshipTitle TEXT NOT NULL,
      resumeLink      TEXT,
      coverLetter     TEXT,
      createdAt       TEXT NOT NULL,
      updatedAt       TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_internship_email_title ON internship_applications (email, internshipTitle);
  `,
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT NOT NULL,
      email        TEXT NOT NULL UNIQUE COLLATE NOCASE,
      passwordHash TEXT NOT NULL,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      verifyCode    TEXT,
      verifyExpires TEXT,
      verifySentAt  TEXT,
      verifyAttempts INTEGER NOT NULL DEFAULT 0,
      createdAt    TEXT NOT NULL,
      updatedAt    TEXT NOT NULL
    );
  `,
  courses: `
    CREATE TABLE IF NOT EXISTS courses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
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
      createdAt   TEXT NOT NULL,
      updatedAt   TEXT NOT NULL
    );
  `,
  chapters: `
    CREATE TABLE IF NOT EXISTS chapters (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      title    TEXT NOT NULL,
      summary  TEXT,
      UNIQUE (courseId, position)
    );
  `,
  lessons: `
    CREATE TABLE IF NOT EXISTS lessons (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      chapterId INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      position  INTEGER NOT NULL,
      title     TEXT NOT NULL,
      minutes   INTEGER NOT NULL DEFAULT 10,
      body      TEXT NOT NULL,
      UNIQUE (chapterId, position)
    );
  `,
  quiz_questions: `
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId    INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      chapterId   INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
      position    INTEGER NOT NULL,
      prompt      TEXT NOT NULL,
      options     TEXT NOT NULL,
      answerIndex INTEGER NOT NULL,
      explanation TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_q_chapter ON quiz_questions (chapterId, position);
    CREATE INDEX IF NOT EXISTS idx_q_final ON quiz_questions (courseId, chapterId, position);
  `,
  enrollments: `
    CREATE TABLE IF NOT EXISTS enrollments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      userId      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId    INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      enrolledAt  TEXT NOT NULL,
      completedAt TEXT,
      UNIQUE (userId, courseId)
    );
  `,
  lesson_progress: `
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      userId      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lessonId    INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      completedAt TEXT NOT NULL,
      UNIQUE (userId, lessonId)
    );
  `,
  quiz_attempts: `
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      userId    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId  INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      chapterId INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
      score     INTEGER NOT NULL,
      total     INTEGER NOT NULL,
      passed    INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_attempt_user ON quiz_attempts (userId, courseId);
  `,
  certificates: `
    CREATE TABLE IF NOT EXISTS certificates (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      userId   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      courseId INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      code     TEXT NOT NULL UNIQUE,
      score    INTEGER NOT NULL,
      issuedAt TEXT NOT NULL,
      UNIQUE (userId, courseId)
    );
  `,
};

export const connectDB = async () => {
  const file = path.resolve(SERVER_ROOT, process.env.DATABASE_FILE || 'data/cortexis.db');
  fs.mkdirSync(path.dirname(file), { recursive: true });

  db = new DatabaseWrapper(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  for (const ddl of Object.values(TABLES)) db.exec(ddl);
  migrate(db);

  console.log(`📦 Connected to SQLite at ${path.relative(SERVER_ROOT, file)}`);
  return db;
};

// Additive migrations for databases created before a column existed. SQLite
// has no "ADD COLUMN IF NOT EXISTS", so check the table info first.
const migrate = (db) => {
  const columns = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);
  const additions = [
    ['emailVerified', 'INTEGER NOT NULL DEFAULT 0'],
    ['verifyCode', 'TEXT'],
    ['verifyExpires', 'TEXT'],
    ['verifySentAt', 'TEXT'],
    ['verifyAttempts', 'INTEGER NOT NULL DEFAULT 0'],
  ];

  let added = 0;
  for (const [name, type] of additions) {
    if (!columns.includes(name)) {
      db.exec(`ALTER TABLE users ADD COLUMN ${name} ${type}`);
      added++;
    }
  }

  if (added && columns.length) {
    // Accounts that predate verification keep working; only new signups are gated.
    const { changes } = db.prepare('UPDATE users SET emailVerified = 1 WHERE emailVerified = 0').run();
    if (changes) console.log(`🔁 Marked ${changes} pre-existing account(s) as verified`);
  }
};

export const getDB = () => {
  if (!db) throw new Error('Database not initialised — call connectDB() first');
  return db;
};
