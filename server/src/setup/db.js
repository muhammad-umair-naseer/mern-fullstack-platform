import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AsyncLocalStorage } from 'node:async_hooks';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(__dirname, '../..');

/**
 * One query API, two engines.
 *
 * Production runs on PostgreSQL (set DATABASE_URL); anything without a URL
 * falls back to a SQLite file, which is all a laptop needs. Both engines
 * expose the same surface — `prepare(sql).get/all/run`, `exec`, `transaction`
 * — and every method returns a promise, so callers never know which one they
 * are talking to. SQL is written once, in SQLite's dialect, and the Postgres
 * driver translates the handful of differences on the way in:
 *
 *   ?            → $1, $2 …       positional placeholders
 *   @name        → $n             named placeholders, looked up on the params object
 *   camelCase    → "camelCase"    Postgres folds unquoted identifiers to lowercase,
 *                                 which would rename every column in every row
 *   INSERT …     → … RETURNING *  so run() can report lastInsertRowid
 *
 * Table names are snake_case and keywords are upper-case in this codebase, so a
 * camelCase token in SQL is always an identifier; no dictionary is needed.
 */

const CAMEL = /\b([a-z]+(?:[A-Z][A-Za-z0-9]*)+)\b/g;

const toPostgres = (sql) => {
  const names = [];
  let n = 0;
  const translated = sql
    .replace(/@([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => {
      names.push(name);
      return `$${++n}`;
    })
    .replace(/\?/g, () => `$${++n}`)
    .replace(CAMEL, '"$1"')
    .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
    .replace(/ COLLATE NOCASE/g, '');
  const isInsert = /^\s*INSERT\b/i.test(translated) && !/\bRETURNING\b/i.test(translated);
  return { text: isInsert ? `${translated.trim()} RETURNING *` : translated, names };
};

// ------------------------------------------------------------------ PostgreSQL

class PostgresDatabase {
  constructor(url) {
    this.pool = null;
    this.url = url;
    this.scope = new AsyncLocalStorage(); // the client of the enclosing transaction, if any
  }

  async open() {
    const { default: pg } = await import('pg');
    pg.types.setTypeParser(20, Number); // COUNT(*) is int8; nothing here overflows a double
    this.pool = new pg.Pool({
      connectionString: this.url,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      max: Number(process.env.DATABASE_POOL_MAX || 10),
    });
    await this.pool.query('SELECT 1');
  }

  pragma() {} // SQLite-only tuning; nothing to do here

  exec(sql) {
    return (this.scope.getStore() ?? this.pool).query(toPostgres(sql).text);
  }

  prepare(sql) {
    const { text, names } = toPostgres(sql);
    const query = (args) => {
      const values = names.length && args.length === 1 && args[0] && typeof args[0] === 'object'
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

// ---------------------------------------------------------------------- SQLite

class SqliteDatabase {
  constructor(file) {
    this.file = file;
    this.raw = null;
  }

  async open() {
    const { DatabaseSync } = await import('node:sqlite');
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    this.raw = new DatabaseSync(this.file);
  }

  pragma(statement) {
    this.raw.exec(`PRAGMA ${statement}`);
  }

  async exec(sql) {
    this.raw.exec(sql);
  }

  prepare(sql) {
    const stmt = this.raw.prepare(sql);
    return {
      get: async (...args) => stmt.get(...args),
      all: async (...args) => stmt.all(...args),
      run: async (...args) => stmt.run(...args),
    };
  }

  transaction(fn) {
    return async (...args) => {
      this.raw.exec('BEGIN');
      try {
        const res = await fn(...args);
        this.raw.exec('COMMIT');
        return res;
      } catch (e) {
        this.raw.exec('ROLLBACK');
        throw e;
      }
    };
  }

  async close() {
    this.raw?.close();
  }
}

let db;
let engine = 'sqlite';

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
      lessonId    INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
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
      lessonId  INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
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
  // Small key/value store for things like the content fingerprint the seeder
  // uses to skip work when nothing changed.
  meta: `
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `,
};

export const connectDB = async () => {
  const url = process.env.DATABASE_URL;
  if (url) {
    engine = 'postgres';
    db = new PostgresDatabase(url);
    await db.open();
  } else {
    engine = 'sqlite';
    const file = path.resolve(SERVER_ROOT, process.env.DATABASE_FILE || 'data/cortexis.db');
    db = new SqliteDatabase(file);
    await db.open();
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }

  for (const ddl of Object.values(TABLES)) await db.exec(ddl);
  await migrate(db);

  console.log(
    engine === 'postgres'
      ? `📦 Connected to PostgreSQL at ${new URL(url).host}`
      : `📦 Connected to SQLite at ${path.relative(SERVER_ROOT, db.file)}`
  );
  return db;
};

// Additive migrations for databases created before a column existed.
const migrate = async (db) => {
  const additions = [
    ['quiz_questions', 'lessonId', 'INTEGER REFERENCES lessons(id) ON DELETE CASCADE'],
    ['quiz_attempts', 'lessonId', 'INTEGER REFERENCES lessons(id) ON DELETE CASCADE'],
    ['users', 'emailVerified', 'INTEGER NOT NULL DEFAULT 0'],
    ['users', 'verifyCode', 'TEXT'],
    ['users', 'verifyExpires', 'TEXT'],
    ['users', 'verifySentAt', 'TEXT'],
    ['users', 'verifyAttempts', 'INTEGER NOT NULL DEFAULT 0'],
  ];

  if (engine === 'postgres') {
    for (const [table, name, type] of additions) {
      await db.exec(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${name} ${type}`);
    }
  } else {
    // SQLite has no "ADD COLUMN IF NOT EXISTS", so check the table info first.
    const columnsOf = async (table) =>
      (await db.prepare(`PRAGMA table_info(${table})`).all()).map((c) => c.name);
    let userColumnsAdded = 0;
    const userColumns = await columnsOf('users');
    for (const [table, name, type] of additions) {
      const columns = table === 'users' ? userColumns : await columnsOf(table);
      if (columns.includes(name)) continue;
      await db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
      console.log(`🔁 ${table}.${name} added`);
      if (table === 'users') userColumnsAdded++;
    }
    if (userColumnsAdded && userColumns.length) {
      // Accounts that predate verification keep working; only new signups are gated.
      const { changes } = await db.prepare('UPDATE users SET emailVerified = 1 WHERE emailVerified = 0').run();
      if (changes) console.log(`🔁 Marked ${changes} pre-existing account(s) as verified`);
    }
  }

  // Created here rather than in the DDL block, which runs before migrations and
  // therefore cannot reference a column the migration is about to add.
  await db.exec('CREATE INDEX IF NOT EXISTS idx_q_lesson ON quiz_questions (lessonId, position)');
};

export const getDB = () => {
  if (!db) throw new Error('Database not initialised — call connectDB() first');
  return db;
};

export const dbEngine = () => engine;

export const closeDB = async () => {
  await db?.close();
  db = undefined;
};
