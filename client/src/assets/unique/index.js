/**
 * Photographs that each appear on one page only. They replace shots that
 * used to be borrowed from another page (the About hero's Faisal Mosque on
 * Contact, the home reel's coffee cups on Contact, Your Bot, FAQ and the tool
 * pages, and so on). All from Unsplash under the Unsplash License, cropped to
 * the frame they fill, lightly warmed and encoded to WebP. `credit` and
 * `unsplashId` are kept as a record only; nothing renders them.
 */
import contactIslamabad from './contact-islamabad.webp';
import contactLetter from './contact-letter.webp';
import yourBotPhone from './yourbot-phone.webp';
import faqJournal from './faq-journal.webp';
import blogNotebook from './blog-notebook.webp';
import coursesLibrary from './courses-library.webp';
import internshipsDesk from './internships-desk.webp';
import academyTeam from './academy-team.webp';
import toolsDesk from './tools-desk.webp';
import toolsMedia from './tools-media.webp';
import signupCafe from './signup-cafe.webp';
import legalPrivacy from './legal-privacy.webp';
import legalBotTerms from './legal-bot-terms.webp';
import legalBotPrivacy from './legal-bot-privacy.webp';
import legalBotDeletion from './legal-bot-deletion.webp';

/** /contact: the "Where we are" plate. */
export const contactCity = {
  src: contactIslamabad, w: 1800, h: 1200,
  alt: 'The Pakistan Monument in Islamabad, with visitors walking beneath its petals',
  credit: 'Mohammad Hassan Mukhtar Ahmad', unsplashId: 'oNRXAEgPPng',
};

/** /contact hero: the letter the message flies to. */
export const contactNote = {
  src: contactLetter, w: 960, h: 1200,
  alt: 'A posted envelope with a red postmark on a pale backdrop',
  credit: 'Valeria Reverdo', unsplashId: 'rKluCY7dPN4',
};

/** /your-bot hero. */
export const yourBotPhoto = {
  src: yourBotPhone, w: 960, h: 1200,
  alt: 'A woman reading a message on her phone at a sunlit cafe window',
  credit: 'Airam Dato-on', unsplashId: '51fofnV_dr4',
};

/** /faq hero. */
export const faqPhoto = {
  src: faqJournal, w: 1600, h: 1066,
  alt: 'A hand writing in an open notebook on a wooden table',
  credit: 'Hannah Olinger', unsplashId: '8eSrC43qdro',
};

/** /blog hero. */
export const blogPhoto = {
  src: blogNotebook, w: 960, h: 1200,
  alt: 'A blank notebook and a pen on a sunlit wooden table',
  credit: 'Kelly Sikkema', unsplashId: '8KTTE5274EQ',
};

/** /courses hero. */
export const coursesPhoto = {
  src: coursesLibrary, w: 1100, h: 1374,
  alt: 'A domed reading room lined with bookshelves and rows of desks',
  credit: 'Nate Watson', unsplashId: 'uKK5AZQN8rE',
};

/** /internships: the "Building" plate. */
export const internshipsDeskPhoto = {
  src: internshipsDesk, w: 1800, h: 1200,
  alt: 'An open laptop and a notebook on a wooden desk in warm evening light',
  credit: 'Jakub Żerdzicki', unsplashId: 's4pBqhLueEc',
};

/** Home page, Academy section: the internships card. */
export const academyTeamPhoto = {
  src: academyTeam, w: 1200, h: 900,
  alt: 'Three women working on laptops around a wooden table, seen from above',
  credit: 'CoWomen', unsplashId: '7Zy2KV76Mts',
};

/** /tools/<slug> hero: the desk behind the file. */
export const toolsDeskPhoto = {
  src: toolsDesk, w: 900, h: 1124,
  alt: 'A tin of coloured pencils and a cup on a white desk',
  credit: 'ergonofis', unsplashId: 'tQtsi2-mgTc',
};

/** /tools/<slug> hero: the sample picture on image and video tools. */
export const toolsMediaPhoto = {
  src: toolsMedia, w: 1600, h: 1066,
  alt: 'A woman holding a warm cup at a marble cafe table',
  credit: 'Rainier Ridao', unsplashId: 'LFGF6SL3Co0',
};

/** /signup. */
export const signupPhoto = {
  src: signupCafe, w: 960, h: 1440,
  alt: 'A woman taking off her glasses at a cafe table in warm light',
  credit: 'Masoud Mostafaei', unsplashId: 'qp7rbYi-iw8',
};

/** Legal pages other than /terms, which keeps assets/legalpage. */
export const legalPhotos = {
  privacy: {
    src: legalPrivacy, w: 960, h: 1200,
    alt: 'The edges of a stack of paper in soft light',
    credit: 'Thomas Kinto', unsplashId: 'yDrOJaxIE6c',
  },
  botTerms: {
    src: legalBotTerms, w: 960, h: 1200,
    alt: 'Papers on a wooden table under a patch of window light',
    credit: 'Aamil', unsplashId: 'sMzn86WVCjk',
  },
  botPrivacy: {
    src: legalBotPrivacy, w: 960, h: 1200,
    alt: 'A tall stack of paper with a softly lit room behind it',
    credit: 'Afonso Vieira', unsplashId: '_oOfR969Zhc',
  },
  botDeletion: {
    src: legalBotDeletion, w: 960, h: 1200,
    alt: 'A blank notebook and two pens on a dark desk',
    credit: 'Kelly Sikkema', unsplashId: 'iiaUVel-cJE',
  },
};
