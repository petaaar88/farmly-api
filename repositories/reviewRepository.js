import sequelize from '../config/database.js';
import { Review } from '../models/index.js';

class ReviewRepository {
  static async createReview(reviewData) {
    const review = await Review.create(reviewData);
    return review;
  }

  static async findReviewByChatId(chatId) {
    const review = await Review.findOne({ where: { chatId } });
    return review;
  }

  static async getUserReviewStats(userId) {
    const stats = await Review.findOne({
      where: { targetId: userId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('grade')), 'avg']
      ],
      raw: true
    });

    return {
      count: stats && stats.count ? parseInt(stats.count) : 0,
      avg: stats && stats.avg != null ? parseFloat(stats.avg) : null
    };
  }

  static async getUserReviewsPaginated(userId, limit = 50, offset = 0) {
    const { count, rows } = await Review.findAndCountAll({
      where: { targetId: userId },
      include: [
        {
          model: sequelize.models.User,
          as: 'author',
          attributes: ['id', 'fullName', 'imageUrl', 'overallReview']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      reviews: rows,
      total: count
    };
  }
}

export default ReviewRepository;