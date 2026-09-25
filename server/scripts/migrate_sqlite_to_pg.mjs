import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQLITE_FILE = path.resolve(__dirname, '../data/cortexis.db');
const PG_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cortexis_db';

console.log('🚀 Starting Data Migration: SQLite -> PostgreSQL');
console.log(`Source SQLite: ${SQLITE_FILE}`);
console.log(`Target Postgres: ${PG_URL.replace(/:[^:@]+@/, ':****@')}`);

const sqlite = new DatabaseSync(SQLITE_FILE);
const pool = new pg.Pool({ connectionString: PG_URL });

const TABLES_DDL = [
  // 1. Meta (Key-Value)
  `CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );`,

  // 2. Users (Scalable BIGSERIAL, unique email, verification tracking)
  `CREATE TABLE IF NOT EXISTS users (
    id             BIGSERIAL PRIMARY KEY,
    name           TEXT NOT NULL,
    email          TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "emailVerified" INTEGER NOT NULL DEFAULT 0,
    "verifyCode"    TEXT,
    "verifyExpires" TEXT,
    "verifySentAt"  TEXT,
    "verifyAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMPTZ NOT NULL,
    "updatedAt"    TIMESTAMPTZ NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
  `,

  // 3. Courses
  `CREATE TABLE IF NOT EXISTS courses (
    id          BIGSERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    title       TEXT NOT NULL,
    category    TEXT NOT NULL,
    level       TEXT NOT NULL,
    duration    TEXT NOT NULL,
    hours       INTEGER NOT NULL DEFAULT 0,
    summary     TEXT NOT NULL,
    description TEXT,
    "coverKey"  TEXT,
    accent      TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
  CREATE INDEX IF NOT EXISTS idx_courses_sort ON courses ("sortOrder");
  `,

  // 4. Chapters
  `CREATE TABLE IF NOT EXISTS chapters (
    id         BIGSERIAL PRIMARY KEY,
    "courseId" BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    position   INTEGER NOT NULL,
    title      TEXT NOT NULL,
    summary    TEXT,
    UNIQUE ("courseId", position)
  );
  CREATE INDEX IF NOT EXISTS idx_chapters_courseId ON chapters ("courseId");
  `,

  // 5. Lessons
  `CREATE TABLE IF NOT EXISTS lessons (
    id          BIGSERIAL PRIMARY KEY,
    "chapterId" BIGINT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    position    INTEGER NOT NULL,
    title       TEXT NOT NULL,
    minutes     INTEGER NOT NULL DEFAULT 10,
    body        TEXT NOT NULL,
    UNIQUE ("chapterId", position)
  );
  CREATE INDEX IF NOT EXISTS idx_lessons_chapterId ON lessons ("chapterId");
  `,

  // 6. Quiz Questions
  `CREATE TABLE IF NOT EXISTS quiz_questions (
    id          BIGSERIAL PRIMARY KEY,
    "courseId"  BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    "chapterId" BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
    "lessonId"  BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    position    INTEGER NOT NULL,
    prompt      TEXT NOT NULL,
    options     TEXT NOT NULL,
    "answerIndex" INTEGER NOT NULL,
    explanation TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_q_chapter ON quiz_questions ("chapterId", position);
  CREATE INDEX IF NOT EXISTS idx_q_final ON quiz_questions ("courseId", "chapterId", position);
  CREATE INDEX IF NOT EXISTS idx_q_lesson ON quiz_questions ("lessonId", position);
  `,

  // 7. Enrollments
  `CREATE TABLE IF NOT EXISTS enrollments (
    id          BIGSERIAL PRIMARY KEY,
    "userId"    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "courseId"  BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    "enrolledAt" TIMESTAMPTZ NOT NULL,
    "completedAt" TIMESTAMPTZ,
    UNIQUE ("userId", "courseId")
  );
  CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments ("userId");
  CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments ("courseId");
  `,

  // 8. Lesson Progress
  `CREATE TABLE IF NOT EXISTS lesson_progress (
    id          BIGSERIAL PRIMARY KEY,
    "userId"    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "lessonId"  BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    "completedAt" TIMESTAMPTZ NOT NULL,
    UNIQUE ("userId", "lessonId")
  );
  CREATE INDEX IF NOT EXISTS idx_progress_user ON lesson_progress ("userId");
  CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON lesson_progress ("userId", "lessonId");
  `,

  // 9. Quiz Attempts
  `CREATE TABLE IF NOT EXISTS quiz_attempts (
    id          BIGSERIAL PRIMARY KEY,
    "userId"    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "courseId"  BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    "chapterId" BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
    "lessonId"  BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    score       INTEGER NOT NULL,
    total       INTEGER NOT NULL,
    passed      INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_attempt_user ON quiz_attempts ("userId", "courseId");
  CREATE INDEX IF NOT EXISTS idx_attempt_created ON quiz_attempts ("createdAt" DESC);
  `,

  // 10. Certificates
  `CREATE TABLE IF NOT EXISTS certificates (
    id         BIGSERIAL PRIMARY KEY,
    "userId"   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "courseId" BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    code       TEXT NOT NULL UNIQUE,
    score      INTEGER NOT NULL,
    "issuedAt" TIMESTAMPTZ NOT NULL,
    UNIQUE ("userId", "courseId")
  );
  CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates (code);
  `,

  // 11. Contact Messages
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    subject     TEXT,
    message     TEXT NOT NULL,
    handled     INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages ("createdAt" DESC);
  `,

  // 12. Internship Applications
  `CREATE TABLE IF NOT EXISTS internship_applications (
    id                BIGSERIAL PRIMARY KEY,
    name              TEXT NOT NULL,
    email             TEXT NOT NULL,
    phone             TEXT,
    "internshipTitle" TEXT NOT NULL,
    "resumeLink"      TEXT,
    "coverLetter"     TEXT,
    "createdAt"       TIMESTAMPTZ NOT NULL,
    "updatedAt"       TIMESTAMPTZ NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_internship_email_title ON internship_applications (email, "internshipTitle");
  `,

  // 13. Course Registrations (if any legacy rows)
  `CREATE TABLE IF NOT EXISTS course_registrations (
    id            BIGSERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT,
    "courseTitle" TEXT NOT NULL,
    level         TEXT,
    notes         TEXT,
    "createdAt"   TIMESTAMPTZ NOT NULL,
    "updatedAt"   TIMESTAMPTZ NOT NULL
  );`
];

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('1️⃣ Creating PostgreSQL Schema & Indexes...');
    await client.query('BEGIN');
    for (const ddl of TABLES_DDL) {
      await client.query(ddl);
    }
    await client.query('COMMIT');
    console.log('   ✅ Schema & Indexes created successfully.');

    // Ordered list of tables to migrate respecting foreign keys
    const migrationOrder = [
      'meta',
      'users',
      'courses',
      'chapters',
      'lessons',
      'quiz_questions',
      'enrollments',
      'lesson_progress',
      'quiz_attempts',
      'certificates',
      'contact_messages',
      'internship_applications',
      'course_registrations'
    ];

    console.log('\n2️⃣ Transferring rows from SQLite to PostgreSQL...');

    // Get list of existing tables in SQLite
    const sqliteTables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(r => r.name);

    for (const table of migrationOrder) {
      if (!sqliteTables.includes(table)) {
        console.log(`   ⏩ Table ${table} not present in SQLite, skipping.`);
        continue;
      }

      const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
      if (rows.length === 0) {
        console.log(`   ℹ️ Table ${table}: 0 rows in SQLite.`);
        continue;
      }

      // Read columns
      const cols = Object.keys(rows[0]);
      const quotedCols = cols.map(c => `"${c}"`).join(', ');
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

      await client.query('BEGIN');
      // Truncate target table before inserting (in case of rerun)
      await client.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);

      const insertQuery = `INSERT INTO "${table}" (${quotedCols}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

      for (const row of rows) {
        const values = cols.map(c => {
          let val = row[c];
          // Handle ISO dates for TIMESTAMPTZ
          if ((c.endsWith('At') || c === 'verifyExpires') && val && typeof val === 'string') {
            try {
              const d = new Date(val);
              if (!isNaN(d.getTime())) val = d.toISOString();
            } catch (e) {}
          }
          return val;
        });
        await client.query(insertQuery, values);
      }

      await client.query('COMMIT');
      console.log(`   ✅ Table ${table}: Migrated ${rows.length} rows.`);

      // Reset sequence if table has an id column
      if (cols.includes('id')) {
        const seqRes = await client.query(`
          SELECT pg_get_serial_sequence($1, 'id') AS seq;
        `, [table]);
        const seqName = seqRes.rows[0]?.seq;
        if (seqName) {
          await client.query(`
            SELECT setval($1, COALESCE((SELECT MAX(id) FROM "${table}"), 1));
          `, [seqName]);
          console.log(`      🔄 Sequence reset for ${table}`);
        }
      }
    }

    console.log('\n3️⃣ Starting Complete Verification Check...');
    let allMatched = true;

    for (const table of migrationOrder) {
      if (!sqliteTables.includes(table)) continue;

      const sqliteCount = sqlite.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get().cnt;
      const pgRes = await client.query(`SELECT COUNT(*) as cnt FROM "${table}"`);
      const pgCount = parseInt(pgRes.rows[0].cnt, 10);

      const status = (sqliteCount === pgCount) ? 'MATCH ✅' : 'MISMATCH ❌';
      if (sqliteCount !== pgCount) allMatched = false;

      console.log(`   Table ${table.padEnd(24)} -> SQLite: ${String(sqliteCount).padStart(5)} | PG: ${String(pgCount).padStart(5)} | ${status}`);
    }

    if (!allMatched) {
      throw new Error('Verification failed! Row counts do not match.');
    }

    console.log('\n🎉 ALL DATA TRANSFERRED AND 100% VERIFIED!');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Migration Error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
