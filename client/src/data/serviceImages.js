// Artwork per service, kept apart from the data so build scripts running in
// plain Node can import the data without choking on a .webp.
import customSoftwareImg from '../assets/services/custom-software-development.webp';
import aiAutomationImg from '../assets/services/ai-automation.webp';
import saasImg from '../assets/services/saas-platform-development.webp';
import webImg from '../assets/services/web-development.webp';
import mobileImg from '../assets/services/mobile-app-development.webp';
import uiuxImg from '../assets/services/ui-ux-design.webp';
import marketingImg from '../assets/services/digital-marketing.webp';
import ecommerceImg from '../assets/services/ecommerce-solutions.webp';
import pythonImg from '../assets/services/python-development.webp';
import aimlImg from '../assets/services/ai-ml-solutions.webp';
import wordpressImg from '../assets/services/wordpress-development.webp';
import cppImg from '../assets/services/cpp-development.webp';

export const SERVICE_IMAGES = {
  'custom-software-development': customSoftwareImg,
  'ai-automation': aiAutomationImg,
  'saas-platform-development': saasImg,
  'web-development': webImg,
  'mobile-app-development': mobileImg,
  'wordpress-development': wordpressImg,
  'ui-ux-design': uiuxImg,
  'digital-marketing': marketingImg,
  'e-commerce-solutions': ecommerceImg,
  'c-development': cppImg,
  'python-development': pythonImg,
  'ai-ml-solutions': aimlImg,
};

export const serviceImage = (slug) => SERVICE_IMAGES[slug];
