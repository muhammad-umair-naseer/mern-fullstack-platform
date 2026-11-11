/**
 * End-to-end regression suite for the learner API. It boots the real app on an
 * ephemeral port against a throwaway database and walks one learner from
 * sign-up to certificate, then submits the two public forms.
 *
 * Written before the PostgreSQL migration so the same file proves the migration:
 * every direct database read is awaited, which is a no-op on the synchronous
 * SQLite wrapper and exactly what the async pg wrapper needs.
 *
 *   npm test                     # requires explicit scratch PostgreSQL URL
 *   DATABASE_URL=postgres://… npm test   # the same suite against Postgres
 */
import { test, before, beforeEach, after, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ??= 'test-secret-that-is-long-enough-for-jwt';
process.env.EMBEDDED_WORKER = 'false';
// This suite talks directly to Express; no reverse proxy overwrites headers.
process.env.TRUST_PROXY = 'false';
process.env.CORS_ORIGINS = 'http://localhost:3000';
process.env.REDIS_DB ??= '15';
if (!process.env.DATABASE_URL || !/^cortexis_(test|audit)/.test(new URL(process.env.DATABASE_URL).pathname.slice(1))) throw new Error('Set DATABASE_URL to an isolated cortexis_test* database');
process.env.REDIS_DISABLED = 'true';
process.env.SMTP_HOST = 'smtp.test.invalid'; process.env.SMTP_USER = 'test@example.com'; process.env.SMTP_PASS = 'synthetic';
process.env.CONTACT_TO = 'contact@example.com'; process.env.ADMIN_ALERT_TO = 'admin@example.com';
const codes = new Map();
const nodemailer = (await import('nodemailer')).default;
mock.method(nodemailer, 'createTransport', () => ({ sendMail: async message => {
  const code = message.text?.match(/verification code is (\d{6})/); if (code) codes.set(message.to, code[1]);
  return { accepted: [message.to], rejected: [] };
}, close() {} }));
process.env.ADMIN_EMAIL ??= 'admin@example.com';
process.env.ADMIN_PASSWORD ??= 'an-admin-password-for-tests';

const { default: app, boot } = await import('../src/app.js');

const { getDB, closeDB } = await import('../src/setup/db.js');
const { closeRedis } = await import('../src/services/redis.service.js');
const { resetTestLimits, closeLimiters } = await import('../src/middleware/rateLimiter.js');
beforeEach(() => resetTestLimits());

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
  // Reset this suite's limiter counters only; never flush a shared Redis DB.
  await resetTestLimits();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server?.close(resolve));
  await closeRedis(); closeLimiters();
  await closeDB();
});


const learner = { name: 'Test Learner', email: `learner-${Date.now()}@example.com`, password: 'correct horse battery' };
let token;
let course;

test('public health is up-or-down and the version only', async () => {
  const res = await api('GET', '/health');
  assert.equal(res.status, 200);
  assert.equal(res.ok, true);
  assert.ok(res.version, 'health names the version');
  assert.equal(res.redis, undefined, 'infrastructure detail is for the admin only');
});

test('register, verify by code, sign in', async () => {
  const reg = await api('POST', '/api/auth/register', { body: learner });
  assert.equal(reg.status, 201, JSON.stringify(reg));

  const early = await api('POST', '/api/auth/login', { body: learner });
  assert.equal(early.status, 403, 'unverified accounts cannot sign in');

  const wrong = await api('POST', '/api/auth/verify', { body: { email: learner.email, code: '000000' } });
  assert.ok(wrong.status >= 400, 'a wrong code is rejected');

  const row = await q('SELECT verifyCode, emailVerified FROM users WHERE email = ?').get(learner.email);
  assert.match(String(row.verifyCode), /^[a-f0-9]{64}$/);
  assert.equal(Boolean(row.emailVerified), false);

  const verified = await api('POST', '/api/auth/verify', { body: { email: learner.email, code: codes.get(learner.email) } });
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
  assert.equal(early.status, 200, JSON.stringify(early));
  assert.equal(early.data.state, 'locked', 'final exam is locked at the start');
  const cannot = await api('POST', `/api/learn/final/${course.slug}/start`, { token, body: { pledge: true } });
  assert.equal(cannot.status, 403, 'a locked final exam cannot be started');
});

