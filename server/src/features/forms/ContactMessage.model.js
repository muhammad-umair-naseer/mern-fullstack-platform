import { createRepository } from '../../models/repository.js';

export default createRepository('contact_messages', [
  { name: 'name' },
  { name: 'email', lowercase: true },
  { name: 'phone' },
  { name: 'subject' },
  { name: 'message' },
  { name: 'handled', type: 'boolean' },
]);
