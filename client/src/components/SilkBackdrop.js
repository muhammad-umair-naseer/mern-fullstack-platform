import React, { useEffect, useRef } from 'react';
import './SilkBackdrop.css';

/**
 * The house background: draped ivory and champagne silk in window light, with
 * a faint copper sheen in the folds, drifting as if a breeze moves a sheer
 * curtain. One fixed canvas behind every page.
 *
 * Rendered by a fragment shader at half the CSS resolution and upscaled; the
 * silk has no fine detail, so nothing is lost. Idle, it draws about thirty
 * frames a second, every frame while the page scrolls, and nothing at all
 * while the tab is hidden.
 *
 * Phones, coarse pointers and reduced motion never run a render loop. The
 * shader paints two moments of the silk once, and the compositor drifts and
 * cross-fades those two layers, so the folds still appear to move for the
 * cost of two opacity/transform layers. Under reduced motion only the first
 * frame is painted and nothing moves. Without WebGL the still image in the
 * stylesheet stands in.
 *
 * Glass surfaces are CSS (see .lx-glass): the silk is soft enough that a
 * warm translucent tint reads as frost without a real backdrop blur, which
 * keeps pages with a hundred cards cheap.
 */

const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';

const FS = `
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
const T0 = 31.0;

export default function SilkBackdrop() {
  const wrap = useRef(null);
  const canvasA = useRef(null);
  const canvasB = useRef(null);

  useEffect(() => {
    const root = wrap.current;
    const cA = canvasA.current;
    const cB = canvasB.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    const lite = reduce || narrow;
    root.classList.add(lite ? 'is-lite' : 'is-full');
    if (reduce) root.classList.add('is-still');

    const gl = cA.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return undefined;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };

    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
    } catch (e) {
      return undefined;
    }

    let raf = 0;
    let disposed = false;
    const cleanups = [];
    const par = gl.getExtension('KHR_parallel_shader_compile');

    // Linking can finish off the main thread where the driver supports it.
    const whenLinked = (cb) => {
      const poll = () => {
        if (disposed) return;
        if (!par || gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) cb();
        else setTimeout(poll, 30);
      };
      poll();
    };

    whenLinked(() => {
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aLoc = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(aLoc);
      gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
      const U = {};
      ['uRes', 'uScale', 'uTime', 'uIntro', 'uLight', 'uScroll', 'uUnit'].forEach((n) => {
        U[n] = gl.getUniformLocation(prog, n);
      });

      let vw = 0;
      let vh = 0;
      const resize = () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let scale = lite ? 0.5 * dpr : 0.5;
        const maxPx = lite ? 900000 : 1100000;
        if (vw * vh * scale * scale > maxPx) scale = Math.sqrt(maxPx / (vw * vh));
        const w = Math.max(2, Math.round(vw * scale));
        const h = Math.max(2, Math.round(vh * scale));
        [cA, cB].forEach((c) => {
          if (c && (c.width !== w || c.height !== h)) {
            c.width = w;
            c.height = h;
          }
        });
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.uRes, w, h);
        gl.uniform1f(U.uScale, w / vw);
        gl.uniform1f(U.uUnit, Math.max(220, Math.min(400, vw * 0.21)));
      };

      const light = { x: 0, y: 0, tx: 0, ty: 0 };
      const draw = (time, intro) => {
        gl.uniform1f(U.uTime, time);
        gl.uniform1f(U.uIntro, intro);
        gl.uniform2f(U.uLight, light.x, light.y);
        gl.uniform1f(U.uScroll, lite ? 0 : window.scrollY);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      resize();

      if (lite) {
        // Two moments painted once; the stylesheet drifts and cross-fades them.
        const paint = () => {
          draw(T0 + 8.0, 1);
          if (!reduce && cB) {
            const ctx = cB.getContext('2d');
            ctx.drawImage(cA, 0, 0);
            draw(T0, 1);
            cB.classList.add('is-on');
          }
          cA.classList.add('is-on');
        };
        paint();
        let lastW = vw;
        let lastH = vh;
        let to;
        // The collapsing URL bar changes the height on scroll; ignore that.
        const onResize = () => {
          clearTimeout(to);
          to = setTimeout(() => {
            if (Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - lastH) < 140) return;
            lastW = window.innerWidth;
            lastH = window.innerHeight;
            resize();
            paint();
          }, 180);
        };
        window.addEventListener('resize', onResize);
        cleanups.push(() => window.removeEventListener('resize', onResize));
        return;
      }

      cA.classList.add('is-on');
      const onPointer = (e) => {
        light.tx = (e.clientX / vw) * 2 - 1;
        light.ty = (e.clientY / vh) * 2 - 1;
      };
      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onPointer, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointer);
      });

      const ease = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
      let prev = performance.now();
      let simT = T0 - 3.0;
      let lastDraw = 0;
      let lastScroll = -1;
      const start = performance.now();

      const tick = (now) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(now - prev, 200);
        prev = now;
        simT += dt / 1000;
        light.x += (light.tx - light.x) * 0.04;
        light.y += (light.ty - light.y) * 0.04;
        const sy = window.scrollY;
        const scrolling = sy !== lastScroll;
        const entering = now - start < 2800;
        // About 30fps when idle; every frame while scrolling or unfurling.
        if (!scrolling && !entering && now - lastDraw < 31) return;
        lastDraw = now;
        lastScroll = sy;
        draw(simT, 0.15 + 0.85 * ease((now - start - 150) / 2600));
      };
      const play = () => {
        if (!raf) {
          prev = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };
      const onVisibility = () => (document.hidden ? stop() : play());
      const onLost = (e) => {
        e.preventDefault();
        stop();
        cA.classList.remove('is-on');
      };
      document.addEventListener('visibilitychange', onVisibility);
      cA.addEventListener('webglcontextlost', onLost);
      cleanups.push(() => {
        document.removeEventListener('visibilitychange', onVisibility);
        cA.removeEventListener('webglcontextlost', onLost);
      });
      play();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="lx-silk" ref={wrap} aria-hidden="true">
      <canvas className="lx-silk-canvas lx-silk-a" ref={canvasA} />
      <canvas className="lx-silk-canvas lx-silk-b" ref={canvasB} />
    </div>
  );
}
