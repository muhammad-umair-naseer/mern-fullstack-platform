import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { POSTS, postBySlug } from '../data/blog.generated';
import Markdown from '../learn/Markdown';
import PostCard, { CATEGORY } from '../components/PostCard';
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
        image={post.image ? absolute(post.image) : undefined}
        path={`/blog/${post.slug}`}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            image: post.image ? [absolute(post.image)] : undefined,
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
            {' · '}
            {(CATEGORY[post.category] || { label: 'Notes' }).label}
          </p>
          <h1 className="cx-lv-in cx-lv-title" style={{ '--i': 1 }}>{post.title}</h1>
          <p className="cx-lv-in cx-lv-meta" style={{ '--i': 2 }}>
            <span className="cx-lv-dot" aria-hidden="true" />
            {post.author}
            <span className="cx-lv-sep" aria-hidden="true" />
            {formatDate(post.date)}
            <span className="cx-lv-sep" aria-hidden="true" />
            {post.minutes} min read
          </p>
        </header>

        {post.image && (
          <div className="cx-lv-in my-8 rounded-2xl overflow-hidden shadow-xl border border-slate-200/80" style={{ '--i': 2.5 }}>
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              className="w-full h-auto max-h-[480px] object-cover rounded-2xl"
              loading="eager"
            />
          </div>
        )}

        <div className="cx-lv-in cx-lv-body" style={{ '--i': 3 }}>
          <Markdown>{post.body}</Markdown>
        </div>

        {more.length > 0 && (
          <div className="cx-lv-foot">
            <h2 className="text-lg font-bold text-black">Read next</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {more.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
};

export default BlogPost;
