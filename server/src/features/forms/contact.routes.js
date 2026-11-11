import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import ContactMessage from './ContactMessage.model.js';
import { contactMessageSchema } from '../../validation/schemas.js';
import { queueContactEmail } from '../../services/queue.service.js';

import { requireTurnstile } from '../../middleware/turnstile.js';
const router = Router();

// POST /api/contact
router.post('/', requireTurnstile('contact'), async (req, res) => {
  try {
    const { error, value } = contactMessageSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: 'Validation failed', errors: error.details.map(({ message, path }) => ({ message, path })) });
    }

    const saved = await ContactMessage.create(value);
    // Asynchronous BullMQ background queue dispatch (with retry, deduplication & fallback)
    await queueContactEmail(value).catch(() => console.error('Contact saved; email notification failed'));

    return res.status(201).json({ message: 'Message received', data: saved });
  } catch (err) {
    console.error('Contact error:', err.code || 'internal');
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// GET /api/contact/messages (admin only: names, emails and phones)
router.get('/messages', requireAdmin, (req, res, next) =>
  ContactMessage.findAll({ page: req.query.page }).then((items) => res.json({ data: items }), next)
);


export default router;