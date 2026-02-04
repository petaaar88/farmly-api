import { addFavoriteProduct, removeFavoriteProduct, getUserFavoritesProducts } from '../services/favoritesService.js';
import { productIdSchema } from '../validators/favoritesValidator.js';
import ValidationError from '../errors/validationError.js';

const addFavoriteHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);

    const { error } = productIdSchema.validate({ productId });
    if (error)
      throw new ValidationError(error.details.map(e => e.message));

    const result = await addFavoriteProduct(req.user.id, productId);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const removeFavoriteHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);

    const { error } = productIdSchema.validate({ productId });
    if (error)
      throw new ValidationError(error.details.map(e => e.message));

    const result = await removeFavoriteProduct(req.user.id, productId);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getPagination = (req) => {
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
  const offset = req.query.offset === undefined ? 0 : parseInt(req.query.offset);

  if (Number.isNaN(limit) || Number.isNaN(offset))
    throw new ValidationError(['Invalid pagination parameters']);
  if (limit < 1 || offset < 0)
    throw new ValidationError(['Limit must be positive and offset must be non-negative']);

  return { limit, offset };
};

const getFavoritesHandler = async (req, res, next) => {
  try {
    const { limit, offset } = getPagination(req);
    const result = await getUserFavoritesProducts(req.user.id, limit, offset);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export { addFavoriteHandler, removeFavoriteHandler, getFavoritesHandler };
