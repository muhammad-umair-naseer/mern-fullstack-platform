# Cortexis Solution Hub — Platform & Learning System

A full-stack web platform with a self-serve online learning system: a React front end, a
Node/Express API, and PostgreSQL for storage (SQLite for local development). Learners sign up, work through course lessons,
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
| Backend | Node.js, Express 4, PostgreSQL (pg) / SQLite, Joi, bcryptjs, jsonwebtoken, Nodemailer |
| Security | Helmet, CORS, express-rate-limit |

## Getting Started

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

# Production: a PostgreSQL connection string. Leave empty locally and the
# server uses the SQLite file below instead.
DATABASE_URL=
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

Tables are created automatically on first run, on either database. Run `npm test --prefix server` to walk a learner from sign-up to certificate against a scratch database; set `DATABASE_URL` to run the same suite against Postgres.

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
        │   └── seed.js          # Upserts content into the database on boot
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

## Continuous Integration

Every push and pull request runs `.github/workflows/ci.yml`:

| Job | What it proves |
| --- | --- |
| Repository hygiene | no `.env`, database or key file is committed; lockfiles exist; `docker-compose.yml` parses |
| API on sqlite / postgres | every module parses; the end-to-end learner suite (sign-up → verification → enrolment → gated lessons → quizzes → certificate, plus both public forms) passes on SQLite and on PostgreSQL, each with a real Redis; the server cold-boots and `/health` names the right database |
| Web client | ESLint with zero warnings; Jest (catalogue invariants: every live tool is routed, has its guide, meta, FAQ data and banner); the production build with blog, sitemap and the Chrome prerender against a live API; a check that the prerender really produced the tool pages; the build is kept as an artifact |
| Production image | for pull requests, pushes to `main` and manual runs: the Docker image is built exactly as a host would build it and the running container is smoke-tested (`/health`, the API, a prerendered page, the sitemap) |

Run the same checks locally before pushing:

```bash
npm test --prefix server                                  # needs Redis on 127.0.0.1:6379
DATABASE_URL=postgres://localhost/cortexis_test npm test --prefix server
npx eslint --max-warnings=0 src   # in client/
CI=true npm test --prefix client -- --watchAll=false
docker build -t cortexis-website .                        # builds and prerenders
```

The image build boots a throwaway API on SQLite and prerenders every public
route with Chromium, so an image built anywhere ships the same crawlable pages.

### Deploying with Docker Compose

```bash
cp .env.example .env      # then fill in JWT_SECRET, POSTGRES_PASSWORD, REDIS_PASSWORD
docker compose up -d --build
```

Compose refuses to start until those three values are set — there are no
built-in defaults, so a forgotten secret can never fall back to something the
public repository knows. Postgres and Redis run alongside the API on a private
network; only port 5000 is published.

## Notes

- Login returns an identical message for an unknown email and a wrong password, so the
  endpoint cannot be used to discover which addresses have accounts.
- Auth endpoints are rate-limited separately (20 attempts / 15 min) from the learning API.
- The React catch-all route is registered after the API so it cannot swallow `/api/*`.
