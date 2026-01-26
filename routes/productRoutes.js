import express from 'express';
import { createNewProduct } from '../controllers/productController.js';
import { authenticationMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticationMiddleware, upload.single('image'), createNewProduct);

export default router;
