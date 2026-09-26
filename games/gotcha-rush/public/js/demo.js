import { avatarFor } from './avatars.js';
import { highlightLines } from './highlight.js';
import { ICON } from './icons.js';

/**
 * A looping mini-round: the snippet types itself, the room locks in, an answer
 * is typed and locked, the output checks out, and the points and combo pop.
 * Every output below is what the real runtime prints. How it works runs it and
 * narrates each step (the home page has its own live room, room.js); a demo only
 * animates while it is on screen, and `onPhase(name, ms)` reports each step so a
 * page can narrate along with it.
 */
const DEMO = [
  { lang: 'js', code: 'const x = "5" - 2;\nconsole.log(x + "1");', out: '31', pts: 296 },
  { lang: 'py', code: 'print(round(2.5), round(3.5))', out: '2 4', pts: 318 },
  { lang: 'js', code: 'const a = [10, 1, 2];\nconsole.log(a.sort());', out: '[ 1, 10, 2 ]', pts: 342 },
  { lang: 'py', code: 'x = [1, 2]\ny = x\ny += [3]\nprint(x)', out: '[1, 2, 3]', pts: 365 },
  { lang: 'js', code: 'console.log("b" + "a" + +"a" + "a");', out: 'baNaNa', pts: 388 },
];

export function createDemo(host, { avatar = 'bolt', onPhase = () => {} } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seat = (cls, id) => { const a = avatarFor(id); return `<div class="demo-seat ${cls}" style="--c:${a.color}"><span>${a.emoji}</span><i class="demo-check">${ICON.check}</i></div>`; };
  host.innerHTML = `<div class="demo">
    <div class="demo-win">
      <div class="demo-bar"><span class="demo-dots"><i></i><i></i><i></i></span><span class="demo-file">main.js</span><span class="demo-lang">JavaScript</span><span class="demo-clock"><svg viewBox="0 0 36 36"><circle class="t" cx="18" cy="18" r="15.5"/><circle class="a" cx="18" cy="18" r="15.5"/></svg><b>40</b></span></div>
      <pre class="demo-code"></pre>
      <div class="demo-term"><span class="demo-prompt">1</span><span class="demo-typed"></span><i class="demo-caret"></i><span class="demo-stamp">${ICON.lock.replace('<svg', '<svg class="lk"')}${ICON.check.replace('<svg', '<svg class="ok"')}<span class="lk">Locked</span><span class="ok">Correct</span></span></div>
    </div>
    ${seat('s1', 'fox')}${seat('s2', 'octopus')}${seat('s3', 'robot')}${seat('s4', 'ghost')}${seat('me', avatar)}
    <div class="demo-pop">+0</div>
    <div class="demo-combo">${ICON.flame}Combo <b>×2</b></div>
  </div>`;
  const root = host.querySelector('.demo');
  const q = (s) => root.querySelector(s);
  const parts = { file: q('.demo-file'), lang: q('.demo-lang'), code: q('.demo-code'), typed: q('.demo-typed'), clock: q('.demo-clock b'), pop: q('.demo-pop'), combo: q('.demo-combo b'), seats: [...root.querySelectorAll('.demo-seat')] };
  let idx = 0;
  let timers = [];
  let visible = false;
  let running = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const phase = (p, ms) => { root.className = `demo ${p}${reduced ? ' still' : ''}`; onPhase(p, ms); };

  function fill(d, n) {
    parts.file.textContent = d.lang === 'js' ? 'main.js' : 'main.py';
    parts.lang.textContent = d.lang === 'js' ? 'JavaScript' : 'Python';
    parts.lang.className = `demo-lang ${d.lang}`;
    const raw = d.code.split('\n');
    let delay = 0;
    parts.code.innerHTML = highlightLines(d.code, d.lang).map((html, i) => {
      const chars = Math.max(1, raw[i].length);
      const t = chars * 0.032;
      const line = `<div class="ln"><i>${i + 1}</i><span style="--n:${chars};--t:${t.toFixed(2)}s;--d:${delay.toFixed(2)}s">${html}</span></div>`;
      delay += t + 0.1;
      return line;
    }).join('');
    parts.pop.textContent = `+${d.pts}`;
    parts.combo.textContent = `×${(n % 4) + 2}`;
    return delay;
  }

  function stop() {
    timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
    timers = [];
  }

  function round() {
    stop();
    if (!visible) { running = false; return; }
    running = true;
    const d = DEMO[idx % DEMO.length];
    const typedMs = fill(d, idx) * 1000;
    idx++;
    parts.seats.forEach((s) => s.classList.remove('done'));
    if (reduced) {
      parts.typed.textContent = d.out;
      parts.clock.textContent = '27';
      parts.seats.forEach((s) => s.classList.add('done'));
      phase('p-reveal', 6000);
      later(round, 6000);
      return;
    }
    parts.typed.textContent = '';
    root.className = 'demo p-out';
    void root.offsetWidth;
    const answerAt = typedMs + 350;
    const lockAt = answerAt + d.out.length * 105 + 450;
    phase('p-code', answerAt);
    let secs = 40;
    parts.clock.textContent = secs;
    const tick = setInterval(() => { if (secs > 24) parts.clock.textContent = --secs; }, 420);
    timers.push(tick);
    later(() => parts.seats[1].classList.add('done'), typedMs + 500);
    later(() => {
      phase('p-answer', lockAt - answerAt);
      let i = 0;
      const type = setInterval(() => {
        i++;
        parts.typed.textContent = d.out.slice(0, i);
        if (i >= d.out.length) clearInterval(type);
      }, 105);
      timers.push(type);
    }, answerAt);
    later(() => { clearInterval(tick); phase('p-locked', 1000); parts.seats[4].classList.add('done'); }, lockAt);
    later(() => parts.seats[0].classList.add('done'), lockAt + 300);
    later(() => parts.seats[2].classList.add('done'), lockAt + 650);
    later(() => { phase('p-reveal', 2600); parts.seats[3].classList.add('done'); }, lockAt + 1000);
    later(() => phase('p-out', 500), lockAt + 3600);
    later(round, lockAt + 4100);
  }

  // only animate while the stage is on screen (a hidden page counts as off screen)
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !running) round();
  }).observe(host);

  return {
    setMe(id) {
      const a = avatarFor(id);
      const me = parts.seats[4];
      me.style.setProperty('--c', a.color);
      me.querySelector('span').textContent = a.emoji;
    },
    /** Start again from the first snippet, e.g. when its page opens. */
    restart() {
      stop();
      running = false;
      idx = 0;
      if (visible) round();
    },
  };
}
