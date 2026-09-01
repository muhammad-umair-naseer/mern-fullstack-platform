import React from "react";
import { Link } from "react-router-dom";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import SectionHeading from "./SectionHeading";
import { Bot, Wrench, HardDrive } from "lucide-react";
import "./Testimonials.css";

const work = [
  {
    name: "Your Bot",
    icon: Bot,
    description:
      "A custom AI assistant built for WhatsApp and Instagram that answers customer questions instantly, qualifies leads, books meetings, and automates sales 24/7.",
    note: "Omnichannel: WhatsApp & Instagram Live",
    linkLabel: "Explore Your Bot",
    to: "/your-bot",
  },
  {
    name: "Free Power Tools",
    icon: Wrench,
    description:
      "A fast, high-performance utility suite with zero restrictions on file size or daily limits. Compress, convert, and manage documents with lightning speed — completely free, strictly private, and no signup required.",
    note: "100% Free • Unlimited file sizes • Instant processing",
    linkLabel: "Explore Free Tools",
    to: "/tools",
  },
  {
    name: "Offline AI Assistant",
    icon: HardDrive,
    description:
      "An intelligent on-device system that scans and indexes all your PC or mobile files. Ask questions and get instant, accurate answers from your notes and study materials completely offline without internet.",
    note: "100% Offline • No internet needed • Specially for students",
    linkLabel: "Explore AI Solutions",
    to: "/services/ai-automation",
  },
];

const Work = () => {
  const scope = useRevealOnScroll();

  return (
    // The section id, container class and heading id are unchanged so the
    // existing stylesheet, the reveal hook and any in-page anchor keep working.
    <section className="testimonials-container" aria-labelledby="testimonials-heading" ref={scope}>
      <div className="container">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Work"
          title="Things we've built"
          subtitle="Our own products first, because they're the ones we can show you in full. Client work on request."
          titleClassName="testimonials-title"
        />

        <div className="row testimonials-row" aria-label="Products and tools we have built">
          {work.map((item, i) => {
            const titleId = `work-title-${i}`;
            const Icon = item.icon;
            return (
              <div key={item.to} className="col-md-4 mb-4" data-reveal>
                <article className="card testimonial-card h-100" aria-labelledby={titleId}>
                  <div className="card-body text-center">
                    {/* The old avatar ring held a stock portrait of a client
                        who did not exist. The rating row's centering is reused
                        here for a plain icon; aria-hidden because the card is
                        already named by its title. */}
                    <div className="testimonial-rating" aria-hidden="true">
                      <Icon size={26} className="testimonial-role" />
                    </div>

                    <h3 id={titleId} className="testimonial-name">
                      {item.name}
                    </h3>

                    <p className="testimonial-quote">{item.description}</p>
                  </div>

                  <div className="card-footer text-center">
                    <Link to={item.to} className="testimonial-role">
                      {item.linkLabel}
                    </Link>
                    <span className="testimonial-location">{item.note}</span>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Client work is deliberately not shown as cards. We cannot publish
            somebody else's project without their permission, so the section
            asks for the conversation instead of implying a portfolio page.
            /contact is a real route; there is no /work or /case-studies page
            in App.js to send people to. */}
        <div className="text-center" data-reveal>
          <Link to="/contact" className="btn-view-all">
            Ask about client work
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Work;
