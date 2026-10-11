import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import InternshipApplication from '../models/InternshipApplication.model.js';
import { internshipApplicationSchema } from '../validation/schemas.js';
import { queueInternshipAlert } from '../services/queue.service.js';

const router = Router();

// POST /api/internships/apply
router.post('/apply', async (req, res) => {
  try {
    const { error, value } = internshipApplicationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: 'Validation failed', errors: error.details });
    }

    const record = await InternshipApplication.create({ status: 'pending', ...value });
    // Queue asynchronous alert
    queueInternshipAlert(value);

    return res.status(201).json({ message: 'Application received', data: record });
  } catch (err) {
    console.error('Internship apply error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// GET /api/internships/applications (admin only: names, emails and phones)
router.get('/applications', requireAdmin, (_req, res, next) =>
  InternshipApplication.findAll().then((items) => res.json({ data: items }), next)
);


export default router;