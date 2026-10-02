import React, { useMemo } from 'react';
import Markdown from '../learn/Markdown';
import TableOfContents from './blog/TableOfContents';
import BlogFaq from './blog/BlogFaq';
import { parseBlogContent } from '../lib/blogParser';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import '../learn/LessonView.css';
import './ServiceArticle.css';

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

// The title with its last three words in the italic, like every headline here.
const headline = (title) => {
  const words = title.split(' ');
  const cut = Math.max(1, words.length - 3);
  return [words.slice(0, cut).join(' '), ' ', <em key="em">{words.slice(cut).join(' ')}</em>];
};

/**
 * A blog post whose markdown names another page as its home, read in full
 * on that page: cover, contents, body and questions, in the blog's own reading
 * layout. The section's id is the post's slug, which is where the blog card
 * and /blog/<slug> send people.
 */
export default function ServiceArticle({ post, label = 'From our AI team' }) {
  const ref = useRevealOnScroll();
  const { toc, faqs, cleanedBody } = useMemo(() => parseBlogContent(post.body), [post.body]);

  return (
    <section ref={ref} id={post.slug} className="cx-lv svd-article" aria-labelledby={`${post.slug}-title`}>
      <header className="svd-article-head">
        <span className="lx-label" data-reveal>{label}</span>
        <h2 id={`${post.slug}-title`} className="lx-h2 svd-article-title" data-reveal>
          {headline(post.title)}
        </h2>
        <p className="svd-article-meta" data-reveal>
          {formatDate(post.date)} <span aria-hidden="true">·</span> {post.minutes} min read
        </p>
      </header>

      {post.image && (
        <figure className="svd-article-cover lx-frame" data-reveal-media>
          <img src={post.image} alt={post.imageAlt || ''} width="1600" height="900" loading="lazy" decoding="async" />
        </figure>
      )}

      <div className="cx-lv-sheet">
        {toc.length > 0 && <TableOfContents items={toc} />}
        <div className="cx-lv-in cx-lv-body" style={{ '--i': 3 }}>
          <Markdown>{cleanedBody}</Markdown>
        </div>
        {faqs.length > 0 && <BlogFaq faqs={faqs} />}
      </div>
    </section>
  );
}
