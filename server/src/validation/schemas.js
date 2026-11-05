import Joi from 'joi';


export const internshipApplicationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().max(254).email().required(),
  phone: Joi.string().max(40).allow('', null),
  internshipTitle: Joi.string().min(2).max(200).required(),
  resumeLink: Joi.string().uri({ scheme: ['http', 'https'] }).max(2048).allow('', null),
  university: Joi.string().max(200).allow('', null),
  experienceLevel: Joi.string().max(100).allow('', null),
  duration: Joi.string().max(100).allow('', null),
  coverLetter: Joi.string().max(5000).allow('', null),
});


export const contactMessageSchema = Joi.object({
name: Joi.string().min(2).max(100).required(),
email: Joi.string().max(254).email().required(),
phone: Joi.string().max(40).allow('', null),
subject: Joi.string().max(200).allow('', null),
message: Joi.string().min(5).max(5000).required(),
});

export const registerSchema = Joi.object({
name: Joi.string().trim().min(2).max(100).required(),
email: Joi.string().trim().lowercase().max(254).email().required(),
password: Joi.string().min(8).max(72).custom((value, helpers) => Buffer.byteLength(value) <= 72 ? value : helpers.error('string.max', { limit: 72 })).required().messages({
'string.min': 'Password must be at least 8 characters',
}),
});


export const loginSchema = Joi.object({
email: Joi.string().trim().lowercase().max(254).email().required(),
password: Joi.string().max(72).custom((value, helpers) => Buffer.byteLength(value) <= 72 ? value : helpers.error('string.max', { limit: 72 })).required(),
});


export const quizSubmissionSchema = Joi.object({
answers: Joi.array().items(Joi.number().integer().min(-1).max(10)).max(200).min(1).required(),
});


export const verifySchema = Joi.object({
email: Joi.string().trim().lowercase().max(254).email().required(),
code: Joi.string().trim().pattern(/^\d{6}$/).required().messages({
'string.pattern.base': 'Enter the 6-digit code from your email',
}),
});


export const resendSchema = Joi.object({
email: Joi.string().trim().lowercase().max(254).email().required(),
});
