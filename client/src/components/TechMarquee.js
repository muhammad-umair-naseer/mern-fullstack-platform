import React from 'react';
import './TechMarquee.css';
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiPython, 
  SiFastapi, 
  SiTypescript, 
  SiDocker, 
  SiKubernetes, 
  SiAmazonwebservices, 
  SiPostgresql, 
  SiOpenai, 
  SiPytorch, 
  SiTailwindcss, 
  SiMongodb 
} from 'react-icons/si';

// LOGO AUDIT — left in place on purpose, flagged rather than fixed.
// Which technology we show here is a design call for the client, so nothing was
// removed. But the list is a claim about what we work in, and only four entries
// survive a check against the repository and the twelve service pages:
//   React        — front end runs React 19.
//   Node.js      — back end is Express 4 on Node.
//   Python       — we sell Python Development as a service.
//   Tailwind CSS — front end styling.
// The rest are unsupported, and two of them are contradicted outright:
//   PostgreSQL, MongoDB — this product stores data in node:sqlite. Showing a
//     database we do not run is the most falsifiable badge on the page.
//   TypeScript          — the client app is plain JavaScript throughout.
//   Next.js, FastAPI, AWS Cloud, Docker, Kubernetes — no trace in the codebase
//     and no service page names them.
//   OpenAI / LLMs, PyTorch — we do offer AI Automation and AI/ML Solutions, and
//     Your Bot's WhatsApp automation is live, but no evidence names these two
//     specific tools, and a logo reads as "we use this", not "we work in this area".
// To keep any of the above, point at the thing that proves it: a repo path, a
// deployed service, or a shipped project. Then the badge is a fact, not a hope.
// GSAP powers motion here and is verified, but adding a badge is equally a design
// decision, so it is noted rather than inserted.
const techItems = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#111827' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'OpenAI / LLMs', icon: SiOpenai, color: '#10A37F' },
  { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
  { name: 'AWS Cloud', icon: SiAmazonwebservices, color: '#FF9900' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
];

export default function TechMarquee() {
  return (
    <section className="tech-marquee-wrapper" aria-label="Technologies we build with">
      <div className="tech-marquee-header">
        {/* The old eyebrow read "Enterprise-Grade Stack". Dropped, not restyled:
            "enterprise-grade" is a quality claim with nothing behind it — no
            uptime record, no audit, no scale figures we can point to — and the
            client's new copy asks the logos to speak instead. The subline below
            now carries the whole second line, so the eyebrow slot has no job.
            .tech-marquee-eyebrow stays defined in the CSS, unused and ready, in
            case the client wants a verifiable label above the heading later. */}
        <h2 className="tech-marquee-title">What we work in</h2>
        {/* Styled with Tailwind utilities rather than a new CSS rule, because the
            brief forbids touching TechMarquee.css. The header block is already
            centred and spaced by .tech-marquee-header, so this only needs its own
            size, weight and colour to sit under the title without disturbing it. */}
        <p className="mt-2 mb-0 text-[0.92rem] font-medium leading-relaxed text-slate-500">
          Areas we build in. The badges are a map of the work, not an
          inventory of what runs this site.
        </p>
      </div>

      <div className="tech-marquee-track-container">
        <div className="tech-marquee-track">
          {[...techItems, ...techItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="tech-marquee-item">
                <Icon className="tech-icon" style={{ color: item.color }} />
                <span className="tech-name">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
