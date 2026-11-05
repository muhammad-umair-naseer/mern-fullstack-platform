import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ValueProposition.css';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Why Cortexis: four promises, each shown by a small animated drawing rather
 * than explained in a paragraph.
 *
 * The copy only says what can be pointed at in this repository. The earlier
 * version sold scale we have never handled ("millions of requests", "99.99%
 * uptime", "SOC2/GDPR", "50+ enterprise systems"). None of it survived a check,
 * and a first client would hold us to every line. The metrics banner that
 * repeated those figures was removed for the same reason; bring numbers back
 * only once they are counted somewhere.
 *
 * Each tile links to a route that exists in App.js. The drawings are inline
 * SVG in ink and copper. Their loops run only while the section is on screen,
 * and every loop starts by clearing the finished drawing and redrawing it. So
 * the prerendered page, reduced motion and a paused loop all show the same
 * complete picture, and nothing flashes blank when a loop starts.
 */
const pillars = [
  {
    key: 'code',
    title: 'Code you own',
    desc: 'Your repository and documentation, from day one.',
    linkTo: '/services/custom-software-development',
  },
  {
    key: 'chat',
    title: 'AI for a real job',
    desc: "Scoped to real work. If a spreadsheet would do, we'll say so.",
    linkTo: '/services/ai-automation',
  },
  {
    key: 'graph',
    title: 'Progress you can open',
    desc: 'Watch the repository from the first commit.',
    linkTo: '/services/web-development',
  },
  {
    key: 'shield',
    title: 'Secure by default',
    desc: 'OWASP practice, encrypted data, backups we test.',
    linkTo: '/contact',
  },
];

// A code window whose lines type themselves out, then a key slides in.
function CodeArt() {
  const lines = [
    { y: 58, kw: [40, 20], rest: [64, 64] },
    { y: 72, kw: null, rest: [52, 104] },
    { y: 86, kw: [52, 26], rest: [82, 44] },
    { y: 100, kw: null, rest: [64, 78] },
    { y: 114, kw: [40, 14], rest: [58, 30] },
  ];
  return (
    <svg className="vp-svg vp-code" viewBox="0 0 240 160">
      <rect className="vp-paper vp-edge" x="22" y="20" width="196" height="120" rx="10" />
      <path className="vp-stroke vp-soft" d="M22 44 H218" />
      <circle className="vp-dotc" cx="36" cy="32" r="3" />
      <circle className="vp-dotc" cx="46" cy="32" r="3" />
      <circle className="vp-dotc" cx="56" cy="32" r="3" />
      {lines.map((l) => (
        <g key={l.y}>
          {l.kw && <rect className="vp-bar vp-cu" x={l.kw[0]} y={l.y - 2.5} width={l.kw[1]} height="5" rx="2.5" />}
          <rect className="vp-bar vp-ink" x={l.rest[0]} y={l.y - 2.5} width={l.rest[1]} height="5" rx="2.5" />
        </g>
      ))}
      <rect className="vp-cursor vp-cu" x="92" y="109" width="2" height="10" rx="1" />
      <g className="vp-key">
        <circle className="vp-stroke vp-copper vp-tint" cx="186" cy="124" r="11" />
        <circle className="vp-paper" cx="186" cy="124" r="4" />
        <path className="vp-stroke vp-copper" d="M197 124 H226 M216 124 V131 M222 124 V129" />
      </g>
    </svg>
  );
}

// A message comes in, the reply is typed, and it lands as a checked document.
function ChatArt() {
  return (
    <svg className="vp-svg vp-chat" viewBox="0 0 240 160">
      <g className="vp-in">
        <rect className="vp-sandf vp-edge" x="22" y="16" width="124" height="34" rx="14" />
        <rect className="vp-ink vp-faint" x="36" y="27" width="74" height="4.5" rx="2.25" />
        <rect className="vp-ink vp-faint" x="36" y="36" width="48" height="4.5" rx="2.25" />
      </g>
      <g className="vp-typing">
        <rect className="vp-tint" x="150" y="58" width="68" height="28" rx="14" />
        <circle className="vp-tdot vp-cu" cx="170" cy="72" r="3.2" />
        <circle className="vp-tdot vp-cu" cx="184" cy="72" r="3.2" />
        <circle className="vp-tdot vp-cu" cx="198" cy="72" r="3.2" />
      </g>
      <g className="vp-doc">
        <rect className="vp-paper vp-edge" x="58" y="94" width="124" height="52" rx="10" />
        <rect className="vp-ink vp-faint" x="72" y="108" width="62" height="4.5" rx="2.25" />
        <rect className="vp-ink vp-faint" x="72" y="118" width="46" height="4.5" rx="2.25" />
        <rect className="vp-ink vp-faint" x="72" y="128" width="54" height="4.5" rx="2.25" />
        <circle className="vp-tint" cx="160" cy="120" r="12" />
        <path className="vp-stroke vp-copper vp-draw vp-check" pathLength="1" d="M154 120.5 L158.5 125 L166.5 115.5" />
      </g>
    </svg>
  );
}

// A commit graph: the main line draws, a branch leaves and merges back, and
// the newest commit pulses.
function GraphArt() {
  const nodes = [
    { x: 38, y: 104 },
    { x: 74, y: 104 },
    { x: 106, y: 58, b: true },
    { x: 140, y: 58, b: true },
    { x: 176, y: 104 },
  ];
  return (
    <svg className="vp-svg vp-graph" viewBox="0 0 240 160">
      <path className="vp-stroke vp-soft" d="M22 132 H218" strokeDasharray="2 5" />
      <path className="vp-stroke vp-draw vp-line vp-main" pathLength="1" d="M26 104 H210" />
      <path
        className="vp-stroke vp-copper vp-draw vp-line vp-branch"
        pathLength="1"
        d="M74 104 C90 104 88 58 106 58 H140 C158 58 160 104 176 104"
      />
      {nodes.map((n) => (
        <circle key={n.x} className={`vp-node ${n.b ? 'vp-tint vp-stroke vp-copper' : 'vp-paper vp-stroke'}`} cx={n.x} cy={n.y} r="6.5" />
      ))}
      <circle className="vp-pulse" cx="210" cy="104" r="7" />
      <circle className="vp-node vp-head vp-cu" cx="210" cy="104" r="7" />
    </svg>
  );
}

// A shield draws itself, a scan passes over it, and the padlock snaps shut.
function ShieldArt() {
  const shield = 'M120 18 L170 36 V80 C170 110 148 130 120 142 C92 130 70 110 70 80 V36 Z';
  return (
    <svg className="vp-svg vp-shieldart" viewBox="0 0 240 160">
      <defs>
        <clipPath id="vp-shield-clip">
          <path d={shield} />
        </clipPath>
      </defs>
      <path className="vp-paper" d={shield} />
      <g clipPath="url(#vp-shield-clip)">
        <rect className="vp-scan" x="60" y="14" width="120" height="14" />
      </g>
      <path className="vp-stroke vp-draw vp-shield" pathLength="1" d={shield} />
      <g className="vp-lock">
        <path className="vp-stroke vp-copper vp-shackle" d="M108 80 V70 a12 12 0 0 1 24 0 V80" />
        <rect className="vp-tint vp-stroke vp-copper" x="100" y="80" width="40" height="32" rx="7" />
        <circle className="vp-cu" cx="120" cy="93" r="3.6" />
        <rect className="vp-cu" x="118.4" y="95" width="3.2" height="8" rx="1.6" />
      </g>
    </svg>
  );
}

const ART = { code: CodeArt, chat: ChatArt, graph: GraphArt, shield: ShieldArt };

// One loop per drawing. Each clears what is on screen, then redraws it.
function codeLoop(q) {
  const bars = q('.vp-code .vp-bar');
  const key = q('.vp-code .vp-key');
  gsap.set(bars, { transformOrigin: '0% 50%' });
  gsap.set(key, { transformOrigin: '186px 124px' });
  return gsap
    .timeline({ paused: true, repeat: -1, repeatDelay: 1.8 })
    .to(bars, { scaleX: 0, duration: 0.35, ease: 'power2.in', stagger: { each: 0.03, from: 'end' } })
    .to(key, { x: 26, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, '<')
    .set(key, { rotation: -35 })
    .to(bars, { scaleX: 1, duration: 0.5, ease: 'power3.out', stagger: 0.14 }, '+=0.15')
    .to(key, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, '-=0.1')
    .to(key, { rotation: 0, duration: 0.5, ease: 'back.out(2.4)' }, '-=0.15');
}

function chatLoop(q) {
  const inMsg = q('.vp-chat .vp-in');
  const typing = q('.vp-chat .vp-typing');
  const dots = q('.vp-chat .vp-tdot');
  const doc = q('.vp-chat .vp-doc');
  const check = q('.vp-chat .vp-check');
  return gsap
    .timeline({ paused: true, repeat: -1, repeatDelay: 1.6 })
    .to([inMsg, typing, doc], { autoAlpha: 0, y: -6, duration: 0.35, ease: 'power2.in', stagger: 0.05 })
    .set([inMsg, typing, doc], { y: 10 })
    .set(check, { strokeDashoffset: 1 })
    .to(inMsg, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '+=0.1')
    .to(typing, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '+=0.15')
    .to(dots, { y: -4, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: 3, stagger: 0.1 })
    .to(typing, { autoAlpha: 0, duration: 0.25 })
    .to(doc, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '<')
    .to(check, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' }, '-=0.1');
}

function graphLoop(q) {
  const lines = q('.vp-graph .vp-line');
  const main = q('.vp-graph .vp-main');
  const branch = q('.vp-graph .vp-branch');
  const nodes = q('.vp-graph .vp-node');
  gsap.set(nodes, { transformOrigin: '50% 50%' });
  return gsap
    .timeline({ paused: true, repeat: -1, repeatDelay: 1.8 })
    .to(nodes, { scale: 0, duration: 0.3, ease: 'power2.in', stagger: { each: 0.03, from: 'end' } })
    .to(lines, { strokeDashoffset: 1, duration: 0.35, ease: 'power2.in' }, '<')
    .to(main, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }, '+=0.1')
    .to(branch, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, '<0.3')
    .to(nodes, { scale: 1, duration: 0.35, ease: 'back.out(2.2)', stagger: 0.22 }, '<-0.1');
}

function shieldLoop(q) {
  const shield = q('.vp-shieldart .vp-shield');
  const shackle = q('.vp-shieldart .vp-shackle');
  const lock = q('.vp-shieldart .vp-lock');
  const scan = q('.vp-shieldart .vp-scan');
  gsap.set(lock, { transformOrigin: '120px 96px' });
  return gsap
    .timeline({ paused: true, repeat: -1, repeatDelay: 1.6 })
    .to(shackle, { y: -9, duration: 0.4, ease: 'power2.inOut' })
    .to(shield, { strokeDashoffset: 1, duration: 0.45, ease: 'power2.in' }, '<')
    .to(lock, { autoAlpha: 0.4, duration: 0.3 }, '<')
    .to(shield, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, '+=0.1')
    .fromTo(scan, { y: 0, autoAlpha: 0.9 }, { y: 112, duration: 1.1, ease: 'sine.inOut' }, '<0.25')
    .to(scan, { autoAlpha: 0, duration: 0.2 })
    .to(lock, { autoAlpha: 1, duration: 0.25 }, '<')
    .to(shackle, { y: 0, duration: 0.3, ease: 'power4.in' })
    .to(lock, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.out' });
}

export default function ValueProposition() {
  const scope = useRevealOnScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(scope);
        const loops = [codeLoop(q), chatLoop(q), graphLoop(q), shieldLoop(q)];
        // The first start is staggered so the four do not breathe in unison;
        // after that each resumes where it paused.
        let starts = [];
        ScrollTrigger.create({
          trigger: scope.current,
          start: 'top 85%',
          end: 'bottom 10%',
          onToggle: (self) => {
            starts.forEach((c) => c.kill());
            starts = [];
            loops.forEach((tl, i) => {
              if (!self.isActive) tl.pause();
              else if (tl.time() > 0) tl.play();
              else starts.push(gsap.delayedCall(i * 0.45, () => tl.play()));
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section className="lx-values" ref={scope} aria-labelledby="value-prop-heading">
      <div className="lx-wrap">
        <header className="lx-section-head">
          <span className="lx-label" data-reveal><span className="lx-label-num">02</span>Why Cortexis</span>
          <h2 id="value-prop-heading" className="lx-h2" data-reveal>
            Four things you can <em>hold us to.</em>
          </h2>
        </header>

        <ol className="lx-values-grid">
          {pillars.map((p, idx) => {
            const Art = ART[p.key];
            return (
              <li key={p.key} className="lx-value" data-reveal>
                <Link to={p.linkTo} className="lx-value-card">
                  <div className="lx-value-stage" aria-hidden="true">
                    <Art />
                  </div>
                  <div className="lx-value-foot">
                    <span className="lx-value-num" aria-hidden="true">{['i', 'ii', 'iii', 'iv'][idx]}.</span>
                    <h3 className="lx-value-title">{p.title}</h3>
                    <span className="lx-value-go" aria-hidden="true"><ArrowUpRight size={15} /></span>
                    <p className="lx-value-desc">{p.desc}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
