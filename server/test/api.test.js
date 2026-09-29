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
  assert.equal(early.status, 200, JSON.stringify(early));
  assert.equal(early.data.state, 'locked', 'final exam is locked at the start');
  const cannot = await api('POST', `/api/learn/final/${course.slug}/start`, { token, body: { pledge: true } });
  assert.equal(cannot.status, 403, 'a locked final exam cannot be started');
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
  const { verifyCode } = await q('SELECT verifyCode FROM users WHERE email = ?').get(other.email);
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
  const { gameSsoSecret, GAME_TOKEN_TTL_SEC } = await import('../src/services/gameSso.js');

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
