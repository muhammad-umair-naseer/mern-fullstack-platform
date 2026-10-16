// Markdown posts in content/blog/ become a JS module the app can import.
//
// Create React App cannot import .md without ejecting, and a database would
// mean new posts are invisible to the prerender until the next build anyway.
// A file on disk is the simplest thing that puts full post text into the static
// HTML by construction: write a .md, commit, it is live and crawlable.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(HERE, '../content/blog');
const OUT = resolve(HERE, '../src/data/blog.generated.js');

// A deliberately small frontmatter reader. Posts are written by us, not by
// users, so this handles what we actually use rather than all of YAML: strings,
// [a, b] lists, and nothing nested. Anything it cannot parse fails loudly at
// build time rather than shipping a half-read post.
const parseFrontmatter = (raw, file) => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) throw new Error(`${file}: missing --- frontmatter block at the top`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const at = line.indexOf(':');
    if (at === -1) throw new Error(`${file}: cannot parse frontmatter line "${line}"`);
    const key = line.slice(0, at).trim();
    let value = line.slice(at + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((v) => v.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, '');
    }
    meta[key] = value;
  }
  return { meta, body: raw.slice(m[0].length) };
};

const REQUIRED = ['title', 'description', 'date'];

// Reading time from the body, so it never drifts from the actual post.
const readingMinutes = (body) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200));

const posts = [];
const drafts = [];
if (existsSync(DIR)) {
  for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()) {
    const raw = readFileSync(`${DIR}/${file}`, 'utf8');
    const { meta, body } = parseFrontmatter(raw, file);

    for (const key of REQUIRED) {
      if (!meta[key]) throw new Error(`${file}: frontmatter is missing "${key}"`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
      throw new Error(`${file}: date must be YYYY-MM-DD, got "${meta.date}"`);
    }
    if (meta.home && !/^\/[a-z0-9/-]+$/.test(meta.home)) {
      throw new Error(`${file}: home must be a site path like /services/ai-automation, got "${meta.home}"`);
    }
    if (meta.image && !meta.image.startsWith('/')) {
      throw new Error(`${file}: image must be a site path like /blog/name.webp, got "${meta.image}"`);
    }
    if (meta.description.length > 155) {
      throw new Error(`${file}: description is ${meta.description.length} chars, Google truncates past 155`);
    }
    if (!body.trim()) throw new Error(`${file}: post has no body`);

    // A post can be written and committed without going live. Used where a post
    // is finished except for a number only the business can supply: better held
    // back than published with an invented figure a customer will quote at you.
    if (String(meta.draft).toLowerCase() === 'true') {
      drafts.push(file);
      continue;
    }

    const slug = meta.slug || file.replace(/\.md$/, '');
    if (posts.some((p) => p.slug === slug)) throw new Error(`${file}: duplicate slug "${slug}"`);

    posts.push({
      slug,
      title: meta.title,
      description: meta.description,
      date: meta.date,
      updated: meta.updated || meta.date,
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
      // Named so a post can say which search it was written for. Not used for
      // anything automatic; it is a note to whoever edits it next.
      targetQuery: meta.targetQuery || '',
      // A cover lives in public/blog/ and is referenced by URL, not imported.
      // That keeps this script runnable in plain Node, which cannot load a
      // .webp, and means adding artwork is one line of frontmatter and one
      // file. Without it the card draws a designed cover from the category.
      image: meta.image || '',
      imageAlt: meta.imageAlt || meta.alt || meta.title || '',
      author: meta.author || 'Cortexis Solution Hub',
      // A post can live on another page instead of /blog/<slug>: the service
      // page it belongs to renders it in full, the blog card links there, and
      // /blog/<slug> redirects, so the words sit at one address only.
      home: meta.home || '',
      // The course this post is the guide for: its page links back here.
      course: meta.course || '',
      category: (Array.isArray(meta.tags) ? meta.tags[0] : meta.tags) || 'notes',
      minutes: readingMinutes(body),
      body: body.trim(),
    });
  }
}

// Newest first, which is what both the index and the sitemap want.
posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  `/* GENERATED by scripts/build-blog.mjs from content/blog/*.md — do not edit.\n` +
  ` * Add or change a post by editing the markdown, then rebuild. */\n\n` +
  `export const POSTS = ${JSON.stringify(posts, null, 2)};\n\n` +
  `export const postBySlug = (slug) => POSTS.find((p) => p.slug === slug);\n\n` +
  `/** Where a post is read: its own crawlable address. */\n` +
  // a course guide is read on its course page, so links go there
  `export const postPath = (p) => (p.home && p.home.startsWith('/learn/') ? \`\${p.home}#\${p.slug}\` : \`/blog/\${p.slug}\`);\n`
);

const draftNote = drafts.length ? `, ${drafts.length} draft(s) held back` : '';
console.log(
  posts.length
    ? `blog: ${posts.length} post(s) generated${draftNote}`
    : `blog: no published posts${draftNote}`
);
if (drafts.length) drafts.forEach((d) => console.log(`  draft (not published): ${d}`));
