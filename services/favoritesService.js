import FavoritesRepository from '../repositories/favoritesRepository.js';
import ProductRepository from '../repositories/productRepository.js';
import ValidationError from '../errors/validationError.js';

const addFavoriteProduct = async (userId, productId) => {
  const product = await ProductRepository.findProductById(productId);

  if (!product)
    throw new ValidationError(['Product not found']);

  await FavoritesRepository.addFavorite(userId, productId);

  return { message: 'Product added to favorites' };
};

const removeFavoriteProduct = async (userId, productId) => {
  const removed = await FavoritesRepository.removeFavorite(userId, productId);

  if (!removed)
    throw new ValidationError(['Favorite not found']);

  return { message: 'Product removed from favorites' };
};

const getUserFavoritesProducts = async (userId, limit = 10, offset = 0) => {
  const { products, count } = await FavoritesRepository.getUserFavorites(userId, limit, offset);

  return {
    products,
    total: count,
    limit,
    offset
  };
};

export { addFavoriteProduct, removeFavoriteProduct, getUserFavoritesProducts };
