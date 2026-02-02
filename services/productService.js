import ValidationError from '../errors/validationError.js';
import AuthorizationError from '../errors/authorizationError.js';
import ProductRepository from '../repositories/productRepository.js';
import CategoryRepository from '../repositories/categoryRepository.js';
import { uploadImage, deleteImage } from './storageService.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

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

const getAllProducts = async (limit, offset, filters = {}) => {
  return ProductRepository.findAllProducts(limit, offset, filters);
};

const getProductsByUserId = async (userId, limit, offset) => {
  return ProductRepository.findProductsByUserId(userId, limit, offset);
};

const getProductById = async (productId) => {
  return ProductRepository.findProductById(productId);
};

const updateProduct = async (productId, updateData, imageFile, userId) => {
  const product = await ProductRepository.findProductById(productId);
  if (!product) throw new ValidationError(['Product not found']);
  if (product.userId !== userId) throw new AuthorizationError('Not authorized');

  const hasUpdateFields = Object.keys(updateData).length > 0;
  if (!hasUpdateFields && !imageFile)
    throw new ValidationError(['At least one field is required']);

  let validatedData = updateData;
  if (hasUpdateFields) {
    validatedData = await updateProductSchema.validateAsync(updateData, {
      abortEarly: false,
      stripUnknown: true
    }).catch(err => {
      if (err.isJoi)
        throw new ValidationError(err.details.map(detail => detail.message));
      throw err;
    });
  }

  if (validatedData.categoryId !== undefined) {
    const category = await CategoryRepository.findCategoryById(validatedData.categoryId);
    if (!category) throw new ValidationError(['Category not found']);
  }

  if (imageFile) {
    const imageUrl = await uploadImage(imageFile);
    validatedData.imageUrl = imageUrl;
  }

  await ProductRepository.updateProduct(productId, validatedData);

  if (imageFile && product.imageUrl) await deleteImage(product.imageUrl);

  return ProductRepository.findProductById(productId);
};

const deleteProduct = async (productId, userId) => {
  const product = await ProductRepository.findProductById(productId);
  if (!product) throw new ValidationError(['Product not found']);
  if (product.userId !== userId) throw new AuthorizationError('Not authorized');

  if (product.imageUrl) await deleteImage(product.imageUrl);

  const deleted = await ProductRepository.deleteProduct(productId);
  if (!deleted) throw new ValidationError(['Product not found']);
};

export {
  createProduct,
  getAllProducts,
  getProductsByUserId,
  getProductById,
  updateProduct,
  deleteProduct
};
