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

const getFavoritesHandler = async (req, res, next) => {
  try {
    const favorites = await getUserFavoritesProducts(req.user.id);

    res.json(favorites);
  } catch (err) {
    next(err);
  }
};

export { addFavoriteHandler, removeFavoriteHandler, getFavoritesHandler };
