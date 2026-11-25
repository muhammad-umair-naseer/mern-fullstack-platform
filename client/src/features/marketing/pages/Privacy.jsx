import React from 'react';
import LegalPage from './LegalPage.jsx';

const COMPANY = 'Cortexis Solution Hub Pvt Ltd';

const sections = [
  {
    id: 'intro',
    title: 'Introduction',
    blocks: [
      { p: `${COMPANY} (“Cortexis”, “we”, “our”, or “us”) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains what information we collect, how we use it, and the choices you have when you use our website, courses, internship programs, and related services (the “Services”).` },
      { p: 'By using the Services, you consent to the practices described in this policy. If you do not agree, please do not use the Services.' },
    ],
  },
  {
    id: 'data-we-collect',
    title: 'Information We Collect',
    blocks: [
      { p: 'We collect information you provide directly and information gathered automatically as you use the Services.' },
      { h: 'Information you provide' },
      { list: [
        'Contact details: name, email address, and phone number.',
        'Application data: course registrations and internship applications, including education, experience, and any documents you submit.',
        'Messages: the content of inquiries you send through our contact form.',
      ] },
      { h: 'Information collected automatically' },
      { list: [
        'Usage data: pages visited, actions taken, and time spent on the Services.',
        'Device & technical data: browser type, operating system, and general location inferred from your IP address.',
        'Cookies and similar technologies: used to keep the site working and to understand usage.',
      ] },
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    blocks: [
      { p: 'We use your information to operate and improve the Services, including to:' },
      { list: [
        'Process course registrations and internship applications.',
        'Respond to your inquiries and provide support.',
        'Send administrative messages, confirmations, and important updates.',
        'Maintain security, prevent fraud, and enforce our Terms.',
        'Analyze usage to improve our content, programs, and user experience.',
        'Comply with legal and regulatory obligations.',
      ] },
      { note: 'We do not sell your personal data. We use it only for the purposes described in this policy or as otherwise permitted by law.' },
    ],
  },
  {
    id: 'legal-basis',
    title: 'Legal Basis for Processing',
    blocks: [
      { p: 'Where applicable law requires it, we process your personal data on one or more of the following bases:' },
      { list: [
        'Consent: for example, when you submit a form or opt in to communications.',
        'Contract: to deliver a course or program you enrolled in.',
        'Legitimate interests: to secure, maintain, and improve the Services.',
        'Legal obligation: to meet regulatory and record-keeping requirements.',
      ] },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    blocks: [
      { p: 'We use cookies and similar technologies to keep the Services functioning, remember preferences, and measure performance. You can control cookies through your browser settings; disabling some cookies may affect functionality.' },
      { h: 'Advertising cookies (Google AdSense)' },
      { p: 'Some public pages of our website, such as articles, tools and course outlines, may show ads served by Google AdSense. Ads never appear on sign-in, account, lesson or exam pages.' },
      { list: [
        'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.',
        'Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet.',
        <>You can opt out of personalized advertising by visiting <a className="lx-link" href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, or opt out of some third-party vendors’ cookies for personalized advertising at <a className="lx-link" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</>,
        <>Learn how Google uses information from sites that use its services at <a className="lx-link" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.</>,
      ] },
      { p: 'Visitors in the European Economic Area, the United Kingdom and Switzerland are shown a consent message, provided through a Google-certified consent management platform, before any advertising cookies are used. You can choose to accept or decline, and you can change your choice at any time through the privacy options link that message provides.' },
    ],
  },
  {
    id: 'sharing',
    title: 'How We Share Information',
    blocks: [
      { p: 'We share personal data only as needed and never sell it. Recipients may include:' },
      { list: [
        'Service providers: trusted vendors who host our infrastructure, deliver email, or provide analytics, acting on our instructions.',
        'Advertising partners: Google, which serves ads on some public pages and may collect cookie and device data as described under “Cookies & Tracking”.',
        'Program partners: where you apply to a jointly delivered internship or course, and only as necessary for that program.',
        'Legal & safety: authorities when required by law, or to protect the rights, safety, and property of Cortexis, our users, and the public.',
        'Business transfers: in connection with a merger, acquisition, or sale of assets, subject to this policy.',
      ] },
    ],
  },
  {
    id: 'security',
    title: 'Data Security',
    blocks: [
      { p: 'We implement reasonable technical and organizational measures, including encryption in transit, access controls, and network protections, to safeguard your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security, but we work continuously to protect your data.' },
    ],
  },
  {
    id: 'retention',
    title: 'Data Retention',
    blocks: [
      { p: 'We keep personal data only for as long as necessary to fulfill the purposes described in this policy, to comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it.' },
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights & Choices',
    blocks: [
      { p: 'Depending on your location, you may have rights regarding your personal data, including to:' },
      { list: [
        'Access the personal data we hold about you.',
        'Correct inaccurate or incomplete information.',
        'Request deletion of your data, subject to legal limits.',
        'Object to or restrict certain processing.',
        'Withdraw consent at any time where processing is based on consent.',
      ] },
      { p: 'To exercise any of these rights, contact us using the details below. We will respond within a reasonable timeframe and in accordance with applicable law.' },
    ],
  },
  {
    id: 'childrens-privacy',
    title: 'Children’s Privacy',
    blocks: [
      { p: 'The Services are not directed to children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us information, please contact us and we will take appropriate steps to delete it.' },
    ],
  },
  {
    id: 'international',
    title: 'International Transfers',
    blocks: [
      { p: 'We are based in Pakistan and may process and store your information in Pakistan or other countries where our service providers operate. Where required, we apply appropriate safeguards to protect data transferred across borders.' },
    ],
  },
  {
    id: 'changes-contact',
    title: 'Changes & Contact',
    blocks: [
      { p: 'We may update this Privacy Policy from time to time. The “Last updated” date reflects the latest revision, and material changes will be communicated through the Services. Your continued use after changes take effect constitutes acceptance.' },
      { h: 'Contact us' },
      { list: [
        'Email: info@cortexissolutionhub.com',
        'Phone: +92 347-5769500',
        'Address: Pakistan',
      ] },
      
    ],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      kind="privacy"
      seo={{ title: "Privacy Policy", description: "How Cortexis Solution Hub collects, uses and protects your personal data across our website, courses and internship applications.", path: "/privacy" }}
      title={[{ text: 'Privacy ' }, { text: 'Policy', grad: true }]}
      subtitle="How Cortexis Solution Hub collects, uses, and protects your personal information across our website, courses, and programs."
      lastUpdated="November 25, 2026"
      sections={sections}
    />
  );
}
