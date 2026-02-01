import express from 'express';
import {
  createNewProduct,
  getAllProductsHandler,
  updateProductHandler,
  deleteProductHandler
} from '../controllers/productController.js';
import { authenticationMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllProductsHandler);
router.post('/', authenticationMiddleware, upload.single('image'), createNewProduct);
router.patch('/:productId', authenticationMiddleware, upload.single('image'), updateProductHandler);
router.delete('/:productId', authenticationMiddleware, deleteProductHandler);

export default router;
