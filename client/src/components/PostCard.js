import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { postPath } from '../data/blog.generated';
import './PostCard.css';

/** Display name for each category, so a tag is never shown raw. */
export const CATEGORY = {
  ai: { label: 'AI' },
  pdf: { label: 'Tools' },
  whatsapp: { label: 'Automation' },
  instagram: { label: 'Automation' },
  pricing: { label: 'Pricing' },
  careers: { label: 'Careers' },
  internships: { label: 'Internships' },
};

const labelOf = (c) => (CATEGORY[c] || { label: 'Notes' }).label;

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
 * A post as a card: the photograph, the title in the display serif, and one
 * mono line of facts. The excerpt lives on the post itself.
 *
 * A post without artwork gets a drawn cover (its monogram on sand), so a
 * missing file never reads as a hole.
 */
const PostCard = ({ post, featured = false }) => (
  <article className={`cx-pc${featured ? ' is-featured' : ''}`} data-card>
    <Link to={postPath(post)} className="cx-pc-link">
      <div className="cx-pc-cover">
        {post.image ? (
          <img src={post.image} alt={post.imageAlt || ''} loading="lazy" decoding="async" />
        ) : (
          <span className="cx-pc-mono" aria-hidden="true">{monogram(post.title)}</span>
        )}
        <span className="cx-pc-cat">{labelOf(post.category)}</span>
      </div>

      <div className="cx-pc-body">
        <h3 className="cx-pc-title">{post.title}</h3>
        <span className="cx-pc-meta">
          <span>{post.minutes} min read</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="cx-pc-disc" aria-hidden="true">
            <ArrowUpRight size={15} />
          </span>
        </span>
      </div>
    </Link>
  </article>
);

export default PostCard;
