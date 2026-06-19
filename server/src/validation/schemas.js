import Joi from 'joi';


export const courseRegistrationSchema = Joi.object({
name: Joi.string().min(2).max(100).required(),
email: Joi.string().email().required(),
phone: Joi.string().allow('', null),
courseTitle: Joi.string().min(2).max(200).required(),
level: Joi.string().allow('', null),
notes: Joi.string().allow('', null),
});


export const internshipApplicationSchema = Joi.object({
name: Joi.string().min(2).max(100).required(),
email: Joi.string().email().required(),
phone: Joi.string().allow('', null),
internshipTitle: Joi.string().min(2).max(200).required(),
resumeLink: Joi.string().uri().allow('', null),
coverLetter: Joi.string().allow('', null),
});


export const contactMessageSchema = Joi.object({
name: Joi.string().min(2).max(100).required(),
email: Joi.string().email().required(),
phone: Joi.string().allow('', null),
subject: Joi.string().allow('', null),
message: Joi.string().min(5).max(5000).required(),
});