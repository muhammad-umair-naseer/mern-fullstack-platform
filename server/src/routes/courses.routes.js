import { Router } from 'express';
import CourseRegistration from '../models/CourseRegistration.model.js';
import { courseRegistrationSchema } from '../validation/schemas.js';


const router = Router();


// POST /api/courses/register
router.post('/register', async (req, res) => {
try {
const { error, value } = courseRegistrationSchema.validate(req.body, {
abortEarly: false,
stripUnknown: true,
});
if (error) {
return res.status(400).json({ message: 'Validation failed', errors: error.details });
}


const record = await CourseRegistration.create(value);
return res.status(201).json({ message: 'Registered for course', data: record });
} catch (err) {
console.error('Course register error:', err);
return res.status(500).json({ message: 'Internal server error' });
}
});


// GET /api/courses/registrations (admin/listing)
router.get('/registrations', async (_req, res) => {
const items = await CourseRegistration.find().sort({ createdAt: -1 }).lean();
res.json({ data: items });
});


export default router;