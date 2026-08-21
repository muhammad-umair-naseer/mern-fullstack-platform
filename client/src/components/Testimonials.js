import React from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import SectionHeading from "./SectionHeading";
import "./Testimonials.css";

import client1 from "../assets/client 1.webp";
import client2 from "../assets/client 2.webp";
import client3 from "../assets/client 3.webp";



const Testimonials = () => {
  const scope = useRevealOnScroll();
  const testimonials = [
    {
      name: "Arslan Ali",
      text:
        "Cortexis Solution Hub revamped our portal with a clean UI and blazing performance. Leads and demo requests jumped noticeably within weeks.",
      image: client1
    },
    {
      name: "Usman Ahmed",
      text:
        "Our Flutter app launch was smooth and on time. Push notifications and offline mode improved retention across the board.",
      image: client2
    },
    {
      name: "Idrees Khan",
      text:
        "The team delivered on time with reliable, high-quality code. Communication and workflow were absolutely seamless throughout.",
      image: client3
    },
  ];

  return (
    <section className="testimonials-container" aria-labelledby="testimonials-heading" ref={scope}>
      <div className="container">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Client stories"
          title="What Clients in Pakistan Say"
          subtitle="Real outcomes from teams we partner with"
          titleClassName="testimonials-title"
        />

        <ul className="row testimonials-row" role="list" aria-label="Client testimonials">
          {testimonials.map((t, i) => {
            const quoteId = `quote-${i}`;
            return (
              <li key={i} className="col-md-4 mb-4" role="listitem" data-reveal>
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
                    <blockquote id={quoteId} className="testimonial-quote">
                      “{t.text}”
                    </blockquote>
                  </div>
                  <figcaption className="card-footer text-center">
                    <strong className="testimonial-name">{t.name}</strong>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;
