import ValidationError from '../errors/validationError.js';
import { createReview } from '../services/reviewService.js';

const createReviewHandler = async (req, res, next) => {
  if (!req.body) throw new ValidationError(['Request body is required']);

  const review = await createReview(req.user.id, req.body);

  res.status(201).json(review);
};

export { createReviewHandler };