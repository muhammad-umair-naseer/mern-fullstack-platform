import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Flag, MousePointer2 } from 'lucide-react';
import { gamesPhotos } from '../../assets/games';
import './GamesVisual.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Gotcha Rush: '5' - 2 coerces to 3, then 3 + '1' concatenates, so it prints 31.
const OPTIONS = ['4', '31', 'NaN', '51'];
const ANSWER = '31';

// TypeDash: the typing loop in GamesVisual.css steps through exactly 28
// characters, so keep this string 28 long if it ever changes.
const PASSAGE = 'const winner = await race();';

/**
 * The Games hero: one round of each game, playing on a loop over a keyboard
 * photograph of its own (assets/games). A Gotcha Rush question counts down
 * and gets answered; a TypeDash passage types itself while you race a ghost
 * replay.
 *
 * The loops are CSS keyframes (transform and opacity only). GSAP adds depth:
 * the photo and the two cards drift at different rates on scroll and lean
 * toward the pointer. Reduced motion shows the finished round, still.
 */
export default function GamesVisual() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const root = scope.current;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scroll = { trigger: root, start: 'top 30%', end: 'bottom top', scrub: 0.4 };
        gsap.to('.gv-drift', { yPercent: 7, ease: 'none', scrollTrigger: scroll });
        gsap.to('.gv-depth-a', { y: -36, ease: 'none', scrollTrigger: { ...scroll } });
        gsap.to('.gv-depth-b', { y: -72, ease: 'none', scrollTrigger: { ...scroll } });
      });

      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
        const area = root.closest('section') || root;
        const ax = gsap.quickTo('.gv-tilt-a', 'x', { duration: 0.9, ease: 'power3' });
        const ay = gsap.quickTo('.gv-tilt-a', 'y', { duration: 0.9, ease: 'power3' });
        const bx = gsap.quickTo('.gv-tilt-b', 'x', { duration: 1.1, ease: 'power3' });
        const by = gsap.quickTo('.gv-tilt-b', 'y', { duration: 1.1, ease: 'power3' });

        const onMove = (e) => {
          const r = area.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ax(px * -14);
          ay(py * -10);
          bx(px * 22);
          by(py * 16);
        };
        const onLeave = () => {
          ax(0);
          ay(0);
          bx(0);
          by(0);
        };

        area.addEventListener('pointermove', onMove);
        area.addEventListener('pointerleave', onLeave);
        return () => {
          area.removeEventListener('pointermove', onMove);
          area.removeEventListener('pointerleave', onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div
      className="gv"
      ref={scope}
      role="img"
      aria-label="A Gotcha Rush question asking what a JavaScript snippet prints, and a TypeDash race against a ghost replay"
    >
      <div className="gv-stage">
        <div className="gv-photo lx-pv-frame">
          <div className="gv-drift lx-pv-drift">
            <img src={gamesPhotos.hero.src} alt="" decoding="async" />
          </div>
          <span className="lx-pv-sheen" />
        </div>

        <span className="gv-live-pos">
          <span className="gv-live lx-glass">
            <span className="gv-live-dot" />
            multiplayer
          </span>
        </span>

        {/* Gotcha Rush: predict the output before the timer runs out. */}
        <div className="gv-depth gv-depth-a">
          <div className="gv-tilt gv-tilt-a">
            <div className="gv-card gv-quiz lx-glass">
              <div className="gv-head">
                <span className="gv-name">Gotcha Rush</span>
                <span className="gv-tag">what prints?</span>
              </div>
              <div className="gv-timer">
                <span />
              </div>
              <div className="gv-code">
                <div className="gv-code-line" style={{ '--l': 0 }}>
                  <span className="gv-ln">1</span>
                  <span>
                    <span className="gv-k">let</span> x = <span className="gv-s">'5'</span> - <span className="gv-n">2</span>;
                  </span>
                </div>
                <div className="gv-code-line" style={{ '--l': 1 }}>
                  <span className="gv-ln">2</span>
                  <span>
                    console.<span className="gv-k">log</span>(x + <span className="gv-s">'1'</span>);
                  </span>
                </div>
              </div>
              <ul className="gv-options">
                {OPTIONS.map((o) => (
                  <li key={o} className={`gv-opt${o === ANSWER ? ' is-answer' : ''}`}>
                    <span>{o}</span>
                    {o === ANSWER && (
                      <>
                        <Check className="gv-opt-tick" size={14} strokeWidth={2.5} />
                        <MousePointer2 className="gv-cursor" size={18} strokeWidth={1.75} />
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* TypeDash: the passage types itself while you race a ghost. */}
        <div className="gv-depth gv-depth-b">
          <div className="gv-tilt gv-tilt-b">
            <div className="gv-card gv-race lx-glass">
              <div className="gv-head">
                <span className="gv-name">TypeDash</span>
                <span className="gv-tag">vs ghost replay</span>
              </div>
              <div className="gv-passage">
                <span className="gv-passage-base">{PASSAGE}</span>
                <span className="gv-typed-win">
                  <span className="gv-typed">{PASSAGE}</span>
                </span>
                <span className="gv-caret">
                  <i />
                </span>
              </div>
              <div className="gv-lanes">
                <div className="gv-lane">
                  <span className="gv-lane-name">you</span>
                  <span className="gv-track">
                    <span className="gv-fill gv-fill-you" />
                    <span className="gv-runner gv-runner-you">
                      <i />
                    </span>
                  </span>
                </div>
                <div className="gv-lane is-ghost">
                  <span className="gv-lane-name">ghost</span>
                  <span className="gv-track">
                    <span className="gv-fill gv-fill-ghost" />
                    <span className="gv-runner gv-runner-ghost">
                      <i />
                    </span>
                  </span>
                </div>
                <Flag className="gv-flag" size={13} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
