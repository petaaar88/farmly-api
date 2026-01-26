import ValidationError from '../errors/validationError.js';
import { createProduct } from '../services/productService.js';

const createNewProduct = async (req, res, next) => {
  if (!req.body) throw new ValidationError('Request body is required');
  

  const productData = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    categoryId: parseInt(req.body.categoryId)
  };

  const product = await createProduct(productData, req.file, req.user.id);

  res.status(201).json(product);
};

export { createNewProduct };
