import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PhotoVisual from '../PhotoVisual';
import { photos, reel } from '../../assets/lux';
import { aboutWork } from '../../assets/about';
import './AboutVisual.css';

gsap.registerPlugin(useGSAP);

// The city in the reel's wide cut. The three things the studio does there
// have photographs of their own (assets/about): the reel's Building, Learning
// and Internships shots are the home page's service and academy plates.
const CITY = reel.find((r) => r.caption === 'Islamabad') || { src: photos.about.src };
const WORK = aboutWork;

// Islamabad's published coordinates (33°41′35″N 73°03′50″E, rounded down to
// the minute), and the year the company was incorporated, which the SECP
// record further down this page shows.
const RING = 'Pakistan · software studio · since 2025 · ';

/**
 * The About hero: Islamabad in the house photo frame, a slowly turning seal
 * with the city's coordinates pinned to its corner, and a small glass card
 * that cycles through what the studio does there.
 *
 * Every loop is a CSS keyframe on transform or opacity, so the prerendered
 * page moves without script. GSAP only adds a few pixels of pointer depth on
 * fine pointers. Reduced motion keeps the first frame of each loop, still.
 */
export default function AboutVisual() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const layers = gsap.utils.toArray('[data-depth]', scope.current).map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div className="lx-av" ref={scope}>
      <div data-depth="-8">
        <PhotoVisual photo={{ src: CITY.src, alt: photos.about.alt }} ratio="5 / 4" />
      </div>

      <div className="lx-av-seal-pos" data-depth="18" aria-hidden="true">
        <div className="lx-av-seal">
          <svg className="lx-av-ring" viewBox="0 0 120 120" focusable="false">
            <defs>
              <path id="lx-av-ring-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
            </defs>
            <text>
              <textPath href="#lx-av-ring-path" textLength="281" lengthAdjust="spacing">
                {RING}
              </textPath>
            </text>
          </svg>
          <span className="lx-av-pin" />
        </div>
      </div>

      <div className="lx-av-deck-pos" data-depth="12" aria-hidden="true">
        <div className="lx-av-deck lx-glass">
          <div className="lx-av-media">
            {WORK.map((w, i) => (
              <img key={w.caption} className="lx-av-slide" style={{ '--s': i }} src={w.src} alt="" decoding="async" />
            ))}
          </div>
          <div className="lx-av-cap">
            <span className="lx-av-stack lx-av-word">
              {WORK.map((w, i) => (
                <span key={w.caption} style={{ '--s': i }}>{w.caption}</span>
              ))}
            </span>
            <span className="lx-av-stack lx-av-count">
              {WORK.map((w, i) => (
                <span key={w.caption} style={{ '--s': i }}>{`0${i + 1}`}</span>
              ))}
            </span>
            <span className="lx-av-of">/ 0{WORK.length}</span>
          </div>
          <span className="lx-av-progress" />
        </div>
      </div>
    </div>
  );
}
