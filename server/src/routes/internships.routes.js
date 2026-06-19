import { Router } from 'express';
import InternshipApplication from '../models/InternshipApplication.model.js';
import { internshipApplicationSchema } from '../validation/schemas.js';


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


const record = await InternshipApplication.create(value);
return res.status(201).json({ message: 'Application received', data: record });
} catch (err) {
console.error('Internship apply error:', err);
return res.status(500).json({ message: 'Internal server error' });
}
});


// GET /api/internships/applications (admin/listing)
router.get('/applications', async (_req, res) => {
const items = await InternshipApplication.find().sort({ createdAt: -1 }).lean();
res.json({ data: items });
});


export default router;