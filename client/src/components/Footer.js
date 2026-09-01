import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Site footer.
 *
 * Built as a closing statement rather than a sitemap. The old version was a
 * three-column link strip with orange headings; this one leads with one
 * display-scale line and lets everything else sit at 15px and below. The 6:1
 * gap between the headline and the next largest type is the whole design —
 * if a middle size ever creeps in here, the footer collapses back into a strip.
 *
 * Link budget is 26, deliberately. Internal equity divides across every link
 * on a page, and a sitewide block this size already accounts for a third of
 * the outgoing links on a short service page. Six of twelve services and five
 * of twenty-three courses are listed because the selectivity is the signal:
 * the hubs carry the rest, and everything remains two clicks from home.
 *
 * The motion is scrub-linked to scroll rather than a one-shot entrance: the
 * rail drifts up more slowly than the page, and the display line wipes open
 * from its own baseline, both driven by scroll position. That is deliberate —
 * a fade-up that fires once reads as decoration, whereas motion tied to the
 * scrub reads as the page uncovering something, which is the effect worth
 * having at this scale of type.
 *
 * Every start state is set in JavaScript, never in the stylesheet. This
 * component is rendered into all 61 pages by the build-time prerenderer, so a
 * CSS `opacity: 0` or `clip-path` start state would ship a footer that is
 * invisible to every crawler and every visitor whose JS failed. With the start
 * state in JS the static HTML is the finished footer, and the animation is
 * strictly an enhancement on top of it. The site's useRevealOnScroll hook is
 * not used here for exactly that reason.
 *
 * Facebook is absent on purpose. The only URL we hold is
 * facebook.com/profile.php with no page id, which resolves nowhere — a footer
 * link to a dead page costs more trust than an absent icon. Restore it once
 * there is a real page id to point at.
 *
 * The SECP registration is stated but not linked: the eServices name-search
 * page is a form, not a permalink to our record, so a link would drop the
 * reader into a blank search box. Text is the honest treatment.
 */
