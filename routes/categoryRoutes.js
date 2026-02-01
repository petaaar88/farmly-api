import express from 'express';
import {
  getAllCategoriesHandler,
  createCategoryHandler
} from '../controllers/categoryController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllCategoriesHandler);
router.post('/', upload.single('image'), createCategoryHandler);

export default router;
