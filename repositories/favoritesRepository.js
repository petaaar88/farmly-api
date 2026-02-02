import { User, Product, UsersFavorites } from '../models/index.js';

class FavoritesRepository {
  static async addFavorite(userId, productId) {
    const favorite = await UsersFavorites.findOrCreate({
      where: { userId, productId }
    });
    return favorite;
  }

  static async removeFavorite(userId, productId) {
    const deletedCount = await UsersFavorites.destroy({
      where: { userId, productId }
    });
    return deletedCount > 0;
  }

  static async getUserFavorites(userId) {
    const user = await User.findByPk(userId, {
      include: [{
        model: Product,
        as: 'favorites',
        include: [
          { model: User, as: 'seller', attributes: ['id', 'fullName', 'imageUrl'] }
        ]
      }]
    });
    return user;
  }

  static async isProductFavorited(userId, productId) {
    const favorite = await UsersFavorites.findOne({
      where: { userId, productId }
    });
    return favorite !== null;
  }
}

export default FavoritesRepository;