const Footer = () => {
  const scope = useRef(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The window runs from the moment the footer's top edge crosses into
        // the viewport to the moment its bottom edge lands on the viewport
        // floor — i.e. exactly the span in which the footer is being uncovered.
        // scrub ties progress to scroll position with a little smoothing, so
        // dragging the scrollbar backwards runs it backwards.
        const window_ = {
          trigger: scope.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.45,
        };

        // The rail lags the page. 96px over the whole reveal is small enough
        // that nobody consciously notices it and large enough that the footer
        // stops feeling welded to the content above it.
        gsap.fromTo(
          scope.current.querySelector(".cx-ft-rail"),
          { y: 96 },
          { y: 0, ease: "none", scrollTrigger: window_ }
        );

        // The display line wipes open from its own baseline rather than fading:
        // at 116px a fade looks like a loading state, while a wipe reads as
        // type being set. inset() from the bottom keeps each line's baseline
        // fixed so nothing appears to move vertically twice.
        //
        // 105% rather than 100% because the descender on the comma and the
        // optical overshoot of the round glyphs sit a hair below the box.
        gsap.fromTo(
          scope.current.querySelectorAll(".cx-ft-shout span"),
          { clipPath: "inset(105% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            stagger: 0.12,
            // Keyed to the headline itself, not to the footer. The footer's
            // "bottom bottom" is the last scroll position the document has, so
            // a staggered tween measured against it can only finish its first
            // line — the second is still part-clipped when the page runs out
            // of scroll. Measured against the headline entering the viewport
            // and reaching 45% of it, both lines are reachable and both finish
            // while there is still page left to read.
            scrollTrigger: {
              trigger: scope.current.querySelector(".cx-ft-shout"),
              start: "top bottom",
              end: "top 45%",
              scrub: 0.45,
            },
          }
        );
      });

      // ScrollTrigger measures a trigger's start and end once, at creation.
      // Here that is during hydration — before the lazily imported route above
      // has resolved and before Space Grotesk has replaced the fallback face.
      // It therefore measures a document several thousand pixels shorter than
      // the real one and concludes the footer is already most of the way
      // through its reveal. The symptom is a footer stuck part-clipped that
      // never responds to scrolling.
      //
      // A refresh on load, on fonts.ready or after a couple of frames is not
      // enough, because React.lazy resolves whenever it resolves and routinely
      // lands after all three. Watching the document's own box instead catches
      // the lazy route, late images and the font swap alike, and needs no
      // guess about timing.
      //
      // refresh() recomputes every trigger on the page, so the reveal hook
      // used by other components gets the same correction for free.
      let lastHeight = 0;
      let queued = 0;
      const refresh = () => {
        const h = document.documentElement.scrollHeight;
        // Sub-pixel jitter from the scrub's own transform would otherwise
        // refresh on every frame, which is expensive.
        if (Math.abs(h - lastHeight) < 4) return;
        lastHeight = h;
        cancelAnimationFrame(queued);
        queued = requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      const observer = new ResizeObserver(refresh);
      observer.observe(document.body);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }

      return () => {
        observer.disconnect();
        cancelAnimationFrame(queued);
        mm.revert();
      };
    },
    { scope }
  );

  return (
    <footer className="footer" ref={scope}>
      <div className="cx-ft-rail">
        <h2 className="visually-hidden">Site footer</h2>

        {/*
          Authored as two block spans rather than one wrapping string: the line
          break is a composition decision, not something the browser should
          make. No white-space: nowrap, though — if the clamp ever overshoots a
          viewport we would rather the line wrap ugly than get clipped by the
          footer's overflow guard.

          The second line is 29 characters against the first's 20, so the clamp
          in the stylesheet is tuned to the LONGER line. That is what caps the
          display size here: a headline is only as big as its worst line.
        */}
        <p className="cx-ft-shout">
          <span>Hire us to build it.</span>
          <span>Or learn to build it yourself.</span>
        </p>

        <div className="cx-ft-cta-row">
          <Link className="cx-ft-cta" to="/contact">
            Start a project
            <span className="cx-ft-arrow" aria-hidden="true">&#8599;</span>
          </Link>

          {/* <address> is correct here — these are our own contact details.
              The copyright and registration lines stay out of it. */}
          <address className="cx-ft-reach">
            <span className="cx-ft-reach-block">
              <span className="cx-ft-label">New projects</span>
              <a className="cx-ft-reach-link" href="mailto:cortexis.solution.hub@gmail.com">
                cortexis.solution.hub@gmail.com
              </a>
            </span>
            <span className="cx-ft-reach-block">
              <span className="cx-ft-label">WhatsApp or call</span>
              <a className="cx-ft-reach-link" href="tel:+923475769500">
                +92 347 5769500
              </a>
            </span>
          </address>
        </div>

        <hr className="cx-ft-rule" />

        {/*
          One <nav> for the whole grid, not one per column. Five landmarks all
          announcing "navigation, contentinfo" is rotor noise; screen-reader
          users skim a footer by heading, which is why every column keeps a
          visible <h3> at the same level.
        */}
        <nav className="cx-ft-grid" aria-label="Footer">
          <div className="cx-ft-col">
            <h3 className="cx-ft-label">Build</h3>
            <ul>
              <li><Link to="/services">All services</Link></li>
              <li><Link to="/services/web-development">Web development</Link></li>
              <li><Link to="/services/mobile-app-development">Mobile app development</Link></li>
              <li><Link to="/services/wordpress-development">WordPress development</Link></li>
              <li><Link to="/services/ai-automation">AI automation</Link></li>
              <li><Link to="/services/e-commerce-solutions">E-commerce</Link></li>
            </ul>
          </div>

          <div className="cx-ft-col">
            <h3 className="cx-ft-label">Learn</h3>
            <ul>
              <li><Link to="/courses">All 23 free courses</Link></li>
              <li><Link to="/learn/full-stack-web">Full-stack web</Link></li>
              <li><Link to="/learn/python-development">Python</Link></li>
              <li><Link to="/learn/wordpress-development">WordPress</Link></li>
              <li><Link to="/learn/ai-ml-essentials">AI &amp; machine learning</Link></li>
            </ul>
          </div>

          <div className="cx-ft-col">
            <h3 className="cx-ft-label">Read and use</h3>
            <ul>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/tools">Free tools</Link></li>
              {/* /your-bot only. /whatsapp-bot mounts the same component and is
                  kept alive because those exact URLs are registered with Meta
                  for WhatsApp Business Platform review, but it self-canonicalises
                  here and is absent from the sitemap — linking it would split
                  the signal for nothing. */}
              <li><Link to="/your-bot">Your Bot</Link></li>
            </ul>
            {/* Two of sixty-two tools are built. Saying so here costs one line
                and saves the visitor a click into sixty placeholders. */}
            <p className="cx-ft-note">Two tools live, free to use.</p>
          </div>

          <div className="cx-ft-col">
            <h3 className="cx-ft-label">Company</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/internships">Internships</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </nav>

        <hr className="cx-ft-rule" />

        <div className="cx-ft-base">
          <div className="cx-ft-id">
            <p className="cx-ft-mark">
              <img src="/cortexis-mark.png" alt="" width="26" height="26" decoding="async" />
              <span>Cortexis Solution Hub (Pvt.) Ltd.</span>
            </p>
            {/* City and country only. The street line on the SECP filing is a
                private address and must never appear here. */}
            <p className="cx-ft-place">Islamabad, Pakistan</p>
            <p className="cx-ft-fine">Building since September 2025.</p>
            <p className="cx-ft-fine">
              &copy; {year} Cortexis Solution Hub (Pvt.) Ltd. All rights reserved.
            </p>
            <p className="cx-ft-fine">
              Registered with the SECP under the Companies Act 2017. CUIN 0306803.
              Incorporated 2 September 2025.
            </p>
          </div>

          <div className="cx-ft-base-right">
            {/* A heading rather than aria-label on the list, so the group is
                reachable by heading navigation like every other column. */}
            <h3 className="visually-hidden" id="cx-ft-social-h">Elsewhere</h3>
            <ul className="cx-ft-social" aria-labelledby="cx-ft-social-h">
              <li>
                {/* rel is "me noopener" without noreferrer on purpose: these are
                    our own profiles and stripping the referrer would throw away
                    the attribution. eslint's jsx-no-target-blank wants noreferrer
                    unconditionally, and CRA turns that warning into a hard build
                    failure whenever CI is set, so the rule is disabled by hand
                    rather than satisfied by weakening the link. */}
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a
                  href="https://www.instagram.com/cortexis.solution.hub"
                  target="_blank"
                  rel="me noopener"
                >
                  {/* Icon hidden, text visible only to AT: a voice-control user
                      saying "click Instagram" has to match the accessible name,
                      and an icon on its own gives them nothing to say. */}
                  <Instagram size={18} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                  <span className="visually-hidden">Instagram (opens in a new tab)</span>
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a
                  href="https://www.linkedin.com/company/cortexis-solution-hub"
                  target="_blank"
                  rel="me noopener"
                >
                  <Linkedin size={18} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                  <span className="visually-hidden">LinkedIn (opens in a new tab)</span>
                </a>
              </li>
            </ul>

            {/* The bot policy pages are noindexed and pass no search value, but
                they are a Meta app-review requirement and were linked from the
                previous footer — dropping them silently would be a regression. */}
            <nav aria-label="Legal">
              <ul className="cx-ft-legal">
                <li><Link to="/terms">Terms</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
                <li><Link to="/your-bot/terms">Bot terms</Link></li>
                <li><Link to="/your-bot/privacy">Bot privacy</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
