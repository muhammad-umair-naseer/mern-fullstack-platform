import React from "react";
import { Link } from "react-router-dom";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { workPhotos } from "../assets/home";
import "./Testimonials.css";

// Each card keeps its visible destination label: "Offline AI Assistant" lands
// on the AI services page rather than a product page of its own, and the label
// is what says so before the click.
const work = [
  {
    name: "Your Bot",
    description: "Answers customers and books meetings on WhatsApp and Instagram.",
    linkLabel: "Explore Your Bot",
    to: "/your-bot",
    photo: workPhotos.bot,
  },
  {
    name: "Free Power Tools",
    description: "Compress and convert files in your browser. No sign-up.",
    linkLabel: "Explore Free Tools",
    to: "/tools",
    photo: workPhotos.tools,
  },
  {
    name: "Offline AI Assistant",
    description: "Ask your own files questions, fully offline.",
    linkLabel: "Explore AI Solutions",
    to: "/services/ai-automation",
    photo: workPhotos.offline,
  },
];

/**
 * Things we've built: the flagship as a tall plate, the other two stacked
 * beside it. Photographs are illustrative (assets/home), never screenshots
 * passed off as client work.
 */
const Work = () => {
  const scope = useRevealOnScroll();

  return (
    <section className="lx-work" aria-labelledby="testimonials-heading" ref={scope}>
      <div className="lx-wrap">
        <header className="lx-section-head">
          <span className="lx-label" data-reveal><span className="lx-label-num">05</span>Work</span>
          <h2 id="testimonials-heading" className="lx-h2" data-reveal>
            Things we&rsquo;ve <em>built.</em>
          </h2>
          <div className="lx-section-aside" data-reveal>
            <p>Our own products. Client work on request.</p>
            {/* Client work is deliberately not shown. We cannot publish somebody
                else's project without their permission, so the section asks for
                the conversation instead of implying a portfolio page. */}
            <Link to="/contact" className="lx-link">
              Ask about client work <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <ol className="lx-work-list" aria-label="Products and tools we have built">
          {work.map((item, i) => (
            <li key={item.to} className="lx-work-cell" data-reveal>
              <Link to={item.to} className="lx-work-card">
                <div className="lx-frame lx-work-frame" data-reveal-media>
                  <div className="lx-work-drift" data-parallax="5">
                    {/* alt is empty: the card is named by its title, and the
                        photograph is mood rather than the product itself. */}
                    <img src={item.photo.src} srcSet={item.photo.srcSet} sizes="(max-width: 760px) 90vw, 33vw" alt="" loading="lazy" decoding="async" />
                  </div>
                  <span className="lx-work-num tabular" aria-hidden="true">0{i + 1}</span>
                </div>
                <div className="lx-work-body">
                  <h3 className="lx-work-name">{item.name}</h3>
                  <p className="lx-work-desc">{item.description}</p>
                  <span className="lx-work-go">
                    {item.linkLabel}
                    <span className="lx-work-disc" aria-hidden="true"><ArrowUpRight size={16} /></span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Work;
