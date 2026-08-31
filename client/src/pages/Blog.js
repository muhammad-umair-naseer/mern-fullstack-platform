import React, { useMemo, useState } from 'react';
import { POSTS } from '../data/blog.generated';
import PostCard, { CATEGORY } from '../components/PostCard';
import Seo from '../seo/Seo';
import { breadcrumbs, itemList } from '../seo/schema';
import { SITE } from '../seo/site';

const Blog = () => {
  const [cat, setCat] = useState('All');

  // Categories in the order they first appear, so the row is stable.
  const categories = useMemo(() => {
    const seen = [];
    POSTS.forEach((p) => {
      const label = (CATEGORY[p.category] || {}).label || 'Notes';
      if (!seen.includes(label)) seen.push(label);
    });
    return ['All', ...seen];
  }, []);

  const filtered = useMemo(
    () =>
      cat === 'All'
        ? POSTS
        : POSTS.filter((p) => ((CATEGORY[p.category] || {}).label || 'Notes') === cat),
    [cat]
  );

  const [lead, ...rest] = filtered;

  return (
    <main className="bg-gray-50 text-gray-800 min-h-screen">
      <Seo
        title="Writing on software, search and free tools"
        description={`Straight answers from the ${SITE.name} team on building software, what it costs, learning to code, and the tools we give away free.`}
        path="/blog"
        schema={[
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
          itemList(POSTS, (p) => `/blog/${p.slug}`),
        ]}
      />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
            From the team
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Writing
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            What things cost, what actually works, and where the honest answer is no. Written by
            the people who build it.
          </p>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                cat === c
                  ? 'bg-orange-600 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-orange-400 hover:text-orange-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {!filtered.length ? (
          <p className="text-slate-600">Nothing here yet.</p>
        ) : (
          <div className="grid gap-7">
            <PostCard post={lead} featured />
            {rest.length > 0 && (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Blog;
