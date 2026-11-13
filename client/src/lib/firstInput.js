/**
 * Whether the visitor has scrolled, moved the pointer, pressed a key or touched
 * yet in this page's life. Imported by index.jsx so it listens from the start,
 * whatever page the visit begins on (HeroReel lives in a lazy chunk and would
 * miss input on other pages). In-app navigation always follows a click.
 */
export const INPUT = ['scroll', 'pointermove', 'keydown', 'touchstart', 'wheel'];
let interacted = false;
export const hasInteracted = () => interacted;

if (typeof window !== 'undefined') {
  const mark = () => {
    interacted = true;
    INPUT.forEach((type) => window.removeEventListener(type, mark, true));
  };
  INPUT.forEach((type) => window.addEventListener(type, mark, { capture: true, passive: true }));
}
