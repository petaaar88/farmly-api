import ValidationError from '../errors/validationError.js';
import ProductRepository from '../repositories/productRepository.js';
import CategoryRepository from '../repositories/categoryRepository.js';
import { uploadImage } from './storageService.js';
import { createProductSchema } from '../validators/productValidator.js';

const createProduct = async (productData, imageFile, userId) => {
  if (!imageFile) throw new ValidationError('Product image is required');

  const validatedData = await createProductSchema.validateAsync(productData, {
    abortEarly: false,
    stripUnknown: true
  }).catch(err => {
    if (err.isJoi) {
      const errors = err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      throw new ValidationError('Validation failed', errors);
    }
    throw err;
  });

  const category = await CategoryRepository.findCategoryById(validatedData.categoryId);
  if (!category) throw new ValidationError('Category not found');

  const imageUrl = await uploadImage(imageFile);

  const product = await ProductRepository.createProduct({
    name: validatedData.name,
    description: validatedData.description,
    price: validatedData.price,
    categoryId: validatedData.categoryId,
    imageUrl,
    userId
  });

  return ProductRepository.findProductById(product.id);
};

export { createProduct };
