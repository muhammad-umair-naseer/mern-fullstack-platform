import React, { useMemo, useState } from 'react';
import { POSTS, postPath } from '../data/blog.generated';
import PostCard, { CATEGORY } from '../components/PostCard';
import PageHero from '../components/PageHero';
import { useGridReveal } from '../hooks/useGridReveal';
import BlogVisual from '../components/heroes/BlogVisual';
import Seo from '../seo/Seo';
import { breadcrumbs, itemList } from '../seo/schema';
import { SITE } from '../seo/site';

// A course guide's canonical home is its course page (/learn/*).
// Only standalone editorial posts appear in the main Blog index.
const BLOG_POSTS = POSTS.filter((p) => !(p.home && p.home.startsWith('/learn/')));

const labelOf = (p) => (CATEGORY[p.category] || {}).label || 'Notes';

// The hero's deck of titles, in the order the grid lists them.
const DECK = BLOG_POSTS.map((p) => ({ slug: p.slug, title: p.title, label: labelOf(p), minutes: p.minutes }));

const Blog = () => {
  const [cat, setCat] = useState('All');

  // Categories in the order they first appear, so the row is stable.
  const categories = useMemo(() => {
    const seen = [];
    BLOG_POSTS.forEach((p) => {
      const label = labelOf(p);
      if (!seen.includes(label)) seen.push(label);
    });
    return ['All', ...seen];
  }, []);

  const filtered = useMemo(
    () =>
      cat === 'All'
        ? BLOG_POSTS
        : BLOG_POSTS.filter((p) => labelOf(p) === cat),
    [cat]
  );

  const gridRef = useGridReveal([filtered]);

  return (
    <main className="text-ink-2 min-h-screen">
      <Seo
        title="Writing on software, search and free tools"
        description={`Straight answers from the ${SITE.name} team on building software, what it costs, learning to code, and the tools we give away free.`}
        path="/blog"
        schema={[
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
          itemList(BLOG_POSTS, postPath),
        ]}
      />

      <PageHero
        label="Writing"
        lines={['Plain answers,', <em>written down.</em>]}
        lede="What things cost, what works, and when the answer is no."
        actions={[{ href: '#posts', label: 'Start reading', primary: true }]}
        visual={<BlogVisual posts={DECK} />}
      />

      <section id="posts" className="lx-wrap pt-0 pb-20 md:pb-28" aria-labelledby="posts-heading">
        <h2 id="posts-heading" className="visually-hidden">All posts</h2>

        <div
          role="group"
          aria-label="Filter by topic"
          className="lx-glass rounded-full p-1.5 flex gap-1 w-fit max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`h-10 px-4 rounded-full focus-visible:rounded-full focus-visible:outline-offset-0 text-sm whitespace-nowrap border transition-colors duration-200 ${
                cat === c
                  ? 'bg-ink text-ivory border-ink'
                  : 'bg-transparent text-ink-2 border-transparent hover:border-[color:var(--line-strong)] hover:bg-white/60'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="mt-6 md:mt-10">
          {!filtered.length ? (
            <p className="text-ink-3">Nothing here yet.</p>
          ) : (
            // The newest post takes two columns and two rows; with twelve posts
            // that leaves every row of the grid full.
            <div className="grid gap-6 lg:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <div key={p.slug} className={i === 0 ? 'sm:col-span-2 lg:row-span-2 grid' : 'grid'}>
                  <PostCard post={p} featured={i === 0} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;
