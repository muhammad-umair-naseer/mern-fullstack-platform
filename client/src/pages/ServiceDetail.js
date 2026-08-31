import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { serviceBySlug, relatedServices } from '../data/services';
import { serviceImage } from '../data/serviceImages';
import Seo from '../seo/Seo';
import { breadcrumbs, organization } from '../seo/schema';
import { SITE, absolute } from '../seo/site';

/**
 * One service, one URL.
 *
 * The services page shows all twelve and opens each in a modal, which is fine
 * for browsing and useless for search: a modal has no address, so nothing can
 * link to it and no crawler can reach it. That left one page trying to rank for
 * "wordpress developer in islamabad" and "flutter app development company in
 * islamabad" simultaneously, which no page can do.
 */
const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceBySlug(slug);

  if (!service) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Seo title="Service not found" description="That service is not listed." path={`/services/${slug}`} noindex />
        <h1 className="text-2xl font-bold text-black">We do not list that service</h1>
        <Link to="/services" className="mt-4 inline-block font-bold text-orange-600 hover:underline">
          See everything we do
        </Link>
      </main>
    );
  }

  const related = relatedServices(service.slug);

  return (
    <main className="bg-gray-50 text-gray-800 min-h-screen">
      <Seo
        title={`${service.title} in Islamabad`}
        description={`${service.description} Built in Islamabad by ${SITE.name}.`.slice(0, 154)}
        path={`/services/${service.slug}`}
        image={serviceImage(service.slug)}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': absolute(`/services/${service.slug}#service`),
            name: service.title,
            description: service.description,
            serviceType: service.category,
            areaServed: { '@type': 'Country', name: 'Pakistan' },
            provider: { '@id': `${absolute('/')}#organization`.replace('//#', '/#') },
            url: absolute(`/services/${service.slug}`),
          },
          organization(),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <header className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <Link to="/services" className="text-sm text-indigo-100/80 hover:text-white">
            &larr; All services
          </Link>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-indigo-100/90">
            {service.category}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-indigo-100/90">{service.description}</p>
          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            Talk to us about this <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
          <h2 className="flex items-center gap-2 text-lg font-bold text-black">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> What this covers
          </h2>
          <ul className="mt-4 space-y-3">
            {service.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-black font-medium">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
          <h2 className="flex items-center gap-2 text-lg font-bold text-black">
            <Package className="h-5 w-5 text-indigo-600" /> What you get
          </h2>
          <ul className="mt-4 space-y-3">
            {service.deliverables.map((d) => (
              <li key={d} className="flex gap-2.5 text-black font-medium">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-slate-600">
            The code and the documentation are yours. We hand over a repository you own, not
            access to something we keep.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-extrabold text-black">Often needed alongside</h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/services/${r.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-orange-600">{r.category}</p>
                <h3 className="mt-1 font-bold text-black group-hover:text-orange-700">{r.title}</h3>
                <p className="mt-2 text-sm font-medium text-black leading-relaxed">{r.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-bold">
            <Link to="/services" className="text-orange-700 hover:underline">All services</Link>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <Link to="/courses" className="text-orange-700 hover:underline">Learn it yourself, free</Link>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <Link to="/contact" className="text-orange-700 hover:underline">Get a quote</Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default ServiceDetail;
