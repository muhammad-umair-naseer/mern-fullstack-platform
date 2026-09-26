/**
 * The photograph behind the sign-in and sign-up form, from Unsplash (free to
 * use under the Unsplash License), cropped 2:3 and encoded to WebP. It is
 * shown on /login and /signup only.
 */
import desk from './desk.webp';

export const authPhoto = {
  src: desk,
  alt: 'Someone typing on a laptop at a wooden window desk, a coffee beside it',
  credit: 'Andrew Neel',
};

export const AUTHFORM_CREDITS = [authPhoto.credit];
