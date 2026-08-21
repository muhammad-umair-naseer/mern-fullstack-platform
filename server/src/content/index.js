import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COURSE_DIR = path.join(__dirname, 'courses');

// Every .js file in content/courses is a course. Dropping in a new file is all
// it takes to publish another course — no code changes anywhere else.
export const loadCourses = async () => {
  if (!fs.existsSync(COURSE_DIR)) return [];

  const files = fs.readdirSync(COURSE_DIR).filter((f) => f.endsWith('.js')).sort();
  const courses = [];

  for (const file of files) {
    try {
      const fileUrl = pathToFileURL(path.join(COURSE_DIR, file)).href;
      const mod = await import(fileUrl);
      if (mod.default?.slug) courses.push(mod.default);
      else console.warn(`⚠️  ${file} has no default export with a slug — skipped`);
    } catch (err) {
      // One malformed course file must not stop the server booting.
      console.error(`⚠️  Could not load course ${file}: ${err.message}`);
    }
  }

  return courses;
};
