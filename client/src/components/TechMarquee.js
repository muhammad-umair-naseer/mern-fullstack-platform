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
    <section className="tech-marquee-wrapper" aria-label="Technologies and Frameworks We Use">
      <div className="tech-marquee-header">
        <span className="tech-marquee-eyebrow">Enterprise-Grade Stack</span>
        <h2 className="tech-marquee-title">Powering Next-Gen Intelligence & Software</h2>
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
