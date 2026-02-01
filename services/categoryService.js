import ValidationError from '../errors/validationError.js';
import CategoryRepository from '../repositories/categoryRepository.js';
import { uploadImage } from './storageService.js';
import { createCategorySchema } from '../validators/categoryValidator.js';

const getAllCategories = async () => {
  return CategoryRepository.getAllCategories();
};

const createCategory = async (categoryData, imageFile) => {
  const validatedData = await createCategorySchema.validateAsync(categoryData, {
    abortEarly: false,
    stripUnknown: true
  }).catch(err => {
    if (err.isJoi)
      throw new ValidationError(err.details.map(detail => detail.message));
    throw err;
  });

  let imageUrl;
  if (imageFile) imageUrl = await uploadImage(imageFile, 'categories');

  const newCategoryData = { name: validatedData.name };
  if (imageUrl) newCategoryData.imageUrl = imageUrl;

  return CategoryRepository.createCategory(newCategoryData);
};

export { getAllCategories, createCategory };
