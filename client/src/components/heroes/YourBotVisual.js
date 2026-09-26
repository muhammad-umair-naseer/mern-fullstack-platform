import React, { useEffect, useRef, useState } from 'react';
import { Bot, CalendarCheck, CheckCheck, Pause, Play, SendHorizontal, ShoppingBag, UserRoundCheck } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { yourBotPhoto } from '../../assets/unique';
import './YourBotVisual.css';

gsap.registerPlugin(useGSAP);

const photo = yourBotPhoto;

// Three short conversations the assistant plays through in turn: a booking,
// a lead handed to the team, and an order taken in the middle of the night.
// Each is customer, bot, customer, bot, so the steps below fit every one.
const SCENES = [
  {
    time: '10:42 am',
    msgs: [
      'Hi! Can I book a visit on Saturday?',
      'Of course. Would 11:00 or 4:00 suit you?',
      '4:00, please.',
      'Booked: Saturday at 4:00. See you then!',
    ],
    toast: { icon: CalendarCheck, title: 'Visit booked', sub: 'Saturday · 4:00 pm' },
  },
  {
    time: '4:05 pm',
    msgs: [
      'Do you deliver to Rawalpindi?',
      'Yes, next day. What would you like to order?',
      'Twenty units, for our office.',
      'Noted. Someone from our team will call you shortly.',
    ],
    toast: { icon: UserRoundCheck, title: 'Lead sent to your team', sub: '20 units · Rawalpindi' },
  },
  {
    time: '2:14 am',
    msgs: [
      'Are you open right now?',
      'We open at 9:00, but I can take your order now.',
      'Great. One large, please.',
      'Done. It will be ready for you at 9:30.',
    ],
    toast: { icon: ShoppingBag, title: 'Order taken', sub: '2:14 am · while you slept' },
  },
];

// One conversation, beat by beat. `shown` is how many bubbles are out,
// `typing` the bot slot whose dots are showing.
const STEPS = [
  { ms: 700, shown: 0 },
  { ms: 1300, shown: 1 },
  { ms: 1200, shown: 1, typing: 1 },
  { ms: 1500, shown: 2 },
  { ms: 1000, shown: 3 },
  { ms: 1400, shown: 3, typing: 3 },
  { ms: 800, shown: 4 },
  { ms: 3600, shown: 4, toast: true },
  { ms: 750, shown: 4, toast: true, leaving: true },
];
const COMPOSED = 7; // the whole first conversation, toast and all
// The loop opens on that finished pose and holds it until the entrances
// (the notice lands last, at about 2.7s) have settled and been read.
const HOLD_MS = 5400;

/**
 * The Your Bot hero: a conversation over coffee. A warm photograph sits
 * behind a glass phone in which a customer and the assistant trade four
 * messages, the bot's replies arriving after a moment of typing dots; when
 * the exchange lands, a notice drops in beside it (a visit booked, a lead
 * passed on, an order taken at 2am) and the thread clears for the next one.
 *
 * The still state is the first conversation complete with its notice, so the
 * prerendered page and reduced motion both show a finished picture, and the
 * loop opens on that pose: it holds it a beat, lifts it away and plays the
 * next conversation live. The loop stops off screen and behind the pause
 * button, which also holds
 * the photo's drift and the dots. The layers are decoration for the hero's
 * own words, so they are hidden from assistive technology; the button is not.
 */
