import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * On phones some home sections use content-visibility: auto (index.css): the
 * browser skips laying them out until they near the screen, so their height
 * is a placeholder until then. ScrollTrigger measures trigger positions once,
 * so each time a section first renders it re-measures (batched to one frame).
 * The event does not bubble; a capture listener on the document still sees it.
 */
export default function startScrollRefresh() {
  let queued = false;
  document.addEventListener('contentvisibilityautostatechange', (e) => {
    if (e.skipped || queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; ScrollTrigger.refresh(); });
  }, true);
}
