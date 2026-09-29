// Cover photography for every course, keyed by course slug (the course's
// filename under server/src/content/courses). All from Unsplash, free to use
// under the Unsplash License: each is cropped to 16:10 at 1200 × 750 and
// encoded to WebP, and the credit travels with the photo so it can be shown
// wherever the cover is. `unsplashId` is the photo's id on unsplash.com, kept
// so no other page reuses the same shot.

import aiAutomationAgents from '../assets/courses-lux/ai-automation-agents.webp';
import aiEngineering from '../assets/courses-lux/ai-engineering.webp';
import aiMlEssentials from '../assets/courses-lux/ai-ml-essentials.webp';
import aiToolsForEveryone from '../assets/courses-lux/ai-tools-for-everyone.webp';
import cloudDevops from '../assets/courses-lux/cloud-devops.webp';
import cppDevelopment from '../assets/courses-lux/cpp-development.webp';
import cybersecurityFundamentals from '../assets/courses-lux/cybersecurity-fundamentals.webp';
import dataEngineering from '../assets/courses-lux/data-engineering.webp';
import dataSciencePython from '../assets/courses-lux/data-science-python.webp';
import dataStructuresAlgorithms from '../assets/courses-lux/data-structures-algorithms.webp';
import digitalMarketing from '../assets/courses-lux/digital-marketing.webp';
import dockerKubernetes from '../assets/courses-lux/docker-kubernetes.webp';
import ecommerceShopifyAmazonVa from '../assets/courses-lux/ecommerce-shopify-amazon-va.webp';
import excelBusinessAnalytics from '../assets/courses-lux/excel-business-analytics.webp';
import flutterMobile from '../assets/courses-lux/flutter-mobile.webp';
import freelancingUpworkFiverr from '../assets/courses-lux/freelancing-upwork-fiverr.webp';
import frontendEngineering from '../assets/courses-lux/frontend-engineering.webp';
import fullStackWeb from '../assets/courses-lux/full-stack-web.webp';
import gitGithub from '../assets/courses-lux/git-github.webp';
import graphicDesignPsAi from '../assets/courses-lux/graphic-design-ps-ai.webp';
import javaSpringBoot from '../assets/courses-lux/java-spring-boot.webp';
import laravelFundamentals from '../assets/courses-lux/laravel-fundamentals.webp';
import nodejsBackend from '../assets/courses-lux/nodejs-backend.webp';
import powerBiBusinessIntelligence from '../assets/courses-lux/power-bi-business-intelligence.webp';
import pythonDevelopment from '../assets/courses-lux/python-development.webp';
import reactNative from '../assets/courses-lux/react-native.webp';
import softwareTestingQa from '../assets/courses-lux/software-testing-qa.webp';
import sqlDataAnalysis from '../assets/courses-lux/sql-data-analysis.webp';
import systemDesign from '../assets/courses-lux/system-design.webp';
import typescript from '../assets/courses-lux/typescript.webp';
import uiUxBootcamp from '../assets/courses-lux/ui-ux-bootcamp.webp';
import unityGameDev from '../assets/courses-lux/unity-game-dev.webp';
import videoEditingShortForm from '../assets/courses-lux/video-editing-short-form.webp';
import wordpressDevelopment from '../assets/courses-lux/wordpress-development.webp';

