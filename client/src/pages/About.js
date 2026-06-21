import React from "react";
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import hero  from "../assets/hero About.png";
import aboutMission from "../assets/our mission About.png";
import aboutVision from "../assets/our vision About.png";
import aboutPromise from "../assets/our promise About.png";
import aboutStory from "../assets/our story About.png";
import team1 from "../assets/team 1.jpg";
import team2 from "../assets/team 2.jpg";
import team3 from "../assets/team 3.jpg";
import team4 from "../assets/team 4.jpg";




const About = () => {
  const introRef = useIntroTimeline();
  const statsRef = useRevealOnScroll();
  const mvpRef = useRevealOnScroll();
  const storyRef = useRevealOnScroll();
  const teamRef = useRevealOnScroll();

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}

      <section
        ref={introRef}
        className="relative isolate bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white py-24 md:py-28"
        aria-labelledby="about-hero-heading"
      >
        {/* soft spotlight */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% -10%, rgba(255,255,255,0.08), transparent)"
          }}
        />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div data-intro>
            <h1
              id="about-hero-heading"
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight"
            >
              Empowering Businesses Through{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-white">
                Innovation
              </span>
            </h1>
            <p className="text-lg text-indigo-100/90 mb-6">
              We help organizations adapt and grow by building digital products that create measurable impact.
            </p>
            <div className="flex gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold bg-white text-indigo-700 shadow-lg hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 transition"
              >
                Start a project
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold bg-transparent ring-2 ring-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 transition"
              >
                Explore services
              </a>
            </div>
          </div>


          <img
            data-intro
            src={hero}
            alt="About hero"
            loading="lazy"
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center" aria-label="Company statistics">
        {[
          { number: "4+", label: "Years of Excellence" },
          { number: "100+", label: "Successful Projects" },
          { number: "10+", label: "Global Markets" },
          { number: "99%", label: "Client Satisfaction" }
        ].map((stat, idx) => (
          <div key={idx} data-reveal className="bg-white rounded-2xl p-8 shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-4xl font-bold text-indigo-700 mb-2">{stat.number}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Mission, Vision, Promise */}
      <section ref={mvpRef} className="bg-gray-100 py-16 md:py-20" aria-labelledby="mvp-heading">
        <div className="max-w-6xl mx-auto px-6">
          <h2 id="mvp-heading" className="text-3xl font-bold text-center mb-10">What Drives Us</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                 img :aboutMission,
                title: "Our Mission",
                text: "Create solutions that keep businesses competitive, efficient, and impactful in a digital-first world."
              },
              {
                img: aboutVision,
                title: "Our Vision",
                text: "Be a trusted global partner recognized for innovation, quality, and measurable impact."
              },
              {
                img: aboutPromise,
                title: "Our Promise",
                text: "Deliver secure, scalable, and future‑ready products that drive real transformation."
              }
            ].map((item, idx) => (
              <article key={idx} data-reveal className="bg-white rounded-2xl shadow-md overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <img src={item.img} alt={item.title} loading="lazy" className="h-48 w-full object-cover" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-16 md:py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-12 items-center" aria-labelledby="story-heading">
        <img
          data-reveal
          src={aboutStory}
          alt="About hero"
          loading="lazy"
          className="rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
        />
        <div data-reveal>
          <h2 id="story-heading" className="text-3xl font-bold mb-5">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We began as a small studio helping local teams digitize workflows. Early wins shaped a simple playbook: keep it clear, ship quickly, measure what matters.</p>
          <p className="text-gray-600 leading-relaxed">
            Today, we collaborate with startups, enterprises, and public sector teams to build solutions that shape industries and improve lives.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="bg-gray-100 py-16 md:py-20 text-center" aria-labelledby="team-heading">
        <h2 id="team-heading" className="text-3xl font-bold mb-10">Our Team</h2>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[
            { name: "Ilyas Khan", role: "Operational Manager", image: team1 },
            { name: "Umair Khan", role: "UI/UX Engineer", image: team2 },
            { name:"Taimoor Saleem", role: "Head of Strategy", image: team3 },
            { name: "Faisal Imran", role: "Finance Manager", image: team4  }
          ].map((m, idx) => (
            <article key={idx} data-reveal className="bg-white rounded-2xl shadow-md p-6 hover:-translate-y-1 transition-transform duration-300">
              <img
                src={m.image}
                alt={`${m.name}, ${m.role}`}
                loading="lazy"
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
              />
              <h3 className="text-lg font-semibold">{m.name}</h3>
              <p className="text-gray-500">{m.role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
        <p className="max-w-2xl mx-auto mb-6 text-lg text-indigo-100">
          Let’s collaborate on solutions that fuel growth, unlock innovation, and create impact.
        </p>
        <a href="/contact" className="inline-flex px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 transition">
          Contact Us
        </a>
      </section>
    </main>
  );
};

export default About;
