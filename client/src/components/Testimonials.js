import React from "react";
import { Link } from "react-router-dom";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import SectionHeading from "./SectionHeading";
import { Bot, FileArchive, Files } from "lucide-react";
import "./Testimonials.css";

/**
 * The "Work" section of the home page.
 *
 * The filename and the stylesheet are a misnomer now: this file used to hold
 * three client testimonials, and is still called Testimonials.js so that
 * Home.js, and the CSS that Home.js already loads, need no edit in this
 * change. Rename both together in a later commit if the mismatch starts to
 * cost more than the rename would.
 *
 * The three testimonials that lived here — attributed to named people in San
 * Francisco, Dubai and Paris, each with a five-star rating and a performance
 * claim nobody measured — were invented. They are deleted rather than
 * commented out, because a commented-out fake is still a fake sitting in the
 * repository waiting to be uncommented. They can only come back as quotes a
 * real customer actually gave us, with that customer's written permission to
 * publish their name. The star row went with them: a rating nobody submitted
 * is not a rating.
 *
 * What replaces them is the strictest thing we can put on a marketing page —
 * three things a visitor can open in a new tab and check for themselves.
 */

/*
 * The client's brief listed two further products, QuickTap and Electrostock,
 * each carrying their own [confirm live] marker. Neither name appears anywhere
 * in this repository: no route, no page, no data file, no asset. They are left
 * out entirely rather than described vaguely, because a product a visitor
 * cannot open is indistinguishable from one that does not exist.
 *
 * What would let them be added: a live URL that resolves, plus either a page
 * for it in this app (a route in App.js, the way /your-bot has one) or an
 * external link the client confirms in writing is ours to advertise. One
 * sentence of description we can check against the running product, and the
 * card below is a two-line change.
 *
 * Dropped for the same reason: "Built with FastAPI and React" on Your Bot.
 * FastAPI is named in course and service copy in this repo, but nothing here
 * evidences it as Your Bot's stack — this front end is React, the back end is
 * Express. If the bot's own service is confirmed to run FastAPI, the sentence
 * can return.
 */
const work = [
  {
    // The one product of ours with a page in this app: /your-bot.
    name: "Your Bot",
    icon: Bot,
    description:
      // Taken from what /your-bot actually says the product is. The brief
      // described a self-serve "no-code builder" where a business uploads its
      // own content, connects a number and is live the same day — there is no
      // such flow anywhere in the codebase, and the product page describes the
      // opposite: an assistant Cortexis builds and deploys. A same-day
      // go-live was also a delivery promise nobody could evidence.
      "A custom AI assistant for WhatsApp that answers instantly, books meetings, and hands real buyers to your team.",
    // Scope stated plainly so nobody arrives expecting Instagram today.
    note: "WhatsApp is live. Instagram is in development.",
    linkLabel: "See Your Bot",
    to: "/your-bot",
  },
  {
    // Two of the sixty-two catalogued tools are actually built; these are them.
    // Both are client-side, which is checkable in the Network tab, so the
    // privacy line below is a claim a visitor can falsify in thirty seconds.
    name: "PDF Compressor",
    icon: FileArchive,
    description:
      "Shrinks a PDF by re-encoding the images inside it. The work happens in your browser — the file never leaves your computer and is never uploaded to a server.",
    note: "Free, no account, nothing uploaded.",
    linkLabel: "Open the compressor",
    to: "/tools/pdf-compressor",
  },
  {
    name: "PDF Merger",
    icon: Files,
    description:
      "Combines several PDFs into one document in the order you choose. Also runs entirely in the browser, so the files stay on your machine.",
    note: "Free, no account, nothing uploaded.",
    linkLabel: "Open the merger",
    to: "/tools/pdf-merger",
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