export const COURSE_COVERS = {
  'ai-automation-agents': {
    src: aiAutomationAgents,
    alt: 'An AI workflow automation dashboard and neural agent pipelines on a monitor in a sunlit studio',
    credit: 'Cortexis Studio',
  },
  'ai-engineering': {
    src: aiEngineering,
    alt: 'Neural network architectures, model fine-tuning, and loss curves on a high-resolution display',
    credit: 'Cortexis Studio',
  },
  'ai-ml-essentials': {
    src: aiMlEssentials,
    alt: 'An AI engineer analyzing deep learning neural networks and training loss curves on an ultrawide display',
    credit: 'Cortexis Studio',
  },
  'ai-tools-for-everyone': {
    src: aiToolsForEveryone,
    alt: 'A woman working on a laptop at a bright kitchen table over breakfast',
    credit: 'Vitaly Gariev',
    unsplashId: 'vZrVIykvyVk',
  },
  'cloud-devops': {
    src: cloudDevops,
    alt: 'Cloud DevOps infrastructure monitoring, Kubernetes cluster nodes, and CI/CD pipelines on a display',
    credit: 'Cortexis Studio',
  },
  'cpp-development': {
    src: cppDevelopment,
    alt: 'High-performance C++ code and low-latency benchmark profiling on a curved developer display',
    credit: 'Cortexis Studio',
  },
  'cybersecurity-fundamentals': {
    src: cybersecurityFundamentals,
    alt: 'Cybersecurity terminal showing network packet inspection, security event logs and firewall defenses on an engineer screen',
    credit: 'John Barkiple',
    unsplashId: 'photo-1550751827-4bd374c3f58b',
  },
  'data-engineering': {
    src: dataEngineering,
    alt: 'Distributed data pipelines, node topology, and cluster stream ingestion on an engineer monitor',
    credit: 'Cortexis Studio',
  },
  'data-science-python': {
    src: dataSciencePython,
    alt: 'Python code and data manipulation on a developer display',
    credit: 'Cortexis Studio',
  },
  'data-structures-algorithms': {
    src: dataStructuresAlgorithms,
    alt: 'High-performance algorithms, binary trees, and memory profiling on a curved developer display',
    credit: 'Cortexis Studio',
  },
  'digital-marketing': {
    src: digitalMarketing,
    alt: 'Digital marketing performance dashboard tracking multi-channel conversions, SEO traffic, and campaign analytics',
    credit: 'Stephen Dawson',
    unsplashId: 'photo-1533750516457-a7f992034fec',
  },
  'docker-kubernetes': {
    src: dockerKubernetes,
    alt: 'Kubernetes cluster overview, Docker container pods, and service ingress routing on a monitor',
    credit: 'Cortexis Studio',
  },
  'ecommerce-shopify-amazon-va': {
    src: ecommerceShopifyAmazonVa,
    alt: 'An e-commerce digital platform design, conversion funnel and store analytics on a desktop display',
    credit: 'Cortexis Studio',
  },
  'excel-business-analytics': {
    src: excelBusinessAnalytics,
    alt: 'A calculator and pen resting on a page of figures',
    credit: 'Aaron Lefler',
    unsplashId: 'Vs6ip7fsld8',
  },
  'flutter-mobile': {
    src: flutterMobile,
    alt: 'Mobile application interface prototype and Flutter Dart development on a smartphone screen',
    credit: 'Alvaro Reyes',
    unsplashId: 'photo-1551650975-87deedd944c3',
  },
  'freelancing-upwork-fiverr': {
    src: freelancingUpworkFiverr,
    alt: 'A laptop, notebook and phone on a wooden table in a bright, plant-filled room',
    credit: 'Kelly Sikkema',
    unsplashId: '7rq8zzRBWG0',
  },
  'frontend-engineering': {
    src: frontendEngineering,
    alt: 'Frontend engineering workstation with design systems, responsive CSS UI components, and component library',
    credit: 'UX Indonesia',
    unsplashId: 'photo-1581291518857-4e27b48ff24e',
  },
  'full-stack-web': {
    src: fullStackWeb,
    alt: 'Dual monitor workstation with React frontend UI and Node.js backend API architecture',
    credit: 'Cortexis Studio',
  },
  'git-github': {
    src: gitGithub,
    alt: 'Git version control commit branches, pull requests, and code diff history on a laptop',
    credit: 'Cortexis Studio',
  },
  'graphic-design-ps-ai': {
    src: graphicDesignPsAi,
    alt: 'Graphic design studio workspace with brand typography, vector artwork, and creative digital illustration',
    credit: 'Balázs Kétyi',
    unsplashId: 'photo-1626785774573-4b799315345d',
  },
  'java-spring-boot': {
    src: javaSpringBoot,
    alt: 'An engineer developing Java Spring Boot enterprise microservices and REST endpoints on a monitor',
    credit: 'Cortexis Studio',
  },
  'laravel-fundamentals': {
    src: laravelFundamentals,
    alt: 'A developer writing modern web application code at a monitor in a bright studio',
    credit: 'Cortexis Studio',
  },
  'nodejs-backend': {
    src: nodejsBackend,
    alt: 'An engineer writing asynchronous Node.js Express backend APIs and database queries on an ultrawide screen',
    credit: 'Cortexis Studio',
  },
  'power-bi-business-intelligence': {
    src: powerBiBusinessIntelligence,
    alt: 'Printed pie and bar charts on a desk with a calculator and pencil',
    credit: 'Cht Gsml',
    unsplashId: 'dspKrJYp644',
  },
  'python-development': {
    src: pythonDevelopment,
    alt: 'A laptop showing code on a white desk beside a pour-over coffee, in soft daylight',
    credit: 'Artem R',
    unsplashId: 'lYnGCjTCRj4',
  },
  'react-native': {
    src: reactNative,
    alt: 'Cross-platform mobile application development with React Native and native mobile interfaces',
    credit: 'William Hook',
    unsplashId: 'photo-1555774698-0b77e0d5fac6',
  },
  'software-testing-qa': {
    src: softwareTestingQa,
    alt: 'Automated software testing suites, CI/CD pipelines, and health checks on a developer monitor',
    credit: 'Cortexis Studio',
  },
  'sql-data-analysis': {
    src: sqlDataAnalysis,
    alt: 'Relational database analytics, metrics breakdown, and query performance on a studio laptop',
    credit: 'Cortexis Studio',
  },
  'system-design': {
    src: systemDesign,
    alt: 'Full-stack distributed system architecture and database topology on dual monitors',
    credit: 'Cortexis Studio',
  },
  'typescript': {
    src: typescript,
    alt: 'TypeScript code, strict type guards, and component interfaces in a modern code editor',
    credit: 'Cortexis Studio',
  },
  'ui-ux-bootcamp': {
    src: uiUxBootcamp,
    alt: 'Hand-drawn interface sketches in an open notebook with a pen',
    credit: 'Med Badr Chemmaoui',
    unsplashId: 'ZSPBhokqDMc',
  },
  'unity-game-dev': {
    src: unityGameDev,
    alt: 'A white game controller on a light wooden surface',
    credit: 'Oli Woodman',
    unsplashId: '0v0VzQW_oqo',
  },
  'video-editing-short-form': {
    src: videoEditingShortForm,
    alt: 'Professional video editing suite showing multi-track timeline, color grading curves, and short-form video cut',
    credit: 'Jakob Owens',
    unsplashId: 'photo-1574717024653-61fd2cf4d44d',
  },
  'wordpress-development': {
    src: wordpressDevelopment,
    alt: 'Custom WordPress theme development, Gutenberg blocks, and PHP CMS architecture on a monitor',
    credit: 'Hal Gatewood',
    unsplashId: 'photo-1547658719-da2b51169166',
  },
};

// Every photographer credited above, once each, for a credits line.
export const COURSE_COVER_CREDITS = [...new Set(Object.values(COURSE_COVERS).map((c) => c.credit))];

export const courseCover = (slug) => COURSE_COVERS[slug];
