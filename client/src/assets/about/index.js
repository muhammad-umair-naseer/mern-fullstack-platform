/**
 * Photography for the About page, and nowhere else on the site. All from
 * Unsplash (free under the Unsplash License), cropped to the frame each one
 * fills and encoded to WebP. The credits are collected in ABOUT_CREDITS for
 * the footer.
 *
 * These replace the old About artwork (a dark coworking hall used twice, a
 * cool flat lay and a cafe shot with a visible screen) and the three home-page
 * photographs the hero card used to borrow.
 */
import deckBuild from './deck-build.webp';
import deckLearn from './deck-learn.webp';
import deckIntern from './deck-intern.webp';
import mission from './mission.webp';
import vision from './vision.webp';
import promise from './promise.webp';
import story from './story.webp';

// The hero card: what the studio does, one picture each (4:3).
export const aboutWork = [
  { src: deckBuild, caption: 'Building', alt: 'Hands typing on a laptop by a bright window', credit: 'Burst' },
  { src: deckLearn, caption: 'Learning', alt: 'A man reading a book beside his laptop at a pale table', credit: 'Gustavo Tambani' },
  { src: deckIntern, caption: 'Internships', alt: 'Three young men laughing over a laptop in a library', credit: 'Priscilla Du Preez' },
];

// What drives us: three tall plates (7:10).
export const aboutDrivers = {
  mission: { src: mission, alt: 'A designer drafting plans by hand at a wooden desk', credit: 'Ryan Ancill' },
  vision: { src: vision, alt: 'A minimalist architectural studio space with clean lines and warm natural light', credit: 'Nastuh Abootalebi' },
  promise: { src: promise, alt: 'A sunlit software studio desk with thoughtful architectural focus and craftsmanship', credit: 'Austin Distel' },
};

// Our story (about 5:7).
export const aboutStory = {
  src: story,
  alt: 'A software engineering team collaborating closely around a studio work table in warm morning light',
  credit: 'Annie Spratt',
};

export const ABOUT_CREDITS = [
  ...new Set([
    ...aboutWork.map((p) => p.credit),
    ...Object.values(aboutDrivers).map((p) => p.credit),
    aboutStory.credit,
  ]),
];
