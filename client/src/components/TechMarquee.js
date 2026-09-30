import React, { useEffect, useRef } from 'react';
import './TechMarquee.css';
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiDocker,
  SiTailwindcss,
  SiWordpress,
  SiFlutter,
  SiFigma,
} from 'react-icons/si';

// Every badge is something the repository or a service page backs:
//   React, Tailwind CSS — the client app (React 19, Tailwind 3).
//   Node.js             — the API is Express on Node.
//   PostgreSQL          — the API runs on Postgres through DATABASE_URL.
//   Docker              — the Dockerfile and docker-compose.yml at the root.
//   Python              — Python Development is one of the twelve services.
//   WordPress           — WordPress Development is a service page.
//   Flutter             — the mobile service offers Flutter cross-platform.
//   Figma               — design work is delivered as Figma files.
// Next.js, TypeScript, FastAPI, AWS, Kubernetes, MongoDB, PyTorch and
// OpenAI were dropped: nothing in the codebase or the service pages names
// them. Add one back only with a repo path or shipped project behind it.
const techItems = [
  { name: 'React', icon: SiReact },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Python', icon: SiPython },
  { name: 'Flutter', icon: SiFlutter },
  { name: 'Docker', icon: SiDocker },
  { name: 'WordPress', icon: SiWordpress },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'Figma', icon: SiFigma },
];

// Nine names are narrower than a wide screen, so each half of the loop
// carries the set twice; the track still slides exactly half its width.
const loopHalf = [...techItems, ...techItems];

export default function TechMarquee() {
  // The loop only runs while the row is on screen.
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle('is-offscreen', !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="lx-marquee" aria-label="Technologies we build with">
      <div className="lx-wrap lx-marquee-head">
        <h2 className="lx-marquee-title">What we build with</h2>
      </div>

      {/* Logos are drawn in ink rather than brand colours: nine competing
          hues read as a sticker sheet, one ink reads as a list. The track is
          doubled and slides exactly half its width, so the loop has no seam. */}
      <div className="lx-marquee-track-wrap">
        <ul className="lx-marquee-track">
          {[...loopHalf, ...loopHalf].map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx} className="lx-marquee-item" aria-hidden={idx >= techItems.length}>
                <Icon className="lx-marquee-icon" aria-hidden="true" focusable="false" />
                <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