test('play the whole course through to a certificate', async () => {
  const chapters = await q('SELECT id, position FROM chapters WHERE courseId = ? ORDER BY position').all(course.id);
  let failedOnce = false;
  let checkedReadingTime = false;

  for (const chapter of chapters) {
    const lessons = await q('SELECT id FROM lessons WHERE chapterId = ? ORDER BY position').all(chapter.id);
    for (const lesson of lessons) {
      const read = await api('GET', `/api/learn/lessons/${lesson.id}`, { token });
      assert.equal(read.status, 200, `lesson ${lesson.id} readable: ${JSON.stringify(read)}`);
      assert.ok(read.data.readSecondsLeft > 0, 'opening a topic starts its reading clock');

      if (!checkedReadingTime) {
        const tooSoon = await api('POST', `/api/learn/lessons/${lesson.id}/complete`, { token });
        assert.equal(tooSoon.status, 403, 'a topic cannot be marked read straight after opening it');
        assert.ok(tooSoon.data.readSecondsLeft > 0, 'the refusal says how long is left');
        checkedReadingTime = true;
      }
      // Stand in for the reading time rather than waiting it out.
      await q(`UPDATE lesson_opens SET openedAt = openedAt - INTERVAL '2 minutes'
               WHERE lessonId = ? AND userId = (SELECT id FROM users WHERE email = ?)`).run(lesson.id, learner.email);

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
        assert.ok(fail.data.review.every((r) => r.correct === undefined && r.explanation === undefined), 'a failed attempt never shows the answers');
        failedOnce = true;
      }

      const pass = await api('POST', `/api/learn/quiz/lesson/${lesson.id}`, {
        token,
        body: { answers: await answersFor(quiz.data.questions) },
      });
      assert.equal(pass.status, 200, JSON.stringify(pass));
      assert.equal(pass.data.passed, true);
      assert.equal(pass.data.percent, 100);
      assert.ok(pass.data.review.every((r) => Number.isInteger(r.correct)), 'a pass shows the answers');
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

  const userId = (await q('SELECT id FROM users WHERE email = ?').get(learner.email)).id;
  const final = await api('GET', `/api/learn/final/${course.slug}`, { token });
  assert.equal(final.status, 200, JSON.stringify(final));
  assert.equal(final.data.state, 'ready');
  assert.equal(final.data.rules.questions, 50);
  assert.equal(final.data.rules.passMarks, 50);
  assert.equal(final.data.questions, undefined, 'the status never carries questions');

  const noPledge = await api('POST', `/api/learn/final/${course.slug}/start`, { token, body: {} });
  assert.equal(noPledge.status, 400, 'the honesty pledge is required');

  // Attempt 1: every answer wrong.
  const first = await api('POST', `/api/learn/final/${course.slug}/start`, { token, body: { pledge: true } });
  assert.equal(first.status, 201, JSON.stringify(first));
  const pool = await q('SELECT prompt, options FROM quiz_questions WHERE courseId = ? AND chapterId IS NULL AND lessonId IS NULL').all(course.id);
  assert.equal(first.data.questions.length, Math.min(50, pool.length));
  assert.ok(first.data.questions.every((qq) => qq.answer === undefined && qq.answerIndex === undefined), 'answers are never sent');
  const optionsOf = new Map(pool.map((r) => [r.prompt, JSON.parse(r.options).slice().sort().join('|')]));
  assert.ok(first.data.questions.every((qq) => optionsOf.get(qq.prompt) === qq.options.slice().sort().join('|')), 'questions and options are the real ones, reordered');
  const minutes = (new Date(first.data.deadline) - new Date(first.data.startedAt)) / 60000;
  assert.equal(minutes, 60);

  const paperOf = async (n) => (await q('SELECT paper FROM final_attempts WHERE userId = ? AND courseId = ? AND attemptNo = ?').get(userId, course.id, n)).paper;
  const paper1 = await paperOf(1);
  for (const qq of first.data.questions) {
    const wrong = (paper1[qq.i].answer + 1) % qq.options.length;
    const saved = await api('POST', `/api/learn/final/${course.slug}/answer`, { token, body: { token: first.data.token, i: qq.i, choice: wrong } });
    assert.equal(saved.status, 200, JSON.stringify(saved));
  }
  const failed = await api('POST', `/api/learn/final/${course.slug}/submit`, { token, body: { token: first.data.token } });
  assert.equal(failed.status, 200, JSON.stringify(failed));
  assert.equal(failed.data.passed, false);
  assert.equal(failed.data.marks, 0);
  assert.equal(failed.data.reason, 'submitted');
  assert.equal(failed.data.review, undefined, 'the result never shows the answers');
  assert.equal(failed.data.status.state, 'waiting');
  const wait = (new Date(failed.data.status.retakeAt) - Date.now()) / 86400000;
  assert.ok(wait > 29.9 && wait <= 30, `retake opens in 30 days (${wait})`);

  const again = await api('POST', `/api/learn/final/${course.slug}/answer`, { token, body: { token: first.data.token, i: 0, choice: 0 } });
  assert.equal(again.status, 409, 'a submitted attempt takes no more answers');
  const tooSoon = await api('POST', `/api/learn/final/${course.slug}/start`, { token, body: { pledge: true } });
  assert.equal(tooSoon.status, 403, 'no retake before 30 days');

  // A month later: the retake is the same questions, shuffled again.
  await q(`UPDATE final_attempts SET submittedAt = submittedAt - INTERVAL '31 days' WHERE userId = ? AND courseId = ?`).run(userId, course.id);
  const retake = await api('POST', `/api/learn/final/${course.slug}/start`, { token, body: { pledge: true } });
  assert.equal(retake.status, 201, JSON.stringify(retake));
  assert.equal(retake.data.attemptNo, 2);
  const promptsOf = (qs) => qs.map((qq) => qq.prompt);
  assert.deepEqual([...promptsOf(retake.data.questions)].sort(), [...promptsOf(first.data.questions)].sort(), 'the retake sits the same questions');
  const sameOrder = promptsOf(retake.data.questions).join('\n') === promptsOf(first.data.questions).join('\n');
  const sameOptions = retake.data.questions.every((qq) => {
    const before = first.data.questions.find((f) => f.prompt === qq.prompt);
    return before.options.join('|') === qq.options.join('|');
  });
  assert.ok(!(sameOrder && sameOptions), 'questions and options are reshuffled for the retake');

  // Every answer right, sent with the submit rather than saved one by one.
  const paper2 = await paperOf(2);
  const answers = Object.fromEntries(retake.data.questions.map((qq) => [qq.i, paper2[qq.i].answer]));
  const passedRes = await api('POST', `/api/learn/final/${course.slug}/submit`, { token, body: { token: retake.data.token, answers } });
  assert.equal(passedRes.status, 200, JSON.stringify(passedRes));
  assert.equal(passedRes.data.passed, true);
  assert.equal(passedRes.data.marks, 100);
  assert.equal(passedRes.data.status.state, 'passed');
  const result = { data: { certificate: passedRes.data.status.certificate } };
  assert.match(result.data.certificate.code, /^[A-Z0-9-]{6,}$/);
  assert.equal(result.data.certificate.score, 100);
  const third = await api('POST', `/api/learn/final/${course.slug}/start`, { token, body: { pledge: true } });
  assert.equal(third.status, 403, 'no attempts after passing');

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

test('final exam: leaving the page or running out of time submits it', async () => {
  const other = { name: 'Second Learner', email: `learner2-${Date.now()}@example.com`, password: 'correct horse battery' };
  assert.equal((await api('POST', '/api/auth/register', { body: other })).status, 201);
  const verifyCode = codes.get(other.email);
  const { token: t2 } = await api('POST', '/api/auth/verify', { body: { email: other.email, code: verifyCode } });
  assert.equal((await api('POST', `/api/learn/courses/${course.slug}/enroll`, { token: t2 })).status, 201);

  // Everything but the final done, recorded directly.
  const uid = (await q('SELECT id FROM users WHERE email = ?').get(other.email)).id;
  const now = new Date().toISOString();
  const chapters = await q('SELECT id FROM chapters WHERE courseId = ?').all(course.id);
  for (const ch of chapters) {
    for (const l of await q('SELECT id FROM lessons WHERE chapterId = ?').all(ch.id)) {
      await q('INSERT INTO lesson_progress (userId, lessonId, completedAt) VALUES (?, ?, ?)').run(uid, l.id, now);
      await q('INSERT INTO quiz_attempts (userId, courseId, chapterId, lessonId, score, total, passed, createdAt) VALUES (?, ?, NULL, ?, 3, 3, 1, ?)').run(uid, course.id, l.id, now);
    }
    await q('INSERT INTO quiz_attempts (userId, courseId, chapterId, lessonId, score, total, passed, createdAt) VALUES (?, ?, ?, NULL, 4, 4, 1, ?)').run(uid, course.id, ch.id, now);
  }

  // Leaving: the page is reloaded mid-exam, so the open attempt is graded as it stands.
  const start = await api('POST', `/api/learn/final/${course.slug}/start`, { token: t2, body: { pledge: true } });
  assert.equal(start.status, 201, JSON.stringify(start));
  const back = await api('GET', `/api/learn/final/${course.slug}`, { token: t2 });
  assert.equal(back.data.attempts.length, 1);
  assert.equal(back.data.attempts[0].reason, 'left');
  assert.equal(back.data.state, 'waiting');
  const late = await api('POST', `/api/learn/final/${course.slug}/answer`, { token: t2, body: { token: start.data.token, i: 0, choice: 0 } });
  assert.equal(late.status, 409, 'a left attempt takes no more answers');

  // The retake runs out of time: no answer is accepted after the deadline.
  await q(`UPDATE final_attempts SET submittedAt = submittedAt - INTERVAL '31 days' WHERE userId = ?`).run(uid);
  const retake = await api('POST', `/api/learn/final/${course.slug}/start`, { token: t2, body: { pledge: true } });
  assert.equal(retake.status, 201, JSON.stringify(retake));
  await q(`UPDATE final_attempts SET deadline = NOW() - INTERVAL '1 minute' WHERE userId = ? AND attemptNo = 2`).run(uid);
  const over = await api('POST', `/api/learn/final/${course.slug}/answer`, { token: t2, body: { token: retake.data.token, i: 0, choice: 0 } });
  assert.equal(over.status, 409, 'no answers after the deadline');
  const end = await api('GET', `/api/learn/final/${course.slug}`, { token: t2 });
  assert.equal(end.data.attempts[1].reason, 'timeout');
  assert.equal(end.data.state, 'exhausted', 'both attempts used');
  assert.equal((await api('POST', `/api/learn/final/${course.slug}/start`, { token: t2, body: { pledge: true } })).status, 403);
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

test('game token: signed, short-lived, for verified learners only', async () => {
  const jwt = (await import('jsonwebtoken')).default;
  const { signToken } = await import('../src/middleware/auth.js');
  const { gameSsoSecret, GAME_TOKEN_TTL_SEC } = await import('../src/features/auth/gameSso.js');

  const anon = await api('POST', '/api/auth/game-token');
  assert.equal(anon.status, 401, 'no site session, no game token');

  const res = await api('POST', '/api/auth/game-token', { token });
  assert.equal(res.status, 200, JSON.stringify(res));
  assert.equal(res.expiresIn, GAME_TOKEN_TTL_SEC);
  assert.equal(res.user.name, learner.name);

  const claims = jwt.verify(res.token, gameSsoSecret(), {
    algorithms: ['HS256'],
    issuer: 'cortexis',
    audience: 'cortexis-games',
  });
  assert.equal(claims.sub, String(res.user.id));
  assert.equal(claims.name, learner.name);
  assert.equal(claims.exp - claims.iat, GAME_TOKEN_TTL_SEC, 'ten minutes');
  assert.throws(() => jwt.verify(res.token, process.env.JWT_SECRET), 'not signed with the site secret');

  // Contract with the games: each game server's own verifier (node:crypto, no
  // jsonwebtoken) accepts exactly this token and binds it to this learner.
  const { createRequire } = await import('node:module');
  const { existsSync } = await import('node:fs');
  const requireCjs = createRequire(import.meta.url);
  for (const game of ['gotcha-rush', 'typedash']) {
    const path = new URL(`../../games/${game}/server/cx.js`, import.meta.url).pathname;
    if (!existsSync(path)) continue;   // the API checked out on its own
    const cx = requireCjs(path);
    const verified = cx.verifyGameToken(res.token);
    assert.equal(verified.sub, String(res.user.id), `${game} reads the learner id`);
    assert.equal(verified.name, learner.name, `${game} reads the learner name`);
    assert.throws(() => cx.verifyGameToken(token), `${game} refuses the 30-day site session itself`);
  }

  // A configured secret replaces the development one; production without one
  // keeps game sign-in off rather than signing with a known constant.
  const saved = { secret: process.env.GAME_SSO_SECRET, env: process.env.NODE_ENV };
  try {
    process.env.GAME_SSO_SECRET = 'a-configured-game-secret-that-is-at-least-32-chars';
    const configured = await api('POST', '/api/auth/game-token', { token });
    assert.equal(configured.status, 200);
    assert.doesNotThrow(() => jwt.verify(configured.token, process.env.GAME_SSO_SECRET, { audience: 'cortexis-games' }));
    assert.throws(() => jwt.verify(configured.token, 'cortexis-dev-only-game-sso-secret--do-not-use-in-production'));

    delete process.env.GAME_SSO_SECRET;
    process.env.NODE_ENV = 'production';
    const off = await api('POST', '/api/auth/game-token', { token });
    assert.equal(off.status, 503, 'no secret in production: game sign-in stays off');
  } finally {
    if (saved.secret === undefined) delete process.env.GAME_SSO_SECRET; else process.env.GAME_SSO_SECRET = saved.secret;
    process.env.NODE_ENV = saved.env;
  }

  // A correct password on an unconfirmed address is refused, as login does.
  const pending = { name: 'Pending Player', email: `pending-${Date.now()}@example.com`, password: 'correct horse battery' };
  assert.equal((await api('POST', '/api/auth/register', { body: pending })).status, 201);
  const row = await q('SELECT id, email FROM users WHERE email = ?').get(pending.email);
  const unverified = await api('POST', '/api/auth/game-token', { token: signToken(row) });
  assert.equal(unverified.status, 403);
  assert.equal(unverified.needsVerification, true);
  await q('DELETE FROM users WHERE id = ?').run(row.id);
});

test('admin: edit, hide, reset and delete', async () => {
  const { signToken } = await import('../src/middleware/auth.js');
  const { seedCourses } = await import('../src/content/seed.js');
  // The walkthrough above spends most of the learn rate limit.
  await resetTestLimits();
  const admin = await q('SELECT id, email FROM users WHERE LOWER(email) = ?').get(process.env.ADMIN_EMAIL.toLowerCase());
  const A = signToken(admin);
  const stamp = Date.now();
  const student = async (i) => {
    const now = new Date().toISOString();
    const { lastInsertRowid: id } = await q(
      `INSERT INTO users (name, email, passwordHash, emailVerified, createdAt, updatedAt) VALUES (?, ?, 'x', 1, ?, ?)`
    ).run(`Admin Test ${i}`, `admin-test+${stamp}-${i}@example.com`, now, now);
    return { id, token: signToken({ id, email: `admin-test+${stamp}-${i}@example.com` }) };
  };
  const [s1, s2] = [await student(1), await student(2)];
  const slug = course.slug;
  const before = (await api('GET', `/api/admin/courses/${slug}`, { token: A })).data.course;
  try {

    assert.equal((await api('PATCH', `/api/admin/courses/${slug}`, { token: s1.token, body: { title: 'x' } })).status, 403);
    assert.equal((await api('PATCH', `/api/admin/courses/${slug}`, { token: A, body: { title: ' ' } })).status, 400);

    // An edit outlives a re-seed of the course content, and reset undoes it.
    const edited = await api('PATCH', `/api/admin/courses/${slug}`, { token: A, body: { title: ' Edited ', level: 'Expert' } });
    assert.equal(edited.data.title, 'Edited');
    assert.equal(edited.data.edited, true);
    await q("DELETE FROM meta WHERE key = 'courses:fingerprint'").run();
    await seedCourses();
    assert.equal((await api('GET', `/api/admin/courses/${slug}`, { token: A })).data.course.title, 'Edited');
    const reset = await api('POST', `/api/admin/courses/${slug}/reset`, { token: A });
    assert.equal(reset.data.title, before.title);
    assert.equal(reset.data.level, before.level);
    assert.equal(reset.data.edited, false);

    // Hidden: gone for everyone not enrolled, intact for those who are.
    assert.equal((await api('POST', `/api/learn/courses/${slug}/enroll`, { token: s1.token })).status, 201);
    assert.deepEqual((await api('DELETE', `/api/admin/courses/${slug}`, { token: A })).data, { hidden: true });
    assert.ok(!(await api('GET', '/api/learn/courses')).data.some((c) => c.slug === slug));
    assert.equal((await api('GET', `/api/learn/courses/${slug}`)).status, 404);
    assert.equal((await api('POST', `/api/learn/courses/${slug}/enroll`, { token: s2.token })).status, 404);
    const outline = await api('GET', `/api/learn/courses/${slug}`, { token: s1.token });
    assert.equal(outline.status, 200);
    assert.equal((await api('GET', `/api/learn/lessons/${outline.data.chapters[0].lessons[0].id}`, { token: s1.token })).status, 200);
    assert.equal((await api('PATCH', `/api/admin/courses/${slug}`, { token: A, body: { hidden: false } })).data.hidden, false);
    assert.ok((await api('GET', '/api/learn/courses')).data.some((c) => c.slug === slug));

    // Students
    assert.equal((await api('DELETE', `/api/admin/users/${admin.id}`, { token: A })).status, 400);
    assert.equal((await api('PATCH', `/api/admin/users/${s1.id}`, { token: A, body: { email: `ADMIN-TEST+${stamp}-2@example.com` } })).status, 409);
    const renamed = await api('PATCH', `/api/admin/users/${s1.id}`, { token: A, body: { name: 'Renamed', emailVerified: true } });
    assert.equal(renamed.data.name, 'Renamed');

    // Certificates
    const { lastInsertRowid: certId } = await q('INSERT INTO certificates (userId, courseId, code, score, issuedAt) VALUES (?, ?, ?, 80, ?)')
      .run(s1.id, course.id, `CTX-T-${stamp}`, new Date().toISOString());
    assert.equal((await api('PATCH', `/api/admin/certificates/${certId}`, { token: A, body: { score: 101 } })).status, 400);
    assert.equal((await api('PATCH', `/api/admin/certificates/${certId}`, { token: A, body: { score: 90 } })).data.score, 90);
    assert.equal((await api('DELETE', `/api/admin/certificates/${certId}`, { token: A })).data.deleted, true);
    assert.equal((await api('GET', `/api/learn/certificate/CTX-T-${stamp}`)).status, 404);

    // Removing from a course wipes the record there; deleting takes everything.
    assert.deepEqual((await api('DELETE', `/api/admin/users/${s1.id}/courses/${slug}`, { token: A })).data, { removed: true });
    assert.equal((await q('SELECT COUNT(*) AS n FROM enrollments WHERE userId = ?').get(s1.id)).n, 0);
    await api('POST', `/api/learn/courses/${slug}/enroll`, { token: s2.token });
    for (const s of [s1, s2]) assert.equal((await api('DELETE', `/api/admin/users/${s.id}`, { token: A })).data.deleted, true);
    assert.equal((await api('GET', '/api/learn/my', { token: s2.token })).status, 401);

    // Forms
    const { lastInsertRowid: mid } = await q('INSERT INTO contact_messages (name, email, message, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)')
      .run('Msg Test', 'm@example.com', 'A message long enough', new Date().toISOString(), new Date().toISOString());
    assert.equal((await api('PATCH', `/api/admin/messages/${mid}`, { token: A, body: { handled: true, subject: 'S' } })).data.subject, 'S');
    assert.equal((await api('DELETE', `/api/admin/messages/${mid}`, { token: A })).data.deleted, true);
    const { lastInsertRowid: iid } = await q('INSERT INTO internship_applications (name, email, internshipTitle, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)')
      .run('Intern Test', 'i@example.com', 'Frontend Intern', new Date().toISOString(), new Date().toISOString());
    assert.equal((await api('PATCH', `/api/admin/internships/${iid}`, { token: A, body: { resumeLink: 'ftp://x' } })).status, 400);
    assert.equal((await api('DELETE', `/api/admin/internships/${iid}`, { token: A })).data.deleted, true);
  } finally {
    // A failure part-way must not leave the shared course edited or hidden.
    await q('DELETE FROM course_overrides WHERE slug = ?').run(slug);
    await q('UPDATE courses SET hidden = 0 WHERE slug = ?').run(slug);
    await api('POST', `/api/admin/courses/${slug}/reset`, { token: A });
    await q("DELETE FROM users WHERE email LIKE 'admin-test+%@example.com'").run();
  }
});

test('verify gives no session to an account that is already verified', async () => {
  await resetTestLimits();
  const res = await api('POST', '/api/auth/verify', { body: { email: learner.email, code: '000000' } });
  assert.equal(res.status, 400);
  assert.equal(res.token, undefined, 'no token without a code check');
});

// Stand in for the 60-second resend cooldown rather than waiting it out.
const pastCooldown = (email) =>
  q(`UPDATE users SET verifySentAt = ? WHERE email = ?`).run(new Date(Date.now() - 120_000).toISOString(), email);

test('signing up again on an unverified address replaces the earlier name and password', async () => {
  const email = `claim-${Date.now()}@example.com`;
  assert.equal((await api('POST', '/api/auth/register', { body: { name: 'Squatter', email, password: 'squatter-password' } })).status, 201);
  assert.equal((await api('POST', '/api/auth/register', { body: { name: 'Owner', email, password: 'the-owners-password' } })).status, 429, 'cooldown applies to signing up again');
  await pastCooldown(email);
  assert.equal((await api('POST', '/api/auth/register', { body: { name: 'Owner', email, password: 'the-owners-password' } })).status, 200);
  const verifyCode = codes.get(email);
  const verified = await api('POST', '/api/auth/verify', { body: { email, code: verifyCode } });
  assert.equal(verified.status, 200);
  assert.equal(verified.user.name, 'Owner');
  assert.equal((await api('POST', '/api/auth/login', { body: { email, password: 'squatter-password' } })).status, 401);
  assert.equal((await api('POST', '/api/auth/login', { body: { email, password: 'the-owners-password' } })).status, 200);
  await q('DELETE FROM users WHERE email = ?').run(email);
});

test('five wrong codes lock the address; a new code does not reset the count', async () => {
  await resetTestLimits();
  const who = { name: 'Guesser', email: `guess-${Date.now()}@example.com`, password: 'correct horse battery' };
  assert.equal((await api('POST', '/api/auth/register', { body: who })).status, 201);
  const row = () => q('SELECT verifyCode, verifyAttempts, verifyLockUntil FROM users WHERE email = ?').get(who.email);
  const wrong = async () => {
    const verifyCode = codes.get(who.email);
    return api('POST', '/api/auth/verify', { body: { email: who.email, code: verifyCode === '111111' ? '222222' : '111111' } });
  };

  for (let i = 0; i < 2; i++) assert.equal((await wrong()).status, 400);
  await pastCooldown(who.email);
  assert.equal((await api('POST', '/api/auth/resend', { body: { email: who.email } })).status, 200);
  assert.equal((await row()).verifyAttempts, 2, 'a resend keeps the count');
  for (let i = 0; i < 3; i++) assert.equal((await wrong()).status, 400);
  assert.ok((await row()).verifyLockUntil, 'the fifth wrong code starts the lockout');

  const verifyCode = codes.get(who.email);
  assert.equal((await api('POST', '/api/auth/verify', { body: { email: who.email, code: verifyCode } })).status, 429, 'even the right code waits');
  await pastCooldown(who.email);
  assert.equal((await api('POST', '/api/auth/register', { body: who })).status, 429, 'signing up again does not lift it');
  assert.equal((await api('POST', '/api/auth/resend', { body: { email: who.email } })).status, 429);
  assert.equal((await row()).verifyAttempts, 5);

  // Once the window has passed, a new code starts a fresh count.
  await q('UPDATE users SET verifyLockUntil = ? WHERE email = ?').run(new Date(Date.now() - 1000).toISOString(), who.email);
  assert.equal((await api('POST', '/api/auth/resend', { body: { email: who.email } })).status, 200);
  assert.equal((await row()).verifyAttempts, 0);
  assert.match((await row()).verifyCode, /^[a-f0-9]{64}$/);
  assert.equal((await api('POST', '/api/auth/verify', { body: { email: who.email, code: codes.get(who.email) } })).status, 200);
  await q('DELETE FROM users WHERE email = ?').run(who.email);

  // Guesses sent all at once are counted one by one too.
  await resetTestLimits();
  assert.equal((await api('POST', '/api/auth/register', { body: who })).status, 201);
  const burst = await Promise.all(Array.from({ length: 8 }, () => wrong()));
  assert.equal(burst.filter((r) => r.status === 400).length, 5, 'only five guesses are checked');
  await q('DELETE FROM users WHERE email = ?').run(who.email);
});

test('Claude Pro: no self-apply, a decision survives a retake, heartbeat time is measured here', async () => {
  const { recordClaudeProApplication } = await import('../src/features/learning/claudePro.service.js');
  const me = await q('SELECT id FROM users WHERE email = ?').get(learner.email);

  assert.equal((await api('POST', `/api/learn/claude-pro/apply/${course.slug}`, { token })).status, 404, 'the apply route is gone');

  for (const decided of ['rejected', 'selected', 'awarded']) {
    await q('UPDATE claude_pro_applications SET status = ? WHERE userId = ? AND courseId = ?').run(decided, me.id, course.id);
    const row = await recordClaudeProApplication({ userId: me.id, courseId: course.id, score: 100 });
    assert.equal(row.status, decided, `a retake leaves '${decided}' alone`);
  }
  await q("UPDATE claude_pro_applications SET status = 'applied' WHERE userId = ? AND courseId = ?").run(me.id, course.id);

  const other = await q('SELECT slug FROM courses WHERE id <> ? LIMIT 1').get(course.id);
  const beat = (slug, seconds) => api('POST', '/api/learn/claude-pro/heartbeat', { token, body: { courseSlug: slug, seconds } });
  assert.equal((await beat(other.slug, 300)).status, 404, 'not enrolled, not tracked');

  await q("UPDATE claude_pro_applications SET lastActiveAt = NOW() - INTERVAL '10 minutes' WHERE userId = ? AND courseId = ?").run(me.id, course.id);
  const start = Number((await q('SELECT timeSpentSeconds AS t FROM claude_pro_applications WHERE userId = ? AND courseId = ?').get(me.id, course.id)).t);
  const first = await beat(course.slug, 300);
  assert.equal(first.status, 200);
  assert.equal(Number(first.data.timeSpentSeconds) - start, 30, 'a long gap credits one heartbeat interval, not the 300 s claimed');
  const second = await beat(course.slug, 300);
  assert.ok(Number(second.data.timeSpentSeconds) - Number(first.data.timeSpentSeconds) <= 1, 'back-to-back beats add only the real gap');
});

test('sessions: revocable, admin tokens short, admin IP allow-list, quiet errors', async () => {
  await resetTestLimits();
  const jwt = (await import('jsonwebtoken')).default;
  const { signToken } = await import('../src/middleware/auth.js');
  const admin = await q('SELECT * FROM users WHERE LOWER(email) = ?').get(process.env.ADMIN_EMAIL.toLowerCase());
  const A = signToken(admin);
  const claims = jwt.decode(A);
  assert.equal(claims.exp - claims.iat, 2 * 3600, 'admin sessions last 2 hours');

  const now = new Date().toISOString();
  const email = `revoke-${Date.now()}@example.com`;
  const { lastInsertRowid: id } = await q(
    `INSERT INTO users (name, email, passwordHash, emailVerified, createdAt, updatedAt) VALUES ('Revoke Me', ?, 'x', 1, ?, ?)`
  ).run(email, now, now);
  const T = signToken(await q('SELECT * FROM users WHERE id = ?').get(id));
  assert.equal((await api('GET', '/api/auth/me', { token: T })).status, 200);
  assert.equal((await api('PATCH', `/api/admin/users/${id}`, { token: A, body: { name: 'Edited' } })).status, 200);
  assert.equal((await api('GET', '/api/auth/me', { token: T })).status, 401, 'an admin edit signs the student out');
  await q('DELETE FROM users WHERE id = ?').run(id);

  process.env.ADMIN_ALLOWED_IPS = '203.0.113.9';
  try {
    assert.equal((await api('GET', '/api/admin/overview', { token: A })).status, 403, 'not on the list');
  } finally {
    delete process.env.ADMIN_ALLOWED_IPS;
  }
  assert.equal((await api('GET', '/api/admin/overview', { token: A })).status, 200);
  assert.equal((await api('GET', '/api/admin/health', { token: A })).ok, true);

  assert.equal((await api('GET', '/api/learn/lessons/abc', { token })).status, 404, 'a malformed id is a quick 404');
  const bad = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{bad' });
  assert.equal(bad.status, 400);
  assert.doesNotMatch(await bad.text(), /at |node_modules|SyntaxError/, 'no stack trace');
  const evil = await fetch(`${base}/health`, { headers: { origin: 'https://evil.example' } });
  assert.equal(evil.headers.get('access-control-allow-origin'), null, 'unknown origins get no CORS grant');
  const site = await fetch(`${base}/health`, { headers: { origin: 'http://localhost:3000' } });
  assert.equal(site.headers.get('access-control-allow-origin'), 'http://localhost:3000');
});

test('API 404, strict CORS, body limits, headers, and validation reject hostile input', async () => {
  const missing = await api('GET', '/api/does-not-exist');
  assert.equal(missing.status, 404);
  const health = await fetch(base + '/health');
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(health.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(health.headers.get('x-powered-by'), null);
  const denied = await fetch(base + '/api/contact', { method: 'POST', headers: { Origin: 'https://attacker.invalid', 'content-type': 'application/json' }, body: '{}' });
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get('access-control-allow-origin'), null);
  const oversized = await fetch(base + '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'x'.repeat(1024 * 1024) }) });
  assert.equal(oversized.status, 413);
  const injection = await api('POST', '/api/auth/login', { body: { email: { $ne: null }, password: 'anything' } });
  assert.equal(injection.status, 400);
  const secret = 'SENSITIVE-VALIDATION-INPUT'.repeat(5);
  const invalid = await api('POST', '/api/auth/register', { body: { name: 'Bad Input', email: 'safe@example.com', password: secret } });
  assert.equal(invalid.status, 400); assert.ok(!JSON.stringify(invalid).includes(secret));
  const unsafeResume = await api('POST', '/api/internships/apply', { body: { name: 'Unsafe Link', email: 'safe@example.com', internshipTitle: 'Engineering', resumeLink: 'javascript:alert(1)' } });
  assert.equal(unsafeResume.status, 400);
  assert.equal((await api('GET', '/ready')).status, 200);
});

test('credential and form rate limits enforce their ceilings without Redis', async () => {
  for (let i = 0; i < 10; i++) assert.equal((await api('POST', '/api/auth/login', { body: {} })).status, 400);
  const limited = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.10' }, body: '{}' });
  assert.equal(limited.status, 429);
  assert.ok(limited.headers.has('retry-after'));
  for (let i = 0; i < 5; i++) assert.equal((await api('POST', '/api/contact', { body: {} })).status, 400);
  assert.equal((await api('POST', '/api/contact', { body: {} })).status, 429);
  // register and resend share one per-IP counter of 10 an hour.
  await resetTestLimits();
  for (let i = 0; i < 10; i++) assert.equal((await api('POST', '/api/auth/resend', { body: {} })).status, 400);
  assert.equal((await api('POST', '/api/auth/register', { body: {} })).status, 429);
});

test('every admin route rejects anonymous and ordinary learner access', async () => {
  const router = (await import('../src/features/admin/admin.routes.js')).default;
  let checked = 0;
  for (const layer of router.stack) {
    if (!layer.route) continue;
    for (const method of Object.keys(layer.route.methods)) {
      const url = '/api/admin' + layer.route.path.replace(/:[A-Za-z]+/g, '1');
      const anonymous = await api(method.toUpperCase(), url, { body: ['get', 'head'].includes(method) ? undefined : {} });
      assert.equal(anonymous.status, 401, method + ' ' + url);
      const ordinary = await api(method.toUpperCase(), url, { token, body: ['get', 'head'].includes(method) ? undefined : {} });
      assert.equal(ordinary.status, 403, method + ' ' + url);
      checked++;
    }
  }
  assert.ok(checked >= 20);
  console.log('Admin route authorization pairs checked:', checked);
});

test('verification replay, stored password/code hashing and JWT scope enforcement', async () => {
  const who = { name: 'Security Learner', email: 'security-' + Date.now() + '@example.com', password: 'secure password for test' };
  assert.equal((await api('POST', '/api/auth/register', { body: who })).status, 201);
  const row = await q('SELECT * FROM users WHERE email = ?').get(who.email);
  assert.match(row.passwordHash, /^\$2[aby]\$/);
  assert.equal(await (await import('bcryptjs')).default.compare(who.password, row.passwordHash), true);
  assert.notEqual(row.verifyCode, codes.get(who.email));
  assert.match(row.verifyCode, /^[a-f0-9]{64}$/);
  const body = { email: who.email, code: codes.get(who.email) };
  const results = await Promise.all([api('POST', '/api/auth/verify', { body }), api('POST', '/api/auth/verify', { body })]);
  assert.equal(results.filter(r => r.status === 200).length, 1, 'one-time code cannot create two sessions in parallel');
  const jwt = (await import('jsonwebtoken')).default;
  const wrongAudience = jwt.sign({ sub: row.id, v: 0 }, process.env.JWT_SECRET, { issuer: 'cortexis', audience: 'another-app', algorithm: 'HS256' });
  assert.equal((await api('GET', '/api/auth/me', { token: wrongAudience })).status, 401);
  await q('DELETE FROM users WHERE id = ?').run(row.id);
});

test('email jobs encrypt content, reject tampering, and never report failed mail as delivered', async () => {
  const { encryptJob, decryptJob } = await import('../src/services/queue.service.js');
  const { processEmailJob } = await import('../src/workers/email.worker.js');
  const data = { email: 'recipient@example.com', name: '<img src=x onerror=alert(1)>', code: '123456' };
  const encrypted = encryptJob(data);
  assert.ok(!JSON.stringify(encrypted).includes(data.code));
  assert.ok(!JSON.stringify(encrypted).includes(data.email));
  assert.deepEqual(decryptJob(encrypted), data);
  assert.throws(() => decryptJob({ ...encrypted, tag: Buffer.alloc(16).toString('base64') }));
  assert.deepEqual(await processEmailJob({ name: 'send-verification', data: encrypted }), { delivered: true });
  const host = process.env.SMTP_HOST;
  process.env.SMTP_HOST = '';
  try { await assert.rejects(processEmailJob({ name: 'send-verification', data: encrypted }), /Permanent email delivery failure/); }
  finally { process.env.SMTP_HOST = host; }
});

test('Redis URL and production environment reject insecure configuration', async () => {
  const { redisOptions } = await import('../src/config/redis.js');
  const { validateEnvironment } = await import('../src/config/environment.js');
  const saved = { ...process.env };
  try {
    process.env.REDIS_URL = 'rediss://worker:p%40ss@redis.example.com:6380/2';
    const options = redisOptions();
    assert.equal(options.host, 'redis.example.com'); assert.equal(options.port, 6380);
    assert.equal(options.username, 'worker'); assert.equal(options.password, 'p@ss'); assert.equal(options.db, 2);
    assert.equal(options.tls.rejectUnauthorized, true);
    process.env.NODE_ENV = 'production'; process.env.JWT_SECRET = 'weak';
    assert.throws(validateEnvironment);
    process.env.JWT_SECRET = 'a'.repeat(48); process.env.SITE_URL = 'https://example.com'; process.env.CORS_ORIGINS = 'https://example.com';
    process.env.SMTP_PORT = '587'; process.env.DATABASE_SSL = 'false'; process.env.DATABASE_URL = 'postgresql://test@remote.invalid/test';
    assert.throws(validateEnvironment, /verified TLS/);
    process.env.DATABASE_URL = saved.DATABASE_URL;
    process.env.CORS_ORIGINS = '*'; assert.throws(validateEnvironment);
    process.env.CORS_ORIGINS = 'https://example.com'; validateEnvironment();
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in saved)) delete process.env[key];
    Object.assign(process.env, saved);
  }
});

test('nested transactions roll back only the failed savepoint', async () => {
  const db = getDB();
  const key = 'test:nested:' + Date.now();
  await db.transaction(async () => {
    await q('INSERT INTO meta (key, value) VALUES (?, ?)').run(key, 'outer');
    await assert.rejects(db.transaction(async () => {
      await q('UPDATE meta SET value = ? WHERE key = ?').run('inner', key);
      throw new Error('synthetic rollback');
    })(), /synthetic rollback/);
    assert.equal((await q('SELECT value FROM meta WHERE key = ?').get(key)).value, 'outer');
  })();
  assert.equal((await q('SELECT value FROM meta WHERE key = ?').get(key)).value, 'outer');
  await q('DELETE FROM meta WHERE key = ?').run(key);
});

test('logout revokes the bearer token on the server', async () => {
  const { signToken } = await import('../src/middleware/auth.js');
  const row = await q('SELECT * FROM users WHERE email = ?').get(learner.email);
  const session = signToken(row);
  assert.equal((await api('POST', '/api/auth/logout', { token: session })).status, 200);
  assert.equal((await api('GET', '/api/auth/me', { token: session })).status, 401);
});

test('per-email limiter counts only successful sends and keys on the email', async () => {
  const express = (await import('express')).default;
  const { createLimiter } = await import('../src/middleware/rateLimiter.js');
  const key = req => String(req.body?.email || '').trim().toLowerCase();
  const limiter = createLimiter({ windowMs: 60000, max: 2, prefix: 'test-email', keyGenerator: key, skip: req => !key(req).includes('@'), skipFailedRequests: true });
  const app = express().use(express.json()).post('/send', limiter, (req, res) => res.status(req.body.fail ? 429 : 200).end());
  const server = app.listen(0); await new Promise(resolve => server.once('listening', resolve));
  const send = body => fetch(`http://127.0.0.1:${server.address().port}/send`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.status);
  try {
    for (let i = 0; i < 5; i++) assert.equal(await send({ email: 'Victim@x.com', fail: true }), 429, 'refused sends never count');
    assert.equal(await send({ email: 'victim@x.com' }), 200);
    assert.equal(await send({ email: ' VICTIM@x.com ' }), 200);
    assert.equal(await send({ email: 'victim@x.com' }), 429, 'third real send to the same email is capped');
    assert.equal(await send({ email: 'other@x.com' }), 200, 'another email is unaffected');
  } finally { server.close(); }
});
