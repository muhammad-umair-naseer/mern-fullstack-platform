/**
 * Authentic editorial author profiles for Cortexis Solution Hub.
 * Provides verifiable E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness).
 */

export const AUTHORS = {
  cortexis: {
    id: 'cortexis',
    type: 'Organization',
    name: 'Cortexis Solution Hub',
    displayName: 'Cortexis Solution Hub',
    role: 'Cortexis Insights',
    company: 'Cortexis Solution Hub',
    bio: 'Guides from Cortexis Solution Hub on software development, business automation, and digital technology. This article draws on the linked official sources and clearly identified illustrative examples.',
    expertise: ['Software Development', 'Business Automation', 'Digital Technology'],
    initials: 'CX',
    badgeColor: 'indigo',
  },
  abdullah: {
    id: 'abdullah',
    name: 'Abdullah',
    displayName: 'Abdullah',
    role: 'Lead Full-Stack Architect & AI Systems Specialist',
    company: 'Cortexis Solution Hub',
    bio: 'Lead Full-Stack Architect at Cortexis Solution Hub. Specializes in scalable MERN architectures, Meta Graph API & WhatsApp Cloud automations, local AI agent orchestration, and performant web systems in Pakistan.',
    expertise: ['AI Automations', 'WhatsApp Cloud API', 'MERN Architecture', 'System Design'],
    initials: 'AB',
    badgeColor: 'amber',
  },
  umair: {
    id: 'umair',
    name: 'Umair',
    displayName: 'Umair',
    role: 'Senior Software Engineer & Technical Solutions Lead',
    company: 'Cortexis Solution Hub',
    bio: 'Senior Software Engineer at Cortexis Solution Hub. Focuses on high-performance frontend engineering, interactive real-time browser engines, software pricing models, and tech internship pathways.',
    expertise: ['Frontend Architecture', 'Multiplayer Web Engines', 'Software Budgeting', 'Engineering Careers'],
    initials: 'UM',
    badgeColor: 'indigo',
  },
};

export const getAuthor = (nameOrId) => {
  if (!nameOrId) return AUTHORS.abdullah;
  const key = String(nameOrId).trim().toLowerCase();
  if (key === 'cortexis-editorial') return AUTHORS.cortexis;
  if (key.includes('umair')) return AUTHORS.umair;
  return AUTHORS.abdullah;
};

export default AUTHORS;
