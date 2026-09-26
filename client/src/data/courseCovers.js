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
    alt: 'Brass gears of a pocket watch movement, meshed together',
    credit: 'Laura Ockel',
    unsplashId: 'UQ2Fw_9oApU',
  },
  'ai-engineering': {
    src: aiEngineering,
    alt: 'Soft bands of prism light spilling across a pale surface',
    credit: 'Yawen liao',
    unsplashId: 'z-iivOwk6e0',
  },
  'ai-ml-essentials': {
    src: aiMlEssentials,
    alt: 'Wooden chess pieces mid-game on a board in low window light',
    credit: 'Mireille Raad',
    unsplashId: 'GJv3TkSfajM',
  },
  'ai-tools-for-everyone': {
    src: aiToolsForEveryone,
    alt: 'A woman working on a laptop at a bright kitchen table over breakfast',
    credit: 'Vitaly Gariev',
    unsplashId: 'vZrVIykvyVk',
  },
  'cloud-devops': {
    src: cloudDevops,
    alt: 'A mountain peak rising above a sea of clouds in warm light',
    credit: 'Luke Richardson',
    unsplashId: 'nLqha2mP4ig',
  },
  'cpp-development': {
    src: cppDevelopment,
    alt: 'The brass point of an old beam compass resting on a pale surface in warm light',
    credit: 'Jason Leung',
    unsplashId: 'dLJjK0m80ak',
  },
  'cybersecurity-fundamentals': {
    src: cybersecurityFundamentals,
    alt: 'A gold combination padlock resting on a white keyboard beside bank cards',
    credit: 'Towfiqu barbhuiya',
    unsplashId: 'FnA5pAzqhMM',
  },
  'data-engineering': {
    src: dataEngineering,
    alt: 'Branching pipes carrying glowing bulbs across a warm plaster wall',
    credit: 'Gerrie van der Walt',
    unsplashId: 'm3TYLFI_mDo',
  },
  'data-science-python': {
    src: dataSciencePython,
    alt: 'An antique brass surveying telescope on a polished wooden table',
    credit: 'Magic Fan',
    unsplashId: 'PSK74ybL9b8',
  },
  'data-structures-algorithms': {
    src: dataStructuresAlgorithms,
    alt: 'A wooden abacus with rows of coloured beads on a white table',
    credit: 'Crissy Jarvis',
    unsplashId: 'cHhbULJbPwM',
  },
  'digital-marketing': {
    src: digitalMarketing,
    alt: 'A hand on a phone beside a latte on a wooden cafe table',
    credit: 'Eugene Chystiakov',
    unsplashId: '0Z7G_aaY4Mg',
  },
  'docker-kubernetes': {
    src: dockerKubernetes,
    alt: 'A varnished wooden ship\'s wheel with a brass hub, close up in warm light',
    credit: 'Marvin Radke',
    unsplashId: 'GKqAnfq5MPA',
  },
  'ecommerce-shopify-amazon-va': {
    src: ecommerceShopifyAmazonVa,
    alt: 'A plain cardboard parcel resting in a patch of afternoon sun',
    credit: 'Anastasiya Doicheva',
    unsplashId: '2w-EQD1SkuY',
  },
  'excel-business-analytics': {
    src: excelBusinessAnalytics,
    alt: 'A calculator and pen resting on a page of figures',
    credit: 'Aaron Lefler',
    unsplashId: 'Vs6ip7fsld8',
  },
  'flutter-mobile': {
    src: flutterMobile,
    alt: 'A smartphone with a blank screen lying on light wood',
    credit: 'Vojtech Bruzek',
    unsplashId: 'J82GxqnwKSs',
  },
  'freelancing-upwork-fiverr': {
    src: freelancingUpworkFiverr,
    alt: 'A laptop, notebook and phone on a wooden table in a bright, plant-filled room',
    credit: 'Kelly Sikkema',
    unsplashId: '7rq8zzRBWG0',
  },
  'frontend-engineering': {
    src: frontendEngineering,
    alt: 'A laptop, pen and leather notebook on a woven lounge seat in dappled sunlight',
    credit: 'engin akyurt',
    unsplashId: '1U6Iw2cX-cU',
  },
  'full-stack-web': {
    src: fullStackWeb,
    alt: 'Flat pale stones stacked into a tall cairn on a beach, the sea soft behind',
    credit: 'Iva Rajović',
    unsplashId: 'wstYTyWtGac',
  },
  'git-github': {
    src: gitGithub,
    alt: 'Bare tree branches forking against a pale sky in warm light',
    credit: 'Nastia Petruk',
    unsplashId: 'aiHIXpxxsM8',
  },
  'graphic-design-ps-ai': {
    src: graphicDesignPsAi,
    alt: 'Colour swatch cards fanned into a full colour wheel on white',
    credit: 'Andy Brown',
    unsplashId: '9bC6YPVk0Ts',
  },
  'java-spring-boot': {
    src: javaSpringBoot,
    alt: 'A scoop of roasted coffee beans spilling from a burlap sack',
    credit: 'Sergey Kotenev',
    unsplashId: 'Qx_S2YE5I1o',
  },
  'laravel-fundamentals': {
    src: laravelFundamentals,
    alt: 'A hand saw and curls of wood shavings on a workbench',
    credit: 'Bailey Alexander',
    unsplashId: 'Zw_3GoPXzI4',
  },
  'nodejs-backend': {
    src: nodejsBackend,
    alt: 'A golden honeycomb of clean hexagonal cells',
    credit: 'Ante Hamersmit',
    unsplashId: 'gi1f13S1-64',
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
    alt: 'Hands using a phone on a sunlit stone ledge beside a glass of chai',
    credit: 'Rohit Tandon',
    unsplashId: 'Mkh2La9fEDY',
  },
  'software-testing-qa': {
    src: softwareTestingQa,
    alt: 'A brass-rimmed magnifying glass resting on a worn wooden table',
    credit: 'Alexandr Popadin',
    unsplashId: 'd3KjJHhblTI',
  },
  'sql-data-analysis': {
    src: sqlDataAnalysis,
    alt: 'Rows of wooden card catalogue drawers in a library',
    credit: 'Jan Antonin Kolar',
    unsplashId: 'lRoX0shwjUQ',
  },
  'system-design': {
    src: systemDesign,
    alt: 'Curving cream concrete facades seen from below against the sky',
    credit: 'Kimon Maritz',
    unsplashId: 'mQiZnKwGXW0',
  },
  'typescript': {
    src: typescript,
    alt: 'A pale teal typewriter on a clean white surface',
    credit: 'Luca Onniboni',
    unsplashId: '4v9Kk01mEbY',
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
    alt: 'Examining strips of film through a loupe on a glowing light table',
    credit: 'Hossein Nasr',
    unsplashId: 'pneiKD4wbZI',
  },
  'wordpress-development': {
    src: wordpressDevelopment,
    alt: 'A sunlit home desk with a lamp, a laptop and a glass of matcha',
    credit: 'Dagny Reese',
    unsplashId: 'sTo3IYhYC_c',
  },
};

// Every photographer credited above, once each, for a credits line.
export const COURSE_COVER_CREDITS = [...new Set(Object.values(COURSE_COVERS).map((c) => c.credit))];

export const courseCover = (slug) => COURSE_COVERS[slug];
