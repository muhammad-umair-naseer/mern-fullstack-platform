import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Check, Pause, Play, Send } from 'lucide-react';
import { contactNote } from '../../assets/unique';
import './ContactVisual.css';

gsap.registerPlugin(useGSAP);

const cups = contactNote;

// The three lines a brief is made of, and how far each one runs.
const ROWS = [
  { label: 'Scope', w: '92%' },
  { label: 'Users', w: '58%' },
  { label: 'Deadline', w: '74%' },
];

// The message's route, in the visual's own units (viewBox 0 0 520 540, the
// box's aspect ratio). It leaves the note under its send disc, rises and
// sways through the steam like a wisp of it, and curls into the Islamabad
// chip. Both ends sit under a card, so the line always appears to run from
// one to the other.
const ROUTE = 'M 272 372 C 262 292, 356 252, 334 178 C 318 118, 244 92, 160 90';

let clockFormat = null;
try {
  clockFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
} catch (e) {
  clockFormat = null;
}

// Islamabad's wall-clock time, split so the colon can breathe on its own.
function islamabadTime() {
  if (!clockFormat) return null;
  const parts = clockFormat.formatToParts(new Date());
  const get = (type) => (parts.find((p) => p.type === type) || {}).value;
  return { h: get('hour'), m: get('minute') };
}

/**
 * The contact hero: two cups on a table, and a message on its way to them.
 *
 * A paper note in the corner writes its three lines (scope, users,
 * deadline), its send disc presses, and a copper line draws up through the
 * steam into a glass chip that keeps Islamabad's local time. On arrival the
 * chip's pin ripples and a "Received" tag settles under it; the note clears
 * and the next message begins.
 *
 * The still state is the finished one (lines written, sent, received), so
 * the prerendered page and reduced motion both show a composed picture, and
 * the loop starts from and returns to exactly that pose. Entrances are CSS
 * keyframes; GSAP runs only the loop and a few pixels of pointer depth. The
 * loop pauses off screen and behind the pause button.
 */
