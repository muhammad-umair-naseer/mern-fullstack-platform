import React from 'react';
import LegalPage from './LegalPage';

const PRODUCT = 'Cortexis Your Bot';
const COMPANY = 'Cortexis Solution Hub Pvt Ltd';
const EMAIL = 'cortexis.solution.hub@gmail.com';

const sections = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    blocks: [
      { p: `${COMPANY} (“Cortexis”, “we”, “us”, “our”) operates ${PRODUCT}, a platform that allows businesses to connect their WhatsApp Business Account and/or their Instagram professional account and deploy an AI-powered assistant that responds to their customers’ messages automatically across those channels. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices you have — whether you’re a business using ${PRODUCT} (“Business User”) or a customer messaging a business that uses ${PRODUCT} (“End User”).` },
      { p: 'This policy applies to our website, our dashboard application, our backend API, and our integrations with the WhatsApp Business Platform and with Instagram Messaging, both operated by Meta Platforms, Inc. (“Meta”).' },
    ],
  },
  {
    id: 'info-collect',
    title: 'Information we collect',
    blocks: [
      { p: `We collect different categories of information depending on how you interact with ${PRODUCT}.` },
      { h: 'From Business Users (accounts on our platform)' },
      { table: {
        head: ['Category', 'What’s collected', 'Why'],
        rows: [
          ['Account information', 'Mobile phone number, business name, business type/category', 'To create your account, verify your identity via one-time passcode (OTP), and personalize your assistant'],
          ['WhatsApp connection data', 'WhatsApp Business Account (WABA) ID, business phone number ID, display phone number, access token', 'To send and receive WhatsApp messages on your behalf via the WhatsApp Cloud API'],
          ['Instagram connection data', 'Instagram professional account ID, username, linked Facebook Page ID, access token', 'To send and receive Instagram direct messages on your behalf via Meta’s Instagram Messaging API'],
          ['Configuration data', 'Assistant instructions, greeting messages, language preference, uploaded documents (PDF, Word, Excel, CSV, text files)', 'To personalize how your AI assistant responds to your customers'],
          ['Billing information', 'Selected plan, billing cycle dates', 'To manage subscription plans and usage limits'],
          ['Usage data', 'Message counts, timestamps, feature usage, login activity', 'To enforce plan limits, provide analytics, and improve the service'],
        ],
      } },
      { h: 'From End Users (customers messaging a business that uses the assistant)' },
      { table: {
        head: ['Category', 'What’s collected', 'Why'],
        rows: [
          ['Phone number (WhatsApp)', 'The WhatsApp phone number used to message a business', 'To deliver the assistant’s response to the correct conversation'],
          ['Instagram-scoped ID (Instagram)', 'The Instagram-scoped user ID (IGSID) and public username of the account messaging a business', 'To deliver the assistant’s response to the correct conversation'],
          ['Message content', 'The content of messages sent to and received from the business’s assistant', 'To generate relevant responses and maintain conversation history for the business’s review'],
        ],
      } },
      { p: 'We do not require End Users to create an account, and we do not collect information from End Users beyond what is exchanged in their conversation with a Business User’s assistant.' },
    ],
  },
  {
    id: 'meta-platform-data',
    title: 'How we use Meta platform data',
    blocks: [
      { p: 'A Business User connects each messaging channel themselves, and each connection gives us an access token scoped specifically to the account they authorized. We use those tokens only for the purposes below — never to browse, post, advertise, or read anything outside the connected messaging inbox.' },
      { h: 'WhatsApp Business Platform' },
      { p: 'When a Business User connects their WhatsApp Business Account through Meta’s Embedded Signup flow, we use the resulting token only to:' },
      { list: [
        'Register the business’s phone number for use with the WhatsApp Cloud API',
        'Receive incoming messages sent to the connected number',
        'Send AI-generated responses back to the business’s customers on their behalf',
        `Display conversation history within the Business User’s own ${PRODUCT} dashboard`,
        'Subscribe to webhook notifications for that specific WhatsApp Business Account',
      ] },
      { h: 'Instagram Messaging' },
      { p: 'When a Business User connects their Instagram professional account, we use the resulting token only to:' },
      { list: [
        'Identify the connected Instagram professional account and confirm the Business User controls it',
        'Receive direct messages sent to that account’s inbox via Meta’s messaging webhooks',
        'Send AI-generated replies back to those conversations on the business’s behalf',
        `Display conversation history within the Business User’s own ${PRODUCT} dashboard`,
      ] },
      { p: 'We do not read, collect, or store Instagram content outside the direct-message inbox of a connected account. We do not access follower lists, media, insights, or advertising data, and we do not publish content to any connected account.' },
      { callout: { title: 'Account isolation', text: 'We do not access, message, or take any action on behalf of any WhatsApp Business Account or Instagram professional account other than the ones a Business User explicitly connects and authorizes. Each business’s credentials, conversations, and configuration data are logically isolated from every other business on the platform.' } },
    ],
  },
  {
    id: 'ai-processing',
    title: 'How message content is processed',
    blocks: [
      { p: 'Messages sent to a connected WhatsApp number or Instagram professional account are processed by an AI language model to generate a contextually relevant response. This processing happens automatically and in near real time, using:' },
      { list: [
        'The instructions and personality the Business User has configured for their assistant',
        'Any documents the Business User has uploaded as reference material',
        'Recent conversation history, to maintain context across a conversation',
      ] },
      { p: 'Message content is used solely to generate the assistant’s reply. It is not used to train third-party foundation AI models, and it is not sold, rented, or shared with advertisers or data brokers.' },
    ],
  },
  {
    id: 'legal-basis',
    title: 'Why we process your data',
    blocks: [
      { cards: [
        { icon: '📄', title: 'Contract', text: 'To provide the service you’ve signed up for — operating your AI assistant and the messaging channels you connect.' },
        { icon: '⚖️', title: 'Legitimate interest', text: 'To secure the platform, prevent abuse, enforce plan limits, and improve reliability.' },
        { icon: '✅', title: 'Consent', text: 'Where you’ve explicitly authorized a connection, such as linking your WhatsApp Business Account via Embedded Signup or your Instagram professional account.' },
        { icon: '🧾', title: 'Legal obligation', text: 'Where retention or disclosure is required by applicable law or a valid legal request.' },
      ] },
    ],
  },
  {
    id: 'sharing',
    title: 'When we share information',
    blocks: [
      { p: 'We do not sell personal information. We share data only in the following limited circumstances:' },
      { list: [
        { b: 'With Meta:', t: 'to deliver and receive messages via the WhatsApp Business Platform and Instagram Messaging, as required for the service to function.' },
        { b: 'With infrastructure providers:', t: 'cloud hosting, database, and AI processing providers who process data on our behalf under contractual confidentiality obligations, solely to operate the platform.' },
        { b: 'For legal reasons:', t: 'if required to comply with a subpoena, court order, or other legal process, or to protect the rights, property, or safety of Cortexis, our users, or the public.' },
        { b: 'Business transfers:', t: 'if Cortexis is involved in a merger, acquisition, or sale of assets, data may be transferred as part of that transaction, subject to this policy.' },
      ] },
    ],
  },
  {
    id: 'security',
    title: 'Data storage and security',
    blocks: [
      { list: [
        { b: 'Encryption in transit:', t: 'All connections to our platform use TLS/HTTPS encryption.' },
        { b: 'Encryption at rest:', t: 'Sensitive credentials — including WhatsApp and Instagram access tokens, two-step verification PINs, and API keys — are encrypted before being stored in our database.' },
        { b: 'Access control:', t: 'Each Business User account can only access its own connected WhatsApp and Instagram accounts, conversations, and configuration data. Ownership is verified on every request.' },
        { b: 'Webhook verification:', t: 'Incoming messages from Meta are cryptographically verified to prevent spoofed or forged data from being processed.' },
        { b: 'Rate limiting:', t: 'Authentication and verification endpoints are rate-limited to reduce the risk of automated abuse.' },
      ] },
      { p: 'No method of transmission or storage is 100% secure. While we work to protect your information using industry-standard practices, we cannot guarantee absolute security.' },
    ],
  },
  {
    id: 'retention',
    title: 'Data retention',
    blocks: [
      { p: 'We retain account and conversation data for as long as an account remains active, so Business Users can review past customer interactions and maintain continuity of their assistant’s context. If an account is deleted, associated WhatsApp and Instagram credentials, configuration data, and conversation history are deleted or irreversibly anonymized within 30 days, except where retention is required to comply with legal obligations, resolve disputes, or enforce our agreements.' },
    ],
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    blocks: [
      { p: `We rely on the following categories of third-party infrastructure to operate ${PRODUCT}:` },
      { list: [
        { b: 'Meta platforms —', t: 'the WhatsApp Business Platform and Instagram Messaging, for sending and receiving messages on connected accounts, governed additionally by the WhatsApp Business Messaging Policy, the Instagram Platform Policy, and Meta’s Privacy Policy.' },
        { b: 'AI language model providers —', t: 'to generate assistant responses to customer messages in real time.' },
        { b: 'Cloud hosting and database providers —', t: 'to store account, configuration, and conversation data securely.' },
        { b: 'SMS/OTP delivery providers —', t: 'to deliver one-time passcodes used for account verification.' },
      ] },
      { p: 'Each of these providers is contractually bound to use data only as necessary to provide their service to us, and not for their own independent purposes.' },
    ],
  },
  {
    id: 'rights',
    title: 'Your rights and choices',
    blocks: [
      { cards: [
        { icon: '🔌', title: 'Disconnect anytime', text: `Disconnect any connected WhatsApp Business Account or Instagram professional account from ${PRODUCT} at any time in your dashboard settings.` },
        { icon: '📥', title: 'Access your data', text: 'Request a copy of the data we hold about your account.' },
        { icon: '🗑️', title: 'Request deletion', text: 'Request deletion of your account and associated data, subject to legal retention requirements.' },
        { icon: '✏️', title: 'Correct your data', text: 'Update your business information, assistant configuration, or account details at any time.' },
      ] },
      { p: 'If you are located in the European Economic Area, United Kingdom, or a jurisdiction with similar data protection laws, you may also have the right to restrict or object to certain processing, and to lodge a complaint with your local data protection authority.' },
    ],
  },
  {
    id: 'deletion',
    title: 'Data deletion requests',
    blocks: [
      { p: `To request deletion of your account, connected WhatsApp or Instagram data, or conversation history, email us at ${EMAIL} with the phone number or account associated with your ${PRODUCT} account. We will verify the request and process it within 30 days. See our dedicated Data Deletion page for full instructions.` },
      { callout: { variant: 'warn', title: 'For End Users', text: `If you’ve messaged a business using ${PRODUCT} and want your conversation data deleted, please contact that business directly — they control their own customer conversations. If the business is unable to assist, you may contact us and we will support the request to the extent technically possible.` } },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and analytics',
    blocks: [
      { p: 'Our website and dashboard may use essential cookies required for authentication and session management (for example, to keep you logged in). We do not use third-party advertising cookies or cross-site tracking.' },
    ],
  },
  {
    id: 'international',
    title: 'International data transfers',
    blocks: [
      { p: 'Your information may be processed and stored on servers located outside your country of residence. Where this occurs, we take steps to ensure an adequate level of protection consistent with this Privacy Policy and applicable law.' },
    ],
  },
  {
    id: 'children',
    title: 'Children’s privacy',
    blocks: [
      { p: `${PRODUCT} is intended for use by business owners and is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.` },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    blocks: [
      { p: 'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. Material changes will be reflected by updating the “Last updated” date at the top of this page, and where appropriate, we will provide additional notice.' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact us',
    blocks: [
      { p: 'Questions about this Privacy Policy or how your data is handled can be sent to:' },
      { list: [
        `Email: ${EMAIL}`,
        'Company: Cortexis Solution Hub Pvt Ltd, Islamabad, Pakistan',
      ] },
      
    ],
  },
];

export default function YourBotPrivacy() {
  return (
    <LegalPage
      seo={{ title: "WhatsApp Bot Privacy Policy", description: "How the Cortexis WhatsApp automation service collects, uses and deletes message data.", path: "/your-bot/privacy", noindex: true }}
      kind="privacy"
      title={[{ text: 'Privacy ' }, { text: 'Policy', grad: true }]}
      subtitle="How Cortexis Your Bot collects, uses, and protects your data, including data from the WhatsApp Business Platform and Instagram Messaging."
      lastUpdated="July 7, 2026"
      sections={sections}
      contactHref="/contact"
      crossLink={{ to: '/your-bot/terms', label: 'Terms of Service' }}
    />
  );
}
