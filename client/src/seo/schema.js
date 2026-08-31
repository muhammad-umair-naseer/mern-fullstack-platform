/**
 * Schema.org JSON-LD builders.
 *
 * Structured data is how a result becomes more than a blue link: a course can
 * carry its provider and price, a page can show a breadcrumb trail, an FAQ can
 * expand in place. Google reads it, ignores what it does not recognise, and
 * penalises markup that claims things the page does not actually show. So
 * everything here is built from values the page really renders.
 */
import { SITE, SITE_URL, absolute } from './site';

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE_URL,
  logo: absolute('/cortexis-logo.png'),
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  description: SITE.description,
  foundingDate: SITE.registration.incorporated,
  // The company register entry, so a search engine can tie this site to a real
  // legal entity rather than taking the name on trust.
  identifier: {
    '@type': 'PropertyValue',
    name: `${SITE.registration.authorityShort} Corporate Unique Identification Number`,
    value: SITE.registration.cuin,
  },
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE.name,
  publisher: { '@id': `${SITE_URL}/#organization` },
});

/**
 * A course. `Course` is one of the few types that still earns a rich result,
 * and free courses with certificates are exactly what it was designed for.
 */
export const course = (c) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  '@id': absolute(`/learn/${c.slug}#course`),
  name: c.title,
  description: c.summary || c.description,
  url: absolute(`/learn/${c.slug}`),
  provider: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
  educationalLevel: c.level,
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PKR',
    availability: 'https://schema.org/InStock',
    category: 'Free',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: c.hours ? `PT${c.hours}H` : undefined,
  },
});

/** The trail Google prints above a result instead of a bare URL. */
export const breadcrumbs = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absolute(item.path),
  })),
});

/** A list page, so the crawler sees the set rather than guessing from links. */
export const itemList = (items, pathOf) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.title,
    url: absolute(pathOf(item)),
  })),
});

/** Only use this where the questions and answers are genuinely on the page. */
export const faq = (pairs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pairs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/**
 * A working web tool.
 *
 * SoftwareApplication is the right type for a browser based utility, and the
 * zero price offer is what marks it as genuinely free rather than freemium.
 * Only use this once the tool actually runs: describing a page as an
 * application when it is a "coming soon" notice is exactly the mismatch that
 * gets structured data ignored or penalised.
 */
export const softwareApplication = (tool, categoryLabel) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': absolute(`/tools/${tool.slug}#app`),
  name: tool.name,
  description: tool.description,
  url: absolute(`/tools/${tool.slug}`),
  applicationCategory: categoryLabel ? `${categoryLabel} tool` : 'Utility',
  operatingSystem: 'Any, runs in a web browser',
  browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PKR',
  },
  provider: { '@id': `${SITE_URL}/#organization` },
});
