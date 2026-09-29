/**
 * Photography for the marketing pages, all from Unsplash (free to use under
 * the Unsplash License). Each file is cropped to the aspect ratio it is shown
 * at and encoded to WebP; the credit travels with the photo so it can be shown
 * wherever the photo is.
 */
import serviceWeb from './service-web.webp';
import serviceAi from './service-ai.webp';
import serviceSaas from './service-saas.webp';
import learning from './learning.webp';
import internships from './internships.webp';
import cta from './cta.webp';
import about from './about.webp';
import gIslamabad from './g-islamabad.webp';
import gTeam from './g-team.webp';

export const photos = {
  serviceWeb: {
    src: serviceWeb,
    alt: 'A web engineer coding a responsive modern web application on a laptop in a sunlit studio',
    credit: 'Christopher Gower',
  },
  serviceAi: {
    src: serviceAi,
    alt: 'An AI workflow automation dashboard and agent pipelines on a monitor in a sunlit studio',
    credit: 'Cortexis Studio',
  },
  serviceSaas: {
    src: serviceSaas,
    alt: 'A SaaS platform analytics dashboard with revenue charts on an open laptop in warm daylight',
    credit: 'Cortexis Studio',
  },
  learning: {
    src: learning,
    alt: 'A student writing in a notebook at a sunlit table by a window',
    credit: 'Kyle Gregory Devaras',
  },
  internships: {
    src: internships,
    alt: 'A small team taking notes around a wooden table in afternoon light',
    credit: 'Dylan Gillis',
  },
  cta: {
    src: cta,
    alt: 'An engineer working on software architecture and design at a sunlit dual-monitor studio desk',
    credit: 'Cortexis Studio',
  },
  about: {
    src: about,
    alt: 'The Faisal Mosque in Pakistan with the Margalla Hills behind it',
    credit: 'Mahreen Sarwar',
  },
};

// The studio reel on the home page: the same photographs, cropped for the
// gallery's alternating wide and tall frames.
// Only the two cuts still shown: Pakistan on /about, Internships on
// /internships. The other reel cuts duplicated photos used elsewhere.
export const reel = [
  { src: gIslamabad, w: 1800, h: 1200, caption: 'Pakistan', alt: 'The Faisal Mosque in Pakistan with the Margalla Hills behind it' },
  { src: gTeam, w: 1800, h: 1200, caption: 'Internships', alt: 'A small team taking notes around a wooden table' },
];

// Every photographer whose work is on the site; the reel above reuses the
// same photographs, so the list is complete.
export const photoCredits = Object.values(photos).map((p) => p.credit);
