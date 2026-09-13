import dotenv from 'dotenv';
dotenv.config();

import app, { boot } from './app.js';
import { closeRedis } from './services/redis.service.js';
import { closeQueue } from './services/queue.service.js';
import { closeWorker } from './workers/email.worker.js';

const PORT = process.env.PORT || 5000;

boot()
  .then(({ courses, lessons }) => {
    console.log(`📚 Seeded ${courses} course(s), ${lessons} lesson(s)`);
    app.listen(PORT, () => console.log(`\n✅ Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  });

// --- Graceful Shutdown ---
const handleShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  await closeWorker();
  await closeQueue();
  await closeRedis();
  process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
