/**
 * Schema.org JSON-LD builders for Answer Engine Optimization (AEO)
 * and Generative Engine Optimization (GEO).
 *
 * Structured data gives AI models and search engines the semantic anchors
 * they need to accurately summarize and cite the platform.
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
  identifier: {
    '@type': 'PropertyValue',
    name: `${SITE.registration.authorityShort} Corporate Unique Identification Number`,
    value: SITE.registration.cuin,
  },
  sameAs: [
    SITE.registration.verifyUrl,
    'https://github.com/abdullah5654/cortexis-website',
    'https://www.linkedin.com/company/cortexis-solution-hub-pvt-ltd/',
    'https://www.instagram.com/cortexissolutionhub/',
    'https://www.facebook.com/p/Cortexis-Solution-Hub-61579434816434/',
  ],
  areaServed: [
    { '@type': 'Country', name: 'Pakistan' },
    { '@type': 'AdministrativeArea', name: 'Worldwide' },
  ],
  knowsAbout: [
    'Software Architecture',
    'Artificial Intelligence & Autonomous Agents',
    'Meta Graph API & WhatsApp Automations',
    'WebAssembly Browser Utilities',
    'Full-Stack Web Development',
    'MERN Stack Engineering',
  ],
  founder: [
    {
      '@type': 'Person',
      name: 'Abdullah',
      jobTitle: 'Lead Full-Stack Architect & AI Systems Specialist',
      worksFor: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Person',
      name: 'Muhammad Umair Naseer',
      jobTitle: 'Senior Software Engineer & Technical Solutions Lead',
      worksFor: { '@id': `${SITE_URL}/#organization` },
    },
  ],
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
 * A course schema optimized for AEO/GEO.
 * Course carries its provider, zero tuition price, curriculum details,
 * and verified digital credential specification.
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
  educationalLevel: c.level || 'Beginner to Intermediate',
  isAccessibleForFree: true,
  educationalCredentialAwarded: 'Cortexis Verified Certificate of Completion',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PKR',
    availability: 'https://schema.org/InStock',
    category: 'Free Online Course',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: c.hours ? `PT${c.hours}H` : 'PT20H',
    instructor: { '@id': `${SITE_URL}/#organization` },
  },
});

/** The breadcrumb trail search engines display above a result. */
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

/** An item list for catalogue pages. */
export const itemList = (items, pathOf) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.title || item.name,
    url: absolute(pathOf(item)),
  })),
});

/** FAQ schema for direct extraction by AI search and rich snippets. */
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
 * Enterprise service schema for service pages.
 */
export const service = (s) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': absolute(`/services/${s.slug}#service`),
  name: s.title,
  description: s.description,
  serviceType: s.category || 'Software Engineering',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: { '@type': 'Country', name: 'Worldwide' },
  termsOfService: absolute('/terms'),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: `${s.title} Deliverables`,
    itemListElement: (s.deliverables || []).map((d, i) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: d },
      position: i + 1,
    })),
  },
});

/**
 * Step-by-step HowTo schema for tool pages.
 * Essential for AEO zero-click snippets and Gemini/Perplexity step extraction.
 */
export const howTo = (tool, customSteps) => {
  const steps = customSteps || [
    {
      name: 'Select or Drag Your File',
      text: `Open the Cortexis ${tool.name} and drag your file into the browser box or click to browse.`,
    },
    {
      name: 'Configure Processing Parameters',
      text: 'Adjust your preferred settings or parameters directly in the web UI.',
    },
    {
      name: 'Process Locally in Memory',
      text: 'The tool executes 100% client-side in your browser RAM using WebAssembly. No files are uploaded to any server.',
    },
    {
      name: 'Instant Watermark-Free Download',
      text: 'Click the download button to immediately retrieve your completed file with zero watermarks or account signups.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': absolute(`/tools/${tool.slug}#howto`),
    name: `How to use ${tool.name} online for free`,
    description: tool.description,
    totalTime: 'PT1M',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
};

/**
 * Working web tool schema with privacy and WebAssembly capabilities.
 */
export const softwareApplication = (tool, categoryLabel) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': absolute(`/tools/${tool.slug}#app`),
  name: tool.name,
  description: tool.description,
  url: absolute(`/tools/${tool.slug}`),
  applicationCategory: categoryLabel ? `${categoryLabel}Application` : 'UtilityApplication',
  operatingSystem: 'All Modern Web Browsers (Chrome, Firefox, Safari, Edge, Brave)',
  browserRequirements: 'Requires modern JavaScript and WebAssembly support',
  isAccessibleForFree: true,
  featureList: [
    '100% In-Browser Execution',
    'Zero Server Uploads (Total Data Privacy)',
    'Zero Data Logging or Retention',
    'No Watermarks on Output Files',
    'Unlimited Free Usage Without Account',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PKR',
    category: 'Free Web Utility',
  },
  provider: { '@id': `${SITE_URL}/#organization` },
});

export const hostedArticle = (post, path, faqs = []) => [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': absolute(`${path}#${post.slug}`),
    headline: post.title,
    description: post.description,
    image: post.image ? [absolute(post.image)] : undefined,
    datePublished: post.date,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: SITE.legalName },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: absolute(path),
    url: absolute(`${path}#${post.slug}`),
  },
  ...(faqs.length ? [faq(faqs.map((f) => ({ q: f.question, a: f.answer })))] : []),
];
