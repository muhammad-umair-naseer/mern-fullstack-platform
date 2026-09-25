# Cortexis Solution Hub — Platform & Learning System

A full-stack web platform with a self-serve online learning system: a React front end, a
Node/Express API, and SQLite for storage. Learners sign up, work through course lessons,
take auto-graded quizzes, and earn a verifiable certificate — with no human involvement
at any step.

## Features

**Learning platform**
- 23 courses — 7 chapters each, 483 lessons, 966 quiz questions, all free
- Email + password accounts (bcrypt hashing, JWT sessions)
- Self-serve enrolment, per-lesson progress tracking, resume-where-you-left-off
- Auto-graded chapter quizzes with instant per-question explanations
- Final exam gated on completing every lesson and passing every chapter quiz; 70% to pass, unlimited retakes
- Certificates issued automatically on passing, with a public verification code
- Correct answers are never sent to the client

**Company site**
- Course registration, internship applications, and contact forms
- Email notification via Nodemailer (optional — skipped when SMTP is unconfigured)
- Rate limiting, Helmet, CORS, and Joi validation on every endpoint
- GSAP animations, cosmic theme, responsive down to 390px

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Tailwind CSS, GSAP, react-markdown |
| Backend | Node.js, Express 4, better-sqlite3, Joi, bcryptjs, jsonwebtoken, Nodemailer |
| Security | Helmet, CORS, express-rate-limit |

## Quick Start with Docker (No Local Dependencies Required)

Anyone can clone and run the full stack (Frontend, Backend API, PostgreSQL, Redis) with **zero local dependencies** installed (no Node.js, npm, or database setup needed):

```bash
# 1. Clone the repository
git clone https://github.com/abdullah5654/cortexis-website.git
cd cortexis-website

# 2. Build and launch all services with Docker Compose
docker compose up --build
```

Once started, open:
* **Web Application & 109 Tools:** `http://localhost:5000`
* **API Endpoints:** `http://localhost:5000/api`

---

## Local Development (Without Docker)

```bash
# Install everything and build the client
npm run build

# Development — two terminals
npm start --prefix server     # API on :5000
npm start --prefix client     # React dev server on :3000

# Production — Express serves the built client on one origin
NODE_ENV=production npm start
```

### Environment

Create `server/.env`:

```
PORT=5000
DATABASE_FILE=./data/cortexis.db

# Required — long random string. Rotating it signs every learner out.
JWT_SECRET=<64+ random hex characters>

# Optional — contact-form email. Submissions still save when unset.
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_TO=
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The SQLite file and its tables are created automatically on first run.

## Project Structure

```
├── client/
│   └── src/
│       ├── components/          # Shared UI (Navbar, Footer, RequireAuth…)
│       ├── context/             # AuthContext — session state
│       ├── learn/               # Markdown renderer, Quiz, ProgressBar
│       ├── lib/api.js           # fetch wrapper: attaches JWT, unwraps errors
│       ├── hooks/               # GSAP animation hooks
│       └── pages/               # Route components
│
└── server/
    └── src/
        ├── content/
        │   ├── courses/         # One file per course — the entire catalogue
        │   ├── authoring.js     # course()/chapter()/lesson()/q() helpers
        │   ├── index.js         # Auto-discovers course files
        │   └── seed.js          # Upserts content into SQLite on boot
        ├── middleware/auth.js   # requireAuth / optionalAuth
        ├── models/              # Table repositories
        ├── routes/              # contact, courses, internships, auth, learn
        ├── setup/db.js          # Schema + connection
        └── server.js            # Entry point
```

## Adding a Course

Drop a new file into `server/src/content/courses/` and restart. Nothing else changes —
the loader discovers it, the seeder inserts it, and the catalogue picks it up. A malformed
file is skipped with a warning rather than crashing the server.

```js
import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'my-course',
  title: 'My Course',
  category: 'Web',
  level: 'Beginner',
  duration: '6 weeks',
  accent: 'violet',          // drives the generated cover when no image exists
  coverKey: 'my-course',     // maps to an image in client/src/assets/courses/
  summary: 'One sentence.',
  description: 'Two sentences on what the learner actually does.',
  chapters: [
    chapter('Chapter Title', 'Chapter summary.', [
      lesson('Lesson Title', 12, `Markdown body…`),
    ], [
      q('Question?', ['A', 'B', 'C', 'D'], 1, 'Why B is right.'),
    ]),
  ],
  final: [
    q('Exam question?', ['A', 'B', 'C', 'D'], 2, 'Explanation.'),
  ],
});
```

Chapters and lessons are upserted on their `(parent, position)` keys, so ids stay stable
across restarts and existing learners keep their progress when content is edited.

Quiz options are shuffled deterministically at seed time, seeded from the question text.
Authored answer keys tend to cluster on one option; without this, "always pick B" could
score near the pass mark. The shuffle is stable across restarts, so options never move
under a learner mid-quiz.

## API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Sign in |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/learn/courses` | — | Catalogue |
| GET | `/api/learn/courses/:slug` | optional | Outline, plus progress when signed in |
| POST | `/api/learn/courses/:slug/enroll` | ✓ | Enrol |
| GET | `/api/learn/my` | ✓ | Dashboard |
| GET | `/api/learn/lessons/:id` | ✓ | Lesson body (enrolment required) |
| POST | `/api/learn/lessons/:id/complete` | ✓ | Mark complete |
| GET/POST | `/api/learn/quiz/chapter/:chapterId` | ✓ | Chapter quiz / grade it |
| GET/POST | `/api/learn/final/:slug` | ✓ | Final exam / grade + issue certificate |
| GET | `/api/learn/certificate/:code` | — | Public verification |
| POST | `/api/contact` · `/api/courses/register` · `/api/internships/apply` | — | Site forms |

## Notes

- Login returns an identical message for an unknown email and a wrong password, so the
  endpoint cannot be used to discover which addresses have accounts.
- Auth endpoints are rate-limited separately (20 attempts / 15 min) from the learning API.
- The React catch-all route is registered after the API so it cannot swallow `/api/*`.
