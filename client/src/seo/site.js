/**
 * One place that knows who this site is.
 *
 * `SITE_URL` is the only value that has to change when the domain is bought:
 * canonical links, Open Graph URLs, the sitemap and the structured data all
 * derive from it. Set REACT_APP_SITE_URL at build time, or edit the fallback.
 */
export const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://cortexissolutionhub.com').replace(/\/$/, '');

export const SITE = {
  name: 'Cortexis Solution Hub',
  legalName: 'Cortexis Solution Hub (Pvt.) Ltd.',
  // Appended to every page title except the homepage, which sets its own.
  titleSuffix: 'Cortexis Solution Hub',
  description:
    'Software development, training and consulting from Islamabad. Free online courses with certificates, paid internships, and custom web, mobile and AI builds.',
  locale: 'en_PK',
  email: 'cortexis.solution.hub@gmail.com',
  city: 'Islamabad',
  country: 'PK',
  // The image used when a link is shared. Replace with a purpose made 1200x630
  // card when you have one; the logo is a placeholder that at least renders.
  ogImage: '/cortexis-logo.png',
};

export const absolute = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