export default function ContactVisual() {
  const scope = useRef(null);
  const loop = useRef(null);
  const [time, setTime] = useState(islamabadTime);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [motionOK, setMotionOK] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setTime(islamabadTime()), 10000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionOK(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = scope.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = motionOK && inView && !paused;
  // Read by the timeline when it is (re)built: a reduced-motion switch
  // rebuilds it from GSAP's own media listener, which can fire after the
  // effect below has already run, and the new loop must not stay paused.
  const runningRef = useRef(running);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(scope);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const bars = q('.lx-cv-bar');
        const path = q('.lx-cv-route-line')[0];
        const dot = q('.lx-cv-dot')[0];
        const ring = q('.lx-cv-ring')[0];
        const received = q('.lx-cv-received')[0];
        const disc = q('.lx-cv-send')[0];
        const [draft, sending, sent] = q('.lx-cv-status > span');
        if (!path || !dot || bars.length !== ROWS.length) return undefined;

        const len = path.getTotalLength();
        const at = { p: 0 };
        const place = () => {
          const pt = path.getPointAtLength(at.p * len);
          gsap.set(dot, { x: pt.x, y: pt.y });
        };

        // The entrances settle by about 2.4s; hold the finished pose a beat
        // so it reads before the first message clears it.
        const tl = gsap.timeline({ repeat: -1, delay: 3.6, paused: true });

        // Clear the last message.
        tl.to(received, { autoAlpha: 0, y: -6, duration: 0.5, ease: 'power2.in' })
          .to(path, { opacity: 0, duration: 0.5, ease: 'power1.out' }, '<')
          .to(bars, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.7, ease: 'expo.inOut', stagger: 0.06 }, '<0.1')
          .to(sent, { autoAlpha: 0, duration: 0.3 }, '<')
          .to(draft, { autoAlpha: 1, duration: 0.3 }, '<0.2')
          .set(path, { strokeDashoffset: 1, opacity: 1 })
          .set(bars, { transformOrigin: '0% 50%' })

          // Write the brief, one line at a time.
          .to(bars[0], { scaleX: 1, duration: 1, ease: 'power1.inOut' }, '+=0.35')
          .to(bars[1], { scaleX: 1, duration: 0.65, ease: 'power1.inOut' }, '+=0.18')
          .to(bars[2], { scaleX: 1, duration: 0.8, ease: 'power1.inOut' }, '+=0.18')

          // Send it.
          .to(disc, { scale: 0.84, duration: 0.14, ease: 'power2.out' }, '+=0.4')
          .to(disc, { scale: 1, duration: 0.6, ease: 'back.out(3)' })
          .to(draft, { autoAlpha: 0, duration: 0.25 }, '<')
          .to(sending, { autoAlpha: 1, duration: 0.25 }, '<')
          .set(dot, { opacity: 1 }, '<')
          .fromTo(at, { p: 0 }, { p: 1, duration: 1.6, ease: 'power2.inOut', onUpdate: place, immediateRender: false }, '<')
          .fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', immediateRender: false }, '<')

          // It lands in Islamabad.
          .to(dot, { opacity: 0, duration: 0.25 })
          .fromTo(ring, { scale: 0.5, opacity: 0.7 }, { scale: 2.6, opacity: 0, duration: 1.2, ease: 'expo.out', immediateRender: false }, '<')
          .to(sending, { autoAlpha: 0, duration: 0.25 }, '<')
          .to(sent, { autoAlpha: 1, duration: 0.25 }, '<')
          .fromTo(received, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', immediateRender: false }, '<0.1')

          // Hold the finished pose, which is also where the loop began.
          .to({}, { duration: 3.2 });

        loop.current = tl;
        if (runningRef.current) tl.resume();
        return () => {
          loop.current = null;
        };
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

  useEffect(() => {
    runningRef.current = running;
    const tl = loop.current;
    if (!tl) return;
    if (running) tl.resume();
    else tl.pause();
  }, [running]);

  return (
    <div className={`lx-cv${paused ? ' is-paused' : ''}`} ref={scope}>
      <div className="lx-cv-photo-pos" data-depth="-8" aria-hidden="true">
        <div className="lx-pv-frame lx-cv-photo">
          <div className="lx-cv-drift">
            <img src={cups.src} alt="" decoding="async" />
          </div>
          <span className="lx-pv-sheen" />
        </div>
      </div>

      <svg className="lx-cv-route" viewBox="0 0 520 540" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="lx-cv-route-base" d={ROUTE} />
        <path className="lx-cv-route-line" d={ROUTE} pathLength="1" />
        <g className="lx-cv-dot">
          <circle r="11" className="lx-cv-dot-halo" />
          <circle r="4.5" className="lx-cv-dot-core" />
        </g>
      </svg>

      <div className="lx-cv-where-pos" data-depth="12">
        <div className="lx-glass lx-cv-clock">
          <span className="lx-cv-pin" aria-hidden="true">
            <span className="lx-cv-ring" />
          </span>
          <span className="lx-cv-clock-text">
            <span className="lx-cv-city">Pakistan</span>
            <span className="lx-cv-time tabular">
              {time ? (
                <>
                  {time.h}
                  <span className="lx-cv-colon">:</span>
                  {time.m}
                </>
              ) : (
                'UTC+5'
              )}
              <span className="lx-cv-zone">PKT</span>
            </span>
          </span>
        </div>
        <span className="lx-glass lx-cv-received" aria-hidden="true">
          <span className="lx-cv-received-mark">
            <Check size={11} strokeWidth={2.6} />
          </span>
          Received
        </span>
      </div>

      <div className="lx-cv-note-pos" data-depth="18" aria-hidden="true">
        <div className="lx-cv-note">
          <div className="lx-cv-note-head">
            <span>New message</span>
            <span className="lx-cv-send">
              <Send size={13} strokeWidth={2} />
            </span>
          </div>
          <ul className="lx-cv-rows">
            {ROWS.map((r) => (
              <li key={r.label}>
                <span className="lx-cv-row-label">{r.label}</span>
                <span className="lx-cv-row-track">
                  <span className="lx-cv-bar" style={{ '--w': r.w }} />
                </span>
              </li>
            ))}
          </ul>
          <div className="lx-cv-note-foot">
            <span className="lx-cv-status">
              <span>Draft</span>
              <span>Sending</span>
              <span>
                <Check size={12} strokeWidth={2.6} /> Sent
              </span>
            </span>
            <span className="lx-cv-note-to">To Cortexis</span>
          </div>
        </div>
      </div>

      {motionOK && (
        <button
          type="button"
          className="lx-glass lx-cv-toggle"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play the message animation' : 'Pause the message animation'}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
