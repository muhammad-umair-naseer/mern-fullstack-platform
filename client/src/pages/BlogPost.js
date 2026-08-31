import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { POSTS, postBySlug } from '../data/blog.generated';
import Markdown from '../learn/Markdown';
import Seo from '../seo/Seo';
import { breadcrumbs } from '../seo/schema';
import { SITE, absolute } from '../seo/site';
import '../learn/LessonView.css';

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

const BlogPost = () => {
  const { slug } = useParams();
  const post = postBySlug(slug);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Seo title="Post not found" description="That post is not here." path={`/blog/${slug}`} noindex />
        <h1 className="text-2xl font-bold text-black">That post is not here</h1>
        <Link to="/blog" className="mt-4 inline-block text-orange-600 font-bold hover:underline">
          See everything we have written
        </Link>
      </main>
    );
  }

  // Read next: the newest other posts. Keeps a reader moving and stops each post
  // being a dead end in the link graph.
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="cx-lv text-black min-h-screen">
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated,
            url: absolute(`/blog/${post.slug}`),
            mainEntityOfPage: absolute(`/blog/${post.slug}`),
            author: { '@type': 'Organization', name: SITE.legalName },
            publisher: { '@id': `${absolute('/')}#organization`.replace('//#', '/#') },
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="cx-lv-sheet">
        <header className="cx-lv-head">
          <p className="cx-lv-in cx-lv-eyebrow" style={{ '--i': 0 }}>
            <Link to="/blog" className="hover:underline">Writing</Link>
          </p>
          <h1 className="cx-lv-in cx-lv-title" style={{ '--i': 1 }}>{post.title}</h1>
          <p className="cx-lv-in cx-lv-meta" style={{ '--i': 2 }}>
            <span className="cx-lv-dot" aria-hidden="true" />
            {formatDate(post.date)}
            <span className="cx-lv-sep" aria-hidden="true" />
            {post.minutes} min read
          </p>
        </header>

        <div className="cx-lv-in cx-lv-body" style={{ '--i': 3 }}>
          <Markdown>{post.body}</Markdown>
        </div>

        {more.length > 0 && (
          <div className="cx-lv-foot">
            <h2 className="text-lg font-bold text-black">Read next</h2>
            <ul className="mt-4 space-y-3">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="text-orange-700 font-bold hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-sm text-slate-600 mt-0.5">{p.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </main>
  );
};

export default BlogPost;
