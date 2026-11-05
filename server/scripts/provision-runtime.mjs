// One-shot schema-owner task. Never run this as the long-lived web process.
import '../src/config/environment.js';
import { connectDB, closeDB } from '../src/setup/db.js';
const password = process.env.APP_DB_PASSWORD;
if (!password || !/^[A-Za-z0-9_-]{32,}$/.test(password)) throw new Error('APP_DB_PASSWORD requires at least 32 random base64url characters');
process.env.SCHEMA_MANAGEMENT = 'automatic';
try {
  const db = await connectDB();
  const connection = await db.pool.connect();
  try {
    await connection.query('BEGIN');
    await connection.query('SELECT pg_advisory_xact_lock(72451003)');
    const role = await connection.query("SELECT 1 FROM pg_roles WHERE rolname = 'cortexis_runtime'");
    if (!role.rowCount) await connection.query('CREATE ROLE cortexis_runtime LOGIN');
    // PostgreSQL formats the password as a literal; never interpolate env into SQL.
    const change = await connection.query("SELECT format('ALTER ROLE cortexis_runtime WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD %L', $1::text) AS sql", [password]);
    await connection.query(change.rows[0].sql);
    const grant = await connection.query("SELECT format('GRANT CONNECT ON DATABASE %I TO cortexis_runtime', current_database()) AS sql");
    await connection.query(grant.rows[0].sql);
    await connection.query('REVOKE CREATE ON SCHEMA public FROM PUBLIC');
    await connection.query('GRANT USAGE ON SCHEMA public TO cortexis_runtime');
    await connection.query('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cortexis_runtime');
    await connection.query('GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cortexis_runtime');
    await connection.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cortexis_runtime');
    await connection.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO cortexis_runtime');
    await connection.query('COMMIT');
    console.log('Schema migrated and restricted runtime role provisioned; credentials omitted');
  } catch (error) { await connection.query('ROLLBACK'); throw error; }
  finally { connection.release(); }
} finally { await closeDB(); }
