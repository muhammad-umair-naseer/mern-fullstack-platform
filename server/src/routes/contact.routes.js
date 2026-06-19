import { Router } from 'express';
import ContactMessage from '../models/ContactMessage.model.js';
import { contactMessageSchema } from '../validation/schemas.js';
import { maybeSendContactEmail } from '../services/mailer.js';


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
// Fire-and-forget optional email (non-blocking)
maybeSendContactEmail(value).catch((e) => console.error('mailer error:', e));


return res.status(201).json({ message: 'Message received', data: saved });
} catch (err) {
console.error('Contact error:', err);
return res.status(500).json({ message: 'Internal server error' });
}
});


// GET /api/contact/messages (admin/listing)
router.get('/messages', async (_req, res) => {
const items = await ContactMessage.find().sort({ createdAt: -1 }).lean();
res.json({ data: items });
});


export default router;