import ValidationError from '../errors/validationError.js';
import ReviewRepository from '../repositories/reviewRepository.js';
import UserRepository from '../repositories/userRepository.js';
import { createReviewSchema } from '../validators/reviewValidator.js';
import { canUserReviewProducer } from './chatService.js';

const createReview = async (authorId, reviewDto) => {
  const validatedData = await createReviewSchema.validateAsync(reviewDto, {
    abortEarly: false,
    stripUnknown: true
  }).catch(err => {
    if (err.isJoi)
      throw new ValidationError(err.details.map(detail => detail.message));
    throw err;
  });

  if (Number(authorId) === Number(validatedData.producerId))
    throw new ValidationError(['Cannot review yourself']);

  const producer = await UserRepository.findUserById(validatedData.producerId);
  if (!producer) throw new ValidationError(['Producer not found']);

  const { canReview, chatId } = await canUserReviewProducer(authorId, validatedData.producerId);
  if (!canReview || !chatId) throw new ValidationError(['Review not allowed']);

  const existingReview = await ReviewRepository.findReviewByChatId(chatId);
  if (existingReview) throw new ValidationError(['Review already submitted for this chat']);

  const review = await ReviewRepository.createReview({
    grade: validatedData.rating,
    content: validatedData.comment,
    targetId: validatedData.producerId,
    authorId,
    chatId
  });

  const stats = await ReviewRepository.getUserReviewStats(validatedData.producerId);
  await UserRepository.updateUser(validatedData.producerId, {
    numberOfReviews: stats.count,
    overallReview: stats.avg
  });

  return {
    id: review.id,
    producerId: validatedData.producerId,
    authorId,
    rating: review.grade,
    comment: review.content,
    chatId: review.chatId,
    createdAt: review.createdAt
  };
};

const getUserReviews = async (userId, limit = 50, offset = 0) => {
  const user = await UserRepository.findUserById(userId);
  if (!user) throw new ValidationError(['User not found']);

  const validatedLimit = Math.min(Math.max(1, parseInt(limit) || 50), 100);
  const validatedOffset = Math.max(0, parseInt(offset) || 0);

  const { reviews, total } = await ReviewRepository.getUserReviewsPaginated(
    userId,
    validatedLimit,
    validatedOffset
  );

  const transformedReviews = reviews.map(review => ({
    id: String(review.id),
    content: review.content,
    user: {
      id: String(review.author.id),
      fullName: review.author.fullName,
      imageUrl: review.author.imageUrl,
      rating: review.grade
    }
  }));

  return {
    reviews: transformedReviews,
    total,
    limit: validatedLimit,
    offset: validatedOffset
  };
};

export { createReview, getUserReviews };