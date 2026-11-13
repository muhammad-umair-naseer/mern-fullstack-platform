import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, KeyRound } from 'lucide-react';
import { serviceBySlug, relatedServices } from '../../../data/services.js';
import { serviceImage, serviceSrcSet, serviceHeroPhoto } from '../../../data/serviceImages.js';
import PageHero from '../../../components/PageHero.jsx';
import ServiceDetailVisual from '../../../components/heroes/ServiceDetailVisual.jsx';
import ServiceArticle from '../../../components/ServiceArticle.jsx';
import { photos } from '../../../assets/lux/index.js';
import { POSTS } from '../../../data/blog.generated.js';
import { parseBlogContent } from '../../../lib/blogParser.js';
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll.jsx';
import Seo from '../../../seo/Seo.jsx';
import { breadcrumbs, hostedArticle, organization } from '../../../seo/schema.js';
import { SITE, absolute } from '../../../seo/site.js';

// Each service opens on its own photograph: the tall crop of the same picture
// its card and share image use (data/serviceImages.js).
const heroPhoto = (slug) => serviceHeroPhoto(slug) || photos.serviceWeb;

// The service's own name as the headline, its last word set in the italic.
const headline = (title) => {
  const words = title.split(' ');
  if (words.length < 2) return [<em key="t">{title}</em>];
  return [words.slice(0, -1).join(' '), <em key="t">{words[words.length - 1]}</em>];
};

// The hero carries one short line; the full description stays in the meta
// description and the structured data.
const LEDE = {
  'custom-software-development': 'Tailored software that scales with your operations.',
  'ai-automation': 'Intelligent automation and custom LLM workflows.',
  'saas-platform-development': 'Multi-tenant SaaS, secure and built to scale.',
  'web-development': 'Custom web apps and responsive websites.',
  'mobile-app-development': 'Native and cross-platform apps for iOS and Android.',
  'wordpress-development': 'Custom themes, plugins and WooCommerce sites.',
  'crm-development': 'Custom CRMs for sales, support and follow-ups.',
  'autonomous-ai-systems': 'AI agents that run whole processes, end to end.',
  'ui-ux-design': 'Intuitive, accessible interfaces, designed around users.',
  'digital-marketing': 'Data-driven marketing that widens your reach.',
  'e-commerce-solutions': 'Online stores with secure payments and inventory.',
  'ai-ml-solutions': 'Machine learning that automates work and finds insight.',
};

/**
 * One service, one URL.
 *
 * The services page shows all twelve and opens each in a modal, which is fine
 * for browsing and useless for search: a modal has no address, so nothing can
 * link to it and no crawler can reach it. That left one page trying to rank for
 * "wordpress developer in pakistan" and "flutter app development company in
 * pakistan" simultaneously, which no page can do.
 */
const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceBySlug(slug);
  const revealRef = useRevealOnScroll();
  const relatedRef = useRevealOnScroll();

  if (!service) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Seo title="Service not found" description="That service is not listed." path={`/services/${slug}`} noindex />
        <h1 className="lx-h2">We do not list <em>that service.</em></h1>
        <Link to="/services" className="lx-link mt-6">
          See everything we do <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </main>
    );
  }

  const related = relatedServices(service.slug);

  const SERVICE_ARTICLE_SLUG = {
    'ai-automation': 'free-offline-ai-assistant',
  };
  const path = `/services/${service.slug}`;
  const article = POSTS.find((p) => p.slug === SERVICE_ARTICLE_SLUG[service.slug] || p.home === path);
  const articleSchema = article ? hostedArticle(article, path, parseBlogContent(article.body).faqs) : [];

  return (
    <main className="text-ink min-h-screen">
      <Seo
        title={`${service.title} in Pakistan`}
        description={`${service.description} Built in Pakistan by ${SITE.name}.`.slice(0, 154)}
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
          ...articleSchema,
        ]}
      />

      <div className="lx-sd-hero">
        <PageHero
          back={{ to: '/services', label: 'All services' }}
          label={service.category}
          lines={headline(service.title)}
          lede={LEDE[service.slug] || service.description}
          actions={[{ to: '/contact', label: 'Talk to us about this', primary: true }]}
          visual={<ServiceDetailVisual photo={heroPhoto(service.slug)} deliverables={service.deliverables} />}
        />
      </div>

      <section ref={revealRef} className="svd" aria-label={`${service.title}: scope and deliverables`}>
        <div className="lx-wrap svd-grid">
          <div className="svd-covers">
            <span className="lx-label" data-reveal>What this covers</span>
            <ol className="svd-rows">
              {service.features.map((f, i) => (
                <li key={f} className="svd-row" data-reveal>
                  <span className="svd-row-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="svd-row-text">{f}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="svd-get" data-reveal>
            <span className="lx-label">What you get</span>
            <ul className="svd-get-list">
              {service.deliverables.map((d) => (
                <li key={d}>
                  <span className="svd-tick" aria-hidden="true"><Check size={13} strokeWidth={2.4} /></span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="svd-own">
              <KeyRound size={14} strokeWidth={1.75} aria-hidden="true" /> The repository and docs are yours.
            </p>
          </div>
        </div>
      </section>

      {article && <ServiceArticle post={article} />}

      {related.length > 0 && (
        <section ref={relatedRef} className="svd-related" aria-labelledby="svd-related-title">
          <div className="lx-wrap">
            <div className="svd-related-head">
              <h2 id="svd-related-title" className="svd-related-title" data-reveal>
                Often needed <em>alongside.</em>
              </h2>
              <nav className="svd-links" aria-label="More from Cortexis" data-reveal>
                <Link to="/services" className="lx-link">All services</Link>
                <Link to="/courses" className="lx-link">Learn it free</Link>
                <Link to="/contact" className="lx-link">Get a quote <ArrowRight size={15} aria-hidden="true" /></Link>
              </nav>
            </div>
            <ul className="svd-cards">
              {related.map((r) => (
                <li key={r.slug} data-reveal>
                  <Link to={`/services/${r.slug}`} className="svd-card">
                    <div className="svd-card-frame lx-frame" data-reveal-media>
                      <img src={serviceImage(r.slug)} srcSet={serviceSrcSet(r.slug)} sizes="(max-width: 760px) 100vw, 34vw" alt="" loading="lazy" decoding="async" width="1200" height="630" />
                      <span className="svd-card-cat">{r.category}</span>
                    </div>
                    <div className="svd-card-body">
                      <h3 className="svd-card-title">{r.title}</h3>
                      <span className="svd-card-cta" aria-hidden="true"><ArrowUpRight size={17} /></span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
};

export default ServiceDetail;
