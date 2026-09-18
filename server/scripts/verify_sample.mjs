import pg from 'pg';

const pool = new pg.Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/cortexis_db' });

const users = await pool.query('SELECT id, name, email, "emailVerified", "createdAt" FROM users LIMIT 3');
console.log('Sample Users:', users.rows);

const courses = await pool.query('SELECT id, slug, title, category, hours FROM courses LIMIT 3');
console.log('Sample Courses:', courses.rows);

const lessons = await pool.query('SELECT id, "chapterId", position, title FROM lessons LIMIT 3');
console.log('Sample Lessons:', lessons.rows);

await pool.end();
