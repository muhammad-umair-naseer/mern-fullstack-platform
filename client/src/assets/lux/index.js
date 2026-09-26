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
    alt: 'An open laptop and a phone on a wooden desk by a sunlit window',
    credit: 'Mikey Harris',
  },
  serviceAi: {
    src: serviceAi,
    alt: 'Warm sunlight and shadow falling across ribbed architectural panels',
    credit: 'Declan Sun',
  },
  serviceSaas: {
    src: serviceSaas,
    alt: 'A plain white shipping box with its lid open on a pale backdrop',
    credit: 'Kelli McClintock',
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
    alt: 'A quiet, sunlit room with a single chair and a plant',
    credit: 'Bree Anne',
  },
  about: {
    src: about,
    alt: 'The Faisal Mosque in Islamabad with the Margalla Hills behind it',
    credit: 'Mahreen Sarwar',
  },
};

// The studio reel on the home page: the same photographs, cropped for the
// gallery's alternating wide and tall frames.
// Only the two cuts still shown: Islamabad on /about, Internships on
// /internships. The other reel cuts duplicated photos used elsewhere.
export const reel = [
  { src: gIslamabad, w: 1800, h: 1200, caption: 'Islamabad', alt: 'The Faisal Mosque in Islamabad with the Margalla Hills behind it' },
  { src: gTeam, w: 1800, h: 1200, caption: 'Internships', alt: 'A small team taking notes around a wooden table' },
];

// Every photographer whose work is on the site; the reel above reuses the
// same photographs, so the list is complete.
export const photoCredits = Object.values(photos).map((p) => p.credit);
