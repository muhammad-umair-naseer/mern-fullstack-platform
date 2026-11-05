import '../src/config/environment.js';
import { connectDB, closeDB } from '../src/setup/db.js';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL for the migration role');
process.env.SCHEMA_MANAGEMENT = 'automatic';
try { await connectDB(); console.log('Schema version 1 is ready'); } finally { await closeDB(); }
