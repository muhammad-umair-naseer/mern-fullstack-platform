import { Router } from 'express';
import CourseRegistration from '../models/CourseRegistration.model.js';
import InternshipApplication from '../models/InternshipApplication.model.js';
import { courseRegistrationSchema, internshipApplicationSchema } from '../validation/schemas.js';


const router = Router();


// Unified course form route
router.post('/course-form', async (req, res) => {
try {
const { error, value } = courseRegistrationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
if (error) return res.status(400).json({ message: 'Validation failed', errors: error.details });


const record = await CourseRegistration.create(value);
res.status(201).json({ message: 'Course form submitted', data: record });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Internal error' });
}
});


// Unified internship form route
router.post('/internship-form', async (req, res) => {
try {
const { error, value } = internshipApplicationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
if (error) return res.status(400).json({ message: 'Validation failed', errors: error.details });


const record = await InternshipApplication.create(value);
res.status(201).json({ message: 'Internship form submitted', data: record });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Internal error' });
}
});


export default router;