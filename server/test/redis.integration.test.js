import { test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const enabled = Boolean(process.env.REDIS_TEST_URL);
process.env.NODE_ENV = 'test';
process.env.REDIS_URL = process.env.REDIS_TEST_URL || 'redis://127.0.0.1:56379/15';
process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
process.env.TEST_RUN_ID = 'integration-' + crypto.randomUUID();
process.env.SMTP_HOST = 'smtp.test.invalid'; process.env.SMTP_USER = 'synthetic@example.com'; process.env.SMTP_PASS = 'synthetic';
const { initRedis, closeRedis, getRedisClient } = await import('../src/services/redis.service.js');
const { getEmailQueue, queueVerificationEmail, closeQueue } = await import('../src/services/queue.service.js');
const { initWorker, closeWorker } = await import('../src/workers/email.worker.js');
const { redisOptions, queuePrefix } = await import('../src/config/redis.js');
const { createLimiter, closeLimiters } = await import('../src/middleware/rateLimiter.js');
const { QueueEvents } = await import('bullmq');
const express = (await import('express')).default;
const nodemailer = (await import('nodemailer')).default;
let events;
const servers = [];
let sends = 0;
mock.method(nodemailer, 'createTransport', () => ({ sendMail: async () => {
  sends++;
  if (sends < 3) throw Object.assign(new Error('Synthetic temporary SMTP outage'), { code: 'ETIMEDOUT' });
  return { accepted: ['synthetic@example.com'], rejected: [] };
}, close() {} }));
before(async () => {
  if (!enabled) return;
  await initRedis();
  initWorker();
  events = new QueueEvents('emails', { prefix: queuePrefix(), connection: redisOptions({ blocking: true }) });
  await events.waitUntilReady();
});
after(async () => {
  for (const server of servers) await new Promise(resolve => server.close(resolve));
  await closeWorker();
  if (enabled) await getEmailQueue()?.obliterate({ force: true });
  await closeQueue(); if (events) await events.close(); await closeRedis(); closeLimiters();
});
test('real Redis queue retries two temporary mail failures, then completes', { skip: !enabled, timeout: 30000 }, async () => {
  const queue = getEmailQueue();
  const completion = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Queue did not complete within 20 seconds')), 20000);
    events.once('completed', () => { clearTimeout(timer); resolve(); });
  });
  const result = await queueVerificationEmail({ email: 'synthetic@example.com', name: 'Test', code: '928174' });
  assert.equal(result.queued, true);
  const jobs = await queue.getJobs(['active', 'waiting', 'delayed']);
  assert.ok(jobs.length);
  assert.ok(!JSON.stringify(jobs.map(j => ({ id: j.id, data: j.data }))).includes('928174'));
  await completion;
  assert.equal(sends, 3);
  assert.equal((await queue.getJobCounts('failed')).failed, 0);
});
test('two API instances share the same Redis rate-limit counter', { skip: !enabled }, async () => {
  const urls = [];
  for (let i = 0; i < 2; i++) {
    const app = express();
    app.use(createLimiter({ windowMs: 60000, max: 5, prefix: 'shared-integration' }));
    app.get('/', (_req, res) => res.json({ ok: true }));
    const server = app.listen(0, '127.0.0.1'); servers.push(server);
    await new Promise(resolve => server.once('listening', resolve));
    urls.push('http://127.0.0.1:' + server.address().port);
  }
  for (let i = 0; i < 5; i++) assert.equal((await fetch(urls[i % 2])).status, 200);
  assert.equal((await fetch(urls[0])).status, 429);
  assert.equal((await fetch(urls[1])).status, 429);
});
test('warm local counter remains enforced after Redis disconnects', { skip: !enabled }, async () => {
  const app = express();app.use(createLimiter({ windowMs: 60000, max: 2, prefix: 'outage' }));app.get('/', (_req,res)=>res.json({ok:true}));
  const server=app.listen(0,'127.0.0.1');servers.push(server);await new Promise(resolve=>server.once('listening',resolve));
  const url='http://127.0.0.1:'+server.address().port;
  assert.equal((await fetch(url)).status,200);assert.equal((await fetch(url)).status,200);
  getRedisClient().disconnect();await new Promise(resolve=>setTimeout(resolve,30));
  assert.equal((await fetch(url)).status,429);
  // Reconnect before queue cleanup.
  await getRedisClient().connect();
});
