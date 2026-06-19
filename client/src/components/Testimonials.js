import React from "react";
import "./Testimonials.css";

import client1 from "../assets/client 1.jpg";
import client2 from "../assets/client 2.jpg";
import client3 from "../assets/client 3.jpg";



const Testimonials = () => {
  const testimonials = [
    {
      name: "Arslan Ali",
      company: "Karachi Tech Ventures",
      text:
        "Dummy Company revamped our portal with a clean UI and blazing performance. Leads and demo requests jumped noticeably within weeks.",
      image: client1

    },

    {
      name: "Usman Ahmed",
      company: "Lahore Digital Works",
      text:
        "Our Flutter app launch was smooth and on time. Push notifications and offline mode improved retention across the board.",
      image: client2
         
      
    },

    {
      name: "Idrees Khan",
      company: "Islamabad EduLabs",
      text:
      "The team delivered on time with reliable, high-quality code. Communication and workflow were absolutely seamless throughout.",
      image: client3
         
    },
  ];

  return (
    <section className="testimonials-container" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading" className="testimonials-title">
          What Clients in Pakistan Say
        </h2>
        <p className="testimonials-subtitle">Real outcomes from teams we partner with</p>

        <ul className="row testimonials-row" role="list" aria-label="Client testimonials">
          {testimonials.map((t, i) => {
            const quoteId = `quote-${i}`;
            return (
              <li key={i} className="col-md-4 mb-4" role="listitem">
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
                    <br />
                    <small className="text-muted">{t.company}</small>
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
