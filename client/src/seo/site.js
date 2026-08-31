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
    'Software development, training and consulting from Islamabad. Free online courses with certificates, free internships, and custom web, mobile and AI builds.',
  locale: 'en_PK',
  email: 'cortexis.solution.hub@gmail.com',
  city: 'Islamabad',
  region: 'Islamabad Capital Territory',
  country: 'PK',

  // Public register facts only, taken from the SECP certificate of
  // incorporation. Deliberately excluded: director names and CNICs, personal
  // addresses, contact details and share capital. None of that belongs on a
  // website, and the registered office on the filing is a home address.
  registration: {
    authority: 'Securities and Exchange Commission of Pakistan',
    authorityShort: 'SECP',
    // Corporate Unique Identification Number
    cuin: '0306803',
    incorporated: '2025-09-02',
    act: 'Companies Act, 2017',
    // The SECP's public company name search. It is a search page rather than a
    // direct record link, so the About page tells the visitor to look us up by
    // the registered name rather than promising a one click result.
    verifyUrl: 'https://eservices.secp.gov.pk/eServices/NameSearch.jsp',
  },
  // The image used when a link is shared. Replace with a purpose made 1200x630
  // card when you have one; the logo is a placeholder that at least renders.
  ogImage: '/cortexis-logo.png',
};

export const absolute = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
