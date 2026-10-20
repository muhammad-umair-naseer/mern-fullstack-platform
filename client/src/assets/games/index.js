/**
 * Photography for the Games page only, from Unsplash (free to use under the
 * Unsplash License). Cropped to the frame each is shown in, given the site's
 * mild warm grade, and encoded to WebP. None of these appear on another page;
 * check assets/lux, assets/home, the service and course photos and the blog
 * covers before reusing one elsewhere.
 */
import keys from './playground-keys.webp';
import gotchaRush from './gotcha-rush.webp';
import typedash from './typedash.webp';
import pickparty from './pickparty.webp';
import sketchAndGuess from './sketch-and-guess.webp';

export const gamesPhotos = {
  // The hero, framed at 4 / 5 behind the game cards.
  hero: {
    src: keys,
    alt: 'A compact mechanical keyboard resting on a soft beige throw',
    credit: 'Alexey Demidov',
  },
  // The game cards, framed at 4 / 3.
  'gotcha-rush': {
    src: gotchaRush,
    alt: 'Two hands turning a glass hourglass in front of a pale wall',
    credit: 'Melody Zimmerman',
  },
  typedash: {
    src: typedash,
    alt: 'Numbered lanes at the start line of a running track',
    credit: 'Austris Augusts',
  },
  pickparty: {
    src: pickparty,
    alt: 'Hands drafting colorful illustrated cards from a warm wooden table at a party',
    credit: 'Cortexis Studio',
  },
  'sketch-and-guess': {
    src: sketchAndGuess,
    alt: 'Hands sketching colorful doodles and illustrations in a warm creative studio',
    credit: 'Cortexis Studio',
  },
};

// Every photographer above, for the footer's credit line.
export const GAMES_CREDITS = Object.values(gamesPhotos).map((p) => p.credit);

