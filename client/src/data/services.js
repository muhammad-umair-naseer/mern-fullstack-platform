/**
 * The services, in one place. Data only, no images.
 *
 * The sitemap and prerender scripts import this from plain Node, which cannot
 * load a .webp, so the artwork lives in ./serviceImages.js and is looked up by
 * slug in the components.
 *
 * They used to live inside Services.js and open in a modal, which meant no
 * service had a URL. A single page cannot rank for "flutter app development
 * company in pakistan" and "wordpress developer in pakistan" at once, and a
 * modal is invisible to a crawler and impossible to link to. Each service now
 * has a slug and its own page.
 */

const slugify = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const raw = [
  {
    title: "Custom Software Development",
    description: "Tailored, enterprise-grade software solutions engineered to scale and streamline your mission-critical operations.",
    category: "Development",
    features: [
      "Bespoke enterprise architecture & microservices",
      "High-performance, secure backend systems",
      "Scalable cloud infrastructure & automated CI/CD",
    ],
    deliverables: ["Full source code & documentation", "Architecture blueprint & API specs", "DevOps & cloud deployment guide"],
  },
  {
    title: "AI Automation",
    description: "End-to-end intelligent automation, autonomous AI agents, and custom LLM workflows to supercharge efficiency.",
    category: "AI/ML",
    features: [
      "Custom autonomous AI agents & RAG pipelines",
      "Intelligent workflow automation & RPA",
      "LLM fine-tuning, integration & vector search",
    ],
    deliverables: ["AI agent workflows & blueprints", "Custom model/API integrations", "Monitoring & orchestration dashboard"],
  },
  {
    title: "SaaS Platform Development",
    description: "Multi-tenant, high-growth Software-as-a-Service platforms built for global scale, security, and monetization.",
    category: "Development",
    features: [
      "Multi-tenant architecture & RBAC permissions",
      "Subscription billing (Stripe/Paddle) & tiers",
      "Comprehensive admin dashboard & real-time analytics",
    ],
    deliverables: ["Complete SaaS production build", "Billing & auth infrastructure", "Admin & analytics portal"],
  },
  {
    title: "Web Development",
    description: "Custom web applications and responsive websites built with cutting-edge technologies.",
    category: "Development",
    features: [
      "Responsive SPA/SSR with React/Next.js",
      "Secure APIs with Node.js/Express",
      "Testing, CI/CD and performance budgets",
    ],
    deliverables: ["Technical spec", "Staging environment", "Documentation & handover"],
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile apps for iOS and Android that delight users.",
    category: "Development",
    features: [
      "Flutter or React Native cross‑platform",
      "Native modules and offline support",
      "App Store and Play Store publishing",
    ],
    deliverables: ["Design assets", "Signed builds", "Release notes & analytics setup"],
  },
  {
  title: "WordPress Development",
  description: "Custom themes, plugins, and optimized sites powered by WordPress and WooCommerce.", // import from: ../assets/services/wordpress-development.png
  category: "Development",
  features: [
    "Custom themes and Gutenberg blocks",
    "WooCommerce setup and checkout optimization",
    "Speed, SEO, security & backups",
  ],
  deliverables: [
    "Theme/plugin source",
    "Performance & SEO baseline report",
    "Admin guide & handover",
  ],
},

  {
    title: "UI/UX Design",
    description: "User-centered design to create engaging, intuitive, and accessible digital experiences.",
    category: "Design",
    features: [
      "User research and personas",
      "Wireframes and interactive prototypes",
      "Design systems and accessibility",
    ],
    deliverables: ["Figma files", "Design tokens", "Usability report"],
  },

  {
    title: "Digital Marketing",
    description: "Data-driven marketing strategies to expand your online presence and reach.",
    category: "Marketing",
    features: ["SEO & content strategy", "Paid ads optimization", "Email and social campaigns"],
    deliverables: ["Content calendar", "KPI dashboard", "Quarterly growth report"],
  },
  {
    title: "E-Commerce Solutions",
    description: "Complete online store development with secure payment integration and inventory management.",
    category: "Development",
    features: ["Headless commerce", "Checkout optimization", "ERP/WMS integrations"],
    deliverables: ["Storefront", "CMS setup", "Payment & tax configuration"],
  },
  {
    title: "AI/ML Solutions",
    description: "Artificial Intelligence and Machine Learning solutions to automate processes and gain insights.",
    category: "AI/ML",
    features: ["Model training & evaluation", "MLOps pipelines", "Responsible AI guidelines"],
    deliverables: ["Model cards", "Serving infra", "Retraining schedule"],
  }
];

export const SERVICES = raw.map((s) => ({ ...s, slug: slugify(s.title) }));

export const serviceBySlug = (slug) => SERVICES.find((s) => s.slug === slug);

/** Others in the same category, for the links at the bottom of a service page. */
export const relatedServices = (slug, limit = 3) => {
  const self = serviceBySlug(slug);
  if (!self) return [];
  const sameCategory = SERVICES.filter((s) => s.slug !== slug && s.category === self.category);
  const rest = SERVICES.filter((s) => s.slug !== slug && s.category !== self.category);
  return [...sameCategory, ...rest].slice(0, limit);
};
