import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reel } from '../assets/home';
import './Gallery.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pad = (n) => String(n).padStart(2, '0');

/**
 * The studio reel: photographs that slide sideways while the section holds
 * still. The one pinned section on the page.
 *
 * On wide screens with motion allowed, vertical scroll drives the track to the
 * left, and each picture drifts a little against its own frame for depth. On
 * phones, and under reduced motion, it is simply a row you can swipe, with
 * scroll snapping and no pinning at all. Either way a hairline and a frame
 * counter in the header follow along.
 *
 * The photographs are the reel's own (assets/home): none of them is used
 * anywhere else on the site.
 */
export default function Gallery() {
  const scope = useRef(null);
  const total = reel.length;

  useGSAP(
    () => {
      const section = scope.current;
      const track = section.querySelector('.lx-reel-track');
      const now = section.querySelector('.lx-reel-now');

      // One writer for both modes. The counter is a pseudo-element reading a
      // data attribute, so nothing React rendered is ever overwritten.
      const setProgress = (p) => {
        section.style.setProperty('--reel-progress', p.toFixed(3));
        if (now) now.dataset.now = pad(Math.round(p * (total - 1)) + 1);
      };

      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => track.scrollWidth - section.clientWidth;

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });

        gsap.utils.toArray('.lx-reel-img', section).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: 6 },
            {
              xPercent: -6,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: slide,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        });
      });

      mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
        const onScroll = () => {
          const max = track.scrollWidth - track.clientWidth;
          setProgress(max > 0 ? track.scrollLeft / max : 0);
        };
        // The row scrolls on its own here, so it takes focus: arrow keys then
        // move it for anyone without touch or a trackpad. Only in this mode,
        // because the pinned row has nothing to scroll.
        track.tabIndex = 0;
        track.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => {
          track.removeEventListener('scroll', onScroll);
          track.removeAttribute('tabindex');
        };
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section className="lx-reel" ref={scope} aria-labelledby="reel-heading">
      <div className="lx-wrap lx-reel-head">
        <span className="lx-label"><span className="lx-label-num">Studio</span>Where the work happens</span>
        <h2 id="reel-heading" className="lx-h2">
          Made in <em>Pakistan.</em>
        </h2>
        <div className="lx-reel-meta" aria-hidden="true">
          <span className="lx-reel-count tabular">
            <span className="lx-reel-now" data-now="01" />
            <span className="lx-reel-of">/ {pad(total)}</span>
          </span>
          <span className="lx-reel-progress"><span /></span>
        </div>
      </div>

      <ul className="lx-reel-track" aria-label="Studio photographs">
        {reel.map((p, i) => (
          <li key={p.caption} className={`lx-reel-item${p.w > p.h ? ' is-wide' : ''}`}>
            <figure>
              <div className="lx-reel-frame">
                <img className="lx-reel-img" src={p.src} srcSet={p.srcSet} sizes="(max-width: 760px) 75vw, 54vw" alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span className="tabular">{pad(i + 1)}</span>
                {p.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
