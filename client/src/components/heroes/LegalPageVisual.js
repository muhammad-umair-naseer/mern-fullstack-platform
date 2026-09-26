import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, ShieldCheck } from 'lucide-react';
import { legalPhoto } from '../../assets/legalpage';
import { legalPhotos } from '../../assets/unique';
import './LegalPageVisual.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The walking highlighter's keyframes are written for exactly this many rows.
const ROWS = 5;

/**
 * The legal pages' hero visual: the document itself, on a frosted sheet laid
 * over a photograph of an open journal (its own photo, used nowhere else). Its real contents are listed and a
 * highlighter reads down them one row at a time, while a copper seal carrying
 * the revision date presses onto the corner and slowly turns.
 *
 * Every loop is a CSS keyframe on transform or opacity, so the prerendered
 * page moves without script. GSAP adds scroll drift to the photograph and a
 * little pointer depth on fine pointers. Reduced motion holds the first
 * frame of each loop.
 *
 *   kind         'terms' | 'privacy' (picks the seal's mark)
 *   owner        who the document belongs to, shown in the sheet's header
 *   title        [{ text, grad }] the page title, as LegalPage receives it
 *   sections     [{ id, title }]
 *   lastUpdated  revision date string
 */
export default function LegalPageVisual({ kind, owner = 'Cortexis Solution Hub', title, sections, lastUpdated }) {
  const scope = useRef(null);
  const shown = sections.slice(0, ROWS);
  const more = sections.length - shown.length;
  const walks = shown.length === ROWS;
  const Mark = kind === 'privacy' ? ShieldCheck : FileText;
  const isBot = owner === 'Cortexis Your Bot';
  const isDeletion = Array.isArray(title) && /^Data/.test(title[0]?.text || '');
  const photo = isBot
    ? (isDeletion ? legalPhotos.botDeletion : kind === 'privacy' ? legalPhotos.botPrivacy : legalPhotos.botTerms)
    : kind === 'privacy' ? legalPhotos.privacy : legalPhoto;
  const ring = `Last updated · ${lastUpdated} · Cortexis · `;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(scope.current.querySelector('.lx-lv-photo-drift'), {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top 30%', end: 'bottom top', scrub: 0.4 },
        });
      });
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
    <div className="lx-lv" ref={scope} aria-hidden="true">
      <div className="lx-lv-photo-wrap" data-depth="10">
        <div className="lx-lv-photo">
          <div className="lx-lv-photo-drift">
            <img src={photo.src} alt="" decoding="async" />
          </div>
          <span className="lx-pv-sheen" />
        </div>
      </div>

      <div className="lx-lv-sheet-wrap" data-depth="-14">
        <div className="lx-glass lx-lv-sheet">
          <div className="lx-lv-head">
            <span>{owner}</span>
            <span className="tabular">{sections.length} sections</span>
          </div>
          <span className="lx-lv-rule" />
          <p className="lx-lv-title">
            {title.map((w, i) => (w.grad ? <em key={i}>{w.text}</em> : <React.Fragment key={i}>{w.text}</React.Fragment>))}
          </p>

          <div className="lx-lv-list">
            <span className={`lx-lv-marker${walks ? ' lx-lv-marker--walk' : ''}`} />
            <ol>
              {shown.map((s, i) => (
                <li className="lx-lv-row" key={s.id} style={{ '--i': i }}>
                  <span className="lx-lv-num tabular">{String(i + 1).padStart(2, '0')}</span>
                  <span className="lx-lv-name">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>

          {more > 0 && <p className="lx-lv-more tabular">+ {more} more</p>}
        </div>
      </div>

      <div className="lx-lv-seal-wrap" data-depth="22">
        <div className="lx-lv-seal">
          <svg className="lx-lv-seal-ring" viewBox="0 0 120 120">
            <defs>
              <path id="lx-lv-ring-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
            </defs>
            <circle cx="60" cy="60" r="56" className="lx-lv-seal-edge" />
            <circle cx="60" cy="60" r="34" className="lx-lv-seal-inner" />
            <text>
              <textPath href="#lx-lv-ring-path" textLength="279" lengthAdjust="spacing">
                {ring.toUpperCase()}
              </textPath>
            </text>
          </svg>
          <span className="lx-lv-seal-mark">
            <Mark size={26} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </div>
  );
}
