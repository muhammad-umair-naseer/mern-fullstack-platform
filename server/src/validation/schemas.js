import Joi from 'joi';


export const internshipApplicationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  internshipTitle: Joi.string().min(2).max(200).required(),
  resumeLink: Joi.string().allow('', null),
  university: Joi.string().allow('', null),
  experienceLevel: Joi.string().allow('', null),
  duration: Joi.string().allow('', null),
  coverLetter: Joi.string().allow('', null),
});


export const contactMessageSchema = Joi.object({
name: Joi.string().min(2).max(100).required(),
email: Joi.string().email().required(),
phone: Joi.string().allow('', null),
subject: Joi.string().allow('', null),
message: Joi.string().min(5).max(5000).required(),
});

export const registerSchema = Joi.object({
name: Joi.string().trim().min(2).max(100).required(),
email: Joi.string().trim().lowercase().email().required(),
password: Joi.string().min(8).max(200).required().messages({
'string.min': 'Password must be at least 8 characters',
}),
});


export const loginSchema = Joi.object({
email: Joi.string().trim().lowercase().email().required(),
password: Joi.string().required(),
});


export const quizSubmissionSchema = Joi.object({
answers: Joi.array().items(Joi.number().integer().min(-1).max(10)).min(1).required(),
});


export const verifySchema = Joi.object({
email: Joi.string().trim().lowercase().email().required(),
code: Joi.string().trim().pattern(/^\d{6}$/).required().messages({
'string.pattern.base': 'Enter the 6-digit code from your email',
}),
});


export const resendSchema = Joi.object({
email: Joi.string().trim().lowercase().email().required(),
});
