import React from 'react';
import { Link } from 'react-router-dom';
import { POSTS } from '../data/blog.generated';
import Seo from '../seo/Seo';
import { breadcrumbs, itemList } from '../seo/schema';
import { SITE } from '../seo/site';

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

const Blog = () => (
  <main className="bg-gray-50 text-gray-800 min-h-screen">
    <Seo
      title="Writing on software, search and free tools"
      description={`Practical writing from the ${SITE.name} team on building software, learning to code, and the tools we give away free.`}
      path="/blog"
      schema={[
        breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
        itemList(POSTS, (p) => `/blog/${p.slug}`),
      ]}
    />

    <header className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Writing</h1>
        <p className="mt-3 text-indigo-100/90 max-w-2xl text-lg">
          Straight answers about building software, learning to code, and the free tools we
          publish. No filler, and we say when the honest answer is no.
        </p>
      </div>
    </header>

    <section className="max-w-4xl mx-auto px-6 py-14">
      {POSTS.length === 0 ? (
        <p className="text-slate-600">The first posts are on their way.</p>
      ) : (
        <ul className="space-y-5">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded-2xl bg-white border border-slate-200 shadow-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                  {formatDate(post.date)} · {post.minutes} min read
                </p>
                <h2 className="mt-2 text-xl font-bold text-black group-hover:text-orange-700">
                  {post.title}
                </h2>
                <p className="mt-2 text-black font-medium leading-relaxed">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  </main>
);

export default Blog;
