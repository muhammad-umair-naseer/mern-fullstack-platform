import React from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import SectionHeading from "./SectionHeading";
import { Star } from "lucide-react";
import "./Testimonials.css";

import client1 from "../assets/client 1.webp";
import client2 from "../assets/client 2.webp";
import client3 from "../assets/client 3.webp";

const testimonials = [
  {
    name: "David Miller",
    location: "San Francisco, USA 🇺🇸",
    rating: 5,
    text: "Cortexis engineered our multi-tenant SaaS platform from ground zero. Their microservices architecture and automated cloud pipelines handled our rapid US customer scaling effortlessly. Truly top-tier engineering talent.",
    image: client1,
  },
  {
    name: "Tariq Al-Mansoor",
    location: "Dubai, UAE 🇦🇪",
    rating: 5,
    text: "The custom AI automation workflows and autonomous agents Cortexis deployed cut our manual operational time by over 65%. Their delivery speed, high security standards, and communication exceeded all expectations.",
    image: client2,
  },
  {
    name: "Éléonore Laurent",
    location: "Paris, France 🇫🇷",
    rating: 5,
    text: "Outstanding custom software engineering. Cortexis rebuilt our high-traffic digital commerce infrastructure with sub-second latencies and rock-solid reliability. Partnering with them has been a major competitive advantage.",
    image: client3,
  },
];

const Testimonials = () => {
  const scope = useRevealOnScroll();

  return (
    <section className="testimonials-container" aria-labelledby="testimonials-heading" ref={scope}>
      <div className="container">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Global Client Stories"
          title="What Global Leaders Say"
          subtitle="Trusted by fast-growing startups and enterprises across the USA, UAE, and Europe"
          titleClassName="testimonials-title"
        />

        <div className="row testimonials-row" aria-label="Client testimonials">
          {testimonials.map((t, i) => {
            const quoteId = `quote-${i}`;
            return (
              <div key={i} className="col-md-4 mb-4" data-reveal>
                <figure className="card testimonial-card h-100" aria-labelledby={quoteId}>
                  <div className="card-body text-center">
                    <div className="avatar-wrap">
                      <img
                        src={t.image}
                        alt={`${t.name} portrait`}
                        className="testimonial-img"
                        loading="lazy"
                      />
                    </div>

                    <div className="testimonial-rating" aria-label="5 out of 5 stars">
                      {[...Array(t.rating)].map((_, starIdx) => (
                        <Star key={starIdx} size={16} className="star-icon filled" />
                      ))}
                    </div>

                    <blockquote id={quoteId} className="testimonial-quote">
                      “{t.text}”
                    </blockquote>
                  </div>

                  <figcaption className="card-footer text-center">
                    <strong className="testimonial-name">{t.name}</strong>
                    <span className="testimonial-location">{t.location}</span>
                  </figcaption>
                </figure>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
