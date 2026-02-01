import express from 'express';
import { authenticationMiddleware } from '../middlewares/authMiddleware.js';
import { createReviewHandler } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', authenticationMiddleware, createReviewHandler);

export default router;