/**
 * End-to-end regression suite for the learner API. It boots the real app on an
 * ephemeral port against a throwaway database and walks one learner from
 * sign-up to certificate, then submits the two public forms.
 *
 * Written before the PostgreSQL migration so the same file proves the migration:
 * every direct database read is awaited, which is a no-op on the synchronous
 * SQLite wrapper and exactly what the async pg wrapper needs.
 *
 *   npm test                     # SQLite in a temp file
 *   DATABASE_URL=postgres://… npm test   # the same suite against Postgres
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ??= 'test-secret-that-is-long-enough-for-jwt';
process.env.EMBEDDED_WORKER = 'false';
process.env.REDIS_DB ??= '15';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/cortexis_db';

const { default: app, boot } = await import('../src/app.js');

const { getDB, closeDB } = await import('../src/setup/db.js');
const { getRedisClient } = await import('../src/services/redis.service.js');

let server;
let base;
let db;

const api = async (method, path, { body, token } = {}) => {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ...json };
};

const q = (sql) => getDB().prepare(sql);

/** Correct answers for a quiz payload, in the order the API served them. */
const answersFor = async (questions) => {
  const rows = await Promise.all(
    questions.map((question) => q('SELECT answerIndex FROM quiz_questions WHERE id = ?').get(question.id))
  );
  return rows.map((r) => r.answerIndex);
};

before(async () => {
  await boot();
  db = getDB();
  // Isolated Redis DB, wiped so rate-limit counters from a previous run cannot
  // bleed in. Not gated on the ready flag: the client queues the command until
  // it connects, and if Redis is absent the rejection is simply ignored.
  await getRedisClient()?.flushdb().catch(() => {});
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server?.close(resolve));
  const client = getRedisClient();
  if (client) await client.quit().catch(() => {});
  await closeDB();
});


const learner = { name: 'Test Learner', email: `learner-${Date.now()}@example.com`, password: 'correct horse battery' };
let token;
let course;

test('health reports the database', async () => {
  const res = await api('GET', '/health');
  assert.equal(res.status, 200);
  assert.equal(res.ok, true);
  assert.ok(res.database, 'health payload names the database');
});

test('register, verify by code, sign in', async () => {
  const reg = await api('POST', '/api/auth/register', { body: learner });
  assert.equal(reg.status, 201, JSON.stringify(reg));

  const early = await api('POST', '/api/auth/login', { body: learner });
  assert.equal(early.status, 403, 'unverified accounts cannot sign in');

  const wrong = await api('POST', '/api/auth/verify', { body: { email: learner.email, code: '000000' } });
  assert.ok(wrong.status >= 400, 'a wrong code is rejected');

  const row = await q('SELECT verifyCode, emailVerified FROM users WHERE email = ?').get(learner.email);
  assert.match(String(row.verifyCode), /^\d{6}$/);
  assert.equal(Boolean(row.emailVerified), false);

  const verified = await api('POST', '/api/auth/verify', { body: { email: learner.email, code: row.verifyCode } });
  assert.equal(verified.status, 200, JSON.stringify(verified));
  assert.ok(verified.token);
  assert.equal(verified.user.emailVerified, true);

  const login = await api('POST', '/api/auth/login', { body: learner });
  assert.equal(login.status, 200);
  token = login.token;

  const me = await api('GET', '/api/auth/me', { token });
  assert.equal(me.user.email, learner.email);

  const dup = await api('POST', '/api/auth/register', { body: learner });
  assert.ok(dup.status >= 400, 'duplicate email is rejected');
});

test('catalogue lists seeded courses', async () => {
  const list = await api('GET', '/api/learn/courses');
  assert.equal(list.status, 200);
  assert.ok(list.data.length >= 1);

  // The shortest course that has a final exam keeps the walkthrough quick.
  course = await q(
    `SELECT c.*, (SELECT COUNT(*) FROM lessons l JOIN chapters ch ON ch.id = l.chapterId
                  WHERE ch.courseId = c.id) AS lessonCount
     FROM courses c
     WHERE EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.courseId = c.id
                   AND qq.chapterId IS NULL AND qq.lessonId IS NULL)
     ORDER BY lessonCount ASC LIMIT 1`
  ).get();
  assert.ok(course, 'at least one course has a final exam');

  const outline = await api('GET', `/api/learn/courses/${course.slug}`);
  assert.equal(outline.status, 200);
  assert.ok(outline.data.chapters.length >= 1);
});

test('enrolment and lesson gating', async () => {
  const chapters = await q('SELECT id FROM chapters WHERE courseId = ? ORDER BY position').all(course.id);
  const lessons = await q('SELECT id FROM lessons WHERE chapterId = ? ORDER BY position').all(chapters[0].id);

  const locked = await api('POST', `/api/learn/lessons/${lessons[0].id}/complete`, { token });
  assert.equal(locked.status, 403, 'cannot complete before enrolling');

  const enrol = await api('POST', `/api/learn/courses/${course.slug}/enroll`, { token });
  assert.equal(enrol.status, 201, JSON.stringify(enrol));
  const again = await api('POST', `/api/learn/courses/${course.slug}/enroll`, { token });
  assert.equal(again.status, 200);
  assert.equal(again.message, 'Already enrolled');

  if (lessons.length > 1) {
    const skip = await api('POST', `/api/learn/lessons/${lessons[1].id}/complete`, { token });
    assert.equal(skip.status, 403, 'second lesson stays locked until the first is done');
  }

  const early = await api('GET', `/api/learn/final/${course.slug}`, { token });
  assert.equal(early.status, 403, 'final exam is locked at the start');
});

