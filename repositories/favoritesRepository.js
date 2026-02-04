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

  static async getUserFavorites(userId, limit = 10, offset = 0) {
    const { count, rows } = await Product.findAndCountAll({
      include: [
        {
          model: User,
          as: 'favoritedBy',
          where: { id: userId },
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullName', 'imageUrl', 'city', 'numberOfReviews', 'overallReview']
        }
      ],
      limit,
      offset,
      distinct: true
    });

    return { products: rows, count };
  }

  static async isProductFavorited(userId, productId) {
    const favorite = await UsersFavorites.findOne({
      where: { userId, productId }
    });
    return favorite !== null;
  }
}

export default FavoritesRepository;
