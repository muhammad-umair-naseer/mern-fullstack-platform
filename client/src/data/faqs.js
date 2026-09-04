/**
 * The questions people actually ask, answered honestly.
 *
 * These came out of the keyword research as question shaped searches, so each
 * one is something a real person types. They are grouped by the page the
 * question arises on, and /faq collects all of them.
 *
 * A note on expectations: FAQ structured data no longer produces the expandable
 * answers in Google. That was restricted in 2023 to well known government and
 * health sites. These exist because they answer real questions, capture
 * question shaped searches, and give a visitor the thing that decides whether
 * they contact us. The markup is still correct and still helps a machine
 * understand the page; it just will not draw a rich result.
 *
 * Rule for every answer here: if the honest answer is unflattering, say it
 * anyway. A page that admits a limitation is the reason anyone believes the
 * rest of it.
 */

export const FAQS = [
  // ---------------------------------------------------------------- courses
  {
    page: '/courses',
    q: 'Are the courses genuinely free, or free until the certificate?',
    a: 'Genuinely free, all the way through. There is no fee to enrol, no fee to reach the final exam, and no fee for the certificate. We do not ask for card details at any point. The catch, if you want to call it one, is that you have to actually do the work: every topic ends with a check you must pass before the next one opens.',
  },
  {
    page: '/courses',
    q: 'Is the certificate HEC recognised?',
    a: 'No. We are a software company, not a degree awarding institution, and no private course certificate carries HEC recognition. Anyone telling you otherwise is misleading you. What ours is: proof that you completed a specific twelve chapter syllabus and passed the assessments, with a code an employer can verify.',
  },
  {
    page: '/courses',
    q: 'Will this certificate get me a job?',
    a: 'On its own, no, and nobody should tell you it will. What gets you a job is being able to do the work and showing it. A certificate is evidence that you finished something, which is useful on an empty CV and useful past an HR filter looking for a keyword. Treat it as a starting point, and put the projects you built alongside it.',
  },
  {
    page: '/courses',
    q: 'How would an employer check my certificate is real?',
    a: 'Every certificate carries a unique code and a QR code. Anyone can open the verification page, enter the code, and see the course, the date and the score, without needing an account. If a certificate cannot be checked that way, it is worth very little, ours included.',
  },
  {
    page: '/courses',
    q: 'Do I have to be in Islamabad to take a course?',
    a: 'No. The courses are entirely online and self paced, with no live classes and no timetable. You can be anywhere. The internships are the part with a location.',
  },

  // ------------------------------------------------------------ internships
  {
    page: '/internships',
    q: 'Is the internship paid, and is there any fee?',
    a: 'The internships are unpaid: there is no stipend and no salary, and we would rather you knew that before you rearranged your summer. We also never charge you anything. No application fee, no training fee, no fee for the certificate. If any company asks a student to pay for an internship, that is the moment to walk away.',
  },
  {
    page: '/internships',
    q: 'Can I do a six week internship for my university requirement?',
    a: 'Yes. Six and eight week durations are on the application form because that is what most Pakistani departments mandate. Tell us your department deadline when you apply so the dates on your certificate match what your report needs.',
  },
  {
    page: '/internships',
    q: 'Do you provide a certificate and a letter my department will accept?',
    a: 'Yes, on completion: a certificate stating your role and the exact start and end dates, and a recommendation letter from the person who actually supervised you. Both are free. We will not certify work that did not happen or dates you did not serve, which is the whole reason a certificate is worth submitting.',
  },
  {
    page: '/internships',
    q: 'Can I intern remotely from another city?',
    a: 'Remote and hybrid are both options on the form. Remote works well for some tracks and less well for others, because a lot of what makes an internship useful is the review conversation that happens when someone can look at your screen. Apply and say what you need; we will tell you honestly whether the track suits it.',
  },
  {
    page: '/internships',
    q: 'Do I need experience to apply?',
    a: 'No. These are internships, so no professional experience is expected. What helps far more than a list of adjectives is one thing you have built that somebody can open: a repository, a deployed page, a small project. Even a rough one tells us more than a polished CV with nothing behind it.',
  },

  // ----------------------------------------------------------------- tools
  {
    page: '/tools',
    q: 'Do my files get uploaded or stored on your servers?',
    a: 'No. All tools operate with strict zero data retention. Your files are processed instantly with complete confidentiality and are never stored or transmitted to external servers.',
  },
  {
    page: '/tools',
    q: 'Is there a file size limit?',
    a: 'There are no arbitrary file size caps. The engine uses non-blocking chunked streaming to process large documents and high-resolution media smoothly.',
  },
  {
    page: '/tools',
    q: 'Are these tools completely free to use?',
    a: 'Yes. All active utilities in our suite are 100% free with unlimited usage, zero watermarks, and no mandatory account sign-up required.',
  },
  {
    page: '/tools',
    q: 'Will compressing reduce the quality of my PDF?',
    a: 'Usually yes, slightly, because compression works by re-encoding the images inside the file at a lower quality. Text stays sharp, since text is stored as text and not as pixels. A page of typed text may barely shrink at all, for the same reason.',
  },
  {
    page: '/tools',
    q: 'Does it work on scanned documents?',
    a: 'Scanned documents are exactly where it works best. A scan is a page of images, and images are what compresses, so scanned contracts and forms usually shrink the most. That is also the case where keeping the file on your own device matters most.',
  },
  {
    page: '/tools',
    q: 'Can I reorder individual pages when merging, not just whole files?',
    a: 'Yes. The merger shows every page from every file you add, so you can reorder or interleave individual pages rather than only stacking documents end to end.',
  },

  // --------------------------------------------------------------- services
  {
    page: '/services',
    q: 'What does a project cost?',
    a: 'It depends on scope, and anyone quoting you from a webpage is guessing. As a rough guide for the Pakistani market: a brochure site usually lands between PKR 40,000 and 120,000, a WooCommerce store between 100,000 and 250,000, and a custom web application between 250,000 and 500,000, with the most involved work reaching four to five lakh. Tell us what you need and we will give you a real number.',
  },
  {
    page: '/services',
    q: 'Do you work with clients in Rawalpindi?',
    a: 'Yes. We are based in Islamabad and Rawalpindi is next door, so meeting in person is easy. We also work with clients elsewhere in Pakistan and abroad, where the work happens over calls and shared documents instead.',
  },
  {
    page: '/services',
    q: 'Can you take over a project someone else started?',
    a: 'Often, yes, and it is more common than you would think. We start by reading the code and telling you honestly what we find, because the answer is sometimes that finishing it costs more than rebuilding the part that matters. You get that assessment either way, and you keep it whether or not you hire us.',
  },

  // --------------------------------------------------------------- your bot
  {
    page: '/your-bot',
    q: 'Will WhatsApp ban my business number?',
    a: 'Not for using the official Meta platform, which is what we build on. Numbers get banned for driving the consumer app through unofficial tools, and for sending bulk messages people did not ask for and then block. The platform is not what puts a number at risk; how it is used is.',
  },
  {
    page: '/your-bot',
    q: 'Do I need a WhatsApp Business API account, and can I get one myself?',
    a: 'You need access to the official platform, and yes, you can set it up yourself: the documentation is public and nothing is hidden from you. Most businesses ask us because the setup involves business verification, message templates and a webhook, and the time it takes is worth more to them than the fee. If you would rather do it yourself, we will point you at the right docs.',
  },
  {
    page: '/your-bot',
    q: 'Can you get me the green tick?',
    a: 'Nobody can promise you the green tick, and anyone who does is selling you something they cannot deliver. Meta grants it on brand notability, judged mainly on independent press coverage, not on paying anyone. What we can reliably help with is business verification, which is a document exercise and is what most businesses actually need.',
  },
  {
    page: '/your-bot',
    q: 'Is this software I subscribe to, or something you build for me?',
    a: 'Something we build for you, running on your own platform account. There is no monthly fee to us for the software itself. WhatsApp automation is live today and Instagram support is in development. If your volumes are small, an off the shelf subscription tool may genuinely be cheaper, and we will say so.',
  },
];

/** The FAQs that belong on one page. */
export const faqsFor = (page) => FAQS.filter((f) => f.page === page);

/** Page paths that have questions, in the order the central page lists them. */
export const FAQ_PAGES = [
  { path: '/courses', label: 'Free courses' },
  { path: '/internships', label: 'Internships' },
  { path: '/tools', label: 'Free tools' },
  { path: '/services', label: 'Hiring us' },
  { path: '/your-bot', label: 'WhatsApp and Instagram automation' },
];
