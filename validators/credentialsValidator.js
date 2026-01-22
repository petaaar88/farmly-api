import Joi from "joi";

const credentialsSchema = Joi.object({
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
;

export { credentialsSchema };