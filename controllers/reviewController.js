import ValidationError from '../errors/validationError.js';
import { createReview, getUserReviews } from '../services/reviewService.js';

const createReviewHandler = async (req, res, next) => {
  if (!req.body) throw new ValidationError(['Request body is required']);

  const review = await createReview(req.user.id, req.body);

  res.status(201).json(review);
};

const getUserReviewsHandler = async (req, res, next) => {
  const { userId } = req.params;
  const limit = req.query.limit;
  const offset = req.query.offset;

  const result = await getUserReviews(userId, limit, offset);

  res.status(200).json(result);
};

export { createReviewHandler, getUserReviewsHandler };