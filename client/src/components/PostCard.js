import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

/** Display name and accent for each category, so a tag is never shown raw. */
export const CATEGORY = {
  pdf: { label: 'Tools', tone: 'teal' },
  whatsapp: { label: 'Automation', tone: 'green' },
  instagram: { label: 'Automation', tone: 'violet' },
  pricing: { label: 'Pricing', tone: 'amber' },
  careers: { label: 'Careers', tone: 'blue' },
  internships: { label: 'Internships', tone: 'orange' },
};

const meta = (c) => CATEGORY[c] || { label: 'Notes', tone: 'blue' };

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  });

/** Initials from the title, used on the drawn cover. */
const monogram = (title) =>
  title
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !/^(a|an|the|and|or|of|for|to|in|on|is|it|you|your|what|how|will|do|does)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/**
 * A post as a card.
 *
 * Covers: a post can name an image in its frontmatter and it is used. Until
 * then the card draws its own from the category, which reads as a deliberate
 * design rather than a missing file. Swapping in real artwork later needs one
 * line of frontmatter and one file in public/blog.
 */
const PostCard = ({ post, featured = false }) => {
  const { label, tone } = meta(post.category);

  return (
    <article className={`cx-pc ${featured ? 'is-featured' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="cx-pc-link">
        <div className={`cx-pc-cover tone-${tone}`}>
          {post.image ? (
            <img src={post.image} alt={post.imageAlt || post.title} loading="lazy" />
          ) : (
            <span className="cx-pc-mono" aria-hidden="true">{monogram(post.title)}</span>
          )}
        </div>

        <div className="cx-pc-body">
          <p className={`cx-pc-cat tone-${tone}`}>{label}</p>
          <h3 className="cx-pc-title">{post.title}</h3>
          <p className="cx-pc-excerpt">{post.description}</p>
          <p className="cx-pc-meta">
            <span className="cx-pc-author">{post.author}</span>
            <span>{formatDate(post.date)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{post.minutes} min read</span>
          </p>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
