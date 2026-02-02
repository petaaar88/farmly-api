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

const getUserFavoritesProducts = async (userId) => {
  const user = await FavoritesRepository.getUserFavorites(userId);

  if (!user)
    throw new ValidationError(['User not found']);

  return user.favorites;
};

export { addFavoriteProduct, removeFavoriteProduct, getUserFavoritesProducts };
