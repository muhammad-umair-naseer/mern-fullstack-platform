/**
 * The logomark at the sizes it is shown (44 px in the navbar, 26 px in the
 * footer) for 1x, 2x and 3x screens, as AVIF and WebP with a small PNG
 * fallback, instead of the 222 px, 64 KB PNG. public/cortexis-mark.png stays
 * for anything that links to it directly.
 */
import src from './cortexis-mark.png?w=44&format=png';
import srcSet from './cortexis-mark.png?w=44;88;132&format=webp&as=srcset';
import avifSrcSet from './cortexis-mark.png?w=44;88;132&format=avif&as=srcset';

export const markPhoto = { src, srcSet, avifSrcSet };
