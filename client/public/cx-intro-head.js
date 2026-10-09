/* The logo intro. It plays once per browser session, only when the visit
   starts on the home page, and never for automated browsers (the
   prerender among them), so no snapshot ever carries it. Decided here,
   before the first paint, so the page never flashes the wrong state. */
(function () {
  var root = document.documentElement;
  // The home path comes from data-home, which the build fills with PUBLIC_URL.
  var home = document.currentScript.getAttribute('data-home');
  if (location.pathname !== home || navigator.webdriver) return;
  try {
    if (sessionStorage.getItem('cx-intro') === '1') return;
    sessionStorage.setItem('cx-intro', '1');
  } catch (e) { return; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add(reduce ? 'intro-reduced' : 'intro');
})();
