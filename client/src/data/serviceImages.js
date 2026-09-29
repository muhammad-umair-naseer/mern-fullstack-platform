/**
 * Photography per service, kept apart from the data so build scripts running
 * in plain Node can import the data without choking on a .webp.
 *
 * Every photo is from Unsplash (free to use under the Unsplash License) and
 * comes in two crops, each encoded to WebP at the size it is shown at:
 *
 *   wide  1200 x 630   the services grid card, the quick look and the share
 *                      card (the Open Graph size, so it needs no second file)
 *   tall  1000 x 1400  the service page hero, which frames it at 4 / 5 and
 *                      lets it drift a few percent against the scroll
 *
 * Both crops carry the same mild warm grade, so twelve photographers read
 * as one set beside the house photography in assets/lux. The Python code
 * shot is toned down further (its tall crop most, since the hero shows it
 * large), so its syntax colours sit quietly in the set.
 *
 * No photo here appears anywhere else on the site (assets/lux, assets/home,
 * the course covers or the blog covers); check before swapping one in.
 * Screens in shot should show no legible product name, URL or person's name:
 * these stand for our work, not someone else's.
 */
import customSoftware from '../assets/services-lux/custom-software-development.webp';
import customSoftwareTall from '../assets/services-lux/custom-software-development-tall.webp';
import aiAutomation from '../assets/services-lux/ai-automation.webp';
import aiAutomationTall from '../assets/services-lux/ai-automation-tall.webp';
import saas from '../assets/services-lux/saas-platform-development.webp';
import saasTall from '../assets/services-lux/saas-platform-development-tall.webp';
import web from '../assets/services-lux/web-development.webp';
import webTall from '../assets/services-lux/web-development-tall.webp';
import mobile from '../assets/services-lux/mobile-app-development.webp';
import mobileTall from '../assets/services-lux/mobile-app-development-tall.webp';
import wordpress from '../assets/services-lux/wordpress-development.webp';
import wordpressTall from '../assets/services-lux/wordpress-development-tall.webp';
import uiux from '../assets/services-lux/ui-ux-design.webp';
import uiuxTall from '../assets/services-lux/ui-ux-design-tall.webp';
import marketing from '../assets/services-lux/digital-marketing.webp';
import marketingTall from '../assets/services-lux/digital-marketing-tall.webp';
import ecommerce from '../assets/services-lux/e-commerce-solutions.webp';
import ecommerceTall from '../assets/services-lux/e-commerce-solutions-tall.webp';
import cpp from '../assets/services-lux/c-development.webp';
import cppTall from '../assets/services-lux/c-development-tall.webp';
import python from '../assets/services-lux/python-development.webp';
import pythonTall from '../assets/services-lux/python-development-tall.webp';
import aiml from '../assets/services-lux/ai-ml-solutions.webp';
import aimlTall from '../assets/services-lux/ai-ml-solutions-tall.webp';

export const SERVICE_PHOTOS = {
  'custom-software-development': {
    src: customSoftware,
    tall: customSoftwareTall,
    alt: 'A developer at a curved monitor full of code, in a bright room with plants',
    credit: 'Luke Peters',
  },
  'ai-automation': {
    src: aiAutomation,
    tall: aiAutomationTall,
    alt: 'An AI workflow automation dashboard and agent pipelines on a monitor in a sunlit studio',
    credit: 'Cortexis Studio',
  },
  'saas-platform-development': {
    src: saas,
    tall: saasTall,
    alt: 'A SaaS platform analytics dashboard with revenue charts on an open laptop in warm daylight',
    credit: 'Cortexis Studio',
  },
  'web-development': {
    src: web,
    tall: webTall,
    alt: 'A laptop showing a website on a light wooden desk, a mouse beside it',
    credit: 'Domenico Loia',
  },
  'mobile-app-development': {
    src: mobile,
    tall: mobileTall,
    alt: 'Two hands holding a smartphone, a silver watch on one wrist',
    credit: 'Paul Hanaoka',
  },
  'wordpress-development': {
    src: wordpress,
    tall: wordpressTall,
    alt: 'Hands typing on a laptop beside a potted plant in soft daylight',
    credit: 'Alexander Polous',
  },
  'ui-ux-design': {
    src: uiux,
    tall: uiuxTall,
    alt: 'A hand sketching mobile app wireframes on paper with a pen',
    credit: 'Amélie Mourichon',
  },
  'digital-marketing': {
    src: marketing,
    tall: marketingTall,
    alt: 'Hands laying out sticky notes on a campaign plan on a wooden table',
    credit: 'Brands&People',
  },
  'e-commerce-solutions': {
    src: ecommerce,
    tall: ecommerceTall,
    alt: 'An e-commerce digital platform design, conversion funnel and store analytics on a desktop display',
    credit: 'Cortexis Studio',
  },
  'c-development': {
    src: cpp,
    tall: cppTall,
    alt: 'High-performance C++ code and low-latency benchmark profiling on a curved developer display',
    credit: 'Cortexis Studio',
  },
  'python-development': {
    src: python,
    tall: pythonTall,
    alt: 'Lines of Python code on a dark screen, close up',
    credit: 'Chris Ried',
  },
  'ai-ml-solutions': {
    src: aiml,
    tall: aimlTall,
    alt: 'An AI engineer analyzing deep learning neural networks and training loss curves on an ultrawide display',
    credit: 'Cortexis Studio',
  },
};

// The wide crop by slug: grid cards, the quick look and the share card.
export const SERVICE_IMAGES = Object.fromEntries(
  Object.entries(SERVICE_PHOTOS).map(([slug, p]) => [slug, p.src])
);

export const serviceImage = (slug) => SERVICE_IMAGES[slug];

export const serviceImageAlt = (slug) => SERVICE_PHOTOS[slug]?.alt;

// The tall crop in the { src, alt } shape PhotoVisual takes, for the hero.
export const serviceHeroPhoto = (slug) => {
  const p = SERVICE_PHOTOS[slug];
  return p ? { src: p.tall, alt: p.alt, credit: p.credit } : undefined;
};

export const SERVICE_PHOTO_CREDITS = Object.values(SERVICE_PHOTOS).map((p) => p.credit);
