/**
 * The photograph behind the sign-in and sign-up form, from Unsplash (free to
 * use under the Unsplash License), cropped 2:3 and encoded to WebP. It is
 * shown on /login and /signup only.
 */
import desk from './desk.webp';
import { addSrcSets } from '../../lib/srcSet.js';

export const authPhoto = {
  src: desk,
  alt: 'Someone typing on a laptop at a wooden window desk, a coffee beside it',
  credit: 'Andrew Neel',
};

export const AUTHFORM_CREDITS = [authPhoto.credit];

// 320/480/640/800/1200 px versions for srcset (lib/srcSet.js).
addSrcSets(
  import.meta.glob('./*.webp', { eager: true, import: 'default' }),
  import.meta.glob('./*.webp', { eager: true, import: 'default', query: '?w=320;480;640;800;1200&as=srcset' }),
  [authPhoto],
);

