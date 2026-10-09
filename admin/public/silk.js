/* The house background, ported from the website's SilkBackdrop: draped
   ivory silk in window light, drawn by a fragment shader at half resolution
   into #silk. Desktop draws about 30fps while active and stops a few seconds
   after the last scroll, pointer move or resize. Phones, coarse pointers and
   reduced motion paint two still moments once and let CSS drift them; reduced
   motion paints one and nothing moves. Without WebGL the CSS gradient stays. */
(function () {
  var root = document.getElementById('silk');
  if (!root) return;
  var cA = document.createElement('canvas');
  var cB = document.createElement('canvas');
  cA.className = 'lx-silk-canvas lx-silk-a';
  cB.className = 'lx-silk-canvas lx-silk-b';
  root.appendChild(cA);
  root.appendChild(cB);

  var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';
  var FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uScale;
uniform float uTime;
uniform float uIntro;
uniform vec2 uLight;
uniform float uScroll;
uniform float uUnit;

vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float gn(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(dot(hash2(i), f), dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}
// Gradient noise with its analytic derivative: vec3(value, d/dx, d/dy).
vec3 gnd(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  vec2 ga = hash2(i), gb = hash2(i + vec2(1.0, 0.0)), gc = hash2(i + vec2(0.0, 1.0)), gd = hash2(i + vec2(1.0, 1.0));
  float va = dot(ga, f), vb = dot(gb, f - vec2(1.0, 0.0)), vc = dot(gc, f - vec2(0.0, 1.0)), vd = dot(gd, f - vec2(1.0, 1.0));
  return vec3(va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * (va - vb - vc + vd),
              ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd)
              + du * (u.yx * (va - vb - vc + vd) + vec2(vb, vc) - va));
}
// Slope of the draped silk: long folds with rounded crests, bent twice by slow
// noise. Returns dh/dp through both warps (chain rule), so one pass gives the
// surface normal.
vec2 silkSlope(vec2 p, float t){
  vec3 n1 = gnd(p * 0.42 + vec2(0.0, t * 0.058));
  vec3 n2 = gnd(p * 0.42 + vec2(4.7, 1.3) - vec2(t * 0.048, 0.0));
  vec2 q = p + 1.6 * vec2(n1.x, n2.x);
  vec2 j1x = vec2(1.0, 0.0) + 1.6 * 0.42 * n1.yz;
  vec2 j1y = vec2(0.0, 1.0) + 1.6 * 0.42 * n2.yz;
  vec3 n3 = gnd(q * 0.95 + vec2(1.7, t * 0.031));
  vec3 n4 = gnd(q * 0.95 + vec2(t * 0.027, 9.2));
  vec2 r = q + 0.42 * vec2(n3.x, n4.x);
  vec2 j2x = vec2(1.0, 0.0) + 0.42 * 0.95 * n3.yz;
  vec2 j2y = vec2(0.0, 1.0) + 0.42 * 0.95 * n4.yz;
  vec2 A = vec2(0.93, 0.36), B = vec2(-0.34, 0.94);
  float d1 = dot(r, A), d2 = dot(r, B);
  float a1 = d1 * 2.3 + t * 0.17;
  float s1 = sin(a1);
  float crest = exp(2.6 * (s1 - 1.0));
  float c1 = cos(a1) * 2.3 * (0.4 + 0.5 * 2.6 * crest);
  float c2 = cos(d1 * 4.2 - d2 * 0.9 + t * 0.09 + 1.3) * 0.18;
  float c3 = cos(d2 * 1.5 - t * 0.06 + 0.6) * 0.16 * 1.5;
  vec2 gr = c1 * A + c2 * (4.2 * A - 0.9 * B) + c3 * B;
  vec2 gq = gr.x * j2x + gr.y * j2y;
  return gq.x * j1x + gq.y * j1y;
}
void main(){
  vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  vec2 view = uRes / uScale;
  float t = uTime;
  vec2 p = (css + vec2(0.0, uScroll * 0.16)) / uUnit;
  vec2 g = silkSlope(p, t);
  float amp = 0.17 * uIntro;
  vec3 N = normalize(vec3(-g * amp, 1.0));
  vec3 L = normalize(vec3(-0.42 + uLight.x * 0.22, -0.6 + uLight.y * 0.18, 0.68));
  float s = dot(N, L) - L.z;
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), 48.0) * uIntro;
  float sheen = clamp((1.0 - N.z) * 9.0, 0.0, 1.0);

  vec3 cShadow = vec3(0.898, 0.838, 0.757);
  vec3 cMid    = vec3(0.974, 0.962, 0.940);
  vec3 cHi     = vec3(1.0, 0.997, 0.988);
  vec3 cCopper = vec3(0.952, 0.862, 0.778);

  float sh = clamp(0.52 + s * 3.0, 0.0, 1.0);
  vec3 col = mix(cShadow, cMid, smoothstep(0.0, 0.6, sh));
  col = mix(col, cHi, smoothstep(0.6, 1.0, sh));
  col = mix(col, cCopper, sheen * 0.5 * (1.0 - sh));
  col = mix(col, cHi, spec * 0.85);

  // Window light from the upper right, and a slow band of sun drifting through.
  vec2 uv = css / view;
  float win = 1.0 - smoothstep(0.0, 1.25, length((uv - vec2(0.88, -0.12)) * vec2(1.0, 1.25)));
  float band = 0.5 + 0.5 * sin(dot(uv, vec2(1.5, 0.85)) * 2.6 - t * 0.2 + gn(p * 0.5 + t * 0.02) * 2.2);
  col = mix(col, cHi, win * 0.38);
  col = mix(col, col * vec3(0.99, 0.975, 0.95), (1.0 - win) * 0.35);
  col = mix(col, cHi, band * 0.10 * uIntro);

  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
  // A composed moment of the loop: open folds on the left, calmer on the right.
  var T0 = 31.0;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  var lite = reduce || narrow;
  root.classList.add(lite ? 'is-lite' : 'is-full');
  if (reduce) root.classList.add('is-still');

  var gl = cA.getContext('webgl', {
    alpha: false, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: false, powerPreference: 'low-power'
  });
  if (!gl) return;

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  var prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
  } catch (e) {
    return;
  }

  // Linking can finish off the main thread where the driver supports it.
  var par = gl.getExtension('KHR_parallel_shader_compile');
  (function poll() {
    if (!par || gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) start();
    else setTimeout(poll, 30);
  })();

  function start() {
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aLoc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uScale', 'uTime', 'uIntro', 'uLight', 'uScroll', 'uUnit'].forEach(function (n) {
      U[n] = gl.getUniformLocation(prog, n);
    });

    var vw = 0, vh = 0;
    function resize() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var scale = lite ? 0.5 * dpr : 0.5;
      var maxPx = lite ? 900000 : 1100000;
      if (vw * vh * scale * scale > maxPx) scale = Math.sqrt(maxPx / (vw * vh));
      var w = Math.max(2, Math.round(vw * scale));
      var h = Math.max(2, Math.round(vh * scale));
      [cA, cB].forEach(function (c) {
        if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
      });
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.uRes, w, h);
      gl.uniform1f(U.uScale, w / vw);
      gl.uniform1f(U.uUnit, Math.max(220, Math.min(400, vw * 0.21)));
    }

    var light = { x: 0, y: 0, tx: 0, ty: 0 };
    function draw(time, intro) {
      gl.uniform1f(U.uTime, time);
      gl.uniform1f(U.uIntro, intro);
      gl.uniform2f(U.uLight, light.x, light.y);
      gl.uniform1f(U.uScroll, lite ? 0 : window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    resize();

    if (lite) {
      // Two moments painted once; the stylesheet drifts and cross-fades them.
      var paint = function () {
        draw(T0 + 8.0, 1);
        if (!reduce) {
          cB.getContext('2d').drawImage(cA, 0, 0);
          draw(T0, 1);
          cB.classList.add('is-on');
        }
        cA.classList.add('is-on');
      };
      paint();
      var lastW = vw, lastH = vh, to;
      // The collapsing URL bar changes the height on scroll; ignore that.
      window.addEventListener('resize', function () {
        clearTimeout(to);
        to = setTimeout(function () {
          if (Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - lastH) < 140) return;
          lastW = window.innerWidth;
          lastH = window.innerHeight;
          resize();
          paint();
        }, 180);
      });
      return;
    }

    cA.classList.add('is-on');

    // The silk only moves while the reader does. A few seconds after the last
    // scroll, pointer move or resize it draws its last frame and the loop
    // stops, so a page being read costs the GPU nothing.
    var SETTLE_MS = 3000;
    var raf = 0;
    var lastActive = performance.now();
    var prev = performance.now();
    var simT = T0 - 3.0;
    var lastDraw = 0;
    var lastScroll = -1;
    var t0 = performance.now();
    function ease(x) { return 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3); }

    function tick(now) {
      raf = requestAnimationFrame(tick);
      var dt = Math.min(now - prev, 200);
      prev = now;
      simT += dt / 1000;
      light.x += (light.tx - light.x) * 0.04;
      light.y += (light.ty - light.y) * 0.04;
      var sy = window.scrollY;
      var scrolling = sy !== lastScroll;
      var entering = now - t0 < 2800;
      var drifting = Math.abs(light.tx - light.x) + Math.abs(light.ty - light.y) > 0.004;
      if (scrolling) lastActive = now;
      if (!scrolling && !entering && !drifting && now - lastActive > SETTLE_MS) {
        stop(); // settled: the last frame drawn stays on screen
        return;
      }
      // About 30fps while settling; every frame while scrolling or unfurling.
      if (!scrolling && !entering && now - lastDraw < 31) return;
      lastDraw = now;
      lastScroll = sy;
      draw(simT, 0.15 + 0.85 * ease((now - t0 - 150) / 2600));
    }
    function play() {
      if (!raf) { prev = performance.now(); raf = requestAnimationFrame(tick); }
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    function wake() {
      lastActive = performance.now();
      if (!document.hidden) play();
    }

    window.addEventListener('resize', function () { resize(); wake(); });
    window.addEventListener('pointermove', function (e) {
      light.tx = (e.clientX / vw) * 2 - 1;
      light.ty = (e.clientY / vh) * 2 - 1;
      wake();
    }, { passive: true });
    window.addEventListener('scroll', wake, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else wake();
    });
    cA.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      stop();
      cA.classList.remove('is-on');
    });
    play();
  }
})();