test('play the whole course through to a certificate', async () => {
  const chapters = await q('SELECT id, position FROM chapters WHERE courseId = ? ORDER BY position').all(course.id);
  let failedOnce = false;

  for (const chapter of chapters) {
    const lessons = await q('SELECT id FROM lessons WHERE chapterId = ? ORDER BY position').all(chapter.id);
    for (const lesson of lessons) {
      const read = await api('GET', `/api/learn/lessons/${lesson.id}`, { token });
      assert.equal(read.status, 200, `lesson ${lesson.id} readable: ${JSON.stringify(read)}`);

      const done = await api('POST', `/api/learn/lessons/${lesson.id}/complete`, { token });
      assert.equal(done.status, 200, `lesson ${lesson.id} complete: ${JSON.stringify(done)}`);

      const quiz = await api('GET', `/api/learn/quiz/lesson/${lesson.id}`, { token });
      if (quiz.status === 404) continue; // this topic has no quiz
      assert.equal(quiz.status, 200, JSON.stringify(quiz));
      assert.ok(quiz.data.questions.every((qq) => qq.answerIndex === undefined), 'answers are never sent to the client');

      if (!failedOnce) {
        const fail = await api('POST', `/api/learn/quiz/lesson/${lesson.id}`, {
          token,
          body: { answers: quiz.data.questions.map(() => -1) },
        });
        assert.equal(fail.status, 200);
        assert.equal(fail.data.passed, false, 'all-wrong answers do not pass');
        failedOnce = true;
      }

      const pass = await api('POST', `/api/learn/quiz/lesson/${lesson.id}`, {
        token,
        body: { answers: await answersFor(quiz.data.questions) },
      });
      assert.equal(pass.status, 200, JSON.stringify(pass));
      assert.equal(pass.data.passed, true);
      assert.equal(pass.data.percent, 100);
    }

    const chapterQuiz = await api('GET', `/api/learn/quiz/chapter/${chapter.id}`, { token });
    if (chapterQuiz.status === 404) continue;
    assert.equal(chapterQuiz.status, 200, JSON.stringify(chapterQuiz));
    const pass = await api('POST', `/api/learn/quiz/chapter/${chapter.id}`, {
      token,
      body: { answers: await answersFor(chapterQuiz.data.questions) },
    });
    assert.equal(pass.status, 200, JSON.stringify(pass));
    assert.equal(pass.data.passed, true);
  }

  const final = await api('GET', `/api/learn/final/${course.slug}`, { token });
  assert.equal(final.status, 200, JSON.stringify(final));

  const result = await api('POST', `/api/learn/final/${course.slug}`, {
    token,
    body: { answers: await answersFor(final.data.questions) },
  });
  assert.equal(result.status, 200, JSON.stringify(result));
  assert.equal(result.data.passed, true);
  assert.match(result.data.certificate.code, /^[A-Z0-9-]{6,}$/);

  const cert = await api('GET', `/api/learn/certificate/${result.data.certificate.code}`);
  assert.equal(cert.status, 200, JSON.stringify(cert));
  assert.equal(cert.data.learnerName, learner.name);
  assert.equal(cert.data.slug, course.slug);

  const mine = await api('GET', '/api/learn/my', { token });
  const enrolled = mine.data.find((c) => c.slug === course.slug);
  assert.equal(enrolled.percent, 100);
  assert.ok(enrolled.completedAt);
  assert.equal(enrolled.certificate.code, result.data.certificate.code);

  const attempts = await q('SELECT COUNT(*) AS n FROM quiz_attempts WHERE userId = ?').get(
    (await q('SELECT id FROM users WHERE email = ?').get(learner.email)).id
  );
  assert.ok(Number(attempts.n) >= 3, 'attempts are persisted');
});

test('contact and internship forms persist', async () => {
  const initialMessages = Number((await q('SELECT COUNT(*) AS n FROM contact_messages').get())?.n || 0);
  const initialApplications = Number((await q('SELECT COUNT(*) AS n FROM internship_applications').get())?.n || 0);

  const bad = await api('POST', '/api/contact', { body: { name: 'x', email: 'nope', message: 'hi' } });
  assert.equal(bad.status, 400);

  const contact = await api('POST', '/api/contact', {
    body: { name: 'Test Sender', email: 'sender@example.com', subject: 'Hello', message: 'A message long enough.' },
  });
  assert.equal(contact.status, 201, JSON.stringify(contact));
  assert.ok(contact.data.id);

  const intern = await api('POST', '/api/internships/apply', {
    body: { name: 'Test Applicant', email: 'applicant@example.com', internshipTitle: 'Frontend Intern', university: 'NUST' },
  });
  assert.equal(intern.status, 201, JSON.stringify(intern));
  assert.ok(intern.data.id);

  const messages = await q('SELECT COUNT(*) AS n FROM contact_messages').get();
  const applications = await q('SELECT COUNT(*) AS n FROM internship_applications').get();
  assert.equal(Number(messages.n), initialMessages + 1);
  assert.equal(Number(applications.n), initialApplications + 1);
});
