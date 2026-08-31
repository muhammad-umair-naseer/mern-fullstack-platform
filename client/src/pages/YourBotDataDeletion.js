import React from 'react';
import LegalPage from './LegalPage';

const PRODUCT = 'Cortexis Your Bot';
const EMAIL = 'cortexis.solution.hub@gmail.com';

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    blocks: [
      { p: `This page explains how to request deletion of the data associated with your ${PRODUCT} account, including any data obtained through the WhatsApp Business Platform or through Instagram Messaging. We honor deletion requests and process them within 30 days.` },
    ],
  },
  {
    id: 'self-serve',
    title: 'Delete it yourself (fastest)',
    blocks: [
      { p: 'If you have an active account, you can remove your data directly:' },
      { list: [
        'Open your dashboard settings.',
        'Disconnect your WhatsApp Business Account and/or Instagram professional account to revoke our access immediately.',
        'Delete your account to remove your configuration and conversation history.',
      ] },
      { callout: { title: 'Immediate effect', text: 'Disconnecting a WhatsApp Business Account or an Instagram professional account revokes the matching access token right away, so we stop sending or receiving messages on that channel.' } },
    ],
  },
  {
    id: 'request-by-email',
    title: 'Request deletion by email',
    blocks: [
      { p: 'If you can’t access your dashboard, send us a request and we’ll handle it:' },
      { list: [
        { b: 'Email:', t: `send a message to ${EMAIL} with the subject “Data deletion request”.` },
        { b: 'Identify the account:', t: 'include the mobile phone number, the WhatsApp Business number, and/or the Instagram username associated with your account so we can locate it.' },
        { b: 'Verification:', t: 'we verify ownership of the account before deleting anything, to protect your data from unauthorized requests.' },
      ] },
    ],
  },
  {
    id: 'what-gets-deleted',
    title: 'What gets deleted',
    blocks: [
      { p: 'Upon a verified request, we delete or irreversibly anonymize:' },
      { list: [
        'WhatsApp and Instagram access tokens and connection credentials.',
        'Two-step verification PINs and API keys associated with your account.',
        'Assistant configuration and any documents you uploaded.',
        'Conversation history stored for your account.',
        'Your account and profile information.',
      ] },
      { note: 'We may retain a limited subset of records where retention is required to comply with legal obligations, resolve disputes, or enforce our agreements. Retained data is protected and deleted once no longer required.' },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline',
    blocks: [
      { p: 'Verified deletion requests are completed within 30 days. We’ll confirm by email once your data has been deleted.' },
    ],
  },
  {
    id: 'end-users',
    title: 'For End Users',
    blocks: [
      { callout: { variant: 'warn', title: 'Messaged a business that uses our assistant?', text: `If you’ve messaged a business using ${PRODUCT} and want your conversation data deleted, please contact that business directly, they control their own customer conversations. If the business is unable to assist, contact us and we’ll support the request to the extent technically possible.` } },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    blocks: [
      { p: 'For any deletion request or question about this process:' },
      { list: [
        `Email: ${EMAIL}`,
        'Company: Cortexis Solution Hub Pvt Ltd, Islamabad, Pakistan',
      ] },
    ],
  },
];

export default function YourBotDataDeletion() {
  return (
    <LegalPage
      seo={{ title: "WhatsApp Bot Data Deletion", description: "How to request deletion of your data from the Cortexis WhatsApp automation service.", path: "/your-bot/data-deletion", noindex: true }}
      kind="privacy"
      title={[{ text: 'Data ' }, { text: 'Deletion', grad: true }]}
      subtitle="How to delete your Cortexis Your Bot account and the data associated with it, including WhatsApp Business Platform and Instagram Messaging data."
      lastUpdated="July 7, 2026"
      sections={sections}
      contactHref="/contact"
      crossLink={{ to: '/your-bot/privacy', label: 'Privacy Policy' }}
    />
  );
}
