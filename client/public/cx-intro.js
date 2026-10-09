(function () {
  var root = document.documentElement;
  if (!root.classList.contains('intro')) {
    if (root.classList.contains('intro-reduced')) setTimeout(function () { root.classList.remove('intro-reduced'); }, 400);
    return;
  }
  var $ = function (id) { return document.getElementById(id); };
  var mark = $('cxi-mark'), word = $('cxi-word'), stage = document.querySelector('.cxi-stage');
  var t0 = performance.now(), drawn = false, state = 'draw', timer = 0;
  if (document.fonts && document.fonts.load) document.fonts.load('600 24px Poppins').catch(function () {});

  // The navbar lockup is ready to be landed on once React has rendered
  // it, its logo image has loaded and Poppins has loaded. The navbar's
  // own entrance may still be nudging it, so aim for where it will come
  // to rest: its box minus whatever translate the entrance has left.
  function target() {
    var img = document.querySelector('.navbar .nav-logo-badge img');
    var wrap = document.querySelector('.navbar .nav-logo-wrap');
    var logo = document.querySelector('.navbar .nav-logo');
    if (!img || !wrap || !logo || !img.complete || !img.naturalWidth) return null;
    if (document.fonts && !document.fonts.check('600 24px Poppins')) return null;
    var tf = getComputedStyle(logo).transform, dx = 0, dy = 0;
    if (tf && tf !== 'none' && window.DOMMatrixReadOnly) { var mx = new DOMMatrixReadOnly(tf); dx = mx.m41; dy = mx.m42; }
    var r = img.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    if (!r.width || !w.width) return null;
    r = { left: r.left - dx, top: r.top - dy, width: r.width, height: r.height };
    w = { left: w.left - dx, top: w.top - dy, width: w.width };
    // The mark is drawn object-fit: contain inside its box.
    var ratio = 222 / 212, iw = r.width, ih = r.height, mw, mh;
    if (iw / ih > ratio) { mh = ih; mw = ih * ratio; } else { mw = iw; mh = iw / ratio; }
    return { mark: { x: r.left + (iw - mw) / 2, y: r.top + (ih - mh) / 2, w: mw }, word: { x: w.left, y: w.top, w: w.width } };
  }
  function aim(el, to) {
    var from = el.getBoundingClientRect();
    el.style.setProperty('--fx', (to.x - from.left).toFixed(2) + 'px');
    el.style.setProperty('--fy', (to.y - from.top).toFixed(2) + 'px');
    el.style.setProperty('--fs', (to.w / from.width).toFixed(4));
  }
  function poll() {
    timer = 0;
    if (state !== 'draw') return;
    var t = drawn && target();
    if (t) {
      aim(mark, t.mark); aim(word, t.word);
      state = 'go';
      root.classList.add('intro-go');
      return;
    }
    if (performance.now() - t0 > 10000) return bail();
    timer = setTimeout(poll, 50);
  }
  // Hold on the finished lockup for a beat before it flies.
  var HOLD = 650;
  $('cxi-cover-2').addEventListener('animationend', function () { setTimeout(function () { drawn = true; if (!timer) poll(); }, HOLD); });
  word.addEventListener('animationend', function (e) {
    if (e.target !== word || state !== 'go') return;
    state = 'docked';
    root.classList.add('intro-docked');
  });
  stage.addEventListener('animationend', function (e) { if (e.target === stage) finish(); });
  timer = setTimeout(poll, 50);
  var safety = setTimeout(bail, 11000);

  function bail() {
    if (state === 'done' || state === 'bail') return;
    state = 'bail';
    root.classList.add('intro-bail');
    setTimeout(finish, 240);
  }
  function finish() {
    if (state === 'done') return;
    state = 'done';
    clearTimeout(timer);
    clearTimeout(safety);
    root.classList.remove('intro', 'intro-go', 'intro-docked', 'intro-bail');
    ['keydown', 'click', 'wheel', 'touchstart'].forEach(function (t) { document.removeEventListener(t, onInput, true); });
    window.dispatchEvent(new Event('cortexis:intro-end'));
  }
  // Skip: the button, any click or tap, Esc, Enter, Space, or trying to
  // scroll. The page underneath jumps to its finished state.
  function skip() {
    if (state === 'done') return;
    finish();
    if (document.getAnimations) document.getAnimations().forEach(function (a) {
      var el = a.effect && a.effect.target;
      if (!el || !el.closest || !el.closest('.lx-hero')) return;
      var end = a.effect.getComputedTiming().endTime;
      if (isFinite(end)) { try { a.finish(); } catch (e) {} }
    });
  }
  var KEYS = { Escape: 1, Enter: 1, ' ': 1, ArrowDown: 1, ArrowUp: 1, PageDown: 1, PageUp: 1, Home: 1, End: 1 };
  function onInput(e) {
    if (e.type === 'keydown') {
      if (!KEYS[e.key]) return;
      e.preventDefault();
    } else if (e.type === 'click') {
      e.preventDefault();
      e.stopPropagation();
    }
    skip();
  }
  ['keydown', 'click', 'wheel', 'touchstart'].forEach(function (t) { document.addEventListener(t, onInput, { capture: true, passive: t === 'wheel' || t === 'touchstart' }); });
})();
