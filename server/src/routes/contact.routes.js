import { Router } from 'express';
import ContactMessage from '../models/ContactMessage.model.js';
import { contactMessageSchema } from '../validation/schemas.js';
import { queueContactEmail } from '../services/queue.service.js';

const router = Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { error, value } = contactMessageSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: 'Validation failed', errors: error.details });
    }

    const saved = await ContactMessage.create(value);
    // Asynchronous BullMQ background queue dispatch (with retry, deduplication & fallback)
    queueContactEmail(value);

    return res.status(201).json({ message: 'Message received', data: saved });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// GET /api/contact/messages (admin/listing)
router.get('/messages', async (_req, res) => {
const items = await ContactMessage.findAll();
res.json({ data: items });
});


export default router;