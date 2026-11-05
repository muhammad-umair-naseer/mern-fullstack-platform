import React from 'react';
import { SITE, absolute } from './site';

/**
 * Per page title, description, canonical, social cards and structured data.
 *
 * No library is involved. React 19 hoists <title data-cx-seo="">, <meta data-cx-seo=""> and <link data-cx-seo=""> to the
 * document head from anywhere in the tree and de-duplicates them, so a page
 * simply renders <Seo /> with its own copy and the last one mounted wins.
 *
 * Every public page needs one. Without it all 22 routes serve the same title
 * and description, which is what search engines were seeing.
 *
 * @param {string}  title       Page title. The site name is appended unless `bare`.
 * @param {string}  description 150-160 characters, written for a human reading results.
 * @param {string}  path        Route path, used for the canonical and og:url.
 * @param {string}  image       Social card image, absolute or site relative.
 * @param {boolean} noindex     Keep private or duplicate pages out of the index.
 * @param {object|object[]} schema  JSON-LD, already built by ./schema.
 * @param {boolean} bare        Use the title exactly as given, no suffix.
 */
const Seo = ({
  title,
  description = SITE.description,
  path = '/',
  image = SITE.ogImage,
  noindex = false,
  schema,
  bare = false,
  children,
}) => {
  const fullTitle = !title ? SITE.name : bare ? title : `${title} | ${SITE.titleSuffix}`;
  const canonical = absolute(path);
  const cardImage = image?.startsWith('http') ? image : absolute(image);
  const blocks = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <>
      <title data-cx-seo="">{fullTitle}</title>
      <meta data-cx-seo="" name="description" content={description} />
      <link data-cx-seo="" rel="canonical" href={canonical} />

      {/* A page that should not be indexed still needs to be crawlable, so the
          rule is noindex rather than a robots.txt Disallow: blocking the crawl
          would also stop it seeing the canonical and the links out. */}
      {noindex && <meta data-cx-seo="" name="robots" content="noindex, follow" />}

      <meta data-cx-seo="" property="og:type" content="website" />
      <meta data-cx-seo="" property="og:site_name" content={SITE.name} />
      <meta data-cx-seo="" property="og:locale" content={SITE.locale} />
      <meta data-cx-seo="" property="og:title" content={fullTitle} />
      <meta data-cx-seo="" property="og:description" content={description} />
      <meta data-cx-seo="" property="og:url" content={canonical} />
      <meta data-cx-seo="" property="og:image" content={cardImage} />

      <meta data-cx-seo="" name="twitter:card" content="summary_large_image" />
      <meta data-cx-seo="" name="twitter:title" content={fullTitle} />
      <meta data-cx-seo="" name="twitter:description" content={description} />
      <meta data-cx-seo="" name="twitter:image" content={cardImage} />

      {blocks.map((block, i) => (
        <script data-cx-seo=""
          key={i}
          type="application/ld+json"
          // Structured data is built by ./schema from our own values, never
          // from anything a user typed. The < escape stops a stray closing tag
          // inside a string from ending the script element early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, '\\u003c') }}
        />
      ))}

      {children}
    </>
  );
};

export default Seo;
