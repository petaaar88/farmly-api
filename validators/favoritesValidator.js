import Joi from 'joi';

export const productIdSchema = Joi.object({
  productId: Joi.number().integer().positive().required()
});

export const addFavoriteSchema = Joi.object({
  productId: Joi.number().integer().positive().required()
});