export default function YourBotVisual() {
  const root = useRef(null);
  const first = useRef(true);
  const [scene, setScene] = useState(0);
  const [step, setStep] = useState(COMPOSED);
  const [motionOK, setMotionOK] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setMotionOK(!mq.matches);
      setScene(0);
      setStep(COMPOSED);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = motionOK && inView && !paused;

  useEffect(() => {
    if (!running) return undefined;
    // The first beat holds the composed pose the page opened on.
    const ms = first.current && step === COMPOSED ? HOLD_MS : STEPS[step].ms;
    const t = setTimeout(() => {
      first.current = false;
      if (step === STEPS.length - 1) {
        setScene((s) => (s + 1) % SCENES.length);
        setStep(0);
      } else {
        setStep(step + 1);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [running, step]);

  // Pointer depth, a few pixels per layer, on fine pointers only.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const layers = gsap.utils.toArray('[data-depth]', root.current).map((el) => ({
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
    { scope: root }
  );

  const s = SCENES[scene];
  const beat = STEPS[step];
  const Icon = s.toast.icon;

  return (
    <div className={`ybv${paused ? ' is-paused' : ''}`} ref={root}>
      <div className="ybv-frame" data-depth="-8" aria-hidden="true">
        <div className="ybv-drift">
          <img src={photo.src} alt="" decoding="async" fetchPriority="high" />
        </div>
        <span className="lx-pv-sheen" />
      </div>

      <div className="ybv-phone-pos" data-depth="14" aria-hidden="true">
        <div className="ybv-phone">
          <div className="ybv-head">
            <span className="ybv-avatar">
              <Bot size={18} strokeWidth={1.8} />
            </span>
            <span className="ybv-who">
              <span className="ybv-name">Your Bot</span>
              <span className="ybv-status">
                <span className="ybv-dot" />
                {beat.typing ? 'typing…' : 'online'}
              </span>
            </span>
            <span className="ybv-channel">WhatsApp</span>
          </div>

          <div className="ybv-wall">
            <span className="ybv-day tabular" key={`d${scene}`}>
              Today · {s.time}
            </span>
            {/* Every conversation is laid out in the same cell, only the
                current one showing, so the wall is always as tall as the
                longest and the phone never changes height between them. */}
            <div className="ybv-threads">
              {SCENES.map((sc, n) => {
                const now = n === scene;
                return (
                  <ol
                    className={`ybv-thread${now ? '' : ' is-idle'}${now && beat.leaving ? ' is-leaving' : ''}`}
                    key={sc.time}
                  >
                    {sc.msgs.map((text, i) => {
                      const bot = i % 2 === 1;
                      return (
                        <li className={`ybv-slot ybv-slot--${bot ? 'out' : 'in'}`} key={text}>
                          {bot && (
                            <span className={`ybv-typing${now && beat.typing === i ? ' is-on' : ''}`}>
                              <i />
                              <i />
                              <i />
                            </span>
                          )}
                          <span className={`ybv-msg${now && i < beat.shown ? ' is-on' : ''}`}>
                            {text}
                            <span className="ybv-meta tabular">
                              {sc.time.replace(/ (am|pm)$/, '')}
                              {bot && <CheckCheck size={13} strokeWidth={2} />}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                );
              })}
            </div>
          </div>

          <div className="ybv-input">
            <span>Message</span>
            <span className="ybv-send">
              <SendHorizontal size={14} strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>

      <div className="ybv-toast-pos" data-depth="-14" aria-hidden="true">
        <div className={`ybv-toast lx-glass${beat.toast && !beat.leaving ? ' is-on' : ''}`}>
          <span className="ybv-toast-mark">
            <Icon size={16} strokeWidth={1.8} />
          </span>
          <span className="ybv-toast-text">
            <span className="ybv-toast-title">{s.toast.title}</span>
            <span className="ybv-toast-sub tabular">{s.toast.sub}</span>
          </span>
        </div>
      </div>

      <div className="ybv-chan-pos" data-depth="8" aria-hidden="true">
        <ul className="ybv-chan lx-glass">
          <li>
            <span className="ybv-chan-dot is-live" />
            WhatsApp
            <span className="ybv-chan-state">live</span>
          </li>
          <li>
            <span className="ybv-chan-dot" />
            Instagram
            <span className="ybv-chan-state">in development</span>
          </li>
        </ul>
      </div>

      {motionOK && (
        <button
          type="button"
          className="ybv-toggle lx-glass"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play the example conversations' : 'Pause the example conversations'}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
