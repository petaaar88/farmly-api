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

export { createReview };