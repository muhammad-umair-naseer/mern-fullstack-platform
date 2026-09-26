import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Check } from 'lucide-react';
import { authPhoto } from '../../assets/authform';
import { signupPhoto } from '../../assets/unique';
import './AuthFormVisual.css';

gsap.registerPlugin(useGSAP);

// The format every certificate code takes; the certificate page states it
// when a code does not match.
const CODE_FORMAT = 'CTX-XXXX-XXXXXX';

// The emailed code is six digits (see the code step in pages/AuthForm).
const CODE_SLOTS = [0, 1, 2, 3, 4, 5];

/**
 * The sign-in and sign-up hero: the form itself, on a frosted card laid over
 * a photograph, with the two things an account is for floating around it.
 * A small certificate (every course ends in one) turns its seal slowly and
 * signs itself on arrival; a glass chip shows the step after the form: on
 * sign-up the six-digit code filling in, on sign-in a progress line settling
 * where it was left.
 *
 * The frame, card and chips enter on CSS keyframes, so the prerendered page
 * arrives finished. GSAP runs only the code loop and a few pixels of pointer
 * depth on the decoration; the form never moves. Reduced motion shows the
 * code already filled and nothing drifting.
 */
export default function AuthFormVisual({ mode, children }) {
  const scope = useRef(null);
  const isSignup = mode === 'signup';

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const dots = gsap.utils.toArray('.lx-afv-dot', scope.current);
        const check = scope.current.querySelector('.lx-afv-check');
        if (!dots.length || !check) return undefined;

        gsap.set([...dots, check], { scale: 0.3, opacity: 0 });
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: 1.7 });
        tl.to(dots, { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(2.4)', stagger: 0.26 })
          .to(check, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, '+=0.25')
          .to([...dots, check], { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power2.in' }, '+=2.4');
        return () => tl.kill();
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
    { scope, dependencies: [isSignup] }
  );

  return (
    <div className={`lx-afv lx-afv--${isSignup ? 'signup' : 'login'}`} ref={scope}>
      <div className="lx-afv-photo-pos" data-depth="-8" aria-hidden="true">
        <div className="lx-pv-frame lx-afv-photo">
          <div className="lx-pv-drift">
            <img src={(isSignup ? signupPhoto : authPhoto).src} alt="" decoding="async" />
          </div>
          <span className="lx-pv-sheen" />
        </div>
      </div>

      <div className="lx-afv-cert-pos" data-depth="16" aria-hidden="true">
        <div className="lx-afv-cert">
          <span className="lx-afv-cert-title">Certificate</span>
          <span className="lx-afv-cert-sub">of completion</span>
          <span className="lx-afv-cert-rule" />
          <span className="lx-afv-sign">
            <svg viewBox="0 0 120 34" focusable="false">
              <path d="M5 25C11 13 17 5 21 6c4 1-2 17-6 21-3 3 2-9 8-12 5-3 5 6 9 6 4 0 5-7 9-7 3 0 1 6 5 6 5 0 7-9 12-9 4 0 2 8 6 8 6 0 9-6 15-8 7-2 14-2 29-6" />
            </svg>
            <span className="lx-afv-sign-wipe" />
          </span>
          <span className="lx-afv-cert-id">{CODE_FORMAT}</span>
          <span className="lx-afv-seal">
            <svg className="lx-afv-seal-ring" viewBox="0 0 100 100" focusable="false">
              <defs>
                <path id="lx-afv-seal-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text>
                <textPath href="#lx-afv-seal-path" textLength="228" lengthAdjust="spacing">
                  Cortexis · verifiable · Cortexis · verifiable ·
                </textPath>
              </text>
            </svg>
            <span className="lx-afv-seal-core" />
          </span>
          <span className="lx-afv-cert-sheen" />
        </div>
      </div>

      <div className="lx-afv-chip-pos" data-depth="11" aria-hidden="true">
        {isSignup ? (
          <div className="lx-glass lx-afv-chip">
            <span className="lx-afv-chip-label">6-digit code</span>
            <span className="lx-afv-slots">
              {CODE_SLOTS.map((i) => (
                <span className="lx-afv-slot" key={i}>
                  <span className="lx-afv-dot" />
                </span>
              ))}
              <span className="lx-afv-check">
                <Check size={12} strokeWidth={2.6} />
              </span>
            </span>
          </div>
        ) : (
          <div className="lx-glass lx-afv-chip">
            <span className="lx-afv-chip-label">Progress saved</span>
            <span className="lx-afv-track">
              <span className="lx-afv-fill" />
              <span className="lx-afv-runner" />
            </span>
          </div>
        )}
      </div>

      <div className="lx-afv-card">{children}</div>
    </div>
  );
}
