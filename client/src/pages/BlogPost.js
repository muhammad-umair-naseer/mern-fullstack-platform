import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { POSTS, postBySlug } from '../data/blog.generated';
import Markdown from '../learn/Markdown';
import PostCard, { CATEGORY } from '../components/PostCard';
import PageHero from '../components/PageHero';
import BlogPostVisual from '../components/heroes/BlogPostVisual';
import TableOfContents from '../components/blog/TableOfContents';
import BlogFaq from '../components/blog/BlogFaq';
import { parseBlogContent } from '../lib/blogParser';
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

// The title as headline lines, the last in italic. Three lines for anything
// past a short title. The breaks keep the longest line short, but read like
// a typesetter set them: a pause after a colon or comma is welcome, a line
// may open on a preposition, and no line ends on "a", "the", "to" or "your"
// or is left as a single word. Ties go to the more even set of lines.
const ARTICLE = /^(a|an|the)$/i;
const JOINER = /^(to|of|for|in|on|at|by|with|and|or)$/i;
const OWNER = /^(my|your|our)$/i;

function headline(title) {
  const w = title.split(/\s+/);
  const n = Math.min(title.length > 30 ? 3 : 2, w.length);
  if (n < 2) return [<em key="em">{title}</em>];

  // Cost of breaking after word k-1 (and so opening a line on word k).
  const breakCost = (k) => {
    const before = w[k - 1];
    let cost = 0;
    if (/[:,]$/.test(before)) cost -= 6;
    else if (ARTICLE.test(before)) cost += 8;
    else if (JOINER.test(before) || OWNER.test(before)) cost += 4;
    if (JOINER.test(w[k])) cost -= 2;
    return cost;
  };

  const cuts = [];
  for (let a = 1; a < w.length; a += 1) {
    if (n === 2) cuts.push([a]);
    else for (let b = a + 1; b < w.length; b += 1) cuts.push([a, b]);
  }
  const laid = cuts.map((c) => {
    const edges = [0, ...c, w.length];
    const parts = edges.slice(1).map((end, i) => w.slice(edges[i], end).join(' '));
    const lens = parts.map((p) => p.length);
    const widest = Math.max(...lens);
    const runts = n === 3 ? parts.filter((p) => !p.includes(' ')).length : 0;
    return {
      parts,
      widest,
      score: widest + runts * 5 + c.reduce((sum, k) => sum + breakCost(k), 0),
      spread: lens.reduce((sum, l) => sum + l * l, 0),
    };
  });
  // Good breaks may cost a little width, never a lot.
  const narrowest = Math.min(...laid.map((o) => o.widest));
  const best = laid
    .filter((o) => o.widest <= narrowest + 6)
    .reduce((a, b) => (b.score < a.score || (b.score === a.score && b.spread < a.spread) ? b : a));
  const last = best.parts.pop();
  return [...best.parts, <em key="em">{last}</em>];
}

const BlogPost = () => {
  const { slug } = useParams();
  const post = postBySlug(slug);

  // Parse TOC and FAQ from post body
  const { toc, faqs, cleanedBody } = useMemo(() => {
    if (!post?.body) return { toc: [], faqs: [], cleanedBody: '' };
    return parseBlogContent(post.body);
  }, [post?.body]);

  if (!post) {
    return (
      <main className="min-h-screen">
        <Seo title="Post not found" description="That post is not here." path={`/blog/${slug}`} noindex />
        <PageHero
          align="center"
          lines={['That post', <em key="em">is not here.</em>]}
          actions={[{ to: '/blog', label: 'See everything we have written', primary: true }]}
        />
      </main>
    );
  }

  // Read next: the newest other posts
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

      {/* Keyed on the post: a Read next click keeps this route mounted, and
          without a fresh tree the next post would appear with no entrance and
          inherit the last post's open FAQ and contents state. */}
      <article key={post.slug}>
        <div className="bph">
          <PageHero
            back={{ to: '/blog', label: 'Writing' }}
            label={(CATEGORY[post.category] || { label: 'Notes' }).label}
            lines={headline(post.title)}
            // The reading time sits on the cover's dial; without a cover it
            // joins the date here.
            meta={post.image ? [formatDate(post.date)] : [formatDate(post.date), `${post.minutes} min read`]}
            visual={
              post.image ? (
                <BlogPostVisual src={post.image} alt={post.imageAlt || post.title} minutes={post.minutes} />
              ) : undefined
            }
          />
        </div>

        <div className="cx-lv-sheet">
          {/* Interactive Table of Contents Table at top of article */}
          {toc.length > 0 && <TableOfContents items={toc} />}

          {/* Cleaned Article Body */}
          <div className="cx-lv-in cx-lv-body" style={{ '--i': 3 }}>
            <Markdown>{cleanedBody}</Markdown>
          </div>

          {/* Interactive FAQ Accordion Component at end of article */}
          {faqs.length > 0 && <BlogFaq faqs={faqs} />}

          {more.length > 0 && (
            <section className="bp-next" aria-labelledby="read-next">
              <h2 id="read-next" className="bp-next-title">
                Read <em>next</em>
              </h2>
              <div className="bp-next-grid">
                {more.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
};

export default BlogPost;
