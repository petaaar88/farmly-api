import Joi from "joi";

const createChatSchema = Joi.object({
  recipientId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Recipient ID must be a number",
      "number.integer": "Recipient ID must be an integer",
      "number.positive": "Recipient ID must be a positive number",
      "any.required": "Recipient ID is required"
    }),
  productId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Product ID must be a number",
      "number.integer": "Product ID must be an integer",
      "number.positive": "Product ID must be a positive number",
      "any.required": "Product ID is required"
    })
}).options({
  abortEarly: false,
  stripUnknown: true
});

const sendMessageSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      "string.base": "Message content must be a string",
      "string.empty": "Message content is required",
      "string.min": "Message content cannot be empty",
      "string.max": "Message content must be at most 1000 characters",
      "any.required": "Message content is required"
    })
}).options({
  abortEarly: false,
  stripUnknown: true
});

export { createChatSchema, sendMessageSchema };
