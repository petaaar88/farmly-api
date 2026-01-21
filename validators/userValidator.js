import Joi from "joi";

const newUserSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Full name must be a string",
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 3 characters long",
      "string.max": "Full name must be at most 30 characters long",
      "any.required": "Full name is required"
    }),
  city: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "City must be a string",
      "string.min": "City must be at least 2 characters long",
      "string.max": "City must be at most 50 characters long",
      "any.required": "City is required"
    }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-\s()]{6,20}$/)
    .required()
    .messages({
      "string.base": "Phone number must be a string",
      "string.pattern.base": "Phone number format is invalid",
      "any.required": "Phone number is required"
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 5 characters long",
      "string.max": "Password must be at most 30 characters long",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
})
.options({
  abortEarly: false,   
  stripUnknown: true,    
});

export { newUserSchema };
