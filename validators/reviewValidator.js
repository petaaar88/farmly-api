import Joi from 'joi';

const createReviewSchema = Joi.object({
  producerId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Producer ID must be a number',
      'number.integer': 'Producer ID must be an integer',
      'number.positive': 'Producer ID must be a positive number',
      'any.required': 'Producer ID is required'
    }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required'
    }),
  comment: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.base': 'Comment must be a string',
      'string.empty': 'Comment is required',
      'string.min': 'Comment must be at least 1 character long',
      'string.max': 'Comment must be at most 2000 characters long',
      'any.required': 'Comment is required'
    })
}).options({
  abortEarly: false,
  stripUnknown: true
});

export { createReviewSchema };