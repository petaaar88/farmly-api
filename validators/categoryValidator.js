import Joi from 'joi';

const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 100 characters long',
      'any.required': 'Name is required'
    })
}).options({
  abortEarly: false,
  stripUnknown: true
});

export { createCategorySchema };
