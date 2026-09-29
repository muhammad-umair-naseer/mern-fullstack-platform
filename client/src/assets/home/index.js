/**
 * Home-page photography that appears nowhere else on the site: the studio
 * reel, the Process and Academy plates, and the three "Things we've built"
 * cards. All from Unsplash (free under
 * the Unsplash License), cropped to the frame each one fills and encoded to
 * WebP. Each keeps its credit, collected in `homeCredits` for the footer.
 *
 * Reel files are cut wider than a 3:2 or 4:5 frame because the gallery drifts
 * every picture sideways inside its frame, so the extra width is what moves.
 */
import islamabad from './reel-islamabad.webp';
import sketch from './reel-sketch.webp';
import focus from './reel-focus.webp';
import learning from './reel-learning.webp';
import team from './reel-team.webp';
import build from './reel-build.webp';
import tea from './reel-tea.webp';
import workBot from './work-bot.webp';
import processScope from './process-scope.webp';
import academyStudy from './academy-study.webp';
import workTools from './work-tools.webp';
import workOffline from './work-offline.webp';

export const reel = [
  { src: islamabad, w: 1600, h: 920, caption: 'Pakistan', alt: 'The Faisal Mosque and the Margalla Hills in Pakistan seen through a car window in soft evening haze', credit: 'Tahamie Farooqui' },
  { src: sketch, w: 1000, h: 1075, caption: 'Sketching', alt: 'An open sketchbook with fine pens and a ruler on a cutting mat', credit: 'Charles Etoroma' },
  { src: focus, w: 1600, h: 920, caption: 'Focus', alt: 'One person working at a long table beside tall, sunlit windows', credit: 'Austin' },
  { src: learning, w: 1000, h: 1075, caption: 'Learning', alt: 'Open books on a window sill, with trees and late sun outside', credit: 'Ioann-Mark Kuznietsov' },
  { src: team, w: 1600, h: 920, caption: 'Internships', alt: 'A small team working on laptops around a long wooden table', credit: 'Annie Spratt' },
  { src: build, w: 1000, h: 1075, caption: 'Building', alt: 'Hands typing on a laptop keyboard in warm light', credit: 'Mohit Sharma' },
  { src: tea, w: 1600, h: 920, caption: 'Conversations', alt: 'Two people talking over glasses of tea', credit: 'Matthew Henry' },
];

// The tools card is a close crop of stacked pages rather than a second
// laptop-and-coffee flat lay: it sits directly above the offline card, which
// already is one, and the two read as the same photograph twice.
export const workPhotos = {
  bot: { src: workBot, alt: 'YourBot studio interface on a laptop with 1-click WhatsApp and Instagram connection, prompt builder, and live chat simulation', credit: 'Cortexis Studio' },
  tools: { src: workTools, alt: 'Developer file utilities, code tools and data formatters on a clean monitor screen', credit: 'Ilya Pavlov' },
  offline: { src: workOffline, alt: 'A private offline workspace with laptop searching local documents and notes in warm daylight', credit: 'Clement Helardot' },
};

// Process and Academy used to borrow photos.process and photos.learning from
// assets/lux, which the hero reel also shows on this same page, so each has a
// photograph of its own. Both frames drift, so both files are cut taller than
// the frame they fill.
export const processPhoto = {
  src: processScope,
  w: 1400,
  h: 1200,
  alt: 'A hand sketching page wireframes at a wooden table beside a mug',
  credit: 'Unseen Studio',
};

export const academyPhoto = {
  src: academyStudy,
  w: 1100,
  h: 1540,
  alt: 'A quiet reading room with wooden desks and green lamps beneath tall arched windows',
  credit: 'Arthur Tseng',
};

export const homeCredits = [
  ...reel.map((p) => p.credit),
  ...Object.values(workPhotos).map((p) => p.credit),
  processPhoto.credit,
  academyPhoto.credit,
];
