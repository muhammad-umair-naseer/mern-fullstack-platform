import { createRepository } from './repository.js';

export default createRepository('internship_applications', [
  { name: 'name' },
  { name: 'email', lowercase: true },
  { name: 'phone' },
  { name: 'internshipTitle' },
  { name: 'resumeLink' },
  { name: 'coverLetter' },
]);
