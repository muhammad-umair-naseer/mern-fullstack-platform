import React from 'react';
import LegalPage from './LegalPage';

const PRODUCT = 'Cortexis Your Bot';
const COMPANY = 'Cortexis Solution Hub Pvt Ltd';
const EMAIL = 'cortexis.solution.hub@gmail.com';

const sections = [
  {
    id: 'acceptance',
    title: 'Agreement to these Terms',
    blocks: [
      { p: `These Terms of Service (“Terms”) are a binding agreement between you and ${COMPANY} (“Cortexis”, “we”, “us”, “our”) governing your access to and use of ${PRODUCT} — our platform, website, dashboard, and API that let a business connect a WhatsApp Business Account and/or an Instagram professional account and deploy an AI assistant to reply to customer messages on those channels (the “Service”).` },
      { p: 'By creating an account, connecting a WhatsApp Business Account or an Instagram professional account, or otherwise using the Service, you agree to these Terms and to our Privacy Policy. If you are using the Service on behalf of a business, you represent that you are authorized to bind that business to these Terms.' },
    ],
  },
  {
    id: 'service',
    title: 'The Service',
    blocks: [
      { p: `${PRODUCT} lets a Business User connect their WhatsApp Business Account and/or their Instagram professional account, configure an AI assistant with instructions and reference materials, and have that assistant automatically respond to messages from their customers (“End Users”) on every connected channel.` },
      { note: 'The Service is provided as software that operates on your behalf. You are the business communicating with your own customers; we provide the tooling and infrastructure that make those automated replies possible.' },
    ],
  },
  {
    id: 'meta-platform-terms',
    title: 'Meta platform terms',
    blocks: [
      { p: 'The Service integrates with the WhatsApp Business Platform and with Instagram Messaging, both operated by Meta Platforms, Inc. (“Meta”). Your use of the Service is additionally subject to Meta’s applicable terms and policies, including the WhatsApp Business Terms of Service, the WhatsApp Business Messaging Policy, the Instagram Platform Policy, the Meta Platform Terms, and the Meta Developer Policies.' },
      { list: [
        'You must comply with all applicable Meta, WhatsApp, and Instagram policies when using the Service.',
        'You represent that you own or are authorized to manage every WhatsApp Business Account and Instagram professional account you connect.',
        'You authorize us to send and receive messages, and manage message templates and webhooks, on behalf of the accounts you connect, solely to provide the Service.',
        'Meta may change, limit, or discontinue access to the WhatsApp Business Platform or Instagram Messaging at any time; where that affects the Service, we are not responsible for the resulting impact.',
      ] },
    ],
  },
  {
    id: 'accounts',
    title: 'Accounts and eligibility',
    blocks: [
      { p: 'You must be at least 18 years old and operating a legitimate business to use the Service. When you register, you agree to provide accurate information and to keep it current.' },
      { p: 'We verify accounts using a one-time passcode (OTP) sent to your phone number. You are responsible for safeguarding access to your account and phone number, and for all activity that occurs under your account. Notify us immediately of any unauthorized use.' },
    ],
  },
  {
    id: 'business-responsibilities',
    title: 'Your responsibilities',
    blocks: [
      { p: 'As a Business User, you are solely responsible for how you use the Service and for your communications with your customers. In particular:' },
      { list: [
        { b: 'Consent & lawful messaging:', t: 'you must obtain any consent required to message your customers and comply with all applicable laws, including anti-spam and data-protection laws.' },
        { b: 'Your assistant’s content:', t: 'you are responsible for the instructions, documents, and configuration you provide, and for the responses your assistant sends as a result.' },
        { b: 'Your customer data:', t: 'you control and are the controller of your customer conversations; you are responsible for honoring your customers’ privacy rights.' },
        { b: 'Accurate representation:', t: 'you must not use the assistant to impersonate others or to mislead your customers about their interacting with an automated system where disclosure is required.' },
      ] },
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    blocks: [
      { p: 'You agree not to use the Service to:' },
      { list: [
        'Send spam, bulk unsolicited messages, or content that violates WhatsApp, Instagram, or Meta policies.',
        'Distribute unlawful, deceptive, harassing, hateful, or infringing content.',
        'Transmit malware, or attempt to gain unauthorized access to our systems or other users’ data.',
        'Violate any applicable law or the rights of any third party.',
        'Reverse engineer, resell, or misuse the Service outside the scope of these Terms.',
      ] },
      { p: 'We may suspend or terminate access for any use we reasonably believe violates these Terms or the Meta, WhatsApp, or Instagram policies, or that harms other users, us, or third parties.' },
    ],
  },
  {
    id: 'plans-fees',
    title: 'Plans, usage limits, and fees',
    blocks: [
      { p: 'The Service may be offered under different plans with associated message volumes, features, and billing cycles. Applicable fees and limits are described at sign-up or in your plan.' },
      { list: [
        'Usage limits (such as message counts) are enforced per plan and may pause processing when exceeded.',
        'Fees, where applicable, are due as specified for your plan and are exclusive of taxes unless stated otherwise.',
        'We may update plans and pricing prospectively; changes do not affect a period you have already paid for.',
      ] },
    ],
  },
  {
    id: 'ai-disclaimer',
    title: 'AI-generated responses',
    blocks: [
      { p: 'Responses are generated automatically by an AI language model based on your configuration and may be inaccurate, incomplete, or unsuitable for a given situation.' },
      { callout: { variant: 'warn', title: 'You remain responsible', text: 'You are responsible for monitoring your assistant and for the messages it sends. Do not rely on the assistant for professional, legal, medical, or financial advice, and put appropriate human oversight in place for sensitive interactions.' } },
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    blocks: [
      { p: `The Service, including its software, design, and content, is owned by or licensed to ${COMPANY} and protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable right to use the Service in accordance with these Terms.` },
      { p: 'You retain ownership of the content you upload and the instructions you configure. You grant us a license to host and process that content solely to provide and improve the Service.' },
    ],
  },
  {
    id: 'third-party',
    title: 'Third-party services',
    blocks: [
      { p: 'The Service depends on third parties — including Meta (WhatsApp Business Platform and Instagram Messaging), AI language-model providers, cloud hosting, and OTP delivery providers. Their availability and terms are outside our control, and we are not responsible for interruptions, changes, or actions of those providers.' },
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    blocks: [
      { p: 'The Service is provided on an “as is” and “as available” basis, without warranties of any kind, whether express or implied, including fitness for a particular purpose and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or that automated responses will meet your requirements.' },
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    blocks: [
      { p: `To the maximum extent permitted by law, ${COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, revenue, business, or goodwill, arising from your use of the Service — including from messages sent by your assistant.` },
      { p: 'Where liability cannot be excluded, our total aggregate liability is limited to the amount you paid us for the Service during the three (3) months preceding the event giving rise to the claim.' },
    ],
  },
  {
    id: 'termination',
    title: 'Suspension and termination',
    blocks: [
      { p: 'You may stop using the Service and disconnect any connected WhatsApp Business Account or Instagram professional account at any time from your dashboard. We may suspend or terminate your access, with or without notice, if you breach these Terms or the Meta, WhatsApp, or Instagram policies, or if we discontinue the Service. On termination, your data is handled as described in our Privacy Policy and Data Deletion page.' },
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing law and changes',
    blocks: [
      { p: 'These Terms are governed by the laws of the Islamic Republic of Pakistan, without regard to conflict-of-law principles, and disputes are subject to the exclusive jurisdiction of the courts of Islamabad.' },
      { p: 'We may update these Terms from time to time. The “Last updated” date reflects the latest revision, and your continued use of the Service after changes take effect constitutes acceptance.' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact us',
    blocks: [
      { p: 'Questions about these Terms can be sent to:' },
      { list: [
        `Email: ${EMAIL}`,
        'Company: Cortexis Solution Hub Pvt Ltd, Islamabad, Pakistan',
      ] },
      
    ],
  },
];

export default function YourBotTerms() {
  return (
    <LegalPage
      kind="terms"
      title={[{ text: 'Terms of ' }, { text: 'Service', grad: true }]}
      subtitle="The terms that govern your use of Cortexis Your Bot and its integrations with the WhatsApp Business Platform and Instagram Messaging."
      lastUpdated="July 7, 2026"
      sections={sections}
      contactHref="/contact"
      crossLink={{ to: '/your-bot/privacy', label: 'Privacy Policy' }}
    />
  );
}
