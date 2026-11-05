import { validateEnvironment, integer } from './config/environment.js';
import app, { boot } from './app.js';
import { closeRedis } from './services/redis.service.js';
import { closeQueue } from './services/queue.service.js';
import { closeWorker } from './workers/email.worker.js';
import { closeDB } from './setup/db.js';
import { closeLimiters } from './middleware/rateLimiter.js';

let server;
let stopping = false;
async function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  const deadline = setTimeout(() => process.exit(1), 15000);
  deadline.unref();
  try {
    if (server) await new Promise(resolve => { server.close(resolve); server.closeIdleConnections(); });
    await closeWorker(); await closeQueue(); await closeRedis(); await closeDB(); closeLimiters();
    clearTimeout(deadline);
    process.exit(code);
  } catch { process.exit(1); }
}
process.on('unhandledRejection', () => { console.error('Unhandled rejection: stopping process'); void shutdown(1); });
process.on('uncaughtException', () => { console.error('Uncaught exception: stopping process'); void shutdown(1); });
process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
try {
  validateEnvironment();
  await boot();
  const port = integer(process.env.PORT, 5000);
  server = app.listen(port, process.env.HOST || '127.0.0.1', () => console.log('Cortexis API listening on port ' + port));
  server.requestTimeout = 30000;
  server.headersTimeout = 15000;
} catch (err) {
  console.error('Startup failed:', err.message?.replace(/:\/\/[^\s]+/g, '://[redacted]'));
  await shutdown(1);
}
