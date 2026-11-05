/**
 * Photography for the learning pages, from Unsplash (free to use under the
 * Unsplash License). Each file is cropped to the 5:4 frame it is shown in and
 * encoded to WebP; the credit travels with the photo so it is shown under it.
 */
import dashboardReading from '../../../assets/features/learning/components/dashboard-reading.webp';
import quizNotebook from '../../../assets/features/learning/components/quiz-notebook.webp';
import examSeal from '../../../assets/features/learning/components/exam-seal.webp';

export const learnPhotos = {
  dashboard: {
    src: dashboardReading,
    alt: 'An open book with a pair of reading glasses resting on it, by a bright window',
    credit: 'Lesli Whitecotton',
  },
  chapterQuiz: {
    src: quizNotebook,
    alt: 'A pencil lying across a blank notebook on a wooden desk',
    credit: 'Jan Kahánek',
  },
  finalExam: {
    src: examSeal,
    alt: 'A brass wax seal stamp standing on a wooden desk beside sealed envelopes',
    credit: 'Raymond Petrik',
  },
};
