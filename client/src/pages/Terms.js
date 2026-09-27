import React from 'react';
import LegalPage from './LegalPage';

const COMPANY = 'Cortexis Solution Hub Pvt Ltd';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    blocks: [
      { p: `Welcome to ${COMPANY} (“Cortexis”, “we”, “our”, or “us”). These Terms & Conditions (“Terms”) govern your access to and use of our website, applications, courses, internship programs, and related services (collectively, the “Services”).` },
      { p: 'By accessing or using the Services: including registering for a course, applying for an internship, or submitting a contact request, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the Services.' },
      { p: 'If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.' },
    ],
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Accounts',
    blocks: [
      { p: 'You must be at least 16 years old (or the age of majority in your jurisdiction) to use the Services. Where a program requires it, minors may participate only with the consent and supervision of a parent or legal guardian.' },
      { h: 'Accurate information' },
      { p: 'When you register for a course, apply for an internship, or contact us, you agree to provide accurate, current, and complete information and to keep it up to date.' },
      { h: 'Account security' },
      { p: 'You are responsible for safeguarding any credentials associated with your use of the Services and for all activity that occurs under them. Notify us immediately of any unauthorized use.' },
    ],
  },
  {
    id: 'services',
    title: 'Our Services',
    blocks: [
      { p: 'Cortexis provides software development and consulting, professional training courses, and internship programs. Specific deliverables, schedules, curricula, and fees are described on the relevant pages of the Services or in a separate written agreement.' },
      { list: [
        'Course Registration: enroll in training programs subject to availability and prerequisites.',
        'Internship Applications: apply to structured internship tracks; selection is at our discretion.',
        'Consulting & Development: engagements are governed by a separate statement of work where applicable.',
        'Contact & Support: submit inquiries through our contact form or listed channels.',
      ] },
      { note: 'We may modify, suspend, or discontinue any part of the Services at any time. Where a change materially affects a paid program you are enrolled in, we will make reasonable efforts to notify you in advance.' },
    ],
  },
  {
    id: 'enrollment',
    title: 'Enrollment, Fees & Payments',
    blocks: [
      { p: 'Certain courses and services require payment of fees. All fees are stated in the applicable currency and are exclusive of taxes unless otherwise noted.' },
      { list: [
        'Fees are due as specified at the time of enrollment or in your engagement agreement.',
        'Seats in a program are confirmed only upon receipt of payment or an approved arrangement.',
        'We may update pricing prospectively; changes do not affect programs you have already paid for.',
      ] },
      { h: 'Refunds' },
      { p: 'Refund eligibility, if any, is described on the relevant program page or agreement. Unless stated otherwise, fees for services already rendered are non-refundable. Requests are reviewed on a case-by-case basis.' },
    ],
  },
  {
    id: 'conduct',
    title: 'Acceptable Use',
    blocks: [
      { p: 'You agree to use the Services lawfully and respectfully. You will not:' },
      { list: [
        'Violate any applicable law, regulation, or third-party right.',
        'Submit false, misleading, or fraudulent information in any form or application.',
        'Attempt to gain unauthorized access to our systems, networks, or data.',
        'Introduce malware, spam, or otherwise disrupt or overburden the Services.',
        'Reproduce, resell, or commercially exploit course materials without written permission.',
        'Harass, abuse, or discriminate against staff, instructors, or other participants.',
      ] },
      { p: 'We may suspend or terminate access for any conduct we reasonably believe violates these Terms or harms other users, us, or third parties.' },
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    blocks: [
      { p: `All content on the Services: including text, graphics, logos, course curricula, software, and design, is owned by or licensed to ${COMPANY} and is protected by intellectual property laws.` },
      { p: 'We grant you a limited, non-exclusive, non-transferable license to access and use the materials solely for your personal, non-commercial learning within the program you are enrolled in. All rights not expressly granted are reserved.' },
      { h: 'Your content' },
      { p: 'When you submit materials to us (for example, application details or project work), you retain ownership but grant us a license to use them as necessary to provide and improve the Services and to operate our programs.' },
    ],
  },
  {
    id: 'thirdparty',
    title: 'Third-Party Links & Tools',
    blocks: [
      { p: 'The Services may reference or link to third-party websites, platforms, or tools that we do not control. We provide these for convenience and are not responsible for their content, policies, or practices. Your use of third-party services is governed by their terms.' },
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    blocks: [
      { p: 'The Services are provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied, including fitness for a particular purpose and non-infringement.' },
      { p: 'While we strive for excellence in our training and internship programs, we do not guarantee any specific outcome, certification result, employment, or business result from participation.' },
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    blocks: [
      { p: `To the maximum extent permitted by law, ${COMPANY} and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, revenue, or goodwill, arising from your use of the Services.` },
      { p: 'Where liability cannot be excluded, our total aggregate liability is limited to the amount you paid to us for the specific service giving rise to the claim during the three (3) months preceding the event.' },
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    blocks: [
      { p: 'You may stop using the Services at any time. We may suspend or terminate your access, with or without notice, if you breach these Terms or if we discontinue a program. Provisions that by their nature should survive termination (including intellectual property, disclaimers, and limitation of liability) will remain in effect.' },
    ],
  },
  {
    id: 'law',
    title: 'Governing Law & Changes',
    blocks: [
      { p: 'These Terms are governed by the laws of the Islamic Republic of Pakistan, without regard to conflict-of-law principles. Disputes will be subject to the exclusive jurisdiction of the courts of Pakistan.' },
      { p: 'We may update these Terms from time to time. The “Last updated” date reflects the latest revision. Material changes will be communicated through the Services. Your continued use after changes take effect constitutes acceptance.' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    blocks: [
      { p: 'Questions about these Terms? We’re here to help.' },
      { list: [
        'Email: cortexis.solution.hub@gmail.com',
        'Phone: +92 347-5769500',
        'Address: Pakistan',
      ] },
      
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      kind="terms"
      seo={{ title: "Terms and Conditions", description: "The agreement governing your use of the Cortexis Solution Hub website, free courses, internships and services.", path: "/terms" }}
      title={[{ text: 'Terms & ' }, { text: 'Conditions', grad: true }]}
      subtitle="The agreement that governs your use of Cortexis Solution Hub’s website, courses, internships, and services. Please read it carefully."
      lastUpdated="July 3, 2026"
      sections={sections}
    />
  );
}
